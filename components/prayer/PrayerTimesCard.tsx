"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Clock,
  Volume2,
  Bell,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { CityLocation } from "@/data/cities";
import {
  calculatePrayerTimes,
  DayPrayerSchedule,
  PrayerTimeItem,
} from "@/lib/prayerCalculations";
import { soundEngine } from "@/lib/audioAlert";
import { getStoredPreferences } from "@/lib/storage";

interface PrayerTimesCardProps {
  city: CityLocation;
  onOpenCitySelector: () => void;
}

export default function PrayerTimesCard({
  city,
  onOpenCitySelector,
}: PrayerTimesCardProps) {
  const [schedule, setSchedule] = useState<DayPrayerSchedule | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [hasNotificationPerm, setHasNotificationPerm] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setHasNotificationPerm(Notification.permission === "granted");
    }

    const updateTimes = () => {
      const now = new Date();
      startTransition(() => {
        setSchedule(calculatePrayerTimes(city, now));
        setCurrentTimeStr(
          now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [city]);

  if (!schedule) {
    return (
      <div className="w-full h-64 rounded-3xl bg-emerald-950/20 dark:bg-emerald-950/40 animate-pulse border border-emerald-900/10" />
    );
  }

  const handleTestSound = () => {
    const prefs = getStoredPreferences();
    if (prefs.audioTone === "gentle_chime") {
      soundEngine.playGentleChime(prefs.audioVolume);
    } else {
      soundEngine.playTakbirBeep(prefs.audioVolume);
    }
  };

  const handleEnableNotification = async () => {
    const granted = await soundEngine.requestNotificationPermission();
    setHasNotificationPerm(granted);
    if (granted) {
      soundEngine.sendNotification(
        "Pengingat Sholat Uswah.id Aktif",
        `Jadwal sholat otomatis aktif untuk wilayah ${city.name}.`
      );
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

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-[#073623] to-[#031d14] text-white p-5 sm:p-7 shadow-xl shadow-emerald-950/25 border border-emerald-700/30">
      {/* Decorative Atmospheric Radial Lights */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      {/* Top Bar: Location Switcher & Realtime Clock */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
        <button
          onClick={onOpenCitySelector}
          type="button"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md transition-all group cursor-pointer"
        >
          <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-105 transition-transform">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-200 transition-colors">
                {city.name}
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">({city.timezone})</span>
              <ChevronRight className="w-3 h-3 text-emerald-300 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[10px] text-emerald-200/70">{city.province} • Ganti Lokasi</p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-white tabular-nums drop-shadow-sm">
                {currentTimeStr}
              </p>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-medium">
              {schedule.dateString}
            </p>
          </div>
        </div>
      </div>

      {/* Countdown & Next Prayer Hero Section */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center mb-6 bg-black/25 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
        {/* Next Prayer Details */}
        <div className="md:col-span-7 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-[11px] font-semibold text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Waktu Sholat Berikutnya
            </span>
            <span className="text-[10px] text-emerald-300/80 hidden sm:inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Standar Kemenag RI (+2m)
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {schedule.nextPrayer?.name}
            </h2>
            <span className="text-xl sm:text-2xl font-serif text-emerald-300">
              {schedule.nextPrayer?.arabicName}
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-amber-300 tabular-nums">
              {schedule.nextPrayer?.timeString} <span className="text-xs font-normal text-amber-200">{city.timezone}</span>
            </span>
          </div>

          {/* Time Progress Bar */}
          <div className="pt-2 max-w-md">
            <div className="flex items-center justify-between text-[11px] text-emerald-200/80 mb-1">
              <span>Fase waktu berjalan</span>
              <span className="font-mono font-semibold text-amber-300">{schedule.progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 transition-all duration-1000"
                style={{ width: `${Math.min(100, Math.max(5, schedule.progressPercent))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Compact Countdown Timers & Controls */}
        <div className="md:col-span-5 flex flex-col items-start md:items-end justify-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/90 mb-1.5">
            Sisa Waktu Menuju {schedule.nextPrayer?.name}
          </p>

          <div className="flex items-center gap-1.5 font-mono">
            {/* Hours */}
            <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm w-13 sm:w-15 h-13 sm:h-14 rounded-xl border border-white/15 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
                {String(schedule.timeToNext.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-300 mt-1">Jam</span>
            </div>

            <span className="text-xl font-bold text-emerald-400/80">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm w-13 sm:w-15 h-13 sm:h-14 rounded-xl border border-white/15 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
                {String(schedule.timeToNext.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-300 mt-1">Mnt</span>
            </div>

            <span className="text-xl font-bold text-emerald-400/80">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm w-13 sm:w-15 h-13 sm:h-14 rounded-xl border border-white/15 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums leading-none">
                {String(schedule.timeToNext.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-amber-200 mt-1">Dtk</span>
            </div>
          </div>

          {/* Quick Sound & Notification buttons */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={handleTestSound}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10 transition-colors"
            >
              <Volume2 className="w-3 h-3 text-amber-300" />
              <span>Tes Suara</span>
            </button>

            {!hasNotificationPerm && (
              <button
                onClick={handleEnableNotification}
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border border-amber-400/40 transition-colors"
              >
                <Bell className="w-3 h-3" />
                <span>Nyalakan Notifikasi</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 8 Prayer Slots Grid (Compact & Informative) */}
      <div className="relative z-10 grid grid-cols-4 sm:grid-cols-8 gap-2">
        {schedule.items.map((item) => {
          const isNext = schedule.nextPrayer?.id === item.id;
          const isCurrent = schedule.currentPrayer?.id === item.id;
          const Icon = getPrayerIcon(item.id);

          return (
            <div
              key={item.id}
              className={`relative flex flex-col items-center justify-center py-2.5 px-1.5 sm:px-2 rounded-2xl transition-all ${
                isNext
                  ? "bg-gradient-to-b from-amber-400/25 to-amber-500/10 border-2 border-amber-400 text-white shadow-lg shadow-amber-500/20 scale-[1.02] ring-2 ring-amber-400/20"
                  : isCurrent
                  ? "bg-emerald-700/60 border border-emerald-400/50 text-emerald-50"
                  : "bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-100/90"
              }`}
            >
              {/* Badge "Berikutnya" or "Fardhu" */}
              {isNext ? (
                <span className="absolute -top-2.5 px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase bg-amber-400 text-slate-950 rounded-full shadow-xs">
                  Berikutnya
                </span>
              ) : isCurrent ? (
                <span className="absolute -top-2 px-1.5 py-0.2 text-[8px] font-bold tracking-wider uppercase bg-emerald-500 text-white rounded-full">
                  Saat ini
                </span>
              ) : null}

              <div className="flex items-center gap-1 mb-0.5">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isNext ? "text-amber-300" : isCurrent ? "text-emerald-300" : "text-emerald-300/70"
                  }`}
                />
                <span className="text-[11px] sm:text-xs font-semibold">{item.name}</span>
              </div>

              <span className="text-[9px] font-serif opacity-70 mb-0.5">{item.arabicName}</span>

              <span
                className={`text-sm sm:text-base font-mono font-bold tracking-tight tabular-nums ${
                  isNext ? "text-amber-300 drop-shadow" : "text-white"
                }`}
              >
                {item.timeString}
              </span>

              {/* Fardhu Indicator Dot */}
              {item.isFardhu && !isNext && !isCurrent && (
                <span className="w-1 h-1 rounded-full bg-emerald-400/60 mt-0.5" title="Sholat Fardhu" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
