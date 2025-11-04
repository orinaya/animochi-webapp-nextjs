import { NextRequest, NextResponse } from 'next/server'

// Routes protégées qui nécessitent une authentification
const protectedRoutes = ['/dashboard']

// Routes d'authentification (redirection si déjà connecté)
const authRoutes = ['/sign-in', '/sign-up']

export function middleware (request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Vérifier si l'utilisateur a un token de session
  const sessionToken = request.cookies.get('better-auth.session_token')?.value
  const isAuthenticated = Boolean(sessionToken)

  // Rediriger vers /sign-in si l'utilisateur tente d'accéder à une route protégée sans être connecté
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Rediriger vers /dashboard si l'utilisateur est déjà connecté et tente d'accéder aux pages d'auth
  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ]
}
