"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import PrayerTimesCard from "@/components/prayer/PrayerTimesCard";
import TahajudDhuhaCard from "@/components/sunnah/TahajudDhuhaCard";
import CitySelectorModal from "@/components/prayer/CitySelectorModal";
import { CityLocation, DEFAULT_CITY } from "@/data/cities";
import { getStoredPreferences, saveStoredPreferences } from "@/lib/storage";
import { getMonthlyPrayerTimes, DayPrayerSchedule } from "@/lib/prayerCalculations";
import { Printer, ChevronLeft, ChevronRight, Volume2, ShieldCheck, Sun } from "lucide-react";
import { soundEngine } from "@/lib/audioAlert";

export default function JadwalSholatPage() {
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_CITY);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [monthlySchedule, setMonthlySchedule] = useState<DayPrayerSchedule[]>([]);
  const [audioTone, setAudioTone] = useState<"gentle_chime" | "adzan_makkah">("gentle_chime");
  const [audioVolume, setAudioVolume] = useState<number>(0.8);
  const [layoutMode, setLayoutMode] = useState<"auto" | "desktop" | "portrait" | "mobile">("auto");
  const [isHardwarePortrait, setIsHardwarePortrait] = useState(false);

  useEffect(() => {
    const prefs = getStoredPreferences();
    if (prefs.city) setCurrentCity(prefs.city);
    if (prefs.layoutMode) setLayoutMode(prefs.layoutMode);
    setAudioTone(prefs.audioTone === "gentle_chime" ? "gentle_chime" : "adzan_makkah");
    setAudioVolume(prefs.audioVolume);

    if (typeof window !== "undefined") {
      const media = window.matchMedia("(orientation: portrait) and (min-width: 768px)");
      setIsHardwarePortrait(media.matches);

      const handler = (e: MediaQueryListEvent) => setIsHardwarePortrait(e.matches);
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, []);

  useEffect(() => {
    setMonthlySchedule(getMonthlyPrayerTimes(currentCity, selectedYear, selectedMonth));
  }, [currentCity, selectedYear, selectedMonth]);

  const handleSelectCity = (city: CityLocation) => {
    setCurrentCity(city);
    saveStoredPreferences({ city });
  };

  const handleToneChange = (tone: "gentle_chime" | "adzan_makkah") => {
    setAudioTone(tone);
    saveStoredPreferences({ audioTone: tone });
    if (tone === "gentle_chime") soundEngine.playGentleChime(audioVolume);
    else soundEngine.playTakbirBeep(audioVolume);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

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
        className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 transition-all ${
          isMobileEffective
            ? "max-w-md"
            : isPortraitEffective
            ? "max-w-4xl portrait-monitor-container"
            : "max-w-7xl"
        }`}
      >
        <section>
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Jadwal Sholat {currentCity.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Perhitungan presisi astronomis standar Kemenag RI (+2 menit ihtiyat)
            </p>
          </div>

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

        {/* Pengaturan Audio Pengingat */}
        <section className="rounded-3xl bg-white dark:bg-[#0c1f18] p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Pengaturan Pengingat & Suara
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih jenis nada saat waktu sholat tiba di browser
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleToneChange("gentle_chime")}
              type="button"
              className={`p-4 rounded-2xl border text-left transition-all ${
                audioTone === "gentle_chime"
                  ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30"
                  : "border-slate-200 dark:border-slate-800 hover:border-emerald-300"
              }`}
            >
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Lonceng Santun (Gentle Chime)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Nada harmonik E-Mayor menenangkan yang tidak mengagetkan saat berada di kantor atau belajar.
              </p>
            </button>

            <button
              onClick={() => handleToneChange("adzan_makkah")}
              type="button"
              className={`p-4 rounded-2xl border text-left transition-all ${
                audioTone === "adzan_makkah"
                  ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30"
                  : "border-slate-200 dark:border-slate-800 hover:border-emerald-300"
              }`}
            >
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Nada Takbir
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Bunyi takbir singkat 3 ketukan sebagai pengingat tegas masuknya waktu sholat fardhu.
              </p>
            </button>
          </div>
        </section>

        {/* Tabel Jadwal Sholat 1 Bulan Penuh */}
        <section className="rounded-3xl bg-white dark:bg-[#0c1f18] p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-emerald-950/80">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Tabel Waktu Sholat {monthNames[selectedMonth]} {selectedYear}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Wilayah: {currentCity.name}, {currentCity.province} ({currentCity.timezone})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else setSelectedMonth(selectedMonth - 1);
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold px-2">
                  {monthNames[selectedMonth]} {selectedYear}
                </span>
                <button
                  onClick={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else setSelectedMonth(selectedMonth + 1);
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-emerald-950 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">Tanggal</th>
                  <th className="py-2.5 px-3 font-semibold">Imsak</th>
                  <th className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">Subuh</th>
                  <th className="py-2.5 px-3 font-semibold">Terbit</th>
                  <th className="py-2.5 px-3 font-semibold">Dhuha</th>
                  <th className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">Dzuhur</th>
                  <th className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">Ashar</th>
                  <th className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">Maghrib</th>
                  <th className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">Isya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/40">
                {monthlySchedule.map((day, idx) => {
                  const isToday =
                    new Date().getDate() === idx + 1 &&
                    new Date().getMonth() === selectedMonth &&
                    new Date().getFullYear() === selectedYear;

                  const getTime = (id: string) => day.items.find((i) => i.id === id)?.timeString || "--:--";

                  return (
                    <tr
                      key={idx}
                      className={
                        isToday
                          ? "bg-emerald-50 dark:bg-emerald-950/40 font-semibold text-emerald-950 dark:text-emerald-100"
                          : "hover:bg-slate-50 dark:hover:bg-emerald-950/20 text-slate-700 dark:text-slate-300"
                      }
                    >
                      <td className="py-2.5 px-3 flex items-center gap-1.5">
                        <span>{idx + 1}</span>
                        {isToday && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">
                            Hari ini
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono">{getTime("imsak")}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                        {getTime("fajr")}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{getTime("sunrise")}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{getTime("dhuha")}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                        {getTime("dhuhr")}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                        {getTime("asr")}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                        {getTime("maghrib")}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                        {getTime("isha")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
