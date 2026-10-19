<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Reglas del proyecto Destila

- Documentación (README, ROADMAP, issues, textos de la UI) en **español**. Código, comentarios y nombres de variables en **inglés**.
- **Nunca** subas claves ni meta-prompts reales. Los meta-prompts privados se cargan con `MetaPromptProvider` desde env o base de datos; en el repo solo vive el ejemplo público de `src/lib/metaprompts/example.ts`.
- Toda llamada a la IA pasa por `getAIProvider()` y por los guardas de `src/lib/limits` en el orden documentado en `src/app/api/destila/route.ts`. `max_tokens` siempre sale de la configuración, nunca del cliente.
- Sin dependencias exclusivas de Vercel (`@vercel/*`): el proyecto debe poder migrar a Cloudflare.
- No añadas dependencias que todavía no se usen.
- Commits del reto: `Día N: <qué se hizo>`.
- Antes de commitear: `npm run lint` y `npm run build` sin errores.
