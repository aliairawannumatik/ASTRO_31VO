import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { 
  FileText, 
  Calculator, 
  Sigma, 
  Variable, 
  Equal, 
  Percent, 
  Coins, 
  Ruler, 
  Triangle, 
  CircleDot, 
  Hash, 
  Grid3X3, 
  ArrowLeftRight, 
  GitBranch, 
  LineChart, 
  Circle,
  Box,
  Zap,
  Shapes,
  RotateCcw,
  Cylinder,
  BarChart3,
  Dices,
  X,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";

const bankSoalTopics = [
  { label: "BILANGAN BULAT", icon: Calculator, path: "/bank-soal/bilangan-bulat", ready: true },
  { label: "BILANGAN RASIONAL", icon: Sigma, path: "/bank-soal/bilangan-rasional", ready: true },
  { label: "ALJABAR", icon: Variable, path: "/bank-soal/aljabar", ready: true },
  { label: "PERSAMAAN DAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", icon: Equal, path: "/bank-soal/plsv", ready: true },
  { label: "PERBANDINGAN", icon: Percent, path: "/bank-soal/perbandingan", ready: true },
  { label: "ARITMETIKA SOSIAL", icon: Coins, path: "/bank-soal/aritmetika-sosial", ready: true },
  { label: "GARIS DAN SUDUT", icon: Ruler, path: "/bank-soal/garis-sudut", ready: true },
  { label: "SEGITIGA DAN SEGIEMPAT", icon: Triangle, path: "/bank-soal/segitiga-dan-segiempat", ready: true },
  { label: "HIMPUNAN", icon: CircleDot, path: "/bank-soal/himpunan", ready: true },
  { label: "POLA BILANGAN", icon: Hash, path: "/bank-soal/pola-bilangan", ready: true },
  { label: "KOORDINAT KARTESIUS", icon: Grid3X3, path: "/bank-soal/koordinat-cartesius", ready: true },
  { label: "RELASI DAN FUNGSI", icon: ArrowLeftRight, path: "/bank-soal/relasi-fungsi", ready: true },
  { label: "SISTEM PERSAMAAN LINEAR DUA VARIABEL", icon: GitBranch, path: "/bank-soal/spldv", ready: true },
  { label: "PERSAMAAN GARIS LURUS", icon: LineChart, path: "/bank-soal/persamaan-garis-lurus", ready: true },
  { label: "TEOREMA PYTHAGORAS", icon: Triangle, path: "/bank-soal/teorema-pythagoras", ready: true },
  { label: "LINGKARAN", icon: Circle, path: "/bank-soal/lingkaran", ready: true },
  { label: "GARIS SINGGUNG LINGKARAN (PENGAYAAN)", icon: Circle, path: "/bank-soal/garis-singgung-lingkaran", ready: true },
  { label: "BANGUN RUANG SISI DATAR", icon: Box, path: "/bank-soal/bangun-ruang-sisi-datar", ready: true },
  { label: "BILANGAN BERPANGKAT", icon: Zap, path: "/bank-soal/bilangan-berpangkat", ready: true },
  { label: "KESEBANGUNAN DAN KEKONGRUENAN", icon: Shapes, path: "/bank-soal/kesebangunan-kekongruenan", ready: true },
  { label: "TRANSFORMASI GEOMETRI", icon: RotateCcw, path: "/bank-soal/transformasi-geometri", ready: true },
  { label: "BANGUN RUANG SISI LENGKUNG", icon: Cylinder, path: "/bank-soal/bangun-ruang-sisi-lengkung", ready: true },
  { label: "STATISTIKA", icon: BarChart3, path: "/bank-soal/statistika", ready: true },
  { label: "PELUANG", icon: Dices, path: "/bank-soal/peluang", ready: true },
  { label: "PERSAMAAN KUADRAT (PENGAYAAN)", icon: X, path: "/bank-soal/persamaan-kuadrat", ready: true },
  { label: "FUNGSI KUADRAT (PENGAYAAN)", icon: TrendingUp, path: "/bank-soal/fungsi-kuadrat", ready: true },
];

const BankSoalPage = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    playPopSound();
    navigate(path);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden py-8">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-4xl w-full px-4 text-center mt-16">
        <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2">
          BANK SOAL
        </h1>
        <p className="text-white/70 text-sm font-body mb-8">
          Koleksi lengkap soal-soal matematika SMP
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {bankSoalTopics.map((topic, i) => (
            <button
              key={topic.label}
              onClick={() => handleClick(topic.path)}
              className="group relative bg-card/80 backdrop-blur border border-border rounded-xl p-4 md:p-5
                hover:border-primary/60 hover:box-glow-cyan transition-all duration-300 
                cursor-pointer text-left animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <topic.icon className="w-6 h-6 md:w-7 md:h-7 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-[10px] sm:text-xs font-bold text-foreground leading-tight">
                {topic.label}
              </h3>
            </button>
          ))}
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/menu"); }}
          className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
        >
          ← Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default BankSoalPage;
