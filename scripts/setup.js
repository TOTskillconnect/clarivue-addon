#!/usr/bin/env node

/**
 * Setup script for Clarivue Addon
 * This script helps set up the development environment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Clarivue Addon...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  const envTemplate = `# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here

# Platform Configuration
REACT_APP_ZOOM_SDK_KEY=your_zoom_sdk_key_here
REACT_APP_TEAMS_APP_ID=your_teams_app_id_here
REACT_APP_MEET_ADDON_ID=your_meet_addon_id_here

# Development
REACT_APP_ENV=development
REACT_APP_DEBUG=true
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file');
} else {
  console.log('ℹ️  .env file already exists');
}

// Create public assets directory if needed
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple favicon if it doesn't exist
const faviconPath = path.join(publicDir, 'favicon.ico');
if (!fs.existsSync(faviconPath)) {
  console.log('ℹ️  Add your favicon.ico to the public directory');
}

// Create manifest.json for PWA support
const manifestPath = path.join(publicDir, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  const manifest = {
    "short_name": "Clarivue",
    "name": "Clarivue Meeting Assistant",
    "icons": [
      {
        "src": "favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      }
    ],
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#1890ff",
    "background_color": "#ffffff"
  };
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Created manifest.json');
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Update the .env file with your API keys');
console.log('2. Run: npm install');
console.log('3. Run: npm start');
console.log('\nFor platform-specific builds:');
console.log('- Google Meet: npm run build:meet');
console.log('- Zoom: npm run build:zoom');
console.log('- Microsoft Teams: npm run build:teams'); 