'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StackedBlogPreview from '@/components/BlogComponents/StackedBlogPreview';
import { motion } from 'framer-motion';
 
type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  excerpt?: string; // Added for previews
};

// Simulate the data fetching function since we're in a client component
// In a real implementation, you'd merge this with your getAllContent function
const getStaticData = async (): Promise<BlogPost[]> => {
  // In a real implementation, this would come from your MDX files using getAllContent
  // For demo purposes, we're using a static array
  return [
    {
      slug: '2025-04-tech-trends',
      title: 'Tech Trends to Watch in 2025',
      date: 'April 15, 2025',
      description: 'An analysis of emerging technologies that will shape our future',
      category: 'Technology',
      excerpt: 'As we navigate through 2025, several key technological trends are reshaping how we interact with digital systems and each other. This article explores the most significant developments that are likely to impact our lives in the coming months.'
    },
    {
      slug: '2025-03-economic-outlook',
      title: 'Economic Outlook: Q2 2025',
      date: 'March 28, 2025',
      description: 'Breaking down current market trends and future predictions',
      category: 'Economy',
      excerpt: 'The second quarter of 2025 presents a complex economic landscape with several competing factors influencing market directions. Here\'s my analysis of what to expect in the coming months.'
    },
    {
      slug: 'state-of-ai-2025',
      title: 'The State of AI in 2025',
      date: 'February 10, 2025',
      description: 'Examining the current landscape of artificial intelligence and machine learning',
      category: 'Technology',
      excerpt: 'Artificial intelligence continues to evolve at a breathtaking pace, with new capabilities and applications emerging almost daily. This article examines the current state of AI technology and where we\'re likely headed next.'
    },
    {
      slug: 'future-of-work-remote',
      title: 'The Future of Remote Work',
      date: 'January 22, 2025',
      description: 'How distributed teams are reshaping corporate culture',
      category: 'Business',
      excerpt: 'Five years after the global shift to remote work began, many organizations have completely reimagined how teams collaborate and deliver value. This article explores the lasting changes and emerging best practices for distributed workforces.'
    }
  ];
};

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    // Fetch posts on component mount
    const fetchPosts = async () => {
      const posts = await getStaticData();
      setAllPosts(posts);
    };
    
    fetchPosts();
  }, []);
  
  // Group posts by category
  const postsByCategory = allPosts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {} as Record<string, BlogPost[]>);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Animated stacked blog cards section */}
      {allPosts.length > 0 && <StackedBlogPreview posts={allPosts} />}
      
    </div>
  );
}