import { Metadata } from 'next';
import SpotifyEmbed from '@/components/SpotifyEmbed';

export const metadata: Metadata = {
  title: 'My Spotify Playlists | YourName.dev',
  description: 'Collection of my favorite music playlists for different moods and activities.',
};

type Playlist = {
  id: string;
  title: string;
  description: string;
  mood: string;
  spotifyId: string;
};

const playlists: Playlist[] = [
  {
    id: '1',
    title: 'Hell Bent',
    description: 'Cowboy Shit',
    mood: 'Got \'em ol\' travelling blues',
    spotifyId: '6YgbHmQJzXsOHY9KYhoIV2',
    //<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/6YgbHmQJzXsOHY9KYhoIV2?utm_source=generator" 
    // width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; 
    // fullscreen; 
    // picture-in-picture" 
    // loading="lazy"></iframe>
  },
  {
    id: '2',
    title: 'Easy Come, Easy Go',
    description: 'Cowboy Shit II',
    mood: 'Got \'em ol\' travelling blues',
    spotifyId: '61EMKwEGqA3xyF4TCV6aUv',
    //<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/61EMKwEGqA3xyF4TCV6aUv?utm_source=generator" 
    // width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; 
    // picture-in-picture" loading="lazy"></iframe>
  },
  {
    id: '3',
    title: 'Every Dog Has It\'s Day',
    description: 'Cowboy Shit III',
    mood: 'Got \'em ol\' travelling blues',
    spotifyId: '35r5XbMk4otx7QhUpEn1nw',
    //<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/35r5XbMk4otx7QhUpEn1nw?utm_source=generator" 
    // width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; 
    // fullscreen; picture-in-picture" loading="lazy"></iframe>

  },
  {
    id: '4',
    title: 'Other Side of Nowhere',
    description: 'Cowboy Shit IV',
    mood: 'Got \'em ol\' travelling blues',
    spotifyId: '6sfcz0bqE6GoBGxH0rTeSh',
    //<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/6sfcz0bqE6GoBGxH0rTeSh?utm_source=generator" 
    // width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; 
    // fullscreen; picture-in-picture" loading="lazy"></iframe>
  },
];

export default function PlaylistsPage() {
  // Group playlists by mood
  const playlistsByMood = playlists.reduce((acc, playlist) => {
    if (!acc[playlist.mood]) {
      acc[playlist.mood] = [];
    }
    acc[playlist.mood].push(playlist);
    return acc;
  }, {} as Record<string, Playlist[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">My Spotify Playlists</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Music has always been an essential part of my life and work. Here are some of my carefully curated playlists for different moods and activities.
        </p>
      </header>

      {Object.entries(playlistsByMood).map(([mood, moodPlaylists]) => (
        <section key={mood} className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{mood} Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {moodPlaylists.map((playlist) => (
              <div key={playlist.id} className="bg-zinc-300 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className=" text-black text-xl font-bold mb-2">{playlist.title}</h3>
                  <p className="text-gray-600 mb-4">{playlist.description}</p>
                </div>
                <SpotifyEmbed spotifyId={playlist.spotifyId} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 bg-zinc-700 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Have a playlist suggestion?</h2>
        <p className="mb-6">
          I'm always looking for new music! If you have a playlist you think I'd enjoy, feel free to share it.
        </p>
        <a
          href="mailto:yourname@example.com?subject=Playlist%20Suggestion"
          className="inline-block bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Send Suggestion
        </a>
      </div>
    </div>
  );
}