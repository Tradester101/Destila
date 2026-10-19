import { getLimitsConfig, getServiceStatus, validateDestilaInput } from "@/lib/limits";

/**
 * POST /api/destila
 *
 * Guard order (each step is cheaper than the next):
 *   1. Validate input (size, goal, target model)        <- today
 *   2. Kill switch (global daily budget)               <- today (manual), day 17 (budget)
 *   3. Require a signed-in user: no account, no AI     <- day 3
 *   4. Per-user daily quota                            <- day 15
 *   5. Resolve meta-prompt + call the AI provider      <- day 6 / day 8
 *   6. Record usage in usage_log                       <- day 16
 */
export async function POST(request: Request) {
  const limits = getLimitsConfig();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_json", message: "El cuerpo de la petición no es JSON válido." },
      { status: 400 },
    );
  }

  const validation = validateDestilaInput(body, limits.maxInputChars);
  if (!validation.ok) {
    return Response.json(
      { error: "invalid_input", message: validation.error },
      { status: 400 },
    );
  }

  const status = await getServiceStatus();
  if (status.paused) {
    return Response.json({ error: "service_paused", message: status.message }, { status: 503 });
  }

  return Response.json(
    {
      error: "not_implemented",
      message: "Tu idea llegó bien. El destilador se conecta a la IA en el día 6 del reto.",
    },
    { status: 501 },
  );
}
