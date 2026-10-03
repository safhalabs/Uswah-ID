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
    // Periksa izin notifikasi
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
      <div className="w-full h-72 rounded-3xl bg-slate-100 dark:bg-[#0c1e17] animate-pulse" />
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
        "Anda akan menerima pemberitahuan otomatis saat waktu sholat tiba."
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-[#042417] text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/20 border border-emerald-700/30">
      {/* Decorative Islamic Star Pattern Overlay */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      {/* Top Bar: Current Time & Location */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-emerald-700/40">
        <button
          onClick={onOpenCitySelector}
          type="button"
          className="flex items-center gap-2 group text-left cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-emerald-700/60 group-hover:bg-emerald-600 transition-colors">
            <MapPin className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white group-hover:text-emerald-200 transition-colors">
                {city.name}
              </span>
              <span className="text-xs text-emerald-300">({city.timezone})</span>
            </div>
            <p className="text-xs text-emerald-200/70">{city.province} • Ganti Lokasi</p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-mono font-bold tracking-tight text-white drop-shadow-sm">
              {currentTimeStr}
            </p>
            <p className="text-xs text-emerald-200/80">{schedule.dateString}</p>
          </div>
        </div>
      </div>

      {/* Next Prayer Countdown Hero */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/50 border border-emerald-600/40 text-xs font-medium text-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Menuju Waktu Sholat Berikutnya</span>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {schedule.nextPrayer?.name}
            </h2>
            <span className="text-xl sm:text-2xl font-serif text-emerald-300">
              {schedule.nextPrayer?.arabicName}
            </span>
            <span className="text-lg font-mono font-semibold text-amber-300">
              {schedule.nextPrayer?.timeString}
            </span>
          </div>

          <p className="text-xs text-emerald-200/80 mt-1">
            Standar Bimas Islam Kemenag RI (+2 menit waktu ihtiyat)
          </p>
        </div>

        {/* Big Countdown Timer */}
        <div className="flex flex-col items-start md:items-end">
          <div className="flex items-center gap-2 font-mono">
            <div className="flex flex-col items-center bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-inner">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {String(schedule.timeToNext.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-300">Jam</span>
            </div>
            <span className="text-2xl font-bold text-emerald-400">:</span>
            <div className="flex flex-col items-center bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-inner">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {String(schedule.timeToNext.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-300">Menit</span>
            </div>
            <span className="text-2xl font-bold text-emerald-400">:</span>
            <div className="flex flex-col items-center bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-inner">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {String(schedule.timeToNext.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-300">Detik</span>
            </div>
          </div>

          {/* Quick Sound & Notification buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleTestSound}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-emerald-100 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Tes Nada Pengingat</span>
            </button>

            {!hasNotificationPerm && (
              <button
                onClick={handleEnableNotification}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Aktifkan Notifikasi</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {schedule.items.map((item) => {
          const isNext = schedule.nextPrayer?.id === item.id;
          const isCurrent = schedule.currentPrayer?.id === item.id;
          const Icon = getPrayerIcon(item.id);

          return (
            <div
              key={item.id}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                isNext
                  ? "bg-gradient-to-b from-amber-400/25 to-amber-500/10 border-2 border-amber-400 text-white shadow-lg shadow-amber-500/20 scale-[1.02]"
                  : isCurrent
                  ? "bg-emerald-700/60 border border-emerald-400/40 text-emerald-100"
                  : "bg-black/20 hover:bg-black/30 border border-white/5 text-emerald-100/90"
              }`}
            >
              {isNext && (
                <span className="absolute -top-2.5 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-amber-400 text-amber-950 rounded-full shadow-sm">
                  Berikutnya
                </span>
              )}

              <div className="flex items-center gap-1 mb-1">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isNext ? "text-amber-300" : "text-emerald-300/80"
                  }`}
                />
                <span className="text-xs font-semibold">{item.name}</span>
              </div>

              <span className="text-[11px] font-serif opacity-70 mb-1">{item.arabicName}</span>

              <span
                className={`text-lg font-mono font-bold tracking-tight ${
                  isNext ? "text-amber-300 drop-shadow" : "text-white"
                }`}
              >
                {item.timeString}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
