"use client";

import { useState, useEffect, useRef } from "react";
import { CityLocation } from "@/data/cities";
import {
  DayPrayerSchedule,
  calculatePrayerTimes,
  PrayerTimeItem,
} from "@/lib/prayerCalculations";
import { getHijriDate } from "@/lib/hijriConverter";
import { getStoredPreferences } from "@/lib/storage";
import {
  Maximize2,
  Minimize2,
  X,
  Clock,
  Sparkles,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Volume2,
  VolumeX,
  Lock,
} from "lucide-react";
import { soundEngine } from "@/lib/audioAlert";

interface KioskDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityLocation;
  isPortraitMode?: boolean;
}

export default function KioskDisplayModal({
  isOpen,
  onClose,
  city,
  isPortraitMode = false,
}: KioskDisplayModalProps) {
  const [schedule, setSchedule] = useState<DayPrayerSchedule | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [hijriTodayStr, setHijriTodayStr] = useState<string>("");
  const [isWakeLockActive, setIsWakeLockActive] = useState<boolean>(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState<boolean>(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Request Screen Wake Lock API to prevent display from sleeping in office
    const requestWakeLock = async () => {
      if ("wakeLock" in navigator) {
        try {
          const sentinel = await navigator.wakeLock.request("screen");
          wakeLockRef.current = sentinel;
          setIsWakeLockActive(true);

          sentinel.addEventListener("release", () => {
            setIsWakeLockActive(false);
          });
        } catch (err) {
          console.warn("Screen Wake Lock could not be obtained:", err);
          setIsWakeLockActive(false);
        }
      }
    };
    requestWakeLock();

    // 2. Realtime clock and prayer time ticker
    const updateTimes = () => {
      const now = new Date();
      const sched = calculatePrayerTimes(city, now);
      setSchedule(sched);
      setCurrentTimeStr(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      const prefs = getStoredPreferences();
      const hijri = getHijriDate(now, prefs.hijriAdjustment);
      setHijriTodayStr(hijri.formatted);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    // 3. Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);

      // Release wake lock when kiosk is closed
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }

      // Exit fullscreen if active
      if (typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [isOpen, city, onClose]);

  const toggleBrowserFullscreen = async () => {
    if (typeof document === "undefined") return;

    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreenActive(true);
      } catch (err) {
        console.warn("Fullscreen request error", err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreenActive(false);
      } catch (err) {
        console.warn("Exit fullscreen error", err);
      }
    }
  };

  if (!isOpen || !schedule) return null;

  const hoursStr = String(schedule.timeToNext.hours).padStart(2, "0");
  const minutesStr = String(schedule.timeToNext.minutes).padStart(2, "0");
  const secondsStr = String(schedule.timeToNext.seconds).padStart(2, "0");

  const getPrayerIcon = (id: PrayerTimeItem["id"]) => {
    switch (id) {
      case "imsak":
        return Moon;
      case "fajr":
        return Sunrise;
      case "sunrise":
        return Sun;
      case "dhuha":
        return Sun;
      case "dhuhr":
        return Sun;
      case "asr":
        return Sun;
      case "maghrib":
        return Sunset;
      case "isha":
        return Moon;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#021810] via-[#032317] to-[#010e09] text-white flex flex-col justify-between p-4 sm:p-8 overflow-hidden select-none animate-fade-in">
      {/* Dynamic Background Rub el Hizb Ornament */}
      <div className="absolute right-0 top-0 -mr-20 -mt-20 w-[600px] h-[600px] pointer-events-none opacity-[0.06] animate-spin-slow">
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-current fill-none text-emerald-200">
          <circle cx="100" cy="100" r="90" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="75" strokeWidth="1.5" />
          <rect x="66" y="66" width="68" height="68" strokeWidth="1.3" rx="3" />
          <rect x="66" y="66" width="68" height="68" strokeWidth="1.3" rx="3" transform="rotate(45 100 100)" />
        </svg>
      </div>

      {/* Top Bar: Location & Header Badges & Actions */}
      <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <MapPin className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{city.name}</h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-xs font-mono font-bold text-emerald-300 border border-emerald-400/30">
                {city.timezone}
              </span>
            </div>
            <p className="text-xs text-emerald-200/75">
              {city.province} • Standar Hisab Kemenag RI (+2m Ihtiyat)
            </p>
          </div>
        </div>

        {/* Center / Right Badges & Controls */}
        <div className="flex items-center gap-3">
          {isWakeLockActive && (
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anti-Sleep Monitor Aktif</span>
            </div>
          )}

          <button
            onClick={toggleBrowserFullscreen}
            type="button"
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer"
            title="Layar Penuh Browser"
          >
            {isFullscreenActive ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            type="button"
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-rose-500/30 border border-white/15 hover:border-rose-400/40 text-white transition-all cursor-pointer"
            title="Tutup Mode Kiosk (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Middle Hero Section: Digital Clock & Next Prayer Countdown */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-4 my-auto">
        {/* Massive Digital Clock & Date */}
        <div className="text-center space-y-1 mb-6">
          <div className="flex items-center justify-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400" />
            </span>
            <p className="text-6xl sm:text-7xl lg:text-9xl font-mono font-black text-white tracking-tight tabular-nums drop-shadow-2xl">
              {currentTimeStr}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 text-sm sm:text-lg text-emerald-200/90 font-medium pt-1">
            <span>{schedule.dateString}</span>
            <span className="text-emerald-400/50">•</span>
            <span className="text-amber-300 font-bold flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-amber-300" />
              {hijriTodayStr}
            </span>
          </div>
        </div>

        {/* Countdown Box to Next Prayer */}
        <div className="w-full max-w-xl p-5 sm:p-6 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Waktu Sholat Berikutnya: {schedule.nextPrayer?.name} ({schedule.nextPrayer?.timeString})</span>
          </div>

          {/* 3 Flip/Digital Timer Boxes */}
          <div className="flex items-center justify-center gap-3 font-mono">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-inner flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-5xl font-black text-white tabular-nums">
                  {hoursStr}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-bold text-emerald-300/80 mt-1">
                  Jam
                </span>
              </div>
            </div>

            <span className="text-2xl sm:text-4xl font-bold text-emerald-400 animate-pulse">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-inner flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-5xl font-black text-white tabular-nums">
                  {minutesStr}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-bold text-emerald-300/80 mt-1">
                  Menit
                </span>
              </div>
            </div>

            <span className="text-2xl sm:text-4xl font-bold text-amber-400 animate-pulse">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-2xl bg-gradient-to-b from-amber-400/25 to-amber-500/10 border border-amber-400/40 shadow-inner flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-5xl font-black text-amber-300 tabular-nums drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]">
                  {secondsStr}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-bold text-amber-200 mt-1">
                  Detik
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: 8 Prayer Times Slots (High-Contrast Row) */}
      <div className="relative z-10 w-full">
        <div
          className={`grid gap-2 sm:gap-3 ${
            isPortraitMode ? "grid-cols-4 sm:grid-cols-8" : "grid-cols-4 sm:grid-cols-8"
          }`}
        >
          {schedule.items.map((item) => {
            const isNext = schedule.nextPrayer?.id === item.id;
            const isCurrent = schedule.currentPrayer?.id === item.id;
            const Icon = getPrayerIcon(item.id);

            return (
              <div
                key={item.id}
                className={`py-3.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isNext
                    ? "bg-gradient-to-b from-amber-400/30 to-amber-500/10 border-2 border-amber-400 text-white shadow-xl shadow-amber-400/20 scale-105"
                    : isCurrent
                    ? "bg-emerald-600/40 border-2 border-emerald-400 text-white"
                    : item.isFardhu
                    ? "bg-white/10 border border-white/15 text-white"
                    : "bg-white/5 border border-white/10 text-white/70"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-4 h-4 ${isNext ? "text-amber-300" : "text-emerald-300"}`} />
                  <span className="text-xs font-bold">{item.name}</span>
                </div>
                <span className="text-[11px] font-arabic opacity-75 mb-1">
                  {item.arabicName}
                </span>
                <span
                  className={`text-base sm:text-xl font-mono font-black ${
                    isNext ? "text-amber-300" : "text-white"
                  }`}
                >
                  {item.timeString}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
