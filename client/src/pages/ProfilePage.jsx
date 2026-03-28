import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import api from '../api'

const inputClass = 'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors'

export default function ProfilePage() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', bio: '', specialization: '', yearsOfExperience: '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' })
  const [message, setMessage] = useState('')
  const [pwMessage, setPwMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/users/me').then(r => {
      const u = r.data.data
      setForm({ firstName: u.firstName ?? '', lastName: u.lastName ?? '', bio: u.bio ?? '', specialization: u.specialization ?? '', yearsOfExperience: u.yearsOfExperience ?? '' })
    }).catch(() => {})
  }, [])

  async function handleProfile(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await api.put('/users/me', {
        ...form,
        yearsOfExperience: form.yearsOfExperience === '' ? null : parseInt(form.yearsOfExperience),
      })
      const updated = res.data.data
      const token = localStorage.getItem('token')
      login({ ...updated, token })
      setMessage('saved')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePassword(e) {
    e.preventDefault()
    setPwMessage('')
    try {
      await api.put('/users/me/password', pwForm)
      setPwForm({ currentPassword: '', newPassword: '' })
      setPwMessage('changed')
    } catch (err) {
      setPwMessage(err.response?.data?.message || 'Failed to change password.')
    }
  }

  const initials = `${form.firstName?.[0] ?? ''}${form.lastName?.[0] ?? ''}`.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || '?'
  const ROLE_BADGE = {
    Admin: 'bg-purple-50 text-purple-700 border border-purple-100',
    Lecturer: 'bg-blue-50 text-blue-700 border border-blue-100',
    Student: 'bg-gray-100 text-gray-600 border border-gray-200',
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Avatar header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {form.firstName || user?.firstName} {form.lastName || user?.lastName}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_BADGE[user?.role] ?? 'bg-gray-100 text-gray-500'}`}>
              {user?.role}
            </span>
            <span className="text-sm text-gray-400">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
        <h2 className="font-semibold text-gray-900 mb-5">Personal info</h2>

        {message === 'saved' && <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">Profile saved.</div>}
        {message && message !== 'saved' && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{message}</div>}

        <form onSubmit={handleProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
              <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
              <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell us a bit about yourself…" className={`${inputClass} resize-none`} />
          </div>
          {user?.role === 'Lecturer' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                <input type="text" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of experience</label>
                <input type="number" min="0" value={form.yearsOfExperience} onChange={e => setForm({ ...form, yearsOfExperience: e.target.value })} className={inputClass} />
              </div>
            </div>
          )}
          <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Change password</h2>

        {pwMessage === 'changed' && <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">Password changed.</div>}
        {pwMessage && pwMessage !== 'changed' && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{pwMessage}</div>}

        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current password</label>
            <input type="password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
            <input type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required placeholder="••••••••" className={inputClass} />
          </div>
          <button type="submit" className="rounded-lg border border-gray-200 text-gray-700 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors">
            Update password
          </button>
        </form>
      </div>
    </div>
  )
}
