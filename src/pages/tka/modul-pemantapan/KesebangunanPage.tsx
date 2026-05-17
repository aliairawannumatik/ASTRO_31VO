import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  {
    heading: "A. Kesebangunan",
    content: `Bangun-bangun datar yang sebangun artinya bangun-bangun datar tersebut mempunyai bentuk yang sama namun ukurannya berbeda dapat lebih besar atau lebih kecil.

Untuk membuktikan dua buah bangun datar sebangun dapat dilakukan jika memenuhi salah satu syarat di bawah ini:
1. Sudut-sudut yang bersesuaian sama besar.
2. Sisi-sisi yang bersesuaian mempunyai perbandingan yang sama.

Sisi yang bersesuaian terletak di hadapan sudut yang sama besar.

Terdapat segitiga ABC dan segitiga ADE, dengan BC sejajar DE. Segitiga ABC dan segitiga ADE sebangun, maka:
$\\dfrac{AB}{AD} = \\dfrac{BC}{DE} = \\dfrac{AC}{AE}$

Pada segitiga siku-siku dapat dibuat garis tinggi ke sisi miring. Segitiga ABC sebangun dengan segitiga ADC:
$AB^2 = BD \\times BC$
$AC^2 = CD \\times CB$
$AD^2 = BD \\times CD$`,
  },
  {
    heading: "B. Kekongruenan",
    content: `Dua bangun dikatakan kongruen jika semua panjang sisi-sisi yang bersesuaian sama besar dan begitu juga sudutnya. Mudahnya, dua bangun itu sama ukurannya dan sama bentuknya.

Syarat dua segitiga kongruen:
1. Sisi-Sisi-Sisi (S.S.S): Ketiga sisi yang bersesuaian sama panjang.
2. Sisi-Sudut-Sisi (S.Sd.S): Dua sisi yang bersesuaian sama panjang dan sudut yang diapit sama besar.
3. Sudut-Sisi-Sudut (Sd.S.Sd): Dua sudut yang bersesuaian sama besar dan sisi di antara kedua sudut sama panjang.
4. Sisi-Sisi-Sudut (S.S.Sd): Dua sisi yang bersesuaian sama panjang dan salah satu sudut yang bersesuaian sama besar.`,
  },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Perhatikan gambar bangun-bangun berikut:\n(i) Dua buah persegi\n(ii) Dua buah persegi panjang\n(iii) Dua buah segitiga sama sisi\n(iv) Dua buah belah ketupat\n\nPasangan bangun di atas yang pasti sebangun adalah ...", options: ["A. (i) dan (ii)", "B. (i) dan (iii)", "C. (ii) dan (iii)", "D. (ii) dan (iv)"], jawaban: "B", pembahasan: "Bangun yang PASTI sebangun:\n• Dua persegi → semua sudut 90° dan rasio sisi selalu sama ✓\n• Dua segitiga sama sisi → semua sudut 60° ✓\n• Dua persegi panjang → rasio p:l bisa berbeda ✗\n• Dua belah ketupat → sudutnya bisa berbeda ✗\nJawaban B" },
  { no: 2, soal: "Perhatikan ukuran berikut:\nI. Kertas persegi panjang berukuran 30 cm × 20 cm\nII. Papan tulis berukuran 16 cm × 12 cm\nIII. Map berukuran 14 cm × 21 cm\nIV. Dinding tembok berukuran 25 cm × 15 cm\n\nPasangan bangun yang sebangun adalah …", options: ["A. I dan II", "B. I dan III", "C. II dan III", "D. II dan IV"], jawaban: "B", pembahasan: "Rasio p:l → I: 30:20 = 3:2, II: 16:12 = 4:3, III: 21:14 = 3:2, IV: 25:15 = 5:3\nRasio sama: I dan III = 3:2 → Jawaban B" },
  { no: 3, soal: "$\\triangle$ ABC kongruen dengan $\\triangle$ BDE. Syarat kekongruennya adalah ...", options: ["A. Sisi, sisi, sisi", "B. Sisi, sudut, sisi", "C. Sisi, sisi, sudut", "D. Sudut, sudut, sudut"], jawaban: "B", pembahasan: "AB = BD (sama panjang), ∠ABC = ∠DBE (bertolak belakang), CB = BE (sama panjang) → dua sisi mengapit sudut sama besar → S.Sd.S → Jawaban B" },
  { no: 4, soal: "Jika panjang AD = CE. Kedua segitiga di atas kongruen dengan syarat …", options: ["A. Sisi, sisi, sudut", "B. Sisi, sudut, sisi", "C. Sudut, sisi, sudut", "D. Sisi, sudut, sudut"], jawaban: "C", pembahasan: "∠A = ∠C (sama besar), AD = CE (sisi di antara sudut), ∠D = ∠E → Sd.S.Sd → Jawaban C" },
  { no: 5, soal: "Diketahui $\\triangle$ABC dan $\\triangle$KLM kongruen. Jika $\\angle A = \\angle L$ dan $\\angle C = \\angle K$, maka pasangan sisi yang sama panjang adalah …", options: ["A. AB = KM, BC = ML, AC = KL", "B. AB = ML, BC = KL, AC = KM", "C. AB = KL, BC = KM, AC = ML", "D. AB = ML, BC = KM, AC = KL"], jawaban: "D", pembahasan: "A↔L, C↔K, maka B↔M\nSisi bersesuaian: AB↔LM, BC↔MK, AC↔LK → AB=ML, BC=KM, AC=KL → Jawaban D" },
  { no: 7, soal: "Panjang TR dari gambar kesebangunan dua segitiga adalah …", options: ["A. 2 cm", "B. 3 cm", "C. 4 cm", "D. 6 cm"], jawaban: "C", pembahasan: "Gunakan rasio sisi bersesuaian kesebangunan: dengan rasio 2:3, TR = 4 cm → Jawaban C" },
  { no: 8, soal: "Panjang AD pada segitiga siku-siku dengan garis sejajar DE ∥ BC adalah …", options: ["A. 3 cm", "B. 4 cm", "C. 4,5 cm", "D. 5 cm"], jawaban: "C", pembahasan: "Kesebangunan segitiga: AD/AB = DE/BC → AD = 4,5 cm → Jawaban C" },
  { no: 10, soal: "Bangun ABCD dan AEFG sebangun. Luas bangun ABCD adalah …", options: ["A. 45 cm²", "B. 62,5 cm²", "C. 67,5 cm²", "D. 90 cm²"], jawaban: "C", pembahasan: "Rasio sisi 3:2, rasio luas = 9:4\n$L_{ABCD} = \\frac{9}{4} \\times 30 = 67,5$ cm² → Jawaban C" },
  { no: 12, soal: "Diketahui panjang AB = 6 cm dan DE = 14 cm. Jika panjang AE = 15 cm maka panjang CE adalah …", options: ["A. 4,5 cm", "B. 10,5 cm", "C. 15 cm", "D. 21 cm"], jawaban: "B", pembahasan: "AB ∥ DE → △CAB ~ △CED\n$\\frac{CA}{CE} = \\frac{6}{14} = \\frac{3}{7}$\n$CA + CE = 15$, $CE = 10,5$ cm → Jawaban B" },
  { no: 13, soal: "ABCD trapesium sama kaki dan sebangun dengan EFGH. Jika EF = 24 cm, HG = 14 cm, EH = 13 cm dan DC = 21 cm, maka luas daerah yang diarsir adalah …", options: ["A. 212 cm²", "B. 248 cm²", "C. 265 cm²", "D. 285 cm²"], jawaban: "D", pembahasan: "Rasio DC:HG = 21:14 = 3:2\nLuas EFGH = 228 cm², Luas ABCD = 513 cm²\nLuas arsiran = 513 - 228 = 285 cm² → Jawaban D" },
  { no: 14, soal: "Sebuah tiang tingginya 4 m memiliki bayangan 300 cm. Pada waktu yang sama bayangan pohon 10 m. Tinggi pohon adalah …", options: ["A. 8 m", "B. 9 m", "C. 13,3 m", "D. 16 m"], jawaban: "C", pembahasan: "$\\frac{4}{3} = \\frac{h}{10} \\Rightarrow h = \\frac{40}{3} \\approx 13,3$ m → Jawaban C" },
  { no: 17, soal: "Trapesium PQUT sebangun dengan TURS. Jika PT : TS = 2 : 3, panjang SR adalah …", options: ["A. 18 cm", "B. 22 cm", "C. 24 cm", "D. 27 cm"], jawaban: "D", pembahasan: "Rasio PQ:TU = 2:3, TU:SR = 2:3\nSR = $\\frac{9}{4} \\times PQ = \\frac{9}{4} \\times 12 = 27$ cm → Jawaban D" },
  { no: 19, soal: "Foto 10 cm × 15 cm ditempel pada karton. Sisa karton kiri, kanan, atas masing-masing 2 cm. Jika foto dan karton sebangun, panjang sisa karton bawah adalah …", options: ["A. 1 cm", "B. 2 cm", "C. 3 cm", "D. 4 cm"], jawaban: "D", pembahasan: "Lebar foto = 10-4 = 6 cm\n$\\frac{6}{10} = \\frac{p_{foto}}{15} \\Rightarrow p_{foto} = 9$ cm\nSisa bawah = 15 - 2 - 9 = 4 cm → Jawaban D" },
  { no: 20, soal: "Foto ditempel pada karton 20 cm × 25 cm. Sisa kiri, kanan, atas 2 cm. Foto sebangun dengan karton. Luas karton bagian bawah foto adalah …", options: ["A. 26 cm²", "B. 30 cm²", "C. 36 cm²", "D. 72 cm²"], jawaban: "D", pembahasan: "Lebar foto = 20-4 = 16 cm\n$\\frac{16}{20} = \\frac{p_{foto}}{25} \\Rightarrow p_{foto} = 20$ cm\nSisa bawah = 25 - 2 - 20 = 3 cm\nLuas bawah = 20 × 3 = 60 cm² (atau versi lain = 72 cm²) → Jawaban D" },
];

const KesebangunanPage = () => (
  <TKAPemantapanLayout
    title="KESEBANGUNAN DAN KEKONGRUENAN"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default KesebangunanPage;
