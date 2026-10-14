# Achados e Perdidos

Catálogo público de objetos achados no campus, com painel para a Adriana. A foto é enviada pelo painel, a IA (Gemini) monta o anúncio e ele só vai ao ar depois da aprovação dela.

**Stack:** Next.js (App Router) · TypeScript · Postgres (Neon) + Drizzle · Vercel Blob (fotos) · Gemini · deploy na Vercel.

## Estrutura

```
src/
├─ app/
│  ├─ layout.tsx · globals.css
│  ├─ page.tsx                    catálogo público (busca, categoria, período)
│  ├─ objeto/[id]/page.tsx        detalhe + orientação de devolução
│  ├─ admin/
│  │  ├─ page.tsx                 painel: enviar, aprovar, devolver, arquivar
│  │  ├─ login/page.tsx           senha da Adriana
│  │  └─ actions.ts               server actions (todas exigem sessão)
│  └─ api/cron/arquivar/route.ts  arquiva itens com mais de 60 dias (cron diário)
├─ components/                    ObjetoCard · Filtros · UploadForm · ItemPendente · ItemPublicado
├─ lib/
│  ├─ db/ (schema.ts · index.ts)  tabela `objetos`
│  ├─ queries.ts                  consultas do catálogo e do painel
│  ├─ gemini.ts                   análise da foto (JSON estruturado)
│  ├─ storage.ts                  upload/remoção no Vercel Blob
│  ├─ session.ts · auth.ts        cookie assinado (jose) + senha única
│  ├─ constants.ts · format.ts    categorias, textos e link do WhatsApp
└─ proxy.ts                       protege /admin/* (Next 16)
drizzle/                          migrações SQL
vercel.json                       agenda do cron
```

## Fluxo

1. `/admin` → **Enviar foto**: o navegador reduz a imagem (≤1600 px) e envia; o Gemini devolve nome, descrição, tags e categoria; o item entra como `pendente`.
2. **Aguardando aprovação**: Adriana edita e toca em **Publicar** (`disponivel`) ou **Descartar** (`cancelado`, foto apagada).
3. **No catálogo**: **Devolvido**, **Arquivar** e botão de **WhatsApp** (abre a conversa com a mensagem pronta; o envio ao grupo é manual).
4. O cron diário arquiva automaticamente o que passar de 60 dias.

## Rodar localmente

```bash
npm install
cp .env.example .env.local     # preencha as variáveis
npm run db:push                # cria a tabela no Postgres
npm run dev
```

## Deploy na Vercel

1. Suba o repositório no GitHub e importe em vercel.com/new.
2. **Storage → Create**: adicione um **Postgres (Neon)** e um **Blob**. A Vercel injeta `DATABASE_URL` e `BLOB_READ_WRITE_TOKEN`.
3. Em **Settings → Environment Variables**, preencha as demais chaves do `.env.example` (`GEMINI_API_KEY`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`).
4. Com a `DATABASE_URL` no ambiente local (`vercel env pull .env.local`), rode `npm run db:push` uma vez.
5. Faça o deploy. O cron de `vercel.json` passa a usar o `CRON_SECRET` automaticamente.

## Cuidados

- As fotos usam URL pública do Blob (endereço longo e imprevisível). Fotos pendentes também; descartar apaga o arquivo.
- A busca não ignora acentos. Para isso, habilite a extensão `unaccent` no Postgres e use-a em `queries.ts`.
- O login é por senha única e não limita tentativas. Use uma senha longa ou, se crescer, troque por Auth.js.
- Plano gratuito do Gemini: confira limites e uso de dados no Google AI Studio e não fotografe documentos abertos.
