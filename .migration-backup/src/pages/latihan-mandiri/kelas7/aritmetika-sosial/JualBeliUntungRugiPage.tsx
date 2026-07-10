import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const JualBeliUntungRugiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          JUAL BELI, UNTUNG DAN RUGI
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Latihan Mandiri - Aritmetika Sosial</p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <p className="text-yellow-400 text-sm mb-6 font-body">Kerjakan soal-soal berikut lengkap dengan caranya</p>

          <div className="space-y-6 text-white/90 font-body text-sm leading-relaxed">
            {/* Soal 1 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">1.</span>
              <p>Seorang penjual tas membeli sebuah tas ransel seharga Rp150.000,00. Ia kemudian berhasil menjual tas tersebut kepada pelanggannya dengan harga Rp180.000,00. Hitunglah berapa rupiah keuntungan yang didapatkan oleh penjual tersebut! Nyatakan pula keuntungan itu dalam bentuk persentase.</p>
            </div>

            {/* Soal 2 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">2.</span>
              <p>Pemilik toko elektronik menjual sebuah smartwatch bekas dengan harga Rp900.000,00. Dari penjualan tersebut, ia mengklaim telah mengantongi keuntungan sebesar 20%. Berapakah modal awal yang dikeluarkan pemilik toko saat menebus smartwatch itu?</p>
            </div>

            {/* Soal 3 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">3.</span>
              <p>Ibu Darni memborong 30 kg telur ayam langsung dari peternak dengan total harga Rp750.000,00. Telur-telur tersebut kemudian ia ecerkan di warungnya dengan harga Rp28.000,00 per kilogram. Analisislah, apakah Ibu Darni mengalami keuntungan atau kerugian? Nyatakan status untung atau ruginya dalam nominal rupiah dan persen.</p>
            </div>

            {/* Soal 4 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">4.</span>
              <p>Pak Anton memborong 20 helai kaus polos seharga Rp600.000,00. Kaus-kaus tersebut kemudian ia jual kembali secara eceran. Sebanyak 10 helai kaus berhasil terjual dengan harga Rp45.000,00 per helai, 8 helai laku terjual saat promo seharga Rp35.000,00 per helai, dan sisanya ia pakai sendiri untuk olahraga. Tentukan apakah Pak Anton mendapatkan keuntungan atau menelan kerugian, lalu nyatakan dalam rupiah dan persen!</p>
            </div>

            {/* Soal 5 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">5.</span>
              <p>Sebuah kedai membeli 50 cup puding premium dengan total modal Rp750.000,00. Sebanyak 20 cup diborong oleh panitia acara rapat dengan margin keuntungan 10% (dari harga modal per cup), sedangkan sisanya dipajang di etalase dan laku terjual eceran seharga Rp18.000,00 per cup. Hitunglah keseluruhan keuntungan yang diraup kedai tersebut dalam wujud rupiah dan persentasenya!</p>
            </div>

            {/* Soal 6 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">6.</span>
              <p>Kak Rina membeli sebuah meja lipat seharga Rp350.000,00 saat ia baru masuk kuliah. Setelah lulus dan harus pindah kota, ia terpaksa menjual meja lipat preloved tersebut dan laku seharga Rp245.000,00. Berapa rupiah nilai penyusutan (kerugian) yang dialami Kak Rina? Nyatakan pula kerugian tersebut ke dalam bentuk persen!</p>
            </div>

            {/* Soal 7 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">7.</span>
              <p>Pak Rendi terpaksa menjual ponsel pintarnya karena sedang membutuhkan dana cepat. Ia menjual ponsel tersebut dengan harga Rp1.600.000,00. Dari hasil penjualan itu, Pak Rendi harus menelan kerugian sebesar 20% dari modal awalnya. Berapakah harga beli ponsel tersebut saat pertama kali Pak Rendi membelinya?</p>
            </div>

            {/* Soal 8 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">8.</span>
              <p>Deni membeli sebuah sepeda gunung bekas di pasar loak seharga Rp450.000,00. Karena kondisinya kurang prima, Deni membawa sepeda tersebut ke bengkel dan menghabiskan biaya Rp150.000,00 untuk mengganti rantai dan ban yang aus. Setelah sepeda kembali bagus, Deni menjualnya ke teman sekolahnya dan berhasil meraup keuntungan sebesar 25%. Berapa rupiahkah harga jual sepeda tersebut?</p>
            </div>

            {/* Soal 9 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">9.</span>
              <p>Bu Tari memborong 100 kg buah mangga dari petani dengan total harga Rp1.500.000,00. Setelah disortir, ternyata ada 10 kg mangga yang busuk dan tidak bisa dijual sama sekali. Jika Bu Tari ingin tetap mendapatkan keuntungan total sebesar 20% dari modal awalnya, berapakah harga jual per kilogram yang harus ia tetapkan untuk sisa mangga yang kondisinya masih bagus?</p>
            </div>

            {/* Soal 10 */}
            <div className="border-l-2 border-accent/50 pl-4 flex gap-3">
              <span className="font-semibold text-accent shrink-0">10.</span>
              <p>Pak Johan ingin membeli sebuah sepeda motor listrik. Harga tunai motor tersebut adalah Rp20.000.000,00. Namun, dealer menawarkan opsi kredit dengan syarat: Uang Muka (DP) sebesar Rp5.000.000,00 dan cicilan per bulan sebesar Rp700.000,00 selama 3 tahun. Berapa persentase total biaya tambahan yang harus ditanggung Pak Johan jika ia memilih opsi kredit dibandingkan dengan jika ia membelinya secara tunai?</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/aritmetika-sosial"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Aritmetika Sosial
          </button>
        </div>
      </div>
    </div>
  );
};

export default JualBeliUntungRugiPage;
