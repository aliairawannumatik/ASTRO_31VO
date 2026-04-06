import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Globe } from "lucide-react";
import PythagorasDiagram from "./PythagorasDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };

const accent = "#facc15";

const badge = (label: string, color: string) => (
  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 uppercase tracking-wider"
    style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>{label}</span>
);

const rp = (p: Part, i: number) => (
  <div key={i} className="flex gap-2 items-start">
    <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: accent }}>{p.label}</span>
    <div className="text-sm text-white/85 font-body leading-relaxed">
      {p.math ? <InlineMath math={p.math} /> : p.text}
    </div>
  </div>
);

const questions: Q[] = [
  { n: 1, type: "mixed", title: "Tangga dan Dinding",
    diagram: (
      <PythagorasDiagram
        A={{ x: 60, y: 185, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 195, y: 185, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 60, y: 50, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "8 m", color: "#60a5fa", dy: 14 }}
        BC={{ text: "17 m", color: "#34d399", dx: 14 }}
        CA={{ text: "h = ?", color: "#f472b6", dx: -18 }}
        extras={[
          { type: 'line', x1: 60, y1: 185, x2: 60, y2: 50, color: 'rgba(255,255,255,0.15)' },
          { type: 'text', x: 130, y: 100, text: '🪜 Tangga', color: '#34d399', size: 10 },
        ]}
        vw={255} vh={218} size={228}
      />
    ),
    content: "Sebuah tangga sepanjang 17 m bersandar di dinding. Kaki tangga berjarak 8 m dari dinding.",
    parts: [
      { label: "a.", math: "h^2 = 17^2 - 8^2 = 289 - 64 = ..." },
      { label: "b.", math: "h = \\sqrt{225} = ...\\ \\text{m}" },
      { label: "c.", text: "Berapa meter tinggi dinding yang dicapai tangga?" },
    ],
  },
  { n: 2, type: "mixed", title: "Kapal Berlayar",
    content: "Sebuah kapal berlayar 12 km ke arah timur, kemudian berbelok 90° dan berlayar 5 km ke arah utara.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 60, y: 175, label: "Start", labelDx: -5, labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 200, y: 65, label: "Finish", labelDx: 5, labelDy: -12, color: "#f472b6" }}
        rightAngleAt="B"
        AB={{ text: "12 km", color: "#60a5fa", dy: 14 }}
        BC={{ text: "5 km", color: "#f472b6", dx: 14 }}
        CA={{ text: "d = ?", color: "#34d399", dx: -6, dy: -6 }}
        extras={[
          { type: 'text', x: 35, y: 175, text: '🚢', color: '#facc15', size: 14 },
        ]}
        vw={265} vh={225} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "d^2 = 12^2 + 5^2 = 144 + 25 = ..." },
      { label: "b.", math: "d = \\sqrt{169} = ...\\ \\text{km}" },
      { label: "c.", text: "Berapa km jarak lurus dari titik awal ke posisi akhir kapal?" },
    ],
  },
  { n: 3, type: "mixed", title: "Tiang Bendera",
    content: "Tiang bendera setinggi 15 m berdiri tegak. Seutas kawat ditarik dari puncak tiang ke tanah, berjarak 8 m dari kaki tiang.",
    parts: [
      { label: "a.", math: "\\text{Panjang kawat} = \\sqrt{15^2 + 8^2} = \\sqrt{225 + 64} = \\sqrt{289}" },
      { label: "b.", math: "\\text{Panjang kawat} = ...\\ \\text{m}" },
    ],
  },
  { n: 4, type: "mixed", title: "Diagonal Layar Persegi Panjang",
    content: "Sebuah layar berbentuk persegi panjang 9 m × 12 m. Seorang pelaut menarik tali dari satu sudut ke sudut yang berlawanan.",
    parts: [
      { label: "a.", math: "d = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225}" },
      { label: "b.", math: "d = ...\\ \\text{m}" },
    ],
  },
  { n: 5, type: "mixed", title: "Lapangan Sepak Bola",
    content: "Lapangan sepak bola berukuran 105 m × 68 m. Hitung panjang diagonal lapangan.",
    parts: [
      { label: "a.", math: "d = \\sqrt{105^2 + 68^2} = \\sqrt{11025 + 4624} = \\sqrt{15649}" },
      { label: "b.", math: "d \\approx ...\\ \\text{m (1 desimal)}" },
    ],
  },
  { n: 6, type: "mixed", title: "Pohon Tumbang",
    diagram: (
      <PythagorasDiagram
        A={{ x: 65, y: 180, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 180, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 65, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "x m", color: "#60a5fa", dy: 14 }}
        BC={{ text: "?", color: "#34d399", dx: 12 }}
        CA={{ text: "(20−x) m", color: "#f472b6", dx: -24 }}
        extras={[{ type: 'text', x: 130, y: 100, text: '🌲 Patah', color: '#34d399', size: 10 }]}
        vw={265} vh={225} size={235}
      />
    ),
    content: "Sebatang pohon setinggi 20 m patah dan bagian atasnya menempel ke tanah berjarak 12 m dari kaki pohon.",
    parts: [
      { label: "a.", text: "Misalkan tinggi batang yang tersisa = h, bagian yang patah = (20−h) m." },
      { label: "b.", math: "(20-h)^2 = h^2 + 12^2" },
      { label: "c.", math: "400 - 40h + h^2 = h^2 + 144 \\Rightarrow h = ...\\ \\text{m}" },
    ],
  },
  { n: 7, type: "mixed", title: "Jalan Pintas Diagonal",
    content: "Sebidang tanah berbentuk persegi panjang dengan ukuran 40 m × 30 m. Seorang berjalan dari satu sudut ke sudut berlawanan.",
    parts: [
      { label: "a.", math: "d = \\sqrt{40^2 + 30^2} = \\sqrt{1600 + 900} = \\sqrt{2500}" },
      { label: "b.", math: "d = ...\\ \\text{m}" },
      { label: "c.", text: "Berapa meter lebih pendek lewat diagonal daripada lewat sisi-sisi?" },
    ],
  },
  { n: 8, type: "mixed", title: "Kabel Listrik",
    content: "Dua tiang listrik setinggi 8 m dan berjarak 15 m satu sama lain. Kabel menghubungkan puncak tiang ke dasar tiang lainnya.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 60, y: 60, label: "A", labelDy: -12, color: "#facc15" }}
        B={{ x: 60, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 200, y: 175, label: "C", labelDy: 14, color: "#f472b6" }}
        rightAngleAt="B"
        AB={{ text: "8 m", color: "#f472b6", dx: -14 }}
        BC={{ text: "15 m", color: "#60a5fa", dy: 14 }}
        CA={{ text: "kabel = ?", color: "#34d399", dx: 6, dy: -8 }}
        vw={265} vh={225} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "d = \\sqrt{8^2 + 15^2} = \\sqrt{64 + 225} = \\sqrt{289}" },
      { label: "b.", math: "d = ...\\ \\text{m}" },
    ],
  },
  { n: 9, type: "mixed", title: "Diagonal Kubus",
    content: "Kubus dengan rusuk 6 cm. Hitung panjang diagonal ruang (dari pojok bawah ke pojok atas yang berhadapan).",
    parts: [
      { label: "a.", math: "\\text{Diagonal alas} = \\sqrt{6^2+6^2} = 6\\sqrt{2}\\ \\text{cm}" },
      { label: "b.", math: "\\text{Diagonal ruang} = \\sqrt{(6\\sqrt{2})^2+6^2} = \\sqrt{72+36} = \\sqrt{108} = 6\\sqrt{3}" },
      { label: "c.", math: "d \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 10, type: "mixed", title: "UN — Tangga Rumah",
    content: "Tangga rumah berbentuk segitiga siku-siku. Panjang tangga 5 m dan tinggi tangga 3 m.",
    parts: [
      { label: "a.", math: "\\text{Jarak horizontal} = \\sqrt{5^2 - 3^2} = \\sqrt{25-9} = \\sqrt{16}" },
      { label: "b.", math: "\\text{Jarak horizontal} = ...\\ \\text{m}" },
    ],
  },
  { n: 11, type: "mixed", title: "Layang-layang Udara",
    content: "Seorang anak menerbangkan layang-layang. Tali sepanjang 50 m dan jaraknya dari titik berdiri ke titik tepat di bawah layang-layang adalah 30 m.",
    parts: [
      { label: "a.", math: "h = \\sqrt{50^2 - 30^2} = \\sqrt{2500 - 900} = \\sqrt{1600}" },
      { label: "b.", math: "h = ...\\ \\text{m (ketinggian layang-layang)}" },
    ],
  },
  { n: 12, type: "mixed", title: "Jarak Antar Kota",
    content: "Kota A dan kota B terhubung oleh jalan. Dari kota A ke persimpangan = 8 km (ke utara), dari persimpangan ke kota B = 15 km (ke timur).",
    parts: [
      { label: "a.", math: "d_{AB} = \\sqrt{8^2 + 15^2} = \\sqrt{64 + 225} = \\sqrt{289}" },
      { label: "b.", math: "d_{AB} = ...\\ \\text{km (jarak lurus)}" },
    ],
  },
  { n: 13, type: "mixed", title: "Panjang Kawat",
    content: "Sebuah antena vertikal setinggi 24 m ditopang oleh tiga kawat. Setiap kawat dipasang 7 m dari kaki antena. Hitung panjang satu kawat.",
    parts: [
      { label: "a.", math: "l = \\sqrt{24^2 + 7^2} = \\sqrt{576 + 49} = \\sqrt{625}" },
      { label: "b.", math: "l = ...\\ \\text{m}" },
      { label: "c.", text: "Berapa total panjang kawat untuk ketiga penopang?" },
    ],
  },
  { n: 14, type: "mixed", title: "Papan Luncur",
    content: "Papan luncur di taman bermain berketinggian 2 m dan panjang landasan horizontal 1,5 m.",
    parts: [
      { label: "a.", math: "l = \\sqrt{2^2 + (1{,}5)^2} = \\sqrt{4 + 2{,}25} = \\sqrt{6{,}25}" },
      { label: "b.", math: "l = ...\\ \\text{m (panjang papan luncur)}" },
    ],
  },
  { n: 15, type: "mixed", title: "Layar Televisi",
    content: "TV layar lebar dengan ukuran 48 cm × 27 cm. Ukuran layar TV biasanya dinyatakan dalam panjang diagonalnya (dalam inci). Diketahui 1 inci = 2,54 cm.",
    parts: [
      { label: "a.", math: "d = \\sqrt{48^2 + 27^2} = \\sqrt{2304 + 729} = \\sqrt{3033}" },
      { label: "b.", math: "d \\approx 55\\ \\text{cm} \\approx ...\\ \\text{inci}" },
    ],
  },
  { n: 16, type: "mixed", title: "ANBK — Peta dan Jarak",
    content: "Pada peta berskala 1:50.000, jarak antara dua kota adalah 4 cm (horizontal) dan 3 cm (vertikal).",
    parts: [
      { label: "a.", math: "\\text{Jarak di peta} = \\sqrt{4^2+3^2} = \\sqrt{25} = 5\\ \\text{cm}" },
      { label: "b.", math: "\\text{Jarak nyata} = 5 \\times 50{.}000 = 250{.}000\\ \\text{cm} = ...\\ \\text{km}" },
    ],
  },
  { n: 17, type: "mixed", title: "Tangga Nada — Panjang Senar",
    content: "Sebuah gitar memiliki senar yang membentang dari kepala gitar (0,0) ke ujung bridge (60,0). Jarak dari fret ke senar = 1 cm (vertikal) pada posisi horizontal 30 cm.",
    parts: [
      { label: "a.", text: "Ini bukan Pythagoras standar. Namun, jika senar distel dengan tegangan, panjang senar setelah ditekan membentuk segitiga siku-siku." },
      { label: "b.", math: "l = \\sqrt{30^2 + 1^2} = \\sqrt{901} \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 18, type: "mixed", title: "Perahu Menyeberangi Sungai",
    content: "Sebuah perahu menyeberangi sungai dengan kecepatan 4 m/s tegak lurus arus. Arus sungai 3 m/s sejajar tepi. Hitung kecepatan perahu sesungguhnya.",
    parts: [
      { label: "a.", math: "v = \\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = \\sqrt{25}" },
      { label: "b.", math: "v = ...\\ \\text{m/s}" },
    ],
  },
  { n: 19, type: "mixed", title: "Atap Rumah",
    diagram: (
      <PythagorasDiagram
        A={{ x: 130, y: 55, label: "A", labelDy: -12, color: "#facc15" }}
        B={{ x: 50, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 210, y: 175, label: "C", labelDy: 14, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "5 m", color: "#34d399", dx: -12 }}
        BC={{ text: "8 m", color: "#60a5fa", dy: 14 }}
        CA={{ text: "5 m", color: "#a78bfa", dx: 12 }}
        extras={[
          { type: 'line', x1: 130, y1: 55, x2: 130, y2: 175, color: '#facc15', dashed: true, label: 'h', lx: 10 },
          { type: 'text', x: 90, y: 175, text: '← 4 m →', color: '#60a5fa', size: 9 },
        ]}
        vw={265} vh={225} size={230}
      />
    ),
    content: "Atap rumah berbentuk segitiga sama kaki dengan lebar 8 m dan panjang miring 5 m di setiap sisi.",
    parts: [
      { label: "a.", math: "h^2 = 5^2 - 4^2 = 25 - 16 = 9" },
      { label: "b.", math: "h = ...\\ \\text{m (tinggi atap)}" },
    ],
  },
  { n: 20, type: "mixed", title: "UN — Jarak Pesawat",
    content: "Pesawat terbang pada ketinggian 8 km. Jarak dari posisi pesawat ke bandara (lurus ke tanah) adalah 17 km. Berapa jarak mendatar dari titik tepat di bawah pesawat ke bandara?",
    parts: [
      { label: "a.", math: "d^2 = 17^2 - 8^2 = 289 - 64 = 225" },
      { label: "b.", math: "d = ...\\ \\text{km}" },
    ],
  },
  { n: 21, type: "mixed", title: "Pipa Saluran",
    content: "Sebuah pipa saluran dipasang miring dari dasar sumur (kedalaman 6 m) ke permukaan tanah, berjarak 8 m dari mulut sumur.",
    parts: [
      { label: "a.", math: "l = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100}" },
      { label: "b.", math: "l = ...\\ \\text{m}" },
    ],
  },
  { n: 22, type: "mixed", title: "Jembatan Gantung",
    content: "Tali jembatan gantung membentang dari menara setinggi 20 m ke ujung jembatan yang berjarak 15 m dari dasar menara.",
    parts: [
      { label: "a.", math: "l = \\sqrt{20^2 + 15^2} = \\sqrt{400 + 225} = \\sqrt{625}" },
      { label: "b.", math: "l = ...\\ \\text{m}" },
    ],
  },
  { n: 23, type: "mixed", title: "Lintasan Olahraga",
    content: "Seorang atlet berlari dari sudut A ke sudut C melalui B (sudut siku-siku). AB = 300 m, BC = 400 m. Jika berlari lurus dari A ke C, berapa yang dihemat?",
    parts: [
      { label: "a.", math: "AC = \\sqrt{300^2 + 400^2} = \\sqrt{90000 + 160000} = \\sqrt{250000}" },
      { label: "b.", math: "AC = ...\\ \\text{m}" },
      { label: "c.", math: "\\text{Selisih} = (300+400) - 500 = ...\\ \\text{m}" },
    ],
  },
  { n: 24, type: "mixed", title: "TKA — Tinggi Kain",
    content: "Sebuah spanduk berbentuk segitiga sama kaki dipasang dengan alas 6 m dan sisi miring 5 m. Tentukan tingginya.",
    parts: [
      { label: "a.", math: "h^2 = 5^2 - 3^2 = 25 - 9 = 16" },
      { label: "b.", math: "h = ...\\ \\text{m}" },
    ],
  },
  { n: 25, type: "mixed", title: "Rute Pejalan Kaki",
    content: "Seorang pejalan kaki berjalan 7 km ke utara kemudian 24 km ke timur. Berapa jarak lurus ke titik awal?",
    parts: [
      { label: "a.", math: "d = \\sqrt{7^2 + 24^2} = \\sqrt{49 + 576} = \\sqrt{625}" },
      { label: "b.", math: "d = ...\\ \\text{km}" },
    ],
  },
  { n: 26, type: "mixed", title: "Galangan Kapal",
    content: "Sebuah galangan kapal memiliki jalur besi sepanjang 26 m. Kapal bergerak 10 m mendatar dan naik ke dok. Berapa tinggi dok?",
    parts: [
      { label: "a.", math: "h = \\sqrt{26^2 - 10^2} = \\sqrt{676 - 100} = \\sqrt{576}" },
      { label: "b.", math: "h = ...\\ \\text{m}" },
    ],
  },
  { n: 27, type: "mixed", title: "Tembok dan Bayangan",
    content: "Tembok setinggi 5 m menghasilkan bayangan sepanjang 12 m di tanah. Hitung jarak dari puncak tembok ke ujung bayangan.",
    parts: [
      { label: "a.", math: "d = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169}" },
      { label: "b.", math: "d = ...\\ \\text{m}" },
    ],
  },
  { n: 28, type: "mixed", title: "ANBK — Kontekstual",
    content: "Seorang tukang kebun menarik selang dari sudut taman ke sudut berlawanan. Taman berukuran 20 m × 15 m.",
    parts: [
      { label: "a.", math: "l = \\sqrt{20^2 + 15^2} = \\sqrt{400 + 225} = \\sqrt{625}" },
      { label: "b.", math: "l = ...\\ \\text{m}" },
    ],
  },
  { n: 29, type: "mixed", title: "Panjang Jembatan",
    content: "Seorang insinyur merancang jembatan miring dari tepi sungai setinggi 10 m ke sisi seberang yang berjarak 24 m mendatar.",
    parts: [
      { label: "a.", math: "l = \\sqrt{10^2 + 24^2} = \\sqrt{100 + 576} = \\sqrt{676}" },
      { label: "b.", math: "l = ...\\ \\text{m}" },
    ],
  },
  { n: 30, type: "mixed", title: "Diagonal Kotak",
    content: "Sebuah kotak berbentuk persegi dengan panjang sisi 10 cm. Berapa panjang diagonal kotak tersebut?",
    parts: [
      { label: "a.", math: "d = \\sqrt{10^2 + 10^2} = \\sqrt{200} = 10\\sqrt{2}" },
      { label: "b.", math: "d \\approx ...\\ \\text{cm}" },
    ],
  },
  { n: 31, type: "mixed", title: "UN — Jarak Titik ke Titik",
    content: "Titik P(2, 1) dan Q(14, 6) berada pada denah berskala 1:1000 (cm ke m).",
    parts: [
      { label: "a.", math: "d_{PQ} = \\sqrt{(14-2)^2 + (6-1)^2} = \\sqrt{144+25} = \\sqrt{169}" },
      { label: "b.", math: "d_{PQ} = 13\\ \\text{cm di peta} = 13 \\times 1000\\ \\text{cm} = ...\\ \\text{m}" },
    ],
  },
  { n: 32, type: "mixed", title: "Tinggi Piramida",
    diagram: (
      <PythagorasDiagram
        A={{ x: 130, y: 55, label: "T", labelDy: -12, color: "#facc15" }}
        B={{ x: 130, y: 180, label: "O", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 210, y: 180, label: "M", labelDy: 14, color: "#f472b6" }}
        rightAngleAt="B"
        AB={{ text: "h = ?", color: "#f472b6", dx: -16 }}
        BC={{ text: "12 m", color: "#60a5fa", dy: 14 }}
        CA={{ text: "20 m", color: "#34d399", dx: 12 }}
        extras={[{ type: 'text', x: 130, y: 30, text: '⬛ Piramida', color: 'rgba(250,204,21,0.5)', size: 9 }]}
        vw={265} vh={225} size={230}
      />
    ),
    content: "Piramida dengan alas persegi sisi 24 m. Sisi miring piramida (slant height) = 20 m. Hitung tinggi piramida.",
    parts: [
      { label: "a.", text: "Jarak dari pusat alas ke tengah sisi alas = 12 m." },
      { label: "b.", math: "h^2 = 20^2 - 12^2 = 400 - 144 = 256" },
      { label: "c.", math: "h = ...\\ \\text{m}" },
    ],
  },
  { n: 33, type: "mixed", title: "Bola Sepak di Lapangan",
    content: "Seorang pemain menendang bola dari pojok lapangan (0,0) ke titik (8,6) meter.",
    parts: [
      { label: "a.", math: "d = \\sqrt{8^2+6^2} = \\sqrt{64+36} = \\sqrt{100}" },
      { label: "b.", math: "d = ...\\ \\text{m}" },
    ],
  },
  { n: 34, type: "mixed", title: "Mencari Lebar Sungai",
    content: "Untuk mengukur lebar sungai, seorang survei mengukur: dari titik A di tepi sungai, ia berjalan 30 m sejajar sungai ke titik B. Dari B, titik C (di seberang sungai berseberangan dengan A) terlihat pada jarak 34 m.",
    parts: [
      { label: "a.", math: "\\text{Lebar sungai (AC)} = \\sqrt{34^2 - 30^2} = \\sqrt{1156 - 900} = \\sqrt{256}" },
      { label: "b.", math: "\\text{Lebar sungai} = ...\\ \\text{m}" },
    ],
  },
  { n: 35, type: "mixed", title: "TKA — Kabel Sling",
    content: "Sebuah truk derek memiliki kabel sling sepanjang 65 m. Kabel ditarik dari ujung boom setinggi 25 m secara horizontal ke truk di jalan berjarak mendatar d.",
    parts: [
      { label: "a.", math: "d = \\sqrt{65^2 - 25^2} = \\sqrt{4225 - 625} = \\sqrt{3600}" },
      { label: "b.", math: "d = ...\\ \\text{m}" },
    ],
  },
  { n: 36, type: "mixed", title: "Tinggi Layangan",
    content: "Tali layang-layang sepanjang 61 m ditarik ke posisi sejauh 60 m mendatar dari anak yang bermain.",
    parts: [
      { label: "a.", math: "h = \\sqrt{61^2 - 60^2} = \\sqrt{3721 - 3600} = \\sqrt{121}" },
      { label: "b.", math: "h = ...\\ \\text{m (ketinggian layang-layang)}" },
    ],
  },
  { n: 37, type: "mixed", title: "ANBK — Tangga dan Dinding (Aljabar)",
    content: "Tangga sepanjang (x + 7) m bersandar di dinding. Kaki tangga berjarak x m dari dinding dan menyentuh dinding setinggi (x + 2) m.",
    parts: [
      { label: "a.", math: "x^2 + (x+2)^2 = (x+7)^2" },
      { label: "b.", math: "x^2 + x^2+4x+4 = x^2+14x+49" },
      { label: "c.", math: "x^2 - 10x - 45 = 0 \\Rightarrow (x-15)(x+3) = 0 \\Rightarrow x = ..." },
    ],
  },
  { n: 38, type: "mixed", title: "Jarak Dua Kapal",
    content: "Kapal A berlayar 40 mil ke timur dari pelabuhan. Kapal B berlayar 30 mil ke selatan dari pelabuhan. Hitung jarak antara kapal A dan kapal B.",
    parts: [
      { label: "a.", math: "d = \\sqrt{40^2 + 30^2} = \\sqrt{1600 + 900} = \\sqrt{2500}" },
      { label: "b.", math: "d = ...\\ \\text{mil}" },
    ],
  },
  { n: 39, type: "mixed", title: "UN — Soal Cerita Tangga",
    content: "Sebuah tangga sepanjang 5 m bersandar di tembok. Jika kaki tangga digeser 1 m lebih jauh dari tembok (dari 3 m menjadi 4 m), berapa meter bagian atas tangga turun?",
    parts: [
      { label: "a.", math: "\\text{Posisi awal: } h_1 = \\sqrt{5^2-3^2} = \\sqrt{16} = 4\\ \\text{m}" },
      { label: "b.", math: "\\text{Posisi baru: } h_2 = \\sqrt{5^2-4^2} = \\sqrt{9} = 3\\ \\text{m}" },
      { label: "c.", math: "\\text{Turun sebesar: } 4 - 3 = ...\\ \\text{m}" },
    ],
  },
  { n: 40, type: "mixed", title: "Soal UN — Diagonal Balok",
    content: "Sebuah balok berukuran panjang 12 cm, lebar 5 cm, dan tinggi 0 cm (hanya alas). Jika tinggi balok = 0, diagonal alas = ?",
    parts: [
      { label: "a.", math: "\\text{Diagonal alas} = \\sqrt{12^2 + 5^2} = \\sqrt{144+25} = \\sqrt{169} = 13\\ \\text{cm}" },
      { label: "b.", text: "Sekarang jika tinggi = 4 cm:" },
      { label: "c.", math: "\\text{Diagonal ruang} = \\sqrt{13^2 + 4^2} = \\sqrt{169+16} = \\sqrt{185} \\approx ...\\ \\text{cm}" },
    ],
  },
];

const MasalahKontekstualPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #facc1588' }}>
            PENERAPAN TEOREMA PYTHAGORAS
          </h1>
        </div>
        <p className="text-white/40 text-xs text-center mb-1 font-body">Kelas 8 · Latihan Mandiri · 40 Soal</p>
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {badge("UN/USBN", "#34d399")}
          {badge("ANBK", "#60a5fa")}
          {badge("TKA", "#f472b6")}
        </div>
        <div className="flex flex-col gap-5">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl border overflow-hidden"
              style={{ background: 'rgba(10,15,40,0.85)', borderColor: `${accent}33`, boxShadow: `0 0 12px ${accent}11` }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: `${accent}22`, background: `${accent}11` }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0"
                  style={{ background: `${accent}22`, color: accent, border: `1.5px solid ${accent}55` }}>{q.n}</span>
                <span className="text-sm font-bold text-white/90 font-display">{q.title}</span>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.diagram && <div className="flex justify-center my-1">{q.diagram}</div>}
                {q.content && <p className="text-sm text-white/80 font-body leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-sm text-white/90"><BlockMath math={q.math} /></div>}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1 pl-2 border-l-2" style={{ borderColor: `${accent}44` }}>
                    {q.parts.map(rp)}
                  </div>
                )}
                <div className="mt-2 rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span className="text-white/30 text-xs font-body">Jawaban:</span>
                  <div className="flex-1 border-b border-dashed border-white/10 min-h-[18px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/teorema-pythagoras"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Teorema Pythagoras
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasalahKontekstualPage;
