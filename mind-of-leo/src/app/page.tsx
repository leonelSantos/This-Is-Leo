'use client'

import { useRef, useEffect } from 'react';
import styles from './page.module.css'
import TextDisperse from '@/components/TextDisperse';
import gsap from 'gsap';

export default function Home() {
  // This code is for the floating text effect
  // It creates a text animation that reveals the background as you scroll down the page
  const background = useRef(null);
  const textSection = useRef(null);
  
  const setBackground = (isActive) => {
    gsap.to(background.current, {opacity: isActive ? 0.8 : 0})
  }

  // This code is for the text clip mask effect
  // It creates a mask that reveals a video background as you scroll down the page
  const container = useRef(null);
  const stickyMask = useRef(null);
  const initialMaskSize = .8;
  const targetMaskSize = 180;
  const easing = 0.15;
  let easedScrollProgress = 0;

  useEffect(() => {
    requestAnimationFrame(animate);
    
    // Add resize event listener to handle responsive layout
    window.addEventListener('resize', handleResize);
    // Call once to set initial size
    handleResize();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle window resize to adjust background size
  const handleResize = () => {
    if (textSection.current && background.current) {
      const rect = textSection.current.getBoundingClientRect();
      background.current.style.width = `${rect.width}px`;
      background.current.style.height = `${rect.height}px`;
    }
  };

  const animate = () => {
    const maskSizeProgress = targetMaskSize * getScrollProgress();
    if (stickyMask.current) {
      stickyMask.current.style.webkitMaskSize = (initialMaskSize + maskSizeProgress) * 100 + "%";
    }
    requestAnimationFrame(animate)
  }

  const getScrollProgress = () => {
    if (!stickyMask.current || !container.current) return 0;
    const scrollProgress = stickyMask.current.offsetTop / (container.current.getBoundingClientRect().height - window.innerHeight)
    const delta = scrollProgress - easedScrollProgress;
    easedScrollProgress += delta * easing;
    return easedScrollProgress
  }


  return (
    <main className={styles.main}>
      {/* Text Clip Mask On Scroll */}
      <section>
        <div ref={container} className={styles.container}>
          <div ref={stickyMask} className={styles.stickyMask}>
            <video autoPlay muted loop>
              <source src="/medias/ripple.mp4" type="video/mp4"/>
            </video>
          </div>
        </div>
      </section>

      {/* Floating Letter */}
      <section ref={textSection} className='height-100vh flex justify-center items-center pt-50 pb-40 relative'>
        <div className={styles.body}>
          <div className='introLine'>
            <p>Leonel</p>
            <p>A.</p>
            <p>Santos</p>
          </div>

          <div className='introLine'>
            <p>Software</p>
            <p>Developer</p>
          </div>

          <TextDisperse setBackground={setBackground}>
            <p>→Blog Posts</p>
          </TextDisperse>
          <TextDisperse setBackground={setBackground}>
            <p>→Cheat Sheets</p>
          </TextDisperse>

          <TextDisperse setBackground={setBackground}>
            <p>→Books</p>
          </TextDisperse>

          <TextDisperse setBackground={setBackground}>
            <p>→Playlists</p>
          </TextDisperse>
          
          {/* Position the background within this container */}
          <div ref={background} className={styles.background}></div>
        </div>
      </section>

    </main>
  );
}