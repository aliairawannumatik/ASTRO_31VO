import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, FlaskConical, Star } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const translations = {
  id: {
    badge: "KELAS 8 · LINGKARAN · MATERI",
    h1: "KAITAN LINGKARAN\nDENGAN BANGUN DATAR LAINNYA",
    subtitle: "Luas & Keliling Daerah Arsiran · Bangun Gabungan",
    introTitle: "💡 Apa Itu Daerah Arsiran?",
    introP: "Dalam soal matematika, kita sering menemukan gambar bangun datar yang saling bertumpang-tindih atau saling berada di dalam satu sama lain. Bagian yang diarsir adalah daerah yang menjadi fokus pertanyaan — bisa berupa sudut-sudut yang tersisa, gabungan dua bangun, atau daerah yang \"dipotong\" oleh lingkaran.",
    introEmphasis: "saling bertumpang-tindih",
    introEmphasis2: "diarsir",
    introCats: [
      { color: "#f97316", label: "Dikurangi", desc: "Arsiran = Bangun Besar − Bangun Kecil" },
      { color: "#06b6d4", label: "Dijumlah", desc: "Arsiran = Luas Bangun A + Luas Bangun B" },
      { color: "#a855f7", label: "Campuran", desc: "Gabungan busur lingkaran dan sisi lurus" },
    ],
    introKey: "🔑 Kunci utama: Identifikasi terlebih dahulu bangun apa yang ditambah dan bangun apa yang dikurang. Setelah itu, hitung luas dan kelilingnya secara terpisah.",
    introKeyBold: "Kunci utama:",
    introKeyRest: " Identifikasi terlebih dahulu bangun apa yang ditambah dan bangun apa yang dikurang. Setelah itu, hitung luas dan kelilingnya secara terpisah.",
    k1Title: "✏️ Kasus 1 — Bangun Gabungan: Persegi Panjang + Setengah Lingkaran (π = 22/7)",
    k1Badge: "🔵 Soal", k1Soal: "Sebuah bangun datar gabungan terdiri dari persegi panjang berukuran 21 cm × 21 cm dan setengah lingkaran yang menempel pada salah satu sisi tegaknya. Hitunglah (a) luas bangun gabungan dan (b) kelilingnya!",
    k1Sol: "📋 Pembahasan",
    k1Known: "Diketahui:", k1KnownV: " panjang = lebar = 21 cm, setengah lingkaran dengan",
    k1a: "(a) Luas bangun gabungan:", k1b: "(b) Keliling bangun gabungan:",
    k1bNote: "Sisi atas + sisi bawah + sisi kiri + busur setengah lingkaran (sisi kanan):",
    k1ResultL: "✅ Luas Bangun", k1ResultLV: "614,25 cm²",
    k1ResultK: "✅ Keliling", k1ResultKV: "96 cm",
    k2Title: "✏️ Kasus 2 — Persegi Panjang 28×14 Dikurangi Dua Setengah Lingkaran (π = 22/7)",
    k2Badge: "🟡 Soal", k2Soal: "Perhatikan gambar di bawah! Sebuah persegi panjang berukuran 28 cm × 14 cm. Dari sisi kiri dan sisi kanannya dipotong masing-masing satu setengah lingkaran. Hitunglah (a) luas daerah yang diarsir dan (b) keliling daerah yang diarsir!",
    k2Sol: "📋 Pembahasan",
    k2Known: "Diketahui:", k2KnownV: " panjang = 28 cm, lebar = 14 cm. Diameter setengah lingkaran = 14 cm, maka",
    k2KnownV2: "cm. Dua setengah lingkaran = satu lingkaran penuh.",
    k2a: "(a) Luas daerah arsiran:", k2b: "(b) Keliling daerah arsiran:",
    k2bNote: "Sisi atas (28cm) + sisi bawah (28cm) + busur kiri",
    k2bNote2: "busur kanan",
    k2ResultL: "✅ Luas Arsiran", k2ResultLV: "238 cm²",
    k2ResultK: "✅ Keliling Arsiran", k2ResultKV: "100 cm",
    k3Title: "✏️ Kasus 3 — Setengah Lingkaran Besar Dikurangi Setengah Lingkaran Kecil (π = 3,14)",
    k3Badge: "🌹 Soal", k3Soal: "Daerah arsiran berbentuk \"koma\" (setengah annulus). Setengah lingkaran besar berdiameter 20 cm dan setengah lingkaran kecil berdiameter 10 cm dihapus dari dalamnya. Hitunglah (a) luas daerah arsiran dan (b) kelilingnya!",
    k3Sol: "📋 Pembahasan",
    k3Known: "Diketahui:", k3KnownV: " R = 10 cm (besar), r = 5 cm (kecil)",
    k3a: "(a) Luas daerah arsiran:", k3b: "(b) Keliling daerah arsiran:",
    k3bNote: "Busur besar + busur kecil + 2 garis penghubung:",
    k3ResultL: "✅ Luas Arsiran", k3ResultLV: "117,75 cm²",
    k3ResultK: "✅ Keliling Arsiran", k3ResultKV: "57,1 cm",
    k4Title: "✏️ Kasus 4 — Seperempat Lingkaran r = 10 cm (π = 3,14)",
    k4Badge: "🟢 Soal", k4Soal: "Perhatikan gambar di bawah! Daerah yang diarsir adalah seperempat lingkaran dengan jari-jari 10 cm. Hitunglah (a) luas daerah arsiran dan (b) keliling daerah arsiran!",
    k4Sol: "📋 Pembahasan",
    k4Known: "Diketahui:", k4KnownV: " r = 10 cm, π = 3,14",
    k4a: "(a) Luas seperempat lingkaran:", k4b: "(b) Keliling daerah arsiran:",
    k4bNote: "Dua jari-jari (sisi lurus) + busur seperempat lingkaran:",
    k4ResultL: "✅ Luas Arsiran", k4ResultLV: "78,5 cm²",
    k4ResultK: "✅ Keliling Arsiran", k4ResultKV: "35,7 cm",
    k5Title: "✏️ Kasus 5 — Bintang 4 Titik dari Busur dalam Persegi 14 cm (π = 22/7)",
    k5Badge: "⭐ Soal", k5Soal: "Di dalam persegi bersisi 14 cm, dari keempat sudutnya dibuat busur seperempat lingkaran (jari-jari = 14 cm). Keempat busur tersebut membentuk bintang 4 titik di tengah persegi. Hitunglah luas daerah bintang yang diarsir!",
    k5Sol: "📋 Pembahasan",
    k5Known: "Diketahui:", k5KnownV: " sisi persegi a = 14 cm, r = 14 cm",
    k5Hint: "Luas bintang = Luas persegi − 4 × segmen lingkaran di sudut",
    k5Hint2: "Setiap sudut terpotong oleh dua busur, sehingga tersisa segmen berbentuk \"mata\" di tiap sudut.",
    k5Use: "Gunakan:", k5AltNote: "💡 Rumus alternatif:",
    k5Result: "✅ Luas Bintang", k5ResultV: "224 cm²",
    k6Title: "✏️ Kasus 6 — Tiga Busur Lengkung: Busur Besar Dikurangi 2 Busur Kecil (π = 22/7)",
    k6Badge: "🌊 Soal", k6Soal: "Daerah arsiran berbentuk \"tiga busur\" dalam persegi panjang 28 cm × 14 cm. Satu setengah lingkaran besar (R = 14 cm) berada di atas, lalu dua setengah lingkaran kecil (r = 7 cm) dipotong dari bawahnya. Hitunglah (a) luas arsiran dan (b) keliling arsiran!",
    k6Sol: "📋 Pembahasan",
    k6Known: "Diketahui:", k6KnownV: " R = 14 cm (besar), r = 7 cm (kecil × 2)",
    k6a: "(a) Luas daerah arsiran:", k6b: "(b) Keliling daerah arsiran:",
    k6bNote: "Busur besar + 2 busur kecil (berhadapan arah):",
    k6ResultL: "✅ Luas Arsiran", k6ResultLV: "154 cm²",
    k6ResultK: "✅ Keliling Arsiran", k6ResultKV: "88 cm",
    k7Title: "✏️ Kasus 7 — Sektor Siku-Siku (¼ Lingkaran) r = 10 cm (π = 3,14)",
    k7Badge: "🔮 Soal", k7Soal: "Sebuah lingkaran berjari-jari 10 cm dengan pusat O. Daerah arsiran adalah sektor (juring) berbentuk sudut siku-siku (90°). Hitunglah (a) luas sektor yang diarsir dan (b) kelilingnya!",
    k7Sol: "📋 Pembahasan",
    k7Known: "Diketahui:", k7KnownV: " r = 10 cm, sudut sektor = 90° = ¼ lingkaran penuh.",
    k7a: "(a) Luas sektor:", k7b: "(b) Keliling sektor:",
    k7bNote: "Dua jari-jari (OA dan OB) + panjang busur AB:",
    k7ResultL: "✅ Luas Sektor", k7ResultLV: "78,5 cm²",
    k7ResultK: "✅ Keliling Sektor", k7ResultKV: "35,7 cm",
    k8Title: "✏️ Kasus 8 — Bangun Es Krim: Setengah Lingkaran + Segitiga (π = 3,14)",
    k8Badge: "🍦 Soal", k8Soal: "Sebuah bangun berbentuk \"es krim\" terdiri dari setengah lingkaran di bagian atas dan segitiga sama kaki di bagian bawah. Diameter bagian atas = 20 cm, tinggi segitiga = 24 cm, dan panjang sisi miring segitiga = 26 cm. Hitunglah (a) luas bangun dan (b) keliling bangun tersebut!",
    k8Sol: "📋 Pembahasan",
    k8Known: "Diketahui:", k8KnownV: " diameter = 20 cm → r = 10 cm, tinggi segitiga t = 24 cm, sisi miring s = 26 cm, alas segitiga = diameter = 20 cm.",
    k8a: "(a) Luas bangun:", k8aNote: "Luas = Luas setengah lingkaran + Luas segitiga",
    k8b: "(b) Keliling bangun:", k8bNote: "Keliling = busur setengah lingkaran + 2 × sisi miring segitiga",
    k8bNote2: "(Alas segitiga/diameter tidak dihitung karena berimpit dengan diameter setengah lingkaran)",
    k8ResultL: "✅ Luas Bangun", k8ResultLV: "397 cm²",
    k8ResultK: "✅ Keliling Bangun", k8ResultKV: "83,4 cm",
    k9Title: "✏️ Kasus 9 — Trapesium + Seperempat Lingkaran di Kiri (π = 22/7)",
    k9Badge: "🔷 Soal", k9Soal: "Sebuah bangun gabungan terdiri dari trapesium simetris di bagian kanan (sisi sejajar 28 cm dan 42 cm, tinggi 14 cm) dan seperempat lingkaran di bagian kiri dengan jari-jari 14 cm. Hitunglah luas bangun tersebut!",
    k9Sol: "📋 Pembahasan",
    k9Known: "Diketahui:", k9KnownV: " Trapesium: a₁ = 28 cm, a₂ = 42 cm, t = 14 cm. Seperempat lingkaran: r = 14 cm.",
    k9LT: "Luas trapesium:", k9LQ: "Luas seperempat lingkaran:", k9LTotal: "Total luas:",
    k9Result: "✅ Luas Bangun", k9ResultV: "644 cm²",
    k10Title: "✏️ Kasus 10 — Seperempat Lingkaran (π = 22/7)",
    k10Badge: "🔵 Soal", k10Soal: "Sebuah bangun berbentuk seperempat lingkaran dengan jari-jari 14 cm. Hitunglah (a) luas dan (b) keliling daerah tersebut!",
    k10Sol: "📋 Pembahasan",
    k10Known: "Diketahui:", k10KnownV: " r = 14 cm.",
    k10a: "(a) Luas:", k10b: "(b) Keliling", k10bV: "= 2 jari-jari + busur:",
    k10ResultL: "✅ Luas", k10ResultLV: "154 cm²",
    k10ResultK: "✅ Keliling", k10ResultKV: "50 cm",
    k11Title: "✏️ Kasus 11 — Setengah Cincin: R = 14 cm, r = 7 cm (π = 22/7)",
    k11Badge: "🌀 Soal", k11Soal: "Sebuah bangun berbentuk setengah cincin (half-annulus) dengan jari-jari luar R = 14 cm dan jari-jari dalam r = 7 cm. Hitunglah (a) luas dan (b) keliling daerah arsiran!",
    k11Sol: "📋 Pembahasan",
    k11Known: "Diketahui:", k11KnownV: " R = 14 cm, r = 7 cm.",
    k11a: "(a) Luas setengah cincin:", k11b: "(b) Keliling", k11bV: "= busur luar + busur dalam + 2 × (R − r):",
    k11ResultL: "✅ Luas", k11ResultLV: "231 cm²",
    k11ResultK: "✅ Keliling", k11ResultKV: "80 cm",
    k12Title: "✏️ Kasus 12 — Persegi dikurangi Dua Seperempat Lingkaran (π = 22/7)",
    k12Badge: "⬛ Soal", k12Soal: "Pada sebuah persegi dengan sisi 14 cm, dibuat dua buah seperempat lingkaran berhadapan (masing-masing di sudut kanan atas dan sudut kiri bawah) dengan jari-jari 7 cm. Daerah yang diarsir (persegi dikurangi kedua seperempat lingkaran) adalah luas yang dicari. Hitunglah luas daerah arsiran!",
    k12Sol: "📋 Pembahasan",
    k12Known: "Diketahui:", k12KnownV: " sisi persegi = 14 cm, jari-jari tiap seperempat lingkaran r = 7 cm.",
    k12LP: "Luas persegi:", k12LQ: "Luas 2 seperempat lingkaran", k12LQV: "= luas ½ lingkaran:",
    k12LA: "Luas arsiran:",
    k12Result: "✅ Luas Arsiran", k12ResultV: "119 cm²",
    k13Title: "✏️ Kasus 13 — Gabungan Dua Setengah Lingkaran: Besar Atas + Kecil Bawah (π = 22/7)",
    k13Badge: "🔵 Soal", k13Soal: "Daerah arsiran pada gambar terbentuk dari gabungan setengah lingkaran besar (diameter 26 cm, menghadap ke atas) dan setengah lingkaran kecil (diameter 14 cm, menghadap ke bawah) yang terletak berdampingan pada garis dasar yang sama. Hitunglah (a) luas dan (b) keliling daerah arsiran!",
    k13Sol: "📋 Pembahasan",
    k13Known: "Diketahui:", k13KnownV: " diameter besar = 26 cm → R = 13 cm; diameter kecil = 14 cm → r = 7 cm",
    k13a: "(a) Luas daerah arsiran:", k13aNote: "Luas = ½ lingkaran besar + ½ lingkaran kecil",
    k13b: "(b) Keliling daerah arsiran:",
    k13bNote: "Keliling = busur setengah lingkaran besar + busur setengah lingkaran kecil (tidak ada sisi lurus yang terekspos)",
    k13Tip: "💡 Perhatikan: garis dasar bersama bukan bagian dari keliling, karena ia menghubungkan dua bangun di \"dalam\" — hanya busur keduanya yang membentuk batas luar.",
    k13ResultL: "✅ Luas", k13ResultLV: "342 4⁄7 cm²",
    k13ResultK: "✅ Keliling", k13ResultKV: "62 6⁄7 cm",
    k14Title: "✏️ Kasus 14 — Daun Diagonal dalam Persegi 7 cm (π = 22/7)",
    k14Badge: "🍃 Soal", k14Soal: "Di dalam persegi bersisi 7 cm, dua busur seperempat lingkaran (jari-jari = 7 cm) ditarik dari dua sudut yang berseberangan sehingga membentuk \"daun\" di tengah. Hitunglah (a) luas daun (daerah arsiran) dan (b) kelilingnya!",
    k14Sol: "📋 Pembahasan",
    k14Known: "Diketahui:", k14KnownV: " sisi persegi a = r = 7 cm.",
    k14LNote: "Luas daun = 2 × (luas sektor − luas segitiga):",
    k14KNote: "(b) Keliling daun:", k14KNoteV: "Dua busur seperempat lingkaran:",
    k14ResultL: "✅ Luas Daun", k14ResultLV: "28 cm²",
    k14ResultK: "✅ Keliling Daun", k14ResultKV: "22 cm",
    k15Title: "✏️ Kasus 15 — Bunga 4 Kelopak dalam Persegi 14 cm (π = 22/7)",
    k15Badge: "🌸 Soal", k15Soal: "Di dalam persegi bersisi 14 cm, dari keempat sudutnya dibuat busur seperempat lingkaran (r = 14 cm). Pasangan busur yang saling berpotongan membentuk 4 buah kelopak bunga. Hitunglah luas total keempat kelopak yang diarsir!",
    k15Sol: "📋 Pembahasan",
    k15Known: "Diketahui:", k15KnownV: " sisi persegi a = 14 cm, r = 14 cm.",
    k15Note1: "Setiap kelopak = irisan dua sektor yang berpusat di sudut-sudut berdekatan.",
    k15Note2: "Luas 1 kelopak =", k15Note2V: "(sama rumusnya dengan daun diagonal):",
    k15Note3: "Namun dalam susunan ini ada 4 kelopak, masing-masing dihitung sebagai irisan dua busur berdekatan:",
    k15Note4: "*Tiap kelopak dihitung dengan r = 14 cm (sisi penuh), luas 1 kelopak = 28 cm²",
    k15Result: "✅ Luas 4 Kelopak", k15ResultV: "112 cm²",
    rangkumanTitle: "📌 Rangkuman — Peta Rumus Daerah Arsiran",
    rangkumanCards: [
      { emoji: "🔶", title: "Lingkaran Dalam Persegi", luas: "L = a^2 - \\pi r^2", keliling: "K = 4a + 2\\pi r" },
      { emoji: "🔵", title: "Persegi Panjang + ½ Lingkaran", luas: "L = p \\cdot t + \\tfrac{1}{2}\\pi r^2", keliling: "K = 2t + p + \\pi r" },
      { emoji: "🔺", title: "Segitiga − Lingkaran Dalam", luas: "L = L_\\triangle - \\pi r^2", keliling: "K = (a+b+c) + 2\\pi r" },
      { emoji: "🟩", title: "Persegi Panjang − Lingkaran", luas: "L = p \\cdot l - \\pi r^2", keliling: "K = 2(p+l) + 2\\pi r" },
    ],
    rangkumanLuas: "Luas:",
    rangkumanKeliling: "Keliling:",
    rangkumanTip: "🚀 Tips Bintang: Untuk semua soal daerah arsiran, ikuti langkah ini:",
    rangkumanStep1: "① Gambar sketsa",
    rangkumanStep2: "② Identifikasi bangun",
    rangkumanStep3: "③ Tentukan operasi (+/−)",
    rangkumanStep4: "④ Hitung luas dan keliling terpisah",
    backBtn: "← Kembali ke Lingkaran",
  },
  en: {
    badge: "GRADE 8 · CIRCLE · MATERIAL",
    h1: "CIRCLES AND\nOTHER PLANE FIGURES",
    subtitle: "Area & Perimeter of Shaded Regions · Composite Figures",
    introTitle: "💡 What Is a Shaded Region?",
    introP: "In math problems, we often see plane figures that overlap or are nested inside each other. The shaded region is the focus of the question — it could be remaining corners, a union of two shapes, or an area \"cut out\" by a circle.",
    introEmphasis: "overlap",
    introEmphasis2: "shaded",
    introCats: [
      { color: "#f97316", label: "Subtraction", desc: "Shaded = Large Shape − Small Shape" },
      { color: "#06b6d4", label: "Addition", desc: "Shaded = Area A + Area B" },
      { color: "#a855f7", label: "Mixed", desc: "Combination of arcs and straight sides" },
    ],
    introKey: "🔑 Key idea: First identify which shape is added and which is subtracted. Then calculate area and perimeter separately.",
    introKeyBold: "Key idea:",
    introKeyRest: " First identify which shape is added and which is subtracted. Then calculate area and perimeter separately.",
    k1Title: "✏️ Case 1 — Composite Shape: Rectangle + Semicircle (π = 22/7)",
    k1Badge: "🔵 Problem", k1Soal: "A composite figure consists of a 21 cm × 21 cm rectangle and a semicircle attached to one of its vertical sides. Find (a) the area of the composite figure and (b) its perimeter!",
    k1Sol: "📋 Solution",
    k1Known: "Given:", k1KnownV: " length = width = 21 cm, semicircle with",
    k1a: "(a) Area of composite figure:", k1b: "(b) Perimeter of composite figure:",
    k1bNote: "Top side + bottom side + left side + semicircle arc (right side):",
    k1ResultL: "✅ Area", k1ResultLV: "614.25 cm²",
    k1ResultK: "✅ Perimeter", k1ResultKV: "96 cm",
    k2Title: "✏️ Case 2 — Rectangle 28×14 Minus Two Semicircles (π = 22/7)",
    k2Badge: "🟡 Problem", k2Soal: "See the figure below! A rectangle measures 28 cm × 14 cm. From its left and right sides, one semicircle each is removed. Find (a) the area of the shaded region and (b) the perimeter of the shaded region!",
    k2Sol: "📋 Solution",
    k2Known: "Given:", k2KnownV: " length = 28 cm, width = 14 cm. Semicircle diameter = 14 cm, so",
    k2KnownV2: "cm. Two semicircles = one full circle.",
    k2a: "(a) Area of shaded region:", k2b: "(b) Perimeter of shaded region:",
    k2bNote: "Top side (28cm) + bottom side (28cm) + left arc",
    k2bNote2: "right arc",
    k2ResultL: "✅ Shaded Area", k2ResultLV: "238 cm²",
    k2ResultK: "✅ Shaded Perimeter", k2ResultKV: "100 cm",
    k3Title: "✏️ Case 3 — Large Semicircle Minus Small Semicircle (π = 3.14)",
    k3Badge: "🌹 Problem", k3Soal: "The shaded region forms a \"comma\" (half-annulus). A large semicircle has diameter 20 cm and a small semicircle with diameter 10 cm is removed from inside it. Find (a) the area and (b) the perimeter!",
    k3Sol: "📋 Solution",
    k3Known: "Given:", k3KnownV: " R = 10 cm (large), r = 5 cm (small)",
    k3a: "(a) Area of shaded region:", k3b: "(b) Perimeter of shaded region:",
    k3bNote: "Large arc + small arc + 2 connecting segments:",
    k3ResultL: "✅ Shaded Area", k3ResultLV: "117.75 cm²",
    k3ResultK: "✅ Shaded Perimeter", k3ResultKV: "57.1 cm",
    k4Title: "✏️ Case 4 — Quarter Circle r = 10 cm (π = 3.14)",
    k4Badge: "🟢 Problem", k4Soal: "See the figure below! The shaded region is a quarter circle with radius 10 cm. Find (a) the area and (b) the perimeter of the shaded region!",
    k4Sol: "📋 Solution",
    k4Known: "Given:", k4KnownV: " r = 10 cm, π = 3.14",
    k4a: "(a) Area of quarter circle:", k4b: "(b) Perimeter of shaded region:",
    k4bNote: "Two radii (straight sides) + quarter-circle arc:",
    k4ResultL: "✅ Shaded Area", k4ResultLV: "78.5 cm²",
    k4ResultK: "✅ Shaded Perimeter", k4ResultKV: "35.7 cm",
    k5Title: "✏️ Case 5 — 4-Pointed Star from Arcs in a 14 cm Square (π = 22/7)",
    k5Badge: "⭐ Problem", k5Soal: "Inside a 14 cm square, quarter-circle arcs (radius = 14 cm) are drawn from each of the four corners. The four arcs form a 4-pointed star in the center. Find the area of the shaded star!",
    k5Sol: "📋 Solution",
    k5Known: "Given:", k5KnownV: " side a = 14 cm, r = 14 cm",
    k5Hint: "Star area = Square area − 4 × corner segments",
    k5Hint2: "Each corner is cut by two arcs, leaving a \"lens\" shape at each corner.",
    k5Use: "Use:", k5AltNote: "💡 Alternative formula:",
    k5Result: "✅ Star Area", k5ResultV: "224 cm²",
    k6Title: "✏️ Case 6 — Triple Arc: Large Arc Minus 2 Small Arcs (π = 22/7)",
    k6Badge: "🌊 Problem", k6Soal: "The shaded region forms a \"triple arch\" inside a 28 cm × 14 cm rectangle. One large semicircle (R = 14 cm) is on top, with two small semicircles (r = 7 cm) cut from below. Find (a) the shaded area and (b) the shaded perimeter!",
    k6Sol: "📋 Solution",
    k6Known: "Given:", k6KnownV: " R = 14 cm (large), r = 7 cm (small × 2)",
    k6a: "(a) Shaded area:", k6b: "(b) Shaded perimeter:",
    k6bNote: "Large arc + 2 small arcs (facing opposite directions):",
    k6ResultL: "✅ Shaded Area", k6ResultLV: "154 cm²",
    k6ResultK: "✅ Shaded Perimeter", k6ResultKV: "88 cm",
    k7Title: "✏️ Case 7 — Right-angle Sector (¼ Circle) r = 10 cm (π = 3.14)",
    k7Badge: "🔮 Problem", k7Soal: "A circle has radius 10 cm with center O. The shaded region is a 90° sector. Find (a) the sector area and (b) the perimeter!",
    k7Sol: "📋 Solution",
    k7Known: "Given:", k7KnownV: " r = 10 cm, sector angle = 90° = ¼ full circle.",
    k7a: "(a) Sector area:", k7b: "(b) Sector perimeter:",
    k7bNote: "Two radii (OA and OB) + arc length AB:",
    k7ResultL: "✅ Sector Area", k7ResultLV: "78.5 cm²",
    k7ResultK: "✅ Sector Perimeter", k7ResultKV: "35.7 cm",
    k8Title: "✏️ Case 8 — Ice Cream Shape: Semicircle + Triangle (π = 3.14)",
    k8Badge: "🍦 Problem", k8Soal: "A figure shaped like an \"ice cream\" consists of a semicircle on top and an isosceles triangle below. Diameter = 20 cm, triangle height = 24 cm, slant side = 26 cm. Find (a) the area and (b) the perimeter!",
    k8Sol: "📋 Solution",
    k8Known: "Given:", k8KnownV: " diameter = 20 cm → r = 10 cm, height h = 24 cm, slant s = 26 cm, base = diameter = 20 cm.",
    k8a: "(a) Area:", k8aNote: "Area = Semicircle area + Triangle area",
    k8b: "(b) Perimeter:", k8bNote: "Perimeter = semicircle arc + 2 × slant side",
    k8bNote2: "(The base/diameter is not counted as it coincides with the diameter of the semicircle)",
    k8ResultL: "✅ Area", k8ResultLV: "397 cm²",
    k8ResultK: "✅ Perimeter", k8ResultKV: "83.4 cm",
    k9Title: "✏️ Case 9 — Trapezoid + Quarter Circle on Left (π = 22/7)",
    k9Badge: "🔷 Problem", k9Soal: "A composite figure consists of a symmetric trapezoid on the right (parallel sides 28 cm and 42 cm, height 14 cm) and a quarter circle on the left with radius 14 cm. Find the total area!",
    k9Sol: "📋 Solution",
    k9Known: "Given:", k9KnownV: " Trapezoid: a₁ = 28 cm, a₂ = 42 cm, h = 14 cm. Quarter circle: r = 14 cm.",
    k9LT: "Trapezoid area:", k9LQ: "Quarter circle area:", k9LTotal: "Total area:",
    k9Result: "✅ Total Area", k9ResultV: "644 cm²",
    k10Title: "✏️ Case 10 — Quarter Circle (π = 22/7)",
    k10Badge: "🔵 Problem", k10Soal: "A figure is a quarter circle with radius 14 cm. Find (a) the area and (b) the perimeter!",
    k10Sol: "📋 Solution",
    k10Known: "Given:", k10KnownV: " r = 14 cm.",
    k10a: "(a) Area:", k10b: "(b) Perimeter", k10bV: "= 2 radii + arc:",
    k10ResultL: "✅ Area", k10ResultLV: "154 cm²",
    k10ResultK: "✅ Perimeter", k10ResultKV: "50 cm",
    k11Title: "✏️ Case 11 — Half-Annulus: R = 14 cm, r = 7 cm (π = 22/7)",
    k11Badge: "🌀 Problem", k11Soal: "A half-annulus has outer radius R = 14 cm and inner radius r = 7 cm. Find (a) the area and (b) the perimeter of the shaded region!",
    k11Sol: "📋 Solution",
    k11Known: "Given:", k11KnownV: " R = 14 cm, r = 7 cm.",
    k11a: "(a) Half-annulus area:", k11b: "(b) Perimeter", k11bV: "= outer arc + inner arc + 2 × (R − r):",
    k11ResultL: "✅ Area", k11ResultLV: "231 cm²",
    k11ResultK: "✅ Perimeter", k11ResultKV: "80 cm",
    k12Title: "✏️ Case 12 — Square Minus Two Quarter Circles (π = 22/7)",
    k12Badge: "⬛ Problem", k12Soal: "In a 14 cm square, two opposite quarter circles (radius = 7 cm) are drawn at the top-right and bottom-left corners. The shaded region (square minus the two quarter circles) is the target. Find the shaded area!",
    k12Sol: "📋 Solution",
    k12Known: "Given:", k12KnownV: " side = 14 cm, quarter-circle radius r = 7 cm.",
    k12LP: "Square area:", k12LQ: "Area of 2 quarter circles", k12LQV: "= area of ½ circle:",
    k12LA: "Shaded area:",
    k12Result: "✅ Shaded Area", k12ResultV: "119 cm²",
    k13Title: "✏️ Case 13 — Union of Two Semicircles: Large Up + Small Down (π = 22/7)",
    k13Badge: "🔵 Problem", k13Soal: "The shaded region is formed by the union of a large semicircle (diameter 26 cm, facing up) and a small semicircle (diameter 14 cm, facing down) that share the same baseline. Find (a) the area and (b) the perimeter!",
    k13Sol: "📋 Solution",
    k13Known: "Given:", k13KnownV: " large diameter = 26 cm → R = 13 cm; small diameter = 14 cm → r = 7 cm",
    k13a: "(a) Shaded area:", k13aNote: "Area = ½ large circle + ½ small circle",
    k13b: "(b) Shaded perimeter:",
    k13bNote: "Perimeter = large semicircle arc + small semicircle arc (no exposed straight sides)",
    k13Tip: "💡 Note: the shared baseline is not part of the perimeter, as it connects the two shapes internally — only the arcs form the outer boundary.",
    k13ResultL: "✅ Area", k13ResultLV: "342 4⁄7 cm²",
    k13ResultK: "✅ Perimeter", k13ResultKV: "62 6⁄7 cm",
    k14Title: "✏️ Case 14 — Diagonal Leaf in a 7 cm Square (π = 22/7)",
    k14Badge: "🍃 Problem", k14Soal: "Inside a 7 cm square, two quarter-circle arcs (radius = 7 cm) are drawn from opposite corners, forming a \"leaf\" in the center. Find (a) the leaf area and (b) its perimeter!",
    k14Sol: "📋 Solution",
    k14Known: "Given:", k14KnownV: " side a = r = 7 cm.",
    k14LNote: "Leaf area = 2 × (sector area − triangle area):",
    k14KNote: "(b) Leaf perimeter:", k14KNoteV: "Two quarter-circle arcs:",
    k14ResultL: "✅ Leaf Area", k14ResultLV: "28 cm²",
    k14ResultK: "✅ Leaf Perimeter", k14ResultKV: "22 cm",
    k15Title: "✏️ Case 15 — 4-Petal Flower in a 14 cm Square (π = 22/7)",
    k15Badge: "🌸 Problem", k15Soal: "Inside a 14 cm square, quarter-circle arcs (r = 14 cm) are drawn from all four corners. Pairs of intersecting arcs form 4 petals. Find the total area of the four shaded petals!",
    k15Sol: "📋 Solution",
    k15Known: "Given:", k15KnownV: " side a = 14 cm, r = 14 cm.",
    k15Note1: "Each petal = intersection of two sectors centered at adjacent corners.",
    k15Note2: "Area of 1 petal =", k15Note2V: "(same formula as the diagonal leaf):",
    k15Note3: "With 4 petals, each counted as the intersection of two adjacent arcs:",
    k15Note4: "*Each petal uses r = 14 cm (full side), so 1 petal area = 28 cm²",
    k15Result: "✅ 4 Petals Area", k15ResultV: "112 cm²",
    rangkumanTitle: "📌 Summary — Shaded Region Formula Map",
    rangkumanCards: [
      { emoji: "🔶", title: "Circle Inside Square", luas: "L = a^2 - \\pi r^2", keliling: "K = 4a + 2\\pi r" },
      { emoji: "🔵", title: "Rectangle + ½ Circle", luas: "L = p \\cdot t + \\tfrac{1}{2}\\pi r^2", keliling: "K = 2t + p + \\pi r" },
      { emoji: "🔺", title: "Triangle − Incircle", luas: "L = L_\\triangle - \\pi r^2", keliling: "K = (a+b+c) + 2\\pi r" },
      { emoji: "🟩", title: "Rectangle − Circle", luas: "L = p \\cdot l - \\pi r^2", keliling: "K = 2(p+l) + 2\\pi r" },
    ],
    rangkumanLuas: "Area:",
    rangkumanKeliling: "Perimeter:",
    rangkumanTip: "🚀 Star Tip: For all shaded region problems, follow these steps:",
    rangkumanStep1: "① Sketch it",
    rangkumanStep2: "② Identify shapes",
    rangkumanStep3: "③ Determine operation (+/−)",
    rangkumanStep4: "④ Calculate area and perimeter separately",
    backBtn: "← Back to Circle",
  },
  ja: {
    badge: "中学2年 · 円 · 数学教材",
    h1: "円と他の平面図形の\n関係",
    subtitle: "着色域の面積と周長 · 複合図形",
    introTitle: "💡 着色域とは？",
    introP: "数学の問題では、平面図形が重なり合ったり、入れ子になったりする図をよく見かけます。着色された部分が問題の焦点です — 残った角、2つの図形の合計、または円に「切り取られた」領域です。",
    introEmphasis: "重なり合っ",
    introEmphasis2: "着色された",
    introCats: [
      { color: "#f97316", label: "引き算", desc: "着色域 = 大きな図形 − 小さな図形" },
      { color: "#06b6d4", label: "足し算", desc: "着色域 = 図形A + 図形B" },
      { color: "#a855f7", label: "混合", desc: "弧と直線辺の組み合わせ" },
    ],
    introKey: "🔑 鍵となる考え: まずどの図形を足してどの図形を引くかを特定する。その後、面積と周長を別々に計算する。",
    introKeyBold: "鍵となる考え:",
    introKeyRest: " まずどの図形を足してどの図形を引くかを特定する。その後、面積と周長を別々に計算する。",
    k1Title: "✏️ ケース1 — 複合図形：長方形 + 半円（π = 22/7）",
    k1Badge: "🔵 問題", k1Soal: "21 cm × 21 cmの長方形に、その一辺に接する半円を組み合わせた複合図形がある。(a) 面積と(b) 周長を求めなさい！",
    k1Sol: "📋 解説",
    k1Known: "既知：", k1KnownV: " 縦 = 横 = 21 cm、半円の",
    k1a: "(a) 複合図形の面積：", k1b: "(b) 複合図形の周長：",
    k1bNote: "上辺 + 下辺 + 左辺 + 半円の弧（右辺）：",
    k1ResultL: "✅ 面積", k1ResultLV: "614.25 cm²",
    k1ResultK: "✅ 周長", k1ResultKV: "96 cm",
    k2Title: "✏️ ケース2 — 長方形28×14から半円2つを引く（π = 22/7）",
    k2Badge: "🟡 問題", k2Soal: "下の図を見てください！28 cm × 14 cmの長方形の左右の辺からそれぞれ半円を切り取ります。(a) 着色域の面積と(b) 周長を求めなさい！",
    k2Sol: "📋 解説",
    k2Known: "既知：", k2KnownV: " 長さ = 28 cm、幅 = 14 cm。半円の直径 = 14 cm → r =",
    k2KnownV2: "cm。半円2つ = 円1つ分。",
    k2a: "(a) 着色域の面積：", k2b: "(b) 着色域の周長：",
    k2bNote: "上辺(28cm) + 下辺(28cm) + 左弧",
    k2bNote2: "右弧",
    k2ResultL: "✅ 着色面積", k2ResultLV: "238 cm²",
    k2ResultK: "✅ 着色周長", k2ResultKV: "100 cm",
    k3Title: "✏️ ケース3 — 大きな半円から小さな半円を引く（π = 3.14）",
    k3Badge: "🌹 問題", k3Soal: "着色域は「コンマ」型（半環状）。直径20 cmの大きな半円から直径10 cmの小さな半円を取り除いた形。(a) 面積と(b) 周長を求めなさい！",
    k3Sol: "📋 解説",
    k3Known: "既知：", k3KnownV: " R = 10 cm（大）、r = 5 cm（小）",
    k3a: "(a) 着色域の面積：", k3b: "(b) 着色域の周長：",
    k3bNote: "大きな弧 + 小さな弧 + 2つの連結線分：",
    k3ResultL: "✅ 着色面積", k3ResultLV: "117.75 cm²",
    k3ResultK: "✅ 着色周長", k3ResultKV: "57.1 cm",
    k4Title: "✏️ ケース4 — 四分の一円 r = 10 cm（π = 3.14）",
    k4Badge: "🟢 問題", k4Soal: "下の図の着色域は半径10 cmの四分の一円です。(a) 着色域の面積と(b) 周長を求めなさい！",
    k4Sol: "📋 解説",
    k4Known: "既知：", k4KnownV: " r = 10 cm、π = 3.14",
    k4a: "(a) 四分の一円の面積：", k4b: "(b) 着色域の周長：",
    k4bNote: "2本の半径（直線辺）+ 四分の一円の弧：",
    k4ResultL: "✅ 着色面積", k4ResultLV: "78.5 cm²",
    k4ResultK: "✅ 着色周長", k4ResultKV: "35.7 cm",
    k5Title: "✏️ ケース5 — 14 cm正方形内の4点星（π = 22/7）",
    k5Badge: "⭐ 問題", k5Soal: "14 cmの正方形の4つの角から四分の一円の弧（半径 = 14 cm）を描く。4本の弧が中央に4点星を作る。着色された星の面積を求めなさい！",
    k5Sol: "📋 解説",
    k5Known: "既知：", k5KnownV: " 辺 a = 14 cm、r = 14 cm",
    k5Hint: "星の面積 = 正方形の面積 − 4 × 角の弧分",
    k5Hint2: "各角は2本の弧に切り取られ、各角に「レンズ型」が残る。",
    k5Use: "使う公式：", k5AltNote: "💡 別の公式：",
    k5Result: "✅ 星の面積", k5ResultV: "224 cm²",
    k6Title: "✏️ ケース6 — 三重弧：大きな弧 − 小さな弧2本（π = 22/7）",
    k6Badge: "🌊 問題", k6Soal: "28 cm × 14 cmの長方形内に「三重弧」の着色域がある。大きな半円（R = 14 cm）が上にあり、小さな半円2つ（r = 7 cm）が下から切り取られる。(a) 面積と(b) 周長を求めなさい！",
    k6Sol: "📋 解説",
    k6Known: "既知：", k6KnownV: " R = 14 cm（大）、r = 7 cm（小 × 2）",
    k6a: "(a) 着色面積：", k6b: "(b) 着色周長：",
    k6bNote: "大きな弧 + 2本の小さな弧（向かい合う方向）：",
    k6ResultL: "✅ 着色面積", k6ResultLV: "154 cm²",
    k6ResultK: "✅ 着色周長", k6ResultKV: "88 cm",
    k7Title: "✏️ ケース7 — 直角扇形（1/4円）r = 10 cm（π = 3.14）",
    k7Badge: "🔮 問題", k7Soal: "中心Oの半径10 cmの円がある。着色域は90°の扇形。(a) 扇形の面積と(b) 周長を求めなさい！",
    k7Sol: "📋 解説",
    k7Known: "既知：", k7KnownV: " r = 10 cm、扇形の角度 = 90° = 1/4円。",
    k7a: "(a) 扇形の面積：", k7b: "(b) 扇形の周長：",
    k7bNote: "2本の半径（OAとOB）+ 弧ABの長さ：",
    k7ResultL: "✅ 扇形の面積", k7ResultLV: "78.5 cm²",
    k7ResultK: "✅ 扇形の周長", k7ResultKV: "35.7 cm",
    k8Title: "✏️ ケース8 — アイスクリーム形：半円 + 三角形（π = 3.14）",
    k8Badge: "🍦 問題", k8Soal: "「アイスクリーム」形の図形は上に半円、下に二等辺三角形。直径 = 20 cm、三角形の高さ = 24 cm、斜辺 = 26 cm。(a) 面積と(b) 周長を求めなさい！",
    k8Sol: "📋 解説",
    k8Known: "既知：", k8KnownV: " 直径 = 20 cm → r = 10 cm、高さ h = 24 cm、斜辺 s = 26 cm、底辺 = 直径 = 20 cm。",
    k8a: "(a) 面積：", k8aNote: "面積 = 半円の面積 + 三角形の面積",
    k8b: "(b) 周長：", k8bNote: "周長 = 半円の弧 + 2 × 斜辺",
    k8bNote2: "（底辺/直径は半円の直径と重なるため計算しない）",
    k8ResultL: "✅ 面積", k8ResultLV: "397 cm²",
    k8ResultK: "✅ 周長", k8ResultKV: "83.4 cm",
    k9Title: "✏️ ケース9 — 台形 + 左の四分の一円（π = 22/7）",
    k9Badge: "🔷 問題", k9Soal: "右側に対称台形（平行辺28 cmと42 cm、高さ14 cm）、左側に半径14 cmの四分の一円を組み合わせた複合図形。総面積を求めなさい！",
    k9Sol: "📋 解説",
    k9Known: "既知：", k9KnownV: " 台形：a₁ = 28 cm、a₂ = 42 cm、h = 14 cm。四分の一円：r = 14 cm。",
    k9LT: "台形の面積：", k9LQ: "四分の一円の面積：", k9LTotal: "総面積：",
    k9Result: "✅ 総面積", k9ResultV: "644 cm²",
    k10Title: "✏️ ケース10 — 四分の一円（π = 22/7）",
    k10Badge: "🔵 問題", k10Soal: "半径14 cmの四分の一円の図形。(a) 面積と(b) 周長を求めなさい！",
    k10Sol: "📋 解説",
    k10Known: "既知：", k10KnownV: " r = 14 cm。",
    k10a: "(a) 面積：", k10b: "(b) 周長", k10bV: "= 2本の半径 + 弧：",
    k10ResultL: "✅ 面積", k10ResultLV: "154 cm²",
    k10ResultK: "✅ 周長", k10ResultKV: "50 cm",
    k11Title: "✏️ ケース11 — 半環状：R = 14 cm、r = 7 cm（π = 22/7）",
    k11Badge: "🌀 問題", k11Soal: "外半径R = 14 cm、内半径r = 7 cmの半環状の図形。(a) 面積と(b) 周長を求めなさい！",
    k11Sol: "📋 解説",
    k11Known: "既知：", k11KnownV: " R = 14 cm、r = 7 cm。",
    k11a: "(a) 半環状の面積：", k11b: "(b) 周長", k11bV: "= 外側の弧 + 内側の弧 + 2 × (R − r)：",
    k11ResultL: "✅ 面積", k11ResultLV: "231 cm²",
    k11ResultK: "✅ 周長", k11ResultKV: "80 cm",
    k12Title: "✏️ ケース12 — 正方形から四分の一円2つを引く（π = 22/7）",
    k12Badge: "⬛ 問題", k12Soal: "14 cmの正方形の右上と左下の角に半径7 cmの四分の一円が描かれている。着色域（正方形 − 2つの四分の一円）の面積を求めなさい！",
    k12Sol: "📋 解説",
    k12Known: "既知：", k12KnownV: " 辺 = 14 cm、四分の一円の半径 r = 7 cm。",
    k12LP: "正方形の面積：", k12LQ: "四分の一円2つの面積", k12LQV: "= 半円1つ分：",
    k12LA: "着色域の面積：",
    k12Result: "✅ 着色面積", k12ResultV: "119 cm²",
    k13Title: "✏️ ケース13 — 半円2つの合体：大きな上向き + 小さな下向き（π = 22/7）",
    k13Badge: "🔵 問題", k13Soal: "着色域は大きな半円（直径26 cm、上向き）と小さな半円（直径14 cm、下向き）を同じ基準線上に並べて合体させた形。(a) 面積と(b) 周長を求めなさい！",
    k13Sol: "📋 解説",
    k13Known: "既知：", k13KnownV: " 大径 = 26 cm → R = 13 cm; 小径 = 14 cm → r = 7 cm",
    k13a: "(a) 着色面積：", k13aNote: "面積 = 大きな半円 + 小さな半円",
    k13b: "(b) 着色周長：",
    k13bNote: "周長 = 大きな半円の弧 + 小さな半円の弧（露出した直線辺なし）",
    k13Tip: "💡 注意：共通の基準線は周長に含まれません（内部で2つの図形をつなぐため）— 弧だけが外周を形成します。",
    k13ResultL: "✅ 面積", k13ResultLV: "342 4⁄7 cm²",
    k13ResultK: "✅ 周長", k13ResultKV: "62 6⁄7 cm",
    k14Title: "✏️ ケース14 — 7 cm正方形の対角「葉」（π = 22/7）",
    k14Badge: "🍃 問題", k14Soal: "7 cmの正方形の対角の2頂点から四分の一円の弧（半径 = 7 cm）を描き、中央に「葉」を作る。(a) 葉の面積と(b) 周長を求めなさい！",
    k14Sol: "📋 解説",
    k14Known: "既知：", k14KnownV: " 辺 a = r = 7 cm。",
    k14LNote: "葉の面積 = 2 × (扇形の面積 − 三角形の面積)：",
    k14KNote: "(b) 葉の周長：", k14KNoteV: "2本の四分の一円弧：",
    k14ResultL: "✅ 葉の面積", k14ResultLV: "28 cm²",
    k14ResultK: "✅ 葉の周長", k14ResultKV: "22 cm",
    k15Title: "✏️ ケース15 — 14 cm正方形の4枚花びら（π = 22/7）",
    k15Badge: "🌸 問題", k15Soal: "14 cmの正方形の4つの角から四分の一円の弧（r = 14 cm）を描く。交差する弧のペアが4枚の花びらを作る。4枚の着色された花びらの総面積を求めなさい！",
    k15Sol: "📋 解説",
    k15Known: "既知：", k15KnownV: " 辺 a = 14 cm、r = 14 cm。",
    k15Note1: "各花びら = 隣接する角を中心とする2つの扇形の交差部分。",
    k15Note2: "花びら1枚の面積 =", k15Note2V: "（対角葉と同じ公式）：",
    k15Note3: "4枚の花びら、それぞれ隣接する2本の弧の交差として計算：",
    k15Note4: "*各花びら r = 14 cm（全辺）を使用、1枚の面積 = 28 cm²",
    k15Result: "✅ 4枚の面積", k15ResultV: "112 cm²",
    rangkumanTitle: "📌 まとめ — 着色域の公式マップ",
    rangkumanCards: [
      { emoji: "🔶", title: "正方形内の円", luas: "L = a^2 - \\pi r^2", keliling: "K = 4a + 2\\pi r" },
      { emoji: "🔵", title: "長方形 + 半円", luas: "L = p \\cdot t + \\tfrac{1}{2}\\pi r^2", keliling: "K = 2t + p + \\pi r" },
      { emoji: "🔺", title: "三角形 − 内接円", luas: "L = L_\\triangle - \\pi r^2", keliling: "K = (a+b+c) + 2\\pi r" },
      { emoji: "🟩", title: "長方形 − 円", luas: "L = p \\cdot l - \\pi r^2", keliling: "K = 2(p+l) + 2\\pi r" },
    ],
    rangkumanLuas: "面積：",
    rangkumanKeliling: "周長：",
    rangkumanTip: "🚀 星のヒント：着色域の問題はすべてこの手順で：",
    rangkumanStep1: "① スケッチ",
    rangkumanStep2: "② 図形を特定",
    rangkumanStep3: "③ 演算を決定（+/−）",
    rangkumanStep4: "④ 面積と周長を別々に計算",
    backBtn: "← 円に戻る",
  },
} as const;
type T = typeof translations.id;

/* ═══════════════════════════════════════════════════════════════════
   SVG 1 – Circle inside square (4 shaded corners)
═══════════════════════════════════════════════════════════════════ */
const LingkaranDalamPersegiSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 280 250" className="w-full max-w-xs mx-auto"
    aria-label={t.badge.includes("KELAS") ? "Lingkaran di dalam persegi" : t.badge.includes("GRADE") ? "Circle inside square" : "円の中の正方形"}>
    <defs>
      <style>{`
        @keyframes arsirPulse1{0%,100%{opacity:.45;}50%{opacity:.75;}}
        @keyframes circleGlow1{0%,100%{filter:drop-shadow(0 0 6px #22d3ee);}50%{filter:drop-shadow(0 0 14px #22d3ee);}}
        @keyframes dash1{to{stroke-dashoffset:-16;}}
        .a1-fill{animation:arsirPulse1 2.2s ease-in-out infinite;}
        .a1-ring{animation:circleGlow1 2.2s ease-in-out infinite;}
        .a1-dash{animation:dash1 1.2s linear infinite;}
      `}</style>
    </defs>
    <path fillRule="evenodd" fill="#f97316" className="a1-fill"
      d="M50,30 H230 V210 H50 Z M140,120 m-90,0 a90,90,0,1,0,180,0 a90,90,0,1,0,-180,0"/>
    <rect x="50" y="30" width="180" height="180" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round"/>
    <circle cx="140" cy="120" r="90" fill="rgba(34,211,238,.12)" stroke="#22d3ee" strokeWidth="2.5" className="a1-ring"/>
    <circle cx="140" cy="120" r="3.5" fill="#22d3ee"/>
    <line x1="140" y1="120" x2="230" y2="120" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="6 3" className="a1-dash" opacity=".8"/>
    <text x="184" y="114" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>
    <text x="136" y="224" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">a = 2r</text>
    <text x="62" y="50" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".9">{t.introCats[0].label === "Dikurangi" ? "Arsiran" : t.introCats[0].label === "Subtraction" ? "Shaded" : "着色"}</text>
    <text x="62" y="62" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".9">{t.introCats[0].label === "Dikurangi" ? "= Sudut" : t.introCats[0].label === "Subtraction" ? "= Corner" : "= 角"}</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG 2 – Composite: Rectangle + Semicircle
═══════════════════════════════════════════════════════════════════ */
const BangunGabunganSVG = ({ t }: { t: T }) => {
  const isId = t.introCats[0].label === "Dikurangi";
  const isEn = t.introCats[0].label === "Subtraction";
  return (
    <svg viewBox="0 0 280 230" className="w-full max-w-xs mx-auto"
      aria-label={isId ? "Bangun gabungan" : isEn ? "Composite figure" : "複合図形"}>
      <defs>
        <style>{`
          @keyframes gabPulse{0%,100%{opacity:.35;}50%{opacity:.65;}}
          @keyframes gabGlow{0%,100%{filter:drop-shadow(0 0 6px #06b6d4);}50%{filter:drop-shadow(0 0 16px #06b6d4);}}
          .gab-fill{animation:gabPulse 2.4s ease-in-out infinite;}
          .gab-outer{animation:gabGlow 2.4s ease-in-out infinite;}
        `}</style>
      </defs>
      <path d="M50,120 A90,90,0,0,1,230,120 V210 H50 Z" fill="rgba(6,182,212,.18)" className="gab-fill"/>
      <path d="M50,120 A90,90,0,0,1,230,120 V210 H50 Z" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinejoin="round" className="gab-outer"/>
      <line x1="50" y1="120" x2="230" y2="120" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 3" opacity=".7"/>
      <text x="133" y="115" fill="#c4b5fd" fontSize="10" fontFamily="monospace">d=2r</text>
      <line x1="140" y1="120" x2="140" y2="30" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5 3" opacity=".7"/>
      <text x="145" y="78" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">r</text>
      <line x1="238" y1="120" x2="238" y2="210" stroke="#4ade80" strokeWidth="1.5" opacity=".6"/>
      <text x="244" y="170" fill="#4ade80" fontSize="10" fontFamily="monospace">t</text>
      <text x="136" y="224" fill="#06b6d4" fontSize="10" fontFamily="monospace" textAnchor="middle">2r</text>
      <circle cx="140" cy="120" r="3" fill="#06b6d4"/>
      <text x="147" y="119" fill="#67e8f9" fontSize="9" fontFamily="monospace">O</text>
      <text x="136" y="78" fill="#67e8f9" fontSize="9" fontFamily="monospace" textAnchor="end">↑ {isId ? "Setengah" : isEn ? "Half" : "半"}</text>
      <text x="136" y="89" fill="#67e8f9" fontSize="9" fontFamily="monospace" textAnchor="end">{isId ? "Lingkaran" : isEn ? "Circle" : "円"}</text>
      <text x="144" y="170" fill="#22d3ee" fontSize="9" fontFamily="monospace">{isId ? "Persegi" : isEn ? "Rect-" : "長方"}</text>
      <text x="144" y="181" fill="#22d3ee" fontSize="9" fontFamily="monospace">{isId ? "Panjang" : isEn ? "angle" : "形"}</text>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SVG 3 – Rectangle with circle cut (shaded sides)
═══════════════════════════════════════════════════════════════════ */
const PersegipanjangDanLingkaranSVG = ({ t }: { t: T }) => {
  const isId = t.introCats[0].label === "Dikurangi";
  const isEn = t.introCats[0].label === "Subtraction";
  return (
    <svg viewBox="0 0 280 240" className="w-full max-w-xs mx-auto"
      aria-label={isId ? "Persegi panjang dan lingkaran" : isEn ? "Rectangle and circle" : "長方形と円"}>
      <defs>
        <style>{`
          @keyframes arsirGreen{0%,100%{opacity:.4;}50%{opacity:.7;}}
          @keyframes greenGlow{0%,100%{filter:drop-shadow(0 0 6px #4ade80);}50%{filter:drop-shadow(0 0 16px #4ade80);}}
          .g-fill{animation:arsirGreen 2s ease-in-out infinite;}
          .g-ring{animation:greenGlow 2s ease-in-out infinite;}
        `}</style>
        <mask id="circMask">
          <rect x="40" y="40" width="200" height="160" fill="white"/>
          <circle cx="140" cy="120" r="70" fill="black"/>
        </mask>
      </defs>
      <rect x="40" y="40" width="200" height="160" fill="#22c55e" className="g-fill" mask="url(#circMask)"/>
      <rect x="40" y="40" width="200" height="160" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="140" cy="120" r="70" fill="rgba(34,197,94,.12)" stroke="#4ade80" strokeWidth="2.5" className="g-ring"/>
      <circle cx="140" cy="120" r="3.5" fill="#4ade80"/>
      <line x1="140" y1="120" x2="210" y2="120" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>
      <text x="170" y="114" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>
      <text x="133" y="228" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle">{isId ? "p (panjang)" : isEn ? "p (length)" : "p（長さ）"}</text>
      <text x="18"  y="124" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 18 124)">{isId ? "l (lebar)" : isEn ? "l (width)" : "l（幅）"}</text>
      <text x="46" y="56" fill="#fde68a" fontSize="9" fontFamily="monospace">{isId ? "Arsiran" : isEn ? "Shaded" : "着色"}</text>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SVG C1 – Rectangle 28×14 cm, two semicircles cut (dumbbell shape)
═══════════════════════════════════════════════════════════════════ */
const SoalSVG1 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 0 320 200" className="w-full max-w-sm mx-auto" aria-label={isId ? "Daerah arsiran barbel" : isEn ? "Dumbbell shaded region" : "ダンベル型着色領域"}>
    <defs>
      <style>{`
        @keyframes db1{0%,100%{opacity:.42;}50%{opacity:.75;}}
        @keyframes dbg{0%,100%{filter:drop-shadow(0 0 7px #f97316);}50%{filter:drop-shadow(0 0 18px #f97316);}}
        .db-fill{animation:db1 2.4s ease-in-out infinite;}
        .db-out{animation:dbg 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <path fillRule="evenodd" fill="#f97316" className="db-fill"
      d="M40,35 L280,35 L280,155 L40,155 Z M40,35 A60,60,0,0,1,40,155 Z M280,35 A60,60,0,0,0,280,155 Z"/>
    <rect x="40" y="35" width="240" height="120" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round" className="db-out"/>
    <path d="M40,35 A60,60,0,0,1,40,155" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2"/>
    <path d="M280,35 A60,60,0,0,0,280,155" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2"/>
    <circle cx="40" cy="95" r="3.5" fill="#22d3ee"/>
    <line x1="40" y1="95" x2="100" y2="95" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="4 2" opacity=".95"/>
    <text x="70" y="82" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r = 7 cm</text>
    <text x="160" y="22" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">28 cm</text>
    <line x1="296" y1="35" x2="296" y2="155" stroke="#4ade80" strokeWidth="1.2" opacity=".7"/>
    <text x="312" y="95" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle" transform="rotate(90,312,95)">14 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C2 – Quarter circle r = 10 cm (pie slice)
═══════════════════════════════════════════════════════════════════ */
const SoalSVG2 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 0 240 230" className="w-full max-w-xs mx-auto" aria-label={isId ? "Seperempat lingkaran" : isEn ? "Quarter circle" : "四分の一円"}>
    <defs>
      <style>{`
        @keyframes qc1{0%,100%{opacity:.4;}50%{opacity:.72;}}
        @keyframes qcg{0%,100%{filter:drop-shadow(0 0 7px #22c55e);}50%{filter:drop-shadow(0 0 18px #22c55e);}}
        .qc-fill{animation:qc1 2.2s ease-in-out infinite;}
        .qc-out{animation:qcg 2.2s ease-in-out infinite;}
      `}</style>
    </defs>
    <path d="M30,190 L170,190 A140,140,0,0,0,30,50 Z" fill="#22c55e" className="qc-fill"/>
    <path d="M30,190 L170,190 A140,140,0,0,0,30,50 Z" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinejoin="round" className="qc-out"/>
    <polyline points="48,190 48,172 30,172" fill="none" stroke="#4ade80" strokeWidth="1.5" opacity=".7"/>
    <line x1="30" y1="190" x2="170" y2="190" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5 3" opacity=".7"/>
    <text x="97" y="208" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">10 cm</text>
    <line x1="30" y1="190" x2="30" y2="50" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5 3" opacity=".7"/>
    <text x="10" y="124" fill="#fbbf24" fontSize="10" fontFamily="monospace" transform="rotate(-90,10,124)">10 cm</text>
    <circle cx="30" cy="190" r="4" fill="#4ade80"/>
    <text x="36" y="187" fill="#6ee7b7" fontSize="9" fontFamily="monospace">O</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C3 – Square 14 cm, two diagonal arcs forming a lens
═══════════════════════════════════════════════════════════════════ */
const SoalSVG3 = ({ t }: { t: T }) => {
  const { isDark } = useTheme();
  const isId = t.introCats[0].label === "Dikurangi";
  const isEn = t.introCats[0].label === "Subtraction";
  const shade = isId ? "Arsiran" : isEn ? "Shaded" : "着色";
  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto" aria-label="Square diagonal lens — shaded corners">
      <defs>
        <style>{`
          @keyframes sq3{0%,100%{opacity:.42;}50%{opacity:.7;}}
          @keyframes sq3g{0%,100%{filter:drop-shadow(0 0 6px #a855f7);}50%{filter:drop-shadow(0 0 16px #a855f7);}}
          .sq3-fill{animation:sq3 2.6s ease-in-out infinite;}
          .sq3-out{animation:sq3g 2.6s ease-in-out infinite;}
        `}</style>
      </defs>
      <rect x="20" y="20" width="220" height="220" fill="#a855f7" className="sq3-fill"/>
      <path d="M240,20 A220,220,0,0,0,20,240 A220,220,0,0,0,240,20 Z" fill={isDark ? "rgba(15,23,42,.92)" : "rgba(248,250,252,.95)"}/>
      <rect x="20" y="20" width="220" height="220" fill="none" stroke="#c084fc" strokeWidth="2.5" className="sq3-out"/>
      <path d="M240,20 A220,220,0,0,0,20,240" fill="none" stroke="#22d3ee" strokeWidth="2"/>
      <path d="M240,20 A220,220,0,0,1,20,240" fill="none" stroke="#22d3ee" strokeWidth="2"/>
      <text x="128" y="256" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
      <text x="7" y="134" fill="#c084fc" fontSize="10" fontFamily="monospace" transform="rotate(-90,7,134)">14 cm</text>
      <text x="42" y="52" fill="#fde68a" fontSize="9" fontFamily="monospace">{shade}</text>
      <text x="172" y="232" fill="#fde68a" fontSize="9" fontFamily="monospace">{shade}</text>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SVG C4 – Rectangle 21×21 + semicircle on right side (D-shape)
═══════════════════════════════════════════════════════════════════ */
const SoalSVG4 = ({ t }: { t: T }) => {
  const isId = t.introCats[0].label === "Dikurangi";
  const isEn = t.introCats[0].label === "Subtraction";
  return (
    <svg viewBox="0 0 310 220" className="w-full max-w-xs mx-auto" aria-label={isId ? "Bangun gabungan bentuk D" : isEn ? "D-shaped composite figure" : "D字型複合図形"}>
      <defs>
        <style>{`
          @keyframes ds4{0%,100%{opacity:.38;}50%{opacity:.68;}}
          @keyframes ds4g{0%,100%{filter:drop-shadow(0 0 7px #06b6d4);}50%{filter:drop-shadow(0 0 18px #06b6d4);}}
          .ds4-fill{animation:ds4 2.3s ease-in-out infinite;}
          .ds4-out{animation:ds4g 2.3s ease-in-out infinite;}
        `}</style>
      </defs>
      <path d="M20,20 H200 A90,90,0,0,1,200,200 H20 Z" fill="#06b6d4" className="ds4-fill"/>
      <path d="M20,20 H200 A90,90,0,0,1,200,200 H20 Z" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinejoin="round" className="ds4-out"/>
      <line x1="200" y1="20" x2="200" y2="200" stroke="#a78bfa" strokeWidth="1.4" strokeDasharray="6 3" opacity=".7"/>
      <line x1="200" y1="110" x2="290" y2="110" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="4 2" opacity=".75"/>
      <text x="238" y="104" fill="#fbbf24" fontSize="10" fontFamily="monospace">r</text>
      <text x="107" y="215" fill="#22d3ee" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">21 cm</text>
      <text x="6" y="114" fill="#22d3ee" fontSize="10" fontFamily="monospace" transform="rotate(-90,6,114)">21 cm</text>
      <text x="100" y="107" fill="#e0f2fe" fontSize="9" fontFamily="monospace" textAnchor="middle">{isId ? "Persegi" : isEn ? "Rect-" : "長方"}</text>
      <text x="100" y="118" fill="#e0f2fe" fontSize="9" fontFamily="monospace" textAnchor="middle">{isId ? "Panjang" : isEn ? "angle" : "形"}</text>
      <text x="260" y="107" fill="#fbbf24" fontSize="8" fontFamily="monospace">{isId ? "½ ling." : isEn ? "½ circ." : "半円"}</text>
      <circle cx="200" cy="110" r="3.5" fill="#22d3ee"/>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SVG C5 – Half-annulus (large semicircle minus small semicircle)
═══════════════════════════════════════════════════════════════════ */
const SoalSVG5 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 0 280 180" className="w-full mx-auto" style={{ maxWidth: "480px" }} aria-label={isId ? "Setengah cincin siput" : isEn ? "Snail half-annulus" : "カタツムリ型半環"}>
    <defs>
      <style>{`
        @keyframes sn5{0%,100%{opacity:.42;}50%{opacity:.75;}}
        @keyframes sn5g{0%,100%{filter:drop-shadow(0 0 7px #ec4899);}50%{filter:drop-shadow(0 0 18px #ec4899);}}
        .sn5-fill{animation:sn5 2.5s ease-in-out infinite;}
        .sn5-out{animation:sn5g 2.5s ease-in-out infinite;}
      `}</style>
    </defs>
    <path fillRule="evenodd" fill="#ec4899" className="sn5-fill"
      d="M30,140 A110,110,0,0,1,250,140 Z M140,140 m-55,0 a55,55,0,0,1,110,0 Z"/>
    <path d="M30,140 A110,110,0,0,1,250,140" fill="none" stroke="#ec4899" strokeWidth="2.5" className="sn5-out"/>
    <path d="M85,140 A55,55,0,0,1,195,140" fill="none" stroke="#ec4899" strokeWidth="2"/>
    <line x1="30" y1="140" x2="250" y2="140" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="5 3" opacity=".6"/>
    <circle cx="140" cy="140" r="3.5" fill="#ec4899"/>
    <line x1="140" y1="140" x2="250" y2="140" stroke="#fbbf24" strokeWidth="2" opacity=".9"/>
    <text x="183" y="132" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">R = 10</text>
    <circle cx="140" cy="140" r="3" fill="#fbbf24"/>
    <circle cx="250" cy="140" r="3" fill="#fbbf24"/>
    <line x1="140" y1="140" x2="85" y2="140" stroke="#f9a8d4" strokeWidth="1.2" strokeDasharray="3 2" opacity=".7"/>
    <text x="103" y="130" fill="#f9a8d4" fontSize="9" fontFamily="monospace">r=5</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C6 – Square 14 cm, 4-pointed star from corner arcs
═══════════════════════════════════════════════════════════════════ */
const SoalSVG6 = () => (
  <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto" aria-label="4-pointed star from corner arcs">
    <defs>
      <style>{`
        @keyframes st6{0%,100%{opacity:.45;}50%{opacity:.82;}}
        @keyframes st6g{0%,100%{filter:drop-shadow(0 0 8px #f59e0b);}50%{filter:drop-shadow(0 0 22px #f59e0b);}}
        .st6-fill{animation:st6 2.1s ease-in-out infinite;}
        .st6-out{animation:st6g 2.1s ease-in-out infinite;}
      `}</style>
    </defs>
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="st6-out"/>
    <path d="M240,20 A220,220,0,0,1,20,240" fill="none" stroke="#fde68a" strokeWidth="1.4" opacity=".38"/>
    <path d="M20,20 A220,220,0,0,0,240,240" fill="none" stroke="#fde68a" strokeWidth="1.4" opacity=".38"/>
    <path d="M20,20 A220,220,0,0,1,240,240" fill="none" stroke="#fde68a" strokeWidth="1.4" opacity=".38"/>
    <path d="M240,20 A220,220,0,0,0,20,240" fill="none" stroke="#fde68a" strokeWidth="1.4" opacity=".38"/>
    <path d="M130,49.5 A220,220,0,0,1,210.5,130 A220,220,0,0,1,130,210.5 A220,220,0,0,1,49.5,130 A220,220,0,0,1,130,49.5 Z"
      fill="#f59e0b" className="st6-fill"/>
    <circle cx="20"  cy="20"  r="3" fill="#fde68a" opacity=".7"/>
    <circle cx="240" cy="20"  r="3" fill="#fde68a" opacity=".7"/>
    <circle cx="20"  cy="240" r="3" fill="#fde68a" opacity=".7"/>
    <circle cx="240" cy="240" r="3" fill="#fde68a" opacity=".7"/>
    <circle cx="130"   cy="49.5"  r="2.5" fill="#fff" opacity=".75"/>
    <circle cx="210.5" cy="130"   r="2.5" fill="#fff" opacity=".75"/>
    <circle cx="130"   cy="210.5" r="2.5" fill="#fff" opacity=".75"/>
    <circle cx="49.5"  cy="130"   r="2.5" fill="#fff" opacity=".75"/>
    <text x="130" y="257" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="6" y="130" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-90,6,130)">14 cm</text>
    <line x1="20" y1="13" x2="240" y2="13" stroke="#fde68a" strokeWidth="1" opacity=".5"/>
    <text x="130" y="11" fill="#fde68a" fontSize="8" fontFamily="monospace" textAnchor="middle">r = 14 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C7 – Triple arch: large arch minus 2 small arches
═══════════════════════════════════════════════════════════════════ */
const SoalSVG7 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto" aria-label={isId ? "Pola tiga lengkungan" : isEn ? "Three arch pattern" : "三つのアーチ模様"}>
    <defs>
      <style>{`
        @keyframes ar7{0%,100%{opacity:.4;}50%{opacity:.72;}}
        @keyframes ar7g{0%,100%{filter:drop-shadow(0 0 7px #0ea5e9);}50%{filter:drop-shadow(0 0 18px #0ea5e9);}}
        .ar7-fill{animation:ar7 2.3s ease-in-out infinite;}
        .ar7-out{animation:ar7g 2.3s ease-in-out infinite;}
      `}</style>
    </defs>
    <rect x="20" y="40" width="240" height="120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" opacity=".5"/>
    <path fillRule="evenodd" fill="#0ea5e9" className="ar7-fill"
      d="M20,160 A120,120,0,0,1,260,160 Z M20,160 A60,60,0,0,1,140,160 Z M140,160 A60,60,0,0,1,260,160 Z"/>
    <path d="M20,160 A120,120,0,0,1,260,160" fill="none" stroke="#38bdf8" strokeWidth="2.5" className="ar7-out"/>
    <path d="M20,160 A60,60,0,0,1,140,160" fill="none" stroke="#38bdf8" strokeWidth="2"/>
    <path d="M140,160 A60,60,0,0,1,260,160" fill="none" stroke="#38bdf8" strokeWidth="2"/>
    <line x1="20" y1="160" x2="260" y2="160" stroke="#64748b" strokeWidth="1.5" opacity=".6"/>
    <line x1="20"  y1="172" x2="260" y2="172" stroke="#38bdf8" strokeWidth="1.3" opacity=".8"/>
    <line x1="20"  y1="168" x2="20"  y2="176" stroke="#38bdf8" strokeWidth="1.2" opacity=".8"/>
    <line x1="260" y1="168" x2="260" y2="176" stroke="#38bdf8" strokeWidth="1.2" opacity=".8"/>
    <text x="140" y="188" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">28 cm</text>
    <line x1="268" y1="40" x2="268" y2="160" stroke="#4ade80" strokeWidth="1.2" opacity=".7"/>
    <line x1="264" y1="40"  x2="272" y2="40"  stroke="#4ade80" strokeWidth="1" opacity=".6"/>
    <line x1="264" y1="160" x2="272" y2="160" stroke="#4ade80" strokeWidth="1" opacity=".6"/>
    <text x="277" y="105" fill="#4ade80" fontSize="9" fontFamily="monospace" transform="rotate(90,277,105)">14 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C8 – Square 14 cm, 4 quarter-circle arcs at corners → shaded center
═══════════════════════════════════════════════════════════════════ */
const ContohDelapanSVG = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => {
  const { isDark } = useTheme();
  const cornerFill = isDark ? "rgba(15,23,42,.85)" : "rgba(248,250,252,.95)";
  return (
  <svg viewBox="0 0 270 270" className="w-full max-w-xs mx-auto" aria-label={isId ? "Persegi dengan 4 busur seperempat lingkaran — daerah tengah arsiran" : isEn ? "Square with 4 quarter-circle arcs — shaded center region" : "4つの四分円弧を持つ正方形—中央着色領域"}>
    <defs>
      <style>{`
        @keyframes lf8{0%,100%{opacity:.48;}50%{opacity:.82;}}
        @keyframes lf8g{0%,100%{filter:drop-shadow(0 0 8px #f59e0b);}50%{filter:drop-shadow(0 0 22px #f59e0b);}}
        .lf8-fill{animation:lf8 2.4s ease-in-out infinite;}
        .lf8-out{animation:lf8g 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <path d="M20,20 L130,20 A110,110,0,0,1,20,130 Z" fill={cornerFill} stroke="none"/>
    <path d="M240,20 L130,20 A110,110,0,0,0,240,130 Z" fill={cornerFill} stroke="none"/>
    <path d="M20,240 L20,130 A110,110,0,0,1,130,240 Z" fill={cornerFill} stroke="none"/>
    <path d="M240,240 L130,240 A110,110,0,0,0,240,130 Z" fill={cornerFill} stroke="none"/>
    <path d="M130,20 A110,110,0,0,1,20,130 A110,110,0,0,1,130,240 A110,110,0,0,1,240,130 A110,110,0,0,1,130,20 Z"
      fill="#f59e0b" className="lf8-fill"/>
    <path d="M130,20 A110,110,0,0,1,20,130 A110,110,0,0,1,130,240 A110,110,0,0,1,240,130 A110,110,0,0,1,130,20 Z"
      fill="none" stroke="#fbbf24" strokeWidth="2.5" className="lf8-out"/>
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#f59e0b" strokeWidth="2" opacity=".6"/>
    <text x="130" y="258" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="6" y="130" fill="#f59e0b" fontSize="10" fontFamily="monospace" transform="rotate(-90,6,130)">14 cm</text>
  </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SVG C8b – Diagonal leaf in square 7 cm
═══════════════════════════════════════════════════════════════════ */
const SoalSVG8 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 0 250 240" className="w-full max-w-xs mx-auto" aria-label={isId ? "Daun diagonal dalam persegi" : isEn ? "Diagonal leaf in square" : "正方形内の対角葉形"}>
    <defs>
      <style>{`
        @keyframes lf8b{0%,100%{opacity:.45;}50%{opacity:.78;}}
        @keyframes lf8bg{0%,100%{filter:drop-shadow(0 0 7px #14b8a6);}50%{filter:drop-shadow(0 0 18px #14b8a6);}}
        .lf8b-fill{animation:lf8b 2.4s ease-in-out infinite;}
        .lf8b-out{animation:lf8bg 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <rect x="30" y="20" width="190" height="190" fill="none" stroke="#94a3b8" strokeWidth="2" opacity=".6"/>
    <path d="M30,20 A190,190,0,0,1,220,210 A190,190,0,0,1,30,20 Z" fill="#14b8a6" className="lf8b-fill"/>
    <path d="M30,20 A190,190,0,0,1,220,210 A190,190,0,0,1,30,20 Z" fill="none" stroke="#2dd4bf" strokeWidth="2.5" className="lf8b-out"/>
    <path d="M30,20 A190,190,0,0,1,220,210" fill="none" stroke="#2dd4bf" strokeWidth="2.5"/>
    <path d="M220,210 A190,190,0,0,1,30,20" fill="none" stroke="#2dd4bf" strokeWidth="2.5"/>
    <text x="122" y="228" fill="#2dd4bf" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">7 cm</text>
    <text x="9" y="118" fill="#2dd4bf" fontSize="10" fontFamily="monospace" transform="rotate(-90,9,118)">7 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C9 – Square 14 cm, 4-petal flower
═══════════════════════════════════════════════════════════════════ */
const SoalSVG9 = () => (
  <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto" aria-label="4-petal flower in square">
    <defs>
      <style>{`
        @keyframes fl9{0%,100%{opacity:.42;}50%{opacity:.75;}}
        @keyframes fl9g{0%,100%{filter:drop-shadow(0 0 7px #f97316);}50%{filter:drop-shadow(0 0 20px #f97316);}}
        .fl9-fill{animation:fl9 2.2s ease-in-out infinite;}
        .fl9-out{animation:fl9g 2.2s ease-in-out infinite;}
      `}</style>
    </defs>
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#94a3b8" strokeWidth="2" opacity=".5"/>
    <path d="M20,20 A220,220,0,0,1,240,240 A220,220,0,0,1,20,20 Z" fill="#f97316" className="fl9-fill" opacity=".5"/>
    <path d="M20,240 A220,220,0,0,0,240,20 A220,220,0,0,0,20,240 Z" fill="#f97316" className="fl9-fill" opacity=".5"/>
    <path d="M240,20 A220,220,0,0,0,20,240 A220,220,0,0,0,240,20 Z" fill="#ec4899" className="fl9-fill" opacity=".5"/>
    <path d="M20,20 A220,220,0,0,0,240,240 A220,220,0,0,0,20,20 Z" fill="#ec4899" className="fl9-fill" opacity=".5"/>
    <path d="M20,20 A220,220,0,0,1,240,240" fill="none" stroke="#fb923c" strokeWidth="2" className="fl9-out"/>
    <path d="M240,20 A220,220,0,0,0,20,240" fill="none" stroke="#fb923c" strokeWidth="2"/>
    <path d="M20,240 A220,220,0,0,0,240,20" fill="none" stroke="#fb923c" strokeWidth="2"/>
    <path d="M240,240 A220,220,0,0,1,20,20" fill="none" stroke="#fb923c" strokeWidth="2"/>
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#64748b" strokeWidth="2"/>
    <text x="128" y="257" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="6" y="134" fill="#fb923c" fontSize="10" fontFamily="monospace" transform="rotate(-90,6,134)">14 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C10 – Circle r=10 cm, right-angle sector (90°) shaded
═══════════════════════════════════════════════════════════════════ */
const SoalSVG10 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto" aria-label={isId ? "Seperempat juring lingkaran" : isEn ? "Quarter sector of circle" : "四分の一扇形"}>
    <defs>
      <style>{`
        @keyframes sc10{0%,100%{opacity:.4;}50%{opacity:.72;}}
        @keyframes sc10g{0%,100%{filter:drop-shadow(0 0 7px #8b5cf6);}50%{filter:drop-shadow(0 0 18px #8b5cf6);}}
        .sc10-fill{animation:sc10 2.4s ease-in-out infinite;}
        .sc10-out{animation:sc10g 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="110" cy="120" r="105" fill="rgba(139,92,246,.06)" stroke="#8b5cf6" strokeWidth="2" opacity=".5"/>
    <path d="M215,120 A105,105,0,0,1,110,225 Z" fill="#8b5cf6" className="sc10-fill"/>
    <path d="M215,120 A105,105,0,0,1,110,225 Z" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round" className="sc10-out"/>
    <line x1="215" y1="120" x2="110" y2="225" stroke="#a78bfa" strokeWidth="2.5"/>
    <line x1="110" y1="120" x2="215" y2="120" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5 3" opacity=".8"/>
    <line x1="110" y1="120" x2="110" y2="225" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="5 3" opacity=".8"/>
    <circle cx="110" cy="120" r="4" fill="#8b5cf6"/>
    <text x="93" y="117" fill="#c4b5fd" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    <text x="219" y="117" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="96" y="238" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="152" y="112" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">10 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C11 – 4 daun bunga dalam persegi 14 cm (2×2 sub-squares)
═══════════════════════════════════════════════════════════════════ */
const SoalSVG11 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto" aria-label={isId ? "4 kelopak bunga dalam persegi" : isEn ? "4 leaf petals in square" : "正方形内の4枚花びら"}>
    <defs>
      <style>{`
        @keyframes fl11{0%,100%{opacity:.45;}50%{opacity:.78;}}
        @keyframes fl11g{0%,100%{filter:drop-shadow(0 0 8px #14b8a6);}50%{filter:drop-shadow(0 0 20px #14b8a6);}}
        .fl11-fill{animation:fl11 2.2s ease-in-out infinite;}
        .fl11-out{animation:fl11g 2.2s ease-in-out infinite;}
      `}</style>
    </defs>
    <rect x="20" y="20" width="220" height="220" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" opacity=".5"/>
    <line x1="130" y1="20" x2="130" y2="240" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity=".4"/>
    <line x1="20" y1="130" x2="240" y2="130" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity=".4"/>
    <path d="M20,20 A110,110,0,0,1,130,130 A110,110,0,0,1,20,20 Z" fill="#14b8a6" className="fl11-fill"/>
    <path d="M240,20 A110,110,0,0,0,130,130 A110,110,0,0,0,240,20 Z" fill="#14b8a6" className="fl11-fill"/>
    <path d="M20,240 A110,110,0,0,0,130,130 A110,110,0,0,0,20,240 Z" fill="#14b8a6" className="fl11-fill"/>
    <path d="M240,240 A110,110,0,0,1,130,130 A110,110,0,0,1,240,240 Z" fill="#14b8a6" className="fl11-fill"/>
    <path d="M20,20 A110,110,0,0,1,130,130 A110,110,0,0,1,20,20 Z" fill="none" stroke="#2dd4bf" strokeWidth="2" className="fl11-out"/>
    <path d="M240,20 A110,110,0,0,0,130,130 A110,110,0,0,0,240,20 Z" fill="none" stroke="#2dd4bf" strokeWidth="2"/>
    <path d="M20,240 A110,110,0,0,0,130,130 A110,110,0,0,0,20,240 Z" fill="none" stroke="#2dd4bf" strokeWidth="2"/>
    <path d="M240,240 A110,110,0,0,1,130,130 A110,110,0,0,1,240,240 Z" fill="none" stroke="#2dd4bf" strokeWidth="2"/>
    <circle cx="20"  cy="20"  r="3.5" fill="#fde68a"/>
    <circle cx="240" cy="20"  r="3.5" fill="#fde68a"/>
    <circle cx="20"  cy="240" r="3.5" fill="#fde68a"/>
    <circle cx="240" cy="240" r="3.5" fill="#fde68a"/>
    <circle cx="130" cy="130" r="4" fill="#2dd4bf"/>
    <text x="128" y="257" fill="#2dd4bf" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="6" y="134" fill="#2dd4bf" fontSize="10" fontFamily="monospace" transform="rotate(-90,6,134)">14 cm</text>
    <text x="75"  y="14" fill="#fde68a" fontSize="8.5" fontFamily="monospace" textAnchor="middle">7 cm</text>
    <text x="185" y="14" fill="#fde68a" fontSize="8.5" fontFamily="monospace" textAnchor="middle">7 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C13 – Ice cream: semicircle + triangle
═══════════════════════════════════════════════════════════════════ */
const SoalSVG13 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 -20 280 380" className="w-full max-w-xs mx-auto" aria-label={isId ? "Bentuk es krim: setengah lingkaran di atas segitiga" : isEn ? "Ice cream shape: semicircle on top of triangle" : "アイスクリーム形：三角形の上の半円"}>
    <defs>
      <style>{`
        @keyframes ek13{0%,100%{opacity:.42;}50%{opacity:.72;}}
        @keyframes ek13g{0%,100%{filter:drop-shadow(0 0 8px #f97316);}50%{filter:drop-shadow(0 0 22px #f97316);}}
        @keyframes ek13d{to{stroke-dashoffset:-16;}}
        .ek13-fill{animation:ek13 2.4s ease-in-out infinite;}
        .ek13-out{animation:ek13g 2.4s ease-in-out infinite;}
        .ek13-dash{animation:ek13d 1.2s linear infinite;}
      `}</style>
    </defs>
    <path d="M50,100 A90,90,0,0,1,230,100 Z" fill="#ec4899" className="ek13-fill"/>
    <path d="M50,100 L230,100 L140,316 Z" fill="#f97316" className="ek13-fill"/>
    <path d="M50,100 A90,90,0,0,1,230,100" fill="none" stroke="#f9a8d4" strokeWidth="2.5" className="ek13-out"/>
    <path d="M50,100 L140,316 L230,100" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round"/>
    <line x1="50" y1="100" x2="230" y2="100" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 3" opacity=".55"/>
    <line x1="140" y1="100" x2="140" y2="316" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5 3" className="ek13-dash" opacity=".8"/>
    <polyline points="140,100 152,100 152,112" fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity=".7"/>
    <text x="140" y="-8" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">20 cm</text>
    <line x1="50" y1="-2" x2="230" y2="-2" stroke="#fbbf24" strokeWidth="1.2" opacity=".6"/>
    <line x1="50" y1="-6"  x2="50"  y2="2"  stroke="#fbbf24" strokeWidth="1.2" opacity=".6"/>
    <line x1="230" y1="-6" x2="230" y2="2"  stroke="#fbbf24" strokeWidth="1.2" opacity=".6"/>
    <circle cx="140" cy="100" r="3.5" fill="#22d3ee"/>
    <text x="148" y="214" fill="#22d3ee" fontSize="11" fontFamily="monospace" fontWeight="bold" transform="rotate(90,148,214)">24 cm</text>
    <text x="68" y="222" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold" transform="rotate(67,68,222)">26 cm</text>
    <circle cx="140" cy="316" r="3" fill="#fb923c" opacity=".8"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C14 – Trapezoid + quarter circle on left
═══════════════════════════════════════════════════════════════════ */
const SoalSVG14 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 108 340 115" className="w-full mx-auto" style={{ maxWidth: "576px" }} aria-label={isId ? "Trapesium dan seperempat lingkaran di kiri" : isEn ? "Trapezoid plus quarter circle on left" : "左に四分円を足した台形"}>
    <defs>
      <style>{`
        @keyframes sv14f{0%,100%{opacity:.42;}50%{opacity:.76;}}
        @keyframes sv14g{0%,100%{filter:drop-shadow(0 0 7px #fb7185);}50%{filter:drop-shadow(0 0 20px #fb7185);}}
        .sv14-fill{animation:sv14f 2.4s ease-in-out infinite;}
        .sv14-out{animation:sv14g 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <path d="M90,195 L20,195 A70,70,0,0,1,90,125 Z" fill="#f43f5e" className="sv14-fill"/>
    <path d="M90,125 L230,125 L300,195 L90,195 Z" fill="#f43f5e" className="sv14-fill"/>
    <path d="M20,195 A70,70,0,0,1,90,125 L230,125 L300,195 Z" fill="none" stroke="#fb7185" strokeWidth="2.5" strokeLinejoin="round" className="sv14-out"/>
    <line x1="20" y1="195" x2="90" y2="195" stroke="#fda4af" strokeWidth="1.5" strokeDasharray="5 3" opacity=".85"/>
    <line x1="90" y1="125" x2="90" y2="195" stroke="#fda4af" strokeWidth="1.5" strokeDasharray="5 3" opacity=".85"/>
    <polyline points="90,195 90,182 77,182 77,195" fill="none" stroke="#fda4af" strokeWidth="1.2" opacity=".9"/>
    <circle cx="90" cy="195" r="3.5" fill="white" opacity=".9"/>
    <text x="160" y="117" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">28 cm</text>
    <line x1="90" y1="121" x2="230" y2="121" stroke="#fbbf24" strokeWidth="1" opacity=".55"/>
    <line x1="90" y1="117" x2="90" y2="125" stroke="#fbbf24" strokeWidth="1" opacity=".55"/>
    <line x1="230" y1="117" x2="230" y2="125" stroke="#fbbf24" strokeWidth="1" opacity=".55"/>
    <line x1="310" y1="125" x2="310" y2="195" stroke="#4ade80" strokeWidth="1.3" opacity=".8"/>
    <line x1="306" y1="125" x2="314" y2="125" stroke="#4ade80" strokeWidth="1" opacity=".7"/>
    <line x1="306" y1="195" x2="314" y2="195" stroke="#4ade80" strokeWidth="1" opacity=".7"/>
    <text x="322" y="163" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-90,322,163)">14 cm</text>
    <text x="55" y="186" fill="#fda4af" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r=14</text>
    <text x="195" y="213" fill="#fb7185" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">42 cm</text>
    <line x1="90" y1="207" x2="300" y2="207" stroke="#fb7185" strokeWidth="1" opacity=".55"/>
    <line x1="90" y1="203" x2="90" y2="211" stroke="#fb7185" strokeWidth="1" opacity=".55"/>
    <line x1="300" y1="203" x2="300" y2="211" stroke="#fb7185" strokeWidth="1" opacity=".55"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C15 – Isosceles right triangle + quarter circle on hypotenuse
═══════════════════════════════════════════════════════════════════ */
const SoalSVG15 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 0 210 220" className="w-full max-w-xs mx-auto" aria-label={isId ? "Segitiga siku-siku sama kaki dengan seperempat lingkaran pada hipotenusa" : isEn ? "Isosceles right triangle with quarter circle on hypotenuse" : "斜辺に四分円の直角二等辺三角形"}>
    <defs>
      <style>{`
        @keyframes sv15f{0%,100%{opacity:.42;}50%{opacity:.76;}}
        @keyframes sv15g{0%,100%{filter:drop-shadow(0 0 7px #a855f7);}50%{filter:drop-shadow(0 0 20px #a855f7);}}
        .sv15-fill{animation:sv15f 2.3s ease-in-out infinite;}
        .sv15-out{animation:sv15g 2.3s ease-in-out infinite;}
      `}</style>
    </defs>
    <path d="M30,55 A130,130,0,0,1,160,185 Z" fill="#a855f7" className="sv15-fill"/>
    <path d="M30,55 A130,130,0,0,1,160,185 Z" fill="none" stroke="#c084fc" strokeWidth="2.5" className="sv15-out"/>
    <line x1="30" y1="185" x2="30" y2="55" stroke="#c084fc" strokeWidth="2.5"/>
    <line x1="30" y1="185" x2="160" y2="185" stroke="#c084fc" strokeWidth="2.5"/>
    <polyline points="30,185 30,168 47,168 47,185" fill="none" stroke="#c084fc" strokeWidth="1.3" opacity=".85"/>
    <circle cx="30" cy="185" r="3.5" fill="#c084fc"/>
    <line x1="18" y1="55" x2="18" y2="185" stroke="#fbbf24" strokeWidth="1.3" opacity=".7"/>
    <line x1="14" y1="55"  x2="22" y2="55"  stroke="#fbbf24" strokeWidth="1" opacity=".6"/>
    <line x1="14" y1="185" x2="22" y2="185" stroke="#fbbf24" strokeWidth="1" opacity=".6"/>
    <text x="7" y="122" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-90,7,122)">14 cm</text>
    <line x1="30" y1="197" x2="160" y2="197" stroke="#fbbf24" strokeWidth="1.3" opacity=".7"/>
    <line x1="30"  y1="193" x2="30"  y2="201" stroke="#fbbf24" strokeWidth="1" opacity=".6"/>
    <line x1="160" y1="193" x2="160" y2="201" stroke="#fbbf24" strokeWidth="1" opacity=".6"/>
    <text x="93" y="210" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
    <text x="120" y="112" fill="#c084fc" fontSize="10" fontFamily="monospace" transform="rotate(45,120,112)">14√2 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C16 – Half-annulus R=14, r=7 cm
═══════════════════════════════════════════════════════════════════ */
const SoalSVG16 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 0 320 200" className="w-full mx-auto" style={{ maxWidth: "480px" }} aria-label={isId ? "Setengah cincin R=14 r=7" : isEn ? "Half-annulus R=14 r=7" : "半環 R=14 r=7"}>
    <defs>
      <style>{`
        @keyframes ha16{0%,100%{opacity:.42;}50%{opacity:.75;}}
        @keyframes ha16g{0%,100%{filter:drop-shadow(0 0 7px #f97316);}50%{filter:drop-shadow(0 0 18px #f97316);}}
        .ha16-fill{animation:ha16 2.4s ease-in-out infinite;}
        .ha16-out{animation:ha16g 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <path fillRule="evenodd" fill="#f97316" className="ha16-fill"
      d="M30,150 A130,130,0,0,1,290,150 Z M160,150 m-65,0 a65,65,0,0,1,130,0 Z"/>
    <path d="M30,150 A130,130,0,0,1,290,150" fill="none" stroke="#fb923c" strokeWidth="2.5" className="ha16-out"/>
    <path d="M95,150 A65,65,0,0,1,225,150" fill="none" stroke="#fb923c" strokeWidth="2"/>
    <line x1="30" y1="150" x2="290" y2="150" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="5 3" opacity=".6"/>
    <circle cx="160" cy="150" r="3.5" fill="#f97316"/>
    <line x1="160" y1="150" x2="290" y2="150" stroke="#fbbf24" strokeWidth="2" opacity=".9"/>
    <text x="222" y="142" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">R = 14</text>
    <line x1="160" y1="150" x2="95" y2="150" stroke="#fda4af" strokeWidth="1.4" strokeDasharray="4 2" opacity=".8"/>
    <text x="120" y="140" fill="#fda4af" fontSize="9" fontFamily="monospace">r=7</text>
    <line x1="30"  y1="162" x2="290" y2="162" stroke="#f97316" strokeWidth="1.3" opacity=".8"/>
    <line x1="30"  y1="158" x2="30"  y2="166" stroke="#f97316" strokeWidth="1.2" opacity=".8"/>
    <line x1="290" y1="158" x2="290" y2="166" stroke="#f97316" strokeWidth="1.2" opacity=".8"/>
    <text x="160" y="178" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">28 cm (= 2R)</text>
    <text x="160" y="195" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">d = 20 cm (= 2R)</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C18 – Square 14 cm minus two quarter circles
═══════════════════════════════════════════════════════════════════ */
const SoalSVG18 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 0 235 240" className="w-full max-w-xs mx-auto" aria-label={isId ? "Persegi dikurangi dua seperempat lingkaran" : isEn ? "Square minus two quarter circles" : "正方形から二つの四分円を引いた形"}>
    <defs>
      <style>{`
        @keyframes sv18f{0%,100%{opacity:.42;}50%{opacity:.74;}}
        @keyframes sv18g{0%,100%{filter:drop-shadow(0 0 7px #14b8a6);}50%{filter:drop-shadow(0 0 18px #14b8a6);}}
        .sv18-fill{animation:sv18f 2.3s ease-in-out infinite;}
        .sv18-out{animation:sv18g 2.3s ease-in-out infinite;}
      `}</style>
      <mask id="sq18mask">
        <rect x="20" y="20" width="180" height="180" fill="white"/>
        <path d="M200,20 L110,20 A90,90,0,0,0,200,110 Z" fill="black"/>
        <path d="M20,200 L20,110 A90,90,0,0,1,110,200 Z" fill="black"/>
      </mask>
    </defs>
    <rect x="20" y="20" width="180" height="180" fill="#14b8a6" mask="url(#sq18mask)" className="sv18-fill"/>
    <rect x="20" y="20" width="180" height="180" fill="none" stroke="#2dd4bf" strokeWidth="2.5" className="sv18-out"/>
    <path d="M110,20 A90,90,0,0,0,200,110" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 3" opacity=".7"/>
    <path d="M20,110 A90,90,0,0,1,110,200" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 3" opacity=".7"/>
    <circle cx="20"  cy="20"  r="2.5" fill="#64748b" opacity=".7"/>
    <circle cx="200" cy="20"  r="2.5" fill="#64748b" opacity=".7"/>
    <circle cx="20"  cy="200" r="2.5" fill="#64748b" opacity=".7"/>
    <circle cx="200" cy="200" r="2.5" fill="#64748b" opacity=".7"/>
    <line x1="107" y1="14" x2="107" y2="26" stroke="#fbbf24" strokeWidth="1.8" opacity=".85"/>
    <line x1="113" y1="14" x2="113" y2="26" stroke="#fbbf24" strokeWidth="1.8" opacity=".85"/>
    <line x1="107" y1="194" x2="107" y2="206" stroke="#fbbf24" strokeWidth="1.8" opacity=".85"/>
    <line x1="113" y1="194" x2="113" y2="206" stroke="#fbbf24" strokeWidth="1.8" opacity=".85"/>
    <line x1="14" y1="107" x2="26" y2="107" stroke="#fbbf24" strokeWidth="1.8" opacity=".85"/>
    <line x1="14" y1="113" x2="26" y2="113" stroke="#fbbf24" strokeWidth="1.8" opacity=".85"/>
    <line x1="194" y1="107" x2="206" y2="107" stroke="#fbbf24" strokeWidth="1.8" opacity=".85"/>
    <line x1="194" y1="113" x2="206" y2="113" stroke="#fbbf24" strokeWidth="1.8" opacity=".85"/>
    <text x="65"  y="12" fill="#fbbf24" fontSize="8.5" fontFamily="monospace" textAnchor="middle">7 cm</text>
    <text x="155" y="12" fill="#fbbf24" fontSize="8.5" fontFamily="monospace" textAnchor="middle">7 cm</text>
    <text x="65"  y="210" fill="#fbbf24" fontSize="8.5" fontFamily="monospace" textAnchor="middle">7 cm</text>
    <text x="155" y="210" fill="#fbbf24" fontSize="8.5" fontFamily="monospace" textAnchor="middle">7 cm</text>
    <line x1="20"  y1="213" x2="200" y2="213" stroke="#2dd4bf" strokeWidth="1.4" opacity=".8"/>
    <line x1="20"  y1="208" x2="20"  y2="218" stroke="#2dd4bf" strokeWidth="1.2" opacity=".8"/>
    <line x1="200" y1="208" x2="200" y2="218" stroke="#2dd4bf" strokeWidth="1.2" opacity=".8"/>
    <text x="110" y="230" fill="#2dd4bf" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s = 14 cm</text>
    <line x1="213" y1="20"  x2="213" y2="200" stroke="#2dd4bf" strokeWidth="1.4" opacity=".8"/>
    <line x1="208" y1="20"  x2="218" y2="20"  stroke="#2dd4bf" strokeWidth="1.2" opacity=".8"/>
    <line x1="208" y1="200" x2="218" y2="200" stroke="#2dd4bf" strokeWidth="1.2" opacity=".8"/>
    <text x="223" y="114" fill="#2dd4bf" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(90,223,114)">s = 14 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   SVG C19 – Large semicircle (arch up) + small semicircle (arch down)
═══════════════════════════════════════════════════════════════════ */
const SoalSVG19 = ({ isId, isEn }: { isId: boolean; isEn: boolean }) => (
  <svg viewBox="0 55 255 165" className="w-full max-w-xs mx-auto" aria-label={isId ? "Setengah lingkaran besar ke atas dan kecil ke bawah" : isEn ? "Large semicircle up and small semicircle down" : "大半円上・小半円下"}>
    <defs>
      <style>{`
        @keyframes sv19f{0%,100%{opacity:.42;}50%{opacity:.76;}}
        @keyframes sv19g{0%,100%{filter:drop-shadow(0 0 7px #4f46e5);}50%{filter:drop-shadow(0 0 20px #818cf8);}}
        .sv19-fill{animation:sv19f 2.4s ease-in-out infinite;}
        .sv19-out{animation:sv19g 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <path d="M25,130 A65,65,0,0,1,155,130 Z" fill="#6366f1" className="sv19-fill"/>
    <path d="M120,130 A35,35,0,0,0,190,130 Z" fill="#6366f1" className="sv19-fill"/>
    <path d="M25,130 A65,65,0,0,1,155,130" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" className="sv19-out"/>
    <line x1="25" y1="130" x2="190" y2="130" stroke="#818cf8" strokeWidth="1.3" opacity=".35"/>
    <circle cx="90"  cy="130" r="2.5" fill="#a5b4fc" opacity=".65"/>
    <circle cx="155" cy="130" r="2.5" fill="#a5b4fc" opacity=".65"/>
    <line x1="25"  y1="143" x2="155" y2="143" stroke="#fbbf24" strokeWidth="1.3" opacity=".85"/>
    <line x1="25"  y1="139" x2="25"  y2="147" stroke="#fbbf24" strokeWidth="1.2" opacity=".85"/>
    <line x1="155" y1="139" x2="155" y2="147" stroke="#fbbf24" strokeWidth="1.2" opacity=".85"/>
    <text x="90" y="159" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">26 cm</text>
    <line x1="120" y1="143" x2="190" y2="143" stroke="#67e8f9" strokeWidth="1.3" opacity=".85"/>
    <line x1="120" y1="139" x2="120" y2="147" stroke="#67e8f9" strokeWidth="1.2" opacity=".85"/>
    <line x1="190" y1="139" x2="190" y2="147" stroke="#67e8f9" strokeWidth="1.2" opacity=".85"/>
    <text x="155" y="159" fill="#a5f3fc" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">14 cm</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
const KaitanBangunDatarLainnyaPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const isId = language === 'id';
  const isEn = language === 'en';
  const { isDark } = useTheme();

  const SectionHeader = ({
    icon, iconColor, title, accent,
  }: { id?: string; icon: React.ReactNode; iconColor?: string; title: string; accent?: string }) => (
    <div className="w-full flex items-center px-5 py-4"
      style={{
        background: `linear-gradient(to right, ${accent ?? "rgba(6,182,212,.12)"}, transparent)`,
        borderBottom: `1px solid ${accent ? accent.replace(", .12)", ", .3)") : "rgba(6,182,212,.3)"}`,
      }}>
      <span className={iconColor}>{icon}</span>
      <span className={`font-body font-semibold ${isDark ? "text-white" : "text-gray-800"} text-sm leading-snug ml-3`}>{title}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">

        {/* ── Page Header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-body font-bold tracking-wide"
            style={{ background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.4)", color: "#4ade80" }}>
            <BookOpen className="w-3.5 h-3.5" /> {t.badge}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2 leading-tight"
            style={{ background: "linear-gradient(135deg,#4ade80,#22d3ee,#a78bfa,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {t.h1.split("\n").map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br/>}</React.Fragment>)}
          </h1>
          <p className={`${isDark ? "text-white/40" : "text-gray-500"} text-xs font-body`}>{t.subtitle}</p>
          <div className="flex justify-center gap-2 mt-3">
            {["#f97316","#22d3ee","#a78bfa","#4ade80","#fbbf24"].map((c,i) => (
              <Star key={i} className="w-3 h-3" style={{ color: c, fill: c, opacity: .6 }} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(251,191,36,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title={t.introTitle} accent="rgba(251,191,36,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <p className={`font-body text-sm ${isDark ? "text-white/85" : "text-gray-700"} leading-relaxed`}>
                {t.introP.split(t.introEmphasis)[0]}
                <strong className="text-yellow-300">{t.introEmphasis}</strong>
                {t.introP.split(t.introEmphasis)[1]?.split(t.introEmphasis2)[0]}
                <em>{t.introEmphasis2}</em>
                {t.introP.split(t.introEmphasis2)[1]}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {t.introCats.map((c, i) => (
                  <div key={i} className="rounded-xl p-3 border text-center"
                    style={{ background: `${c.color}15`, borderColor: `${c.color}40` }}>
                    <p className="text-xs font-bold mb-1" style={{ color: c.color }}>✦ {c.label}</p>
                    <p className={`${isDark ? "text-white/55" : "text-gray-500"} text-xs`}>{c.desc}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-3 border"
                style={{ background: "rgba(251,191,36,.08)", borderColor: "rgba(251,191,36,.3)" }}>
                <p className="font-body text-sm text-yellow-200">
                  <strong>{t.introKeyBold}</strong>{t.introKeyRest}
                </p>
              </div>
            </div>
          </div>

          {/* ── KASUS 1 – Rectangle + Semicircle ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(6,182,212,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-cyan-400"
              title={t.k1Title} accent="rgba(6,182,212,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(6,182,212,.1)", borderColor: "rgba(6,182,212,.35)" }}>
                <p className="text-cyan-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k1Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k1Soal} <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                </p>
              </div>
              <SoalSVG4 t={t} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k1Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>
                  <strong>{t.k1Known}</strong>{t.k1KnownV} <InlineMath math="r = \tfrac{21}{2} = 10{,}5"/> cm
                </p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k1a}</strong></p>
                <BlockMath math="L = p \times l + \tfrac{1}{2}\pi r^2 = 21 \times 21 + \tfrac{1}{2} \times \tfrac{22}{7} \times (10{,}5)^2" />
                <BlockMath math="= 441 + \tfrac{11}{7} \times 110{,}25 = 441 + 173{,}25 \approx \boxed{614{,}25 \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k1b}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.k1bNote}</p>
                <BlockMath math="K = 21 + 21 + 21 + \pi r = 63 + \tfrac{22}{7} \times 10{,}5" />
                <BlockMath math="= 63 + 33 = \boxed{96 \,\mathrm{cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(6,182,212,.1)", borderColor: "rgba(6,182,212,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k1ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k1ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k1ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k1ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 2 – Dumbbell ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title={t.k2Title} accent="rgba(249,115,22,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k2Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k2Soal} <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                </p>
              </div>
              <SoalSVG1 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k2Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>
                  <strong>{t.k2Known}</strong>{t.k2KnownV} <InlineMath math="r = 7"/>{t.k2KnownV2}
                </p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k2a}</strong></p>
                <BlockMath math="L_a = L_{pp} - L_c" />
                <BlockMath math="= 28 \times 14 - \pi r^2 = 392 - \tfrac{22}{7} \times 49" />
                <BlockMath math="= 392 - 154 = \boxed{238 \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k2b}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.k2bNote} (<InlineMath math="\pi r"/>) + {t.k2bNote2} (<InlineMath math="\pi r"/>):</p>
                <BlockMath math="K_a = 2 \times 28 + 2 \times \pi r = 56 + 2 \times \tfrac{22}{7} \times 7" />
                <BlockMath math="= 56 + 44 = \boxed{100 \,\mathrm{cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                    <p className="text-orange-300 text-xs font-bold">{t.k2ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k2ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k2ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k2ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 3 – Half-annulus ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(236,72,153,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-pink-400"
              title={t.k3Title} accent="rgba(236,72,153,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(236,72,153,.1)", borderColor: "rgba(236,72,153,.35)" }}>
                <p className="text-pink-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k3Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k3Soal} <InlineMath math="(\pi = 3{,}14)"/>
                </p>
              </div>
              <SoalSVG5 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k3Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k3Known}</strong>{t.k3KnownV}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k3a}</strong></p>
                <BlockMath math="L = \tfrac{1}{2}\pi R^2 - \tfrac{1}{2}\pi r^2 = \tfrac{1}{2}\pi(R^2 - r^2)" />
                <BlockMath math="= \tfrac{1}{2} \times 3{,}14 \times (100 - 25) = \tfrac{1}{2} \times 3{,}14 \times 75" />
                <BlockMath math="= \tfrac{1}{2} \times 235{,}5 = \boxed{117{,}75 \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k3b}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.k3bNote}</p>
                <BlockMath math="K = \pi R + \pi r + 2(R - r) = 3{,}14 \times 10 + 3{,}14 \times 5 + 2(10-5)" />
                <BlockMath math="= 31{,}4 + 15{,}7 + 10 = \boxed{57{,}1 \,\mathrm{cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(236,72,153,.1)", borderColor: "rgba(236,72,153,.35)" }}>
                    <p className="text-pink-300 text-xs font-bold">{t.k3ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k3ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k3ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k3ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 4 – Quarter circle r=10 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(34,197,94,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400"
              title={t.k4Title} accent="rgba(34,197,94,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(34,197,94,.1)", borderColor: "rgba(34,197,94,.35)" }}>
                <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k4Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k4Soal} <InlineMath math="(\pi = 3{,}14)"/>
                </p>
              </div>
              <SoalSVG2 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k4Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k4Known}</strong>{t.k4KnownV}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k4a}</strong></p>
                <BlockMath math="L = \tfrac{1}{4}\pi r^2 = \tfrac{1}{4} \times 3{,}14 \times 10^2" />
                <BlockMath math="= \tfrac{1}{4} \times 314 = \boxed{78{,}5 \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k4b}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.k4bNote}</p>
                <BlockMath math="K = 2r + \tfrac{1}{4}(2\pi r) = 2(10) + \tfrac{1}{2} \times 3{,}14 \times 10" />
                <BlockMath math="= 20 + 15{,}7 = \boxed{35{,}7 \,\mathrm{cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,197,94,.1)", borderColor: "rgba(34,197,94,.35)" }}>
                    <p className="text-green-300 text-xs font-bold">{t.k4ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k4ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k4ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k4ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 5 – 4-Pointed Star ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(245,158,11,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-amber-400"
              title={t.k5Title} accent="rgba(245,158,11,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(245,158,11,.1)", borderColor: "rgba(245,158,11,.35)" }}>
                <p className="text-amber-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k5Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k5Soal} <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                </p>
              </div>
              <ContohDelapanSVG isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k5Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k5Known}</strong>{t.k5KnownV}</p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>{t.k5Hint}</p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>{t.k5Hint2}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.k5Use} <InlineMath math="L_b = (\pi - 2) \times r^2"/></p>
                <BlockMath math="L_b = \left(\tfrac{22}{7} - 2\right) \times 14^2 = \tfrac{8}{7} \times 196 = \boxed{224 \,\mathrm{cm}^2}" />
                <div className="rounded-xl p-3 border mt-1" style={{ background: "rgba(245,158,11,.07)", borderColor: "rgba(245,158,11,.25)" }}>
                  <p className="text-amber-200 text-xs font-body">{t.k5AltNote} <InlineMath math="L = 4 \times L_s - 2 \times L_p = 4 \times \tfrac{1}{4}\pi r^2 - 2r^2 = r^2(\pi-2)"/></p>
                </div>
                <div className="rounded-lg p-3 border text-center mt-2" style={{ background: "rgba(245,158,11,.1)", borderColor: "rgba(245,158,11,.35)" }}>
                  <p className="text-amber-300 text-xs font-bold">{t.k5Result}</p>
                  <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k5ResultV}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 6 – Triple arch ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(14,165,233,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-sky-400"
              title={t.k6Title} accent="rgba(14,165,233,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(14,165,233,.1)", borderColor: "rgba(14,165,233,.35)" }}>
                <p className="text-sky-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k6Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k6Soal} <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                </p>
              </div>
              <SoalSVG7 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k6Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k6Known}</strong>{t.k6KnownV}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k6a}</strong></p>
                <BlockMath math="L = \tfrac{1}{2}\pi R^2 - 2 \times \tfrac{1}{2}\pi r^2 = \tfrac{1}{2}\pi(R^2 - 2r^2)" />
                <BlockMath math="= \tfrac{1}{2} \times \tfrac{22}{7} \times (196 - 98) = \tfrac{11}{7} \times 98 = \boxed{154 \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k6b}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.k6bNote}</p>
                <BlockMath math="K = \pi R + 2\pi r = \tfrac{22}{7} \times 14 + 2 \times \tfrac{22}{7} \times 7" />
                <BlockMath math="= 44 + 44 = \boxed{88 \,\mathrm{cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(14,165,233,.1)", borderColor: "rgba(14,165,233,.35)" }}>
                    <p className="text-sky-300 text-xs font-bold">{t.k6ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k6ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k6ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k6ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 7 – Quarter sector 90° ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(139,92,246,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-violet-400"
              title={t.k7Title} accent="rgba(139,92,246,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(139,92,246,.1)", borderColor: "rgba(139,92,246,.35)" }}>
                <p className="text-violet-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k7Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k7Soal} <InlineMath math="(\pi = 3{,}14)"/>
                </p>
              </div>
              <SoalSVG10 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k7Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k7Known}</strong>{t.k7KnownV}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k7a}</strong></p>
                <BlockMath math="L_s = \tfrac{90°}{360°} \times \pi r^2 = \tfrac{1}{4} \times 3{,}14 \times 100" />
                <BlockMath math="= \tfrac{314}{4} = \boxed{78{,}5 \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k7b}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.k7bNote}</p>
                <BlockMath math="K = 2r + \tfrac{1}{4}(2\pi r) = 2(10) + \tfrac{1}{2} \times 3{,}14 \times 10" />
                <BlockMath math="= 20 + 15{,}7 = \boxed{35{,}7 \,\mathrm{cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(139,92,246,.1)", borderColor: "rgba(139,92,246,.35)" }}>
                    <p className="text-violet-300 text-xs font-bold">{t.k7ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k7ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k7ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k7ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 8 – Ice cream ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title={t.k8Title} accent="rgba(249,115,22,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k8Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k8Soal} <InlineMath math="(\pi = 3{,}14)"/>
                </p>
              </div>
              <SoalSVG13 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k8Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k8Known}</strong>{t.k8KnownV}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k8a}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.k8aNote}</p>
                <BlockMath math="L = \tfrac{1}{2}\pi r^2 + \tfrac{1}{2} \times a \times h" />
                <BlockMath math="= \tfrac{1}{2} \times 3{,}14 \times 10^2 + \tfrac{1}{2} \times 20 \times 24" />
                <BlockMath math="= 157 + 240 = \boxed{397 \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k8b}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.k8bNote}</p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.k8bNote2}</p>
                <BlockMath math="K = \pi r + 2s = 3{,}14 \times 10 + 2 \times 26" />
                <BlockMath math="= 31{,}4 + 52 = \boxed{83{,}4 \,\mathrm{cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                    <p className="text-orange-300 text-xs font-bold">{t.k8ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k8ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k8ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k8ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 9 – Trapezoid + quarter circle ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(14,165,233,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-sky-400"
              title={t.k9Title} accent="rgba(14,165,233,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(14,165,233,.1)", borderColor: "rgba(14,165,233,.35)" }}>
                <p className="text-sky-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k9Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k9Soal} <InlineMath math="(\pi = \tfrac{22}{7})"/>
                </p>
              </div>
              <SoalSVG14 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k9Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k9Known}</strong>{t.k9KnownV}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k9LT}</strong></p>
                <BlockMath math="L_T = \tfrac{1}{2}(a_1 + a_2) \times h = \tfrac{1}{2}(28 + 42) \times 14 = 490 \,\mathrm{cm}^2" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k9LQ}</strong></p>
                <BlockMath math="L_{qc} = \tfrac{1}{4}\pi r^2 = \tfrac{1}{4} \times \tfrac{22}{7} \times 196 = 154 \,\mathrm{cm}^2" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k9LTotal}</strong></p>
                <BlockMath math="L = L_T + L_{qc} = 490 + 154 = \boxed{644 \,\mathrm{cm}^2}" />
                <div className="rounded-lg p-3 border text-center mt-2" style={{ background: "rgba(14,165,233,.1)", borderColor: "rgba(14,165,233,.35)" }}>
                  <p className="text-sky-300 text-xs font-bold">{t.k9Result}</p>
                  <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k9ResultV}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 10 – Quarter circle r=14 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-purple-400"
              title={t.k10Title} accent="rgba(168,85,247,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
                <p className="text-purple-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k10Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k10Soal} <InlineMath math="(\pi = \tfrac{22}{7})"/>
                </p>
              </div>
              <SoalSVG15 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k10Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k10Known}</strong>{t.k10KnownV}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k10a}</strong></p>
                <BlockMath math="L = \tfrac{1}{4}\pi r^2 = \tfrac{1}{4} \times \tfrac{22}{7} \times 196 = \boxed{154 \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k10b}</strong> {t.k10bV}</p>
                <BlockMath math="K = 2r + \tfrac{1}{4}(2\pi r) = 28 + \tfrac{1}{2} \times \tfrac{22}{7} \times 14 = 28 + 22 = \boxed{50 \,\mathrm{cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
                    <p className="text-purple-300 text-xs font-bold">{t.k10ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k10ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k10ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k10ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 11 – Half-annulus R=14, r=7 ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title={t.k11Title} accent="rgba(249,115,22,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k11Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k11Soal} <InlineMath math="(\pi = \tfrac{22}{7})"/>
                </p>
              </div>
              <SoalSVG16 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k11Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k11Known}</strong>{t.k11KnownV}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k11a}</strong></p>
                <BlockMath math="L = \tfrac{1}{2}\pi(R^2 - r^2) = \tfrac{1}{2} \times \tfrac{22}{7} \times (196 - 49)" />
                <BlockMath math="= \tfrac{1}{2} \times \tfrac{22}{7} \times 147 = \tfrac{1}{2} \times 462 = \boxed{231 \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k11b}</strong> {t.k11bV}</p>
                <BlockMath math="K = \pi R + \pi r + 2(R - r) = \tfrac{22}{7}(14 + 7) + 2(7)" />
                <BlockMath math="= \tfrac{22}{7} \times 21 + 14 = 66 + 14 = \boxed{80 \,\mathrm{cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                    <p className="text-orange-300 text-xs font-bold">{t.k11ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k11ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k11ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k11ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 12 – Square minus two quarter circles ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(20,184,166,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-teal-400"
              title={t.k12Title} accent="rgba(20,184,166,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(20,184,166,.1)", borderColor: "rgba(20,184,166,.35)" }}>
                <p className="text-teal-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k12Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k12Soal} <InlineMath math="(\pi = \tfrac{22}{7})"/>
                </p>
              </div>
              <SoalSVG18 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k12Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k12Known}</strong>{t.k12KnownV}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k12LP}</strong></p>
                <BlockMath math="L_p = 14^2 = 196 \,\mathrm{cm}^2" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k12LQ}</strong> {t.k12LQV}</p>
                <BlockMath math="L_{hc} = 2 \times \tfrac{1}{4}\pi r^2 = \tfrac{1}{2} \times \tfrac{22}{7} \times 49 = \tfrac{1}{2} \times 154 = 77 \,\mathrm{cm}^2" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k12LA}</strong></p>
                <BlockMath math="L_a = L_p - L_{hc} = 196 - 77 = \boxed{119 \,\mathrm{cm}^2}" />
                <div className="rounded-lg p-3 border text-center mt-2" style={{ background: "rgba(20,184,166,.1)", borderColor: "rgba(20,184,166,.35)" }}>
                  <p className="text-teal-300 text-xs font-bold">{t.k12Result}</p>
                  <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k12ResultV}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 13 – Two semicircles union ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(99,102,241,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-indigo-400"
              title={t.k13Title} accent="rgba(99,102,241,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(99,102,241,.1)", borderColor: "rgba(99,102,241,.35)" }}>
                <p className="text-indigo-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k13Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k13Soal} <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                </p>
              </div>
              <SoalSVG19 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k13Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k13Known}</strong>{t.k13KnownV}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k13a}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>{t.k13aNote}</p>
                <BlockMath math="L = \tfrac{1}{2}\pi R^2 + \tfrac{1}{2}\pi r^2 = \tfrac{1}{2}\pi(R^2 + r^2)" />
                <BlockMath math="= \tfrac{11}{7} \times (169 + 49) = \tfrac{11}{7} \times 218 = \boxed{\tfrac{2398}{7} = 342\tfrac{4}{7} \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} pt-1`}><strong>{t.k13b}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>{t.k13bNote}</p>
                <BlockMath math="K = \pi R + \pi r = \tfrac{22}{7} \times (13 + 7) = \tfrac{22}{7} \times 20 = \boxed{\tfrac{440}{7} = 62\tfrac{6}{7} \,\mathrm{cm}}" />
                <div className="rounded-xl p-3 border mt-1" style={{ background: "rgba(99,102,241,.07)", borderColor: "rgba(99,102,241,.25)" }}>
                  <p className="text-indigo-200 text-xs font-body">{t.k13Tip}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(99,102,241,.1)", borderColor: "rgba(99,102,241,.35)" }}>
                    <p className="text-indigo-300 text-xs font-bold">{t.k13ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k13ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(99,102,241,.1)", borderColor: "rgba(99,102,241,.35)" }}>
                    <p className="text-indigo-300 text-xs font-bold">{t.k13ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k13ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 14 – Diagonal leaf in 7 cm square ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(20,184,166,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-teal-400"
              title={t.k14Title} accent="rgba(20,184,166,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(20,184,166,.1)", borderColor: "rgba(20,184,166,.35)" }}>
                <p className="text-teal-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k14Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k14Soal} <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                </p>
              </div>
              <SoalSVG8 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k14Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k14Known}</strong>{t.k14KnownV}</p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>{t.k14LNote}</p>
                <BlockMath math="L_d = 2\left(\tfrac{1}{4}\pi r^2 - \tfrac{1}{2}r^2\right) = r^2\left(\tfrac{\pi}{2} - 1\right)" />
                <BlockMath math="= 49 \times \left(\tfrac{22}{14} - 1\right) = 49 \times \tfrac{4}{7} = \boxed{28 \,\mathrm{cm}^2}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k14KNote}</strong></p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.k14KNoteV}</p>
                <BlockMath math="K = 2 \times \tfrac{1}{4}(2\pi r) = \pi r = \tfrac{22}{7} \times 7 = \boxed{22 \,\mathrm{cm}}" />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(20,184,166,.1)", borderColor: "rgba(20,184,166,.35)" }}>
                    <p className="text-teal-300 text-xs font-bold">{t.k14ResultL}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k14ResultLV}</p>
                  </div>
                  <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(34,211,238,.1)", borderColor: "rgba(34,211,238,.35)" }}>
                    <p className="text-cyan-300 text-xs font-bold">{t.k14ResultK}</p>
                    <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k14ResultKV}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KASUS 15 – 4-Petal flower in 14 cm square ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(249,115,22,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-orange-400"
              title={t.k15Title} accent="rgba(249,115,22,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">{t.k15Badge}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.k15Soal} <InlineMath math="\left(\pi = \tfrac{22}{7}\right)"/>
                </p>
              </div>
              <SoalSVG11 isId={isId} isEn={isEn} />
              <div className="rounded-xl p-4 space-y-3 border" style={{ background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.9)", borderColor: "rgba(100,116,139,.3)" }}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.k15Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.k15Known}</strong>{t.k15KnownV}</p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>{t.k15Note1}</p>
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>{t.k15Note2} <InlineMath math="r^2\!\left(\tfrac{\pi}{2}-1\right)"/> {t.k15Note2V}</p>
                <BlockMath math="L_k = r^2\!\left(\tfrac{\pi}{2}-1\right) = 196 \times \tfrac{4}{7} = 112 \,\mathrm{cm}^2" />
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>{t.k15Note3}</p>
                <BlockMath math="L_{4k} = 4 \times 28 = \boxed{112 \,\mathrm{cm}^2}" />
                <p className={`font-body text-xs ${isDark ? "text-white/50" : "text-gray-400"} italic`}>{t.k15Note4}</p>
                <div className="rounded-lg p-3 border text-center" style={{ background: "rgba(249,115,22,.1)", borderColor: "rgba(249,115,22,.35)" }}>
                  <p className="text-orange-300 text-xs font-bold">{t.k15Result}</p>
                  <p className={`${isDark ? "text-white" : "text-gray-900"} text-sm font-bold mt-1`}>{t.k15ResultV}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.75)" : "rgba(248,250,252,.97)", borderColor: "rgba(251,191,36,.25)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<BookOpen className="w-5 h-5" />} iconColor="text-yellow-400"
              title={t.rangkumanTitle} accent="rgba(251,191,36,.12)" />
            <div className="px-5 pb-5 pt-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.rangkumanCards.map((c, i) => {
                  const colors = ["#f97316","#06b6d4","#a855f7","#22c55e"];
                  const col = colors[i];
                  return (
                    <div key={i} className="rounded-xl p-3 border space-y-2"
                      style={{ background: `${col}12`, borderColor: `${col}38` }}>
                      <p className="font-bold text-xs" style={{ color: col }}>{c.emoji} {c.title}</p>
                      <div className={`text-[11px] ${isDark ? "text-white/50" : "text-gray-500"}`}>{t.rangkumanLuas}</div>
                      <BlockMath math={c.luas} />
                      <div className={`text-[11px] ${isDark ? "text-white/50" : "text-gray-500"}`}>{t.rangkumanKeliling}</div>
                      <BlockMath math={c.keliling} />
                    </div>
                  );
                })}
              </div>
              <div className="rounded-xl p-4 border"
                style={{ background: "linear-gradient(135deg,rgba(251,191,36,.1),rgba(249,115,22,.08))", borderColor: "rgba(251,191,36,.3)" }}>
                <p className="font-body text-sm text-yellow-200 leading-relaxed">
                  {t.rangkumanTip}<br/>
                  <span className="text-cyan-300">{t.rangkumanStep1}</span> →
                  <span className="text-green-300"> {t.rangkumanStep2}</span> →
                  <span className="text-orange-300"> {t.rangkumanStep3}</span> →
                  <span className="text-violet-300"> {t.rangkumanStep4}</span>.
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KaitanBangunDatarLainnyaPage;
