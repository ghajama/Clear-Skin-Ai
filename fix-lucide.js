const fs = require('fs');
const path = require('path');

// Mapping des icônes lucide vers des emojis
const iconMap = {
  'Home': '🏠',
  'Calendar': '📅',
  'BarChart2': '📊',
  'MessageCircle': '💬',
  'Camera': '📷',
  'Send': '📤',
  'CheckCircle': '✅',
  'Zap': '⚡',
  'Brain': '🧠',
  'Sparkles': '✨',
  'Star': '⭐',
  'Droplets': '💧',
  'Sun': '☀️',
  'AlertCircle': '⚠️',
  'TrendingUp': '📈',
  'Target': '🎯',
  'ArrowRight': '➡️',
  'Clock': '⏰',
  'Award': '🏆',
  'AlertTriangle': '⚠️',
  'Activity': '📊',
  'FileText': '📄',
  'Check': '✅',
  'Share2': '📤',
  'Download': '⬇️'
};

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Supprimer les imports lucide
    const importRegex = /import\s*{[^}]*}\s*from\s*["']lucide-react-native["'];?\s*\n?/g;
    if (content.match(importRegex)) {
      content = content.replace(importRegex, '');
      modified = true;
    }

    // Remplacer les utilisations d'icônes
    Object.entries(iconMap).forEach(([iconName, emoji]) => {
      const iconRegex = new RegExp(`<${iconName}[^>]*>`, 'g');
      if (content.match(iconRegex)) {
        content = content.replace(iconRegex, `<Text style={{ fontSize: 20 }}>${emoji}</Text>`);
        modified = true;
      }
    });

    // Ajouter l'import Text si nécessaire
    if (modified && content.includes('<Text') && !content.includes('import { Text }') && !content.includes('import {Text}')) {
      const reactNativeImport = content.match(/import\s*{([^}]*)}\s*from\s*["']react-native["']/);
      if (reactNativeImport) {
        const imports = reactNativeImport[1];
        if (!imports.includes('Text')) {
          content = content.replace(
            /import\s*{([^}]*)}\s*from\s*["']react-native["']/,
            `import { ${imports.trim()}, Text } from "react-native"`
          );
        }
      } else {
        // Ajouter un nouvel import
        content = `import { Text } from "react-native";\n${content}`;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(filePath);
    }
  });
}

// Commencer par le dossier app et components
walkDir('./app');
walkDir('./components');

console.log('Finished fixing lucide imports!');
