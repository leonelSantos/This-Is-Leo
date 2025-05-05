import React, { useRef, useEffect, forwardRef } from 'react';
import SpotifyEmbed from './SpotifyEmbed';

type Playlist = {
  id: string;
  title: string;
  description: string;
  mood: string;
  spotifyId: string;
};

interface ParallaxScrollCardProps {
  playlist: Playlist;
  index: number;
  className?: string;
}

const ParallaxScrollCard = forwardRef<HTMLDivElement, ParallaxScrollCardProps>(
  ({ playlist, index, className = '' }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const spotifyRef = useRef<HTMLDivElement>(null);
    
    // Handle hover animations
    const handleMouseEnter = () => {
      if (contentRef.current) {
        contentRef.current.style.transform = 'translateY(-5px)';
      }
      if (spotifyRef.current) {
        spotifyRef.current.style.transform = 'translateY(-3px)';
      }
    };
    
    const handleMouseLeave = () => {
      if (contentRef.current) {
        contentRef.current.style.transform = 'translateY(0)';
      }
      if (spotifyRef.current) {
        spotifyRef.current.style.transform = 'translateY(0)';
      }
    };
    
    // Apply staggered reveal animation on load
    useEffect(() => {
      const card = ref as React.MutableRefObject<HTMLDivElement>;
      if (card && card.current) {
        // Set initial state (slightly offset based on index)
        card.current.style.opacity = '0';
        card.current.style.transform = `translateY(${20 + index * 10}px)`;
        
        // Add slight delay based on index for staggered reveal
        const timeout = setTimeout(() => {
          card.current.style.opacity = '1';
          card.current.style.transform = 'translateY(0)';
        }, 100 + index * 150);
        
        return () => clearTimeout(timeout);
      }
    }, [index, ref]);
    
    return (
      <div 
        ref={ref}
        className={`playlist-card transition-all duration-1000 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-zinc-300 rounded-lg shadow-md overflow-hidden transition-all duration-500">
          <div 
            ref={contentRef}
            className="p-6 transition-transform duration-500"
          >
            <h3 className="text-black text-xl font-bold mb-2">{playlist.title}</h3>
            <p className="text-gray-600 mb-4">{playlist.description}</p>
          </div>
          
          <div 
            ref={spotifyRef}
            className="transition-transform duration-500"
          >
            <SpotifyEmbed spotifyId={playlist.spotifyId} />
          </div>
        </div>
      </div>
    );
  }
);

ParallaxScrollCard.displayName = 'ParallaxScrollCard';

export default ParallaxScrollCard;