import { Coordinates, CalculationParameters, PrayerTimes, Madhab } from "adhan";
import { CityLocation } from "@/data/cities";

export interface PrayerTimeItem {
  id: "imsak" | "fajr" | "sunrise" | "dhuha" | "dhuhr" | "asr" | "maghrib" | "isha";
  name: string;
  arabicName: string;
  timeString: string;
  date: Date;
  isFardhu: boolean;
}

export interface DayPrayerSchedule {
  date: Date;
  dateString: string;
  city: CityLocation;
  items: PrayerTimeItem[];
  currentPrayer: PrayerTimeItem | null;
  nextPrayer: PrayerTimeItem | null;
  timeToNext: {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  };
  progressPercent: number; // 0 - 100% dari waktu sholat saat ini ke sholat berikutnya
}

export function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function calculatePrayerTimes(
  city: CityLocation,
  date: Date = new Date(),
  ihtiyatMinutes: number = 2 // Standar Kemenag RI (+2 menit)
): DayPrayerSchedule {
  const coords = new Coordinates(city.latitude, city.longitude);
  
  // Standar Kemenag RI: Subuh 20°, Isya 18°, Syafi'i
  const params = new CalculationParameters("Other", 20, 18);
  params.madhab = Madhab.Shafi;

  const pt = new PrayerTimes(coords, date, params);

  // Tambahkan Ihtiyat standar Kemenag RI (+2 menit untuk sholat fardhu)
  const addMinutes = (d: Date, mins: number) => new Date(d.getTime() + mins * 60000);

  const fajr = addMinutes(pt.fajr, ihtiyatMinutes);
  const sunrise = pt.sunrise;
  const dhuhr = addMinutes(pt.dhuhr, ihtiyatMinutes);
  const asr = addMinutes(pt.asr, ihtiyatMinutes);
  const maghrib = addMinutes(pt.maghrib, ihtiyatMinutes);
  const isha = addMinutes(pt.isha, ihtiyatMinutes);

  // Imsak = 10 menit sebelum Subuh
  const imsak = new Date(fajr.getTime() - 10 * 60000);

  // Dhuha = ~20 menit setelah Syuruq (Terbit matahari setinggi satu tombak / ~4.5°)
  const dhuha = new Date(sunrise.getTime() + 20 * 60000);

  const items: PrayerTimeItem[] = [
    { id: "imsak", name: "Imsak", arabicName: "الإمساك", timeString: formatTime(imsak), date: imsak, isFardhu: false },
    { id: "fajr", name: "Subuh", arabicName: "الفجر", timeString: formatTime(fajr), date: fajr, isFardhu: true },
    { id: "sunrise", name: "Terbit", arabicName: "الشروق", timeString: formatTime(sunrise), date: sunrise, isFardhu: false },
    { id: "dhuha", name: "Dhuha", arabicName: "الضحى", timeString: formatTime(dhuha), date: dhuha, isFardhu: false },
    { id: "dhuhr", name: "Dzuhur", arabicName: "الظهر", timeString: formatTime(dhuhr), date: dhuhr, isFardhu: true },
    { id: "asr", name: "Ashar", arabicName: "العصر", timeString: formatTime(asr), date: asr, isFardhu: true },
    { id: "maghrib", name: "Maghrib", arabicName: "المغرب", timeString: formatTime(maghrib), date: maghrib, isFardhu: true },
    { id: "isha", name: "Isya", arabicName: "العشاء", timeString: formatTime(isha), date: isha, isFardhu: true },
  ];

  // Hitung sholat fardhu berikutnya & progress
  const fardhuOnly = items.filter((i) => i.isFardhu);
  const now = date.getTime();

  let currentPrayer: PrayerTimeItem | null = null;
  let nextPrayer: PrayerTimeItem | null = null;
  let prevPrayerDate = fajr;
  let nextPrayerDate = fajr;

  for (let i = 0; i < fardhuOnly.length; i++) {
    const cur = fardhuOnly[i];
    const nxt = fardhuOnly[(i + 1) % fardhuOnly.length];

    if (now >= cur.date.getTime() && (i === fardhuOnly.length - 1 || now < nxt.date.getTime())) {
      currentPrayer = cur;
      if (i === fardhuOnly.length - 1) {
        // Setelah Isya -> Next adalah Subuh esok hari
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowPT = new PrayerTimes(coords, tomorrow, params);
        nextPrayer = { ...fardhuOnly[0], date: addMinutes(tomorrowPT.fajr, ihtiyatMinutes) };
        prevPrayerDate = cur.date;
        nextPrayerDate = nextPrayer.date;
      } else {
        nextPrayer = nxt;
        prevPrayerDate = cur.date;
        nextPrayerDate = nxt.date;
      }
      break;
    }
  }

  // Jika sebelum Subuh hari ini -> Next adalah Subuh hari ini
  if (!currentPrayer && now < fajr.getTime()) {
    nextPrayer = fardhuOnly[0];
    // Current dianggap Isya kemarin
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayPT = new PrayerTimes(coords, yesterday, params);
    prevPrayerDate = addMinutes(yesterdayPT.isha, ihtiyatMinutes);
    nextPrayerDate = fajr;
    currentPrayer = fardhuOnly[fardhuOnly.length - 1]; // Isya kemarin
  }

  // Jika masih belum terdeteksi (fallback)
  if (!nextPrayer) {
    nextPrayer = fardhuOnly[0];
    nextPrayerDate = fajr;
  }

  const diffMs = Math.max(0, nextPrayerDate.getTime() - now);
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Persentase berjalannya waktu antara sholat sebelumnya ke sholat berikutnya
  const totalDuration = nextPrayerDate.getTime() - prevPrayerDate.getTime();
  const elapsed = now - prevPrayerDate.getTime();
  const progressPercent = totalDuration > 0 ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)) : 0;

  return {
    date,
    dateString: date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    city,
    items,
    currentPrayer,
    nextPrayer,
    timeToNext: {
      hours,
      minutes,
      seconds,
      totalSeconds,
    },
    progressPercent: Math.round(progressPercent),
  };
}

/**
 * Menghasilkan jadwal sholat untuk 1 bulan penuh
 */
export function getMonthlyPrayerTimes(
  city: CityLocation,
  year: number,
  monthIndex: number // 0 = Jan, 11 = Des
): DayPrayerSchedule[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const schedule: DayPrayerSchedule[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day, 12, 0, 0);
    schedule.push(calculatePrayerTimes(city, d));
  }

  return schedule;
}
