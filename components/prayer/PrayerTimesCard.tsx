"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import {
  Clock,
  Volume2,
  VolumeX,
  Bell,
  Check,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  BellRing,
  CheckCircle2,
  Maximize2,
  Compass,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { CityLocation } from "@/data/cities";
import {
  calculatePrayerTimes,
  DayPrayerSchedule,
  PrayerTimeItem,
} from "@/lib/prayerCalculations";
import { soundEngine } from "@/lib/audioAlert";
import { getStoredPreferences, saveStoredPreferences } from "@/lib/storage";
import { getHijriDate } from "@/lib/hijriConverter";
import { calculateWaktuTahrim, WaktuTahrimInfo } from "@/lib/sunnahCalculations";
import KioskDisplayModal from "@/components/kiosk/KioskDisplayModal";
import QiblaCompassModal from "@/components/qibla/QiblaCompassModal";
import DzikirModal from "@/components/dzikir/DzikirModal";

interface PrayerTimesCardProps {
  city: CityLocation;
  onOpenCitySelector: () => void;
  isPortraitMode?: boolean;
}

export default function PrayerTimesCard({
  city,
  onOpenCitySelector,
  isPortraitMode = false,
}: PrayerTimesCardProps) {
  const [schedule, setSchedule] = useState<DayPrayerSchedule | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [hijriTodayStr, setHijriTodayStr] = useState<string>("");
  const [hasNotificationPerm, setHasNotificationPerm] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [preAdzanAlertEnabled, setPreAdzanAlertEnabled] = useState(true);
  const [audioVolume, setAudioVolume] = useState<number>(0.8);
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(true);
  const [waktuTahrim, setWaktuTahrim] = useState<WaktuTahrimInfo | null>(null);

  // Modals state
  const [isKioskOpen, setIsKioskOpen] = useState(false);
  const [isQiblaOpen, setIsQiblaOpen] = useState(false);
  const [isDzikirOpen, setIsDzikirOpen] = useState(false);

  const [, startTransition] = useTransition();

  const lastNotified10mRef = useRef<string>("");
  const lastNotifiedAdzanRef = useRef<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setHasNotificationPerm(Notification.permission === "granted");
    }

    const initialPrefs = getStoredPreferences();
    setPreAdzanAlertEnabled(initialPrefs.preAdzanReminderEnabled);
    setAudioVolume(initialPrefs.audioVolume);
    setAudioUnlocked(soundEngine.isAudioUnlocked());

    const updateTimes = () => {
      const now = new Date();
      startTransition(() => {
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

        // Check 3 Waktu Terlarang Sholat (Waktu Tahrim)
        const tahrim = calculateWaktuTahrim(city, now, sched);
        setWaktuTahrim(tahrim);

        // Check for automatic notification triggers
        if (sched && sched.nextPrayer) {
          const totalSecs = sched.timeToNext.totalSeconds;

          // 1. Alarm 10 Menit Sebelum Adzan (Persiapan ke Masjid)
          // Range 595 - 600 detik agar tidak terlewat
          if (totalSecs <= 600 && totalSecs >= 595 && prefs.preAdzanReminderEnabled) {
            const key10m = `${sched.nextPrayer.id}_10m_${sched.dateString}`;
            if (lastNotified10mRef.current !== key10m) {
              lastNotified10mRef.current = key10m;
              soundEngine.playPreAdzanChime(prefs.audioVolume);
              soundEngine.sendNotification(
                `🕌 10 Menit Menuju Sholat ${sched.nextPrayer.name}!`,
                `Waktunya bersiap ke masjid (${sched.nextPrayer.timeString}). Segera ambil wudhu untuk sholat berjamaah bersama imam.`
              );
            }
          }

          // 2. Notifikasi Waktu Sholat Tiba / Masuk Adzan (0 - 2 detik)
          if (totalSecs <= 2 && totalSecs >= 0) {
            const keyAdzan = `${sched.nextPrayer.id}_adzan_${sched.dateString}`;
            if (lastNotifiedAdzanRef.current !== keyAdzan) {
              lastNotifiedAdzanRef.current = keyAdzan;
              if (prefs.audioEnabled) {
                if (prefs.audioTone === "gentle_chime") {
                  soundEngine.playGentleChime(prefs.audioVolume);
                } else {
                  soundEngine.playTakbirBeep(prefs.audioVolume);
                }
              }
              soundEngine.sendNotification(
                `📢 Waktu Sholat ${sched.nextPrayer.name} Telah Tiba!`,
                `Allahu Akbar, Allahu Akbar. Waktu sholat ${sched.nextPrayer.name} (${sched.nextPrayer.timeString}) telah masuk di ${city.name}.`
              );
            }
          }
        }
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    // Global Keyboard Shortcuts (F = Kiosk, Q = Qibla, D = Dzikir, K = Kota, M = Mute)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setIsKioskOpen((prev) => !prev);
      } else if (e.key === "q" || e.key === "Q") {
        e.preventDefault();
        setIsQiblaOpen((prev) => !prev);
      } else if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        setIsDzikirOpen((prev) => !prev);
      } else if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        onOpenCitySelector();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        const prefs = getStoredPreferences();
        const nextVal = !prefs.audioEnabled;
        saveStoredPreferences({ audioEnabled: nextVal });
        if (nextVal) soundEngine.playGentleChime(0.4);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [city, onOpenCitySelector]);

  const handleVolumeChange = (newVol: number) => {
    setAudioVolume(newVol);
    saveStoredPreferences({ audioVolume: newVol });
  };

  const handleUnlockAudio = async () => {
    await soundEngine.unlockAudio();
    soundEngine.playGentleChime(audioVolume * 0.5);
    setAudioUnlocked(true);
  };

  if (!schedule) {
    return (
      <div className="w-full h-80 rounded-3xl bg-emerald-950/20 dark:bg-emerald-950/40 animate-pulse border border-emerald-900/10" />
    );
  }

  const handleTogglePreAdzan = () => {
    const nextVal = !preAdzanAlertEnabled;
    setPreAdzanAlertEnabled(nextVal);
    saveStoredPreferences({ preAdzanReminderEnabled: nextVal });
    if (nextVal) {
      soundEngine.playPreAdzanChime(0.6);
    }
  };

  const handleTestSound = () => {
    setIsPlayingSound(true);
    const prefs = getStoredPreferences();
    if (prefs.audioTone === "gentle_chime") {
      soundEngine.playGentleChime(prefs.audioVolume);
    } else {
      soundEngine.playTakbirBeep(prefs.audioVolume);
    }
    soundEngine.sendNotification(
      `📢 [Tes] Waktu Sholat ${schedule.nextPrayer?.name} Tiba`,
      `Simulasi notifikasi masuk waktu sholat ${schedule.nextPrayer?.name} (${schedule.nextPrayer?.timeString}).`
    );
    setTimeout(() => setIsPlayingSound(false), 2500);
  };

  const handleTest10mAlert = () => {
    setIsPlayingSound(true);
    const prefs = getStoredPreferences();
    soundEngine.playPreAdzanChime(prefs.audioVolume);
    soundEngine.sendNotification(
      `🕌 [Tes] 10 Menit Menuju ${schedule.nextPrayer?.name}!`,
      `Simulasi alarm persiapan ke masjid. Selesaikan pekerjaan dan ambil wudhu!`
    );
    setTimeout(() => setIsPlayingSound(false), 2500);
  };

  const handleEnableNotification = async () => {
    const granted = await soundEngine.requestNotificationPermission();
    setHasNotificationPerm(granted);
    if (granted) {
      soundEngine.sendNotification(
        "🕌 Notifikasi Adzan Uswah.id Aktif!",
        `Pengingat adzan & alarm persiapan 10 menit ke masjid kini aktif untuk wilayah ${city.name}.`
      );
      soundEngine.playPreAdzanChime(0.5);
    }
  };

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

  const hoursStr = String(schedule.timeToNext.hours).padStart(2, "0");
  const minutesStr = String(schedule.timeToNext.minutes).padStart(2, "0");
  const secondsStr = String(schedule.timeToNext.seconds).padStart(2, "0");

  const isUrgent =
    schedule.timeToNext.hours === 0 && schedule.timeToNext.minutes < 15;
  const isPreAdzanActive =
    schedule.timeToNext.totalSeconds <= 600 && schedule.timeToNext.totalSeconds > 0;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#043425] to-[#021b13] text-white p-5 sm:p-7 shadow-2xl shadow-emerald-950/30 border transition-all ${
        isUrgent
          ? "border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.25)] animate-pulse-gentle"
          : "border-emerald-500/25"
      }`}
    >
      {/* Rotating Dynamic Islamic Rub el Hizb & Celestial Astrolabe Ring Animation */}
      <div className="absolute -right-24 -top-24 w-[420px] h-[420px] pointer-events-none opacity-[0.08] dark:opacity-[0.14] animate-spin-slow">
        <svg viewBox="0 0 200 200" className="w-full h-full text-emerald-200 stroke-current fill-none">
          {/* Concentric Astrolabe Coordinate Circles */}
          <circle cx="100" cy="100" r="92" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="82" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="66" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="50" strokeWidth="1.2" strokeDasharray="6 3" />

          {/* 16 Astrolabe Azimuth Radial Calibration Ticks */}
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="8"
              x2="100"
              y2={i % 2 === 0 ? "24" : "18"}
              strokeWidth={i % 4 === 0 ? "1.8" : "1"}
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}

          {/* Authentic Islamic Rub el Hizb (8-Pointed Star - 2 concentric squares at 45°) */}
          <rect
            x="66"
            y="66"
            width="68"
            height="68"
            rx="3"
            strokeWidth="1.3"
            opacity="0.75"
          />
          <rect
            x="66"
            y="66"
            width="68"
            height="68"
            rx="3"
            strokeWidth="1.3"
            opacity="0.75"
            transform="rotate(45 100 100)"
          />
          <circle cx="100" cy="100" r="26" strokeWidth="1" opacity="0.6" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="14" strokeWidth="1.2" opacity="0.8" />
          <circle cx="100" cy="100" r="3.5" fill="currentColor" opacity="0.9" />
        </svg>
      </div>

      {/* Subtle Islamic Rosette / Radial Ambient Lights */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* Top Bar: Location Switcher & Realtime Clock */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        {/* City Location Button */}
        <button
          onClick={onOpenCitySelector}
          type="button"
          className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all group cursor-pointer shadow-sm hover:border-emerald-300/40"
        >
          <div className="p-2 rounded-xl bg-emerald-500/25 text-emerald-300 group-hover:scale-110 transition-transform">
            <MapPin className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-200 transition-colors">
                {city.name}
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-400/30">
                {city.timezone}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-300 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-emerald-200/75">
              {city.province} • <span className="underline decoration-emerald-400/40">Ganti Kota</span>
            </p>
          </div>
        </button>

        {/* Live Digital Clock & Dates */}
        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="flex items-center justify-end gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black tracking-tight text-white tabular-nums drop-shadow-md">
                {currentTimeStr}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 text-[11px] text-emerald-200/80 font-medium mt-0.5">
              <span>{schedule.dateString}</span>
              {hijriTodayStr && (
                <>
                  <span className="text-emerald-400/50">•</span>
                  <span className="text-amber-300 font-semibold flex items-center gap-1">
                    <CalendarDays className="w-3 h-3 inline text-amber-300/80" />
                    {hijriTodayStr}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Audio Autoplay Unlock Safeguard */}
      {!audioUnlocked && (
        <div
          onClick={handleUnlockAudio}
          className="relative z-20 mb-4 p-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-between gap-3 cursor-pointer transition-all animate-bounce"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-slate-950 flex-shrink-0" />
            <span>Klik di sini sekali untuk memastikan alarm adzan &amp; audio browser aktif di latar belakang</span>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-slate-950 text-amber-300 text-[10px] font-mono uppercase font-bold flex-shrink-0">
            Aktifkan Suara
          </span>
        </div>
      )}

      {/* Educational Waktu Tahrim (Terlarang Sholat) Alert */}
      {waktuTahrim?.isTahrim && (
        <div className="relative z-10 mb-4 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-400/50 text-rose-100 backdrop-blur-md text-xs flex items-start gap-2.5 shadow-md">
          <AlertTriangle className="w-4 h-4 text-rose-300 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-rose-200">
                ⚠️ {waktuTahrim.title} ({waktuTahrim.timeRange})
              </span>
              <span className="px-2 py-0.2 rounded-md bg-rose-500/30 text-[10px] font-mono font-bold text-rose-200 border border-rose-400/30">
                Fiqih Sholat
              </span>
            </div>
            <p className="text-[11px] text-rose-200/90 leading-relaxed">
              {waktuTahrim.description} (<em>{waktuTahrim.dalil}</em>)
            </p>
          </div>
        </div>
      )}

      {/* Quick Utility Toolbar: Kiosk Display, Qibla Compass, Dzikir Ba'da Sholat, Volume */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 mb-5 p-2 rounded-2xl bg-black/30 border border-white/10 text-xs backdrop-blur-md">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setIsKioskOpen(true)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/10 font-bold transition-all cursor-pointer hover:border-emerald-400/40 hover:text-white"
            title="Buka Mode Layar Penuh Kiosk untuk Monitor Kantor / Monitor Miring (Pintasan: Tekan F)"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Mode Kiosk (F)</span>
          </button>

          <button
            onClick={() => setIsQiblaOpen(true)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/10 font-bold transition-all cursor-pointer hover:border-emerald-400/40 hover:text-white"
            title="Buka Kompas Arah Kiblat Presisi (Pintasan: Tekan Q)"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Arah Kiblat (Q)</span>
          </button>

          <button
            onClick={() => setIsDzikirOpen(true)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/10 font-bold transition-all cursor-pointer hover:border-emerald-400/40 hover:text-white"
            title="Buka Dzikir Ba'da Sholat & Tasbih Digital (Pintasan: Tekan D)"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Dzikir &amp; Tasbih (D)</span>
          </button>
        </div>

        {/* Quick Volume Slider */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px]">
          <Volume2 className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-emerald-200/80 font-medium">Vol:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioVolume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-16 sm:w-20 accent-amber-400 cursor-pointer h-1.5 rounded-lg bg-white/20"
            title={`Volume Suara: ${Math.round(audioVolume * 100)}%`}
          />
          <span className="font-mono text-[10px] text-amber-300 min-w-[28px]">
            {Math.round(audioVolume * 100)}%
          </span>
        </div>
      </div>

      {/* 10-Minute Pre-Adzan Mosque Preparation Alert Banner */}
      {isPreAdzanActive && (
        <div className="relative z-10 mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/25 via-amber-600/15 to-emerald-950/40 border-2 border-amber-400/60 backdrop-blur-xl shadow-xl shadow-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse-gentle">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-400/25 text-amber-300 border border-amber-400/40 shadow-inner flex-shrink-0">
              <BellRing className="w-6 h-6 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] tracking-wider uppercase">
                  🕌 10 Menit Menuju {schedule.nextPrayer?.name} ({schedule.nextPrayer?.timeString})
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  Sisa {minutesStr}:{secondsStr}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100/90 mt-1 leading-snug">
                Waktunya bersiap ke masjid! Selesaikan aktivitas kantor/kamar, segera ambil wudhu dan berjalan ke masjid agar dapat takbiratul ihram bersama imam.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              onClick={handleTest10mAlert}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Tes Nada 10 Mnt</span>
            </button>
          </div>
        </div>
      )}

      {/* Countdown & Next Prayer Hero Section */}
      <div
        className={`relative z-10 grid gap-6 items-center mb-6 bg-black/35 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl ${
          isPortraitMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
        }`}
      >
        {/* Next Prayer Details */}
        <div className={`${isPortraitMode ? "" : "lg:col-span-7"} space-y-3`}>
          {/* Header Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/25 to-amber-500/15 border border-amber-400/35 text-[11px] font-bold text-amber-300 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              Waktu Sholat Berikutnya
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-[10px] text-emerald-300 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Standar Kemenag RI (+2m Ihtiyat)
            </span>
          </div>

          {/* Prayer Name & Time Display */}
          <div className="flex items-baseline gap-3.5 flex-wrap pt-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {schedule.nextPrayer?.name}
            </h2>
            <span className="text-2xl sm:text-3xl font-arabic text-emerald-300/90 font-bold">
              {schedule.nextPrayer?.arabicName}
            </span>
            <div className="flex items-baseline gap-1.5 px-3 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30">
              <span className="text-2xl sm:text-3xl font-mono font-black text-amber-300 tabular-nums">
                {schedule.nextPrayer?.timeString}
              </span>
              <span className="text-xs font-semibold text-amber-200">
                {city.timezone}
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-100/75 leading-relaxed max-w-lg">
            Waktu sholat fardhu {schedule.nextPrayer?.name} untuk wilayah{" "}
            <span className="font-semibold text-white">{city.name}</span>.
            {isUrgent ? (
              <span className="ml-1 text-amber-300 font-bold animate-pulse">
                Segera berwudhu dan bersiap sholat berjamaah.
              </span>
            ) : (
              <span> Jaga wudhu dan luangkan waktu sebelum adzan berkumandang.</span>
            )}
          </p>

          {/* Time Progress Bar With Laser Shimmer */}
          <div className="pt-2 max-w-lg">
            <div className="flex items-center justify-between text-[11px] text-emerald-200/90 mb-1.5 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Fase Menuju Waktu Sholat
              </span>
              <span className="font-mono font-bold text-amber-300">
                {schedule.progressPercent}% selesai
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/40 border border-white/10 p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 shadow-[0_0_14px_rgba(52,211,153,0.6)] transition-all duration-1000 relative overflow-hidden"
                style={{
                  width: `${Math.min(100, Math.max(4, schedule.progressPercent))}%`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Polished Countdown Timer Box (Col 5) */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
          <div className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-black/40 border border-white/15 p-4 sm:p-5 flex flex-col items-center shadow-lg">
            {/* Header Title */}
            <div className="flex items-center gap-1.5 mb-3 text-emerald-200">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Sisa Waktu Menuju {schedule.nextPrayer?.name}
              </span>
            </div>

            {/* 3 Flip/Digital Timer Boxes */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 font-mono">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-inner flex flex-col items-center justify-center overflow-hidden timer-box-glow group">
                  {/* Subtle Flip Split line */}
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/40 pointer-events-none" />
                  {/* Top Specular Sheen */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-white/25 pointer-events-none" />

                  <span className="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none tracking-tight">
                    {hoursStr}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-emerald-300/80 mt-1.5">
                    Jam
                  </span>
                </div>
              </div>

              {/* Glowing Colon Separator */}
              <div className="flex flex-col gap-1.5 pb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-inner flex flex-col items-center justify-center overflow-hidden timer-box-glow group">
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/40 pointer-events-none" />
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-white/25 pointer-events-none" />

                  <span className="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none tracking-tight">
                    {minutesStr}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-emerald-300/80 mt-1.5">
                    Menit
                  </span>
                </div>
              </div>

              {/* Glowing Colon Separator */}
              <div className="flex flex-col gap-1.5 pb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/90 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/90 animate-pulse" />
              </div>

              {/* Seconds (Highlighted Amber Accent) */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-b from-amber-400/20 to-amber-500/5 border border-amber-400/40 shadow-inner flex flex-col items-center justify-center overflow-hidden timer-box-active group">
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/40 pointer-events-none" />
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-white/30 pointer-events-none" />

                  <span className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums leading-none tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]">
                    {secondsStr}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-amber-200 mt-1.5">
                    Detik
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex flex-col gap-2 mt-4 w-full pt-3 border-t border-white/10">
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <button
                  onClick={handleTest10mAlert}
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isPlayingSound
                      ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30 scale-95"
                      : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/35"
                  }`}
                  title="Dengarkan bunyi alarm pengingat 10 menit persiapan ke masjid"
                >
                  <BellRing className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tes 10 Mnt Masjid</span>
                </button>

                <button
                  onClick={handleTestSound}
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isPlayingSound
                      ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30 scale-95"
                      : "bg-white/10 hover:bg-white/20 text-emerald-100 border-white/15"
                  }`}
                  title="Dengarkan simulasi nada adzan/pengingat sholat"
                >
                  <Volume2
                    className={`w-3.5 h-3.5 ${
                      isPlayingSound ? "text-slate-950 animate-bounce" : "text-amber-300"
                    }`}
                  />
                  <span>Tes Adzan</span>
                </button>

                {!hasNotificationPerm ? (
                  <button
                    onClick={handleEnableNotification}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-400/40 transition-all cursor-pointer"
                    title="Aktifkan notifikasi browser agar muncul pop-up saat adzan tiba"
                  >
                    <Bell className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Nyalakan Notifikasi</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Notif Browser Aktif</span>
                  </div>
                )}
              </div>

              {/* Pre-adzan Toggle & Explanation */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px]">
                <span className="text-emerald-200/80">Alarm 10 Mnt ke Masjid:</span>
                <button
                  onClick={handleTogglePreAdzan}
                  type="button"
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-all cursor-pointer border ${
                    preAdzanAlertEnabled
                      ? "bg-amber-400 text-slate-950 border-amber-300 shadow-sm"
                      : "bg-white/10 text-white/50 border-white/15 hover:bg-white/15"
                  }`}
                >
                  {preAdzanAlertEnabled ? "AKTIF (Bunyi + Notif)" : "NONAKTIF"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Prayer Slots Grid (High Contrast, Professional & Responsive) */}
      <div
        className={`relative z-10 grid gap-2 sm:gap-2.5 ${
          isPortraitMode
            ? "grid-cols-2 sm:grid-cols-4"
            : "grid-cols-4 sm:grid-cols-8"
        }`}
      >
        {schedule.items.map((item) => {
          const isNext = schedule.nextPrayer?.id === item.id;
          const isCurrent = schedule.currentPrayer?.id === item.id;
          const Icon = getPrayerIcon(item.id);

          return (
            <div
              key={item.id}
              className={`relative flex flex-col items-center justify-center py-3 px-1.5 sm:px-2 rounded-2xl transition-all ${
                isNext
                  ? "bg-gradient-to-b from-amber-400/25 via-amber-500/10 to-transparent border-2 border-amber-400 text-white shadow-xl shadow-amber-500/20 ring-4 ring-amber-400/20 scale-[1.03] z-20"
                  : isCurrent
                  ? "bg-emerald-600/35 border-2 border-emerald-400/80 text-white ring-2 ring-emerald-500/20 z-10"
                  : item.isFardhu
                  ? "bg-white/10 hover:bg-white/15 border border-white/15 text-white shadow-sm"
                  : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/75"
              }`}
            >
              {/* Badge: SELANJUTNYA or SAAT INI */}
              {isNext ? (
                <span className="absolute -top-2.5 px-2 py-0.5 text-[8px] font-black tracking-wider uppercase bg-amber-400 text-slate-950 rounded-full shadow-md">
                  Berikutnya
                </span>
              ) : isCurrent ? (
                <span className="absolute -top-2.5 px-2 py-0.5 text-[8px] font-black tracking-wider uppercase bg-emerald-400 text-slate-950 rounded-full shadow-md">
                  Saat Ini
                </span>
              ) : null}

              {/* Icon & Name */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isNext
                      ? "text-amber-300"
                      : isCurrent
                      ? "text-emerald-300"
                      : item.isFardhu
                      ? "text-emerald-300"
                      : "text-emerald-400/60"
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    isNext ? "text-amber-200" : item.isFardhu ? "text-white" : "text-white/80"
                  }`}
                >
                  {item.name}
                </span>
              </div>

              {/* Arabic Name */}
              <span className="text-[11px] font-arabic opacity-75 mb-1">
                {item.arabicName}
              </span>

              {/* Prayer Time */}
              <span
                className={`text-sm sm:text-base font-mono font-black tracking-tight tabular-nums ${
                  isNext ? "text-amber-300 drop-shadow" : "text-white"
                }`}
              >
                {item.timeString}
              </span>

              {/* Fardhu Indicator Dot */}
              {item.isFardhu && !isNext && !isCurrent && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 mt-1"
                  title="Sholat Fardhu 5 Waktu"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Modals */}
      <KioskDisplayModal
        isOpen={isKioskOpen}
        onClose={() => setIsKioskOpen(false)}
        city={city}
        isPortraitMode={isPortraitMode}
      />

      <QiblaCompassModal
        isOpen={isQiblaOpen}
        onClose={() => setIsQiblaOpen(false)}
        city={city}
      />

      <DzikirModal
        isOpen={isDzikirOpen}
        onClose={() => setIsDzikirOpen(false)}
      />
    </div>
  );
}
