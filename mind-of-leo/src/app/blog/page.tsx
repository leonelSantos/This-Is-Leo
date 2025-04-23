import { Metadata } from 'next';
import Link from 'next/link';
import { getAllContent } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Blog | YourName.dev',
  description: 'Articles and opinions on technology, economy, software, science, and more.',
};

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
};

export default async function BlogPage() {
  // In a real implementation, this would come from your MDX files
  const allPosts = await getAllContent('blog') as BlogPost[];
  
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
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          My thoughts and opinions on technology, economy, software, science, and more.
        </p>
      </header>

      {Object.keys(postsByCategory).length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No posts yet</h2>
          <p className="text-gray-600">
            Check back soon for new content!
          </p>
        </div>
      ) : (
        Object.entries(postsByCategory).map(([category, posts]) => (
          <section key={category} className="mb-16">
            <h2 className="text-2xl font-bold mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {post.date ? formatDate(post.date) : 'No date'} • {post.category}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-700 mb-4">{post.description}</p>
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}

      <div className="mt-16 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Looking for a specific topic?</h2>
        <p className="mb-6">
          If you're interested in a particular subject that I haven't covered yet,
          feel free to suggest it. I'm always looking for new topics to explore.
        </p>
        <a
          href="mailto:yourname@example.com?subject=Blog%20Topic%20Suggestion"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Suggest a Topic
        </a>
      </div>
    </div>
  );
}