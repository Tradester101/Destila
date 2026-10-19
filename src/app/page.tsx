import { CaptureBox } from "@/components/capture-box";
import { getLimitsConfig } from "@/lib/limits";

export default function Home() {
  const { maxInputChars } = getLimitsConfig();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-4 py-16">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Destila · reto de 30 días</p>
        <h1 className="text-4xl font-semibold tracking-tight">De la idea cruda al prompt puro.</h1>
        <p className="text-muted-foreground">
          Escribe tu idea sin formato. Destila la convierte en el mejor prompt para tu modelo de
          IA, con menos tokens y menos intentos.
        </p>
      </header>
      <CaptureBox maxInputChars={maxInputChars} />
    </main>
  );
}
