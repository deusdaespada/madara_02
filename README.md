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

## Próximos passos (Fase 2)

Página inicial (banner, novidades, rankings, filtros), página da obra e o
leitor (vertical/horizontal/webtoon, zoom, progresso automático).
