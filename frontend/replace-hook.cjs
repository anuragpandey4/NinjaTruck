const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, 'src', 'modules', 'user', 'pages');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.jsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const allFiles = walkSync(PAGES_DIR);
let modifiedCount = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Skip if already using usePersistedLocation
  if (content.includes('usePersistedLocation')) {
    return;
  }

  // Check if it uses useLocation
  if (!content.includes('useLocation')) {
    return;
  }

  // Calculate relative path to hooks
  // file is like: d:\appzeto-projects\taxi\frontend\src\modules\user\pages\ride\Chat.jsx
  // base is src\modules\user\pages
  // we want to go up to src\hooks
  const relativeFromSrc = path.relative(path.join(__dirname, 'src'), file); // e.g. modules\user\pages\ride\Chat.jsx
  const depth = relativeFromSrc.split(path.sep).length - 1; // e.g. 5
  
  const upPath = Array(depth).fill('..').join('/');
  const hookImport = `\nimport { usePersistedLocation } from '${upPath}/hooks/usePersistedLocation';`;

  // Replace useLocation in import { ... useLocation ... } from 'react-router-dom'
  // It could be import { useLocation, useNavigate } or import { useNavigate, useLocation }
  let newContent = content;
  
  // 1. Remove useLocation from react-router-dom imports
  newContent = newContent.replace(/,\s*useLocation\b/g, '');
  newContent = newContent.replace(/\buseLocation\s*,\s*/g, '');
  
  // If the import is just { useLocation }, we'll leave the empty {} but that's unlikely in this codebase (usually useNavigate is there too)
  
  // 2. Add new import below the react-router-dom import
  newContent = newContent.replace(/(import.*['"]react-router-dom['"];?)/, `$1${hookImport}`);

  // 3. Replace hook call
  newContent = newContent.replace(/useLocation\(\)/g, 'usePersistedLocation()');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Successfully updated ${modifiedCount} files.`);
