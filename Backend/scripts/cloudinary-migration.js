import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary from env variables
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const FRONTEND_DIR = path.resolve('../frontend');
const ASSETS_DIR = path.join(FRONTEND_DIR, 'src/assets');
const PUBLIC_DIR = path.join(FRONTEND_DIR, 'public');

const IGNORE_DIRS = ['node_modules', 'dist', 'build', '.git'];

// Helper to get all files
const getAllFiles = (dirPath, arrayOfFiles = []) => {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);
  
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
};

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp'];

const runMigration = async () => {
  console.log('Starting Cloudinary Migration...');
  
  // 1. Gather all images
  const allAssets = getAllFiles(ASSETS_DIR).filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()));
  const allPublic = getAllFiles(PUBLIC_DIR).filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()));
  
  const allImages = [...allAssets, ...allPublic];
  console.log(`Found ${allImages.length} images to migrate.`);
  
  const assetMap = {};
  
  // 2. Upload to Cloudinary
  for (const filePath of allImages) {
    const fileName = path.basename(filePath);
    
    // Check if we already uploaded it (for safety if script restarts)
    if (fs.existsSync('asset_map.json')) {
      const existingMap = JSON.parse(fs.readFileSync('asset_map.json'));
      if (existingMap[filePath]) {
        assetMap[filePath] = existingMap[filePath];
        continue;
      }
    }

    console.log(`Uploading ${fileName}...`);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'ninja_truck_assets',
        use_filename: true,
        unique_filename: false,
        overwrite: true
      });
      
      assetMap[filePath] = {
        url: result.secure_url,
        fileName: fileName,
        isPublic: filePath.startsWith(PUBLIC_DIR)
      };
      
      // Save map progress
      fs.writeFileSync('asset_map.json', JSON.stringify(assetMap, null, 2));
    } catch (err) {
      console.error(`Failed to upload ${fileName}:`, err.message);
    }
  }
  
  console.log('Upload complete. Asset map saved.');
  
  // 3. Refactor React Code
  console.log('Refactoring React code...');
  const jsxFiles = getAllFiles(path.join(FRONTEND_DIR, 'src')).filter(f => f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.css'));
  
  for (const jsxFile of jsxFiles) {
    let content = fs.readFileSync(jsxFile, 'utf-8');
    let changed = false;
    
    for (const [filePath, data] of Object.entries(assetMap)) {
      const url = data.url;
      const fileName = data.fileName;
      
      if (data.isPublic) {
        // e.g. src="/Rydon24.png" or src="Rydon24.png"
        // Replace exact public paths
        const publicRegex1 = new RegExp(`['"]/${fileName}['"]`, 'g');
        if (publicRegex1.test(content)) {
          content = content.replace(publicRegex1, `'${url}'`);
          changed = true;
        }
        
        // Sometimes in JSX it's just literally <img src="fileName.png" />
        const publicRegex2 = new RegExp(`src=['"]${fileName}['"]`, 'g');
        if (publicRegex2.test(content)) {
          content = content.replace(publicRegex2, `src="${url}"`);
          changed = true;
        }
      } else {
        // It's in assets, so it was likely imported.
        // E.g., import myIcon from '../../assets/icon.png';
        // We want to replace the whole import statement with: const myIcon = "URL";
        // Let's find the import statement that ends with this filename.
        // Regex to match: import variableName from '...fileName';
        const importRegex = new RegExp(`import\\s+([a-zA-Z0-9_]+)\\s+from\\s+['"][^'"]*${fileName}['"];?`, 'g');
        
        if (importRegex.test(content)) {
          content = content.replace(importRegex, `const $1 = "${url}";`);
          changed = true;
        }
        
        // Also check for CSS url(...)
        const cssRegex = new RegExp(`url\\(['"]?[^'")]*${fileName}['"]?\\)`, 'g');
        if (cssRegex.test(content)) {
          content = content.replace(cssRegex, `url('${url}')`);
          changed = true;
        }
      }
    }
    
    if (changed) {
      fs.writeFileSync(jsxFile, content, 'utf-8');
      console.log(`Updated imports in ${path.relative(FRONTEND_DIR, jsxFile)}`);
    }
  }
  
  console.log('Refactoring complete.');
  
  // 4. Cleanup local files
  console.log('Deleting local image files...');
  for (const filePath of Object.keys(assetMap)) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted ${path.basename(filePath)}`);
    }
  }
  
  console.log('Migration finished successfully!');
};

runMigration().catch(console.error);
