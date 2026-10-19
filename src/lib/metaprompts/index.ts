import "server-only";

import { DatabaseMetaPromptProvider } from "./database";
import { EnvMetaPromptProvider } from "./env";
import { ExampleMetaPromptProvider } from "./example";
import type { MetaPromptProvider, MetaPromptSource } from "./types";

export type * from "./types";

/** Picks the meta-prompt source from `METAPROMPT_SOURCE` (default: example). */
export function getMetaPromptProvider(): MetaPromptProvider {
  const source = (process.env.METAPROMPT_SOURCE || "example") as MetaPromptSource;

  switch (source) {
    case "example":
      if (process.env.NODE_ENV === "production") {
        console.warn("[destila] Using the PUBLIC EXAMPLE meta-prompt in production.");
      }
      return new ExampleMetaPromptProvider();
    case "env":
      return new EnvMetaPromptProvider();
    case "database":
      return new DatabaseMetaPromptProvider();
    default:
      throw new Error(
        `Unknown METAPROMPT_SOURCE "${source}". Use "example", "env" or "database".`,
      );
  }
}
