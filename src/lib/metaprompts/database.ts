import { NotImplementedError } from "@/lib/errors";

import type { MetaPrompt, MetaPromptProvider, MetaPromptQuery } from "./types";

/**
 * Reads the private meta-prompts from a server-only Supabase table, so they
 * can be versioned without redeploying. Built on day 8.
 */
export class DatabaseMetaPromptProvider implements MetaPromptProvider {
  readonly source = "database" as const;

  async resolve(_query: MetaPromptQuery): Promise<MetaPrompt> {
    throw new NotImplementedError("DatabaseMetaPromptProvider.resolve", 8);
  }
}
