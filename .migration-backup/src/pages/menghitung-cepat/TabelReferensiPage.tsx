import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Hash, Square, Box, Sigma, Percent, Divide, Ruler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";

const SectionCard = ({
  title,
  icon: Icon,
  color,
  border,
  children,
  desc,
}: {
  title: string;
  icon: any;
  color: string;
  border: string;
  desc?: string;
  children: React.ReactNode;
}) => (
  <section
    className={`bg-card/80 backdrop-blur border ${border} rounded-xl p-4 sm:p-5 text-left`}
  >
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`w-5 h-5 ${color}`} />
      <h2 className={`font-display text-sm sm:text-base font-bold ${color}`}>
        {title}
      </h2>
    </div>
    {desc && (
      <p className="text-xs text-white/60 font-body mb-3 leading-relaxed">
        {desc}
      </p>
    )}
    <div className="overflow-x-auto">{children}</div>
  </section>
);

const cell =
  "border border-white/10 px-2 py-1 text-center text-xs font-body text-white/90";
const headCell =
  "border border-white/10 px-2 py-1 text-center text-xs font-body font-bold bg-white/5";

const PerkalianTable = () => {
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className={`${headCell} text-sky-300`}>×</th>
          {cols.map((c) => (
            <th key={c} className={`${headCell} text-sky-300`}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r}>
            <td className={`${headCell} text-sky-300`}>{r}</td>
            {cols.map((c) => {
              const v = r * c;
              const diag = r === c;
              return (
                <td
                  key={c}
                  className={`${cell} ${
                    diag
                      ? "bg-sky-500/15 text-sky-200 font-semibold"
                      : ""
                  }`}
                >
                  {v}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const KuadratTable = () => {
  const arr = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className={`${headCell} text-emerald-300`}>n</th>
          <th className={`${headCell} text-emerald-300`}>n²</th>
          <th className={`${headCell} text-emerald-300`}>n</th>
          <th className={`${headCell} text-emerald-300`}>n²</th>
          <th className={`${headCell} text-emerald-300`}>n</th>
          <th className={`${headCell} text-emerald-300`}>n²</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = arr[i];
          const b = arr[i + 10];
          const c = arr[i + 20];
          return (
            <tr key={i}>
              <td className={`${headCell} text-emerald-200`}>{a}</td>
              <td className={cell}>{a * a}</td>
              <td className={`${headCell} text-emerald-200`}>{b}</td>
              <td className={cell}>{b * b}</td>
              <td className={`${headCell} text-emerald-200`}>{c}</td>
              <td className={cell}>{c * c}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const KubikTable = () => {
  const arr = Array.from({ length: 20 }, (_, i) => i + 1);
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className={`${headCell} text-violet-300`}>n</th>
          <th className={`${headCell} text-violet-300`}>n³</th>
          <th className={`${headCell} text-violet-300`}>n</th>
          <th className={`${headCell} text-violet-300`}>n³</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = arr[i];
          const b = arr[i + 10];
          return (
            <tr key={i}>
              <td className={`${headCell} text-violet-200`}>{a}</td>
              <td className={cell}>{a * a * a}</td>
              <td className={`${headCell} text-violet-200`}>{b}</td>
              <td className={cell}>{b * b * b}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const AkarTable = () => {
  const arr = Array.from({ length: 20 }, (_, i) => i + 1);
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className={`${headCell} text-orange-300`}>√n</th>
          <th className={`${headCell} text-orange-300`}>n</th>
          <th className={`${headCell} text-orange-300`}>√n</th>
          <th className={`${headCell} text-orange-300`}>n</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = arr[i];
          const b = arr[i + 10];
          return (
            <tr key={i}>
              <td className={`${headCell} text-orange-200`}>√{a * a}</td>
              <td className={cell}>= {a}</td>
              <td className={`${headCell} text-orange-200`}>√{b * b}</td>
              <td className={cell}>= {b}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const PangkatTable = () => {
  const base = [2, 3, 4, 5];
  const exps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className={`${headCell} text-pink-300`}>basis</th>
          {exps.map((e) => (
            <th key={e} className={`${headCell} text-pink-300`}>
              ^{e}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {base.map((b) => (
          <tr key={b}>
            <td className={`${headCell} text-pink-200`}>{b}</td>
            {exps.map((e) => (
              <td key={e} className={cell}>
                {Math.pow(b, e)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const PrimaTable = () => {
  const primes: number[] = [];
  for (let n = 2; n <= 100 && primes.length < 25; n++) {
    let isP = true;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) { isP = false; break; }
    if (isP) primes.push(n);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {primes.map((p) => (
        <span
          key={p}
          className="px-2 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs font-body font-semibold"
        >
          {p}
        </span>
      ))}
    </div>
  );
};

const PecahanDesimalPersen = () => {
  const rows: [string, string, string][] = [
    ["1/2", "0,5", "50%"],
    ["1/3", "0,333…", "33,33%"],
    ["2/3", "0,666…", "66,67%"],
    ["1/4", "0,25", "25%"],
    ["3/4", "0,75", "75%"],
    ["1/5", "0,2", "20%"],
    ["2/5", "0,4", "40%"],
    ["3/5", "0,6", "60%"],
    ["4/5", "0,8", "80%"],
    ["1/6", "0,1666…", "16,67%"],
    ["5/6", "0,8333…", "83,33%"],
    ["1/8", "0,125", "12,5%"],
    ["3/8", "0,375", "37,5%"],
    ["5/8", "0,625", "62,5%"],
    ["7/8", "0,875", "87,5%"],
    ["1/10", "0,1", "10%"],
    ["1/20", "0,05", "5%"],
    ["1/25", "0,04", "4%"],
  ];
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className={`${headCell} text-rose-300`}>Pecahan</th>
          <th className={`${headCell} text-rose-300`}>Desimal</th>
          <th className={`${headCell} text-rose-300`}>Persen</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]}>
            <td className={`${headCell} text-rose-200`}>{r[0]}</td>
            <td className={cell}>{r[1]}</td>
            <td className={cell}>{r[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const SatuanTable = () => {
  const panjang: [string, string][] = [
    ["1 km", "1.000 m"],
    ["1 hm", "100 m"],
    ["1 dam", "10 m"],
    ["1 m", "10 dm = 100 cm = 1.000 mm"],
    ["1 inci", "≈ 2,54 cm"],
    ["1 kaki", "≈ 30,48 cm"],
  ];
  const massa: [string, string][] = [
    ["1 ton", "1.000 kg"],
    ["1 kuintal", "100 kg"],
    ["1 kg", "10 ons = 1.000 g"],
    ["1 ons", "100 g"],
    ["1 g", "1.000 mg"],
  ];
  const waktu: [string, string][] = [
    ["1 menit", "60 detik"],
    ["1 jam", "60 menit = 3.600 detik"],
    ["1 hari", "24 jam"],
    ["1 minggu", "7 hari"],
    ["1 bulan", "≈ 30 hari"],
    ["1 tahun", "12 bulan = 365 hari"],
  ];
  const Block = ({
    title,
    rows,
  }: {
    title: string;
    rows: [string, string][];
  }) => (
    <div className="mb-3 last:mb-0">
      <h4 className="text-amber-300 font-display text-xs font-bold mb-1">
        {title}
      </h4>
      <table className="min-w-full border-collapse">
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              <td className={`${headCell} text-amber-200 w-1/3`}>{r[0]}</td>
              <td className={cell}>{r[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return (
    <div>
      <Block title="Panjang" rows={panjang} />
      <Block title="Massa" rows={massa} />
      <Block title="Waktu" rows={waktu} />
    </div>
  );
};

const TabelReferensiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/menghitung-cepat" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <div className="text-center mb-8">
          <BookOpen className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-yellow-300 text-glow-cyan mb-2">
            TABEL REFERENSI CEPAT
          </h1>
          <p className="text-white/60 text-sm font-body">
            Kumpulan tabel hafalan inti agar kamu bisa berhitung lebih cepat:
            perkalian, kuadrat, kubik, akar, pangkat, bilangan prima, pecahan ↔
            desimal ↔ persen, hingga konversi satuan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard
            title="PERKALIAN 1 – 10"
            icon={Hash}
            color="text-sky-300"
            border="border-sky-500/30"
            desc="Tabel kali dasar 10 × 10. Hafalkan diagonalnya (kuadrat) terlebih dahulu."
          >
            <PerkalianTable />
          </SectionCard>

          <SectionCard
            title="KUADRAT 1 – 30 (n²)"
            icon={Square}
            color="text-emerald-300"
            border="border-emerald-500/30"
            desc="Daftar kuadrat dari 1 sampai 30 — sangat berguna untuk akar kuadrat dan Pythagoras."
          >
            <KuadratTable />
          </SectionCard>

          <SectionCard
            title="KUBIK 1 – 20 (n³)"
            icon={Box}
            color="text-violet-300"
            border="border-violet-500/30"
            desc="Bilangan pangkat tiga, sering muncul pada volume kubus dan akar pangkat tiga."
          >
            <KubikTable />
          </SectionCard>

          <SectionCard
            title="AKAR KUADRAT SEMPURNA"
            icon={Sigma}
            color="text-orange-300"
            border="border-orange-500/30"
            desc="Hafalkan akar dari bilangan kuadrat sempurna untuk mempercepat penyelesaian Pythagoras dan persamaan kuadrat."
          >
            <AkarTable />
          </SectionCard>

          <SectionCard
            title="PANGKAT 2, 3, 4, 5"
            icon={Sigma}
            color="text-pink-300"
            border="border-pink-500/30"
            desc="Pangkat berturut-turut. 2¹⁰ = 1024 sering dipakai pada teknologi & bilangan biner."
          >
            <PangkatTable />
          </SectionCard>

          <SectionCard
            title="BILANGAN PRIMA < 100"
            icon={Hash}
            color="text-cyan-300"
            border="border-cyan-500/30"
            desc="Hafalkan 25 bilangan prima pertama untuk mempercepat KPK, FPB, dan faktorisasi."
          >
            <PrimaTable />
          </SectionCard>

          <SectionCard
            title="PECAHAN ↔ DESIMAL ↔ PERSEN"
            icon={Percent}
            color="text-rose-300"
            border="border-rose-500/30"
            desc="Konversi cepat antara pecahan, desimal, dan persen yang paling sering muncul."
          >
            <PecahanDesimalPersen />
          </SectionCard>

          <SectionCard
            title="KONVERSI SATUAN"
            icon={Ruler}
            color="text-amber-300"
            border="border-amber-500/30"
            desc="Satuan panjang, massa, dan waktu yang wajib dikuasai."
          >
            <SatuanTable />
          </SectionCard>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-left">
            <p className="text-yellow-300 font-body text-sm font-bold mb-1">
              💡 Tips Menghafal Cepat
            </p>
            <ul className="text-white/70 text-xs font-body leading-relaxed list-disc pl-4 space-y-1">
              <li>Hafalkan diagonal tabel perkalian (kuadrat) terlebih dahulu.</li>
              <li>Latih kuadrat 11–20 dengan trik (a+b)² = a² + 2ab + b².</li>
              <li>Hafal pecahan dasar 1/2 sampai 1/10 dalam bentuk persen.</li>
              <li>Latih 5 menit setiap hari, lebih efektif daripada sekali lama.</li>
            </ul>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-left">
            <p className="text-cyan-300 font-body text-sm font-bold mb-1">
              🎯 Mengapa Tabel Ini Penting?
            </p>
            <p className="text-white/70 text-xs font-body leading-relaxed">
              Berhitung cepat sangat membantu di ujian seperti{" "}
              <strong className="text-emerald-300">ANBK, TKA, dan UN</strong>.
              Dengan menghafal tabel-tabel ini, otak kamu tidak perlu menghitung
              ulang dari nol — sehingga waktu mengerjakan soal menjadi jauh
              lebih singkat.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playPopSound();
            navigate("/menghitung-cepat");
          }}
          className="mt-8 mx-auto block text-sm text-muted-foreground hover:text-primary transition-colors font-body cursor-pointer"
        >
          ← Kembali ke Menghitung Cepat
        </button>
      </div>
    </div>
  );
};

export default TabelReferensiPage;
