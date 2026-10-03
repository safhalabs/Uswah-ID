"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Navigation, X, Check, Globe } from "lucide-react";
import { CityLocation, INDONESIAN_CITIES } from "@/data/cities";

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
}

const REGION_TABS = [
  { id: "all", label: "Semua Wilayah" },
  { id: "jabar", label: "Jawa Barat", provinces: ["Jawa Barat"] },
  { id: "jabodetabek", label: "Jabodetabek & Banten", provinces: ["DKI Jakarta", "Banten"] },
  { id: "jateng", label: "Jateng & DIY", provinces: ["Jawa Tengah", "DI Yogyakarta"] },
  { id: "jatim", label: "Jawa Timur & Bali", provinces: ["Jawa Timur", "Bali"] },
  { id: "sumatera", label: "Sumatera", provinces: ["Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Bengkulu", "Sumatera Selatan", "Bangka Belitung", "Lampung"] },
  { id: "kalimantan_timur", label: "Luar Jawa / Timur", provinces: ["Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Tenggara", "Sulawesi Selatan", "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Barat Daya", "Papua Selatan", "Papua Pegunungan", "Papua Tengah"] },
];

export default function CitySelectorModal({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
}: CitySelectorModalProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const filteredCities = useMemo(() => {
    return INDONESIAN_CITIES.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.province.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "all") return true;

      const tabConfig = REGION_TABS.find((t) => t.id === activeTab);
      if (tabConfig && tabConfig.provinces) {
        return tabConfig.provinces.includes(c.province);
      }

      return true;
    });
  }, [search, activeTab]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#091812] w-full max-w-lg rounded-3xl shadow-2xl border border-emerald-900/10 dark:border-emerald-500/20 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-emerald-950/80 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-transparent dark:from-emerald-950/40 dark:via-[#091812] dark:to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <span>Pilih Kota &amp; Lokasi</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  {INDONESIAN_CITIES.length} Kota
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Waktu sholat dihitung presisi standar Kemenag RI (+2 menit ihtiyat)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & GPS Controls */}
        <div className="p-3 sm:p-4 space-y-2.5 bg-slate-50/70 dark:bg-[#07130e]/70 border-b border-slate-100 dark:border-emerald-950/80">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Ketik nama kota (misal: Subang, Bandung, dsb)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-white dark:bg-[#0a1b14] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={handleUseGps}
              disabled={gpsLoading}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all disabled:opacity-50 shrink-0"
              title="Gunakan GPS Perangkat"
            >
              <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{gpsLoading ? "Mendeteksi..." : "GPS"}</span>
            </button>
          </div>

          {gpsError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 p-2 rounded-xl">
              {gpsError}
            </p>
          )}

          {/* Quick Region Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {REGION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white dark:bg-[#0c1f18] text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-emerald-900/60 hover:border-emerald-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current City Banner */}
        <div className="px-4 py-2 bg-emerald-50/60 dark:bg-emerald-950/20 border-b border-emerald-900/10 dark:border-emerald-900/40 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            Lokasi aktif saat ini:
          </span>
          <span className="font-bold text-emerald-800 dark:text-emerald-300">
            {currentCity.name}, {currentCity.province}
          </span>
        </div>

        {/* City List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-emerald-950/40 flex-1">
          {filteredCities.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">
                Kota &quot;{search}&quot; tidak ditemukan.
              </p>
              <p>Coba gunakan tombol GPS atau periksa ejaan nama kota.</p>
            </div>
          ) : (
            filteredCities.map((city) => {
              const isSelected =
                currentCity.id === city.id ||
                currentCity.name.toLowerCase() === city.name.toLowerCase();

              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-left transition-all ${
                    isSelected
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500/30"
                      : "hover:bg-slate-50 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-[#0c1f18] text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-semibold">{city.name}</p>
                        {city.province === "Jawa Barat" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/50 font-normal">
                            Jabar
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        {city.province} • {city.timezone} (UTC+{city.utcOffset})
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Aktif</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 group-hover:text-emerald-600 transition-colors">
                      Pilih
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-[#07130e] border-t border-slate-100 dark:border-emerald-950/80 text-center text-[11px] text-slate-400">
          Menampilkan {filteredCities.length} dari total {INDONESIAN_CITIES.length} kota &amp; kabupaten
        </div>
      </div>
    </div>
  );
}
