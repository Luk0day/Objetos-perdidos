import { descartar, publicar } from '@/app/admin/actions';
import { CATEGORIAS } from '@/lib/constants';
import type { Objeto } from '@/lib/db/schema';

export function ItemPendente({ o }: { o: Objeto }) {
  return (
    <article className="caixa">
      <img src={o.fotoUrl} alt="Foto do objeto" className="previa" />
      <form action={publicar.bind(null, o.id)}>
        <label>Nome<input name="nome" defaultValue={o.nome} maxLength={80} required /></label>
        <label>Descrição<textarea name="descricao" defaultValue={o.descricao} rows={3} maxLength={400} /></label>
        <label>Tags<input name="tags" defaultValue={o.tags.map((t) => '#' + t.replace(/^#/, '')).join(' ')} maxLength={200} /></label>
        <label>
          Categoria
          <select name="categoria" defaultValue={o.categoria}>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Onde foi encontrado<input name="local" defaultValue={o.local ?? ''} maxLength={120} /></label>
        <div className="linhas">
          <button className="btn ok">Publicar</button>
          <button className="btn no" formAction={descartar.bind(null, o.id)} formNoValidate>Descartar</button>
        </div>
      </form>
    </article>
  );
}
