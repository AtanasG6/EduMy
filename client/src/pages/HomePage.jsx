import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'
import { Icon, faArrowRight, faPlay, faBook, faGraduationCap, faStar, faFire, faCircleCheck } from '../icons'
import CourseThumbnail from '../CourseThumbnail'

export default function HomePage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [enrollments, setEnrollments] = useState([])

  useEffect(() => {
    api.get('/courses', { params: { page: 1, pageSize: 6 } }).then(r => setCourses(r.data.data?.items ?? [])).catch(() => {})
    api.get('/categories').then(r => setCategories(r.data.data ?? [])).catch(() => {})
    if (user) {
      api.get('/enrollments').then(r => setEnrollments(r.data.data ?? [])).catch(() => {})
    }
  }, [user])

  const inProgress = enrollments.filter(e => !e.isCompleted)
  const completed = enrollments.filter(e => e.isCompleted)

  return (
    <div className="bg-white">
      {/* Hero — personalized if logged in */}
      {user ? (
        <section className="border-b border-gray-100 bg-gradient-to-br from-white to-indigo-50/60 px-6 py-14">
          <div className="max-w-5xl mx-auto">
            <p className="text-indigo-500 text-sm font-medium mb-1">Welcome back</p>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
              {user.firstName} {user.lastName}
            </h1>
            <div className="grid grid-cols-3 gap-4 max-w-sm">
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{enrollments.length}</div>
                <div className="text-xs text-gray-400 mt-0.5">Enrolled</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm">
                <div className="text-2xl font-bold text-indigo-600">{inProgress.length}</div>
                <div className="text-xs text-gray-400 mt-0.5">In progress</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">{completed.length}</div>
                <div className="text-xs text-gray-400 mt-0.5">Completed</div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b border-gray-100 bg-gradient-to-br from-white to-indigo-50/60 px-6 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight leading-tight text-gray-900 mb-5">
              Learn without limits
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
              Expert-led courses with video lectures, quizzes, and progress tracking — completely free to start.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-7 py-3 text-sm font-semibold shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Browse courses <Icon icon={faArrowRight} className="text-xs" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-700 px-7 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Sign up free
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Continue learning */}
      {inProgress.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Icon icon={faFire} className="text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">Continue learning</h2>
            </div>
            <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500">
              My Learning <Icon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {inProgress.slice(0, 3).map(e => (
              <Link
                key={e.id}
                to={`/learn/${e.id}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <CourseThumbnail id={e.courseId} title={e.courseTitle} src={e.courseCoverImageUrl} className="h-36" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors mb-3">
                    {e.courseTitle}
                  </h3>
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>{e.progressPercent}% complete</span>
                    <span className="text-indigo-600 font-medium">Continue</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${e.progressPercent}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Completed courses */}
      {completed.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={faCircleCheck} className="text-green-500" />
            <h2 className="text-xl font-bold text-gray-900">Completed</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {completed.map(e => (
              <Link
                key={e.id}
                to={`/courses/${e.courseId}`}
                className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 hover:border-green-300 transition-colors"
              >
                <Icon icon={faCircleCheck} className="text-green-500 text-xs shrink-0" />
                <span className="text-sm font-medium text-gray-700">{e.courseTitle}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Browse by category</h2>
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
            <h2 className="text-xl font-bold text-gray-900">
              {user ? 'Explore more courses' : 'Featured courses'}
            </h2>
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

      {/* How it works — only for guests */}
      {!user && (
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
      )}
    </div>
  )
}
