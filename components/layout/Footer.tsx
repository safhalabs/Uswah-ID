import Link from "next/link";
import { Heart, Compass, ShieldCheck } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/10 dark:border-emerald-500/20 bg-white/60 dark:bg-[#06120d]/70 py-10 mt-12 pb-24 md:pb-10 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-3">
              <Logo size="md" />
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
              Diambil dari konsep <em>Uswatun Hasanah</em> (Suri Teladan yang Baik). Wadah pribadi muslim modern untuk menjaga ketepatan waktu sholat fardhu, mengingatkan puasa sunnah, dan meneladani akhlak mulia Rasulullah SAW.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-3 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Metodologi Hisab &amp; Akurasi
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Perhitungan waktu sholat mengacu pada standar resmi <strong>Kementerian Agama Republik Indonesia (Kemenag RI)</strong>:
              Sudut Subuh 20°, Sudut Isya 18°, Mazhab Syafi&apos;i, dengan pengaman waktu (ihtiyat) +2 menit. Kalender Hijriah dihitung dengan hisab Umm al-Qura yang mendukung penyesuaian rukyat hilal.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-3 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-600" />
              Menu &amp; Fitur Islami
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs font-medium">
              <li>
                <Link href="/jadwal-sholat" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                  Jadwal Sholat 1 Bulan
                </Link>
              </li>
              <li>
                <Link href="/kalender-hijriah" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                  Kalender Hijriah &amp; Puasa
                </Link>
              </li>
              <li>
                <Link href="/puasa-sunnah" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                  Katalog Niat &amp; Qadha
                </Link>
              </li>
              <li>
                <Link href="/amalan-rasulullah" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                  Amalan 12 Bulan Hijriah
                </Link>
              </li>
              <li>
                <Link href="/asmaul-husna" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                  99 Asmaul Husna
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} Uswah.id • Dibuat dengan niat tulus beribadah</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Standar Kemenag RI</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Meneladani Sunnah <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
