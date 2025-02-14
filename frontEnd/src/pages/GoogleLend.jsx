import React from 'react';

const GoogleLend = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>GoogleLend</h2>
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLSeT5eiV3spSwB_HnxtwCUcOFlkViLCLMAKYFovsFrz93EaCaQ/viewform?embedded=true" 
        width="640" 
        height="2041" 
        frameBorder="0" 
        marginHeight="0" 
        marginWidth="0"
        title="Google Lend Form"
        style={{ 
          borderRadius: '8px', 
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          maxWidth: '90%',
        }}
      >
        Loading…
      </iframe>
    </div>
  );
};

export default GoogleLend;