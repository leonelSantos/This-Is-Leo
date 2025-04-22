import Image from 'next/image';

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

interface BookRecommendationProps {
  book: Book;
}

export default function BookRecommendation({ book }: BookRecommendationProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex mb-4">
          <div className="w-24 h-36 relative flex-shrink-0 mr-4">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
                No Cover
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{book.title}</h3>
            <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
            <div className="text-sm mb-2">{renderStars(book.rating)}</div>
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {book.category}
            </span>
          </div>
        </div>
        <p className="text-gray-700 text-sm">{book.description}</p>
      </div>
      
      {book.amazonLink && (
        <div className="px-6 pb-6">
          <a
            href={book.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-amber-500 hover:bg-amber-600 text-white text-center py-2 px-4 rounded transition-colors"
          >
            View on Amazon
          </a>
        </div>
      )}
    </div>
  );
}