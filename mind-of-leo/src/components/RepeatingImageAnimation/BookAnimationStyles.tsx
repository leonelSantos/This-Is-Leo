'use client';

import { useEffect } from 'react';

// Simple component to load the CSS styles for the book animation
export default function BookAnimationStyles() {
  useEffect(() => {
    // Create style element
    const style = document.createElement('style');
    style.id = 'book-animation-styles';
    
    // Set the CSS content
    style.textContent = `
/* Book Image Animation Styles */

/* Base styles */
.loading {
  position: relative;
}

.loading::before,
.loading::after {
  content: '';
  position: fixed;
  z-index: 10000;
}

.loading::before {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-bg, #fff);
}

.loading::after {
  top: 50%;
  left: 50%;
  width: 100px;
  height: 1px;
  margin: 0 0 0 -50px;
  background: var(--color-link, #151515);
  animation: loaderAnim 1.5s ease-in-out infinite alternate forwards;
}

@keyframes loaderAnim {
  0% {
    transform: scaleX(0);
    transform-origin: 0% 50%;
  }

  50% {
    transform: scaleX(1);
    transform-origin: 0% 50%;
  }

  50.1% {
    transform: scaleX(1);
    transform-origin: 100% 50%;
  }

  100% {
    transform: scaleX(0);
    transform-origin: 100% 50%;
  }
}

/* Interactive link styles */
.line {
  display: inline-block;
  overflow: hidden;
  position: relative;
  vertical-align: top;
}

.line::before {
  background: currentColor;
  bottom: 0;
  content: '';
  height: 1px;
  left: 0;
  position: absolute;
  transition: transform 0.4s ease;
  width: 100%;
  transform: scaleX(0);
  transform-origin: right center;
}

.line:hover::before {
  transform: scaleX(1);
  transform-origin: left center;
}

/* Smooth book tile hover effect */
.grid__item {
  transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1),
              box-shadow 0.3s cubic-bezier(0.33, 1, 0.68, 1);
}

.grid__item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Book image effect */
.grid__item-image {
  transition: transform 0.5s cubic-bezier(0.33, 1, 0.68, 1),
              opacity 0.3s ease;
}

.grid__item:hover .grid__item-image {
  transform: scale(1.03);
}

/* Panel transition effects */
.panel {
  transition: opacity 0.5s cubic-bezier(0.33, 1, 0.68, 1);
}

.panel__content {
  transition: opacity 0.5s cubic-bezier(0.33, 1, 0.68, 1),
              transform 0.5s cubic-bezier(0.33, 1, 0.68, 1);
}

/* Mover animations (the transitioning book covers) */
.mover {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1);
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .heading__title {
    font-size: 2.5rem;
  }
}

/* Movers container */
.movers-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1500;
}

/* Animation for panel reveal */
@keyframes panelReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel__content > * {
  animation: panelReveal 0.5s forwards;
  animation-delay: calc(var(--index) * 0.1s);
  opacity: 0;
}
    `;
    
    // Check if style already exists
    if (!document.getElementById('book-animation-styles')) {
      document.head.appendChild(style);
    }
    
    // Cleanup on component unmount
    return () => {
      const existingStyle = document.getElementById('book-animation-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
}