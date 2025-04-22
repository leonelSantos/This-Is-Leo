import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// This would come from your CMS or file system in a real implementation
const blogPosts = [
  {
    slug: '2025-04-tech-trends',
    title: 'Tech Trends to Watch in 2025',
    date: 'April 15, 2025',
    author: 'Your Name',
    category: 'Technology',
    content: `
      <p>As we navigate through 2025, several key technological trends are reshaping how we interact with digital systems and each other. This article explores the most significant developments that are likely to impact our lives in the coming months.</p>
      
      <h2>1. Generative AI in Creative Industries</h2>
      <p>We're seeing an unprecedented integration of generative AI in design, music composition, and content creation. These tools are now capable of understanding context and emotional nuance in ways that were unimaginable just a year ago.</p>
      
      <h2>2. Sustainable Computing</h2>
      <p>With energy consumption becoming a critical concern, companies are investing heavily in carbon-neutral data centers and more efficient algorithms. The carbon footprint of digital operations is finally being taken seriously by the industry.</p>
      
      <h2>3. Mixed Reality Going Mainstream</h2>
      <p>Beyond gaming and entertainment, mixed reality technologies are finding practical applications in remote collaboration, education, and healthcare. The boundaries between physical and digital experiences continue to blur.</p>
      
      <p>These trends represent just the beginning of what promises to be a transformative year in technology. As developers and consumers, we should prepare for both exciting opportunities and new ethical challenges.</p>
    `,
  },
  {
    slug: '2025-03-economic-outlook',
    title: 'Economic Outlook: Q2 2025',
    date: 'March 28, 2025',
    author: 'Your Name',
    category: 'Economy',
    content: `
      <p>The second quarter of 2025 presents a complex economic landscape with several competing factors influencing market directions. Here's my analysis of what to expect in the coming months.</p>
      
      <h2>Global Supply Chain Resilience</h2>
      <p>After years of disruption, global supply chains are showing signs of increased resilience. New technologies for logistics management and diversified manufacturing have reduced vulnerability to regional disruptions.</p>
      
      <h2>Inflation Concerns</h2>
      <p>Despite central bank efforts, inflation remains above target levels in many developed economies. Consumer spending patterns suggest this is beginning to affect discretionary purchases in certain sectors.</p>
      
      <h2>Digital Currency Adoption</h2>
      <p>Several major economies are now in advanced stages of implementing central bank digital currencies (CBDCs), potentially reshaping how monetary policy is implemented and experienced by consumers.</p>
      
      <p>While uncertainties remain, businesses that prioritize adaptability and maintain strong balance sheets will be best positioned to navigate the economic landscape of Q2 2025.</p>
    `,
  },
];

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: `${post.title} | YourName.dev`,
    description: `${post.title} - A blog post about ${post.category.toLowerCase()} by ${post.author}`,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline">
          ← Back to All Posts
        </Link>
      </div>
      
      <header className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          {post.date} • {post.category}
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 overflow-hidden relative">
            <Image 
              src="/images/profile.jpg" 
              alt={post.author} 
              fill 
              className="object-cover"
            />
          </div>
          <span className="font-medium">{post.author}</span>
        </div>
      </header>
      
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <div className="mt-12 pt-8 border-t">
        <h3 className="text-lg font-bold mb-4">Share this article</h3>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Twitter
          </button>
          <button className="bg-blue-800 text-white px-4 py-2 rounded">
            LinkedIn
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded">
            Copy Link
          </button>
        </div>
      </div>
    </article>
  );
}