import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'
import { Icon, faUser, faUsers, faBook, faStar, faClock, faMobileScreen, faPlay, faCircleQuestion, faClipboardList, faVideo, faArrowLeft, faInfinity } from '../icons'
import CourseThumbnail from '../CourseThumbnail'
import { getCardAccent } from '../theme'

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
  const totalDuration = modules.reduce((sum, m) =>
    sum + (m.lectures?.reduce((s, l) => s + (l.durationMinutes ?? 0), 0) ?? 0), 0)
  const quizCount = modules.filter(m => m.quizId).length
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-pulse space-y-6">
      <div className="h-4 bg-gray-100 rounded-full w-24" />
      <div className="h-7 bg-gray-100 rounded-full w-2/3" />
      <div className="h-4 bg-gray-100 rounded-full w-1/3" />
      <div className="h-20 bg-gray-100 rounded-xl" />
    </div>
  )

  if (error || !course) return (
    <div className="text-center py-24">
      <p className="text-gray-400 mb-4">{error || 'Course not found.'}</p>
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-950 hover:text-gray-600 transition-colors">
        <Icon icon={faArrowLeft} className="text-xs" />Back to courses
      </Link>
    </div>
  )

  const accent = getCardAccent(course.id)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gray-950 px-6 py-14 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 20% 50%, ${accent}15, transparent 50%)` }}
        />
        <div className="max-w-5xl mx-auto relative">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-300 uppercase tracking-wide mb-6 transition-colors">
            <Icon icon={faArrowLeft} className="text-[10px]" />All courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div
                className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 border"
                style={{ color: accent, borderColor: `${accent}40`, background: `${accent}15` }}
              >
                {course.categoryName}
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight leading-tight mb-3">{course.title}</h1>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-xl">{course.description}</p>
              <div className="flex items-center gap-5 text-sm text-gray-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Icon icon={faUser} className="text-gray-600 text-xs" />
                  {course.lecturerName}
                </span>
                {avgRating && (
                  <span className="flex items-center gap-1.5">
                    <Icon icon={faStar} className="text-amber-400 text-xs" />
                    <span className="font-bold text-white">{avgRating}</span>
                    <span>({reviews.length})</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Icon icon={faUsers} className="text-gray-600 text-xs" />
                  {course.enrollmentCount} students
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon icon={faBook} className="text-gray-600 text-xs" />
                  {totalLectures} lectures
                </span>
              </div>
            </div>

            {/* Sticky enroll card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <CourseThumbnail id={course.id} title={course.title} className="h-36" />
                <div className="p-5">
                  <div className="text-2xl font-black text-gray-950 mb-4">
                    {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
                  </div>

                  {error && (
                    <div className="mb-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
                  )}

                  {isEnrolled ? (
                    <Link
                      to={`/learn/${enrollmentId}`}
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-gray-950 text-white px-4 py-3 font-bold text-sm hover:bg-gray-800 transition-colors"
                    >
                      <Icon icon={faPlay} className="text-xs" />
                      Continue learning
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full rounded-xl bg-indigo-600 text-white px-4 py-3 font-bold text-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                    >
                      {enrolling ? 'Enrolling…' : user ? 'Enroll for free' : 'Sign in to enroll'}
                    </button>
                  )}

                  <ul className="mt-5 space-y-2.5 border-t border-gray-100 pt-5">
                    <li className="flex items-center gap-2.5 text-xs text-gray-500">
                      <Icon icon={faBook} className="text-gray-300 w-3.5 shrink-0" />
                      {totalLectures} on-demand lectures
                    </li>
                    {totalDuration > 0 && (
                      <li className="flex items-center gap-2.5 text-xs text-gray-500">
                        <Icon icon={faClock} className="text-gray-300 w-3.5 shrink-0" />
                        {totalDuration} minutes of content
                      </li>
                    )}
                    {quizCount > 0 && (
                      <li className="flex items-center gap-2.5 text-xs text-gray-500">
                        <Icon icon={faCircleQuestion} className="text-gray-300 w-3.5 shrink-0" />
                        {quizCount} module quiz{quizCount !== 1 ? 'zes' : ''}
                      </li>
                    )}
                    <li className="flex items-center gap-2.5 text-xs text-gray-500">
                      <Icon icon={faInfinity} className="text-gray-300 w-3.5 shrink-0" />
                      Full lifetime access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="lg:max-w-[calc(66.66%-1.25rem)]">
          {/* Course content */}
          {modules.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-black text-gray-950 tracking-tight mb-5">Course content</h2>
              <div className="space-y-2 border border-gray-100 rounded-2xl overflow-hidden">
                {modules.map((module, mi) => (
                  <details key={module.id} className="group" open>
                    <summary className="flex items-center justify-between px-5 py-4 bg-gray-50 cursor-pointer select-none hover:bg-gray-100 transition-colors border-b border-gray-100">
                      <span className="font-bold text-gray-950 text-sm">{module.title}</span>
                      <span className="text-xs text-gray-400 font-medium">
                        {module.lectures?.length ?? 0} lecture{(module.lectures?.length ?? 0) !== 1 ? 's' : ''}
                        {module.quizId ? ' + quiz' : ''}
                      </span>
                    </summary>
                    <ul className="divide-y divide-gray-50 bg-white">
                      {module.lectures?.map(lecture => (
                        <li key={lecture.id} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                            <Icon icon={faPlay} className="text-gray-300 text-[7px] ml-px" />
                          </div>
                          <span className="flex-1">{lecture.title}</span>
                          {lecture.videoUrl && <Icon icon={faVideo} className="text-gray-300 text-xs shrink-0" />}
                          {lecture.durationMinutes && (
                            <span className="text-xs text-gray-400 tabular-nums shrink-0">{lecture.durationMinutes} min</span>
                          )}
                        </li>
                      ))}
                      {module.quizId && (
                        <li className="flex items-center gap-3 px-5 py-3 text-sm">
                          <div className="w-5 h-5 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center shrink-0">
                            <Icon icon={faClipboardList} className="text-amber-400 text-[8px]" />
                          </div>
                          <span className="font-medium text-amber-700">Module Quiz</span>
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
            <h2 className="text-xl font-black text-gray-950 tracking-tight mb-5">
              Reviews
              {reviews.length > 0 && <span className="ml-2 text-base font-normal text-gray-400">({reviews.length})</span>}
            </h2>
            {reviews.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-2xl py-10 text-center">
                <p className="text-sm text-gray-400">No reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600">
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
      </div>
    </div>
  )
}
