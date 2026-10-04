import { CityLocation } from "@/data/cities";
import { DayPrayerSchedule, calculatePrayerTimes, formatTime } from "./prayerCalculations";

export interface SunnahPrayerPhase {
  name: string;
  arabicName: string;
  timeRange: string;
  startTime: Date;
  endTime: Date;
  keutamaan: string;
  dalil: string;
  isAfzal?: boolean;
}

export interface DhuhaScheduleInfo {
  startTime: Date;
  startTimeString: string;
  endTime: Date;
  endTimeString: string;
  phases: {
    isyraq: SunnahPrayerPhase;
    pertengahan: SunnahPrayerPhase;
    awwabin: SunnahPrayerPhase;
  };
  isActive: boolean;
  isUrgent: boolean; // < 30 menit sebelum batas akhir
  isPassed: boolean;
  minutesRemaining: number;
  currentPhase: "belum_masuk" | "isyraq" | "pertengahan" | "awwabin" | "urgent" | "selesai";
  phaseLabel: string;
  warningMessage?: string;
  syuruqGapText: string;
}

export interface TahajudScheduleInfo {
  nightStart: Date;
  nightEnd: Date;
  phases: {
    firstThird: SunnahPrayerPhase;
    secondThird: SunnahPrayerPhase;
    lastThird: SunnahPrayerPhase; // Paling Utama
  };
  isActive: boolean;
  isLastThird: boolean;
  isUrgent: boolean; // < 45 menit sebelum Subuh
  minutesRemaining: number;
  currentPhase: "siang" | "sepertiga_awal" | "sepertiga_kedua" | "sepertiga_akhir" | "urgent";
  phaseLabel: string;
  warningMessage?: string;
}

/**
 * Menghitung waktu sholat Dhuha dan fasenya secara astronomis
 */
export function calculateDhuhaSchedule(
  city: CityLocation,
  now: Date = new Date(),
  prayerSchedule?: DayPrayerSchedule
): DhuhaScheduleInfo {
  const sched = prayerSchedule || calculatePrayerTimes(city, now);

  const sunriseItem = sched.items.find((i) => i.id === "sunrise");
  const fajrItem = sched.items.find((i) => i.id === "fajr");
  const dhuhrItem = sched.items.find((i) => i.id === "dhuhr");

  const sunrise = sunriseItem ? new Date(sunriseItem.date) : new Date(now);
  const fajr = fajrItem ? new Date(fajrItem.date) : new Date(now);
  const dhuhr = dhuhrItem ? new Date(dhuhrItem.date) : new Date(now);

  // Waktu Awal Dhuha: ~15-20 menit setelah Syuruq (Matahari setinggi 1 tombak / ~4.5°)
  // Ini biasanya sekitar 1 jam - 1 jam 15 menit setelah waktu Subuh
  const dhuhaStart = new Date(sunrise.getTime() + 18 * 60000);

  // Batas Akhir Dhuha: ~15 menit sebelum Dzuhur (Sebelum waktu Istiwa / zawal)
  const dhuhaEnd = new Date(dhuhr.getTime() - 15 * 60000);

  // Fase 1: Dhuha Awal / Isyraq (~1 jam setelah start)
  const isyraqEnd = new Date(dhuhaStart.getTime() + 60 * 60000);

  // Fase 3: Shalatul Awwabin (Waktu Paling Utama Dhuha saat matahari panas menyengat)
  // Dimulai ~1.5 jam sebelum batas akhir Dhuha
  const awwabinStart = new Date(dhuhaEnd.getTime() - 90 * 60000);

  // Fase 2: Pertengahan (antara Isyraq s/d Awwabin)
  const pertengahanStart = isyraqEnd;
  const pertengahanEnd = awwabinStart;

  const nowMs = now.getTime();
  const isActive = nowMs >= dhuhaStart.getTime() && nowMs <= dhuhaEnd.getTime();
  const isPassed = nowMs > dhuhaEnd.getTime();
  const isUrgent = isActive && (dhuhaEnd.getTime() - nowMs <= 30 * 60000);

  const diffMs = isActive
    ? Math.max(0, dhuhaEnd.getTime() - nowMs)
    : nowMs < dhuhaStart.getTime()
    ? Math.max(0, dhuhaStart.getTime() - nowMs)
    : 0;
  const minutesRemaining = Math.round(diffMs / 60000);

  let currentPhase: DhuhaScheduleInfo["currentPhase"] = "belum_masuk";
  let phaseLabel = "Belum Masuk Waktu Dhuha";
  let warningMessage: string | undefined;

  if (isPassed) {
    currentPhase = "selesai";
    phaseLabel = "Waktu Dhuha Hari Ini Telah Berakhir";
  } else if (isActive) {
    if (isUrgent) {
      currentPhase = "urgent";
      phaseLabel = "Mendekati Batas Akhir Waktu Dhuha";
      warningMessage = `Perhatian! Waktu Sholat Dhuha akan segera berakhir dalam ${minutesRemaining} menit (sebelum waktu terlarang Istiwa). Segera tunaikan!`;
    } else if (nowMs >= awwabinStart.getTime()) {
      currentPhase = "awwabin";
      phaseLabel = "Waktu Utama / Paling Afzal (Shalatul Awwabin)";
    } else if (nowMs >= pertengahanStart.getTime()) {
      currentPhase = "pertengahan";
      phaseLabel = "Waktu Pertengahan Dhuha";
    } else {
      currentPhase = "isyraq";
      phaseLabel = "Waktu Awal Dhuha (Sholat Isyraq)";
    }
  } else {
    currentPhase = "belum_masuk";
    phaseLabel = `Menuju Waktu Dhuha (${minutesRemaining} menit lagi)`;
  }

  // Hitung selisih dari Subuh ke Dhuha (misal: ~1 jam setelah Subuh)
  const diffFromFajrMins = Math.round((dhuhaStart.getTime() - fajr.getTime()) / 60000);
  const hoursGap = Math.floor(diffFromFajrMins / 60);
  const minsGap = diffFromFajrMins % 60;
  const syuruqGapText = `${hoursGap > 0 ? `${hoursGap} jam ` : ""}${minsGap} menit setelah Subuh (18m setelah Syuruq)`;

  return {
    startTime: dhuhaStart,
    startTimeString: formatTime(dhuhaStart),
    endTime: dhuhaEnd,
    endTimeString: formatTime(dhuhaEnd),
    phases: {
      isyraq: {
        name: "Dhuha Awal (Sholat Isyraq)",
        arabicName: "صلاة الإشراق",
        timeRange: `${formatTime(dhuhaStart)} - ${formatTime(isyraqEnd)}`,
        startTime: dhuhaStart,
        endTime: isyraqEnd,
        keutamaan: "Pahala seperti menunaikan ibadah Haji dan Umrah dengan sempurna bagi yang berdzikir setelah Subuh.",
        dalil: "HR. Tirmidzi no. 586 (Hasan)",
      },
      pertengahan: {
        name: "Dhuha Pertengahan (Waktu Produktif)",
        arabicName: "ضحى الضحوة",
        timeRange: `${formatTime(pertengahanStart)} - ${formatTime(pertengahanEnd)}`,
        startTime: pertengahanStart,
        endTime: pertengahanEnd,
        keutamaan: "Sedekah harian bagi 360 persendian tubuh dan pembuka pintu kelapangan rezeki.",
        dalil: "HR. Muslim no. 720",
      },
      awwabin: {
        name: "Dhuha Utama (Shalatul Awwabin)",
        arabicName: "صلاة الأوابين",
        timeRange: `${formatTime(awwabinStart)} - ${formatTime(dhuhaEnd)}`,
        startTime: awwabinStart,
        endTime: dhuhaEnd,
        keutamaan: "Waktu paling utama ketika anak-anak unta merasakan panasnya pasir (matahari menyengat). Sholatnya orang-orang yang senantiasa bertaubat.",
        dalil: "HR. Muslim no. 748",
        isAfzal: true,
      },
    },
    isActive,
    isUrgent,
    isPassed,
    minutesRemaining,
    currentPhase,
    phaseLabel,
    warningMessage,
    syuruqGapText,
  };
}

/**
 * Menghitung waktu sholat Tahajud dan sepertiga malam
 */
export function calculateTahajudSchedule(
  city: CityLocation,
  now: Date = new Date(),
  prayerSchedule?: DayPrayerSchedule
): TahajudScheduleInfo {
  const sched = prayerSchedule || calculatePrayerTimes(city, now);

  const maghribItem = sched.items.find((i) => i.id === "maghrib");
  const ishaItem = sched.items.find((i) => i.id === "isha");
  const fajrItem = sched.items.find((i) => i.id === "fajr");

  const nowMs = now.getTime();

  let nightStart: Date;
  let nightEnd: Date;

  // Cek apakah sekarang di malam hari (setelah Maghrib hingga tengah malam)
  // atau dini hari (tengah malam hingga Subuh)
  // atau siang hari
  const maghribToday = maghribItem ? new Date(maghribItem.date) : new Date(now);
  const fajrToday = fajrItem ? new Date(fajrItem.date) : new Date(now);

  if (nowMs >= maghribToday.getTime()) {
    // Malam ini s/d Subuh esok hari
    nightStart = maghribToday;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowSched = calculatePrayerTimes(city, tomorrow);
    const tomorrowFajr = tomorrowSched.items.find((i) => i.id === "fajr");
    nightEnd = tomorrowFajr ? new Date(tomorrowFajr.date) : new Date(nowMs + 10 * 3600000);
  } else if (nowMs < fajrToday.getTime()) {
    // Dini hari ini (dari Maghrib kemarin s/d Subuh hari ini)
    nightEnd = fajrToday;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdaySched = calculatePrayerTimes(city, yesterday);
    const yesterdayMaghrib = yesterdaySched.items.find((i) => i.id === "maghrib");
    nightStart = yesterdayMaghrib ? new Date(yesterdayMaghrib.date) : new Date(nowMs - 10 * 3600000);
  } else {
    // Siang hari (proyeksikan untuk malam nanti: Maghrib hari ini s/d Subuh esok)
    nightStart = maghribToday;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowSched = calculatePrayerTimes(city, tomorrow);
    const tomorrowFajr = tomorrowSched.items.find((i) => i.id === "fajr");
    nightEnd = tomorrowFajr ? new Date(tomorrowFajr.date) : new Date(nowMs + 12 * 3600000);
  }

  const ishaTime = ishaItem ? new Date(ishaItem.date) : new Date(nightStart.getTime() + 75 * 60000);

  // Panjang malam & sepertiga malam
  const totalNightDuration = nightEnd.getTime() - nightStart.getTime();
  const oneThird = totalNightDuration / 3;

  // Sepertiga Pertama
  const firstThirdStart = ishaTime;
  const firstThirdEnd = new Date(nightStart.getTime() + oneThird);

  // Sepertiga Kedua
  const secondThirdStart = firstThirdEnd;
  const secondThirdEnd = new Date(nightStart.getTime() + 2 * oneThird);

  // Sepertiga Terakhir (Paling Utama)
  const lastThirdStart = secondThirdEnd;
  const lastThirdEnd = nightEnd;

  const isActive = nowMs >= ishaTime.getTime() && nowMs < nightEnd.getTime();
  const isLastThird = nowMs >= lastThirdStart.getTime() && nowMs < nightEnd.getTime();
  const isUrgent = isActive && (nightEnd.getTime() - nowMs <= 45 * 60000);

  const diffMs = isActive
    ? Math.max(0, nightEnd.getTime() - nowMs)
    : nowMs < firstThirdStart.getTime()
    ? Math.max(0, firstThirdStart.getTime() - nowMs)
    : 0;
  const minutesRemaining = Math.round(diffMs / 60000);

  let currentPhase: TahajudScheduleInfo["currentPhase"] = "siang";
  let phaseLabel = "Waktu Tahajud Nanti Malam";
  let warningMessage: string | undefined;

  if (isActive) {
    if (isUrgent) {
      currentPhase = "urgent";
      phaseLabel = "Mendekati Masuk Waktu Subuh (Tutup dengan Witir)";
      warningMessage = `Sisa waktu sepertiga malam tinggal ${minutesRemaining} menit lagi sebelum adzan Subuh! Segera tunaikan Tahajud dan tutup dengan sholat Witir.`;
    } else if (isLastThird) {
      currentPhase = "sepertiga_akhir";
      phaseLabel = "Sepertiga Malam Terakhir (Waktu Paling Mustajab)";
    } else if (nowMs >= secondThirdStart.getTime()) {
      currentPhase = "sepertiga_kedua";
      phaseLabel = "Sepertiga Kedua Malam";
    } else {
      currentPhase = "sepertiga_awal";
      phaseLabel = "Sepertiga Awal Malam";
    }
  } else {
    currentPhase = "siang";
    phaseLabel = "Waktu Tahajud Nanti Malam";
  }

  return {
    nightStart,
    nightEnd,
    phases: {
      firstThird: {
        name: "Sepertiga Pertama Malam (Awal)",
        arabicName: "الثلث الأول من الليل",
        timeRange: `${formatTime(firstThirdStart)} - ${formatTime(firstThirdEnd)}`,
        startTime: firstThirdStart,
        endTime: firstThirdEnd,
        keutamaan: "Dianjurkan bagi yang khawatir tidak terbangun di penghujung malam.",
        dalil: "Wasiat Rasulullah SAW kepada Abu Hurairah (HR. Bukhari)",
      },
      secondThird: {
        name: "Sepertiga Kedua Malam (Pertengahan)",
        arabicName: "الثلث الأوسط من الليل",
        timeRange: `${formatTime(secondThirdStart)} - ${formatTime(secondThirdEnd)}`,
        startTime: secondThirdStart,
        endTime: secondThirdEnd,
        keutamaan: "Waktu bangunnya para shalihin untuk bermunajat setelah mengistirahatkan tubuh.",
        dalil: "QS. As-Sajdah: 16",
      },
      lastThird: {
        name: "Sepertiga Terakhir (Paling Utama / Afzal)",
        arabicName: "الثلث الأخير من الليل",
        timeRange: `${formatTime(lastThirdStart)} - ${formatTime(lastThirdEnd)}`,
        startTime: lastThirdStart,
        endTime: lastThirdEnd,
        keutamaan: "Allah SWT turun ke langit dunia menyeru siapa yang berdoa akan dikabulkan, siapa yang memohon ampun akan diampuni.",
        dalil: "HR. Bukhari no. 1145 & Muslim no. 758",
        isAfzal: true,
      },
    },
    isActive,
    isLastThird,
    isUrgent,
    minutesRemaining,
    currentPhase,
    phaseLabel,
    warningMessage,
  };
}

export interface WaktuTahrimInfo {
  isTahrim: boolean;
  type: "syuruq" | "istiwa" | "ghurub" | "none";
  title: string;
  timeRange: string;
  description: string;
  dalil: string;
}

/**
 * Mendeteksi 3 Waktu Terlarang Sholat Sunnah (Waktu Tahrim)
 * Sesuai Hadits Shahih HR. Muslim no. 832
 */
export function calculateWaktuTahrim(
  city: CityLocation,
  now: Date = new Date(),
  prayerSchedule?: DayPrayerSchedule
): WaktuTahrimInfo {
  const sched = prayerSchedule || calculatePrayerTimes(city, now);
  const nowMs = now.getTime();

  const sunriseItem = sched.items.find((i) => i.id === "sunrise");
  const dhuhrItem = sched.items.find((i) => i.id === "dhuhr");
  const maghribItem = sched.items.find((i) => i.id === "maghrib");

  const sunrise = sunriseItem ? new Date(sunriseItem.date) : new Date(now);
  const dhuhr = dhuhrItem ? new Date(dhuhrItem.date) : new Date(now);
  const maghrib = maghribItem ? new Date(maghribItem.date) : new Date(now);

  // 1. Waktu Terbit Matahari s/d Naik Setinggi Tombak (Syuruq s/d Syuruq + 15 menit)
  const syuruqEnd = new Date(sunrise.getTime() + 15 * 60000);
  if (nowMs >= sunrise.getTime() && nowMs < syuruqEnd.getTime()) {
    return {
      isTahrim: true,
      type: "syuruq",
      title: "Waktu Terlarang: Terbit Matahari (Tanduk Syetan)",
      timeRange: `${formatTime(sunrise)} - ${formatTime(syuruqEnd)}`,
      description: "Dilarang melaksanakan sholat sunnah muthlaq saat matahari persis terbit hingga naik setinggi satu tombak (sekitar 15 menit setelah terbit).",
      dalil: "HR. Muslim no. 832: 'Saat matahari terbit hingga ia naik tinggi.'",
    };
  }

  // 2. Waktu Istiwa' (Matahari Tepat di Tengah Langit - Sebelum Dzuhur)
  // ~12 menit sebelum adzan Dzuhur
  const istiwaStart = new Date(dhuhr.getTime() - 12 * 60000);
  if (nowMs >= istiwaStart.getTime() && nowMs < dhuhr.getTime()) {
    return {
      isTahrim: true,
      type: "istiwa",
      title: "Waktu Terlarang: Istiwa' (Tengah Hari Sebelum Dzuhur)",
      timeRange: `${formatTime(istiwaStart)} - ${formatTime(dhuhr)}`,
      description: "Dilarang sholat sunnah ketika matahari tepat berada di puncak langit hingga tergelincir masuk waktu Dzuhur (kecuali hari Jum'at bagi yang hadir di masjid).",
      dalil: "HR. Muslim no. 832: 'Saat orang berdiri di tengah hari hingga matahari tergelincir.'",
    };
  }

  // 3. Waktu Menjelang Terbenam Matahari (Sebelum Maghrib)
  // ~15 menit sebelum adzan Maghrib
  const ghurubStart = new Date(maghrib.getTime() - 15 * 60000);
  if (nowMs >= ghurubStart.getTime() && nowMs < maghrib.getTime()) {
    return {
      isTahrim: true,
      type: "ghurub",
      title: "Waktu Terlarang: Menjelang Matahari Terbenam",
      timeRange: `${formatTime(ghurubStart)} - ${formatTime(maghrib)}`,
      description: "Dilarang sholat sunnah saat matahari menguning dan hendak terbenam hingga tenggelam sempurna.",
      dalil: "HR. Muslim no. 832: 'Saat matahari condong hendak terbenam hingga ia benar-benar tenggelam.'",
    };
  }

  return {
    isTahrim: false,
    type: "none",
    title: "Waktu Diperbolehkan Sholat",
    timeRange: "",
    description: "",
    dalil: "",
  };
}

