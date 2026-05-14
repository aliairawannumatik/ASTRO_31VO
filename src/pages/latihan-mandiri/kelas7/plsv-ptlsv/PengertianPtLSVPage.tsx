import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const SubLabel = ({ letter, color }: { letter: string; color: string }) => (
  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${color}`}>
    {letter}
  </span>
);

const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${color}`}>
    {label}
  </span>
);

const M = ({ math }: { math: string }) => (
  <span className="inline-block"><InlineMath math={math} /></span>
);

const DashedLine = ({ color = "border-red-400/20" }: { color?: string }) => (
  <span className={`inline-block w-20 border-b ${color} align-middle mx-1`} />
);

/* ══════════════════════════════════════════════════════════
   SOAL 1 – Mudah: Baca simbol ketidaksamaan
══════════════════════════════════════════════════════════ */
const Soal1 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tuliskan dalam kalimat (kata-kata) arti dari setiap simbol ketidaksamaan berikut,
      kemudian berikan <span className="text-red-300 font-semibold">satu contoh bilangan</span> yang memenuhinya!
    </p>
    <div className="overflow-x-auto rounded-xl border border-red-500/20">
      <table className="w-full text-xs font-body">
        <thead>
          <tr className="bg-red-500/20">
            <th className="px-3 py-2 text-red-300 font-bold text-left">Simbol</th>
            <th className="px-3 py-2 text-red-300 font-bold text-left">Dibaca</th>
            <th className="px-3 py-2 text-red-300 font-bold text-left">Contoh (x = …)</th>
          </tr>
        </thead>
        <tbody>
          {[
            { simbol: "x < 5", baca: "x kurang dari 5", hint: "mis. x = 3" },
            { simbol: "x > -2", baca: "x lebih dari −2", hint: "mis. x = 0" },
            { simbol: "x \\leq 8", baca: "x kurang dari atau sama dengan 8", hint: "mis. x = 8" },
            { simbol: "x \\geq 1", baca: "x lebih dari atau sama dengan 1", hint: "mis. x = 4" },
            { simbol: "-3 < x < 7", baca: "x lebih dari −3 dan kurang dari 7", hint: "mis. x = 2" },
          ].map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-red-500/5" : "bg-transparent"}>
              <td className="px-3 py-2.5 text-white/90 font-mono"><M math={r.simbol} /></td>
              <td className="px-3 py-2.5">
                <div className="h-5 border-b border-dashed border-red-400/25 min-w-[140px]" />
              </td>
              <td className="px-3 py-2.5">
                <div className="h-5 border-b border-dashed border-red-400/25 min-w-[80px]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 2 – Mudah: Benar atau Salah
══════════════════════════════════════════════════════════ */
const Soal2 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan apakah kalimat ketidaksamaan berikut <span className="text-green-300 font-semibold">BENAR</span> atau{" "}
      <span className="text-rose-300 font-semibold">SALAH</span>!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "7 > 4", ans: "Benar" },
        { l: "b", expr: "-3 < -1", ans: "Benar" },
        { l: "c", expr: "5 \\geq 5", ans: "Benar" },
        { l: "d", expr: "0 > 2", ans: "Salah" },
        { l: "e", expr: "-5 \\geq -3", ans: "Salah" },
        { l: "f", expr: "\\frac{1}{2} < 0{,}6", ans: "Benar" },
        { l: "g", expr: "|-4| > |3|", ans: "Benar" },
        { l: "h", expr: "0{,}25 \\leq \\frac{1}{4}", ans: "Benar" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <span className="flex-1"><M math={expr} /></span>
          <span className="text-white/20 text-[11px] font-body shrink-0">Benar / Salah?</span>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 3 – Mudah: Isi simbol yang tepat
══════════════════════════════════════════════════════════ */
const Soal3 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Isilah kotak <span className="text-amber-300 font-semibold">□</span> dengan simbol yang tepat:{" "}
      <M math="<,\ >,\ \leq," /> atau <M math="\geq" />!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "a", left: "9", right: "12" },
        { l: "b", left: "-6", right: "-2" },
        { l: "c", left: "\\frac{3}{4}", right: "\\frac{2}{3}" },
        { l: "d", left: "0{,}5", right: "\\frac{1}{2}" },
        { l: "e", left: "(-3)^2", right: "3^2" },
        { l: "f", left: "|-7|", right: "|5|" },
        { l: "g", left: "\\sqrt{16}", right: "3{,}9" },
        { l: "h", left: "2^3", right: "3^2" },
      ].map(({ l, left, right }) => (
        <div key={l} className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
          <M math={left} />
          <span className="mx-2 w-8 h-7 border-2 border-dashed border-amber-400/40 rounded flex items-center justify-center text-amber-400/40 text-lg">□</span>
          <M math={right} />
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 4 – Mudah: Manakah PtLSV?
══════════════════════════════════════════════════════════ */
const Soal4 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Di antara kalimat-kalimat berikut, manakah yang merupakan{" "}
      <span className="text-orange-300 font-semibold">Pertidaksamaan Linear Satu Variabel (PtLSV)</span>?
      Jelaskan alasanmu!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "a", expr: "x + 3 > 7" },
        { l: "b", expr: "2x - 5 \\leq 9" },
        { l: "c", expr: "3x + 2y < 8" },
        { l: "d", expr: "x^2 - 1 > 0" },
        { l: "e", expr: "\\frac{n}{4} \\geq -2" },
        { l: "f", expr: "5 - 2m < 3m + 1" },
        { l: "g", expr: "pq > 12" },
        { l: "h", expr: "4 > 1" },
        { l: "i", expr: "\\frac{1}{x} < 3" },
        { l: "j", expr: "-7 + k \\geq 0" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-orange-500/5 border border-orange-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
          <M math={expr} />
        </div>
      ))}
    </div>
    <p className="text-white/40 text-[11px] font-body pl-1 italic">PtLSV yang sah: a, b, e, f, j</p>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 5 – Mudah: Tulis dengan simbol
══════════════════════════════════════════════════════════ */
const Soal5 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tulis kalimat-kalimat berikut menggunakan <span className="text-yellow-300 font-semibold">simbol ketidaksamaan</span>!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", kalimat: "x lebih dari 10" },
        { l: "b", kalimat: "y kurang dari atau sama dengan −4" },
        { l: "c", kalimat: "n tidak kurang dari 7" },
        { l: "d", kalimat: "2 kali suatu bilangan m tidak melebihi 14" },
        { l: "e", kalimat: "Selisih p dan 3 lebih dari 8" },
        { l: "f", kalimat: "Bilangan bulat k terletak antara −2 dan 5 (tidak termasuk)" },
      ].map(({ l, kalimat }) => (
        <div key={l} className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg px-4 py-3">
          <div className="flex gap-2 items-start">
            <SubLabel letter={l} color="bg-yellow-500/20 text-yellow-300 border border-yellow-400/30" />
            <p className="font-body text-sm text-white/85 flex-1">{kalimat}</p>
          </div>
          <div className="mt-2 ml-7 h-5 border-b border-dashed border-yellow-400/25 w-40" />
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 6 – Sedang: Substitusi – apakah memenuhi?
══════════════════════════════════════════════════════════ */
const Soal6 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Selidiki apakah nilai variabel yang diberikan <span className="text-teal-300 font-semibold">memenuhi</span> atau{" "}
      <span className="text-rose-300 font-semibold">tidak memenuhi</span> setiap pertidaksamaan berikut!
    </p>
    <div className="overflow-x-auto rounded-xl border border-teal-500/20">
      <table className="w-full text-xs font-body">
        <thead>
          <tr className="bg-teal-500/20">
            <th className="px-2 py-2 text-teal-300 font-bold text-left w-6"> </th>
            <th className="px-3 py-2 text-teal-300 font-bold text-left">PtLSV</th>
            <th className="px-3 py-2 text-teal-300 font-bold text-left">Nilai</th>
            <th className="px-3 py-2 text-teal-300 font-bold text-left">Memenuhi?</th>
          </tr>
        </thead>
        <tbody>
          {[
            { l: "a", ptlsv: "x + 4 > 9", nilai: "x = 5", ans: "Ya (5+4=9, tidak >9, Tidak)" },
            { l: "b", ptlsv: "3n - 2 \\leq 10", nilai: "n = 4", ans: "Ya (10≤10 ✓)" },
            { l: "c", ptlsv: "2m + 1 < 7", nilai: "m = 3", ans: "Tidak (7<7 ✗)" },
            { l: "d", ptlsv: "\\frac{y}{3} \\geq 2", nilai: "y = 6", ans: "Ya (2≥2 ✓)" },
            { l: "e", ptlsv: "5 - k > 2", nilai: "k = 4", ans: "Tidak (1>2 ✗)" },
            { l: "f", ptlsv: "-2p < 8", nilai: "p = -5", ans: "Ya (10<8 ✗ → Tidak)" },
          ].map((r, i) => (
            <tr key={r.l} className={i % 2 === 0 ? "bg-teal-500/5" : "bg-transparent"}>
              <td className="px-2 py-2.5 text-teal-400 font-bold">{r.l}.</td>
              <td className="px-3 py-2.5 text-white/85"><M math={r.ptlsv} /></td>
              <td className="px-3 py-2.5 text-white/70"><M math={r.nilai} /></td>
              <td className="px-3 py-2.5">
                <div className="h-5 border-b border-dashed border-teal-400/25 min-w-[80px]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 7 – Sedang: Notasi himpunan penyelesaian
══════════════════════════════════════════════════════════ */
const Soal7 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Diberikan <M math="x \in \mathbb{Z}" /> (bilangan bulat). Tentukan <span className="text-purple-300 font-semibold">Himpunan Penyelesaian (HP)</span> dari setiap pertidaksamaan berikut,
      kemudian gambarkan pada garis bilangan!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "x < 4" },
        { l: "b", expr: "x \\geq -3" },
        { l: "c", expr: "x \\leq 0" },
        { l: "d", expr: "-2 \\leq x < 3" },
        { l: "e", expr: "x > -5" },
        { l: "f", expr: "1 < x \\leq 6" },
      ].map(({ l, expr }) => (
        <div key={l} className="bg-purple-500/5 border border-purple-500/10 rounded-lg px-4 py-3">
          <div className="flex gap-2 items-center mb-2">
            <SubLabel letter={l} color="bg-purple-500/20 text-purple-300 border border-purple-400/30" />
            <M math={expr} />
          </div>
          <div className="ml-7 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] text-white/40 font-body">
              <span>HP =</span>
              <div className="h-5 border-b border-dashed border-purple-400/25 flex-1" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/40 font-body">
              <span>Garis bilangan:</span>
              <div className="flex-1 border-b border-white/10 relative h-5">
                <div className="absolute inset-0 border-b border-dashed border-purple-400/20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 8 – Sedang: Buat model PtLSV
══════════════════════════════════════════════════════════ */
const Soal8 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Ubah setiap pernyataan berikut menjadi <span className="text-sky-300 font-semibold">model matematika PtLSV</span>, lalu sebutkan variabelnya!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", teks: "Tiga kali suatu bilangan dikurangi 4 hasilnya kurang dari 11." },
        { l: "b", teks: "Dua lebihnya dari setengah suatu bilangan tidak melebihi 9." },
        { l: "c", teks: "Lima kali suatu bilangan ditambah 6 lebih dari 21." },
        { l: "d", teks: "Suatu bilangan jika dikurangi 8, hasilnya tidak kurang dari −3." },
        { l: "e", teks: "Empat kali setengah suatu bilangan hasilnya paling banyak 10." },
      ].map(({ l, teks }) => (
        <div key={l} className="bg-sky-500/5 border border-sky-500/10 rounded-lg px-4 py-3">
          <div className="flex gap-2 items-start mb-2">
            <SubLabel letter={l} color="bg-sky-500/20 text-sky-300 border border-sky-400/30" />
            <p className="font-body text-sm text-white/85 flex-1">{teks}</p>
          </div>
          <div className="ml-7 flex items-center gap-2">
            <span className="text-[11px] text-white/40 font-body">Model:</span>
            <div className="h-5 border-b border-dashed border-sky-400/25 flex-1" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 9 – Sedang: Pasangkan PtLSV dengan deskripsinya
══════════════════════════════════════════════════════════ */
const Soal9 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Pasangkan setiap <span className="text-lime-300 font-semibold">PtLSV</span> (kolom kiri) dengan{" "}
      <span className="text-lime-300 font-semibold">deskripsi yang tepat</span> (kolom kanan)!
    </p>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-wider mb-1">PtLSV</p>
        {[
          { id: "1", expr: "x + 5 < 3" },
          { id: "2", expr: "2x \\geq 6" },
          { id: "3", expr: "x - 7 > -4" },
          { id: "4", expr: "3 - x \\leq 1" },
          { id: "5", expr: "\\frac{x}{2} < -1" },
        ].map(({ id, expr }) => (
          <div key={id} className="flex items-center gap-2 bg-lime-500/5 border border-lime-500/10 rounded-lg px-3 py-2.5">
            <span className="w-5 h-5 rounded-full bg-lime-500/20 text-lime-300 text-[10px] font-bold flex items-center justify-center shrink-0">{id}</span>
            <M math={expr} />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-wider mb-1">Deskripsi</p>
        {[
          { id: "P", desc: "x lebih dari 3" },
          { id: "Q", desc: "x paling sedikit 3" },
          { id: "R", desc: "x kurang dari −2" },
          { id: "S", desc: "x tidak lebih dari −2" },
          { id: "T", desc: "x tidak kurang dari 2" },
        ].map(({ id, desc }) => (
          <div key={id} className="flex items-center gap-2 bg-lime-500/5 border border-lime-500/10 rounded-lg px-3 py-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0">{id}</span>
            <span className="text-white/75 text-[11px] font-body">{desc}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-lime-500/5 border border-lime-500/10 rounded-lg px-4 py-2.5 ml-1">
      <p className="text-[11px] text-white/40 font-body">Jawaban: <DashedLine color="border-lime-400/20" /></p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 10 – Sedang: Garis bilangan → notasi
══════════════════════════════════════════════════════════ */
const Soal10 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Perhatikan setiap gambar garis bilangan berikut. Tuliskan{" "}
      <span className="text-indigo-300 font-semibold">notasi pertidaksamaannya</span>!
    </p>
    <div className="space-y-4 pl-1">
      {[
        {
          l: "a",
          desc: "Garis bilangan dengan lingkaran terbuka di x = 3, anak panah ke kanan",
          ans: "x > 3",
          visual: { start: -1, end: 7, open: 3, dir: "right" },
        },
        {
          l: "b",
          desc: "Garis bilangan dengan lingkaran tertutup di x = −2, anak panah ke kiri",
          ans: "x ≤ −2",
          visual: { start: -5, end: 2, open: -2, dir: "left" },
        },
        {
          l: "c",
          desc: "Garis bilangan dengan lingkaran tertutup di x = 1 dan lingkaran terbuka di x = 5, diarsir di antara keduanya",
          ans: "1 ≤ x < 5",
          visual: null,
        },
        {
          l: "d",
          desc: "Garis bilangan dengan lingkaran terbuka di x = −4, anak panah ke kanan",
          ans: "x > −4",
          visual: null,
        },
        {
          l: "e",
          desc: "Garis bilangan dengan lingkaran tertutup di x = 0, anak panah ke kiri",
          ans: "x ≤ 0",
          visual: null,
        },
      ].map(({ l, desc }) => (
        <div key={l} className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-4 py-3">
          <div className="flex gap-2 items-start mb-2">
            <SubLabel letter={l} color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
            <p className="font-body text-[11px] text-white/60 italic flex-1">[{desc}]</p>
          </div>
          <div className="ml-7 flex items-center gap-2">
            <span className="text-[11px] text-white/40 font-body">Notasi:</span>
            <div className="h-5 border-b border-dashed border-indigo-400/25 flex-1" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 11 – Sedang: Ekuivalen Pertidaksamaan
══════════════════════════════════════════════════════════ */
const Soal11 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan apakah pasangan pertidaksamaan berikut <span className="text-cyan-300 font-semibold">ekuivalen</span> atau{" "}
      <span className="text-rose-300 font-semibold">tidak ekuivalen</span>! (Dua PtLSV dikatakan ekuivalen jika mempunyai HP yang sama.)
    </p>
    <div className="space-y-2.5 pl-1">
      {[
        { l: "a", p1: "x + 3 < 7", p2: "x < 4" },
        { l: "b", p1: "2x \\geq 8", p2: "x \\geq 3" },
        { l: "c", p1: "x - 5 > 1", p2: "x > 6" },
        { l: "d", p1: "3x \\leq 12", p2: "x \\leq 4" },
        { l: "e", p1: "-x < 2", p2: "x > -2" },
        { l: "f", p1: "\\frac{x}{2} > 3", p2: "x > 5" },
      ].map(({ l, p1, p2 }) => (
        <div key={l} className="flex items-center gap-2.5 bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-3 py-2.5">
          <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 flex-1">
            <M math={p1} />
            <span className="text-white/30 text-xs font-body">dan</span>
            <M math={p2} />
          </div>
          <div className="h-5 border-b border-dashed border-cyan-400/25 w-24 shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 12 – Sulit: Analisis sifat pertidaksamaan
══════════════════════════════════════════════════════════ */
const Soal12 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Diketahui <M math="a > b" />. Tentukan apakah pertidaksamaan berikut <span className="text-violet-300 font-semibold">pasti benar, pasti salah, atau belum tentu</span>,
      kemudian berikan contoh pembuktian!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "a + 3 > b + 3" },
        { l: "b", expr: "a - 5 > b - 5" },
        { l: "c", expr: "3a > 3b" },
        { l: "d", expr: "-2a > -2b" },
        { l: "e", expr: "a^2 > b^2" },
        { l: "f", expr: "\\frac{a}{c} > \\frac{b}{c},\\ c > 0" },
        { l: "g", expr: "\\frac{a}{c} < \\frac{b}{c},\\ c < 0" },
        { l: "h", expr: "|a| > |b|" },
      ].map(({ l, expr }) => (
        <div key={l} className="bg-violet-500/5 border border-violet-500/10 rounded-lg px-4 py-3">
          <div className="flex gap-2 items-center mb-2">
            <SubLabel letter={l} color="bg-violet-500/20 text-violet-300 border border-violet-400/30" />
            <M math={expr} />
          </div>
          <div className="ml-7 flex items-center gap-2">
            <div className="h-5 border-b border-dashed border-violet-400/25 flex-1" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 13 – Sulit: PtLSV dengan pecahan
══════════════════════════════════════════════════════════ */
const Soal13 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Selidiki apakah nilai berikut merupakan <span className="text-fuchsia-300 font-semibold">penyelesaian</span> dari masing-masing PtLSV!
      Tunjukkan langkah substitusinya secara lengkap.
    </p>
    <div className="space-y-3 pl-1">
      {[
        {
          l: "a",
          ptlsv: "\\frac{2x-1}{3} < 5",
          nilai: [
            { v: "x = 8", ans: "Memenuhi?" },
            { v: "x = 9", ans: "Memenuhi?" },
          ],
        },
        {
          l: "b",
          ptlsv: "\\frac{3n+2}{4} \\geq 5",
          nilai: [
            { v: "n = 6", ans: "Memenuhi?" },
            { v: "n = 5", ans: "Memenuhi?" },
          ],
        },
        {
          l: "c",
          ptlsv: "2 - \\frac{m}{5} > 0",
          nilai: [
            { v: "m = 9", ans: "Memenuhi?" },
            { v: "m = 11", ans: "Memenuhi?" },
          ],
        },
      ].map(({ l, ptlsv, nilai }) => (
        <div key={l} className="bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-xl px-4 py-3">
          <div className="flex gap-2 items-center mb-3">
            <SubLabel letter={l} color="bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30" />
            <M math={ptlsv} />
          </div>
          <div className="ml-7 grid grid-cols-2 gap-2">
            {nilai.map(({ v }, idx) => (
              <div key={idx} className="bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-lg px-3 py-2">
                <p className="text-[11px] text-white/60 font-body mb-1"><M math={v} /></p>
                <div className="h-5 border-b border-dashed border-fuchsia-400/20 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 14 – Sulit: Pertidaksamaan ganda
══════════════════════════════════════════════════════════ */
const Soal14 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Tentukan himpunan nilai <M math="x" /> yang memenuhi <span className="text-pink-300 font-semibold">pertidaksamaan ganda</span> berikut,
      dengan <M math="x \in \mathbb{Z}" />!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", expr: "-3 < x + 1 \\leq 5" },
        { l: "b", expr: "2 \\leq 2x - 4 < 10" },
        { l: "c", expr: "-1 < \\frac{x}{2} < 4" },
        { l: "d", expr: "0 \\leq 3x + 3 \\leq 12" },
        { l: "e", expr: "-5 < 2 - x \\leq 3" },
        { l: "f", expr: "1 < \\frac{x+3}{2} \\leq 4" },
      ].map(({ l, expr }) => (
        <div key={l} className="bg-pink-500/5 border border-pink-500/10 rounded-lg px-3 py-2.5 flex items-center gap-3">
          <SubLabel letter={l} color="bg-pink-500/20 text-pink-300 border border-pink-400/30" />
          <M math={expr} />
          <span className="ml-auto text-[11px] text-white/30 font-body shrink-0">HP = …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 15 – Sulit: Analisis PtLSV vs PLSV
══════════════════════════════════════════════════════════ */
const Soal15 = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Perhatikan pasangan kalimat matematis berikut. Untuk setiap pasangan:
      <br />(i) Tentukan mana yang merupakan <span className="text-amber-300 font-semibold">PLSV</span> dan mana{" "}
      <span className="text-red-300 font-semibold">PtLSV</span>.
      <br />(ii) Tentukan semua nilai <M math="x \in \{-2, -1, 0, 1, 2, 3\}" /> yang memenuhi <strong>kedua-duanya sekaligus</strong>.
    </p>
    <div className="space-y-3 pl-1">
      {[
        { l: "a", plsv: "x + 3 = 5", ptlsv: "x + 1 < 4" },
        { l: "b", plsv: "2x - 1 = 3", ptlsv: "x \\geq 2" },
        { l: "c", plsv: "3x = 9", ptlsv: "x \\leq 4" },
      ].map(({ l, plsv, ptlsv }) => (
        <div key={l} className="bg-amber-500/5 border border-amber-500/10 rounded-xl px-4 py-3">
          <div className="flex gap-2 items-center mb-2">
            <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
            <M math={plsv} />
            <span className="text-white/30 text-xs mx-1">dan</span>
            <M math={ptlsv} />
          </div>
          <div className="ml-7 space-y-1">
            <div className="flex items-center gap-2 text-[11px] text-white/40 font-body">
              <span>(i) PLSV:</span>
              <div className="border-b border-dashed border-amber-400/20 flex-1" />
              <span>PtLSV:</span>
              <div className="border-b border-dashed border-amber-400/20 flex-1" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/40 font-body">
              <span>(ii) Keduanya terpenuhi saat x =</span>
              <div className="border-b border-dashed border-amber-400/20 flex-1 min-w-[60px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 16 – Kontekstual: Tinggi badan minimum
══════════════════════════════════════════════════════════ */
const Soal16 = () => (
  <div className="space-y-3">
    <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
      <span className="text-2xl shrink-0">🎡</span>
      <p className="font-body text-sm text-white/90 leading-relaxed">
        Sebuah wahana permainan di taman hiburan mensyaratkan pengunjung harus memiliki tinggi badan{" "}
        <span className="text-green-300 font-semibold">minimal 130 cm</span>.
        Adik berusia 10 tahun dengan tinggi badan <M math="t" /> cm ingin menaiki wahana tersebut.
      </p>
    </div>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", q: "Tuliskan pertidaksamaan yang menyatakan syarat tinggi badan Adik agar bisa menaiki wahana tersebut!" },
        { l: "b", q: "Jika tinggi badan Adik sekarang 125 cm, apakah Adik bisa naik? Jelaskan!" },
        { l: "c", q: "Berapa cm minimal Adik harus tumbuh agar bisa menaiki wahana tersebut?" },
        { l: "d", q: "Jika tinggi badan rata-rata anak 10 tahun bertambah 6 cm per tahun, tuliskan pertidaksamaan untuk menentukan berapa tahun lagi Adik bisa naik wahana itu!" },
      ].map(({ l, q }) => (
        <div key={l} className="bg-green-500/5 border border-green-500/10 rounded-lg px-4 py-3">
          <div className="flex gap-2 items-start mb-2">
            <SubLabel letter={l} color="bg-green-500/20 text-green-300 border border-green-400/30" />
            <p className="font-body text-sm text-white/85 flex-1">{q}</p>
          </div>
          <div className="ml-7 h-5 border-b border-dashed border-green-400/20" />
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 17 – Kontekstual: Budget belanja
══════════════════════════════════════════════════════════ */
const Soal17 = () => (
  <div className="space-y-3">
    <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
      <span className="text-2xl shrink-0">🛍️</span>
      <p className="font-body text-sm text-white/90 leading-relaxed">
        Rina memiliki uang <span className="text-emerald-300 font-semibold">Rp 50.000</span>. Ia ingin membeli beberapa buku tulis
        yang harganya <span className="text-emerald-300 font-semibold">Rp 7.500 per buah</span>, dan menyisakan uang{" "}
        <span className="text-emerald-300 font-semibold">minimal Rp 5.000</span> untuk ongkos pulang.
      </p>
    </div>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", q: "Misalkan Rina membeli x buah buku tulis. Tuliskan pertidaksamaan yang menggambarkan situasi ini!" },
        { l: "b", q: "Berapa buku maksimal yang bisa dibeli Rina? Tunjukkan penyelesaiannya!" },
        { l: "c", q: "Berapa sisa uang Rina jika membeli buku sebanyak yang diperbolehkan?" },
        { l: "d", q: "Apakah Rina bisa membeli 6 buah buku? Jelaskan dengan menyubstitusikan nilainya!" },
      ].map(({ l, q }) => (
        <div key={l} className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-4 py-3">
          <div className="flex gap-2 items-start mb-2">
            <SubLabel letter={l} color="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" />
            <p className="font-body text-sm text-white/85 flex-1">{q}</p>
          </div>
          <div className="ml-7 h-5 border-b border-dashed border-emerald-400/20" />
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 18 – Kontekstual: Kapasitas lift
══════════════════════════════════════════════════════════ */
const Soal18 = () => (
  <div className="space-y-3">
    <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
      <span className="text-2xl shrink-0">🏢</span>
      <p className="font-body text-sm text-white/90 leading-relaxed">
        Sebuah lift di gedung perkantoran memiliki kapasitas maksimal{" "}
        <span className="text-orange-300 font-semibold">800 kg</span>. Rata-rata berat 1 orang dewasa adalah{" "}
        <span className="text-orange-300 font-semibold">65 kg</span>. Saat ini sudah ada 3 orang di dalam lift.
      </p>
    </div>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", q: "Tuliskan pertidaksamaan untuk menentukan berapa orang lagi (misalkan x) yang boleh masuk ke dalam lift!" },
        { l: "b", q: "Selesaikan pertidaksamaanmu dan tentukan jumlah orang maksimal yang boleh ditambahkan!" },
        { l: "c", q: "Jika lift sudah terisi 3 orang dan ada 5 orang lagi ingin masuk, apakah masih aman? Jelaskan!" },
        { l: "d", q: "Gambarkan penyelesaian pada garis bilangan, dengan x = bilangan cacah!" },
      ].map(({ l, q }) => (
        <div key={l} className="bg-orange-500/5 border border-orange-500/10 rounded-lg px-4 py-3">
          <div className="flex gap-2 items-start mb-2">
            <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
            <p className="font-body text-sm text-white/85 flex-1">{q}</p>
          </div>
          <div className="ml-7 h-5 border-b border-dashed border-orange-400/20" />
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 19 – Kontekstual: Nilai ujian
══════════════════════════════════════════════════════════ */
const Soal19 = () => (
  <div className="space-y-3">
    <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
      <span className="text-2xl shrink-0">📝</span>
      <p className="font-body text-sm text-white/90 leading-relaxed">
        Dani telah mengikuti 4 kali ulangan matematika dengan nilai{" "}
        <span className="text-blue-300 font-semibold">72, 80, 68, dan 76</span>.
        Agar nilai rata-rata Dani <span className="text-blue-300 font-semibold">minimal 75</span>,
        berapakah nilai minimal yang harus diperoleh Dani pada ulangan ke-5?
      </p>
    </div>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", q: "Misalkan nilai ulangan ke-5 adalah n. Tuliskan pertidaksamaan untuk situasi ini!" },
        { l: "b", q: "Selesaikan pertidaksamaan tersebut!" },
        { l: "c", q: "Berapakah nilai minimal Dani pada ulangan ke-5? Apakah nilai ini realistis (0–100)?" },
        { l: "d", q: "Jika Dani mendapat nilai 79 pada ulangan ke-5, apakah rata-ratanya sudah mencapai target?" },
      ].map(({ l, q }) => (
        <div key={l} className="bg-blue-500/5 border border-blue-500/10 rounded-lg px-4 py-3">
          <div className="flex gap-2 items-start mb-2">
            <SubLabel letter={l} color="bg-blue-500/20 text-blue-300 border border-blue-400/30" />
            <p className="font-body text-sm text-white/85 flex-1">{q}</p>
          </div>
          <div className="ml-7 h-5 border-b border-dashed border-blue-400/20" />
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 20 – Kontekstual: Kecepatan kendaraan
══════════════════════════════════════════════════════════ */
const Soal20 = () => (
  <div className="space-y-3">
    <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
      <span className="text-2xl shrink-0">🚗</span>
      <p className="font-body text-sm text-white/90 leading-relaxed">
        Batas kecepatan di jalan tol adalah <span className="text-amber-300 font-semibold">paling cepat 60 km/jam</span> dan{" "}
        <span className="text-amber-300 font-semibold">paling lambat 120 km/jam</span>.
        Sebuah mobil melaju dengan kecepatan <M math="v" /> km/jam.
      </p>
    </div>
    <div className="space-y-2 pl-1">
      {[
        { l: "a", q: "Tuliskan pertidaksamaan ganda yang menyatakan kecepatan mobil yang sesuai aturan!" },
        { l: "b", q: "Apakah kecepatan 55 km/jam dan 130 km/jam memenuhi aturan? Jelaskan!" },
        { l: "c", q: "Jika pengendara didenda saat kecepatannya melebihi batas, tuliskan pertidaksamaan untuk kecepatan yang akan terkena denda!" },
        { l: "d", q: "Gambarlah himpunan penyelesaian dari pertidaksamaan pada (a) di garis bilangan!" },
      ].map(({ l, q }) => (
        <div key={l} className="bg-amber-500/5 border border-amber-500/10 rounded-lg px-4 py-3">
          <div className="flex gap-2 items-start mb-2">
            <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
            <p className="font-body text-sm text-white/85 flex-1">{q}</p>
          </div>
          <div className="ml-7 h-5 border-b border-dashed border-amber-400/20" />
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 21 – UN: Pilihan Ganda format UN
══════════════════════════════════════════════════════════ */
const Soal21 = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-full px-3 py-0.5 font-body font-bold">Format Ujian Nasional</span>
    </div>
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Pilihlah jawaban yang paling tepat! (Pilihan Ganda)
    </p>
    <div className="space-y-4">
      {[
        {
          no: 1,
          soal: "Kalimat matematika 3x - 5 < 10 merupakan …",
          opts: [
            "A. Persamaan linear satu variabel",
            "B. Pertidaksamaan linear satu variabel",
            "C. Pertidaksamaan linear dua variabel",
            "D. Persamaan kuadrat",
          ],
          kunci: "B",
        },
        {
          no: 2,
          soal: "Di antara kalimat berikut yang bukan merupakan PtLSV adalah …",
          opts: [
            "A. 2n + 1 > 7",
            "B. 3x² < 12",
            "C. 4m − 3 ≤ 9",
            "D. 5 − k ≥ 0",
          ],
          kunci: "B",
        },
        {
          no: 3,
          soal: "Nilai x = 4 memenuhi pertidaksamaan …",
          opts: [
            "A. x + 5 < 8",
            "B. 2x − 3 > 6",
            "C. 3x − 2 ≤ 10",
            "D. x + 7 < 10",
          ],
          kunci: "C",
        },
        {
          no: 4,
          soal: 'Notasi pertidaksamaan yang menyatakan "x paling banyak 7" adalah …',
          opts: ["A. x < 7", "B. x > 7", "C. x ≤ 7", "D. x ≥ 7"],
          kunci: "C",
        },
        {
          no: 5,
          soal: "Jika a < b, maka pernyataan yang benar adalah …",
          opts: [
            "A. a + 3 > b + 3",
            "B. a − 2 < b − 2",
            "C. 2a > 2b",
            "D. −a < −b",
          ],
          kunci: "B",
        },
      ].map(({ no, soal, opts, kunci }) => (
        <div key={no} className="bg-blue-900/20 border border-blue-500/20 rounded-xl px-4 py-3">
          <p className="font-body text-sm text-white/90 leading-relaxed mb-2">
            <span className="text-blue-300 font-bold mr-1">{no}.</span> {soal}
          </p>
          <div className="space-y-1 pl-4">
            {opts.map((opt) => (
              <div key={opt} className="flex items-center gap-2 text-sm text-white/70 font-body">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/40 shrink-0" />
                {opt}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/20 font-body mt-2 ml-4 italic">Kunci: {kunci}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 22 – UN: Lanjutan pilihan ganda UN
══════════════════════════════════════════════════════════ */
const Soal22 = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-full px-3 py-0.5 font-body font-bold">Format Ujian Nasional</span>
    </div>
    <div className="space-y-4">
      {[
        {
          no: 6,
          soal: "Dari bilangan-bilangan {0, 1, 2, 3, 4, 5}, yang memenuhi 2x − 1 < 5 adalah …",
          opts: ["A. {0, 1, 2}", "B. {0, 1, 2, 3}", "C. {1, 2, 3}", "D. {2, 3, 4}"],
          kunci: "A",
        },
        {
          no: 7,
          soal: "Pertidaksamaan yang setara dengan x + 8 > 12 adalah …",
          opts: ["A. x > 20", "B. x < 4", "C. x > 4", "D. x < 20"],
          kunci: "C",
        },
        {
          no: 8,
          soal: "Manakah yang merupakan kalimat terbuka dan termasuk PtLSV?",
          opts: [
            "A. 5 > 3",
            "B. 2 + 3 < 6",
            "C. x + 4 > 10",
            "D. x² + 1 ≠ 0",
          ],
          kunci: "C",
        },
        {
          no: 9,
          soal: `Simbol yang tepat untuk melengkapi "−3 □ −5" adalah …`,
          opts: ["A. <", "B. >", "C. =", "D. ≤"],
          kunci: "B",
        },
        {
          no: 10,
          soal: `Pernyataan "dua kali suatu bilangan n tidak kurang dari 8" ditulis dalam simbol sebagai …`,
          opts: ["A. 2n < 8", "B. 2n > 8", "C. 2n ≤ 8", "D. 2n ≥ 8"],
          kunci: "D",
        },
      ].map(({ no, soal, opts, kunci }) => (
        <div key={no} className="bg-blue-900/20 border border-blue-500/20 rounded-xl px-4 py-3">
          <p className="font-body text-sm text-white/90 leading-relaxed mb-2">
            <span className="text-blue-300 font-bold mr-1">{no}.</span> {soal}
          </p>
          <div className="space-y-1 pl-4">
            {opts.map((opt) => (
              <div key={opt} className="flex items-center gap-2 text-sm text-white/70 font-body">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/40 shrink-0" />
                {opt}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/20 font-body mt-2 ml-4 italic">Kunci: {kunci}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 23 – ANBK: Pilihan Ganda Kompleks
══════════════════════════════════════════════════════════ */
const Soal23 = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-full px-3 py-0.5 font-body font-bold">Format ANBK – PGK</span>
    </div>
    <p className="font-body text-sm text-white/60 leading-relaxed italic">
      Soal berikut menggunakan format Pilihan Ganda Kompleks (PGK) ANBK — pilih SEMUA pernyataan yang BENAR.
    </p>
    <div className="space-y-4">
      {[
        {
          no: 1,
          konteks: "Sebuah kotak kue dapat menampung paling banyak 24 kue. Saat ini sudah ada 9 kue di dalamnya. Misalkan x adalah banyak kue yang bisa ditambahkan.",
          pernyataan: [
            { id: "A", teks: "Model pertidaksamaannya adalah x + 9 ≤ 24", benar: true },
            { id: "B", teks: "Nilai x maksimum adalah 15", benar: true },
            { id: "C", teks: "x = 16 memenuhi pertidaksamaan tersebut", benar: false },
            { id: "D", teks: "Pertidaksamaan tersebut termasuk PtLSV", benar: true },
            { id: "E", teks: "HP = {x | x ≤ 15, x ∈ bilangan cacah}", benar: true },
          ],
        },
        {
          no: 2,
          konteks: "Perhatikan kalimat-kalimat berikut:",
          pernyataan: [
            { id: "A", teks: "2x + 3 < 11 adalah PtLSV karena memuat satu variabel, berderajat 1, dan menggunakan tanda <", benar: true },
            { id: "B", teks: "x² + 5 > 0 adalah PtLSV karena memuat satu variabel dan menggunakan tanda >", benar: false },
            { id: "C", teks: "3 < 7 adalah pertidaksamaan tetapi bukan PtLSV karena tidak memuat variabel", benar: true },
            { id: "D", teks: "3x − 2y ≥ 5 adalah PtLSV karena menggunakan simbol ≥", benar: false },
            { id: "E", teks: "−4m ≤ 12 adalah PtLSV", benar: true },
          ],
        },
      ].map(({ no, konteks, pernyataan }) => (
        <div key={no} className="bg-purple-900/20 border border-purple-500/20 rounded-xl px-4 py-4">
          <p className="font-body text-sm text-white/90 leading-relaxed mb-3">
            <span className="text-purple-300 font-bold mr-1">{no}.</span> {konteks}
          </p>
          <div className="space-y-2">
            {pernyataan.map(({ id, teks }) => (
              <div key={id} className="flex items-start gap-2.5 bg-purple-500/5 border border-purple-500/10 rounded-lg px-3 py-2">
                <span className="w-5 h-5 rounded border-2 border-purple-400/40 shrink-0 mt-0.5" />
                <span className="text-[12px] text-white/75 font-body">
                  <span className="text-purple-300 font-bold">{id}.</span> {teks}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 24 – ANBK: Isian Singkat & Menjodohkan
══════════════════════════════════════════════════════════ */
const Soal24 = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-full px-3 py-0.5 font-body font-bold">Format ANBK – Isian & Menjodohkan</span>
    </div>

    <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl px-4 py-4 space-y-4">
      <p className="text-purple-300 text-[11px] font-bold uppercase tracking-wider">A. Isian Singkat</p>
      {[
        {
          no: 1,
          soal: "Seorang siswa harus mengumpulkan minimal 60 poin untuk naik kelas. Ia sudah mengumpulkan 42 poin. Pertidaksamaan yang menyatakan banyak poin tambahan p yang harus dikumpulkan adalah …",
        },
        {
          no: 2,
          soal: "Jika x < 5 dan x merupakan bilangan bulat positif, maka HP-nya adalah …",
        },
        {
          no: 3,
          soal: `Kalimat "tidak lebih dari" dalam matematika ditulis dengan simbol …`,
        },
        {
          no: 4,
          soal: "Pertidaksamaan 4 > −1 bernilai … (benar / salah)",
        },
        {
          no: 5,
          soal: "Jika a > 0 maka −3a … 0 (isi dengan < atau >)",
        },
      ].map(({ no, soal }) => (
        <div key={no} className="space-y-1">
          <p className="font-body text-sm text-white/85 leading-relaxed">
            <span className="text-purple-300 font-bold mr-1">{no}.</span> {soal}
          </p>
          <div className="flex items-center gap-2 pl-4">
            <span className="text-[11px] text-white/30 font-body">Jawaban:</span>
            <div className="h-5 border-b border-dashed border-purple-400/20 flex-1" />
          </div>
        </div>
      ))}
    </div>

    <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl px-4 py-4 space-y-3">
      <p className="text-purple-300 text-[11px] font-bold uppercase tracking-wider">B. Menjodohkan Konteks dengan Model</p>
      <div className="grid grid-cols-2 gap-3 text-xs font-body">
        <div className="space-y-2">
          <p className="text-white/40 text-[10px] uppercase tracking-wider">Situasi</p>
          {[
            { id: "1", teks: "Suhu kulkas harus di bawah 4°C" },
            { id: "2", teks: "Koper tidak boleh melebihi 20 kg" },
            { id: "3", teks: "Siswa harus hadir minimal 75% dari 40 pertemuan" },
            { id: "4", teks: "Nilai antara 60 dan 80 (inklusif)" },
          ].map(({ id, teks }) => (
            <div key={id} className="flex gap-2 items-start bg-purple-500/5 border border-purple-500/10 rounded-lg px-2 py-2">
              <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 text-[9px] font-bold flex items-center justify-center shrink-0">{id}</span>
              <span className="text-white/70 text-[10px] leading-tight">{teks}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-white/40 text-[10px] uppercase tracking-wider">Model PtLSV</p>
          {[
            { id: "P", expr: "k \\leq 20" },
            { id: "Q", expr: "60 \\leq n \\leq 80" },
            { id: "R", expr: "t < 4" },
            { id: "S", expr: "h \\geq 30" },
          ].map(({ id, expr }) => (
            <div key={id} className="flex gap-2 items-center bg-purple-500/5 border border-purple-500/10 rounded-lg px-2 py-2">
              <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 text-[9px] font-bold flex items-center justify-center shrink-0">{id}</span>
              <M math={expr} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 pl-1">
        <span className="text-[11px] text-white/30 font-body">Pasangan:</span>
        <div className="h-5 border-b border-dashed border-purple-400/20 flex-1" />
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 25 – ANBK: Benar-Salah Kontekstual
══════════════════════════════════════════════════════════ */
const Soal25 = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-full px-3 py-0.5 font-body font-bold">Format ANBK – Benar/Salah</span>
    </div>
    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-2">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <span className="text-rose-300 font-bold">Wacana:</span> Seorang petani memiliki lahan seluas <M math="L" /> m². Ia berencana
        menanam jagung di bagian lahan tersebut. Setiap baris memerlukan panjang minimal 3 m dan maksimal 10 m.
        Panjang satu baris tanam dinyatakan dengan variabel <M math="p" />.
      </p>
    </div>
    <div className="space-y-2">
      {[
        { no: 1, pernyataan: "Model pertidaksamaan yang tepat adalah 3 ≤ p ≤ 10", benar: true },
        { no: 2, pernyataan: "p = 2 memenuhi pertidaksamaan tersebut", benar: false },
        { no: 3, pernyataan: "p = 10 tidak memenuhi pertidaksamaan tersebut", benar: false },
        { no: 4, pernyataan: "Pertidaksamaan ini termasuk pertidaksamaan ganda / majemuk", benar: true },
        { no: 5, pernyataan: "Jika p = 7,5 maka pertidaksamaan terpenuhi", benar: true },
        { no: 6, pernyataan: "Himpunan penyelesaian untuk p ∈ bilangan bulat adalah {3, 4, 5, 6, 7, 8, 9, 10}", benar: true },
        { no: 7, pernyataan: "Pertidaksamaan 3 ≤ p ≤ 10 ekuivalen dengan p < 3 atau p > 10", benar: false },
        { no: 8, pernyataan: "Simbol ≤ dibaca 'kurang dari atau sama dengan'", benar: true },
      ].map(({ no, pernyataan }) => (
        <div key={no} className="bg-rose-500/5 border border-rose-500/10 rounded-lg px-4 py-3">
          <p className="font-body text-sm text-white/85 mb-2">
            <span className="text-rose-300 font-bold mr-1">{no}.</span> {pernyataan}
          </p>
          <div className="flex items-center gap-4 pl-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span className="w-4 h-4 rounded border border-green-400/40 flex items-center justify-center bg-green-500/10 text-[8px] text-green-300">✓</span>
              <span className="text-[11px] text-green-300 font-body">Benar</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span className="w-4 h-4 rounded border border-rose-400/40 flex items-center justify-center bg-rose-500/10 text-[8px] text-rose-300">✗</span>
              <span className="text-[11px] text-rose-300 font-body">Salah</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SOAL 26 – ANBK: Uraian Terstruktur
══════════════════════════════════════════════════════════ */
const Soal26 = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-full px-3 py-0.5 font-body font-bold">Format ANBK – Uraian Terstruktur</span>
    </div>
    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        <span className="text-indigo-300 font-bold">Wacana:</span> Kelas 7A sedang mengadakan penggalangan dana. Mereka menargetkan
        mengumpulkan dana <span className="text-indigo-300 font-semibold">lebih dari Rp 500.000</span>.
        Setiap siswa diminta menyumbang sejumlah yang sama, yaitu <M math="s" /> rupiah.
        Kelas 7A memiliki <span className="text-indigo-300 font-semibold">32 siswa</span>.
      </p>
    </div>
    <div className="space-y-3">
      {[
        {
          no: "a",
          q: "Tuliskan pertidaksamaan yang menyatakan bahwa target penggalangan dana dapat tercapai!",
          poin: 2,
        },
        {
          no: "b",
          q: "Tentukan nilai minimum s yang memenuhi pertidaksamaan tersebut! (Nyatakan dalam rupiah)",
          poin: 3,
        },
        {
          no: "c",
          q: "Jika setiap siswa menyumbang Rp 16.000, apakah target tercapai? Buktikan dengan substitusi!",
          poin: 2,
        },
        {
          no: "d",
          q: "Gambarkan himpunan penyelesaian pada garis bilangan (s dalam ribuan rupiah, s > 0)!",
          poin: 2,
        },
        {
          no: "e",
          q: "Jika 5 siswa tidak bisa menyumbang, berapa minimal sumbangan tiap siswa yang tersisa agar target tetap tercapai? Susun pertidaksamaan baru dan selesaikan!",
          poin: 3,
        },
      ].map(({ no, q, poin }) => (
        <div key={no} className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl px-4 py-3">
          <div className="flex gap-2 items-start mb-2">
            <SubLabel letter={no} color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
            <p className="font-body text-sm text-white/85 flex-1 leading-relaxed">{q}</p>
            <span className="text-[10px] text-indigo-300/50 font-body shrink-0">[{poin} poin]</span>
          </div>
          <div className="ml-7 space-y-1.5">
            <div className="h-5 border-b border-dashed border-indigo-400/20" />
            <div className="h-5 border-b border-dashed border-indigo-400/20" />
            <div className="h-5 border-b border-dashed border-indigo-400/20" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   CARD CONFIG
══════════════════════════════════════════════════════════ */
const cards = [
  {
    num: 1, tag: "Mudah", tagColor: "bg-red-500/20 text-red-300 border-red-400/40",
    gradient: "from-red-900/50 to-rose-900/30", border: "border-red-500/25",
    bar: "from-red-400 to-rose-500", numBg: "bg-red-500/30 text-red-200",
    subtitle: "Baca & Tulis Simbol Ketidaksamaan",
    custom: <Soal1 />,
  },
  {
    num: 2, tag: "Mudah", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/45 to-red-900/30", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    subtitle: "Ketidaksamaan Benar atau Salah",
    custom: <Soal2 />,
  },
  {
    num: 3, tag: "Mudah", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/50 to-yellow-900/30", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    subtitle: "Isi Simbol yang Tepat",
    custom: <Soal3 />,
  },
  {
    num: 4, tag: "Mudah", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/50 to-amber-900/30", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    subtitle: "Identifikasi PtLSV",
    custom: <Soal4 />,
  },
  {
    num: 5, tag: "Mudah", tagColor: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
    gradient: "from-yellow-900/45 to-lime-900/30", border: "border-yellow-500/25",
    bar: "from-yellow-400 to-lime-500", numBg: "bg-yellow-500/30 text-yellow-200",
    subtitle: "Ubah Kalimat ke Simbol",
    custom: <Soal5 />,
  },
  {
    num: 6, tag: "Sedang", tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    gradient: "from-teal-900/50 to-cyan-900/30", border: "border-teal-500/25",
    bar: "from-teal-400 to-cyan-500", numBg: "bg-teal-500/30 text-teal-200",
    subtitle: "Uji Penyelesaian PtLSV",
    custom: <Soal6 />,
  },
  {
    num: 7, tag: "Sedang", tagColor: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    gradient: "from-purple-900/50 to-indigo-900/30", border: "border-purple-500/25",
    bar: "from-purple-400 to-indigo-500", numBg: "bg-purple-500/30 text-purple-200",
    subtitle: "Himpunan Penyelesaian & Garis Bilangan",
    custom: <Soal7 />,
  },
  {
    num: 8, tag: "Sedang", tagColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    gradient: "from-sky-900/50 to-blue-900/30", border: "border-sky-500/25",
    bar: "from-sky-400 to-blue-500", numBg: "bg-sky-500/30 text-sky-200",
    subtitle: "Buat Model Matematika PtLSV",
    custom: <Soal8 />,
  },
  {
    num: 9, tag: "Sedang", tagColor: "bg-lime-500/20 text-lime-300 border-lime-400/40",
    gradient: "from-lime-900/50 to-green-900/30", border: "border-lime-500/25",
    bar: "from-lime-400 to-green-500", numBg: "bg-lime-500/30 text-lime-200",
    subtitle: "Pasangkan PtLSV dengan Deskripsi",
    custom: <Soal9 />,
  },
  {
    num: 10, tag: "Sedang", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    gradient: "from-indigo-900/50 to-purple-900/30", border: "border-indigo-500/25",
    bar: "from-indigo-400 to-purple-500", numBg: "bg-indigo-500/30 text-indigo-200",
    subtitle: "Garis Bilangan → Notasi PtLSV",
    custom: <Soal10 />,
  },
  {
    num: 11, tag: "Sedang", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/50 to-teal-900/30", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-teal-500", numBg: "bg-cyan-500/30 text-cyan-200",
    subtitle: "Ekuivalen Pertidaksamaan",
    custom: <Soal11 />,
  },
  {
    num: 12, tag: "Sulit", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/50 to-purple-900/30", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    subtitle: "Sifat-Sifat Pertidaksamaan",
    custom: <Soal12 />,
  },
  {
    num: 13, tag: "Sulit", tagColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40",
    gradient: "from-fuchsia-900/50 to-pink-900/30", border: "border-fuchsia-500/25",
    bar: "from-fuchsia-400 to-pink-500", numBg: "bg-fuchsia-500/30 text-fuchsia-200",
    subtitle: "PtLSV dengan Pecahan",
    custom: <Soal13 />,
  },
  {
    num: 14, tag: "Sulit", tagColor: "bg-pink-500/20 text-pink-300 border-pink-400/40",
    gradient: "from-pink-900/50 to-rose-900/30", border: "border-pink-500/25",
    bar: "from-pink-400 to-rose-500", numBg: "bg-pink-500/30 text-pink-200",
    subtitle: "Pertidaksamaan Ganda",
    custom: <Soal14 />,
  },
  {
    num: 15, tag: "Sulit", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/45 to-orange-900/30", border: "border-amber-500/25",
    bar: "from-amber-400 to-orange-500", numBg: "bg-amber-500/30 text-amber-200",
    subtitle: "Analisis PLSV vs PtLSV",
    custom: <Soal15 />,
  },
  {
    num: 16, tag: "Kontekstual", tagColor: "bg-green-500/20 text-green-300 border-green-400/40",
    gradient: "from-green-900/50 to-emerald-900/30", border: "border-green-500/25",
    bar: "from-green-400 to-emerald-500", numBg: "bg-green-500/30 text-green-200",
    subtitle: "Wahana – Tinggi Badan Minimum",
    custom: <Soal16 />,
  },
  {
    num: 17, tag: "Kontekstual", tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    gradient: "from-emerald-900/50 to-teal-900/30", border: "border-emerald-500/25",
    bar: "from-emerald-400 to-teal-500", numBg: "bg-emerald-500/30 text-emerald-200",
    subtitle: "Belanja – Budget & Buku",
    custom: <Soal17 />,
  },
  {
    num: 18, tag: "Kontekstual", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/50 to-amber-900/30", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    subtitle: "Kapasitas Lift",
    custom: <Soal18 />,
  },
  {
    num: 19, tag: "Kontekstual", tagColor: "bg-blue-500/20 text-blue-300 border-blue-400/40",
    gradient: "from-blue-900/50 to-indigo-900/30", border: "border-blue-500/25",
    bar: "from-blue-400 to-indigo-500", numBg: "bg-blue-500/30 text-blue-200",
    subtitle: "Nilai Ujian – Rata-Rata Minimum",
    custom: <Soal19 />,
  },
  {
    num: 20, tag: "Kontekstual", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/45 to-yellow-900/30", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    subtitle: "Kecepatan Kendaraan di Tol",
    custom: <Soal20 />,
  },
  {
    num: 21, tag: "UN", tagColor: "bg-blue-600/20 text-blue-300 border-blue-500/40",
    gradient: "from-blue-900/50 to-slate-900/40", border: "border-blue-600/25",
    bar: "from-blue-500 to-blue-400", numBg: "bg-blue-600/30 text-blue-200",
    subtitle: "Pilihan Ganda UN (1–5)",
    custom: <Soal21 />,
  },
  {
    num: 22, tag: "UN", tagColor: "bg-blue-600/20 text-blue-300 border-blue-500/40",
    gradient: "from-blue-900/45 to-indigo-900/35", border: "border-blue-600/25",
    bar: "from-blue-400 to-indigo-500", numBg: "bg-blue-600/30 text-blue-200",
    subtitle: "Pilihan Ganda UN (6–10)",
    custom: <Soal22 />,
  },
  {
    num: 23, tag: "ANBK", tagColor: "bg-purple-600/20 text-purple-300 border-purple-500/40",
    gradient: "from-purple-900/50 to-indigo-900/40", border: "border-purple-600/25",
    bar: "from-purple-500 to-indigo-500", numBg: "bg-purple-600/30 text-purple-200",
    subtitle: "PGK – Pilihan Ganda Kompleks",
    custom: <Soal23 />,
  },
  {
    num: 24, tag: "ANBK", tagColor: "bg-purple-600/20 text-purple-300 border-purple-500/40",
    gradient: "from-purple-900/45 to-violet-900/35", border: "border-purple-600/25",
    bar: "from-purple-400 to-violet-500", numBg: "bg-purple-600/30 text-purple-200",
    subtitle: "Isian Singkat & Menjodohkan",
    custom: <Soal24 />,
  },
  {
    num: 25, tag: "ANBK", tagColor: "bg-purple-600/20 text-purple-300 border-purple-500/40",
    gradient: "from-purple-900/45 to-rose-900/30", border: "border-purple-600/25",
    bar: "from-purple-400 to-rose-500", numBg: "bg-purple-600/30 text-purple-200",
    subtitle: "Benar / Salah – Literasi Matematika",
    custom: <Soal25 />,
  },
  {
    num: 26, tag: "ANBK", tagColor: "bg-purple-600/20 text-purple-300 border-purple-500/40",
    gradient: "from-indigo-900/50 to-purple-900/40", border: "border-indigo-600/25",
    bar: "from-indigo-400 to-purple-500", numBg: "bg-indigo-600/30 text-indigo-200",
    subtitle: "Uraian Terstruktur – Penggalangan Dana",
    custom: <Soal26 />,
  },
];

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
const PengertianPtLSVPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/10 border border-red-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">≤</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(248,113,113,0.5)' }}
          >
            PENGERTIAN KETIDAKSAMAAN,
          </h1>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(248,113,113,0.5)' }}
          >
            PERTIDAKSAMAAN DAN PtLSV
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · PLSV & PtLSV · Latihan Mandiri</p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">40 Soal</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-red-500/10 border border-red-400/20 text-red-400 font-body">✦ Mudah</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-400 font-body">✦ Sedang</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-400 font-body">✦ Sulit</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-green-500/10 border border-green-400/20 text-green-400 font-body">✦ Kontekstual</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 font-body">✦ UN</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-400 font-body">✦ ANBK</span>
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <div
              key={c.num}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${Math.min(i * 0.04, 0.5)}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} backdrop-blur`} />
              <div className={`absolute inset-0 border ${c.border} rounded-2xl`} />
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${c.bar} rounded-l-2xl`} />

              <div className="relative px-5 py-4 pl-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-body shrink-0 ${c.numBg}`}>
                    {c.num}
                  </span>
                  <Tag label={c.tag} color={c.tagColor} />
                </div>
                <p className="text-white/50 text-[11px] font-body mb-3 pl-8">{c.subtitle}</p>
                <div className="pl-1">
                  {c.custom}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">📖 Panduan Tingkat Soal</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-body">
            {[
              { col: "text-red-400", label: "Mudah", desc: "Soal 1–5: konsep dasar simbol & identifikasi" },
              { col: "text-teal-400", label: "Sedang", desc: "Soal 6–11: substitusi, HP, model matematika" },
              { col: "text-violet-400", label: "Sulit", desc: "Soal 12–15: sifat, pecahan, ganda, analisis" },
              { col: "text-green-400", label: "Kontekstual", desc: "Soal 16–20: masalah nyata kehidupan sehari-hari" },
              { col: "text-blue-400", label: "UN", desc: "Soal 21–22: pilihan ganda format Ujian Nasional" },
              { col: "text-purple-400", label: "ANBK", desc: "Soal 23–26: PGK, isian, B/S, uraian literasi" },
            ].map(({ col, label, desc }) => (
              <div key={label} className="flex gap-1.5 items-start">
                <span className={`font-bold ${col} shrink-0`}>✦</span>
                <span className="text-white/50"><span className={`${col} font-bold`}>{label}:</span> {desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/plsv-ptlsv"); }}
            className="text-sm text-white/30 hover:text-red-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke PLSV & PtLSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianPtLSVPage;
