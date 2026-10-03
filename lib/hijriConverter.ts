import { FASTING_CATALOG, FastingRule } from "@/data/fastingTypes";
import { getMonthInfoByIndex, IslamicMonthInfo } from "@/data/islamicMonthsData";

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthArabic: string;
  formatted: string;
  isAyyamulBidh: boolean;
  fastings: FastingRule[];
  isForbiddenToFast: boolean;
  forbiddenReason?: string;
  specialEvent?: string;
  monthInfo: IslamicMonthInfo;
}

export const HIJRI_MONTH_NAMES = [
  "Muharram",
  "Safar",
  "Rabi'ul Awwal",
  "Rabi'ul Akhir",
  "Jumadil Ula",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

export const HIJRI_MONTH_ARABIC = [
  "مُحَرَّم",
  "صَفَر",
  "رَبِيعُ الأَوَّل",
  "رَبِيعُ الآخِر",
  "جُمَادَى الأُولَى",
  "جُمَادَى الآخِرَة",
  "رَجَب",
  "شَعْبَان",
  "رَمَضَان",
  "شَوَّال",
  "ذُو القَعْدَة",
  "ذُو الحِجَّة",
];

/**
 * Konversi tanggal Masehi ke Hijriah dengan penyesuaian hari (+/- hari)
 */
export function getHijriDate(date: Date = new Date(), adjustmentDays: number = 0): HijriDate {
  const targetDate = new Date(date.getTime() + adjustmentDays * 86400000);

  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const parts = formatter.formatToParts(targetDate);
    const dayPart = parts.find((p) => p.type === "day");
    const monthPart = parts.find((p) => p.type === "month");
    const yearPart = parts.find((p) => p.type === "year");

    const day = dayPart ? parseInt(dayPart.value, 10) : 1;
    const month = monthPart ? parseInt(monthPart.value, 10) : 1;
    const year = yearPart ? parseInt(yearPart.value, 10) : 1448;

    const monthIndex = ((month - 1) % 12);
    const monthName = HIJRI_MONTH_NAMES[monthIndex] || `Bulan ${month}`;
    const monthArabic = HIJRI_MONTH_ARABIC[monthIndex] || "";
    const monthInfo = getMonthInfoByIndex(month);

    // Hari dalam sepekan (0 = Minggu, 1 = Senin, ..., 4 = Kamis, 5 = Jumat, 6 = Sabtu)
    const dayOfWeek = targetDate.getDay();

    // Deteksi hari yang diharamkan berpuasa
    let isForbiddenToFast = false;
    let forbiddenReason = "";

    if (month === 10 && day === 1) {
      isForbiddenToFast = true;
      forbiddenReason = "Hari Raya Idul Fitri (1 Syawal) — Diharamkan berpuasa";
    } else if (month === 12 && day === 10) {
      isForbiddenToFast = true;
      forbiddenReason = "Hari Raya Idul Adha (10 Dzulhijjah) — Diharamkan berpuasa";
    } else if (month === 12 && (day === 11 || day === 12 || day === 13)) {
      isForbiddenToFast = true;
      forbiddenReason = `Hari Tasyrik (${day} Dzulhijjah) — Diharamkan berpuasa`;
    }

    // Identifikasi Puasa
    const fastings: FastingRule[] = [];

    if (!isForbiddenToFast) {
      // Puasa Wajib Ramadan
      if (month === 9) {
        fastings.push(FASTING_CATALOG.ramadan);
      } else {
        // Puasa Ayyamul Bidh (13, 14, 15 di luar Dzulhijjah hari ke-13 yang merupakan Tasyrik)
        if (day === 13 || day === 14 || day === 15) {
          if (!(month === 12 && day === 13)) {
            fastings.push(FASTING_CATALOG.ayyamul_bidh);
          }
        }

        // Puasa Senin & Kamis
        if (dayOfWeek === 1) {
          fastings.push(FASTING_CATALOG.senin);
        } else if (dayOfWeek === 4) {
          fastings.push(FASTING_CATALOG.kamis);
        }

        // Puasa 6 Hari Syawal
        if (month === 10 && day > 1) {
          fastings.push(FASTING_CATALOG.syawal_6);
        }

        // Puasa Tarwiyah & Arafah
        if (month === 12 && day === 8) {
          fastings.push(FASTING_CATALOG.tarwiyah);
        } else if (month === 12 && day === 9) {
          fastings.push(FASTING_CATALOG.arafah);
        }

        // Puasa Tasu'a & Asyura
        if (month === 1 && day === 9) {
          fastings.push(FASTING_CATALOG.tasua);
        } else if (month === 1 && day === 10) {
          fastings.push(FASTING_CATALOG.asyura);
        }

        // Puasa Sya'ban
        if (month === 8 && day <= 15) {
          fastings.push(FASTING_CATALOG.syaban);
        }
      }
    } else {
      if (month === 10 && day === 1) fastings.push(FASTING_CATALOG.haram_idul_fitri);
      if (month === 12 && day === 10) fastings.push(FASTING_CATALOG.haram_idul_adha);
      if (month === 12 && (day === 11 || day === 12 || day === 13)) fastings.push(FASTING_CATALOG.haram_tasyrik);
    }

    // Hari penting khusus
    let specialEvent: string | undefined;
    if (month === 1 && day === 1) specialEvent = "Tahun Baru Islam (1 Muharram)";
    else if (month === 1 && day === 10) specialEvent = "Hari Asyura";
    else if (month === 3 && day === 12) specialEvent = "Maulid Nabi Muhammad SAW (12 Rabi'ul Awwal)";
    else if (month === 7 && day === 27) specialEvent = "Peringatan Isra' Mi'raj (27 Rajab)";
    else if (month === 8 && day === 15) specialEvent = "Malam Nisfu Sya'ban";
    else if (month === 9 && day === 1) specialEvent = "Awal Puasa Ramadan";
    else if (month === 9 && day === 17) specialEvent = "Nuzulul Qur'an (17 Ramadan)";
    else if (month === 10 && day === 1) specialEvent = "Hari Raya Idul Fitri 1448 H";
    else if (month === 12 && day === 9) specialEvent = "Hari Arafah (Puncak Ibadah Haji)";
    else if (month === 12 && day === 10) specialEvent = "Hari Raya Idul Adha 1448 H";

    const isAyyamulBidh = (day === 13 || day === 14 || day === 15) && !(month === 12 && day === 13) && month !== 9;

    return {
      day,
      month,
      year,
      monthName,
      monthArabic,
      formatted: `${day} ${monthName} ${year} H`,
      isAyyamulBidh,
      fastings,
      isForbiddenToFast,
      forbiddenReason,
      specialEvent,
      monthInfo,
    };
  } catch (e) {
    console.error("Error formatting Hijri date", e);
    // Fallback jika terjadi error
    return {
      day: 1,
      month: 1,
      year: 1448,
      monthName: "Muharram",
      monthArabic: "مُحَرَّم",
      formatted: "1 Muharram 1448 H",
      isAyyamulBidh: false,
      fastings: [],
      isForbiddenToFast: false,
      monthInfo: getMonthInfoByIndex(1),
    };
  }
}
