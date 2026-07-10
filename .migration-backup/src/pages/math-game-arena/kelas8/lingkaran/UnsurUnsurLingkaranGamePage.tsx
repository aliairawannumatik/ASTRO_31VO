import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Garis lurus yang menghubungkan dua titik pada lingkaran dan melalui pusat disebut ...",
    options: ["Jari-jari", "Diameter", "Busur", "Tali busur"],
    correctIndex: 1,
  },
  {
    question: "Jarak dari pusat lingkaran ke titik pada lingkaran disebut ...",
    options: ["Diameter", "Busur", "Jari-jari", "Apotema"],
    correctIndex: 2,
  },
  {
    question: "Bagian lingkaran yang dibatasi oleh dua jari-jari dan sebuah busur disebut ...",
    options: ["Tembereng", "Juring", "Busur", "Tali busur"],
    correctIndex: 1,
  },
  {
    question: "Bagian lingkaran yang dibatasi oleh tali busur dan busur disebut ...",
    options: ["Juring", "Tembereng", "Apotema", "Diameter"],
    correctIndex: 1,
  },
  {
    question: "Hubungan diameter (d) dan jari-jari (r) adalah ...",
    options: ["d = r/2", "d = 2r", "d = r²", "d = r + 2"],
    correctIndex: 1,
  },
];

const UnsurUnsurLingkaranGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="UNSUR-UNSUR LINGKARAN"
    backPath="/math-game-arena/kelas-8/lingkaran"
    backLabel="Kembali ke Lingkaran"
  />
);

export default UnsurUnsurLingkaranGamePage;
