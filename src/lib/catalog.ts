/**
 * Product catalog shared by UI, API and providers.
 * Labels are user-facing (Spanish first); ids are stable and stored in the DB.
 */

export const GOALS = [
  { id: "writing", label: "Escribir" },
  { id: "coding", label: "Programar" },
  { id: "research", label: "Investigar" },
  { id: "data", label: "Datos" },
  { id: "images", label: "Imágenes" },
  { id: "marketing", label: "Marketing" },
  { id: "studying", label: "Estudiar" },
] as const;

export type GoalId = (typeof GOALS)[number]["id"];

export const TARGET_MODELS = [
  { id: "claude", label: "Claude" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "gemini", label: "Gemini" },
  { id: "midjourney", label: "Midjourney" },
  { id: "other", label: "Otro" },
] as const;

export type TargetModelId = (typeof TARGET_MODELS)[number]["id"];

export function isGoalId(value: unknown): value is GoalId {
  return GOALS.some((goal) => goal.id === value);
}

export function isTargetModelId(value: unknown): value is TargetModelId {
  return TARGET_MODELS.some((model) => model.id === value);
}
