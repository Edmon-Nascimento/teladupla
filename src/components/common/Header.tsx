"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [query, setQuery] = useState("");

  const { user, refreshUser } = useAuth();

  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 text-white backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-375 items-center gap-6 px-5 lg:px-10">
        <div className="flex shrink-0 items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            tela<span className="text-cyan-300">Dupla</span>
          </Link>

          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Navegação principal"
          >
            <Link
              href="/"
              className="text-sm font-semibold text-white transition hover:text-cyan-300"
            >
              Início
            </Link>

            {user && (
              <Link
                href="/favorites"
                className="text-sm font-semibold text-slate-400 transition hover:text-cyan-300"
              >
                Favoritos
              </Link>
            )}
          </nav>
        </div>

        <form
          onSubmit={handleSearch}
          className="ml-auto hidden w-full max-w-md items-center gap-3 md:flex"
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar filmes e séries..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
          />

          <Button type="submit">Buscar</Button>
        </form>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-slate-300">Olá, {user.name}</span>

              <Button type="button" onClick={handleLogout} variant="ghost">
                Sair
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-200 transition hover:text-cyan-300"
            >
              Entrar
            </Link>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-auto md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full max-w-sm border-slate-800 bg-slate-950 px-6 text-white"
          >
            <div className="mt-8 flex flex-col gap-8">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Navegação
                </p>

                <nav className="flex flex-col" aria-label="Navegação mobile">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="border-b border-white/10 py-3 text-base font-semibold text-white transition hover:text-cyan-300"
                    >
                      Início
                    </Link>
                  </SheetClose>
                </nav>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Buscar
                </p>

                <form onSubmit={handleSearch} className="flex flex-col gap-3">
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar filmes e séries..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />

                  <Button type="submit" className="w-full">
                    Buscar
                  </Button>
                </form>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Conta
                </p>

                <div className="flex flex-col">
                  {user && (
                    <SheetClose asChild>
                      <Link
                        href="/favorites"
                        className="border-b border-white/10 py-3 text-base font-semibold text-slate-200 transition hover:text-cyan-300"
                      >
                        Favoritos
                      </Link>
                    </SheetClose>
                  )}

                  {user ? (
                    <SheetClose asChild>
                      <Button
                        type="button"
                        onClick={handleLogout}
                        variant="ghost"
                        className="justify-start rounded-none border-b border-white/10 px-0 py-3 text-base"
                      >
                        Sair
                      </Button>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        href="/login"
                        className="border-b border-white/10 py-3 text-base font-semibold text-slate-200 transition hover:text-cyan-300"
                      >
                        Entrar
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
