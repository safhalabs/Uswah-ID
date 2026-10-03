"use client";

import { useState } from "react";
import { Search, MapPin, Navigation, X, Check } from "lucide-react";
import { CityLocation, INDONESIAN_CITIES } from "@/data/cities";

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
}

export default function CitySelectorModal({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
}: CitySelectorModalProps) {
  const [search, setSearch] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCities = INDONESIAN_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.province.toLowerCase().includes(search.toLowerCase())
  );

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsError("Browser Anda tidak mendukung fitur Geolocation GPS.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const { latitude, longitude } = pos.coords;

        // Cari kota terdekat dari database
        let closest = INDONESIAN_CITIES[0];
        let minDistance = Infinity;

        for (const city of INDONESIAN_CITIES) {
          const d = Math.hypot(city.latitude - latitude, city.longitude - longitude);
          if (d < minDistance) {
            minDistance = d;
            closest = city;
          }
        }

        // Buat objek kota kustom dengan koordinat presisi user
        const customGpsCity: CityLocation = {
          id: `gps_${closest.id}`,
          name: `${closest.name} (GPS Otomatis)`,
          province: closest.province,
          latitude,
          longitude,
          timezone: closest.timezone,
          utcOffset: closest.utcOffset,
        };

        onSelectCity(customGpsCity);
        onClose();
      },
      (err) => {
        setGpsLoading(false);
        setGpsError("Izin lokasi ditolak atau tidak dapat mendeteksi GPS.");
        console.error(err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0b1c15] w-full max-w-lg rounded-2xl shadow-2xl border border-emerald-900/10 dark:border-emerald-500/20 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-emerald-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Pilih Kota Lokasi Anda
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Waktu sholat dihitung berdasarkan koordinat geografis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Button & Search */}
        <div className="p-4 space-y-3 bg-slate-50/50 dark:bg-[#07130e]/40 border-b border-slate-100 dark:border-emerald-950/80">
          <button
            onClick={handleUseGps}
            disabled={gpsLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${gpsLoading ? "animate-spin" : ""}`} />
            <span>{gpsLoading ? "Mendeteksi Lokasi GPS..." : "Gunakan Lokasi Saat Ini (GPS)"}</span>
          </button>

          {gpsError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg">
              {gpsError}
            </p>
          )}

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama kota atau provinsi (cth: Surabaya, Padang)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-white dark:bg-[#0a1812] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* City List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-emerald-950/50 flex-1">
          {filteredCities.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              Tidak ditemukan kota yang cocok dengan kata kunci &quot;{search}&quot;.
            </div>
          ) : (
            filteredCities.map((city) => {
              const isSelected = currentCity.id === city.id || currentCity.name.includes(city.name);
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                    isSelected
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200 font-semibold"
                      : "hover:bg-slate-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{city.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {city.province} • {city.timezone} (UTC+{city.utcOffset})
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
