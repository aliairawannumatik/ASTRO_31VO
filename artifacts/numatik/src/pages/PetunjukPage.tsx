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
/* ── SLIDE 5 MOCKUP: Latihan Mandiri ── */
const LatihanMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: { frameTitle: "TUGAS - LATIHAN MANDIRI", sectionTitle: "TUGAS - LATIHAN MANDIRI", grades: ["KELAS 7", "KELAS 8", "KELAS 9"], action: "BUKA" },
    en: { frameTitle: "PRACTICE TASKS",          sectionTitle: "PRACTICE TASKS",          grades: ["GRADE 7", "GRADE 8", "GRADE 9"], action: "OPEN" },
    ja: { frameTitle: "練習課題",                  sectionTitle: "練習課題",                  grades: ["中学1年",  "中学2年",  "中学3年"],  action: "開く" },
  }[language];
  return (
    <MockupFrame title={m.frameTitle} accentColor="text-yellow-400">
      <div className="p-3 space-y-2">
        <p className="text-[9px] text-yellow-300 font-bold text-center">{m.sectionTitle}</p>
        {m.grades.map((k) => (
          <div key={k} className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
              <span className="text-[8px] text-white/70">{k}</span>
            </div>
            <span className="text-[7px] text-yellow-400">{m.action}</span>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
};

/* ── SLIDE 7 MOCKUP: Math Game Arena ── */
const GameMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: { grades: ["KELAS 7", "KELAS 8", "KELAS 9"], action: "MAIN" },
    en: { grades: ["GRADE 7", "GRADE 8", "GRADE 9"], action: "PLAY" },
    ja: { grades: ["中学1年",  "中学2年",  "中学3年"],  action: "プレイ" },
  }[language];
  return (
    <MockupFrame title="MATH GAME ARENA" accentColor="text-orange-400">
      <div className="p-3 space-y-2">
        <p className="text-[9px] text-orange-300 font-bold text-center">MATH GAME ARENA</p>
        {m.grades.map((k) => (
          <div key={k} className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-400/40" />
              <span className="text-[8px] text-white/70">{k}</span>
            </div>
            <span className="text-[7px] text-orange-400">{m.action}</span>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
};

/* ── SLIDE 8 MOCKUP: Kalkulator Scientific ── */
const KalkulatorMockup = () => {
  const { language } = useLanguage();
  const frameTitle = { id: "KALKULATOR SCIENTIFIC", en: "SCIENTIFIC CALCULATOR", ja: "関数電卓" }[language];
  return (
  <MockupFrame title={frameTitle} accentColor="text-purple-400">
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
};

/* ── SLIDE 9 MOCKUP: Olimpiade Matematika ── */
const OlimpiadeMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: { frameTitle: "OLIMPIADE MATEMATIKA",  sectionTitle: "OLIMPIADE MATEMATIKA",  action: "BUKA" },
    en: { frameTitle: "MATH OLYMPIAD",          sectionTitle: "MATH OLYMPIAD",          action: "OPEN" },
    ja: { frameTitle: "数学オリンピック",         sectionTitle: "数学オリンピック",         action: "開く" },
  }[language];
  const topics = {
    id: ["Bilangan Bulat","Bilangan Rasional","Bilangan Berpangkat","KPK dan FPB","Himpunan"],
    en: ["Integers","Rational Numbers","Exponents","LCM & GCF","Sets"],
    ja: ["整数","有理数","累乗","最小公倍数・最大公約数","集合"],
  }[language];
  return (
    <MockupFrame title={m.frameTitle} accentColor="text-yellow-400">
      <div className="p-3 space-y-1.5">
        <p className="text-[9px] text-yellow-300 font-bold text-center">{m.sectionTitle}</p>
        {topics.map((t) => (
          <div key={t} className="flex items-center justify-between bg-white/5 border border-yellow-400/20 rounded px-2 py-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 text-yellow-400">🏆</div>
              <span className="text-[7px] text-white/70">{t}</span>
            </div>
            <span className="text-[6px] text-yellow-400">{m.action}</span>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
};

/* ── SLIDE 10 MOCKUP: Kumpulan Rumus ── */
const RumusMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: { frameTitle: "KUMPULAN RUMUS",    sectionTitle: "KUMPULAN RUMUS" },
    en: { frameTitle: "FORMULA COLLECTION", sectionTitle: "FORMULA COLLECTION" },
    ja: { frameTitle: "数式集",              sectionTitle: "数式集" },
  }[language];
  const categories = {
    id: ["Aljabar","Geometri","Statistika","Trigonometri"],
    en: ["Algebra","Geometry","Statistics","Trigonometry"],
    ja: ["代数","図形","統計","三角法"],
  }[language];
  return (
    <MockupFrame title={m.frameTitle} accentColor="text-green-400">
      <div className="p-3 space-y-1.5">
        <p className="text-[9px] text-green-300 font-bold text-center">{m.sectionTitle}</p>
        {categories.map((t) => (
          <div key={t} className="bg-white/5 border border-green-400/20 rounded px-2 py-1.5">
            <p className="text-[8px] text-green-300">{t}</p>
            <p className="text-[6px] text-white/40 mt-0.5">L = π × r²  |  A = ½bh</p>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
};

/* ── SLIDE 11 MOCKUP: Konversi Satuan ── */
const KonversiMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: { frameTitle: "KONVERSI SATUAN", sectionTitle: "KONVERSI SATUAN", units: ["Panjang","Berat","Suhu","Waktu","Luas","Volume"] },
    en: { frameTitle: "UNIT CONVERTER",  sectionTitle: "UNIT CONVERTER",  units: ["Length","Weight","Temperature","Time","Area","Volume"] },
    ja: { frameTitle: "単位変換",          sectionTitle: "単位変換",          units: ["長さ","重さ","温度","時間","面積","体積"] },
  }[language];
  return (
    <MockupFrame title={m.frameTitle} accentColor="text-blue-400">
      <div className="p-3 space-y-2">
        <p className="text-[9px] text-blue-300 font-bold text-center">{m.sectionTitle}</p>
        <div className="grid grid-cols-2 gap-1">
          {m.units.map((t) => (
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
};

/* ── SLIDE 12 MOCKUP: Video Pembelajaran ── */
const VideoMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: { frameTitle: "VIDEO PEMBELAJARAN", sectionTitle: "VIDEO PEMBELAJARAN", grades: ["Kelas 7","Kelas 8","Kelas 9"], subtitle: "Video Materi" },
    en: { frameTitle: "LEARNING VIDEOS",    sectionTitle: "LEARNING VIDEOS",    grades: ["Grade 7","Grade 8","Grade 9"], subtitle: "Learning Materials" },
    ja: { frameTitle: "学習動画",             sectionTitle: "学習動画",             grades: ["中学1年", "中学2年", "中学3年"], subtitle: "学習教材" },
  }[language];
  return (
    <MockupFrame title={m.frameTitle} accentColor="text-pink-400">
      <div className="p-3 space-y-2">
        <p className="text-[9px] text-pink-300 font-bold text-center">{m.sectionTitle}</p>
        {m.grades.map((k) => (
          <div key={k} className="flex items-center gap-2 bg-white/5 border border-pink-400/20 rounded px-2 py-1.5">
            <div className="w-5 h-5 rounded bg-pink-500/30 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-pink-300 border-b-[3px] border-b-transparent ml-0.5" />
            </div>
            <p className="text-[8px] text-white/70">{k} — {m.subtitle}</p>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
};

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

const BankSoalMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: { frameTitle: "BANK SOAL",     topics: ["Bilangan Bulat","Aljabar","Geometri","Perbandingan","Statistika","Himpunan","Persamaan","Fungsi"] },
    en: { frameTitle: "QUESTION BANK", topics: ["Integers","Algebra","Geometry","Ratios","Statistics","Sets","Equations","Functions"] },
    ja: { frameTitle: "問題バンク",      topics: ["整数","代数","図形","比","統計","集合","方程式","関数"] },
  }[language];
  return (
    <MockupFrame title={m.frameTitle} accentColor="text-cyan-400">
      <div className="p-2">
        <p className="text-[9px] text-cyan-300 font-bold text-center mb-2">{m.frameTitle}</p>
        <div className="grid grid-cols-2 gap-1">
          {m.topics.map((t) => (
            <div key={t} className="bg-white/5 border border-cyan-400/20 rounded p-1 text-center">
              <div className="w-3 h-3 rounded-sm bg-cyan-400/30 mx-auto mb-0.5" />
              <p className="text-[5.5px] text-white/60">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
};

const ChatMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: {
      greeting: "Halo Sobat Numatik! 🚀 Ada yang bisa aku bantu?",
      userQ: "Bagaimana cara menghitung luas lingkaran?",
      aiReply: "L = π × r² dimana r adalah jari-jari lingkaran...",
      placeholder: "Ketik pertanyaan...",
    },
    en: {
      greeting: "Hello! 🚀 How can I help you?",
      userQ: "How do you calculate the area of a circle?",
      aiReply: "A = π × r² where r is the radius of the circle...",
      placeholder: "Type your question...",
    },
    ja: {
      greeting: "こんにちは！🚀 何かお手伝いできますか？",
      userQ: "円の面積はどうやって計算しますか？",
      aiReply: "A = π × r²（rは円の半径）...",
      placeholder: "質問を入力...",
    },
  }[language];
  return (
    <MockupFrame title="NUMATIK AI" accentColor="text-purple-400">
      <div className="p-2 flex flex-col h-full">
        <p className="text-[8px] text-purple-300 font-bold text-center mb-1.5">NUMATIK AI 🤖</p>
        <div className="flex-1 space-y-1 overflow-hidden">
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-full bg-purple-500/50 shrink-0 mt-0.5" />
            <div className="bg-purple-900/40 border border-purple-500/20 rounded px-1.5 py-1 max-w-[80%]">
              <p className="text-[6px] text-white/70">{m.greeting}</p>
            </div>
          </div>
          <div className="flex gap-1 justify-end">
            <div className="bg-blue-900/40 border border-blue-500/20 rounded px-1.5 py-1 max-w-[80%]">
              <p className="text-[6px] text-white/70">{m.userQ}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-full bg-purple-500/50 shrink-0 mt-0.5" />
            <div className="bg-purple-900/40 border border-purple-500/20 rounded px-1.5 py-1 max-w-[80%]">
              <p className="text-[6px] text-white/70">{m.aiReply}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1 mt-1">
          <div className="flex-1 bg-white/10 rounded px-1.5 py-1">
            <p className="text-[6px] text-white/30">{m.placeholder}</p>
          </div>
          <div className="w-5 h-5 rounded bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
            <div className="w-2 h-2 text-white text-[8px]">→</div>
          </div>
        </div>
      </div>
    </MockupFrame>
  );
};

const TKAMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: {
      sectionTitle: "TES KEMAMPUAN AKADEMIK",
      questionNo: "Soal No. 1 dari 20",
      question: "Jika x² + 5x + 6 = 0, maka nilai x adalah...",
      optA: "A. x = -2 dan x = -3",
      optB: "B. x = 2 dan x = 3",
      answered: "12/20 dijawab",
    },
    en: {
      sectionTitle: "ACADEMIC ABILITY TEST",
      questionNo: "Question No. 1 of 20",
      question: "If x² + 5x + 6 = 0, then the values of x are...",
      optA: "A. x = -2 and x = -3",
      optB: "B. x = 2 and x = 3",
      answered: "12/20 answered",
    },
    ja: {
      sectionTitle: "学力テスト（TKA）",
      questionNo: "問題 1 / 20",
      question: "x² + 5x + 6 = 0 のとき、xの値は...",
      optA: "A. x = -2 と x = -3",
      optB: "B. x = 2 と x = 3",
      answered: "12/20 回答済み",
    },
  }[language];
  return (
    <MockupFrame title="TES KEMAMPUAN AKADEMIK" accentColor="text-indigo-400">
      <div className="p-3 space-y-2">
        <p className="text-[8px] text-indigo-300 font-bold text-center">{m.sectionTitle}</p>
        <div className="bg-white/5 rounded px-2 py-2 border border-indigo-400/20">
          <p className="text-[7px] text-white/70 mb-1.5">{m.questionNo}</p>
          <p className="text-[6px] text-white/60">{m.question}</p>
          {[m.optA, m.optB].map((o) => (
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
            <p className="text-[6px] text-indigo-300">{m.answered}</p>
          </div>
        </div>
      </div>
    </MockupFrame>
  );
};

const PengaturanMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: {
      sectionTitle: "⚙️ PENGATURAN",
      items: [
        ["Mode Tampilan", "🌙 Gelap / ☀️ Terang"],
        ["Suara Latar", "ON / OFF"],
        ["Efek Suara", "ON / OFF"],
      ] as [string, string][],
    },
    en: {
      sectionTitle: "⚙️ SETTINGS",
      items: [
        ["Display Mode", "🌙 Dark / ☀️ Light"],
        ["Background Music", "ON / OFF"],
        ["Sound Effects", "ON / OFF"],
      ] as [string, string][],
    },
    ja: {
      sectionTitle: "⚙️ 設定",
      items: [
        ["表示モード", "🌙 ダーク / ☀️ ライト"],
        ["BGM", "ON / OFF"],
        ["効果音", "ON / OFF"],
      ] as [string, string][],
    },
  }[language];
  return (
    <MockupFrame title="PENGATURAN" accentColor="text-gray-400">
      <div className="p-3 space-y-2">
        <p className="text-[9px] text-gray-300 font-bold text-center">{m.sectionTitle}</p>
        <div className="space-y-1.5">
          {m.items.map(([label, val]) => (
            <div key={label} className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1.5">
              <span className="text-[7px] text-white/60">{label}</span>
              <span className="text-[7px] text-cyan-400">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
};

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

/* ── SLIDE 6 MOCKUP: LKPD ── */
const LKPDMockup = () => {
  const { language } = useLanguage();
  const m = {
    id: { sectionTitle: "📋 LEMBAR KERJA PESERTA DIDIK", grades: ["KELAS 7", "KELAS 8", "KELAS 9"], subtitle: "LKPD matematika SMP",        action: "BUKA" },
    en: { sectionTitle: "📋 STUDENT WORKSHEETS",          grades: ["GRADE 7", "GRADE 8", "GRADE 9"], subtitle: "Junior high math worksheet",   action: "OPEN" },
    ja: { sectionTitle: "📋 学習ワークシート",              grades: ["中学1年",  "中学2年",  "中学3年"],  subtitle: "中学数学ワークシート",           action: "開く" },
  }[language];
  return (
    <MockupFrame title="LKPD" accentColor="text-cyan-400">
      <div className="p-3 space-y-2">
        <p className="text-[8px] text-cyan-300 font-bold text-center">{m.sectionTitle}</p>
        {m.grades.map((k) => (
          <div key={k} className="flex items-center gap-2 bg-white/5 border border-cyan-400/20 rounded px-2 py-1.5">
            <div className="w-4 h-4 rounded bg-cyan-500/30 flex items-center justify-center text-[8px]">🎓</div>
            <div className="flex-1">
              <p className="text-[8px] text-white/80 font-semibold">{k}</p>
              <p className="text-[5.5px] text-white/40">{m.subtitle}</p>
            </div>
            <span className="text-[6px] text-cyan-400 font-bold">{m.action}</span>
          </div>
        ))}
      </div>
    </MockupFrame>
  );
};

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
        "Grade 7: Integers, Fractions, Algebra, Linear Equations and Inequalities in One Variable, Ratios and Proportions, Social Arithmetic, Lines and Angles, Triangles and Quadrilaterals, Sets (Enrichment)",
        "Grade 8: Number Patterns, Cartesian Coordinates, Relations and Functions, System of Linear Equations in Two Variables, Linear Equations (Graphs), Pythagorean Theorem, Circles, Tangent Lines to a Circle (Enrichment), Flat-Sided 3D Shapes",
        "Grade 9: Exponents and Radicals, Similarity and Congruence, Geometric Transformations, Curved-Sided 3D Shapes, Statistics, Probability, Quadratic Equations (Enrichment), Quadratic Functions (Enrichment)",
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
        "中学1年: 整数, 分数, 代数, 一次方程式と一次不等式, 比と割合, 生活算数, 直線と角度, 三角形と四角形, 集合（発展）",
        "中学2年: 数列, 座標平面, 関係と関数, 二元一次連立方程式, 一次関数, ピタゴラスの定理, 円, 円の接線（発展）, 平面で囲まれた立体",
        "中学3年: 累乗と根, 相似と合同, 図形の変換, 曲面を含む立体, 統計, 確率, 二次方程式（発展）, 二次関数（発展）",
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
       SLIDES 5-8 — Trilingual ✅  |  SLIDES 9-12 — Trilingual ✅  |  SLIDES 13-17 — Trilingual ✅
    ══════════════════════════════════════════════════════════ */

    /* ── 5: Latihan Mandiri (id 4) ── */
    (() => {
      const s5 = {
        id: {
          title: "Tugas - Latihan Mandiri",
          desc: "Latihan soal per topik untuk menguji pemahaman kamu. Tersedia soal latihan untuk setiap bab dengan langsung diberikan jawaban dan pembahasannya.",
          steps: [
            "Pilih 'TUGAS - LATIHAN MANDIRI' dari Menu Utama",
            "Pilih kelas (7, 8, atau 9) yang sesuai",
            "Pilih topik/bab yang ingin dilatih",
            "Kerjakan soal dan periksa jawabanmu",
          ],
          submenus: ["Kelas 7 — soal latihan tiap bab", "Kelas 8 — soal latihan tiap bab", "Kelas 9 — soal latihan tiap bab"],
        },
        en: {
          title: "Practice Tasks — Independent Exercises",
          desc: "Topic-by-topic practice questions to test your understanding. Practice problems are available for every chapter, with answers and explanations provided immediately.",
          steps: [
            "Select 'PRACTICE TASKS' from the Main Menu",
            "Choose the appropriate grade (7, 8, or 9)",
            "Select the topic or chapter you want to practice",
            "Work through the problems and check your answers",
          ],
          submenus: ["Grade 7 — practice problems for each chapter", "Grade 8 — practice problems for each chapter", "Grade 9 — practice problems for each chapter"],
        },
        ja: {
          title: "練習課題 — 自主演習",
          desc: "理解度をテストするためのトピック別練習問題。各章の練習問題に解答と解説がすぐに確認できます。",
          steps: [
            "メインメニューから「練習課題」を選択",
            "学年（中学1・2・3年）を選択",
            "練習したいトピックまたは章を選択",
            "問題を解いて答えを確認しよう",
          ],
          submenus: ["中学1年 — 各章の練習問題", "中学2年 — 各章の練習問題", "中学3年 — 各章の練習問題"],
        },
      }[language];
      return {
        id: 4,
        title: s5.title,
        icon: <ClipboardList className="w-8 h-8" />,
        color: "text-yellow-400",
        bgGradient: "from-yellow-900/20 to-amber-900/20",
        description: s5.desc,
        steps: s5.steps,
        submenus: s5.submenus,
        mockup: <LatihanMockup />,
      };
    })(),

    /* ── 6: LKPD (id 18) ── */
    (() => {
      const s6 = {
        id: {
          title: "LKPD (Lembar Kerja Peserta Didik)",
          desc: "Lembar Kerja Peserta Didik (LKPD) interaktif yang dirancang untuk membantu siswa memahami konsep matematika melalui aktivitas belajar terstruktur. Setiap LKPD dilengkapi dengan kegiatan eksplorasi, latihan soal, serta refleksi pembelajaran.",
          steps: [
            "Pilih 'LKPD' dari Menu Utama",
            "Pilih kelas (7, 8, atau 9) sesuai dengan jenjangmu",
            "Pilih topik/materi LKPD yang ingin dikerjakan",
            "Ikuti petunjuk dan kerjakan setiap aktivitas dengan seksama",
            "Refleksikan hasil pembelajaran di bagian akhir LKPD",
          ],
          submenus: ["LKPD Kelas 7 — sesuai materi kelas 7 SMP", "LKPD Kelas 8 — sesuai materi kelas 8 SMP", "LKPD Kelas 9 — sesuai materi kelas 9 SMP"],
        },
        en: {
          title: "LKPD (Student Worksheets)",
          desc: "Interactive Student Worksheets (LKPD) designed to help students understand math concepts through structured learning activities. Each LKPD includes exploration activities, practice problems, and learning reflection.",
          steps: [
            "Select 'LKPD' from the Main Menu",
            "Choose your grade (7, 8, or 9)",
            "Select the LKPD topic or material you want to work on",
            "Follow the instructions and complete each activity carefully",
            "Reflect on your learning in the final section of the LKPD",
          ],
          submenus: ["LKPD Grade 7 — for Grade 7 junior high materials", "LKPD Grade 8 — for Grade 8 junior high materials", "LKPD Grade 9 — for Grade 9 junior high materials"],
        },
        ja: {
          title: "LKPD（学習ワークシート）",
          desc: "構造化された学習活動を通じて数学の概念を理解するためのインタラクティブな学習ワークシート（LKPD）。各LKPDには探究活動、練習問題、学習の振り返りが含まれています。",
          steps: [
            "メインメニューから「LKPD」を選択",
            "学年（中学1・2・3年）を選択",
            "取り組みたいLKPDのトピックまたは教材を選択",
            "指示に従い、各アクティビティを丁寧に進める",
            "LKPDの最後のセクションで学習を振り返ろう",
          ],
          submenus: ["LKPD 中学1年 — 中学1年の教材に対応", "LKPD 中学2年 — 中学2年の教材に対応", "LKPD 中学3年 — 中学3年の教材に対応"],
        },
      }[language];
      return {
        id: 18,
        title: s6.title,
        icon: <ClipboardCheck className="w-8 h-8" />,
        color: "text-cyan-400",
        bgGradient: "from-cyan-900/30 to-teal-900/30",
        description: s6.desc,
        steps: s6.steps,
        submenus: s6.submenus,
        mockup: <LKPDMockup />,
      };
    })(),

    /* ── 7: Math Game Arena (id 5) ── */
    (() => {
      const s7 = {
        id: {
          title: "Math Game Arena",
          desc: "Belajar matematika sambil bermain! Math Game Arena menghadirkan game interaktif bertema matematika yang seru dan menantang untuk setiap jenjang kelas.",
          steps: [
            "Pilih 'MATH GAME ARENA' dari Menu Utama",
            "Pilih kelas yang sesuai (7, 8, atau 9)",
            "Pilih jenis game yang ingin dimainkan",
            "Kerjakan soal matematika dalam format game yang menyenangkan dengan cara menekan meteor pada jawaban yang benar maka pesawat otomatis akan menembak dan keluar notif benar, namun jika menekan meteor dengan jawaban yang salah maka akan keluar notif salah",
          ],
          submenus: ["Kelas 7 - Game Materi Kelas 7", "Kelas 8 - Game Materi Kelas 8", "Kelas 9 - Game Materi Kelas 9"],
        },
        en: {
          title: "Math Game Arena",
          desc: "Learn math while playing! Math Game Arena offers fun and challenging interactive math-themed games for every grade level.",
          steps: [
            "Select 'MATH GAME ARENA' from the Main Menu",
            "Choose the appropriate grade (7, 8, or 9)",
            "Select the game you want to play",
            "Solve math problems in a fun game format — tap the meteor with the correct answer and the spaceship fires automatically; tapping a wrong answer shows an incorrect notification",
          ],
          submenus: ["Grade 7 — Grade 7 Math Games", "Grade 8 — Grade 8 Math Games", "Grade 9 — Grade 9 Math Games"],
        },
        ja: {
          title: "Math Game Arena",
          desc: "遊びながら数学を学ぼう！Math Game Arenaは、各学年向けの楽しくて挑戦的なインタラクティブ数学ゲームを提供します。",
          steps: [
            "メインメニューから「MATH GAME ARENA」を選択",
            "学年（中学1・2・3年）を選択",
            "遊びたいゲームを選択",
            "ゲーム形式で数学の問題を解こう — 正しい答えの隕石をタップすると宇宙船が自動発射し正解通知が表示される。誤った答えをタップすると不正解通知が表示されます",
          ],
          submenus: ["中学1年 — 中学1年の数学ゲーム", "中学2年 — 中学2年の数学ゲーム", "中学3年 — 中学3年の数学ゲーム"],
        },
      }[language];
      return {
        id: 5,
        title: s7.title,
        icon: <Gamepad2 className="w-8 h-8" />,
        color: "text-orange-400",
        bgGradient: "from-orange-900/20 to-red-900/20",
        description: s7.desc,
        steps: s7.steps,
        submenus: s7.submenus,
        mockup: <GameMockup />,
      };
    })(),

    /* ── 8: Kalkulator Scientific (id 6) ── */
    (() => {
      const s8 = {
        id: {
          title: "Kalkulator Scientific",
          desc: "Kalkulator ilmiah lengkap dengan fungsi trigonometri, logaritma, akar, pangkat, dan banyak lagi. Cocok untuk membantu mengerjakan soal matematika yang kompleks.",
          steps: [
            "Pilih 'KALKULATOR SCIENTIFIC' dari Menu Utama",
            "Ketik angka menggunakan tombol angka di layar",
            "Pilih fungsi matematika (sin, cos, tan, log, dll)",
            "Tekan '=' untuk mendapatkan hasil perhitungan",
            "Gunakan tombol 'AC' untuk menghapus semua / 'DEL' untuk hapus satu digit",
          ],
          submenus: ["Mode NORM — perhitungan normal", "Mode MATH — tampilan matematika", "Mode FRAC — perhitungan pecahan", "Mode DEG/RAD — sudut derajat/radian"],
        },
        en: {
          title: "Scientific Calculator",
          desc: "A complete scientific calculator with trigonometric functions, logarithms, square roots, powers, and much more. Perfect for solving complex math problems.",
          steps: [
            "Select 'SCIENTIFIC CALCULATOR' from the Main Menu",
            "Enter numbers using the digit buttons on screen",
            "Select a math function (sin, cos, tan, log, etc.)",
            "Press '=' to get the calculation result",
            "Use 'AC' to clear everything / 'DEL' to delete one digit",
          ],
          submenus: ["Mode NORM — normal calculation", "Mode MATH — math display format", "Mode FRAC — fraction calculation", "Mode DEG/RAD — degrees / radians"],
        },
        ja: {
          title: "関数電卓",
          desc: "三角関数、対数、平方根、べき乗など多彩な機能を備えた完全な関数電卓。複雑な数学の問題を解くのに最適です。",
          steps: [
            "メインメニューから「関数電卓」を選択",
            "画面の数字ボタンで数値を入力",
            "数学関数（sin、cos、tan、logなど）を選択",
            "「=」を押して計算結果を表示",
            "「AC」で全消去 / 「DEL」で1桁削除",
          ],
          submenus: ["Mode NORM — 通常計算", "Mode MATH — 数式表示", "Mode FRAC — 分数計算", "Mode DEG/RAD — 度／ラジアン"],
        },
      }[language];
      return {
        id: 6,
        title: s8.title,
        icon: <Calculator className="w-8 h-8" />,
        color: "text-purple-400",
        bgGradient: "from-purple-900/20 to-violet-900/20",
        description: s8.desc,
        steps: s8.steps,
        submenus: s8.submenus,
        mockup: <KalkulatorMockup />,
      };
    })(),
    /* ── 9: Olimpiade Matematika (id 7) ── */
    (() => {
      const s9 = {
        id: {
          title: "Olimpiade Matematika",
          desc: "Soal-soal olimpiade matematika tingkat SMP untuk kamu yang suka tantangan! Berisi soal-soal tingkat kesulitan tinggi dari berbagai topik matematika.",
          steps: [
            "Pilih 'OLIMPIADE MATEMATIKA' dari Menu Utama",
            "Pilih topik olimpiade yang ingin dicoba",
            "Kerjakan soal dengan seksama — tingkat kesulitannya lebih tinggi",
            "Pelajari pembahasannya untuk meningkatkan kemampuan",
          ],
          /* Math topic names kept as-is; only the trailing descriptor is translated */
          submenus: ["Bilangan Bulat & Rasional", "Bilangan Berpangkat & Irasional", "KPK, FPB & Modulo", "Himpunan & Relasi Fungsi", "Dan masih banyak topik lainnya"],
        },
        en: {
          title: "Mathematics Olympiad",
          desc: "Junior high level math olympiad problems for those who love a challenge! Contains high-difficulty problems from various math topics.",
          steps: [
            "Select 'MATHEMATICS OLYMPIAD' from the Main Menu",
            "Select the olympiad topic you want to try",
            "Work through the problems carefully — the difficulty level is higher",
            "Study the solutions to improve your skills",
          ],
          submenus: ["Integers & Rationals", "Exponents & Irrationals", "LCM, GCF & Modulo", "Sets & Relations/Functions", "And many more topics"],
        },
        ja: {
          title: "数学オリンピック",
          desc: "挑戦が好きな人向けの中学数学オリンピックの問題！様々な数学トピックから高難度の問題を収録しています。",
          steps: [
            "メインメニューから「数学オリンピック」を選択",
            "挑戦したいトピックを選択",
            "問題を丁寧に解こう — 難易度は高め",
            "解説を読んで実力アップを図ろう",
          ],
          submenus: ["整数と有理数", "累乗と無理数", "最小公倍数・最大公約数・モジュロ", "集合と関係・関数", "その他多数のトピック"],
        },
      }[language];
      return {
        id: 7,
        title: s9.title,
        icon: <Trophy className="w-8 h-8" />,
        color: "text-yellow-400",
        bgGradient: "from-yellow-900/20 to-orange-900/20",
        description: s9.desc,
        steps: s9.steps,
        submenus: s9.submenus,
        mockup: <OlimpiadeMockup />,
      };
    })(),

    /* ── 10: Kumpulan Rumus (id 8) ── */
    (() => {
      const s10 = {
        id: {
          title: "Kumpulan Rumus",
          desc: "Kumpulan rumus matematika SMP yang lengkap dan terorganisir. Bisa digunakan sebagai referensi cepat saat belajar atau mengerjakan soal.",
          steps: [
            "Pilih 'KUMPULAN RUMUS' dari Menu Utama",
            "Cari kategori rumus yang dibutuhkan",
            "Baca dan pelajari rumus beserta keterangannya",
            "Gunakan sebagai referensi saat mengerjakan latihan soal",
          ],
          submenus: ["Seluruh Materi Kelas 7, Kelas 8, Kelas 9"],
        },
        en: {
          title: "Formula Collection",
          desc: "A complete and organized collection of junior high math formulas. Can be used as a quick reference while studying or solving problems.",
          steps: [
            "Select 'FORMULA COLLECTION' from the Main Menu",
            "Find the formula category you need",
            "Read and study the formulas with their explanations",
            "Use as a reference when working on practice problems",
          ],
          submenus: ["All Materials for Grade 7, Grade 8, Grade 9"],
        },
        ja: {
          title: "数式集",
          desc: "中学数学の公式を網羅した整理されたコレクション。学習中や問題を解く際のクイックリファレンスとして活用できます。",
          steps: [
            "メインメニューから「数式集」を選択",
            "必要な公式のカテゴリを探す",
            "公式と解説をよく読んで学ぼう",
            "練習問題を解く際の参考に活用しよう",
          ],
          submenus: ["中学1・2・3年の全教材"],
        },
      }[language];
      return {
        id: 8,
        title: s10.title,
        icon: <BookMarked className="w-8 h-8" />,
        color: "text-green-400",
        bgGradient: "from-green-900/20 to-emerald-900/20",
        description: s10.desc,
        steps: s10.steps,
        submenus: s10.submenus,
        mockup: <RumusMockup />,
      };
    })(),

    /* ── 11: Konversi Satuan (id 9) ── */
    (() => {
      const s11 = {
        id: {
          title: "Konversi Satuan",
          desc: "Alat konversi satuan yang lengkap untuk mengubah berbagai macam satuan pengukuran secara cepat dan akurat.",
          steps: [
            "Pilih 'KONVERSI SATUAN' dari Menu Utama",
            "Pilih jenis satuan (Panjang, Berat, Suhu, Waktu, dll)",
            "Masukkan nilai yang ingin dikonversi",
            "Pilih satuan asal dan satuan tujuan",
            "Hasil konversi ditampilkan secara otomatis",
          ],
          submenus: ["Panjang (km, m, cm, mm, inci, kaki)", "Berat (kg, gram, ons, pound)", "Suhu (Celsius, Fahrenheit, Kelvin)", "Waktu (jam, menit, detik)", "Luas & Volume"],
        },
        en: {
          title: "Unit Converter",
          desc: "A complete unit conversion tool for quickly and accurately converting various units of measurement.",
          steps: [
            "Select 'UNIT CONVERTER' from the Main Menu",
            "Choose the unit type (Length, Weight, Temperature, Time, etc.)",
            "Enter the value you want to convert",
            "Select the source and target unit",
            "The conversion result is displayed automatically",
          ],
          submenus: ["Length (km, m, cm, mm, inch, feet)", "Weight (kg, gram, ounce, pound)", "Temperature (Celsius, Fahrenheit, Kelvin)", "Time (hours, minutes, seconds)", "Area & Volume"],
        },
        ja: {
          title: "単位変換",
          desc: "様々な計量単位を素早く正確に変換するための完全な単位変換ツール。",
          steps: [
            "メインメニューから「単位変換」を選択",
            "単位の種類を選択（長さ、重さ、温度、時間など）",
            "変換したい値を入力",
            "変換元と変換先の単位を選択",
            "変換結果が自動的に表示されます",
          ],
          submenus: ["長さ（km、m、cm、mm、インチ、フィート）", "重さ（kg、グラム、オンス、ポンド）", "温度（摂氏、華氏、ケルビン）", "時間（時、分、秒）", "面積・体積"],
        },
      }[language];
      return {
        id: 9,
        title: s11.title,
        icon: <ArrowLeftRight className="w-8 h-8" />,
        color: "text-blue-400",
        bgGradient: "from-blue-900/20 to-indigo-900/20",
        description: s11.desc,
        steps: s11.steps,
        submenus: s11.submenus,
        mockup: <KonversiMockup />,
      };
    })(),

    /* ── 12: Video Pembelajaran (id 10) ── */
    (() => {
      const s12 = {
        id: {
          title: "Video Pembelajaran",
          desc: "Belajar melalui video pembelajaran yang interaktif dan mudah dipahami. Video diorganisir berdasarkan kelas dan topik materi.",
          steps: [
            "Pilih 'VIDEO PEMBELAJARAN' dari Menu Utama",
            "Pilih kelas yang sesuai (7, 8, atau 9)",
            "Pilih topik video yang ingin ditonton",
            "Tonton video pembelajaran dengan seksama",
            "Pause atau putar ulang jika ada bagian yang belum dipahami",
          ],
          submenus: ["Kelas 7 : Seluruh Materi Kelas 7", "Kelas 8 : Seluruh Materi Kelas 8", "Kelas 9 : Seluruh Materi Kelas 9"],
        },
        en: {
          title: "Learning Videos",
          desc: "Learn through interactive and easy-to-understand educational videos. Videos are organized by grade and topic.",
          steps: [
            "Select 'LEARNING VIDEOS' from the Main Menu",
            "Choose the appropriate grade (7, 8, or 9)",
            "Select the video topic you want to watch",
            "Watch the educational video carefully",
            "Pause or replay if there are parts you haven't understood",
          ],
          submenus: ["Grade 7 : All Grade 7 Materials", "Grade 8 : All Grade 8 Materials", "Grade 9 : All Grade 9 Materials"],
        },
        ja: {
          title: "学習動画",
          desc: "わかりやすいインタラクティブな教育動画で学ぼう。動画は学年と教科別に整理されています。",
          steps: [
            "メインメニューから「学習動画」を選択",
            "学年（中学1・2・3年）を選択",
            "見たい動画のトピックを選択",
            "教育動画を注意深く視聴しよう",
            "わからない部分は一時停止または巻き戻して確認しよう",
          ],
          submenus: ["中学1年：中学1年の全教材", "中学2年：中学2年の全教材", "中学3年：中学3年の全教材"],
        },
      }[language];
      return {
        id: 10,
        title: s12.title,
        icon: <PlayCircle className="w-8 h-8" />,
        color: "text-pink-400",
        bgGradient: "from-pink-900/20 to-rose-900/20",
        description: s12.desc,
        steps: s12.steps,
        submenus: s12.submenus,
        mockup: <VideoMockup />,
      };
    })(),
    /* ── 13: Bank Soal (id 12) ── */
    (() => {
      const s13 = {
        id: {
          title: "Bank Soal",
          desc: "Koleksi lengkap soal-soal matematika SMP dari berbagai topik. Cocok untuk latihan intensif dan persiapan ujian.",
          steps: [
            "Pilih 'BANK SOAL' dari Menu Utama",
            "Pilih topik soal yang ingin dikerjakan",
            "Kerjakan soal-soal yang tersedia",
            "Periksa jawabanmu dan pelajari pembahasannya",
          ],
          submenus: ["Seluruh Materi Kelas 7, 8 dan 9"],
        },
        en: {
          title: "Question Bank",
          desc: "A complete collection of junior high math problems from various topics. Perfect for intensive practice and exam preparation.",
          steps: [
            "Select 'QUESTION BANK' from the Main Menu",
            "Select the topic you want to practice",
            "Work through the available problems",
            "Check your answers and study the solutions",
          ],
          submenus: ["All Materials for Grade 7, 8, and 9"],
        },
        ja: {
          title: "問題バンク",
          desc: "様々なトピックの中学数学問題を網羅したコレクション。集中的な練習と試験準備に最適です。",
          steps: [
            "メインメニューから「問題バンク」を選択",
            "練習したいトピックを選択",
            "問題を解こう",
            "答えを確認し解説を学ぼう",
          ],
          submenus: ["中学1・2・3年の全教材"],
        },
      }[language];
      return {
        id: 12,
        title: s13.title,
        icon: <FileText className="w-8 h-8" />,
        color: "text-cyan-400",
        bgGradient: "from-cyan-900/20 to-blue-900/20",
        description: s13.desc,
        steps: s13.steps,
        submenus: s13.submenus,
        mockup: <BankSoalMockup />,
      };
    })(),

    /* ── 14: Chat dengan NUMATIK AI (id 13) ── */
    (() => {
      const s14 = {
        id: {
          title: "Chat dengan NUMATIK AI",
          desc: "NUMATIK AI adalah asisten matematika cerdas berbasis kecerdasan buatan (AI). Tanyakan soal matematika apapun dan dapatkan penjelasan langkah demi langkah!",
          steps: [
            "Pilih 'NUMATIK ARTIFICIAL INTELLIGENCE (AI)' dari Menu Utama",
            "Ketik pertanyaan matematikamu di kolom chat",
            "Klik tombol kirim atau tekan Enter",
            "NUMATIK AI akan menjawab dengan penjelasan detail step-by-step",
            "Klik pertanyaan contoh untuk memulai percakapan dengan cepat",
          ],
          submenus: ["Bisa menjelaskan konsep matematika", "Bisa membantu mengerjakan soal", "Bisa memberikan contoh-contoh tambahan", "Mendukung format rumus matematika (LaTeX)"],
        },
        en: {
          title: "Chat with NUMATIK AI",
          desc: "NUMATIK AI is an intelligent math assistant powered by artificial intelligence. Ask any math question and get step-by-step explanations!",
          steps: [
            "Select 'NUMATIK ARTIFICIAL INTELLIGENCE (AI)' from the Main Menu",
            "Type your math question in the chat field",
            "Click the send button or press Enter",
            "NUMATIK AI will answer with detailed step-by-step explanations",
            "Click example questions to start a conversation quickly",
          ],
          submenus: ["Can explain math concepts", "Can help solve problems", "Can provide additional examples", "Supports mathematical formula format (LaTeX)"],
        },
        ja: {
          title: "NUMATIK AIとチャット",
          desc: "NUMATIK AIは人工知能（AI）を活用したスマートな数学アシスタント。どんな数学の質問でも、ステップごとの解説で答えてくれます！",
          steps: [
            "メインメニューから「NUMATIK ARTIFICIAL INTELLIGENCE (AI)」を選択",
            "チャット欄に数学の質問を入力",
            "送信ボタンをクリックまたはEnterを押す",
            "NUMATIK AIが詳しいステップごとの解説で回答",
            "例文の質問をクリックして素早く会話を始めよう",
          ],
          submenus: ["数学の概念を説明できる", "問題解決をサポートできる", "追加の例を提供できる", "数学式フォーマット（LaTeX）に対応"],
        },
      }[language];
      return {
        id: 13,
        title: s14.title,
        icon: <MessageCircle className="w-8 h-8" />,
        color: "text-purple-400",
        bgGradient: "from-purple-900/20 to-indigo-900/20",
        description: s14.desc,
        steps: s14.steps,
        submenus: s14.submenus,
        mockup: <ChatMockup />,
      };
    })(),

    /* ── 15: Tes Kemampuan Akademik (id 14) ── */
    (() => {
      const s15 = {
        id: {
          title: "Tes Kemampuan Akademik (TKA)",
          desc: "Uji kemampuan akademik matematikamu dengan soal-soal TKA yang mirip dengan ujian masuk perguruan tinggi. Cocok untuk siswa kelas 9 yang ingin persiapan lebih.",
          steps: [
            "Pilih 'TES KEMAMPUAN AKADEMIK' dari Menu Utama",
            "Baca petunjuk tes dengan seksama sebelum mulai",
            "Ketika jawaban di klik akan muncul apakah jawabanmu benar/salah",
            "Boleh dilihat pembahasannya agar kamu lebih mengerti",
          ],
        },
        en: {
          title: "Academic Ability Test (TKA)",
          desc: "Test your math academic skills with TKA-style questions similar to college entrance exams. Great for Grade 9 students who want extra preparation.",
          steps: [
            "Select 'ACADEMIC ABILITY TEST' from the Main Menu",
            "Read the test instructions carefully before starting",
            "Click an answer to see immediately if it is correct or wrong",
            "Review the solutions to deepen your understanding",
          ],
        },
        ja: {
          title: "学力テスト（TKA）",
          desc: "大学入試に似たTKA形式の問題で数学の学力を試そう。さらなる準備をしたい中学3年生に最適です。",
          steps: [
            "メインメニューから「学力テスト」を選択",
            "始める前にテストの説明をよく読もう",
            "答えをクリックすると正誤がすぐわかる",
            "解説を読んでより深く理解しよう",
          ],
        },
      }[language];
      return {
        id: 14,
        title: s15.title,
        icon: <Brain className="w-8 h-8" />,
        color: "text-indigo-400",
        bgGradient: "from-indigo-900/20 to-violet-900/20",
        description: s15.desc,
        steps: s15.steps,
        mockup: <TKAMockup />,
      };
    })(),

    /* ── 16: Pengaturan (id 15) ── */
    (() => {
      const s16 = {
        id: {
          title: "Pengaturan",
          desc: "Sesuaikan tampilan dan pengalaman menggunakan aplikasi NUMATIK sesuai preferensimu.",
          steps: [
            "Pilih 'PENGATURAN' dari Menu Utama",
            "Aktifkan Mode Gelap/Terang sesuai selera",
            "Atur suara latar (ambient music) ON/OFF",
            "Atur efek suara (tombol pop) ON/OFF",
          ],
          submenus: [
            "Mode Gelap — background galaxy biru gelap",
            "Mode Terang — background salju putih bersih",
            "Suara Latar — musik galaksi ambient",
            "Efek Suara — suara klik tombol",
          ],
        },
        en: {
          title: "Settings",
          desc: "Customize the appearance and experience of using the NUMATIK app to your preference.",
          steps: [
            "Select 'SETTINGS' from the Main Menu",
            "Enable Dark/Light Mode to your preference",
            "Toggle background music (ambient) ON/OFF",
            "Toggle sound effects (button pop) ON/OFF",
          ],
          submenus: [
            "Dark Mode — dark galaxy blue background",
            "Light Mode — clean white snow background",
            "Background Music — galaxy ambient music",
            "Sound Effects — button click sound",
          ],
        },
        ja: {
          title: "設定",
          desc: "NUMATIKアプリの外観と使用体験を好みに合わせてカスタマイズしよう。",
          steps: [
            "メインメニューから「設定」を選択",
            "ダーク/ライトモードを好みに合わせて切り替える",
            "BGM（アンビエントミュージック）をON/OFFに設定",
            "効果音（ボタンポップ）をON/OFFに設定",
          ],
          submenus: [
            "ダークモード — 深い宇宙ブルーの背景",
            "ライトモード — 清潔な白い雪の背景",
            "BGM — 銀河アンビエントミュージック",
            "効果音 — ボタンクリック音",
          ],
        },
      }[language];
      return {
        id: 15,
        title: s16.title,
        icon: <Settings className="w-8 h-8" />,
        color: "text-gray-400",
        bgGradient: "from-slate-900/30 to-gray-900/30",
        description: s16.desc,
        steps: s16.steps,
        submenus: s16.submenus,
        mockup: <PengaturanMockup />,
      };
    })(),

    /* ── 17: Donasi, Biografi & Referensi (id 16) ── */
    (() => {
      const s17 = {
        id: {
          title: "Donasi, Biografi & Referensi",
          desc: "Informasi pendukung tentang aplikasi NUMATIK, termasuk cara mendukung pengembangan app, profil pembuat, dan daftar pustaka yang digunakan.",
          steps: [
            "Menu DONASI — dukung pengembangan NUMATIK agar terus berkembang",
            "Menu BIOGRAFI — kenali profil dan latar belakang pembuat aplikasi",
            "Menu SUMBER REFERENSI — lihat daftar pustaka yang digunakan",
            "Menu TENTANG APLIKASI — informasi versi dan deskripsi aplikasi",
          ],
          mockupTitle: "INFO APLIKASI",
          items: [
            { icon: "❤️", label: "DONASI",          desc: "Dukung pengembangan", color: "text-red-400" },
            { icon: "👤", label: "BIOGRAFI",         desc: "Profil pembuat",      color: "text-blue-400" },
            { icon: "📚", label: "SUMBER REFERENSI", desc: "Daftar pustaka",      color: "text-green-400" },
            { icon: "ℹ️", label: "TENTANG",          desc: "Info aplikasi",       color: "text-cyan-400" },
          ],
        },
        en: {
          title: "Donation, Biography & References",
          desc: "Supporting information about the NUMATIK app, including how to support its development, the creator's profile, and references used.",
          steps: [
            "DONATION menu — support NUMATIK's development so it keeps growing",
            "BIOGRAPHY menu — learn about the app creator's profile and background",
            "REFERENCE SOURCES menu — see the list of references used",
            "ABOUT APP menu — version information and app description",
          ],
          mockupTitle: "APP INFO",
          items: [
            { icon: "❤️", label: "DONATION",   desc: "Support development", color: "text-red-400" },
            { icon: "👤", label: "BIOGRAPHY",  desc: "Creator's profile",   color: "text-blue-400" },
            { icon: "📚", label: "REFERENCES", desc: "Bibliography",        color: "text-green-400" },
            { icon: "ℹ️", label: "ABOUT",      desc: "App info",            color: "text-cyan-400" },
          ],
        },
        ja: {
          title: "寄付・略歴・参考文献",
          desc: "NUMATIKアプリに関するサポート情報。開発支援の方法、作成者のプロフィール、使用した参考文献などを掲載しています。",
          steps: [
            "寄付メニュー — NUMATIKの開発を支援して成長を続けさせよう",
            "略歴メニュー — アプリ作成者のプロフィールと背景を知ろう",
            "参考文献メニュー — 使用した参考文献リストを見る",
            "アプリについてメニュー — バージョン情報とアプリの説明",
          ],
          mockupTitle: "アプリ情報",
          items: [
            { icon: "❤️", label: "寄付",         desc: "開発を支援",         color: "text-red-400" },
            { icon: "👤", label: "略歴",         desc: "作成者プロフィール",  color: "text-blue-400" },
            { icon: "📚", label: "参考文献",     desc: "参考文献リスト",     color: "text-green-400" },
            { icon: "ℹ️", label: "アプリについて", desc: "アプリ情報",         color: "text-cyan-400" },
          ],
        },
      }[language];
      return {
        id: 16,
        title: s17.title,
        icon: <Heart className="w-8 h-8" />,
        color: "text-red-400",
        bgGradient: "from-red-900/20 to-pink-900/20",
        description: s17.desc,
        steps: s17.steps,
        mockup: (
          <MockupFrame title={s17.mockupTitle} accentColor="text-red-400">
            <div className="p-3 space-y-2">
              {s17.items.map((item) => (
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
      };
    })(),
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
