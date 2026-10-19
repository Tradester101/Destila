import { NotImplementedError } from "@/lib/errors";

export interface QuotaStatus {
  allowed: boolean;
  used: number;
  limit: number;
  /** When the daily window resets (UTC midnight). */
  resetsAt: Date;
}

/**
 * Per-user daily quota backed by Upstash Redis (fixed daily window).
 * Built on day 15.
 */
export async function consumeDailyQuota(_userId: string): Promise<QuotaStatus> {
  throw new NotImplementedError("consumeDailyQuota", 15);
}
