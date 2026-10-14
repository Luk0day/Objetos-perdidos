CREATE TYPE "public"."status" AS ENUM('pendente', 'disponivel', 'devolvido', 'arquivado', 'cancelado');--> statement-breakpoint
CREATE TABLE "objetos" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"descricao" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"categoria" text NOT NULL,
	"foto_url" text NOT NULL,
	"local" text,
	"status" "status" DEFAULT 'pendente' NOT NULL,
	"recebido_em" timestamp DEFAULT now() NOT NULL,
	"publicado_em" timestamp,
	"devolvido_em" timestamp
);
