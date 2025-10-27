const BASE = 'https://api.jikan.moe/v4'

export type Anime = {
  mal_id: number
  title: string
  images?: { jpg?: { image_url?: string } }
  score?: number
  type?: string
  episodes?: number
  synopsis?: string
  year?: number
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

export async function searchAnime(q: string, page: number, signal?: AbortSignal): Promise<SearchResponse> {
  const url = new URL(`${BASE}/anime`)
  if (q) url.searchParams.set('q', q)
  url.searchParams.set('page', String(page || 1))
  url.searchParams.set('limit', '12')
  const res = await fetch(url.toString(), { signal })
  if (!res.ok) throw new Error(`Search failed (${res.status})`)
  return res.json()
}

export async function fetchAnimeById(id: string, signal?: AbortSignal) {
  const res = await fetch(`${BASE}/anime/${id}/full`, { signal })
  if (!res.ok) throw new Error(`Detail failed (${res.status})`)
  return res.json() as Promise<{ data: Anime }>
}
