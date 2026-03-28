import { useState, useEffect } from 'react'
import api from '../api'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      const res = await api.post('/categories', { name: newName })
      setCategories([...categories, res.data.data])
      setNewName('')
    } catch {
      // ignore
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    try {
      await api.put(`/categories/${editId}`, { name: editName })
      setCategories(categories.map(c => c.id === editId ? { ...c, name: editName } : c))
      setEditId(null)
    } catch {
      // ignore
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return
    try {
      await api.delete(`/categories/${id}`)
      setCategories(categories.filter(c => c.id !== id))
    } catch {
      // ignore
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories</h1>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center py-10 text-gray-400">Loading…</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map(cat => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-4">
                {editId === cat.id ? (
                  <form onSubmit={handleUpdate} className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      autoFocus
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button type="submit" className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-xs font-medium hover:bg-indigo-500">Save</button>
                    <button type="button" onClick={() => setEditId(null)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50">Cancel</button>
                  </form>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                    <div className="flex gap-3 text-sm">
                      <button onClick={() => { setEditId(cat.id); setEditName(cat.name) }} className="text-indigo-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline">Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
            {categories.length === 0 && (
              <li className="text-center py-8 text-gray-400 text-sm">No categories yet.</li>
            )}
          </ul>
        )}

        <div className="border-t border-gray-100 px-5 py-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              placeholder="New category name…"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button type="submit" className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
