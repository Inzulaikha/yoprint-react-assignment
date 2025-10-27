import { Link } from 'react-router-dom'
import type { Anime } from '../api/jikan'
import { useRef, useState } from 'react'

export default function AnimeCard({ item }: { item: Anime }) {
  const img = item.images?.jpg?.image_url
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  const onMove = (e: React.MouseEvent) => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const el = ref.current;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const rx = ((y / r.height) - 0.5) * -8;
  const ry = ((x / r.width) - 0.5) * 8;
  el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
}
  const reset = () => { const el = ref.current; if (el) el.style.transform = '' }

  return (
    <div className="card tilt" onMouseMove={onMove} onMouseLeave={reset} ref={ref}>
      <Link to={`/anime/${item.mal_id}`}>
        <div className={`img-wrap ${loaded ? 'loaded' : ''}`}>
          <img
            src={img || 'https://placehold.co/600x800?text=Anime'}
            alt={item.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>
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
