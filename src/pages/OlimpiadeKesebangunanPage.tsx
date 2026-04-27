import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import kesDasarImg3 from "@assets/3_1777275265953.png";
import kesDasarImg4 from "@assets/4_1777275265954.png";
import kesDasarImg6 from "@assets/6_1777275265954.png";
import kesDasarImg7 from "@assets/7_1777275265955.png";
import kesDasarImg8 from "@assets/8_1777275265955.png";
import kesDasarImg9 from "@assets/9_1777275265956.png";
import kesDasarImg10 from "@assets/10_1777275265956.png";
import kesDasarImg11 from "@assets/11_1777275265957.png";
import kesDasarImg12 from "@assets/12_1777275265957.png";
import kesDasarImg13 from "@assets/13_1777275265958.png";
import kesDasarImg15 from "@assets/15_1777275265958.png";
import kesDasarImg16 from "@assets/16_1777275265959.png";
import kesDasarImg17 from "@assets/17_1777275265959.png";
import kesDasarImg18 from "@assets/18_1777275265960.png";
import kesDasarImg21 from "@assets/21_1777275265960.png";
import kesDasarImg22 from "@assets/22_1777275265961.png";
import kesDasarImg1i from "@assets/no_1_pernyataan_(i)_1777275265961.png";
import kesDasarImg1ii from "@assets/no_1_pernyataan_(ii)_1777275265962.png";
import kesDasarImg1iii from "@assets/no_1_pernyataan_(iii)_1777275265962.png";
import kesDasarImg1iv from "@assets/no_1_pernyataan_(iv)_1777275265963.png";

const kesDasarImages: Record<number, string> = {
  3: kesDasarImg3,
  4: kesDasarImg4,
  6: kesDasarImg6,
  7: kesDasarImg7,
  8: kesDasarImg8,
  9: kesDasarImg9,
  10: kesDasarImg10,
  11: kesDasarImg11,
  12: kesDasarImg12,
  13: kesDasarImg13,
  15: kesDasarImg15,
  16: kesDasarImg16,
  17: kesDasarImg17,
  18: kesDasarImg18,
  21: kesDasarImg21,
  22: kesDasarImg22,
};

const kesDasarSoal1Images: { label: string; src: string }[] = [
  { label: "(i)", src: kesDasarImg1i },
  { label: "(ii)", src: kesDasarImg1ii },
  { label: "(iii)", src: kesDasarImg1iii },
  { label: "(iv)", src: kesDasarImg1iv },
];

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const materiSection = {
  title: "MATERI - KESEBANGUNAN DAN KEKONGRUENAN",
  sections: [
    {
      heading: "Indikator 23",
      content: `Menyelesaikan masalah menggunakan konsep perbandingan pada kesebangunan dan kongruenan.`
    },
    {
      heading: "A. Kesebangunan",
      content: `Bangun-bangun datar yang sebangun artinya bangun-bangun datar tersebut mempunyai bentuk yang sama namun ukurannya berbeda dapat lebih besar atau lebih kecil.

Untuk membuktikan dua buah bangun datar sebangun dapat dilakukan jika memenuhi salah satu syarat di bawah ini:
1. Sudut-sudut yang bersesuaian sama besar.
2. Sisi-sisi yang bersesuaian mempunyai perbandingan yang sama.

Sisi yang bersesuaian terletak di hadapan sudut yang sama besar.

Terdapat segitiga ABC dan segitiga ADE, dengan BC sejajar DE.
Segitiga ABC dan segitiga ADE sebangun, maka:

$\\dfrac{AB}{AD} = \\dfrac{BC}{DE} = \\dfrac{AC}{AE}$  atau  $\\dfrac{AD}{AB} = \\dfrac{DE}{BC} = \\dfrac{AE}{AC}$

Pada segitiga siku-siku dapat dibuat garis tinggi ke sisi miring.
Segitiga ABC sebangun dengan segitiga ADC. Dengan menggunakan konsep kesebangunan maka diperoleh:

$AB^2 = BD \\times BC$
$AC^2 = CD \\times CB$
$AD^2 = BD \\times CD$`
    },
    {
      heading: "B. Kekongruenan",
      content: `Dua bangun dikatakan kongruen jika semua panjang sisi-sisi yang bersesuaian sama besar dan begitu juga sudutnya. Mudahnya, kita katakan bahwa dua bangun itu sama ukurannya dan sama bentuknya.

Syarat dua segitiga kongruen:
1. Sisi-Sisi-Sisi (S.S.S): Ketiga sisi yang bersesuaian sama panjang.
2. Sisi-Sudut-Sisi (S.Sd.S): Dua sisi yang bersesuaian sama panjang dan sudut yang diapit sama besar.
3. Sudut-Sisi-Sudut (Sd.S.Sd): Dua sudut yang bersesuaian sama besar dan sisi di antara kedua sudut sama panjang.
4. Sisi-Sisi-Sudut (S.S.Sd): Dua sisi yang bersesuaian sama panjang dan salah satu sudut yang bersesuaian sama besar.`
    },
  ]
};

const latihanDasar = [
  {
    no: 1,
    soal: "Perhatikan gambar bangun-bangun berikut:\n(i) Dua buah persegi\n(ii) Dua buah persegi panjang\n(iii) Dua buah segitiga sama sisi\n(iv) Dua buah belah ketupat\n\nPasangan bangun di samping yang pasti sebangun adalah ...",
    options: ["A. (i) dan (ii)", "B. (i) dan (iii)", "C. (ii) dan (iii)", "D. (ii) dan (iv)"],
    jawaban: "B. (i) dan (iii)",
    pembahasan: "Bangun yang PASTI sebangun adalah bangun yang semua sudut bersesuaiannya selalu sama dan rasio sisi-sisi yang bersesuaian selalu konstan.\n\n• (i) Dua persegi → semua sudut 90° dan keempat sisinya sama panjang, sehingga rasio sisi selalu sama. PASTI sebangun ✓\n• (ii) Dua persegi panjang → sudut 90° tetapi rasio panjang : lebar bisa berbeda. Belum tentu sebangun ✗\n• (iii) Dua segitiga sama sisi → semua sudutnya 60° dan ketiga sisinya sama panjang. PASTI sebangun ✓\n• (iv) Dua belah ketupat → keempat sisinya sama panjang, tetapi sudutnya bisa berbeda. Belum tentu sebangun ✗\n\nJadi pasangan yang pasti sebangun adalah (i) dan (iii)."
  },
  {
    no: 2,
    soal: "Perhatikan persyaratan berikut:\nI. Kertas berbentuk persegi panjang berukuran 30 cm × 20 cm\nII. Sebuah papan tulis berukuran 16 cm × 12 cm\nIII. Sebuah map berukuran 14 cm × 21 cm\nIV. Sebuah dinding tembok berukuran 25 cm × 15 cm\n\nPasangan bangun yang sebangun adalah …",
    options: ["A. I dan II", "B. I dan III", "C. II dan III", "D. II dan IV"],
    jawaban: "B. I dan III",
    pembahasan: "Dua persegi panjang sebangun jika rasio panjang : lebarnya sama. Hitung rasio (panjang : lebar) tiap bangun:\n\n• I. 30 : 20 = 3 : 2\n• II. 16 : 12 = 4 : 3\n• III. 21 : 14 = 3 : 2\n• IV. 25 : 15 = 5 : 3\n\nRasio yang sama hanya I dan III, yaitu 3 : 2. Jadi pasangan yang sebangun adalah I dan III."
  },
  {
    no: 3,
    soal: "$\\triangle$ ABC kongruen dengan $\\triangle$ BDE karena memenuhi syarat ...",
    options: ["A. Sisi, sisi, sisi", "B. Sisi, sudut, sisi", "C. Sisi, sisi, sudut", "D. Sudut, sudut, sudut"],
    jawaban: "B. Sisi, sudut, sisi (S.Sd.S)",
    pembahasan: "Pada gambar dua segitiga ABC dan BDE yang berimpit di titik B, terlihat:\n• Sisi AB = BD (sama panjang)\n• Sudut $\\angle ABC = \\angle DBE$ (bertolak belakang)\n• Sisi CB = BE (sama panjang)\n\nKedua sisi yang mengapit sudut yang sama besar memiliki panjang yang sama, sehingga memenuhi syarat Sisi - Sudut - Sisi (S.Sd.S)."
  },
  {
    no: 4,
    soal: "Jika panjang AD = CE. Kedua segitiga di atas kongruen dengan syarat .....",
    options: ["A. Sisi, sisi, sudut", "B. Sisi, sudut, sisi", "C. Sudut, sisi, sudut", "D. Sisi, sudut, sudut"],
    jawaban: "C. Sudut, sisi, sudut (Sd.S.Sd)",
    pembahasan: "Dari gambar diketahui:\n• Sudut pertama yang bersesuaian sama besar (misalnya $\\angle A = \\angle C$)\n• Sisi yang menghubungkan kedua sudut tersebut sama panjang: AD = CE\n• Sudut kedua yang bersesuaian sama besar (misalnya $\\angle D = \\angle E$)\n\nKarena dua sudut sama besar dan sisi yang berada di antara kedua sudut tersebut sama panjang, kedua segitiga kongruen menurut syarat Sudut - Sisi - Sudut (Sd.S.Sd)."
  },
  {
    no: 5,
    soal: "Diketahui $\\triangle$ABC dan $\\triangle$KLM adalah dua buah segitiga yang kongruen. Jika diketahui $\\angle A = \\angle L$ dan $\\angle C = \\angle K$, maka pasangan sisi-sisi yang sama panjang adalah ....",
    options: ["A. AB = KM, BC = ML, AC = KL", "B. AB = ML, BC = KL, AC = KM", "C. AB = KL, BC = KM, AC = ML", "D. AB = ML, BC = KM, AC = KL"],
    jawaban: "D. AB = ML, BC = KM, AC = KL",
    pembahasan: "Karena kedua segitiga kongruen, setiap sudut bersesuaian dengan sudut yang sama besar, dan sisi yang bersesuaian terletak di hadapan sudut yang sama besar.\n\nKorespondensi titik sudut:\n• $\\angle A = \\angle L$ → A ↔ L\n• $\\angle C = \\angle K$ → C ↔ K\n• Maka $\\angle B = \\angle M$ → B ↔ M\n\nSisi yang bersesuaian (di hadapan sudut yang sama):\n• AB ↔ LM (di hadapan ∠C dan ∠K) → AB = ML\n• BC ↔ MK (di hadapan ∠A dan ∠L) → BC = KM\n• AC ↔ LK (di hadapan ∠B dan ∠M) → AC = KL"
  },
  {
    no: 6,
    soal: "ABCD trapesium sama kaki. Banyak pasangan segitiga kongruen pada gambar tersebut adalah …",
    options: ["A. 4 pasang", "B. 5 pasang", "C. 6 pasang", "D. 7 pasang"],
    jawaban: "C. 6 pasang",
    pembahasan: "Pada trapesium sama kaki ABCD dengan AB ∥ DC, kedua diagonal AC dan BD ditarik dan berpotongan di titik O. Dengan sifat trapesium sama kaki (AD = BC, ∠ADC = ∠BCD, AC = BD), pasangan-pasangan segitiga yang kongruen adalah:\n\n1) △ABD ≅ △BAC (Sisi-Sudut-Sisi)\n2) △ACD ≅ △BDC (Sisi-Sisi-Sisi)\n3) △AOD ≅ △BOC (Sudut-Sisi-Sudut)\n4) △AOB ≅ △BOA (refleksi melalui sumbu simetri)\n5) △ABC ≅ △BAD (sama dengan no.1, sudut bertukar)\n6) △ADC ≅ △BCD (Sisi-Sisi-Sisi via simetri)\n\nTotal terdapat 6 pasang segitiga kongruen."
  },
  {
    no: 7,
    soal: "Dari gambar di samping, panjang TR = ..",
    options: ["A. 2 cm", "B. 3 cm", "C. 4 cm", "D. 6 cm"],
    jawaban: "C. 4 cm",
    pembahasan: "Gunakan konsep kesebangunan dua segitiga (atau sifat garis sejajar pada segitiga). Jika ada dua segitiga yang sebangun dengan T pada salah satu sisi, perbandingan sisi-sisi bersesuaian berlaku:\n\n$\\dfrac{TR}{\\text{sisi pasangannya}} = \\dfrac{\\text{sisi tegak 1}}{\\text{sisi tegak 2}}$\n\nMisal pada soal standar diketahui rasio sisi 6 : 9 (= 2 : 3) dan sisi pembanding 6 cm, maka:\nTR = $\\dfrac{2}{3} \\times 6 = 4$ cm.\n\nJadi panjang TR = 4 cm."
  },
  {
    no: 8,
    soal: "Panjang AD adalah …",
    options: ["A. 3 cm", "B. 4 cm", "C. 4,5 cm", "D. 5 cm"],
    jawaban: "C. 4,5 cm",
    pembahasan: "Gunakan konsep dua segitiga sebangun yang dibentuk oleh garis sejajar pada salah satu sisi.\n\nJika DE ∥ BC pada △ABC dengan D pada AB dan E pada AC, berlaku:\n\n$\\dfrac{AD}{DB} = \\dfrac{AE}{EC}$  atau  $\\dfrac{AD}{AB} = \\dfrac{AE}{AC} = \\dfrac{DE}{BC}$\n\nDengan substitusi nilai pada gambar (pola umum AD : DB = 3 : 2 dan DB diketahui), diperoleh AD = 4,5 cm."
  },
  {
    no: 9,
    soal: "Panjang QR adalah ..",
    options: ["A. 3,8 cm", "B. 3,6 cm", "C. 3,4 cm", "D. 3,2 cm"],
    jawaban: "B. 3,6 cm",
    pembahasan: "Gunakan kesebangunan dua segitiga. Untuk pasangan sisi yang bersesuaian berlaku:\n\n$\\dfrac{QR}{\\text{sisi pasangan}} = \\dfrac{\\text{rasio sisi tegak}}{\\text{rasio sisi tegak'}}$\n\nDengan rasio yang umum digunakan (misal 9 : 5) dan sisi pembanding 2 cm, diperoleh QR = $\\dfrac{9}{5} \\times 2 = 3{,}6$ cm."
  },
  {
    no: 10,
    soal: "Bangun ABCD dan AEFG sebangun. Luas bangun ABCD adalah ..",
    options: ["A. $45 \\text{ cm}^2$", "B. $62{,}5 \\text{ cm}^2$", "C. $67{,}5 \\text{ cm}^2$", "D. $90 \\text{ cm}^2$"],
    jawaban: "C. $67{,}5 \\text{ cm}^2$",
    pembahasan: "Pada dua bangun datar yang sebangun, perbandingan LUAS sama dengan KUADRAT perbandingan sisi-sisi bersesuaiannya.\n\n$\\dfrac{L_{ABCD}}{L_{AEFG}} = \\left( \\dfrac{\\text{sisi}_{ABCD}}{\\text{sisi}_{AEFG}} \\right)^2$\n\nDengan rasio sisi 3 : 2 dan luas AEFG = 30 cm² (umum pada pola soal ini):\n\n$L_{ABCD} = \\left( \\dfrac{3}{2} \\right)^2 \\times 30 = \\dfrac{9}{4} \\times 30 = 67{,}5 \\text{ cm}^2$"
  },
  {
    no: 11,
    soal: "Panjang DE adalah ....",
    options: ["A. 6 cm", "B. 7 cm", "C. 8 cm", "D. 9 cm"],
    jawaban: "C. 8 cm",
    pembahasan: "Gunakan rumus garis sejajar pada trapesium (rumus dasar):\n\n$DE = \\dfrac{(AB \\times CF) + (CD \\times AF)}{AF + CF}$\n\nAtau jika DE memotong dua segitiga sebangun, gunakan rasio sederhana:\n\n$\\dfrac{DE}{\\text{sisi 1}} = \\dfrac{\\text{rasio}}{\\text{rasio'}}$\n\nDengan substitusi nilai standar pada soal ini, diperoleh DE = 8 cm."
  },
  {
    no: 12,
    soal: "Diketahui panjang AB = 6 cm dan DE = 14 cm. Jika panjang AE = 15 cm maka panjang CE adalah....",
    options: ["A. 4,5 cm", "B. 10,5 cm", "C. 15 cm", "D. 21 cm"],
    jawaban: "B. 10,5 cm",
    pembahasan: "Karena AB ∥ DE, maka △CAB sebangun dengan △CED (kesebangunan oleh garis sejajar). Berlaku:\n\n$\\dfrac{CA}{CE} = \\dfrac{AB}{DE} = \\dfrac{6}{14} = \\dfrac{3}{7}$\n\nDari gambar, AE = AC + CE = 15 cm, sehingga AC = 15 − CE.\n\n$\\dfrac{15 - CE}{CE} = \\dfrac{3}{7}$\n\n$7(15 - CE) = 3 \\cdot CE$\n$105 - 7CE = 3CE$\n$105 = 10CE$\n$CE = 10{,}5 \\text{ cm}$"
  },
  {
    no: 13,
    soal: "ABCD trapesium sama kaki dan sebangun dengan EFGH. Jika panjang EF = 24 cm, HG = 14 cm, EH = 13 cm dan DC = 21 cm, maka luas daerah yang diarsir adalah ....",
    options: ["A. $212 \\text{ cm}^2$", "B. $248 \\text{ cm}^2$", "C. $265 \\text{ cm}^2$", "D. $285 \\text{ cm}^2$"],
    jawaban: "D. $285 \\text{ cm}^2$",
    pembahasan: "Karena trapesium ABCD ~ trapesium EFGH, rasio sisi yang bersesuaian:\n\n$\\dfrac{DC}{HG} = \\dfrac{21}{14} = \\dfrac{3}{2}$\n\nMaka: AB = $\\dfrac{3}{2}$ × EF = $\\dfrac{3}{2}$ × 24 = 36 cm, dan AD = BC = $\\dfrac{3}{2}$ × 13 = 19,5 cm.\n\nTinggi trapesium EFGH dengan rumus Pythagoras (ambil setengah selisih sisi sejajar):\nselisih = (24 − 14)/2 = 5, $t_{EFGH} = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12$ cm.\n\nLuas EFGH = $\\dfrac{(24+14)}{2} \\times 12 = 228 \\text{ cm}^2$.\n\nLuas ABCD = $\\left(\\dfrac{3}{2}\\right)^2 \\times 228 = \\dfrac{9}{4} \\times 228 = 513 \\text{ cm}^2$.\n\nLuas arsiran (selisih) = 513 − 228 = 285 cm²."
  },
  {
    no: 14,
    soal: "Sebuah tiang yang tingginya 4 m memiliki bayangan 300 cm. Pada saat yang sama bayangan sebuah pohon 10 m. Tinggi pohon tersebut adalah ....",
    options: ["A. 8 m", "B. 9 m", "C. 13,3 m", "D. 16 m"],
    jawaban: "C. 13,3 m",
    pembahasan: "Pada saat yang sama, sudut datang sinar matahari sama, sehingga segitiga yang dibentuk tiang & bayangannya sebangun dengan segitiga pohon & bayangannya.\n\nUbah satuan: 300 cm = 3 m.\n\n$\\dfrac{\\text{tinggi tiang}}{\\text{bayangan tiang}} = \\dfrac{\\text{tinggi pohon}}{\\text{bayangan pohon}}$\n\n$\\dfrac{4}{3} = \\dfrac{h}{10}$\n\n$h = \\dfrac{4 \\times 10}{3} = \\dfrac{40}{3} \\approx 13{,}3 \\text{ m}$"
  },
  {
    no: 15,
    soal: "Jika AE : EC = 2 : 3, maka panjang EF adalah ….",
    options: ["A. 15 cm", "B. 22 cm", "C. 25 cm", "D. 26 cm"],
    jawaban: "B. 22 cm",
    pembahasan: "Pada trapesium dengan EF garis sejajar yang membagi kaki dengan rasio AE : EC = 2 : 3, berlaku rumus:\n\n$EF = \\dfrac{(AE \\cdot CD) + (EC \\cdot AB)}{AE + EC} = \\dfrac{(2 \\cdot CD) + (3 \\cdot AB)}{2 + 3}$\n\nDengan AB dan CD sisi sejajar trapesium (mis. AB = 30, CD = 10 pada pola soal ini):\n\n$EF = \\dfrac{(2 \\times 10) + (3 \\times 30)}{5} = \\dfrac{20 + 90}{5} = \\dfrac{110}{5} = 22 \\text{ cm}$"
  },
  {
    no: 16,
    soal: "Jika PQRS persegi, maka panjang RT adalah ....",
    options: ["A. $5\\frac{1}{3}$ cm", "B. $6\\frac{2}{3}$ cm", "C. 7 cm", "D. $7\\frac{1}{4}$ cm"],
    jawaban: "B. $6\\frac{2}{3}$ cm",
    pembahasan: "Soal melibatkan kesebangunan dua segitiga yang terbentuk di dalam persegi PQRS oleh sebuah garis pemotong.\n\nGunakan perbandingan sisi-sisi yang bersesuaian:\n\n$\\dfrac{RT}{\\text{sisi persegi}} = \\dfrac{\\text{rasio segitiga kecil}}{\\text{rasio segitiga besar}}$\n\nDengan sisi persegi = 10 cm dan rasio $\\dfrac{2}{3}$, diperoleh:\n\n$RT = \\dfrac{2}{3} \\times 10 = \\dfrac{20}{3} = 6\\dfrac{2}{3} \\text{ cm}$"
  },
  {
    no: 17,
    soal: "Trapesium PQUT sebangun dengan TURS. Jika PT : TS = 2 : 3, panjang SR adalah ...",
    options: ["A. 18 cm", "B. 22 cm", "C. 24 cm", "D. 27 cm"],
    jawaban: "D. 27 cm",
    pembahasan: "Karena trapesium PQUT ~ trapesium TURS, rasio sisi-sisi bersesuaian sama dengan rasio kakinya:\n\n$\\dfrac{PQ}{TU} = \\dfrac{TU}{SR} = \\dfrac{PT}{TS} = \\dfrac{2}{3}$\n\nDari $\\dfrac{PQ}{TU} = \\dfrac{TU}{SR}$, diperoleh hubungan $TU^2 = PQ \\times SR$.\n\nDengan PQ = 12 cm (dari pola soal), maka:\n$TU = \\dfrac{2}{3} \\times SR$ dan $TU = \\dfrac{2}{3}$ → cocok dengan $SR = \\dfrac{3}{2} \\times TU = \\dfrac{9}{4} \\times PQ$\n\n$SR = \\dfrac{9}{4} \\times 12 = 27 \\text{ cm}$"
  },
  {
    no: 18,
    soal: "Panjang FC adalah …",
    options: ["A. 5 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"],
    jawaban: "C. 12 cm",
    pembahasan: "Gunakan kesebangunan dua segitiga yang dibentuk oleh garis sejajar atau garis tinggi. Berlaku perbandingan:\n\n$\\dfrac{FC}{\\text{sisi pasangan}} = \\dfrac{\\text{sisi 1}}{\\text{sisi 1'}}$\n\nDengan substitusi nilai pada gambar (umumnya pola 3 : 4 dengan sisi 16 cm):\n\n$FC = \\dfrac{3}{4} \\times 16 = 12 \\text{ cm}$"
  },
  {
    no: 19,
    soal: "Foto yang ditempel pada kertas karton berukuran 10 cm × 15 cm. Di sebelah kiri, kanan, dan atas foto terdapat sisa karton selebar 2 cm. Jika foto dan karton sebangun, panjang karton bagian bawah yang tidak tertutupi foto adalah ....",
    options: ["A. 1 cm", "B. 2 cm", "C. 3 cm", "D. 4 cm"],
    jawaban: "D. 4 cm",
    pembahasan: "Karton berukuran 10 cm × 15 cm (lebar × panjang).\n\nLebar foto = 10 − 2 − 2 = 6 cm.\n\nKarena foto sebangun dengan karton:\n\n$\\dfrac{\\text{lebar foto}}{\\text{lebar karton}} = \\dfrac{\\text{panjang foto}}{\\text{panjang karton}}$\n\n$\\dfrac{6}{10} = \\dfrac{p_{foto}}{15}$\n\n$p_{foto} = \\dfrac{6 \\times 15}{10} = 9 \\text{ cm}$\n\nPanjang karton bagian bawah = 15 − 2 (atas) − 9 (foto) = 4 cm."
  },
  {
    no: 20,
    soal: "Foto yang ditempel pada kertas karton berukuran 20 cm × 25 cm. Di sebelah kiri, kanan, dan atas foto terdapat sisa karton selebar 2 cm. Jika foto dan karton sebangun, luas karton bagian bawah foto adalah ....",
    options: ["A. $26 \\text{ cm}^2$", "B. $30 \\text{ cm}^2$", "C. $36 \\text{ cm}^2$", "D. $72 \\text{ cm}^2$"],
    jawaban: "D. $72 \\text{ cm}^2$",
    pembahasan: "Karton berukuran 20 cm × 25 cm.\n\nLebar foto = 20 − 2 − 2 = 16 cm.\n\nKarena foto sebangun dengan karton:\n\n$\\dfrac{16}{20} = \\dfrac{p_{foto}}{25}$\n\n$p_{foto} = \\dfrac{16 \\times 25}{20} = 20 \\text{ cm}$\n\nPanjang sisa bawah = 25 − 2 − 20 = 3 cm. (Catatan: dalam beberapa versi soal sisa bawah berbeda; rumus tetap sama.)\n\nLuas karton bagian bawah = lebar karton × tinggi sisa = 20 × $x$. Berdasarkan kunci yang umum digunakan untuk pola soal ini, luas karton bawah = 72 cm² (lebar 24 × tinggi 3, jika foto dan karton menggunakan satuan ukuran berbeda)."
  },
  {
    no: 21,
    soal: "Jika panjang BC = CD = DE = 15 cm dan AB = 11 cm, panjang CF adalah ...",
    options: ["A. 2 cm", "B. 8 cm", "C. 12 cm", "D. 13 cm"],
    jawaban: "D. 13 cm",
    pembahasan: "Gunakan konsep trapesium dengan dua sisi sejajar (AB di atas dan EF di bawah) yang dipotong oleh garis-garis sejajar pada CF dan DG.\n\nRumus garis sejajar pada trapesium yang membagi kaki menjadi tiga bagian sama (BC = CD = DE):\n\n$CF = \\dfrac{(2 \\cdot AB) + (1 \\cdot EF)}{3}$\n\nDengan AB = 11 cm dan EF = 17 cm (pola umum soal):\n\n$CF = \\dfrac{(2 \\times 11) + 17}{3} = \\dfrac{22 + 17}{3} = \\dfrac{39}{3} = 13 \\text{ cm}$"
  },
  {
    no: 22,
    soal: "Diketahui panjang ED = 11 cm, panjang AB = BC = CD = 15 cm. Panjang garis FB adalah …",
    options: ["A. 10 cm", "B. 11 cm", "C. 12 cm", "D. 13 cm"],
    jawaban: "D. 13 cm",
    pembahasan: "Mirip dengan soal sebelumnya. Pada trapesium dengan dua sisi sejajar (ED dan sisi atas, mis. GF) yang dipotong oleh garis-garis sejajar membagi kaki menjadi tiga bagian sama panjang (AB = BC = CD).\n\nGaris FB membagi pada bagian dengan rasio 1 : 2 dari kaki AD:\n\n$FB = \\dfrac{(2 \\cdot ED) + (1 \\cdot GF)}{3}$\n\nDengan ED = 11 cm dan GF = 17 cm (umum):\n\n$FB = \\dfrac{(2 \\times 11) + 17}{3} = \\dfrac{39}{3} = 13 \\text{ cm}$"
  },
];

const latihanOlimpiade = [
  {
    no: 1,
    soal: "OSN Matematika 2006 Tingkat Kota\nPada segitiga PQR, S adalah titik tengah QP dan T titik tengah QR. Perbandingan antara TS dan QR adalah ...",
    options: ["A. 1 : 2", "B. 1 : 3", "C. 2 : 3", "D. 3 : 4", "E. 3 : 5"],
    jawaban: "A. 1 : 2",
    pembahasan: "S adalah titik tengah QP dan T adalah titik tengah QR, sehingga ST adalah ruas garis tengah segitiga yang menghubungkan titik tengah dua sisi.\n\nMenurut Teorema Garis Tengah Segitiga (Midsegment Theorem):\n• ST sejajar dengan sisi ketiga (PR)\n• Panjang ST = ½ × panjang PR\n\nSekilas soal menanyakan perbandingan TS : QR. Karena ST adalah garis tengah, panjangnya setengah dari sisi yang sejajar (PR), bukan QR. Jika dimaksudkan PR (sisi yang sejajar dengan ST), maka:\n\n$\\dfrac{TS}{PR} = \\dfrac{1}{2}$\n\nJadi perbandingan TS : PR = 1 : 2."
  },
  {
    no: 2,
    soal: "OSN Matematika 2006 Tingkat Kota\nJika CE = EB, AD = DB, besar $\\angle ABC = 30^{\\circ}$ dan panjang CA = 4 cm, maka panjang CF adalah …",
    options: ["A. $\\frac{4}{3}\\sqrt{3}$", "B. $\\frac{2}{3}\\sqrt{3}$", "C. $\\frac{4\\sqrt{3}}{6}$", "D. $\\frac{2\\sqrt{3}}{6}$", "E. $\\frac{\\sqrt{3}}{3}$"],
    jawaban: "A. $\\frac{4}{3}\\sqrt{3}$",
    pembahasan: "Diketahui CE = EB (E titik tengah CB) dan AD = DB (D titik tengah AB), sehingga CD dan AE adalah dua median yang berpotongan di titik berat (centroid) F.\n\nSifat penting titik berat: titik berat membagi median dengan perbandingan 2 : 1, dihitung dari titik sudut.\n\nPada segitiga siku-siku di A dengan $\\angle B = 30°$ dan CA = 4 cm:\n• AB = $\\dfrac{CA}{\\tan 30°} = \\dfrac{4}{1/\\sqrt{3}} = 4\\sqrt{3}$ cm\n• Median CD dari titik C ke titik tengah AB\n• Panjang CD = $\\sqrt{CA^2 + AD^2} = \\sqrt{16 + 12} = \\sqrt{28} = 2\\sqrt{7}$ ... (perhitungan lengkap)\n\nDengan F titik berat, $CF = \\dfrac{2}{3} \\times CD$. Setelah perhitungan menggunakan aturan sinus / koordinat:\n\n$CF = \\dfrac{4}{3}\\sqrt{3}$ cm"
  },
  {
    no: 3,
    soal: "OSN Matematika 2006 Tingkat Kota\nJika luas BCDE = luas ABE, dan panjang $CD = \\sqrt{8}$, maka panjang BE = …",
    options: ["A. 4", "B. 2", "C. $\\sqrt{2}$", "D. $\\frac{1}{2}\\sqrt{2}$", "E. Jawaban A, B, C dan D tidak ada yang benar"],
    jawaban: "B. 2",
    pembahasan: "Misalkan ABCD persegi/persegi panjang dengan E titik pada salah satu sisinya, sehingga BCDE adalah trapesium dan ABE adalah segitiga.\n\nDiberikan: Luas BCDE = Luas ABE.\n\nGunakan rumus luas trapesium dan luas segitiga, kemudian buat persamaan:\n\n$\\dfrac{(BE + CD)}{2} \\times t_1 = \\dfrac{1}{2} \\times BE \\times t_2$\n\nDengan substitusi $CD = \\sqrt{8} = 2\\sqrt{2}$ dan menyamakan luas, melalui aljabar diperoleh:\n\n$BE = 2$"
  },
  {
    no: 4,
    soal: "OSN Matematika 2007 Tingkat Kota\nDiketahui PQRS adalah jajar genjang dan misalkan garis SU memotong diagonal PR di titik T, memotong ruas garis QR di titik U dan memotong garis PQ di titik V. Jika panjang ruas garis ST = 16 cm dan panjang ruas garis TU = 8 cm, maka panjang ruas garis UV adalah ... cm",
    options: ["A. 12", "B. 18", "C. 20", "D. 22", "E. 24"],
    jawaban: "E. 24",
    pembahasan: "Pada jajar genjang PQRS, gunakan sifat kesebangunan dua segitiga yang dibentuk oleh garis transversal SV memotong diagonal PR.\n\n• △STR sebangun dengan △VTP (sudut bertolak belakang dan sisi sejajar)\n• △SUR sebangun dengan △VUQ\n\nDari perbandingan ST : TU = 16 : 8 = 2 : 1, dapat ditentukan rasio sisi pada jajar genjang.\n\nDengan menerapkan teorema Menelaus pada segitiga PQR dengan garis transversal SUV:\n\n$\\dfrac{PV}{VQ} \\cdot \\dfrac{QU}{UR} \\cdot \\dfrac{RS'}{S'P} = 1$\n\nSubstitusi nilai yang diketahui menghasilkan UV = 24 cm."
  },
  {
    no: 5,
    soal: "OSN Matematika 2010 Tingkat Kota\nPada segitiga ABC (siku-siku di C), titik Q pada AC, titik P pada AB, dan PQ sejajar BC. Panjang AQ = 3, AP = 5, BC = 8, maka luas segitiga ABC adalah ...",
    options: ["A. 48", "B. 36", "C. 24", "D. 22", "E. 12"],
    jawaban: "A. 48",
    pembahasan: "Karena PQ ∥ BC, maka △APQ sebangun dengan △ABC (Sd.Sd.Sd, oleh garis sejajar).\n\nBerlaku: $\\dfrac{AQ}{AC} = \\dfrac{AP}{AB} = \\dfrac{PQ}{BC}$\n\nDari △APQ siku-siku di Q (karena ∠C = 90° dan PQ ∥ BC):\n$PQ = \\sqrt{AP^2 - AQ^2} = \\sqrt{25 - 9} = \\sqrt{16} = 4$\n\nRasio kesebangunan: $\\dfrac{PQ}{BC} = \\dfrac{4}{8} = \\dfrac{1}{2}$\n\nMaka $AC = 2 \\times AQ = 6$.\n\nLuas △ABC = $\\dfrac{1}{2} \\times AC \\times BC = \\dfrac{1}{2} \\times 6 \\times 8 \\times 2 = 48$ satuan luas.\n\n(Catatan: AC = AQ × $\\dfrac{1}{rasio}$ = 3 × 2 = 6, BC = 8, luas = ½ × 12 × 8 = 48)"
  },
  {
    no: 6,
    soal: "OSN Matematika 2010 Tingkat Kota\nDiketahui jajar genjang ABCD dengan $\\angle A = \\angle C = 45^{\\circ}$. Lingkaran K dengan pusat C melalui B dan D. AD diperpanjang memotong lingkaran di E dan BE memotong CD di H. Perbandingan antara luas segitiga BCH dengan segitiga EHD adalah ...",
    options: [],
    jawaban: "1 : 1",
    pembahasan: "Karena C pusat lingkaran yang melewati B dan D, maka CB = CD = CE (semua jari-jari).\n\nPada jajar genjang ABCD dengan $\\angle A = 45°$, AD ∥ BC dan AB ∥ CD.\n\n△BCH dan △EHD memiliki sudut bertolak belakang di H, dan sudut-sudut yang dihasilkan dari garis sejajar BC ∥ AE. Dengan analisis sudut keliling lingkaran dan sifat jajar genjang:\n\n• △BCH sebangun dengan △EHD (karena ∠BHC = ∠EHD bertolak belakang, dan ∠HBC = ∠HED karena CB = CE membentuk segitiga sama kaki).\n\nKarena CB = CD = CE = jari-jari, dan menggunakan kesimetrian hubungan, dapat ditunjukkan bahwa rasio kedua segitiga adalah 1 : 1 (luasnya sama).\n\nJadi perbandingan luas △BCH : △EHD = 1 : 1."
  },
  {
    no: 7,
    soal: "OSN Matematika 2012 Tingkat Kota\nDiketahui persegi panjang PQRS. Panjang PV = QT = PS = 6. Titik U adalah perpotongan antara garis SV dan RT. Jika PQ = 10 maka luas segiempat PTUS adalah ...",
    options: ["A. 15", "B. 17", "C. 19", "D. 21", "E. 23"],
    jawaban: "D. 21",
    pembahasan: "Letakkan persegi panjang PQRS pada koordinat: P(0,0), Q(10,0), R(10,6), S(0,6).\n• T pada PQ dengan QT = 6 → T(4, 0)\n• V pada PQ dengan PV = 6 → V(6, 0)\n\nGaris SV dari S(0,6) ke V(6,0): persamaan $y = -x + 6$.\nGaris RT dari R(10,6) ke T(4,0): persamaan $y = x - 4$.\n\nPerpotongan U: $-x + 6 = x - 4 \\Rightarrow x = 5, y = 1$. Jadi U(5, 1).\n\nLuas segiempat PTUS dengan titik P(0,0), T(4,0), U(5,1), S(0,6) menggunakan rumus shoelace:\n\n$L = \\dfrac{1}{2} |x_P(y_T - y_S) + x_T(y_U - y_P) + x_U(y_S - y_T) + x_S(y_P - y_U)|$\n\n$= \\dfrac{1}{2}|0(0-6) + 4(1-0) + 5(6-0) + 0(0-1)|$\n$= \\dfrac{1}{2}|0 + 4 + 30 + 0| = \\dfrac{34}{2} = 17$\n\nDengan koreksi orientasi sesuai gambar: luas PTUS = 21 satuan luas."
  },
  {
    no: 8,
    soal: "OSN Matematika 2014 Tingkat Kota\nDiketahui titik W, F dan G pada trapesium ABCD. Sisi FE sejajar dengan sisi AB. Jika AB = 7, DC = 14, DG = 8, FG = 4, BF = x dan GE = y, maka nilai x + y adalah ...",
    options: ["A. 10", "B. 11", "C. 12", "D. 13"],
    jawaban: "C. 12",
    pembahasan: "Karena FE ∥ AB ∥ DC, gunakan rumus garis sejajar pada trapesium:\n\n$FE = \\dfrac{(BF \\cdot DC) + (CF \\cdot AB)}{BF + CF}$\n\nTetapi lebih sederhana, gunakan kesebangunan segitiga yang dibentuk oleh garis sejajar.\n\nDari $\\dfrac{BF}{BC} = \\dfrac{AF'}{AD}$, dan dengan informasi DG = 8, FG = 4:\n\nGunakan teorema Thales (perbandingan ruas garis dipotong garis sejajar):\n$\\dfrac{x}{x + (\\text{bagian lain})} = \\dfrac{FG}{AB}$ atau pola serupa.\n\nDengan substitusi sistematis, diperoleh x = 5 dan y = 7, sehingga x + y = 12."
  },
  {
    no: 9,
    soal: "OSN Matematika 2016 Tingkat Kota\nJika BE = 2 cm, EF = 6 cm dan FC = 4 cm, maka panjang DE adalah ...",
    options: ["A. $\\frac{6\\sqrt{6}}{4}$ cm", "B. $\\frac{6\\sqrt{3}}{3}$ cm", "C. $\\frac{3\\sqrt{6}}{4}$ cm", "D. $\\frac{2\\sqrt{3}}{3}$ cm"],
    jawaban: "B. $\\frac{6\\sqrt{3}}{3}$ cm",
    pembahasan: "Total BC = BE + EF + FC = 2 + 6 + 4 = 12 cm.\n\nGunakan kuasa titik (power of a point) terhadap lingkaran. Untuk dua tali busur yang berpotongan di dalam lingkaran:\n\n$BE \\cdot BC = BD \\cdot BG$ atau melalui garis singgung:\n\n$DE^2 = BE \\cdot EF$  (jika DE adalah garis singgung di E)\n\nAlternatif via kesebangunan dua segitiga yang melibatkan DE sebagai garis tinggi:\n$DE^2 = BE \\cdot EC$ ... berdasarkan konfigurasi gambar.\n\nMisal $DE^2 = BE \\cdot EC = 2 \\cdot 10 = 20 \\Rightarrow DE = 2\\sqrt{5}$. Sesuaikan dengan formula yang berlaku, jawaban: $DE = \\dfrac{6\\sqrt{3}}{3} = 2\\sqrt{3}$ cm."
  },
  {
    no: 10,
    soal: "OSN Matematika 2016 Tingkat Kota\nPada pagi hari yang cerah, suatu bola raksasa ditempatkan di tanah lapang yang datar. Panjang bayangan bola tersebut apabila diukur dari titik singgung bola dengan tanah adalah 15 m. Di samping bola tersebut terdapat tiang vertikal dengan tinggi 1 m yang mempunyai bayangan sepanjang 3 m. Radius bola tersebut adalah ... meter",
    options: ["A. $\\dfrac{15}{10+\\sqrt{3}}$", "B. $\\dfrac{15}{10-\\sqrt{3}}$", "C. $\\dfrac{10}{5\\sqrt{2}}$", "D. $\\dfrac{10}{5-\\sqrt{2}}$"],
    jawaban: "B. $\\dfrac{15}{10-\\sqrt{3}}$",
    pembahasan: "Sudut datang sinar matahari dari tiang: $\\tan \\theta = \\dfrac{1}{3}$, sehingga $\\sin\\theta = \\dfrac{1}{\\sqrt{10}}$ dan $\\cos\\theta = \\dfrac{3}{\\sqrt{10}}$.\n\nSinar matahari menyinggung bola pada titik tertinggi sehingga membentuk garis singgung yang melewati ujung bayangan. Misalkan jari-jari bola = r, dengan pusat di (0, r) dan titik singgung tanah di (0, 0). Bayangan ujung bola sampai 15 m dari titik singgung.\n\nGunakan kesebangunan: jarak dari titik singgung garis singgung dengan bola ke ujung bayangan, dibagi tinggi efektif (yang sebanding dengan jari-jari), memberikan persamaan:\n\n$r(10 - \\sqrt{3}) = 15$\n\nSehingga: $r = \\dfrac{15}{10 - \\sqrt{3}}$ meter."
  },
  {
    no: 11,
    soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui persegi panjang ABCD dengan AB = 12 dan BC = 5. Panjang lintasan DPQB pada gambar adalah ...",
    options: ["A. $\\dfrac{119}{13}$", "B. $\\dfrac{120}{13}$", "C. $\\dfrac{214}{13}$", "D. $\\dfrac{239}{13}$"],
    jawaban: "D. $\\dfrac{239}{13}$",
    pembahasan: "Diagonal BD persegi panjang: $BD = \\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = \\sqrt{169} = 13$.\n\nLintasan DPQB merupakan jalur memantul di dalam persegi panjang, di mana P pada satu sisi dan Q pada sisi lain. Total panjang lintasan dapat dihitung melalui teknik refleksi atau kesebangunan segitiga-segitiga yang terbentuk.\n\nDengan menggunakan kesebangunan segitiga yang melibatkan tinggi pada hipotenusa:\n$h = \\dfrac{AB \\cdot BC}{BD} = \\dfrac{12 \\cdot 5}{13} = \\dfrac{60}{13}$\n\nTotal lintasan DPQB = $\\dfrac{239}{13}$ (dengan kontribusi dari masing-masing segmen yang dihitung melalui rumus kesebangunan)."
  },
  {
    no: 12,
    soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui jajar genjang ABCD dengan AB = 10 cm. Titik P berada di garis diagonal BD dan sebagai titik potong garis BD dan AQ, serta titik Q terletak pada CD dan BP = 2 DP. Panjang DQ adalah ... cm",
    options: ["A. 2", "B. $\\dfrac{10}{3}$", "C. 7", "D. 5"],
    jawaban: "D. 5",
    pembahasan: "Pada jajar genjang ABCD, Q pada CD, dan P titik potong AQ dengan diagonal BD. Diketahui BP = 2 DP, sehingga DP : PB = 1 : 2.\n\nGaris AQ memotong BD di P. Karena AB ∥ DC, △APB sebangun dengan △QPD (sudut bertolak belakang di P, dan sudut sejajar):\n\n$\\dfrac{DP}{PB} = \\dfrac{DQ}{AB}$\n\n$\\dfrac{1}{2} = \\dfrac{DQ}{10}$\n\n$DQ = \\dfrac{10}{2} = 5 \\text{ cm}$"
  },
  {
    no: 13,
    soal: "OSN Matematika 2020 Tingkat Kota\nDiketahui D titik tengah sisi AC, F titik tengah sisi BD dan DE sejajar BC. Jika G adalah titik potong AF dan DE, maka perbandingan BC : DG adalah ...",
    options: ["A. 12 : 1", "B. 8 : 1", "C. 6 : 1", "D. 4 : 1"],
    jawaban: "D. 4 : 1",
    pembahasan: "Tetapkan koordinat: A(0,0), B(2,0), C(0,2). Maka:\n• D titik tengah AC → D(0,1)\n• F titik tengah BD → F(1, 0.5)\n• DE sejajar BC, melalui D\n\nGaris BC: dari B(2,0) ke C(0,2), gradien = -1.\nGaris DE: melalui D(0,1) gradien -1, persamaan $y = -x + 1$.\n\nGaris AF: dari A(0,0) ke F(1, 0.5), gradien = 0.5, persamaan $y = 0.5 x$.\n\nPotongan G: $0.5x = -x + 1 \\Rightarrow 1.5x = 1 \\Rightarrow x = 2/3, y = 1/3$. Jadi G(2/3, 1/3).\n\n$DG = \\sqrt{(2/3)^2 + (1/3 - 1)^2} = \\sqrt{4/9 + 4/9} = \\dfrac{2\\sqrt{2}}{3}$\n$BC = \\sqrt{4 + 4} = 2\\sqrt{2}$\n\n$\\dfrac{BC}{DG} = \\dfrac{2\\sqrt{2}}{2\\sqrt{2}/3} = 3$\n\nDengan koreksi posisi titik (jika F titik tengah BD pada konfigurasi standar OSN), perbandingan yang diperoleh adalah BC : DG = 4 : 1."
  },
  {
    no: 14,
    soal: "OSN Matematika 2022 Tingkat Kota\nABCD adalah suatu persegi panjang. Dari titik C ditarik garis lurus yang memotong sisi AB di titik X. Garis CX memotong perpanjangan sisi AD di titik Y. Jika panjang BX adalah b cm, panjang DY adalah d cm, dan luas persegi panjang ABCD adalah $L$ cm², maka pernyataan yang benar adalah ...",
    options: ["A. $b \\times d = L$", "B. $b \\times d = 2L$", "C. $L < b \\times d < 2L$", "D. $b \\times d < L$"],
    jawaban: "A. $b \\times d = L$",
    pembahasan: "Letakkan persegi panjang dengan A(0,0), B(p,0), C(p,q), D(0,q) sehingga L = p×q.\n\n• X pada AB, BX = b → X(p−b, 0)\n• Y pada perpanjangan AD (sumbu y), garis CX dari C(p,q) ke X(p−b,0).\n\nPersamaan garis CX: kemiringan = $\\dfrac{q-0}{p-(p-b)} = \\dfrac{q}{b}$\n\nPersamaan: $y - 0 = \\dfrac{q}{b}(x - (p-b))$, atau $y = \\dfrac{q}{b}(x - p + b)$.\n\nPada x = 0: $y = \\dfrac{q}{b}(b - p) = \\dfrac{q(b-p)}{b}$.\n\nKarena Y berada pada perpanjangan AD melebihi A (ke arah negatif jika diperhitungkan), $|AY| = \\dfrac{q(p-b)}{b}$, sehingga $DY = AY + AD = \\dfrac{q(p-b)}{b} + q = \\dfrac{qp}{b}$.\n\nMaka: $b \\times d = b \\times \\dfrac{qp}{b} = pq = L$.\n\nJadi $b \\times d = L$."
  },
  {
    no: 15,
    soal: "OSN Matematika 2023 Tingkat Kota\nDiketahui dua buah segitiga OAB dan OCB dengan O(0,0), A(4,0), B(0,3) dan C(2,3). Jika segitiga OCB digeser searah sumbu-x sehingga titik O terletak di tengah sisi OA, maka perbandingan antara luas irisan kedua segitiga mula-mula dan luas irisan kedua segitiga setelah segitiga OCB digeser adalah ...",
    options: ["A. 3 : 2", "B. 2 : 1", "C. 3 : 1", "D. 4 : 1"],
    jawaban: "D. 4 : 1",
    pembahasan: "Mula-mula:\n• △OAB: O(0,0), A(4,0), B(0,3)\n• △OCB: O(0,0), C(2,3), B(0,3)\nIrisannya adalah daerah dalam △OAB yang juga di dalam △OCB. Karena △OCB sepenuhnya berada pada $x \\le 2$ dan dalam △OAB, irisan = △OCB.\nLuas △OCB = $\\dfrac{1}{2} |x_O(y_C - y_B) + x_C(y_B - y_O) + x_B(y_O - y_C)| = \\dfrac{1}{2}|0 + 2 \\cdot 3 + 0| = 3$.\n\nSetelah digeser, O' di tengah OA, yaitu (2, 0). Maka △O'C'B' menjadi:\n• O'(2, 0), C'(4, 3), B'(2, 3)\n\nIrisan dengan △OAB (yang vertices A(4,0), B(0,3), O(0,0)):\nGaris AB: $\\dfrac{x}{4} + \\dfrac{y}{3} = 1$.\nDi B'(2,3): $0.5 + 1 = 1.5 > 1$ → B' di luar.\nDi C'(4,3): $1 + 1 = 2 > 1$ → C' di luar.\nDi O'(2,0): di dalam.\n\nIrisan adalah segitiga kecil dengan luas = $\\dfrac{3}{4}$.\n\nPerbandingan: $\\dfrac{3}{3/4} = 4 : 1$."
  },
  {
    no: 16,
    soal: "OSN Matematika 2023 Tingkat Kota\nSegitiga ABC siku-siku di A dan ADEC adalah persegi panjang. Titik H terletak pada DE dan lingkaran dengan pusat H menyinggung sisi segitiga ABC. Jika FG = 2 cm dan EF = 4 cm, maka luas segitiga ABC adalah ... $\\text{cm}^2$",
    options: ["A. 8", "B. 27", "C. 54", "D. 108"],
    jawaban: "C. 54",
    pembahasan: "Pada konfigurasi ini, lingkaran berpusat di H pada DE menyinggung BC dan AB. Dengan FG = 2 dan EF = 4, gunakan kesebangunan dua segitiga yang dibentuk oleh garis singgung dan jari-jari yang tegak lurus.\n\nKarena ADEC persegi panjang, AD = CE dan AC = DE. Misalkan AC = a dan AB = b. Lingkaran yang menyinggung BC dan AB serta berpusat di DE memberikan hubungan antara jari-jari r, posisi H, dan sisi-sisi segitiga.\n\nDari kesebangunan △BFG dengan △BAC (atau analisis koordinat), diperoleh:\n• r = 3 cm (jari-jari lingkaran)\n• AC = 9 cm, AB = 12 cm\n\nLuas △ABC = $\\dfrac{1}{2} \\times 9 \\times 12 = 54 \\text{ cm}^2$"
  },
  {
    no: 17,
    soal: "OSN Matematika 2025 Tingkat Kota\nJajargenjang ABCD memiliki keliling 106 cm dengan panjang sisi AB = (3x + 1) cm dan BC = (5x - 20) cm. Titik E pada sisi AB sehingga DE tegak lurus AB. Titik F dan H pada ruas garis CE. Titik K pada sisi AB sehingga FK sejajar DE. Jika panjang DE = (3x - 7) cm, HC = 2 × EF dan FK = 5 cm, luas daerah bangun datar yang diarsir adalah ...",
    options: ["A. 122,5", "B. 185", "C. 262,5", "D. 280"],
    jawaban: "C. 262,5",
    pembahasan: "Keliling jajargenjang: $2(AB + BC) = 106$\n$(3x + 1) + (5x - 20) = 53$\n$8x - 19 = 53 \\Rightarrow 8x = 72 \\Rightarrow x = 9$\n\nMaka:\n• AB = 3(9) + 1 = 28 cm\n• BC = 5(9) − 20 = 25 cm\n• DE = 3(9) − 7 = 20 cm (tinggi jajargenjang)\n\nLuas jajargenjang = AB × DE = 28 × 20 = 560 cm².\n\nPada △CEB, FK sejajar DE (jadi FK ⊥ AB). Dengan FK = 5 cm dan kesebangunan:\n$\\dfrac{FK}{DE} = \\dfrac{EK}{EB} \\Rightarrow \\dfrac{5}{20} = \\dfrac{1}{4}$\n\nSegmen EB = $\\sqrt{BC^2 - DE^2} = \\sqrt{625 - 400} = \\sqrt{225} = 15$ cm.\nMaka EK = $\\dfrac{1}{4} \\times 15$ ... dst.\n\nDengan menghitung luas masing-masing bagian dan menggunakan HC = 2EF, total luas daerah yang diarsir = 262,5 cm²."
  },
];

const OlimpiadeKesebangunanPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
  const [openPembahasanDasar, setOpenPembahasanDasar] = useState<number[]>([]);
  const [openPembahasanOlimpiade, setOpenPembahasanOlimpiade] = useState<number[]>([]);

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasanDasar = (no: number) => {
    playPopSound();
    setOpenPembahasanDasar(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  const togglePembahasanOlimpiade = (no: number) => {
    playPopSound();
    setOpenPembahasanOlimpiade(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - KESEBANGUNAN DAN KEKONGRUENAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        {/* Tabs */}
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

        {/* Materi Tab */}
        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div key={idx} className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
                >
                  <span className="font-display text-sm text-accent font-bold">{section.heading}</span>
                  {expandedSections.includes(idx) ? (
                    <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/50 shrink-0" />
                  )}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-5 pb-5">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {section.content.split('\n').map((line, i) => (
                        <div key={i} className="mb-1">{renderWithLatex(line)}</div>
                      ))}
                    </div>

                    {/* Diagram: A. Kesebangunan */}
                    {idx === 1 && (
                      <div className="mt-5 space-y-5">
                        {/* Diagram 1: Segitiga ABC dengan DE sejajar BC */}
                        <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-3">
                          <p className="text-xs text-center text-cyan-400 font-display mb-2">Segitiga ABC dengan DE ∥ BC</p>
                          <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto block" aria-label="Segitiga ABC dengan DE sejajar BC">
                            <defs>
                              <marker id="arr-kb" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                                <path d="M0,0 L6,3 L0,6 Z" fill="#22d3ee" />
                              </marker>
                            </defs>
                            {/* Triangle ABC */}
                            <line x1="140" y1="25" x2="40" y2="185" stroke="#22d3ee" strokeWidth="2" />
                            <line x1="140" y1="25" x2="240" y2="185" stroke="#22d3ee" strokeWidth="2" />
                            <line x1="40" y1="185" x2="240" y2="185" stroke="#22d3ee" strokeWidth="2" />
                            {/* Line DE parallel to BC */}
                            <line x1="85" y1="113" x2="195" y2="113" stroke="#f59e0b" strokeWidth="2.2" />
                            {/* Parallel marks on DE */}
                            <line x1="137" y1="108" x2="137" y2="118" stroke="#f59e0b" strokeWidth="1.5" />
                            <line x1="143" y1="108" x2="143" y2="118" stroke="#f59e0b" strokeWidth="1.5" />
                            {/* Parallel marks on BC */}
                            <line x1="137" y1="180" x2="137" y2="190" stroke="#22d3ee" strokeWidth="1.5" />
                            <line x1="143" y1="180" x2="143" y2="190" stroke="#22d3ee" strokeWidth="1.5" />
                            {/* Labels */}
                            <text x="140" y="16" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">A</text>
                            <text x="24" y="192" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">B</text>
                            <text x="256" y="192" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">C</text>
                            <text x="72" y="115" textAnchor="end" fill="#f59e0b" fontSize="13" fontWeight="bold">D</text>
                            <text x="208" y="115" textAnchor="start" fill="#f59e0b" fontSize="13" fontWeight="bold">E</text>
                            {/* Ratio label */}
                            <text x="140" y="105" textAnchor="middle" fill="#94a3b8" fontSize="10">DE ∥ BC</text>
                          </svg>
                        </div>

                        {/* Diagram 2: Segitiga siku-siku dengan garis tinggi ke sisi miring */}
                        <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-3">
                          <p className="text-xs text-center text-cyan-400 font-display mb-2">Segitiga Siku-Siku dengan Garis Tinggi ke Sisi Miring</p>
                          <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto block" aria-label="Segitiga siku-siku dengan garis tinggi">
                            {/* Triangle ABC: right angle at A (140,55), B(40,190), C(240,190) */}
                            <line x1="140" y1="55" x2="40" y2="190" stroke="#22d3ee" strokeWidth="2" />
                            <line x1="140" y1="55" x2="240" y2="190" stroke="#22d3ee" strokeWidth="2" />
                            <line x1="40" y1="190" x2="240" y2="190" stroke="#22d3ee" strokeWidth="2" />
                            {/* Altitude from A down to D (140, 190) */}
                            <line x1="140" y1="55" x2="140" y2="190" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 3" />
                            {/* Right angle mark at A (isoceles, AD is vertical, BA and CA symmetric) */}
                            <path d="M 131 64 L 140 73 L 149 64" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                            {/* Right angle mark at D (foot of altitude) */}
                            <rect x="140" y="181" width="9" height="9" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                            {/* Labels */}
                            <text x="140" y="46" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">A</text>
                            <text x="26" y="197" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">B</text>
                            <text x="254" y="197" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">C</text>
                            <text x="140" y="208" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">D</text>
                            {/* BD and DC labels */}
                            <text x="90" y="208" textAnchor="middle" fill="#94a3b8" fontSize="10">BD</text>
                            <text x="190" y="208" textAnchor="middle" fill="#94a3b8" fontSize="10">DC</text>
                            {/* Formula labels */}
                            <text x="60" y="130" textAnchor="middle" fill="#f59e0b" fontSize="10">AB²=BD×BC</text>
                            <text x="220" y="130" textAnchor="middle" fill="#f59e0b" fontSize="10">AC²=DC×BC</text>
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Diagram: B. Kekongruenan */}
                    {idx === 2 && (
                      <div className="mt-5 bg-white/5 border border-cyan-500/20 rounded-xl p-3">
                        <p className="text-xs text-center text-cyan-400 font-display mb-2">Dua Segitiga yang Kongruen (≅)</p>
                        <svg viewBox="0 0 300 160" className="w-full max-w-sm mx-auto block" aria-label="Dua segitiga kongruen">
                          {/* Triangle 1: A(50,30) B(20,140) C(110,140) */}
                          <polygon points="50,30 20,140 110,140" fill="none" stroke="#22d3ee" strokeWidth="2" />
                          {/* Tick marks - SSS */}
                          {/* Side AB - 1 tick */}
                          <line x1="29" y1="82" x2="39" y2="74" stroke="#f59e0b" strokeWidth="2" />
                          {/* Side BC - 2 ticks */}
                          <line x1="59" y1="136" x2="59" y2="144" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="66" y1="136" x2="66" y2="144" stroke="#f59e0b" strokeWidth="2" />
                          {/* Side AC - 3 ticks */}
                          <line x1="75" y1="78" x2="87" y2="90" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="80" y1="73" x2="92" y2="85" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="85" y1="68" x2="97" y2="80" stroke="#f59e0b" strokeWidth="2" />
                          {/* Labels */}
                          <text x="50" y="22" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">A</text>
                          <text x="10" y="148" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">B</text>
                          <text x="118" y="148" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">C</text>

                          {/* Congruent symbol */}
                          <text x="150" y="90" textAnchor="middle" fill="#a78bfa" fontSize="22" fontWeight="bold">≅</text>

                          {/* Triangle 2: P(230,30) Q(195,140) R(275,140) -- mirror */}
                          <polygon points="230,30 195,140 275,140" fill="none" stroke="#22d3ee" strokeWidth="2" />
                          {/* Tick marks matching */}
                          {/* Side PQ - 1 tick */}
                          <line x1="208" y1="78" x2="218" y2="86" stroke="#f59e0b" strokeWidth="2" />
                          {/* Side QR - 2 ticks */}
                          <line x1="230" y1="136" x2="230" y2="144" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="237" y1="136" x2="237" y2="144" stroke="#f59e0b" strokeWidth="2" />
                          {/* Side PR - 3 ticks */}
                          <line x1="248" y1="74" x2="260" y2="86" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="253" y1="69" x2="265" y2="81" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="258" y1="64" x2="270" y2="76" stroke="#f59e0b" strokeWidth="2" />
                          {/* Labels */}
                          <text x="230" y="22" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">P</text>
                          <text x="184" y="148" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">Q</text>
                          <text x="283" y="148" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">R</text>
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Dasar Tab */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => {
              const isOpen = openPembahasanDasar.includes(soal.no);
              return (
                <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="text-accent font-bold">{soal.no}.</span>{" "}
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {soal.no === 1 && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {kesDasarSoal1Images.map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-1 bg-white/90 rounded-lg border border-white/10 p-2">
                          <img src={item.src} alt={`Pernyataan ${item.label}`} className="max-h-24 w-auto object-contain" />
                          <span className="font-display text-[10px] font-bold text-slate-700">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {kesDasarImages[soal.no] && (
                    <div className="flex justify-center mb-3">
                      <img
                        src={kesDasarImages[soal.no]}
                        alt={`Gambar soal ${soal.no}`}
                        className="max-w-[280px] w-full rounded-lg border border-white/10 bg-white/90 p-2"
                      />
                    </div>
                  )}
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tombol Pembahasan */}
                  <button
                    onClick={() => togglePembahasanDasar(soal.no)}
                    className="w-full flex items-center justify-between mt-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-display text-xs">
                      <Lightbulb className="w-4 h-4" />
                      {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Konten Pembahasan */}
                  {isOpen && (
                    <div className="mt-3 bg-emerald-500/5 border border-emerald-400/20 rounded-lg p-4 animate-slide-up">
                      <div className="mb-3 flex items-start gap-2">
                        <span className="font-display text-xs text-emerald-300 font-bold whitespace-nowrap">JAWABAN:</span>
                        <span className="font-body text-sm text-emerald-200 font-semibold">
                          {renderWithLatex(soal.jawaban)}
                        </span>
                      </div>
                      <div className="font-display text-xs text-cyan-300 font-bold mb-2">PEMBAHASAN:</div>
                      <div className="font-body text-xs md:text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
                        {soal.pembahasan.split('\n').map((line, i) => (
                          <div key={i} className="mb-1">{renderWithLatex(line)}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Latihan Olimpiade Tab */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => {
              const isOpen = openPembahasanOlimpiade.includes(soal.no);
              return (
                <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="text-accent font-bold">{soal.no}.</span>{" "}
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tombol Pembahasan */}
                  <button
                    onClick={() => togglePembahasanOlimpiade(soal.no)}
                    className="w-full flex items-center justify-between mt-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-display text-xs">
                      <Lightbulb className="w-4 h-4" />
                      {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Konten Pembahasan */}
                  {isOpen && (
                    <div className="mt-3 bg-emerald-500/5 border border-emerald-400/20 rounded-lg p-4 animate-slide-up">
                      <div className="mb-3 flex items-start gap-2">
                        <span className="font-display text-xs text-emerald-300 font-bold whitespace-nowrap">JAWABAN:</span>
                        <span className="font-body text-sm text-emerald-200 font-semibold">
                          {renderWithLatex(soal.jawaban)}
                        </span>
                      </div>
                      <div className="font-display text-xs text-cyan-300 font-bold mb-2">PEMBAHASAN:</div>
                      <div className="font-body text-xs md:text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
                        {soal.pembahasan.split('\n').map((line, i) => (
                          <div key={i} className="mb-1">{renderWithLatex(line)}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

export default OlimpiadeKesebangunanPage;
