import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { FlipHorizontal2 } from "lucide-react";

const FreqTable = ({ headers, rows, caption }: { headers: string[]; rows: (string | number)[][]; caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-rose-500/30 my-2">
    {caption && <div className="text-[10px] text-rose-300/70 font-bold text-center pt-2 px-2">{caption}</div>}
    <table className="min-w-full text-xs font-body">
      <thead>
        <tr className="bg-rose-900/40">
          {headers.map((h, i) => (
            <th key={i} className="px-3 py-2 text-rose-200 font-bold text-center border-b border-rose-500/30">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-rose-900/10"}>
            {row.map((cell, ci) => (
              <td key={ci} className="px-3 py-2 text-center text-white/80 border-b border-white/5">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const VennDiagram = ({ label, aLabel, aCompLabel, pa, pac }: { label: string; aLabel: string; aCompLabel: string; pa: string; pac: string }) => (
  <svg viewBox="0 0 280 110" className="w-full max-w-xs mx-auto">
    <rect x={5} y={5} width={270} height={100} rx={10} fill="none" stroke="#f43f5e" strokeWidth={2} opacity={0.6} />
    <text x={20} y={22} fill="#f43f5e" fontSize={10} fontWeight="bold">{label} (Ruang Sampel S)</text>
    <ellipse cx={105} cy={60} rx={65} ry={35} fill="#f43f5e" fillOpacity={0.25} stroke="#f43f5e" strokeWidth={2} />
    <text x={78} y={55} fill="#fda4af" fontSize={11} fontWeight="bold">{aLabel}</text>
    <text x={70} y={72} fill="#fda4af" fontSize={10}>P = {pa}</text>
    <text x={185} y={55} fill="#c4b5fd" fontSize={11} fontWeight="bold">{aCompLabel}</text>
    <text x={178} y={72} fill="#c4b5fd" fontSize={10}>P = {pac}</text>
  </svg>
);

const DiceGrid = ({ highlight }: { highlight?: (i: number, j: number) => boolean }) => (
  <div className="overflow-x-auto rounded-xl border border-rose-500/30 my-2">
    <table className="text-[10px] font-body">
      <thead>
        <tr className="bg-rose-900/50">
          <th className="px-2 py-1 text-rose-300 border border-rose-500/20 w-10">🎲₁\🎲₂</th>
          {[1,2,3,4,5,6].map(n => (
            <th key={n} className="px-2 py-1 text-rose-300 border border-rose-500/20 w-10">{n}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[1,2,3,4,5,6].map(i => (
          <tr key={i}>
            <td className="px-2 py-1 text-rose-300 font-bold bg-rose-900/40 border border-rose-500/20 text-center">{i}</td>
            {[1,2,3,4,5,6].map(j => (
              <td key={j} className={`px-1 py-1 border border-rose-500/10 text-center transition-colors ${highlight && highlight(i,j) ? "bg-rose-400/30 text-rose-200 font-bold" : "text-white/60"}`}>
                ({i},{j})
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Konsep Komplemen Kejadian", {
    type: "mixed",
    diagram: <VennDiagram label="S" aLabel="A" aCompLabel="A'" pa="P(A)" pac="P(A')" />,
    content: "Komplemen suatu kejadian A adalah kejadian A' (dibaca: 'A komplemen'), yaitu semua titik sampel yang BUKAN A.",
    parts: [
      { label: "a.", math: "P(A) + P(A') = 1" },
      { label: "b.", math: "P(A') = 1 - P(A)" },
      { label: "c.", text: "Jika P(A) = 3/7, berapa P(A')?" },
    ],
  }),
  Qn(2, "Komplemen – Dadu Tunggal", {
    type: "mixed",
    content: "Sebuah dadu dilempar. A = kejadian muncul angka prima = {2, 3, 5}.",
    parts: [
      { label: "a.", math: "P(A) = \\frac{3}{6} = \\frac{1}{2}" },
      { label: "b.", math: "A' = \\text{komplemen prima} = \\{1, 4, 6\\}" },
      { label: "c.", math: "P(A') = 1 - \\frac{1}{2} = \\frac{1}{2}" },
    ],
  }),
  Qn(3, "Komplemen – Koin Tunggal", {
    type: "mixed",
    diagram: <VennDiagram label="S = {A, G}" aLabel="A = Angka" aCompLabel="A' = Gambar" pa="1/2" pac="1/2" />,
    parts: [
      { label: "a.", math: "P(\\text{Angka}) = \\frac{1}{2}" },
      { label: "b.", math: "P(\\text{Gambar}) = P(\\text{Angka}') = 1 - \\frac{1}{2} = \\frac{1}{2}" },
      { label: "c.", text: "Mengapa P(Angka) = P(Angka')? Kapan hal ini tidak berlaku?" },
    ],
  }),
  Qn(4, "Komplemen – Kartu Remi", {
    type: "mixed",
    content: "Satu kartu diambil dari 52 kartu remi. A = muncul kartu As.",
    parts: [
      { label: "a.", math: "P(A) = \\frac{4}{52} = \\frac{1}{13}" },
      { label: "b.", math: "P(A') = P(\\text{bukan As}) = 1 - \\frac{1}{13} = \\frac{12}{13}" },
      { label: "c.", text: "Apakah lebih mudah menghitung P(bukan As) langsung atau menggunakan komplemen? Jelaskan." },
    ],
  }),
  Qn(5, "Menggunakan Komplemen untuk Memudahkan Perhitungan", {
    type: "mixed",
    content: "Dua dadu dilempar. Tentukan peluang jumlah kedua dadu BUKAN 2.",
    parts: [
      { label: "a.", math: "P(\\text{jumlah} = 2) = \\frac{1}{36}" },
      { label: "b.", math: "P(\\text{jumlah} \\neq 2) = 1 - \\frac{1}{36} = \\frac{35}{36}" },
      { label: "c.", text: "Mengapa menggunakan komplemen lebih efisien di sini?" },
    ],
  }),
  Qn(6, "Komplemen – Bola Berwarna", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Isi kantong bola"
        headers={["Warna","Merah","Biru","Kuning","Total"]}
        rows={[["Banyak",8,5,7,20]]}
      />
    ),
    parts: [
      { label: "a.", math: "P(\\text{Merah}) = \\frac{8}{20} = \\frac{2}{5}" },
      { label: "b.", math: "P(\\text{bukan Merah}) = 1 - \\frac{2}{5} = \\frac{3}{5}" },
      { label: "c.", math: "\\text{Verifikasi: } P(\\text{Biru}) + P(\\text{Kuning}) = \\frac{5+7}{20} = \\frac{12}{20} = \\frac{3}{5} \\checkmark" },
    ],
  }),
  Qn(7, "Soal UN – Komplemen Dadu", {
    type: "mixed",
    content: "Sebuah dadu dilempar. Tentukan peluang muncul angka yang bukan kelipatan 2.",
    parts: [
      { label: "a.", math: "A = \\text{kelipatan 2} = \\{2, 4, 6\\} \\Rightarrow P(A) = \\frac{3}{6} = \\frac{1}{2}" },
      { label: "b.", math: "A' = \\text{bukan kelipatan 2} = \\{1, 3, 5\\}" },
      { label: "c.", math: "P(A') = 1 - \\frac{1}{2} = \\frac{1}{2}" },
    ],
  }),
  Qn(8, "Mencari P(A) dari P(A') yang Diketahui", {
    type: "mixed",
    content: "Peluang tidak hujan hari ini adalah 0,65. Berapa peluang hujan?",
    parts: [
      { label: "a.", math: "P(\\text{tidak hujan}) = 0{,}65 = P(A')" },
      { label: "b.", math: "P(\\text{hujan}) = P(A) = 1 - 0{,}65 = \\ldots" },
      { label: "c.", text: "Jika besok P(hujan) = 0,4, berapa P(tidak hujan) besok?" },
    ],
  }),
  Qn(9, "Komplemen – Soal Cerita Ujian", {
    type: "mixed",
    content: "Peluang seorang siswa lulus ujian adalah 4/5. Berapa peluang siswa tersebut tidak lulus?",
    parts: [
      { label: "a.", math: "P(\\text{lulus}) = \\frac{4}{5}" },
      { label: "b.", math: "P(\\text{tidak lulus}) = 1 - \\frac{4}{5} = \\frac{1}{5}" },
      { label: "c.", text: "Jika ada 200 siswa mengikuti ujian, berapa frekuensi harapan yang tidak lulus?" },
    ],
  }),
  Qn(10, "Memilih Mana yang Lebih Mudah – Komplemen", {
    type: "mixed",
    content: "Kartu bernomor 1–20 diacak. A = angka bukan prima.",
    parts: [
      { label: "a.", math: "A' = \\text{prima dari 1–20} = \\{2,3,5,7,11,13,17,19\\} \\Rightarrow n(A') = 8" },
      { label: "b.", math: "P(A') = \\frac{8}{20} = \\frac{2}{5}" },
      { label: "c.", math: "P(A) = 1 - \\frac{2}{5} = \\frac{3}{5}" },
    ],
  }),
  Qn(11, "Komplemen – Spinner", {
    type: "mixed",
    content: "Sebuah spinner dengan 8 sektor sama besar bernomor 1–8. A = angka lebih dari 5.",
    parts: [
      { label: "a.", math: "A = \\{6,7,8\\} \\Rightarrow P(A) = \\frac{3}{8}" },
      { label: "b.", math: "A' = \\{1,2,3,4,5\\} \\Rightarrow P(A') = \\frac{5}{8}" },
      { label: "c.", math: "P(A) + P(A') = \\frac{3}{8} + \\frac{5}{8} = 1 \\checkmark" },
    ],
  }),
  Qn(12, "Soal UN – Mencari P(A) dari P(A')", {
    type: "mixed",
    content: "Peluang tidak terpilihnya kelereng merah dari suatu kantong adalah 5/8. Berapa peluang terpilihnya kelereng merah?",
    parts: [
      { label: "a.", math: "P(\\text{merah}') = \\frac{5}{8}" },
      { label: "b.", math: "P(\\text{merah}) = 1 - \\frac{5}{8} = \\frac{3}{8}" },
      { label: "c.", text: "Jika ada 40 kelereng, berapa kelereng merah dan berapa kelereng bukan merah?" },
    ],
  }),
  Qn(13, "Komplemen – Dua Koin", {
    type: "mixed",
    content: "Dua koin dilempar. A = paling sedikit satu muncul Angka.",
    diagram: <VennDiagram label="S (4 titik sampel)" aLabel="A: AA,AG,GA" aCompLabel="A': GG" pa="3/4" pac="1/4" />,
    parts: [
      { label: "a.", math: "A' = \\text{tidak ada Angka} = \\{\\text{GG}\\}" },
      { label: "b.", math: "P(A') = \\frac{1}{4}" },
      { label: "c.", math: "P(A) = 1 - \\frac{1}{4} = \\frac{3}{4}" },
    ],
  }),
  Qn(14, "Komplemen – Kartu Gambar Remi", {
    type: "mixed",
    content: "Satu kartu diambil dari 52 kartu remi. A = kartu gambar (J, Q, K).",
    parts: [
      { label: "a.", math: "n(A) = 4 \\times 3 = 12 \\Rightarrow P(A) = \\frac{12}{52} = \\frac{3}{13}" },
      { label: "b.", math: "P(A') = 1 - \\frac{3}{13} = \\frac{10}{13}" },
      { label: "c.", text: "Kartu apa saja yang termasuk A' (bukan kartu gambar)?" },
    ],
  }),
  Qn(15, "Soal TKA – Komplemen Kompleks", {
    type: "mixed",
    content: "Sebuah kantong berisi 3 merah, 4 biru, 5 hijau. A = tidak terambil bola hijau.",
    parts: [
      { label: "a.", math: "P(\\text{hijau}) = \\frac{5}{12}" },
      { label: "b.", math: "P(A) = P(\\text{bukan hijau}) = 1 - \\frac{5}{12} = \\frac{7}{12}" },
      { label: "c.", math: "P(A) = \\frac{3+4}{12} = \\frac{7}{12} \\checkmark \\text{ (verifikasi langsung)}" },
    ],
  }),
  Qn(16, "Soal UN – Komplemen dalam Konteks", {
    type: "mixed",
    content: "Di kelas 9 terdapat 36 siswa. 15 siswa suka matematika, 12 suka IPA, 9 suka keduanya.",
    diagram: (
      <FreqTable
        caption="Distribusi minat siswa"
        headers={["Kategori","Suka Mat","Suka IPA","Keduanya","Tidak Keduanya"]}
        rows={[["Siswa",15,12,9,"?"]]}
      />
    ),
    parts: [
      { label: "a.", text: "Berapa siswa yang tidak suka keduanya (matematika maupun IPA)?" },
      { label: "b.", text: "Berapa peluang seorang siswa tidak suka matematika maupun IPA?" },
      { label: "c.", math: "P(\\text{tidak keduanya}) = 1 - P(\\text{suka setidaknya satu})" },
    ],
  }),
  Qn(17, "Komplemen – Soal Cuaca Lanjutan", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Prediksi cuaca 7 hari ke depan"
        headers={["Hari","Sen","Sel","Rab","Kam","Jum","Sab","Min"]}
        rows={[["P(Hujan)","0,3","0,5","0,4","0,2","0,6","0,3","0,1"]]}
      />
    ),
    parts: [
      { label: "a.", text: "Pada hari apa peluang tidak hujan paling besar?" },
      { label: "b.", text: "Hitung P(tidak hujan) untuk setiap hari." },
      { label: "c.", text: "Berapa hari yang peluang hujannya lebih dari 0,4?" },
    ],
  }),
  Qn(18, "Soal UN – Komplemen Berganda", {
    type: "mixed",
    content: "Dalam sebuah kantong terdapat bola berwarna. P(merah) = 0,3 dan P(biru) = 0,25. Sisanya bola hijau.",
    parts: [
      { label: "a.", math: "P(\\text{hijau}) = 1 - 0{,}3 - 0{,}25 = \\ldots" },
      { label: "b.", math: "P(\\text{bukan hijau}) = P(\\text{merah}) + P(\\text{biru}) = \\ldots" },
      { label: "c.", text: "Jika ada 40 bola, berapa bola hijau?" },
    ],
  }),
  Qn(19, "Komplemen – Kartu Bernomor 1–25", {
    type: "mixed",
    content: "Kartu bernomor 1–25 diacak. Satu kartu diambil. A = bukan kelipatan 5.",
    parts: [
      { label: "a.", math: "A' = \\text{kelipatan 5 dari 1–25} = \\{5,10,15,20,25\\} \\Rightarrow n(A') = 5" },
      { label: "b.", math: "P(A') = \\frac{5}{25} = \\frac{1}{5}" },
      { label: "c.", math: "P(A) = 1 - \\frac{1}{5} = \\frac{4}{5}" },
    ],
  }),
  Qn(20, "Soal ANBK – Komplemen Sederhana", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Hasil survei hobi 60 siswa"
        headers={["Hobi","Membaca","Olahraga","Musik","Total"]}
        rows={[["Siswa",20,25,15,60]]}
      />
    ),
    parts: [
      { label: "a.", math: "P(\\text{Olahraga}) = \\frac{25}{60} = \\frac{5}{12}" },
      { label: "b.", math: "P(\\text{bukan Olahraga}) = 1 - \\frac{5}{12} = \\frac{7}{12}" },
      { label: "c.", text: "Verifikasi: P(Membaca) + P(Musik) = P(bukan Olahraga)?" },
    ],
  }),
  Qn(21, "Soal UN – Aplikasi Komplemen dalam Kehidupan", {
    type: "mixed",
    content: "Peluang sebuah pesawat tiba tepat waktu adalah 0,92. Berapa peluang pesawat terlambat atau dibatalkan?",
    parts: [
      { label: "a.", math: "P(\\text{tepat waktu}) = 0{,}92" },
      { label: "b.", math: "P(\\text{tidak tepat waktu}) = 1 - 0{,}92 = \\ldots" },
      { label: "c.", text: "Jika ada 250 penerbangan, berapa frekuensi harapan penerbangan yang tidak tepat waktu?" },
    ],
  }),
  Qn(22, "Komplemen – Soal Pabrik", {
    type: "mixed",
    content: "Peluang produk tidak cacat adalah 0,96. Pabrik memproduksi 5.000 unit.",
    parts: [
      { label: "a.", math: "P(\\text{cacat}) = 1 - 0{,}96 = \\ldots" },
      { label: "b.", math: "f_h(\\text{cacat}) = 5000 \\times \\ldots = \\ldots" },
      { label: "c.", text: "Berapa unit yang diharapkan tidak cacat?" },
    ],
  }),
  Qn(23, "Soal UN – Komplemen dan fh", {
    type: "mixed",
    content: "Peluang siswa tidak membawa tugas adalah 1/8. Dalam 1 semester ada 64 pertemuan.",
    parts: [
      { label: "a.", math: "P(\\text{tidak bawa tugas}) = \\frac{1}{8}" },
      { label: "b.", math: "P(\\text{bawa tugas}) = 1 - \\frac{1}{8} = \\frac{7}{8}" },
      { label: "c.", math: "f_h(\\text{bawa tugas}) = 64 \\times \\frac{7}{8} = \\ldots" },
    ],
  }),
  Qn(24, "Soal TKA – P(A') Lebih Mudah dari P(A)", {
    type: "mixed",
    content: "Tiga koin dilempar. A = paling sedikit satu Angka.",
    parts: [
      { label: "a.", math: "A' = \\text{tidak ada Angka} = \\{\\text{GGG}\\} \\Rightarrow P(A') = \\frac{1}{8}" },
      { label: "b.", math: "P(A) = 1 - \\frac{1}{8} = \\frac{7}{8}" },
      { label: "c.", text: "Mengapa lebih mudah menghitung P(A) menggunakan komplemen?" },
    ],
  }),
];

const KomplementPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <FlipHorizontal2 className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: "0 0 20px rgba(251,113,133,0.7)" }}>
            KOMPLEMEN SUATU KEJADIAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 24 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="flex flex-col gap-2">
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
              <BlockMath math="P(A') = 1 - P(A)" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-body">
              {[
                { label: "A' = Komplemen A", val: "Semua di luar A" },
                { label: "P(A) + P(A') = 1", val: "Selalu berlaku!" },
              ].map(r => (
                <div key={r.label} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                  <div className="text-rose-300 text-[10px] font-bold">{r.label}</div>
                  <div className="text-white/50 text-[10px]">{r.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.math && <div className="mb-3 text-white overflow-x-auto"><BlockMath math={q.math} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? "bg-white/5" : "bg-transparent px-0"}`}>
                            {p.label && <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/peluang"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default KomplementPage;
