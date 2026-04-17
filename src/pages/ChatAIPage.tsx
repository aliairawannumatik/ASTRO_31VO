import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Starfield from "@/components/Starfield";
import { Send, User, Rocket, RefreshCw, ChevronLeft } from "lucide-react";
import "katex/dist/katex.min.css";


const QUICK_TOPICS = [
  { label: "Bilangan Pecahan 🍕", prompt: "Tolong jelaskan cara menjumlahkan bilangan pecahan dengan penyebut berbeda!" },
  { label: "Persamaan Linear 📐", prompt: "Bagaimana cara menyelesaikan persamaan linear satu variabel?" },
  { label: "Pythagoras 📏", prompt: "Jelaskan teorema Pythagoras dan contoh soalnya!" },
  { label: "Luas Bangun Datar 📦", prompt: "Apa saja rumus luas bangun datar yang perlu aku hafal?" },
  { label: "Statistika 📊", prompt: "Cara menghitung mean, median, dan modus dari data yang diberikan?" },
  { label: "Perkalian Cepat ⚡", prompt: "Ada trik khusus untuk perkalian bilangan besar yang cepat?" },
];

type Message = {
  role: "user" | "model";
  text: string;
};

const formatText = (text: string) => {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const formatted = line
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: formatted }} />
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
};

const ChatAIPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Halo, Sobat Numatik! 🚀 Aku NUMATIK AI, asisten matematika pintarmu di galaksi ini! ✨\n\nAku siap membantu kamu belajar matematika dengan cara yang seru dan mudah dipahami. Mau tanya apa hari ini? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasUserMessages = messages.some(m => m.role === "user");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", text: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!res.ok) throw new Error(`AI chat error: ${res.status}`);

      const data = await res.json();
      const responseText = data.text ?? "Maaf, tidak ada respons dari server.";

      setMessages((prev) => [...prev, { role: "model", text: responseText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Oops! 😅 Terjadi kesalahan koneksi ke sistem galaksi. Coba lagi ya, Sobat Numatik! 🚀",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{
      role: "model",
      text: "Halo, Sobat Numatik! 🚀 Aku NUMATIK AI, asisten matematika pintarmu di galaksi ini! ✨\n\nAku siap membantu kamu belajar matematika dengan cara yang seru dan mudah dipahami. Mau tanya apa hari ini? 😊",
    }]);
    setInput("");
  };

  return (
    <div className="relative min-h-screen flex flex-col gradient-space overflow-hidden">
      <Starfield />

      {/* ── HEADER ── */}
      <div className="relative z-10 shrink-0">
        {/* Gradient bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-violet-500 via-cyan-400 to-blue-500" />

        <div className="flex items-center gap-3 px-3 py-3 bg-[#080f22]/90 backdrop-blur-md border-b border-white/6">
          {/* Back button */}
          <button
            onClick={() => navigate("/menu")}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Avatar with glow ring */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-md animate-pulse" />
            <div className="relative w-10 h-10 rounded-full border-2 border-cyan-400/60 overflow-hidden shadow-[0_0_16px_rgba(34,211,238,0.4)]">
              <img src="/numatik-ai-avatar.png" alt="NUMATIK AI" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display text-sm font-black text-white leading-none tracking-wide">NUMATIK AI</p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <p className="font-body text-[11px] text-white/40">Robot Astronot Matematikamu 🚀</p>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={resetChat}
            title="Mulai percakapan baru"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-3 py-4 space-y-4">

        {/* Welcome hero — shown until user sends first message */}
        <AnimatePresence>
          {!hasUserMessages && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center pt-4 pb-2 px-2"
            >
              {/* Big glowing avatar */}
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-2xl scale-150" />
                <div className="relative w-20 h-20 rounded-full border-2 border-cyan-400/50 overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.35)]">
                  <img src="/numatik-ai-avatar.png" alt="NUMATIK AI" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Rocket className="w-3 h-3 text-white" />
                </div>
              </div>

              <h2 className="font-display text-xl font-black text-white mb-1">
                Hai, Sobat Numatik! <span className="text-cyan-400">👋</span>
              </h2>
              <p className="font-body text-xs text-white/45 max-w-xs leading-relaxed mb-5">
                Tanya apa saja tentang matematika — aku akan jelasin langkah demi langkah dengan cara yang seru!
              </p>

              {/* Quick topic chips */}
              <div className="w-full max-w-sm">
                <p className="text-[10px] font-display font-bold text-white/30 tracking-widest uppercase mb-2.5">
                  🔥 Topik Populer
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_TOPICS.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => sendMessage(t.prompt)}
                      className="text-left px-3 py-2.5 rounded-xl border border-white/8 bg-white/4 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all duration-200 group"
                    >
                      <span className="font-display text-[11px] font-bold text-white/70 group-hover:text-cyan-300 transition-colors leading-tight block">
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            {msg.role === "model" ? (
              <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)] self-end">
                <img src="/numatik-ai-avatar.png" alt="NUMATIK AI" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border-2 border-violet-400/50 bg-gradient-to-br from-violet-600/40 to-blue-600/30 shadow-[0_0_10px_rgba(139,92,246,0.2)] self-end">
                <User className="w-3.5 h-3.5 text-violet-300" />
              </div>
            )}

            {/* Bubble */}
            <div className={`max-w-[80%] relative ${msg.role === "model" ? "items-start" : "items-end"} flex flex-col gap-1`}>
              {msg.role === "model" && i === 0 && (
                <span className="text-[9px] font-display font-bold text-cyan-400/60 px-1 tracking-wide">NUMATIK AI</span>
              )}
              {msg.role === "user" && (
                <span className="text-[9px] font-display font-bold text-violet-400/60 px-1 tracking-wide text-right">KAMU</span>
              )}
              <div className={`rounded-2xl px-4 py-3 text-sm font-body leading-relaxed shadow-lg ${
                msg.role === "model"
                  ? "bg-[#0d1627]/95 border border-cyan-500/15 text-white/90 rounded-tl-sm shadow-[0_4px_20px_rgba(6,182,212,0.08)]"
                  : "bg-gradient-to-br from-violet-600 to-blue-600 border border-violet-400/30 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(139,92,246,0.25)]"
              }`}>
                <div className="whitespace-pre-wrap break-words">{formatText(msg.text)}</div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Loading indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2.5 flex-row"
            >
              <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)] self-end">
                <img src="/numatik-ai-avatar.png" alt="NUMATIK AI" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#0d1627]/95 border border-cyan-500/15 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2.5 shadow-[0_4px_20px_rgba(6,182,212,0.08)]">
                <Rocket className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                <span className="text-white/40 text-xs font-body">Lagi ngitung...</span>
                <span className="flex gap-1 items-end h-4">
                  {[0, 150, 300].map((delay, j) => (
                    <span
                      key={j}
                      className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── BACK BUTTON FLOATING ── */}
      <button
        onClick={() => navigate("/menu")}
        className="fixed bottom-24 left-4 z-20 w-11 h-11 rounded-2xl flex items-center justify-center bg-[#0d1627]/90 border border-white/10 text-white/50 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-[0_0_16px_rgba(6,182,212,0.25)] backdrop-blur transition-all duration-200 active:scale-95"
        title="Kembali ke Menu"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* ── INPUT AREA ── */}
      <div className="relative z-10 shrink-0 px-3 pb-4 pt-2 bg-[#080f22]/90 backdrop-blur-md border-t border-white/6">

        {/* Rocket tip */}
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Rocket className="w-3 h-3 text-cyan-400/50" />
          <span className="text-white/20 text-[10px] font-body">Tekan Enter kirim • Shift+Enter baris baru</span>
        </div>

        {/* Input box */}
        <div className="relative flex items-end gap-2 bg-[#0d1627] border border-white/8 rounded-2xl px-3 py-2.5 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_0_3px_rgba(6,182,212,0.08)] transition-all duration-200">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya apa saja tentang matematika... 🌟"
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent text-white text-sm font-body placeholder-white/25 resize-none outline-none max-h-28 leading-relaxed py-0.5"
            style={{ scrollbarWidth: "none" }}
          />

          {/* Send button */}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 active:scale-95 ${
              input.trim() && !loading
                ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_16px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-105"
                : "bg-white/5 cursor-not-allowed"
            }`}
          >
            <Send className={`w-4 h-4 ${input.trim() && !loading ? "text-white" : "text-white/20"}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAIPage;
