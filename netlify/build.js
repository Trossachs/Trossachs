const path = require('path');
const fs = require('fs');

// Conditionally disable the Rollup native extensions
if (!process.env.ROLLUP_NATIVE_DISABLE) {
  process.env.ROLLUP_NATIVE_DISABLE = 'true';
  console.log('⚠️ Setting ROLLUP_NATIVE_DISABLE=true to avoid build issues');
}

// Set NODE_ENV if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
  console.log('⚠️ Setting NODE_ENV=production for the build');
}

console.log(`🚀 Building for Netlify with Node ${process.version} in ${process.env.NODE_ENV} mode`);

const buildForNetlify = async () => {
  try {
    console.log('📦 Building server functions...');
    
    // Create functions directory if it doesn't exist
    const functionsDir = path.resolve(__dirname, './functions');
    if (!fs.existsSync(functionsDir)) {
      fs.mkdirSync(functionsDir, { recursive: true });
      console.log('Created functions directory:', functionsDir);
    }
    
    // Check if we need to generate the handler
    const handlerPath = path.resolve(__dirname, './functions/api.js');
    
    // If handler already exists, skip creating it
    if (fs.existsSync(handlerPath)) {
      console.log('✅ Handler already exists at:', handlerPath);
      return;
    }
    
    // Extra safety - copy any required files
    console.log('🔍 Copying additional required files...');
    
    // Ensure schema files are copied if needed
    const schemaSourceDir = path.resolve(__dirname, '../shared');
    const schemaTargetDir = path.resolve(__dirname, '../netlify/functions/shared');
    if (fs.existsSync(schemaSourceDir) && !fs.existsSync(schemaTargetDir)) {
      fs.mkdirSync(schemaTargetDir, { recursive: true });
      const schemaFiles = fs.readdirSync(schemaSourceDir);
      schemaFiles.forEach(file => {
        fs.copyFileSync(
          path.join(schemaSourceDir, file),
          path.join(schemaTargetDir, file)
        );
      });
      console.log('Copied schema files to:', schemaTargetDir);
    }
    
    console.log('✅ Build completed successfully!');
  } catch (err) {
    console.error('❌ Error during build:', err);
    process.exit(1);
  }
};

buildForNetlify().catch(err => {
  console.error('❌ Fatal error building for Netlify:', err);
  process.exit(1);
});