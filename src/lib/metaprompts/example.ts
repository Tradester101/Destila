import type { MetaPrompt, MetaPromptProvider, MetaPromptQuery } from "./types";

/**
 * ============================================================
 *  PUBLIC EXAMPLE. This is NOT Destila's real meta-prompt.
 * ============================================================
 * A deliberately generic meta-prompt so the app runs locally without the
 * private ones. Production uses the "env" or "database" source.
 */
const EXAMPLE_META_PROMPT: MetaPrompt = {
  id: "public-example",
  version: "0.0.1",
  system: [
    "Eres un asistente que convierte ideas sin formato en prompts claros.",
    "Reescribe la idea del usuario como un prompt con: rol, contexto, tarea,",
    "restricciones y formato de salida esperado.",
    "Responde en el mismo idioma que el usuario y no inventes datos.",
  ].join(" "),
};

export class ExampleMetaPromptProvider implements MetaPromptProvider {
  readonly source = "example" as const;

  async resolve(_query: MetaPromptQuery): Promise<MetaPrompt> {
    return EXAMPLE_META_PROMPT;
  }
}
