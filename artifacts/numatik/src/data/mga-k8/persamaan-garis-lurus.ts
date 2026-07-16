import type { SubmaterialEntryK8, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "persamaan-garis-lurus";
const PARENT_LABEL = "PERSAMAAN GARIS LURUS";

const GRAFIK_PGL: BaseQ[] = [
  { q: "Bentuk umum PGL adalah ...", opts: ["y=mx+c", "y=ax²+bx+c", "y=a/x", "y=√x"], correct: 0 },
  { q: "Grafik PGL berbentuk ...", opts: ["lengkung", "garis lurus", "lingkaran", "parabola"], correct: 1 },
  { q: "Untuk gambar PGL minimal perlu ... titik", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Garis y=x melewati titik ...", opts: ["(0,0)", "(0,1)", "(1,0)", "(2,1)"], correct: 0 },
  { q: "Garis y=x+1 memotong sumbu Y di ...", opts: ["(0,0)", "(0,1)", "(1,0)", "(0,2)"], correct: 1 },
  { q: "Garis y=2x memotong sumbu Y di ...", opts: ["(0,0)", "(0,1)", "(0,2)", "(1,0)"], correct: 0 },
  { q: "Garis y=3 berbentuk ...", opts: ["miring", "horizontal", "vertikal", "lingkaran"], correct: 1 },
  { q: "Garis x=4 berbentuk ...", opts: ["miring", "horizontal", "vertikal", "lingkaran"], correct: 2 },
  { q: "Pada y=2x+1, jika x=1 maka y = ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Pada y=x−2, jika x=5 maka y = ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Garis y=x+3 memotong sumbu Y di y = ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Garis y=2x−4 memotong sumbu X di x = ...", opts: ["1", "2", "3", "4"], correct: 1 },
];

const GRADIEN: BaseQ[] = [
  { q: "Gradien adalah kemiringan garis dilambangkan dengan ...", opts: ["c", "m", "y", "x"], correct: 1 },
  { q: "Pada y = 2x + 3, gradien (m) = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Pada y = 5x − 1, m = ...", opts: ["1", "2", "5", "−1"], correct: 2 },
  { q: "Pada y = −3x + 2, m = ...", opts: ["−3", "3", "2", "−2"], correct: 0 },
  { q: "Pada y = x + 7, m = ...", opts: ["1", "2", "7", "8"], correct: 0 },
  { q: "Rumus gradien dari (x₁,y₁) ke (x₂,y₂) adalah ...", opts: ["(y₂−y₁)/(x₂−x₁)", "(x₂−x₁)/(y₂−y₁)", "y/x", "x+y"], correct: 0 },
  { q: "Gradien antara (0,0) dan (1,2) = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Gradien antara (1,1) dan (3,5) = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Gradien garis horizontal y = c adalah ...", opts: ["0", "1", "tak hingga", "−1"], correct: 0 },
  { q: "Gradien garis vertikal x = c adalah ...", opts: ["0", "1", "tak hingga", "−1"], correct: 2 },
  { q: "Gradien antara (2,3) dan (5,9) = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Gradien antara (1,5) dan (4,2) = ...", opts: ["1", "−1", "2", "−2"], correct: 1 },
];

const MENENTUKAN_PGL: BaseQ[] = [
  { q: "PGL melalui (0,0) dengan m=2 adalah ...", opts: ["y=2x", "y=x+2", "y=2", "x=2"], correct: 0 },
  { q: "PGL melalui (0,3) dengan m=1 adalah ...", opts: ["y=x", "y=x+3", "y=3x", "y=3"], correct: 1 },
  { q: "PGL dengan m=2 dan c=5: y = ...", opts: ["2x+5", "5x+2", "x+7", "2x"], correct: 0 },
  { q: "PGL melalui (0,0) dan (1,1) adalah ...", opts: ["y=2x", "y=x", "y=x+1", "y=−x"], correct: 1 },
  { q: "PGL melalui (0,0) dan (2,4) adalah ...", opts: ["y=x", "y=2x", "y=4x", "y=x+2"], correct: 1 },
  { q: "PGL melalui (0,1) dan (1,2) adalah ...", opts: ["y=x", "y=x+1", "y=2x", "y=x−1"], correct: 1 },
  { q: "Rumus y−y₁ = m(x−x₁) digunakan untuk PGL dengan ...", opts: ["1 titik & m", "2 titik", "tanpa titik", "3 titik"], correct: 0 },
  { q: "PGL melalui (1,2) dengan m=3: y−2 = 3(x−1) → y = ...", opts: ["3x−1", "3x−2", "x+1", "x+2"], correct: 0 },
  { q: "PGL melalui (2,5) dengan m=1: y = ...", opts: ["x+3", "x+5", "x+2", "x"], correct: 0 },
  { q: "PGL dengan c=−2 dan m=1: y = ...", opts: ["x+2", "x−2", "2x−1", "−x"], correct: 1 },
  { q: "PGL melalui (3,0) dan (0,3): y = ...", opts: ["x+3", "−x+3", "x−3", "3x"], correct: 1 },
  { q: "PGL m=−1 melalui (0,4): y = ...", opts: ["x+4", "−x+4", "x−4", "−x−4"], correct: 1 },
];

const HUBUNGAN_2_GARIS: BaseQ[] = [
  { q: "Dua garis sejajar memiliki gradien yang ...", opts: ["sama", "berbeda", "berlawanan", "nol"], correct: 0 },
  { q: "Dua garis tegak lurus jika perkalian gradien = ...", opts: ["0", "1", "−1", "2"], correct: 2 },
  { q: "y=2x+1 sejajar dengan ...", opts: ["y=2x+5", "y=−2x+1", "y=x+2", "y=3x+1"], correct: 0 },
  { q: "y=3x sejajar dengan ...", opts: ["y=3x+1", "y=−3x", "y=x+3", "y=2x"], correct: 0 },
  { q: "y=2x tegak lurus dengan y = ...", opts: ["−2x", "2x", "−x/2", "x/2"], correct: 2 },
  { q: "y=x tegak lurus dengan y = ...", opts: ["−x", "x", "−2x", "2x"], correct: 0 },
  { q: "Gradien garis sejajar y=4x adalah ...", opts: ["4", "−4", "1/4", "−1/4"], correct: 0 },
  { q: "Gradien garis tegak lurus y=4x adalah ...", opts: ["4", "−4", "1/4", "−1/4"], correct: 3 },
  { q: "y=−5x sejajar dengan ...", opts: ["y=5x", "y=−5x+1", "y=x−5", "y=5"], correct: 1 },
  { q: "y=2x+3 dan y=2x−1, dua garis tersebut ...", opts: ["sejajar", "tegak lurus", "berhimpit", "berpotongan"], correct: 0 },
  { q: "y=x dan y=−x, dua garis tersebut ...", opts: ["sejajar", "tegak lurus", "berhimpit", "berpotongan"], correct: 1 },
  { q: "Jika m₁=3 dan m₂=−1/3, dua garis ...", opts: ["sejajar", "tegak lurus", "berhimpit", "berpotongan biasa"], correct: 1 },
];

const APLIKASI_KONTEKSTUAL: BaseQ[] = [
  { q: "Tarif taksi y = 5000x + 10000. Untuk x=2 km, y = ...", opts: ["15000", "20000", "25000", "30000"], correct: 1 },
  { q: "Tarif taksi y = 4000x + 5000. Untuk x=3, y = ...", opts: ["12000", "15000", "17000", "20000"], correct: 2 },
  { q: "Suhu y = 2t + 20. Setelah t=5 menit, y = ...", opts: ["25", "27", "30", "32"], correct: 2 },
  { q: "Biaya y = 3000x + 2000. Untuk x=4, y = ...", opts: ["12000", "13000", "14000", "15000"], correct: 2 },
  { q: "Pada y = 100x, untuk x=10, y = ...", opts: ["100", "500", "1000", "1500"], correct: 2 },
  { q: "Tinggi tanaman y = 2t + 5 cm. Setelah t=3, y = ...", opts: ["7", "9", "11", "13"], correct: 2 },
  { q: "Pendapatan y = 50000x + 100000. Untuk x=2, y = ...", opts: ["150000", "200000", "250000", "300000"], correct: 1 },
  { q: "Sewa kamar y = 10000x + 50000. Untuk 5 hari, y = ...", opts: ["50000", "75000", "100000", "150000"], correct: 2 },
  { q: "Banyak air y = 5t L. Setelah t=4 menit, y = ...", opts: ["10", "15", "20", "25"], correct: 2 },
  { q: "Tarif parkir y = 2000x. Untuk 3 jam, y = ...", opts: ["3000", "4000", "5000", "6000"], correct: 3 },
  { q: "Pulsa berkurang y = 1000 − 100x. Setelah x=5, y = ...", opts: ["300", "400", "500", "600"], correct: 2 },
  { q: "Saldo y = 50000 − 5000x. Setelah x=3 hari, y = ...", opts: ["30000", "35000", "40000", "45000"], correct: 1 },
];

export const PERSAMAAN_GARIS_LURUS: SubmaterialEntryK8[] = [
  { slug: "grafik-pgl", label: "GRAFIK PERSAMAAN GARIS LURUS", emoji: "📈", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(GRAFIK_PGL) },
  { slug: "gradien", label: "GRADIEN (KEMIRINGAN)", emoji: "📐", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(GRADIEN) },
  { slug: "menentukan-pgl", label: "MENENTUKAN PGL", emoji: "✏️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(MENENTUKAN_PGL) },
  { slug: "hubungan-2-garis", label: "HUBUNGAN 2 GARIS", emoji: "✖️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(HUBUNGAN_2_GARIS) },
  { slug: "aplikasi-kontekstual", label: "APLIKASI KONTEKSTUAL PGL", emoji: "🧪", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(APLIKASI_KONTEKSTUAL) },
];
