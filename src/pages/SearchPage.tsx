import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { runSearch, setPage, setQuery, toggleSafe } from '../features/search/searchSlice'
import useDebounce from '../hooks/useDebounce'
import AnimeCard from '../components/AnimeCard'
import Pagination from '../components/Pagination'
import type { Anime } from '../api/jikan'
import { isNsfwQuery, PER_PAGE } from '../api/jikan'

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { query, page, results, lastPage, status, error, total, safeMode } =
    useSelector((s: RootState) => s.search)

  const [input, setInput] = useState(query)
  const debounced = useDebounce(input, 250)

  // keep Redux query in sync with debounced text
  useEffect(() => {
    if (debounced !== query) {
      dispatch(setQuery(debounced))
      dispatch(setPage(1))
    }
  }, [debounced, query, dispatch])

  // apply safeMode styling & subtle transition
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-mode', safeMode ? 'safe' : 'unsafe')
    root.classList.remove('mode-change')
    void root.offsetWidth
    root.classList.add('mode-change')
    return () => root.setAttribute('data-mode', 'safe')
  }, [safeMode])

  // fetch whenever these change (debounced via setQuery above)
  useEffect(() => {
    if (query || page) dispatch(runSearch({ query, page }))
  }, [dispatch, query, page, safeMode])

  // clear NSFW input instantly when Safe Mode is ON
  useEffect(() => {
    if (safeMode && isNsfwQuery(input)) {
      setInput('')
      dispatch(setQuery(''))
      dispatch(setPage(1))
    }
  }, [safeMode, input, dispatch])

  // No client-side filtering needed - API handles it with sfw=true
  // Just trim to exactly PER_PAGE cards
  const pageItems = results.slice(0, PER_PAGE)

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

      {status === 'failed' && (
        <div className="center small">
          {error?.includes('429')
            ? '⚠️ Too many requests — please wait a moment…'
            : `Error: ${error}`}
        </div>
      )}

      {status === 'loading' && (
        <div className="skeleton-grid">
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <div className="skeleton-card" key={i} />
          ))}
        </div>
      )}

      {pageItems.length === 0 && status !== 'loading' && !error && (
        <div className="center small">No results. Try another title.</div>
      )}

      {pageItems.length > 0 && (
        <>
          <div className="small" style={{ marginTop: 10 }}>
            Showing {pageItems.length} of {total || '…'} results {safeMode && '• SFW'}
          </div>

          <div className="grid" key={`${safeMode}-${query}-${page}`}>
            {pageItems.map((a: Anime) => (
              <AnimeCard key={a.mal_id} item={a} />
            ))}
          </div>

          <Pagination page={page} lastPage={lastPage} onChange={p => dispatch(setPage(p))} />
        </>
      )}
    </div>
  )
}