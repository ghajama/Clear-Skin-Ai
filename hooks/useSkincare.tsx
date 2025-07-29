import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { 
  QuizAnswers, 
  RoutineStep, 
  SkinScore, 
  DailyTip 
} from '@/types';
import { dailyTips, mockRoutineSteps } from '@/constants/mockData';
import { useAuth } from './useAuth';
import { storage, STORAGE_KEYS, imageCache, ScanImage } from '@/lib/storage';
import { supabase, uploadScanImage, STORAGE_BUCKETS } from '@/lib/supabase';
import { skincareService } from '@/services/skincare';

export const [SkincareProvider, useSkincare] = createContextHook(() => {
  const { user, updateUser, session } = useAuth();
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [scanResults, setScanResults] = useState<{
    front?: ScanImage;
    right?: ScanImage;
    left?: ScanImage;
  }>({});
  const [skinScore, setSkinScore] = useState<SkinScore | null>(null);
  const [routineSteps, setRoutineSteps] = useState<RoutineStep[]>([]);
  const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data from storage and Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Clean expired sessions first
        await imageCache.cleanExpiredSessions();
        
        // Load scan images from local cache using the new method
        const cachedResults = await imageCache.getAllScanResults();
        setScanResults(cachedResults);
        
        console.log('💾 [Skincare] Loaded cached scan results:', Object.keys(cachedResults));

        if (user && session) {
          // Load data from Supabase
          await loadUserData();
        } else {
          // Load from local storage as fallback
          await loadLocalData();
        }

        // Set a random daily tip
        const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
        setDailyTip(randomTip);

        setLoading(false);
      } catch (error) {
        console.error('Failed to load skincare data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [user, session]);

  const loadUserData = async () => {
    if (!user || !session) return;

    try {
      // Load quiz answers
      const { data: quizData } = await supabase
        .from('quiz_answers')
        .select('*')
        .eq('user_id', user.id);

      if (quizData) {
        const answers: QuizAnswers = {};
        quizData.forEach(answer => {
          answers[answer.question_id] = answer.answer_id;
        });
        setQuizAnswers(answers);
      }

      // Load routine progress
      const { data: routineData } = await supabase
        .from('routine_progress')
        .select('*')
        .eq('user_id', user.id);

      if (routineData && routineData.length > 0) {
        const updatedSteps = mockRoutineSteps.map(step => {
          const progress = routineData.find(p => p.step_id === step.id);
          return progress ? { ...step, completed: progress.completed } : step;
        });
        setRoutineSteps(updatedSteps);
      } else {
        setRoutineSteps(mockRoutineSteps);
      }

      // Load scan session and images
      const { data: scanSession } = await supabase
        .from('scan_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (scanSession) {
        // Load analysis result
        if (scanSession.analysis_result) {
          setSkinScore(scanSession.analysis_result);
        }
        
        // Load images from Supabase and update local cache
        const supabaseImages: {
          front?: ScanImage;
          right?: ScanImage;
          left?: ScanImage;
        } = {};
        
        if (scanSession.front_image_url) {
          // Get the shouldMirror value from local cache if available
          const cachedFront = await imageCache.getImage('front');
          const shouldMirror = cachedFront?.shouldMirror ?? false; // Default to false if not found
          
          supabaseImages.front = {
            uri: scanSession.front_image_url,
            shouldMirror,
            timestamp: new Date(scanSession.updated_at).getTime()
          };
          await imageCache.updateSession('front', scanSession.front_image_url, shouldMirror);
        }
        
        if (scanSession.right_image_url) {
          const cachedRight = await imageCache.getImage('right');
          const shouldMirror = cachedRight?.shouldMirror ?? false;
          
          supabaseImages.right = {
            uri: scanSession.right_image_url,
            shouldMirror,
            timestamp: new Date(scanSession.updated_at).getTime()
          };
          await imageCache.updateSession('right', scanSession.right_image_url, shouldMirror);
        }
        
        if (scanSession.left_image_url) {
          const cachedLeft = await imageCache.getImage('left');
          const shouldMirror = cachedLeft?.shouldMirror ?? false;
          
          supabaseImages.left = {
            uri: scanSession.left_image_url,
            shouldMirror,
            timestamp: new Date(scanSession.updated_at).getTime()
          };
          await imageCache.updateSession('left', scanSession.left_image_url, shouldMirror);
        }
        
        // Update scan results with Supabase images (they override local cache)
        setScanResults(prev => ({ ...prev, ...supabaseImages }));
        console.log('✅ [Skincare] Loaded images from Supabase:', Object.keys(supabaseImages));
      }
    } catch (error) {
      console.error('Failed to load user data from Supabase:', error);
      await loadLocalData();
    }
  };

  const loadLocalData = async () => {
    try {
      const [
        storedQuizAnswers,
        storedSkinScore,
        storedRoutineSteps,
      ] = await Promise.all([
        storage.getItem<QuizAnswers>(STORAGE_KEYS.QUIZ_ANSWERS),
        storage.getItem<SkinScore>('skinScore'),
        storage.getItem<RoutineStep[]>('routineSteps'),
      ]);

      if (storedQuizAnswers) setQuizAnswers(storedQuizAnswers);
      if (storedSkinScore) setSkinScore(storedSkinScore);
      if (storedRoutineSteps) {
        setRoutineSteps(storedRoutineSteps);
      } else {
        setRoutineSteps(mockRoutineSteps);
      }
    } catch (error) {
      console.error('Failed to load local data:', error);
      setRoutineSteps(mockRoutineSteps);
    }
  };

  // Save data to storage and Supabase when it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        // Always save to local storage
        await Promise.all([
          storage.setItem(STORAGE_KEYS.QUIZ_ANSWERS, quizAnswers),
          storage.setItem('routineSteps', routineSteps),
        ]);

        if (skinScore) {
          await storage.setItem('skinScore', skinScore);
        }

        // Save to Supabase if user is authenticated
        if (user && session) {
          await saveToSupabase();
        }
      } catch (error) {
        console.error('Failed to save skincare data:', error);
      }
    };

    if (Object.keys(quizAnswers).length > 0 || routineSteps.length > 0) {
      saveData();
    }
  }, [quizAnswers, skinScore, routineSteps, user, session]);

  const saveToSupabase = async () => {
    if (!user || !session) return;

    try {
      // Save quiz answers
      if (Object.keys(quizAnswers).length > 0) {
        const quizInserts = Object.entries(quizAnswers).map(([questionId, answerId]) => ({
          user_id: user.id,
          question_id: questionId,
          answer_id: answerId,
        }));

        await supabase
          .from('quiz_answers')
          .upsert(quizInserts, { onConflict: 'user_id,question_id' });
      }

      // Save routine progress
      const routineInserts = routineSteps.map(step => ({
        user_id: user.id,
        step_id: step.id,
        completed: step.completed,
        completed_at: step.completed ? new Date().toISOString() : null,
      }));

      await supabase
        .from('routine_progress')
        .upsert(routineInserts, { onConflict: 'user_id,step_id' });
    } catch (error) {
      console.error('Failed to save to Supabase:', error);
    }
  };

  const saveQuizAnswer = async (questionId: string, answerId: string) => {
    const updatedAnswers = { ...quizAnswers, [questionId]: answerId };
    setQuizAnswers(updatedAnswers);

    // Save immediately to Supabase if authenticated
    if (user && session) {
      try {
        await supabase
          .from('quiz_answers')
          .upsert({
            user_id: user.id,
            question_id: questionId,
            answer_id: answerId,
          }, { onConflict: 'user_id,question_id' });
      } catch (error) {
        console.error('Failed to save quiz answer to Supabase:', error);
      }
    }
  };

  // Track upload states to prevent duplicates
  const [uploadingStates, setUploadingStates] = useState<{
    front?: boolean;
    right?: boolean;
    left?: boolean;
  }>({});

  const uploadScanImageToSupabase = async (imageUri: string, type: 'front' | 'right' | 'left', shouldMirror: boolean = false) => {
    console.log(`📸 [Skincare] Uploading ${type} image, shouldMirror: ${shouldMirror}`);
    
    // Prevent duplicate uploads
    if (uploadingStates[type]) {
      console.log(`⚠️ [Skincare] Upload already in progress for ${type}, skipping`);
      return;
    }
    
    // IMMEDIATELY update UI with the local image for instant feedback
    const localImage = {
      uri: imageUri,
      shouldMirror,
      timestamp: Date.now()
    };
    setScanResults(prev => ({ ...prev, [type]: localImage }));
    
    // Save to local cache
    try {
      await imageCache.updateSession(type, imageUri, shouldMirror);
      console.log(`💾 [Skincare] Image saved locally for ${type}`);
    } catch (localError) {
      console.error(`❌ [Skincare] Failed to save ${type} image locally:`, localError);
    }
    
    if (!user || !session) {
      console.log('📸 [Skincare] No user session, saved locally only');
      return;
    }

    // Start background upload without blocking UI
    setUploadingStates(prev => ({ ...prev, [type]: true }));
    
    // Upload in background
    uploadToSupabaseBackground(imageUri, type, shouldMirror)
      .finally(() => {
        setUploadingStates(prev => ({ ...prev, [type]: false }));
      });
  };

  const uploadToSupabaseBackground = async (imageUri: string, type: 'front' | 'right' | 'left', shouldMirror: boolean) => {
    try {
      console.log(`📤 [Skincare] Starting background Supabase upload for ${type}...`);
      
      // Upload to Supabase storage with mirror effect
      const publicUrl = await uploadScanImage(imageUri, user!.id, type, shouldMirror);
      console.log(`✅ [Skincare] Upload successful: ${publicUrl}`);
      
      // Update or create scan session in database
      const { data: existingSession } = await supabase
        .from('scan_sessions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const updateData = {
        [`${type}_image_url`]: publicUrl,
        updated_at: new Date().toISOString(),
      };

      if (existingSession) {
        console.log(`📝 [Skincare] Updating existing session: ${existingSession.id}`);
        const { error: updateError } = await supabase
          .from('scan_sessions')
          .update(updateData)
          .eq('id', existingSession.id);
          
        if (updateError) {
          console.error(`❌ [Skincare] Failed to update session:`, updateError);
          throw updateError;
        }
      } else {
        console.log('📝 [Skincare] Creating new scan session');
        const { error: insertError } = await supabase
          .from('scan_sessions')
          .insert({
            user_id: user!.id,
            ...updateData,
            completed: false,
          });
          
        if (insertError) {
          console.error(`❌ [Skincare] Failed to create session:`, insertError);
          throw insertError;
        }
      }
      
      console.log(`✅ [Skincare] Database updated for ${type} image`);
      
      // Update local cache with the Supabase URL for persistence
      await imageCache.updateSession(type, publicUrl, shouldMirror);
      
      // Update UI with the Supabase URL (but keep the same visual appearance)
      setScanResults(prev => ({
        ...prev,
        [type]: {
          uri: publicUrl,
          shouldMirror,
          timestamp: Date.now()
        }
      }));
      
    } catch (error) {
      console.error(`❌ [Skincare] Failed to upload ${type} image:`, error);
      // Keep the local image in UI since upload failed
      console.log(`⚠️ [Skincare] Upload failed but image remains visible locally for ${type}`);
    }
  };



  const analyzeSkin = async () => {
    setLoading(true);
    try {
      const result = await skincareService.analyzeSkin(quizAnswers);
      setSkinScore(result);
      
      // Update user profile
      if (user) {
        await updateUser({ 
          skinScore: result,
        });
      }

      // Save analysis result to scan session
      if (user && session) {
        try {
          const { data: existingSession } = await supabase
            .from('scan_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (existingSession) {
            await supabase
              .from('scan_sessions')
              .update({
                analysis_result: result,
                completed: true,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingSession.id);
          }
        } catch (error) {
          console.error('Failed to save analysis result:', error);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Skin analysis failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const completeQuiz = () => {
    if (user) {
      updateUser({ quizCompleted: true });
    }
  };

  const toggleRoutineStep = async (stepId: string, completed: boolean) => {
    const updatedSteps = routineSteps.map(step => 
      step.id === stepId ? { ...step, completed } : step
    );
    setRoutineSteps(updatedSteps);

    // Save to Supabase if authenticated
    if (user && session) {
      try {
        await supabase
          .from('routine_progress')
          .upsert({
            user_id: user.id,
            step_id: stepId,
            completed,
            completed_at: completed ? new Date().toISOString() : null,
          }, { onConflict: 'user_id,step_id' });
      } catch (error) {
        console.error('Failed to save routine progress:', error);
      }
    }
  };

  const resetProgress = async () => {
    try {
      await Promise.all([
        storage.removeItem(STORAGE_KEYS.QUIZ_ANSWERS),
        storage.removeItem('skinScore'),
      ]);
      
      setQuizAnswers({});
      setSkinScore(null);
      
      if (user) {
        updateUser({ 
          quizCompleted: false,
          skinScore: undefined,
        });
      }
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  };

  return {
    quizAnswers,
    scanResults,
    skinScore,
    routineSteps,
    dailyTip,
    loading,
    saveQuizAnswer,
    uploadScanImage: uploadScanImageToSupabase,
    isUploading: (type: 'front' | 'right' | 'left') => uploadingStates[type] || false,
    analyzeSkin,
    completeQuiz,
    toggleRoutineStep,
    resetProgress,
    isQuizCompleted: user?.quizCompleted || false,
    isSubscribed: user?.subscribed || false,
  };
});