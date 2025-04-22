import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllContent } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Tech Cheatsheets | YourName.dev',
  description: 'Quick reference guides for various programming languages, frameworks, and tools.',
};

type Cheatsheet = {
  slug: string;
  title: string;
  description: string;
  icon: string;
};

export default async function CheatsheetsPage() {
  // In a real implementation, this would come from your MDX files
  // Using the imported getAllContent function
  const allCheatsheets = await getAllContent('cheatsheets') as Cheatsheet[];
  
  // Group cheatsheets by first letter for alphabetical organization
  const cheatsheetsByLetter = allCheatsheets.reduce((acc, cheatsheet) => {
    const firstLetter = cheatsheet.title.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(cheatsheet);
    return acc;
  }, {} as Record<string, Cheatsheet[]>);
  
  // Sort the letters alphabetically
  const sortedLetters = Object.keys(cheatsheetsByLetter).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Tech Cheatsheets</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Quick reference guides for programming languages, frameworks, libraries, and tools
          that I use regularly.
        </p>
      </header>

      <div className="mb-12">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">About These Cheatsheets</h2>
          <p className="mb-4">
            These cheatsheets are my personal notes and references that I've compiled
            while working with various technologies. They include common patterns,
            snippets, and best practices that I find myself reaching for frequently.
          </p>
          <p>
            Feel free to bookmark them for your own reference. If you spot any errors
            or have suggestions for improvements, please let me know!
          </p>
        </div>
      </div>

      {sortedLetters.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No cheatsheets yet</h2>
          <p className="text-gray-600">
            Check back soon for new content!
          </p>
        </div>
      ) : (
        sortedLetters.map((letter) => (
          <section key={letter} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">{letter}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cheatsheetsByLetter[letter].map((cheatsheet) => (
                <Link 
                  key={cheatsheet.slug} 
                  href={`/cheatsheets/${cheatsheet.slug}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex items-start"
                >
                  <div className="mr-4 h-12 w-12 relative flex-shrink-0">
                    {cheatsheet.icon ? (
                      <Image
                        src={`/images/${cheatsheet.icon}`}
                        alt={`${cheatsheet.title} icon`}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        {cheatsheet.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{cheatsheet.title}</h3>
                    <p className="text-gray-600 text-sm">{cheatsheet.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}

      <div className="mt-16 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="mb-6">
          If you'd like to see a cheatsheet for a specific technology that isn't
          listed here, feel free to request it. I'm always expanding my reference library.
        </p>
        <a
          href="mailto:yourname@example.com?subject=Cheatsheet%20Request"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Request a Cheatsheet
        </a>
      </div>
    </div>
  );
}

// REMOVED: The local implementation of getAllContent that was causing the conflict