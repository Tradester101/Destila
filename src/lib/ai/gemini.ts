import { NotImplementedError } from "@/lib/errors";

import type { AIGenerateRequest, AIGenerateResult, AIProvider, AIUsage } from "./types";

// Development provider (Gemini API free tier). Wired up on day 6.
export class GeminiProvider implements AIProvider {
  readonly id = "gemini" as const;

  constructor(
    private readonly apiKey: string,
    readonly model: string,
  ) {}

  async generate(_request: AIGenerateRequest): Promise<AIGenerateResult> {
    throw new NotImplementedError("GeminiProvider.generate", 6);
  }

  async *stream(
    _request: AIGenerateRequest,
    _onUsage?: (usage: AIUsage) => void,
  ): AsyncIterable<string> {
    throw new NotImplementedError("GeminiProvider.stream", 6);
  }
}
