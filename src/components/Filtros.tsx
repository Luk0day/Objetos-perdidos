import { CATEGORIAS } from '@/lib/constants';

type Props = { q?: string; categoria?: string; periodo?: string; devolvidos?: boolean };

export function Filtros({ q, categoria, periodo, devolvidos }: Props) {
  return (
    <form className="filtros" action="/">
      <input type="search" name="q" defaultValue={q} placeholder="Buscar por nome, cor, descrição ou tag" aria-label="Buscar" />
      <select name="categoria" defaultValue={categoria ?? ''} aria-label="Categoria">
        <option value="">Todas as categorias</option>
        {CATEGORIAS.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <select name="periodo" defaultValue={periodo ?? '0'} aria-label="Período">
        <option value="0">Qualquer data</option>
        <option value="7">Últimos 7 dias</option>
        <option value="30">Últimos 30 dias</option>
      </select>
      <label className="chk">
        <input type="checkbox" name="devolvidos" value="1" defaultChecked={devolvidos} /> Mostrar já devolvidos
      </label>
      <button type="submit" className="btn">Filtrar</button>
    </form>
  );
}
