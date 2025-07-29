# Configuration Supabase Auth - Guide Simple

## 🚀 Configuration Rapide

### 1. Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **URL du projet** et **clé anon**

### 2. Configuration dans l'app
Ajoutez vos clés dans `app.json` :

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://votre-projet.supabase.co",
      "supabaseAnonKey": "votre-clé-anon-ici"
    }
  }
}
```

### 3. Configuration Supabase Auth

#### A. Désactiver la confirmation email (optionnel)
Dans Supabase Dashboard → Authentication → Settings :
- **Enable email confirmations** : OFF

#### B. Configurer les URL de redirection
Dans Authentication → URL Configuration :
- **Site URL** : `https://rork.com`
- **Redirect URLs** : 
  - `https://rork.com`
  - `exp://localhost:8081`

### 4. Pas de table profile nécessaire
L'auth fonctionne sans table profile. Les données utilisateur sont stockées dans `auth.users`.

## 🔧 Résolution des problèmes

### Erreur "Database error saving new user"
1. Vérifiez que RLS (Row Level Security) n'est pas activé sur des tables inexistantes
2. Supprimez toute trigger ou fonction qui référence une table `profiles`
3. Dans SQL Editor, exécutez :
```sql
-- Supprimer toute référence à la table profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
```

### Erreur "supabaseUrl is required"
1. Vérifiez que vos clés sont dans `app.json` → `extra`
2. Redémarrez le serveur Expo après modification
3. Vérifiez les logs pour confirmer que les clés sont détectées

### Test de l'auth
L'app affiche maintenant des logs détaillés :
- ✅ Configuration détectée
- 🔐 Tentatives de connexion/inscription
- ❌ Erreurs spécifiques avec solutions

## 📱 Utilisation

```typescript
import useAuth from '@/hooks/useAuth';

const { signUp, signIn, signOut, user, loading, error } = useAuth();

// Inscription (firstName et lastName optionnels)
await signUp('email@example.com', 'password123');

// Connexion
await signIn('email@example.com', 'password123');
```

## ✅ Configuration minimale fonctionnelle
- Pas de table profile
- Pas de triggers
- Pas de RLS complexe
- Auth simple avec email/password