import { useNavigate, useParams } from "react-router-dom";
import MeteorShootingGame from "@/components/MeteorShootingGame";
import FlappyRocketPage from "@/pages/math-game-arena/umum/FlappyRocketPage";
import BattleTankPage from "@/pages/math-game-arena/umum/BattleTankPage";
import SpaceImpactPage from "@/pages/math-game-arena/umum/SpaceImpactPage";
import DinoRunGamePage from "@/pages/math-game-arena/umum/DinoRunGamePage";
import TetrisGamePage from "@/pages/math-game-arena/umum/TetrisGamePage";
import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
import BrickBreakerPage from "@/pages/math-game-arena/umum/BrickBreakerPage";
import GalaksiTempurPage from "@/pages/math-game-arena/umum/GalaksiTempurPage";
import { getSubmaterialK8 } from "@/data/mga-k8/registry";
import type { GuruQuestion } from "@/hooks/useGuruQuiz";

const BACK_PATH = "/lkpd/kelas-8/spldv/metode-eliminasi";
const HOME_PATH = "/menu";
const TOPIC = "POSTES — SPLDV METODE ELIMINASI";

const POSTES_GURU: GuruQuestion[] = [
  {
    question: "Diberikan sistem persamaan berikut:\nx + y = 5\n2x − y = 4\nBerapakah nilai x yang memenuhi sistem persamaan tersebut?",
    options: ["4", "1", "2", "3"],
    correctIdx: 3,
  },
  {
    question: "Harga 2 buah buku dan 3 buah pensil adalah Rp12.000,00. Sedangkan harga 3 buah buku dan 1 buah pensil adalah Rp11.000,00. Berapakah harga 1 buah pensil?",
    options: ["Rp3.000,00", "Rp2.500,00", "Rp1.500,00", "Rp2.000,00"],
    correctIdx: 3,
  },
];

const entry = getSubmaterialK8("spldv", "metode-eliminasi");
const q = entry?.questions;

const PostesEliminasiDispatcher = () => {
  const navigate = useNavigate();
  const { variant } = useParams<{ variant: string }>();

  if (!q || !variant) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="relative z-10 text-center px-6">
          <h1 className="font-display text-2xl font-black text-white mb-2">Game tidak ditemukan</h1>
          <p className="text-white/60 text-sm mb-6">Halaman ini belum tersedia.</p>
          <button
            onClick={() => navigate(BACK_PATH)}
            className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white hover:bg-white/20 transition-colors"
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  switch (variant) {
    case "meteor":
      return (
        <MeteorShootingGame
          questions={q.meteor}
          topicLabel={TOPIC}
          backPath={BACK_PATH}
          backLabel="Kembali ke POSTES"
          homePath={HOME_PATH}
        />
      );
    case "galaksi":
      return (
        <GalaksiTempurPage
          topicLabel={TOPIC}
          backPath={BACK_PATH}
          homePath={HOME_PATH}
          quizQuestions={POSTES_GURU}
        />
      );
    case "flappy":
      return (
        <FlappyRocketPage
          questions={q.flappyRocket}
          topicLabel={TOPIC}
          backPath={BACK_PATH}
          homePath={HOME_PATH}
          quizQuestions={POSTES_GURU}
        />
      );
    case "tank":
      return (
        <BattleTankPage
          questions={q.tembakTank}
          topicLabel={TOPIC}
          backPath={BACK_PATH}
          homePath={HOME_PATH}
          quizQuestions={POSTES_GURU}
        />
      );
    case "space":
      return (
        <SpaceImpactPage
          questions={q.spaceImpact}
          topicLabel={TOPIC}
          backPath={BACK_PATH}
          homePath={HOME_PATH}
          quizQuestions={POSTES_GURU}
        />
      );
    case "turtle":
      return (
        <DinoRunGamePage
          questions={q.turtleRun}
          topicLabel={TOPIC}
          backPath={BACK_PATH}
          homePath={HOME_PATH}
          quizQuestions={POSTES_GURU}
        />
      );
    case "tetris":
      return (
        <TetrisGamePage
          topicLabel={TOPIC}
          backPath={BACK_PATH}
          homePath={HOME_PATH}
          quizQuestions={POSTES_GURU}
        />
      );
    case "snake":
      return (
        <SnakeMathPage
          topicLabel={TOPIC}
          backPath={BACK_PATH}
          homePath={HOME_PATH}
          quizQuestions={POSTES_GURU}
          quizIntervalMs={25_000}
        />
      );
    case "pantul":
      return (
        <BrickBreakerPage
          topicLabel={TOPIC}
          backPath={BACK_PATH}
          homePath={HOME_PATH}
          quizQuestions={POSTES_GURU}
        />
      );
    default:
      return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950">
          <div className="relative z-10 text-center px-6">
            <h1 className="font-display text-2xl font-black text-white mb-2">Game tidak dikenal</h1>
            <p className="text-white/60 text-sm mb-6">Varian "{variant}" tidak tersedia.</p>
            <button
              onClick={() => navigate(BACK_PATH)}
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              ← Kembali
            </button>
          </div>
        </div>
      );
  }
};

export default PostesEliminasiDispatcher;
