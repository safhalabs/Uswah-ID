"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import PrayerTimesCard from "@/components/prayer/PrayerTimesCard";
import FastingCard from "@/components/fasting/FastingCard";
import MonthGuidanceCard from "@/components/sunnah/MonthGuidanceCard";
import CitySelectorModal from "@/components/prayer/CitySelectorModal";
import { CityLocation, DEFAULT_CITY } from "@/data/cities";
import { getStoredPreferences, saveStoredPreferences } from "@/lib/storage";
import Link from "next/link";
import { Calendar, Clock, BookOpen, Heart, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_CITY);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  useEffect(() => {
    const prefs = getStoredPreferences();
    if (prefs.city) {
      setCurrentCity(prefs.city);
    }
  }, []);

  const handleSelectCity = (city: CityLocation) => {
    setCurrentCity(city);
    saveStoredPreferences({ city });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        currentCity={currentCity}
        onOpenCitySelector={() => setIsCityModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Hero Section: Jadwal Sholat Aktif & Live Countdown */}
        <section>
          <PrayerTimesCard
            city={currentCity}
            onOpenCitySelector={() => setIsCityModalOpen(true)}
          />
        </section>

        {/* 2-Column Section: Pengingat Puasa & Quick Nav */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FastingCard />
          </div>

          {/* Quick Access Card */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 shadow-sm border border-emerald-800/40 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold mb-3">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>Uswah.id</span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                Meneladani Akhlak & Ibadah Rasulullah
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Setiap bulan dalam kalender Hijriah menyimpan jejak sejarah agung dan sunnah mulia yang dapat kita amalkan dalam kehidupan sehari-hari.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <Link
                href="/kalender-hijriah"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-300" />
                  <span>Buka Kalender Hijriah Lengkap</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </Link>

              <Link
                href="/jadwal-sholat"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-300" />
                  <span>Jadwal Sholat 1 Bulan Penuh</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section: Meneladani Rasulullah SAW di Bulan Ini */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>Meneladani Rasulullah SAW Bulan Ini</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Amalan sunnah berdalil hadits shahih & napak tilas sirah nabawiyah
            </p>
          </div>
          <MonthGuidanceCard />
        </section>
      </main>

      <Footer />
      <BottomNav />

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
      />
    </div>
  );
}
