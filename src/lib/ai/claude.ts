import { NotImplementedError } from "@/lib/errors";

import type { AIGenerateRequest, AIGenerateResult, AIProvider, AIUsage } from "./types";

// Production provider (Claude Haiku). Wired up before launch (week 4).
export class ClaudeProvider implements AIProvider {
  readonly id = "claude" as const;

  constructor(
    private readonly apiKey: string,
    readonly model: string,
  ) {}

  async generate(_request: AIGenerateRequest): Promise<AIGenerateResult> {
    throw new NotImplementedError("ClaudeProvider.generate", 28);
  }

  async *stream(
    _request: AIGenerateRequest,
    _onUsage?: (usage: AIUsage) => void,
  ): AsyncIterable<string> {
    throw new NotImplementedError("ClaudeProvider.stream", 28);
  }
}
