import "server-only";

import { ClaudeProvider } from "./claude";
import { GeminiProvider } from "./gemini";
import type { AIProvider, AIProviderId } from "./types";

export type * from "./types";

const DEFAULT_MODELS: Record<AIProviderId, string> = {
  gemini: "gemini-flash-latest",
  claude: "claude-haiku-5-5",
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}.`);
  }
  return value;
}

/** Picks the model backend from `AI_PROVIDER` (default: gemini). */
export function getAIProvider(): AIProvider {
  const id = (process.env.AI_PROVIDER || "gemini") as AIProviderId;

  switch (id) {
    case "gemini":
      return new GeminiProvider(
        requireEnv("GEMINI_API_KEY"),
        process.env.GEMINI_MODEL || DEFAULT_MODELS.gemini,
      );
    case "claude":
      return new ClaudeProvider(
        requireEnv("ANTHROPIC_API_KEY"),
        process.env.CLAUDE_MODEL || DEFAULT_MODELS.claude,
      );
    default:
      throw new Error(`Unknown AI_PROVIDER "${id}". Use "gemini" or "claude".`);
  }
}
