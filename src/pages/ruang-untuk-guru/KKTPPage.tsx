import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Printer,
  FileText,
  Info,
  BookOpen,
} from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

type KKTPLevel = {
  label: string;
  rentang: string;
  deskripsi: string;
  color: string;
  bg: string;
  dot: string;
};

type TujuanPembelajaran = {
  kode: string;
  tp: string;
  levels: KKTPLevel[];
};

type MateriKKTP = {
  materi: string;
  elemen: string;
  semester: 1 | 2;
  tpList: TujuanPembelajaran[];
};

const levels4: (descs: [string, string, string, string]) => KKTPLevel[] = ([d1, d2, d3, d4]) => [
  {
    label: "Perlu Bimbingan",
    rentang: "0 – 40",
    deskripsi: d1,
    color: "text-rose-300",
    bg: "bg-rose-500/10 border-rose-500/25",
    dot: "bg-rose-400",
  },
  {
    label: "Cukup",
    rentang: "41 – 65",
    deskripsi: d2,
    color: "text-amber-300",
    bg: "bg-amber-500/10 border-amber-500/25",
    dot: "bg-amber-400",
  },
  {
    label: "Baik",
    rentang: "66 – 85",
    deskripsi: d3,
    color: "text-teal-300",
    bg: "bg-teal-500/10 border-teal-500/25",
    dot: "bg-teal-400",
  },
  {
    label: "Sangat Baik",
    rentang: "86 – 100",
    deskripsi: d4,
    color: "text-cyan-300",
    bg: "bg-cyan-500/10 border-cyan-500/25",
    dot: "bg-cyan-400",
  },
];

const kktpKelas7: MateriKKTP[] = [
  {
    materi: "Bilangan Bulat",
    elemen: "Bilangan",
    semester: 1,
    tpList: [
      {
        kode: "7.1.1",
        tp: "Peserta didik dapat membaca, menulis, dan membandingkan bilangan bulat (positif, negatif, dan nol) serta menentukan letaknya pada garis bilangan.",
        levels: levels4([
          "Belum dapat membaca, menulis, atau membandingkan bilangan bulat; memerlukan bimbingan penuh dalam memahami konsep bilangan bulat.",
          "Mampu membaca dan menulis bilangan bulat sederhana, namun masih kesulitan membandingkan bilangan negatif atau menentukan letaknya pada garis bilangan.",
          "Dapat membaca, menulis, membandingkan bilangan bulat, dan menentukan letaknya pada garis bilangan dengan benar pada sebagian besar soal.",
          "Mampu membaca, menulis, membandingkan, dan menentukan letak bilangan bulat pada garis bilangan secara akurat, serta dapat menjelaskan konsep kepada orang lain.",
        ]),
      },
      {
        kode: "7.1.2",
        tp: "Peserta didik dapat melakukan operasi hitung (penjumlahan, pengurangan, perkalian, dan pembagian) bilangan bulat beserta sifat-sifatnya.",
        levels: levels4([
          "Belum dapat melakukan operasi hitung bilangan bulat; melakukan banyak kesalahan mendasar pada penjumlahan dan pengurangan.",
          "Dapat melakukan penjumlahan dan pengurangan bilangan bulat, namun masih kesulitan pada operasi perkalian/pembagian yang melibatkan bilangan negatif.",
          "Dapat melakukan keempat operasi hitung bilangan bulat dengan benar dan memahami sifat-sifatnya pada sebagian besar kasus.",
          "Menguasai semua operasi hitung bilangan bulat, memahami dan dapat membuktikan sifat-sifatnya (komutatif, asosiatif, distributif), serta menerapkannya dalam pemecahan masalah.",
        ]),
      },
      {
        kode: "7.1.3",
        tp: "Peserta didik dapat menentukan KPK dan FPB dari dua bilangan atau lebih dengan cara faktorisasi prima dan menerapkannya dalam masalah sehari-hari.",
        levels: levels4([
          "Belum dapat menentukan KPK dan FPB; belum memahami konsep faktorisasi prima.",
          "Dapat menentukan faktorisasi prima, namun masih melakukan kesalahan dalam menentukan KPK atau FPB dari tiga bilangan atau lebih.",
          "Dapat menentukan KPK dan FPB dengan metode faktorisasi prima dengan benar dan menerapkannya dalam konteks sederhana.",
          "Dapat menentukan KPK dan FPB dengan berbagai metode, menerapkannya dalam berbagai masalah kontekstual, dan menjelaskan alasan pemilihan metode.",
        ]),
      },
    ],
  },
  {
    materi: "Bilangan Rasional (Pecahan)",
    elemen: "Bilangan",
    semester: 1,
    tpList: [
      {
        kode: "7.2.1",
        tp: "Peserta didik dapat memahami konsep bilangan rasional (pecahan biasa, campuran, desimal, persen) dan mengubah bentuk-bentuknya.",
        levels: levels4([
          "Belum dapat membedakan jenis-jenis pecahan dan tidak mampu mengubah bentuk pecahan.",
          "Dapat mengubah pecahan biasa ke desimal atau sebaliknya, namun kesulitan pada pecahan campuran dan persen.",
          "Dapat mengubah berbagai bentuk pecahan dengan benar pada sebagian besar kasus.",
          "Menguasai semua konversi bentuk pecahan dan dapat menerapkannya dalam konteks masalah yang beragam.",
        ]),
      },
      {
        kode: "7.2.2",
        tp: "Peserta didik dapat melakukan operasi hitung pada bilangan rasional (pecahan) dan menyelesaikan masalah yang berkaitan.",
        levels: levels4([
          "Belum dapat melakukan operasi hitung pecahan; banyak kesalahan dalam penjumlahan pecahan berpenyebut sama.",
          "Dapat menjumlahkan dan mengurangkan pecahan berpenyebut berbeda, namun kesulitan pada perkalian dan pembagian pecahan campuran.",
          "Dapat melakukan keempat operasi hitung pecahan dan menyelesaikan masalah kontekstual sederhana.",
          "Menguasai operasi hitung pecahan, menyelesaikan masalah bertingkat, dan dapat memilih strategi yang efisien.",
        ]),
      },
    ],
  },
  {
    materi: "Bentuk Aljabar",
    elemen: "Aljabar",
    semester: 1,
    tpList: [
      {
        kode: "7.3.1",
        tp: "Peserta didik dapat mengenal unsur-unsur bentuk aljabar (variabel, koefisien, konstanta, suku) dan menyederhanakan bentuk aljabar.",
        levels: levels4([
          "Belum dapat mengidentifikasi unsur-unsur bentuk aljabar; tidak dapat membedakan variabel dan konstanta.",
          "Dapat mengidentifikasi variabel, koefisien, dan konstanta, namun kesulitan menyederhanakan bentuk aljabar dengan banyak suku.",
          "Dapat mengidentifikasi semua unsur dan menyederhanakan bentuk aljabar dengan mengelompokkan suku sejenis.",
          "Menguasai semua unsur bentuk aljabar, dapat menyederhanakan ekspresi kompleks, dan menggunakan aljabar untuk memodelkan situasi nyata.",
        ]),
      },
      {
        kode: "7.3.2",
        tp: "Peserta didik dapat melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian pada bentuk aljabar.",
        levels: levels4([
          "Belum dapat melakukan operasi pada bentuk aljabar; sering salah dalam menjumlahkan suku tidak sejenis.",
          "Dapat menjumlahkan dan mengurangkan bentuk aljabar, namun masih kesulitan pada perkalian bentuk aljabar.",
          "Dapat melakukan keempat operasi pada bentuk aljabar dengan benar termasuk perkalian dua suku.",
          "Menguasai semua operasi aljabar termasuk pemfaktoran dan mampu menyelesaikan masalah kontekstual yang kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "PLSV dan PTLSV",
    elemen: "Aljabar",
    semester: 1,
    tpList: [
      {
        kode: "7.4.1",
        tp: "Peserta didik dapat menyelesaikan persamaan linear satu variabel (PLSV) dan menafsirkan solusinya dalam konteks masalah.",
        levels: levels4([
          "Belum dapat menyelesaikan PLSV sederhana; tidak memahami konsep keseimbangan persamaan.",
          "Dapat menyelesaikan PLSV sederhana (satu langkah), namun kesulitan pada PLSV yang memerlukan beberapa langkah.",
          "Dapat menyelesaikan PLSV multi-langkah dan menafsirkan solusi dalam konteks masalah sehari-hari.",
          "Menguasai penyelesaian PLSV, dapat membuat model matematika dari masalah dan memvalidasi solusi dalam konteks.",
        ]),
      },
      {
        kode: "7.4.2",
        tp: "Peserta didik dapat menyelesaikan pertidaksamaan linear satu variabel (PTLSV) dan menyajikan himpunan penyelesaiannya.",
        levels: levels4([
          "Belum dapat menyelesaikan PTLSV; tidak memahami arah tanda pertidaksamaan.",
          "Dapat menyelesaikan PTLSV sederhana, namun sering keliru membalik tanda saat dikalikan bilangan negatif.",
          "Dapat menyelesaikan PTLSV dan menyajikan himpunan penyelesaiannya dalam garis bilangan.",
          "Menguasai PTLSV, dapat menyajikan penyelesaian dalam berbagai bentuk, dan menerapkannya dalam masalah kontekstual.",
        ]),
      },
    ],
  },
  {
    materi: "Perbandingan",
    elemen: "Bilangan",
    semester: 2,
    tpList: [
      {
        kode: "7.5.1",
        tp: "Peserta didik dapat memahami dan menerapkan perbandingan senilai dan berbalik nilai dalam pemecahan masalah sehari-hari.",
        levels: levels4([
          "Belum dapat membedakan perbandingan senilai dan berbalik nilai; tidak dapat menyatakan perbandingan dalam bentuk paling sederhana.",
          "Dapat mengidentifikasi jenis perbandingan dan menyelesaikan soal sederhana, namun kesulitan pada soal kontekstual.",
          "Dapat menyelesaikan masalah perbandingan senilai dan berbalik nilai dalam berbagai konteks sehari-hari.",
          "Menguasai konsep perbandingan, dapat membuat model dan menyelesaikan masalah kompleks termasuk masalah skala dan proporsi.",
        ]),
      },
    ],
  },
  {
    materi: "Aritmetika Sosial",
    elemen: "Bilangan",
    semester: 2,
    tpList: [
      {
        kode: "7.6.1",
        tp: "Peserta didik dapat menyelesaikan masalah jual-beli (untung, rugi, impas), diskon, pajak, bruto-netto-tara, dan bunga tunggal.",
        levels: levels4([
          "Belum dapat menghitung untung/rugi dasar; tidak memahami konsep harga beli dan harga jual.",
          "Dapat menghitung untung/rugi sederhana dan diskon, namun kesulitan pada pajak, bruto-netto-tara, atau bunga tunggal.",
          "Dapat menyelesaikan semua topik aritmetika sosial dalam konteks soal sehari-hari.",
          "Menguasai aritmetika sosial, dapat menganalisis dan menyelesaikan masalah keuangan kompleks, serta memilih strategi yang paling efisien.",
        ]),
      },
    ],
  },
  {
    materi: "Garis dan Sudut",
    elemen: "Geometri",
    semester: 2,
    tpList: [
      {
        kode: "7.7.1",
        tp: "Peserta didik dapat memahami hubungan antar sudut (berpelurus, berpenyiku, bertolak belakang) dan sifat garis sejajar yang dipotong garis transversal.",
        levels: levels4([
          "Belum dapat mengidentifikasi jenis-jenis sudut dan hubungannya.",
          "Dapat mengidentifikasi hubungan sudut sederhana, namun kesulitan pada sudut yang terbentuk oleh garis sejajar dan transversal.",
          "Dapat menentukan besar sudut yang tidak diketahui menggunakan sifat hubungan sudut dan garis sejajar.",
          "Menguasai seluruh hubungan sudut, dapat membuktikan dan menerapkannya dalam masalah geometri yang kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "Segitiga dan Segiempat",
    elemen: "Geometri & Pengukuran",
    semester: 2,
    tpList: [
      {
        kode: "7.8.1",
        tp: "Peserta didik dapat menentukan keliling dan luas segitiga, persegi, persegi panjang, jajar genjang, trapesium, layang-layang, dan belah ketupat.",
        levels: levels4([
          "Belum dapat menggunakan rumus keliling dan luas bangun datar dasar.",
          "Dapat menghitung keliling dan luas persegi dan persegi panjang, namun kesulitan pada bangun datar lainnya.",
          "Dapat menghitung keliling dan luas semua jenis segitiga dan segiempat yang ditentukan.",
          "Menguasai semua rumus, dapat menganalisis dan menyelesaikan masalah bangun gabungan serta soal kontekstual.",
        ]),
      },
    ],
  },
  {
    materi: "Himpunan",
    elemen: "Aljabar",
    semester: 2,
    tpList: [
      {
        kode: "7.9.1",
        tp: "Peserta didik dapat memahami konsep himpunan, melakukan operasi himpunan (irisan, gabungan, selisih, komplemen), dan menyajikannya dalam diagram Venn.",
        levels: levels4([
          "Belum dapat mendefinisikan himpunan atau menyatakan anggota himpunan dengan benar.",
          "Dapat mendefinisikan himpunan dan menentukan anggotanya, namun kesulitan pada operasi dan diagram Venn.",
          "Dapat melakukan operasi himpunan dan menyajikannya dalam diagram Venn untuk menyelesaikan masalah.",
          "Menguasai semua operasi himpunan, dapat membuat dan menginterpretasikan diagram Venn kompleks, serta menerapkannya dalam masalah sehari-hari.",
        ]),
      },
    ],
  },
];

const kktpKelas8: MateriKKTP[] = [
  {
    materi: "Pola Bilangan",
    elemen: "Aljabar",
    semester: 1,
    tpList: [
      {
        kode: "8.1.1",
        tp: "Peserta didik dapat mengenal dan menggeneralisasi pola bilangan, serta menentukan suku ke-n barisan aritmetika dan geometri.",
        levels: levels4([
          "Belum dapat mengenali pola bilangan sederhana; tidak dapat melanjutkan barisan bilangan.",
          "Dapat mengenali dan melanjutkan pola bilangan sederhana, namun kesulitan menentukan suku ke-n barisan aritmetika.",
          "Dapat menentukan suku ke-n barisan aritmetika dan geometri menggunakan rumus dengan tepat.",
          "Menguasai pola bilangan dan barisan, dapat membuktikan rumus, dan menerapkannya dalam masalah kontekstual yang kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "Koordinat Kartesius",
    elemen: "Geometri",
    semester: 1,
    tpList: [
      {
        kode: "8.2.1",
        tp: "Peserta didik dapat menentukan posisi titik dalam bidang koordinat Kartesius dan menerapkan konsep jarak antar titik.",
        levels: levels4([
          "Belum dapat menentukan koordinat titik dalam bidang Kartesius; tidak memahami konsep absis dan ordinat.",
          "Dapat menentukan koordinat titik di semua kuadran, namun kesulitan menghitung jarak antar titik.",
          "Dapat menentukan posisi titik, menghitung jarak, dan menyelesaikan masalah geometri sederhana pada koordinat.",
          "Menguasai koordinat Kartesius, dapat menganalisis posisi dan jarak titik dalam masalah kontekstual yang kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "Relasi dan Fungsi",
    elemen: "Aljabar",
    semester: 1,
    tpList: [
      {
        kode: "8.3.1",
        tp: "Peserta didik dapat memahami konsep relasi dan fungsi (domain, kodomain, range) serta menyajikannya dalam berbagai representasi.",
        levels: levels4([
          "Belum dapat membedakan relasi dan fungsi; tidak memahami konsep domain dan range.",
          "Dapat mendefinisikan fungsi dan menyajikannya dalam diagram panah, namun kesulitan menyajikan dalam grafik.",
          "Dapat menyajikan fungsi dalam berbagai representasi (diagram panah, tabel, himpunan pasangan, grafik).",
          "Menguasai konsep relasi dan fungsi, dapat menganalisis dan menginterpretasikan representasi fungsi serta menyelesaikan masalah.",
        ]),
      },
      {
        kode: "8.3.2",
        tp: "Peserta didik dapat menentukan nilai fungsi dan menyelesaikan masalah yang berkaitan dengan fungsi linear.",
        levels: levels4([
          "Belum dapat menghitung nilai fungsi jika diberikan nilai variabelnya.",
          "Dapat menghitung nilai fungsi linear sederhana, namun kesulitan membuat grafik atau menyelesaikan masalah kontekstual.",
          "Dapat menghitung nilai fungsi, membuat grafik, dan menyelesaikan masalah kontekstual fungsi linear.",
          "Menguasai fungsi linear, dapat menganalisis grafik, menentukan persamaan, dan menyelesaikan masalah kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "Persamaan Garis Lurus",
    elemen: "Aljabar",
    semester: 1,
    tpList: [
      {
        kode: "8.4.1",
        tp: "Peserta didik dapat memahami gradien, menentukan persamaan garis lurus, dan menentukan hubungan dua garis (sejajar/tegak lurus).",
        levels: levels4([
          "Belum dapat menghitung gradien garis dari dua titik atau persamaan garis.",
          "Dapat menghitung gradien dan menentukan persamaan garis dalam bentuk y = mx + c, namun kesulitan pada syarat sejajar/tegak lurus.",
          "Dapat menentukan gradien, persamaan garis, dan menganalisis hubungan dua garis sejajar atau tegak lurus.",
          "Menguasai persamaan garis lurus, dapat menganalisis dan menyelesaikan masalah geometri analitik yang kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "SPLDV",
    elemen: "Aljabar",
    semester: 2,
    tpList: [
      {
        kode: "8.5.1",
        tp: "Peserta didik dapat menyelesaikan sistem persamaan linear dua variabel (SPLDV) dengan metode grafik, substitusi, eliminasi, dan gabungan.",
        levels: levels4([
          "Belum dapat menyusun atau menyelesaikan SPLDV; tidak dapat membuat model matematika dari masalah.",
          "Dapat menyelesaikan SPLDV sederhana dengan satu metode (substitusi), namun kesulitan pada metode lain.",
          "Dapat menyelesaikan SPLDV dengan minimal dua metode dan menerapkannya dalam masalah sehari-hari.",
          "Menguasai semua metode SPLDV, memilih metode paling efisien, dan menyelesaikan masalah kontekstual yang kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "Teorema Pythagoras",
    elemen: "Geometri",
    semester: 2,
    tpList: [
      {
        kode: "8.6.1",
        tp: "Peserta didik dapat membuktikan dan menggunakan teorema Pythagoras, serta mengenal triple Pythagoras dalam pemecahan masalah.",
        levels: levels4([
          "Belum dapat menyebutkan bunyi teorema Pythagoras; tidak dapat menghitung sisi miring segitiga siku-siku.",
          "Dapat menggunakan rumus Pythagoras untuk mencari sisi miring, namun kesulitan mencari sisi lain atau dalam konteks.",
          "Dapat menggunakan teorema Pythagoras untuk mencari semua sisi dan menerapkannya dalam masalah sehari-hari.",
          "Menguasai teorema Pythagoras, mengenal triple Pythagoras, membuktikan teorema, dan menyelesaikan masalah kontekstual kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "Lingkaran",
    elemen: "Pengukuran & Geometri",
    semester: 2,
    tpList: [
      {
        kode: "8.7.1",
        tp: "Peserta didik dapat menghitung keliling, luas, panjang busur, luas juring lingkaran, dan memahami hubungan sudut pusat dengan sudut keliling.",
        levels: levels4([
          "Belum dapat menghitung keliling dan luas lingkaran menggunakan rumus.",
          "Dapat menghitung keliling dan luas lingkaran, namun kesulitan pada busur, juring, atau sudut pusat/keliling.",
          "Dapat menghitung keliling, luas, busur, juring, dan menentukan hubungan sudut pusat dengan sudut keliling.",
          "Menguasai semua konsep lingkaran, dapat membuktikan hubungan sudut, dan menyelesaikan masalah kontekstual kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "Bangun Ruang Sisi Datar",
    elemen: "Pengukuran & Geometri",
    semester: 2,
    tpList: [
      {
        kode: "8.8.1",
        tp: "Peserta didik dapat menghitung luas permukaan dan volume kubus, balok, prisma, dan limas, serta menyelesaikan masalah gabungan bangun ruang.",
        levels: levels4([
          "Belum dapat menghitung luas permukaan atau volume bangun ruang sisi datar.",
          "Dapat menghitung luas permukaan dan volume kubus dan balok, namun kesulitan pada prisma dan limas.",
          "Dapat menghitung luas permukaan dan volume semua bangun ruang sisi datar yang ditentukan.",
          "Menguasai bangun ruang sisi datar, dapat menyelesaikan masalah bangun gabungan dan soal kontekstual yang kompleks.",
        ]),
      },
    ],
  },
];

const kktpKelas9: MateriKKTP[] = [
  {
    materi: "Bilangan Berpangkat & Bentuk Akar",
    elemen: "Bilangan",
    semester: 1,
    tpList: [
      {
        kode: "9.1.1",
        tp: "Peserta didik dapat memahami dan menggunakan sifat-sifat bilangan berpangkat (bulat positif, negatif, nol, dan pecahan) serta bentuk akar.",
        levels: levels4([
          "Belum memahami konsep bilangan berpangkat; tidak dapat menggunakan sifat-sifat dasar pangkat.",
          "Dapat menggunakan sifat pangkat positif, namun kesulitan pada pangkat negatif, nol, atau pecahan.",
          "Dapat menerapkan semua sifat bilangan berpangkat dan menyederhanakan bentuk akar.",
          "Menguasai bilangan berpangkat dan bentuk akar, mampu merasionalkan penyebut dan menyelesaikan masalah kontekstual.",
        ]),
      },
      {
        kode: "9.1.2",
        tp: "Peserta didik dapat menyatakan bilangan dalam notasi ilmiah (bentuk baku) dan melakukan operasi pada bilangan dalam notasi ilmiah.",
        levels: levels4([
          "Belum dapat menyatakan bilangan dalam notasi ilmiah.",
          "Dapat menyatakan bilangan sangat besar dalam notasi ilmiah, namun kesulitan pada bilangan sangat kecil atau operasinya.",
          "Dapat menyatakan dan melakukan operasi bilangan dalam notasi ilmiah dengan benar.",
          "Menguasai notasi ilmiah, dapat menerapkannya dalam konteks sains dan teknologi, serta melakukan operasi yang kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "Persamaan Kuadrat",
    elemen: "Aljabar",
    semester: 1,
    tpList: [
      {
        kode: "9.2.1",
        tp: "Peserta didik dapat menentukan akar persamaan kuadrat dengan metode pemfaktoran, melengkapi kuadrat sempurna, dan rumus kuadratik.",
        levels: levels4([
          "Belum dapat memfaktorkan bentuk kuadrat sederhana; tidak memahami konsep akar persamaan kuadrat.",
          "Dapat menyelesaikan persamaan kuadrat dengan pemfaktoran sederhana, namun kesulitan menggunakan rumus kuadratik.",
          "Dapat menyelesaikan persamaan kuadrat dengan ketiga metode dan menentukan jenis akar (real/imajiner).",
          "Menguasai semua metode persamaan kuadrat, dapat memilih metode paling efisien, dan menyelesaikan masalah kontekstual.",
        ]),
      },
    ],
  },
  {
    materi: "Fungsi Kuadrat",
    elemen: "Aljabar",
    semester: 1,
    tpList: [
      {
        kode: "9.3.1",
        tp: "Peserta didik dapat memahami grafik fungsi kuadrat, menentukan titik puncak, sumbu simetri, titik potong, dan menginterpretasikannya.",
        levels: levels4([
          "Belum dapat menggambar grafik fungsi kuadrat atau mengidentifikasi karakteristiknya.",
          "Dapat menggambar grafik dan mengidentifikasi arah parabola, namun kesulitan menentukan titik puncak atau sumbu simetri.",
          "Dapat menganalisis grafik fungsi kuadrat (titik puncak, sumbu simetri, titik potong sumbu) dan menyelesaikan masalah.",
          "Menguasai fungsi kuadrat, dapat mengonstruksi fungsi dari karakteristik yang diberikan, dan menyelesaikan masalah optimasi.",
        ]),
      },
    ],
  },
  {
    materi: "Transformasi Geometri",
    elemen: "Geometri",
    semester: 1,
    tpList: [
      {
        kode: "9.4.1",
        tp: "Peserta didik dapat melakukan transformasi (translasi, refleksi, rotasi, dilatasi) pada titik, garis, dan bangun datar di koordinat Kartesius.",
        levels: levels4([
          "Belum dapat melakukan transformasi sederhana (translasi) pada titik di koordinat Kartesius.",
          "Dapat melakukan translasi dan refleksi pada bangun datar, namun kesulitan pada rotasi dan dilatasi.",
          "Dapat melakukan semua jenis transformasi tunggal pada bangun datar dan menentukan koordinat hasil transformasi.",
          "Menguasai semua transformasi, dapat melakukan komposisi transformasi, dan menyelesaikan masalah kontekstual yang kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "Kesebangunan & Kekongruenan",
    elemen: "Geometri",
    semester: 2,
    tpList: [
      {
        kode: "9.5.1",
        tp: "Peserta didik dapat memahami dan menggunakan konsep kesebangunan dan kekongruenan bangun datar dalam pemecahan masalah.",
        levels: levels4([
          "Belum dapat membedakan bangun yang sebangun dan kongruen; tidak memahami syarat-syaratnya.",
          "Dapat mengidentifikasi bangun yang sebangun atau kongruen, namun kesulitan menentukan panjang sisi yang belum diketahui.",
          "Dapat menggunakan sifat kesebangunan dan kekongruenan untuk menentukan unsur yang belum diketahui.",
          "Menguasai konsep, dapat membuktikan kesebangunan/kekongruenan, dan menerapkannya dalam masalah pengukuran tak langsung.",
        ]),
      },
    ],
  },
  {
    materi: "Bangun Ruang Sisi Lengkung",
    elemen: "Pengukuran & Geometri",
    semester: 2,
    tpList: [
      {
        kode: "9.6.1",
        tp: "Peserta didik dapat menghitung luas permukaan dan volume tabung, kerucut, bola, dan gabungannya.",
        levels: levels4([
          "Belum dapat mengidentifikasi unsur bangun ruang sisi lengkung atau menghitung luas permukaannya.",
          "Dapat menghitung luas permukaan dan volume tabung, namun kesulitan pada kerucut dan bola.",
          "Dapat menghitung luas permukaan dan volume tabung, kerucut, dan bola serta menerapkannya dalam soal.",
          "Menguasai semua bangun ruang sisi lengkung, dapat menyelesaikan soal gabungan dan masalah kontekstual yang kompleks.",
        ]),
      },
    ],
  },
  {
    materi: "Statistika",
    elemen: "Analisis Data dan Peluang",
    semester: 2,
    tpList: [
      {
        kode: "9.7.1",
        tp: "Peserta didik dapat menyajikan data, menghitung dan menafsirkan mean, median, modus, dan jangkauan dari suatu data.",
        levels: levels4([
          "Belum dapat menghitung mean (rata-rata) dari data sederhana.",
          "Dapat menghitung mean, namun kesulitan menentukan median dan modus data berkelompok.",
          "Dapat menyajikan data, menghitung mean, median, modus, dan jangkauan serta menafsirkannya.",
          "Menguasai statistik deskriptif, dapat membandingkan distribusi data, menarik kesimpulan, dan membuat keputusan berdasarkan data.",
        ]),
      },
    ],
  },
  {
    materi: "Peluang",
    elemen: "Analisis Data dan Peluang",
    semester: 2,
    tpList: [
      {
        kode: "9.8.1",
        tp: "Peserta didik dapat menentukan ruang sampel, menghitung peluang empiris dan teoritis, serta frekuensi harapan suatu kejadian.",
        levels: levels4([
          "Belum dapat mendefinisikan ruang sampel atau menghitung peluang kejadian sederhana.",
          "Dapat menghitung peluang teoritis kejadian tunggal, namun kesulitan pada peluang empiris atau frekuensi harapan.",
          "Dapat menentukan ruang sampel, menghitung peluang teoritis dan empiris, serta frekuensi harapan.",
          "Menguasai konsep peluang, dapat menghitung peluang kejadian majemuk, dan menginterpretasikan hasil dalam konteks.",
        ]),
      },
    ],
  },
];

const allData: Record<"kelas7" | "kelas8" | "kelas9", MateriKKTP[]> = {
  kelas7: kktpKelas7,
  kelas8: kktpKelas8,
  kelas9: kktpKelas9,
};

type KelasKey = "kelas7" | "kelas8" | "kelas9";

const buildWordHTML = (kelas: KelasKey, kelasNum: string, data: MateriKKTP[]) => {
  const kelasRom = kelasNum === "7" ? "VII" : kelasNum === "8" ? "VIII" : "IX";
  const rows = data.flatMap((m, mi) =>
    m.tpList.map((tp, ti) => {
      const levels = tp.levels
        .map(l => `<tr><td style="border:1px solid #ccc;padding:5px 8px;color:#333;">${l.label} (${l.rentang})</td><td style="border:1px solid #ccc;padding:5px 8px;">${l.deskripsi}</td></tr>`)
        .join("");
      return `
        <tr style="background:#e8f4f8;">
          <td colspan="3" style="border:1px solid #ccc;padding:6px 8px;font-weight:bold;color:#1a7a6e;">
            ${mi + 1}.${ti + 1} ${tp.kode} — ${m.materi} (Semester ${m.semester})
          </td>
        </tr>
        <tr>
          <td colspan="3" style="border:1px solid #ccc;padding:5px 8px;font-style:italic;color:#444;">${tp.tp}</td>
        </tr>
        <tr style="background:#f0faf8;">
          <td style="border:1px solid #ccc;padding:5px 8px;font-weight:bold;color:#1a7a6e;">Kategori KKTP</td>
          <td style="border:1px solid #ccc;padding:5px 8px;font-weight:bold;color:#1a7a6e;">Deskripsi Capaian</td>
        </tr>
        ${levels}
      `;
    })
  ).join("");

  return `<html><head><meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 11pt; margin: 2cm; }
  h2 { text-align: center; font-size: 14pt; margin-bottom: 4px; }
  h3 { text-align: center; font-size: 12pt; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 10pt; margin-bottom: 8px; }
  th { background: #1a7a6e; color: white; border: 1px solid #ccc; padding: 8px; }
  .info td { border: none; padding: 3px 8px; }
  .info .label { width: 200px; font-weight: bold; }
</style>
</head><body>
<h2>KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)</h2>
<h3>Matematika SMP Kelas ${kelasRom} — Kurikulum Merdeka (Fase D)</h3>
<table class="info" style="margin-bottom:16px;">
  <tr><td class="label">Satuan Pendidikan</td><td>:</td><td>SMP / MTs</td></tr>
  <tr><td class="label">Mata Pelajaran</td><td>:</td><td>Matematika</td></tr>
  <tr><td class="label">Kelas</td><td>:</td><td>${kelasRom} (${kelasNum === "7" ? "Tujuh" : kelasNum === "8" ? "Delapan" : "Sembilan"})</td></tr>
  <tr><td class="label">Fase</td><td>:</td><td>Fase D</td></tr>
  <tr><td class="label">Kurikulum</td><td>:</td><td>Kurikulum Merdeka</td></tr>
  <tr><td class="label">Guru Mata Pelajaran</td><td>:</td><td>___________________________</td></tr>
</table>
<p style="font-size:10pt;margin-bottom:12px;"><strong>Keterangan Interval KKTP:</strong>
  Perlu Bimbingan (0–40) | Cukup (41–65) | Baik (66–85) | Sangat Baik (86–100)</p>
<table>
  <thead>
    <tr>
      <th colspan="3">Rincian KKTP per Tujuan Pembelajaran — Kelas ${kelasRom}</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<br/>
<table style="width:100%;margin-top:24px;border:none;">
  <tr>
    <td style="width:50%;text-align:center;border:none;">
      <p>Mengetahui,<br/>Kepala Sekolah</p><br/><br/><br/>
      <p>____________________________<br/>NIP. ________________________</p>
    </td>
    <td style="width:50%;text-align:center;border:none;">
      <p>_____________, __________ 20__<br/>Guru Mata Pelajaran Matematika</p><br/><br/><br/>
      <p>____________________________<br/>NIP. ________________________</p>
    </td>
  </tr>
</table>
</body></html>`;
};

const levelColors = [
  { bg: "bg-rose-500/10 border-rose-500/25", text: "text-rose-300", badge: "bg-rose-500/20 text-rose-200", dot: "bg-rose-400" },
  { bg: "bg-amber-500/10 border-amber-500/25", text: "text-amber-300", badge: "bg-amber-500/20 text-amber-200", dot: "bg-amber-400" },
  { bg: "bg-teal-500/10 border-teal-500/25", text: "text-teal-300", badge: "bg-teal-500/20 text-teal-200", dot: "bg-teal-400" },
  { bg: "bg-cyan-500/10 border-cyan-500/25", text: "text-cyan-300", badge: "bg-cyan-500/20 text-cyan-200", dot: "bg-cyan-400" },
];

const elemenColor: Record<string, string> = {
  "Bilangan": "border-blue-400/40 bg-blue-500/10 text-blue-300",
  "Aljabar": "border-violet-400/40 bg-violet-500/10 text-violet-300",
  "Geometri": "border-amber-400/40 bg-amber-500/10 text-amber-300",
  "Pengukuran": "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  "Pengukuran & Geometri": "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  "Geometri & Pengukuran": "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  "Analisis Data dan Peluang": "border-pink-400/40 bg-pink-500/10 text-pink-300",
};

const KKTPPage = () => {
  const navigate = useNavigate();
  const [kelas, setKelas] = useState<KelasKey>("kelas7");
  const [filterSem, setFilterSem] = useState<"semua" | "1" | "2">("semua");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const kelasNum = kelas.replace("kelas", "");
  const kelasRom = kelasNum === "7" ? "VII" : kelasNum === "8" ? "VIII" : "IX";
  const data = allData[kelas];

  const filtered = data.filter(m =>
    filterSem === "semua" ? true : m.semester === parseInt(filterSem)
  );

  const toggleAll = (open: boolean) => {
    const next: Record<string, boolean> = {};
    filtered.forEach(m => m.tpList.forEach(tp => { next[tp.kode] = open; }));
    setExpanded(next);
  };

  const handlePrintPDF = () => {
    playPopSound();
    const html = buildWordHTML(kelas, kelasNum, data);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 400);
    }
  };

  const handleDownloadWord = () => {
    playPopSound();
    const content = buildWordHTML(kelas, kelasNum, data);
    const blob = new Blob(["\ufeff", content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KKTP_Matematika_Kelas${kelasNum}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalTP = filtered.reduce((s, m) => s + m.tpList.length, 0);

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-14">

        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <ClipboardList className="w-4 h-4" />
            Kurikulum Merdeka · Fase D
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN
          </h1>
          <p className="mt-1 text-sm font-bold text-teal-400 tracking-widest">KKTP — Matematika SMP</p>
          <p className="mt-3 text-sm text-white/60 font-body max-w-3xl mx-auto">
            KKTP menggantikan KKM dalam Kurikulum Merdeka. Kriteria ini mendeskripsikan kemampuan minimal yang harus dicapai peserta didik untuk setiap Tujuan Pembelajaran (TP), menggunakan interval nilai dan deskripsi capaian.
          </p>
        </div>

        {/* Konsep Box */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-4 mb-6 animate-slide-up">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-indigo-200 font-bold text-xs uppercase tracking-wider mb-2">Tentang KKTP (Permendikbudristek No. 21 Tahun 2022)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/70 font-body">
                <p>• KKTP ditetapkan oleh guru di awal tahun pelajaran sebagai acuan ketuntasan belajar.</p>
                <p>• KKTP dapat berupa deskripsi, rubrik, atau interval nilai sesuai karakteristik TP.</p>
                <p>• Peserta didik yang belum mencapai KKTP mendapat program remedial/bimbingan.</p>
                <p>• Peserta didik yang melampaui KKTP mendapat program pengayaan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interval Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-slide-up">
          {[
            { label: "Perlu Bimbingan", rentang: "0 – 40", desc: "Belum mencapai TP → Remedial", color: "bg-rose-500/15 border-rose-400/30", text: "text-rose-300" },
            { label: "Cukup", rentang: "41 – 65", desc: "Belum mencapai TP → Remedial", color: "bg-amber-500/15 border-amber-400/30", text: "text-amber-300" },
            { label: "Baik", rentang: "66 – 85", desc: "Sudah mencapai TP ✓", color: "bg-teal-500/15 border-teal-400/30", text: "text-teal-300" },
            { label: "Sangat Baik", rentang: "86 – 100", desc: "Melampaui TP → Pengayaan", color: "bg-cyan-500/15 border-cyan-400/30", text: "text-cyan-300" },
          ].map((c, i) => (
            <div key={i} className={`rounded-xl border ${c.color} p-3`}>
              <p className={`font-bold text-xs ${c.text} mb-1`}>{c.label}</p>
              <p className="text-white text-sm font-bold">{c.rentang}</p>
              <p className="text-white/50 text-[10px] mt-1">{c.desc}</p>
            </div>
          ))}
        </div>


        {/* Kelas Tabs */}
        <div className="flex justify-center gap-2 mb-4 animate-slide-up">
          {(["kelas7", "kelas8", "kelas9"] as KelasKey[]).map((k) => (
            <button
              key={k}
              onClick={() => { playPopSound(); setKelas(k); setExpanded({}); }}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                kelas === k
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              Kelas {k.replace("kelas", "")}
            </button>
          ))}
        </div>

        {/* Semester Filter */}
        <div className="flex justify-center gap-2 mb-5 animate-slide-up">
          {([
            { value: "semua", label: "Semua Semester" },
            { value: "1", label: "Semester Ganjil" },
            { value: "2", label: "Semester Genap" },
          ] as const).map(s => (
            <button
              key={s.value}
              onClick={() => { playPopSound(); setFilterSem(s.value); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filterSem === s.value
                  ? "bg-cyan-600 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Stats & Controls */}
        <div className="flex items-center justify-between mb-5 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs">
              <span className="text-white/50">Kelas {kelasNum} · </span>
              <span className="text-teal-300 font-bold">{filtered.length} Materi</span>
              <span className="text-white/50"> · </span>
              <span className="text-cyan-300 font-bold">{totalTP} Tujuan Pembelajaran</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleAll(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
            >
              Buka Semua
            </button>
            <button
              onClick={() => toggleAll(false)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
            >
              Tutup Semua
            </button>
          </div>
        </div>

        {/* Identitas */}
        <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-4 mb-6 animate-slide-up">
          <p className="text-teal-300 text-xs font-bold mb-3 uppercase tracking-wider">📄 Identitas KKTP</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-xs font-body">
            {[
              ["Satuan Pendidikan", "SMP / MTs"],
              ["Mata Pelajaran", "Matematika"],
              ["Kelas / Fase", `${kelasNum} (${kelasRom}) / Fase D`],
              ["Kurikulum", "Kurikulum Merdeka"],
              ["Alokasi Waktu", "5 JP / Minggu (1 JP = 40 menit)"],
              ["Metode KKTP", "Interval Nilai dengan Deskripsi Capaian"],
              ["Acuan Regulasi", "Permendikbudristek No. 21 Tahun 2022"],
              ["Guru Mata Pelajaran", "___________________________"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-white/50 w-44 shrink-0">{k}</span>
                <span className="text-white/20 shrink-0">:</span>
                <span className="text-white/80">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KKTP Cards */}
        <div className="space-y-5 mb-10">
          {filtered.map((materi, mi) => {
            const elCol = elemenColor[materi.elemen] ?? "border-white/20 bg-white/5 text-white/70";
            return (
              <div
                key={materi.materi + materi.semester}
                className="bg-card/70 backdrop-blur border border-white/10 rounded-2xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${mi * 0.05}s` }}
              >
                {/* Materi Header */}
                <div className="bg-white/5 border-b border-white/10 px-5 py-4 flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-teal-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display font-bold text-white text-base">{materi.materi}</h2>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${elCol}`}>
                        {materi.elemen}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        materi.semester === 1 ? "bg-cyan-500/15 text-cyan-300" : "bg-violet-500/15 text-violet-300"
                      }`}>
                        Sem. {materi.semester === 1 ? "Ganjil" : "Genap"}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 mt-0.5">{materi.tpList.length} Tujuan Pembelajaran</p>
                  </div>
                </div>

                {/* TP List */}
                <div className="divide-y divide-white/5">
                  {materi.tpList.map((tp) => {
                    const isOpen = expanded[tp.kode] ?? false;
                    return (
                      <div key={tp.kode} className="px-5 py-4">
                        {/* TP Header (clickable) */}
                        <button
                          className="w-full text-left group"
                          onClick={() => {
                            playPopSound();
                            setExpanded(prev => ({ ...prev, [tp.kode]: !prev[tp.kode] }));
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="inline-block bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 mt-0.5">
                              {tp.kode}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white/85 font-body leading-relaxed group-hover:text-white transition-colors">
                                {tp.tp}
                              </p>
                            </div>
                            <div className={`shrink-0 ml-2 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>

                          {/* Level pills (always visible) */}
                          <div className="flex gap-2 mt-3 ml-10 flex-wrap">
                            {tp.levels.map((lv, li) => (
                              <span key={li} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${levelColors[li].bg} ${levelColors[li].text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${levelColors[li].dot}`} />
                                {lv.label} ({lv.rentang})
                              </span>
                            ))}
                          </div>
                        </button>

                        {/* Expanded: KKTP Detail */}
                        {isOpen && (
                          <div className="mt-4 ml-10 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {tp.levels.map((lv, li) => (
                              <div key={li} className={`rounded-xl border p-3 ${levelColors[li].bg}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${levelColors[li].dot}`} />
                                  <span className={`text-[11px] font-bold ${levelColors[li].text}`}>{lv.label}</span>
                                  <span className={`text-[10px] font-semibold ml-auto px-2 py-0.5 rounded-full ${levelColors[li].badge}`}>{lv.rentang}</span>
                                </div>
                                <p className="text-xs text-white/70 font-body leading-relaxed">{lv.deskripsi}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div className="bg-white/3 border border-white/10 rounded-xl p-4 mb-8 text-xs text-white/50 font-body space-y-1.5 animate-slide-up">
          <p className="text-white/70 font-bold text-[11px] uppercase mb-2">📌 Catatan Penggunaan KKTP:</p>
          <p>• KKTP ini disusun berdasarkan Tujuan Pembelajaran (TP) Matematika SMP Kurikulum Merdeka Fase D.</p>
          <p>• Interval nilai (0–40, 41–65, 66–85, 86–100) dapat disesuaikan dengan karakteristik sekolah dan peserta didik.</p>
          <p>• Peserta didik dengan nilai &lt; 66 (Perlu Bimbingan / Cukup) wajib mengikuti program remedial sesuai TP yang belum tercapai.</p>
          <p>• Peserta didik dengan nilai ≥ 86 (Sangat Baik) diberikan program pengayaan untuk memperluas wawasan matematis.</p>
          <p>• Guru dapat menambah/memodifikasi deskripsi KKTP sesuai konteks pembelajaran dan kondisi sekolah masing-masing.</p>
          <p>• Dasar hukum: Permendikbudristek No. 21 Tahun 2022 tentang Standar Penilaian Pendidikan pada PAUD, Jenjang Dikdas, dan Dikmen.</p>
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Ruang Untuk Guru
          </button>
        </div>
      </div>
    </div>
  );
};

export default KKTPPage;
