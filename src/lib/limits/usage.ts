import { NotImplementedError } from "@/lib/errors";
import type { AIProviderId, AIUsage } from "@/lib/ai/types";

export interface UsageRecord {
  userId: string;
  provider: AIProviderId;
  model: string;
  usage: AIUsage;
  costUsd: number;
  status: "ok" | "error" | "rejected";
}

/** Writes a row to `usage_log` with the service key. Built on day 16. */
export async function recordUsage(_record: UsageRecord): Promise<void> {
  throw new NotImplementedError("recordUsage", 16);
}
