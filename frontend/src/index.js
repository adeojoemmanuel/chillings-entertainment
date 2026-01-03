import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress placeholder image errors
window.addEventListener('error', (event) => {
  if (event.target && event.target.tagName === 'IMG') {
    const src = event.target.src || '';
    if (src.includes('via.placeholder.com') || src.includes('placeholder.com')) {
      event.preventDefault();
      event.stopPropagation();
      // Hide the broken image
      if (event.target) {
        event.target.style.display = 'none';
      }
      return false;
    }
  }
}, true);

// Also handle image onerror events globally
document.addEventListener('error', (event) => {
  if (event.target && event.target.tagName === 'IMG') {
    const src = event.target.src || '';
    if (src.includes('via.placeholder.com') || src.includes('placeholder.com')) {
      event.preventDefault();
      if (event.target) {
        event.target.style.display = 'none';
      }
    }
  }
}, true);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

