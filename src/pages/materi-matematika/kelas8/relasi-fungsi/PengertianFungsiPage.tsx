import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Zap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import DiskMillMachine from "@/components/DiskMillMachine";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    title: "PENGERTIAN FUNGSI DAN PENYAJIANNYA",
    subtitle: "Relasi Spesial: Satu Masukan, Tepat Satu Keluaran!",
    breadcrumb: "Kelas 8 · Relasi dan Fungsi · Materi Matematika",
    secIntro: "🌟 Fungsi — Relasi yang Lebih Ketat Aturannya",
    secKonsep: "📘 Syarat dan Konsep Fungsi",
    secBukan: "🔍 Fungsi vs Bukan Fungsi",
    secC1: "✏️ Contoh 1 — Domain, Kodomain, dan Range",
    secC2: "✏️ Contoh 2 — Identifikasi dari Diagram Panah",
    secC3: "✏️ Contoh 3 — Identifikasi Fungsi dari Pasangan Berurutan",
    secC4: "✏️ Contoh 4 — Identifikasi Fungsi dari Grafik",
    secRangkuman: "📌 Rangkuman & Kesimpulan",
    introP: "Bayangkan sebuah mesin pencetak nama: kamu masukkan satu nama, mesin mencetak satu label. Tidak mungkin mesin mencetak dua label berbeda dari satu nama yang sama. Itulah inti dari",
    introFungsi: "fungsi",
    introP2: "— setiap masukan hanya punya",
    introBold: "tepat satu keluaran",
    konsepTitle: "🎯 Ringkasan Intisari",
    konsepDef: "Fungsi",
    konsepDef2: "(atau pemetaan) dari himpunan",
    konsepDef3: "ke himpunan",
    konsepDef4: "adalah relasi yang memenuhi syarat:",
    konsepDef5: "setiap anggota domain (A) dipasangkan dengan tepat satu anggota kodomain (B)",
    konsepCond: "✅ Syarat Suatu Relasi Disebut Fungsi:",
    conditions: [
      { no: "1", syarat: "Setiap anggota domain harus dipasangkan", detail: "Tidak boleh ada anggota A yang tidak punya pasangan di B", color: "border-cyan-500/30 bg-cyan-900/10" },
      { no: "2", syarat: "Setiap anggota domain hanya boleh dipasangkan SATU kali", detail: "Tidak boleh satu anggota A punya dua pasangan berbeda di B", color: "border-green-500/30 bg-green-900/10" },
    ],
    konsepNote: "⚠️ Catatan:",
    konsepNoteText: "Boleh saja dua anggota domain berbeda dipasangkan ke anggota kodomain yang sama. Yang tidak boleh adalah satu anggota domain punya dua keluaran berbeda!",
    dkrTitle: "📌 Domain, Kodomain, dan Range",
    dkrItems: [
      { key: "Domain (Daerah Asal)", desc: "Himpunan A — semua nilai masukan", x: "x", desc2: "yang boleh digunakan fungsi.", color: "bg-cyan-900/20 border-cyan-500/25", labelColor: "text-cyan-400", xColor: "text-cyan-300" },
      { key: "Kodomain (Daerah Kawan)", desc: "Himpunan B — semua nilai yang", em: "mungkin", desc2: "jadi keluaran.", warn: "Tidak harus semuanya terpasang!", color: "bg-violet-900/20 border-violet-500/25", labelColor: "text-violet-400", warnColor: "text-orange-300" },
      { key: "Range (Daerah Hasil)", desc: "Anggota kodomain yang", em: "benar-benar", desc2: "menjadi nilai f(x).", bold: "Range ⊆ Kodomain", color: "bg-green-900/20 border-green-500/25", labelColor: "text-green-400", boldColor: "text-green-300" },
    ],
    exLabel: "Contoh:",
    unpairedNote: "3 dan 4 tidak terpasang",
    distinguishLabel: "Membedakan Fungsi dari Bukan Fungsi:",
    isFuncLabel: "✅ INI FUNGSI",
    notFuncLabel: "❌ BUKAN FUNGSI",
    twoArrowsNote: "Ada domain → 2 pasangan",
    noPartnerNote: "Ada domain tak berpasangan",
    funcDesc: "a→1, b→1, c→3 · Tiap anggota A tepat 1 panah ✓",
    twoArrowsSvg: "2 panah!",
    notAllowedSvg: "↑ tidak boleh",
    noPartnerSvg: "tidak ada pasangan!",
    bBadRef: "b→1 dan b→3 ✗",
    dNoPairRef: "d tidak punya pasangan ✗",
    presentTitle: "📋 Cara Menyajikan Fungsi",
    presentIntro: "Sajikan fungsi",
    presentIntro2: "dengan domain A =",
    presentIntro3: "dan kodomain B =",
    diag1Title: "1️⃣ Diagram Panah",
    diag1Note: "Elemen 3 dan 4 di B berwarna redup karena tidak termasuk Range.",
    kodoSvgLabel: "Kodomain",
    pair2Title: "2️⃣ Himpunan Pasangan Berurutan",
    pair2Note: "Tidak ada nilai x yang muncul 2× dengan y berbeda → ini fungsi ✓ · Range =",
    cart3Title: "3️⃣ Diagram Kartesius",
    domAxisX: "Domain (x)",
    parabolaNote: "Kurva parabola",
    parabolaNote2: "· Setiap x tepat 1 titik → fungsi ✓",
    c1Badge: "MUDAH",
    c1Soal: "📝 Soal",
    c1Q: "Perhatikan diagram panah berikut. Tentukan",
    c1Domain: "domain",
    c1Kodo: "kodomain",
    c1Range: "range",
    c1Q2: "dari fungsi tersebut!",
    c1PemTitle: "🔍 Pembahasan",
    c1DomainBadge: "DOMAIN",
    c1DomainSub: "= semua anggota himpunan A",
    c1DomainDesc: "Semua elemen di himpunan A adalah domain, karena setiap elemen memiliki pasangan di B.",
    c1KodoBadge: "KODOMAIN",
    c1KodoSub: "= semua anggota himpunan B",
    c1KodoDesc: "Semua elemen di himpunan B adalah kodomain, meskipun ada yang tidak mendapat panah (a dan c).",
    c1RangeBadge: "RANGE",
    c1RangeSub: "= anggota B yang benar-benar dipasangkan",
    c1RangeDesc: "Elemen",
    c1RangeDesc2: "dan",
    c1RangeDesc3: "tidak masuk range karena tidak ada panah yang menuju ke sana.",
    c1Summary: "📌 Ringkasan Jawaban",
    c2Badge: "SEDANG",
    c2Soal: "📝 Soal",
    c2Q: "Perhatikan lima diagram panah berikut. Untuk setiap diagram, tentukan apakah relasi tersebut merupakan",
    c2Func: "Fungsi",
    c2Or: "atau",
    c2NotFunc: "Bukan Fungsi",
    c2Q2: "!",
    c2FuncBtn: "✅ Fungsi",
    c2NotFuncBtn: "❌ Bukan",
    c2SelectAll: "Pilih semua jawaban dulu",
    c2CheckBtn: "🔍 Cek Jawaban",
    c2Correct: "✓ Benar!",
    c2WrongFunc: "✗ Salah — Ini FUNGSI",
    c2WrongNotFunc: "✗ Salah — Ini BUKAN FUNGSI",
    c2Score: "Nilai:",
    c2Perfect: "🎉 Sempurna! Kamu paham syarat fungsi dengan baik.",
    c2Good: "👍 Bagus! Review kembali diagram yang salah.",
    c2Retry: "📖 Coba pelajari lagi syarat fungsi ya!",
    c2PemTitle: "🔍 Pembahasan",
    c2ResetBtn: "↺ Ulangi Soal",
    c2Diagrams: [
      { n: 1, status: "FUNGSI ✅", color: "text-green-300", penj: "Setiap anggota domain (p, q, r) memiliki tepat satu panah ke kodomain. p→1, q→2, r→3. Semua syarat fungsi terpenuhi." },
      { n: 2, status: "FUNGSI ✅", color: "text-green-300", penj: "a→2 dan b→2 boleh saja (banyak ke satu = fungsi). Yang penting setiap domain punya tepat satu panah. a, b, c masing-masing punya 1 panah ✓" },
      { n: 3, status: "BUKAN FUNGSI ❌", color: "text-red-300", penj: "Anggota b memiliki DUA panah: b→1 dan b→3. Ini melanggar syarat fungsi — setiap domain hanya boleh punya satu pasangan!" },
      { n: 4, status: "FUNGSI ✅", color: "text-green-300", penj: "p→2, q→1, r→3. Setiap domain (p,q,r) memiliki tepat satu pasangan di kodomain. Kodomain boleh punya anggota yang tidak berpasangan (elemen 4 tidak dipetakan). Tetap fungsi ✓" },
      { n: 5, status: "BUKAN FUNGSI ❌", color: "text-red-300", penj: "Anggota c tidak memiliki panah ke kodomain (tidak berpasangan). Ini melanggar syarat fungsi — semua anggota domain wajib punya pasangan!" },
      { n: 6, status: "FUNGSI ✅", color: "text-green-300", penj: "x→2, y→2, z→2. Semua anggota domain menunjuk ke satu elemen kodomain yang sama (2). Ini disebut fungsi konstan — tetap sah sebagai fungsi karena setiap domain punya tepat satu pasangan ✓" },
    ],
    c3Badge: "SEDANG",
    c3Soal: "📝 Soal",
    c3Q: "Tentukan di antara relasi-relasi berikut yang merupakan fungsi!",
    c3PemTitle: "🔍 Pembahasan",
    c3PemNote: "Ingat: suatu relasi adalah",
    c3PemBold: "fungsi",
    c3PemNote2: "jika setiap anggota domain dipasangkan dengan",
    c3PemBold2: "tepat satu",
    c3PemNote3: "anggota kodomain.",
    c3DupLabel: "Domain duplikat:",
    c3Concl: "✅ Kesimpulan:",
    c3ConclText: "Yang merupakan fungsi: c dan e. Yang bukan fungsi: a (Maret duplikat), b (Ani & Beti duplikat), d (Selasa duplikat).",
    c3Sets: [
      { label: "a", data: "{(Januari, Senin), (Februari, Selasa), (Maret, Senin), (April, Selasa), (Maret, Rabu)}" },
      { label: "b", data: "{(Ani, Beti), (Beti, Dita), (Cici, Eni), (Beti, Fani), (Ani, Ganis)}" },
      { label: "c", data: "{(Ali, Senin), (Budi, Senin), (Cahya, Rabu), (Doni, Sabtu), (Edi, Rabu), (Feri, Kamis)}" },
      { label: "d", data: "{(Senin, 2001), (Selasa, 2004), (Rabu, 2007), (Selasa, 2007), (Sabtu, 2006)}" },
      { label: "e", data: "{(Adit, 2001), (Bana, 2002), (Cakra, 2002), (Eni, 2003), (Fitri, 2001), (Ganis, 2002)}" },
    ],
    c3Data: [
      { label: "a", status: "BUKAN FUNGSI", statusColor: "text-red-300", borderColor: "border-red-500/40 bg-red-900/10", duplikat: "Maret", penj: "Anggota domain \"Maret\" muncul DUA kali dengan pasangan berbeda: (Maret, Senin) dan (Maret, Rabu). Ini melanggar syarat fungsi!", pasangan: [["Januari","Senin"],["Februari","Selasa"],["Maret","Senin ✗"],["April","Selasa"],["Maret","Rabu ✗"]] },
      { label: "b", status: "BUKAN FUNGSI", statusColor: "text-red-300", borderColor: "border-red-500/40 bg-red-900/10", duplikat: "Ani & Beti", penj: '"Ani" punya dua pasangan: (Ani, Beti) dan (Ani, Ganis). "Beti" juga punya dua pasangan: (Beti, Dita) dan (Beti, Fani). Keduanya melanggar syarat fungsi!', pasangan: [["Ani","Beti ✗"],["Beti","Dita ✗"],["Cici","Eni"],["Beti","Fani ✗"],["Ani","Ganis ✗"]] },
      { label: "c", status: "FUNGSI ✅", statusColor: "text-green-300", borderColor: "border-green-500/40 bg-green-900/10", duplikat: "", penj: "Setiap domain (Ali, Budi, Cahya, Doni, Edi, Feri) masing-masing muncul tepat sekali. Boleh saja dua domain berbeda (misal Budi & Ali) menunjuk ke Senin yang sama — itu tetap fungsi!", pasangan: [["Ali","Senin"],["Budi","Senin"],["Cahya","Rabu"],["Doni","Sabtu"],["Edi","Rabu"],["Feri","Kamis"]] },
      { label: "d", status: "BUKAN FUNGSI", statusColor: "text-red-300", borderColor: "border-red-500/40 bg-red-900/10", duplikat: "Selasa", penj: '"Selasa" muncul dua kali dengan pasangan berbeda: (Selasa, 2004) dan (Selasa, 2007). Ini melanggar syarat fungsi!', pasangan: [["Senin","2001"],["Selasa","2004 ✗"],["Rabu","2007"],["Selasa","2007 ✗"],["Sabtu","2006"]] },
      { label: "e", status: "FUNGSI ✅", statusColor: "text-green-300", borderColor: "border-green-500/40 bg-green-900/10", duplikat: "", penj: "Setiap domain (Adit, Bana, Cakra, Eni, Fitri, Ganis) masing-masing muncul tepat sekali. Nilai kodomain boleh sama (2002 muncul 3 kali, 2001 muncul 2 kali) — itu tidak masalah. Ini adalah fungsi!", pasangan: [["Adit","2001"],["Bana","2002"],["Cakra","2002"],["Eni","2003"],["Fitri","2001"],["Ganis","2002"]] },
    ],
    c4Badge: "SEDANG",
    c4Soal: "📝 Soal",
    c4Q: "Di antara grafik berikut, manakah yang merupakan grafik fungsi dalam",
    c4Q2: "? Jelaskan!",
    c4Hint: "💡 Uji Garis Vertikal:",
    c4HintText: "Suatu grafik merupakan fungsi jika setiap garis vertikal",
    c4HintBold: "tepat satu titik",
    c4GraphLabel: "Grafik",
    c4IsFuncTag: "✅ FUNGSI",
    c4NotFuncTag: "❌ BUKAN",
    c4ConcTitle: "🔍 Kesimpulan",
    c4ConcText: "Grafik a, c, d, e adalah fungsi. Grafik b dan f bukan fungsi karena ada garis vertikal yang memotong grafik di lebih dari satu titik.",
    c4GraphData: [
      { label: "a", fungsi: true,  alasan: "Setiap garis vertikal hanya memotong garis di tepat satu titik. Garis lurus naik = fungsi linear." },
      { label: "b", fungsi: false, alasan: "Kurva melengkung balik — ada nilai x yang dipotong garis vertikal di DUA titik. Gagal uji garis vertikal." },
      { label: "c", fungsi: true,  alasan: "Kurva berbentuk gunung (naik lalu turun). Setiap garis vertikal hanya memotong kurva di satu titik." },
      { label: "d", fungsi: true,  alasan: "Garis lurus menurun. Setiap garis vertikal hanya memotong garis di tepat satu titik. Fungsi linear dengan gradien negatif." },
      { label: "e", fungsi: true,  alasan: "Gelombang sinusoidal. Meski naik-turun berulang, setiap nilai x tetap memiliki tepat satu nilai y. Fungsi." },
      { label: "f", fungsi: false, alasan: "Kurva melipat secara vertikal — ada nilai x yang dipotong garis vertikal di DUA titik berbeda. Gagal uji garis vertikal." },
    ],
    rangkumanTitle: "📚 Rangkuman Materi",
    tipsTitle: "💡 Tips & Trik",
    kesimpulanTitle: "🎯 Kesimpulan",
    rangItems: [
      { icon: "⚙️", label: "Fungsi",       desc: "Relasi khusus: setiap anggota domain dipasangkan dengan TEPAT SATU anggota kodomain.", color: "from-violet-900/60 to-purple-900/60 border-violet-500/40 text-violet-300" },
      { icon: "✅", label: "Syarat 1",     desc: "Semua anggota domain HARUS punya pasangan — tidak boleh ada yang kosong.", color: "from-green-900/60 to-emerald-900/60 border-green-500/40 text-green-300" },
      { icon: "☑️", label: "Syarat 2",    desc: "Setiap anggota domain hanya boleh punya SATU pasangan — tidak boleh bercabang.", color: "from-blue-900/60 to-cyan-900/60 border-blue-500/40 text-blue-300" },
      { icon: "📝", label: "Notasi Fungsi", desc: "f : A → B, dibaca 'f adalah fungsi dari A ke B'.", color: "from-orange-900/60 to-amber-900/60 border-orange-500/40 text-orange-300" },
      { icon: "🎯", label: "Nilai Fungsi",  desc: "f(x) = nilai output saat input adalah x. Dibaca: 'f dari x'.", color: "from-pink-900/60 to-rose-900/60 border-pink-500/40 text-pink-300" },
    ],
    tipItems: [
      "Cek diagram panah: setiap titik di domain WAJIB punya tepat satu anak panah keluar.",
      "Boleh: banyak anggota domain menuju satu anggota kodomain. Tidak boleh: satu domain ke dua kodomain.",
      "Gunakan tabel nilai — jika ada nilai x yang menghasilkan dua f(x) berbeda, itu bukan fungsi!",
    ],
    kesP: "Fungsi adalah",
    kesBold: "relasi dengan aturan ketat",
    kesP2: ". Setiap input menghasilkan",
    kesBold2: "tepat satu output",
    kesP3: "— seperti mesin yang selalu konsisten dan dapat diprediksi!",
    backBtn: "← Kembali ke Relasi dan Fungsi",
  },
  en: {
    title: "UNDERSTANDING FUNCTIONS AND THEIR REPRESENTATIONS",
    subtitle: "A Special Relation: One Input, Exactly One Output!",
    breadcrumb: "Grade 8 · Relations & Functions · Math Content",
    secIntro: "🌟 Functions — Relations with Stricter Rules",
    secKonsep: "📘 Conditions and Concepts of Functions",
    secBukan: "🔍 Functions vs Non-Functions",
    secC1: "✏️ Example 1 — Domain, Codomain, and Range",
    secC2: "✏️ Example 2 — Identify from Arrow Diagrams",
    secC3: "✏️ Example 3 — Identify Functions from Ordered Pairs",
    secC4: "✏️ Example 4 — Identify Functions from Graphs",
    secRangkuman: "📌 Summary & Conclusion",
    introP: "Imagine a label-printing machine: you insert one name, the machine prints one label. The machine cannot print two different labels from the same input. That is the essence of a",
    introFungsi: "function",
    introP2: "— every input has",
    introBold: "exactly one output",
    konsepTitle: "🎯 Key Summary",
    konsepDef: "A function",
    konsepDef2: "(or mapping) from set",
    konsepDef3: "to set",
    konsepDef4: "is a relation satisfying:",
    konsepDef5: "every domain element (A) is paired with exactly one codomain element (B)",
    konsepCond: "✅ Conditions for a Relation to Be a Function:",
    conditions: [
      { no: "1", syarat: "Every domain element must be paired", detail: "No element of A may be left without a partner in B", color: "border-cyan-500/30 bg-cyan-900/10" },
      { no: "2", syarat: "Every domain element may be paired ONLY ONCE", detail: "One element of A cannot have two different partners in B", color: "border-green-500/30 bg-green-900/10" },
    ],
    konsepNote: "⚠️ Note:",
    konsepNoteText: "Different domain elements may point to the same codomain element. What is NOT allowed is one domain element having two different outputs!",
    dkrTitle: "📌 Domain, Codomain, and Range",
    dkrItems: [
      { key: "Domain (Source Set)", desc: "Set A — all input values", x: "x", desc2: "that the function may use.", color: "bg-cyan-900/20 border-cyan-500/25", labelColor: "text-cyan-400", xColor: "text-cyan-300" },
      { key: "Codomain (Target Set)", desc: "Set B — all values that could", em: "possibly", desc2: "become an output.", warn: "Not all of them need to be paired!", color: "bg-violet-900/20 border-violet-500/25", labelColor: "text-violet-400", warnColor: "text-orange-300" },
      { key: "Range (Output Set)", desc: "Codomain members that", em: "actually", desc2: "become a value of f(x).", bold: "Range ⊆ Codomain", color: "bg-green-900/20 border-green-500/25", labelColor: "text-green-400", boldColor: "text-green-300" },
    ],
    exLabel: "Example:",
    unpairedNote: "3 and 4 are unpaired",
    distinguishLabel: "Distinguishing Functions from Non-Functions:",
    isFuncLabel: "✅ THIS IS A FUNCTION",
    notFuncLabel: "❌ NOT A FUNCTION",
    twoArrowsNote: "A domain has → 2 partners",
    noPartnerNote: "A domain has no partner",
    funcDesc: "a→1, b→1, c→3 · Each A element has exactly 1 arrow ✓",
    twoArrowsSvg: "2 arrows!",
    notAllowedSvg: "↑ not allowed",
    noPartnerSvg: "no partner!",
    bBadRef: "b→1 and b→3 ✗",
    dNoPairRef: "d has no partner ✗",
    presentTitle: "📋 Ways to Represent Functions",
    presentIntro: "Represent the function",
    presentIntro2: "with domain A =",
    presentIntro3: "and codomain B =",
    diag1Title: "1️⃣ Arrow Diagram",
    diag1Note: "Elements 3 and 4 in B are dimmed because they are not in the Range.",
    kodoSvgLabel: "Codomain",
    pair2Title: "2️⃣ Set of Ordered Pairs",
    pair2Note: "No x-value appears twice with a different y → this is a function ✓ · Range =",
    cart3Title: "3️⃣ Cartesian Diagram",
    domAxisX: "Domain (x)",
    parabolaNote: "Parabola curve",
    parabolaNote2: "· Each x has exactly 1 point → function ✓",
    c1Badge: "EASY",
    c1Soal: "📝 Problem",
    c1Q: "Look at the arrow diagram below. Determine the",
    c1Domain: "domain",
    c1Kodo: "codomain",
    c1Range: "range",
    c1Q2: "of the function!",
    c1PemTitle: "🔍 Solution",
    c1DomainBadge: "DOMAIN",
    c1DomainSub: "= all members of set A",
    c1DomainDesc: "All elements in set A are the domain, because every element has a partner in B.",
    c1KodoBadge: "CODOMAIN",
    c1KodoSub: "= all members of set B",
    c1KodoDesc: "All elements in set B are the codomain, even if some have no incoming arrow (a and c).",
    c1RangeBadge: "RANGE",
    c1RangeSub: "= members of B that are actually paired",
    c1RangeDesc: "Elements",
    c1RangeDesc2: "and",
    c1RangeDesc3: "are not in the range because no arrow points to them.",
    c1Summary: "📌 Answer Summary",
    c2Badge: "MEDIUM",
    c2Soal: "📝 Problem",
    c2Q: "Look at the five arrow diagrams below. For each diagram, determine whether the relation is a",
    c2Func: "Function",
    c2Or: "or",
    c2NotFunc: "Not a Function",
    c2Q2: "!",
    c2FuncBtn: "✅ Function",
    c2NotFuncBtn: "❌ Not a function",
    c2SelectAll: "Answer all first",
    c2CheckBtn: "🔍 Check Answers",
    c2Correct: "✓ Correct!",
    c2WrongFunc: "✗ Wrong — This IS a FUNCTION",
    c2WrongNotFunc: "✗ Wrong — This is NOT a FUNCTION",
    c2Score: "Score:",
    c2Perfect: "🎉 Perfect! You understand the function conditions well.",
    c2Good: "👍 Good! Review the incorrect diagrams.",
    c2Retry: "📖 Study the function conditions again!",
    c2PemTitle: "🔍 Solution",
    c2ResetBtn: "↺ Try Again",
    c2Diagrams: [
      { n: 1, status: "FUNCTION ✅", color: "text-green-300", penj: "Every domain element (p, q, r) has exactly one arrow to the codomain. p→1, q→2, r→3. All function conditions are met." },
      { n: 2, status: "FUNCTION ✅", color: "text-green-300", penj: "a→2 and b→2 is fine (many to one = function). The key is that every domain has exactly one arrow. a, b, c each have 1 arrow ✓" },
      { n: 3, status: "NOT A FUNCTION ❌", color: "text-red-300", penj: "Element b has TWO arrows: b→1 and b→3. This violates the function condition — each domain element may only have one partner!" },
      { n: 4, status: "FUNCTION ✅", color: "text-green-300", penj: "p→2, q→1, r→3. Every domain element (p,q,r) has exactly one partner in the codomain. The codomain may have unpaired elements (element 4 is not mapped). Still a function ✓" },
      { n: 5, status: "NOT A FUNCTION ❌", color: "text-red-300", penj: "Element c has no arrow to the codomain (no partner). This violates the function condition — every domain element must have a partner!" },
      { n: 6, status: "FUNCTION ✅", color: "text-green-300", penj: "x→2, y→2, z→2. All domain elements point to the same codomain element (2). This is a constant function — still valid because every domain element has exactly one partner ✓" },
    ],
    c3Badge: "MEDIUM",
    c3Soal: "📝 Problem",
    c3Q: "Determine which of the following relations are functions!",
    c3PemTitle: "🔍 Solution",
    c3PemNote: "Remember: a relation is a",
    c3PemBold: "function",
    c3PemNote2: "if every domain element is paired with",
    c3PemBold2: "exactly one",
    c3PemNote3: "codomain element.",
    c3DupLabel: "Duplicate domain:",
    c3Concl: "✅ Conclusion:",
    c3ConclText: "Functions: c and e. Not functions: a (March duplicate), b (Ani & Beti duplicate), d (Tuesday duplicate).",
    c3Sets: [
      { label: "a", data: "{(January, Monday), (February, Tuesday), (March, Monday), (April, Tuesday), (March, Wednesday)}" },
      { label: "b", data: "{(Ani, Beti), (Beti, Dita), (Cici, Eni), (Beti, Fani), (Ani, Ganis)}" },
      { label: "c", data: "{(Ali, Monday), (Budi, Monday), (Cahya, Wednesday), (Doni, Saturday), (Edi, Wednesday), (Feri, Thursday)}" },
      { label: "d", data: "{(Monday, 2001), (Tuesday, 2004), (Wednesday, 2007), (Tuesday, 2007), (Saturday, 2006)}" },
      { label: "e", data: "{(Adit, 2001), (Bana, 2002), (Cakra, 2002), (Eni, 2003), (Fitri, 2001), (Ganis, 2002)}" },
    ],
    c3Data: [
      { label: "a", status: "NOT A FUNCTION", statusColor: "text-red-300", borderColor: "border-red-500/40 bg-red-900/10", duplikat: "March", penj: 'Domain element "March" appears TWO times with different partners: (March, Monday) and (March, Wednesday). This violates the function condition!', pasangan: [["January","Monday"],["February","Tuesday"],["March","Monday ✗"],["April","Tuesday"],["March","Wednesday ✗"]] },
      { label: "b", status: "NOT A FUNCTION", statusColor: "text-red-300", borderColor: "border-red-500/40 bg-red-900/10", duplikat: "Ani & Beti", penj: '"Ani" has two partners: (Ani, Beti) and (Ani, Ganis). "Beti" also has two: (Beti, Dita) and (Beti, Fani). Both violate the function condition!', pasangan: [["Ani","Beti ✗"],["Beti","Dita ✗"],["Cici","Eni"],["Beti","Fani ✗"],["Ani","Ganis ✗"]] },
      { label: "c", status: "FUNCTION ✅", statusColor: "text-green-300", borderColor: "border-green-500/40 bg-green-900/10", duplikat: "", penj: "Every domain element (Ali, Budi, Cahya, Doni, Edi, Feri) appears exactly once. It is fine for different domains (e.g. Budi & Ali) to point to the same Monday — that is still a function!", pasangan: [["Ali","Monday"],["Budi","Monday"],["Cahya","Wednesday"],["Doni","Saturday"],["Edi","Wednesday"],["Feri","Thursday"]] },
      { label: "d", status: "NOT A FUNCTION", statusColor: "text-red-300", borderColor: "border-red-500/40 bg-red-900/10", duplikat: "Tuesday", penj: '"Tuesday" appears twice with different partners: (Tuesday, 2004) and (Tuesday, 2007). This violates the function condition!', pasangan: [["Monday","2001"],["Tuesday","2004 ✗"],["Wednesday","2007"],["Tuesday","2007 ✗"],["Saturday","2006"]] },
      { label: "e", status: "FUNCTION ✅", statusColor: "text-green-300", borderColor: "border-green-500/40 bg-green-900/10", duplikat: "", penj: "Every domain element (Adit, Bana, Cakra, Eni, Fitri, Ganis) appears exactly once. Codomain values may repeat (2002 appears 3 times, 2001 appears 2 times) — that is fine. This is a function!", pasangan: [["Adit","2001"],["Bana","2002"],["Cakra","2002"],["Eni","2003"],["Fitri","2001"],["Ganis","2002"]] },
    ],
    c4Badge: "MEDIUM",
    c4Soal: "📝 Problem",
    c4Q: "Which of the following graphs represents a function in",
    c4Q2: "? Explain!",
    c4Hint: "💡 Vertical Line Test:",
    c4HintText: "A graph is a function if every vertical line",
    c4HintBold: "exactly one point",
    c4GraphLabel: "Graph",
    c4IsFuncTag: "✅ FUNCTION",
    c4NotFuncTag: "❌ NOT FUNC.",
    c4ConcTitle: "🔍 Conclusion",
    c4ConcText: "Graphs a, c, d, e are functions. Graphs b and f are not functions because there exists a vertical line intersecting the graph at more than one point.",
    c4GraphData: [
      { label: "a", fungsi: true,  alasan: "Each vertical line intersects the line at exactly one point. Rising straight line = linear function." },
      { label: "b", fungsi: false, alasan: "Curve bending back — there are x-values where a vertical line intersects at TWO points. Fails the vertical line test." },
      { label: "c", fungsi: true,  alasan: "Mountain-shaped curve (rises then falls). Each vertical line intersects the curve at exactly one point." },
      { label: "d", fungsi: true,  alasan: "Decreasing straight line. Each vertical line intersects the line at exactly one point. Linear function with negative slope." },
      { label: "e", fungsi: true,  alasan: "Sinusoidal wave. Even though it goes up and down repeatedly, each x-value still has exactly one y-value. Function." },
      { label: "f", fungsi: false, alasan: "Curve folding vertically — there are x-values where a vertical line intersects at TWO different points. Fails the vertical line test." },
    ],
    rangkumanTitle: "📚 Summary",
    tipsTitle: "💡 Tips & Tricks",
    kesimpulanTitle: "🎯 Conclusion",
    rangItems: [
      { icon: "⚙️", label: "Function",      desc: "Special relation: every domain element is paired with EXACTLY ONE codomain element.", color: "from-violet-900/60 to-purple-900/60 border-violet-500/40 text-violet-300" },
      { icon: "✅", label: "Condition 1",   desc: "All domain members MUST have a partner — none may be left unpaired.", color: "from-green-900/60 to-emerald-900/60 border-green-500/40 text-green-300" },
      { icon: "☑️", label: "Condition 2",  desc: "Each domain element may have ONLY ONE partner — no branching.", color: "from-blue-900/60 to-cyan-900/60 border-blue-500/40 text-blue-300" },
      { icon: "📝", label: "Function Notation", desc: "f : A → B, read 'f is a function from A to B'.", color: "from-orange-900/60 to-amber-900/60 border-orange-500/40 text-orange-300" },
      { icon: "🎯", label: "Function Value",    desc: "f(x) = the output value when the input is x. Read: 'f of x'.", color: "from-pink-900/60 to-rose-900/60 border-pink-500/40 text-pink-300" },
    ],
    tipItems: [
      "Check the arrow diagram: every point in the domain MUST have exactly one outgoing arrow.",
      "Allowed: many domain elements pointing to one codomain element. Not allowed: one domain to two codomains.",
      "Use a value table — if any x-value produces two different f(x) values, it is not a function!",
    ],
    kesP: "A function is a",
    kesBold: "relation with strict rules",
    kesP2: ". Every input produces",
    kesBold2: "exactly one output",
    kesP3: "— like a machine that is always consistent and predictable!",
    backBtn: "← Back to Relations & Functions",
  },
  ja: {
    title: "関数とその表し方",
    subtitle: "特別な関係：1つの入力に正確に1つの出力！",
    breadcrumb: "中学2年 · 関係と関数 · 数学コンテンツ",
    secIntro: "🌟 関数 — より厳しいルールを持つ関係",
    secKonsep: "📘 関数の条件と概念",
    secBukan: "🔍 関数と非関数",
    secC1: "✏️ 例題1 — 定義域・終域・値域",
    secC2: "✏️ 例題2 — 矢印図から識別",
    secC3: "✏️ 例題3 — 順序対から関数を識別",
    secC4: "✏️ 例題4 — グラフから関数を識別",
    secRangkuman: "📌 まとめと結論",
    introP: "名前印刷機を想像してください：1つの名前を入れると、機械は1つのラベルを印刷します。同じ名前から2つの異なるラベルを印刷することはできません。それが",
    introFungsi: "関数",
    introP2: "の本質です — すべての入力には",
    introBold: "正確に1つの出力",
    konsepTitle: "🎯 要点まとめ",
    konsepDef: "関数",
    konsepDef2: "（または写像）は集合",
    konsepDef3: "から集合",
    konsepDef4: "への関係で、次の条件を満たします：",
    konsepDef5: "定義域（A）のすべての要素が終域（B）の正確に1つの要素と対応する",
    konsepCond: "✅ 関係が関数になるための条件：",
    conditions: [
      { no: "1", syarat: "すべての定義域要素に対応が必要", detail: "Aの要素でBに対応を持たないものがあってはなりません", color: "border-cyan-500/30 bg-cyan-900/10" },
      { no: "2", syarat: "各定義域要素の対応はただ1つだけ", detail: "Aの1つの要素がBの2つの異なる要素に対応してはなりません", color: "border-green-500/30 bg-green-900/10" },
    ],
    konsepNote: "⚠️ 注意：",
    konsepNoteText: "異なる定義域要素が同じ終域要素を指すことは問題ありません。許可されないのは、1つの定義域要素が2つの異なる出力を持つことです！",
    dkrTitle: "📌 定義域・終域・値域",
    dkrItems: [
      { key: "定義域 (Domain)", desc: "集合A — 関数が使える全ての入力値", x: "x", desc2: "。", color: "bg-cyan-900/20 border-cyan-500/25", labelColor: "text-cyan-400", xColor: "text-cyan-300" },
      { key: "終域 (Codomain)", desc: "集合B — 出力に", em: "なりうる", desc2: "全ての値。", warn: "全て対応する必要はありません！", color: "bg-violet-900/20 border-violet-500/25", labelColor: "text-violet-400", warnColor: "text-orange-300" },
      { key: "値域 (Range)", desc: "f(x)の値として", em: "実際に", desc2: "対応する終域の要素。", bold: "値域 ⊆ 終域", color: "bg-green-900/20 border-green-500/25", labelColor: "text-green-400", boldColor: "text-green-300" },
    ],
    exLabel: "例：",
    unpairedNote: "3と4は対応なし",
    distinguishLabel: "関数と非関数の区別：",
    isFuncLabel: "✅ これは関数",
    notFuncLabel: "❌ 関数ではない",
    twoArrowsNote: "定義域に2つの対応",
    noPartnerNote: "対応のない定義域がある",
    funcDesc: "a→1, b→1, c→3 · AのすべてがちょうどI本の矢印 ✓",
    twoArrowsSvg: "矢印2本!",
    notAllowedSvg: "↑ 不可",
    noPartnerSvg: "対応なし!",
    bBadRef: "b→1かつb→3 ✗",
    dNoPairRef: "dに対応なし ✗",
    presentTitle: "📋 関数の表し方",
    presentIntro: "関数",
    presentIntro2: "を定義域A =",
    presentIntro3: "、終域B =",
    diag1Title: "1️⃣ 矢印図",
    diag1Note: "BのElements 3と4は値域に含まれないため薄く表示されます。",
    kodoSvgLabel: "終域",
    pair2Title: "2️⃣ 順序対の集合",
    pair2Note: "同じxが異なるyで2回現れない → 関数 ✓ · 値域 =",
    cart3Title: "3️⃣ 座標平面",
    domAxisX: "定義域 (x)",
    parabolaNote: "放物線",
    parabolaNote2: "· 各xに正確に1点 → 関数 ✓",
    c1Badge: "基本",
    c1Soal: "📝 問題",
    c1Q: "以下の矢印図を見てください。この関数の",
    c1Domain: "定義域",
    c1Kodo: "終域",
    c1Range: "値域",
    c1Q2: "を求めなさい！",
    c1PemTitle: "🔍 解法",
    c1DomainBadge: "定義域",
    c1DomainSub: "= 集合Aの全要素",
    c1DomainDesc: "集合Aの全ての要素が定義域です（全要素にBとの対応があるため）。",
    c1KodoBadge: "終域",
    c1KodoSub: "= 集合Bの全要素",
    c1KodoDesc: "集合Bの全ての要素が終域です（矢印が来ない要素（aとc）も含む）。",
    c1RangeBadge: "値域",
    c1RangeSub: "= 実際に対応するBの要素",
    c1RangeDesc: "要素",
    c1RangeDesc2: "と",
    c1RangeDesc3: "は矢印が指していないため値域に含まれません。",
    c1Summary: "📌 答えのまとめ",
    c2Badge: "標準",
    c2Soal: "📝 問題",
    c2Q: "以下の5つの矢印図を見てください。それぞれの図の関係が",
    c2Func: "関数",
    c2Or: "か",
    c2NotFunc: "関数でない",
    c2Q2: "かを判断しなさい！",
    c2FuncBtn: "✅ 関数",
    c2NotFuncBtn: "❌ 関数でない",
    c2SelectAll: "全問答えてください",
    c2CheckBtn: "🔍 答えを確認",
    c2Correct: "✓ 正解！",
    c2WrongFunc: "✗ 不正解 — これは関数です",
    c2WrongNotFunc: "✗ 不正解 — これは関数ではありません",
    c2Score: "スコア：",
    c2Perfect: "🎉 完璧！関数の条件をよく理解しています。",
    c2Good: "👍 よくできました！間違えた図を復習しましょう。",
    c2Retry: "📖 関数の条件をもう一度学びましょう！",
    c2PemTitle: "🔍 解説",
    c2ResetBtn: "↺ もう一度",
    c2Diagrams: [
      { n: 1, status: "関数 ✅", color: "text-green-300", penj: "定義域の各要素（p, q, r）が終域に正確に1本の矢印を持ちます。p→1, q→2, r→3。すべての関数の条件を満たします。" },
      { n: 2, status: "関数 ✅", color: "text-green-300", penj: "a→2かつb→2でも問題ありません（多対一は関数）。重要なのは各定義域要素が正確に1本の矢印を持つことです。a, b, cそれぞれ1本ずつ ✓" },
      { n: 3, status: "関数でない ❌", color: "text-red-300", penj: "要素bが2本の矢印を持ちます：b→1とb→3。これは関数の条件に違反します — 各定義域要素は1つの対応しか持てません！" },
      { n: 4, status: "関数 ✅", color: "text-green-300", penj: "p→2, q→1, r→3。定義域の各要素（p,q,r）が終域に正確に1つの対応を持ちます。終域に対応のない要素があっても構いません（4は対応なし）。これは関数 ✓" },
      { n: 5, status: "関数でない ❌", color: "text-red-300", penj: "要素cが終域への矢印を持ちません（対応なし）。これは関数の条件に違反します — すべての定義域要素に対応が必要です！" },
      { n: 6, status: "関数 ✅", color: "text-green-300", penj: "x→2, y→2, z→2。すべての定義域要素が同じ終域要素（2）を指します。これを定数関数と呼びます — 各定義域要素に正確に1つの対応があるため有効な関数です ✓" },
    ],
    c3Badge: "標準",
    c3Soal: "📝 問題",
    c3Q: "以下の関係の中から関数であるものを答えなさい！",
    c3PemTitle: "🔍 解法",
    c3PemNote: "覚えよう：関係が",
    c3PemBold: "関数",
    c3PemNote2: "であるとは、定義域のすべての要素が終域の",
    c3PemBold2: "正確に1つ",
    c3PemNote3: "の要素と対応することです。",
    c3DupLabel: "重複する定義域：",
    c3Concl: "✅ 結論：",
    c3ConclText: "関数：cとe。関数でないもの：a（3月が重複）、b（AniとBetiが重複）、d（火曜が重複）。",
    c3Sets: [
      { label: "a", data: "{(1月, 月曜), (2月, 火曜), (3月, 月曜), (4月, 火曜), (3月, 水曜)}" },
      { label: "b", data: "{(Ani, Beti), (Beti, Dita), (Cici, Eni), (Beti, Fani), (Ani, Ganis)}" },
      { label: "c", data: "{(Ali, 月曜), (Budi, 月曜), (Cahya, 水曜), (Doni, 土曜), (Edi, 水曜), (Feri, 木曜)}" },
      { label: "d", data: "{(月曜, 2001), (火曜, 2004), (水曜, 2007), (火曜, 2007), (土曜, 2006)}" },
      { label: "e", data: "{(Adit, 2001), (Bana, 2002), (Cakra, 2002), (Eni, 2003), (Fitri, 2001), (Ganis, 2002)}" },
    ],
    c3Data: [
      { label: "a", status: "関数でない", statusColor: "text-red-300", borderColor: "border-red-500/40 bg-red-900/10", duplikat: "3月", penj: "定義域「3月」が異なる対応で2回現れます：(3月, 月曜)と(3月, 水曜)。これは関数の条件に違反します！", pasangan: [["1月","月曜"],["2月","火曜"],["3月","月曜 ✗"],["4月","火曜"],["3月","水曜 ✗"]] },
      { label: "b", status: "関数でない", statusColor: "text-red-300", borderColor: "border-red-500/40 bg-red-900/10", duplikat: "Ani & Beti", penj: "「Ani」に2つの対応：(Ani, Beti)と(Ani, Ganis)。「Beti」も2つ：(Beti, Dita)と(Beti, Fani)。いずれも関数の条件に違反します！", pasangan: [["Ani","Beti ✗"],["Beti","Dita ✗"],["Cici","Eni"],["Beti","Fani ✗"],["Ani","Ganis ✗"]] },
      { label: "c", status: "関数 ✅", statusColor: "text-green-300", borderColor: "border-green-500/40 bg-green-900/10", duplikat: "", penj: "定義域の各要素（Ali, Budi, Cahya, Doni, Edi, Feri）がそれぞれ一度だけ現れます。異なる定義域要素が同じ「月曜」を指しても問題ありません — 関数です！", pasangan: [["Ali","月曜"],["Budi","月曜"],["Cahya","水曜"],["Doni","土曜"],["Edi","水曜"],["Feri","木曜"]] },
      { label: "d", status: "関数でない", statusColor: "text-red-300", borderColor: "border-red-500/40 bg-red-900/10", duplikat: "火曜", penj: "「火曜」が異なる値で2回現れます：(火曜, 2004)と(火曜, 2007)。これは関数の条件に違反します！", pasangan: [["月曜","2001"],["火曜","2004 ✗"],["水曜","2007"],["火曜","2007 ✗"],["土曜","2006"]] },
      { label: "e", status: "関数 ✅", statusColor: "text-green-300", borderColor: "border-green-500/40 bg-green-900/10", duplikat: "", penj: "定義域の各要素（Adit, Bana, Cakra, Eni, Fitri, Ganis）がそれぞれ一度だけ現れます。終域の値が重複しても問題ありません（2002が3回、2001が2回）。これは関数です！", pasangan: [["Adit","2001"],["Bana","2002"],["Cakra","2002"],["Eni","2003"],["Fitri","2001"],["Ganis","2002"]] },
    ],
    c4Badge: "標準",
    c4Soal: "📝 問題",
    c4Q: "以下のグラフのうち、",
    c4Q2: "の関数のグラフはどれですか？説明しなさい！",
    c4Hint: "💡 垂直線テスト：",
    c4HintText: "グラフが関数であるとは、全ての垂直線",
    c4HintBold: "正確に1点",
    c4GraphLabel: "グラフ",
    c4IsFuncTag: "✅ 関数",
    c4NotFuncTag: "❌ 非関数",
    c4ConcTitle: "🔍 結論",
    c4ConcText: "グラフa, c, d, eは関数です。グラフbとfは関数ではありません（垂直線が2点以上で交わります）。",
    c4GraphData: [
      { label: "a", fungsi: true,  alasan: "各垂直線がグラフと正確に1点で交わります。右上がりの直線 = 線形関数。" },
      { label: "b", fungsi: false, alasan: "折り返すカーブ — 垂直線が2点で交わるx値があります。垂直線テスト失敗。" },
      { label: "c", fungsi: true,  alasan: "山型のカーブ（上昇後下降）。各垂直線がカーブと正確に1点で交わります。" },
      { label: "d", fungsi: true,  alasan: "右下がりの直線。各垂直線がグラフと正確に1点で交わります。負の傾きを持つ線形関数。" },
      { label: "e", fungsi: true,  alasan: "正弦波。繰り返し上下しても、各x値に正確に1つのy値があります。関数です。" },
      { label: "f", fungsi: false, alasan: "垂直方向に折り返すカーブ — 垂直線が2つの異なる点で交わるx値があります。垂直線テスト失敗。" },
    ],
    rangkumanTitle: "📚 まとめ",
    tipsTitle: "💡 ヒントとコツ",
    kesimpulanTitle: "🎯 結論",
    rangItems: [
      { icon: "⚙️", label: "関数 (Function)",      desc: "特別な関係：定義域のすべての要素が終域の正確に1つの要素と対応します。", color: "from-violet-900/60 to-purple-900/60 border-violet-500/40 text-violet-300" },
      { icon: "✅", label: "条件1",                desc: "すべての定義域要素に対応が必要 — 対応のない要素があってはなりません。", color: "from-green-900/60 to-emerald-900/60 border-green-500/40 text-green-300" },
      { icon: "☑️", label: "条件2",               desc: "各定義域要素の対応はただ1つ — 複数の対応を持ってはなりません。", color: "from-blue-900/60 to-cyan-900/60 border-blue-500/40 text-blue-300" },
      { icon: "📝", label: "関数の記法",           desc: "f : A → B、「fはAからBへの関数」と読みます。", color: "from-orange-900/60 to-amber-900/60 border-orange-500/40 text-orange-300" },
      { icon: "🎯", label: "関数値",               desc: "f(x) = 入力がxのときの出力値。「xのf」と読みます。", color: "from-pink-900/60 to-rose-900/60 border-pink-500/40 text-pink-300" },
    ],
    tipItems: [
      "矢印図を確認：定義域のすべての点が正確に1本の矢印を持つ必要があります。",
      "許可：複数の定義域要素が同一の終域要素を指す。不可：1つの定義域要素が2つの終域を指す。",
      "値表を使いましょう — あるx値で2つの異なるf(x)が出たら、それは関数ではありません！",
    ],
    kesP: "関数は",
    kesBold: "厳しいルールを持つ関係",
    kesP2: "です。すべての入力が",
    kesBold2: "正確に1つの出力",
    kesP3: "を生み出します — 常に一貫した予測可能な機械のように！",
    backBtn: "← 関係と関数に戻る",
  },
};

const PengertianFungsiPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "penyajian", "bukan-fungsi", "contoh1", "contoh2", "contoh3", "contoh4", "rangkuman",
  ]);
  const [soal4Answers, setSoal4Answers] = useState<Record<number,"fungsi"|"bukan">>({});
  const [soal4Checked, setSoal4Checked] = useState(false);
  const soal4Correct: Record<number,"fungsi"|"bukan"> = {1:"fungsi",2:"fungsi",3:"bukan",4:"fungsi",5:"bukan",6:"fungsi"};

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.subtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secIntro} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introP} <strong className="text-cyan-300">{t.introFungsi}</strong> {t.introP2} <strong className="text-cyan-300">{t.introBold}</strong>.
                </p>
                <DiskMillMachine />
              </div>
            )}
          </div>

          {/* KONSEP DASAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={t.secKonsep} />
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">{t.konsepTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">{t.konsepDef}</strong> {t.konsepDef2} <InlineMath math="A" /> {t.konsepDef3} <InlineMath math="B" /> {t.konsepDef4} <strong className="text-yellow-300">{t.konsepDef5}</strong>.
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.konsepCond}</p>
                  <div className="space-y-2 text-sm font-body">
                    {t.conditions.map(({ no, syarat, detail, color }) => (
                      <div key={no} className={`border ${color} rounded-lg p-3 flex gap-3`}>
                        <span className="font-display font-bold text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm">{no}</span>
                        <div>
                          <p className="text-white font-semibold">{syarat}</p>
                          <p className="text-white/60 text-xs mt-0.5">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-orange-200">
                    <strong>{t.konsepNote}</strong> {t.konsepNoteText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* FUNGSI vs BUKAN FUNGSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="bukan-fungsi" icon={<BookOpen className="w-5 h-5" />} iconColor="text-red-400" title={t.secBukan} />
            {expandedSections.includes("bukan-fungsi") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Domain, Kodomain, Range */}
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.dkrTitle}</p>
                  <div className="space-y-2 text-xs font-body">
                    {t.dkrItems.map((item, i) => (
                      <div key={i} className={`flex items-start gap-3 ${item.color} border rounded-lg px-3 py-2`}>
                        <span className={`font-bold min-w-[140px] shrink-0 ${item.labelColor}`}>{item.key}</span>
                        <span className="text-white/75">
                          {item.desc}
                          {item.x && <strong className={(item as any).xColor}> {item.x}</strong>}
                          {item.em && <em>{item.em}</em>}
                          {" "}{item.desc2}
                          {item.warn && <strong className={(item as any).warnColor}> {item.warn}</strong>}
                          {item.bold && <strong className={(item as any).boldColor}> {item.bold}</strong>}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Visual f(x) = x²+1 */}
                  <div className="bg-slate-900/60 rounded-xl p-3 flex flex-col items-center gap-2">
                    <p className="text-[11px] text-white/50 text-center">{t.exLabel} <span className="text-cyan-300 font-mono font-bold">f(x) = x² + 1</span></p>
                    <div className="flex items-stretch justify-center gap-3 flex-wrap text-xs font-body">
                      <div className="bg-cyan-900/40 border border-cyan-500/40 rounded-lg px-3 py-2 text-center">
                        <p className="text-cyan-400 font-bold mb-1 text-[10px] uppercase tracking-wide">Domain A</p>
                        <p className="text-cyan-200 font-mono">{"{-2,-1,0,1,2}"}</p>
                      </div>
                      <div className="flex items-center text-white/30 font-bold">→</div>
                      <div className="bg-violet-900/40 border border-violet-500/40 rounded-lg px-3 py-2 text-center">
                        <p className="text-violet-400 font-bold mb-1 text-[10px] uppercase tracking-wide">Kodomain B</p>
                        <p className="text-violet-200 font-mono">{"{1,2,3,4,5}"}</p>
                        <div className="mt-1.5 pt-1.5 border-t border-violet-500/20">
                          <p className="text-green-400 font-bold text-[10px]">Range = {"{1, 2, 5}"}</p>
                          <p className="text-white/30 text-[9px]">{t.unpairedNote}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 comparison diagrams */}
                <p className="font-body text-[10px] font-bold text-white/50 uppercase tracking-widest">{t.distinguishLabel}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* FUNGSI */}
                  <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-green-300 mb-2 text-center">{t.isFuncLabel}</p>
                    <div className="flex justify-center">
                      <svg width="230" height="195" viewBox="0 0 230 195">
                        <defs><marker id="fv-ok" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0,0 7,2.5 0,5" fill="#22c55e"/></marker></defs>
                        <ellipse cx="57" cy="100" rx="50" ry="85" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                        <text x="57" y="13" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">A</text>
                        <text x="57" y="188" textAnchor="middle" fill="#06b6d4" fontSize="8" opacity="0.55">Domain</text>
                        {([["a",48],["b",100],["c",152]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={57} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        <ellipse cx="175" cy="103" rx="50" ry="88" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="175" y="13" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        <text x="175" y="192" textAnchor="middle" fill="#8b5cf6" fontSize="8" opacity="0.55">{t.kodoSvgLabel}</text>
                        {([["1",44],["2",82],["3",120],["4",158]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={175} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        <path d="M73,48 C110,48 138,44 159,44" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fv-ok)"/>
                        <path d="M73,100 C100,92 138,62 159,44" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fv-ok)"/>
                        <path d="M73,152 C105,152 138,128 159,120" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fv-ok)"/>
                      </svg>
                    </div>
                    <p className="text-xs text-white/50 text-center mt-1">{t.funcDesc}</p>
                  </div>

                  {/* BUKAN FUNGSI 1 */}
                  <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-red-300 mb-1 text-center">{t.notFuncLabel}</p>
                    <p className="font-body text-[10px] text-red-300/60 text-center mb-2">{t.twoArrowsNote}</p>
                    <div className="flex justify-center">
                      <svg width="230" height="185" viewBox="0 0 230 185">
                        <defs>
                          <marker id="bfv-ok" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0,0 7,2.5 0,5" fill="#22c55e"/></marker>
                          <marker id="bfv-err" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0,0 7,2.5 0,5" fill="#ef4444"/></marker>
                        </defs>
                        <ellipse cx="57" cy="93" rx="50" ry="80" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                        <text x="57" y="11" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">A</text>
                        {([["a",48],["b",93],["c",138]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={57} y={y+4} textAnchor="middle" fill={el==="b" ? "#fca5a5" : "#cffafe"} fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        <ellipse cx="175" cy="93" rx="50" ry="80" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="175" y="11" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        {([["1",48],["2",93],["3",138]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={175} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        <path d="M73,48 C108,48 140,48 159,48" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bfv-ok)"/>
                        <path d="M73,93 C98,78 138,60 159,48" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#bfv-err)"/>
                        <path d="M73,93 C98,108 138,128 159,138" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#bfv-err)"/>
                        <path d="M73,138 C105,138 140,100 159,93" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bfv-ok)"/>
                        <text x="116" y="78" textAnchor="middle" fill="#ef4444" fontSize="8.5" fontWeight="bold">{t.twoArrowsSvg}</text>
                        <text x="116" y="88" textAnchor="middle" fill="#ef4444" fontSize="7.5" opacity="0.8">{t.notAllowedSvg}</text>
                      </svg>
                    </div>
                    <p className="text-xs text-white/50 text-center mt-1"><span className="text-red-400">{t.bBadRef}</span></p>
                  </div>

                  {/* BUKAN FUNGSI 2 */}
                  <div className="bg-orange-900/20 border border-orange-500/40 rounded-xl p-4">
                    <p className="font-body text-sm font-bold text-orange-300 mb-1 text-center">{t.notFuncLabel}</p>
                    <p className="font-body text-[10px] text-orange-300/60 text-center mb-2">{t.noPartnerNote}</p>
                    <div className="flex justify-center">
                      <svg width="230" height="210" viewBox="0 0 230 210">
                        <defs><marker id="bf2-ok" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0,0 7,2.5 0,5" fill="#22c55e"/></marker></defs>
                        <ellipse cx="57" cy="105" rx="50" ry="95" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                        <text x="57" y="10" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">A</text>
                        {([["a",38],["b",78],["c",118]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={57} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        <text x="57" y="172" textAnchor="middle" fill="#fed7aa" fontSize="12" fontWeight="bold">d</text>
                        <path d="M68,168 C85,168 105,168 118,168" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>
                        <text x="122" y="164" fill="#f97316" fontSize="9" fontWeight="bold">?</text>
                        <ellipse cx="178" cy="100" rx="48" ry="80" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="178" y="18" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                        {([["1",50],["2",100],["3",152]] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={178} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="12" fontWeight="bold">{el}</text>
                        ))}
                        <path d="M73,38 C108,38 145,85 162,100" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bf2-ok)"/>
                        <path d="M73,78 C105,72 145,55 162,50" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bf2-ok)"/>
                        <path d="M73,118 C105,128 140,148 162,152" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#bf2-ok)"/>
                        <text x="57" y="192" textAnchor="middle" fill="#f97316" fontSize="7.5" fontWeight="bold">{t.noPartnerSvg}</text>
                      </svg>
                    </div>
                    <p className="text-xs text-white/50 text-center mt-1"><span className="text-orange-400">{t.dNoPairRef}</span></p>
                  </div>
                </div>

                {/* Cara Menyajikan Fungsi */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-bold text-cyan-300">{t.presentTitle}</p>
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg px-3 py-2">
                    <p className="font-body text-xs text-cyan-200">
                      {t.presentIntro} <span className="font-mono font-bold text-cyan-300">f(x) = x² + 1</span> {t.presentIntro2} {"{-2, -1, 0, 1, 2}"} {t.presentIntro3} {"{1, 2, 3, 4, 5}"}.
                    </p>
                  </div>

                  {/* 1. Diagram Panah */}
                  <div className="bg-slate-800/40 border border-cyan-500/15 rounded-xl p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-cyan-400">{t.diag1Title}</p>
                    <p className="font-body text-[10px] text-white/45">{t.diag1Note}</p>
                    <div className="flex justify-center">
                      <svg width="270" height="262" viewBox="0 0 270 262">
                        <defs><marker id="fp-ok" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0,0 7,2.5 0,5" fill="#22c55e"/></marker></defs>
                        <ellipse cx="62" cy="122" rx="54" ry="110" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                        <text x="62" y="11" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">A</text>
                        <text x="62" y="252" textAnchor="middle" fill="#06b6d4" fontSize="7.5" opacity="0.6">Domain</text>
                        {([
                          ["-2",32],["-1",72],["0",112],["1",152],["2",195]
                        ] as [string,number][]).map(([el,y]) => (
                          <text key={el} x={62} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">{el}</text>
                        ))}
                        <ellipse cx="208" cy="122" rx="54" ry="110" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                        <text x="208" y="11" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="bold">B</text>
                        <text x="208" y="252" textAnchor="middle" fill="#8b5cf6" fontSize="7.5" opacity="0.6">{t.kodoSvgLabel}</text>
                        {([
                          ["1",32],["2",72],["3",112],["4",152],["5",195]
                        ] as [string,number][]).map(([el,y]) => {
                          const inRange = el==="1"||el==="2"||el==="5";
                          return <text key={el} x={208} y={y+4} textAnchor="middle" fill={inRange ? "#e9d5ff" : "#64748b"} fontSize="11" fontWeight="bold">{el}</text>;
                        })}
                        <text x="253" y="29" textAnchor="middle" fill="#4ade80" fontSize="7.5" fontWeight="bold">Range</text>
                        <line x1="238" y1="32"  x2="238" y2="195" stroke="#4ade80" strokeWidth="1.2" opacity="0.5"/>
                        <line x1="238" y1="32"  x2="247" y2="32"  stroke="#4ade80" strokeWidth="1.8"/>
                        <line x1="238" y1="72"  x2="247" y2="72"  stroke="#4ade80" strokeWidth="1.8"/>
                        <line x1="238" y1="195" x2="247" y2="195" stroke="#4ade80" strokeWidth="1.8"/>
                        <path d="M80,32 C125,32 165,182 190,195" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fp-ok)"/>
                        <path d="M80,72 C118,72 155,72 190,72" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fp-ok)"/>
                        <path d="M80,112 C112,100 155,45 190,32" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fp-ok)"/>
                        <path d="M80,152 C112,135 155,88 190,72" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fp-ok)"/>
                        <path d="M80,195 C118,195 155,195 190,195" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#fp-ok)"/>
                      </svg>
                    </div>
                  </div>

                  {/* 2. Himpunan Pasangan Berurutan */}
                  <div className="bg-slate-800/40 border border-green-500/15 rounded-xl p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-green-400">{t.pair2Title}</p>
                    <div className="bg-green-900/20 border border-green-500/25 rounded-lg p-3 font-mono text-xs leading-relaxed">
                      <span className="text-green-300 font-bold text-sm">{"{"}</span>
                      {" "}
                      {([
                        ["-2","5"],["-1","2"],["0","1"],["1","2"],["2","5"],
                      ] as [string,string][]).map(([x,y],i,arr) => (
                        <span key={x}>
                          <span className="text-cyan-300">(</span>
                          <span className="text-yellow-300">{x}</span>
                          <span className="text-white/50">,</span>
                          <span className="text-green-300"> {y}</span>
                          <span className="text-cyan-300">)</span>
                          {i < arr.length-1 && <span className="text-white/40">, </span>}
                        </span>
                      ))}
                      {" "}
                      <span className="text-green-300 font-bold text-sm">{"}"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-body text-white/50">
                      {["-2→5","-1→2","0→1","1→2","2→5"].map(s => (
                        <span key={s} className="bg-slate-700/50 rounded px-2 py-0.5">{s}</span>
                      ))}
                    </div>
                    <p className="text-[10px] font-body text-white/40">
                      {t.pair2Note} {"{1, 2, 5}"}
                    </p>
                  </div>

                  {/* 3. Diagram Kartesius */}
                  <div className="bg-slate-800/40 border border-violet-500/15 rounded-xl p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-violet-400">{t.cart3Title}</p>
                    <div className="flex justify-center">
                      <svg width="250" height="225" viewBox="0 0 250 225">
                        {[40,70,130,160].map(gx => (
                          <line key={gx} x1={gx} y1="25" x2={gx} y2="195" stroke="rgba(148,163,184,0.12)" strokeWidth="1" strokeDasharray="3,3"/>
                        ))}
                        {[45,75,105,135,165].map(gy => (
                          <line key={gy} x1="25" y1={gy} x2="185" y2={gy} stroke="rgba(148,163,184,0.12)" strokeWidth="1" strokeDasharray="3,3"/>
                        ))}
                        <line x1="25" y1="195" x2="185" y2="195" stroke="#94a3b8" strokeWidth="1.8"/>
                        <line x1="100" y1="195" x2="100" y2="20"  stroke="#94a3b8" strokeWidth="1.8"/>
                        <polygon points="182,192 190,195 182,198" fill="#94a3b8"/>
                        <polygon points="97,22 100,15 103,22"     fill="#94a3b8"/>
                        {([[-2,40],[-1,70],[0,100],[1,130],[2,160]] as [number,number][]).map(([v,px]) => (
                          <text key={v} x={px} y="210" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">{v}</text>
                        ))}
                        {([[1,165],[2,135],[3,105],[4,75],[5,45]] as [number,number][]).map(([v,py]) => (
                          <text key={v} x="92" y={py+3} textAnchor="end" fill={v===3||v===4 ? "#475569" : "#a78bfa"} fontSize="9" fontWeight="bold">{v}</text>
                        ))}
                        {[40,70,130,160].map(gx => (
                          <line key={gx} x1={gx} y1="195" x2={gx} y2="200" stroke="#94a3b8" strokeWidth="1.2"/>
                        ))}
                        {[45,75,105,135,165].map(gy => (
                          <line key={gy} x1="96" y1={gy} x2="100" y2={gy} stroke="#94a3b8" strokeWidth="1.2"/>
                        ))}
                        <text x="193" y="199" fill="#64748b" fontSize="7">x</text>
                        <text x="103" y="16"  fill="#64748b" fontSize="7">y</text>
                        <text x="107" y="220" textAnchor="middle" fill="#64748b" fontSize="7">{t.domAxisX}</text>
                        <polyline
                          points={Array.from({length:41}, (_,i) => {
                            const xv = -2 + i*0.1;
                            return `${100+xv*30},${195-(xv*xv+1)*30}`;
                          }).join(' ')}
                          fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.45" strokeDasharray="4,3"
                        />
                        {([
                          {x:-2,y:5,cx:40,cy:45},{x:-1,y:2,cx:70,cy:135},
                          {x:0,y:1,cx:100,cy:165},{x:1,y:2,cx:130,cy:135},{x:2,y:5,cx:160,cy:45}
                        ]).map(({cx,cy,x}) => (
                          <g key={x}>
                            <circle cx={cx} cy={cy} r="5.5" fill="#22c55e" stroke="white" strokeWidth="1.5"/>
                            <text x={cx} y={cy-9} textAnchor="middle" fill="#86efac" fontSize="7.5">{`(${x},${x*x+1})`}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                    <p className="text-[10px] font-body text-white/40 text-center">
                      {t.parabolaNote} <span className="font-mono text-violet-400">y = x² + 1</span> {t.parabolaNote2}
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.secC1} />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.c1Badge} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.c1Soal}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    {t.c1Q} <strong className="text-cyan-300">{t.c1Domain}</strong>, <strong className="text-violet-300">{t.c1Kodo}</strong>, {language === "ja" ? "そして" : "dan"} <strong className="text-green-300">{t.c1Range}</strong> {t.c1Q2}
                  </p>
                </div>

                <div className="flex justify-center">
                  <svg width="260" height="230" viewBox="0 0 260 230">
                    <defs>
                      <marker id="c3-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                        <polygon points="0,0 7,2.5 0,5" fill="#22c55e"/>
                      </marker>
                    </defs>
                    <ellipse cx="62" cy="115" rx="52" ry="100" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.5"/>
                    <text x="62" y="14" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="bold">A</text>
                    {([["1",50],["2",88],["3",126],["4",164]] as [string,number][]).map(([el,y])=>(
                      <text key={el} x={62} y={y+4} textAnchor="middle" fill="#cffafe" fontSize="13" fontWeight="bold">{el}</text>
                    ))}
                    <ellipse cx="198" cy="115" rx="52" ry="100" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.5"/>
                    <text x="198" y="14" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="bold">B</text>
                    {([["a",30],["b",66],["c",102],["d",138],["e",174]] as [string,number][]).map(([el,y])=>(
                      <text key={el} x={198} y={y+4} textAnchor="middle" fill="#e9d5ff" fontSize="13" fontWeight="bold">{el}</text>
                    ))}
                    <path d="M80,50 C118,50 158,60 180,66" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#c3-arr)"/>
                    <path d="M80,88 C112,100 148,128 180,138" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#c3-arr)"/>
                    <path d="M80,126 C112,112 148,78 180,66" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#c3-arr)"/>
                    <path d="M80,164 C112,164 148,168 180,174" fill="none" stroke="#22c55e" strokeWidth="1.8" markerEnd="url(#c3-arr)"/>
                    <text x="62" y="220" textAnchor="middle" fill="#06b6d4" fontSize="8" opacity="0.6">Domain</text>
                    <text x="198" y="220" textAnchor="middle" fill="#8b5cf6" fontSize="8" opacity="0.6">{t.kodoSvgLabel}</text>
                  </svg>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.c1PemTitle}</p>
                  <div className="space-y-3 font-body text-sm">
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-cyan-700/60 text-cyan-200 text-[11px] font-bold px-2 py-0.5 rounded">{t.c1DomainBadge}</span>
                        <span className="text-white/50 text-xs">{t.c1DomainSub}</span>
                      </div>
                      <p className="text-white/80 text-sm">Domain = <strong className="text-cyan-300">{"{"} 1, 2, 3, 4 {"}"}</strong></p>
                      <p className="text-white/45 text-xs mt-1">{t.c1DomainDesc}</p>
                    </div>
                    <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-violet-700/60 text-violet-200 text-[11px] font-bold px-2 py-0.5 rounded">{t.c1KodoBadge}</span>
                        <span className="text-white/50 text-xs">{t.c1KodoSub}</span>
                      </div>
                      <p className="text-white/80 text-sm">Kodomain = <strong className="text-violet-300">{"{"} a, b, c, d, e {"}"}</strong></p>
                      <p className="text-white/45 text-xs mt-1">{t.c1KodoDesc}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-green-700/60 text-green-200 text-[11px] font-bold px-2 py-0.5 rounded">{t.c1RangeBadge}</span>
                        <span className="text-white/50 text-xs">{t.c1RangeSub}</span>
                      </div>
                      <div className="space-y-1 text-xs text-white/60 mb-2">
                        {[["1","b"],["2","d"],["3","b"],["4","e"]].map(([x,y])=>(
                          <div key={x} className="flex items-center gap-1.5">
                            <span className="text-cyan-300 font-bold">{x}</span>
                            <span className="text-white/30">→</span>
                            <span className="text-green-300 font-bold">{y}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-white/80 text-sm">Range = <strong className="text-green-300">{"{"} b, d, e {"}"}</strong></p>
                      <p className="text-white/45 text-xs mt-1">
                        {t.c1RangeDesc} <strong className="text-slate-400">a</strong> {t.c1RangeDesc2} <strong className="text-slate-400">c</strong> {t.c1RangeDesc3}
                      </p>
                    </div>
                    <div className="bg-slate-800/60 border border-white/10 rounded-lg p-3 flex flex-col gap-1.5">
                      <p className="text-xs text-white/40 font-semibold mb-0.5">{t.c1Summary}</p>
                      <p className="text-sm text-white/80">Domain &nbsp;&nbsp;&nbsp;= <strong className="text-cyan-300">{"{"} 1, 2, 3, 4 {"}"}</strong></p>
                      <p className="text-sm text-white/80">Kodomain = <strong className="text-violet-300">{"{"} a, b, c, d, e {"}"}</strong></p>
                      <p className="text-sm text-white/80">Range &nbsp;&nbsp;&nbsp;= <strong className="text-green-300">{"{"} b, d, e {"}"}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 — Interactive */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title={t.secC2} />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.c2Badge} color="bg-purple-700/60 text-purple-200" />
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.c2Soal}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    {t.c2Q} <strong className="text-green-300">{t.c2Func}</strong> {t.c2Or} <strong className="text-red-300">{t.c2NotFunc}</strong>{t.c2Q2}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {([
                    { n:1, title:"Diagram 1", svg:(
                      <svg width="100%" viewBox="0 0 175 158">
                        <defs><marker id="arr-d1" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker></defs>
                        <ellipse cx="46" cy="79" rx="36" ry="62" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                        <text x="46" y="12" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                        <text x="46" y="43" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">p</text>
                        <text x="46" y="82" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">q</text>
                        <text x="46" y="121" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">r</text>
                        <ellipse cx="129" cy="79" rx="36" ry="62" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                        <text x="129" y="12" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                        <text x="129" y="43" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">1</text>
                        <text x="129" y="82" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                        <text x="129" y="121" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">3</text>
                        <path d="M61,39 C88,39 97,39 113,39" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d1)"/>
                        <path d="M61,78 C88,78 97,78 113,78" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d1)"/>
                        <path d="M61,117 C88,117 97,117 113,117" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d1)"/>
                      </svg>
                    )},
                    { n:2, title:"Diagram 2", svg:(
                      <svg width="100%" viewBox="0 0 175 158">
                        <defs><marker id="arr-d2" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker></defs>
                        <ellipse cx="46" cy="79" rx="36" ry="62" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                        <text x="46" y="12" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                        <text x="46" y="43" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">a</text>
                        <text x="46" y="82" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">b</text>
                        <text x="46" y="121" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">c</text>
                        <ellipse cx="129" cy="79" rx="36" ry="62" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                        <text x="129" y="12" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                        <text x="129" y="43" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">1</text>
                        <text x="129" y="82" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                        <text x="129" y="121" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">3</text>
                        <path d="M61,39 C85,39 97,68 113,78" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d2)"/>
                        <path d="M61,78 C88,78 97,78 113,78" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d2)"/>
                        <path d="M61,117 C88,117 97,117 113,117" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d2)"/>
                      </svg>
                    )},
                    { n:3, title:"Diagram 3", svg:(
                      <svg width="100%" viewBox="0 0 175 158">
                        <defs>
                          <marker id="arr-d3g" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker>
                          <marker id="arr-d3r" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#ef4444"/></marker>
                        </defs>
                        <ellipse cx="46" cy="79" rx="36" ry="62" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                        <text x="46" y="12" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                        <text x="46" y="43" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">a</text>
                        <text x="46" y="82" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">b</text>
                        <text x="46" y="121" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">c</text>
                        <ellipse cx="129" cy="79" rx="36" ry="62" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                        <text x="129" y="12" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                        <text x="129" y="43" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">1</text>
                        <text x="129" y="82" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                        <text x="129" y="121" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">3</text>
                        <path d="M61,39 C88,39 97,39 113,39" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d3g)"/>
                        <path d="M61,78 C84,65 100,50 113,39" fill="none" stroke="#ef4444" strokeWidth="1.8" markerEnd="url(#arr-d3r)"/>
                        <path d="M61,78 C84,92 100,108 113,117" fill="none" stroke="#ef4444" strokeWidth="1.8" markerEnd="url(#arr-d3r)"/>
                        <path d="M61,117 C85,117 97,88 113,78" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d3g)"/>
                      </svg>
                    )},
                    { n:4, title:"Diagram 4", svg:(
                      <svg width="100%" viewBox="0 0 175 170">
                        <defs><marker id="arr-d4" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker></defs>
                        <ellipse cx="46" cy="88" rx="36" ry="68" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                        <text x="46" y="13" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                        <text x="46" y="48" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">p</text>
                        <text x="46" y="90" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">q</text>
                        <text x="46" y="134" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">r</text>
                        <ellipse cx="129" cy="84" rx="36" ry="72" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                        <text x="129" y="7" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                        <text x="129" y="31" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">1</text>
                        <text x="129" y="66" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                        <text x="129" y="103" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">3</text>
                        <text x="129" y="140" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">4</text>
                        <path d="M61,44 C86,44 100,56 113,62" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d4)"/>
                        <path d="M61,86 C86,72 100,38 113,27" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d4)"/>
                        <path d="M61,130 C86,130 100,106 113,99" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d4)"/>
                      </svg>
                    )},
                    { n:5, title:"Diagram 5", svg:(
                      <svg width="100%" viewBox="0 0 175 170">
                        <defs><marker id="arr-d5" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker></defs>
                        <ellipse cx="46" cy="85" rx="36" ry="72" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                        <text x="46" y="7" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                        <text x="46" y="31" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">a</text>
                        <text x="46" y="66" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">b</text>
                        <text x="46" y="103" textAnchor="middle" fill="#fed7aa" fontSize="11" fontWeight="bold">c</text>
                        <text x="46" y="140" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">d</text>
                        <ellipse cx="129" cy="88" rx="36" ry="68" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                        <text x="129" y="13" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                        <text x="129" y="48" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">1</text>
                        <text x="129" y="90" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                        <text x="129" y="134" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">3</text>
                        <path d="M61,27 C86,27 100,80 113,86" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d5)"/>
                        <path d="M61,62 C86,55 100,50 113,44" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d5)"/>
                        <path d="M61,136 C86,136 100,132 113,130" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d5)"/>
                      </svg>
                    )},
                    { n:6, title:"Diagram 6", svg:(
                      <svg width="100%" viewBox="0 0 175 158">
                        <defs><marker id="arr-d6" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0,0 6,2.5 0,5" fill="#22c55e"/></marker></defs>
                        <ellipse cx="46" cy="79" rx="36" ry="62" fill="rgba(6,182,212,0.07)" stroke="#06b6d4" strokeWidth="1.4"/>
                        <text x="46" y="12" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">A</text>
                        <text x="46" y="43" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">x</text>
                        <text x="46" y="79" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">y</text>
                        <text x="46" y="117" textAnchor="middle" fill="#cffafe" fontSize="11" fontWeight="bold">z</text>
                        <ellipse cx="129" cy="79" rx="36" ry="62" fill="rgba(139,92,246,0.07)" stroke="#8b5cf6" strokeWidth="1.4"/>
                        <text x="129" y="12" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">B</text>
                        <text x="129" y="43" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">1</text>
                        <text x="129" y="79" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="bold">2</text>
                        <text x="129" y="117" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">3</text>
                        <path d="M61,39 C88,39 100,60 113,75" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d6)"/>
                        <path d="M61,75 C88,75 97,75 113,75" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d6)"/>
                        <path d="M61,113 C88,113 100,95 113,75" fill="none" stroke="#22c55e" strokeWidth="1.6" markerEnd="url(#arr-d6)"/>
                      </svg>
                    )},
                  ] as {n:number; title:string; svg:React.ReactNode}[]).map(({ n, title, svg }) => {
                    const chosen = soal4Answers[n];
                    const isCorrect = soal4Correct[n];
                    const studentCorrect = soal4Checked && chosen === isCorrect;
                    const studentWrong   = soal4Checked && chosen !== undefined && chosen !== isCorrect;
                    const borderCls = soal4Checked
                      ? (studentCorrect ? "border-green-500/60 bg-green-900/15" : "border-red-500/60 bg-red-900/15")
                      : (chosen ? "border-purple-500/50 bg-purple-900/10" : "border-white/10 bg-slate-800/40");
                    return (
                      <div key={n} className={`border rounded-xl p-2.5 transition-all ${borderCls}`}>
                        <p className="font-body text-[11px] font-bold text-white/60 text-center mb-1">{title}</p>
                        <div className="flex justify-center">{svg}</div>
                        {!soal4Checked && (
                          <div className="flex gap-1.5 mt-2">
                            <button onClick={() => setSoal4Answers(prev => ({ ...prev, [n]: "fungsi" }))}
                              className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg border transition-all font-body ${chosen === "fungsi" ? "bg-green-600/50 border-green-400/60 text-green-200" : "bg-slate-700/50 border-white/10 text-white/50 hover:border-green-500/40 hover:text-green-300"}`}>
                              {t.c2FuncBtn}
                            </button>
                            <button onClick={() => setSoal4Answers(prev => ({ ...prev, [n]: "bukan" }))}
                              className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg border transition-all font-body ${chosen === "bukan" ? "bg-red-600/50 border-red-400/60 text-red-200" : "bg-slate-700/50 border-white/10 text-white/50 hover:border-red-500/40 hover:text-red-300"}`}>
                              {t.c2NotFuncBtn}
                            </button>
                          </div>
                        )}
                        {soal4Checked && (
                          <div className={`mt-2 rounded-lg px-2 py-1.5 text-center text-[11px] font-bold font-body ${studentCorrect ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                            {studentCorrect ? t.c2Correct : isCorrect === "fungsi" ? t.c2WrongFunc : t.c2WrongNotFunc}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!soal4Checked && (
                  <button
                    disabled={Object.keys(soal4Answers).length < 6}
                    onClick={() => setSoal4Checked(true)}
                    className="w-full py-2.5 rounded-xl font-body font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-purple-600/70 hover:bg-purple-500/80 border border-purple-400/50 text-white"
                  >
                    {Object.keys(soal4Answers).length < 6
                      ? `${t.c2SelectAll} (${Object.keys(soal4Answers).length}/6)`
                      : t.c2CheckBtn}
                  </button>
                )}

                {soal4Checked && (
                  <div className="space-y-3">
                    <div className={`rounded-xl p-4 border text-center ${[1,2,3,4,5,6].filter(n => soal4Answers[n] === soal4Correct[n]).length === 6 ? "bg-green-900/20 border-green-500/40" : "bg-yellow-900/20 border-yellow-500/40"}`}>
                      <p className="font-body text-lg font-bold text-white">
                        {t.c2Score} <span className="text-green-300">{[1,2,3,4,5,6].filter(n => soal4Answers[n] === soal4Correct[n]).length}</span>
                        <span className="text-white/40">/6</span>
                      </p>
                      <p className="font-body text-xs text-white/50 mt-1">
                        {[1,2,3,4,5,6].filter(n => soal4Answers[n] === soal4Correct[n]).length === 6
                          ? t.c2Perfect
                          : [1,2,3,4,5,6].filter(n => soal4Answers[n] === soal4Correct[n]).length >= 4
                          ? t.c2Good
                          : t.c2Retry}
                      </p>
                    </div>
                    <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                      <p className="font-body text-sm font-semibold text-cyan-300">{t.c2PemTitle}</p>
                      {t.c2Diagrams.map(({ n, status, color, penj }) => (
                        <div key={n} className="flex gap-2">
                          <span className="bg-white/10 rounded px-2 py-0.5 text-xs font-bold text-white shrink-0 self-start mt-0.5">D{n}</span>
                          <div>
                            <span className={`text-xs font-bold ${color}`}>{status}</span>
                            <p className="text-xs text-white/60 mt-0.5">{penj}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { setSoal4Answers({}); setSoal4Checked(false); }}
                      className="w-full py-2 rounded-xl font-body text-sm text-white/40 border border-white/10 hover:text-white/70 hover:border-white/20 transition-all"
                    >{t.c2ResetBtn}</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CONTOH 3 — Ordered pairs */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-teal-400" title={t.secC3} />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.c3Badge} color="bg-teal-700/60 text-teal-200" />
                <div className="bg-slate-800/60 border border-teal-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-teal-300 mb-2">{t.c3Soal}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed mb-3">{t.c3Q}</p>
                  <div className="space-y-2 text-sm font-body">
                    {t.c3Sets.map(({ label, data }) => (
                      <div key={label} className="flex gap-2 items-start">
                        <span className="font-bold text-teal-300 shrink-0 w-4">{label}.</span>
                        <span className="text-white/75 font-mono text-xs leading-relaxed">{data}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.c3PemTitle}</p>
                  <p className="font-body text-xs text-white/50">{t.c3PemNote} <strong className="text-yellow-300">{t.c3PemBold}</strong> {t.c3PemNote2} <strong className="text-yellow-300">{t.c3PemBold2}</strong> {t.c3PemNote3}</p>
                  <div className="space-y-3">
                    {t.c3Data.map(({ label, status, statusColor, borderColor, duplikat, penj, pasangan }) => (
                      <div key={label} className={`border ${borderColor} rounded-xl p-3 space-y-2`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-white/10 rounded px-2 py-0.5 text-xs font-bold text-white shrink-0">{label}</span>
                          <span className={`text-xs font-bold ${statusColor}`}>{status}</span>
                          {duplikat && (
                            <span className="text-[10px] bg-red-900/40 border border-red-500/30 text-red-300 rounded px-2 py-0.5">
                              {t.c3DupLabel} {duplikat}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {pasangan.map(([d, k], i) => (
                            <span key={i} className={`text-[10px] font-mono px-2 py-0.5 rounded border ${k.includes("✗") ? "bg-red-900/30 border-red-500/40 text-red-200" : "bg-slate-700/60 border-white/10 text-white/60"}`}>
                              {d} → {k}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">{penj}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-bold text-teal-300 mb-1">{t.c3Concl}</p>
                    <p className="font-body text-xs text-white/75">{t.c3ConclText}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 4 — Graphs */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Target className="w-5 h-5" />} iconColor="text-pink-400" title={t.secC4} />
            {expandedSections.includes("contoh4") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.c4Badge} color="bg-pink-700/60 text-pink-200" />
                <div className="bg-slate-800/60 border border-pink-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-pink-300 mb-2">{t.c4Soal}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    {t.c4Q} <strong className="text-cyan-300">x</strong>{t.c4Q2}
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>{t.c4Hint}</strong> {t.c4HintText} <em>x = c</em> {language === "ja" ? "がグラフと" : language === "en" ? "intersects the graph at" : "hanya memotong grafik di"} <strong>{t.c4HintBold}</strong>{language === "ja" ? "で交わる場合。" : "."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {t.c4GraphData.map(({ label, fungsi, alasan }) => {
                    const svgContent = (() => {
                      const grid = (
                        <>
                          {[32,64,96,128].map(x=><line key={x} x1={x} y1="10" x2={x} y2="110" stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          {[30,50,70,90,110].map(y=><line key={y} x1="10" y1={y} x2="150" y2={y} stroke="rgba(148,163,184,0.13)" strokeWidth="1"/>)}
                          <line x1="10" y1="110" x2="150" y2="110" stroke="#64748b" strokeWidth="1.5"/>
                          <line x1="10" y1="110" x2="10" y2="10" stroke="#64748b" strokeWidth="1.5"/>
                          <polygon points="147,107 154,110 147,113" fill="#64748b"/>
                          <polygon points="7,13 10,6 13,13" fill="#64748b"/>
                          <text x="155" y="114" fill="#64748b" fontSize="8">x</text>
                          <text x="13" y="8" fill="#64748b" fontSize="8">y</text>
                          <text x="128" y="123" fill="#94a3b8" fontSize="8">5</text>
                          <text x="5" y="34" fill="#94a3b8" fontSize="8" textAnchor="end">5</text>
                        </>
                      );
                      if (label === "a") return <><svg viewBox="0 0 160 130" width="100%">{grid}<line x1="10" y1="110" x2="135" y2="15" stroke="#22c55e" strokeWidth="2.2"/></svg></>;
                      if (label === "b") return <><svg viewBox="0 0 160 130" width="100%">{grid}<path d="M 12,108 C 38,108 118,93 140,60 C 156,32 120,12 12,12" fill="none" stroke="#ef4444" strokeWidth="2.2"/></svg></>;
                      if (label === "c") return <><svg viewBox="0 0 160 130" width="100%">{grid}<path d="M10,110 C25,110 38,108 55,75 C68,48 80,20 90,18 C100,16 112,42 118,68 C126,100 132,110 148,110" fill="none" stroke="#22c55e" strokeWidth="2.2"/></svg></>;
                      if (label === "d") return <><svg viewBox="0 0 160 130" width="100%">{grid}<line x1="10" y1="20" x2="148" y2="108" stroke="#22c55e" strokeWidth="2.2"/></svg></>;
                      if (label === "e") return <><svg viewBox="0 0 160 130" width="100%">{grid}<path d="M10,60 C25,60 30,25 50,25 C70,25 75,90 95,90 C115,90 120,40 140,40 C145,40 148,42 150,44" fill="none" stroke="#22c55e" strokeWidth="2.2"/></svg></>;
                      return <><svg viewBox="0 0 160 130" width="100%">{grid}<path d="M 10,10 C 10,14 55,14 98,28 C 130,38 12,52 10,60 C 8,68 55,68 98,82 C 128,92 12,106 10,110" fill="none" stroke="#ef4444" strokeWidth="2.2"/></svg></>;
                    })();
                    return (
                      <div key={label} className={`border rounded-xl p-2.5 ${fungsi ? "border-green-500/40 bg-green-900/10" : "border-red-500/40 bg-red-900/10"}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-body text-[11px] font-bold text-white/60">{t.c4GraphLabel} {label}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${fungsi ? "bg-green-700/50 text-green-200" : "bg-red-700/50 text-red-200"}`}>
                            {fungsi ? t.c4IsFuncTag : t.c4NotFuncTag}
                          </span>
                        </div>
                        <div className="flex justify-center bg-slate-900/60 rounded-lg p-1">{svgContent}</div>
                        <p className="text-[10px] text-white/55 mt-1.5 leading-relaxed font-body">{alasan}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.c4ConcTitle}</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { lbl: "a", ok: true }, { lbl: "b", ok: false },
                      { lbl: "c", ok: true }, { lbl: "d", ok: true },
                      { lbl: "e", ok: true }, { lbl: "f", ok: false },
                    ].map(({ lbl, ok }) => (
                      <div key={lbl} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold font-body ${ok ? "bg-green-900/30 border-green-500/40 text-green-200" : "bg-red-900/30 border-red-500/40 text-red-200"}`}>
                        <span>{t.c4GraphLabel} {lbl}</span>
                        <span>{ok ? "✅" : "❌"}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/50 font-body">{t.c4ConcText}</p>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.secRangkuman} />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-6 space-y-4">

                <p className="font-display text-xs font-bold text-violet-300 uppercase tracking-wider pt-1">{t.rangkumanTitle}</p>
                <div className="grid grid-cols-1 gap-2">
                  {t.rangItems.map(({ icon, label, desc, color }) => (
                    <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="font-display text-xs font-bold mb-0.5">{label}</p>
                        <p className="font-body text-xs text-white/80 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">{t.tipsTitle}</p>
                  <div className="space-y-2">
                    {t.tipItems.map((tip, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/30 text-amber-200 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                        <p className="font-body text-xs text-amber-100/90 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-violet-900/60 to-purple-900/60 border border-violet-400/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-violet-300 uppercase tracking-wider mb-2">{t.kesimpulanTitle}</p>
                  <p className="font-body text-sm text-white/90 leading-relaxed">
                    {t.kesP} <strong className="text-violet-300">{t.kesBold}</strong>{t.kesP2} <strong className="text-green-300">{t.kesBold2}</strong>{t.kesP3}
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianFungsiPage;
