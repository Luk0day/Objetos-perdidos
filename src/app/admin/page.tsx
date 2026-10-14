import { ItemPendente } from '@/components/ItemPendente';
import { ItemPublicado } from '@/components/ItemPublicado';
import { UploadForm } from '@/components/UploadForm';
import { listarPorStatus } from '@/lib/queries';
import { logout } from './actions';

export const dynamic = 'force-dynamic';

export default async function Painel() {
  const [pendentes, publicados] = await Promise.all([listarPorStatus('pendente'), listarPorStatus('disponivel')]);

  return (
    <main className="wrap estreito">
      <div className="topo">
        <h1>Painel</h1>
        <form action={logout}><button className="btn neutro">Sair</button></form>
      </div>

      <h2>Enviar foto</h2>
      <UploadForm />

      <h2>Aguardando aprovação ({pendentes.length})</h2>
      {pendentes.length ? pendentes.map((o) => <ItemPendente key={o.id} o={o} />) : <p className="vazio">Nada aguardando aprovação.</p>}

      <h2>No catálogo ({publicados.length})</h2>
      {publicados.length ? publicados.map((o) => <ItemPublicado key={o.id} o={o} />) : <p className="vazio">Nenhum objeto disponível.</p>}
    </main>
  );
}
