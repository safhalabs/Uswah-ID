"use client";

import { X, BookOpen, Sparkles } from "lucide-react";
import { FastingRule } from "@/data/fastingTypes";

interface NiatModalProps {
  rule: FastingRule | null;
  onClose: () => void;
}

export default function NiatModal({ rule, onClose }: NiatModalProps) {
  if (!rule) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0c1f18] w-full max-w-lg rounded-3xl shadow-2xl border border-emerald-900/10 dark:border-emerald-500/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-emerald-950/80 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-700/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {rule.name}
              </h3>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                {rule.category.replace("_", " ")}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Lafadz Niat (Arabic) */}
          {rule.niatArabic && (
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-emerald-100/40 dark:from-emerald-950/40 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/40">
              <p className="text-xs uppercase font-semibold tracking-wider text-emerald-800 dark:text-emerald-300 mb-3">
                Lafadz Niat Puasa
              </p>
              <p className="text-2xl sm:text-3xl font-serif leading-loose text-slate-900 dark:text-emerald-50 direction-rtl">
                {rule.niatArabic}
              </p>
            </div>
          )}

          {/* Latin & Artinya */}
          {rule.niatLatin && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Transliterasi Latin
              </p>
              <p className="text-sm font-medium italic text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                &ldquo;{rule.niatLatin}&rdquo;
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-1">
                Artinya
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                &ldquo;{rule.niatTranslation}&rdquo;
              </p>
            </div>
          )}

          {/* Fadhilah & Keutamaan */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Keutamaan & Hikmah</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {rule.fadhilah}
            </p>
          </div>

          {/* Dalil Shahih */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Rujukan Dalil Hadits
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              {rule.dalil}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-emerald-950/80 bg-slate-50/50 dark:bg-emerald-950/20 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
