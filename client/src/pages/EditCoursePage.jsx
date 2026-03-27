import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function EditCoursePage() {
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', description: '', price: 0, categoryId: '' })
  const [modules, setModules] = useState([])
  const [newModule, setNewModule] = useState('')
  const [newLecture, setNewLecture] = useState({})   // moduleId -> title
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [courseRes, catRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/categories'),
        ])
        const c = courseRes.data.data
        setForm({ title: c.title, description: c.description, price: c.price, categoryId: c.categoryId ?? '' })
        setModules(c.modules ?? [])
        setCategories(catRes.data.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleSaveCourse(e) {
    e.preventDefault()
    setMessage('')
    try {
      await api.put(`/courses/${id}`, form)
      setMessage('Course saved.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save')
    }
  }

  async function handleAddModule(e) {
    e.preventDefault()
    if (!newModule.trim()) return
    try {
      const res = await api.post('/modules', { courseId: parseInt(id), title: newModule })
      setModules([...modules, { ...res.data.data, lectures: [] }])
      setNewModule('')
    } catch {
      // ignore
    }
  }

  async function handleDeleteModule(moduleId) {
    if (!confirm('Delete this module and all its lectures?')) return
    try {
      await api.delete(`/modules/${moduleId}`)
      setModules(modules.filter(m => m.id !== moduleId))
    } catch {
      // ignore
    }
  }

  async function handleAddLecture(moduleId) {
    const title = newLecture[moduleId]
    if (!title?.trim()) return
    try {
      const res = await api.post('/lectures', { moduleId, title })
      setModules(modules.map(m =>
        m.id === moduleId ? { ...m, lectures: [...(m.lectures ?? []), res.data.data] } : m
      ))
      setNewLecture({ ...newLecture, [moduleId]: '' })
    } catch {
      // ignore
    }
  }

  async function handleDeleteLecture(moduleId, lectureId) {
    try {
      await api.delete(`/lectures/${lectureId}`)
      setModules(modules.map(m =>
        m.id === moduleId ? { ...m, lectures: m.lectures.filter(l => l.id !== lectureId) } : m
      ))
    } catch {
      // ignore
    }
  }

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit course</h1>

      {/* Course info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Course info</h2>
        {message && <p className="text-sm text-indigo-600 mb-3">{message}</p>}
        <form onSubmit={handleSaveCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">— none —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Save
          </button>
        </form>
      </div>

      {/* Modules & Lectures */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Modules & Lectures</h2>

        <div className="space-y-4 mb-5">
          {modules.map(module => (
            <div key={module.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-gray-800">{module.title}</p>
                <button onClick={() => handleDeleteModule(module.id)} className="text-xs text-red-500 hover:underline">
                  Remove
                </button>
              </div>
              <ul className="space-y-1 mb-3">
                {module.lectures?.map(lecture => (
                  <li key={lecture.id} className="flex items-center justify-between text-sm text-gray-600 pl-2">
                    <span>• {lecture.title}</span>
                    <button onClick={() => handleDeleteLecture(module.id, lecture.id)} className="text-xs text-red-400 hover:underline">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New lecture title"
                  value={newLecture[module.id] ?? ''}
                  onChange={e => setNewLecture({ ...newLecture, [module.id]: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleAddLecture(module.id)}
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddModule} className="flex gap-2">
          <input
            type="text"
            placeholder="New module title"
            value={newModule}
            onChange={e => setNewModule(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900"
          >
            Add module
          </button>
        </form>
      </div>
    </div>
  )
}
