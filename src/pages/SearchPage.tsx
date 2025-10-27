import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { runSearch, setPage, setQuery } from '../features/search/searchSlice'
import useDebounce from '../hooks/useDebounce'
import AnimeCard from '../components/AnimeCard'
import Pagination from '../components/Pagination'

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { query, page, results, lastPage, status, error, total } =
    useSelector((s: RootState) => s.search)

  const [input, setInput] = useState(query)
  const debounced = useDebounce(input, 250)
  const firstLoad = useRef(true)

  useEffect(() => { dispatch(setQuery(debounced)) }, [debounced, dispatch])

  useEffect(() => {
    if (firstLoad.current) firstLoad.current = false
    dispatch(runSearch({ query, page }))
  }, [dispatch, query, page])

  return (
    <div className="container">
      <div className="header"><h2 style={{margin:0}}>Anime Search</h2></div>

      <input
        className="input"
        placeholder="Search anime titles…"
        value={input}
        onChange={e => setInput(e.target.value)}
        autoFocus
      />

      {status === 'loading' && <div className="center small">Loading…</div>}
      {status === 'failed' && <div className="center small">Error: {error}</div>}
      {results.length === 0 && status !== 'loading' && <div className="center small">No results. Try another title.</div>}

      {results.length > 0 && (
        <div>
          <div className="small" style={{marginTop:10}}>
            Showing {results.length} of {total || '…'} results
          </div>
          <div className="grid">
            {results.map((a) => (
              <AnimeCard key={a.mal_id} item={a} />
            ))}
          </div>
          <Pagination page={page} lastPage={lastPage} onChange={(p)=>dispatch(setPage(p))}/>
        </div>
      )}
    </div>
  )
}
