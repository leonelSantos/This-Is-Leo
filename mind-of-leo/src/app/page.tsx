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
  const background = useRef(null);
  const setBackground = (isActive) => {
    gsap.to(background.current, {opacity: isActive ? 0.8 : 0})
  }

  const container = useRef(null);
  const stickyMask = useRef(null);

  const initialMaskSize = .8;
  const targetMaskSize = 30;
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
              <source src="/medias/nature.mp4" type="video/mp4"/>
            </video>
          </div>
        </div>
      </section>

      {/* Floating Letter */}
      <section className='height-100vh flex justify-center items-center'>
      <div className={styles.body}>
        <TextDisperse setBackground={setBackground}>
          <p>Leo Santos</p>
        </TextDisperse>

        <TextDisperse setBackground={setBackground}>
          <p>Designer</p>
          </TextDisperse>

        <TextDisperse setBackground={setBackground}>
          <p>&</p>
          </TextDisperse>

          <TextDisperse setBackground={setBackground}>
          <p>Developer</p>
          </TextDisperse>

        <TextDisperse setBackground={setBackground}>
          <p>+447533063596</p>
          </TextDisperse>

        <TextDisperse setBackground={setBackground}>
          <p>→Email</p>
          </TextDisperse>

        <TextDisperse setBackground={setBackground}>
          <p>→Insta</p>
          </TextDisperse>
        </div>
        <div ref={background} className={styles.background}></div>
      </section>

    </main>
  );
}