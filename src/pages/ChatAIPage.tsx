import { useState, useRef, useEffect } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import ChatMessage from "@/components/ChatMessage";
import { Bot, Send, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatAIPage = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    playPopSound();
    sendMessage({ text: input });
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    playPopSound();
    setMessages([]);
  };

  // Get text content from message parts
  const getMessageText = (message: typeof messages[0]): string => {
    if (!message.parts || !Array.isArray(message.parts)) return "";
    return message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  };

  return (
    <div className="relative min-h-screen flex flex-col gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      {/* Header */}
      <div className="relative z-10 pt-20 pb-4 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center border-2 border-purple-400/50 shadow-lg shadow-purple-500/30 animate-pulse-glow">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan">
              NUMATIK AI
            </h1>
          </div>
          <p className="text-white/70 text-sm font-body">
            Asisten Matematika Cerdas untuk Sobat Numatik
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative z-10 flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pb-4">
        <div className="flex-1 bg-card/40 backdrop-blur-md border border-border/50 rounded-t-2xl overflow-hidden flex flex-col">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30 mb-6">
                  <Sparkles className="w-10 h-10 text-purple-400" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Halo, Sobat Numatik!
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mb-6">
                  Aku NUMATIK AI, asisten matematika kamu di Math Space. Tanyakan
                  apapun tentang matematika, dan aku akan bantu menjelaskan
                  langkah demi langkah!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                  {[
                    "Bagaimana cara menghitung luas lingkaran?",
                    "Jelaskan teorema Pythagoras",
                    "Apa itu persamaan kuadrat?",
                    "Bantu aku dengan soal pecahan",
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        playPopSound();
                        setInput(suggestion);
                        inputRef.current?.focus();
                      }}
                      className="text-left text-sm p-3 rounded-xl bg-muted/30 border border-border/50 text-muted-foreground hover:bg-muted/50 hover:border-purple-500/30 hover:text-foreground transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role as "user" | "assistant"}
                    content={getMessageText(message)}
                  />
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center border border-purple-400/30 shadow-lg shadow-purple-500/20">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur border border-purple-500/30 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                        <span className="text-muted-foreground text-sm">
                          NUMATIK sedang berpikir...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50 bg-card/60">
            {messages.length > 0 && (
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-muted-foreground hover:text-destructive text-xs gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Hapus Chat
                </Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pertanyaan matematika kamu..."
                  disabled={isLoading}
                  rows={1}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none font-body text-sm disabled:opacity-50 transition-all"
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 border-0 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              playPopSound();
              navigate("/menu");
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAIPage;
