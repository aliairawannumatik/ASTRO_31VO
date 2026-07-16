import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Dua segitiga kongruen jika memenuhi syarat SAS (Side-Angle-Side), artinya ...",
    options: [
      "Dua sisi dan satu sudut bersesuaian sama",
      "Dua sisi sama panjang dan sudut yang diapit keduanya sama besar",
      "Satu sisi dan dua sudut bersesuaian sama",
      "Ketiga sudutnya sama besar",
    ],
    correctIndex: 1,
  },
  {
    question: "Syarat kongruensi SSS (Side-Side-Side) artinya ...",
    options: [
      "Dua sisi bersesuaian sama panjang",
      "Satu sisi dan dua sudut sama",
      "Ketiga sisi bersesuaian sama panjang",
      "Ketiga sudut bersesuaian sama besar",
    ],
    correctIndex: 2,
  },
  {
    question: "Dua persegi dengan sisi masing-masing 5 cm adalah ...",
    options: ["Sebangun saja", "Kongruen saja", "Sebangun dan kongruen", "Tidak berhubungan"],
    correctIndex: 2,
  },
  {
    question: "Segitiga ABC kongruen dengan segitiga DEF. Jika AB = 7, DE = ...",
    options: ["7", "14", "Tidak dapat ditentukan", "3,5"],
    correctIndex: 0,
  },
  {
    question: "Syarat AAS (Angle-Angle-Side) artinya dua segitiga kongruen jika ...",
    options: [
      "Dua sudut dan satu sisi yang diapit sama",
      "Dua sudut bersesuaian sama dan satu sisi bukan apit sama",
      "Dua sisi dan satu sudut sama",
      "Ketiga sudut sama",
    ],
    correctIndex: 1,
  },
];

const KekongruenBangunDatarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="KEKONGRUENAN PADA BANGUN DATAR"
    backPath="/math-game-arena/kelas-9/kesebangunan-kekongruenan"
    backLabel="Kembali ke Kesebangunan & Kekongruenan"
  />
);

export default KekongruenBangunDatarGamePage;
