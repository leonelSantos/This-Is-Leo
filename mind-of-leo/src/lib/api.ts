/**
 * API utility functions for fetching and managing data
 */

/**
 * Fetches data from an API endpoint with proper error handling
 */
export async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }
  
  /**
   * Fetches Spotify playlist information using the Spotify API
   * Note: This requires valid authentication with Spotify
   */
  export async function fetchSpotifyPlaylist(playlistId: string, accessToken: string) {
    return fetchData<SpotifyPlaylist>(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
  }
  
  /**
   * Submits newsletter signup information
   */
  export async function subscribeToNewsletter(email: string) {
    return fetchData<{ success: boolean; message: string }>(
      '/api/newsletter/subscribe',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
  }
  
  /**
   * Submits a contact form
   */
  export async function submitContactForm(formData: ContactFormData) {
    return fetchData<{ success: boolean; message: string }>(
      '/api/contact',
      {
        method: 'POST',
        body: JSON.stringify(formData),
      }
    );
  }
  
  /**
   * Fetches view count for a specific blog post or cheatsheet
   */
  export async function fetchViewCount(slug: string, contentType: 'blog' | 'cheatsheet') {
    return fetchData<{ views: number }>(
      `/api/views/${contentType}/${slug}`
    );
  }
  
  /**
   * Increments view count for a specific blog post or cheatsheet
   */
  export async function incrementViewCount(slug: string, contentType: 'blog' | 'cheatsheet') {
    return fetchData<{ success: boolean; views: number }>(
      `/api/views/${contentType}/${slug}`,
      {
        method: 'POST',
      }
    );
  }
  
  // Type definitions
  
  export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }
  
  export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    tracks: {
      items: Array<{
        track: {
          id: string;
          name: string;
          artists: Array<{
            id: string;
            name: string;
          }>;
        };
      }>;
      total: number;
    };
    external_urls: {
      spotify: string;
    };
  }