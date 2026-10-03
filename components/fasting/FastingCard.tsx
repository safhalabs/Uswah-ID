"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Calendar, CheckCircle2, ChevronRight, BookOpen, Sparkles } from "lucide-react";
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

  const activeFasting = todayHijri.fastings[0] || tomorrowHijri.fastings[0];
  const isTomorrow = !todayHijri.fastings.length && Boolean(tomorrowHijri.fastings.length);

  return (
    <>
      <div className="rounded-3xl bg-white dark:bg-[#0a1a14] p-5 sm:p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/15 flex flex-col justify-between h-full transition-all">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4 pb-3.5 border-b border-slate-100 dark:border-emerald-950/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/15 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20 shadow-xs">
                <Heart className="w-4 h-4 fill-amber-500/30 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base tracking-tight">
                  Jadwal &amp; Pengingat Puasa
                </h3>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span>{todayHijri.formatted}</span>
                </p>
              </div>
            </div>

            <Link
              href="/puasa-sunnah"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 group transition-all"
            >
              <span>Katalog</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Status Box */}
          {todayHijri.isForbiddenToFast ? (
            <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-1">
                Hari Diharamkan Berpuasa
              </p>
              <p className="text-xs text-rose-700 dark:text-rose-200 font-medium leading-relaxed">
                {todayHijri.forbiddenReason}
              </p>
            </div>
          ) : activeFasting ? (
            <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-emerald-100/30 to-amber-50/50 dark:from-emerald-950/40 dark:via-[#082218] dark:to-amber-950/20 border border-emerald-200/70 dark:border-emerald-800/50 mb-4 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-200/90 text-emerald-950 dark:bg-emerald-900/80 dark:text-emerald-200 shadow-xs">
                  {isTomorrow ? "Besok Disunnahkan" : "Hari Ini Disunnahkan"}
                </span>

                <button
                  onClick={() => setSelectedRule(activeFasting)}
                  type="button"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 px-2 py-0.5 rounded-lg hover:bg-emerald-200/40 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  <BookOpen className="w-3 h-3 text-amber-500" />
                  <span>Niat &amp; Dalil</span>
                </button>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {activeFasting.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                  {activeFasting.fadhilah}
                </p>
              </div>

              {/* Action Log Button */}
              {!isTomorrow && (
                <div className="pt-2.5 border-t border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-between">
                  {hasLoggedToday ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Alhamdulillah, Anda berpuasa hari ini</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleLogFast(activeFasting.id)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tandai Saya Berpuasa Hari Ini</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 mb-4">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Tidak ada agenda puasa khusus hari ini.
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Tetap dapat menunaikan puasa sunnah mutlak atau puasa qadha bila memiliki tanggungan.
              </p>
            </div>
          )}
        </div>

        {/* Quick Fasting Statistics */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Puasa Dicatat</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {fastingLogs.length} Hari
              </p>
            </div>
          </div>

          <Link
            href="/puasa-sunnah"
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between group hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30"
          >
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Hutang Puasa</p>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                Kelola Qadha
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-emerald-600 transition-all" />
          </Link>
        </div>
      </div>

      <NiatModal rule={selectedRule} onClose={() => setSelectedRule(null)} />
    </>
  );
}
