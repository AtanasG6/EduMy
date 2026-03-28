import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'

export default function LearnPage() {
  const { enrollmentId } = useParams()
  const [enrollment, setEnrollment] = useState(null)
  const [modules, setModules] = useState([])
  const [activeLecture, setActiveLecture] = useState(null)
  const [completedIds, setCompletedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const enrollRes = await api.get(`/enrollments/${enrollmentId}`)
        const e = enrollRes.data.data
        setEnrollment(e)
        const modRes = await api.get(`/modules/course/${e.courseId}`)
        const mods = modRes.data.data ?? []
        setModules(mods)
        const first = mods[0]?.lectures?.[0]
        if (first) setActiveLecture(first)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [enrollmentId])

  async function selectLecture(lecture) {
    setActiveLecture(lecture)
    if (!completedIds.has(lecture.id)) {
      try {
        await api.post(`/enrollments/${enrollmentId}/lectures/${lecture.id}/complete`)
        setCompletedIds(prev => new Set([...prev, lecture.id]))
      } catch {
        // ignore
      }
    }
  }

  const totalLectures = modules.reduce((s, m) => s + (m.lectures?.length ?? 0), 0)
  const completed = completedIds.size

  if (loading) return <p className="text-center py-20 text-gray-400">Loading…</p>
  if (!enrollment) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Enrollment not found.</p>
      <Link to="/dashboard" className="mt-3 inline-block text-indigo-600 hover:underline text-sm">← Dashboard</Link>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <Link to="/dashboard" className="text-xs text-indigo-600 hover:underline block mb-1">← Dashboard</Link>
          <h2 className="font-semibold text-gray-900 text-sm line-clamp-2">{enrollment.courseTitle}</h2>
          {totalLectures > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{completed}/{totalLectures} completed</span>
                <span>{Math.round(completed / totalLectures * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${Math.round(completed / totalLectures * 100)}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {modules.map(module => (
            <div key={module.id}>
              <p className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 sticky top-0">
                {module.title}
              </p>
              {module.lectures?.map(lecture => (
                <button
                  key={lecture.id}
                  onClick={() => selectLecture(lecture)}
                  className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 flex items-start gap-2.5 hover:bg-indigo-50 transition-colors ${
                    activeLecture?.id === lecture.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center text-xs ${
                    completedIds.has(lecture.id)
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {completedIds.has(lecture.id) ? '✓' : ''}
                  </span>
                  <span className="line-clamp-2">{lecture.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {activeLecture ? (
          <div className="max-w-3xl mx-auto px-8 py-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{activeLecture.title}</h1>
            {activeLecture.durationMinutes && (
              <p className="text-sm text-gray-400 mb-6">⏱ {activeLecture.durationMinutes} minutes</p>
            )}

            {activeLecture.videoUrl && (
              <div className="aspect-video bg-black rounded-2xl mb-8 overflow-hidden">
                <iframe src={activeLecture.videoUrl} className="w-full h-full" allowFullScreen />
              </div>
            )}

            {activeLecture.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">About this lecture</h2>
                <p className="text-gray-700 leading-relaxed">{activeLecture.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a lecture to start
          </div>
        )}
      </main>
    </div>
  )
}
