import { Link } from 'react-router-dom'
import type { Anime } from '../api/jikan'

export default function AnimeCard({ item }: { item: Anime }) {
  const img = item.images?.jpg?.image_url
  return (
    <div className="card">
      <Link to={`/anime/${item.mal_id}`}>
        <img src={img || 'https://placehold.co/600x800?text=Anime'} alt={item.title}/>
      </Link>
      <div className="p">
        <p className="title">{item.title}</p>
        <div className="row small" style={{marginTop:6}}>
          <span className="badge">{item.type || 'Anime'}</span>
          {item.episodes ? <span>• {item.episodes} ep</span> : null}
          {typeof item.score === 'number' ? <span>• ⭐ {item.score}</span> : null}
        </div>
      </div>
    </div>
  )
}
