'use client'

import Link from 'next/link';
import Image from 'next/image';
import BlogPostCard from '@/components/BlogPostCard';
import CheatSheetCard from '@/components/CheatSheetCard';

import { useRef, useEffect } from 'react';
import styles from './page.module.css'
import TextDisperse from '@/components/TextDisperse';
import gsap from 'gsap';


// In a real implementation, you would fetch these from your content directory or API
const featuredPosts = [
  {
    slug: '2025-04-tech-trends',
    title: 'Tech Trends to Watch in 2025',
    excerpt: 'An analysis of emerging technologies that will shape our future...',
    date: 'April 15, 2025',
    category: 'Technology'
  },
  {
    slug: '2025-03-economic-outlook',
    title: 'Economic Outlook: Q2 2025',
    excerpt: 'Breaking down current market trends and future predictions...',
    date: 'March 28, 2025',
    category: 'Economy'
  }
];

const featuredCheatsheets = [
  {
    slug: 'react',
    title: 'React.js',
    description: 'Essential hooks, patterns, and best practices',
    icon: 'react-icon.svg'
  },
  {
    slug: 'nextjs',
    title: 'Next.js',
    description: 'App Router, Server Components, and more',
    icon: 'nextjs-icon.svg'
  }
];

export default function Home() {
  // This code is for the floating text effect
  // It creates a text animation that reveals the background as you scroll down the page
  const background = useRef(null);
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

  useEffect( () => {
    requestAnimationFrame(animate)
  }, [])

  const animate = () => {
    const maskSizeProgress = targetMaskSize * getScrollProgress();
    stickyMask.current.style.webkitMaskSize = (initialMaskSize + maskSizeProgress) * 100 + "%";
    requestAnimationFrame(animate)
  }

  const getScrollProgress = () => {
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
      <section className='height-100vh flex justify-center items-center pt-50 pb-40'>
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
        
        </div>
        <div ref={background} className={styles.background}></div>
      </section>

    </main>
  );
}