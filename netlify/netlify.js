// Important: This file is a Netlify-specific build script that runs before the actual build
// to manage the Rollup native extension issues that occur in Netlify's build environment.

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables to avoid build errors
process.env.ROLLUP_NATIVE_DISABLE = 'true';

console.log('🚀 Starting Netlify-specific build process');
console.log('📌 Environment:', process.env.NODE_ENV || 'production');
console.log('📌 Rollup native extensions disabled for compatibility');

// This function runs the actual build command with the environment variables set
async function runBuild() {
  return new Promise((resolve, reject) => {
    console.log('📦 Running build command: npm run build');
    
    const buildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ROLLUP_NATIVE_DISABLE: 'true',
        NODE_ENV: 'production'
      }
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build completed successfully');
        resolve();
      } else {
        console.error(`❌ Build failed with code ${code}`);
        reject(new Error(`Build process exited with code ${code}`));
      }
    });
    
    buildProcess.on('error', (err) => {
      console.error('❌ Failed to start build process:', err);
      reject(err);
    });
  });
}

// Copy necessary files for Netlify functions
async function copyRequiredFiles() {
  const fs = require('fs');
  
  console.log('📋 Copying required files for Netlify functions');
  
  const schemaSourceDir = path.resolve(__dirname, '../shared');
  const schemaTargetDir = path.resolve(__dirname, './functions/shared');
  
  if (!fs.existsSync(schemaTargetDir)) {
    fs.mkdirSync(schemaTargetDir, { recursive: true });
  }
  
  if (fs.existsSync(schemaSourceDir)) {
    const schemaFiles = fs.readdirSync(schemaSourceDir);
    for (const file of schemaFiles) {
      fs.copyFileSync(
        path.join(schemaSourceDir, file),
        path.join(schemaTargetDir, file)
      );
    }
    console.log('✅ Schema files copied successfully');
  } else {
    console.warn('⚠️ Schema directory not found');
  }
}

// Main function to execute the build process
async function main() {
  console.log('🔧 Starting Netlify build process');
  
  try {
    // First run the pre-build steps
    await copyRequiredFiles();
    
    // Then run the actual build command
    await runBuild();
    
    console.log('🎉 Netlify build completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Netlify build failed:', error);
    process.exit(1);
  }
}

// Run the main function
main();