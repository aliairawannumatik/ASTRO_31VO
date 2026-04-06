import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { GitMerge } from "lucide-react";
import ArrowDiagram from "./ArrowDiagram";

const accent = "violet";
const accentHex = "#a78bfa";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed" | "diagram-only";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Memahami Konsep Relasi", {
    type: "mixed",
    content: "Perhatikan himpunan A = {1, 2, 3, 4} dan B = {a, b, c, d}. Relasi 'dipetakan ke' dari A ke B dinyatakan dengan diagram panah berikut:",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={['a','b','c','d']} arrows={[[0,0],[1,1],[2,2],[3,3]]} labelA="A" labelB="B" colorA="#a78bfa" colorB="#38bdf8" arrowColor="#f472b6" />,
    parts: [
      { label: "a.", text: "Tuliskan relasi tersebut sebagai himpunan pasangan berurutan." },
      { label: "b.", text: "Apa nama relasi ini? Apakah setiap anggota A dipasangkan tepat satu ke B?" },
      { label: "c.", text: "Tuliskan domain, kodomain, dan range dari relasi tersebut." },
    ],
  }),
  Qn(2, "Relasi Dari Pasangan Berurutan", {
    type: "mixed",
    content: "Diketahui relasi R dari A ke B dinyatakan sebagai himpunan pasangan berurutan:",
    parts: [
      { label: "", math: "R = \\{(1,2),\\ (2,4),\\ (3,6),\\ (4,8)\\}" },
      { label: "a.", text: "Gambarlah diagram panah untuk relasi R." },
      { label: "b.", text: "Nyatakan relasi R dengan aturan (nama relasi). Apa hubungan x dan y?" },
      { label: "c.", text: "Tentukan domain, kodomain, dan range jika B = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}." },
    ],
  }),
  Qn(3, "Membaca Diagram Panah", {
    type: "mixed",
    diagram: <ArrowDiagram setA={['Ali','Budi','Citra','Dina']} setB={['Merah','Kuning','Hijau','Biru']} arrows={[[0,0],[0,2],[1,1],[2,3],[3,1]]} labelA="Siswa" labelB="Warna Favorit" colorA="#34d399" colorB="#fb923c" arrowColor="#facc15" size="md" />,
    parts: [
      { label: "a.", text: "Tuliskan relasi di atas sebagai himpunan pasangan berurutan." },
      { label: "b.", text: "Siapa saja yang menyukai warna yang sama?" },
      { label: "c.", text: "Tuliskan domain dan range dari relasi tersebut." },
      { label: "d.", text: "Apakah relasi ini termasuk fungsi? Jelaskan alasanmu." },
    ],
  }),
  Qn(4, "Relasi 'Faktor dari'", {
    type: "mixed",
    content: "Diketahui A = {2, 3, 4, 6} dan B = {6, 8, 12, 18, 24}. Relasi yang menghubungkan A ke B adalah 'faktor dari'.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah untuk relasi 'faktor dari' ini." },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "c.", text: "Tentukan range relasi tersebut." },
    ],
  }),
  Qn(5, "Domain, Kodomain, dan Range", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4,5]} setB={[1,4,9,16,25,36]} arrows={[[0,0],[1,1],[2,2],[3,3],[4,4]]} labelA="A" labelB="B" colorA="#f472b6" colorB="#60a5fa" arrowColor="#34d399" />,
    parts: [
      { label: "a.", text: "Tentukan domain, kodomain, dan range dari relasi di atas." },
      { label: "b.", text: "Anggota kodomain mana yang tidak menjadi range? Sebutkan." },
      { label: "c.", text: "Apa nama aturan relasi pada diagram tersebut?" },
    ],
  }),
  Qn(6, "Relasi dari Diagram Kartesius", {
    type: "mixed",
    content: "Sebuah relasi R dari himpunan P = {1, 2, 3, 4} ke Q = {1, 2, 3, 4, 5} disajikan pada diagram Kartesius. Titik-titik yang diplot: (1,2), (2,3), (3,4), (4,5).",
    parts: [
      { label: "a.", text: "Tuliskan himpunan pasangan berurutan relasi R." },
      { label: "b.", text: "Gambarlah diagram panah untuk relasi R." },
      { label: "c.", text: "Apa aturan yang menghubungkan anggota P dengan Q?" },
      { label: "d.", text: "Tentukan domain dan range relasi R." },
    ],
  }),
  Qn(7, "Relasi 'Kuadrat dari'", {
    type: "mixed",
    content: "Diketahui A = {1, 2, 3, 4, 5} dan B = {1, 4, 9, 16, 25, 36}. Relasi yang berlaku adalah 'kuadrat dari'.",
    parts: [
      { label: "a.", math: "\\text{Lengkapi pasangan berurutan: } (1,1),\\ (2,\\_),\\ (3,\\_),\\ (4,\\_),\\ (5,\\_)" },
      { label: "b.", text: "Gambarlah diagram panah untuk relasi ini." },
      { label: "c.", text: "Nilai mana di himpunan B yang bukan merupakan range?" },
    ],
  }),
  Qn(8, "Menyatakan Relasi dalam Tiga Cara", {
    type: "mixed",
    content: "Relasi R = {(2,5), (3,7), (4,9), (5,11)} diberikan dalam bentuk pasangan berurutan.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah dari relasi tersebut." },
      { label: "b.", text: "Gambarlah diagram Kartesius dari relasi tersebut." },
      { label: "c.", math: "\\text{Tentukan aturan: } y = f(x) = \\ldots" },
      { label: "d.", text: "Tentukan domain dan range relasi R." },
    ],
  }),
  Qn(9, "Relasi pada Siswa dan Nilai", {
    type: "mixed",
    content: "Kelas 8A memiliki 4 siswa: Amir, Budi, Citra, Dini. Nilai matematika mereka: Amir→85, Budi→90, Citra→85, Dini→75.",
    parts: [
      { label: "a.", text: "Tuliskan relasi 'mendapat nilai' sebagai himpunan pasangan berurutan." },
      { label: "b.", text: "Gambarlah diagram panah untuk relasi tersebut." },
      { label: "c.", text: "Tentukan domain dan range relasi ini." },
    ],
  }),
  Qn(10, "Relasi 'Lebih dari'", {
    type: "mixed",
    content: "Diketahui P = {2, 4, 6} dan Q = {1, 3, 5, 7}. Relasi yang berlaku adalah 'lebih dari'.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah untuk relasi 'lebih dari' dari P ke Q." },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "c.", text: "Tentukan range relasi tersebut." },
    ],
  }),
  Qn(11, "Relasi 'Setengah dari'", {
    type: "mixed",
    content: "Diketahui himpunan A = {2, 4, 6, 8, 10} dan B = {1, 2, 3, 4, 5, 6, 7, 8}. Relasi yang menghubungkan A ke B adalah 'setengah dari'.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah untuk relasi ini." },
      { label: "b.", text: "Tuliskan pasangan berurutannya." },
      { label: "c.", text: "Apakah semua anggota B menjadi range? Jelaskan." },
    ],
  }),
  Qn(12, "Relasi Nama Bulan", {
    type: "mixed",
    content: "Misalkan A = {Januari, Maret, Juni, Oktober} dan B = {31, 30, 28}. Relasi yang berlaku adalah 'jumlah hari bulan tersebut'.",
    parts: [
      { label: "a.", text: "Pasangkan setiap bulan dengan jumlah harinya." },
      { label: "b.", text: "Gambarlah diagram panah dari relasi ini." },
      { label: "c.", text: "Apakah relasi ini termasuk fungsi? Mengapa?" },
    ],
  }),
  Qn(13, "Relasi dari Diagram – Tentukan Aturan", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={[3,5,7,9,11]} arrows={[[0,0],[1,1],[2,2],[3,3]]} labelA="A" labelB="B" colorA="#fb923c" colorB="#34d399" arrowColor="#f472b6" />,
    parts: [
      { label: "a.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "b.", math: "\\text{Tentukan aturan relasinya: } y = \\ldots" },
      { label: "c.", text: "Jika A diperluas hingga {1, 2, 3, 4, 5}, apa nilai yang dipasangkan dengan 5?" },
    ],
  }),
  Qn(14, "Relasi 'Kelipatan dari'", {
    type: "mixed",
    content: "Diketahui A = {2, 3, 5} dan B = {4, 6, 10, 9, 15, 25}. Relasi dari A ke B adalah 'setengah dari elemen B' (atau: B adalah kelipatan dua kali dari A).",
    parts: [
      { label: "a.", text: "Tentukan semua pasangan (a, b) dengan a ∈ A, b ∈ B, dan b = 2a." },
      { label: "b.", text: "Gambarlah diagram panah." },
      { label: "c.", text: "Tentukan domain dan range." },
    ],
  }),
  Qn(15, "Membaca Pasangan Berurutan – Domain Range", {
    type: "mixed",
    content: "Diketahui relasi R sebagai berikut:",
    parts: [
      { label: "", math: "R = \\{(a,1),\\ (b,2),\\ (c,1),\\ (d,3),\\ (e,2)\\}" },
      { label: "a.", text: "Tentukan domain relasi R." },
      { label: "b.", text: "Tentukan range relasi R." },
      { label: "c.", text: "Jika kodomain B = {1, 2, 3, 4, 5}, anggota kodomain mana yang bukan range?" },
    ],
  }),
  Qn(16, "Relasi Tidak Sepenuhnya Dipetakan", {
    type: "mixed",
    diagram: <ArrowDiagram setA={['p','q','r','s']} setB={[1,2,3,4,5]} arrows={[[0,0],[1,2],[2,4]]} labelA="A" labelB="B" colorA="#60a5fa" colorB="#facc15" arrowColor="#f472b6" />,
    parts: [
      { label: "a.", text: "Anggota himpunan A mana yang tidak memiliki pasangan di B? Sebutkan." },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "c.", text: "Tuliskan domain dan range dari relasi ini." },
    ],
  }),
  Qn(17, "Relasi Satu ke Banyak", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3]} setB={[1,2,3,4,5,6]} arrows={[[0,0],[0,1],[1,2],[1,3],[2,4],[2,5]]} labelA="A" labelB="B" colorA="#a78bfa" colorB="#34d399" arrowColor="#fb923c" />,
    parts: [
      { label: "a.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "b.", text: "Apakah ini termasuk fungsi? Jelaskan." },
      { label: "c.", text: "Tentukan domain dan range." },
    ],
  }),
  Qn(18, "Membuat Relasi dari Soal Cerita", {
    type: "mixed",
    content: "Dalam sebuah pertandingan, tim A bertanding melawan tim B, C, dan D. Tim B bertanding melawan tim A dan C. Tim C bertanding melawan tim B dan D.",
    parts: [
      { label: "a.", text: "Nyatakan relasi 'bertanding melawan' dalam bentuk pasangan berurutan." },
      { label: "b.", text: "Gambarlah diagram panah relasi tersebut." },
      { label: "c.", text: "Apakah relasi ini bersifat simetris? Mengapa?" },
    ],
  }),
  Qn(19, "Relasi dari Tabel", {
    type: "mixed",
    content: "Perhatikan tabel berikut yang menyatakan relasi 'hasil kali' dari A ke B:",
    parts: [
      { label: "", text: "A: {1, 2, 3, 4} → B: {2, 4, 6, 8}" },
      { label: "a.", text: "Aturan apa yang menghubungkan anggota A ke B?" },
      { label: "b.", text: "Tuliskan pasangan berurutan relasi tersebut." },
      { label: "c.", text: "Gambarlah diagram panah." },
    ],
  }),
  Qn(20, "Diagram Kartesius ke Pasangan Berurutan", {
    type: "mixed",
    content: "Pada diagram Kartesius, titik-titik yang mewakili relasi R dari A = {1,2,3,4} ke B = {1,2,3,4,5} adalah: (1,3), (2,4), (3,5), (4,4).",
    parts: [
      { label: "a.", text: "Tuliskan himpunan pasangan berurutan relasi R." },
      { label: "b.", text: "Gambarlah diagram panah dari relasi R." },
      { label: "c.", text: "Tentukan domain dan range relasi R." },
      { label: "d.", text: "Apakah ini termasuk fungsi? Mengapa?" },
    ],
  }),
  Qn(21, "Relasi Bilangan Asli", {
    type: "mixed",
    content: "Diketahui A = {1, 2, 3, 4} dan B = {1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 25}. Relasi dari A ke B adalah 'kuadrat dari'.",
    parts: [
      { label: "a.", text: "Tuliskan semua pasangan berurutan dari relasi tersebut." },
      { label: "b.", math: "\\text{Lengkapi: } 3 \\to \\ldots, \\quad 4 \\to \\ldots" },
      { label: "c.", text: "Gambarkan diagram panah." },
    ],
  }),
  Qn(22, "Relasi 'Dua Kali Lebih dari'", {
    type: "mixed",
    content: "Diketahui A = {3, 5, 7, 9} dan B = {1, 2, 3, 4, 5, 6, 7, 8, 9}. Relasi R: 'setengah dari' memetakan dari A ke B.",
    parts: [
      { label: "a.", text: "Apakah semua anggota A dapat dipetakan ke B? Jelaskan." },
      { label: "b.", text: "Tuliskan pasangan berurutan yang valid." },
      { label: "c.", text: "Tentukan domain efektif (anggota A yang bisa dipasangkan)." },
    ],
  }),
  Qn(23, "Relasi Banyak ke Satu", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4,5,6]} setB={['Ganjil','Genap']} arrows={[[0,0],[1,1],[2,0],[3,1],[4,0],[5,1]]} labelA="Bilangan" labelB="Jenis" colorA="#f472b6" colorB="#60a5fa" arrowColor="#34d399" />,
    parts: [
      { label: "a.", text: "Tuliskan himpunan pasangan berurutan relasi tersebut." },
      { label: "b.", text: "Apa nama relasi yang digunakan? (jenis bilangan)" },
      { label: "c.", text: "Apakah ini termasuk fungsi? Jelaskan." },
    ],
  }),
  Qn(24, "Menentukan Relasi dari Aturan", {
    type: "mixed",
    content: "Diketahui aturan relasi R: 'y lebih 3 dari x', dengan A = {0, 1, 2, 3, 4} dan B = himpunan bilangan asli.",
    parts: [
      { label: "a.", text: "Tuliskan semua pasangan berurutan (x, y) yang sesuai aturan." },
      { label: "b.", text: "Tentukan range relasi R." },
      { label: "c.", math: "\\text{Nyatakan aturan sebagai formula: } y = \\ldots" },
    ],
  }),
  Qn(25, "Relasi Huruf dan Bilangan", {
    type: "mixed",
    content: "Diketahui A = {a, b, c, d, e} dan B = {1, 2, 3, 4, 5}. Relasi R dari A ke B adalah 'urutan abjad ke-...'.",
    parts: [
      { label: "a.", text: "Tuliskan semua pasangan berurutan relasi R." },
      { label: "b.", text: "Gambarlah diagram panah." },
      { label: "c.", text: "Apakah relasi ini termasuk fungsi? Mengapa?" },
    ],
  }),
  Qn(26, "Melengkapi Diagram Panah", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[2,4,6,8]} setB={[1,2,3,4,5,6,7,8]} arrows={[[0,0],[1,1],[2,2]]} labelA="A" labelB="B" colorA="#fb923c" colorB="#a78bfa" arrowColor="#facc15" questionMarks={false} />,
    content: "Diagram panah di atas belum lengkap. Aturan yang berlaku adalah 'setengah dari'.",
    parts: [
      { label: "a.", text: "Tentukan pasangan untuk anggota A = 8. (Ke mana anak panah dari 8?)" },
      { label: "b.", text: "Lengkapi dan tuliskan semua pasangan berurutan." },
      { label: "c.", text: "Tentukan range setelah diagram dilengkapi." },
    ],
  }),
  Qn(27, "Relasi Usia Siswa", {
    type: "mixed",
    content: "Data usia 5 siswa: Andi (13), Bela (14), Chandra (13), Dian (15), Eva (14).",
    parts: [
      { label: "a.", text: "Nyatakan relasi 'memiliki usia' dalam bentuk himpunan pasangan berurutan." },
      { label: "b.", text: "Gambarlah diagram panah dari relasi tersebut." },
      { label: "c.", text: "Tentukan domain dan range relasi ini." },
    ],
  }),
  Qn(28, "Relasi Bukan Fungsi – Diagram Panah", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3]} setB={['a','b','c','d']} arrows={[[0,0],[0,1],[1,2],[2,3]]} labelA="A" labelB="B" colorA="#f87171" colorB="#34d399" arrowColor="#facc15" />,
    parts: [
      { label: "a.", text: "Tuliskan himpunan pasangan berurutan dari diagram di atas." },
      { label: "b.", text: "Mengapa relasi ini bukan fungsi? Jelaskan." },
      { label: "c.", text: "Apa syarat agar relasi dari A ke B menjadi fungsi?" },
    ],
  }),
  Qn(29, "Relasi 'Pembagi dari'", {
    type: "mixed",
    content: "Diketahui A = {1, 2, 3, 4} dan B = {4, 8, 12}. Relasi dari A ke B adalah 'pembagi dari' (a membagi b).",
    parts: [
      { label: "a.", text: "Tentukan semua pasangan (a, b) yang memenuhi a membagi b habis." },
      { label: "b.", text: "Gambarlah diagram panah." },
      { label: "c.", text: "Apakah semua anggota A dipetakan? Jelaskan." },
    ],
  }),
  Qn(30, "Relasi dalam Kehidupan Sehari-hari", {
    type: "mixed",
    content: "Dalam sebuah keluarga: Ibu → [Anak: Andi, Bela, Cici]. Relasi yang berlaku adalah 'ibu dari'.",
    parts: [
      { label: "a.", text: "Nyatakan relasi 'ibu dari' dalam bentuk pasangan berurutan." },
      { label: "b.", text: "Tentukan domain dan range dari relasi tersebut." },
      { label: "c.", text: "Apakah relasi 'anak dari' (kebalikannya) merupakan fungsi? Mengapa?" },
    ],
  }),
  Qn(31, "Relasi Dua Himpunan Bilangan", {
    type: "mixed",
    content: "Diketahui P = {1, 2, 3, 4, 5} dan Q = {2, 4, 6, 8, 10, 12}. Relasi dari P ke Q: 'y = 2x'.",
    parts: [
      { label: "a.", math: "\\text{Pasangkan: } 1\\to\\ldots,\\; 2\\to\\ldots,\\; 3\\to\\ldots,\\; 4\\to\\ldots,\\; 5\\to\\ldots" },
      { label: "b.", text: "Gambarlah diagram panah." },
      { label: "c.", text: "Anggota Q mana yang tidak termasuk range? Sebutkan." },
    ],
  }),
  Qn(32, "Relasi dari Kondisi Pertidaksamaan", {
    type: "mixed",
    content: "Diketahui A = {1, 2, 3, 4} dan B = {1, 2, 3, 4}. Relasi R: (a, b) ∈ R jika dan hanya jika a < b.",
    parts: [
      { label: "a.", text: "Tuliskan semua pasangan berurutan yang memenuhi a < b." },
      { label: "b.", text: "Gambarlah diagram panah." },
      { label: "c.", text: "Apakah relasi ini termasuk fungsi? Mengapa?" },
    ],
  }),
  Qn(33, "Relasi Perkalian", {
    type: "mixed",
    content: "Diketahui A = {2, 3, 4} dan B = {6, 8, 9, 12, 16, 18}. Relasi R: 'b adalah kelipatan a' (b = 2a atau b = 3a atau b = 4a).",
    parts: [
      { label: "a.", text: "Tentukan semua pasangan (a, b) dengan b = 2a, 3a, dan 4a yang memenuhi b ∈ B." },
      { label: "b.", text: "Gambarlah diagram panah." },
      { label: "c.", text: "Tentukan domain dan range relasi ini." },
    ],
  }),
  Qn(34, "Penyajian Tiga Cara – UN Style", {
    type: "mixed",
    content: "Relasi R dinyatakan dengan himpunan pasangan berurutan:",
    parts: [
      { label: "", math: "R = \\{(1,4),\\ (2,5),\\ (3,6),\\ (4,7)\\}" },
      { label: "a.", text: "Gambarlah diagram panah dari relasi R, dengan A = {1,2,3,4} dan B = {4,5,6,7,8}." },
      { label: "b.", text: "Gambarlah diagram Kartesius (scatter plot) dari relasi R." },
      { label: "c.", math: "\\text{Temukan aturan: } y = \\ldots" },
    ],
  }),
  Qn(35, "Relasi pada Mata Pelajaran", {
    type: "mixed",
    content: "Seorang siswa mempelajari mata pelajaran: Matematika, IPA, IPS, dan Bahasa. Nilai masing-masing: Matematika=90, IPA=85, IPS=80, Bahasa=88.",
    parts: [
      { label: "a.", text: "Nyatakan relasi 'nilai mata pelajaran' dalam himpunan pasangan berurutan." },
      { label: "b.", text: "Tentukan domain dan range." },
      { label: "c.", text: "Apakah ini fungsi? Jelaskan." },
    ],
  }),
  Qn(36, "Menemukan Anggota Himpunan dari Relasi", {
    type: "mixed",
    content: "Diketahui relasi R dari A ke B dengan aturan 'y = x² − 1'. Jika A = {0, 1, 2, 3, 4}, tentukan:",
    parts: [
      { label: "a.", math: "\\text{Nilai } y \\text{ untuk setiap } x \\in A" },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutan relasi R." },
      { label: "c.", text: "Tentukan range relasi R." },
    ],
  }),
  Qn(37, "Relasi 'Lebih Kecil dari' – UN Style", {
    type: "mixed",
    content: "Diketahui A = {1, 2, 3} dan B = {1, 2, 3, 4}. Relasi R dari A ke B: 'a < b'.",
    parts: [
      { label: "a.", text: "Tentukan semua pasangan (a, b) yang memenuhi a < b." },
      { label: "b.", text: "Gambarlah diagram panah dari relasi tersebut." },
      { label: "c.", text: "Berapa banyak pasangan berurutan dalam relasi R?" },
    ],
  }),
  Qn(38, "Relasi Ganda – Satu Anggota ke Banyak", {
    type: "mixed",
    diagram: <ArrowDiagram setA={['A','B','C']} setB={[1,2,3,4,5]} arrows={[[0,0],[0,1],[1,2],[2,3],[2,4]]} labelA="Siswa" labelB="Nilai" colorA="#60a5fa" colorB="#f472b6" arrowColor="#34d399" />,
    parts: [
      { label: "a.", text: "Tuliskan semua pasangan berurutan." },
      { label: "b.", text: "Siswa mana yang memiliki lebih dari satu nilai? Apakah ini wajar untuk fungsi?" },
      { label: "c.", text: "Apakah relasi ini merupakan fungsi? Jelaskan." },
    ],
  }),
  Qn(39, "Membedakan Domain dan Range dari Konteks", {
    type: "mixed",
    content: "Sebuah mesin penjual kopi menerima koin Rp2.000 dan Rp5.000. Kopi tersedia seharga: Rp2.000, Rp4.000, Rp5.000, Rp10.000.",
    parts: [
      { label: "a.", text: "Nyatakan relasi 'koin yang dimasukkan → kopi yang bisa dibeli' dalam diagram panah." },
      { label: "b.", text: "Apakah setiap input koin memetakan ke satu jenis kopi saja? Jelaskan." },
      { label: "c.", text: "Tentukan domain dan range dari relasi ini." },
    ],
  }),
  Qn(40, "Soal Terapan Relasi – Konteks UN", {
    type: "mixed",
    content: "Diketahui himpunan bilangan A = {2, 4, 6, 8} dan B = {1, 2, 3, 4}. Relasi dari B ke A adalah 'dua kali lipat dari' (a = 2b).",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah dari relasi tersebut." },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutan." },
      { label: "c.", text: "Apakah relasi ini merupakan fungsi? Apakah merupakan korespondensi satu-satu? Jelaskan." },
    ],
  }),
];

const PengertianRelasiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <GitMerge className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            PENGERTIAN RELASI DAN PENYAJIANNYA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Relasi dan Fungsi · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Ingat — Tiga Cara Menyatakan Relasi</p>
          <div className="grid grid-cols-3 gap-2 text-xs font-body">
            {[
              { name: "Diagram Panah", emoji: "↗️" },
              { name: "Pasangan Berurutan", emoji: "{}  " },
              { name: "Diagram Kartesius", emoji: "📈" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <div className="text-lg mb-1">{r.emoji}</div>
                <span className="text-white/60 text-[10px]">{r.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianRelasiPage;
