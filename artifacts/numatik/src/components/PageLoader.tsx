const LETTERS = ["N", "U", "M", "A", "T", "I", "K"];

const LETTER_COLORS = [
  "#ffffff",
  "#e0f2fe",
  "#bae6fd",
  "#ffffff",
  "#e0f2fe",
  "#ffffff",
  "#bae6fd",
];

const PageLoader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">

    {/* ── Sharp diagonal scan line ── */}
    <div className="absolute inset-0 pointer-events-none numatik-scan-sweep" />

    {/* ── Thin horizontal rule lines ── */}
    <div className="absolute inset-0 pointer-events-none numatik-sharp-grid" />

    {/* ── NUMATIK wave letters ── */}
    <div
      className="relative flex items-end gap-0 sm:gap-0.5 select-none mb-2"
      style={{ height: 110 }}
    >
      {LETTERS.map((letter, i) => (
        <span
          key={letter + i}
          className="numatik-wave-letter font-display font-black numatik-sharp-letter"
          style={{
            fontSize: "clamp(3rem, 9vw, 5rem)",
            animationDelay: `${i * 0.11}s`,
            display: "inline-block",
            lineHeight: 1,
            color: LETTER_COLORS[i],
            /* Sharp metallic gradient via background-clip */
            background:
              "linear-gradient(175deg, #ffffff 0%, #e2f4ff 30%, #7dd3fc 55%, #0ea5e9 80%, #0369a1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            /* Hard offset shadow — no blur */
            filter: "drop-shadow(3px 3px 0px rgba(3,105,161,0.9))",
          }}
        >
          {letter}
        </span>
      ))}
    </div>

    {/* ── Thin sharp underline ── */}
    <div
      className="mb-5 numatik-underline"
      style={{
        width: "clamp(180px, 40vw, 300px)",
        height: 2,
        background: "linear-gradient(90deg, transparent, #0ea5e9 20%, #ffffff 50%, #0ea5e9 80%, transparent)",
      }}
    />

    {/* ── Sharp progress bar — rectangular, no rounding ── */}
    <div
      className="mb-5 overflow-hidden"
      style={{
        width: "clamp(160px, 36vw, 260px)",
        height: 3,
        background: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="h-full numatik-progress-sharp"
        style={{
          background: "linear-gradient(90deg, #0ea5e9, #ffffff, #0ea5e9)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>

    {/* ── Loading text — clean, no decoration ── */}
    <div className="flex items-center gap-2">
      <span
        className="font-display text-xs tracking-[0.3em] uppercase"
        style={{ color: "rgba(186,230,253,0.7)", letterSpacing: "0.3em" }}
      >
        Memuat
      </span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="numatik-dot-sharp"
            style={{
              width: 3,
              height: 3,
              background: "#7dd3fc",
              display: "inline-block",
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default PageLoader;
