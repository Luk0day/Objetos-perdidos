export const CATEGORIAS = [
  'Material escolar',
  'Roupas e acessórios',
  'Eletrônicos',
  'Garrafas e marmitas',
  'Chaves',
  'Documentos e cartões',
  'Outros',
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const ORIENTACAO_DEVOLUCAO =
  'Para solicitar a devolução, procure a Adriana e descreva o objeto (cor, marca, o que havia dentro).';

export const DIAS_PARA_ARQUIVAR = 60;
