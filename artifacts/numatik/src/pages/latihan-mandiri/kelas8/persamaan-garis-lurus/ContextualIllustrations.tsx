import type { ReactElement, ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type IconProps = { className?: string };

const Frame = ({ children }: { children: ReactNode }) => {
  const { isDark } = useTheme();
  const bg = isDark ? "#1e293b" : "#ffffff";
  return (
    <svg
      viewBox="0 0 260 160"
      width="260"
      height="160"
      className="rounded-xl"
      style={{ background: bg }}
    >
      <rect x="0" y="0" width="260" height="160" fill={bg} />
      {children}
    </svg>
  );
};

type CapProps = {
  x?: number | string; y?: number | string;
  fontSize?: string; fontWeight?: string; transform?: string;
  children: ReactNode;
};
const CaptionText = ({ x = 130, y = 150, fontSize = "10", fontWeight = "bold", transform, children }: CapProps) => {
  const { isDark } = useTheme();
  return (
    <text x={x} y={y} fontSize={fontSize} fill={isDark ? "#e2e8f0" : "#334155"}
      textAnchor="middle" fontWeight={fontWeight} transform={transform}>
      {children}
    </text>
  );
};

// Q1 — Tarif Taksi Online
export const TaksiIllustration = (_: IconProps) => (
  <Frame>
    <rect x="0" y="120" width="260" height="40" fill="#e2e8f0" />
    <rect x="0" y="128" width="260" height="4" fill="#cbd5e1" />
    <rect x="60" y="80" width="120" height="40" rx="8" fill="#facc15" />
    <rect x="75" y="55" width="70" height="35" rx="6" fill="#facc15" />
    <rect x="82" y="60" width="24" height="18" rx="2" fill="#bae6fd" />
    <rect x="114" y="60" width="24" height="18" rx="2" fill="#bae6fd" />
    <rect x="105" y="45" width="20" height="12" rx="2" fill="#1e293b" />
    <text x="115" y="54" fontSize="7" fill="#facc15" textAnchor="middle" fontWeight="bold">TAXI</text>
    <circle cx="85" cy="122" r="12" fill="#1e293b" />
    <circle cx="85" cy="122" r="5" fill="#94a3b8" />
    <circle cx="155" cy="122" r="12" fill="#1e293b" />
    <circle cx="155" cy="122" r="5" fill="#94a3b8" />
    <CaptionText y={145}>Rp10.000 + Rp10.000/km</CaptionText>
  </Frame>
);

// Q2 — Harga Paket Data
export const PaketDataIllustration = (_: IconProps) => (
  <Frame>
    <rect x="95" y="30" width="70" height="110" rx="14" fill="#334155" />
    <rect x="102" y="42" width="56" height="80" rx="4" fill="#bae6fd" />
    <circle cx="130" cy="130" r="5" fill="#94a3b8" />
    <rect x="112" y="65" width="8" height="20" fill="#0ea5e9" />
    <rect x="124" y="55" width="8" height="30" fill="#0ea5e9" />
    <rect x="136" y="45" width="8" height="40" fill="#0ea5e9" />
    <path d="M118 100 h24" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
    <path d="M122 108 h16" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
    <CaptionText>Rp5.000/GB + admin Rp3.000</CaptionText>
  </Frame>
);

// Q4 — Biaya Produksi (pabrik)
export const ProduksiIllustration = (_: IconProps) => (
  <Frame>
    <rect x="0" y="115" width="260" height="25" fill="#e2e8f0" />
    <rect x="50" y="70" width="160" height="50" fill="#94a3b8" />
    <polygon points="50,70 90,45 90,70" fill="#64748b" />
    <polygon points="90,70 130,45 130,70" fill="#64748b" />
    <rect x="150" y="35" width="14" height="40" fill="#64748b" />
    <ellipse cx="157" cy="30" rx="10" ry="7" fill="#cbd5e1" />
    <ellipse cx="167" cy="22" rx="12" ry="8" fill="#e2e8f0" />
    <rect x="65" y="85" width="18" height="18" fill="#e2e8f0" />
    <rect x="100" y="85" width="18" height="18" fill="#e2e8f0" />
    <rect x="135" y="85" width="18" height="18" fill="#e2e8f0" />
    <rect x="170" y="85" width="18" height="18" fill="#e2e8f0" />
    <CaptionText>B(x) = 5000x + 200.000</CaptionText>
  </Frame>
);

// Q5 — Tabungan (celengan)
export const TabunganIllustration = (_: IconProps) => (
  <Frame>
    <ellipse cx="130" cy="90" rx="55" ry="38" fill="#facc15" />
    <ellipse cx="175" cy="65" rx="10" ry="9" fill="#facc15" />
    <circle cx="178" cy="62" r="2" fill="#1e293b" />
    <rect cx="130" x="122" y="55" width="16" height="6" rx="3" fill="#eab308" />
    <rect x="60" y="88" width="10" height="14" rx="3" fill="#facc15" />
    <rect x="185" y="88" width="10" height="14" rx="3" fill="#facc15" />
    <rect x="115" y="115" width="10" height="12" fill="#eab308" />
    <rect x="145" y="115" width="10" height="12" fill="#eab308" />
    <text x="130" y="95" fontSize="26" textAnchor="middle" fill="#a16207" fontWeight="bold">Rp</text>
    <CaptionText>Awal Rp50rb + Rp50rb/bulan</CaptionText>
  </Frame>
);

// Q6 — Penurunan Nilai Barang (laptop + panah turun)
export const LaptopIllustration = (_: IconProps) => (
  <Frame>
    <rect x="75" y="55" width="90" height="55" rx="4" fill="#334155" />
    <rect x="82" y="61" width="76" height="43" fill="#60a5fa" />
    <polygon points="60,110 180,110 195,125 45,125" fill="#94a3b8" />
    <path d="M195 45 v40" stroke="#ef4444" strokeWidth="4" markerEnd="url(#arrow)" />
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="#ef4444" />
      </marker>
    </defs>
    <text x="215" y="70" fontSize="10" fill="#ef4444" fontWeight="bold">−Rp1jt</text>
    <text x="215" y="82" fontSize="8" fill="#ef4444">/tahun</text>
    <CaptionText x={120}>Rp8.000.000 → turun</CaptionText>
  </Frame>
);

// Q7 — Isi Bahan Bakar (motor + indikator BBM)
export const BbmIllustration = (_: IconProps) => (
  <Frame>
    <rect x="0" y="120" width="260" height="20" fill="#e2e8f0" />
    <circle cx="80" cy="118" r="16" fill="#1e293b" />
    <circle cx="170" cy="118" r="16" fill="#1e293b" />
    <path d="M70 100 L110 80 L150 80 L175 100 L150 105 L100 105 Z" fill="#f472b6" />
    <rect x="95" y="65" width="26" height="16" rx="3" fill="#334155" />
    <rect x="195" y="55" width="45" height="60" rx="6" fill="#334155" />
    <rect x="200" y="60" width="35" height="30" rx="3" fill="#e2e8f0" />
    <rect x="203" y="63" width="12" height="24" fill="#22c55e" />
    <text x="217" y="100" fontSize="8" fill="#e2e8f0" textAnchor="middle">BBM</text>
    <CaptionText>60L tangki, 10 km/liter</CaptionText>
  </Frame>
);

// Q8 — Populasi (rumah-rumah)
export const PopulasiIllustration = (_: IconProps) => (
  <Frame>
    <rect x="0" y="120" width="260" height="20" fill="#bbf7d0" />
    {[35, 90, 145, 200].map((x, i) => (
      <g key={i}>
        <rect x={x} y="90" width="40" height="35" fill="#fbbf24" />
        <polygon points={`${x - 5},90 ${x + 20},68 ${x + 45},90`} fill="#dc2626" />
        <rect x={x + 15} y="105" width="10" height="20" fill="#78350f" />
      </g>
    ))}
    <CaptionText>5.000 jiwa, +200/tahun</CaptionText>
  </Frame>
);

// Q9 — Tiket Masuk (gerbang taman)
export const TiketIllustration = (_: IconProps) => (
  <Frame>
    <rect x="0" y="120" width="260" height="20" fill="#bbf7d0" />
    <rect x="55" y="45" width="10" height="80" fill="#78350f" />
    <rect x="195" y="45" width="10" height="80" fill="#78350f" />
    <rect x="55" y="45" width="150" height="14" fill="#16a34a" />
    <text x="130" y="55" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">TAMAN WISATA</text>
    <circle cx="120" cy="100" r="14" fill="#fca5a5" />
    <rect x="112" y="112" width="16" height="22" fill="#3b82f6" />
    <circle cx="150" cy="100" r="14" fill="#fca5a5" />
    <rect x="142" y="112" width="16" height="22" fill="#f472b6" />
    <rect x="80" y="95" width="26" height="18" rx="2" fill="#facc15" stroke="#a16207" />
    <text x="93" y="107" fontSize="6" fill="#a16207" textAnchor="middle">TIKET</text>
    <CaptionText>Rp5.000/org + parkir Rp10.000</CaptionText>
  </Frame>
);

// Q10 — Debit Air (tandon + keran menetes)
export const DebitAirIllustration = (_: IconProps) => (
  <Frame>
    <rect x="90" y="35" width="80" height="70" rx="6" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
    <rect x="90" y="65" width="80" height="40" rx="6" fill="#38bdf8" />
    <rect x="120" y="105" width="20" height="10" fill="#64748b" />
    <rect x="115" y="115" width="30" height="6" fill="#475569" />
    <circle cx="130" cy="135" r="4" fill="#38bdf8" />
    <circle cx="130" cy="148" r="3" fill="#7dd3fc" />
    <CaptionText transform="translate(0,-2)">500L, keluar 25L/menit</CaptionText>
  </Frame>
);

// Q11 — Dua Tarif (dua taksi berbeda warna)
export const DuaTarifIllustration = (_: IconProps) => (
  <Frame>
    <rect x="0" y="120" width="260" height="20" fill="#e2e8f0" />
    <g>
      <rect x="20" y="85" width="90" height="30" rx="6" fill="#f472b6" />
      <rect x="35" y="62" width="55" height="26" rx="5" fill="#f472b6" />
      <rect x="42" y="66" width="18" height="14" rx="1" fill="#bae6fd" />
      <rect x="65" y="66" width="18" height="14" rx="1" fill="#bae6fd" />
      <circle cx="40" cy="116" r="9" fill="#1e293b" />
      <circle cx="90" cy="116" r="9" fill="#1e293b" />
      <text x="65" y="135" fontSize="8" fill="#f472b6" textAnchor="middle" fontWeight="bold">A: 20rb+10rb/km</text>
    </g>
    <g>
      <rect x="150" y="85" width="90" height="30" rx="6" fill="#60a5fa" />
      <rect x="165" y="62" width="55" height="26" rx="5" fill="#60a5fa" />
      <rect x="172" y="66" width="18" height="14" rx="1" fill="#bae6fd" />
      <rect x="195" y="66" width="18" height="14" rx="1" fill="#bae6fd" />
      <circle cx="170" cy="116" r="9" fill="#1e293b" />
      <circle cx="220" cy="116" r="9" fill="#1e293b" />
      <text x="195" y="135" fontSize="8" fill="#60a5fa" textAnchor="middle" fontWeight="bold">B: 40rb+5rb/km</text>
    </g>
    <CaptionText fontSize="9" fontWeight={undefined}>Bandingkan tarif A dan B</CaptionText>
  </Frame>
);

// Q12 — Gaji dan Bonus (koper + koin)
export const GajiIllustration = (_: IconProps) => (
  <Frame>
    <rect x="80" y="70" width="90" height="55" rx="6" fill="#78350f" />
    <rect x="110" y="55" width="30" height="20" rx="4" fill="none" stroke="#78350f" strokeWidth="6" />
    <rect x="80" y="90" width="90" height="10" fill="#a16207" />
    <circle cx="200" cy="60" r="14" fill="#facc15" stroke="#a16207" strokeWidth="2" />
    <text x="200" y="65" fontSize="12" textAnchor="middle" fill="#a16207" fontWeight="bold">Rp</text>
    <circle cx="220" cy="90" r="11" fill="#facc15" stroke="#a16207" strokeWidth="2" />
    <text x="220" y="94" fontSize="9" textAnchor="middle" fill="#a16207" fontWeight="bold">Rp</text>
    <circle cx="55" cy="100" r="11" fill="#facc15" stroke="#a16207" strokeWidth="2" />
    <text x="55" y="104" fontSize="9" textAnchor="middle" fill="#a16207" fontWeight="bold">Rp</text>
    <CaptionText>Gaji 2jt + bonus 50rb/unit</CaptionText>
  </Frame>
);

// Q13 — ANBK Ladang Jagung
export const JagungIllustration = (_: IconProps) => (
  <Frame>
    <rect x="0" y="120" width="260" height="20" fill="#bbf7d0" />
    {[45, 90, 135, 180, 215].map((x, i) => (
      <g key={i}>
        <rect x={x} y={110 - i * 3} width="6" height={20 + i * 3} fill="#16a34a" />
        <ellipse cx={x + 3} cy={100 - i * 3} rx="8" ry="16" fill="#eab308" />
      </g>
    ))}
    <CaptionText fontSize="9">Luas panen jagung naik tiap tahun</CaptionText>
  </Frame>
);

// Q14 — Telepon
export const TeleponIllustration = (_: IconProps) => (
  <Frame>
    <circle cx="130" cy="80" r="42" fill="#dbeafe" />
    <path
      d="M110 60 c-6 4 -8 10 -4 16 c3 4 6 8 10 10 c4 6 8 9 12 12 c6 4 12 2 16 -4 c2 -3 1 -6 -2 -8 l-8 -6 c-2 -1 -4 -1 -5 1 l-3 3 c-4 -3 -8 -7 -11 -11 l3 -3 c2 -1 2 -3 1 -5 l-6 -8 c-2 -3 -5 -4 -8 -2 z"
      fill="#1e3a8a"
      transform="translate(4,4) scale(0.95)"
    />
    <CaptionText y={140}>500/menit (10 mnt) lalu 300/menit</CaptionText>
  </Frame>
);

// Q15 — Toko A vs Toko B (buah)
export const TokoBuahIllustration = (_: IconProps) => (
  <Frame>
    <g>
      <rect x="20" y="70" width="90" height="45" rx="4" fill="#fde68a" stroke="#a16207" strokeWidth="2" />
      <text x="65" y="65" fontSize="9" fill="#a16207" textAnchor="middle" fontWeight="bold">TOKO A</text>
      <circle cx="45" cy="90" r="9" fill="#ef4444" />
      <circle cx="65" cy="95" r="9" fill="#f97316" />
      <circle cx="85" cy="88" r="9" fill="#22c55e" />
      <CaptionText x={65} y={128} fontSize="8" fontWeight={undefined}>20rb/kg + kirim 20rb</CaptionText>
    </g>
    <g>
      <rect x="150" y="70" width="90" height="45" rx="4" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="2" />
      <text x="195" y="65" fontSize="9" fill="#1d4ed8" textAnchor="middle" fontWeight="bold">TOKO B</text>
      <circle cx="175" cy="90" r="9" fill="#ef4444" />
      <circle cx="195" cy="95" r="9" fill="#f97316" />
      <circle cx="215" cy="88" r="9" fill="#22c55e" />
      <CaptionText x={195} y={128} fontSize="8" fontWeight={undefined}>Flat Rp50rb</CaptionText>
    </g>
  </Frame>
);

export const contextualIllustrations: Record<number, (p: IconProps) => ReactElement> = {
  1: TaksiIllustration,
  2: PaketDataIllustration,
  3: ProduksiIllustration,
  4: TabunganIllustration,
  5: LaptopIllustration,
  6: BbmIllustration,
  7: PopulasiIllustration,
  8: TiketIllustration,
  9: DebitAirIllustration,
  10: DuaTarifIllustration,
  11: GajiIllustration,
  12: JagungIllustration,
  13: TeleponIllustration,
  14: TokoBuahIllustration,
};
