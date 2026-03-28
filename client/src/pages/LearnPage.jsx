import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import { Icon, faCheck, faCircleQuestion, faClock, faPlay, faArrowLeft, faTrophy, faLayerGroup } from '../icons'
import VideoPlayer from '../VideoPlayer'

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
  const progressPct = totalLectures > 0 ? Math.round(completed / totalLectures * 100) : 0

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-57px)] bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading course…</p>
      </div>
    </div>
  )

  if (!enrollment) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Enrollment not found.</p>
      <Link to="/dashboard" className="mt-3 inline-flex items-center gap-1.5 text-indigo-600 hover:underline text-sm">
        <Icon icon={faArrowLeft} />Dashboard
      </Link>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-500 mb-3 font-medium">
            <Icon icon={faArrowLeft} className="text-[10px]" />
            Back to My Learning
          </Link>
          <h2 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">
            {enrollment.courseTitle}
          </h2>

          {totalLectures > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>{completed} of {totalLectures} lectures</span>
                <span className="font-semibold text-indigo-600">{progressPct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modules + Lectures */}
        <div className="overflow-y-auto flex-1">
          {modules.map((module, mi) => (
            <div key={module.id} className="border-b border-gray-100 last:border-0">
              {/* Module header */}
              <div className="flex items-center gap-2.5 px-4 py-3 bg-gray-50">
                <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center shrink-0">
                  <Icon icon={faLayerGroup} className="text-indigo-500 text-[9px]" />
                </div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex-1 line-clamp-1">
                  {module.title}
                </p>
              </div>

              {/* Lectures */}
              {module.lectures?.map(lecture => {
                const isActive = activeItem?.type === 'lecture' && activeItem.data.id === lecture.id
                const isDone = completedIds.has(lecture.id)
                return (
                  <button
                    key={lecture.id}
                    onClick={() => selectLecture(lecture)}
                    className={`w-full text-left px-4 py-3 text-sm flex items-start gap-3 hover:bg-indigo-50 transition-colors border-l-2 ${
                      isActive
                        ? 'bg-indigo-50 border-l-indigo-500'
                        : 'border-l-transparent'
                    }`}
                  >
                    {/* Completion circle */}
                    <span className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center text-xs transition-colors ${
                      isDone
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : isActive
                          ? 'border-indigo-300'
                          : 'border-gray-300'
                    }`}>
                      {isDone
                        ? <Icon icon={faCheck} className="text-[8px]" />
                        : <Icon icon={faPlay} className="text-[7px] text-gray-400 ml-px" />
                      }
                    </span>
                    <span className={`line-clamp-2 leading-snug ${isActive ? 'text-indigo-700 font-medium' : isDone ? 'text-gray-500' : 'text-gray-700'}`}>
                      {lecture.title}
                    </span>
                  </button>
                )
              })}

              {/* Quiz button */}
              {module.quizId && (
                <button
                  onClick={() => selectQuiz(module)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-amber-50 transition-colors border-l-2 ${
                    activeItem?.type === 'quiz' && activeItem.data.id === module.id
                      ? 'bg-amber-50 border-l-amber-500'
                      : 'border-l-transparent'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Icon icon={faCircleQuestion} className="text-amber-500 text-[9px]" />
                  </span>
                  <span className={`font-medium ${
                    activeItem?.type === 'quiz' && activeItem.data.id === module.id
                      ? 'text-amber-700'
                      : 'text-gray-600'
                  }`}>
                    Module Quiz
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {activeItem?.type === 'lecture' && (
          <div className="max-w-3xl mx-auto px-8 py-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{activeItem.data.title}</h1>
            {activeItem.data.durationMinutes && (
              <p className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
                <Icon icon={faClock} />
                {activeItem.data.durationMinutes} minutes
              </p>
            )}

            {activeItem.data.videoUrl ? (
              <div className="rounded-2xl mb-8 overflow-hidden shadow-md">
                <VideoPlayer src={activeItem.data.videoUrl} />
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-2xl mb-8 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Icon icon={faPlay} className="text-3xl mb-2" />
                  <p className="text-sm">No video available</p>
                </div>
              </div>
            )}

            {activeItem.data.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-widest text-gray-500">About this lecture</h2>
                <p className="text-gray-700 leading-relaxed">{activeItem.data.description}</p>
              </div>
            )}
          </div>
        )}

        {activeItem?.type === 'quiz' && (
          <div className="max-w-2xl mx-auto px-8 py-10">
            {quizLoading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading quiz…</p>
              </div>
            ) : !quiz ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Icon icon={faCircleQuestion} className="text-4xl text-gray-300 mb-3" />
                <p className="text-gray-400">Quiz not available.</p>
              </div>
            ) : quizResult ? (
              /* Results screen */
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
                  quizResult.isPassed ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <Icon icon={faTrophy} className={`text-3xl ${quizResult.isPassed ? 'text-green-500' : 'text-red-400'}`} />
                </div>
                <div className={`text-5xl font-extrabold mb-2 ${quizResult.isPassed ? 'text-green-600' : 'text-red-500'}`}>
                  {quizResult.score}%
                </div>
                <p className={`text-lg font-semibold mb-1 ${quizResult.isPassed ? 'text-green-600' : 'text-red-500'}`}>
                  {quizResult.isPassed ? 'Passed!' : 'Not passed'}
                </p>
                <p className="text-sm text-gray-400 mb-8">
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
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Icon icon={faCircleQuestion} className="text-amber-500 text-xs" />
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                  </div>
                  {quiz.description && <p className="text-gray-500 text-sm mb-1">{quiz.description}</p>}
                  <p className="text-xs text-gray-400">
                    Passing score: {quiz.passingScore}% · {quiz.questions?.length ?? 0} questions
                  </p>
                </div>

                <div className="space-y-5">
                  {quiz.questions?.map((q, qi) => (
                    <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <p className="font-semibold text-gray-900 mb-4">
                        <span className="text-indigo-600 mr-1.5">{qi + 1}.</span>
                        {q.text}
                        <span className="ml-2 text-xs font-normal text-gray-400">({q.points} pt)</span>
                      </p>
                      <div className="space-y-2">
                        {q.answers?.map(a => (
                          <label
                            key={a.id}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                              selectedAnswers[q.id] === a.id
                                ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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

                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting || Object.keys(selectedAnswers).length < (quiz.questions?.length ?? 0)}
                    className="rounded-xl bg-indigo-600 text-white px-8 py-3 text-sm font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting…' : 'Submit quiz'}
                  </button>
                  {Object.keys(selectedAnswers).length < (quiz.questions?.length ?? 0) && (
                    <p className="text-xs text-gray-400">
                      {(quiz.questions?.length ?? 0) - Object.keys(selectedAnswers).length} question{(quiz.questions?.length ?? 0) - Object.keys(selectedAnswers).length !== 1 ? 's' : ''} remaining
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!activeItem && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <Icon icon={faPlay} className="text-2xl text-indigo-400" />
            </div>
            <p className="text-gray-500 font-medium">Select a lecture to start learning</p>
            <p className="text-sm text-gray-400 mt-1">Choose from the sidebar on the left</p>
          </div>
        )}
      </main>
    </div>
  )
}
