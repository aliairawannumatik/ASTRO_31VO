import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import Snowfall from "@/components/Snowfall";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ClipboardList,
  Gamepad2,
  Calculator,
  Trophy,
  BookMarked,
  ArrowLeftRight,
  PlayCircle,
  Award,
  FileText,
  MessageCircle,
  Brain,
  Settings,
  Heart,
  User,
  Info,
  Home,
  ArrowLeft,
  X,
  Star,
  CheckCircle2,
  Lightbulb,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  description: string;
  steps: string[];
  submenus?: string[];
  mockup: React.ReactNode;
}

/* ─────────────────────────────────────────────────────────────
   UI-CHROME TRANSLATIONS  (9 strings)
───────────────────────────────────────────────────────────── */
const uiTrans = {
  id: {
    pageTitle: "PETUNJUK PENGGUNAAN",
    slideCounterFmt: (n: number, total: number) =>
      `Slide ${n} dari ${total} — gunakan tombol atau ← → keyboard`,
    menuCounterFmt: (n: number, total: number) => `Menu ${n}/${total}`,
    aboutSection: "Tentang Menu Ini",
    howToUseSection: "Cara Penggunaan",
    subMenuSection: "Sub Menu / Fitur",
    prevBtn: "Sebelumnya",
    nextBtn: "Selanjutnya",
    backToMenu: "← Kembali ke Menu",
  },
  en: {
    pageTitle: "USER GUIDE",
    slideCounterFmt: (n: number, total: number) =>
      `Slide ${n} of ${total} — use buttons or ← → keyboard`,
    menuCounterFmt: (n: number, total: number) => `Menu ${n}/${total}`,
    aboutSection: "About This Menu",
    howToUseSection: "How to Use",
    subMenuSection: "Sub Menu / Features",
    prevBtn: "Previous",
    nextBtn: "Next",
    backToMenu: "← Back to Menu",
  },
  ja: {
    pageTitle: "使い方ガイド",
    slideCounterFmt: (n: number, total: number) =>
      `スライド ${n} / ${total} — ボタンまたは ← → キーで操作`,
    menuCounterFmt: (n: number, total: number) => `メニュー ${n}/${total}`,
    aboutSection: "このメニューについて",
    howToUseSection: "使い方",
    subMenuSection: "サブメニュー・機能",
    prevBtn: "前へ",
    nextBtn: "次へ",
    backToMenu: "← メニューに戻る",
  },
} as const;

/* ─────────────────────────────────────────────────────────────
   MOCKUP COMPONENTS
   • Slides 1-4: use useLanguage() internally → trilingual ✅
   • Slides 5-17: unchanged (next phases)
───────────────────────────────────────────────────────────── */

const MockupFrame = ({ children, title, accentColor = "text-cyan-400" }: { children: React.ReactNode; title: string; accentColor?: string }) => (
  <div className="relative w-full max-w-xs mx-auto rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: "16/10", background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
    <div className="absolute top-0 left-0 right-0 h-7 flex items-center px-3 gap-2" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500/70" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
        <div className="w-2 h-2 rounded-full bg-green-500/70" />
      </div>
      <span className={`text-[9px] font-mono ${accentColor} ml-1 opacity-80`}>{title}</span>
    </div>
    <div className="pt-7 h-full overflow-hidden">{children}</div>
  </div>
);

/* ── SLIDE 1 MOCKUP: Menu Utama ── */
const MenuMockup = () => {
  const { language } = useLanguage();
  const frameTitle = { id: "MENU UTAMA", en: "MAIN MENU", ja: "メインメニュー" }[language];
  const items = {
    id: ["PETUNJUK PENGGUNAAN", "MATERI", "LATIHAN", "GAME", "KALKULATOR", "OLIMPIADE", "RUMUS", "KONVERSI", "VIDEO", "PERINGKAT", "BANK SOAL", "AI CHAT"],
    en: ["USER GUIDE", "SUBJECTS", "PRACTICE", "GAME", "CALCULATOR", "OLYMPIAD", "FORMULAS", "CONVERTER", "VIDEO", "RANKING", "PROBLEM BANK", "AI CHAT"],
    ja: ["使い方ガイド", "教材", "練習", "ゲーム", "計算機", "数学五輪", "数式", "変換", "動画", "ランキング", "問題集", "AI チャット"],
  }[language];
  return (
    <MockupFrame title={frameTitle}>
      <div className="p-2 grid grid-cols-3 gap-1">
        {items.map((m) => (
          <div key={m} className="bg-white/5 border border-white/10 rounded p-1 text-center">
            <div className="w-3 h-3 rounded-sm bg-cyan-400/40 mx-auto mb-1" />
            <p className="text-[5px] text-white/60 leading-tight">{m}</p>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
};

/* ── SLIDE 4 MOCKUP: Materi Matematika ── */
const MateriMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: { frameTitle: "BUKU ANIMASI MATEMATIKA", title: "BUKU ANIMASI MATEMATIKA", grades: ["KELAS 7", "KELAS 8", "KELAS 9"], action: "BELAJAR" },
    en: { frameTitle: "ANIMATED MATH BOOK",       title: "ANIMATED MATH BOOK",       grades: ["GRADE 7", "GRADE 8", "GRADE 9"], action: "LEARN" },
    ja: { frameTitle: "アニメーション数学",         title: "アニメーション数学",         grades: ["中学1年",  "中学2年",  "中学3年"],  action: "学習" },
  }[language];
  return (
    <MockupFrame title={m.frameTitle} accentColor="text-cyan-400">
      <div className="p-3 space-y-2">
        <p className="text-[9px] text-cyan-300 font-bold text-center">{m.title}</p>
        {m.grades.map((k) => (
          <div key={k} className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-cyan-400/40" />
              <span className="text-[8px] text-white/70">{k}</span>
            </div>
            <span className="text-[7px] text-cyan-400">{m.action}</span>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
};

/* ── SLIDES 5-17 MOCKUPS: Unchanged (next phases) ── */
const LatihanMockup = () => (
  <MockupFrame title="TUGAS - LATIHAN MANDIRI" accentColor="text-yellow-400">
    <div className="p-3 space-y-2">
      <p className="text-[9px] text-yellow-300 font-bold text-center">TUGAS - LATIHAN MANDIRI</p>
      {["KELAS 7", "KELAS 8", "KELAS 9"].map((k) => (
        <div key={k} className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
            <span className="text-[8px] text-white/70">{k}</span>
          </div>
          <span className="text-[7px] text-yellow-400">BUKA</span>
        </div>
      ))}
    </div>
  </MockupFrame>
);

const GameMockup = () => (
  <MockupFrame title="MATH GAME ARENA" accentColor="text-orange-400">
    <div className="p-3 space-y-2">
      <p className="text-[9px] text-orange-300 font-bold text-center">MATH GAME ARENA</p>
      {["KELAS 7", "KELAS 8", "KELAS 9"].map((k) => (
        <div key={k} className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-orange-400/40" />
            <span className="text-[8px] text-white/70">{k}</span>
          </div>
          <span className="text-[7px] text-orange-400">MAIN</span>
        </div>
      ))}
    </div>
  </MockupFrame>
);

const KalkulatorMockup = () => (
  <MockupFrame title="KALKULATOR SCIENTIFIC" accentColor="text-purple-400">
    <div className="p-2">
      <div className="bg-white/5 rounded mb-2 h-8 flex items-end justify-end pr-2">
        <span className="text-[10px] text-white/80">0</span>
      </div>
      <div className="grid grid-cols-4 gap-0.5">
        {["sin","cos","tan","log","√","x²","xʸ","|x|","7","8","9","DEL","4","5","6","×","1","2","3","−","0",".","Ans","="].map((k) => (
          <div key={k} className={`rounded text-center py-0.5 text-[6px] ${
            k === "=" ? "bg-orange-500/60 text-white" :
            k === "DEL" ? "bg-red-500/60 text-white" :
            ["sin","cos","tan","log","√","x²","xʸ","|x|"].includes(k) ? "bg-purple-600/40 text-purple-200" :
            "bg-white/10 text-white/70"
          }`}>{k}</div>
        ))}
      </div>
    </div>
  </MockupFrame>
);

const OlimpiadeMockup = () => (
  <MockupFrame title="OLIMPIADE MATEMATIKA" accentColor="text-yellow-400">
    <div className="p-3 space-y-1.5">
      <p className="text-[9px] text-yellow-300 font-bold text-center">OLIMPIADE MATEMATIKA</p>
      {["Bilangan Bulat","Bilangan Rasional","Bilangan Berpangkat","KPK dan FPB","Himpunan"].map((t) => (
        <div key={t} className="flex items-center justify-between bg-white/5 border border-yellow-400/20 rounded px-2 py-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 text-yellow-400">🏆</div>
            <span className="text-[7px] text-white/70">{t}</span>
          </div>
          <span className="text-[6px] text-yellow-400">BUKA</span>
        </div>
      ))}
    </div>
  </MockupFrame>
);

const RumusMockup = () => (
  <MockupFrame title="KUMPULAN RUMUS" accentColor="text-green-400">
    <div className="p-3 space-y-1.5">
      <p className="text-[9px] text-green-300 font-bold text-center">KUMPULAN RUMUS</p>
      {["Aljabar","Geometri","Statistika","Trigonometri"].map((t) => (
        <div key={t} className="bg-white/5 border border-green-400/20 rounded px-2 py-1.5">
          <p className="text-[8px] text-green-300">{t}</p>
          <p className="text-[6px] text-white/40 mt-0.5">L = π × r²  |  A = ½bh</p>
        </div>
      ))}
    </div>
  </MockupFrame>
);

const KonversiMockup = () => (
  <MockupFrame title="KONVERSI SATUAN" accentColor="text-blue-400">
    <div className="p-3 space-y-2">
      <p className="text-[9px] text-blue-300 font-bold text-center">KONVERSI SATUAN</p>
      <div className="grid grid-cols-2 gap-1">
        {["Panjang","Berat","Suhu","Waktu","Luas","Volume"].map((t) => (
          <div key={t} className="bg-white/5 border border-blue-400/20 rounded p-1 text-center">
            <p className="text-[7px] text-blue-300">{t}</p>
          </div>
        ))}
      </div>
      <div className="bg-white/5 rounded px-2 py-1.5 flex items-center gap-1">
        <div className="flex-1 bg-white/10 rounded text-[6px] text-white/50 px-1 py-0.5">1 km</div>
        <span className="text-[8px] text-blue-400">⇄</span>
        <div className="flex-1 bg-white/10 rounded text-[6px] text-white/50 px-1 py-0.5">1000 m</div>
      </div>
    </div>
  </MockupFrame>
);

const VideoMockup = () => (
  <MockupFrame title="VIDEO PEMBELAJARAN" accentColor="text-pink-400">
    <div className="p-3 space-y-2">
      <p className="text-[9px] text-pink-300 font-bold text-center">VIDEO PEMBELAJARAN</p>
      {["Kelas 7","Kelas 8","Kelas 9"].map((k) => (
        <div key={k} className="flex items-center gap-2 bg-white/5 border border-pink-400/20 rounded px-2 py-1.5">
          <div className="w-5 h-5 rounded bg-pink-500/30 flex items-center justify-center">
            <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-pink-300 border-b-[3px] border-b-transparent ml-0.5" />
          </div>
          <p className="text-[8px] text-white/70">{k} — Video Materi</p>
        </div>
      ))}
    </div>
  </MockupFrame>
);

const PerigkatMockup = () => (
  <MockupFrame title="PAPAN PERINGKAT" accentColor="text-yellow-400">
    <div className="p-3 space-y-1.5">
      <p className="text-[9px] text-yellow-300 font-bold text-center">🏅 PAPAN PERINGKAT</p>
      {[["🥇","Andi Pratama","9.850"],["🥈","Siti Rahayu","9.200"],["🥉","Budi Santoso","8.750"],["4","Dewi Lestari","8.100"]].map(([rank, name, score]) => (
        <div key={name} className="flex items-center gap-2 bg-white/5 rounded px-2 py-1">
          <span className="text-[8px]">{rank}</span>
          <span className="text-[7px] text-white/70 flex-1">{name}</span>
          <span className="text-[7px] text-yellow-400">{score}</span>
        </div>
      ))}
    </div>
  </MockupFrame>
);

const BankSoalMockup = () => (
  <MockupFrame title="BANK SOAL" accentColor="text-cyan-400">
    <div className="p-2">
      <p className="text-[9px] text-cyan-300 font-bold text-center mb-2">BANK SOAL</p>
      <div className="grid grid-cols-2 gap-1">
        {["Bilangan Bulat","Aljabar","Geometri","Perbandingan","Statistika","Himpunan","Persamaan","Fungsi"].map((t) => (
          <div key={t} className="bg-white/5 border border-cyan-400/20 rounded p-1 text-center">
            <div className="w-3 h-3 rounded-sm bg-cyan-400/30 mx-auto mb-0.5" />
            <p className="text-[5.5px] text-white/60">{t}</p>
          </div>
        ))}
      </div>
    </div>
  </MockupFrame>
);

const ChatMockup = () => (
  <MockupFrame title="NUMATIK AI" accentColor="text-purple-400">
    <div className="p-2 flex flex-col h-full">
      <p className="text-[8px] text-purple-300 font-bold text-center mb-1.5">NUMATIK AI 🤖</p>
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-full bg-purple-500/50 shrink-0 mt-0.5" />
          <div className="bg-purple-900/40 border border-purple-500/20 rounded px-1.5 py-1 max-w-[80%]">
            <p className="text-[6px] text-white/70">Halo Sobat Numatik! 🚀 Ada yang bisa aku bantu?</p>
          </div>
        </div>
        <div className="flex gap-1 justify-end">
          <div className="bg-blue-900/40 border border-blue-500/20 rounded px-1.5 py-1 max-w-[80%]">
            <p className="text-[6px] text-white/70">Bagaimana cara menghitung luas lingkaran?</p>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-full bg-purple-500/50 shrink-0 mt-0.5" />
          <div className="bg-purple-900/40 border border-purple-500/20 rounded px-1.5 py-1 max-w-[80%]">
            <p className="text-[6px] text-white/70">L = π × r² dimana r adalah jari-jari lingkaran...</p>
          </div>
        </div>
      </div>
      <div className="flex gap-1 mt-1">
        <div className="flex-1 bg-white/10 rounded px-1.5 py-1">
          <p className="text-[6px] text-white/30">Ketik pertanyaan...</p>
        </div>
        <div className="w-5 h-5 rounded bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
          <div className="w-2 h-2 text-white text-[8px]">→</div>
        </div>
      </div>
    </div>
  </MockupFrame>
);

const TKAMockup = () => (
  <MockupFrame title="TES KEMAMPUAN AKADEMIK" accentColor="text-indigo-400">
    <div className="p-3 space-y-2">
      <p className="text-[8px] text-indigo-300 font-bold text-center">TES KEMAMPUAN AKADEMIK</p>
      <div className="bg-white/5 rounded px-2 py-2 border border-indigo-400/20">
        <p className="text-[7px] text-white/70 mb-1.5">Soal No. 1 dari 20</p>
        <p className="text-[6px] text-white/60">Jika x² + 5x + 6 = 0, maka nilai x adalah...</p>
        {["A. x = -2 dan x = -3","B. x = 2 dan x = 3"].map((o) => (
          <div key={o} className="mt-1 bg-white/5 rounded px-1.5 py-0.5">
            <p className="text-[5.5px] text-white/50">{o}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="bg-indigo-500/20 rounded px-2 py-0.5">
          <p className="text-[6px] text-indigo-300">⏱ 45:00</p>
        </div>
        <div className="bg-indigo-500/20 rounded px-2 py-0.5">
          <p className="text-[6px] text-indigo-300">12/20 dijawab</p>
        </div>
      </div>
    </div>
  </MockupFrame>
);

const PengaturanMockup = () => (
  <MockupFrame title="PENGATURAN" accentColor="text-gray-400">
    <div className="p-3 space-y-2">
      <p className="text-[9px] text-gray-300 font-bold text-center">⚙️ PENGATURAN</p>
      <div className="space-y-1.5">
        {[["Mode Tampilan","🌙 Gelap / ☀️ Terang"],["Suara Latar","ON / OFF"],["Efek Suara","ON / OFF"]].map(([label, val]) => (
          <div key={label} className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1.5">
            <span className="text-[7px] text-white/60">{label}</span>
            <span className="text-[7px] text-cyan-400">{val}</span>
          </div>
        ))}
      </div>
    </div>
  </MockupFrame>
);

/* ── SLIDE 3 MOCKUP: Ruang Untuk Guru ── */
const RuangGuruMockup = () => {
  const { language } = useLanguage();
  const rg = {
    id: {
      frameTitle: "RUANG UNTUK GURU",
      sectionTitle: "👨‍🏫 RUANG UNTUK GURU",
      items: [
        { icon: "🎯", label: "CP" },
        { icon: "📋", label: "ATP" },
        { icon: "📖", label: "RPP" },
        { icon: "🤝", label: "KEYAKINAN" },
        { icon: "💌", label: "PESAN" },
        { icon: "✅", label: "RUBRIK" },
        { icon: "📓", label: "JURNAL" },
        { icon: "📅", label: "AGENDA" },
        { icon: "🎮", label: "GAME" },
      ],
    },
    en: {
      frameTitle: "TEACHER'S ROOM",
      sectionTitle: "👨‍🏫 TEACHER'S ROOM",
      items: [
        { icon: "🎯", label: "CP" },
        { icon: "📋", label: "ATP" },
        { icon: "📖", label: "RPP" },
        { icon: "🤝", label: "AGREEMENT" },
        { icon: "💌", label: "FEEDBACK" },
        { icon: "✅", label: "RUBRIC" },
        { icon: "📓", label: "JOURNAL" },
        { icon: "📅", label: "AGENDA" },
        { icon: "🎮", label: "GAME" },
      ],
    },
    ja: {
      frameTitle: "教師用ルーム",
      sectionTitle: "👨‍🏫 教師用ルーム",
      items: [
        { icon: "🎯", label: "CP" },
        { icon: "📋", label: "ATP" },
        { icon: "📖", label: "RPP" },
        { icon: "🤝", label: "学級目標" },
        { icon: "💌", label: "感想" },
        { icon: "✅", label: "評価" },
        { icon: "📓", label: "日誌" },
        { icon: "📅", label: "予定" },
        { icon: "🎮", label: "ゲーム" },
      ],
    },
  }[language];
  return (
    <MockupFrame title={rg.frameTitle} accentColor="text-cyan-400">
      <div className="p-2 space-y-1.5">
        <p className="text-[8px] text-cyan-300 font-bold text-center">{rg.sectionTitle}</p>
        <div className="grid grid-cols-3 gap-1">
          {rg.items.map((item) => (
            <div key={item.label} className="bg-white/5 border border-cyan-400/20 rounded p-1 text-center">
              <div className="text-[9px] mb-0.5">{item.icon}</div>
              <p className="text-[5px] text-white/60 leading-tight">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
};

const LKPDMockup = () => (
  <MockupFrame title="LKPD" accentColor="text-cyan-400">
    <div className="p-3 space-y-2">
      <p className="text-[8px] text-cyan-300 font-bold text-center">📋 LEMBAR KERJA PESERTA DIDIK</p>
      {["KELAS 7", "KELAS 8", "KELAS 9"].map((k) => (
        <div key={k} className="flex items-center gap-2 bg-white/5 border border-cyan-400/20 rounded px-2 py-1.5">
          <div className="w-4 h-4 rounded bg-cyan-500/30 flex items-center justify-center text-[8px]">🎓</div>
          <div className="flex-1">
            <p className="text-[8px] text-white/80 font-semibold">{k}</p>
            <p className="text-[5.5px] text-white/40">LKPD matematika SMP</p>
          </div>
          <span className="text-[6px] text-cyan-400 font-bold">BUKA</span>
        </div>
      ))}
    </div>
  </MockupFrame>
);

/* ── SLIDE 2 MOCKUP: Navigasi Aplikasi ── */
const NavPetunjukMockup = () => {
  const { language } = useLanguage();
  const nav = {
    id: {
      frameTitle: "NAVIGASI APLIKASI",
      sectionTitle: "Tombol Navigasi",
      items: [
        { icon: "🏠", label: "Home",    desc: "Kembali ke halaman utama" },
        { icon: "←",  label: "Kembali", desc: "Halaman sebelumnya" },
        { icon: "→",  label: "Lanjut",  desc: "Halaman berikutnya" },
        { icon: "✕",  label: "Keluar",  desc: "Menutup aplikasi" },
      ],
    },
    en: {
      frameTitle: "APP NAVIGATION",
      sectionTitle: "Navigation Buttons",
      items: [
        { icon: "🏠", label: "Home", desc: "Return to home page" },
        { icon: "←",  label: "Back", desc: "Previous page" },
        { icon: "→",  label: "Next", desc: "Next page" },
        { icon: "✕",  label: "Exit", desc: "Close the app" },
      ],
    },
    ja: {
      frameTitle: "ナビゲーション",
      sectionTitle: "ナビゲーションボタン",
      items: [
        { icon: "🏠", label: "ホーム", desc: "ホームページに戻る" },
        { icon: "←",  label: "戻る",   desc: "前のページ" },
        { icon: "→",  label: "次へ",   desc: "次のページ" },
        { icon: "✕",  label: "終了",   desc: "アプリを閉じる" },
      ],
    },
  }[language];
  return (
    <MockupFrame title={nav.frameTitle} accentColor="text-cyan-400">
      <div className="p-3 space-y-2">
        <p className="text-[8px] text-cyan-300 font-bold text-center mb-2">{nav.sectionTitle}</p>
        {nav.items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-2 py-1.5">
            <div className="w-5 h-5 rounded bg-cyan-500/20 flex items-center justify-center text-[9px]">{item.icon}</div>
            <div>
              <p className="text-[7px] text-white/80 font-semibold">{item.label}</p>
              <p className="text-[6px] text-white/40">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
};

/* ─────────────────────────────────────────────────────────────
   SLIDES BUILDER  — slides 1-4 trilingual, 5-17 unchanged (ID)
───────────────────────────────────────────────────────────── */
function getSlides(language: Language): Slide[] {
  /* ── Slide 1: Welcome ── */
  const s1 = {
    id: {
      title: "Selamat Datang di NUMATIK",
      desc: "NUMATIK (Numerasi Aktif dengan Teknologi Informasi dan Komunikasi) adalah aplikasi pembelajaran matematika interaktif untuk siswa SMP kelas 7, 8, dan 9. Dirancang dengan tema galaksi dan Salju yang seru dan modern.",
      steps: [
        "Buka aplikasi dan klik tombol 'MULAI' di halaman beranda",
        "Pilih menu yang ingin kamu gunakan dari Menu Utama",
        "Gunakan tombol navigasi di sudut layar untuk berpindah halaman",
        "Nikmati belajar matematika dengan cara yang seru!",
      ],
    },
    en: {
      title: "Welcome to NUMATIK",
      desc: "NUMATIK (Numerasi Aktif dengan Teknologi Informasi dan Komunikasi) is an interactive math learning app for junior high school students in grades 7, 8, and 9. Designed with a fun and modern galaxy and snow theme.",
      steps: [
        "Open the app and click the 'START' button on the home page",
        "Choose the menu you want to use from the Main Menu",
        "Use the navigation buttons in the corner of the screen to switch pages",
        "Enjoy learning math in a fun way!",
      ],
    },
    ja: {
      title: "NUMATIKへようこそ",
      desc: "NUMATIKは中学1・2・3年生向けのインタラクティブな数学学習アプリです。銀河と雪をテーマにした楽しくモダンなデザインが特徴です。",
      steps: [
        "アプリを開き、ホーム画面の「スタート」ボタンをクリック",
        "メインメニューから使いたいメニューを選択",
        "画面の角にあるナビゲーションボタンでページを移動",
        "楽しく数学を学ぼう！",
      ],
    },
  }[language];

  /* ── Slide 2: Navigation ── */
  const s2 = {
    id: {
      title: "Navigasi Aplikasi",
      desc: "Terdapat 4 tombol navigasi utama yang selalu tersedia di setiap halaman untuk memudahkan kamu berpindah antar halaman.",
      steps: [
        "🏠 Tombol Home — kembali ke halaman utama kapan saja",
        "← Tombol Kiri — kembali ke halaman sebelumnya",
        "→ Tombol Kanan — lanjut ke halaman berikutnya",
        "✕ Tombol Silang — keluar dari aplikasi",
      ],
    },
    en: {
      title: "App Navigation",
      desc: "There are 4 main navigation buttons always available on every page to help you move between pages easily.",
      steps: [
        "🏠 Home Button — return to the home page at any time",
        "← Left Button — go back to the previous page",
        "→ Right Button — proceed to the next page",
        "✕ Close Button — exit the application",
      ],
    },
    ja: {
      title: "ナビゲーション",
      desc: "すべてのページに4つのメインナビゲーションボタンが常に表示されており、ページ間の移動が簡単にできます。",
      steps: [
        "🏠 ホームボタン — いつでもホームページに戻る",
        "← 左ボタン — 前のページに戻る",
        "→ 右ボタン — 次のページに進む",
        "✕ 閉じるボタン — アプリを終了する",
      ],
    },
  }[language];

  /* ── Slide 3 (id:17): Teacher's Room ── */
  const s3 = {
    id: {
      title: "Ruang Untuk Guru",
      desc: "Wadah khusus bagi pendidik yang menyediakan berbagai perangkat bantu untuk optimalisasi kegiatan belajar mengajar — mulai dari Capaian Pembelajaran, ATP, RPP, Keyakinan Kelas, hingga Jurnal dan Agenda Guru.",
      steps: [
        "Pilih 'RUANG UNTUK GURU' dari Menu Utama",
        "Pilih perangkat yang ingin diakses (CP, ATP, RPP, dll)",
        "Pelajari atau gunakan dokumen sebagai panduan mengajar",
        "Catat agenda harian dan jurnal kelas pada menu yang tersedia",
        "Manfaatkan rubrik penilaian untuk evaluasi peserta didik",
      ],
      submenus: [
        "CAPAIAN PEMBELAJARAN — CP matematika Fase D",
        "ATP — Alur Tujuan Pembelajaran",
        "RPP — Rencana Pelaksanaan Pembelajaran",
        "KEYAKINAN KELAS — nilai dan kesepakatan bersama",
        "PESAN DAN KESAN — masukan pengguna aplikasi",
        "RUBRIK PENILAIAN DIMENSI LULUSAN — 7 dimensi profil lulusan",
        "JURNAL GURU — kejadian dan tindak lanjut peserta didik",
        "AGENDA GURU — agenda harian dan kehadiran",
        "NUMATIK GAME — koleksi lengkap game matematika",
      ],
    },
    en: {
      title: "Teacher's Room",
      desc: "A dedicated space for educators that provides various tools to optimize teaching and learning — from Learning Outcomes, ATP, Lesson Plans, and Class Agreements to Teacher Journals and Agendas.",
      steps: [
        "Select 'TEACHER'S ROOM' from the Main Menu",
        "Choose the tool you want to access (CP, ATP, RPP, etc.)",
        "Study or use the document as a teaching guide",
        "Record daily agendas and class journals in the available menu",
        "Use the assessment rubric to evaluate students",
      ],
      submenus: [
        "LEARNING OUTCOMES — Math CP for Phase D",
        "ATP — Learning Goal Flow",
        "RPP — Lesson Plan",
        "CLASS AGREEMENT — shared values and class norms",
        "FEEDBACK — user input for the app",
        "GRADUATE DIMENSION RUBRIC — 7 graduate profile dimensions",
        "TEACHER'S JOURNAL — student events and follow-ups",
        "TEACHER'S AGENDA — daily agenda and attendance",
        "NUMATIK GAME — complete math game collection",
      ],
    },
    ja: {
      title: "教師用ルーム",
      desc: "教育者のための専用スペース。学習到達目標、ATP、授業計画、学級目標から教師日誌・議題まで、授業最適化ツールを提供します。",
      steps: [
        "メインメニューから「教師用ルーム」を選択",
        "アクセスしたいツールを選択（CP、ATP、RPPなど）",
        "ドキュメントを授業ガイドとして活用",
        "日々の議題とクラス日誌を記録",
        "評価ルーブリックで生徒を評価",
      ],
      submenus: [
        "学習到達目標 — 数学フェーズD",
        "ATP — 学習目標フロー",
        "RPP — 授業計画",
        "学級目標 — 共有する価値と学級規範",
        "フィードバック — アプリへのユーザー意見",
        "卒業生評価ルーブリック — 7つの卒業生プロフィール",
        "教師日誌 — 生徒の出来事とフォローアップ",
        "教師の議題 — 日程と出席状況",
        "NUMATIK GAME — 数学ゲームコレクション",
      ],
    },
  }[language];

  /* ── Slide 4 (id:3): Math Materials ── */
  const s4 = {
    id: {
      title: "Materi Matematika",
      desc: "Berisi materi pembelajaran matematika lengkap sesuai kurikulum SMP, mulai dari kelas 7 hingga kelas 9. Setiap materi dilengkapi dengan penjelasan detail, contoh soal, dan ilustrasi.",
      steps: [
        "Pilih 'MATERI MATEMATIKA' dari Menu Utama",
        "Pilih kelas: Kelas 7, Kelas 8, atau Kelas 9",
        "Pilih bab atau topik yang ingin dipelajari",
        "Baca materi dengan seksama dan pelajari contoh soalnya",
      ],
      submenus: [
        "Kelas 7 : Bilangan bulat, Pecahan, Aljabar, Persamaan dan Pertidaksamaan Linear Satu Variabel, Perbandingan, Aritmetika Sosial, Garis dan Sudut, Segitiga dan Segiempat, Himpunan",
        "Kelas 8 : Pola Bilangan, Koordinat Kartesius, Relasi dan Fungsi, Sistem Persamaan Linear Dua Variabel, Persamaan Garis Lurus, Teorema Pythagoras, Lingkaran, Garis Singgung Lingkaran, Bangun Ruang Sisi Datar",
        "Kelas 9 : Bilangan Berpangkat, Kesebangunan dan Kekongruenan, Transformasi Geometri, Bangun Ruang Sisi Lengkung, Statistika, Peluang, Persamaan Kuadrat (Pengayaan), Fungsi Kuadrat (Pengayaan)",
      ],
    },
    en: {
      title: "Mathematics Materials",
      desc: "Contains complete math learning materials for the junior high school curriculum, from grade 7 to grade 9. Each topic includes detailed explanations, example problems, and illustrations.",
      steps: [
        "Select 'MATHEMATICS MATERIALS' from the Main Menu",
        "Choose a grade: Grade 7, Grade 8, or Grade 9",
        "Select the chapter or topic you want to study",
        "Read the material carefully and study the example problems",
      ],
      submenus: [
        "Grade 7: Bilangan bulat, Pecahan, Aljabar, Persamaan dan Pertidaksamaan Linear Satu Variabel, Perbandingan, Aritmetika Sosial, Garis dan Sudut, Segitiga dan Segiempat, Himpunan",
        "Grade 8: Pola Bilangan, Koordinat Kartesius, Relasi dan Fungsi, Sistem Persamaan Linear Dua Variabel, Persamaan Garis Lurus, Teorema Pythagoras, Lingkaran, Garis Singgung Lingkaran, Bangun Ruang Sisi Datar",
        "Grade 9: Bilangan Berpangkat, Kesebangunan dan Kekongruenan, Transformasi Geometri, Bangun Ruang Sisi Lengkung, Statistika, Peluang, Persamaan Kuadrat (enrichment), Fungsi Kuadrat (enrichment)",
      ],
    },
    ja: {
      title: "数学教材",
      desc: "中学1〜3年の数学カリキュラムに対応した教材を完全収録。各単元には詳細な解説、例題、イラストが含まれています。",
      steps: [
        "メインメニューから「数学教材」を選択",
        "学年を選択：中学1年、中学2年、または中学3年",
        "学習したい章またはトピックを選択",
        "教材をよく読み、例題を解いてみよう",
      ],
      submenus: [
        "中学1年: Bilangan bulat, Pecahan, Aljabar, Persamaan dan Pertidaksamaan Linear Satu Variabel, Perbandingan, Aritmetika Sosial, Garis dan Sudut, Segitiga dan Segiempat, Himpunan",
        "中学2年: Pola Bilangan, Koordinat Kartesius, Relasi dan Fungsi, Sistem Persamaan Linear Dua Variabel, Persamaan Garis Lurus, Teorema Pythagoras, Lingkaran, Garis Singgung Lingkaran, Bangun Ruang Sisi Datar",
        "中学3年: Bilangan Berpangkat, Kesebangunan dan Kekongruenan, Transformasi Geometri, Bangun Ruang Sisi Lengkung, Statistika, Peluang, Persamaan Kuadrat（発展）, Fungsi Kuadrat（発展）",
      ],
    },
  }[language];

  return [
    /* ── 1: Welcome ── */
    {
      id: 1,
      title: s1.title,
      icon: <Star className="w-8 h-8" />,
      color: "text-cyan-400",
      bgGradient: "from-cyan-900/30 to-blue-900/30",
      description: s1.desc,
      steps: s1.steps,
      mockup: <MenuMockup />,
    },
    /* ── 2: Navigation ── */
    {
      id: 2,
      title: s2.title,
      icon: <Home className="w-8 h-8" />,
      color: "text-cyan-400",
      bgGradient: "from-slate-900/30 to-cyan-900/30",
      description: s2.desc,
      steps: s2.steps,
      mockup: <NavPetunjukMockup />,
    },
    /* ── 3: Teacher's Room (id 17) ── */
    {
      id: 17,
      title: s3.title,
      icon: <GraduationCap className="w-8 h-8" />,
      color: "text-cyan-400",
      bgGradient: "from-cyan-900/30 to-blue-900/30",
      description: s3.desc,
      steps: s3.steps,
      submenus: s3.submenus,
      mockup: <RuangGuruMockup />,
    },
    /* ── 4: Math Materials (id 3) ── */
    {
      id: 3,
      title: s4.title,
      icon: <BookOpen className="w-8 h-8" />,
      color: "text-cyan-400",
      bgGradient: "from-cyan-900/30 to-teal-900/30",
      description: s4.desc,
      steps: s4.steps,
      submenus: s4.submenus,
      mockup: <MateriMockup />,
    },
    /* ══════════════════════════════════════════════════════════
       SLIDES 5-17 — Unchanged (still Indonesian; next phases)
    ══════════════════════════════════════════════════════════ */
    {
      id: 4,
      title: "Tugas - Latihan Mandiri",
      icon: <ClipboardList className="w-8 h-8" />,
      color: "text-yellow-400",
      bgGradient: "from-yellow-900/20 to-amber-900/20",
      description: "Latihan soal per topik untuk menguji pemahaman kamu. Tersedia soal latihan untuk setiap bab dengan langsung diberikan jawaban dan pembahasannya.",
      steps: [
        "Pilih 'TUGAS - LATIHAN MANDIRI' dari Menu Utama",
        "Pilih kelas (7, 8, atau 9) yang sesuai",
        "Pilih topik/bab yang ingin dilatih",
        "Kerjakan soal dan periksa jawabanmu",
      ],
      submenus: ["Kelas 7 — soal latihan tiap bab", "Kelas 8 — soal latihan tiap bab", "Kelas 9 — soal latihan tiap bab"],
      mockup: <LatihanMockup />,
    },
    {
      id: 18,
      title: "LKPD (Lembar Kerja Peserta Didik)",
      icon: <ClipboardCheck className="w-8 h-8" />,
      color: "text-cyan-400",
      bgGradient: "from-cyan-900/30 to-teal-900/30",
      description: "Lembar Kerja Peserta Didik (LKPD) interaktif yang dirancang untuk membantu siswa memahami konsep matematika melalui aktivitas belajar terstruktur. Setiap LKPD dilengkapi dengan kegiatan eksplorasi, latihan soal, serta refleksi pembelajaran.",
      steps: [
        "Pilih 'LKPD' dari Menu Utama",
        "Pilih kelas (7, 8, atau 9) sesuai dengan jenjangmu",
        "Pilih topik/materi LKPD yang ingin dikerjakan",
        "Ikuti petunjuk dan kerjakan setiap aktivitas dengan seksama",
        "Refleksikan hasil pembelajaran di bagian akhir LKPD",
      ],
      submenus: [
        "LKPD Kelas 7 — sesuai materi kelas 7 SMP",
        "LKPD Kelas 8 — sesuai materi kelas 8 SMP",
        "LKPD Kelas 9 — sesuai materi kelas 9 SMP",
      ],
      mockup: <LKPDMockup />,
    },
    {
      id: 5,
      title: "Math Game Arena",
      icon: <Gamepad2 className="w-8 h-8" />,
      color: "text-orange-400",
      bgGradient: "from-orange-900/20 to-red-900/20",
      description: "Belajar matematika sambil bermain! Math Game Arena menghadirkan game interaktif bertema matematika yang seru dan menantang untuk setiap jenjang kelas.",
      steps: [
        "Pilih 'MATH GAME ARENA' dari Menu Utama",
        "Pilih kelas yang sesuai (7, 8, atau 9)",
        "Pilih jenis game yang ingin dimainkan",
        "Kerjakan soal matematika dalam format game yang menyenangkan dengan cara menekan meteor pada jawaban yang benar maka pesawat otomatis akan menembak dan keluar notif benar, namun jika menekan meteor dengan jawaban yang salah maka akan keluar notif salah",
      ],
      submenus: ["Kelas 7 - Game Materi Kelas 7", "Kelas 8 - Game Materi Kelas 8", "Kelas 9 - Game Materi Kelas 9"],
      mockup: <GameMockup />,
    },
    {
      id: 6,
      title: "Kalkulator Scientific",
      icon: <Calculator className="w-8 h-8" />,
      color: "text-purple-400",
      bgGradient: "from-purple-900/20 to-violet-900/20",
      description: "Kalkulator ilmiah lengkap dengan fungsi trigonometri, logaritma, akar, pangkat, dan banyak lagi. Cocok untuk membantu mengerjakan soal matematika yang kompleks.",
      steps: [
        "Pilih 'KALKULATOR SCIENTIFIC' dari Menu Utama",
        "Ketik angka menggunakan tombol angka di layar",
        "Pilih fungsi matematika (sin, cos, tan, log, dll)",
        "Tekan '=' untuk mendapatkan hasil perhitungan",
        "Gunakan tombol 'AC' untuk menghapus semua / 'DEL' untuk hapus satu digit",
      ],
      submenus: ["Mode NORM — perhitungan normal", "Mode MATH — tampilan matematika", "Mode FRAC — perhitungan pecahan", "Mode DEG/RAD — sudut derajat/radian"],
      mockup: <KalkulatorMockup />,
    },
    {
      id: 7,
      title: "Olimpiade Matematika",
      icon: <Trophy className="w-8 h-8" />,
      color: "text-yellow-400",
      bgGradient: "from-yellow-900/20 to-orange-900/20",
      description: "Soal-soal olimpiade matematika tingkat SMP untuk kamu yang suka tantangan! Berisi soal-soal tingkat kesulitan tinggi dari berbagai topik matematika.",
      steps: [
        "Pilih 'OLIMPIADE MATEMATIKA' dari Menu Utama",
        "Pilih topik olimpiade yang ingin dicoba",
        "Kerjakan soal dengan seksama — tingkat kesulitannya lebih tinggi",
        "Pelajari pembahasannya untuk meningkatkan kemampuan",
      ],
      submenus: ["Bilangan Bulat & Rasional", "Bilangan Berpangkat & Irasional", "KPK, FPB & Modulo", "Himpunan & Relasi Fungsi", "Dan masih banyak topik lainnya"],
      mockup: <OlimpiadeMockup />,
    },
    {
      id: 8,
      title: "Kumpulan Rumus",
      icon: <BookMarked className="w-8 h-8" />,
      color: "text-green-400",
      bgGradient: "from-green-900/20 to-emerald-900/20",
      description: "Kumpulan rumus matematika SMP yang lengkap dan terorganisir. Bisa digunakan sebagai referensi cepat saat belajar atau mengerjakan soal.",
      steps: [
        "Pilih 'KUMPULAN RUMUS' dari Menu Utama",
        "Cari kategori rumus yang dibutuhkan",
        "Baca dan pelajari rumus beserta keterangannya",
        "Gunakan sebagai referensi saat mengerjakan latihan soal",
      ],
      submenus: ["Seluruh Materi Kelas 7, Kelas 8, Kelas 9"],
      mockup: <RumusMockup />,
    },
    {
      id: 9,
      title: "Konversi Satuan",
      icon: <ArrowLeftRight className="w-8 h-8" />,
      color: "text-blue-400",
      bgGradient: "from-blue-900/20 to-indigo-900/20",
      description: "Alat konversi satuan yang lengkap untuk mengubah berbagai macam satuan pengukuran secara cepat dan akurat.",
      steps: [
        "Pilih 'KONVERSI SATUAN' dari Menu Utama",
        "Pilih jenis satuan (Panjang, Berat, Suhu, Waktu, dll)",
        "Masukkan nilai yang ingin dikonversi",
        "Pilih satuan asal dan satuan tujuan",
        "Hasil konversi ditampilkan secara otomatis",
      ],
      submenus: ["Panjang (km, m, cm, mm, inci, kaki)", "Berat (kg, gram, ons, pound)", "Suhu (Celsius, Fahrenheit, Kelvin)", "Waktu (jam, menit, detik)", "Luas & Volume"],
      mockup: <KonversiMockup />,
    },
    {
      id: 10,
      title: "Video Pembelajaran",
      icon: <PlayCircle className="w-8 h-8" />,
      color: "text-pink-400",
      bgGradient: "from-pink-900/20 to-rose-900/20",
      description: "Belajar melalui video pembelajaran yang interaktif dan mudah dipahami. Video diorganisir berdasarkan kelas dan topik materi.",
      steps: [
        "Pilih 'VIDEO PEMBELAJARAN' dari Menu Utama",
        "Pilih kelas yang sesuai (7, 8, atau 9)",
        "Pilih topik video yang ingin ditonton",
        "Tonton video pembelajaran dengan seksama",
        "Pause atau putar ulang jika ada bagian yang belum dipahami",
      ],
      submenus: ["Kelas 7 : Seluruh Materi Kelas 7", "Kelas 8 : Seluruh Materi Kelas 8", "Kelas 9 : Seluruh Materi Kelas 9"],
      mockup: <VideoMockup />,
    },
    {
      id: 12,
      title: "Bank Soal",
      icon: <FileText className="w-8 h-8" />,
      color: "text-cyan-400",
      bgGradient: "from-cyan-900/20 to-blue-900/20",
      description: "Koleksi lengkap soal-soal matematika SMP dari berbagai topik. Cocok untuk latihan intensif dan persiapan ujian.",
      steps: [
        "Pilih 'BANK SOAL' dari Menu Utama",
        "Pilih topik soal yang ingin dikerjakan",
        "Kerjakan soal-soal yang tersedia",
        "Periksa jawabanmu dan pelajari pembahasannya",
      ],
      submenus: ["Seluruh Materi Kelas 7, 8 dan 9"],
      mockup: <BankSoalMockup />,
    },
    {
      id: 13,
      title: "Chat dengan NUMATIK AI",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "text-purple-400",
      bgGradient: "from-purple-900/20 to-indigo-900/20",
      description: "NUMATIK AI adalah asisten matematika cerdas berbasis kecerdasan buatan (AI). Tanyakan soal matematika apapun dan dapatkan penjelasan langkah demi langkah!",
      steps: [
        "Pilih 'NUMATIK ARTIFICIAL INTELLIGENCE (AI)' dari Menu Utama",
        "Ketik pertanyaan matematikamu di kolom chat",
        "Klik tombol kirim atau tekan Enter",
        "NUMATIK AI akan menjawab dengan penjelasan detail step-by-step",
        "Klik pertanyaan contoh untuk memulai percakapan dengan cepat",
      ],
      submenus: ["Bisa menjelaskan konsep matematika", "Bisa membantu mengerjakan soal", "Bisa memberikan contoh-contoh tambahan", "Mendukung format rumus matematika (LaTeX)"],
      mockup: <ChatMockup />,
    },
    {
      id: 14,
      title: "Tes Kemampuan Akademik (TKA)",
      icon: <Brain className="w-8 h-8" />,
      color: "text-indigo-400",
      bgGradient: "from-indigo-900/20 to-violet-900/20",
      description: "Uji kemampuan akademik matematikamu dengan soal-soal TKA yang mirip dengan ujian masuk perguruan tinggi. Cocok untuk siswa kelas 9 yang ingin persiapan lebih.",
      steps: [
        "Pilih 'TES KEMAMPUAN AKADEMIK' dari Menu Utama",
        "Baca petunjuk tes dengan seksama sebelum mulai",
        "Ketika jawaban di klik akan muncul apakah jawabanmu benar/salah",
        "Boleh dilihat pembahasannya agar kamu lebih mengerti",
      ],
      mockup: <TKAMockup />,
    },
    {
      id: 15,
      title: "Pengaturan",
      icon: <Settings className="w-8 h-8" />,
      color: "text-gray-400",
      bgGradient: "from-slate-900/30 to-gray-900/30",
      description: "Sesuaikan tampilan dan pengalaman menggunakan aplikasi NUMATIK sesuai preferensimu.",
      steps: [
        "Pilih 'PENGATURAN' dari Menu Utama",
        "Aktifkan Mode Gelap/Terang sesuai selera",
        "Atur suara latar (ambient music) ON/OFF",
        "Atur efek suara (tombol pop) ON/OFF",
      ],
      submenus: ["Mode Gelap — background galaxy biru gelap", "Mode Terang — background salju putih bersih", "Suara Latar — musik galaksi ambient", "Efek Suara — suara klik tombol"],
      mockup: <PengaturanMockup />,
    },
    {
      id: 16,
      title: "Donasi, Biografi & Referensi",
      icon: <Heart className="w-8 h-8" />,
      color: "text-red-400",
      bgGradient: "from-red-900/20 to-pink-900/20",
      description: "Informasi pendukung tentang aplikasi NUMATIK, termasuk cara mendukung pengembangan app, profil pembuat, dan daftar pustaka yang digunakan.",
      steps: [
        "Menu DONASI — dukung pengembangan NUMATIK agar terus berkembang",
        "Menu BIOGRAFI — kenali profil dan latar belakang pembuat aplikasi",
        "Menu SUMBER REFERENSI — lihat daftar pustaka yang digunakan",
        "Menu TENTANG APLIKASI — informasi versi dan deskripsi aplikasi",
      ],
      mockup: (
        <MockupFrame title="INFO APLIKASI" accentColor="text-red-400">
          <div className="p-3 space-y-2">
            {[
              { icon: "❤️", label: "DONASI",          desc: "Dukung pengembangan", color: "text-red-400" },
              { icon: "👤", label: "BIOGRAFI",         desc: "Profil pembuat",      color: "text-blue-400" },
              { icon: "📚", label: "SUMBER REFERENSI", desc: "Daftar pustaka",      color: "text-green-400" },
              { icon: "ℹ️", label: "TENTANG",          desc: "Info aplikasi",       color: "text-cyan-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-2 py-1.5">
                <span className="text-sm">{item.icon}</span>
                <div>
                  <p className={`text-[8px] font-bold ${item.color}`}>{item.label}</p>
                  <p className="text-[6px] text-white/40">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </MockupFrame>
      ),
    },
  ];
}

/* ─────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────── */
const PetunjukPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark   = theme === "dark";
  const isWhite  = theme === "white";
  const isSunset = theme === "sunset";

  const [current, setCurrent] = useState(0);

  /* Recompute slides when language changes */
  const slides = useMemo(() => getSlides(language), [language]);
  const total   = slides.length;

  /* UI chrome strings for current language */
  const uiT = uiTrans[language];

  const prev = useCallback(() => {
    playPopSound();
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    playPopSound();
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  /* Clamp current index when language changes (slide count stays 17, so safe) */
  const safeIdx = Math.min(current, total - 1);
  const slide   = slides[safeIdx];

  return (
    <div className={`relative min-h-screen flex flex-col overflow-hidden ${isDark ? "gradient-space" : isSunset ? "gradient-sunset" : "gradient-snow"}`}>
      {(isDark || isSunset) ? <Starfield /> : !isWhite && <Snowfall />}
      <PageNavigation />

      <div className="relative z-10 flex flex-col items-center justify-start pt-16 pb-6 px-4 min-h-screen">
        {/* Header */}
        <div className="text-center mb-4">
          <img src="/logo-numatik.png" alt="NUMATIK" className="w-14 h-14 object-contain mx-auto mb-2 drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]" />
          <h1 className={`font-display text-2xl md:text-3xl font-bold text-glow-cyan ${isDark ? "text-primary" : "text-blue-800"}`}>
            {uiT.pageTitle}
          </h1>
          <p className={`text-xs font-body mt-1 ${isDark ? "text-white/50" : "text-blue-500"}`}>
            {uiT.slideCounterFmt(safeIdx + 1, total)}
          </p>
        </div>

        {/* Slide Card */}
        <div className={`w-full max-w-3xl backdrop-blur-md border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isDark ? "bg-card/50 border-border/40" : "bg-white/80 border-blue-200/60"
        }`}>
          {/* Slide Top Bar */}
          <div className={`px-5 py-3 border-b flex items-center gap-3 ${isDark ? `bg-gradient-to-r ${slide.bgGradient} border-border/30` : "bg-blue-50/80 border-blue-100"}`}>
            <div className={`${slide.color}`}>{slide.icon}</div>
            <div>
              <p className={`font-display font-bold text-base md:text-lg ${slide.color}`}>{slide.title}</p>
              <p className={`text-xs font-body ${isDark ? "text-white/40" : "text-gray-400"}`}>{uiT.menuCounterFmt(safeIdx + 1, total)}</p>
            </div>
          </div>

          {/* Slide Body */}
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-5">
              {/* Left: Mockup */}
              <div className="md:w-56 shrink-0">
                {slide.mockup}
              </div>

              {/* Right: Info */}
              <div className="flex-1 space-y-4">
                {/* Description */}
                <div className={`rounded-xl p-3 border ${isDark ? "bg-white/5 border-white/10" : "bg-blue-50/60 border-blue-100"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className={`w-4 h-4 ${slide.color}`} />
                    <span className={`text-xs font-semibold font-display ${slide.color}`}>{uiT.aboutSection}</span>
                  </div>
                  <p className={`text-xs font-body leading-relaxed ${isDark ? "text-white/70" : "text-gray-600"}`}>
                    {slide.description}
                  </p>
                </div>

                {/* Steps */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className={`w-4 h-4 ${slide.color}`} />
                    <span className={`text-xs font-semibold font-display ${slide.color}`}>{uiT.howToUseSection}</span>
                  </div>
                  <ol className="space-y-1.5">
                    {slide.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mt-0.5 ${
                          isDark ? `bg-gradient-to-br ${slide.bgGradient} border border-white/10` : "bg-blue-100"
                        } ${slide.color}`}>
                          {i + 1}
                        </span>
                        <p className={`text-xs font-body leading-relaxed ${isDark ? "text-white/70" : "text-gray-600"}`}>{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Submenus */}
                {slide.submenus && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className={`w-4 h-4 ${slide.color}`} />
                      <span className={`text-xs font-semibold font-display ${slide.color}`}>{uiT.subMenuSection}</span>
                    </div>
                    <ul className="space-y-1">
                      {slide.submenus.map((sub, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${slide.color} opacity-60`} style={{ background: "currentColor" }} />
                          <p className={`text-xs font-body ${isDark ? "text-white/55" : "text-gray-500"}`}>{sub}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col items-center gap-3 mt-4 w-full">
          {/* Dot indicators */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { playPopSound(); setCurrent(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === safeIdx
                    ? `w-5 h-2 ${isDark ? "bg-primary" : "bg-blue-500"}`
                    : `w-2 h-2 ${isDark ? "bg-white/20 hover:bg-white/40" : "bg-blue-200 hover:bg-blue-400"}`
                }`}
              />
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center justify-between w-full gap-3">
            <button
              onClick={prev}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-body font-medium transition-all whitespace-nowrap ${
                isDark
                  ? "bg-card/60 border-border/40 text-white/70 hover:border-primary/50 hover:text-primary"
                  : "bg-white/80 border-blue-200 text-blue-600 hover:border-blue-400"
              }`}
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              {uiT.prevBtn}
            </button>

            <button
              onClick={next}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-body font-medium transition-all whitespace-nowrap ${
                isDark
                  ? "bg-card/60 border-border/40 text-white/70 hover:border-primary/50 hover:text-primary"
                  : "bg-white/80 border-blue-200 text-blue-600 hover:border-blue-400"
              }`}
            >
              {uiT.nextBtn}
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/menu"); }}
          className={`mt-4 text-sm font-body transition-colors cursor-pointer ${isDark ? "text-white/40 hover:text-primary" : "text-blue-400 hover:text-blue-600"}`}
        >
          {uiT.backToMenu}
        </button>
      </div>
    </div>
  );
};

export default PetunjukPage;
