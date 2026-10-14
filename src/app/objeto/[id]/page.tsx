import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ORIENTACAO_DEVOLUCAO } from '@/lib/constants';
import { data, rotuloStatus } from '@/lib/format';
import { buscarPorId } from '@/lib/queries';

export default async function Detalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await buscarPorId(id);
  if (!o || (o.status !== 'disponivel' && o.status !== 'devolvido')) notFound();

  const linhas: [string, string][] = [
    ['Categoria', o.categoria],
    ['Tags', o.tags.map((t) => '#' + t).join(' ')],
    ['Publicado em', data(o.publicadoEm)],
    ['Encontrado em', o.local ?? ''],
    ['Status', rotuloStatus[o.status]],
  ];

  return (
    <main className="wrap detalhe">
      <Link href="/">← Voltar ao catálogo</Link>
      <img src={o.fotoUrl} alt={o.nome} />
      <h1>{o.nome}</h1>
      <p>{o.descricao}</p>
      <dl>
        {linhas.filter(([, v]) => v).map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      <p className="como">{ORIENTACAO_DEVOLUCAO}</p>
    </main>
  );
}
