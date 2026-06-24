import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Send, User, Rocket, RefreshCw, Paperclip, Mic, MicOff, X, FileText, ImageIcon } from "lucide-react";
import "katex/dist/katex.min.css";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

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
  imageUrl?: string;
  fileName?: string;
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
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isSunset = theme === "sunset";

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Halo, Sobat Numatik! 🚀 Aku NUMATIK AI, asisten matematika pintarmu di galaksi ini! ✨\n\nAku siap membantu kamu belajar matematika dengan cara yang seru dan mudah dipahami. Mau tanya apa hari ini? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);

  const [isRecording, setIsRecording] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const hasUserMessages = messages.some(m => m.role === "user");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = file.type.startsWith("image/");
    setIsImage(img);
    setAttachedFile(file);
    if (img) {
      const reader = new FileReader();
      reader.onload = (ev) => setAttachedPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setAttachedPreview(null);
    }
    e.target.value = "";
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setAttachedPreview(null);
    setIsImage(false);
  };

  const toggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser kamu belum mendukung fitur suara. Coba Chrome ya! 🎤");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + " " + transcript : transcript));
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const sendMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if ((!trimmed && !attachedFile) || loading) return;

    let messageText = trimmed;
    let imageUrl: string | undefined;
    let fileName: string | undefined;

    if (attachedFile) {
      if (isImage && attachedPreview) {
        imageUrl = attachedPreview;
        messageText = trimmed || `Tolong analisis gambar ini: ${attachedFile.name}`;
      } else {
        fileName = attachedFile.name;
        messageText = trimmed
          ? `${trimmed}\n[File terlampir: ${attachedFile.name}]`
          : `[File terlampir: ${attachedFile.name}]`;
      }
      removeAttachment();
    }

    if (!messageText) return;

    const userMsg: Message = { role: "user", text: messageText, imageUrl, fileName };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, language }),
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
    removeAttachment();
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
  };

  const canSend = (input.trim() || !!attachedFile) && !loading;

  return (
    <div className={`relative min-h-screen flex flex-col overflow-hidden ${isSunset ? "gradient-sunset" : "gradient-space"}`}>
      <Starfield />
      <PageNavigation prevPath="/menu" />

      {/* ── HEADER ── */}
      <div className="relative z-10 shrink-0">
        <div className={`h-0.5 w-full bg-gradient-to-r ${isSunset ? "from-sky-400 via-yellow-300 to-sky-500" : "from-violet-500 via-cyan-400 to-blue-500"}`} />
        <div className={`flex items-center gap-3 px-3 py-3 backdrop-blur-md border-b ${
          isSunset
            ? "bg-white/70 border-sky-200/60"
            : "bg-[#080f22]/90 border-white/6"
        }`}>
          <button
            onClick={() => navigate("/menu")}
            className={`text-sm transition-colors cursor-pointer font-body shrink-0 ${
              isSunset ? "text-sky-600/70 hover:text-yellow-500" : "text-white/30 hover:text-amber-400"
            }`}
          >
            ← Kembali ke Menu
          </button>

          <div className="relative shrink-0">
            <div className={`absolute inset-0 rounded-full blur-md animate-pulse ${isSunset ? "bg-sky-400/30" : "bg-cyan-400/40"}`} />
            <div className={`relative w-10 h-10 rounded-full border-2 overflow-hidden ${
              isSunset
                ? "border-sky-400/70 shadow-[0_0_16px_rgba(14,165,233,0.4)]"
                : "border-cyan-400/60 shadow-[0_0_16px_rgba(34,211,238,0.4)]"
            }`}>
              <img src="/numatik-ai-avatar.png" alt="NUMATIK AI" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`font-display text-sm font-black leading-none tracking-wide ${isSunset ? "text-sky-800" : "text-white"}`}>
                NUMATIK AI
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <p className={`font-body text-[11px] ${isSunset ? "text-sky-600/70" : "text-white/40"}`}>
                Robot Astronot Matematikamu 🚀
              </p>
            </div>
          </div>

          <button
            onClick={resetChat}
            title="Mulai percakapan baru"
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              isSunset
                ? "text-sky-500/60 hover:text-sky-700 hover:bg-sky-500/10"
                : "text-white/40 hover:text-cyan-300 hover:bg-cyan-500/10"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-3 py-4 space-y-4">

        <AnimatePresence>
          {!hasUserMessages && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center pt-4 pb-2 px-2"
            >
              <div className="relative mb-4">
                <div className={`absolute inset-0 rounded-full blur-2xl scale-150 ${isSunset ? "bg-sky-400/20" : "bg-cyan-400/25"}`} />
                <div className={`relative w-20 h-20 rounded-full border-2 overflow-hidden ${
                  isSunset
                    ? "border-sky-400/60 shadow-[0_0_30px_rgba(14,165,233,0.3)]"
                    : "border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.35)]"
                }`}>
                  <img src="/numatik-ai-avatar.png" alt="NUMATIK AI" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Rocket className="w-3 h-3 text-white" />
                </div>
              </div>

              <h2 className={`font-display text-xl font-black mb-1 ${isSunset ? "text-sky-800" : "text-white"}`}>
                Hai, Sobat Numatik! <span className={isSunset ? "text-yellow-500" : "text-cyan-400"}>👋</span>
              </h2>
              <p className={`font-body text-xs max-w-xs leading-relaxed mb-5 ${isSunset ? "text-sky-700/70" : "text-white/45"}`}>
                Tanya apa saja tentang matematika — aku akan jelasin langkah demi langkah dengan cara yang seru!
              </p>

              <div className="w-full max-w-sm">
                <p className={`text-[10px] font-display font-bold tracking-widest uppercase mb-2.5 ${isSunset ? "text-sky-600/50" : "text-white/30"}`}>
                  🔥 Topik Populer
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_TOPICS.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => sendMessage(t.prompt)}
                      className={`text-left px-3 py-2.5 rounded-xl border transition-all duration-200 group ${
                        isSunset
                          ? "border-sky-300/50 bg-white/50 hover:bg-sky-100/70 hover:border-sky-400/60"
                          : "border-white/8 bg-white/4 hover:bg-cyan-500/10 hover:border-cyan-500/30"
                      }`}
                    >
                      <span className={`font-display text-[11px] font-bold transition-colors leading-tight block ${
                        isSunset
                          ? "text-sky-700 group-hover:text-sky-900"
                          : "text-white/70 group-hover:text-cyan-300"
                      }`}>
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
            {msg.role === "model" ? (
              <div className={`w-8 h-8 rounded-full shrink-0 overflow-hidden border-2 self-end ${
                isSunset
                  ? "border-sky-400/50 shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                  : "border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
              }`}>
                <img src="/numatik-ai-avatar.png" alt="NUMATIK AI" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border-2 border-violet-400/50 bg-gradient-to-br from-violet-600/40 to-blue-600/30 shadow-[0_0_10px_rgba(139,92,246,0.2)] self-end">
                <User className="w-3.5 h-3.5 text-violet-300" />
              </div>
            )}

            <div className={`max-w-[80%] relative ${msg.role === "model" ? "items-start" : "items-end"} flex flex-col gap-1`}>
              {msg.role === "model" && i === 0 && (
                <span className={`text-[9px] font-display font-bold px-1 tracking-wide ${isSunset ? "text-sky-500/70" : "text-cyan-400/60"}`}>
                  NUMATIK AI
                </span>
              )}
              {msg.role === "user" && (
                <span className="text-[9px] font-display font-bold text-violet-400/60 px-1 tracking-wide text-right">KAMU</span>
              )}

              {msg.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-violet-400/30 shadow-lg mb-1">
                  <img src={msg.imageUrl} alt="Lampiran" className="max-w-[200px] max-h-[200px] object-cover" />
                </div>
              )}

              {msg.fileName && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-600/30 border border-violet-400/30 mb-1">
                  <FileText className="w-4 h-4 text-violet-300 shrink-0" />
                  <span className="text-xs font-body text-violet-200 truncate max-w-[150px]">{msg.fileName}</span>
                </div>
              )}

              <div className={`rounded-2xl px-4 py-3 text-sm font-body leading-relaxed shadow-lg ${
                msg.role === "model"
                  ? isSunset
                    ? "bg-white/85 border border-sky-200/60 text-sky-900 rounded-tl-sm shadow-[0_4px_20px_rgba(14,165,233,0.12)]"
                    : "bg-[#0d1627]/95 border border-cyan-500/15 text-white/90 rounded-tl-sm shadow-[0_4px_20px_rgba(6,182,212,0.08)]"
                  : "bg-gradient-to-br from-violet-600 to-blue-600 border border-violet-400/30 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(139,92,246,0.25)]"
              }`}>
                <div className="whitespace-pre-wrap break-words">{formatText(msg.text)}</div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2.5 flex-row"
            >
              <div className={`w-8 h-8 rounded-full shrink-0 overflow-hidden border-2 self-end ${
                isSunset
                  ? "border-sky-400/50 shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                  : "border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
              }`}>
                <img src="/numatik-ai-avatar.png" alt="NUMATIK AI" className="w-full h-full object-cover" />
              </div>
              <div className={`rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2.5 ${
                isSunset
                  ? "bg-white/85 border border-sky-200/60 shadow-[0_4px_20px_rgba(14,165,233,0.12)]"
                  : "bg-[#0d1627]/95 border border-cyan-500/15 shadow-[0_4px_20px_rgba(6,182,212,0.08)]"
              }`}>
                <Rocket className={`w-3.5 h-3.5 animate-pulse shrink-0 ${isSunset ? "text-sky-500" : "text-cyan-400"}`} />
                <span className={`text-xs font-body ${isSunset ? "text-sky-600/60" : "text-white/40"}`}>Lagi ngitung...</span>
                <span className="flex gap-1 items-end h-4">
                  {[0, 150, 300].map((delay, j) => (
                    <span
                      key={j}
                      className={`w-1.5 h-1.5 rounded-full animate-bounce ${isSunset ? "bg-sky-400" : "bg-cyan-400"}`}
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

      {/* ── INPUT AREA ── */}
      <div className={`relative z-10 shrink-0 px-3 pb-4 pt-2 backdrop-blur-md border-t ${
        isSunset
          ? "bg-white/70 border-sky-200/60"
          : "bg-[#080f22]/90 border-white/6"
      }`}>

        {/* Tip */}
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Rocket className={`w-3 h-3 ${isSunset ? "text-sky-400/60" : "text-cyan-400/50"}`} />
          <span className={`text-[10px] font-body ${isSunset ? "text-sky-600/40" : "text-white/20"}`}>
            Tekan Enter kirim • Shift+Enter baris baru
          </span>
        </div>

        {/* Attachment preview chip */}
        <AnimatePresence>
          {attachedFile && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex items-center gap-2 mb-2 px-1"
            >
              <div className="flex items-center gap-2 bg-violet-500/15 border border-violet-500/30 rounded-xl px-3 py-1.5 max-w-xs">
                {isImage && attachedPreview ? (
                  <img src={attachedPreview} alt="preview" className="w-8 h-8 rounded-lg object-cover shrink-0 border border-violet-400/30" />
                ) : (
                  <FileText className="w-4 h-4 text-violet-300 shrink-0" />
                )}
                <span className="text-xs font-body text-violet-200 truncate max-w-[140px]">{attachedFile.name}</span>
                <button
                  onClick={removeAttachment}
                  className="ml-1 w-4 h-4 rounded-full flex items-center justify-center text-violet-400 hover:text-white hover:bg-violet-500/40 transition-all shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input box */}
        <div className={`relative flex items-end gap-2 border rounded-2xl px-2 py-2.5 transition-all duration-200 ${
          isSunset
            ? "bg-white/80 border-sky-200/60 focus-within:border-sky-400/70 focus-within:shadow-[0_0_0_3px_rgba(14,165,233,0.1)]"
            : "bg-[#0d1627] border-white/8 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_0_3px_rgba(6,182,212,0.08)]"
        }`}>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            title="Upload gambar atau file"
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 active:scale-95 ${
              attachedFile
                ? "bg-violet-500/30 text-violet-300 border border-violet-500/40"
                : isSunset
                  ? "text-sky-400/60 hover:text-violet-500 hover:bg-violet-500/10"
                  : "text-white/30 hover:text-violet-300 hover:bg-violet-500/15"
            }`}
          >
            {isImage && attachedFile ? (
              <ImageIcon className="w-4 h-4" />
            ) : (
              <Paperclip className="w-4 h-4" />
            )}
          </button>

          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya apa saja tentang matematika... 🌟"
            rows={1}
            disabled={loading}
            className={`flex-1 bg-transparent text-sm font-body resize-none outline-none max-h-28 leading-relaxed py-0.5 ${
              isSunset
                ? "text-sky-900 placeholder-sky-400/50"
                : "text-white placeholder-white/25"
            }`}
            style={{ scrollbarWidth: "none" }}
          />

          {/* Voice button */}
          <button
            onClick={toggleVoice}
            disabled={loading}
            title={isRecording ? "Hentikan rekaman" : "Kirim pesan dengan suara"}
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 active:scale-95 ${
              isRecording
                ? "bg-red-500/30 text-red-400 border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse"
                : isSunset
                  ? "text-sky-400/60 hover:text-sky-600 hover:bg-sky-500/10"
                  : "text-white/30 hover:text-cyan-300 hover:bg-cyan-500/15"
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send button */}
          <button
            onClick={() => sendMessage()}
            disabled={!canSend}
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 active:scale-95 ${
              canSend
                ? isSunset
                  ? "bg-gradient-to-br from-sky-400 to-blue-500 shadow-[0_0_16px_rgba(14,165,233,0.4)] hover:shadow-[0_0_20px_rgba(14,165,233,0.6)] hover:scale-105"
                  : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_16px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-105"
                : isSunset
                  ? "bg-sky-100/50 cursor-not-allowed"
                  : "bg-white/5 cursor-not-allowed"
            }`}
          >
            <Send className={`w-4 h-4 ${canSend ? "text-white" : isSunset ? "text-sky-300/40" : "text-white/20"}`} />
          </button>
        </div>

        {/* Recording indicator */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 mt-2 px-1"
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-[10px] font-body">Sedang mendengarkan... bicara sekarang!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatAIPage;
