"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import CitySelectorModal from "@/components/prayer/CitySelectorModal";
import NiatModal from "@/components/fasting/NiatModal";
import { CityLocation, DEFAULT_CITY } from "@/data/cities";
import { FASTING_CATALOG, FastingRule } from "@/data/fastingTypes";
import {
  getStoredPreferences,
  saveStoredPreferences,
  getFastingLogs,
  logFasting,
  removeFastingLog,
  FastingLogEntry,
} from "@/lib/storage";
import {
  Heart,
  BookOpen,
  Calendar,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  AlertOctagon,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function PuasaSunnahPage() {
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_CITY);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeNiatRule, setActiveNiatRule] = useState<FastingRule | null>(null);

  // Fasting Logs & Qadha
  const [fastingLogs, setFastingLogs] = useState<FastingLogEntry[]>([]);
  const [qadhaTarget, setQadhaTarget] = useState<number>(0);
  const [qadhaCompleted, setQadhaCompleted] = useState<number>(0);

  useEffect(() => {
    const prefs = getStoredPreferences();
    if (prefs.city) setCurrentCity(prefs.city);
    setQadhaTarget(prefs.qadhaTarget || 0);
    setQadhaCompleted(prefs.qadhaCompleted || 0);
    setFastingLogs(getFastingLogs());
  }, []);

  const handleSelectCity = (city: CityLocation) => {
    setCurrentCity(city);
    saveStoredPreferences({ city });
  };

  const handleTargetChange = (delta: number) => {
    const newVal = Math.max(0, qadhaTarget + delta);
    setQadhaTarget(newVal);
    saveStoredPreferences({ qadhaTarget: newVal });
  };

  const handleCompletedChange = (delta: number) => {
    const newVal = Math.max(0, Math.min(qadhaTarget, qadhaCompleted + delta));
    setQadhaCompleted(newVal);
    saveStoredPreferences({ qadhaCompleted: newVal });

    if (delta > 0) {
      logFasting({
        dateKey: new Date().toISOString().split("T")[0],
        type: "qadha",
        notes: "Membayar 1 hari hutang puasa Ramadan",
      });
      setFastingLogs(getFastingLogs());
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteLog = (id: string) => {
    const updated = removeFastingLog(id);
    setFastingLogs(updated);
  };

  const catalogList = Object.values(FASTING_CATALOG);

  const filteredCatalog = catalogList.filter((item) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "weekly") return item.frequency === "weekly";
    if (selectedCategory === "monthly") return item.frequency === "monthly";
    if (selectedCategory === "annual") return item.frequency === "annual" && item.category !== "haram";
    if (selectedCategory === "wajib") return item.category === "wajib";
    if (selectedCategory === "haram") return item.category === "haram";
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        currentCity={currentCity}
        onOpenCitySelector={() => setIsCityModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-emerald-600 dark:text-emerald-400 fill-emerald-600/20" />
            <span>Kumpulan Puasa Sunnah & Wajib</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Panduan lengkap lafadz niat, fadhilah keutamaan berdasar hadits, dan tracker qadha puasa
          </p>
        </div>

        {/* Tracker Qadha Ramadan */}
        <section className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/20 border border-emerald-700/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Pengingat Kewajiban</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Tracker Hutang Puasa (Qadha Ramadan)
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl mt-1 leading-relaxed">
                Catat dan cicil tanggungan puasa Ramadan Anda sebelum Ramadan berikutnya tiba.
                Data tersimpan otomatis di perangkat Anda.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 bg-black/25 p-4 rounded-2xl border border-white/10">
              {/* Target Qadha */}
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                  Target Hutang
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTargetChange(-1)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-2xl font-mono font-bold w-10 text-center">
                    {qadhaTarget}
                  </span>
                  <button
                    onClick={() => handleTargetChange(1)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Terlunasi */}
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  Sudah Terlunasi
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCompletedChange(-1)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-2xl font-mono font-bold text-amber-300 w-10 text-center">
                    {qadhaCompleted}
                  </span>
                  <button
                    onClick={() => handleCompletedChange(1)}
                    className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-slate-950 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sisa */}
              <div className="text-center pl-2 border-l border-white/10">
                <p className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold mb-1">
                  Sisa Hutang
                </p>
                <span className="text-2xl font-mono font-extrabold text-white">
                  {Math.max(0, qadhaTarget - qadhaCompleted)} Hari
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tab Kategori Puasa */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "Semua Katalog" },
              { id: "weekly", label: "Mingguan (Senin-Kamis)" },
              { id: "monthly", label: "Bulanan (Ayyamul Bidh)" },
              { id: "annual", label: "Musiman (Arafah, Syawal, dll)" },
              { id: "wajib", label: "Puasa Wajib & Qadha" },
              { id: "haram", label: "Hari Dilarang Puasa" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-white dark:bg-[#0c1f18] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-emerald-950 hover:border-emerald-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid Katalog Puasa */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCatalog.map((rule) => {
              const isHaram = rule.category === "haram";

              return (
                <div
                  key={rule.id}
                  className={`rounded-3xl p-5 border flex flex-col justify-between transition-all ${
                    isHaram
                      ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40"
                      : "bg-white dark:bg-[#0c1f18] border-emerald-900/10 dark:border-emerald-500/20 shadow-sm hover:border-emerald-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isHaram
                            ? "bg-rose-200 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                        }`}
                      >
                        {isHaram ? "Haram Berpuasa" : rule.frequency}
                      </span>

                      {isHaram && <AlertOctagon className="w-4 h-4 text-rose-600" />}
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
                      {rule.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {rule.fadhilah}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {rule.category.replace("_", " ")}
                    </span>

                    <button
                      onClick={() => setActiveNiatRule(rule)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isHaram ? "Lihat Dalil" : "Niat & Dalil"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Riwayat Puasa yang Dicatat */}
        <section className="rounded-3xl bg-white dark:bg-[#0c1f18] p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-emerald-950/80">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Riwayat Puasa yang Pernah Dicatat ({fastingLogs.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Catatan ibadah puasa Anda di Uswah.id
                </p>
              </div>
            </div>
          </div>

          {fastingLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Belum ada riwayat puasa yang dicatat. Anda dapat mencatat puasa melalui tombol &quot;Tandai Saya Berpuasa Hari Ini&quot; di Beranda.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-60 overflow-y-auto">
              {fastingLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {log.type.toUpperCase()}
                      </span>
                      <span className="text-slate-400 ml-2">({log.dateKey})</span>
                      {log.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{log.notes}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Hapus riwayat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
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

      <NiatModal
        rule={activeNiatRule}
        onClose={() => setActiveNiatRule(null)}
      />
    </div>
  );
}
