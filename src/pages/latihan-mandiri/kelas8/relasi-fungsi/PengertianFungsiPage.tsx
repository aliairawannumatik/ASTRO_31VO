import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Zap } from "lucide-react";
import ArrowDiagram from "./ArrowDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Pengertian Fungsi", {
    type: "mixed",
    content: "Fungsi (pemetaan) adalah relasi khusus dari himpunan A ke himpunan B, di mana setiap anggota A dipasangkan tepat satu dengan anggota B.",
    parts: [
      { label: "a.", text: "Sebutkan 3 syarat agar suatu relasi menjadi fungsi." },
      { label: "b.", text: "Apa perbedaan antara relasi dan fungsi? Berikan masing-masing contoh." },
      { label: "c.", text: "Dapatkah dua anggota A dipasangkan ke anggota B yang sama? Jelaskan." },
    ],
  }),
  Qn(2, "Identifikasi Fungsi dari Diagram Panah", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={['a','b','c','d','e']} arrows={[[0,0],[1,1],[2,2],[3,3]]} labelA="A" labelB="B" colorA="#34d399" colorB="#f472b6" arrowColor="#facc15" />,
    parts: [
      { label: "a.", text: "Apakah diagram panah di atas menyatakan fungsi? Jelaskan alasanmu." },
      { label: "b.", text: "Apakah ini fungsi surjektif (onto)? Mengapa?" },
      { label: "c.", text: "Tentukan domain, kodomain, dan range." },
    ],
  }),
  Qn(3, "Bukan Fungsi – Satu ke Banyak", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3]} setB={['p','q','r','s']} arrows={[[0,0],[0,1],[1,2],[2,3]]} labelA="A" labelB="B" colorA="#f87171" colorB="#60a5fa" arrowColor="#fb923c" />,
    parts: [
      { label: "a.", text: "Apakah diagram di atas merupakan fungsi? Berikan alasanmu." },
      { label: "b.", text: "Anggota A mana yang melanggar syarat fungsi?" },
      { label: "c.", text: "Ubah diagram agar menjadi fungsi (hapus minimal satu panah). Pilih mana yang dihapus." },
    ],
  }),
  Qn(4, "Bukan Fungsi – Ada yang Tidak Dipetakan", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={['a','b','c']} arrows={[[0,0],[1,1],[2,2]]} labelA="A" labelB="B" colorA="#f87171" colorB="#a78bfa" arrowColor="#f472b6" />,
    parts: [
      { label: "a.", text: "Apakah diagram di atas merupakan fungsi? Jelaskan." },
      { label: "b.", text: "Anggota A mana yang tidak memiliki pasangan?" },
      { label: "c.", text: "Apa yang perlu diperbaiki agar relasi ini menjadi fungsi?" },
    ],
  }),
  Qn(5, "Ini Fungsi atau Bukan?", {
    type: "mixed",
    content: "Tentukan apakah setiap pasangan berurutan berikut menyatakan fungsi dari A ke B:",
    parts: [
      { label: "a.", math: "\\{(1,2),\\ (2,3),\\ (3,4),\\ (4,5)\\},\\ A=\\{1,2,3,4\\},\\ B=\\{1,2,3,4,5\\}" },
      { label: "b.", math: "\\{(1,2),\\ (1,3),\\ (2,4),\\ (3,5)\\},\\ A=\\{1,2,3\\},\\ B=\\{2,3,4,5\\}" },
      { label: "c.", math: "\\{(1,5),\\ (2,5),\\ (3,5)\\},\\ A=\\{1,2,3\\},\\ B=\\{4,5,6\\}" },
    ],
  }),
  Qn(6, "Fungsi Injektif (Satu-Satu)", {
    type: "mixed",
    content: "Fungsi f dari A ke B disebut injektif (satu-satu) jika setiap anggota B dipasangkan paling banyak satu anggota A.",
    diagram: <ArrowDiagram setA={[1,2,3]} setB={['x','y','z','w']} arrows={[[0,0],[1,1],[2,2]]} labelA="A" labelB="B" colorA="#34d399" colorB="#60a5fa" arrowColor="#f472b6" />,
    parts: [
      { label: "a.", text: "Apakah fungsi pada diagram di atas merupakan fungsi injektif? Jelaskan." },
      { label: "b.", text: "Apakah fungsi ini surjektif? Mengapa?" },
    ],
  }),
  Qn(7, "Fungsi Surjektif (Onto)", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={['a','b','c']} arrows={[[0,0],[1,1],[2,2],[3,0]]} labelA="A" labelB="B" colorA="#a78bfa" colorB="#34d399" arrowColor="#fb923c" />,
    parts: [
      { label: "a.", text: "Apakah pemetaan di atas merupakan fungsi? Jelaskan." },
      { label: "b.", text: "Apakah ini fungsi surjektif? Jelaskan." },
      { label: "c.", text: "Apakah ini fungsi injektif? Jelaskan." },
    ],
  }),
  Qn(8, "Fungsi dari Pasangan Berurutan", {
    type: "mixed",
    content: "Diketahui relasi f: A → B dengan:",
    parts: [
      { label: "", math: "f = \\{(2,4),\\ (3,9),\\ (4,16),\\ (5,25)\\}" },
      { label: "a.", text: "Apakah f merupakan fungsi? Jelaskan." },
      { label: "b.", math: "\\text{Tentukan rumus fungsi } f(x) = \\ldots" },
      { label: "c.", text: "Tentukan domain dan range fungsi f." },
    ],
  }),
  Qn(9, "Membedakan Fungsi dan Bukan Fungsi", {
    type: "mixed",
    content: "Manakah dari berikut ini yang merupakan fungsi? Jelaskan untuk masing-masing.",
    parts: [
      { label: "i.", text: "Relasi 'ibu kandung dari' (dari himpunan anak ke himpunan ibu)." },
      { label: "ii.", text: "Relasi 'anak dari' (dari himpunan ibu ke himpunan anak)." },
      { label: "iii.", text: "Relasi 'nilai ujian' (dari himpunan siswa ke himpunan nilai)." },
    ],
  }),
  Qn(10, "Fungsi Konstan", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4,5]} setB={[7]} arrows={[[0,0],[1,0],[2,0],[3,0],[4,0]]} labelA="A" labelB="B" colorA="#fb923c" colorB="#f472b6" arrowColor="#34d399" />,
    parts: [
      { label: "a.", text: "Apakah pemetaan di atas merupakan fungsi? Jelaskan." },
      { label: "b.", text: "Fungsi ini disebut fungsi konstan. Mengapa?" },
      { label: "c.", math: "\\text{Tuliskan rumus fungsinya: } f(x) = \\ldots" },
    ],
  }),
  Qn(11, "Fungsi Identitas", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={[1,2,3,4]} arrows={[[0,0],[1,1],[2,2],[3,3]]} labelA="A" labelB="B" colorA="#60a5fa" colorB="#60a5fa" arrowColor="#facc15" />,
    parts: [
      { label: "a.", text: "Apakah ini merupakan fungsi? Apakah ini fungsi identitas? Jelaskan." },
      { label: "b.", math: "\\text{Rumus fungsi identitas: } f(x) = \\ldots" },
      { label: "c.", text: "Apakah fungsi identitas selalu merupakan korespondensi satu-satu? Mengapa?" },
    ],
  }),
  Qn(12, "Menentukan Fungsi dari Grafik", {
    type: "mixed",
    content: "Uji vertikal (vertical line test): Suatu grafik menyatakan fungsi jika setiap garis vertikal memotong grafik paling banyak satu titik.",
    parts: [
      { label: "a.", text: "Jelaskan mengapa lingkaran BUKAN merupakan grafik fungsi." },
      { label: "b.", text: "Jelaskan mengapa garis lurus y = 2x + 1 MERUPAKAN grafik fungsi." },
      { label: "c.", text: "Gambarkan contoh grafik yang bukan fungsi dan yang merupakan fungsi." },
    ],
  }),
  Qn(13, "Fungsi dan Notasinya", {
    type: "mixed",
    content: "Fungsi f dari A ke B dinotasikan dengan f: A → B, atau f(x) untuk nilai y yang dipasangkan dengan x.",
    parts: [
      { label: "a.", math: "\\text{Jika } f(x) = 3x - 2,\\ \\text{tentukan } f(1),\\ f(3),\\ f(-2)" },
      { label: "b.", math: "\\text{Jika } f(2) = 8 \\text{ dan } f(x) = 2x + k,\\ \\text{tentukan nilai } k" },
      { label: "c.", math: "\\text{Jika } f(x) = x^2,\\ \\text{tentukan } f(0),\\ f(4),\\ f(-3)" },
    ],
  }),
  Qn(14, "Menyatakan Fungsi Tiga Cara", {
    type: "mixed",
    content: "Fungsi f: {1, 2, 3, 4} → {2, 4, 6, 8} didefinisikan oleh f(x) = 2x.",
    parts: [
      { label: "a.", text: "Nyatakan fungsi ini dalam diagram panah." },
      { label: "b.", text: "Nyatakan fungsi ini dalam himpunan pasangan berurutan." },
      { label: "c.", text: "Tentukan domain, kodomain, dan range fungsi ini." },
    ],
  }),
  Qn(15, "Fungsi dari Konteks Soal Cerita", {
    type: "mixed",
    content: "Harga 1 kg apel adalah Rp15.000. Jika x adalah banyak kg apel yang dibeli dan y adalah total harga yang dibayar, maka y = 15.000x.",
    parts: [
      { label: "a.", text: "Apakah y merupakan fungsi dari x? Jelaskan." },
      { label: "b.", math: "\\text{Lengkapi tabel: } x = 1, 2, 3, 4, 5 \\to y = \\ldots" },
      { label: "c.", text: "Apakah ada nilai x yang menghasilkan lebih dari satu y? Mengapa?" },
    ],
  }),
  Qn(16, "Diagram Panah – Identifikasi Fungsi", {
    type: "mixed",
    diagram: <ArrowDiagram setA={['a','b','c','d']} setB={[1,2,3]} arrows={[[0,0],[1,1],[2,2],[3,1]]} labelA="A" labelB="B" colorA="#f472b6" colorB="#fb923c" arrowColor="#a78bfa" />,
    parts: [
      { label: "a.", text: "Apakah pemetaan di atas merupakan fungsi? Jelaskan." },
      { label: "b.", text: "Apakah ini injektif? Mengapa?" },
      { label: "c.", text: "Apakah ini surjektif? Mengapa?" },
    ],
  }),
  Qn(17, "Syarat Fungsi dari Pasangan Berurutan", {
    type: "mixed",
    content: "Tentukan mana yang merupakan fungsi dari A = {1, 2, 3} ke B = {p, q, r, s}:",
    parts: [
      { label: "a.", math: "\\{(1,p),\\ (2,q),\\ (3,r)\\}" },
      { label: "b.", math: "\\{(1,p),\\ (2,q)\\}" },
      { label: "c.", math: "\\{(1,p),\\ (2,q),\\ (3,r),\\ (2,s)\\}" },
      { label: "d.", math: "\\{(1,p),\\ (2,p),\\ (3,p)\\}" },
    ],
  }),
  Qn(18, "Fungsi Kuadrat – Identifikasi", {
    type: "mixed",
    content: "Diketahui fungsi f: {−3, −2, −1, 0, 1, 2, 3} → ℝ dengan f(x) = x².",
    parts: [
      { label: "a.", text: "Hitung nilai fungsi untuk setiap anggota domain." },
      { label: "b.", text: "Apakah dua nilai berbeda dari domain bisa menghasilkan range yang sama? Beri contoh." },
      { label: "c.", text: "Apakah f merupakan fungsi injektif? Mengapa?" },
    ],
  }),
  Qn(19, "Relasi dan Fungsi – Soal UN", {
    type: "mixed",
    content: "Perhatikan diagram panah berikut:",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={[2,4,6,8,10]} arrows={[[0,0],[1,1],[2,2],[3,3]]} labelA="A" labelB="B" colorA="#34d399" colorB="#facc15" arrowColor="#60a5fa" />,
    parts: [
      { label: "a.", text: "Apakah ini merupakan fungsi? Jelaskan." },
      { label: "b.", text: "Tuliskan pasangan berurutannya." },
      { label: "c.", math: "\\text{Tentukan rumus fungsinya: } f(x) = \\ldots" },
    ],
  }),
  Qn(20, "Menentukan Fungsi dari Grafik – ANBK Style", {
    type: "mixed",
    content: "Grafik A: Garis lurus yang melewati (0,1) dan (2,5). Grafik B: Parabola yang simetris terhadap sumbu y.",
    parts: [
      { label: "a.", text: "Apakah Grafik A merupakan fungsi? Terapkan uji garis vertikal." },
      { label: "b.", text: "Apakah Grafik B merupakan fungsi? Terapkan uji garis vertikal." },
      { label: "c.", text: "Grafik mana yang merupakan fungsi injektif?" },
    ],
  }),
  Qn(21, "Penyajian Fungsi dalam Tabel", {
    type: "mixed",
    content: "Diketahui fungsi f(x) = 2x + 1 dengan domain {0, 1, 2, 3, 4}.",
    parts: [
      { label: "a.", text: "Buatlah tabel nilai fungsi f." },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutan." },
      { label: "c.", text: "Gambarlah diagram panah." },
      { label: "d.", text: "Tentukan range fungsi f." },
    ],
  }),
  Qn(22, "Fungsi dari Soal Cerita – TKA Style", {
    type: "mixed",
    content: "Sebuah taksi mengenakan tarif awal Rp5.000 ditambah Rp2.500 per km. Maka biaya untuk x km adalah f(x) = 2.500x + 5.000.",
    parts: [
      { label: "a.", math: "\\text{Hitung } f(2),\\ f(5),\\ f(10)" },
      { label: "b.", text: "Apakah ini fungsi? Jelaskan." },
      { label: "c.", text: "Jika anggaran Rp30.000, berapa km maksimal bisa ditempuh?" },
    ],
  }),
  Qn(23, "Perbedaan Injektif dan Surjektif", {
    type: "mixed",
    content: "Lengkapi penjelasan berikut dengan menggunakan diagram panah:",
    parts: [
      { label: "a.", text: "Buat contoh fungsi INJEKTIF dari A = {1,2,3} ke B = {a,b,c,d}." },
      { label: "b.", text: "Buat contoh fungsi SURJEKTIF dari A = {1,2,3,4} ke B = {a,b,c}." },
      { label: "c.", text: "Buat contoh fungsi BIJEKTIF dari A = {1,2,3} ke B = {a,b,c}." },
    ],
  }),
  Qn(24, "Fungsi Bernilai Sama", {
    type: "mixed",
    content: "Diketahui f: A → B dan g: A → B dengan f(x) = 3x − 1 dan g(x) = 3x − 1. Domain A = {0, 1, 2, 3}.",
    parts: [
      { label: "a.", text: "Hitung nilai f dan g untuk setiap anggota domain." },
      { label: "b.", text: "Apakah f = g? Apa artinya dua fungsi sama?" },
    ],
  }),
  Qn(25, "Bukan Fungsi – Dua Pasangan Sama Domain", {
    type: "mixed",
    content: "Tentukan apakah himpunan pasangan berurutan berikut merupakan fungsi. Jika bukan, sebutkan pelanggarannya.",
    parts: [
      { label: "a.", math: "\\{(1,3),\\ (2,4),\\ (1,5),\\ (3,6)\\}" },
      { label: "b.", math: "\\{(x,y)\\ |\\ y^2 = x,\\ x \\in \\{1,4,9\\}\\}" },
      { label: "c.", math: "\\{(1,1),\\ (2,1),\\ (3,1),\\ (4,1)\\}" },
    ],
  }),
  Qn(26, "Fungsi dan Keunikan Nilai Range", {
    type: "mixed",
    content: "Fungsi f(x) = |x| dari A = {−3, −2, −1, 0, 1, 2, 3} ke B = {0, 1, 2, 3}.",
    parts: [
      { label: "a.", text: "Hitung semua nilai f(x) untuk setiap anggota domain." },
      { label: "b.", text: "Apakah ada dua nilai domain yang menghasilkan nilai range sama? Beri contoh." },
      { label: "c.", text: "Apakah f merupakan fungsi? Apakah injektif? Jelaskan." },
    ],
  }),
  Qn(27, "Fungsi Ganjil dan Genap", {
    type: "mixed",
    content: "Misalkan f: {1, 2, 3, 4, 5, 6} → {'Ganjil', 'Genap'} dengan aturan f(x) = 'Ganjil' jika x ganjil, dan 'Genap' jika x genap.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah fungsi f." },
      { label: "b.", text: "Apakah f merupakan fungsi? Apakah injektif? Apakah surjektif?" },
      { label: "c.", text: "Apakah f merupakan korespondensi satu-satu?" },
    ],
  }),
  Qn(28, "Domain Maksimum Fungsi", {
    type: "mixed",
    content: "Tentukan domain maksimum (terbesar) yang mungkin untuk setiap fungsi berikut jika nilainya harus berupa bilangan real:",
    parts: [
      { label: "a.", math: "f(x) = \\frac{1}{x-3}" },
      { label: "b.", math: "g(x) = \\sqrt{x}" },
      { label: "c.", math: "h(x) = x^2 + 2" },
    ],
  }),
  Qn(29, "Membaca Diagram – Fungsi atau Relasi?", {
    type: "mixed",
    diagram: <ArrowDiagram setA={['X','Y','Z']} setB={[10,20,30,40]} arrows={[[0,0],[0,1],[1,2],[2,3]]} labelA="A" labelB="B" colorA="#f87171" colorB="#34d399" arrowColor="#facc15" />,
    parts: [
      { label: "a.", text: "Apakah diagram di atas menyatakan fungsi? Jelaskan." },
      { label: "b.", text: "Anggota A mana yang menyebabkan ini bukan fungsi?" },
      { label: "c.", text: "Modifikasi agar menjadi fungsi tanpa mengubah himpunan A." },
    ],
  }),
  Qn(30, "Fungsi dalam Kehidupan Nyata – UN Style", {
    type: "mixed",
    content: "Setiap warga negara Indonesia memiliki satu Nomor Induk Kependudukan (NIK) yang unik.",
    parts: [
      { label: "a.", text: "Apakah relasi 'warga → NIK' merupakan fungsi? Jelaskan." },
      { label: "b.", text: "Apakah relasi 'NIK → warga' merupakan fungsi? Jelaskan." },
      { label: "c.", text: "Apakah relasi 'warga → NIK' merupakan korespondensi satu-satu?" },
    ],
  }),
  Qn(31, "Menentukan Nilai y dari Fungsi", {
    type: "mixed",
    content: "Diketahui f(x) = 5x − 3 dengan domain A = {0, 1, 2, 3, 4}.",
    parts: [
      { label: "a.", math: "\\text{Hitung } f(0),\\ f(1),\\ f(2),\\ f(3),\\ f(4)" },
      { label: "b.", text: "Tentukan range fungsi f." },
      { label: "c.", text: "Gambarlah diagram panah fungsi f." },
    ],
  }),
  Qn(32, "Apakah Fungsi? – ANBK Style", {
    type: "mixed",
    content: "Perhatikan pasangan berurutan berikut. Tentukan apakah setiap himpunan adalah fungsi dari A = {p, q, r} ke B = {1, 2, 3, 4}:",
    parts: [
      { label: "a.", math: "\\{(p,1),\\ (q,3),\\ (r,4)\\}" },
      { label: "b.", math: "\\{(p,1),\\ (q,2),\\ (r,3),\\ (r,4)\\}" },
      { label: "c.", math: "\\{(p,2),\\ (q,2),\\ (r,2)\\}" },
    ],
  }),
  Qn(33, "Fungsi Implisit ke Eksplisit", {
    type: "mixed",
    content: "Hubungan antara x dan y: 3y = 6x + 9.",
    parts: [
      { label: "a.", math: "\\text{Nyatakan y sebagai fungsi eksplisit dari x: } y = f(x) = \\ldots" },
      { label: "b.", math: "\\text{Hitung } f(-1),\\ f(0),\\ f(2)" },
      { label: "c.", text: "Apakah ini fungsi? Mengapa?" },
    ],
  }),
  Qn(34, "Fungsi Dua Variabel ke Satu Nilai", {
    type: "mixed",
    content: "Fungsi f didefinisikan oleh f(x) = x² − 2x + 1 dengan domain {0, 1, 2, 3, 4}.",
    parts: [
      { label: "a.", text: "Hitung nilai fungsi untuk setiap anggota domain." },
      { label: "b.", text: "Apakah ada dua nilai domain yang menghasilkan nilai range yang sama?" },
      { label: "c.", text: "Tentukan range fungsi f." },
    ],
  }),
  Qn(35, "Verifikasi Fungsi dari Persamaan", {
    type: "mixed",
    content: "Tentukan apakah setiap persamaan berikut menyatakan y sebagai fungsi dari x:",
    parts: [
      { label: "a.", math: "y = 2x + 3" },
      { label: "b.", math: "y^2 = x + 1" },
      { label: "c.", math: "y = \\pm\\sqrt{x}" },
      { label: "d.", math: "y = x^3" },
    ],
  }),
  Qn(36, "Fungsi Genap – Domain Simetris", {
    type: "mixed",
    content: "Fungsi f(x) = x² memiliki sifat f(−x) = f(x) untuk semua x dalam domain.",
    parts: [
      { label: "a.", math: "\\text{Verifikasi: } f(-2) = f(2),\\ f(-3) = f(3)" },
      { label: "b.", text: "Apakah f(x) = x² merupakan fungsi injektif jika domain = {−3, −2, −1, 0, 1, 2, 3}? Jelaskan." },
      { label: "c.", text: "Bagaimana cara membuat f(x) = x² menjadi injektif? (Batasi domain!)" },
    ],
  }),
  Qn(37, "Fungsi Piecewise Sederhana", {
    type: "mixed",
    content: "Fungsi f didefinisikan sebagai berikut:",
    parts: [
      { label: "", math: "f(x) = \\begin{cases} x + 1 & \\text{jika } x < 3 \\\\ 2x - 2 & \\text{jika } x \\geq 3 \\end{cases}" },
      { label: "a.", math: "\\text{Hitung } f(1),\\ f(3),\\ f(5)" },
      { label: "b.", text: "Apakah ini merupakan fungsi? Mengapa?" },
    ],
  }),
  Qn(38, "Range Fungsi Linear", {
    type: "mixed",
    content: "Fungsi f(x) = 4x − 6 dengan domain {1, 2, 3, 4, 5}.",
    parts: [
      { label: "a.", text: "Hitung setiap nilai fungsi." },
      { label: "b.", text: "Tentukan range fungsi f." },
      { label: "c.", math: "\\text{Jika domain diperluas ke } \\{0, 1, 2, 3, 4, 5\\},\\ f(0) = \\ldots" },
    ],
  }),
  Qn(39, "Korespondensi Satu-Satu – UN/ANBK Style", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={['a','b','c','d']} arrows={[[0,0],[1,1],[2,2],[3,3]]} labelA="A" labelB="B" colorA="#a78bfa" colorB="#f472b6" arrowColor="#34d399" />,
    parts: [
      { label: "a.", text: "Apakah pemetaan ini merupakan fungsi injektif? Jelaskan." },
      { label: "b.", text: "Apakah ini fungsi surjektif? Jelaskan." },
      { label: "c.", text: "Apakah ini korespondensi satu-satu (bijektif)? Jelaskan." },
    ],
  }),
  Qn(40, "Terapan Fungsi – Konteks UN", {
    type: "mixed",
    content: "Sebuah kolam renang berbentuk persegi panjang dengan lebar tetap 4 meter. Jika panjang kolam adalah x meter, maka luas kolam adalah f(x) = 4x m².",
    parts: [
      { label: "a.", math: "\\text{Hitung } f(5),\\ f(8),\\ f(10)" },
      { label: "b.", text: "Apakah f merupakan fungsi? Jelaskan." },
      { label: "c.", text: "Jika luas kolam harus minimal 40 m², berapa panjang minimum kolam?" },
    ],
  }),
];

const PengertianFungsiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <Zap className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            PENGERTIAN FUNGSI DAN PENYAJIANNYA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Relasi dan Fungsi · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Syarat Fungsi</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              "Setiap anggota domain dipasangkan ke TEPAT SATU anggota kodomain",
              "Tidak boleh ada anggota domain yang tidak memiliki pasangan",
              "Boleh ada anggota kodomain yang tidak dipasangkan (bukan range)",
            ].map((s, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-3 py-2 flex gap-2">
                <span className="text-emerald-400 font-bold shrink-0">{i+1}.</span>
                <span className="text-white/60">{s}</span>
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
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianFungsiPage;
