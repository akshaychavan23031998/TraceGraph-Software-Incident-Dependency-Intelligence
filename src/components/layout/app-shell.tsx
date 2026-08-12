"use client";

import { Activity, GitBranch, Menu, Network, Route, Share2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Overview", icon: Activity },
  { href: "/services", label: "Services", icon: Network },
  { href: "/incidents", label: "Incidents", icon: GitBranch },
  { href: "/paths", label: "Path Finder", icon: Route },
  { href: "/topology", label: "Topology", icon: Share2 },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app text-slate-100">
      <aside className="sidebar hidden lg:flex">
        <Brand />
        <nav aria-label="Primary navigation" className="mt-9 space-y-1">
          {navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="nav-link" data-active={active}>
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-slate-800/80 pt-5 text-xs leading-5 text-slate-500">
          Graph-powered operations intelligence
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="mobile-header lg:hidden">
          <Brand compact />
          <button
            type="button"
            className="icon-button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>
        {menuOpen && (
          <nav aria-label="Mobile navigation" className="mobile-nav lg:hidden">
            {navigation.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                  data-active={active}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon aria-hidden="true" size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
        <main className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
      <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
      <span>
        <span className="block text-[15px] font-semibold tracking-tight text-white">TraceGraph</span>
        {!compact && <span className="mt-0.5 block text-[11px] text-slate-500">Software Dependency Intelligence</span>}
      </span>
    </Link>
  );
}
