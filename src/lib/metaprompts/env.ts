import { NotImplementedError } from "@/lib/errors";

import type { MetaPrompt, MetaPromptProvider, MetaPromptQuery } from "./types";

/**
 * Reads the private meta-prompts from the `DESTILA_METAPROMPTS` env var
 * (JSON). Built on day 8.
 */
export class EnvMetaPromptProvider implements MetaPromptProvider {
  readonly source = "env" as const;

  async resolve(_query: MetaPromptQuery): Promise<MetaPrompt> {
    throw new NotImplementedError("EnvMetaPromptProvider.resolve", 8);
  }
}
