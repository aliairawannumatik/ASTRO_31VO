import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "GARIS BERAT, GARIS BAGI DAN GARIS TINGGI PADA SEGITIGA", path: "/math-game-arena/kelas-7/segitiga-dan-segiempat/garis-berat-bagi-tinggi" },
  { name: "KELILING SEGITIGA DAN SEGIEMPAT", path: "/math-game-arena/kelas-7/segitiga-dan-segiempat/keliling" },
  { name: "LUAS SEGITIGA", path: "/math-game-arena/kelas-7/segitiga-dan-segiempat/luas-segitiga" },
  { name: "LUAS SEGIEMPAT", path: "/math-game-arena/kelas-7/segitiga-dan-segiempat/luas-segiempat" },
  { name: "KELILING DAN LUAS BANGUN TAK BERATURAN", path: "/math-game-arena/kelas-7/segitiga-dan-segiempat/bangun-tak-beraturan" },
];

const SegitigaSegiempatPage = () => (
  <GameSubtopicPage title="SEGITIGA DAN SEGIEMPAT" subtopics={subtopics} icon="🔺" />
);

export default SegitigaSegiempatPage;
