import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN DAN KEANGGOTAAAN SUATU HIMPUNAN", path: "/math-game-arena/kelas-7/himpunan/pengertian-keanggotaan" },
  { name: "HIMPUNAN BERHINGGA, HIMPUNAN KOSONG, DAN HIMPUNAN TAK HINGGA", path: "/math-game-arena/kelas-7/himpunan/himpunan-berhingga-kosong" },
  { name: "DIAGRAM VENN", path: "/math-game-arena/kelas-7/himpunan/diagram-venn" },
  { name: "PEMECAHAN MASALAH YANG BERKAITAN DENGAN HIMPUNAN", path: "/math-game-arena/kelas-7/himpunan/pemecahan-masalah" },
];

const HimpunanPage = () => (
  <GameSubtopicPage title="HIMPUNAN" subtopics={subtopics} icon="🔵" />
);

export default HimpunanPage;
