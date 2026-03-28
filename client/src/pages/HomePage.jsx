import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import { Icon, faArrowRight, faPlay, faBook, faGraduationCap, faStar } from '../icons'
import CourseThumbnail from '../CourseThumbnail'

export default function HomePage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.get('/courses', { params: { page: 1, pageSize: 6 } }).then(r => setCourses(r.data.data?.items ?? [])).catch(() => {})
    api.get('/categories').then(r => setCategories(r.data.data ?? [])).catch(() => {})
  }, [])

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-5">
            Learn without limits
          </h1>
          <p className="text-lg text-indigo-100 mb-10 max-w-xl mx-auto">
            Expert-led courses with video lectures, quizzes, and progress tracking — completely free to start.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-indigo-700 px-7 py-3 text-sm font-semibold shadow hover:bg-indigo-50 transition-colors"
            >
              Browse courses
              <Icon icon={faArrowRight} className="text-xs" />
            </Link>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 text-white px-7 py-3 text-sm font-semibold hover:bg-white/20 transition-colors"
              >
                Sign up free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by category</h2>
          <div className="flex flex-wrap gap-2.5">
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
            <Link to="/courses" className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              View all <Icon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <CourseThumbnail id={course.id} title={course.title} src={course.coverImageUrl} className="h-40" />
                <div className="p-5">
                  <p className="text-xs font-medium text-indigo-600 mb-1.5">{course.categoryName}</p>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
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
        </section>
      )}

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { icon: faBook, title: 'Find a course', desc: 'Browse expert-built courses across programming, design, and more.' },
              { icon: faPlay, title: 'Learn and practice', desc: 'Watch video lectures, answer quizzes, and track your progress.' },
              { icon: faGraduationCap, title: 'Master your craft', desc: 'Complete courses and build the hands-on skills that matter.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                  <Icon icon={item.icon} className="text-indigo-600 text-lg" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
