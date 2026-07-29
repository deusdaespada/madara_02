# Wolftoon v2 — Fase 1: Fundação

Reconstrução do Wolftoon (projeto paralelo ao atual, em Vite+React/Vercel) com
Next.js 15 + Supabase + Netlify.

## O que está incluído nesta fase

- **Projeto Next.js 15 (App Router) + TS + Tailwind + shadcn-ready**, com o tema
  "Reino dos Lobos" (dark, dourado envelhecido + violeta profundo — ver
  `app/globals.css` e `tailwind.config.ts`) já configurado como tokens CSS.
- **Fontes**: Cinzel (display, identidade "reino") + Manrope (corpo) + JetBrains
  Mono (dados/admin).
- **Cliente Supabase** para browser (`lib/supabase/client.ts`), server components
  / server actions (`lib/supabase/server.ts`), e um client de service-role
  isolado para o bot de upload e ações admin.
- **Middleware** de refresh de sessão (`middleware.ts`).
- **Schema completo do banco** em `supabase/migrations/`:
  - `0001_schema.sql` — todas as tabelas do briefing
  - `0002_indexes.sql` — índices para catálogo, leitor, busca instantânea (trigram)
  - `0003_triggers.sql` — criação automática de perfil no signup, contadores de
    rating/favoritos, incremento de views via RPC
  - `0004_rls.sql` — RLS em todas as tabelas
- **netlify.toml** com plugin do Next.js, headers de cache e redirects de exemplo.
- **.env.example** com todas as variáveis necessárias (Supabase, Turnstile, OAuth).

## Decisões que tomei (me avise se quiser mudar)

- **Não criei uma tabela `public.users` separada.** `auth.users` (Supabase Auth)
  já é a fonte de identidade; `profiles` estende ela 1:1 e é o que o resto do
  schema referencia. Uma tabela `users` duplicada só criaria dessincronia.
- **RLS**: leitura pública em catálogo/capítulos/páginas/comentários (não
  deletados); favoritos/histórico/notificações são privados ao usuário;
  escrita administrativa exige `role = 'admin'` ou `'moderator'` em `profiles`.
- **Contadores** (`views_count`, `rating_avg`, `favorites_count`) são mantidos
  por triggers/RPC no Postgres, não calculados no client, para não haver
  race conditions com uploads concorrentes.
- **`types/database.types.ts` está parcial** — escrevi os tipos das tabelas
  principais à mão porque não tenho acesso de rede aqui para rodar o Supabase
  CLI. Depois de linkar o projeto, rode `npm run db:types` para gerar os tipos
  completos e reais.

## Como aplicar

```bash
npm install
supabase link --project-ref <seu-project-ref>
supabase db push          # aplica as 4 migrations em ordem
npm run db:types          # gera types/database.types.ts de verdade
npm run dev
```

## Fase 2 — Páginas públicas (adicionado agora)

- **Home** (`app/page.tsx`): banner em destaque com auto-rotação, novidades,
  em alta, mais vistos, mais curtidos, lançamentos, continuando leitura (se
  logado), rankings semanal/mensal/geral (o semanal e mensal usam a RPC
  `get_manga_ranking` de `0005_rankings.sql`). Busca instantânea no header
  (`components/search/instant-search.tsx`, debounced, via `/api/search`).
- **Página da obra** (`app/manga/[slug]/page.tsx`): todos os campos do
  briefing, `generateMetadata` com Open Graph/Twitter Card/canonical, JSON-LD
  Schema.org (`Book`), avaliação (1–10 em estrelas, `/api/ratings`),
  favoritar (`/api/favorites`), lista completa de capítulos com atalho para o
  último/primeiro, comentários (`/api/comments`) e recomendações (por
  enquanto: mesmos gêneros — a recomendação por IA de verdade é um item de
  fase futura, não implementei um modelo aqui).
- **Leitor** (`app/manga/[slug]/read/[chapter]/page.tsx` +
  `components/reader/`): 4 modos (vertical, webtoon, horizontal, página),
  zoom, tela cheia, dark/light do leitor, progresso salvo automaticamente via
  IntersectionObserver (modos contínuos) ou troca de página (modos
  paginados), retomada de onde parou, pré-carregamento das 2 próximas
  páginas, troca rápida de capítulo. Preferências de leitura (modo/tema/zoom)
  persistem no Zustand (`store/reader-store.ts`); progresso de leitura é
  estado de servidor (tabela `history`), não local.
- **SEO técnico**: `app/sitemap.ts` (dinâmico, gera uma entrada por obra) e
  `app/robots.ts`.

### Decisões / simplificações desta fase

- Comentários: implementei só o primeiro nível (sem exibir respostas
  aninhadas) para manter o escopo gerenciável — a coluna `parent_id` já
  existe no schema para quando quiser adicionar threads visuais.
- Catálogo com todos os filtros (gênero/autor/artista/scan/status/idioma/tipo)
  e o calendário de lançamentos ainda não foram construídos — ficaram para a
  próxima leva, já que a Fase 2 focou em home + obra + leitor.
- Continua sem acesso de rede neste ambiente: não rodei `npm run build` nem
  testei contra um Supabase real. Recomendo rodar `npm install && npm run
  typecheck` localmente antes do primeiro deploy.

## Próximos passos

Catálogo com filtros completos, calendário de lançamentos, autenticação
(Google/Discord/GitHub/email + 2FA), perfil com gamificação, e o painel
administrativo (CRUD, upload múltiplo, moderação).
