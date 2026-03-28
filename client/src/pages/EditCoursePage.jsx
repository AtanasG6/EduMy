import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'

export default function EditCoursePage() {
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', description: '', price: 0, categoryId: '' })
  const [modules, setModules] = useState([])
  const [newModule, setNewModule] = useState('')
  const [newLecture, setNewLecture] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [courseStatus, setCourseStatus] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [courseRes, catRes, modRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/categories'),
          api.get(`/modules/course/${id}`),
        ])
        const c = courseRes.data.data
        setForm({ title: c.title, description: c.description ?? '', price: c.price, categoryId: c.categoryId ?? '' })
        setCourseStatus(c.status)
        setModules(modRes.data.data ?? [])
        setCategories(catRes.data.data ?? [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleSave(e) {
    e.preventDefault()
    setMessage('')
    try {
      await api.put(`/courses/${id}`, {
        ...form,
        price: parseFloat(form.price),
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      })
      setMessage('Saved.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save')
    }
  }

  async function handlePublish() {
    try {
      await api.post(`/courses/${id}/publish`)
      setCourseStatus('Published')
      setMessage('Course published!')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to publish')
    }
  }

  async function handleAddModule(e) {
    e.preventDefault()
    if (!newModule.trim()) return
    try {
      const res = await api.post(`/modules/course/${id}`, { title: newModule })
      setModules([...modules, { ...res.data.data, lectures: [] }])
      setNewModule('')
    } catch {
      // ignore
    }
  }

  async function handleDeleteModule(moduleId) {
    if (!confirm('Delete module and all its lectures?')) return
    try {
      await api.delete(`/modules/${moduleId}`)
      setModules(modules.filter(m => m.id !== moduleId))
    } catch {
      // ignore
    }
  }

  async function handleAddLecture(moduleId) {
    const title = newLecture[moduleId]?.trim()
    if (!title) return
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

  if (loading) return <p className="text-center py-20 text-gray-400 animate-pulse">Loading…</p>

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/my-courses" className="text-sm text-indigo-600 hover:underline block mb-1">← My Courses</Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit course</h1>
        </div>
        {courseStatus !== 'Published' && (
          <button
            onClick={handlePublish}
            className="rounded-xl bg-green-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-green-500 transition-colors"
          >
            Publish course
          </button>
        )}
        {courseStatus === 'Published' && (
          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium">Published</span>
        )}
      </div>

      {/* Course info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Course info</h2>
        {message && (
          <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">— none —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors">
            Save
          </button>
        </form>
      </div>

      {/* Modules */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Modules & Lectures</h2>
        <div className="space-y-4 mb-5">
          {modules.map(module => (
            <div key={module.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-gray-800 text-sm">{module.title}</p>
                <button onClick={() => handleDeleteModule(module.id)} className="text-xs text-red-400 hover:text-red-600">
                  Remove module
                </button>
              </div>
              <ul className="space-y-1.5 mb-3">
                {module.lectures?.map(lecture => (
                  <li key={lecture.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border border-gray-100">
                    <span className="text-gray-700">▶ {lecture.title}</span>
                    <button onClick={() => handleDeleteLecture(module.id, lecture.id)} className="text-xs text-red-400 hover:text-red-600 ml-3 shrink-0">
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New lecture title…"
                  value={newLecture[module.id] ?? ''}
                  onChange={e => setNewLecture({ ...newLecture, [module.id]: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddLecture(module.id))}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleAddLecture(module.id)}
                  className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm font-medium hover:bg-indigo-500 transition-colors"
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
            placeholder="New module title…"
            value={newModule}
            onChange={e => setNewModule(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button type="submit" className="rounded-lg bg-gray-800 text-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-700 transition-colors">
            + Module
          </button>
        </form>
      </div>
    </div>
  )
}
