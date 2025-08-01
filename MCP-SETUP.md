# Supabase MCP Server Configuration

Ce guide vous explique comment configurer le serveur MCP Supabase pour votre projet Clear-Skin-AI.

## 📋 Prérequis

- Node.js installé sur votre machine
- Un projet Supabase actif
- Un Personal Access Token (PAT) Supabase

## 🚀 Installation rapide

1. **Exécutez le script de configuration :**
   ```bash
   ./setup-mcp.sh
   ```

2. **Créez un Personal Access Token :**
   - Allez sur https://supabase.com/dashboard/account/tokens
   - Créez un nouveau token avec un nom descriptif (ex: "MCP Server")
   - Copiez le token (vous ne pourrez plus le voir après)

3. **Configurez le token :**
   - Ouvrez `mcp-config.json`
   - Remplacez `YOUR_PERSONAL_ACCESS_TOKEN_HERE` par votre token

## 📁 Fichiers de configuration

### `mcp-config.json` (Recommandé)
Configuration utilisant la version publiée du serveur MCP :
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=sogmridxuwqulqxtpoqp"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_PERSONAL_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

### `mcp-config-local.json` (Alternative)
Configuration utilisant le build local :
```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": [
        "/workspaces/Clear-Skin-Ai/supabase-mcp/packages/mcp-server-supabase/dist/transports/stdio.js",
        "--read-only",
        "--project-ref=sogmridxuwqulqxtpoqp"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_PERSONAL_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

## 🔧 Configuration de votre client MCP

### Cursor
1. Ouvrez les paramètres de Cursor
2. Allez dans la section MCP
3. Ajoutez la configuration JSON ci-dessus

### Claude Desktop
1. Localisez le fichier de configuration Claude Desktop
2. Ajoutez la configuration dans la section `mcpServers`

### Autres clients
Consultez la documentation de votre client MCP pour savoir comment ajouter des serveurs.

## 🔒 Sécurité

### Paramètres de sécurité configurés :
- `--read-only` : Limite aux opérations de lecture seule
- `--project-ref` : Limite l'accès à votre projet spécifique

### Recommandations :
- ✅ Utilisez uniquement en développement
- ✅ Vérifiez toujours les appels d'outils avant exécution
- ✅ Gardez votre PAT secret
- ❌ N'utilisez jamais en production

## 🛠️ Outils disponibles

Le serveur MCP Supabase fournit les outils suivants :

### Base de données
- `list_tables` : Liste les tables
- `execute_sql` : Exécute du SQL
- `apply_migration` : Applique des migrations

### Développement
- `get_project_url` : Obtient l'URL du projet
- `get_anon_key` : Obtient la clé anonyme
- `generate_typescript_types` : Génère les types TypeScript

### Documentation
- `search_docs` : Recherche dans la documentation Supabase

### Debug
- `get_logs` : Obtient les logs du projet
- `get_advisors` : Obtient les avis de sécurité

## 🔍 Dépannage

### Erreur "Personal access token required"
- Vérifiez que vous avez créé un PAT sur https://supabase.com/dashboard/account/tokens
- Vérifiez que le token est correctement configuré dans votre fichier JSON

### Erreur "Project not found"
- Vérifiez que le `project-ref` est correct : `sogmridxuwqulqxtpoqp`
- Vérifiez que votre PAT a accès à ce projet

### Le serveur ne démarre pas
- Vérifiez que Node.js est installé : `node -v`
- Vérifiez que npm est installé : `npm -v`
- Essayez d'installer manuellement : `npm install -g @supabase/mcp-server-supabase@latest`

## 📚 Ressources

- [Documentation MCP](https://modelcontextprotocol.io/introduction)
- [Documentation Supabase MCP](https://supabase.com/blog/mcp-server)
- [Repository GitHub](https://github.com/supabase-community/supabase-mcp)

## 🎯 Votre configuration

### Projet Supabase :
- **URL** : https://sogmridxuwqulqxtpoqp.supabase.co
- **Project Ref** : sogmridxuwqulqxtpoqp

### Clés API (déjà configurées) :
- **Anon Key** : Configurée dans `.env.mcp`
- **Service Role Key** : Configurée dans `.env.mcp`

**⚠️ Important :** Vous devez encore créer et configurer votre Personal Access Token pour que le serveur MCP fonctionne.
