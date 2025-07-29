# Supabase Storage Setup Guide

## Configuration du bucket scan-images

### 1. Exécuter le script SQL

Dans votre dashboard Supabase, allez dans l'onglet "SQL Editor" et exécutez le contenu du fichier `supabase-storage-setup.sql`.

### 2. Vérifier la configuration

1. **Vérifier le bucket** :
   - Allez dans Storage > Buckets
   - Vérifiez que le bucket `scan-images` existe
   - Vérifiez qu'il est configuré comme public

2. **Vérifier les politiques RLS** :
   - Allez dans Authentication > Policies
   - Vérifiez que les politiques pour `storage.objects` sont créées

### 3. Structure des dossiers

Les images sont organisées comme suit :
```
scan-images/
├── {user_id}/
│   ├── front_1234567890.jpg
│   ├── right_1234567890.jpg
│   └── left_1234567890.jpg
```

### 4. Fonctionnalités implémentées

✅ **Upload d'images** : Les utilisateurs peuvent uploader leurs images de scan
✅ **Effet miroir** : Les images selfie (front camera) sont automatiquement mirrorées
✅ **Suppression automatique** : Les anciennes images du même type sont supprimées lors d'un nouveau upload
✅ **Persistance** : Les images sont sauvegardées dans Supabase et rechargées automatiquement
✅ **Cache local** : Les images sont également sauvegardées localement pour un accès rapide
✅ **Sécurité** : Chaque utilisateur ne peut accéder qu'à ses propres images

### 5. Gestion des erreurs

Le système gère automatiquement :
- Les erreurs de permissions RLS
- Les erreurs de réseau
- Les images manquantes
- Les buckets non accessibles

### 6. Logs de débogage

Le système produit des logs détaillés pour le débogage :
- `📤 [Upload]` : Logs d'upload
- `🪞 [Mirror]` : Logs d'effet miroir
- `🗑️ [Delete]` : Logs de suppression
- `✅ [Skincare]` : Logs de succès
- `❌ [Skincare]` : Logs d'erreur

### 7. Optimisations

- **Compression** : Les images sont compressées à 80% de qualité
- **Format** : Toutes les images sont converties en JPEG
- **Taille limite** : 10MB par image
- **Cache** : Les images sont mises en cache localement et dans Supabase