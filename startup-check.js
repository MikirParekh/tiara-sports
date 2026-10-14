// Startup verification script for Tiara Sports Club
// This helps diagnose deployment issues on SmarterASP.NET

const fs = require('fs');
const path = require('path');

console.log('=== Tiara Sports Club - Startup Check ===');
console.log('Time:', new Date().toISOString());
console.log('Node Version:', process.version);
console.log('Current Directory:', __dirname);
console.log('Working Directory:', process.cwd());

// Check critical files
const criticalFiles = [
  'server-production.js',
  'index.html',
  'package.json',
  'web.config',
  'iisnode.yml'
];

console.log('\n=== File Check ===');
criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (exists) {
    const stats = fs.statSync(filePath);
    console.log(`   Size: ${stats.size} bytes, Modified: ${stats.mtime.toISOString()}`);
  }
});

// Check directories
const criticalDirs = [
  'assets',
  'node_modules',
  'iisnode'
];

console.log('\n=== Directory Check ===');
criticalDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  const exists = fs.existsSync(dirPath);
  console.log(`${exists ? '✅' : '❌'} ${dir}/`);
  if (exists) {
    try {
      const files = fs.readdirSync(dirPath);
      console.log(`   Files: ${files.length}`);
    } catch (err) {
      console.log(`   Error reading: ${err.message}`);
    }
  }
});

// Check environment variables
console.log('\n=== Environment Variables ===');
console.log('PORT:', process.env.PORT || 'not set (will use 8080)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('SMTP_USER:', process.env.SMTP_USER ? '***set***' : 'not set');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***set***' : 'not set');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'not set');

// Check if express is available
console.log('\n=== Module Check ===');
try {
  require('express');
  console.log('✅ express');
} catch (err) {
  console.log('❌ express:', err.message);
}

try {
  require('nodemailer');
  console.log('✅ nodemailer');
} catch (err) {
  console.log('❌ nodemailer:', err.message);
}

try {
  require('dotenv');
  console.log('✅ dotenv');
} catch (err) {
  console.log('❌ dotenv:', err.message);
}

console.log('\n=== Startup Check Complete ===\n');
