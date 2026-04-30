import { useNavigate, useParams } from "react-router-dom";
import MeteorShootingGame from "@/components/MeteorShootingGame";
import FlappyRocketPage from "@/pages/math-game-arena/umum/FlappyRocketPage";
import BattleTankPage from "@/pages/math-game-arena/umum/BattleTankPage";
import SpaceImpactPage from "@/pages/math-game-arena/umum/SpaceImpactPage";
import DinoRunGamePage from "@/pages/math-game-arena/umum/DinoRunGamePage";
import TetrisGamePage from "@/pages/math-game-arena/umum/TetrisGamePage";
import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
import { getSubmaterialK9 } from "@/data/mga-k9/registry";

const SubmaterialGameDispatcherK9 = () => {
  const navigate = useNavigate();
  const { parentSlug, slug, variant } = useParams<{
    parentSlug: string;
    slug: string;
    variant: string;
  }>();

  const entry = parentSlug && slug ? getSubmaterialK9(parentSlug, slug) : undefined;

  if (!entry || !variant) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="relative z-10 text-center px-6">
          <h1 className="font-display text-2xl font-black text-white mb-2">Game tidak ditemukan</h1>
          <p className="text-white/60 text-sm mb-6">Halaman ini belum tersedia.</p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white hover:bg-white/20 transition-colors"
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  const backPath = `/math-game-arena/kelas-9/${entry.parentSlug}/${entry.slug}`;
  const homePath = "/menu";
  const topicLabel = entry.label;
  const q = entry.questions;

  switch (variant) {
    case "pesawat-tembak-meteor":
      return (
        <MeteorShootingGame
          questions={q.meteor}
          topicLabel={topicLabel}
          backPath={backPath}
          backLabel="Kembali ke Pilihan Game"
          homePath={homePath}
        />
      );
    case "flappy-rocket":
      return (
        <FlappyRocketPage
          questions={q.flappyRocket}
          topicLabel={topicLabel}
          backPath={backPath}
          homePath={homePath}
          quizQuestions={q.snake}
        />
      );
    case "tembak-tank":
      return (
        <BattleTankPage
          questions={q.tembakTank}
          topicLabel={`${topicLabel} · Tembak tank dengan jawaban benar!`}
          backPath={backPath}
          homePath={homePath}
          quizQuestions={q.snake}
        />
      );
    case "space-impact":
      return (
        <SpaceImpactPage
          questions={q.spaceImpact}
          topicLabel={topicLabel}
          backPath={backPath}
          homePath={homePath}
          quizQuestions={q.snake}
        />
      );
    case "turtle-run":
      return (
        <DinoRunGamePage
          questions={q.turtleRun}
          topicLabel={topicLabel}
          backPath={backPath}
          homePath={homePath}
          quizQuestions={q.snake}
        />
      );
    case "tetris":
      return (
        <TetrisGamePage
          topicLabel={topicLabel}
          backPath={backPath}
          homePath={homePath}
          quizQuestions={q.snake}
        />
      );
    case "snake-math":
      return (
        <SnakeMathPage
          topicLabel={topicLabel}
          backPath={backPath}
          homePath={homePath}
          quizQuestions={q.snake}
          quizIntervalMs={25_000}
        />
      );
    default:
      return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950">
          <div className="relative z-10 text-center px-6">
            <h1 className="font-display text-2xl font-black text-white mb-2">Game tidak dikenal</h1>
            <p className="text-white/60 text-sm mb-6">Varian "{variant}" tidak tersedia.</p>
            <button
              onClick={() => navigate(backPath)}
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              ← Kembali
            </button>
          </div>
        </div>
      );
  }
};

export default SubmaterialGameDispatcherK9;
