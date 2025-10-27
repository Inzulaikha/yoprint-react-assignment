import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchAnimeById, type Anime } from '../api/jikan'

export default function DetailPage() {
  const { id } = useParams()
  const [anime, setAnime] = useState<Anime | null>(null)
  const [status, setStatus] = useState<'idle'|'loading'|'succeeded'|'failed'>('idle')
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!id) return
    setStatus('loading')
    const controller = new AbortController()
    fetchAnimeById(id, controller.signal)
      .then(({ data }) => { setAnime(data); setStatus('succeeded') })
      .catch((e) => { if (e?.name !== 'AbortError') { setError(e?.message || 'Failed'); setStatus('failed') } })
    return () => controller.abort()
  }, [id])

  if (status === 'loading') return <div className="container center small">Loading…</div>
  if (status === 'failed') return <div className="container"><p className="small">Failed: {error}</p><Link to="/">← Back</Link></div>
  if (!anime) return <div className="container center small">Not found.</div>

  const img = anime.images?.jpg?.image_url
  return (
    <div className="container">
      <Link to="/">← Back to search</Link>
      <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:20, marginTop:16}}>
        <img src={img || 'https://placehold.co/600x800?text=Anime'} alt={anime.title} style={{width:'100%', borderRadius:12}}/>
        <div>
          <h2 style={{margin:'0 0 6px'}}>{anime.title}</h2>
          <div className="row small" style={{marginBottom:10}}>
            {anime.year ? <span className="badge">{anime.year}</span> : null}
            {typeof anime.score === 'number' ? <span>• ⭐ {anime.score}</span> : null}
            {anime.type ? <span>• {anime.type}</span> : null}
            {anime.episodes ? <span>• {anime.episodes} ep</span> : null}
          </div>
          <p className="small" style={{lineHeight:1.6, whiteSpace:'pre-wrap'}}>
            {anime.synopsis || 'No synopsis available.'}
          </p>
        </div>
      </div>
    </div>
  )
}
