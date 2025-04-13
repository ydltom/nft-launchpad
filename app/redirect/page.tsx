'use client';

import { useEffect } from 'react';
// Import the shared passport instance
import { passportInstance } from '@/lib/immutable'; 

export default function Redirect() {
  useEffect(() => {
    // Ensure passportInstance is initialized
    if (passportInstance) {
      passportInstance.loginCallback()
        .then(() => {
          console.log('Login callback successful');
          // Handle popup closing
          if (window.opener) {
            // Optionally send a message back to the opener window
            // window.opener.postMessage('authComplete', window.origin);
            window.close();
          } else {
            // If not a popup, redirect the main window to the home page
            window.location.href = '/';
          }
        })
        .catch((error) => {
          console.error('Error in login callback:', error);
          // Optionally redirect to home or show an error page even on failure
          if (!window.opener) {
             window.location.href = '/';
          }
        });
    } else {
      // Handle the case where passportInstance is null (e.g., config missing)
      console.error('Passport instance not available for login callback.');
      // Optionally show an error message to the user or redirect
      if (!window.opener) {
         window.location.href = '/?error=passport_init_failed';
      }
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Basic UI for the redirect page
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Processing Login...</h1>
      <p>Please wait while we complete your login.</p>
      {/* You could add a loading spinner here */} 
    </div>
  );
} 