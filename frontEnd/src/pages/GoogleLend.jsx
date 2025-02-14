import React from 'react';

const GoogleLend = () => {
  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <h2>GoogleLend</h2>
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLSeT5eiV3spSwB_HnxtwCUcOFlkViLCLMAKYFovsFrz93EaCaQ/viewform?embedded=true" 
        width="640" 
        height="2041" 
        frameBorder="0" 
        marginHeight="0" 
        marginWidth="0"
        title="Google Lend Form"
        style={{ borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        Loading…
      </iframe>
    </div>
  );
};

export default GoogleLend;