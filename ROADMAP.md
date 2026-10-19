# Roadmap: 30 días de Destila

Cada día es un issue de GitHub y un commit. Este archivo es la **fuente única**:
`scripts/create-issues.sh` lee de aquí los milestones (semanas) y los 30 issues.
Si cambias un día, cámbialo aquí y vuelve a ejecutar el script en modo
`--dry-run` para revisar.

Formato de cada día (el script depende de él):

- `## Semana N: Nombre` abre un milestone.
- `### Día N: Título` abre un issue; todo lo que sigue hasta el próximo `###` o
  `##` es el cuerpo del issue.

---

## Semana 1: Fundamentos

### Día 1: Repo, licencia, README, escaneo de secretos y Next.js base

**Objetivo:** dejar un repositorio público seguro desde el primer commit y una app que compila.

**Tareas:**

- [ ] Next.js (App Router, TypeScript) + Tailwind + configuración de shadcn/ui
- [ ] Licencia "Todos los derechos reservados", `SECURITY.md` y `CONTRIBUTING.md`
- [ ] `.gitignore` con `.env*` y `.env.example` solo con nombres de variables
- [ ] Workflow de gitleaks en cada push y PR
- [ ] Esqueleto de capas: `lib/ai`, `lib/metaprompts`, `lib/limits`
- [ ] Borrador del esquema de base de datos en `supabase/migrations/`
- [ ] README, ROADMAP y plantillas de issues

**Criterio de hecho:** `npm run build` y `npm run lint` pasan, el primer push queda escaneado por gitleaks sin hallazgos y el repo no contiene ningún secreto ni meta-prompt real.

### Día 2: Identidad visual y layout base

**Objetivo:** que Destila tenga cara propia: paleta, tipografía, logo y un layout reutilizable.

**Tareas:**

- [ ] Elegir paleta (claro y oscuro) y definirla como variables CSS del tema de shadcn/ui
- [ ] Elegir tipografía de títulos y de texto con `next/font`
- [ ] Diseñar el logo (gota o alambique) en SVG y el favicon
- [ ] Layout base: cabecera, contenedor principal y pie
- [ ] Modo oscuro según la preferencia del sistema

**Criterio de hecho:** la pantalla principal usa la nueva identidad en claro y oscuro, el favicon es el logo y el contraste de texto cumple WCAG AA.

### Día 3: Autenticación con Supabase (Google y GitHub)

**Objetivo:** iniciar sesión con Google o GitHub; sin cuenta no hay llamadas a la IA.

**Tareas:**

- [ ] Crear el proyecto en Supabase (plan gratis) y configurar los proveedores Google y GitHub
- [ ] Instalar `@supabase/supabase-js` y `@supabase/ssr` y crear los clientes de servidor y navegador
- [ ] Botones de inicio y cierre de sesión, ruta de callback de OAuth
- [ ] Proteger `POST /api/destila`: responder 401 sin sesión
- [ ] Documentar en el README cómo configurar OAuth en local

**Criterio de hecho:** puedo entrar y salir con Google y con GitHub, y una petición al endpoint sin sesión devuelve 401.

### Día 4: Esquema de base de datos con RLS

**Objetivo:** aplicar y probar el esquema `profiles`, `prompts` y `usage_log` con Row Level Security.

**Tareas:**

- [ ] Revisar la migración inicial y aplicarla al proyecto de Supabase
- [ ] Comprobar que al registrarse se crea el perfil automáticamente
- [ ] Probar RLS: un usuario no ve ni modifica datos de otro
- [ ] Comprobar que un usuario no puede cambiar su propio `plan` ni escribir en `usage_log`
- [ ] Generar los tipos de TypeScript de la base de datos

**Criterio de hecho:** las pruebas de RLS con dos usuarios distintos pasan y los tipos generados compilan.

### Día 5: Caja de captura y pantalla principal

**Objetivo:** una pantalla principal clara donde volcar la idea sin fricción.

**Tareas:**

- [ ] Caja de captura con contador de caracteres y límite visible
- [ ] Atajo de teclado para enviar (Ctrl/Cmd + Enter)
- [ ] Estados: vacío, escribiendo, enviando, error
- [ ] Ejemplos de ideas de un clic para quien llega por primera vez
- [ ] Diseño adaptado a móvil

**Criterio de hecho:** en móvil y escritorio se puede escribir, ver el límite y enviar con teclado o botón; todos los estados se ven bien.

### Día 6: Primer enhancer con Gemini y streaming

**Objetivo:** de la idea cruda al primer prompt mejorado, con respuesta en streaming.

**Tareas:**

- [ ] Implementar `GeminiProvider` (`generate` y `stream`) contra la API de Gemini
- [ ] Conectar el endpoint: meta-prompt de ejemplo + idea del usuario + `max_tokens` fijo
- [ ] Devolver la respuesta en streaming y mostrarla progresivamente en la UI
- [ ] Manejar errores del proveedor con mensajes claros en español
- [ ] Botón para cancelar una generación en curso

**Criterio de hecho:** escribo una idea, veo el prompt mejorado aparecer en streaming y un error del proveedor se muestra sin romper la pantalla.

### Día 7: Revisión de la semana 1, pruebas y resumen público

**Objetivo:** consolidar lo construido y contar en público qué salió bien y qué no.

**Tareas:**

- [ ] Añadir pruebas unitarias de la validación de entrada y de la configuración de límites
- [ ] Revisar deuda técnica y abrir issues para lo pendiente
- [ ] Revisar que no haya secretos en el historial (gitleaks en verde)
- [ ] Escribir el resumen público de la semana 1 con capturas

**Criterio de hecho:** las pruebas pasan en CI y el resumen de la semana está publicado.

## Semana 2: Núcleo

### Día 8: Cargador de meta-prompts fuera del repo y tipos de objetivo

**Objetivo:** que los meta-prompts reales se carguen desde fuera del repositorio.

**Tareas:**

- [ ] Implementar `EnvMetaPromptProvider` leyendo `DESTILA_METAPROMPTS` (JSON validado)
- [ ] Implementar `DatabaseMetaPromptProvider` con una tabla privada creada fuera del repo
- [ ] Reglas de resolución: objetivo + modelo, luego objetivo, luego general
- [ ] Caché en memoria con tiempo de expiración
- [ ] Verificar que ningún meta-prompt real aparece en el código ni en el bundle del navegador

**Criterio de hecho:** con `METAPROMPT_SOURCE=env` o `database` la app usa los meta-prompts privados y el repo solo contiene el ejemplo público.

### Día 9: Selector de objetivo

**Objetivo:** el usuario indica para qué es el prompt: escribir, programar, investigar, datos, imágenes, marketing o estudiar.

**Tareas:**

- [ ] Selector de objetivo de un clic en la pantalla principal
- [ ] Enviar el objetivo al endpoint y validarlo
- [ ] Usar el objetivo para elegir el meta-prompt
- [ ] Recordar el último objetivo usado

**Criterio de hecho:** cambiar de objetivo cambia el meta-prompt usado y el resultado se adapta de forma visible.

### Día 10: Selector de modelo destino y adaptadores por modelo

**Objetivo:** optimizar el prompt según el modelo donde se va a usar (Claude, ChatGPT, Gemini, Midjourney, otro).

**Tareas:**

- [ ] Selector de modelo destino
- [ ] Adaptadores por modelo: formato, longitud y convenciones de cada uno
- [ ] Caso especial de modelos de imagen (Midjourney): parámetros y estructura propios
- [ ] Pruebas de cada adaptador

**Criterio de hecho:** la misma idea produce prompts distintos y adecuados para al menos tres modelos destino.

### Día 11: Modo preguntas inteligentes: detectar lo que falta

**Objetivo:** que Destila no adivine: detectar qué contexto falta antes de generar.

**Tareas:**

- [ ] Paso de análisis que devuelve una lista de huecos (audiencia, tono, formato, longitud…)
- [ ] Formato estructurado (JSON) para las preguntas y sus opciones
- [ ] Umbral: si la idea ya es clara, saltar las preguntas
- [ ] Contar los tokens de este paso en el consumo

**Criterio de hecho:** una idea vaga devuelve entre 1 y 4 preguntas útiles y una idea completa no devuelve ninguna.

### Día 12: Interfaz de preguntas de un clic

**Objetivo:** responder las preguntas con opciones de un clic, sin escribir.

**Tareas:**

- [ ] Tarjetas de pregunta con opciones en botones y opción "otro"
- [ ] Botón "saltar" para generar sin responder
- [ ] Enviar las respuestas junto a la idea en la generación final
- [ ] Navegación con teclado

**Criterio de hecho:** puedo responder todas las preguntas solo con clics o teclado y el prompt final incorpora las respuestas.

### Día 13: Prompt final estructurado y botón de copiar

**Objetivo:** un prompt final con secciones claras y listo para pegar.

**Tareas:**

- [ ] Estructura: rol, contexto, tarea, restricciones, formato y ejemplos
- [ ] Vista con secciones y vista de texto plano
- [ ] Botón de copiar con confirmación visible
- [ ] Copiar en formato limpio (sin marcas de la interfaz)

**Criterio de hecho:** el prompt se muestra por secciones, se copia con un clic y al pegarlo queda limpio.

### Día 14: Panel "qué cambié y por qué" y resumen de la semana 2

**Objetivo:** explicar cada mejora ("agregué X porque Y") y cerrar la semana en público.

**Tareas:**

- [ ] Generar la lista de cambios con su motivo junto al prompt
- [ ] Panel plegable "qué cambié y por qué"
- [ ] Revisar textos y tono en español
- [ ] Escribir el resumen público de la semana 2

**Criterio de hecho:** cada resultado muestra al menos tres cambios explicados y el resumen de la semana está publicado.

## Semana 3: Límites y valor

### Día 15: Rate limiting con Upstash: cuota diaria por usuario

**Objetivo:** cada usuario tiene una cuota diaria (5 mejoras gratis por defecto).

**Tareas:**

- [ ] Crear la base de Redis en Upstash (plan gratis) e instalar `@upstash/ratelimit` y `@upstash/redis`
- [ ] Implementar `consumeDailyQuota` con ventana diaria en UTC
- [ ] Cuota configurable con `DAILY_FREE_QUOTA`
- [ ] Responder 429 con un mensaje claro y la hora de reinicio
- [ ] Mostrar en la UI cuántas mejoras quedan hoy

**Criterio de hecho:** la sexta petición del día devuelve 429 y la UI muestra el contador correcto.

### Día 16: Tope de entrada, max_tokens y registro de consumo

**Objetivo:** que cada llamada tenga coste acotado y quede registrada.

**Tareas:**

- [ ] Revisar el tope de entrada (`MAX_INPUT_CHARS`) en cliente y servidor
- [ ] `max_tokens` fijo (`MAX_OUTPUT_TOKENS`) en todos los proveedores
- [ ] Implementar `recordUsage`: tokens, modelo, coste estimado y estado en `usage_log`
- [ ] Tabla de precios por modelo configurable para estimar el coste

**Criterio de hecho:** cada llamada a la IA deja una fila en `usage_log` con tokens y coste, y una entrada demasiado larga se rechaza antes de llamar a la IA.

### Día 17: Límite global de gasto diario (kill switch)

**Objetivo:** si el gasto del día llega al límite, el servicio se pausa con un mensaje claro.

**Tareas:**

- [ ] Completar `getServiceStatus` con `daily_spend_usd()` y `DAILY_GLOBAL_BUDGET_USD`
- [ ] Caché corta del gasto para no consultar la base en cada petición
- [ ] Pantalla de "servicio en pausa" en la UI
- [ ] Aviso para mí (correo o log) cuando se activa
- [ ] Probar el interruptor manual `KILL_SWITCH_FORCE`

**Criterio de hecho:** con un presupuesto bajo de prueba, al superarlo el endpoint devuelve 503 y la UI muestra el mensaje de pausa.

### Día 18: Estimador de tokens y versión compacta del prompt

**Objetivo:** mostrar cuántos tokens cuesta el prompt y ofrecer una versión más corta.

**Tareas:**

- [ ] Estimador de tokens en el cliente (aproximado, sin llamadas a la IA)
- [ ] Mostrar tokens de la idea original y del prompt final
- [ ] Botón "versión compacta" que reduce el prompt sin perder lo esencial
- [ ] Comparar el ahorro en porcentaje

**Criterio de hecho:** cada resultado muestra su estimación de tokens y la versión compacta ahorra al menos un 30 % en prompts largos.

### Día 19: Puntuación del prompt

**Objetivo:** puntuar el prompt en claridad, especificidad, contexto y formato.

**Tareas:**

- [ ] Definir la rúbrica de las cuatro dimensiones (0 a 10)
- [ ] Puntuar la idea original y el prompt final
- [ ] Visualización de la puntuación con explicación breve
- [ ] Sugerencia concreta para la dimensión más baja

**Criterio de hecho:** cada resultado muestra la puntuación antes y después con una sugerencia accionable.

### Día 20: Biblioteca personal: guardar y etiquetar

**Objetivo:** guardar los prompts buenos y encontrarlos después.

**Tareas:**

- [ ] Guardar un resultado en `prompts` con título y etiquetas
- [ ] Página "Mi biblioteca" con búsqueda y filtro por etiqueta
- [ ] Editar título y etiquetas, borrar
- [ ] Comprobar que RLS protege la biblioteca

**Criterio de hecho:** puedo guardar, buscar, etiquetar y borrar mis prompts, y otro usuario no puede verlos.

### Día 21: Modo Enhancer con diff antes y después, y resumen de la semana 3

**Objetivo:** pegar un prompt existente y ver qué mejora Destila con un diff.

**Tareas:**

- [ ] Modo "mejorar un prompt existente" en la pantalla principal
- [ ] Vista de diff antes y después
- [ ] Reutilizar el panel "qué cambié y por qué"
- [ ] Escribir el resumen público de la semana 3

**Criterio de hecho:** pego un prompt, veo el diff resaltado con las explicaciones y el resumen de la semana está publicado.

## Semana 4: Lanzamiento

### Día 22: Variantes: corta, detallada y creativa

**Objetivo:** ofrecer tres variantes del prompt para elegir.

**Tareas:**

- [ ] Generar variantes corta, detallada y creativa
- [ ] Pestañas para cambiar entre variantes
- [ ] Decidir si las variantes consumen cuota y mostrarlo
- [ ] Copiar y guardar cualquier variante

**Criterio de hecho:** puedo pedir las tres variantes, compararlas y copiar o guardar la que quiera.

### Día 23: Plantillas con variables

**Objetivo:** convertir un prompt en plantilla reutilizable con variables.

**Tareas:**

- [ ] Sintaxis de variables (por ejemplo `{{tema}}`)
- [ ] Detectar variables y generar un formulario para rellenarlas
- [ ] Guardar plantillas en la biblioteca
- [ ] Plantillas de ejemplo por objetivo

**Criterio de hecho:** creo una plantilla con dos variables, la relleno desde el formulario y obtengo el prompt final.

### Día 24: Historial y favoritos

**Objetivo:** recuperar cualquier resultado anterior y marcar favoritos.

**Tareas:**

- [ ] Historial automático de las últimas generaciones
- [ ] Marcar y desmarcar favoritos
- [ ] Filtro de favoritos en la biblioteca
- [ ] Paginación del historial

**Criterio de hecho:** el historial muestra mis generaciones recientes y los favoritos se filtran correctamente.

### Día 25: Pulido de UX: errores, estados vacíos, accesibilidad y móvil

**Objetivo:** que todo se sienta terminado en cualquier dispositivo.

**Tareas:**

- [ ] Revisar todos los mensajes de error y estados vacíos
- [ ] Auditoría de accesibilidad (teclado, lector de pantalla, contraste)
- [ ] Revisión completa en móvil
- [ ] Rendimiento: Lighthouse en la pantalla principal

**Criterio de hecho:** Lighthouse de accesibilidad de 95 o más y ningún flujo roto en móvil.

### Día 26: Landing page

**Objetivo:** una página que explique Destila en 10 segundos y lleve a probarlo.

**Tareas:**

- [ ] Mensaje principal, beneficios y ejemplo antes y después
- [ ] Sección de precios (gratis y Pro)
- [ ] Preguntas frecuentes
- [ ] Metadatos para compartir en redes (Open Graph)

**Criterio de hecho:** la landing está publicada, carga rápido y lleva al registro con un clic.

### Día 27: Plan Pro y pagos

**Objetivo:** poder cobrar el plan Pro.

**Tareas:**

- [ ] **Antes de elegir:** verificar qué pasarelas de pago puedo usar para cobrar desde mi país (Lemon Squeezy u otras) y sus comisiones
- [ ] Integrar la pasarela elegida (checkout y portal de cliente)
- [ ] Webhook que actualiza `profiles.plan` con la clave de servicio
- [ ] Cuota ampliada para usuarios Pro

**Criterio de hecho:** un pago de prueba cambia mi plan a Pro y la cuota se amplía; cancelar lo devuelve a gratis.

### Día 28: Migración a hosting comercial y auditoría de seguridad

**Objetivo:** pasar a un hosting que permita uso comercial y auditar la seguridad antes de lanzar.

**Tareas:**

- [ ] Migrar a Vercel Pro o a Cloudflare (OpenNext) y configurar el dominio
- [ ] Implementar `ClaudeProvider` y pasar producción a Claude Haiku
- [ ] Revisar todo el historial git en busca de secretos (gitleaks con historial completo)
- [ ] Revisar RLS, cabeceras de seguridad, CORS y permisos de las claves
- [ ] Rotar cualquier clave que haya estado en un lugar dudoso

**Criterio de hecho:** la app funciona en el nuevo hosting con Claude Haiku y la auditoría no deja hallazgos abiertos de gravedad alta.

### Día 29: Pruebas finales, documentación y video demo

**Objetivo:** dejar todo probado, documentado y con un video que lo explique.

**Tareas:**

- [ ] Prueba de punta a punta del flujo principal
- [ ] Actualizar README y documentación
- [ ] Grabar el video demo (2 minutos o menos)
- [ ] Preparar los textos del lanzamiento

**Criterio de hecho:** el flujo completo pasa sin errores y el video demo está listo para publicar.

### Día 30: Lanzamiento y paso del repo a privado

**Objetivo:** lanzar Destila y cerrar el código.

**Tareas:**

- [ ] Publicar el lanzamiento
- [ ] Rotar todas las claves (Supabase, Upstash, Gemini, Anthropic, pasarela de pago)
- [ ] Cambiar la visibilidad del repositorio a privado
- [ ] Revisar los forks existentes y pedir su retirada si infringen la licencia
- [ ] Actualizar el README para la etapa comercial
- [ ] Escribir el resumen final del reto

**Criterio de hecho:** Destila está en línea, el repo es privado, todas las claves están rotadas y el resumen final está publicado.
