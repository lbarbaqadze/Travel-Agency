'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, ShieldCheck, Trash2, User } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { api, ApiError } from '@/lib/api'
import { ENDPOINTS } from '@/lib/endpoints'

interface AdminUser {
  id: number
  name: string
  surname: string
  email: string
  role: 'user' | 'admin'
  is_verified: boolean | number
  created_at: string
}

interface UsersResponse {
  status: string
  results: number
  data: { users: AdminUser[] }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchUsers = useCallback(() => {
    setIsLoading(true)
    api<UsersResponse>(ENDPOINTS.users)
      .then((res) => setUsers(res.data.users))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load users'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  async function toggleRole(user: AdminUser) {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    setUpdatingId(user.id)
    setError(null)
    try {
      await api(ENDPOINTS.updateUserRole(user.id), {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      })
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update role')
    } finally {
      setUpdatingId(null)
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await api(ENDPOINTS.deleteUser(deleteId), { method: 'DELETE' })
      setUsers((prev) => prev.filter((u) => u.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete user')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 dark:text-white">Users</h1>
        <p className="mt-1 text-sm text-neutral-500">{users.length} registered users</p>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 p-12 text-center">
            <p className="text-sm text-neutral-500">No users found.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/80 dark:bg-neutral-900/80">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">User</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Role</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Verified</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Joined</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-neutral-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-neutral-50 last:border-0 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white capitalize">
                            {user.name.charAt(0)}
                          </span>
                          <span className="font-semibold text-neutral-900 dark:text-white capitalize">{user.name} {user.surname}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleRole(user)}
                          disabled={updatingId === user.id}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                            user.role === 'admin'
                              ? 'bg-neutral-900 text-white hover:bg-black'
                              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200'
                          } disabled:opacity-50`}
                        >
                          {user.role === 'admin' ? (
                            <ShieldCheck className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          {updatingId === user.id ? '...' : user.role}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${user.is_verified ? 'text-emerald-600' : 'text-neutral-400'}`}>
                          {user.is_verified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{formatDate(user.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteId(user.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-500"
                          title="Delete user"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete this user?"
        description="This will permanently remove the user account and all associated data. This can't be undone."
        confirmLabel="Delete"
        cancelLabel="Keep it"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
