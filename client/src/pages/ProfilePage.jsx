import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import api from '../api'

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-950 focus:outline-none focus:ring-0 transition-colors'

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
      setForm({
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        bio: u.bio ?? '',
        specialization: u.specialization ?? '',
        yearsOfExperience: u.yearsOfExperience ?? '',
      })
    }).catch(() => {})
  }, [])

  async function handleProfile(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await api.put('/users/me', form)
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
  const ROLE_BADGE = { Admin: 'bg-purple-50 text-purple-700 border-purple-100', Lecturer: 'bg-blue-50 text-blue-700 border-blue-100', Student: 'bg-gray-100 text-gray-600 border-gray-200' }

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-100 px-6 py-10">
        <div className="max-w-2xl mx-auto flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0 shadow-inner"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-950 tracking-tight">
              {form.firstName || user?.firstName} {form.lastName || user?.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${ROLE_BADGE[user?.role] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                {user?.role}
              </span>
              <span className="text-sm text-gray-400">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-5">
        {/* Personal info */}
        <div className="border border-gray-100 rounded-2xl p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5">Personal info</p>

          {message === 'saved' && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700 font-medium">
              Profile saved.
            </div>
          )}
          {message && message !== 'saved' && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{message}</div>
          )}

          <form onSubmit={handleProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">First name</label>
                <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Last name</label>
                <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Tell us a bit about yourself…"
                className={`${inputClass} resize-none`}
              />
            </div>
            {user?.role === 'Lecturer' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Specialization</label>
                  <input type="text" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Years of experience</label>
                  <input type="number" min="0" value={form.yearsOfExperience} onChange={e => setForm({ ...form, yearsOfExperience: e.target.value })} className={inputClass} />
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gray-950 text-white px-6 py-2.5 text-sm font-bold hover:bg-gray-800 disabled:opacity-40 transition-colors"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="border border-gray-100 rounded-2xl p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5">Change password</p>

          {pwMessage === 'changed' && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700 font-medium">
              Password changed.
            </div>
          )}
          {pwMessage && pwMessage !== 'changed' && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{pwMessage}</div>
          )}

          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Current password</label>
              <input
                type="password"
                value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                required
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">New password</label>
              <input
                type="password"
                value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                required
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="rounded-xl border border-gray-200 text-gray-700 px-6 py-2.5 text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
