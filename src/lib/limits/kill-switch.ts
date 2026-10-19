import { getLimitsConfig } from "./config";

export type ServiceStatus = { paused: false } | { paused: true; message: string };

const PAUSED_MESSAGE =
  "Destila está en pausa por hoy: alcanzamos el límite diario de uso. Vuelve mañana.";

/**
 * Global kill switch. Checked before every AI call.
 * Today: manual switch only (`KILL_SWITCH_FORCE=true`).
 * Day 17: also compares today's spend in `usage_log` with `DAILY_GLOBAL_BUDGET_USD`.
 */
export async function getServiceStatus(): Promise<ServiceStatus> {
  const config = getLimitsConfig();

  if (config.killSwitchForced) {
    return { paused: true, message: PAUSED_MESSAGE };
  }

  return { paused: false };
}
