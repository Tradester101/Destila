export type AIProviderId = "gemini" | "claude";

export interface AIGenerateRequest {
  /** System instructions: the meta-prompt resolved by a MetaPromptProvider. */
  system: string;
  /** The user's raw idea, already validated by the limits layer. */
  prompt: string;
  /** Hard output cap, always taken from the limits config (never from the client). */
  maxOutputTokens: number;
}

export interface AIUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface AIGenerateResult {
  text: string;
  usage: AIUsage;
}

/**
 * Every model backend implements this interface. The rest of the app only
 * talks to `getAIProvider()`, so switching models is an env var change.
 */
export interface AIProvider {
  readonly id: AIProviderId;
  readonly model: string;
  generate(request: AIGenerateRequest): Promise<AIGenerateResult>;
  /** Streams text chunks. Usage is reported once the stream finishes. */
  stream(
    request: AIGenerateRequest,
    onUsage?: (usage: AIUsage) => void,
  ): AsyncIterable<string>;
}
