import { useState, useEffect } from 'react'
import api from '../api'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/categories')
        setCategories(res.data.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
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

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <ul className="divide-y divide-gray-100 mb-4">
            {categories.map(cat => (
              <li key={cat.id} className="py-3 flex items-center justify-between">
                {editId === cat.id ? (
                  <form onSubmit={handleUpdate} className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      autoFocus
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="text-sm text-indigo-600 hover:underline">Save</button>
                    <button type="button" onClick={() => setEditId(null)} className="text-sm text-gray-400 hover:underline">Cancel</button>
                  </form>
                ) : (
                  <>
                    <span className="text-gray-800">{cat.name}</span>
                    <div className="flex gap-3 text-sm">
                      <button onClick={() => { setEditId(cat.id); setEditName(cat.name) }} className="text-indigo-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline">Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              placeholder="New category name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
