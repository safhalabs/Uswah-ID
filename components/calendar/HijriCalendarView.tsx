"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sliders,
  Heart,
  AlertTriangle,
  X,
} from "lucide-react";
import { CityLocation } from "@/data/cities";
import { getHijriDate, HijriDate } from "@/lib/hijriConverter";
import { calculatePrayerTimes, DayPrayerSchedule } from "@/lib/prayerCalculations";
import { getStoredPreferences, saveStoredPreferences } from "@/lib/storage";

interface HijriCalendarViewProps {
  currentCity: CityLocation;
}

export default function HijriCalendarView({ currentCity }: HijriCalendarViewProps) {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(new Date().getMonth());
  const [hijriAdjustment, setHijriAdjustment] = useState<number>(0);
  const [selectedDaySchedule, setSelectedDaySchedule] = useState<{
    date: Date;
    hijri: HijriDate;
    prayer: DayPrayerSchedule;
  } | null>(null);

  useEffect(() => {
    const prefs = getStoredPreferences();
    setHijriAdjustment(prefs.hijriAdjustment);
  }, []);

  const handleAdjustmentChange = (offset: number) => {
    setHijriAdjustment(offset);
    saveStoredPreferences({ hijriAdjustment: offset });
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  // Hitung jumlah hari dalam bulan masehi
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Minggu

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // Dapatkan bulan Hijriah di tengah-tengah bulan Masehi ini untuk judul
  const midMonthDate = new Date(currentYear, currentMonthIndex, 15);
  const midHijri = getHijriDate(midMonthDate, hijriAdjustment);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0c1f18] p-6 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-emerald-950/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-baseline gap-2">
            <span>{monthNames[currentMonthIndex]} {currentYear}</span>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              ({midHijri.monthName} {midHijri.year} H)
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penanggalan Masehi & Kalender Hijriah Umm al-Qura
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Hijri Adjustment selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/70 p-1 rounded-xl text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <span className="text-[11px] text-slate-500 pr-1 hidden sm:inline">Hilal:</span>
            {[-1, 0, 1].map((offset) => (
              <button
                key={offset}
                onClick={() => handleAdjustmentChange(offset)}
                className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                  hijriAdjustment === offset
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
                title={`Koreksi hilal ${offset > 0 ? `+${offset}` : offset} hari`}
              >
                {offset > 0 ? `+${offset}` : offset}
              </button>
            ))}
          </div>

          {/* Month Steppers */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mb-4 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Puasa Ayyamul Bidh
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Puasa Senin / Kamis
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          Hari Diharamkan Puasa (Tasyrik / Raya)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          Puasa Khusus (Arafah / Syawal)
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Day Header */}
        {daysOfWeek.map((day, idx) => (
          <div
            key={day}
            className={`py-2 text-center text-xs font-bold uppercase tracking-wider ${
              idx === 0
                ? "text-rose-600 dark:text-rose-400"
                : idx === 5
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {day}
          </div>
        ))}

        {/* Empty cells before month start */}
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-2xl bg-transparent" />
        ))}

        {/* Day Cells */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNumber = idx + 1;
          const targetDate = new Date(currentYear, currentMonthIndex, dayNumber);
          const hijri = getHijriDate(targetDate, hijriAdjustment);

          const isToday =
            new Date().getDate() === dayNumber &&
            new Date().getMonth() === currentMonthIndex &&
            new Date().getFullYear() === currentYear;

          const isSunday = targetDate.getDay() === 0;
          const isFriday = targetDate.getDay() === 5;
          const hasFasting = hijri.fastings.length > 0;
          const isForbidden = hijri.isForbiddenToFast;

          return (
            <button
              key={`day-${dayNumber}`}
              onClick={() => {
                const prayer = calculatePrayerTimes(currentCity, targetDate);
                setSelectedDaySchedule({ date: targetDate, hijri, prayer });
              }}
              type="button"
              className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-2xl text-left border flex flex-col justify-between transition-all group ${
                isToday
                  ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30"
                  : isForbidden
                  ? "border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/10 hover:border-rose-400"
                  : hasFasting
                  ? "border-amber-200/80 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-400"
                  : "border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20 hover:border-emerald-300 dark:hover:border-emerald-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-sm sm:text-base font-bold ${
                    isToday
                      ? "text-emerald-700 dark:text-emerald-300"
                      : isSunday
                      ? "text-rose-600 dark:text-rose-400"
                      : isFriday
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {dayNumber}
                </span>

                {/* Hijri Day Number */}
                <span
                  className={`text-[10px] sm:text-xs font-mono font-medium ${
                    isToday
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {hijri.day}
                </span>
              </div>

              {/* Status Tags / Dots */}
              <div className="flex flex-col gap-0.5 w-full">
                {isForbidden && (
                  <span className="text-[9px] font-bold text-rose-700 dark:text-rose-300 truncate leading-tight">
                    Haram Puasa
                  </span>
                )}
                {!isForbidden && hijri.isAyyamulBidh && (
                  <span className="text-[9px] font-semibold text-amber-700 dark:text-amber-300 truncate leading-tight">
                    Ayyamul Bidh
                  </span>
                )}
                {!isForbidden && (targetDate.getDay() === 1 || targetDate.getDay() === 4) && (
                  <span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 truncate leading-tight hidden sm:block">
                    {targetDate.getDay() === 1 ? "Senin" : "Kamis"}
                  </span>
                )}
                {hijri.specialEvent && (
                  <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 truncate leading-tight">
                    ★ {hijri.specialEvent}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal Detail Hari yang Diklik */}
      {selectedDaySchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0c1f18] w-full max-w-lg rounded-3xl shadow-2xl border border-emerald-900/10 dark:border-emerald-500/20 overflow-hidden">
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-100 dark:border-emerald-950/80 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {selectedDaySchedule.prayer.dateString}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {selectedDaySchedule.hijri.formatted}
                </p>
              </div>
              <button
                onClick={() => setSelectedDaySchedule(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6 space-y-5">
              {/* Puasa & Event */}
              {selectedDaySchedule.hijri.isForbiddenToFast ? (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{selectedDaySchedule.hijri.forbiddenReason}</span>
                </div>
              ) : selectedDaySchedule.hijri.fastings.length > 0 ? (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Disunnahkan Berpuasa: </span>
                    {selectedDaySchedule.hijri.fastings.map((f) => f.name).join(", ")}
                  </div>
                </div>
              ) : null}

              {/* Jadwal Sholat Hari Ini */}
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Waktu Sholat ({currentCity.name})
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {selectedDaySchedule.prayer.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-center"
                    >
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.name}</p>
                      <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100">
                        {item.timeString}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-emerald-950/80 bg-slate-50/50 dark:bg-emerald-950/20 text-right">
              <button
                onClick={() => setSelectedDaySchedule(null)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
