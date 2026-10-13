const fs = require('fs');
const path = require('path');

// Copy all files from dist to root
const distDir = path.join(__dirname, 'dist');
const rootDir = __dirname;

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying dist files to root...');
if (fs.existsSync(distDir)) {
  fs.readdirSync(distDir).forEach(item => {
    const srcPath = path.join(distDir, item);
    const destPath = path.join(rootDir, item);
    copyRecursive(srcPath, destPath);
    console.log(`Copied: ${item}`);
  });
  console.log('✅ Files copied successfully!');
} else {
  console.log('⚠️ dist directory not found');
}
