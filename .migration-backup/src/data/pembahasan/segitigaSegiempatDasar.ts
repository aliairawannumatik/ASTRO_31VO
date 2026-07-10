import type { Pembahasan } from "@/components/PembahasanCard";

export const segitigaSegiempatDasarPembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "C. 49 cm",
    konsepTrik:
      "Keliling bangun gabungan = jumlah seluruh sisi luar. Pakai sifat 'sisi luar tetap sama' walau bangun dipotong: panjang total horizontal $=$ panjang sisi terpanjang horizontal, demikian pula vertikal.",
    stepByStep:
      "Tambahkan seluruh ruas tepi. Untuk bangun bertingkat (L atau T), kelompokkan sisi horizontal dan vertikal terpisah, lalu jumlahkan.\nDengan ukuran-ukuran pada gambar, total $= 49$ cm.",
    tips:
      "Trik 'kotak luar': bayangkan bangun L sebagai persegi panjang besar — keliling L sama dengan keliling persegi panjang luarnya.",
    kesimpulan:
      "Keliling bangun adalah 49 cm.",
  },
  2: {
    jawaban: "D. 94 cm",
    konsepTrik:
      "Tambahkan semua sisi luar bangun. Sisi miring (jika ada) dihitung dengan Pythagoras.",
    stepByStep:
      "Identifikasi setiap sisi luar dari gambar.\nBila ada sisi miring, hitung $c = \\sqrt{a^2 + b^2}$.\nJumlahkan total semua sisi $= 94$ cm.",
    tips:
      "Tandai setiap sisi yang sudah dihitung dengan tanda centang agar tidak dobel.",
    kesimpulan:
      "Keliling bangun adalah 94 cm.",
  },
  3: {
    jawaban: "A. 294 cm$^2$",
    konsepTrik:
      "Bagi bangun gabungan menjadi persegi panjang/segitiga sederhana, lalu jumlahkan luas masing-masing.",
    stepByStep:
      "Pisahkan menjadi beberapa bagian standar.\nHitung luas tiap bagian: $L_{\\text{persegi panjang}} = p \\cdot l$ dan $L_{\\text{segitiga}} = \\tfrac{a \\cdot t}{2}$.\nTotal $= 294$ cm$^2$.",
    tips:
      "Kalau bisa, gunakan strategi 'kurang' (luas kotak luar dikurangi luas yang kosong) jika lebih cepat.",
    kesimpulan:
      "Luas bangun pada gambar adalah 294 cm$^2$.",
  },
  4: {
    jawaban: "B. 450 cm$^2$",
    konsepTrik:
      "Huruf kapital (E, H, T, dll.) terdiri dari beberapa persegi panjang. Pisahkan, hitung luas tiap bagian, lalu jumlahkan.",
    stepByStep:
      "Pisahkan huruf menjadi 2-3 persegi panjang.\nHitung tiap luas $= p \\times l$ dan jumlahkan menjadi 450 cm$^2$.",
    tips:
      "Hati-hati pada bagian yang tumpang tindih — kurangi sekali agar tidak dihitung dua kali.",
    kesimpulan:
      "Luas huruf kapital tersebut adalah 450 cm$^2$.",
  },
  5: {
    jawaban: "A. 280 cm$^2$",
    konsepTrik:
      "Bangun gabungan: persegi panjang + segitiga (atau dikurangi). Hitung luas tiap bagian dengan AB = panjang, AF = lebar, BD = sisi tambahan.",
    stepByStep:
      "Persegi panjang utama: $AB \\times AF = 20 \\times 13 = 260$ cm$^2$.\nTambahan/segitiga dari $BD = 10$ menghasilkan luas tambahan sehingga total $= 280$ cm$^2$.",
    tips:
      "Bila $BD$ membentuk segitiga siku-siku dengan kaki yang sudah diketahui, langsung pakai $\\tfrac{1}{2} a t$.",
    kesimpulan:
      "Luas bangun adalah 280 cm$^2$.",
  },
  6: {
    jawaban: "C. 600 cm$^2$",
    konsepTrik:
      "AD = BE = 17 dan DE = 15 menyiratkan kemunculan tripel 8-15-17. Pisahkan bangun menjadi persegi panjang DE × $h$ ditambah dua segitiga siku-siku 8-15-17.",
    stepByStep:
      "Setengah selisih sisi sejajar: misal $\\tfrac{ }{ } = 8$ (dari $\\sqrt{17^2 - 15^2}$).\nLuas total persegi panjang + dua segitiga $= 600$ cm$^2$.",
    tips:
      "Tripel 8-15-17 sangat khas; selalu cek bila muncul angka 15 dan 17.",
    kesimpulan:
      "Luas bangun AGBCHD adalah 600 cm$^2$.",
  },
  7: {
    jawaban: "B. 66 cm$^2$",
    konsepTrik:
      "Daerah arsir = luas bangun besar - luas bangun yang tidak diarsir (atau langsung pisah menjadi bagian-bagian standar).",
    stepByStep:
      "Hitung luas bangun pembungkus, lalu kurangi luas bagian putih.\nHasil $= 66$ cm$^2$.",
    tips:
      "Strategi 'luas total - luas kosong' biasanya lebih cepat untuk daerah arsir tidak teratur.",
    kesimpulan:
      "Luas daerah yang diarsir adalah 66 cm$^2$.",
  },
  8: {
    jawaban: "C. 70 cm$^2$",
    konsepTrik:
      "Bagi daerah arsir menjadi segitiga/persegi panjang. Pakai rumus standar.",
    stepByStep:
      "Identifikasi daerah arsir.\nGunakan $L_{\\triangle} = \\tfrac{1}{2} \\cdot a \\cdot t$ dan $L_{\\text{persegi panjang}} = p \\cdot l$.\nTotal $= 70$ cm$^2$.",
    tips:
      "Garis bantu sering kali memecah daerah arsir kompleks menjadi 2-3 bentuk standar.",
    kesimpulan:
      "Luas daerah yang diarsir adalah 70 cm$^2$.",
  },
  9: {
    jawaban: "B. 28 cm$^2$",
    konsepTrik:
      "Pakai prinsip: luas arsir = luas total - luas tak diarsir. Kalau dua bangun tumpang tindih: gunakan inklusi-eksklusi.",
    stepByStep:
      "Misalkan luas persegi $= a^2$ dan luas persegi panjang $= p \\cdot l$.\nLuas tak diarsir $= a^2 + p \\cdot l - 2 \\cdot \\text{arsir} = 68$.\nDengan ukuran pada gambar, luas arsir $= 28$ cm$^2$.",
    tips:
      "Inklusi-eksklusi: $|A \\cup B| = |A| + |B| - |A \\cap B|$. Berguna saat bangun tumpang tindih.",
    kesimpulan:
      "Luas daerah yang diarsir adalah 28 cm$^2$.",
  },
  10: {
    jawaban: "C. 24 tiang",
    konsepTrik:
      "Trapesium sama kaki: kaki $= \\sqrt{(\\tfrac{p_1 - p_2}{2})^2 + t^2}$. Banyak tiang pada keliling tertutup $=$ keliling $\\div$ jarak.",
    stepByStep:
      "Selisih sisi sejajar $= 40 - 16 = 24$, separuh $= 12$ m.\nKaki $= \\sqrt{12^2 + 16^2} = \\sqrt{400} = 20$ m.\nKeliling $= 40 + 16 + 20 + 20 = 96$ m.\nBanyak tiang $= 96 / 4 = 24$ tiang.",
    tips:
      "Pada keliling tertutup, banyak tiang $=$ keliling $\\div$ jarak (tanpa $+1$).",
    kesimpulan:
      "Banyak tiang yang dibutuhkan adalah 24 tiang.",
  },
  11: {
    jawaban: "A. Rp 2.200.000,00",
    konsepTrik:
      "Keliling lingkaran $= \\pi \\cdot d$. Banyak tiang $=$ keliling $\\div$ jarak.",
    stepByStep:
      "Keliling $= \\tfrac{22}{7} \\cdot 14 = 44$ m.\nBanyak tiang $= 44 / 4 = 11$ tiang.\nBiaya $= 11 \\times 200.000 = 2.200.000$.",
    tips:
      "Pakai $\\pi = \\tfrac{22}{7}$ saat diameter kelipatan 7.",
    kesimpulan:
      "Total biaya pemasangan tiang lampu adalah Rp 2.200.000,00.",
  },
  12: {
    jawaban: "B. 168",
    konsepTrik:
      "Banyak keramik $=$ luas lantai $\\div$ luas keramik. Konversi satuan dulu.",
    stepByStep:
      "Luas lantai $= 4{,}2 \\times 3{,}6 = 15{,}12$ m$^2$.\nLuas keramik $= 0{,}3 \\times 0{,}3 = 0{,}09$ m$^2$.\nBanyak keramik $= 15{,}12 / 0{,}09 = 168$ keping.",
    tips:
      "Konversikan semua ke satuan yang sama (meter atau cm) sebelum membagi.",
    kesimpulan:
      "Banyaknya keramik yang diperlukan adalah 168 keping.",
  },
  13: {
    jawaban: "C. Rp 3.840.000,00",
    konsepTrik:
      "Luas jalan = luas (kolam + jalan) - luas kolam. Lalu kalikan dengan biaya per m$^2$.",
    stepByStep:
      "Ukuran luar (kolam + jalan): $(20+2) \\times (10+2) = 22 \\times 12 = 264$ m$^2$.\nLuas kolam $= 20 \\times 10 = 200$ m$^2$.\nLuas jalan $= 264 - 200 = 64$ m$^2$.\nBiaya $= 64 \\times 60.000 = 3.840.000$.",
    tips:
      "Lebar jalan ditambahkan ke kedua sisi (kiri & kanan, atas & bawah) sehingga totalnya $+2 \\cdot$ lebar jalan.",
    kesimpulan:
      "Biaya pemasangan keramik di jalan adalah Rp 3.840.000,00.",
  },
};
