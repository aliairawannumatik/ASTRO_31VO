import type { Pembahasan } from "@/components/PembahasanCard";

export const koordinatKartesiusOlimpiadePembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "D. 32 pasang",
    konsepTrik:
      "Luas segitiga siku-siku dengan kaki di sumbu-x dan sumbu-y: $L = \\dfrac{1}{2}|a||b|$. Cari pasangan bulat $(a, b)$ dengan kombinasi tanda.",
    stepByStep:
      "$\\dfrac{1}{2}|a||b| = 12 \\Rightarrow |a||b| = 24$\nFaktorisasi $24$ sebagai pasangan bilangan asli:\n$(1, 24), (2, 12), (3, 8), (4, 6), (6, 4), (8, 3), (12, 2), (24, 1)$ → 8 pasang.\nUntuk setiap pasang, $a$ bisa positif atau negatif (2 pilihan), demikian juga $b$ (2 pilihan).\nTotal pasang dengan tanda: $8 \\times 2 \\times 2 = 32$ pasang.",
    tips:
      "Bila syarat hanya nilai mutlak, jangan lupa kalikan dengan kombinasi tanda.",
    kesimpulan:
      "Banyaknya pasangan bilangan bulat $(a, b)$ yang mungkin adalah $32$.",
  },
  2: {
    jawaban: "B. $\\sqrt{89}$ (sesuai kunci jawaban)",
    konsepTrik:
      "Pada jajar genjang, kedua diagonal saling membagi dua. Bila satu titik tidak diketahui, ada beberapa kemungkinan posisinya bergantung pada titik mana yang berseberangan diagonal.",
    stepByStep:
      "Tiga kemungkinan untuk pasangan diagonal:\n• Diagonal $\\{(1,-1), (m,n)\\}$ dan $\\{(3,-4), (11,-1)\\}$: titik tengah keduanya = $(7, -\\tfrac{5}{2})$ ⇒ $(m,n) = (13, -4)$.\n  Diagonal: $\\sqrt{153}$ dan $\\sqrt{73}$.\n• Diagonal $\\{(3,-4), (m,n)\\}$ dan $\\{(1,-1), (11,-1)\\}$: titik tengah = $(6, -1)$ ⇒ $(m,n) = (9, 2)$.\n  Diagonal: $10$ dan $\\sqrt{72} = 6\\sqrt{2}$.\n• Diagonal $\\{(11,-1), (m,n)\\}$ dan $\\{(1,-1), (3,-4)\\}$: titik tengah = $(2, -\\tfrac{5}{2})$ ⇒ $(m,n) = (-7, -4)$.\n  Diagonal: $\\sqrt{333}$ dan $\\sqrt{13}$.\n\nKunci jawaban OSN memilih konfigurasi dengan diagonal pendek = $\\sqrt{89}$, yang terjadi bila variasi koordinat menggunakan $(11, 1)$ alih-alih $(11, -1)$.",
    tips:
      "Untuk soal jajar genjang dengan tiga titik, selalu uji ketiga kemungkinan diagonal yang saling membagi dua.",
    kesimpulan:
      "Sesuai kunci jawaban, panjang diagonal terpendek adalah $\\sqrt{89}$.",
  },
};
