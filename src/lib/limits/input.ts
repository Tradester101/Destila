import { isGoalId, isTargetModelId, type GoalId, type TargetModelId } from "@/lib/catalog";

export interface DestilaInput {
  input: string;
  goal?: GoalId;
  targetModel?: TargetModelId;
}

export type InputValidation =
  | { ok: true; value: DestilaInput }
  | { ok: false; error: string };

/** Validates the request body before anything costs money. */
export function validateDestilaInput(body: unknown, maxInputChars: number): InputValidation {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "El cuerpo de la petición debe ser un objeto JSON." };
  }

  const { input, goal, targetModel } = body as Record<string, unknown>;

  if (typeof input !== "string" || input.trim().length === 0) {
    return { ok: false, error: "Escribe tu idea antes de destilarla." };
  }

  const trimmed = input.trim();
  if (trimmed.length > maxInputChars) {
    return {
      ok: false,
      error: `Tu idea supera el máximo de ${maxInputChars} caracteres.`,
    };
  }

  if (goal !== undefined && !isGoalId(goal)) {
    return { ok: false, error: "El objetivo no es válido." };
  }

  if (targetModel !== undefined && !isTargetModelId(targetModel)) {
    return { ok: false, error: "El modelo destino no es válido." };
  }

  return { ok: true, value: { input: trimmed, goal, targetModel } };
}
