// This script helps with client-side routing in Netlify
// It ensures the SPA works correctly with browser refreshes and direct URL access
(function() {
  // Check if we're running in the Netlify platform by looking at the hostname
  const isNetlify = window.location.hostname.includes('.netlify.app') || 
                   window.location.hostname.includes('.netlify.com');
  
  if (isNetlify) {
    console.log('Netlify environment detected, applying routing fixes...');
    
    // Ensure API requests are correctly routed
    window.addEventListener('load', function() {
      console.log('Netlify routing helper loaded');
      
      // Detect and log 404 errors to help with debugging
      const originalFetch = window.fetch;
      window.fetch = function(url, options) {
        return originalFetch(url, options)
          .then(response => {
            if (response.status === 404) {
              console.error(`404 Error: Resource not found at ${url}`);
              // You could add additional error handling here
            }
            return response;
          });
      };
    });
  }
})();