import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback, useMemo } from 'react';
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
  const [loading, setLoading] = useState(true);

  // Track upload states to prevent duplicates
  const [uploadingStates, setUploadingStates] = useState<{
    front?: boolean;
    right?: boolean;
    left?: boolean;
  }>({});

  // Memoized daily tip to prevent unnecessary re-renders
  const dailyTip = useMemo(() => {
    return dailyTips[Math.floor(Math.random() * dailyTips.length)];
  }, []);

  // Load user data from Supabase
  const loadUserData = useCallback(async () => {
    if (!user || !session) return;

    try {
      console.log('📊 Loading user data from Supabase...');

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
        console.log('✅ Quiz answers loaded');
      }

      // Load scan sessions
      const { data: scanData } = await supabase
        .from('scan_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (scanData && scanData.length > 0) {
        const latestScan = scanData[0];
        console.log('✅ Latest scan session loaded');

        // Set skin score from analysis result
        if (latestScan.analysis_result) {
          setSkinScore(latestScan.analysis_result);
        }
      }

      // Load routine progress
      const { data: progressData } = await supabase
        .from('routine_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressData) {
        // Update routine steps with progress
        const stepsWithProgress = mockRoutineSteps.map(step => ({
          ...step,
          completed: progressData.some(p => p.step_id === step.id && p.completed)
        }));
        setRoutineSteps(stepsWithProgress);
        console.log('✅ Routine progress loaded');
      } else {
        setRoutineSteps(mockRoutineSteps);
      }

    } catch (error) {
      console.error('Failed to load user data:', error);
      // Fallback to local data
      await loadLocalData();
    }
  }, [user, session]);

  // Load data from local storage
  const loadLocalData = useCallback(async () => {
    try {
      console.log('💾 Loading data from local storage...');

      const storedQuizAnswers = await storage.getItem(STORAGE_KEYS.QUIZ_ANSWERS);
      if (storedQuizAnswers) {
        setQuizAnswers(storedQuizAnswers);
      }

      const storedSkinScore = await storage.getItem(STORAGE_KEYS.SKIN_SCORE);
      if (storedSkinScore) {
        setSkinScore(storedSkinScore);
      }

      const storedRoutineSteps = await storage.getItem(STORAGE_KEYS.ROUTINE_STEPS);
      if (storedRoutineSteps) {
        setRoutineSteps(storedRoutineSteps);
      } else {
        setRoutineSteps(mockRoutineSteps);
      }

      console.log('✅ Local data loaded');
    } catch (error) {
      console.error('Failed to load local data:', error);
      // Set defaults
      setRoutineSteps(mockRoutineSteps);
    }
  }, []);

  // Load data from storage and Supabase on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        // Clean expired sessions first
        await imageCache.cleanExpiredSessions();

        if (user && session) {
          // Sync images from Supabase to local cache first
          await imageCache.syncFromSupabase(user.id);
        }

        // Load scan images from local cache using the new method
        const cachedResults = await imageCache.getAllScanResults();
        if (isMounted) {
          setScanResults(cachedResults);
          console.log('💾 [Skincare] Loaded cached scan results:', Object.keys(cachedResults));
        }

        if (user && session) {
          // Load data from Supabase
          await loadUserData();
        } else {
          // Load from local storage as fallback
          await loadLocalData();
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load skincare data:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user, session, loadUserData, loadLocalData]);



  // Save data to storage and Supabase when it changes
  const saveToSupabase = useCallback(async () => {
    if (!user || !session) return;

    try {
      console.log('💾 Saving data to Supabase...');

      // Save quiz answers using upsert to avoid conflicts
      if (Object.keys(quizAnswers).length > 0) {
        const quizEntries = Object.entries(quizAnswers).map(([questionId, answerId]) => ({
          user_id: user.id,
          question_id: questionId,
          answer_id: answerId,
        }));

        // Use upsert to handle existing records
        const { error: quizError } = await supabase
          .from('quiz_answers')
          .upsert(quizEntries, { onConflict: 'user_id,question_id' });

        if (quizError) {
          console.error('Failed to save quiz answers:', quizError);
        } else {
          console.log('✅ Quiz answers saved to Supabase');
        }
      }

      // Save routine progress
      const completedSteps = routineSteps.filter(step => step.completed);
      if (completedSteps.length > 0) {
        const progressEntries = completedSteps.map(step => ({
          user_id: user.id,
          step_id: step.id,
          completed: true,
          completed_at: new Date().toISOString(),
        }));

        // Upsert routine progress
        const { error: progressError } = await supabase
          .from('routine_progress')
          .upsert(progressEntries, { onConflict: 'user_id,step_id' });

        if (progressError) {
          console.error('Failed to save routine progress:', progressError);
        } else {
          console.log('✅ Routine progress saved to Supabase');
        }
      }

    } catch (error) {
      console.error('Failed to save to Supabase:', error);
    }
  }, [user, session, quizAnswers, routineSteps]);

  // Auto-save data when it changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const saveData = async () => {
      try {
        // Always save to local storage
        await Promise.all([
          storage.setItem(STORAGE_KEYS.QUIZ_ANSWERS, quizAnswers),
          storage.setItem(STORAGE_KEYS.ROUTINE_STEPS, routineSteps),
        ]);

        if (skinScore) {
          await storage.setItem(STORAGE_KEYS.SKIN_SCORE, skinScore);
        }

        // Debounced save to Supabase
        if (user && session) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            saveToSupabase();
          }, 1000); // 1 second debounce
        }
      } catch (error) {
        console.error('Failed to save skincare data:', error);
      }
    };

    if (Object.keys(quizAnswers).length > 0 || routineSteps.length > 0) {
      saveData();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [quizAnswers, skinScore, routineSteps, user, session, saveToSupabase]);



  const saveQuizAnswer = useCallback(async (questionId: string, answerId: string) => {
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
  }, [quizAnswers, user, session]);

  const uploadScanImageToSupabase = useCallback(async (imageUri: string, type: 'front' | 'right' | 'left', shouldMirror: boolean = false) => {
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

    try {
      console.log(`📤 [Skincare] Starting background Supabase upload for ${type}...`);

      // Upload to Supabase storage with mirror effect
      const publicUrl = await uploadScanImage(imageUri, user.id, type, shouldMirror);
      console.log(`✅ [Skincare] Upload successful: ${publicUrl}`);

      // Update scan session in database - use INSERT instead of upsert since user_id is not unique
      const { error } = await supabase
        .from('scan_sessions')
        .insert({
          user_id: user.id,
          [`${type}_image_url`]: publicUrl,
        });

      if (error) {
        console.error(`❌ [Skincare] Failed to update scan session for ${type}:`, error);
      } else {
        console.log(`✅ [Skincare] Scan session updated for ${type}`);

        // Update local state with Supabase URL
        setScanResults(prev => ({
          ...prev,
          [type]: {
            uri: publicUrl,
            shouldMirror,
            timestamp: Date.now()
          }
        }));
      }
    } catch (error) {
      console.error(`❌ [Skincare] Failed to upload ${type} image:`, error);
    } finally {
      setUploadingStates(prev => ({ ...prev, [type]: false }));
    }
  }, [uploadingStates, user, session]);


  const analyzeSkin = useCallback(async () => {
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
  }, [quizAnswers, user, updateUser, session]);

  const completeQuiz = useCallback(() => {
    if (user) {
      updateUser({ quizCompleted: true });
    }
  }, [user, updateUser]);

  const toggleRoutineStep = useCallback(async (stepId: string, completed: boolean) => {
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
  }, [routineSteps, user, session]);

  const resetProgress = useCallback(async () => {
    try {
      await Promise.all([
        storage.removeItem(STORAGE_KEYS.QUIZ_ANSWERS),
        storage.removeItem(STORAGE_KEYS.SKIN_SCORE),
        storage.removeItem(STORAGE_KEYS.ROUTINE_STEPS),
      ]);

      setQuizAnswers({});
      setSkinScore(null);
      setRoutineSteps(mockRoutineSteps);

      if (user) {
        updateUser({
          quizCompleted: false,
          skinScore: undefined,
        });
      }
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  }, [user, updateUser]);

  // Memoized isUploading function to prevent unnecessary re-renders
  const isUploading = useCallback((type: 'front' | 'right' | 'left') => {
    return uploadingStates[type] || false;
  }, [uploadingStates]);

  return {
    quizAnswers,
    scanResults,
    skinScore,
    routineSteps,
    dailyTip,
    loading,
    saveQuizAnswer,
    uploadScanImage: uploadScanImageToSupabase,
    isUploading,
    analyzeSkin,
    completeQuiz,
    toggleRoutineStep,
    resetProgress,
    isQuizCompleted: user?.quizCompleted || false,
    isSubscribed: user?.subscribed || false,
  };
});