import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'

export default function CourseDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/courses/${id}`)
        setCourse(res.data.data)
      } catch {
        setMessage('Course not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleEnroll() {
    if (!user) { navigate('/login'); return }
    setEnrolling(true)
    try {
      await api.post(`/enrollments/course/${id}`)
      navigate('/dashboard')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>
  if (!course) return <p className="text-center py-20 text-red-500">{message}</p>

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
      <p className="text-gray-500 mb-6">{course.description}</p>

      <div className="flex items-center gap-6 mb-8">
        <span className="text-2xl font-bold text-indigo-600">${course.price}</span>
        <span className="text-sm text-gray-400">{course.lectureCount} lectures</span>
      </div>

      {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

      <button
        onClick={handleEnroll}
        disabled={enrolling}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {enrolling ? 'Enrolling...' : 'Enroll now'}
      </button>

      {course.modules && course.modules.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course content</h2>
          <div className="space-y-3">
            {course.modules.map(module => (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-800">{module.title}</p>
                {module.lectures && (
                  <ul className="mt-2 space-y-1">
                    {module.lectures.map(lecture => (
                      <li key={lecture.id} className="text-sm text-gray-500 pl-3">
                        • {lecture.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
