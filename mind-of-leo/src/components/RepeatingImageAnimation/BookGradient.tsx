'use client';

import React, { useRef, useEffect } from 'react';

interface BookGradientProps {
  children?: React.ReactNode;
  intensity?: number;
  blur?: number;
  speed?: number;
  opacity?: number;
}

/**
 * A warm-toned gradient background for book pages that responds to mouse movement
 */
const BookGradient: React.FC<BookGradientProps> = ({
  children,
  intensity = 0.6,
  blur = 180,
  speed = 0.7,
  opacity = 0.65,
}) => {
  const gradientRef = useRef<HTMLDivElement>(null);
  const secondaryGradientRef = useRef<HTMLDivElement>(null);
  
  // Warm color palette - browns, oranges, ambers for books
  const colors = ['#bb6826', '#8c7b5e', '#dfcbaf', '#943706'];
  
  // Set up mouse tracking for gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      // Add some variance based on intensity
      const offsetX = 50 + ((x - 50) * intensity);
      const offsetY = 50 + ((y - 50) * intensity);
      
      if (gradientRef.current) {
        // Update CSS variables
        gradientRef.current.style.setProperty('--mouse-x', `${offsetX}%`);
        gradientRef.current.style.setProperty('--mouse-y', `${offsetY}%`);
      }
      
      if (secondaryGradientRef.current) {
        secondaryGradientRef.current.style.setProperty('--mouse-x', `${offsetX}%`);
        secondaryGradientRef.current.style.setProperty('--mouse-y', `${offsetY}%`);
      }
    };
    
    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Set initial centered position
    if (gradientRef.current) {
      gradientRef.current.style.setProperty('--mouse-x', '50%');
      gradientRef.current.style.setProperty('--mouse-y', '50%');
    }
    
    if (secondaryGradientRef.current) {
      secondaryGradientRef.current.style.setProperty('--mouse-x', '50%');
      secondaryGradientRef.current.style.setProperty('--mouse-y', '50%');
    }
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity]);

  // Construct the radial gradient string
  const radialGradient = `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`;
  
  // Construct the conic gradient string
  const conicGradient = `conic-gradient(from ${Math.random() * 360}deg at var(--mouse-x, 50%) var(--mouse-y, 50%), ${colors[2]}, ${colors[0]}, ${colors[3]}, ${colors[1]}, ${colors[2]})`;

  return (
    <>
      {/* Fixed position gradient background */}
      <div
        ref={gradientRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: radialGradient,
          backgroundSize: '200% 200%',
          opacity: opacity,
          filter: `blur(${blur}px)`,
          zIndex: -1,
          pointerEvents: 'none',
          transition: `all ${speed}s cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
      
      {/* Secondary gradient layer for added depth */}
      <div
        ref={secondaryGradientRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: conicGradient,
          backgroundSize: '200% 200%',
          opacity: opacity * 0.4,
          filter: `blur(${blur * 1.5}px)`,
          zIndex: -2,
          pointerEvents: 'none',
          transition: `all ${speed * 1.2}s cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
      
      {/* Pass through children */}
      {children}
    </>
  );
};

export default BookGradient;