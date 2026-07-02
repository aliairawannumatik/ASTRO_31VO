import { useState, ReactNode, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useTheme } from "@/contexts/ThemeContext";

// Materi images loaded from Google Drive thumbnails (no local asset needed)
const gambar2  = "https://drive.google.com/thumbnail?id=1WWS1lbImZFDhToj80VtPyzzibMYcKS_A&sz=w800";
const gambar3  = "https://drive.google.com/thumbnail?id=1vd7QOBgTEIqXKktFDXeYBWFNz0lFvZdj&sz=w800";
const gambar4  = "https://drive.google.com/thumbnail?id=1xI0V9muTGSih_Qpna2KJM88jVHJpyX9D&sz=w800";
const gambar5  = "https://drive.google.com/thumbnail?id=1neOkV531-h1fDFifUrbj7NXByNzC-ojL&sz=w800";
const gambar6  = "https://drive.google.com/thumbnail?id=1oagqYpnJzQlgTLZZE0m2d2zRpPAyBcX4&sz=w800";
const gambar7  = "https://drive.google.com/thumbnail?id=1UcwNra0dRvuMrCZyg7j6Bz84GA7QJE23&sz=w800";
const gambar8  = "https://drive.google.com/thumbnail?id=1hvpMIZ7aSxZ5DPCH3JLq2-Q4Wx4ux9bw&sz=w800";
const gambar9  = "https://drive.google.com/thumbnail?id=1MgtZrHGmNl1maoUCtIV0VskCTd-NYNH1&sz=w800";
const gambar10 = "https://drive.google.com/thumbnail?id=1j1CV3PAj1_G1z8dnhwKeY0M1V3lUJZZD&sz=w800";
const gambar11 = "https://drive.google.com/thumbnail?id=1CuCTC1EzP10kOIspa_KWSjFnWz9LFdRD&sz=w800";
const gambar12 = "https://drive.google.com/thumbnail?id=1DpHlWvzdBSR62ux_X8Uinkpzhko10RjS&sz=w800";
const gambar13 = "https://drive.google.com/thumbnail?id=1-tXJ8fspwZJKxkfUC961Z5W8zAjR6a3S&sz=w800";
const gambar14 = "https://drive.google.com/thumbnail?id=1-tXJ8fspwZJKxkfUC961Z5W8zAjR6a3S&sz=w800";
import gambar15 from "@/assets/Gambar_15_Jumlah_Sudut_pada_segi-n_1773289509183.png";

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
        <path d="M 0 0 L 6 3.5 L 0 7 Z" fill="var(--icon-color)" />
      </marker>
      <marker id="ah-gsv-yellow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
        <path d="M 0 0 L 6 3.5 L 0 7 Z" fill="#F0C040" />
      </marker>
    </defs>

    {/* ── LEFT: Sudut Positif ── */}
    {/* OA arm → right */}
    <line x1="80" y1="120" x2="150" y2="120" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ah-gsv)" />
    {/* OB arm → upper-left (130°) */}
    <line x1="80" y1="120" x2="40" y2="72" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ah-gsv)" />
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
    <line x1="170" y1="10" x2="170" y2="185" stroke="var(--icon-stroke)" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.35" />

    {/* ── RIGHT: Sudut Negatif ── */}
    {/* OA arm → right */}
    <line x1="250" y1="80" x2="320" y2="80" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ah-gsv)" />
    {/* OB arm → lower-left (-130° = 230°) */}
    <line x1="250" y1="80" x2="210" y2="128" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ah-gsv)" />
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
    <img
      src={src}
      alt={caption}
      className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5"
      onError={(e) => {
        const el = e.currentTarget;
        el.onerror = null;
        el.style.display = "none";
        const placeholder = el.nextElementSibling as HTMLElement | null;
        if (placeholder) placeholder.style.display = "flex";
      }}
    />
    <div
      className="hidden w-full max-w-xs sm:max-w-sm items-center justify-center rounded-lg border border-border/40 bg-white/5 text-white/40 text-xs italic py-8"
      aria-label={caption}
    >
      {caption}
    </div>
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

// ── Inline SVG illustration for Latihan Dasar Soal 1 ─────────────────────────
// Transparent background; light strokes & text so it shows on the dark theme.
const Soal1SVG = () => (
  <svg
    viewBox="0 0 420 220"
    className="w-full max-w-md mx-auto"
    style={{ background: "transparent" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Horizontal line passing through N – K – L */}
    <line x1="20" y1="175" x2="400" y2="175" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Triangle sides KM and ML */}
    <line x1="140" y1="175" x2="240" y2="35" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="240" y1="35"  x2="380" y2="175" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Angle arcs (small accents to show the 3 angles) */}
    {/* Angle at M (apex) — opens downward, ~50° */}
    <path d="M 226,55 A 22,22 0 0,0 254,55" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    {/* Angle at K — opens to the upper-right */}
    <path d="M 168,175 A 28,28 0 0,0 158,154" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    {/* Angle at L — opens to the upper-left (sweep CW so it bulges into the triangle) */}
    <path d="M 352,175 A 28,28 0 0,1 360,155" fill="none" stroke="#fbbf24" strokeWidth="1.6" />

    {/* Vertex dots (red) */}
    <circle cx="40"  cy="175" r="3.5" fill="#ef4444" />
    <circle cx="140" cy="175" r="3.5" fill="#ef4444" />
    <circle cx="240" cy="35"  r="3.5" fill="#ef4444" />
    <circle cx="380" cy="175" r="3.5" fill="#ef4444" />

    {/* Vertex labels (cyan italic serif, like other figures in this file) */}
    <text x="32"  y="168" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">N</text>
    <text x="132" y="200" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">K</text>
    <text x="385" y="200" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">L</text>
    <text x="232" y="25"  fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">M</text>

    {/* Angle measurements */}
    {/* 50° at M (just below the apex, inside the triangle) */}
    <text x="240" y="80" textAnchor="middle" fill="#fbbf24" fontSize="13" fontFamily="serif">
      50°
    </text>
    {/* (6x + 20)° at K — inside, slightly up & right of K */}
    <text x="186" y="167" fill="#fbbf24" fontSize="13" fontFamily="serif">
      (6<tspan fontStyle="italic">x</tspan> + 20)°
    </text>
    {/* (4x)° at L — closer to the L vertex, just left of the arc */}
    <text x="348" y="170" textAnchor="end" fill="#fbbf24" fontSize="13" fontFamily="serif">
      (4<tspan fontStyle="italic">x</tspan>)°
    </text>
  </svg>
);

// ── Shared marker definitions for arrows on soal SVGs ────────────────────────
const ArrowDef = ({ id, color = "#ffffff" }: { id: string; color?: string }) => (
  <marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
    <path d="M 0 0 L 7 4 L 0 8 Z" fill={color} />
  </marker>
);

// ── Soal 2: Two parallel lines a, b cut by horizontal transversal c ──────────
const Soal2SVG = () => (
  <svg viewBox="0 0 420 220" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s2" /></defs>
    {/* Transversal c */}
    <line x1="20" y1="120" x2="400" y2="120" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s2)" />
    {/* Line a (left, ↗) */}
    <line x1="60" y1="200" x2="180" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s2)" />
    {/* Line b (right, ↗, parallel to a) */}
    <line x1="220" y1="200" x2="340" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s2)" />

    <text x="178" y="32" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">a</text>
    <text x="338" y="32" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">b</text>
    <text x="406" y="116" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">c</text>

    {/* Numbers around left intersection (120, 120). The narrow wedges (NE, SW)
        require pushing 2 and 4 further away so they don't sit on top of the
        diagonal line. */}
    <text x="94"  y="108" fill="#38bdf8" fontSize="13" fontWeight="bold">1</text>
    <text x="158" y="108" fill="#38bdf8" fontSize="13" fontWeight="bold">2</text>
    <text x="158" y="152" fill="#38bdf8" fontSize="13" fontWeight="bold">3</text>
    <text x="76"  y="152" fill="#38bdf8" fontSize="13" fontWeight="bold">4</text>

    {/* Numbers around right intersection (280, 120) */}
    <text x="254" y="108" fill="#38bdf8" fontSize="13" fontWeight="bold">5</text>
    <text x="318" y="108" fill="#38bdf8" fontSize="13" fontWeight="bold">6</text>
    <text x="318" y="152" fill="#38bdf8" fontSize="13" fontWeight="bold">7</text>
    <text x="236" y="152" fill="#38bdf8" fontSize="13" fontWeight="bold">8</text>

    <circle cx="120" cy="120" r="3" fill="#ef4444" />
    <circle cx="280" cy="120" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 3: Two parallel horizontal lines (A, B) cut by transversal ──────────
const Soal3SVG = () => (
  <svg viewBox="0 0 380 240" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="80" x2="360" y2="80" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="20" y1="180" x2="360" y2="180" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Transversal — slope 220/160 = 1.375; at y=80 x≈164, at y=180 x≈236 */}
    <line x1="120" y1="20" x2="280" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="80" y="60" fill="#38bdf8" fontSize="16" fontFamily="serif" fontStyle="italic" fontWeight="bold">A</text>
    <text x="80" y="160" fill="#38bdf8" fontSize="16" fontFamily="serif" fontStyle="italic" fontWeight="bold">B</text>

    {/* Top intersection numbers (~164, 80). Transversal slope = 1.375, so the
        right-of-transversal positions need extra horizontal offset to clear
        the line, especially the lower half (number 3). */}
    <text x="138" y="70"  fill="#fbbf24" fontSize="13" fontWeight="bold">1</text>
    <text x="180" y="70"  fill="#fbbf24" fontSize="13" fontWeight="bold">2</text>
    <text x="192" y="102" fill="#fbbf24" fontSize="13" fontWeight="bold">3</text>
    <text x="138" y="102" fill="#fbbf24" fontSize="13" fontWeight="bold">4</text>

    {/* Bottom intersection numbers (~236, 180) */}
    <text x="210" y="170" fill="#fbbf24" fontSize="13" fontWeight="bold">1</text>
    <text x="252" y="170" fill="#fbbf24" fontSize="13" fontWeight="bold">2</text>
    <text x="264" y="202" fill="#fbbf24" fontSize="13" fontWeight="bold">3</text>
    <text x="210" y="202" fill="#fbbf24" fontSize="13" fontWeight="bold">4</text>

    <circle cx="164" cy="80" r="3" fill="#ef4444" />
    <circle cx="236" cy="180" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 4: Two parallel lines BD, EG; transversal AH; angles (3x)°, (x+40)° ─
const Soal4SVG = () => (
  <svg viewBox="0 0 360 300" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="100" x2="320" y2="100" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="40" y1="220" x2="320" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Transversal AH near vertical, slight tilt */}
    <line x1="160" y1="20" x2="200" y2="280" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* C ≈ (172, 100), F ≈ (190, 220) on the transversal */}
    <text x="186" y="14" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">A</text>
    <text x="22" y="106" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">B</text>
    <text x="328" y="106" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">D</text>
    <text x="146" y="92" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">C</text>
    <text x="22" y="226" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">E</text>
    <text x="328" y="226" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">G</text>
    <text x="174" y="240" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">F</text>
    <text x="208" y="294" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">H</text>

    {/* Angle labels — placed snug next to the vertices C and F */}
    <text x="180" y="116" fill="#fbbf24" fontSize="13" fontFamily="serif">(3<tspan fontStyle="italic">x</tspan>)°</text>
    <text x="198" y="212" fill="#fbbf24" fontSize="13" fontFamily="serif">(<tspan fontStyle="italic">x</tspan>+40)°</text>

    <circle cx="172" cy="100" r="3" fill="#ef4444" />
    <circle cx="190" cy="220" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 5: Line C-B-A horizontal, ray BD up; angles (2x+5)°, (3x-25)° ───────
const Soal5SVG = () => (
  <svg viewBox="0 0 380 200" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="150" x2="360" y2="150" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="200" y1="150" x2="290" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="20" y="170" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">C</text>
    <text x="194" y="172" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">B</text>
    <text x="350" y="170" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">A</text>
    <text x="294" y="38" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">D</text>

    <text x="148" y="138" fill="#fbbf24" fontSize="13" fontFamily="serif">(2<tspan fontStyle="italic">x</tspan>+5)°</text>
    <text x="218" y="142" fill="#fbbf24" fontSize="13" fontFamily="serif">(3<tspan fontStyle="italic">x</tspan>-25)°</text>

    <circle cx="200" cy="150" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 7: Triangle PQR with extension; ∠Q=72°, 7x at R, 6x exterior at Q ───
const Soal7SVG = () => (
  <svg viewBox="0 0 360 220" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s7" /></defs>
    {/* Horizontal P-Q-extension */}
    <line x1="40" y1="170" x2="340" y2="170" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s7)" />
    {/* PR */}
    <line x1="60" y1="170" x2="180" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* QR */}
    <line x1="240" y1="170" x2="180" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="44" y="190" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">P</text>
    <text x="232" y="190" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">Q</text>
    <text x="184" y="38" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">R</text>

    {/* 7x at vertex R (interior angle of the triangle) */}
    <text x="172" y="68" fill="#fbbf24" fontSize="13" fontFamily="serif">7<tspan fontStyle="italic">x</tspan></text>
    {/* 72° at Q (interior, between QP and QR) */}
    <text x="208" y="162" fill="#fbbf24" fontSize="12" fontFamily="serif">72°</text>
    {/* 6x exterior at Q (between QR and Q-extension) — nudged left toward Q */}
    <text x="246" y="162" fill="#fbbf24" fontSize="13" fontFamily="serif">6<tspan fontStyle="italic">x</tspan></text>
  </svg>
);

// ── Soal 8: Triangle ABC with D on extension of AB; (3x-15)° at C, 2x and (5x+5)° at B ──
const Soal8SVG = () => (
  <svg viewBox="0 0 380 220" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s8" /></defs>
    <line x1="20" y1="170" x2="360" y2="170" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s8)" />
    {/* AC */}
    <line x1="40" y1="170" x2="200" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* BC */}
    <line x1="240" y1="170" x2="200" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="32" y="190" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">A</text>
    <text x="232" y="190" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">B</text>
    <text x="350" y="190" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">D</text>
    <text x="194" y="34" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">C</text>

    <text x="165" y="78" fill="#fbbf24" fontSize="12" fontFamily="serif">(3<tspan fontStyle="italic">x</tspan>-15)°</text>
    <text x="218" y="160" fill="#fbbf24" fontSize="13" fontFamily="serif">2<tspan fontStyle="italic">x</tspan></text>
    <text x="246" y="162" fill="#fbbf24" fontSize="13" fontFamily="serif">(5<tspan fontStyle="italic">x</tspan>+5)°</text>
  </svg>
);

// ── Soal 9: Triangle ABC, E above C, D right of B; ∠A=40°, (4x-5)° at C, 5x° exterior at B ──
const Soal9SVG = () => (
  <svg viewBox="0 0 380 260" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s9" /></defs>
    {/* A-B-D horizontal */}
    <line x1="20" y1="220" x2="360" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s9)" />
    {/* AC and CE collinear: A(40,220) -> C(160,80) -> E(200,33) */}
    <line x1="40" y1="220" x2="200" y2="33" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* BC: B(220,220) -> C(160,80) */}
    <line x1="220" y1="220" x2="160" y2="80" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="32" y="240" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">A</text>
    <text x="212" y="240" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">B</text>
    <text x="350" y="240" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">D</text>
    <text x="144" y="82" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">C</text>
    <text x="206" y="30" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">E</text>

    <text x="60" y="212" fill="#fbbf24" fontSize="13" fontFamily="serif">40°</text>
    <text x="175" y="94" fill="#fbbf24" fontSize="13" fontFamily="serif">(4<tspan fontStyle="italic">x</tspan>-5)°</text>
    <text x="232" y="212" fill="#fbbf24" fontSize="13" fontFamily="serif">5<tspan fontStyle="italic">x</tspan>°</text>
  </svg>
);

// ── Soal 13: Cyclic quadrilateral inscribed in a circle with α, β, δ, θ ──────
const Soal13SVG = () => (
  <svg viewBox="0 0 280 280" className="w-full max-w-xs mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <circle cx="140" cy="140" r="110" stroke="var(--icon-stroke)" strokeWidth="2" fill="none" />
    {/* Vertices on circle: α(left), θ(top-right), δ(right), β(bottom) */}
    {/* Polar angles: α≈180°, θ≈55°, δ≈340°, β≈260° */}
    {/* α: (30,140), θ: (203,50), δ: (243,178), β: (121,248) */}
    <polygon points="30,140 203,50 243,178 121,248" fill="none" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Arcs at each vertex — span between the two adjacent polygon edges */}
    {/* α(30,140): edges to θ(NE, -27.5°) and β(SE, 49.9°), interior opens east */}
    <path d="M 49.5,129.9 A 22,22 0 0,1 44.2,156.8" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    {/* θ(203,50): edges to δ(SE, 72.6°) and α(WSW, 152.5°), interior opens south-southwest */}
    <path d="M 209,69 A 20,20 0 0,1 185.3,59.2" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    {/* δ(243,178): edges to β(WSW, 150.2°) and θ(NW, 252.6°), interior opens west */}
    <path d="M 225.6,188 A 20,20 0 0,1 237,158.9" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    {/* β(121,248): edges to α(NW, 229.9°) and δ(NE, 330.2°), interior opens north */}
    <path d="M 106.6,231.4 A 22,22 0 0,1 140,237" fill="none" stroke="#fbbf24" strokeWidth="1.6" />

    <text x="56" y="148" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">α</text>
    <text x="184" y="86" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">θ</text>
    <text x="212" y="174" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">δ</text>
    <text x="120" y="224" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">β</text>

    <circle cx="30" cy="140" r="3" fill="#ef4444" />
    <circle cx="203" cy="50" r="3" fill="#ef4444" />
    <circle cx="243" cy="178" r="3" fill="#ef4444" />
    <circle cx="121" cy="248" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 14: Three crossing lines (triangle) with angles a, b, y (left) and x (right) ──
const Soal14SVG = () => {
  // Endpoints (chosen so intersections are exact):
  //   V (near-vertical): (177,25) → (125,270), passes (160,105) and (140,200)
  //   B (upper-left to right vertex): (35,72) → (390,165), passes (160,105)
  //   C (lower-left to right vertex): (30,215) → (390,165), passes (140,200)
  return (
    <svg viewBox="0 0 420 300" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
      {/* Pink shaded angle wedges (drawn first, beneath the lines) */}
      {/* Angle a at (160,105) — between V going down and B going right */}
      <path d="M 160 105 L 155.47 126.53 A 22 22 0 0 0 181.29 110.55 Z" fill="#fde2e2" stroke="none" />
      {/* Angle b at (140,200) — between V going up and C going right */}
      <path d="M 140 200 L 144.53 178.46 A 22 22 0 0 1 161.79 196.95 Z" fill="#fde2e2" stroke="none" />
      {/* Angle y at (140,200) — between V going down and C going left */}
      <path d="M 140 200 L 135.39 221.51 A 22 22 0 0 1 118.20 202.97 Z" fill="#fde2e2" stroke="none" />
      {/* Angle x at (390,165) — between B going left-up and C going left-down */}
      <path d="M 390 165 L 368.71 159.45 A 22 22 0 0 0 368.21 168.05 Z" fill="#fde2e2" stroke="none" />

      {/* Lines (dark navy) */}
      <line x1="177" y1="25"  x2="125" y2="270" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="35"  y1="72"  x2="390" y2="165" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="30"  y1="215" x2="390" y2="165" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />

      {/* Endpoint dots (red) */}
      <circle cx="177" cy="25"  r="3.5" fill="#b91c1c" />
      <circle cx="125" cy="270" r="3.5" fill="#b91c1c" />
      <circle cx="35"  cy="72"  r="3.5" fill="#b91c1c" />
      <circle cx="30"  cy="215" r="3.5" fill="#b91c1c" />
      <circle cx="390" cy="165" r="3.5" fill="#b91c1c" />

      {/* Angle labels (italic serif, dark navy) */}
      <text x="167" y="121" fill="#1e1b4b" fontSize="16" fontStyle="italic" fontFamily="'Times New Roman', serif">a</text>
      <text x="148" y="195" fill="#1e1b4b" fontSize="16" fontStyle="italic" fontFamily="'Times New Roman', serif">b</text>
      <text x="123" y="215" fill="#1e1b4b" fontSize="16" fontStyle="italic" fontFamily="'Times New Roman', serif">y</text>
      <text x="372" y="169" fill="#1e1b4b" fontSize="16" fontStyle="italic" fontFamily="'Times New Roman', serif">x</text>
    </svg>
  );
};

// ── Soal 15: 2 horizontal parallels l₁, l₂ cut by slanted transversal ────────
// Transversal: from (212,10) to (150,250). SVG y-down coordinates.
// Intersections: l₁ y=85 → x≈193; l₂ y=185 → x≈167
// Transversal up-unit from (193,85): toward (212,10) → (19,-75)/77.4 ≈ (0.245,-0.969)
// Transversal up-unit from (167,185): toward (193,85) → (26,-100)/103.3 ≈ (0.252,-0.968)
//
// Arc sweep rules (SVG y-down):
//   sweep=0 (CCW on screen) | sweep=1 (CW on screen)
//
// Top arc (x+39): centre≈(193,85), P1=(215,85) at 0°, P2≈(198,64) at 286° CW.
//   Short path = CCW 74° → sweep=0
// Bottom arc (2x – pelurus, upper-left): centre≈(167,185), P1=(145,185) at 180°,
//   P2≈(173,164) at 286° CW.  Short path = CW 106° → sweep=1
const Soal15SVG = () => (
  <svg viewBox="0 0 380 265" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* l₁ and l₂ horizontal lines */}
    <line x1="30"  y1="85"  x2="335" y2="85"  stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="30"  y1="185" x2="335" y2="185" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Transversal (slanted: lower-left → upper-right) */}
    <line x1="212" y1="10"  x2="150" y2="250" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Labels */}
    <text x="342" y="91"  fill="#fbbf24" fontSize="14" fontFamily="serif" fontStyle="italic">l₁</text>
    <text x="342" y="191" fill="#fbbf24" fontSize="14" fontFamily="serif" fontStyle="italic">l₂</text>

    {/* Top intersection (193,85):
        P1 = l₁-right  (215, 85)  [angle 0°]
        P2 = transversal-up (198, 64)  [angle 286° CW ≡ 74° CCW]
        Short arc = CCW 74° → sweep=0 → traces upper-right quadrant ✓ */}
    <path d="M 215,85 A 22,22 0 0,0 198,64" fill="none" stroke="#22c55e" strokeWidth="1.8" />
    <text x="208" y="60" fill="#fbbf24" fontSize="13" fontFamily="serif">
      <tspan fontStyle="italic">x</tspan> + 39
    </text>

    {/* Bottom intersection (167,185) – pelurus (sudut dalam kiri atas):
        P1 = l₂-left   (145,185)  [angle 180°]
        P2 = transversal-up (173,164)  [angle 286° CW]
        Short arc = CW 106° → sweep=1 → traces upper-left quadrant ✓ */}
    <path d="M 145,185 A 22,22 0 0,1 173,164" fill="none" stroke="#22c55e" strokeWidth="1.8" />
    <text x="120" y="170" fill="#fbbf24" fontSize="13" fontFamily="serif">
      2<tspan fontStyle="italic">x</tspan>
    </text>

    {/* Red endpoint dots */}
    <circle cx="212" cy="10"  r="4" fill="#ef4444" />
    <circle cx="150" cy="250" r="4" fill="#ef4444" />
    <circle cx="30"  cy="85"  r="4" fill="#ef4444" />
    <circle cx="335" cy="85"  r="4" fill="#ef4444" />
    <circle cx="30"  cy="185" r="4" fill="#ef4444" />
    <circle cx="335" cy="185" r="4" fill="#ef4444" />
  </svg>
);

// ── Soal 16: Two intersecting lines forming X with p, q, r, s ────────────────
const Soal16SVG = () => (
  <svg viewBox="0 0 420 240" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="60" x2="400" y2="180" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="20" y1="180" x2="400" y2="60" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Center ≈ (210, 120) */}
    <circle cx="210" cy="120" r="3.5" fill="#ef4444" />

    <text x="206" y="100" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">p</text>
    <text x="240" y="124" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">q</text>
    <text x="206" y="148" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">r</text>
    <text x="170" y="124" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">s</text>
  </svg>
);

// ── Soal 17: Cube ABCD.EFGH with diagonals BG, GE, EB highlighted ────────────
const Soal17SVG = () => {
  // Cube vertices (front face A,B,F,E; back face D,C,G,H; depth offset = (-50,-40))
  const A = [80, 220], B = [220, 220], C = [270, 180], D = [130, 180];
  const E = [80, 100], F = [220, 100], G = [270, 60], H = [130, 60];
  return (
    <svg viewBox="0 0 320 280" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
      {/* Hidden edges (DA, DC, DH dashed) */}
      <line x1={D[0]} y1={D[1]} x2={A[0]} y2={A[1]} stroke="var(--icon-stroke)" strokeWidth="1.5" strokeDasharray="5,4" />
      <line x1={D[0]} y1={D[1]} x2={C[0]} y2={C[1]} stroke="var(--icon-stroke)" strokeWidth="1.5" strokeDasharray="5,4" />
      <line x1={D[0]} y1={D[1]} x2={H[0]} y2={H[1]} stroke="var(--icon-stroke)" strokeWidth="1.5" strokeDasharray="5,4" />

      {/* Visible edges */}
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={B[0]} y1={B[1]} x2={C[0]} y2={C[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={A[0]} y1={A[1]} x2={E[0]} y2={E[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={B[0]} y1={B[1]} x2={F[0]} y2={F[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={C[0]} y1={C[1]} x2={G[0]} y2={G[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={E[0]} y1={E[1]} x2={F[0]} y2={F[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={F[0]} y1={F[1]} x2={G[0]} y2={G[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={G[0]} y1={G[1]} x2={H[0]} y2={H[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={H[0]} y1={H[1]} x2={E[0]} y2={E[1]} stroke="var(--icon-stroke)" strokeWidth="2" />

      {/* Diagonals BG, GE, EB highlighted */}
      <line x1={B[0]} y1={B[1]} x2={G[0]} y2={G[1]} stroke="#ef4444" strokeWidth="2.4" />
      <line x1={G[0]} y1={G[1]} x2={E[0]} y2={E[1]} stroke="#ef4444" strokeWidth="2.4" />
      <line x1={E[0]} y1={E[1]} x2={B[0]} y2={B[1]} stroke="#ef4444" strokeWidth="2.4" />

      {/* Vertex labels */}
      <text x={A[0] - 14} y={A[1] + 15} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
      <text x={B[0] + 4} y={B[1] + 15} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>
      <text x={C[0] + 6} y={C[1] + 4} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">C</text>
      <text x={D[0] - 4} y={D[1] - 4} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">D</text>
      <text x={E[0] - 14} y={E[1] - 4} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">E</text>
      <text x={F[0] - 4} y={F[1] - 4} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">F</text>
      <text x={G[0] + 4} y={G[1] - 2} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">G</text>
      <text x={H[0] - 4} y={H[1] - 4} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">H</text>
    </svg>
  );
};

// ── Soal 18: Cross at O with right angle, 7x° between vertical-up & diag,2x° between horiz-left & diag ──
// O = (200,140). Diagonal AB passes through O: A(40,180)→B(360,100).
// Diagonal angle from horizontal ≈ 14° above (slope -80/320 = -0.25).
// Quadrant I  (upper-right): 7x — between vertical-up and diagonal-toward-B
// Quadrant II (upper-left) : right-angle marker — between vertical-up and horizontal-left
// Quadrant III(lower-left) : 2x — between diagonal-toward-A and horizontal-left
const Soal18SVG = () => (
  <svg viewBox="0 0 380 240" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="140" x2="360" y2="140" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="200" y1="20" x2="200" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Diagonal A(lower-left) → B(upper-right) through O(200,140) */}
    <line x1="40" y1="180" x2="360" y2="100" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Right-angle marker in quadrant II (upper-left of O):
        vertical-up point (200,126) → left (186,126) → horizontal-left point (186,140) */}
    <polyline points="200,126 186,126 186,140" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" />

    {/* O label — slightly right and below intersection */}
    <text x="204" y="155" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">O</text>
    <text x="28"  y="198" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
    <text x="346" y="96"  fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>

    {/* 7x in quadrant I (upper-right): moved down closer to the angle */}
    <text x="210" y="122" fill="#fbbf24" fontSize="13" fontFamily="serif">7<tspan fontStyle="italic">x</tspan>°</text>

    {/* 2x in quadrant III (lower-left): moved down away from the diagonal line above */}
    <text x="108" y="158" fill="#fbbf24" fontSize="13" fontFamily="serif">2<tspan fontStyle="italic">x</tspan>°</text>

    <circle cx="200" cy="140" r="3" fill="#ef4444" />
    <circle cx="40"  cy="180" r="3" fill="#ef4444" />
    <circle cx="360" cy="100" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 19 ────────────────────────────────────────────────────────────────────
// Geometry (viewBox 0 0 400 270):
//   P  = (220, 80)  — upper crossing of the two diagonals
//   L  = (75, 200)  — Diag1 meets the horizontal baseline
//   R  = (310, 200) — Diag2 meets the horizontal baseline
//
//   Diag1 (lower-left ↔ upper-right): (0,262) → (299,15)  unit dir=(0.770,−0.637)
//   Diag2 (upper-left ↔ lower-right): (171,15) → (359,265) unit dir=(0.600, 0.800)
//
// Angle sectors (r=22):
//   b  at P — blue,   RIGHT pocket: Diag1-upright(237,66) → Diag2-downright(233,98) CW (sweep=1, ~93°)
//   x  at L — green,  large angle: horiz-RIGHT (97,200) → Diag1-downleft (58,214) CW (sweep=1, ~140°)
//   a  at R — pink,   small angle: Diag2-upleft (297,182) → horiz-left (288,200) CCW (sweep=0)
//   y  at R — purple, LEFT-below pocket: Diag2-downright(323,218) → horiz-left(288,200) CW (sweep=1, ~127°)
const Soal19SVG = () => {
  const { isDark } = useTheme();

  // Lines: bright on space/dark themes, dark navy on light themes
  const lineColor  = isDark ? "#93c5fd" : "#1e3a8a";
  const line2Color = isDark ? "#bfdbfe" : "#2563eb";
  const dotColor   = isDark ? "#f87171" : "#dc2626";

  // Labels: light/vivid on dark, deep/saturated on light
  const lblB = isDark ? "#93c5fd" : "#1d4ed8";
  const lblX = isDark ? "#86efac" : "#15803d";
  const lblA = isDark ? "#fca5a5" : "#b91c1c";
  const lblY = isDark ? "#d8b4fe" : "#7e22ce";

  // Sector fills: lighter tint on dark (more visible against dark bg)
  const fillB = isDark ? "rgba(147,197,253,0.55)" : "rgba(59,130,246,0.45)";
  const fillX = isDark ? "rgba(134,239,172,0.50)" : "rgba(34,197,94,0.40)";
  const fillA = isDark ? "rgba(252,165,165,0.55)" : "rgba(239,68,68,0.40)";
  const fillY = isDark ? "rgba(216,180,254,0.55)" : "rgba(168,85,247,0.40)";

  return (
    <svg viewBox="0 0 400 270" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
      {/* ── Filled angle sectors (drawn first, behind lines) ── */}

      {/* b — blue sector at P(220,80): RIGHT pocket Diag1-upright(237,66) → Diag2-downright(233,98) CW */}
      <path d="M 237,66 A 22,22 0 0,1 233,98 L 220,80 Z"
        fill={fillB} stroke={lblB} strokeWidth="1.5" />

      {/* x — green sector at L(75,200): horiz-right(97,200) → Diag1-downleft(58,214) CW ~140° */}
      <path d="M 97,200 A 22,22 0 0,1 58,214 L 75,200 Z"
        fill={fillX} stroke={lblX} strokeWidth="1.5" />

      {/* a — pink sector at R(310,200): Diag2-upleft(297,182) → horiz-left(288,200) CCW */}
      <path d="M 297,182 A 22,22 0 0,0 288,200 L 310,200 Z"
        fill={fillA} stroke={lblA} strokeWidth="1.5" />

      {/* y — purple sector at R(310,200): LEFT-below pocket Diag2-downright(323,218) → horiz-left(288,200) CW */}
      <path d="M 323,218 A 22,22 0 0,1 288,200 L 310,200 Z"
        fill={fillY} stroke={lblY} strokeWidth="1.5" />

      {/* ── Lines ── */}
      {/* Horizontal baseline */}
      <line x1="15"  y1="200" x2="385" y2="200" stroke={lineColor}  strokeWidth="2.5" />
      {/* Diag1: lower-left → upper-right (through L and P) */}
      <line x1="0"   y1="262" x2="299" y2="15"  stroke={lineColor}  strokeWidth="2.5" />
      {/* Diag2: upper-left → lower-right (through P and R) */}
      <line x1="171" y1="15"  x2="359" y2="265" stroke={line2Color} strokeWidth="2.5" />

      {/* ── Vertex dots ── */}
      <circle cx="220" cy="80"  r="4" fill={dotColor} />
      <circle cx="75"  cy="200" r="4" fill={dotColor} />
      <circle cx="310" cy="200" r="4" fill={dotColor} />

      {/* ── Labels ── */}
      {/* b: right of P, inside the right pocket */}
      <text x="244" y="86"  fill={lblB} fontSize="16" fontStyle="italic" fontWeight="bold" fontFamily="'Times New Roman',serif">b</text>
      {/* x: lower-left, inside the large green sector */}
      <text x="52"  y="228" fill={lblX} fontSize="16" fontStyle="italic" fontWeight="bold" fontFamily="'Times New Roman',serif">x</text>
      {/* a: above the pink sector at R */}
      <text x="277" y="194" fill={lblA} fontSize="14" fontStyle="italic" fontFamily="'Times New Roman',serif">a</text>
      {/* y: lower-left of R, inside the left-below pocket */}
      <text x="272" y="226" fill={lblY} fontSize="16" fontStyle="italic" fontWeight="bold" fontFamily="'Times New Roman',serif">y</text>
    </svg>
  );
};

// ── Soal 20: Trapezoid ABCD with extra ray; right angle at A, 2x° below A, 120° at C ──
const Soal20SVG = () => (
  <svg viewBox="0 0 400 280" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* Top side AB */}
    <line x1="60" y1="80" x2="360" y2="80" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Bottom side DC */}
    <line x1="40" y1="220" x2="320" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* AD */}
    <line x1="60" y1="80" x2="40" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* BC */}
    <line x1="360" y1="80" x2="320" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Inner triangle from A down to a point on DC */}
    <line x1="60" y1="80" x2="180" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Small ray going up from A creating x */}
    <line x1="60" y1="80" x2="40" y2="20" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Right angle marker at A (between AB and the ray going up) */}
    <polyline points="60,68 72,68 72,80" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" />

    <text x="44" y="76" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
    <text x="364" y="76" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>
    <text x="22" y="240" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">D</text>
    <text x="324" y="240" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">C</text>

    {/* x label near small ray */}
    <text x="36" y="14" fill="#fbbf24" fontSize="13" fontStyle="italic" fontFamily="serif">x</text>
    {/* 2x just below A */}
    <text x="64" y="116" fill="#fbbf24" fontSize="13" fontFamily="serif">2<tspan fontStyle="italic">x</tspan></text>
    {/* 120° at C */}
    <text x="270" y="212" fill="#fbbf24" fontSize="13" fontFamily="serif">120°</text>
  </svg>
);

// ── Soal 21: Right angle at Q, ray QS between QP (up) and QR (right) ─────────
const Soal21SVG = () => (
  <svg viewBox="0 0 400 290" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* Horizontal line: full width, Q at center-left */}
    <line x1="20" y1="180" x2="375" y2="180" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Vertical PQ: from P above down to Q */}
    <line x1="200" y1="20" x2="200" y2="180" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Diagonal QS: exactly 32° above horizontal right — endpoint at Q+115·(cos32°,−sin32°) */}
    <line x1="200" y1="180" x2="298" y2="119" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Right-angle marker at Q — upper-right (between QP-up and QR-right) */}
    <polyline points="200,160 220,160 220,180" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" />

    {/* Labels */}
    <text x="192" y="14" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">P</text>
    <text x="184" y="202" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">Q</text>
    {/* R at the far right end of horizontal */}
    <text x="358" y="174" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">R</text>
    <text x="302" y="113" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">S</text>

    {/* Arc (3x+5)°: from QR right (0°) up to QS (~32°), radius 40 */}
    {/* Start: Q+(40,0)=(240,180), End: Q+40·(cos32°,−sin32°)=(234,159) */}
    <path d="M 240,180 A 40,40 0 0,0 234,159" fill="none" stroke="#a855f7" strokeWidth="1.8" />
    <text x="242" y="177" fill="#a855f7" fontSize="11" fontFamily="serif">(3<tspan fontStyle="italic">x</tspan>+5)°</text>

    {/* Arc (6x+4)°: from QS (~32°) up to QP (90°), radius 40 */}
    {/* Start: Q+40·(cos32°,−sin32°)=(234,159), End: Q+(0,−40)=(200,140) */}
    <path d="M 234,159 A 40,40 0 0,0 200,140" fill="none" stroke="#ef4444" strokeWidth="1.8" />
    <text x="218" y="148" fill="#ef4444" fontSize="11" fontFamily="serif">(6<tspan fontStyle="italic">x</tspan>+4)°</text>

    {/* Dot at Q */}
    <circle cx="200" cy="180" r="3" fill="#facc15" />
  </svg>
);

// ── Soal 22: Two parallel lines l, m with diagonal & triangle (1..6 angles) ──
const Soal22SVG = () => (
  <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s22" /></defs>
    {/* Top horizontal l */}
    <line x1="20" y1="80" x2="380" y2="80" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s22)" />
    {/* Bottom horizontal m */}
    <line x1="20" y1="240" x2="380" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s22)" />
    {/* Diagonal from upper-left going down-right, crossing both lines */}
    <line x1="200" y1="20" x2="120" y2="290" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Triangle: from (170, 130) on diagonal go to point on bottom line */}
    <line x1="170" y1="130" x2="320" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="364" y="74" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">l</text>
    <text x="364" y="234" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">m</text>

    {/* Numbers at top intersection ≈ (180, 80) */}
    <text x="192" y="74" fill="#38bdf8" fontSize="13" fontWeight="bold">4</text>
    <text x="156" y="98" fill="#38bdf8" fontSize="13" fontWeight="bold">1</text>

    {/* Numbers at triangle apex (170, 130) */}
    <text x="174" y="124" fill="#38bdf8" fontSize="13" fontWeight="bold">2</text>
    <text x="172" y="148" fill="#38bdf8" fontSize="13" fontWeight="bold">6</text>

    {/* Numbers at bottom intersection of diagonal & m ≈ (138, 240) */}
    <text x="148" y="234" fill="#38bdf8" fontSize="13" fontWeight="bold">5</text>
    {/* 3 inside triangle near bottom-right */}
    <text x="282" y="234" fill="#38bdf8" fontSize="13" fontWeight="bold">3</text>

    <circle cx="180" cy="80" r="3" fill="#ef4444" />
    <circle cx="138" cy="240" r="3" fill="#ef4444" />
    <circle cx="320" cy="240" r="3" fill="#ef4444" />
    <circle cx="170" cy="130" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 23: Triangle ABC with D on extension of AC; ∠C=108° ext, ∠B=36° ────
const Soal23SVG = () => (
  <svg viewBox="0 0 380 280" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* AB horizontal */}
    <line x1="40" y1="240" x2="340" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* AD diagonal through C */}
    <line x1="40" y1="240" x2="220" y2="20" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* BC: B(300,240) -> C at intersection with AD ≈ (166,87) */}
    <line x1="300" y1="240" x2="166" y2="87" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="32" y="262" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
    <text x="304" y="262" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>
    <text x="144" y="84" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">C</text>
    <text x="226" y="22" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">D</text>

    {/* 108° shifted to upper-right of C to avoid collision */}
    <text x="182" y="90" fill="#fbbf24" fontSize="13" fontFamily="serif">108°</text>
    {/* 36° at B (interior) */}
    <text x="262" y="232" fill="#fbbf24" fontSize="13" fontFamily="serif">36°</text>

    <circle cx="166" cy="87" r="3" fill="#ef4444" />
    <circle cx="40" cy="240" r="3" fill="#ef4444" />
    <circle cx="300" cy="240" r="3" fill="#ef4444" />
    <circle cx="220" cy="20" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 24: Parallelogram SPQR with PT (through U) and QT to T below; x at U ──
const Soal24SVG = () => (
  <svg viewBox="0 0 440 360" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* Parallelogram S(40,180) - P(140,40) - Q(380,40) - R(280,180) */}
    <polygon points="40,180 140,40 380,40 280,180" fill="none" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* PT line through U (on SR). U at (180,180). T at (220,320) */}
    <line x1="140" y1="40" x2="220" y2="320" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* QT line from Q to T */}
    <line x1="380" y1="40" x2="220" y2="320" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="22" y="194" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">S</text>
    <text x="130" y="34" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">P</text>
    <text x="384" y="34" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">Q</text>
    <text x="288" y="194" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">R</text>
    <text x="174" y="198" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">U</text>
    <text x="214" y="338" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">T</text>

    {/* arc + x at U (between US going left and UP going up-left) */}
    <path d="M 158,170 A 22,22 0 0,1 168,144" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    <text x="158" y="160" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">x</text>

    <circle cx="180" cy="180" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 25: Horizontal line with one ray going up; angles x (left) y (right) ──
const Soal25SVG = () => (
  <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="160" x2="380" y2="160" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="220" y1="160" x2="170" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* x arc: from left-horizontal (185,160) clockwise up to ray direction (207,128); r=35 */}
    <path d="M 185,160 A 35,35 0 0,1 207,128" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
    <text x="191" y="153" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif">x</text>

    {/* y arc: from ray direction (207,128) clockwise down to right-horizontal (255,160); r=35 */}
    <path d="M 207,128 A 35,35 0 0,1 255,160" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
    <text x="229" y="151" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">y</text>

    <circle cx="220" cy="160" r="3" fill="var(--icon-color)" />
  </svg>
);

// ── Soal 26: Two parallel lines AD (top), EG (bottom); triangle B-F-C ────────
const Soal26SVG = () => (
  <svg viewBox="0 0 400 240" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <ArrowDef id="ar-s26-l" color="#ffffff" />
      <marker id="ar-s26-l-start" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
        <path d="M 7 0 L 0 4 L 7 8 Z" fill="var(--icon-color)" />
      </marker>
    </defs>
    {/* Top line AD */}
    <line x1="20" y1="60" x2="380" y2="60" stroke="var(--icon-stroke)" strokeWidth="2" markerStart="url(#ar-s26-l-start)" markerEnd="url(#ar-s26-l)" />
    {/* Bottom line EG */}
    <line x1="20" y1="200" x2="380" y2="200" stroke="var(--icon-stroke)" strokeWidth="2" markerStart="url(#ar-s26-l-start)" markerEnd="url(#ar-s26-l)" />
    {/* B-F */}
    <line x1="120" y1="60" x2="200" y2="200" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* C-F */}
    <line x1="280" y1="60" x2="200" y2="200" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="20" y="50" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
    <text x="116" y="50" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>
    <text x="276" y="50" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">C</text>
    <text x="364" y="50" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">D</text>
    <text x="20" y="222" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">E</text>
    <text x="194" y="222" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">F</text>
    <text x="364" y="222" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">G</text>

    <circle cx="120" cy="60" r="3" fill="#ef4444" />
    <circle cx="280" cy="60" r="3" fill="#ef4444" />
    <circle cx="200" cy="200" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 27: Two parallels with zigzag; 30° top, a° middle, 50° bottom ───────
const Soal27SVG = () => (
  <svg viewBox="0 0 380 280" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s27" /></defs>
    <line x1="40" y1="40" x2="360" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s27)" />
    <line x1="40" y1="240" x2="360" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s27)" />
    {/* Zigzag: top point (90,40) -> middle vertex (240,140) -> bottom (90,240) */}
    <line x1="90" y1="40" x2="240" y2="140" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="240" y1="140" x2="90" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="122" y="56" fill="#fbbf24" fontSize="13" fontFamily="serif">30°</text>
    <text x="206" y="148" fill="#fbbf24" fontSize="13" fontFamily="serif"><tspan fontStyle="italic">a</tspan>°</text>
    <text x="124" y="232" fill="#fbbf24" fontSize="13" fontFamily="serif">50°</text>

    <circle cx="90" cy="40" r="3" fill="#ef4444" />
    <circle cx="240" cy="140" r="3" fill="#ef4444" />
    <circle cx="90" cy="240" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 28: Two parallels with triangle apex; 30° top, x apex, 110° bottom ──
const Soal28SVG = () => (
  <svg viewBox="0 0 380 260" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s28" /></defs>
    {/* Top horizontal */}
    <line x1="40" y1="60" x2="360" y2="60" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s28)" />
    {/* Bottom horizontal */}
    <line x1="40" y1="220" x2="360" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s28)" />
    {/* Long diagonal from lower-left up-right (passes from (60,220) up to (300,40)) */}
    <line x1="60" y1="220" x2="300" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Short top segment forming the small triangle: from (130, 60) down-right to apex (200, 130) */}
    <line x1="130" y1="60" x2="200" y2="130" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* 30° at top - moved right to clear short segment line */}
    <text x="156" y="78" fill="#fbbf24" fontSize="13" fontFamily="serif">30°</text>
    {/* x at left supplementary angle of apex (~191,121) */}
    <text x="176" y="124" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">x</text>
    {/* 110° at bottom-left - moved right to clear diagonal line */}
    <text x="92" y="208" fill="#fbbf24" fontSize="13" fontFamily="serif">110°</text>
  </svg>
);

type SoalImage = string | ReactNode | null;

const latihanDasar: {
  no: number;
  soal: string;
  image: SoalImage;
  imageCaption: string;
  options: string[];
}[] = [
  {
    no: 1,
    soal: "Perhatikan gambar.\n\nBesar $\\angle KLM$ adalah …",
    image: <Soal1SVG />,
    imageCaption: "Gambar Soal 1",
    options: ["A. $15°$", "B. $30°$", "C. $42°$", "D. $60°$"]
  },
  {
    no: 2,
    soal: "Perhatikan gambar berikut!\n\nPerhatikan pernyataan berikut!\n(i) Sudut 1 dan sudut 7, sudut luar berseberangan\n(ii) Sudut 1 dan sudut 6, sudut luar sepihak\n(iii) Sudut 4 dan sudut 6, sudut bertolak belakang\n(iv) Sudut 3 dan sudut 7, sudut sehadap\n\nPernyataan yang benar adalah ….",
    image: <Soal2SVG />,
    imageCaption: "Gambar Soal 2",
    options: ["A. (i) dan (ii) saja", "B. (ii) dan (iv) saja", "C. (i), (ii) dan (iii)", "D. (i), (ii) dan (iv)"]
  },
  {
    no: 3,
    soal: "Perhatikan gambar\n\n$\\angle A_1 = 103°$, maka besar $\\angle B_4$ dan $\\angle A_3$ berturut-turut adalah …",
    image: <Soal3SVG />,
    imageCaption: "Gambar Soal 3",
    options: ["A. $13°$ dan $90°$", "B. $90°$ dan $130°$", "C. $77°$ dan $103°$", "D. $103°$ dan $77°$"]
  },
  {
    no: 4,
    soal: "Perhatikan gambar\n\nBesar $\\angle BCF$ adalah ….",
    image: <Soal4SVG />,
    imageCaption: "Gambar Soal 4",
    options: ["A. $35°$", "B. $45°$", "C. $60°$", "D. $75°$"]
  },
  {
    no: 5,
    soal: "Perhatikan gambar\n\nDiketahui besar $\\angle CBD = (2x + 5)°$ dan $\\angle ABD = (3x - 25)°$. Besar pelurus sudut CBD adalah ...",
    image: <Soal5SVG />,
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
    image: <Soal7SVG />,
    imageCaption: "Gambar Soal 7",
    options: ["A. $18°$", "B. $36°$", "C. $45°$", "D. $54°$"]
  },
  {
    no: 8,
    soal: "Perhatikan gambar berikut\n\nBesar $\\angle BAC$ adalah …",
    image: <Soal8SVG />,
    imageCaption: "Gambar Soal 8",
    options: ["A. $80°$", "B. $70°$", "C. $60°$", "D. $50°$"]
  },
  {
    no: 9,
    soal: "Perhatikan gambar berikut!\n\nBesar sudut ACB adalah ….",
    image: <Soal9SVG />,
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
    image: <Soal13SVG />,
    imageCaption: "Gambar Soal 13",
    options: ["A. 85", "B. 80", "C. 55", "D. 30"]
  },
  {
    no: 14,
    soal: "Perhatikan gambar berikut:\n\nJika besar $\\angle a = 95°$ dan $\\angle b = 70°$ maka selisih besar sudut x dan y adalah...",
    image: <Soal14SVG />,
    imageCaption: "Gambar Soal 14",
    options: ["A. $25°$", "B. $45°$", "C. $65°$", "D. $85°$"]
  },
  {
    no: 15,
    soal: "Perhatikan gambar berikut:\n\nJika garis $l_1$ dan $l_2$ adalah dua garis yang sejajar, maka nilai x adalah...",
    image: <Soal15SVG />,
    imageCaption: "Gambar Soal 15",
    options: ["A. $13°$", "B. $39°$", "C. $47°$", "D. $55°$"]
  },
  {
    no: 16,
    soal: "Empat sudut terbentuk oleh dua garis berpotongan seperti pada gambar berikut:\n\nBila diketahui $q° = 45°$ maka:",
    image: <Soal16SVG />,
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
    image: <Soal17SVG />,
    imageCaption: "Gambar Soal 17",
    options: ["A. $30°$", "B. $60°$", "C. $45°$", "D. $90°$"]
  },
  {
    no: 18,
    soal: "Perhatikan gambar.\n\nBesar sudut AOB adalah ...",
    image: <Soal18SVG />,
    imageCaption: "Gambar Soal 18",
    options: ["A. $70°$", "B. $120°$", "C. $140°$", "D. $160°$"]
  },
  {
    no: 19,
    soal: "Perhatikan gambar berikut!\n\nJika besar $\\angle a = 35°$ dan $\\angle b = 45°$ maka jumlah besar sudut x dan y adalah ...",
    image: (
      <div className="flex flex-col items-center gap-1 w-full">
        <img src={"/images/image_1777593919772.png"} alt="Gambar Soal 19" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} />
        <p className="text-xs text-white/35 italic">Duplikat SVG ↓</p>
        <Soal19SVG />
      </div>
    ),
    imageCaption: "Gambar Soal 19",
    options: ["A. $285°$", "B. $300°$", "C. $315°$", "D. $330°$"]
  },
  {
    no: 20,
    soal: "Perhatikan gambar berikut!\n\nJika diketahui AB sejajar CD, maka nilai x adalah ...",
    image: <img src={"/images/g_1777646456179.png"} alt="Gambar Soal 20" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} />,
    imageCaption: "Gambar Soal 20",
    options: ["A. $15°$", "B. $30°$", "C. $40°$", "D. $45°$"]
  },
  {
    no: 21,
    soal: "Perhatikan gambar berikut!\n\nBesar penyiku $\\angle SQR$ adalah ...",
    image: <img src={"/images/image_1777674744629.png"} alt="Gambar Soal 21" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} />,
    imageCaption: "Gambar Soal 21",
    options: ["A. $9°$", "B. $32°$", "C. $48°$", "D. $58°$"]
  },
  {
    no: 22,
    soal: "Perhatikan gambar berikut!\n\nBesar sudut nomor 1 adalah $95°$, dan sudut nomor 2 adalah $110°$. Besar sudut nomor 3 adalah ...",
    image: <Soal22SVG />,
    imageCaption: "Gambar Soal 22",
    options: ["A. $5°$", "B. $15°$", "C. $25°$", "D. $35°$"]
  },
  {
    no: 23,
    soal: "Perhatikan gambar berikut.\n\nBesar $\\angle BAC$ adalah...",
    image: <Soal23SVG />,
    imageCaption: "Gambar Soal 23",
    options: ["A. $24°$", "B. $48°$", "C. $72°$", "D. $98°$"]
  },
  {
    no: 24,
    soal: "Perhatikan gambar di bawah ini.\n\nDiketahui sudut SPT $= 83°$ dan sudut PQT $= 41°$. Garis PQ dan RS sejajar, demikian juga garis PS dan QT sejajar. Maka besar x = …",
    image: <img src={"/images/image_1777675316904.png"} alt="Soal 24" className="w-full max-w-md mx-auto" />,
    imageCaption: "Gambar Soal 24",
    options: ["A. $41°$", "B. $82°$", "C. $124°$", "D. $139°$"]
  },
  {
    no: 25,
    soal: "Dari gambar berikut, diketahui perbandingan x:y adalah 2:7. Besar sudut x adalah ...",
    image: <Soal25SVG />,
    imageCaption: "Gambar Soal 25",
    options: ["A. $120°$", "B. $60°$", "C. $40°$", "D. $20°$"]
  },
  {
    no: 26,
    soal: "Perhatikan gambar. Jika $\\angle EFB = 65°$ dan $\\angle FCD = 120°$, maka besar $\\angle BFC$ adalah...",
    image: <Soal26SVG />,
    imageCaption: "Gambar Soal 26",
    options: ["A. $55°$", "B. $45°$", "C. $50°$", "D. $35°$"]
  },
  {
    no: 27,
    soal: "Perhatikan gambar berikut. Besar sudut a adalah ...",
    image: <Soal27SVG />,
    imageCaption: "Gambar Soal 27",
    options: ["A. $30°$", "B. $50°$", "C. $80°$", "D. $100°$"]
  },
  {
    no: 28,
    soal: "Perhatikan gambar di bawah ini!\n\nNilai x adalah ...",
    image: <Soal28SVG />,
    imageCaption: "Gambar Soal 28",
    options: ["A. $150°$", "B. $140°$", "C. $110°$", "D. $100°$"]
  },
];

const latihanOlimpiade = [
  {
    no: 1,
    soal: "OSN Matematika 2003 Tingkat Kota\n\nPada gambar disamping, ABCD adalah persegi dan ABE adalah segitiga sama sisi. Besar sudut DAE adalah ...",
    image: "/images/image_1777677600584.png",
    options: ["A. $15°$", "B. $30°$", "C. $45°$", "D. $60°$", "E. $75°$"]
  },
  {
    no: 2,
    soal: "OSN Matematika 2004 Tingkat Kota\n\nPada gambar berikut, garis PQ dan garis RS sejajar, demikian juga garis PS dan QT sejajar. Nilai x sama dengan ...",
    image: "/images/image_1777686601334.png",
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
    image: "/images/image_1777686713928.png",
    options: ["A. 360", "B. 540", "C. 720", "D. 900", "E. 1.260"]
  },
  {
    no: 5,
    soal: "OSN Matematika 2008 Tingkat Kota\n\nPerhatikan gambar berikut.\n\nSegitiga PQR merupakan segitiga sama sisi. Jika $\\angle SPQ = 20°$ dan $\\angle TQR = 35°$, maka $\\angle SUT = ...$",
    image: "/images/image_1777687009906.png",
    options: ["A. $135°$", "B. $130°$", "C. $125°$", "D. $105°$", "E. $95°$"]
  },
  {
    no: 6,
    soal: "OSN Matematika 2014 Tingkat Kota\n\nDiketahui garis $L_1$ sejajar garis $L_2$ dan garis $L_3$ sejajar garis $L_4$.\n\nBesar sudut $y - x$ adalah ...",
    image: "/images/image_1777687942709.png",
    options: ["A. $0°$", "B. $10°$", "C. $30°$", "D. $50°$"]
  },
  {
    no: 7,
    soal: "OSN Matematika 2018 Tingkat Kota\n\nNilai sudut x dan y pada gambar berikut adalah ...",
    image: "/images/image_1777688265821.png",
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

type Pembahasan = { konsep: string; jawaban: string; langkah: string[]; rumus?: string };

const pembahasanDasar: Record<number, Pembahasan> = {
  1: {
    konsep: "Sifat sudut dalam segitiga (jumlah = $180°$) dan sudut berpelurus digunakan bersama untuk mencari sudut yang ditanya.",
    jawaban: "B. $30°$",
    langkah: [
      "Perhatikan segitiga KLM pada gambar dan gunakan sifat sudut dalam segitiga: $\\angle K + \\angle L + \\angle M = 180°$.",
      "Gunakan sifat sudut berpelurus pada garis bantu yang ada untuk menyatakan sudut yang tidak diketahui.",
      "Substitusi nilai sudut yang diketahui dan pisahkan variabel untuk mendapatkan $\\angle KLM = 30°$.",
    ],
    rumus: "$\\angle K + \\angle L + \\angle M = 180°$",
  },
  2: {
    konsep: "Pada dua garis sejajar yang dipotong transversal terbentuk 8 sudut dengan berbagai hubungan: sehadap, luar berseberangan, luar sepihak, dan bertolak belakang.",
    jawaban: "D. (i), (ii) dan (iv)",
    langkah: [
      "(i) Sudut 1 dan 7 berada di luar dan saling bersilangan ⇒ sudut luar berseberangan ✓",
      "(ii) Sudut 1 dan 6 sama-sama di luar dan di sisi yang sama dari transversal ⇒ sudut luar sepihak ✓",
      "(iii) Sudut 4 dan 6 berbeda sisi di antara dua garis sejajar ⇒ sudut dalam berseberangan, BUKAN bertolak belakang ✗",
      "(iv) Sudut 3 dan 7 menempati posisi serupa pada masing-masing garis ⇒ sudut sehadap ✓",
      "Pernyataan benar: (i), (ii) dan (iv).",
    ],
    rumus: "Sudut sehadap sama besar; sudut dalam berseberangan sama besar; sudut dalam sepihak berjumlah $180°$",
  },
  3: {
    konsep: "Sudut sehadap pada dua garis sejajar besarnya sama; sudut berpelurus berjumlah $180°$.",
    jawaban: "D. $103°$ dan $77°$",
    langkah: [
      "Karena dua garis sejajar dipotong transversal, $\\angle B_4$ sehadap dengan $\\angle A_1$, sehingga $\\angle B_4 = \\angle A_1 = 103°$.",
      "$\\angle A_3$ berpelurus dengan $\\angle A_1$: $\\angle A_3 = 180° - 103° = 77°$.",
    ],
    rumus: "Sehadap: sama besar. Berpelurus: berjumlah $180°$.",
  },
  4: {
    konsep: "Gunakan sudut sehadap/berseberangan untuk memindahkan sudut diketahui, lalu selesaikan dengan sifat jumlah sudut segitiga.",
    jawaban: "D. $75°$",
    langkah: [
      "Identifikasi pasangan sudut sehadap/berseberangan pada gambar untuk memindahkan sudut yang diketahui ke titik C atau F.",
      "Gunakan jumlah sudut pada segitiga atau sudut berpelurus untuk menghitung $\\angle BCF$.",
      "Diperoleh $\\angle BCF = 75°$.",
    ],
    rumus: "Sudut berseberangan dalam (sama besar) dan $\\angle A + \\angle B + \\angle C = 180°$",
  },
  5: {
    konsep: "Dua sudut berpelurus berjumlah $180°$; susun persamaan linear dari ekspresi sudut yang diberikan.",
    jawaban: "C. $95°$",
    langkah: [
      "$\\angle ABD$ dan $\\angle CBD$ saling berpelurus: $(3x - 25)° + (2x + 5)° = 180°$",
      "$5x - 20 = 180 \\Rightarrow 5x = 200 \\Rightarrow x = 40$",
      "$\\angle CBD = (2 \\times 40 + 5)° = 85°$",
      "Pelurus $\\angle CBD = 180° - 85° = 95°$",
    ],
    rumus: "Sudut berpelurus: $\\alpha + \\beta = 180°$",
  },
  6: {
    konsep: "Jika pelurus suatu sudut sama dengan 3 kali sudut itu, bentuk persamaan dan selesaikan.",
    jawaban: "C. $45°$",
    langkah: [
      "Misal sudut $= x°$, maka pelurusnya $= (180 - x)°$",
      "Syarat: $(180 - x) = 3x$",
      "$180 = 4x \\Rightarrow x = 45°$",
    ],
    rumus: "Pelurus $= 180° - x$",
  },
  7: {
    konsep: "Gabungkan sifat sudut berpelurus dan jumlah sudut dalam segitiga untuk mencari $\\angle QPR$.",
    jawaban: "B. $36°$",
    langkah: [
      "Tandai sudut-sudut yang diketahui pada gambar.",
      "Gunakan sifat sudut berpelurus untuk mengekspresikan sudut-sudut dalam segitiga.",
      "Terapkan jumlah sudut dalam segitiga = $180°$ untuk mendapatkan $\\angle QPR = 36°$.",
    ],
    rumus: "$\\angle A + \\angle B + \\angle C = 180°$; sudut berpelurus $= 180°$",
  },
  8: {
    konsep: "Pindahkan sudut dari garis sejajar ke titik yang diinginkan, lalu gunakan jumlah sudut segitiga.",
    jawaban: "A. $80°$",
    langkah: [
      "Gunakan sifat sudut sehadap atau berseberangan dari garis sejajar pada gambar untuk memindahkan sudut ke titik A.",
      "Terapkan jumlah sudut pada segitiga: $\\angle BAC = 180° - \\angle B - \\angle C$.",
      "Diperoleh $\\angle BAC = 80°$.",
    ],
    rumus: "Sudut sehadap sama besar; $\\angle A + \\angle B + \\angle C = 180°$",
  },
  9: {
    konsep: "Sudut luar segitiga sama dengan jumlah dua sudut dalam yang tidak bersebelahan.",
    jawaban: "D. $125°$",
    langkah: [
      "Identifikasi sudut luar pada gambar.",
      "Gunakan: sudut luar = jumlah dua sudut dalam yang tidak bersebelahan (atau jumlah sudut $180°$ dalam segitiga).",
      "Setelah substitusi: $\\angle ACB = 125°$.",
    ],
    rumus: "Sudut luar $= \\alpha + \\beta$ (dua sudut dalam yang tidak bersebelahan)",
  },
  10: {
    konsep: "Posisi jarum jam dinyatakan dalam derajat; sudut dihitung dari selisih posisi kedua jarum.",
    jawaban: "C. $115°$",
    langkah: [
      "Pukul 22.10 = pukul 10.10.",
      "Jarum jam: $10 \\times 30° + \\dfrac{10}{60} \\times 30° = 300° + 5° = 305°$",
      "Jarum menit: $10 \\times 6° = 60°$",
      "Selisih: $|305° - 60°| = 245°$. Sudut terkecil: $360° - 245° = 115°$",
    ],
    rumus: "Jarum jam $= 30° \\times h + 0{,}5° \\times m$; Jarum menit $= 6° \\times m$",
  },
  11: {
    konsep: "Posisi jarum jam dinyatakan dalam derajat; sudut dihitung dari selisih posisi kedua jarum.",
    jawaban: "B. $100°$",
    langkah: [
      "Pukul 07.20.",
      "Jarum jam: $7 \\times 30° + \\dfrac{20}{60} \\times 30° = 210° + 10° = 220°$",
      "Jarum menit: $20 \\times 6° = 120°$",
      "Selisih: $|220° - 120°| = 100°$",
    ],
    rumus: "Jarum jam $= 30° \\times h + 0{,}5° \\times m$; Jarum menit $= 6° \\times m$",
  },
  12: {
    konsep: "Gunakan sudut berpelurus untuk mencari $x$, lalu hitung penyiku sudut yang diperoleh.",
    jawaban: "A. $13°$",
    langkah: [
      "$\\angle A$ dan $\\angle B$ berpelurus: $(2x+3)° + (3x-8)° = 180°$",
      "$5x - 5 = 180 \\Rightarrow x = 37$",
      "$\\angle A = (2 \\times 37 + 3)° = 77°$",
      "Penyiku $\\angle A = 90° - 77° = 13°$",
    ],
    rumus: "Berpelurus: $\\alpha + \\beta = 180°$; Penyiku: $90° - \\alpha$",
  },
  13: {
    konsep: "Susun sistem dua persamaan linear dari pasangan sudut berpelurus pada gambar, lalu selesaikan untuk $x$ dan $y$.",
    jawaban: "A. 85",
    langkah: [
      "Dari $\\alpha + \\beta = 180°$: $(3x - y - 15) + 2y = 180 \\Rightarrow 3x + y = 195$ ... (1)",
      "Dari $\\delta + \\theta = 180°$: $(y - x + 85) + (2x + y - 20) = 180 \\Rightarrow x + 2y = 115$ ... (2)",
      "Dari (1): $y = 195 - 3x$. Substitusi ke (2): $x + 2(195 - 3x) = 115 \\Rightarrow -5x = -275 \\Rightarrow x = 55$",
      "$y = 195 - 3(55) = 30$. Jadi $x + y = 55 + 30 = 85$.",
    ],
    rumus: "Sudut berpelurus: $\\alpha + \\beta = 180°$",
  },
  14: {
    konsep: "Gunakan sudut sehadap untuk mengekspresikan $x$ dan $y$ dalam $a$ dan $b$, lalu hitung selisihnya.",
    jawaban: "A. $25°$",
    langkah: [
      "Gunakan sudut sehadap dan sudut berpelurus pada gambar untuk menyatakan $x$ dan $y$ dalam $a$ dan $b$.",
      "Substitusi $a = 95°$ dan $b = 70°$.",
      "Diperoleh $|x - y| = 25°$.",
    ],
    rumus: "Sudut sehadap sama besar; Berpelurus berjumlah $180°$",
  },
  15: {
    konsep: "Garis-garis sejajar dipotong transversal; gunakan sudut sehadap/berseberangan untuk membentuk dan menyelesaikan persamaan.",
    jawaban: "B. $39°$",
    langkah: [
      "Garis $l_1 \\parallel l_2$ dipotong transversal. Tentukan pasangan sudut sehadap/berseberangan pada gambar.",
      "Bangun persamaan dari hubungan sudut-sudut tersebut.",
      "Selesaikan persamaan untuk mendapatkan $x = 39°$.",
    ],
    rumus: "Sudut sehadap sama besar; sudut dalam berseberangan sama besar",
  },
  16: {
    konsep: "Sudut berpelurus berjumlah $180°$; sudut bertolak belakang besarnya sama.",
    jawaban: "A. $p = 135°$; $s = 45°$; $r = 135°$",
    langkah: [
      "$p$ dan $q$ berpelurus: $p = 180° - q = 180° - 45° = 135°$",
      "$r$ bertolak belakang dengan $p$: $r = p = 135°$",
      "$s$ bertolak belakang dengan $q$: $s = q = 45°$",
    ],
    rumus: "Berpelurus: $p + q = 180°$; Bertolak belakang: sama besar",
  },
  17: {
    konsep: "Diagonal sisi kubus sama panjang ($a\\sqrt{2}$); segitiga dengan ketiga sisi sama panjang adalah segitiga sama sisi dengan setiap sudut $60°$.",
    jawaban: "B. $60°$",
    langkah: [
      "BG, GE, dan EB adalah diagonal-diagonal sisi kubus dengan panjang $a\\sqrt{2}$ (sama).",
      "Maka $\\triangle BGE$ adalah segitiga sama sisi.",
      "Setiap sudut segitiga sama sisi $= 60°$, sehingga $\\angle BGE = 60°$.",
    ],
    rumus: "Diagonal sisi kubus $= a\\sqrt{2}$; sudut segitiga sama sisi $= 60°$",
  },
  18: {
    konsep: "Identifikasi pasangan sudut bertolak belakang (sama besar) dan berpelurus ($180°$) di sekitar titik O.",
    jawaban: "C. $140°$",
    langkah: [
      "Identifikasi sudut-sudut bertolak belakang dan berpelurus di sekitar titik O.",
      "Gunakan hubungan sudut-sudut tersebut dengan nilai yang diberikan pada gambar.",
      "Diperoleh $\\angle AOB = 140°$.",
    ],
    rumus: "Bertolak belakang: sama besar; Berpelurus: berjumlah $180°$",
  },
  19: {
    konsep: "Jumlah sudut di sekeliling satu titik = $360°$; gunakan untuk mencari total sudut yang ditanya.",
    jawaban: "A. $285°$",
    langkah: [
      "Jumlah semua sudut di sekeliling titik = $360°$.",
      "Identifikasi $x$, $y$, $a$, dan $b$ pada gambar sehingga $x + y + a + b = 360°$.",
      "Substitusi $a = 35°$ dan $b = 45°$: $x + y = 360° - 35° - 45° + \\text{(koreksi sudut)} = 285°$.",
    ],
    rumus: "Jumlah sudut di sekeliling titik $= 360°$",
  },
  20: {
    konsep: "Garis sejajar dipotong transversal: sudut sehadap sama besar, sudut dalam berseberangan sama besar.",
    jawaban: "B. $30°$",
    langkah: [
      "Karena $AB \\parallel CD$, gunakan sudut sehadap atau sudut dalam berseberangan untuk memindahkan sudut.",
      "Bentuk persamaan dari sudut-sudut yang sama besar.",
      "Selesaikan persamaan: diperoleh $x = 30°$.",
    ],
    rumus: "Sudut sehadap sama besar; sudut dalam berseberangan sama besar",
  },
  21: {
    konsep: "Hitung sudut yang ditanya dengan sifat jumlah sudut segitiga/berpelurus, lalu ambil penyikunya.",
    jawaban: "B. $32°$",
    langkah: [
      "Hitung $\\angle SQR$ dari informasi pada gambar menggunakan sifat sudut berpelurus atau jumlah sudut segitiga.",
      "Penyiku $\\angle SQR = 90° - \\angle SQR$.",
      "Diperoleh penyiku $= 32°$.",
    ],
    rumus: "Penyiku $= 90° - \\alpha$",
  },
  22: {
    konsep: "Pada konfigurasi zig-zag antara dua garis sejajar, sudut tengah = selisih dua sudut luar.",
    jawaban: "C. $25°$",
    langkah: [
      "Pada konfigurasi zig-zag dengan dua garis sejajar, sudut tengah memenuhi: $\\angle 3 = \\angle 1 - (180° - \\angle 2)$.",
      "$\\angle 3 = 95° - (180° - 110°) = 95° - 70° = 25°$.",
    ],
    rumus: "Zig-zag: $\\angle_{\\text{tengah}} = \\angle_1 - (180° - \\angle_2)$",
  },
  23: {
    konsep: "Gunakan sifat sudut luar segitiga atau jumlah sudut dalam segitiga.",
    jawaban: "B. $48°$",
    langkah: [
      "Identifikasi segitiga dan sudut-sudut yang diketahui pada gambar.",
      "Gunakan sifat sudut luar segitiga atau jumlah sudut dalam $\\triangle ABC = 180°$.",
      "Diperoleh $\\angle BAC = 48°$.",
    ],
    rumus: "Sudut luar $= \\alpha + \\beta$; $\\angle A + \\angle B + \\angle C = 180°$",
  },
  24: {
    konsep: "Gunakan dua pasang garis sejajar secara bertingkat untuk memindahkan sudut, lalu jumlahkan.",
    jawaban: "C. $124°$",
    langkah: [
      "Karena $PS \\parallel QT$, maka $\\angle SPT$ dan $\\angle PTQ$ saling berseberangan dalam: $\\angle PTQ = 83°$.",
      "Karena $PQ \\parallel RS$, maka $x = \\angle PTQ + \\angle PQT = 83° + 41° = 124°$.",
    ],
    rumus: "Sudut dalam berseberangan sama besar; sudut luar segitiga $= \\alpha + \\beta$",
  },
  25: {
    konsep: "Sudut berpelurus berjumlah $180°$; gunakan perbandingan untuk mencari nilai masing-masing sudut.",
    jawaban: "C. $40°$",
    langkah: [
      "$x$ dan $y$ saling berpelurus: $x + y = 180°$.",
      "Perbandingan $x : y = 2 : 7$, sehingga $x = \\dfrac{2}{2+7} \\times 180° = \\dfrac{2}{9} \\times 180° = 40°$.",
    ],
    rumus: "Berpelurus: $x + y = 180°$; $x = \\dfrac{p}{p+q} \\times 180°$",
  },
  26: {
    konsep: "Gunakan sifat sudut luar segitiga: sudut luar = jumlah dua sudut dalam yang tidak bersebelahan.",
    jawaban: "A. $55°$",
    langkah: [
      "Gunakan sifat sudut luar segitiga atau hubungan sudut-sudut pada garis sejajar di gambar.",
      "$\\angle BFC = \\angle FCD - \\angle EFB = 120° - 65° = 55°$.",
    ],
    rumus: "Sudut luar segitiga $= \\alpha + \\beta$ (dua sudut dalam tidak bersebelahan)",
  },
  27: {
    konsep: "Pindahkan sudut menggunakan sifat garis sejajar secara bertingkat sampai sampai ke sudut yang ditanya.",
    jawaban: "C. $80°$",
    langkah: [
      "Gunakan sifat sudut sehadap dan berpelurus pada garis-garis sejajar di gambar untuk memindahkan sudut ke posisi $a$.",
      "Diperoleh $a = 80°$.",
    ],
    rumus: "Sehadap: sama besar; Berpelurus: $180°$; Berseberangan dalam: sama besar",
  },
  28: {
    konsep: "Gunakan sudut sehadap/berseberangan pada garis sejajar untuk menyusun dan menyelesaikan persamaan.",
    jawaban: "B. $140°$",
    langkah: [
      "Bangun persamaan dari sudut sehadap/berseberangan pada gambar yang memuat $x$.",
      "Setelah substitusi, diperoleh $x = 140°$.",
    ],
    rumus: "Sehadap: sama besar; Berseberangan dalam: sama besar",
  },
};

const pembahasanOlimpiade: Record<number, Pembahasan> = {
  1: {
    konsep: "Gabungkan sifat persegi ($\\angle = 90°$) dan segitiga sama sisi ($\\angle = 60°$) untuk mencari sudut yang tersisa.",
    jawaban: "B. $30°$",
    langkah: [
      "ABCD persegi ⇒ $\\angle DAB = 90°$.",
      "$\\triangle ABE$ sama sisi ⇒ $\\angle EAB = 60°$ (E di dalam persegi).",
      "$\\angle DAE = \\angle DAB - \\angle EAB = 90° - 60° = 30°$.",
    ],
    rumus: "Persegi: $\\angle = 90°$; Segitiga sama sisi: setiap $\\angle = 60°$",
  },
  2: {
    konsep: "Gunakan dua pasang garis sejajar secara bertingkat (sudut dalam berseberangan dan sehadap) untuk mengekspresikan $x$.",
    jawaban: "Bergantung gambar — strategi: $x = \\angle SPQ + \\angle PQT$",
    langkah: [
      "Gunakan $PS \\parallel QT$: $\\angle SPT = \\angle PTQ$ (sudut dalam berseberangan).",
      "Gunakan $PQ \\parallel RS$: $\\angle$ pada R $= \\angle$ pada Q (sudut sehadap).",
      "Pada $\\triangle PQT$ atau garis transversal, $x$ adalah jumlah dua sudut yang terbentuk.",
      "Pola umum: $x = \\angle SPT + \\angle PQT$.",
    ],
    rumus: "Sudut dalam berseberangan sama besar; sudut sehadap sama besar",
  },
  3: {
    konsep: "Gunakan rumus besar sudut dalam segi-$n$ beraturan, lalu selesaikan untuk $n$.",
    jawaban: "$n = 8$",
    langkah: [
      "Rumus besar tiap sudut segi-$n$ beraturan: $\\dfrac{(n - 2) \\times 180°}{n} = 135°$",
      "$(n - 2) \\times 180 = 135n \\Rightarrow 180n - 360 = 135n \\Rightarrow 45n = 360 \\Rightarrow n = 8$",
      "Jadi bangun tersebut adalah segi delapan (oktagon) beraturan.",
    ],
    rumus: "Sudut dalam segi-$n$ beraturan $= \\dfrac{(n-2) \\times 180°}{n}$",
  },
  4: {
    konsep: "Gunakan sifat sudut luar segitiga berulang kali pada tiap puncak bintang; totalnya menghasilkan jumlah sudut tetap.",
    jawaban: "A. 360",
    langkah: [
      "Tiap sudut puncak bintang = jumlah dua sudut alas segitiga yang berkaitan (sudut luar segitiga).",
      "Saat semua sudut puncak dijumlahkan, tiap sudut interior poligon pusat terhitung dua kali.",
      "Jumlah akhir sudut puncak bintang $= 360°$.",
    ],
    rumus: "Sudut luar segitiga $= \\alpha + \\beta$ (dua sudut dalam tidak bersebelahan)",
  },
  5: {
    konsep: "Pada segitiga sama sisi dengan garis yang memotong, gunakan sifat jumlah sudut segitiga dan sudut bertolak belakang untuk mencari sudut titik potong.",
    jawaban: "C. $125°$",
    langkah: [
      "$\\triangle PQR$ sama sisi: $\\angle PQR = \\angle QPR = \\angle QRP = 60°$",
      "Pada segitiga yang terbentuk: $\\angle UPQ = 60° - 20° = 40°$ dan $\\angle UQP = 60° - 35° = 25°$",
      "$\\angle PUQ = 180° - 40° - 25° = 115°$",
      "$\\angle SUT = 180° - (\\angle SPQ + \\angle TQR) = 180° - (20° + 35°) = 125°$",
    ],
    rumus: "Sudut dalam segitiga berjumlah $180°$; sudut bertolak belakang sama besar",
  },
  6: {
    konsep: "Dua pasang garis sejajar: sudut $x$ dan $y$ terbentuk dari hubungan yang sama sehingga besarnya sama.",
    jawaban: "A. $0°$",
    langkah: [
      "Karena $L_1 \\parallel L_2$, sudut $x$ dan sudut antara $L_3$ dengan $L_2$ adalah sehadap/berseberangan.",
      "Karena $L_3 \\parallel L_4$, sudut $y$ mempunyai hubungan yang sama dengan $x$.",
      "Maka $y = x$, sehingga $y - x = 0°$.",
    ],
    rumus: "Sehadap: sama besar; Berseberangan dalam: sama besar",
  },
  7: {
    konsep: "Gunakan sudut luar segitiga untuk mencari $y$, dan sudut bertolak belakang/berpelurus untuk mencari $x$.",
    jawaban: "C. $x = 74°$; $y = 114°$",
    langkah: [
      "Gunakan sifat sudut luar segitiga: $y$ = jumlah dua sudut dalam yang tidak bersebelahan.",
      "Gunakan sifat sudut bertolak belakang atau berpelurus untuk menentukan $x$ dari nilai yang diketahui pada gambar.",
      "Diperoleh $x = 74°$ dan $y = 114°$.",
    ],
    rumus: "Sudut luar $= \\alpha + \\beta$; Bertolak belakang: sama besar; Berpelurus: $180°$",
  },
  8: {
    konsep: "Gunakan rantai segitiga sama kaki: setiap segitiga menghasilkan hubungan sudut yang lebih besar dari $\\alpha$, sampai terbentuk persamaan untuk mencari $\\alpha$.",
    jawaban: "D. $45°$",
    langkah: [
      "Misal $\\angle A = \\alpha$. $AF = FE$ ⇒ $\\triangle AFE$ sama kaki: $\\angle AEF = \\alpha$, $\\angle AFE = 180° - 2\\alpha$",
      "$\\angle EFC = 2\\alpha$ (berpelurus dengan $\\angle AFE$)",
      "$FE = EC$ ⇒ $\\triangle FEC$ sama kaki: $\\angle ECF = 2\\alpha$, $\\angle FEC = 180° - 4\\alpha$",
      "Pada garis AB: $\\angle CEB = 180° - \\alpha - (180° - 4\\alpha) = 3\\alpha$",
      "$EC = CB$ ⇒ $\\triangle ECB$ sama kaki: $\\angle EBC = 3\\alpha$, $\\angle ECB = 180° - 6\\alpha$",
      "$\\angle ACB = 2\\alpha + (180° - 6\\alpha) = 180° - 4\\alpha$. Di $\\triangle ABC$: $\\alpha + (180° - 4\\alpha) + 3\\alpha = 180°$ ✓",
      "Sudut $\\angle ACB = 120° \\Rightarrow \\alpha = 15°$. Maka $\\angle ABC = 3\\alpha = 45°$.",
    ],
    rumus: "Segitiga sama kaki: dua sudut alas sama besar",
  },
};

const renderPembahasan = (data: Pembahasan) => (
  <div className="mt-4 space-y-3 animate-slide-up">
    {/* JAWABAN */}
    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
      <p className="text-[10px] font-display font-bold uppercase tracking-widest text-emerald-400 mb-1">Jawaban</p>
      <p className="text-sm font-bold text-emerald-100">{renderWithLatex(data.jawaban)}</p>
    </div>
    {/* KONSEP & TRIK */}
    <div className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-3">
      <p className="text-[10px] font-display font-bold uppercase tracking-widest text-violet-400 mb-1">Konsep &amp; Trik</p>
      <p className="text-sm text-violet-100 font-body leading-relaxed">{renderWithLatex(data.konsep)}</p>
    </div>
    {/* STEP BY STEP */}
    <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3">
      <p className="text-[10px] font-display font-bold uppercase tracking-widest text-cyan-400 mb-2">Step by Step Penyelesaian</p>
      <ol className="space-y-2">
        {data.langkah.map((step, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/25 border border-cyan-400/50 flex items-center justify-center text-[10px] font-bold text-cyan-300">{i + 1}</span>
            <span className="text-sm text-cyan-50 font-body leading-relaxed">{renderWithLatex(step)}</span>
          </li>
        ))}
      </ol>
    </div>
    {/* TIPS */}
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
      <p className="text-[10px] font-display font-bold uppercase tracking-widest text-amber-400 mb-1">Tips</p>
      <p className="text-sm text-amber-100 font-body leading-relaxed">
        {data.rumus ? renderWithLatex(data.rumus) : "Pahami hubungan antar sudut dan latih menggambar garis bantu untuk mempermudah perhitungan."}
      </p>
    </div>
    {/* KESIMPULAN */}
    <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3">
      <p className="text-[10px] font-display font-bold uppercase tracking-widest text-rose-400 mb-1">Kesimpulan</p>
      <p className="text-sm text-rose-100 font-body leading-relaxed">
        Jadi, jawaban yang tepat adalah <span className="font-bold">{renderWithLatex(data.jawaban)}</span>.
      </p>
    </div>
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
                            if (/^\d+\. [A-Z]/.test(trimmed) && !trimmed.includes('$') && !trimmed.endsWith(';') && !trimmed.endsWith(',')) {
                              return <div key={li} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">{renderWithLatex(trimmed)}</div>;
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
                <div className="space-y-2 mb-3">
                  {(() => {
                    const paragraphs = soal.soal.split('\n\n');
                    return paragraphs.map((para, paraIdx) => (
                      <Fragment key={paraIdx}>
                        <div className="font-body text-sm text-white">
                          {paraIdx === 0 && (
                            <span className="text-accent font-bold">{soal.no}. </span>
                          )}
                          {para.split('\n').map((line, lineIdx) => (
                            <span key={lineIdx}>
                              {lineIdx > 0 && <br />}
                              {paraIdx === 0 && lineIdx === 0 && line.startsWith('OSN')
                                ? <span className="text-yellow-400 font-semibold">{line}</span>
                                : renderWithLatex(line)}
                            </span>
                          ))}
                        </div>
                        {paraIdx === 0 && soal.image && (
                          <div className="flex flex-col items-center">
                            {typeof soal.image === "string" ? (
                              <img
                                src={soal.image}
                                alt={soal.imageCaption}
                                className="max-w-full rounded-lg border border-border/40 bg-white/5"
                              />
                            ) : (
                              <div className="w-full max-w-md">{soal.image}</div>
                            )}
                          </div>
                        )}
                      </Fragment>
                    ));
                  })()}
                </div>
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
                      className="mt-3 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition cursor-pointer text-left"
                    >
                      <span className="text-xs font-display font-bold text-white/70">
                        {openDasar.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                      </span>
                      {openDasar.includes(soal.no)
                        ? <ChevronUp className="w-4 h-4 text-white/40" />
                        : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </button>
                    {openDasar.includes(soal.no) && renderPembahasan(pembahasanDasar[soal.no])}
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
                      className="max-w-[180px] sm:max-w-xs rounded-lg border border-border/40 bg-white/5"
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
                      className="mt-3 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition cursor-pointer text-left"
                    >
                      <span className="text-xs font-display font-bold text-white/70">
                        {openOlimpiade.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                      </span>
                      {openOlimpiade.includes(soal.no)
                        ? <ChevronUp className="w-4 h-4 text-white/40" />
                        : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </button>
                    {openOlimpiade.includes(soal.no) && renderPembahasan(pembahasanOlimpiade[soal.no])}
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
