import { JSX } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const M = ({ children }: { children: string }) => <InlineMath math={children} />;

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs leading-relaxed">{children}</p>
);

const Jawab = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold text-green-400 mt-1">✅ Jawaban: {children}</p>
);

export const pembahasanDasar: Record<number, JSX.Element> = {
  1: (
    <div className="space-y-1">
      <P>Habis dibagi 5 → digit terakhir = 0 atau 5.</P>
      <P><b>Kasus 1</b> (digit terakhir = 0): digit pertama 6 pilihan (1–6), digit tengah 5 pilihan → <M>{`6\\times5=30`}</M>.</P>
      <P><b>Kasus 2</b> (digit terakhir = 5): digit pertama 5 pilihan (bukan 0 dan 5), digit tengah 5 pilihan → <M>{`5\\times5=25`}</M>.</P>
      <P>Total = <M>{`30+25=55`}</M> bilangan.</P>
      <Jawab>C. 55</Jawab>
    </div>
  ),
  2: (
    <div className="space-y-1">
      <P>Susunan total MATEMATIKA = <M>{`\\dfrac{10!}{2!\\cdot3!\\cdot2!}=151{.}200`}</M>.</P>
      <P>Susunan dengan 2M berdampingan (anggap MM 1 blok → 9 unsur): <M>{`\\dfrac{9!}{3!\\cdot2!}=30{.}240`}</M>.</P>
      <P>Tidak bersebelahan = <M>{`151200-30240=120960`}</M>.</P>
      <Jawab>A. 120.960</Jawab>
    </div>
  ),
  3: (
    <div className="space-y-1">
      <P>Anggap 5 pasangan sebagai 5 blok melingkar: <M>{`(5-1)!=24`}</M>.</P>
      <P>Tiap pasangan dalam blok dapat bertukar: <M>{`2^5=32`}</M>.</P>
      <P>Total = <M>{`24\\times32=768`}</M> cara.</P>
      <Jawab>D. 768</Jawab>
    </div>
  ),
  4: (
    <div className="space-y-1">
      <P>Min 2 wanita: kasus 2W3P + 3W2P + 4W1P.</P>
      <P><M>{`C(4,2)C(6,3)+C(4,3)C(6,2)+C(4,4)C(6,1)`}</M></P>
      <P><M>{`=6\\cdot20+4\\cdot15+1\\cdot6=120+60+6=186`}</M>.</P>
      <Jawab>D. 186</Jawab>
    </div>
  ),
  5: (
    <div className="space-y-1">
      <P>3 soal wajib pasti dikerjakan → sisa pilih 5 dari 7 soal bebas.</P>
      <P><M>{`C(7,5)=\\dfrac{7!}{5!2!}=21`}</M> cara.</P>
      <Jawab>C. 21</Jawab>
    </div>
  ),
  6: (
    <div className="space-y-1">
      <P>Inklusi-Eksklusi: <M>{`|M\\cup F\\cup K|=15+20+10-8-5-3+2=31`}</M>.</P>
      <P>Karena <M>{`31\\geq30`}</M>, semua siswa minimal suka satu pelajaran.</P>
      <P>Siswa yang tidak suka satupun = <M>{`30-30=0`}</M>.</P>
      <Jawab>A. 0</Jawab>
    </div>
  ),
  7: (
    <div className="space-y-1">
      <P>Pakai prinsip pigeonhole. Skenario terburuk: ambil 4 dari setiap warna = <M>{`4+4+4=12`}</M> bola, belum ada yang mencapai 5 sewarna.</P>
      <P>Bola ke-13 pasti membuat salah satu warna mencapai 5.</P>
      <Jawab>C. 13</Jawab>
    </div>
  ),
  8: (
    <div className="space-y-1">
      <P>Ini masalah <i>derangement</i> 4 elemen: <M>{`D_4=4!\\left(1-\\tfrac{1}{1!}+\\tfrac{1}{2!}-\\tfrac{1}{3!}+\\tfrac{1}{4!}\\right)`}</M></P>
      <P><M>{`D_4=24\\left(\\tfrac{9}{24}\\right)=9`}</M> cara.</P>
      <Jawab>B. 9</Jawab>
    </div>
  ),
  9: (
    <div className="space-y-1">
      <P>Jabat tangan = <M>{`C(n,2)=\\dfrac{n(n-1)}{2}=120`}</M>.</P>
      <P><M>{`n(n-1)=240\\Rightarrow n=16`}</M> (karena <M>{`16\\cdot15=240`}</M>).</P>
      <Jawab>B. 16</Jawab>
    </div>
  ),
  10: (
    <div className="space-y-1">
      <P>Total jabat tangan tanpa larangan: <M>{`C(12,2)=66`}</M>.</P>
      <P>Kurangi 6 pasangan suami-istri yang tidak berjabat: <M>{`66-6=60`}</M>.</P>
      <Jawab>C. 60</Jawab>
    </div>
  ),
  11: (
    <div className="space-y-1">
      <P>3 digit GENAP, boleh berulang, dari {`{0,1,2,3,4,5}`}.</P>
      <P>Digit terakhir genap (0,2,4) → 3 pilihan. Digit pertama bukan 0 → 5 pilihan. Digit tengah → 6 pilihan.</P>
      <P>Total = <M>{`5\\times6\\times3=90`}</M>.</P>
      <Jawab>C. 90</Jawab>
    </div>
  ),
  12: (
    <div className="space-y-1">
      <P>Mata prima dari {`{1,...,6}`}: {`{2,3,5}`} → 3 angka.</P>
      <P><M>{`P=\\dfrac{3}{6}`}</M>.</P>
      <Jawab>C. 3/6</Jawab>
    </div>
  ),
  13: (
    <div className="space-y-1">
      <P>Pasangan jumlah 9: (3,6),(4,5),(5,4),(6,3) → 4 cara.</P>
      <P><M>{`P=\\dfrac{4}{36}=\\dfrac{1}{9}`}</M>.</P>
      <Jawab>A. 1/9</Jawab>
    </div>
  ),
  14: (
    <div className="space-y-1">
      <P>Jumlah &gt; 7: jumlah 8(5) + 9(4) + 10(3) + 11(2) + 12(1) = 15.</P>
      <P><M>{`P=\\dfrac{15}{36}=\\dfrac{5}{12}`}</M>.</P>
      <Jawab>C. 5/12</Jawab>
    </div>
  ),
  15: (
    <div className="space-y-1">
      <P>MATEMATIKA terdiri 10 huruf, A muncul 3 kali.</P>
      <P><M>{`P(A)=\\dfrac{3}{10}\\approx\\dfrac{1}{3}`}</M> (jawaban paling mendekati).</P>
      <Jawab>D. 1/3</Jawab>
    </div>
  ),
  16: (
    <div className="space-y-1">
      <P>Kelereng nomor 9 sudah keluar → sisa 14. Bilangan ganjil 1–15: {`{1,3,5,7,9,11,13,15}`} = 8, dikurangi 9 → 7 ganjil.</P>
      <P><M>{`P=\\dfrac{7}{14}`}</M>.</P>
      <Jawab>B. 7/14</Jawab>
    </div>
  ),
  17: (
    <div className="space-y-1">
      <P>Bola biru sudah terambil → sisa 12 bola. Putih = nomor 9–13. Putih kelipatan 3: {`{9,12}`} → 2 bola.</P>
      <P><M>{`P=\\dfrac{2}{12}=\\dfrac{1}{6}`}</M>.</P>
      <Jawab>C. 1/6</Jawab>
    </div>
  ),
  18: (
    <div className="space-y-1">
      <P>Total peserta = <M>{`25+20-15=30`}</M>. Hanya lulus fisik = <M>{`20-15=5`}</M>.</P>
      <P><M>{`P=\\dfrac{5}{30}=\\dfrac{1}{6}`}</M>.</P>
      <Jawab>D. 1/6</Jawab>
    </div>
  ),
  19: (
    <div className="space-y-1">
      <P>n(S) = <M>{`2^3=8`}</M>. Susunan 2A1G: pilih posisi G dari 3 → C(3,1) = 3.</P>
      <P><M>{`P=\\dfrac{3}{8}`}</M>.</P>
      <Jawab>C. 3/8</Jawab>
    </div>
  ),
  20: (
    <div className="space-y-1">
      <P>n(S) = 8. Min 2 angka = (2A: 3 cara) + (3A: 1 cara) = 4.</P>
      <P><M>{`P=\\dfrac{4}{8}=0{,}500`}</M>.</P>
      <Jawab>B. 0,500</Jawab>
    </div>
  ),
  21: (
    <div className="space-y-1">
      <P>Total permen = 4+2+8+6 = 20. Merah = 4.</P>
      <P><M>{`P=\\dfrac{4}{20}=20\\%`}</M>.</P>
      <Jawab>B. 20%</Jawab>
    </div>
  ),
  22: (
    <div className="space-y-1">
      <P>n(S) = C(8,2) = 28. Bola genap = {`{2,4,6,8}`} = 4. n(A) = C(4,2) = 6.</P>
      <P><M>{`P=\\dfrac{6}{28}=\\dfrac{3}{14}`}</M>.</P>
      <Jawab>C. 3/14</Jawab>
    </div>
  ),
  23: (
    <div className="space-y-1">
      <P>n(S) = C(5,2) = 10. Bola ganjil = {`{1,3,5}`} = 3. n(A) = C(3,2) = 3.</P>
      <P><M>{`P=\\dfrac{3}{10}`}</M>.</P>
      <Jawab>B. 3/10</Jawab>
    </div>
  ),
  24: (
    <div className="space-y-1">
      <P>Susunan 2 angka berbeda dari 6 angka: <M>{`P(6,2)=6\\times5=30`}</M>.</P>
      <Jawab>C. 30</Jawab>
    </div>
  ),
  25: (
    <div className="space-y-1">
      <P>Jumlah 5: 4 pasangan. Jumlah 7: 6 pasangan.</P>
      <P><M>{`P=\\dfrac{4+6}{36}=\\dfrac{10}{36}\\approx0{,}28`}</M>.</P>
      <Jawab>D. 0,28</Jawab>
    </div>
  ),
  26: (
    <div className="space-y-1">
      <P>P(G) = 1/2. P(dadu &gt; 4) = P({`{5,6}`}) = 2/6 = 1/3.</P>
      <P>Independen: <M>{`P=\\tfrac{1}{2}\\times\\tfrac{1}{3}=\\dfrac{1}{6}`}</M>.</P>
      <Jawab>B. 1/6</Jawab>
    </div>
  ),
  27: (
    <div className="space-y-1">
      <P>Kartu As ada 4 dari 52: <M>{`P=\\dfrac{4}{52}=\\dfrac{1}{13}`}</M>.</P>
      <Jawab>C. 1/13</Jawab>
    </div>
  ),
  28: (
    <div className="space-y-1">
      <P>P(dadu &lt; 3) = P({`{1,2}`}) = 2/6 = 1/3.</P>
      <P><M>{`f_H=60\\times\\tfrac{1}{3}=20`}</M> kali.</P>
      <Jawab>B. 20 kali</Jawab>
    </div>
  ),
  29: (
    <div className="space-y-1">
      <P>Total bola = 4+6+5 = 15. Merah = 5.</P>
      <P><M>{`P=\\dfrac{5}{15}=\\dfrac{1}{3}`}</M>.</P>
      <Jawab>C. 1/3</Jawab>
    </div>
  ),
  30: (
    <div className="space-y-1">
      <P>n(S) = 8. 3G hanya 1 kemungkinan (GGG).</P>
      <P><M>{`P=\\dfrac{1}{8}`}</M>.</P>
      <Jawab>A. 1/8</Jawab>
    </div>
  ),
  31: (
    <div className="space-y-1">
      <P>Mata &lt; 4 = {`{1,2,3}`} → 3 angka.</P>
      <P><M>{`P=\\dfrac{3}{6}=\\dfrac{1}{2}`}</M>.</P>
      <Jawab>C. 1/2</Jawab>
    </div>
  ),
  32: (
    <div className="space-y-1">
      <P>Kotak A: 5M, 7K, 3B (15). Kotak B awal: 3M, 5K, 3B (11), setelah ditambah 1 jadi 12.</P>
      <P>Kasus 1 (Ibu ambil biru, P = 3/15): B punya 4 biru dari 12. P(anak biru) = 4/12.</P>
      <P>Kasus 2 (Ibu ambil bukan biru, P = 12/15): B punya 3 biru dari 12. P(anak biru) = 3/12.</P>
      <P>Total = <M>{`\\tfrac{3}{15}\\cdot\\tfrac{4}{12}+\\tfrac{12}{15}\\cdot\\tfrac{3}{12}=\\tfrac{1}{15}+\\tfrac{3}{15}=\\dfrac{4}{15}`}</M>.</P>
      <Jawab>B. 4/15</Jawab>
    </div>
  ),
  33: (
    <div className="space-y-1">
      <P>n(S) = <M>{`2^4=16`}</M>. Paling banyak 2L = (0L, 1L, 2L).</P>
      <P><M>{`C(4,0)+C(4,1)+C(4,2)=1+4+6=11`}</M>.</P>
      <P><M>{`P=\\dfrac{11}{16}`}</M>.</P>
      <Jawab>C. 11/16</Jawab>
    </div>
  ),
  34: (
    <div className="space-y-1">
      <P>B harus menang 2 ronde untuk capai final: <M>{`(\\tfrac{1}{2})^2=\\tfrac{1}{4}`}</M>. Sama untuk F: <M>{`\\tfrac{1}{4}`}</M>. Lalu F juara: <M>{`\\tfrac{1}{2}`}</M>.</P>
      <P><M>{`P=\\tfrac{1}{4}\\cdot\\tfrac{1}{4}\\cdot\\tfrac{1}{2}=\\dfrac{1}{32}`}</M>.</P>
      <Jawab>C. 1/32</Jawab>
    </div>
  ),
  35: (
    <div className="space-y-1">
      <P>Aturan perkalian: <M>{`3\\times3\\times2=18`}</M> kombinasi.</P>
      <Jawab>C. 18</Jawab>
    </div>
  ),
  36: (
    <div className="space-y-1">
      <P>Total bola = 7+5 = 12. Kuning ganjil = {`{1,3,5,7}`} → 4. Merah huruf vokal {`{a,e}`} → 2.</P>
      <P><M>{`P=\\dfrac{4+2}{12}=\\dfrac{6}{12}=\\dfrac{1}{2}`}</M>.</P>
      <Jawab>D. 1/2</Jawab>
    </div>
  ),
  37: (
    <div className="space-y-1">
      <P>Total = 5+6+9 = 20. Kuning = 6.</P>
      <P><M>{`P=\\dfrac{6}{20}=\\dfrac{3}{10}`}</M>.</P>
      <Jawab>B. 3/10</Jawab>
    </div>
  ),
  38: (
    <div className="space-y-1">
      <P>Kelipatan 3 dari 1–30: 10 kartu. Prima 1–30: {`{2,3,5,7,11,13,17,19,23,29}`} = 10. Irisan: {`{3}`} = 1.</P>
      <P><M>{`|A\\cup B|=10+10-1=19`}</M>. <M>{`P=\\dfrac{19}{30}`}</M>.</P>
      <Jawab>C. 19/30</Jawab>
    </div>
  ),
  39: (
    <div className="space-y-1">
      <P>Frek relatif tetap proporsi sama: <M>{`\\dfrac{36}{60}=0{,}60`}</M>.</P>
      <Jawab>B. 0,60</Jawab>
    </div>
  ),
  40: (
    <div className="space-y-1">
      <P>Triplet {`{a,b,c}`} dengan a+b=c, c≤6 (a≤b):</P>
      <P>{`{1,1,2}`}(3p) {`{1,2,3}`}(6p) {`{1,3,4}`}(6p) {`{2,2,4}`}(3p) {`{1,4,5}`}(6p) {`{2,3,5}`}(6p) {`{1,5,6}`}(6p) {`{2,4,6}`}(6p) {`{3,3,6}`}(3p)</P>
      <P>Total permutasi = <M>{`3+6+6+3+6+6+6+6+3=45`}</M>.</P>
      <P>n(S) = <M>{`6^3=216`}</M>. <M>{`P=\\dfrac{45}{216}=\\dfrac{5}{24}`}</M>.</P>
      <Jawab>B. 5/24</Jawab>
    </div>
  ),
};
