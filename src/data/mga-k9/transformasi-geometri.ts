import type { SubmaterialEntryK9, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "transformasi-geometri";
const PARENT_LABEL = "TRANSFORMASI GEOMETRI";

const TRANSLASI: BaseQ[] = [
  { q: "Translasi adalah ...", opts: ["pencerminan", "perputaran", "pergeseran", "perbesaran"], correct: 2 },
  { q: "Titik (2,3) ditranslasi (1,0). Hasilnya ...", opts: ["(1,3)", "(2,4)", "(3,3)", "(3,4)"], correct: 2 },
  { q: "Titik (0,0) ditranslasi (5,2). Hasilnya ...", opts: ["(0,5)", "(2,5)", "(5,2)", "(7,2)"], correct: 2 },
  { q: "Titik (4,5) ditranslasi (-2,1). Hasilnya ...", opts: ["(2,6)", "(2,5)", "(4,6)", "(6,4)"], correct: 0 },
  { q: "Translasi (a,b) menggeser titik sebanyak ... satuan ke kanan dan atas", opts: ["a saja", "b saja", "a dan b", "0"], correct: 2 },
  { q: "Titik (1,1) ditranslasi (3,3) menjadi ...", opts: ["(1,3)", "(3,3)", "(4,4)", "(2,2)"], correct: 2 },
  { q: "Titik P(5,7) ditranslasi (-1,-2). Hasilnya ...", opts: ["(4,5)", "(4,9)", "(6,5)", "(6,9)"], correct: 0 },
  { q: "Translasi tidak mengubah ...", opts: ["posisi", "ukuran", "warna", "letak"], correct: 1 },
  { q: "Titik (3,4) ditranslasi (0,2). Hasilnya ...", opts: ["(3,2)", "(3,6)", "(5,4)", "(3,4)"], correct: 1 },
  { q: "Pergeseran (2,5) untuk titik (1,2) menghasilkan ...", opts: ["(2,5)", "(3,7)", "(1,7)", "(2,7)"], correct: 1 },
  { q: "Translasi (-3,-4) terhadap (5,5) menghasilkan ...", opts: ["(2,1)", "(8,9)", "(2,9)", "(8,1)"], correct: 0 },
  { q: "Hasil translasi (4,0) dari titik (1,3) adalah ...", opts: ["(1,3)", "(5,3)", "(1,7)", "(5,7)"], correct: 1 },
];

const REFLEKSI: BaseQ[] = [
  { q: "Refleksi adalah ...", opts: ["pergeseran", "pencerminan", "perputaran", "perbesaran"], correct: 1 },
  { q: "Titik (3,4) dicerminkan terhadap sumbu-x. Hasilnya ...", opts: ["(3,-4)", "(-3,4)", "(-3,-4)", "(3,4)"], correct: 0 },
  { q: "Titik (5,2) dicerminkan terhadap sumbu-y. Hasilnya ...", opts: ["(5,-2)", "(-5,2)", "(-5,-2)", "(2,5)"], correct: 1 },
  { q: "Pencerminan terhadap sumbu-x mengubah tanda ...", opts: ["x", "y", "keduanya", "tidak ada"], correct: 1 },
  { q: "Pencerminan terhadap sumbu-y mengubah tanda ...", opts: ["x", "y", "keduanya", "tidak ada"], correct: 0 },
  { q: "Titik (2,3) dicerminkan terhadap sumbu-x menjadi ...", opts: ["(2,-3)", "(-2,3)", "(-2,-3)", "(3,2)"], correct: 0 },
  { q: "Titik (0,5) dicerminkan terhadap sumbu-y menjadi ...", opts: ["(0,5)", "(0,-5)", "(5,0)", "(-5,0)"], correct: 0 },
  { q: "Titik (4,4) dicerminkan terhadap garis y=x menjadi ...", opts: ["(4,4)", "(-4,4)", "(4,-4)", "(-4,-4)"], correct: 0 },
  { q: "Titik (3,5) dicerminkan terhadap garis y=x menjadi ...", opts: ["(5,3)", "(-3,5)", "(3,-5)", "(-5,-3)"], correct: 0 },
  { q: "Pencerminan terhadap titik asal (0,0) titik (2,3) menjadi ...", opts: ["(2,3)", "(-2,3)", "(2,-3)", "(-2,-3)"], correct: 3 },
  { q: "Hasil pencerminan terhadap sumbu-x dari (1,2) adalah ...", opts: ["(1,2)", "(1,-2)", "(-1,2)", "(-1,-2)"], correct: 1 },
  { q: "Hasil pencerminan terhadap sumbu-y dari (4,1) adalah ...", opts: ["(4,1)", "(4,-1)", "(-4,1)", "(-4,-1)"], correct: 2 },
];

const ROTASI: BaseQ[] = [
  { q: "Rotasi adalah ...", opts: ["pergeseran", "pencerminan", "perputaran", "perbesaran"], correct: 2 },
  { q: "Rotasi 90° berlawanan jarum jam titik (1,0) menjadi ...", opts: ["(0,1)", "(0,-1)", "(-1,0)", "(1,1)"], correct: 0 },
  { q: "Rotasi 180° pada (3,4) berpusat di O menghasilkan ...", opts: ["(3,4)", "(-3,4)", "(3,-4)", "(-3,-4)"], correct: 3 },
  { q: "Rotasi 270° = berapa derajat searah jarum jam?", opts: ["90°", "180°", "270°", "360°"], correct: 0 },
  { q: "Rotasi 360° menghasilkan ...", opts: ["titik berbeda", "titik asal", "pencerminan", "pergeseran"], correct: 1 },
  { q: "Rotasi 90° searah jarum jam titik (0,1) menjadi ...", opts: ["(1,0)", "(-1,0)", "(0,-1)", "(0,1)"], correct: 0 },
  { q: "Rotasi 180° titik (5,2) menghasilkan ...", opts: ["(5,2)", "(-5,2)", "(5,-2)", "(-5,-2)"], correct: 3 },
  { q: "Putaran setengah lingkaran sama dengan rotasi ...", opts: ["90°", "180°", "270°", "360°"], correct: 1 },
  { q: "Pusat rotasi pada bidang Cartesius biasanya di ...", opts: ["(0,0)", "(1,1)", "(2,2)", "sembarang"], correct: 0 },
  { q: "Rotasi 90° berlawanan arah jam dari (2,0) = ...", opts: ["(0,2)", "(0,-2)", "(-2,0)", "(2,0)"], correct: 0 },
  { q: "Rotasi 180° terhadap O dari (4,-3) menghasilkan ...", opts: ["(4,3)", "(-4,3)", "(-4,-3)", "(3,4)"], correct: 1 },
  { q: "Rotasi tidak mengubah ...", opts: ["letak", "ukuran", "arah", "posisi"], correct: 1 },
];

const DILATASI: BaseQ[] = [
  { q: "Dilatasi adalah ...", opts: ["pergeseran", "pencerminan", "perputaran", "perbesaran/perkecil"], correct: 3 },
  { q: "Faktor skala 2 berarti bangun ...", opts: ["mengecil ½", "tetap", "membesar 2×", "membesar 4×"], correct: 2 },
  { q: "Dilatasi titik (2,3) dengan k=2, pusat O = ...", opts: ["(2,3)", "(4,6)", "(6,9)", "(1,1.5)"], correct: 1 },
  { q: "Dilatasi (3,4) dengan k=½ pusat O = ...", opts: ["(1.5,2)", "(6,8)", "(3,4)", "(2,1.5)"], correct: 0 },
  { q: "k > 1 menyebabkan bangun ...", opts: ["mengecil", "membesar", "berputar", "tetap"], correct: 1 },
  { q: "k < 1 menyebabkan bangun ...", opts: ["mengecil", "membesar", "berputar", "tetap"], correct: 0 },
  { q: "k = 1 menghasilkan bangun ...", opts: ["mengecil", "membesar", "tetap", "tidak ada"], correct: 2 },
  { q: "k = -1 menghasilkan ...", opts: ["pencerminan terhadap pusat", "pergeseran", "rotasi 90°", "tetap"], correct: 0 },
  { q: "Dilatasi (1,2) dengan k=3 pusat O = ...", opts: ["(1,2)", "(2,4)", "(3,6)", "(4,8)"], correct: 2 },
  { q: "Dilatasi (4,8) dengan k=½ pusat O = ...", opts: ["(2,4)", "(4,8)", "(8,16)", "(1,2)"], correct: 0 },
  { q: "Faktor skala dilatasi disebut ...", opts: ["beda", "rasio", "k", "n"], correct: 2 },
  { q: "Dilatasi (5,5) k=2 pusat O = ...", opts: ["(5,5)", "(10,10)", "(2.5,2.5)", "(7,7)"], correct: 1 },
];

export const TRANSFORMASI_GEOMETRI: SubmaterialEntryK9[] = [
  { slug: "translasi", label: "TRANSLASI", emoji: "➡️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(TRANSLASI) },
  { slug: "refleksi", label: "REFLEKSI", emoji: "🪞", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(REFLEKSI) },
  { slug: "rotasi", label: "ROTASI", emoji: "🔄", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(ROTASI) },
  { slug: "dilatasi", label: "DILATASI", emoji: "🔍", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(DILATASI) },
];
