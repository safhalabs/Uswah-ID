"use client";

import { useState, useEffect } from "react";
import { Heart, Calendar, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import confetti from "canvas-confetti";
import { getHijriDate, HijriDate } from "@/lib/hijriConverter";
import { FastingRule } from "@/data/fastingTypes";
import { getFastingLogs, logFasting, FastingLogEntry, getStoredPreferences } from "@/lib/storage";
import NiatModal from "./NiatModal";

export default function FastingCard() {
  const [todayHijri, setTodayHijri] = useState<HijriDate | null>(null);
  const [tomorrowHijri, setTomorrowHijri] = useState<HijriDate | null>(null);
  const [selectedRule, setSelectedRule] = useState<FastingRule | null>(null);
  const [fastingLogs, setFastingLogs] = useState<FastingLogEntry[]>([]);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const todayKey = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const prefs = getStoredPreferences();
    const today = getHijriDate(new Date(), prefs.hijriAdjustment);
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = getHijriDate(tomorrowDate, prefs.hijriAdjustment);

    setTodayHijri(today);
    setTomorrowHijri(tomorrow);

    const logs = getFastingLogs();
    setFastingLogs(logs);
    setHasLoggedToday(logs.some((l) => l.dateKey === todayKey));
  }, [todayKey]);

  if (!todayHijri || !tomorrowHijri) return null;

  const handleLogFast = (ruleId: string) => {
    const updated = logFasting({
      dateKey: todayKey,
      type: ruleId,
      notes: "Puasa dicatat di Uswah.id",
    });
    setFastingLogs(updated);
    setHasLoggedToday(true);

    // Celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Tentukan puasa yang relevan hari ini atau besok
  const activeFasting = todayHijri.fastings[0] || tomorrowHijri.fastings[0];
  const isTomorrow = !todayHijri.fastings.length && Boolean(tomorrowHijri.fastings.length);

  return (
    <>
      <div className="rounded-3xl bg-white dark:bg-[#0c1f18] p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
              <Heart className="w-5 h-5 fill-amber-500/20" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Jadwal & Pengingat Puasa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {todayHijri.formatted}
              </p>
            </div>
          </div>

          <a
            href="/puasa-sunnah"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
          >
            <span>Semua Puasa</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Status Hari Ini / Besok */}
        {todayHijri.isForbiddenToFast ? (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-1">
              Hari Diharamkan Berpuasa
            </p>
            <p className="text-sm text-rose-700 dark:text-rose-200">
              {todayHijri.forbiddenReason}
            </p>
          </div>
        ) : activeFasting ? (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-amber-50/50 dark:from-emerald-950/40 dark:to-amber-950/20 border border-emerald-200/60 dark:border-emerald-800/40 mb-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200">
                {isTomorrow ? "Besok Disunnahkan" : "Hari Ini Disunnahkan"}
              </span>
              <button
                onClick={() => setSelectedRule(activeFasting)}
                type="button"
                className="flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Lihat Niat & Dalil</span>
              </button>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {activeFasting.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
              {activeFasting.fadhilah}
            </p>

            {/* Tombol Catat Puasa Hari Ini */}
            {!isTomorrow && (
              <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
                {hasLoggedToday ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Alhamdulillah, Anda berpuasa hari ini</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleLogFast(activeFasting.id)}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tandai Saya Berpuasa Hari Ini</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 mb-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tidak ada jadwal puasa khusus hari ini.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Anda tetap dapat menunaikan puasa sunnah mutlak atau puasa qadha bila memiliki tanggungan.
            </p>
          </div>
        )}

        {/* Quick Fasting Statistics */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500">Puasa Dicatat</p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                {fastingLogs.length} Hari
              </p>
            </div>
          </div>

          <a
            href="/puasa-sunnah"
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
          >
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500">Kelola Qadha</p>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                Buka Tracker
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      <NiatModal rule={selectedRule} onClose={() => setSelectedRule(null)} />
    </>
  );
}
