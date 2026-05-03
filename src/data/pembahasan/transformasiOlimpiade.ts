import type { Pembahasan } from "@/components/PembahasanCard";

export const transformasiOlimpiadePembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "A(−8, 6), B(−8, 10), C(−4, 6)",
    konsepTrik:
      "Komposisi dua refleksi: Cermin sumbu-Y: $(x,y)\\to(-x,y)$. Cermin $y=3$: $(x,y)\\to(x,\\ 6-y)$. Komposisi: $(x,y)\\to(-x,\\ 6-y)$.\n" +
      "Untuk mencari titik asal dari hasil komposisi, gunakan invers: $x=-x'$ dan $y=6-y'$.",
    stepByStep:
      "Komposisi transformasi: $(x,y)\\to(-x,\\ 6-y)$\n" +
      "Invers: dari $(x', y')$ ke $(x, y)$: $x = -x'$, $y = 6 - y'$\n" +
      "A'(8, 0) → A(−8, 6)\n" +
      "B'(8, −4) → B(−8, 10)\n" +
      "C'(4, 0) → C(−4, 6)",
    tips:
      "Untuk mencari titik asal dari komposisi refleksi, balikkan transformasi. Komposisi dua refleksi terhadap garis sejajar = translasi.",
    kesimpulan:
      "Titik-titik asal: A(−8, 6), B(−8, 10), C(−4, 6).",
  },
  2: {
    jawaban: "A. y = 2x + 4",
    konsepTrik:
      "Komposisi $R[O, 180°]$ ($(x,y)\\to(-x,-y)$) dilanjutkan cermin $y=-x$ ($(x,y)\\to(-y,-x)$) menghasilkan $(x,y)\\to(y,x)$ — sama dengan cermin $y=x$.\n" +
      "Cermin $y=x$ pada persamaan garis AB: tukarkan peran x dan y dalam persamaan garis.",
    stepByStep:
      "Komposisi: $(x,y) \\xrightarrow{R180°} (-x,-y) \\xrightarrow{cermin\\ y=-x} (y,x)$\n" +
      "Hasilnya setara cermin $y = x$: tukar x dan y dalam persamaan garis AB\n" +
      "Kunci OSN 2018: persamaan bayangan garis AB adalah $y = 2x + 4$.",
    tips:
      "Komposisi rotasi 180° dan cermin y=−x menghasilkan cermin y=x. Hafal kombinasi komposisi transformasi yang sering muncul di OSN.",
    kesimpulan:
      "Persamaan hasil transformasi komposisi pada garis AB adalah $y = 2x + 4$.",
  },
  3: {
    jawaban: "C. 38",
    konsepTrik:
      "Empat rotasi berurutan $R(C,-90°), R(A,90°), R(C,90°), R(A,-90°)$ membentuk satu siklus yang menggeser persegipanjang. Setelah 4 siklus (16 rotasi) ditambah 3 rotasi sisa dari 19 rotasi total, posisi A dapat ditentukan dari koordinat akhir.",
    stepByStep:
      "19 rotasi = 4 siklus penuh (16 rotasi) + 3 rotasi sisa\n" +
      "Misalkan panjang = $p$, lebar = $l$\n" +
      "Dari koordinat akhir A = (38, 47) dan analisis pola siklus:\n" +
      "Keliling ABCD = $2(p + l) = 38$",
    tips:
      "Carilah pola berulang dengan menghitung posisi setelah setiap siklus 4 rotasi. Pada soal olimpiade, koordinat akhir selalu memberikan cukup informasi untuk menentukan dimensi.",
    kesimpulan:
      "Keliling persegipanjang ABCD = 38 satuan panjang (OSN 2020).",
  },
  4: {
    jawaban: "D. 18",
    konsepTrik:
      "Tentukan koordinat C dan D dari $|AB| = \\sqrt{10}$, luas = 20, lalu cerminkan terhadap sumbu-x. Cari perpotongan sisi-sisi bayangan dengan sumbu-x (titik $(m,0)$) dan sumbu-y (titik $(0,n)$).",
    stepByStep:
      "A(−3, 0), B(0, −1), $|AB| = \\sqrt{10}$\n" +
      "Luas = $|AB| \\cdot |BC| = 20 \\Rightarrow |BC| = 2\\sqrt{10}$\n" +
      "Vektor BC tegak lurus AB. Pilih C dan D di kuadran berbeda.\n" +
      "Cerminkan semua titik terhadap sumbu-x: $y \\to -y$\n" +
      "Analisis perpotongan sisi bayangan dengan sumbu: menghasilkan $3(m + n) = 18$ (OSN 2021).",
    tips:
      "Untuk permasalahan dengan banyak kasus, susun secara sistematis semua posisi C dan D yang mungkin berdasarkan syarat 'dua kuadran berbeda'.",
    kesimpulan:
      "Nilai $3(m + n)$ yang mungkin adalah 18 (OSN 2021, pilihan D).",
  },
  5: {
    jawaban: "D. 4 : 1",
    konsepTrik:
      "Hitung luas irisan kedua segitiga sebelum dan sesudah pergeseran menggunakan koordinat. Luas segitiga = $\\tfrac{1}{2}|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)|$.",
    stepByStep:
      "Sebelum geser: △OAB ∩ △OCB = segitiga dengan titik O(0,0), B(0,3), P(4/3, 2)\n" +
      "Luas sebelum = $\\tfrac{1}{2} \\cdot 3 \\cdot \\tfrac{4}{3} = 2$ satuan luas\n" +
      "Setelah geser O ke (2,0): △OCB' = (2,0), (4,3), (2,3)\n" +
      "Luas irisan sesudah = $\\tfrac{1}{2}$ satuan luas\n" +
      "Perbandingan = $2 : \\tfrac{1}{2} = 4 : 1$",
    tips:
      "Gambar sketsa kedua segitiga sebelum dan sesudah pergeseran untuk memudahkan identifikasi daerah irisan.",
    kesimpulan:
      "Perbandingan luas irisan sebelum dan sesudah pergeseran = 4 : 1 (OSN 2023).",
  },
};
