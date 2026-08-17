import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";
import { getTkaContohSoal } from "@/data/tkaContohSoal";
import { latihanDasar as olimpiadeStatistika, dasarImages, olimpiadeImages } from "@/pages/OlimpiadeStatistikaPage";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Statistika", content: `Statistika adalah ilmu yang mempelajari cara pengumpulan, pengolahan, penyajian, dan analisis data.\n\nJenis data:\n- Data kualitatif: bukan berupa angka (warna, jenis kelamin)\n- Data kuantitatif: berupa angka (berat, tinggi, nilai)\n  - Data diskrit: hasil hitungan (jumlah siswa)\n  - Data kontinu: hasil pengukuran (tinggi badan)` },
  { heading: "B. Ukuran Pemusatan Data", content: `1. Mean (Rata-rata):\n$\\bar{x} = \\dfrac{\\sum x_i}{n}$\n\n2. Median (Nilai Tengah):\n- Data ganjil: nilai tengah setelah diurutkan\n- Data genap: rata-rata dua nilai tengah\n\n3. Modus: nilai yang paling sering muncul` },
  { heading: "C. Ukuran Penyebaran Data", content: `1. Jangkauan (Range): nilai max − nilai min\n\n2. Kuartil:\n- Q1 = kuartil bawah (25%)\n- Q2 = median (50%)\n- Q3 = kuartil atas (75%)\n- Jangkauan interkuartil (IQR) = Q3 − Q1\n\n3. Simpangan baku (standar deviasi):\n$SD = \\sqrt{\\dfrac{\\sum(x_i - \\bar{x})^2}{n}}$` },
  { heading: "D. Penyajian Data", content: `1. Tabel frekuensi\n2. Diagram batang\n3. Diagram garis\n4. Diagram lingkaran (pie chart)\n5. Histogram\n6. Ogive (poligon frekuensi kumulatif)\n\nFrekuensi relatif = $\\dfrac{f_i}{n} \\times 100\\%$` },
];

const latihanDasar: LatihanSoal[] = olimpiadeStatistika.map((item) => ({
  no: item.no,
  soal: [
    item.soal,
    ...(dasarImages[item.no] ? [`[IMAGE:${dasarImages[item.no]}]`] : []),
    ...(olimpiadeImages[item.no] ?? []).map((src) => `[IMAGE:${src}]`),
  ].join("\n"),
  image: item.image,
  options: item.options,
  jawaban: item.jawaban,
  pembahasan: typeof item.pembahasan === "string" ? item.pembahasan : item.pembahasan ? [item.pembahasan.konsep, ...item.pembahasan.langkah, item.pembahasan.rumus].filter(Boolean).join("\n") : "",
}));

const StatistikaPage = () => (
  <TKAPemantapanLayout
    title="STATISTIKA"
  materiSections={materiSections}
  contohSoal={getTkaContohSoal("statistika")}
  latihanDasar={latihanDasar}
    gambarMap={dasarImages}
  />
);

export default StatistikaPage;
