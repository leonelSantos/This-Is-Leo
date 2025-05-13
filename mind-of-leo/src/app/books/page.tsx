'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import books from '../../content/books/bookList.js';

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