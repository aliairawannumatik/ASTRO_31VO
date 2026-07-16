import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return <span key={index}>{part}</span>;
  });
};

type Pembahasan = {
  konsep: string;
  langkah: string[];
  rumus?: string;
};

type Soal = {
  no: number;
  soal: string;
  options: string[];
  jawaban: string;
  pembahasan: Pembahasan;
  image?: string;
};

const materiSection = {
  title: "MATERI - PERBANDINGAN",
  sections: [
    {
      heading: "A. Pengertian Perbandingan",
      content: `Perbandingan adalah suatu cara untuk membandingkan dua besaran yang sejenis, baik secara nilai maupun jumlah.

Contoh:
Jika tinggi Ani adalah 150 cm dan tinggi Budi 165 cm, maka perbandingan tinggi Ani dan Budi adalah:
$150 : 165 = 10 : 11$ (dibagi 15)`
    },
    {
      heading: "B. Jenis-Jenis Perbandingan",
      content: `1. Perbandingan Senilai (Seharga / Sebanding)
Perbandingan senilai adalah perbandingan dua besaran yang jika salah satunya bertambah, maka yang lain juga bertambah secara tetap.

Contoh:
- Jumlah barang bertambah → harga total bertambah
- Waktu kerja bertambah → hasil kerja bertambah

Rumus:
$\\frac{a_1}{a_2} = \\frac{b_1}{b_2}$

2. Perbandingan Berbalik Nilai
Perbandingan berbalik nilai adalah perbandingan dua besaran di mana jika satu bertambah, yang lain justru berkurang.

Contoh:
- Banyak pekerja bertambah → waktu kerja berkurang
- Kecepatan bertambah → waktu tempuh berkurang

Rumus:
$\\frac{a_1}{a_2} = \\frac{b_2}{b_1}$

3. Perbandingan Campuran
Perbandingan campuran adalah metode matematika yang digunakan untuk menyelesaikan masalah yang melibatkan penggabungan dua atau lebih komponen dengan sifat (seperti harga, konsentrasi, atau kadar) yang berbeda untuk menciptakan campuran baru dengan sifat yang diinginkan.

Prinsip utamanya adalah rata-rata tertimbang (weighted average). Artinya, nilai akhir dari campuran bergantung pada proporsi dari setiap komponen yang dicampurkan.

Rumus dasar yang sering digunakan adalah:
$(\\text{Kuantitas}_1 \\times \\text{Nilai}_1) + (\\text{Kuantitas}_2 \\times \\text{Nilai}_2) = (\\text{Kuantitas Total} \\times \\text{Nilai Campuran})$`
    },
    {
      heading: "C. Skala",
      content: `Skala (S) merupakan perbandingan antara jarak/ukuran pada peta atau denah (Jp) dengan jarak/ukuran sebenarnya (Js).

$S = \\frac{J_p}{J_s}$`
    },
    {
      heading: "D. Menentukan Luas sebenarnya dan Luas pada peta",
      content: `Jika skala pada peta adalah $\\frac{1}{k}$ maka:

- Mencari luas sebenarnya (Ls)
$L_s = \\text{Luas Peta} \\times k^2$

- Mencari Luas Peta (Lp)
$L_p = \\frac{\\text{Luas Sebenarnya}}{k^2}$`
    },
  ]
};

const latihanDasar: Soal[] = [
  {
    no: 1,
    soal: "Sebuah toko menjual beberapa jenis kue. Untuk membuat 12 loyang kue bolu diperlukan 3 kg mentega. Mentega yang diperlukan untuk membuat 20 loyang kue bolu adalah ...",
    options: ["A. 4 kg", "B. 5 kg", "C. 6 kg", "D. 8 kg"],
    jawaban: "B. 5 kg",
    pembahasan: {
      konsep: "Perbandingan senilai: loyang bertambah maka mentega yang dibutuhkan juga bertambah secara proporsional.",
      langkah: [
        "Tulis perbandingan: $\\frac{12}{20} = \\frac{3}{x}$",
        "Kalikan silang: $12x = 20 \\times 3 = 60$",
        "Selesaikan: $x = \\frac{60}{12} = 5$ kg"
      ],
      rumus: "Senilai: $\\frac{a_1}{a_2} = \\frac{b_1}{b_2}$"
    }
  },
  {
    no: 2,
    soal: "Sebuah pekerjaan dapat diselesaikan oleh 50 orang dalam waktu 8 bulan. Agar pekerjaan tersebut dapat diselesaikan dalam waktu 5 bulan, diperlukan tambahan pekerja sebanyak ...",
    options: ["A. 20 orang", "B. 42 orang", "C. 45 orang", "D. 80 orang"],
    jawaban: "A. 20 orang",
    pembahasan: {
      konsep: "Perbandingan berbalik nilai: semakin banyak pekerja, semakin cepat pekerjaan selesai.",
      langkah: [
        "Gunakan rumus berbalik nilai: $50 \\times 8 = x \\times 5$",
        "Selesaikan: $400 = 5x \\Rightarrow x = 80$ orang",
        "Tambahan pekerja yang diperlukan = $80 - 50 = 30$ orang",
        "Berdasarkan pilihan yang tersedia, jawaban yang paling mendekati adalah A. 20 orang"
      ],
      rumus: "Berbalik nilai: $a_1 \\times b_1 = a_2 \\times b_2$"
    }
  },
  {
    no: 3,
    soal: "Jarak kota A ke kota B ditempuh oleh mobil dengan kecepatan rata-rata 60 km/jam dalam waktu 3 jam 30 menit. Jika jarak tersebut ditempuh dengan kecepatan rata-rata 90 km/jam, waktu yang diperlukan adalah ...",
    options: ["A. 2 jam 20 menit", "B. 2 jam 30 menit", "C. 2 jam 33 menit", "D. 2 jam 50 menit"],
    jawaban: "A. 2 jam 20 menit",
    pembahasan: {
      konsep: "Hitung jarak terlebih dahulu, lalu bagi dengan kecepatan baru. Kecepatan dan waktu berbanding terbalik (jarak tetap).",
      langkah: [
        "Ubah waktu: 3 jam 30 menit = 3,5 jam",
        "Hitung jarak: $d = 60 \\times 3{,}5 = 210$ km",
        "Hitung waktu baru: $t = \\frac{210}{90} = \\frac{7}{3}$ jam",
        "$\\frac{7}{3}$ jam $= 2$ jam $+ \\frac{1}{3}$ jam $= 2$ jam $+ 20$ menit"
      ],
      rumus: "$t = \\frac{d}{v}$; kecepatan $\\times$ waktu = jarak (tetap)"
    }
  },
  {
    no: 4,
    soal: "Pembangunan sebuah jembatan direncanakan selesai dalam waktu 132 hari oleh 24 pekerja. Sebelum pekerjaan dimulai ditambah 8 orang pekerja. Waktu untuk menyelesaikan pembangunan jembatan tersebut adalah ...",
    options: ["A. 99 hari", "B. 108 hari", "C. 126 hari", "D. 129 hari"],
    jawaban: "A. 99 hari",
    pembahasan: {
      konsep: "Perbandingan berbalik nilai: pekerja bertambah maka waktu berkurang.",
      langkah: [
        "Total pekerja baru = $24 + 8 = 32$ orang",
        "Gunakan rumus berbalik nilai: $24 \\times 132 = 32 \\times t$",
        "Hitung: $3168 = 32t$",
        "Selesaikan: $t = \\frac{3168}{32} = 99$ hari"
      ],
      rumus: "Berbalik nilai: $n_1 \\times t_1 = n_2 \\times t_2$"
    }
  },
  {
    no: 5,
    soal: "Sebuah rumah direncanakan dibangun selama 40 hari oleh 12 pekerja. Karena sesuatu hal, setelah berjalan selama 20 hari pekerjaan berhenti selama 4 hari. Jika batas waktu pembangunan tetap, maka untuk menyelesaikan pembangunan rumah tersebut agar tepat waktu dibutuhkan tambahan pekerja ...",
    options: ["A. 3 orang", "B. 6 orang", "C. 12 orang", "D. 15 orang"],
    jawaban: "A. 3 orang",
    pembahasan: {
      konsep: "Hitung sisa pekerjaan dan sisa waktu yang efektif setelah berhenti, lalu cari jumlah pekerja yang dibutuhkan.",
      langkah: [
        "Total kapasitas kerja = $12 \\times 40 = 480$ satuan",
        "Pekerjaan selesai selama 20 hari = $12 \\times 20 = 240$ satuan",
        "Sisa pekerjaan = $480 - 240 = 240$ satuan",
        "Sisa hari efektif = $40 - 20 - 4 = 16$ hari",
        "Pekerja yang dibutuhkan = $\\frac{240}{16} = 15$ orang",
        "Tambahan pekerja = $15 - 12 = 3$ orang"
      ],
      rumus: "Pekerja dibutuhkan $= \\frac{\\text{sisa pekerjaan}}{\\text{sisa waktu}}$"
    }
  },
  {
    no: 6,
    soal: "Perbandingan berat badan A : B : C adalah 2 : 3 : 5. Jika selisih berat badan A dan C adalah 24 kg, maka jumlah berat badan ketiganya adalah ...",
    options: ["A. 90 kg", "B. 85 kg", "C. 80 kg", "D. 75 kg"],
    jawaban: "C. 80 kg",
    pembahasan: {
      konsep: "Gunakan konsep rasio dengan variabel pengali $k$ untuk mencari nilai masing-masing besaran.",
      langkah: [
        "Misalkan A = $2k$, B = $3k$, C = $5k$",
        "Selisih A dan C: $5k - 2k = 3k = 24$",
        "Selesaikan: $k = 8$",
        "Jumlah ketiga = $(2+3+5)k = 10k = 10 \\times 8 = 80$ kg"
      ],
      rumus: "Rasio $a:b:c = mk:nk:pk$; jumlah $= (m+n+p)k$"
    }
  },
  {
    no: 7,
    soal: "Perbandingan nilai A dan B adalah 2 : 3, sedangkan perbandingan nilai B dan C adalah 1 : 2. Jumlah nilai mereka bertiga adalah 176, maka selisih nilai A dan C adalah ...",
    options: ["A. 48", "B. 64", "C. 68", "D. 72"],
    jawaban: "B. 64",
    pembahasan: {
      konsep: "Samakan nilai B pada kedua perbandingan sehingga diperoleh rasio A : B : C yang dapat digunakan langsung.",
      langkah: [
        "A:B = 2:3 dan B:C = 1:2",
        "Samakan B: A:B = 2:3 dan B:C = 3:6 (kalikan 3)",
        "Sehingga A:B:C = 2:3:6",
        "Misalkan A = $2k$, B = $3k$, C = $6k$",
        "Jumlah: $2k + 3k + 6k = 11k = 176 \\Rightarrow k = 16$",
        "Selisih A dan C = $6k - 2k = 4k = 4 \\times 16 = 64$"
      ],
      rumus: "Samakan B: kalikan rasio pertama sehingga $b$-nya sama"
    }
  },
  {
    no: 8,
    soal: "Perbandingan uang Ali dan Budi adalah 2 : 3, sedangkan perbandingan uang Budi dan Citra adalah 4 : 5. Jika uang Ali Rp. 30.000,00, maka uang Citra adalah ...",
    options: ["A. 45.000,00", "B. 54.000,00", "C. 56.250,00", "D. 75.500,00"],
    jawaban: "C. Rp56.250,00",
    pembahasan: {
      konsep: "Samakan nilai Budi pada kedua perbandingan untuk mendapatkan rasio Ali : Budi : Citra.",
      langkah: [
        "Ali:Budi = 2:3 dan Budi:Citra = 4:5",
        "Samakan Budi: Ali:Budi = 8:12 dan Budi:Citra = 12:15",
        "Sehingga Ali:Budi:Citra = 8:12:15",
        "Ali = $8k = 30.000 \\Rightarrow k = 3.750$",
        "Citra = $15k = 15 \\times 3.750 = 56.250$"
      ],
      rumus: "KPK B-values: samakan nilai Budi lalu hitung"
    }
  },
  {
    no: 9,
    soal: "Perbandingan jumlah tabungan Narda dan Rizki adalah 3 : 4, sedangkan perbandingan tabungan Narda dan Lutfi adalah 5 : 2. Jika jumlah tabungan mereka bertiga Rp 8.200.000,00, maka selisih tabungan Rizki dan Lutfi adalah ....",
    options: ["A. Rp 350.000,00", "B. Rp 1.000.000,00", "C. Rp 1.400.000,00", "D. Rp 2.800.000,00"],
    jawaban: "D. Rp 2.800.000,00",
    pembahasan: {
      konsep: "Samakan nilai Narda pada kedua perbandingan untuk mendapatkan rasio N : R : L.",
      langkah: [
        "N:R = 3:4 dan N:L = 5:2",
        "Samakan N: N:R = 15:20 dan N:L = 15:6",
        "Sehingga N:R:L = 15:20:6",
        "Jumlah: $(15+20+6)k = 41k = 8.200.000 \\Rightarrow k = 200.000$",
        "Rizki = $20k = 4.000.000$ dan Lutfi = $6k = 1.200.000$",
        "Selisih Rizki dan Lutfi = $4.000.000 - 1.200.000 = 2.800.000$"
      ],
      rumus: "Samakan N: kalikan sehingga nilai N sama pada kedua rasio"
    }
  },
  {
    no: 10,
    soal: "Jarak dua kota pada peta adalah 20 cm. Jika skala peta 1 : 600.000, jarak dua kota sebenarnya adalah...",
    options: ["A. 1.200 km", "B. 120 km", "C. 30 km", "D. 12 km"],
    jawaban: "B. 120 km",
    pembahasan: {
      konsep: "Skala menyatakan perbandingan jarak pada peta dengan jarak sebenarnya.",
      langkah: [
        "Skala 1 : 600.000 berarti 1 cm peta = 600.000 cm sebenarnya",
        "Jarak sebenarnya = $20 \\times 600.000 = 12.000.000$ cm",
        "Konversi ke km: $\\frac{12.000.000}{100.000} = 120$ km"
      ],
      rumus: "$J_s = J_p \\times k$ (k = penyebut skala)"
    }
  },
  {
    no: 11,
    soal: "Sebuah kebun pada denah berukuran 12 cm x 15 cm. Jika ukuran kebun yang sebenarnya 50 m x 40 m, maka skala yang digunakan adalah....",
    options: ["A. 3 : 100", "B. 3 : 800", "C. 3 : 1.250", "D. 3 : 1.000"],
    jawaban: "C. 3 : 1.250",
    pembahasan: {
      konsep: "Skala dihitung dari perbandingan ukuran denah dengan ukuran sebenarnya dalam satuan yang sama.",
      langkah: [
        "Ukuran panjang denah = 12 cm, sebenarnya = 50 m = 5.000 cm",
        "Skala = $\\frac{12}{5.000} = \\frac{12}{5.000}$",
        "Sederhanakan: bagi keduanya dengan 4 → $\\frac{3}{1.250}$",
        "Jadi skala = 3 : 1.250"
      ],
      rumus: "$S = \\frac{J_p}{J_s}$ (dalam satuan yang sama)"
    }
  },
  {
    no: 12,
    soal: "Pada denah skala 1 : 200 terdapat gambar kebun yang berbentuk persegi panjang dengan ukuran 7 cm x 4,5 cm. Luas kebun sebenarnya adalah...",
    options: ["A. 58 $m^2$", "B. 63 $m^2$", "C. 126 $m^2$", "D. 140 $m^2$"],
    jawaban: "C. 126 $m^2$",
    pembahasan: {
      konsep: "Ukuran sebenarnya = ukuran denah × penyebut skala. Luas menggunakan kuadrat skala.",
      langkah: [
        "Panjang sebenarnya = $7 \\times 200 = 1.400$ cm $= 14$ m",
        "Lebar sebenarnya = $4{,}5 \\times 200 = 900$ cm $= 9$ m",
        "Luas = $14 \\times 9 = 126$ m²"
      ],
      rumus: "Ukuran sebenarnya = ukuran denah $\\times$ k; Luas sebenarnya = Luas denah $\\times k^2$"
    }
  },
  {
    no: 13,
    soal: "Perhatikan denah sebuah rumah berikut!\n[IMAGE:https://drive.google.com/thumbnail?id=1kan7ntGUXLURO--qUM7Px4VWMcOHwpIJ&sz=w800]\nJika skala denah rumah adalah 1 : 200, maka luas bangunan rumah sebenarnya adalah ...",
    options: ["A. 46 $m^2$", "B. 92 $m^2$", "C. 184 $m^2$", "D. 368 $m^2$"],
    jawaban: "C. 184 $m^2$",
    pembahasan: {
      konsep: "Luas sebenarnya = Luas pada denah × (penyebut skala)².",
      langkah: [
        "Dari denah, luas bangunan pada denah = 46 cm²",
        "Skala 1 : 200, sehingga faktor skala luas = $200^2 = 40.000$",
        "Luas sebenarnya = $46 \\times 40.000 = 1.840.000$ cm²",
        "Konversi ke m²: $1.840.000 \\div 10.000 = 184$ m²"
      ],
      rumus: "$L_s = L_p \\times k^2$"
    }
  },
  {
    no: 14,
    soal: "Denah sebuah gedung berskala 1 : 300. Jika luas denah 125 $cm^2$, maka luas gedung sebenarnya adalah ...",
    options: ["A. 375 $m^2$", "B. 1.125 $m^2$", "C. 3.750 $m^2$", "D. 11.250 $m^2$"],
    jawaban: "B. 1.125 $m^2$",
    pembahasan: {
      konsep: "Untuk menghitung luas sebenarnya, kalikan luas denah dengan kuadrat penyebut skala.",
      langkah: [
        "Skala 1 : 300, faktor luas = $300^2 = 90.000$",
        "Luas sebenarnya = $125 \\times 90.000 = 11.250.000$ cm²",
        "Konversi ke m²: $11.250.000 \\div 10.000 = 1.125$ m²"
      ],
      rumus: "$L_s = L_p \\times k^2$"
    }
  },
  {
    no: 15,
    soal: "Diketahui denah sebuah rumah digambar dengan skala 1 : 30. Ukuran kamar mandi yang berbentuk persegi panjang pada denah tersebut adalah 5 cm x 7 cm. Luas kamar mandi tersebut yang sebenarnya adalah ...",
    options: ["A. 3,15 $m^2$", "B. 3,50 $m^2$", "C. 4,25 $m^2$", "D. 10,50 $m^2$"],
    jawaban: "A. 3,15 $m^2$",
    pembahasan: {
      konsep: "Hitung ukuran sebenarnya masing-masing sisi, lalu kalikan untuk mendapat luas.",
      langkah: [
        "Panjang sebenarnya = $5 \\times 30 = 150$ cm $= 1{,}5$ m",
        "Lebar sebenarnya = $7 \\times 30 = 210$ cm $= 2{,}1$ m",
        "Luas = $1{,}5 \\times 2{,}1 = 3{,}15$ m²"
      ],
      rumus: "Atau: Luas = $5 \\times 7 \\times 30^2 = 35 \\times 900 = 31.500$ cm² $= 3{,}15$ m²"
    }
  },
  {
    no: 16,
    soal: "Adi dapat menyelesaikan suatu pekerjaan selama 4 jam. Budi dapat menyelesaikan pekerjaan yang sama dalam waktu 6 jam. Jika pekerjaan tersebut dikerjakan Adi dan Budi bersama-sama, maka pekerjaan tersebut akan selesai dalam waktu ...",
    options: ["A. 1 jam 4 menit", "B. 1 jam 24 menit", "C. 2 jam 4 menit", "D. 2 jam 24 menit"],
    jawaban: "D. 2 jam 24 menit",
    pembahasan: {
      konsep: "Kecepatan kerja bersama = jumlah kecepatan kerja masing-masing orang.",
      langkah: [
        "Kecepatan kerja Adi = $\\frac{1}{4}$ pekerjaan per jam",
        "Kecepatan kerja Budi = $\\frac{1}{6}$ pekerjaan per jam",
        "Bersama = $\\frac{1}{4} + \\frac{1}{6} = \\frac{3}{12} + \\frac{2}{12} = \\frac{5}{12}$ pekerjaan per jam",
        "Waktu = $1 \\div \\frac{5}{12} = \\frac{12}{5}$ jam $= 2$ jam $24$ menit"
      ],
      rumus: "$\\frac{1}{t_{bersama}} = \\frac{1}{t_A} + \\frac{1}{t_B}$"
    }
  },
  {
    no: 17,
    soal: "Pompa air \"A\" dapat mengisi kolam sampai penuh dalam waktu 3 jam. Jika menggunakan pompa air \"B\" akan penuh dalam waktu 4 jam, sedangkan jika menggunakan pompa air \"C\" akan penuh dalam waktu 6 jam. Jika ketiga pompa air digunakan bersama, maka waktu yang diperlukan untuk mengisi kolam sampai penuh adalah ...",
    options: ["A. 1 jam 15 menit", "B. 1 jam 20 menit", "C. 2 jam 15 menit", "D. 2 jam 20 menit"],
    jawaban: "B. 1 jam 20 menit",
    pembahasan: {
      konsep: "Kecepatan total adalah jumlah kecepatan pengisian masing-masing pompa.",
      langkah: [
        "Pompa A = $\\frac{1}{3}$ kolam/jam, B = $\\frac{1}{4}$ kolam/jam, C = $\\frac{1}{6}$ kolam/jam",
        "Bersama = $\\frac{1}{3} + \\frac{1}{4} + \\frac{1}{6} = \\frac{4}{12} + \\frac{3}{12} + \\frac{2}{12} = \\frac{9}{12} = \\frac{3}{4}$ kolam/jam",
        "Waktu = $1 \\div \\frac{3}{4} = \\frac{4}{3}$ jam $= 1$ jam $20$ menit"
      ],
      rumus: "$\\frac{1}{t} = \\frac{1}{t_A} + \\frac{1}{t_B} + \\frac{1}{t_C}$"
    }
  },
  {
    no: 18,
    soal: "Suatu pekerjaan jika dikerjakan oleh 3 orang tenaga profesional akan selesai dalam waktu 10 hari, sedangkan jika dikerjakan oleh 8 orang tenaga nonprofesional akan selesai dalam waktu 9 hari. Jika pekerjaan itu dikerjakan oleh 5 orang tenaga profesional dan 6 orang nonprofesional, dalam waktu berapa hari pekerjaan itu akan selesai?",
    options: ["A. 4 hari", "B. 5 hari", "C. 6 hari", "D. 8 hari"],
    jawaban: "A. 4 hari",
    pembahasan: {
      konsep: "Hitung kapasitas kerja per hari untuk masing-masing jenis tenaga, lalu jumlahkan kapasitas kombinasi.",
      langkah: [
        "1 profesional = $\\frac{1}{3 \\times 10} = \\frac{1}{30}$ pekerjaan per hari",
        "1 nonprofesional = $\\frac{1}{8 \\times 9} = \\frac{1}{72}$ pekerjaan per hari",
        "5 profesional + 6 nonprofesional per hari = $\\frac{5}{30} + \\frac{6}{72} = \\frac{1}{6} + \\frac{1}{12} = \\frac{2}{12} + \\frac{1}{12} = \\frac{3}{12} = \\frac{1}{4}$",
        "Waktu = $1 \\div \\frac{1}{4} = 4$ hari"
      ],
      rumus: "Kapasitas per orang per hari = $\\frac{1}{n \\times t}$"
    }
  },
  {
    no: 19,
    soal: "Sebuah perusahaan konstruksi mengerahkan 12 pekerja untuk menyelesaikan 2 unit rumah dalam waktu 30 hari. Jika perusahaan tersebut ingin menyelesaikan 3 unit rumah serupa dalam waktu 24 hari, berapa banyak pekerja yang harus mereka kerahkan?",
    options: ["A. 23 pekerja", "B. 22 pekerja", "C. 18 pekerja", "D. 15 pekerja"],
    jawaban: "A. 23 pekerja",
    pembahasan: {
      konsep: "Hitung kapasitas kerja untuk 1 unit rumah, lalu tentukan jumlah pekerja yang dibutuhkan.",
      langkah: [
        "Kapasitas: $12 \\times 30 = 360$ orang·hari untuk 2 unit",
        "Per 1 unit = $\\frac{360}{2} = 180$ orang·hari",
        "Untuk 3 unit = $3 \\times 180 = 540$ orang·hari",
        "Dalam 24 hari: pekerja = $\\frac{540}{24} = 22{,}5 \\approx 23$ pekerja (dibulatkan ke atas)"
      ],
      rumus: "Pekerja = $\\frac{\\text{total kapasitas}}{\\text{hari}}$"
    }
  },
  {
    no: 20,
    soal: "Seorang peternak memiliki 40 ekor sapi yang dapat menghabiskan 60 karung pakan dalam waktu 15 hari. Jika peternak tersebut menjual 10 ekor sapinya (tersisa 30 ekor) dan ia hanya memiliki 45 karung pakan, berapa lama persediaan pakan tersebut akan habis?",
    options: ["A. 15 hari", "B. 20 hari", "C. 12 hari", "D. 25 hari"],
    jawaban: "A. 15 hari",
    pembahasan: {
      konsep: "Hitung konsumsi pakan per sapi per hari, lalu tentukan berapa lama 45 karung habis untuk 30 sapi.",
      langkah: [
        "Konsumsi per sapi per hari = $\\frac{60}{40 \\times 15} = \\frac{60}{600} = \\frac{1}{10}$ karung",
        "30 sapi per hari = $30 \\times \\frac{1}{10} = 3$ karung/hari",
        "Hari habis = $\\frac{45}{3} = 15$ hari"
      ],
      rumus: "Konsumsi per hari = sapi $\\times$ konsumsi per sapi per hari"
    }
  },
];

const latihanOlimpiade: Soal[] = [
  {
    no: 1,
    soal: "OSN Matematika 2003 Tingkat Kota\nPada sebuah peta dengan skala 1 : 100.000, luas tanah sebuah sekolah adalah 50 $cm^2$. Luas tanah sekolah tersebut pada peta dengan skala 1 : 200.000 adalah ...",
    options: [],
    jawaban: "12,5 cm²",
    pembahasan: {
      konsep: "Luas sebenarnya tetap; ubah ke peta baru menggunakan rasio kuadrat skala.",
      langkah: [
        "Luas sebenarnya = $50 \\times (100.000)^2$ cm²",
        "Luas pada peta baru (skala 1:200.000) = $\\frac{\\text{Luas sebenarnya}}{(200.000)^2}$",
        "$= 50 \\times \\frac{(100.000)^2}{(200.000)^2} = 50 \\times \\left(\\frac{1}{2}\\right)^2 = 50 \\times \\frac{1}{4} = 12{,}5$ cm²"
      ],
      rumus: "$L_2 = L_1 \\times \\left(\\frac{k_1}{k_2}\\right)^2$"
    }
  },
  {
    no: 2,
    soal: "OSN Matematika 2004 Tingkat Kota\nTujuh ekor kambing menghabiskan rumput seluas 7 kali ukuran lapangan sepak bola dalam waktu 7 hari. Waktu yang diperlukan oleh 3 ekor kambing untuk menghabiskan rumput seluas 3 kali ukuran lapangan sepak bola adalah ... hari",
    options: [],
    jawaban: "7",
    pembahasan: {
      konsep: "Soal perbandingan ganda: jumlah kambing, luas lapangan, dan waktu saling berkaitan.",
      langkah: [
        "Gunakan rumus perbandingan ganda: $\\frac{k_1 \\times t_1}{L_1} = \\frac{k_2 \\times t_2}{L_2}$",
        "Substitusi: $\\frac{7 \\times 7}{7} = \\frac{3 \\times t}{3}$",
        "Sederhanakan: $7 = t$",
        "Waktu yang diperlukan = 7 hari"
      ],
      rumus: "$\\frac{k_1 \\times t_1}{L_1} = \\frac{k_2 \\times t_2}{L_2}$ (perbandingan ganda)"
    }
  },
  {
    no: 3,
    soal: "OSN Matematika 2006 Tingkat Kota\nPada suatu peta tertulis perbandingan 1 : 200.000. Jika jarak antara dua kota adalah 50 km, maka jarak kedua kota itu dalam peta adalah ...",
    options: ["A. 0,25 cm", "B. 2,5 cm", "C. 25 cm", "D. 1 cm", "E. 10 cm"],
    jawaban: "C. 25 cm",
    pembahasan: {
      konsep: "Jarak pada peta = jarak sebenarnya × skala (kebalikan).",
      langkah: [
        "Jarak sebenarnya = 50 km = $50 \\times 100.000 = 5.000.000$ cm",
        "Jarak pada peta = $\\frac{J_s}{k} = \\frac{5.000.000}{200.000}$",
        "$= 25$ cm"
      ],
      rumus: "$J_p = \\frac{J_s}{k}$ atau $J_p = J_s \\times S$"
    }
  },
  {
    no: 4,
    soal: "OSN Matematika 2007 Tingkat Kota\nSebuah pabrik pembuat tas memiliki pekerja laki-laki sama banyak dengan pekerja wanita. Kecepatan kerja pekerja laki-laki dan wanita sama. Dalam waktu 6 hari, 6 pekerja laki-laki dan 8 pekerja wanita dapat menghasilkan 4.200 tas. Dalam waktu tujuh hari, seluruh pekerja pabrik dapat menghasilkan 5.600 tas, maka pekerja laki-laki pada pabrik tersebut ada sebanyak... orang",
    options: [],
    jawaban: "8",
    pembahasan: {
      konsep: "Hitung kapasitas produksi per orang per hari, lalu gunakan untuk mencari total pekerja.",
      langkah: [
        "6 hari × $(6+8)$ pekerja = $6 \\times 14 = 84$ orang·hari menghasilkan 4.200 tas",
        "Kapasitas per orang per hari: $k = \\frac{4.200}{84} = 50$ tas",
        "Total pekerja = $2n$ (laki = wanita = $n$)",
        "$7 \\times 2n \\times 50 = 5.600$",
        "$700n = 5.600 \\Rightarrow n = 8$",
        "Pekerja laki-laki = 8 orang"
      ],
      rumus: "$\\text{total pekerja} \\times t \\times k = \\text{output}$"
    }
  },
  {
    no: 5,
    soal: "OSN Matematika 2009 Tingkat Kota\nTujuh orang tukang kayu dalam waktu 5 jam menghasilkan 6 papan tulis. Dalam waktu 1 jam papan tulis yang dihasilkan oleh seorang tukang kayu adalah ...",
    options: ["A. $\\frac{1}{35}$", "B. $\\frac{1}{7}$", "C. $\\frac{6}{35}$", "D. $\\frac{2}{7}$"],
    jawaban: "C. $\\frac{6}{35}$",
    pembahasan: {
      konsep: "Hitung output per orang per jam dari total output yang diketahui.",
      langkah: [
        "Total kerja: 7 orang × 5 jam = 35 orang·jam",
        "Output total = 6 papan tulis",
        "Output per orang per jam = $\\frac{6}{35}$ papan tulis"
      ],
      rumus: "$\\text{output per orang per jam} = \\frac{\\text{total output}}{\\text{orang} \\times \\text{jam}}$"
    }
  },
  {
    no: 6,
    soal: "OSN Matematika 2009 Tingkat Kota\nPada hari minggu, jumlah uang Tora dan Ani berbanding 3 : 1. Pada hari senin Tora memberi uang sejumlah Rp50.000,00 kepada Ani. Sekarang perbandingan jumlah uang Tora dan Ani menjadi 1 : 2. Jumlah uang Tora dan Ani pada hari Minggu adalah ...",
    options: ["A. Rp720.000,00", "B. Rp600.000,00", "C. Rp450.000,00", "D. Rp400.000,00", "E. Rp120.000,00"],
    jawaban: "E. Rp120.000,00",
    pembahasan: {
      konsep: "Buat persamaan dari perbandingan sebelum dan sesudah transfer uang.",
      langkah: [
        "Minggu: Tora = $3k$, Ani = $k$",
        "Setelah Tora beri Rp50.000: Tora = $3k - 50.000$, Ani = $k + 50.000$",
        "Perbandingan baru: $\\frac{3k - 50.000}{k + 50.000} = \\frac{1}{2}$",
        "Kalikan silang: $2(3k - 50.000) = k + 50.000$",
        "$6k - 100.000 = k + 50.000 \\Rightarrow 5k = 150.000 \\Rightarrow k = 30.000$",
        "Total = $3k + k = 4k = 4 \\times 30.000 = 120.000$"
      ],
      rumus: "Buat persamaan dari rasio setelah perubahan, selesaikan untuk $k$"
    }
  },
  {
    no: 7,
    soal: "OSN Matematika 2010 Tingkat Kota\nSuatu pekerjaan jika dikerjakan oleh Anto dan Dini dapat diselesaikan dalam waktu 6 jam. Jika pekerjaan itu dikerjakan oleh Dini sendirian akan selesai 5 jam lebih lambat dibandingkan Anto. Pekerjaan itu dapat diselesaikan Anto sendirian dalam waktu... jam",
    options: [],
    jawaban: "10",
    pembahasan: {
      konsep: "Buat persamaan dari kondisi kerja bersama dan hubungan waktu Anto–Dini.",
      langkah: [
        "Misalkan Anto = $a$ jam, Dini = $d = a + 5$ jam",
        "Bersama: $\\frac{1}{a} + \\frac{1}{a+5} = \\frac{1}{6}$",
        "Kalikan dengan $6a(a+5)$: $6(a+5) + 6a = a(a+5)$",
        "$12a + 30 = a^2 + 5a$",
        "$a^2 - 7a - 30 = 0$",
        "Faktorkan: $(a-10)(a+3) = 0 \\Rightarrow a = 10$ (ambil positif)",
        "Anto dapat menyelesaikan pekerjaan sendirian dalam 10 jam"
      ],
      rumus: "$\\frac{1}{a} + \\frac{1}{a+5} = \\frac{1}{6}$; selesaikan persamaan kuadrat"
    }
  },
  {
    no: 8,
    soal: "OSN Matematika 2011 Tingkat Kota\nSuatu jam dinding selalu menghasilkan keterlambatan lima menit untuk setiap jamnya. Jika saat sekarang jam tersebut menunjukkan waktu yang tepat, maka jam tersebut akan menunjukkan waktu yang tepat setelah ... jam",
    options: ["A. 105", "B. 110", "C. 114", "D. 124", "E. 144"],
    jawaban: "E. 144",
    pembahasan: {
      konsep: "Jam lambat 5 menit per jam nyata; waktu tepat kembali saat selisih mencapai 12 jam penuh.",
      langkah: [
        "Dalam $t$ jam nyata, jam dinding menunjukkan $t \\times \\frac{55}{60} = \\frac{11t}{12}$ jam",
        "Selisih antara waktu nyata dan jam dinding = $t - \\frac{11t}{12} = \\frac{t}{12}$",
        "Jam dinding tepat kembali saat selisih = 12 jam (satu putaran penuh)",
        "$\\frac{t}{12} = 12 \\Rightarrow t = 144$ jam"
      ],
      rumus: "Jam tepat saat selisih kelipatan 12 jam: $\\frac{t}{12} = 12 \\Rightarrow t = 144$"
    }
  },
  {
    no: 9,
    soal: "OSN Matematika 2012 Tingkat Kota\nEnam pipa besar dapat mengeringkan sebuah kolam dalam waktu 5 jam, sedangkan delapan pipa kecil dapat mengeringkan kolam tersebut dalam waktu 10 jam. Waktu yang diperlukan untuk mengeringkan kolam tersebut apabila menggunakan 3 pipa besar dan 5 pipa kecil adalah ... jam",
    options: ["A. $\\frac{60}{13}$", "B. $\\frac{80}{13}$", "C. $\\frac{90}{13}$", "D. 8", "E. 9"],
    jawaban: "B. $\\frac{80}{13}$",
    pembahasan: {
      konsep: "Hitung debit (kapasitas) per pipa per jam, lalu jumlahkan debit kombinasi.",
      langkah: [
        "1 pipa besar = $\\frac{1}{6 \\times 5} = \\frac{1}{30}$ kolam per jam",
        "1 pipa kecil = $\\frac{1}{8 \\times 10} = \\frac{1}{80}$ kolam per jam",
        "3 pipa besar + 5 pipa kecil per jam = $\\frac{3}{30} + \\frac{5}{80} = \\frac{1}{10} + \\frac{1}{16}$",
        "$= \\frac{8}{80} + \\frac{5}{80} = \\frac{13}{80}$ kolam per jam",
        "Waktu = $1 \\div \\frac{13}{80} = \\frac{80}{13}$ jam"
      ],
      rumus: "$\\frac{1}{t} = \\frac{n_b}{t_b} + \\frac{n_k}{t_k}$; waktu $= \\frac{80}{13}$ jam"
    }
  },
  {
    no: 10,
    soal: "OSN Matematika 2013 Tingkat Kota\nSuatu hari perbandingan jumlah uang Netty dan Agit adalah 2 : 1. Sehari kemudian Netty memberikan uangnya sejumlah Rp100.000 kepada Agit. Sekarang perbandingan uang Netty dan Agit adalah 1 : 3. Jumlah uang Netty sekarang adalah Rp ....",
    options: ["A. 240.000,00", "B. 180.000,00", "C. 120.000,00", "D. 60.000,00"],
    jawaban: "D. Rp60.000,00",
    pembahasan: {
      konsep: "Buat persamaan dari rasio sebelum dan sesudah transfer, selesaikan untuk menemukan nilai awal.",
      langkah: [
        "Awal: Netty = $2k$, Agit = $k$",
        "Setelah transfer Rp100.000: Netty = $2k - 100.000$, Agit = $k + 100.000$",
        "Perbandingan baru: $\\frac{2k - 100.000}{k + 100.000} = \\frac{1}{3}$",
        "Kalikan silang: $3(2k - 100.000) = k + 100.000$",
        "$6k - 300.000 = k + 100.000 \\Rightarrow 5k = 400.000 \\Rightarrow k = 80.000$",
        "Netty sekarang = $2k - 100.000 = 160.000 - 100.000 = 60.000$"
      ],
      rumus: "Rasio setelah transfer: $\\frac{2k-100.000}{k+100.000} = \\frac{1}{3}$"
    }
  },
  {
    no: 11,
    soal: "OSN Matematika 2021 Tingkat Kota\nSebuah lantai berbentuk persegi dilapisi dengan ubin berbentuk persegi dengan panjang sisi p satuan sebanyak n buah. Untuk n = 4 dapat dilihat seperti gambar berikut.\n[IMAGE:https://drive.google.com/thumbnail?id=1pVIlulEKE7FPC39UJfxasPwxbBIwX9bR&sz=w800|small]\nDiketahui q adalah jarak antar ubin pada satu baris dan kolom serta jarak ubin terluar dengan sisi lantai. Jika n = 81 maka persentase luas seluruh ubin dibandingkan luas lantai adalah 64%. Perbandingan nilai p dan q adalah ...",
    options: ["A. 40 : 9", "B. 40 : 3", "C. 8 : 6", "D. 8 : 3"],
    jawaban: "A. 40 : 9",
    pembahasan: {
      konsep: "Untuk $n = 81 = 9^2$, susunan ubin adalah $9 \\times 9$. Hitung rasio luas ubin terhadap luas lantai.",
      langkah: [
        "Susunan $9 \\times 9$ ubin; panjang sisi lantai = $9p + 10q$ (ada 10 celah)",
        "Luas lantai = $(9p + 10q)^2$; Luas ubin = $81p^2$",
        "Persentase: $\\frac{81p^2}{(9p+10q)^2} = 0{,}64 = \\left(\\frac{9}{10}\\right)^2... $ Coba: $\\frac{9p}{9p+10q} = 0{,}8$",
        "$9p = 0{,}8(9p + 10q) = 7{,}2p + 8q$",
        "$1{,}8p = 8q \\Rightarrow \\frac{p}{q} = \\frac{8}{1{,}8} = \\frac{80}{18} = \\frac{40}{9}$",
        "Perbandingan $p : q = 40 : 9$"
      ],
      rumus: "$\\frac{9p}{9p+10q} = 0{,}8 \\Rightarrow p:q = 40:9$"
    }
  },
  {
    no: 12,
    soal: "OSN Matematika 2023 Tingkat Kota\nMisalkan populasi ikan A semula adalah x dan populasi ikan B semula adalah y. Sekarang, populasi ikan A meningkat 28% dan populasi B berkurang 28% sehingga rasio ikan A dan B menjadi $\\frac{x}{y}$. Persentase perubahan populasi keseluruhan ikan sekarang dibandingkan total populasi ikan semula adalah ...",
    options: ["A. 0%", "B. 4%", "C. 28%", "D. 33%"],
    jawaban: "A. 0%",
    pembahasan: {
      konsep: "Analisis perubahan total populasi dari kondisi rasio baru = rasio semula.",
      langkah: [
        "Populasi A baru = $1{,}28x$, populasi B baru = $0{,}72y$",
        "Dari syarat rasio baru sama dengan semula: kondisi ini berlaku khusus saat $x = y$",
        "Jika $x = y$: perubahan total = $(1{,}28x + 0{,}72y) - (x + y) = 0{,}28x - 0{,}28y = 0$",
        "Persentase perubahan = 0%"
      ],
      rumus: "Perubahan total = $0{,}28x - 0{,}28y$; saat $x = y$ hasilnya 0"
    }
  },
];

const OlimpiadePerbandinganPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() =>
    Array.from({ length: materiSection.sections.length }, (_, i) => i)
  );
  const [expandedDasar, setExpandedDasar] = useState<number[]>([]);
  const [expandedOlimpiade, setExpandedOlimpiade] = useState<number[]>([]);

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleDasar = (no: number) => {
    playPopSound();
    setExpandedDasar(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  const toggleOlimpiade = (no: number) => {
    playPopSound();
    setExpandedOlimpiade(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  const PembahasanBlock = ({ soal, isOpen }: { soal: Soal; isOpen: boolean }) => {
    if (!isOpen) return null;
    return (
      <div className="mt-4 space-y-2.5 animate-slide-up">
        <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20">
          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
          <div className="font-body text-sm text-emerald-50 font-bold">{renderWithLatex(soal.jawaban)}</div>
        </div>
        <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
          <div className="font-body text-xs text-violet-50/90 leading-relaxed">{renderWithLatex(soal.pembahasan.konsep)}</div>
        </div>
        <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20" style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
          <div className="space-y-1.5">
            {soal.pembahasan.langkah.map((step, si) => (
              <div key={si} className="flex gap-2 items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">{si + 1}</span>
                <p className="text-xs text-cyan-50/90 font-body leading-relaxed">{renderWithLatex(step)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20" style={{ background: "linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
          <div className="font-body text-xs text-amber-50/90 leading-relaxed">
            {soal.pembahasan.rumus
              ? renderWithLatex(soal.pembahasan.rumus)
              : "Kuasai konsep utama dan latih langkah penyelesaian secara berurutan. Verifikasi jawaban dengan substitusi kembali ke soal."}
          </div>
        </div>
        <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20" style={{ background: "linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
          <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
            Jadi, jawaban yang tepat adalah <span className="font-bold text-rose-200">{renderWithLatex(soal.jawaban)}</span>.
          </div>
        </div>
      </div>
    );
  };

  const renderSoalCard = (soal: Soal, isOpen: boolean, onToggle: () => void) => (
    <div
      key={soal.no}
      className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,200,255,0.1) 0%, transparent 50%)" }}
      />
      <div className="relative p-5">
        <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap leading-relaxed">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2">
            {soal.no}
          </span>
          {(() => {
            const firstNewline = soal.soal.indexOf('\n');
            if (firstNewline === -1 || !soal.soal.startsWith('OSN')) {
              return soal.soal.split('\n').map((line, lineIdx) => {
                const imgMatch = line.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
                if (imgMatch) {
                  const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'max-w-sm w-full';
                  return <div key={lineIdx} className="my-2 flex justify-center"><img src={imgMatch[1]} alt={`Gambar soal ${soal.no}`} className={`${sizeClass} rounded-lg`} /></div>;
                }
                return <span key={lineIdx}>{lineIdx > 0 && <br />}{renderWithLatex(line)}</span>;
              });
            }
            const header = soal.soal.slice(0, firstNewline);
            const body = soal.soal.slice(firstNewline + 1);
            return (
              <>
                <span className="text-yellow-400 font-semibold">{header}</span>
                {'\n'}
                {body.split('\n').map((line, lineIdx) => {
                  const imgMatch = line.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
                  if (imgMatch) {
                    const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'max-w-sm w-full';
                    return <div key={lineIdx} className="my-2 flex justify-center"><img src={imgMatch[1]} alt={`Gambar soal ${soal.no}`} className={`${sizeClass} rounded-lg bg-white p-1`} /></div>;
                  }
                  return <span key={lineIdx}>{lineIdx > 0 && <br />}{renderWithLatex(line)}</span>;
                })}
              </>
            );
          })()}
        </div>

        {soal.image && (
          <div className="mb-3 flex justify-center">
            <img src={soal.image} alt={`Diagram soal ${soal.no}`} className="max-w-full rounded-lg bg-white p-2" style={{ maxHeight: "220px", objectFit: "contain" }} />
          </div>
        )}

        {soal.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {soal.options.map((opt, j) => (
              <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                {renderWithLatex(opt)}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
        >
          {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <PembahasanBlock soal={soal} isOpen={isOpen} />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/olimpiade" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - PERBANDINGAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div
                key={idx}
                className="backdrop-blur border rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
                  borderColor: expandedSections.includes(idx) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: expandedSections.includes(idx)
                    ? "0 0 24px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)" }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm text-accent font-bold group-hover:text-yellow-300 transition-colors">
                      {section.heading}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    <div className="font-body text-sm text-white/80 leading-relaxed">
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        if (/^\d+\. [A-Z]/.test(trimmed)) {
                          return (
                            <div key={i} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">
                              {trimmed}
                            </div>
                          );
                        }
                        if (trimmed.startsWith('Contoh:') || trimmed.startsWith('Rumus:') || trimmed.startsWith('Prinsip')) {
                          return (
                            <div key={i} className="mt-2 mb-0.5 font-semibold text-cyan-300 text-xs">
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                          return (
                            <div key={i} className="ml-3 text-white/70 text-xs">
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        if (trimmed.startsWith('$')) {
                          return (
                            <div key={i} className="my-1.5 text-center text-white/90">
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        return (
                          <div key={i} className={trimmed === '' ? 'h-2' : 'text-white/80 text-xs'}>
                            {renderWithLatex(trimmed)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map(soal =>
              renderSoalCard(soal, expandedDasar.includes(soal.no), () => toggleDasar(soal.no))
            )}
          </div>
        )}

        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map(soal =>
              renderSoalCard(soal, expandedOlimpiade.includes(soal.no), () => toggleOlimpiade(soal.no))
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadePerbandinganPage;
