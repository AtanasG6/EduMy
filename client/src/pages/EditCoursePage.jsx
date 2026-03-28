import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import { Icon, faVideo, faClipboardList, faPlay, faXmark, faPlus, faPen, faTrash } from '../icons'
import Modal from '../Modal'
import ConfirmModal from '../ConfirmModal'

export default function EditCoursePage() {
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', description: '', price: 0, categoryId: '' })
  const [modules, setModules] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [courseStatus, setCourseStatus] = useState('')

  // Modal state
  const [addModuleModal, setAddModuleModal] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState('')

  const [addLectureModal, setAddLectureModal] = useState(null) // moduleId
  const [lectureForm, setLectureForm] = useState({ title: '', videoUrl: '', durationMinutes: '' })

  const [addQuizModal, setAddQuizModal] = useState(null) // moduleId
  const [quizForm, setQuizForm] = useState({ title: '', description: '', passingScore: 70 })

  const [addQuestionModal, setAddQuestionModal] = useState(null) // { moduleId, quizId }
  const [questionForm, setQuestionForm] = useState({ text: '', points: 1, answers: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] })

  const [confirm, setConfirm] = useState(null) // { title, message, onConfirm }
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [courseRes, catRes, modRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/categories'),
          api.get(`/modules/course/${id}`),
        ])
        const c = courseRes.data.data
        setForm({ title: c.title, description: c.description ?? '', price: c.price, categoryId: c.categoryId ?? '' })
        setCourseStatus(c.status)
        setCategories(catRes.data.data ?? [])

        const mods = modRes.data.data ?? []
        const modsWithQuizzes = await Promise.all(mods.map(async m => {
          if (!m.quizId) return { ...m, quiz: null }
          try {
            const qRes = await api.get(`/quizzes/module/${m.id}`)
            return { ...m, quiz: qRes.data.data }
          } catch {
            return { ...m, quiz: null }
          }
        }))
        setModules(modsWithQuizzes)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleSave(e) {
    e.preventDefault()
    setMessage('')
    try {
      await api.put(`/courses/${id}`, {
        ...form,
        price: parseFloat(form.price),
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      })
      setMessage('Saved.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save')
    }
  }

  async function handlePublish() {
    try {
      await api.post(`/courses/${id}/publish`)
      setCourseStatus('Published')
      setMessage('Course published!')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to publish')
    }
  }

  // --- Module ---
  async function handleAddModule(e) {
    e.preventDefault()
    if (!newModuleTitle.trim()) return
    try {
      const res = await api.post(`/modules/course/${id}`, { title: newModuleTitle })
      setModules([...modules, { ...res.data.data, lectures: [], quiz: null }])
      setNewModuleTitle('')
      setAddModuleModal(false)
    } catch {
      // ignore
    }
  }

  function confirmDeleteModule(module) {
    setConfirm({
      title: 'Delete module',
      message: `Delete "${module.title}" and all its lectures?`,
      onConfirm: async () => {
        await api.delete(`/modules/${module.id}`)
        setModules(modules.filter(m => m.id !== module.id))
      },
    })
  }

  // --- Lecture ---
  async function handleAddLecture(e) {
    e.preventDefault()
    if (!lectureForm.title.trim()) return
    try {
      const res = await api.post(`/lectures/module/${addLectureModal}`, {
        title: lectureForm.title,
        videoUrl: lectureForm.videoUrl || null,
        durationMinutes: lectureForm.durationMinutes ? parseInt(lectureForm.durationMinutes) : null,
      })
      setModules(modules.map(m =>
        m.id === addLectureModal ? { ...m, lectures: [...(m.lectures ?? []), res.data.data] } : m
      ))
      setLectureForm({ title: '', videoUrl: '', durationMinutes: '' })
      setAddLectureModal(null)
    } catch {
      // ignore
    }
  }

  function confirmDeleteLecture(moduleId, lecture) {
    setConfirm({
      title: 'Delete lecture',
      message: `Delete "${lecture.title}"?`,
      onConfirm: async () => {
        await api.delete(`/lectures/${lecture.id}`)
        setModules(modules.map(m =>
          m.id === moduleId ? { ...m, lectures: m.lectures.filter(l => l.id !== lecture.id) } : m
        ))
      },
    })
  }

  // --- Quiz ---
  async function handleCreateQuiz(e) {
    e.preventDefault()
    if (!quizForm.title.trim()) return
    try {
      const res = await api.post(`/quizzes/module/${addQuizModal}`, {
        title: quizForm.title,
        description: quizForm.description || null,
        passingScore: parseInt(quizForm.passingScore) || 70,
      })
      setModules(modules.map(m =>
        m.id === addQuizModal ? { ...m, quizId: res.data.data.id, quiz: { ...res.data.data, questions: [] } } : m
      ))
      setQuizForm({ title: '', description: '', passingScore: 70 })
      setAddQuizModal(null)
    } catch {
      // ignore
    }
  }

  function confirmDeleteQuiz(module) {
    setConfirm({
      title: 'Delete quiz',
      message: `Delete the quiz "${module.quiz.title}" and all its questions?`,
      onConfirm: async () => {
        await api.delete(`/quizzes/${module.quiz.id}`)
        setModules(modules.map(m =>
          m.id === module.id ? { ...m, quizId: null, quiz: null } : m
        ))
      },
    })
  }

  // --- Question ---
  function updateAnswer(idx, field, value) {
    setQuestionForm(prev => ({
      ...prev,
      answers: prev.answers.map((a, i) => {
        if (field === 'isCorrect') return { ...a, isCorrect: i === idx }
        if (i !== idx) return a
        return { ...a, [field]: value }
      }),
    }))
  }

  async function handleAddQuestion(e) {
    e.preventDefault()
    const { moduleId, quizId } = addQuestionModal
    if (!questionForm.text.trim()) return
    if (questionForm.answers.filter(a => a.text.trim()).length < 2) return
    try {
      const res = await api.post(`/quizzes/${quizId}/questions`, {
        text: questionForm.text,
        points: questionForm.points,
        answers: questionForm.answers.filter(a => a.text.trim()),
      })
      setModules(modules.map(m => {
        if (m.id !== moduleId) return m
        return { ...m, quiz: { ...m.quiz, questions: [...(m.quiz.questions ?? []), res.data.data] } }
      }))
      setQuestionForm({ text: '', points: 1, answers: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] })
      setAddQuestionModal(null)
    } catch {
      // ignore
    }
  }

  function confirmDeleteQuestion(moduleId, quizId, question) {
    setConfirm({
      title: 'Delete question',
      message: `Delete "${question.text}"?`,
      onConfirm: async () => {
        await api.delete(`/quizzes/${quizId}/questions/${question.id}`)
        setModules(modules.map(m => {
          if (m.id !== moduleId) return m
          return { ...m, quiz: { ...m.quiz, questions: m.quiz.questions.filter(q => q.id !== question.id) } }
        }))
      },
    })
  }

  // --- Generic confirm runner ---
  async function runConfirm() {
    if (!confirm?.onConfirm) return
    setConfirmLoading(true)
    try {
      await confirm.onConfirm()
      setConfirm(null)
    } catch {
      // ignore
    } finally {
      setConfirmLoading(false)
    }
  }

  if (loading) return <p className="text-center py-20 text-gray-400 animate-pulse">Loading…</p>

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* ── Confirm Modal ── */}
      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel="Delete"
          loading={confirmLoading}
          onConfirm={runConfirm}
          onClose={() => setConfirm(null)}
        />
      )}

      {/* ── Add Module Modal ── */}
      {addModuleModal && (
        <Modal title="Add module" onClose={() => setAddModuleModal(false)}>
          <form onSubmit={handleAddModule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Module title</label>
              <input
                type="text"
                autoFocus
                value={newModuleTitle}
                onChange={e => setNewModuleTitle(e.target.value)}
                placeholder="e.g. Getting Started"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setAddModuleModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-500">Add module</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add Lecture Modal ── */}
      {addLectureModal && (
        <Modal title="Add lecture" onClose={() => setAddLectureModal(null)}>
          <form onSubmit={handleAddLecture} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <input
                type="text"
                autoFocus
                value={lectureForm.title}
                onChange={e => setLectureForm({ ...lectureForm, title: e.target.value })}
                placeholder="Lecture title"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Icon icon={faVideo} className="mr-1.5 text-indigo-400" />
                YouTube embed URL
              </label>
              <input
                type="url"
                value={lectureForm.videoUrl}
                onChange={e => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/embed/…"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">Use the embed link (youtube.com/embed/…)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (minutes)</label>
              <input
                type="number" min="1"
                value={lectureForm.durationMinutes}
                onChange={e => setLectureForm({ ...lectureForm, durationMinutes: e.target.value })}
                placeholder="e.g. 15"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setAddLectureModal(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-500">Add lecture</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add Quiz Modal ── */}
      {addQuizModal && (
        <Modal title="Create quiz" onClose={() => setAddQuizModal(null)}>
          <form onSubmit={handleCreateQuiz} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quiz title *</label>
              <input
                type="text"
                autoFocus
                value={quizForm.title}
                onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                placeholder="e.g. Module 1 Quiz"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                rows={2}
                value={quizForm.description}
                onChange={e => setQuizForm({ ...quizForm, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passing score (%)</label>
              <input
                type="number" min="1" max="100"
                value={quizForm.passingScore}
                onChange={e => setQuizForm({ ...quizForm, passingScore: e.target.value })}
                className="w-32 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setAddQuizModal(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-500">Create quiz</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add Question Modal ── */}
      {addQuestionModal && (
        <Modal title="Add question" onClose={() => setAddQuestionModal(null)} maxWidth="max-w-xl">
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Question text *</label>
              <textarea
                rows={2}
                autoFocus
                value={questionForm.text}
                onChange={e => setQuestionForm({ ...questionForm, text: e.target.value })}
                placeholder="Enter your question…"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Answers <span className="text-gray-400 font-normal">(select the correct one)</span>
              </label>
              <div className="space-y-2">
                {questionForm.answers.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correct"
                      checked={a.isCorrect}
                      onChange={() => updateAnswer(i, 'isCorrect', true)}
                      className="accent-indigo-600 shrink-0"
                    />
                    <input
                      type="text"
                      placeholder={`Answer ${i + 1}`}
                      value={a.text}
                      onChange={e => updateAnswer(i, 'text', e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {questionForm.answers.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setQuestionForm(prev => ({ ...prev, answers: prev.answers.filter((_, j) => j !== i) }))}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Icon icon={faXmark} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setQuestionForm(prev => ({ ...prev, answers: [...prev.answers, { text: '', isCorrect: false }] }))}
                className="mt-2 text-xs text-indigo-600 hover:underline"
              >
                <Icon icon={faPlus} className="mr-1" />Add answer option
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Points</label>
              <input
                type="number" min="1"
                value={questionForm.points}
                onChange={e => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) || 1 })}
                className="w-24 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setAddQuestionModal(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-500">Save question</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/my-courses" className="text-sm text-indigo-600 hover:underline block mb-1">← My Courses</Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit course</h1>
        </div>
        {courseStatus !== 'Published' ? (
          <button
            onClick={handlePublish}
            className="rounded-xl bg-green-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-green-500 transition-colors"
          >
            Publish course
          </button>
        ) : (
          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium">Published</span>
        )}
      </div>

      {/* ── Course info ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Course info</h2>
        {message && (
          <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label>
              <input
                type="number" min="0" step="0.01"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">— none —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors">
            Save
          </button>
        </form>
      </div>

      {/* ── Modules ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">Modules & content</h2>
          <button
            onClick={() => setAddModuleModal(true)}
            className="flex items-center gap-2 rounded-lg bg-gray-800 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            <Icon icon={faPlus} />
            Add module
          </button>
        </div>

        {modules.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">No modules yet. Add your first module.</p>
        )}

        <div className="space-y-5">
          {modules.map(module => (
            <div key={module.id} className="border border-gray-100 rounded-xl overflow-hidden">
              {/* Module header */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
                <p className="font-medium text-gray-800 text-sm">{module.title}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setAddLectureModal(module.id); setLectureForm({ title: '', videoUrl: '', durationMinutes: '' }) }}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    <Icon icon={faPlay} className="text-[10px]" />Lecture
                  </button>
                  {!module.quiz && (
                    <button
                      onClick={() => { setAddQuizModal(module.id); setQuizForm({ title: '', description: '', passingScore: 70 }) }}
                      className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-500 font-medium"
                    >
                      <Icon icon={faClipboardList} className="text-[10px]" />Quiz
                    </button>
                  )}
                  <button onClick={() => confirmDeleteModule(module)} className="text-xs text-red-400 hover:text-red-600">
                    <Icon icon={faTrash} />
                  </button>
                </div>
              </div>

              {/* Lectures */}
              <ul className="divide-y divide-gray-50">
                {module.lectures?.map(lecture => (
                  <li key={lecture.id} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 bg-white">
                    <Icon icon={faPlay} className="text-gray-300 text-[10px] shrink-0" />
                    <span className="flex-1">{lecture.title}</span>
                    {lecture.videoUrl && <Icon icon={faVideo} className="text-xs text-indigo-400" />}
                    {lecture.durationMinutes && <span className="text-xs text-gray-400">{lecture.durationMinutes} min</span>}
                    <button onClick={() => confirmDeleteLecture(module.id, lecture)} className="text-gray-300 hover:text-red-500 transition-colors ml-1">
                      <Icon icon={faXmark} />
                    </button>
                  </li>
                ))}
                {module.lectures?.length === 0 && (
                  <li className="px-4 py-3 text-xs text-gray-400 italic">No lectures yet</li>
                )}
              </ul>

              {/* Quiz section */}
              {module.quiz && (
                <div className="border-t border-gray-100 bg-amber-50 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon icon={faClipboardList} className="text-amber-500 text-sm" />
                      <span className="text-sm font-medium text-amber-800">{module.quiz.title}</span>
                      <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                        {module.quiz.questions?.length ?? 0} questions · {module.quiz.passingScore}% to pass
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setAddQuestionModal({ moduleId: module.id, quizId: module.quiz.id }); setQuestionForm({ text: '', points: 1, answers: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }) }}
                        className="text-xs text-amber-700 hover:text-amber-600 font-medium flex items-center gap-1"
                      >
                        <Icon icon={faPlus} className="text-[10px]" />Question
                      </button>
                      <button onClick={() => confirmDeleteQuiz(module)} className="text-xs text-red-400 hover:text-red-600">
                        <Icon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                  {module.quiz.questions?.length > 0 && (
                    <ul className="space-y-1">
                      {module.quiz.questions.map(q => (
                        <li key={q.id} className="flex items-start justify-between bg-white rounded-lg px-3 py-2 text-xs text-gray-700">
                          <span className="flex-1 mr-2">{q.text}</span>
                          <button onClick={() => confirmDeleteQuestion(module.id, module.quiz.id, q)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                            <Icon icon={faXmark} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
