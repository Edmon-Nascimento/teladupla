"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  }

  return (
    <header className="relative border-b border-white/[0.08] bg-slate-950 text-white shadow-2xl shadow-slate-950/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center gap-5 px-4 sm:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="telaDupla início"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-300/20 transition-transform group-hover:-rotate-6">
            <Sparkles className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[21px] font-black tracking-[-0.04em]">
            tela<span className="text-cyan-300">Dupla</span>
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="relative ml-auto hidden w-full max-w-[440px] md:block"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-cyan-300/80" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar filmes e séries"
            aria-label="Buscar filmes e séries"
            className="h-11 w-full rounded-full border border-white/[0.12] bg-white/[0.055] pl-11 pr-5 text-sm text-white shadow-inner shadow-black/10 outline-none transition-colors placeholder:text-slate-500 hover:border-white/20 focus:border-cyan-300/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-300/10"
          />
        </form>

        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Conta">
          <Button asChild variant="ghost" size="sm" className="px-4 text-slate-300">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="h-10 rounded-full px-5 shadow-lg shadow-cyan-400/10">
            <Link href="/register">Registrar</Link>
          </Button>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto rounded-full border-white/15 md:hidden" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="border-b border-white/10 pb-7 pr-8">
              <span className="text-xl font-black tracking-[-0.04em]">tela<span className="text-cyan-300">Dupla</span></span>
              <span className="text-sm text-slate-400">Sua próxima história começa aqui.</span>
            </SheetHeader>
            <form onSubmit={handleSearch} className="relative mt-8">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300/80" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar filmes e séries"
                aria-label="Buscar filmes e séries"
                className="h-11 w-full rounded-full border border-white/10 bg-white/[0.06] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10"
              />
            </form>
            <div className="mt-auto grid gap-3 border-t border-white/10 pt-6">
              <SheetClose asChild><Button asChild variant="outline" className="h-11"><Link href="/login">Entrar</Link></Button></SheetClose>
              <SheetClose asChild><Button asChild className="h-11 rounded-full"><Link href="/register">Registrar</Link></Button></SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
