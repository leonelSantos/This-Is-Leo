import { Metadata } from 'next';
import Image from 'next/image';
import BookRecommendation from '@/components/BookRecommendation';

export const metadata: Metadata = {
  title: 'Book Recommendations | YourName.dev',
  description: 'A curated collection of books that have shaped my thinking on technology, economics, science, and more.',
};

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

const books: Book[] = [
  {
    id: '1',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas, Andrew Hunt',
    description: 'A classic that helped me establish good programming practices and mindset. Contains timeless advice for software developers at any level.',
    coverImage: '/images/books/pragmatic-programmer.jpg',
    category: 'Technology',
    rating: 5,
    amazonLink: 'https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052/',
  },
  {
    id: '2',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description: 'This book transformed my understanding of how we think and make decisions. Kahneman explains the two systems that drive our thinking and how they shape our judgments.',
    coverImage: '/images/books/thinking-fast-slow.jpg',
    category: 'Psychology',
    rating: 5,
    amazonLink: 'https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555/',
  },
  {
    id: '3',
    title: 'Why We Sleep',
    author: 'Matthew Walker',
    description: 'A fascinating exploration of sleep and its critical importance to our physical and mental health. Changed how I approach rest and productivity.',
    coverImage: '/images/books/why-we-sleep.jpg',
    category: 'Science',
    rating: 4,
    amazonLink: 'https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144316/',
  },
  {
    id: '4',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'An insightful look at how our background, experiences, and emotions shape our relationship with money. Contains timeless lessons on wealth and happiness.',
    coverImage: '/images/books/psychology-of-money.jpg',
    category: 'Finance',
    rating: 5,
    amazonLink: 'https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681/',
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'A practical guide to building good habits and breaking bad ones. The concepts in this book have helped me improve my productivity and consistency.',
    coverImage: '/images/books/atomic-habits.jpg',
    category: 'Productivity',
    rating: 4,
    amazonLink: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299/',
  },
  {
    id: '6',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    description: 'An excellent deep dive into the principles of designing systems that handle data at scale. Essential reading for any software engineer working with data systems.',
    coverImage: '/images/books/data-intensive-apps.jpg',
    category: 'Technology',
    rating: 5,
    amazonLink: 'https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321/',
  },
];

// Group books by category
const booksByCategory: Record<string, Book[]> = books.reduce((acc, book) => {
  if (!acc[book.category]) {
    acc[book.category] = [];
  }
  acc[book.category].push(book);
  return acc;
}, {} as Record<string, Book[]>);

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Book Recommendations</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Books that have influenced my thinking across various domains. I hope you find them as valuable as I did.
        </p>
      </header>

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

      <div className="mt-16 bg-amber-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Have a book recommendation for me?</h2>
        <p className="mb-6">
          I'm always looking to expand my reading list. If you've read something great that you think I'd enjoy, I'd love to hear about it!
        </p>
        <a
          href="mailto:yourname@example.com?subject=Book%20Recommendation"
          className="inline-block bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700"
        >
          Suggest a Book
        </a>
      </div>
    </div>
  );
}