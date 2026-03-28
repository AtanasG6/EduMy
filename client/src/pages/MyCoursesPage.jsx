import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const STATUS_COLORS = {
  Published: 'bg-green-100 text-green-700',
  Draft: 'bg-yellow-100 text-yellow-700',
  Archived: 'bg-gray-100 text-gray-500',
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/courses/my')
      .then(r => setCourses(r.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this course?')) return
    try {
      await api.delete(`/courses/${id}`)
      setCourses(courses.filter(c => c.id !== id))
    } catch {
      // ignore
    }
  }

  async function handlePublish(id) {
    try {
      await api.post(`/courses/${id}/publish`)
      setCourses(courses.map(c => c.id === id ? { ...c, status: 'Published' } : c))
    } catch {
      // ignore
    }
  }

  async function handleArchive(id) {
    try {
      await api.post(`/courses/${id}/archive`)
      setCourses(courses.map(c => c.id === id ? { ...c, status: 'Archived' } : c))
    } catch {
      // ignore
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <Link
          to="/my-courses/new"
          className="rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors"
        >
          + New course
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse h-16" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-4">🎓</p>
          <p className="text-gray-500 mb-5">You haven't created any courses yet.</p>
          <Link
            to="/my-courses/new"
            className="inline-block rounded-xl bg-indigo-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-indigo-500"
          >
            Create your first course
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
              <tr>
                <th className="px-5 py-3.5 text-left">Title</th>
                <th className="px-5 py-3.5 text-left">Status</th>
                <th className="px-5 py-3.5 text-left">Students</th>
                <th className="px-5 py-3.5 text-left">Price</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{course.title}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[course.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{course.enrollmentCount}</td>
                  <td className="px-5 py-4 text-gray-500">${course.price}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link to={`/my-courses/${course.id}/edit`} className="text-indigo-600 hover:underline">Edit</Link>
                      {course.status === 'Draft' && (
                        <button onClick={() => handlePublish(course.id)} className="text-green-600 hover:underline">Publish</button>
                      )}
                      {course.status === 'Published' && (
                        <button onClick={() => handleArchive(course.id)} className="text-yellow-600 hover:underline">Archive</button>
                      )}
                      <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
