'use client';

import { useEffect, useRef } from 'react';

interface SpotifyEmbedProps {
  spotifyId: string;
  width?: number | string;
  height?: number | string;
}

export default function SpotifyEmbed({ 
  spotifyId, 
  width = '100%', 
  height = 352 
}: SpotifyEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // This ensures that if the component is rendered on the client side,
    // the iframe gets the correct src attribute
    if (iframeRef.current) {
      iframeRef.current.src = `https://open.spotify.com/embed/playlist/${spotifyId}`;
    }
  }, [spotifyId]);

  return (
    <div className="spotify-embed w-full">
      <iframe
        ref={iframeRef}
        style={{ width, height }}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={`Spotify Playlist ${spotifyId}`}
      />
    </div>
  );
}