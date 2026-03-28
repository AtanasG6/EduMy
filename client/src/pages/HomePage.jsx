import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import { Icon, faBook, faUsers } from '../icons'

export default function HomePage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.get('/courses', { params: { page: 1, pageSize: 6 } }).then(r => setCourses(r.data.data?.items ?? [])).catch(() => {})
    api.get('/categories').then(r => setCategories(r.data.data ?? [])).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">Learn without limits</h1>
          <p className="text-xl text-indigo-100 mb-10">
            Thousands of courses taught by real instructors. Start learning today.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/courses"
              className="rounded-xl bg-white text-indigo-700 px-8 py-3 font-semibold text-sm shadow hover:bg-indigo-50 transition-colors"
            >
              Browse courses
            </Link>
            {!user && (
              <Link
                to="/register"
                className="rounded-xl border border-white/40 bg-white/10 text-white px-8 py-3 font-semibold text-sm hover:bg-white/20 transition-colors"
              >
                Sign up free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/courses?categoryId=${cat.id}`}
                className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-sm"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Courses */}
      {courses.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured courses</h2>
            <Link to="/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                  <Icon icon={faBook} className="text-5xl text-indigo-400" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium text-indigo-600 mb-1">{course.categoryName}</p>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">by {course.lecturerName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${course.price}</span>
                    <span className="text-xs text-gray-400">{course.enrollmentCount} students</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
