"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import HijriCalendarView from "@/components/calendar/HijriCalendarView";
import CitySelectorModal from "@/components/prayer/CitySelectorModal";
import { CityLocation, DEFAULT_CITY } from "@/data/cities";
import { getStoredPreferences, saveStoredPreferences } from "@/lib/storage";
import { Calendar, Sparkles, Star } from "lucide-react";

export default function KalenderHijriahPage() {
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

  const majorEvents = [
    { name: "Tahun Baru Islam", hijri: "1 Muharram 1448 H", desc: "Awal tahun penanggalan Hijriah, anjuran memperbanyak amal shalih & puasa.", category: "Awal Tahun" },
    { name: "Hari Asyura & Tasu'a", hijri: "9 & 10 Muharram 1448 H", desc: "Puasa sunnah menghapus dosa setahun yang lalu.", category: "Puasa Sunnah" },
    { name: "Maulid Nabi Muhammad SAW", hijri: "12 Rabi'ul Awwal 1448 H", desc: "Mengenang hari kelahiran baginda Rasulullah SAW pembawa lentera rahmatan lil 'alamin.", category: "Peringatan" },
    { name: "Isra' Mi'raj", hijri: "27 Rajab 1448 H", desc: "Perjalanan agung Rasulullah SAW menerima perintah sholat 5 waktu secara langsung.", category: "Peringatan" },
    { name: "Malam Nisfu Sya'ban", hijri: "15 Sya'ban 1448 H", desc: "Malam ampunan luas dan persiapan menyambut bulan suci Ramadan.", category: "Keutamaan" },
    { name: "Awal Puasa Ramadan", hijri: "1 Ramadan 1448 H", desc: "Wajib berpuasa sebulan penuh, dibukanya pintu-pintu surga.", category: "Puasa Wajib" },
    { name: "Nuzulul Qur'an", hijri: "17 Ramadan 1448 H", desc: "Peringatan pertama kali diturunkannya ayat-ayat Al-Qur'an di Gua Hira.", category: "Peringatan" },
    { name: "Hari Raya Idul Fitri", hijri: "1 Syawal 1448 H", desc: "Hari kemenangan setelah sebulan berpuasa. Diharamkan berpuasa pada hari ini.", category: "Hari Raya" },
    { name: "Hari Arafah", hijri: "9 Dzulhijjah 1448 H", desc: "Puncak ibadah haji (wukuf) dan puasa sunnah penebus dosa 2 tahun bagi mukim.", category: "Puasa Sunnah" },
    { name: "Hari Raya Idul Adha", hijri: "10 Dzulhijjah 1448 H", desc: "Hari raya kurban (Nahar). Diharamkan berpuasa pada hari ini.", category: "Hari Raya" },
    { name: "Hari Tasyrik", hijri: "11, 12, 13 Dzulhijjah 1448 H", desc: "Hari-hari makan, minum, berdzikir, dan menyembelih kurban. Diharamkan puasa.", category: "Larangan Puasa" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        currentCity={currentCity}
        onOpenCitySelector={() => setIsCityModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>Kalender Hijriah & Hari-Hari Sunnah</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Penanggalan Islam berbasis peredaran bulan (Qamariyah) dilengkapi penanda puasa dan peristiwa penting
          </p>
        </div>

        {/* Kalender Bulanan Interaktif */}
        <section>
          <HijriCalendarView currentCity={currentCity} />
        </section>

        {/* Daftar Hari Besar & Momentum Penting Islam */}
        <section className="rounded-3xl bg-white dark:bg-[#0c1f18] p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-emerald-950/80">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Hari-Hari Besar & Momentum Penting Sepanjang Tahun
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peringatan peristiwa bersejarah dan ibadah khusus dalam kalender Islam
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {majorEvents.map((evt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                      {evt.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {evt.hijri}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                    {evt.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {evt.desc}
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
