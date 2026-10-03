"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Calendar, Heart, BookOpen } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/jadwal-sholat", label: "Sholat", icon: Clock },
    { href: "/kalender-hijriah", label: "Kalender", icon: Calendar },
    { href: "/puasa-sunnah", label: "Puasa", icon: Heart },
    { href: "/amalan-rasulullah", label: "Amalan", icon: BookOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#081711]/95 backdrop-blur-lg border-t border-emerald-900/10 dark:border-emerald-500/20 py-1.5 px-3">
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors ${
                isActive
                  ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? "bg-emerald-100/80 dark:bg-emerald-900/50" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
