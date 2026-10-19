import type { GoalId, TargetModelId } from "@/lib/catalog";

export interface MetaPrompt {
  id: string;
  version: string;
  /** System instructions sent to the AI provider. */
  system: string;
}

export interface MetaPromptQuery {
  goal?: GoalId;
  targetModel?: TargetModelId;
}

/**
 * Source of meta-prompts. The real ones are private and never live in this
 * repo: they are loaded from env vars or the database at runtime.
 */
export interface MetaPromptProvider {
  readonly source: MetaPromptSource;
  resolve(query: MetaPromptQuery): Promise<MetaPrompt>;
}

export type MetaPromptSource = "example" | "env" | "database";
