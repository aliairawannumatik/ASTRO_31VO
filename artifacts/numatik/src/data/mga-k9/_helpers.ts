import type { BaseQ, SubmaterialQuestionsK9 } from "./types";

const parseNumeric = (text: string): number => {
  const cleaned = text.replace(/[^\d.\-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const pick = (pool: BaseQ[], offset: number, count = 5): BaseQ[] => {
  const out: BaseQ[] = [];
  for (let i = 0; i < count; i++) {
    out.push(pool[(offset + i) % pool.length]);
  }
  return out;
};

export const expandPool = (pool: BaseQ[]): SubmaterialQuestionsK9 => {
  if (pool.length < 6) {
    while (pool.length < 6) pool.push(pool[pool.length % Math.max(pool.length, 1)] ?? pool[0]);
  }
  const meteorSet = pick(pool, 0);
  const flappySet = pick(pool, 2);
  const tankSet = pick(pool, 4);
  const spaceSet = pick(pool, 6);
  const turtleSet = pick(pool, 8);
  const snakeSet = pick(pool, 10);

  return {
    meteor: meteorSet.map((b) => ({
      question: b.q,
      options: b.opts,
      correctIndex: b.correct,
    })),
    flappyRocket: flappySet.map((b) => ({
      q: b.q,
      opts: b.opts,
      ans: b.correct,
    })),
    tembakTank: tankSet.map((b) => ({
      q: b.q,
      opts: b.opts,
      ans: b.correct,
    })),
    spaceImpact: spaceSet.map((b) => ({
      q: b.q,
      ans: b.numAns !== undefined ? b.numAns : parseNumeric(b.opts[b.correct]),
    })),
    turtleRun: turtleSet.map((b, i) => ({
      q: b.q,
      opts: b.opts,
      correctIndex: b.correct,
      bonus: 25 + (i % 3) * 5,
    })),
    snake: snakeSet.map((b) => ({
      question: b.q,
      options: b.opts,
      correctIdx: b.correct,
    })),
  };
};
