// Script to copy the _redirects file to the build output
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current module's directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to source _redirects file
const sourceRedirectsPath = path.resolve(__dirname, '../public/_redirects');
// Path to destination _redirects file
const destRedirectsPath = path.resolve(__dirname, '../dist/_redirects');

// Check if source _redirects file exists
if (fs.existsSync(sourceRedirectsPath)) {
  console.log('✅ Found _redirects file, copying to output directory...');
  
  // Ensure the dist directory exists
  const distDir = path.dirname(destRedirectsPath);
  if (!fs.existsSync(distDir)) {
    console.log('📁 Creating dist directory...');
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Copy the file
  fs.copyFileSync(sourceRedirectsPath, destRedirectsPath);
  console.log('✅ Successfully copied _redirects file to:', destRedirectsPath);
} else {
  console.error('❌ Source _redirects file not found at:', sourceRedirectsPath);
  console.log('🔄 Creating _redirects file directly in output directory...');
  
  // Create the file directly in the output directory
  const redirectsContent = `# Netlify redirects file
/api/*  /.netlify/functions/api/:splat  200
/.netlify/functions/api/*  /.netlify/functions/api/:splat  200
/health  /.netlify/functions/api/health  200
/*  /index.html  200`;
  
  // Ensure the dist directory exists
  const distDir = path.dirname(destRedirectsPath);
  if (!fs.existsSync(distDir)) {
    console.log('📁 Creating dist directory...');
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Write the file
  fs.writeFileSync(destRedirectsPath, redirectsContent);
  console.log('✅ Created _redirects file at:', destRedirectsPath);
}

// Also create a netlify.toml file in the output directory as a backup
const netlifyTomlContent = `[build]
  publish = "."
  
# Redirect API requests to the serverless function
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
  force = true

# Handle direct function access for debugging
[[redirects]]
  from = "/.netlify/functions/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

# Handle health check endpoints
[[redirects]]
  from = "/health"
  to = "/.netlify/functions/api/health"
  status = 200
  
# Frontend history routing for SPA - this MUST be LAST
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true`;

const destNetlifyTomlPath = path.resolve(__dirname, '../dist/netlify.toml');
fs.writeFileSync(destNetlifyTomlPath, netlifyTomlContent);
console.log('✅ Created netlify.toml in output directory at:', destNetlifyTomlPath);

console.log('🎉 Post-build file copying completed successfully!');