import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Circle, ChevronDown, ChevronUp } from "lucide-react";
import CircleDiagram, { CircleDiagramProps } from "./CircleDiagram";

type Part = { label: string; math?: string; text?: string };
type Ans = { label: string; math?: string; text?: string };
type Diff = "Mudah" | "Sedang" | "Sulit" | "HOTS";
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: CircleDiagramProps;
  answers?: Ans[];
  diff?: Diff;
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const diffColor: Record<Diff, string> = {
  Mudah: "text-green-400 bg-green-500/10 border-green-500/30",
  Sedang: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  Sulit: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  HOTS: "text-red-400 bg-red-500/10 border-red-500/30",
};

const questions: Q[] = [
  Q(1, "Mengenal Unsur Lingkaran", {
    type: "mixed", diff: "Mudah",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 90, label: "A", color: "#f472b6" },
        { angle: 210, label: "B", color: "#f472b6" },
        { angle: 330, label: "C", color: "#34d399" },
      ],
      radii: [{ angle: 90, color: "#60a5fa", label: "r" }],
      chords: [{ angle1: 210, angle2: 330, color: "#fb923c", label: "BC" }],
    },
    parts: [
      { label: "a.", text: "Sebutkan nama unsur OA pada gambar." },
      { label: "b.", text: "Garis BC disebut apakah? Jelaskan definisinya." },
      { label: "c.", text: "Sebutkan semua unsur lingkaran yang kamu ketahui!" },
    ],
    answers: [
      { label: "a.", text: "OA adalah jari-jari (radius) lingkaran — garis dari pusat O ke titik A pada lingkaran." },
      { label: "b.", text: "BC disebut tali busur (chord) — garis lurus yang menghubungkan dua titik pada lingkaran tanpa melalui pusat." },
      { label: "c.", text: "Unsur lingkaran: jari-jari, diameter, busur (minor & mayor), tali busur, apotema, juring (sektor), tembereng, sudut pusat, sudut keliling." },
    ],
  }),

  Q(2, "Jari-Jari dan Diameter", {
    type: "mixed", diff: "Mudah",
    diagram: {
      size: 250, r: 0.62,
      radii: [
        { angle: 0, color: "#60a5fa", label: "r" },
        { angle: 180, color: "#60a5fa", label: "r", toEdge: true },
      ],
      pts: [
        { angle: 0, label: "A", color: "#f472b6" },
        { angle: 180, label: "B", color: "#f472b6" },
      ],
      extraTexts: [{ x: 130, y: 240, text: "AB = diameter", color: "rgba(248,113,163,0.8)", size: 11, bold: true }],
    },
    parts: [
      { label: "a.", text: "Apa hubungan antara jari-jari (r) dan diameter (d) lingkaran?" },
      { label: "b.", math: "\\text{Jika } r = 7 \\text{ cm, tentukan nilai } d." },
      { label: "c.", math: "\\text{Jika } d = 30 \\text{ cm, tentukan nilai } r." },
    ],
    answers: [
      { label: "a.", math: "d = 2r \\text{ (diameter = 2 × jari-jari)}" },
      { label: "b.", math: "d = 2 \\times 7 = 14 \\text{ cm}" },
      { label: "c.", math: "r = 30 \\div 2 = 15 \\text{ cm}" },
    ],
  }),

  Q(3, "Busur Lingkaran", {
    type: "mixed", diff: "Mudah",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 150, label: "P", color: "#facc15" },
        { angle: 30, label: "Q", color: "#facc15" },
      ],
      arcs: [{ startAngle: 150, endAngle: 30, color: "#facc15", width: 4 }],
      extraTexts: [{ x: 130, y: 30, text: "busur PQ", color: "#facc15", size: 10, bold: true }],
    },
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan busur lingkaran?" },
      { label: "b.", text: "Sebutkan perbedaan antara busur minor dan busur mayor!" },
      { label: "c.", text: "Pada gambar di atas, manakah busur minor PQ? Jelaskan." },
    ],
    answers: [
      { label: "a.", text: "Busur lingkaran adalah bagian dari garis lengkung (keliling) lingkaran yang menghubungkan dua titik pada lingkaran." },
      { label: "b.", text: "Busur minor: bagian busur yang lebih pendek (sudut pusat < 180°). Busur mayor: bagian busur yang lebih panjang (sudut pusat > 180°)." },
      { label: "c.", text: "Busur minor PQ adalah yang ditandai/diarsir (busur yang lebih pendek antara P dan Q)." },
    ],
  }),

  Q(4, "Tali Busur (Chord)", {
    type: "mixed", diff: "Mudah",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 130, label: "C", color: "#f472b6" },
        { angle: 310, label: "D", color: "#f472b6" },
        { angle: 50, label: "E", color: "#fb923c" },
        { angle: 230, label: "F", color: "#fb923c" },
      ],
      chords: [
        { angle1: 130, angle2: 310, color: "#f472b6", label: "CD" },
        { angle1: 50, angle2: 230, color: "#fb923c", label: "EF" },
      ],
    },
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan tali busur?" },
      { label: "b.", text: "Apakah diameter juga merupakan tali busur? Mengapa?" },
      { label: "c.", text: "Tali busur mana yang lebih panjang, CD atau EF? Jelaskan caramu menentukan." },
    ],
    answers: [
      { label: "a.", text: "Tali busur adalah garis lurus yang menghubungkan dua titik pada lingkaran." },
      { label: "b.", text: "Ya, diameter adalah tali busur terpanjang karena menghubungkan dua titik pada lingkaran dan melalui pusat." },
      { label: "c.", text: "CD lebih panjang dari EF jika CD lebih dekat ke pusat dibanding EF. Semakin dekat tali busur ke pusat, semakin panjang tali busurnya." },
    ],
  }),

  Q(5, "Apotema Lingkaran", {
    type: "mixed", diff: "Sedang",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 120, label: "A", color: "#f472b6" },
        { angle: 60, label: "B", color: "#f472b6" },
      ],
      chords: [{ angle1: 120, angle2: 60, color: "#f472b6", label: "AB" }],
      extraLines: (() => {
        const s = 250; const r = 0.62; const R = (s / 2) * r;
        const cx = s / 2; const cy = s / 2;
        const a1 = (120 * Math.PI) / 180; const a2 = (60 * Math.PI) / 180;
        const x1 = cx + R * Math.cos(a1); const y1 = cy - R * Math.sin(a1);
        const x2 = cx + R * Math.cos(a2); const y2 = cy - R * Math.sin(a2);
        const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2;
        return [{ x1: cx, y1: cy, x2: mx, y2: my, color: "#a78bfa", label: "apotema" }];
      })(),
    },
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan apotema lingkaran?" },
      { label: "b.", text: "Apotema adalah jarak dari pusat lingkaran ke ... ?" },
      { label: "c.", text: "Apakah apotema lebih panjang atau lebih pendek dari jari-jari? Mengapa?" },
    ],
    answers: [
      { label: "a.", text: "Apotema adalah jarak tegak lurus dari pusat lingkaran ke tali busur." },
      { label: "b.", text: "Apotema adalah jarak dari pusat lingkaran ke TALI BUSUR (tegak lurus)." },
      { label: "c.", text: "Apotema LEBIH PENDEK dari jari-jari, karena apotema = kaki segitiga siku-siku sedangkan jari-jari = hipotenusa (sisi terpanjang)." },
    ],
  }),

  Q(6, "Juring (Sektor) Lingkaran", {
    type: "mixed", diff: "Mudah",
    diagram: {
      size: 250, r: 0.62,
      sectors: [{ startAngle: 60, endAngle: 150, fillColor: "rgba(250,204,21,0.25)", strokeColor: "#facc15", label: "Juring" }],
      radii: [
        { angle: 60, color: "#facc15" },
        { angle: 150, color: "#facc15" },
      ],
      pts: [
        { angle: 60, label: "A", color: "#facc15" },
        { angle: 150, label: "B", color: "#facc15" },
      ],
      angleArcs: [{ vertex: [125, 125], from: 60, to: 150, color: "#facc15", label: "α", arcR: 28 }],
    },
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan juring (sektor) lingkaran?" },
      { label: "b.", text: "Unsur apa saja yang membatasi juring OAB?" },
      { label: "c.", text: "Jika sudut pusat α = 90°, berapa bagian lingkaran yang merupakan juring tersebut?" },
    ],
    answers: [
      { label: "a.", text: "Juring (sektor) adalah daerah lingkaran yang dibatasi oleh dua jari-jari dan satu busur." },
      { label: "b.", text: "Juring OAB dibatasi oleh: jari-jari OA, jari-jari OB, dan busur AB." },
      { label: "c.", math: "\\frac{90°}{360°} = \\frac{1}{4} \\text{ bagian dari luas lingkaran}" },
    ],
  }),

  Q(7, "Tembereng Lingkaran", {
    type: "mixed", diff: "Sedang",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 150, label: "P", color: "#34d399" },
        { angle: 30, label: "Q", color: "#34d399" },
      ],
      sectors: [{ startAngle: 30, endAngle: 150, fillColor: "rgba(52,211,153,0.15)", strokeColor: "none" }],
      chords: [{ angle1: 150, angle2: 30, color: "#34d399" }],
      arcs: [{ startAngle: 150, endAngle: 30, color: "#34d399", width: 3 }],
      extraTexts: [{ x: 125, y: 55, text: "Tembereng", color: "#34d399", size: 10, bold: true }],
    },
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan tembereng lingkaran?" },
      { label: "b.", text: "Apa perbedaan antara tembereng dan juring?" },
      { label: "c.", text: "Sebutkan unsur apa saja yang membatasi tembereng PQ!" },
    ],
    answers: [
      { label: "a.", text: "Tembereng adalah daerah lingkaran yang dibatasi oleh sebuah tali busur dan sebuah busur." },
      { label: "b.", text: "Juring: dibatasi 2 jari-jari + 1 busur (bentuk seperti potongan kue). Tembereng: dibatasi 1 tali busur + 1 busur (tidak melewati pusat)." },
      { label: "c.", text: "Tembereng PQ dibatasi oleh: tali busur PQ dan busur minor PQ." },
    ],
  }),

  Q(8, "Sudut Pusat Lingkaran", {
    type: "mixed", diff: "Sedang",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 70, label: "A", color: "#f472b6" },
        { angle: 160, label: "B", color: "#f472b6" },
      ],
      radii: [
        { angle: 70, color: "#f472b6" },
        { angle: 160, color: "#f472b6" },
      ],
      angleArcs: [{ vertex: [125, 125], from: 70, to: 160, color: "#f472b6", label: "∠AOB", arcR: 28 }],
    },
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan sudut pusat?" },
      { label: "b.", text: "Titik sudut dari sudut pusat ∠AOB berada di mana?" },
      { label: "c.", math: "\\text{Jika } \\angle AOB = 70°, \\text{ tentukan besar busur AB (dalam derajat).}" },
    ],
    answers: [
      { label: "a.", text: "Sudut pusat adalah sudut yang titik sudutnya berada di pusat lingkaran dan kaki-kakinya adalah jari-jari lingkaran." },
      { label: "b.", text: "Titik sudut ∠AOB berada di pusat lingkaran (titik O)." },
      { label: "c.", math: "\\text{Besar busur AB} = \\angle AOB = 70°" },
    ],
  }),

  Q(9, "Menghitung Jari-Jari dari Diameter", {
    type: "mixed", diff: "Mudah",
    content: "Diketahui sebuah lingkaran dengan diameter-diameter berikut. Tentukan jari-jarinya!",
    parts: [
      { label: "a.", math: "d = 14 \\text{ cm}" },
      { label: "b.", math: "d = 21 \\text{ cm}" },
      { label: "c.", math: "d = 50 \\text{ cm}" },
      { label: "d.", math: "d = 3{,}5 \\text{ cm}" },
    ],
    answers: [
      { label: "a.", math: "r = 14 \\div 2 = 7 \\text{ cm}" },
      { label: "b.", math: "r = 21 \\div 2 = 10{,}5 \\text{ cm}" },
      { label: "c.", math: "r = 50 \\div 2 = 25 \\text{ cm}" },
      { label: "d.", math: "r = 3{,}5 \\div 2 = 1{,}75 \\text{ cm}" },
    ],
  }),

  Q(10, "Menghitung Diameter dari Jari-Jari", {
    type: "mixed", diff: "Mudah",
    content: "Diketahui sebuah lingkaran dengan jari-jari berikut. Tentukan diameternya!",
    parts: [
      { label: "a.", math: "r = 7 \\text{ cm}" },
      { label: "b.", math: "r = 15 \\text{ cm}" },
      { label: "c.", math: "r = 4{,}5 \\text{ cm}" },
      { label: "d.", math: "r = 28 \\text{ cm}" },
    ],
    answers: [
      { label: "a.", math: "d = 2 \\times 7 = 14 \\text{ cm}" },
      { label: "b.", math: "d = 2 \\times 15 = 30 \\text{ cm}" },
      { label: "c.", math: "d = 2 \\times 4{,}5 = 9 \\text{ cm}" },
      { label: "d.", math: "d = 2 \\times 28 = 56 \\text{ cm}" },
    ],
  }),

  Q(11, "Mengidentifikasi Unsur dari Gambar", {
    type: "mixed", diff: "Mudah",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 90, label: "A", color: "#f472b6" },
        { angle: 200, label: "B", color: "#fb923c" },
        { angle: 330, label: "C", color: "#34d399" },
        { angle: 0, label: "D", color: "#60a5fa" },
      ],
      radii: [{ angle: 90, color: "#f472b6" }, { angle: 200, color: "#fb923c" }],
      chords: [{ angle1: 330, angle2: 0, color: "#34d399" }],
    },
    parts: [
      { label: "a.", text: "Sebutkan semua jari-jari yang ada pada gambar!" },
      { label: "b.", text: "Apakah garis CD merupakan diameter? Mengapa?" },
      { label: "c.", text: "Garis CD merupakan unsur apa dalam lingkaran?" },
    ],
    answers: [
      { label: "a.", text: "Jari-jari: OA dan OB (garis dari pusat O ke titik A dan B pada lingkaran)." },
      { label: "b.", text: "Tidak. CD bukan diameter karena tidak melalui pusat O dan panjangnya lebih kecil dari diameter." },
      { label: "c.", text: "CD merupakan tali busur (chord)." },
    ],
  }),

  Q(12, "Titik-Titik pada Lingkaran", {
    type: "mixed", diff: "Mudah",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 45, label: "P", color: "#facc15" },
        { angle: 135, label: "Q", color: "#facc15" },
        { angle: 225, label: "R", color: "#facc15" },
        { angle: 315, label: "S", color: "#facc15" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik P, Q, R, S berada di mana? (di dalam, di luar, atau pada lingkaran)" },
      { label: "b.", text: "Apa perbedaan titik yang berada PADA lingkaran dengan titik di DALAM lingkaran?" },
      { label: "c.", text: "Hubungkan P-R dan Q-S. Apakah kedua garis tersebut merupakan diameter? Jelaskan." },
    ],
    answers: [
      { label: "a.", text: "P, Q, R, S semuanya berada PADA lingkaran (di garis keliling lingkaran)." },
      { label: "b.", text: "Titik PADA lingkaran: jaraknya ke pusat = r (tepat di keliling). Titik DI DALAM lingkaran: jaraknya ke pusat < r." },
      { label: "c.", text: "Ya. PR dan QS keduanya merupakan diameter karena menghubungkan titik-titik yang berhadapan dan melalui pusat O (sudut 45°+225°=diameter, 135°+315°=diameter)." },
    ],
  }),

  Q(13, "Banyak Diameter dan Jari-Jari", {
    type: "mixed", diff: "Sedang",
    content: "Dalam sebuah lingkaran dengan pusat O, terdapat titik-titik A, B, C, D pada lingkaran. Garis AB dan CD keduanya melalui pusat O.",
    parts: [
      { label: "a.", text: "Berapa banyak diameter yang dapat dibuat dalam sebuah lingkaran?" },
      { label: "b.", text: "Berapa banyak jari-jari yang dapat dibuat dalam sebuah lingkaran?" },
      { label: "c.", text: "Mengapa semua jari-jari dalam satu lingkaran memiliki panjang yang sama?" },
    ],
    answers: [
      { label: "a.", text: "Tak terhingga banyak diameter yang dapat dibuat, karena dapat ditarik dari berbagai arah melalui pusat." },
      { label: "b.", text: "Tak terhingga banyak jari-jari yang dapat dibuat." },
      { label: "c.", text: "Karena jari-jari adalah jarak dari pusat ke titik pada lingkaran, dan semua titik pada lingkaran berjarak sama ke pusat (inilah definisi lingkaran)." },
    ],
  }),

  Q(14, "Perbandingan Panjang Jari-Jari", {
    type: "mixed", diff: "Sedang",
    content: "Dua lingkaran masing-masing berjari-jari 5 cm dan 8 cm.",
    parts: [
      { label: "a.", text: "Berapakah perbandingan jari-jari kedua lingkaran?" },
      { label: "b.", text: "Berapakah perbandingan diameter kedua lingkaran?" },
      { label: "c.", text: "Apakah perbandingan jari-jari sama dengan perbandingan diameter? Mengapa?" },
    ],
    answers: [
      { label: "a.", math: "r_1 : r_2 = 5 : 8" },
      { label: "b.", math: "d_1 : d_2 = 10 : 16 = 5 : 8" },
      { label: "c.", text: "Ya, perbandingannya sama karena d = 2r, sehingga rasio d₁:d₂ = 2r₁:2r₂ = r₁:r₂." },
    ],
  }),

  Q(15, "Unsur Lingkaran — Benar atau Salah", {
    type: "mixed", diff: "Sedang",
    content: "Tentukan pernyataan berikut BENAR (B) atau SALAH (S)!",
    parts: [
      { label: "(1)", text: "Diameter adalah tali busur terpanjang dalam suatu lingkaran." },
      { label: "(2)", text: "Apotema lebih panjang dari jari-jari." },
      { label: "(3)", text: "Juring dibatasi oleh dua jari-jari dan satu busur." },
      { label: "(4)", text: "Tembereng dibatasi oleh dua jari-jari dan satu busur." },
      { label: "(5)", text: "Semua tali busur dalam satu lingkaran memiliki panjang yang sama." },
    ],
    answers: [
      { label: "(1)", text: "BENAR — Diameter melewati pusat sehingga merupakan tali busur terpanjang." },
      { label: "(2)", text: "SALAH — Apotema LEBIH PENDEK dari jari-jari (apotema = kaki, jari-jari = hipotenusa)." },
      { label: "(3)", text: "BENAR — Juring dibatasi 2 jari-jari + 1 busur." },
      { label: "(4)", text: "SALAH — Tembereng dibatasi 1 tali busur + 1 busur (bukan 2 jari-jari)." },
      { label: "(5)", text: "SALAH — Panjang tali busur bergantung pada jaraknya ke pusat." },
    ],
  }),

  Q(16, "Unsur-Unsur Lingkaran Lengkap", {
    type: "mixed", diff: "Sedang",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 120, label: "A", color: "#f472b6" },
        { angle: 60, label: "B", color: "#f472b6" },
        { angle: 210, label: "C", color: "#fb923c" },
        { angle: 300, label: "D", color: "#34d399" },
      ],
      radii: [
        { angle: 120, color: "#f472b6" },
        { angle: 60, color: "#f472b6" },
      ],
      chords: [
        { angle1: 120, angle2: 60, color: "#f472b6" },
        { angle1: 210, angle2: 300, color: "#34d399" },
      ],
      sectors: [{ startAngle: 60, endAngle: 120, fillColor: "rgba(248,113,163,0.15)", label: "Juring OAB" }],
    },
    parts: [
      { label: "a.", text: "Sebutkan semua unsur lingkaran pada gambar di atas!" },
      { label: "b.", text: "Manakah yang merupakan tali busur? (bukan diameter)" },
      { label: "c.", text: "Daerah yang diarsir disebut apa?" },
    ],
    answers: [
      { label: "a.", text: "Unsur pada gambar: pusat O, jari-jari OA & OB, tali busur AB & CD, titik A, B, C, D, juring OAB, busur-busur." },
      { label: "b.", text: "AB dan CD adalah tali busur (bukan diameter karena tidak melewati pusat O)." },
      { label: "c.", text: "Daerah yang diarsir disebut juring OAB." },
    ],
  }),

  Q(17, "Panjang Tali Busur — Konsep", {
    type: "mixed", diff: "Sulit",
    content: "Perhatikan dua tali busur KL dan MN dalam satu lingkaran berjari-jari 10 cm. Jarak tali busur KL dari pusat adalah 6 cm, dan jarak tali busur MN dari pusat adalah 8 cm.",
    parts: [
      { label: "a.", text: "Hitung panjang setengah tali busur KL menggunakan Teorema Pythagoras." },
      { label: "b.", text: "Hitung panjang setengah tali busur MN." },
      { label: "c.", text: "Kesimpulan: Semakin jauh tali busur dari pusat, semakin ... panjangnya." },
    ],
    answers: [
      { label: "a.", math: "\\frac{1}{2}KL = \\sqrt{10^2 - 6^2} = \\sqrt{64} = 8 \\text{ cm} \\Rightarrow KL = 16 \\text{ cm}" },
      { label: "b.", math: "\\frac{1}{2}MN = \\sqrt{10^2 - 8^2} = \\sqrt{36} = 6 \\text{ cm} \\Rightarrow MN = 12 \\text{ cm}" },
      { label: "c.", text: "Semakin jauh tali busur dari pusat, semakin PENDEK panjangnya." },
    ],
  }),

  Q(18, "Sudut Pusat dan Busur", {
    type: "mixed", diff: "Sedang",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 50, label: "A", color: "#60a5fa" },
        { angle: 170, label: "B", color: "#60a5fa" },
      ],
      radii: [
        { angle: 50, color: "#60a5fa" },
        { angle: 170, color: "#60a5fa" },
      ],
      arcs: [{ startAngle: 170, endAngle: 50, color: "#60a5fa", width: 3 }],
      angleArcs: [{ vertex: [125, 125], from: 50, to: 170, color: "#60a5fa", label: "120°", arcR: 28 }],
    },
    parts: [
      { label: "a.", text: "Berapakah besar busur AB (dalam derajat)?" },
      { label: "b.", text: "Berapakah besar busur AB yang TIDAK diarsir (busur mayor AB)?" },
      { label: "c.", math: "\\text{Jika } r = 14 \\text{ cm dan } \\angle AOB = 120°, \\text{ berapakah besar busur minor AB?}" },
    ],
    answers: [
      { label: "a.", text: "Besar busur AB = 120° (sama besar dengan sudut pusatnya)." },
      { label: "b.", math: "\\text{Busur mayor AB} = 360° - 120° = 240°" },
      { label: "c.", text: "Besar busur minor AB = 120° (dalam satuan derajat, besar busur = besar sudut pusatnya)." },
    ],
  }),

  Q(19, "Keliling Lingkaran sebagai Busur Penuh", {
    type: "mixed", diff: "Mudah",
    content: "Satu lingkaran penuh dianggap busur 360°.",
    parts: [
      { label: "a.", math: "\\text{Busur setengah lingkaran (busur 180°) = } \\ldots \\text{ bagian dari keliling}" },
      { label: "b.", math: "\\text{Busur seperempat lingkaran (busur 90°) = } \\ldots \\text{ bagian dari keliling}" },
      { label: "c.", math: "\\text{Busur dengan sudut } 60° = \\ldots \\text{ bagian dari keliling}" },
    ],
    answers: [
      { label: "a.", math: "\\frac{180°}{360°} = \\frac{1}{2} \\text{ bagian keliling}" },
      { label: "b.", math: "\\frac{90°}{360°} = \\frac{1}{4} \\text{ bagian keliling}" },
      { label: "c.", math: "\\frac{60°}{360°} = \\frac{1}{6} \\text{ bagian keliling}" },
    ],
  }),

  Q(20, "Mengidentifikasi Juring dan Tembereng", {
    type: "mixed", diff: "Sedang",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 160, label: "A", color: "#facc15" },
        { angle: 20, label: "B", color: "#facc15" },
      ],
      radii: [{ angle: 160, color: "#facc15" }, { angle: 20, color: "#facc15" }],
      chords: [{ angle1: 160, angle2: 20, color: "#f472b6" }],
      sectors: [{ startAngle: 20, endAngle: 160, fillColor: "rgba(250,204,21,0.18)", label: "I" }],
      extraTexts: [{ x: 125, y: 195, text: "II", color: "#f472b6", size: 12, bold: true }],
    },
    parts: [
      { label: "a.", text: "Daerah I (diarsir dengan OA dan OB) disebut apa?" },
      { label: "b.", text: "Daerah II (di bawah tali busur AB) disebut apa?" },
      { label: "c.", text: "Apa perbedaan daerah I dan daerah II?" },
    ],
    answers: [
      { label: "a.", text: "Daerah I disebut JURING OAB (dibatasi 2 jari-jari + busur)." },
      { label: "b.", text: "Daerah II disebut TEMBERENG AB (dibatasi tali busur AB + busur minor AB)." },
      { label: "c.", text: "Juring: meliputi pusat O, dibatasi 2 jari-jari + busur. Tembereng: tidak meliputi pusat, dibatasi tali busur + busur." },
    ],
  }),

  Q(21, "Soal UN — Menentukan Unsur", {
    type: "mixed", diff: "Sedang",
    content: "Dari titik O sebagai pusat lingkaran, ditarik garis ke titik A pada lingkaran sepanjang 5 cm, dan ditarik garis ke titik B pada lingkaran sepanjang 5 cm. Garis AB = 8 cm.",
    parts: [
      { label: "a.", text: "Apakah AB merupakan diameter? Buktikan!" },
      { label: "b.", text: "Berapa panjang apotema dari AB?" },
      { label: "c.", text: "Apa nama garis AB?" },
    ],
    answers: [
      { label: "a.", text: "Bukan diameter. Diameter = 2r = 2×5 = 10 cm ≠ 8 cm = AB. Jadi AB bukan diameter." },
      { label: "b.", math: "\\text{Apotema} = \\sqrt{5^2 - 4^2} = \\sqrt{25-16} = \\sqrt{9} = 3 \\text{ cm}" },
      { label: "c.", text: "AB adalah tali busur (chord)." },
    ],
  }),

  Q(22, "Menentukan Besar Busur dari Sudut", {
    type: "mixed", diff: "Sedang",
    content: "Lingkaran dengan pusat O dan jari-jari 10 cm. Titik A dan B pada lingkaran sehingga ∠AOB = 72°.",
    parts: [
      { label: "a.", math: "\\text{Tentukan besar busur minor AB (dalam } \\degree)." },
      { label: "b.", math: "\\text{Tentukan besar busur mayor AB (dalam } \\degree)." },
      { label: "c.", text: "Apakah sudut pusat sama besarnya dengan busur yang dihadapinya? Jelaskan." },
    ],
    answers: [
      { label: "a.", math: "\\text{Busur minor AB} = \\angle AOB = 72°" },
      { label: "b.", math: "\\text{Busur mayor AB} = 360° - 72° = 288°" },
      { label: "c.", text: "Ya. Besar busur (dalam derajat) sama dengan besar sudut pusat yang menghadapinya. Ini adalah sifat dasar lingkaran." },
    ],
  }),

  Q(23, "Perbandingan Unsur Dua Lingkaran", {
    type: "mixed", diff: "Sedang",
    content: "Lingkaran A berjari-jari 6 cm. Lingkaran B berjari-jari 9 cm.",
    parts: [
      { label: "a.", text: "Berapakah perbandingan jari-jari A : B?" },
      { label: "b.", text: "Berapakah perbandingan diameter A : B?" },
      { label: "c.", text: "Jika panjang tali busur tertentu pada lingkaran A adalah 8 cm, apakah panjang tali busur yang bersesuaian pada lingkaran B pasti 12 cm? Jelaskan!" },
    ],
    answers: [
      { label: "a.", math: "r_A : r_B = 6 : 9 = 2 : 3" },
      { label: "b.", math: "d_A : d_B = 12 : 18 = 2 : 3" },
      { label: "c.", text: "Ya, jika posisi relatif tali busur (jarak ke pusat) pada kedua lingkaran sebanding (2:3), maka panjang tali busurnya juga berbanding 2:3, yaitu 8:12." },
    ],
  }),

  Q(24, "Lingkaran Sepusat (Konsentris)", {
    type: "mixed", diff: "Sedang",
    diagram: {
      size: 250,
      extraCircles: [
        { cx: 125, cy: 125, r: 40, color: "#60a5fa", strokeWidth: 1.5 },
        { cx: 125, cy: 125, r: 70, color: "#34d399", strokeWidth: 1.5 },
      ],
      showCenter: true, centerLabel: "O",
    },
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan lingkaran sepusat (konsentris)?" },
      { label: "b.", text: "Daerah di antara dua lingkaran tersebut disebut apa?" },
      { label: "c.", math: "\\text{Jika } r_1 = 7 \\text{ cm dan } r_2 = 14 \\text{ cm, hitunglah selisih panjang jari-jarinya.}" },
    ],
    answers: [
      { label: "a.", text: "Lingkaran sepusat (konsentris) adalah dua atau lebih lingkaran yang mempunyai pusat yang sama." },
      { label: "b.", text: "Daerah di antara dua lingkaran konsentris disebut annulus (cincin/gelang)." },
      { label: "c.", math: "r_2 - r_1 = 14 - 7 = 7 \\text{ cm}" },
    ],
  }),

  Q(25, "Soal ANBK — Pasangkan", {
    type: "mixed", diff: "Mudah",
    content: "Pasangkan istilah berikut dengan definisinya yang tepat!",
    parts: [
      { label: "(1)", text: "Busur ← → a. daerah yang dibatasi oleh dua jari-jari dan satu busur" },
      { label: "(2)", text: "Tali busur ← → b. garis lengkung yang merupakan bagian dari keliling lingkaran" },
      { label: "(3)", text: "Juring ← → c. garis lurus yang menghubungkan dua titik pada lingkaran" },
      { label: "(4)", text: "Apotema ← → d. jarak tegak lurus dari pusat ke tali busur" },
    ],
    answers: [
      { label: "(1)", text: "Busur → b. garis lengkung bagian dari keliling lingkaran" },
      { label: "(2)", text: "Tali busur → c. garis lurus menghubungkan dua titik pada lingkaran" },
      { label: "(3)", text: "Juring → a. daerah dibatasi dua jari-jari dan satu busur" },
      { label: "(4)", text: "Apotema → d. jarak tegak lurus dari pusat ke tali busur" },
    ],
  }),

  Q(26, "Unsur Lingkaran — Melengkapi Kalimat", {
    type: "mixed", diff: "Mudah",
    content: "Lengkapi kalimat berikut dengan kata yang tepat!",
    parts: [
      { label: "a.", text: "Titik O disebut ______ lingkaran." },
      { label: "b.", text: "Garis OA dengan A pada lingkaran disebut ______." },
      { label: "c.", text: "Tali busur yang melalui pusat lingkaran disebut ______." },
      { label: "d.", text: "Daerah di antara tali busur dan busur disebut ______." },
    ],
    answers: [
      { label: "a.", text: "Titik O disebut PUSAT lingkaran." },
      { label: "b.", text: "Garis OA disebut JARI-JARI." },
      { label: "c.", text: "Tali busur yang melalui pusat disebut DIAMETER." },
      { label: "d.", text: "Daerah antara tali busur dan busur disebut TEMBERENG." },
    ],
  }),

  Q(27, "Banyaknya Tali Busur", {
    type: "mixed", diff: "Sulit",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 90, label: "A", color: "#f472b6" },
        { angle: 162, label: "B", color: "#fb923c" },
        { angle: 234, label: "C", color: "#facc15" },
        { angle: 306, label: "D", color: "#34d399" },
        { angle: 18, label: "E", color: "#60a5fa" },
      ],
      chords: [
        { angle1: 90, angle2: 162, color: "rgba(255,255,255,0.3)" },
        { angle1: 90, angle2: 234, color: "rgba(255,255,255,0.3)" },
        { angle1: 90, angle2: 306, color: "rgba(255,255,255,0.3)" },
        { angle1: 90, angle2: 18, color: "rgba(255,255,255,0.3)" },
        { angle1: 162, angle2: 234, color: "rgba(255,255,255,0.3)" },
        { angle1: 162, angle2: 306, color: "rgba(255,255,255,0.3)" },
        { angle1: 162, angle2: 18, color: "rgba(255,255,255,0.3)" },
        { angle1: 234, angle2: 306, color: "rgba(255,255,255,0.3)" },
        { angle1: 234, angle2: 18, color: "rgba(255,255,255,0.3)" },
        { angle1: 306, angle2: 18, color: "rgba(255,255,255,0.3)" },
      ],
    },
    parts: [
      { label: "a.", text: "Ada 5 titik pada lingkaran. Berapa banyak tali busur yang dapat dibuat?" },
      { label: "b.", math: "\\text{Rumus: Banyak tali busur dari } n \\text{ titik} = \\frac{n(n-1)}{2}" },
      { label: "c.", text: "Berapa banyak tali busur dari 6 titik pada lingkaran?" },
    ],
    answers: [
      { label: "a.", math: "\\frac{5 \\times 4}{2} = 10 \\text{ tali busur}" },
      { label: "b.", math: "\\text{Rumus: } \\binom{n}{2} = \\frac{n(n-1)}{2}" },
      { label: "c.", math: "\\frac{6 \\times 5}{2} = 15 \\text{ tali busur}" },
    ],
  }),

  Q(28, "Diameter sebagai Tali Busur Terpanjang", {
    type: "mixed", diff: "Sulit",
    content: "Lingkaran berjari-jari 13 cm dengan tali busur AB = 24 cm.",
    parts: [
      { label: "a.", text: "Hitung jarak dari pusat O ke tali busur AB (apotema)." },
      { label: "b.", text: "Apakah AB merupakan diameter? Mengapa?" },
      { label: "c.", text: "Berapakah panjang tali busur terpanjang yang mungkin?" },
    ],
    answers: [
      { label: "a.", math: "\\text{Apotema} = \\sqrt{13^2 - 12^2} = \\sqrt{169-144} = \\sqrt{25} = 5 \\text{ cm}" },
      { label: "b.", text: "Bukan. Diameter = 2 × 13 = 26 cm ≠ 24 cm." },
      { label: "c.", text: "Tali busur terpanjang = diameter = 2 × 13 = 26 cm." },
    ],
  }),

  Q(29, "Lingkaran dalam Segitiga", {
    type: "mixed", diff: "HOTS",
    content: "Sebuah lingkaran dimasukkan (incircle) dalam sebuah segitiga sama sisi dengan panjang sisi 6 cm. Jari-jari incircle dapat dicari dengan rumus khusus.",
    parts: [
      { label: "a.", text: "Titik pusat incircle berada di mana dalam segitiga?" },
      { label: "b.", text: "Apakah jari-jari incircle lebih besar atau lebih kecil dari panjang sisi segitiga?" },
      { label: "c.", text: "Sebutkan istilah untuk lingkaran yang berada di dalam bangun datar!" },
    ],
    answers: [
      { label: "a.", text: "Pusat incircle (disebut incenter) berada di titik perpotongan ketiga garis bagi sudut segitiga." },
      { label: "b.", math: "r = \\frac{a}{2\\sqrt{3}} = \\frac{6}{2\\sqrt{3}} = \\frac{6\\sqrt{3}}{6} = \\sqrt{3} \\approx 1{,}73 \\text{ cm} < 6 \\text{ cm}" },
      { label: "c.", text: "Lingkaran yang berada di dalam bangun datar disebut lingkaran dalam (incircle/inscribed circle)." },
    ],
  }),

  Q(30, "Soal TKA — Konteks Busur", {
    type: "mixed", diff: "Sedang",
    content: "Sebuah jam analog memiliki jarum jam yang berputar 360° dalam 12 jam.",
    parts: [
      { label: "a.", text: "Dalam 1 jam, berapa derajat jarum jam berputar?" },
      { label: "b.", text: "Dari pukul 12.00 ke pukul 04.00, busur berapa derajat yang dilalui jarum jam?" },
      { label: "c.", text: "Busur tersebut disebut busur minor atau busur mayor? Jelaskan." },
    ],
    answers: [
      { label: "a.", math: "\\frac{360°}{12} = 30° \\text{ per jam}" },
      { label: "b.", math: "4 \\times 30° = 120°" },
      { label: "c.", text: "Busur minor, karena 120° < 180°." },
    ],
  }),

  Q(31, "Hubungan Jari-Jari dan Posisi Titik", {
    type: "mixed", diff: "Mudah",
    content: "Lingkaran dengan pusat O dan jari-jari 10 cm. Titik A, B, C memenuhi: OA = 10 cm, OB = 7 cm, OC = 13 cm.",
    parts: [
      { label: "a.", text: "Titik mana yang berada PADA lingkaran?" },
      { label: "b.", text: "Titik mana yang berada DI DALAM lingkaran?" },
      { label: "c.", text: "Titik mana yang berada DI LUAR lingkaran?" },
    ],
    answers: [
      { label: "a.", text: "Titik A (OA = 10 = r) berada PADA lingkaran." },
      { label: "b.", text: "Titik B (OB = 7 < r) berada DI DALAM lingkaran." },
      { label: "c.", text: "Titik C (OC = 13 > r) berada DI LUAR lingkaran." },
    ],
  }),

  Q(32, "Sudut Pusat Lingkaran — Menghitung", {
    type: "mixed", diff: "Sedang",
    content: "Lingkaran dengan pusat O. Titik A, B, C pada lingkaran sehingga busur AB = busur BC.",
    parts: [
      { label: "a.", text: "Apakah ∠AOB = ∠BOC? Mengapa?" },
      { label: "b.", math: "\\text{Jika } \\angle AOB + \\angle BOC + \\angle COA = 360°, \\text{ tentukan } \\angle AOB \\text{ jika busur AB = busur BC = busur CA.}" },
      { label: "c.", text: "Apakah A, B, C membentuk segitiga sama sisi jika dihubungkan? Mengapa?" },
    ],
    answers: [
      { label: "a.", text: "Ya. Besar sudut pusat sebanding dengan besar busur yang dihadapinya. Busur AB = busur BC → ∠AOB = ∠BOC." },
      { label: "b.", math: "\\angle AOB = \\frac{360°}{3} = 120°" },
      { label: "c.", text: "Ya. Karena semua sudut pusat = 120° maka semua busur sama, sehingga AB = BC = CA. Segitiga sama sisi." },
    ],
  }),

  Q(33, "Unsur Lingkaran — Soal ANBK Evaluasi", {
    type: "mixed", diff: "Sedang",
    content: "Perhatikan pernyataan-pernyataan berikut!",
    parts: [
      { label: "(1)", text: "Diameter = 2 × jari-jari → BENAR / SALAH?" },
      { label: "(2)", text: "Apotema > jari-jari → BENAR / SALAH?" },
      { label: "(3)", text: "Busur minor + busur mayor = 360° → BENAR / SALAH?" },
      { label: "(4)", text: "Juring = tembereng → BENAR / SALAH?" },
    ],
    answers: [
      { label: "(1)", text: "BENAR — d = 2r adalah definisi." },
      { label: "(2)", text: "SALAH — Apotema < jari-jari selalu." },
      { label: "(3)", text: "BENAR — Busur minor + busur mayor = keliling penuh = 360°." },
      { label: "(4)", text: "SALAH — Juring ≠ tembereng (berbeda bentuk dan batas)." },
    ],
  }),

  Q(34, "Menentukan Titik Pusat", {
    type: "mixed", diff: "Sedang",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 90, label: "A", color: "#f472b6" },
        { angle: 270, label: "B", color: "#f472b6" },
        { angle: 0, label: "C", color: "#fb923c" },
      ],
      radii: [
        { angle: 90, color: "#f472b6", toEdge: true },
        { angle: 0, color: "#fb923c", toEdge: true },
      ],
    },
    parts: [
      { label: "a.", text: "Garis AB merupakan apa? (diameter/tali busur biasa)" },
      { label: "b.", text: "Bagaimana cara menentukan pusat lingkaran dari sebuah lingkaran yang sudah ada?" },
      { label: "c.", text: "Jika AB ⊥ CD dan keduanya adalah diameter, di manakah titik potongnya?" },
    ],
    answers: [
      { label: "a.", text: "AB merupakan diameter (menghubungkan dua titik yang berseberangan melalui pusat)." },
      { label: "b.", text: "Cara: buat dua tali busur sembarang, tarik garis tegak lurus di tengah masing-masing tali busur (sumbu), perpotongan keduanya adalah pusat lingkaran." },
      { label: "c.", text: "Titik potong AB dan CD adalah di pusat lingkaran O." },
    ],
  }),

  Q(35, "Unsur-Unsur pada Sisi yang Berbeda", {
    type: "mixed", diff: "Sedang",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 30, label: "A", color: "#facc15" },
        { angle: 150, label: "B", color: "#facc15" },
        { angle: 270, label: "C", color: "#60a5fa" },
      ],
      chords: [
        { angle1: 30, angle2: 150, color: "#facc15", label: "AB" },
        { angle1: 150, angle2: 270, color: "#34d399", label: "BC" },
        { angle1: 270, angle2: 30, color: "#f472b6", label: "CA" },
      ],
    },
    parts: [
      { label: "a.", text: "Semua sisi segitiga ABC merupakan unsur apa dalam lingkaran?" },
      { label: "b.", text: "Apakah ada sisi yang merupakan diameter? Jelaskan." },
      { label: "c.", text: "Segitiga yang semua titik sudutnya berada pada lingkaran disebut apa?" },
    ],
    answers: [
      { label: "a.", text: "AB, BC, CA semuanya merupakan TALI BUSUR lingkaran." },
      { label: "b.", text: "Tidak ada yang merupakan diameter, karena tidak ada sisi yang tepat melewati pusat O." },
      { label: "c.", text: "Disebut segitiga tertulis dalam lingkaran atau segitiga tali busur (inscribed triangle)." },
    ],
  }),

  Q(36, "Soal UN — Unsur Lingkaran dalam Konteks", {
    type: "mixed", diff: "Sedang",
    content: "Sebuah roda sepeda berjari-jari 35 cm. Jari-jari kawat roda menghubungkan pusat roda dengan tepi roda.",
    parts: [
      { label: "a.", text: "Berapakah panjang satu kawat jari-jari roda?" },
      { label: "b.", text: "Berapakah panjang diameter roda?" },
      { label: "c.", text: "Jika ada 24 kawat jari-jari, berapa sudut antara dua kawat yang berdampingan?" },
    ],
    answers: [
      { label: "a.", text: "Panjang satu kawat jari-jari = r = 35 cm." },
      { label: "b.", math: "d = 2 \\times 35 = 70 \\text{ cm}" },
      { label: "c.", math: "\\frac{360°}{24} = 15° \\text{ antara dua kawat berdampingan}" },
    ],
  }),

  Q(37, "Diagonal Bangun sebagai Diameter", {
    type: "mixed", diff: "Sulit",
    content: "Persegi panjang ABCD dengan panjang 8 cm dan lebar 6 cm. Sebuah lingkaran digambar dengan diagonal AC sebagai diameter.",
    parts: [
      { label: "a.", text: "Hitung panjang diagonal AC menggunakan Teorema Pythagoras." },
      { label: "b.", text: "Tentukan jari-jari lingkaran tersebut." },
      { label: "c.", text: "Apakah titik B dan D berada tepat pada lingkaran? Buktikan!" },
    ],
    answers: [
      { label: "a.", math: "AC = \\sqrt{8^2 + 6^2} = \\sqrt{64+36} = \\sqrt{100} = 10 \\text{ cm}" },
      { label: "b.", math: "r = \\frac{AC}{2} = \\frac{10}{2} = 5 \\text{ cm}" },
      { label: "c.", text: "Ya. OB = OD = r = 5 cm (diagonal persegi panjang sama panjang dan saling membagi dua sama panjang, jadi B dan D berjarak 5 cm dari pusat O)." },
    ],
  }),

  Q(38, "Soal TKA — Membandingkan Busur", {
    type: "mixed", diff: "Sedang",
    content: "Lingkaran dengan pusat O berjari-jari 10 cm. ∠AOB = 60°, ∠COD = 90°, ∠EOF = 120°.",
    parts: [
      { label: "a.", text: "Urutkan busur AB, CD, EF dari yang terpendek ke terpanjang!" },
      { label: "b.", text: "Busur mana yang merupakan ¼ keliling lingkaran?" },
      { label: "c.", text: "Busur mana yang merupakan ⅙ keliling lingkaran?" },
    ],
    answers: [
      { label: "a.", text: "Busur AB (60°) < Busur CD (90°) < Busur EF (120°)." },
      { label: "b.", math: "\\text{Busur CD} = \\frac{90°}{360°} = \\frac{1}{4} \\text{ keliling}" },
      { label: "c.", math: "\\text{Busur AB} = \\frac{60°}{360°} = \\frac{1}{6} \\text{ keliling}" },
    ],
  }),

  Q(39, "Hubungan Busur dan Sudut Pusat", {
    type: "mixed", diff: "Sedang",
    content: "Dalam satu lingkaran berlaku: besar busur sebanding dengan besar sudut pusatnya.",
    parts: [
      { label: "a.", math: "\\text{Jika } \\angle AOB : \\angle COD = 2 : 3, \\text{ maka busur AB : busur CD = ?}" },
      { label: "b.", math: "\\text{Jika busur PQ} = 60° \\text{ dan busur QR} = 80°, \\text{ tentukan } \\angle POR." },
      { label: "c.", math: "\\text{Besar busur RS} = 100°. \\text{ Tentukan sudut pusat } \\angle ROS." },
    ],
    answers: [
      { label: "a.", math: "\\text{Busur AB : Busur CD} = 2 : 3" },
      { label: "b.", math: "\\angle POR = \\angle POQ + \\angle QOR = 60° + 80° = 140°" },
      { label: "c.", math: "\\angle ROS = \\text{besar busur RS} = 100°" },
    ],
  }),

  Q(40, "Soal ANBK — Gabungan Unsur Lingkaran", {
    type: "mixed", diff: "HOTS",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 90, label: "A", color: "#f472b6" },
        { angle: 210, label: "B", color: "#fb923c" },
        { angle: 330, label: "C", color: "#34d399" },
      ],
      radii: [
        { angle: 90, color: "#f472b6" },
        { angle: 210, color: "#fb923c" },
        { angle: 330, color: "#34d399" },
      ],
      chords: [
        { angle1: 90, angle2: 210, color: "rgba(255,255,255,0.3)" },
        { angle1: 210, angle2: 330, color: "rgba(255,255,255,0.3)" },
        { angle1: 330, angle2: 90, color: "rgba(255,255,255,0.3)" },
      ],
      sectors: [
        { startAngle: 210, endAngle: 330, fillColor: "rgba(52,211,153,0.15)" },
        { startAngle: 330, endAngle: 90, fillColor: "rgba(248,113,163,0.12)" },
        { startAngle: 90, endAngle: 210, fillColor: "rgba(251,146,60,0.12)" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik A, B, C membagi lingkaran menjadi berapa juring?" },
      { label: "b.", text: "Jika busur AB = busur BC = busur CA, berapakah besar setiap sudut pusat?" },
      { label: "c.", text: "Segitiga ABC yang terbentuk merupakan jenis segitiga apa? Jelaskan!" },
      { label: "d.", text: "Sebutkan semua unsur lingkaran yang ada pada gambar!" },
    ],
    answers: [
      { label: "a.", text: "3 juring (AOB, BOC, COA)." },
      { label: "b.", math: "\\frac{360°}{3} = 120° \\text{ setiap sudut pusat}" },
      { label: "c.", text: "Segitiga SAMA SISI, karena semua busur sama → semua tali busur (sisi) sama panjang → semua sudut = 60°." },
      { label: "d.", text: "Pusat O, jari-jari OA, OB, OC; tali busur AB, BC, CA; busur AB, BC, CA; juring OAB, OBC, OCA; titik A, B, C." },
    ],
  }),
];

const UnsurUnsurLingkaranPage = () => {
  const navigate = useNavigate();
  const [openAnswers, setOpenAnswers] = useState<Set<number>>(new Set());
  const toggleAnswer = (n: number) => {
    setOpenAnswers(prev => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n); else next.add(n);
      return next;
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            UNSUR-UNSUR LINGKARAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-2">📌 Unsur-Unsur Lingkaran</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { n: "Jari-jari (r)", d: "Pusat ke titik di lingkaran", c: "text-cyan-400" },
              { n: "Diameter (d)", d: "d = 2r, tali busur terpanjang", c: "text-blue-400" },
              { n: "Busur", d: "Bagian garis lengkung lingkaran", c: "text-yellow-400" },
              { n: "Tali Busur", d: "Garis lurus hubungkan 2 titik", c: "text-pink-400" },
              { n: "Apotema", d: "Jarak pusat ke tali busur", c: "text-violet-400" },
              { n: "Juring", d: "Daerah 2 jari-jari + busur", c: "text-orange-400" },
              { n: "Tembereng", d: "Daerah tali busur + busur", c: "text-green-400" },
              { n: "Sudut Pusat", d: "Sudut dengan vertex di pusat", c: "text-red-400" },
            ].map(r => (
              <div key={r.n} className="bg-white/5 rounded-lg px-3 py-2">
                <span className={`font-bold ${r.c}`}>{r.n}: </span>
                <span className="text-white/60">{r.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.diff && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${diffColor[q.diff]}`}>
                          {q.diff}
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CircleDiagram {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                    {q.answers && (
                      <div className="mt-3">
                        <button
                          onClick={() => { playPopSound(); toggleAnswer(q.n); }}
                          className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg px-3 py-1.5 transition-all"
                        >
                          {openAnswers.has(q.n) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {openAnswers.has(q.n) ? "Sembunyikan Kunci Jawaban" : "💡 Lihat Kunci Jawaban"}
                        </button>
                        {openAnswers.has(q.n) && (
                          <div className="mt-2 bg-emerald-900/20 border border-emerald-500/25 rounded-xl p-3">
                            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">✅ Kunci Jawaban</p>
                            <div className="flex flex-col gap-1.5">
                              {q.answers.map((a, ai) => (
                                <div key={ai} className="flex items-start gap-2">
                                  <span className="text-emerald-300 text-xs font-bold shrink-0 min-w-[28px] mt-0.5">{a.label}</span>
                                  {a.math
                                    ? <div className="text-white/90 text-sm overflow-x-auto"><InlineMath math={a.math} /></div>
                                    : <p className="font-body text-sm text-white/80 leading-relaxed">{a.text}</p>
                                  }
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsurUnsurLingkaranPage;
