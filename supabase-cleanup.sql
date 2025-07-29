-- Script SQL pour nettoyer toutes les références aux profils dans Supabase
-- Exécutez ce script dans l'éditeur SQL de votre dashboard Supabase

-- 1. Supprimer la table profiles si elle existe
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Supprimer les triggers liés aux profils s'ils existent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Supprimer les politiques RLS liées aux profils
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- 4. Nettoyer les autres tables qui pourraient référencer les profils
-- Supprimer les contraintes de clé étrangère vers profiles
ALTER TABLE IF EXISTS public.scan_sessions DROP CONSTRAINT IF EXISTS scan_sessions_user_id_fkey;
ALTER TABLE IF EXISTS public.quiz_answers DROP CONSTRAINT IF EXISTS quiz_answers_user_id_fkey;
ALTER TABLE IF EXISTS public.routine_progress DROP CONSTRAINT IF EXISTS routine_progress_user_id_fkey;

-- 5. Modifier les tables existantes pour utiliser auth.users directement
-- Scan sessions - utiliser auth.users.id directement
ALTER TABLE IF EXISTS public.scan_sessions 
ADD CONSTRAINT scan_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Quiz answers - utiliser auth.users.id directement  
ALTER TABLE IF EXISTS public.quiz_answers 
ADD CONSTRAINT quiz_answers_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Routine progress - utiliser auth.users.id directement
ALTER TABLE IF EXISTS public.routine_progress 
ADD CONSTRAINT routine_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. Activer RLS sur les tables existantes pour la sécurité
ALTER TABLE public.scan_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_progress ENABLE ROW LEVEL SECURITY;

-- 7. Créer des politiques RLS simples pour chaque table
-- Scan sessions policies
CREATE POLICY "Users can view own scan sessions" ON public.scan_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scan sessions" ON public.scan_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scan sessions" ON public.scan_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Quiz answers policies
CREATE POLICY "Users can view own quiz answers" ON public.quiz_answers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz answers" ON public.quiz_answers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz answers" ON public.quiz_answers
    FOR UPDATE USING (auth.uid() = user_id);

-- Routine progress policies
CREATE POLICY "Users can view own routine progress" ON public.routine_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routine progress" ON public.routine_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routine progress" ON public.routine_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- 8. Vérifier que l'authentification est correctement configurée
-- Activer l'inscription publique si nécessaire (à faire via le dashboard)
-- Dashboard > Authentication > Settings > Enable "Allow new users to sign up"

-- 9. Nettoyer les données orphelines s'il y en a
DELETE FROM public.scan_sessions WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.quiz_answers WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.routine_progress WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Script terminé
SELECT 'Nettoyage des profils terminé avec succès!' as message;