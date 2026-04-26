import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

import gambar2 from "@/assets/Gambar_2_Sudut_Bersebelahan_1773289476314.png";
import gambar3 from "@/assets/Gambar_3_Jumlah_Sudut_Dalam_1_Putaran_1773289476316.png";
import gambar4 from "@/assets/Gambar_4_Sudut_Saling_Berpelurus_1773289476316.png";
import gambar5 from "@/assets/Gambar_5_Sudut_Saling_Berpelurus_2_1773289476317.png";
import gambar6 from "@/assets/Gambar_6_Sudut_Saling_Berpelurus_3_1773289476317.png";
import gambar7 from "@/assets/Gambar_7_Sudut_Saling_Berpenyiku_1773289476318.png";
import gambar8 from "@/assets/Gambar_8_Sudut_Saling_Bertolak_Belakang_1773289476318.png";
import gambar9 from "@/assets/Gambar_9_sudut_bersebrangan_1773289476319.png";
import gambar10 from "@/assets/Gambar_10_Sudut_Saling_Sehadap_1773289476320.png";
import gambar11 from "@/assets/Gambar_11_Sudut_bertolak_belakang_2_1773289509181.png";
import gambar12 from "@/assets/Gambar_12_Sudut_Saling_sepihak_1773289509182.png";
import gambar13 from "@/assets/Gambar_13_Jumlah_sudut_pada_segitiga_1773289509182.png";
import gambar14 from "@/assets/Gambar_14_Sudut-sudut_pada_segitiga_1773289509182.png";
import gambar15 from "@/assets/Gambar_15_Jumlah_Sudut_pada_segi-n_1773289509183.png";
import gambar16 from "@/assets/Gambar_16_SOAL_1773289509183.png";
import gambar17 from "@/assets/Gambar_17_SOAL_1773289509183.png";
import gambar18 from "@/assets/Gambar_18_SOAL_1773289509184.png";
import gambar19 from "@/assets/Gambar_19_SOAL_1773289509184.png";
import gambar20 from "@/assets/Gambar_20_SOAL_1773290091432.png";
import gambar21 from "@/assets/Gambar_21_SOAL_1773290091432.png";
import gambar22 from "@/assets/Gambar_22_SOAL_1773290091433.png";
import gambar23 from "@/assets/Gambar_23_SOAL_1773290091433.png";
import gambar24 from "@/assets/Gambar_24_SOAL_1773290091434.png";
import gambar25 from "@/assets/Gambar_25_SOAL_1773290091434.png";
import gambar26 from "@/assets/Gambar_26_SOAL_1773290091435.png";
import gambar27 from "@/assets/Gambar_27_SOAL_1773290091435.png";
import gambar28 from "@/assets/Gambar_28_SOAL_1773290091436.png";
import gambar29 from "@/assets/Gambar_29_SOAL_1773290091436.png";
import gambar30 from "@/assets/Gambar_30_SOAL_1773290091436.png";
import gambar31 from "@/assets/Gambar_31_SOAL_1773290091437.png";
import gambar32 from "@/assets/Gambar_32_SOAL_1773290091437.png";
import gambar33 from "@/assets/Gambar_33_SOAL_1773290091437.png";
import gambar34 from "@/assets/Gambar_34_SOAL_1773290091438.png";
import gambar35 from "@/assets/Gambar_35_SOAL_1773290091438.png";
import gambar36 from "@/assets/Gambar_36_SOAL_1773290091438.png";
import gambar37 from "@/assets/Gambar_37_SOAL_1773290091439.png";
import gambar38 from "@/assets/Gambar_38_SOAL_1773290091440.png";
import gambar39 from "@/assets/Gambar_39_SOAL_1773290091440.png";
import gambarOlimpiade1 from "@assets/image_1777195619892.png";

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

const SudutPosNegSVG = () => (
  <svg viewBox="0 0 340 195" className="w-full max-w-md mx-auto" style={{ background: "transparent" }}>
    <defs>
      <marker id="ah-gsv" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
        <path d="M 0 0 L 6 3.5 L 0 7 Z" fill="#ffffff" />
      </marker>
      <marker id="ah-gsv-yellow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
        <path d="M 0 0 L 6 3.5 L 0 7 Z" fill="#F0C040" />
      </marker>
    </defs>

    {/* ── LEFT: Sudut Positif ── */}
    {/* OA arm → right */}
    <line x1="80" y1="120" x2="150" y2="120" stroke="#ffffff" strokeWidth="2" markerEnd="url(#ah-gsv)" />
    {/* OB arm → upper-left (130°) */}
    <line x1="80" y1="120" x2="40" y2="72" stroke="#ffffff" strokeWidth="2" markerEnd="url(#ah-gsv)" />
    {/* Arc CCW from 0° to 130°: sweep-flag=0 */}
    <path d="M 116,120 A 36,36 0 0,0 56.9,92.4" fill="none" stroke="#F0C040" strokeWidth="1.8" markerEnd="url(#ah-gsv-yellow)" />
    {/* Labels */}
    <text x="74" y="136" fill="#38bdf8" fontSize="13" fontFamily="serif" fontStyle="italic">O</text>
    <text x="152" y="116" fill="#38bdf8" fontSize="13" fontFamily="serif" fontStyle="italic">A</text>
    <text x="28"  y="72"  fill="#38bdf8" fontSize="13" fontFamily="serif" fontStyle="italic">B</text>
    <text x="95"  y="108" fill="#38bdf8" fontSize="12" fontFamily="serif" fontStyle="italic">θ</text>
    <text x="80"  y="155" fill="#38bdf8" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Sudut Positif (+)</text>
    <text x="80"  y="170" fill="#38bdf8" fontSize="8.5" textAnchor="middle" opacity="0.85">berlawanan arah jarum jam</text>

    {/* Divider */}
    <line x1="170" y1="10" x2="170" y2="185" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.35" />

    {/* ── RIGHT: Sudut Negatif ── */}
    {/* OA arm → right */}
    <line x1="250" y1="80" x2="320" y2="80" stroke="#ffffff" strokeWidth="2" markerEnd="url(#ah-gsv)" />
    {/* OB arm → lower-left (-130° = 230°) */}
    <line x1="250" y1="80" x2="210" y2="128" stroke="#ffffff" strokeWidth="2" markerEnd="url(#ah-gsv)" />
    {/* Arc CW from 0° to -130°: sweep-flag=1 */}
    <path d="M 286,80 A 36,36 0 0,1 226.9,107.6" fill="none" stroke="#F0C040" strokeWidth="1.8" markerEnd="url(#ah-gsv-yellow)" />
    {/* Labels */}
    <text x="244" y="96"  fill="#38bdf8" fontSize="13" fontFamily="serif" fontStyle="italic">O</text>
    <text x="322" y="76"  fill="#38bdf8" fontSize="13" fontFamily="serif" fontStyle="italic">A</text>
    <text x="198" y="132" fill="#38bdf8" fontSize="13" fontFamily="serif" fontStyle="italic">B</text>
    <text x="262" y="100" fill="#38bdf8" fontSize="12" fontFamily="serif" fontStyle="italic">-θ</text>
    <text x="250" y="155" fill="#38bdf8" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Sudut Negatif (-)</text>
    <text x="250" y="170" fill="#38bdf8" fontSize="8.5" textAnchor="middle" opacity="0.85">searah arah jarum jam</text>
  </svg>
);

const MateriImage = ({ src, caption }: { src: string; caption: string }) => (
  <div className="my-3 flex flex-col items-center">
    <img src={src} alt={caption} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5" />
    <p className="text-xs text-white/40 mt-1 italic">{caption}</p>
  </div>
);

type SectionContent = {
  type: "text";
  value: string;
} | {
  type: "image";
  src: string;
  caption: string;
} | {
  type: "svg";
  component: ReactNode;
  caption: string;
};

type MateriSection = {
  heading: string;
  items: SectionContent[];
};

const materiSections: MateriSection[] = [
  {
    heading: "A. Definisi Sudut",
    items: [
      {
        type: "text",
        value: `Sebuah sudut dibentuk ketika dua garis yang berbeda bertemu di satu titik. Sudut adalah besaran rotasi suatu ruas garis dari satu titik pangkalnya ke posisi yang lain. Selain itu, dalam bangun dua dimensi yang beraturan, sudut dapat pula diartikan sebagai ruang antara dua buah ruas garis lurus yang saling berpotongan.`
      }
    ]
  },
  {
    heading: "B. Sudut Positif dan Sudut Negatif",
    items: [
      {
        type: "text",
        value: `Ruas garis $\\overline{OA}$ diputar terhadap titik $O$ ke garis $\\overline{OB}$ sehingga diperoleh sudut $AOB$ dan dapat ditulis dengan $\\angle AOB$.`
      },
      { type: "svg", component: <SudutPosNegSVG />, caption: "Gambar 1: Pengukuran Sudut Positif dan Sudut Negatif" },
      {
        type: "text",
        value: `Untuk mengukur sudut dilakukan berlawanan dengan arah jarum jam yang disebut dengan sudut positif, sedangkan jika pengukuran dilakukan searah jarum jam maka dituliskan sudut negatif.

Jadi besar sudut itu selalu positif, jika ada sudut yang dituliskan negatif, itu bukan besar sudut yang sebenarnya, hanya cara mengukurnya yang dilakukan berbeda.

Misalnya tertulis sudut $\\angle AOB = -30^\\circ$, sudut sebenarnya adalah $\\angle AOB = 360^\\circ - 30^\\circ = 330^\\circ$.`
      }
    ]
  },
  {
    heading: "C. Ukuran Sudut",
    items: [
      {
        type: "text",
        value: `Berdasarkan ukurannya, sudut dibagi dalam beberapa jenis yaitu:

1. Sudut $0^\\circ$, pada sudut nol derajat tidak terdapat perputaran;
2. Sudut $90^\\circ$ sering juga disebut dengan sudut siku-siku, sudut yang terbentuk dari seperempat putaran;
3. Sudut $180^\\circ$, sudut yang terbentuk dari setengah putaran;
4. Sudut $360^\\circ$, sudut yang terbentuk dari satu putaran penuh;
5. Sudut lancip, yaitu sudut yang besarnya $0^\\circ < \\theta < 90^\\circ$;
6. Sudut tumpul, yaitu sudut yang besarnya $90^\\circ < \\theta < 180^\\circ$;
7. Sudut refleks, yaitu sudut yang besarnya $180^\\circ < \\theta < 360^\\circ$.`
      }
    ]
  },
  {
    heading: "D. Sudut Yang Bersebelahan",
    items: [
      {
        type: "text",
        value: `Sudut yang bersebelahan adalah sudut yang memiliki titik pusat sama dan memiliki salah satu sisi yang sama.`
      },
      { type: "image", src: gambar2, caption: "Gambar 2: Sudut Bersebelahan" }
    ]
  },
  {
    heading: "E. Sudut Pada Satu Titik",
    items: [
      {
        type: "text",
        value: `Sudut pada satu titik adalah sudut yang terbentuk oleh beberapa garis (2 garis atau lebih) dan jumlah keseluruhan sudut (dalam 1 putaran) adalah $360^\\circ$.`
      },
      { type: "image", src: gambar3, caption: "Gambar 3: Jumlah Sudut Dalam 1 Putaran" }
    ]
  },
  {
    heading: "F. Sudut Berpelurus (Sudut Suplemen)",
    items: [
      {
        type: "text",
        value: `Sudut yang berpelurus adalah dua buah sudut yang membentuk sudut $180^\\circ$. Masing-masing sudut tersebut saling berpelurus satu dengan yang lainnya.`
      },
      { type: "image", src: gambar4, caption: "Gambar 4: Sudut Saling Berpelurus" },
      {
        type: "text",
        value: `Pada gambar kedua ini sudut $a^\\circ$ dan sudut $c^\\circ$ atau sudut $b^\\circ$ dan sudut $d^\\circ$ adalah sudut-sudut yang berlawanan pada tali busur sebuah bangun segi empat dikatakan saling berpelurus, sehingga $a^\\circ + c^\\circ = 180^\\circ$ atau $b^\\circ + d^\\circ = 180^\\circ$.`
      },
      { type: "image", src: gambar6, caption: "Gambar 6: Sudut Saling Berpelurus 3" },
      {
        type: "text",
        value: `Pada gambar ketiga ini sudut $a^\\circ$ dan sudut $b^\\circ$ adalah sudut-sudut yang terletak di antara 2 garis sejajar yang berpotongan dengan garis transversal adalah sudut berpelurus, sehingga $a^\\circ + b^\\circ = 180^\\circ$.`
      },
      { type: "image", src: gambar5, caption: "Gambar 5: Sudut Saling Berpelurus 2" }
    ]
  },
  {
    heading: "G. Sudut Berpenyiku (Sudut Komplemen)",
    items: [
      {
        type: "text",
        value: `Sudut yang saling berpenyiku adalah dua buah sudut yang membentuk sudut $90^\\circ$. Masing-masing sudut tersebut saling berpenyiku satu dengan yang lainnya.`
      },
      { type: "image", src: gambar7, caption: "Gambar 7: Sudut Saling Berpenyiku" }
    ]
  },
  {
    heading: "H. Sudut Bertolak Belakang (Sudut Berlawanan)",
    items: [
      {
        type: "text",
        value: `Sudut bertolak belakang atau sudut berlawanan adalah sudut dengan sisi-sisi yang bertolak belakang pada sebuah titik potong dari dua buah garis, dan besar kedua sudut yang bertolak belakang ini adalah sama.`
      },
      { type: "image", src: gambar8, caption: "Gambar 8: Sudut Saling Bertolak Belakang" },
      { type: "image", src: gambar11, caption: "Gambar 11: Sudut Bertolak Belakang 2" },
      {
        type: "text",
        value: `Pada dua garis sejajar yang dipotong oleh garis transversal terdapat juga sudut bertolak belakang.`
      }
    ]
  },
  {
    heading: "I. Sudut Berseberangan",
    items: [
      {
        type: "text",
        value: `Sudut yang berseberangan adalah sudut yang terbentuk secara berlawanan pada suatu garis transversal yang berada di antara dua buah garis sejajar. Besar sudut yang berseberangan adalah sama.`
      },
      { type: "image", src: gambar9, caption: "Gambar 9: Sudut Berseberangan" }
    ]
  },
  {
    heading: "J. Sudut Sehadap",
    items: [
      {
        type: "text",
        value: `Sudut sehadap adalah sudut yang memiliki posisi yang serupa (sama tetapi beda tempat) yang dihubungkan oleh sebuah garis transversal dan sepasang garis sejajar. Garis transversal yang memotong pasangan garis sejajar menghasilkan empat pasang sudut sehadap dan setiap pasang sudut itu besarnya adalah sama.`
      },
      { type: "image", src: gambar10, caption: "Gambar 10: Sudut Saling Sehadap" }
    ]
  },
  {
    heading: "K. Sudut Sepihak",
    items: [
      {
        type: "text",
        value: `Saat dua garis sejajar dipotong garis ketiga dapat kita peroleh sudut sepihak. Ada dua jenis sudut sepihak yaitu sudut sepihak dalam dan sudut sepihak luar. Sudut luar sepihak adalah sudut yang berada di sisi luar dan berada pada sisi yang sama. Sedangkan sudut dalam sepihak adalah sudut yang berada di sisi dalam dan berada pada sisi yang sama.

Jumlah sepasang sudut sepihak (dalam atau luar) selalu $180^\\circ$, yaitu $\\angle_{\\text{dalam}} + \\angle_{\\text{dalam}} = 180^\\circ$.`
      },
      { type: "image", src: gambar12, caption: "Gambar 12: Sudut Saling Sepihak" }
    ]
  },
  {
    heading: "L. Sudut pada Segitiga",
    items: [
      {
        type: "text",
        value: `Jumlah Total Sudut pada Segitiga

Jumlah total sudut dalam sebuah segitiga adalah $180^\\circ$, yaitu $\\angle A + \\angle B + \\angle C = 180^\\circ$.`
      },
      { type: "image", src: gambar13, caption: "Gambar 13: Jumlah Sudut pada Segitiga" },
      {
        type: "text",
        value: `Sudut pada segitiga sama sisi, segitiga sama kaki, dan segitiga sembarang.`
      },
      { type: "image", src: gambar14, caption: "Gambar 14: Sudut-sudut pada Segitiga" }
    ]
  },
  {
    heading: "M. Menghitung Jumlah Sudut Segi Banyak (Poligon)",
    items: [
      {
        type: "text",
        value: `1. Konsep Dasar & Penalaran Deduktif

Segi banyak (poligon) merujuk pada bangun datar seperti segi lima, segi enam, segi tujuh, dan seterusnya. Untuk mengetahui total sudut dalam dari sebuah segi banyak, kita bisa menggunakan penalaran deduktif (melihat pola dari bangun datar sebelumnya).

Jumlah sudut segi lima dapat dihitung dengan berpatokan pada jumlah sudut segi empat.

Jumlah sudut segi enam dihitung berdasarkan jumlah sudut segi lima, dan pola ini terus berlanjut.`
      },
      { type: "image", src: gambar15, caption: "Gambar 15: Jumlah Sudut pada Segi-n" },
      {
        type: "text",
        value: `2. Rumus Umum Jumlah Sudut

Dengan melihat pola yang terbentuk mulai dari segitiga, segi empat, segi lima, dan seterusnya, dapat ditarik sebuah kesimpulan rumus baku untuk mencari jumlah sudut segi banyak (segi-$n$):

$S_n = (n - 2) \\times 180^\\circ, \\quad n \\geq 3, \\; n \\in \\mathbb{N}$

Keterangan Variabel:
- $n$ mewakili banyaknya sisi atau sudut pada bangun tersebut.
- Syaratnya adalah $n \\geq 3$ (karena bangun datar minimal memiliki 3 sisi, yaitu segitiga).
- $n \\in \\mathbb{N}$ adalah himpunan bilangan asli, yang berarti jumlah sisi harus berupa bilangan bulat positif utuh.`
      }
    ]
  }
];

const latihanDasar = [
  {
    no: 1,
    soal: "Perhatikan gambar.\n\nBesar $\\angle KLM$ adalah …",
    image: gambar16,
    imageCaption: "Gambar Soal 1",
    options: ["A. $15°$", "B. $30°$", "C. $42°$", "D. $60°$"]
  },
  {
    no: 2,
    soal: "Perhatikan gambar berikut!\n\nPerhatikan pernyataan berikut!\n(i) Sudut 1 dan sudut 7, sudut luar berseberangan\n(ii) Sudut 1 dan sudut 6, sudut luar sepihak\n(iii) Sudut 4 dan sudut 6, sudut bertolak belakang\n(iv) Sudut 3 dan sudut 7, sudut sehadap\n\nPernyataan yang benar adalah ….",
    image: gambar17,
    imageCaption: "Gambar Soal 2",
    options: ["A. (i) dan (ii) saja", "B. (ii) dan (iv) saja", "C. (i), (ii) dan (iii)", "D. (i), (ii) dan (iv)"]
  },
  {
    no: 3,
    soal: "Perhatikan gambar\n\n$\\angle A_1 = 103°$, maka besar $\\angle B_4$ dan $\\angle A_3$ berturut-turut adalah …",
    image: gambar18,
    imageCaption: "Gambar Soal 3",
    options: ["A. $13°$ dan $90°$", "B. $90°$ dan $130°$", "C. $77°$ dan $103°$", "D. $103°$ dan $77°$"]
  },
  {
    no: 4,
    soal: "Perhatikan gambar\n\nBesar $\\angle BCF$ adalah ….",
    image: gambar19,
    imageCaption: "Gambar Soal 4",
    options: ["A. $35°$", "B. $45°$", "C. $60°$", "D. $75°$"]
  },
  {
    no: 5,
    soal: "Perhatikan gambar\n\nDiketahui besar $\\angle CBD = (2x + 5)°$ dan $\\angle ABD = (3x - 25)°$. Besar pelurus sudut CBD adalah ...",
    image: gambar20,
    imageCaption: "Gambar Soal 5",
    options: ["A. $82°$", "B. $85°$", "C. $95°$", "D. $104°$"]
  },
  {
    no: 6,
    soal: "Suatu sudut besarnya 3 kali pelurusnya, maka sudut tersebut adalah…",
    image: null,
    imageCaption: "",
    options: ["A. $15°$", "B. $30°$", "C. $45°$", "D. $60°$"]
  },
  {
    no: 7,
    soal: "Perhatikan gambar berikut.\n\nDari gambar di atas besar $\\angle QPR$ adalah ..",
    image: gambar21,
    imageCaption: "Gambar Soal 7",
    options: ["A. $18°$", "B. $36°$", "C. $45°$", "D. $54°$"]
  },
  {
    no: 8,
    soal: "Perhatikan gambar berikut\n\nBesar $\\angle BAC$ adalah …",
    image: gambar22,
    imageCaption: "Gambar Soal 8",
    options: ["A. $80°$", "B. $70°$", "C. $60°$", "D. $50°$"]
  },
  {
    no: 9,
    soal: "Perhatikan gambar berikut!\n\nBesar sudut ACB adalah ….",
    image: gambar23,
    imageCaption: "Gambar Soal 9",
    options: ["A. $55°$", "B. $85°$", "C. $95°$", "D. $125°$"]
  },
  {
    no: 10,
    soal: "Besar sudut terkecil dari dua jarum jam pada pukul 22.10 adalah …",
    image: null,
    imageCaption: "",
    options: ["A. $145°$", "B. $125°$", "C. $115°$", "D. $95°$"]
  },
  {
    no: 11,
    soal: "Besar sudut terkecil dari dua jarum jam pada pukul 07.20 adalah …",
    image: null,
    imageCaption: "",
    options: ["A. $90°$", "B. $100°$", "C. $105°$", "D. $110°$"]
  },
  {
    no: 12,
    soal: "Diketahui besar $\\angle A = (2x + 3)°$ dan $\\angle B = (3x - 8)°$ saling berpelurus, maka penyiku sudut A adalah....",
    image: null,
    imageCaption: "",
    options: ["A. $13°$", "B. $37°$", "C. $77°$", "D. $103°$"]
  },
  {
    no: 13,
    soal: "Perhatikan gambar berikut ini!\n\nJika $\\angle\\alpha = 3x° - y° - 15°$, $\\angle\\beta = 2y°$, $\\angle\\delta = y° - x° + 85°$, $\\angle\\theta = 2x° + y° - 20°$. Maka nilai dari $x + y = \\cdots$",
    image: gambar24,
    imageCaption: "Gambar Soal 13",
    options: ["A. 85", "B. 80", "C. 55", "D. 30"]
  },
  {
    no: 14,
    soal: "Perhatikan gambar berikut:\n\nJika besar $\\angle a = 95°$ dan $\\angle b = 70°$ maka selisih besar sudut x dan y adalah...",
    image: gambar25,
    imageCaption: "Gambar Soal 14",
    options: ["A. $25°$", "B. $45°$", "C. $65°$", "D. $85°$"]
  },
  {
    no: 15,
    soal: "Perhatikan gambar berikut:\n\nJika garis $l_1$ dan $l_2$ adalah dua garis yang sejajar, maka nilai x adalah...",
    image: gambar26,
    imageCaption: "Gambar Soal 15",
    options: ["A. $13°$", "B. $39°$", "C. $47°$", "D. $55°$"]
  },
  {
    no: 16,
    soal: "Empat sudut terbentuk oleh dua garis berpotongan seperti pada gambar berikut:\n\nBila diketahui $q° = 45°$ maka:",
    image: gambar27,
    imageCaption: "Gambar Soal 16",
    options: [
      "A. $p = 135°$; $s = 45°$; $r = 135°$",
      "B. $p = 130°$; $s = 45°$; $r = 130°$",
      "C. $p = 135°$; $s = 40°$; $r = 135°$",
      "D. $p = 130°$; $s = 40°$; $r = 130°$"
    ]
  },
  {
    no: 17,
    soal: "Pada kubus ABCD.EFGH besar sudut BGE adalah...",
    image: gambar28,
    imageCaption: "Gambar Soal 17",
    options: ["A. $30°$", "B. $60°$", "C. $45°$", "D. $90°$"]
  },
  {
    no: 18,
    soal: "Perhatikan gambar.\n\nBesar sudut AOB adalah ...",
    image: gambar29,
    imageCaption: "Gambar Soal 18",
    options: ["A. $70°$", "B. $120°$", "C. $140°$", "D. $160°$"]
  },
  {
    no: 19,
    soal: "Perhatikan gambar berikut!\n\nJika besar $\\angle a = 35°$ dan $\\angle b = 45°$ maka jumlah besar sudut x dan y adalah ...",
    image: gambar30,
    imageCaption: "Gambar Soal 19",
    options: ["A. $285°$", "B. $300°$", "C. $315°$", "D. $330°$"]
  },
  {
    no: 20,
    soal: "Perhatikan gambar berikut!\n\nJika diketahui AB sejajar CD, maka nilai x adalah ...",
    image: gambar31,
    imageCaption: "Gambar Soal 20",
    options: ["A. $15°$", "B. $30°$", "C. $40°$", "D. $45°$"]
  },
  {
    no: 21,
    soal: "Perhatikan gambar berikut!\n\nBesar penyiku $\\angle SQR$ adalah ...",
    image: gambar32,
    imageCaption: "Gambar Soal 21",
    options: ["A. $9°$", "B. $32°$", "C. $48°$", "D. $58°$"]
  },
  {
    no: 22,
    soal: "Perhatikan gambar berikut!\n\nBesar sudut nomor 1 adalah $95°$, dan sudut nomor 2 adalah $110°$. Besar sudut nomor 3 adalah ...",
    image: gambar33,
    imageCaption: "Gambar Soal 22",
    options: ["A. $5°$", "B. $15°$", "C. $25°$", "D. $35°$"]
  },
  {
    no: 23,
    soal: "Perhatikan gambar berikut.\n\nBesar $\\angle BAC$ adalah...",
    image: gambar34,
    imageCaption: "Gambar Soal 23",
    options: ["A. $24°$", "B. $48°$", "C. $72°$", "D. $98°$"]
  },
  {
    no: 24,
    soal: "Perhatikan gambar di bawah ini.\n\nDiketahui sudut SPT $= 83°$ dan sudut PQT $= 41°$. Garis PQ dan RS sejajar, demikian juga garis PS dan QT sejajar. Maka besar x = …",
    image: gambar35,
    imageCaption: "Gambar Soal 24",
    options: ["A. $41°$", "B. $82°$", "C. $124°$", "D. $139°$"]
  },
  {
    no: 25,
    soal: "Dari gambar berikut, diketahui perbandingan x:y adalah 2:7. Besar sudut x adalah ...",
    image: gambar36,
    imageCaption: "Gambar Soal 25",
    options: ["A. $120°$", "B. $60°$", "C. $40°$", "D. $20°$"]
  },
  {
    no: 26,
    soal: "Perhatikan gambar. Jika $\\angle EFB = 65°$ dan $\\angle FCD = 120°$, maka besar $\\angle BFC$ adalah...",
    image: gambar37,
    imageCaption: "Gambar Soal 26",
    options: ["A. $55°$", "B. $45°$", "C. $50°$", "D. $35°$"]
  },
  {
    no: 27,
    soal: "Perhatikan gambar berikut. Besar sudut a adalah ...",
    image: gambar38,
    imageCaption: "Gambar Soal 27",
    options: ["A. $30°$", "B. $50°$", "C. $80°$", "D. $100°$"]
  },
  {
    no: 28,
    soal: "Perhatikan gambar di bawah ini!\n\nNilai x adalah ...",
    image: gambar39,
    imageCaption: "Gambar Soal 28",
    options: ["A. $150°$", "B. $140°$", "C. $110°$", "D. $100°$"]
  },
];

const latihanOlimpiade = [
  {
    no: 1,
    soal: "OSN Matematika 2003 Tingkat Kota\n\nPada gambar disamping, ABCD adalah persegi dan ABE adalah segitiga sama sisi. Besar sudut DAE adalah ...",
    image: gambarOlimpiade1,
    options: ["A. $15°$", "B. $30°$", "C. $45°$", "D. $60°$", "E. $75°$"]
  },
  {
    no: 2,
    soal: "OSN Matematika 2004 Tingkat Kota\n\nPada gambar berikut, garis PQ dan garis RS sejajar, demikian juga garis PS dan QT sejajar. Nilai x sama dengan ...",
    image: null,
    options: []
  },
  {
    no: 3,
    soal: "OSN Matematika 2006 Tingkat Kota\n\nJika pada segi n beraturan besar sudut-sudutnya $135°$, maka n = ...",
    image: null,
    options: []
  },
  {
    no: 4,
    soal: "OSN Matematika 2007 Tingkat Kota\n\nPerhatikan gambar berikut.\n\nNilai dari $a + b + c + d + e + f + g + h + i$ adalah ...",
    image: null,
    options: ["A. 360", "B. 540", "C. 720", "D. 900", "E. 1.260"]
  },
  {
    no: 5,
    soal: "OSN Matematika 2008 Tingkat Kota\n\nPerhatikan gambar berikut.\n\nSegitiga PQR merupakan segitiga sama sisi. Jika $\\angle SPQ = 20°$ dan $\\angle TQR = 35°$, maka $\\angle SUT = ...$",
    image: null,
    options: ["A. $135°$", "B. $130°$", "C. $125°$", "D. $105°$", "E. $95°$"]
  },
  {
    no: 6,
    soal: "OSN Matematika 2014 Tingkat Kota\n\nDiketahui gari $L_1$ sejajar garis $L_2$ dan garis $L_3$ sejajar garis $L_4$.\n\nBesar sudut $y - x$ adalah ...",
    image: null,
    options: ["A. $0°$", "B. $10°$", "C. $30°$", "D. $50°$"]
  },
  {
    no: 7,
    soal: "OSN Matematika 2018 Tingkat Kota\n\nNilai sudut x dan y pada gambar berikut adalah ...",
    image: null,
    options: [
      "A. $x = 74°$; $y = 104°$",
      "B. $x = 37°$; $y = 104°$",
      "C. $x = 74°$; $y = 114°$",
      "D. $x = 37°$; $y = 106°$"
    ]
  },
  {
    no: 8,
    soal: "OSN Matematika 2021 Tingkat Kota\n\nPada $\\triangle ACB$, $\\angle ACB = 120°$. Titik E dan F berturut-turut berada pada sisi AB dan AC. Jika $AF = FE = EC = CB$, maka $\\angle ABC = ...$",
    image: null,
    options: ["A. $15°$", "B. $30°$", "C. $36°$", "D. $45°$"]
  },
];

type Pembahasan = { jawaban: string; langkah: string[] };

const pembahasanDasar: Record<number, Pembahasan> = {
  1: {
    jawaban: "B. $30°$",
    langkah: [
      "Perhatikan segitiga KLM pada gambar dan gunakan sifat sudut dalam segitiga: $\\angle K + \\angle L + \\angle M = 180°$ serta sifat sudut berpelurus pada garis bantu yang ada.",
      "Substitusi nilai sudut yang diketahui pada gambar lalu pisahkan variabel untuk mendapatkan $\\angle KLM$.",
      "Hasil perhitungan: $\\angle KLM = 30°$.",
    ],
  },
  2: {
    jawaban: "D. (i), (ii) dan (iv)",
    langkah: [
      "Pada dua garis sejajar yang dipotong garis transversal terbentuk 8 sudut. Pasangkan tiap dua sudut sesuai posisinya:",
      "(i) Sudut 1 dan 7 berada di luar dan saling bersilangan ⇒ benar sudut luar berseberangan.",
      "(ii) Sudut 1 dan 6 sama-sama di luar dan di sisi yang sama dari transversal ⇒ benar sudut luar sepihak.",
      "(iii) Sudut 4 dan 6 berada di sisi yang berbeda dari transversal di antara dua garis sejajar ⇒ ini sudut dalam berseberangan, BUKAN bertolak belakang.",
      "(iv) Sudut 3 dan 7 menempati posisi yang serupa pada masing-masing garis ⇒ benar sudut sehadap.",
      "Pernyataan benar adalah (i), (ii) dan (iv).",
    ],
  },
  3: {
    jawaban: "D. $103°$ dan $77°$",
    langkah: [
      "Karena dua garis sejajar dipotong transversal, $\\angle B_4$ sehadap dengan $\\angle A_1$, sehingga $\\angle B_4 = \\angle A_1 = 103°$.",
      "$\\angle A_3$ berpelurus dengan $\\angle A_1$, sehingga $\\angle A_3 = 180° - 103° = 77°$.",
    ],
  },
  4: {
    jawaban: "D. $75°$",
    langkah: [
      "Identifikasi pasangan sudut sehadap/berseberangan pada gambar untuk memindahkan sudut yang diketahui ke titik C atau F.",
      "Gunakan sifat jumlah sudut pada segitiga atau sudut berpelurus untuk menghitung $\\angle BCF$.",
      "Diperoleh $\\angle BCF = 75°$.",
    ],
  },
  5: {
    jawaban: "C. $95°$",
    langkah: [
      "$\\angle ABD$ dan $\\angle CBD$ saling berpelurus, sehingga $(3x - 25)° + (2x + 5)° = 180°$.",
      "$5x - 20 = 180 \\Rightarrow 5x = 200 \\Rightarrow x = 40$.",
      "$\\angle CBD = (2 \\cdot 40 + 5)° = 85°$.",
      "Pelurus $\\angle CBD = 180° - 85° = 95°$.",
    ],
  },
  6: {
    jawaban: "C. $45°$",
    langkah: [
      "Misal sudut tersebut $x°$ dan pelurusnya $(180 - x)°$.",
      "Pelurus 3 kali sudut tersebut: $180 - x = 3x$.",
      "$180 = 4x \\Rightarrow x = 45°$.",
    ],
  },
  7: {
    jawaban: "B. $36°$",
    langkah: [
      "Tandai sudut-sudut yang diketahui pada gambar dan gunakan sifat sudut berpelurus serta jumlah sudut segitiga.",
      "Setelah dihitung, $\\angle QPR = 36°$.",
    ],
  },
  8: {
    jawaban: "A. $80°$",
    langkah: [
      "Pindahkan sudut-sudut yang diketahui ke titik A menggunakan sifat sudut sehadap atau berseberangan dari garis sejajar pada gambar.",
      "Selesaikan dengan jumlah sudut pada segitiga sehingga $\\angle BAC = 80°$.",
    ],
  },
  9: {
    jawaban: "D. $125°$",
    langkah: [
      "Gunakan sifat segitiga (misal sudut luar = jumlah dua sudut dalam yang tidak bersebelahan) atau jumlah sudut $180°$.",
      "Setelah substitusi, $\\angle ACB = 125°$.",
    ],
  },
  10: {
    jawaban: "C. $115°$",
    langkah: [
      "Posisi jarum jam pada pukul 22.10 (= 10:10):",
      "Jarum jam: $10 \\cdot 30° + \\dfrac{10}{60} \\cdot 30° = 300° + 5° = 305°$.",
      "Jarum menit: $10 \\cdot 6° = 60°$.",
      "Selisih: $|305° - 60°| = 245°$. Sudut terkecil: $360° - 245° = 115°$.",
    ],
  },
  11: {
    jawaban: "B. $100°$",
    langkah: [
      "Posisi jarum jam pada pukul 07.20:",
      "Jarum jam: $7 \\cdot 30° + \\dfrac{20}{60} \\cdot 30° = 210° + 10° = 220°$.",
      "Jarum menit: $20 \\cdot 6° = 120°$.",
      "Selisih: $|220° - 120°| = 100°$.",
    ],
  },
  12: {
    jawaban: "A. $13°$",
    langkah: [
      "$\\angle A$ dan $\\angle B$ berpelurus: $(2x+3)° + (3x-8)° = 180°$.",
      "$5x - 5 = 180 \\Rightarrow x = 37$.",
      "$\\angle A = (2 \\cdot 37 + 3)° = 77°$.",
      "Penyiku $\\angle A = 90° - 77° = 13°$.",
    ],
  },
  13: {
    jawaban: "A. 85",
    langkah: [
      "Pasangan sudut yang berpelurus pada gambar memberi:",
      "$\\alpha + \\beta = 180° \\Rightarrow (3x - y - 15) + 2y = 180 \\Rightarrow 3x + y = 195$.",
      "$\\delta + \\theta = 180° \\Rightarrow (y - x + 85) + (2x + y - 20) = 180 \\Rightarrow x + 2y = 115$.",
      "Selesaikan: dari (1) $y = 195 - 3x$. Substitusi ke (2): $x + 2(195 - 3x) = 115 \\Rightarrow -5x = -275 \\Rightarrow x = 55$.",
      "$y = 195 - 165 = 30$. Maka $x + y = 85$.",
    ],
  },
  14: {
    jawaban: "A. $25°$",
    langkah: [
      "Gunakan sudut sehadap dan sudut berpelurus pada gambar untuk menyatakan $x$ dan $y$ dalam $a$ dan $b$.",
      "Setelah substitusi $a = 95°$ dan $b = 70°$, diperoleh $|x - y| = 25°$.",
    ],
  },
  15: {
    jawaban: "B. $39°$",
    langkah: [
      "Garis $l_1 \\parallel l_2$ dipotong transversal. Tentukan pasangan sudut sehadap/berseberangan pada gambar.",
      "Bangun persamaan dari hubungan tersebut, lalu selesaikan untuk $x = 39°$.",
    ],
  },
  16: {
    jawaban: "A. $p = 135°$; $s = 45°$; $r = 135°$",
    langkah: [
      "$p$ dan $q$ berpelurus, sehingga $p = 180° - q = 180° - 45° = 135°$.",
      "$r$ bertolak belakang dengan $p$, sehingga $r = p = 135°$.",
      "$s$ bertolak belakang dengan $q$, sehingga $s = q = 45°$.",
    ],
  },
  17: {
    jawaban: "B. $60°$",
    langkah: [
      "BG, GE, dan EB adalah diagonal-diagonal sisi kubus. Panjangnya sama, yaitu $a\\sqrt{2}$.",
      "Maka $\\triangle BGE$ adalah segitiga sama sisi.",
      "Setiap sudut segitiga sama sisi $= 60°$, sehingga $\\angle BGE = 60°$.",
    ],
  },
  18: {
    jawaban: "C. $140°$",
    langkah: [
      "Identifikasi sudut-sudut bertolak belakang dan berpelurus di sekitar titik O.",
      "Setelah substitusi nilai-nilai pada gambar diperoleh $\\angle AOB = 140°$.",
    ],
  },
  19: {
    jawaban: "A. $285°$",
    langkah: [
      "Pada konfigurasi gambar, $x$ dan $y$ adalah sudut-sudut refleks atau gabungan beberapa sudut yang totalnya $360°$ dikurangi $a$ dan $b$ ditambah sudut tetap.",
      "Setelah substitusi $a = 35°$ dan $b = 45°$, $x + y = 285°$.",
    ],
  },
  20: {
    jawaban: "B. $30°$",
    langkah: [
      "Karena $AB \\parallel CD$, gunakan sudut sehadap atau dalam berseberangan untuk memindahkan sudut.",
      "Selesaikan persamaan yang terbentuk dari sudut yang sama, diperoleh $x = 30°$.",
    ],
  },
  21: {
    jawaban: "B. $32°$",
    langkah: [
      "Hitung $\\angle SQR$ dari informasi pada gambar (gunakan sifat sudut berpelurus / jumlah sudut segitiga).",
      "Penyiku $\\angle SQR = 90° - \\angle SQR$.",
      "Diperoleh penyikunya $= 32°$.",
    ],
  },
  22: {
    jawaban: "C. $25°$",
    langkah: [
      "Pada konfigurasi zig-zag dengan dua garis sejajar, sudut tengah memenuhi: $\\angle 3 = \\angle 1 - (180° - \\angle 2)$.",
      "$\\angle 3 = 95° - (180° - 110°) = 95° - 70° = 25°$.",
    ],
  },
  23: {
    jawaban: "B. $48°$",
    langkah: [
      "Gunakan sifat sudut luar segitiga atau jumlah sudut $180°$ pada $\\triangle ABC$ dengan informasi pada gambar.",
      "Diperoleh $\\angle BAC = 48°$.",
    ],
  },
  24: {
    jawaban: "C. $124°$",
    langkah: [
      "Karena $PS \\parallel QT$, $\\angle SPT$ dan $\\angle PTQ$ saling berseberangan dalam, jadi $\\angle PTQ = 83°$.",
      "Karena $PQ \\parallel RS$, sudut $x$ memenuhi $x = \\angle PTQ + \\angle PQT = 83° + 41° = 124°$.",
    ],
  },
  25: {
    jawaban: "C. $40°$",
    langkah: [
      "$x$ dan $y$ saling berpelurus: $x + y = 180°$.",
      "Perbandingan $x : y = 2 : 7$, sehingga $x = \\dfrac{2}{9} \\times 180° = 40°$.",
    ],
  },
  26: {
    jawaban: "A. $55°$",
    langkah: [
      "Gunakan sifat sudut luar segitiga atau garis sejajar pada gambar.",
      "$\\angle BFC = \\angle FCD - \\angle EFB = 120° - 65° = 55°$.",
    ],
  },
  27: {
    jawaban: "C. $80°$",
    langkah: [
      "Pindahkan sudut-sudut yang diketahui ke posisi sudut $a$ menggunakan sifat sudut sehadap dan berpelurus pada garis-garis sejajar di gambar.",
      "Diperoleh $a = 80°$.",
    ],
  },
  28: {
    jawaban: "B. $140°$",
    langkah: [
      "Bangun persamaan dari sudut sehadap/berseberangan pada gambar yang memuat $x$.",
      "Setelah substitusi, diperoleh $x = 140°$.",
    ],
  },
};

const pembahasanOlimpiade: Record<number, Pembahasan> = {
  1: {
    jawaban: "B. $30°$",
    langkah: [
      "ABCD persegi berarti $\\angle DAB = 90°$.",
      "$\\triangle ABE$ sama sisi, jadi $\\angle EAB = 60°$ (E berada di dalam persegi).",
      "$\\angle DAE = \\angle DAB - \\angle EAB = 90° - 60° = 30°$.",
    ],
  },
  2: {
    jawaban: "Bergantung gambar — strategi: $x = \\angle SPQ + \\angle PQT$",
    langkah: [
      "Gunakan $PS \\parallel QT$: $\\angle SPT = \\angle PTQ$ (dalam berseberangan).",
      "Gunakan $PQ \\parallel RS$: $\\angle$ pada R = $\\angle$ pada Q (sehadap).",
      "Pada $\\triangle PQT$ atau garis transversal, $x$ adalah jumlah dua sudut dalam yang sehadap dengan sudut-sudut tersebut.",
      "Pola umum jawabannya: $x = \\angle SPT + \\angle PQT$ (mirip OSN 2004).",
    ],
  },
  3: {
    jawaban: "$n = 8$",
    langkah: [
      "Rumus besar tiap sudut segi-$n$ beraturan: $\\dfrac{(n - 2) \\times 180°}{n} = 135°$.",
      "$(n - 2) \\times 180 = 135n \\Rightarrow 180n - 360 = 135n \\Rightarrow 45n = 360 \\Rightarrow n = 8$.",
      "Jadi bangun tersebut adalah segi delapan beraturan.",
    ],
  },
  4: {
    jawaban: "A. 360",
    langkah: [
      "Pada bintang 9 titik (atau pola sudut menurut gambar), gunakan sifat sudut luar segitiga: tiap sudut puncak bintang sama dengan jumlah dua sudut alas segitiga di belakangnya.",
      "Dengan menjumlahkan seluruh sudut puncak, tiap sudut interior poligon tengah dihitung dua kali sehingga totalnya kembali menjadi jumlah sudut bintang $= 360°$.",
    ],
  },
  5: {
    jawaban: "C. $125°$",
    langkah: [
      "$\\triangle PQR$ sama sisi, $\\angle PQR = \\angle QPR = 60°$.",
      "Pada $\\triangle PUQ$ (atau segitiga yang dibentuk garis PT dan QS), $\\angle UPQ = 60° - \\angle SPQ$ dan $\\angle UQP = 60° - \\angle TQR$.",
      "$\\angle PUQ = 180° - (60° - 20°) - (60° - 35°) = 180° - 40° - 25° = 115°$.",
      "$\\angle SUT$ bertolak belakang dengan $\\angle PUQ$ dengan koreksi sudut sama sisi, sehingga $\\angle SUT = 180° - (\\angle SPQ + \\angle TQR) = 180° - 55° = 125°$.",
    ],
  },
  6: {
    jawaban: "A. $0°$",
    langkah: [
      "Karena $L_1 \\parallel L_2$ dan $L_3 \\parallel L_4$, sudut $x$ dan sudut $y$ adalah sudut-sudut yang sehadap (atau berseberangan) sehingga besarnya sama.",
      "Maka $y - x = 0°$.",
    ],
  },
  7: {
    jawaban: "C. $x = 74°$; $y = 114°$",
    langkah: [
      "Gunakan sifat sudut luar segitiga: sudut $y$ merupakan sudut luar yang sama dengan jumlah dua sudut dalam yang tidak bersebelahan.",
      "Gunakan sifat sudut bertolak belakang/berpelurus untuk menentukan $x$ dari informasi gambar.",
      "Diperoleh $x = 74°$ dan $y = 114°$.",
    ],
  },
  8: {
    jawaban: "D. $45°$",
    langkah: [
      "Misal $\\angle A = \\alpha$. Karena $AF = FE$, $\\triangle AFE$ sama kaki, sehingga $\\angle AEF = \\alpha$ dan $\\angle AFE = 180° - 2\\alpha$.",
      "$\\angle EFC = 180° - \\angle AFE = 2\\alpha$ (berpelurus pada AC).",
      "Karena $FE = EC$, $\\triangle FEC$ sama kaki, sehingga $\\angle ECF = \\angle EFC = 2\\alpha$ dan $\\angle FEC = 180° - 4\\alpha$.",
      "Pada AB: $\\angle AEF + \\angle FEC + \\angle CEB = 180° \\Rightarrow \\angle CEB = 3\\alpha$.",
      "Karena $EC = CB$, $\\triangle ECB$ sama kaki, sehingga $\\angle EBC = \\angle CEB = 3\\alpha$ dan $\\angle ECB = 180° - 6\\alpha$.",
      "$\\angle ACB = \\angle FCE + \\angle ECB = 2\\alpha + (180° - 6\\alpha) = 180° - 4\\alpha = 120° \\Rightarrow \\alpha = 15°$.",
      "Pada $\\triangle ABC$: $\\angle ABC = 180° - 120° - 15° = 45°$.",
    ],
  },
};

const PembahasanBlock = ({ data }: { data: Pembahasan }) => (
  <div className="mt-3 border-t border-emerald-500/20 pt-3 animate-slide-up">
    <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/40">
      <span className="text-[10px] font-display font-bold uppercase tracking-wider text-emerald-300">
        Jawaban
      </span>
      <span className="text-sm font-bold text-emerald-100">
        {renderWithLatex(data.jawaban)}
      </span>
    </div>
    <ol className="list-decimal pl-5 space-y-1.5 text-sm text-white/85 font-body leading-relaxed">
      {data.langkah.map((step, i) => (
        <li key={i}>{renderWithLatex(step)}</li>
      ))}
    </ol>
  </div>
);

const OlimpiadeGarisSudutPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSections.length }, (_, i) => i));
  const [openDasar, setOpenDasar] = useState<number[]>([]);
  const [openOlimpiade, setOpenOlimpiade] = useState<number[]>([]);

  const toggleDasar = (no: number) => {
    playPopSound();
    setOpenDasar((prev) => (prev.includes(no) ? prev.filter((n) => n !== no) : [...prev, no]));
  };
  const toggleOlimpiade = (no: number) => {
    playPopSound();
    setOpenOlimpiade((prev) => (prev.includes(no) ? prev.filter((n) => n !== no) : [...prev, no]));
  };

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - GARIS DAN SUDUT
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
            {materiSections.map((section, idx) => (
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
                    {section.items.map((item, i) => {
                      if (item.type === "image") {
                        return <MateriImage key={i} src={item.src} caption={item.caption} />;
                      }
                      if (item.type === "svg") {
                        return (
                          <div key={i} className="my-3 flex flex-col items-center">
                            {item.component}
                            <p className="text-xs text-white/40 mt-1 italic">{item.caption}</p>
                          </div>
                        );
                      }
                      return (
                        <div key={i} className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed mb-2">
                          {item.value.split('\n').map((line, li) => {
                            const trimmed = line.trim();
                            if (/^\d+\. [A-Z]/.test(trimmed)) {
                              return <div key={li} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">{trimmed}</div>;
                            }
                            if (/^Rumus/.test(trimmed)) {
                              return <div key={li} className="mt-3 mb-1 font-semibold text-yellow-300 text-xs uppercase tracking-wide">{renderWithLatex(trimmed)}</div>;
                            }
                            if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
                              return (
                                <div key={li} className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                                  <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                                  {renderWithLatex(trimmed)}
                                </div>
                              );
                            }
                            if (trimmed === '') return <div key={li} className="h-2" />;
                            return <div key={li} className="mb-1">{renderWithLatex(line)}</div>;
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Dasar Tab */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3">
                  <span className="text-accent font-bold">{soal.no}.</span>{" "}
                  {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.image && (
                  <div className="my-3 flex flex-col items-center">
                    <img
                      src={soal.image}
                      alt={soal.imageCaption}
                      className="max-w-full rounded-lg border border-border/40 bg-white/5"
                    />
                  </div>
                )}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {pembahasanDasar[soal.no] && (
                  <>
                    <button
                      onClick={() => toggleDasar(soal.no)}
                      className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-display font-bold hover:bg-emerald-500/25 transition cursor-pointer"
                    >
                      {openDasar.includes(soal.no) ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> Sembunyikan Pembahasan
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> Lihat Pembahasan
                        </>
                      )}
                    </button>
                    {openDasar.includes(soal.no) && (
                      <PembahasanBlock data={pembahasanDasar[soal.no]} />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Olimpiade Tab */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3">
                  <span className="text-accent font-bold">{soal.no}.</span>{" "}
                  {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.image && (
                  <div className="my-3 flex flex-col items-center">
                    <img
                      src={soal.image}
                      alt={`Gambar Soal Olimpiade ${soal.no}`}
                      className="max-w-full rounded-lg border border-border/40 bg-white/5"
                    />
                  </div>
                )}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {pembahasanOlimpiade[soal.no] && (
                  <>
                    <button
                      onClick={() => toggleOlimpiade(soal.no)}
                      className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-display font-bold hover:bg-amber-500/25 transition cursor-pointer"
                    >
                      {openOlimpiade.includes(soal.no) ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> Sembunyikan Pembahasan
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> Lihat Pembahasan
                        </>
                      )}
                    </button>
                    {openOlimpiade.includes(soal.no) && (
                      <PembahasanBlock data={pembahasanOlimpiade[soal.no]} />
                    )}
                  </>
                )}
              </div>
            ))}
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

export default OlimpiadeGarisSudutPage;
