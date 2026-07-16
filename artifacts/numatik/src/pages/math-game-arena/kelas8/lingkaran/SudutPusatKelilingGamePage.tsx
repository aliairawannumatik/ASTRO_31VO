import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Sudut pusat adalah sudut yang ...",
    options: ["Berada di lingkaran", "Titik puncaknya di pusat lingkaran", "Titik puncaknya di keliling", "Dibentuk oleh tali busur"],
    correctIndex: 1,
  },
  {
    question: "Sudut keliling adalah sudut yang titik puncaknya berada di ...",
    options: ["Pusat lingkaran", "Luar lingkaran", "Keliling lingkaran", "Sumbu lingkaran"],
    correctIndex: 2,
  },
  {
    question: "Hubungan sudut pusat dan sudut keliling yang menghadap busur yang sama adalah ...",
    options: ["Sudut pusat = sudut keliling", "Sudut pusat = 2 × sudut keliling", "Sudut keliling = 2 × sudut pusat", "Tidak ada hubungan"],
    correctIndex: 1,
  },
  {
    question: "Jika sudut pusat = 80°, maka sudut keliling yang menghadap busur yang sama = ...",
    options: ["80°", "160°", "40°", "20°"],
    correctIndex: 2,
  },
  {
    question: "Sudut keliling yang menghadap diameter lingkaran besarnya ...",
    options: ["45°", "60°", "90°", "180°"],
    correctIndex: 2,
  },
];

const SudutPusatKelilingGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="SUDUT PUSAT DAN SUDUT KELILING"
    backPath="/math-game-arena/kelas-8/lingkaran"
    backLabel="Kembali ke Lingkaran"
  />
);

export default SudutPusatKelilingGamePage;
