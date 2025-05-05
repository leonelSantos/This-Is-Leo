'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SpotifyEmbed from '@/components/PlaylistComponents/SpotifyEmbed';
import Lenis from '@studio-freight/lenis';
import styles from '@/components/PlaylistComponents/playlists.module.css';

type Playlist = {
  id: string;
  title: string;
  description: string;
  mood: string;
  spotifyId: string;
};

const playlists: Playlist[] = [
  {
    id: '1',
    title: 'Hell Bent',
    description: 'Cowboy Shit',
    mood: 'Got \'em ol\' travelling blues',
    spotifyId: '6YgbHmQJzXsOHY9KYhoIV2',
  },
  {
    id: '2',
    title: 'Easy Come, Easy Go',
    description: 'Cowboy Shit II',
    mood: 'Got \'em ol\' travelling blues',
    spotifyId: '61EMKwEGqA3xyF4TCV6aUv',
  },
  {
    id: '3',
    title: 'Every Dog Has It\'s Day',
    description: 'Cowboy Shit III',
    mood: 'Got \'em ol\' travelling blues',
    spotifyId: '35r5XbMk4otx7QhUpEn1nw',
  },
  {
    id: '4',
    title: 'Other Side of Nowhere',
    description: 'Cowboy Shit IV',
    mood: 'Got \'em ol\' travelling blues',
    spotifyId: '6sfcz0bqE6GoBGxH0rTeSh',
  },
];

export default function PlaylistsPage() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  // Set up smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.1, // Adjust this value (lower = faster, higher = slower)
      smoothWheel: true, // Enable smooth scrolling for mouse wheel
      wheelMultiplier: 1.0, // Control wheel sensitivity
    });
  
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
  
    requestAnimationFrame(raf);
  
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main ref={container} className={styles.main}>
      <div className={styles.header}>
        <h1>My Spotify Playlists</h1>
        <p>
          Music has always been an essential part of my life and work. Here are some of my carefully curated playlists for different moods and activities.
        </p>
      </div>

      {playlists.map((playlist, i) => {
        // Calculate target scale for each card
        // Each card will be slightly smaller than the one before it
        const targetScale = 1 - ((playlists.length - i) * 0.05);
        const isLast = i === playlists.length - 1;
        
        return (
          <PlaylistCard 
            key={playlist.id}
            playlist={playlist}
            i={i}
            progress={scrollYProgress}
            range={[i * 0.15, 0.85]}
            targetScale={targetScale}
            isLast={isLast}
          />
        );
      })}

    </main>
  );
}

const PlaylistCard = ({ playlist, i, progress, range, targetScale, isLast }: {
  playlist: Playlist;
  i: number;
  progress: any;
  range: number[];
  targetScale: number;
}) => {
  const cardContainer = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardContainer,
    offset: ['start end', 'start start']
  });

  // Transform values based on scroll position
  const scale = useTransform(progress, range, [1, targetScale]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  
  // Generate a gradient background color based on index
  const colors = ['#8c7b5e', '#bb6826', '#dfcbaf', '#943706'];
  const color = colors[i % colors.length];

  return (
    <div ref={cardContainer} className={`${styles.cardContainer} ${isLast ? styles.lastCard : ''}`}>
      <motion.div 
        style={{ 
          backgroundColor: color, 
          scale,
          top: `calc(-5vh + ${i * 25}px)`
        }} 
        className={styles.card}
      >
        <h2>{playlist.title}</h2>
        <div className={styles.body}>
          <div className={styles.description}>
            <p>{playlist.description}</p>
            <div className={styles.mood}>
              <span>{playlist.mood}</span>
            </div>
          </div>

          <div className={styles.spotifyContainer}>
            <motion.div
              className={styles.inner}
              style={{ scale: imageScale }}
            >
              <SpotifyEmbed spotifyId={playlist.spotifyId} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};