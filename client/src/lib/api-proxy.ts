import { NextRequest, NextResponse } from 'next/server'

const PRODUCTION_BACKEND = 'https://travel-agency-five-rosy.vercel.app'

export function getBackendOrigin() {
  const candidates = [
    process.env.API_REWRITE_URL,
    process.env.INTERNAL_API_URL?.replace(/\/api\/?$/, ''),
  ]

  for (const value of candidates) {
    const origin = value?.replace(/\/$/, '')
    if (!origin) continue
    if (origin.includes('127.0.0.1') || origin.includes('localhost')) continue
    return origin
  }

  if (process.env.VERCEL === '1') {
    return PRODUCTION_BACKEND
  }

  const port = process.env.API_PROXY_PORT || '3002'
  return `http://127.0.0.1:${port}`
}

export async function proxyToBackend(request: NextRequest, path: string[]) {
  const backendOrigin = getBackendOrigin()
  const targetUrl = new URL(`/api/${path.join('/')}`, backendOrigin)
  targetUrl.search = request.nextUrl.search

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (lower === 'host' || lower === 'connection' || lower === 'content-length') return
    headers.set(key, value)
  })

  const hasBody = !['GET', 'HEAD'].includes(request.method)
  const requestBody = hasBody ? await request.arrayBuffer() : undefined

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: requestBody,
    cache: 'no-store',
    redirect: 'manual',
  })

  const responseHeaders = new Headers()
  backendResponse.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (lower === 'set-cookie') return
    if (lower === 'content-encoding') return
    if (lower === 'content-length') return
    if (lower === 'transfer-encoding') return
    responseHeaders.set(key, value)
  })

  const setCookies =
    typeof backendResponse.headers.getSetCookie === 'function'
      ? backendResponse.headers.getSetCookie()
      : []

  const normalizeCookie = (cookie: string) =>
    cookie
      .replace(/;\s*Domain=[^;]*/gi, '')
      .replace(/;\s*Secure/gi, '')
      .replace(/;\s*Path=[^;]*/gi, '; Path=/')

  if (setCookies.length > 0) {
    for (const cookie of setCookies) {
      responseHeaders.append('set-cookie', normalizeCookie(cookie))
    }
  } else {
    const single = backendResponse.headers.get('set-cookie')
    if (single) responseHeaders.append('set-cookie', normalizeCookie(single))
  }

  const isRedirect = backendResponse.status >= 300 && backendResponse.status < 400
  const responseBody = isRedirect ? null : await backendResponse.arrayBuffer()

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  })
}
