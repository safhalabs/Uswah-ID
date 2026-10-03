"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import CitySelectorModal from "@/components/prayer/CitySelectorModal";
import MonthGuidanceCard from "@/components/sunnah/MonthGuidanceCard";
import { CityLocation, DEFAULT_CITY } from "@/data/cities";
import { ISLAMIC_MONTHS } from "@/data/islamicMonthsData";
import { getStoredPreferences, saveStoredPreferences } from "@/lib/storage";
import { BookOpen, Sparkles, Heart, Shield } from "lucide-react";

export default function AmalanRasulullahPage() {
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_CITY);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  useEffect(() => {
    const prefs = getStoredPreferences();
    if (prefs.city) setCurrentCity(prefs.city);
  }, []);

  const handleSelectCity = (city: CityLocation) => {
    setCurrentCity(city);
    saveStoredPreferences({ city });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        currentCity={currentCity}
        onOpenCitySelector={() => setIsCityModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Uswatun Hasanah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>Meneladani Rasulullah SAW di Setiap Bulan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Panduan amalan sunnah, sirah nabawiyah, dan checklist ibadah praktis sepanjang 12 bulan Hijriah berlandaskan Al-Qur&apos;an dan Hadits Shahih
          </p>
        </div>

        {/* Hero Interactive Component */}
        <section>
          <MonthGuidanceCard />
        </section>

        {/* 4 Bulan Haram (Asyhurul Hurum) Special Spotlight */}
        <section className="rounded-3xl bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-[#0a1a13] dark:to-[#07130e] p-6 sm:p-8 border border-amber-200/60 dark:border-emerald-900/60">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Mengenal 4 Bulan Haram (Asyhurul Hurum)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dzalqa&apos;dah, Dzulhijjah, Muharram, dan Rajab
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Allah SWT menegaskan dalam QS. At-Taubah ayat 36 bahwa di antara dua belas bulan, terdapat empat bulan haram yang dimuliakan. Kezhaliman di bulan ini bernilai dosa yang sangat berat, sementara amal shalih dilipatgandakan pahalanya oleh Allah SWT.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ISLAMIC_MONTHS.filter((m) => m.isHaramMonth).map((m) => (
              <div
                key={m.monthIndex}
                className="p-4 rounded-2xl bg-white dark:bg-[#0c1f18] border border-amber-200/50 dark:border-emerald-800/40 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Bulan ke-{m.monthIndex}
                  </span>
                  <span className="font-serif text-sm text-emerald-700 dark:text-emerald-400 font-bold">
                    {m.arabicName}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {m.latinName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {m.theme}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 12 Bulan Ikhtisar Grid */}
        <section className="rounded-3xl bg-white dark:bg-[#0c1f18] p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-emerald-950/80">
            <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Peta Perjalanan 12 Bulan Hijriah
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ikhtisar tema dan hikmah sepanjang tahun
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ISLAMIC_MONTHS.map((m) => (
              <div
                key={m.monthIndex}
                className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {String(m.monthIndex).padStart(2, "0")}. {m.latinName}
                    </span>
                    <span className="text-sm font-serif text-slate-400 dark:text-slate-500">
                      {m.arabicName}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    {m.theme}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
