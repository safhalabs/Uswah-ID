import Link from "next/link";
import { Heart, Compass, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/10 dark:border-emerald-500/20 bg-white/50 dark:bg-[#06120d]/60 py-10 mt-16 pb-24 md:pb-12 text-sm text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                أ
              </div>
              <span className="font-bold text-lg text-emerald-950 dark:text-emerald-100">
                Uswah<span className="text-emerald-600 dark:text-emerald-400">.id</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
              Diambil dari kata <em>Uswatun Hasanah</em> (Teladan yang Baik). Platform pribadi untuk menemani perjalanan ibadah harian, menepati waktu sholat, mengingat puasa sunnah, dan meneladani Rasulullah SAW.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-3 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Metodologi Hisab
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Perhitungan waktu sholat mengacu pada standar <strong>Kementerian Agama Republik Indonesia (Kemenag RI)</strong>:
              Sudut Subuh 20°, Sudut Isya 18°, Mazhab Syafi&apos;i, serta ditambah waktu pengaman (ihtiyat) +2 menit. Kalender Hijriah menggunakan hisab Umm al-Qura yang dapat disesuaikan (+/- hari).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-3 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-600" />
              Navigasi Cepat
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              <li>
                <Link href="/jadwal-sholat" className="hover:text-emerald-600 transition-colors">
                  Jadwal Sholat 5 Waktu
                </Link>
              </li>
              <li>
                <Link href="/kalender-hijriah" className="hover:text-emerald-600 transition-colors">
                  Kalender Hijriah
                </Link>
              </li>
              <li>
                <Link href="/puasa-sunnah" className="hover:text-emerald-600 transition-colors">
                  Jadwal Puasa Sunnah
                </Link>
              </li>
              <li>
                <Link href="/amalan-rasulullah" className="hover:text-emerald-600 transition-colors">
                  Teladan 12 Bulan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Uswah.id • Dibuat dengan niat tulus beribadah</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Dipersiapkan untuk deployment di Vercel</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
