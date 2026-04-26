import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { pembahasanDasar } from "@/data/transformasiPembahasanDasar";
import { pembahasanOlimpiade } from "@/data/transformasiPembahasanOlimpiade";

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

const materiSection = {
  title: "MATERI - TRANSFORMASI GEOMETRI",
  sections: [
    {
      heading: "Indikator 11",
      content: `Menjelaskan transformasi geometri (translasi, refleksi, rotasi, dan dilatasi) yang dihubungkan dengan masalah kontekstual dan Menyelesaikan masalah kontekstual yang berkaitan dengan transformasi geometri (translasi, refleksi, rotasi, dan dilatasi).`
    },
    {
      heading: "A. Definisi Transformasi",
      content: `Transformasi geometri adalah suatu proses pemetaan satu-satu (one-one) dari sembarang atau beberapa titik di suatu bidang ke titik lain atau beberapa titik di bidang tersebut. Titik lain di bidang tersebut disebut bayangan atau peta.

Jenis Transformasi:
1. Translasi (Pergeseran)
2. Refleksi (Pencerminan)
3. Rotasi (Perputaran)
4. Dilatasi (Perkalian)`
    },
    {
      heading: "B. Translasi (Pergeseran)",
      content: `Translasi adalah transformasi yang memindahkan setiap titik pada bidang menurut jarak dan arah tertentu.

Misalkan x, y, a dan b bilangan real.
Translasi titik A(x, y) dengan menggeser absis x sejauh a dan menggeser ordinat y sejauh b, sedemikian diperoleh titik A'(x + a, y + b), secara notasi dilambangkan dengan:

$A(x, y) \\xrightarrow{T\\binom{a}{b}} A'(x+a,\\ y+b)$`
    },
    {
      heading: "C. Refleksi (Pencerminan)",
      content: `Refleksi adalah suatu transformasi yang memindahkan tiap titik pada bidang dengan menggunakan sifat bayangan cermin dari titik-titik yang akan dipindahkan.

Jika P(a, b) dicerminkan terhadap sumbu X maka bayangannya adalah P'(a, -b):
$A(x, y) \\xrightarrow{M_{\\text{sumbu-}x}} A'(x, -y)$

Jika P(a, b) dicerminkan terhadap sumbu Y maka bayangannya adalah P'(-a, b):
$A(x, y) \\xrightarrow{M_{\\text{sumbu-}y}} A'(-x, y)$

Jika P(a, b) dicerminkan terhadap sumbu y = x maka bayangannya adalah P'(b, a):
$A(x, y) \\xrightarrow{M_{y=x}} A'(y, x)$

Jika P(a, b) dicerminkan terhadap sumbu y = -x maka bayangannya adalah P'(-b, -a):
$A(x, y) \\xrightarrow{M_{y=-x}} A'(-y, -x)$

Jika P(a, b) dicerminkan terhadap titik (0, 0) atau titik pangkal maka bayangannya adalah P'(-x, -y):
$A(x, y) \\xrightarrow{M_{(0,0)}} A'(-x, -y)$

Jika P(a, b) dicerminkan terhadap sumbu x = h maka bayangannya adalah P'(2h - a, b):
$A(x, y) \\xrightarrow{M_{x=h}} A'(2h-x, y)$

Jika P(a, b) dicerminkan terhadap sumbu y = k maka bayangannya adalah P'(a, 2k - b):
$A(x, y) \\xrightarrow{M_{y=k}} A'(x, 2k-y)$`
    },
    {
      heading: "D. Rotasi (Perputaran)",
      content: `Rotasi atau perputaran adalah transformasi yang memindahkan setiap titik pada bidang ke titik lainnya dengan cara memutar pada pusat titik tertentu.

Rotasi pada bidang datar ditentukan oleh hal-hal berikut:
- Pusat perputaran
- Arah perputaran
- Besar sudut perputaran

Pusat perputaran suatu rotasi bisa di titik O(0,0) dan titik A(x,y). Arah perputaran suatu rotasi bisa berlawanan arah jarum jam (rotasi positif), searah jarum jam (rotasi negatif).

Pada rotasi sudut yang memiliki nilai sama adalah:
- $90^{\\circ}$ dengan $-270^{\\circ}$
- $180^{\\circ}$ dengan $-180^{\\circ}$
- $270^{\\circ}$ dengan $-90^{\\circ}$

Rotasi dengan pusat O(0,0) sebesar $90^{\\circ}$:
$A(x, y) \\xrightarrow{R_{[O,\\ 90^{\\circ}]}} A'(-y, x)$

Rotasi dengan pusat O(0,0) sebesar $180^{\\circ}$:
$A(x, y) \\xrightarrow{R_{[O,\\ 180^{\\circ}]}} A'(-x, -y)$

Rotasi dengan pusat O(0,0) sebesar $270^{\\circ}$:
$A(x, y) \\xrightarrow{R_{[O,\\ 270^{\\circ}]}} A'(y, -x)$`
    },
    {
      heading: "E. Dilatasi (Perkalian)",
      content: `Dilatasi adalah transformasi yang mengubah ukuran atau skala suatu bangun geometri (pembesaran/pengecilan), tetapi tidak mengubah bentuk bangun tersebut.

Dilatasi dapat ditentukan oleh hal-hal berikut:
- Pusat dilatasi
- Faktor dilatasi (k)

Dilatasi dengan pusat O(0,0) dan faktor skala k:
$A(x, y) \\xrightarrow{D_{[O,\\ k]}} A'(kx, ky)$

Dilatasi dengan pusat (a, b) dan faktor skala k:
$A(x, y) \\xrightarrow{D_{[(a,b),\\ k]}} A'(k(x-a)+a,\\ k(y-b)+b)$`
    },
  ]
};

const latihanDasar = [
  { no: 1, soal: "Titik A(5, -2) ditranslasi oleh $T\\binom{-3}{1}$. Tentukan koordinat bayangan titik A tersebut!", options: ["A. A'(2, 1)", "B. A'(1, 1)", "C. A'(2, 2)", "D. A'(2, -1)", "E. A'(-2, 1)"] },
  { no: 2, soal: "Tentukan bayangan titik A(3, -4) jika digeser oleh $T\\binom{-3}{9}$ ...", options: ["A. A'(0, 13)", "B. A'(0, 5)", "C. A'(6, 13)", "D. A'(6, 5)"] },
  { no: 3, soal: "Tentukan bayangan titik B(-2, -13) jika digeser oleh $T\\binom{3}{-6}$ ...", options: ["A. B'(5, 7)", "B. B'(5, -7)", "C. B'(1, -19)", "D. B'(1, 19)"] },
  { no: 4, soal: "Tentukanlah bayangan titik C(2, 8) jika digeser oleh $T_1\\binom{2}{8}$ dan dilanjutkan oleh $T_2\\binom{-2}{-5}$ ...", options: ["A. C''(2, 8)", "B. C''(2, 16)", "C. C''(2, 21)", "D. C''(2, 11)"] },
  { no: 5, soal: "Tentukanlah bayangan titik D(9, 0) jika digeser oleh $T_1\\binom{7}{18}$ dan dilanjutkan oleh $T_2\\binom{6}{-15}$ ...", options: ["A. D''(9, 13)", "B. D''(22, 9)", "C. D''(22, 13)", "D. D''(22, 3)"] },
  { no: 6, soal: "Jika titik A(27, -12) digeser oleh T(a, b) sehingga bayangannya adalah titik A'(20, -3), tentukan a + b ...", options: ["A. -7", "B. 9", "C. 2", "D. 16"] },
  { no: 7, soal: "Jika titik B(3, -7) digeser oleh T(a, b) sehingga bayangannya adalah titik B'(20, -3), tentukan T ...", options: ["A. T(17, 4)", "B. T(17, 10)", "C. T(3, 4)", "D. T(2, 10)"] },
  { no: 8, soal: "Jika titik A digeser oleh $T\\binom{2}{9}$ menjadi A'(0, 5) maka titik A adalah ...", options: ["A. A(2, 14)", "B. A(-2, 4)", "C. A(2, 4)", "D. A(-2, 14)"] },
  { no: 9, soal: "Jika titik B digeser oleh $T\\binom{6}{-2}$ menjadi B'(1, 7) maka titik B adalah ...", options: ["A. B(7, 5)", "B. B(7, 9)", "C. B(-5, 5)", "D. B(-5, 9)"] },
  { no: 10, soal: "Tentukan bayangan titik A(3, -4) jika dicerminkan oleh garis x = 3 ...", options: ["A. A'(3, 10)", "B. A'(4, -3)", "C. A'(3, -4)", "D. A'(3, 4)"] },
  { no: 11, soal: "Tentukan bayangan titik B(-2, -13) jika dicerminkan oleh garis y = 4 ...", options: ["A. B'(-2, 21)", "B. B'(12, -19)", "C. B'(10, 21)", "D. B'(1, 4)"] },
  { no: 12, soal: "Tentukanlah bayangan titik C(2, 8) jika dicerminkan oleh sumbu x ...", options: ["A. C''(2, 8)", "B. C''(2, -8)", "C. C''(-2, 8)", "D. C''(-2, -8)"] },
  { no: 13, soal: "Tentukanlah bayangan titik D(9, 0) jika dicerminkan oleh sumbu y ...", options: ["A. D''(9, 0)", "B. D''(-9, 0)", "C. D''(0, 9)", "D. D''(0, -9)"] },
  { no: 14, soal: "Jika titik A(27, -12) dicerminkan menjadi A'(27, 12), sumbu refleksinya adalah ...", options: ["A. Sumbu x", "B. Titik (0, 0)", "C. Sumbu y", "D. x = 2"] },
  { no: 15, soal: "Jika titik B(3, -7) dicerminkan menjadi A'(-7, 3), sumbu refleksinya adalah ...", options: ["A. Sumbu y = x", "B. Sumbu x", "C. Sumbu y = -x", "D. Sumbu y"] },
  { no: 16, soal: "Jika titik A(2, 8) dicerminkan menjadi A'(2, 12), sumbu refleksinya adalah ...", options: ["A. x = 10", "B. y = 2", "C. x = 2", "D. y = 10"] },
  { no: 17, soal: "Jika titik B(2, -2) dicerminkan menjadi A'(6, -2), sumbu refleksinya adalah ...", options: ["A. x = 4", "B. y = 4", "C. x = 5", "D. y = 5"] },
  { no: 18, soal: "Bayangan titik A oleh refleksi terhadap titik (1, -2) adalah titik A'(3, 5). Tentukan koordinat titik A!", options: ["A. A(1, 9)", "B. A(1, 1)", "C. A(-9, 1)", "D. A(-1, -9)", "E. A(9, 1)"] },
  { no: 19, soal: "Tentukan bayangan titik (5, -3) oleh rotasi $R(P,\\ 90^{\\circ})$ dengan koordinat titik P(-1, 2)!", options: ["A. (8, 4)", "B. (-8, 4)", "C. (8, -4)", "D. (-4, -8)", "E. (4, 8)"] },
  { no: 20, soal: "Titik A(-3, 1) jika dirotasi terhadap sudut $90^{\\circ}$ dan $180^{\\circ}$ menghasilkan bayangan pada titik ... dan ...", options: ["A. (1, 3) dan (-3, -1)", "B. (-1, -3) dan (3, -1)", "C. (1, -2) dan (-1, -2)", "D. (-2, 1) dan (2, -1)"] },
  { no: 21, soal: "Tentukan bayangan titik (9, 3) oleh dilatasi $[O,\\ \\frac{1}{3}]$!", options: ["A. (1, 3)", "B. (3, 1)", "C. (-1, -3)", "D. (3, -1)", "E. (1, -3)"] },
  { no: 22, soal: "Titik M'(8, -6) merupakan hasil dilatasi dari titik M(-24, 18). Maka faktor skala dilatasi tersebut jika pusatnya (0, 0) adalah ...", options: ["A. 2", "B. 3", "C. -3", "D. -2"] },
  { no: 23, soal: "Segitiga PQR memiliki koordinat P(1, 1); Q(1, 5) dan R(3, 3). Didilatasi dengan [O, c] menghasilkan bayangan P'(-2, -2); Q'(-2, -10) dan R'(-6, -6). Nilai c adalah ...", options: ["A. 2", "B. 3", "C. -3", "D. -2"] },
];

const latihanOlimpiade = [
  {
    no: 1,
    soal: "OSN Matematika 2015 Kota Bandung\nSebuah $\\triangle$ABC dicerminkan terhadap sumbu Y, kemudian dicerminkan lagi terhadap garis y = 3 sehingga hasil pencerminannya adalah $\\triangle$A'B'C'. Jika koordinat titik-titik A'(8, 0), B'(8, -4) dan C'(4, 0), maka koordinat titik-titik A, B dan C berturut-turut adalah …",
    options: []
  },
  {
    no: 2,
    soal: "OSN Matematika 2018 Kota Bandung\nPersamaan garis hasil transformasi $R[O,\\ 180^{\\circ}]$ dilanjutkan dengan pencerminan y = -x terhadap garis AB adalah …",
    options: ["A. y = 2x + 4", "B. y = 2x - 4", "C. y = -2x + 4", "D. y = -2x - 4"]
  },
  {
    no: 3,
    soal: "OSN Matematika 2020 Kota Bandung\nDiketahui persegipanjang ABCD di bidang koordinat kartesius dengan A dan B di sumbu X, D di sumbu Y dan C di kuadran I. Ada 4 jenis rotasi yang akan dilakukan terhadap persegipanjang ABCD:\n1. $R(C,\\ -90^{\\circ})$\n2. $R(A,\\ 90^{\\circ})$\n3. $R(C,\\ 90^{\\circ})$\n4. $R(A,\\ -90^{\\circ})$\nJika ABCD dirotasikan berturut-turut dengan urutan 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3 dan diperoleh koordinat akhir A adalah (38, 47), maka keliling persegipanjang ABCD adalah ... satuan panjang.",
    options: ["A. 9", "B. 17", "C. 38", "D. 47"]
  },
  {
    no: 4,
    soal: "OSN Matematika 2021 Tingkat Kota\nDiketahui koordinat titik A dan B berturut-turut adalah (-3, 0) dan (0, -1). Persegi panjang ABCD dengan titik C dan D terletak di dua kuadran berbeda memiliki luas daerah 20 satuan luas. Jika persegi panjang ABCD dicerminkan terhadap sumbu-x, maka hasil pencerminan salah satu sisinya akan memotong sumbu-x di titik (m, 0) dan hasil pencerminan salah satu sisinya yang lain akan memotong sumbu y di titik (0, n). Nilai dari 3(m + n) yang mungkin adalah ...",
    options: ["A. -16", "B. -15", "C. 1", "D. 18"]
  },
  {
    no: 5,
    soal: "OSN Matematika 2023 Kota Bandung\nDiketahui dua buah segitiga OAB dan OCB dengan O(0, 0), A(4, 0), B(0, 3) dan C(2, 3). Jika segitiga OCB digeser searah sumbu-x sehingga titik O terletak di tengah sisi OA, maka perbandingan antara luas irisan kedua segitiga mula-mula dan luas irisan kedua segitiga setelah segitiga OCB digeser adalah …",
    options: ["A. 3 : 2", "B. 2 : 1", "C. 3 : 1", "D. 4 : 1"]
  },
];

const OlimpiadeTransformasiPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
  const [openPembahasan, setOpenPembahasan] = useState<Set<string>>(new Set());

  const togglePembahasan = (key: string) => {
    playPopSound();
    setOpenPembahasan(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
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
          OLIMPIADE - TRANSFORMASI GEOMETRI
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
            {materiSection.sections.map((section, idx) => (
              <div key={idx} className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
                >
                  <span className="font-display text-sm text-accent font-bold">{section.heading}</span>
                  {expandedSections.includes(idx) ? (
                    <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/50 shrink-0" />
                  )}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-5 pb-5">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {section.content.split('\n').map((line, i) => (
                        <div key={i} className="mb-1">{renderWithLatex(line)}</div>
                      ))}
                    </div>

                    {/* Diagram: B. Translasi */}
                    {idx === 2 && (
                      <div className="mt-5 bg-white/5 border border-cyan-500/20 rounded-xl p-3">
                        <p className="text-xs text-center text-cyan-400 font-display mb-2">Translasi: A(x, y) → A'(x+a, y+b)</p>
                        <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto block" aria-label="Diagram translasi">
                          <defs>
                            <marker id="arr-tr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                              <polygon points="0 0, 7 3.5, 0 7" fill="#f59e0b" />
                            </marker>
                            <marker id="arr-ax" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                              <polygon points="0 0, 7 3.5, 0 7" fill="rgba(255,255,255,0.4)" />
                            </marker>
                          </defs>
                          {/* Grid lines */}
                          {[40,80,120,160,200,240].map(x => (
                            <line key={`gx${x}`} x1={x} y1="10" x2={x} y2="190" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                          ))}
                          {[40,80,120,160].map(y => (
                            <line key={`gy${y}`} x1="10" y1={y} x2="270" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                          ))}
                          {/* Axes */}
                          <line x1="20" y1="120" x2="265" y2="120" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arr-ax)" />
                          <line x1="80" y1="185" x2="80" y2="15" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arr-ax)" />
                          <text x="270" y="124" fill="rgba(255,255,255,0.5)" fontSize="11">x</text>
                          <text x="84" y="12" fill="rgba(255,255,255,0.5)" fontSize="11">y</text>
                          <text x="76" y="133" fill="rgba(255,255,255,0.4)" fontSize="10">O</text>
                          {/* Point A at (1,2) → pixel (120, 80) */}
                          <circle cx="120" cy="80" r="5" fill="#22d3ee" />
                          <text x="107" y="73" fill="#22d3ee" fontSize="12" fontWeight="bold">A(x,y)</text>
                          {/* Point A' at (3,1) → pixel (200, 120-40=not exact, let's say (200,120)) */}
                          {/* T(a,b) = (+80, +40) in pixel = (a=2, b=-1) */}
                          <circle cx="210" cy="120" r="5" fill="#f59e0b" />
                          <text x="214" y="115" fill="#f59e0b" fontSize="12" fontWeight="bold">A'(x+a,y+b)</text>
                          {/* Arrow A → A' */}
                          <line x1="125" y1="83" x2="203" y2="117" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arr-tr)" strokeDasharray="6 3" />
                          {/* Vector label */}
                          <text x="160" y="92" textAnchor="middle" fill="#f59e0b" fontSize="11">T(a,b)</text>
                        </svg>
                      </div>
                    )}

                    {/* Diagram: C. Refleksi */}
                    {idx === 3 && (
                      <div className="mt-5 bg-white/5 border border-cyan-500/20 rounded-xl p-3">
                        <p className="text-xs text-center text-cyan-400 font-display mb-2">Refleksi terhadap sumbu-x: A(x,y) → A'(x,−y)</p>
                        <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto block" aria-label="Diagram refleksi">
                          <defs>
                            <marker id="arr-rf" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                              <polygon points="0 0, 7 3.5, 0 7" fill="rgba(255,255,255,0.4)" />
                            </marker>
                          </defs>
                          {/* Grid */}
                          {[40,80,120,160,200,240].map(x => (
                            <line key={`gx${x}`} x1={x} y1="10" x2={x} y2="190" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                          ))}
                          {[40,80,120,160].map(y => (
                            <line key={`gy${y}`} x1="10" y1={y} x2="270" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                          ))}
                          {/* Axes */}
                          <line x1="20" y1="100" x2="265" y2="100" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arr-rf)" />
                          <line x1="80" y1="185" x2="80" y2="15" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arr-rf)" />
                          <text x="270" y="104" fill="rgba(255,255,255,0.5)" fontSize="11">x</text>
                          <text x="84" y="12" fill="rgba(255,255,255,0.5)" fontSize="11">y</text>
                          <text x="76" y="113" fill="rgba(255,255,255,0.4)" fontSize="10">O</text>
                          {/* Mirror axis label */}
                          <text x="140" y="95" fill="#a78bfa" fontSize="10" textAnchor="middle">sumbu-x (cermin)</text>
                          {/* Point A(2, 2) = pixel (160, 60) */}
                          <circle cx="160" cy="60" r="5" fill="#22d3ee" />
                          <text x="165" y="55" fill="#22d3ee" fontSize="12" fontWeight="bold">A(x, y)</text>
                          {/* Point A'(2,-2) = pixel (160, 140) */}
                          <circle cx="160" cy="140" r="5" fill="#f59e0b" />
                          <text x="165" y="155" fill="#f59e0b" fontSize="12" fontWeight="bold">A'(x, −y)</text>
                          {/* Dashed line connecting A to A' */}
                          <line x1="160" y1="65" x2="160" y2="135" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5 3" />
                          {/* Equal distance marks */}
                          <line x1="155" y1="82" x2="165" y2="82" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                          <line x1="155" y1="118" x2="165" y2="118" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}

                    {/* Diagram: D. Rotasi */}
                    {idx === 4 && (
                      <div className="mt-5 bg-white/5 border border-cyan-500/20 rounded-xl p-3">
                        <p className="text-xs text-center text-cyan-400 font-display mb-2">Rotasi 90° berlawanan arah jarum jam: A(x,y) → A'(−y, x)</p>
                        <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto block" aria-label="Diagram rotasi">
                          <defs>
                            <marker id="arr-ro-ax" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                              <polygon points="0 0, 7 3.5, 0 7" fill="rgba(255,255,255,0.4)" />
                            </marker>
                            <marker id="arr-ro" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                              <polygon points="0 0, 7 3.5, 0 7" fill="#a78bfa" />
                            </marker>
                          </defs>
                          {/* Grid */}
                          {[40,80,120,160,200,240].map(x => (
                            <line key={`gx${x}`} x1={x} y1="10" x2={x} y2="190" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                          ))}
                          {[40,80,120,160].map(y => (
                            <line key={`gy${y}`} x1="10" y1={y} x2="270" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                          ))}
                          {/* Axes */}
                          <line x1="20" y1="120" x2="265" y2="120" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arr-ro-ax)" />
                          <line x1="140" y1="185" x2="140" y2="15" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arr-ro-ax)" />
                          <text x="270" y="124" fill="rgba(255,255,255,0.5)" fontSize="11">x</text>
                          <text x="144" y="12" fill="rgba(255,255,255,0.5)" fontSize="11">y</text>
                          <text x="144" y="133" fill="rgba(255,255,255,0.4)" fontSize="10">O</text>
                          {/* Radius lines from O to A and O to A' */}
                          {/* A(2,1) → pixel: x=140+2*40=220, y=120-1*40=80 */}
                          <line x1="140" y1="120" x2="220" y2="80" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 3" />
                          {/* A'(-1,2) after 90° CCW: A'(-y,x)=(-1,2) → pixel: x=140-1*40=100, y=120-2*40=40 */}
                          <line x1="140" y1="120" x2="100" y2="40" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                          {/* Arc showing rotation */}
                          <path d="M 213 88 A 85 85 0 0 1 107 46" fill="none" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#arr-ro)" />
                          <text x="145" y="68" fill="#a78bfa" fontSize="11" fontWeight="bold">90°</text>
                          {/* Points */}
                          <circle cx="220" cy="80" r="5" fill="#22d3ee" />
                          <text x="225" y="76" fill="#22d3ee" fontSize="12" fontWeight="bold">A(x, y)</text>
                          <circle cx="100" cy="40" r="5" fill="#f59e0b" />
                          <text x="50" y="36" fill="#f59e0b" fontSize="12" fontWeight="bold">A'(−y, x)</text>
                          <circle cx="140" cy="120" r="4" fill="white" fillOpacity="0.6" />
                        </svg>
                      </div>
                    )}

                    {/* Diagram: E. Dilatasi */}
                    {idx === 5 && (
                      <div className="mt-5 bg-white/5 border border-cyan-500/20 rounded-xl p-3">
                        <p className="text-xs text-center text-cyan-400 font-display mb-2">Dilatasi dengan pusat O dan faktor k: A(x,y) → A'(kx, ky)</p>
                        <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto block" aria-label="Diagram dilatasi">
                          <defs>
                            <marker id="arr-di" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                              <polygon points="0 0, 7 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
                            </marker>
                          </defs>
                          {/* Grid */}
                          {[40,80,120,160,200,240].map(x => (
                            <line key={`gx${x}`} x1={x} y1="10" x2={x} y2="210" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                          ))}
                          {[40,80,120,160,200].map(y => (
                            <line key={`gy${y}`} x1="10" y1={y} x2="270" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                          ))}
                          {/* Axes */}
                          <line x1="20" y1="175" x2="265" y2="175" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arr-di)" />
                          <line x1="40" y1="210" x2="40" y2="15" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" markerEnd="url(#arr-di)" />
                          <text x="268" y="179" fill="rgba(255,255,255,0.5)" fontSize="11">x</text>
                          <text x="44" y="12" fill="rgba(255,255,255,0.5)" fontSize="11">y</text>
                          <text x="24" y="187" fill="rgba(255,255,255,0.4)" fontSize="10">O</text>
                          {/* Triangle ABC small (original): A(1,2)→(80,95) B(1,1)→(80,135) C(2,1)→(120,135) */}
                          <polygon points="80,95 80,135 120,135" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="2" />
                          <text x="65" y="92" fill="#22d3ee" fontSize="11" fontWeight="bold">A</text>
                          <text x="65" y="145" fill="#22d3ee" fontSize="11" fontWeight="bold">B</text>
                          <text x="122" y="145" fill="#22d3ee" fontSize="11" fontWeight="bold">C</text>
                          {/* Triangle A'B'C' large (k=2): A'(2,4)→(120,15) B'(2,2)→(120,95) C'(4,2)→(200,95) */}
                          <polygon points="120,15 120,95 200,95" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3" />
                          <text x="124" y="13" fill="#f59e0b" fontSize="11" fontWeight="bold">A'</text>
                          <text x="124" y="108" fill="#f59e0b" fontSize="11" fontWeight="bold">B'</text>
                          <text x="204" y="108" fill="#f59e0b" fontSize="11" fontWeight="bold">C'</text>
                          {/* Rays from O through each vertex */}
                          <line x1="40" y1="175" x2="125" y2="13" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3" />
                          <line x1="40" y1="175" x2="125" y2="93" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3" />
                          <line x1="40" y1="175" x2="205" y2="93" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3" />
                          {/* k label */}
                          <text x="160" y="140" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="bold">k = 2</text>
                          <circle cx="40" cy="175" r="4" fill="white" fillOpacity="0.6" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Dasar Tab */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => {
              const key = `d-${soal.no}`;
              const open = openPembahasan.has(key);
              const pembahasan = pembahasanDasar[soal.no];
              return (
                <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="text-accent font-bold">{soal.no}.</span>{" "}
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  {pembahasan && (
                    <div className="pt-3">
                      <button
                        onClick={() => togglePembahasan(key)}
                        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/30 transition-colors"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {open ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
                        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {open && (
                        <div className="mt-2 bg-yellow-500/5 border-l-4 border-yellow-400 rounded-r-lg px-3 py-2 space-y-1">
                          {pembahasan}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Latihan Olimpiade Tab */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => {
              const key = `o-${soal.no}`;
              const open = openPembahasan.has(key);
              const pembahasan = pembahasanOlimpiade[soal.no];
              return (
                <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="text-accent font-bold">{soal.no}.</span>{" "}
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  {pembahasan && (
                    <div className="pt-3">
                      <button
                        onClick={() => togglePembahasan(key)}
                        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/30 transition-colors"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {open ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
                        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {open && (
                        <div className="mt-2 bg-yellow-500/5 border-l-4 border-yellow-400 rounded-r-lg px-3 py-2 space-y-1">
                          {pembahasan}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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

export default OlimpiadeTransformasiPage;
