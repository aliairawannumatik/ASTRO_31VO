import { useState } from "react";
import jualBeliImg from "@assets/image_1775640587265.png";
import berasImg from "@assets/image_1775640978525.png";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, TrendingUp, TrendingDown, Minus, Star, AlertCircle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const JualBeliUntungRugiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "impas", "persen", "tips", "contoh"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          JUAL BELI, UNTUNG DAN RUGI
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 — Aritmetika Sosial — Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ───────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Kenapa Harus Paham Untung & Rugi?</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu membeli sepasang sepatu seharga Rp150.000, lalu menjualnya ke temanmu Rp180.000. Apakah kamu untung atau rugi? Dari warung kelontong, toko online, hingga perusahaan besar — semua transaksi jual beli selalu berpusat pada dua angka kunci:
                </p>

                <figure>
                  <img src={jualBeliImg} alt="Ilustrasi Jual Beli" className="w-full rounded-xl object-cover" />
                  <figcaption className="font-body text-xs text-white/50 text-center mt-2">
                    <a href="https://www.bing.com/images/create" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">https://www.bing.com/images/create</a>
                  </figcaption>
                </figure>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="font-body text-xs font-bold text-blue-300 mb-1 uppercase tracking-wide">Harga Beli (HB) = Modal</p>
                    <p className="font-body text-xs text-white/60 leading-relaxed">Uang yang kamu <em>keluarkan</em> untuk mendapatkan atau membuat suatu barang. Disebut juga <strong className="text-white/80">modal</strong>. Ini adalah titik acuan dalam semua perhitungan.</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1 uppercase tracking-wide">Harga Jual (HJ)</p>
                    <p className="font-body text-xs text-white/60 leading-relaxed">Uang yang kamu <em>terima</em> saat menjual barang kepada pembeli. Bisa lebih tinggi, sama, atau lebih rendah dari harga beli.</p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-border rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-white/70 mb-2">🔑 Kunci Utama:</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Selisih antara <strong className="text-orange-300">HJ</strong> dan <strong className="text-blue-300">HB</strong> itulah yang menentukan apakah transaksi menghasilkan <strong className="text-green-400">untung</strong>, <strong className="text-red-400">rugi</strong>, atau <strong className="text-yellow-300">impas</strong>.
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-2 text-xs font-body">
                    <div className="flex items-center gap-2 text-green-400"><TrendingUp className="w-3 h-3" /> HJ &gt; HB → <strong>UNTUNG</strong></div>
                    <div className="flex items-center gap-2 text-red-400"><TrendingDown className="w-3 h-3" /> HJ &lt; HB → <strong>RUGI</strong></div>
                    <div className="flex items-center gap-2 text-yellow-300"><Minus className="w-3 h-3" /> HJ = HB → <strong>IMPAS</strong></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RUMUS UNTUNG & RUGI ─────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Rumus Untung & Rugi</span>
              </div>
              {expandedSections.includes("konsep") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-5">

                {/* UNTUNG */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <p className="font-body text-sm font-bold text-green-300">Untung (Laba)</p>
                  </div>
                  <p className="font-body text-xs text-white/60 leading-relaxed">
                    Untung terjadi ketika harga jual <strong className="text-white/80">lebih tinggi</strong> dari harga beli. Nilai untung menunjukkan seberapa banyak kelebihan uang yang kamu peroleh dari modal awal.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="\boxed{\text{Untung} = HJ - HB}" />
                  </div>
                  <div className="bg-green-900/20 rounded p-3 text-xs font-body text-white/70 leading-relaxed space-y-1">
                    <p><strong className="text-green-300">HJ</strong> = Harga Jual (uang yang masuk)</p>
                    <p><strong className="text-green-300">HB</strong> = Harga Beli / Modal (uang yang keluar)</p>
                    <p className="text-white/50 italic">Rumus ini hanya berlaku ketika HJ &gt; HB. Hasilnya selalu positif.</p>
                  </div>
                </div>

                {/* RUGI */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <p className="font-body text-sm font-bold text-red-300">Rugi</p>
                  </div>
                  <p className="font-body text-xs text-white/60 leading-relaxed">
                    Rugi terjadi ketika harga jual <strong className="text-white/80">lebih rendah</strong> dari harga beli. Ini bisa terjadi karena barang sudah rusak, kedaluwarsa, atau dijual cepat karena butuh uang.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="\boxed{\text{Rugi} = HB - HJ}" />
                  </div>
                  <div className="bg-red-900/20 rounded p-3 text-xs font-body text-white/70 leading-relaxed space-y-1">
                    <p><strong className="text-red-300">HB</strong> = Harga Beli / Modal (uang yang keluar)</p>
                    <p><strong className="text-red-300">HJ</strong> = Harga Jual (uang yang masuk)</p>
                    <p className="text-white/50 italic">Posisi HB dan HJ dibalik dibanding rumus untung! Hasilnya selalu positif karena HB &gt; HJ saat rugi.</p>
                  </div>
                </div>

                {/* MENCARI HJ DARI % */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-blue-300">Mencari Harga Jual dari Persentase</p>
                  <p className="font-body text-xs text-white/60 leading-relaxed">
                    Ketika kamu sudah tahu modal dan ingin menargetkan keuntungan atau batas kerugian dalam persen, gunakan rumus ini untuk menentukan harga jual yang tepat.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                      <p className="font-body text-xs text-green-300 font-semibold">Jika target untung U%:</p>
                      <BlockMath math="HJ = \frac{100 + U}{100} \times HB" />
                      <p className="font-body text-xs text-white/50 leading-relaxed">Artinya: harga jual = modal ditambah sekian persen dari modal. <InlineMath math="(100+U)\%" /> dari modal.</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                      <p className="font-body text-xs text-red-300 font-semibold">Jika batas rugi R%:</p>
                      <BlockMath math="HJ = \frac{100 - R}{100} \times HB" />
                      <p className="font-body text-xs text-white/50 leading-relaxed">Artinya: harga jual = modal dikurangi sekian persen dari modal. <InlineMath math="(100-R)\%" /> dari modal.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-yellow-200 leading-relaxed">
                    <strong>Perhatian:</strong> Persentase untung dan rugi <em>selalu</em> dihitung terhadap <strong>harga beli (modal)</strong>, bukan harga jual. Ini adalah kesalahan paling umum dalam soal aritmetika sosial!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── IMPAS ───────────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("impas")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Minus className="w-5 h-5 text-yellow-300" />
                <span className="font-body font-semibold text-white">Kondisi Impas (Break Even)</span>
              </div>
              {expandedSections.includes("impas") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("impas") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  <strong className="text-yellow-300">Impas</strong> (break even) adalah kondisi di mana harga jual sama persis dengan harga beli. Penjual tidak untung, tapi juga tidak rugi. Kondisi ini sering terjadi ketika pedagang ingin memutar modal dengan cepat, atau saat barang tidak laku dan harus segera dijual.
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="bg-slate-900/60 rounded-lg p-3 mb-3">
                    <BlockMath math="\boxed{HJ = HB \implies \text{Impas (tidak untung, tidak rugi)}}" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                    <div className="bg-slate-800/50 rounded p-2 text-center">
                      <p className="text-white/50 mb-1">Untung</p>
                      <p className="text-green-400 font-bold">&gt; 0</p>
                      <p className="text-white/40">HJ &gt; HB</p>
                    </div>
                    <div className="bg-yellow-500/20 rounded p-2 text-center border border-yellow-500/40">
                      <p className="text-white/50 mb-1">Impas</p>
                      <p className="text-yellow-300 font-bold">= 0</p>
                      <p className="text-white/40">HJ = HB</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2 text-center">
                      <p className="text-white/50 mb-1">Rugi</p>
                      <p className="text-red-400 font-bold">&lt; 0</p>
                      <p className="text-white/40">HJ &lt; HB</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="font-body text-xs text-white/60 leading-relaxed">
                    <strong className="text-white/80">Contoh situasi impas:</strong> Sebuah toko membeli buku seharga Rp25.000 per buah. Agar tidak rugi, harga jual minimum yang boleh dipatok adalah <strong className="text-yellow-300">Rp25.000</strong>. Di titik ini penjual impas — belum ada keuntungan, tapi modal sudah kembali.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── PERSENTASE & MENCARI HB ─────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("persen")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">Persentase Untung/Rugi & Mencari Harga Beli</span>
              </div>
              {expandedSections.includes("persen") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("persen") && (
              <div className="px-5 pb-5 space-y-5">

                <p className="font-body text-sm text-white/70 leading-relaxed">
                  Nilai untung/rugi dalam rupiah saja tidak selalu cukup. Persentase memberikan gambaran <em>seberapa besar</em> untung atau rugi relatif terhadap modal — sehingga mudah membandingkan efisiensi berbagai transaksi.
                </p>

                {/* % Untung & % Rugi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm font-bold text-purple-300">Persentase Untung</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\%U = \frac{\text{Untung}}{HB} \times 100\%" />
                    </div>
                    <p className="font-body text-xs text-white/55 leading-relaxed">
                      Rumus ini menjawab: <em>"Untungku sebesar berapa persen dari modalku?"</em> Pembagi adalah <strong className="text-white/70">HB (modal)</strong>, bukan HJ. Contoh: untung Rp20.000 dari modal Rp100.000 berarti <InlineMath math="\%U = 20\%" />.
                    </p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm font-bold text-purple-300">Persentase Rugi</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="\%R = \frac{\text{Rugi}}{HB} \times 100\%" />
                    </div>
                    <p className="font-body text-xs text-white/55 leading-relaxed">
                      Menjawab: <em>"Rugiku sebesar berapa persen dari modalku?"</em> Rugi dihitung dari selisih <InlineMath math="HB - HJ" />, lalu dibagi modal, dikali 100%. Hasilnya selalu positif.
                    </p>
                  </div>
                </div>

                {/* Mencari HB */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-cyan-300">Mencari Harga Beli dari Harga Jual & Persentase</p>
                  <p className="font-body text-xs text-white/60 leading-relaxed">
                    Rumus ini berguna ketika kamu hanya tahu <strong className="text-white/80">harga jual</strong> dan <strong className="text-white/80">persentase untung/rugi</strong>, tapi tidak tahu modal awalnya. Ini sering muncul di soal berbentuk cerita.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                      <p className="font-body text-xs text-green-300 font-semibold">Jika diketahui untung U%:</p>
                      <BlockMath math="HB = \frac{100}{100 + U} \times HJ" />
                      <p className="font-body text-xs text-white/50 leading-relaxed">Logika: jika HJ sudah termasuk keuntungan U%, maka HJ setara dengan <InlineMath math="(100+U)\%" /> dari HB. Balik rumusnya untuk dapat HB.</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                      <p className="font-body text-xs text-red-300 font-semibold">Jika diketahui rugi R%:</p>
                      <BlockMath math="HB = \frac{100}{100 - R} \times HJ" />
                      <p className="font-body text-xs text-white/50 leading-relaxed">Logika: jika HJ sudah dikurangi kerugian R%, maka HJ setara dengan <InlineMath math="(100-R)\%" /> dari HB. Balik rumusnya untuk dapat HB.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── TIPS & STRATEGI ─────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("tips")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Tips & Strategi Mengerjakan Soal</span>
              </div>
              {expandedSections.includes("tips") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("tips") && (
              <div className="px-5 pb-5 space-y-4">

                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-800/60 rounded-lg p-4 flex gap-3">
                    <span className="text-yellow-400 font-bold text-sm shrink-0">01</span>
                    <div>
                      <p className="font-body text-xs font-semibold text-white/90 mb-1">Tentukan dulu: Untung atau Rugi?</p>
                      <p className="font-body text-xs text-white/55 leading-relaxed">Sebelum menghitung, bandingkan HJ dan HB. Jika HJ &gt; HB → pakai rumus untung. Jika HJ &lt; HB → pakai rumus rugi. Jangan sampai terbalik!</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-4 flex gap-3">
                    <span className="text-yellow-400 font-bold text-sm shrink-0">02</span>
                    <div>
                      <p className="font-body text-xs font-semibold text-white/90 mb-1">Persen selalu terhadap modal (HB)</p>
                      <p className="font-body text-xs text-white/55 leading-relaxed">Ingat: <InlineMath math="\%U" /> dan <InlineMath math="\%R" /> dibagi oleh <strong>HB</strong>, bukan HJ. Kalau salah pembagi, hasil persennya akan salah.</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-4 flex gap-3">
                    <span className="text-yellow-400 font-bold text-sm shrink-0">03</span>
                    <div>
                      <p className="font-body text-xs font-semibold text-white/90 mb-1">Cara cepat mencari HJ dari persentase</p>
                      <p className="font-body text-xs text-white/55 leading-relaxed">Gunakan faktor pengali: untung 20% → kalikan modal dengan <InlineMath math="1{,}2" />. Rugi 15% → kalikan modal dengan <InlineMath math="0{,}85" />. Lebih cepat daripada substitusi ke rumus panjang.</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-4 flex gap-3">
                    <span className="text-yellow-400 font-bold text-sm shrink-0">04</span>
                    <div>
                      <p className="font-body text-xs font-semibold text-white/90 mb-1">Cek ulang dengan logika sederhana</p>
                      <p className="font-body text-xs text-white/55 leading-relaxed">Setelah mendapat jawaban, tanyakan: "Masuk akal tidak?" Jika modal Rp100.000 dan dijual untung 20%, HJ harus lebih dari Rp100.000. Jika hasilmu kurang dari itu, ada yang salah.</p>
                    </div>
                  </div>
                </div>

                {/* Tabel ringkasan rumus */}
                <div className="bg-slate-900/60 border border-border rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-slate-800/80">
                    <p className="font-body text-xs font-bold text-white/70 uppercase tracking-wide">Ringkasan Semua Rumus</p>
                  </div>
                  <div className="p-3 space-y-2 font-body text-xs text-white/70">
                    <div className="flex gap-2 items-start"><span className="text-green-400 shrink-0 font-bold w-28">Untung</span><span><InlineMath math="= HJ - HB" /></span></div>
                    <div className="flex gap-2 items-start"><span className="text-red-400 shrink-0 font-bold w-28">Rugi</span><span><InlineMath math="= HB - HJ" /></span></div>
                    <div className="flex gap-2 items-start"><span className="text-purple-300 shrink-0 font-bold w-28">% Untung</span><span><InlineMath math="= \frac{\text{Untung}}{HB} \times 100\%" /></span></div>
                    <div className="flex gap-2 items-start"><span className="text-purple-300 shrink-0 font-bold w-28">% Rugi</span><span><InlineMath math="= \frac{\text{Rugi}}{HB} \times 100\%" /></span></div>
                    <div className="flex gap-2 items-start"><span className="text-blue-300 shrink-0 font-bold w-28">HJ (untung U%)</span><span><InlineMath math="= \frac{100+U}{100} \times HB" /></span></div>
                    <div className="flex gap-2 items-start"><span className="text-blue-300 shrink-0 font-bold w-28">HJ (rugi R%)</span><span><InlineMath math="= \frac{100-R}{100} \times HB" /></span></div>
                    <div className="flex gap-2 items-start"><span className="text-cyan-300 shrink-0 font-bold w-28">HB (dari untung)</span><span><InlineMath math="= \frac{100}{100+U} \times HJ" /></span></div>
                    <div className="flex gap-2 items-start"><span className="text-cyan-300 shrink-0 font-bold w-28">HB (dari rugi)</span><span><InlineMath math="= \frac{100}{100-R} \times HJ" /></span></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ─────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Contoh Soal dan Pembahasan</span>
              </div>
              {expandedSections.includes("contoh") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 1 – Menghitung Untung & Persentasenya</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Seorang pedagang membeli 1 karung beras seharga <strong>Rp180.000</strong> lalu menjualnya seharga <strong>Rp225.000</strong>. Hitunglah besar untung dan persentase keuntungannya!
                    </p>
                  </div>
                  <figure>
                    <img src={berasImg} alt="Pedagang beras di pasar" className="w-full rounded-xl object-cover" />
                    <figcaption className="font-body text-xs text-white/50 text-center mt-2">
                      <a href="https://infoburuh.com/wp-content/uploads/2022/12/Harga_Beras_Indonesia_Disebut_Bank_Dunia_Paling_Mahal_di_Asia_Tenggara.jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">https://infoburuh.com/wp-content/uploads/2022/12/Harga_Beras_Indonesia_Disebut_Bank_Dunia_Paling_Mahal_di_Asia_Tenggara.jpg</a>
                    </figcaption>
                  </figure>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="text-xs text-white/60 space-y-1">
                        <p>✦ Diketahui: <InlineMath math="HB = \text{Rp}180.000" />, <InlineMath math="HJ = \text{Rp}225.000" /></p>
                        <p>✦ Karena HJ &gt; HB, maka pedagang <strong className="text-green-400">UNTUNG</strong></p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Untung} = HJ - HB = 225.000 - 180.000 = \text{Rp}45.000" />
                        <BlockMath math="\%U = \frac{\text{Untung}}{HB} \times 100\% = \frac{45.000}{180.000} \times 100\% = 25\%" />
                      </div>
                      <p className="text-green-300 font-semibold text-xs">✅ Pedagang untung Rp45.000 atau 25% dari modal.</p>
                    </div>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 2 – Menentukan Harga Jual dari Persentase Untung</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Seorang pedagang buah membeli durian seharga <strong>Rp240.000</strong> per buah. Ia ingin mendapatkan untung <strong>35%</strong> dari modal. Berapa harga jual yang harus ia patok?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="text-xs text-white/60 space-y-1">
                        <p>✦ Diketahui: <InlineMath math="HB = \text{Rp}240.000" />, untung <InlineMath math="U = 35\%" /></p>
                        <p>✦ Ditanya: <InlineMath math="HJ = \,?" /> → gunakan rumus HJ dari persentase untung</p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="HJ = \frac{100 + 35}{100} \times 240.000 = \frac{135}{100} \times 240.000" />
                        <BlockMath math="HJ = 1{,}35 \times 240.000 = \text{Rp}324.000" />
                      </div>
                      <p className="text-yellow-300 font-semibold text-xs">✅ Harga jual yang harus dipatok = Rp324.000</p>
                    </div>
                  </div>
                </div>

                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 3 – Mencari Harga Beli dari Harga Jual & Persentase Rugi</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Sebuah sepeda dijual seharga <strong>Rp680.000</strong> dan penjual mengalami kerugian sebesar <strong>15%</strong>. Berapakah harga beli sepeda tersebut? Berapa pula rugi dalam rupiah?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="text-xs text-white/60 space-y-1">
                        <p>✦ Diketahui: <InlineMath math="HJ = \text{Rp}680.000" />, rugi <InlineMath math="R = 15\%" /></p>
                        <p>✦ Karena rugi, maka HB &gt; HJ. Cari HB terlebih dahulu.</p>
                      </div>
                      <p className="text-xs font-semibold text-white/80">Langkah 1 — Cari Harga Beli:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="HB = \frac{100}{100 - 15} \times 680.000 = \frac{100}{85} \times 680.000" />
                        <BlockMath math="HB = \frac{68.000.000}{85} = \text{Rp}800.000" />
                      </div>
                      <p className="text-xs font-semibold text-white/80">Langkah 2 — Cari Rugi dalam Rupiah:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Rugi} = HB - HJ = 800.000 - 680.000 = \text{Rp}120.000" />
                      </div>
                      <div className="text-xs text-white/60 space-y-1">
                        <p>✦ Verifikasi: <InlineMath math="\%R = \frac{120.000}{800.000} \times 100\% = 15\%" /> ✓ Sesuai dengan soal!</p>
                      </div>
                      <p className="text-red-300 font-semibold text-xs">✅ Harga beli sepeda = Rp800.000. Kerugian = Rp120.000.</p>
                    </div>
                  </div>
                </div>

                {/* BONUS — IMPAS */}
                <div className="border-l-4 border-yellow-400 pl-4 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-yellow-400/20 text-yellow-300 text-xs font-bold px-2 py-1 rounded">BONUS</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 4 – Kondisi Impas (Break Even)</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Seorang pedagang membeli 10 buah mangga seharga <strong>Rp50.000</strong>. Ia menjual 7 buah seharga <strong>Rp6.000</strong> per buah dan sisanya busuk. Apakah pedagang untung, rugi, atau impas?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="text-xs text-white/60 space-y-1">
                        <p>✦ HB (modal) = Rp50.000</p>
                        <p>✦ HJ (total hasil jual) = 7 × Rp6.000 = Rp42.000</p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="HJ < HB \implies \text{RUGI}" />
                        <BlockMath math="\text{Rugi} = 50.000 - 42.000 = \text{Rp}8.000" />
                      </div>
                      <p className="text-xs text-white/60">Agar impas, pedagang perlu menjual total Rp50.000 → minimal <InlineMath math="\lceil 50.000 \div 6.000 \rceil = 9" /> buah mangga.</p>
                      <p className="text-yellow-300 font-semibold text-xs">✅ Pedagang rugi Rp8.000. Agar impas, ia harus jual minimal 9 buah.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aritmetika-sosial"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Aritmetika Sosial
          </button>
        </div>
      </div>
    </div>
  );
};

export default JualBeliUntungRugiPage;
