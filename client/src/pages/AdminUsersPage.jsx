import { useState, useEffect } from 'react'
import api from '../api'
import { Icon, faSearch, faLock, faUnlock, faTrash, faXmark, faUsers } from '../icons'
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

  const activeCount = users.filter(u => !u.isBlocked).length
  const blockedCount = users.filter(u => u.isBlocked).length

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

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          {users.length > 0 && (
            <p className="text-gray-500 text-sm mt-1">
              {users.length} total · {activeCount} active · {blockedCount} blocked
            </p>
          )}
        </div>
        {!loading && (
          <div className="flex items-center gap-3 text-center">
            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3">
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Total</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3">
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Active</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3">
              <div className="text-2xl font-bold text-red-500">{blockedCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Blocked</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Search bar */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-72">
            <Icon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-xl border border-gray-200 pl-10 pr-9 py-2.5 text-sm w-full focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon icon={faXmark} className="text-xs" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="h-6 bg-gray-100 rounded-full w-16" />
                <div className="h-6 bg-gray-100 rounded-full w-14" />
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide border-b border-gray-100">
              <tr>
                <th className="px-5 py-3.5 text-left">User</th>
                <th className="px-5 py-3.5 text-left">Role</th>
                <th className="px-5 py-3.5 text-left">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {user.firstName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
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
                    <div className="flex justify-end gap-2">
                      {user.isBlocked ? (
                        <button
                          onClick={() => setConfirm({ type: 'unblock', userId: user.id, name: `${user.firstName} ${user.lastName}` })}
                          className="flex items-center gap-1.5 rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Icon icon={faUnlock} className="text-[10px]" />Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirm({ type: 'block', userId: user.id, name: `${user.firstName} ${user.lastName}` })}
                          className="flex items-center gap-1.5 rounded-lg border border-yellow-200 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-50 transition-colors"
                        >
                          <Icon icon={faLock} className="text-[10px]" />Block
                        </button>
                      )}
                      <button
                        onClick={() => setConfirm({ type: 'delete', userId: user.id, name: `${user.firstName} ${user.lastName}` })}
                        className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Icon icon={faTrash} className="text-[10px]" />Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <Icon icon={faUsers} className="text-3xl text-gray-200 mb-2" />
            <p className="text-gray-400 text-sm">
              {search ? `No users matching "${search}"` : 'No users found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
