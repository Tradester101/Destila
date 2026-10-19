/**
 * Limits are designed in from day 1 and read from env vars, so they can be
 * tuned without a deploy of new code. Defaults are deliberately conservative.
 */
export interface LimitsConfig {
  /** Free enhancements per user per day (UTC). */
  dailyFreeQuota: number;
  /** Max characters accepted in the raw idea. */
  maxInputChars: number;
  /** Fixed `max_tokens` sent to the AI provider. Never taken from the client. */
  maxOutputTokens: number;
  /** Global daily spend cap in USD. Reaching it pauses the service. */
  dailyGlobalBudgetUsd: number;
  /** Manual kill switch: `true` pauses the service right away. */
  killSwitchForced: boolean;
}

function numberFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export function getLimitsConfig(): LimitsConfig {
  return {
    dailyFreeQuota: Math.floor(numberFromEnv("DAILY_FREE_QUOTA", 5)),
    maxInputChars: Math.floor(numberFromEnv("MAX_INPUT_CHARS", 4000)),
    maxOutputTokens: Math.floor(numberFromEnv("MAX_OUTPUT_TOKENS", 1024)),
    dailyGlobalBudgetUsd: numberFromEnv("DAILY_GLOBAL_BUDGET_USD", 1),
    killSwitchForced: process.env.KILL_SWITCH_FORCE === "true",
  };
}
