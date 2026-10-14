import { del, put } from '@vercel/blob';

export async function salvarFoto(foto: File) {
  const { url } = await put(`objetos/${foto.name || 'foto.jpg'}`, foto, { access: 'public', addRandomSuffix: true });
  return url;
}

export const apagarFoto = (url: string) => del(url);
