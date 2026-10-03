"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  CheckCircle,
  History,
  ChevronDown,
  Quote,
} from "lucide-react";
import confetti from "canvas-confetti";
import { getHijriDate } from "@/lib/hijriConverter";
import { ISLAMIC_MONTHS, IslamicMonthInfo } from "@/data/islamicMonthsData";
import { getDayAmalan, toggleDayAmalan, getStoredPreferences } from "@/lib/storage";

export default function MonthGuidanceCard() {
  const [activeMonth, setActiveMonth] = useState<IslamicMonthInfo>(ISLAMIC_MONTHS[0]);
  const [activeTab, setActiveTab] = useState<"amalan" | "sirah" | "checklist">("amalan");
  const [completedAmalan, setCompletedAmalan] = useState<string[]>([]);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const todayKey = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const prefs = getStoredPreferences();
    const hijri = getHijriDate(new Date(), prefs.hijriAdjustment);
    setActiveMonth(hijri.monthInfo);

    const amalanToday = getDayAmalan(todayKey);
    setCompletedAmalan(amalanToday);
  }, [todayKey]);

  const handleToggleChecklist = (id: string) => {
    const updated = toggleDayAmalan(todayKey, id);
    setCompletedAmalan(updated);

    if (updated.includes(id)) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const dailySunnahChecklist = [
    { id: "rawatib_fajr", title: "2 Rakaat Qabliyah Subuh", desc: "Lebih baik dari dunia dan seisinya (HR. Muslim)" },
    { id: "dhuha", title: "Sholat Dhuha (Minimal 2 Rakaat)", desc: "Sedekah untuk 360 persendian tubuh" },
    { id: "rawatib_day", title: "Sholat Sunnah Rawatib Dzuhur & Ba'diyah", desc: "Menyempurnakan sholat fardhu" },
    { id: "sedekah", title: "Sedekah Subuh / Harian", desc: "Malaikat mendoakan ganti berlipat" },
    { id: "dzikir", title: "Dzikir Pagi & Petang", desc: "Benteng perlindungan dari marabahaya" },
    { id: "quran", title: "Tadarus Al-Qur'an (One Day One Juz / Ayat)", desc: "Pemberi syafa'at di hari kiamat" },
    { id: "witir", title: "Sholat Witir Sebelum Tidur / Qiyamul Lail", desc: "Wasiat Rasulullah SAW kepada Abu Hurairah" },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0c1f18] p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
      {/* Month Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-5 sm:p-6 mb-6">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200">
                Bulan {activeMonth.monthIndex} Hijriah {activeMonth.isHaramMonth ? "• Asyhurul Hurum" : ""}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {activeMonth.latinName}
              </h3>
              <span className="text-2xl font-serif text-emerald-300">
                {activeMonth.arabicName}
              </span>
            </div>

            <p className="text-sm font-medium text-amber-300 mt-0.5">
              Tema: {activeMonth.theme}
            </p>
          </div>

          {/* Month Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold backdrop-blur-sm transition-colors"
            >
              <span>Pilih Bulan Hijriah</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isMonthDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsMonthDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0c1f18] text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-emerald-900/60 py-2 z-30 max-h-64 overflow-y-auto">
                {ISLAMIC_MONTHS.map((m) => (
                  <button
                    key={m.monthIndex}
                    onClick={() => {
                      setActiveMonth(m);
                      setIsMonthDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/50 ${
                      activeMonth.monthIndex === m.monthIndex
                        ? "font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-900/30"
                        : ""
                    }`}
                  >
                    <span>{m.monthIndex}. {m.latinName}</span>
                    <span className="font-serif opacity-70">{m.arabicName}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          </div>
        </div>

        <p className="relative z-10 text-xs text-emerald-100/90 leading-relaxed mt-3 max-w-2xl">
          {activeMonth.description}
        </p>

        {activeMonth.quranQuotes && (
          <div className="relative z-10 mt-3 pt-3 border-t border-emerald-700/50 flex items-start gap-2 text-xs text-emerald-200/90 italic">
            <Quote className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" />
            <div>
              <p>&ldquo;{activeMonth.quranQuotes.translation}&rdquo;</p>
              <p className="not-italic text-[10px] text-amber-300 font-semibold mt-0.5">
                {activeMonth.quranQuotes.surah}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-emerald-950/80 mb-5">
        <button
          onClick={() => setActiveTab("amalan")}
          className={`flex items-center gap-1.5 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === "amalan"
              ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Amalan Sunnah Rasulullah ({activeMonth.practices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("sirah")}
          className={`flex items-center gap-1.5 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === "sirah"
              ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Sirah & Peristiwa ({activeMonth.events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("checklist")}
          className={`flex items-center gap-1.5 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === "checklist"
              ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Checklist Sunnah Harian</span>
        </button>
      </div>

      {/* Tab 1: Amalan Sunnah */}
      {activeTab === "amalan" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMonth.practices.map((practice, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {practice.category}
                  </span>
                  {practice.isDailyRecommended && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      Dianjurkan Rutin
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">
                  {practice.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {practice.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 italic">
                &ldquo;{practice.dalil}&rdquo;
                <p className="not-italic font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  — {practice.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Sirah & Peristiwa */}
      {activeTab === "sirah" && (
        <div className="space-y-4">
          {activeMonth.events.map((event, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 font-bold">
                  {event.year || "Sejarah Islam"}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {event.title}
                </h4>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                {event.summary}
              </p>

              <div className="mt-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                  Ibrah & Pelajaran:{" "}
                </span>
                {event.lesson}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Checklist Sunnah Harian */}
      {activeTab === "checklist" && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Progres Hari Ini: {completedAmalan.length} dari {dailySunnahChecklist.length} Sunnah
            </span>
            <span className="font-semibold text-emerald-600">
              {Math.round((completedAmalan.length / dailySunnahChecklist.length) * 100)}% Selesai
            </span>
          </div>

          <div className="space-y-2">
            {dailySunnahChecklist.map((item) => {
              const isChecked = completedAmalan.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  type="button"
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all border ${
                    isChecked
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60"
                      : "bg-slate-50/60 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 hover:border-slate-200"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                      isChecked
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold transition-colors ${
                        isChecked
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
