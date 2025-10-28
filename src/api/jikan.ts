const BASE = 'https://api.jikan.moe/v4'
export const PER_PAGE = 15 // show 15 per page

export type Anime = {
  mal_id: number
  title: string
  images?: { jpg?: { image_url?: string } }
  score?: number
  type?: string
  episodes?: number
  synopsis?: string
  year?: number
  rating?: string
}

export type SearchResponse = {
  data: Anime[]
  pagination: {
    current_page: number
    last_visible_page: number
    has_next_page: boolean
    items: { count: number; total: number; per_page: number }
  }
}

export type Rating = 'G' | 'PG' | 'PG-13' | 'R' | 'R+' | 'Rx' | string
export const isMature = (rating?: Rating) => rating?.startsWith('R+') || rating === 'Rx'

// --- NEW: helper terms + detector for NSFW queries ---
export const NSFW_TERMS = ['nsfw', 'hentai', 'r18', 'adult', 'ecchi', 'ero', 'x-rated']
export const isNsfwQuery = (q?: string) => {
  if (!q) return false
  const s = q.toLowerCase()
  return NSFW_TERMS.some(t => s.includes(t))
}

export async function searchAnime(
  q: string,
  page: number,
  signal?: AbortSignal,
  sfw = true
): Promise<SearchResponse> {
  const url = new URL(`${BASE}/anime`)
  if (q) url.searchParams.set('q', q)
  url.searchParams.set('page', String(page || 1))
  url.searchParams.set('limit', String(PER_PAGE)) // now 15 per page
  if (sfw) url.searchParams.set('sfw', 'true') // block adult content server-side

  const res = await fetch(url.toString(), { signal })
  if (!res.ok) throw new Error(`Search failed (${res.status})`)
  return res.json()
}

export async function fetchAnimeById(id: string, signal?: AbortSignal) {
  const res = await fetch(`${BASE}/anime/${id}/full`, { signal })
  if (!res.ok) throw new Error(`Detail failed (${res.status})`)
  return res.json() as Promise<{ data: Anime }>
}
