import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Skala adalah perbandingan jarak pada peta dengan jarak",
    answers: ["sebenarnya"],
    discussion: [
      "Skala dipakai pada peta atau denah untuk membandingkan ukuran kecil di gambar dengan ukuran nyata.",
      "Yang dibandingkan adalah jarak peta dengan jarak sebenarnya.",
      "Jadi, jawabannya adalah sebenarnya.",
    ],
  },
  {
    id: "g2",
    label: "Skala 1 : 100.000 berarti 1 cm pada peta mewakili 100.000 cm sebenarnya, atau sama dengan",
    suffix: "km",
    answers: ["1"],
    discussion: [
      "100.000 cm dibagi 100.000 = 1 km (karena 1 km = 100.000 cm).",
      "Jadi, 1 cm pada peta = 1 km sebenarnya.",
    ],
  },
  {
    id: "g3",
    label: "Pada peta dengan skala 1 : 500.000, jarak 4 cm mewakili jarak sebenarnya",
    suffix: "km",
    answers: ["20"],
    discussion: [
      "1 cm di peta = 500.000 cm = 5 km.",
      "4 cm × 5 km = 20 km.",
      "Jadi, jarak sebenarnya = 20 km.",
    ],
  },
  {
    id: "g4",
    label: "Jika jarak sebenarnya 60 km dan skala peta 1 : 1.500.000, jarak di peta adalah",
    suffix: "cm",
    answers: ["4"],
    discussion: [
      "Ubah 60 km menjadi 6.000.000 cm.",
      "Jarak peta = 6.000.000 ÷ 1.500.000 = 4.",
      "Jadi, jarak di peta 4 cm.",
    ],
  },
  {
    id: "g5",
    label: "Rumus baku skala adalah",
    answers: ["jp:js", "jp/js"],
    discussion: [
      "Skala = jarak pada peta : jarak sebenarnya.",
      "Disingkat S = JP : JS atau JP/JS.",
      "Jadi rumusnya JP : JS.",
    ],
  },
  {
    id: "g6",
    label: "Untuk mencari jarak sebenarnya, rumus turunannya adalah JS = JP dibagi",
    answers: ["skala"],
    discussion: [
      "Dari S = JP/JS, jika dipindah maka JS = JP/S.",
      "Jadi, JS = JP ÷ skala.",
    ],
  },
  {
    id: "g7",
    label: "Untuk mencari jarak peta, rumus turunannya adalah JP = JS dikali",
    answers: ["skala"],
    discussion: [
      "Dari S = JP/JS, jika dipindah maka JP = JS × S.",
      "Jadi, JP = JS × skala.",
    ],
  },
  {
    id: "g8",
    label: "Sebelum menghitung dengan skala, satuan jarak peta dan jarak sebenarnya harus dibuat",
    answers: ["sama"],
    discussion: [
      "Skala memakai perbandingan satuan yang sama (umumnya cm).",
      "Jadi, satuan keduanya harus dibuat sama dahulu.",
    ],
  },
  {
    id: "g9",
    label: "Skala 1 : 250.000 artinya setiap 1 cm pada peta mewakili",
    suffix: "km sebenarnya",
    answers: ["2.5", "2,5"],
    discussion: [
      "1 cm di peta = 250.000 cm sebenarnya.",
      "250.000 cm = 2,5 km.",
      "Jadi, 1 cm peta mewakili 2,5 km.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Sebuah peta menggunakan skala 1 : 250.000. Jika jarak dua kota pada peta 6 cm, berapa km jarak sebenarnya?",
    answers: ["15"],
    hint: "1 cm peta = 250.000 cm = 2,5 km.",
    discussion: [
      "1 cm peta = 2,5 km.",
      "6 cm × 2,5 km = 15 km.",
      "Jadi, jarak sebenarnya 15 km.",
    ],
  },
  {
    id: "p2",
    question: "Jarak Bandung-Cirebon sebenarnya adalah 130 km. Jika digambar pada peta dengan skala 1 : 1.000.000, berapa cm jarak di peta?",
    answers: ["13"],
    hint: "Ubah 130 km ke cm: 13.000.000 cm.",
    discussion: [
      "130 km = 13.000.000 cm.",
      "Jarak peta = 13.000.000 ÷ 1.000.000 = 13.",
      "Jadi, jarak di peta 13 cm.",
    ],
  },
  {
    id: "p3",
    question: "Sebuah denah rumah memakai skala 1 : 200. Jika lebar ruang tamu pada denah 4 cm, berapa meter lebar ruang tamu sebenarnya?",
    answers: ["8"],
    hint: "1 cm denah = 200 cm = 2 m.",
    discussion: [
      "1 cm denah = 200 cm sebenarnya = 2 m.",
      "4 × 2 = 8 m.",
      "Jadi, lebar ruang tamu 8 m.",
    ],
  },
  {
    id: "p4",
    question: "Sebuah peta digambar dengan skala 1 : 50.000. Jarak sebenarnya 7,5 km akan digambar berapa cm di peta?",
    answers: ["15"],
    hint: "Ubah 7,5 km menjadi 750.000 cm.",
    discussion: [
      "7,5 km = 750.000 cm.",
      "750.000 ÷ 50.000 = 15 cm.",
      "Jadi, jarak peta 15 cm.",
    ],
  },
  {
    id: "p5",
    question: "Tinggi gedung sebenarnya 60 meter. Jika tinggi pada gambar 12 cm, tentukan skala yang digunakan!",
    answers: ["1:500"],
    hint: "Ubah 60 m menjadi 6.000 cm, lalu 12 : 6.000.",
    discussion: [
      "60 m = 6.000 cm.",
      "Skala = 12 : 6.000.",
      "Sederhanakan: 1 : 500.",
      "Jadi, skalanya 1 : 500.",
    ],
  },
  {
    id: "p6",
    question: "Pada peta skala 1 : 400.000, jarak dua kota adalah 9 cm. Berapa km jarak sebenarnya?",
    answers: ["36"],
    hint: "1 cm peta = 4 km.",
    discussion: [
      "1 cm peta = 400.000 cm = 4 km.",
      "9 × 4 = 36 km.",
      "Jadi, jarak sebenarnya 36 km.",
    ],
  },
  {
    id: "p7",
    question: "Sebuah lapangan berbentuk persegi panjang berukuran panjang 80 m dan lebar 60 m. Jika digambar dengan skala 1 : 1.000, berapa cm² luas lapangan pada gambar?",
    answers: ["48"],
    hint: "Hitung dahulu panjang & lebar di gambar dalam cm.",
    discussion: [
      "Panjang gambar = 8.000 ÷ 1.000 = 8 cm.",
      "Lebar gambar = 6.000 ÷ 1.000 = 6 cm.",
      "Luas gambar = 8 × 6 = 48 cm².",
      "Jadi, luas pada gambar 48 cm².",
    ],
  },
  {
    id: "p8",
    question: "Pada peta skala 1 : 750.000, jarak antara dua kota 12 cm. Sebuah mobil melaju dengan kecepatan 60 km/jam. Berapa jam waktu tempuhnya?",
    answers: ["1.5", "1,5"],
    hint: "Jarak sebenarnya = 12 × 7,5 = 90 km.",
    discussion: [
      "1 cm peta = 750.000 cm = 7,5 km.",
      "Jarak sebenarnya = 12 × 7,5 = 90 km.",
      "Waktu = 90 ÷ 60 = 1,5 jam.",
      "Jadi, waktu tempuhnya 1,5 jam.",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Membaca Skala Peta",
    visual: (
      <div className="text-center space-y-2">
        <div className="text-4xl">🗺️</div>
        <p className="text-lg font-bold text-white">Skala 1 : 500.000</p>
        <p className="text-sm text-white/65">1 cm peta mewakili 500.000 cm = 5 km sebenarnya.</p>
      </div>
    ),
    text: "Skala memberitahu berapa kali ukuran nyata diperkecil untuk digambar pada peta.",
  },
  {
    title: "Situasi: Menggambar Denah",
    visual: (
      <div className="text-center space-y-2">
        <div className="text-4xl">🏠</div>
        <p className="text-lg font-bold text-white">Skala 1 : 200</p>
        <p className="text-sm text-white/65">1 cm denah = 200 cm = 2 m sebenarnya.</p>
      </div>
    ),
    text: "Denah memakai skala lebih kecil agar bangunan tetap terbaca utuh di kertas.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Definisi Skala", text: "Skala = JP : JS, perbandingan jarak peta dengan jarak sebenarnya.", tone: "cyan" },
  { title: "Jarak Sebenarnya", text: "JS = JP ÷ skala. Selalu samakan satuan terlebih dahulu.", tone: "yellow" },
  { title: "Jarak Peta", text: "JP = JS × skala. Hasilnya biasanya dalam cm.", tone: "emerald" },
];

const SkalaLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Skala"
    intro="LKPD ini menuntun Sobat Numatik memahami arti skala, mengubah satuan, serta menghitung jarak peta dan jarak sebenarnya."
    situations={situations}
    guidedIntro="Isilah bagian kosong untuk menemukan rumus skala dan turunannya."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Selalu ubah satuan ke cm sebelum menghitung agar perbandingan tetap konsisten."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/perbandingan"
    backLabel="Kembali ke LKPD Perbandingan"
  />
);

export default SkalaLKPDPage;
