'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { abrirSessao, encerrarSessao, exigirAdmin, senhaCorreta } from '@/lib/auth';
import { CATEGORIAS } from '@/lib/constants';
import { db } from '@/lib/db';
import { objetos } from '@/lib/db/schema';
import { analisarFoto, type AnaliseFoto } from '@/lib/gemini';
import { buscarPorId } from '@/lib/queries';
import { apagarFoto, salvarFoto } from '@/lib/storage';

const Campos = z.object({
  nome: z.string().trim().min(1).max(80),
  descricao: z.string().trim().max(400),
  tags: z.string().max(200),
  categoria: z.enum(CATEGORIAS),
  local: z.string().trim().max(120),
});

const atualizarTela = () => {
  revalidatePath('/');
  revalidatePath('/admin');
};

export async function login(fd: FormData) {
  if (!senhaCorreta(String(fd.get('senha') ?? ''))) redirect('/admin/login?erro=1');
  await abrirSessao();
  redirect('/admin');
}

export async function logout() {
  await encerrarSessao();
  redirect('/admin/login');
}

export async function criarObjeto(fd: FormData): Promise<{ ok: boolean; erro?: string }> {
  await exigirAdmin();
  const foto = fd.get('foto');
  if (!(foto instanceof File) || !foto.size) return { ok: false, erro: 'Escolha uma foto.' };
  if (foto.size > 4 * 1024 * 1024) return { ok: false, erro: 'A foto é grande demais.' };

  let analise: AnaliseFoto;
  try {
    analise = await analisarFoto(new Uint8Array(await foto.arrayBuffer()), foto.type || 'image/jpeg');
  } catch {
    analise = { nome: '(preencher)', descricao: '', tags: [], categoria: 'Outros' };
  }
  const fotoUrl = await salvarFoto(foto);
  await db().insert(objetos).values({
    nome: analise.nome,
    descricao: analise.descricao,
    tags: analise.tags,
    categoria: analise.categoria,
    fotoUrl,
    local: String(fd.get('local') ?? '').trim().slice(0, 120) || null,
  });
  atualizarTela();
  return { ok: true };
}

export async function publicar(id: string, fd: FormData) {
  await exigirAdmin();
  const c = Campos.parse(Object.fromEntries(fd));
  if (c.nome === '(preencher)') throw new Error('Informe o nome do objeto.');
  await db()
    .update(objetos)
    .set({
      nome: c.nome,
      descricao: c.descricao,
      tags: c.tags.split(/[\s,#]+/).filter(Boolean),
      categoria: c.categoria,
      local: c.local || null,
      status: 'disponivel',
      publicadoEm: new Date(),
    })
    .where(eq(objetos.id, id));
  atualizarTela();
}

export async function descartar(id: string) {
  await exigirAdmin();
  const o = await buscarPorId(id);
  if (!o || o.status !== 'pendente') return;
  await db().update(objetos).set({ status: 'cancelado' }).where(eq(objetos.id, id));
  await apagarFoto(o.fotoUrl);
  atualizarTela();
}

export async function marcarDevolvido(id: string) {
  await exigirAdmin();
  await db().update(objetos).set({ status: 'devolvido', devolvidoEm: new Date() }).where(eq(objetos.id, id));
  atualizarTela();
}

export async function arquivar(id: string) {
  await exigirAdmin();
  await db().update(objetos).set({ status: 'arquivado' }).where(eq(objetos.id, id));
  atualizarTela();
}
