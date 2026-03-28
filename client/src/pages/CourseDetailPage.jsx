import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'
import { Icon, faUser, faUsers, faBook, faStar, faStarOutline, faClock, faMobileScreen, faPlay, faCircleQuestion, faClipboardList, faVideo } from '../icons'

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
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-16 animate-pulse space-y-4">
      <div className="h-8 bg-gray-100 rounded w-2/3" />
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="h-24 bg-gray-100 rounded" />
    </div>
  )

  if (error || !course) return (
    <div className="text-center py-20">
      <p className="text-gray-400 text-lg">{error || 'Course not found.'}</p>
      <Link to="/courses" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">← Back to courses</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/courses" className="text-sm text-indigo-600 hover:underline mb-6 inline-block">← All courses</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Info */}
        <div className="lg:col-span-2">
          <p className="text-xs font-medium text-indigo-600 mb-2">{course.categoryName}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

          <div className="flex items-center gap-5 text-sm text-gray-500 mb-8 flex-wrap">
            <span><Icon icon={faUser} className="mr-1.5" />{course.lecturerName}</span>
            {avgRating && <span><Icon icon={faStar} className="text-amber-400 mr-1" />{avgRating} ({reviews.length} reviews)</span>}
            <span><Icon icon={faUsers} className="mr-1.5" />{course.enrollmentCount} students</span>
            <span><Icon icon={faBook} className="mr-1.5" />{totalLectures} lectures</span>
          </div>

          {/* Course content */}
          {modules.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course content</h2>
              <div className="space-y-3">
                {modules.map(module => (
                  <details key={module.id} className="border border-gray-200 rounded-xl overflow-hidden" open>
                    <summary className="flex items-center justify-between px-5 py-3.5 bg-gray-50 cursor-pointer font-medium text-gray-800 text-sm select-none">
                      <span>{module.title}</span>
                      <span className="text-xs text-gray-400 font-normal">
                        {module.lectures?.length ?? 0} lectures
                        {module.quizId ? ' · quiz' : ''}
                      </span>
                    </summary>
                    <ul className="divide-y divide-gray-100">
                      {module.lectures?.map(lecture => (
                        <li key={lecture.id} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-600">
                          <Icon icon={faPlay} className="text-gray-300 text-xs shrink-0" />
                          <span className="flex-1">{lecture.title}</span>
                          {lecture.videoUrl && <Icon icon={faVideo} className="text-xs text-indigo-400" />}
                          {lecture.durationMinutes && (
                            <span className="text-xs text-gray-400">{lecture.durationMinutes} min</span>
                          )}
                        </li>
                      ))}
                      {module.quizId && (
                        <li className="flex items-center gap-3 px-5 py-3 text-sm text-amber-600 bg-amber-50">
                          <Icon icon={faClipboardList} className="text-xs shrink-0" />
                          <span>Module Quiz</span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reviews {reviews.length > 0 && <span className="text-base font-normal text-gray-400">({reviews.length})</span>}
            </h2>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800 text-sm">{r.studentName || 'Student'}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Icon key={s} icon={faStar} className={s <= r.rating ? 'text-amber-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
                    <p className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Enroll card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <p className="text-3xl font-bold text-gray-900 mb-5">${course.price}</p>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            {isEnrolled ? (
              <Link
                to={`/learn/${enrollmentId}`}
                className="block w-full text-center rounded-xl bg-green-600 text-white px-4 py-3 font-semibold text-sm hover:bg-green-500 transition-colors"
              >
                Continue learning
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full rounded-xl bg-indigo-600 text-white px-4 py-3 font-semibold text-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                {enrolling ? 'Enrolling…' : user ? 'Enroll now' : 'Sign in to enroll'}
              </button>
            )}

            <ul className="mt-5 space-y-2 text-sm text-gray-500">
              <li><Icon icon={faBook} className="mr-2 w-4" />{totalLectures} lectures</li>
              {modules.some(m => m.quizId) && <li><Icon icon={faClipboardList} className="mr-2 w-4" />Module quizzes</li>}
              <li><Icon icon={faClock} className="mr-2 w-4" />Full lifetime access</li>
              <li><Icon icon={faMobileScreen} className="mr-2 w-4" />Access on all devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
