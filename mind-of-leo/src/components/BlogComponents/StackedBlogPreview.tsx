// src/components/StackedBlogPreview.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import styles from './StackedBlogPreview.module.css';

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  category: string;
  excerpt?: string;
};

interface StackedBlogPreviewProps {
  posts: BlogPost[];
}

const StackedBlogPreview: React.FC<StackedBlogPreviewProps> = ({ posts }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Calculate active card index based on scroll position
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      // Map scroll progress to post index
      const index = Math.min(
        Math.floor(value * posts.length),
        posts.length - 1
      );
      setActiveIndex(index);
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, posts.length]);

  if (posts.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className={styles.container}
    >
      <div className={styles.sticky}>
        <div className={`${styles.cardWrapper} ${styles.perspective}`}>
          {posts.map((post, index) => (
            <Card 
              key={post.slug}
              post={post}
              isActive={index === activeIndex}
              index={index}
              activeIndex={activeIndex}
              total={posts.length}
            />
          ))}
          
          {/* Progress indicator */}
          <div className={styles.progressIndicator}>
            <div className="flex space-x-2">
              {posts.map((_, index) => (
                <div 
                  key={index}
                  className={`${styles.indicator} ${
                    index === activeIndex ? styles.activeIndicator : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  post: BlogPost;
  isActive: boolean;
  index: number;
  activeIndex: number;
  total: number;
}

const Card: React.FC<CardProps> = ({ post, isActive, index, activeIndex, total }) => {
  // Calculate position and styling based on active state
  const getCardStyles = () => {
    // Card is active
    if (isActive) {
      return {
        zIndex: 10,
        y: 0,
        scale: 1,
        opacity: 1,
        rotateX: 0
      };
    }
    
    // Card is before active card
    if (index < activeIndex) {
      const offset = (activeIndex - index);
      return {
        zIndex: total - offset,
        y: `-${offset * 10}%`,
        scale: 1 - (0.05 * offset),
        opacity: 1 - (0.2 * offset),
        rotateX: -3 * offset
      };
    }
    
    // Card is after active card
    const offset = (index - activeIndex);
    return {
      zIndex: total - offset,
      y: `${offset * 8}%`,
      scale: 1 - (0.05 * offset),
      opacity: 1 - (0.2 * offset),
      rotateX: 3 * offset
    };
  };
  
  const cardStyles = getCardStyles();
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const excerpt = post.excerpt || post.description || '';

  return (
    <motion.div
      className={`${styles.card} ${isActive ? styles.activeCard : styles.inactiveCard}`}
      animate={{
        y: cardStyles.y,
        scale: cardStyles.scale,
        opacity: cardStyles.opacity,
        zIndex: cardStyles.zIndex,
        rotateX: cardStyles.rotateX,
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="p-8">
        <div className="flex items-center mb-4">
          <div className={`${styles.statusDot} ${isActive ? styles.activeDot : ''}`}></div>
          <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm font-medium text-blue-600">{post.category}</span>
        </div>
        
        <motion.div 
          className={`${styles.cardContent} ${isActive ? styles.activeContent : ''}`}
          initial={false}
          animate={{ 
            opacity: isActive ? 1 : 0.7,
            y: isActive ? 0 : 10
          }}
          transition={{ duration: 0.4, delay: isActive ? 0.1 : 0 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h2>
          
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">
              {isActive 
                ? excerpt
                : excerpt.substring(0, 100) + '...'}
            </p>
          </div>
          
          {isActive && (
            <Link
              href={`/blog/${post.slug}`}
              className="inline-block bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-colors"
            >
              Read Article
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StackedBlogPreview;