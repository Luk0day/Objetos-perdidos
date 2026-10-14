import { and, desc, eq, gte, ilike, inArray, or, sql } from 'drizzle-orm';
import { db } from './db';
import { objetos, type Status } from './db/schema';

export type FiltrosCatalogo = { q?: string; categoria?: string; dias?: number; devolvidos?: boolean };

export function listarCatalogo(f: FiltrosCatalogo) {
  const condicoes = [inArray(objetos.status, f.devolvidos ? ['disponivel', 'devolvido'] : ['disponivel'])];
  if (f.categoria) condicoes.push(eq(objetos.categoria, f.categoria));
  if (f.dias) condicoes.push(gte(objetos.publicadoEm, new Date(Date.now() - f.dias * 864e5)));
  if (f.q) {
    const termo = `%${f.q}%`;
    condicoes.push(
      or(
        ilike(objetos.nome, termo),
        ilike(objetos.descricao, termo),
        sql`array_to_string(${objetos.tags}, ' ') ilike ${termo}`,
      )!,
    );
  }
  return db().select().from(objetos).where(and(...condicoes)).orderBy(desc(objetos.publicadoEm));
}

export async function buscarPorId(id: string) {
  const [o] = await db().select().from(objetos).where(eq(objetos.id, id));
  return o;
}

export function listarPorStatus(status: Status) {
  return db().select().from(objetos).where(eq(objetos.status, status)).orderBy(desc(objetos.recebidoEm));
}
