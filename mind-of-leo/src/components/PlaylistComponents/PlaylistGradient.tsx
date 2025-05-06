'use client';

import React, { useEffect } from 'react';

// A very simple gradient background that uses CSS variables for animation
export default function PlaylistGradient() {
  useEffect(() => {
    // Add the gradient styles to the body
    document.body.classList.add('with-gradient-background');
    
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position as percentage of window
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      // Update CSS variables
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };
    
    // Set initial position to center
    document.documentElement.style.setProperty('--mouse-x', '50%');
    document.documentElement.style.setProperty('--mouse-y', '50%');
    
    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Add the required CSS
    const style = document.createElement('style');
    style.textContent = `
      .with-gradient-background {
        position: relative;
      }
      
      .with-gradient-background::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
          #8c7b5e, 
          #bb6826, 
          #dfcbaf, 
          #943706
        );
        opacity: 0.6;
        filter: blur(180px);
        z-index: -1;
        pointer-events: none;
        transition: background-position 0.3s ease;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('with-gradient-background');
      window.removeEventListener('mousemove', handleMouseMove);
      document.head.removeChild(style);
      document.documentElement.style.removeProperty('--mouse-x');
      document.documentElement.style.removeProperty('--mouse-y');
    };
  }, []);
  
  // This component doesn't render anything visible, it just adds the gradient effect
  return null;
}