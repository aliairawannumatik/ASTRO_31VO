import type { RegistryK9, SubmaterialEntryK9 } from "./types";
import { BILANGAN_BERPANGKAT } from "./bilangan-berpangkat";
import { KESEBANGUNAN_KEKONGRUENAN } from "./kesebangunan-kekongruenan";
import { TRANSFORMASI_GEOMETRI } from "./transformasi-geometri";
import { BANGUN_RUANG_SISI_LENGKUNG } from "./bangun-ruang-sisi-lengkung";
import { STATISTIKA } from "./statistika";
import { PELUANG } from "./peluang";
import { PERSAMAAN_KUADRAT } from "./persamaan-kuadrat";
import { FUNGSI_KUADRAT } from "./fungsi-kuadrat";

const ALL_ENTRIES: SubmaterialEntryK9[] = [
  ...BILANGAN_BERPANGKAT,
  ...KESEBANGUNAN_KEKONGRUENAN,
  ...TRANSFORMASI_GEOMETRI,
  ...BANGUN_RUANG_SISI_LENGKUNG,
  ...STATISTIKA,
  ...PELUANG,
  ...PERSAMAAN_KUADRAT,
  ...FUNGSI_KUADRAT,
];

export const REGISTRY_K9: RegistryK9 = Object.fromEntries(
  ALL_ENTRIES.map((e) => [`${e.parentSlug}/${e.slug}`, e]),
);

export const getSubmaterialK9 = (parentSlug: string, slug: string) =>
  REGISTRY_K9[`${parentSlug}/${slug}`];
