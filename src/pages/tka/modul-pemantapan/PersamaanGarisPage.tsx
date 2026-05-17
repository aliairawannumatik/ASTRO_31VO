import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Gradien (Kemiringan) Garis", content: `Gradien (m) menyatakan kemiringan garis lurus.\n\n1. Dari dua titik $(x_1, y_1)$ dan $(x_2, y_2)$:\n$m = \\dfrac{y_2 - y_1}{x_2 - x_1}$\n\n2. Dari persamaan $y = mx + c$: gradien = m\n\n3. Dari persamaan $ax + by + c = 0$:\n$m = -\\dfrac{a}{b}$\n\nCatatan:\n- Garis naik (kiri ke kanan): m > 0\n- Garis turun (kiri ke kanan): m < 0\n- Garis mendatar: m = 0\n- Garis tegak: m tidak terdefinisi` },
  { heading: "B. Persamaan Garis Lurus", content: `Bentuk-bentuk persamaan garis lurus:\n\n1. Bentuk slope-intercept: $y = mx + c$\n   (m = gradien, c = intersep-y)\n\n2. Bentuk umum: $ax + by + c = 0$\n\n3. Melalui titik $(x_1, y_1)$ dan gradien m:\n$y - y_1 = m(x - x_1)$\n\n4. Melalui dua titik $(x_1, y_1)$ dan $(x_2, y_2)$:\n$\\dfrac{y - y_1}{y_2 - y_1} = \\dfrac{x - x_1}{x_2 - x_1}$\n\n5. Intersep-x dan intersep-y:\n$\\dfrac{x}{a} + \\dfrac{y}{b} = 1$` },
  { heading: "C. Kedudukan Dua Garis", content: `Dua garis $y = m_1x + c_1$ dan $y = m_2x + c_2$:\n\n1. Sejajar: $m_1 = m_2$ dan $c_1 \\neq c_2$\n2. Berimpit: $m_1 = m_2$ dan $c_1 = c_2$\n3. Berpotongan: $m_1 \\neq m_2$\n4. Tegak lurus: $m_1 \\times m_2 = -1$` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Gradien garis yang melalui titik $(2, 3)$ dan $(5, 9)$ adalah …", options: ["A. -2", "B. 1", "C. 2", "D. 3"], jawaban: "C", pembahasan: "$m = \\frac{9-3}{5-2} = \\frac{6}{3} = 2$ → Jawaban C" },
  { no: 2, soal: "Gradien garis $3x - 4y + 12 = 0$ adalah …", options: ["A. $-\\frac{3}{4}$", "B. $\\frac{3}{4}$", "C. $-\\frac{4}{3}$", "D. $\\frac{4}{3}$"], jawaban: "B", pembahasan: "$m = -\\frac{3}{-4} = \\frac{3}{4}$ → Jawaban B" },
  { no: 3, soal: "Persamaan garis dengan gradien 2 dan melalui titik $(1, 3)$ adalah …", options: ["A. $y = 2x - 1$", "B. $y = 2x + 1$", "C. $y = 2x + 3$", "D. $y = 2x - 3$"], jawaban: "B", pembahasan: "$y - 3 = 2(x-1) \\Rightarrow y = 2x+1$ → Jawaban B" },
  { no: 4, soal: "Persamaan garis yang melalui titik $(3, -2)$ dan $(-1, 6)$ adalah …", options: ["A. $y = -2x + 4$", "B. $y = 2x - 8$", "C. $y = -2x - 4$", "D. $y = 2x + 4$"], jawaban: "A", pembahasan: "$m = \\frac{6-(-2)}{-1-3} = \\frac{8}{-4} = -2$\n$y-(-2) = -2(x-3) \\Rightarrow y+2=-2x+6 \\Rightarrow y=-2x+4$ → Jawaban A" },
  { no: 5, soal: "Persamaan garis yang sejajar dengan $y = 3x - 5$ dan melalui titik $(2, 4)$ adalah …", options: ["A. $y = 3x - 2$", "B. $y = 3x + 2$", "C. $y = 3x - 5$", "D. $y = 3x + 5$"], jawaban: "A", pembahasan: "Gradien sama = 3\n$y - 4 = 3(x-2) \\Rightarrow y = 3x-2$ → Jawaban A" },
  { no: 6, soal: "Persamaan garis yang tegak lurus $y = 2x + 1$ dan melalui titik $(4, 1)$ adalah …", options: ["A. $y = -\\frac{1}{2}x + 3$", "B. $y = \\frac{1}{2}x - 1$", "C. $y = -\\frac{1}{2}x - 3$", "D. $y = 2x - 7$"], jawaban: "A", pembahasan: "Gradien garis tegak lurus = $-\\frac{1}{2}$\n$y-1 = -\\frac{1}{2}(x-4) \\Rightarrow y = -\\frac{1}{2}x + 3$ → Jawaban A" },
  { no: 7, soal: "Titik potong garis $2x + 3y = 12$ dengan sumbu-x adalah …", options: ["A. $(4, 0)$", "B. $(6, 0)$", "C. $(0, 4)$", "D. $(0, 6)$"], jawaban: "B", pembahasan: "Saat y=0: $2x=12 \\Rightarrow x=6$\nTitik potong = (6, 0) → Jawaban B" },
  { no: 8, soal: "Titik potong garis $3x - y = 9$ dengan sumbu-y adalah …", options: ["A. $(0, 9)$", "B. $(0, -9)$", "C. $(3, 0)$", "D. $(-3, 0)$"], jawaban: "B", pembahasan: "Saat x=0: $-y=9 \\Rightarrow y=-9$\nTitik potong = (0, -9) → Jawaban B" },
  { no: 9, soal: "Dua garis: $L_1: y = 3x + 2$ dan $L_2: y = 3x - 4$. Kedudukan kedua garis adalah …", options: ["A. Sejajar", "B. Berimpit", "C. Berpotongan", "D. Tegak lurus"], jawaban: "A", pembahasan: "$m_1 = m_2 = 3$, $c_1 \\neq c_2$ → sejajar → Jawaban A" },
  { no: 10, soal: "Garis $g: y = 4x - 3$ dan garis $h: 4x - 2y + 1 = 0$. Kedudukan g dan h adalah …", options: ["A. Sejajar", "B. Tegak lurus", "C. Berimpit", "D. Berpotongan"], jawaban: "A", pembahasan: "Gradien h: $m = \\frac{4}{2} = 2$, gradien g = 4\n$m_g \\neq m_h$ → berpotongan → Jawaban D" },
  { no: 11, soal: "Jika garis $ax + 4y + 1 = 0$ dan $6x - 2y + 3 = 0$ saling tegak lurus, nilai a adalah …", options: ["A. $-3$", "B. $\\frac{4}{3}$", "C. $\\frac{3}{4}$", "D. $3$"], jawaban: "B", pembahasan: "$m_1 = -\\frac{a}{4}$, $m_2 = 3$\n$m_1 \\times m_2 = -1: -\\frac{a}{4} \\times 3 = -1 \\Rightarrow a = \\frac{4}{3}$ → Jawaban B" },
  { no: 12, soal: "Titik potong garis $2x + y = 8$ dan $x - 3y = -3$ adalah …", options: ["A. $(3, 2)$", "B. $(4, 0)$", "C. $(0, 1)$", "D. $(2, 4)$"], jawaban: "A", pembahasan: "Dari garis 2: $x = 3y-3$\nSubstitusi: $2(3y-3)+y = 8 \\Rightarrow 7y=14 \\Rightarrow y=2$, $x=3$\nTitik = (3, 2) → Jawaban A" },
  { no: 13, soal: "Persamaan garis yang melalui $(0, 3)$ dan sejajar sumbu-x adalah …", options: ["A. $x = 3$", "B. $y = 3$", "C. $x = 0$", "D. $y = 0$"], jawaban: "B", pembahasan: "Sejajar sumbu-x → m = 0 → $y = 3$ → Jawaban B" },
  { no: 14, soal: "Persamaan garis yang melalui $(-2, 5)$ dan tegak lurus sumbu-x adalah …", options: ["A. $y = 5$", "B. $x = -2$", "C. $y = -2$", "D. $x = 5$"], jawaban: "B", pembahasan: "Tegak lurus sumbu-x → garis vertikal → $x = -2$ → Jawaban B" },
  { no: 15, soal: "Garis $\\frac{x}{4} + \\frac{y}{6} = 1$ memiliki intersep-x dan intersep-y berturut-turut …", options: ["A. 4 dan 6", "B. 6 dan 4", "C. -4 dan 6", "D. 4 dan -6"], jawaban: "A", pembahasan: "Dari bentuk $\\frac{x}{a} + \\frac{y}{b} = 1$: intersep-x = 4, intersep-y = 6 → Jawaban A" },
];

const PersamaanGarisPage = () => (
  <TKAPemantapanLayout
    title="PERSAMAAN GARIS LURUS"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default PersamaanGarisPage;
