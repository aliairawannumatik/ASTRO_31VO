import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN DAN UNSUR-UNSUR BENTUK ALJABAR", path: "/math-game-arena/kelas-7/aljabar/pengertian-unsur" },
  { name: "PENJUMLAHAN DAN PENGURANGAN BENTUK ALJABAR", path: "/math-game-arena/kelas-7/aljabar/penjumlahan-pengurangan" },
  { name: "PERKALIAN BENTUK ALJABAR", path: "/math-game-arena/kelas-7/aljabar/perkalian" },
  { name: "PEMBAGIAN BENTUK ALJABAR", path: "/math-game-arena/kelas-7/aljabar/pembagian" },
  { name: "PEMANGKATAN BENTUK ALJABAR", path: "/math-game-arena/kelas-7/aljabar/pemangkatan" },
  { name: "SUBSTITUSI BILANGAN PADA BENTUK ALJABAR", path: "/math-game-arena/kelas-7/aljabar/substitusi" },
  { name: "FAKTORISASI BENTUK ALJABAR", path: "/math-game-arena/kelas-7/aljabar/faktorisasi" },
  { name: "MENYEDERHANAKAN PECAHAN ALJABAR", path: "/math-game-arena/kelas-7/aljabar/operasi-pecahan" },
];

const AljabarPage = () => (
  <GameSubtopicPage title="ALJABAR" subtopics={subtopics} icon="✏️" />
);

export default AljabarPage;
