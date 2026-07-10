import { aritmetikaSosial } from "./aritmetika-sosial";
import { bangunRuangSisiDatar } from "./bangun-ruang-sisi-datar";
import { bentukAljabar } from "./bentuk-aljabar";
import { bilanganBerpangkat } from "./bilangan-berpangkat";
import { fungsiKuadrat } from "./fungsi-kuadrat";
import { garisDanSudut } from "./garis-dan-sudut";
import { garisSinggungLingkaran } from "./garis-singgung-lingkaran";
import { himpunan } from "./himpunan";
import { kesebangunanKekongruenan } from "./kesebangunan-kekongruenan";
import { koordinatCartesius } from "./koordinat-cartesius";
import { lingkaran } from "./lingkaran";
import { pecahan } from "./pecahan";
import { perbandingan } from "./perbandingan";
import { persamaanGarisLurus } from "./persamaan-garis-lurus";
import { persamaanKuadrat } from "./persamaan-kuadrat";
import { plsvPtlsv } from "./plsv-ptlsv";
import { polaBilangan } from "./pola-bilangan";
import { relasiFungsi } from "./relasi-fungsi";
import { segitigaSegiempat } from "./segitiga-segiempat";
import { spldv } from "./spldv";
import { teoremaPythagoras } from "./teorema-pythagoras";
import { transformasiGeometri } from "./transformasi-geometri";
import type { MateriCatalogEntry } from "../rppHelpers";

export const rppCatalog: Record<string, MateriCatalogEntry> = {
  "aritmetika-sosial": aritmetikaSosial,
  "bangun-ruang-sisi-datar": bangunRuangSisiDatar,
  "bentuk-aljabar": bentukAljabar,
  "bilangan-berpangkat": bilanganBerpangkat,
  "fungsi-kuadrat": fungsiKuadrat,
  "garis-dan-sudut": garisDanSudut,
  "garis-singgung-lingkaran": garisSinggungLingkaran,
  "himpunan": himpunan,
  "kesebangunan-kekongruenan": kesebangunanKekongruenan,
  "koordinat-cartesius": koordinatCartesius,
  "lingkaran": lingkaran,
  "pecahan": pecahan,
  "perbandingan": perbandingan,
  "persamaan-garis-lurus": persamaanGarisLurus,
  "persamaan-kuadrat": persamaanKuadrat,
  "plsv-ptlsv": plsvPtlsv,
  "pola-bilangan": polaBilangan,
  "relasi-fungsi": relasiFungsi,
  "segitiga-segiempat": segitigaSegiempat,
  "spldv": spldv,
  "teorema-pythagoras": teoremaPythagoras,
  "transformasi-geometri": transformasiGeometri,
};
