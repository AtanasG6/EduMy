import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'
import { Icon, faSearch, faCheck, faXmark } from '../icons'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'Student' })
  const [diplomaFile, setDiplomaFile] = useState(null)
  const [diplomaStatus, setDiplomaStatus] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDiplomaChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setDiplomaFile(file)
    setDiplomaStatus('checking')
    setError('')
    const data = new FormData()
    data.append('file', file)
    try {
      const res = await api.post('/diploma/verify', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      const result = res.data.data
      setDiplomaStatus(result.isValid ? 'ok' : 'fail')
      if (!result.isValid) setError(result.message)
    } catch {
      setDiplomaStatus('fail')
      setError('Diploma verification failed.')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.role === 'Lecturer' && diplomaStatus !== 'ok') {
      setError('Please upload a valid diploma to register as a Lecturer.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              <span className="text-white text-sm font-black">E</span>
            </div>
            <span className="text-white text-lg font-black tracking-tight">EduMy</span>
          </Link>
          <p className="mt-6 text-2xl font-black text-white tracking-tight">Create your account</p>
          <p className="mt-1 text-sm text-gray-500">Join thousands of learners</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
          {error && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">First name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Last name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">I want to</label>
              <select
                value={form.role}
                onChange={e => { setForm({ ...form, role: e.target.value }); setDiplomaStatus(null) }}
                className="w-full rounded-xl bg-gray-900 border border-white/10 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="Student">Learn (Student)</option>
                <option value="Lecturer">Teach (Lecturer)</option>
              </select>
            </div>

            {form.role === 'Lecturer' && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Diploma / Certificate</p>
                <p className="text-xs text-gray-600 mb-3">Upload an image of your academic diploma for AI verification.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDiplomaChange}
                  required
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                />
                {diplomaStatus === 'checking' && (
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                    <Icon icon={faSearch} className="text-[10px]" />Verifying…
                  </p>
                )}
                {diplomaStatus === 'ok' && (
                  <p className="mt-2 text-xs text-green-400 font-semibold flex items-center gap-1.5">
                    <Icon icon={faCheck} className="text-[10px]" />Diploma verified
                  </p>
                )}
                {diplomaStatus === 'fail' && (
                  <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                    <Icon icon={faXmark} className="text-[10px]" />Could not verify — try a clearer image
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || diplomaStatus === 'checking'}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-1"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-white hover:text-gray-200 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
