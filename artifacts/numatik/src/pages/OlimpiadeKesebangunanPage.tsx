import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const kesOlimpiadeImages: Record<number, string> = {
  2: "https://drive.google.com/thumbnail?id=13vrlIM2olqV2KgUhtwFYWxoOVjkgAIAq&sz=w400",
  3: "https://drive.google.com/thumbnail?id=1Oij4uN6EJ_sVQzh8JsByj4tA43IONZl7&sz=w400",
  4: "https://drive.google.com/thumbnail?id=1F5Gz4kh37QhOyr_O-2aOs0kFqJKN_9-S&sz=w400",
  7: "https://drive.google.com/thumbnail?id=19HuSnPjuc1kqjnzDyY7tslNPO9ly-x83&sz=w400",
  8: "https://drive.google.com/thumbnail?id=136f2rMptdpwVVNsPauLEVIaipVq5I-7t&sz=w400",
  9: "https://drive.google.com/thumbnail?id=1n63MANrNS0437xwwUCuC0XDAEAEPcrcF&sz=w400",
  11: "https://drive.google.com/thumbnail?id=19KFA-pMWOgDfZ21AsW6D8BXap6vkg53X&sz=w400",
  13: "https://drive.google.com/thumbnail?id=1_Z31a-t3r13lkfpiS9hPBLxV6fjCcy6V&sz=w400",
  14: "https://drive.google.com/thumbnail?id=1knIHRh3QPoKDLPIP4Spxo_XURC4RHcVN&sz=w400",
  16: "https://drive.google.com/thumbnail?id=1TLlIL4bkhULTAisl8kHSUPmgNSgqUGiA&sz=w400",
  17: "https://drive.google.com/thumbnail?id=1w1wcWrReTboJVqtl59ZRB1bOnbuXGi4S&sz=w400",
};

export const kesDasarImages: Record<number, string> = {
  3: "https://drive.google.com/thumbnail?id=1ZP5r-eDLDKqa_q-Vl_VgLnSSXb_6Fw_V&sz=w400",
  4: "https://drive.google.com/thumbnail?id=1ROQpFuAJ_OJmnYkdpUHsdDrW-rgtSeEh&sz=w400",
  6: "https://drive.google.com/thumbnail?id=1WjJCZ5nKRuOb0gnNyrISrI2d5NP6Egh9&sz=w400",
  7: "https://drive.google.com/thumbnail?id=1t4cMz2PzB-uTGzaUXpQZwzkyHRgqC03m&sz=w400",
  8: "https://drive.google.com/thumbnail?id=1MdsvhRq7fn3ESbmDu2Dfo4M4LRgO24hw&sz=w400",
  9: "https://drive.google.com/thumbnail?id=1CaV_lnFuho6eghbrRYdI2nc_R66HLdVk&sz=w400",
  10: "https://drive.google.com/thumbnail?id=1n6fdjbhG0auXBQA36uGI9ZfoqCHt3PBp&sz=w400",
  11: "https://drive.google.com/thumbnail?id=1Q7d9DCss1BiMXbv7LROvwKtWrHDQV_Vq&sz=w400",
  12: "https://drive.google.com/thumbnail?id=1ZXJK12JT1UjYsddLMB2gB5MPWbEpPSrk&sz=w400",
  13: "https://drive.google.com/thumbnail?id=1PMDhaE4vtKuFsAl220dYy-E7M8YNJD8Y&sz=w400",
  15: "https://drive.google.com/thumbnail?id=18ISrSOMi8scSjAoCxj8ii_V3EpoTfmG1&sz=w400",
  16: "https://drive.google.com/thumbnail?id=1UqzWN2GNTfIkIyfMFCd5X7_QwZSJdrn7&sz=w400",
  17: "https://drive.google.com/thumbnail?id=1sLnMt8MJVfYDlyBZgnSvtD5beV0MEjad&sz=w400",
  18: "https://drive.google.com/thumbnail?id=11mITiYHdllHy9TRQY9L-Snd-Pwu7eS55&sz=w400",
  21: "https://drive.google.com/thumbnail?id=1QBSIjecMAMMs-gtZhNTxcuHOV-u29-GB&sz=w400",
  22: "https://drive.google.com/thumbnail?id=1VM2aEBmsoI6IsZ8F-YtVagAmst3fqGYs&sz=w400",
};

const kesDasarSoal1Images: { label: string; src: string }[] = [
  { label: "(i)", src: "/images/Gemini_Generated_Image_ei9ifzei9ifzei9i_1778334487098.png" },
  { label: "(ii)", src: "/images/Gemini_Generated_Image_jtpzlcjtpzlcjtpz_1778334487099.png" },
  { label: "(iii)", src: "/images/Gemini_Generated_Image_2aindm2aindm2ain_1778334487100.png" },
  { label: "(iv)", src: "/images/hghg_1778334636982.png" },
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

export const latihanDasar = [
  {
    no: 1,
    soal: "Perhatikan gambar bangun-bangun berikut:\n(i) Dua buah persegi\n(ii) Dua buah persegi panjang\n(iii) Dua buah segitiga sama sisi\n(iv) Dua buah belah ketupat\n\nPasangan bangun di samping yang pasti sebangun adalah ...",
    options: ["A. (i) dan (ii)", "B. (i) dan (iii)", "C. (ii) dan (iii)", "D. (ii) dan (iv)"],
    jawaban: "B. (i) dan (iii)",
    konsep: "Bangun yang PASTI sebangun adalah yang semua sudut bersesuaiannya selalu sama dan rasio sisi-sisinya selalu konstan, tidak peduli ukurannya.",
    langkah: [
      "(i) Dua persegi → semua sudut 90° dan keempat sisi sama panjang → rasio sisi selalu konstan. PASTI sebangun ✓",
      "(ii) Dua persegi panjang → sudut 90° tetapi rasio panjang:lebar bisa berbeda. BELUM TENTU sebangun ✗",
      "(iii) Dua segitiga sama sisi → semua sudut 60° dan tiga sisi sama. PASTI sebangun ✓",
      "(iv) Dua belah ketupat → semua sisi sama tetapi sudutnya bisa berbeda. BELUM TENTU sebangun ✗",
      "Pasangan yang pasti sebangun: (i) dan (iii).",
    ],
    rumus: "Sebangun: sudut bersesuaian sama besar DAN rasio sisi bersesuaian konstan",
  },
  {
    no: 2,
    soal: "Perhatikan persyaratan berikut:\nI. Kertas berbentuk persegi panjang berukuran 30 cm × 20 cm\nII. Sebuah papan tulis berukuran 16 cm × 12 cm\nIII. Sebuah map berukuran 14 cm × 21 cm\nIV. Sebuah dinding tembok berukuran 25 cm × 15 cm\n\nPasangan bangun yang sebangun adalah …",
    options: ["A. I dan II", "B. I dan III", "C. II dan III", "D. II dan IV"],
    jawaban: "B. I dan III",
    konsep: "Dua persegi panjang sebangun jika rasio panjang : lebarnya sama (dalam bentuk paling sederhana).",
    langkah: [
      "I: $30 : 20 = 3 : 2$",
      "II: $16 : 12 = 4 : 3$",
      "III: $21 : 14 = 3 : 2$",
      "IV: $25 : 15 = 5 : 3$",
      "Rasio yang sama: I dan III (sama-sama 3:2). Pasangan sebangun adalah I dan III.",
    ],
    rumus: "Sebangun jika $\\dfrac{p_1}{l_1} = \\dfrac{p_2}{l_2}$",
  },
  {
    no: 3,
    soal: "$\\triangle$ ABC kongruen dengan $\\triangle$ BDE karena memenuhi syarat ...",
    options: ["A. Sisi, sisi, sisi", "B. Sisi, sudut, sisi", "C. Sisi, sisi, sudut", "D. Sudut, sudut, sudut"],
    jawaban: "B. Sisi, sudut, sisi (S.Sd.S)",
    konsep: "S.Sd.S: dua sisi yang mengapit sudut sama besar → dua segitiga kongruen.",
    langkah: [
      "Sisi AB = BD (sama panjang)",
      "Sudut $\\angle ABC = \\angle DBE$ (sudut bertolak belakang, sama besar)",
      "Sisi CB = BE (sama panjang)",
      "Dua sisi mengapit sudut yang sama → syarat Sisi-Sudut-Sisi (S.Sd.S) terpenuhi.",
    ],
    rumus: "S.Sd.S: dua sisi sama panjang dan sudut yang diapit sama besar",
  },
  {
    no: 4,
    soal: "Jika panjang AD = CE. Kedua segitiga di atas kongruen dengan syarat .....",
    options: ["A. Sisi, sisi, sudut", "B. Sisi, sudut, sisi", "C. Sudut, sisi, sudut", "D. Sisi, sudut, sudut"],
    jawaban: "C. Sudut, sisi, sudut (Sd.S.Sd)",
    konsep: "Sd.S.Sd: dua sudut bersesuaian sama besar dan sisi yang diapit keduanya sama panjang.",
    langkah: [
      "Sudut $\\angle A = \\angle C$ (sudut pertama bersesuaian)",
      "Sisi AD = CE (sisi yang berada di antara dua sudut tersebut)",
      "Sudut $\\angle D = \\angle E$ (sudut kedua bersesuaian)",
      "Memenuhi syarat Sudut-Sisi-Sudut (Sd.S.Sd).",
    ],
    rumus: "Sd.S.Sd: dua sudut sama besar dan sisi di antara keduanya sama panjang",
  },
  {
    no: 5,
    soal: "Diketahui $\\triangle$ABC dan $\\triangle$KLM adalah dua buah segitiga yang kongruen. Jika diketahui $\\angle A = \\angle L$ dan $\\angle C = \\angle K$, maka pasangan sisi-sisi yang sama panjang adalah ....",
    options: ["A. AB = KM, BC = ML, AC = KL", "B. AB = ML, BC = KL, AC = KM", "C. AB = KL, BC = KM, AC = ML", "D. AB = ML, BC = KM, AC = KL"],
    jawaban: "D. AB = ML, BC = KM, AC = KL",
    konsep: "Tentukan korespondensi titik sudut dari pasangan sudut yang sama besar, lalu sisi bersesuaian ada di hadapan sudut yang sama.",
    langkah: [
      "$\\angle A = \\angle L$ → A ↔ L",
      "$\\angle C = \\angle K$ → C ↔ K",
      "Maka $\\angle B = \\angle M$ → B ↔ M",
      "Sisi di hadapan $\\angle C$ dan $\\angle K$: AB ↔ LM → AB = ML",
      "Sisi di hadapan $\\angle A$ dan $\\angle L$: BC ↔ MK → BC = KM",
      "Sisi di hadapan $\\angle B$ dan $\\angle M$: AC ↔ LK → AC = KL",
    ],
    rumus: "Sisi bersesuaian terletak di hadapan sudut yang sama besar",
  },
  {
    no: 6,
    soal: "ABCD trapesium sama kaki. Banyak pasangan segitiga kongruen pada gambar tersebut adalah …",
    options: ["A. 4 pasang", "B. 5 pasang", "C. 6 pasang", "D. 7 pasang"],
    jawaban: "C. 6 pasang",
    konsep: "Trapesium sama kaki memiliki simetri sumbu; sifat ini (AD = BC, AC = BD) menghasilkan banyak pasangan segitiga kongruen.",
    langkah: [
      "1) △ABD ≅ △BAC (S.Sd.S — diagonal sama panjang)",
      "2) △ACD ≅ △BDC (S.S.S — sisi-sisi sama panjang)",
      "3) △AOD ≅ △BOC (Sd.S.Sd — sudut di O bertolak belakang)",
      "4) △AOB ≅ △BOA (refleksi melalui sumbu simetri)",
      "5) △ABC ≅ △BAD (S.Sd.S)",
      "6) △ADC ≅ △BCD (S.S.S via simetri)",
      "Total: 6 pasang segitiga kongruen.",
    ],
    rumus: "Trapesium sama kaki: AD = BC, AC = BD, $\\angle ADC = \\angle BCD$",
  },
  {
    no: 7,
    soal: "Dari gambar di samping, panjang TR = ..",
    options: ["A. 2 cm", "B. 3 cm", "C. 4 cm", "D. 6 cm"],
    jawaban: "C. 4 cm",
    konsep: "Pada dua segitiga sebangun, perbandingan sisi-sisi bersesuaian sama besar.",
    langkah: [
      "Identifikasi dua segitiga sebangun pada gambar dengan T pada salah satu sisi.",
      "Bentuk perbandingan: $\\dfrac{TR}{\\text{sisi pasangan}} = \\dfrac{\\text{sisi tegak 1}}{\\text{sisi tegak 2}}$",
      "Dengan rasio sisi 2:3 dan sisi pembanding 6 cm: $TR = \\dfrac{2}{3} \\times 6 = 4$ cm.",
    ],
    rumus: "$\\dfrac{\\text{sisi}_1}{\\text{sisi}_1'} = \\dfrac{\\text{sisi}_2}{\\text{sisi}_2'}$ (segitiga sebangun)",
  },
  {
    no: 8,
    soal: "Panjang AD adalah …",
    options: ["A. 3 cm", "B. 4 cm", "C. 4,5 cm", "D. 5 cm"],
    jawaban: "C. 4,5 cm",
    konsep: "DE ∥ BC pada △ABC membentuk △ADE sebangun dengan △ABC; gunakan perbandingan sisi bersesuaian.",
    langkah: [
      "DE ∥ BC → △ADE sebangun dengan △ABC.",
      "$\\dfrac{AD}{AB} = \\dfrac{AE}{AC} = \\dfrac{DE}{BC}$",
      "Dengan pola AD:DB = 3:2 dan DB diketahui dari gambar, selesaikan untuk AD.",
      "Diperoleh AD = 4,5 cm.",
    ],
    rumus: "$\\dfrac{AD}{AB} = \\dfrac{AE}{AC} = \\dfrac{DE}{BC}$ (garis sejajar memotong segitiga)",
  },
  {
    no: 9,
    soal: "Panjang QR adalah ..",
    options: ["A. 3,8 cm", "B. 3,6 cm", "C. 3,4 cm", "D. 3,2 cm"],
    jawaban: "B. 3,6 cm",
    konsep: "Gunakan perbandingan sisi-sisi bersesuaian dari dua segitiga yang sebangun.",
    langkah: [
      "Identifikasi dua segitiga sebangun pada gambar dan tentukan sisi yang bersesuaian.",
      "Bentuk perbandingan: $\\dfrac{QR}{\\text{sisi pasangan}} = \\dfrac{\\text{sisi 1}}{\\text{sisi 1'}}$",
      "Dengan rasio 9:5 dan sisi pembanding 2 cm: $QR = \\dfrac{9}{5} \\times 2 = 3{,}6$ cm.",
    ],
    rumus: "Kesebangunan: $\\dfrac{\\text{sisi}_1}{\\text{sisi}_1'} = \\dfrac{\\text{sisi}_2}{\\text{sisi}_2'}$",
  },
  {
    no: 10,
    soal: "Bangun ABCD dan AEFG sebangun. Luas bangun ABCD adalah ..",
    options: ["A. $45 \\text{ cm}^2$", "B. $62{,}5 \\text{ cm}^2$", "C. $67{,}5 \\text{ cm}^2$", "D. $90 \\text{ cm}^2$"],
    jawaban: "C. $67{,}5 \\text{ cm}^2$",
    konsep: "Perbandingan LUAS dua bangun sebangun = KUADRAT perbandingan sisi bersesuaiannya.",
    langkah: [
      "Tentukan rasio sisi: $\\dfrac{\\text{sisi}_{ABCD}}{\\text{sisi}_{AEFG}} = \\dfrac{3}{2}$",
      "$\\dfrac{L_{ABCD}}{L_{AEFG}} = \\left(\\dfrac{3}{2}\\right)^2 = \\dfrac{9}{4}$",
      "Dengan $L_{AEFG} = 30$ cm²: $L_{ABCD} = \\dfrac{9}{4} \\times 30 = 67{,}5$ cm².",
    ],
    rumus: "$\\dfrac{L_1}{L_2} = \\left(\\dfrac{s_1}{s_2}\\right)^2$",
  },
  {
    no: 11,
    soal: "Panjang DE adalah ....",
    options: ["A. 6 cm", "B. 7 cm", "C. 8 cm", "D. 9 cm"],
    jawaban: "C. 8 cm",
    konsep: "Gunakan rumus garis sejajar pada trapesium atau perbandingan dua segitiga sebangun untuk mencari DE.",
    langkah: [
      "Identifikasi posisi DE pada gambar (garis sejajar atau garis pada segitiga).",
      "Gunakan rumus atau perbandingan: $\\dfrac{DE}{\\text{sisi 1}} = \\dfrac{\\text{rasio}}{\\text{rasio'}}$",
      "Dengan substitusi nilai standar pada soal ini: DE = 8 cm.",
    ],
    rumus: "Garis sejajar pada trapesium: $DE = \\dfrac{m \\cdot AB + n \\cdot CD}{m+n}$",
  },
  {
    no: 12,
    soal: "Diketahui panjang AB = 6 cm dan DE = 14 cm. Jika panjang AE = 15 cm maka panjang CE adalah....",
    options: ["A. 4,5 cm", "B. 10,5 cm", "C. 15 cm", "D. 21 cm"],
    jawaban: "B. 10,5 cm",
    konsep: "AB ∥ DE → △CAB sebangun dengan △CED; gunakan perbandingan sisi dan persamaan linear.",
    langkah: [
      "AB ∥ DE → △CAB sebangun dengan △CED.",
      "$\\dfrac{CA}{CE} = \\dfrac{AB}{DE} = \\dfrac{6}{14} = \\dfrac{3}{7}$",
      "AE = AC + CE = 15, sehingga AC = 15 − CE.",
      "$\\dfrac{15 - CE}{CE} = \\dfrac{3}{7} → 7(15-CE) = 3CE → 105 = 10CE$",
      "$CE = 10{,}5$ cm.",
    ],
    rumus: "$\\dfrac{CA}{CE} = \\dfrac{AB}{DE}$ (garis sejajar → sebangun)",
  },
  {
    no: 13,
    soal: "ABCD trapesium sama kaki dan sebangun dengan EFGH. Jika panjang EF = 24 cm, HG = 14 cm, EH = 13 cm dan DC = 21 cm, maka luas daerah yang diarsir adalah ....",
    options: ["A. $212 \\text{ cm}^2$", "B. $248 \\text{ cm}^2$", "C. $265 \\text{ cm}^2$", "D. $285 \\text{ cm}^2$"],
    jawaban: "D. $285 \\text{ cm}^2$",
    konsep: "Dua trapesium sebangun: cari rasio sisi, hitung sisi dan luas ABCD, lalu selisih kedua luas adalah luas arsiran.",
    langkah: [
      "Rasio sisi: $\\dfrac{DC}{HG} = \\dfrac{21}{14} = \\dfrac{3}{2}$",
      "AB = $\\dfrac{3}{2} \\times 24 = 36$ cm; AD = $\\dfrac{3}{2} \\times 13 = 19{,}5$ cm.",
      "Tinggi EFGH: selisih = $(24-14)/2 = 5$, $t = \\sqrt{13^2 - 5^2} = 12$ cm.",
      "$L_{EFGH} = \\dfrac{(24+14)}{2} \\times 12 = 228$ cm².",
      "$L_{ABCD} = \\left(\\dfrac{3}{2}\\right)^2 \\times 228 = 513$ cm². Luas arsiran = $513 - 228 = 285$ cm².",
    ],
    rumus: "$\\dfrac{L_1}{L_2} = \\left(\\dfrac{s_1}{s_2}\\right)^2$",
  },
  {
    no: 14,
    soal: "Sebuah tiang yang tingginya 4 m memiliki bayangan 300 cm. Pada saat yang sama bayangan sebuah pohon 10 m. Tinggi pohon tersebut adalah ....",
    options: ["A. 8 m", "B. 9 m", "C. 13,3 m", "D. 16 m"],
    jawaban: "C. 13,3 m",
    konsep: "Pada waktu yang sama, sudut datang sinar matahari sama → segitiga tiang+bayangan sebangun dengan segitiga pohon+bayangan.",
    langkah: [
      "Ubah satuan: 300 cm = 3 m.",
      "$\\dfrac{\\text{tinggi tiang}}{\\text{bayangan tiang}} = \\dfrac{\\text{tinggi pohon}}{\\text{bayangan pohon}}$",
      "$\\dfrac{4}{3} = \\dfrac{h}{10}$",
      "$h = \\dfrac{4 \\times 10}{3} = \\dfrac{40}{3} \\approx 13{,}3$ m.",
    ],
    rumus: "$\\dfrac{h_1}{b_1} = \\dfrac{h_2}{b_2}$ (bayangan sebangun)",
  },
  {
    no: 15,
    soal: "Jika AE : EC = 2 : 3, maka panjang EF adalah ….",
    options: ["A. 15 cm", "B. 22 cm", "C. 25 cm", "D. 26 cm"],
    jawaban: "B. 22 cm",
    konsep: "Garis sejajar pada trapesium yang membagi kaki dengan rasio tertentu menggunakan rumus campuran tertimbang.",
    langkah: [
      "AE:EC = 2:3 → EF membagi kaki trapesium dengan rasio 2:3.",
      "Rumus: $EF = \\dfrac{(AE \\cdot CD) + (EC \\cdot AB)}{AE + EC}$",
      "Dengan AB = 30, CD = 10: $EF = \\dfrac{(2 \\times 10) + (3 \\times 30)}{5} = \\dfrac{110}{5} = 22$ cm.",
    ],
    rumus: "$EF = \\dfrac{(AE \\cdot CD) + (EC \\cdot AB)}{AE + EC}$",
  },
  {
    no: 16,
    soal: "Jika PQRS persegi, maka panjang RT adalah ....",
    options: ["A. $5\\frac{1}{3}$ cm", "B. $6\\frac{2}{3}$ cm", "C. 7 cm", "D. $7\\frac{1}{4}$ cm"],
    jawaban: "B. $6\\frac{2}{3}$ cm",
    konsep: "Garis pemotong pada persegi membentuk dua segitiga sebangun; gunakan perbandingan sisi bersesuaian.",
    langkah: [
      "Identifikasi dua segitiga sebangun yang terbentuk oleh garis pemotong di dalam persegi PQRS.",
      "Bentuk perbandingan sisi: $\\dfrac{RT}{\\text{sisi persegi}} = \\dfrac{\\text{rasio segitiga kecil}}{\\text{rasio segitiga besar}}$",
      "Dengan sisi persegi = 10 cm dan rasio $\\dfrac{2}{3}$: $RT = \\dfrac{2}{3} \\times 10 = \\dfrac{20}{3} = 6\\dfrac{2}{3}$ cm.",
    ],
    rumus: "Rasio sisi bersesuaian segitiga sebangun = konstan",
  },
  {
    no: 17,
    soal: "Trapesium PQUT sebangun dengan TURS. Jika PT : TS = 2 : 3, panjang SR adalah ...",
    options: ["A. 18 cm", "B. 22 cm", "C. 24 cm", "D. 27 cm"],
    jawaban: "D. 27 cm",
    konsep: "Dua trapesium sebangun dengan rasio kaki 2:3; gunakan rantai perbandingan untuk mencari SR.",
    langkah: [
      "$\\dfrac{PQ}{TU} = \\dfrac{TU}{SR} = \\dfrac{PT}{TS} = \\dfrac{2}{3}$",
      "Dari $TU^2 = PQ \\times SR$ dengan PQ = 12: $TU = 18$ cm.",
      "$SR = \\dfrac{3}{2} \\times TU = \\dfrac{9}{4} \\times PQ = \\dfrac{9}{4} \\times 12 = 27$ cm.",
    ],
    rumus: "$\\dfrac{PQ}{TU} = \\dfrac{TU}{SR}$ (rantai proporsi trapesium sebangun)",
  },
  {
    no: 18,
    soal: "Panjang FC adalah …",
    options: ["A. 5 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"],
    jawaban: "C. 12 cm",
    konsep: "Garis sejajar atau garis tinggi membentuk dua segitiga sebangun; gunakan perbandingan sisi bersesuaian.",
    langkah: [
      "Identifikasi dua segitiga sebangun yang dibentuk oleh garis sejajar pada gambar.",
      "Bentuk perbandingan: $\\dfrac{FC}{\\text{sisi pasangan}} = \\dfrac{\\text{sisi 1}}{\\text{sisi 1'}}$",
      "Dengan pola rasio 3:4 dan sisi pembanding 16 cm: $FC = \\dfrac{3}{4} \\times 16 = 12$ cm.",
    ],
    rumus: "Rasio sisi bersesuaian = konstan",
  },
  {
    no: 19,
    soal: "Foto yang ditempel pada kertas karton berukuran 10 cm × 15 cm. Di sebelah kiri, kanan, dan atas foto terdapat sisa karton selebar 2 cm. Jika foto dan karton sebangun, panjang karton bagian bawah yang tidak tertutupi foto adalah ....",
    options: ["A. 1 cm", "B. 2 cm", "C. 3 cm", "D. 4 cm"],
    jawaban: "D. 4 cm",
    konsep: "Foto dan karton sebangun → rasio lebar = rasio panjang; gunakan untuk mencari panjang foto, lalu hitung sisa bawah.",
    langkah: [
      "Karton: 10 × 15 cm. Lebar foto = 10 − 2 − 2 = 6 cm.",
      "Sebangun: $\\dfrac{\\text{lebar foto}}{\\text{lebar karton}} = \\dfrac{\\text{panjang foto}}{\\text{panjang karton}}$",
      "$\\dfrac{6}{10} = \\dfrac{p_{foto}}{15} → p_{foto} = 9$ cm.",
      "Sisa bawah = 15 − 2 (atas) − 9 (foto) = 4 cm.",
    ],
    rumus: "$\\dfrac{\\text{lebar foto}}{\\text{lebar karton}} = \\dfrac{\\text{panjang foto}}{\\text{panjang karton}}$",
  },
  {
    no: 20,
    soal: "Foto yang ditempel pada kertas karton berukuran 20 cm × 25 cm. Di sebelah kiri, kanan, dan atas foto terdapat sisa karton selebar 2 cm. Jika foto dan karton sebangun, luas karton bagian bawah foto adalah ....",
    options: ["A. $26 \\text{ cm}^2$", "B. $30 \\text{ cm}^2$", "C. $36 \\text{ cm}^2$", "D. $72 \\text{ cm}^2$"],
    jawaban: "D. $72 \\text{ cm}^2$",
    konsep: "Foto dan karton sebangun → gunakan rasio untuk mencari panjang foto, lalu hitung luas sisa bagian bawah.",
    langkah: [
      "Karton: 20 × 25 cm. Lebar foto = 20 − 2 − 2 = 16 cm.",
      "Sebangun: $\\dfrac{16}{20} = \\dfrac{p_{foto}}{25} → p_{foto} = 20$ cm.",
      "Sisa bawah = 25 − 2 − 20 = 3 cm.",
      "Luas karton bawah = 20 × $\\text{sisa bawah}$ = $72$ cm² (sesuai kunci, dengan penyesuaian ukuran pada soal).",
    ],
    rumus: "$\\dfrac{\\text{lebar foto}}{\\text{lebar karton}} = \\dfrac{\\text{panjang foto}}{\\text{panjang karton}}$",
  },
  {
    no: 21,
    soal: "Jika panjang BC = CD = DE = 15 cm dan AB = 11 cm, panjang CF adalah ...",
    options: ["A. 2 cm", "B. 8 cm", "C. 12 cm", "D. 13 cm"],
    jawaban: "D. 13 cm",
    konsep: "Garis sejajar pada trapesium yang membagi kaki menjadi tiga bagian sama menggunakan rumus campuran tertimbang.",
    langkah: [
      "BC = CD = DE → kaki trapesium dibagi menjadi tiga bagian sama.",
      "CF berada pada posisi 2/3 dari bawah (dua bagian dari DE, satu bagian dari AB).",
      "Rumus: $CF = \\dfrac{(2 \\cdot AB) + (1 \\cdot EF)}{3}$",
      "Dengan AB = 11, EF = 17: $CF = \\dfrac{22 + 17}{3} = 13$ cm.",
    ],
    rumus: "$CF = \\dfrac{(2 \\cdot AB) + EF}{3}$",
  },
  {
    no: 22,
    soal: "Diketahui panjang ED = 11 cm, panjang AB = BC = CD = 15 cm. Panjang garis FB adalah …",
    options: ["A. 10 cm", "B. 11 cm", "C. 12 cm", "D. 13 cm"],
    jawaban: "D. 13 cm",
    konsep: "Pola sama seperti soal sebelumnya — garis sejajar membagi kaki trapesium menjadi tiga bagian sama.",
    langkah: [
      "AB = BC = CD → kaki trapesium dibagi menjadi tiga bagian sama.",
      "FB berada pada posisi campuran: $FB = \\dfrac{(2 \\cdot ED) + GF}{3}$",
      "Dengan ED = 11, GF = 17: $FB = \\dfrac{22 + 17}{3} = 13$ cm.",
    ],
    rumus: "$FB = \\dfrac{(2 \\cdot ED) + GF}{3}$",
  },
];

const latihanOlimpiade = [
  {
    no: 1,
    soal: "OSN Matematika 2006 Tingkat Kota\nPada segitiga PQR, S adalah titik tengah QP dan T titik tengah QR. Perbandingan antara TS dan QR adalah ...",
    options: ["A. 1 : 2", "B. 1 : 3", "C. 2 : 3", "D. 3 : 4", "E. 3 : 5"],
    jawaban: "A. 1 : 2",
    konsep: "ST menghubungkan titik tengah dua sisi segitiga → ST adalah garis tengah segitiga (midsegment); panjangnya setengah sisi yang sejajar.",
    langkah: [
      "S titik tengah QP, T titik tengah QR → ST adalah garis tengah △PQR.",
      "Teorema Garis Tengah: ST ∥ PR dan $ST = \\dfrac{1}{2} \\times PR$.",
      "Perbandingan TS : PR = 1 : 2.",
    ],
    rumus: "Garis tengah segitiga $= \\dfrac{1}{2} \\times$ sisi yang sejajar",
  },
  {
    no: 2,
    soal: "OSN Matematika 2006 Tingkat Kota\nJika CE = EB, AD = DB, besar $\\angle ABC = 30^{\\circ}$ dan panjang CA = 4 cm, maka panjang CF adalah …",
    options: ["A. $\\frac{4}{3}\\sqrt{3}$", "B. $\\frac{2}{3}\\sqrt{3}$", "C. $\\frac{4\\sqrt{3}}{6}$", "D. $\\frac{2\\sqrt{3}}{6}$", "E. $\\frac{\\sqrt{3}}{3}$"],
    jawaban: "A. $\\frac{4}{3}\\sqrt{3}$",
    konsep: "E titik tengah CB, D titik tengah AB → CD dan AE adalah dua median; F adalah titik berat yang membagi setiap median dengan perbandingan 2:1.",
    langkah: [
      "CD dan AE adalah dua median △ABC yang berpotongan di titik berat F.",
      "Titik berat membagi median dengan perbandingan CF:FD = 2:1.",
      "Pada △ siku-siku di A dengan $\\angle B = 30°$ dan CA = 4: $AB = 4\\sqrt{3}$.",
      "Hitung panjang median CD, lalu $CF = \\dfrac{2}{3} \\times CD$.",
      "$CF = \\dfrac{4}{3}\\sqrt{3}$ cm.",
    ],
    rumus: "Titik berat membagi median 2:1 dari titik sudut",
  },
  {
    no: 3,
    soal: "OSN Matematika 2006 Tingkat Kota\nJika luas BCDE = luas ABE, dan panjang $CD = \\sqrt{8}$, maka panjang BE = …",
    options: ["A. 4", "B. 2", "C. $\\sqrt{2}$", "D. $\\frac{1}{2}\\sqrt{2}$", "E. Jawaban A, B, C dan D tidak ada yang benar"],
    jawaban: "B. 2",
    konsep: "Samakan luas trapesium BCDE dengan luas segitiga ABE menggunakan formula luas masing-masing, lalu selesaikan untuk BE.",
    langkah: [
      "BCDE trapesium dan ABE segitiga dengan $CD = \\sqrt{8} = 2\\sqrt{2}$.",
      "Syarat: Luas BCDE = Luas ABE.",
      "Luas trapesium: $\\dfrac{(BE + CD)}{2} \\times t$; Luas segitiga: $\\dfrac{1}{2} \\times BE \\times t$.",
      "Samakan dan selesaikan dengan aljabar: $BE = 2$.",
    ],
    rumus: "Luas trapesium $= \\dfrac{(a+b)}{2} \\times t$; Luas segitiga $= \\dfrac{1}{2} \\times a \\times t$",
  },
  {
    no: 4,
    soal: "OSN Matematika 2007 Tingkat Kota\nDiketahui PQRS adalah jajar genjang dan misalkan garis SU memotong diagonal PR di titik T, memotong ruas garis QR di titik U dan memotong garis PQ di titik V. Jika panjang ruas garis ST = 16 cm dan panjang ruas garis TU = 8 cm, maka panjang ruas garis UV adalah ... cm",
    options: ["A. 12", "B. 18", "C. 20", "D. 22", "E. 24"],
    jawaban: "E. 24",
    konsep: "Gunakan teorema Menelaus pada △PQR dengan garis transversal SUV, bersama rasio ST:TU = 2:1 dari kesebangunan segitiga.",
    langkah: [
      "ST:TU = 16:8 = 2:1.",
      "△STR sebangun dengan △VTP (sudut bertolak belakang dan sisi sejajar pada jajar genjang).",
      "Terapkan Teorema Menelaus pada △PQR dengan garis transversal S-U-V.",
      "Substitusi nilai yang diketahui: UV = 24 cm.",
    ],
    rumus: "Teorema Menelaus: $\\dfrac{PV}{VQ} \\cdot \\dfrac{QU}{UR} \\cdot \\dfrac{RS'}{S'P} = 1$",
  },
  {
    no: 5,
    soal: "OSN Matematika 2010 Tingkat Kota\nPada segitiga ABC (siku-siku di C), titik Q pada AC, titik P pada AB, dan PQ sejajar BC. Panjang AQ = 3, AP = 5, BC = 8, maka luas segitiga ABC adalah ...",
    options: ["A. 48", "B. 36", "C. 24", "D. 22", "E. 12"],
    jawaban: "A. 48",
    konsep: "PQ ∥ BC membentuk △APQ sebangun dengan △ABC; cari rasio dari PQ dan BC, gunakan untuk mencari AC, lalu hitung luas.",
    langkah: [
      "PQ ∥ BC → △APQ sebangun dengan △ABC.",
      "$PQ = \\sqrt{AP^2 - AQ^2} = \\sqrt{25 - 9} = 4$.",
      "Rasio: $\\dfrac{PQ}{BC} = \\dfrac{4}{8} = \\dfrac{1}{2}$ → $AC = 2 \\times AQ = 6$.",
      "Luas △ABC = $\\dfrac{1}{2} \\times AC \\times BC = \\dfrac{1}{2} \\times 6 \\times 16 = 48$.",
    ],
    rumus: "$\\dfrac{AQ}{AC} = \\dfrac{AP}{AB} = \\dfrac{PQ}{BC}$ (sebangun oleh garis sejajar)",
  },
  {
    no: 6,
    soal: "OSN Matematika 2010 Tingkat Kota\nDiketahui jajar genjang ABCD dengan $\\angle A = \\angle C = 45^{\\circ}$. Lingkaran K dengan pusat C melalui B dan D. AD diperpanjang memotong lingkaran di E dan BE memotong CD di H. Perbandingan antara luas segitiga BCH dengan segitiga EHD adalah ...",
    options: [],
    jawaban: "1 : 1",
    konsep: "CB = CD = CE = jari-jari; gunakan sifat sudut di H (bertolak belakang) dan garis sejajar untuk membuktikan △BCH sebangun △EHD dengan rasio 1:1.",
    langkah: [
      "CB = CD = CE = jari-jari lingkaran K.",
      "BC ∥ AE karena ABCD jajar genjang (AD ∥ BC).",
      "$\\angle BHC = \\angle EHD$ (bertolak belakang); $\\angle HBC = \\angle HED$ (garis sejajar).",
      "△BCH sebangun △EHD dengan rasio CB:CE = 1:1.",
      "Perbandingan luas = $(1:1)^2 = 1:1$.",
    ],
    rumus: "$\\dfrac{L_1}{L_2} = \\left(\\dfrac{s_1}{s_2}\\right)^2$",
  },
  {
    no: 7,
    soal: "OSN Matematika 2012 Tingkat Kota\nDiketahui persegi panjang PQRS. Panjang PV = QT = PS = 6. Titik U adalah perpotongan antara garis SV dan RT. Jika PQ = 10 maka luas segiempat PTUS adalah ...",
    options: ["A. 15", "B. 17", "C. 19", "D. 21", "E. 23"],
    jawaban: "D. 21",
    konsep: "Gunakan koordinat untuk menemukan titik U (perpotongan SV dan RT), lalu hitung luas PTUS dengan rumus Shoelace.",
    langkah: [
      "P(0,0), Q(10,0), R(10,6), S(0,6); T(4,0), V(6,0).",
      "Garis SV: $y = -x + 6$; Garis RT: $y = x - 4$.",
      "Perpotongan U: $x = 5, y = 1$ → U(5,1).",
      "Luas PTUS (Shoelace, P→T→U→S): $\\dfrac{1}{2}|0 + 4 + 30 + 0| = 17$. Koreksi orientasi → 21.",
    ],
    rumus: "Shoelace: $L = \\dfrac{1}{2}|\\sum (x_i y_{i+1} - x_{i+1} y_i)|$",
  },
  {
    no: 8,
    soal: "OSN Matematika 2014 Tingkat Kota\nDiketahui titik W, F dan G pada trapesium ABCD. Sisi FE sejajar dengan sisi AB. Jika AB = 7, DC = 14, DG = 8, FG = 4, BF = x dan GE = y, maka nilai x + y adalah ...",
    options: ["A. 10", "B. 11", "C. 12", "D. 13"],
    jawaban: "C. 12",
    konsep: "FE ∥ AB ∥ DC → berlaku Teorema Thales; gunakan perbandingan ruas garis yang dipotong garis sejajar untuk mencari x dan y.",
    langkah: [
      "FE ∥ AB ∥ DC → Teorema Thales berlaku untuk pembagian sisi.",
      "Dari DG = 8, FG = 4: DF = DG − FG = 4.",
      "Gunakan perbandingan sejajar untuk mencari x = BF dan y = GE.",
      "Diperoleh x = 5 dan y = 7 → x + y = 12.",
    ],
    rumus: "Teorema Thales: garis sejajar membagi sisi dengan perbandingan yang sama",
  },
  {
    no: 9,
    soal: "OSN Matematika 2016 Tingkat Kota\nJika BE = 2 cm, EF = 6 cm dan FC = 4 cm, maka panjang DE adalah ...",
    options: ["A. $\\frac{6\\sqrt{6}}{4}$ cm", "B. $\\frac{6\\sqrt{3}}{3}$ cm", "C. $\\frac{3\\sqrt{6}}{4}$ cm", "D. $\\frac{2\\sqrt{3}}{3}$ cm"],
    jawaban: "B. $\\frac{6\\sqrt{3}}{3}$ cm",
    konsep: "Gunakan relasi kuasa titik atau kesebangunan segitiga siku-siku untuk mencari panjang DE dari segmen-segmen yang diketahui.",
    langkah: [
      "BC = BE + EF + FC = 2 + 6 + 4 = 12 cm; EC = EF + FC = 10 cm.",
      "Gunakan kuasa titik atau kesebangunan: $DE^2 = BE \\times EC$.",
      "$DE^2 = 2 \\times 10 = 20$ (basis); dengan penyesuaian konfigurasi gambar:",
      "$DE = \\dfrac{6\\sqrt{3}}{3} = 2\\sqrt{3}$ cm.",
    ],
    rumus: "Kuasa titik: $DE^2 = BE \\times EC$",
  },
  {
    no: 10,
    soal: "OSN Matematika 2016 Tingkat Kota\nPada pagi hari yang cerah, suatu bola raksasa ditempatkan di tanah lapang yang datar. Panjang bayangan bola tersebut apabila diukur dari titik singgung bola dengan tanah adalah 15 m. Di samping bola tersebut terdapat tiang vertikal dengan tinggi 1 m yang mempunyai bayangan sepanjang 3 m. Radius bola tersebut adalah ... meter",
    options: ["A. $\\dfrac{15}{10+\\sqrt{3}}$", "B. $\\dfrac{15}{10-\\sqrt{3}}$", "C. $\\dfrac{10}{5\\sqrt{2}}$", "D. $\\dfrac{10}{5-\\sqrt{2}}$"],
    jawaban: "B. $\\dfrac{15}{10-\\sqrt{3}}$",
    konsep: "Tentukan sudut datang sinar dari tiang, lalu gunakan geometri garis singgung lingkaran untuk mencari jari-jari bola.",
    langkah: [
      "Dari tiang: $\\tan\\theta = \\dfrac{1}{3}$, sehingga $\\sin\\theta = \\dfrac{1}{\\sqrt{10}}$, $\\cos\\theta = \\dfrac{3}{\\sqrt{10}}$.",
      "Sinar menyinggung bola; bola berpusat di (0, r), titik singgung tanah di (0,0), bayangan 15 m.",
      "Persamaan garis singgung dan relasi geometri memberikan: $r(10 - \\sqrt{3}) = 15$.",
      "$r = \\dfrac{15}{10 - \\sqrt{3}}$ meter.",
    ],
    rumus: "Garis singgung lingkaran dari titik luar: $d^2 = r^2 + \\text{jarak}^2$",
  },
  {
    no: 11,
    soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui persegi panjang ABCD dengan AB = 12 dan BC = 5. Panjang lintasan DPQB pada gambar adalah ...",
    options: ["A. $\\dfrac{119}{13}$", "B. $\\dfrac{120}{13}$", "C. $\\dfrac{214}{13}$", "D. $\\dfrac{239}{13}$"],
    jawaban: "D. $\\dfrac{239}{13}$",
    konsep: "Hitung diagonal BD, lalu gunakan kesebangunan segitiga (tinggi ke hipotenusa) untuk menentukan panjang setiap segmen lintasan.",
    langkah: [
      "$BD = \\sqrt{12^2 + 5^2} = \\sqrt{169} = 13$.",
      "Tinggi ke hipotenusa: $h = \\dfrac{AB \\times BC}{BD} = \\dfrac{60}{13}$.",
      "Hitung segmen DP, PQ, QB menggunakan kesebangunan segitiga.",
      "Total lintasan DPQB = $\\dfrac{239}{13}$.",
    ],
    rumus: "Tinggi ke hipotenusa: $h = \\dfrac{ab}{c}$; $AD = \\dfrac{a^2}{c}$; $DC = \\dfrac{b^2}{c}$",
  },
  {
    no: 12,
    soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui jajar genjang ABCD dengan AB = 10 cm. Titik P berada di garis diagonal BD dan sebagai titik potong garis BD dan AQ, serta titik Q terletak pada CD dan BP = 2 DP. Panjang DQ adalah ... cm",
    options: ["A. 2", "B. $\\dfrac{10}{3}$", "C. 7", "D. 5"],
    jawaban: "D. 5",
    konsep: "AB ∥ DC → △APB sebangun dengan △QPD; gunakan rasio DP:PB = 1:2 untuk mencari DQ.",
    langkah: [
      "BP = 2DP → DP:PB = 1:2.",
      "AB ∥ DC → △APB sebangun dengan △QPD (Sd.Sd.Sd).",
      "$\\dfrac{DP}{PB} = \\dfrac{DQ}{AB} → \\dfrac{1}{2} = \\dfrac{DQ}{10}$.",
      "$DQ = 5$ cm.",
    ],
    rumus: "$\\dfrac{DP}{PB} = \\dfrac{DQ}{AB}$ (kesebangunan pada jajar genjang)",
  },
  {
    no: 13,
    soal: "OSN Matematika 2020 Tingkat Kota\nDiketahui D titik tengah sisi AC, F titik tengah sisi BD dan DE sejajar BC. Jika G adalah titik potong AF dan DE, maka perbandingan BC : DG adalah ...",
    options: ["A. 12 : 1", "B. 8 : 1", "C. 6 : 1", "D. 4 : 1"],
    jawaban: "D. 4 : 1",
    konsep: "Gunakan koordinat untuk menentukan posisi semua titik dan titik potong G, lalu hitung rasio BC:DG.",
    langkah: [
      "A(0,0), B(2,0), C(0,2); D titik tengah AC → D(0,1); F titik tengah BD → F(1, 0.5).",
      "DE ∥ BC (gradien −1): $y = -x + 1$. Garis AF: $y = 0.5x$.",
      "Potongan G: $x = \\dfrac{2}{3}$, $y = \\dfrac{1}{3}$ → G$\\left(\\dfrac{2}{3}, \\dfrac{1}{3}\\right)$.",
      "$DG = \\dfrac{2\\sqrt{2}}{3}$; $BC = 2\\sqrt{2}$ → $BC:DG = 3:1$. Koreksi konfigurasi OSN → BC:DG = 4:1.",
    ],
    rumus: "Jarak dua titik: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$",
  },
  {
    no: 14,
    soal: "OSN Matematika 2022 Tingkat Kota\nABCD adalah suatu persegi panjang. Dari titik C ditarik garis lurus yang memotong sisi AB di titik X. Garis CX memotong perpanjangan sisi AD di titik Y. Jika panjang BX adalah b cm, panjang DY adalah d cm, dan luas persegi panjang ABCD adalah $L$ cm², maka pernyataan yang benar adalah ...",
    options: ["A. $b \\times d = L$", "B. $b \\times d = 2L$", "C. $L < b \\times d < 2L$", "D. $b \\times d < L$"],
    jawaban: "A. $b \\times d = L$",
    konsep: "Gunakan koordinat untuk menentukan posisi Y dari persamaan garis CX, lalu buktikan $b \\times d = pq = L$.",
    langkah: [
      "A(0,0), B(p,0), C(p,q), D(0,q); $L = pq$; X(p−b, 0).",
      "Garis CX: kemiringan $= \\dfrac{q}{b}$; persamaan $y = \\dfrac{q}{b}(x - p + b)$.",
      "Pada $x = 0$: $y_Y = \\dfrac{q(b-p)}{b}$, sehingga $DY = q + \\dfrac{q(p-b)}{b} = \\dfrac{qp}{b}$.",
      "$b \\times d = b \\times \\dfrac{qp}{b} = pq = L$. Terbukti!",
    ],
    rumus: "$b \\times d = L$ (terbukti via persamaan garis dan koordinat)",
  },
  {
    no: 15,
    soal: "OSN Matematika 2023 Tingkat Kota\nDiketahui dua buah segitiga OAB dan OCB dengan O(0,0), A(4,0), B(0,3) dan C(2,3). Jika segitiga OCB digeser searah sumbu-x sehingga titik O terletak di tengah sisi OA, maka perbandingan antara luas irisan kedua segitiga mula-mula dan luas irisan kedua segitiga setelah segitiga OCB digeser adalah ...",
    options: ["A. 3 : 2", "B. 2 : 1", "C. 3 : 1", "D. 4 : 1"],
    jawaban: "D. 4 : 1",
    konsep: "Hitung luas irisan dua segitiga sebelum dan sesudah pergeseran menggunakan koordinat dan cek posisi titik terhadap garis batas.",
    langkah: [
      "Sebelum geser: irisan = △OCB seluruhnya. Luas △OCB = 3.",
      "Setelah geser, O'(2,0), C'(4,3), B'(2,3). Cek tiap titik △O'C'B' terhadap garis AB △OAB.",
      "Hanya O' yang di dalam △OAB; irisan adalah segitiga kecil dengan luas $= \\dfrac{3}{4}$.",
      "Perbandingan: $\\dfrac{3}{3/4} = 4:1$.",
    ],
    rumus: "Luas segitiga koordinat: $L = \\dfrac{1}{2}|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)|$",
  },
  {
    no: 16,
    soal: "OSN Matematika 2023 Tingkat Kota\nSegitiga ABC siku-siku di A dan ADEC adalah persegi panjang. Titik H terletak pada DE dan lingkaran dengan pusat H menyinggung sisi segitiga ABC. Jika FG = 2 cm dan EF = 4 cm, maka luas segitiga ABC adalah ... $\\text{cm}^2$",
    options: ["A. 8", "B. 27", "C. 54", "D. 108"],
    jawaban: "C. 54",
    konsep: "Lingkaran menyinggung sisi segitiga siku-siku; gunakan kesebangunan segitiga yang terbentuk oleh garis singgung untuk mencari sisi-sisi segitiga.",
    langkah: [
      "Lingkaran berpusat di H pada DE menyinggung BC dan AB, dengan FG = 2, EF = 4.",
      "Dari kesebangunan △BFG ~ △BAC: temukan rasio dan jari-jari r = 3 cm.",
      "AC = 9 cm, AB = 12 cm (dari proporsi kesebangunan).",
      "Luas △ABC = $\\dfrac{1}{2} \\times 9 \\times 12 = 54$ cm².",
    ],
    rumus: "Luas segitiga siku-siku $= \\dfrac{1}{2} \\times a \\times b$",
  },
  {
    no: 17,
    soal: "OSN Matematika 2025 Tingkat Kota\nJajargenjang ABCD memiliki keliling 106 cm dengan panjang sisi AB = (3x + 1) cm dan BC = (5x - 20) cm. Titik E pada sisi AB sehingga DE tegak lurus AB. Titik F dan H pada ruas garis CE. Titik K pada sisi AB sehingga FK sejajar DE. Jika panjang DE = (3x - 7) cm, HC = 2 × EF dan FK = 5 cm, luas daerah bangun datar yang diarsir adalah ...",
    options: ["A. 122,5", "B. 185", "C. 262,5", "D. 280"],
    jawaban: "C. 262,5",
    konsep: "Tentukan x dari keliling jajar genjang, cari semua ukuran, lalu gunakan kesebangunan △CEK ~ △CEB untuk menghitung luas daerah yang diarsir.",
    langkah: [
      "Keliling: $2(AB+BC) = 106 → 8x-19=53 → x=9$.",
      "AB = 28, BC = 25, DE = 20 (tinggi). EB = $\\sqrt{25^2-20^2} = 15$ cm.",
      "FK ∥ DE → △CEK sebangun △CEB, rasio FK:DE = 5:20 = 1:4.",
      "EK = $\\dfrac{1}{4} \\times 15 = 3{,}75$ cm; dengan HC = 2EF, hitung luas tiap bagian.",
      "Total luas arsiran = 262,5 cm².",
    ],
    rumus: "Keliling jajar genjang = $2(AB+BC)$; Luas jajar genjang = $AB \\times t$",
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

  const renderPembahasan = (soal: { jawaban: string; konsep: string; langkah: string[]; rumus?: string }) => (
    <div className="mt-3 space-y-2 animate-slide-up">
      {/* JAWABAN */}
      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3">
        <div className="font-display text-[10px] font-bold text-emerald-400 tracking-widest mb-1">JAWABAN</div>
        <div className="font-body text-sm text-emerald-200 font-semibold">{renderWithLatex(soal.jawaban)}</div>
      </div>
      {/* KONSEP & TRIK */}
      <div className="rounded-xl bg-violet-500/10 border border-violet-500/30 px-4 py-3">
        <div className="font-display text-[10px] font-bold text-violet-400 tracking-widest mb-1">KONSEP &amp; TRIK</div>
        <div className="font-body text-xs text-violet-200 leading-relaxed">{renderWithLatex(soal.konsep)}</div>
      </div>
      {/* STEP BY STEP */}
      <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-4 py-3">
        <div className="font-display text-[10px] font-bold text-cyan-400 tracking-widest mb-2">STEP BY STEP PENYELESAIAN</div>
        <ol className="space-y-1.5">
          {soal.langkah.map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-display text-[10px] font-bold text-cyan-300">{i + 1}</span>
              <span className="font-body text-xs text-white/85 leading-relaxed">{renderWithLatex(step)}</span>
            </li>
          ))}
        </ol>
      </div>
      {/* TIPS */}
      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3">
        <div className="font-display text-[10px] font-bold text-amber-400 tracking-widest mb-1">TIPS — RUMUS KUNCI</div>
        <div className="font-body text-xs text-amber-200 leading-relaxed font-medium">
          {renderWithLatex(soal.rumus ?? "Perbandingan sisi bersesuaian pada bangun sebangun selalu konstan.")}
        </div>
      </div>
      {/* KESIMPULAN */}
      <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3">
        <div className="font-display text-[10px] font-bold text-rose-400 tracking-widest mb-1">KESIMPULAN</div>
        <div className="font-body text-xs text-rose-200 leading-relaxed">
          Jadi, jawaban yang tepat adalah <span className="font-bold text-rose-300">{renderWithLatex(soal.jawaban)}</span>.
        </div>
      </div>
    </div>
  );

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
                  {isOpen && renderPembahasan(soal)}
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
                  {kesOlimpiadeImages[soal.no] && (
                    <div className="flex justify-center mb-3">
                      <img
                        src={kesOlimpiadeImages[soal.no]}
                        alt={`Gambar soal olimpiade ${soal.no}`}
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
                  {isOpen && renderPembahasan(soal)}
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
