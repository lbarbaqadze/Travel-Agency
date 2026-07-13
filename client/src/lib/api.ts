const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL

if (!configuredApiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in .env.local')
}

function getApiUrl(): string {
  const configured = configuredApiUrl!.replace(/\/$/, '')

  if (typeof window === 'undefined') return configured

  if (configured.startsWith('http') && !configured.startsWith(window.location.origin)) {
    return '/api'
  }

  return configured
}

interface ApiOptions extends RequestInit {
  skipAuth?: boolean
  skipRefresh?: boolean
  skipSessionCleanup?: boolean
}

class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = fetch(`${getApiUrl()}/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}

function clearStaleSession(): void {
  void fetch(`${getApiUrl()}/auth/log-out`, {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {})
}

export async function api<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { skipAuth, skipRefresh, skipSessionCleanup, ...fetchOptions } = options
  const baseUrl = getApiUrl()

  const doFetch = () =>
    fetch(`${baseUrl}${endpoint}`, {
      ...fetchOptions,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

  let response = await doFetch()

  if (response.status === 401 && !skipAuth && !skipRefresh) {
    const refreshed = await refreshAccessToken()

    if (refreshed) {
      response = await doFetch()
      if (response.status === 401 && !skipSessionCleanup) {
        clearStaleSession()
      }
    } else {
      if (!skipSessionCleanup) clearStaleSession()
      throw new ApiError('Session expired, please sign in again', 401, null)
    }
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'Something went wrong',
      response.status,
      data
    )
  }

  return data as T
}

export { ApiError, getApiUrl }
