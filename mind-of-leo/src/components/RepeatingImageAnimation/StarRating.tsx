import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  className = '',
}) => {
  // Add special class for perfect 5-star ratings
  const isPerfectRating = rating === maxRating;
  
  return (
    <div className={`flex items-center ${className} ${isPerfectRating ? 'perfect-rating' : ''}`}>
      {[...Array(maxRating)].map((_, i) => (
        <Star key={i} filled={i < rating} isPerfect={isPerfectRating} />
      ))}
      
      {/* Show a small badge for 5-star ratings */}
      {isPerfectRating && (
        <span className="ml-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
          Highly Recommended
        </span>
      )}
    </div>
  );
};

interface StarProps {
  filled: boolean;
  isPerfect?: boolean;
}

const Star: React.FC<StarProps> = ({ filled, isPerfect = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      className={`w-5 h-5 ${
        filled 
          ? isPerfect 
            ? 'text-amber-500 transform scale-110 transition-transform' 
            : 'text-amber-500'
          : 'text-gray-300'
      }`}
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
};

export default StarRating;