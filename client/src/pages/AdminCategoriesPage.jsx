import { useState, useEffect } from 'react'
import api from '../api'
import { Icon, faPlus, faPen, faTrash } from '../icons'
import Modal from '../Modal'
import ConfirmModal from '../ConfirmModal'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Add modal
  const [addModal, setAddModal] = useState(false)
  const [addName, setAddName] = useState('')
  const [addDesc, setAddDesc] = useState('')
  const [addSaving, setAddSaving] = useState(false)

  // Edit modal
  const [editModal, setEditModal] = useState(null) // { id, name, description }
  const [editSaving, setEditSaving] = useState(false)

  // Confirm delete
  const [confirm, setConfirm] = useState(null) // { id, name }
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!addName.trim()) return
    setAddSaving(true)
    try {
      const res = await api.post('/categories', { name: addName, description: addDesc || null })
      setCategories([...categories, res.data.data])
      setAddName('')
      setAddDesc('')
      setAddModal(false)
    } catch {
      // ignore
    } finally {
      setAddSaving(false)
    }
  }

  async function handleEdit(e) {
    e.preventDefault()
    if (!editModal?.name?.trim()) return
    setEditSaving(true)
    try {
      await api.put(`/categories/${editModal.id}`, { name: editModal.name, description: editModal.description || null })
      setCategories(categories.map(c => c.id === editModal.id ? { ...c, name: editModal.name, description: editModal.description } : c))
      setEditModal(null)
    } catch {
      // ignore
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm) return
    setConfirmLoading(true)
    try {
      await api.delete(`/categories/${confirm.id}`)
      setCategories(categories.filter(c => c.id !== confirm.id))
      setConfirm(null)
    } catch {
      // ignore
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Add Category Modal */}
      {addModal && (
        <Modal title="Add category" onClose={() => setAddModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
              <input
                type="text"
                autoFocus
                value={addName}
                onChange={e => setAddName(e.target.value)}
                placeholder="e.g. Programming"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <input
                type="text"
                value={addDesc}
                onChange={e => setAddDesc(e.target.value)}
                placeholder="Short description (optional)"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setAddModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={addSaving} className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50">
                {addSaving ? 'Saving…' : 'Add category'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Category Modal */}
      {editModal && (
        <Modal title="Edit category" onClose={() => setEditModal(null)}>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
              <input
                type="text"
                autoFocus
                value={editModal.name}
                onChange={e => setEditModal({ ...editModal, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <input
                type="text"
                value={editModal.description ?? ''}
                onChange={e => setEditModal({ ...editModal, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setEditModal(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={editSaving} className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50">
                {editSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {confirm && (
        <ConfirmModal
          title="Delete category"
          message={`Delete "${confirm.name}"? Courses in this category won't be deleted.`}
          confirmLabel="Delete"
          loading={confirmLoading}
          onConfirm={handleDelete}
          onClose={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => { setAddName(''); setAddDesc(''); setAddModal(true) }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors"
        >
          <Icon icon={faPlus} />
          Add category
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-px">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map(cat => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                  {cat.description && <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditModal({ id: cat.id, name: cat.name, description: cat.description ?? '' })}
                    className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <Icon icon={faPen} className="text-xs" />Edit
                  </button>
                  <button
                    onClick={() => setConfirm({ id: cat.id, name: cat.name })}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400"
                  >
                    <Icon icon={faTrash} className="text-xs" />Delete
                  </button>
                </div>
              </li>
            ))}
            {categories.length === 0 && (
              <li className="text-center py-8 text-gray-400 text-sm">No categories yet.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
