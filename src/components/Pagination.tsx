type Props = { page: number; lastPage: number; onChange: (p: number) => void }
export default function Pagination({ page, lastPage, onChange }: Props) {
  return (
    <div className="pagination">
      <button className="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button>
      <span className="small" style={{padding:'8px 12px'}}>Page {page} / {lastPage || 1}</span>
      <button className="button" disabled={page >= lastPage} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  )
}
