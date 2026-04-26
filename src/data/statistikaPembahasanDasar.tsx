import { JSX } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const M = ({ children }: { children: string }) => <InlineMath math={children} />;

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs leading-relaxed text-white/85">{children}</p>
);

const Jawab = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold text-green-400 mt-1">✅ Jawaban: {children}</p>
);

export const pembahasanDasar: Record<number, JSX.Element> = {
  1: (
    <div className="space-y-1">
      <P>Frekuensi tiap nilai: 65 (1×), 70 (4×), 80 (3×), 85 (2×), 90 (1×), 95 (1×).</P>
      <P><b>Modus</b> = nilai paling sering = <b>70</b> (muncul 4×).</P>
      <P>Diurutkan: 65, 70, 70, 70, 70, <b>80, 80</b>, 80, 85, 85, 90, 95 (12 data).</P>
      <P>Median = rata-rata data ke-6 dan ke-7 = <M>{`\\frac{80+80}{2}=80`}</M>.</P>
      <Jawab>B. 70 dan 80</Jawab>
    </div>
  ),
  2: (
    <div className="space-y-1">
      <P>Diurutkan (12 data): 2, 3, 5, 5, 5, <b>6, 7</b>, 7, 7, 7, 9, 10.</P>
      <P>Median = <M>{`\\frac{6+7}{2}=6{,}5`}</M>.</P>
      <P>Mean = <M>{`\\frac{2+3+5+5+5+6+7+7+7+7+9+10}{12}=\\frac{73}{12}\\approx 6{,}1`}</M>.</P>
      <Jawab>C. 6,5 dan 6,1</Jawab>
    </div>
  ),
  3: (
    <div className="space-y-1">
      <P>Total siswa = 2+4+5+5+9+3+4 = 32. Median = rata-rata data ke-16 dan ke-17.</P>
      <P>Frekuensi kumulatif: 4(2), 5(6), 6(11), 7(<b>16</b>), 8(<b>25</b>), 9(28), 10(32).</P>
      <P>Data ke-16 = nilai 7, data ke-17 = nilai 8 → Median = <M>{`\\frac{7+8}{2}=7{,}5`}</M>.</P>
      <Jawab>C. 7,5</Jawab>
    </div>
  ),
  4: (
    <div className="space-y-1">
      <P>Total = 30. Mean = <M>{`\\frac{6+20+25+18+28+32+36+30}{30}=\\frac{195}{30}=6{,}5`}</M>.</P>
      <P>Modus: nilai 4 dan 5 sama-sama frekuensi 5 (multimodus, bukan 5 saja). Jangkauan = 10−3 = 7.</P>
      <P>Median: data ke-15 dan ke-16. Kumulatif: 2, 7, 12, <b>15</b>, <b>19</b>, 23, 27, 30.</P>
      <P>Data ke-15 = nilai 6, data ke-16 = nilai 7 → Median = <M>{`\\frac{6+7}{2}=6{,}5`}</M> ✓.</P>
      <Jawab>B. Median data 6,5</Jawab>
    </div>
  ),
  5: (
    <div className="space-y-1">
      <P>Total siswa 2+4+6+5+3 = 20.</P>
      <P>Mean = <M>{`\\frac{6\\cdot2+7\\cdot4+8\\cdot6+9\\cdot5+10\\cdot3}{20}=\\frac{12+28+48+45+30}{20}=\\frac{163}{20}=8{,}15`}</M>.</P>
      <P>Pembulatan terdekat = <b>8</b>.</P>
      <Jawab>C. 8</Jawab>
    </div>
  ),
  6: (
    <div className="space-y-1">
      <P>Misal banyak putra = <M>x</M>, putri = <M>y</M>.</P>
      <P>Rumus rata-rata gabungan: <M>{`\\frac{7{,}2x+8{,}1y}{x+y}=7{,}5`}</M> → <M>{`7{,}2x+8{,}1y=7{,}5x+7{,}5y`}</M>.</P>
      <P><M>{`0{,}3x=0{,}6y\\Rightarrow \\frac{x}{y}=\\frac{2}{1}`}</M>.</P>
      <Jawab>A. 2 : 1</Jawab>
    </div>
  ),
  7: (
    <div className="space-y-1">
      <P>Misal banyak laki-laki = <M>L</M>, perempuan = <M>P</M>; <M>{`L+P=36`}</M>.</P>
      <P><M>{`\\frac{66L+75P}{36}=72\\Rightarrow 66L+75P=2592`}</M>.</P>
      <P>Substitusi <M>{`P=36-L`}</M>: <M>{`66L+75(36-L)=2592\\Rightarrow -9L=-108\\Rightarrow L=12`}</M>.</P>
      <Jawab>A. 12 orang</Jawab>
    </div>
  ),
  8: (
    <div className="space-y-1">
      <P>Misal laki = <M>L</M>, perempuan = <M>P</M>; <M>{`L+P=20`}</M>.</P>
      <P><M>{`6L+8{,}5P=20\\cdot7=140`}</M>. Substitusi <M>{`L=20-P`}</M>:</P>
      <P><M>{`6(20-P)+8{,}5P=140\\Rightarrow 2{,}5P=20\\Rightarrow P=8,\\ L=12`}</M>.</P>
      <P>Selisih = 12 − 8 = <b>4</b>.</P>
      <Jawab>C. 4</Jawab>
    </div>
  ),
  9: (
    <div className="space-y-1">
      <P>Sudut Penjas = 360° − (30°+54°+48°+72°) = 156°.</P>
      <P>Banyak siswa Penjas = <M>{`\\frac{156}{360}\\times 240=104`}</M> orang.</P>
      <Jawab>C. 104 orang</Jawab>
    </div>
  ),
  10: (
    <div className="space-y-1">
      <P>20% buku kesenian = 200 → 1% = 10 buku.</P>
      <P>Buku kesehatan (18%) = <M>{`18\\times 10=180`}</M> eksemplar.</P>
      <Jawab>A. 180</Jawab>
    </div>
  ),
  11: (
    <div className="space-y-1">
      <P>Penyusutan = harga 2015 − harga 2016 = Rp 110.000.000 − Rp 102.500.000 = <b>Rp 7.500.000</b>.</P>
      <Jawab>D. Rp 7.500.000,00</Jawab>
    </div>
  ),
  12: (
    <div className="space-y-1">
      <P>Total siswa = 2+3+4+5+3+2+1 = 20.</P>
      <P>Mean = <M>{`\\frac{6+12+20+30+21+16+9}{20}=\\frac{114}{20}=5{,}7`}</M>.</P>
      <P>Nilai &gt; 5,7 → nilai 6, 7, 8, 9 dengan frekuensi 5+3+2+1 = <b>11</b> siswa.</P>
      <Jawab>C. 11 orang</Jawab>
    </div>
  ),
  13: (
    <div className="space-y-1">
      <P>Total pengunjung 5 hari = 5 × 41 = 205 orang.</P>
      <P>Total Senin–Jumat tanpa Rabu = 30+45+50+25 = 150.</P>
      <P>Pengunjung Rabu = 205 − 150 = <b>55</b> orang.</P>
      <Jawab>A. 55 orang</Jawab>
    </div>
  ),
  14: (
    <div className="space-y-1">
      <P>Total tinggi = 25 × 130 = 3250 cm.</P>
      <P><b>B</b>: jika 23 anak masing-masing 130 cm dan satu 133 cm, total = 23·130 + 133 + x = 3250 → x = 127 ✓.</P>
      <P>Pernyataan A, C, D tidak harus berlaku (mean ≠ median, distribusi tidak harus simetris).</P>
      <Jawab>B</Jawab>
    </div>
  ),
  15: (
    <div className="space-y-1">
      <P>Diurutkan (12 data): 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 10.</P>
      <P>Paruh atas (6 data terakhir): 6, 6, 7, 8, 8, 9, 10 — ambil 6 data atas: 6, 7, 8, 8, 9, 10.</P>
      <P>Q₃ = median paruh atas = <M>{`\\frac{8+8}{2}=8`}</M>.</P>
      <Jawab>D. 8</Jawab>
    </div>
  ),
};
