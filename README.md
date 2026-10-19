# Destila

**De la idea cruda al prompt puro.**

Destila es una app web donde vuelcas una idea tal cual la tienes en la cabeza,
sin formato, y te devuelve el mejor prompt posible para sacarle el máximo a un
modelo de IA. Menos tokens, menos intentos, mejores respuestas.

> 🧪 **Se está construyendo en público en 30 días.** Cada día es un issue y un
> commit. Puedes ver el código, opinar y seguir el proceso de principio a fin.

---

## Qué hace diferente a Destila

- **No adivina.** Si falta contexto, te hace preguntas cortas con opciones de un clic.
- **Te explica qué cambió y por qué.** "Agregué X porque Y", para que aprendas a escribir mejores prompts.
- **Optimiza según el modelo destino.** No es lo mismo un prompt para Claude, ChatGPT, Gemini o Midjourney.
- **Cuida tus tokens.** Estima cuánto cuesta el prompt y te ofrece una versión compacta.
- **Español primero.** Pensado desde el inicio para quien escribe en español; inglés después.

## El reto de 30 días

Destila se construye en 30 días, en abierto. Cada día tiene su issue en GitHub
con un objetivo, una lista de tareas y un criterio de hecho, y se cierra con un
commit que empieza por `Día N:`.

| Semana | Tema | Qué sale de ella |
| --- | --- | --- |
| 1 | **Fundamentos** | Repo seguro, identidad visual, login con Google y GitHub, base de datos con RLS y el primer enhancer con streaming |
| 2 | **Núcleo** | Meta-prompts privados, objetivo y modelo destino, preguntas inteligentes de un clic, prompt estructurado y "qué cambié y por qué" |
| 3 | **Límites y valor** | Cuota diaria, tope de gasto (kill switch), estimador de tokens, puntuación del prompt, biblioteca y modo diff |
| 4 | **Lanzamiento** | Variantes, plantillas, historial, pulido de UX, landing, plan Pro, hosting comercial y lanzamiento |

El plan completo, día por día, está en [ROADMAP.md](ROADMAP.md).

### Cómo seguir el reto

- ⭐ **Marca el repo con una estrella** y activa *Watch* para enterarte de cada día.
- 📋 **Mira los [issues](../../issues)**: cada día del reto es uno, agrupados por semana en los *milestones*.
- 💬 **Opina en el issue del día.** Si ves una forma mejor de hacer algo, dilo ahí.
- 💡 **Propón ideas** con la plantilla *Idea*.
- 📜 **Lee el historial de commits**: cada `Día N:` cuenta lo que se hizo ese día.

> El repositorio es público durante el reto y pasará a privado cuando Destila se
> lance como producto. Lee la sección [Licencia](#licencia).

## Stack

Todo lo que se puede usar gratis mientras se construye:

| Pieza | Herramienta | Para qué |
| --- | --- | --- |
| App | [Next.js](https://nextjs.org) (App Router, TypeScript) | Interfaz y API |
| Estilos | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) | Componentes accesibles y tema propio |
| Datos y login | [Supabase](https://supabase.com) (plan gratis) | Postgres, Auth con Google y GitHub, RLS |
| Límites | [Upstash Redis](https://upstash.com) (plan gratis) | Cuota diaria por usuario |
| IA en desarrollo | [Gemini API](https://ai.google.dev) (nivel gratis) | Probar sin gastar |
| IA en producción | Claude Haiku ([Anthropic](https://www.anthropic.com/api)) | Calidad y coste para usuarios reales |
| Hosting | Vercel (Hobby) al principio | Ver [Hosting](#hosting) |

## Cómo está organizado

```
src/
├── app/
│   ├── page.tsx               # pantalla principal con la caja de captura
│   └── api/destila/route.ts   # endpoint: valida, aplica límites y (pronto) llama a la IA
├── components/                # componentes de la app y de shadcn/ui (components/ui)
└── lib/
    ├── ai/                    # interfaz AIProvider + Gemini y Claude
    ├── metaprompts/           # interfaz MetaPromptProvider + ejemplo público
    ├── limits/                # cuota, tope de entrada, consumo y kill switch
    └── catalog.ts             # objetivos y modelos destino
supabase/migrations/           # esquema: profiles, prompts, usage_log (con RLS)
scripts/create-issues.sh       # crea los milestones y los 30 issues desde ROADMAP.md
```

Tres capas pensadas para cambiar sin tocar el resto:

- **`lib/ai`**: todos los modelos implementan la misma interfaz. Se cambia de
  Gemini a Claude con `AI_PROVIDER`, sin tocar el resto del código.
- **`lib/metaprompts`**: los meta-prompts reales son la "salsa secreta" y **no
  viven en este repo**. Aquí solo hay una interfaz y un ejemplo público,
  genérico y marcado como tal. Los reales se cargan desde variables de entorno o
  desde la base de datos.
- **`lib/limits`**: los límites existen desde el día 1 en la estructura, aunque
  se completen en la semana 3:
  1. Login obligatorio: sin cuenta, no hay llamadas a la IA.
  2. Cuota diaria por usuario (5 mejoras gratis por defecto).
  3. Tope de caracteres de entrada y `max_tokens` fijo de salida.
  4. Registro de consumo por usuario en `usage_log`.
  5. Límite global de gasto diario: si se alcanza, el servicio se pausa con un mensaje claro.

## Cómo correrlo en local

Necesitas Node.js 20 o superior.

```bash
git clone <url-del-repo> destila
cd destila
npm install
cp .env.example .env.local   # rellena lo que vayas necesitando
npm run dev
```

Abre <http://localhost:3000>. Por ahora la caja de captura funciona y el
endpoint valida la entrada; la conexión con la IA llega el día 6.

Otros comandos:

```bash
npm run lint    # ESLint
npm run build   # build de producción
```

### Variables de entorno

Todas están en [`.env.example`](.env.example) con valores vacíos. Si una está
vacía se usa el valor por defecto:

| Variable | Por defecto | Qué hace |
| --- | --- | --- |
| `AI_PROVIDER` | `gemini` | `gemini` o `claude` |
| `GEMINI_MODEL` | `gemini-flash-latest` | Modelo de Gemini |
| `CLAUDE_MODEL` | `claude-haiku-5-5` | Modelo de Claude |
| `METAPROMPT_SOURCE` | `example` | `example`, `env` o `database` |
| `DAILY_FREE_QUOTA` | `5` | Mejoras gratis por usuario y día |
| `MAX_INPUT_CHARS` | `4000` | Tope de caracteres de la idea |
| `MAX_OUTPUT_TOKENS` | `1024` | `max_tokens` fijo de salida |
| `DAILY_GLOBAL_BUDGET_USD` | `1` | Gasto máximo diario antes de pausar el servicio |
| `KILL_SWITCH_FORCE` | vacío | `true` pausa el servicio al instante |

Las claves (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, Supabase, Upstash) no tienen
valor por defecto y **nunca** se suben al repo.

## Hosting

Destila empieza en **Vercel Hobby**, que es gratis pero **solo permite uso no
comercial**. Por eso el proyecto evita dependencias exclusivas de Vercel
(nada de `@vercel/*` ni APIs propias de su plataforma): solo Next.js estándar y
APIs web.

Cuando Destila empiece a cobrar (semana 4) migrará a una de estas opciones:

- **Vercel Pro**, sin cambios de código.
- **Cloudflare** con el adaptador [OpenNext](https://opennext.js.org/cloudflare).

## Seguridad

Lo que se publica en un repo público no se puede "despublicar": cualquier clon o
fork conserva la copia. Por eso, desde el primer commit:

- `.env*` está en `.gitignore` y solo se sube `.env.example` vacío.
- [gitleaks](https://github.com/gitleaks/gitleaks) escanea cada push y cada PR.
- Los meta-prompts reales nunca entran en el repo.
- Las tablas tienen Row Level Security: cada persona solo ve sus datos.

¿Encontraste una vulnerabilidad? No abras un issue: sigue [SECURITY.md](SECURITY.md).

## Roadmap resumido

- **Semana 1 (días 1 a 7):** fundamentos y primer enhancer con streaming.
- **Semana 2 (días 8 a 14):** el núcleo: objetivos, modelos destino, preguntas y explicaciones.
- **Semana 3 (días 15 a 21):** límites, tokens, puntuación y biblioteca.
- **Semana 4 (días 22 a 30):** variantes, plantillas, pagos, hosting comercial y lanzamiento.

Detalle completo en [ROADMAP.md](ROADMAP.md).

## Licencia

**Todos los derechos reservados.** Ver [LICENSE](LICENSE).

Este código es visible porque el reto se hace en público, pero **ver el código
no te da derecho a copiarlo, modificarlo, redistribuirlo ni venderlo**, ni a
usarlo para crear un producto parecido. No es software libre ni de código
abierto.

Sí puedes leerlo, aprender del proceso y opinar en los issues. Ver
[CONTRIBUTING.md](CONTRIBUTING.md).
