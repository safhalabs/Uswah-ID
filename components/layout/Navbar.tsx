"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MapPin,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Calendar,
  Clock,
  Heart,
  BookOpen,
  Monitor,
  Smartphone,
  Sliders,
  RotateCcw,
} from "lucide-react";
import { CityLocation } from "@/data/cities";
import { getStoredPreferences, saveStoredPreferences } from "@/lib/storage";
import { getHijriDate } from "@/lib/hijriConverter";
import { soundEngine } from "@/lib/audioAlert";
import Logo from "@/components/ui/Logo";

interface NavbarProps {
  currentCity: CityLocation;
  onOpenCitySelector: () => void;
  layoutMode?: "auto" | "desktop" | "portrait" | "mobile";
  onLayoutModeChange?: (mode: "auto" | "desktop" | "portrait" | "mobile") => void;
}

export default function Navbar({
  currentCity,
  onOpenCitySelector,
  layoutMode = "auto",
  onLayoutModeChange,
}: NavbarProps) {
  const pathname = usePathname();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [hijriToday, setHijriToday] = useState<string>("");
  const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);

  useEffect(() => {
    const prefs = getStoredPreferences();
    setAudioEnabled(prefs.audioEnabled);
    setIsDark(prefs.darkMode);

    if (prefs.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const hijri = getHijriDate(new Date(), prefs.hijriAdjustment);
    setHijriToday(hijri.formatted);
  }, []);

  const handleModeSelect = (mode: "auto" | "desktop" | "portrait" | "mobile") => {
    saveStoredPreferences({ layoutMode: mode });
    onLayoutModeChange?.(mode);
    setIsLayoutDropdownOpen(false);
  };

  const toggleAudio = () => {
    const nextVal = !audioEnabled;
    setAudioEnabled(nextVal);
    saveStoredPreferences({ audioEnabled: nextVal });
    if (nextVal) {
      soundEngine.playGentleChime(0.5);
    }
  };

  const toggleDarkMode = () => {
    const nextVal = !isDark;
    setIsDark(nextVal);
    saveStoredPreferences({ darkMode: nextVal });
    if (nextVal) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinks = [
    { href: "/", label: "Beranda", icon: Clock },
    { href: "/jadwal-sholat", label: "Jadwal Sholat", icon: Clock },
    { href: "/kalender-hijriah", label: "Kalender Hijriah", icon: Calendar },
    { href: "/puasa-sunnah", label: "Puasa Sunnah", icon: Heart },
    { href: "/amalan-rasulullah", label: "Teladan Rasul", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-900/10 dark:border-emerald-500/20 bg-white/85 dark:bg-[#07130e]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand with vector mark */}
          <Link href="/" className="group py-1">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-400/30 shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white dark:text-emerald-300" : "opacity-70"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions (Location, Sound, Theme) */}
          <div className="flex items-center gap-2">
            {/* City Selector Chip */}
            <button
              onClick={onOpenCitySelector}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 dark:hover:bg-emerald-900 border border-emerald-200/80 dark:border-emerald-800/80 transition-all shadow-xs group"
              title="Ganti Kota Lokasi Sholat"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="max-w-[95px] sm:max-w-[130px] truncate">{currentCity.name}</span>
            </button>

            {/* Audio Alert Toggle */}
            <button
              onClick={toggleAudio}
              type="button"
              className={`p-2 rounded-xl border transition-all ${
                audioEnabled
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80 hover:bg-emerald-100/60 shadow-xs"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border-slate-200 dark:border-slate-700"
              }`}
              title={audioEnabled ? "Pengingat Suara Aktif" : "Pengingat Suara Senyap"}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Display Mode Selector (Desktop / Monitor Miring / HP / Auto) */}
            <div className="relative">
              <button
                onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
                type="button"
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  layoutMode !== "auto"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40"
                    : "border-slate-200 dark:border-emerald-800/60 bg-white dark:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-900/60"
                }`}
                title={`Mode Tampilan: ${
                  layoutMode === "auto"
                    ? "Otomatis"
                    : layoutMode === "desktop"
                    ? "Desktop Standar"
                    : layoutMode === "portrait"
                    ? "Monitor Miring (Portrait)"
                    : "Ponsel (HP)"
                }`}
              >
                {layoutMode === "portrait" ? (
                  <RotateCcw className="w-4 h-4 text-amber-500 rotate-90" />
                ) : layoutMode === "desktop" ? (
                  <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : layoutMode === "mobile" ? (
                  <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Sliders className="w-4 h-4" />
                )}
              </button>

              {isLayoutDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsLayoutDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#091b14] text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-emerald-900/60 p-2 z-40">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 py-1">
                      Mode Tampilan Layar
                    </p>
                    <button
                      onClick={() => handleModeSelect("auto")}
                      type="button"
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                        layoutMode === "auto"
                          ? "bg-emerald-600 text-white font-bold"
                          : "hover:bg-slate-100 dark:hover:bg-emerald-950/60"
                      }`}
                    >
                      <Sliders className="w-4 h-4" />
                      <div>
                        <p className="leading-tight">Otomatis (Adaptif)</p>
                        <p className="text-[10px] opacity-75 font-normal">Deteksi otomatis HP / Desktop</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleModeSelect("desktop")}
                      type="button"
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                        layoutMode === "desktop"
                          ? "bg-emerald-600 text-white font-bold"
                          : "hover:bg-slate-100 dark:hover:bg-emerald-950/60"
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      <div>
                        <p className="leading-tight">Desktop Widescreen</p>
                        <p className="text-[10px] opacity-75 font-normal">Layout horizontal seimbang</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleModeSelect("portrait")}
                      type="button"
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                        layoutMode === "portrait"
                          ? "bg-emerald-600 text-white font-bold"
                          : "hover:bg-slate-100 dark:hover:bg-emerald-950/60"
                      }`}
                    >
                      <RotateCcw className="w-4 h-4 rotate-90 text-amber-300" />
                      <div>
                        <p className="leading-tight">Monitor Miring (Portrait 9:16)</p>
                        <p className="text-[10px] opacity-75 font-normal">Optimal monitor vertikal / pivot</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleModeSelect("mobile")}
                      type="button"
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                        layoutMode === "mobile"
                          ? "bg-emerald-600 text-white font-bold"
                          : "hover:bg-slate-100 dark:hover:bg-emerald-950/60"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <div>
                        <p className="leading-tight">Ponsel (HP Mobile)</p>
                        <p className="text-[10px] opacity-75 font-normal">Format sempit satu tangan</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              type="button"
              className="p-2 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-white dark:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-900/60 transition-colors shadow-xs"
              title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
