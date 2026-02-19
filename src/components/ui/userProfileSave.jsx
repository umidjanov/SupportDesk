
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ProfileSavingPageUI: self-contained UI and logic for editing/saving a user profile
// - Namespaced localStorage keys to avoid conflicts with the rest of the app
// - Versioned writes to detect conflicts
// - Lightweight lock + write queue to serialize saves
// - Cross-tab synchronization using the `storage` event

const STORAGE_PREFIX = 'supportdesk:profile:'
const PROFILE_KEY = `${STORAGE_PREFIX}current`
const LOCK_KEY = `${STORAGE_PREFIX}lock`

const defaultProfile = {
  fullName: '',
  email: '',
  role: 'Support',
  phone: '',
  avatarUrl: '',
  bio: '',
  version: 0, // optimistic concurrency control
  updatedAt: null,
}

function nowIso() {
  return new Date().toISOString()
}

function readProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return { ...defaultProfile }
    const parsed = JSON.parse(raw)
    return { ...defaultProfile, ...parsed }
  } catch (e) {
    console.warn('Failed to read profile from storage', e)
    return { ...defaultProfile }
  }
}

function writeProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

function acquireLock(maxHoldMs = 3000) {
  const now = Date.now()
  const raw = localStorage.getItem(LOCK_KEY)
  if (raw) {
    try {
      const { at } = JSON.parse(raw)
      if (typeof at === 'number' && now - at < maxHoldMs) {
        return false
      }
    } catch {}
  }
  try {
    localStorage.setItem(LOCK_KEY, JSON.stringify({ at: now, tab: Math.random().toString(36).slice(2) }))
    return true
  } catch {
    return false
  }
}

function releaseLock() {
  try { localStorage.removeItem(LOCK_KEY) } catch {}
}

function useDebouncedCallback(cb, delayMs, deps) {
  const timeoutRef = useRef(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => cb(...args), delayMs)
  }, deps)
}

function Input({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function TextArea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <textarea
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function Badge({ children, color = 'indigo' }) {
  const map = useMemo(() => ({
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
    green: 'bg-green-50 text-green-700 ring-green-200',
    gray: 'bg-gray-50 text-gray-700 ring-gray-200',
  }), [])
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${map[color] || map.gray}`}>
      {children}
    </span>
  )
}

export default function ProfileSavingPageUI() {
  const [profile, setProfile] = useState(() => readProfile())
  const [status, setStatus] = useState('idle') // idle | saving | saved | conflict | error
  const [error, setError] = useState('')

  // Cross-tab sync
  useEffect(() => {
    function onStorage(e) {
      if (e.key === PROFILE_KEY && e.newValue) {
        try {
          const remote = JSON.parse(e.newValue)
          setProfile((current) => {
            // Only update view if remote is newer
            if ((remote?.version ?? 0) > (current?.version ?? 0)) {
              return { ...defaultProfile, ...remote }
            }
            return current
          })
        } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const queueRef = useRef(Promise.resolve())

  const scheduleSave = useCallback((draft) => {
    queueRef.current = queueRef.current.finally(async () => {
      setStatus('saving')
      setError('')
      // Acquire lock to serialize across tabs
      let tries = 0
      while (!acquireLock() && tries < 10) {
        await new Promise((r) => setTimeout(r, 150))
        tries++
      }
      if (tries >= 10) {
        setStatus('error')
        setError('Unable to acquire save lock. Please retry.')
        return
      }
      try {
        const latest = readProfile()
        if ((latest.version ?? 0) !== (draft.version ?? 0)) {
          // Conflict detected
          setStatus('conflict')
          setError('Profile changed in another tab. Please review and merge.')
          // Merge: keep latest, but overlay local edits for non-empty fields
          const merged = {
            ...latest,
            fullName: draft.fullName || latest.fullName,
            email: draft.email || latest.email,
            role: draft.role || latest.role,
            phone: draft.phone || latest.phone,
            avatarUrl: draft.avatarUrl || latest.avatarUrl,
            bio: draft.bio || latest.bio,
          }
          setProfile(merged)
          return
        }
        const next = {
          ...draft,
          version: (draft.version ?? 0) + 1,
          updatedAt: nowIso(),
        }
        writeProfile(next)
        setProfile(next)
        setStatus('saved')
      } catch (e) {
        setStatus('error')
        setError('Failed to save profile.')
        // eslint-disable-next-line no-console
        console.error(e)
      } finally {
        releaseLock()
      }
    })
  }, [])

  const debouncedScheduleSave = useDebouncedCallback(scheduleSave, 500, [scheduleSave])

  // Input handlers
  const update = useCallback((patch) => {
    setStatus('idle')
    setProfile((p) => {
      const next = { ...p, ...patch }
      debouncedScheduleSave(next)
      return next
    })
  }, [debouncedScheduleSave])

  const onSubmit = useCallback((e) => {
    e.preventDefault()
    scheduleSave(profile)
  }, [profile, scheduleSave])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profile</h2>
        <div className="flex items-center gap-2">
          {status === 'saving' && <Badge color="indigo">Saving…</Badge>}
          {status === 'saved' && <Badge color="green">Saved</Badge>}
          {status === 'conflict' && <Badge color="red">Conflict</Badge>}
          {status === 'error' && <Badge color="red">Error</Badge>}
          {status === 'idle' && <Badge color="gray">Idle</Badge>}
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-md bg-red-50 text-red-800 border border-red-200 px-3 py-2 text-sm">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Full Name"
            value={profile.fullName}
            onChange={(v) => update({ fullName: v })}
            placeholder="John Doe"
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={profile.email}
          onChange={(v) => update({ email: v })}
          placeholder="john@example.com"
        />
        <Input
          label="Phone"
          value={profile.phone}
          onChange={(v) => update({ phone: v })}
          placeholder="93-111-11-11"
        />
        <Input
          label="Role"
          value={profile.role}
          onChange={(v) => update({ role: v })}
          placeholder="Support | Curator"
        />
        <Input
          label="Avatar URL"
          value={profile.avatarUrl}
          onChange={(v) => update({ avatarUrl: v })}
          placeholder="https://…"
        />
        <div className="md:col-span-2">
          <TextArea
            label="Bio"
            value={profile.bio}
            onChange={(v) => update({ bio: v })}
            placeholder="Short bio…"
            rows={5}
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              const latest = readProfile()
              setProfile(latest)
              setStatus('idle')
              setError('')
            }}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700"
          >
            Save now
          </button>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-500">
        <div>Version: {profile.version ?? 0}</div>
        <div>Updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : '—'}</div>
        <div className="mt-2">
          Storage key namespace: <code>{STORAGE_PREFIX}</code>
        </div>
      </div>
    </div>
  )
}