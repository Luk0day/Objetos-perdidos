import { timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_SESSAO, criarToken, tokenValido } from './session';

export function senhaCorreta(tentativa: string) {
  const a = Buffer.from(tentativa);
  const b = Buffer.from(process.env.ADMIN_PASSWORD ?? '');
  return a.length === b.length && b.length > 0 && timingSafeEqual(a, b);
}

export async function abrirSessao() {
  (await cookies()).set(COOKIE_SESSAO, await criarToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function encerrarSessao() {
  (await cookies()).delete(COOKIE_SESSAO);
}

export async function exigirAdmin() {
  if (!(await tokenValido((await cookies()).get(COOKIE_SESSAO)?.value))) redirect('/admin/login');
}
