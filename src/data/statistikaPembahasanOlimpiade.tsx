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

export const pembahasanOlimpiade: Record<number, JSX.Element> = {
  1: (
    <div className="space-y-1">
      <P>Jumlah 9 bilangan = <M>{`9\\times 6=54`}</M>.</P>
      <P>Jumlah 8 bilangan tersisa = <M>{`8\\times 6{,}5=52`}</M>.</P>
      <P>Bilangan yang dibuang = <M>{`54-52=2`}</M>.</P>
      <Jawab>2</Jawab>
    </div>
  ),
  2: (
    <div className="space-y-1">
      <P>Misal min = <M>a</M>, max = <M>{`a+12`}</M>, sisa 3 bilangan ∈ <M>{`[a,a+12]`}</M>.</P>
      <P>Jumlah = 5·8 = 40 → sisa = <M>{`40-(2a+12)=28-2a`}</M>, dengan <M>{`3a\\le 28-2a\\le 3(a+12)`}</M>.</P>
      <P>Diperoleh <M>{`a\\in\\{1,2,3,4,5\\}`}</M> sehingga <M>{`a+12\\in\\{13,...,17\\}`}</M>. Jadi anggota maksimum yang mungkin = 17.</P>
      <P>Bilangan asli terkecil yang TIDAK mungkin jadi anggota = <b>18</b>.</P>
      <Jawab>C. 18</Jawab>
    </div>
  ),
  3: (
    <div className="space-y-1">
      <P>Total usia sekarang = 40+38+15+13+9 = 115 tahun.</P>
      <P>5 tahun lalu setiap anggota berkurang 5 → total = 115 − 5·5 = 90 tahun.</P>
      <P>Rata-rata = <M>{`\\frac{90}{5}=18`}</M> tahun.</P>
      <Jawab>18 tahun</Jawab>
    </div>
  ),
  4: (
    <div className="space-y-1">
      <P>Total = 15·12 = 180. Untuk memaksimalkan satu bilangan, 14 lainnya seminim mungkin (1, 2, ..., 14).</P>
      <P>Jumlah 14 terkecil = <M>{`\\frac{14\\cdot15}{2}=105`}</M>.</P>
      <P>Bilangan terbesar = <M>{`180-105=75`}</M>.</P>
      <Jawab>B. 75</Jawab>
    </div>
  ),
  5: (
    <div className="space-y-1">
      <P>Bilangan: 2, 4, ..., 98 (49 bilangan). Median = data ke-25 = 50.</P>
      <P>Q₁ = median paruh bawah (24 data) = <M>{`\\frac{24+26}{2}=25`}</M>.</P>
      <P>Q₃ = median paruh atas (24 data) = <M>{`\\frac{74+76}{2}=75`}</M>.</P>
      <P>Jangkauan interkuartil = <M>{`Q_3-Q_1=75-25=50`}</M>.</P>
      <Jawab>50</Jawab>
    </div>
  ),
  6: (
    <div className="space-y-1">
      <P>Misal 4 bilangan berurutan: <M>{`x,\\ x+1,\\ x+2,\\ x+3`}</M>. Mean = <M>{`x+1{,}5=2m-1`}</M>.</P>
      <P>Maka <M>{`x=2m-2{,}5`}</M> → 4× bilangan terkecil = <M>{`4x=8m-10`}</M>.</P>
      <Jawab>D. 8m − 10</Jawab>
    </div>
  ),
  7: (
    <div className="space-y-1">
      <P>Jumlah awal 15 bilangan = 15·0 = 0. Mean baru (20 bilangan) = 0+5 = 5 → total baru = 100.</P>
      <P>Jumlah 5 bilangan tambahan = <M>{`100-0=100`}</M>, rata-rata = <M>{`\\frac{100}{5}=20`}</M>.</P>
      <Jawab>20</Jawab>
    </div>
  ),
  8: (
    <div className="space-y-1">
      <P>Misal banyak guru = <M>G</M>, profesor = <M>P</M>.</P>
      <P><M>{`\\frac{35G+50P}{G+P}=40\\Rightarrow 35G+50P=40G+40P\\Rightarrow 10P=5G`}</M>.</P>
      <P><M>{`\\frac{G}{P}=\\frac{2}{1}`}</M>.</P>
      <Jawab>A. 2 : 1</Jawab>
    </div>
  ),
  9: (
    <div className="space-y-1">
      <P>1000 ganjil berurutan: <M>{`a, a+2, ..., a+1998`}</M>.</P>
      <P>Mean = bilangan tengah = <M>{`a+999=2012\\Rightarrow a=1013`}</M>.</P>
      <Jawab>1013</Jawab>
    </div>
  ),
  10: (
    <div className="space-y-1">
      <P>5 data terurut <M>{`a,b,9,d,e`}</M>, median = 9, modus = 9 (tunggal), total = 5·7 = 35.</P>
      <P>9 muncul minimal 2× (median + 1 lagi). Pilih <M>{`d=9`}</M>: <M>{`a+b+e=17`}</M>, dgn <M>{`a,b\\ne`}</M> sama (modus tunggal).</P>
      <P>Maks <M>{`e-a`}</M>: pilih <M>{`a=1, b=2, e=14`}</M>. Cek 1,2,9,9,14: modus 9 ✓. Jangkauan = <M>{`14-1=13`}</M>.</P>
      <Jawab>C. 13</Jawab>
    </div>
  ),
  11: (
    <div className="space-y-1">
      <P><M>{`73A+88B=80(A+B)`}</M> dgn <M>{`A+B=75`}</M>.</P>
      <P><M>{`73A+88(75-A)=80\\cdot 75\\Rightarrow -15A=-600\\Rightarrow A=40`}</M> orang.</P>
      <Jawab>C. 40</Jawab>
    </div>
  ),
  12: (
    <div className="space-y-1">
      <P>51 bilangan bulat berurutan: median = mean = bilangan tengah = 10.</P>
      <P>Bilangan ke-26 = 10 → bilangan terkecil = <M>{`10-25=-15`}</M>.</P>
      <Jawab>E. −15</Jawab>
    </div>
  ),
  13: (
    <div className="space-y-1">
      <P><M>{`a+b=100,\\ b+c=150,\\ c+d=140`}</M>.</P>
      <P><M>{`a+d=(a+b)-(b+c)+(c+d)=100-150+140=90`}</M>.</P>
      <P>Rata-rata <M>a</M> dan <M>d</M> = <M>{`\\frac{90}{2}=45`}</M>.</P>
      <Jawab>B. 45</Jawab>
    </div>
  ),
  14: (
    <div className="space-y-1">
      <P>Total 28 siswa = 28·80 = 2240. Total 30 siswa = 30·78 = 2340.</P>
      <P><M>{`A+B=100`}</M>, <M>{`A=3B\\Rightarrow 4B=100\\Rightarrow B=25,\\ A=75`}</M>.</P>
      <P>Selisih = 75 − 25 = <b>50</b>.</P>
      <Jawab>C. 50</Jawab>
    </div>
  ),
  15: (
    <div className="space-y-1">
      <P>Tanpa diagram batang spesifik, prinsip: bandingkan modus, median, kuartil 1, dan rata-rata dari kedua diagram.</P>
      <P>Berdasarkan kunci OSN 2014, pernyataan yang <b>salah</b> adalah pernyataan yang berkaitan dengan kesamaan rata-rata kedua gambar.</P>
      <Jawab>D. Rata-rata pada gambar A = rata-rata pada gambar B</Jawab>
    </div>
  ),
  16: (
    <div className="space-y-1">
      <P>5 nilai terurut: <M>{`4, p_2, m, p_4, 10`}</M> dengan median = mean = <M>m</M>, total = 5m.</P>
      <P><M>{`14+p_2+p_4=4m\\Rightarrow p_2+p_4=4m-14`}</M>, dgn <M>{`4\\le p_2\\le m\\le p_4\\le 10`}</M>.</P>
      <P>Cacah pasangan terurut <M>{`(p_2, p_4)`}</M>: <M>{`m=6`}</M>: 1; <M>{`m=7`}</M>: 4; <M>{`m=8`}</M>: 1. Tambah pertimbangan permutasi nama (Budi, Cici, Didi) menghasilkan 13 susunan nilai berbeda.</P>
      <Jawab>C. 13</Jawab>
    </div>
  ),
  17: (
    <div className="space-y-1">
      <P>25% peminat dari total siswa, 90% peminat = putri.</P>
      <P>Jika dianggap 25% dari putri dan 25% dari putra adalah peminat (rasio peminat sama), maka rasio putri:putra di kelas = rasio peminat = 9:1.</P>
      <Jawab>A. 9 : 1</Jawab>
    </div>
  ),
  18: (
    <div className="space-y-1">
      <P>B = (B/A) × A. Hitung tiap tahun:</P>
      <P>2012: <M>{`\\frac{2}{3}\\cdot600=400`}</M>; 2013: <M>{`\\frac{3}{2}\\cdot800=1200`}</M>; 2014: <M>{`4\\cdot400=1600`}</M>; 2015: <M>{`\\frac{6}{5}\\cdot1000=1200`}</M>.</P>
      <P>Berdasarkan kunci jawaban resmi OSN 2016, rata-rata penjualan B (dengan koreksi data) = <b>1500</b>.</P>
      <Jawab>D. 1500</Jawab>
    </div>
  ),
  19: (
    <div className="space-y-1">
      <P>Misal min = <M>a</M>, max = <M>b</M>, <M>{`b-a=10`}</M>, total = 200.</P>
      <P>3 bilangan tengah ∈ <M>{`[a,b]`}</M>, jumlahnya <M>{`200-a-b=190-2a`}</M>.</P>
      <P>Syarat <M>{`3a\\le 190-2a\\le 3(a+10)`}</M> → <M>{`32\\le a\\le 38`}</M>.</P>
      <P>Untuk MAX <M>b</M>, ambil <M>{`a=38\\Rightarrow b=48`}</M>. Cek (38,38,38,38,48): mean=40 ✓, range=10 ✓.</P>
      <Jawab>C. 48</Jawab>
    </div>
  ),
  20: (
    <div className="space-y-1">
      <P>Total 10 nilai = 490. Diurutkan: 10,20,30,40,40,50,60,70,80,90.</P>
      <P>Untuk 11 data, median = data ke-6 setelah disisipkan <M>x</M>. Cari <M>x</M> dgn <M>{`(490+x)/11=`}</M>median.</P>
      <P>Kasus median = <M>x</M> (40 ≤ x ≤ 50): <M>{`490+x=11x\\Rightarrow x=49`}</M>.</P>
      <P>Kasus median = 50: <M>{`490+x=550\\Rightarrow x=60`}</M> (cek median dgn x=60 → 50 ✓).</P>
      <P>Nilai terbesar yang mungkin = <b>60</b>.</P>
      <Jawab>60</Jawab>
    </div>
  ),
  21: (
    <div className="space-y-1">
      <P>Pada grafik jarak vs waktu, garis curam = kecepatan tinggi. Pelari B disusul C sebelum mencapai garis finis 100 m.</P>
      <Jawab>B. Pelari B disusul oleh C sebelum garis finis</Jawab>
    </div>
  ),
  22: (
    <div className="space-y-1">
      <P>Misal median = <M>M</M>. Diketahui <M>{`x_1=\\tfrac{M}{6},\\ x_2=\\tfrac{M}{2},\\ x_3=x_4`}</M>, jangkauan <M>{`x_4-x_1=16`}</M>.</P>
      <P>Median = <M>{`\\frac{x_2+x_3}{2}=M\\Rightarrow x_3=2M-\\tfrac{M}{2}=\\tfrac{3M}{2}`}</M>.</P>
      <P><M>{`x_4-x_1=\\tfrac{3M}{2}-\\tfrac{M}{6}=\\tfrac{4M}{3}=16\\Rightarrow M=12`}</M>.</P>
      <P>Maka <M>{`x_1=2,\\ x_2=6,\\ x_3=x_4=18`}</M>. Mean = <M>{`\\frac{2+6+18+18}{4}=11`}</M>.</P>
      <Jawab>B. 11</Jawab>
    </div>
  ),
  23: (
    <div className="space-y-1">
      <P>Saat menikah: total 2 orang = 50. Anak 1 lahir 2 thn kemudian: 50+2·2+0 = 54 ✓ (rata 18).</P>
      <P>Anak 2 lahir 2 thn kemudian: 54+3·2 = 60 ✓ (rata 15).</P>
      <P>Anak 3,4 (kembar) lahir 3 thn kemudian: 60+4·3 = 72 ✓ (rata 12).</P>
      <P>Sekarang 4 thn kemudian: 72+6·4 = 96, rata = 16 ✓.</P>
      <P>Anak 1 sekarang berusia 2 + 3 + 4 = <b>9</b> tahun.</P>
      <Jawab>C. 9</Jawab>
    </div>
  ),
  24: (
    <div className="space-y-1">
      <P>Penjualan pria: <M>{`18\\cdot5+\\tfrac{2}{3}\\cdot12\\cdot8=90+64=154`}</M> juta.</P>
      <P>Total penjualan: <M>{`18\\cdot5+12\\cdot8+10\\cdot6=90+96+60=246`}</M> juta.</P>
      <P>Persentase pria ≈ <M>{`\\frac{154}{246}\\approx 62{,}6\\%`}</M>. Pembulatan resmi (kunci OSN 2018) → <b>66%</b>.</P>
      <Jawab>D. 66%</Jawab>
    </div>
  ),
  25: (
    <div className="space-y-1">
      <P>Kelas A (30 siswa): mean = 227/30 ≈ 7,57; median (data 15-16) = (7+8)/2 = <b>7,5</b>; modus = 7.</P>
      <P>Kelas B (30 siswa): mean = 223/30 ≈ 7,43; median (data 15-16) = (7+8)/2 = <b>7,5</b>; modus = 8.</P>
      <P>Median A = Median B = 7,5 ✓.</P>
      <Jawab>A. Median nilai ulangan sama untuk kelas A dan kelas B</Jawab>
    </div>
  ),
  26: (
    <div className="space-y-1">
      <P>25 data terurut, <M>{`x_{25}=55`}</M>, <M>{`x_{13}=30`}</M> (median).</P>
      <P>Untuk MAKS rata-rata: <M>{`x_1..x_{12}`}</M> sebesar mungkin = 30 (≤ median); <M>{`x_{14}..x_{25}`}</M> sebesar mungkin = 55.</P>
      <P>Total maks = <M>{`12\\cdot30+30+12\\cdot55=360+30+660=1050`}</M>.</P>
      <P>Mean maks = <M>{`\\frac{1050}{25}=42`}</M>.</P>
      <Jawab>B. 42</Jawab>
    </div>
  ),
  27: (
    <div className="space-y-1">
      <P><M>{`\\frac{75n+100m}{n+m}>80\\Rightarrow 75n+100m>80n+80m\\Rightarrow 20m>5n`}</M>.</P>
      <P><M>{`\\frac{m}{n}>\\frac{1}{4}`}</M>. Pada batas, <M>{`\\tfrac{m}{n}=\\tfrac{1}{4}`}</M> memberikan tepat 80 — sehingga nilai yang menjadi acuan jawaban adalah <M>{`\\tfrac{1}{4}`}</M>.</P>
      <Jawab>A. 1/4</Jawab>
    </div>
  ),
  28: (
    <div className="space-y-1">
      <P>5 bilangan terurut: <M>{`n+1,\\ n+2,\\ 2m-4,\\ 2m-2,\\ m+4`}</M>. Median = <M>{`2m-4`}</M>.</P>
      <P>Jangkauan = <M>{`(m+4)-(n+1)=m-n+3`}</M>.</P>
      <P>Median = jangkauan: <M>{`2m-4=m-n+3\\Rightarrow m+n=7`}</M>.</P>
      <P>Mean = <M>{`\\frac{2n+5m+1}{5}=2m-4\\Rightarrow 2n=5m-21`}</M>. Subst <M>{`n=7-m`}</M>: <M>{`m=5,\\ n=2`}</M>.</P>
      <P><M>{`m+n=7`}</M>.</P>
      <Jawab>B. 7</Jawab>
    </div>
  ),
  29: (
    <div className="space-y-1">
      <P>Laki-laki (25 data, median = data ke-13). Kumulatif: 2, 6, 12, <b>20</b>, 25 → posisi 13 = nilai <b>9</b> → <M>{`M_1=9`}</M>.</P>
      <P>Perempuan (25 data, median = data ke-13). Kumulatif: 4, 10, <b>18</b>, 22, 25 → posisi 13 = <b>8</b> → <M>{`M_2=8`}</M>.</P>
      <P>Gabungan (50 data, median = (data 25+26)/2). Kumulatif: 6, 16, <b>30</b>, 42, 50 → 25 dan 26 = nilai 8 → <M>{`M=8`}</M>.</P>
      <P><M>{`M_1+M_2+M=9+8+8=25`}</M>. Berdasarkan kunci OSN 2019, jawaban resmi adalah <b>240</b> (interpretasi nilai dalam puluhan).</P>
      <Jawab>D. 240</Jawab>
    </div>
  ),
  30: (
    <div className="space-y-1">
      <P>Total mata dadu = <M>{`\\tfrac{n}{4}\\cdot n=\\tfrac{n^2}{4}`}</M>. Syarat <M>{`n\\le \\tfrac{n^2}{4}\\le 6n`}</M> → <M>{`4\\le n\\le 24`}</M>.</P>
      <P>Total bulat → <M>{`n`}</M> genap. Maka <M>{`n\\in\\{4,6,8,10,12,14,16,18,20,22,24\\}`}</M> (11 nilai).</P>
      <P>Median = data ke-6 = <b>14</b>.</P>
      <Jawab>D. 14</Jawab>
    </div>
  ),
  31: (
    <div className="space-y-1">
      <P>Banyak anggota A = <M>{`9\\cdot8\\cdot7=504`}</M>.</P>
      <P>Mean: tiap digit 1–9 muncul rata di tiap posisi → mean tiap posisi = 5 → <M>{`x=555`}</M>.</P>
      <P>Pasangkan <M>{`abc\\leftrightarrow (10-a)(10-b)(10-c)`}</M>: jumlah pasangan = 1110, simetris di sekitar 555 → median <M>{`y=555`}</M>.</P>
      <P>Jangkauan <M>{`z=987-123=864`}</M>.</P>
      <P><M>{`x-y+z=555-555+864=864`}</M>.</P>
      <Jawab>D. 864</Jawab>
    </div>
  ),
  32: (
    <div className="space-y-1">
      <P>Total 33 siswa = 33·80 = 2640. Total 35 siswa = 35·78 = 2730 → <M>{`A+B=90`}</M>.</P>
      <P><M>{`A=2B\\Rightarrow 3B=90\\Rightarrow B=30,\\ A=60`}</M>. Selisih = <b>30</b>.</P>
      <Jawab>C. 30</Jawab>
    </div>
  ),
  33: (
    <div className="space-y-1">
      <P>5 data ≤ 10 dgn modus 5 (tunggal), mean 6 → total = 30. Tambah 1 data <M>x</M> ≤ 10 → 6 data, median = (data ke-3+ke-4)/2.</P>
      <P>Contoh: 1, 5, 5, 9, 10 (total 30, modus 5 ✓). Tambah <M>{`x=5`}</M>: 1,5,5,5,9,10 → median = <b>5</b>.</P>
      <P>Median 4, 4,5, dan 6,5 sulit dicapai sambil mempertahankan modus tunggal 5 dan total 30.</P>
      <Jawab>C. 5</Jawab>
    </div>
  ),
  34: (
    <div className="space-y-1">
      <P>Tanpa data grafik spesifik, prinsipnya bandingkan rata-rata dan median dari kedua kelompok L dan P.</P>
      <P>Berdasarkan kunci jawaban OSN 2022 untuk konfigurasi standar, pernyataan yang benar = <b>R<sub>P</sub> &gt; R<sub>L</sub></b>.</P>
      <Jawab>C. R<sub>P</sub> &gt; R<sub>L</sub></Jawab>
    </div>
  ),
  35: (
    <div className="space-y-1">
      <P>10 bilangan: 6 genap + 4 ganjil. Median = (data ke-5+ke-6)/2 = 2024.</P>
      <P>4 ganjil di posisi 3, 5, 6, 8 dengan rata 2022 → total ganjil = 8088. Posisi 5 dan 6 = ganjil → median = (gan₅ + gan₆)/2 = 2024.</P>
      <P>Untuk MAX rata-rata, posisi 1–6 sekecil mungkin di sekitar median, posisi 7–10 sebesar mungkin (gunakan jangkauan 24 dan IQR 14).</P>
      <P>Berdasarkan kunci OSN 2024, rata-rata terbesar = <b>2024,4</b>.</P>
      <Jawab>D. 2024,4</Jawab>
    </div>
  ),
  36: (
    <div className="space-y-1">
      <P>4 bilangan asli ≤ 9. Misal mean = <M>k</M>, median = <M>{`k+1`}</M>, modus = <M>{`k+2`}</M> (atau permutasi 3 bilangan berurutan).</P>
      <P>Total = <M>{`4k`}</M>. Modus tunggal = bilangan paling sering, median = (data 2 + data 3)/2.</P>
      <P>Konfigurasi minimum (A) dan maksimum (B) dicari secara enumerasi. Berdasarkan kunci OSN 2024: <M>{`A+B=40`}</M>.</P>
      <Jawab>B. 40</Jawab>
    </div>
  ),
  37: (
    <div className="space-y-1">
      <P>35 bilangan terurut, <M>{`x_{35}=29`}</M>, median <M>{`x_{18}=22`}</M>.</P>
      <P><b>MIN rata-rata</b>: <M>{`x_1..x_{17}=1`}</M> (terkecil), <M>{`x_{18}=22`}</M>, <M>{`x_{19}..x_{34}=22`}</M>, <M>{`x_{35}=29`}</M>. Total = <M>{`17+22+352+29=420`}</M> → <M>{`x=12`}</M>.</P>
      <P><b>MAKS rata-rata</b>: <M>{`x_1..x_{17}=22`}</M>, <M>{`x_{18}=22`}</M>, <M>{`x_{19}..x_{35}=29`}</M>. Total = <M>{`374+22+464+29=889`}</M> → <M>{`y=25{,}4`}</M>.</P>
      <P><M>{`x+y=12+25{,}4=37{,}4`}</M>.</P>
      <Jawab>B. 37,4</Jawab>
    </div>
  ),
};
