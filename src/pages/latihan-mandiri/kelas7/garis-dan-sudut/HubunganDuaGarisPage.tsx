import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

const questions = [
  {
    id: 1,
    image: "/images/GAMBAR_1_HUBUNGAN_2_GARIS.png",
    imageAlt: "Gambar 1 Hubungan 2 Garis",
    content: (
      <>
        <p className="mb-3">Diketahui pernyataan berikut.</p>
        <ol className="list-none space-y-1 mb-3 pl-2">
          <li>(i)&nbsp;&nbsp; Titik D dan E merupakan bagian garis DE</li>
          <li>(ii)&nbsp;&nbsp;FB adalah ruas garis</li>
          <li>(iii)&nbsp;AB dan AC adalah ruas garis yang sama</li>
          <li>(iv)&nbsp;Potongan ruas garis AC berupa ruas garis</li>
        </ol>
        <p>Pernyataan yang benar adalah …</p>
      </>
    ),
    options: [
      "(i), (ii) dan (iii)",
      "(i), (ii) dan (iv)",
      "(i), (iii) dan (iv)",
      "(ii), (iii), (iv)",
    ],
  },
  {
    id: 2,
    content: (
      <>
        <p className="mb-3">Perhatikan pernyataan-pernyataan berikut.</p>
        <ol className="list-none space-y-1 mb-3 pl-2">
          <li>(i)&nbsp;&nbsp; Dua buah garis dikatakan sejajar jika keduanya tidak akan pernah berpotongan meskipun diperpanjang.</li>
          <li>(ii)&nbsp;&nbsp;Jika garis <InlineMath math="a" /> sejajar dengan <InlineMath math="b" /> dan garis <InlineMath math="b" /> sejajar dengan <InlineMath math="c" />, maka garis <InlineMath math="a" /> sejajar dengan <InlineMath math="c" />.</li>
          <li>(iii)&nbsp;Dua garis yang berimpit tidak memiliki titik potong.</li>
          <li>(iv)&nbsp;Dua garis yang tidak sejajar pasti berpotongan.</li>
        </ol>
        <p>Pernyataan yang benar ditunjukkan oleh nomor …</p>
      </>
    ),
    options: [
      "(i) dan (iii)",
      "(i), (ii) dan (iv)",
      "(ii) dan (iii)",
      "(ii), (iii) dan (iv)",
    ],
  },
  {
    id: 3,
    content: (
      <p>
        Diketahui lima buah titik A, B, C, D, dan E terletak pada satu garis yang sama (kolinear). Banyaknya garis berbeda yang dapat dibuat dari kelima titik tersebut adalah ....
      </p>
    ),
    options: ["1 buah", "5 buah", "10 buah", "20 buah"],
  },
  {
    id: 4,
    content: (
      <p>
        Terdapat 5 titik di sebuah bidang datar di mana tidak ada tiga titik yang letaknya segaris (non-kolinear). Banyak garis lurus yang dapat dibuat dengan menghubungkan setiap dua titik adalah ....
      </p>
    ),
    options: ["5 buah", "8 buah", "10 buah", "15 buah"],
  },
  {
    id: 5,
    content: (
      <p>
        Dalam ilmu navigasi atau konstruksi, garis yang tegak lurus (membentuk sudut <InlineMath math="90°" />) terhadap permukaan air yang tenang disebut sebagai ....
      </p>
    ),
    options: [
      "Garis horizontal",
      "Garis vertikal",
      "Garis sejajar",
      "Garis berhimpit",
    ],
  },
  {
    id: 6,
    content: (
      <p>
        Pada sebuah garis bilangan, terdapat titik K, L, dan M. Jika jarak K ke L adalah 3 satuan, dan jarak L ke M adalah 4 kali jarak K ke L, maka panjang ruas garis KM jika L berada di antara K dan M adalah ....
      </p>
    ),
    options: ["7 satuan", "12 satuan", "15 satuan", "18 satuan"],
  },
  {
    id: 7,
    content: (
      <p>
        Dua buah garis, garis <InlineMath math="m" /> dan garis <InlineMath math="n" />, berada pada bidang yang sama. Jika garis <InlineMath math="m" /> tidak akan pernah memotong garis <InlineMath math="n" /> meskipun diperpanjang ke kedua arah, maka hubungan kedua garis tersebut adalah ....
      </p>
    ),
    options: ["Berpotongan", "Berhimpit", "Sejajar", "Bersilangan"],
  },
  {
    id: 8,
    content: (
      <p>
        Jika garis <InlineMath math="k" /> melalui titik <InlineMath math="(2, 3)" /> dan <InlineMath math="(5, 8)" />, sementara garis <InlineMath math="l" /> juga melalui titik <InlineMath math="(2, 3)" /> dan <InlineMath math="(5, 8)" />, maka kedudukan garis <InlineMath math="k" /> terhadap garis <InlineMath math="l" /> adalah ....
      </p>
    ),
    options: [
      "Sejajar",
      "Tegak lurus",
      "Berhimpit",
      "Berpotongan di satu titik",
    ],
  },
  {
    id: 9,
    content: (
      <p>
        Garis AB dan garis PQ terpisah sejauh 10 cm. Jika setiap titik pada garis AB memiliki jarak yang selalu tetap (10 cm) terhadap garis PQ, maka dapat disimpulkan bahwa garis AB dan PQ adalah ....
      </p>
    ),
    options: ["Berpotongan", "Bersilangan", "Sejajar", "Tegak lurus"],
  },
  {
    id: 10,
    image: "/images/GAMBAR_2_HUBUNGAN_2_GARIS.png",
    imageAlt: "Gambar 2 Hubungan 2 Garis",
    content: (
      <>
        <p className="mb-2">
          Ruas garis AB tegak lurus dengan garis <InlineMath math="h" /> pada{" "}
          <InlineMath math="\overrightarrow{BQ}" /> sejajar dengan{" "}
          <InlineMath math="\overrightarrow{AK}" />. Jika garis <InlineMath math="h" /> sejajar dengan garis <InlineMath math="k" />, panjang{" "}
          <InlineMath math="AB = 8" /> satuan, <InlineMath math="PB = 15" /> satuan, dan{" "}
          <InlineMath math="KL = 10" /> satuan, panjang ruas garis PQ adalah …
        </p>
      </>
    ),
    options: ["8 satuan", "10 satuan", "12 satuan", "15 satuan"],
  },
];

const OPTION_LABELS = ["A", "B", "C", "D"];

const HubunganDuaGarisPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          HUBUNGAN 2 GARIS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Latihan Mandiri - Garis dan Sudut
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <h2 className="text-lg font-bold text-accent mb-4 font-display">Latihan Mandiri</h2>
          <p className="text-white/70 text-sm mb-6 font-body">Pilihlah jawaban yang benar.</p>

          <div className="space-y-8 text-white/90 font-body text-sm leading-relaxed">
            {questions.map((q) => (
              <div key={q.id} className="border-l-2 border-accent/50 pl-4 flex gap-3">
                <span className="font-semibold text-accent shrink-0 w-6">{q.id}.</span>

                <div className="flex-1 min-w-0">
                  {q.image && (
                    <div className="mb-4">
                      <div className="bg-white rounded-lg p-3 inline-block max-w-full">
                        <img
                          src={q.image}
                          alt={q.imageAlt}
                          className="w-full max-w-xs h-auto object-contain block"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-4">{q.content}</div>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-white/80">
                        <span className="font-semibold text-white/60 shrink-0 w-5">
                          {OPTION_LABELS[idx]}.
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              playPopSound();
              navigate("/latihan-mandiri/kelas-7/garis-dan-sudut");
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Garis dan Sudut
          </button>
        </div>
      </div>
    </div>
  );
};

export default HubunganDuaGarisPage;
