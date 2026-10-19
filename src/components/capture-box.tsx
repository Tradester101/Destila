"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CaptureBoxProps {
  maxInputChars: number;
}

type Feedback = { kind: "info" | "error"; message: string } | null;

export function CaptureBox({ maxInputChars }: CaptureBoxProps) {
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const length = input.trim().length;
  const tooLong = length > maxInputChars;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/destila", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data: { message?: string } = await response.json();
      setFeedback({
        kind: response.status === 501 ? "info" : "error",
        message: data.message ?? "Algo salió mal. Inténtalo de nuevo.",
      });
    } catch {
      setFeedback({ kind: "error", message: "No pudimos conectar con el servidor." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <label htmlFor="idea" className="sr-only">
        Tu idea
      </label>
      <Textarea
        id="idea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Vuelca aquí tu idea tal cual la tienes en la cabeza…"
        className="min-h-40 resize-y text-base"
        aria-invalid={tooLong}
        aria-describedby="idea-counter"
      />
      <div className="flex items-center justify-between gap-4">
        <span
          id="idea-counter"
          className={tooLong ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
        >
          {length} / {maxInputChars}
        </span>
        <Button type="submit" disabled={pending || length === 0 || tooLong}>
          {pending ? "Destilando…" : "Destilar"}
        </Button>
      </div>
      {feedback && (
        <p
          role="status"
          className={
            feedback.kind === "error"
              ? "text-sm text-destructive"
              : "rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground"
          }
        >
          {feedback.message}
        </p>
      )}
    </form>
  );
}
