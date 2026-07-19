import fs from 'fs';
import path from 'path';

// Regex to match emojis.
// This is a comprehensive range for common emojis.
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2B50}\u{2B06}\u{2190}-\u{2199}\u{200D}\u{FE0F}]/gu;

function cleanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      cleanDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // If file is already handled with lucide icons, be careful not to delete legitimate characters.
      // But emojis shouldn't be needed anywhere.
      if (emojiRegex.test(content)) {
        content = content.replace(emojiRegex, '');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Cleaned emojis from ${fullPath}`);
      }
    }
  }
}

cleanDir(path.join(process.cwd(), 'src'));
