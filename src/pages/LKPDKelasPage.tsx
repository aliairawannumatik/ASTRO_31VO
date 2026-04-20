import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { ClipboardCheck } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

type Topic = {
  label: string;
  path: string;
};

const kelas7Topics: Topic[] = [
  { label: "BILANGAN BULAT", path: "/lkpd/kelas-7/bilangan-bulat" },
  { label: "PECAHAN", path: "/lkpd/kelas-7/bilangan-rasional" },
  { label: "ALJABAR", path: "/lkpd/kelas-7/aljabar" },
  { label: "PERSAMAAN DAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", path: "/lkpd/kelas-7/plsv-ptlsv" },
  { label: "PERBANDINGAN", path: "/lkpd/kelas-7/perbandingan" },
  { label: "ARITMETIKA SOSIAL", path: "/lkpd/kelas-7/aritmetika-sosial" },
  { label: "GARIS DAN SUDUT", path: "/lkpd/kelas-7/garis-dan-sudut" },
  { label: "SEGITIGA DAN SEGIEMPAT", path: "/lkpd/kelas-7/segitiga-dan-segiempat" },
  { label: "HIMPUNAN (PENGAYAAN)", path: "/lkpd/kelas-7/himpunan" },
];

const kelas8Topics: Topic[] = [
  { label: "POLA BILANGAN", path: "/lkpd/kelas-8/pola-bilangan" },
  { label: "KOORDINAT CARTESIUS", path: "/lkpd/kelas-8/koordinat-cartesius" },
  { label: "RELASI DAN FUNGSI", path: "/lkpd/kelas-8/relasi-dan-fungsi" },
  { label: "SISTEM PERSAMAAN LINEAR DUA VARIABEL", path: "/lkpd/kelas-8/spldv" },
  { label: "PERSAMAAN GARIS LURUS", path: "/lkpd/kelas-8/persamaan-garis-lurus" },
  { label: "TEOREMA PYTHAGORAS", path: "/lkpd/kelas-8/teorema-pythagoras" },
  { label: "LINGKARAN", path: "/lkpd/kelas-8/lingkaran" },
  { label: "GARIS SINGGUNG LINGKARAN", path: "/lkpd/kelas-8/garis-singgung-lingkaran" },
  { label: "BANGUN RUANG SISI DATAR", path: "/lkpd/kelas-8/bangun-ruang-sisi-datar" },
];

const kelas9Topics: Topic[] = [
  { label: "BILANGAN BERPANGKAT", path: "/lkpd/kelas-9/bilangan-berpangkat" },
  { label: "KESEBANGUNAN DAN KEKONGRUENAN", path: "/lkpd/kelas-9/kesebangunan-kekongruenan" },
  { label: "TRANSFORMASI GEOMETRI", path: "/lkpd/kelas-9/transformasi-geometri" },
  { label: "BANGUN RUANG SISI LENGKUNG", path: "/lkpd/kelas-9/bangun-ruang-sisi-lengkung" },
  { label: "STATISTIKA", path: "/lkpd/kelas-9/statistika" },
  { label: "PELUANG", path: "/lkpd/kelas-9/peluang" },
  { label: "PERSAMAAN KUADRAT (PENGAYAAN)", path: "/lkpd/kelas-9/persamaan-kuadrat" },
  { label: "FUNGSI KUADRAT (PENGAYAAN)", path: "/lkpd/kelas-9/fungsi-kuadrat" },
];

const LKPDKelasPage = ({ kelas, topics }: { kelas: string; topics: Topic[] }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/lkpd" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <ClipboardCheck className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          LKPD - {kelas}
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          Pilih topik untuk mengerjakan LKPD
        </p>

        <div className="flex flex-col gap-3 animate-slide-up">
          {topics.map((topic, i) => (
            <button
              key={topic.label}
              onClick={() => { playPopSound(); navigate(topic.path); }}
              className="group flex items-center gap-4 bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4
                hover:border-primary/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <ClipboardCheck className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-body text-sm text-white">{topic.label}</span>
              <span className="ml-auto text-xs text-primary font-display">KERJAKAN</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/lkpd"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke LKPD
          </button>
        </div>
      </div>
    </div>
  );
};

export const LKPDKelas7Page = () => <LKPDKelasPage kelas="KELAS 7" topics={kelas7Topics} />;
export const LKPDKelas8Page = () => <LKPDKelasPage kelas="KELAS 8" topics={kelas8Topics} />;
export const LKPDKelas9Page = () => <LKPDKelasPage kelas="KELAS 9" topics={kelas9Topics} />;