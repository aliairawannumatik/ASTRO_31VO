import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Gamepad2, ClipboardList } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

type MenuKind = "materi" | "latihan" | "game" | "lkpd";

const topics = [
  [7, "Bilangan Bulat", "bilangan-bulat"], [7, "Bilangan Rasional / Pecahan", "bilangan-rasional"], [7, "Aljabar", "aljabar"], [7, "PLSV dan PtLSV", "plsv-ptlsv"], [7, "Perbandingan", "perbandingan"], [7, "Aritmetika Sosial", "aritmetika-sosial"], [7, "Garis dan Sudut", "garis-dan-sudut"], [7, "Segitiga dan Segiempat", "segitiga-dan-segiempat"], [7, "Himpunan", "himpunan"],
  [8, "Pola Bilangan", "pola-bilangan"], [8, "Koordinat Cartesius", "koordinat-cartesius"], [8, "Relasi dan Fungsi", "relasi-dan-fungsi"], [8, "SPLDV", "spldv"], [8, "Persamaan Garis Lurus", "persamaan-garis-lurus"], [8, "Teorema Pythagoras", "teorema-pythagoras"], [8, "Lingkaran", "lingkaran"], [8, "Garis Singgung Lingkaran", "garis-singgung-lingkaran"], [8, "Bangun Ruang Sisi Datar", "bangun-ruang-sisi-datar"],
  [9, "Bilangan Berpangkat", "bilangan-berpangkat"], [9, "Kesebangunan dan Kekongruenan", "kesebangunan-kekongruenan"], [9, "Transformasi Geometri", "transformasi-geometri"], [9, "Bangun Ruang Sisi Lengkung", "bangun-ruang-sisi-lengkung"], [9, "Statistika", "statistika"], [9, "Peluang", "peluang"], [9, "Persamaan Kuadrat", "persamaan-kuadrat"], [9, "Fungsi Kuadrat", "fungsi-kuadrat"],
] as const;

export default function DirectTopicMenu({ kind }: { kind: MenuKind }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const light = theme === "light";
  const base = kind === "materi" ? "/materi-matematika" : kind === "latihan" ? "/latihan-mandiri" : kind === "game" ? "/math-game-arena" : "/lkpd";
  const Icon = kind === "materi" ? BookOpen : kind === "latihan" ? ClipboardList : kind === "game" ? Gamepad2 : ClipboardList;
  const title = kind === "materi" ? "BUKU ANIMASI MATEMATIKA" : kind === "latihan" ? "TUGAS-LATIHAN MANDIRI" : kind === "game" ? "MATH GAME ARENA" : "LKPD";
  return <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${light && kind === "game" ? "gradient-snow" : "gradient-space"}`}>
    {light && kind === "game" ? <Snowfall /> : <Starfield />}
    <PageNavigation prevPath="/menu" />
    <main className="relative z-10 max-w-3xl w-full px-4 py-10">
      <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
      <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">{title}</h1>
      <p className="text-white/60 text-sm text-center mb-8 font-body">Pilih materi secara langsung. Urutan disusun dari Kelas 7, Kelas 8, lalu Kelas 9.</p>
      <div className="flex flex-col gap-6">
        {[7, 8, 9].map((grade) => <section key={grade} aria-labelledby={`direct-grade-${kind}-${grade}`}>
          <h2 id={`direct-grade-${kind}-${grade}`} className="font-display text-lg font-bold text-primary mb-3">KELAS {grade}</h2>
          <div className="flex flex-col gap-3">{topics.filter(([g]) => g === grade).map(([_, label, slug]) => <button key={slug} onClick={() => { playPopSound(); navigate(`${base}/kelas-${grade}/${slug}`); }} className="group flex items-center gap-4 bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4 hover:border-primary/60 transition-all cursor-pointer text-left"><Icon className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" /><span className="font-body text-sm text-white">{label}</span><span className="ml-auto text-xs text-primary font-display">BUKA</span></button>)}</div>
        </section>)}
      </div>
    </main>
  </div>;
}
