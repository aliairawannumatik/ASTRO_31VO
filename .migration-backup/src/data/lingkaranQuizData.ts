export interface LingkaranQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const lingkaranQuizQuestions: LingkaranQuizQuestion[] = [
  {
    question: "Bagian yang berwarna merah pada gambar di bawah adalah …",
    options: ["Juring", "Busur", "Tembereng", "Apotema"],
    correctIndex: 1,
  },
  {
    question: "Bagian yang berwarna kuning pada gambar di bawah adalah …",
    options: ["Busur", "Tembereng", "Apotema", "Juring"],
    correctIndex: 1,
  },
  {
    question: "Garis Apotema pada gambar lingkaran di bawah adalah …",
    options: ["AB", "DO", "CO", "OP"],
    correctIndex: 1,
  },
  {
    question: "Diameter pada gambar lingkaran di bawah adalah …",
    options: ["DO", "CO", "AB", "OP"],
    correctIndex: 2,
  },
  {
    question: "Disebut apakah garis AC pada gambar lingkaran di bawah?",
    options: ["Busur", "Jari-jari", "Diameter", "Tali Busur"],
    correctIndex: 3,
  },
];
