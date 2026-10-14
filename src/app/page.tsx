import { Filtros } from '@/components/Filtros';
import { ObjetoCard } from '@/components/ObjetoCard';
import { listarCatalogo } from '@/lib/queries';

type Busca = { q?: string; categoria?: string; periodo?: string; devolvidos?: string };

export default async function Catalogo({ searchParams }: { searchParams: Promise<Busca> }) {
  const p = await searchParams;
  const itens = await listarCatalogo({
    q: p.q?.trim() || undefined,
    categoria: p.categoria || undefined,
    dias: Number(p.periodo) || undefined,
    devolvidos: p.devolvidos === '1',
  });

  return (
    <main className="wrap">
      <header>
        <h1>Achados e Perdidos</h1>
        <p>Perdeu alguma coisa no campus? Procure aqui. Os objetos encontrados são publicados com foto assim que são registrados.</p>
      </header>
      <Filtros q={p.q} categoria={p.categoria} periodo={p.periodo} devolvidos={p.devolvidos === '1'} />
      <p className="contagem">{itens.length} {itens.length === 1 ? 'objeto encontrado' : 'objetos encontrados'}</p>
      <div className="grade">
        {itens.length ? itens.map((o) => <ObjetoCard key={o.id} o={o} />) : (
          <p className="vazio">Nenhum objeto com esses filtros. Tente outra palavra ou volte mais tarde.</p>
        )}
      </div>
    </main>
  );
}
