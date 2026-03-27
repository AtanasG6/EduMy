import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/courses', { params: { search, page: 1, pageSize: 12 } })
        setCourses(res.data.data.items)
      } catch {
        setError('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [search])

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Courses</h1>

      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm mb-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {courses.length === 0 ? (
        <p className="text-gray-500">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-gray-900 mb-1">{course.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.description}</p>
              <p className="text-indigo-600 font-medium text-sm">${course.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
