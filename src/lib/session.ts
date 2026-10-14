import { jwtVerify, SignJWT } from 'jose';

export const COOKIE_SESSAO = 'admin_sessao';
const chave = () => new TextEncoder().encode(process.env.SESSION_SECRET);

export const criarToken = () =>
  new SignJWT({ admin: true }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(chave());

export async function tokenValido(token?: string) {
  if (!token) return false;
  try {
    await jwtVerify(token, chave());
    return true;
  } catch {
    return false;
  }
}
