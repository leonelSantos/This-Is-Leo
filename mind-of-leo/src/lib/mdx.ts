import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

// Define paths
const contentDirectory = path.join(process.cwd(), 'src/content');

// Define type for frontmatter
interface Frontmatter {
  slug: string;
  title: string;
  description: string;
  date?: string;
  [key: string]: any; // For any other properties in frontmatter
}

// Get all files in a directory
export function getFiles(directory: string) {
  const dirPath = path.join(contentDirectory, directory);
  const files = fs.readdirSync(dirPath);
  return files.filter(file => file.endsWith('.mdx'));
}

// Parse MDX file with frontmatter
export async function getMDXBySlug(directory: string, slug: string) {
  const filePath = path.join(contentDirectory, directory, `${slug}.mdx`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    const mdxSource = await compileMDX({
      source: content,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          rehypePlugins: [
            rehypeSlug,
            rehypeHighlight,
          ],
          remarkPlugins: [
            remarkGfm,
          ],
        },
      },
    });
    
    return {
      content: mdxSource,
      frontmatter: {
        ...data,
        slug,
      } as Frontmatter,
    };
  } catch (error) {
    console.error(`Error reading MDX file ${filePath}:`, error);
    return {
      content: null,
      frontmatter: {
        title: 'Content Not Found',
        description: 'The requested content could not be loaded.',
        slug,
      } as Frontmatter,
    };
  }
}

// Get all posts/cheatsheets with frontmatter
export async function getAllContent(directory: string): Promise<Frontmatter[]> {
  const files = getFiles(directory);
  
  const content = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, '');
      const { frontmatter } = await getMDXBySlug(directory, slug);
      return frontmatter;
    })
  );
  
  // Sort content by date if it exists
  return content.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}