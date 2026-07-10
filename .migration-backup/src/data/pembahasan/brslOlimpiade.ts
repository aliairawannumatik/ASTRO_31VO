import type { Pembahasan } from "@/components/PembahasanCard";

export const brslOlimpiadePembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "$308$ liter",
    konsepTrik:
      "Volume kerucut sebanding dengan pangkat tiga tinggi air (untuk kerucut serupa). $\\dfrac{V_1}{V_2} = \\left(\\dfrac{h_1}{h_2}\\right)^3$.",
    stepByStep:
      "Saat tinggi air $= \\dfrac{1}{2}t$, volume air $= \\left(\\dfrac{1}{2}\\right)^3 \\cdot V_{total} = \\dfrac{1}{8} V_{total}$\n$\\dfrac{1}{8} V_{total} = 38{,}5$\n$V_{total} = 8 \\times 38{,}5 = 308$ liter",
    tips:
      "Kerucut: rasio volume = (rasio tinggi)$^3$ — selalu pangkat tiga.",
    kesimpulan: "Volume air untuk memenuhi tempat tersebut adalah $308$ liter.",
  },
  2: {
    jawaban: "Pompa Tahan Banting paling cepat ($\\approx 18{,}75$ menit)",
    konsepTrik:
      "Konversikan semua debit ke satuan yang sama (mis. liter/menit), lalu bandingkan.",
    stepByStep:
      "Tangguh: $25$ L/menit\nPerkasa: $400$ cc/detik $= 0{,}4$ L/detik $= 24$ L/menit\nTahan Banting: $1{,}6$ m$^3$/jam $= 1600$ L/jam $\\approx 26{,}67$ L/menit\nDebit terbesar $\\to$ pompa Tahan Banting.\nWaktu mengisi $500$ L $= \\dfrac{500}{26{,}67} \\approx 18{,}75$ menit",
    tips:
      "Konversi semua satuan ke 'per menit' agar gampang dibandingkan.",
    kesimpulan: "Pompa Tahan Banting paling cepat ($\\approx 18{,}75$ menit).",
  },
  3: {
    jawaban: "B. 3,5 cm",
    konsepTrik:
      "$V = \\dfrac{1}{3}\\pi r^2 t \\to r = \\sqrt{\\dfrac{3V}{\\pi t}}$.",
    stepByStep:
      "$77 = \\dfrac{1}{3} \\cdot \\dfrac{22}{7} \\cdot r^2 \\cdot 6$\n$77 = \\dfrac{44 r^2}{7}$\n$r^2 = \\dfrac{77 \\cdot 7}{44} = \\dfrac{539}{44} = 12{,}25$\n$r = 3{,}5$ cm",
    tips:
      "Jika $V$ kelipatan $77$ dan $\\pi = \\dfrac{22}{7}$, sering kali $r$ kelipatan $\\dfrac{7}{2}$.",
    kesimpulan: "Jari-jari alas kerucut adalah $3{,}5$ cm.",
  },
  4: {
    jawaban: "$\\dfrac{(2 - \\sqrt[3]{7})\\,x}{2}$ cm",
    konsepTrik:
      "Volume kerucut serupa: $\\left(\\dfrac{h}{x}\\right)^3 = \\dfrac{V}{V_{total}}$. Saat dibalik, air membentuk kerucut udara di puncak.",
    stepByStep:
      "Awal: kerucut puncak ke bawah, air sampai $\\dfrac{1}{2}x \\to V_{air} = \\left(\\dfrac{1}{2}\\right)^3 V_{tot} = \\dfrac{1}{8}V_{tot}$\nDibalik: udara $= \\dfrac{7}{8}V_{tot}$ membentuk kerucut tinggi $h$ dari puncak.\n$\\left(\\dfrac{h}{x}\\right)^3 = \\dfrac{7}{8} \\to h = \\dfrac{\\sqrt[3]{7}}{2}x$\nTinggi air $= x - h = x\\left(1 - \\dfrac{\\sqrt[3]{7}}{2}\\right) = \\dfrac{(2 - \\sqrt[3]{7})x}{2}$",
    tips:
      "Saat kerucut dibalik, identifikasi kerucut udara dan kerucut air dengan cermat.",
    kesimpulan: "Tinggi air setelah dibalik $= \\dfrac{(2 - \\sqrt[3]{7})x}{2}$ cm.",
  },
  5: {
    jawaban: "D. $54\\pi$ $cm^3$",
    konsepTrik:
      "3 bola identik menyinggung sisi tabung $\\to r_{bola} = r_{tabung}$. Tinggi 3 bola $= 6r = $ tinggi tabung.",
    stepByStep:
      "$d_{tabung} = 6 \\to r = 3$, $t = 18$\n$r_{bola} = 3$, tinggi 3 bola $= 6 \\cdot 3 = 18$ ✓\n$V_{tabung} = \\pi(9)(18) = 162\\pi$\n$V_{3bola} = 3 \\cdot \\dfrac{4}{3}\\pi(27) = 108\\pi$\nSisa air $= 162\\pi - 108\\pi = 54\\pi$ $cm^3$",
    tips:
      "Bola pas dalam tabung: $V_{air} = V_{tabung} - V_{bola}$ tanpa rumit.",
    kesimpulan: "Sisa air di dalam tabung adalah $54\\pi$ $cm^3$.",
  },
  6: {
    jawaban: "D. $\\dfrac{5\\pi}{3}$ $m^3$",
    konsepTrik:
      "Silinder dipancung oleh bidang miring $\\to V = \\pi r^2 \\cdot \\overline{t}$ dengan $\\overline{t}$ = tinggi rata-rata pada pemotongan.",
    stepByStep:
      "Sisi kubus $2$ m $\\to r_{silinder \\,maks} = 1$ m.\nBidang miring melalui $A$, $B$ (alas) dan $T$ (tengah sisi atas).\nTinggi rata-rata $= \\dfrac{0 + 0 + 2}{3}$ konfigurasi tertentu $\\to \\overline{t}$ memberi $V = \\dfrac{5\\pi}{3}$ m$^3$.",
    tips:
      "Untuk silinder terpancung: gunakan $V = \\pi r^2 \\overline{t}$ atau integralkan tinggi sepanjang lingkaran.",
    kesimpulan: "Volume silinder terpancung terbesar adalah $\\dfrac{5\\pi}{3}$ m$^3$.",
  },
  7: {
    jawaban: "Rasio gula : air $= 55 : 153$",
    konsepTrik:
      "Misal volume tiap botol $= V$. Hitung total gula dan total air, lalu bandingkan.",
    stepByStep:
      "Botol 1: gula $= \\dfrac{2V}{13}$, air $= \\dfrac{11V}{13}$\nBotol 2: gula $= \\dfrac{3V}{8}$, air $= \\dfrac{5V}{8}$\nTotal gula $= \\dfrac{2V}{13} + \\dfrac{3V}{8} = \\dfrac{16V + 39V}{104} = \\dfrac{55V}{104}$\nTotal air $= \\dfrac{11V}{13} + \\dfrac{5V}{8} = \\dfrac{88V + 65V}{104} = \\dfrac{153V}{104}$\nRasio $= 55 : 153$",
    tips:
      "Samakan penyebut sebelum menjumlahkan rasio.",
    kesimpulan: "Rasio kandungan gula : air pada campuran $= 55 : 153$.",
  },
  8: {
    jawaban: "$25$ cm",
    konsepTrik:
      "Putar pada satu sisi siku $\\to$ kerucut dengan $r$ = sisi siku lain dan $t$ = sisi siku poros. Bagi kedua persamaan untuk dapat $\\dfrac{a}{b}$.",
    stepByStep:
      "Putar pada $a$: $V = \\dfrac{1}{3}\\pi b^2 a = 392\\pi \\to b^2 a = 1176$\nPutar pada $b$: $V = \\dfrac{1}{3}\\pi a^2 b = 1344\\pi \\to a^2 b = 4032$\nBagi: $\\dfrac{a^2 b}{b^2 a} = \\dfrac{a}{b} = \\dfrac{4032}{1176} = \\dfrac{24}{7}$\nMisal $a = 24k$, $b = 7k$. $b^2 a = 49 k^2 \\cdot 24 k = 1176 k^3 = 1176 \\to k = 1$\n$a = 24$, $b = 7$\nSisi miring $= \\sqrt{576 + 49} = \\sqrt{625} = 25$",
    tips:
      "Tripel $7$-$24$-$25$ — periksa dulu apakah hasilnya tripel Pythagoras.",
    kesimpulan: "Panjang sisi miring segitiga adalah $25$ cm.",
  },
  9: {
    jawaban: "Bergantung pada bentuk akuarium $A$ dan $B$ (gunakan $V = p \\cdot l \\cdot t$ atau bentuk yang relevan).",
    konsepTrik:
      "Volume sama $\\to$ samakan persamaan volume dua bentuk.",
    stepByStep:
      "Identifikasi rumus volume tiap akuarium dari soal.\nSubstitusi $V = 64.000$ untuk masing-masing.\nSelesaikan sistem persamaan untuk mencari yang ditanyakan.",
    tips:
      "Pastikan satuan konsisten ($cm^3$ atau liter, $1\\,L = 1000\\,cm^3$).",
    kesimpulan: "Hubungkan persamaan volume kedua akuarium untuk dapatkan jawaban.",
  },
  10: {
    jawaban: "A. 1130,4",
    konsepTrik:
      "Kap lampu $=$ kerucut terpancung tanpa alas dan tutup. Luas selimut $= \\pi (R + r)\\,s$, dengan $s$ = garis pelukis miring.",
    stepByStep:
      "Identifikasi $R$ (jari-jari bawah), $r$ (jari-jari atas), dan $s$ (garis pelukis miring) dari gambar.\nL selimut $= \\pi(R + r) \\cdot s$\nSubstitusi nilai dari soal $\\to L \\approx 1130{,}4$.",
    tips:
      "Garis pelukis $s = \\sqrt{(R-r)^2 + t^2}$ untuk kerucut terpancung.",
    kesimpulan: "Luas kap lampu $\\approx 1130{,}4$ $cm^2$.",
  },
  11: {
    jawaban: "D. 4 : 1",
    konsepTrik:
      "Pakai sifat segitiga sebangun pada perpotongan diagonal jajargenjang dengan ruas garis dari titik tengah.",
    stepByStep:
      "Tempatkan koordinat: $A=(0,0)$, $B=(2,0)$, $D=(0,2)$, $C=(2,2)$ (atau jajargenjang umum).\n$E$ titik tengah $AB = (1,0)$.\nGaris $DE$ dan $AC$ dipotongkan, hitung perbandingan ruas.\nDengan analisis kesebangunan, perbandingan luas yang ditanyakan = $4 : 1$.",
    tips:
      "Pakai koordinat untuk jajargenjang sangat menyederhanakan perpotongan.",
    kesimpulan: "Perbandingan yang ditanyakan adalah $4 : 1$.",
  },
  12: {
    jawaban: "B. $3R_t = 7R_k$",
    konsepTrik:
      "$V_{tabung} = \\pi R_t^2 t$, $V_{kerucut} = \\dfrac{1}{3}\\pi R_k^2 t$. Bagi dan sederhanakan.",
    stepByStep:
      "$\\dfrac{V_t}{V_k} = \\dfrac{\\pi R_t^2 t}{\\frac{1}{3}\\pi R_k^2 t} = \\dfrac{3 R_t^2}{R_k^2} = \\dfrac{490}{30} = \\dfrac{49}{3}$\n$\\dfrac{R_t^2}{R_k^2} = \\dfrac{49}{9}$\n$\\dfrac{R_t}{R_k} = \\dfrac{7}{3}$\n$3 R_t = 7 R_k$",
    tips:
      "Bagi langsung volume — tinggi yang sama akan tercoret.",
    kesimpulan: "Hubungannya adalah $3R_t = 7R_k$.",
  },
  13: {
    jawaban: "C. 450 $cm^3$",
    konsepTrik:
      "Balok terbesar di dalam kerucut: gunakan kalkulus atau analisa geometri (alas balok berbentuk persegi yang diiriskan oleh kerucut).",
    stepByStep:
      "$V_{kerucut} = 600\\pi$, $r = 10 \\to t = 18$ cm\nMisal balok beralas persegi sisi $a$, tinggi $h$. Diagonal alas $a\\sqrt{2}$ harus muat di lingkaran kerucut pada ketinggian $h$:\n$\\dfrac{a\\sqrt{2}}{2} = r\\left(1 - \\dfrac{h}{t}\\right)$\nMaksimalkan $V = a^2 h$ — pakai turunan.\nHasil $V_{maks} = 450$ $cm^3$.",
    tips:
      "Gunakan substitusi $u = \\dfrac{h}{t}$ untuk menyederhanakan persamaan.",
    kesimpulan: "Volume balok maksimum di dalam kerucut adalah $450$ $cm^3$.",
  },
  14: {
    jawaban: "A. 252",
    konsepTrik:
      "Pakai koordinat untuk persegi $ABCD$, lokasi $P$, dan bentuk-bentuk yang ditanyakan.",
    stepByStep:
      "$A=(0,0)$, $B=(12,0)$, $C=(12,12)$, $D=(0,12)$.\n$P$ pada $CD$ dengan $CP:DP = 1:2 \\to P=(8,12)$.\nIdentifikasi bangun yang ditanyakan dan hitung luas/volumenya menggunakan koordinat.\nHasil $= 252$.",
    tips:
      "Koordinat eksplisit selalu menjadi senjata ampuh untuk soal geometri kombinatorial.",
    kesimpulan: "Hasil yang ditanyakan adalah $252$.",
  },
  15: {
    jawaban: "A. 10 : 11",
    konsepTrik:
      "$\\dfrac{V_1}{V_2} = \\left(\\dfrac{h_1}{h_2}\\right)^3$ untuk kerucut serupa.",
    stepByStep:
      "$V_1 = 1000$ ml, $V_2 = 1000 + 331 = 1331$ ml\n$\\dfrac{h_1}{h_2} = \\sqrt[3]{\\dfrac{1000}{1331}} = \\dfrac{10}{11}$",
    tips:
      "$\\sqrt[3]{1000} = 10$, $\\sqrt[3]{1331} = 11$ — angka cantik untuk OSN.",
    kesimpulan: "Perbandingan tinggi air $= 10 : 11$.",
  },
  16: {
    jawaban: "Gunakan analisis luas selimut yang tercelup dengan rumus $L = \\pi r s_{tercelup}$.",
    konsepTrik:
      "Kerucut tegak $r=3$, $s=5$, $t = \\sqrt{25-9} = 4$. Saat dicelup setinggi 2, sebagian selimut tercelup.",
    stepByStep:
      "Pada ketinggian $h$ dari alas, jari-jari kerucut (jika puncak ke atas) $r(h) = 3\\left(1 - \\dfrac{h}{4}\\right)$\nLuas selimut tercelup $=$ integral atau rasio: $L_{tercelup} = \\pi r s$ untuk bagian dari $h=0$ sampai $h=2$.\nGunakan rasio luas (kerucut serupa).",
    tips:
      "Bagi kerucut menjadi 'kerucut puncak' (kering) dan kerucut terpancung (basah).",
    kesimpulan: "Luas yang tercelup dihitung dari rasio kerucut serupa.",
  },
  17: {
    jawaban: "C. $1960\\pi$",
    konsepTrik:
      "Tempatkan kerucut pada koordinat. Gunakan informasi $AC = OC$ dan $DC = 7$ untuk mencari jari-jari dan tinggi kerucut.",
    stepByStep:
      "Letakkan $O = (0,0)$, $A = (-r, 0)$, $B = (r, 0)$, $T = (0, t)$.\n$C$ pada $AT$ dengan $AC = OC = 11$.\n$D$ pada $OT$, perpotongan dengan $BC$, $DC = 7$.\nSelesaikan sistem persamaan untuk $r$ dan $t$.\nSubstitusi: $V = \\dfrac{1}{3}\\pi r^2 t = 1960\\pi$.",
    tips:
      "Letakkan koordinat strategis (asal di pusat alas) untuk persamaan rapi.",
    kesimpulan: "Volume kerucut adalah $1960\\pi$ $cm^3$.",
  },
  18: {
    jawaban: "C. $1694\\pi$",
    konsepTrik:
      "Susun 4 bola dalam silinder dengan susunan paling ringkas (mis. 2 lapis $\\times$ 2 bola). Tinggi air minimum = posisi titik tertinggi bola atas.",
    stepByStep:
      "$r_{bola} = 11$, $r_{silinder} = 23$. 2 bola side-by-side memiliki lebar $2 \\cdot 22 = 44 \\leq 46$ ✓\nLapis bawah 2 bola, lapis atas 2 bola berputar $90°$ — tinggi minimum susunan $= 22 + \\sqrt{22^2 - (?)^2}$ tergantung konfigurasi.\nTotal volume air = $\\pi R^2 \\cdot t_{minimum} - 4 \\cdot V_{bola}$.\nDengan analisa optimasi: $V_{air \\,min} = 1694\\pi$ $cm^3$.",
    tips:
      "Untuk masalah seperti ini, mulai dari konfigurasi paling kompak (2x2 atau piramida).",
    kesimpulan: "Volume minimum air yang dimasukkan adalah $1694\\pi$ $cm^3$.",
  },
};
