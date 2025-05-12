'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import the BookImageAnimation component with dynamic loading
// This prevents hydration errors for the client-side animation
const BookImageAnimation = dynamic(
  () => import('@/components/RepeatingImageAnimation/BookImageAnimation'),
  { ssr: false }
);

// Import the BookGradient component
import BookGradient from '@/components/RepeatingImageAnimation/BookGradient';

// Import the regular BookRecommendation for fallback
import BookRecommendation from '@/components/BookRecommendation';

// Types
type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  category: string;
  rating: number;
  amazonLink?: string;
};

// Books data remains the same as your original page
const books: Book[] = [
  {
    id: '1',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas, Andrew Hunt',
    description: 'A classic that helped me establish good programming practices and mindset. Contains timeless advice for software developers at any level.',
    coverImage: '/images/books/Active-Inference.jpg',
    category: 'Technology',
    rating: 5,
    amazonLink: 'https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052/',
  },
  {
    id: '2',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description: 'This book transformed my understanding of how we think and make decisions. Kahneman explains the two systems that drive our thinking and how they shape our judgments.',
    coverImage: '/images/books/Big-Sur.jpg',
    category: 'Psychology',
    rating: 5,
    amazonLink: 'https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555/',
  },
  {
    id: '3',
    title: 'Why We Sleep',
    author: 'Matthew Walker',
    description: 'A fascinating exploration of sleep and its critical importance to our physical and mental health. Changed how I approach rest and productivity.',
    coverImage: '/images/books/Brave-New-World.jpg',
    category: 'Science',
    rating: 4,
    amazonLink: 'https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144316/',
  },
  {
    id: '4',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'An insightful look at how our background, experiences, and emotions shape our relationship with money. Contains timeless lessons on wealth and happiness.',
    coverImage: '/images/books/Breath.jpg',
    category: 'Finance',
    rating: 5,
    amazonLink: 'https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681/',
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'A practical guide to building good habits and breaking bad ones. The concepts in this book have helped me improve my productivity and consistency.',
    coverImage: '/images/books/Chaos.jpg',
    category: 'Productivity',
    rating: 4,
    amazonLink: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299/',
  },
  {
    id: '6',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    description: 'An excellent deep dive into the principles of designing systems that handle data at scale. Essential reading for any software engineer working with data systems.',
    coverImage: '/images/books/Chip-War.jpg',
    category: 'Technology',
    rating: 5,
    amazonLink: 'https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321/',
  },
];

// Group books by category for the traditional view
const booksByCategory: Record<string, Book[]> = books.reduce((acc, book) => {
  if (!acc[book.category]) {
    acc[book.category] = [];
  }
  acc[book.category].push(book);
  return acc;
}, {} as Record<string, Book[]>);

export default function BooksPage() {
  // State to track which view to display
  const [viewMode, setViewMode] = useState<'animation' | 'traditional'>('animation');
  
  // Check if the window is available (client-side)
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Toggle between view modes
  const toggleView = () => {
    setViewMode(prev => prev === 'animation' ? 'traditional' : 'animation');
  };

  return (
    <>
      {/* Add the BookGradient component */}
      <BookGradient />
      
      <div className="container mx-auto px-4 pb-16">

      {/* Conditional rendering based on view mode */}
      {isMounted && (
        <>
          {viewMode === 'animation' ? (
            // Animated grid view
            <div className="my-8">
              <BookImageAnimation books={books} />
            </div>
          ) : (
            // Traditional view (original implementation)
            <>
              {Object.entries(booksByCategory).map(([category, categoryBooks]) => (
                <section key={category} className="mb-16">
                  <h2 className="text-2xl font-bold mb-6">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryBooks.map((book) => (
                      <BookRecommendation key={book.id} book={book} />
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </>
      )}
    </div>
    </>
  );
}