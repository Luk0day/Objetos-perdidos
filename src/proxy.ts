import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_SESSAO, tokenValido } from '@/lib/session';

export default async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === '/admin/login') return NextResponse.next();
  if (!(await tokenValido(req.cookies.get(COOKIE_SESSAO)?.value))) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
