import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Translasi (Pergeseran)", content: `Translasi $T\\begin{pmatrix}a\\\\b\\end{pmatrix}$ menggeser titik $(x, y)$ menjadi $(x+a, y+b)$.\n\nJika titik $P(x, y)$ ditranslasi oleh $T\\begin{pmatrix}a\\\\b\\end{pmatrix}$ maka bayangan $P' = (x+a, y+b)$.` },
  { heading: "B. Refleksi (Pencerminan)", content: `Pencerminan (Refleksi) terhadap:\n\n1. Sumbu-x: $(x, y) \\to (x, -y)$\n2. Sumbu-y: $(x, y) \\to (-x, y)$\n3. Garis $y = x$: $(x, y) \\to (y, x)$\n4. Garis $y = -x$: $(x, y) \\to (-y, -x)$\n5. Titik asal O(0,0): $(x, y) \\to (-x, -y)$\n6. Garis $x = a$: $(x, y) \\to (2a-x, y)$\n7. Garis $y = b$: $(x, y) \\to (x, 2b-y)$` },
  { heading: "C. Rotasi (Perputaran)", content: `Rotasi terhadap pusat O(0,0) sebesar sudut $\\theta$:\n\n- $90°$ berlawanan jarum jam: $(x, y) \\to (-y, x)$\n- $90°$ searah jarum jam: $(x, y) \\to (y, -x)$\n- $180°$: $(x, y) \\to (-x, -y)$\n- $270°$ berlawanan jarum jam (= $90°$ searah): $(x, y) \\to (y, -x)$\n\nRotasi terhadap pusat $P(a, b)$ sebesar $90°$ berlawanan jarum jam:\n$(x, y) \\to (a - (y-b), b + (x-a)) = (a-y+b, b+x-a)$` },
  { heading: "D. Dilatasi", content: `Dilatasi dengan pusat $O(0,0)$ dan faktor skala $k$:\n$(x, y) \\to (kx, ky)$\n\nDilatasi dengan pusat $P(a, b)$ dan faktor skala $k$:\n$(x, y) \\to (a + k(x-a),\\ b + k(y-b))$\n\nSifat dilatasi:\n- Jika $|k| > 1$: diperbesar\n- Jika $0 < |k| < 1$: diperkecil\n- Jika $k < 0$: terjadi pembesaran/perkecilan dan pembalikan arah` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Bayangan titik $P(3, -5)$ yang ditranslasi oleh $\\begin{pmatrix} -4 \\\\ 7 \\end{pmatrix}$ adalah ...", options: ["A. P'(-7, -2)", "B. P'(-1, 2)", "C. P'(-1, -12)", "D. P'(7, -12)"], jawaban: "B", pembahasan: "$P' = (3 + (-4),\\ -5 + 7) = (-1, 2)$ → Jawaban B" },
  { no: 2, soal: "Titik $A(-3, 5)$ ditranslasi sehingga bayangannya $A'(1, 3)$. Translasi tersebut adalah ...", options: ["A. $\\begin{pmatrix}4\\\\-2\\end{pmatrix}$", "B. $\\begin{pmatrix}-4\\\\2\\end{pmatrix}$", "C. $\\begin{pmatrix}2\\\\-4\\end{pmatrix}$", "D. $\\begin{pmatrix}-2\\\\4\\end{pmatrix}$"], jawaban: "A", pembahasan: "$a = 1 - (-3) = 4$, $b = 3 - 5 = -2$\nTranslasi $\\begin{pmatrix}4\\\\-2\\end{pmatrix}$ → Jawaban A" },
  { no: 3, soal: "Bayangan titik $Q(6, -2)$ dicerminkan terhadap sumbu-x adalah ...", options: ["A. Q'(-6, 2)", "B. Q'(6, 2)", "C. Q'(-6, -2)", "D. Q'(-2, 6)"], jawaban: "B", pembahasan: "Refleksi terhadap sumbu-x: $(x,y) \\to (x,-y)$\n$Q' = (6, 2)$ → Jawaban B" },
  { no: 4, soal: "Bayangan titik $R(-4, 3)$ dicerminkan terhadap garis $y = x$ adalah ...", options: ["A. R'(4, -3)", "B. R'(3, -4)", "C. R'(-3, 4)", "D. R'(3, 4)"], jawaban: "B", pembahasan: "Refleksi terhadap $y=x$: $(x,y) \\to (y,x)$\n$R' = (3, -4)$ → Jawaban B" },
  { no: 5, soal: "Bayangan titik $S(2, 5)$ dicerminkan terhadap garis $y = -x$ adalah ...", options: ["A. S'(-5, -2)", "B. S'(5, 2)", "C. S'(-2, -5)", "D. S'(2, -5)"], jawaban: "A", pembahasan: "Refleksi terhadap $y=-x$: $(x,y) \\to (-y,-x)$\n$S' = (-5, -2)$ → Jawaban A" },
  { no: 6, soal: "Titik $A(2, 5)$ dirotasikan $90°$ berlawanan arah jarum jam terhadap titik pusat $O(0,0)$. Bayangan titik A adalah ...", options: ["A. A'(-5, 2)", "B. A'(5, -2)", "C. A'(2, -5)", "D. A'(-2, 5)"], jawaban: "A", pembahasan: "Rotasi $90°$ BAJJ terhadap O: $(x,y) \\to (-y, x)$\n$A' = (-5, 2)$ → Jawaban A" },
  { no: 7, soal: "Titik $B(-3, 4)$ dirotasikan $180°$ terhadap titik pusat $O(0,0)$. Bayangan titik B adalah ...", options: ["A. B'(-3, -4)", "B. B'(3, -4)", "C. B'(-4, -3)", "D. B'(4, 3)"], jawaban: "B", pembahasan: "Rotasi $180°$: $(x,y) \\to (-x,-y)$\n$B' = (3, -4)$ → Jawaban B" },
  { no: 8, soal: "Titik $C(4, -3)$ didilatasikan dengan pusat $O(0,0)$ dan faktor skala $k = -2$. Bayangan titik C adalah ...", options: ["A. C'(-8, 6)", "B. C'(8, -6)", "C. C'(-8, -6)", "D. C'(8, 6)"], jawaban: "A", pembahasan: "Dilatasi: $(kx, ky) = (-2 \\cdot 4,\\ -2 \\cdot (-3)) = (-8, 6)$ → Jawaban A" },
  { no: 9, soal: "Segitiga ABC dengan $A(1,2)$, $B(3,2)$, $C(2,4)$ didilatasikan dengan pusat $O(0,0)$ dan faktor skala 3. Luas bayangan segitiga tersebut adalah ...", options: ["A. 3 satuan luas", "B. 6 satuan luas", "C. 9 satuan luas", "D. 18 satuan luas"], jawaban: "D", pembahasan: "Luas segitiga ABC = $\\frac{1}{2}|1(2-4)+3(4-2)+2(2-2)| = \\frac{1}{2}|{-2+6}| = 2$ satuan luas\nLuas bayangan = $k^2 \\times$ luas asal $= 9 \\times 2 = 18$ satuan luas → Jawaban D" },
  { no: 10, soal: "Titik $P(3, 5)$ dicerminkan terhadap garis $x = 2$. Bayangan titik P adalah ...", options: ["A. P'(-1, 5)", "B. P'(1, 5)", "C. P'(3, -1)", "D. P'(3, 1)"], jawaban: "B", pembahasan: "Refleksi terhadap $x = a$: $(x,y) \\to (2a-x, y)$\n$P' = (2 \\cdot 2 - 3, 5) = (1, 5)$ → Jawaban B" },
  { no: 11, soal: "Titik $Q(4, -2)$ dicerminkan terhadap garis $y = 3$. Bayangan titik Q adalah ...", options: ["A. Q'(-4, 8)", "B. Q'(4, 8)", "C. Q'(4, -8)", "D. Q'(4, 2)"], jawaban: "B", pembahasan: "Refleksi terhadap $y = b$: $(x,y) \\to (x, 2b-y)$\n$Q' = (4, 2\\cdot3-(-2)) = (4, 8)$ → Jawaban B" },
  { no: 12, soal: "Jika titik $A(x, y)$ dicerminkan terhadap titik asal kemudian hasilnya ditranslasi $\\begin{pmatrix}3\\\\-2\\end{pmatrix}$ menghasilkan $A''(5, 1)$, maka koordinat titik $A$ adalah ...", options: ["A. (-2, 3)", "B. (2, -3)", "C. (2, 3)", "D. (-2, -3)"], jawaban: "A", pembahasan: "Refleksi terhadap O: $(x,y) \\to (-x,-y)$\nTranslasi: $(-x+3, -y-2) = (5, 1)$\n$-x+3 = 5 \\Rightarrow x = -2$\n$-y-2 = 1 \\Rightarrow y = -3$ → Titik $A(-2, -3)$ → Jawaban D" },
  { no: 13, soal: "Garis $y = 2x - 1$ dicerminkan terhadap sumbu-y. Persamaan bayangannya adalah ...", options: ["A. $y = 2x + 1$", "B. $y = -2x - 1$", "C. $y = -2x + 1$", "D. $y = 2x - 1$"], jawaban: "B", pembahasan: "Refleksi terhadap sumbu-y: $(x,y) \\to (-x,y)$\nGanti $x$ dengan $-x$: $y = 2(-x) - 1 = -2x - 1$ → Jawaban B" },
  { no: 14, soal: "Titik $A(-1, 2)$ dirotasikan $90°$ searah jarum jam terhadap pusat $O$. Bayangannya adalah ...", options: ["A. A'(2, 1)", "B. A'(-2, -1)", "C. A'(2, -1)", "D. A'(-2, 1)"], jawaban: "A", pembahasan: "Rotasi $90°$ SJJ (searah jarum jam): $(x,y) \\to (y,-x)$\n$A' = (2, -(-1)) = (2, 1)$ → Jawaban A" },
  { no: 15, soal: "Segitiga dengan titik-titik $A(0,0)$, $B(4,0)$, $C(0,3)$ didilatasikan dengan pusat $(0,0)$ dan faktor skala $\\frac{1}{2}$. Luas bayangan segitiga adalah ...", options: ["A. 1,5 satuan luas", "B. 3 satuan luas", "C. 6 satuan luas", "D. 12 satuan luas"], jawaban: "B", pembahasan: "Luas asal = $\\frac{1}{2} \\times 4 \\times 3 = 6$\nLuas bayangan = $k^2 \\times 6 = \\frac{1}{4} \\times 6 = 1,5$\nJawaban A" },
];

const TransformasiPage = () => (
  <TKAPemantapanLayout
    title="TRANSFORMASI GEOMETRI"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default TransformasiPage;
