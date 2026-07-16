import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Gamepad2, RotateCcw, Sparkles, Trophy, Rocket } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

export type DragMatchGame = {
  kind: "drag-match";
  id: string;
  title: string;
  description: string;
  buckets: { id: string; label: string; emoji?: string; color?: "cyan" | "violet" | "emerald" | "amber" | "rose" }[];
  items: { id: string; label: string; bucketId: string; emoji?: string }[];
};

export type ArrowMatchGame = {
  kind: "arrow-match";
  id: string;
  title: string;
  description: string;
  rightOptions: string[];
  pairs: { id: string; left: string; correctRight: string; emoji?: string }[];
};

export type PageLinkGame = {
  kind: "page-link";
  id: string;
  title: string;
  description: string;
  path: string;
  buttonLabel?: string;
  emoji?: string;
};

export type LKPDGame = DragMatchGame | ArrowMatchGame | PageLinkGame;

const bucketTone: Record<NonNullable<DragMatchGame["buckets"][number]["color"]>, string> = {
  cyan: "from-cyan-500/30 to-cyan-700/20 border-cyan-300/40",
  violet: "from-violet-500/30 to-violet-700/20 border-violet-300/40",
  emerald: "from-emerald-500/30 to-emerald-700/20 border-emerald-300/40",
  amber: "from-amber-500/30 to-amber-700/20 border-amber-300/40",
  rose: "from-rose-500/30 to-rose-700/20 border-rose-300/40",
};

const DragMatchPlay = ({ game }: { game: DragMatchGame }) => {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [picked, setPicked] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const trayItems = useMemo(
    () => game.items.filter((it) => !placements[it.id]),
    [game.items, placements],
  );

  const placeInBucket = (itemId: string, bucketId: string) => {
    setPlacements((p) => ({ ...p, [itemId]: bucketId }));
    setPicked(null);
    playPopSound();
  };

  const removeFromBucket = (itemId: string) => {
    setPlacements((p) => {
      const next = { ...p };
      delete next[itemId];
      return next;
    });
    playPopSound();
  };

  const handleItemTap = (itemId: string) => {
    setPicked((cur) => (cur === itemId ? null : itemId));
    playPopSound();
  };

  const handleBucketTap = (bucketId: string) => {
    if (!picked) return;
    placeInBucket(picked, bucketId);
  };

  const allPlaced = trayItems.length === 0;
  const correctCount = useMemo(
    () => game.items.filter((it) => placements[it.id] === it.bucketId).length,
    [game.items, placements],
  );

  const check = () => {
    if (!allPlaced) return;
    setChecked(true);
    playPopSound();
  };

  const reset = () => {
    setPlacements({});
    setPicked(null);
    setChecked(false);
    playPopSound();
  };

  return (
    <div>
      <div className="rounded-2xl border border-cyan-200/25 bg-black/30 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <p className="text-xs font-bold text-yellow-200">
            Tarik kotak (atau ketuk → ketuk wadah) untuk menempatkan ke kategori yang tepat.
          </p>
        </div>
        {trayItems.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {trayItems.map((it) => {
              const active = picked === it.id;
              return (
                <button
                  key={it.id}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", it.id);
                    setPicked(it.id);
                  }}
                  onDragEnd={() => setPicked(null)}
                  onClick={() => handleItemTap(it.id)}
                  className={`select-none cursor-grab active:cursor-grabbing rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                    active
                      ? "border-yellow-300 bg-yellow-400/30 text-white shadow-lg scale-110"
                      : "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                  }`}
                >
                  {it.emoji && <span className="mr-1">{it.emoji}</span>}
                  {it.label}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-white/60 italic">Semua kotak sudah ditempatkan. Klik “Cek Hasil”.</p>
        )}
      </div>

      <div className={`grid gap-3 mb-4 ${game.buckets.length === 2 ? "md:grid-cols-2" : game.buckets.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
        {game.buckets.map((b) => {
          const placedHere = game.items.filter((it) => placements[it.id] === b.id);
          const tone = bucketTone[b.color ?? "cyan"];
          const isOver = dragOver === b.id;
          return (
            <div
              key={b.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(b.id);
              }}
              onDragLeave={() => setDragOver((cur) => (cur === b.id ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                setDragOver(null);
                if (id) placeInBucket(id, b.id);
              }}
              onClick={() => handleBucketTap(b.id)}
              className={`min-h-[140px] rounded-2xl border bg-gradient-to-br ${tone} p-3 transition-all cursor-pointer ${
                isOver || (picked && !placements[picked])
                  ? "ring-2 ring-yellow-300/70 scale-[1.02]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {b.emoji && <span className="text-2xl">{b.emoji}</span>}
                <h4 className="font-display font-bold text-white text-sm">{b.label}</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {placedHere.length === 0 && (
                  <p className="text-[11px] italic text-white/55">— kosong —</p>
                )}
                {placedHere.map((it) => {
                  const correctPlacement = checked ? it.bucketId === b.id && placements[it.id] === b.id : false;
                  const wrongPlacement = checked && it.bucketId !== b.id && placements[it.id] === b.id;
                  let chipCls = "border-white/30 bg-white/15 text-white";
                  if (checked) {
                    if (correctPlacement) chipCls = "border-emerald-300 bg-emerald-500/30 text-white";
                    if (wrongPlacement) chipCls = "border-rose-300 bg-rose-500/30 text-white";
                  }
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!checked) removeFromBucket(it.id);
                      }}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${chipCls}`}
                      title={checked ? "" : "Klik untuk lepas"}
                    >
                      {it.emoji && <span className="mr-1">{it.emoji}</span>}
                      {it.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={check}
            disabled={!allPlaced}
            className="rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 text-sm font-bold text-slate-900 transition-colors"
          >
            Cek Hasil
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-bold text-white inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi
          </button>
        </div>
        {checked && (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-300/30 px-4 py-2 text-sm font-bold text-emerald-100">
            <Trophy className="w-4 h-4" />
            Skor: {correctCount}/{game.items.length}
          </div>
        )}
      </div>
    </div>
  );
};

const ArrowMatchPlay = ({ game }: { game: ArrowMatchGame }) => {
  const initialIdx = useMemo(
    () => Object.fromEntries(game.pairs.map((p) => [p.id, 0])),
    [game.pairs],
  );
  const [indices, setIndices] = useState<Record<string, number>>(initialIdx);
  const [checked, setChecked] = useState(false);

  const cycle = (id: string, delta: number) => {
    setIndices((cur) => {
      const len = game.rightOptions.length;
      const nextIdx = ((cur[id] ?? 0) + delta + len) % len;
      return { ...cur, [id]: nextIdx };
    });
    playPopSound();
  };

  const correctCount = useMemo(
    () =>
      game.pairs.filter((p) => game.rightOptions[indices[p.id] ?? 0] === p.correctRight).length,
    [game.pairs, game.rightOptions, indices],
  );

  const check = () => {
    setChecked(true);
    playPopSound();
  };

  const reset = () => {
    setIndices(initialIdx);
    setChecked(false);
    playPopSound();
  };

  return (
    <div>
      <div className="rounded-2xl border border-fuchsia-200/25 bg-black/30 p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-fuchsia-200" />
          <p className="text-xs font-bold text-fuchsia-100">
            Tekan tombol panah ◀ ▶ untuk mengganti pasangan, lalu klik “Cek Hasil”.
          </p>
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        {game.pairs.map((p, idx) => {
          const ri = indices[p.id] ?? 0;
          const current = game.rightOptions[ri];
          const correct = current === p.correctRight;
          let frame = "border-white/15 bg-card/70";
          if (checked) {
            frame = correct
              ? "border-emerald-300/60 bg-emerald-500/15"
              : "border-rose-300/60 bg-rose-500/15";
          }
          return (
            <div
              key={p.id}
              className={`grid grid-cols-1 md:grid-cols-[40px_1fr_auto_1fr] items-center gap-2 rounded-2xl border p-3 ${frame}`}
            >
              <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-fuchsia-500/30 text-fuchsia-100 font-bold text-sm">
                {idx + 1}
              </div>
              <div className="rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-sm font-bold text-white text-center md:text-left">
                {p.emoji && <span className="mr-1.5">{p.emoji}</span>}
                {p.left}
              </div>
              <div className="text-center text-2xl text-fuchsia-200">↔</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => cycle(p.id, -1)}
                  className="shrink-0 rounded-full bg-fuchsia-500/40 hover:bg-fuchsia-500/60 p-2 text-white transition-colors"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 rounded-xl border border-fuchsia-200/40 bg-fuchsia-500/15 px-3 py-2 text-sm font-bold text-white text-center min-h-[40px] flex items-center justify-center">
                  {current}
                </div>
                <button
                  type="button"
                  onClick={() => cycle(p.id, 1)}
                  className="shrink-0 rounded-full bg-fuchsia-500/40 hover:bg-fuchsia-500/60 p-2 text-white transition-colors"
                  aria-label="Berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={check}
            className="rounded-full bg-fuchsia-500 hover:bg-fuchsia-400 px-5 py-2 text-sm font-bold text-white transition-colors"
          >
            Cek Hasil
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-bold text-white inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi
          </button>
        </div>
        {checked && (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-300/30 px-4 py-2 text-sm font-bold text-emerald-100">
            <Trophy className="w-4 h-4" />
            Skor: {correctCount}/{game.pairs.length}
          </div>
        )}
      </div>
    </div>
  );
};

const PageLinkPlay = ({ game }: { game: PageLinkGame }) => {
  const navigate = useNavigate();
  const handleLaunch = () => {
    playPopSound();
    navigate(game.path);
  };
  return (
    <div className="rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-purple-500/15 p-5 text-center">
      <div className="text-5xl mb-3">{game.emoji ?? "🚀"}</div>
      <p className="text-sm text-white/75 font-body mb-4">
        Klik tombol di bawah untuk membuka permainan dalam mode penuh layar.
      </p>
      <button
        type="button"
        onClick={handleLaunch}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-6 py-3 font-display font-bold text-white shadow-[0_0_25px_rgba(0,200,255,0.45)] hover:shadow-[0_0_35px_rgba(0,200,255,0.65)] transition-shadow"
      >
        <Rocket className="w-5 h-5" />
        {game.buttonLabel ?? "MAINKAN GAME"}
      </button>
    </div>
  );
};

const LKPDGameZone = ({ games }: { games: LKPDGame[] }) => {
  if (!games || games.length === 0) return null;
  return (
    <section className="bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-pink-500/15 border border-amber-200/30 rounded-3xl p-5 md:p-7 mb-6 backdrop-blur">
      <div className="flex items-start gap-3 mb-5">
        <Gamepad2 className="w-8 h-8 text-amber-200 shrink-0" />
        <div>
          <h2 className="font-display text-2xl font-bold text-amber-100">C. Zona Permainan</h2>
          <p className="text-sm text-white/70 font-body mt-1">
            Bermain sambil mengasah konsep. Boleh diulang sebanyak yang kamu mau!
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {games.map((g) => (
          <div key={g.id} className="rounded-2xl bg-card/70 border border-white/10 p-4 md:p-5">
            <div className="mb-3">
              <h3 className="font-display font-bold text-white text-lg">{g.title}</h3>
              <p className="text-sm text-white/65 font-body">{g.description}</p>
            </div>
            {g.kind === "drag-match" && <DragMatchPlay game={g} />}
            {g.kind === "arrow-match" && <ArrowMatchPlay game={g} />}
            {g.kind === "page-link" && <PageLinkPlay game={g} />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default LKPDGameZone;
