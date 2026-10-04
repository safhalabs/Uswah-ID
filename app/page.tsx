"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import PrayerTimesCard from "@/components/prayer/PrayerTimesCard";
import FastingCard from "@/components/fasting/FastingCard";
import MonthGuidanceCard from "@/components/sunnah/MonthGuidanceCard";
import TahajudDhuhaCard from "@/components/sunnah/TahajudDhuhaCard";
import AsmaulHusnaHomeCard from "@/components/asmaul-husna/AsmaulHusnaHomeCard";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import CitySelectorModal from "@/components/prayer/CitySelectorModal";
import { CityLocation, DEFAULT_CITY } from "@/data/cities";
import { getStoredPreferences, saveStoredPreferences } from "@/lib/storage";
import Link from "next/link";
import {
  Calendar,
  Clock,
  BookOpen,
  Heart,
  ArrowRight,
  Sparkles,
  Compass,
  Sun,
} from "lucide-react";

export default function HomePage() {
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_CITY);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"auto" | "desktop" | "portrait" | "mobile">("auto");
  const [isHardwarePortrait, setIsHardwarePortrait] = useState(false);

  useEffect(() => {
    const prefs = getStoredPreferences();
    if (prefs.city) {
      setCurrentCity(prefs.city);
    }
    if (prefs.layoutMode) {
      setLayoutMode(prefs.layoutMode);
    }

    if (typeof window !== "undefined") {
      const media = window.matchMedia("(orientation: portrait) and (min-width: 768px)");
      setIsHardwarePortrait(media.matches);

      const handler = (e: MediaQueryListEvent) => {
        setIsHardwarePortrait(e.matches);
      };
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, []);

  const handleSelectCity = (city: CityLocation) => {
    setCurrentCity(city);
    saveStoredPreferences({ city });
  };

  const isPortraitEffective =
    layoutMode === "portrait" || (layoutMode === "auto" && isHardwarePortrait);
  const isMobileEffective = layoutMode === "mobile";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        currentCity={currentCity}
        onOpenCitySelector={() => setIsCityModalOpen(true)}
        layoutMode={layoutMode}
        onLayoutModeChange={(mode) => setLayoutMode(mode)}
      />

      <main
        className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 sm:space-y-7 transition-all ${
          isMobileEffective
            ? "max-w-md"
            : isPortraitEffective
            ? "max-w-4xl portrait-monitor-container"
            : "max-w-7xl"
        }`}
      >
        {/* Hero Section: Jadwal Sholat Aktif & Live Countdown */}
        <section>
          <PrayerTimesCard
            city={currentCity}
            onOpenCitySelector={() => setIsCityModalOpen(true)}
            isPortraitMode={isPortraitEffective}
          />
        </section>

        {/* Section: Rekomendasi Waktu Sholat Dhuha & Tahajud */}
        <section>
          <div className="mb-3.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
              <Sun className="w-5 h-5 text-amber-500" />
              <span>Rekomendasi Waktu Sholat Sunnah</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Panduan astronomis waktu Dhuha &amp; Tahajud, peringatan batas akhir waktu sholat, dan keutamaan
            </p>
          </div>
          <TahajudDhuhaCard
            city={currentCity}
            isPortraitMode={isPortraitEffective}
          />
        </section>

        {/* 2-Column Section: Pengingat Puasa & Quick Nav */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <FastingCard />
          </div>

          {/* Quick Access Card (Modern & Compact) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#043325] to-[#021c15] text-white p-5 sm:p-6 shadow-sm border border-emerald-500/25 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-[11px] font-bold mb-3 border border-emerald-600/40">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Uswatun Hasanah</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold mb-1.5 leading-snug tracking-tight text-white">
                Meneladani Ibadah &amp; Akhlak Rasulullah
              </h3>
              <p className="text-xs text-emerald-100/75 leading-relaxed">
                Setiap bulan dalam kalender Hijriah menyimpan jejak sejarah agung dan sunnah mulia yang dapat kita amalkan dalam kehidupan sehari-hari.
              </p>
            </div>

            <div className="mt-5 space-y-2.5">
              <Link
                href="/kalender-hijriah"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/8 hover:bg-white/15 text-xs font-bold transition-all group border border-white/10 hover:border-emerald-400/30 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-105 transition-transform">
                    <Calendar className="w-4 h-4 text-emerald-300" />
                  </div>
                  <span>Kalender Hijriah &amp; Puasa</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/jadwal-sholat"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/8 hover:bg-white/15 text-xs font-bold transition-all group border border-white/10 hover:border-emerald-400/30 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-105 transition-transform">
                    <Clock className="w-4 h-4 text-emerald-300" />
                  </div>
                  <span>Jadwal Sholat 1 Bulan Penuh</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/amalan-rasulullah"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/8 hover:bg-white/15 text-xs font-bold transition-all group border border-white/10 hover:border-emerald-400/30 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-105 transition-transform">
                    <Compass className="w-4 h-4 text-emerald-300" />
                  </div>
                  <span>Peta Amalan 12 Bulan Hijriah</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/asmaul-husna"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/8 hover:bg-white/15 text-xs font-bold transition-all group border border-white/10 hover:border-emerald-400/30 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-400/25 text-amber-300 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <span>99 Asmaul Husna &amp; Hafalan</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section: 99 Asmaul Husna & Program Hafalan */}
        <section>
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Asmaul Husna &amp; Program Hafalan</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                99 Nama Allah Yang Maha Indah, audio pelafalan, dan metode menghafal bertahap
              </p>
            </div>
            <Link
              href="/asmaul-husna"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 transition-all"
            >
              <span>Buka Semua 99 Nama</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <AsmaulHusnaHomeCard />
        </section>

        {/* Section: Meneladani Rasulullah SAW di Bulan Ini */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
              <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-600/20" />
              <span>Meneladani Rasulullah SAW Bulan Ini</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Amalan sunnah berdalil hadits shahih &amp; napak tilas sirah nabawiyah sepanjang masa
            </p>
          </div>
          <MonthGuidanceCard />
        </section>
      </main>

      <Footer />
      <BottomNav />

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
      />

      <PwaInstallPrompt />
    </div>
  );
}
