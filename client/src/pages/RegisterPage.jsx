import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'
import { Icon, faSearch, faCheck, faXmark } from '../icons'

const inputClass = 'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'Student' })
  const [diplomaStatus, setDiplomaStatus] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDiplomaChange(e) {
    const file = e.target.files[0]
    if (!file) return
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
    <div className="h-[calc(100vh-57px)] bg-gray-50 flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
            Edu<span className="text-indigo-600">My</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join thousands of learners</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-7">
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I want to</label>
              <select
                value={form.role}
                onChange={e => { setForm({ ...form, role: e.target.value }); setDiplomaStatus(null) }}
                className={inputClass}
              >
                <option value="Student">Learn (Student)</option>
                <option value="Lecturer">Teach (Lecturer)</option>
              </select>
            </div>

            {form.role === 'Lecturer' && (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700 mb-0.5">Diploma / Certificate</p>
                <p className="text-xs text-gray-400 mb-3">Upload an image for AI verification.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDiplomaChange}
                  required
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {diplomaStatus === 'checking' && <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5"><Icon icon={faSearch} className="text-[10px]" />Verifying…</p>}
                {diplomaStatus === 'ok' && <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1.5"><Icon icon={faCheck} className="text-[10px]" />Verified</p>}
                {diplomaStatus === 'fail' && <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5"><Icon icon={faXmark} className="text-[10px]" />Could not verify</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || diplomaStatus === 'checking'}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
