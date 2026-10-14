import { arquivar, marcarDevolvido } from '@/app/admin/actions';
import type { Objeto } from '@/lib/db/schema';
import { data, linkWhatsApp } from '@/lib/format';

export function ItemPublicado({ o }: { o: Objeto }) {
  return (
    <article className="caixa item">
      <img src={o.fotoUrl} alt="" />
      <div className="info">
        <strong>{o.nome}</strong>
        <small>Publicado em {data(o.publicadoEm)}</small>
        <div className="linhas">
          <form action={marcarDevolvido.bind(null, o.id)}><button className="btn ok">Devolvido</button></form>
          <form action={arquivar.bind(null, o.id)}><button className="btn neutro">Arquivar</button></form>
          <a className="btn zap" href={linkWhatsApp(o)} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
    </article>
  );
}
