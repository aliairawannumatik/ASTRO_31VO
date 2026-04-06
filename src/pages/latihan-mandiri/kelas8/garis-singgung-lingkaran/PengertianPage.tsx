import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Circle } from "lucide-react";
import GSLDiagram from "./GSLDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  difficulty?: "Mudah" | "Sedang" | "Sulit";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Definisi Garis Singgung Lingkaran", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="tangent-basic" size={220} />,
    content: "Perhatikan gambar di atas. Garis singgung lingkaran adalah garis yang menyentuh lingkaran hanya di satu titik.",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan garis singgung lingkaran?" },
      { label: "b.", text: "Berapa banyak titik persekutuan antara garis singgung dan lingkaran?" },
      { label: "c.", text: "Apa nama titik pertemuan antara garis singgung dan lingkaran?" },
    ],
  }),
  Qn(2, "Sifat Tegak Lurus Garis Singgung", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="tangent-basic" size={220} color="#34d399" />,
    content: "Sifat penting: Garis singgung lingkaran tegak lurus dengan jari-jari yang ditarik ke titik singgung.",
    parts: [
      { label: "a.", text: "Jika T adalah titik singgung dan O pusat lingkaran, bagaimana hubungan OT dengan garis singgung?" },
      { label: "b.", math: "\\text{Berapa besar sudut antara OT dan garis singgung di titik T?}" },
      { label: "c.", text: "Mengapa sifat tegak lurus ini penting dalam menyelesaikan soal?" },
    ],
  }),
  Qn(3, "Garis Singgung Melalui Titik pada Lingkaran", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="tangent-basic" size={220} color="#a78bfa" />,
    content: "Titik A terletak pada lingkaran dengan pusat O dan jari-jari r. Garis singgung ditarik di titik A.",
    parts: [
      { label: "a.", text: "Berapa banyak garis singgung yang dapat ditarik melalui titik A yang terletak pada lingkaran?" },
      { label: "b.", text: "Bagaimana cara menentukan posisi garis singgung tersebut?" },
      { label: "c.", math: "\\text{Jika } r = 7 \\text{ cm, berapa panjang } OA?" },
    ],
  }),
  Qn(4, "Garis Singgung dari Titik di Luar Lingkaran", {
    difficulty: "Mudah",
    diagram: <GSLDiagram variant="tangent-two" size={220} />,
    content: "Titik P berada di luar lingkaran. Dari P dapat ditarik dua garis singgung PA dan PB.",
    parts: [
      { label: "a.", text: "Berapa banyak garis singgung yang dapat ditarik dari titik di luar lingkaran?" },
      { label: "b.", text: "Apa hubungan panjang PA dan PB?" },
      { label: "c.", text: "Mengapa PA = PB? Jelaskan dengan dalil segitiga." },
    ],
  }),
  Qn(5, "Garis Singgung dari Titik di Dalam Lingkaran", {
    difficulty: "Mudah",
    content: "Sebuah titik Q berada di dalam lingkaran.",
    parts: [
      { label: "a.", text: "Berapa banyak garis singgung yang dapat ditarik dari titik Q yang berada di dalam lingkaran?" },
      { label: "b.", text: "Jelaskan mengapa tidak ada garis singgung yang bisa ditarik dari titik di dalam lingkaran." },
      { label: "c.", text: "Apa perbedaan posisi titik yang di dalam, pada, dan di luar lingkaran terhadap kemungkinan membuat garis singgung?" },
    ],
  }),
  Qn(6, "Membuktikan Sifat Tegak Lurus", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-right-angle" size={220} />,
    content: "Pada gambar, OT adalah jari-jari dan PT adalah garis singgung di titik T.",
    parts: [
      { label: "a.", math: "\\angle OTP = \\ldots ^\\circ" },
      { label: "b.", text: "Sebutkan dalil/teorema yang menjamin OT ⊥ PT." },
      { label: "c.", math: "\\text{Jika } OT = 5 \\text{ dan } OP = 13, \\text{ hitung } PT" },
    ],
  }),
  Qn(7, "Segitiga yang Dibentuk Garis Singgung", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-right-angle" size={220} color="#fb923c" />,
    content: "Titik P di luar lingkaran, T titik singgung, O pusat. Segitiga OTP terbentuk.",
    parts: [
      { label: "a.", math: "\\angle OTP = 90^\\circ. \\text{ Jenis segitiga OTP adalah ...}" },
      { label: "b.", math: "\\text{Gunakan Pythagoras: } PT^2 = OP^2 - OT^2" },
      { label: "c.", math: "\\text{Jika } OT = 6, OP = 10, \\text{ maka } PT = \\ldots" },
    ],
  }),
  Qn(8, "Dua Garis Singgung Sama Panjang", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-two" size={220} color="#f472b6" />,
    content: "Dari titik P di luar lingkaran ditarik dua garis singgung PA dan PB.",
    parts: [
      { label: "a.", text: "Buktikan bahwa PA = PB menggunakan kekongruenan segitiga." },
      { label: "b.", math: "\\text{Segitiga OAP } \\cong \\text{ Segitiga OBP karena ...}" },
      { label: "c.", math: "\\text{Jika } PA = 3x - 5 \\text{ dan } PB = x + 7, \\text{ tentukan } x" },
    ],
  }),
  Qn(9, "Sudut yang Dibentuk Dua Garis Singgung", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-two" size={220} color="#facc15" />,
    content: "Dari titik P di luar lingkaran dibuat dua garis singgung PA dan PB. Sudut APB = 60°.",
    parts: [
      { label: "a.", math: "\\angle APO = \\angle BPO = \\ldots ^\\circ" },
      { label: "b.", math: "\\angle AOP = \\ldots ^\\circ \\text{ (dalam segitiga OAP)}" },
      { label: "c.", math: "\\angle AOB = \\ldots ^\\circ" },
    ],
  }),
  Qn(10, "Titik Singgung dan Jari-Jari", {
    difficulty: "Mudah",
    content: "Lingkaran dengan pusat O dan jari-jari 10 cm. Garis singgung menyentuh lingkaran di titik T.",
    parts: [
      { label: "a.", text: "Tuliskan hubungan antara OT dan garis singgung di T." },
      { label: "b.", math: "\\text{Berapa besar } \\angle OTP \\text{ jika P adalah titik lain pada garis singgung?}" },
      { label: "c.", text: "Jika diketahui OP = 26 cm, hitung panjang garis singgung PT." },
    ],
  }),
  Qn(11, "Menentukan Titik Singgung", {
    difficulty: "Sedang",
    content: "Lingkaran berpusat di O(0, 0) dengan jari-jari 5 cm. Garis singgung ditarik dari titik P(13, 0).",
    parts: [
      { label: "a.", math: "OP = \\sqrt{13^2 + 0^2} = \\ldots" },
      { label: "b.", math: "PT = \\sqrt{OP^2 - r^2} = \\sqrt{169 - 25} = \\ldots" },
      { label: "c.", text: "Berapa jumlah garis singgung yang dapat ditarik dari P? Mengapa?" },
    ],
  }),
  Qn(12, "Sifat Simetri Garis Singgung", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-two" size={220} color="#34d399" />,
    content: "Dari titik P di luar lingkaran ditarik PA dan PB sebagai garis singgung.",
    parts: [
      { label: "a.", text: "Apakah garis OP merupakan sumbu simetri dari konfigurasi PA dan PB? Jelaskan." },
      { label: "b.", math: "\\angle APO = \\angle BPO \\text{ (mengapa?)}" },
      { label: "c.", text: "Sebutkan dua pasang sudut yang sama besar dalam gambar tersebut." },
    ],
  }),
  Qn(13, "Garis Singgung dan Busur", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-chord" size={220} />,
    content: "Garis PT adalah garis singgung di P. PA dan PB adalah tali busur dari P.",
    parts: [
      { label: "a.", text: "Sebutkan nama sudut yang dibentuk garis singgung dan tali busur." },
      { label: "b.", math: "\\text{Sudut antara garis singgung dan tali busur} = \\frac{1}{2} \\times \\text{busur yang dicakup}" },
      { label: "c.", text: "Apa dalil yang mengatur besar sudut ini? (Dalil Sudut Keliling dan Tali Busur)" },
    ],
  }),
  Qn(14, "Jumlah Sudut dalam Segiempat Tali Busur", {
    difficulty: "Sulit",
    content: "Titik A, B, C, D terletak pada lingkaran. ABCD adalah segiempat tali busur.",
    parts: [
      { label: "a.", math: "\\angle A + \\angle C = \\ldots ^\\circ" },
      { label: "b.", math: "\\angle B + \\angle D = \\ldots ^\\circ" },
      { label: "c.", text: "Bagaimana hubungan ini berkaitan dengan sifat garis singgung lingkaran?" },
    ],
  }),
  Qn(15, "Persamaan Garis Singgung – Pemahaman", {
    difficulty: "Sedang",
    content: "Lingkaran dengan pusat O(0, 0) dan jari-jari r. Titik T(x₀, y₀) berada pada lingkaran.",
    parts: [
      { label: "a.", math: "x_0^2 + y_0^2 = r^2 \\text{ (T pada lingkaran)}" },
      { label: "b.", math: "\\text{Persamaan garis singgung di T: } x_0 x + y_0 y = r^2" },
      { label: "c.", math: "\\text{Jika } T(3, 4), r = 5, \\text{ tuliskan persamaan garis singgung di T}" },
    ],
  }),
  Qn(16, "Garis Singgung – Soal UN", {
    difficulty: "Sedang",
    content: "Sebuah lingkaran memiliki pusat O dan jari-jari 8 cm. Titik P berjarak 17 cm dari O.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{OP^2 - r^2} = \\sqrt{17^2 - 8^2} = \\ldots" },
      { label: "b.", math: "\\sin \\angle OPT = \\frac{OT}{OP} = \\frac{8}{17}" },
      { label: "c.", text: "Hitunglah luas segitiga OPT." },
    ],
  }),
  Qn(17, "Dua Garis Singgung – Nilai PA", {
    difficulty: "Sedang",
    content: "Dari titik P di luar lingkaran, ditarik dua garis singgung PA dan PB. Jika PA = (2x + 3) cm dan PB = (5x − 9) cm:",
    parts: [
      { label: "a.", math: "PA = PB \\Rightarrow 2x + 3 = 5x - 9 \\Rightarrow x = \\ldots" },
      { label: "b.", math: "PA = \\ldots \\text{ cm}" },
      { label: "c.", math: "\\text{Panjang PB} = \\ldots \\text{ cm (verifikasi)}" },
    ],
  }),
  Qn(18, "Sifat Garis Singgung Lingkaran – ANBK", {
    difficulty: "Mudah",
    content: "Pilih pernyataan yang BENAR tentang garis singgung lingkaran:",
    parts: [
      { label: "a.", text: "Garis singgung menyentuh lingkaran di dua titik. (Benar/Salah? Jelaskan)" },
      { label: "b.", text: "Garis singgung tegak lurus jari-jari di titik singgung. (Benar/Salah? Jelaskan)" },
      { label: "c.", text: "Dari titik di luar lingkaran hanya bisa ditarik satu garis singgung. (Benar/Salah? Jelaskan)" },
    ],
  }),
  Qn(19, "Sudut Antara Dua Garis Singgung", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="tangent-angle" size={220} />,
    content: "Dari titik P di luar lingkaran ditarik dua garis singgung PT dan PT'. Sudut TPT' = α.",
    parts: [
      { label: "a.", math: "\\angle TOT' = 180^\\circ - \\alpha \\text{ (mengapa?)}" },
      { label: "b.", math: "\\text{Jika } \\alpha = 60^\\circ, \\text{ maka } \\angle TOT' = \\ldots ^\\circ" },
      { label: "c.", math: "\\text{Panjang busur TT' jika } r = 10 \\text{ dan } \\angle TOT' = 120^\\circ" },
    ],
  }),
  Qn(20, "Menentukan Jari-Jari dari Garis Singgung", {
    difficulty: "Sedang",
    content: "Panjang garis singgung dari titik P ke lingkaran adalah 12 cm. Jarak OP = 15 cm.",
    parts: [
      { label: "a.", math: "r^2 = OP^2 - PT^2 = 15^2 - 12^2 = \\ldots" },
      { label: "b.", math: "r = \\ldots \\text{ cm}" },
      { label: "c.", text: "Buktikan bahwa ∠OTP = 90° menggunakan kebalikan teorema Pythagoras." },
    ],
  }),
  Qn(21, "Garis Singgung – Kontek Kehidupan", {
    difficulty: "Mudah",
    content: "Sebuah roda sepeda (lingkaran) menyentuh jalan datar. Jalan datar berlaku sebagai garis singgung lingkaran.",
    parts: [
      { label: "a.", text: "Di mana titik singgung antara roda dan jalan?" },
      { label: "b.", text: "Apakah jari-jari roda tegak lurus dengan permukaan jalan di titik singgung? Jelaskan." },
      { label: "c.", text: "Berikan dua contoh lain dari kehidupan sehari-hari yang melibatkan garis singgung lingkaran." },
    ],
  }),
  Qn(22, "Garis Singgung dan Segitiga Siku-Siku", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-right-angle" size={220} color="#34d399" />,
    content: "O adalah pusat lingkaran, T titik singgung, P titik di luar lingkaran. OT = 6 cm, OP = 10 cm.",
    parts: [
      { label: "a.", math: "PT = \\sqrt{10^2 - 6^2} = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
      { label: "b.", text: "Hitung luas segitiga OTP." },
      { label: "c.", text: "Hitung keliling segitiga OTP." },
    ],
  }),
  Qn(23, "Mencari OP dari Garis Singgung", {
    difficulty: "Sedang",
    content: "Garis singgung dari titik P ke lingkaran berpusat O memiliki panjang 9 cm. Jari-jari lingkaran 12 cm.",
    parts: [
      { label: "a.", math: "OP = \\sqrt{PT^2 + r^2} = \\sqrt{9^2 + 12^2} = \\ldots" },
      { label: "b.", math: "OP = \\sqrt{\\ldots + \\ldots} = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Apakah segitiga OTP merupakan segitiga istimewa? (Cek rasio sisi-sisinya)" },
    ],
  }),
  Qn(24, "Garis Singgung – Soal TKA", {
    difficulty: "Sulit",
    content: "Dua lingkaran konsentris (sepusat) dengan jari-jari R dan r (R > r). Sebuah tali busur lingkaran besar adalah garis singgung lingkaran kecil.",
    parts: [
      { label: "a.", text: "Gambarkan situasi tersebut dan beri label pada gambar." },
      { label: "b.", math: "\\text{Panjang tali busur} = 2\\sqrt{R^2 - r^2}" },
      { label: "c.", math: "\\text{Jika } R = 13, r = 5, \\text{ panjang tali busur} = \\ldots" },
    ],
  }),
  Qn(25, "Keliling Segitiga dengan Dua Garis Singgung", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="tangent-two" size={220} color="#a78bfa" />,
    content: "Dari titik P di luar lingkaran, ditarik PA = PB = 15 cm sebagai garis singgung. OP = 17 cm.",
    parts: [
      { label: "a.", math: "OA = OB = \\sqrt{OP^2 - PA^2} = \\sqrt{17^2 - 15^2} = \\ldots" },
      { label: "b.", text: "Hitung keliling segitiga OAP." },
      { label: "c.", text: "Hitung luas segitiga OAP." },
    ],
  }),
  Qn(26, "Sifat Sudut Garis Singgung – UN Style", {
    difficulty: "Sedang",
    content: "Dari luar lingkaran, garis singgung PA dan PB ditarik. ∠APB = 50°. Besar ∠AOB = ?",
    parts: [
      { label: "a.", math: "\\angle OAP = \\angle OBP = 90^\\circ" },
      { label: "b.", math: "\\text{Jumlah sudut segiempat OAPB} = 360^\\circ" },
      { label: "c.", math: "\\angle AOB = 360^\\circ - 90^\\circ - 90^\\circ - 50^\\circ = \\ldots ^\\circ" },
    ],
  }),
  Qn(27, "Garis Singgung – Mencari Sudut", {
    difficulty: "Sedang",
    content: "Garis singgung PA dari titik P ke lingkaran berpusat O. ∠APO = 30°.",
    parts: [
      { label: "a.", math: "\\angle OAP = 90^\\circ, \\angle APO = 30^\\circ, \\angle AOP = \\ldots ^\\circ" },
      { label: "b.", math: "\\sin 30^\\circ = \\frac{OA}{OP} \\Rightarrow OP = \\frac{OA}{\\sin 30^\\circ} = \\frac{r}{0{,}5} = 2r" },
      { label: "c.", math: "PA = OP \\cos 30^\\circ = 2r \\times \\frac{\\sqrt{3}}{2} = r\\sqrt{3}" },
    ],
  }),
  Qn(28, "Garis Singgung Lingkaran Dalam – TKA", {
    difficulty: "Sulit",
    content: "Lingkaran dalam segitiga ABC menyinggung sisi BC di titik D, sisi CA di titik E, dan sisi AB di titik F.",
    parts: [
      { label: "a.", text: "Nyatakan BD = BF, CD = CE, AE = AF menggunakan sifat dua garis singgung dari satu titik." },
      { label: "b.", math: "\\text{Jika } AB = 13, BC = 14, CA = 15, \\text{ hitung } BD, CD, \\text{ dan } AE" },
      { label: "c.", math: "s = \\frac{AB + BC + CA}{2} = \\ldots, \\quad r_{\\text{dalam}} = \\frac{L}{s}" },
    ],
  }),
  Qn(29, "Kongruensi Segitiga pada Garis Singgung", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-two" size={220} color="#fb923c" />,
    content: "Buktikan bahwa segitiga OAP ≅ segitiga OBP jika PA dan PB adalah garis singgung dari P.",
    parts: [
      { label: "a.", text: "Sebutkan tiga kondisi yang membuat dua segitiga ini kongruen." },
      { label: "b.", text: "Cara kongruensi apa yang digunakan? (SS, SSS, SAS, ASA, atau AAS?)" },
      { label: "c.", text: "Apa konsekuensi dari kekongruenan ini? Sebutkan minimal tiga." },
    ],
  }),
  Qn(30, "Aplikasi: Bola Bersinggungan dengan Lantai", {
    difficulty: "Mudah",
    content: "Sebuah bola dengan jari-jari 21 cm diletakkan di lantai datar. Lantai berlaku sebagai garis singgung lingkaran penampang bola.",
    parts: [
      { label: "a.", text: "Berapa jarak pusat bola dari lantai?" },
      { label: "b.", text: "Sudut antara jari-jari dan lantai di titik singgung adalah berapa derajat?" },
      { label: "c.", text: "Jika bola diletakkan di sudut (dua dinding tegak lurus), apakah bola menyentuh setiap dinding di tepat satu titik?" },
    ],
  }),
  Qn(31, "Hubungan Garis Singgung dan Posisi Titik", {
    difficulty: "Mudah",
    content: "Lingkaran berpusat O berjari-jari 10 cm. Tentukan posisi titik dan jumlah garis singgung:",
    parts: [
      { label: "a.", text: "Titik A dengan OA = 6 cm. Posisi A: di dalam/pada/di luar lingkaran? Berapa garis singgung dari A?" },
      { label: "b.", text: "Titik B dengan OB = 10 cm. Posisi B: di dalam/pada/di luar lingkaran? Berapa garis singgung dari B?" },
      { label: "c.", text: "Titik C dengan OC = 15 cm. Posisi C: di dalam/pada/di luar lingkaran? Berapa garis singgung dari C?" },
    ],
  }),
  Qn(32, "Panjang PA dari Persamaan", {
    difficulty: "Sedang",
    content: "PA adalah garis singgung dari P ke lingkaran berpusat O. Diketahui OP = 2x + 3 dan OA = x + 5 dan PA = 12.",
    parts: [
      { label: "a.", math: "PA^2 = OP^2 - OA^2 \\Rightarrow 144 = (2x+3)^2 - (x+5)^2" },
      { label: "b.", math: "\\text{Selesaikan untuk mendapatkan nilai } x" },
      { label: "c.", math: "OA = \\ldots \\text{ dan } OP = \\ldots" },
    ],
  }),
  Qn(33, "Garis Singgung Luar dan Dalam – Konsep", {
    difficulty: "Sedang",
    content: "Dua lingkaran dapat memiliki garis singgung persekutuan luar (GSPL) dan garis singgung persekutuan dalam (GSPD).",
    parts: [
      { label: "a.", text: "Jelaskan perbedaan antara GSPL dan GSPD." },
      { label: "b.", text: "Kapan dua lingkaran tidak memiliki GSPD?" },
      { label: "c.", text: "Kapan dua lingkaran hanya memiliki satu garis singgung persekutuan?" },
    ],
  }),
  Qn(34, "Garis Singgung – Soal Cerita UN", {
    difficulty: "Sedang",
    content: "Seorang anak berdiri di titik P, 25 m dari pusat kolam renang berbentuk lingkaran berjari-jari 7 m. Ia ingin tahu jarak terdekat dari posisinya ke tepi kolam.",
    parts: [
      { label: "a.", math: "PT_{\\text{singgung}} = \\sqrt{25^2 - 7^2} = \\sqrt{\\ldots} = \\ldots \\text{ m}" },
      { label: "b.", text: "Apakah PT merupakan jarak terdekat dari P ke tepi kolam? Mengapa?" },
      { label: "c.", text: "Berapa jarak terjauh dari P ke tepi kolam?" },
    ],
  }),
  Qn(35, "Sudut pada Segitiga OTP", {
    difficulty: "Sedang",
    diagram: <GSLDiagram variant="tangent-angle" size={220} color="#f472b6" />,
    content: "Dari P ke lingkaran O, garis singgung PT dengan ∠TPO = 35°.",
    parts: [
      { label: "a.", math: "\\angle OTP = 90^\\circ" },
      { label: "b.", math: "\\angle TOP = 180^\\circ - 90^\\circ - 35^\\circ = \\ldots ^\\circ" },
      { label: "c.", math: "\\tan 35^\\circ = \\frac{OT}{PT} \\Rightarrow \\text{ jika } OT = r, \\text{ maka } PT = \\frac{r}{\\tan 35^\\circ}" },
    ],
  }),
  Qn(36, "Garis Singgung – Mencari Posisi Titik", {
    difficulty: "Mudah",
    content: "Lingkaran berpusat O(2, 3) dan berjari-jari 5 cm. Titik P(2, 9).",
    parts: [
      { label: "a.", math: "OP = |9 - 3| = 6 \\text{ cm}" },
      { label: "b.", text: "Apakah P berada di luar lingkaran? (Bandingkan OP dan r)" },
      { label: "c.", math: "PT = \\sqrt{6^2 - 5^2} = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(37, "Panjang Garis Singgung – Triple Pythagoras", {
    difficulty: "Sedang",
    content: "Beberapa nilai umum: r = 3, OP = 5 → PT = 4 | r = 5, OP = 13 → PT = 12 | r = 8, OP = 17 → PT = 15",
    parts: [
      { label: "a.", math: "\\text{Verifikasi: } 3^2 + 4^2 = 5^2 \\Rightarrow \\text{ benar/salah?}" },
      { label: "b.", math: "\\text{Jika } r = 6, OP = 10, \\text{ hitung } PT" },
      { label: "c.", math: "\\text{Jika } r = 7, OP = 25, \\text{ hitung } PT" },
    ],
  }),
  Qn(38, "Sudut Pusat dan Garis Singgung", {
    difficulty: "Sulit",
    content: "Garis singgung di titik A dan B dari luar lingkaran O. ∠AOB = 130°.",
    parts: [
      { label: "a.", math: "\\angle OAP = \\angle OBP = 90^\\circ" },
      { label: "b.", math: "\\angle APB = 360^\\circ - 90^\\circ - 90^\\circ - 130^\\circ = \\ldots ^\\circ" },
      { label: "c.", math: "\\text{Panjang busur kecil AB jika } r = 14: \\text{busur} = \\frac{130}{360} \\times 2\\pi \\times 14 = \\ldots" },
    ],
  }),
  Qn(39, "Jarak Titik ke Lingkaran vs Garis Singgung", {
    difficulty: "Sedang",
    content: "Titik P berjarak 20 cm dari pusat O. Jari-jari lingkaran 16 cm.",
    parts: [
      { label: "a.", math: "PT_{\\text{singgung}} = \\sqrt{20^2 - 16^2} = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
      { label: "b.", text: "Jarak terdekat dari P ke lingkaran = OP − r = ... cm" },
      { label: "c.", text: "Manakah yang lebih panjang, panjang garis singgung atau jarak terdekat P ke lingkaran? Mengapa selalu demikian?" },
    ],
  }),
  Qn(40, "Soal UN – Gabungan Konsep Garis Singgung", {
    difficulty: "Sulit",
    diagram: <GSLDiagram variant="tangent-two" size={220} color="#34d399" />,
    content: "Dari titik P di luar lingkaran O berjari-jari 5 cm, ditarik dua garis singgung PA dan PB. Diketahui OP = 13 cm.",
    parts: [
      { label: "a.", math: "PA = PB = \\sqrt{13^2 - 5^2} = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
      { label: "b.", text: "Hitung luas segiempat OAPB." },
      { label: "c.", math: "\\angle APB = 2 \\arcsin\\!\\left(\\frac{5}{13}\\right) = \\ldots ^\\circ \\text{ (nyatakan dalam bentuk paling sederhana)}" },
    ],
  }),
];

const diffColor: Record<string, string> = {
  Mudah: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
  Sedang: "bg-amber-500/20 text-amber-300 border-amber-400/40",
  Sulit: "bg-rose-500/20 text-rose-300 border-rose-400/40",
};

const PengertianPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            PENGERTIAN & SIFAT GARIS SINGGUNG
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Garis Singgung Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Sifat-Sifat Garis Singgung Lingkaran</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { k: "Definisi:", v: "Garis yang menyentuh lingkaran tepat di satu titik (titik singgung)" },
              { k: "Sifat Utama:", v: "Garis singgung ⊥ jari-jari di titik singgung (∠OTP = 90°)" },
              { k: "Dari Titik Luar:", v: "Dapat ditarik 2 garis singgung, dan panjangnya sama (PA = PB)" },
            ].map(x => (
              <div key={x.k} className="bg-white/5 rounded-lg px-3 py-2 flex gap-2">
                <span className="text-emerald-400 font-bold shrink-0">{x.k}</span>
                <span className="text-white/60">{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/garis-singgung-lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianPage;
