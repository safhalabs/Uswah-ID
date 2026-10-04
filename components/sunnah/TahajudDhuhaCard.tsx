"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Sunrise,
  ShieldCheck,
  ChevronRight,
  Flame,
  Info,
  Calendar,
  Volume2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CityLocation } from "@/data/cities";
import {
  calculateDhuhaSchedule,
  calculateTahajudSchedule,
  calculateWaktuTahrim,
  DhuhaScheduleInfo,
  TahajudScheduleInfo,
  WaktuTahrimInfo,
} from "@/lib/sunnahCalculations";
import { calculatePrayerTimes, DayPrayerSchedule } from "@/lib/prayerCalculations";
import { getDayAmalan, toggleDayAmalan } from "@/lib/storage";
import { soundEngine } from "@/lib/audioAlert";

interface TahajudDhuhaCardProps {
  city: CityLocation;
  isPortraitMode?: boolean;
}

export default function TahajudDhuhaCard({
  city,
  isPortraitMode = false,
}: TahajudDhuhaCardProps) {
  const [dhuha, setDhuha] = useState<DhuhaScheduleInfo | null>(null);
  const [tahajud, setTahajud] = useState<TahajudScheduleInfo | null>(null);
  const [waktuTahrim, setWaktuTahrim] = useState<WaktuTahrimInfo | null>(null);
  const [activeTabMobile, setActiveTabMobile] = useState<"dhuha" | "tahajud">("dhuha");
  const [hasPrayedDhuha, setHasPrayedDhuha] = useState(false);
  const [hasPrayedTahajud, setHasPrayedTahajud] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");

  const todayKey = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const sched = calculatePrayerTimes(city, now);
      setDhuha(calculateDhuhaSchedule(city, now, sched));
      setTahajud(calculateTahajudSchedule(city, now, sched));
      setWaktuTahrim(calculateWaktuTahrim(city, now, sched));
      setCurrentTimeStr(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      const amalan = getDayAmalan(todayKey);
      setHasPrayedDhuha(amalan.includes("dhuha"));
      setHasPrayedTahajud(amalan.includes("witir") || amalan.includes("tahajud"));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [city, todayKey]);

  if (!dhuha || !tahajud) return null;

  const handleToggleDhuha = () => {
    const next = toggleDayAmalan(todayKey, "dhuha");
    const isNow = next.includes("dhuha");
    setHasPrayedDhuha(isNow);

    if (isNow) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
        soundEngine.playGentleChime(0.4);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleToggleTahajud = () => {
    const next = toggleDayAmalan(todayKey, "witir");
    const isNow = next.includes("witir");
    setHasPrayedTahajud(isNow);

    if (isNow) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
        soundEngine.playGentleChime(0.4);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Tab Switcher (Hanya tampil di Mobile dan bukan di mode Portrait Monitor) */}
      <div className="flex sm:hidden items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200/60 dark:border-emerald-950/60 text-xs font-bold">
        <button
          onClick={() => setActiveTabMobile("dhuha")}
          type="button"
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
            activeTabMobile === "dhuha"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Sholat Dhuha</span>
          {dhuha.isUrgent && !hasPrayedDhuha && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTabMobile("tahajud")}
          type="button"
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
            activeTabMobile === "tahajud"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Sholat Tahajud</span>
          {tahajud.isUrgent && !hasPrayedTahajud && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>
      </div>

      {/* Grid Utama (Responsive: 1 kolom di mobile, 2 kolom di desktop, atau stacked di portrait monitor) */}
      <div
        className={`grid gap-5 ${
          isPortraitMode
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {/* ========================================================= */}
        {/* CARD 1: REKOMENDASI WAKTU SHOLAT DHUHA */}
        {/* ========================================================= */}
        <div
          className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 transition-all border ${
            dhuha.isUrgent && !hasPrayedDhuha
              ? "bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-transparent border-rose-500/50 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/20 animate-pulse-gentle"
              : "bg-white dark:bg-[#091b14] border-emerald-900/10 dark:border-emerald-500/20 shadow-sm"
          } ${activeTabMobile !== "dhuha" && !isPortraitMode ? "hidden sm:flex flex-col" : "flex flex-col"}`}
        >
          {/* Subtle Ambient Decorative Sun Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

          {/* Card Header */}
          <div className="relative z-10 flex items-start justify-between gap-3 mb-4 pb-3.5 border-b border-slate-100 dark:border-emerald-950/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/15 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/25 shadow-xs">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight">
                    Sholat Dhuha
                  </h3>
                  <span className="font-arabic text-sm text-amber-600 dark:text-amber-400 font-bold">
                    صلاة الضحى
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {dhuha.syuruqGapText}
                </p>
              </div>
            </div>

            {/* Live Status Badge */}
            <div className="shrink-0">
              {dhuha.isActive ? (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                    dhuha.isUrgent
                      ? "bg-rose-500 text-white animate-bounce shadow-md shadow-rose-500/30"
                      : "bg-amber-400/25 text-amber-800 dark:text-amber-300 border border-amber-400/40"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  {dhuha.isUrgent ? "Waktu Mepet!" : "Sedang Berlangsung"}
                </span>
              ) : dhuha.isPassed ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800">
                  Telah Berakhir
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Clock className="w-3 h-3" />
                  Mulai {dhuha.startTimeString}
                </span>
              )}
            </div>
          </div>

          {/* Fiqih Notice: Waktu Tahrim (Terbit Matahari / Istiwa') */}
          {waktuTahrim?.isTahrim && (waktuTahrim.type === "syuruq" || waktuTahrim.type === "istiwa") && (
            <div className="relative z-10 mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Perhatian Fiqih: {waktuTahrim.title} ({waktuTahrim.timeRange})</span>
                <p className="text-[11px] text-rose-800 dark:text-rose-300 mt-0.5 leading-snug">
                  {waktuTahrim.description} (<em>{waktuTahrim.dalil}</em>)
                </p>
              </div>
            </div>
          )}

          {/* URGENT WARNING BANNER (Jika belum sholat dan waktu tinggal sedikit!) */}
          {dhuha.isUrgent && !hasPrayedDhuha && (
            <div className="relative z-10 mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/20 via-amber-500/15 to-rose-500/20 border-2 border-rose-500/60 shadow-md flex items-start gap-3 animate-pulse">
              <div className="p-1.5 rounded-xl bg-rose-500 text-white shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-extrabold text-rose-800 dark:text-rose-200">
                  PERINGATAN: Waktu Dhuha Segera Berakhir!
                </p>
                <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-snug mt-0.5">
                  Tersisa <strong>{dhuha.minutesRemaining} menit lagi</strong> sebelum masuk waktu Istiwa (matahari di tengah langit, waktu dilarang sholat). Segera tunaikan Sholat Dhuha minimal 2 rakaat!
                </p>
              </div>
            </div>
          )}

          {/* Waktu Keseluruhan Dhuha */}
          <div className="relative z-10 mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-emerald-950/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Rentang Waktu Dhuha</p>
                <p className="text-sm font-mono font-black text-slate-800 dark:text-slate-100">
                  {dhuha.startTimeString} — {dhuha.endTimeString} <span className="text-[10px] font-normal text-slate-400">({city.timezone})</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Batas Waktu</p>
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                15m sblm Dzuhur
              </p>
            </div>
          </div>

          {/* 3 Rekomendasi Fase Waktu Dhuha */}
          <div className="relative z-10 space-y-2.5 flex-1 mb-5">
            <p className="text-[11px] uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>3 Pembagian Waktu &amp; Keutamaan</span>
            </p>

            {/* Fase 1: Isyraq */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                dhuha.currentPhase === "isyraq"
                  ? "bg-amber-500/10 border-amber-400 dark:border-amber-500/50 shadow-xs ring-1 ring-amber-400/20"
                  : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>1. Waktu Awal (Sholat Isyraq)</span>
                  {dhuha.currentPhase === "isyraq" && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-bold uppercase">
                      Saat Ini
                    </span>
                  )}
                </span>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  {dhuha.phases.isyraq.timeRange}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {dhuha.phases.isyraq.keutamaan}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-0.5">
                {dhuha.phases.isyraq.dalil}
              </p>
            </div>

            {/* Fase 2: Pertengahan */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                dhuha.currentPhase === "pertengahan"
                  ? "bg-amber-500/10 border-amber-400 dark:border-amber-500/50 shadow-xs ring-1 ring-amber-400/20"
                  : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>2. Waktu Pertengahan (Produktif)</span>
                  {dhuha.currentPhase === "pertengahan" && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-bold uppercase">
                      Saat Ini
                    </span>
                  )}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {dhuha.phases.pertengahan.timeRange}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {dhuha.phases.pertengahan.keutamaan}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-0.5">
                {dhuha.phases.pertengahan.dalil}
              </p>
            </div>

            {/* Fase 3: Shalatul Awwabin (Waktu Paling Utama) */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                dhuha.currentPhase === "awwabin" || dhuha.currentPhase === "urgent"
                  ? "bg-gradient-to-r from-amber-500/15 to-emerald-500/10 border-amber-500 dark:border-amber-400 shadow-xs ring-2 ring-amber-400/30"
                  : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>3. Waktu Paling Utama (Shalatul Awwabin)</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold uppercase">
                    Afzal
                  </span>
                </span>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  {dhuha.phases.awwabin.timeRange}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {dhuha.phases.awwabin.keutamaan}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-0.5">
                {dhuha.phases.awwabin.dalil}
              </p>
            </div>
          </div>

          {/* Action Checklist Button */}
          <div className="relative z-10 pt-3 border-t border-slate-100 dark:border-emerald-950/70 flex items-center justify-between gap-3">
            {hasPrayedDhuha ? (
              <button
                onClick={handleToggleDhuha}
                type="button"
                className="w-full py-2.5 px-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-200/50 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Alhamdulillah, Sudah Sholat Dhuha Hari Ini</span>
              </button>
            ) : (
              <button
                onClick={handleToggleDhuha}
                type="button"
                className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  dhuha.isUrgent
                    ? "bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white shadow-rose-500/20"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {dhuha.isUrgent
                    ? "Tandai Sudah Sholat Sekarang"
                    : "Tandai Saya Sudah Sholat Dhuha"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 2: REKOMENDASI WAKTU SHOLAT TAHAJUD */}
        {/* ========================================================= */}
        <div
          className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 transition-all border ${
            tahajud.isUrgent && !hasPrayedTahajud
              ? "bg-gradient-to-br from-indigo-500/10 via-rose-500/5 to-transparent border-rose-500/50 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/20 animate-pulse-gentle"
              : "bg-white dark:bg-[#091b14] border-emerald-900/10 dark:border-emerald-500/20 shadow-sm"
          } ${activeTabMobile !== "tahajud" && !isPortraitMode ? "hidden sm:flex flex-col" : "flex flex-col"}`}
        >
          {/* Subtle Ambient Decorative Moon Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

          {/* Card Header */}
          <div className="relative z-10 flex items-start justify-between gap-3 mb-4 pb-3.5 border-b border-slate-100 dark:border-emerald-950/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-600/15 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/25 shadow-xs">
                <Moon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight">
                    Sholat Tahajud &amp; Witir
                  </h3>
                  <span className="font-arabic text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                    صلاة التهجد
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Qiyamul Lail (Setelah Isya &amp; Tidur s/d Subuh)
                </p>
              </div>
            </div>

            {/* Live Status Badge */}
            <div className="shrink-0">
              {tahajud.isUrgent ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-500 text-white animate-bounce shadow-md shadow-rose-500/30">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Mendekati Subuh!
                </span>
              ) : tahajud.isLastThird ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r from-amber-400/30 to-emerald-400/30 text-amber-900 dark:text-amber-200 border border-amber-400/50">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Waktu Mustajab!
                </span>
              ) : tahajud.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Malam Berjalan
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800">
                  Malam Nanti
                </span>
              )}
            </div>
          </div>

          {/* URGENT WARNING BANNER (Jika belum sholat dan waktu menuju Subuh tinggal sedikit!) */}
          {tahajud.isUrgent && !hasPrayedTahajud && (
            <div className="relative z-10 mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/20 via-indigo-500/15 to-rose-500/20 border-2 border-rose-500/60 shadow-md flex items-start gap-3 animate-pulse">
              <div className="p-1.5 rounded-xl bg-rose-500 text-white shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-extrabold text-rose-800 dark:text-rose-200">
                  PERINGATAN: Adzan Subuh Sebentar Lagi!
                </p>
                <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-snug mt-0.5">
                  Waktu sepertiga malam tersisa <strong>{tahajud.minutesRemaining} menit lagi</strong> menuju adzan Subuh. Segera tunaikan Tahajud dan tutup qiyamul lail Anda dengan sholat Witir ganjil!
                </p>
              </div>
            </div>
          )}

          {/* Waktu Keseluruhan Tahajud */}
          <div className="relative z-10 mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-emerald-950/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Rentang Qiyamul Lail</p>
                <p className="text-sm font-mono font-black text-slate-800 dark:text-slate-100">
                  Setelah Isya s/d Menjelang Subuh
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Status Waktu</p>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {tahajud.phaseLabel}
              </p>
            </div>
          </div>

          {/* 3 Pembagian Sepertiga Malam */}
          <div className="relative z-10 space-y-2.5 flex-1 mb-5">
            <p className="text-[11px] uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>3 Pembagian Sepertiga Malam</span>
            </p>

            {/* Fase 1: Sepertiga Awal */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                tahajud.currentPhase === "sepertiga_awal"
                  ? "bg-emerald-500/10 border-emerald-400 dark:border-emerald-500/50 shadow-xs ring-1 ring-emerald-400/20"
                  : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>1. Sepertiga Awal Malam</span>
                  {tahajud.currentPhase === "sepertiga_awal" && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-bold uppercase">
                      Saat Ini
                    </span>
                  )}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  {tahajud.phases.firstThird.timeRange}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {tahajud.phases.firstThird.keutamaan}
              </p>
            </div>

            {/* Fase 2: Sepertiga Pertengahan */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                tahajud.currentPhase === "sepertiga_kedua"
                  ? "bg-emerald-500/10 border-emerald-400 dark:border-emerald-500/50 shadow-xs ring-1 ring-emerald-400/20"
                  : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>2. Sepertiga Kedua (Tengah Malam)</span>
                  {tahajud.currentPhase === "sepertiga_kedua" && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-bold uppercase">
                      Saat Ini
                    </span>
                  )}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {tahajud.phases.secondThird.timeRange}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {tahajud.phases.secondThird.keutamaan}
              </p>
            </div>

            {/* Fase 3: Sepertiga Terakhir (Paling Utama / Waktu Turunnya Rahmat) */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                tahajud.currentPhase === "sepertiga_akhir" || tahajud.currentPhase === "urgent"
                  ? "bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-indigo-500/10 border-amber-400 dark:border-amber-400 shadow-md ring-2 ring-amber-400/30"
                  : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>3. Sepertiga Terakhir (Paling Utama)</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-bold uppercase">
                    Mustajab
                  </span>
                </span>
                <span className="font-mono text-xs font-bold text-amber-500 dark:text-amber-300">
                  {tahajud.phases.lastThird.timeRange}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {tahajud.phases.lastThird.keutamaan}
              </p>
              <p className="text-[10px] text-amber-600/90 dark:text-amber-300/80 italic mt-0.5 font-medium">
                {tahajud.phases.lastThird.dalil}
              </p>
            </div>
          </div>

          {/* Action Checklist Button */}
          <div className="relative z-10 pt-3 border-t border-slate-100 dark:border-emerald-950/70 flex items-center justify-between gap-3">
            {hasPrayedTahajud ? (
              <button
                onClick={handleToggleTahajud}
                type="button"
                className="w-full py-2.5 px-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-200/50 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Alhamdulillah, Sudah Sholat Tahajud / Witir</span>
              </button>
            ) : (
              <button
                onClick={handleToggleTahajud}
                type="button"
                className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  tahajud.isUrgent
                    ? "bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white shadow-rose-500/20"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {tahajud.isUrgent
                    ? "Tandai Sudah Tahajud / Witir"
                    : "Tandai Saya Sudah Sholat Tahajud / Witir"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
