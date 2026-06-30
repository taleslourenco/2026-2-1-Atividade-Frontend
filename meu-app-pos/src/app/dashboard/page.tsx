"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Quote {
  id: number;
  quote: string;
  author: string;
}

export default function DashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [localAuthors, setLocalAuthors] = useState<string[]>([]);
  
  // Estados do Formulário
  const [quoteText, setQuoteText] = useState("");
  const [authorText, setAuthorText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Carregar dados iniciais
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch("https://dummyjson.com/quotes?limit=10");
        const data = await res.json();
        setQuotes(data.quotes || []);
        
        // Carregar autores do localStorage
        const savedAuthors = localStorage.getItem("local_authors");
        if (savedAuthors) {
          setLocalAuthors(JSON.parse(savedAuthors));
        }
      } catch (err) {
        setError("Não foi possível carregar as citações.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Manipulação do formulário (Criar / Atualizar)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!quoteText.trim() || !authorText.trim()) {
      setError("Ambos os campos de Frase e Autor são obrigatórios.");
      return;
    }

    const trimmedAuthor = authorText.trim();

    if (editingId !== null) {
      // Modo Edição (Update)
      setQuotes(prev =>
        prev.map(q => (q.id === editingId ? { ...q, quote: quoteText, author: trimmedAuthor } : q))
      );
      setEditingId(null);
    } else {
      // Modo Criação (Create)
      const newQuote: Quote = {
        id: Date.now(), // ID incremental simulado
        quote: quoteText,
        author: trimmedAuthor,
      };
      setQuotes(prev => [newQuote, ...prev]);
    }

    // Guardar autor localmente se ele for novo
    if (!localAuthors.includes(trimmedAuthor)) {
      const updatedAuthors = [...localAuthors, trimmedAuthor];
      setLocalAuthors(updatedAuthors);
      localStorage.setItem("local_authors", JSON.stringify(updatedAuthors));
    }

    // Limpar formulário
    setQuoteText("");
    setAuthorText("");
  };

  // Prepara campos para edição
  const handleEdit = (quote: Quote) => {
    setEditingId(quote.id);
    setQuoteText(quote.quote);
    setAuthorText(quote.author);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Remoção (Delete)
  const handleDelete = (id: number) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setQuoteText("");
      setAuthorText("");
    }
  };

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("user_data");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard de Frases</h1>
          <p className="text-sm text-muted-foreground">Gerencie citações locais e da API externa</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          Sair
        </button>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulário lateral */}
        <section className="md:col-span-1">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId !== null ? "Editar Frase" : "Nova Frase"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-900">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Frase / Citação</label>
                <textarea
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  rows={3}
                  className="w-full text-sm p-2 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Escreva a frase célebre..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Autor</label>
                <input
                  type="text"
                  value={authorText}
                  onChange={(e) => setAuthorText(e.target.value)}
                  list="authors-suggestions"
                  className="w-full text-sm h-9 p-2 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Nome do autor"
                />
                <datalist id="authors-suggestions">
                  {localAuthors.map((author, index) => (
                    <option key={index} value={author} />
                  ))}
                </datalist>
                {localAuthors.length > 0 && (
                  <p className="text-[10px] text-zinc-400">Autores salvos localmente aparecem como sugestão.</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 text-xs h-9 font-medium bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 rounded-md shadow hover:opacity-90"
                >
                  {editingId !== null ? "Atualizar" : "Adicionar"}
                </button>
                {editingId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setQuoteText("");
                      setAuthorText("");
                    }}
                    className="text-xs px-3 h-9 font-medium border border-zinc-200 dark:border-zinc-800 rounded-md"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Listagem principal */}
        <section className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Listagem de Citações</h2>

          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando dados da API...</p>
          ) : quotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma frase cadastrada no sistema.</p>
          ) : (
            <div className="space-y-3">
              {quotes.map((q) => (
                <div 
                  key={q.id} 
                  className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    <p className="text-sm italic font-medium text-zinc-800 dark:text-zinc-200">
                      &ldquo;{q.quote}&rdquo;
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-semibold">— {q.author}</p>
                  </div>

                  <div className="flex gap-4 justify-end text-xs border-t border-zinc-100 dark:border-zinc-800 pt-2">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-600 dark:text-red-400 hover:underline font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}