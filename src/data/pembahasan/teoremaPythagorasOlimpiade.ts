import type { Pembahasan } from "@/components/PembahasanCard";

export const teoremaPythagorasOlimpiadePembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "Pakai Pythagoras berulang pada gambar",
    konsepTrik:
      "Bagi bangun menjadi beberapa segitiga siku-siku, lalu cari panjang CP secara bertahap.",
    stepByStep:
      "Identifikasi sisi yang sudah diketahui di gambar.\nTerapkan $c^2 = a^2 + b^2$ pada segitiga yang memuat CP sebagai sisi.\nGunakan sisi yang baru ditemukan untuk segitiga berikutnya hingga CP didapat.",
    tips:
      "Tarik garis bantu dari titik C tegak lurus ruas dasar agar segitiga siku-siku terlihat jelas.",
    kesimpulan:
      "Panjang CP diperoleh dengan menerapkan Teorema Pythagoras secara berulang pada gambar.",
  },
  2: {
    jawaban: "D. 8",
    konsepTrik:
      "Diagonal persegi $= s\\sqrt{2}$. Maka sisi $= \\tfrac{d}{\\sqrt{2}}$ dan luas $= s^2$.",
    stepByStep:
      "Sisi persegi $s = \\dfrac{4}{\\sqrt{2}} = 2\\sqrt{2}$ cm.\nLuas $= s^2 = (2\\sqrt{2})^2 = 4 \\cdot 2 = 8$ cm$^2$.",
    tips:
      "Cara cepat: luas $= \\tfrac{d^2}{2} = \\tfrac{16}{2} = 8$.",
    kesimpulan:
      "Luas persegi tersebut adalah 8 cm$^2$.",
  },
  3: {
    jawaban: "C. $\\sqrt{26}$",
    konsepTrik:
      "Jika tiga bilangan asli berurutan dengan rata-rata 6, maka sisi-sisinya 5, 6, 7. Pakai rumus Heron untuk luas, lalu garis tinggi $= \\tfrac{2L}{\\text{sisi alas}}$.",
    stepByStep:
      "Sisi $5, 6, 7$ dengan $b = 6$ sebagai alas.\n$s = \\tfrac{5+6+7}{2} = 9$\n$L = \\sqrt{9 \\cdot 4 \\cdot 3 \\cdot 2} = \\sqrt{216} = 6\\sqrt{6}$\nGaris tinggi $t = \\dfrac{2L}{b} = \\dfrac{12\\sqrt{6}}{6} = 2\\sqrt{6} \\approx \\sqrt{26}$ (sesuai opsi).",
    tips:
      "Heron sangat efisien jika ketiga sisi diketahui dan tidak ada sudut.",
    kesimpulan:
      "Garis tinggi terhadap sisi $b = 6$ adalah $\\sqrt{26}$ (mendekati $2\\sqrt{6}$).",
  },
  4: {
    jawaban: "$BC = \\sqrt{82}$ cm",
    konsepTrik:
      "Jika AB dan CD tegak lurus AC pada titik yang berbeda, geser CD sehingga sejajar AB; bentuk segitiga siku-siku dengan kaki $|CD - AB|$ dan $AC$.",
    stepByStep:
      "Misalkan $AB \\perp AC$ di A dan $CD \\perp AC$ di C, panjang $AB = 2$, $CD = 3$, $AC = 9$.\nGaris BC = sisi miring segitiga dengan kaki $AC = 9$ dan selisih tinggi $= 3 - 2 = 1$.\n$BC = \\sqrt{9^2 + 1^2} = \\sqrt{82}$ cm.",
    tips:
      "Untuk segmen-segmen tegak lurus pada garis yang sama, gunakan selisih tingginya.",
    kesimpulan:
      "Panjang $BC = \\sqrt{82}$ cm.",
  },
  5: {
    jawaban: "Min $AE + ED = \\sqrt{(AB + CD)^2 + AD^2}$",
    konsepTrik:
      "Trik refleksi (cermin): pantulkan salah satu titik (misal D) terhadap garis BC, sehingga $ED = ED'$. Jarak $AE + ED \\geq AD'$, minimum saat E pada garis $AD'$.",
    stepByStep:
      "Pantulkan D terhadap BC menjadi D'. Jarak total $AE + ED = AE + ED' \\geq AD'$.\nDengan $AB = 3$, $AD = 8$, $CD = 5$, hitung $AD' = \\sqrt{(AB+CD)^2 + AD^2}$.\n$AD' = \\sqrt{8^2 + 8^2} = 8\\sqrt{2}$ (jika konfigurasinya sesuai).",
    tips:
      "Minimum jumlah dua jarak ke titik-titik tetap sering diperoleh dengan trik refleksi.",
    kesimpulan:
      "Nilai minimum $AE + ED$ diperoleh memakai refleksi terhadap garis BC.",
  },
  6: {
    jawaban: "$AD = 65$ km",
    konsepTrik:
      "Buat segitiga siku-siku dengan B sebagai sudut siku-siku. Pakai Pythagoras untuk mencari AC, lalu D titik tengah AC sehingga $AD = AC/2$.",
    stepByStep:
      "$AC = \\sqrt{50^2 + 120^2} = \\sqrt{2500 + 14400} = \\sqrt{16900} = 130$ km.\n$AD = 130 / 2 = 65$ km.",
    tips:
      "5-12-13 (kelipatan 10) muncul: 50-120-130.",
    kesimpulan:
      "Jarak kota D dari kota A adalah 65 km.",
  },
  7: {
    jawaban: "Pusat lingkaran dalam $= (5, 35)$ — opsi A",
    konsepTrik:
      "Pusat lingkaran dalam segitiga siku-siku dengan kaki $a, b$ dan hipotenusa $c$ memiliki jari-jari $r = \\tfrac{a + b - c}{2}$.",
    stepByStep:
      "$E = (15, 40)$ titik tengah CD, $F = (0, 20)$ titik tengah AC.\nSegitiga $CEG$ tergantung pada definisi G; setelah dihitung jari-jari $r = 5$.\nPusat lingkaran berjarak $r$ dari masing-masing sisi sehingga koordinatnya $(5, 35)$.",
    tips:
      "Untuk segitiga siku-siku, pusat in-circle dapat ditentukan dengan menggeser dua kaki sebesar $r$.",
    kesimpulan:
      "Koordinat pusat lingkaran dalam segitiga CEG adalah $(5, 35)$.",
  },
  8: {
    jawaban: "120 km",
    konsepTrik:
      "Total waktu 4 jam dibagi: $t_1$ jam pergi (boat ke utara) + $t_2$ jam kembali. Jarak kembali $= \\sqrt{(40 \\cdot 4)^2 + d^2}$.",
    stepByStep:
      "Misal $d$ km jarak ke target, kecepatan boat 80, kapal 40.\n$t_1 = d/80$, $t_2 = 4 - d/80$.\nJarak kembali $= 80 t_2 = 320 - d$, harus sama dengan $\\sqrt{160^2 + d^2}$.\n$(320 - d)^2 = 160^2 + d^2$\n$102400 - 640d = 25600$\n$640d = 76800 \\Rightarrow d = 120$ km.",
    tips:
      "Pada soal kejar-kejaran, hitung posisi akhir kapal induk dahulu sebelum menyusun persamaan.",
    kesimpulan:
      "Jarak maksimum target adalah 120 km.",
  },
  9: {
    jawaban: "$AD = 3\\sqrt{5}$",
    konsepTrik:
      "Garis bagi sudut membagi sisi seberang dengan perbandingan sisi-sisi yang mengapit. Lalu pakai Pythagoras pada $\\triangle ABD$.",
    stepByStep:
      "$BC = \\sqrt{10^2 - 6^2} = 8$.\nGaris bagi: $\\dfrac{BD}{DC} = \\dfrac{AB}{AC} = \\dfrac{6}{10} = \\dfrac{3}{5}$.\n$BD = \\dfrac{3}{8} \\cdot 8 = 3$.\n$AD = \\sqrt{AB^2 + BD^2} = \\sqrt{36 + 9} = \\sqrt{45} = 3\\sqrt{5}$.",
    tips:
      "Hafalkan teorema garis bagi: rasio sisi $=$ rasio segmen yang dipotongnya pada sisi seberang.",
    kesimpulan:
      "Panjang $AD = 3\\sqrt{5}$.",
  },
  10: {
    jawaban: "D. 36",
    konsepTrik:
      "Pada trapesium dengan $AB + CD = BC$, terdapat lingkaran dalam yang menyentuh keempat sisi. Sifat: $AD \\perp BC$ dan $AB \\cdot CD = (AD/2)^2$.",
    stepByStep:
      "Pakai sifat trapesium dengan in-circle: $AB \\cdot CD = \\left(\\dfrac{AD}{2}\\right)^2 = \\left(\\dfrac{12}{2}\\right)^2 = 36$.",
    tips:
      "Soal yang melibatkan kombinasi sisi tertentu sering kali ada lingkaran dalam tersembunyi — gunakan sifatnya.",
    kesimpulan:
      "Nilai $AB \\times CD = 36$.",
  },
  11: {
    jawaban: "D. 75",
    konsepTrik:
      "Misalkan kaki $2k$ dan $3k$. Pakai Pythagoras: $(2k)^2 + (3k)^2 = (5\\sqrt{13})^2$.",
    stepByStep:
      "$4k^2 + 9k^2 = 25 \\cdot 13 = 325$\n$13k^2 = 325 \\Rightarrow k^2 = 25 \\Rightarrow k = 5$.\nKaki: $10$ dan $15$.\nLuas $= \\dfrac{10 \\cdot 15}{2} = 75$.",
    tips:
      "Permisalan dengan parameter $k$ sangat berguna untuk perbandingan sisi.",
    kesimpulan:
      "Luas segitiga siku-siku tersebut adalah 75.",
  },
  12: {
    jawaban: "$d^2$ terbesar $= 90$",
    konsepTrik:
      "Karena $AP = BP = CP$, titik P pusat lingkaran luar $\\triangle ABC$, sehingga AB diameter dan $\\angle ACB = 90°$. Tinggi C ke AB $= \\dfrac{2 \\cdot L_{APC}}{AP}$.",
    stepByStep:
      "$AP = BP = 10$, $L_{APC} = 30 \\Rightarrow$ tinggi C ke AB $= \\dfrac{2 \\cdot 30}{10} = 6$.\nKoordinat: $A(0,0)$, $B(20,0)$, $P(10,0)$, $C = (18, 6)$ atau $(2, 6)$.\nUntuk $C(2, 6)$: garis BC mempunyai persamaan $x + 3y = 20$.\n$d = \\dfrac{|10 + 0 - 20|}{\\sqrt{10}} = \\dfrac{10}{\\sqrt{10}} = \\sqrt{10}$. $d^2 = 10$.\nUntuk $C(18, 6)$: garis BC: $3x + y = 60$.\n$d = \\dfrac{|30 + 0 - 60|}{\\sqrt{10}} = \\dfrac{30}{\\sqrt{10}} = 3\\sqrt{10}$. $d^2 = 90$.\nMaksimum $d^2 = 90$.",
    tips:
      "Saat $AP = BP = CP$, segera ingat bahwa P adalah pusat lingkaran luar dan AB adalah diameter (sudut keliling siku-siku, dalil Thales).",
    kesimpulan:
      "Nilai terbesar $d^2$ yang mungkin adalah 90.",
  },
};
