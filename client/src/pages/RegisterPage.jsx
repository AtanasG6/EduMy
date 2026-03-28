import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthContext'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">Join thousands of learners on EduMy</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I want to</label>
              <select
                value={form.role}
                onChange={e => { setForm({ ...form, role: e.target.value }); setDiplomaStatus(null) }}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Student">Learn (Student)</option>
                <option value="Lecturer">Teach (Lecturer)</option>
              </select>
            </div>

            {form.role === 'Lecturer' && (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Diploma / Certificate</label>
                <p className="text-xs text-gray-400 mb-3">Upload an image of your academic diploma for AI verification.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDiplomaChange}
                  required
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {diplomaStatus === 'checking' && <p className="mt-2 text-xs text-gray-500">🔍 Verifying with AI…</p>}
                {diplomaStatus === 'ok' && <p className="mt-2 text-xs text-green-600 font-medium">✓ Diploma verified</p>}
                {diplomaStatus === 'fail' && <p className="mt-2 text-xs text-red-500">✗ Could not verify — try a clearer image</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || diplomaStatus === 'checking'}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
