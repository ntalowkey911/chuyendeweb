import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/login(.*)', 
  '/register(.*)', 
  '/',
  '/menu(.*)',
  '/product(.*)',
  '/products(.*)',
  '/api(.*)',
  '/sso-callback(.*)',
  '/payment(.*)'
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Nếu đã đăng nhập mà cố vào trang login/register thì đá về trang chủ
  if (userId && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
