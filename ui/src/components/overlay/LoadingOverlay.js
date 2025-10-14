    // LoadingOverlay.js
    import React from 'react';

    const LoadingOverlay = () => {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999, // Ensure it's on top
        }}>
          <div style={{ color: 'white', fontSize: '24px' }}>
            <img src="loading-load.webp" alt="Loading" style={{ width: '150px', height: '150px', marginLeft: '20px' }} />.</div>
          
        </div>
      );
    };

    export default LoadingOverlay;