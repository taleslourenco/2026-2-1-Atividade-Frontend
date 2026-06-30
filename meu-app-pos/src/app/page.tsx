import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 to-zinc-950">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight">Atividade Avaliativa</h1>
        <p className="text-muted-foreground">Disciplina de Programação Orientada a Serviços (POS)</p>
        
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Aluno</p>
          <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">L A Minora</p>
        </div>

        <Link 
          href="/auth" 
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90"
        >
          Ir para o Login
        </Link>
      </div>
    </main>
  );
}