import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import { Icon, faCheck, faCircleQuestion, faClock, faPlay } from '../icons'

export default function LearnPage() {
  const { enrollmentId } = useParams()
  const [enrollment, setEnrollment] = useState(null)
  const [modules, setModules] = useState([])
  const [activeItem, setActiveItem] = useState(null) // { type: 'lecture'|'quiz', data: ... }
  const [completedIds, setCompletedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  // Quiz state
  const [quiz, setQuiz] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { [questionId]: answerId }
  const [quizResult, setQuizResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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
        if (first) setActiveItem({ type: 'lecture', data: first })
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [enrollmentId])

  async function selectLecture(lecture) {
    setActiveItem({ type: 'lecture', data: lecture })
    setQuiz(null)
    setQuizResult(null)
    if (!completedIds.has(lecture.id)) {
      try {
        await api.post(`/enrollments/${enrollmentId}/lectures/${lecture.id}/complete`, { watchTimeSeconds: 0 })
        setCompletedIds(prev => new Set([...prev, lecture.id]))
      } catch {
        // ignore
      }
    }
  }

  async function selectQuiz(module) {
    setActiveItem({ type: 'quiz', data: module })
    setSelectedAnswers({})
    setQuizResult(null)
    setQuizLoading(true)
    try {
      const res = await api.get(`/quizzes/module/${module.id}`)
      setQuiz(res.data.data)
    } catch {
      setQuiz(null)
    } finally {
      setQuizLoading(false)
    }
  }

  async function handleSubmitQuiz() {
    if (!quiz) return
    const answers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
      questionId: parseInt(questionId),
      answerId,
    }))
    setSubmitting(true)
    try {
      const res = await api.post(`/quizzes/${quiz.id}/submit`, {
        enrollmentId: parseInt(enrollmentId),
        answers,
      })
      setQuizResult(res.data.data)
    } catch {
      // ignore
    } finally {
      setSubmitting(false)
    }
  }

  function retakeQuiz() {
    setSelectedAnswers({})
    setQuizResult(null)
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
                    activeItem?.type === 'lecture' && activeItem.data.id === lecture.id
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center text-xs ${
                    completedIds.has(lecture.id)
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {completedIds.has(lecture.id) && <Icon icon={faCheck} className="text-[9px]" />}
                  </span>
                  <span className="line-clamp-2">{lecture.title}</span>
                </button>
              ))}
              {module.quizId && (
                <button
                  onClick={() => selectQuiz(module)}
                  className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 flex items-center gap-2.5 hover:bg-amber-50 transition-colors ${
                    activeItem?.type === 'quiz' && activeItem.data.id === module.id
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <Icon icon={faCircleQuestion} className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Module Quiz</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {activeItem?.type === 'lecture' && (
          <div className="max-w-3xl mx-auto px-8 py-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{activeItem.data.title}</h1>
            {activeItem.data.durationMinutes && (
              <p className="text-sm text-gray-400 mb-6"><Icon icon={faClock} className="mr-1.5" />{activeItem.data.durationMinutes} minutes</p>
            )}

            {activeItem.data.videoUrl && (
              <div className="aspect-video bg-black rounded-2xl mb-8 overflow-hidden">
                <iframe
                  src={activeItem.data.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}

            {activeItem.data.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">About this lecture</h2>
                <p className="text-gray-700 leading-relaxed">{activeItem.data.description}</p>
              </div>
            )}
          </div>
        )}

        {activeItem?.type === 'quiz' && (
          <div className="max-w-2xl mx-auto px-8 py-10">
            {quizLoading ? (
              <p className="text-center text-gray-400 animate-pulse">Loading quiz…</p>
            ) : !quiz ? (
              <p className="text-center text-gray-400">Quiz not available.</p>
            ) : quizResult ? (
              /* Results screen */
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div className={`text-5xl font-bold mb-2 ${quizResult.isPassed ? 'text-green-600' : 'text-red-500'}`}>
                  {quizResult.score}%
                </div>
                <p className={`text-lg font-semibold mb-1 ${quizResult.isPassed ? 'text-green-600' : 'text-red-500'}`}>
                  {quizResult.isPassed ? 'Passed!' : 'Not passed'}
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Passing score: {quiz.passingScore}%
                </p>
                <button
                  onClick={retakeQuiz}
                  className="rounded-xl bg-indigo-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors"
                >
                  Retake quiz
                </button>
              </div>
            ) : (
              /* Quiz form */
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{quiz.title}</h1>
                {quiz.description && <p className="text-gray-500 text-sm mb-1">{quiz.description}</p>}
                <p className="text-xs text-gray-400 mb-8">Passing score: {quiz.passingScore}% · {quiz.questions?.length ?? 0} questions</p>

                <div className="space-y-6">
                  {quiz.questions?.map((q, qi) => (
                    <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                      <p className="font-medium text-gray-900 mb-4">
                        {qi + 1}. {q.text}
                        <span className="ml-2 text-xs text-gray-400">({q.points} pt)</span>
                      </p>
                      <div className="space-y-2">
                        {q.answers?.map(a => (
                          <label
                            key={a.id}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                              selectedAnswers[q.id] === a.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              checked={selectedAnswers[q.id] === a.id}
                              onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: a.id }))}
                              className="accent-indigo-600"
                            />
                            <span className="text-sm text-gray-700">{a.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting || Object.keys(selectedAnswers).length < (quiz.questions?.length ?? 0)}
                    className="rounded-xl bg-indigo-600 text-white px-8 py-3 text-sm font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting…' : 'Submit quiz'}
                  </button>
                  {Object.keys(selectedAnswers).length < (quiz.questions?.length ?? 0) && (
                    <p className="text-xs text-gray-400 mt-2">Answer all questions to submit.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!activeItem && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a lecture to start
          </div>
        )}
      </main>
    </div>
  )
}
