import { useState, useEffect } from 'react'
import api from '../api'
import { Icon, faSearch, faLock, faUnlock, faTrash } from '../icons'
import ConfirmModal from '../ConfirmModal'

const ROLE_COLORS = {
  Admin: 'bg-purple-100 text-purple-700',
  Lecturer: 'bg-blue-100 text-blue-700',
  Student: 'bg-gray-100 text-gray-600',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirm, setConfirm] = useState(null) // { type: 'block'|'unblock'|'delete', userId, name }
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    api.get('/users')
      .then(r => setUsers(r.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function runConfirm() {
    if (!confirm) return
    setConfirmLoading(true)
    try {
      if (confirm.type === 'block') {
        await api.put(`/users/${confirm.userId}/block`)
        setUsers(users.map(u => u.id === confirm.userId ? { ...u, isBlocked: true } : u))
      } else if (confirm.type === 'unblock') {
        await api.put(`/users/${confirm.userId}/unblock`)
        setUsers(users.map(u => u.id === confirm.userId ? { ...u, isBlocked: false } : u))
      } else if (confirm.type === 'delete') {
        await api.delete(`/users/${confirm.userId}`)
        setUsers(users.filter(u => u.id !== confirm.userId))
      }
      setConfirm(null)
    } catch {
      // ignore
    } finally {
      setConfirmLoading(false)
    }
  }

  const confirmConfig = {
    block: { title: 'Block user', message: `Block ${confirm?.name}? They won't be able to log in.`, label: 'Block', danger: false },
    unblock: { title: 'Unblock user', message: `Unblock ${confirm?.name}?`, label: 'Unblock', danger: false },
    delete: { title: 'Delete user', message: `Permanently delete ${confirm?.name}? This cannot be undone.`, label: 'Delete', danger: true },
  }

  const filtered = users.filter(u =>
    u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {confirm && confirmConfig[confirm.type] && (
        <ConfirmModal
          title={confirmConfig[confirm.type].title}
          message={confirmConfig[confirm.type].message}
          confirmLabel={confirmConfig[confirm.type].label}
          danger={confirmConfig[confirm.type].danger}
          loading={confirmLoading}
          onConfirm={runConfirm}
          onClose={() => setConfirm(null)}
        />
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Users</h1>

      <div className="relative mb-6">
        <Icon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search users…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm w-64 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse h-12" />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
              <tr>
                <th className="px-5 py-3.5 text-left">Name</th>
                <th className="px-5 py-3.5 text-left">Email</th>
                <th className="px-5 py-3.5 text-left">Role</th>
                <th className="px-5 py-3.5 text-left">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                  <td className="px-5 py-4 text-gray-500">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-500'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      {user.isBlocked ? (
                        <button
                          onClick={() => setConfirm({ type: 'unblock', userId: user.id, name: `${user.firstName} ${user.lastName}` })}
                          className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-500"
                        >
                          <Icon icon={faUnlock} className="text-xs" />Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirm({ type: 'block', userId: user.id, name: `${user.firstName} ${user.lastName}` })}
                          className="flex items-center gap-1.5 text-yellow-600 hover:text-yellow-500"
                        >
                          <Icon icon={faLock} className="text-xs" />Block
                        </button>
                      )}
                      <button
                        onClick={() => setConfirm({ type: 'delete', userId: user.id, name: `${user.firstName} ${user.lastName}` })}
                        className="flex items-center gap-1.5 text-red-500 hover:text-red-400"
                      >
                        <Icon icon={faTrash} className="text-xs" />Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-gray-400 text-sm">No users found.</p>
          )}
        </div>
      )}
    </div>
  )
}
