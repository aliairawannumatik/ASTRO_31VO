import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Uang Adi : Beni = 2 : 3 dan Beni : Candra = 3 : 4. Jika total uang mereka Rp180.000, uang Beni adalah ...",
    options: ["Rp40.000", "Rp60.000", "Rp80.000", "Rp100.000"],
    correctIndex: 1,
  },
  {
    question: "Kelereng A : B = 2 : 3 dan B : C = 4 : 5. Jika total kelereng = 70 butir, kelereng C adalah ...",
    options: ["16 butir", "24 butir", "30 butir", "35 butir"],
    correctIndex: 2,
  },
  {
    question: "Tinggi badan X : Y = 4 : 5 dan Y : Z = 5 : 6. Jika tinggi X = 120 cm, maka tinggi Z adalah ...",
    options: ["150 cm", "160 cm", "168 cm", "180 cm"],
    correctIndex: 3,
  },
  {
    question: "Modal Ari : Budi = 3 : 4 dan Budi : Citra = 2 : 5. Selisih modal Ari dan Citra adalah Rp35.000. Total modal ketiganya adalah ...",
    options: ["Rp75.000", "Rp80.000", "Rp85.000", "Rp90.000"],
    correctIndex: 2,
  },
  {
    question: "Perbandingan A : B = 1 : 3 dan B : C = 3 : 5 (B sudah sama). Jika C = 45, maka A + B adalah ...",
    options: ["30", "33", "36", "39"],
    correctIndex: 2,
  },
];

const PerbandinganBertingkatGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PERBANDINGAN BERTINGKAT"
    backPath="/math-game-arena/kelas-7/perbandingan"
    backLabel="Kembali ke Perbandingan"
  />
);

export default PerbandinganBertingkatGamePage;
