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
          <p>Leo <br></br> Santos</p>
        </TextDisperse>

        <TextDisperse setBackground={setBackground}>
          <p>Design</p>
          <p>&</p>
          </TextDisperse>

        <TextDisperse setBackground={setBackground}>
          <p>Art</p>
          <p>Direction</p>
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

      {/* Featured Blog Posts */}
      <section className="mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <Link href="/blog" className="text-cyan-200 hover:underline">
            View all posts →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Featured Cheatsheets */}
      <section className="mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tech Cheatsheets</h2>
          <Link href="/cheatsheets" className="text-cyan-200 hover:underline">
            View all cheatsheets →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCheatsheets.map((cheatsheet) => (
            <CheatSheetCard key={cheatsheet.slug} cheatsheet={cheatsheet} />
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl text-gray-800 font-bold mb-4">My Spotify Playlists</h2>
          <p className=" text-gray-800 mb-4">Check out my curated music collections for different moods and activities.</p>
          <Link href="/playlists" className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Explore playlists
          </Link>
        </div>
        <div className="bg-amber-50 p-6 rounded-lg">
          <h2 className="text-amber-600 text-xl font-bold mb-4">Book Recommendations</h2>
          <p className=" text-amber-500 mb-4">Discover books that have influenced my thinking and expanded my horizons.</p>
          <Link href="/books" className="inline-block bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700">
            See recommendations
          </Link>
        </div>
      </section>
    </main>
  );
}