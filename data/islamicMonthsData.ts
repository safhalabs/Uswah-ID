export interface MonthSunnahPractice {
  title: string;
  category: "Puasa" | "Sholat" | "Sedekah" | "Dzikir & Doa" | "Sirah & Akhlak";
  description: string;
  dalil: string;
  source: string;
  isDailyRecommended?: boolean;
}

export interface HistoricalEvent {
  title: string;
  year?: string;
  summary: string;
  lesson: string;
}

export interface IslamicMonthInfo {
  monthIndex: number; // 1 - 12 (1 = Muharram)
  arabicName: string;
  latinName: string;
  alternateName?: string;
  isHaramMonth: boolean; // Asyhurul Hurum (Muharram, Rajab, Dzulqa'dah, Dzulhijjah)
  theme: string;
  description: string;
  practices: MonthSunnahPractice[];
  events: HistoricalEvent[];
  quranQuotes?: {
    arabic: string;
    translation: string;
    surah: string;
  };
}

export const ISLAMIC_MONTHS: IslamicMonthInfo[] = [
  {
    monthIndex: 1,
    arabicName: "مُحَرَّم",
    latinName: "Muharram",
    alternateName: "Bulan Allah (Syahrullah)",
    isHaramMonth: true,
    theme: "Awal Tahun Hijriah & Puasa Asyura",
    description: "Muharram adalah salah satu dari empat bulan haram (mulia). Rasulullah SAW menyebutnya sebagai 'Syahrullah' (Bulan Allah). Momentum terbaik untuk berhijrah menuju pribadi yang lebih bertakwa dan memperbanyak puasa sunnah.",
    quranQuotes: {
      arabic: "إِنَّ عِدَّةَ الشُّهُورِ عِنْدَ اللَّهِ اثْنَا عَشَرَ شَهْرًا فِي كِتَابِ اللَّهِ يَوْمَ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ مِنْهَا أَرْبَعَةٌ حُرُمٌ",
      translation: "Sesungguhnya bilangan bulan pada sisi Allah adalah dua belas bulan, dalam ketetapan Allah di waktu Dia menciptakan langit dan bumi, di antaranya empat bulan haram.",
      surah: "QS. At-Taubah: 36"
    },
    practices: [
      {
        title: "Puasa Asyura (10 Muharram)",
        category: "Puasa",
        description: "Menghapuskan dosa-dosa kecil setahun yang lalu. Dilakukan sebagai wujud syukur atas diselamatkannya Nabi Musa AS dari kejaran Fir'aun.",
        dalil: "Puasa hari 'Asyura, sungguh aku berharap kepada Allah agar menghapuskan dosa setahun yang lalu.",
        source: "HR. Muslim no. 1162",
        isDailyRecommended: false,
      },
      {
        title: "Puasa Tasu'a (9 Muharram)",
        category: "Puasa",
        description: "Disunnahkan berpuasa pada hari ke-9 Muharram untuk menyelisihi kebiasaan kaum Yahudi yang hanya berpuasa di hari ke-10.",
        dalil: "Jika aku masih hidup sampai tahun depan, sungguh aku akan berpuasa pada hari kesembilan.",
        source: "HR. Muslim no. 1134",
        isDailyRecommended: false,
      },
      {
        title: "Memperbanyak Puasa Sunnah Sepanjang Muharram",
        category: "Puasa",
        description: "Puasa di bulan Muharram adalah puasa paling utama setelah puasa fardhu bulan Ramadan.",
        dalil: "Puasa yang paling utama setelah Ramadan adalah puasa pada bulan Allah, Muharram.",
        source: "HR. Muslim no. 1163",
        isDailyRecommended: true,
      },
      {
        title: "Menahan Diri dari Segala Bentuk Kezaliman",
        category: "Sirah & Akhlak",
        description: "Bulan haram memiliki kehormatan ganda: dosa kezaliman berlipat berat, dan pahala amal shalih dilipatgandakan.",
        dalil: "Maka janganlah kamu menganiaya diri kamu dalam bulan yang empat itu.",
        source: "QS. At-Taubah: 36",
        isDailyRecommended: true,
      }
    ],
    events: [
      {
        title: "Penyelamatan Nabi Musa AS",
        year: "Zaman Para Nabi",
        summary: "Allah SWT membelah Laut Merah menyelamatkan Nabi Musa AS dan Bani Israil, lalu menenggelamkan Fir'aun dan bala tentaranya pada tanggal 10 Muharram.",
        lesson: "Kemenangan tauhid atas kezaliman dan pentingnya rasa syukur yang diwujudkan dalam ibadah."
      },
      {
        title: "Penetapan Kalender Hijriah",
        year: "16 H (Khalifah Umar bin Khattab)",
        summary: "Musyawarah para sahabat memilih peristiwa Hijrah Rasulullah SAW dari Makkah ke Madinah sebagai tonggak awal tahun penanggalan umat Islam.",
        lesson: "Hijrah adalah pembatas antara kebenaran dan kebatilan, momentum memulai lembaran hidup baru."
      }
    ]
  },
  {
    monthIndex: 2,
    arabicName: "صَفَر",
    latinName: "Safar",
    isHaramMonth: false,
    theme: "Meluruskan Mitos (Thiyarah) & Meneguhkan Tawakkal",
    description: "Pada masa Jahiliyah, bulan Safar sering dianggap membawa sial. Rasulullah SAW dengan tegas membantah takhayul tersebut dan mengajarkan bahwa semua waktu berada dalam genggaman takdir Allah SWT.",
    practices: [
      {
        title: "Memurnikan Tawakkal & Menolak Thiyarah (Mitos Sial)",
        category: "Sirah & Akhlak",
        description: "Menghindari keyakinan bahwa Safar membawa bala. Berprasangka baik (Husnudzan) kepada Allah dan senantiasa berikhtiar.",
        dalil: "Tidak ada penularan penyakit (secara mandiri tanpa izin Allah), tidak ada kesialan (thiyarah), tidak ada burung hantu (pembawa sial), dan tidak ada kesialan bulan Safar.",
        source: "HR. Bukhari no. 5707 & Muslim no. 2220",
        isDailyRecommended: true,
      },
      {
        title: "Rutinitas Puasa Senin-Kamis & Ayyamul Bidh",
        category: "Puasa",
        description: "Menjaga ritme ibadah bulanan dengan puasa tanggal 13, 14, 15 Safar serta hari Senin dan Kamis.",
        dalil: "Kekasihku (Rasulullah) mewasiatkan tiga hal: puasa tiga hari setiap bulan, dua rakaat sholat Dhuha, dan witir sebelum tidur.",
        source: "HR. Bukhari no. 1981",
        isDailyRecommended: true,
      },
      {
        title: "Membiasakan Doa Perlindungan Pagi & Petang",
        category: "Dzikir & Doa",
        description: "Membentengi diri dari marabahaya dengan dzikir ma'tsurat sesuai sunnah Nabi SAW.",
        dalil: "Bismillahilladzi la yadhurru ma'asmihi syai'un fil ardhi wa la fis sama'i wa huwas sami'ul 'alim (3x).",
        source: "HR. Abu Dawud & At-Tirmidzi",
        isDailyRecommended: true,
      }
    ],
    events: [
      {
        title: "Pernikahan Rasulullah SAW dengan Khadijah RA",
        year: "Pra-Kenabian",
        summary: "Pernikahan agung yang membawa ketenangan dan penyokong utama dakwah di masa-masa awal risalah Islam.",
        lesson: "Pondasi keluarga dibangun atas dasar akhlak luhur, saling menguatkan di jalan kebenaran."
      },
      {
        title: "Pernikahan Sayyidah Fatimah RA dengan Ali bin Abi Thalib RA",
        year: "2 H",
        summary: "Pernikahan teladan putri kesayangan Rasulullah SAW yang penuh kesederhanaan dan keberkahan.",
        lesson: "Kemuliaan pernikahan terletak pada ketaqwaan dan keserasian budi pekerti, bukan kemewahan materi."
      }
    ]
  },
  {
    monthIndex: 3,
    arabicName: "رَبِيعُ الأَوَّل",
    latinName: "Rabi'ul Awwal",
    isHaramMonth: false,
    theme: "Mengenal & Meneladani Rasulullah SAW (Uswatun Hasanah)",
    description: "Bulan lahirnya junjungan kita Nabi Muhammad SAW pembawa rahmat bagi semesta alam (Rahmatan lil 'Alamin). Momen terbaik untuk memperdalam Sirah Nabawiyah dan memperbanyak shalawat.",
    quranQuotes: {
      arabic: "لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ لِمَنْ كَانَ يَرْجُو اللَّهَ وَالْيَوْمَ الْآخِرَ وَذَكَرَ اللَّهَ كَثِيرًا",
      translation: "Sesungguhnya telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu (yaitu) bagi orang yang mengharap (rahmat) Allah dan (kedatangan) hari kiamat dan dia banyak mengingat Allah.",
      surah: "QS. Al-Ahzab: 21"
    },
    practices: [
      {
        title: "Memperbanyak Shalawat kepada Nabi SAW",
        category: "Dzikir & Doa",
        description: "Membasahi lisan dengan shalawat Ibrahimiyah atau shalawat harian untuk meraih syafa'at di hari akhir.",
        dalil: "Barangsiapa bershalawat kepadaku satu kali, niscaya Allah bershalawat kepadanya sepuluh kali.",
        source: "HR. Muslim no. 408",
        isDailyRecommended: true,
      },
      {
        title: "Membaca & Mempelajari Sirah Nabawiyah",
        category: "Sirah & Akhlak",
        description: "Mengkaji riwayat hidup, perjuangan, kesabaran, dan kemuliaan akhlak baginda Rasulullah SAW.",
        dalil: "Katakanlah: Jika kamu (benar-benar) mencintai Allah, ikutilah aku, niscaya Allah mengasihi dan mengampuni dosa-dosamu.",
        source: "QS. Ali 'Imran: 31",
        isDailyRecommended: true,
      },
      {
        title: "Meneladani Sifat Welas Asih & Kedermawanan",
        category: "Sedekah",
        description: "Menghidupkan sunnah menebar salam, memberi makan kaum duafa, dan menyantuni anak yatim.",
        dalil: "Aku dan orang yang menanggung anak yatim (kedudukannya) di surga seperti ini (beliau mengisyaratkan jari telunjuk dan jari tengah).",
        source: "HR. Bukhari no. 5304",
        isDailyRecommended: true,
      }
    ],
    events: [
      {
        title: "Kelahiran Baginda Nabi Muhammad SAW",
        year: "Tahun Gajah (571 M)",
        summary: "Lahirnya pembawa lentera hidayah yang menyinari kegelapan jahiliyah menjadi zaman penuh cahaya ilmu dan iman.",
        lesson: "Rasa cinta kepada Nabi dibuktikan dengan mengikuti sunnah dan adab beliau dalam kehidupan sehari-hari."
      },
      {
        title: "Tiba di Madinah dalam Perjalanan Hijrah",
        year: "1 H",
        summary: "Rasulullah SAW tiba di Quba dan Madinah, disambut hangat oleh kaum Anshar, kemudian mendirikan Masjid Quba dan Masjid Nabawi.",
        lesson: "Membangun persaudaraan (Ukhuwah) dan menomorsatukan tempat ibadah sebagai pusat peradaban."
      }
    ]
  },
  {
    monthIndex: 4,
    arabicName: "رَبِيعُ الآخِر",
    latinName: "Rabi'ul Akhir",
    alternateName: "Rabi'uts Tsani",
    isHaramMonth: false,
    theme: "Konsistensi Menghidupkan Sunnah Harian",
    description: "Bulan Rabi'ul Akhir adalah pengingat agar semangat mencintai Rasulullah SAW tidak padam pasca Rabi'ul Awwal, melainkan diwujudkan dalam konsistensi (istiqomah) amalan sehari-hari.",
    practices: [
      {
        title: "Menjaga Sholat Sunnah Rawatib (12 Rakaat)",
        category: "Sholat",
        description: "Menyempurnakan sholat fardhu dengan 2 sebelum Subuh, 4 sebelum Dzuhur, 2 sesudah Dzuhur, 2 sesudah Maghrib, dan 2 sesudah Isya.",
        dalil: "Barangsiapa sholat 12 rakaat sehari semalam, niscaya dibangunkan baginya sebuah rumah di surga.",
        source: "HR. Muslim no. 728",
        isDailyRecommended: true,
      },
      {
        title: "Menebarkan Salam & Menyambung Silaturahmi",
        category: "Sirah & Akhlak",
        description: "Menyapa sesama muslim dengan salam, menjenguk kerabat yang sakit, dan menjaga hubungan kekerabatan.",
        dalil: "Maukah aku tunjukkan sesuatu yang jika kalian kerjakan maka kalian akan saling mencintai? Tebarkanlah salam di antara kalian.",
        source: "HR. Muslim no. 54",
        isDailyRecommended: true,
      }
    ],
    events: [
      {
        title: "Perang Dzatur Riqa'",
        year: "4 H",
        summary: "Peristiwa di mana pertama kali disyariatkannya Sholat Khauf (tata cara sholat dalam kondisi perang/bahaya).",
        lesson: "Sholat adalah tiang agama yang tidak boleh ditinggalkan dalam kondisi apapun, bahkan di tengah medan pertempuran."
      }
    ]
  },
  {
    monthIndex: 5,
    arabicName: "جُمَادَى الأُولَى",
    latinName: "Jumadil Ula",
    isHaramMonth: false,
    theme: "Meneladani Keteguhan Iman & Amanah",
    description: "Bulan yang dihiasi dengan teladan keberanian para sahabat Nabi dalam menjaga amanah risalah tauhid di hadapan kekuatan imperium besar.",
    practices: [
      {
        title: "Menjaga Kejujuran dalam Muamalah & Perniagaan",
        category: "Sirah & Akhlak",
        description: "Meneladani integritas Rasulullah SAW sebagai Al-Amin dalam setiap transaksi dan amanah pekerjaan.",
        dalil: "Pedagang yang jujur dan terpercaya akan bersama para Nabi, orang-orang shiddiq, dan para syuhada.",
        source: "HR. At-Tirmidzi no. 1209",
        isDailyRecommended: true,
      },
      {
        title: "Sholat Dhuha Minimal 2 Rakaat",
        category: "Sholat",
        description: "Sebagai wujud sedekah untuk setiap persendian tubuh (360 sendi) di pagi hari.",
        dalil: "Setiap pagi setiap persendian salah seorang di antara kalian harus dikeluarkan sedekahnya... dan itu tercukupi dengan dua rakaat sholat Dhuha.",
        source: "HR. Muslim no. 720",
        isDailyRecommended: true,
      }
    ],
    events: [
      {
        title: "Perang Mu'tah",
        year: "8 H",
        summary: "Tiga ribu pasukan muslim menghadapi 200 ribu pasukan Romawi. Tiga panglima gugur syahid (Zaid bin Haritsah, Ja'far bin Abi Thalib, Abdullah bin Rawahah) sebelum Khalid bin Walid memimpin mundur secara taktis.",
        lesson: "Keberanian bersumber dari keyakinan pada janji surga Allah, bukan semata-mata jumlah bilangan."
      }
    ]
  },
  {
    monthIndex: 6,
    arabicName: "جُمَادَى الآخِرَة",
    latinName: "Jumadil Akhir",
    alternateName: "Jumadats Tsaniyah",
    isHaramMonth: false,
    theme: "Muhasabah Diri Menuju Bulan-Bulan Mulia",
    description: "Menutup semester pertama tahun Hijriah. Para ulama salaf menjadikan momen ini untuk introspeksi amal sebelum memasuki gerbang Rajab, Sya'ban, dan Ramadan.",
    practices: [
      {
        title: "Muhasabah Diri (Introspeksi Amal)",
        category: "Dzikir & Doa",
        description: "Mengevaluasi dosa dan kelalaian setengah tahun terakhir, memperbanyak istighfar.",
        dalil: "Hisablah diri kalian sebelum kalian dihisab (di hadapan Allah).",
        source: "Atsar Umar bin Khattab RA",
        isDailyRecommended: true,
      },
      {
        title: "Membayar Hutang Puasa Ramadan (Qadha)",
        category: "Puasa",
        description: "Menyegerakan menunaikan qadha puasa Ramadan tahun lalu sebelum Ramadan berikutnya semakin dekat.",
        dalil: "Dahulu aku memiliki tanggungan puasa Ramadan, dan aku tidak sanggup mengqadhanya kecuali di bulan Sya'ban.",
        source: "HR. Bukhari no. 1950 (Aisyah RA)",
        isDailyRecommended: false,
      }
    ],
    events: [
      {
        title: "Wafatnya Khalifah Abu Bakar Ash-Shiddiq RA",
        year: "13 H (22 Jumadil Akhir)",
        summary: "Sahabat terdekat Rasulullah SAW yang paling teguh menjaga keutuhan Islam pasca wafatnya Nabi berpulang ke rahmatullah.",
        lesson: "Ketulusan, pengorbanan harta dan jiwa tanpa pamrih demi tegaknya agama Allah."
      }
    ]
  },
  {
    monthIndex: 7,
    arabicName: "رَجَب",
    latinName: "Rajab",
    alternateName: "Rajab Mudhar / Syahrullah",
    isHaramMonth: true,
    theme: "Bulan Haram, Isra' Mi'raj & Menanam Benih Kebaikan",
    description: "Rajab adalah bulan haram yang menyendiri di tengah tahun. Pintu gerbang persiapan menuju Ramadan. Para salafus shalih berkata: 'Bulan Rajab adalah bulan menanam benih, Sya'ban adalah bulan menyiraminya, dan Ramadan adalah bulan memanen hasilnya.'",
    practices: [
      {
        title: "Memperbanyak Doa Keberkahan Menuju Ramadan",
        category: "Dzikir & Doa",
        description: "Memohon agar diberkahi di bulan Rajab dan Sya'ban serta disampaikan hingga bulan suci Ramadan.",
        dalil: "Allahumma barik lana fi Rajaba wa Sya'bana wa ballighna Ramadhan.",
        source: "HR. Ahmad no. 2346",
        isDailyRecommended: true,
      },
      {
        title: "Merenungi Hakikat Sholat dari Peristiwa Isra' Mi'raj",
        category: "Sholat",
        description: "Menjaga sholat fardhu berjamaah di awal waktu dan meningkatkan kekhusyu'an.",
        dalil: "Perjanjian antara kami dengan mereka adalah sholat, barangsiapa yang meninggalkannya maka sungguh ia telah kufur.",
        source: "HR. Ahmad & At-Tirmidzi",
        isDailyRecommended: true,
      },
      {
        title: "Menahan Diri dari Dosa & Maksiat",
        category: "Sirah & Akhlak",
        description: "Sebagai bulan haram, kezaliman sekecil apapun di bulan ini bernilai dosa yang sangat berat di sisi Allah.",
        dalil: "Janganlah kamu menzalimi dirimu sendiri pada bulan-bulan haram itu.",
        source: "Tafsir Ibnu Abbas untuk QS. At-Taubah: 36",
        isDailyRecommended: true,
      }
    ],
    events: [
      {
        title: "Peristiwa Mukjizat Isra' dan Mi'raj",
        year: "10 Kenabian (Tahun Kesedihan / 'Amul Huzn)",
        summary: "Perjalanan malam Rasulullah SAW dari Masjidil Haram ke Masjidil Aqsha, lalu naik ke Sidratul Muntaha menerima wahyu kewajiban sholat 5 waktu.",
        lesson: "Sholat adalah mi'raj-nya orang mukmin, sarana terdekat bermunajat langsung kepada Allah SWT."
      },
      {
        title: "Pembebasan Baitul Maqdis oleh Shalahuddin Al-Ayyubi",
        year: "583 H (27 Rajab)",
        summary: "Masjidil Aqsha kembali ke pangkuan umat Islam dengan perlakuan penuh kasih dan keadilan bagi penduduk non-muslim.",
        lesson: "Kejayaan Islam diraih melalui pemurnian aqidah, persatuan umat, dan kepemimpinan yang shalih."
      }
    ]
  },
  {
    monthIndex: 8,
    arabicName: "شَعْبَان",
    latinName: "Sya'ban",
    alternateName: "Bulan Terangkatnya Amal",
    isHaramMonth: false,
    theme: "Menyiram Benih Ibadah & Memperbanyak Puasa Sunnah",
    description: "Bulan yang sering dilalaikan manusia karena terletak di antara Rajab dan Ramadan. Rasulullah SAW paling banyak berpuasa sunnah di bulan ini karena amal-amal manusia diangkat dan dilaporkan kepada Allah SWT.",
    practices: [
      {
        title: "Memperbanyak Puasa Sunnah (Mencontoh Nabi SAW)",
        category: "Puasa",
        description: "Rasulullah SAW berpuasa hampir sebulan penuh di bulan Sya'ban sebagai latihan fisik dan ruhiyah menjelang Ramadan.",
        dalil: "Itu adalah bulan yang dilalaikan manusia di antara Rajab dan Ramadan. Di bulan itulah amal-amal diangkat kepada Rabbul 'Alamin, dan aku suka amalku diangkat saat aku sedang berpuasa.",
        source: "HR. An-Nasa'i no. 2357 (Hasan)",
        isDailyRecommended: true,
      },
      {
        title: "Menghidupkan Malam Nisfu Sya'ban dengan Doa & Istighfar",
        category: "Dzikir & Doa",
        description: "Malam ke-15 Sya'ban adalah malam pengampunan luas, kecuali bagi orang yang berbuat syirik dan yang bermusuhan.",
        dalil: "Sesungguhnya Allah melihat hamba-Nya pada malam nisfu Sya'ban, lalu mengampuni seluruh makhluk-Nya kecuali orang musyrik dan orang yang bermusuhan.",
        source: "HR. Ibnu Majah no. 1390 (Shahih lighairihi)",
        isDailyRecommended: false,
      },
      {
        title: "Merapikan Hutang Piutang & Memaafkan Sesama",
        category: "Sirah & Akhlak",
        description: "Menghilangkan kedengkian dan dendam di hati agar saat Ramadan tiba, jiwa dalam keadaan bersih dan suci.",
        dalil: "Pintu-pintu surga dibuka pada hari Senin dan Kamis, lalu diampuni setiap hamba... kecuali dua orang yang sedang bermusuhan.",
        source: "HR. Muslim no. 2565",
        isDailyRecommended: true,
      }
    ],
    events: [
      {
        title: "Peralihan Arah Kiblat ke Ka'bah",
        year: "2 H (Bulan Sya'ban)",
        summary: "Perintah Allah SWT memindahkan arah kiblat umat Islam dari Masjidil Aqsha di Yerusalem menuju Ka'bah di Makkah Al-Mukarramah.",
        lesson: "Ketundukan mutlak kepada perintah Allah dan pengukuhan identitas independen umat Islam."
      }
    ]
  },
  {
    monthIndex: 9,
    arabicName: "رَمَضَان",
    latinName: "Ramadan",
    alternateName: "Sayyidus Syuhur (Penghulu Segala Bulan)",
    isHaramMonth: false,
    theme: "Bulan Puasa Wajib, Al-Qur'an & Pintu Surga Terbuka",
    description: "Bulan paling mulia dalam Islam. Di dalamnya diturunkan Al-Qur'an, pintu surga dibuka seluas-luasnya, pintu neraka ditutup rapat, dan setan-setan dibelenggu. Terdapat satu malam yang lebih mulia daripada 1000 bulan (Lailatul Qadr).",
    quranQuotes: {
      arabic: "شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ هُدًى لِلنَّاسِ وَبَيِّنَاتٍ مِنَ الْهُدَىٰ وَالْفُرْقَانِ",
      translation: "Bulan Ramadan adalah (bulan) yang di dalamnya diturunkan Al-Qur'an, sebagai petunjuk bagi manusia dan penjelasan-penjelasan mengenai petunjuk itu dan pembeda (antara yang benar dan yang batil).",
      surah: "QS. Al-Baqarah: 185"
    },
    practices: [
      {
        title: "Puasa Fardhu Ramadan Sebulan Penuh",
        category: "Puasa",
        description: "Rukun Islam keempat yang wajib ditunaikan dengan menahan lapar, dahaga, dan hawa nafsu sejak terbit fajar hingga terbenam matahari.",
        dalil: "Barangsiapa berpuasa Ramadan karena iman dan mengharap pahala, niscaya diampuni dosa-dosanya yang telah lalu.",
        source: "HR. Bukhari no. 38 & Muslim no. 760",
        isDailyRecommended: true,
      },
      {
        title: "Qiyamul Lail (Sholat Tarawih & Witir)",
        category: "Sholat",
        description: "Menghidupkan malam-malam Ramadan dengan sholat tarawih berjamaah dan witir.",
        dalil: "Barangsiapa mendirikan sholat di malam Ramadan (Tarawih) karena iman dan mengharap pahala, niscaya diampuni dosa-dosanya yang telah lalu.",
        source: "HR. Bukhari no. 37 & Muslim no. 759",
        isDailyRecommended: true,
      },
      {
        title: "Tadarus & Menghatamkan Al-Qur'an",
        category: "Dzikir & Doa",
        description: "Mencontoh Malaikat Jibril AS yang mentadaruskan Al-Qur'an bersama Rasulullah SAW setiap malam di bulan Ramadan.",
        dalil: "Nabi SAW adalah orang yang paling dermawan, dan beliau lebih dermawan lagi di bulan Ramadan ketika Jibril menemuinya untuk tadarus Al-Qur'an.",
        source: "HR. Bukhari no. 6",
        isDailyRecommended: true,
      },
      {
        title: "Memperbanyak Sedekah & Memberi Makan Buka Puasa (Ifthar)",
        category: "Sedekah",
        description: "Meraih pahala yang sama dengan orang yang berpuasa tanpa mengurangi pahala orang tersebut sedikitpun.",
        dalil: "Barangsiapa memberi makan berbuka bagi orang yang berpuasa, maka baginya pahala seperti orang yang berpuasa itu.",
        source: "HR. At-Tirmidzi no. 807 (Shahih)",
        isDailyRecommended: true,
      },
      {
        title: "I'tikaf di 10 Malam Terakhir & Memburu Lailatul Qadr",
        category: "Sholat",
        description: "Mengencangkan ikat pinggang ibadah, beri'tikaf di masjid untuk mencari Lailatul Qadr di malam-malam ganjil (21, 23, 25, 27, 29).",
        dalil: "Rasulullah SAW bersungguh-sungguh (beribadah) pada 10 hari terakhir Ramadan melebihi kesungguhannya di hari-hari lainnya.",
        source: "HR. Muslim no. 1175",
        isDailyRecommended: false,
      }
    ],
    events: [
      {
        title: "Nuzulul Qur'an (Turunnya Al-Qur'an Pertama Kali)",
        year: "Tahun 610 M (Gua Hira)",
        summary: "Turunnya lima ayat pertama Surah Al-'Alaq melalui Malaikat Jibril AS menandai diangkatnya Muhammad sebagai Nabi dan Rasul.",
        lesson: "Al-Qur'an adalah pedoman hidup abadi yang harus senantiasa dibaca, dipahami, dan diamalkan."
      },
      {
        title: "Perang Badar Al-Kubra",
        year: "2 H (17 Ramadan)",
        summary: "Kemenangan menentukan pasukan muslim (313 prajurit) melawan kaum musyrikin Quraisy (1000 prajurit).",
        lesson: "Pertolongan Allah turun kepada orang-orang yang ikhlas, tawakkal, dan bersatu di jalan-Nya."
      },
      {
        title: "Fathu Makkah (Penaklukan Kota Makkah)",
        year: "8 H (20 Ramadan)",
        summary: "Rasulullah SAW memasuki Makkah tanpa pertumpahan darah, menghancurkan 360 berhala di sekitar Ka'bah, dan memaafkan penduduk Makkah.",
        lesson: "Puncak kerendahan hati saat berkuasa dan teladan pemaaf tanpa rasa dendam."
      }
    ]
  },
  {
    monthIndex: 10,
    arabicName: "شَوَّال",
    latinName: "Syawal",
    alternateName: "Bulan Peningkatan Amal",
    isHaramMonth: false,
    theme: "Hari Kemenangan & Puasa Enam Hari Syawal",
    description: "Kata Syawal bermakna 'meningkat'. Merupakan tolok ukur apakah madrasah Ramadan berhasil melahirkan peningkatan kualitas takwa dan akhlak dalam kehidupan kita.",
    practices: [
      {
        title: "Menunaikan Zakat Fitrah & Sholat Idul Fitri (1 Syawal)",
        category: "Sholat",
        description: "Menyucikan orang yang berpuasa dari perkataan sia-sia dan membahagiakan kaum miskin di hari raya.",
        dalil: "Rasulullah SAW mewajibkan zakat fitrah sebagai pembersih bagi orang yang berpuasa dari perbuatan sia-sia dan kotor, serta makanan bagi orang-orang miskin.",
        source: "HR. Abu Dawud no. 1609",
        isDailyRecommended: false,
      },
      {
        title: "Puasa Sunnah 6 Hari di Bulan Syawal",
        category: "Puasa",
        description: "Pahalanya senilai dengan berpuasa setahun penuh jika digabungkan dengan puasa Ramadan.",
        dalil: "Barangsiapa berpuasa Ramadan kemudian melanjutkannya dengan enam hari di bulan Syawal, maka itu seperti berpuasa sepanjang tahun.",
        source: "HR. Muslim no. 1164",
        isDailyRecommended: true,
      },
      {
        title: "Menyambung Tali Silaturahmi & Saling Memaafkan",
        category: "Sirah & Akhlak",
        description: "Mengunjungi orang tua, kerabat, tetangga, dan memaafkan kesalahan sesama muslim.",
        dalil: "Barangsiapa yang ingin dilapangkan rezekinya dan dipanjangkan umurnya, hendaklah ia menyambung silaturahmi.",
        source: "HR. Bukhari no. 2067",
        isDailyRecommended: true,
      }
    ],
    events: [
      {
        title: "Perang Uhud",
        year: "3 H",
        summary: "Ujian kesabaran para sahabat ketika regu pemanah meninggalkan posisi di bukit karena tergiur ghanimah.",
        lesson: "Kepatuhan mutlak pada instruksi Rasulullah dan bahaya cinta duniawi terhadap kemurnian perjuangan."
      },
      {
        title: "Perang Khandaq (Al-Ahzab)",
        year: "5 H",
        summary: "Pengepungan Madinah oleh pasukan gabungan kafir Quraisy dan kabilah Arab. Ide penggalian parit dicetuskan oleh Salman Al-Farisi RA.",
        lesson: "Pentingnya strategi musyawarah, menerima gagasan cerdas, dan doa mustajab dalam kesulitan."
      }
    ]
  },
  {
    monthIndex: 11,
    arabicName: "ذُو القَعْدَة",
    latinName: "Dzulqa'dah",
    alternateName: "Bulan Duduk (Tenang / Damai)",
    isHaramMonth: true,
    theme: "Bulan Haram, Ketenangan Jiwa & Persiapan Haji",
    description: "Bulan ke-11 dan salah satu dari 4 bulan haram. Bangsa Arab di masa lalu menghentikan peperangan dan 'duduk tenang' (qa'ada) di rumah mereka untuk bersiap menunaikan ibadah haji ke Makkah.",
    practices: [
      {
        title: "Menjaga Ketenangan & Menahan Lisan dari Pertengkaran",
        category: "Sirah & Akhlak",
        description: "Menghindari perdebatan sia-sia, ujaran kebencian, dan menjaga adab ketenangan hati.",
        dalil: "Musuh yang paling dibenci oleh Allah adalah orang yang paling keras dalam berdebat (gemar bermusuhan).",
        source: "HR. Muslim no. 2668",
        isDailyRecommended: true,
      },
      {
        title: "Menyiapkan Niat & Bekal Ibadah Haji / Umrah",
        category: "Dzikir & Doa",
        description: "Mempelajari manasik haji dan berdoa agar Allah memampukan langkah kaki mengunjungi Baitullah.",
        dalil: "Dan berserulah kepada manusia untuk mengerjakan haji, niscaya mereka akan datang kepadamu dengan berjalan kaki dan mengendarai unta yang kurus.",
        source: "QS. Al-Hajj: 27",
        isDailyRecommended: true,
      },
      {
        title: "Puasa Sunnah di Bulan-Bulan Haram",
        category: "Puasa",
        description: "Memperbanyak puasa sunnah sebagai bagian dari memuliakan bulan haram.",
        dalil: "Berpuasalah pada bulan-bulan haram dan berbukalah.",
        source: "HR. Abu Dawud no. 2428",
        isDailyRecommended: true,
      }
    ],
    events: [
      {
        title: "Perjanjian Hudaibiyah",
        year: "6 H",
        summary: "Perjanjian damai 10 tahun antara Rasulullah SAW dan kaum musyrikin Quraisy yang diakui Allah sebagai 'Kemenangan yang Nyata' (Fathan Mubina).",
        lesson: "Hikmah kesabaran diplomasi, melihat jauh ke depan, dan tidak tergesa-gesa mengedepankan emosi."
      },
      {
        title: "Bai'atur Ridwan",
        year: "6 H",
        summary: "Ikrar setia 1400 sahabat di bawah pohon untuk membela Rasulullah SAW hingga titik darah penghabisan setelah rumor terbunuhnya Utsman bin Affan RA.",
        lesson: "Allah meridhai orang-orang beriman yang berikrar setia menjaga kehormatan sesama saudaranya."
      }
    ]
  },
  {
    monthIndex: 12,
    arabicName: "ذُو الحِجَّة",
    latinName: "Dzulhijjah",
    alternateName: "Bulan Puncak Ibadah & Kurban",
    isHaramMonth: true,
    theme: "10 Hari Terbaik di Dunia, Arafah & Hari Raya Kurban",
    description: "Bulan penutup tahun Hijriah yang memiliki keutamaan luar biasa. Sepuluh hari pertamanya adalah hari-hari yang paling dicintai Allah untuk beramal shalih di atas muka bumi ini.",
    quranQuotes: {
      arabic: "وَالْفَجْرِ . وَلَيَالٍ عَشْرٍ",
      translation: "Demi fajar, dan malam yang sepuluh.",
      surah: "QS. Al-Fajr: 1-2 (Para mufassir sepakat yang dimaksud adalah 10 hari pertama Dzulhijjah)"
    },
    practices: [
      {
        title: "Amal Shalih Maksimal di 10 Hari Pertama Dzulhijjah",
        category: "Sirah & Akhlak",
        description: "Memperbanyak takbir (Allahu Akbar), tahlil (La ilaha illallah), tahmid (Alhamdulillah), sholat sunnah, dan sedekah.",
        dalil: "Tidak ada hari-hari di mana amal shalih lebih dicintai oleh Allah daripada hari-hari ini (10 hari pertama Dzulhijjah).",
        source: "HR. Bukhari no. 969",
        isDailyRecommended: true,
      },
      {
        title: "Puasa Arafah (9 Dzulhijjah)",
        category: "Puasa",
        description: "Puasa bagi yang tidak sedang wukuf di Arafah. Menghapuskan dosa setahun yang lalu dan setahun yang akan datang (2 tahun).",
        dalil: "Puasa hari Arafah, aku berharap kepada Allah agar menghapuskan dosa setahun sebelum dan sesudahnya.",
        source: "HR. Muslim no. 1162",
        isDailyRecommended: false,
      },
      {
        title: "Puasa Tarwiyah (8 Dzulhijjah)",
        category: "Puasa",
        description: "Disunnahkan berpuasa pada hari Tarwiyah sebagai bagian dari keutamaan 9 hari pertama Dzulhijjah.",
        dalil: "Termasuk dalam keutamaan umum amal shalih di 10 hari pertama Dzulhijjah.",
        source: "HR. Bukhari no. 969",
        isDailyRecommended: false,
      },
      {
        title: "Ibadah Kurban (Udhiyah) & Menjaga Kuku/Rambut",
        category: "Sedekah",
        description: "Menyembelih hewan ternak bagi yang mampu pada hari Nahar (10 Dzulhijjah) dan hari Tasyrik (11-13 Dzulhijjah). Yang berniat kurban dilarang mencukur kuku dan rambut sejak 1 Dzulhijjah hingga hewan disembelih.",
        dalil: "Tidak ada amalan anak cucu Adam pada hari raya kurban yang lebih dicintai Allah melebihi menumpahkan darah hewan kurban.",
        source: "HR. At-Tirmidzi no. 1493",
        isDailyRecommended: false,
      }
    ],
    events: [
      {
        title: "Haji Wada' (Haji Perpisahan Rasulullah SAW)",
        year: "10 H",
        summary: "Haji pertama dan terakhir Rasulullah SAW bersama lebih dari 100 ribu sahabat, di mana beliau menyampaikan khutbah perpisahan yang legendaris.",
        lesson: "Penegasan kesetaraan hak asasi manusia, larangan riba, perlindungan hak wanita, dan wasiat berpegang teguh pada Al-Qur'an dan Sunnah."
      },
      {
        title: "Turunnya Ayat Kesempurnaan Islam",
        year: "10 H (Hari Arafah)",
        summary: "Turunnya wahyu agung QS. Al-Ma'idah: 3 di Padang Arafah saat Rasulullah SAW sedang wukuf.",
        lesson: "'Pada hari ini telah Kusempurnakan untuk kamu agamamu, dan telah Ku-cukupkan kepadamu nikmat-Ku, dan telah Ku-ridhai Islam itu jadi agama bagimu.'"
      }
    ]
  }
];

export function getMonthInfoByIndex(monthIndex: number): IslamicMonthInfo {
  const normalized = ((monthIndex - 1) % 12) + 1;
  return ISLAMIC_MONTHS.find((m) => m.monthIndex === normalized) || ISLAMIC_MONTHS[0];
}
