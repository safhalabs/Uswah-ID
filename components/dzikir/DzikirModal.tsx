"use client";

import { useState, useEffect } from "react";
import { DZIKIR_BADA_SHOLAT, DzikirItem } from "@/data/dzikirData";
import {
  X,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Volume2,
  BookOpen,
  Award,
} from "lucide-react";
import { soundEngine } from "@/lib/audioAlert";

interface DzikirModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DzikirModal({ isOpen, onClose }: DzikirModalProps) {
  const [activeTab, setActiveTab] = useState<"tasbih" | "list">("tasbih");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if (e.code === "Space" && isOpen && activeTab === "tasbih") {
        e.preventDefault();
        handleIncrement();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!isOpen) return null;

  const currentDzikir = DZIKIR_BADA_SHOLAT[currentIdx];
  const currentCount = counts[currentDzikir.id] || 0;
  const isCompleted = currentCount >= currentDzikir.targetCount;
  const progressPercent = Math.min(
    100,
    Math.round((currentCount / currentDzikir.targetCount) * 100)
  );

  const handleIncrement = () => {
    const newCount = currentCount + 1;
    setCounts((prev) => ({ ...prev, [currentDzikir.id]: newCount }));

    // Haptic vibration feedback on supported mobile devices
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(40);
    }

    // Play subtle soft chime when target reached
    if (newCount === currentDzikir.targetCount) {
      soundEngine.playGentleChime(0.4);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([60, 50, 60]);
      }
    }
  };

  const handleResetCurrent = () => {
    setCounts((prev) => ({ ...prev, [currentDzikir.id]: 0 }));
  };

  const handleResetAll = () => {
    if (confirm("Reset semua hitungan dzikir?")) {
      setCounts({});
      setCurrentIdx(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#071911] border border-emerald-900/10 dark:border-emerald-500/20 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-emerald-950/60 bg-gradient-to-r from-emerald-500/10 via-emerald-600/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                Dzikir Ba&apos;da Sholat Fardhu
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sesuai sunnah shahih Rasulullah SAW dilengkapi tasbih digital
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-emerald-950/60 p-2 gap-2 bg-slate-50/50 dark:bg-black/20">
          <button
            onClick={() => setActiveTab("tasbih")}
            type="button"
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === "tasbih"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            Tasbih Digital Interaktif
          </button>
          <button
            onClick={() => setActiveTab("list")}
            type="button"
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === "list"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            Bacaan Lengkap 7 Dzikir
          </button>
        </div>

        {/* Body */}
        {activeTab === "tasbih" ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-center">
            {/* Step Navigation Pill */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <button
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="inline-flex items-center gap-1 font-semibold disabled:opacity-30 hover:text-emerald-600 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {currentIdx + 1} dari {DZIKIR_BADA_SHOLAT.length}
              </span>

              <button
                onClick={() =>
                  setCurrentIdx((prev) =>
                    Math.min(DZIKIR_BADA_SHOLAT.length - 1, prev + 1)
                  )
                }
                disabled={currentIdx === DZIKIR_BADA_SHOLAT.length - 1}
                className="inline-flex items-center gap-1 font-semibold disabled:opacity-30 hover:text-emerald-600 cursor-pointer"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dzikir Title */}
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {currentDzikir.title}
            </h4>

            {/* Arabic Text Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-500/20">
              <p className="font-arabic text-2xl sm:text-3xl text-emerald-800 dark:text-emerald-200 leading-loose select-none">
                {currentDzikir.arabic}
              </p>
            </div>

            {/* Latin & Translation */}
            <div className="text-left space-y-1 text-xs">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {currentDzikir.latin}
              </p>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                {currentDzikir.translation}
              </p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-1">
                {currentDzikir.dalil}
              </p>
            </div>

            {/* Giant Circular Digital Counter Button */}
            <div className="pt-2 flex flex-col items-center justify-center">
              <button
                onClick={handleIncrement}
                type="button"
                className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center shadow-xl transition-all active:scale-90 cursor-pointer border-4 ${
                  isCompleted
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-amber-300 text-white shadow-emerald-600/30 animate-pulse-gentle"
                    : "bg-gradient-to-br from-emerald-600 to-emerald-800 border-emerald-400/50 text-white shadow-emerald-800/30 hover:scale-105"
                }`}
              >
                <span className="text-4xl sm:text-5xl font-mono font-black tabular-nums tracking-tight">
                  {currentCount}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-100/90 mt-1">
                  / {currentDzikir.targetCount} Kali
                </span>
                <span className="text-[9px] text-emerald-200/70 mt-0.5">
                  (Ketuk Layar / Spasi)
                </span>
              </button>

              {/* Reset Count Button */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleResetCurrent}
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Ulangi {currentDzikir.targetCount}x</span>
                </button>

                <span className="text-slate-300 dark:text-slate-700">•</span>

                <button
                  onClick={handleResetAll}
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 cursor-pointer"
                >
                  <span>Reset Semua</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {DZIKIR_BADA_SHOLAT.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#05130d] border border-slate-200/80 dark:border-emerald-900/30 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                    {item.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/20">
                    Target: {item.targetCount}x
                  </span>
                </div>

                <p className="font-arabic text-xl sm:text-2xl text-emerald-900 dark:text-emerald-200 leading-relaxed text-right py-1">
                  {item.arabic}
                </p>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {item.latin}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.translation}
                </p>

                {item.keutamaan && (
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-700 dark:text-amber-300">
                    💡 <strong>Keutamaan:</strong> {item.keutamaan}
                  </div>
                )}

                <p className="text-[10px] text-slate-400 font-mono">
                  {item.dalil}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
