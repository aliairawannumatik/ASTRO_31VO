import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Fungsi (pemetaan) adalah relasi dari himpunan A ke himpunan B dimana setiap anggota A dipasangkan dengan ...",
    options: ["Banyak anggota B", "Tepat satu anggota B", "Tidak ada anggota B", "Semua anggota B"],
    correctIndex: 1,
  },
  {
    question: "Manakah yang merupakan fungsi dari A = {1, 2, 3} ke B?",
    options: ["1→2, 2→3 (1 tidak dipetakan)", "1→2, 1→3, 2→4", "1→2, 2→3, 3→4", "Tidak ada pasangan"],
    correctIndex: 2,
  },
  {
    question: "Dalam suatu fungsi f: A → B, himpunan A disebut ...",
    options: ["Range", "Kodomain", "Domain", "Peta"],
    correctIndex: 2,
  },
  {
    question: "Setiap relasi yang memasangkan satu anggota domain ke lebih dari satu anggota kodomain ...",
    options: ["Adalah fungsi", "Bukan fungsi", "Adalah korespondensi satu-satu", "Adalah relasi khusus"],
    correctIndex: 1,
  },
  {
    question: "Fungsi f(x) = 2x. Nilai f(5) adalah ...",
    options: ["5", "7", "10", "25"],
    correctIndex: 2,
  },
];

const PengertianFungsiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGERTIAN FUNGSI DAN PENYAJIANNYA"
    backPath="/math-game-arena/kelas-8/relasi-dan-fungsi"
    backLabel="Kembali ke Relasi dan Fungsi"
  />
);

export default PengertianFungsiGamePage;
