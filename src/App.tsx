import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { startGlobalAmbient } from "@/hooks/useAudio";
import { ThemeProvider } from "@/contexts/ThemeContext";
import WelcomePage from "./pages/WelcomePage";
import MenuPage from "./pages/MenuPage";
import PetunjukPage from "./pages/PetunjukPage";
import QuizPage from "./pages/QuizPage";
import ReferensiPage from "./pages/ReferensiPage";
import DonasiPage from "./pages/DonasiPage";
import BiografiPage from "./pages/BiografiPage";
import OlimpiadePage from "./pages/OlimpiadePage";
import OlimpiadeBilanganBulatPage from "./pages/OlimpiadeBilanganBulatPage";
import TKAPage from "./pages/TKAPage";
import PapanPeringkatPage from "./pages/PapanPeringkatPage";
import BankSoalPage from "./pages/BankSoalPage";
import ChatAIPage from "./pages/ChatAIPage";
import PengaturanPage from "./pages/PengaturanPage";
import TentangAplikasiPage from "./pages/TentangAplikasiPage";
import KalkulatorScientificPage from "./pages/KalkulatorScientificPage";
import VideoPembelajaranPage from "./pages/VideoPembelajaranPage";
import NotFound from "./pages/NotFound";

// Latihan Mandiri Pages
import LatihanMandiriPage from "./pages/LatihanMandiriPage";
import LatihanMandiriKelas7Page from "./pages/LatihanMandiriKelas7Page";
import LatihanMandiriKelas8Page from "./pages/LatihanMandiriKelas8Page";
import LatihanMandiriKelas9Page from "./pages/LatihanMandiriKelas9Page";

// Kelas 7 Topic Pages
import BilanganBulatK7Page from "./pages/latihan-mandiri/kelas7/BilanganBulatPage";
import BilanganRasionalK7Page from "./pages/latihan-mandiri/kelas7/BilanganRasionalPage";
import AljabarK7Page from "./pages/latihan-mandiri/kelas7/AljabarPage";
import PLSVPtLSVK7Page from "./pages/latihan-mandiri/kelas7/PLSVPtLSVPage";
import PerbandinganK7Page from "./pages/latihan-mandiri/kelas7/PerbandinganPage";
import PerbandinganUmumK7Page from "./pages/latihan-mandiri/kelas7/perbandingan/PerbandinganUmumPage";
import PerbandinganSenilaiK7Page from "./pages/latihan-mandiri/kelas7/perbandingan/PerbandinganSenilaiPage";
import PerbandinganCampuranK7Page from "./pages/latihan-mandiri/kelas7/perbandingan/PerbandinganCampuranPage";
import PerbandinganSkalaK7Page from "./pages/latihan-mandiri/kelas7/perbandingan/PerbandinganSkalaPage";
import AritmetikaSosialK7Page from "./pages/latihan-mandiri/kelas7/AritmetikaSosialPage";
import GarisDanSudutK7Page from "./pages/latihan-mandiri/kelas7/GarisDanSudutPage";
import SegitigaSegiempatK7Page from "./pages/latihan-mandiri/kelas7/SegitigaSegiempatPage";
import HimpunanK7Page from "./pages/latihan-mandiri/kelas7/HimpunanPage";

// Kelas 8 Topic Pages
import PolaBilanganK8Page from "./pages/latihan-mandiri/kelas8/PolaBilanganPage";
import KoordinatCartesiusK8Page from "./pages/latihan-mandiri/kelas8/KoordinatCartesiusPage";
import RelasiFungsiK8Page from "./pages/latihan-mandiri/kelas8/RelasiFungsiPage";
import SPLDVK8Page from "./pages/latihan-mandiri/kelas8/SPLDVPage";
import PersamaanGarisLurusK8Page from "./pages/latihan-mandiri/kelas8/PersamaanGarisLurusPage";
import TeoremaPythagorasK8Page from "./pages/latihan-mandiri/kelas8/TeoremaPythagorasPage";
import LingkaranK8Page from "./pages/latihan-mandiri/kelas8/LingkaranPage";
import GarisSinggungLingkaranK8Page from "./pages/latihan-mandiri/kelas8/GarisSinggungLingkaranPage";
import BangunRuangSisiDatarK8Page from "./pages/latihan-mandiri/kelas8/BangunRuangSisiDatarPage";

// Kelas 9 Topic Pages
import BilanganBerpangkatK9Page from "./pages/latihan-mandiri/kelas9/BilanganBerpangkatPage";
import KesebangunanKekongruenK9Page from "./pages/latihan-mandiri/kelas9/KesebangunanKekongruenPage";
import TransformasiGeometriK9Page from "./pages/latihan-mandiri/kelas9/TransformasiGeometriPage";
import BangunRuangSisiLengkungK9Page from "./pages/latihan-mandiri/kelas9/BangunRuangSisiLengkungPage";
import StatistikaK9Page from "./pages/latihan-mandiri/kelas9/StatistikaPage";
import PeluangK9Page from "./pages/latihan-mandiri/kelas9/PeluangPage";
import PersamaanKuadratK9Page from "./pages/latihan-mandiri/kelas9/PersamaanKuadratPage";
import FungsiKuadratK9Page from "./pages/latihan-mandiri/kelas9/FungsiKuadratPage";

// Math Game Arena Pages
import MathGameArenaPage from "./pages/MathGameArenaPage";
import MathGameArenaKelas7Page from "./pages/MathGameArenaKelas7Page";
import MathGameArenaKelas8Page from "./pages/MathGameArenaKelas8Page";
import MathGameArenaKelas9Page from "./pages/MathGameArenaKelas9Page";

// Math Game Arena - Kelas 7 Topic Pages
import BilanganBulatMGAK7Page from "./pages/math-game-arena/kelas7/BilanganBulatPage";
import BilanganRasionalMGAK7Page from "./pages/math-game-arena/kelas7/BilanganRasionalPage";
import AljabarMGAK7Page from "./pages/math-game-arena/kelas7/AljabarPage";
import PLSVPtLSVMGAK7Page from "./pages/math-game-arena/kelas7/PLSVPtLSVPage";
import PerbandinganMGAK7Page from "./pages/math-game-arena/kelas7/PerbandinganPage";
import AritmetikaSosialMGAK7Page from "./pages/math-game-arena/kelas7/AritmetikaSosialPage";
import GarisDanSudutMGAK7Page from "./pages/math-game-arena/kelas7/GarisDanSudutPage";
import SegitigaSegiempatMGAK7Page from "./pages/math-game-arena/kelas7/SegitigaSegiempatPage";
import HimpunanMGAK7Page from "./pages/math-game-arena/kelas7/HimpunanPage";

// Math Game Arena - Kelas 8 Topic Pages
import PolaBilanganMGAK8Page from "./pages/math-game-arena/kelas8/PolaBilanganPage";
import KoordinatCartesiusMGAK8Page from "./pages/math-game-arena/kelas8/KoordinatCartesiusPage";
import RelasiFungsiMGAK8Page from "./pages/math-game-arena/kelas8/RelasiFungsiPage";
import SPLDVMGAK8Page from "./pages/math-game-arena/kelas8/SPLDVPage";
import PersamaanGarisLurusMGAK8Page from "./pages/math-game-arena/kelas8/PersamaanGarisLurusPage";
import TeoremaPythagorasMGAK8Page from "./pages/math-game-arena/kelas8/TeoremaPythagorasPage";
import LingkaranMGAK8Page from "./pages/math-game-arena/kelas8/LingkaranPage";
import GarisSinggungLingkaranMGAK8Page from "./pages/math-game-arena/kelas8/GarisSinggungLingkaranPage";
import BangunRuangSisiDatarMGAK8Page from "./pages/math-game-arena/kelas8/BangunRuangSisiDatarPage";
import KubusGamePage from "./pages/math-game-arena/kelas8/KubusGamePage";

// Math Game Arena - Kelas 9 Topic Pages
import BilanganBerpangkatMGAK9Page from "./pages/math-game-arena/kelas9/BilanganBerpangkatPage";
import KesebangunanKekongruenMGAK9Page from "./pages/math-game-arena/kelas9/KesebangunanKekongruenPage";
import TransformasiGeometriMGAK9Page from "./pages/math-game-arena/kelas9/TransformasiGeometriPage";
import BangunRuangSisiLengkungMGAK9Page from "./pages/math-game-arena/kelas9/BangunRuangSisiLengkungPage";
import StatistikaMGAK9Page from "./pages/math-game-arena/kelas9/StatistikaPage";
import PeluangMGAK9Page from "./pages/math-game-arena/kelas9/PeluangPage";
import PersamaanKuadratMGAK9Page from "./pages/math-game-arena/kelas9/PersamaanKuadratPage";
import FungsiKuadratMGAK9Page from "./pages/math-game-arena/kelas9/FungsiKuadratPage";

// Materi Matematika Pages
import MateriMatematikaPage from "./pages/MateriMatematikaPage";
import MateriMatematikaKelas7Page from "./pages/MateriMatematikaKelas7Page";
import MateriMatematikaKelas8Page from "./pages/MateriMatematikaKelas8Page";
import MateriMatematikaKelas9Page from "./pages/MateriMatematikaKelas9Page";

// Materi Matematika - Kelas 7 Topic Pages
import BilanganBulatMMK7Page from "./pages/materi-matematika/kelas7/BilanganBulatPage";
import BilanganRasionalMMK7Page from "./pages/materi-matematika/kelas7/BilanganRasionalPage";
import AljabarMMK7Page from "./pages/materi-matematika/kelas7/AljabarPage";
import PLSVPtLSVMMK7Page from "./pages/materi-matematika/kelas7/PLSVPtLSVPage";
import PerbandinganMMK7Page from "./pages/materi-matematika/kelas7/PerbandinganPage";
import AritmetikaSosialMMK7Page from "./pages/materi-matematika/kelas7/AritmetikaSosialPage";
import GarisDanSudutMMK7Page from "./pages/materi-matematika/kelas7/GarisDanSudutPage";
import SegitigaSegiempatMMK7Page from "./pages/materi-matematika/kelas7/SegitigaSegiempatPage";
import HimpunanMMK7Page from "./pages/materi-matematika/kelas7/HimpunanPage";

// Materi Matematika - Kelas 8 Topic Pages
import PolaBilanganMMK8Page from "./pages/materi-matematika/kelas8/PolaBilanganPage";
import KoordinatCartesiusMMK8Page from "./pages/materi-matematika/kelas8/KoordinatCartesiusPage";
import RelasiFungsiMMK8Page from "./pages/materi-matematika/kelas8/RelasiFungsiPage";
import SPLDVMMK8Page from "./pages/materi-matematika/kelas8/SPLDVPage";
import PersamaanGarisLurusMMK8Page from "./pages/materi-matematika/kelas8/PersamaanGarisLurusPage";
import TeoremaPythagorasMMK8Page from "./pages/materi-matematika/kelas8/TeoremaPythagorasPage";
import LingkaranMMK8Page from "./pages/materi-matematika/kelas8/LingkaranPage";
import GarisSinggungLingkaranMMK8Page from "./pages/materi-matematika/kelas8/GarisSinggungLingkaranPage";
import BangunRuangSisiDatarMMK8Page from "./pages/materi-matematika/kelas8/BangunRuangSisiDatarPage";

// Materi Matematika - Kelas 9 Topic Pages
import BilanganBerpangkatMMK9Page from "./pages/materi-matematika/kelas9/BilanganBerpangkatPage";
import KesebangunanKekongruenMMK9Page from "./pages/materi-matematika/kelas9/KesebangunanKekongruenPage";
import TransformasiGeometriMMK9Page from "./pages/materi-matematika/kelas9/TransformasiGeometriPage";
import BangunRuangSisiLengkungMMK9Page from "./pages/materi-matematika/kelas9/BangunRuangSisiLengkungPage";
import StatistikaMMK9Page from "./pages/materi-matematika/kelas9/StatistikaPage";
import PeluangMMK9Page from "./pages/materi-matematika/kelas9/PeluangPage";
import PersamaanKuadratMMK9Page from "./pages/materi-matematika/kelas9/PersamaanKuadratPage";
import FungsiKuadratMMK9Page from "./pages/materi-matematika/kelas9/FungsiKuadratPage";

const queryClient = new QueryClient();

const AppInner = () => {
  useEffect(() => {
    const handleInteraction = () => {
      startGlobalAmbient();
      window.removeEventListener("click", handleInteraction);
    };
    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/petunjuk" element={<PetunjukPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/referensi" element={<ReferensiPage />} />
      <Route path="/kalkulator-scientific" element={<KalkulatorScientificPage />} />
      <Route path="/video-pembelajaran" element={<VideoPembelajaranPage />} />
      <Route path="/donasi" element={<DonasiPage />} />
      <Route path="/biografi" element={<BiografiPage />} />
      <Route path="/olimpiade" element={<OlimpiadePage />} />
      <Route path="/olimpiade/bilangan-bulat" element={<OlimpiadeBilanganBulatPage />} />
      <Route path="/tka" element={<TKAPage />} />
      <Route path="/papan-peringkat" element={<PapanPeringkatPage />} />
      <Route path="/bank-soal" element={<BankSoalPage />} />
      <Route path="/chat-ai" element={<ChatAIPage />} />
      <Route path="/pengaturan" element={<PengaturanPage />} />
      <Route path="/tentang-aplikasi" element={<TentangAplikasiPage />} />
      
      {/* Latihan Mandiri Routes */}
      <Route path="/latihan-mandiri" element={<LatihanMandiriPage />} />
      <Route path="/latihan-mandiri/kelas-7" element={<LatihanMandiriKelas7Page />} />
      <Route path="/latihan-mandiri/kelas-8" element={<LatihanMandiriKelas8Page />} />
      <Route path="/latihan-mandiri/kelas-9" element={<LatihanMandiriKelas9Page />} />
      
      {/* Kelas 7 Topic Routes */}
      <Route path="/latihan-mandiri/kelas-7/bilangan-bulat" element={<BilanganBulatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional" element={<BilanganRasionalK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aljabar" element={<AljabarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/plsv-ptlsv" element={<PLSVPtLSVK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan" element={<PerbandinganK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan/umum" element={<PerbandinganUmumK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan/senilai" element={<PerbandinganSenilaiK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan/campuran" element={<PerbandinganCampuranK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan/skala" element={<PerbandinganSkalaK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aritmetika-sosial" element={<AritmetikaSosialK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/garis-dan-sudut" element={<GarisDanSudutK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/segitiga-dan-segiempat" element={<SegitigaSegiempatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/himpunan" element={<HimpunanK7Page />} />
      
      {/* Kelas 8 Topic Routes */}
      <Route path="/latihan-mandiri/kelas-8/pola-bilangan" element={<PolaBilanganK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/koordinat-cartesius" element={<KoordinatCartesiusK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/relasi-dan-fungsi" element={<RelasiFungsiK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/spldv" element={<SPLDVK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/persamaan-garis-lurus" element={<PersamaanGarisLurusK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/teorema-pythagoras" element={<TeoremaPythagorasK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/lingkaran" element={<LingkaranK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/garis-singgung-lingkaran" element={<GarisSinggungLingkaranK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar" element={<BangunRuangSisiDatarK8Page />} />
      
      {/* Kelas 9 Topic Routes */}
      <Route path="/latihan-mandiri/kelas-9/bilangan-berpangkat" element={<BilanganBerpangkatK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/kesebangunan-kekongruenan" element={<KesebangunanKekongruenK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/transformasi-geometri" element={<TransformasiGeometriK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung" element={<BangunRuangSisiLengkungK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/statistika" element={<StatistikaK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/peluang" element={<PeluangK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/persamaan-kuadrat" element={<PersamaanKuadratK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/fungsi-kuadrat" element={<FungsiKuadratK9Page />} />
      
      {/* Math Game Arena Routes */}
      <Route path="/math-game-arena" element={<MathGameArenaPage />} />
      <Route path="/math-game-arena/kelas-7" element={<MathGameArenaKelas7Page />} />
      <Route path="/math-game-arena/kelas-8" element={<MathGameArenaKelas8Page />} />
      <Route path="/math-game-arena/kelas-9" element={<MathGameArenaKelas9Page />} />
      
      {/* Math Game Arena - Kelas 7 Topic Routes */}
      <Route path="/math-game-arena/kelas-7/bilangan-bulat" element={<BilanganBulatMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional" element={<BilanganRasionalMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/aljabar" element={<AljabarMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/plsv-ptlsv" element={<PLSVPtLSVMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/perbandingan" element={<PerbandinganMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/aritmetika-sosial" element={<AritmetikaSosialMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/garis-dan-sudut" element={<GarisDanSudutMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/segitiga-dan-segiempat" element={<SegitigaSegiempatMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/himpunan" element={<HimpunanMGAK7Page />} />
      
      {/* Math Game Arena - Kelas 8 Topic Routes */}
      <Route path="/math-game-arena/kelas-8/pola-bilangan" element={<PolaBilanganMGAK8Page />} />
      <Route path="/math-game-arena/kelas-8/koordinat-cartesius" element={<KoordinatCartesiusMGAK8Page />} />
      <Route path="/math-game-arena/kelas-8/relasi-dan-fungsi" element={<RelasiFungsiMGAK8Page />} />
      <Route path="/math-game-arena/kelas-8/spldv" element={<SPLDVMGAK8Page />} />
      <Route path="/math-game-arena/kelas-8/persamaan-garis-lurus" element={<PersamaanGarisLurusMGAK8Page />} />
      <Route path="/math-game-arena/kelas-8/teorema-pythagoras" element={<TeoremaPythagorasMGAK8Page />} />
      <Route path="/math-game-arena/kelas-8/lingkaran" element={<LingkaranMGAK8Page />} />
      <Route path="/math-game-arena/kelas-8/garis-singgung-lingkaran" element={<GarisSinggungLingkaranMGAK8Page />} />
      <Route path="/math-game-arena/kelas-8/bangun-ruang-sisi-datar" element={<BangunRuangSisiDatarMGAK8Page />} />
      <Route path="/math-game-arena/kelas-8/bangun-ruang-sisi-datar/kubus-game" element={<KubusGamePage />} />
      
      {/* Math Game Arena - Kelas 9 Topic Routes */}
      <Route path="/math-game-arena/kelas-9/bilangan-berpangkat" element={<BilanganBerpangkatMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/kesebangunan-kekongruenan" element={<KesebangunanKekongruenMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/transformasi-geometri" element={<TransformasiGeometriMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung" element={<BangunRuangSisiLengkungMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/statistika" element={<StatistikaMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/peluang" element={<PeluangMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/persamaan-kuadrat" element={<PersamaanKuadratMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/fungsi-kuadrat" element={<FungsiKuadratMGAK9Page />} />
      
      {/* Materi Matematika Routes */}
      <Route path="/materi-matematika" element={<MateriMatematikaPage />} />
      <Route path="/materi-matematika/kelas-7" element={<MateriMatematikaKelas7Page />} />
      <Route path="/materi-matematika/kelas-8" element={<MateriMatematikaKelas8Page />} />
      <Route path="/materi-matematika/kelas-9" element={<MateriMatematikaKelas9Page />} />
      
      {/* Materi Matematika - Kelas 7 Topic Routes */}
      <Route path="/materi-matematika/kelas-7/bilangan-bulat" element={<BilanganBulatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional" element={<BilanganRasionalMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aljabar" element={<AljabarMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/plsv-ptlsv" element={<PLSVPtLSVMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/perbandingan" element={<PerbandinganMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aritmetika-sosial" element={<AritmetikaSosialMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/garis-dan-sudut" element={<GarisDanSudutMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/segitiga-dan-segiempat" element={<SegitigaSegiempatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/himpunan" element={<HimpunanMMK7Page />} />
      
      {/* Materi Matematika - Kelas 8 Topic Routes */}
      <Route path="/materi-matematika/kelas-8/pola-bilangan" element={<PolaBilanganMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/koordinat-cartesius" element={<KoordinatCartesiusMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/relasi-dan-fungsi" element={<RelasiFungsiMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/spldv" element={<SPLDVMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/persamaan-garis-lurus" element={<PersamaanGarisLurusMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/teorema-pythagoras" element={<TeoremaPythagorasMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/lingkaran" element={<LingkaranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/garis-singgung-lingkaran" element={<GarisSinggungLingkaranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/bangun-ruang-sisi-datar" element={<BangunRuangSisiDatarMMK8Page />} />
      
      {/* Materi Matematika - Kelas 9 Topic Routes */}
      <Route path="/materi-matematika/kelas-9/bilangan-berpangkat" element={<BilanganBerpangkatMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/kesebangunan-kekongruenan" element={<KesebangunanKekongruenMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/transformasi-geometri" element={<TransformasiGeometriMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung" element={<BangunRuangSisiLengkungMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/statistika" element={<StatistikaMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/peluang" element={<PeluangMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/persamaan-kuadrat" element={<PersamaanKuadratMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/fungsi-kuadrat" element={<FungsiKuadratMMK9Page />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
