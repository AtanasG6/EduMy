import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api'

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 9

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data ?? [])).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { page, pageSize }
    if (search) params.search = search
    if (categoryId) params.categoryId = categoryId
    api.get('/courses', { params })
      .then(r => { setCourses(r.data.data?.items ?? []); setTotalCount(r.data.data?.totalCount ?? 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, categoryId, page])

  function setParam(key, value) {
    const p = Object.fromEntries(searchParams)
    if (value) p[key] = value; else delete p[key]
    delete p.page
    setSearchParams(p)
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Courses</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Search courses…"
          defaultValue={search}
          onKeyDown={e => e.key === 'Enter' && setParam('search', e.target.value)}
          onBlur={e => setParam('search', e.target.value)}
          className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm w-64 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <select
          value={categoryId}
          onChange={e => setParam('categoryId', e.target.value)}
          className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-100" />
              <div className="p-5 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No courses found.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{totalCount} course{totalCount !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center">
                  <span className="text-5xl">📚</span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium text-indigo-600 mb-1">{course.categoryName}</p>
                  <h2 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {course.title}
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">by {course.lecturerName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${course.price}</span>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {course.averageRating > 0 && <span>⭐ {course.averageRating.toFixed(1)}</span>}
                      <span>{course.enrollmentCount} students</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: i + 1 })}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
