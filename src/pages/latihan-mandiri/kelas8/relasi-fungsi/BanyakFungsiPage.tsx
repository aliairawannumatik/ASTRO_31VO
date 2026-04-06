import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Hash } from "lucide-react";
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
  Qn(1, "Rumus Banyak Fungsi", {
    type: "mixed",
    content: "Jika n(A) = m dan n(B) = n, maka banyak fungsi yang dapat dibuat dari A ke B adalah:",
    parts: [
      { label: "", math: "\\text{Banyak fungsi} = n^m" },
      { label: "a.", text: "Mengapa rumusnya adalah n pangkat m, bukan m pangkat n?" },
      { label: "b.", math: "\\text{Jika } n(A) = 2 \\text{ dan } n(B) = 3,\\ \\text{banyak fungsi} = \\ldots" },
      { label: "c.", math: "\\text{Jika } n(A) = 3 \\text{ dan } n(B) = 2,\\ \\text{banyak fungsi} = \\ldots" },
    ],
  }),
  Qn(2, "Menghitung Banyak Fungsi – Dasar", {
    type: "mixed",
    content: "Diketahui A = {a, b} dan B = {1, 2, 3}.",
    parts: [
      { label: "a.", math: "\\text{Banyak fungsi dari A ke B} = \\ldots" },
      { label: "b.", text: "Gambarlah semua fungsi yang mungkin dari A ke B menggunakan diagram panah." },
      { label: "c.", math: "\\text{Banyak fungsi dari B ke A} = \\ldots" },
    ],
  }),
  Qn(3, "Banyak Fungsi – n(A) = 3, n(B) = 2", {
    type: "mixed",
    content: "Diketahui A = {1, 2, 3} dan B = {p, q}.",
    parts: [
      { label: "a.", math: "n^m = 2^3 = \\ldots" },
      { label: "b.", text: "Gambarlah minimal 4 fungsi yang berbeda dari A ke B." },
      { label: "c.", text: "Berapa banyak di antaranya yang merupakan fungsi surjektif?" },
    ],
  }),
  Qn(4, "Banyak Fungsi – n(A) = 4, n(B) = 3", {
    type: "mixed",
    content: "Diketahui n(A) = 4 dan n(B) = 3.",
    parts: [
      { label: "a.", math: "\\text{Banyak fungsi dari A ke B} = 3^4 = \\ldots" },
      { label: "b.", math: "\\text{Banyak fungsi dari B ke A} = 4^3 = \\ldots" },
      { label: "c.", text: "Mana yang lebih banyak, fungsi dari A ke B atau dari B ke A?" },
    ],
  }),
  Qn(5, "Korespondensi Satu-Satu – Pengertian", {
    type: "mixed",
    content: "Korespondensi satu-satu (bijeksi) adalah fungsi yang sekaligus injektif dan surjektif.",
    parts: [
      { label: "a.", text: "Apa syarat agar fungsi f: A → B merupakan korespondensi satu-satu?" },
      { label: "b.", text: "Apa hubungan antara n(A) dan n(B) agar korespondensi satu-satu bisa terbentuk?" },
      { label: "c.", text: "Berikan contoh nyata korespondensi satu-satu dalam kehidupan sehari-hari." },
    ],
  }),
  Qn(6, "Rumus Banyak Korespondensi Satu-Satu", {
    type: "mixed",
    content: "Banyak korespondensi satu-satu dari A ke B (dengan n(A) = n(B) = n) adalah n! (n faktorial).",
    parts: [
      { label: "a.", math: "\\text{Jika } n(A) = n(B) = 3,\\ \\text{banyak korespondensi} = 3! = \\ldots" },
      { label: "b.", math: "\\text{Jika } n(A) = n(B) = 4,\\ \\text{banyak korespondensi} = 4! = \\ldots" },
      { label: "c.", math: "\\text{Jika } n(A) = n(B) = 5,\\ \\text{banyak korespondensi} = 5! = \\ldots" },
    ],
  }),
  Qn(7, "Korespondensi – n(A) = n(B) = 2", {
    type: "mixed",
    content: "Diketahui A = {1, 2} dan B = {a, b}.",
    parts: [
      { label: "a.", math: "\\text{Banyak korespondensi satu-satu dari A ke B} = 2! = \\ldots" },
      { label: "b.", text: "Gambarlah semua korespondensi satu-satu yang mungkin." },
      { label: "c.", text: "Apakah setiap korespondensi satu-satu pasti merupakan fungsi? Jelaskan." },
    ],
  }),
  Qn(8, "Korespondensi – n(A) = n(B) = 3", {
    type: "mixed",
    content: "Diketahui A = {1, 2, 3} dan B = {x, y, z}.",
    parts: [
      { label: "a.", math: "\\text{Banyak korespondensi satu-satu} = 3! = \\ldots" },
      { label: "b.", text: "Sebutkan 3 contoh korespondensi satu-satu yang berbeda dari A ke B." },
      { label: "c.", text: "Apakah semua fungsi dari A ke B (3³ = 27) merupakan korespondensi? Berapa yang merupakan korespondensi?" },
    ],
  }),
  Qn(9, "Apakah Bisa Terbentuk Korespondensi?", {
    type: "mixed",
    content: "Tentukan apakah korespondensi satu-satu bisa terbentuk untuk setiap kasus berikut:",
    parts: [
      { label: "a.", math: "n(A) = 3,\\ n(B) = 3" },
      { label: "b.", math: "n(A) = 4,\\ n(B) = 3" },
      { label: "c.", math: "n(A) = 5,\\ n(B) = 5" },
      { label: "d.", math: "n(A) = 2,\\ n(B) = 4" },
    ],
  }),
  Qn(10, "Banyak Fungsi – Soal Cerita", {
    type: "mixed",
    content: "Ada 3 anak (Andi, Bela, Cici) dan 4 mainan berbeda (bola, boneka, mobil, puzzle).",
    parts: [
      { label: "a.", text: "Berapa banyak cara memberikan mainan kepada anak-anak jika setiap anak mendapat tepat satu mainan (boleh sama)?" },
      { label: "b.", text: "Berapa banyak cara jika setiap anak harus mendapat mainan yang berbeda?" },
      { label: "c.", text: "Bisakah dibuat korespondensi satu-satu antara anak dan mainan? Mengapa?" },
    ],
  }),
  Qn(11, "Perbandingan Banyak Fungsi", {
    type: "mixed",
    content: "Bandingkan banyak fungsi dalam setiap pasangan berikut:",
    parts: [
      { label: "a.", math: "\\text{Dari } \\{1,2\\} \\text{ ke } \\{a,b,c\\} \\quad \\text{vs} \\quad \\text{dari } \\{a,b,c\\} \\text{ ke } \\{1,2\\}" },
      { label: "b.", math: "n(A)=2,\\ n(B)=5 \\quad \\text{vs} \\quad n(A)=5,\\ n(B)=2" },
      { label: "c.", text: "Manakah yang selalu lebih besar: fungsi dari himpunan kecil ke besar, atau sebaliknya? Jelaskan." },
    ],
  }),
  Qn(12, "Banyak Fungsi – UN Style", {
    type: "mixed",
    content: "Diketahui A = {p, q, r} dan B = {1, 2}.",
    parts: [
      { label: "a.", math: "\\text{Banyak fungsi dari A ke B} = \\ldots" },
      { label: "b.", text: "Dari semua fungsi tersebut, berapa yang merupakan fungsi surjektif? (Range = B)" },
      { label: "c.", text: "Apakah ada korespondensi satu-satu dari A ke B? Mengapa?" },
    ],
  }),
  Qn(13, "Korespondensi dalam Kehidupan", {
    type: "mixed",
    content: "Identifikasi apakah setiap situasi berikut merupakan korespondensi satu-satu:",
    parts: [
      { label: "a.", text: "Hubungan antara nomor kursi dan penumpang pesawat (semua kursi terisi, tidak ada penumpang berdiri)." },
      { label: "b.", text: "Hubungan antara siswa dan nilai ujian." },
      { label: "c.", text: "Hubungan antara kode pos unik dan kota (satu kode pos untuk satu kota)." },
    ],
  }),
  Qn(14, "Banyak Fungsi – n(A) = 1", {
    type: "mixed",
    content: "Diketahui A = {a} (himpunan dengan 1 anggota) dan B = {1, 2, 3, 4, 5}.",
    parts: [
      { label: "a.", math: "\\text{Banyak fungsi dari A ke B} = 5^1 = \\ldots" },
      { label: "b.", text: "Gambarlah semua fungsi yang mungkin." },
      { label: "c.", text: "Apakah ada di antaranya yang merupakan korespondensi satu-satu? Mengapa?" },
    ],
  }),
  Qn(15, "Menghitung 4!", {
    type: "mixed",
    content: "Faktorial digunakan dalam menghitung korespondensi satu-satu.",
    parts: [
      { label: "a.", math: "4! = 4 \\times 3 \\times 2 \\times 1 = \\ldots" },
      { label: "b.", math: "5! = \\ldots" },
      { label: "c.", math: "\\frac{5!}{3!} = \\ldots" },
      { label: "d.", text: "Jika n(A) = n(B) = 4, berapa banyak korespondensi satu-satu dari A ke B?" },
    ],
  }),
  Qn(16, "Banyak Fungsi – Persamaan", {
    type: "mixed",
    content: "Tentukan nilai m jika banyak fungsi dari A ke B sama dengan 16:",
    parts: [
      { label: "a.", math: "n(A) = m,\\ n(B) = 2 \\Rightarrow 2^m = 16" },
      { label: "b.", math: "n(A) = 2,\\ n(B) = m \\Rightarrow m^2 = 16" },
      { label: "c.", math: "n(A) = m,\\ n(B) = 4 \\Rightarrow 4^m = 256" },
    ],
  }),
  Qn(17, "Banyak Fungsi – Perbandingan Arah", {
    type: "mixed",
    content: "Diketahui n(A) = 3 dan n(B) = 4.",
    parts: [
      { label: "a.", math: "\\text{Banyak fungsi dari A ke B} = 4^3 = \\ldots" },
      { label: "b.", math: "\\text{Banyak fungsi dari B ke A} = 3^4 = \\ldots" },
      { label: "c.", text: "Apakah bisa terbentuk korespondensi satu-satu? Jelaskan." },
    ],
  }),
  Qn(18, "Korespondensi – Contoh Konkret", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3]} setB={['x','y','z']} arrows={[[0,2],[1,0],[2,1]]} labelA="A" labelB="B" colorA="#f472b6" colorB="#a78bfa" arrowColor="#34d399" />,
    parts: [
      { label: "a.", text: "Apakah diagram ini merupakan fungsi? Jelaskan." },
      { label: "b.", text: "Apakah ini korespondensi satu-satu? Jelaskan." },
      { label: "c.", text: "Berapa total korespondensi satu-satu yang mungkin dari A ke B?" },
    ],
  }),
  Qn(19, "Banyak Fungsi – Aplikasi Kelas", {
    type: "mixed",
    content: "Sebuah kelas memiliki 30 siswa yang akan dipilih ketua kelas, wakil ketua, dan sekretaris (jabatan berbeda).",
    parts: [
      { label: "a.", text: "Jika ketua kelas dipilih dari 30 siswa, wakil dari sisa 29, dan sekretaris dari sisa 28, berapa banyak cara pemilihan?" },
      { label: "b.", math: "30 \\times 29 \\times 28 = \\ldots" },
      { label: "c.", text: "Apakah ini termasuk korespondensi satu-satu?" },
    ],
  }),
  Qn(20, "Banyak Fungsi – ANBK Style", {
    type: "mixed",
    content: "Diketahui n(P) = 4 dan n(Q) = 3.",
    parts: [
      { label: "a.", math: "\\text{Banyak pemetaan dari P ke Q} = \\ldots" },
      { label: "b.", math: "\\text{Banyak pemetaan dari Q ke P} = \\ldots" },
      { label: "c.", math: "\\text{Mana yang lebih besar?}" },
    ],
  }),
  Qn(21, "Kondisi Korespondensi Satu-Satu", {
    type: "mixed",
    content: "Tentukan syarat minimal agar korespondensi satu-satu dapat dibuat:",
    parts: [
      { label: "a.", text: "Antara himpunan A dengan n(A) = 5 dan himpunan B dengan n(B) = 5." },
      { label: "b.", text: "Antara himpunan X dengan n(X) = 4 dan himpunan Y dengan n(Y) = 6." },
      { label: "c.", text: "Apa kesimpulan umum tentang syarat n(A) dan n(B) untuk korespondensi satu-satu?" },
    ],
  }),
  Qn(22, "Banyak Fungsi – Dari Himpunan Kosong", {
    type: "mixed",
    content: "Pertimbangkan kasus khusus:",
    parts: [
      { label: "a.", math: "\\text{Jika } n(A) = 0 \\text{ (himpunan kosong)},\\ n(B) = 5:\\ \\text{banyak fungsi} = 5^0 = \\ldots" },
      { label: "b.", math: "\\text{Jika } n(A) = 3,\\ n(B) = 0:\\ \\text{banyak fungsi} = 0^3 = \\ldots" },
      { label: "c.", text: "Jelaskan mengapa 5⁰ = 1 masuk akal dalam konteks fungsi." },
    ],
  }),
  Qn(23, "Banyak Fungsi – Soal Terapan TKA", {
    type: "mixed",
    content: "Dari 3 lampu (merah, kuning, hijau), setiap lampu dapat dalam keadaan menyala (1) atau mati (0).",
    parts: [
      { label: "a.", text: "Berapa banyak kemungkinan keadaan (kombinasi menyala/mati) ketiga lampu?" },
      { label: "b.", text: "Nyatakan ini sebagai banyak fungsi dari A = {merah, kuning, hijau} ke B = {0, 1}." },
      { label: "c.", math: "2^3 = \\ldots" },
    ],
  }),
  Qn(24, "Menentukan Banyak Korespondensi – n=5", {
    type: "mixed",
    content: "Diketahui A = {1, 2, 3, 4, 5} dan B = {a, b, c, d, e}.",
    parts: [
      { label: "a.", math: "\\text{Banyak korespondensi satu-satu} = 5! = \\ldots" },
      { label: "b.", math: "\\text{Banyak fungsi dari A ke B} = 5^5 = \\ldots" },
      { label: "c.", text: "Berapa persen dari semua fungsi yang merupakan korespondensi satu-satu?" },
    ],
  }),
  Qn(25, "Soal UN – Banyak Pemetaan", {
    type: "mixed",
    content: "Diketahui himpunan K = {1, 2, 3} dan L = {a, b, c, d}.",
    parts: [
      { label: "a.", math: "\\text{Banyak pemetaan (fungsi) dari K ke L} = \\ldots" },
      { label: "b.", math: "\\text{Banyak pemetaan dari L ke K} = \\ldots" },
      { label: "c.", text: "Dapatkah dibuat korespondensi satu-satu antara K dan L? Mengapa?" },
    ],
  }),
  Qn(26, "Fungsi Injektif – Kapan Mungkin?", {
    type: "mixed",
    content: "Fungsi injektif dari A ke B mengharuskan setiap anggota B dipasangkan paling banyak satu anggota A.",
    parts: [
      { label: "a.", text: "Syarat apa yang harus dipenuhi n(A) dan n(B) agar fungsi injektif mungkin?" },
      { label: "b.", text: "Jika n(A) = 3 dan n(B) = 5, bisakah dibuat fungsi injektif? Gambarlah contohnya." },
      { label: "c.", text: "Jika n(A) = 5 dan n(B) = 3, bisakah dibuat fungsi injektif? Jelaskan." },
    ],
  }),
  Qn(27, "Korespondensi Satu-Satu – Pasangan Berurutan", {
    type: "mixed",
    content: "Diketahui A = {2, 4, 6} dan B = {1, 2, 3}. Fungsi f: A → B dengan aturan f(x) = x/2.",
    parts: [
      { label: "a.", text: "Tuliskan semua pasangan berurutan." },
      { label: "b.", text: "Apakah f merupakan fungsi injektif? Jelaskan." },
      { label: "c.", text: "Apakah f merupakan korespondensi satu-satu? Jelaskan." },
    ],
  }),
  Qn(28, "Banyak Fungsi – Persamaan Pangkat", {
    type: "mixed",
    content: "Selesaikan persamaan banyak fungsi berikut:",
    parts: [
      { label: "a.", math: "n^2 = 9 \\Rightarrow n = \\ldots \\Rightarrow n(B) = \\ldots \\text{ (jika } n(A) = 2\\text{)}" },
      { label: "b.", math: "2^m = 32 \\Rightarrow m = \\ldots \\Rightarrow n(A) = \\ldots \\text{ (jika } n(B) = 2\\text{)}" },
      { label: "c.", math: "n^3 = 27 \\Rightarrow n = \\ldots" },
    ],
  }),
  Qn(29, "Membuat Semua Korespondensi – n=2", {
    type: "mixed",
    content: "Diketahui A = {1, 2} dan B = {a, b}.",
    parts: [
      { label: "a.", text: "Gambarlah SEMUA korespondensi satu-satu yang mungkin dari A ke B." },
      { label: "b.", math: "\\text{Banyak korespondensi} = 2! = \\ldots" },
      { label: "c.", text: "Dari 4 fungsi total yang bisa dibuat (2² = 4), berapa yang merupakan korespondensi?" },
    ],
  }),
  Qn(30, "Banyak Fungsi – Analisa", {
    type: "mixed",
    content: "Seorang siswa berkata: 'Jika n(A) = n(B) = n, maka banyak korespondensi satu-satu sama dengan n!'. Seorang lain berkata: 'Banyak semua fungsi dari A ke B adalah n^n'.",
    parts: [
      { label: "a.", text: "Apakah kedua pernyataan tersebut benar? Verifikasi dengan n = 3." },
      { label: "b.", math: "\\text{Untuk } n=3:\\ 3! = \\ldots,\\ 3^3 = \\ldots" },
      { label: "c.", text: "Untuk n berapa banyak korespondensi sama dengan banyak semua fungsi?" },
    ],
  }),
  Qn(31, "Banyak Fungsi – n(A) = 5, n(B) = 2", {
    type: "mixed",
    content: "Diketahui n(A) = 5 dan n(B) = 2.",
    parts: [
      { label: "a.", math: "\\text{Banyak fungsi dari A ke B} = 2^5 = \\ldots" },
      { label: "b.", text: "Apakah bisa terbentuk korespondensi satu-satu? Mengapa?" },
      { label: "c.", text: "Berapa banyak fungsi yang merupakan fungsi surjektif (range = B)?" },
    ],
  }),
  Qn(32, "Korespondensi – Analogi Nyata", {
    type: "mixed",
    content: "Sebuah hotel memiliki 10 kamar dan 10 tamu. Setiap tamu menempati tepat satu kamar dan setiap kamar dihuni tepat satu tamu.",
    parts: [
      { label: "a.", text: "Nyatakan situasi ini dalam bentuk fungsi matematika." },
      { label: "b.", text: "Apakah ini merupakan korespondensi satu-satu? Jelaskan." },
      { label: "c.", math: "\\text{Banyak cara menempati kamar} = 10! = \\ldots \\text{ (tidak perlu dihitung penuh)}" },
    ],
  }),
  Qn(33, "Banyak Fungsi – Soal Gabungan UN", {
    type: "mixed",
    content: "Diketahui himpunan M = {a, b, c} dan N = {1, 2, 3}.",
    parts: [
      { label: "a.", math: "\\text{Banyak fungsi dari M ke N} = \\ldots" },
      { label: "b.", math: "\\text{Banyak korespondensi satu-satu} = \\ldots" },
      { label: "c.", text: "Sebutkan 2 contoh korespondensi satu-satu dari M ke N." },
    ],
  }),
  Qn(34, "Perbandingan Banyak Korespondensi", {
    type: "mixed",
    content: "Bandingkan banyak korespondensi satu-satu berikut:",
    parts: [
      { label: "a.", math: "n(A) = n(B) = 3 \\to 3! = \\ldots" },
      { label: "b.", math: "n(A) = n(B) = 4 \\to 4! = \\ldots" },
      { label: "c.", math: "n(A) = n(B) = 5 \\to 5! = \\ldots" },
      { label: "d.", text: "Jelaskan mengapa banyak korespondensi meningkat sangat cepat seiring bertambahnya n." },
    ],
  }),
  Qn(35, "Banyak Fungsi – Soal ANBK", {
    type: "mixed",
    content: "Diketahui n(A) = 3 dan n(B) = 4. Diantara semua pemetaan dari A ke B:",
    parts: [
      { label: "a.", math: "\\text{Total pemetaan} = 4^3 = \\ldots" },
      { label: "b.", text: "Berapa banyak yang merupakan fungsi injektif? (Petunjuk: 4 × 3 × 2 = 24)" },
      { label: "c.", text: "Apakah ada korespondensi satu-satu? Mengapa?" },
    ],
  }),
  Qn(36, "Aplikasi Korespondensi – Soal UN", {
    type: "mixed",
    content: "Dalam sebuah lomba, 5 peserta akan mendapatkan medali emas, perak, perunggu, juara harapan 1, dan juara harapan 2 (satu medali per peserta).",
    parts: [
      { label: "a.", text: "Apakah pembagian medali ini merupakan fungsi dari peserta ke medali? Jelaskan." },
      { label: "b.", text: "Apakah ini korespondensi satu-satu? Mengapa?" },
      { label: "c.", math: "\\text{Banyak cara distribusi medali} = 5! = \\ldots" },
    ],
  }),
  Qn(37, "Banyak Fungsi – Soal Kontekstual", {
    type: "mixed",
    content: "Ada 4 warna (merah, biru, hijau, kuning) untuk mewarnai 2 kotak.",
    parts: [
      { label: "a.", text: "Berapa banyak cara mewarnai 2 kotak jika warna boleh sama?" },
      { label: "b.", text: "Berapa banyak cara jika warna harus berbeda?" },
      { label: "c.", text: "Nyatakan ini menggunakan konsep banyak fungsi." },
    ],
  }),
  Qn(38, "Korespondensi Satu-Satu – Verifikasi", {
    type: "mixed",
    diagram: <ArrowDiagram setA={['A','B','C','D']} setB={[1,2,3,4]} arrows={[[0,2],[1,0],[2,3],[3,1]]} labelA="Set I" labelB="Set II" colorA="#60a5fa" colorB="#f472b6" arrowColor="#34d399" />,
    parts: [
      { label: "a.", text: "Apakah diagram ini merupakan fungsi dari Set I ke Set II?" },
      { label: "b.", text: "Apakah ini fungsi injektif?" },
      { label: "c.", text: "Apakah ini korespondensi satu-satu? Berikan alasan lengkap." },
    ],
  }),
  Qn(39, "Banyak Fungsi – Soal Terkombinasi", {
    type: "mixed",
    content: "Diketahui A = {1, 2, 3} dan B = {a, b, c}. Jawab pertanyaan berikut:",
    parts: [
      { label: "a.", math: "\\text{Banyak fungsi dari A ke B} = \\ldots" },
      { label: "b.", math: "\\text{Banyak korespondensi satu-satu dari A ke B} = \\ldots" },
      { label: "c.", text: "Berapa persen dari semua fungsi yang merupakan korespondensi satu-satu? (Hitung!)" },
    ],
  }),
  Qn(40, "Soal UN – Menentukan Banyak Pemetaan", {
    type: "mixed",
    content: "Dari himpunan P = {x | 1 ≤ x ≤ 4, x ∈ bilangan bulat} dan Q = {y | 1 ≤ y ≤ 3, y ∈ bilangan bulat}:",
    parts: [
      { label: "a.", text: "Tentukan n(P) dan n(Q)." },
      { label: "b.", math: "\\text{Banyak fungsi dari P ke Q} = \\ldots" },
      { label: "c.", math: "\\text{Banyak fungsi dari Q ke P} = \\ldots" },
      { label: "d.", text: "Apakah bisa dibentuk korespondensi satu-satu antara P dan Q? Jelaskan." },
    ],
  }),
];

const BanyakFungsiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <Hash className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            BANYAK FUNGSI DAN KORESPONDENSI SATU-SATU
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Relasi dan Fungsi · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-2">📌 Rumus Penting</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="font-bold text-orange-400">Banyak Fungsi</span>
              <div className="text-white/60 mt-1"><InlineMath math="n(B)^{n(A)}" /></div>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="font-bold text-orange-400">Banyak Korespondensi</span>
              <div className="text-white/60 mt-1"><InlineMath math="n! \quad (n(A) = n(B) = n)" /></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-orange-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanyakFungsiPage;
