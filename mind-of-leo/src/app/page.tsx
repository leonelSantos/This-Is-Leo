import Link from 'next/link';
import Image from 'next/image';
import BlogPostCard from '@/components/BlogPostCard';
import CheatSheetCard from '@/components/CheatSheetCard';

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
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full mb-4">
          <Image
            src="/images/LAS-Pixelated.png"
            alt="Profile Picture"
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">Observations From a Wandering Mind</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          He who jumps into the void owes no explanation <br/>to those who stand and watch.
        </p>
      </section>

      {/* Featured Blog Posts */}
      <section className="mb-16">
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
      <section className="mb-16">
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
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
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