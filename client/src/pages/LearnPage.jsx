import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function LearnPage() {
  const { enrollmentId } = useParams()
  const [enrollment, setEnrollment] = useState(null)
  const [activeLecture, setActiveLecture] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/enrollments/${enrollmentId}`)
        setEnrollment(res.data.data)
        // auto-select first lecture
        const first = res.data.data?.course?.modules?.[0]?.lectures?.[0]
        if (first) setActiveLecture(first)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [enrollmentId])

  async function markComplete(lectureId) {
    try {
      await api.post(`/enrollments/${enrollmentId}/lectures/${lectureId}/complete`)
    } catch {
      // ignore
    }
  }

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>
  if (!enrollment) return <p className="text-center py-20 text-red-500">Enrollment not found.</p>

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 text-sm">{enrollment.courseTitle}</h2>
        </div>
        {enrollment.course?.modules?.map(module => (
          <div key={module.id}>
            <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
              {module.title}
            </p>
            {module.lectures?.map(lecture => (
              <button
                key={lecture.id}
                onClick={() => { setActiveLecture(lecture); markComplete(lecture.id) }}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 hover:bg-indigo-50 transition-colors ${
                  activeLecture?.id === lecture.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                }`}
              >
                {lecture.title}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeLecture ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{activeLecture.title}</h1>
            {activeLecture.videoUrl && (
              <div className="aspect-video bg-black rounded-xl mb-6 overflow-hidden">
                <iframe
                  src={activeLecture.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
            {activeLecture.content && (
              <p className="text-gray-700 leading-relaxed">{activeLecture.content}</p>
            )}
          </>
        ) : (
          <p className="text-gray-500">Select a lecture to start learning.</p>
        )}
      </main>
    </div>
  )
}
