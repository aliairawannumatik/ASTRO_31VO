import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";
import { getTkaContohSoal } from "@/data/tkaContohSoal";
import { latihanDasar as olimpiadeHimpunan } from "@/pages/OlimpiadeHimpunanPage";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Himpunan", content: `Himpunan adalah kumpulan objek yang terdefinisi dengan jelas.\n\nCara menyatakan himpunan:\n1. Dengan kata-kata: "Himpunan bilangan genap"\n2. Dengan notasi pembentuk himpunan: $A = \\{x | x$ bilangan genap$\\}$\n3. Dengan mendaftar anggotanya: $A = \\{2, 4, 6, 8, ...\\}$` },
  { heading: "B. Jenis-jenis Himpunan", content: `- Himpunan kosong ($\\emptyset$ atau $\\{\\}$): tidak memiliki anggota\n- Himpunan semesta (S atau U): memuat semua anggota yang dibicarakan\n- Himpunan berhingga: jumlah anggota dapat dihitung\n- Himpunan tak berhingga: jumlah anggota tidak dapat dihitung\n- Himpunan sama: memiliki anggota yang tepat sama\n- Himpunan ekuivalen: memiliki jumlah anggota yang sama` },
  { heading: "C. Operasi Himpunan", content: `1. Gabungan (Union): $A \\cup B = \\{x | x \\in A$ atau $x \\in B\\}$\n   Rumus: $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$\n\n2. Irisan (Intersection): $A \\cap B = \\{x | x \\in A$ dan $x \\in B\\}$\n\n3. Selisih (Difference): $A - B = \\{x | x \\in A$ dan $x \\notin B\\}$\n\n4. Komplemen: $A^c = \\{x | x \\in S$ dan $x \\notin A\\}$\n\n5. Hukum De Morgan:\n   $(A \\cup B)^c = A^c \\cap B^c$\n   $(A \\cap B)^c = A^c \\cup B^c$` },
  { heading: "D. Diagram Venn", content: `Diagram Venn digunakan untuk menyatakan hubungan antar himpunan secara visual.\n\nRumus kardinalitas untuk tiga himpunan:\n$n(A \\cup B \\cup C) = n(A) + n(B) + n(C) - n(A \\cap B) - n(A \\cap C) - n(B \\cap C) + n(A \\cap B \\cap C)$` },
];

const latihanDasar: LatihanSoal[] = olimpiadeHimpunan.map((item) => ({
  no: item.no,
  soal: item.soal,
  image: item.image,
  options: item.options,
  jawaban: item.jawaban,
  pembahasan: typeof item.pembahasan === "string" ? item.pembahasan : item.pembahasan ? [item.pembahasan.konsep, ...item.pembahasan.langkah, item.pembahasan.rumus].filter(Boolean).join("\n") : "",
}));

const HimpunanPage = () => (
  <TKAPemantapanLayout
    title="HIMPUNAN"
    materiSections={materiSections}
    contohSoal={getTkaContohSoal("himpunan")}
  latihanDasar={latihanDasar}
  />
);

export default HimpunanPage;
