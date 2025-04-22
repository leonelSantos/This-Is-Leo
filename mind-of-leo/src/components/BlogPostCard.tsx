import React from 'react';
import Link from 'next/link';
import Card from './ui/Card';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  coverImage?: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogPostCard({ post, className = '' }: BlogPostCardProps) {
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card 
      variant="elevated" 
      isHoverable 
      className={`h-full flex flex-col ${className}`}
    >
      {post.coverImage && (
        <div className="h-48 relative overflow-hidden">
          <img 
            src={post.coverImage}
            alt={`Cover image for ${post.title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-white text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
              {post.category}
            </span>
          </div>
        </div>
      )}
      <Card.Content className="flex-grow flex flex-col">
        <div className="text-sm text-gray-500 mb-2">
          {formatDate(post.date)}
        </div>
        <Card.Title className="mb-2 hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </Card.Title>
        <Card.Description className="mb-4 flex-grow">
          {post.excerpt}
        </Card.Description>
        <div className="mt-auto">
          <Link 
            href={`/blog/${post.slug}`}
            className="text-blue-600 hover:underline font-medium"
          >
            Read more →
          </Link>
        </div>
      </Card.Content>
    </Card>
  );
}