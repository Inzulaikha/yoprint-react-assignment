import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { searchAnime, type SearchResponse } from '../../api/jikan'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SearchState = {
  query: string
  page: number
  status: Status
  error?: string
  results: SearchResponse['data']
  lastPage: number
  total: number
  safeMode: boolean
}

const initialState: SearchState = {
  query: '',
  page: 1,
  status: 'idle',
  results: [],
  lastPage: 1,
  total: 0,
  safeMode: true,
}

export const runSearch = createAsyncThunk<
  { res: SearchResponse; query: string; page: number },
  { query: string; page: number },
  { state: RootState }
>('search/run', async ({ query, page }, thunkAPI) => {
  const controller = new AbortController()
  thunkAPI.signal.addEventListener('abort', () => controller.abort())
  const { safeMode } = thunkAPI.getState().search
  const res = await searchAnime(query, page, controller.signal, safeMode)
  return { res, query, page }
})

const slice = createSlice({
  name: 'search',
  initialState: {
    ...initialState,
    safeMode: JSON.parse(localStorage.getItem('safeMode') ?? 'true'),
  } as SearchState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) { state.query = action.payload; state.page = 1 },
    setPage(state, action: PayloadAction<number>) { state.page = action.payload },
    toggleSafe(state) {
      state.safeMode = !state.safeMode
      localStorage.setItem('safeMode', JSON.stringify(state.safeMode))
    },
    reset: () => initialState,
  },
  extraReducers: b => {
    b.addCase(runSearch.pending, (s) => { s.status = 'loading'; s.error = undefined })
     .addCase(runSearch.fulfilled, (s, a) => {
       const { res, query, page } = a.payload
       s.status = 'succeeded'
       s.query = query
       s.page = page
       s.results = res.data
       s.lastPage = res.pagination.last_visible_page
       s.total = res.pagination.items?.total ?? 0
     })
     .addCase(runSearch.rejected, (s, a) => {
       if (a.error.name === 'AbortError') s.status = 'idle'
       else { s.status = 'failed'; s.error = a.error.message }
     })
  }
})

export const { setQuery, setPage, toggleSafe, reset } = slice.actions
export default slice.reducer