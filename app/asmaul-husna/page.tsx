"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import CitySelectorModal from "@/components/prayer/CitySelectorModal";
import { CityLocation, DEFAULT_CITY } from "@/data/cities";
import { ASMAUL_HUSNA, AsmaulHusnaItem } from "@/data/asmaulHusnaData";
import {
  getStoredPreferences,
  saveStoredPreferences,
  getMemorizedAsmaulHusna,
  toggleMemorizedAsmaulHusna,
  resetMemorizedAsmaulHusna,
} from "@/lib/storage";
import {
  Sparkles,
  Search,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  RotateCcw,
  BookOpen,
  Volume2,
  Filter,
  Check,
  Award,
  Layers,
  HelpCircle,
  Shuffle,
  ChevronRight,
} from "lucide-react";

type MemorizeMode = "all" | "hide_latin" | "hide_arabic" | "hide_meaning";

export default function AsmaulHusnaPage() {
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_CITY);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"auto" | "desktop" | "portrait" | "mobile">("auto");
  const [isHardwarePortrait, setIsHardwarePortrait] = useState(false);

  // Memorization states
  const [memorizedList, setMemorizedList] = useState<number[]>([]);
  const [mode, setMode] = useState<MemorizeMode>("all");
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unmemorized" | "memorized">("all");
  const [rangeFilter, setRangeFilter] = useState<string>("all");
  const [activeSpeechNumber, setActiveSpeechNumber] = useState<number | null>(null);

  useEffect(() => {
    const prefs = getStoredPreferences();
    if (prefs.city) setCurrentCity(prefs.city);
    if (prefs.layoutMode) setLayoutMode(prefs.layoutMode);

    setMemorizedList(getMemorizedAsmaulHusna());

    if (typeof window !== "undefined") {
      const media = window.matchMedia("(orientation: portrait) and (min-width: 768px)");
      setIsHardwarePortrait(media.matches);

      const handler = (e: MediaQueryListEvent) => {
        setIsHardwarePortrait(e.matches);
      };
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, []);

  const isPortraitEffective =
    layoutMode === "portrait" || (layoutMode === "auto" && isHardwarePortrait);
  const isMobileEffective = layoutMode === "mobile";

  const handleToggleMemorized = (num: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = toggleMemorizedAsmaulHusna(num);
    setMemorizedList([...updated]);
  };

  const handleResetProgress = () => {
    if (confirm("Apakah Anda yakin ingin mengatur ulang semua progres hafalan Asmaul Husna?")) {
      resetMemorizedAsmaulHusna();
      setMemorizedList([]);
    }
  };

  const toggleReveal = (num: number) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      return next;
    });
  };

  const handleSpeakArabic = (item: AsmaulHusnaItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    setActiveSpeechNumber(item.number);

    const utterance = new SpeechSynthesisUtterance(item.arabic);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;

    utterance.onend = () => setActiveSpeechNumber(null);
    utterance.onerror = () => setActiveSpeechNumber(null);

    window.speechSynthesis.speak(utterance);
  };

  // Filter and search logic
  const filteredList = useMemo(() => {
    return ASMAUL_HUSNA.filter((item) => {
      // Range filter
      if (rangeFilter === "1-20" && (item.number < 1 || item.number > 20)) return false;
      if (rangeFilter === "21-40" && (item.number < 21 || item.number > 40)) return false;
      if (rangeFilter === "41-60" && (item.number < 41 || item.number > 60)) return false;
      if (rangeFilter === "61-80" && (item.number < 61 || item.number > 80)) return false;
      if (rangeFilter === "81-99" && (item.number < 81 || item.number > 99)) return false;

      // Status filter
      const isMem = memorizedList.includes(item.number);
      if (filterType === "memorized" && !isMem) return false;
      if (filterType === "unmemorized" && isMem) return false;

      // Text search
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesNum = String(item.number) === q;
        const matchesLatin = item.latin.toLowerCase().includes(q);
        const matchesArabic = item.arabic.includes(q);
        const matchesTranslation = item.translation.toLowerCase().includes(q);
        const matchesMeaning = item.meaning.toLowerCase().includes(q);

        if (!matchesNum && !matchesLatin && !matchesArabic && !matchesTranslation && !matchesMeaning) {
          return false;
        }
      }

      return true;
    });
  }, [rangeFilter, filterType, searchQuery, memorizedList]);

  const memorizedPercent = Math.round((memorizedList.length / 99) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#040e09] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        currentCity={currentCity}
        onOpenCitySelector={() => setIsCityModalOpen(true)}
        layoutMode={layoutMode}
        onLayoutModeChange={(m) => setLayoutMode(m)}
      />

      <main
        className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-all ${
          isMobileEffective
            ? "max-w-md"
            : isPortraitEffective
            ? "max-w-4xl portrait-monitor-container"
            : "max-w-7xl"
        }`}
      >
        {/* Hero Header with Authentic Islamic Ornament */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#043425] to-[#021b13] text-white p-6 sm:p-8 shadow-xl border border-emerald-500/25">
          {/* Rub el Hizb Astrolabe Background */}
          <div className="absolute -right-20 -top-20 w-80 h-80 pointer-events-none opacity-[0.09] animate-spin-slow">
            <svg viewBox="0 0 200 200" className="w-full h-full stroke-current fill-none">
              <circle cx="100" cy="100" r="90" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="75" strokeWidth="1.5" />
              <rect x="66" y="66" width="68" height="68" strokeWidth="1.3" rx="3" />
              <rect x="66" y="66" width="68" height="68" strokeWidth="1.3" rx="3" transform="rotate(45 100 100)" />
              <circle cx="100" cy="100" r="22" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>99 Nama Allah Yang Maha Indah</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-2">
              Asmaul Husna &amp; Program Hafalan
            </h1>

            {/* Hadits Dalil Keutamaan Menghafal Asmaul Husna */}
            <div className="mt-3 p-4 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md">
              <p className="font-arabic text-lg sm:text-xl text-emerald-200 leading-relaxed text-right mb-1">
                إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلا وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ
              </p>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                &ldquo;Sesungguhnya Allah memiliki 99 nama, seratus kurang satu. Barangsiapa yang menghafalkannya (<em>ihsha&apos;</em>: memahami, meyakini, dan mengamalkannya), niscaya ia akan masuk surga.&rdquo;
              </p>
              <span className="text-[11px] text-amber-300/80 font-medium block mt-1">
                (HR. Bukhari no. 2736 &amp; Muslim no. 2677)
              </span>
            </div>
          </div>
        </section>

        {/* Progress Tracker Card */}
        <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#071911] border border-emerald-900/10 dark:border-emerald-500/20 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Target Progres Hafalan
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tandai nama yang telah dihafal untuk memantau capaian target 99 nama surga.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {memorizedList.length}
                </span>
                <span className="text-sm font-bold text-slate-400 dark:text-slate-500"> / 99 Nama</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-500/25">
                {memorizedPercent}%
              </span>
            </div>
          </div>

          {/* Progress Bar with Shimmer */}
          <div className="relative w-full h-3 rounded-full bg-slate-100 dark:bg-black/40 overflow-hidden border border-slate-200/60 dark:border-emerald-900/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 transition-all duration-500 relative"
              style={{ width: `${memorizedPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
            </div>
          </div>

          {/* Progress Sub-actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-emerald-950/60 text-xs">
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{memorizedList.length} Sudah Hafal</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Circle className="w-3.5 h-3.5 text-slate-400" />
                <span>{99 - memorizedList.length} Belum Hafal</span>
              </span>
            </div>

            {memorizedList.length > 0 && (
              <button
                onClick={handleResetProgress}
                type="button"
                className="inline-flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Progres</span>
              </button>
            )}
          </div>
        </section>

        {/* Study & Memorization Mode Switcher */}
        <section className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/30 border border-emerald-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Pilih Mode Uji Hafalan:
              </span>
            </div>
            {mode !== "all" && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Klik kartu nama untuk mengintip/membuka teks yang disembunyikan
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setMode("all")}
              type="button"
              className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer border ${
                mode === "all"
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-700/20"
                  : "bg-white dark:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
              }`}
            >
              <span>1. Tampilkan Semua</span>
              <Eye className="w-3.5 h-3.5 opacity-70" />
            </button>

            <button
              onClick={() => setMode("hide_latin")}
              type="button"
              className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer border ${
                mode === "hide_latin"
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-700/20"
                  : "bg-white dark:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
              }`}
            >
              <span>2. Tutup Latin (Uji Baca)</span>
              <EyeOff className="w-3.5 h-3.5 opacity-70" />
            </button>

            <button
              onClick={() => setMode("hide_arabic")}
              type="button"
              className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer border ${
                mode === "hide_arabic"
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-700/20"
                  : "bg-white dark:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
              }`}
            >
              <span>3. Tutup Arab (Uji Lafadz)</span>
              <EyeOff className="w-3.5 h-3.5 opacity-70" />
            </button>

            <button
              onClick={() => setMode("hide_meaning")}
              type="button"
              className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer border ${
                mode === "hide_meaning"
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-700/20"
                  : "bg-white dark:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
              }`}
            >
              <span>4. Tutup Arti (Uji Makna)</span>
              <EyeOff className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </section>

        {/* Filter, Search & Range Toolbar */}
        <section className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, nomor, atau arti..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#071911] border border-slate-200 dark:border-emerald-500/25 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Hafalan Status */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setFilterType("all")}
                type="button"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                  filterType === "all"
                    ? "bg-slate-900 dark:bg-emerald-600 text-white border-transparent"
                    : "bg-white dark:bg-[#071911] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-emerald-900/40 hover:bg-slate-100 dark:hover:bg-emerald-950"
                }`}
              >
                Semua ({ASMAUL_HUSNA.length})
              </button>

              <button
                onClick={() => setFilterType("unmemorized")}
                type="button"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                  filterType === "unmemorized"
                    ? "bg-amber-600 text-white border-transparent"
                    : "bg-white dark:bg-[#071911] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-emerald-900/40 hover:bg-slate-100 dark:hover:bg-emerald-950"
                }`}
              >
                Belum Hafal ({99 - memorizedList.length})
              </button>

              <button
                onClick={() => setFilterType("memorized")}
                type="button"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                  filterType === "memorized"
                    ? "bg-emerald-600 text-white border-transparent"
                    : "bg-white dark:bg-[#071911] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-emerald-900/40 hover:bg-slate-100 dark:hover:bg-emerald-950"
                }`}
              >
                Sudah Hafal ({memorizedList.length})
              </button>
            </div>
          </div>

          {/* Quick Range Jumper (1-20, 21-40, ...) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
              Kelompok:
            </span>
            {[
              { id: "all", label: "1-99 Lengkap" },
              { id: "1-20", label: "1 - 20" },
              { id: "21-40", label: "21 - 40" },
              { id: "41-60", label: "41 - 60" },
              { id: "61-80", label: "61 - 80" },
              { id: "81-99", label: "81 - 99" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRangeFilter(r.id)}
                type="button"
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
                  rangeFilter === r.id
                    ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 font-bold"
                    : "bg-white dark:bg-[#071911] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-emerald-900/40 hover:border-slate-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </section>

        {/* 99 Asmaul Husna Grid Cards */}
        <section>
          {filteredList.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-3xl bg-white dark:bg-[#071911] border border-slate-200 dark:border-emerald-900/30">
              <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Tidak ada Asmaul Husna yang sesuai pencarian
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Coba ganti kata kunci atau pilih tab filter lain.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                isPortraitEffective
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {filteredList.map((item) => {
                const isMemorized = memorizedList.includes(item.number);
                const isRevealed = revealedIds.has(item.number);

                // Determine what is hidden
                const hideArabic = mode === "hide_arabic" && !isRevealed;
                const hideLatin = mode === "hide_latin" && !isRevealed;
                const hideMeaning = mode === "hide_meaning" && !isRevealed;

                return (
                  <div
                    key={item.number}
                    onClick={() => {
                      if (mode !== "all") toggleReveal(item.number);
                    }}
                    className={`relative rounded-3xl p-5 sm:p-6 transition-all border flex flex-col justify-between group ${
                      isMemorized
                        ? "bg-white dark:bg-[#071911] border-emerald-500/40 shadow-sm ring-1 ring-emerald-500/20"
                        : "bg-white dark:bg-[#05130d] border-slate-200/80 dark:border-emerald-900/30 shadow-sm hover:border-emerald-400/40 hover:shadow-md"
                    } ${mode !== "all" ? "cursor-pointer" : ""}`}
                  >
                    {/* Top Row: Number Badge & Memorization Button */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      {/* Number Badge with Rub el Hizb styling */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center font-mono font-bold text-xs border ${
                            isMemorized
                              ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                              : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40"
                          }`}
                        >
                          #{String(item.number).padStart(2, "0")}
                        </span>
                        {isMemorized && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-300/40">
                            <Check className="w-3 h-3" />
                            <span>Sudah Hafal</span>
                          </span>
                        )}
                      </div>

                      {/* Action buttons: Speech & Checkbox */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleSpeakArabic(item, e)}
                          type="button"
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            activeSpeechNumber === item.number
                              ? "bg-amber-400 text-slate-950 border-amber-300 scale-95"
                              : "bg-slate-50 hover:bg-slate-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-emerald-900/40"
                          }`}
                          title="Dengarkan pengucapan lafadz Arab"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => handleToggleMemorized(item.number, e)}
                          type="button"
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            isMemorized
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm"
                              : "bg-slate-50 hover:bg-emerald-50 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-slate-400 hover:text-emerald-600 border-slate-200 dark:border-emerald-900/40"
                          }`}
                          title={isMemorized ? "Tandai belum hafal" : "Tandai sudah hafal"}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              isMemorized ? "fill-white text-emerald-600" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Middle: Arabic Typography Display */}
                    <div className="text-center py-2 min-h-[90px] flex flex-col justify-center items-center">
                      {hideArabic ? (
                        <div className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 border border-dashed border-slate-300 dark:border-emerald-800 text-slate-400 text-xs font-medium">
                          <EyeOff className="w-4 h-4 mx-auto mb-1 opacity-70" />
                          <span>Klik untuk intip lafadz Arab</span>
                        </div>
                      ) : (
                        <p className="font-arabic text-3xl sm:text-4xl text-emerald-800 dark:text-emerald-200 tracking-wide font-normal drop-shadow-sm select-none">
                          {item.arabic}
                        </p>
                      )}
                    </div>

                    {/* Bottom: Latin Transliteration & Indonesian Meaning */}
                    <div className="pt-3 border-t border-slate-100 dark:border-emerald-950/60 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        {hideLatin ? (
                          <div className="py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-emerald-950/60 border border-dashed border-slate-300 dark:border-emerald-800 text-[11px] text-slate-400">
                            (Latin Tersembunyi - Klik Kartu)
                          </div>
                        ) : (
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                            {item.latin}
                          </h3>
                        )}

                        {mode !== "all" && isRevealed && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                            Terbuka
                          </span>
                        )}
                      </div>

                      {hideMeaning ? (
                        <div className="py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-emerald-950/60 border border-dashed border-slate-300 dark:border-emerald-800 text-[11px] text-slate-400">
                          (Arti Tersembunyi - Klik Kartu)
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                            {item.translation}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                            {item.meaning}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
        onSelectCity={(city) => {
          setCurrentCity(city);
          saveStoredPreferences({ city });
        }}
      />
    </div>
  );
}
