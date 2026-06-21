import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type Q = { n: number; title: string; content: string; mathContent?: string; diagram?: React.ReactNode };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const TabelSkorSeni = () => (
  <svg width="280" height="152" viewBox="0 0 280 152" className="mx-auto">
    <rect x="4" y="4" width="272" height="144" rx="10" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="140" y="20" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Skor Karya Seni</text>
    <rect x="10" y="25" width="260" height="18" rx="3" fill="#1d4ed8" fillOpacity="0.35" />
    <text x="80" y="37" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Skor (xᵢ)</text>
    <text x="200" y="37" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi (fᵢ)</text>
    {[["5","2"],["6","5"],["7","8"],["8","9"],["9","5"],["10","1"]].map(([x,f],i) => (
      <g key={i}>
        <rect x="10" y={44+i*15} width="260" height="14" fill={i%2===0?"#1e3a5f":"transparent"} fillOpacity="0.3"/>
        <text x="80" y={55+i*15} fill="#bfdbfe" fontSize="9" textAnchor="middle">{x}</text>
        <text x="200" y={55+i*15} fill="#60a5fa" fontSize="9" textAnchor="middle">{f}</text>
      </g>
    ))}
    <rect x="10" y="134" width="260" height="14" rx="2" fill="#1d4ed8" fillOpacity="0.25"/>
    <text x="80" y="144" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Σ = 30 siswa</text>
    <text x="200" y="144" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Σfᵢxᵢ = 223</text>
  </svg>
);

const TabelKuis = () => (
  <svg width="280" height="137" viewBox="0 0 280 137" className="mx-auto">
    <rect x="4" y="4" width="272" height="129" rx="10" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="140" y="20" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Nilai Kuis Matematika</text>
    <rect x="10" y="25" width="260" height="18" rx="3" fill="#1d4ed8" fillOpacity="0.35" />
    <text x="80" y="37" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai (xᵢ)</text>
    <text x="200" y="37" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi (fᵢ)</text>
    {[["6","x"],["7","8"],["8","5"],["9","4"],["10","3"]].map(([x,f],i) => (
      <g key={i}>
        <rect x="10" y={44+i*15} width="260" height="14" fill={i%2===0?"#1e3a5f":"transparent"} fillOpacity="0.3"/>
        <text x="80" y={55+i*15} fill="#bfdbfe" fontSize="9" textAnchor="middle">{x}</text>
        <text x="200" y={55+i*15} fill={f==="x"?"#fbbf24":"#60a5fa"} fontSize="9" textAnchor="middle" fontWeight={f==="x"?"bold":"normal"}>{f}</text>
      </g>
    ))}
    <rect x="10" y="119" width="260" height="14" rx="2" fill="#1d4ed8" fillOpacity="0.25"/>
    <text x="140" y="129" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">n = x + 20, rata-rata = 7,5</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Rata-Rata Data Survei – ANBK", {
    content: "Sebuah survei dilakukan terhadap 10 siswa tentang durasi olahraga mereka setiap hari (dalam jam). Data yang diperoleh: 9, 7, 8, 9, 6, 8, 8, 9, 10, 7. Hitunglah rata-rata durasi olahraga siswa tersebut!",
  }),
  Qn(2, "Banyak Siswa di Atas Rata-Rata – UN", {
    diagram: (() => (
      <svg width="300" height="88" viewBox="0 0 300 88" className="mx-auto">
        <rect x="4" y="4" width="292" height="80" rx="10" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="150" y="18" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Tabel Nilai Ulangan Harian</text>
        <rect x="10" y="23" width="280" height="16" rx="3" fill="#1d4ed8" fillOpacity="0.35"/>
        <text x="80" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Nilai</text>
        <text x="130" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">3</text>
        <text x="157" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">4</text>
        <text x="184" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">5</text>
        <text x="211" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">6</text>
        <text x="238" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">7</text>
        <text x="262" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">8</text>
        <text x="284" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">9</text>
        <rect x="10" y="39" width="280" height="16" fill="#1e3a5f" fillOpacity="0.25"/>
        <text x="80" y="50" fill="#bfdbfe" fontSize="8" textAnchor="middle">Frekuensi</text>
        {[["130","2"],["157","3"],["184","4"],["211","5"],["238","3"],["262","2"],["284","1"]].map(([cx,f],i) => (
          <text key={i} x={Number(cx)} y="50" fill="#60a5fa" fontSize="8" textAnchor="middle">{f}</text>
        ))}
        <rect x="10" y="55" width="280" height="14" fill="#1d4ed8" fillOpacity="0.2"/>
        <text x="150" y="65" fill="#94a3b8" fontSize="7" textAnchor="middle">n = 20 siswa</text>
      </svg>
    ))(),
    content: "Tabel di atas menunjukkan nilai ulangan harian 20 siswa. Hitunglah rata-rata nilai ulangan tersebut, kemudian tentukan berapa banyak siswa yang mendapat nilai di atas rata-rata!",
  }),
  Qn(3, "Rata-Rata dari Tabel Frekuensi – UN", {
    diagram: <TabelSkorSeni />,
    content: "Tabel di atas menunjukkan skor penilaian karya seni dari 30 siswa. Hitunglah rata-rata skor karya seni seluruh siswa!",
  }),
  Qn(4, "Mean dari Diagram Batang – UN", {
    diagram: (() => (
      <svg width="300" height="175" viewBox="0 0 300 175" className="mx-auto">
        <rect x="4" y="4" width="292" height="167" rx="10" fill="#1e3a5f" fillOpacity="0.35" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="150" y="18" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai Ulangan IPA – 20 Siswa</text>
        {[0,15,30,45,60,75,90].map((h,i) => (
          <g key={i}>
            <line x1="38" y1={145-h} x2="285" y2={145-h} stroke="#1d4ed8" strokeWidth="0.5" strokeOpacity="0.4"/>
            <text x="35" y={148-h} fill="#94a3b8" fontSize="7" textAnchor="end">{i}</text>
          </g>
        ))}
        {[["5",2,"#60a5fa"],["6",4,"#3b82f6"],["7",6,"#2563eb"],["8",5,"#1d4ed8"],["9",2,"#60a5fa"],["10",1,"#93c5fd"]].map(([val,freq,color],i) => (
          <g key={i}>
            <rect x={48+i*38} y={145-Number(freq)*15} width="28" height={Number(freq)*15} fill={color as string} fillOpacity="0.8" rx="3"/>
            <text x={62+i*38} y={142-Number(freq)*15} fill="#dbeafe" fontSize="8" textAnchor="middle">{freq}</text>
            <text x={62+i*38} y="158" fill="#93c5fd" fontSize="8" textAnchor="middle">{val}</text>
          </g>
        ))}
        <line x1="40" y1="145" x2="285" y2="145" stroke="#3b82f6" strokeWidth="1.5"/>
        <line x1="40" y1="25" x2="40" y2="145" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="162" y="170" fill="#94a3b8" fontSize="8" textAnchor="middle">Nilai</text>
      </svg>
    ))(),
    content: "Diagram batang di atas menunjukkan distribusi nilai ulangan IPA dari 20 siswa. Hitunglah rata-rata nilai ulangan IPA tersebut!",
  }),
  Qn(5, "Menentukan x dari Mean – TKA", {
    diagram: <TabelKuis />,
    content: "Tabel di atas menunjukkan nilai kuis matematika sejumlah siswa. Diketahui rata-rata nilai kuis adalah 7,5. Tentukan nilai x (banyak siswa yang mendapat nilai 6)!",
  }),
  Qn(6, "Mean dan Data Tidak Diketahui – ANBK", {
    diagram: (() => (
      <svg width="300" height="175" viewBox="0 0 300 175" className="mx-auto">
        <rect x="4" y="4" width="292" height="167" rx="10" fill="#1e3a5f" fillOpacity="0.35" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="150" y="18" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Pengunjung Perpustakaan (5 Hari)</text>
        {[0,10,20,30,40,50].map((h,i) => (
          <g key={i}>
            <line x1="45" y1={145-h*2} x2="285" y2={145-h*2} stroke="#1d4ed8" strokeWidth="0.5" strokeOpacity="0.4"/>
            <text x="42" y={148-h*2} fill="#94a3b8" fontSize="7" textAnchor="end">{h}</text>
          </g>
        ))}
        {[["Sen",35,"#3b82f6"],["Sel",40,"#2563eb"],["Rab",0,"#64748b"],["Kam",50,"#1d4ed8"],["Jum",45,"#3b82f6"]].map(([day,val,color],i) => (
          <g key={i}>
            {Number(val) > 0
              ? <rect x={52+i*44} y={145-Number(val)*2} width="30" height={Number(val)*2} fill={color as string} fillOpacity="0.8" rx="3"/>
              : <>
                  <rect x={52+i*44} y={85} width="30" height={60} fill="#334155" fillOpacity="0.5" rx="3" strokeDasharray="4,3" stroke="#fbbf24" strokeWidth="1"/>
                  <text x={67+i*44} y="118" fill="#fbbf24" fontSize="11" textAnchor="middle" fontWeight="bold">?</text>
                </>
            }
            {Number(val) > 0 && <text x={67+i*44} y={140-Number(val)*2} fill="#dbeafe" fontSize="7" textAnchor="middle">{val}</text>}
            <text x={67+i*44} y="158" fill="#93c5fd" fontSize="8" textAnchor="middle">{day as string}</text>
          </g>
        ))}
        <line x1="45" y1="145" x2="285" y2="145" stroke="#3b82f6" strokeWidth="1.5"/>
        <line x1="45" y1="25" x2="45" y2="145" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="60" y="170" fill="#fbbf24" fontSize="7" textAnchor="start">Rata-rata = 41 orang/hari</text>
      </svg>
    ))(),
    content: "Diagram di atas menunjukkan data pengunjung perpustakaan sekolah selama 5 hari. Data pengunjung hari Rabu tidak terbaca (?). Diketahui rata-rata pengunjung selama 5 hari adalah 41 orang per hari. Tentukan banyak pengunjung pada hari Rabu!",
  }),
  Qn(7, "Pemahaman Rata-Rata – ANBK", {
    content: "Rata-rata gaji 5 karyawan sebuah toko adalah Rp3.000.000. Kemudian seorang manajer dengan gaji Rp8.000.000 bergabung ke dalam tim. Tentukan rata-rata gaji seluruh anggota tim setelah manajer bergabung!",
  }),
  Qn(8, "Rata-Rata Gabungan Kelas + Siswa Remedial – UN", {
    content: "Suatu kelas yang terdiri dari 30 siswa memperoleh rata-rata nilai ulangan matematika sebesar 76. Setelah ujian berakhir, datang 2 orang siswa remedial yang mengikuti ujian susulan dan memperoleh rata-rata nilai 58.\n\nTentukan rata-rata nilai ulangan matematika gabungan seluruh siswa (30 siswa reguler + 2 siswa remedial)!",
  }),
  Qn(9, "Rata-Rata Gabungan – Mencari n₂ – TKA", {
    content: "Rata-rata nilai ulangan 12 siswa kelompok A adalah 74. Nilai mereka digabungkan dengan nilai sejumlah siswa kelompok B yang memiliki rata-rata 82, sehingga rata-rata gabungannya menjadi 76. Tentukan banyak siswa kelompok B!",
  }),
  Qn(10, "Rata-Rata Gabungan – Mencari x̄₂ – ANBK", {
    content: "Tim renang sekolah terdiri dari 5 perenang utama dan 3 perenang cadangan. Rata-rata tinggi badan perenang utama adalah 168 cm. Jika rata-rata tinggi badan seluruh 8 anggota tim adalah 171 cm, tentukan rata-rata tinggi badan perenang cadangan!",
  }),
  Qn(11, "Nilai yang Harus Dicapai – UN", {
    content: "Dari 4 ujian yang telah dilaksanakan, rata-rata nilai seorang siswa adalah 75. Siswa tersebut ingin meningkatkan rata-ratanya menjadi 78 setelah mengikuti ujian ke-5. Berapa nilai minimum yang harus ia peroleh pada ujian ke-5?",
  }),
  Qn(12, "Selisih Siswa dari Data Remedial – ANBK", {
    content: "Sebanyak 20 siswa mengikuti remedial matematika dengan rata-rata nilai 7. Rata-rata nilai siswa laki-laki adalah 6 dan rata-rata nilai siswa perempuan adalah 8,5. Tentukan selisih banyak siswa laki-laki dan siswa perempuan yang mengikuti remedial tersebut!",
  }),
  Qn(13, "Rata-Rata Berubah karena Siswa Keluar – UN", {
    content: "Suatu kelas yang terdiri dari 25 siswa memiliki rata-rata berat badan 52 kg. Budi kemudian keluar dari kelas tersebut sehingga rata-rata berat badan 24 siswa yang tersisa turun menjadi 51,5 kg.\n\nTentukan berat badan Budi!",
  }),
  Qn(14, "Rata-Rata Naik karena Dua Siswa Keluar – TKA", {
    content: "Suatu kelas yang terdiri dari 30 siswa memiliki rata-rata nilai ulangan matematika 72. Zico dan Daffy kemudian pindah sekolah sehingga rata-rata nilai ulangan matematika 28 siswa yang tersisa naik menjadi 73.\n\nTentukan rata-rata nilai matematika Zico dan Daffy!",
  }),
  Qn(15, "Rata-Rata Berubah karena Koreksi – UN", {
    content: "Rata-rata nilai ulangan 20 siswa adalah 75. Setelah diperiksa ulang, ternyata nilai seorang siswa yang seharusnya 80 tercatat salah menjadi 60. Tentukan rata-rata nilai yang sebenarnya setelah koreksi!",
  }),
  Qn(16, "Rata-Rata Umur Keluarga – UN", {
    diagram: (() => (
      <svg width="360" height="90" viewBox="0 0 360 90" className="mx-auto">
        <rect x="2" y="2" width="356" height="86" rx="8" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5"/>
        <rect x="8" y="8" width="344" height="36" rx="0" fill="#1d4ed8" fillOpacity="0.25"/>
        <rect x="8" y="8" width="112" height="74" rx="0" fill="#1d4ed8" fillOpacity="0.2"/>
        <text x="64" y="23" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Anggota</text>
        <text x="64" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Keluarga</text>
        <text x="64" y="66" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Umur (tahun)</text>
        <line x1="8" y1="44" x2="352" y2="44" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.5"/>
        <line x1="120" y1="8" x2="120" y2="82" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6"/>
        {[["Ayah","40",144],["Ibu","36",192],["Anak I","8",240],["Anak II","6",288],["Anak III","2",336]].map(([name,age,cx]) => (
          <g key={name}>
            <line x1={Number(cx)-24} y1="8" x2={Number(cx)-24} y2="82" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.35"/>
            <text x={Number(cx)} y="30" fill="#bfdbfe" fontSize="9" textAnchor="middle">{name}</text>
            <text x={Number(cx)} y="67" fill="#60a5fa" fontSize="11" textAnchor="middle" fontWeight="bold">{age}</text>
          </g>
        ))}
      </svg>
    ))(),
    content: "Lima orang dalam satu keluarga dicatat nama dan umurnya sebagaimana tampak pada tabel di atas. Berapakah rata-rata umur keluarga tersebut lima tahun yang lalu?",
  }),
  Qn(17, "Interpretasi Nilai Rata-Rata – TKA", {
    content: "Sebuah kelas memiliki 25 siswi dengan rata-rata tinggi badan 130 cm. Tentukan apakah setiap pernyataan berikut BENAR atau SALAH!\n\n(A) Jika ada siswi dengan tinggi 132 cm, maka pasti ada siswi lain yang tingginya 128 cm.\n\n(B) Jika 23 siswi masing-masing tingginya 130 cm dan satu siswi tingginya 133 cm, maka siswi ke-25 tingginya 127 cm.\n\n(C) Jika diurutkan dari terpendek ke tertinggi, siswi urutan ke-13 pasti tingginya 130 cm.\n\n(D) Setengah dari siswi di kelas pasti lebih pendek dari 130 cm dan setengahnya lagi pasti lebih tinggi.",
  }),
];

const RataRataPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-500/20 border-2 border-blue-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📐</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-blue-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(96,165,250,0.7)' }}>
            UKURAN PEMUSATAN DATA
          </h1>
          <p className="text-blue-200/70 text-sm text-center font-body mb-1">Rata-Rata dan Rata-Rata Gabungan</p>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2">
            <span className="text-blue-400 text-xs font-bold">📋 17 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-300 text-xs font-bold mb-3">📌 Rumus Kunci</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { name: "Rata-Rata Tunggal", math: "\\bar{x} = \\frac{\\sum x_i}{n}" },
              { name: "Rata-Rata Berbobot", math: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}" },
              { name: "Rata-Rata Gabungan", math: "\\bar{x}_{gab} = \\frac{n_1\\bar{x}_1 + n_2\\bar{x}_2}{n_1+n_2}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <div className="text-blue-400 text-[9px] uppercase font-bold min-w-[100px]">{r.name}</div>
                <div className="text-blue-200 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900/80 to-indigo-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-blue-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center shrink-0">
                    <span className="text-blue-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    {q.mathContent && (
                      <div className="mb-3 bg-blue-900/20 border border-blue-500/20 rounded-lg px-4 py-3 flex justify-center overflow-x-auto">
                        <InlineMath math={q.mathContent} />
                      </div>
                    )}
                    <p className="font-body text-sm text-white/90 leading-relaxed whitespace-pre-line">{q.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-blue-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default RataRataPage;
