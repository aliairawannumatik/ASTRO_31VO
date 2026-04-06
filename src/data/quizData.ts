export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Setiap sisi pada kubus berbentuk?",
    options: ["Persegi", "Segitiga", "Persegi Panjang", "Lingkaran"],
    correctIndex: 0,
  },
  {
    question: "Berapa jumlah sisi pada kubus?",
    options: ["4", "6", "8", "12"],
    correctIndex: 1,
  },
  {
    question: "Berapa jumlah rusuk pada kubus?",
    options: ["6", "8", "10", "12"],
    correctIndex: 3,
  },
  {
    question: "Berapa jumlah titik sudut pada kubus?",
    options: ["4", "6", "8", "12"],
    correctIndex: 2,
  },
  {
    question: "Rusuk-rusuk pada kubus memiliki panjang yang...",
    options: ["Berbeda", "Sama", "Acak", "Bervariasi"],
    correctIndex: 1,
  },
  {
    question: "Diagonal ruang pada kubus berjumlah...",
    options: ["2", "4", "6", "8"],
    correctIndex: 1,
  },
  {
    question: "Diagonal sisi pada kubus berjumlah...",
    options: ["6", "8", "12", "24"],
    correctIndex: 2,
  },
  {
    question: "Berapa banyak jaring-jaring kubus yang berbeda?",
    options: ["6", "8", "11", "14"],
    correctIndex: 2,
  },
  {
    question: "Bidang diagonal pada kubus berjumlah...",
    options: ["4", "6", "8", "12"],
    correctIndex: 1,
  },
  {
    question: "Jika rusuk kubus 5 cm, luas permukaan kubus adalah...",
    options: ["100 cm²", "125 cm²", "150 cm²", "200 cm²"],
    correctIndex: 2,
  },
];
