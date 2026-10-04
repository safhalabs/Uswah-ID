export interface DzikirItem {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  targetCount: number;
  dalil: string;
  keutamaan?: string;
  isTasbihCounter?: boolean;
}

export const DZIKIR_BADA_SHOLAT: DzikirItem[] = [
  {
    id: "istighfar",
    title: "1. Istighfar 3x & Doa Keselamatan",
    arabic: "أَسْتَغْفِرُ اللَّهَ (٣×)\nاللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
    latin: "Astaghfirullah (3x).\nAllahumma antas-salaamu wa minkas-salaamu tabaarakta yaa dzal-jalaali wal-ikraam.",
    translation: "Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau adalah Dzat yang memberi keselamatan, dan dari-Mulah keselamatan. Maha Berkah Engkau, wahai Dzat Pemilik Keagungan dan Kemuliaan.",
    targetCount: 3,
    dalil: "HR. Muslim no. 591 dari Tsauban RA",
    keutamaan: "Rasulullah SAW membaca istighfar 3 kali setiap selesai sholat fardhu.",
    isTasbihCounter: true,
  },
  {
    id: "tahlil_awal",
    title: "2. Tauhid & Pujian Kekuasaan Allah",
    arabic: "لاَ إِلَـهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ، اللَّهُمَّ لاَ مَانِعَ لِمَا أَعْطَيْتَ، وَلاَ مُعْطِيَ لِمَا مَنَعْتَ، وَلاَ يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ",
    latin: "Laa ilaaha illallaah wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir. Allahumma laa maani'a limaa a'thaita, wa laa mu'thiya limaa mana'ta, wa laa yanfa'u dzal jaddi minkal jaddu.",
    translation: "Tidak ada sesembahan yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya. Milik-Nya segala kerajaan dan pujian, dan Dia Maha Kuasa atas segala sesuatu. Ya Allah, tidak ada yang dapat mencegah apa yang Engkau berikan, dan tidak ada yang dapat memberi apa yang Engkau cegah, dan tiada bermanfaat kekayaan orang kaya di hadapan siksa-Mu.",
    targetCount: 1,
    dalil: "HR. Bukhari no. 844 & Muslim no. 593",
  },
  {
    id: "ayat_kursi",
    title: "3. Ayat Kursi (Pintu Surga)",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    latin: "Allaahu laa ilaaha illaa huwal-hayyul-qayyuum, laa ta'khudzuhuu sinatuw wa laa nawm, lahuu maa fis-samaawaati wa maa fil-ardh, man dzal-ladzii yasyfa'u 'indahuu illaa bi-idznih, ya'lamu maa baina aidiihim wa maa khalfahum, wa laa yuhiithuuna bi syai-im min 'ilmihii illaa bimaa syaa', wasi'a kursiyyuhus-samaawaati wal-ardh, wa laa ya'uuduhuu hifzhuhumaa, wa huwal-'aliyyul-'azhiim.",
    translation: "Allah, tidak ada tuhan selain Dia. Yang Mahahidup, yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang ada di hadapan mereka dan apa yang ada di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Mahatinggi, Mahabesar.",
    targetCount: 1,
    dalil: "HR. An-Nasa'i dalam As-Sunan Al-Kubra no. 9928, dishahihkan Ibnu Hibban",
    keutamaan: "Barangsiapa membaca Ayat Kursi setiap selesai sholat fardhu, tidak ada yang menghalanginya masuk surga selain kematian.",
  },
  {
    id: "tasbih_33",
    title: "4. Tasbih 33x",
    arabic: "سُبْحَانَ اللَّهِ",
    latin: "Subhaanallah (33x)",
    translation: "Maha Suci Allah.",
    targetCount: 33,
    dalil: "HR. Muslim no. 597 dari Abu Hurairah RA",
    keutamaan: "Menghapuskan dosa-dosa walaupun sebanyak buih di lautan.",
    isTasbihCounter: true,
  },
  {
    id: "tahmid_33",
    title: "5. Tahmid 33x",
    arabic: "الْحَمْدُ لِلَّهِ",
    latin: "Alhamdulillaah (33x)",
    translation: "Segala puji bagi Allah.",
    targetCount: 33,
    dalil: "HR. Muslim no. 597 dari Abu Hurairah RA",
    keutamaan: "Mengisi timbangan amal kebajikan di hari kiamat.",
    isTasbihCounter: true,
  },
  {
    id: "takbir_33",
    title: "6. Takbir 33x",
    arabic: "اللَّهُ أَكْبَرُ",
    latin: "Allaahu Akbar (33x)",
    translation: "Allah Maha Besar.",
    targetCount: 33,
    dalil: "HR. Muslim no. 597 dari Abu Hurairah RA",
    keutamaan: "Menyempurnakan 99 kalimat pengagungan kepada Allah SWT.",
    isTasbihCounter: true,
  },
  {
    id: "penyempurna_100",
    title: "7. Penyempurna Ke-100",
    arabic: "لاَ إِلَـهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ",
    latin: "Laa ilaaha illallaah wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir.",
    translation: "Tidak ada sesembahan yang berhak disembah selain Allah semata, tiada sekutu bagi-Nya. Milik-Nya segenap kerajaan dan pujian, dan Dia Maha Kuasa atas segala sesuatu.",
    targetCount: 1,
    dalil: "HR. Muslim no. 597: 'Disempurnakan keseratusnya dengan bacaan ini, maka diampuni kesalahan-kesalahannya meski sebanyak buih lautan.'",
  },
];
