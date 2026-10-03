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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#071710]/95 backdrop-blur-xl border-t border-emerald-900/10 dark:border-emerald-500/20 py-1 px-2 shadow-lg shadow-black/10">
      <div className="grid grid-cols-5 gap-0.5 items-center max-w-md mx-auto">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative ${
                isActive
                  ? "text-emerald-700 dark:text-emerald-300 font-bold"
                  : "text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {isActive && (
                <span className="absolute top-0.5 w-6 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              )}
              <div
                className={`p-1 rounded-xl transition-transform ${
                  isActive ? "bg-emerald-100/90 dark:bg-emerald-900/50 scale-105" : ""
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
