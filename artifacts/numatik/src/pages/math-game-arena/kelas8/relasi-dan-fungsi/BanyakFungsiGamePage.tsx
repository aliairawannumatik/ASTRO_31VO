import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Jika n(A) = 2 dan n(B) = 3, banyaknya fungsi dari A ke B adalah ...",
    options: ["6", "8", "9", "12"],
    correctIndex: 2,
  },
  {
    question: "Korespondensi satu-satu terjadi bila setiap anggota A dipasangkan dengan tepat satu anggota B dan ...",
    options: ["Ada anggota B yang tidak dipasangkan", "Setiap anggota B juga dipasangkan dengan tepat satu anggota A", "Banyak anggota A lebih dari B", "Tidak ada aturan yang pasti"],
    correctIndex: 1,
  },
  {
    question: "Syarat terjadi korespondensi satu-satu antara A dan B adalah ...",
    options: ["n(A) ≠ n(B)", "n(A) = n(B)", "n(A) > n(B)", "n(A) < n(B)"],
    correctIndex: 1,
  },
  {
    question: "Jika n(A) = 3 dan n(B) = 3, banyaknya korespondensi satu-satu yang mungkin adalah ...",
    options: ["3", "6", "9", "27"],
    correctIndex: 1,
  },
  {
    question: "Banyaknya fungsi dari A ke B jika n(A) = 3 dan n(B) = 2 adalah ...",
    options: ["6", "8", "9", "12"],
    correctIndex: 1,
  },
];

const BanyakFungsiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MENENTUKAN BANYAK FUNGSI DAN KORESPONDENSI SATU-SATU"
    backPath="/math-game-arena/kelas-8/relasi-dan-fungsi"
    backLabel="Kembali ke Relasi dan Fungsi"
  />
);

export default BanyakFungsiGamePage;
