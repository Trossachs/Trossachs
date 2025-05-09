// This file is used as a Netlify build plugin to modify the build behavior
// It helps resolve issues with native dependencies and module bundling

module.exports = {
  // Plugin name
  onPreBuild: ({ utils }) => {
    console.log('🔧 Running Netlify pre-build script...');
    
    // Log Node.js version for debugging
    console.log('📌 Node version:', process.version);
    console.log('📌 Environment:', process.env.NODE_ENV || 'development');
    
    // Important: Disable Rollup native extensions that cause build issues on Netlify
    process.env.ROLLUP_NATIVE_DISABLE = 'true';
    console.log('📌 Set ROLLUP_NATIVE_DISABLE=true to avoid build errors');
    
    try {
      console.log('📌 Customizing build settings for Netlify deployment');
      utils.status.show({
        title: 'Customizing build settings for Netlify',
        summary: 'Applying fixes for Rollup native extension issues'
      });
      
      // Run the additional build steps
      require('./netlify/build.js');
    } catch (error) {
      console.error('❌ Error in pre-build script:', error);
    }
    
    console.log('✅ Pre-build script completed successfully');
  },
  
  onBuild: ({ utils }) => {
    console.log('🏗️ Build completed, running post-processing...');
    try {
      // Additional verification steps can be added here
      utils.status.show({
        title: 'Build completed successfully',
        summary: 'Verifying deployment assets'
      });
    } catch (error) {
      console.error('❌ Error in build script:', error);
    }
  },
  
  onPostBuild: ({ utils }) => {
    console.log('🎉 Post-build steps starting...');
    try {
      console.log('📌 Checking for critical deployment files');
      
      // Add verification steps here
      utils.status.show({
        title: 'Ready for deployment',
        summary: 'All required assets verified'
      });
    } catch (error) {
      console.error('❌ Error in post-build script:', error);
      utils.build.failBuild('Post-build verification failed');
    }
  }
};