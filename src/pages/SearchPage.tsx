import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { runSearch, setPage, setQuery, toggleSafe } from '../features/search/searchSlice'
import useDebounce from '../hooks/useDebounce'
import AnimeCard from '../components/AnimeCard'
import Pagination from '../components/Pagination'
import type { Anime } from '../api/jikan'
import { isMature } from '../api/jikan'

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { query, page, results, lastPage, status, error, total, safeMode } =
    useSelector((s: RootState) => s.search)

  const [input, setInput] = useState(query)
  const debounced = useDebounce(input, 250)
  const firstLoad = useRef(true)


  useEffect(() => {
    dispatch(setQuery(debounced))
  }, [debounced, dispatch])


  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-mode', safeMode ? 'safe' : 'unsafe')


    root.classList.remove('mode-change')

    void root.offsetWidth
    root.classList.add('mode-change')

    return () => root.setAttribute('data-mode', 'safe')
  }, [safeMode])

  useEffect(() => {
    if (firstLoad.current) firstLoad.current = false
    dispatch(runSearch({ query, page }))
  }, [dispatch, query, page])


  const safeResults = safeMode ? results.filter(a => !isMature((a as any).rating)) : results

  return (
    <div className="container">
      <div className="page-head">
        <h2 className="page-title">Anime Search</h2>

        <div className="head-right">
          <label className="switch small" aria-label="Toggle Safe Mode">
            <input
              type="checkbox"
              checked={safeMode}
              onChange={() => dispatch(toggleSafe())}
            />
            <span></span>
          </label>
          <span className="safe-caption" aria-live="polite">
            {safeMode ? 'Safe Mode: On' : 'Safe Mode: Off'}
          </span>
        </div>
      </div>

      <input
        className="input"
        placeholder="Search anime titles…"
        value={input}
        onChange={e => setInput(e.target.value)}
        autoFocus
      />

      {status === 'loading' && (
        <div className="skeleton-grid">
          {Array.from({ length: 12 }).map((_, i) => <div className="skeleton-card" key={i} />)}
        </div>
      )}

      {status === 'failed' && <div className="center small">Error: {error}</div>}
      {safeResults.length === 0 && status !== 'loading' && (
        <div className="center small">No results. Try another title.</div>
      )}

      {safeResults.length > 0 && (
        <>
          <div className="small" style={{ marginTop: 10 }}>
            Showing {safeResults.length} of {total || '…'} results {safeMode && '• SFW'}
          </div>

          <div className="grid" key={`${safeMode}-${query}-${page}`}>
            {safeResults.map((a: Anime) => <AnimeCard key={a.mal_id} item={a} />)}
          </div>

          <Pagination page={page} lastPage={lastPage} onChange={(p) => dispatch(setPage(p))} />
        </>
      )}
    </div>
  )
}
