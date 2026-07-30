import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN DAN KEANGGOTAAAN SUATU HIMPUNAN", path: "/lkpd/kelas-7/himpunan/lkpd", icon: "👥" },
  { label: "MENYATAKAN SUATU HIMPUNAN", path: "/lkpd/kelas-7/himpunan/lkpd", icon: "✍️" },
  { label: "HIMPUNAN KOSONG DAN HIMPUNAN SEMESTA", path: "/lkpd/kelas-7/himpunan/lkpd", icon: "∅" },
  { label: "OPERASI HIMPUNAN", path: "/lkpd/kelas-7/himpunan/lkpd", icon: "⊕" },
  { label: "DIAGRAM VENN", path: "/lkpd/kelas-7/himpunan/lkpd", icon: "🔵" },
  { label: "PEMECAHAN MASALAH YANG BERKAITAN DENGAN HIMPUNAN", path: "/lkpd/kelas-7/himpunan/lkpd", icon: "💡" },
];

const HimpunanMenuPage = () => (
  <MateriTopicPage
    title="LKPD HIMPUNAN (PENGAYAAN)"
    emoji="🎯"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
    contextLabel="LKPD"
  />
);

export default HimpunanMenuPage;
