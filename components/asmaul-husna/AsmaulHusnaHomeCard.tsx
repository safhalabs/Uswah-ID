"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ASMAUL_HUSNA, AsmaulHusnaItem } from "@/data/asmaulHusnaData";
import {
  getMemorizedAsmaulHusna,
  toggleMemorizedAsmaulHusna,
} from "@/lib/storage";
import {
  Sparkles,
  Award,
  ArrowRight,
  CheckCircle2,
  Volume2,
  BookOpen,
} from "lucide-react";

export default function AsmaulHusnaHomeCard() {
  const [memorizedList, setMemorizedList] = useState<number[]>([]);
  const [dailyItem, setDailyItem] = useState<AsmaulHusnaItem>(ASMAUL_HUSNA[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setMemorizedList(getMemorizedAsmaulHusna());

    // Deterministic daily selection based on Day of Year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % ASMAUL_HUSNA.length;
    setDailyItem(ASMAUL_HUSNA[index]);
  }, []);

  const isMemorized = memorizedList.includes(dailyItem.number);
  const memorizedPercent = Math.round((memorizedList.length / 99) * 100);

  const handleToggleDaily = (e: React.MouseEvent) => {
    e.preventDefault();
    const updated = toggleMemorizedAsmaulHusna(dailyItem.number);
    setMemorizedList([...updated]);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);

    const utterance = new SpeechSynthesisUtterance(dailyItem.arabic);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 dark:from-[#06150e] dark:via-[#04110b] dark:to-[#030d08] p-5 sm:p-6 border border-emerald-900/10 dark:border-emerald-500/25 shadow-sm flex flex-col justify-between transition-all">
      <div>
        {/* Header Badges & Progress */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Asmaul Husna Hari Ini</span>
          </div>

          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {memorizedList.length}/99 ({memorizedPercent}%)
            </span>
          </div>
        </div>

        {/* Daily Focus Card Content */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden mb-4">
          {/* Subtle Rub el Hizb watermark */}
          <div className="absolute right-0 top-0 -mr-6 -mt-6 w-32 h-32 pointer-events-none opacity-[0.05] dark:opacity-[0.08]">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none text-emerald-500">
              <rect x="25" y="25" width="50" height="50" rx="3" strokeWidth="2" />
              <rect x="25" y="25" width="50" height="50" rx="3" strokeWidth="2" transform="rotate(45 50 50)" />
            </svg>
          </div>

          <div className="flex items-start justify-between gap-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold">
              #{String(dailyItem.number).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={handleSpeak}
                type="button"
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isPlayingAudio
                    ? "bg-amber-400 text-slate-950 border-amber-300 scale-95"
                    : "bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10"
                }`}
                title="Dengarkan pelafalan Arab"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleToggleDaily}
                type="button"
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isMemorized
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                    : "bg-slate-50 hover:bg-emerald-50 dark:bg-white/5 dark:hover:bg-emerald-950/50 text-slate-400 hover:text-emerald-600 border-slate-200 dark:border-white/10"
                }`}
                title={isMemorized ? "Tandai belum hafal" : "Tandai sudah hafal"}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isMemorized ? "fill-white text-emerald-600" : ""}`} />
              </button>
            </div>
          </div>

          <div className="text-center py-2">
            <p className="font-arabic text-3xl sm:text-4xl text-emerald-800 dark:text-emerald-200 drop-shadow-sm">
              {dailyItem.arabic}
            </p>
            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
              {dailyItem.latin}
            </h4>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {dailyItem.translation}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1 line-clamp-2">
              {dailyItem.meaning}
            </p>
          </div>
        </div>

        {/* Mini Progress Bar */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Target 99 Nama Surga</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">{memorizedList.length} / 99 Telah Dihafal</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-black/40 overflow-hidden border border-slate-200/50 dark:border-emerald-900/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-amber-400 transition-all duration-300"
              style={{ width: `${memorizedPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Button link to full Asmaul Husna page */}
      <Link
        href="/asmaul-husna"
        className="flex items-center justify-between p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all group"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-100" />
          <span>Buka 99 Nama &amp; Mode Hafalan</span>
        </div>
        <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
