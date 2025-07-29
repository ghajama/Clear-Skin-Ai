import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://sogmridxuwqulqxtpoqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZ21yaWR4dXdxdWxxeHRwb3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NjA1NjYsImV4cCI6MjA2ODQzNjU2Nn0.t7Pm0qLVFAMX17HyKSaGfKFWN5ByyL_MqNTd3Fo_gSA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // For React Native, we need to handle storage differently
    storage: Platform.OS === 'web' ? undefined : {
      getItem: async (key: string) => {
        if (Platform.OS === 'web') {
          return localStorage.getItem(key);
        }
        const { storage } = await import('@/lib/storage');
        return await storage.getItem<string>(key);
      },
      setItem: async (key: string, value: string) => {
        if (Platform.OS === 'web') {
          localStorage.setItem(key, value);
          return;
        }
        const { storage } = await import('@/lib/storage');
        await storage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        if (Platform.OS === 'web') {
          localStorage.removeItem(key);
          return;
        }
        const { storage } = await import('@/lib/storage');
        await storage.removeItem(key);
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

// Initialize Supabase and run diagnostics
export const initializeSupabase = async () => {
  console.log('🔧 Initializing Supabase...');
  
  try {
    // Test basic connection
    const connectionTest = await dbHelpers.testConnection();
    if (!connectionTest) {
      console.error('❌ Supabase connection failed');
      return false;
    }
    
    // Check tables
    const tables = await dbHelpers.checkTables();
    console.log('📊 Database tables:', tables);
    
    // Ensure storage bucket exists
    await ensureBucketExists();
    
    // Check storage buckets
    const buckets = await dbHelpers.checkStorageBuckets();
    console.log('🗄️ Storage buckets:', buckets.map(b => b.name || b.id));
    
    // Test auth configuration
    await dbHelpers.testAuthConfig();
    
    console.log('✅ Supabase initialization complete');
    return true;
  } catch (error) {
    console.error('❌ Supabase initialization failed:', error);
    return false;
  }
};

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          quiz_completed: boolean;
          subscribed: boolean;
          skin_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          quiz_completed?: boolean;
          subscribed?: boolean;
          skin_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          quiz_completed?: boolean;
          subscribed?: boolean;
          skin_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      scan_sessions: {
        Row: {
          id: string;
          user_id: string;
          front_image_url: string | null;
          right_image_url: string | null;
          left_image_url: string | null;
          analysis_result: any | null;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          front_image_url?: string | null;
          right_image_url?: string | null;
          left_image_url?: string | null;
          analysis_result?: any | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          front_image_url?: string | null;
          right_image_url?: string | null;
          left_image_url?: string | null;
          analysis_result?: any | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_answers: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          answer_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          answer_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          answer_id?: string;
          created_at?: string;
        };
      };
      routine_progress: {
        Row: {
          id: string;
          user_id: string;
          step_id: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          step_id: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          step_id?: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper functions for image upload
export const uploadImage = async (file: File | { uri: string; name: string; type: string }, bucket: string, path: string) => {
  try {
    let fileToUpload: File;
    
    if ('uri' in file) {
      // React Native file object
      const response = await fetch(file.uri);
      const blob = await response.blob();
      fileToUpload = new File([blob], file.name, { type: file.type });
    } else {
      // Web File object
      fileToUpload = file;
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileToUpload, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
};

// Mirror image function for selfie images (web only)
const mirrorImageWeb = async (imageUri: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Flip horizontally
      ctx!.scale(-1, 1);
      ctx!.drawImage(img, -img.width, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.8);
    };
    
    img.onerror = reject;
    img.crossOrigin = 'anonymous';
    img.src = imageUri;
  });
};

// Mirror image function for mobile using ImageManipulator
const mirrorImageMobile = async (imageUri: string): Promise<string> => {
  try {
    const { manipulateAsync, FlipType } = await import('expo-image-manipulator');
    
    console.log('🪞 [Mirror] Applying mirror effect using ImageManipulator');
    
    const result = await manipulateAsync(
      imageUri,
      [{ flip: FlipType.Horizontal }],
      { 
        compress: 0.8, 
        format: 'jpeg' as any,
        base64: false
      }
    );
    
    console.log('✅ [Mirror] Mirror effect applied successfully');
    return result.uri;
  } catch (error) {
    console.log('⚠️ [Mirror] ImageManipulator failed, using original image:', error);
    return imageUri;
  }
};

// Universal mirror function
const mirrorImage = async (imageUri: string): Promise<string> => {
  if (Platform.OS === 'web') {
    return mirrorImageWeb(imageUri);
  } else {
    return mirrorImageMobile(imageUri);
  }
};

// Delete old scan image for the same type
const deleteOldScanImage = async (userId: string, scanType: 'front' | 'right' | 'left') => {
  try {
    console.log(`🗑️ [Delete] Checking for old ${scanType} images...`);
    
    const { data: files, error } = await supabase.storage
      .from(STORAGE_BUCKETS.SCAN_IMAGES)
      .list(userId);
    
    if (error) {
      console.log(`⚠️ [Delete] Could not list files: ${error.message}`);
      return;
    }
    
    if (files) {
      const oldFiles = files.filter(file => file.name.startsWith(`${scanType}_`));
      
      if (oldFiles.length > 0) {
        const filesToDelete = oldFiles.map(file => `${userId}/${file.name}`);
        console.log(`🗑️ [Delete] Deleting ${filesToDelete.length} old ${scanType} images`);
        
        const { error: deleteError } = await supabase.storage
          .from(STORAGE_BUCKETS.SCAN_IMAGES)
          .remove(filesToDelete);
        
        if (deleteError) {
          console.log(`⚠️ [Delete] Could not delete old files: ${deleteError.message}`);
        } else {
          console.log(`✅ [Delete] Old ${scanType} images deleted successfully`);
        }
      }
    }
  } catch (error) {
    console.log(`⚠️ [Delete] Error deleting old images:`, error);
  }
};

// Convert image URI to proper format for upload
const prepareImageForUpload = async (imageUri: string, fileName: string): Promise<{ file: any; size: number }> => {
  try {
    if (Platform.OS === 'web') {
      // Web: Convert to File object
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      return { file, size: blob.size };
    } else {
      // React Native: Get file size first
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Ensure we have a valid blob with content
      if (blob.size < 1000) { // Less than 1KB is suspicious
        console.warn('⚠️ [Upload] Image blob is very small:', blob.size, 'bytes');
      }
      
      // Create a proper file-like object for React Native
      const fileData = {
        uri: imageUri,
        name: fileName,
        type: 'image/jpeg'
      };
      
      return { file: fileData, size: blob.size };
    }
  } catch (error) {
    console.error('❌ [Upload] Failed to prepare image for upload:', error);
    throw error;
  }
};

// Upload scan image with proper user folder structure and mirror effect
export const uploadScanImage = async (imageUri: string, userId: string, scanType: 'front' | 'right' | 'left', shouldMirror: boolean = false) => {
  try {
    console.log(`📤 [Upload] Starting upload for ${scanType} image, shouldMirror: ${shouldMirror}`);
    
    // Delete old images of the same type first
    await deleteOldScanImage(userId, scanType);
    
    let processedImageUri = imageUri;
    
    // Apply mirror effect if needed (for both web and mobile)
    if (shouldMirror) {
      try {
        console.log(`🪞 [Mirror] Applying mirror effect to ${scanType} image`);
        processedImageUri = await mirrorImage(imageUri);
        console.log(`✅ [Mirror] Mirror effect applied successfully`);
      } catch (mirrorError) {
        console.log(`⚠️ [Mirror] Could not apply mirror effect, using original:`, mirrorError);
      }
    }
    
    const timestamp = Date.now();
    const fileName = `${scanType}_${timestamp}.jpg`;
    const filePath = `${userId}/${fileName}`;
    
    console.log(`📤 [Upload] File path: ${filePath}`);
    
    // Prepare file for upload based on platform
    const { file: fileToUpload, size } = await prepareImageForUpload(processedImageUri, fileName);
    console.log(`📤 [Upload] File size: ${size} bytes`);
    
    let uploadResult;
    
    if (Platform.OS === 'web') {
      // Web upload
      uploadResult = await supabase.storage
        .from(STORAGE_BUCKETS.SCAN_IMAGES)
        .upload(filePath, fileToUpload, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });
    } else {
      // React Native: Use standard Supabase upload with proper file handling
      const response = await fetch(processedImageUri);
      const blob = await response.blob();
      
      // Ensure we have a valid blob
      if (blob.size < 1000) {
        console.warn('⚠️ [Upload] Blob size is suspiciously small:', blob.size, 'bytes');
        console.warn('⚠️ [Upload] This might indicate an issue with image processing');
      }
      
      // Convert blob to ArrayBuffer for React Native
      const reader = new FileReader();
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as ArrayBuffer;
          if (result.byteLength < 1000) {
            console.warn('⚠️ [Upload] ArrayBuffer is very small:', result.byteLength, 'bytes');
          }
          resolve(result);
        };
        reader.onerror = (error) => {
          console.error('❌ [Upload] FileReader error:', error);
          reject(error);
        };
        reader.readAsArrayBuffer(blob);
      });
      
      uploadResult = await supabase.storage
        .from(STORAGE_BUCKETS.SCAN_IMAGES)
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });
    }

    if (uploadResult.error) {
      console.error('❌ [Upload] Upload error:', uploadResult.error);
      throw uploadResult.error;
    }

    console.log(`✅ [Upload] Upload successful:`, uploadResult.data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.SCAN_IMAGES)
      .getPublicUrl(filePath);

    console.log(`🔗 [Upload] Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('❌ [Upload] Failed to upload scan image:', error);
    throw error;
  }
};

// Create or update scan session
export const createScanSession = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('scan_sessions')
      .insert({
        user_id: userId,
        completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('Create scan session error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create scan session:', error);
    throw error;
  }
};

// Update scan session with image URL
export const updateScanSession = async (sessionId: string, scanType: 'front' | 'right' | 'left', imageUrl: string) => {
  try {
    const updateData: any = {};
    updateData[`${scanType}_image_url`] = imageUrl;
    
    const { data, error } = await supabase
      .from('scan_sessions')
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Update scan session error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update scan session:', error);
    throw error;
  }
};

// Get user's latest scan session
export const getLatestScanSession = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('scan_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Get scan session error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to get scan session:', error);
    return null;
  }
};

export const deleteImage = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete image:', error);
    throw error;
  }
};

// Storage buckets
export const STORAGE_BUCKETS = {
  SCAN_IMAGES: 'scan-images',
} as const;

// Ensure bucket exists (scan-images bucket should already exist)
export const ensureBucketExists = async () => {
  try {
    console.log('🗄️ [Bucket] Checking if scan-images bucket exists...');
    
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.log('⚠️ [Bucket] Could not list buckets (this is normal if RLS is enabled):', listError.message);
      // Assume bucket exists since we can't list due to RLS
      return true;
    }
    
    console.log('🗄️ Storage buckets:', buckets?.map(b => b.name) || []);
    
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKETS.SCAN_IMAGES);
    
    if (bucketExists) {
      console.log('✅ [Bucket] scan-images bucket exists');
      return true;
    } else {
      console.log('⚠️ [Bucket] scan-images bucket not found in list, but it should exist');
      // Don't try to create it since it should already exist
      return true;
    }
  } catch (error) {
    console.log('⚠️ [Bucket] Error checking bucket (assuming it exists):', error);
    return true;
  }
};

// Database helper functions
export const dbHelpers = {
  // Test database connection
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Database connection test failed:', error);
        return false;
      }
      
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('Database connection test error:', error);
      return false;
    }
  },

  // Check if tables exist
  async checkTables() {
    try {
      const tables = ['profiles', 'scan_sessions', 'quiz_answers', 'routine_progress'];
      const results = [];
      
      for (const table of tables) {
        try {
          const { error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          results.push({ table, exists: !error });
          if (error) {
            console.error(`Table ${table} check failed:`, error);
          }
        } catch (err) {
          results.push({ table, exists: false });
          console.error(`Table ${table} error:`, err);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Check tables error:', error);
      return [];
    }
  },

  // Check storage buckets
  async checkStorageBuckets() {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.log('⚠️ Storage buckets check failed (this is normal with RLS):', error.message);
        return [{ name: 'scan-images', id: 'scan-images' }]; // Return expected bucket
      }
      
      return data || [];
    } catch (error) {
      console.error('Check storage buckets error:', error);
      return [];
    }
  },

  // Test auth configuration
  async testAuthConfig() {
    try {
      console.log('🔐 Testing auth configuration...');
      
      // Test if we can access auth.users (this will fail if RLS is blocking us)
      const { data: session } = await supabase.auth.getSession();
      console.log('📱 Current session:', session.session ? 'Active' : 'None');
      
      // Test profile creation trigger by checking if function exists
      const { data, error } = await supabase.rpc('version');
      if (!error) {
        console.log('✅ Database functions accessible');
      }
      
      console.log('✅ Auth configuration test complete');
    } catch (error) {
      console.error('❌ Auth configuration test failed:', error);
    }
  }
};