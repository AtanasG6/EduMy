import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api'
import { Icon, faStar, faUsers, faSearch, faXmark } from '../icons'
import CourseThumbnail from '../CourseThumbnail'

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')

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

  function handleSearch(e) {
    e.preventDefault()
    setParam('search', searchInput)
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
        <p className="text-gray-500 mt-1 text-sm">Expand your skills with expert-built courses</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-8">
        <form onSubmit={handleSearch} className="relative">
          <Icon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white pl-9 pr-9 py-2.5 text-sm w-60 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(''); setParam('search', '') }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Icon icon={faXmark} className="text-xs" />
            </button>
          )}
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setParam('categoryId', '')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${!categoryId ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setParam('categoryId', c.id.toString())}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${categoryId === c.id.toString() ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-100" />
              <div className="p-5 space-y-2.5">
                <div className="h-3 bg-gray-100 rounded-full w-1/4" />
                <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <Icon icon={faSearch} className="text-4xl text-gray-300 mb-4" />
          <p className="font-semibold text-gray-700 mb-1">No courses found</p>
          <p className="text-sm text-gray-400 mb-6">Try different search terms or clear the filters</p>
          {(search || categoryId) && (
            <button
              onClick={() => { setSearchInput(''); setSearchParams({}) }}
              className="rounded-lg bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 hover:bg-indigo-500 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-5">
            <span className="font-semibold text-gray-900">{totalCount}</span> course{totalCount !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <CourseThumbnail id={course.id} title={course.title} className="h-40" />
                <div className="p-5">
                  <p className="text-xs font-medium text-indigo-600 mb-1.5">{course.categoryName}</p>
                  <h2 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {course.title}
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">by {course.lecturerName}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-base font-bold text-gray-900">
                      {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {course.averageRating > 0 && (
                        <span className="flex items-center gap-1">
                          <Icon icon={faStar} className="text-amber-400 text-[10px]" />
                          {course.averageRating.toFixed(1)}
                        </span>
                      )}
                      <span>{course.enrollmentCount} students</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 mt-12">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: i + 1 })}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                    page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
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
