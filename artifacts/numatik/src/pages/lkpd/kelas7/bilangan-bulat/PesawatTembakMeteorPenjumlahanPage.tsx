import { useLanguage } from "@/contexts/LanguageContext";
import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const PesawatTembakMeteorPenjumlahanPage = () => {
  const { language } = useLanguage();
  const L = language;

  const questions: QuizQuestion[] = L === "en"
    ? [
        {
          question: "The correct ascending order (smallest to largest) of -15, -30, 12 is ...",
          options: ["-15, -30, 12", "-30, 12, -15", "-30, -15, 12", "12, -15, -30"],
          correctIndex: 2,
        },
        {
          question: "What is the result of 32 + (-45)?",
          options: ["-77", "77", "-13", "13"],
          correctIndex: 2,
        },
        {
          question: "What is the result of -18 + (-14)?",
          options: ["-4", "-32", "4", "32"],
          correctIndex: 1,
        },
        {
          question: "One morning, a cold storage room has a temperature of -3°C. What is the temperature if it rises by 8°C?",
          options: ["11°C", "-11°C", "5°C", "-5°C"],
          correctIndex: 2,
        },
        {
          question: "A room has a temperature of 28°C. A freezer is 35°C colder than the room. What is the freezer temperature?",
          options: ["-63°C", "7°C", "-7°C", "63°C"],
          correctIndex: 2,
        },
      ]
    : L === "ja"
    ? [
        {
          question: "-15、-30、12 を小さい順に正しく並べると ...",
          options: ["-15, -30, 12", "-30, 12, -15", "-30, -15, 12", "12, -15, -30"],
          correctIndex: 2,
        },
        {
          question: "32 + (-45) の計算結果は？",
          options: ["-77", "77", "-13", "13"],
          correctIndex: 2,
        },
        {
          question: "-18 + (-14) の計算結果は？",
          options: ["-4", "-32", "4", "32"],
          correctIndex: 1,
        },
        {
          question: "ある朝、冷蔵室の温度は -3°C です。8°C 上がると温度は何度になりますか？",
          options: ["11°C", "-11°C", "5°C", "-5°C"],
          correctIndex: 2,
        },
        {
          question: "ある部屋の温度は 28°C です。冷凍庫はその部屋より 35°C 低いです。冷凍庫の温度は何度ですか？",
          options: ["-63°C", "7°C", "-7°C", "63°C"],
          correctIndex: 2,
        },
      ]
    : [
        {
          question: "Urutan naik (dari yang terkecil ke yang terbesar) yang paling tepat dari bilangan -15, -30, 12 adalah ...",
          options: ["-15, -30, 12", "-30, 12, -15", "-30, -15, 12", "12, -15, -30"],
          correctIndex: 2,
        },
        {
          question: "Berapakah nilai dari hasil operasi 32 + (-45)?",
          options: ["-77", "77", "-13", "13"],
          correctIndex: 2,
        },
        {
          question: "Berapakah nilai dari hasil penjumlahan -18 + (-14)?",
          options: ["-4", "-32", "4", "32"],
          correctIndex: 1,
        },
        {
          question: "Pada suatu pagi, suhu di sebuah ruangan pendingin adalah -3°C. Berapa derajat suhu di ruangan tersebut jika mengalami kenaikan sebesar 8°C?",
          options: ["11°C", "-11°C", "5°C", "-5°C"],
          correctIndex: 2,
        },
        {
          question: "Suhu sebuah ruangan biasa tercatat 28°C. Suhu di dalam lemari pembeku (freezer) 35°C lebih rendah dari suhu ruangan tersebut. Berapa suhu di dalam lemari pembeku saat ini?",
          options: ["-63°C", "7°C", "-7°C", "63°C"],
          correctIndex: 2,
        },
      ];

  return (
    <MeteorShootingGame
      questions={questions}
      topicLabel={
        L === "en"
          ? "LKPD - INTEGER ADDITION"
          : L === "ja"
          ? "ワークシート - 整数の足し算"
          : "LKPD - PENJUMLAHAN BILANGAN BULAT"
      }
      backPath="/lkpd/kelas-7/bilangan-bulat/penjumlahan"
      backLabel={
        L === "en"
          ? "Back to Addition LKPD"
          : L === "ja"
          ? "足し算のワークシートに戻る"
          : "Kembali ke LKPD Penjumlahan"
      }
    />
  );
};

export default PesawatTembakMeteorPenjumlahanPage;
