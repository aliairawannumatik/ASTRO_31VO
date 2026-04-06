import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Crosshair } from "lucide-react";
import CoordPlane from "./CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Posisi Titik terhadap Titik Acuan O(0,0)", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 0, label: "O(0,0)", color: "#facc15", labelPos: "tr" },
        { x: 3, y: 4, label: "A(3,4)", color: "#f472b6", labelPos: "tr" },
        { x: -2, y: 3, label: "B(−2,3)", color: "#60a5fa", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Nyatakan posisi titik A terhadap titik acuan O(0,0)! (berapa satuan ke kanan/kiri dan ke atas/bawah)" },
      { label: "b.", text: "Nyatakan posisi titik B terhadap titik acuan O(0,0)!" },
      { label: "c.", text: "Jika titik acuan O bergeser ke (1,1), bagaimana posisi relatif A terhadap titik acuan baru itu?" },
    ],
  }),

  Qn(2, "Posisi Titik P terhadap Titik Acuan A", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: 2, y: 1, label: "A(2,1)", color: "#facc15", labelPos: "tr" },
        { x: 5, y: 4, label: "P(5,4)", color: "#f472b6", labelPos: "tr" },
        { x: -1, y: 3, label: "Q(−1,3)", color: "#34d399", labelPos: "tl" },
        { x: 2, y: -2, label: "R(2,−2)", color: "#fb923c", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik A(2,1) sebagai titik acuan. Nyatakan posisi titik P terhadap A!" },
      { label: "b.", text: "Nyatakan posisi titik Q terhadap A(2,1)!" },
      { label: "c.", text: "Nyatakan posisi titik R terhadap A(2,1)!" },
      { label: "d.", text: "Titik mana yang berada tepat di atas titik A? (sebutkan alasannya)" },
    ],
  }),

  Qn(3, "Selisih Koordinat sebagai Posisi Relatif", {
    type: "essay",
    content: "Posisi relatif titik B(x₂, y₂) terhadap titik acuan A(x₁, y₁) dinyatakan sebagai: Δx = x₂ − x₁ (positif = kanan, negatif = kiri) dan Δy = y₂ − y₁ (positif = atas, negatif = bawah).",
    parts: [
      { label: "a.", text: "Hitung posisi relatif titik C(7, 3) terhadap titik acuan B(4, 1)!", math: "\\Delta x = 7 - 4 = 3, \\quad \\Delta y = 3 - 1 = 2" },
      { label: "b.", text: "Hitung posisi relatif titik D(−3, 5) terhadap titik acuan E(2, −1)!" },
      { label: "c.", text: "Hitung posisi relatif titik F(0, 0) terhadap titik acuan G(5, 3)!" },
    ],
  }),

  Qn(4, "Menentukan Koordinat dari Posisi Relatif", {
    type: "essay",
    content: "Jika titik acuan adalah A(2, 3), dan titik B berada 4 satuan ke kanan dan 2 satuan ke bawah dari A, maka koordinat B dapat dicari.",
    parts: [
      { label: "a.", text: "Tentukan koordinat titik B!", math: "B = (2 + 4,\\; 3 + (-2)) = (6, 1)" },
      { label: "b.", text: "Titik C berada 3 satuan ke kiri dan 5 satuan ke atas dari A(2,3). Tentukan koordinat C!" },
      { label: "c.", text: "Titik D berada 6 satuan ke kanan dan 4 satuan ke atas dari titik asal O(0,0). Tentukan koordinat D!" },
    ],
  }),

  Qn(5, "Posisi Relatif pada Kuadran Berbeda", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -3, y: -2, label: "P(−3,−2)", color: "#facc15", labelPos: "bl" },
        { x: 2, y: 4, label: "A(2,4)", color: "#f472b6", labelPos: "tr" },
        { x: -1, y: 3, label: "B(−1,3)", color: "#60a5fa", labelPos: "tl" },
        { x: 4, y: -3, label: "C(4,−3)", color: "#34d399", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik P(−3,−2) sebagai titik acuan. Nyatakan posisi titik A terhadap P!" },
      { label: "b.", text: "Nyatakan posisi titik B terhadap P(−3,−2)!" },
      { label: "c.", text: "Nyatakan posisi titik C terhadap P(−3,−2)!" },
    ],
  }),

  Qn(6, "Titik Acuan di Sumbu-x", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 3, y: 0, label: "T(3,0)", color: "#facc15", labelPos: "top" },
        { x: 5, y: 4, label: "K(5,4)", color: "#f472b6", labelPos: "tr" },
        { x: 1, y: -3, label: "L(1,−3)", color: "#60a5fa", labelPos: "br" },
        { x: -2, y: 2, label: "M(−2,2)", color: "#a78bfa", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "T(3,0) adalah titik acuan di sumbu-x. Tentukan posisi relatif titik K terhadap T!" },
      { label: "b.", text: "Tentukan posisi relatif titik L terhadap T(3,0)!" },
      { label: "c.", text: "Tentukan posisi relatif titik M terhadap T(3,0)!" },
    ],
  }),

  Qn(7, "Titik Acuan di Sumbu-y", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 4, label: "S(0,4)", color: "#facc15", labelPos: "tr" },
        { x: 3, y: 6, label: "X(3,6)", color: "#f472b6", labelPos: "tr" },
        { x: -4, y: 1, label: "Y(−4,1)", color: "#34d399", labelPos: "tl" },
        { x: 2, y: -2, label: "Z(2,−2)", color: "#fb923c", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "S(0,4) adalah titik acuan di sumbu-y. Tentukan posisi relatif titik X terhadap S!" },
      { label: "b.", text: "Tentukan posisi relatif titik Y terhadap S(0,4)!" },
      { label: "c.", text: "Tentukan posisi relatif titik Z terhadap S(0,4)!" },
    ],
  }),

  Qn(8, "Titik yang Segaris Horizontal dengan Titik Acuan", {
    type: "essay",
    content: "Titik B dikatakan segaris horizontal dengan titik acuan A jika kedua titik memiliki nilai y yang sama (Δy = 0).",
    parts: [
      { label: "a.", text: "Jika titik acuan adalah A(2, 5), tentukan koordinat titik B yang segaris horizontal dengan A dan berada 4 satuan ke kanan A!" },
      { label: "b.", text: "Titik C(x, 5) segaris horizontal dengan A(2,5). Apakah posisi C di kiri atau kanan A jika x = −3?" },
      { label: "c.", text: "Apakah titik D(7, 5) dan E(−1, 5) keduanya segaris horizontal dengan A(2, 5)? Jelaskan!" },
    ],
  }),

  Qn(9, "Titik yang Segaris Vertikal dengan Titik Acuan", {
    type: "essay",
    content: "Titik B dikatakan segaris vertikal dengan titik acuan A jika kedua titik memiliki nilai x yang sama (Δx = 0).",
    parts: [
      { label: "a.", text: "Jika titik acuan adalah A(−3, 2), tentukan koordinat titik C yang segaris vertikal dengan A dan berada 5 satuan ke bawah A!" },
      { label: "b.", text: "Titik D(−3, y) segaris vertikal dengan A(−3, 2). Apakah D di atas atau bawah A jika y = 7?" },
      { label: "c.", text: "Tentukan semua titik dari daftar berikut yang segaris vertikal dengan P(4, 1): Q(4, 5), R(2, 1), S(4, −3), T(−4, 1)!" },
    ],
  }),

  Qn(10, "Posisi Relatif: Atas/Bawah/Kiri/Kanan", {
    type: "essay",
    content: "Diberikan titik acuan A(1, 2) dan beberapa titik lainnya.",
    parts: [
      { label: "a.", text: "Tentukan posisi titik B(4, 2) terhadap A: apakah di atas, bawah, kiri, atau kanan?" },
      { label: "b.", text: "Tentukan posisi titik C(1, −1) terhadap A(1,2)!" },
      { label: "c.", text: "Tentukan posisi titik D(−2, 5) terhadap A(1,2)!" },
      { label: "d.", text: "Titik E(1, 2) sama dengan A. Apa yang dapat kamu simpulkan?" },
    ],
  }),

  Qn(11, "Menentukan Titik Acuan dari Informasi Posisi Relatif", {
    type: "essay",
    content: "Titik P berada 3 satuan ke kanan dan 4 satuan ke atas dari titik acuan Q.",
    parts: [
      { label: "a.", text: "Jika koordinat P adalah (5, 6), tentukan koordinat titik acuan Q!", math: "Q = (5 - 3,\\; 6 - 4) = (2, 2)" },
      { label: "b.", text: "Jika P(−1, 3) berada 2 satuan ke kiri dan 5 satuan ke atas dari Q, tentukan Q!" },
      { label: "c.", text: "Jika R(4, −2) berada 6 satuan ke kanan dan 3 satuan ke bawah dari S, tentukan S!" },
    ],
  }),

  Qn(12, "Posisi Relatif Titik-titik dalam Bangun Datar", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: 1, y: 1, label: "A(1,1)", color: "#f472b6", labelPos: "bl" },
        { x: 5, y: 1, label: "B(5,1)", color: "#60a5fa", labelPos: "br" },
        { x: 5, y: 4, label: "C(5,4)", color: "#34d399", labelPos: "tr" },
        { x: 1, y: 4, label: "D(1,4)", color: "#a78bfa", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "ABCD adalah sudut-sudut persegi panjang. Dengan A sebagai titik acuan, nyatakan posisi relatif titik B, C, dan D terhadap A!" },
      { label: "b.", text: "Dengan B sebagai titik acuan, nyatakan posisi relatif titik C terhadap B!" },
      { label: "c.", text: "Hitunglah panjang AB dan BC berdasarkan selisih koordinat!" },
    ],
  }),

  Qn(13, "Posisi Relatif dan Translasi", {
    type: "essay",
    content: "Posisi relatif suatu titik terhadap titik acuan erat kaitannya dengan konsep translasi (pergeseran).",
    parts: [
      { label: "a.", text: "Titik A(2, 3) ditranslasikan sejauh (4, −2). Tentukan koordinat A' dan nyatakan posisi A' terhadap A!" },
      { label: "b.", text: "Titik B(−1, 5) memiliki posisi relatif (3, −4) terhadap titik acuan C. Tentukan koordinat C!" },
      { label: "c.", text: "Jika titik P'(6, 1) adalah hasil translasi P dengan vektor (−2, 3), tentukan koordinat P dan posisi P terhadap P'!" },
    ],
  }),

  Qn(14, "Membandingkan Posisi Dua Titik terhadap Satu Acuan", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: 0, y: 0, label: "O(0,0)", color: "#facc15", labelPos: "bl" },
        { x: 3, y: 5, label: "P(3,5)", color: "#f472b6", labelPos: "tr" },
        { x: -4, y: 5, label: "Q(−4,5)", color: "#60a5fa", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Bandingkan posisi titik P dan Q terhadap titik acuan O(0,0)! Mana yang lebih jauh ke kanan? Mana yang lebih tinggi?" },
      { label: "b.", text: "Apakah P dan Q segaris horizontal? Berikan alasanmu!" },
      { label: "c.", text: "Berapa selisih absis (Δx) antara P dan Q?" },
    ],
  }),

  Qn(15, "Posisi Relatif Titik terhadap Titik Tengah Segmen", {
    type: "essay",
    content: "Titik tengah dari segmen AB dengan A(2, 4) dan B(6, 2) dapat dihitung.",
    math: "M = \\left(\\frac{2+6}{2},\\; \\frac{4+2}{2}\\right) = (4, 3)",
    parts: [
      { label: "a.", text: "Hitung koordinat titik tengah M dari segmen AB dengan A(2,4) dan B(6,2)!" },
      { label: "b.", text: "Dengan M sebagai titik acuan, nyatakan posisi relatif titik C(7, 5) terhadap M!" },
      { label: "c.", text: "Titik D berada 2 satuan ke kiri dan 3 satuan ke bawah dari M. Tentukan koordinat D!" },
    ],
  }),

  Qn(16, "Posisi Relatif pada Peta Sederhana", {
    type: "essay",
    content: "Sebuah peta menggunakan sistem koordinat. Perpustakaan berada di titik P(3, 5), kantin di K(7, 2), kelas di C(1, 8).",
    parts: [
      { label: "a.", text: "Dengan perpustakaan P(3,5) sebagai acuan, nyatakan posisi kantin K(7,2) terhadap P!" },
      { label: "b.", text: "Dengan perpustakaan P(3,5) sebagai acuan, nyatakan posisi kelas C(1,8) terhadap P!" },
      { label: "c.", text: "Jika kamu berada di kantin K(7,2) dan ingin ke kelas C(1,8), berapa satuan kamu harus bergerak dan ke arah mana?" },
    ],
  }),

  Qn(17, "Posisi Relatif: Menentukan Kuadran Relatif", {
    type: "essay",
    content: "Titik B berada di posisi relatif (Δx, Δy) terhadap titik acuan A. Kuadran relatif ditentukan oleh tanda Δx dan Δy.",
    parts: [
      { label: "a.", text: "Jika Δx = 3 (positif) dan Δy = 2 (positif), B berada di sudut kanan atas dari A. Apakah pernyataan ini benar? Jelaskan!" },
      { label: "b.", text: "Tentukan arah posisi C terhadap B(1,−2) jika C(−3, 5). (Δx negatif = kiri, Δy positif = atas)" },
      { label: "c.", text: "Titik D(4, −5) terhadap titik acuan E(−1, 3). Tentukan Δx dan Δy, lalu jelaskan posisi D terhadap E!" },
    ],
  }),

  Qn(18, "Posisi Relatif Tiga Titik Berurutan", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -2, y: -3, label: "A(−2,−3)", color: "#f472b6", labelPos: "bl" },
        { x: 2, y: 1, label: "B(2,1)", color: "#60a5fa", labelPos: "tr" },
        { x: 5, y: 4, label: "C(5,4)", color: "#34d399", labelPos: "tr" },
      ],
    },
    parts: [
      { label: "a.", text: "Nyatakan posisi B terhadap A!" },
      { label: "b.", text: "Nyatakan posisi C terhadap B!" },
      { label: "c.", text: "Jika kamu bergerak dari A ke B lalu ke C, berapa total perpindahan (Δx dan Δy) dari A ke C?" },
    ],
  }),

  Qn(19, "Posisi Relatif dan Pencerminan terhadap Titik", {
    type: "essay",
    content: "Pencerminan titik P(a, b) terhadap titik acuan M(m, n) menghasilkan titik P' dengan koordinat: P' = (2m − a, 2n − b).",
    parts: [
      { label: "a.", text: "Tentukan bayangan P(3, 4) dicerminkan terhadap titik M(1, 1)!", math: "P' = (2(1)-3,\\; 2(1)-4) = (-1, -2)" },
      { label: "b.", text: "Tentukan bayangan Q(−2, 5) dicerminkan terhadap titik N(0, 0)!" },
      { label: "c.", text: "Nyatakan posisi P'(−1, −2) terhadap M(1,1)! Bandingkan dengan posisi P(3,4) terhadap M!" },
    ],
  }),

  Qn(20, "Posisi Relatif dalam Soal Cerita: Lapangan Sepak Bola", {
    type: "essay",
    content: "Lapangan sepak bola digambarkan pada koordinat kartesius. Gawang A berada di G₁(0, 0) dan gawang B di G₂(10, 0). Posisi pemain: Amir di (3, 4), Budi di (7, −2), Citra di (5, 0).",
    parts: [
      { label: "a.", text: "Dengan gawang G₁(0,0) sebagai acuan, nyatakan posisi Amir, Budi, dan Citra!" },
      { label: "b.", text: "Dengan posisi Citra(5,0) sebagai acuan, nyatakan posisi Amir dan Budi!" },
      { label: "c.", text: "Siapa yang lebih dekat ke gawang G₁(0,0): Amir(3,4) atau Budi(7,−2)? Gunakan posisi relatif untuk menjelaskan!" },
    ],
  }),

  Qn(21, "Posisi Relatif: Denah Rumah", {
    type: "essay",
    content: "Denah rumah digambarkan pada koordinat. Pintu depan di D(0,0), ruang tamu di R(3,2), dapur di K(−2,4), kamar tidur di T(5,6).",
    parts: [
      { label: "a.", text: "Dengan pintu depan D(0,0) sebagai acuan, nyatakan posisi ruang tamu, dapur, dan kamar tidur!" },
      { label: "b.", text: "Dengan ruang tamu R(3,2) sebagai acuan, nyatakan posisi kamar tidur T(5,6)!" },
      { label: "c.", text: "Jika kamu berdiri di dapur K(−2,4), ke arah mana kamu harus bergerak untuk menuju pintu depan D(0,0)?" },
    ],
  }),

  Qn(22, "Posisi Relatif Titik terhadap Titik Berat Segitiga", {
    type: "essay",
    content: "Titik berat (centroid) segitiga dengan sudut A(0,0), B(6,0), C(3,9) adalah titik G.",
    math: "G = \\left(\\frac{0+6+3}{3},\\; \\frac{0+0+9}{3}\\right) = (3, 3)",
    parts: [
      { label: "a.", text: "Hitung koordinat titik berat G segitiga ABC!" },
      { label: "b.", text: "Dengan G sebagai titik acuan, nyatakan posisi relatif titik A, B, dan C terhadap G!" },
      { label: "c.", text: "Titik D(5, 7) dan titik E(1, −1). Nyatakan posisi D dan E terhadap titik berat G(3,3)!" },
    ],
  }),

  Qn(23, "Posisi Relatif dengan Jarak Sama dari Titik Acuan", {
    type: "essay",
    content: "Titik-titik yang memiliki jarak yang sama dari titik acuan A terletak pada lingkaran berpusat di A.",
    parts: [
      { label: "a.", text: "Jika titik acuan A(2, 3) dan sebuah titik B berjarak 5 satuan dari A ke arah kanan murni (Δy = 0), tentukan koordinat B!" },
      { label: "b.", text: "Titik C berjarak 3 satuan ke atas dari A(2,3) dan D berjarak 3 satuan ke kiri dari A. Tentukan koordinat C dan D!" },
      { label: "c.", text: "Jelaskan mengapa titik-titik dengan |Δx| + |Δy| = konstan tidak harus berjarak sama dari titik acuan A!" },
    ],
  }),

  Qn(24, "Menemukan Titik yang Tidak Diketahui dari Posisi Relatif", {
    type: "essay",
    content: "Diketahui bahwa titik B berada di posisi relatif (−4, 6) dari titik A. Artinya B berada 4 satuan ke kiri dan 6 satuan ke atas dari A.",
    parts: [
      { label: "a.", text: "Jika A = (5, −2), tentukan koordinat B!", math: "B = (5 + (-4),\\; -2 + 6) = (1, 4)" },
      { label: "b.", text: "Jika B = (3, 7) dan posisi relatif B terhadap A adalah (5, −3), tentukan A!" },
      { label: "c.", text: "Titik C memiliki posisi relatif (2, 2) terhadap B(1, 4). Tentukan C dan kemudian nyatakan posisi C terhadap A(5, −2)!" },
    ],
  }),

  Qn(25, "Posisi Relatif pada Koordinat Negatif", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -4, y: -3, label: "A(−4,−3)", color: "#facc15", labelPos: "bl" },
        { x: -1, y: 2, label: "B(−1,2)", color: "#f472b6", labelPos: "tr" },
        { x: -6, y: -1, label: "C(−6,−1)", color: "#60a5fa", labelPos: "tl" },
        { x: -2, y: -5, label: "D(−2,−5)", color: "#34d399", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Dengan A(−4,−3) sebagai titik acuan, nyatakan posisi B, C, dan D!" },
      { label: "b.", text: "Titik mana yang berada di sebelah kiri dan di bawah A?" },
      { label: "c.", text: "Hitunglah Δx dan Δy untuk setiap titik terhadap A!" },
    ],
  }),

  Qn(26, "Posisi Relatif dan Simetri terhadap Titik", {
    type: "essay",
    content: "Dua titik P dan Q dikatakan simetri terhadap titik acuan M jika M adalah titik tengah segmen PQ.",
    parts: [
      { label: "a.", text: "Jika P(2, 5) dan M(4, 3) adalah titik acuan, tentukan Q agar P dan Q simetri terhadap M!", math: "Q = (2 \\cdot 4 - 2,\\; 2 \\cdot 3 - 5) = (6, 1)" },
      { label: "b.", text: "Jika Q(−1, 7) dan M(2, 2), tentukan P sehingga P dan Q simetri terhadap M!" },
      { label: "c.", text: "Verifikasi bahwa M(2,2) adalah titik tengah PQ dengan P yang sudah ditemukan!" },
    ],
  }),

  Qn(27, "Posisi Relatif dalam Sistem Navigasi Sederhana", {
    type: "essay",
    content: "Sebuah kapal berada di posisi K(2, 3). Mercusuar A berada di (5, 7), mercusuar B di (−1, 6), pulau C di (4, −2).",
    parts: [
      { label: "a.", text: "Dengan posisi kapal K(2,3) sebagai acuan, nyatakan posisi mercusuar A!" },
      { label: "b.", text: "Nyatakan posisi mercusuar B terhadap kapal K(2,3)!" },
      { label: "c.", text: "Nyatakan posisi pulau C terhadap kapal K(2,3) dan tentukan ke arah mana kapal harus bergerak untuk menuju pulau C!" },
    ],
  }),

  Qn(28, "Posisi Relatif Banyak Titik terhadap Satu Titik Acuan", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: 3, y: 3, label: "P(3,3)", color: "#facc15", labelPos: "tr" },
        { x: 6, y: 5, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: 1, y: 6, label: "B", color: "#60a5fa", labelPos: "tl" },
        { x: 5, y: 1, label: "C", color: "#34d399", labelPos: "br" },
        { x: 0, y: 2, label: "D", color: "#fb923c", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "P(3,3) adalah titik acuan. Dari diagram, baca koordinat A, B, C, D dan nyatakan posisi relatifnya terhadap P!" },
      { label: "b.", text: "Titik mana yang berada di kanan atas P? Titik mana yang berada di kiri atas P?" },
      { label: "c.", text: "Urutkan titik A, B, C, D berdasarkan jarak Δx terhadap P dari terkecil ke terbesar!" },
    ],
  }),

  Qn(29, "Posisi Relatif: Menggambar Titik dari Deskripsi", {
    type: "essay",
    content: "Kamu diminta menggambar titik-titik berdasarkan posisi relatifnya terhadap titik acuan M(2, 1).",
    parts: [
      { label: "a.", text: "Gambarkan dan tentukan koordinat titik A yang berada 4 satuan ke kanan dan 3 satuan ke atas dari M(2,1)!", math: "A = (2+4,\\; 1+3) = (6, 4)" },
      { label: "b.", text: "Tentukan koordinat titik B yang berada 5 satuan ke kiri dan 2 satuan ke atas dari M!" },
      { label: "c.", text: "Tentukan koordinat titik C yang berada 3 satuan ke kanan dan 4 satuan ke bawah dari M!" },
      { label: "d.", text: "Hubungkan A, B, C membentuk segitiga. Hitung kelilingnya menggunakan rumus jarak!" },
    ],
  }),

  Qn(30, "Posisi Relatif: Titik Acuan Bergerak", {
    type: "essay",
    content: "Titik acuan A mula-mula di (1, 2), kemudian bergerak ke (4, 5). Titik B(6, 7) tetap pada posisinya.",
    parts: [
      { label: "a.", text: "Tentukan posisi B terhadap A awal (1,2)!" },
      { label: "b.", text: "Tentukan posisi B terhadap A baru (4,5)!" },
      { label: "c.", text: "Bagaimana perubahan posisi relatif B ketika titik acuan A berpindah? Apa yang berubah dan mengapa?" },
    ],
  }),

  Qn(31, "Menghitung Posisi Relatif dari Tabel Koordinat", {
    type: "essay",
    content: "Diberikan tabel titik: P(0,0), Q(3,4), R(−2,5), S(6,−1), T(−3,−4). Titik acuan adalah M(1,2).",
    parts: [
      { label: "a.", text: "Lengkapi tabel posisi relatif terhadap M(1,2): hitung Δx dan Δy untuk setiap titik P, Q, R, S, T!" },
      { label: "b.", text: "Titik mana yang berada di sebelah kiri M (Δx < 0)?" },
      { label: "c.", text: "Titik mana yang berada di atas M (Δy > 0)?" },
    ],
  }),

  Qn(32, "Posisi Relatif dan Koordinat Baru setelah Pergeseran Acuan", {
    type: "essay",
    content: "Suatu sistem koordinat baru dibuat dengan titik acuan A(3,2) sebagai titik asal baru. Koordinat suatu titik dalam sistem baru adalah posisi relatifnya terhadap A.",
    parts: [
      { label: "a.", text: "Titik B(7, 5) dalam sistem lama. Tentukan koordinat B dalam sistem baru (dengan A(3,2) sebagai asal)!", math: "B_{baru} = (7-3,\\; 5-2) = (4, 3)" },
      { label: "b.", text: "Titik C(−1, 4) dalam sistem lama. Tentukan koordinat C dalam sistem baru!" },
      { label: "c.", text: "Titik D dalam sistem baru memiliki koordinat (−2, 3). Tentukan koordinat D dalam sistem lama!" },
    ],
  }),

  Qn(33, "Posisi Relatif pada Masalah Jarak Tempuh", {
    type: "essay",
    content: "Rumah Adi di A(1, 1). Sekolah di S(7, 5). Warung di W(4, 1). Taman di T(1, 5).",
    parts: [
      { label: "a.", text: "Dengan rumah A(1,1) sebagai acuan, nyatakan posisi sekolah, warung, dan taman!" },
      { label: "b.", text: "Jika Adi berjalan dari rumah ke warung lalu ke sekolah, berapa total Δx dan Δy yang ditempuh?" },
      { label: "c.", text: "Bandingkan dengan berjalan langsung dari rumah ke sekolah. Apakah total perpindahannya sama? Jelaskan!" },
    ],
  }),

  Qn(34, "Posisi Relatif: Soal Terbuka", {
    type: "essay",
    content: "Titik A berada di posisi relatif (p, q) terhadap titik acuan O(0,0), di mana p dan q adalah bilangan bulat.",
    parts: [
      { label: "a.", text: "Jika p = 3 dan q = −4, tentukan koordinat A! Apakah A berada di kuadran IV?" },
      { label: "b.", text: "Jika p < 0 dan q > 0, di kuadran mana titik A berada? Berikan contoh titik A dengan koordinat tertentu!" },
      { label: "c.", text: "Jika p = 0 dan q ≠ 0, di mana titik A berada? Apakah A berada di salah satu sumbu? Sumbu mana?" },
    ],
  }),

  Qn(35, "Posisi Relatif Titik Puncak Persegi terhadap Pusatnya", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: 2, y: 2, label: "P(2,2)", color: "#facc15", labelPos: "tr" },
        { x: -1, y: 2, label: "A(−1,2)", color: "#f472b6", labelPos: "tl" },
        { x: 5, y: 2, label: "B(5,2)", color: "#60a5fa", labelPos: "tr" },
        { x: 2, y: 5, label: "C(2,5)", color: "#34d399", labelPos: "tr" },
        { x: 2, y: -1, label: "D(2,−1)", color: "#a78bfa", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "P(2,2) adalah pusat persegi. Nyatakan posisi relatif A, B, C, D terhadap pusat P!" },
      { label: "b.", text: "Apakah A dan B, juga C dan D, simetri terhadap P? Jelaskan!" },
      { label: "c.", text: "Berapakah sisi persegi ABCD?" },
    ],
  }),

  Qn(36, "Posisi Relatif: Koordinat Titik Tengah Ruas Garis", {
    type: "essay",
    content: "Titik tengah M dari ruas garis PQ dapat dihitung. Posisi P dan Q terhadap M memiliki hubungan simetri.",
    parts: [
      { label: "a.", text: "P(1, 5) dan Q(7, 3). Hitung titik tengah M dan nyatakan posisi P terhadap M!", math: "M = (4, 4)" },
      { label: "b.", text: "Nyatakan posisi Q terhadap M(4,4). Apakah posisi P dan Q terhadap M berlawanan tanda? Mengapa?" },
      { label: "c.", text: "Jika titik R(3, 6) dan S(9, 2), hitung M_RS dan nyatakan posisi R dan S terhadap M_RS!" },
    ],
  }),

  Qn(37, "Posisi Relatif pada Bidang dengan Skala", {
    type: "essay",
    content: "Sebuah peta memiliki skala 1:100 (1 satuan koordinat = 100 m). Gedung A berada di (2,3), gedung B di (7,8), menara C di (−1,5).",
    parts: [
      { label: "a.", text: "Nyatakan posisi gedung B terhadap gedung A dalam satuan koordinat dan dalam meter!" },
      { label: "b.", text: "Nyatakan posisi menara C terhadap gedung A dalam satuan koordinat dan dalam meter!" },
      { label: "c.", text: "Jika seseorang berjalan dari A ke B, berapa meter ke timur (kanan) dan berapa meter ke utara (atas) yang ditempuh?" },
    ],
  }),

  Qn(38, "Posisi Relatif: Aturan Tanda dan Arah", {
    type: "essay",
    content: "Aturan tanda posisi relatif: Δx > 0 = ke kanan, Δx < 0 = ke kiri, Δy > 0 = ke atas, Δy < 0 = ke bawah.",
    parts: [
      { label: "a.", text: "Tentukan Δx dan Δy serta arah posisi titik Q(−3, 7) terhadap titik acuan P(2, 4)!" },
      { label: "b.", text: "Titik R memiliki posisi (Δx = 0, Δy = −5) terhadap P(2,4). Tentukan koordinat R dan jelaskan posisinya!" },
      { label: "c.", text: "Titik S memiliki posisi (Δx = −6, Δy = 0) terhadap P(2,4). Tentukan koordinat S!" },
    ],
  }),

  Qn(39, "Posisi Relatif Multipel Titik Acuan", {
    type: "essay",
    content: "Titik O(0,0), A(4,0), dan B(0,3) masing-masing dapat dijadikan titik acuan untuk titik P(5,4).",
    parts: [
      { label: "a.", text: "Nyatakan posisi P(5,4) terhadap O(0,0)!" },
      { label: "b.", text: "Nyatakan posisi P(5,4) terhadap A(4,0)!" },
      { label: "c.", text: "Nyatakan posisi P(5,4) terhadap B(0,3)!" },
      { label: "d.", text: "Terhadap titik acuan mana P paling dekat (berdasarkan nilai |Δx| + |Δy| terkecil)?" },
    ],
  }),

  Qn(40, "Soal Tantangan: Menemukan Titik dari Dua Syarat Posisi Relatif", {
    type: "essay",
    content: "Titik Q memenuhi dua syarat sekaligus: (1) Q berada 3 satuan ke kanan dan 2 satuan ke atas dari titik A(1,−1), dan (2) Q berada 1 satuan ke kiri dan 4 satuan ke atas dari titik B.",
    parts: [
      { label: "a.", text: "Dari syarat (1), tentukan koordinat Q!", math: "Q = (1+3,\\; -1+2) = (4, 1)" },
      { label: "b.", text: "Gunakan koordinat Q(4,1) dan syarat (2) untuk menentukan koordinat B!", math: "B = (4+1,\\; 1-4) = (5, -3)" },
      { label: "c.", text: "Verifikasi: nyatakan posisi Q terhadap B(5,−3) dan cek apakah sesuai syarat (2)!" },
      { label: "d.", text: "Nyatakan posisi B(5,−3) terhadap A(1,−1). Apa hubungan antara A, Q, dan B?" },
    ],
  }),
];

const accent = "violet";
const accentHex = "#a78bfa";

const PosisiRelatifTitikAcuanPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 border-2 border-violet-400/40 flex items-center justify-center mb-4">
            <Crosshair className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1">
            POSISI RELATIF SETIAP TITIK TERHADAP SEMBARANG TITIK ACUAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Koordinat Cartesius · Kelas 8 · Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-violet-400 text-sm">🎯</span>
            <span className="text-white/70 text-xs font-body">40 Soal · Posisi Relatif Titik Acuan</span>
            <span className="text-violet-400 text-sm">🎯</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q) => (
            <div
              key={q.n}
              className="rounded-2xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-900/30 to-purple-900/20 backdrop-blur"
            >
              <div className="flex items-center gap-3 px-5 py-3 border-b border-violet-500/15 bg-violet-500/10">
                <span className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
                  {q.n}
                </span>
                <span className="font-display text-sm font-bold text-violet-200">{q.title}</span>
              </div>

              <div className="px-5 py-4 space-y-3">
                {q.diagram && (
                  <div className="flex justify-center my-2">
                    <CoordPlane {...q.diagram} />
                  </div>
                )}

                {q.content && (
                  <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                )}

                {q.math && (
                  <div className="bg-white/5 rounded-xl px-4 py-2 text-center overflow-x-auto">
                    <BlockMath math={q.math} />
                  </div>
                )}

                {q.parts && (
                  <div className="space-y-2 mt-2">
                    {q.parts.map((p, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-violet-400 font-bold text-sm shrink-0 mt-0.5">{p.label}</span>
                        <div className="flex-1">
                          {p.text && <p className="text-white/75 text-sm font-body">{p.text}</p>}
                          {p.math && (
                            <div className="mt-1 overflow-x-auto">
                              <InlineMath math={p.math} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Koordinat Cartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosisiRelatifTitikAcuanPage;
