import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Zap, Calculator, AlertTriangle, Layers } from "lucide-react";
import FactorTreeAnimation from "@/components/FactorTreeAnimation";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const KPKFPBPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(["kelipatan", "faktor", "faktorisasi", "contoh-kpk", "contoh-fpb", "aplikasi"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const translations = {
    id: {
      title: "KPK DAN FPB",
      subtitle: "Kelas 7 - Bilangan Bulat - Materi Matematika",
      secKelipatan: "Kelipatan dan Kelipatan Persekutuan",
      secFaktor: "Faktor dan Faktor Persekutuan",
      secFaktorisasi: "Metode Faktorisasi Prima",
      secContohKpk: "Contoh Soal KPK (Bertingkat)",
      secContohFpb: "Contoh Soal FPB (Bertingkat)",
      secAplikasi: "Aplikasi KPK dan FPB dalam Kehidupan",
      summaryLabel: "Ringkasan Intisari:",
      multiples: "Kelipatan",
      commonMultiples: "Kelipatan Persekutuan",
      lcmFull: "KPK (Kelipatan Persekutuan Terkecil)",
      multiplesExample: "Contoh Kelipatan:",
      multiplesOf2: "Kelipatan dari",
      multiplesOf3: "Kelipatan dari",
      multiplesOf4: "Kelipatan dari",
      commonMultiplesOf34: "Kelipatan Persekutuan dari 3 dan 4:",
      multiples3Row: "Kelipatan 3:",
      multiples4Row: "Kelipatan 4:",
      commonMultiplesRow: "Kelipatan Persekutuan:",
      lcmOf34: "KPK dari 3 dan 4 =",
      tipMultiples: "Kelipatan suatu bilangan selalu tak terhingga banyaknya, tetapi KPK adalah satu nilai pasti yang merupakan kelipatan terkecil yang dimiliki bersama oleh dua bilangan atau lebih.",
      tipsLabel: "Tips:",
      factors: "Faktor",
      commonFactors: "Faktor Persekutuan",
      gcdFull: "FPB (Faktor Persekutuan Terbesar)",
      howToFindFactors: "Cara Mencari Faktor:",
      findAllDivisors: "Temukan semua bilangan yang dapat membagi habis bilangan tersebut:",
      factorsOf12: "Faktor dari",
      katexFactor12: "\\text{Faktor: } 1, 2, 3, 4, 6, 12",
      katexFactor18: "\\text{Faktor: } 1, 2, 3, 6, 9, 18",
      commonFactorsOf1218: "Faktor Persekutuan dari 12 dan 18:",
      factors12Row: "Faktor 12:",
      factors18Row: "Faktor 18:",
      commonFactorsRow: "Faktor Persekutuan:",
      gcdOf1218: "FPB dari 12 dan 18 =",
      rememberLabel: "Ingat!",
      rememberFactors: "Faktor suatu bilangan selalu terbatas (ada batasnya), berbeda dengan kelipatan yang tak terhingga. FPB adalah faktor terbesar yang dimiliki bersama.",
      primeFact: "Faktorisasi prima",
      primeFactDesc: "adalah cara menguraikan bilangan menjadi perkalian bilangan-bilangan prima. Metode ini sangat memudahkan pencarian KPK dan FPB, terutama untuk bilangan yang besar.",
      keyRules: "Aturan Penting:",
      lcmRule: "KPK dengan Faktorisasi Prima:",
      lcmRuleDesc: "Kalikan semua faktor prima yang berbeda dengan pangkat",
      lcmRuleBold: "TERTINGGI",
      gcdRule: "FPB dengan Faktorisasi Prima:",
      gcdRuleDesc: "Kalikan faktor prima yang SAMA dengan pangkat",
      gcdRuleBold: "TERENDAH",
      primeFactExample: "Contoh Faktorisasi Prima:",
      primeFactOf1218: "Faktorisasi prima dari 12 dan 18:",
      lcmHighest: "KPK = pangkat tertinggi:",
      gcdLowest: "FPB = pangkat terendah (faktor sama):",
      tipJitu: "Tips Jitu:",
      tipPrimeFact: "Gunakan pohon faktor untuk mempermudah proses faktorisasi. Bagi bilangan dengan bilangan prima terkecil (2, 3, 5, 7, ...) secara berurutan hingga hasilnya 1.",
      badgeEasy: "MUDAH",
      badgeMedium: "SEDANG",
      badgeHard: "SULIT",
      ex1: "Contoh 1",
      ex2: "Contoh 2",
      ex3: "Contoh 3",
      discussion: "PEMBAHASAN:",
      step1: "Langkah 1:",
      step2: "Langkah 2:",
      step3: "Langkah 3:",
      answerLabel: "Jawaban:",
      kpkEx1Q: "Tentukan KPK dari 6 dan 8!",
      kpkEx1S1: "Faktorisasi prima masing-masing bilangan",
      kpkEx1S2: "Ambil semua faktor prima dengan pangkat tertinggi",
      kpkEx1S2a: "Faktor 2: pangkat tertinggi = 3 (dari 8)",
      kpkEx1S2b: "Faktor 3: pangkat tertinggi = 1 (dari 6)",
      kpkEx1S3: "Kalikan faktor-faktor tersebut",
      kpkEx1Ans: "KPK dari 6 dan 8 adalah",
      kpkEx2Q: "Tentukan KPK dari 28 dan 42!",
      kpkEx2S1: "Faktorisasi prima",
      kpkEx2S2: "Identifikasi semua faktor prima dan pangkat tertingginya",
      kpkEx2S2a: "Faktor 2: pangkat tertinggi = 2 (dari 28)",
      kpkEx2S2b: "Faktor 3: pangkat tertinggi = 1 (dari 42)",
      kpkEx2S2c: "Faktor 7: pangkat tertinggi = 1 (sama)",
      kpkEx2S3: "Hitung KPK",
      kpkEx2Ans: "KPK dari 28 dan 42 adalah",
      kpkEx3Q: "Tentukan KPK dari 50, 84, dan 90!",
      kpkEx3S1: "Faktorisasi prima ketiga bilangan",
      kpkEx3S2: "Tentukan pangkat tertinggi setiap faktor prima",
      kpkEx3S2a: "Faktor 2: pangkat tertinggi = 2 (dari 84)",
      kpkEx3S2b: "Faktor 3: pangkat tertinggi = 2 (dari 90)",
      kpkEx3S2c: "Faktor 5: pangkat tertinggi = 2 (dari 50)",
      kpkEx3S2d: "Faktor 7: pangkat tertinggi = 1 (dari 84)",
      kpkEx3S3: "Kalikan semua faktor dengan pangkat tertinggi",
      kpkEx3Ans: "KPK dari 50, 84, dan 90 adalah",
      fpbEx1Q: "Tentukan FPB dari 12 dan 18!",
      fpbEx1S1: "Faktorisasi prima",
      fpbEx1S2: "Ambil faktor prima yang SAMA dengan pangkat TERENDAH",
      fpbEx1S2a: "Faktor 2: ada di keduanya, pangkat terendah = 1",
      fpbEx1S2b: "Faktor 3: ada di keduanya, pangkat terendah = 1",
      fpbEx1S3: "Kalikan faktor-faktor tersebut",
      fpbEx1Ans: "FPB dari 12 dan 18 adalah",
      fpbEx2Q: "Tentukan FPB dari 28 dan 42!",
      fpbEx2S1: "Faktorisasi prima",
      fpbEx2S2: "Identifikasi faktor prima yang SAMA",
      fpbEx2S2a: "Faktor 2: ada di keduanya, pangkat terendah = 1",
      fpbEx2S2b: "Faktor 3: hanya di 42 (tidak dihitung)",
      fpbEx2S2c: "Faktor 7: ada di keduanya, pangkat terendah = 1",
      fpbEx2S3: "Hitung FPB",
      fpbEx2Ans: "FPB dari 28 dan 42 adalah",
      fpbEx3Q: "Tentukan FPB dari 24, 48, dan 72!",
      fpbEx3S1: "Faktorisasi prima ketiga bilangan",
      fpbEx3S2: "Tentukan faktor prima yang sama dengan pangkat terendah",
      fpbEx3S2a: "Faktor 2: ada di ketiganya, pangkat terendah = 3",
      fpbEx3S2b: "Faktor 3: ada di ketiganya, pangkat terendah = 1",
      fpbEx3S3: "Kalikan faktor-faktor tersebut",
      fpbEx3Ans: "FPB dari 24, 48, dan 72 adalah",
      lcmBadge: "KPK",
      gcdBadge: "FPB",
      lcmStoryTitle: "Soal Cerita - Jadwal Bertemu",
      lcmStoryQ1: "Arkan mengunjungi perpustakaan setiap",
      lcmStoryQ1b: "6 hari sekali",
      lcmStoryQ2: ", Dimas setiap",
      lcmStoryQ2b: "4 hari sekali",
      lcmStoryQ3: ", dan Sukma setiap",
      lcmStoryQ3b: "8 hari sekali",
      lcmStoryQ4: ". Jika pada tanggal 28 Januari mereka berkunjung bersama-sama, kapan mereka akan bertemu lagi di perpustakaan?",
      analysisLabel: "Analisis:",
      lcmStoryAnalysis: "Soal ini berkaitan dengan KPK karena kita mencari waktu bertemu berikutnya (kelipatan persekutuan).",
      lcmStoryS1: "Faktorisasi prima",
      lcmStoryS2: "Hitung KPK (pangkat tertinggi)",
      lcmStoryS3: "Hitung tanggal berikutnya",
      lcmStoryS3a: "28 Januari + 24 hari",
      lcmStoryS3b: "Januari memiliki 31 hari, sisa: 31 - 28 = 3 hari",
      lcmStoryS3c: "24 - 3 = 21 hari di bulan Februari",
      lcmStoryAns: "Mereka akan bertemu lagi pada tanggal",
      lcmStoryAnsDate: "21 Februari",
      gcdStoryTitle: "Soal Cerita - Pembagian Rata",
      gcdStoryQ1: "Tersedia",
      gcdStoryQ1b: "84 buku",
      gcdStoryQ2: ",",
      gcdStoryQ2b: "56 pensil",
      gcdStoryQ3: ", dan",
      gcdStoryQ3b: "140 krayon",
      gcdStoryQ4: ". Jika semua barang tersebut akan dibagikan secara merata kepada sejumlah anak tanpa ada yang tersisa, berapa jumlah anak maksimal yang dapat menerima pembagian tersebut?",
      gcdStoryAnalysis: "Soal ini berkaitan dengan FPB karena kita mencari pembagi terbesar yang dapat membagi semua bilangan tanpa sisa.",
      gcdStoryS1: "Faktorisasi prima",
      gcdStoryS2: "Hitung FPB (faktor sama, pangkat terendah)",
      gcdStoryS2a: "Faktor 2: ada di ketiganya, pangkat terendah = 2",
      gcdStoryS2b: "Faktor 7: ada di ketiganya, pangkat terendah = 1",
      gcdStoryAns: "Maksimal",
      gcdStoryAnsB: "28 anak",
      gcdStoryAnsC: "yang dapat menerima pembagian secara merata.",
      gcdStoryEach: "Setiap anak mendapat:",
      gcdStoryBooks: "- Buku: 84 : 28 = 3 buku",
      gcdStoryPencils: "- Pensil: 56 : 28 = 2 pensil",
      gcdStoryCrayons: "- Krayon: 140 : 28 = 5 krayon",
      conclusionSectionTitle: "Kesimpulan Materi KPK dan FPB",
      lcmKeyTitle: "✅ Poin Kunci KPK",
      lcmKey1a: "KPK",
      lcmKey1b: "= Kelipatan Persekutuan",
      lcmKey1c: "Terkecil",
      lcmKey2a: "Ambil semua faktor prima dengan pangkat",
      lcmKey2b: "tertinggi",
      lcmKey3: "Hasilnya selalu ≥ bilangan terbesar dari yang dicari",
      lcmKey4: "Digunakan saat mencari waktu atau kejadian yang",
      lcmKey4b: "berulang bersama",
      gcdKeyTitle: "✅ Poin Kunci FPB",
      gcdKey1a: "FPB",
      gcdKey1b: "= Faktor Persekutuan",
      gcdKey1c: "Terbesar",
      gcdKey2a: "Ambil faktor prima yang",
      gcdKey2b: "sama",
      gcdKey2c: "dengan pangkat",
      gcdKey2d: "terendah",
      gcdKey3: "Hasilnya selalu ≤ bilangan terkecil dari yang dicari",
      gcdKey4: "Digunakan saat membagi sesuatu secara",
      gcdKey4b: "merata",
      studyTips: "💡 Tips Belajar Efektif",
      studyTip1: "Gunakan pohon faktor untuk bilangan yang besar agar tidak bingung",
      studyTip2: "Latih hafalan bilangan prima: 2, 3, 5, 7, 11, 13, 17, 19, 23 ...",
      studyTip3: "Tulis faktorisasi prima kedua bilangan sebelum memulai perhitungan",
      studyTip4: "Baca soal cerita dua kali — cari kata kunci untuk menentukan pakai KPK atau FPB",
      studyTip5: "Cek jawabanmu: KPK harus habis dibagi oleh semua bilangan; FPB harus bisa membagi semua bilangan",
      differentiateTitle: "Tips Membedakan KPK dan FPB",
      useLcmTitle: "Gunakan KPK jika:",
      useLcm1: "Mencari waktu bertemu/bersamaan lagi",
      useLcm2: 'Kata kunci: "kapan ... bersama lagi", "berulang", "bertepatan"',
      useLcm3: "Jawabannya biasanya lebih besar dari bilangan awal",
      useGcdTitle: "Gunakan FPB jika:",
      useGcd1: "Membagi sesuatu secara merata tanpa sisa",
      useGcd2: 'Kata kunci: "maksimal", "sebanyak-banyaknya", "rata"',
      useGcd3: "Jawabannya biasanya lebih kecil dari bilangan awal",
      summaryTitle: "🔢 RANGKUMAN LENGKAP",
      summarySubtitle: "KPK dan FPB — Kelas 7",
      sum1Title: "Definisi & Perbedaan KPK dan FPB",
      lcmDefTitle: "KPK — Kelipatan Persekutuan Terkecil",
      lcmDefDesc: "Bilangan terkecil yang habis dibagi oleh semua bilangan yang dicari. Hasil KPK selalu ≥ bilangan terbesar.",
      gcdDefTitle: "FPB — Faktor Persekutuan Terbesar",
      gcdDefDesc: "Bilangan terbesar yang dapat membagi habis semua bilangan yang dicari. Hasil FPB selalu ≤ bilangan terkecil.",
      sum2Title: "Metode Faktorisasi Prima — Paling Andal!",
      sumStep1Label: "Langkah 1: Buat Pohon Faktor",
      sumStep1Desc: "Urai setiap bilangan menjadi faktor prima dengan cara membagi berulang kali dengan bilangan prima (2, 3, 5, 7, ...).",
      sumStep2Label: "Langkah 2: Tulis sebagai Perkalian Prima",
      sumStep2Desc: "Contoh: 12 = 2² × 3 dan 18 = 2 × 3²",
      sumStep3Label: "Untuk KPK: Ambil pangkat TERTINGGI",
      sumStep3Desc: "KPK(12, 18): dari 2² dan 2¹ → ambil 2². Dari 3¹ dan 3² → ambil 3². Jadi KPK = 2² × 3² = 4 × 9 = 36",
      sumStep4Label: "Untuk FPB: Ambil pangkat TERENDAH",
      sumStep4Desc: "FPB(12, 18): dari 2² dan 2¹ → ambil 2¹. Dari 3¹ dan 3² → ambil 3¹. Jadi FPB = 2¹ × 3¹ = 2 × 3 = 6",
      sum3Title: "Tips & Trik Jitu KPK & FPB",
      trick1Title: "Kunci identifikasi soal cerita",
      trick1Detail: "Kata 'bersama lagi', 'bertepatan', 'berulang' → pakai KPK. Kata 'maksimal', 'sebanyak-banyaknya', 'merata', 'dibagi rata' → pakai FPB.",
      trick2Title: "Cara cepat FPB dengan algoritma Euclid",
      trick2Detail: "FPB(a, b): bagi a dengan b, ambil sisanya. Ulangi sampai sisa = 0. FPB adalah pembagi terakhir. Contoh: FPB(48, 18): 48 = 2×18 + 12; 18 = 1×12 + 6; 12 = 2×6 + 0 → FPB = 6!",
      trick3Title: "Hubungan KPK dan FPB",
      trick3Detail: "KPK(a, b) × FPB(a, b) = a × b. Berguna untuk mencari salah satu jika yang lain diketahui!",
      trick4Title: "Bilangan prima kecil yang wajib hafal",
      trick4Detail: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47. Hafal ini dan pohon faktor akan jauh lebih cepat dibuat!",
      conclusionFinal: "KESIMPULAN",
      conclusionBody: "KPK dan FPB adalah alat matematika yang sangat berguna dalam kehidupan nyata — dari menjadwalkan pertemuan hingga membagi hadiah secara merata. Kuncinya:",
      lcmHighestPower: "KPK = pangkat tertinggi",
      gcdLowestPower: "FPB = pangkat terendah",
      magicRelation: "Dan ingat hubungan ajaib:",
      magicFormula: "KPK × FPB = a × b",
      tags: ["Faktorisasi Prima", "KPK = Pangkat Tertinggi", "FPB = Pangkat Terendah", "KPK×FPB = a×b", "Algoritma Euclid"],
      congratsMsg: "🎓 Selamat! Kamu telah menyelesaikan seluruh materi Bilangan Bulat Kelas 7!",
      backBtn: "Kembali ke Bilangan Bulat",
    },
    en: {
      title: "LCM AND GCD",
      subtitle: "Grade 7 - Integers - Mathematics",
      secKelipatan: "Multiples and Common Multiples",
      secFaktor: "Factors and Common Factors",
      secFaktorisasi: "Prime Factorisation Method",
      secContohKpk: "LCM Worked Examples",
      secContohFpb: "GCD Worked Examples",
      secAplikasi: "Real-Life Applications of LCM and GCD",
      summaryLabel: "Summary:",
      multiples: "Multiples",
      commonMultiples: "Common Multiples",
      lcmFull: "LCM (Least Common Multiple)",
      multiplesExample: "Multiples Examples:",
      multiplesOf2: "Multiples of",
      multiplesOf3: "Multiples of",
      multiplesOf4: "Multiples of",
      commonMultiplesOf34: "Common Multiples of 3 and 4:",
      multiples3Row: "Multiples of 3:",
      multiples4Row: "Multiples of 4:",
      commonMultiplesRow: "Common Multiples:",
      lcmOf34: "LCM of 3 and 4 =",
      tipMultiples: "The multiples of a number are always infinite, but the LCM is one specific value — the smallest multiple shared by two or more numbers.",
      tipsLabel: "Tips:",
      factors: "Factors",
      commonFactors: "Common Factors",
      gcdFull: "GCD (Greatest Common Divisor)",
      howToFindFactors: "How to Find Factors:",
      findAllDivisors: "Find all numbers that divide the given number exactly:",
      factorsOf12: "Factors of",
      katexFactor12: "\\text{Factors: } 1, 2, 3, 4, 6, 12",
      katexFactor18: "\\text{Factors: } 1, 2, 3, 6, 9, 18",
      commonFactorsOf1218: "Common Factors of 12 and 18:",
      factors12Row: "Factors of 12:",
      factors18Row: "Factors of 18:",
      commonFactorsRow: "Common Factors:",
      gcdOf1218: "GCD of 12 and 18 =",
      rememberLabel: "Remember!",
      rememberFactors: "The factors of a number are always finite, unlike multiples which are infinite. The GCD is the largest factor shared by the numbers.",
      primeFact: "Prime factorisation",
      primeFactDesc: "is the method of breaking a number down into a product of prime numbers. This makes finding the LCM and GCD much easier, especially for large numbers.",
      keyRules: "Key Rules:",
      lcmRule: "LCM using Prime Factorisation:",
      lcmRuleDesc: "Multiply all distinct prime factors with the",
      lcmRuleBold: "HIGHEST power",
      gcdRule: "GCD using Prime Factorisation:",
      gcdRuleDesc: "Multiply the COMMON prime factors with the",
      gcdRuleBold: "LOWEST power",
      primeFactExample: "Prime Factorisation Example:",
      primeFactOf1218: "Prime factorisation of 12 and 18:",
      lcmHighest: "LCM = highest power:",
      gcdLowest: "GCD = lowest power (common factors):",
      tipJitu: "Handy Tip:",
      tipPrimeFact: "Use a factor tree to make factorisation easier. Divide the number repeatedly by the smallest prime (2, 3, 5, 7, ...) until the result is 1.",
      badgeEasy: "Easy",
      badgeMedium: "Medium",
      badgeHard: "Hard",
      ex1: "Example 1",
      ex2: "Example 2",
      ex3: "Example 3",
      discussion: "SOLUTION:",
      step1: "Step 1:",
      step2: "Step 2:",
      step3: "Step 3:",
      answerLabel: "Answer:",
      kpkEx1Q: "Find the LCM of 6 and 8!",
      kpkEx1S1: "Prime factorisation of each number",
      kpkEx1S2: "Take all prime factors with the highest power",
      kpkEx1S2a: "Factor 2: highest power = 3 (from 8)",
      kpkEx1S2b: "Factor 3: highest power = 1 (from 6)",
      kpkEx1S3: "Multiply those factors",
      kpkEx1Ans: "LCM of 6 and 8 is",
      kpkEx2Q: "Find the LCM of 28 and 42!",
      kpkEx2S1: "Prime factorisation",
      kpkEx2S2: "Identify all prime factors and their highest powers",
      kpkEx2S2a: "Factor 2: highest power = 2 (from 28)",
      kpkEx2S2b: "Factor 3: highest power = 1 (from 42)",
      kpkEx2S2c: "Factor 7: highest power = 1 (same)",
      kpkEx2S3: "Calculate the LCM",
      kpkEx2Ans: "LCM of 28 and 42 is",
      kpkEx3Q: "Find the LCM of 50, 84, and 90!",
      kpkEx3S1: "Prime factorisation of all three numbers",
      kpkEx3S2: "Determine the highest power of each prime factor",
      kpkEx3S2a: "Factor 2: highest power = 2 (from 84)",
      kpkEx3S2b: "Factor 3: highest power = 2 (from 90)",
      kpkEx3S2c: "Factor 5: highest power = 2 (from 50)",
      kpkEx3S2d: "Factor 7: highest power = 1 (from 84)",
      kpkEx3S3: "Multiply all factors with their highest powers",
      kpkEx3Ans: "LCM of 50, 84, and 90 is",
      fpbEx1Q: "Find the GCD of 12 and 18!",
      fpbEx1S1: "Prime factorisation",
      fpbEx1S2: "Take the COMMON prime factors with the LOWEST power",
      fpbEx1S2a: "Factor 2: in both numbers, lowest power = 1",
      fpbEx1S2b: "Factor 3: in both numbers, lowest power = 1",
      fpbEx1S3: "Multiply those factors",
      fpbEx1Ans: "GCD of 12 and 18 is",
      fpbEx2Q: "Find the GCD of 28 and 42!",
      fpbEx2S1: "Prime factorisation",
      fpbEx2S2: "Identify the COMMON prime factors",
      fpbEx2S2a: "Factor 2: in both numbers, lowest power = 1",
      fpbEx2S2b: "Factor 3: only in 42 (not counted)",
      fpbEx2S2c: "Factor 7: in both numbers, lowest power = 1",
      fpbEx2S3: "Calculate the GCD",
      fpbEx2Ans: "GCD of 28 and 42 is",
      fpbEx3Q: "Find the GCD of 24, 48, and 72!",
      fpbEx3S1: "Prime factorisation of all three numbers",
      fpbEx3S2: "Determine the common prime factors with their lowest powers",
      fpbEx3S2a: "Factor 2: in all three, lowest power = 3",
      fpbEx3S2b: "Factor 3: in all three, lowest power = 1",
      fpbEx3S3: "Multiply those factors",
      fpbEx3Ans: "GCD of 24, 48, and 72 is",
      lcmBadge: "LCM",
      gcdBadge: "GCD",
      lcmStoryTitle: "Word Problem — Meeting Schedule",
      lcmStoryQ1: "Arkan visits the library every",
      lcmStoryQ1b: "6 days",
      lcmStoryQ2: ", Dimas every",
      lcmStoryQ2b: "4 days",
      lcmStoryQ3: ", and Sukma every",
      lcmStoryQ3b: "8 days",
      lcmStoryQ4: ". If they all visited together on 28 January, when will they next meet at the library?",
      analysisLabel: "Analysis:",
      lcmStoryAnalysis: "This problem involves LCM because we are looking for the next time they meet (common multiple).",
      lcmStoryS1: "Prime factorisation",
      lcmStoryS2: "Calculate the LCM (highest powers)",
      lcmStoryS3: "Calculate the next date",
      lcmStoryS3a: "28 January + 24 days",
      lcmStoryS3b: "January has 31 days, remaining: 31 - 28 = 3 days",
      lcmStoryS3c: "24 - 3 = 21 days into February",
      lcmStoryAns: "They will next meet on",
      lcmStoryAnsDate: "21 February",
      gcdStoryTitle: "Word Problem — Equal Division",
      gcdStoryQ1: "There are",
      gcdStoryQ1b: "84 books",
      gcdStoryQ2: ",",
      gcdStoryQ2b: "56 pencils",
      gcdStoryQ3: ", and",
      gcdStoryQ3b: "140 crayons",
      gcdStoryQ4: ". If all items are to be distributed equally among children with nothing left over, what is the maximum number of children who can receive the items?",
      gcdStoryAnalysis: "This problem involves GCD because we are looking for the largest divisor that divides all numbers without a remainder.",
      gcdStoryS1: "Prime factorisation",
      gcdStoryS2: "Calculate the GCD (common factors, lowest power)",
      gcdStoryS2a: "Factor 2: in all three, lowest power = 2",
      gcdStoryS2b: "Factor 7: in all three, lowest power = 1",
      gcdStoryAns: "A maximum of",
      gcdStoryAnsB: "28 children",
      gcdStoryAnsC: "can receive the items equally.",
      gcdStoryEach: "Each child receives:",
      gcdStoryBooks: "- Books: 84 ÷ 28 = 3 books",
      gcdStoryPencils: "- Pencils: 56 ÷ 28 = 2 pencils",
      gcdStoryCrayons: "- Crayons: 140 ÷ 28 = 5 crayons",
      conclusionSectionTitle: "Summary of LCM and GCD",
      lcmKeyTitle: "✅ Key Points: LCM",
      lcmKey1a: "LCM",
      lcmKey1b: "= Least Common",
      lcmKey1c: "Multiple",
      lcmKey2a: "Take all prime factors with the",
      lcmKey2b: "highest power",
      lcmKey3: "The result is always ≥ the largest of the given numbers",
      lcmKey4: "Used when finding times or events that",
      lcmKey4b: "recur together",
      gcdKeyTitle: "✅ Key Points: GCD",
      gcdKey1a: "GCD",
      gcdKey1b: "= Greatest Common",
      gcdKey1c: "Divisor",
      gcdKey2a: "Take the",
      gcdKey2b: "common",
      gcdKey2c: "prime factors with the",
      gcdKey2d: "lowest power",
      gcdKey3: "The result is always ≤ the smallest of the given numbers",
      gcdKey4: "Used when dividing things",
      gcdKey4b: "equally",
      studyTips: "💡 Effective Study Tips",
      studyTip1: "Use factor trees for large numbers to avoid confusion",
      studyTip2: "Practise memorising prime numbers: 2, 3, 5, 7, 11, 13, 17, 19, 23 ...",
      studyTip3: "Write the prime factorisation of both numbers before starting any calculation",
      studyTip4: "Read word problems twice — look for keywords to decide whether to use LCM or GCD",
      studyTip5: "Verify your answer: LCM must be divisible by all given numbers; GCD must divide all given numbers",
      differentiateTitle: "Tips for Telling LCM and GCD Apart",
      useLcmTitle: "Use LCM when:",
      useLcm1: "Finding when events will happen at the same time again",
      useLcm2: 'Keywords: "when together again", "repeating", "coincide"',
      useLcm3: "The answer is usually larger than the original numbers",
      useGcdTitle: "Use GCD when:",
      useGcd1: "Dividing things equally with no remainder",
      useGcd2: 'Keywords: "maximum", "as many as possible", "equal share"',
      useGcd3: "The answer is usually smaller than the original numbers",
      summaryTitle: "🔢 COMPLETE SUMMARY",
      summarySubtitle: "LCM and GCD — Grade 7",
      sum1Title: "Definition & Difference: LCM and GCD",
      lcmDefTitle: "LCM — Least Common Multiple",
      lcmDefDesc: "The smallest number divisible by all of the given numbers. The LCM is always ≥ the largest number.",
      gcdDefTitle: "GCD — Greatest Common Divisor",
      gcdDefDesc: "The largest number that divides all of the given numbers exactly. The GCD is always ≤ the smallest number.",
      sum2Title: "Prime Factorisation Method — Most Reliable!",
      sumStep1Label: "Step 1: Build a Factor Tree",
      sumStep1Desc: "Break each number into prime factors by repeatedly dividing by primes (2, 3, 5, 7, ...).",
      sumStep2Label: "Step 2: Write as a Product of Primes",
      sumStep2Desc: "Example: 12 = 2² × 3 and 18 = 2 × 3²",
      sumStep3Label: "For LCM: Take the HIGHEST power",
      sumStep3Desc: "LCM(12, 18): from 2² and 2¹ → take 2². From 3¹ and 3² → take 3². So LCM = 2² × 3² = 4 × 9 = 36",
      sumStep4Label: "For GCD: Take the LOWEST power",
      sumStep4Desc: "GCD(12, 18): from 2² and 2¹ → take 2¹. From 3¹ and 3² → take 3¹. So GCD = 2¹ × 3¹ = 2 × 3 = 6",
      sum3Title: "Tips & Tricks for LCM & GCD",
      trick1Title: "Keyword clues for word problems",
      trick1Detail: "Words like 'together again', 'coincide', 'repeating' → use LCM. Words like 'maximum', 'as many as possible', 'equal', 'divided equally' → use GCD.",
      trick2Title: "Quick GCD using Euclid's Algorithm",
      trick2Detail: "GCD(a, b): divide a by b, keep the remainder. Repeat until remainder = 0. The GCD is the last divisor. Example: GCD(48, 18): 48 = 2×18 + 12; 18 = 1×12 + 6; 12 = 2×6 + 0 → GCD = 6!",
      trick3Title: "Relationship between LCM and GCD",
      trick3Detail: "LCM(a, b) × GCD(a, b) = a × b. Useful for finding one if the other is known!",
      trick4Title: "Small primes you must memorise",
      trick4Detail: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47. Knowing these makes factor trees much faster!",
      conclusionFinal: "CONCLUSION",
      conclusionBody: "LCM and GCD are highly useful mathematical tools in real life — from scheduling meetings to distributing prizes equally. The key:",
      lcmHighestPower: "LCM = highest power",
      gcdLowestPower: "GCD = lowest power",
      magicRelation: "And remember the magic relationship:",
      magicFormula: "LCM × GCD = a × b",
      tags: ["Prime Factorisation", "LCM = Highest Power", "GCD = Lowest Power", "LCM×GCD = a×b", "Euclid's Algorithm"],
      congratsMsg: "🎓 Congratulations! You have completed all of the Grade 7 Integers material!",
      backBtn: "Back to Integers",
    },
    ja: {
      title: "最小公倍数と最大公約数",
      subtitle: "中学1年 - 整数 - 数学",
      secKelipatan: "倍数と公倍数",
      secFaktor: "約数と公約数",
      secFaktorisasi: "素因数分解の方法",
      secContohKpk: "最小公倍数の例題",
      secContohFpb: "最大公約数の例題",
      secAplikasi: "最小公倍数と最大公約数の応用",
      summaryLabel: "まとめ:",
      multiples: "倍数",
      commonMultiples: "公倍数",
      lcmFull: "最小公倍数 (LCM)",
      multiplesExample: "倍数の例:",
      multiplesOf2: "の倍数",
      multiplesOf3: "の倍数",
      multiplesOf4: "の倍数",
      commonMultiplesOf34: "3と4の公倍数:",
      multiples3Row: "3の倍数:",
      multiples4Row: "4の倍数:",
      commonMultiplesRow: "公倍数:",
      lcmOf34: "3と4の最小公倍数 =",
      tipMultiples: "ある数の倍数は無限に存在しますが、最小公倍数は2つ以上の数が共有する最小の倍数という唯一の値です。",
      tipsLabel: "ヒント:",
      factors: "約数",
      commonFactors: "公約数",
      gcdFull: "最大公約数 (GCD)",
      howToFindFactors: "約数の求め方:",
      findAllDivisors: "その数をちょうど割り切れる数をすべて求める:",
      factorsOf12: "の約数",
      katexFactor12: "\\text{約数: } 1, 2, 3, 4, 6, 12",
      katexFactor18: "\\text{約数: } 1, 2, 3, 6, 9, 18",
      commonFactorsOf1218: "12と18の公約数:",
      factors12Row: "12の約数:",
      factors18Row: "18の約数:",
      commonFactorsRow: "公約数:",
      gcdOf1218: "12と18の最大公約数 =",
      rememberLabel: "覚えよう！",
      rememberFactors: "ある数の約数は有限個ですが、倍数は無限にあります。最大公約数はその数たちが共有する最大の約数です。",
      primeFact: "素因数分解",
      primeFactDesc: "とは、ある数を素数の積に分解する方法です。この方法は、特に大きな数の最小公倍数・最大公約数を求める際に非常に便利です。",
      keyRules: "重要なルール:",
      lcmRule: "素因数分解による最小公倍数:",
      lcmRuleDesc: "すべての異なる素因数を最大の指数で掛け合わせる",
      lcmRuleBold: "最大の指数",
      gcdRule: "素因数分解による最大公約数:",
      gcdRuleDesc: "共通する素因数を最小の指数で掛け合わせる",
      gcdRuleBold: "最小の指数",
      primeFactExample: "素因数分解の例:",
      primeFactOf1218: "12と18の素因数分解:",
      lcmHighest: "最小公倍数 = 最大の指数:",
      gcdLowest: "最大公約数 = 最小の指数 (共通因数):",
      tipJitu: "役立つヒント:",
      tipPrimeFact: "因数分解には素因数の木 (素因数分解図) を使うと楽になります。最小の素数 (2, 3, 5, 7, ...) で順番に割り続け、商が1になるまで繰り返してください。",
      badgeEasy: "基本",
      badgeMedium: "標準",
      badgeHard: "発展",
      ex1: "例題1",
      ex2: "例題2",
      ex3: "例題3",
      discussion: "解説:",
      step1: "手順1:",
      step2: "手順2:",
      step3: "手順3:",
      answerLabel: "答え:",
      kpkEx1Q: "6と8の最小公倍数を求めよ！",
      kpkEx1S1: "各数の素因数分解",
      kpkEx1S2: "最大の指数の素因数をすべて取る",
      kpkEx1S2a: "因数2: 最大の指数 = 3 (8から)",
      kpkEx1S2b: "因数3: 最大の指数 = 1 (6から)",
      kpkEx1S3: "それらの因数を掛け合わせる",
      kpkEx1Ans: "6と8の最小公倍数は",
      kpkEx2Q: "28と42の最小公倍数を求めよ！",
      kpkEx2S1: "素因数分解",
      kpkEx2S2: "すべての素因数と最大の指数を確認する",
      kpkEx2S2a: "因数2: 最大の指数 = 2 (28から)",
      kpkEx2S2b: "因数3: 最大の指数 = 1 (42から)",
      kpkEx2S2c: "因数7: 最大の指数 = 1 (同じ)",
      kpkEx2S3: "最小公倍数を計算する",
      kpkEx2Ans: "28と42の最小公倍数は",
      kpkEx3Q: "50、84、90の最小公倍数を求めよ！",
      kpkEx3S1: "3つの数の素因数分解",
      kpkEx3S2: "各素因数の最大の指数を求める",
      kpkEx3S2a: "因数2: 最大の指数 = 2 (84から)",
      kpkEx3S2b: "因数3: 最大の指数 = 2 (90から)",
      kpkEx3S2c: "因数5: 最大の指数 = 2 (50から)",
      kpkEx3S2d: "因数7: 最大の指数 = 1 (84から)",
      kpkEx3S3: "最大の指数ですべての因数を掛け合わせる",
      kpkEx3Ans: "50、84、90の最小公倍数は",
      fpbEx1Q: "12と18の最大公約数を求めよ！",
      fpbEx1S1: "素因数分解",
      fpbEx1S2: "共通する素因数を最小の指数で取る",
      fpbEx1S2a: "因数2: 両方に含まれる、最小の指数 = 1",
      fpbEx1S2b: "因数3: 両方に含まれる、最小の指数 = 1",
      fpbEx1S3: "それらの因数を掛け合わせる",
      fpbEx1Ans: "12と18の最大公約数は",
      fpbEx2Q: "28と42の最大公約数を求めよ！",
      fpbEx2S1: "素因数分解",
      fpbEx2S2: "共通する素因数を確認する",
      fpbEx2S2a: "因数2: 両方に含まれる、最小の指数 = 1",
      fpbEx2S2b: "因数3: 42にのみ含まれる (対象外)",
      fpbEx2S2c: "因数7: 両方に含まれる、最小の指数 = 1",
      fpbEx2S3: "最大公約数を計算する",
      fpbEx2Ans: "28と42の最大公約数は",
      fpbEx3Q: "24、48、72の最大公約数を求めよ！",
      fpbEx3S1: "3つの数の素因数分解",
      fpbEx3S2: "共通する素因数の最小の指数を求める",
      fpbEx3S2a: "因数2: 3つすべてに含まれる、最小の指数 = 3",
      fpbEx3S2b: "因数3: 3つすべてに含まれる、最小の指数 = 1",
      fpbEx3S3: "それらの因数を掛け合わせる",
      fpbEx3Ans: "24、48、72の最大公約数は",
      lcmBadge: "最小公倍数",
      gcdBadge: "最大公約数",
      lcmStoryTitle: "文章問題 — 再会の日程",
      lcmStoryQ1: "Arkanは",
      lcmStoryQ1b: "6日ごと",
      lcmStoryQ2: "、Dimasは",
      lcmStoryQ2b: "4日ごと",
      lcmStoryQ3: "、Sukmaは",
      lcmStoryQ3b: "8日ごと",
      lcmStoryQ4: "に図書館を訪れる。1月28日に3人が一緒に訪れたとすると、次に図書館で会うのはいつか？",
      analysisLabel: "分析:",
      lcmStoryAnalysis: "次に会う時刻 (公倍数) を求めるため、この問題は最小公倍数に関係しています。",
      lcmStoryS1: "素因数分解",
      lcmStoryS2: "最小公倍数を計算する (最大の指数)",
      lcmStoryS3: "次の日付を計算する",
      lcmStoryS3a: "1月28日 + 24日",
      lcmStoryS3b: "1月は31日まで、残り: 31 - 28 = 3日",
      lcmStoryS3c: "24 - 3 = 2月の21日",
      lcmStoryAns: "3人が次に会うのは",
      lcmStoryAnsDate: "2月21日",
      gcdStoryTitle: "文章問題 — 均等分配",
      gcdStoryQ1: "用意された",
      gcdStoryQ1b: "本84冊",
      gcdStoryQ2: "、",
      gcdStoryQ2b: "鉛筆56本",
      gcdStoryQ3: "、",
      gcdStoryQ3b: "クレヨン140本",
      gcdStoryQ4: "を、余りが出ないように同じ数ずつ子どもたちに配るとき、最大何人に配ることができるか？",
      gcdStoryAnalysis: "すべての数を割り切れる最大の数を求めるため、この問題は最大公約数に関係しています。",
      gcdStoryS1: "素因数分解",
      gcdStoryS2: "最大公約数を計算する (共通因数、最小の指数)",
      gcdStoryS2a: "因数2: 3つすべてに含まれる、最小の指数 = 2",
      gcdStoryS2b: "因数7: 3つすべてに含まれる、最小の指数 = 1",
      gcdStoryAns: "最大",
      gcdStoryAnsB: "28人",
      gcdStoryAnsC: "に均等に配ることができる。",
      gcdStoryEach: "1人あたりの受け取り:",
      gcdStoryBooks: "- 本: 84 ÷ 28 = 3冊",
      gcdStoryPencils: "- 鉛筆: 56 ÷ 28 = 2本",
      gcdStoryCrayons: "- クレヨン: 140 ÷ 28 = 5本",
      conclusionSectionTitle: "最小公倍数と最大公約数のまとめ",
      lcmKeyTitle: "✅ 最小公倍数のポイント",
      lcmKey1a: "最小公倍数",
      lcmKey1b: "= 公倍数の中で",
      lcmKey1c: "最小の値",
      lcmKey2a: "すべての素因数を最大の指数で取る",
      lcmKey2b: "最大の指数",
      lcmKey3: "結果は常に最大の数以上 (≥)",
      lcmKey4: "時刻や出来事が",
      lcmKey4b: "同時に重なる",
      gcdKeyTitle: "✅ 最大公約数のポイント",
      gcdKey1a: "最大公約数",
      gcdKey1b: "= 公約数の中で",
      gcdKey1c: "最大の値",
      gcdKey2a: "",
      gcdKey2b: "共通する",
      gcdKey2c: "素因数を最小の指数で取る",
      gcdKey2d: "最小の指数",
      gcdKey3: "結果は常に最小の数以下 (≤)",
      gcdKey4: "物を",
      gcdKey4b: "均等に分ける",
      studyTips: "💡 効果的な学習のヒント",
      studyTip1: "大きな数には素因数の木を使って混乱を避ける",
      studyTip2: "素数を暗記する練習をする: 2, 3, 5, 7, 11, 13, 17, 19, 23 ...",
      studyTip3: "計算を始める前に両方の数の素因数分解を書き出す",
      studyTip4: "文章問題は2回読む — キーワードを探して最小公倍数か最大公約数かを判断する",
      studyTip5: "答えを確認: 最小公倍数はすべての数で割り切れる; 最大公約数はすべての数を割り切れる",
      differentiateTitle: "最小公倍数と最大公約数の見分け方",
      useLcmTitle: "最小公倍数を使う場合:",
      useLcm1: "出来事が再び同時に起こるタイミングを求める",
      useLcm2: 'キーワード: "再び一緒に", "繰り返す", "一致する"',
      useLcm3: "答えは通常、元の数より大きい",
      useGcdTitle: "最大公約数を使う場合:",
      useGcd1: "余りなく均等に分ける",
      useGcd2: 'キーワード: "最大", "できるだけ多く", "均等"',
      useGcd3: "答えは通常、元の数より小さい",
      summaryTitle: "🔢 完全まとめ",
      summarySubtitle: "最小公倍数と最大公約数 — 中学1年",
      sum1Title: "定義と違い: 最小公倍数と最大公約数",
      lcmDefTitle: "最小公倍数 (LCM)",
      lcmDefDesc: "与えられたすべての数で割り切れる最小の数。最小公倍数は常に最大の数以上。",
      gcdDefTitle: "最大公約数 (GCD)",
      gcdDefDesc: "与えられたすべての数を割り切れる最大の数。最大公約数は常に最小の数以下。",
      sum2Title: "素因数分解の方法 — 最も確実！",
      sumStep1Label: "手順1: 素因数の木を作る",
      sumStep1Desc: "素数 (2, 3, 5, 7, ...) で繰り返し割り続け、各数を素因数の積に分解する。",
      sumStep2Label: "手順2: 素数の積として表す",
      sumStep2Desc: "例: 12 = 2² × 3、18 = 2 × 3²",
      sumStep3Label: "最小公倍数: 最大の指数を取る",
      sumStep3Desc: "LCM(12, 18): 2² と 2¹ → 2² を取る。3¹ と 3² → 3² を取る。よって LCM = 2² × 3² = 4 × 9 = 36",
      sumStep4Label: "最大公約数: 最小の指数を取る",
      sumStep4Desc: "GCD(12, 18): 2² と 2¹ → 2¹ を取る。3¹ と 3² → 3¹ を取る。よって GCD = 2¹ × 3¹ = 2 × 3 = 6",
      sum3Title: "最小公倍数・最大公約数のコツ",
      trick1Title: "文章問題のキーワード",
      trick1Detail: "「再び一緒に」「一致する」「繰り返す」→ 最小公倍数。「最大」「できるだけ多く」「均等」「均等に分ける」→ 最大公約数。",
      trick2Title: "ユークリッドの互除法で素早く最大公約数を求める",
      trick2Detail: "GCD(a, b): a を b で割り、余りを保存する。余りが0になるまで繰り返す。最後の除数が GCD。例: GCD(48, 18): 48 = 2×18 + 12; 18 = 1×12 + 6; 12 = 2×6 + 0 → GCD = 6!",
      trick3Title: "最小公倍数と最大公約数の関係",
      trick3Detail: "LCM(a, b) × GCD(a, b) = a × b。一方がわかれば他方を求めるのに使える！",
      trick4Title: "覚えておくべき小さな素数",
      trick4Detail: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47. これを覚えると素因数の木がずっと速く作れる！",
      conclusionFinal: "結論",
      conclusionBody: "最小公倍数と最大公約数は、待ち合わせの計画から賞品の均等配布まで、実生活でとても役立つ数学ツールです。ポイント:",
      lcmHighestPower: "最小公倍数 = 最大の指数",
      gcdLowestPower: "最大公約数 = 最小の指数",
      magicRelation: "そして魔法の関係式を忘れずに:",
      magicFormula: "最小公倍数 × 最大公約数 = a × b",
      tags: ["素因数分解", "最小公倍数 = 最大の指数", "最大公約数 = 最小の指数", "最小公倍数×最大公約数 = a×b", "ユークリッドの互除法"],
      congratsMsg: "🎓 おめでとう！中学1年の整数の内容をすべて修了しました！",
      backBtn: "整数に戻る",
    },
  };

  const c = translations[language];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {c.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {c.subtitle}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section: Kelipatan dan Kelipatan Persekutuan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kelipatan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{c.secKelipatan}</span>
              </div>
              {expandedSections.includes("kelipatan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kelipatan") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">{c.summaryLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-primary">{c.multiples}</strong>{" "}
                    {language === "id" && <>suatu bilangan <InlineMath math="a" /> diperoleh dengan mengalikan <InlineMath math="a" /> dengan bilangan asli berurutan <InlineMath math="(1, 2, 3, 4, ...)" />.</>}
                    {language === "en" && <>of a number <InlineMath math="a" /> are obtained by multiplying <InlineMath math="a" /> by consecutive natural numbers <InlineMath math="(1, 2, 3, 4, ...)" />.</>}
                    {language === "ja" && <>とは、ある数 <InlineMath math="a" /> に連続する自然数 <InlineMath math="(1, 2, 3, 4, ...)" /> を掛けて得られる数です。</>}
                    {" "}
                    {language === "id" && <>Ketika dua bilangan atau lebih memiliki kelipatan yang sama, bilangan tersebut disebut <strong className="text-cyan-400">{c.commonMultiples}</strong>. Yang terkecil dari kelipatan persekutuan ini dinamakan <strong className="text-green-400">{c.lcmFull}</strong>.</>}
                    {language === "en" && <>When two or more numbers share a common multiple, those multiples are called <strong className="text-cyan-400">{c.commonMultiples}</strong>. The smallest of these is called the <strong className="text-green-400">{c.lcmFull}</strong>.</>}
                    {language === "ja" && <>2つ以上の数が共通の倍数を持つとき、それを <strong className="text-cyan-400">{c.commonMultiples}</strong> といいます。その中で最小のものを <strong className="text-green-400">{c.lcmFull}</strong> といいます。</>}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">{c.multiplesExample}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm">{language === "ja" ? <>2{c.multiplesOf2}:</> : <>{c.multiplesOf2} <InlineMath math="2" />:</>}</p>
                      <BlockMath math="2, 4, 6, 8, 10, 12, 14, 16, ..." />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm">{language === "ja" ? <>3{c.multiplesOf3}:</> : <>{c.multiplesOf3} <InlineMath math="3" />:</>}</p>
                      <BlockMath math="3, 6, 9, 12, 15, 18, 21, 24, ..." />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm">{language === "ja" ? <>4{c.multiplesOf4}:</> : <>{c.multiplesOf4} <InlineMath math="4" />:</>}</p>
                      <BlockMath math="4, 8, 12, 16, 20, 24, 28, 32, ..." />
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3">{c.commonMultiplesOf34}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <p className="text-white/70 text-sm">{c.multiples3Row} <InlineMath math="3, 6, 9, \textcolor{lime}{12}, 15, 18, 21, \textcolor{lime}{24}, 27, 30, 33, \textcolor{lime}{36}, ..." /></p>
                    <p className="text-white/70 text-sm">{c.multiples4Row} <InlineMath math="4, 8, \textcolor{lime}{12}, 16, 20, \textcolor{lime}{24}, 28, 32, \textcolor{lime}{36}, ..." /></p>
                    <p className="text-cyan-400 text-sm font-semibold">{c.commonMultiplesRow} <InlineMath math="12, 24, 36, 48, ..." /></p>
                    <p className="text-green-400 font-semibold">{c.lcmOf34} <InlineMath math="12" /></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>{c.tipsLabel}</strong> {c.tipMultiples}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Faktor dan Faktor Persekutuan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("faktor")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{c.secFaktor}</span>
              </div>
              {expandedSections.includes("faktor") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("faktor") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">{c.summaryLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-primary">{c.factors}</strong>{" "}
                    {language === "id" && <>adalah bilangan-bilangan yang dapat membagi habis suatu bilangan. Ketika dua bilangan atau lebih memiliki faktor yang sama, faktor tersebut disebut <strong className="text-cyan-400">{c.commonFactors}</strong>. Yang terbesar dari faktor persekutuan ini dinamakan <strong className="text-orange-400">{c.gcdFull}</strong>.</>}
                    {language === "en" && <>are numbers that divide a given number exactly. When two or more numbers share a common factor, those factors are called <strong className="text-cyan-400">{c.commonFactors}</strong>. The largest of these is called the <strong className="text-orange-400">{c.gcdFull}</strong>.</>}
                    {language === "ja" && <>とは、ある数をちょうど割り切れる数のことです。2つ以上の数が共通の約数を持つとき、それを <strong className="text-cyan-400">{c.commonFactors}</strong> といいます。その中で最大のものを <strong className="text-orange-400">{c.gcdFull}</strong> といいます。</>}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3">{c.howToFindFactors}</p>
                  <p className="text-white/70 text-sm mb-3">{c.findAllDivisors}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm">{language === "ja" ? <>12{c.factorsOf12}:</> : <>{c.factorsOf12} <InlineMath math="12" />:</>}</p>
                      <div className="text-white/60 text-xs mt-1">
                        <InlineMath math="12 = 1 \times 12 = 2 \times 6 = 3 \times 4" />
                      </div>
                      <BlockMath math={c.katexFactor12} />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm">{language === "ja" ? <>18{c.factorsOf12}:</> : <>{c.factorsOf12} <InlineMath math="18" />:</>}</p>
                      <div className="text-white/60 text-xs mt-1">
                        <InlineMath math="18 = 1 \times 18 = 2 \times 9 = 3 \times 6" />
                      </div>
                      <BlockMath math={c.katexFactor18} />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-orange-300 mb-3">{c.commonFactorsOf1218}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <p className="text-white/70 text-sm">{c.factors12Row} <InlineMath math="\textcolor{orange}{1}, \textcolor{orange}{2}, \textcolor{orange}{3}, 4, \textcolor{orange}{6}, 12" /></p>
                    <p className="text-white/70 text-sm">{c.factors18Row} <InlineMath math="\textcolor{orange}{1}, \textcolor{orange}{2}, \textcolor{orange}{3}, \textcolor{orange}{6}, 9, 18" /></p>
                    <p className="text-cyan-400 text-sm font-semibold">{c.commonFactorsRow} <InlineMath math="1, 2, 3, 6" /></p>
                    <p className="text-orange-400 font-semibold">{c.gcdOf1218} <InlineMath math="6" /></p>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>{c.rememberLabel}</strong> {c.rememberFactors}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Faktorisasi Prima */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("faktorisasi")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{c.secFaktorisasi}</span>
              </div>
              {expandedSections.includes("faktorisasi") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("faktorisasi") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">{c.summaryLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-blue-400">{c.primeFact}</strong> {c.primeFactDesc}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-blue-300 mb-3">{c.keyRules}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body font-semibold text-green-300 mb-1">{c.lcmRule}</p>
                      <p className="text-white/70 text-sm">{c.lcmRuleDesc} <strong className="text-green-400">{c.lcmRuleBold}</strong></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body font-semibold text-orange-300 mb-1">{c.gcdRule}</p>
                      <p className="text-white/70 text-sm">{c.gcdRuleDesc} <strong className="text-orange-400">{c.gcdRuleBold}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">{c.primeFactExample}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/80 text-sm mb-2">{c.primeFactOf1218}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div><BlockMath math="12 = 2^2 \times 3" /></div>
                        <div><BlockMath math="18 = 2 \times 3^2" /></div>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-green-400 text-sm mb-1"><strong>LCM / KPK</strong> — {c.lcmHighest}</p>
                      <BlockMath math="LCM = 2^2 \times 3^2 = 4 \times 9 = 36" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-orange-400 text-sm mb-1"><strong>GCD / FPB</strong> — {c.gcdLowest}</p>
                      <BlockMath math="GCD = 2^1 \times 3^1 = 2 \times 3 = 6" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>{c.tipJitu}</strong> {c.tipPrimeFact}
                  </p>
                </div>

                <FactorTreeAnimation />
              </div>
            )}
          </div>

          {/* Section: Contoh Soal KPK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh-kpk")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">{c.secContohKpk}</span>
              </div>
              {expandedSections.includes("contoh-kpk") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("contoh-kpk") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Easy */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeEasy}</span>
                    <span className="font-body font-semibold text-green-300">{c.ex1}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">{c.kpkEx1Q}</p>
                  </div>
                  <div className="border-t border-green-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.step1}</strong> {c.kpkEx1S1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="6 = 2 \times 3" /><br />
                        <InlineMath math="8 = 2^3" />
                      </div>
                      <p className="text-white/70"><strong>{c.step2}</strong> {c.kpkEx1S2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">{c.kpkEx1S2a}</p>
                        <p className="text-white/60 text-xs">{c.kpkEx1S2b}</p>
                      </div>
                      <p className="text-white/70"><strong>{c.step3}</strong> {c.kpkEx1S3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="LCM = 2^3 \times 3 = 8 \times 3 = 24" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answerLabel} {c.kpkEx1Ans} <InlineMath math="24" /></p>
                    </div>
                  </div>
                </div>

                {/* Medium */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeMedium}</span>
                    <span className="font-body font-semibold text-yellow-300">{c.ex2}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">{c.kpkEx2Q}</p>
                  </div>
                  <div className="border-t border-yellow-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-yellow-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.step1}</strong> {c.kpkEx2S1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="28 = 4 \times 7 = 2^2 \times 7" /><br />
                        <InlineMath math="42 = 6 \times 7 = 2 \times 3 \times 7" />
                      </div>
                      <p className="text-white/70"><strong>{c.step2}</strong> {c.kpkEx2S2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">{c.kpkEx2S2a}</p>
                        <p className="text-white/60 text-xs">{c.kpkEx2S2b}</p>
                        <p className="text-white/60 text-xs">{c.kpkEx2S2c}</p>
                      </div>
                      <p className="text-white/70"><strong>{c.step3}</strong> {c.kpkEx2S3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="LCM = 2^2 \times 3 \times 7 = 4 \times 3 \times 7 = 84" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answerLabel} {c.kpkEx2Ans} <InlineMath math="84" /></p>
                    </div>
                  </div>
                </div>

                {/* Hard */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeHard}</span>
                    <span className="font-body font-semibold text-red-300">{c.ex3}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">{c.kpkEx3Q}</p>
                  </div>
                  <div className="border-t border-red-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-red-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.step1}</strong> {c.kpkEx3S1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="50 = 2 \times 25 = 2 \times 5^2" /><br />
                        <InlineMath math="84 = 4 \times 21 = 2^2 \times 3 \times 7" /><br />
                        <InlineMath math="90 = 9 \times 10 = 2 \times 3^2 \times 5" />
                      </div>
                      <p className="text-white/70"><strong>{c.step2}</strong> {c.kpkEx3S2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">{c.kpkEx3S2a}</p>
                        <p className="text-white/60 text-xs">{c.kpkEx3S2b}</p>
                        <p className="text-white/60 text-xs">{c.kpkEx3S2c}</p>
                        <p className="text-white/60 text-xs">{c.kpkEx3S2d}</p>
                      </div>
                      <p className="text-white/70"><strong>{c.step3}</strong> {c.kpkEx3S3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="LCM = 2^2 \times 3^2 \times 5^2 \times 7" /><br />
                        <InlineMath math="= 4 \times 9 \times 25 \times 7 = 6.300" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answerLabel} {c.kpkEx3Ans} <InlineMath math="6.300" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Contoh Soal FPB */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh-fpb")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">{c.secContohFpb}</span>
              </div>
              {expandedSections.includes("contoh-fpb") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("contoh-fpb") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Easy */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeEasy}</span>
                    <span className="font-body font-semibold text-green-300">{c.ex1}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">{c.fpbEx1Q}</p>
                  </div>
                  <div className="border-t border-green-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.step1}</strong> {c.fpbEx1S1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="12 = 2^2 \times 3" /><br />
                        <InlineMath math="18 = 2 \times 3^2" />
                      </div>
                      <p className="text-white/70"><strong>{c.step2}</strong> {c.fpbEx1S2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">{c.fpbEx1S2a}</p>
                        <p className="text-white/60 text-xs">{c.fpbEx1S2b}</p>
                      </div>
                      <p className="text-white/70"><strong>{c.step3}</strong> {c.fpbEx1S3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="GCD = 2^1 \times 3^1 = 2 \times 3 = 6" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answerLabel} {c.fpbEx1Ans} <InlineMath math="6" /></p>
                    </div>
                  </div>
                </div>

                {/* Medium */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeMedium}</span>
                    <span className="font-body font-semibold text-yellow-300">{c.ex2}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">{c.fpbEx2Q}</p>
                  </div>
                  <div className="border-t border-yellow-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-yellow-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.step1}</strong> {c.fpbEx2S1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="28 = 2^2 \times 7" /><br />
                        <InlineMath math="42 = 2 \times 3 \times 7" />
                      </div>
                      <p className="text-white/70"><strong>{c.step2}</strong> {c.fpbEx2S2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">{c.fpbEx2S2a}</p>
                        <p className="text-white/60 text-xs">{c.fpbEx2S2b}</p>
                        <p className="text-white/60 text-xs">{c.fpbEx2S2c}</p>
                      </div>
                      <p className="text-white/70"><strong>{c.step3}</strong> {c.fpbEx2S3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="GCD = 2 \times 7 = 14" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answerLabel} {c.fpbEx2Ans} <InlineMath math="14" /></p>
                    </div>
                  </div>
                </div>

                {/* Hard */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeHard}</span>
                    <span className="font-body font-semibold text-red-300">{c.ex3}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white mb-2">{c.fpbEx3Q}</p>
                  </div>
                  <div className="border-t border-red-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-red-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.step1}</strong> {c.fpbEx3S1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="24 = 2^3 \times 3" /><br />
                        <InlineMath math="48 = 2^4 \times 3" /><br />
                        <InlineMath math="72 = 2^3 \times 3^2" />
                      </div>
                      <p className="text-white/70"><strong>{c.step2}</strong> {c.fpbEx3S2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">{c.fpbEx3S2a}</p>
                        <p className="text-white/60 text-xs">{c.fpbEx3S2b}</p>
                      </div>
                      <p className="text-white/70"><strong>{c.step3}</strong> {c.fpbEx3S3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="GCD = 2^3 \times 3 = 8 \times 3 = 24" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answerLabel} {c.fpbEx3Ans} <InlineMath math="24" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Aplikasi */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("aplikasi")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">{c.secAplikasi}</span>
              </div>
              {expandedSections.includes("aplikasi") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("aplikasi") && (
              <div className="px-5 pb-5 space-y-6">
                {/* LCM Story */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">{c.lcmBadge}</span>
                    <span className="font-body font-semibold text-green-300">{c.lcmStoryTitle}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white leading-relaxed">
                      {c.lcmStoryQ1} <strong>{c.lcmStoryQ1b}</strong>{c.lcmStoryQ2} <strong>{c.lcmStoryQ2b}</strong>{c.lcmStoryQ3} <strong>{c.lcmStoryQ3b}</strong>{c.lcmStoryQ4}
                    </p>
                  </div>
                  <div className="border-t border-green-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.analysisLabel}</strong> {c.lcmStoryAnalysis}</p>
                      <p className="text-white/70"><strong>{c.step1}</strong> {c.lcmStoryS1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="6 = 2 \times 3" /><br />
                        <InlineMath math="4 = 2^2" /><br />
                        <InlineMath math="8 = 2^3" />
                      </div>
                      <p className="text-white/70"><strong>{c.step2}</strong> {c.lcmStoryS2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="LCM = 2^3 \times 3 = 8 \times 3 = 24" />
                      </div>
                      <p className="text-white/70"><strong>{c.step3}</strong> {c.lcmStoryS3}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">{c.lcmStoryS3a}</p>
                        <p className="text-white/60 text-xs">{c.lcmStoryS3b}</p>
                        <p className="text-white/60 text-xs">{c.lcmStoryS3c}</p>
                      </div>
                      <p className="text-green-400 font-semibold">{c.answerLabel} {c.lcmStoryAns} <strong>{c.lcmStoryAnsDate}</strong></p>
                    </div>
                  </div>
                </div>

                {/* GCD Story */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">{c.gcdBadge}</span>
                    <span className="font-body font-semibold text-orange-300">{c.gcdStoryTitle}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="font-body text-sm text-white leading-relaxed">
                      {c.gcdStoryQ1} <strong>{c.gcdStoryQ1b}</strong>{c.gcdStoryQ2} <strong>{c.gcdStoryQ2b}</strong>{c.gcdStoryQ3} <strong>{c.gcdStoryQ3b}</strong>{c.gcdStoryQ4}
                    </p>
                  </div>
                  <div className="border-t border-orange-500/30 pt-3">
                    <p className="font-body text-xs font-semibold text-orange-300 mb-2">{c.discussion}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70"><strong>{c.analysisLabel}</strong> {c.gcdStoryAnalysis}</p>
                      <p className="text-white/70"><strong>{c.step1}</strong> {c.gcdStoryS1}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <InlineMath math="84 = 2^2 \times 3 \times 7" /><br />
                        <InlineMath math="56 = 2^3 \times 7" /><br />
                        <InlineMath math="140 = 2^2 \times 5 \times 7" />
                      </div>
                      <p className="text-white/70"><strong>{c.step2}</strong> {c.gcdStoryS2}</p>
                      <div className="bg-slate-800/50 rounded p-2 ml-4">
                        <p className="text-white/60 text-xs">{c.gcdStoryS2a}</p>
                        <p className="text-white/60 text-xs">{c.gcdStoryS2b}</p>
                        <InlineMath math="GCD = 2^2 \times 7 = 4 \times 7 = 28" />
                      </div>
                      <p className="text-green-400 font-semibold">{c.answerLabel} {c.gcdStoryAns} <strong>{c.gcdStoryAnsB}</strong> {c.gcdStoryAnsC}</p>
                      <div className="bg-slate-800/50 rounded p-2 mt-2">
                        <p className="text-white/60 text-xs">{c.gcdStoryEach}</p>
                        <p className="text-white/60 text-xs">{c.gcdStoryBooks}</p>
                        <p className="text-white/60 text-xs">{c.gcdStoryPencils}</p>
                        <p className="text-white/60 text-xs">{c.gcdStoryCrayons}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary & Key Points */}
                <div className="bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-400/40 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">📌</span>
                    <span className="font-body font-bold text-indigo-300 text-sm">{c.conclusionSectionTitle}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-green-500/20">
                      <p className="font-body font-semibold text-green-300 text-sm mb-2">{c.lcmKeyTitle}</p>
                      <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
                        <li><strong className="text-white/90">{c.lcmKey1a}</strong> {c.lcmKey1b} <strong className="text-green-400">{c.lcmKey1c}</strong></li>
                        <li>{c.lcmKey2a} <strong className="text-green-400">{c.lcmKey2b}</strong></li>
                        <li>{c.lcmKey3}</li>
                        <li>{c.lcmKey4} <strong className="text-white/90">{c.lcmKey4b}</strong></li>
                      </ul>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-orange-500/20">
                      <p className="font-body font-semibold text-orange-300 text-sm mb-2">{c.gcdKeyTitle}</p>
                      <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
                        <li><strong className="text-white/90">{c.gcdKey1a}</strong> {c.gcdKey1b} <strong className="text-orange-400">{c.gcdKey1c}</strong></li>
                        <li>{c.gcdKey2a}<strong className="text-orange-400">{c.gcdKey2b}</strong> {c.gcdKey2c} <strong className="text-orange-400">{c.gcdKey2d}</strong></li>
                        <li>{c.gcdKey3}</li>
                        <li>{c.gcdKey4} <strong className="text-white/90">{c.gcdKey4b}</strong></li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3 border border-yellow-500/20 space-y-2">
                    <p className="font-body font-semibold text-yellow-300 text-sm">{c.studyTips}</p>
                    <ul className="text-white/70 text-xs space-y-1.5">
                      <li>🌳 <strong className="text-white/90">{c.studyTip1}</strong></li>
                      <li>🔁 <strong className="text-white/90">{c.studyTip2}</strong></li>
                      <li>✏️ <strong className="text-white/90">{c.studyTip3}</strong></li>
                      <li>🔍 <strong className="text-white/90">{c.studyTip4}</strong></li>
                      <li>📐 <strong className="text-white/90">{c.studyTip5}</strong></li>
                    </ul>
                  </div>
                </div>

                {/* Differentiate LCM vs GCD */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-cyan-400" />
                    <span className="font-body font-semibold text-cyan-300">{c.differentiateTitle}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body font-semibold text-green-300 mb-1">{c.useLcmTitle}</p>
                      <ul className="text-white/70 text-sm list-disc list-inside space-y-1">
                        <li>{c.useLcm1}</li>
                        <li>{c.useLcm2}</li>
                        <li>{c.useLcm3}</li>
                      </ul>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body font-semibold text-orange-300 mb-1">{c.useGcdTitle}</p>
                      <ul className="text-white/70 text-sm list-disc list-inside space-y-1">
                        <li>{c.useGcd1}</li>
                        <li>{c.useGcd2}</li>
                        <li>{c.useGcd3}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ RANGKUMAN AKHIR ══ */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">{c.summaryTitle}</p>
            <p className="font-body text-xs text-white/80 mt-0.5">{c.summarySubtitle}</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

            {/* Definisi & Perbedaan */}
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-pink-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-500/30 border border-pink-500 flex items-center justify-center text-[10px]">1</span>
                {c.sum1Title}
              </p>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-gradient-to-r from-green-900/70 to-green-800/30 border border-green-500/50 rounded-xl px-4 py-3">
                  <p className="font-body text-xs font-bold text-green-300">{c.lcmDefTitle}</p>
                  <p className="font-body text-xs text-white/65 mt-1">{c.lcmDefDesc}</p>
                  <p className="font-mono text-xs text-green-200 mt-1">LCM(12, 18) = 36</p>
                </div>
                <div className="bg-gradient-to-r from-orange-900/70 to-orange-800/30 border border-orange-500/50 rounded-xl px-4 py-3">
                  <p className="font-body text-xs font-bold text-orange-300">{c.gcdDefTitle}</p>
                  <p className="font-body text-xs text-white/65 mt-1">{c.gcdDefDesc}</p>
                  <p className="font-mono text-xs text-orange-200 mt-1">GCD(12, 18) = 6</p>
                </div>
              </div>
            </div>

            {/* Metode Faktorisasi Prima */}
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-rose-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/30 border border-rose-500 flex items-center justify-center text-[10px]">2</span>
                {c.sum2Title}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: c.sumStep1Label, desc: c.sumStep1Desc, color: "from-pink-900/60 to-pink-800/20 border-pink-500/40 text-pink-200" },
                  { label: c.sumStep2Label, desc: c.sumStep2Desc, color: "from-rose-900/60 to-rose-800/20 border-rose-500/40 text-rose-200" },
                  { label: c.sumStep3Label, desc: c.sumStep3Desc, color: "from-green-900/60 to-green-800/20 border-green-500/40 text-green-200" },
                  { label: c.sumStep4Label, desc: c.sumStep4Desc, color: "from-orange-900/60 to-orange-800/20 border-orange-500/40 text-orange-200" },
                ].map(({ label, desc, color }) => (
                  <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                    <div>
                      <p className="font-body text-xs font-bold">{label}</p>
                      <p className="font-body text-xs text-white/65 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Trik */}
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">3</span>
                {c.sum3Title}
              </p>
              <div className="space-y-2">
                {[
                  { icon: "🎯", tip: c.trick1Title, detail: c.trick1Detail, color: "bg-pink-900/30 border-pink-500/30" },
                  { icon: "⚡", tip: c.trick2Title, detail: c.trick2Detail, color: "bg-orange-900/30 border-orange-500/30" },
                  { icon: "🔗", tip: c.trick3Title, detail: c.trick3Detail, color: "bg-green-900/30 border-green-500/30" },
                  { icon: "📊", tip: c.trick4Title, detail: c.trick4Detail, color: "bg-cyan-900/30 border-cyan-500/30" },
                ].map(({ icon, tip, detail, color }) => (
                  <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="font-body text-xs font-bold text-white">{tip}</p>
                      <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kesimpulan */}
            <div className="bg-gradient-to-br from-pink-500/20 via-rose-500/15 to-red-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🌺</div>
              <p className="font-display text-base font-bold text-white">{c.conclusionFinal}</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                {c.conclusionBody}{" "}
                <strong className="text-green-300">{c.lcmHighestPower}</strong>{" "}
                {language === "id" ? "dan" : language === "en" ? "and" : "と"}{" "}
                <strong className="text-orange-300">{c.gcdLowestPower}</strong>{" "}
                {language === "id" ? "dari faktorisasi prima." : language === "en" ? "from prime factorisation." : "（素因数分解から）。"}{" "}
                {c.magicRelation}{" "}
                <strong className="text-yellow-300">{c.magicFormula}</strong>!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {c.tags.map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{c.congratsMsg}</p>
            </div>

          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/bilangan-bulat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {c.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KPKFPBPage;
