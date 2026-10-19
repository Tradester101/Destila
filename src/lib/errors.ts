/**
 * Thrown by stubs that are planned but not built yet.
 * `day` points to the challenge day (see ROADMAP.md) where it gets implemented.
 */
export class NotImplementedError extends Error {
  constructor(
    public readonly feature: string,
    public readonly day: number,
  ) {
    super(`${feature} is not implemented yet (planned for day ${day}).`);
    this.name = "NotImplementedError";
  }
}
