import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { startGlobalAmbient } from "@/hooks/useAudio";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SoundProvider } from "@/contexts/SoundContext";
import { MusicProvider } from "@/contexts/MusicContext";
import { FontProvider } from "@/contexts/FontContext";
import WelcomePage from "./pages/WelcomePage";
import MenuPage from "./pages/MenuPage";
import LKPDPage from "./pages/LKPDPage";
import LKPDMenuPage from "./pages/LKPDMenuPage";
import { LKPDKelas7Page, LKPDKelas8Page, LKPDKelas9Page } from "./pages/LKPDKelasPage";
import LKPDPerbandinganPage from "./pages/LKPDPerbandinganPage";
import BertingkatLKPDPage from "./pages/lkpd/kelas7/perbandingan/BertingkatLKPDPage";
import SenilaiLKPDPage from "./pages/lkpd/kelas7/perbandingan/SenilaiLKPDPage";
import SkalaLKPDPage from "./pages/lkpd/kelas7/perbandingan/SkalaLKPDPage";
import CampuranLKPDPage from "./pages/lkpd/kelas7/perbandingan/CampuranLKPDPage";
import BilanganBulatMenuPage from "./pages/lkpd/kelas7/BilanganBulatMenuPage";
import PenjumlahanLKPDPage from "./pages/lkpd/kelas7/bilangan-bulat/PenjumlahanLKPDPage";
import PesawatTembakMeteorPage from "./pages/lkpd/kelas7/bilangan-bulat/PesawatTembakMeteorPage";
import PesawatTembakMeteorPenjumlahanPage from "./pages/lkpd/kelas7/bilangan-bulat/PesawatTembakMeteorPenjumlahanPage";
import PenguranganLKPDPage from "./pages/lkpd/kelas7/bilangan-bulat/PenguranganLKPDPage";
import PerkalianLKPDPage from "./pages/lkpd/kelas7/bilangan-bulat/PerkalianLKPDPage";
import PembagianLKPDPage from "./pages/lkpd/kelas7/bilangan-bulat/PembagianLKPDPage";
import OperasiCampuranLKPDPage from "./pages/lkpd/kelas7/bilangan-bulat/OperasiCampuranLKPDPage";
import KPKFPBLKPDPage from "./pages/lkpd/kelas7/bilangan-bulat/KPKFPBLKPDPage";
import BilanganRasionalMenuPage from "./pages/lkpd/kelas7/BilanganRasionalMenuPage";
import ArtiPecahanLKPDPage from "./pages/lkpd/kelas7/bilangan-rasional/ArtiPecahanLKPDPage";
import AljabarMenuPage from "./pages/lkpd/kelas7/AljabarMenuPage";
import PengertianUnsurAljabarLKPDPage from "./pages/lkpd/kelas7/aljabar/PengertianUnsurAljabarLKPDPage";
import PenjumlahanPenguranganAljabarLKPDPage from "./pages/lkpd/kelas7/aljabar/PenjumlahanPenguranganAljabarLKPDPage";
import PerkalianPembagianAljabarLKPDPage from "./pages/lkpd/kelas7/aljabar/PerkalianPembagianAljabarLKPDPage";
import SubstitusiAljabarLKPDPage from "./pages/lkpd/kelas7/aljabar/SubstitusiAljabarLKPDPage";
import FaktorisasiAljabarLKPDPage from "./pages/lkpd/kelas7/aljabar/FaktorisasiAljabarLKPDPage";
import AritmetikaSosialMenuPage from "./pages/lkpd/kelas7/AritmetikaSosialMenuPage";
import JualBeliUntungRugiLKPDPage from "./pages/lkpd/kelas7/aritmetika-sosial/JualBeliUntungRugiLKPDPage";
import DiskonLKPDPage from "./pages/lkpd/kelas7/aritmetika-sosial/DiskonLKPDPage";
import BrutoNettoTaraLKPDPage from "./pages/lkpd/kelas7/aritmetika-sosial/BrutoNettoTaraLKPDPage";
import BungaTunggalLKPDPage from "./pages/lkpd/kelas7/aritmetika-sosial/BungaTunggalLKPDPage";
import GarisDanSudutLKPDPage from "./pages/lkpd/kelas7/garis-sudut/GarisDanSudutLKPDPage";
import SegitigaDanSegiempatLKPDPage from "./pages/lkpd/kelas7/segitiga-segiempat/SegitigaDanSegiempatLKPDPage";
import HimpunanLKPDPage from "./pages/lkpd/kelas7/himpunan/HimpunanLKPDPage";
import HimpunanMenuPage from "./pages/lkpd/kelas7/HimpunanMenuPage";
import GarisDanSudutMenuPage from "./pages/lkpd/kelas7/GarisDanSudutMenuPage";
import SegitigaDanSegiempatMenuPage from "./pages/lkpd/kelas7/SegitigaDanSegiempatMenuPage";
import PolaBilanganLKPDPage from "./pages/lkpd/kelas8/pola-bilangan/PolaBilanganLKPDPage";
import PolaBilanganMenuPage from "./pages/lkpd/kelas8/PolaBilanganMenuPage";
import KoordinatCartesiusLKPDMenuPage from "./pages/lkpd/kelas8/KoordinatCartesiusMenuPage";
import KoordinatCartesiusLKPDPage from "./pages/lkpd/kelas8/koordinat-cartesius/KoordinatCartesiusLKPDPage";
import RelasiFungsiLKPDMenuPage from "./pages/lkpd/kelas8/RelasiFungsiMenuPage";
import RelasiFungsiLKPDPage from "./pages/lkpd/kelas8/relasi-fungsi/RelasiFungsiLKPDPage";
import SPLDVLKPDMenuPage from "./pages/lkpd/kelas8/SPLDVMenuPage";
import SPLDVLKPDPage from "./pages/lkpd/kelas8/spldv/SPLDVLKPDPage";
import PersamaanGarisLurusLKPDMenuPage from "./pages/lkpd/kelas8/PersamaanGarisLurusMenuPage";
import PersamaanGarisLurusLKPDPage from "./pages/lkpd/kelas8/persamaan-garis-lurus/PersamaanGarisLurusLKPDPage";
import TeoremaPythagorasLKPDMenuPage from "./pages/lkpd/kelas8/TeoremaPythagorasMenuPage";
import TeoremaPythagorasLKPDPage from "./pages/lkpd/kelas8/teorema-pythagoras/TeoremaPythagorasLKPDPage";
import LingkaranLKPDMenuPage from "./pages/lkpd/kelas8/LingkaranMenuPage";
import LingkaranLKPDPage from "./pages/lkpd/kelas8/lingkaran/LingkaranLKPDPage";
import GarisSinggungLingkaranLKPDMenuPage from "./pages/lkpd/kelas8/GarisSinggungLingkaranMenuPage";
import BangunRuangSisiDatarLKPDMenuPage from "./pages/lkpd/kelas8/BangunRuangSisiDatarMenuPage";
import BilanganBerpangkatLKPDMenuPage from "./pages/lkpd/kelas9/BilanganBerpangkatMenuPage";
import KesebangunanKekongruenanLKPDMenuPage from "./pages/lkpd/kelas9/KesebangunanKekongruenanMenuPage";
import TransformasiGeometriLKPDMenuPage from "./pages/lkpd/kelas9/TransformasiGeometriMenuPage";
import BangunRuangSisiLengkungLKPDMenuPage from "./pages/lkpd/kelas9/BangunRuangSisiLengkungMenuPage";
import StatistikaLKPDMenuPage from "./pages/lkpd/kelas9/StatistikaMenuPage";
import PeluangLKPDMenuPage from "./pages/lkpd/kelas9/PeluangMenuPage";
import PersamaanKuadratLKPDMenuPage from "./pages/lkpd/kelas9/PersamaanKuadratMenuPage";
import FungsiKuadratLKPDMenuPage from "./pages/lkpd/kelas9/FungsiKuadratMenuPage";
import PPNLKPDPage from "./pages/lkpd/kelas7/aritmetika-sosial/PPNLKPDPage";
import PPhLKPDPage from "./pages/lkpd/kelas7/aritmetika-sosial/PPhLKPDPage";
import PecahanCampuranLKPDPage from "./pages/lkpd/kelas7/bilangan-rasional/PecahanCampuranLKPDPage";
import PenjumlahanPenguranganPecahanLKPDPage from "./pages/lkpd/kelas7/bilangan-rasional/PenjumlahanPenguranganPecahanLKPDPage";
import PerkalianPecahanLKPDPage from "./pages/lkpd/kelas7/bilangan-rasional/PerkalianPecahanLKPDPage";
import PembagianPecahanLKPDPage from "./pages/lkpd/kelas7/bilangan-rasional/PembagianPecahanLKPDPage";
import BentukDesimalLKPDPage from "./pages/lkpd/kelas7/bilangan-rasional/BentukDesimalLKPDPage";
import OperasiDesimalLKPDPage from "./pages/lkpd/kelas7/bilangan-rasional/OperasiDesimalLKPDPage";
import PLSVPtLSVMenuPage from "./pages/lkpd/kelas7/PLSVPtLSVMenuPage";
import KalimatTerbukaTertutupLKPDPage from "./pages/lkpd/kelas7/plsv-ptlsv/KalimatTerbukaTertutupLKPDPage";
import PengertianPLSVLKPDPage from "./pages/lkpd/kelas7/plsv-ptlsv/PengertianPLSVLKPDPage";
import PenyelesaianPLSVLKPDPage from "./pages/lkpd/kelas7/plsv-ptlsv/PenyelesaianPLSVLKPDPage";
import ModelMatematikaPLSVLKPDPage from "./pages/lkpd/kelas7/plsv-ptlsv/ModelMatematikaPLSVLKPDPage";
import PengertianPtLSVLKPDPage from "./pages/lkpd/kelas7/plsv-ptlsv/PengertianPtLSVLKPDPage";
import PenyelesaianPtLSVLKPDPage from "./pages/lkpd/kelas7/plsv-ptlsv/PenyelesaianPtLSVLKPDPage";
import ModelMatematikaPtLSVLKPDPage from "./pages/lkpd/kelas7/plsv-ptlsv/ModelMatematikaPtLSVLKPDPage";
import ATPPage from "./pages/ATPPage";
import RuangUntukGuruPage from "./pages/RuangUntukGuruPage";
import NumatikGamePage from "./pages/ruang-untuk-guru/NumatikGamePage";
import KeyakinanKelasPage from "./pages/ruang-untuk-guru/KeyakinanKelasPage";
import PenilaianPembelajaranPage from "./pages/ruang-untuk-guru/PenilaianPembelajaranPage";
import RPPPage from "./pages/ruang-untuk-guru/RPPPage";
import RPPBilanganBulatPage from "./pages/ruang-untuk-guru/RPPBilanganBulatPage";
import RPPPenjumlahanBilanganBulatPage from "./pages/ruang-untuk-guru/RPPPenjumlahanBilanganBulatPage";
import UlanganHarianPage from "./pages/UlanganHarianPage";
import PesanKesanPage from "./pages/PesanKesanPage";
import PetunjukPage from "./pages/PetunjukPage";
import QuizPage from "./pages/QuizPage";
import ReferensiPage from "./pages/ReferensiPage";
import DonasiPage from "./pages/DonasiPage";
import BiografiPage from "./pages/BiografiPage";
import OlimpiadePage from "./pages/OlimpiadePage";
import OlimpiadeBilanganBulatPage from "./pages/OlimpiadeBilanganBulatPage";
import OlimpiadeBilanganRasionalPage from "./pages/OlimpiadeBilanganRasionalPage";
import OlimpiadeBilanganBerpangkatPage from "./pages/OlimpiadeBilanganBerpangkatPage";
import OlimpiadeStatistikaPage from "./pages/OlimpiadeStatistikaPage";
import OlimpiadeBilanganIrasionalPage from "./pages/OlimpiadeBilanganIrasionalPage";
import OlimpiadeKPKFPBPage from "./pages/OlimpiadeKPKFPBPage";
import OlimpiadeModuloPage from "./pages/OlimpiadeModuloPage";
import OlimpiadeHimpunanPage from "./pages/OlimpiadeHimpunanPage";
import OlimpiadeRelasiFungsiPage from "./pages/OlimpiadeRelasiFungsiPage";
import OlimpiadePerbandinganPage from "./pages/OlimpiadePerbandinganPage";
import OlimpiadeAljabarPage from "./pages/OlimpiadeAljabarPage";
import OlimpiadePolaBilanganPage from "./pages/OlimpiadePolaBilanganPage";
import OlimpiadeSPLDVPage from "./pages/OlimpiadeSPLDVPage";
import OlimpiadeGarisSudutPage from "./pages/OlimpiadeGarisSudutPage";
import OlimpiadeKoordinatCartesiusPage from "./pages/OlimpiadeKoordinatCartesiusPage";
import OlimpiadeTeoremaPage from "./pages/OlimpiadeTeoremaPage";
import OlimpiadeSegitigaSegiempatPage from "./pages/OlimpiadeSegitigaSegiempatPage";
import OlimpiadeLingkaranPage from "./pages/OlimpiadeLingkaranPage";
import OlimpiadeBangunRuangSisiDatarPage from "./pages/OlimpiadeBangunRuangSisiDatarPage";
import OlimpiadeBangunRuangSisiLengkungPage from "./pages/OlimpiadeBangunRuangSisiLengkungPage";
import OlimpiadePLSVPage from "./pages/OlimpiadePLSVPage";
import OlimpiadePersamaanGarisPage from "./pages/OlimpiadePersamaanGarisPage";
import OlimpiadePersamaanKuadratPage from "./pages/OlimpiadePersamaanKuadratPage";
import OlimpiadeFungsiKuadratPage from "./pages/OlimpiadeFungsiKuadratPage";
import OlimpiadeAritmetikaSosialPage from "./pages/OlimpiadeAritmetikaSosialPage";
import OlimpiadeKesebangunanPage from "./pages/OlimpiadeKesebangunanPage";
import OlimpiadeTransformasiPage from "./pages/OlimpiadeTransformasiPage";
import OlimpiadePeluangPage from "./pages/OlimpiadePeluangPage";
import TKAPage from "./pages/TKAPage";
import TKALatihan1Page from "./pages/tka/TKALatihan1Page";
import TKALatihan2Page from "./pages/tka/TKALatihan2Page";
import TKALatihan3Page from "./pages/tka/TKALatihan3Page";
import TKALatihan4Page from "./pages/tka/TKALatihan4Page";
import TKALatihan5Page from "./pages/tka/TKALatihan5Page";
import TKATipsPage from "./pages/tka/TKATipsPage";
import PapanPeringkatPage from "./pages/PapanPeringkatPage";
import BankSoalPage from "./pages/BankSoalPage";
import BankSoalBilanganBulatPage from "./pages/bank-soal/BilanganBulatPage";
import BankSoalBilanganRasionalPage from "./pages/bank-soal/BilanganRasionalPage";
import BankSoalSegitigaSegiempatPage from "./pages/bank-soal/SegitigaSegiempatPage";
import BankSoalHimpunanPage from "./pages/bank-soal/HimpunanPage";
import BankSoalKoordinatCartesiusPage from "./pages/bank-soal/KoordinatCartesiusPage";
import BankSoalAljabarPage from "./pages/bank-soal/AljabarPage";
import BankSoalPLSVPage from "./pages/bank-soal/PLSVPage";
import BankSoalPerbandinganPage from "./pages/bank-soal/PerbandinganPage";
import BankSoalAritmetikaSosialPage from "./pages/bank-soal/AritmetikaSosialPage";
import BankSoalPolaBilanganPage from "./pages/bank-soal/PolaBilanganPage";
import BankSoalRelasiFungsiPage from "./pages/bank-soal/RelasiFungsiPage";
import BankSoalGarisSudutPage from "./pages/bank-soal/GarisSudutPage";
import BankSoalSPLDVPage from "./pages/bank-soal/SPLDVPage";
import BankSoalPersamaanGarisLurusPage from "./pages/bank-soal/PersamaanGarisLurusPage";
import BankSoalPeluangPage from "./pages/bank-soal/PeluangPage";
import BankSoalTeoremaPythagorasPage from "./pages/bank-soal/TeoremaPythagorasPage";
import BankSoalLingkaranPage from "./pages/bank-soal/LingkaranPage";
import BankSoalBangunRuangSisiDatarPage from "./pages/bank-soal/BangunRuangSisiDatarPage";
import BankSoalBangunRuangSisiLengkungPage from "./pages/bank-soal/BangunRuangSisiLengkungPage";
import BankSoalBilanganBerpangkatPage from "./pages/bank-soal/BilanganBerpangkatPage";
import BankSoalPersamaanKuadratPage from "./pages/bank-soal/PersamaanKuadratPage";
import BankSoalFungsiKuadratPage from "./pages/bank-soal/FungsiKuadratPage";
import BankSoalStatistikaPage from "./pages/bank-soal/StatistikaPage";
import BankSoalGarisSinggungLingkaranPage from "./pages/bank-soal/GarisSinggungLingkaranPage";
import BankSoalKesebangunanPage from "./pages/bank-soal/KesebangunanPage";
import BankSoalTransformasiGeometriPage from "./pages/bank-soal/TransformasiGeometriPage";
import ChatAIPage from "./pages/ChatAIPage";
import PengaturanPage from "./pages/PengaturanPage";
import TentangAplikasiPage from "./pages/TentangAplikasiPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import KalkulatorScientificPage from "./pages/KalkulatorScientificPage";
import VideoPembelajaranPage from "./pages/VideoPembelajaranPage";
import KumpulanRumusPage from "./pages/KumpulanRumusPage";
import KonversiSatuanPage from "./pages/KonversiSatuanPage";
import NotFound from "./pages/NotFound";
import MenghitungCepatPage from "./pages/MenghitungCepatPage";
import PerkalianDengan11Page from "./pages/menghitung-cepat/PerkalianDengan11Page";
import KuadratBerakhiran5Page from "./pages/menghitung-cepat/KuadratBerakhiran5Page";
import KuadratCepatPage from "./pages/menghitung-cepat/KuadratCepatPage";
import PerkalianDekat100Page from "./pages/menghitung-cepat/PerkalianDekat100Page";
import PersentaseCepatPage from "./pages/menghitung-cepat/PersentaseCepatPage";
import PenjumlahanPenguranganCepatPage from "./pages/menghitung-cepat/PenjumlahanPenguranganPage";
import PerkalianDuaDigitPage from "./pages/menghitung-cepat/PerkalianDuaDigitPage";
import PembagianCepatPage from "./pages/menghitung-cepat/PembagianCepatPage";
import TabelReferensiPage from "./pages/menghitung-cepat/TabelReferensiPage";
import LatihanFlashcardPage from "./pages/menghitung-cepat/LatihanFlashcardPage";

// Latihan Mandiri Pages
import LatihanMandiriPage from "./pages/LatihanMandiriPage";
import LatihanMandiriKelas7Page from "./pages/LatihanMandiriKelas7Page";
import LatihanMandiriKelas8Page from "./pages/LatihanMandiriKelas8Page";
import LatihanMandiriKelas9Page from "./pages/LatihanMandiriKelas9Page";

// Kelas 7 Topic Pages
import BilanganBulatK7Page from "./pages/latihan-mandiri/kelas7/BilanganBulatPage";
import PenjumlahanBilanganBulatK7Page from "./pages/latihan-mandiri/kelas7/bilangan-bulat/PenjumlahanPage";
import PenguranganBilanganBulatK7Page from "./pages/latihan-mandiri/kelas7/bilangan-bulat/PenguranganPage";
import PerkalianBilanganBulatK7Page from "./pages/latihan-mandiri/kelas7/bilangan-bulat/PerkalianPage";
import PembagianBilanganBulatK7Page from "./pages/latihan-mandiri/kelas7/bilangan-bulat/PembagianPage";
import OperasiCampuranBilanganBulatK7Page from "./pages/latihan-mandiri/kelas7/bilangan-bulat/OperasiCampuranPage";
import KPKFPBBilanganBulatK7Page from "./pages/latihan-mandiri/kelas7/bilangan-bulat/KPKFPBPage";
import BilanganRasionalK7Page from "./pages/latihan-mandiri/kelas7/BilanganRasionalPage";
import ArtiPecahanSenilaiMembandingkanK7Page from "./pages/latihan-mandiri/kelas7/pecahan/ArtiPecahanSenilaiMembandingkanPage";
import PecahanCampuranPersenK7Page from "./pages/latihan-mandiri/kelas7/pecahan/PecahanCampuranPersenPage";
import PenjumlahanPecahanK7Page from "./pages/latihan-mandiri/kelas7/pecahan/PenjumlahanPecahanPage";
import PerkalianPecahanK7Page from "./pages/latihan-mandiri/kelas7/pecahan/PerkalianPecahanPage";
import PembagianPecahanK7Page from "./pages/latihan-mandiri/kelas7/pecahan/PembagianPecahanPage";
import BentukDesimalK7Page from "./pages/latihan-mandiri/kelas7/pecahan/BentukDesimalPage";
import PenjumlahanPenguranganDesimalK7Page from "./pages/latihan-mandiri/kelas7/pecahan/PenjumlahanPenguranganDesimalPage";
import PerkalianDesimalK7Page from "./pages/latihan-mandiri/kelas7/pecahan/PerkalianDesimalPage";
import PembagianDesimalK7Page from "./pages/latihan-mandiri/kelas7/pecahan/PembagianDesimalPage";
import PembulatanDesimalK7Page from "./pages/latihan-mandiri/kelas7/pecahan/PembulatanDesimalPage";
import PengertianUnsurAljabarK7Page from "./pages/latihan-mandiri/kelas7/aljabar/PengertianUnsurAljabarPage";
import PenjumlahanPenguranganAljabarK7Page from "./pages/latihan-mandiri/kelas7/aljabar/PenjumlahanPenguranganAljabarPage";
import PerkalianAljabarK7Page from "./pages/latihan-mandiri/kelas7/aljabar/PerkalianAljabarPage";
import PembagianAljabarK7Page from "./pages/latihan-mandiri/kelas7/aljabar/PembagianAljabarPage";
import PemangkatanAljabarK7Page from "./pages/latihan-mandiri/kelas7/aljabar/PemangkatanAljabarPage";
import SubstitusiBilanganAljabarK7Page from "./pages/latihan-mandiri/kelas7/aljabar/SubstitusiBilanganAljabarPage";
import FaktorisasiAljabarK7Page from "./pages/latihan-mandiri/kelas7/aljabar/FaktorisasiAljabarPage";
import MenyederhanakanPecahanAljabarK7Page from "./pages/latihan-mandiri/kelas7/aljabar/MenyederhanakanPecahanAljabarPage";
import AljabarK7Page from "./pages/latihan-mandiri/kelas7/AljabarPage";
import PLSVPtLSVK7Page from "./pages/latihan-mandiri/kelas7/PLSVPtLSVPage";
import KalimatTerbukaTertutupK7Page from "./pages/latihan-mandiri/kelas7/plsv-ptlsv/KalimatTerbukaTertutupPage";
import PengertianPLSVK7Page from "./pages/latihan-mandiri/kelas7/plsv-ptlsv/PengertianPLSVPage";
import PenyelesaianPLSVK7Page from "./pages/latihan-mandiri/kelas7/plsv-ptlsv/PenyelesaianPLSVPage";
import ModelMatematikaPLSVK7Page from "./pages/latihan-mandiri/kelas7/plsv-ptlsv/ModelMatematikaPLSVPage";
import PenyelesaianPtLSVK7Page from "./pages/latihan-mandiri/kelas7/plsv-ptlsv/PenyelesaianPtLSVPage";
import ModelMatematikaPtLSVK7Page from "./pages/latihan-mandiri/kelas7/plsv-ptlsv/ModelMatematikaPtLSVPage";
import PerbandinganK7Page from "./pages/latihan-mandiri/kelas7/PerbandinganPage";
import PerbandinganUmumK7Page from "./pages/latihan-mandiri/kelas7/perbandingan/PerbandinganUmumPage";
import PerbandinganSenilaiK7Page from "./pages/latihan-mandiri/kelas7/perbandingan/PerbandinganSenilaiPage";
import PerbandinganCampuranK7Page from "./pages/latihan-mandiri/kelas7/perbandingan/PerbandinganCampuranPage";
import PerbandinganBertingkatK7Page from "./pages/latihan-mandiri/kelas7/perbandingan/PerbandinganBertingkatPage";
import PerbandinganSkalaK7Page from "./pages/latihan-mandiri/kelas7/perbandingan/PerbandinganSkalaPage";
import AritmetikaSosialK7Page from "./pages/latihan-mandiri/kelas7/AritmetikaSosialPage";
import JualBeliUntungRugiK7Page from "./pages/latihan-mandiri/kelas7/aritmetika-sosial/JualBeliUntungRugiPage";
import DiskonK7Page from "./pages/latihan-mandiri/kelas7/aritmetika-sosial/DiskonPage";
import BrutoNettoTaraK7Page from "./pages/latihan-mandiri/kelas7/aritmetika-sosial/BrutoNettoTaraPage";
import BungaTunggalK7Page from "./pages/latihan-mandiri/kelas7/aritmetika-sosial/BungaTunggalPage";
import PPNK7Page from "./pages/latihan-mandiri/kelas7/aritmetika-sosial/PPNPage";
import PPhK7Page from "./pages/latihan-mandiri/kelas7/aritmetika-sosial/PPhPage";
import GarisDanSudutK7Page from "./pages/latihan-mandiri/kelas7/GarisDanSudutPage";
import HubunganDuaGarisK7Page from "./pages/latihan-mandiri/kelas7/garis-dan-sudut/HubunganDuaGarisPage";
import SudutPelurusPenyikuBertolakK7Page from "./pages/latihan-mandiri/kelas7/garis-dan-sudut/SudutPelurusPenyikuBertolakPage";
import SifatSudutDuaGarisSejajarK7Page from "./pages/latihan-mandiri/kelas7/garis-dan-sudut/SifatSudutDuaGarisSejajarPage";
import JumlahSudutSegiBanyakK7Page from "./pages/latihan-mandiri/kelas7/garis-dan-sudut/JumlahSudutPadaSegiBanyakPage";
import SegitigaSegiempatK7Page from "./pages/latihan-mandiri/kelas7/SegitigaSegiempatPage";
import GarisBeratBagiTinggiLatihanK7Page from "./pages/latihan-mandiri/kelas7/segitiga-segiempat/GarisBeratBagiTinggiPage";
import KelilingSegitigaSegiempatLatihanK7Page from "./pages/latihan-mandiri/kelas7/segitiga-segiempat/KelilingSegitigaSegiempatPage";
import LuasSegitigaLatihanK7Page from "./pages/latihan-mandiri/kelas7/segitiga-segiempat/LuasSegitigaPage";
import LuasSegiempatLatihanK7Page from "./pages/latihan-mandiri/kelas7/segitiga-segiempat/LuasSegiempatPage";
import KelilingLuasBangunTakBeraturanLatihanK7Page from "./pages/latihan-mandiri/kelas7/segitiga-segiempat/KelilingLuasBangunTakBeraturanPage";
import PengertianKeanggotaanHimpunanLatihanK7Page from "./pages/latihan-mandiri/kelas7/himpunan/PengertianKeanggotaanPage";
import MenyatakanHimpunanLatihanK7Page from "./pages/latihan-mandiri/kelas7/himpunan/MenyatakanHimpunanPage";
import DiagramVennLatihanK7Page from "./pages/latihan-mandiri/kelas7/himpunan/DiagramVennPage";
import HimpunanBagianLatihanK7Page from "./pages/latihan-mandiri/kelas7/himpunan/HimpunanBagianPage";
import OperasiHimpunanLatihanK7Page from "./pages/latihan-mandiri/kelas7/himpunan/OperasiHimpunanPage";
import HimpunanK7Page from "./pages/latihan-mandiri/kelas7/HimpunanPage";

// Kelas 8 Topic Pages
import PolaBilanganK8Page from "./pages/latihan-mandiri/kelas8/PolaBilanganPage";
import PengertianPolaK8Page from "./pages/latihan-mandiri/kelas8/pola-bilangan/PengertianPolaPage";
import PolaKhususK8Page from "./pages/latihan-mandiri/kelas8/pola-bilangan/PolaKhususPage";
import PolaAritmetikaK8Page from "./pages/latihan-mandiri/kelas8/pola-bilangan/PolaAritmetikaPage";
import PolaGeometriK8Page from "./pages/latihan-mandiri/kelas8/pola-bilangan/PolaGeometriPage";
import KoordinatCartesiusK8Page from "./pages/latihan-mandiri/kelas8/KoordinatCartesiusPage";
import UnsurUnsurCartesiusK8Page from "./pages/latihan-mandiri/kelas8/koordinat-cartesius/UnsurUnsurPage";
import PosisiRelatifTitikAcuanK8Page from "./pages/latihan-mandiri/kelas8/koordinat-cartesius/PosisiRelatifTitikAcuanPage";
import JarakTitikGarisK8Page from "./pages/latihan-mandiri/kelas8/koordinat-cartesius/JarakTitikGarisPage";
import PosisiRelatifGarisK8Page from "./pages/latihan-mandiri/kelas8/koordinat-cartesius/PosisiRelatifPage";
import RelasiFungsiK8Page from "./pages/latihan-mandiri/kelas8/RelasiFungsiPage";
import PengertianRelasiK8Page from "./pages/latihan-mandiri/kelas8/relasi-fungsi/PengertianRelasiPage";
import PengertianFungsiK8Page from "./pages/latihan-mandiri/kelas8/relasi-fungsi/PengertianFungsiPage";
import BanyakFungsiK8Page from "./pages/latihan-mandiri/kelas8/relasi-fungsi/BanyakFungsiPage";
import NotasiFungsiK8Page from "./pages/latihan-mandiri/kelas8/relasi-fungsi/NotasiFungsiPage";
import GrafikFungsiK8Page from "./pages/latihan-mandiri/kelas8/relasi-fungsi/GrafikFungsiPage";
import SPLDVK8Page from "./pages/latihan-mandiri/kelas8/SPLDVPage";
import DefinisiSPLDVK8Page from "./pages/latihan-mandiri/kelas8/spldv/DefinisiSPLDVPage";
import MetodeGrafikSPLDVK8Page from "./pages/latihan-mandiri/kelas8/spldv/MetodeGrafikPage";
import MetodeSubstitusiSPLDVK8Page from "./pages/latihan-mandiri/kelas8/spldv/MetodeSubstitusiPage";
import MetodeEliminasiSPLDVK8Page from "./pages/latihan-mandiri/kelas8/spldv/MetodeEliminasiPage";
import MetodeCampuranSPLDVK8Page from "./pages/latihan-mandiri/kelas8/spldv/MetodeCampuranPage";
import ModelSPLDVK8Page from "./pages/latihan-mandiri/kelas8/spldv/ModelSPLDVPage";
import PenyelesaianMasalahSPLDVK8Page from "./pages/latihan-mandiri/kelas8/spldv/PenyelesaianMasalahPage";
import PersamaanGarisLurusK8Page from "./pages/latihan-mandiri/kelas8/PersamaanGarisLurusPage";
import GrafikPGLK8Page from "./pages/latihan-mandiri/kelas8/persamaan-garis-lurus/GrafikPGLPage";
import GradienK8Page from "./pages/latihan-mandiri/kelas8/persamaan-garis-lurus/GradienPage";
import MenentukanPGLK8Page from "./pages/latihan-mandiri/kelas8/persamaan-garis-lurus/MenentukanPGLPage";
import Hubungan2GarisK8Page from "./pages/latihan-mandiri/kelas8/persamaan-garis-lurus/Hubungan2GarisPage";
import AplikasiKontekstualPGLK8Page from "./pages/latihan-mandiri/kelas8/persamaan-garis-lurus/AplikasiKontekstualPage";
import TeoremaPythagorasK8Page from "./pages/latihan-mandiri/kelas8/TeoremaPythagorasPage";
import PembuktianPythagorasK8Page from "./pages/latihan-mandiri/kelas8/teorema-pythagoras/PembuktianPage";
import MenghitungPanjangPythagorasK8Page from "./pages/latihan-mandiri/kelas8/teorema-pythagoras/MenghitungPanjangPage";
import TriplePythagorasK8Page from "./pages/latihan-mandiri/kelas8/teorema-pythagoras/TriplePythagorasPage";
import JenisSegitigaPythagorasK8Page from "./pages/latihan-mandiri/kelas8/teorema-pythagoras/JenisSegitigaPage";
import SudutKhususPythagorasK8Page from "./pages/latihan-mandiri/kelas8/teorema-pythagoras/SudutKhususPage";
import MasalahKontekstualPythagorasK8Page from "./pages/latihan-mandiri/kelas8/teorema-pythagoras/MasalahKontekstualPage";
import LingkaranK8Page from "./pages/latihan-mandiri/kelas8/LingkaranPage";
import UnsurUnsurLingkaranK8Page from "./pages/latihan-mandiri/kelas8/lingkaran/UnsurUnsurPage";
import KelilingLuasLingkaranK8Page from "./pages/latihan-mandiri/kelas8/lingkaran/KelilingLuasPage";
import KaitanBangunDatarLingkaranK8Page from "./pages/latihan-mandiri/kelas8/lingkaran/KaitanBangunDatarPage";
import BusurJuringLingkaranK8Page from "./pages/latihan-mandiri/kelas8/lingkaran/BusurJuringPage";
import SudutPusatKelilingLingkaranK8Page from "./pages/latihan-mandiri/kelas8/lingkaran/SudutPusatKelilingPage";
import PenerapanKontekstualLingkaranK8Page from "./pages/latihan-mandiri/kelas8/lingkaran/PenerapanKontekstualPage";
import GarisSinggungLingkaranK8Page from "./pages/latihan-mandiri/kelas8/GarisSinggungLingkaranPage";
import PengertianGSLK8Page from "./pages/latihan-mandiri/kelas8/garis-singgung-lingkaran/PengertianPage";
import MenghitungPanjangGSLK8Page from "./pages/latihan-mandiri/kelas8/garis-singgung-lingkaran/MenghitungPanjangPage";
import GSPLK8Page from "./pages/latihan-mandiri/kelas8/garis-singgung-lingkaran/GSPLPage";
import GSPDK8Page from "./pages/latihan-mandiri/kelas8/garis-singgung-lingkaran/GSPDPage";
import SabukLilitanK8Page from "./pages/latihan-mandiri/kelas8/garis-singgung-lingkaran/SabukLilitanPage";
import BangunRuangSisiDatarK8Page from "./pages/latihan-mandiri/kelas8/BangunRuangSisiDatarPage";

// Kelas 9 Topic Pages
import BilanganBerpangkatK9Page from "./pages/latihan-mandiri/kelas9/BilanganBerpangkatPage";
import PengertianNotasiK9Page from "./pages/latihan-mandiri/kelas9/bilangan-berpangkat/PengertianNotasiPage";
import SifatSifatK9Page from "./pages/latihan-mandiri/kelas9/bilangan-berpangkat/SifatSifatPage";
import PangkatNolNegatifPecahanK9Page from "./pages/latihan-mandiri/kelas9/bilangan-berpangkat/PangkatNolNegatifPecahanPage";
import BentukAkarK9Page from "./pages/latihan-mandiri/kelas9/bilangan-berpangkat/BentukAkarPage";
import NotasiIlmiahK9Page from "./pages/latihan-mandiri/kelas9/bilangan-berpangkat/NotasiIlmiahPage";
import KesebangunanKekongruenK9Page from "./pages/latihan-mandiri/kelas9/KesebangunanKekongruenPage";
import DefinisiKesebangunanK9Page from "./pages/latihan-mandiri/kelas9/kesebangunan-kekongruenan/DefinisiKesebangunanPage";
import MenghitungRusukK9Page from "./pages/latihan-mandiri/kelas9/kesebangunan-kekongruenan/MenghitungRusukPage";
import SegitigaSebangunK9Page from "./pages/latihan-mandiri/kelas9/kesebangunan-kekongruenan/SegitigaSebangunPage";
import RasioRusukK9Page from "./pages/latihan-mandiri/kelas9/kesebangunan-kekongruenan/RasioRusukPage";
import KekongruenBangunDatarK9Page from "./pages/latihan-mandiri/kelas9/kesebangunan-kekongruenan/KekongruenBangunDatarPage";
import TransformasiGeometriK9Page from "./pages/latihan-mandiri/kelas9/TransformasiGeometriPage";
import TranslasiK9Page from "./pages/latihan-mandiri/kelas9/transformasi-geometri/TranslasiPage";
import RefleksiK9Page from "./pages/latihan-mandiri/kelas9/transformasi-geometri/RefleksiPage";
import RotasiK9Page from "./pages/latihan-mandiri/kelas9/transformasi-geometri/RotasiPage";
import DilatsiK9Page from "./pages/latihan-mandiri/kelas9/transformasi-geometri/DilatsiPage";
import BangunRuangSisiLengkungK9Page from "./pages/latihan-mandiri/kelas9/BangunRuangSisiLengkungPage";
import TabungLMK9Page from "./pages/latihan-mandiri/kelas9/bangun-ruang-sisi-lengkung/TabungPage";
import KerucutLMK9Page from "./pages/latihan-mandiri/kelas9/bangun-ruang-sisi-lengkung/KerucutPage";
import BolaLMK9Page from "./pages/latihan-mandiri/kelas9/bangun-ruang-sisi-lengkung/BolaPage";
import PerubahanVolumeLMK9Page from "./pages/latihan-mandiri/kelas9/bangun-ruang-sisi-lengkung/PerubahanVolumePage";
import GabunganLMK9Page from "./pages/latihan-mandiri/kelas9/bangun-ruang-sisi-lengkung/GabunganPage";
import StatistikaK9Page from "./pages/latihan-mandiri/kelas9/StatistikaPage";
import PengantarStatistikaLMK9Page from "./pages/latihan-mandiri/kelas9/statistika/PengantarStatistikaPage";
import PenyajianDataLMK9Page from "./pages/latihan-mandiri/kelas9/statistika/PenyajianDataPage";
import RataRataLMK9Page from "./pages/latihan-mandiri/kelas9/statistika/RataRataPage";
import MedianModusLMK9Page from "./pages/latihan-mandiri/kelas9/statistika/MedianModusPage";
import KuartilLMK9Page from "./pages/latihan-mandiri/kelas9/statistika/KuartilPage";
import PenyebaranDataLMK9Page from "./pages/latihan-mandiri/kelas9/statistika/PenyebaranDataPage";
import PeluangK9Page from "./pages/latihan-mandiri/kelas9/PeluangPage";
import RuangSampelLMK9Page from "./pages/latihan-mandiri/kelas9/peluang/RuangSampelPage";
import PeluangEmpirikLMK9Page from "./pages/latihan-mandiri/kelas9/peluang/PeluangEmpirikPage";
import PeluangTeoretikLMK9Page from "./pages/latihan-mandiri/kelas9/peluang/PeluangTeoretikPage";
import FrekuensiHarapanLMK9Page from "./pages/latihan-mandiri/kelas9/peluang/FrekuensiHarapanPage";
import KomplementLMK9Page from "./pages/latihan-mandiri/kelas9/peluang/KomplementPage";
import PeluangKejadianMajemukLMK9Page from "./pages/latihan-mandiri/kelas9/peluang/PeluangKejadianMajemukPage";
import PersamaanKuadratK9Page from "./pages/latihan-mandiri/kelas9/PersamaanKuadratPage";
import FungsiKuadratK9Page from "./pages/latihan-mandiri/kelas9/FungsiKuadratPage";
import FKBentukUmumKarakteristikPage from "./pages/latihan-mandiri/kelas9/fungsi-kuadrat/BentukUmumKarakteristikPage";
import FKTitikPotongPage from "./pages/latihan-mandiri/kelas9/fungsi-kuadrat/TitikPotongPage";
import FKSumbuSimetriPage from "./pages/latihan-mandiri/kelas9/fungsi-kuadrat/SumbuSimetriPage";
import FKMenggambarGrafikPage from "./pages/latihan-mandiri/kelas9/fungsi-kuadrat/MenggambarGrafikPage";
import FKMenyusunFungsiPage from "./pages/latihan-mandiri/kelas9/fungsi-kuadrat/MenyusunFungsiPage";
import FKPenerapanNilaiMaksMinPage from "./pages/latihan-mandiri/kelas9/fungsi-kuadrat/PenerapanNilaiMaksMinPage";
import PKBentukUmumPage from "./pages/latihan-mandiri/kelas9/persamaan-kuadrat/BentukUmumPage";
import PKPemfaktoranPage from "./pages/latihan-mandiri/kelas9/persamaan-kuadrat/PemfaktoranPage";
import PKRumusKuadratikPage from "./pages/latihan-mandiri/kelas9/persamaan-kuadrat/RumusKuadratikPage";
import PKPelengkapKuadratPage from "./pages/latihan-mandiri/kelas9/persamaan-kuadrat/PelengkapKuadratPage";
import PKDiskriminanPage from "./pages/latihan-mandiri/kelas9/persamaan-kuadrat/DiskriminanPage";
import PKMenyusunBaruPage from "./pages/latihan-mandiri/kelas9/persamaan-kuadrat/MenyusunPKBaruPage";
import PKPenerapanKontekstualPage from "./pages/latihan-mandiri/kelas9/persamaan-kuadrat/PenerapanKontekstualPage";

// Math Game Arena Pages
import MathGameArenaPage from "./pages/MathGameArenaPage";
import MathGameArenaKelas7Page from "./pages/MathGameArenaKelas7Page";
import MathGameArenaKelas8Page from "./pages/MathGameArenaKelas8Page";
import MathGameArenaKelas9Page from "./pages/MathGameArenaKelas9Page";
import MathGameArenaUmumPage from "./pages/MathGameArenaUmumPage";
import CarRacingGamePage from "./pages/math-game-arena/umum/CarRacingGamePage";
import TetrisGamePage from "./pages/math-game-arena/umum/TetrisGamePage";
import DinoRunGamePage from "./pages/math-game-arena/umum/DinoRunGamePage";
import FlappyRocketPage from "./pages/math-game-arena/umum/FlappyRocketPage";
import CatchItemsGamePage from "./pages/math-game-arena/umum/CatchItemsGamePage";
import SnakeMathPage from "./pages/math-game-arena/umum/SnakeMathPage";
import AsteroidBlasterPage from "./pages/math-game-arena/umum/AsteroidBlasterPage";
import BubblePopPage from "./pages/math-game-arena/umum/BubblePopPage";
import MolSmashPage from "./pages/math-game-arena/umum/MolSmashPage";
import FishingMathPage from "./pages/math-game-arena/umum/FishingMathPage";
import BrickBreakerPage from "./pages/math-game-arena/umum/BrickBreakerPage";
import BattleTankPage from "./pages/math-game-arena/umum/BattleTankPage";
import CoinTrainMathPage from "./pages/math-game-arena/umum/CoinTrainMathPage";
import FruitNinjaMathPage from "./pages/math-game-arena/umum/FruitNinjaMathPage";
import TreasureIslandMathPage from "./pages/math-game-arena/umum/TreasureIslandMathPage";
import SubmarineBattleMathPage from "./pages/math-game-arena/umum/SubmarineBattleMathPage";
import PlatformJumpMathPage from "./pages/math-game-arena/umum/PlatformJumpMathPage";
import KsatriaMatPage from "./pages/math-game-arena/umum/KsatriaMatPage";
import SpaceImpactPage from "./pages/math-game-arena/umum/SpaceImpactPage";
import GalaxyDefenderPage from "./pages/math-game-arena/umum/GalaxyDefenderPage";
import MathBrosPage from "./pages/math-game-arena/umum/MathBrosPage";
import ZumaMathPage from "./pages/math-game-arena/umum/ZumaMathPage";
import PacmanMathPage from "./pages/math-game-arena/umum/PacmanMathPage";
import BounceMathPage from "./pages/math-game-arena/umum/BounceMathPage";
import WesternBarPage from "./pages/math-game-arena/umum/WesternBarPage";
import PinballMathPage from "./pages/math-game-arena/umum/PinballMathPage";
import PenaltiMathPage from "./pages/math-game-arena/umum/PenaltiMathPage";

// Math Game Arena - Kelas 7 Topic Pages
import BilanganBulatMGAK7Page from "./pages/math-game-arena/kelas7/BilanganBulatPage";
import BilanganRasionalMGAK7Page from "./pages/math-game-arena/kelas7/BilanganRasionalPage";
import AljabarMGAK7Page from "./pages/math-game-arena/kelas7/AljabarPage";
import PLSVPtLSVMGAK7Page from "./pages/math-game-arena/kelas7/PLSVPtLSVPage";
import PerbandinganMGAK7Page from "./pages/math-game-arena/kelas7/PerbandinganPage";
import PenguranganBilanganBulatGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PenguranganGamePage";
import PerkalianBilanganBulatGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PerkalianGamePage";
import PembagianBilanganBulatGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PembagianGamePage";
import OperasiCampuranBilanganBulatGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/OperasiCampuranGamePage";
import KPKFPBGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/KPKFPBGamePage";
import AritmetikaSosialMGAK7Page from "./pages/math-game-arena/kelas7/AritmetikaSosialPage";
import JualBeliUntungRugiGameMGAK7Page from "./pages/math-game-arena/kelas7/aritmetika-sosial/JualBeliUntungRugiGamePage";
import DiskonGameMGAK7Page from "./pages/math-game-arena/kelas7/aritmetika-sosial/DiskonGamePage";
import BrutoNettoTaraGameMGAK7Page from "./pages/math-game-arena/kelas7/aritmetika-sosial/BrutoNettoTaraGamePage";
import PPNGameMGAK7Page from "./pages/math-game-arena/kelas7/aritmetika-sosial/PPNGamePage";
import PPhGameMGAK7Page from "./pages/math-game-arena/kelas7/aritmetika-sosial/PPhGamePage";
import GarisDanSudutMGAK7Page from "./pages/math-game-arena/kelas7/GarisDanSudutPage";
import SegitigaSegiempatMGAK7Page from "./pages/math-game-arena/kelas7/SegitigaSegiempatPage";
import HimpunanMGAK7Page from "./pages/math-game-arena/kelas7/HimpunanPage";

// Math Game Arena - Kelas 7 Pecahan Game Pages
import ArtiPecahanGamePage from "./pages/math-game-arena/kelas7/pecahan/ArtiPecahanGamePage";
import PecahanCampuranGamePage from "./pages/math-game-arena/kelas7/pecahan/PecahanCampuranGamePage";
import PenjumlahanPecahanGamePage from "./pages/math-game-arena/kelas7/pecahan/PenjumlahanPecahanGamePage";
import PenguranganPecahanGamePage from "./pages/math-game-arena/kelas7/pecahan/PenguranganPecahanGamePage";
import PerkalianPecahanGamePage from "./pages/math-game-arena/kelas7/pecahan/PerkalianPecahanGamePage";
import PembagianPecahanGamePage from "./pages/math-game-arena/kelas7/pecahan/PembagianPecahanGamePage";
import BentukDesimalGamePage from "./pages/math-game-arena/kelas7/pecahan/BentukDesimalGamePage";
import PenjumlahanDesimalGamePage from "./pages/math-game-arena/kelas7/pecahan/PenjumlahanDesimalGamePage";
import PenguranganDesimalGamePage from "./pages/math-game-arena/kelas7/pecahan/PenguranganDesimalGamePage";
import PerkalianDesimalGamePage from "./pages/math-game-arena/kelas7/pecahan/PerkalianDesimalGamePage";
import PembagianDesimalGamePage from "./pages/math-game-arena/kelas7/pecahan/PembagianDesimalGamePage";
import PembulatanDesimalGamePage from "./pages/math-game-arena/kelas7/pecahan/PembulatanDesimalGamePage";

// Math Game Arena - Kelas 7 Aljabar Game Pages
import PengertianUnsurAljabarGamePage from "./pages/math-game-arena/kelas7/aljabar/PengertianUnsurGamePage";
import PenjumlahanPenguranganAljabarGamePage from "./pages/math-game-arena/kelas7/aljabar/PenjumlahanPenguranganAljabarGamePage";
import PerkalianAljabarGamePage from "./pages/math-game-arena/kelas7/aljabar/PerkalianAljabarGamePage";
import PembagianAljabarGamePage from "./pages/math-game-arena/kelas7/aljabar/PembagianAljabarGamePage";
import PemangkatanAljabarGamePage from "./pages/math-game-arena/kelas7/aljabar/PemangkatanAljabarGamePage";
import SubstitusiAljabarGamePage from "./pages/math-game-arena/kelas7/aljabar/SubstitusiAljabarGamePage";
import FaktorisasiAljabarGamePage from "./pages/math-game-arena/kelas7/aljabar/FaktorisasiAljabarGamePage";
import OperasiPecahanAljabarGamePage from "./pages/math-game-arena/kelas7/aljabar/OperasiPecahanAljabarGamePage";

// Math Game Arena - Kelas 7 PLSV Game Pages
import KalimatTerbukaGamePage from "./pages/math-game-arena/kelas7/plsv/KalimatTerbukaGamePage";
import PengertianPLSVGamePage from "./pages/math-game-arena/kelas7/plsv/PengertianPLSVGamePage";
import PenyelesaianPLSVGamePage from "./pages/math-game-arena/kelas7/plsv/PenyelesaianPLSVGamePage";
import ModelMatematikaPLSVGamePage from "./pages/math-game-arena/kelas7/plsv/ModelMatematikaPLSVGamePage";
import PengertianPtLSVGamePage from "./pages/math-game-arena/kelas7/plsv/PengertianPtLSVGamePage";
import PenyelesaianPtLSVGamePage from "./pages/math-game-arena/kelas7/plsv/PenyelesaianPtLSVGamePage";
import ModelMatematikaPtLSVGamePage from "./pages/math-game-arena/kelas7/plsv/ModelMatematikaPtLSVGamePage";

// Math Game Arena - Kelas 7 Perbandingan Game Pages
import PerbandinganUmumGamePage from "./pages/math-game-arena/kelas7/perbandingan/PerbandinganUmumGamePage";
import PerbandinganSenilaiGamePage from "./pages/math-game-arena/kelas7/perbandingan/PerbandinganSenilaiGamePage";
import PerbandinganCampuranGamePage from "./pages/math-game-arena/kelas7/perbandingan/PerbandinganCampuranGamePage";
import PerbandinganBertingkatGamePage from "./pages/math-game-arena/kelas7/perbandingan/PerbandinganBertingkatGamePage";
import SkalaGamePage from "./pages/math-game-arena/kelas7/perbandingan/SkalaGamePage";

// Math Game Arena - Kelas 7 Garis Dan Sudut Game Pages
import HubunganDuaGarisGamePage from "./pages/math-game-arena/kelas7/garis-dan-sudut/HubunganDuaGarisGamePage";
import SudutPelurusGamePage from "./pages/math-game-arena/kelas7/garis-dan-sudut/SudutPelurusGamePage";
import SifatSudutSejajarGamePage from "./pages/math-game-arena/kelas7/garis-dan-sudut/SifatSudutSejajarGamePage";
import JumlahSudutSegibanyakGamePage from "./pages/math-game-arena/kelas7/garis-dan-sudut/JumlahSudutSegibanyakGamePage";

// Math Game Arena - Kelas 7 Segitiga Segiempat Game Pages
import GarisBeratBagiTinggiGamePage from "./pages/math-game-arena/kelas7/segitiga-segiempat/GarisBeratBagiTinggiGamePage";
import KelilingSegitigaSegiempatGamePage from "./pages/math-game-arena/kelas7/segitiga-segiempat/KelilingGamePage";
import LuasSegitigaGamePage from "./pages/math-game-arena/kelas7/segitiga-segiempat/LuasSegitigaGamePage";
import LuasSegiempatGamePage from "./pages/math-game-arena/kelas7/segitiga-segiempat/LuasSegiempatGamePage";
import BangunTakBeraturanGamePage from "./pages/math-game-arena/kelas7/segitiga-segiempat/BangunTakBeraturanGamePage";

// Math Game Arena - Kelas 7 Himpunan Game Pages
import PengertianKeanggotaanHimpunanGamePage from "./pages/math-game-arena/kelas7/himpunan/PengertianKeanggotaanGamePage";
import HimpunanBerhingaKosongGamePage from "./pages/math-game-arena/kelas7/himpunan/HimpunanBerhingaKosongGamePage";
import DiagramVennGamePage from "./pages/math-game-arena/kelas7/himpunan/DiagramVennGamePage";
import PemecahanMasalahHimpunanGamePage from "./pages/math-game-arena/kelas7/himpunan/PemecahanMasalahHimpunanGamePage";

// Math Game Arena - Kelas 7 Aritmetika Sosial Bunga Tunggal
import BungaTunggalGamePage from "./pages/math-game-arena/kelas7/aritmetika-sosial/BungaTunggalGamePage";

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
// Math Game Arena - Kelas 8 Game Pages
import PengertianPolaK8GamePage from "./pages/math-game-arena/kelas8/pola-bilangan/PengertianPolaGamePage";
import PolaKhususK8GamePage from "./pages/math-game-arena/kelas8/pola-bilangan/PolaKhususGamePage";
import PolaAritmetikaK8GamePage from "./pages/math-game-arena/kelas8/pola-bilangan/PolaAritmetikaGamePage";
import PolaGeometriK8GamePage from "./pages/math-game-arena/kelas8/pola-bilangan/PolaGeometriGamePage";
import UnsurUnsurCartesiusK8GamePage from "./pages/math-game-arena/kelas8/koordinat-cartesius/UnsurUnsurCartesiusGamePage";
import JarakTitikK8GamePage from "./pages/math-game-arena/kelas8/koordinat-cartesius/JarakTitikGamePage";
import PosisiRelatifK8GamePage from "./pages/math-game-arena/kelas8/koordinat-cartesius/PosisiRelatifGamePage";
import PengertianRelasiK8GamePage from "./pages/math-game-arena/kelas8/relasi-dan-fungsi/PengertianRelasiGamePage";
import PengertianFungsiK8GamePage from "./pages/math-game-arena/kelas8/relasi-dan-fungsi/PengertianFungsiGamePage";
import BanyakFungsiK8GamePage from "./pages/math-game-arena/kelas8/relasi-dan-fungsi/BanyakFungsiGamePage";
import NotasiRumusK8GamePage from "./pages/math-game-arena/kelas8/relasi-dan-fungsi/NotasiRumusGamePage";
import GrafikFungsiK8GamePage from "./pages/math-game-arena/kelas8/relasi-dan-fungsi/GrafikFungsiGamePage";
import DefinisiSPLDVK8GamePage from "./pages/math-game-arena/kelas8/spldv/DefinisiSPLDVGamePage";
import MetodeGrafikK8GamePage from "./pages/math-game-arena/kelas8/spldv/MetodeGrafikGamePage";
import MetodeSubstitusiK8GamePage from "./pages/math-game-arena/kelas8/spldv/MetodeSubstitusiGamePage";
import MetodeEliminasiK8GamePage from "./pages/math-game-arena/kelas8/spldv/MetodeEliminasiGamePage";
import MetodeCampuranK8GamePage from "./pages/math-game-arena/kelas8/spldv/MetodeCampuranGamePage";
import ModelSPLDVK8GamePage from "./pages/math-game-arena/kelas8/spldv/ModelSPLDVGamePage";
import PenyelesaianMasalahSPLDVK8GamePage from "./pages/math-game-arena/kelas8/spldv/PenyelesaianMasalahSPLDVGamePage";
import GrafikPGLK8GamePage from "./pages/math-game-arena/kelas8/persamaan-garis-lurus/GrafikPGLGamePage";
import GradienK8GamePage from "./pages/math-game-arena/kelas8/persamaan-garis-lurus/GradienGamePage";
import MenentukanPGLK8GamePage from "./pages/math-game-arena/kelas8/persamaan-garis-lurus/MenentukanPGLGamePage";
import Hubungan2GarisK8GamePage from "./pages/math-game-arena/kelas8/persamaan-garis-lurus/Hubungan2GarisGamePage";
import AplikasiKontekstualPGLK8GamePage from "./pages/math-game-arena/kelas8/persamaan-garis-lurus/AplikasiKontekstualPGLGamePage";
import PembuktianPythagorasK8GamePage from "./pages/math-game-arena/kelas8/teorema-pythagoras/PembuktianPythagorasGamePage";
import MenghitungPanjangK8GamePage from "./pages/math-game-arena/kelas8/teorema-pythagoras/MenghitungPanjangGamePage";
import TriplePythagorasK8GamePage from "./pages/math-game-arena/kelas8/teorema-pythagoras/TriplePythagorasGamePage";
import JenisSegitigaK8GamePage from "./pages/math-game-arena/kelas8/teorema-pythagoras/JenisSegitigaGamePage";
import SudutKhususK8GamePage from "./pages/math-game-arena/kelas8/teorema-pythagoras/SudutKhususGamePage";
import PenerapanKontekstualPythagorasK8GamePage from "./pages/math-game-arena/kelas8/teorema-pythagoras/PenerapanKontekstualPythagorasGamePage";
import UnsurUnsurLingkaranK8GamePage from "./pages/math-game-arena/kelas8/lingkaran/UnsurUnsurLingkaranGamePage";
import KelilingLuasLingkaranK8GamePage from "./pages/math-game-arena/kelas8/lingkaran/KelilingLuasLingkaranGamePage";
import KaitanBangunDatarK8GamePage from "./pages/math-game-arena/kelas8/lingkaran/KaitanBangunDatarGamePage";
import BusurJuringK8GamePage from "./pages/math-game-arena/kelas8/lingkaran/BusurJuringGamePage";
import SudutPusatKelilingK8GamePage from "./pages/math-game-arena/kelas8/lingkaran/SudutPusatKelilingGamePage";
import PenerapanKontekstualLingkaranK8GamePage from "./pages/math-game-arena/kelas8/lingkaran/PenerapanKontekstualLingkaranGamePage";
import PengertianSifatGSLK8GamePage from "./pages/math-game-arena/kelas8/garis-singgung-lingkaran/PengertianSifatGSLGamePage";
import PanjangGarisSinggungK8GamePage from "./pages/math-game-arena/kelas8/garis-singgung-lingkaran/PanjangGarisSinggungGamePage";
import GSPLK8GamePage from "./pages/math-game-arena/kelas8/garis-singgung-lingkaran/GSPLGamePage";
import GSPDK8GamePage from "./pages/math-game-arena/kelas8/garis-singgung-lingkaran/GSPDGamePage";
import SabukLilitanK8GamePage from "./pages/math-game-arena/kelas8/garis-singgung-lingkaran/SabukLilitanGamePage";
import BalokK8GamePage from "./pages/math-game-arena/kelas8/bangun-ruang-sisi-datar/BalokGamePage";
import PrismaK8GamePage from "./pages/math-game-arena/kelas8/bangun-ruang-sisi-datar/PrismaGamePage";
import LimasK8GamePage from "./pages/math-game-arena/kelas8/bangun-ruang-sisi-datar/LimasGamePage";
import GabunganBRSDK8GamePage from "./pages/math-game-arena/kelas8/bangun-ruang-sisi-datar/GabunganBRSDGamePage";
import KontekstualBRSDK8GamePage from "./pages/math-game-arena/kelas8/bangun-ruang-sisi-datar/KontekstualBRSDGamePage";
import PenjumlahanBilanganBulatGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PenjumlahanGamePage";
import PenjumlahanMeteorGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PenjumlahanMeteorGamePage";
import PenjumlahanTurtleRunGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PenjumlahanTurtleRunGamePage";
import PenjumlahanFlappyRocketGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PenjumlahanFlappyRocketGamePage";
import PenjumlahanTembakTankGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PenjumlahanTembakTankGamePage";
import PenjumlahanSpaceImpactGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PenjumlahanSpaceImpactGamePage";
import PenjumlahanTetrisGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PenjumlahanTetrisGamePage";
import PenjumlahanSnakeMathGameMGAK7Page from "./pages/math-game-arena/kelas7/bilangan-bulat/PenjumlahanSnakeMathGamePage";

// Math Game Arena - Kelas 9 Topic Pages
import BilanganBerpangkatMGAK9Page from "./pages/math-game-arena/kelas9/BilanganBerpangkatPage";
import KesebangunanKekongruenMGAK9Page from "./pages/math-game-arena/kelas9/KesebangunanKekongruenPage";
import TransformasiGeometriMGAK9Page from "./pages/math-game-arena/kelas9/TransformasiGeometriPage";
import BangunRuangSisiLengkungMGAK9Page from "./pages/math-game-arena/kelas9/BangunRuangSisiLengkungPage";
import StatistikaMGAK9Page from "./pages/math-game-arena/kelas9/StatistikaPage";
import PeluangMGAK9Page from "./pages/math-game-arena/kelas9/PeluangPage";
import PersamaanKuadratMGAK9Page from "./pages/math-game-arena/kelas9/PersamaanKuadratPage";
import FungsiKuadratMGAK9Page from "./pages/math-game-arena/kelas9/FungsiKuadratPage";

// Math Game Arena - Kelas 9 Game Pages - Bilangan Berpangkat
import PengertianNotasiMGAK9GamePage from "./pages/math-game-arena/kelas9/bilangan-berpangkat/PengertianNotasiGamePage";
import SifatOperasiMGAK9GamePage from "./pages/math-game-arena/kelas9/bilangan-berpangkat/SifatOperasiGamePage";
import BentukAkarMGAK9GamePage from "./pages/math-game-arena/kelas9/bilangan-berpangkat/BentukAkarGamePage";
import NotasiIlmiahMGAK9GamePage from "./pages/math-game-arena/kelas9/bilangan-berpangkat/NotasiIlmiahGamePage";
// Math Game Arena - Kelas 9 Game Pages - Kesebangunan & Kekongruenan
import DefinisiKesebangunanMGAK9GamePage from "./pages/math-game-arena/kelas9/kesebangunan-kekongruenan/DefinisiGamePage";
import MenghitungRusukMGAK9GamePage from "./pages/math-game-arena/kelas9/kesebangunan-kekongruenan/MenghitungRusukGamePage";
import SegitigaSebangunMGAK9GamePage from "./pages/math-game-arena/kelas9/kesebangunan-kekongruenan/SegitigaSebangunGamePage";
import RasioRusukMGAK9GamePage from "./pages/math-game-arena/kelas9/kesebangunan-kekongruenan/RasioRusukGamePage";
import KekongruenBangunDatarMGAK9GamePage from "./pages/math-game-arena/kelas9/kesebangunan-kekongruenan/KekongruenBangunDatarGamePage";
// Math Game Arena - Kelas 9 Game Pages - Transformasi Geometri
import TranslasiMGAK9GamePage from "./pages/math-game-arena/kelas9/transformasi-geometri/TranslasiGamePage";
import RefleksiMGAK9GamePage from "./pages/math-game-arena/kelas9/transformasi-geometri/RefleksiGamePage";
import RotasiMGAK9GamePage from "./pages/math-game-arena/kelas9/transformasi-geometri/RotasiGamePage";
import DilatasiMGAK9GamePage from "./pages/math-game-arena/kelas9/transformasi-geometri/DilatasiGamePage";
// Math Game Arena - Kelas 9 Game Pages - Bangun Ruang Sisi Lengkung
import TabungMGAK9GamePage from "./pages/math-game-arena/kelas9/bangun-ruang-sisi-lengkung/TabungGamePage";
import KerucutMGAK9GamePage from "./pages/math-game-arena/kelas9/bangun-ruang-sisi-lengkung/KerucutGamePage";
import BolaMGAK9GamePage from "./pages/math-game-arena/kelas9/bangun-ruang-sisi-lengkung/BolaGamePage";
import PerubahanLuasVolumeMGAK9GamePage from "./pages/math-game-arena/kelas9/bangun-ruang-sisi-lengkung/PerubahanLuasVolumeGamePage";
import GabunganMGAK9GamePage from "./pages/math-game-arena/kelas9/bangun-ruang-sisi-lengkung/GabunganGamePage";
// Math Game Arena - Kelas 9 Game Pages - Statistika
import PengantarStatistikaMGAK9GamePage from "./pages/math-game-arena/kelas9/statistika/PengantarGamePage";
import PenyajianDataMGAK9GamePage from "./pages/math-game-arena/kelas9/statistika/PenyajianDataGamePage";
import RataRataMGAK9GamePage from "./pages/math-game-arena/kelas9/statistika/RataRataGamePage";
import MedianModusMGAK9GamePage from "./pages/math-game-arena/kelas9/statistika/MedianModusGamePage";
import KuartilMGAK9GamePage from "./pages/math-game-arena/kelas9/statistika/KuartilGamePage";
import PenyebaranDataMGAK9GamePage from "./pages/math-game-arena/kelas9/statistika/PenyebaranDataGamePage";
// Math Game Arena - Kelas 9 Game Pages - Peluang
import RuangSampelMGAK9GamePage from "./pages/math-game-arena/kelas9/peluang/RuangSampelGamePage";
import PeluangEmpirikMGAK9GamePage from "./pages/math-game-arena/kelas9/peluang/PeluangEmpirikGamePage";
import PeluangTeoretikMGAK9GamePage from "./pages/math-game-arena/kelas9/peluang/PeluangTeoretikGamePage";
import FrekuensiHarapanMGAK9GamePage from "./pages/math-game-arena/kelas9/peluang/FrekuensiHarapanGamePage";
import KomplemenMGAK9GamePage from "./pages/math-game-arena/kelas9/peluang/KomplemenGamePage";
import PeluangKejadianMajemukMGAK9GamePage from "./pages/math-game-arena/kelas9/peluang/PeluangKejadianMajemukGamePage";
// Math Game Arena - Kelas 9 Game Pages - Persamaan Kuadrat
import BentukUmumPKMGAK9GamePage from "./pages/math-game-arena/kelas9/persamaan-kuadrat/BentukUmumGamePage";
import PemfaktoranMGAK9GamePage from "./pages/math-game-arena/kelas9/persamaan-kuadrat/PemfaktoranGamePage";
import RumusKuadratikMGAK9GamePage from "./pages/math-game-arena/kelas9/persamaan-kuadrat/RumusKuadratikGamePage";
import PelengkapKuadratMGAK9GamePage from "./pages/math-game-arena/kelas9/persamaan-kuadrat/PelengkapKuadratGamePage";
import DiskriminanMGAK9GamePage from "./pages/math-game-arena/kelas9/persamaan-kuadrat/DiskriminanGamePage";
import MenyusunPersamaanMGAK9GamePage from "./pages/math-game-arena/kelas9/persamaan-kuadrat/MenyusunPersamaanGamePage";
import PenerapanPKMGAK9GamePage from "./pages/math-game-arena/kelas9/persamaan-kuadrat/PenerapanGamePage";
// Math Game Arena - Kelas 9 Game Pages - Fungsi Kuadrat
import BentukUmumKarakteristikMGAK9GamePage from "./pages/math-game-arena/kelas9/fungsi-kuadrat/BentukUmumKarakteristikGamePage";
import TitikPotongMGAK9GamePage from "./pages/math-game-arena/kelas9/fungsi-kuadrat/TitikPotongGamePage";
import SumbuSimetriMGAK9GamePage from "./pages/math-game-arena/kelas9/fungsi-kuadrat/SumbuSimetriGamePage";
import MenggambarGrafikMGAK9GamePage from "./pages/math-game-arena/kelas9/fungsi-kuadrat/MenggambarGrafikGamePage";
import MenyusunFungsiMGAK9GamePage from "./pages/math-game-arena/kelas9/fungsi-kuadrat/MenyusunFungsiGamePage";
import PenerapanFKMGAK9GamePage from "./pages/math-game-arena/kelas9/fungsi-kuadrat/PenerapanFungsiGamePage";

// Materi Matematika Pages
import MateriMatematikaPage from "./pages/MateriMatematikaPage";
import MateriMatematikaKelas7Page from "./pages/MateriMatematikaKelas7Page";
import MateriMatematikaKelas8Page from "./pages/MateriMatematikaKelas8Page";
import MateriMatematikaKelas9Page from "./pages/MateriMatematikaKelas9Page";

// Materi Matematika - Kelas 7 Topic Pages
import BilanganBulatMMK7Page from "./pages/materi-matematika/kelas7/BilanganBulatPage";
import PenjumlahanBilanganBulatMMK7Page from "./pages/materi-matematika/kelas7/bilangan-bulat/PenjumlahanPage";
import PenguranganBilanganBulatMMK7Page from "./pages/materi-matematika/kelas7/bilangan-bulat/PenguranganPage";
import PerkalianBilanganBulatMMK7Page from "./pages/materi-matematika/kelas7/bilangan-bulat/PerkalianPage";
import PembagianBilanganBulatMMK7Page from "./pages/materi-matematika/kelas7/bilangan-bulat/PembagianPage";
import OperasiCampuranBilanganBulatMMK7Page from "./pages/materi-matematika/kelas7/bilangan-bulat/OperasiCampuranPage";
import KPKFPBBilanganBulatMMK7Page from "./pages/materi-matematika/kelas7/bilangan-bulat/KPKFPBPage";
import BilanganRasionalMMK7Page from "./pages/materi-matematika/kelas7/BilanganRasionalPage";
import ArtiPecahanMMK7Page from "./pages/materi-matematika/kelas7/bilangan-rasional/ArtiPecahanPage";
import PecahanCampuranMMK7Page from "./pages/materi-matematika/kelas7/bilangan-rasional/PecahanCampuranPage";
import PenjumlahanPenguranganMMK7Page from "./pages/materi-matematika/kelas7/bilangan-rasional/PenjumlahanPenguranganPage";
import PerkalianPecahanMMK7Page from "./pages/materi-matematika/kelas7/bilangan-rasional/PerkalianPecahanPage";
import PembagianPecahanMMK7Page from "./pages/materi-matematika/kelas7/bilangan-rasional/PembagianPecahanPage";
import BentukDesimalMMK7Page from "./pages/materi-matematika/kelas7/bilangan-rasional/BentukDesimalPage";
import PenjumlahanPenguranganBentukDesimalMMK7Page from "./pages/materi-matematika/kelas7/bilangan-rasional/PenjumlahanPenguranganBentukDesimalPage";
import PerkalianBentukDesimalMMK7Page from "./pages/materi-matematika/kelas7/bilangan-rasional/PerkalianBentukDesimalPage";
import PembagianBentukDesimalMMK7Page from "./pages/materi-matematika/kelas7/bilangan-rasional/PembagianBentukDesimalPage";
import PembulatanBentukDesimalMMK7Page from "./pages/materi-matematika/kelas7/bilangan-rasional/PembulatanBentukDesimalPage";
import AljabarMMK7Page from "./pages/materi-matematika/kelas7/AljabarPage";
import PengertianUnsurMMK7Page from "./pages/materi-matematika/kelas7/aljabar/PengertianUnsurPage";
import PenjumlahanPenguranganAljabarMMK7Page from "./pages/materi-matematika/kelas7/aljabar/PenjumlahanPenguranganPage";
import PerkalianAljabarMMK7Page from "./pages/materi-matematika/kelas7/aljabar/PerkalianPage";
import PembagianAljabarMMK7Page from "./pages/materi-matematika/kelas7/aljabar/PembagianPage";
import PemangkatanAljabarMMK7Page from "./pages/materi-matematika/kelas7/aljabar/PemangkatanPage";
import SubstitusiAljabarMMK7Page from "./pages/materi-matematika/kelas7/aljabar/SubstitusiPage";
import FaktorisasiAljabarMMK7Page from "./pages/materi-matematika/kelas7/aljabar/FaktorisasiPage";
import OperasiPecahanAljabarMMK7Page from "./pages/materi-matematika/kelas7/aljabar/OperasiPecahanPage";
import PLSVPtLSVMMK7Page from "./pages/materi-matematika/kelas7/PLSVPtLSVPage";
import KalimatTerbukaTertutupPage from "./pages/materi-matematika/kelas7/plsv-ptlsv/KalimatTerbukaTertutupPage";
import PengertianPLSVPage from "./pages/materi-matematika/kelas7/plsv-ptlsv/PengertianPLSVPage";
import PenyelesaianPLSVPage from "./pages/materi-matematika/kelas7/plsv-ptlsv/PenyelesaianPLSVPage";
import ModelMatematikaPLSVPage from "./pages/materi-matematika/kelas7/plsv-ptlsv/ModelMatematikaPLSVPage";
import PengertianPtLSVPage from "./pages/materi-matematika/kelas7/plsv-ptlsv/PengertianPtLSVPage";
import PenyelesaianPtLSVPage from "./pages/materi-matematika/kelas7/plsv-ptlsv/PenyelesaianPtLSVPage";
import ModelMatematikaPtLSVPage from "./pages/materi-matematika/kelas7/plsv-ptlsv/ModelMatematikaPtLSVPage";
import PerbandinganMMK7Page from "./pages/materi-matematika/kelas7/PerbandinganPage";
import PerbandinganUmumMMK7Page from "./pages/materi-matematika/kelas7/perbandingan/PerbandinganUmumPage";
import PerbandinganSenilaiMMK7Page from "./pages/materi-matematika/kelas7/perbandingan/PerbandinganSenilaiPage";
import PerbandinganCampuranMMK7Page from "./pages/materi-matematika/kelas7/perbandingan/PerbandinganCampuranPage";
import PerbandinganBertingkatMMK7Page from "./pages/materi-matematika/kelas7/perbandingan/PerbandinganBertingkatPage";
import SkalaMMK7Page from "./pages/materi-matematika/kelas7/perbandingan/SkalaPage";
import AritmetikaSosialMMK7Page from "./pages/materi-matematika/kelas7/AritmetikaSosialPage";
import JualBeliUntungRugiMMK7Page from "./pages/materi-matematika/kelas7/aritmetika-sosial/JualBeliUntungRugiPage";
import DiskonMMK7Page from "./pages/materi-matematika/kelas7/aritmetika-sosial/DiskonPage";
import BrutoNettoTaraMMK7Page from "./pages/materi-matematika/kelas7/aritmetika-sosial/BrutoNettoTaraPage";
import BungaTunggalMMK7Page from "./pages/materi-matematika/kelas7/aritmetika-sosial/BungaTunggalPage";
import PPNMMk7Page from "./pages/materi-matematika/kelas7/aritmetika-sosial/PPNPage";
import PPhMMK7Page from "./pages/materi-matematika/kelas7/aritmetika-sosial/PPhPage";
import GarisDanSudutMMK7Page from "./pages/materi-matematika/kelas7/GarisDanSudutPage";
import HubunganDuaGarisMMK7Page from "./pages/materi-matematika/kelas7/garis-dan-sudut/HubunganDuaGarisPage";
import SudutPelurusPenyikuBertolakMMK7Page from "./pages/materi-matematika/kelas7/garis-dan-sudut/SudutPelurusPenyikuBertolakPage";
import SifatSudutDuaGarisSejajarPage from "./pages/materi-matematika/kelas7/garis-dan-sudut/SifatSudutDuaGarisSejajarPage";
import JumlahSudutSegiBanyakPage from "./pages/materi-matematika/kelas7/garis-dan-sudut/JumlahSudutSegiBanyakPage";
import SegitigaSegiempatMMK7Page from "./pages/materi-matematika/kelas7/SegitigaSegiempatPage";
import GarisBeratBagiTinggiPage from "./pages/materi-matematika/kelas7/segitiga-segiempat/GarisBeratBagiTinggiPage";
import KelilingSegitigaSegiempatPage from "./pages/materi-matematika/kelas7/segitiga-segiempat/KelilingSegitigaSegiempatPage";
import LuasSegitigaPage from "./pages/materi-matematika/kelas7/segitiga-segiempat/LuasSegitigaPage";
import LuasSegiempatPage from "./pages/materi-matematika/kelas7/segitiga-segiempat/LuasSegiempatPage";
import KelilingLuasBangunTakBeraturanPage from "./pages/materi-matematika/kelas7/segitiga-segiempat/KelilingLuasBangunTakBeraturanPage";
import KubusMMK8Page from "./pages/materi-matematika/kelas8/bangun-ruang-sisi-datar/KubusPage";
import BalokMMK8Page from "./pages/materi-matematika/kelas8/bangun-ruang-sisi-datar/BalokPage";
import PrismaMMK8Page from "./pages/materi-matematika/kelas8/bangun-ruang-sisi-datar/PrismaPage";
import KubusLMK8Page from "./pages/latihan-mandiri/kelas8/bangun-ruang-sisi-datar/KubusPage";
import BalokLMK8Page from "./pages/latihan-mandiri/kelas8/bangun-ruang-sisi-datar/BalokPage";
import PrismaLMK8Page from "./pages/latihan-mandiri/kelas8/bangun-ruang-sisi-datar/PrismaPage";
import LimasLMK8Page from "./pages/latihan-mandiri/kelas8/bangun-ruang-sisi-datar/LimasPage";
import MasalahKontekstualBRSDLMK8Page from "./pages/latihan-mandiri/kelas8/bangun-ruang-sisi-datar/MasalahKontekstualPage";
import BRSDGabunganLMK8Page from "./pages/latihan-mandiri/kelas8/bangun-ruang-sisi-datar-gabungan/GabunganPage";
import LimasMMK8Page from "./pages/materi-matematika/kelas8/bangun-ruang-sisi-datar/LimasPage";
import GabunganMMK8Page from "./pages/materi-matematika/kelas8/bangun-ruang-sisi-datar/GabunganPage";
import HimpunanMMK7Page from "./pages/materi-matematika/kelas7/HimpunanPage";
import PengertianKeanggotaanHimpunanPage from "./pages/materi-matematika/kelas7/himpunan/PengertianKeanggotaanPage";
import JenisHimpunanPage from "./pages/materi-matematika/kelas7/himpunan/JenisHimpunanPage";
import DiagramVennPage from "./pages/materi-matematika/kelas7/himpunan/DiagramVennPage";
import PemecahanMasalahHimpunanPage from "./pages/materi-matematika/kelas7/himpunan/PemecahanMasalahHimpunanPage";

// Materi Matematika - Kelas 8 Topic Pages
import PolaBilanganMMK8Page from "./pages/materi-matematika/kelas8/PolaBilanganPage";
import PengertianPolaMMK8Page from "./pages/materi-matematika/kelas8/pola-bilangan/PengertianPolaPage";
import PolaKhususMMK8Page from "./pages/materi-matematika/kelas8/pola-bilangan/PolaKhususPage";
import PolaAritmetikaMMK8Page from "./pages/materi-matematika/kelas8/pola-bilangan/PolaAritmetikaPage";
import PolaGeometriMMK8Page from "./pages/materi-matematika/kelas8/pola-bilangan/PolaGeometriPage";
import KoordinatCartesiusMMK8Page from "./pages/materi-matematika/kelas8/KoordinatCartesiusPage";
import UnsurUnsurCartesiusMMK8Page from "./pages/materi-matematika/kelas8/koordinat-cartesius/UnsurUnsurCartesiusPage";
import PosisiRelatifTitikAcuanMMK8Page from "./pages/materi-matematika/kelas8/koordinat-cartesius/PosisiRelatifTitikAcuanPage";
import JarakTitikGarisMMK8Page from "./pages/materi-matematika/kelas8/koordinat-cartesius/JarakTitikGarisPage";
import PosisiRelatifGarisMMK8Page from "./pages/materi-matematika/kelas8/koordinat-cartesius/PosisiRelatifGarisPage";
import RelasiFungsiMMK8Page from "./pages/materi-matematika/kelas8/RelasiFungsiPage";
import PengertianRelasiMMK8Page from "./pages/materi-matematika/kelas8/relasi-fungsi/PengertianRelasiPage";
import PengertianFungsiMMK8Page from "./pages/materi-matematika/kelas8/relasi-fungsi/PengertianFungsiPage";
import BanyakFungsiMMK8Page from "./pages/materi-matematika/kelas8/relasi-fungsi/BanyakFungsiPage";
import NotasiFungsiMMK8Page from "./pages/materi-matematika/kelas8/relasi-fungsi/NotasiFungsiPage";
import GrafikFungsiMMK8Page from "./pages/materi-matematika/kelas8/relasi-fungsi/GrafikFungsiPage";
import SPLDVMMK8Page from "./pages/materi-matematika/kelas8/SPLDVPage";
import DefinisiSPLDVMMK8Page from "./pages/materi-matematika/kelas8/spldv/DefinisiSPLDVPage";
import MetodeGrafikMMK8Page from "./pages/materi-matematika/kelas8/spldv/MetodeGrafikPage";
import MetodeSubstitusiMMK8Page from "./pages/materi-matematika/kelas8/spldv/MetodeSubstitusiPage";
import MetodeEliminasiMMK8Page from "./pages/materi-matematika/kelas8/spldv/MetodeEliminasiPage";
import MetodeCampuranMMK8Page from "./pages/materi-matematika/kelas8/spldv/MetodeCampuranPage";
import ModelSPLDVMMK8Page from "./pages/materi-matematika/kelas8/spldv/ModelSPLDVPage";
import PenyelesaianMasalahSPLDVMMK8Page from "./pages/materi-matematika/kelas8/spldv/PenyelesaianMasalahSPLDVPage";
import PersamaanGarisLurusMMK8Page from "./pages/materi-matematika/kelas8/PersamaanGarisLurusPage";
import GrafikPGLMMK8Page from "./pages/materi-matematika/kelas8/persamaan-garis-lurus/GrafikPGLPage";
import GradienMMK8Page from "./pages/materi-matematika/kelas8/persamaan-garis-lurus/GradienPage";
import MenentukanPGLMMK8Page from "./pages/materi-matematika/kelas8/persamaan-garis-lurus/MenentukanPGLPage";
import Hubungan2GarisMMK8Page from "./pages/materi-matematika/kelas8/persamaan-garis-lurus/Hubungan2GarisPage";
import AplikasiKontekstualMMK8Page from "./pages/materi-matematika/kelas8/persamaan-garis-lurus/AplikasiKontekstualPage";
import TeoremaPythagorasMMK8Page from "./pages/materi-matematika/kelas8/TeoremaPythagorasPage";
import PembuktianPythagorasMMK8Page from "./pages/materi-matematika/kelas8/teorema-pythagoras/PembuktianPage";
import MenghitungPanjangPythagorasMMK8Page from "./pages/materi-matematika/kelas8/teorema-pythagoras/MenghitungPanjangPage";
import TriplePythagorasMMK8Page from "./pages/materi-matematika/kelas8/teorema-pythagoras/TriplePythagorasPage";
import JenisSegitigaPythagorasMMK8Page from "./pages/materi-matematika/kelas8/teorema-pythagoras/JenisSegitigaPage";
import SudutKhususPythagorasMMK8Page from "./pages/materi-matematika/kelas8/teorema-pythagoras/SudutKhususPage";
import MasalahKontekstualPythagorasMMK8Page from "./pages/materi-matematika/kelas8/teorema-pythagoras/MasalahKontekstualPage";
import LingkaranMMK8Page from "./pages/materi-matematika/kelas8/LingkaranPage";
import UnsurUnsurLingkaranMMK8Page from "./pages/materi-matematika/kelas8/lingkaran/UnsurUnsurPage";
import KelilingLuasLingkaranMMK8Page from "./pages/materi-matematika/kelas8/lingkaran/KelilingLuasPage";
import KaitanBangunDatarLingkaranMMK8Page from "./pages/materi-matematika/kelas8/lingkaran/KaitanBangunDatarPage";
import BusurJuringLingkaranMMK8Page from "./pages/materi-matematika/kelas8/lingkaran/BusurJuringPage";
import SudutPusatKelilingLingkaranMMK8Page from "./pages/materi-matematika/kelas8/lingkaran/SudutPusatKelilingPage";
import PenerapanKontekstualLingkaranMMK8Page from "./pages/materi-matematika/kelas8/lingkaran/PenerapanKontekstualPage";
import GarisSinggungLingkaranMMK8Page from "./pages/materi-matematika/kelas8/GarisSinggungLingkaranPage";
import PengertianGSLMMK8Page from "./pages/materi-matematika/kelas8/garis-singgung-lingkaran/PengertianPage";
import MenghitungPanjangGSLMMK8Page from "./pages/materi-matematika/kelas8/garis-singgung-lingkaran/MenghitungPanjangPage";
import GSPLMMk8Page from "./pages/materi-matematika/kelas8/garis-singgung-lingkaran/GSPLPage";
import GSPDMMk8Page from "./pages/materi-matematika/kelas8/garis-singgung-lingkaran/GSPDPage";
import SabukLilitanMMK8Page from "./pages/materi-matematika/kelas8/garis-singgung-lingkaran/SabukLilitanPage";
import BangunRuangSisiDatarMMK8Page from "./pages/materi-matematika/kelas8/BangunRuangSisiDatarPage";

// Materi Matematika - Kelas 9 Topic Pages
import BilanganBerpangkatMMK9Page from "./pages/materi-matematika/kelas9/BilanganBerpangkatPage";
import PengertianNotasiPangkatMMK9Page from "./pages/materi-matematika/kelas9/bilangan-berpangkat/PengertianNotasiPangkatPage";
import SifatSifatOperasiMMK9Page from "./pages/materi-matematika/kelas9/bilangan-berpangkat/SifatSifatOperasiPage";
import BentukAkarMMK9Page from "./pages/materi-matematika/kelas9/bilangan-berpangkat/BentukAkarPage";
import NotasiIlmiahMMK9Page from "./pages/materi-matematika/kelas9/bilangan-berpangkat/NotasiIlmiahPage";
import KesebangunanKekongruenMMK9Page from "./pages/materi-matematika/kelas9/KesebangunanKekongruenPage";
import DefinisiKesebangunanMMK9Page from "./pages/materi-matematika/kelas9/kesebangunan-kekongruenan/DefinisiPage";
import MenghitungRusukMMK9Page from "./pages/materi-matematika/kelas9/kesebangunan-kekongruenan/MenghitungRusukPage";
import SegitigaSebangunMMK9Page from "./pages/materi-matematika/kelas9/kesebangunan-kekongruenan/SegitigaSebangunPage";
import PerbandinganRusukSikuSikuMMK9Page from "./pages/materi-matematika/kelas9/kesebangunan-kekongruenan/PerbandinganRusukSikuSikuPage";
import KekongruenBangunDatarMMK9Page from "./pages/materi-matematika/kelas9/kesebangunan-kekongruenan/KekongruenBangunDatarPage";
import TransformasiGeometriMMK9Page from "./pages/materi-matematika/kelas9/TransformasiGeometriPage";
import TranslasiMMK9Page from "./pages/materi-matematika/kelas9/transformasi-geometri/TranslasiPage";
import RefleksiMMK9Page from "./pages/materi-matematika/kelas9/transformasi-geometri/RefleksiPage";
import RotasiMMK9Page from "./pages/materi-matematika/kelas9/transformasi-geometri/RotasiPage";
import DilatasisMMK9Page from "./pages/materi-matematika/kelas9/transformasi-geometri/DilatasisPage";
import BangunRuangSisiLengkungMMK9Page from "./pages/materi-matematika/kelas9/BangunRuangSisiLengkungPage";
import TabungMMK9Page from "./pages/materi-matematika/kelas9/bangun-ruang-sisi-lengkung/TabungPage";
import KerucutMMK9Page from "./pages/materi-matematika/kelas9/bangun-ruang-sisi-lengkung/KerucutPage";
import BolaMMK9Page from "./pages/materi-matematika/kelas9/bangun-ruang-sisi-lengkung/BolaPage";
import PerubahanVolumeMMK9Page from "./pages/materi-matematika/kelas9/bangun-ruang-sisi-lengkung/PerubahanVolumePage";
import GabunganMMK9Page from "./pages/materi-matematika/kelas9/bangun-ruang-sisi-lengkung/GabunganPage";
import StatistikaMMK9Page from "./pages/materi-matematika/kelas9/StatistikaPage";
import PengantarStatistikaMMK9Page from "./pages/materi-matematika/kelas9/statistika/PengantarStatistikaPage";
import PenyajianDataMMK9Page from "./pages/materi-matematika/kelas9/statistika/PenyajianDataPage";
import RataRataMMK9Page from "./pages/materi-matematika/kelas9/statistika/RataRataPage";
import MedianModusMMK9Page from "./pages/materi-matematika/kelas9/statistika/MedianModusPage";
import KuartilMMK9Page from "./pages/materi-matematika/kelas9/statistika/KuartilPage";
import PenyebaranDataMMK9Page from "./pages/materi-matematika/kelas9/statistika/PenyebaranDataPage";
import PeluangMMK9Page from "./pages/materi-matematika/kelas9/PeluangPage";
import RuangSampelMMK9Page from "./pages/materi-matematika/kelas9/peluang/RuangSampelPage";
import PeluangEmpirikMMK9Page from "./pages/materi-matematika/kelas9/peluang/PeluangEmpirikPage";
import PeluangTeoretikMMK9Page from "./pages/materi-matematika/kelas9/peluang/PeluangTeoretikPage";
import FrekuensiHarapanMMK9Page from "./pages/materi-matematika/kelas9/peluang/FrekuensiHarapanPage";
import KomplementMMK9Page from "./pages/materi-matematika/kelas9/peluang/KomplementPage";
import PeluangKejadianMajemukMMK9Page from "./pages/materi-matematika/kelas9/peluang/PeluangKejadianMajemukPage";
import PersamaanKuadratMMK9Page from "./pages/materi-matematika/kelas9/PersamaanKuadratPage";
import PKMMBentukUmumPage from "./pages/materi-matematika/kelas9/persamaan-kuadrat/BentukUmumPage";
import PKMMPemfaktoranPage from "./pages/materi-matematika/kelas9/persamaan-kuadrat/PemfaktoranPage";
import PKMMRumusKuadratikPage from "./pages/materi-matematika/kelas9/persamaan-kuadrat/RumusKuadratikPage";
import PKMMPelengkapKuadratPage from "./pages/materi-matematika/kelas9/persamaan-kuadrat/PelengkapKuadratPage";
import PKMMDiskriminanPage from "./pages/materi-matematika/kelas9/persamaan-kuadrat/DiskriminanPage";
import PKMMMenyusunBaruPage from "./pages/materi-matematika/kelas9/persamaan-kuadrat/MenyusunPKBaruPage";
import PKMMPenerapanKontekstualPage from "./pages/materi-matematika/kelas9/persamaan-kuadrat/PenerapanKontekstualPage";
import FungsiKuadratMMK9Page from "./pages/materi-matematika/kelas9/FungsiKuadratPage";
import FKMMBentukUmumKarakteristikPage from "./pages/materi-matematika/kelas9/fungsi-kuadrat/BentukUmumKarakteristikPage";
import FKMMTitikPotongPage from "./pages/materi-matematika/kelas9/fungsi-kuadrat/TitikPotongPage";
import FKMMSumbuSimetriPage from "./pages/materi-matematika/kelas9/fungsi-kuadrat/SumbuSimetriPage";
import FKMMMenggambarGrafikPage from "./pages/materi-matematika/kelas9/fungsi-kuadrat/MenggambarGrafikPage";
import FKMMMenyusunFungsiPage from "./pages/materi-matematika/kelas9/fungsi-kuadrat/MenyusunFungsiPage";
import FKMMPenerapanNilaiMaksMinPage from "./pages/materi-matematika/kelas9/fungsi-kuadrat/PenerapanNilaiMaksMinPage";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

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
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/lkpd" element={<LKPDMenuPage />} />
      <Route path="/lkpd/kelas-7" element={<LKPDKelas7Page />} />
      <Route path="/lkpd/kelas-8" element={<LKPDKelas8Page />} />
      <Route path="/lkpd/kelas-9" element={<LKPDKelas9Page />} />
      <Route path="/lkpd/kelas-7/perbandingan" element={<LKPDPerbandinganPage />} />
      <Route path="/lkpd/kelas-7/perbandingan/umum" element={<LKPDPage />} />
      <Route path="/lkpd/kelas-7/perbandingan/bertingkat" element={<BertingkatLKPDPage />} />
      <Route path="/lkpd/kelas-7/perbandingan/senilai-berbalik" element={<SenilaiLKPDPage />} />
      <Route path="/lkpd/kelas-7/perbandingan/skala" element={<SkalaLKPDPage />} />
      <Route path="/lkpd/kelas-7/perbandingan/campuran" element={<CampuranLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-bulat" element={<BilanganBulatMenuPage />} />
      <Route path="/lkpd/kelas-7/bilangan-bulat/penjumlahan" element={<PenjumlahanLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-bulat/pengurangan" element={<PenguranganLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-bulat/perkalian" element={<PerkalianLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-bulat/pembagian" element={<PembagianLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-bulat/operasi-campuran" element={<OperasiCampuranLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-bulat/kpk-fpb" element={<KPKFPBLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-bulat/pesawat-tembak-meteor" element={<PesawatTembakMeteorPage />} />
      <Route path="/lkpd/kelas-7/bilangan-bulat/penjumlahan/pesawat-tembak-meteor" element={<PesawatTembakMeteorPenjumlahanPage />} />
      <Route path="/lkpd/kelas-7/bilangan-rasional" element={<BilanganRasionalMenuPage />} />
      <Route path="/lkpd/kelas-7/bilangan-rasional/arti-pecahan" element={<ArtiPecahanLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-rasional/pecahan-campuran" element={<PecahanCampuranLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-rasional/penjumlahan-pengurangan" element={<PenjumlahanPenguranganPecahanLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-rasional/perkalian" element={<PerkalianPecahanLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-rasional/pembagian" element={<PembagianPecahanLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-rasional/bentuk-desimal" element={<BentukDesimalLKPDPage />} />
      <Route path="/lkpd/kelas-7/bilangan-rasional/operasi-desimal" element={<OperasiDesimalLKPDPage />} />
      <Route path="/lkpd/kelas-7/aljabar" element={<AljabarMenuPage />} />
      <Route path="/lkpd/kelas-7/aljabar/pengertian-unsur" element={<PengertianUnsurAljabarLKPDPage />} />
      <Route path="/lkpd/kelas-7/aljabar/penjumlahan-pengurangan" element={<PenjumlahanPenguranganAljabarLKPDPage />} />
      <Route path="/lkpd/kelas-7/aljabar/perkalian-pembagian" element={<PerkalianPembagianAljabarLKPDPage />} />
      <Route path="/lkpd/kelas-7/aljabar/substitusi" element={<SubstitusiAljabarLKPDPage />} />
      <Route path="/lkpd/kelas-7/aljabar/faktorisasi" element={<FaktorisasiAljabarLKPDPage />} />
      <Route path="/lkpd/kelas-7/plsv-ptlsv" element={<PLSVPtLSVMenuPage />} />
      <Route path="/lkpd/kelas-7/plsv-ptlsv/kalimat-terbuka-tertutup" element={<KalimatTerbukaTertutupLKPDPage />} />
      <Route path="/lkpd/kelas-7/plsv-ptlsv/pengertian-plsv" element={<PengertianPLSVLKPDPage />} />
      <Route path="/lkpd/kelas-7/plsv-ptlsv/penyelesaian-plsv" element={<PenyelesaianPLSVLKPDPage />} />
      <Route path="/lkpd/kelas-7/plsv-ptlsv/model-matematika-plsv" element={<ModelMatematikaPLSVLKPDPage />} />
      <Route path="/lkpd/kelas-7/plsv-ptlsv/pengertian-ptlsv" element={<PengertianPtLSVLKPDPage />} />
      <Route path="/lkpd/kelas-7/plsv-ptlsv/penyelesaian-ptlsv" element={<PenyelesaianPtLSVLKPDPage />} />
      <Route path="/lkpd/kelas-7/plsv-ptlsv/model-matematika-ptlsv" element={<ModelMatematikaPtLSVLKPDPage />} />
      <Route path="/lkpd/kelas-7/aritmetika-sosial" element={<AritmetikaSosialMenuPage />} />
      <Route path="/lkpd/kelas-7/aritmetika-sosial/jual-beli-untung-rugi" element={<JualBeliUntungRugiLKPDPage />} />
      <Route path="/lkpd/kelas-7/aritmetika-sosial/diskon" element={<DiskonLKPDPage />} />
      <Route path="/lkpd/kelas-7/aritmetika-sosial/bruto-netto-tara" element={<BrutoNettoTaraLKPDPage />} />
      <Route path="/lkpd/kelas-7/aritmetika-sosial/bunga-tunggal" element={<BungaTunggalLKPDPage />} />
      <Route path="/lkpd/kelas-7/garis-dan-sudut" element={<GarisDanSudutMenuPage />} />
      <Route path="/lkpd/kelas-7/garis-dan-sudut/lkpd" element={<GarisDanSudutLKPDPage />} />
      <Route path="/lkpd/kelas-7/segitiga-dan-segiempat" element={<SegitigaDanSegiempatMenuPage />} />
      <Route path="/lkpd/kelas-7/segitiga-dan-segiempat/lkpd" element={<SegitigaDanSegiempatLKPDPage />} />
      <Route path="/lkpd/kelas-7/aritmetika-sosial/ppn" element={<PPNLKPDPage />} />
      <Route path="/lkpd/kelas-7/aritmetika-sosial/pph" element={<PPhLKPDPage />} />
      <Route path="/lkpd/kelas-7/himpunan" element={<HimpunanMenuPage />} />
      <Route path="/lkpd/kelas-7/himpunan/lkpd" element={<HimpunanLKPDPage />} />
      <Route path="/lkpd/kelas-7/*" element={<ComingSoonPage />} />
      <Route path="/lkpd/kelas-8/pola-bilangan" element={<PolaBilanganMenuPage />} />
      <Route path="/lkpd/kelas-8/pola-bilangan/lkpd" element={<PolaBilanganLKPDPage />} />
      <Route path="/lkpd/kelas-8/koordinat-cartesius" element={<KoordinatCartesiusLKPDMenuPage />} />
      <Route path="/lkpd/kelas-8/koordinat-cartesius/lkpd" element={<KoordinatCartesiusLKPDPage />} />
      <Route path="/lkpd/kelas-8/relasi-dan-fungsi" element={<RelasiFungsiLKPDMenuPage />} />
      <Route path="/lkpd/kelas-8/relasi-dan-fungsi/lkpd" element={<RelasiFungsiLKPDPage />} />
      <Route path="/lkpd/kelas-8/spldv" element={<SPLDVLKPDMenuPage />} />
      <Route path="/lkpd/kelas-8/spldv/lkpd" element={<SPLDVLKPDPage />} />
      <Route path="/lkpd/kelas-8/persamaan-garis-lurus" element={<PersamaanGarisLurusLKPDMenuPage />} />
      <Route path="/lkpd/kelas-8/persamaan-garis-lurus/lkpd" element={<PersamaanGarisLurusLKPDPage />} />
      <Route path="/lkpd/kelas-8/teorema-pythagoras" element={<TeoremaPythagorasLKPDMenuPage />} />
      <Route path="/lkpd/kelas-8/teorema-pythagoras/lkpd" element={<TeoremaPythagorasLKPDPage />} />
      <Route path="/lkpd/kelas-8/lingkaran" element={<LingkaranLKPDMenuPage />} />
      <Route path="/lkpd/kelas-8/lingkaran/lkpd" element={<LingkaranLKPDPage />} />
      <Route path="/lkpd/kelas-8/garis-singgung-lingkaran" element={<GarisSinggungLingkaranLKPDMenuPage />} />
      <Route path="/lkpd/kelas-8/bangun-ruang-sisi-datar" element={<BangunRuangSisiDatarLKPDMenuPage />} />
      <Route path="/lkpd/kelas-8/*" element={<ComingSoonPage />} />
      <Route path="/lkpd/kelas-9/bilangan-berpangkat" element={<BilanganBerpangkatLKPDMenuPage />} />
      <Route path="/lkpd/kelas-9/kesebangunan-kekongruenan" element={<KesebangunanKekongruenanLKPDMenuPage />} />
      <Route path="/lkpd/kelas-9/transformasi-geometri" element={<TransformasiGeometriLKPDMenuPage />} />
      <Route path="/lkpd/kelas-9/bangun-ruang-sisi-lengkung" element={<BangunRuangSisiLengkungLKPDMenuPage />} />
      <Route path="/lkpd/kelas-9/statistika" element={<StatistikaLKPDMenuPage />} />
      <Route path="/lkpd/kelas-9/peluang" element={<PeluangLKPDMenuPage />} />
      <Route path="/lkpd/kelas-9/persamaan-kuadrat" element={<PersamaanKuadratLKPDMenuPage />} />
      <Route path="/lkpd/kelas-9/fungsi-kuadrat" element={<FungsiKuadratLKPDMenuPage />} />
      <Route path="/lkpd/kelas-9/*" element={<ComingSoonPage />} />
      <Route path="/atp" element={<ATPPage />} />
      <Route path="/ruang-untuk-guru" element={<RuangUntukGuruPage />} />
      <Route path="/ruang-untuk-guru/numatik-game" element={<NumatikGamePage />} />
      <Route path="/ruang-untuk-guru/keyakinan-kelas" element={<KeyakinanKelasPage />} />
      <Route path="/ruang-untuk-guru/penilaian-pembelajaran" element={<PenilaianPembelajaranPage />} />
      <Route path="/ruang-untuk-guru/rpp" element={<RPPPage />} />
      <Route path="/ruang-untuk-guru/rpp/bilangan-bulat" element={<RPPBilanganBulatPage />} />
      <Route path="/ruang-untuk-guru/rpp/bilangan-bulat/penjumlahan" element={<RPPPenjumlahanBilanganBulatPage />} />
      <Route path="/ulangan-harian" element={<UlanganHarianPage />} />
      <Route path="/pesan-kesan" element={<PesanKesanPage />} />
      <Route path="/petunjuk" element={<PetunjukPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/referensi" element={<ReferensiPage />} />
      <Route path="/kalkulator-scientific" element={<KalkulatorScientificPage />} />
      <Route path="/kumpulan-rumus" element={<KumpulanRumusPage />} />
      <Route path="/konversi-satuan" element={<KonversiSatuanPage />} />
      <Route path="/video-pembelajaran" element={<VideoPembelajaranPage />} />
      <Route path="/donasi" element={<DonasiPage />} />
      <Route path="/biografi" element={<BiografiPage />} />
      <Route path="/olimpiade" element={<OlimpiadePage />} />
      <Route path="/olimpiade/bilangan-bulat" element={<OlimpiadeBilanganBulatPage />} />
      <Route path="/olimpiade/bilangan-rasional" element={<OlimpiadeBilanganRasionalPage />} />
      <Route path="/olimpiade/bilangan-berpangkat" element={<OlimpiadeBilanganBerpangkatPage />} />
      <Route path="/olimpiade/statistika" element={<OlimpiadeStatistikaPage />} />
      <Route path="/olimpiade/bilangan-irasional" element={<OlimpiadeBilanganIrasionalPage />} />
      <Route path="/olimpiade/kpk-fpb" element={<OlimpiadeKPKFPBPage />} />
      <Route path="/olimpiade/modulo" element={<OlimpiadeModuloPage />} />
      <Route path="/olimpiade/himpunan" element={<OlimpiadeHimpunanPage />} />
      <Route path="/olimpiade/relasi-fungsi" element={<OlimpiadeRelasiFungsiPage />} />
      <Route path="/olimpiade/perbandingan" element={<OlimpiadePerbandinganPage />} />
      <Route path="/olimpiade/aljabar" element={<OlimpiadeAljabarPage />} />
      <Route path="/olimpiade/pola-bilangan" element={<OlimpiadePolaBilanganPage />} />
      <Route path="/olimpiade/spldv" element={<OlimpiadeSPLDVPage />} />
      <Route path="/olimpiade/garis-sudut" element={<OlimpiadeGarisSudutPage />} />
      <Route path="/olimpiade/koordinat-cartesius" element={<OlimpiadeKoordinatCartesiusPage />} />
      <Route path="/olimpiade/teorema-pythagoras" element={<OlimpiadeTeoremaPage />} />
      <Route path="/olimpiade/segitiga-segiempat" element={<OlimpiadeSegitigaSegiempatPage />} />
      <Route path="/olimpiade/lingkaran" element={<OlimpiadeLingkaranPage />} />
      <Route path="/olimpiade/bangun-ruang-sisi-datar" element={<OlimpiadeBangunRuangSisiDatarPage />} />
      <Route path="/olimpiade/bangun-ruang-sisi-lengkung" element={<OlimpiadeBangunRuangSisiLengkungPage />} />
      <Route path="/olimpiade/plsv" element={<OlimpiadePLSVPage />} />
      <Route path="/olimpiade/persamaan-garis" element={<OlimpiadePersamaanGarisPage />} />
      <Route path="/olimpiade/persamaan-kuadrat" element={<OlimpiadePersamaanKuadratPage />} />
      <Route path="/olimpiade/fungsi-kuadrat" element={<OlimpiadeFungsiKuadratPage />} />
      <Route path="/olimpiade/aritmetika-sosial" element={<OlimpiadeAritmetikaSosialPage />} />
      <Route path="/olimpiade/kesebangunan" element={<OlimpiadeKesebangunanPage />} />
      <Route path="/olimpiade/transformasi-geometri" element={<OlimpiadeTransformasiPage />} />
      <Route path="/olimpiade/peluang" element={<OlimpiadePeluangPage />} />
      <Route path="/tka" element={<TKAPage />} />
      <Route path="/tka/tips" element={<TKATipsPage />} />
      <Route path="/tka/paket-1" element={<TKALatihan1Page />} />
      <Route path="/tka/paket-2" element={<TKALatihan2Page />} />
      <Route path="/tka/paket-3" element={<TKALatihan3Page />} />
      <Route path="/tka/paket-4" element={<TKALatihan4Page />} />
      <Route path="/tka/paket-5" element={<TKALatihan5Page />} />
      <Route path="/papan-peringkat" element={<PapanPeringkatPage />} />
      <Route path="/bank-soal" element={<BankSoalPage />} />
      <Route path="/bank-soal/bilangan-bulat" element={<BankSoalBilanganBulatPage />} />
      <Route path="/bank-soal/bilangan-rasional" element={<BankSoalBilanganRasionalPage />} />
      <Route path="/bank-soal/segitiga-dan-segiempat" element={<BankSoalSegitigaSegiempatPage />} />
      <Route path="/bank-soal/himpunan" element={<BankSoalHimpunanPage />} />
      <Route path="/bank-soal/koordinat-cartesius" element={<BankSoalKoordinatCartesiusPage />} />
      <Route path="/bank-soal/aljabar" element={<BankSoalAljabarPage />} />
      <Route path="/bank-soal/plsv" element={<BankSoalPLSVPage />} />
      <Route path="/bank-soal/perbandingan" element={<BankSoalPerbandinganPage />} />
      <Route path="/bank-soal/aritmetika-sosial" element={<BankSoalAritmetikaSosialPage />} />
      <Route path="/bank-soal/pola-bilangan" element={<BankSoalPolaBilanganPage />} />
      <Route path="/bank-soal/relasi-fungsi" element={<BankSoalRelasiFungsiPage />} />
      <Route path="/bank-soal/garis-sudut" element={<BankSoalGarisSudutPage />} />
      <Route path="/bank-soal/spldv" element={<BankSoalSPLDVPage />} />
      <Route path="/bank-soal/persamaan-garis-lurus" element={<BankSoalPersamaanGarisLurusPage />} />
      <Route path="/bank-soal/peluang" element={<BankSoalPeluangPage />} />
      <Route path="/bank-soal/teorema-pythagoras" element={<BankSoalTeoremaPythagorasPage />} />
      <Route path="/bank-soal/lingkaran" element={<BankSoalLingkaranPage />} />
      <Route path="/bank-soal/bangun-ruang-sisi-datar" element={<BankSoalBangunRuangSisiDatarPage />} />
      <Route path="/bank-soal/bangun-ruang-sisi-lengkung" element={<BankSoalBangunRuangSisiLengkungPage />} />
      <Route path="/bank-soal/bilangan-berpangkat" element={<BankSoalBilanganBerpangkatPage />} />
      <Route path="/bank-soal/persamaan-kuadrat" element={<BankSoalPersamaanKuadratPage />} />
      <Route path="/bank-soal/fungsi-kuadrat" element={<BankSoalFungsiKuadratPage />} />
      <Route path="/bank-soal/statistika" element={<BankSoalStatistikaPage />} />
      <Route path="/bank-soal/garis-singgung-lingkaran" element={<BankSoalGarisSinggungLingkaranPage />} />
      <Route path="/bank-soal/kesebangunan-kekongruenan" element={<BankSoalKesebangunanPage />} />
      <Route path="/bank-soal/transformasi-geometri" element={<BankSoalTransformasiGeometriPage />} />
      <Route path="/chat-ai" element={<ChatAIPage />} />
      <Route path="/pengaturan" element={<PengaturanPage />} />
      <Route path="/tentang-aplikasi" element={<TentangAplikasiPage />} />
      <Route path="/coming-soon" element={<ComingSoonPage />} />
      
      {/* Latihan Mandiri Routes */}
      <Route path="/latihan-mandiri" element={<LatihanMandiriPage />} />
      <Route path="/latihan-mandiri/kelas-7" element={<LatihanMandiriKelas7Page />} />
      <Route path="/latihan-mandiri/kelas-8" element={<LatihanMandiriKelas8Page />} />
      <Route path="/latihan-mandiri/kelas-9" element={<LatihanMandiriKelas9Page />} />
      
      {/* Kelas 7 Topic Routes */}
<Route path="/latihan-mandiri/kelas-7/bilangan-bulat" element={<BilanganBulatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-bulat/penjumlahan" element={<PenjumlahanBilanganBulatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-bulat/pengurangan" element={<PenguranganBilanganBulatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-bulat/perkalian" element={<PerkalianBilanganBulatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-bulat/pembagian" element={<PembagianBilanganBulatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-bulat/operasi-campuran" element={<OperasiCampuranBilanganBulatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-bulat/kpk-fpb" element={<KPKFPBBilanganBulatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional" element={<BilanganRasionalK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional/arti-pecahan-senilai-membandingkan" element={<ArtiPecahanSenilaiMembandingkanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional/pecahan-campuran-persen" element={<PecahanCampuranPersenK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional/penjumlahan-pecahan" element={<PenjumlahanPecahanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional/perkalian-pecahan" element={<PerkalianPecahanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional/pembagian-pecahan" element={<PembagianPecahanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional/bentuk-desimal" element={<BentukDesimalK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional/penjumlahan-pengurangan-desimal" element={<PenjumlahanPenguranganDesimalK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional/perkalian-desimal" element={<PerkalianDesimalK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional/pembagian-desimal" element={<PembagianDesimalK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/bilangan-rasional/pembulatan-desimal" element={<PembulatanDesimalK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aljabar" element={<AljabarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aljabar/pengertian-unsur" element={<PengertianUnsurAljabarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aljabar/penjumlahan-pengurangan" element={<PenjumlahanPenguranganAljabarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aljabar/perkalian" element={<PerkalianAljabarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aljabar/pembagian" element={<PembagianAljabarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aljabar/pemangkatan" element={<PemangkatanAljabarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aljabar/substitusi" element={<SubstitusiBilanganAljabarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aljabar/faktorisasi" element={<FaktorisasiAljabarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aljabar/pecahan-aljabar" element={<MenyederhanakanPecahanAljabarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/plsv-ptlsv" element={<PLSVPtLSVK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/plsv-ptlsv/kalimat-terbuka" element={<KalimatTerbukaTertutupK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/plsv-ptlsv/pengertian-plsv" element={<PengertianPLSVK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/plsv-ptlsv/penyelesaian-plsv" element={<PenyelesaianPLSVK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/plsv-ptlsv/model-matematika-plsv" element={<ModelMatematikaPLSVK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/plsv-ptlsv/penyelesaian-ptlsv" element={<PenyelesaianPtLSVK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/plsv-ptlsv/model-matematika-ptlsv" element={<ModelMatematikaPtLSVK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan" element={<PerbandinganK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan/umum" element={<PerbandinganUmumK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan/senilai" element={<PerbandinganSenilaiK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan/campuran" element={<PerbandinganCampuranK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan/bertingkat" element={<PerbandinganBertingkatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/perbandingan/skala" element={<PerbandinganSkalaK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aritmetika-sosial" element={<AritmetikaSosialK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aritmetika-sosial/jual-beli-untung-rugi" element={<JualBeliUntungRugiK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aritmetika-sosial/diskon" element={<DiskonK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aritmetika-sosial/bruto-netto-tara" element={<BrutoNettoTaraK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aritmetika-sosial/bunga-tunggal" element={<BungaTunggalK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aritmetika-sosial/ppn" element={<PPNK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/aritmetika-sosial/pph" element={<PPhK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/garis-dan-sudut" element={<GarisDanSudutK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/garis-dan-sudut/hubungan-2-garis" element={<HubunganDuaGarisK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/garis-dan-sudut/sudut-pelurus-penyiku-bertolak" element={<SudutPelurusPenyikuBertolakK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/garis-dan-sudut/sifat-sudut-dua-garis-sejajar" element={<SifatSudutDuaGarisSejajarK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/garis-dan-sudut/jumlah-sudut-segi-banyak" element={<JumlahSudutSegiBanyakK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/segitiga-dan-segiempat" element={<SegitigaSegiempatK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/segitiga-dan-segiempat/garis-berat-bagi-tinggi" element={<GarisBeratBagiTinggiLatihanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/segitiga-dan-segiempat/keliling-segitiga-dan-segiempat" element={<KelilingSegitigaSegiempatLatihanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/segitiga-dan-segiempat/luas-segitiga" element={<LuasSegitigaLatihanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/segitiga-dan-segiempat/luas-segiempat" element={<LuasSegiempatLatihanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/segitiga-dan-segiempat/keliling-luas-bangun-tak-beraturan" element={<KelilingLuasBangunTakBeraturanLatihanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/himpunan" element={<HimpunanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/himpunan/pengertian-keanggotaan" element={<PengertianKeanggotaanHimpunanLatihanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/himpunan/menyatakan-himpunan" element={<MenyatakanHimpunanLatihanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/himpunan/diagram-venn" element={<DiagramVennLatihanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/himpunan/himpunan-bagian" element={<HimpunanBagianLatihanK7Page />} />
      <Route path="/latihan-mandiri/kelas-7/himpunan/operasi-himpunan" element={<OperasiHimpunanLatihanK7Page />} />
      
      {/* Kelas 8 Topic Routes */}
      <Route path="/latihan-mandiri/kelas-8/pola-bilangan" element={<PolaBilanganK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/pola-bilangan/pengertian-pola" element={<PengertianPolaK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/pola-bilangan/pola-khusus" element={<PolaKhususK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/pola-bilangan/pola-aritmetika" element={<PolaAritmetikaK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/pola-bilangan/pola-geometri" element={<PolaGeometriK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/koordinat-cartesius" element={<KoordinatCartesiusK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/koordinat-cartesius/unsur-unsur" element={<UnsurUnsurCartesiusK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/koordinat-cartesius/posisi-relatif-titik-acuan" element={<PosisiRelatifTitikAcuanK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/koordinat-cartesius/jarak-titik-garis" element={<JarakTitikGarisK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/koordinat-cartesius/posisi-relatif" element={<PosisiRelatifGarisK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/relasi-dan-fungsi" element={<RelasiFungsiK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/relasi-dan-fungsi/pengertian-relasi" element={<PengertianRelasiK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/relasi-dan-fungsi/pengertian-fungsi" element={<PengertianFungsiK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/relasi-dan-fungsi/banyak-fungsi" element={<BanyakFungsiK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/relasi-dan-fungsi/notasi-fungsi" element={<NotasiFungsiK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/relasi-dan-fungsi/grafik-fungsi" element={<GrafikFungsiK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/spldv" element={<SPLDVK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/spldv/definisi" element={<DefinisiSPLDVK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/spldv/metode-grafik" element={<MetodeGrafikSPLDVK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/spldv/metode-substitusi" element={<MetodeSubstitusiSPLDVK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/spldv/metode-eliminasi" element={<MetodeEliminasiSPLDVK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/spldv/metode-campuran" element={<MetodeCampuranSPLDVK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/spldv/model-spldv" element={<ModelSPLDVK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/spldv/penyelesaian-masalah" element={<PenyelesaianMasalahSPLDVK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/persamaan-garis-lurus" element={<PersamaanGarisLurusK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/persamaan-garis-lurus/grafik" element={<GrafikPGLK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/persamaan-garis-lurus/gradien" element={<GradienK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/persamaan-garis-lurus/menentukan-pgl" element={<MenentukanPGLK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/persamaan-garis-lurus/hubungan-2-garis" element={<Hubungan2GarisK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/persamaan-garis-lurus/aplikasi-kontekstual" element={<AplikasiKontekstualPGLK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/teorema-pythagoras" element={<TeoremaPythagorasK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/teorema-pythagoras/pembuktian" element={<PembuktianPythagorasK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/teorema-pythagoras/menghitung-panjang" element={<MenghitungPanjangPythagorasK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/teorema-pythagoras/triple-pythagoras" element={<TriplePythagorasK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/teorema-pythagoras/jenis-segitiga" element={<JenisSegitigaPythagorasK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/teorema-pythagoras/sudut-khusus" element={<SudutKhususPythagorasK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/teorema-pythagoras/masalah-kontekstual" element={<MasalahKontekstualPythagorasK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/lingkaran" element={<LingkaranK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/lingkaran/unsur-unsur" element={<UnsurUnsurLingkaranK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/lingkaran/keliling-luas" element={<KelilingLuasLingkaranK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/lingkaran/kaitan-bangun-datar" element={<KaitanBangunDatarLingkaranK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/lingkaran/busur-juring" element={<BusurJuringLingkaranK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/lingkaran/sudut-pusat-keliling" element={<SudutPusatKelilingLingkaranK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/lingkaran/penerapan-kontekstual" element={<PenerapanKontekstualLingkaranK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/garis-singgung-lingkaran" element={<GarisSinggungLingkaranK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/garis-singgung-lingkaran/pengertian" element={<PengertianGSLK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/garis-singgung-lingkaran/menghitung-panjang" element={<MenghitungPanjangGSLK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/garis-singgung-lingkaran/gspl" element={<GSPLK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/garis-singgung-lingkaran/gspd" element={<GSPDK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/garis-singgung-lingkaran/sabuk-lilitan" element={<SabukLilitanK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar" element={<BangunRuangSisiDatarK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar/kubus" element={<KubusLMK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar/balok" element={<BalokLMK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar/prisma" element={<PrismaLMK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar/limas" element={<LimasLMK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar/masalah-kontekstual" element={<MasalahKontekstualBRSDLMK8Page />} />
      <Route path="/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar-gabungan" element={<BRSDGabunganLMK8Page />} />
      
      {/* Kelas 9 Topic Routes */}
      <Route path="/latihan-mandiri/kelas-9/bilangan-berpangkat" element={<BilanganBerpangkatK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bilangan-berpangkat/pengertian-notasi" element={<PengertianNotasiK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bilangan-berpangkat/sifat-sifat" element={<SifatSifatK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bilangan-berpangkat/pangkat-nol-negatif-pecahan" element={<PangkatNolNegatifPecahanK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bilangan-berpangkat/bentuk-akar" element={<BentukAkarK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bilangan-berpangkat/notasi-ilmiah" element={<NotasiIlmiahK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/kesebangunan-kekongruenan" element={<KesebangunanKekongruenK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/kesebangunan-kekongruenan/definisi" element={<DefinisiKesebangunanK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/kesebangunan-kekongruenan/menghitung-rusuk" element={<MenghitungRusukK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/kesebangunan-kekongruenan/segitiga-sebangun" element={<SegitigaSebangunK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/kesebangunan-kekongruenan/rasio-rusuk" element={<RasioRusukK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/kesebangunan-kekongruenan/kekongruenan" element={<KekongruenBangunDatarK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/transformasi-geometri" element={<TransformasiGeometriK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/transformasi-geometri/translasi" element={<TranslasiK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/transformasi-geometri/refleksi" element={<RefleksiK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/transformasi-geometri/rotasi" element={<RotasiK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/transformasi-geometri/dilatasi" element={<DilatsiK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung" element={<BangunRuangSisiLengkungK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/tabung" element={<TabungLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/kerucut" element={<KerucutLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/bola" element={<BolaLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/perubahan-volume" element={<PerubahanVolumeLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung/gabungan" element={<GabunganLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/statistika" element={<StatistikaK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/statistika/pengantar" element={<PengantarStatistikaLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/statistika/penyajian-data" element={<PenyajianDataLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/statistika/rata-rata" element={<RataRataLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/statistika/median-modus" element={<MedianModusLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/statistika/kuartil" element={<KuartilLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/statistika/penyebaran-data" element={<PenyebaranDataLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/peluang" element={<PeluangK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/peluang/ruang-sampel" element={<RuangSampelLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/peluang/peluang-empirik" element={<PeluangEmpirikLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/peluang/peluang-teoretik" element={<PeluangTeoretikLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/peluang/frekuensi-harapan" element={<FrekuensiHarapanLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/peluang/komplemen" element={<KomplementLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/peluang/kejadian-majemuk" element={<PeluangKejadianMajemukLMK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/persamaan-kuadrat" element={<PersamaanKuadratK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/persamaan-kuadrat/bentuk-umum" element={<PKBentukUmumPage />} />
      <Route path="/latihan-mandiri/kelas-9/persamaan-kuadrat/pemfaktoran" element={<PKPemfaktoranPage />} />
      <Route path="/latihan-mandiri/kelas-9/persamaan-kuadrat/rumus-kuadratik" element={<PKRumusKuadratikPage />} />
      <Route path="/latihan-mandiri/kelas-9/persamaan-kuadrat/pelengkap-kuadrat" element={<PKPelengkapKuadratPage />} />
      <Route path="/latihan-mandiri/kelas-9/persamaan-kuadrat/diskriminan" element={<PKDiskriminanPage />} />
      <Route path="/latihan-mandiri/kelas-9/persamaan-kuadrat/menyusun-persamaan-baru" element={<PKMenyusunBaruPage />} />
      <Route path="/latihan-mandiri/kelas-9/persamaan-kuadrat/penerapan-kontekstual" element={<PKPenerapanKontekstualPage />} />
      <Route path="/latihan-mandiri/kelas-9/fungsi-kuadrat" element={<FungsiKuadratK9Page />} />
      <Route path="/latihan-mandiri/kelas-9/fungsi-kuadrat/bentuk-umum-karakteristik" element={<FKBentukUmumKarakteristikPage />} />
      <Route path="/latihan-mandiri/kelas-9/fungsi-kuadrat/titik-potong" element={<FKTitikPotongPage />} />
      <Route path="/latihan-mandiri/kelas-9/fungsi-kuadrat/sumbu-simetri" element={<FKSumbuSimetriPage />} />
      <Route path="/latihan-mandiri/kelas-9/fungsi-kuadrat/menggambar-grafik" element={<FKMenggambarGrafikPage />} />
      <Route path="/latihan-mandiri/kelas-9/fungsi-kuadrat/menyusun-fungsi" element={<FKMenyusunFungsiPage />} />
      <Route path="/latihan-mandiri/kelas-9/fungsi-kuadrat/penerapan-nilai-maks-min" element={<FKPenerapanNilaiMaksMinPage />} />

      {/* Math Game Arena Routes */}
      <Route path="/math-game-arena" element={<MathGameArenaPage />} />
      <Route path="/math-game-arena/kelas-7" element={<MathGameArenaKelas7Page />} />
      <Route path="/math-game-arena/kelas-8" element={<MathGameArenaKelas8Page />} />
      <Route path="/math-game-arena/kelas-9" element={<MathGameArenaKelas9Page />} />
      <Route path="/math-game-arena/umum" element={<MathGameArenaUmumPage />} />
      <Route path="/math-game-arena/umum/balap-mobil" element={<CarRacingGamePage />} />
      <Route path="/math-game-arena/umum/tetris" element={<TetrisGamePage />} />
      <Route path="/math-game-arena/umum/dino-run" element={<DinoRunGamePage />} />
      <Route path="/math-game-arena/umum/flappy-rocket" element={<FlappyRocketPage />} />
      <Route path="/math-game-arena/umum/tangkap-benda" element={<CatchItemsGamePage />} />
      <Route path="/math-game-arena/umum/snake-math" element={<SnakeMathPage />} />
      <Route path="/math-game-arena/umum/asteroid-blaster" element={<AsteroidBlasterPage />} />
      <Route path="/math-game-arena/umum/bubble-pop" element={<BubblePopPage />} />
      <Route path="/math-game-arena/umum/hajar-mol" element={<MolSmashPage />} />
      <Route path="/math-game-arena/umum/mancing-soal" element={<FishingMathPage />} />
      <Route path="/math-game-arena/umum/pecah-jawaban" element={<BrickBreakerPage />} />
      <Route path="/math-game-arena/umum/tembak-tank" element={<BattleTankPage />} />
      <Route path="/math-game-arena/umum/kereta-koin-math" element={<CoinTrainMathPage />} />
      <Route path="/math-game-arena/umum/ninja-buah-math" element={<FruitNinjaMathPage />} />
      <Route path="/math-game-arena/umum/pulau-harta-math" element={<TreasureIslandMathPage />} />
      <Route path="/math-game-arena/umum/kapal-selam-math-battle" element={<SubmarineBattleMathPage />} />
      <Route path="/math-game-arena/umum/lompat-jawaban" element={<PlatformJumpMathPage />} />
      <Route path="/math-game-arena/umum/ksatria-mat" element={<KsatriaMatPage />} />
      <Route path="/math-game-arena/umum/space-impact" element={<SpaceImpactPage />} />
      <Route path="/math-game-arena/umum/galaxy-defender" element={<GalaxyDefenderPage />} />
      <Route path="/math-game-arena/umum/math-bros" element={<MathBrosPage />} />
      <Route path="/math-game-arena/umum/zuma-math" element={<ZumaMathPage />} />
      <Route path="/math-game-arena/umum/pacman-math" element={<PacmanMathPage />} />
      <Route path="/math-game-arena/umum/bounce-math" element={<BounceMathPage />} />
      <Route path="/math-game-arena/umum/western-bar" element={<WesternBarPage />} />
      <Route path="/math-game-arena/umum/pinball-math" element={<PinballMathPage />} />
      <Route path="/math-game-arena/umum/penalti-math" element={<PenaltiMathPage />} />
      
      {/* Math Game Arena - Kelas 7 Topic Routes */}
      <Route path="/math-game-arena/kelas-7/bilangan-bulat" element={<BilanganBulatMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan" element={<PenjumlahanBilanganBulatGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/pesawat-tembak-meteor" element={<PenjumlahanMeteorGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/turtle-run" element={<PenjumlahanTurtleRunGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/flappy-rocket" element={<PenjumlahanFlappyRocketGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/tembak-tank" element={<PenjumlahanTembakTankGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/space-impact" element={<PenjumlahanSpaceImpactGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/tetris" element={<PenjumlahanTetrisGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan/snake-math" element={<PenjumlahanSnakeMathGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/pengurangan" element={<PenguranganBilanganBulatGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/perkalian" element={<PerkalianBilanganBulatGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/pembagian" element={<PembagianBilanganBulatGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran" element={<OperasiCampuranBilanganBulatGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb" element={<KPKFPBGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional" element={<BilanganRasionalMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/aljabar" element={<AljabarMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/plsv-ptlsv" element={<PLSVPtLSVMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/perbandingan" element={<PerbandinganMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/aritmetika-sosial" element={<AritmetikaSosialMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/aritmetika-sosial/jual-beli-untung-rugi" element={<JualBeliUntungRugiGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/aritmetika-sosial/diskon" element={<DiskonGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/aritmetika-sosial/bruto-netto-tara" element={<BrutoNettoTaraGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/aritmetika-sosial/ppn" element={<PPNGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/aritmetika-sosial/pph" element={<PPhGameMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/aritmetika-sosial/bunga-tunggal" element={<BungaTunggalGamePage />} />
      <Route path="/math-game-arena/kelas-7/garis-dan-sudut" element={<GarisDanSudutMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/garis-dan-sudut/hubungan-2-garis" element={<HubunganDuaGarisGamePage />} />
      <Route path="/math-game-arena/kelas-7/garis-dan-sudut/sudut-pelurus-penyiku" element={<SudutPelurusGamePage />} />
      <Route path="/math-game-arena/kelas-7/garis-dan-sudut/sifat-sudut-sejajar" element={<SifatSudutSejajarGamePage />} />
      <Route path="/math-game-arena/kelas-7/garis-dan-sudut/jumlah-sudut-segibanyak" element={<JumlahSudutSegibanyakGamePage />} />
      <Route path="/math-game-arena/kelas-7/segitiga-dan-segiempat" element={<SegitigaSegiempatMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/segitiga-dan-segiempat/garis-berat-bagi-tinggi" element={<GarisBeratBagiTinggiGamePage />} />
      <Route path="/math-game-arena/kelas-7/segitiga-dan-segiempat/keliling" element={<KelilingSegitigaSegiempatGamePage />} />
      <Route path="/math-game-arena/kelas-7/segitiga-dan-segiempat/luas-segitiga" element={<LuasSegitigaGamePage />} />
      <Route path="/math-game-arena/kelas-7/segitiga-dan-segiempat/luas-segiempat" element={<LuasSegiempatGamePage />} />
      <Route path="/math-game-arena/kelas-7/segitiga-dan-segiempat/bangun-tak-beraturan" element={<BangunTakBeraturanGamePage />} />
      <Route path="/math-game-arena/kelas-7/himpunan" element={<HimpunanMGAK7Page />} />
      <Route path="/math-game-arena/kelas-7/himpunan/pengertian-keanggotaan" element={<PengertianKeanggotaanHimpunanGamePage />} />
      <Route path="/math-game-arena/kelas-7/himpunan/himpunan-berhingga-kosong" element={<HimpunanBerhingaKosongGamePage />} />
      <Route path="/math-game-arena/kelas-7/himpunan/diagram-venn" element={<DiagramVennGamePage />} />
      <Route path="/math-game-arena/kelas-7/himpunan/pemecahan-masalah" element={<PemecahanMasalahHimpunanGamePage />} />

      {/* Math Game Arena - Kelas 7 Pecahan Sub-game Routes */}
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/arti-pecahan" element={<ArtiPecahanGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/pecahan-campuran" element={<PecahanCampuranGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/penjumlahan-pecahan" element={<PenjumlahanPecahanGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/pengurangan-pecahan" element={<PenguranganPecahanGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/perkalian-pecahan" element={<PerkalianPecahanGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/pembagian-pecahan" element={<PembagianPecahanGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/bentuk-desimal" element={<BentukDesimalGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/penjumlahan-desimal" element={<PenjumlahanDesimalGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/pengurangan-desimal" element={<PenguranganDesimalGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/perkalian-desimal" element={<PerkalianDesimalGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/pembagian-desimal" element={<PembagianDesimalGamePage />} />
      <Route path="/math-game-arena/kelas-7/bilangan-rasional/pembulatan-desimal" element={<PembulatanDesimalGamePage />} />

      {/* Math Game Arena - Kelas 7 Aljabar Sub-game Routes */}
      <Route path="/math-game-arena/kelas-7/aljabar/pengertian-unsur" element={<PengertianUnsurAljabarGamePage />} />
      <Route path="/math-game-arena/kelas-7/aljabar/penjumlahan-pengurangan" element={<PenjumlahanPenguranganAljabarGamePage />} />
      <Route path="/math-game-arena/kelas-7/aljabar/perkalian" element={<PerkalianAljabarGamePage />} />
      <Route path="/math-game-arena/kelas-7/aljabar/pembagian" element={<PembagianAljabarGamePage />} />
      <Route path="/math-game-arena/kelas-7/aljabar/pemangkatan" element={<PemangkatanAljabarGamePage />} />
      <Route path="/math-game-arena/kelas-7/aljabar/substitusi" element={<SubstitusiAljabarGamePage />} />
      <Route path="/math-game-arena/kelas-7/aljabar/faktorisasi" element={<FaktorisasiAljabarGamePage />} />
      <Route path="/math-game-arena/kelas-7/aljabar/operasi-pecahan" element={<OperasiPecahanAljabarGamePage />} />

      {/* Math Game Arena - Kelas 7 PLSV Sub-game Routes */}
      <Route path="/math-game-arena/kelas-7/plsv-ptlsv/kalimat-terbuka" element={<KalimatTerbukaGamePage />} />
      <Route path="/math-game-arena/kelas-7/plsv-ptlsv/pengertian-plsv" element={<PengertianPLSVGamePage />} />
      <Route path="/math-game-arena/kelas-7/plsv-ptlsv/penyelesaian-plsv" element={<PenyelesaianPLSVGamePage />} />
      <Route path="/math-game-arena/kelas-7/plsv-ptlsv/model-matematika-plsv" element={<ModelMatematikaPLSVGamePage />} />
      <Route path="/math-game-arena/kelas-7/plsv-ptlsv/pengertian-ptlsv" element={<PengertianPtLSVGamePage />} />
      <Route path="/math-game-arena/kelas-7/plsv-ptlsv/penyelesaian-ptlsv" element={<PenyelesaianPtLSVGamePage />} />
      <Route path="/math-game-arena/kelas-7/plsv-ptlsv/model-matematika-ptlsv" element={<ModelMatematikaPtLSVGamePage />} />

      {/* Math Game Arena - Kelas 7 Perbandingan Sub-game Routes */}
      <Route path="/math-game-arena/kelas-7/perbandingan/perbandingan-umum" element={<PerbandinganUmumGamePage />} />
      <Route path="/math-game-arena/kelas-7/perbandingan/perbandingan-senilai" element={<PerbandinganSenilaiGamePage />} />
      <Route path="/math-game-arena/kelas-7/perbandingan/perbandingan-campuran" element={<PerbandinganCampuranGamePage />} />
      <Route path="/math-game-arena/kelas-7/perbandingan/perbandingan-bertingkat" element={<PerbandinganBertingkatGamePage />} />
      <Route path="/math-game-arena/kelas-7/perbandingan/skala" element={<SkalaGamePage />} />
      
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
      {/* Kelas 8 - Pola Bilangan Games */}
      <Route path="/math-game-arena/kelas-8/pola-bilangan/pengertian-pola" element={<PengertianPolaK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/pola-bilangan/pola-khusus" element={<PolaKhususK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/pola-bilangan/pola-aritmetika" element={<PolaAritmetikaK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/pola-bilangan/pola-geometri" element={<PolaGeometriK8GamePage />} />
      {/* Kelas 8 - Koordinat Cartesius Games */}
      <Route path="/math-game-arena/kelas-8/koordinat-cartesius/unsur-unsur" element={<UnsurUnsurCartesiusK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/koordinat-cartesius/jarak-titik" element={<JarakTitikK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/koordinat-cartesius/posisi-relatif" element={<PosisiRelatifK8GamePage />} />
      {/* Kelas 8 - Relasi dan Fungsi Games */}
      <Route path="/math-game-arena/kelas-8/relasi-dan-fungsi/pengertian-relasi" element={<PengertianRelasiK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/relasi-dan-fungsi/pengertian-fungsi" element={<PengertianFungsiK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/relasi-dan-fungsi/banyak-fungsi" element={<BanyakFungsiK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/relasi-dan-fungsi/notasi-rumus" element={<NotasiRumusK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/relasi-dan-fungsi/grafik-fungsi" element={<GrafikFungsiK8GamePage />} />
      {/* Kelas 8 - SPLDV Games */}
      <Route path="/math-game-arena/kelas-8/spldv/definisi-spldv" element={<DefinisiSPLDVK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/spldv/metode-grafik" element={<MetodeGrafikK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/spldv/metode-substitusi" element={<MetodeSubstitusiK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/spldv/metode-eliminasi" element={<MetodeEliminasiK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/spldv/metode-campuran" element={<MetodeCampuranK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/spldv/model-spldv" element={<ModelSPLDVK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/spldv/penyelesaian-masalah" element={<PenyelesaianMasalahSPLDVK8GamePage />} />
      {/* Kelas 8 - Persamaan Garis Lurus Games */}
      <Route path="/math-game-arena/kelas-8/persamaan-garis-lurus/grafik-pgl" element={<GrafikPGLK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/persamaan-garis-lurus/gradien" element={<GradienK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/persamaan-garis-lurus/menentukan-pgl" element={<MenentukanPGLK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/persamaan-garis-lurus/hubungan-2-garis" element={<Hubungan2GarisK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/persamaan-garis-lurus/aplikasi-kontekstual" element={<AplikasiKontekstualPGLK8GamePage />} />
      {/* Kelas 8 - Teorema Pythagoras Games */}
      <Route path="/math-game-arena/kelas-8/teorema-pythagoras/pembuktian" element={<PembuktianPythagorasK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/teorema-pythagoras/menghitung-panjang" element={<MenghitungPanjangK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/teorema-pythagoras/triple-pythagoras" element={<TriplePythagorasK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/teorema-pythagoras/jenis-segitiga" element={<JenisSegitigaK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/teorema-pythagoras/sudut-khusus" element={<SudutKhususK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/teorema-pythagoras/penerapan-kontekstual" element={<PenerapanKontekstualPythagorasK8GamePage />} />
      {/* Kelas 8 - Lingkaran Games */}
      <Route path="/math-game-arena/kelas-8/lingkaran/unsur-unsur" element={<UnsurUnsurLingkaranK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/lingkaran/keliling-luas" element={<KelilingLuasLingkaranK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/lingkaran/kaitan-bangun-datar" element={<KaitanBangunDatarK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/lingkaran/busur-juring" element={<BusurJuringK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/lingkaran/sudut-pusat-keliling" element={<SudutPusatKelilingK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/lingkaran/penerapan-kontekstual" element={<PenerapanKontekstualLingkaranK8GamePage />} />
      {/* Kelas 8 - Garis Singgung Lingkaran Games */}
      <Route path="/math-game-arena/kelas-8/garis-singgung-lingkaran/pengertian-sifat" element={<PengertianSifatGSLK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/garis-singgung-lingkaran/panjang-garis-singgung" element={<PanjangGarisSinggungK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/garis-singgung-lingkaran/gspl" element={<GSPLK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/garis-singgung-lingkaran/gspd" element={<GSPDK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/garis-singgung-lingkaran/sabuk-lilitan" element={<SabukLilitanK8GamePage />} />
      {/* Kelas 8 - Bangun Ruang Sisi Datar Games */}
      <Route path="/math-game-arena/kelas-8/bangun-ruang-sisi-datar/balok-game" element={<BalokK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/bangun-ruang-sisi-datar/prisma-game" element={<PrismaK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/bangun-ruang-sisi-datar/limas-game" element={<LimasK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/bangun-ruang-sisi-datar/gabungan-game" element={<GabunganBRSDK8GamePage />} />
      <Route path="/math-game-arena/kelas-8/bangun-ruang-sisi-datar/kontekstual-game" element={<KontekstualBRSDK8GamePage />} />

      {/* Math Game Arena - Kelas 9 Topic Routes */}
      <Route path="/math-game-arena/kelas-9/bilangan-berpangkat" element={<BilanganBerpangkatMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/kesebangunan-kekongruenan" element={<KesebangunanKekongruenMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/transformasi-geometri" element={<TransformasiGeometriMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung" element={<BangunRuangSisiLengkungMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/statistika" element={<StatistikaMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/peluang" element={<PeluangMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/persamaan-kuadrat" element={<PersamaanKuadratMGAK9Page />} />
      <Route path="/math-game-arena/kelas-9/fungsi-kuadrat" element={<FungsiKuadratMGAK9Page />} />

      {/* Math Game Arena - Kelas 9 Game Routes - Bilangan Berpangkat */}
      <Route path="/math-game-arena/kelas-9/bilangan-berpangkat/pengertian-notasi" element={<PengertianNotasiMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/bilangan-berpangkat/sifat-operasi" element={<SifatOperasiMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/bilangan-berpangkat/bentuk-akar" element={<BentukAkarMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/bilangan-berpangkat/notasi-ilmiah" element={<NotasiIlmiahMGAK9GamePage />} />
      {/* Math Game Arena - Kelas 9 Game Routes - Kesebangunan & Kekongruenan */}
      <Route path="/math-game-arena/kelas-9/kesebangunan-kekongruenan/definisi" element={<DefinisiKesebangunanMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/kesebangunan-kekongruenan/menghitung-rusuk" element={<MenghitungRusukMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/kesebangunan-kekongruenan/segitiga-sebangun" element={<SegitigaSebangunMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/kesebangunan-kekongruenan/rasio-rusuk" element={<RasioRusukMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/kesebangunan-kekongruenan/kekongruenan-bangun-datar" element={<KekongruenBangunDatarMGAK9GamePage />} />
      {/* Math Game Arena - Kelas 9 Game Routes - Transformasi Geometri */}
      <Route path="/math-game-arena/kelas-9/transformasi-geometri/translasi" element={<TranslasiMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/transformasi-geometri/refleksi" element={<RefleksiMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/transformasi-geometri/rotasi" element={<RotasiMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/transformasi-geometri/dilatasi" element={<DilatasiMGAK9GamePage />} />
      {/* Math Game Arena - Kelas 9 Game Routes - Bangun Ruang Sisi Lengkung */}
      <Route path="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung/tabung" element={<TabungMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung/kerucut" element={<KerucutMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung/bola" element={<BolaMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung/perubahan-luas-volume" element={<PerubahanLuasVolumeMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung/gabungan" element={<GabunganMGAK9GamePage />} />
      {/* Math Game Arena - Kelas 9 Game Routes - Statistika */}
      <Route path="/math-game-arena/kelas-9/statistika/pengantar" element={<PengantarStatistikaMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/statistika/penyajian-data" element={<PenyajianDataMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/statistika/rata-rata" element={<RataRataMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/statistika/median-modus" element={<MedianModusMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/statistika/kuartil" element={<KuartilMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/statistika/penyebaran-data" element={<PenyebaranDataMGAK9GamePage />} />
      {/* Math Game Arena - Kelas 9 Game Routes - Peluang */}
      <Route path="/math-game-arena/kelas-9/peluang/ruang-sampel" element={<RuangSampelMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/peluang/peluang-empirik" element={<PeluangEmpirikMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/peluang/peluang-teoretik" element={<PeluangTeoretikMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/peluang/frekuensi-harapan" element={<FrekuensiHarapanMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/peluang/komplemen" element={<KomplemenMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/peluang/kejadian-majemuk" element={<PeluangKejadianMajemukMGAK9GamePage />} />
      {/* Math Game Arena - Kelas 9 Game Routes - Persamaan Kuadrat */}
      <Route path="/math-game-arena/kelas-9/persamaan-kuadrat/bentuk-umum" element={<BentukUmumPKMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/persamaan-kuadrat/pemfaktoran" element={<PemfaktoranMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/persamaan-kuadrat/rumus-kuadratik" element={<RumusKuadratikMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/persamaan-kuadrat/pelengkap-kuadrat" element={<PelengkapKuadratMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/persamaan-kuadrat/diskriminan" element={<DiskriminanMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/persamaan-kuadrat/menyusun-persamaan" element={<MenyusunPersamaanMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/persamaan-kuadrat/penerapan" element={<PenerapanPKMGAK9GamePage />} />
      {/* Math Game Arena - Kelas 9 Game Routes - Fungsi Kuadrat */}
      <Route path="/math-game-arena/kelas-9/fungsi-kuadrat/bentuk-umum-karakteristik" element={<BentukUmumKarakteristikMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/fungsi-kuadrat/titik-potong" element={<TitikPotongMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/fungsi-kuadrat/sumbu-simetri" element={<SumbuSimetriMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/fungsi-kuadrat/menggambar-grafik" element={<MenggambarGrafikMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/fungsi-kuadrat/menyusun-fungsi" element={<MenyusunFungsiMGAK9GamePage />} />
      <Route path="/math-game-arena/kelas-9/fungsi-kuadrat/penerapan" element={<PenerapanFKMGAK9GamePage />} />

      {/* Materi Matematika Routes */}
      <Route path="/materi-matematika" element={<MateriMatematikaPage />} />
      <Route path="/materi-matematika/kelas-7" element={<MateriMatematikaKelas7Page />} />
      <Route path="/materi-matematika/kelas-8" element={<MateriMatematikaKelas8Page />} />
      <Route path="/materi-matematika/kelas-9" element={<MateriMatematikaKelas9Page />} />
      
      {/* Materi Matematika - Kelas 7 Topic Routes */}
      <Route path="/materi-matematika/kelas-7/bilangan-bulat" element={<BilanganBulatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-bulat/penjumlahan" element={<PenjumlahanBilanganBulatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-bulat/pengurangan" element={<PenguranganBilanganBulatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-bulat/perkalian" element={<PerkalianBilanganBulatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-bulat/pembagian" element={<PembagianBilanganBulatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-bulat/operasi-campuran" element={<OperasiCampuranBilanganBulatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-bulat/kpk-fpb" element={<KPKFPBBilanganBulatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional" element={<BilanganRasionalMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional/arti-pecahan" element={<ArtiPecahanMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional/pecahan-campuran" element={<PecahanCampuranMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan-pecahan" element={<PenjumlahanPenguranganMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional/perkalian-pecahan" element={<PerkalianPecahanMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional/pembagian-pecahan" element={<PembagianPecahanMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional/bentuk-desimal" element={<BentukDesimalMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan-bentuk-desimal" element={<PenjumlahanPenguranganBentukDesimalMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional/perkalian-bentuk-desimal" element={<PerkalianBentukDesimalMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional/pembagian-bentuk-desimal" element={<PembagianBentukDesimalMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/bilangan-rasional/pembulatan-bentuk-desimal" element={<PembulatanBentukDesimalMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aljabar" element={<AljabarMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aljabar/pengertian-unsur" element={<PengertianUnsurMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aljabar/penjumlahan-pengurangan" element={<PenjumlahanPenguranganAljabarMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aljabar/perkalian" element={<PerkalianAljabarMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aljabar/pembagian" element={<PembagianAljabarMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aljabar/pemangkatan" element={<PemangkatanAljabarMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aljabar/substitusi" element={<SubstitusiAljabarMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aljabar/faktorisasi" element={<FaktorisasiAljabarMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aljabar/operasi-pecahan" element={<OperasiPecahanAljabarMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/plsv-ptlsv" element={<PLSVPtLSVMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/plsv-ptlsv/kalimat-terbuka-tertutup" element={<KalimatTerbukaTertutupPage />} />
      <Route path="/materi-matematika/kelas-7/plsv-ptlsv/pengertian-plsv" element={<PengertianPLSVPage />} />
      <Route path="/materi-matematika/kelas-7/plsv-ptlsv/penyelesaian-plsv" element={<PenyelesaianPLSVPage />} />
      <Route path="/materi-matematika/kelas-7/plsv-ptlsv/model-matematika-plsv" element={<ModelMatematikaPLSVPage />} />
      <Route path="/materi-matematika/kelas-7/plsv-ptlsv/pengertian-ptlsv" element={<PengertianPtLSVPage />} />
      <Route path="/materi-matematika/kelas-7/plsv-ptlsv/penyelesaian-ptlsv" element={<PenyelesaianPtLSVPage />} />
      <Route path="/materi-matematika/kelas-7/plsv-ptlsv/model-matematika-ptlsv" element={<ModelMatematikaPtLSVPage />} />
      <Route path="/materi-matematika/kelas-7/perbandingan" element={<PerbandinganMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/perbandingan/umum" element={<PerbandinganUmumMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/perbandingan/senilai" element={<PerbandinganSenilaiMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/perbandingan/campuran" element={<PerbandinganCampuranMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/perbandingan/bertingkat" element={<PerbandinganBertingkatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/perbandingan/skala" element={<SkalaMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aritmetika-sosial" element={<AritmetikaSosialMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aritmetika-sosial/jual-beli-untung-rugi" element={<JualBeliUntungRugiMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aritmetika-sosial/diskon" element={<DiskonMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aritmetika-sosial/bruto-netto-tara" element={<BrutoNettoTaraMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aritmetika-sosial/bunga-tunggal" element={<BungaTunggalMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/aritmetika-sosial/ppn" element={<PPNMMk7Page />} />
      <Route path="/materi-matematika/kelas-7/aritmetika-sosial/pph" element={<PPhMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/garis-dan-sudut" element={<GarisDanSudutMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/garis-dan-sudut/hubungan-2-garis" element={<HubunganDuaGarisMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/garis-dan-sudut/sudut-pelurus-penyiku-bertolak" element={<SudutPelurusPenyikuBertolakMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/garis-dan-sudut/sifat-sudut-dua-garis-sejajar" element={<SifatSudutDuaGarisSejajarPage />} />
      <Route path="/materi-matematika/kelas-7/garis-dan-sudut/jumlah-sudut-segi-banyak" element={<JumlahSudutSegiBanyakPage />} />
      <Route path="/materi-matematika/kelas-7/segitiga-dan-segiempat" element={<SegitigaSegiempatMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/segitiga-dan-segiempat/garis-berat-bagi-tinggi" element={<GarisBeratBagiTinggiPage />} />
      <Route path="/materi-matematika/kelas-7/segitiga-dan-segiempat/keliling-segitiga-segiempat" element={<KelilingSegitigaSegiempatPage />} />
      <Route path="/materi-matematika/kelas-7/segitiga-dan-segiempat/luas-segitiga" element={<LuasSegitigaPage />} />
      <Route path="/materi-matematika/kelas-7/segitiga-dan-segiempat/luas-segiempat" element={<LuasSegiempatPage />} />
      <Route path="/materi-matematika/kelas-7/segitiga-dan-segiempat/keliling-luas-bangun-tak-beraturan" element={<KelilingLuasBangunTakBeraturanPage />} />
      <Route path="/materi-matematika/kelas-7/himpunan" element={<HimpunanMMK7Page />} />
      <Route path="/materi-matematika/kelas-7/himpunan/pengertian-keanggotaan" element={<PengertianKeanggotaanHimpunanPage />} />
      <Route path="/materi-matematika/kelas-7/himpunan/jenis-himpunan" element={<JenisHimpunanPage />} />
      <Route path="/materi-matematika/kelas-7/himpunan/diagram-venn" element={<DiagramVennPage />} />
      <Route path="/materi-matematika/kelas-7/himpunan/pemecahan-masalah" element={<PemecahanMasalahHimpunanPage />} />
      
      {/* Materi Matematika - Kelas 8 Topic Routes */}
      <Route path="/materi-matematika/kelas-8/pola-bilangan" element={<PolaBilanganMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/pola-bilangan/pengertian" element={<PengertianPolaMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/pola-bilangan/pola-khusus" element={<PolaKhususMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/pola-bilangan/pola-aritmetika" element={<PolaAritmetikaMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/pola-bilangan/pola-geometri" element={<PolaGeometriMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/koordinat-cartesius" element={<KoordinatCartesiusMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/koordinat-cartesius/unsur-unsur" element={<UnsurUnsurCartesiusMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-titik-acuan" element={<PosisiRelatifTitikAcuanMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/koordinat-cartesius/jarak-titik-garis" element={<JarakTitikGarisMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-garis" element={<PosisiRelatifGarisMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/relasi-dan-fungsi" element={<RelasiFungsiMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/relasi-dan-fungsi/pengertian-relasi" element={<PengertianRelasiMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/relasi-dan-fungsi/pengertian-fungsi" element={<PengertianFungsiMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/relasi-dan-fungsi/banyak-fungsi" element={<BanyakFungsiMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/relasi-dan-fungsi/notasi-rumus-fungsi" element={<NotasiFungsiMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/relasi-dan-fungsi/grafik-fungsi" element={<GrafikFungsiMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/spldv" element={<SPLDVMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/spldv/definisi" element={<DefinisiSPLDVMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/spldv/metode-grafik" element={<MetodeGrafikMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/spldv/metode-substitusi" element={<MetodeSubstitusiMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/spldv/metode-eliminasi" element={<MetodeEliminasiMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/spldv/metode-campuran" element={<MetodeCampuranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/spldv/model-spldv" element={<ModelSPLDVMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/spldv/penyelesaian-masalah" element={<PenyelesaianMasalahSPLDVMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/persamaan-garis-lurus" element={<PersamaanGarisLurusMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/persamaan-garis-lurus/grafik" element={<GrafikPGLMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/persamaan-garis-lurus/gradien" element={<GradienMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/persamaan-garis-lurus/menentukan-pgl" element={<MenentukanPGLMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/persamaan-garis-lurus/hubungan-2-garis" element={<Hubungan2GarisMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/persamaan-garis-lurus/aplikasi-kontekstual" element={<AplikasiKontekstualMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/teorema-pythagoras" element={<TeoremaPythagorasMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/teorema-pythagoras/pembuktian" element={<PembuktianPythagorasMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/teorema-pythagoras/menghitung-panjang" element={<MenghitungPanjangPythagorasMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/teorema-pythagoras/triple-pythagoras" element={<TriplePythagorasMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/teorema-pythagoras/jenis-segitiga" element={<JenisSegitigaPythagorasMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/teorema-pythagoras/sudut-khusus" element={<SudutKhususPythagorasMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/teorema-pythagoras/masalah-kontekstual" element={<MasalahKontekstualPythagorasMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/lingkaran" element={<LingkaranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/lingkaran/unsur-unsur" element={<UnsurUnsurLingkaranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/lingkaran/keliling-luas" element={<KelilingLuasLingkaranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/lingkaran/kaitan-bangun-datar" element={<KaitanBangunDatarLingkaranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/lingkaran/busur-juring" element={<BusurJuringLingkaranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/lingkaran/sudut-pusat-keliling" element={<SudutPusatKelilingLingkaranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/lingkaran/penerapan-kontekstual" element={<PenerapanKontekstualLingkaranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/garis-singgung-lingkaran" element={<GarisSinggungLingkaranMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/garis-singgung-lingkaran/pengertian" element={<PengertianGSLMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/garis-singgung-lingkaran/menghitung-panjang" element={<MenghitungPanjangGSLMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/garis-singgung-lingkaran/gspl" element={<GSPLMMk8Page />} />
      <Route path="/materi-matematika/kelas-8/garis-singgung-lingkaran/gspd" element={<GSPDMMk8Page />} />
      <Route path="/materi-matematika/kelas-8/garis-singgung-lingkaran/sabuk-lilitan" element={<SabukLilitanMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/bangun-ruang-sisi-datar" element={<BangunRuangSisiDatarMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/bangun-ruang-sisi-datar/kubus" element={<KubusMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/bangun-ruang-sisi-datar/balok" element={<BalokMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/bangun-ruang-sisi-datar/prisma" element={<PrismaMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/bangun-ruang-sisi-datar/limas" element={<LimasMMK8Page />} />
      <Route path="/materi-matematika/kelas-8/bangun-ruang-sisi-datar/gabungan" element={<GabunganMMK8Page />} />
      
      {/* Materi Matematika - Kelas 9 Topic Routes */}
      <Route path="/materi-matematika/kelas-9/bilangan-berpangkat" element={<BilanganBerpangkatMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bilangan-berpangkat/pengertian-notasi" element={<PengertianNotasiPangkatMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bilangan-berpangkat/sifat-sifat-operasi" element={<SifatSifatOperasiMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bilangan-berpangkat/bentuk-akar" element={<BentukAkarMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bilangan-berpangkat/notasi-ilmiah" element={<NotasiIlmiahMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/kesebangunan-kekongruenan" element={<KesebangunanKekongruenMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/kesebangunan-kekongruenan/definisi" element={<DefinisiKesebangunanMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/kesebangunan-kekongruenan/menghitung-panjang-rusuk" element={<MenghitungRusukMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/kesebangunan-kekongruenan/segitiga-sebangun" element={<SegitigaSebangunMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/kesebangunan-kekongruenan/perbandingan-rusuk-siku-siku" element={<PerbandinganRusukSikuSikuMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/kesebangunan-kekongruenan/kekongruenan-bangun-datar" element={<KekongruenBangunDatarMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/transformasi-geometri" element={<TransformasiGeometriMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/transformasi-geometri/translasi" element={<TranslasiMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/transformasi-geometri/refleksi" element={<RefleksiMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/transformasi-geometri/rotasi" element={<RotasiMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/transformasi-geometri/dilatasi" element={<DilatasisMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung" element={<BangunRuangSisiLengkungMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/tabung" element={<TabungMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/kerucut" element={<KerucutMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/bola" element={<BolaMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/perubahan-volume" element={<PerubahanVolumeMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/gabungan" element={<GabunganMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/statistika" element={<StatistikaMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/statistika/pengantar" element={<PengantarStatistikaMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/statistika/penyajian-data" element={<PenyajianDataMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/statistika/rata-rata" element={<RataRataMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/statistika/median-modus" element={<MedianModusMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/statistika/kuartil" element={<KuartilMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/statistika/penyebaran-data" element={<PenyebaranDataMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/peluang" element={<PeluangMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/peluang/ruang-sampel" element={<RuangSampelMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/peluang/peluang-empirik" element={<PeluangEmpirikMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/peluang/peluang-teoretik" element={<PeluangTeoretikMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/peluang/frekuensi-harapan" element={<FrekuensiHarapanMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/peluang/komplemen" element={<KomplementMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/peluang/kejadian-majemuk" element={<PeluangKejadianMajemukMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/persamaan-kuadrat" element={<PersamaanKuadratMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/persamaan-kuadrat/bentuk-umum" element={<PKMMBentukUmumPage />} />
      <Route path="/materi-matematika/kelas-9/persamaan-kuadrat/pemfaktoran" element={<PKMMPemfaktoranPage />} />
      <Route path="/materi-matematika/kelas-9/persamaan-kuadrat/rumus-kuadratik" element={<PKMMRumusKuadratikPage />} />
      <Route path="/materi-matematika/kelas-9/persamaan-kuadrat/pelengkap-kuadrat" element={<PKMMPelengkapKuadratPage />} />
      <Route path="/materi-matematika/kelas-9/persamaan-kuadrat/diskriminan" element={<PKMMDiskriminanPage />} />
      <Route path="/materi-matematika/kelas-9/persamaan-kuadrat/menyusun-persamaan-baru" element={<PKMMMenyusunBaruPage />} />
      <Route path="/materi-matematika/kelas-9/persamaan-kuadrat/penerapan-kontekstual" element={<PKMMPenerapanKontekstualPage />} />
      <Route path="/materi-matematika/kelas-9/fungsi-kuadrat" element={<FungsiKuadratMMK9Page />} />
      <Route path="/materi-matematika/kelas-9/fungsi-kuadrat/bentuk-umum-karakteristik" element={<FKMMBentukUmumKarakteristikPage />} />
      <Route path="/materi-matematika/kelas-9/fungsi-kuadrat/titik-potong" element={<FKMMTitikPotongPage />} />
      <Route path="/materi-matematika/kelas-9/fungsi-kuadrat/sumbu-simetri" element={<FKMMSumbuSimetriPage />} />
      <Route path="/materi-matematika/kelas-9/fungsi-kuadrat/menggambar-grafik" element={<FKMMMenggambarGrafikPage />} />
      <Route path="/materi-matematika/kelas-9/fungsi-kuadrat/menyusun-fungsi" element={<FKMMMenyusunFungsiPage />} />
      <Route path="/materi-matematika/kelas-9/fungsi-kuadrat/penerapan-nilai-maks-min" element={<FKMMPenerapanNilaiMaksMinPage />} />

      {/* Menghitung Cepat Routes */}
      <Route path="/menghitung-cepat" element={<MenghitungCepatPage />} />
      <Route path="/menghitung-cepat/perkalian-11" element={<PerkalianDengan11Page />} />
      <Route path="/menghitung-cepat/kuadrat-berakhiran-5" element={<KuadratBerakhiran5Page />} />
      <Route path="/menghitung-cepat/kuadrat-cepat" element={<KuadratCepatPage />} />
      <Route path="/menghitung-cepat/perkalian-dekat-100" element={<PerkalianDekat100Page />} />
      <Route path="/menghitung-cepat/persentase-cepat" element={<PersentaseCepatPage />} />
      <Route path="/menghitung-cepat/penjumlahan-pengurangan" element={<PenjumlahanPenguranganCepatPage />} />
      <Route path="/menghitung-cepat/perkalian-dua-digit" element={<PerkalianDuaDigitPage />} />
      <Route path="/menghitung-cepat/pembagian-cepat" element={<PembagianCepatPage />} />
      <Route path="/menghitung-cepat/tabel-referensi" element={<TabelReferensiPage />} />
      <Route path="/menghitung-cepat/latihan-flashcard" element={<LatihanFlashcardPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FontProvider>
    <SoundProvider>
    <MusicProvider>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
    </MusicProvider>
    </SoundProvider>
    </FontProvider>
  </QueryClientProvider>
);

export default App;
