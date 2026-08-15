/**
 * MyAnimeList (MAL) API v2 Integration Service
 * 
 * Features:
 * - OAuth2 Token Request with Client Credentials & In-memory caching (1 hour TTL)
 * - fetchAnimeList(query, limit) for catalog searching
 * - getAnimeDetails(id) for deep anime metadata (synopsis, studios, pictures, recommendations)
 * - Automatic HTTP 429 Rate-Limit retry with exponential backoff
 */

const MAL_API_BASE_URL = "https://api.myanimelist.net/v2";
const MAL_OAUTH_TOKEN_URL = "https://myanimelist.net/api/oauth2/token";

export interface MALPicture {
  medium: string;
  large?: string;
}

export interface MALGenre {
  id: number;
  name: string;
}

export interface MALAnimeNode {
  id: number;
  title: string;
  main_picture?: MALPicture;
  mean?: number;
  num_episodes?: number;
  media_type?: string;
  status?: string;
  genres?: MALGenre[];
  synopsis?: string;
}

export interface MALSearchResponse {
  data: Array<{
    node: MALAnimeNode;
  }>;
  paging?: {
    next?: string;
    previous?: string;
  };
}

export interface MALAnimeDetail extends MALAnimeNode {
  alternative_titles?: {
    synonyms?: string[];
    en?: string;
    ja?: string;
  };
  start_season?: {
    year: number;
    season: string;
  };
  broadcast?: {
    day_of_the_week: string;
    start_time?: string;
  };
  studios?: Array<{ id: number; name: string }>;
  pictures?: MALPicture[];
  recommendations?: Array<{
    node: MALAnimeNode;
    num_recommendations: number;
  }>;
  related_anime?: Array<{
    node: MALAnimeNode;
    relation_type: string;
    relation_type_formatted: string;
  }>;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number; // Unix timestamp in ms
}

let cachedToken: CachedToken | null = null;

/**
 * Requests or retrieves cached OAuth2 Access Token
 */
export async function getMALAccessToken(): Promise<string> {
  const now = Date.now();

  // Return existing token if not expired (with 60-second buffer)
  if (cachedToken && cachedToken.expiresAt - now > 60 * 1000) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.MAL_CLIENT_ID;
  const clientSecret = process.env.MAL_CLIENT_SECRET;

  if (!clientId) {
    throw new Error("MAL_CLIENT_ID is missing. Please configure it in your .env.local file.");
  }

  // If Client Secret is available, exchange for OAuth2 access token
  if (clientSecret) {
    try {
      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      });

      const res = await fetch(MAL_OAUTH_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`OAuth token exchange failed with status ${res.status}`);
      }

      const data = await res.json();
      cachedToken = {
        accessToken: data.access_token,
        expiresAt: now + (data.expires_in || 3600) * 1000,
      };

      return cachedToken.accessToken;
    } catch (err) {
      console.warn("[MAL Service] OAuth grant failed, falling back to Client-ID header:", err);
    }
  }

  // Fallback: return clientId for X-MAL-CLIENT-ID header
  return clientId;
}

/**
 * Generic fetcher with automatic authentication, retries, and error handling
 */
async function malFetch<T>(endpoint: string, searchParams: Record<string, string> = {}): Promise<T> {
  const token = await getMALAccessToken();
  const url = new URL(`${MAL_API_BASE_URL}${endpoint}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (cachedToken && token === cachedToken.accessToken) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["X-MAL-CLIENT-ID"] = token;
  }

  // Retry with exponential backoff on 429 Rate Limits
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    const response = await fetch(url.toString(), {
      headers,
      next: { revalidate: 300 }, // Cache response for 5 minutes
    });

    if (response.status === 429) {
      const waitMs = attempts * 1000;
      console.warn(`[MAL API] Rate limited (429). Retrying in ${waitMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      continue;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[MAL API Error] ${response.status} ${response.statusText}: ${errorText}`);
    }

    return (await response.json()) as T;
  }

  throw new Error("[MAL API] Request failed after maximum retry attempts due to rate-limiting.");
}

/**
 * Searches the MyAnimeList catalog
 */
export async function fetchAnimeList(query: string, limit = 20): Promise<MALSearchResponse> {
  if (!query.trim()) {
    return { data: [] };
  }

  return malFetch<MALSearchResponse>("/anime", {
    q: query.trim(),
    limit: limit.toString(),
    fields: "id,title,main_picture,mean,num_episodes,media_type,status,genres",
  });
}

/**
 * Fetches detailed metadata for a specific anime by ID
 */
export async function getAnimeDetails(animeId: number | string): Promise<MALAnimeDetail> {
  const fields = [
    "id",
    "title",
    "main_picture",
    "alternative_titles",
    "start_season",
    "broadcast",
    "synopsis",
    "mean",
    "num_episodes",
    "media_type",
    "status",
    "genres",
    "pictures",
    "recommendations",
    "related_anime",
    "studios",
  ].join(",");

  return malFetch<MALAnimeDetail>(`/anime/${animeId}`, {
    fields,
  });
}
