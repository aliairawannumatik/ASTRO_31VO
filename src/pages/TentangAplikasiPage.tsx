import { useEffect, useRef } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";

const TentangAplikasiPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />

      {/* Shooting stars effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animation: `shootingStar ${3 + Math.random() * 3}s linear infinite`,
              animationDelay: `${i * 2}s`,
              boxShadow: '0 0 10px 2px rgba(34, 211, 238, 0.6)'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px);
            opacity: 0;
          }
        }
      `}</style>

      <PageNavigation />

      <div className="relative z-10 max-w-4xl w-full px-4 py-10">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-20 blur-2xl animate-pulse" />
            <img
              src="/logo-numatik.png"
              alt="NUMATIK Logo"
              className="relative w-32 h-32 mx-auto object-contain opacity-90 hover:opacity-100 transition-opacity drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]"
            />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-primary text-glow-cyan mb-2">
            NUMATIK
          </h1>
          <p className="text-accent font-body text-sm">
            Numerasi Aktif dengan Teknologi Informasi dan Komunikasi
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 md:p-8 mb-6 animate-slide-up">
          <div className="space-y-4">
            <p className="text-white font-body text-sm md:text-base leading-relaxed text-justify">
              <strong className="text-primary">Numatik</strong> adalah aplikasi edukasi matematika yang dirancang khusus untuk menjembatani tantangan belajar di era digital. Lahir dari semangat untuk menghadirkan pembelajaran yang tidak hanya informatif, tetapi juga <strong className="text-accent">bermakna dan menyenangkan</strong>.
            </p>

            <p className="text-white/90 font-body text-sm md:text-base leading-relaxed text-justify">
              Diluncurkan pertama kali pada tahun <strong className="text-primary">2026</strong>, Numatik dikembangkan sepenuhnya selaras dengan <strong className="text-accent">Kurikulum Merdeka</strong>. Aplikasi ini mengintegrasikan pendekatan <strong className="text-secondary">Deep Learning</strong> untuk memastikan siswa tidak sekadar menghafal rumus, melainkan memahami konsep secara mendalam, kritis, dan kontekstual.
            </p>

            <p className="text-white/80 font-body text-sm md:text-base leading-relaxed text-justify">
              Walaupun awalnya didedikasikan untuk siswa-siswi <strong className="text-primary">SMPN 28 Bandung</strong>, Numatik dipersiapkan untuk menjadi sahabat belajar bagi seluruh siswa SMP di pelosok Nusantara.
            </p>
          </div>
        </div>

        {/* Ucapan Terima Kasih — Kelompok A2 Guru Penggerak */}
        <div className="animate-slide-up mb-6" style={{ animationDelay: '0.40s' }}>
          {/* Section Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 via-amber-400/10 to-orange-500/10 border border-orange-400/30 rounded-full px-5 py-1.5">
              <span className="text-orange-300 text-sm">✦</span>
              <p className="text-orange-300 font-display text-xs font-bold tracking-widest uppercase">Ucapan Terima Kasih</p>
              <span className="text-orange-300 text-sm">✦</span>
            </div>
          </div>

          {/* Kelompok A2 Card */}
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400 shadow-[0_0_40px_rgba(251,146,60,0.3)]">
            <div className="relative rounded-2xl bg-[#0d0d2b] p-6 overflow-hidden">

              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-4 left-4 text-orange-400/20 text-6xl font-serif pointer-events-none select-none">"</div>
              <div className="absolute bottom-4 right-4 text-orange-400/20 text-6xl font-serif pointer-events-none select-none">"</div>

              {/* Photo + Name */}
              <div className="flex flex-col items-center mb-5 relative z-10">
                <div className="relative mb-4 w-full">
                  <div className="w-full rounded-xl overflow-hidden border-2 border-orange-400/50">
                    <img
                      src="/kelompok-a2-foto.png"
                      alt="Kelompok A2 Guru Penggerak Angkatan 10"
                      className="w-full object-cover"
                    />
                  </div>
                </div>

                {/* Badge */}
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/40 rounded-full px-4 py-0.5 mb-2">
                  <p className="text-orange-300 font-body text-[10px] font-bold tracking-widest uppercase">Inspirasi Pertama · Guru Penggerak Angkatan 10</p>
                </div>

                {/* Name */}
                <h3 className="font-display text-xl font-black text-white text-center drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]">
                  Kelompok A2 Guru Penggerak
                </h3>
                <p className="text-white/50 font-body text-xs mt-0.5 text-center">Angkatan 10 · Kota Bandung</p>

                {/* Pembimbing */}
                <div className="w-full mt-4 mb-2">
                  <p className="text-orange-300/70 font-display text-[10px] font-bold tracking-widest uppercase text-center mb-2">
                    Pembimbing (Pengajar Praktik)
                  </p>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2.5 bg-orange-500/10 border border-orange-400/25 rounded-xl px-4 py-2">
                      <span className="text-orange-400 text-base shrink-0">⭐</span>
                      <span className="text-white/90 font-body text-xs font-bold">Ibu Evi Kuswanty, S.Pd</span>
                    </div>
                  </div>
                </div>

                {/* Anggota */}
                <div className="w-full mt-3">
                  <p className="text-orange-300/70 font-display text-[10px] font-bold tracking-widest uppercase text-center mb-2">
                    Anggota &amp; Rekan
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Deni Nugraha, S.Pd",
                      "Cheri Indrayana, S.Pd",
                      "Nurhayanti Retnamasari, S.Pd",
                      "Erlita Fujiawati Akbari, S.Pd",
                      "Sri Aryati Handayani, S.Pd",
                    ].map((nama) => (
                      <div
                        key={nama}
                        className="flex items-center gap-2.5 bg-amber-500/8 border border-amber-400/20 rounded-xl px-3 py-2"
                      >
                        <span className="text-amber-400 text-base shrink-0">✦</span>
                        <span className="text-white/85 font-body text-xs leading-snug">{nama}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent mb-5" />

              {/* Thank you message */}
              <div className="relative z-10 space-y-3 text-center px-2">
                <p className="text-white/90 font-body text-sm leading-relaxed text-justify">
                  Terima kasih yang sebesar-besarnya kepada <strong className="text-orange-300">Kelompok A2 Guru Penggerak Angkatan 10</strong> — kelompok luar biasa yang menjadi <strong className="text-amber-300">inspirasi pertama</strong> lahirnya aplikasi NUMATIK. Di sinilah benih ide itu pertama kali tumbuh dan mulai mengakar.
                </p>
                <p className="text-white/80 font-body text-sm leading-relaxed text-justify">
                  Kepada <strong className="text-orange-300">Ibu Evi Kuswanty, S.Pd</strong> selaku Pengajar Praktik yang telah membimbing dengan penuh semangat, dan kepada seluruh rekan anggota — Bapak Deni, Bapak Cheri, Ibu Nurhayanti, Ibu Erlita, dan Ibu Sri — terima kasih telah menjadi bagian dari awal mula perjalanan ini.
                </p>
                <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                  "Dari satu kelompok kecil yang penuh semangat bergerak, lahirlah sebuah aplikasi yang berharap bisa menggerakkan ribuan pelajar."
                </p>

                {/* Tagline menggelegar */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3/4 h-12 bg-orange-500/20 rounded-full blur-2xl" />
                  </div>
                  <p
                    className="relative font-display text-xl md:text-2xl font-black text-center tracking-widest uppercase"
                    style={{
                      background: "linear-gradient(90deg, #fb923c, #fbbf24, #fef08a, #fbbf24, #fb923c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      textShadow: "none",
                      filter: "drop-shadow(0 0 12px rgba(251,146,60,0.9)) drop-shadow(0 0 28px rgba(251,191,36,0.6))",
                      letterSpacing: "0.12em",
                    }}
                  >
                    "Tergerak, Bergerak, dan Menggerakkan"
                  </p>
                </div>

                {/* Appreciation badges */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {["🌱 Inspirasi Pertama", "🔥 Semangat Bergerak", "🤝 Kebersamaan", "🏆 Guru Penggerak"].map((item) => (
                    <span
                      key={item}
                      className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60 font-body text-[11px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Closing */}
                <div className="pt-3">
                  <p className="text-orange-300/80 font-display text-xs font-bold tracking-widest">
                    ✦ &nbsp; TERIMA KASIH, KELOMPOK A2 GURU PENGGERAK ANGKATAN 10 &nbsp; ✦
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Ucapan Terima Kasih */}
        <div className="animate-slide-up mb-6" style={{ animationDelay: '0.45s' }}>
          {/* Section Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 via-amber-400/10 to-yellow-500/10 border border-yellow-400/30 rounded-full px-5 py-1.5">
              <span className="text-yellow-300 text-sm">✦</span>
              <p className="text-yellow-300 font-display text-xs font-bold tracking-widest uppercase">Ucapan Terima Kasih</p>
              <span className="text-yellow-300 text-sm">✦</span>
            </div>
          </div>

          {/* Main Thank You Card */}
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400 via-violet-500 to-amber-400 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            <div className="relative rounded-2xl bg-[#0d0d2b] p-6 overflow-hidden">

              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-4 left-4 text-yellow-400/20 text-6xl font-serif pointer-events-none select-none">"</div>
              <div className="absolute bottom-4 right-4 text-yellow-400/20 text-6xl font-serif pointer-events-none select-none">"</div>

              {/* Photo + Name */}
              <div className="flex flex-col items-center mb-5 relative z-10">
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-cyan-400/50">
                    <img
                      src="/wandri-foto.png"
                      alt="Bapak Wandri, S.Pd., Gr."
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Badge */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/40 rounded-full px-4 py-0.5 mb-2">
                  <p className="text-cyan-300 font-body text-[10px] font-bold tracking-widest uppercase">Guru Inspiratif · Mentor IT</p>
                </div>

                {/* Name */}
                <h3 className="font-display text-xl font-black text-white text-center drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
                  Bapak Wandri, S.Pd., Gr.
                </h3>
                <p className="text-white/50 font-body text-xs mt-0.5 text-center">SMP Santa Maria · Kota Bandung</p>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-400/40 to-transparent mb-5" />

              {/* Thank you message */}
              <div className="relative z-10 space-y-3 text-center px-2">
                <p className="text-white/90 font-body text-sm leading-relaxed text-justify">
                  Terima kasih yang sebesar-besarnya saya haturkan kepada <strong className="text-cyan-300">Bapak Wandri, S.Pd., Gr.</strong> — sosok rekan sekaligus guru yang dengan penuh dedikasi, kesabaran, dan keikhlasan telah membuka cakrawala pengetahuan di bidang <strong className="text-accent">Teknologi Informasi dan Komunikasi</strong>.
                </p>
                <p className="text-white/80 font-body text-sm leading-relaxed text-justify">
                  Ilmu, wawasan, dan semangat yang Bapak bagikan menjadi fondasi nyata lahirnya aplikasi <strong className="text-primary">NUMATIK</strong> ini. Tanpa bimbingan dan dukungan Bapak, perjalanan merangkai setiap baris kode demi baris kode tidak akan pernah terasa seindah dan semakna ini.
                </p>
                <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                  "Guru sejati bukan hanya yang mengajarkan ilmu, melainkan yang menyalakan cahaya semangat di dalam diri muridnya — dan Bapak telah melakukannya dengan luar biasa."
                </p>

                {/* Appreciation badges */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {["💡 Inspirasi", "🤝 Kolaborasi", "📚 Ilmu TIK", "🌟 Dedikasi"].map((item) => (
                    <span
                      key={item}
                      className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60 font-body text-[11px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Closing */}
                <div className="pt-3">
                  <p className="text-yellow-300/80 font-display text-xs font-bold tracking-widest">
                    ✦ &nbsp; TERIMA KASIH SEBESAR-BESARNYA, PAK WANDRI &nbsp; ✦
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Ucapan Terima Kasih MGMP */}
        <div className="animate-slide-up mb-6" style={{ animationDelay: '0.55s' }}>
          {/* Section Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 via-teal-400/10 to-emerald-500/10 border border-emerald-400/30 rounded-full px-5 py-1.5">
              <span className="text-emerald-300 text-sm">✦</span>
              <p className="text-emerald-300 font-display text-xs font-bold tracking-widest uppercase">Ucapan Terima Kasih</p>
              <span className="text-emerald-300 text-sm">✦</span>
            </div>
          </div>

          {/* MGMP Card */}
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <div className="relative rounded-2xl bg-[#0d0d2b] p-6 overflow-hidden">

              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-4 left-4 text-emerald-400/20 text-6xl font-serif pointer-events-none select-none">"</div>
              <div className="absolute bottom-4 right-4 text-emerald-400/20 text-6xl font-serif pointer-events-none select-none">"</div>

              {/* Photo + Name */}
              <div className="flex flex-col items-center mb-5 relative z-10">
                <div className="relative mb-4 w-full">
                  <div className="w-full rounded-xl overflow-hidden border-2 border-emerald-400/50">
                    <img
                      src="/mgmp-foto.png"
                      alt="Tim MGMP Matematika SMPN 28 Bandung"
                      className="w-full object-cover"
                    />
                  </div>
                </div>

                {/* Badge */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 rounded-full px-4 py-0.5 mb-2">
                  <p className="text-emerald-300 font-body text-[10px] font-bold tracking-widest uppercase">Keluarga · Motivator · Kolaborator</p>
                </div>

                {/* Name */}
                <h3 className="font-display text-xl font-black text-white text-center drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">
                  Tim MGMP Matematika
                </h3>
                <p className="text-white/50 font-body text-xs mt-0.5 text-center">SMPN 28 Bandung · Kota Bandung</p>

                {/* Daftar Personil */}
                <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { nama: "Bapak Mohamad Kosasih, S.Pd" },
                    { nama: "Ibu Maya Rahmawati, S.Pd" },
                    { nama: "Ibu Dini Haerani, S.Pd" },
                    { nama: "Ibu Yulia Eka Rachmayunita, S.Pd" },
                  ].map((p) => (
                    <div
                      key={p.nama}
                      className="flex items-center gap-2.5 bg-emerald-500/8 border border-emerald-400/20 rounded-xl px-3 py-2"
                    >
                      <span className="text-emerald-400 text-base shrink-0">✦</span>
                      <span className="text-white/85 font-body text-xs leading-snug">{p.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent mb-5" />

              {/* Thank you message */}
              <div className="relative z-10 space-y-3 text-center px-2">
                <p className="text-white/90 font-body text-sm leading-relaxed text-justify">
                  Terima kasih yang sebesar-besarnya saya haturkan kepada <strong className="text-emerald-300">Tim MGMP Matematika SMPN 28 Bandung</strong> — rekan-rekan luar biasa yang telah memberikan begitu banyak <strong className="text-accent">motivasi, masukan, dan dukungan</strong> yang sangat berarti dalam proses pengembangan aplikasi ini.
                </p>
                <p className="text-white/80 font-body text-sm leading-relaxed text-justify">
                  Setiap saran mengenai konten materi dan desain yang diberikan menjadi bahan bakar semangat yang terus mendorong aplikasi <strong className="text-primary">NUMATIK</strong> untuk berkembang menjadi lebih baik. Lebih dari sekadar rekan kerja, kalian telah menjadi <strong className="text-emerald-300">keluarga</strong> bagi saya.
                </p>
                <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                  "Bersama kalian, setiap proses terasa lebih ringan, setiap pencapaian terasa lebih bermakna. Terima kasih sudah menjadi bagian dari perjalanan ini."
                </p>

                {/* Appreciation badges */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {["💚 Motivasi", "🤝 Kebersamaan", "📐 Konten Materi", "🎨 Masukan Desain"].map((item) => (
                    <span
                      key={item}
                      className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60 font-body text-[11px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Closing */}
                <div className="pt-3">
                  <p className="text-emerald-300/80 font-display text-xs font-bold tracking-widest">
                    ✦ &nbsp; TERIMA KASIH, TIM MGMP MATEMATIKA SMPN 28 BANDUNG &nbsp; ✦
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Ucapan Terima Kasih Individu */}
        <div className="animate-slide-up mb-6" style={{ animationDelay: '0.65s' }}>
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500/10 via-pink-400/10 to-rose-500/10 border border-rose-400/30 rounded-full px-5 py-1.5">
              <span className="text-rose-300 text-sm">✦</span>
              <p className="text-rose-300 font-display text-xs font-bold tracking-widest uppercase">Ucapan Terima Kasih</p>
              <span className="text-rose-300 text-sm">✦</span>
            </div>
          </div>

          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            <div className="relative rounded-2xl bg-[#0d0d2b] p-6 overflow-hidden">

              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-4 left-4 text-rose-400/20 text-6xl font-serif pointer-events-none select-none">"</div>
              <div className="absolute bottom-4 right-4 text-rose-400/20 text-6xl font-serif pointer-events-none select-none">"</div>

              <div className="relative z-10 space-y-5">
                {/* Nama-nama */}
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { nama: "Ibu Nurti Istila Ratnasari, S.Pd", peran: "Rekan & Pendukung", foto: "/nurti-foto.jpeg" },
                    { nama: "Bapak Aldi Muhammad Lukman, S.Pd", peran: "Rekan & Pendukung", foto: "/aldi-foto.jpeg" },
                  ].map((orang) => (
                    <div
                      key={orang.nama}
                      className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-4 min-w-[140px]"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-rose-400/50 mb-2">
                        <img src={orang.foto} alt={orang.nama} className="w-full h-full object-cover object-top" />
                      </div>
                      <p className="text-white font-display text-sm font-bold text-center leading-tight">{orang.nama}</p>
                      <p className="text-rose-300/70 font-body text-[10px] mt-1 tracking-wide">{orang.peran}</p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />

                {/* Pesan */}
                <div className="space-y-3 text-center px-2">
                  <p className="text-white/90 font-body text-sm leading-relaxed text-justify">
                    Terima kasih yang tulus kepada <strong className="text-rose-300">Ibu Nurti Istila Ratnasari, S.Pd</strong> dan <strong className="text-rose-300">Bapak Aldi Muhammad Lukman, S.Pd</strong>, serta seluruh pihak yang <strong className="text-accent">tidak dapat disebutkan satu persatu</strong> — yang telah memberikan dukungan, semangat, dan kontribusi nyata dalam perjalanan pengembangan aplikasi <strong className="text-primary">NUMATIK</strong> ini.
                  </p>
                  <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                    "Setiap kebaikan yang kalian berikan, sekecil apapun, telah menjadi bagian dari fondasi yang menopang aplikasi ini. Terima kasih telah hadir dan peduli."
                  </p>
                </div>

                {/* Closing */}
                <div className="text-center pt-1">
                  <p className="text-rose-300/80 font-display text-xs font-bold tracking-widest">
                    ✦ &nbsp; TERIMA KASIH UNTUK SEMUA PIHAK YANG TELAH BERKONTRIBUSI &nbsp; ✦
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-white/40 font-body text-xs">
            Edisi Perdana · © 2026 NUMATIK. All rights reserved.
          </p>
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/menu"); }}
          className="mt-6 block mx-auto text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
        >
          ← Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default TentangAplikasiPage;
