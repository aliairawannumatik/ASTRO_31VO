const LETTERS = ["N", "U", "M", "A", "T", "I", "K"];

const LETTER_COLORS = [
  { color: "#22d3ee", glow: "rgba(34,211,238,0.85)" },
  { color: "#60a5fa", glow: "rgba(96,165,250,0.85)" },
  { color: "#a78bfa", glow: "rgba(167,139,250,0.85)" },
  { color: "#f472b6", glow: "rgba(244,114,182,0.85)" },
  { color: "#fbbf24", glow: "rgba(251,191,36,0.85)"  },
  { color: "#34d399", glow: "rgba(52,211,153,0.85)"  },
  { color: "#60a5fa", glow: "rgba(96,165,250,0.85)"  },
];

const PageLoader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">

    {/* ── Deep space radial glow ── */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(14,165,233,0.08) 0%, transparent 70%)",
      }}
    />

    {/* ── Subtle grid lines ── */}
    <div className="absolute inset-0 pointer-events-none numatik-loader-grid" />

    {/* ── Floating sparkles ── */}
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full numatik-sparkle"
        style={{
          width: `${2 + (i % 3)}px`,
          height: `${2 + (i % 3)}px`,
          background: LETTER_COLORS[i % LETTER_COLORS.length].color,
          left: `${8 + i * 7.2}%`,
          top: `${20 + ((i * 37) % 60)}%`,
          animationDelay: `${i * 0.3}s`,
          boxShadow: `0 0 6px 2px ${LETTER_COLORS[i % LETTER_COLORS.length].glow}`,
        }}
      />
    ))}

    {/* ── NUMATIK wave letters ── */}
    <div className="relative flex items-end gap-1 sm:gap-2 select-none mb-6" style={{ height: 100 }}>
      {LETTERS.map((letter, i) => (
        <span
          key={letter + i}
          className="numatik-wave-letter font-display font-black"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            color: LETTER_COLORS[i].color,
            textShadow: `
              0 0 12px ${LETTER_COLORS[i].glow},
              0 0 30px ${LETTER_COLORS[i].glow},
              0 0 60px ${LETTER_COLORS[i].glow.replace("0.85", "0.4")}
            `,
            animationDelay: `${i * 0.12}s`,
            display: "inline-block",
            lineHeight: 1,
          }}
        >
          {letter}
        </span>
      ))}

      {/* Reflection */}
      <div
        className="absolute left-0 right-0 flex items-start gap-1 sm:gap-2 pointer-events-none numatik-reflection"
        style={{ top: "100%", marginTop: 2 }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={"r" + i}
            className="font-display font-black"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              color: LETTER_COLORS[i].color,
              opacity: 0.12,
              transform: "scaleY(-1)",
              display: "inline-block",
              lineHeight: 1,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>

    {/* ── Neon progress bar ── */}
    <div className="w-48 sm:w-64 h-1 rounded-full bg-white/10 overflow-hidden mb-5">
      <div
        className="h-full rounded-full numatik-progress-bar"
        style={{
          background:
            "linear-gradient(90deg, #22d3ee, #60a5fa, #a78bfa, #f472b6, #fbbf24, #34d399, #22d3ee)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>

    {/* ── Loading dots ── */}
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-body text-muted-foreground tracking-widest uppercase">
        Memuat
      </span>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="numatik-dot"
          style={{
            width: 4, height: 4,
            borderRadius: "50%",
            background: "#22d3ee",
            display: "inline-block",
            boxShadow: "0 0 6px rgba(34,211,238,0.8)",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  </div>
);

export default PageLoader;
