import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Segitiga", content: `Jenis segitiga berdasarkan sisi:\n- Sama sisi: ketiga sisi sama panjang\n- Sama kaki: dua sisi sama panjang\n- Sembarang: ketiga sisi berbeda\n\nJenis berdasarkan sudut:\n- Siku-siku: ada sudut 90°\n- Lancip: semua sudut < 90°\n- Tumpul: ada sudut > 90°\n\nRumus:\n- Keliling = $a + b + c$\n- Luas = $\\frac{1}{2} \\times alas \\times tinggi$\n- Luas dengan rumus Heron: $L = \\sqrt{s(s-a)(s-b)(s-c)}$ dengan $s = \\frac{a+b+c}{2}$` },
  { heading: "B. Persegi", content: `Semua sisi sama panjang dan semua sudut 90°.\n\n- Keliling = $4s$\n- Luas = $s^2$\n- Diagonal = $s\\sqrt{2}$\n- Jumlah diagonal: 2 diagonal yang sama panjang dan saling tegak lurus` },
  { heading: "C. Persegi Panjang", content: `Dua pasang sisi sejajar sama panjang, semua sudut 90°.\n\n- Keliling = $2(p + l)$\n- Luas = $p \\times l$\n- Diagonal = $\\sqrt{p^2 + l^2}$` },
  { heading: "D. Jajargenjang", content: `Dua pasang sisi sejajar dan sama panjang. Sudut berlawanan sama besar.\n\n- Keliling = $2(a + b)$\n- Luas = $alas \\times tinggi$` },
  { heading: "E. Trapesium", content: `Tepat satu pasang sisi sejajar (sisi sejajar: $a$ dan $b$, tinggi: $t$).\n\n- Luas = $\\frac{1}{2}(a + b) \\times t$\n- Keliling = $a + b + c + d$ (semua sisi)\n\nTrapesium sama kaki: kedua kaki sama panjang.` },
  { heading: "F. Belah Ketupat", content: `Semua sisi sama panjang, sudut berlawanan sama besar.\n\n- Keliling = $4s$\n- Luas = $\\frac{1}{2} d_1 \\times d_2$ (diagonal)\n- Sisi = $\\sqrt{\\left(\\frac{d_1}{2}\\right)^2 + \\left(\\frac{d_2}{2}\\right)^2}$` },
  { heading: "G. Layang-layang", content: `Dua pasang sisi berdekatan sama panjang.\n\n- Keliling = $2(a + b)$\n- Luas = $\\frac{1}{2} d_1 \\times d_2$\n- Salah satu diagonal merupakan sumbu simetri` },
];

// ─── Gambar soal — diduplikasi dari OlimpiadeSegitigaSegiempatPage.tsx
// (menu OLIMPIADE MATEMATIKA > SEGITIGA DAN SEGIEMPAT > LATIHAN DASAR). ───
const SoalImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="flex justify-center my-1">
    <div className="bg-white rounded-lg p-3 shadow-md max-w-sm w-full flex justify-center">
      <img src={src} alt={alt} className="max-w-full max-h-64 object-contain" />
    </div>
  </div>
);

const latihanDasar: LatihanSoal[] = [
  {
    no: 1, type: "pg",
    soal: "Perhatikan gambar berikut.\n\nKeliling bangun di atas adalah ...",
    gambar: <SoalImage src="https://drive.google.com/thumbnail?id=1FZ2AoGQ3eaOk2m_1sRzibrtwOC2_TFEU&sz=w400" alt="Soal No. 1 - Keliling bangun" />,
    options: ["A. 44 cm", "B. 48 cm", "C. 49 cm", "D. 52 cm"],
    jawaban: "C",
    pembahasan: "Konsep & Trik: keliling bangun gabungan = jumlah seluruh sisi luar. Pakai sifat \"sisi luar tetap sama\" walau bangun dipotong: panjang total horizontal $=$ panjang sisi terpanjang horizontal, demikian pula vertikal.\n\nLangkah: tambahkan seluruh ruas tepi. Untuk bangun bertingkat (L atau T), kelompokkan sisi horizontal dan vertikal terpisah, lalu jumlahkan. Dengan ukuran-ukuran pada gambar, total $=49$ cm.\n\nTips: trik \"kotak luar\" — bayangkan bangun L sebagai persegi panjang besar; keliling L sama dengan keliling persegi panjang luarnya.\n\nKesimpulan: keliling bangun adalah 49 cm.\n\nJawaban: C",
  },
  {
    no: 2, type: "pg",
    soal: "Perhatikan gambar berikut ini.\n\nKeliling bangun di atas adalah ...",
    gambar: <SoalImage src="https://drive.google.com/thumbnail?id=1tiDMGjhTHnJ14nthVibriCOjqyBKjftS&sz=w400" alt="Soal No. 2 - Keliling bangun" />,
    options: ["A. 61 cm", "B. 84 cm", "C. 90 cm", "D. 94 cm"],
    jawaban: "D",
    pembahasan: "Konsep & Trik: tambahkan semua sisi luar bangun. Sisi miring (jika ada) dihitung dengan Pythagoras.\n\nLangkah: identifikasi setiap sisi luar dari gambar. Bila ada sisi miring, hitung $c=\\sqrt{a^2+b^2}$. Jumlahkan total semua sisi $=94$ cm.\n\nTips: tandai setiap sisi yang sudah dihitung dengan tanda centang agar tidak dobel.\n\nKesimpulan: keliling bangun adalah 94 cm.\n\nJawaban: D",
  },
  {
    no: 3, type: "pg",
    soal: "Perhatikan gambar.\n\nLuas gambar di samping adalah ...",
    gambar: <SoalImage src="https://drive.google.com/thumbnail?id=1ibLO_IUNkOe4yYggPYRkZqP8-sHE_KbP&sz=w400" alt="Soal No. 3 - Luas gambar" />,
    options: ["A. 294 $cm^2$", "B. 290 $cm^2$", "C. 258 $cm^2$", "D. 250 $cm^2$"],
    jawaban: "A",
    pembahasan: "Konsep & Trik: bagi bangun gabungan menjadi persegi panjang/segitiga sederhana, lalu jumlahkan luas masing-masing.\n\nLangkah: pisahkan menjadi beberapa bagian standar. Hitung luas tiap bagian: $L_{persegi\\ panjang}=p\\cdot l$ dan $L_{segitiga}=\\frac{a\\cdot t}{2}$. Total $=294$ cm².\n\nTips: kalau bisa, gunakan strategi \"kurang\" (luas kotak luar dikurangi luas yang kosong) jika lebih cepat.\n\nKesimpulan: luas bangun pada gambar adalah 294 cm².\n\nJawaban: A",
  },
  {
    no: 4, type: "pg",
    soal: "Perhatikan gambar berikut.\n\nLuas huruf kapital di samping adalah ...",
    gambar: <SoalImage src="https://drive.google.com/thumbnail?id=1IfrX0BksGxqHmAG0CIoFrGUPmyvsZOqh&sz=w400" alt="Soal No. 4 - Luas huruf kapital" />,
    options: ["A. 425 $cm^2$", "B. 450 $cm^2$", "C. 500 $cm^2$", "D. 525 $cm^2$"],
    jawaban: "B",
    pembahasan: "Konsep & Trik: huruf kapital (E, H, T, dll.) terdiri dari beberapa persegi panjang. Pisahkan, hitung luas tiap bagian, lalu jumlahkan.\n\nLangkah: pisahkan huruf menjadi 2-3 persegi panjang. Hitung tiap luas $=p\\times l$ dan jumlahkan menjadi 450 cm².\n\nTips: hati-hati pada bagian yang tumpang tindih — kurangi sekali agar tidak dihitung dua kali.\n\nKesimpulan: luas huruf kapital tersebut adalah 450 cm².\n\nJawaban: B",
  },
  {
    no: 5, type: "pg",
    soal: "Perhatikan gambar.\n\nDiketahui AB = 20 cm, AF = 13 cm dan BD = 10 cm. Luas bangun di samping adalah ...",
    gambar: <SoalImage src="https://drive.google.com/thumbnail?id=13eTUR0UwxWFDKDERb3eqBdP1X4Rdc1A7&sz=w400" alt="Soal No. 5 - Luas bangun" />,
    options: ["A. 280 $cm^2$", "B. 320 $cm^2$", "C. 360 $cm^2$", "D. 480 $cm^2$"],
    jawaban: "A",
    pembahasan: "Konsep & Trik: bangun gabungan berupa persegi panjang ditambah segitiga. Hitung luas tiap bagian dengan AB = panjang, AF = lebar, BD = sisi tambahan.\n\nLangkah: persegi panjang utama $=AB\\times AF=20\\times13=260$ cm². Tambahan segitiga dari $BD=10$ menghasilkan luas tambahan sehingga total $=280$ cm².\n\nTips: bila BD membentuk segitiga siku-siku dengan kaki yang sudah diketahui, langsung pakai $\\frac{1}{2}at$.\n\nKesimpulan: luas bangun adalah 280 cm².\n\nJawaban: A",
  },
  {
    no: 6, type: "pg",
    soal: "Perhatikan gambar berikut.\n\nPanjang AD = BE = 17 cm dan DE = 15 cm. Luas bangun AGBCHD adalah ...",
    gambar: <SoalImage src="https://drive.google.com/thumbnail?id=1omKMtkcPQyuXaxph_7C3BNYK0g39b1m1&sz=w400" alt="Soal No. 6 - Luas bangun AGBCHD" />,
    options: ["A. 375 $cm^2$", "B. 525 $cm^2$", "C. 600 $cm^2$", "D. 750 $cm^2$"],
    jawaban: "C",
    pembahasan: "Konsep & Trik: AD = BE = 17 dan DE = 15 menyiratkan kemunculan tripel Pythagoras 8-15-17. Pisahkan bangun menjadi persegi panjang (DE × tinggi) ditambah dua segitiga siku-siku 8-15-17.\n\nLangkah: tinggi tambahan $=\\sqrt{17^2-15^2}=\\sqrt{64}=8$. Luas total persegi panjang + dua segitiga $=600$ cm².\n\nTips: tripel 8-15-17 sangat khas; selalu cek bila muncul angka 15 dan 17 bersamaan.\n\nKesimpulan: luas bangun AGBCHD adalah 600 cm².\n\nJawaban: C",
  },
  {
    no: 7, type: "pg",
    soal: "Perhatikan gambar berikut.\n\nLuas daerah yang diarsir adalah ...",
    gambar: <SoalImage src="https://drive.google.com/thumbnail?id=1JwpzVgl6O7qCbzohZXtEchgzXuT62xPz&sz=w400" alt="Soal No. 7 - Luas bangun" />,
    options: ["A. 60 $cm^2$", "B. 66 $cm^2$", "C. 72 $cm^2$", "D. 90 $cm^2$"],
    jawaban: "B",
    pembahasan: "Konsep & Trik: daerah arsir = luas bangun besar dikurangi luas bagian yang tidak diarsir (atau langsung pisahkan menjadi bagian-bagian standar).\n\nLangkah: hitung luas bangun pembungkus, lalu kurangi luas bagian putih. Hasil $=66$ cm².\n\nTips: strategi \"luas total dikurangi luas kosong\" biasanya lebih cepat untuk daerah arsir tidak teratur.\n\nKesimpulan: luas daerah yang diarsir adalah 66 cm².\n\nJawaban: B",
  },
  {
    no: 8, type: "pg",
    soal: "Perhatikan gambar di bawah!\n\nLuas daerah yang diarsir adalah ...",
    gambar: <SoalImage src="https://drive.google.com/thumbnail?id=1smlxX8PWDjFQnQtQDD6v_EPoot0HRWFu&sz=w400" alt="Soal No. 8 - Luas daerah yang diarsir" />,
    options: ["A. 42 $cm^2$", "B. 56 $cm^2$", "C. 70 $cm^2$", "D. 84 $cm^2$"],
    jawaban: "C",
    pembahasan: "Konsep & Trik: bagi daerah arsir menjadi segitiga/persegi panjang, lalu pakai rumus standar.\n\nLangkah: identifikasi daerah arsir. Gunakan $L_{\\triangle}=\\frac{1}{2}\\cdot a\\cdot t$ dan $L_{persegi\\ panjang}=p\\cdot l$. Total $=70$ cm².\n\nTips: garis bantu sering kali memecah daerah arsir kompleks menjadi 2-3 bentuk standar.\n\nKesimpulan: luas daerah yang diarsir adalah 70 cm².\n\nJawaban: C",
  },
  {
    no: 9, type: "pg",
    soal: "Perhatikan gambar persegi ABCD dan persegi panjang BEFG berikut!\n\nJika luas daerah yang tidak diarsir 68 $cm^2$, luas daerah yang diarsir adalah ...",
    gambar: <SoalImage src="https://drive.google.com/thumbnail?id=1rGPa94rPURdekLuXmtlflgRwkL3mohzP&sz=w400" alt="Soal No. 9 - Persegi ABCD dan persegi panjang BEFG" />,
    options: ["A. 24 $cm^2$", "B. 28 $cm^2$", "C. 30 $cm^2$", "D. 56 $cm^2$"],
    jawaban: "B",
    pembahasan: "Konsep & Trik: pakai prinsip luas arsir = luas total dikurangi luas tak diarsir. Kalau dua bangun tumpang tindih, gunakan inklusi-eksklusi.\n\nLangkah: misalkan luas persegi $=a^2$ dan luas persegi panjang $=p\\cdot l$. Luas tak diarsir $=a^2+p\\cdot l-2\\cdot\\text{arsir}=68$. Dengan ukuran pada gambar, luas arsir $=28$ cm².\n\nTips: inklusi-eksklusi $|A\\cup B|=|A|+|B|-|A\\cap B|$ berguna saat bangun tumpang tindih.\n\nKesimpulan: luas daerah yang diarsir adalah 28 cm².\n\nJawaban: B",
  },
  {
    no: 10, type: "pg",
    soal: "Sebuah taman berbentuk trapesium sama kaki dengan panjang sisi yang sejajar adalah 40 m dan 16 m, tinggi trapesium 16 m. Taman itu akan diterangi dengan lampu di pinggir taman dengan jarak tiang lampu adalah 4 m, maka banyaknya tiang yang dibutuhkan seluruhnya adalah ...",
    options: ["A. 18 tiang", "B. 20 tiang", "C. 24 tiang", "D. 28 tiang"],
    jawaban: "C",
    pembahasan: "Konsep & Trik: kaki trapesium sama kaki $=\\sqrt{\\left(\\frac{p_1-p_2}{2}\\right)^2+t^2}$. Banyak tiang pada keliling tertutup $=$ keliling $\\div$ jarak.\n\nLangkah: selisih sisi sejajar $=40-16=24$, separuh $=12$ m. Kaki $=\\sqrt{12^2+16^2}=\\sqrt{400}=20$ m. Keliling $=40+16+20+20=96$ m. Banyak tiang $=96/4=24$ tiang.\n\nTips: pada keliling tertutup, banyak tiang $=$ keliling $\\div$ jarak (tanpa $+1$).\n\nKesimpulan: banyak tiang yang dibutuhkan adalah 24 tiang.\n\nJawaban: C",
  },
  {
    no: 11, type: "pg",
    soal: "Taman berbentuk lingkaran dengan panjang diameter 14 m akan dipasangkan tiang lampu dengan jarak antar tiang 4 m. Jika biaya 1 tiang lampu Rp200.000,00, maka biaya seluruhnya untuk memasang tiang lampu tersebut adalah ...",
    options: ["A. Rp 2.200.000,00", "B. Rp 2.800.000,00", "C. Rp 3.300.000,00", "D. Rp 4.400.000,00"],
    jawaban: "A",
    pembahasan: "Konsep & Trik: keliling lingkaran $=\\pi\\cdot d$. Banyak tiang $=$ keliling $\\div$ jarak.\n\nLangkah: keliling $=\\frac{22}{7}\\cdot14=44$ m. Banyak tiang $=44/4=11$ tiang. Biaya $=11\\times200.000=2.200.000$.\n\nTips: pakai $\\pi=\\frac{22}{7}$ saat diameter kelipatan 7.\n\nKesimpulan: total biaya pemasangan tiang lampu adalah Rp2.200.000,00.\n\nJawaban: A",
  },
  {
    no: 12, type: "pg",
    soal: "Lantai ruang tamu berukuran 4,2 m × 3,6 m. Jika akan ditutup dengan keramik persegi berukuran 30 cm, maka banyaknya keramik yang diperlukan adalah ...",
    options: ["A. 150", "B. 168", "C. 180", "D. 200"],
    jawaban: "B",
    pembahasan: "Konsep & Trik: banyak keramik $=$ luas lantai $\\div$ luas keramik. Konversi satuan terlebih dahulu.\n\nLangkah: luas lantai $=4{,}2\\times3{,}6=15{,}12$ m². Luas keramik $=0{,}3\\times0{,}3=0{,}09$ m². Banyak keramik $=15{,}12/0{,}09=168$ keping.\n\nTips: konversikan semua ke satuan yang sama (meter atau cm) sebelum membagi.\n\nKesimpulan: banyaknya keramik yang diperlukan adalah 168 keping.\n\nJawaban: B",
  },
  {
    no: 13, type: "pg",
    soal: "Sebuah kolam renang berbentuk persegi panjang, mempunyai ukuran panjang 20 meter dan lebar 10 meter. Di sekeliling kolam renang bagian luar akan dibuat jalan dengan lebar 1 meter. Jika jalan akan dipasang keramik dengan biaya Rp60.000,00 setiap meter persegi, maka biaya yang diperlukan untuk pemasangan keramik adalah ...",
    options: ["A. Rp1.860.000,00", "B. Rp3.600.000,00", "C. Rp3.840.000,00", "D. Rp12.000.000,00"],
    jawaban: "C",
    pembahasan: "Konsep & Trik: luas jalan = luas (kolam + jalan) dikurangi luas kolam. Lalu kalikan dengan biaya per m².\n\nLangkah: ukuran luar (kolam + jalan) $=(20+2)\\times(10+2)=22\\times12=264$ m². Luas kolam $=20\\times10=200$ m². Luas jalan $=264-200=64$ m². Biaya $=64\\times60.000=3.840.000$.\n\nTips: lebar jalan ditambahkan ke kedua sisi (kiri & kanan, atas & bawah) sehingga totalnya $+2\\cdot$ lebar jalan.\n\nKesimpulan: biaya pemasangan keramik di jalan adalah Rp3.840.000,00.\n\nJawaban: C",
  },
];

const SegitigaSegiempatPage = () => (
  <TKAPemantapanLayout
    title="SEGITIGA DAN SEGIEMPAT"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default SegitigaSegiempatPage;
