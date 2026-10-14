import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['pendente', 'disponivel', 'devolvido', 'arquivado', 'cancelado']);

export const objetos = pgTable('objetos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  descricao: text('descricao').notNull().default(''),
  tags: text('tags').array().notNull().default([]),
  categoria: text('categoria').notNull(),
  fotoUrl: text('foto_url').notNull(),
  local: text('local'),
  status: statusEnum('status').notNull().default('pendente'),
  recebidoEm: timestamp('recebido_em').notNull().defaultNow(),
  publicadoEm: timestamp('publicado_em'),
  devolvidoEm: timestamp('devolvido_em'),
});

export type Objeto = typeof objetos.$inferSelect;
export type Status = Objeto['status'];
