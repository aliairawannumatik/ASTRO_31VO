import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  Search, Hash, Divide, Equal, TrendingUp, DollarSign,
  Compass, Triangle, Square, Circle, Box, Cylinder,
  Repeat, BarChart2, Shuffle, List, FunctionSquare,
  BookOpen, ChevronDown, ChevronUp, Sigma, Percent,
  Layers, Scale
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

type RumusCategory = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  glow: string;
  rumus: {
    name: string;
    formula: string;
    description?: string;
  }[];
};

const rumusData: RumusCategory[] = [
  {
    id: "bilangan",
    title: "Bilangan",
    icon: <Hash className="w-5 h-5" />,
    color: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/40",
    glow: "shadow-cyan-500/20",
    rumus: [
      { name: "Penjumlahan", formula: "a + b = c", description: "Menjumlahkan dua bilangan" },
      { name: "Pengurangan", formula: "a - b = c", description: "Mengurangkan dua bilangan" },
      { name: "Perkalian", formula: "a \\times b = c", description: "Mengalikan dua bilangan" },
      { name: "Pembagian", formula: "a \\div b = c", description: "Membagi dua bilangan" },
      { name: "Pangkat", formula: "a^n = \\underbrace{a \\times a \\times \\cdots \\times a}_{n \\text{ kali}}", description: "Bilangan berpangkat" },
      { name: "Akar Kuadrat", formula: "\\sqrt{a} = b \\Leftrightarrow b^2 = a", description: "Akar kuadrat" },
      { name: "Akar Pangkat n", formula: "\\sqrt[n]{a} = b \\Leftrightarrow b^n = a", description: "Akar pangkat n" },
      { name: "Sifat Pangkat (kali)", formula: "a^m \\times a^n = a^{m+n}", description: "Basis sama, eksponen dijumlah" },
      { name: "Sifat Pangkat (bagi)", formula: "a^m \\div a^n = a^{m-n}", description: "Basis sama, eksponen dikurang" },
      { name: "Sifat Pangkat (kuadrat)", formula: "(a^m)^n = a^{m \\cdot n}", description: "Pangkat dari pangkat" },
      { name: "Pangkat Nol", formula: "a^0 = 1 \\quad (a \\neq 0)", description: "Setiap bilangan tak nol berpangkat 0 = 1" },
      { name: "Pangkat Negatif", formula: "a^{-n} = \\dfrac{1}{a^n} \\quad (a \\neq 0)", description: "Kebalikan pangkat positif" },
    ]
  },
  {
    id: "fpb-kpk",
    title: "FPB dan KPK",
    icon: <Layers className="w-5 h-5" />,
    color: "text-teal-300",
    bg: "bg-teal-500/10",
    border: "border-teal-500/40",
    glow: "shadow-teal-500/20",
    rumus: [
      { name: "FPB", formula: "\\text{FPB} = \\text{Faktorisasi prima dengan pangkat terkecil}", description: "Faktor Persekutuan Terbesar" },
      { name: "KPK", formula: "\\text{KPK} = \\text{Faktorisasi prima dengan pangkat terbesar}", description: "Kelipatan Persekutuan Terkecil" },
      { name: "Hubungan FPB dan KPK", formula: "a \\times b = \\text{FPB}(a,b) \\times \\text{KPK}(a,b)", description: "Hasil kali dua bilangan = FPB × KPK" },
    ]
  },
  {
    id: "pecahan",
    title: "Pecahan",
    icon: <Divide className="w-5 h-5" />,
    color: "text-sky-300",
    bg: "bg-sky-500/10",
    border: "border-sky-500/40",
    glow: "shadow-sky-500/20",
    rumus: [
      { name: "Penjumlahan (penyebut sama)", formula: "\\frac{a}{c} + \\frac{b}{c} = \\frac{a+b}{c}", description: "Penyebut sama" },
      { name: "Penjumlahan (penyebut beda)", formula: "\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}", description: "Penyebut berbeda" },
      { name: "Pengurangan", formula: "\\frac{a}{b} - \\frac{c}{d} = \\frac{ad - bc}{bd}", description: "Penyebut berbeda" },
      { name: "Perkalian", formula: "\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}", description: "Pembilang × pembilang, penyebut × penyebut" },
      { name: "Pembagian", formula: "\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}", description: "Kalikan dengan kebalikan" },
      { name: "Pecahan → Desimal", formula: "\\frac{a}{b} = a \\div b", description: "Bagi pembilang dengan penyebut" },
      { name: "Pecahan → Persen", formula: "\\frac{a}{b} = \\frac{a}{b} \\times 100\\%", description: "Kalikan dengan 100%" },
    ]
  },
  {
    id: "perbandingan",
    title: "Perbandingan",
    icon: <Scale className="w-5 h-5" />,
    color: "text-indigo-300",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/40",
    glow: "shadow-indigo-500/20",
    rumus: [
      { name: "Perbandingan", formula: "a : b = \\frac{a}{b}", description: "Perbandingan dua besaran" },
      { name: "Perbandingan Senilai", formula: "\\frac{a_1}{a_2} = \\frac{b_1}{b_2}", description: "Jika a naik, b ikut naik" },
      { name: "Perbandingan Berbalik Nilai", formula: "a_1 \\times b_1 = a_2 \\times b_2", description: "Jika a naik, b turun" },
      { name: "Skala", formula: "\\text{Skala} = \\frac{\\text{Jarak peta}}{\\text{Jarak sebenarnya}}", description: "Perbandingan jarak pada peta" },
    ]
  },
  {
    id: "aljabar",
    title: "Aljabar",
    icon: <FunctionSquare className="w-5 h-5" />,
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/40",
    glow: "shadow-violet-500/20",
    rumus: [
      { name: "Bentuk Aljabar", formula: "ax + by + c", description: "Bentuk umum aljabar" },
      { name: "Penjumlahan Suku Sejenis", formula: "ax + bx = (a+b)x", description: "Jumlahkan koefisien suku sejenis" },
      { name: "Perkalian Konstanta", formula: "k(ax + b) = kax + kb", description: "Distributif" },
      { name: "Perkalian Dua Suku", formula: "(a+b)(c+d) = ac + ad + bc + bd", description: "FOIL method" },
      { name: "Kuadrat Jumlah", formula: "(a+b)^2 = a^2 + 2ab + b^2", description: "Kuadrat dari jumlah" },
      { name: "Kuadrat Selisih", formula: "(a-b)^2 = a^2 - 2ab + b^2", description: "Kuadrat dari selisih" },
      { name: "Selisih Kuadrat", formula: "a^2 - b^2 = (a+b)(a-b)", description: "Faktorisasi selisih kuadrat" },
    ]
  },
  {
    id: "plsv",
    title: "Persamaan Linear",
    icon: <Equal className="w-5 h-5" />,
    color: "text-purple-300",
    bg: "bg-purple-500/10",
    border: "border-purple-500/40",
    glow: "shadow-purple-500/20",
    rumus: [
      { name: "PLSV", formula: "ax + b = c \\Rightarrow x = \\frac{c-b}{a}", description: "Persamaan Linear Satu Variabel" },
      { name: "PtLSV", formula: "ax + b < c \\text{ atau } ax + b > c", description: "Pertidaksamaan Linear Satu Variabel" },
      { name: "SPLDV", formula: "\\begin{cases} ax + by = c \\\\ dx + ey = f \\end{cases}", description: "Sistem dua variabel" },
      { name: "SPLDV Eliminasi", formula: "\\text{Samakan koefisien salah satu variabel}", description: "Eliminasi salah satu variabel" },
    ]
  },
  {
    id: "fungsi",
    title: "Relasi dan Fungsi",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-fuchsia-300",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/40",
    glow: "shadow-fuchsia-500/20",
    rumus: [
      { name: "Fungsi Linear", formula: "f(x) = ax + b", description: "Bentuk umum fungsi linear" },
      { name: "Nilai Fungsi", formula: "f(c) = ac + b", description: "Substitusi x = c" },
      { name: "Fungsi Kuadrat", formula: "f(x) = ax^2 + bx + c", description: "Bentuk umum fungsi kuadrat" },
      { name: "Titik Puncak", formula: "x_p = -\\frac{b}{2a}, \\quad y_p = -\\frac{b^2-4ac}{4a}", description: "Koordinat titik puncak parabola" },
      { name: "Sumbu Simetri", formula: "x = -\\frac{b}{2a}", description: "Sumbu simetri parabola" },
    ]
  },
  {
    id: "persamaan-garis",
    title: "Persamaan Garis Lurus",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-pink-300",
    bg: "bg-pink-500/10",
    border: "border-pink-500/40",
    glow: "shadow-pink-500/20",
    rumus: [
      { name: "Bentuk Umum", formula: "y = mx + c", description: "m = gradien, c = konstanta" },
      { name: "Gradien", formula: "m = \\frac{y_2 - y_1}{x_2 - x_1}", description: "Kemiringan garis" },
      { name: "Melalui Satu Titik", formula: "y - y_1 = m(x - x_1)", description: "Titik (x₁, y₁) dengan gradien m" },
      { name: "Melalui Dua Titik", formula: "\\frac{y - y_1}{y_2 - y_1} = \\frac{x - x_1}{x_2 - x_1}", description: "Melalui (x₁, y₁) dan (x₂, y₂)" },
      { name: "Garis Sejajar", formula: "m_1 = m_2", description: "Gradien sama" },
      { name: "Garis Tegak Lurus", formula: "m_1 \\times m_2 = -1", description: "Hasil kali gradien = −1" },
    ]
  },
  {
    id: "aritmetika-sosial",
    title: "Aritmetika Sosial",
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-rose-300",
    bg: "bg-rose-500/10",
    border: "border-rose-500/40",
    glow: "shadow-rose-500/20",
    rumus: [
      { name: "Untung", formula: "U = H_j - H_b", description: "Harga jual > Harga beli" },
      { name: "Rugi", formula: "R = H_b - H_j", description: "Harga jual < Harga beli" },
      { name: "% Untung", formula: "\\%U = \\frac{U}{H_b} \\times 100\\%", description: "Persentase keuntungan" },
      { name: "% Rugi", formula: "\\%R = \\frac{R}{H_b} \\times 100\\%", description: "Persentase kerugian" },
      { name: "Harga Jual (Untung)", formula: "H_j = H_b \\left(1 + \\frac{\\%U}{100}\\right)", description: "Jika untung" },
      { name: "Harga Jual (Rugi)", formula: "H_j = H_b \\left(1 - \\frac{\\%R}{100}\\right)", description: "Jika rugi" },
      { name: "Diskon", formula: "\\text{H. Akhir} = \\text{H. Awal} \\times \\left(1 - \\frac{d}{100}\\right)", description: "Potongan harga" },
      { name: "Bunga Tunggal", formula: "B = \\frac{M \\times p \\times t}{100}", description: "M = Modal, p = %, t = tahun" },
      { name: "Bruto = Netto + Tara", formula: "\\text{Bruto} = \\text{Netto} + \\text{Tara}", description: "Berat kotor = bersih + kemasan" },
    ]
  },
  {
    id: "sudut-garis",
    title: "Garis dan Sudut",
    icon: <Compass className="w-5 h-5" />,
    color: "text-orange-300",
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
    glow: "shadow-orange-500/20",
    rumus: [
      { name: "Sudut Berpelurus", formula: "\\alpha + \\beta = 180°", description: "Jumlah sudut = 180°" },
      { name: "Sudut Berpenyiku", formula: "\\alpha + \\beta = 90°", description: "Jumlah sudut = 90°" },
      { name: "Sudut Bertolak Belakang", formula: "\\alpha = \\beta", description: "Sudut yang saling berhadapan" },
      { name: "Sudut Sehadap", formula: "\\alpha = \\beta", description: "Garis sejajar dipotong transversal" },
      { name: "Sudut Berseberangan", formula: "\\alpha = \\beta", description: "Sudut dalam berseberangan sama besar" },
      { name: "Sudut Sepihak", formula: "\\alpha + \\beta = 180°", description: "Sudut dalam sepihak berpelurus" },
    ]
  },
  {
    id: "segitiga",
    title: "Segitiga",
    icon: <Triangle className="w-5 h-5" />,
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/40",
    glow: "shadow-amber-500/20",
    rumus: [
      { name: "Keliling", formula: "K = a + b + c", description: "Jumlah semua sisi" },
      { name: "Luas", formula: "L = \\frac{1}{2} \\times a \\times t", description: "a = alas, t = tinggi" },
      { name: "Luas (Sinus)", formula: "L = \\frac{1}{2} \\times a \\times b \\times \\sin C", description: "Dua sisi dan sudut apit" },
      { name: "Rumus Heron", formula: "L = \\sqrt{s(s-a)(s-b)(s-c)}", description: "s = (a+b+c)/2" },
      { name: "Jumlah Sudut", formula: "\\alpha + \\beta + \\gamma = 180°", description: "Jumlah sudut dalam = 180°" },
      { name: "Teorema Pythagoras", formula: "c^2 = a^2 + b^2", description: "Segitiga siku-siku" },
      { name: "Tripel Pythagoras", formula: "(3,4,5),\\ (5,12,13),\\ (8,15,17),\\ (7,24,25)", description: "Tripel bilangan bulat" },
    ]
  },
  {
    id: "segiempat",
    title: "Segiempat",
    icon: <Square className="w-5 h-5" />,
    color: "text-yellow-300",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
    glow: "shadow-yellow-500/20",
    rumus: [
      { name: "Luas Persegi", formula: "L = s^2", description: "s = sisi" },
      { name: "Keliling Persegi", formula: "K = 4s", description: "s = sisi" },
      { name: "Luas Persegi Panjang", formula: "L = p \\times l", description: "p = panjang, l = lebar" },
      { name: "Keliling Persegi Panjang", formula: "K = 2(p + l)", description: "p = panjang, l = lebar" },
      { name: "Luas Jajar Genjang", formula: "L = a \\times t", description: "a = alas, t = tinggi" },
      { name: "Luas Belah Ketupat", formula: "L = \\frac{1}{2} \\times d_1 \\times d_2", description: "d₁, d₂ = diagonal" },
      { name: "Luas Layang-layang", formula: "L = \\frac{1}{2} \\times d_1 \\times d_2", description: "d₁, d₂ = diagonal" },
      { name: "Luas Trapesium", formula: "L = \\frac{1}{2} \\times (a + b) \\times t", description: "a, b = sisi sejajar, t = tinggi" },
    ]
  },
  {
    id: "lingkaran",
    title: "Lingkaran",
    icon: <Circle className="w-5 h-5" />,
    color: "text-lime-300",
    bg: "bg-lime-500/10",
    border: "border-lime-500/40",
    glow: "shadow-lime-500/20",
    rumus: [
      { name: "Keliling", formula: "K = 2\\pi r = \\pi d", description: "r = jari-jari, d = diameter" },
      { name: "Luas", formula: "L = \\pi r^2", description: "r = jari-jari" },
      { name: "Panjang Busur", formula: "\\ell = \\frac{\\theta}{360°} \\times 2\\pi r", description: "θ = sudut pusat" },
      { name: "Luas Juring", formula: "L_{juring} = \\frac{\\theta}{360°} \\times \\pi r^2", description: "θ = sudut pusat" },
      { name: "Luas Tembereng", formula: "L_{tmb} = L_{juring} - L_{\\triangle}", description: "Selisih luas juring dan segitiga" },
      { name: "Garis Singgung", formula: "d = \\sqrt{r_1^2 + r_2^2}", description: "Panjang GSP dalam" },
    ]
  },
  {
    id: "brsd",
    title: "Bangun Ruang Sisi Datar",
    icon: <Box className="w-5 h-5" />,
    color: "text-green-300",
    bg: "bg-green-500/10",
    border: "border-green-500/40",
    glow: "shadow-green-500/20",
    rumus: [
      { name: "Volume Kubus", formula: "V = s^3", description: "s = sisi" },
      { name: "Luas Permukaan Kubus", formula: "L = 6s^2", description: "s = sisi" },
      { name: "Diagonal Ruang Kubus", formula: "d = s\\sqrt{3}", description: "s = sisi" },
      { name: "Volume Balok", formula: "V = p \\times l \\times t", description: "p = panjang, l = lebar, t = tinggi" },
      { name: "Luas Permukaan Balok", formula: "L = 2(pl + pt + lt)", description: "p, l, t = dimensi balok" },
      { name: "Diagonal Ruang Balok", formula: "d = \\sqrt{p^2 + l^2 + t^2}", description: "p, l, t = dimensi balok" },
      { name: "Volume Prisma", formula: "V = L_{alas} \\times t", description: "Luas alas × tinggi" },
      { name: "Luas Permukaan Prisma", formula: "L = 2L_{alas} + K_{alas} \\times t", description: "Dua alas + selimut" },
      { name: "Volume Limas", formula: "V = \\frac{1}{3} \\times L_{alas} \\times t", description: "⅓ × luas alas × tinggi" },
    ]
  },
  {
    id: "brsl",
    title: "Bangun Ruang Sisi Lengkung",
    icon: <Cylinder className="w-5 h-5" />,
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    glow: "shadow-emerald-500/20",
    rumus: [
      { name: "Volume Tabung", formula: "V = \\pi r^2 t", description: "r = jari-jari, t = tinggi" },
      { name: "Luas Permukaan Tabung", formula: "L = 2\\pi r(r + t)", description: "r = jari-jari, t = tinggi" },
      { name: "Selimut Tabung", formula: "L_s = 2\\pi r t", description: "r = jari-jari, t = tinggi" },
      { name: "Volume Kerucut", formula: "V = \\frac{1}{3}\\pi r^2 t", description: "r = jari-jari, t = tinggi" },
      { name: "Luas Permukaan Kerucut", formula: "L = \\pi r(r + s)", description: "s = garis pelukis" },
      { name: "Garis Pelukis", formula: "s = \\sqrt{r^2 + t^2}", description: "r = jari-jari, t = tinggi" },
      { name: "Volume Bola", formula: "V = \\frac{4}{3}\\pi r^3", description: "r = jari-jari" },
      { name: "Luas Permukaan Bola", formula: "L = 4\\pi r^2", description: "r = jari-jari" },
    ]
  },
  {
    id: "kesebangunan",
    title: "Kesebangunan",
    icon: <Repeat className="w-5 h-5" />,
    color: "text-teal-300",
    bg: "bg-teal-500/10",
    border: "border-teal-500/40",
    glow: "shadow-teal-500/20",
    rumus: [
      { name: "Syarat Kesebangunan", formula: "\\frac{AB}{DE} = \\frac{BC}{EF} = \\frac{AC}{DF}", description: "Sisi-sisi bersesuaian sebanding" },
      { name: "Sudut Kesebangunan", formula: "\\angle A = \\angle D,\\ \\angle B = \\angle E,\\ \\angle C = \\angle F", description: "Sudut bersesuaian sama besar" },
      { name: "Kekongruenan", formula: "\\triangle ABC \\cong \\triangle DEF", description: "Bentuk dan ukuran sama" },
      { name: "Perbandingan Luas", formula: "\\frac{L_1}{L_2} = \\left(\\frac{s_1}{s_2}\\right)^2", description: "Kuadrat perbandingan sisi" },
      { name: "Perbandingan Volume", formula: "\\frac{V_1}{V_2} = \\left(\\frac{s_1}{s_2}\\right)^3", description: "Pangkat tiga perbandingan sisi" },
    ]
  },
  {
    id: "transformasi",
    title: "Transformasi Geometri",
    icon: <Shuffle className="w-5 h-5" />,
    color: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/40",
    glow: "shadow-cyan-500/20",
    rumus: [
      { name: "Translasi", formula: "T(a,b): (x,y) \\to (x+a,\\ y+b)", description: "Pergeseran" },
      { name: "Refleksi Sumbu X", formula: "(x,y) \\to (x,\\ -y)", description: "Pencerminan terhadap sumbu x" },
      { name: "Refleksi Sumbu Y", formula: "(x,y) \\to (-x,\\ y)", description: "Pencerminan terhadap sumbu y" },
      { name: "Refleksi y = x", formula: "(x,y) \\to (y,\\ x)", description: "Pencerminan terhadap y = x" },
      { name: "Refleksi y = −x", formula: "(x,y) \\to (-y,\\ -x)", description: "Pencerminan terhadap y = −x" },
      { name: "Refleksi Titik O", formula: "(x,y) \\to (-x,\\ -y)", description: "Pencerminan terhadap O(0,0)" },
      { name: "Rotasi 90° ↺", formula: "(x,y) \\to (-y,\\ x)", description: "Berlawanan arah jarum jam" },
      { name: "Rotasi 90° ↻", formula: "(x,y) \\to (y,\\ -x)", description: "Searah jarum jam" },
      { name: "Rotasi 180°", formula: "(x,y) \\to (-x,\\ -y)", description: "Rotasi 180° terhadap titik O" },
      { name: "Dilatasi", formula: "D_{O,k}: (x,y) \\to (kx,\\ ky)", description: "Perbesaran/pengecilan faktor k" },
    ]
  },
  {
    id: "statistika",
    title: "Statistika",
    icon: <BarChart2 className="w-5 h-5" />,
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    border: "border-blue-500/40",
    glow: "shadow-blue-500/20",
    rumus: [
      { name: "Mean (Rata-rata)", formula: "\\bar{x} = \\frac{\\sum x_i}{n}", description: "Jumlah data ÷ banyak data" },
      { name: "Median (Data Ganjil)", formula: "Me = x_{\\frac{n+1}{2}}", description: "Nilai tengah data ganjil" },
      { name: "Median (Data Genap)", formula: "Me = \\frac{x_{\\frac{n}{2}} + x_{\\frac{n}{2}+1}}{2}", description: "Rata-rata dua nilai tengah" },
      { name: "Modus", formula: "Mo = \\text{nilai dengan frekuensi tertinggi}", description: "Paling sering muncul" },
      { name: "Jangkauan", formula: "J = x_{\\max} - x_{\\min}", description: "Selisih terbesar dan terkecil" },
      { name: "Kuartil Bawah Q₁", formula: "Q_1 = \\text{Median dari data di bawah median}", description: "Kuartil pertama" },
      { name: "Kuartil Atas Q₃", formula: "Q_3 = \\text{Median dari data di atas median}", description: "Kuartil ketiga" },
      { name: "Jangkauan Interkuartil", formula: "IQR = Q_3 - Q_1", description: "Selisih kuartil atas dan bawah" },
    ]
  },
  {
    id: "peluang",
    title: "Peluang",
    icon: <Percent className="w-5 h-5" />,
    color: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-500/40",
    glow: "shadow-red-500/20",
    rumus: [
      { name: "Peluang", formula: "P(A) = \\frac{n(A)}{n(S)}", description: "n(A) = banyak kejadian A, n(S) = ruang sampel" },
      { name: "Komplemen", formula: "P(A') = 1 - P(A)", description: "Peluang bukan A" },
      { name: "Peluang Gabungan", formula: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", description: "A atau B" },
      { name: "Kejadian Saling Lepas", formula: "P(A \\cup B) = P(A) + P(B)", description: "Jika A dan B saling lepas" },
      { name: "Peluang Bersyarat", formula: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}", description: "Peluang A jika B terjadi" },
      { name: "Kejadian Bebas", formula: "P(A \\cap B) = P(A) \\times P(B)", description: "A dan B saling bebas" },
      { name: "Frekuensi Harapan", formula: "f_h = n \\times P(A)", description: "n = banyak percobaan" },
    ]
  },
  {
    id: "pola-bilangan",
    title: "Pola Bilangan",
    icon: <List className="w-5 h-5" />,
    color: "text-orange-300",
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
    glow: "shadow-orange-500/20",
    rumus: [
      { name: "Barisan Aritmatika", formula: "U_n = a + (n-1)b", description: "a = suku pertama, b = beda" },
      { name: "Deret Aritmatika", formula: "S_n = \\frac{n}{2}(2a + (n-1)b)", description: "Jumlah n suku pertama" },
      { name: "Barisan Geometri", formula: "U_n = a \\cdot r^{n-1}", description: "a = suku pertama, r = rasio" },
      { name: "Deret Geometri (r < 1)", formula: "S_n = \\frac{a(1-r^n)}{1-r}", description: "Jumlah n suku" },
      { name: "Deret Geometri (r > 1)", formula: "S_n = \\frac{a(r^n-1)}{r-1}", description: "Jumlah n suku" },
      { name: "Deret Geometri Tak Hingga", formula: "S_\\infty = \\frac{a}{1-r}, \\quad |r| < 1", description: "Jumlah tak hingga" },
    ]
  },
  {
    id: "persamaan-kuadrat",
    title: "Persamaan Kuadrat",
    icon: <Sigma className="w-5 h-5" />,
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/40",
    glow: "shadow-violet-500/20",
    rumus: [
      { name: "Bentuk Umum", formula: "ax^2 + bx + c = 0 \\quad (a \\neq 0)", description: "" },
      { name: "Rumus ABC", formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", description: "Mencari akar-akar" },
      { name: "Diskriminan", formula: "D = b^2 - 4ac", description: "D>0: 2 real beda · D=0: kembar · D<0: tidak real" },
      { name: "Jumlah Akar", formula: "x_1 + x_2 = -\\frac{b}{a}", description: "Jumlah kedua akar" },
      { name: "Hasil Kali Akar", formula: "x_1 \\times x_2 = \\frac{c}{a}", description: "Hasil kali kedua akar" },
      { name: "Faktorisasi", formula: "ax^2 + bx + c = a(x - x_1)(x - x_2)", description: "Bentuk faktorisasi" },
    ]
  },
];

const totalRumus = rumusData.reduce((sum, cat) => sum + cat.rumus.length, 0);

type GroupSection = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  categoryIds: string[];
};

const groupSections: GroupSection[] = [
  {
    id: "numerasi",
    label: "Bilangan & Operasi",
    emoji: "🔢",
    color: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    categoryIds: ["bilangan", "fpb-kpk", "pecahan", "perbandingan"],
  },
  {
    id: "aljabar-fungsi",
    label: "Aljabar & Fungsi",
    emoji: "📐",
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    categoryIds: ["aljabar", "plsv", "fungsi", "persamaan-garis", "aritmetika-sosial", "pola-bilangan", "persamaan-kuadrat"],
  },
  {
    id: "geometri",
    label: "Geometri & Pengukuran",
    emoji: "📏",
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    categoryIds: ["sudut-garis", "segitiga", "segiempat", "lingkaran", "brsd", "brsl", "kesebangunan", "transformasi"],
  },
  {
    id: "statistika-peluang",
    label: "Statistika & Peluang",
    emoji: "📊",
    color: "text-orange-300",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    categoryIds: ["statistika", "peluang"],
  },
];

const renderCategoryCard = (
  category: RumusCategory,
  isOpen: boolean,
  toggleCategory: (id: string) => void,
  t: (key: string, opts?: Record<string, unknown>) => string
) => (
  <div
    key={category.id}
    id={`cat-${category.id}`}
    className={`rounded-xl overflow-hidden border transition-all duration-300 ${
      isOpen
        ? `${category.border} ${category.bg}`
        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20"
    }`}
  >
    <button
      onClick={() => toggleCategory(category.id)}
      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
          isOpen ? `${category.bg} ${category.border} ${category.color}` : "bg-white/5 border-white/10 text-white/60"
        }`}>
          {category.icon}
        </div>
        <div className="min-w-0 text-left">
          <div className={`font-display text-sm md:text-base font-bold transition-colors truncate ${
            isOpen ? category.color : "text-white/90"
          }`}>
            {t(`formulas.categories.${category.id}`)}
          </div>
          <div className="text-[11px] text-white/40 mt-0.5">
            {category.rumus.length} {t("formulas.suffixRumus")}
          </div>
        </div>
      </div>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
        isOpen ? `${category.bg} border ${category.border}` : "bg-white/5 border border-white/10"
      }`}>
        {isOpen
          ? <ChevronUp className={`w-4 h-4 ${category.color}`} />
          : <ChevronDown className="w-4 h-4 text-white/50" />
        }
      </div>
    </button>

    {isOpen && (
      <div className="px-3 pb-3">
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
          {/* Table header */}
          <div className={`grid grid-cols-[2rem_1fr_1.6fr_1.2fr] gap-0 border-b ${category.border} ${category.bg}`}>
            <div className={`px-3 py-2.5 text-[10px] font-black uppercase tracking-widest ${category.color} opacity-70 flex items-center justify-center`}>
              No
            </div>
            <div className={`px-3 py-2.5 text-[10px] font-black uppercase tracking-widest ${category.color} opacity-70 flex items-center border-l border-white/10`}>
              {t("formulas.colName")}
            </div>
            <div className={`px-3 py-2.5 text-[10px] font-black uppercase tracking-widest ${category.color} opacity-70 flex items-center border-l border-white/10`}>
              {t("formulas.colFormula")}
            </div>
            <div className={`px-3 py-2.5 text-[10px] font-black uppercase tracking-widest ${category.color} opacity-70 flex items-center border-l border-white/10`}>
              {t("formulas.colDesc")}
            </div>
          </div>

          {/* Table rows */}
          {category.rumus.map((rumus, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-[2rem_1fr_1.6fr_1.2fr] gap-0 border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] transition-colors ${
                idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
              }`}
            >
              {/* No */}
              <div className={`px-2 py-3 flex items-center justify-center text-[10px] font-mono font-bold tabular-nums ${category.color} opacity-40 shrink-0`}>
                {String(idx + 1).padStart(2, "0")}
              </div>

              {/* Nama Rumus */}
              <div className={`px-3 py-3 flex items-center border-l border-white/5`}>
                <span className={`text-xs font-semibold font-display leading-snug ${category.color}`}>
                  {rumus.name}
                </span>
              </div>

              {/* Rumus */}
              <div className="px-3 py-2 flex items-center border-l border-white/5 overflow-x-auto">
                <div className="text-white text-sm min-w-fit">
                  <BlockMath math={rumus.formula} />
                </div>
              </div>

              {/* Keterangan */}
              <div className="px-3 py-3 flex items-center border-l border-white/5">
                {rumus.description
                  ? <span className="text-[11px] text-white/50 leading-snug">{rumus.description}</span>
                  : <span className="text-[11px] text-white/20 italic">—</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const KumpulanRumusPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expandedCategory, setExpandedCategory] = useState<string | null>("bilangan");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleCategory = (categoryId: string) => {
    playPopSound();
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const jumpToGroup = (groupId: string) => {
    playPopSound();
    setActiveGroup(groupId);
    if (groupId !== "all") {
      setTimeout(() => {
        const el = document.getElementById(`group-${groupId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const filteredData = rumusData.filter(category => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (category.title.toLowerCase().includes(query)) return true;
    return category.rumus.some(r =>
      r.name.toLowerCase().includes(query) ||
      (r.description && r.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl scale-150" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <BookOpen className="w-8 h-8 text-cyan-300" />
            </div>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            {t("formulas.title")}
          </h1>
          <p className="text-white/50 text-sm font-body text-center mb-4">{t("formulas.subtitle")}</p>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-medium">
              <Layers className="w-3.5 h-3.5" />
              {rumusData.length} {t("formulas.suffixKategori")}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs text-violet-300 font-medium">
              <Sigma className="w-3.5 h-3.5" />
              {totalRumus} {t("formulas.suffixRumus")}
            </div>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-5 group">
          <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors z-10" />
          <input
            type="text"
            placeholder={t("formulas.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full bg-white/5 backdrop-blur border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-cyan-500/60 focus:bg-white/8 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Group Filter Pills ── */}
        {!searchQuery && (
          <div
            ref={tabsRef}
            className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              onClick={() => jumpToGroup("all")}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold border transition-all ${
                activeGroup === "all"
                  ? "bg-white/10 border-white/30 text-white"
                  : "bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80 hover:bg-white/8"
              }`}
            >
              <span className="text-sm">📚</span>
              <span className="tracking-wide uppercase">{t("formulas.allGroups")}</span>
            </button>
            {groupSections.map((group) => (
              <button
                key={group.id}
                onClick={() => jumpToGroup(group.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold border transition-all ${
                  activeGroup === group.id
                    ? `${group.bg} ${group.border} ${group.color}`
                    : "bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80 hover:bg-white/8"
                }`}
              >
                <span className="text-sm">{group.emoji}</span>
                <span className="tracking-wide uppercase">{t(`formulas.groups.${group.id}`)}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Category Cards ── */}
        <div className="space-y-8">
          {filteredData.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t("formulas.noResults", { query: searchQuery })}</p>
            </div>
          )}

          {searchQuery ? (
            <div className="space-y-3">
              {filteredData.map((category) => {
                const isOpen = expandedCategory === category.id;
                return renderCategoryCard(category, isOpen, toggleCategory);
              })}
            </div>
          ) : (
            groupSections
              .filter((group) => activeGroup === "all" || activeGroup === group.label)
              .map((group) => {
                const groupCategories = rumusData.filter(c => group.categoryIds.includes(c.id));
                if (groupCategories.length === 0) return null;
                const totalGroupRumus = groupCategories.reduce((s, c) => s + c.rumus.length, 0);
                return (
                  <section key={group.id} id={`group-${group.id}`}>
                    {/* Section Banner */}
                    <div className={`relative rounded-2xl overflow-hidden border ${group.border} ${group.bg} mb-4`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] to-transparent pointer-events-none" />
                      <div className="relative flex items-center gap-3 px-5 py-4">
                        <div className={`w-12 h-12 rounded-xl ${group.bg} border ${group.border} flex items-center justify-center text-2xl shrink-0`}>
                          {group.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className={`font-display text-base md:text-lg font-black tracking-wide ${group.color} leading-tight`}>
                            {group.label}
                          </h2>
                          <p className="text-[11px] text-white/45 mt-0.5">
                            {groupCategories.length} kategori &middot; {totalGroupRumus} rumus
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Categories in this group */}
                    <div className="space-y-2">
                      {groupCategories.map((category) => {
                        const isOpen = expandedCategory === category.id;
                        return renderCategoryCard(category, isOpen, toggleCategory);
                      })}
                    </div>
                  </section>
                );
              })
          )}
        </div>

        {/* ── Footer ── */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-white/30 hover:text-cyan-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default KumpulanRumusPage;
