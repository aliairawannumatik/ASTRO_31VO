import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, Layers, Hash, RotateCcw, Trophy, XCircle, CheckCircle2, ArrowLeftRight } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

function renderWithLatex(text: string): React.ReactNode {
  const parts = text.split(/(n\(B\)\^n\(A\))/g);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((p, i) =>
        p === "n(B)^n(A)" ? <InlineMath key={i} math="n(B)^{n(A)}" /> : p
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════════ */
const TR = {
  id: {
    /* ── page header ── */
    title:    "MENENTUKAN BANYAK FUNGSI & KORESPONDENSI SATU-SATU",
    subtitle: "Hitung Berapa Fungsi yang Bisa Dibentuk!",
    badge:    "Kelas 8 · Relasi dan Fungsi · Materi Matematika",

    /* ── section titles ── */
    sec_intro:        "🌟 Berapa Banyak Fungsi yang Bisa Dibuat?",
    sec_rumus:        "📘 Rumus Menentukan Banyak Fungsi",
    sec_koresp:       "🔗 Korespondensi Satu-Satu (Bijeksi)",
    sec_c1:           "✏️ Contoh 1 — Tingkat Mudah",
    sec_c2:           "✏️ Contoh 2 — Tingkat Sedang",
    sec_c3:           "✏️ Contoh 3 — Tingkat Sulit",
    sec_rangkuman:    "📌 Rangkuman & Kesimpulan",

    /* ── badges ── */
    badge_easy:   "MUDAH",
    badge_medium: "SEDANG",
    badge_hard:   "SULIT",

    /* ── intro section ── */
    intro_p: "Diberikan dua himpunan, berapa banyak fungsi yang bisa kita buat dari satu himpunan ke himpunan lain? Pertanyaan ini punya jawaban matematika yang elegan dan bisa dihitung dengan rumus sederhana!",
    intro_idea_head: "🔢 Ide Dasar",
    intro_idea_p: "Jika A = {1, 2} dan B = {a, b, c}, maka setiap anggota A bisa dipasangkan ke salah satu dari 3 pilihan di B. Karena ada 2 anggota di A, maka total fungsi = 3 × 3 = 3² = 9 fungsi.",

    /* ── rumus section ── */
    rumus_summary_head: "🎯 Ringkasan Intisari",
    rumus_summary_p: "Jika n(A) menyatakan banyak anggota himpunan A dan n(B) menyatakan banyak anggota himpunan B, maka banyak fungsi yang dapat dibentuk dari A ke B adalah:",
    rumus_box_label: "Banyak fungsi dari A ke B",
    rumus_why_head: "🔎 Mengapa Rumusnya Demikian?",
    rumus_why_assume: "Misalkan A = {a₁, a₂, ..., aₘ} dan B = {b₁, b₂, ..., bₙ}",
    rumus_li1: "bisa dipasangkan ke salah satu dari",
    rumus_li1b: "pilihan di B",
    rumus_li2: "bisa dipasangkan ke salah satu dari",
    rumus_li2b: "pilihan di B",
    rumus_li3: "... dan seterusnya hingga",
    rumus_total: "Total =",
    rumus_times: "(sebanyak m kali)",
    rumus_tbl_nA: "n(A)",
    rumus_tbl_nB: "n(B)",
    rumus_tbl_AB: "Banyak Fungsi A→B",
    rumus_tbl_BA: "Banyak Fungsi B→A",

    /* ── korespondensi section ── */
    koresp_summary_head: "🎯 Ringkasan Intisari",
    koresp_def: "Korespondensi satu-satu (bijeksi) adalah fungsi yang memenuhi dua syarat sekaligus:",
    koresp_injective_head: "Injektif (satu-satu):",
    koresp_injective_p: "Setiap anggota kodomain dipasangkan oleh paling banyak satu anggota domain. Tidak ada dua anggota domain yang punya pasangan sama.",
    koresp_surjective_head: "Surjektif (pada):",
    koresp_surjective_p: "Setiap anggota kodomain punya pasangan (tidak ada yang \"menganggur\").",
    koresp_syarat_head: "📐 Syarat Korespondensi Satu-Satu",
    koresp_syarat_p: "Korespondensi satu-satu hanya dapat terjadi jika:",
    koresp_syarat_note: "Jumlah anggota domain dan kodomain harus sama!",
    koresp_rumus_head: "🔢 Rumus Banyak Korespondensi Satu-Satu",
    koresp_rumus_box: "Banyak korespondensi satu-satu",
    koresp_rumus_note: "di mana n = n(A) = n(B)",
    koresp_tbl_n: "n(A) = n(B)",
    koresp_tbl_fact: "n! (Faktorial)",
    koresp_tbl_count: "Banyak Korespondensi",
    koresp_visual_yes: "✅ KORESPONDENSI SATU-SATU",
    koresp_visual_no:  "❌ BUKAN KORESPONDENSI 1-1",
    koresp_visual_yes_note: "n(A)=n(B)=3, tiap elemen berpasangan tepat satu",
    koresp_visual_no_note:  "n(A)≠n(B), elemen d tidak punya pasangan",

    /* ── contoh 1 ── */
    c1_soal_head: "📝 Soal",
    c1_soal_p: "Diketahui A = {p, q, r} dan B = {1, 2, 3, 4}. Tentukan banyaknya fungsi yang dapat dibuat dari A ke B!",
    c1_pembahasan_head: "🔍 Pembahasan",
    c1_ident_head: "Identifikasi:",
    c1_nA_note: "(banyak anggota domain)",
    c1_nB_note: "(banyak pilihan untuk setiap anggota A)",
    c1_rumus_head: "Gunakan Rumus:",
    c1_rumus_lbl: "Banyak fungsi",
    c1_result: "✅ Banyak fungsi dari A ke B = 64 fungsi",

    /* ── contoh 2 ── */
    c2_soal_head: "📝 Soal",
    c2_soal_p: "Diketahui P = {a, b, c, d} dan Q = {1, 2, 3, 4}.",
    c2_soal_a: "a) Berapa banyak korespondensi satu-satu dari P ke Q?",
    c2_soal_b: "b) Berapa banyak fungsi (bukan hanya korespondensi) dari P ke Q?",
    c2_soal_c: "c) Berapa perbandingan keduanya?",
    c2_pembahasan_head: "🔍 Pembahasan",
    c2_ident_head: "Identifikasi:",
    c2_ident_note: "→ n(P) = n(Q) = 4, bisa dibuat korespondensi!",
    c2_a_head: "a) Korespondensi Satu-Satu:",
    c2_b_head: "b) Semua Fungsi dari P ke Q:",
    c2_c_head: "c) Perbandingan:",
    c2_c_lbl: "Korespondensi ÷ Total Fungsi",
    c2_c_note: "Hanya sekitar 9,4% dari semua fungsi yang merupakan korespondensi satu-satu!",
    c2_result: "✅ Korespondensi = 24, Total Fungsi = 256",

    /* ── contoh 3 ── */
    c3_soal_head: "📝 Soal",
    c3_soal_p: "Himpunan A mempunyai n(A) = m anggota dan himpunan B mempunyai n(B) = 4 anggota. Jika banyaknya fungsi dari A ke B adalah 1024, tentukan:",
    c3_soal_a: "a) Nilai m",
    c3_soal_b: "b) Apakah mungkin membuat korespondensi satu-satu dari A ke B? Jika ya, berapa banyaknya?",
    c3_pembahasan_head: "🔍 Pembahasan",
    c3_a_head: "a) Mencari nilai m:",
    c3_a_step1: "Gunakan rumus banyak fungsi:",
    c3_a_step2: "Ingat bahwa 1024 = 2¹⁰ dan 4 = 2², maka:",
    c3_b_head: "b) Korespondensi Satu-Satu?",
    c3_b_nA: "n(A) = 5, n(B) = 4",
    c3_b_note: "Karena n(A) ≠ n(B) (5 ≠ 4), maka korespondensi satu-satu tidak mungkin dibuat.",
    c3_b_syarat: "Syarat korespondensi satu-satu adalah n(A) = n(B).",
    c3_result: "✅ m = 5. Korespondensi satu-satu tidak mungkin karena n(A) ≠ n(B).",

    /* ── rangkuman ── */
    rang_head: "📚 Rangkuman Materi",
    rang_items: [
      { icon: "🔢", label: "Banyak Fungsi A → B", desc: "Rumus: n(B)^n(A) — kodomain dijadikan basis, domain dijadikan pangkat." },
      { icon: "🔄", label: "Korespondensi Satu-Satu", desc: "Fungsi di mana setiap anggota A berpasangan unik dengan setiap anggota B (bijektif)." },
      { icon: "⚖️", label: "Syarat Korespondensi", desc: "Hanya mungkin jika n(A) = n(B) — jumlah anggota kedua himpunan harus sama." },
      { icon: "🏆", label: "Banyak Korespondensi", desc: "Rumus: n! (n faktorial) di mana n = n(A) = n(B)." },
      { icon: "❗", label: "Faktorial", desc: "n! = n × (n−1) × (n−2) × … × 2 × 1. Contoh: 4! = 4×3×2×1 = 24." },
    ],
    tips_head: "💡 Tips & Trik",
    tips: [
      "Rumus n(B)^n(A): ingat B = tujuan = basis, A = asal = pangkat. Jangan terbalik!",
      "Korespondensi hanya bisa ada jika n(A) = n(B). Cek dulu sebelum menghitung!",
      "Trik hitung faktorial: mulai dari n, kalikan mundur sampai 1. Contoh: 5! = 5×4×3×2×1 = 120.",
    ],
    kesimpulan_head: "🎯 Kesimpulan",
    kesimpulan_p: "Banyak fungsi = menghitung semua kemungkinan. Kuasai rumus n(B)^n(A) untuk fungsi biasa dan n! untuk korespondensi satu-satu!",
    back_btn: "← Kembali ke Relasi dan Fungsi",

    /* ── diagram interaktif banyak fungsi ── */
    diag_title:      "🎮 Buktikan Sendiri — Seret Panah!",
    diag_switch:     "Ganti Mode",
    diag_size_head:  "⚙️ Atur ukuran himpunan:",
    diag_member:     "anggota",
    diag_func_count: (d: string, c: string) => `Banyak fungsi ${d}→${c} =`,
    diag_too_many:   "(banyak sekali!)",
    diag_progress:   (n: number, max: number) => `${n}/${max} fungsi`,
    diag_complete:   "🎉 Lengkap!",
    diag_domain:     (l: string) => `Domain (${l})`,
    diag_codomain:   (l: string) => `Kodomain (${l})`,
    diag_drag_hint:  "👆 Seret dari kiri ke kanan · Double-tap untuk hapus panah",
    diag_valid:      "✅ Fungsi valid! Setiap elemen domain punya tepat satu pasangan.",
    diag_dup:        "⚠️ Fungsi ini sudah ada! Coba kombinasi lain.",
    diag_remaining:  (n: number) => `Hubungkan ${n} elemen domain yang tersisa.`,
    diag_err_incomplete: "Belum semua elemen domain dipasangkan!",
    diag_err_dup:        "Fungsi ini sudah ada! Coba kombinasi lain.",
    diag_all_found:  (max: number) => `🎉 Semua ${max} fungsi ditemukan!`,
    diag_saved:      (n: number) => `✅ Fungsi ke-${n} disimpan!`,
    diag_reset:      "Reset",
    diag_reset_all:  "Reset Semua",
    diag_save_btn:   "Simpan ke Koleksi",
    diag_gallery:    (d: string, c: string, n: number, max: number) => `Fungsi ${d}→${c} yang ditemukan (${n}/${max}):`,
    diag_more_left:  (n: number) => `… masih ${n} lagi`,
    diag_proven:     (d: string, c: string, nCod: number, sup: string, max: number) =>
      `🎉 Terbukti! Banyak fungsi ${d}→${c} = ${nCod}${sup} = ${max}`,

    /* ── diagram interaktif bijeksi ── */
    bij_title:       "🎮 Buktikan Sendiri — Seret Panah Bijeksi!",
    bij_count_lbl:   (n: number, max: number) => `${n}! = ${max} korespondensi`,
    bij_size_head:   "⚙️ Pilih ukuran n(A) = n(B):",
    bij_member:      "anggota",
    bij_count_eq:    "Banyak korespondensi =",
    bij_complete:    "🎉 Lengkap!",
    bij_domain:      "Domain (A)",
    bij_codomain:    "Kodomain (B)",
    bij_drag_hint:   "👆 Seret dari kiri ke kanan · Double-tap untuk hapus panah",
    bij_valid:       "✅ Bijeksi valid! Setiap elemen berpasangan tepat satu-satu.",
    bij_not_bij:     (msg: string | null) => `❌ Bukan bijeksi! ${msg ?? "Ada target yang dipakai dua kali."}`,
    bij_dup:         "⚠️ Korespondensi ini sudah ada! Coba kombinasi lain.",
    bij_remaining:   (n: number) => `Hubungkan ${n} elemen domain yang tersisa.`,
    bij_err_incomplete: "Belum semua elemen domain dipasangkan!",
    bij_err_not_bij:    "Bukan bijeksi! Ada dua elemen menuju target yang sama.",
    bij_err_dup:        "Korespondensi ini sudah ada! Coba kombinasi lain.",
    bij_all_found:   (max: number) => `🎉 Semua ${max} korespondensi ditemukan!`,
    bij_saved:       (n: number) => `✅ Korespondensi ke-${n} disimpan!`,
    bij_reset:       "Reset",
    bij_reset_all:   "Reset Semua",
    bij_save_btn:    "Simpan ke Koleksi",
    bij_gallery:     (n: number, max: number) => `Korespondensi yang ditemukan (${n}/${max}):`,
    bij_proven:      (n: number, max: number) => `🎉 Terbukti! Banyak korespondensi satu-satu = ${n}! = ${max}`,
  },

  en: {
    title:    "COUNTING FUNCTIONS & ONE-TO-ONE CORRESPONDENCES",
    subtitle: "Count How Many Functions Can Be Made!",
    badge:    "Grade 8 · Relations & Functions · Mathematics",

    sec_intro:        "🌟 How Many Functions Can Be Made?",
    sec_rumus:        "📘 Formula for Counting Functions",
    sec_koresp:       "🔗 One-to-One Correspondence (Bijection)",
    sec_c1:           "✏️ Example 1 — Easy Level",
    sec_c2:           "✏️ Example 2 — Medium Level",
    sec_c3:           "✏️ Example 3 — Hard Level",
    sec_rangkuman:    "📌 Summary & Conclusion",

    badge_easy:   "EASY",
    badge_medium: "MEDIUM",
    badge_hard:   "HARD",

    intro_p: "Given two sets, how many functions can we build from one set to another? This question has an elegant mathematical answer that can be calculated with a simple formula!",
    intro_idea_head: "🔢 Core Idea",
    intro_idea_p: "If A = {1, 2} and B = {a, b, c}, then each element of A can be paired with one of 3 choices in B. Since there are 2 elements in A, the total number of functions = 3 × 3 = 3² = 9 functions.",

    rumus_summary_head: "🎯 Key Summary",
    rumus_summary_p: "If n(A) is the number of elements in set A and n(B) is the number of elements in set B, then the number of functions from A to B is:",
    rumus_box_label: "Number of functions from A to B",
    rumus_why_head: "🔎 Why Does the Formula Work?",
    rumus_why_assume: "Let A = {a₁, a₂, ..., aₘ} and B = {b₁, b₂, ..., bₙ}",
    rumus_li1: "can be paired with one of",
    rumus_li1b: "choices in B",
    rumus_li2: "can be paired with one of",
    rumus_li2b: "choices in B",
    rumus_li3: "... and so on up to",
    rumus_total: "Total =",
    rumus_times: "(m times)",
    rumus_tbl_nA: "n(A)",
    rumus_tbl_nB: "n(B)",
    rumus_tbl_AB: "Functions A→B",
    rumus_tbl_BA: "Functions B→A",

    koresp_summary_head: "🎯 Key Summary",
    koresp_def: "A one-to-one correspondence (bijection) is a function that satisfies two conditions simultaneously:",
    koresp_injective_head: "Injective (one-to-one):",
    koresp_injective_p: "Every element of the codomain is paired by at most one domain element. No two domain elements share the same output.",
    koresp_surjective_head: "Surjective (onto):",
    koresp_surjective_p: "Every element of the codomain has a pair (none is \"left out\").",
    koresp_syarat_head: "📐 Condition for One-to-One Correspondence",
    koresp_syarat_p: "A one-to-one correspondence can only exist if:",
    koresp_syarat_note: "The number of elements in the domain and codomain must be equal!",
    koresp_rumus_head: "🔢 Formula for Counting Bijections",
    koresp_rumus_box: "Number of one-to-one correspondences",
    koresp_rumus_note: "where n = n(A) = n(B)",
    koresp_tbl_n: "n(A) = n(B)",
    koresp_tbl_fact: "n! (Factorial)",
    koresp_tbl_count: "# Correspondences",
    koresp_visual_yes: "✅ ONE-TO-ONE CORRESPONDENCE",
    koresp_visual_no:  "❌ NOT ONE-TO-ONE",
    koresp_visual_yes_note: "n(A)=n(B)=3, each element paired exactly once",
    koresp_visual_no_note:  "n(A)≠n(B), element d has no pair",

    c1_soal_head: "📝 Problem",
    c1_soal_p: "Given A = {p, q, r} and B = {1, 2, 3, 4}. Find the number of functions that can be made from A to B!",
    c1_pembahasan_head: "🔍 Solution",
    c1_ident_head: "Identify:",
    c1_nA_note: "(number of domain elements)",
    c1_nB_note: "(number of choices for each element of A)",
    c1_rumus_head: "Apply the Formula:",
    c1_rumus_lbl: "Number of functions",
    c1_result: "✅ Number of functions from A to B = 64 functions",

    c2_soal_head: "📝 Problem",
    c2_soal_p: "Given P = {a, b, c, d} and Q = {1, 2, 3, 4}.",
    c2_soal_a: "a) How many one-to-one correspondences are there from P to Q?",
    c2_soal_b: "b) How many functions (not only correspondences) are there from P to Q?",
    c2_soal_c: "c) What is the ratio between the two?",
    c2_pembahasan_head: "🔍 Solution",
    c2_ident_head: "Identify:",
    c2_ident_note: "→ n(P) = n(Q) = 4, bijections can be made!",
    c2_a_head: "a) One-to-One Correspondences:",
    c2_b_head: "b) All Functions from P to Q:",
    c2_c_head: "c) Ratio:",
    c2_c_lbl: "Correspondences ÷ Total Functions",
    c2_c_note: "Only about 9.4% of all functions are one-to-one correspondences!",
    c2_result: "✅ Correspondences = 24, Total Functions = 256",

    c3_soal_head: "📝 Problem",
    c3_soal_p: "Set A has n(A) = m elements and set B has n(B) = 4 elements. If the number of functions from A to B is 1024, find:",
    c3_soal_a: "a) The value of m",
    c3_soal_b: "b) Is it possible to make a one-to-one correspondence from A to B? If yes, how many?",
    c3_pembahasan_head: "🔍 Solution",
    c3_a_head: "a) Finding m:",
    c3_a_step1: "Use the formula for counting functions:",
    c3_a_step2: "Note that 1024 = 2¹⁰ and 4 = 2², so:",
    c3_b_head: "b) One-to-One Correspondence?",
    c3_b_nA: "n(A) = 5, n(B) = 4",
    c3_b_note: "Since n(A) ≠ n(B) (5 ≠ 4), a one-to-one correspondence is impossible.",
    c3_b_syarat: "The condition for a bijection is n(A) = n(B).",
    c3_result: "✅ m = 5. Bijection is impossible because n(A) ≠ n(B).",

    rang_head: "📚 Summary",
    rang_items: [
      { icon: "🔢", label: "Functions A → B", desc: "Formula: n(B)^n(A) — codomain is the base, domain is the exponent." },
      { icon: "🔄", label: "One-to-One Correspondence", desc: "A function where every element of A is uniquely paired with every element of B (bijective)." },
      { icon: "⚖️", label: "Bijection Condition", desc: "Only possible if n(A) = n(B) — both sets must have the same number of elements." },
      { icon: "🏆", label: "Number of Bijections", desc: "Formula: n! (n factorial) where n = n(A) = n(B)." },
      { icon: "❗", label: "Factorial", desc: "n! = n × (n−1) × (n−2) × … × 2 × 1. Example: 4! = 4×3×2×1 = 24." },
    ],
    tips_head: "💡 Tips & Tricks",
    tips: [
      "Formula n(B)^n(A): remember B = destination = base, A = source = exponent. Don't mix them up!",
      "A bijection can only exist if n(A) = n(B). Check this first before calculating!",
      "Factorial trick: start from n, multiply down to 1. Example: 5! = 5×4×3×2×1 = 120.",
    ],
    kesimpulan_head: "🎯 Conclusion",
    kesimpulan_p: "Counting functions = counting all possibilities. Master the formula n(B)^n(A) for ordinary functions and n! for one-to-one correspondences!",
    back_btn: "← Back to Relations & Functions",

    diag_title:      "🎮 Prove It Yourself — Drag Arrows!",
    diag_switch:     "Switch Mode",
    diag_size_head:  "⚙️ Set set sizes:",
    diag_member:     "elements",
    diag_func_count: (d: string, c: string) => `Functions ${d}→${c} =`,
    diag_too_many:   "(so many!)",
    diag_progress:   (n: number, max: number) => `${n}/${max} functions`,
    diag_complete:   "🎉 Complete!",
    diag_domain:     (l: string) => `Domain (${l})`,
    diag_codomain:   (l: string) => `Codomain (${l})`,
    diag_drag_hint:  "👆 Drag left to right · Double-tap to remove arrow",
    diag_valid:      "✅ Valid function! Every domain element has exactly one pair.",
    diag_dup:        "⚠️ This function already exists! Try another combination.",
    diag_remaining:  (n: number) => `Connect ${n} remaining domain element${n === 1 ? "" : "s"}.`,
    diag_err_incomplete: "Not all domain elements are connected!",
    diag_err_dup:        "This function already exists! Try another combination.",
    diag_all_found:  (max: number) => `🎉 All ${max} functions found!`,
    diag_saved:      (n: number) => `✅ Function #${n} saved!`,
    diag_reset:      "Reset",
    diag_reset_all:  "Reset All",
    diag_save_btn:   "Save to Collection",
    diag_gallery:    (d: string, c: string, n: number, max: number) => `Functions ${d}→${c} found (${n}/${max}):`,
    diag_more_left:  (n: number) => `… ${n} more`,
    diag_proven:     (d: string, c: string, nCod: number, sup: string, max: number) =>
      `🎉 Proven! Functions ${d}→${c} = ${nCod}${sup} = ${max}`,

    bij_title:       "🎮 Prove It Yourself — Drag Bijection Arrows!",
    bij_count_lbl:   (n: number, max: number) => `${n}! = ${max} correspondences`,
    bij_size_head:   "⚙️ Select size n(A) = n(B):",
    bij_member:      "elements",
    bij_count_eq:    "Number of correspondences =",
    bij_complete:    "🎉 Complete!",
    bij_domain:      "Domain (A)",
    bij_codomain:    "Codomain (B)",
    bij_drag_hint:   "👆 Drag left to right · Double-tap to remove arrow",
    bij_valid:       "✅ Valid bijection! Every element is paired exactly once.",
    bij_not_bij:     (msg: string | null) => `❌ Not a bijection! ${msg ?? "A target is used twice."}`,
    bij_dup:         "⚠️ This correspondence already exists! Try another combination.",
    bij_remaining:   (n: number) => `Connect ${n} remaining domain element${n === 1 ? "" : "s"}.`,
    bij_err_incomplete: "Not all domain elements are connected!",
    bij_err_not_bij:    "Not a bijection! Two elements point to the same target.",
    bij_err_dup:        "This correspondence already exists! Try another combination.",
    bij_all_found:   (max: number) => `🎉 All ${max} correspondences found!`,
    bij_saved:       (n: number) => `✅ Correspondence #${n} saved!`,
    bij_reset:       "Reset",
    bij_reset_all:   "Reset All",
    bij_save_btn:    "Save to Collection",
    bij_gallery:     (n: number, max: number) => `Correspondences found (${n}/${max}):`,
    bij_proven:      (n: number, max: number) => `🎉 Proven! Bijections = ${n}! = ${max}`,
  },

  ja: {
    title:    "関数の個数・全単射の個数",
    subtitle: "作れる関数の数を数えよう！",
    badge:    "中学2年 · 関係と関数 · 数学",

    sec_intro:        "🌟 いくつの関数が作れる？",
    sec_rumus:        "📘 関数の個数の公式",
    sec_koresp:       "🔗 一対一対応（全単射）",
    sec_c1:           "✏️ 例題 1 — 基本レベル",
    sec_c2:           "✏️ 例題 2 — 標準レベル",
    sec_c3:           "✏️ 例題 3 — 発展レベル",
    sec_rangkuman:    "📌 まとめ・結論",

    badge_easy:   "基本",
    badge_medium: "標準",
    badge_hard:   "発展",

    intro_p: "2つの集合が与えられたとき、一方の集合からもう一方への関数はいくつ作れるでしょう？この問いにはエレガントな数学的答えがあり、シンプルな公式で計算できます！",
    intro_idea_head: "🔢 基本的なアイデア",
    intro_idea_p: "A = {1, 2}、B = {a, b, c} のとき、Aの各要素はBの3つの選択肢のうちの1つと対応できます。Aの要素が2つなので、関数の総数 = 3 × 3 = 3² = 9 個です。",

    rumus_summary_head: "🎯 重要まとめ",
    rumus_summary_p: "n(A) を集合Aの要素数、n(B) を集合Bの要素数とすると、AからBへの関数の個数は：",
    rumus_box_label: "A から B への関数の数",
    rumus_why_head: "🔎 なぜこの公式になるの？",
    rumus_why_assume: "A = {a₁, a₂, ..., aₘ}、B = {b₁, b₂, ..., bₙ} とおくと",
    rumus_li1: "はBの",
    rumus_li1b: "つの選択肢のうち1つと対応できる",
    rumus_li2: "はBの",
    rumus_li2b: "つの選択肢のうち1つと対応できる",
    rumus_li3: "... 以下同様に",
    rumus_total: "合計 =",
    rumus_times: "（m回）",
    rumus_tbl_nA: "n(A)",
    rumus_tbl_nB: "n(B)",
    rumus_tbl_AB: "関数 A→B の個数",
    rumus_tbl_BA: "関数 B→A の個数",

    koresp_summary_head: "🎯 重要まとめ",
    koresp_def: "全単射（一対一対応）とは、次の2つの条件を同時に満たす関数です：",
    koresp_injective_head: "単射（一対一）：",
    koresp_injective_p: "値域の各要素は定義域の高々1つの要素に対応します。2つの定義域要素が同じ値を持つことはありません。",
    koresp_surjective_head: "全射（上への）：",
    koresp_surjective_p: "値域の全要素が対応を持ちます（「余り」がありません）。",
    koresp_syarat_head: "📐 全単射の条件",
    koresp_syarat_p: "一対一対応が存在できるのは次の場合のみ：",
    koresp_syarat_note: "定義域と値域の要素数が等しくなければなりません！",
    koresp_rumus_head: "🔢 全単射の個数の公式",
    koresp_rumus_box: "全単射（一対一対応）の個数",
    koresp_rumus_note: "ただし n = n(A) = n(B)",
    koresp_tbl_n: "n(A) = n(B)",
    koresp_tbl_fact: "n!（階乗）",
    koresp_tbl_count: "対応の個数",
    koresp_visual_yes: "✅ 一対一対応",
    koresp_visual_no:  "❌ 一対一対応ではない",
    koresp_visual_yes_note: "n(A)=n(B)=3、各要素が正確に1つと対応",
    koresp_visual_no_note:  "n(A)≠n(B)、要素dに対応がない",

    c1_soal_head: "📝 問題",
    c1_soal_p: "A = {p, q, r}、B = {1, 2, 3, 4} のとき、AからBへの関数の個数を求めなさい！",
    c1_pembahasan_head: "🔍 解説",
    c1_ident_head: "確認：",
    c1_nA_note: "（定義域の要素数）",
    c1_nB_note: "（Aの各要素に対する選択肢数）",
    c1_rumus_head: "公式を使う：",
    c1_rumus_lbl: "関数の個数",
    c1_result: "✅ AからBへの関数の個数 = 64 個",

    c2_soal_head: "📝 問題",
    c2_soal_p: "P = {a, b, c, d}、Q = {1, 2, 3, 4} とする。",
    c2_soal_a: "a) PからQへの全単射は何個あるか？",
    c2_soal_b: "b) PからQへの関数（全単射に限らない）は何個あるか？",
    c2_soal_c: "c) 両者の比を求めなさい。",
    c2_pembahasan_head: "🔍 解説",
    c2_ident_head: "確認：",
    c2_ident_note: "→ n(P) = n(Q) = 4、全単射が作れる！",
    c2_a_head: "a) 全単射の個数：",
    c2_b_head: "b) PからQへの全関数の個数：",
    c2_c_head: "c) 比：",
    c2_c_lbl: "全単射 ÷ 全関数",
    c2_c_note: "全関数のうちわずか約9.4%が全単射です！",
    c2_result: "✅ 全単射 = 24、全関数 = 256",

    c3_soal_head: "📝 問題",
    c3_soal_p: "集合A は n(A) = m 個の要素を持ち、集合B は n(B) = 4 個の要素を持つ。AからBへの関数の個数が1024のとき、次を求めなさい：",
    c3_soal_a: "a) m の値",
    c3_soal_b: "b) AからBへの全単射は作れるか？作れるなら何個か？",
    c3_pembahasan_head: "🔍 解説",
    c3_a_head: "a) m を求める：",
    c3_a_step1: "関数の個数の公式を使う：",
    c3_a_step2: "1024 = 2¹⁰、4 = 2² なので：",
    c3_b_head: "b) 全単射は作れるか？",
    c3_b_nA: "n(A) = 5、n(B) = 4",
    c3_b_note: "n(A) ≠ n(B)（5 ≠ 4）なので、全単射を作ることは不可能です。",
    c3_b_syarat: "全単射の条件は n(A) = n(B) です。",
    c3_result: "✅ m = 5。n(A) ≠ n(B) のため全単射は不可能。",

    rang_head: "📚 まとめ",
    rang_items: [
      { icon: "🔢", label: "A→B の関数の個数", desc: "公式：n(B)^n(A) — 値域が底、定義域が指数。" },
      { icon: "🔄", label: "全単射（一対一対応）", desc: "Aの各要素がBの各要素と一意に対応する関数（全単射）。" },
      { icon: "⚖️", label: "全単射の条件", desc: "n(A) = n(B) のときのみ可能 — 両集合の要素数が等しくなければならない。" },
      { icon: "🏆", label: "全単射の個数", desc: "公式：n!（n の階乗）ただし n = n(A) = n(B)。" },
      { icon: "❗", label: "階乗", desc: "n! = n × (n−1) × (n−2) × … × 2 × 1。例：4! = 4×3×2×1 = 24。" },
    ],
    tips_head: "💡 コツ・ポイント",
    tips: [
      "公式 n(B)^n(A)：B = 行き先 = 底、A = 出発点 = 指数。逆にしないように！",
      "全単射は n(A) = n(B) のときのみ存在できる。計算前に必ず確認！",
      "階乗の計算：n から始めて1まで掛け合わせる。例：5! = 5×4×3×2×1 = 120。",
    ],
    kesimpulan_head: "🎯 結論",
    kesimpulan_p: "関数の個数 = すべての可能性を数えること。通常の関数には n(B)^n(A)、全単射には n! の公式をマスターしよう！",
    back_btn: "← 関係と関数に戻る",

    diag_title:      "🎮 自分で証明しよう — 矢印をドラッグ！",
    diag_switch:     "モード切替",
    diag_size_head:  "⚙️ 集合のサイズを設定：",
    diag_member:     "要素",
    diag_func_count: (d: string, c: string) => `関数 ${d}→${c} の数 =`,
    diag_too_many:   "（たくさん！）",
    diag_progress:   (n: number, max: number) => `${n}/${max} 個の関数`,
    diag_complete:   "🎉 完了！",
    diag_domain:     (l: string) => `定義域 (${l})`,
    diag_codomain:   (l: string) => `値域 (${l})`,
    diag_drag_hint:  "👆 左から右へドラッグ · ダブルタップで矢印削除",
    diag_valid:      "✅ 有効な関数！定義域の各要素がちょうど1つの値を持ちます。",
    diag_dup:        "⚠️ この関数はすでに存在します！別の組み合わせを試してください。",
    diag_remaining:  (n: number) => `残り ${n} 個の定義域要素を接続してください。`,
    diag_err_incomplete: "定義域の全要素が接続されていません！",
    diag_err_dup:        "この関数はすでに存在します！別の組み合わせを試してください。",
    diag_all_found:  (max: number) => `🎉 ${max} 個の関数をすべて発見！`,
    diag_saved:      (n: number) => `✅ 関数 #${n} を保存！`,
    diag_reset:      "リセット",
    diag_reset_all:  "全リセット",
    diag_save_btn:   "コレクションに保存",
    diag_gallery:    (d: string, c: string, n: number, max: number) => `発見した関数 ${d}→${c} (${n}/${max})：`,
    diag_more_left:  (n: number) => `… 残り ${n} 個`,
    diag_proven:     (d: string, c: string, nCod: number, sup: string, max: number) =>
      `🎉 証明完了！関数 ${d}→${c} の数 = ${nCod}${sup} = ${max}`,

    bij_title:       "🎮 自分で証明しよう — 全単射の矢印をドラッグ！",
    bij_count_lbl:   (n: number, max: number) => `${n}! = ${max} 個の対応`,
    bij_size_head:   "⚙️ n(A) = n(B) のサイズを選択：",
    bij_member:      "要素",
    bij_count_eq:    "対応の数 =",
    bij_complete:    "🎉 完了！",
    bij_domain:      "定義域 (A)",
    bij_codomain:    "値域 (B)",
    bij_drag_hint:   "👆 左から右へドラッグ · ダブルタップで矢印削除",
    bij_valid:       "✅ 有効な全単射！全要素がちょうど1対1で対応しています。",
    bij_not_bij:     (msg: string | null) => `❌ 全単射ではありません！${msg ?? "同じ値域要素に2本の矢印があります。"}`,
    bij_dup:         "⚠️ この対応はすでに存在します！別の組み合わせを試してください。",
    bij_remaining:   (n: number) => `残り ${n} 個の定義域要素を接続してください。`,
    bij_err_incomplete: "定義域の全要素が接続されていません！",
    bij_err_not_bij:    "全単射ではありません！2つの要素が同じ値域要素に接続しています。",
    bij_err_dup:        "この対応はすでに存在します！別の組み合わせを試してください。",
    bij_all_found:   (max: number) => `🎉 ${max} 個の対応をすべて発見！`,
    bij_saved:       (n: number) => `✅ 対応 #${n} を保存！`,
    bij_reset:       "リセット",
    bij_reset_all:   "全リセット",
    bij_save_btn:    "コレクションに保存",
    bij_gallery:     (n: number, max: number) => `発見した対応 (${n}/${max})：`,
    bij_proven:      (n: number, max: number) => `🎉 証明完了！全単射の数 = ${n}! = ${max}`,
  },
} as const;

/* ══════════════════════════════════════════════════════
   DIAGRAM PANAH INTERAKTIF — komponen tertanam
══════════════════════════════════════════════════════ */
type Mode = "AtoB" | "BtoA";
type Mapping = Record<string, string>;

const ALL_DOM_LABELS  = ["1","2","3","4","5"];
const ALL_COD_LABELS  = ["a","b","c","d","e"];
const SVG_W = 300;
const DOM_X = 68;
const COD_X = 232;
const NODE_R = 22;

function svgH(dLen: number, cLen: number) { return Math.max(dLen, cLen) * 65 + 40; }

function nodePos(idx: number, total: number, x: number, h: number) {
  const sp = (h - 40) / (total + 1);
  return { x, y: 20 + sp * (idx + 1) };
}

function bezierPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  rFrom = NODE_R, rTo = NODE_R
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const back  = Math.atan2(from.y - to.y, from.x - to.x);
  const sx = from.x + rFrom * Math.cos(angle);
  const sy = from.y + rFrom * Math.sin(angle);
  const ex = to.x + rTo * Math.cos(back);
  const ey = to.y + rTo * Math.sin(back);
  const cpx = (sx + ex) / 2;
  return `M ${sx} ${sy} C ${cpx} ${sy} ${cpx} ${ey} ${ex} ${ey}`;
}

function mappingsEqual(a: Mapping, b: Mapping) {
  const keys = Object.keys(a).sort();
  return keys.length === Object.keys(b).length && keys.every(k => a[k] === b[k]);
}

function getSVGCoords(e: React.MouseEvent | React.TouchEvent, svg: SVGSVGElement, h: number) {
  const rect = svg.getBoundingClientRect();
  const sx = SVG_W / rect.width, sy = h / rect.height;
  if ("touches" in e) {
    const t = (e as React.TouchEvent).touches[0] || (e as React.TouchEvent).changedTouches[0];
    return { x: (t.clientX - rect.left) * sx, y: (t.clientY - rect.top) * sy };
  }
  const m = e as React.MouseEvent;
  return { x: (m.clientX - rect.left) * sx, y: (m.clientY - rect.top) * sy };
}

const SUPERSCRIPTS = ["⁰","¹","²","³","⁴","⁵"];

const MiniDiag: React.FC<{ mapping: Mapping; domain: string[]; codomain: string[]; idx: number }> = ({ mapping, domain, codomain, idx }) => {
  const W = 110, H = 100, dx = 26, cx = 84, r = 10;
  const mPos = (i: number, tot: number, x: number) => ({ x, y: 10 + ((H - 20) / (tot + 1)) * (i + 1) });
  const mPath = (f: {x:number;y:number}, t: {x:number;y:number}) => {
    const cpx = (f.x + t.x) / 2;
    return `M ${f.x + r} ${f.y} C ${cpx} ${f.y} ${cpx} ${t.y} ${t.x - r} ${t.y}`;
  };
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[9px] text-white/30 font-mono">#{idx + 1}</span>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="rounded-lg bg-slate-900/70 border border-white/10">
        <defs>
          <marker id={`m${idx}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="#c084fc" />
          </marker>
        </defs>
        {domain.map((el, i) => { const p = mPos(i, domain.length, dx); return (
          <g key={el}>
            <circle cx={p.x} cy={p.y} r={r} fill="#0e4f6e" stroke="#22d3ee" strokeWidth={1} />
            <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill="#e0f2fe" fontSize={8} fontWeight="bold" fontFamily="monospace">{el}</text>
          </g>
        ); })}
        {codomain.map((el, i) => { const p = mPos(i, codomain.length, cx); return (
          <g key={el}>
            <circle cx={p.x} cy={p.y} r={r} fill="#3b1f7a" stroke="#a78bfa" strokeWidth={1} />
            <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill="#ede9fe" fontSize={8} fontWeight="bold" fontFamily="monospace">{el}</text>
          </g>
        ); })}
        {domain.map((el, i) => {
          const target = mapping[el]; if (!target) return null;
          const ti = codomain.indexOf(target);
          return <path key={el} d={mPath(mPos(i, domain.length, dx), mPos(ti, codomain.length, cx))} fill="none" stroke="#c084fc" strokeWidth={1.5} markerEnd={`url(#m${idx})`} />;
        })}
      </svg>
      <div className="text-[8px] text-white/25 font-mono text-center">{domain.map(el => `${el}→${mapping[el]??'?'}`).join(', ')}</div>
    </div>
  );
};

const SizeButtons: React.FC<{ label: string; value: number; color: string; memberLabel: string; onChange: (n: number) => void }> = ({ label, value, color, memberLabel, onChange }) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    <span className={`text-[10px] font-bold font-mono w-10 shrink-0 ${color}`}>{label}</span>
    {[1,2,3,4,5].map(n => (
      <button key={n} onClick={() => onChange(n)}
        className={`w-7 h-7 rounded-lg text-[12px] font-bold font-mono transition-all active:scale-95 border ${
          value === n
            ? "bg-fuchsia-600/80 border-fuchsia-400/70 text-white ring-1 ring-fuchsia-400"
            : "bg-slate-700/50 border-white/10 text-white/40 hover:bg-slate-600/60 hover:text-white/80"
        }`}>
        {n}
      </button>
    ))}
    <span className="text-[10px] text-white/30 font-mono">{memberLabel}</span>
  </div>
);

const DiagramInteraktifBanyakFungsi: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isSpaceTheme = theme === "dark";
  const tr = TR[language];

  const nc = {
    domFill:      isSpaceTheme ? "#0e4f6e" : "#2563eb",
    domFillDrag:  isSpaceTheme ? "#164e63" : "#1d4ed8",
    domFillHas:   isSpaceTheme ? "#0c4a6e" : "#1e40af",
    domStroke:    isSpaceTheme ? "#22d3ee" : "#93c5fd",
    domStrokeDrag:isSpaceTheme ? "#fbbf24" : "#f59e0b",
    domStrokeHas: isSpaceTheme ? "#67e8f9" : "#60a5fa",
    domText:      isSpaceTheme ? "#e0f2fe" : "#ffffff",
    codFill:      isSpaceTheme ? "#3b1f7a" : "#7c3aed",
    codFillHov:   isSpaceTheme ? "#5b21b6" : "#6d28d9",
    codStroke:    isSpaceTheme ? "#a78bfa" : "#c4b5fd",
    codStrokeHov: isSpaceTheme ? "#c4b5fd" : "#ddd6fe",
    codText:      isSpaceTheme ? "#ede9fe" : "#ffffff",
    svgBg:        isSpaceTheme ? "bg-slate-900/60" : "bg-white/90",
    svgBorder:    isSpaceTheme ? "border-white/10" : "border-gray-200",
    divider:      isSpaceTheme ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
    hintColor:    isSpaceTheme ? "text-white/30" : "text-gray-400",
    hintBlink:    isSpaceTheme ? "text-white/30" : "text-orange-500 font-semibold",
    badgeBg:      isSpaceTheme ? "bg-fuchsia-900/20 border-fuchsia-500/30" : "bg-fuchsia-50 border-fuchsia-300",
    titleColor:   isSpaceTheme ? "text-fuchsia-300" : "text-fuchsia-700",
    ctrlBg:       isSpaceTheme ? "bg-slate-800/60 border-white/10" : "bg-gray-50 border-gray-200",
    ctrlHint:     isSpaceTheme ? "text-fuchsia-300/70" : "text-fuchsia-600",
    countMuted:   isSpaceTheme ? "text-white/40" : "text-gray-500",
    countEq:      isSpaceTheme ? "text-white/50" : "text-gray-400",
    progressBg:   isSpaceTheme ? "bg-slate-800" : "bg-gray-200",
    statusDone:   isSpaceTheme ? "text-green-400" : "text-green-600",
  };

  const [domainSize, setDomainSize]     = useState(2);
  const [codomainSize, setCodomainSize] = useState(3);
  const [mode, setMode]   = useState<Mode>("AtoB");
  const [cur, setCur]     = useState<Mapping>({});
  const [listAB, setListAB] = useState<Mapping[]>([]);
  const [listBA, setListBA] = useState<Mapping[]>([]);
  const [drag, setDrag]   = useState<{ from: string } | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [msg, setMsg]     = useState<{ t: string; ok: boolean } | null>(null);
  const [done, setDone]   = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const baseA = ALL_DOM_LABELS.slice(0, domainSize);
  const baseB = ALL_COD_LABELS.slice(0, codomainSize);

  const domain   = mode === "AtoB" ? baseA : baseB;
  const codomain = mode === "AtoB" ? baseB : baseA;
  const nDom = domain.length;
  const nCod = codomain.length;
  const maxF = Math.pow(nCod, nDom);
  const list    = mode === "AtoB" ? listAB : listBA;
  const setList = mode === "AtoB" ? setListAB : setListBA;
  const H = svgH(nDom, nCod);

  const domPos = Object.fromEntries(domain.map((el, i) => [el, nodePos(i, nDom, DOM_X, H)]));
  const codPos = Object.fromEntries(codomain.map((el, i) => [el, nodePos(i, nCod, COD_X, H)]));

  const isComplete = domain.every(el => cur[el] !== undefined);
  const isDup = isComplete && list.some(d => mappingsEqual(d, cur));

  const resetAll = () => { setCur({}); setListAB([]); setListBA([]); setDone(false); setMsg(null); };

  const changeDomainSize   = (n: number) => { setDomainSize(n);   resetAll(); };
  const changeCodomainSize = (n: number) => { setCodomainSize(n); resetAll(); };

  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(null), 2500); return () => clearTimeout(t); }, [msg]);

  const findCod = useCallback((x: number, y: number) => {
    for (const el of codomain) { if (Math.hypot(x - codPos[el].x, y - codPos[el].y) < NODE_R + 8) return el; }
    return null;
  }, [codomain, codPos]);

  const startDrag = useCallback((el: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDrag({ from: el });
    if (svgRef.current) setMouse(getSVGCoords(e, svgRef.current, H));
  }, [H]);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drag || !svgRef.current) return;
    e.preventDefault();
    setMouse(getSVGCoords(e, svgRef.current, H));
  }, [drag, H]);

  const onUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drag || !svgRef.current) return;
    const pos = getSVGCoords(e, svgRef.current, H);
    const target = findCod(pos.x, pos.y);
    if (target) { playPopSound(); setCur(p => ({ ...p, [drag.from]: target })); }
    setDrag(null);
  }, [drag, findCod, H]);

  const removeArrow = (el: string) => { playPopSound(); setCur(p => { const n = { ...p }; delete n[el]; return n; }); };

  const addFn = () => {
    if (!isComplete) { setMsg({ t: tr.diag_err_incomplete, ok: false }); return; }
    if (isDup)       { setMsg({ t: tr.diag_err_dup, ok: false }); return; }
    playPopSound();
    const next = [...list, { ...cur }];
    (setList as React.Dispatch<React.SetStateAction<Mapping[]>>)(next);
    setCur({});
    if (next.length === maxF) { setDone(true); setMsg({ t: tr.diag_all_found(maxF), ok: true }); }
    else setMsg({ t: tr.diag_saved(next.length), ok: true });
  };

  const dragFromPos = drag ? domPos[drag.from] : null;
  const showPlaceholders = maxF <= 30;

  const domLabel = mode === "AtoB" ? "A" : "B";
  const codLabel = mode === "AtoB" ? "B" : "A";
  const nDomSize = mode === "AtoB" ? domainSize : codomainSize;
  const nCodSize = mode === "AtoB" ? codomainSize : domainSize;

  return (
    <div className={`border rounded-xl p-4 space-y-3 ${nc.badgeBg}`}>

      {/* ── Judul + Ganti Mode ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className={`font-body text-sm font-bold ${nc.titleColor}`}>{tr.diag_title}</p>
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${mode==="AtoB"?"bg-cyan-700/60 text-cyan-200 ring-1 ring-cyan-400":isSpaceTheme?"text-white/30":"text-gray-400"}`}>A→B</span>
          <button onClick={() => { playPopSound(); setMode(m => m==="AtoB"?"BtoA":"AtoB"); setCur({}); setDone(false); setMsg(null); }}
            className={`flex items-center gap-1 border text-[11px] font-bold px-2.5 py-1 rounded-full transition-all active:scale-95 ${isSpaceTheme?"bg-slate-700/60 hover:bg-slate-600/70 border-white/20 text-white":"bg-white hover:bg-gray-100 border-gray-300 text-gray-700"}`}>
            <ArrowLeftRight className="w-3 h-3" /> {tr.diag_switch}
          </button>
          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${mode==="BtoA"?"bg-violet-700/60 text-violet-200 ring-1 ring-violet-400":isSpaceTheme?"text-white/30":"text-gray-400"}`}>B→A</span>
        </div>
      </div>

      {/* ── Kontrol Ukuran Himpunan ── */}
      <div className={`border rounded-xl p-3 space-y-2 ${nc.ctrlBg}`}>
        <p className={`text-[10px] font-bold font-body mb-1 ${nc.ctrlHint}`}>{tr.diag_size_head}</p>
        <SizeButtons label="n(A)" value={domainSize}   color="text-cyan-400"   memberLabel={tr.diag_member} onChange={changeDomainSize} />
        <SizeButtons label="n(B)" value={codomainSize} color="text-violet-400" memberLabel={tr.diag_member} onChange={changeCodomainSize} />
        <div className={`pt-2 border-t ${isSpaceTheme?"border-white/5":"border-gray-200"} flex items-center gap-2 flex-wrap`}>
          <span className={`text-[10px] font-body ${nc.countMuted}`}>{tr.diag_func_count(domLabel, codLabel)}</span>
          <span className={`text-[11px] font-mono ${nc.countEq}`}>
            <InlineMath math={`n(${codLabel})^{n(${domLabel})} =`} />
          </span>
          <span className="text-[13px] font-bold font-mono text-yellow-500">
            {nCodSize}{SUPERSCRIPTS[nDomSize] ?? `^${nDomSize}`} = {maxF}
          </span>
          {maxF > 100 && <span className="text-[9px] text-orange-400/70 font-body">{tr.diag_too_many}</span>}
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="flex items-center gap-2">
        <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${nc.progressBg}`}>
          <div className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full transition-all duration-500"
            style={{ width: `${maxF > 0 ? (list.length / maxF) * 100 : 0}%` }} />
        </div>
        <span className={`text-[11px] font-mono shrink-0 ${nc.countEq}`}>{tr.diag_progress(list.length, maxF)}</span>
        {done && <span className={`text-[11px] font-bold animate-pulse ${nc.statusDone}`}>{tr.diag_complete}</span>}
      </div>

      {/* ── SVG Diagram ── */}
      <div className="flex justify-center">
        <div className={`rounded-xl border p-2 select-none w-full ${nc.svgBg} ${nc.svgBorder}`} style={{ maxWidth: SVG_W + 16 }}>
          <div className="flex justify-between px-4 mb-1 text-[10px] font-bold font-mono">
            <span className="text-cyan-500">{tr.diag_domain(domLabel)}</span>
            <span className="text-violet-500">{tr.diag_codomain(codLabel)}</span>
          </div>
          <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${H}`} width="100%"
            style={{ cursor: drag ? "crosshair" : "default", touchAction: "none" }}
            onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={() => setDrag(null)}
            onTouchMove={onMove} onTouchEnd={onUp}>
            <defs>
              <marker id="ah2" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill={isSpaceTheme ? "#f0abfc" : "#a855f7"} />
              </marker>
              <marker id="ahd2" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" />
              </marker>
            </defs>
            <line x1={SVG_W/2} y1={8} x2={SVG_W/2} y2={H-8} stroke={nc.divider} strokeWidth={1} strokeDasharray="4 3" />

            {domain.map(el => {
              const target = cur[el]; if (!target) return null;
              return <path key={el} d={bezierPath(domPos[el], codPos[target])} fill="none"
                stroke={isSpaceTheme ? "#f0abfc" : "#a855f7"} strokeWidth={2.5} markerEnd="url(#ah2)" />;
            })}

            {drag && dragFromPos && (
              <path d={bezierPath(dragFromPos, mouse, NODE_R, 0)} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" markerEnd="url(#ahd2)" />
            )}

            {codomain.map((el) => {
              const p = codPos[el];
              const hover = drag !== null && Math.hypot(mouse.x - p.x, mouse.y - p.y) < NODE_R + 10;
              return (
                <g key={el}>
                  <circle cx={p.x} cy={p.y} r={NODE_R} fill={hover ? nc.codFillHov : nc.codFill} stroke={hover ? nc.codStrokeHov : nc.codStroke} strokeWidth={hover?2.5:1.5} />
                  <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill={nc.codText} fontSize={13} fontWeight="bold" fontFamily="monospace">{el}</text>
                </g>
              );
            })}

            {domain.map(el => {
              const p = domPos[el];
              const hasArr = cur[el] !== undefined;
              const isDragging = drag?.from === el;
              return (
                <g key={el} style={{ cursor: "grab" }}
                  onMouseDown={e => startDrag(el, e)} onTouchStart={e => startDrag(el, e)}
                  onDoubleClick={() => hasArr && removeArrow(el)}>
                  <circle cx={p.x} cy={p.y} r={NODE_R}
                    fill={isDragging ? nc.domFillDrag : hasArr ? nc.domFillHas : nc.domFill}
                    stroke={isDragging ? nc.domStrokeDrag : hasArr ? nc.domStrokeHas : nc.domStroke}
                    strokeWidth={isDragging?2.5:1.5} />
                  <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill={nc.domText} fontSize={13} fontWeight="bold" fontFamily="monospace">{el}</text>
                  {!hasArr && !isSpaceTheme && (
                    <text x={p.x + NODE_R + 6} y={p.y + 1} textAnchor="start" dominantBaseline="middle" fill="#f59e0b" fontSize={11} fontWeight="bold">→</text>
                  )}
                  {hasArr && <circle cx={p.x+15} cy={p.y-15} r={7} fill="#10b981" stroke="#6ee7b7" strokeWidth={1} />}
                  {hasArr && <text x={p.x+15} y={p.y-14} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={8} fontWeight="bold">✓</text>}
                </g>
              );
            })}
          </svg>
          {/* Drag hint with blinking delete part */}
          <p className={`text-center text-[10px] mt-1 ${nc.hintColor}`}>
            {(() => {
              const parts = tr.diag_drag_hint.split(" · ");
              return (
                <>
                  {parts[0]}
                  {parts[1] && (
                    <> · <span className={`animate-pulse ${nc.hintBlink}`}>{parts[1]}</span></>
                  )}
                </>
              );
            })()}
          </p>
        </div>
      </div>

      {/* ── Status ── */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-body ${isComplete&&!isDup?"bg-green-900/30 border border-green-500/30 text-green-300":isDup?"bg-orange-900/30 border border-orange-500/30 text-orange-300":"bg-slate-800/50 border border-white/10 text-white/40"}`}>
        {isComplete && !isDup && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
        {isDup && <XCircle className="w-3.5 h-3.5 shrink-0" />}
        {!isComplete && <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />}
        {isComplete && !isDup
          ? tr.diag_valid
          : isDup
          ? tr.diag_dup
          : tr.diag_remaining(domain.filter(el => !cur[el]).length)}
      </div>

      {msg && <div className={`text-center text-xs font-bold py-1.5 px-3 rounded-lg ${msg.ok?"bg-green-900/40 text-green-300 border border-green-500/30":"bg-red-900/40 text-red-300 border border-red-500/30"}`}>{msg.t}</div>}

      {/* ── Tombol Aksi ── */}
      <div className="flex gap-2">
        <button onClick={() => { playPopSound(); setCur({}); }}
          className="flex items-center gap-1 bg-slate-700/50 hover:bg-slate-600/60 border border-white/15 text-white/60 text-xs font-bold px-3 py-2 rounded-lg transition-all active:scale-95">
          <RotateCcw className="w-3 h-3" /> {tr.diag_reset}
        </button>
        <button onClick={() => { playPopSound(); resetAll(); }}
          className="flex items-center gap-1 bg-slate-700/50 hover:bg-red-900/40 border border-white/15 hover:border-red-500/40 text-white/60 hover:text-red-300 text-xs font-bold px-3 py-2 rounded-lg transition-all active:scale-95">
          <RotateCcw className="w-3 h-3" /> {tr.diag_reset_all}
        </button>
        <button onClick={addFn} disabled={!isComplete || isDup}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg border transition-all active:scale-95 ${isComplete&&!isDup?"bg-fuchsia-600/80 hover:bg-fuchsia-500/90 border-fuchsia-400/60 text-white cursor-pointer":"bg-slate-800/40 border-white/10 text-white/20 cursor-not-allowed"}`}>
          <Trophy className="w-3.5 h-3.5" /> {tr.diag_save_btn}
        </button>
      </div>

      {/* ── Galeri Mini-Diagram ── */}
      {list.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-yellow-300 mb-2 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> {tr.diag_gallery(domLabel, codLabel, list.length, maxF)}
          </p>
          <div className="flex flex-wrap gap-2">
            {list.map((m, i) => <MiniDiag key={i} mapping={m} domain={domain} codomain={codomain} idx={i} />)}
            {showPlaceholders && Array.from({ length: maxF - list.length }).map((_, i) => (
              <div key={i} className="w-[110px] h-[100px] rounded-lg border border-dashed border-white/10 bg-slate-900/30 flex items-center justify-center">
                <span className="text-white/10 text-lg">?</span>
              </div>
            ))}
            {!showPlaceholders && list.length < maxF && (
              <div className="text-[10px] text-white/30 font-mono self-center px-2">
                {tr.diag_more_left(maxF - list.length)}
              </div>
            )}
          </div>
          {done && (
            <div className="mt-3 bg-green-900/30 border border-green-500/30 rounded-lg p-3 text-center">
              <p className="text-green-300 font-bold text-xs">
                {tr.diag_proven(domLabel, codLabel, nCodSize, SUPERSCRIPTS[nDomSize] ?? `^${nDomSize}`, maxF)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   DIAGRAM INTERAKTIF BIJEKSI — komponen tertanam
══════════════════════════════════════════════════════ */
function factorial(x: number): number { return x <= 1 ? 1 : x * factorial(x - 1); }

const DiagramInteraktifBijeksi: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isSpaceTheme = theme === "dark";
  const tr = TR[language];

  const nc = {
    domFill:      isSpaceTheme ? "#0e4f6e" : "#2563eb",
    domFillDrag:  isSpaceTheme ? "#164e63" : "#1d4ed8",
    domFillHas:   isSpaceTheme ? "#0c4a6e" : "#1e40af",
    domStroke:    isSpaceTheme ? "#22d3ee" : "#93c5fd",
    domStrokeDrag:isSpaceTheme ? "#fbbf24" : "#f59e0b",
    domStrokeHas: isSpaceTheme ? "#6ee7b7" : "#34d399",
    domStrokeDup: isSpaceTheme ? "#f87171" : "#ef4444",
    domText:      isSpaceTheme ? "#e0f2fe" : "#ffffff",
    codFill:      isSpaceTheme ? "#3b1f7a" : "#7c3aed",
    codFillHov:   isSpaceTheme ? "#5b21b6" : "#6d28d9",
    codFillDup:   isSpaceTheme ? "#7f1d1d" : "#fca5a5",
    codStroke:    isSpaceTheme ? "#a78bfa" : "#c4b5fd",
    codStrokeHov: isSpaceTheme ? "#c4b5fd" : "#ddd6fe",
    codStrokeDup: isSpaceTheme ? "#f87171" : "#ef4444",
    codStrokeHit: isSpaceTheme ? "#6ee7b7" : "#34d399",
    codText:      isSpaceTheme ? "#ede9fe" : "#ffffff",
    svgBg:        isSpaceTheme ? "bg-slate-900/60" : "bg-white/90",
    svgBorder:    isSpaceTheme ? "border-white/10" : "border-gray-200",
    divider:      isSpaceTheme ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
    hintColor:    isSpaceTheme ? "text-white/30" : "text-gray-400",
    hintBlink:    isSpaceTheme ? "text-white/30" : "text-orange-500 font-semibold",
    badgeBg:      isSpaceTheme ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-300",
    titleColor:   isSpaceTheme ? "text-green-300" : "text-green-700",
    ctrlBg:       isSpaceTheme ? "bg-slate-800/60 border-white/10" : "bg-gray-50 border-gray-200",
    ctrlHint:     isSpaceTheme ? "text-green-300/70" : "text-green-600",
    countMuted:   isSpaceTheme ? "text-white/40" : "text-gray-500",
    countEq:      isSpaceTheme ? "text-white/50" : "text-gray-400",
    progressBg:   isSpaceTheme ? "bg-slate-800" : "bg-gray-200",
    statusDone:   isSpaceTheme ? "text-green-400" : "text-green-600",
    countBadge:   isSpaceTheme ? "bg-green-800/40 text-green-200 border-green-500/30" : "bg-green-100 text-green-700 border-green-300",
  };

  const [n, setN]       = useState(2);
  const [cur, setCur]   = useState<Mapping>({});
  const [list, setList] = useState<Mapping[]>([]);
  const [drag, setDrag] = useState<{ from: string } | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [msg, setMsg]   = useState<{ t: string; ok: boolean } | null>(null);
  const [done, setDone] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const domain   = ALL_DOM_LABELS.slice(0, n);
  const codomain = ALL_COD_LABELS.slice(0, n);
  const maxF = factorial(n);
  const H = svgH(n, n);

  const domPos = Object.fromEntries(domain.map((el, i)   => [el, nodePos(i, n, DOM_X, H)]));
  const codPos = Object.fromEntries(codomain.map((el, i) => [el, nodePos(i, n, COD_X, H)]));

  const usedTargets  = Object.values(cur);
  const isComplete   = domain.every(el => cur[el] !== undefined);
  const isInjective  = new Set(usedTargets).size === usedTargets.length;
  const isBijective  = isComplete && isInjective;
  const isDup        = isBijective && list.some(d => mappingsEqual(d, cur));

  const resetAll  = () => { setCur({}); setList([]); setDone(false); setMsg(null); };
  const changeN   = (v: number) => { setN(v); resetAll(); };

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2500);
    return () => clearTimeout(t);
  }, [msg]);

  const findCod = useCallback((x: number, y: number) => {
    for (const el of codomain) { if (Math.hypot(x - codPos[el].x, y - codPos[el].y) < NODE_R + 8) return el; }
    return null;
  }, [codomain, codPos]);

  const startDrag = useCallback((el: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); setDrag({ from: el });
    if (svgRef.current) setMouse(getSVGCoords(e, svgRef.current, H));
  }, [H]);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drag || !svgRef.current) return;
    e.preventDefault(); setMouse(getSVGCoords(e, svgRef.current, H));
  }, [drag, H]);

  const onUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drag || !svgRef.current) return;
    const pos = getSVGCoords(e, svgRef.current, H);
    const target = findCod(pos.x, pos.y);
    if (target) { playPopSound(); setCur(p => ({ ...p, [drag.from]: target })); }
    setDrag(null);
  }, [drag, findCod, H]);

  const removeArrow = (el: string) => {
    playPopSound();
    setCur(p => { const n2 = { ...p }; delete n2[el]; return n2; });
  };

  const addBijection = () => {
    if (!isComplete)  { setMsg({ t: tr.bij_err_incomplete, ok: false }); return; }
    if (!isInjective) { setMsg({ t: tr.bij_err_not_bij, ok: false }); return; }
    if (isDup)        { setMsg({ t: tr.bij_err_dup, ok: false }); return; }
    playPopSound();
    const next = [...list, { ...cur }];
    setList(next); setCur({});
    if (next.length === maxF) { setDone(true); setMsg({ t: tr.bij_all_found(maxF), ok: true }); }
    else setMsg({ t: tr.bij_saved(next.length), ok: true });
  };

  const dragFromPos = drag ? domPos[drag.from] : null;

  const dupStatusMsg = (() => {
    if (!isComplete || isInjective) return null;
    const seen: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(cur)) { (seen[v] = seen[v] ?? []).push(k); }
    const dup = Object.entries(seen).find(([, ks]) => ks.length > 1);
    return dup ? `${dup[1].join(" & ")} → "${dup[0]}"` : null;
  })();

  return (
    <div className={`border rounded-xl p-4 space-y-3 ${nc.badgeBg}`}>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className={`font-body text-sm font-bold ${nc.titleColor}`}>{tr.bij_title}</p>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${nc.countBadge}`}>
          {tr.bij_count_lbl(n, maxF)}
        </span>
      </div>

      {/* Size selector */}
      <div className={`border rounded-xl p-3 space-y-2 ${nc.ctrlBg}`}>
        <p className={`text-[10px] font-bold font-body mb-1 ${nc.ctrlHint}`}>{tr.bij_size_head}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold font-mono w-8 shrink-0 text-green-400">n =</span>
          {[1, 2, 3, 4, 5].map(v => (
            <button key={v} onClick={() => changeN(v)}
              className={`w-7 h-7 rounded-lg text-[12px] font-bold font-mono transition-all active:scale-95 border ${
                n === v
                  ? "bg-green-600/80 border-green-400/70 text-white ring-1 ring-green-400"
                  : "bg-slate-700/50 border-white/10 text-white/40 hover:bg-slate-600/60 hover:text-white/80"
              }`}>{v}</button>
          ))}
          <span className={`text-[10px] font-mono ${nc.countMuted}`}>{tr.bij_member}</span>
        </div>
        <div className={`pt-2 border-t ${isSpaceTheme ? "border-white/5" : "border-gray-200"} flex items-center gap-2 flex-wrap`}>
          <span className={`text-[10px] font-body ${nc.countMuted}`}>{tr.bij_count_eq}</span>
          <span className={`text-[11px] font-mono ${nc.countEq}`}>n! =</span>
          <span className="text-[13px] font-bold font-mono text-yellow-500">
            {n}! = {maxF}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${nc.progressBg}`}>
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${maxF > 0 ? (list.length / maxF) * 100 : 0}%` }} />
        </div>
        <span className={`text-[11px] font-mono shrink-0 ${nc.countEq}`}>{list.length}/{maxF}</span>
        {done && <span className={`text-[11px] font-bold animate-pulse ${nc.statusDone}`}>{tr.bij_complete}</span>}
      </div>

      {/* SVG Diagram */}
      <div className="flex justify-center">
        <div className={`rounded-xl border p-2 select-none w-full ${nc.svgBg} ${nc.svgBorder}`} style={{ maxWidth: SVG_W + 16 }}>
          <div className="flex justify-between px-4 mb-1 text-[10px] font-bold font-mono">
            <span className="text-cyan-500">{tr.bij_domain}</span>
            <span className="text-violet-500">{tr.bij_codomain}</span>
          </div>
          <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${H}`} width="100%"
            style={{ cursor: drag ? "crosshair" : "default", touchAction: "none" }}
            onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={() => setDrag(null)}
            onTouchMove={onMove} onTouchEnd={onUp}>
            <defs>
              <marker id="ah-bij"     markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill={isSpaceTheme ? "#6ee7b7" : "#10b981"} /></marker>
              <marker id="ah-bij-dup" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#f87171" /></marker>
              <marker id="ahd-bij"    markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" /></marker>
            </defs>
            <line x1={SVG_W/2} y1={8} x2={SVG_W/2} y2={H-8} stroke={nc.divider} strokeWidth={1} strokeDasharray="4 3" />

            {/* Existing arrows */}
            {domain.map(el => {
              const tgt = cur[el]; if (!tgt) return null;
              const isDupArrow = usedTargets.filter(t => t === tgt).length > 1;
              return <path key={el} d={bezierPath(domPos[el], codPos[tgt])} fill="none"
                stroke={isDupArrow ? "#f87171" : isSpaceTheme ? "#6ee7b7" : "#10b981"} strokeWidth={2.5}
                markerEnd={isDupArrow ? "url(#ah-bij-dup)" : "url(#ah-bij)"} />;
            })}

            {/* Dragging arrow */}
            {drag && dragFromPos && (
              <path d={bezierPath(dragFromPos, mouse, NODE_R, 0)} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" markerEnd="url(#ahd-bij)" />
            )}

            {/* Codomain nodes */}
            {codomain.map(el => {
              const p = codPos[el];
              const hover    = drag !== null && Math.hypot(mouse.x - p.x, mouse.y - p.y) < NODE_R + 10;
              const isDupTgt = usedTargets.filter(t => t === el).length > 1;
              const isHit    = usedTargets.includes(el);
              return (
                <g key={el}>
                  <circle cx={p.x} cy={p.y} r={NODE_R}
                    fill={hover ? nc.codFillHov : isDupTgt ? nc.codFillDup : nc.codFill}
                    stroke={hover ? nc.codStrokeHov : isDupTgt ? nc.codStrokeDup : isHit ? nc.codStrokeHit : nc.codStroke}
                    strokeWidth={hover || isDupTgt ? 2.5 : 1.5} />
                  <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill={nc.codText} fontSize={13} fontWeight="bold" fontFamily="monospace">{el}</text>
                  {isDupTgt && <text x={p.x} y={p.y+17} textAnchor="middle" fill="#f87171" fontSize={8} fontWeight="bold">×2!</text>}
                </g>
              );
            })}

            {/* Domain nodes */}
            {domain.map(el => {
              const p = domPos[el];
              const hasArr     = cur[el] !== undefined;
              const isDragging = drag?.from === el;
              const isDupArrow = hasArr && usedTargets.filter(t => t === cur[el]).length > 1;
              return (
                <g key={el} style={{ cursor: "grab" }}
                  onMouseDown={e => startDrag(el, e)} onTouchStart={e => startDrag(el, e)}
                  onDoubleClick={() => hasArr && removeArrow(el)}>
                  <circle cx={p.x} cy={p.y} r={NODE_R}
                    fill={isDragging ? nc.domFillDrag : hasArr ? nc.domFillHas : nc.domFill}
                    stroke={isDragging ? nc.domStrokeDrag : isDupArrow ? nc.domStrokeDup : hasArr ? nc.domStrokeHas : nc.domStroke}
                    strokeWidth={isDragging ? 2.5 : 1.5} />
                  <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill={nc.domText} fontSize={13} fontWeight="bold" fontFamily="monospace">{el}</text>
                  {!hasArr && !isSpaceTheme && (
                    <text x={p.x + NODE_R + 6} y={p.y + 1} textAnchor="start" dominantBaseline="middle" fill="#f59e0b" fontSize={11} fontWeight="bold">→</text>
                  )}
                  {hasArr && (
                    <>
                      <circle cx={p.x+15} cy={p.y-15} r={7} fill={isDupArrow ? "#dc2626" : "#10b981"} stroke={isDupArrow ? "#f87171" : "#6ee7b7"} strokeWidth={1} />
                      <text x={p.x+15} y={p.y-14} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={8} fontWeight="bold">{isDupArrow ? "!" : "✓"}</text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
          {/* Drag hint with blinking delete part */}
          <p className={`text-center text-[10px] mt-1 ${nc.hintColor}`}>
            {(() => {
              const parts = tr.bij_drag_hint.split(" · ");
              return (
                <>
                  {parts[0]}
                  {parts[1] && (
                    <> · <span className={`animate-pulse ${nc.hintBlink}`}>{parts[1]}</span></>
                  )}
                </>
              );
            })()}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-body ${
        isBijective && !isDup
          ? isSpaceTheme ? "bg-green-900/30 border border-green-500/30 text-green-300" : "bg-green-50 border border-green-300 text-green-700"
          : isComplete && !isInjective
          ? isSpaceTheme ? "bg-red-900/30 border border-red-500/30 text-red-300" : "bg-red-50 border border-red-300 text-red-600"
          : isDup
          ? isSpaceTheme ? "bg-orange-900/30 border border-orange-500/30 text-orange-300" : "bg-orange-50 border border-orange-300 text-orange-600"
          : isSpaceTheme ? "bg-slate-800/50 border border-white/10 text-white/40" : "bg-gray-50 border border-gray-200 text-gray-400"
      }`}>
        {isBijective && !isDup  && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
        {(isComplete && !isInjective || isDup) && <XCircle className="w-3.5 h-3.5 shrink-0" />}
        {!isComplete && !isDup  && <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />}
        {isBijective && !isDup
          ? tr.bij_valid
          : isComplete && !isInjective
          ? tr.bij_not_bij(dupStatusMsg)
          : isDup
          ? tr.bij_dup
          : tr.bij_remaining(domain.filter(el => !cur[el]).length)}
      </div>

      {msg && (
        <div className={`text-center text-xs font-bold py-1.5 px-3 rounded-lg ${msg.ok ? "bg-green-900/40 text-green-300 border border-green-500/30" : "bg-red-900/40 text-red-300 border border-red-500/30"}`}>
          {msg.t}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={() => { playPopSound(); setCur({}); }}
          className="flex items-center gap-1 bg-slate-700/50 hover:bg-slate-600/60 border border-white/15 text-white/60 text-xs font-bold px-3 py-2 rounded-lg transition-all active:scale-95">
          <RotateCcw className="w-3 h-3" /> {tr.bij_reset}
        </button>
        <button onClick={() => { playPopSound(); resetAll(); }}
          className="flex items-center gap-1 bg-slate-700/50 hover:bg-red-900/40 border border-white/15 hover:border-red-500/40 text-white/60 hover:text-red-300 text-xs font-bold px-3 py-2 rounded-lg transition-all active:scale-95">
          <RotateCcw className="w-3 h-3" /> {tr.bij_reset_all}
        </button>
        <button onClick={addBijection} disabled={!isBijective || isDup}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg border transition-all active:scale-95 ${
            isBijective && !isDup
              ? "bg-green-600/80 hover:bg-green-500/90 border-green-400/60 text-white cursor-pointer"
              : "bg-slate-800/40 border-white/10 text-white/20 cursor-not-allowed"
          }`}>
          <Trophy className="w-3.5 h-3.5" /> {tr.bij_save_btn}
        </button>
      </div>

      {/* Gallery */}
      {list.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-yellow-300 mb-2 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> {tr.bij_gallery(list.length, maxF)}
          </p>
          <div className="flex flex-wrap gap-2">
            {list.map((m, i) => <MiniDiag key={i} mapping={m} domain={domain} codomain={codomain} idx={i} />)}
            {Array.from({ length: maxF - list.length }).map((_, i) => (
              <div key={i} className="w-[110px] h-[100px] rounded-lg border border-dashed border-white/10 bg-slate-900/30 flex items-center justify-center">
                <span className="text-white/10 text-lg">?</span>
              </div>
            ))}
          </div>
          {done && (
            <div className="mt-3 bg-green-900/30 border border-green-500/30 rounded-lg p-3 text-center">
              <p className="text-green-300 font-bold text-xs">
                {tr.bij_proven(n, maxF)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BanyakFungsiPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isSpaceTheme = theme === "dark";
  const tr = TR[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "rumus", "korespondensi", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

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
        <Hash className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {tr.title}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {tr.subtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{tr.badge}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={tr.sec_intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {tr.intro_p}
                </p>
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">{tr.intro_idea_head}</p>
                  <p className="font-body text-sm text-white/70 leading-relaxed">
                    {tr.intro_idea_p}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS BANYAK FUNGSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={tr.sec_rumus} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">{tr.rumus_summary_head}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {tr.rumus_summary_p}
                  </p>
                  <div className="bg-violet-900/40 border border-violet-400/40 rounded-xl p-4 mt-3 text-center">
                    <p className="font-body text-sm font-semibold text-violet-200 mb-2">{tr.rumus_box_label}</p>
                    <BlockMath math="= n(B)^{n(A)}" />
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">{tr.rumus_why_head}</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold text-xs mb-1">{tr.rumus_why_assume}</p>
                      <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
                        <li><InlineMath math="a_1" /> {tr.rumus_li1} <InlineMath math="n" /> {tr.rumus_li1b}</li>
                        <li><InlineMath math="a_2" /> {tr.rumus_li2} <InlineMath math="n" /> {tr.rumus_li2b}</li>
                        <li>{tr.rumus_li3} <InlineMath math="a_m" /></li>
                      </ul>
                      <p className="text-white/70 text-xs mt-2">{tr.rumus_total} <InlineMath math="n \times n \times \cdots \times n" /> {tr.rumus_times} <InlineMath math="= n^m" /></p>
                    </div>
                  </div>
                </div>

                {/* ── DIAGRAM PANAH INTERAKTIF ── */}
                <DiagramInteraktifBanyakFungsi />

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-cyan-900/40">
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">{tr.rumus_tbl_nA}</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">{tr.rumus_tbl_nB}</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">{tr.rumus_tbl_AB}</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">{tr.rumus_tbl_BA}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [2, 2, "2²=4", "2²=4"],
                        [2, 3, "3²=9", "2³=8"],
                        [3, 2, "2³=8", "3²=9"],
                        [3, 4, "4³=64", "3⁴=81"],
                        [4, 3, "3⁴=81", "4³=64"],
                      ].map(([nA, nB, f1, f2], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-bold text-center">{nA}</td>
                          <td className="border border-white/10 px-3 py-2 text-violet-300 font-bold text-center">{nB}</td>
                          <td className="border border-white/10 px-3 py-2 text-green-300 font-mono text-center">{f1}</td>
                          <td className="border border-white/10 px-3 py-2 text-orange-300 font-mono text-center">{f2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* KORESPONDENSI SATU-SATU */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="korespondensi" icon={<BookOpen className="w-5 h-5" />} iconColor="text-green-400" title={tr.sec_koresp} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{tr.koresp_summary_head}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">{language === "id" ? "Korespondensi satu-satu" : language === "en" ? "One-to-one correspondence" : "全単射"}</strong> {language === "id" ? "(bijeksi)" : language === "en" ? "(bijection)" : "（全単射）"} {tr.koresp_def}
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-2 text-sm text-white/80">
                      <span className="text-green-400 shrink-0">1.</span>
                      <p><strong className="text-yellow-300">{tr.koresp_injective_head}</strong> {tr.koresp_injective_p}</p>
                    </div>
                    <div className="flex gap-2 text-sm text-white/80">
                      <span className="text-green-400 shrink-0">2.</span>
                      <p><strong className="text-orange-300">{tr.koresp_surjective_head}</strong> {tr.koresp_surjective_p}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">{tr.koresp_syarat_head}</p>
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                    <p className="text-sm text-white/80 font-body">{tr.koresp_syarat_p}</p>
                    <BlockMath math="n(A) = n(B)" />
                    <p className="text-xs text-white/50">{tr.koresp_syarat_note}</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">{tr.koresp_rumus_head}</p>
                  <div className="bg-violet-900/30 border border-violet-500/30 rounded-lg p-4 text-center">
                    <p className="font-body text-sm font-semibold text-violet-200 mb-2">{tr.koresp_rumus_box}</p>
                    <BlockMath math="= n! = n \times (n-1) \times \cdots \times 2 \times 1" />
                    <p className="text-xs text-white/50 mt-1">{tr.koresp_rumus_note}</p>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-violet-900/40">
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">{tr.koresp_tbl_n}</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">{tr.koresp_tbl_fact}</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">{tr.koresp_tbl_count}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, "1! = 1", 1],
                          [2, "2! = 2×1", 2],
                          [3, "3! = 3×2×1", 6],
                          [4, "4! = 4×3×2×1", 24],
                          [5, "5! = 5×4×3×2×1", 120],
                        ].map(([n, faktr, hasil], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                            <td className="border border-white/10 px-3 py-2 text-cyan-300 font-bold text-center">{n}</td>
                            <td className="border border-white/10 px-3 py-2 text-white/70 text-center">{faktr}</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 font-bold text-center">{hasil}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Visual korespondensi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-4">
                    <p className="text-xs font-bold text-green-300 text-center mb-2">{tr.koresp_visual_yes}</p>
                    <div className="flex gap-3 justify-center items-center">
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-cyan-400 font-bold">A</p>
                        {["1", "2", "3"].map(x => <div key={x} className="bg-cyan-800/40 rounded px-3 py-1 text-cyan-200 text-xs font-bold">{x}</div>)}
                      </div>
                      <div className="flex flex-col gap-1.5 pt-5">
                        {["→", "→", "→"].map((a, i) => <span key={i} className="text-green-400 font-bold">{a}</span>)}
                      </div>
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-violet-400 font-bold">B</p>
                        {["a", "b", "c"].map(x => <div key={x} className="bg-violet-800/40 rounded px-3 py-1 text-violet-200 text-xs font-bold">{x}</div>)}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 text-center mt-2">{tr.koresp_visual_yes_note}</p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4">
                    <p className="text-xs font-bold text-red-300 text-center mb-2">{tr.koresp_visual_no}</p>
                    <div className="flex gap-3 justify-center items-center">
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-cyan-400 font-bold">A</p>
                        {["1", "2", "3"].map(x => <div key={x} className="bg-cyan-800/40 rounded px-3 py-1 text-cyan-200 text-xs font-bold">{x}</div>)}
                      </div>
                      <div className="flex flex-col gap-1.5 pt-5">
                        <span className="text-red-400 font-bold">→</span>
                        <span className="text-red-400 font-bold">→</span>
                        <span className="text-red-400 font-bold">→</span>
                      </div>
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-violet-400 font-bold">B</p>
                        {["a", "b", "c", "d"].map(x => <div key={x} className="bg-violet-800/40 rounded px-3 py-1 text-violet-200 text-xs font-bold">{x}</div>)}
                      </div>
                    </div>
                    <p className="text-xs text-red-400 text-center mt-2">{tr.koresp_visual_no_note}</p>
                  </div>
                </div>

                {/* Animasi Interaktif Bijeksi */}
                <DiagramInteraktifBijeksi />

              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={tr.sec_c1} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={tr.badge_easy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{tr.c1_soal_head}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    {tr.c1_soal_p}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{tr.c1_pembahasan_head}</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{tr.c1_ident_head}</p>
                      <p className="text-white/70 text-xs"><InlineMath math="n(A) = 3" /> {tr.c1_nA_note}</p>
                      <p className="text-white/70 text-xs"><InlineMath math="n(B) = 4" /> {tr.c1_nB_note}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{tr.c1_rumus_head}</p>
                      <p className="font-body text-xs text-violet-200 mb-1">{tr.c1_rumus_lbl}</p>
                      <BlockMath math="= n(B)^{n(A)} = 4^3 = 64" />
                    </div>
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-green-300">{tr.c1_result}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={tr.sec_c2} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={tr.badge_medium} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{tr.c2_soal_head}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    {tr.c2_soal_p}
                    <br />{tr.c2_soal_a}
                    <br />{tr.c2_soal_b}
                    <br />{tr.c2_soal_c}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{tr.c2_pembahasan_head}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">{tr.c2_ident_head}</p>
                      <p className="text-white/60 text-xs"><InlineMath math="n(P) = 4" />, <InlineMath math="n(Q) = 4" /> {tr.c2_ident_note}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{tr.c2_a_head}</p>
                      <BlockMath math="n! = 4! = 4 \times 3 \times 2 \times 1 = 24" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">{tr.c2_b_head}</p>
                      <BlockMath math="n(Q)^{n(P)} = 4^4 = 256" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">{tr.c2_c_head}</p>
                      <p className="font-body text-xs text-orange-200 mb-1">{tr.c2_c_lbl}</p>
                      <BlockMath math="\frac{24}{256} = \frac{3}{32}" />
                      <p className="text-white/50 text-xs mt-1">{tr.c2_c_note}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300">{tr.c2_result}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={tr.sec_c3} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={tr.badge_hard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{tr.c3_soal_head}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    {tr.c3_soal_p}
                    <br />{tr.c3_soal_a}
                    <br />{tr.c3_soal_b}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{tr.c3_pembahasan_head}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{tr.c3_a_head}</p>
                      <p className="text-white/70 text-xs mb-1">{tr.c3_a_step1}</p>
                      <BlockMath math="n(B)^{n(A)} = 1024" />
                      <BlockMath math="4^m = 1024" />
                      <p className="text-white/70 text-xs mb-1">{tr.c3_a_step2}</p>
                      <BlockMath math="(2^2)^m = 2^{10} \implies 2^{2m} = 2^{10}" />
                      <BlockMath math="2m = 10 \implies m = 5" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{tr.c3_b_head}</p>
                      <p className="text-white/70 text-xs">n(A) = 5, n(B) = 4</p>
                      <p className="text-white/70 text-xs mt-1">{tr.c3_b_note} <strong className="text-red-300">{language === "id" ? "korespondensi satu-satu tidak mungkin dibuat" : language === "en" ? "bijection is impossible" : "全単射は不可能"}</strong>.</p>
                      <p className="text-white/50 text-xs mt-1">{tr.c3_b_syarat}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-red-300">{tr.c3_result}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={tr.sec_rangkuman} />
            {true && (
              <div className="px-5 pb-6 space-y-4">

                {/* RANGKUMAN */}
                <p className={`font-display text-xs font-bold uppercase tracking-wider pt-1 ${isSpaceTheme ? "text-rose-300" : "text-rose-600"}`}>{tr.rang_head}</p>
                <div className="grid grid-cols-1 gap-2">
                  {(tr.rang_items as { icon: string; label: string; desc: string }[]).map(({ icon, label, desc }) => (
                    <div key={label} className={`bg-gradient-to-r border rounded-xl px-4 py-3 flex gap-3 items-start ${
                      isSpaceTheme
                        ? icon === "🔢" ? "from-rose-900/60 to-red-900/60 border-rose-500/40 text-rose-300" :
                          icon === "🔄" ? "from-pink-900/60 to-fuchsia-900/60 border-pink-500/40 text-pink-300" :
                          icon === "⚖️" ? "from-purple-900/60 to-violet-900/60 border-purple-500/40 text-purple-300" :
                          icon === "🏆" ? "from-orange-900/60 to-amber-900/60 border-orange-500/40 text-orange-300" :
                          "from-amber-900/60 to-yellow-900/60 border-amber-500/40 text-amber-300"
                        : icon === "🔢" ? "from-rose-50 to-red-50 border-rose-200 text-rose-700" :
                          icon === "🔄" ? "from-pink-50 to-fuchsia-50 border-pink-200 text-pink-700" :
                          icon === "⚖️" ? "from-purple-50 to-violet-50 border-purple-200 text-purple-700" :
                          icon === "🏆" ? "from-orange-50 to-amber-50 border-orange-200 text-orange-700" :
                          "from-amber-50 to-yellow-50 border-amber-200 text-amber-700"
                    }`}>
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="font-display text-xs font-bold mb-0.5">{label}</p>
                        <p className={`font-body text-xs leading-relaxed ${isSpaceTheme ? "text-white/80" : "text-gray-600"}`}>
                          {renderWithLatex(desc)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TIPS & TRIK */}
                <div className={`border rounded-xl p-4 ${isSpaceTheme ? "bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-500/40" : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"}`}>
                  <p className={`font-display text-xs font-bold uppercase tracking-wider mb-3 ${isSpaceTheme ? "text-amber-300" : "text-amber-700"}`}>{tr.tips_head}</p>
                  <div className="space-y-2">
                    {(tr.tips as string[]).map((tip, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${isSpaceTheme ? "bg-amber-500/30 text-amber-200" : "bg-amber-200 text-amber-800"}`}>{i + 1}</span>
                        <p className={`font-body text-xs leading-relaxed ${isSpaceTheme ? "text-amber-100/90" : "text-amber-800"}`}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KESIMPULAN */}
                <div className={`border rounded-xl p-4 ${isSpaceTheme ? "bg-gradient-to-r from-rose-900/60 to-pink-900/60 border-rose-400/40" : "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200"}`}>
                  <p className={`font-display text-xs font-bold uppercase tracking-wider mb-2 ${isSpaceTheme ? "text-rose-300" : "text-rose-700"}`}>{tr.kesimpulan_head}</p>
                  <p className={`font-body text-sm leading-relaxed ${isSpaceTheme ? "text-white/90" : "text-gray-700"}`}>
                    {tr.kesimpulan_p}
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {tr.back_btn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanyakFungsiPage;
