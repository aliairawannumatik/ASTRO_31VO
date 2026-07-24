import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Globe, Youtube } from "lucide-react";

const bukuRefs = [
  "Adinawan, M. C. 2017. Matematika Untuk SMP/MTs Kelas VII Semester 1. Jakarta: Erlangga.",
  "Adinawan, M. C. 2017. Matematika Untuk SMP/MTs Kelas VIII Semester 2. Jakarta: Erlangga.",
  "As'ari A, R, dkk. 2017. Matematika SMP/MTs Kelas VIII Semester I. Edisi Revisi. Jakarta: Kementerian Pendidikan dan Kebudayaan RI.",
  "B.K. Noormandiri. 2018. Matematika untuk SMA/MA Kelas XII Kelompok Wajib. Jakarta: Erlangga.",
  "MKKS SMP/MTs DIY. 2025. Naskah Pemantapan dan Persiapan Tes Kemampuan Akademik (TKA) MKKS SMP/MTs DIY Tahun Pelajaran 2025/2026 Paket A.",
  "Pemerintah Kota Yogyakarta Dinas Pendidikan. 2025. Naskah Persiapan Pemantapan Tes Kemampuan Akademik (TKA) Kota Yogyakarta Tahap 1 Tahun Pelajaran 2025/2026.",
  "Raharjo, M. 2018. Matematika 1 Untuk SMP/MTs Kelas VII. Jakarta: Erlangga.",
  "Raharjo, M dan Setiawan, A. 2019. Matematik 2 untuk SMP/MTS Kelas VIII. Jakarta: Erlangga.",
  "Sukino. 2020. The Great Matematika untuk Siswa SMP-MTs Kelas IX. Kab. Bandung: Srikandi Empat Widya Utama.",
  "Tim Progresif. 2024. MATEMATIKA 1B SEMESTER 1 untuk SMP/MTs Kelas VII (K-MERDEKA). Jakarta: Erlangga.",
];

const internetRefs = [
  { label: "Bing.com/images/create", url: "https://bing.com/images/create", akses: "Januari 2026" },
  { label: "Gemini.google.com/app", url: "https://gemini.google.com/app", akses: "Mei 2026" },
  { label: "Defantri.com/2022/01/pembahasan-garis-sudut-matematika-smp.html", url: "https://defantri.com/2022/01/pembahasan-garis-sudut-matematika-smp.html", akses: "Desember 2025" },
  { label: "Emporioarchitect.com/img/blog/siap-membangun-rumah-ketahui-dulu-masalah-umum-dalam-proses-pembangunan-rumah", url: "https://www.emporioarchitect.com/img/blog/siap-membangun-rumah-ketahui-dulu-masalah-umum-dalam-proses-pembangunan-rumah-dan-solusi-mengatasinya-070222103548184287.jpg", akses: "April 2026" },
  { label: "Imgx.gridoto.com/crop/0x0:0x0/700x0/filters:watermark(file/2017/gridoto", url: "https://imgx.gridoto.com/crop/0x0:0x0/700x0/filters:watermark(file/2017/gridoto/img/watermark.png,5,5,60)/photo/gridoto/2017/10/20/292677212.jpg", akses: "April 2026" },
  { label: "Konsep-matematika.com/2022/07/prinsip-teleskopik-olim-matik-sma.html", url: "https://konsep-matematika.com/2022/07/prinsip-teleskopik-olim-matik-sma.html", akses: "Desember 2025" },
  { label: "M4th-lab.net/2019/09/cara-mudah-memahami-modulo-persiapan.html", url: "https://m4th-lab.net/2019/09/cara-mudah-memahami-modulo-persiapan.html", akses: "November 2025" },
  { label: "Pixabay.com/id/sound-effects/", url: "https://pixabay.com/id/sound-effects/", akses: "April 2026" },
  { label: "Pngtree.com/freepng/3d-sun-full-view_16171547.html", url: "https://pngtree.com/freepng/3d-sun-full-view_16171547.html", akses: "12 Maret 2026" },
  { label: "Pusmendik.kemendikdasmen.go.id/tka/", url: "https://pusmendik.kemendikdasmen.go.id/tka/", akses: "Mei 2026" },
  { label: "Wahyu. 2014. Siap OSN Olimpiade Sains Nasional Matematika SMP 2015. Situbondo : E-book", url: null, akses: "Maret 2026" },
  { label: "Youtube.com/watch?v=PXT5uJP1WwE", url: "https://www.youtube.com/watch?v=PXT5uJP1WwE", akses: "Maret 2026", author: "Nurahman, F.", title: "TEMPLATE GAME INTERAKTIF POWERPOINT #4" },
  { label: "youtube.com/channel/UCC5UkJ8cooLJT5yWRd_naUg", url: "https://www.youtube.com/channel/UCC5UkJ8cooLJT5yWRd_naUg", akses: "Mei 2026", author: "Wandri Math.", title: "MATEMATIKA KELAS 7 - 8 - 9." },
];

const ReferensiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-2xl w-full px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-primary text-glow-cyan mb-8 text-center">
          {t("referensiPage.title")}
        </h1>

        {/* Buku */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="font-display text-base font-bold text-accent">{t("referensiPage.sectionBooks")}</h2>
          </div>
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-5 space-y-4">
            {bukuRefs.map((r, i) => (
              <div key={i} className="flex gap-3 text-sm text-white font-body animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="text-primary font-display font-bold shrink-0">[{i + 1}]</span>
                <p className="leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Internet */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-accent" />
            <h2 className="font-display text-base font-bold text-accent">{t("referensiPage.sectionInternet")}</h2>
          </div>
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-5 space-y-4">
            {internetRefs.map((r, i) => (
              <div key={i} className="flex gap-3 text-sm font-body animate-slide-up" style={{ animationDelay: `${(bukuRefs.length + i) * 0.08}s` }}>
                <span className="text-primary font-display font-bold shrink-0">[{bukuRefs.length + i + 1}]</span>
                <div className="leading-relaxed">
                  {(r as any).author && (
                    <p className="text-white mb-0.5">
                      {(r as any).author}{" "}
                      <span className="italic text-white">{(r as any).title}</span>
                      {" "}
                      <Youtube className="inline w-3.5 h-3.5 text-red-500 mb-0.5" />
                      {" "}
                      <span className="text-white text-xs">YouTube.</span>
                    </p>
                  )}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/80 underline underline-offset-2 break-all transition-colors"
                  >
                    {r.label}
                  </a>
                  <span className="text-white ml-1">({t("referensiPage.accessedOn")} {r.akses})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => navigate("/menu")} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferensiPage;
