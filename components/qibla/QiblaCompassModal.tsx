"use client";

import { useState, useEffect } from "react";
import { CityLocation } from "@/data/cities";
import { calculateQiblaDirection, QiblaResult, KAABA_COORDINATES } from "@/lib/qiblaCalculations";
import {
  Compass,
  X,
  MapPin,
  Navigation,
  Sparkles,
  Info,
  Smartphone,
  RotateCw,
} from "lucide-react";

interface QiblaCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityLocation;
}

export default function QiblaCompassModal({
  isOpen,
  onClose,
  city,
}: QiblaCompassModalProps) {
  const [qiblaInfo, setQiblaInfo] = useState<QiblaResult | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [sensorPermission, setSensorPermission] = useState<"default" | "granted" | "denied">("default");
  const [hasSensorSupport, setHasSensorSupport] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const result = calculateQiblaDirection(city.latitude, city.longitude);
    setQiblaInfo(result);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Check device orientation support
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      setHasSensorSupport(true);

      const handleOrientation = (e: DeviceOrientationEvent) => {
        let heading: number | null = null;
        // iOS Safari webkitCompassHeading
        if ("webkitCompassHeading" in e && typeof (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading === "number") {
          heading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
        } else if (e.alpha !== null) {
          // Android absolute orientation fallback
          heading = (360 - e.alpha) % 360;
        }

        if (heading !== null) {
          setDeviceHeading(Math.round(heading));
        }
      };

      // Only add listener directly if not requiring iOS permission prompt
      if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission !== "function") {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("deviceorientation", handleOrientation, true);
      };
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, city, onClose]);

  const requestIosSensorPermission = async () => {
    const DeviceOrientation = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    if (typeof DeviceOrientation.requestPermission === "function") {
      try {
        const res = await DeviceOrientation.requestPermission();
        setSensorPermission(res);
        if (res === "granted") {
          window.addEventListener(
            "deviceorientation",
            (e) => {
              if ("webkitCompassHeading" in e) {
                setDeviceHeading(
                  Math.round((e as unknown as { webkitCompassHeading: number }).webkitCompassHeading)
                );
              }
            },
            true
          );
        }
      } catch (err) {
        console.error(err);
        setSensorPermission("denied");
      }
    }
  };

  if (!isOpen || !qiblaInfo) return null;

  // Bearing angle from user's current device heading
  // If deviceHeading is available, needle rotates dynamically
  const needleRotation = deviceHeading !== null ? qiblaInfo.bearingDegrees - deviceHeading : qiblaInfo.bearingDegrees;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#071911] border border-emerald-900/10 dark:border-emerald-500/20 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-emerald-950/60 bg-gradient-to-r from-emerald-500/10 via-emerald-600/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                Kompas Arah Kiblat
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Derajat azimuth presisi menuju Ka&apos;bah Makkah
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-center">
          {/* Location & Bearing Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-2 text-left">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">{city.name}</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-black font-mono text-emerald-700 dark:text-emerald-300">
                {qiblaInfo.bearingDegrees}°
              </span>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">
                {qiblaInfo.bearingCardinal}
              </p>
            </div>
          </div>

          {/* Compass Dial Graphic */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Outer Compass Rose */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-emerald-950/80 bg-gradient-to-b from-slate-50 to-white dark:from-[#06170f] dark:to-[#04100a] shadow-inner flex items-center justify-center">
              {/* Degree tick graduation marks */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-full py-1.5 flex flex-col justify-between items-center"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                >
                  <span className={`w-0.5 ${i % 3 === 0 ? "h-3 bg-emerald-500" : "h-1.5 bg-slate-300 dark:bg-emerald-800"}`} />
                  <span className={`w-0.5 ${i % 3 === 0 ? "h-3 bg-emerald-500" : "h-1.5 bg-slate-300 dark:bg-emerald-800"}`} />
                </div>
              ))}

              {/* Cardinal Labels */}
              <span className="absolute top-3 font-mono font-black text-xs text-rose-500">U (0°)</span>
              <span className="absolute bottom-3 font-mono font-bold text-xs text-slate-400">S (180°)</span>
              <span className="absolute right-3 font-mono font-bold text-xs text-slate-400">T (90°)</span>
              <span className="absolute left-3 font-mono font-bold text-xs text-slate-400">B (270°)</span>
            </div>

            {/* Rotating Qibla Needle Pointer */}
            <div
              className="relative w-44 h-44 transition-transform duration-300 ease-out flex items-center justify-center"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              {/* Kaaba Marker at Tip */}
              <div className="absolute top-0 flex flex-col items-center -translate-y-2 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-md font-bold text-[10px] border border-amber-300">
                  🕋
                </div>
                <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider mt-0.5">
                  Kiblat
                </span>
              </div>

              {/* Needle Bar */}
              <div className="w-1.5 h-28 bg-gradient-to-t from-emerald-500 via-amber-400 to-amber-500 rounded-full shadow-md" />

              {/* Center Pivot Pivot */}
              <div className="absolute w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 shadow-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
            </div>
          </div>

          {/* Distance Info */}
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-black/30 border border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Jarak ke Ka&apos;bah Makkah:</span>
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              {qiblaInfo.distanceKm.toLocaleString("id-ID")} km
            </span>
          </div>

          {/* Sensor button for iOS */}
          {hasSensorSupport && typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === "function" && sensorPermission !== "granted" && (
            <button
              onClick={requestIosSensorPermission}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Izinkan Sensor Kompas Ponsel (iOS)</span>
            </button>
          )}

          {/* Guideline */}
          <div className="text-left p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/20 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Info className="w-3 h-3 text-emerald-600" />
              Petunjuk Menentukan Arah Kiblat:
            </p>
            <p>1. Sejajarkan bagian atas perangkat Anda dengan arah ikon Ka&apos;bah 🕋 emas.</p>
            <p>2. Letakkan ponsel di permukaan datar dan jauhkan dari medan magnet/logam untuk akurasi maksimal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
