import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  School,
  User,
  Calendar,
  Clock,
  GraduationCap,
  BookOpen,
  Target,
  Layers,
  ClipboardCheck,
  Heart,
  Sparkles,
  Globe,
  Monitor,
  Play,
  Compass,
  CheckSquare,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

type ColorTheme = {
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  subtitle: string;
};

type FaseItem = {
  fase: string;
  color: string;
  border: string;
  text: string;
  items: string[];
};

type AsesmenItem = {
  title: string;
  color: string;
  border: string;
  text: string;
  items: string[];
};

type JenisPengetahuanItem = {
  label: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
};

type DimensiProfilItem = { title: string; desc: string };
type KemitraanItem = { title: string; desc: string };
type PraktikPedagogisItem = { label: string; value: string };

export type RPPDetailData = {
  topicTitle: string;
  topicIcon: LucideIcon;
  theme: ColorTheme;
  alokasiWaktu: string;
  identifikasi: string;
  jenisPengetahuan: JenisPengetahuanItem[];
  relevansi: string;
  tingkatKesulitan: string;
  strukturMateri: string;
  integrasiNilai: string;
  dimensiProfil: DimensiProfilItem[];
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  topikPembelajaran: string;
  praktikPedagogis: PraktikPedagogisItem[];
  praktikPedagogisCatatan: string;
  kemitraan: KemitraanItem[];
  budayaBelajar: string;
  ruangFisik: string;
  pemanfaatanDigital: string[];
  apersepsi: string;
  langkahAwalExtra?: string[];
  langkahInti: FaseItem[];
  langkahPenutup: string[];
  asesmen: AsesmenItem[];
  backPath: string;
  backLabel: string;
};

const SectionCard = ({
  icon: Icon,
  title,
  iconColor,
  borderColor,
  bgColor,
  children,
}: {
  icon: LucideIcon;
  title: string;
  iconColor: string;
  borderColor: string;
  bgColor: string;
  children: React.ReactNode;
}) => (
  <div
    className={`backdrop-blur border ${borderColor} rounded-2xl p-5 mb-5 animate-slide-up`}
    style={{ background: bgColor }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="font-display text-base md:text-lg font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const RPPDetailPage = ({ data }: { data: RPPDetailData }) => {
  const navigate = useNavigate();
  const TopicIcon = data.topicIcon;

  const identitas = [
    { label: "Penyusun", value: "Irawan Sutiawan, M.Pd", icon: User },
    { label: "Sekolah", value: "Sekolah Menengah Pertama", icon: School },
    { label: "Kelas / Fase", value: "VII / D", icon: GraduationCap },
    { label: "Tahun Ajaran", value: "2025 - 2026", icon: Calendar },
    { label: "Alokasi Waktu", value: data.alokasiWaktu, icon: Clock },
    { label: "Topik", value: data.topicTitle, icon: data.topicIcon },
  ];

  const langkahAwal = [
    "Guru mengucapkan salam dan memimpin doa.",
    "Guru mengecek kehadiran dan kesiapan fisik serta psikis murid.",
    "Guru membuat kesepakatan kelas.",
    "Guru menginformasikan tujuan pembelajaran dan kegiatan yang akan dilaksanakan.",
    "Guru menginformasikan mengenai sistem penilaian selama pembelajaran.",
    `Apersepsi Kontekstual: ${data.apersepsi}`,
    ...(data.langkahAwalExtra ?? []),
  ];

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath={data.backPath} />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div
            className={`inline-flex items-center gap-2 rounded-full border ${data.theme.badgeBorder} ${data.theme.badgeBg} px-4 py-2 text-xs font-semibold ${data.theme.badgeText} mb-4`}
          >
            <TopicIcon className="w-4 h-4" />
            RPP - {data.topicTitle}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            PERENCANAAN PEMBELAJARAN
          </h1>
          <p className={`mt-3 text-base md:text-lg ${data.theme.subtitle} font-body font-semibold`}>
            {data.topicTitle}
          </p>
        </div>

        {/* Identitas */}
        <SectionCard
          icon={School}
          title="Identitas"
          iconColor="bg-cyan-500"
          borderColor="border-cyan-300/40"
          bgColor="linear-gradient(135deg, rgba(6,182,212,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {identitas.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2.5 border border-white/10">
                <item.icon className="w-4 h-4 text-cyan-300 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">{item.label}</div>
                  <div className="text-sm text-white font-body">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Identifikasi */}
        <SectionCard
          icon={Compass}
          title="Identifikasi"
          iconColor="bg-violet-500"
          borderColor="border-violet-300/40"
          bgColor="linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <p className="text-sm text-white/85 font-body leading-relaxed">{data.identifikasi}</p>
        </SectionCard>

        {/* Materi Pembelajaran */}
        <SectionCard
          icon={BookOpen}
          title="Materi Pembelajaran"
          iconColor="bg-emerald-500"
          borderColor="border-emerald-300/40"
          bgColor="linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <div className="mb-4">
            <h3 className="font-display text-sm font-bold text-emerald-200 mb-2">{data.topicTitle} - Jenis Pengetahuan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.jenisPengetahuan.map((jp, i) => (
                <div key={i} className={`${jp.bg} ${jp.border} border rounded-xl p-3`}>
                  <div className={`text-xs font-bold ${jp.color} uppercase tracking-wide mb-1`}>{jp.label}</div>
                  <p className="text-xs text-white/80 font-body leading-relaxed">{jp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide mb-1">Relevansi dengan Kehidupan Nyata</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">{data.relevansi}</p>
          </div>

          <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide mb-1">Tingkat Kesulitan</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">{data.tingkatKesulitan}</p>
          </div>

          <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide mb-1">Struktur Materi</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">{data.strukturMateri}</p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide mb-1">Integrasi Nilai dan Karakter</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">{data.integrasiNilai}</p>
          </div>
        </SectionCard>

        {/* Dimensi Profil Lulusan */}
        <SectionCard
          icon={Heart}
          title="Dimensi Profil Lulusan"
          iconColor="bg-pink-500"
          borderColor="border-pink-300/40"
          bgColor="linear-gradient(135deg, rgba(236,72,153,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <ul className="space-y-3">
            {data.dimensiProfil.map((d, i) => (
              <li key={i} className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2.5 border border-white/10">
                <Sparkles className="w-4 h-4 text-pink-300 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-pink-100 font-body mb-0.5">{d.title}</div>
                  <p className="text-xs text-white/80 font-body leading-relaxed">{d.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Capaian & Tujuan */}
        <SectionCard
          icon={Target}
          title="Capaian & Tujuan Pembelajaran"
          iconColor="bg-amber-500"
          borderColor="border-amber-300/40"
          bgColor="linear-gradient(135deg, rgba(251,191,36,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-2">Capaian Pembelajaran (Bilangan)</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">{data.capaianPembelajaran}</p>
          </div>

          <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-2">Tujuan Pembelajaran</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">{data.tujuanPembelajaran}</p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-2">Topik Pembelajaran</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">{data.topikPembelajaran}</p>
          </div>
        </SectionCard>

        {/* Praktik Pedagogis */}
        <SectionCard
          icon={Layers}
          title="Praktik Pedagogis"
          iconColor="bg-cyan-500"
          borderColor="border-cyan-300/40"
          bgColor="linear-gradient(135deg, rgba(6,182,212,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {data.praktikPedagogis.map((p, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-3 border border-cyan-300/30">
                <div className="text-xs font-bold text-cyan-200 uppercase tracking-wide mb-1">{p.label}</div>
                <p className="text-sm text-white font-body">{p.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/70 italic font-body bg-white/5 rounded-lg px-3 py-2 border border-white/10">
            {data.praktikPedagogisCatatan}
          </p>
        </SectionCard>

        {/* Kemitraan */}
        <SectionCard
          icon={Globe}
          title="Kemitraan / Lintas Disiplin Ilmu"
          iconColor="bg-teal-500"
          borderColor="border-teal-300/40"
          bgColor="linear-gradient(135deg, rgba(20,184,166,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <ul className="space-y-3">
            {data.kemitraan.map((k, i) => (
              <li key={i} className="bg-white/5 rounded-lg px-3 py-2.5 border border-white/10">
                <div className="text-sm font-semibold text-teal-100 font-body mb-1">{k.title}</div>
                <p className="text-xs text-white/80 font-body leading-relaxed">{k.desc}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Lingkungan Pembelajaran */}
        <SectionCard
          icon={Lightbulb}
          title="Lingkungan Pembelajaran"
          iconColor="bg-yellow-500"
          borderColor="border-yellow-300/40"
          bgColor="linear-gradient(135deg, rgba(234,179,8,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <div className="mb-3 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-yellow-200 uppercase tracking-wide mb-1">Budaya Belajar</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">{data.budayaBelajar}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-yellow-200 uppercase tracking-wide mb-1">Ruang Fisik</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">{data.ruangFisik}</p>
          </div>
        </SectionCard>

        {/* Pemanfaatan Digital */}
        <SectionCard
          icon={Monitor}
          title="Pemanfaatan Digital"
          iconColor="bg-blue-500"
          borderColor="border-blue-300/40"
          bgColor="linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <ul className="space-y-2">
            {data.pemanfaatanDigital.map((d, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                <Monitor className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/85 font-body leading-relaxed">{d}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Langkah-Langkah Pembelajaran */}
        <SectionCard
          icon={Play}
          title="Langkah-Langkah Pembelajaran"
          iconColor="bg-rose-500"
          borderColor="border-rose-300/40"
          bgColor="linear-gradient(135deg, rgba(244,63,94,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          {/* AWAL */}
          <div className="mb-5">
            <div className="inline-block bg-rose-500/30 text-rose-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-3 border border-rose-300/50">
              AWAL · Berkesadaran, Bermakna, Menggembirakan
            </div>
            <ol className="space-y-2">
              {langkahAwal.map((l, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/20 border border-rose-300/40 flex items-center justify-center text-xs font-bold text-rose-200">
                    {i + 1}
                  </span>
                  <p className="text-sm text-white/85 font-body leading-relaxed">{l}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* INTI */}
          <div className="mb-5">
            <div className="inline-block bg-rose-500/30 text-rose-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-3 border border-rose-300/50">
              INTI · Berkesadaran, Bermakna, Menyenangkan
            </div>
            <p className="text-xs text-white/70 italic mb-3">
              Pada tahap ini, murid aktif terlibat dalam pengalaman belajar sesuai sintaks model pembelajaran yang dipilih.
            </p>
            <div className="space-y-3">
              {data.langkahInti.map((fase, i) => (
                <div key={i} className={`bg-gradient-to-br ${fase.color} ${fase.border} border rounded-xl p-4`}>
                  <div className={`font-display text-sm font-bold ${fase.text} mb-2`}>{fase.fase}</div>
                  <ul className="space-y-1.5">
                    {fase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-white/85 font-body leading-relaxed">
                        <span className={`w-1.5 h-1.5 rounded-full ${fase.text.replace("text-", "bg-")} mt-1.5 flex-shrink-0`}></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* PENUTUP */}
          <div>
            <div className="inline-block bg-rose-500/30 text-rose-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-3 border border-rose-300/50">
              PENUTUP · Berkesadaran, Bermakna, Menggembirakan
            </div>
            <ol className="space-y-2">
              {data.langkahPenutup.map((l, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/20 border border-rose-300/40 flex items-center justify-center text-xs font-bold text-rose-200">
                    {i + 1}
                  </span>
                  <p className="text-sm text-white/85 font-body leading-relaxed">{l}</p>
                </li>
              ))}
            </ol>
          </div>
        </SectionCard>

        {/* Asesmen Pembelajaran */}
        <SectionCard
          icon={ClipboardCheck}
          title="Asesmen Pembelajaran"
          iconColor="bg-purple-500"
          borderColor="border-purple-300/40"
          bgColor="linear-gradient(135deg, rgba(168,85,247,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <p className="text-xs text-white/70 italic mb-4">
            Asesmen dalam pembelajaran mendalam dilaksanakan melalui kombinasi teknik dan instrumen.
          </p>
          <div className="space-y-3">
            {data.asesmen.map((a, i) => (
              <div key={i} className={`bg-gradient-to-br ${a.color} ${a.border} border rounded-xl p-4`}>
                <div className={`font-display text-sm font-bold ${a.text} mb-2 flex items-center gap-2`}>
                  <CheckSquare className="w-4 h-4" />
                  {a.title}
                </div>
                <ul className="space-y-1.5">
                  {a.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-white/85 font-body leading-relaxed">
                      <span className={`w-1.5 h-1.5 rounded-full ${a.text.replace("text-", "bg-")} mt-1.5 flex-shrink-0`}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Tanda Tangan */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-6 mt-6 animate-slide-up">
          <div className="text-right text-sm text-white/80 font-body mb-6">Bandung, &nbsp; Juli 2025</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-xs text-white/60 font-body mb-1">Mengetahui,</div>
              <div className="text-sm font-semibold text-white font-body mb-16">Kepala Sekolah Menengah Pertama</div>
              <div className="text-sm font-bold text-white font-body border-t border-white/20 pt-2">
                ..........................................................
              </div>
              <div className="text-xs text-white/60 font-body mt-1">NIP. ..........................................................</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-white/60 font-body mb-1">&nbsp;</div>
              <div className="text-sm font-semibold text-white font-body mb-16">Guru Mata Pelajaran</div>
              <div className="text-sm font-bold text-white font-body border-t border-white/20 pt-2">
                ..........................................................
              </div>
              <div className="text-xs text-white/60 font-body mt-1">NIP. ..........................................................</div>
            </div>
          </div>
        </div>

        {/* Footer Nav */}
        <div className="text-center mt-10">
          <button
            onClick={() => {
              playPopSound();
              navigate(data.backPath);
            }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            {data.backLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RPPDetailPage;
