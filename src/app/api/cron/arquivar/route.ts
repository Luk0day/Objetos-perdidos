import { and, eq, lt } from 'drizzle-orm';
import { DIAS_PARA_ARQUIVAR } from '@/lib/constants';
import { db } from '@/lib/db';
import { objetos } from '@/lib/db/schema';

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const limite = new Date(Date.now() - DIAS_PARA_ARQUIVAR * 864e5);
  await db()
    .update(objetos)
    .set({ status: 'arquivado' })
    .where(and(eq(objetos.status, 'disponivel'), lt(objetos.publicadoEm, limite)));
  return Response.json({ ok: true });
}
