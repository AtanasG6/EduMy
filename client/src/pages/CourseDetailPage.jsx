import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'
import { Icon, faUser, faUsers, faBook, faStar, faClock, faMobileScreen, faPlay, faCircleQuestion, faClipboardList, faVideo, faArrowLeft, faInfinity } from '../icons'
import CourseThumbnail from '../CourseThumbnail'

export default function CourseDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState('')
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrollmentId, setEnrollmentId] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [courseRes, modulesRes, reviewsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/modules/course/${id}`),
          api.get(`/reviews/course/${id}`),
        ])
        setCourse(courseRes.data.data)
        setModules(modulesRes.data.data ?? [])
        setReviews(reviewsRes.data.data ?? [])
        if (user) {
          const enrollRes = await api.get('/enrollments')
          const found = enrollRes.data.data?.find(e => e.courseId === parseInt(id))
          if (found) { setIsEnrolled(true); setEnrollmentId(found.id) }
        }
      } catch {
        setError('Course not found.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, user])

  async function handleEnroll() {
    if (!user) { navigate('/login'); return }
    setEnrolling(true)
    try {
      const res = await api.post(`/enrollments/course/${id}`)
      navigate(`/learn/${res.data.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed')
      setEnrolling(false)
    }
  }

  const totalLectures = modules.reduce((sum, m) => sum + (m.lectures?.length ?? 0), 0)
  const totalDuration = modules.reduce((sum, m) => sum + (m.lectures?.reduce((s, l) => s + (l.durationMinutes ?? 0), 0) ?? 0), 0)
  const quizCount = modules.filter(m => m.quizId).length
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-pulse space-y-5">
      <div className="h-4 bg-gray-100 rounded-full w-24" />
      <div className="h-7 bg-gray-100 rounded-full w-2/3" />
      <div className="h-20 bg-gray-100 rounded-xl" />
    </div>
  )

  if (error || !course) return (
    <div className="text-center py-20">
      <p className="text-gray-400 mb-4">{error || 'Course not found.'}</p>
      <Link to="/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        <Icon icon={faArrowLeft} className="mr-1 text-xs" />Back to courses
      </Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-8">
        <Icon icon={faArrowLeft} className="text-xs" />All courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left */}
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold text-indigo-600 mb-2">{course.categoryName}</p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3 leading-tight">{course.title}</h1>
          <p className="text-gray-600 mb-5 leading-relaxed">{course.description}</p>

          <div className="flex items-center gap-5 text-sm text-gray-500 mb-10 flex-wrap">
            <span className="flex items-center gap-1.5"><Icon icon={faUser} className="text-gray-400 text-xs" />{course.lecturerName}</span>
            {avgRating && <span className="flex items-center gap-1.5"><Icon icon={faStar} className="text-amber-400 text-xs" />{avgRating} ({reviews.length} reviews)</span>}
            <span className="flex items-center gap-1.5"><Icon icon={faUsers} className="text-gray-400 text-xs" />{course.enrollmentCount} students</span>
            <span className="flex items-center gap-1.5"><Icon icon={faBook} className="text-gray-400 text-xs" />{totalLectures} lectures</span>
          </div>

          {/* Course content */}
          {modules.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course content</h2>
              <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {modules.map(module => (
                  <details key={module.id} className="group" open>
                    <summary className="flex items-center justify-between px-5 py-4 bg-gray-50 cursor-pointer select-none hover:bg-gray-100 transition-colors">
                      <span className="font-semibold text-gray-800 text-sm">{module.title}</span>
                      <span className="text-xs text-gray-400">
                        {module.lectures?.length ?? 0} lecture{(module.lectures?.length ?? 0) !== 1 ? 's' : ''}
                        {module.quizId ? ' + quiz' : ''}
                      </span>
                    </summary>
                    <ul className="divide-y divide-gray-50 bg-white">
                      {module.lectures?.map(lecture => (
                        <li key={lecture.id} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                            <Icon icon={faPlay} className="text-gray-400 text-[7px] ml-px" />
                          </div>
                          <span className="flex-1">{lecture.title}</span>
                          {lecture.videoUrl && <Icon icon={faVideo} className="text-gray-300 text-xs shrink-0" />}
                          {lecture.durationMinutes && <span className="text-xs text-gray-400 shrink-0">{lecture.durationMinutes} min</span>}
                        </li>
                      ))}
                      {module.quizId && (
                        <li className="flex items-center gap-3 px-5 py-3 text-sm text-amber-700 bg-amber-50">
                          <div className="w-5 h-5 rounded-full border border-amber-200 bg-amber-100 flex items-center justify-center shrink-0">
                            <Icon icon={faClipboardList} className="text-amber-500 text-[8px]" />
                          </div>
                          <span className="font-medium">Module Quiz</span>
                        </li>
                      )}
                    </ul>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Reviews {reviews.length > 0 && <span className="text-base font-normal text-gray-400">({reviews.length})</span>}
            </h2>
            {reviews.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-2xl py-10 text-center">
                <p className="text-sm text-gray-400">No reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {(r.studentName || 'S')[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{r.studentName || 'Student'}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Icon key={s} icon={faStar} className={`text-xs ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Enroll card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
            <CourseThumbnail id={course.id} title={course.title} className="h-36" />
            <div className="p-6">
              <div className="text-2xl font-bold text-gray-900 mb-4">
                {parseFloat(course.price) === 0 ? <span className="text-green-600">Free</span> : `$${course.price}`}
              </div>

              {error && <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}

              {isEnrolled ? (
                <Link
                  to={`/learn/${enrollmentId}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-green-600 text-white px-4 py-3 font-semibold text-sm hover:bg-green-500 transition-colors"
                >
                  <Icon icon={faPlay} className="text-xs" />Continue learning
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full rounded-xl bg-indigo-600 text-white px-4 py-3 font-semibold text-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {enrolling ? 'Enrolling…' : user ? 'Enroll for free' : 'Sign in to enroll'}
                </button>
              )}

              <ul className="mt-5 space-y-2.5 border-t border-gray-100 pt-5">
                <li className="flex items-center gap-2.5 text-sm text-gray-600"><Icon icon={faBook} className="text-gray-400 w-3.5 shrink-0" />{totalLectures} lectures</li>
                {totalDuration > 0 && <li className="flex items-center gap-2.5 text-sm text-gray-600"><Icon icon={faClock} className="text-gray-400 w-3.5 shrink-0" />{totalDuration} min of content</li>}
                {quizCount > 0 && <li className="flex items-center gap-2.5 text-sm text-gray-600"><Icon icon={faCircleQuestion} className="text-gray-400 w-3.5 shrink-0" />{quizCount} quiz{quizCount !== 1 ? 'zes' : ''}</li>}
                <li className="flex items-center gap-2.5 text-sm text-gray-600"><Icon icon={faInfinity} className="text-gray-400 w-3.5 shrink-0" />Lifetime access</li>
                <li className="flex items-center gap-2.5 text-sm text-gray-600"><Icon icon={faMobileScreen} className="text-gray-400 w-3.5 shrink-0" />All devices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
