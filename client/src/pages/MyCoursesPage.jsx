import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/courses/my')
        setCourses(res.data.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <Link
          to="/my-courses/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + New course
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">You haven't created any courses yet.</p>
      ) : (
        <div className="space-y-3">
          {courses.map(course => (
            <div key={course.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{course.title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                  course.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {course.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link to={`/my-courses/${course.id}/edit`} className="text-indigo-600 hover:underline">
                  Edit
                </Link>
                {course.status !== 'Published' && (
                  <button onClick={() => handlePublish(course.id)} className="text-green-600 hover:underline">
                    Publish
                  </button>
                )}
                <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
