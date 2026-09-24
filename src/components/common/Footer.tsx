import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Início" },
  { href: "/favorites", label: "Favoritos" },
  { href: "/search", label: "Buscar" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto grid w-full max-w-375 gap-10 px-5 py-12 lg:grid-cols-[1fr_auto] lg:gap-16 lg:px-10 lg:py-14">
        <div className="max-w-sm">
          <Link href="/" className="text-xl font-bold tracking-tight">
            tela<span className="text-cyan-300">Dupla</span>
          </Link>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Encontre, descubra e compartilhe suas histórias favoritas do cinema
            e das séries.
          </p>
        </div>

        <nav
          className="grid grid-cols-2 gap-x-10 gap-y-4 sm:flex sm:items-start sm:gap-8"
          aria-label="Navegação do rodapé"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-400 transition hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-375 px-5 py-5 text-xs text-slate-500 lg:px-10">
          © {new Date().getFullYear()} telaDupla. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
