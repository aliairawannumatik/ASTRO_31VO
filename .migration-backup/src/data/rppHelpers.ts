import type { LucideIcon } from "lucide-react";
import type { RPPDetailData } from "@/components/RPPDetailPage";

export type ColorTheme = {
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  subtitle: string;
  cardColor: string;
  cardBorder: string;
  cardText: string;
  cardIconBg: string;
};

export type SubMateriCompact = {
  slug: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  model: "PBL" | "Discovery";
  dimensiProfil: { title: string; desc: string }[];
  jenisPengetahuan?: { faktual: string; konseptual: string; prosedural: string };
  relevansi: string;
  tingkatKesulitan?: string;
  strukturMateri: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  topikPembelajaran: string;
  kemitraan: { title: string; desc: string }[];
  apersepsi: string;
  langkahInti: { items: string[] }[];
  alokasiWaktu?: string;
  identifikasi?: string;
  integrasiNilai?: string;
  budayaBelajar?: string;
  ruangFisik?: string;
  pemanfaatanDigital?: string[];
  langkahPenutup?: string[];
  asesmen?: { title: string; items: string[] }[];
};

export type MateriCatalogEntry = {
  slug: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  intro: string;
  theme: ColorTheme;
  subMateri: SubMateriCompact[];
};

const PBL_PHASES = [
  { title: "Orientasi Peserta Didik pada Masalah", color: "from-cyan-500/20 to-blue-500/10", border: "border-cyan-300/40", text: "text-cyan-100" },
  { title: "Mengorganisasi Peserta Didik untuk Belajar", color: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-300/40", text: "text-emerald-100" },
  { title: "Membimbing Penyelidikan Kelompok", color: "from-violet-500/20 to-indigo-500/10", border: "border-violet-300/40", text: "text-violet-100" },
  { title: "Mengembangkan dan Menyajikan Hasil Karya", color: "from-amber-500/20 to-yellow-500/10", border: "border-amber-300/40", text: "text-amber-100" },
  { title: "Menganalisis & Mengevaluasi Proses Pemecahan Masalah", color: "from-pink-500/20 to-rose-500/10", border: "border-pink-300/40", text: "text-pink-100" },
];

const DISCOVERY_PHASES = [
  { title: "Stimulation (Pemberian Rangsangan)", color: "from-cyan-500/20 to-blue-500/10", border: "border-cyan-300/40", text: "text-cyan-100" },
  { title: "Problem Statement (Identifikasi Masalah)", color: "from-violet-500/20 to-indigo-500/10", border: "border-violet-300/40", text: "text-violet-100" },
  { title: "Data Collection (Pengumpulan Data)", color: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-300/40", text: "text-emerald-100" },
  { title: "Data Processing (Pengolahan Data)", color: "from-amber-500/20 to-yellow-500/10", border: "border-amber-300/40", text: "text-amber-100" },
  { title: "Verification (Pembuktian)", color: "from-pink-500/20 to-rose-500/10", border: "border-pink-300/40", text: "text-pink-100" },
  { title: "Generalization (Menarik Kesimpulan)", color: "from-fuchsia-500/20 to-purple-500/10", border: "border-fuchsia-300/40", text: "text-fuchsia-100" },
];

const ASESMEN_TEMPLATE = [
  { title: "Asesmen sebagai Pembelajaran (Assessment as Learning)", color: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-300/40", text: "text-emerald-100" },
  { title: "Asesmen untuk Pembelajaran (Assessment for Learning)", color: "from-amber-500/20 to-yellow-500/10", border: "border-amber-300/40", text: "text-amber-100" },
  { title: "Asesmen Hasil Pembelajaran (Assessment of Learning)", color: "from-pink-500/20 to-rose-500/10", border: "border-pink-300/40", text: "text-pink-100" },
];

const defaultAsesmenItems = (topic: string) => [
  [
    "Penilaian Diri: Murid menilai sendiri pemahaman konsep dan kontribusi belajarnya.",
    `Penilaian Sejawat: Murid memberi umpan balik atas strategi rekan dalam memecahkan masalah ${topic.toLowerCase()}.`,
  ],
  [
    "Observasi: Guru mengamati keaktifan murid dalam diskusi dan pemecahan masalah.",
    "Tanya Jawab: Guru memberi pertanyaan reflektif untuk mengecek pemahaman.",
    "LKPD: Hasil pekerjaan dijadikan dasar perbaikan instruksi.",
  ],
  [
    `Tes Tertulis: Soal ${topic.toLowerCase()} termasuk konteks nyata.`,
    `Unjuk Kerja: Mempresentasikan hasil pemecahan masalah ${topic.toLowerCase()} di depan kelas.`,
  ],
];

export function buildRPPDetailData(
  materi: MateriCatalogEntry,
  sub: SubMateriCompact,
): RPPDetailData {
  const phases = sub.model === "PBL" ? PBL_PHASES : DISCOVERY_PHASES;
  const langkahInti = phases.map((phase, i) => ({
    fase: phase.title,
    color: phase.color,
    border: phase.border,
    text: phase.text,
    items: sub.langkahInti[i]?.items ?? [],
  }));

  const defaultJenisPengetahuan = sub.jenisPengetahuan ?? {
    faktual: `Definisi, lambang, dan istilah terkait ${sub.title.toLowerCase()}.`,
    konseptual: `Konsep dasar ${sub.title.toLowerCase()} beserta sifat-sifat dan hubungannya.`,
    prosedural: `Langkah-langkah sistematis menyelesaikan masalah ${sub.title.toLowerCase()}.`,
  };

  const defaultAsesmen = ASESMEN_TEMPLATE.map((a, i) => ({
    title: a.title,
    color: a.color,
    border: a.border,
    text: a.text,
    items: sub.asesmen?.[i]?.items ?? defaultAsesmenItems(sub.title)[i],
  }));

  return {
    topicTitle: sub.title,
    topicIcon: sub.icon,
    theme: {
      badgeBorder: materi.theme.badgeBorder,
      badgeBg: materi.theme.badgeBg,
      badgeText: materi.theme.badgeText,
      subtitle: materi.theme.subtitle,
    },
    alokasiWaktu: sub.alokasiWaktu ?? "2 x 40 JP",
    identifikasi:
      sub.identifikasi ??
      `Guru mengidentifikasi kemampuan awal, minat, dan gaya belajar murid sebagai dasar memilih strategi pembelajaran ${sub.model === "PBL" ? "Problem Based Learning" : "Discovery Learning"} pada topik ${sub.title.toLowerCase()}.`,
    jenisPengetahuan: [
      { label: "Faktual", desc: defaultJenisPengetahuan.faktual, color: "text-cyan-200", bg: "bg-cyan-500/10", border: "border-cyan-300/40" },
      { label: "Konseptual", desc: defaultJenisPengetahuan.konseptual, color: "text-violet-200", bg: "bg-violet-500/10", border: "border-violet-300/40" },
      { label: "Prosedural", desc: defaultJenisPengetahuan.prosedural, color: "text-amber-200", bg: "bg-amber-500/10", border: "border-amber-300/40" },
    ],
    relevansi: sub.relevansi,
    tingkatKesulitan:
      sub.tingkatKesulitan ??
      `Sedang. Materi ${sub.title.toLowerCase()} membutuhkan pemahaman konsep dasar serta keterampilan menerapkannya dalam masalah kontekstual.`,
    strukturMateri: sub.strukturMateri,
    integrasiNilai:
      sub.integrasiNilai ??
      `Pembelajaran ini menanamkan nilai religius (bersyukur), ketelitian, kejujuran, tanggung jawab, kolaborasi, dan kreativitas yang mendukung pengembangan dimensi profil lulusan.`,
    dimensiProfil: sub.dimensiProfil,
    capaianPembelajaran: sub.capaianPembelajaran,
    tujuanPembelajaran: sub.tujuanPembelajaran,
    topikPembelajaran: sub.topikPembelajaran,
    praktikPedagogis: [
      { label: "Model", value: sub.model === "PBL" ? "Problem Based Learning (PBL)" : "Discovery Learning" },
      { label: "Pendekatan", value: "Saintifik" },
      {
        label: "Metode",
        value:
          sub.model === "PBL"
            ? "Diskusi kelompok, presentasi, studi kasus, dan penugasan kontekstual."
            : "Eksperimen, diskusi kelompok, tanya jawab, dan penugasan.",
      },
    ],
    praktikPedagogisCatatan:
      sub.model === "PBL"
        ? `PBL membawa murid memecahkan masalah autentik tentang ${sub.title.toLowerCase()} sehingga kolaborasi, penalaran kritis, dan kemampuan komunikasi terlatih melalui pengalaman.`
        : `Discovery Learning memandu murid menemukan sendiri konsep ${sub.title.toLowerCase()} melalui 6 sintaks (Stimulation hingga Generalization), sehingga konsep menjadi bermakna dan tertanam kuat.`,
    kemitraan: sub.kemitraan,
    budayaBelajar:
      sub.budayaBelajar ??
      "Iklim kelas yang aman, nyaman, kolaboratif, dan saling memuliakan, di mana setiap murid berani menyampaikan pendapat dan rasa ingin tahu.",
    ruangFisik:
      sub.ruangFisik ??
      `Meja kelompok 4-5 murid dilengkapi LKPD, papan tulis kecil, dan alat peraga yang relevan dengan ${sub.title.toLowerCase()}.`,
    pemanfaatanDigital:
      sub.pemanfaatanDigital ?? [
        `Aplikasi NUMATIK untuk simulasi konsep ${sub.title.toLowerCase()}, presentasi, video pembelajaran, dan quiz interaktif.`,
      ],
    apersepsi: sub.apersepsi,
    langkahInti,
    langkahPenutup:
      sub.langkahPenutup ?? [
        `Guru memberi apresiasi atas keaktifan murid dalam pembelajaran ${sub.title.toLowerCase()}.`,
        "Guru memberikan postes singkat untuk mengukur ketercapaian tujuan pembelajaran.",
        `Guru memberikan PR berupa latihan kontekstual ${sub.title.toLowerCase()}.`,
        "Guru menginformasikan materi yang akan dipelajari pada pertemuan berikutnya.",
      ],
    asesmen: defaultAsesmen,
    backPath: `/ruang-untuk-guru/rpp/${materi.slug}`,
    backLabel: `Kembali ke RPP ${materi.title}`,
  };
}

export const THEMES: Record<string, ColorTheme> = {
  emerald: {
    badgeBorder: "border-emerald-300/40", badgeBg: "bg-emerald-500/10", badgeText: "text-emerald-100", subtitle: "text-emerald-200",
    cardColor: "from-emerald-500/25 to-teal-500/10", cardBorder: "border-emerald-300/50", cardText: "text-emerald-100", cardIconBg: "bg-emerald-500/20",
  },
  cyan: {
    badgeBorder: "border-cyan-300/40", badgeBg: "bg-cyan-500/10", badgeText: "text-cyan-100", subtitle: "text-cyan-200",
    cardColor: "from-cyan-500/25 to-blue-500/10", cardBorder: "border-cyan-300/50", cardText: "text-cyan-100", cardIconBg: "bg-cyan-500/20",
  },
  amber: {
    badgeBorder: "border-amber-300/40", badgeBg: "bg-amber-500/10", badgeText: "text-amber-100", subtitle: "text-amber-200",
    cardColor: "from-amber-500/25 to-yellow-500/10", cardBorder: "border-amber-300/50", cardText: "text-amber-100", cardIconBg: "bg-amber-500/20",
  },
  pink: {
    badgeBorder: "border-pink-300/40", badgeBg: "bg-pink-500/10", badgeText: "text-pink-100", subtitle: "text-pink-200",
    cardColor: "from-pink-500/25 to-rose-500/10", cardBorder: "border-pink-300/50", cardText: "text-pink-100", cardIconBg: "bg-pink-500/20",
  },
  violet: {
    badgeBorder: "border-violet-300/40", badgeBg: "bg-violet-500/10", badgeText: "text-violet-100", subtitle: "text-violet-200",
    cardColor: "from-violet-500/25 to-purple-500/10", cardBorder: "border-violet-300/50", cardText: "text-violet-100", cardIconBg: "bg-violet-500/20",
  },
  fuchsia: {
    badgeBorder: "border-fuchsia-300/40", badgeBg: "bg-fuchsia-500/10", badgeText: "text-fuchsia-100", subtitle: "text-fuchsia-200",
    cardColor: "from-fuchsia-500/25 to-purple-500/10", cardBorder: "border-fuchsia-300/50", cardText: "text-fuchsia-100", cardIconBg: "bg-fuchsia-500/20",
  },
  orange: {
    badgeBorder: "border-orange-300/40", badgeBg: "bg-orange-500/10", badgeText: "text-orange-100", subtitle: "text-orange-200",
    cardColor: "from-orange-500/25 to-red-500/10", cardBorder: "border-orange-300/50", cardText: "text-orange-100", cardIconBg: "bg-orange-500/20",
  },
  blue: {
    badgeBorder: "border-blue-300/40", badgeBg: "bg-blue-500/10", badgeText: "text-blue-100", subtitle: "text-blue-200",
    cardColor: "from-blue-500/25 to-indigo-500/10", cardBorder: "border-blue-300/50", cardText: "text-blue-100", cardIconBg: "bg-blue-500/20",
  },
  teal: {
    badgeBorder: "border-teal-300/40", badgeBg: "bg-teal-500/10", badgeText: "text-teal-100", subtitle: "text-teal-200",
    cardColor: "from-teal-500/25 to-emerald-500/10", cardBorder: "border-teal-300/50", cardText: "text-teal-100", cardIconBg: "bg-teal-500/20",
  },
  yellow: {
    badgeBorder: "border-yellow-300/40", badgeBg: "bg-yellow-500/10", badgeText: "text-yellow-100", subtitle: "text-yellow-200",
    cardColor: "from-yellow-500/25 to-amber-500/10", cardBorder: "border-yellow-300/50", cardText: "text-yellow-100", cardIconBg: "bg-yellow-500/20",
  },
};

export const DIMENSI = {
  beriman: {
    title: "Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia",
    desc: "Melalui doa pembuka, bersyukur atas anugerah akal, serta menjaga sikap santun dan jujur selama pembelajaran.",
  },
  bernalarKritis: (topic: string) => ({
    title: "Bernalar Kritis",
    desc: `Melalui kegiatan menganalisis, mengevaluasi, dan menyimpulkan informasi terkait ${topic.toLowerCase()} secara logis dan terstruktur.`,
  }),
  mandiri: {
    title: "Mandiri",
    desc: "Melalui penugasan individu, eksplorasi mandiri, dan refleksi pribadi terhadap proses belajar.",
  },
  kreatif: (topic: string) => ({
    title: "Kreatif",
    desc: `Melalui kebebasan murid memilih representasi, strategi, atau menghasilkan karya orisinal terkait ${topic.toLowerCase()}.`,
  }),
  gotongRoyong: (topic: string) => ({
    title: "Bergotong Royong (Kolaborasi)",
    desc: `Melalui kerja kelompok dalam memecahkan masalah ${topic.toLowerCase()}, saling membantu, dan berbagi peran.`,
  }),
  komunikatif: {
    title: "Komunikatif",
    desc: "Melalui kegiatan presentasi hasil pemecahan masalah dan tanya jawab antar kelompok dengan bahasa matematika yang tepat.",
  },
  kebinekaanGlobal: (topic: string) => ({
    title: "Berkebinekaan Global",
    desc: `Melalui pemilihan konteks ${topic.toLowerCase()} yang menumbuhkan kesadaran terhadap keberagaman budaya, sosial, dan global.`,
  }),
  sehat: {
    title: "Sehat",
    desc: "Melalui pembelajaran yang menjaga keseimbangan kognitif, emosional, dan sosial murid serta mendorong gaya hidup aktif.",
  },
};

/** Convenience: alternate model PBL/Discovery starting from PBL or Discovery */
export const alt = (start: "PBL" | "Discovery", index: number): "PBL" | "Discovery" =>
  ((index % 2 === 0) ? start : (start === "PBL" ? "Discovery" : "PBL"));
