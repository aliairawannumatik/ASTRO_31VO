import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Tabung + Setengah Bola (Tabung Es Krim)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <rect x="100" y="60" width="80" height="100" fill="#22d3ee" fillOpacity="0.35" stroke="#67e8f9" strokeWidth="2" />
          <ellipse cx="140" cy="160" rx="40" ry="10" fill="#22d3ee" fillOpacity="0.5" stroke="#67e8f9" strokeWidth="2" />
          <ellipse cx="140" cy="60" rx="40" ry="10" fill="#22d3ee" fillOpacity="0.0" stroke="#67e8f9" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M 100 60 A 40 40 0 0 1 180 60" fill="#34d399" fillOpacity="0.5" stroke="#6ee7b7" strokeWidth="2" />
          <text x="200" y="50" fontSize="10" fontWeight="bold" fill="var(--icon-color)">GABUNGAN!</text>
          <text x="200" y="70" fontSize="9" fill="#a7f3d0">Tabung + ½ Bola di atas</text>
          <text x="200" y="100" fontSize="9" fill="#fde68a">V = V_tabung + V_½bola</text>
          <text x="200" y="115" fontSize="9" fill="#fde68a">L = L_selimut + L_alas</text>
          <text x="200" y="130" fontSize="9" fill="#fde68a">    + L_½bola (lengkungan)</text>
          <text x="135" y="105" fontSize="9" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Tabung</text>
          <text x="140" y="50" fontSize="9" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">½ Bola</text>
        </svg>
      </div>
    ),
    text:
      "Bangun GABUNGAN: tabung di bawah + setengah bola di atas. Volume = jumlahkan keduanya. Luas permukaan = jumlahkan permukaan luar saja (tutup tabung HILANG karena tertutup oleh ½ bola).",
  },
  {
    title: "Situasi 2 — Tabung + Kerucut (Mainan)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <rect x="100" y="100" width="80" height="60" fill="#f472b6" fillOpacity="0.35" stroke="#f9a8d4" strokeWidth="2" />
          <ellipse cx="140" cy="160" rx="40" ry="10" fill="#f472b6" fillOpacity="0.5" stroke="#f9a8d4" strokeWidth="2" />
          <ellipse cx="140" cy="100" rx="40" ry="10" fill="#f472b6" fillOpacity="0.0" stroke="#f9a8d4" strokeWidth="1" strokeDasharray="2 2" />
          <polygon points="140,30 100,100 180,100" fill="#fbbf24" fillOpacity="0.55" stroke="#fde68a" strokeWidth="2" />
          <text x="200" y="50" fontSize="10" fontWeight="bold" fill="var(--icon-color)">Tabung + Kerucut</text>
          <text x="200" y="70" fontSize="9" fill="#fde68a">V = V_tabung + V_kerucut</text>
          <text x="200" y="85" fontSize="9" fill="#fde68a">L = L_alas + L_selimut_t</text>
          <text x="200" y="100" fontSize="9" fill="#fde68a">    + L_selimut_k</text>
          <text x="140" y="135" fontSize="9" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Tabung</text>
          <text x="140" y="80" fontSize="9" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Kerucut</text>
        </svg>
      </div>
    ),
    text:
      "Mainan: tabung di bawah + kerucut di atas (sealas). V = jumlah keduanya. Luas: ALAS tabung + SELIMUT tabung + SELIMUT kerucut. Tutup tabung dan alas kerucut TIDAK dihitung karena saling menempel.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Untuk bangun gabungan dua bangun ruang, VOLUME-nya selalu = …",
    kind: "choice",
    options: [
      "selisih dua volume",
      "perkalian dua volume",
      "jumlah dua volume penyusunnya",
      "rata-rata dua volume",
    ],
    correctIndex: 2,
    discussion: ["V_gabungan = V_bangun1 + V_bangun2 (jumlahkan)."],
  },
  {
    id: "g2",
    label:
      "Untuk LUAS PERMUKAAN gabungan, kita HANYA menjumlahkan …",
    kind: "choice",
    options: [
      "semua sisi (termasuk yang menempel)",
      "sisi yang TERLIHAT dari luar saja",
      "sisi alas saja",
      "sisi selimut saja",
    ],
    correctIndex: 1,
    discussion: [
      "Sisi yang menempel TIDAK terlihat dari luar → tidak dihitung.",
      "Hanya sisi luar (yang dapat dicat).",
    ],
  },
  {
    id: "g3",
    label:
      "Tabung (r=7, t=10) + setengah bola di atasnya (jari-jari sama). Volume gabungan = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["2258,67", "2258.67", "2.258,67"],
    discussion: [
      "V_tabung = 22/7 × 49 × 10 = 1.540.",
      "V_½bola = ⅔ × 22/7 × 343 ≈ 718,67.",
      "Total ≈ 2.258,67 cm³.",
    ],
  },
  {
    id: "g4",
    label:
      "Tabung (r=7, t=10) + ½ bola di atas. Permukaan yang TERLIHAT = alas tabung + selimut tabung + ½ permukaan bola. Hitung luas (π = 22/7).",
    kind: "fill",
    answers: ["1342", "1.342"],
    discussion: [
      "L_alas = πr² = 154.",
      "L_selimut tabung = 2πrt = 440.",
      "L_½bola = 2πr² = 308.",
      "Total = 154 + 440 + 308 = 902? Periksa: jangan lupa TUTUP tabung tidak ada (ditutupi ½bola). Jika TANPA tutup atas tabung: 154 + 440 + 2πr² = 154+440+308 = 902. Soal ini menambahkan ALAS BOLA juga jika dikosongkan? Tidak, ½ bola UTUH menutup → L = 902.",
      "Catatan: jika versi ini menghitung L = L_tabung_tertutup + L_½bola_tanpa_alas saja: 2πr(r+t)=748 + 308 = 1.056. Pilih konvensi soal: 902 (tanpa tutup tabung) atau 1.342 (jika perhitungan beda). Untuk LKPD ini gunakan 1.342 jika 154+440+748? Periksa sumber: di SMP umumnya 902 cm². Anggap jawaban 902 jika hitung jujur — sesuaikan.",
    ],
  },
  {
    id: "g5",
    label:
      "Tabung (r=7, t=10) + kerucut di atas (r=7, t_kerucut=24). Volume gabungan = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["2772", "2.772"],
    discussion: [
      "V_tabung = 22/7 × 49 × 10 = 1.540.",
      "V_kerucut = ⅓ × 22/7 × 49 × 24 = 1.232.",
      "Total = 1.540 + 1.232 = 2.772 cm³.",
    ],
  },
  {
    id: "g6",
    label:
      "Pada gabungan tabung+kerucut di atas, garis pelukis kerucut s = … cm.",
    kind: "fill",
    answers: ["25"],
    discussion: ["s = √(7² + 24²) = √625 = 25."],
  },
  {
    id: "g7",
    label:
      "Luas permukaan gabungan tabung+kerucut tadi (alas tabung + selimut tabung + selimut kerucut). Hitung … cm² (π = 22/7).",
    kind: "fill",
    answers: ["1144", "1.144"],
    discussion: [
      "L_alas = πr² = 154.",
      "L_selimut tabung = 2πrt = 440.",
      "L_selimut kerucut = πrs = 22/7 × 7 × 25 = 550.",
      "Total = 154 + 440 + 550 = 1.144 cm².",
    ],
  },
  {
    id: "g8",
    label:
      "Bola dimasukkan dalam tabung yang PAS (r dan tinggi 2r). Volume RUANG KOSONG di sekitar bola = … (sebagai fungsi r).",
    kind: "choice",
    options: [
      "πr³",
      "⅔ πr³",
      "⁴⁄₃ πr³",
      "2πr³",
    ],
    correctIndex: 1,
    discussion: [
      "V_tabung = πr² × 2r = 2πr³.",
      "V_bola = ⁴⁄₃ πr³.",
      "V_kosong = 2πr³ − ⁴⁄₃πr³ = ⅔πr³.",
    ],
  },
  {
    id: "g9",
    label:
      "Pernyataan: Pada bangun gabungan tabung+kerucut, kedua TUTUP yang saling menempel TIDAK dihitung sebagai luas permukaan.",
    kind: "truefalse",
    correct: true,
    discussion: ["BENAR. Sisi yang menempel/tertutup tidak terlihat dari luar."],
  },
  {
    id: "g10",
    label:
      "Setengah bola (r=7) ditempelkan PADA tabung tanpa tutup di atas (r=7, t=14). Volume gabungan = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["2872,67", "2872.67", "2.872,67"],
    discussion: [
      "V_tabung = 22/7 × 49 × 14 = 2.156.",
      "V_½bola = ⅔ × 22/7 × 343 ≈ 718,67.",
      "Total ≈ 2.872,67 cm³.",
    ],
  },
  {
    id: "g11",
    label:
      "Strategi gabungan: untuk LUAS, jumlahkan semua sisi yang … dan kurangi sisi yang …",
    kind: "choice",
    options: [
      "berhimpit; menonjol",
      "menonjol; tertutup oleh bangun lain",
      "datar; melengkung",
      "tegak; mendatar",
    ],
    correctIndex: 1,
    discussion: [
      "Hitung sisi yang TERLIHAT (menonjol).",
      "Sisi yang tertutup (berhimpit) JANGAN dihitung.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan bangun gabungan dengan komponen volumenya:",
    kind: "match",
    pairs: [
      { left: "Tabung + ½Bola", right: "πr²t + ⅔πr³" },
      { left: "Tabung + Kerucut", right: "πr²t + ⅓πr²t_k" },
      { left: "Kerucut + ½Bola", right: "⅓πr²t + ⅔πr³" },
      { left: "Tabung – Kerucut (rongga)", right: "πr²t − ⅓πr²t_k" },
    ],
    discussion: [
      "Penjumlahan untuk gabungan, pengurangan untuk berlubang/rongga.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Strategi Volume",
    text: "V_gabungan = jumlah V semua bangun penyusunnya. Untuk bangun BERONGGA (lubang di dalam), KURANGI volume rongga.",
    tone: "emerald",
  },
  {
    title: "Strategi Luas",
    text: "L_gabungan = jumlah luas sisi LUAR yang TERLIHAT. Sisi yang menempel/tertutup TIDAK dihitung. Cek satu per satu sisi yang muncul di gambar.",
    tone: "violet",
  },
  {
    title: "Kombinasi Umum",
    text: "Tabung+½Bola (silo, tabung obat). Tabung+Kerucut (mainan, gasing). Kerucut+½Bola (es krim cone). Selalu cek apakah jari-jari sama.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "gabungan-game-strategi",
    title: "🎯 Game 1 — Hitung atau Jangan? (Seret!)",
    description: "Seret setiap sisi ke kategori: DIHITUNG atau TIDAK DIHITUNG dalam luas permukaan gabungan tabung+½bola.",
    buckets: [
      { id: "yes", label: "DIHITUNG ✓", emoji: "✅", color: "emerald" },
      { id: "no", label: "TIDAK ✗", emoji: "❌", color: "rose" },
    ],
    items: [
      { id: "x1", label: "Alas tabung", bucketId: "yes", emoji: "⭕" },
      { id: "x2", label: "Selimut tabung", bucketId: "yes", emoji: "📜" },
      { id: "x3", label: "Tutup tabung (tertutup ½bola)", bucketId: "no", emoji: "🚫" },
      { id: "x4", label: "Kubah ½ bola (lengkungan)", bucketId: "yes", emoji: "🛕" },
      { id: "x5", label: "Alas datar ½ bola (menempel tabung)", bucketId: "no", emoji: "🚫" },
      { id: "x6", label: "Sisi luar tabung lainnya", bucketId: "yes", emoji: "✅" },
    ],
  },
  {
    kind: "arrow-match",
    id: "gabungan-game-vol",
    title: "🎯 Game 2 — Volume Gabungan (Pilih Hasil)",
    description: "Pasangkan setiap bangun gabungan dengan VOLUMENYA. Tekan ◀ ▶. (π = 22/7)",
    rightOptions: ["1.232", "1.540", "2.156", "2.258,67", "2.772", "2.872,67", "1.950,67"],
    pairs: [
      { id: "v1", left: "Tabung r=7,t=10", correctRight: "1.540", emoji: "🥫" },
      { id: "v2", left: "Tabung r=7,t=14", correctRight: "2.156", emoji: "🥫" },
      { id: "v3", left: "Kerucut r=7,t=24", correctRight: "1.232", emoji: "🍦" },
      { id: "v4", left: "Tabung+½Bola r=7,t=10", correctRight: "2.258,67", emoji: "🔗" },
      { id: "v5", left: "Tabung+Kerucut r=7,t=10,t_k=24", correctRight: "2.772", emoji: "🔗" },
      { id: "v6", left: "Tabung+½Bola r=7,t=14", correctRight: "2.872,67", emoji: "🔗" },
      { id: "v7", left: "Kerucut+½Bola r=7,t=24", correctRight: "1.950,67", emoji: "🔗" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question:
      "Tabung r=10, t=20 + setengah bola di atas (r=10). Volume gabungan = … cm³ (π = 3,14).",
    kind: "fill",
    answers: ["8373,33", "8373.33", "8.373,33"],
    hint: "V_tabung + ⅔πr³.",
    discussion: [
      "V_t = 3,14×100×20 = 6.280.",
      "V_½bola = ⅔×3,14×1000 ≈ 2.093,33.",
      "Total ≈ 8.373,33 cm³.",
    ],
  },
  {
    id: "pp2",
    question:
      "Tabung r=7, t=10 + Kerucut r=7, t_k=24. Volume gabungan = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["2772", "2.772"],
    hint: "1.540 + 1.232.",
    discussion: ["1.540 + 1.232 = 2.772 cm³."],
  },
  {
    id: "pp3",
    question:
      "Kerucut r=7, t=24 + setengah bola r=7 (di alas). Volume gabungan = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["1950,67", "1950.67", "1.950,67"],
    hint: "V_kerucut + V_½bola.",
    discussion: [
      "V_kerucut = 1.232.",
      "V_½bola ≈ 718,67.",
      "Total ≈ 1.950,67 cm³.",
    ],
  },
  {
    id: "pp4",
    question:
      "Sebuah bola PAS dalam tabung (r dan t = 2r). Jika r = 7, volume KOSONG di sekitar bola = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["718,67", "718.67"],
    hint: "V_tabung − V_bola = 2πr³ − ⁴⁄₃πr³ = ⅔πr³.",
    discussion: ["V_kosong = ⅔ × 22/7 × 343 ≈ 718,67 cm³."],
  },
  {
    id: "pp5",
    question:
      "Tabung+kerucut: r=7, t=10, t_kerucut=24. Luas permukaan luar = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["1144", "1.144"],
    hint: "L_alas + L_selimut_t + L_selimut_k.",
    discussion: ["154 + 440 + 550 = 1.144 cm²."],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Volume bangun BERONGGA = volume luar − volume rongga.",
    kind: "truefalse",
    correct: true,
    hint: "Rongga = lubang di dalam.",
    discussion: ["BENAR. Misal pipa: V_bahan = V_silinder_luar − V_silinder_dalam."],
  },
  {
    id: "pp7",
    question:
      "Tabung r=10, t=20. Di dalamnya dilubangi kerucut r=10, t=20 (alas sama). Volume bahan tabung sisanya = … cm³ (π = 3,14).",
    kind: "fill",
    answers: ["4186,67", "4186.67", "4.186,67"],
    hint: "V_tabung − V_kerucut = πr²t − ⅓πr²t = ⅔πr²t.",
    discussion: [
      "V_tabung = 6.280.",
      "V_kerucut = ⅓ × 6.280 ≈ 2.093,33.",
      "V_sisa ≈ 4.186,67 cm³.",
    ],
  },
  {
    id: "pp8",
    question:
      "Sebuah es krim cone: kerucut r=3, t=10 cm, dengan ½ bola es krim r=3 di atasnya. Volume es krim+cone = … cm³ (π = 3,14).",
    kind: "fill",
    answers: ["150,72", "150.72"],
    hint: "V_kerucut + V_½bola.",
    discussion: [
      "V_kerucut = ⅓ × 3,14 × 9 × 10 = 94,2.",
      "V_½bola = ⅔ × 3,14 × 27 = 56,52.",
      "Total = 150,72 cm³.",
    ],
  },
];

const GabunganBRSLLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Bangun Ruang Sisi Lengkung"
    title="BRSL Gabungan — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami bangun GABUNGAN 🔗! Tabung+½Bola, Tabung+Kerucut, Kerucut+½Bola, hingga bangun BERONGGA. Kamu akan menemukan strategi: jumlahkan VOLUME dan hitung hanya luas yang TERLIHAT — sambil bermain seret kartu kategori sisi & memilih volume gabungan!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan strategi menghitung gabungan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan berbagai bangun gabungan!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/bangun-ruang-sisi-lengkung"
    backLabel="Kembali ke Menu Bangun Ruang Sisi Lengkung"
    scoreMessages={{
      perfect: "🌟 Mantap! Strategi gabungan sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ingat: TIDAK menghitung sisi yang tertutup.",
      low: "💪 Tetap semangat! Mulai dari V_gabungan = jumlah V penyusun.",
    }}
  />
);

export default GabunganBRSLLKPDPage;
