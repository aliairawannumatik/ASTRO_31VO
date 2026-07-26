#!/usr/bin/env node
// Injects practice.spldv.definisiSpldv keys into all 3 locale files
const fs = require("fs");
const path = require("path");

const localeDir = path.join(__dirname, "../artifacts/numatik/src/locales");

const translations = {
  id: {
    pageTitle: "DEFINISI DAN BENTUK UMUM SPLDV",
    grade: "Kelas 8",
    soalCount: "8 Soal",
    backSuffix: "SPLDV",
    q1: {
      title: "Mengenal PLDV",
      content: "Perhatikan persamaan-persamaan berikut. Tentukan mana yang merupakan Persamaan Linear Dua Variabel (PLDV).",
    },
    q2: {
      title: "Identifikasi SPLDV",
      content: "Dari sistem persamaan berikut, manakah yang merupakan SPLDV? Berikan alasanmu!",
    },
    q3: {
      title: "Verifikasi Solusi",
      content: "Periksa apakah setiap pasangan berurutan berikut merupakan penyelesaian SPLDV:",
    },
    q4: {
      title: "Soal UN Style",
      content: "Pasangan bilangan yang merupakan penyelesaian dari SPLDV:",
    },
    q5: {
      title: "Himpunan Penyelesaian — Identifikasi",
      content: "Tanpa mencari solusinya, tentukan jenis penyelesaian (ada solusi, tidak ada solusi, atau tak hingga solusi) dari setiap SPLDV berikut. Untuk soal (d)–(g), gunakan cara melihat perbandingan koefisiennya:",
    },
    q6: {
      title: "Mengubah ke Bentuk Standar",
      content: "Ubah setiap persamaan berikut ke bentuk standar ax + by = c, dengan a, b, dan c berupa bilangan bulat:",
    },
    q7: {
      title: "SPLDV dari Konteks",
      content: "Theo membeli 3 kg mangga dan 2 kg jeruk seharga Rp 54.000. Remy membeli 1 kg mangga dan 4 kg jeruk seharga Rp 42.000.",
      partA: "Misal harga mangga = x dan harga jeruk = y. Tuliskan SPLDV-nya.",
      partB: "Periksa apakah harga 1 kg mangga adalah Rp10.000 dan harga 1 kg jeruk Rp12.000 merupakan penyelesaian dari permasalahan pada soal.",
      partC: "Periksa apakah harga 1 kg mangga adalah Rp12.000 dan harga 1 kg jeruk Rp9.000 merupakan penyelesaian dari permasalahan pada soal.",
    },
    q8: {
      title: "ANBK — Benar atau Salah",
      content: "Tentukan pernyataan BENAR (B) atau SALAH (S):",
      part1: "SPLDV selalu memiliki tepat satu penyelesaian.",
      part2: "Jika koefisien x dan y pada dua persamaan sebanding tapi konstantanya tidak, maka tidak ada penyelesaian.",
      part3: "Setiap PLDV dapat dijadikan bagian dari suatu SPLDV.",
      part4: "Penyelesaian SPLDV berupa pasangan bilangan (x, y) yang memenuhi kedua persamaan.",
    },
  },
  en: {
    pageTitle: "DEFINITION & STANDARD FORM OF SLETV",
    grade: "Grade 8",
    soalCount: "8 Questions",
    backSuffix: "SLETV",
    q1: {
      title: "Identifying LETV",
      content: "Observe the following equations. Determine which ones are Linear Equations in Two Variables (LETV).",
    },
    q2: {
      title: "Identifying a SLETV",
      content: "From the following systems of equations, which ones are a System of Linear Equations in Two Variables (SLETV)? Give your reasoning!",
    },
    q3: {
      title: "Verifying Solutions",
      content: "Check whether each ordered pair below is a solution to the SLETV:",
    },
    q4: {
      title: "National Exam Style",
      content: "The number pair that is a solution to the SLETV:",
    },
    q5: {
      title: "Solution Sets — Identification",
      content: "Without solving, determine the type of solution (one solution, no solution, or infinitely many solutions) for each SLETV below. For parts (d)–(g), use the coefficient comparison method:",
    },
    q6: {
      title: "Converting to Standard Form",
      content: "Convert each equation below to standard form ax + by = c, where a, b, and c are integers:",
    },
    q7: {
      title: "SLETV from Context",
      content: "Theo buys 3 kg of mangoes and 2 kg of oranges for Rp 54,000. Remy buys 1 kg of mangoes and 4 kg of oranges for Rp 42,000.",
      partA: "Let the price of mango = x and the price of orange = y. Write the SLETV.",
      partB: "Check whether the price of 1 kg mango being Rp 10,000 and 1 kg orange being Rp 12,000 is a solution to the problem.",
      partC: "Check whether the price of 1 kg mango being Rp 12,000 and 1 kg orange being Rp 9,000 is a solution to the problem.",
    },
    q8: {
      title: "ANBK — True or False",
      content: "Determine whether each statement is TRUE (T) or FALSE (F):",
      part1: "A SLETV always has exactly one solution.",
      part2: "If the x and y coefficients of two equations are proportional but the constants are not, then there is no solution.",
      part3: "Every LETV can be made part of a SLETV.",
      part4: "A solution to a SLETV is a number pair (x, y) that satisfies both equations.",
    },
  },
  ja: {
    pageTitle: "連立方程式の定義と標準形",
    grade: "8年生",
    soalCount: "8問",
    backSuffix: "連立一次方程式",
    q1: {
      title: "二変数一次方程式を見分ける",
      content: "次の方程式を見て、どれが二変数一次方程式（LETV）かを判断しなさい。",
    },
    q2: {
      title: "連立方程式の識別",
      content: "次の連立方程式のうち、どれが連立一次方程式（SLETV）ですか？理由を述べなさい！",
    },
    q3: {
      title: "解の検証",
      content: "次の順序対がそれぞれ連立方程式の解であるか確認しなさい：",
    },
    q4: {
      title: "全国テスト形式",
      content: "次の連立方程式の解となる数の組は：",
    },
    q5: {
      title: "解集合の識別",
      content: "解を求めずに、次の各連立方程式の解の種類（一つの解・解なし・無限に多い解）を判断しなさい。(d)〜(g)は係数の比較法を使いなさい：",
    },
    q6: {
      title: "標準形への変換",
      content: "次の各方程式を標準形 ax + by = c（a、b、c は整数）に変換しなさい：",
    },
    q7: {
      title: "文脈からの連立方程式",
      content: "テオはマンゴー3kgとオレンジ2kgをRp 54,000で購入した。レミーはマンゴー1kgとオレンジ4kgをRp 42,000で購入した。",
      partA: "マンゴーの価格を x、オレンジの価格を y とする。連立方程式を書きなさい。",
      partB: "マンゴー1kgがRp 10,000、オレンジ1kgがRp 12,000であることが問題の解であるか確認しなさい。",
      partC: "マンゴー1kgがRp 12,000、オレンジ1kgがRp 9,000であることが問題の解であるか確認しなさい。",
    },
    q8: {
      title: "ANBK — 正誤問題",
      content: "各文が正しい（T）か間違い（F）かを判断しなさい：",
      part1: "連立一次方程式は常にちょうど一つの解を持つ。",
      part2: "二つの方程式のxとyの係数が比例しているが定数が比例しない場合、解は存在しない。",
      part3: "すべての二変数一次方程式は連立一次方程式の一部にすることができる。",
      part4: "連立一次方程式の解は、両方の方程式を満たす数の組 (x, y) である。",
    },
  },
};

for (const lang of ["id", "en", "ja"]) {
  const filePath = path.join(localeDir, `${lang}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!json.practice.spldv) {
    json.practice.spldv = {};
  }
  json.practice.spldv.definisiSpldv = translations[lang];

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log(`✓ ${lang}.json updated`);
}

// Verify key counts
for (const lang of ["id", "en", "ja"]) {
  const j = JSON.parse(fs.readFileSync(path.join(localeDir, `${lang}.json`), "utf8"));
  const d = j.practice.spldv.definisiSpldv;
  const keys = Object.keys(d);
  console.log(`${lang}: top-level keys = [${keys.join(", ")}]`);
}
