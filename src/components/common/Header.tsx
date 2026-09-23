"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [query, setQuery] = useState("");

  const { user, refreshUser } = useAuth();

  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    setQuery("");
  }

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      await refreshUser();
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 text-white backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-375 items-center gap-10 px-6 lg:px-10">
        <Link
          href="/"
          className="shrink-0 text-2xl font-bold tracking-tight"
        >
          tela<span className="text-cyan-300">Dupla</span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="ml-auto hidden w-full max-w-xl items-center gap-3 md:flex"
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar filmes e séries..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
          />

          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Buscar
          </button>
        </form>

        {user && (
          <Link
            href="/favorites"
            className="hidden text-sm font-semibold text-slate-200 transition hover:text-cyan-300 md:block"
          >
            Favoritos
          </Link>
        )}

        {user ? (
          <div className="hidden items-center gap-4 md:flex">
            <span className="text-sm text-slate-300">
              Olá, {user.name}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer text-sm font-semibold text-slate-200 transition hover:text-cyan-300"
            >
              Sair
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-slate-200 transition hover:text-cyan-300 md:block"
          >
            Entrar
          </Link>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="ml-auto rounded-lg p-2 text-slate-200 transition hover:bg-slate-800 md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="border-slate-800 bg-slate-950 px-6 text-white"
          >
            <div className="mt-10">
              <h2 className="mb-6 text-xl font-semibold">Buscar</h2>

              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-4"
              >
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar filmes e séries..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Buscar
                </button>
              </form>

              {user && (
                <Link
                  href="/favorites"
                  className="mt-8 block rounded-xl border border-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  Favoritos
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}