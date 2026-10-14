import Link from 'next/link';
import { data, rotuloStatus } from '@/lib/format';
import type { Objeto } from '@/lib/db/schema';

export function ObjetoCard({ o }: { o: Objeto }) {
  return (
    <Link href={`/objeto/${o.id}`} className="tag">
      <img src={o.fotoUrl} alt={o.nome} loading="lazy" />
      <h3>{o.nome}</h3>
      <p>{o.descricao}</p>
      <div className="meta">
        <span>{data(o.publicadoEm)}</span>
        <span className={`st ${o.status}`}>{rotuloStatus[o.status]}</span>
      </div>
    </Link>
  );
}
