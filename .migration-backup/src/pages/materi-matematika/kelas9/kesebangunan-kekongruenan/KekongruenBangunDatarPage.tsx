import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Shapes } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { DragCongruenceDemo } from "@/components/CongruenceDragDemo";

// ─── Translations ─────────────────────────────────────────────────────────────
const translations = {
  id: {
    pageTitle: "KEKONGRUENAN BANGUN DATAR",
    pageSub: "Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika",
    sec_intro: "🧱 Apa Itu Kekongruenan?",
    sec_konsep1: "📘 Sub-Bab 1 — Sifat Dua Segitiga Kongruen",
    sec_konsep2: "📘 Sub-Bab 2 — Syarat Dua Segitiga Kongruen",
    sec_bangunLain: "📘 Sub-Bab 3 — Kekongruenan Bangun Datar Lainnya",
    sec_contoh: "📝 Contoh Soal — Kekongruenan Segitiga & Bangun Lain",
    intro_p1: "Dua bangun datar dikatakan",
    intro_k1: "kongruen",
    intro_p1b: "jika salah satunya dapat ditutupkan",
    intro_em: "persis",
    intro_p1c: "di atas yang lain — seperti dua puzzle identik yang saling menutupi tanpa celah. Kekongruenan berlaku untuk",
    intro_k2: "semua jenis bangun datar",
    intro_p1d: ", bukan hanya segitiga!",
    intro_formal: "📌 Definisi Formal",
    intro_f1: "Dua bangun datar",
    intro_f2: "dan",
    intro_f3: "disebut kongruen",
    intro_f3b: "jika dan hanya jika:",
    intro_c1: "① Semua sisi yang bersesuaian",
    intro_c1b: "sama panjang",
    intro_c2: "② Semua sudut yang bersesuaian",
    intro_c2b: "sama besar",
    intro_note: "Bangun yang kongruen bisa saja dibalik (refleksi) atau diputar untuk saling menutupi.",
    k1_summary: "🎯 Ringkasan Intisari",
    k1_p1: "Jika",
    k1_p1b: ", maka berlaku dua sifat sekaligus:",
    k1_rusuk: "① Rusuk-rusuk bersesuaian sama panjang:",
    k1_sudut: "② Sudut-sudut bersesuaian sama besar:",
    k1_diag_label: "🔍 ILUSTRASI SIFAT KEKONGRUENAN SEGITIGA:",
    fig1: "Gambar 1. Ilustrasi △ABC ≅ △PQR — semua sisi bersesuaian sama panjang dan semua sudut bersesuaian sama besar",
    k1_warn: "Perhatikan urutan penulisan!",
    k1_warn2: "berarti A↔P, B↔Q, C↔R. Jadi",
    k1_warn3: "(bukan",
    k1_warn3b: "!)",
    k2_summary: "🎯 Ringkasan Intisari",
    k2_p1: "Untuk membuktikan dua segitiga kongruen, cukup tunjukkan",
    k2_p1b: "salah satu",
    k2_p1c: "dari 4 syarat berikut:",
    k2_rrr: "① Syarat RRR — Sisi-Sisi-Sisi",
    fig2: "Gambar 2. Syarat RRR — ketiga pasang sisi bersesuaian sama panjang: AB=PQ, BC=QR, CA=RP",
    k2_rrr_p: "Ketiga pasang sisi bersesuaian sama panjang.",
    k2_rar: "② Syarat RAR — Sisi-Sudut-Sisi",
    fig3: "Gambar 3. Syarat RAR — dua sisi bersesuaian sama panjang dan sudut apitnya sama besar: AB=PQ, ∠A=∠P, AC=PR",
    k2_rar_p: "Dua sisi bersesuaian sama panjang",
    k2_rar_pb: "dan sudut apitnya",
    k2_rar_pc: "sama besar.",
    k2_ara: "③ Syarat ARA / AAR / RAA — Sudut-Sisi-Sudut / Sudut-Sudut-Sisi / Sisi-Sudut-Sudut",
    fig4: "Gambar 4. Syarat ARA/AAR/RAA — satu sisi sama panjang dan dua sudut bersesuaian sama besar: ∠A=∠P, AB=PQ, ∠B=∠Q",
    k2_ara_p: "Satu sisi bersesuaian sama panjang dan dua sudut bersesuaian sama besar (sisi boleh diapit atau dihadapkan ke salah satu sudut).",
    tbl2_title: "📊 RINGKASAN SYARAT KEKONGRUENAN SEGITIGA:",
    tbl2_h1: "Kode", tbl2_h2: "Syarat", tbl2_h3: "Yang Dibutuhkan",
    tbl2_code_rrr: "RRR", tbl2_code_rar: "RAR", tbl2_code_ara: "ARA", tbl2_code_aar: "AAR/RAA",
    tbl2_rrr_s: "3 pasang sisi sama", tbl2_rrr_e: "3 rusuk",
    tbl2_rar_s: "2 sisi + sudut apit sama", tbl2_rar_e: "2 rusuk + 1 sudut",
    tbl2_ara_s: "1 sisi diapit + 2 sudut sama", tbl2_ara_e: "1 rusuk + 2 sudut",
    tbl2_aar_s: "1 sisi dihadapkan + 2 sudut sama", tbl2_aar_e: "1 rusuk + 2 sudut",
    k3_intro: "Kekongruenan tidak hanya berlaku pada segitiga. Semua bangun datar — persegi, persegi panjang, jajar genjang, trapesium, belah ketupat, layang-layang, lingkaran, maupun poligon lainnya — dapat bersifat kongruen. Syarat umumnya tetap sama:",
    k3_intro_k: "semua sisi bersesuaian sama panjang DAN semua sudut bersesuaian sama besar.",
    k3_s1: "① Persegi (Square)",
    fig5: "Gambar 5. Dua persegi kongruen — Persegi ABCD ≅ Persegi PQRS jika sisinya sama panjang (AB = PQ)",
    k3_s1_cond_title: "Syarat kekongruenan persegi:",
    k3_s1_cond: "Dua persegi kongruen jika dan hanya jika",
    k3_s1_cond_k: "panjang sisinya sama",
    k3_s1_squareName: "Persegi",
    k3_s1_note: "Karena semua sudut persegi sudah 90°, hanya 1 syarat sisi yang diperlukan!",
    k3_s1_prop_title: "Sifat yang berlaku jika kongruen:",
    k3_s2: "② Persegi Panjang (Rectangle)",
    fig6: "Gambar 6. Dua persegi panjang kongruen — ABCD ≅ PQRS jika panjang dan lebarnya sama (AB=PQ dan BC=QR)",
    k3_s2_cond_title: "Syarat kekongruenan persegi panjang:",
    k3_s2_cond: "Dua persegi panjang kongruen jika",
    k3_s2_cond_k: "panjang (", k3_s2_cond_kb: ") dan lebarnya (", k3_s2_cond_kc: ") sama",
    k3_s2_note: "Semua sudut persegi panjang sudah 90°, jadi hanya perlu 2 pasang sisi bersesuaian sama.",
    k3_s2_ex_title: "Contoh cepat:",
    k3_s2_ex1: "Persegi panjang 6 cm × 4 cm", k3_s2_ex1b: "persegi panjang 6 cm × 4 cm ✓",
    k3_s2_ex2: "Persegi panjang 6 cm × 4 cm", k3_s2_ex2b: "persegi panjang 4 cm × 6 cm ✗",
    k3_s2_ex2c: "(perlu periksa pasangan sisi yang bersesuaian!)",
    k3_s3: "③ Jajar Genjang (Parallelogram)",
    fig7: "Gambar 7. Dua jajar genjang kongruen — ABCD ≅ PQRS jika dua sisi bersesuaian sama panjang dan sudut apitnya sama besar (AB=PQ, BC=QR, ∠A=∠P)",
    k3_s3_cond_title: "Syarat kekongruenan jajar genjang:",
    k3_s3_cond: "Dua jajar genjang kongruen jika",
    k3_s3_cond_k: "dua sisi bersesuaian sama panjang DAN sudut apit sama besar",
    k3_s3_note: "⚠️ Dua jajar genjang dengan sisi sama belum tentu kongruen jika sudutnya berbeda!",
    k3_s3_prop_title: "Sifat tambahan:",
    k3_s3_and: "dan", k3_s3_opp_angles: "(sudut-sudut berhadapan)", k3_s3_adj_angles: "(sudut-sudut berdekatan)",
    k3_s4: "④ Trapesium (Trapezoid)",
    fig8: "Gambar 8. Dua trapesium kongruen — ABCD ≅ PQRS jika semua sisi bersesuaian sama panjang dan semua sudut bersesuaian sama besar",
    k3_s4_cond_title: "Syarat kekongruenan trapesium:",
    k3_s4_cond: "Dua trapesium kongruen jika",
    k3_s4_cond_k: "semua sisi bersesuaian sama panjang DAN semua sudut bersesuaian sama besar",
    k3_s4_iso_title: "Trapesium Sama Kaki:",
    k3_s4_iso_p: "Pada trapesium sama kaki yang kongruen, kaki-kakinya bersesuaian sama panjang dan sudut-sudut alasnya sama besar.",
    k3_s4_legs: "(kaki sama panjang)",
    k3_s5: "⑤ Belah Ketupat (Rhombus)",
    fig9: "Gambar 9. Dua belah ketupat kongruen — ABCD ≅ PQRS jika panjang sisinya sama dan salah satu sudut apitnya sama besar (AB=PQ dan ∠A=∠P)",
    k3_s5_cond_title: "Syarat kekongruenan belah ketupat:",
    k3_s5_cond: "Dua belah ketupat kongruen jika",
    k3_s5_cond_k: "panjang sisinya sama DAN salah satu sudut apitnya sama besar",
    k3_s5_note: "⚠️ Dua belah ketupat dengan sisi sama belum tentu kongruen — sudut apitnya harus sama!",
    k3_s5_prop_title: "Sifat tambahan:",
    k3_s5_p1: "✅", k3_s5_p2: "(semua sisi sama)", k3_s5_p3: "dan",
    k3_s5_p4: "(sudut berhadapan sama)",
    k3_s5_p5: "✅ Diagonal saling berpotongan tegak lurus dan saling membagi dua sama panjang",
    k3_s6: "⑥ Layang-layang (Kite)",
    fig10: "Gambar 10. Dua layang-layang kongruen — ABCD ≅ PQRS jika semua sisi bersesuaian sama panjang dan semua sudut bersesuaian sama besar",
    k3_s6_cond_title: "Syarat kekongruenan layang-layang:",
    k3_s6_cond: "Dua layang-layang kongruen jika",
    k3_s6_cond_k: "semua sisi bersesuaian sama panjang DAN semua sudut bersesuaian sama besar",
    k3_s6_ang_note: "(sudut di antara sisi berbeda panjang)",
    k3_s6_prop_title: "Sifat layang-layang:",
    k3_s6_p1: "✅", k3_s6_p1b: "dan", k3_s6_p1c: "(dua pasang sisi berdekatan sama)",
    k3_s6_p2: "✅", k3_s6_p2b: "(sudut di antara sisi yang berbeda panjang sama besar)",
    k3_s6_p3: "✅ Diagonal utama (AC) memotong diagonal lainnya (BD) tegak lurus dan membaginya sama panjang",
    k3_s7: "⑦ Lingkaran (Circle)",
    fig11: "Gambar 11. Dua lingkaran kongruen — jika jari-jarinya sama panjang (r₁ = r₂)",
    k3_s7_cond_title: "Syarat kekongruenan lingkaran:",
    k3_s7_cond: "Dua lingkaran kongruen jika dan hanya jika",
    k3_s7_cond_k: "jari-jarinya sama panjang",
    k3_s7_circle1: "Lingkaran₁", k3_s7_circle2: "Lingkaran₂",
    k3_s7_note: "Lingkaran tidak punya sudut, sehingga syaratnya hanya 1: jari-jari sama!",
    k3_s7_prop_title: "Akibatnya:",
    k3_s7_p1: "✅ Keliling sama:", k3_s7_p2: "✅ Luas sama:",
    tbl3_title: "📊 RINGKASAN SYARAT KEKONGRUENAN BERBAGAI BANGUN DATAR:",
    tbl3_h1: "Bangun", tbl3_h2: "Syarat Kongruen",
    tbl3_r1n: "Segitiga", tbl3_r1v: "RRR / RAR / ARA / AAR (salah satu)",
    tbl3_r2n: "Persegi", tbl3_r2v: "Sisi sama panjang (1 syarat)",
    tbl3_r3n: "Persegi Panjang", tbl3_r3v: "Panjang dan lebar bersesuaian sama",
    tbl3_r4n: "Jajar Genjang", tbl3_r4v: "2 sisi bersesuaian + sudut apit sama",
    tbl3_r5n: "Trapesium", tbl3_r5v: "Semua sisi + semua sudut bersesuaian sama",
    tbl3_r6n: "Lingkaran", tbl3_r6v: "Jari-jari sama (1 syarat)",
    tbl3_r7n: "Poligon-n", tbl3_r7v: "Semua n sisi + semua n sudut bersesuaian sama",
    badge_mudah: "MUDAH", badge_sedang: "SEDANG",
    c1_title: "Contoh 1 — Segitiga Kongruen",
    c1_q: "Perhatikan gambar berikut.",
    fig12: "Gambar 12. Diagram titik-titik P, T, U, S, R, Q — tentukan banyak segitiga yang kongruen",
    c1_q2: "Banyak segitiga kongruen pada gambar adalah . . . .",
    c1_discuss_title: "PEMBAHASAN:",
    c1_discuss_intro: "Identifikasi segitiga-segitiga yang terbentuk pada gambar:",
    c1_t1: "siku-siku di T", c1_t2: "siku-siku di S", c1_t3: "terbentuk dari T, U, S",
    c1_discuss_p: "Ketiga segitiga tersebut kongruen satu sama lain karena memenuhi syarat kekongruenan.",
    c1_answer: "Jawaban: D. 3 buah ✓",
    c2_title: "Contoh 2 — Aksioma Kekongruenan",
    c2_q: "Diketahui panjang", c2_q2: "menurut aksioma . . . .",
    fig13: "Gambar 13. Diagram △CDA dan △CBE dengan BC = CD dan ∠CDA = ∠CBE = 90°",
    c2_opt_a: "A. \u00a0sisi, sisi, sisi", c2_opt_b: "B. \u00a0sisi, sisi, sudut",
    c2_opt_c: "C. \u00a0sisi, sudut, sisi", c2_opt_d: "D. \u00a0sudut, sisi, sudut",
    c2_discuss_title: "PEMBAHASAN:",
    c2_discuss_intro: "Periksa unsur-unsur yang bersesuaian pada",
    c2_discuss_introb: "dan",
    c2_el1: "(sudut C sama, karena A, B, C segaris)",
    c2_el2: "(diketahui", c2_el2b: ") ← sisi diapit",
    c2_el3: "(sudut siku-siku)",
    c2_discuss_p: "Dua sudut + sisi apit sama → aksioma",
    c2_discuss_pb: "Sudut–Sisi–Sudut (S.Ss.S)",
    c2_answer: "Jawaban: D. sudut, sisi, sudut ✓",
    c3_title: "Contoh 3 — Mencari Nilai m",
    c3_q: "Jika", c3_q2: ", maka nilai", c3_q3: "= . . . .",
    fig14: "Gambar 14. Diagram △ABC ≅ △PQR — sisi AC = (12 – m) bersesuaian dengan sisi PR = 5, tentukan nilai m",
    c3_discuss_title: "PEMBAHASAN:",
    c3_discuss_intro: "Karena", c3_discuss_introb: ", sisi-sisi bersesuaian adalah:",
    c3_el1: "Sisi AC bersesuaian dengan sisi PR",
    c3_answer: "Jawaban: D. 7 ✓",
    rang_title: "📋 Rangkuman — Kekongruenan Bangun Datar",
    rang_h1: "Bangun", rang_h2: "Syarat Kongruen", rang_h3: "Jumlah Syarat Min.",
    rang_r1n: "Segitiga", rang_r1v: "RRR, RAR, ARA, atau AAR (salah satu)", rang_r1e: "3 unsur",
    rang_r2n: "Persegi", rang_r2v: "Sisi yang sama panjang", rang_r2e: "1 unsur",
    rang_r3n: "Persegi Panjang", rang_r3v: "Panjang dan lebar bersesuaian sama", rang_r3e: "2 unsur",
    rang_r4n: "Jajar Genjang", rang_r4v: "2 pasang sisi bersesuaian sama + sudut apit sama", rang_r4e: "3 unsur",
    rang_r5n: "Trapesium & Poligon", rang_r5v: "Semua sisi bersesuaian sama + semua sudut sama", rang_r5e: "Semua unsur",
    rang_r6n: "Lingkaran", rang_r6v: "Jari-jari sama panjang", rang_r6e: "1 unsur",
    rang_note1: "Definisi:",
    rang_note1b: "Dua bangun kongruen (≅) jika semua sisi bersesuaian sama panjang DAN semua sudut bersesuaian sama besar",
    rang_note2: "Notasi penting:",
    rang_note2b: "berarti A↔P, B↔Q, C↔R. Urutan huruf menentukan pasangan!",
    rang_note3: "Bangun bisa diputar/dicermin:",
    rang_note3b: "Kongruen tetap berlaku meski salah satu bangun diputar atau direfleksi (dicermin)",
    tips_title: "💡 Tips & Trik",
    tips_1t: "Ingat urutan syarat segitiga (RRR, RAR, ARA, AAR):",
    tips_1b: "Huruf R = Rusuk, A = sudut (Angle). Syarat tersebut menjamin ketiga sisi dan ketiga sudut otomatis sama — tidak perlu cek semuanya satu per satu!",
    tips_2t: "Cara cepat menentukan sisi bersesuaian dari notasi:",
    tips_2b: "Jika", tips_2bb: ", pasangkan huruf-huruf di posisi yang sama:",
    tips_3t: "Bedakan kongruen dengan sebangun di soal pilihan ganda:",
    tips_3b: "Jika ada \"faktor skala k ≠ 1\" → sebangun bukan kongruen. Jika \"semua ukurannya sama persis\" → kongruen (k=1).",
    tips_4t: "Untuk soal \"cari nilai x\":",
    tips_4b: "Gunakan pasangan sisi bersesuaian yang sama. Jika",
    tips_4bb: ", tulis persamaan langsung dan selesaikan.",
    conc_title: "✅ Kesimpulan",
    conc_p1: "Kekongruenan bangun datar adalah konsep",
    conc_p1k: "\"berimpit sempurna\"",
    conc_p1b: "— dua bangun yang bisa saling ditumpuk tanpa celah dan tanpa sisa.",
    conc_l1: "🔹 Tidak semua bangun memerlukan semua syarat:",
    conc_l1k: "persegi dan lingkaran", conc_l1b: "hanya butuh 1 syarat",
    conc_l2: "🔹 Segitiga memiliki", conc_l2k: "4 cara pembuktian",
    conc_l2b: "kekongruenan (RRR, RAR, ARA, AAR)",
    conc_l3: "🔹 Bangun yang diputar atau dicermin", conc_l3k: "tetap kongruen",
    conc_l4: "🔹 Kongruen adalah kasus khusus sebangun:",
    conc_note: "Kekongruenan adalah fondasi pembuktian geometri — digunakan untuk membuktikan garis sejajar, persamaan sudut, dan sifat-sifat bangun ruang.",
    back: "← Kembali ke Kesebangunan dan Kekongruenan",
  },
  en: {
    pageTitle: "CONGRUENCE OF PLANE FIGURES",
    pageSub: "Grade 9 · Congruence & Similarity · Mathematics",
    sec_intro: "🧱 What Is Congruence?",
    sec_konsep1: "📘 Sub-Topic 1 — Properties of Two Congruent Triangles",
    sec_konsep2: "📘 Sub-Topic 2 — Conditions for Two Congruent Triangles",
    sec_bangunLain: "📘 Sub-Topic 3 — Congruence of Other Plane Figures",
    sec_contoh: "📝 Practice Problems — Triangle & Figure Congruence",
    intro_p1: "Two plane figures are said to be",
    intro_k1: "congruent",
    intro_p1b: "if one can be placed",
    intro_em: "exactly",
    intro_p1c: "on top of the other — like two identical puzzle pieces covering each other without gaps. Congruence applies to",
    intro_k2: "all types of plane figures",
    intro_p1d: ", not just triangles!",
    intro_formal: "📌 Formal Definition",
    intro_f1: "Two plane figures",
    intro_f2: "and",
    intro_f3: "are called congruent",
    intro_f3b: "if and only if:",
    intro_c1: "① All corresponding sides are",
    intro_c1b: "equal in length",
    intro_c2: "② All corresponding angles are",
    intro_c2b: "equal in measure",
    intro_note: "Congruent figures may be flipped (reflected) or rotated to coincide.",
    k1_summary: "🎯 Key Summary",
    k1_p1: "If",
    k1_p1b: ", then two properties hold simultaneously:",
    k1_rusuk: "① Corresponding sides are equal:",
    k1_sudut: "② Corresponding angles are equal:",
    k1_diag_label: "🔍 ILLUSTRATION OF TRIANGLE CONGRUENCE PROPERTIES:",
    fig1: "Figure 1. Illustration △ABC ≅ △PQR — all corresponding sides equal and all corresponding angles equal",
    k1_warn: "Watch the order of vertices!",
    k1_warn2: "means A↔P, B↔Q, C↔R. So",
    k1_warn3: "(not",
    k1_warn3b: "!)",
    k2_summary: "🎯 Key Summary",
    k2_p1: "To prove two triangles congruent, it suffices to show",
    k2_p1b: "any one",
    k2_p1c: "of these 4 conditions:",
    k2_rrr: "① Condition SSS — Side-Side-Side",
    fig2: "Figure 2. Condition SSS — all three pairs of corresponding sides equal: AB=PQ, BC=QR, CA=RP",
    k2_rrr_p: "All three pairs of corresponding sides are equal.",
    k2_rar: "② Condition SAS — Side-Angle-Side",
    fig3: "Figure 3. Condition SAS — two sides equal and included angle equal: AB=PQ, ∠A=∠P, AC=PR",
    k2_rar_p: "Two corresponding sides are equal",
    k2_rar_pb: "and their included angle",
    k2_rar_pc: "is equal.",
    k2_ara: "③ Condition ASA / AAS / SAA — Angle-Side-Angle / Angle-Angle-Side / Side-Angle-Angle",
    fig4: "Figure 4. Condition ASA/AAS/SAA — one side equal and two corresponding angles equal: ∠A=∠P, AB=PQ, ∠B=∠Q",
    k2_ara_p: "One corresponding side is equal and two corresponding angles are equal (the side may be between or opposite the angles).",
    tbl2_title: "📊 SUMMARY OF TRIANGLE CONGRUENCE CONDITIONS:",
    tbl2_h1: "Code", tbl2_h2: "Condition", tbl2_h3: "Required Elements",
    tbl2_code_rrr: "SSS", tbl2_code_rar: "SAS", tbl2_code_ara: "ASA", tbl2_code_aar: "AAS/SAA",
    tbl2_rrr_s: "3 pairs of equal sides", tbl2_rrr_e: "3 sides",
    tbl2_rar_s: "2 sides + included angle equal", tbl2_rar_e: "2 sides + 1 angle",
    tbl2_ara_s: "1 side (between) + 2 angles equal", tbl2_ara_e: "1 side + 2 angles",
    tbl2_aar_s: "1 side (opposite) + 2 angles equal", tbl2_aar_e: "1 side + 2 angles",
    k3_intro: "Congruence is not limited to triangles. All plane figures — squares, rectangles, parallelograms, trapezoids, rhombuses, kites, circles, and other polygons — can be congruent. The general condition remains the same:",
    k3_intro_k: "all corresponding sides equal AND all corresponding angles equal.",
    k3_s1: "① Square",
    fig5: "Figure 5. Two congruent squares — Square ABCD ≅ Square PQRS if their sides are equal (AB = PQ)",
    k3_s1_cond_title: "Condition for congruent squares:",
    k3_s1_cond: "Two squares are congruent if and only if",
    k3_s1_cond_k: "their side lengths are equal",
    k3_s1_squareName: "Square",
    k3_s1_note: "Since all angles of a square are already 90°, only 1 side condition is needed!",
    k3_s1_prop_title: "Properties when congruent:",
    k3_s2: "② Rectangle",
    fig6: "Figure 6. Two congruent rectangles — ABCD ≅ PQRS if length and width are equal (AB=PQ and BC=QR)",
    k3_s2_cond_title: "Condition for congruent rectangles:",
    k3_s2_cond: "Two rectangles are congruent if",
    k3_s2_cond_k: "their length (", k3_s2_cond_kb: ") and width (", k3_s2_cond_kc: ") are equal",
    k3_s2_note: "All angles of a rectangle are already 90°, so only 2 pairs of corresponding sides need to be equal.",
    k3_s2_ex_title: "Quick example:",
    k3_s2_ex1: "Rectangle 6 cm × 4 cm", k3_s2_ex1b: "rectangle 6 cm × 4 cm ✓",
    k3_s2_ex2: "Rectangle 6 cm × 4 cm", k3_s2_ex2b: "rectangle 4 cm × 6 cm ✗",
    k3_s2_ex2c: "(check corresponding side pairs!)",
    k3_s3: "③ Parallelogram",
    fig7: "Figure 7. Two congruent parallelograms — ABCD ≅ PQRS if two sides equal and included angle equal (AB=PQ, BC=QR, ∠A=∠P)",
    k3_s3_cond_title: "Condition for congruent parallelograms:",
    k3_s3_cond: "Two parallelograms are congruent if",
    k3_s3_cond_k: "two corresponding sides are equal AND the included angle is equal",
    k3_s3_note: "⚠️ Two parallelograms with equal sides are not necessarily congruent if their angles differ!",
    k3_s3_prop_title: "Additional properties:",
    k3_s3_and: "and", k3_s3_opp_angles: "(opposite angles)", k3_s3_adj_angles: "(adjacent angles supplement to 180°)",
    k3_s4: "④ Trapezoid",
    fig8: "Figure 8. Two congruent trapezoids — ABCD ≅ PQRS if all corresponding sides and angles are equal",
    k3_s4_cond_title: "Condition for congruent trapezoids:",
    k3_s4_cond: "Two trapezoids are congruent if",
    k3_s4_cond_k: "all corresponding sides are equal AND all corresponding angles are equal",
    k3_s4_iso_title: "Isosceles Trapezoid:",
    k3_s4_iso_p: "For congruent isosceles trapezoids, the legs are correspondingly equal and the base angles are equal.",
    k3_s4_legs: "(legs of equal length)",
    k3_s5: "⑤ Rhombus",
    fig9: "Figure 9. Two congruent rhombuses — ABCD ≅ PQRS if sides equal and one included angle equal (AB=PQ and ∠A=∠P)",
    k3_s5_cond_title: "Condition for congruent rhombuses:",
    k3_s5_cond: "Two rhombuses are congruent if",
    k3_s5_cond_k: "their side lengths are equal AND one included angle is equal",
    k3_s5_note: "⚠️ Two rhombuses with equal sides are not necessarily congruent — the included angles must also be equal!",
    k3_s5_prop_title: "Additional properties:",
    k3_s5_p1: "✅", k3_s5_p2: "(all sides equal)", k3_s5_p3: "and",
    k3_s5_p4: "(opposite angles equal)",
    k3_s5_p5: "✅ Diagonals bisect each other at right angles",
    k3_s6: "⑥ Kite",
    fig10: "Figure 10. Two congruent kites — ABCD ≅ PQRS if all corresponding sides and angles are equal",
    k3_s6_cond_title: "Condition for congruent kites:",
    k3_s6_cond: "Two kites are congruent if",
    k3_s6_cond_k: "all corresponding sides are equal AND all corresponding angles are equal",
    k3_s6_ang_note: "(angle between the unequal sides)",
    k3_s6_prop_title: "Properties of kites:",
    k3_s6_p1: "✅", k3_s6_p1b: "and", k3_s6_p1c: "(two pairs of adjacent sides equal)",
    k3_s6_p2: "✅", k3_s6_p2b: "(angles between the unequal sides are equal)",
    k3_s6_p3: "✅ Main diagonal (AC) bisects the other diagonal (BD) at right angles",
    k3_s7: "⑦ Circle",
    fig11: "Figure 11. Two congruent circles — if their radii are equal (r₁ = r₂)",
    k3_s7_cond_title: "Condition for congruent circles:",
    k3_s7_cond: "Two circles are congruent if and only if",
    k3_s7_cond_k: "their radii are equal",
    k3_s7_circle1: "Circle₁", k3_s7_circle2: "Circle₂",
    k3_s7_note: "Circles have no angles, so only 1 condition is needed: equal radii!",
    k3_s7_prop_title: "Consequences:",
    k3_s7_p1: "✅ Equal circumference:", k3_s7_p2: "✅ Equal area:",
    tbl3_title: "📊 SUMMARY OF CONGRUENCE CONDITIONS FOR PLANE FIGURES:",
    tbl3_h1: "Figure", tbl3_h2: "Congruence Condition",
    tbl3_r1n: "Triangle", tbl3_r1v: "SSS / SAS / ASA / AAS (any one)",
    tbl3_r2n: "Square", tbl3_r2v: "Side lengths equal (1 condition)",
    tbl3_r3n: "Rectangle", tbl3_r3v: "Corresponding length and width equal",
    tbl3_r4n: "Parallelogram", tbl3_r4v: "2 corresponding sides + included angle equal",
    tbl3_r5n: "Trapezoid", tbl3_r5v: "All corresponding sides + angles equal",
    tbl3_r6n: "Circle", tbl3_r6v: "Radii equal (1 condition)",
    tbl3_r7n: "n-gon", tbl3_r7v: "All n sides + all n angles correspondingly equal",
    badge_mudah: "EASY", badge_sedang: "MEDIUM",
    c1_title: "Example 1 — Congruent Triangles",
    c1_q: "Look at the figure.",
    fig12: "Figure 12. Diagram of points P, T, U, S, R, Q — find the number of congruent triangles",
    c1_q2: "The number of congruent triangles in the figure is . . . .",
    c1_discuss_title: "SOLUTION:",
    c1_discuss_intro: "Identify the triangles formed in the figure:",
    c1_t1: "right-angled at T", c1_t2: "right-angled at S", c1_t3: "formed by T, U, S",
    c1_discuss_p: "All three triangles are congruent to each other as they satisfy the congruence conditions.",
    c1_answer: "Answer: D. 3 triangles ✓",
    c2_title: "Example 2 — Congruence Axiom",
    c2_q: "Given", c2_q2: "by which axiom? . . . .",
    fig13: "Figure 13. Diagram △CDA and △CBE with BC = CD and ∠CDA = ∠CBE = 90°",
    c2_opt_a: "A. \u00a0side, side, side", c2_opt_b: "B. \u00a0side, side, angle",
    c2_opt_c: "C. \u00a0side, angle, side", c2_opt_d: "D. \u00a0angle, side, angle",
    c2_discuss_title: "SOLUTION:",
    c2_discuss_intro: "Check the corresponding elements of",
    c2_discuss_introb: "and",
    c2_el1: "(angle C is equal, since A, B, C are collinear)",
    c2_el2: "(given", c2_el2b: ") ← included side",
    c2_el3: "(right angles)",
    c2_discuss_p: "Two angles + included side equal → axiom",
    c2_discuss_pb: "Angle–Side–Angle (ASA)",
    c2_answer: "Answer: D. angle, side, angle ✓",
    c3_title: "Example 3 — Finding the Value of m",
    c3_q: "If", c3_q2: ", find the value of", c3_q3: ". . . .",
    fig14: "Figure 14. Diagram △ABC ≅ △PQR — side AC = (12 – m) corresponds to side PR = 5, find m",
    c3_discuss_title: "SOLUTION:",
    c3_discuss_intro: "Since", c3_discuss_introb: ", the corresponding sides are:",
    c3_el1: "Side AC corresponds to side PR",
    c3_answer: "Answer: D. 7 ✓",
    rang_title: "📋 Summary — Congruence of Plane Figures",
    rang_h1: "Figure", rang_h2: "Congruence Condition", rang_h3: "Min. No. of Conditions",
    rang_r1n: "Triangle", rang_r1v: "SSS, SAS, ASA, or AAS (any one)", rang_r1e: "3 elements",
    rang_r2n: "Square", rang_r2v: "Equal side length", rang_r2e: "1 element",
    rang_r3n: "Rectangle", rang_r3v: "Corresponding length and width equal", rang_r3e: "2 elements",
    rang_r4n: "Parallelogram", rang_r4v: "2 corresponding sides + included angle equal", rang_r4e: "3 elements",
    rang_r5n: "Trapezoid & Polygon", rang_r5v: "All corresponding sides + all angles equal", rang_r5e: "All elements",
    rang_r6n: "Circle", rang_r6v: "Equal radii", rang_r6e: "1 element",
    rang_note1: "Definition:",
    rang_note1b: "Two figures are congruent (≅) if all corresponding sides are equal AND all corresponding angles are equal",
    rang_note2: "Important notation:",
    rang_note2b: "means A↔P, B↔Q, C↔R. Vertex order determines the pairing!",
    rang_note3: "Figures may be rotated/reflected:",
    rang_note3b: "Congruence still holds even if one figure is rotated or reflected",
    tips_title: "💡 Tips & Tricks",
    tips_1t: "Remember the triangle congruence conditions (SSS, SAS, ASA, AAS):",
    tips_1b: "S = Side, A = Angle. These conditions guarantee all three sides and three angles are equal — no need to check them one by one!",
    tips_2t: "Quick way to find corresponding sides from the notation:",
    tips_2b: "If", tips_2bb: ", match vertices in the same position:",
    tips_3t: "Distinguish congruence from similarity in multiple-choice:",
    tips_3b: "If there is a \"scale factor k ≠ 1\" → similar, not congruent. If \"all measurements are exactly equal\" → congruent (k=1).",
    tips_4t: "For \"find the value of x\" problems:",
    tips_4b: "Use pairs of corresponding equal sides. If",
    tips_4bb: ", write the equation directly and solve.",
    conc_title: "✅ Conclusion",
    conc_p1: "Congruence of plane figures is the concept of",
    conc_p1k: "\"perfect overlap\"",
    conc_p1b: "— two figures that can be stacked on each other with no gaps.",
    conc_l1: "🔹 Not all figures need all conditions:",
    conc_l1k: "squares and circles", conc_l1b: "need only 1 condition",
    conc_l2: "🔹 Triangles have", conc_l2k: "4 proof methods",
    conc_l2b: "for congruence (SSS, SAS, ASA, AAS)",
    conc_l3: "🔹 A rotated or reflected figure", conc_l3k: "remains congruent",
    conc_l4: "🔹 Congruence is a special case of similarity:",
    conc_note: "Congruence is the foundation of geometric proof — used to prove parallel lines, equal angles, and properties of 3D shapes.",
    back: "← Back to Congruence and Similarity",
  },
  ja: {
    pageTitle: "平面図形の合同",
    pageSub: "9年生 · 合同と相似 · 数学",
    sec_intro: "🧱 合同とは？",
    sec_konsep1: "📘 第1節 — 合同な2つの三角形の性質",
    sec_konsep2: "📘 第2節 — 2つの三角形が合同な条件",
    sec_bangunLain: "📘 第3節 — その他の平面図形の合同",
    sec_contoh: "📝 練習問題 — 三角形と図形の合同",
    intro_p1: "2つの平面図形が",
    intro_k1: "合同",
    intro_p1b: "であるとは、一方を",
    intro_em: "ぴったり",
    intro_p1c: "他方の上に重ねることができることです — まるで同じジグソーパズルのピースのように。合同は",
    intro_k2: "すべての種類の平面図形",
    intro_p1d: "に適用されます。三角形だけではありません！",
    intro_formal: "📌 形式的な定義",
    intro_f1: "2つの平面図形",
    intro_f2: "と",
    intro_f3: "が合同",
    intro_f3b: "であるのは、次の条件を満たすときかつそのときに限ります：",
    intro_c1: "① 対応するすべての辺が",
    intro_c1b: "等しい",
    intro_c2: "② 対応するすべての角が",
    intro_c2b: "等しい",
    intro_note: "合同な図形は、反転（鏡映）または回転して重ね合わせることができます。",
    k1_summary: "🎯 重要なまとめ",
    k1_p1: "もし",
    k1_p1b: "ならば、同時に2つの性質が成立します：",
    k1_rusuk: "① 対応する辺は等しい：",
    k1_sudut: "② 対応する角は等しい：",
    k1_diag_label: "🔍 三角形の合同の性質のイラスト：",
    fig1: "図1. △ABC ≅ △PQR のイラスト — 対応するすべての辺が等しく、すべての角が等しい",
    k1_warn: "頂点の順序に注意！",
    k1_warn2: "はA↔P, B↔Q, C↔Rを意味します。つまり",
    k1_warn3: "（ではなく",
    k1_warn3b: "！）",
    k2_summary: "🎯 重要なまとめ",
    k2_p1: "2つの三角形の合同を証明するには、次の4つの条件の",
    k2_p1b: "いずれか1つ",
    k2_p1c: "を示せば十分です：",
    k2_rrr: "① 条件SSS — 3辺相等",
    fig2: "図2. 条件SSS — 3組の対応する辺がすべて等しい：AB=PQ, BC=QR, CA=RP",
    k2_rrr_p: "3組の対応する辺がすべて等しい。",
    k2_rar: "② 条件SAS — 2辺夾角",
    fig3: "図3. 条件SAS — 2辺が等しく挟む角も等しい：AB=PQ, ∠A=∠P, AC=PR",
    k2_rar_p: "2辺が等しく",
    k2_rar_pb: "その挟む角も",
    k2_rar_pc: "等しい。",
    k2_ara: "③ 条件ASA / AAS / SAA — 2角夾辺 / 2角1辺",
    fig4: "図4. 条件ASA/AAS/SAA — 1辺が等しく2角が等しい：∠A=∠P, AB=PQ, ∠B=∠Q",
    k2_ara_p: "1辺が等しく2角が等しい（辺は角に挟まれていても対向していても可）。",
    tbl2_title: "📊 三角形の合同条件のまとめ：",
    tbl2_h1: "記号", tbl2_h2: "条件", tbl2_h3: "必要な要素",
    tbl2_code_rrr: "SSS", tbl2_code_rar: "SAS", tbl2_code_ara: "ASA", tbl2_code_aar: "AAS/SAA",
    tbl2_rrr_s: "3組の辺が等しい", tbl2_rrr_e: "3辺",
    tbl2_rar_s: "2辺＋挟む角が等しい", tbl2_rar_e: "2辺＋1角",
    tbl2_ara_s: "1辺（挟まれた）＋2角が等しい", tbl2_ara_e: "1辺＋2角",
    tbl2_aar_s: "1辺（対向する）＋2角が等しい", tbl2_aar_e: "1辺＋2角",
    k3_intro: "合同は三角形に限りません。正方形、長方形、平行四辺形、台形、ひし形、凧形、円、その他の多角形など、すべての平面図形が合同になれます。一般条件は変わりません：",
    k3_intro_k: "対応するすべての辺が等しく、かつ対応するすべての角が等しい。",
    k3_s1: "① 正方形",
    fig5: "図5. 2つの合同な正方形 — 正方形ABCD ≅ 正方形PQRSは辺が等しいとき (AB = PQ)",
    k3_s1_cond_title: "正方形の合同条件：",
    k3_s1_cond: "2つの正方形は",
    k3_s1_cond_k: "辺の長さが等しい",
    k3_s1_squareName: "正方形",
    k3_s1_note: "正方形のすべての角はすでに90°なので、条件は辺1つだけ！",
    k3_s1_prop_title: "合同な場合の性質：",
    k3_s2: "② 長方形",
    fig6: "図6. 2つの合同な長方形 — ABCD ≅ PQRSは縦と横が等しいとき (AB=PQ かつ BC=QR)",
    k3_s2_cond_title: "長方形の合同条件：",
    k3_s2_cond: "2つの長方形は",
    k3_s2_cond_k: "縦（", k3_s2_cond_kb: "）と横（", k3_s2_cond_kc: "）が等しい",
    k3_s2_note: "長方形のすべての角は90°なので、対応する2組の辺が等しければよい。",
    k3_s2_ex_title: "クイック例：",
    k3_s2_ex1: "6 cm × 4 cm の長方形", k3_s2_ex1b: "6 cm × 4 cm の長方形 ✓",
    k3_s2_ex2: "6 cm × 4 cm の長方形", k3_s2_ex2b: "4 cm × 6 cm の長方形 ✗",
    k3_s2_ex2c: "（対応する辺の組を確認！）",
    k3_s3: "③ 平行四辺形",
    fig7: "図7. 2つの合同な平行四辺形 — ABCD ≅ PQRSは2辺と挟む角が等しいとき (AB=PQ, BC=QR, ∠A=∠P)",
    k3_s3_cond_title: "平行四辺形の合同条件：",
    k3_s3_cond: "2つの平行四辺形は",
    k3_s3_cond_k: "2辺が等しくかつ挟む角が等しい",
    k3_s3_note: "⚠️ 辺が等しい2つの平行四辺形でも、角が異なれば合同ではない！",
    k3_s3_prop_title: "追加の性質：",
    k3_s3_and: "かつ", k3_s3_opp_angles: "（対角）", k3_s3_adj_angles: "（隣接する角の和 = 180°）",
    k3_s4: "④ 台形",
    fig8: "図8. 2つの合同な台形 — ABCD ≅ PQRSは対応するすべての辺と角が等しいとき",
    k3_s4_cond_title: "台形の合同条件：",
    k3_s4_cond: "2つの台形は",
    k3_s4_cond_k: "対応するすべての辺が等しくかつ対応するすべての角が等しい",
    k3_s4_iso_title: "等脚台形：",
    k3_s4_iso_p: "合同な等脚台形では、脚が対応して等しく底角も等しい。",
    k3_s4_legs: "（脚の長さが等しい）",
    k3_s5: "⑤ ひし形",
    fig9: "図9. 2つの合同なひし形 — ABCD ≅ PQRSは辺が等しく挟む角が等しいとき (AB=PQ かつ ∠A=∠P)",
    k3_s5_cond_title: "ひし形の合同条件：",
    k3_s5_cond: "2つのひし形は",
    k3_s5_cond_k: "辺の長さが等しくかつ1つの挟む角が等しい",
    k3_s5_note: "⚠️ 辺が等しい2つのひし形でも合同とは限りません — 挟む角も等しくなければ！",
    k3_s5_prop_title: "追加の性質：",
    k3_s5_p1: "✅", k3_s5_p2: "（すべての辺が等しい）", k3_s5_p3: "かつ",
    k3_s5_p4: "（対角が等しい）",
    k3_s5_p5: "✅ 対角線は互いに垂直二等分する",
    k3_s6: "⑥ 凧形（たこ形）",
    fig10: "図10. 2つの合同な凧形 — ABCD ≅ PQRSは対応するすべての辺と角が等しいとき",
    k3_s6_cond_title: "凧形の合同条件：",
    k3_s6_cond: "2つの凧形は",
    k3_s6_cond_k: "対応するすべての辺が等しくかつ対応するすべての角が等しい",
    k3_s6_ang_note: "（等しくない辺の間の角）",
    k3_s6_prop_title: "凧形の性質：",
    k3_s6_p1: "✅", k3_s6_p1b: "かつ", k3_s6_p1c: "（隣り合う2組の辺が等しい）",
    k3_s6_p2: "✅", k3_s6_p2b: "（等しくない辺の間の角が等しい）",
    k3_s6_p3: "✅ 主対角線（AC）は他の対角線（BD）を垂直二等分する",
    k3_s7: "⑦ 円",
    fig11: "図11. 2つの合同な円 — 半径が等しいとき (r₁ = r₂)",
    k3_s7_cond_title: "円の合同条件：",
    k3_s7_cond: "2つの円は",
    k3_s7_cond_k: "半径が等しい",
    k3_s7_circle1: "円₁", k3_s7_circle2: "円₂",
    k3_s7_note: "円には角がないので条件は1つだけ：半径が等しい！",
    k3_s7_prop_title: "結果として：",
    k3_s7_p1: "✅ 等しい円周：", k3_s7_p2: "✅ 等しい面積：",
    tbl3_title: "📊 各平面図形の合同条件のまとめ：",
    tbl3_h1: "図形", tbl3_h2: "合同条件",
    tbl3_r1n: "三角形", tbl3_r1v: "SSS / SAS / ASA / AAS（いずれか1つ）",
    tbl3_r2n: "正方形", tbl3_r2v: "辺が等しい（条件1つ）",
    tbl3_r3n: "長方形", tbl3_r3v: "対応する縦と横が等しい",
    tbl3_r4n: "平行四辺形", tbl3_r4v: "対応する2辺＋挟む角が等しい",
    tbl3_r5n: "台形", tbl3_r5v: "対応するすべての辺と角が等しい",
    tbl3_r6n: "円", tbl3_r6v: "半径が等しい（条件1つ）",
    tbl3_r7n: "n角形", tbl3_r7v: "n組の辺と角がすべて対応して等しい",
    badge_mudah: "やさしい", badge_sedang: "ふつう",
    c1_title: "例題1 — 合同な三角形",
    c1_q: "次の図を見なさい。",
    fig12: "図12. 点P, T, U, S, R, Qの図 — 合同な三角形の数を求めよ",
    c1_q2: "図の中の合同な三角形の数は . . . .",
    c1_discuss_title: "解説：",
    c1_discuss_intro: "図の中にできる三角形を特定する：",
    c1_t1: "Tで直角", c1_t2: "Sで直角", c1_t3: "T, U, Sからなる",
    c1_discuss_p: "3つの三角形はいずれも合同の条件を満たすため、互いに合同です。",
    c1_answer: "答え：D. 3個 ✓",
    c2_title: "例題2 — 合同の公理",
    c2_q: "辺の長さ", c2_q2: "はどの公理によるか . . . .",
    fig13: "図13. △CDAと△CBEの図（BC = CD、∠CDA = ∠CBE = 90°）",
    c2_opt_a: "A. \u00a0辺、辺、辺", c2_opt_b: "B. \u00a0辺、辺、角",
    c2_opt_c: "C. \u00a0辺、角、辺", c2_opt_d: "D. \u00a0角、辺、角",
    c2_discuss_title: "解説：",
    c2_discuss_intro: "対応する要素を確認する：",
    c2_discuss_introb: "と",
    c2_el1: "（A, B, Cが同一直線上にあるためCの角は等しい）",
    c2_el2: "（既知", c2_el2b: "）← 挟む辺",
    c2_el3: "（直角）",
    c2_discuss_p: "2角＋挟む辺が等しい → 公理",
    c2_discuss_pb: "角–辺–角（ASA）",
    c2_answer: "答え：D. 角、辺、角 ✓",
    c3_title: "例題3 — mの値を求める",
    c3_q: "もし", c3_q2: "ならば", c3_q3: "の値は . . . .",
    fig14: "図14. △ABC ≅ △PQRの図 — 辺AC = (12 – m)が辺PR = 5に対応、mを求めよ",
    c3_discuss_title: "解説：",
    c3_discuss_intro: "より", c3_discuss_introb: "、対応する辺は：",
    c3_el1: "辺ACは辺PRに対応する",
    c3_answer: "答え：D. 7 ✓",
    rang_title: "📋 まとめ — 平面図形の合同",
    rang_h1: "図形", rang_h2: "合同条件", rang_h3: "最小条件数",
    rang_r1n: "三角形", rang_r1v: "SSS, SAS, ASA, またはAAS（いずれか）", rang_r1e: "3要素",
    rang_r2n: "正方形", rang_r2v: "等しい辺の長さ", rang_r2e: "1要素",
    rang_r3n: "長方形", rang_r3v: "対応する縦と横が等しい", rang_r3e: "2要素",
    rang_r4n: "平行四辺形", rang_r4v: "2辺対応等しい＋挟む角等しい", rang_r4e: "3要素",
    rang_r5n: "台形・多角形", rang_r5v: "すべての辺が対応等しい＋すべての角等しい", rang_r5e: "全要素",
    rang_r6n: "円", rang_r6v: "等しい半径", rang_r6e: "1要素",
    rang_note1: "定義：",
    rang_note1b: "2つの図形は合同(≅)、すべての対応する辺が等しくかつすべての対応する角が等しいとき",
    rang_note2: "重要な記法：",
    rang_note2b: "はA↔P, B↔Q, C↔Rを意味します。頂点の順序が対応を決めます！",
    rang_note3: "図形は回転・反転可能：",
    rang_note3b: "一方の図形が回転または鏡映されていても合同は成立します",
    tips_title: "💡 コツとテクニック",
    tips_1t: "三角形の合同条件（SSS, SAS, ASA, AAS）を覚える：",
    tips_1b: "S = 辺（Side）、A = 角（Angle）。これらの条件で3辺と3角がすべて自動的に等しくなります — 一つ一つ確認する必要はありません！",
    tips_2t: "記法から対応する辺を素早く見つける方法：",
    tips_2b: "もし", tips_2bb: "なら、同じ位置の頂点を対応させる：",
    tips_3t: "選択問題で合同と相似を区別する：",
    tips_3b: "「スケール係数k ≠ 1」があれば → 相似（合同ではない）。「すべての寸法がまったく同じ」なら → 合同（k=1）。",
    tips_4t: "「xの値を求める」問題：",
    tips_4b: "等しい対応辺の組を使う。もし",
    tips_4bb: "なら、直接方程式を立てて解く。",
    conc_title: "✅ 結論",
    conc_p1: "平面図形の合同は",
    conc_p1k: "「完全に重なる」",
    conc_p1b: "という概念です — 隙間も余りもなく重ねることができる2つの図形。",
    conc_l1: "🔹 すべての図形がすべての条件を必要とするわけではない：",
    conc_l1k: "正方形と円", conc_l1b: "は条件が1つだけ",
    conc_l2: "🔹 三角形には合同の", conc_l2k: "4つの証明方法",
    conc_l2b: "がある（SSS, SAS, ASA, AAS）",
    conc_l3: "🔹 回転・鏡映された図形も", conc_l3k: "合同のまま",
    conc_l4: "🔹 合同は相似の特殊なケース：",
    conc_note: "合同は幾何学的証明の基礎 — 平行線、等角、立体図形の性質を証明するのに使われます。",
    back: "← 合同と相似に戻る",
  },
};
type TKey = typeof translations.id;

/* ─────────────────────────────────────────────────────────────────────────────
   SVG DIAGRAMS — TRIANGLE CONGRUENCE
───────────────────────────────────────────────────────────────────────────── */

/**
 * DiagramSifatKongruen
 *
 * Triangles: ABC = A(40,185) B(160,185) C(100,55)
 *            PQR = P(230,185) Q(350,185) R(290,55)  (offset +190 in x)
 *
 * Tick placement — each tick line is drawn PERPENDICULAR to its side,
 * centred on the side's midpoint.
 *
 * Side AB / PQ  (horizontal):  perp = vertical  → double tick (green)
 * Side AC / PR  (left, slope): perp = (0.908, 0.419) → single tick (orange)
 * Side BC / QR  (right, slope):perp = (0.908,-0.419) → triple tick (yellow)
 *
 * Computed values:
 *   AC direction (60,-130), |AC|=143.2, unit=(0.419,-0.908)
 *   AC perp unit = (0.908, 0.419), half-len = 7
 *   Midpoint AC = (70,120)  → tick (63.6,117.1)→(76.4,122.9)
 *
 *   BC direction (-60,-130), perp unit=(0.908,-0.419), half-len=7
 *   Midpoint BC = (130,120)
 *   Triple spacing: along-unit=(-0.419,-0.908)*5=(-2.1,-4.5)
 *   Centers: (127.9,115.5) (130,120) (132.1,124.5)
 *   Each tick: center ± perp*7 = (±6.4, ∓2.9)
 */
const DiagramSifatKongruen = () => (
  <svg viewBox="0 0 410 215" className="w-full max-w-md mx-auto">

    {/* ── Triangle ABC  A(40,185) B(160,185) C(100,55) ── */}
    <polygon points="40,185 160,185 100,55"
      fill="#facc15" fillOpacity="0.55" stroke="#fde047" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="40"  cy="185" r="3.5" fill="#fde047" />
    <circle cx="160" cy="185" r="3.5" fill="#fde047" />
    <circle cx="100" cy="55"  r="3.5" fill="#fde047" />
    <text x="22"  y="202" fontSize="14" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="163" y="202" fontSize="14" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="95"  y="47"  fontSize="14" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">C</text>

    {/* AB — double tick (green) — perpendicular = vertical, midpoint (100,185) */}
    <line x1="94"  y1="178" x2="94"  y2="192" stroke="#22c55e" strokeWidth="2.4" />
    <line x1="106" y1="178" x2="106" y2="192" stroke="#22c55e" strokeWidth="2.4" />

    {/* AC — single tick (orange) — midpoint (70,120), perp=(0.908,0.419)*7 */}
    <line x1="64" y1="117" x2="76" y2="123" stroke="#f97316" strokeWidth="2.4" />

    {/* BC — triple tick (yellow) — midpoint (130,120), perp=(0.908,-0.419)*7 */}
    {/* center 1: (128,116)  line: (122,119)→(134,113) */}
    <line x1="122" y1="119" x2="134" y2="113" stroke="#facc15" strokeWidth="2.4" />
    {/* center 2: (130,120)  line: (124,123)→(136,117) */}
    <line x1="124" y1="123" x2="136" y2="117" stroke="#facc15" strokeWidth="2.4" />
    {/* center 3: (132,125)  line: (126,128)→(138,122) */}
    <line x1="126" y1="128" x2="138" y2="122" stroke="#facc15" strokeWidth="2.4" />

    {/*
      Angle arcs — △ABC
      A(40,185): between AB→right and AC→upper-right  color orange (#f97316)
      B(160,185): between BC→upper-left and BA→left   color sky   (#38bdf8)
      C(100,55) : between CA→lower-left and CB→lower-right color pink (#e879f9)
      radius = 18 px, drawn as proper SVG circular arcs centered at each vertex
      unit_AC = (60,-130)/143.2 = (0.419,-0.908)
      unit_BC = (-60,-130)/143.2 = (-0.419,-0.908)
    */}
    {/* ∠A — orange: arc from (58,185) on AB → (48,169) on AC, sweep CCW (0) */}
    <path d="M 58,185 A 18,18 0 0,0 48,169" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" />
    {/* circle marker inside ∠A arc (bisector dir ≈ (0.843,−0.539), r=10 from A) */}
    <circle cx="48" cy="180" r="2.5" fill="#f97316" />
    {/* ∠B — sky: arc from (142,185) on BA → (153,169) on BC, sweep CW (1) into triangle */}
    <path d="M 142,185 A 18,18 0 0,1 153,169" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
    {/* ∠C — pink: proper circular arc sweeping into triangle interior.
        Start r=15 on CA: (94,69), End r=15 on CB: (106,69), sweep CW (flag 1) */}
    <path d="M 94,69 A 15,15 0 0,1 106,69" fill="none" stroke="#e879f9" strokeWidth="2.2" strokeLinecap="round" />
    {/* × marker inside ∠C arc — bisector at (100,67) */}
    <line x1="97" y1="64" x2="103" y2="70" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
    <line x1="103" y1="64" x2="97" y2="70" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />

    {/* ≅ */}
    <text x="195" y="128" fontSize="28" fill="#facc15" fontWeight="bold" fontFamily="serif">≅</text>

    {/* ── Triangle PQR  P(230,185) Q(350,185) R(290,55) — same shape, x+190 ── */}
    <polygon points="230,185 350,185 290,55"
      fill="#4ade80" fillOpacity="0.55" stroke="#86efac" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="230" cy="185" r="3.5" fill="#86efac" />
    <circle cx="350" cy="185" r="3.5" fill="#86efac" />
    <circle cx="290" cy="55"  r="3.5" fill="#86efac" />
    <text x="212" y="202" fontSize="14" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="353" y="202" fontSize="14" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="285" y="47"  fontSize="14" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">R</text>

    {/* PQ — double tick (green) — midpoint (290,185) */}
    <line x1="284" y1="178" x2="284" y2="192" stroke="#22c55e" strokeWidth="2.4" />
    <line x1="296" y1="178" x2="296" y2="192" stroke="#22c55e" strokeWidth="2.4" />

    {/* PR — single tick (orange) — midpoint (260,120) = AC+190 */}
    <line x1="254" y1="117" x2="266" y2="123" stroke="#f97316" strokeWidth="2.4" />

    {/* QR — triple tick (yellow) — midpoint (320,120) = BC+190 */}
    <line x1="312" y1="119" x2="324" y2="113" stroke="#facc15" strokeWidth="2.4" />
    <line x1="314" y1="123" x2="326" y2="117" stroke="#facc15" strokeWidth="2.4" />
    <line x1="316" y1="128" x2="328" y2="122" stroke="#facc15" strokeWidth="2.4" />

    {/*
      Angle arcs — △PQR  (x+190 from △ABC, same colors → A↔P, B↔Q, C↔R)
      All arcs use proper SVG circular arcs (radius=18), same geometry as △ABC shifted +190 in x
    */}
    {/* ∠P — orange: arc from (248,185) on PQ → (238,169) on PR, sweep CCW (0) */}
    <path d="M 248,185 A 18,18 0 0,0 238,169" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" />
    {/* circle marker inside ∠P arc (same as ∠A marker, bisector r=10 from P) */}
    <circle cx="238" cy="180" r="2.5" fill="#f97316" />
    {/* ∠Q — sky: arc from (332,185) on QP → (343,169) on QR, sweep CW (1) into triangle */}
    <path d="M 332,185 A 18,18 0 0,1 343,169" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
    {/* ∠R — pink: proper circular arc sweeping into triangle interior.
        Start r=15 on RP: (284,69), End r=15 on RQ: (296,69), sweep CW (flag 1) */}
    <path d="M 284,69 A 15,15 0 0,1 296,69" fill="none" stroke="#e879f9" strokeWidth="2.2" strokeLinecap="round" />
    {/* × marker inside ∠R arc — bisector at (290,67) */}
    <line x1="287" y1="64" x2="293" y2="70" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
    <line x1="293" y1="64" x2="287" y2="70" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />

    {/* title */}
    <text x="205" y="20" textAnchor="middle" fontSize="12" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">△ABC ≅ △PQR</text>
    <text x="205" y="36" textAnchor="middle" fontSize="9.5" fill="#94a3b8" fontFamily="sans-serif">Semua rusuk bersesuaian sama panjang &amp; sudut sama besar</text>
  </svg>
);

const DiagramSyaratRRR = () => (
  <svg viewBox="0 0 340 150" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="340" height="150" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* Triangle 1 — kuning cerah */}
    <polygon points="30,125 145,125 88,30" fill="#facc15" fillOpacity="0.58" stroke="#fde047" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="30" cy="125" r="3" fill="#fde047" />
    <circle cx="145" cy="125" r="3" fill="#fde047" />
    <circle cx="88" cy="30" r="3" fill="#fde047" />
    <text x="16" y="140" fontSize="12" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="147" y="140" fontSize="12" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="83" y="24" fontSize="12" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">C</text>
    {/* AB double tick — perp=vertical, midpoint(87.5,125), centers x=85 & x=90 */}
    <line x1="85" y1="118" x2="85" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="90" y1="118" x2="90" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    {/* AC single tick — perp=(0.853,0.521), midpoint(59,77.5), half-len=7 */}
    <line x1="53" y1="74" x2="65" y2="81" stroke="#ffffff" strokeWidth="2.2" />
    {/* BC triple tick — perp=(0.857,-0.514), midpoint(116.5,77.5), spacing=4 along side, half-len=6 */}
    <line x1="114" y1="84" x2="124" y2="78" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="112" y1="81" x2="122" y2="75" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="109" y1="77" x2="119" y2="71" stroke="#ffffff" strokeWidth="2.2" />

    {/* ≅ */}
    <text x="163" y="90" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* Triangle 2 — hijau cerah */}
    <polygon points="195,125 310,125 252,30" fill="#4ade80" fillOpacity="0.58" stroke="#86efac" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="195" cy="125" r="3" fill="#86efac" />
    <circle cx="310" cy="125" r="3" fill="#86efac" />
    <circle cx="252" cy="30" r="3" fill="#86efac" />
    <text x="181" y="140" fontSize="12" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="312" y="140" fontSize="12" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="247" y="24" fontSize="12" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">R</text>
    {/* PQ double tick — x+165 from AB */}
    <line x1="250" y1="118" x2="250" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="255" y1="118" x2="255" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    {/* PR single tick — x+165 from AC */}
    <line x1="218" y1="74" x2="230" y2="81" stroke="#ffffff" strokeWidth="2.2" />
    {/* QR triple tick — x+165 from BC */}
    <line x1="279" y1="84" x2="289" y2="78" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="277" y1="81" x2="287" y2="75" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="274" y1="77" x2="284" y2="71" stroke="#ffffff" strokeWidth="2.2" />

    <text x="170" y="14" textAnchor="middle" fontSize="10" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">RRR — 3 sisi bersesuaian sama panjang</text>
  </svg>
);

const DiagramSyaratRAR = () => (
  /*
   * Triangles: △ABC = A(30,125) B(145,125) C(88,30)
   *            △PQR = P(195,125) Q(310,125) R(252,30)  (offset x+165)
   *
   * RAR (Ruas-Apit-Ruas / SAS): AB=PQ, ∠A=∠P, AC=PR
   *
   * Ticks:
   *   AB/PQ (horizontal): double tick, perpendicular=vertical, midpoint (87.5,125)/(252.5,125)
   *     centers at x=85,90 and x=250,255  — extend ±7 from y=125
   *   AC/PR: single tick, perpendicular to side
   *     AC unit=(0.521,-0.854), perp=(0.854,0.521), midpoint (59,77.5)
   *     tick: (53,74)→(65,81)  |  PR: x+165 → (218,74)→(230,81)
   *
   * Angle arc at A(30,125) and P(195,125), radius=18, CCW (sweep=0):
   *   Start on AB ray r=18: (48,125) / (213,125)
   *   End   on AC ray r=18: A+(18·0.521, 18·(-0.854))=(39,110) / P+(same)=(204,110)
   *   Arc: M 48,125 A 18,18 0 0,0 39,110
   *
   * Dot inside ∠A/∠P — bisector unit≈(0.872,-0.490), r=12:
   *   A+(10.5,-5.9) = (41,119) | P+(same) = (206,119)
   */
  <svg viewBox="0 0 340 150" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="340" height="150" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Triangle 1: A(30,125) B(145,125) C(88,30) — magenta ── */}
    <polygon points="30,125 145,125 88,30" fill="#f472b6" fillOpacity="0.58" stroke="#fb7dd3" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="30"  cy="125" r="3" fill="#fb7dd3" />
    <circle cx="145" cy="125" r="3" fill="#fb7dd3" />
    <circle cx="88"  cy="30"  r="3" fill="#fb7dd3" />
    <text x="16"  y="140" fontSize="12" fill="#fb7dd3" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="147" y="140" fontSize="12" fill="#fb7dd3" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="83"  y="24"  fontSize="12" fill="#fb7dd3" fontWeight="bold" fontFamily="sans-serif">C</text>

    {/* AB — double tick (vertical), midpoint (87.5,125), centers x=85 & x=90 */}
    <line x1="85" y1="118" x2="85" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="90" y1="118" x2="90" y2="132" stroke="#ffffff" strokeWidth="2.2" />

    {/* AC — single tick (perp to AC), midpoint (59,77.5), half-len=7 */}
    <line x1="53" y1="74" x2="65" y2="81" stroke="#ffffff" strokeWidth="2.2" />

    {/* ∠A arc — proper circular arc CCW, radius 18, from AB→AC sweeping into triangle */}
    <path d="M 48,125 A 18,18 0 0,0 39,110" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* Circle dot inside ∠A — at bisector r=12 from A */}
    <circle cx="41" cy="119" r="2.5" fill="#facc15" />

    {/* ≅ */}
    <text x="163" y="90" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Triangle 2: P(195,125) Q(310,125) R(252,30) — orange (x+165) ── */}
    <polygon points="195,125 310,125 252,30" fill="#fb923c" fillOpacity="0.58" stroke="#fdba74" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="195" cy="125" r="3" fill="#fdba74" />
    <circle cx="310" cy="125" r="3" fill="#fdba74" />
    <circle cx="252" cy="30"  r="3" fill="#fdba74" />
    <text x="181" y="140" fontSize="12" fill="#fdba74" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="312" y="140" fontSize="12" fill="#fdba74" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="247" y="24"  fontSize="12" fill="#fdba74" fontWeight="bold" fontFamily="sans-serif">R</text>

    {/* PQ — double tick (vertical), midpoint (252.5,125), centers x=250 & x=255 */}
    <line x1="250" y1="118" x2="250" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="255" y1="118" x2="255" y2="132" stroke="#ffffff" strokeWidth="2.2" />

    {/* PR — single tick (perp to PR), midpoint (224,77.5) = AC midpoint+165 */}
    <line x1="218" y1="74" x2="230" y2="81" stroke="#ffffff" strokeWidth="2.2" />

    {/* ∠P arc — same geometry as ∠A arc, x+165 */}
    <path d="M 213,125 A 18,18 0 0,0 204,110" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* Circle dot inside ∠P — at bisector r=12 from P */}
    <circle cx="206" cy="119" r="2.5" fill="#facc15" />

    <text x="170" y="14" textAnchor="middle" fontSize="10" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">RAR — 2 sisi + sudut apit bersesuaian sama</text>
  </svg>
);

const DiagramSyaratARA = () => (
  /*
   * △ABC = A(30,125) B(145,125) C(88,30)
   * △PQR = P(195,125) Q(310,125) R(252,30)  (x+165)
   *
   * ARA/AAR: ∠A=∠P (•), AB=PQ (single tick), ∠B=∠Q (×)
   *
   * Arc at A/P — radius 16, CCW (sweep=0)
   *   Start on AB: A+(16,0)=(46,125) / P+(16,0)=(211,125)
   *   AC unit=(58,-95)/111.3=(0.521,-0.854)
   *   End on AC: A+16*(0.521,-0.854)=(38.3,111.3) / P+same=(203.3,111.3)
   *   Bisector unit=(1+0.521,-0.854)/|(...)| ≈ (0.872,-0.490)
   *   Dot at r=10: A+(8.7,-4.9)=(38.7,120.1) / P+same=(203.7,120.1)
   *
   * Arc at B/Q — radius 16, CW (sweep=1)
   *   BA unit=(-1,0), BC unit=(-0.515,-0.858)
   *   Start on BA: B+16*(-1,0)=(129,125) / Q+same=(294,125)
   *   End on BC: B+16*(-0.515,-0.858)=(136.8,111.3) / Q+same=(301.8,111.3)
   *   Bisector unit=(-0.870,-0.493)
   *   X at r=10: B+(-8.7,-4.9)=(136.3,120.1) / Q+same=(301.3,120.1)
   *
   * AB/PQ single tick: midpoint (87.5,125)/(252.5,125), vertical ±7
   */
  <svg viewBox="0 0 340 150" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="340" height="150" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Triangle 1: A(30,125) B(145,125) C(88,30) — cyan ── */}
    <polygon points="30,125 145,125 88,30" fill="#22d3ee" fillOpacity="0.58" stroke="#67e8f9" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="30"  cy="125" r="3" fill="#67e8f9" />
    <circle cx="145" cy="125" r="3" fill="#67e8f9" />
    <circle cx="88"  cy="30"  r="3" fill="#67e8f9" />
    <text x="16"  y="140" fontSize="12" fill="#67e8f9" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="147" y="140" fontSize="12" fill="#67e8f9" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="83"  y="24"  fontSize="12" fill="#67e8f9" fontWeight="bold" fontFamily="sans-serif">C</text>

    {/* AB — single tick (vertical), midpoint (87.5,125) */}
    <line x1="87" y1="118" x2="87" y2="132" stroke="#ffffff" strokeWidth="2.2" />

    {/* ∠A arc — CCW (sweep=0), radius=16 */}
    <path d="M 46,125 A 16,16 0 0,0 38,111" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* • dot inside ∠A — at bisector r=10 from A */}
    <circle cx="39" cy="120" r="3" fill="#facc15" />

    {/* ∠B arc — CW (sweep=1), radius=16 */}
    <path d="M 129,125 A 16,16 0 0,1 137,111" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* × mark inside ∠B — at bisector r=10 from B */}
    <line x1="133" y1="117" x2="139" y2="123" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
    <line x1="139" y1="117" x2="133" y2="123" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />

    {/* ≅ */}
    <text x="163" y="90" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Triangle 2: P(195,125) Q(310,125) R(252,30) — lime (x+165) ── */}
    <polygon points="195,125 310,125 252,30" fill="#a3e635" fillOpacity="0.58" stroke="#bef264" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="195" cy="125" r="3" fill="#bef264" />
    <circle cx="310" cy="125" r="3" fill="#bef264" />
    <circle cx="252" cy="30"  r="3" fill="#bef264" />
    <text x="181" y="140" fontSize="12" fill="#bef264" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="312" y="140" fontSize="12" fill="#bef264" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="247" y="24"  fontSize="12" fill="#bef264" fontWeight="bold" fontFamily="sans-serif">R</text>

    {/* PQ — single tick (vertical), midpoint (252.5,125) */}
    <line x1="252" y1="118" x2="252" y2="132" stroke="#ffffff" strokeWidth="2.2" />

    {/* ∠P arc — CCW (sweep=0), radius=16 — same as ∠A, x+165 */}
    <path d="M 211,125 A 16,16 0 0,0 203,111" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* • dot inside ∠P — at bisector r=10 from P */}
    <circle cx="204" cy="120" r="3" fill="#facc15" />

    {/* ∠Q arc — CW (sweep=1), radius=16 — same as ∠B, x+165 */}
    <path d="M 294,125 A 16,16 0 0,1 302,111" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* × mark inside ∠Q — at bisector r=10 from Q */}
    <line x1="298" y1="117" x2="304" y2="123" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
    <line x1="304" y1="117" x2="298" y2="123" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />

    <text x="170" y="14" textAnchor="middle" fontSize="10" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">ARA/AAR — 1 sisi + 2 sudut bersesuaian sama</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   SVG DIAGRAMS — NON-TRIANGLE SHAPES
───────────────────────────────────────────────────────────────────────────── */

const DiagramPersegi = () => (
  /*
   * Square 1: A(30,35) B(130,35) C(130,135) D(30,135)  side=100
   * Square 2: P(195,35) Q(295,35) R(295,135) S(195,135) side=100
   *
   * Side ticks (single, crossing edge by ±6):
   *   Top/Bottom midpoint x=80 (sq1) or 245 (sq2), vertical tick y±6 from edge
   *   Left/Right  midpoint y=85,              horizontal tick x±6 from edge
   *
   * Right-angle marks at every corner, inset 8 px, rendered via map()
   */
  <svg viewBox="0 0 340 160" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="340" height="160" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Square 1: A(30,35) B(130,35) C(130,135) D(30,135) ── */}
    <rect x="30" y="35" width="100" height="100" fill="#3b82f6" fillOpacity="0.2" stroke="#60a5fa" strokeWidth="2.2" />
    <text x="19"  y="32"  fontSize="12" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="133" y="32"  fontSize="12" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="133" y="148" fontSize="12" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="19"  y="148" fontSize="12" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* single ticks — centered on each side midpoint, crossing ±6 px */}
    <line x1="80" y1="29" x2="80" y2="41" stroke="#facc15" strokeWidth="2.2" />  {/* top,  mid (80,35)  */}
    <line x1="80" y1="129" x2="80" y2="141" stroke="#facc15" strokeWidth="2.2" /> {/* bot,  mid (80,135) */}
    <line x1="24" y1="85" x2="36" y2="85" stroke="#facc15" strokeWidth="2.2" />   {/* left, mid (30,85)  */}
    <line x1="124" y1="85" x2="136" y2="85" stroke="#facc15" strokeWidth="2.2" /> {/* right,mid (130,85) */}

    {/* right-angle marks at each corner, inset 8 px */}
    {([[30,35],[130,35],[130,135],[30,135]] as [number,number][]).map(([cx,cy],i)=>{
      const dx = i<2?8:-8, dy = i===0||i===3?8:-8;
      return <g key={i}><line x1={cx} y1={cy+dy} x2={cx+dx} y2={cy+dy} stroke="#94a3b8" strokeWidth="1.4"/><line x1={cx+dx} y1={cy} x2={cx+dx} y2={cy+dy} stroke="#94a3b8" strokeWidth="1.4"/></g>;
    })}
    <text x="80" y="102" textAnchor="middle" fontSize="10" fill="#fde68a" fontFamily="sans-serif">s</text>

    {/* ≅ */}
    <text x="163" y="100" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Square 2: P(195,35) Q(295,35) R(295,135) S(195,135) ── */}
    <rect x="195" y="35" width="100" height="100" fill="#a855f7" fillOpacity="0.18" stroke="#c084fc" strokeWidth="2.2" />
    <text x="184" y="32"  fontSize="12" fill="#d8b4fe" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="298" y="32"  fontSize="12" fill="#d8b4fe" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="298" y="148" fontSize="12" fill="#d8b4fe" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="184" y="148" fontSize="12" fill="#d8b4fe" fontWeight="bold" fontFamily="sans-serif">S</text>

    <line x1="245" y1="29"  x2="245" y2="41"  stroke="#facc15" strokeWidth="2.2" /> {/* top  mid (245,35)  */}
    <line x1="245" y1="129" x2="245" y2="141" stroke="#facc15" strokeWidth="2.2" /> {/* bot  mid (245,135) */}
    <line x1="189" y1="85"  x2="201" y2="85"  stroke="#facc15" strokeWidth="2.2" /> {/* left mid (195,85)  */}
    <line x1="289" y1="85"  x2="301" y2="85"  stroke="#facc15" strokeWidth="2.2" /> {/* right mid (295,85) */}

    {([[195,35],[295,35],[295,135],[195,135]] as [number,number][]).map(([cx,cy],i)=>{
      const dx = i<2?8:-8, dy = i===0||i===3?8:-8;
      return <g key={i}><line x1={cx} y1={cy+dy} x2={cx+dx} y2={cy+dy} stroke="#94a3b8" strokeWidth="1.4"/><line x1={cx+dx} y1={cy} x2={cx+dx} y2={cy+dy} stroke="#94a3b8" strokeWidth="1.4"/></g>;
    })}
    <text x="245" y="102" textAnchor="middle" fontSize="10" fill="#fde68a" fontFamily="sans-serif">s</text>

    <text x="170" y="16" textAnchor="middle" fontSize="10" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua persegi kongruen jika sisinya sama panjang</text>
  </svg>
);

const DiagramPersegiPanjang = () => (
  /*
   * Rect 1: A(20,45) B(150,45) C(150,125) D(20,125)  p=130  l=80
   * Rect 2: P(200,45) Q(330,45) R(330,125) S(200,125) p=130  l=80
   *
   * Ticks (cross edge ±6 px):
   *   p-sides (top/bottom, len=130): double tick at x = mid±3, vertical, centred at x=85 / x=265
   *   l-sides (left/right,  len=80):  single tick, horizontal, centred at y=85
   *   l-side mid-x for Rect1 = (20+150)/2=85, Rect2 = (200+330)/2=265
   *
   * Right-angle marks at every corner, inset 7 px
   */
  <svg viewBox="0 0 360 170" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="360" height="170" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Rectangle 1: A(20,45) B(150,45) C(150,125) D(20,125) ── */}
    <rect x="20" y="45" width="130" height="80" fill="#0ea5e9" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="2.2" />
    <text x="7"   y="42"  fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="153" y="42"  fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="153" y="138" fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="7"   y="138" fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* double tick on p-sides — centred at x=85, spacing 5, crossing ±6 */}
    <line x1="82" y1="39" x2="82" y2="51" stroke="#facc15" strokeWidth="2.2" />  {/* top  */}
    <line x1="88" y1="39" x2="88" y2="51" stroke="#facc15" strokeWidth="2.2" />
    <line x1="82" y1="119" x2="82" y2="131" stroke="#facc15" strokeWidth="2.2" /> {/* bot  */}
    <line x1="88" y1="119" x2="88" y2="131" stroke="#facc15" strokeWidth="2.2" />

    {/* single tick on l-sides — centred at y=85, crossing ±6 */}
    <line x1="14" y1="85" x2="26" y2="85" stroke="#22c55e" strokeWidth="2.2" />   {/* left  x=20 */}
    <line x1="144" y1="85" x2="156" y2="85" stroke="#22c55e" strokeWidth="2.2" /> {/* right x=150 */}

    <text x="85"  y="90" textAnchor="middle" fontSize="9" fill="#fde68a" fontFamily="sans-serif">p</text>
    <text x="32"  y="90" fontSize="9" fill="#fde68a" fontFamily="sans-serif">l</text>

    {/* right-angle marks inset 7 px */}
    {([[20,45],[150,45],[150,125],[20,125]] as [number,number][]).map(([cx,cy],i)=>{
      const dx=i<2?7:-7, dy=i===0||i===3?7:-7;
      return <g key={i}><line x1={cx} y1={cy+dy} x2={cx+dx} y2={cy+dy} stroke="#64748b" strokeWidth="1.4"/><line x1={cx+dx} y1={cy} x2={cx+dx} y2={cy+dy} stroke="#64748b" strokeWidth="1.4"/></g>;
    })}

    {/* ≅ — centred in the 50px gap (x=150 to x=200) */}
    <text x="175" y="100" textAnchor="middle" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Rectangle 2: P(200,45) Q(330,45) R(330,125) S(200,125) ── */}
    <rect x="200" y="45" width="130" height="80" fill="#0ea5e9" fillOpacity="0.16" stroke="#38bdf8" strokeWidth="2.2" />
    <text x="187" y="42"  fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="333" y="42"  fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="333" y="138" fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="187" y="138" fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">S</text>

    {/* double tick on p-sides — centred at x=265 */}
    <line x1="262" y1="39" x2="262" y2="51" stroke="#facc15" strokeWidth="2.2" />
    <line x1="268" y1="39" x2="268" y2="51" stroke="#facc15" strokeWidth="2.2" />
    <line x1="262" y1="119" x2="262" y2="131" stroke="#facc15" strokeWidth="2.2" />
    <line x1="268" y1="119" x2="268" y2="131" stroke="#facc15" strokeWidth="2.2" />

    {/* single tick on l-sides */}
    <line x1="194" y1="85" x2="206" y2="85" stroke="#22c55e" strokeWidth="2.2" />  {/* left  x=200 */}
    <line x1="324" y1="85" x2="336" y2="85" stroke="#22c55e" strokeWidth="2.2" />  {/* right x=330 */}

    {([[200,45],[330,45],[330,125],[200,125]] as [number,number][]).map(([cx,cy],i)=>{
      const dx=i<2?7:-7, dy=i===0||i===3?7:-7;
      return <g key={i}><line x1={cx} y1={cy+dy} x2={cx+dx} y2={cy+dy} stroke="#64748b" strokeWidth="1.4"/><line x1={cx+dx} y1={cy} x2={cx+dx} y2={cy+dy} stroke="#64748b" strokeWidth="1.4"/></g>;
    })}

    <text x="180" y="17" textAnchor="middle" fontSize="9.5" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua persegi panjang kongruen jika panjang dan lebarnya sama</text>
  </svg>
);

const DiagramJajarGenjang = () => (
  /*
   * Parallelogram 1: A(30,130) B(150,130) C(130,40) D(10,40)
   * Parallelogram 2: P(205,130) Q(325,130) R(305,40) S(185,40)  (offset x+175)
   *
   * Side directions & perpendiculars:
   *   AB/DC (horizontal, y=130/40): perp = vertical
   *     midpoint AB = (90,130), DC = (70,40)  → double tick centred at x=90/70
   *   AD: direction D−A=(−20,−90), |=92.2, unit=(−0.217,−0.976)
   *     perp unit (rotate 90° CCW) = (0.976,−0.217)
   *     midpoint AD = (20,85) → single tick: (20±6.8, 85∓1.5) = (13,87)→(27,83)
   *   BC: direction C−B=(−20,−90), same unit. midpoint BC=(140,85)
   *     single tick: (133,87)→(147,83)
   *
   * Angle arcs (proper circular arcs, r=15):
   *   ∠A (orange, obtuse ≈103°):
   *     start on AB: A+(15,0)=(45,130)
   *     end   on AD: A+15*(−0.217,−0.976)=(26.7,115.4)→(27,115)
   *     sweep CCW (flag 0)  → M 45,130 A 15,15 0 0,0 27,115
   *   ∠B (sky, acute ≈77°):
   *     start on BA: B+15*(−1,0)=(135,130)
   *     end   on BC: B+15*(−0.217,−0.976)=(146.7,115.4)→(147,115)
   *     sweep CW  (flag 1)  → M 135,130 A 15,15 0 0,1 147,115
   *   ∠P / ∠Q: same geometry, x+175
   */
  <svg viewBox="0 0 360 160" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="360" height="160" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Parallelogram 1: A(30,130) B(150,130) C(130,40) D(10,40) ── */}
    <polygon points="30,130 150,130 130,40 10,40"
      fill="#f59e0b" fillOpacity="0.2" stroke="#fbbf24" strokeWidth="2.2" strokeLinejoin="round" />
    <text x="19"  y="148" fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="152" y="148" fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="132" y="36"  fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="-2"  y="36"  fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* AB double tick — midpoint (90,130), vertical, spacing 5 */}
    <line x1="87" y1="124" x2="87" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="93" y1="124" x2="93" y2="136" stroke="#facc15" strokeWidth="2.2" />
    {/* DC double tick — midpoint (70,40), vertical, spacing 5 */}
    <line x1="67" y1="34"  x2="67" y2="46"  stroke="#facc15" strokeWidth="2.2" />
    <line x1="73" y1="34"  x2="73" y2="46"  stroke="#facc15" strokeWidth="2.2" />
    {/* AD single tick — midpoint (20,85), perp=(0.976,−0.217), half-len=7 */}
    {/* (20−6.8, 85+1.5)→(20+6.8, 85−1.5) = (13,87)→(27,84) */}
    <line x1="13" y1="87" x2="27" y2="84" stroke="#22c55e" strokeWidth="2.2" />
    {/* BC single tick — midpoint (140,85) */}
    <line x1="133" y1="87" x2="147" y2="84" stroke="#22c55e" strokeWidth="2.2" />

    {/* ∠A arc — orange, CCW (sweep=0), r=15 */}
    <path d="M 45,130 A 15,15 0 0,0 27,115" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* ∠B arc — sky, CW (sweep=1), r=15 */}
    <path d="M 135,130 A 15,15 0 0,1 147,115" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

    {/* ≅ — centred between shape 1 right (≈142 at y=95) and shape 2 left (≈197 at y=95) */}
    <text x="170" y="95" textAnchor="middle" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Parallelogram 2: P(205,130) Q(325,130) R(305,40) S(185,40) ── */}
    <polygon points="205,130 325,130 305,40 185,40"
      fill="#f59e0b" fillOpacity="0.16" stroke="#fbbf24" strokeWidth="2.2" strokeLinejoin="round" />
    <text x="194" y="148" fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="327" y="148" fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="307" y="36"  fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="172" y="36"  fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">S</text>

    {/* PQ double tick — midpoint (265,130) */}
    <line x1="262" y1="124" x2="262" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="268" y1="124" x2="268" y2="136" stroke="#facc15" strokeWidth="2.2" />
    {/* SR double tick — midpoint (245,40) */}
    <line x1="242" y1="34"  x2="242" y2="46"  stroke="#facc15" strokeWidth="2.2" />
    <line x1="248" y1="34"  x2="248" y2="46"  stroke="#facc15" strokeWidth="2.2" />
    {/* PS single tick — midpoint (195,85) */}
    <line x1="188" y1="87" x2="202" y2="84" stroke="#22c55e" strokeWidth="2.2" />
    {/* QR single tick — midpoint (315,85) */}
    <line x1="308" y1="87" x2="322" y2="84" stroke="#22c55e" strokeWidth="2.2" />

    {/* ∠P arc — orange, CCW (sweep=0), r=15, x+175 from ∠A */}
    <path d="M 220,130 A 15,15 0 0,0 202,115" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* ∠Q arc — sky, CW (sweep=1), r=15, x+175 from ∠B */}
    <path d="M 310,130 A 15,15 0 0,1 322,115" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

    <text x="180" y="17" textAnchor="middle" fontSize="9.5" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua jajar genjang kongruen: 2 sisi + sudut sama</text>
  </svg>
);

const DiagramBelahKetupat = () => (
  /*
   * Rhombus 1: A(80,45) B(150,88) C(80,131) D(10,88)  center=(80,88)
   *   h-half=70, v-half=43  →  side=sqrt(70²+43²)=82.2
   *   unit_AB=(0.852,0.523)  perp_AB(CCW)=(-0.523,0.852)
   *   unit_BC=(-0.852,0.523) perp_BC(CCW)=(-0.523,-0.852)
   *
   * Ticks — single on all 4 sides, half-len=7, perpendicular to side:
   *   AB mid(115,66.5): (119,61)→(111,72)
   *   BC mid(115,109.5):(119,116)→(111,104)
   *   CD mid(45,109.5): (41,116)→(49,104)
   *   DA mid(45,66.5):  (41,61)→(49,72)
   *
   * Angle arcs r=14:
   *   ∠A (obtuse≈120°): start AB (92,52), end AD (68,52), sweep CW(1)
   *   ∠B (acute≈60°):   start BA (138,81), end BC (138,95), sweep CCW(0)
   *   ∠D (acute, =∠B):  start DA (22,81), end DC (22,95), sweep CW(1)
   *
   * Rhombus 2: offset x+175  A'(255,45) B'(325,88) C'(255,131) D'(185,88)
   */
  /* Rhombus 2 shifted x+195 (was x+175): 55px gap B(150)→D'(205). viewBox→360. ≅ at x=178. */
  <svg viewBox="0 0 360 170" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="360" height="170" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Rhombus 1: A(80,45) B(150,88) C(80,131) D(10,88) — violet ── */}
    <polygon points="80,45 150,88 80,131 10,88"
      fill="#8b5cf6" fillOpacity="0.22" stroke="#a78bfa" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="80"  cy="45"  r="3" fill="#a78bfa" />
    <circle cx="150" cy="88"  r="3" fill="#a78bfa" />
    <circle cx="80"  cy="131" r="3" fill="#a78bfa" />
    <circle cx="10"  cy="88"  r="3" fill="#a78bfa" />
    <text x="74"  y="40"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="153" y="93"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="74"  y="147" fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="0"   y="93"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* AB tick — mid(115,66.5) perp=(-0.523,0.852) half=7 */}
    <line x1="119" y1="61" x2="111" y2="72" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* BC tick — mid(115,109.5) */}
    <line x1="119" y1="116" x2="111" y2="104" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* CD tick — mid(45,109.5) */}
    <line x1="41"  y1="116" x2="49"  y2="104" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* DA tick — mid(45,66.5) */}
    <line x1="41"  y1="61"  x2="49"  y2="72"  stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />

    {/* ∠A — orange, obtuse, CW (sweep=1), r=14 */}
    <path d="M 92,52 A 14,14 0 0,1 68,52" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* ∠B — sky, acute, CCW (sweep=0), r=14 */}
    <path d="M 138,81 A 14,14 0 0,0 138,95" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    {/* ∠D — sky, acute, CW (sweep=1), r=14 (equal to ∠B) */}
    <path d="M 22,81 A 14,14 0 0,1 22,95" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

    {/* ≅ — centred at x=178, midpoint of B(150) and D'(205), gap ≈17px each side */}
    <text x="178" y="97" textAnchor="middle" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Rhombus 2: P(275,45) Q(345,88) R(275,131) S(205,88) — x+195 ── */}
    <polygon points="275,45 345,88 275,131 205,88"
      fill="#8b5cf6" fillOpacity="0.16" stroke="#a78bfa" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="275" cy="45"  r="3" fill="#a78bfa" />
    <circle cx="345" cy="88"  r="3" fill="#a78bfa" />
    <circle cx="275" cy="131" r="3" fill="#a78bfa" />
    <circle cx="205" cy="88"  r="3" fill="#a78bfa" />
    <text x="269" y="40"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="348" y="93"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="269" y="147" fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="190" y="93"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">S</text>

    {/* PQ tick — x+195 from AB tick */}
    <line x1="314" y1="61"  x2="306" y2="72"  stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* QR tick */}
    <line x1="314" y1="116" x2="306" y2="104" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* RS tick */}
    <line x1="236" y1="116" x2="244" y2="104" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* SP tick */}
    <line x1="236" y1="61"  x2="244" y2="72"  stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />

    {/* ∠P — orange, obtuse, CW (sweep=1) */}
    <path d="M 287,52 A 14,14 0 0,1 263,52" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* ∠Q — sky, acute, CCW (sweep=0) */}
    <path d="M 333,81 A 14,14 0 0,0 333,95" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    {/* ∠S — sky, acute, CW (sweep=1) */}
    <path d="M 217,81 A 14,14 0 0,1 217,95" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

    <text x="180" y="16" textAnchor="middle" fontSize="9.5" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua belah ketupat kongruen jika sisinya sama &amp; sudut apitnya sama</text>
  </svg>
);

const DiagramLayangLayang = () => (
  /*
   * Kite 1: A(80,20) B(22,88) C(80,170) D(138,88)   ← C moved down from y=155 to y=170
   *   AB=AD (top pair): dir AB=(-58,68)  |=89.4  unit=(-0.649,0.761)
   *   CB=CD (bot pair): dir CB=(-58,-82) |=100.4 unit=(-0.578,-0.817)
   *
   * Ticks (AB/AD unchanged; CB/CD recomputed for new C):
   *   AB single mid(51,54):   perp=(-0.761,-0.649) → (56,59)→(46,50)
   *   AD single mid(109,54):  perp=(-0.761, 0.649) → (114,50)→(104,59)
   *
   *   CB double mid(51,129): unit=(-0.578,-0.817), perp=(0.817,-0.578), half=6.5
   *     c1=mid-2·unit=(52.2,130.6): (47,134)→(58,127)
   *     c2=mid+2·unit=(49.8,127.4): (45,131)→(55,124)
   *
   *   CD double mid(109,129): unit=(-0.578,0.817), perp=(-0.817,-0.578)
   *     c1=mid-2·unit=(110.2,127.4): (116,131)→(105,124)
   *     c2=mid+2·unit=(107.8,130.6): (113,134)→(103,127)
   *
   * Angle arcs r=14 at ∠B and ∠D (unchanged):
   *   ∠B at B(22,88):  start BA (31,77), end BC (31,99), sweep CW(1)
   *   ∠D at D(138,88): start DA (129,77), end DC (129,99), sweep CCW(0)
   *
   * Kite 2: offset x+175  A'(255,20) B'(197,88) C'(255,170) D'(313,88)
   */
  <svg viewBox="0 0 340 212" className="w-full max-w-sm mx-auto mt-4">
    <rect x="0" y="0" width="340" height="212" rx="10" fill="#0f172a" fillOpacity="0.5" />

    <text x="170" y="16" textAnchor="middle" fontSize="9.5" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua layang-layang kongruen jika semua sisi &amp; sudut bersesuaian sama</text>

    <g transform="translate(0,20)">
      {/* ── Kite 1: A(80,20) B(22,88) C(80,170) D(138,88) — rose ── */}
      <polygon points="80,20 22,88 80,170 138,88"
        fill="#f43f5e" fillOpacity="0.2" stroke="#fb7185" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="80"  cy="20"  r="3" fill="#fb7185" />
      <circle cx="22"  cy="88"  r="3" fill="#fb7185" />
      <circle cx="80"  cy="170" r="3" fill="#fb7185" />
      <circle cx="138" cy="88"  r="3" fill="#fb7185" />
      <text x="74"  y="15"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">A</text>
      <text x="7"   y="93"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">B</text>
      <text x="74"  y="186" fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">C</text>
      <text x="141" y="93"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">D</text>

      {/* AB single tick */}
      <line x1="56" y1="59" x2="46" y2="50" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
      {/* AD single tick */}
      <line x1="114" y1="50" x2="104" y2="59" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />

      {/* CB double tick */}
      <line x1="47" y1="134" x2="58" y2="127" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="45" y1="131" x2="55" y2="124" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />

      {/* CD double tick */}
      <line x1="116" y1="131" x2="105" y2="124" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="113" y1="134" x2="103" y2="127" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />

      {/* ∠B — orange, CW */}
      <path d="M 31,77 A 14,14 0 0,1 31,99" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
      {/* ∠D — orange, CCW */}
      <path d="M 129,77 A 14,14 0 0,0 129,99" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />

      {/* ≅ */}
      <text x="167" y="97" textAnchor="middle" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

      {/* ── Kite 2: A'(255,20) B'(197,88) C'(255,170) D'(313,88) — x+175 ── */}
      <polygon points="255,20 197,88 255,170 313,88"
        fill="#f43f5e" fillOpacity="0.15" stroke="#fb7185" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="255" cy="20"  r="3" fill="#fb7185" />
      <circle cx="197" cy="88"  r="3" fill="#fb7185" />
      <circle cx="255" cy="170" r="3" fill="#fb7185" />
      <circle cx="313" cy="88"  r="3" fill="#fb7185" />
      <text x="249" y="15"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">P</text>
      <text x="182" y="93"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">Q</text>
      <text x="249" y="186" fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">R</text>
      <text x="316" y="93"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">S</text>

      {/* PQ single tick */}
      <line x1="231" y1="59" x2="221" y2="50" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
      {/* PS single tick */}
      <line x1="289" y1="50" x2="279" y2="59" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />

      {/* RQ double tick */}
      <line x1="222" y1="134" x2="233" y2="127" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="220" y1="131" x2="230" y2="124" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
      {/* RS double tick */}
      <line x1="291" y1="131" x2="280" y2="124" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="288" y1="134" x2="278" y2="127" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />

      {/* ∠Q — orange, CW */}
      <path d="M 206,77 A 14,14 0 0,1 206,99" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
      {/* ∠S — orange, CCW */}
      <path d="M 304,77 A 14,14 0 0,0 304,99" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

const DiagramLingkaran = () => (
  <svg viewBox="0 0 320 150" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="320" height="150" rx="10" fill="#0f172a" fillOpacity="0.5" />
    {/* Circle 1 */}
    <circle cx="80" cy="78" r="52" fill="#ec4899" fillOpacity="0.15" stroke="#f472b6" strokeWidth="2.2" />
    <line x1="80" y1="78" x2="132" y2="78" stroke="#f472b6" strokeWidth="1.8" strokeDasharray="4 3" />
    <circle cx="80" cy="78" r="2.5" fill="#f472b6" />
    <text x="90" y="73" fontSize="10" fill="#fde68a" fontFamily="sans-serif">r</text>
    <text x="70" y="140" fontSize="11" fill="#f9a8d4" fontWeight="bold" fontFamily="sans-serif">Lingkaran 1</text>

    {/* ≅ */}
    <text x="152" y="88" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* Circle 2 */}
    <circle cx="242" cy="78" r="52" fill="#ec4899" fillOpacity="0.12" stroke="#f472b6" strokeWidth="2.2" />
    <line x1="242" y1="78" x2="294" y2="78" stroke="#f472b6" strokeWidth="1.8" strokeDasharray="4 3" />
    <circle cx="242" cy="78" r="2.5" fill="#f472b6" />
    <text x="252" y="73" fontSize="10" fill="#fde68a" fontFamily="sans-serif">r</text>
    <text x="232" y="140" fontSize="11" fill="#f9a8d4" fontWeight="bold" fontFamily="sans-serif">Lingkaran 2</text>

    <text x="160" y="17" textAnchor="middle" fontSize="10" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua lingkaran kongruen jika jari-jarinya sama</text>
  </svg>
);

const DiagramTrapesium = () => (
  /*
   * Trapezoid 1: A(15,130) B(155,130) C(125,45) D(45,45)
   * Trapezoid 2: P(200,130) Q(340,130) R(310,45) S(230,45)  (offset x+185)
   *
   * Ticks (cross edge ±6 px, perpendicular to each side):
   *
   *   AB (bottom, horizontal, len=140): triple tick centred at x=85, y=130, spacing 5
   *     → x=80,85,90  y=124→136
   *   DC (top, horizontal, len=80): single tick centred at x=85, y=45
   *     → x=85, y=39→51
   *
   *   AD (left leg): A(15,130)→D(45,45), dir=(30,−85), |=90.1
   *     unit=(0.333,−0.943), perp=(0.943,0.333)
   *     midpoint=(30,87.5)
   *     double tick — two lines, spacing 4 along unit, half-len=6:
   *       c1 = mid − 2·unit = (29.3, 89.4)
   *       c2 = mid + 2·unit = (30.7, 85.6)
   *       line1: c1 ± 6·perp = (23.7,87.4)→(35.0,91.4) → (24,87)→(35,91)
   *       line2: c2 ± 6·perp = (25.0,83.6)→(36.4,87.6) → (25,84)→(36,88)
   *
   *   BC (right leg): B(155,130)→C(125,45), dir=(−30,−85), |=90.1
   *     unit=(−0.333,−0.943), perp=(0.943,−0.333)
   *     midpoint=(140,87.5)
   *       c1 = (140.7,89.4)  c2 = (139.3,85.6)
   *       line1: (135.0,91.4)→(146.3,87.4) → (135,91)→(146,87)
   *       line2: (133.6,87.6)→(145.0,83.6) → (134,88)→(145,84)
   *
   *   Trapezoid 2 is same geometry x+185.
   */
  <svg viewBox="0 0 360 165" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="360" height="165" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Trapezoid 1: A(15,130) B(155,130) C(125,45) D(45,45) ── */}
    <polygon points="15,130 155,130 125,45 45,45"
      fill="#14b8a6" fillOpacity="0.2" stroke="#2dd4bf" strokeWidth="2.2" strokeLinejoin="round" />
    <text x="3"   y="147" fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="158" y="147" fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="127" y="40"  fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="33"  y="40"  fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* AB — triple tick, centred at (85,130), spacing 5, crossing ±6 */}
    <line x1="80" y1="124" x2="80" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="85" y1="124" x2="85" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="90" y1="124" x2="90" y2="136" stroke="#facc15" strokeWidth="2.2" />

    {/* DC — single tick, centred at (85,45), crossing ±6 */}
    <line x1="85" y1="39" x2="85" y2="51" stroke="#f97316" strokeWidth="2.2" />

    {/* AD — double tick, perpendicular, midpoint (30,87.5) */}
    <line x1="24" y1="87" x2="35" y2="91" stroke="#22c55e" strokeWidth="2.2" />
    <line x1="25" y1="84" x2="36" y2="88" stroke="#22c55e" strokeWidth="2.2" />

    {/* BC — double tick, perpendicular, midpoint (140,87.5) */}
    <line x1="135" y1="91" x2="146" y2="87" stroke="#22c55e" strokeWidth="2.2" />
    <line x1="134" y1="88" x2="145" y2="84" stroke="#22c55e" strokeWidth="2.2" />

    {/* ≅ */}
    <text x="183" y="100" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Trapezoid 2: P(200,130) Q(340,130) R(310,45) S(230,45) ── */}
    <polygon points="200,130 340,130 310,45 230,45"
      fill="#14b8a6" fillOpacity="0.15" stroke="#2dd4bf" strokeWidth="2.2" strokeLinejoin="round" />
    <text x="188" y="147" fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="343" y="147" fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="312" y="40"  fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="218" y="40"  fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">S</text>

    {/* PQ — triple tick, centred at (270,130) */}
    <line x1="265" y1="124" x2="265" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="270" y1="124" x2="270" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="275" y1="124" x2="275" y2="136" stroke="#facc15" strokeWidth="2.2" />

    {/* SR — single tick, centred at (270,45) */}
    <line x1="270" y1="39" x2="270" y2="51" stroke="#f97316" strokeWidth="2.2" />

    {/* PS — double tick, perpendicular, midpoint (215,87.5)  [x+185 from AD] */}
    <line x1="209" y1="87" x2="220" y2="91" stroke="#22c55e" strokeWidth="2.2" />
    <line x1="210" y1="84" x2="221" y2="88" stroke="#22c55e" strokeWidth="2.2" />

    {/* QR — double tick, perpendicular, midpoint (325,87.5) [x+185 from BC] */}
    <line x1="320" y1="91" x2="331" y2="87" stroke="#22c55e" strokeWidth="2.2" />
    <line x1="319" y1="88" x2="330" y2="84" stroke="#22c55e" strokeWidth="2.2" />

    <text x="180" y="17" textAnchor="middle" fontSize="9.5" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua trapesium kongruen: semua sisi &amp; sudut bersesuaian sama</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────────────────────── */

const KekongruenBangunDatarPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] ?? translations.id;
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep1", "konsep2", "bangunLain", "contoh1",
  ]);
  const toggleSection = (s: string) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const Header = ({
    id, icon, color, label,
  }: {
    id: string; icon: React.ReactNode; color: string; label: string;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span style={{ color }}>{icon}</span>
        <span className="font-body font-semibold text-white">{label}</span>
      </div>
      {true
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t.pageSub}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label={t.sec_intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.intro_p1} <strong className="text-cyan-300">{t.intro_k1}</strong> {t.intro_p1b}{" "}
                  <em>{t.intro_em}</em> {t.intro_p1c}{" "}
                  <strong className="text-yellow-300">{t.intro_k2}</strong>{t.intro_p1d}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.intro_formal}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.intro_f1} <InlineMath math="F_1" /> {t.intro_f2} <InlineMath math="F_2" /> {t.intro_f3}{" "}
                    (<InlineMath math="F_1 \cong F_2" />) {t.intro_f3b}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1 font-body text-sm text-white/80">
                    <p>{t.intro_c1} <strong className="text-green-300">{t.intro_c1b}</strong></p>
                    <p>{t.intro_c2} <strong className="text-blue-300">{t.intro_c2b}</strong></p>
                  </div>
                  <p className="font-body text-xs text-white/60 italic">{t.intro_note}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── SIFAT SEGITIGA ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label={t.sec_konsep1} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{t.k1_summary}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.k1_p1} <InlineMath math="\triangle ABC \cong \triangle PQR" /> {t.k1_p1b}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="font-body text-xs font-semibold text-green-300 mb-1">{t.k1_rusuk}</p>
                      <BlockMath math="AB = PQ, \quad BC = QR, \quad CA = RP" />
                    </div>
                    <div>
                      <p className="font-body text-xs font-semibold text-blue-300 mb-1">{t.k1_sudut}</p>
                      <BlockMath math="\angle A = \angle P, \quad \angle B = \angle Q, \quad \angle C = \angle R" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">{t.k1_diag_label}</p>
                  <figure>
                    <DragCongruenceDemo shape="triangle" leftLabels={["A","B","C"]} rightLabels={["P","Q","R"]} angleMarks={["○","×","y"]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig1}</figcaption>
                  </figure>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>⚠️ {t.k1_warn}</strong>{" "}
                    <InlineMath math="\triangle ABC \cong \triangle PQR" /> {t.k1_warn2}{" "}
                    <InlineMath math="AB = PQ" /> {t.k1_warn3} <InlineMath math="AB = PR" />{t.k1_warn3b}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SYARAT SEGITIGA ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep2" icon={<Target className="w-5 h-5" />} color="#c084fc" label={t.sec_konsep2} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-purple-300">{t.k2_summary}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.k2_p1} <strong>{t.k2_p1b}</strong> {t.k2_p1c}
                  </p>
                </div>

                {/* SSS / RRR */}
                <div className="bg-slate-800/60 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{t.k2_rrr}</p>
                  <figure>
                    <DragCongruenceDemo shape="triangle" leftLabels={["A","B","C"]} rightLabels={["P","Q","R"]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig2}</figcaption>
                  </figure>
                  <p className="font-body text-sm text-white/80">{t.k2_rrr_p}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="AB=PQ,\; BC=QR,\; CA=RP \Rightarrow \triangle ABC \cong \triangle PQR" />
                  </div>
                </div>

                {/* SAS / RAR */}
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">{t.k2_rar}</p>
                  <figure>
                    <DragCongruenceDemo shape="triangle" leftLabels={["A","B","C"]} rightLabels={["P","Q","R"]} angleMarks={["○"]} hideTicks={[2]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig3}</figcaption>
                  </figure>
                  <p className="font-body text-sm text-white/80">
                    {t.k2_rar_p} <strong>{t.k2_rar_pb}</strong> {t.k2_rar_pc}
                  </p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="AB=PQ,\; \angle A=\angle P,\; AC=PR \Rightarrow \triangle ABC \cong \triangle PQR" />
                  </div>
                </div>

                {/* ASA / ARA / AAR */}
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.k2_ara}</p>
                  <figure>
                    <DragCongruenceDemo shape="triangle" leftLabels={["A","B","C"]} rightLabels={["P","Q","R"]} angleMarks={["","×","y"]} hideTicks={[0,2]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig4}</figcaption>
                  </figure>
                  <p className="font-body text-sm text-white/80">{t.k2_ara_p}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\angle A=\angle P,\; AB=PQ,\; \angle B=\angle Q \Rightarrow \triangle ABC \cong \triangle PQR" />
                  </div>
                </div>

                {/* Tabel ringkasan */}
                <div className="bg-slate-900/60 border border-slate-600/40 rounded-lg p-4 overflow-x-auto">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.tbl2_title}</p>
                  <table className="w-full font-body text-xs text-white/80">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 pr-3 text-cyan-300">{t.tbl2_h1}</th>
                        <th className="text-left py-2 pr-3 text-cyan-300">{t.tbl2_h2}</th>
                        <th className="text-left py-2 text-cyan-300">{t.tbl2_h3}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      <tr><td className="py-2 pr-3 text-green-300 font-bold">{t.tbl2_code_rrr}</td><td className="py-2 pr-3">{t.tbl2_rrr_s}</td><td className="py-2">{t.tbl2_rrr_e}</td></tr>
                      <tr><td className="py-2 pr-3 text-purple-300 font-bold">{t.tbl2_code_rar}</td><td className="py-2 pr-3">{t.tbl2_rar_s}</td><td className="py-2">{t.tbl2_rar_e}</td></tr>
                      <tr><td className="py-2 pr-3 text-cyan-300 font-bold">{t.tbl2_code_ara}</td><td className="py-2 pr-3">{t.tbl2_ara_s}</td><td className="py-2">{t.tbl2_ara_e}</td></tr>
                      <tr><td className="py-2 pr-3 text-yellow-300 font-bold">{t.tbl2_code_aar}</td><td className="py-2 pr-3">{t.tbl2_aar_s}</td><td className="py-2">{t.tbl2_aar_e}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── KEKONGRUENAN BANGUN SELAIN SEGITIGA ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="bangunLain" icon={<Shapes className="w-5 h-5" />} color="#38bdf8" label={t.sec_bangunLain} />
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-sky-200">
                    {t.k3_intro}{" "}
                    <strong className="text-yellow-300">{t.k3_intro_k}</strong>
                  </p>
                </div>

                {/* Persegi */}
                <div className="bg-slate-800/60 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">{t.k3_s1}</p>
                  <figure>
                    <DragCongruenceDemo shape="square" leftLabels={["A","B","C","D"]} rightLabels={["P","Q","R","S"]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig5}</figcaption>
                  </figure>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-blue-200">{t.k3_s1_cond_title}</p>
                    <p>{t.k3_s1_cond} <strong className="text-yellow-300">{t.k3_s1_cond_k}</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1 text-center">
                      <span className="font-body text-sm text-white/80 italic">{t.k3_s1_squareName}</span>{" "}
                      <InlineMath math="ABCD \cong" />{" "}
                      <span className="font-body text-sm text-white/80 italic">{t.k3_s1_squareName}</span>{" "}
                      <InlineMath math="PQRS \iff AB = PQ" />
                    </div>
                    <p className="text-xs text-white/60 italic">{t.k3_s1_note}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-blue-300">{t.k3_s1_prop_title}</p>
                    <p>✅ <InlineMath math="AB = BC = CD = DA = PQ = QR = RS = SP" /></p>
                    <p>✅ <InlineMath math="\angle A = \angle B = \angle C = \angle D = \angle P = \angle Q = \angle R = \angle S = 90°" /></p>
                  </div>
                </div>

                {/* Persegi Panjang */}
                <div className="bg-slate-800/60 border border-sky-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-sky-300">{t.k3_s2}</p>
                  <figure>
                    <DragCongruenceDemo shape="rectangle" leftLabels={["A","B","C","D"]} rightLabels={["P","Q","R","S"]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig6}</figcaption>
                  </figure>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-sky-200">{t.k3_s2_cond_title}</p>
                    <p>
                      {t.k3_s2_cond}{" "}
                      <strong className="text-yellow-300">
                        {t.k3_s2_cond_k}<InlineMath math="p" />{t.k3_s2_cond_kb}<InlineMath math="l" />{t.k3_s2_cond_kc}
                      </strong>.
                    </p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="ABCD \cong PQRS \iff AB = PQ,\; BC = QR" />
                    </div>
                    <p className="text-xs text-white/60 italic">{t.k3_s2_note}</p>
                  </div>
                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-sky-300">{t.k3_s2_ex_title}</p>
                    <p>{t.k3_s2_ex1} <strong className="text-yellow-300">≅</strong> {t.k3_s2_ex1b}</p>
                    <p>{t.k3_s2_ex2} <strong className="text-red-400">≇</strong> {t.k3_s2_ex2b}{" "}
                      <span className="text-xs text-white/50 ml-1">{t.k3_s2_ex2c}</span>
                    </p>
                  </div>
                </div>

                {/* Jajar Genjang */}
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-yellow-300">{t.k3_s3}</p>
                  <figure>
                    <DragCongruenceDemo shape="parallelogram" leftLabels={["A","B","C","D"]} rightLabels={["P","Q","R","S"]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig7}</figcaption>
                  </figure>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-yellow-200">{t.k3_s3_cond_title}</p>
                    <p>{t.k3_s3_cond} <strong className="text-yellow-300">{t.k3_s3_cond_k}</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="ABCD \cong PQRS \iff AB=PQ,\; BC=QR,\; \angle A=\angle P" />
                    </div>
                    <p className="text-xs text-white/60 italic">{t.k3_s3_note}</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-yellow-300">{t.k3_s3_prop_title}</p>
                    <p>✅ <InlineMath math="AB = CD = PQ = RS" /> {t.k3_s3_and} <InlineMath math="BC = AD = QR = PS" /></p>
                    <p>✅ <InlineMath math="\angle A = \angle C = \angle P = \angle R" /> {t.k3_s3_opp_angles}</p>
                    <p>✅ <InlineMath math="\angle A + \angle B = 180°" /> {t.k3_s3_adj_angles}</p>
                  </div>
                </div>

                {/* Trapesium */}
                <div className="bg-slate-800/60 border border-teal-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-teal-300">{t.k3_s4}</p>
                  <figure>
                    <DragCongruenceDemo shape="trapezoid" leftLabels={["A","B","C","D"]} rightLabels={["P","Q","R","S"]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig8}</figcaption>
                  </figure>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-teal-200">{t.k3_s4_cond_title}</p>
                    <p>{t.k3_s4_cond} <strong className="text-yellow-300">{t.k3_s4_cond_k}</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="ABCD \cong PQRS \iff AB=PQ,\; BC=QR,\; CD=RS,\; DA=SP" />
                      <BlockMath math="\angle A=\angle P,\; \angle B=\angle Q,\; \angle C=\angle R,\; \angle D=\angle S" />
                    </div>
                  </div>
                  <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 font-body text-sm text-white/80">
                    <p className="font-semibold text-teal-300 mb-1">{t.k3_s4_iso_title}</p>
                    <p>{t.k3_s4_iso_p}</p>
                    <div className="mt-2">
                      <BlockMath math="BC = AD = QR = PS" />
                      <p className="text-xs text-white/60 italic text-center font-body mt-1">{t.k3_s4_legs}</p>
                    </div>
                  </div>
                </div>

                {/* Belah Ketupat */}
                <div className="bg-slate-800/60 border border-violet-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-violet-300">{t.k3_s5}</p>
                  <figure>
                    <DragCongruenceDemo shape="rhombus" leftLabels={["A","B","C","D"]} rightLabels={["P","Q","R","S"]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig9}</figcaption>
                  </figure>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-violet-200">{t.k3_s5_cond_title}</p>
                    <p>{t.k3_s5_cond} <strong className="text-yellow-300">{t.k3_s5_cond_k}</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="ABCD \cong PQRS \iff AB = PQ,\; \angle A = \angle P" />
                    </div>
                    <p className="text-xs text-white/60 italic">{t.k3_s5_note}</p>
                  </div>
                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-violet-300">{t.k3_s5_prop_title}</p>
                    <p>{t.k3_s5_p1} <InlineMath math="AB = BC = CD = DA = PQ = QR = RS = SP" /> {t.k3_s5_p2}</p>
                    <p>{t.k3_s5_p1} <InlineMath math="\angle A = \angle C" /> {t.k3_s5_p3} <InlineMath math="\angle B = \angle D" /> {t.k3_s5_p4}</p>
                    <p>{t.k3_s5_p5}</p>
                  </div>
                </div>

                {/* Layang-layang */}
                <div className="bg-slate-800/60 border border-rose-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-rose-300">{t.k3_s6}</p>
                  <figure>
                    <DragCongruenceDemo shape="kite" leftLabels={["A","B","C","D"]} rightLabels={["P","Q","R","S"]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig10}</figcaption>
                  </figure>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-rose-200">{t.k3_s6_cond_title}</p>
                    <p>{t.k3_s6_cond} <strong className="text-yellow-300">{t.k3_s6_cond_k}</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="ABCD \cong PQRS \iff AB=PQ,\; AD=PS,\; CB=QR,\; CD=RS" />
                      <BlockMath math="\angle B = \angle Q" />
                      <p className="text-xs text-white/60 italic text-center font-body mt-1">{t.k3_s6_ang_note}</p>
                    </div>
                  </div>
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-rose-300">{t.k3_s6_prop_title}</p>
                    <p>{t.k3_s6_p1} <InlineMath math="AB = AD" /> {t.k3_s6_p1b} <InlineMath math="CB = CD" /> {t.k3_s6_p1c}</p>
                    <p>{t.k3_s6_p2} <InlineMath math="\angle B = \angle D" /> {t.k3_s6_p2b}</p>
                    <p>{t.k3_s6_p3}</p>
                  </div>
                </div>

                {/* Lingkaran */}
                <div className="bg-slate-800/60 border border-pink-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-pink-300">{t.k3_s7}</p>
                  <figure>
                    <DragCongruenceDemo shape="circle" leftLabels={["O₁"]} rightLabels={["O₂"]} />
                    <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig11}</figcaption>
                  </figure>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-pink-200">{t.k3_s7_cond_title}</p>
                    <p>{t.k3_s7_cond} <strong className="text-yellow-300">{t.k3_s7_cond_k}</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1 text-center">
                      <span className="font-body text-sm text-white/80">{t.k3_s7_circle1}</span>{" "}
                      <InlineMath math="\cong" />{" "}
                      <span className="font-body text-sm text-white/80">{t.k3_s7_circle2}</span>{" "}
                      <InlineMath math="\iff r_1 = r_2" />
                    </div>
                    <p className="text-xs text-white/60 italic">{t.k3_s7_note}</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-pink-300">{t.k3_s7_prop_title}</p>
                    <p>{t.k3_s7_p1} <InlineMath math="K_1 = 2\pi r_1 = 2\pi r_2 = K_2" /></p>
                    <p>{t.k3_s7_p2} <InlineMath math="A_1 = \pi r_1^2 = \pi r_2^2 = A_2" /></p>
                  </div>
                </div>

                {/* Tabel umum */}
                <div className="bg-slate-900/60 border border-slate-600/40 rounded-lg p-4 overflow-x-auto">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.tbl3_title}</p>
                  <table className="w-full font-body text-xs text-white/80">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 pr-2 text-cyan-300">{t.tbl3_h1}</th>
                        <th className="text-left py-2 text-cyan-300">{t.tbl3_h2}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      <tr><td className="py-2 pr-2 text-green-300 font-semibold">{t.tbl3_r1n}</td><td className="py-2">{t.tbl3_r1v}</td></tr>
                      <tr><td className="py-2 pr-2 text-blue-300 font-semibold">{t.tbl3_r2n}</td><td className="py-2">{t.tbl3_r2v}</td></tr>
                      <tr><td className="py-2 pr-2 text-sky-300 font-semibold">{t.tbl3_r3n}</td><td className="py-2">{t.tbl3_r3v}</td></tr>
                      <tr><td className="py-2 pr-2 text-yellow-300 font-semibold">{t.tbl3_r4n}</td><td className="py-2">{t.tbl3_r4v}</td></tr>
                      <tr><td className="py-2 pr-2 text-teal-300 font-semibold">{t.tbl3_r5n}</td><td className="py-2">{t.tbl3_r5v}</td></tr>
                      <tr><td className="py-2 pr-2 text-pink-300 font-semibold">{t.tbl3_r6n}</td><td className="py-2">{t.tbl3_r6v}</td></tr>
                      <tr><td className="py-2 pr-2 text-orange-300 font-semibold">{t.tbl3_r7n}</td><td className="py-2">{t.tbl3_r7v}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label={t.sec_contoh} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badge_mudah}</span>
                    <span className="font-body font-semibold text-white">{t.c1_title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">{t.c1_q}</p>
                    <figure>
                      <svg viewBox="0 0 280 275" className="w-full max-w-xs mx-auto">
                        <line x1="35" y1="135" x2="240" y2="18"  stroke="#facc15" strokeWidth="1.6" />
                        <line x1="35" y1="135" x2="240" y2="257" stroke="#facc15" strokeWidth="1.6" />
                        <line x1="35" y1="135" x2="149" y2="136" stroke="#facc15" strokeWidth="1.6" />
                        <line x1="115" y1="83"  x2="149" y2="136" stroke="#facc15" strokeWidth="1.6" />
                        <line x1="149" y1="136" x2="120" y2="183" stroke="#facc15" strokeWidth="1.6" />
                        <line x1="240" y1="18"  x2="149" y2="136" stroke="#facc15" strokeWidth="1.6" />
                        <line x1="240" y1="257" x2="149" y2="136" stroke="#facc15" strokeWidth="1.6" />
                        <polyline points="121,80 125,86 119,89" fill="none" stroke="#facc15" strokeWidth="1.4" strokeLinejoin="miter" />
                        <polyline points="126,187 130,181 124,177" fill="none" stroke="#facc15" strokeWidth="1.4" strokeLinejoin="miter" />
                        <circle cx="35"  cy="135" r="3" fill="#facc15" />
                        <circle cx="115" cy="83"  r="3" fill="#facc15" />
                        <circle cx="149" cy="136" r="3" fill="#facc15" />
                        <circle cx="120" cy="183" r="3" fill="#facc15" />
                        <circle cx="240" cy="18"  r="3" fill="#facc15" />
                        <circle cx="240" cy="257" r="3" fill="#facc15" />
                        <text x="16"  y="140" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">P</text>
                        <text x="108" y="74"  fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">T</text>
                        <text x="153" y="132" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">U</text>
                        <text x="112" y="200" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">S</text>
                        <text x="245" y="22"  fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">R</text>
                        <text x="245" y="263" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">Q</text>
                      </svg>
                      <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig12}</figcaption>
                    </figure>
                    <p className="font-body text-sm text-white">{t.c1_q2}</p>
                    <div className="grid grid-cols-2 gap-2 font-body text-sm text-white/90">
                      <p>A. &nbsp;8</p><p>C. &nbsp;4</p>
                      <p>B. &nbsp;6</p><p>D. &nbsp;3</p>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.c1_discuss_title}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.c1_discuss_intro}</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>① <InlineMath math="\triangle PTU" /> — {t.c1_t1} (<InlineMath math="\angle PTU = 90°" />)</p>
                        <p>② <InlineMath math="\triangle PSU" /> — {t.c1_t2} (<InlineMath math="\angle PSU = 90°" />)</p>
                        <p>③ <InlineMath math="\triangle TUS" /> — {t.c1_t3}</p>
                      </div>
                      <p>{t.c1_discuss_p}</p>
                      <p><strong className="text-green-300">{t.c1_answer}</strong></p>
                    </div>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badge_sedang}</span>
                    <span className="font-body font-semibold text-white">{t.c2_title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">
                      {t.c2_q} <InlineMath math="BC = CD" />. <InlineMath math="\triangle CDA \cong \triangle CBE" /> {t.c2_q2}
                    </p>
                    <figure>
                      <svg viewBox="0 0 260 250" className="w-full max-w-xs mx-auto">
                        <line x1="20"  y1="220" x2="220" y2="220" stroke="#facc15" strokeWidth="1.6" />
                        <line x1="120" y1="20"  x2="120" y2="220" stroke="#facc15" strokeWidth="1.6" />
                        <line x1="120" y1="20"  x2="220" y2="220" stroke="#facc15" strokeWidth="1.6" />
                        <line x1="20"  y1="220" x2="180" y2="140" stroke="#facc15" strokeWidth="1.6" />
                        <polyline points="120,212 112,212 112,220" fill="none" stroke="#facc15" strokeWidth="1.4" strokeLinejoin="miter" />
                        <polyline points="183,146 177,149 174,143" fill="none" stroke="#facc15" strokeWidth="1.4" strokeLinejoin="miter" />
                        <circle cx="20"  cy="220" r="3" fill="#facc15" />
                        <circle cx="120" cy="220" r="3" fill="#facc15" />
                        <circle cx="220" cy="220" r="3" fill="#facc15" />
                        <circle cx="120" cy="20"  r="3" fill="#facc15" />
                        <circle cx="180" cy="140" r="3" fill="#facc15" />
                        <circle cx="120" cy="170" r="3" fill="#facc15" />
                        <text x="10"  y="238" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">A</text>
                        <text x="114" y="238" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">B</text>
                        <text x="224" y="238" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">C</text>
                        <text x="124" y="16"  fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">E</text>
                        <text x="185" y="137" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">D</text>
                        <text x="124" y="168" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">F</text>
                      </svg>
                      <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig13}</figcaption>
                    </figure>
                    <div className="grid grid-cols-2 gap-2 font-body text-sm text-white/90">
                      <p>{t.c2_opt_a}</p><p>{t.c2_opt_c}</p>
                      <p>{t.c2_opt_b}</p><p>{t.c2_opt_d}</p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.c2_discuss_title}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.c2_discuss_intro} <InlineMath math="\triangle CDA" /> {t.c2_discuss_introb} <InlineMath math="\triangle CBE" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>① <InlineMath math="\angle DCA = \angle BCE" /> {t.c2_el1}</p>
                        <p>② <InlineMath math="CD = CB" /> ({t.c2_el2} <InlineMath math="BC = CD" />) {t.c2_el2b}</p>
                        <p>③ <InlineMath math="\angle CDA = \angle CBE = 90°" /> {t.c2_el3}</p>
                      </div>
                      <p>{t.c2_discuss_p} <strong className="text-yellow-300">{t.c2_discuss_pb}</strong></p>
                      <p><strong className="text-yellow-300">{t.c2_answer}</strong></p>
                    </div>
                  </div>
                </div>

                {/* SEDANG 2 */}
                <div className="border-l-4 border-orange-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded">{t.badge_sedang}</span>
                    <span className="font-body font-semibold text-white">{t.c3_title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">
                      {t.c3_q} <InlineMath math="\triangle ABC \cong \triangle PQR" />, {t.c3_q2} <InlineMath math="m" /> {t.c3_q3}
                    </p>
                    <figure>
                      <svg viewBox="0 0 270 195" className="w-full max-w-sm mx-auto">
                        <polygon points="20,165 120,165 55,25" fill="none" stroke="#facc15" strokeWidth="1.6" strokeLinejoin="round" />
                        <text x="12" y="103" fontSize="11" fill="#ffffff" fontFamily="serif" fontStyle="italic"
                          textAnchor="middle" transform="rotate(-57,12,103)">12 – m</text>
                        <path d="M 32,165 A 12,12 0 0,0 26,154" fill="none" stroke="#facc15" strokeWidth="1" />
                        <text x="33" y="158" fontSize="10" fill="#ffffff" fontFamily="serif">60°</text>
                        <path d="M 108,165 A 12,12 0 0,1 113,153" fill="none" stroke="#facc15" strokeWidth="1" />
                        <text x="85" y="158" fontSize="10" fill="#ffffff" fontFamily="serif">70°</text>
                        <text x="8"   y="180" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">A</text>
                        <text x="118" y="180" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">B</text>
                        <text x="48"  y="18"  fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">C</text>
                        <polygon points="148,165 242,165 196,30" fill="none" stroke="#facc15" strokeWidth="1.6" strokeLinejoin="round" />
                        <text x="163" y="105" fontSize="12" fill="#ffffff" fontFamily="serif" fontStyle="italic" textAnchor="middle">5</text>
                        <path d="M 160,165 A 12,12 0 0,0 154,154" fill="none" stroke="#facc15" strokeWidth="1" />
                        <text x="161" y="158" fontSize="10" fill="#ffffff" fontFamily="serif">60°</text>
                        <path d="M 188,42 A 12,12 0 0,1 204,42" fill="none" stroke="#facc15" strokeWidth="1" />
                        <text x="183" y="55"  fontSize="10" fill="#ffffff" fontFamily="serif">50°</text>
                        <text x="136" y="180" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">P</text>
                        <text x="240" y="180" fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">Q</text>
                        <text x="193" y="22"  fontSize="13" fill="#ffffff" fontWeight="bold" fontFamily="serif">R</text>
                      </svg>
                      <figcaption className="text-center text-xs text-white/50 italic mt-2 font-body">{t.fig14}</figcaption>
                    </figure>
                    <div className="grid grid-cols-2 gap-2 font-body text-sm text-white/90">
                      <p>A. &nbsp;4</p><p>C. &nbsp;6</p>
                      <p>B. &nbsp;5</p><p>D. &nbsp;7</p>
                    </div>
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-orange-400 mb-3">{t.c3_discuss_title}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.c3_discuss_intro} <InlineMath math="\triangle ABC \cong \triangle PQR" />{t.c3_discuss_introb}</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p><InlineMath math="A \leftrightarrow P,\quad B \leftrightarrow Q,\quad C \leftrightarrow R" /></p>
                        <p>{t.c3_el1}</p>
                        <p><InlineMath math="AC = PR \Rightarrow 12 - m = 5" /></p>
                        <p><InlineMath math="m = 12 - 5 = 7" /></p>
                      </div>
                      <p><strong className="text-orange-300">{t.c3_answer}</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── RANGKUMAN, TIPS & TRIK, KESIMPULAN ── */}
          <div className="space-y-4">

            {/* Rangkuman */}
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-xl p-5 space-y-4">
              <p className="font-body text-base font-bold text-purple-300">{t.rang_title}</p>
              <div className="overflow-x-auto">
                <table className="w-full font-body text-xs text-white/80">
                  <thead>
                    <tr className="border-b border-purple-500/30">
                      <th className="text-left py-2 pr-3 text-purple-300">{t.rang_h1}</th>
                      <th className="text-left py-2 pr-3 text-purple-300">{t.rang_h2}</th>
                      <th className="text-left py-2 text-purple-300">{t.rang_h3}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    <tr><td className="py-2 pr-3 text-blue-300 font-semibold">{t.rang_r1n}</td><td className="py-2 pr-3">{t.rang_r1v}</td><td className="py-2 text-yellow-300">{t.rang_r1e}</td></tr>
                    <tr><td className="py-2 pr-3 text-green-300 font-semibold">{t.rang_r2n}</td><td className="py-2 pr-3">{t.rang_r2v}</td><td className="py-2 text-yellow-300">{t.rang_r2e}</td></tr>
                    <tr><td className="py-2 pr-3 text-cyan-300 font-semibold">{t.rang_r3n}</td><td className="py-2 pr-3">{t.rang_r3v}</td><td className="py-2 text-yellow-300">{t.rang_r3e}</td></tr>
                    <tr><td className="py-2 pr-3 text-pink-300 font-semibold">{t.rang_r4n}</td><td className="py-2 pr-3">{t.rang_r4v}</td><td className="py-2 text-yellow-300">{t.rang_r4e}</td></tr>
                    <tr><td className="py-2 pr-3 text-orange-300 font-semibold">{t.rang_r5n}</td><td className="py-2 pr-3">{t.rang_r5v}</td><td className="py-2 text-yellow-300">{t.rang_r5e}</td></tr>
                    <tr><td className="py-2 pr-3 text-red-300 font-semibold">{t.rang_r6n}</td><td className="py-2 pr-3">{t.rang_r6v}</td><td className="py-2 text-yellow-300">{t.rang_r6e}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-900/60 rounded-lg p-3 space-y-1 font-body text-xs text-white/75">
                <p>📌 <strong className="text-purple-300">{t.rang_note1}</strong> {t.rang_note1b}</p>
                <p>📌 <strong className="text-purple-300">{t.rang_note2}</strong> <InlineMath math="\triangle ABC \cong \triangle PQR" /> {t.rang_note2b}</p>
                <p>📌 <strong className="text-purple-300">{t.rang_note3}</strong> {t.rang_note3b}</p>
              </div>
            </div>

            {/* Tips & Trik */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 space-y-3">
              <p className="font-body text-base font-bold text-amber-300">{t.tips_title}</p>
              <div className="space-y-3 font-body text-sm text-white/80">
                <div className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">①</span>
                  <p><strong className="text-amber-300">{t.tips_1t}</strong> {t.tips_1b}</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">②</span>
                  <div>
                    <p><strong className="text-amber-300">{t.tips_2t}</strong> {t.tips_2b} <InlineMath math="\triangle ABC \cong \triangle PQR" />{t.tips_2bb}</p>
                    <div className="bg-slate-900/50 rounded p-2 mt-1 text-xs font-mono text-center">
                      <p>A ↔ P &nbsp;|&nbsp; B ↔ Q &nbsp;|&nbsp; C ↔ R</p>
                      <p className="text-white/50 mt-1">AB=PQ &nbsp;|&nbsp; BC=QR &nbsp;|&nbsp; AC=PR</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">③</span>
                  <p><strong className="text-amber-300">{t.tips_3t}</strong> {t.tips_3b}</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">④</span>
                  <p><strong className="text-amber-300">{t.tips_4t}</strong> {t.tips_4b} <InlineMath math="AB = PQ" />{t.tips_4bb}</p>
                </div>
              </div>
            </div>

            {/* Kesimpulan */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 space-y-3">
              <p className="font-body text-base font-bold text-green-300">{t.conc_title}</p>
              <div className="space-y-2 font-body text-sm text-white/80">
                <p>{t.conc_p1} <strong className="text-yellow-300">{t.conc_p1k}</strong> {t.conc_p1b}</p>
                <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                  <p>{t.conc_l1} <strong className="text-cyan-300">{t.conc_l1k}</strong> {t.conc_l1b}</p>
                  <p>{t.conc_l2} <strong className="text-purple-300">{t.conc_l2k}</strong> {t.conc_l2b}</p>
                  <p>{t.conc_l3} <strong className="text-green-300">{t.conc_l3k}</strong></p>
                  <p>{t.conc_l4} <InlineMath math="k = 1" /></p>
                </div>
                <p className="text-xs text-white/55 italic">{t.conc_note}</p>
              </div>
            </div>

          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/kesebangunan-kekongruenan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KekongruenBangunDatarPage;
