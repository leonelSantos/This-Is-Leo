import { notFound } from 'next/navigation';
import { getMDXBySlug } from '@/lib/mdx';
import Link from 'next/link';

// In a real implementation, this would come from your file system or API
const availableTechnologies = ['react', 'nextjs', 'typescript', 'tailwind'];

export async function generateStaticParams() {
  return availableTechnologies.map((technology) => ({
    technology,
  }));
}

export async function generateMetadata({ params }: { params: { technology: string } }) {
  const { technology } = params;
  
  // Capitalize first letter and add spaces before uppercase letters
  const formattedTitle = technology
    .charAt(0).toUpperCase() 
    + technology.slice(1).replace(/([A-Z])/g, ' $1');
  
  return {
    title: `${formattedTitle} Cheatsheet | YourName.dev`,
    description: `A comprehensive cheatsheet for ${formattedTitle} with code snippets, best practices, and tips.`,
  };
}

export default async function CheatsheetPage({ params }: { params: { technology: string } }) {
  const { technology } = params;
  
  if (!availableTechnologies.includes(technology)) {
    notFound();
  }
  
  // In a real implementation, you would fetch the content from your MDX files
  const content = await getMDXBySlug('cheatsheets', technology);
  
  // For demonstration purposes, we'll just show what this would look like
  const sampleContent = {
    react: {
      title: 'React.js Cheatsheet',
      sections: [
        {
          title: 'Hooks',
          items: [
            { name: 'useState', description: 'State management for function components' },
            { name: 'useEffect', description: 'Side effects in function components' },
            { name: 'useContext', description: 'Access React context within components' },
          ]
        },
        {
          title: 'Component Patterns',
          items: [
            { name: 'Compound Components', description: 'Components with implicit relationships' },
            { name: 'Render Props', description: 'Sharing code between components using a prop' },
          ]
        }
      ]
    },
    nextjs: {
      title: 'Next.js Cheatsheet',
      sections: [
        {
          title: 'App Router',
          items: [
            { name: 'page.tsx', description: 'Defines a route segment with a UI' },
            { name: 'layout.tsx', description: 'Shared UI for a segment and its children' },
            { name: 'loading.tsx', description: 'Loading UI for a segment' },
          ]
        },
        {
          title: 'Data Fetching',
          items: [
            { name: 'Server Components', description: 'Fetch data directly from components' },
            { name: 'fetch API', description: 'Built-in caching and revalidation' },
          ]
        }
      ]
    }
  };

  const techContent = sampleContent[technology as keyof typeof sampleContent] || {
    title: `${technology.charAt(0).toUpperCase() + technology.slice(1)} Cheatsheet`,
    sections: []
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/cheatsheets" className="text-blue-600 hover:underline">
          ← Back to All Cheatsheets
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">{techContent.title}</h1>
      
      <div className="space-y-12">
        {techContent.sections.map((section, i) => (
          <section key={i} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.items.map((item, j) => (
                <div key={j} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// This is a mock function that in reality would fetch MDX content
async function getMDXBySlug(directory: string, slug: string) {
  // In a real implementation, this would read files from the file system
  // or fetch from a CMS/API
  return {
    content: `# ${slug} Cheatsheet\n\nThis is where your MDX content would go.`,
    frontmatter: {
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Cheatsheet`,
      description: `A comprehensive guide to ${slug}`,
      date: new Date().toISOString(),
    },
  };
}