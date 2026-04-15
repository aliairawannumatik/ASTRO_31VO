import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Layers } from "lucide-react";

const FreqTable = ({ headers, rows, caption }: { headers: string[]; rows: (string | number)[][]; caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-indigo-500/30 my-2">
    {caption && <div className="text-[10px] text-indigo-300/70 font-bold text-center pt-2 px-2">{caption}</div>}
    <table className="min-w-full text-xs font-body">
      <thead>
        <tr className="bg-indigo-900/40">
          {headers.map((h, i) => (
            <th key={i} className="px-3 py-2 text-indigo-200 font-bold text-center border-b border-indigo-500/30">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-indigo-900/10"}>
            {row.map((cell, ci) => (
              <td key={ci} className="px-3 py-2 text-center text-white/80 border-b border-white/5">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const VennTwo = ({ aOnly, both, bOnly, neither, label }: { aOnly: string; both: string; bOnly: string; neither?: string; label?: string }) => (
  <svg viewBox="0 0 300 120" className="w-full max-w-xs mx-auto">
    <rect x={4} y={4} width={292} height={112} rx={10} fill="none" stroke="#818cf8" strokeWidth={1.5} opacity={0.5} />
    {label && <text x={16} y={18} fill="#818cf8" fontSize={9} fontWeight="bold">{label}</text>}
    <ellipse cx={108} cy={64} rx={75} ry={40} fill="#3730a3" fillOpacity={0.4} stroke="#818cf8" strokeWidth={1.5} />
    <ellipse cx={192} cy={64} rx={75} ry={40} fill="#6d28d9" fillOpacity={0.3} stroke="#a78bfa" strokeWidth={1.5} />
    <text x={62} y={60} fill="#a5b4fc" fontSize={10} fontWeight="bold">A</text>
    <text x={52} y={74} fill="#c7d2fe" fontSize={9}>{aOnly}</text>
    <text x={135} y={60} fill="#e0e7ff" fontSize={10} fontWeight="bold">A∩B</text>
    <text x={133} y={74} fill="#ddd6fe" fontSize={9}>{both}</text>
    <text x={212} y={60} fill="#c4b5fd" fontSize={10} fontWeight="bold">B</text>
    <text x={205} y={74} fill="#ddd6fe" fontSize={9}>{bOnly}</text>
    {neither && <text x={240} y={24} fill="#94a3b8" fontSize={9}>{neither}</text>}
  </svg>
);

const DiceGrid = ({ highlight }: { highlight?: (i: number, j: number) => boolean }) => (
  <div className="overflow-x-auto rounded-xl border border-indigo-500/30 my-2">
    <table className="text-[10px] font-body">
      <thead>
        <tr className="bg-indigo-900/50">
          <th className="px-2 py-1 text-indigo-300 border border-indigo-500/20 w-10">🎲₁\🎲₂</th>
          {[1,2,3,4,5,6].map(n => (
            <th key={n} className="px-2 py-1 text-indigo-300 border border-indigo-500/20 w-10">{n}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[1,2,3,4,5,6].map(i => (
          <tr key={i}>
            <td className="px-2 py-1 text-indigo-300 font-bold bg-indigo-900/40 border border-indigo-500/20 text-center">{i}</td>
            {[1,2,3,4,5,6].map(j => (
              <td key={j} className={`px-1 py-1 border border-indigo-500/10 text-center transition-colors ${highlight && highlight(i,j) ? "bg-indigo-400/30 text-indigo-200 font-bold" : "text-white/60"}`}>
                {i+j}
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
  Qn(1, "Aturan Penjumlahan – Saling Lepas", {
    type: "mixed",
    diagram: <VennTwo aOnly="A saja" both="∅" bOnly="B saja" label="S – Saling Lepas (A∩B=∅)" />,
    content: "Dua kejadian A dan B dikatakan saling lepas jika A ∩ B = ∅ (tidak mungkin terjadi bersamaan).",
    parts: [
      { label: "a.", math: "P(A \\cup B) = P(A) + P(B)" },
      { label: "b.", text: "Contoh: A = muncul angka 1, B = muncul angka 6 pada satu lemparan dadu." },
      { label: "c.", math: "P(A \\cup B) = \\frac{1}{6} + \\frac{1}{6} = \\frac{2}{6} = \\frac{1}{3}" },
    ],
  }),
  Qn(2, "Aturan Penjumlahan – Tidak Saling Lepas", {
    type: "mixed",
    diagram: <VennTwo aOnly="A∩B'" both="A∩B" bOnly="A'∩B" label="S – Tidak Saling Lepas" />,
    content: "Jika A dan B bisa terjadi bersamaan (A ∩ B ≠ ∅), gunakan aturan penjumlahan umum.",
    parts: [
      { label: "a.", math: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)" },
      { label: "b.", text: "Mengapa dikurangi P(A ∩ B)? Karena anggota irisan dihitung dua kali." },
      { label: "c.", text: "Jika P(A) = 1/2, P(B) = 1/3, P(A∩B) = 1/6, hitung P(A∪B)." },
    ],
  }),
  Qn(3, "Kejadian Saling Lepas – Dadu Tunggal", {
    type: "mixed",
    content: "Sebuah dadu dilempar sekali. A = muncul angka prima, B = muncul angka 6.",
    parts: [
      { label: "a.", math: "A = \\{2,3,5\\},\\; B = \\{6\\}" },
      { label: "b.", math: "A \\cap B = \\emptyset \\Rightarrow \\text{saling lepas}" },
      { label: "c.", math: "P(A \\cup B) = \\frac{3}{6} + \\frac{1}{6} = \\frac{4}{6} = \\frac{2}{3}" },
    ],
  }),
  Qn(4, "Kartu Bridge – Tidak Saling Lepas", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Distribusi kartu bridge 52 lembar"
        headers={["","Gambar (J,Q,K)","Bukan Gambar","Total"]}
        rows={[["Merah",6,20,26],["Hitam",6,20,26],["Total",12,40,52]]}
      />
    ),
    content: "Satu kartu diambil. A = kartu merah, B = kartu bergambar.",
    parts: [
      { label: "a.", math: "P(A) = \\frac{26}{52},\\; P(B) = \\frac{12}{52},\\; P(A \\cap B) = \\frac{6}{52}" },
      { label: "b.", math: "P(A \\cup B) = \\frac{26}{52} + \\frac{12}{52} - \\frac{6}{52} = \\frac{32}{52} = \\frac{8}{13}" },
      { label: "c.", text: "Apakah A dan B saling lepas? Jelaskan alasannya." },
    ],
  }),
  Qn(5, "Aturan Perkalian – Saling Bebas", {
    type: "mixed",
    content: "Dua kejadian A dan B disebut saling bebas jika terjadinya A tidak mempengaruhi peluang B.",
    parts: [
      { label: "a.", math: "P(A \\cap B) = P(A) \\times P(B)" },
      { label: "b.", text: "Contoh saling bebas: melempar koin dan melempar dadu secara terpisah." },
      { label: "c.", text: "Contoh tidak saling bebas: mengambil bola tanpa pengembalian dari kotak yang sama." },
    ],
  }),
  Qn(6, "Dua Koin – Saling Bebas", {
    type: "mixed",
    content: "Sebuah koin dan sebuah dadu dilempar bersamaan. A = koin Angka, B = dadu angka genap.",
    parts: [
      { label: "a.", math: "P(A) = \\frac{1}{2},\\; P(B) = \\frac{3}{6} = \\frac{1}{2}" },
      { label: "b.", math: "P(A \\cap B) = P(A) \\times P(B) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}" },
      { label: "c.", text: "Mengapa A dan B saling bebas dalam kasus ini?" },
    ],
  }),
  Qn(7, "Dua Dadu – Aturan Perkalian Saling Bebas", {
    type: "mixed",
    diagram: <DiceGrid highlight={(i,j) => i===3 && j===4} />,
    content: "Dua dadu dilempar. A = dadu pertama = 3, B = dadu kedua = 4. Sel yang diarsir adalah A ∩ B.",
    parts: [
      { label: "a.", math: "P(A) = \\frac{1}{6},\\; P(B) = \\frac{1}{6}" },
      { label: "b.", math: "P(A \\cap B) = \\frac{1}{6} \\times \\frac{1}{6} = \\frac{1}{36}" },
      { label: "c.", text: "Verifikasi: hitung langsung n(A∩B)/n(S) dari tabel." },
    ],
  }),
  Qn(8, "Peluang Bersyarat – Pengertian", {
    type: "mixed",
    content: "Peluang bersyarat P(A|B) adalah peluang terjadinya A dengan syarat B sudah terjadi.",
    parts: [
      { label: "a.", math: "P(A|B) = \\frac{P(A \\cap B)}{P(B)},\\; P(B) \\neq 0" },
      { label: "b.", text: "Jika P(A∩B) = 1/12 dan P(B) = 1/4, hitung P(A|B)." },
      { label: "c.", math: "P(A|B) = \\frac{1/12}{1/4} = \\frac{1}{12} \\times \\frac{4}{1} = \\frac{4}{12} = \\frac{1}{3}" },
    ],
  }),
  Qn(9, "Aturan Perkalian Umum – Tidak Saling Bebas", {
    type: "mixed",
    content: "Dua bola diambil dari kotak berisi 5 merah dan 3 biru tanpa pengembalian.",
    parts: [
      { label: "a.", math: "P(M_1) = \\frac{5}{8}" },
      { label: "b.", math: "P(M_2 | M_1) = \\frac{4}{7} \\quad \\text{(merah berkurang 1)}" },
      { label: "c.", math: "P(M_1 \\cap M_2) = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}" },
    ],
  }),
  Qn(10, "Soal UN – Menentukan Jenis Kejadian", {
    type: "mixed",
    content: "Dari 52 kartu bridge, satu kartu diambil. A = kartu As, B = kartu hitam.",
    diagram: (
      <FreqTable
        caption="Perpotongan A dan B"
        headers={["","As","Bukan As","Total"]}
        rows={[["Hitam",2,24,26],["Merah",2,24,26],["Total",4,48,52]]}
      />
    ),
    parts: [
      { label: "a.", text: "Apakah A dan B saling lepas? Jelaskan (lihat sel A∩B = As Hitam = 2 kartu)." },
      { label: "b.", math: "P(A \\cup B) = \\frac{4}{52} + \\frac{26}{52} - \\frac{2}{52} = \\frac{28}{52} = \\frac{7}{13}" },
      { label: "c.", text: "Apakah A dan B saling bebas? Cek: P(A|B) = P(A)?" },
    ],
  }),
  Qn(11, "Dua Dadu – Jumlah Tertentu", {
    type: "mixed",
    diagram: <DiceGrid highlight={(i,j) => i+j===7} />,
    content: "Dua dadu dilempar. A = jumlah = 7 (sel diarsir). B = dadu pertama = 3.",
    parts: [
      { label: "a.", math: "A = \\{(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)\\} \\Rightarrow P(A) = \\frac{6}{36} = \\frac{1}{6}" },
      { label: "b.", math: "A \\cap B = \\{(3,4)\\} \\Rightarrow P(A \\cap B) = \\frac{1}{36}" },
      { label: "c.", math: "P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{1/36}{1/6} = \\frac{1}{6}" },
    ],
  }),
  Qn(12, "Soal UN – Kartu Bridge Bertingkat", {
    type: "mixed",
    content: "Dari 52 kartu bridge, satu kartu diambil. A = kartu merah, B = kartu As.",
    parts: [
      { label: "a.", math: "P(A) = \\frac{26}{52} = \\frac{1}{2},\\; P(B) = \\frac{4}{52} = \\frac{1}{13}" },
      { label: "b.", math: "P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{2/52}{4/52} = \\frac{2}{4} = \\frac{1}{2}" },
      { label: "c.", text: "Apakah A dan B saling bebas? (Bandingkan P(A|B) dan P(A))" },
    ],
  }),
  Qn(13, "Koin dan Dadu – Kejadian Majemuk", {
    type: "mixed",
    content: "Sebuah koin dan sebuah dadu dilempar. A = koin Gambar, B = dadu angka ganjil.",
    parts: [
      { label: "a.", math: "P(A) = \\frac{1}{2},\\; P(B) = \\frac{3}{6} = \\frac{1}{2}" },
      { label: "b.", math: "P(A \\cap B) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4} \\quad \\text{(saling bebas)}" },
      { label: "c.", math: "P(A \\cup B) = \\frac{1}{2} + \\frac{1}{2} - \\frac{1}{4} = \\frac{3}{4}" },
    ],
  }),
  Qn(14, "Pengambilan Tanpa Pengembalian – Dua Tahap", {
    type: "mixed",
    content: "Kotak berisi 4 bola merah (M) dan 6 bola biru (B). Dua bola diambil tanpa pengembalian.",
    diagram: (
      <FreqTable
        caption="Peluang tiap kombinasi"
        headers={["Pengambilan","Bola ke-1","Bola ke-2","Peluang Gabungan"]}
        rows={[
          ["MM","4/10","3/9","12/90 = 2/15"],
          ["MB","4/10","6/9","24/90 = 4/15"],
          ["BM","6/10","4/9","24/90 = 4/15"],
          ["BB","6/10","5/9","30/90 = 1/3"],
        ]}
      />
    ),
    parts: [
      { label: "a.", text: "Verifikasi: jumlahkan semua peluang = 2/15 + 4/15 + 4/15 + 1/3 = 1 ✓" },
      { label: "b.", text: "Berapa peluang terambil paling sedikit satu merah?" },
      { label: "c.", math: "P(\\text{setidaknya 1 M}) = 1 - P(\\text{BB}) = 1 - \\frac{1}{3} = \\frac{2}{3}" },
    ],
  }),
  Qn(15, "Soal ANBK – Gabungan Kartu", {
    type: "mixed",
    content: "Dari 52 kartu bridge, satu kartu diambil. Tentukan peluang kartu merah atau kartu bernomor 7.",
    parts: [
      { label: "a.", math: "P(\\text{merah}) = \\frac{26}{52},\\; P(\\text{angka 7}) = \\frac{4}{52}" },
      { label: "b.", math: "P(\\text{merah} \\cap \\text{angka 7}) = \\frac{2}{52} \\quad \\text{(7 merah ada 2)}" },
      { label: "c.", math: "P(\\text{merah} \\cup \\text{angka 7}) = \\frac{26+4-2}{52} = \\frac{28}{52} = \\frac{7}{13}" },
    ],
  }),
  Qn(16, "Pengambilan Dengan Pengembalian – Saling Bebas", {
    type: "mixed",
    content: "Kotak berisi 3 merah dan 7 biru. Dua bola diambil satu per satu dengan pengembalian.",
    parts: [
      { label: "a.", math: "P(M_1 \\cap M_2) = \\frac{3}{10} \\times \\frac{3}{10} = \\frac{9}{100}" },
      { label: "b.", math: "P(\\text{berbeda warna}) = P(M_1 B_2) + P(B_1 M_2) = \\frac{3}{10} \\cdot \\frac{7}{10} + \\frac{7}{10} \\cdot \\frac{3}{10} = \\frac{42}{100} = \\frac{21}{50}" },
      { label: "c.", text: "Bandingkan dengan pengambilan tanpa pengembalian. Mana yang lebih besar P(berbeda warna)?" },
    ],
  }),
  Qn(17, "Soal UN – P(A∪B) diketahui P(A), P(B), P(A∩B)", {
    type: "mixed",
    content: "P(A) = 0,4, P(B) = 0,5, P(A∩B) = 0,2. Tentukan P(A∪B) dan P((A∪B)').",
    parts: [
      { label: "a.", math: "P(A \\cup B) = 0{,}4 + 0{,}5 - 0{,}2 = 0{,}7" },
      { label: "b.", math: "P((A \\cup B)') = 1 - 0{,}7 = 0{,}3" },
      { label: "c.", text: "Apa arti P((A∪B)') dalam konteks soal?" },
    ],
  }),
  Qn(18, "Dua Dadu – Aturan Penjumlahan", {
    type: "mixed",
    diagram: <DiceGrid highlight={(i,j) => (i+j===5) || (i+j===9)} />,
    content: "Dua dadu dilempar. A = jumlah 5 (diarsir atas), B = jumlah 9. Apakah saling lepas?",
    parts: [
      { label: "a.", math: "A = \\{(1,4),(2,3),(3,2),(4,1)\\} \\Rightarrow n(A)=4" },
      { label: "b.", math: "B = \\{(3,6),(4,5),(5,4),(6,3)\\} \\Rightarrow n(B)=4" },
      { label: "c.", math: "A \\cap B = \\emptyset \\Rightarrow P(A \\cup B) = \\frac{4}{36} + \\frac{4}{36} = \\frac{8}{36} = \\frac{2}{9}" },
    ],
  }),
  Qn(19, "Soal TKA – Mencari P(A∩B) dari P(A|B)", {
    type: "mixed",
    content: "P(B) = 1/5 dan P(A|B) = 3/4. Tentukan P(A∩B).",
    parts: [
      { label: "a.", math: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}" },
      { label: "b.", math: "P(A \\cap B) = P(A|B) \\times P(B) = \\frac{3}{4} \\times \\frac{1}{5} = \\frac{3}{20}" },
      { label: "c.", text: "Jika P(A) = 1/2, apakah A dan B saling bebas? (Cek P(A∩B) = P(A)×P(B))" },
    ],
  }),
  Qn(20, "Kejadian Majemuk – Tiga Koin", {
    type: "mixed",
    content: "Tiga koin dilempar. A = koin pertama Angka, B = setidaknya dua Angka.",
    parts: [
      { label: "a.", math: "n(S) = 2^3 = 8 \\Rightarrow S = \\{AAA,AAG,AGA,AGG,GAA,GAG,GGA,GGG\\}" },
      { label: "b.", math: "B = \\{AAA,AAG,AGA,GAA\\} \\Rightarrow P(B) = \\frac{4}{8} = \\frac{1}{2}" },
      { label: "c.", math: "A \\cap B = \\{AAA,AAG,AGA\\} \\Rightarrow P(A \\cap B) = \\frac{3}{8}" },
    ],
  }),
  Qn(21, "Soal UN – Spinner Dua Warna", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Spinner dengan 8 sektor sama besar"
        headers={["Warna","Merah","Biru","Kuning","Total"]}
        rows={[["Sektor",3,3,2,8]]}
      />
    ),
    content: "Dua putaran spinner dilakukan. A = merah pada putaran 1, B = biru pada putaran 2.",
    parts: [
      { label: "a.", math: "P(A) = \\frac{3}{8},\\; P(B) = \\frac{3}{8}" },
      { label: "b.", math: "P(A \\cap B) = \\frac{3}{8} \\times \\frac{3}{8} = \\frac{9}{64} \\quad \\text{(saling bebas, dengan pengembalian)}" },
      { label: "c.", text: "Berapa peluang merah di putaran 1 dan kuning di putaran 2?" },
    ],
  }),
  Qn(22, "Soal ANBK – Himpunan dan Peluang Gabungan", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Data 50 siswa"
        headers={["","Suka Sepak Bola","Tidak","Total"]}
        rows={[["Suka Basket",15,10,25],["Tidak",20,5,25],["Total",35,15,50]]}
      />
    ),
    content: "Satu siswa dipilih acak. A = suka sepak bola, B = suka basket.",
    parts: [
      { label: "a.", math: "P(A) = \\frac{35}{50} = \\frac{7}{10},\\; P(B) = \\frac{25}{50} = \\frac{1}{2},\\; P(A \\cap B) = \\frac{15}{50} = \\frac{3}{10}" },
      { label: "b.", math: "P(A \\cup B) = \\frac{7}{10} + \\frac{1}{2} - \\frac{3}{10} = \\frac{7+5-3}{10} = \\frac{9}{10}" },
      { label: "c.", text: "Berapa peluang siswa tidak suka keduanya (sepak bola maupun basket)?" },
    ],
  }),
  Qn(23, "Soal UN – Setidaknya Satu Kejadian", {
    type: "mixed",
    content: "Dua dadu dilempar. Tentukan peluang setidaknya satu dadu menunjukkan angka 6.",
    parts: [
      { label: "a.", text: "Gunakan komplemen: A' = tidak ada satupun yang 6." },
      { label: "b.", math: "P(\\text{tidak ada 6}) = \\frac{5}{6} \\times \\frac{5}{6} = \\frac{25}{36}" },
      { label: "c.", math: "P(\\text{setidaknya satu 6}) = 1 - \\frac{25}{36} = \\frac{11}{36}" },
    ],
  }),
  Qn(24, "Kartu Bernomor 1–20 – Kejadian Majemuk", {
    type: "mixed",
    content: "Satu kartu dipilih dari kartu bernomor 1–20. A = bilangan prima, B = bilangan ganjil.",
    parts: [
      { label: "a.", math: "A = \\{2,3,5,7,11,13,17,19\\},\\; n(A)=8 \\Rightarrow P(A)=\\frac{8}{20}=\\frac{2}{5}" },
      { label: "b.", math: "A \\cap B = \\{3,5,7,11,13,17,19\\} \\Rightarrow n(A\\cap B)=7 \\Rightarrow P=\\frac{7}{20}" },
      { label: "c.", math: "P(A \\cup B) = \\frac{8}{20} + \\frac{10}{20} - \\frac{7}{20} = \\frac{11}{20}" },
    ],
  }),
  Qn(25, "Soal TKA – Aturan Perkalian Berantai", {
    type: "mixed",
    content: "Kotak berisi 6 bola: 3 merah (M), 2 biru (B), 1 hijau (H). Tiga bola diambil tanpa pengembalian.",
    parts: [
      { label: "a.", math: "P(\\text{ketiganya merah}) = \\frac{3}{6} \\times \\frac{2}{5} \\times \\frac{1}{4} = \\frac{6}{120} = \\frac{1}{20}" },
      { label: "b.", math: "P(\\text{M, B, H}) = \\frac{3}{6} \\times \\frac{2}{5} \\times \\frac{1}{4} = \\frac{1}{20}" },
      { label: "c.", text: "Ada berapa urutan berbeda untuk mengambil 1M, 1B, dan 1H? Apa total peluang semua urutan itu?" },
    ],
  }),
  Qn(26, "Soal UN – Menentukan P(B) dari Kejadian Majemuk", {
    type: "mixed",
    content: "A dan B saling bebas. P(A) = 0,4 dan P(A∩B) = 0,12. Tentukan P(B).",
    parts: [
      { label: "a.", math: "P(A \\cap B) = P(A) \\times P(B) \\Rightarrow 0{,}12 = 0{,}4 \\times P(B)" },
      { label: "b.", math: "P(B) = \\frac{0{,}12}{0{,}4} = 0{,}3" },
      { label: "c.", math: "P(A \\cup B) = 0{,}4 + 0{,}3 - 0{,}12 = 0{,}58" },
    ],
  }),
  Qn(27, "Soal ANBK – Membuktikan Saling Bebas", {
    type: "mixed",
    content: "Dari 52 kartu bridge, satu kartu diambil. A = kartu As, B = kartu merah.",
    parts: [
      { label: "a.", math: "P(A) = \\frac{4}{52} = \\frac{1}{13},\\; P(B) = \\frac{26}{52} = \\frac{1}{2}" },
      { label: "b.", math: "P(A \\cap B) = \\frac{2}{52} = \\frac{1}{26}" },
      { label: "c.", math: "P(A) \\times P(B) = \\frac{1}{13} \\times \\frac{1}{2} = \\frac{1}{26} = P(A \\cap B) \\checkmark \\Rightarrow \\text{Saling Bebas!}" },
    ],
  }),
  Qn(28, "Dua Dadu – Salah Satu Syarat", {
    type: "mixed",
    diagram: <DiceGrid highlight={(i,j) => i+j===8} />,
    content: "Dua dadu dilempar. Diketahui jumlah = 8. Berapa peluang salah satu dadu menunjukkan angka 3?",
    parts: [
      { label: "a.", math: "A = \\text{jumlah 8} = \\{(2,6),(3,5),(4,4),(5,3),(6,2)\\} \\Rightarrow n(A)=5" },
      { label: "b.", math: "B = \\text{ada angka 3}: \\{(3,5),(5,3)\\} \\cap A \\Rightarrow n(B|A)=2" },
      { label: "c.", math: "P(B|A) = \\frac{2}{5}" },
    ],
  }),
  Qn(29, "Soal UN – P(A∩B) dari P(A|B)", {
    type: "mixed",
    content: "Dalam sebuah kotak terdapat 10 kelereng. P(merah|terambil ganjil) = 3/6. Jika P(ganjil) = 3/5, hitung P(merah ∩ ganjil).",
    parts: [
      { label: "a.", math: "P(\\text{merah}|\\text{ganjil}) = \\frac{3}{6} = \\frac{1}{2}" },
      { label: "b.", math: "P(\\text{merah} \\cap \\text{ganjil}) = P(\\text{merah}|\\text{ganjil}) \\times P(\\text{ganjil}) = \\frac{1}{2} \\times \\frac{3}{5} = \\frac{3}{10}" },
      { label: "c.", text: "Apa arti P(merah ∩ ganjil) = 3/10 dalam konteks kelereng?" },
    ],
  }),
  Qn(30, "Soal TKA – Tiga Kejadian Saling Bebas", {
    type: "mixed",
    content: "Tiga koin dilempar. A = koin 1 Angka, B = koin 2 Angka, C = koin 3 Angka.",
    parts: [
      { label: "a.", math: "P(A \\cap B \\cap C) = P(A) \\times P(B) \\times P(C) = \\frac{1}{2} \\times \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{8}" },
      { label: "b.", math: "P(A \\cup B \\cup C) = 1 - P(A' \\cap B' \\cap C') = 1 - \\frac{1}{8} = \\frac{7}{8}" },
      { label: "c.", text: "Mengapa P(A∪B∪C) dihitung dengan komplemen lebih mudah?" },
    ],
  }),
  Qn(31, "Soal UN – P Setidaknya Satu dari Dua", {
    type: "mixed",
    content: "Peluang siswa A naik kelas = 0,8. Peluang siswa B naik kelas = 0,7. A dan B saling bebas.",
    parts: [
      { label: "a.", math: "P(\\text{A tidak naik}) = 0{,}2,\\; P(\\text{B tidak naik}) = 0{,}3" },
      { label: "b.", math: "P(\\text{keduanya tidak naik}) = 0{,}2 \\times 0{,}3 = 0{,}06" },
      { label: "c.", math: "P(\\text{setidaknya satu naik}) = 1 - 0{,}06 = 0{,}94" },
    ],
  }),
  Qn(32, "Soal ANBK – Peluang Bersyarat dari Tabel", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Survei 200 siswa"
        headers={["","Suka Matematika","Tidak Suka","Total"]}
        rows={[["Laki-laki",70,30,100],["Perempuan",50,50,100],["Total",120,80,200]]}
      />
    ),
    content: "Satu siswa dipilih acak. Tentukan P(suka Matematika | laki-laki).",
    parts: [
      { label: "a.", math: "P(\\text{laki-laki}) = \\frac{100}{200} = \\frac{1}{2}" },
      { label: "b.", math: "P(\\text{suka Mat} \\cap \\text{laki}) = \\frac{70}{200} = \\frac{7}{20}" },
      { label: "c.", math: "P(\\text{suka Mat}|\\text{laki}) = \\frac{7/20}{1/2} = \\frac{7}{10}" },
    ],
  }),
  Qn(33, "Soal TKA – Mencari P(A) dari Kejadian Majemuk", {
    type: "mixed",
    content: "A dan B saling bebas. P(A∪B) = 0,72 dan P(B) = 0,4. Tentukan P(A).",
    parts: [
      { label: "a.", math: "P(A \\cup B) = P(A) + P(B) - P(A) \\times P(B)" },
      { label: "b.", math: "0{,}72 = P(A) + 0{,}4 - 0{,}4 \\cdot P(A) = 0{,}6 \\cdot P(A) + 0{,}4" },
      { label: "c.", math: "0{,}6 \\cdot P(A) = 0{,}32 \\Rightarrow P(A) = \\frac{0{,}32}{0{,}6} = \\frac{8}{15}" },
    ],
  }),
  Qn(34, "Soal UN Level Tinggi – Dua Tahap Bersyarat", {
    type: "mixed",
    content: "Kotak I: 3M 2B. Kotak II: 4M 1B. Sebuah kotak dipilih acak, lalu 1 bola diambil. Tentukan P(bola merah).",
    parts: [
      { label: "a.", math: "P(\\text{Kotak I}) = P(\\text{Kotak II}) = \\frac{1}{2}" },
      { label: "b.", math: "P(M|\\text{I}) = \\frac{3}{5},\\; P(M|\\text{II}) = \\frac{4}{5}" },
      { label: "c.", math: "P(M) = \\frac{1}{2} \\cdot \\frac{3}{5} + \\frac{1}{2} \\cdot \\frac{4}{5} = \\frac{3}{10} + \\frac{4}{10} = \\frac{7}{10}" },
    ],
  }),
  Qn(35, "Soal ANBK – Membuktikan Tidak Saling Lepas", {
    type: "mixed",
    content: "Dari bilangan 1–12, satu bilangan dipilih acak. A = kelipatan 3, B = kelipatan 4.",
    parts: [
      { label: "a.", math: "A = \\{3,6,9,12\\},\\; B = \\{4,8,12\\}" },
      { label: "b.", math: "A \\cap B = \\{12\\} \\neq \\emptyset \\Rightarrow \\text{tidak saling lepas}" },
      { label: "c.", math: "P(A \\cup B) = \\frac{4}{12} + \\frac{3}{12} - \\frac{1}{12} = \\frac{6}{12} = \\frac{1}{2}" },
    ],
  }),
  Qn(36, "Soal UN – P Tepat Satu dari Dua Kejadian", {
    type: "mixed",
    content: "A dan B saling bebas. P(A) = 0,3, P(B) = 0,5. Tentukan P(tepat salah satu terjadi).",
    parts: [
      { label: "a.", math: "P(A \\cap B') = P(A) \\times P(B') = 0{,}3 \\times 0{,}5 = 0{,}15" },
      { label: "b.", math: "P(A' \\cap B) = P(A') \\times P(B) = 0{,}7 \\times 0{,}5 = 0{,}35" },
      { label: "c.", math: "P(\\text{tepat satu}) = 0{,}15 + 0{,}35 = 0{,}5" },
    ],
  }),
  Qn(37, "Soal TKA – Tiga Koin, Komplemen Bersyarat", {
    type: "mixed",
    content: "Tiga koin dilempar. Diketahui koin pertama Angka. Berapa P(setidaknya dua Angka)?",
    parts: [
      { label: "a.", text: "Ruang sampel bersyarat (koin 1 = A): {AAA, AAG, AGA, AGG} → 4 titik sampel." },
      { label: "b.", text: "Kejadian ≥ 2 Angka dalam ruang bersyarat: {AAA, AAG, AGA} → 3 titik." },
      { label: "c.", math: "P(\\geq 2A | A_1) = \\frac{3}{4}" },
    ],
  }),
  Qn(38, "Soal UN – Peluang Keduanya Berbeda", {
    type: "mixed",
    content: "Dua kartu diambil berturut-turut tanpa pengembalian dari kartu bernomor 1–5.",
    parts: [
      { label: "a.", math: "P(\\text{sama}) = \\frac{5}{5} \\times \\frac{1}{4} = \\frac{1}{4}" },
      { label: "b.", math: "P(\\text{berbeda}) = 1 - \\frac{1}{4} = \\frac{3}{4}" },
      { label: "c.", text: "Hitung langsung P(berbeda): angka pertama bebas (5/5), lalu angka kedua berbeda (4/4)." },
    ],
  }),
  Qn(39, "Soal TKA – P(A∪B) dari P(A|B) dan Informasi Lain", {
    type: "mixed",
    content: "P(B) = 0,4 dan P(A|B) = 0,5 dan P(A) = 0,3. Tentukan P(A∪B).",
    parts: [
      { label: "a.", math: "P(A \\cap B) = P(A|B) \\times P(B) = 0{,}5 \\times 0{,}4 = 0{,}2" },
      { label: "b.", math: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0{,}3 + 0{,}4 - 0{,}2 = 0{,}5" },
      { label: "c.", text: "Apakah A dan B saling bebas? (Cek: P(A)×P(B) = 0,3×0,4 = 0,12 ≠ 0,2 → Tidak saling bebas)" },
    ],
  }),
  Qn(40, "Soal UN Level Tinggi – Kejadian Majemuk Kompleks", {
    type: "mixed",
    content: "Dalam kotak A terdapat 5 bola merah dan 3 bola putih. Dalam kotak B terdapat 2 bola merah dan 6 bola putih. Satu bola diambil dari masing-masing kotak. Tentukan peluang setidaknya satu bola merah.",
    parts: [
      { label: "a.", math: "P(\\text{keduanya putih}) = \\frac{3}{8} \\times \\frac{6}{8} = \\frac{18}{64} = \\frac{9}{32}" },
      { label: "b.", math: "P(\\text{setidaknya 1 merah}) = 1 - \\frac{9}{32} = \\frac{23}{32}" },
      { label: "c.", text: "Verifikasi dengan cara langsung: P(MM) + P(MP) + P(PM) = 10/64 + 30/64 + 6/64 = 46/64 = 23/32 ✓" },
    ],
  }),
];

const PeluangKejadianMajemukPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-500/20 border-2 border-indigo-400/60 flex items-center justify-center mb-3">
            <Layers className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-indigo-300 text-center mb-1"
            style={{ textShadow: "0 0 20px rgba(129,140,248,0.7)" }}>
            PELUANG KEJADIAN MAJEMUK
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-2">
            <span className="text-indigo-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-indigo-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
              <p className="text-indigo-300 text-[10px] font-bold mb-1">Saling Lepas</p>
              <BlockMath math="P(A \cup B) = P(A) + P(B)" />
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
              <p className="text-indigo-300 text-[10px] font-bold mb-1">Tidak Saling Lepas</p>
              <BlockMath math="P(A \cup B) = P(A)+P(B)-P(A \cap B)" />
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
              <p className="text-indigo-300 text-[10px] font-bold mb-1">Saling Bebas</p>
              <BlockMath math="P(A \cap B) = P(A) \times P(B)" />
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
              <p className="text-indigo-300 text-[10px] font-bold mb-1">Bersyarat</p>
              <BlockMath math="P(A|B) = \frac{P(A \cap B)}{P(B)}" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900/80 to-violet-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-indigo-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-violet-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shrink-0">
                    <span className="text-indigo-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.math && <div className="mb-3 text-white overflow-x-auto"><BlockMath math={q.math} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? "bg-white/5" : "bg-transparent px-0"}`}>
                            {p.label && <span className="text-indigo-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
            className="text-sm text-muted-foreground hover:text-indigo-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeluangKejadianMajemukPage;
