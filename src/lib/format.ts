import type { Objeto } from './db/schema';

export const data = (d: Date | null) => (d ? d.toLocaleDateString('pt-BR') : '');

export const rotuloStatus: Record<Objeto['status'], string> = {
  pendente: 'Pendente',
  disponivel: 'Disponível',
  devolvido: 'Devolvido',
  arquivado: 'Arquivado',
  cancelado: 'Cancelado',
};

export function linkWhatsApp(o: Pick<Objeto, 'nome' | 'descricao' | 'id'>) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const texto = `📦 Achado no campus: ${o.nome}\n${o.descricao}\n\nVeja no site: ${site}/objeto/${o.id}`;
  return 'https://wa.me/?text=' + encodeURIComponent(texto);
}
