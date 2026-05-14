import type { RegistryK8, SubmaterialEntryK8 } from "./types";
import { POLA_BILANGAN } from "./pola-bilangan";
import { KOORDINAT_KARTESIUS } from "./koordinat-cartesius";
import { RELASI_FUNGSI } from "./relasi-fungsi";
import { SPLDV } from "./spldv";
import { PERSAMAAN_GARIS_LURUS } from "./persamaan-garis-lurus";
import { TEOREMA_PYTHAGORAS } from "./teorema-pythagoras";
import { LINGKARAN } from "./lingkaran";
import { GARIS_SINGGUNG_LINGKARAN } from "./garis-singgung-lingkaran";
import { BANGUN_RUANG_SISI_DATAR } from "./bangun-ruang-sisi-datar";

const ALL_ENTRIES: SubmaterialEntryK8[] = [
  ...POLA_BILANGAN,
  ...KOORDINAT_KARTESIUS,
  ...RELASI_FUNGSI,
  ...SPLDV,
  ...PERSAMAAN_GARIS_LURUS,
  ...TEOREMA_PYTHAGORAS,
  ...LINGKARAN,
  ...GARIS_SINGGUNG_LINGKARAN,
  ...BANGUN_RUANG_SISI_DATAR,
];

export const REGISTRY_K8: RegistryK8 = Object.fromEntries(
  ALL_ENTRIES.map((e) => [`${e.parentSlug}/${e.slug}`, e]),
);

export const getSubmaterialK8 = (parentSlug: string, slug: string) =>
  REGISTRY_K8[`${parentSlug}/${slug}`];
