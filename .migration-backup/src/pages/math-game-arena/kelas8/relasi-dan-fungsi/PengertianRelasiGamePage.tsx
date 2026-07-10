import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Relasi dari himpunan A ke himpunan B adalah ...",
    options: ["Aturan yang menghubungkan semua anggota A ke satu anggota B", "Aturan yang menghubungkan anggota A ke anggota B", "Daftar bilangan yang sama", "Persamaan linear"],
    correctIndex: 1,
  },
  {
    question: "Cara menyajikan relasi yang menggunakan gambar panah disebut ...",
    options: ["Himpunan pasangan berurutan", "Tabel", "Diagram panah", "Grafik"],
    correctIndex: 2,
  },
  {
    question: "Jika A = {1, 2, 3} dan relasi 'kurang dari' ke B = {2, 3, 4}, maka 1 berelasi dengan ...",
    options: ["2 saja", "2 dan 3", "2, 3, dan 4", "3 dan 4"],
    correctIndex: 2,
  },
  {
    question: "Himpunan daerah asal dalam suatu relasi disebut ...",
    options: ["Range", "Domain", "Kodomain", "Fungsi"],
    correctIndex: 1,
  },
  {
    question: "Himpunan semua nilai yang dipetakan (hasil) dalam relasi disebut ...",
    options: ["Domain", "Kodomain", "Range", "Peta"],
    correctIndex: 2,
  },
];

const PengertianRelasiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGERTIAN RELASI DAN PENYAJIANNYA"
    backPath="/math-game-arena/kelas-8/relasi-dan-fungsi"
    backLabel="Kembali ke Relasi dan Fungsi"
  />
);

export default PengertianRelasiGamePage;
