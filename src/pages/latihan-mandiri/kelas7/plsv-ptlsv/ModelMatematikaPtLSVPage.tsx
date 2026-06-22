import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const M = ({ math }: { math: string }) => (
  <span className="inline-block"><InlineMath math={math} /></span>
);
const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${color}`}>
    {label}
  </span>
);
const NumBadge = ({ n, color }: { n: string; color: string }) => (
  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0 font-body ${color}`}>{n}</span>
);

/* ── Soal A: Membuat Model Pertidaksamaan ─────────────── */
const SoalA = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Untuk soal nomor 1 sampai dengan nomor 5, buatlah{" "}
      <span className="text-orange-300 font-semibold">model pertidaksamaannya</span>!
    </p>

    {/* Soal 1 */}
    <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="1" color="bg-orange-500/30 text-orange-200 border border-orange-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Dua kali suatu bilangan dikurangi <span className="text-orange-300 font-semibold">7</span> hasilnya
          kurang dari <span className="text-orange-300 font-semibold">13</span>.{" "}
          <span className="text-white/50 italic">(Misalkan bilangan tersebut adalah <M math="n" />).</span>
        </p>
      </div>
    </div>

    {/* Soal 2 */}
    <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="2" color="bg-orange-500/30 text-orange-200 border border-orange-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Lima kali suatu bilangan ditambah <span className="text-orange-300 font-semibold">9</span> hasilnya
          tidak kurang dari <span className="text-orange-300 font-semibold">44</span>.{" "}
          <span className="text-white/50 italic">(Misalkan bilangan tersebut adalah <M math="p" />).</span>
        </p>
      </div>
    </div>

    {/* Soal 3 */}
    <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="3" color="bg-orange-500/30 text-orange-200 border border-orange-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Usia <span className="text-orange-300 font-semibold">Dino</span> saat ini paling banyak{" "}
          <span className="text-orange-300 font-semibold">6 tahun lebih</span> dari tiga kali usia adiknya.
          Adik Dino saat ini berusia <span className="text-orange-300 font-semibold">4 tahun</span>.{" "}
          <span className="text-white/50 italic">(Misalkan usia Dino saat ini = <M math="u" /> tahun).</span>
        </p>
      </div>
    </div>

    {/* Soal 4 */}
    <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="4" color="bg-orange-500/30 text-orange-200 border border-orange-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Keliling sebuah <span className="text-orange-300 font-semibold">segitiga sama kaki</span> tidak
          melebihi <span className="text-orange-300 font-semibold">54 cm</span>. Panjang setiap kaki segitiga
          adalah <span className="text-orange-300 font-semibold">5 cm lebihnya</span> dari panjang alasnya.{" "}
          <span className="text-white/50 italic">(Misalkan panjang alas = <M math="s" /> cm).</span>
        </p>
      </div>
    </div>

    {/* Soal 5 */}
    <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="5" color="bg-orange-500/30 text-orange-200 border border-orange-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Nilai seorang siswa pada empat ulangan berturut-turut adalah{" "}
          <span className="text-orange-300 font-semibold">70, 75, 80, dan 72</span>. Siswa tersebut ingin
          mendapatkan rata-rata <span className="text-orange-300 font-semibold">tidak kurang dari 75</span>{" "}
          setelah ulangan kelima.{" "}
          <span className="text-white/50 italic">(Misalkan nilai ulangan kelima = <M math="n" />).</span>
        </p>
      </div>
    </div>
  </div>
);

/* ── Soal B: Penerapan Lengkap ────────────────────────── */
const SoalB = () => (
  <div className="space-y-4">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Untuk soal-soal berikut, selesaikan dan{" "}
      <span className="text-amber-300 font-semibold">tafsirkan hasilnya</span>!
    </p>

    {/* Soal 6 */}
    <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="6" color="bg-amber-500/25 text-amber-200 border border-amber-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Seorang pelari ingin menyelesaikan latihan{" "}
          <span className="text-amber-300 font-semibold">minimal 40 km</span> dalam 4 hari. Pada hari pertama
          ia berlari <span className="text-amber-300 font-semibold">9 km</span>, hari kedua{" "}
          <span className="text-amber-300 font-semibold">11 km</span>, dan hari ketiga{" "}
          <span className="text-amber-300 font-semibold">8 km</span>. Paling sedikit berapa km yang harus
          ditempuh pada hari keempat?
        </p>
      </div>
    </div>

    {/* Soal 7 */}
    <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="7" color="bg-amber-500/25 text-amber-200 border border-amber-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Harga satu buah <span className="text-amber-300 font-semibold">buku tulis Rp6.000</span>. Andi
          ingin membeli beberapa buku dengan uang <span className="text-amber-300 font-semibold">Rp50.000</span>{" "}
          dan ingin menyisakan <span className="text-amber-300 font-semibold">paling sedikit Rp8.000</span>.
          Paling banyak berapa buku yang dapat Andi beli?
        </p>
      </div>
    </div>

    {/* Soal 8 */}
    <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="8" color="bg-amber-500/25 text-amber-200 border border-amber-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Sebuah toko memberikan diskon jika total belanja{" "}
          <span className="text-amber-300 font-semibold">melebihi Rp250.000</span>. Hera sudah memilih
          barang seharga <span className="text-amber-300 font-semibold">Rp95.000</span> dan{" "}
          <span className="text-amber-300 font-semibold">Rp72.000</span>. Paling sedikit berapa rupiah lagi
          yang harus Hera belanjakan agar mendapat diskon?
        </p>
      </div>
    </div>

    {/* Soal 9 */}
    <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="9" color="bg-amber-500/25 text-amber-200 border border-amber-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Umur seorang ibu saat ini <span className="text-amber-300 font-semibold">45 tahun</span>. Anak
          perempuannya saat ini berusia <span className="text-amber-300 font-semibold">15 tahun</span>.
          Paling cepat berapa tahun lagi umur anak tersebut akan{" "}
          <span className="text-amber-300 font-semibold">melebihi setengah</span> umur ibunya?
        </p>
      </div>
    </div>

    {/* Soal 10 */}
    <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="10" color="bg-amber-500/25 text-amber-200 border border-amber-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Rini membeli <span className="text-amber-300 font-semibold">3 buku tulis</span> seharga
          Rp8.000 per buku dan sejumlah <span className="text-amber-300 font-semibold">pensil</span> seharga
          Rp3.500 per batang. Ia hanya memiliki uang{" "}
          <span className="text-amber-300 font-semibold">Rp50.000</span>. Paling banyak berapa batang pensil
          yang dapat Rini beli?
        </p>
      </div>
    </div>

    {/* Soal 11 */}
    <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3 space-y-2">
      <div className="flex items-start gap-2.5">
        <NumBadge n="11" color="bg-amber-500/25 text-amber-200 border border-amber-400/40" />
        <div className="space-y-2">
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Sebuah <span className="text-amber-300 font-semibold">kebun berbentuk persegi panjang</span> dengan
            panjang <M math="(3x + 4)" /> m dan lebar <M math="(x + 6)" /> m. Keliling kebun tersebut{" "}
            <span className="text-amber-300 font-semibold">tidak lebih dari 64 m</span>.
          </p>
          <div className="flex flex-wrap gap-2 pl-1">
            {[
              { l: "a", t: "Tentukan nilai x yang mungkin!" },
              { l: "b", t: "Tentukan luas maksimum kebun tersebut!" },
            ].map(({ l, t }) => (
              <div key={l} className="flex items-start gap-2 bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-2 w-full">
                <span className="text-amber-400 font-bold text-xs mt-0.5 shrink-0">{l}.</span>
                <span className="font-body text-xs text-white/70 leading-relaxed">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Soal 12 */}
    <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
      <div className="flex items-start gap-2.5">
        <NumBadge n="12" color="bg-amber-500/25 text-amber-200 border border-amber-400/40" />
        <p className="font-body text-sm text-white/85 leading-relaxed">
          Ayah membeli <span className="text-amber-300 font-semibold">5 buah tinta printer</span> dan{" "}
          <span className="text-amber-300 font-semibold">3 rim kertas</span>. Harga sebuah tinta printer lebih
          mahal <span className="text-amber-300 font-semibold">Rp6.000</span> dari harga 1 rim kertas. Jika
          total yang harus dibayar Ayah{" "}
          <span className="text-amber-300 font-semibold">tidak lebih dari Rp246.000</span>, tentukan harga
          1 rim kertas yang mungkin!
        </p>
      </div>
    </div>
  </div>
);

/* ── Soal C: Model & Penerapan Lanjutan ───────────────── */
const SoalC = () => (
  <div className="space-y-5">

    {/* Sub-bagian: Buat model pertidaksamaan */}
    <div className="space-y-4">
      <p className="font-body text-sm text-white/90 leading-relaxed">
        Untuk soal nomor 13 sampai dengan nomor 17, buatlah{" "}
        <span className="text-yellow-300 font-semibold">model pertidaksamaannya</span>!
      </p>

      {/* Soal 13 */}
      <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
        <div className="flex items-start gap-2.5">
          <NumBadge n="13" color="bg-yellow-500/25 text-yellow-200 border border-yellow-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Harga sebuah <span className="text-yellow-300 font-semibold">tas</span> lebih mahal{" "}
            <span className="text-yellow-300 font-semibold">Rp8.000</span> dari harga sebuah{" "}
            <span className="text-yellow-300 font-semibold">dompet</span>. Harga 2 tas dan 4 dompet
            seluruhnya{" "}
            <span className="text-yellow-300 font-semibold">tidak lebih dari Rp80.000</span>.{" "}
            <span className="text-white/50 italic">(Misalkan harga sebuah dompet = <M math="d" /> rupiah).</span>
          </p>
        </div>
      </div>

      {/* Soal 14 */}
      <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
        <div className="flex items-start gap-2.5">
          <NumBadge n="14" color="bg-yellow-500/25 text-yellow-200 border border-yellow-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Uang yang dimiliki <span className="text-yellow-300 font-semibold">Bagas</span> adalah{" "}
            <span className="text-yellow-300 font-semibold">5 kali</span> uang yang dimiliki{" "}
            <span className="text-yellow-300 font-semibold">Rio</span>. Jumlah uang Bagas dan Rio{" "}
            <span className="text-yellow-300 font-semibold">kurang dari Rp180.000</span>.{" "}
            <span className="text-white/50 italic">(Misalkan banyak uang Rio = <M math="r" /> rupiah).</span>
          </p>
        </div>
      </div>

      {/* Soal 15 */}
      <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
        <div className="flex items-start gap-2.5">
          <NumBadge n="15" color="bg-yellow-500/25 text-yellow-200 border border-yellow-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Jumlah tiga bilangan{" "}
            <span className="text-yellow-300 font-semibold">kelipatan tiga</span> yang berurutan{" "}
            <span className="text-yellow-300 font-semibold">tidak lebih dari 81</span>.{" "}
            <span className="text-white/50 italic">(Bilangan terkecil dimisalkan dengan <M math="m" />).</span>
          </p>
        </div>
      </div>

      {/* Soal 16 */}
      <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
        <div className="flex items-start gap-2.5">
          <NumBadge n="16" color="bg-yellow-500/25 text-yellow-200 border border-yellow-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Keuntungan <span className="text-yellow-300 font-semibold">Toko P</span> lebih{" "}
            <span className="text-yellow-300 font-semibold">Rp20.000</span> dari tiga kali keuntungan{" "}
            <span className="text-yellow-300 font-semibold">Toko Q</span>. Jumlah keuntungan kedua toko tersebut{" "}
            <span className="text-yellow-300 font-semibold">tidak kurang dari Rp160.000</span>.{" "}
            <span className="text-white/50 italic">(Misalkan keuntungan Toko Q = <M math="q" /> rupiah).</span>
          </p>
        </div>
      </div>

      {/* Soal 17 */}
      <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
        <div className="flex items-start gap-2.5">
          <NumBadge n="17" color="bg-yellow-500/25 text-yellow-200 border border-yellow-400/40" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Panjang sebuah <span className="text-yellow-300 font-semibold">persegi panjang</span> lebih{" "}
            <span className="text-yellow-300 font-semibold">5 cm</span> dari dua kali lebarnya. Keliling
            persegi panjang tersebut{" "}
            <span className="text-yellow-300 font-semibold">tidak lebih dari 46 cm</span>.{" "}
            <span className="text-white/50 italic">(Misalkan lebar = <M math="w" /> cm).</span>
          </p>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="border-t border-yellow-500/15 pt-4">
      <p className="font-body text-sm text-white/90 leading-relaxed mb-4">
        Untuk soal-soal berikut, jawablah dengan{" "}
        <span className="text-yellow-300 font-semibold">selengkapnya</span>!
      </p>

      {/* Soal 18 */}
      <div className="space-y-4">
        <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3 space-y-2">
          <div className="flex items-start gap-2.5">
            <NumBadge n="18" color="bg-yellow-500/25 text-yellow-200 border border-yellow-400/40" />
            <div className="space-y-2">
              <p className="font-body text-sm text-white/85 leading-relaxed">
                Sebuah <span className="text-yellow-300 font-semibold">persegi</span> memiliki panjang sisi{" "}
                <M math="3m" /> cm.
              </p>
              {[
                { l: "a", t: "Nyatakan keliling persegi tersebut dalam m!" },
                { l: "b", t: "Jika kelilingnya tidak lebih dari 72 cm, susunlah pertidaksamaan dalam m, kemudian selesaikanlah!" },
                { l: "c", t: "Tentukan nilai m yang mungkin jika m variabel pada bilangan {1, 2, 3, 4, 5, 6}!" },
              ].map(({ l, t }) => (
                <div key={l} className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-400/20 rounded-lg px-3 py-2">
                  <span className="text-yellow-400 font-bold text-xs mt-0.5 shrink-0">{l}.</span>
                  <span className="font-body text-xs text-white/70 leading-relaxed">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Soal 19 */}
        <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3 space-y-2">
          <div className="flex items-start gap-2.5">
            <NumBadge n="19" color="bg-yellow-500/25 text-yellow-200 border border-yellow-400/40" />
            <div className="space-y-2">
              <p className="font-body text-sm text-white/85 leading-relaxed">
                Sebuah <span className="text-yellow-300 font-semibold">persegi panjang</span> berukuran panjang{" "}
                <M math="(2x + 5)" /> cm dan lebar <M math="(x + 1)" /> cm. Kelilingnya{" "}
                <span className="text-yellow-300 font-semibold">tidak lebih dari 54 cm</span>.
              </p>
              {[
                { l: "a", t: "Susunlah pertidaksamaan yang menyatakan keliling tersebut, kemudian selesaikanlah!" },
                { l: "b", t: "Tentukan ukuran panjang, lebar, dan luas maksimum persegi panjang tersebut dengan x ∈ bilangan cacah!" },
              ].map(({ l, t }) => (
                <div key={l} className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-400/20 rounded-lg px-3 py-2">
                  <span className="text-yellow-400 font-bold text-xs mt-0.5 shrink-0">{l}.</span>
                  <span className="font-body text-xs text-white/70 leading-relaxed">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Soal 20 */}
        <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
          <div className="flex items-start gap-2.5">
            <NumBadge n="20" color="bg-yellow-500/25 text-yellow-200 border border-yellow-400/40" />
            <p className="font-body text-sm text-white/85 leading-relaxed">
              Pada suatu lingkaran, panjang{" "}
              <span className="text-yellow-300 font-semibold">busur PQ</span> = <M math="(4t + 1)" /> cm
              dan panjang{" "}
              <span className="text-yellow-300 font-semibold">tali busur PQ</span> = <M math="(t + 6)" /> cm.
              Karena panjang busur selalu lebih besar dari panjang tali busurnya, susunlah pertidaksamaan
              dalam <M math="t" />, kemudian selesaikanlah!
            </p>
          </div>
        </div>

        {/* Soal 21 */}
        <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
          <div className="flex items-start gap-2.5">
            <NumBadge n="21" color="bg-yellow-500/25 text-yellow-200 border border-yellow-400/40" />
            <p className="font-body text-sm text-white/85 leading-relaxed">
              Jumlah dua bilangan bulat positif{" "}
              <span className="text-yellow-300 font-semibold">tidak kurang dari 85</span>. Bilangan yang lebih
              besar adalah <span className="text-yellow-300 font-semibold">4 kali</span> bilangan yang lebih
              kecil dikurangi <span className="text-yellow-300 font-semibold">5</span>. Tentukan batas-batas
              dari masing-masing bilangan tersebut!
            </p>
          </div>
        </div>

        {/* Soal 22 */}
        <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
          <div className="flex items-start gap-2.5">
            <NumBadge n="22" color="bg-yellow-500/25 text-yellow-200 border border-yellow-400/40" />
            <p className="font-body text-sm text-white/85 leading-relaxed">
              Sebuah <span className="text-yellow-300 font-semibold">taman berbentuk persegi panjang</span>{" "}
              dengan panjang <span className="text-yellow-300 font-semibold">3 m lebih</span> dari dua kali
              lebarnya. Jika lebar taman adalah <M math="y" /> m dan kelilingnya{" "}
              <span className="text-yellow-300 font-semibold">tidak melebihi 48 m</span>, susunlah
              pertidaksamaan dalam <M math="y" />, kemudian selesaikanlah dan tentukan luas maksimum taman!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Cards ────────────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "Membuat Model Pertidaksamaan", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/50 to-amber-900/30", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalA />,
  },
  {
    num: 2, tag: "Penerapan Pertidaksamaan pada Soal Cerita", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/50 to-yellow-900/30", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalB />,
  },
  {
    num: 3, tag: "Model & Penerapan Lanjutan", tagColor: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
    gradient: "from-yellow-900/50 to-lime-900/30", border: "border-yellow-500/25",
    bar: "from-yellow-400 to-lime-500", numBg: "bg-yellow-500/30 text-yellow-200",
    custom: <SoalC />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const ModelMatematikaPtLSVPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">📖</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(251,146,60,0.5)' }}>
            MODEL MATEMATIKA DAN
          </h1>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(251,146,60,0.5)' }}>
            PENERAPAN PERTIDAKSAMAAN
          </h1>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(251,146,60,0.5)' }}>
            PADA SOAL CERITA
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · PLSV & PtLSV · Tugas - Latihan Mandiri</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">22 Soal</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/20 text-orange-400 font-body">✦ Kelas 7</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <div key={c.num} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} backdrop-blur`} />
              <div className={`absolute inset-0 border ${c.border} rounded-2xl`} />
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${c.bar} rounded-l-2xl`} />
              <div className="relative px-5 py-4 pl-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-body shrink-0 ${c.numBg}`}>{c.num}</span>
                  <Tag label={c.tag} color={c.tagColor} />
                </div>
                <div className="pl-1">{c.custom}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/plsv-ptlsv"); }}
            className="text-sm text-white/30 hover:text-orange-400 transition-colors cursor-pointer font-body">
            ← Kembali ke PLSV & PtLSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelMatematikaPtLSVPage;
