import { useEffect } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import kepalaSekolahImg from "@assets/image_1777175755334.png";

const BiografiPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-2xl w-full px-4 py-10 text-center">
        <User className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-6">
          BIOGRAFI PEMBUAT
        </h1>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-8 space-y-4 mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/biografi.png"
              alt="Irawan Sutiawan, M.Pd"
              className="w-32 h-40 sm:w-40 sm:h-48 object-cover rounded-xl border-2 border-primary/40 shadow-lg" />
          </div>

          <div className="space-y-3 text-left">
            <div>
              <p className="text-primary font-display text-xs mb-1">NAMA</p>
              <p className="text-white font-body text-sm">Irawan Sutiawan, M.Pd</p>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">INSTITUSI</p>
              <p className="text-white font-body text-sm">SMPN 28 Bandung</p>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">MATA PELAJARAN</p>
              <p className="text-white font-body text-sm">Matematika</p>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">Follow My Medsos :</p>
              <div className="space-y-2 mt-2">
                <p className="font-body text-sm text-white">Instagram : @irawansutiawan.one</p>
                <p className="font-body text-sm text-white">Youtube : @Pojok_Matematika</p>
                <p className="font-body text-sm text-white">Tiktok : Pojok_Matematika</p>
              </div>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">KRITIK &amp; SARAN</p>
              <p className="font-body text-sm text-accent">Email: numatik.app@gmail.com</p>
              <p className="text-white/60 font-body text-xs mt-1">Kirim kritik dan saran untuk pengembangan aplikasi ini ya.</p>
            </div>
          </div>
        </div>

        {/* ── Ucapan Terima Kasih ── */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 via-amber-400/10 to-yellow-500/10 border border-yellow-400/30 rounded-full px-5 py-1.5">
            <span className="text-yellow-300 text-sm">✦</span>
            <p className="text-yellow-300 font-display text-xs font-bold tracking-widest uppercase">Ucapan Terima Kasih</p>
            <span className="text-yellow-300 text-sm">✦</span>
          </div>
        </div>

        {/* Kepala Sekolah SMPN 28 Bandung */}
        <div className="animate-slide-up mb-6">
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-[0_0_40px_rgba(251,191,36,0.3)]">
            <div className="relative rounded-2xl bg-[#0d0d2b] p-6 overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-4 left-4 text-amber-400/20 text-6xl font-serif pointer-events-none select-none">"</div>
              <div className="absolute bottom-4 right-4 text-amber-400/20 text-6xl font-serif pointer-events-none select-none">"</div>

              <div className="flex flex-col items-center mb-5 relative z-10">
                <div className="relative mb-4 w-full max-w-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl opacity-30 blur-xl animate-pulse" />
                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-4 border-amber-400/60 shadow-[0_0_30px_rgba(251,191,36,0.45)]">
                    <img
                      src={kepalaSekolahImg}
                      alt="Dr. Hj. Yuli Nurhayati, S.Pd., M.Pd"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 rounded-full px-4 py-0.5 mb-2">
                  <p className="text-amber-300 font-body text-[10px] font-bold tracking-widest uppercase">Pemimpin · Motivator · Inspirator</p>
                </div>
                <h3 className="font-display text-xl font-black text-white text-center drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] leading-tight">
                  Dr. Hj. Yuli Nurhayati, S.Pd., M.Pd.
                </h3>
                <p className="text-amber-200/80 font-body text-xs mt-1 text-center font-semibold">Kepala SMP Negeri 28 Bandung</p>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mb-5" />

              <div className="relative z-10 space-y-3 text-center px-2">
                <p className="text-white/90 font-body text-sm leading-relaxed text-justify">
                  Dengan penuh hormat, terima kasih yang tak terhingga saya haturkan kepada <strong className="text-amber-300">Ibu Dr. Hj. Yuli Nurhayati, S.Pd., M.Pd.</strong> selaku <strong className="text-yellow-300">Kepala SMP Negeri 28 Bandung</strong> — yang telah memberikan <strong className="text-accent">motivasi</strong>, <strong className="text-accent">bimbingan</strong>, serta <strong className="text-accent">masukan-masukan berharga</strong> sehingga saya terus terdorong untuk berkarya hingga aplikasi <strong className="text-primary">NUMATIK</strong> ini tercipta.
                </p>
                <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                  "Semoga setiap langkah kebaikan dan dedikasi Ibu menjadi inspirasi serta menuai keberkahan yang melimpah."
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {["🌟 Pemimpin Visioner", "💛 Motivator Sejati", "📚 Pendidik Inspiratif", "🌹 Teladan"].map((item) => (
                    <span key={item} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60 font-body text-[11px]">{item}</span>
                  ))}
                </div>
                <div className="pt-3">
                  <p className="text-amber-300/80 font-display text-xs font-bold tracking-widest">✦ &nbsp; TERIMA KASIH, IBU KEPALA SMPN 28 BANDUNG &nbsp; ✦</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kelompok A2 */}
        <div className="animate-slide-up mb-6">
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400 shadow-[0_0_40px_rgba(251,146,60,0.3)]">
            <div className="relative rounded-2xl bg-[#0d0d2b] p-6 overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-4 left-4 text-orange-400/20 text-6xl font-serif pointer-events-none select-none">"</div>
              <div className="absolute bottom-4 right-4 text-orange-400/20 text-6xl font-serif pointer-events-none select-none">"</div>

              <div className="flex flex-col items-center mb-5 relative z-10">
                <div className="relative mb-4 w-full">
                  <div className="w-full rounded-xl overflow-hidden border-2 border-orange-400/50">
                    <img src="/kelompok-a2-foto.png" alt="Kelompok A2 Guru Penggerak Angkatan 10" className="w-full object-cover" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/40 rounded-full px-4 py-0.5 mb-2">
                  <p className="text-orange-300 font-body text-[10px] font-bold tracking-widest uppercase">Inspirasi Pertama · Guru Penggerak Angkatan 10</p>
                </div>
                <h3 className="font-display text-xl font-black text-white text-center drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]">Kelompok A2 Guru Penggerak</h3>
                <p className="text-white/50 font-body text-xs mt-0.5 text-center">Angkatan 10 · Kota Bandung</p>

                <div className="w-full mt-4 mb-2">
                  <p className="text-orange-300/70 font-display text-[10px] font-bold tracking-widest uppercase text-center mb-2">Fasilitator</p>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2.5 bg-orange-500/10 border border-orange-400/25 rounded-xl px-4 py-2">
                      <span className="text-orange-400 text-base shrink-0">⭐</span>
                      <span className="text-white/90 font-body text-xs font-bold">Ibu Dina Suciati, M.Pd</span>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-4 mb-2">
                  <p className="text-orange-300/70 font-display text-[10px] font-bold tracking-widest uppercase text-center mb-2">Pembimbing (Pengajar Praktik)</p>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2.5 bg-orange-500/10 border border-orange-400/25 rounded-xl px-4 py-2">
                      <span className="text-orange-400 text-base shrink-0">⭐</span>
                      <span className="text-white/90 font-body text-xs font-bold">Ibu Evi Kuswanty, S.Pd</span>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-3">
                  <p className="text-orange-300/70 font-display text-[10px] font-bold tracking-widest uppercase text-center mb-2">Anggota &amp; Rekan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {["Deni Nugraha, S.Pd","Cheri Indrayana, S.Pd","Nurhayanti Retnamasari, S.Pd","Erlita Fujiawati Akbari, S.Pd","Sri Aryati Handayani, S.Pd"].map((nama) => (
                      <div key={nama} className="flex items-center gap-2.5 bg-amber-500/8 border border-amber-400/20 rounded-xl px-3 py-2">
                        <span className="text-amber-400 text-base shrink-0">✦</span>
                        <span className="text-white/85 font-body text-xs leading-snug">{nama}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent mb-5" />

              <div className="relative z-10 space-y-3 text-center px-2">
                <p className="text-white/90 font-body text-sm leading-relaxed text-justify">
                  Terima kasih yang sebesar-besarnya kepada <strong className="text-orange-300">Kelompok A2 Guru Penggerak Angkatan 10</strong> — kelompok luar biasa yang menjadi <strong className="text-amber-300">inspirasi pertama</strong> lahirnya aplikasi NUMATIK.
                </p>
                <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                  "Dari satu kelompok kecil yang penuh semangat bergerak, lahirlah sebuah aplikasi yang berharap bisa menggerakkan ribuan pelajar."
                </p>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3/4 h-12 bg-orange-500/20 rounded-full blur-2xl" />
                  </div>
                  <p className="relative font-display text-xl md:text-2xl font-black text-center tracking-widest uppercase"
                    style={{ background: "linear-gradient(90deg, #fb923c, #fbbf24, #fef08a, #fbbf24, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 12px rgba(251,146,60,0.9)) drop-shadow(0 0 28px rgba(251,191,36,0.6))", letterSpacing: "0.12em" }}>
                    "Tergerak, Bergerak, dan Menggerakkan"
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {["🌱 Inspirasi Pertama", "🔥 Semangat Bergerak", "🤝 Kebersamaan", "🏆 Guru Penggerak"].map((item) => (
                    <span key={item} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60 font-body text-[11px]">{item}</span>
                  ))}
                </div>
                <div className="pt-3">
                  <p className="text-orange-300/80 font-display text-xs font-bold tracking-widest">✦ &nbsp; TERIMA KASIH, KELOMPOK A2 GURU PENGGERAK ANGKATAN 10 &nbsp; ✦</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bapak Wandri */}
        <div className="animate-slide-up mb-6">
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400 via-violet-500 to-amber-400 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            <div className="relative rounded-2xl bg-[#0d0d2b] p-6 overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-4 left-4 text-yellow-400/20 text-6xl font-serif pointer-events-none select-none">"</div>
              <div className="absolute bottom-4 right-4 text-yellow-400/20 text-6xl font-serif pointer-events-none select-none">"</div>

              <div className="flex flex-col items-center mb-5 relative z-10">
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-cyan-400/50">
                    <img src="/wandri-foto.png" alt="Bapak Wandri, S.Pd., Gr." className="w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/40 rounded-full px-4 py-0.5 mb-2">
                  <p className="text-cyan-300 font-body text-[10px] font-bold tracking-widest uppercase">Guru Inspiratif · Mentor IT</p>
                </div>
                <h3 className="font-display text-xl font-black text-white text-center drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">Bapak Wandri, S.Pd., Gr.</h3>
                <p className="text-white/50 font-body text-xs mt-0.5 text-center">SMP Santa Maria · Kota Bandung</p>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-400/40 to-transparent mb-5" />

              <div className="relative z-10 space-y-3 text-center px-2">
                <p className="text-white/90 font-body text-sm leading-relaxed text-justify">
                  Terima kasih yang sebesar-besarnya saya haturkan kepada <strong className="text-cyan-300">Bapak Wandri, S.Pd., Gr.</strong> — sosok rekan sekaligus guru yang dengan penuh dedikasi, kesabaran, dan keikhlasan telah membuka cakrawala pengetahuan di bidang <strong className="text-accent">Teknologi Informasi dan Komunikasi</strong>.
                </p>
                <p className="text-white/80 font-body text-sm leading-relaxed text-justify">
                  Ilmu, wawasan, dan semangat yang Bapak bagikan menjadi fondasi nyata lahirnya aplikasi <strong className="text-primary">NUMATIK</strong> ini.
                </p>
                <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                  "Guru sejati bukan hanya yang mengajarkan ilmu, melainkan yang menyalakan cahaya semangat di dalam diri muridnya."
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {["💡 Inspirasi", "🤝 Kolaborasi", "📚 Ilmu TIK", "🌟 Dedikasi"].map((item) => (
                    <span key={item} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60 font-body text-[11px]">{item}</span>
                  ))}
                </div>
                <div className="pt-3">
                  <p className="text-yellow-300/80 font-display text-xs font-bold tracking-widest">✦ &nbsp; TERIMA KASIH SEBESAR-BESARNYA, PAK WANDRI &nbsp; ✦</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tim MGMP */}
        <div className="animate-slide-up mb-6">
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <div className="relative rounded-2xl bg-[#0d0d2b] p-6 overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-4 left-4 text-emerald-400/20 text-6xl font-serif pointer-events-none select-none">"</div>
              <div className="absolute bottom-4 right-4 text-emerald-400/20 text-6xl font-serif pointer-events-none select-none">"</div>

              <div className="flex flex-col items-center mb-5 relative z-10">
                <div className="relative mb-4 w-full">
                  <div className="w-full rounded-xl overflow-hidden border-2 border-emerald-400/50">
                    <img src="/mgmp-foto.png" alt="Tim MGMP Matematika SMPN 28 Bandung" className="w-full object-cover" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 rounded-full px-4 py-0.5 mb-2">
                  <p className="text-emerald-300 font-body text-[10px] font-bold tracking-widest uppercase">Keluarga · Motivator · Kolaborator</p>
                </div>
                <h3 className="font-display text-xl font-black text-white text-center drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">Tim MGMP Matematika</h3>
                <p className="text-white/50 font-body text-xs mt-0.5 text-center">SMPN 28 Bandung · Kota Bandung</p>
                <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[{ nama: "Bapak Mohamad Kosasih, S.Pd" },{ nama: "Ibu Maya Rahmawati, S.Pd" },{ nama: "Ibu Dini Haerani, S.Pd" },{ nama: "Ibu Yulia Eka Rachmayunita, S.Pd" }].map((p) => (
                    <div key={p.nama} className="flex items-center gap-2.5 bg-emerald-500/8 border border-emerald-400/20 rounded-xl px-3 py-2">
                      <span className="text-emerald-400 text-base shrink-0">✦</span>
                      <span className="text-white/85 font-body text-xs leading-snug">{p.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent mb-5" />

              <div className="relative z-10 space-y-3 text-center px-2">
                <p className="text-white/90 font-body text-sm leading-relaxed text-justify">
                  Terima kasih yang sebesar-besarnya saya haturkan kepada <strong className="text-emerald-300">Tim MGMP Matematika SMPN 28 Bandung</strong> — rekan-rekan luar biasa yang telah memberikan begitu banyak <strong className="text-accent">motivasi, masukan, dan dukungan</strong>.
                </p>
                <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                  "Bersama kalian, setiap proses terasa lebih ringan, setiap pencapaian terasa lebih bermakna."
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {["💚 Motivasi", "🤝 Kebersamaan", "📐 Konten Materi", "🎨 Masukan Desain"].map((item) => (
                    <span key={item} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60 font-body text-[11px]">{item}</span>
                  ))}
                </div>
                <div className="pt-3">
                  <p className="text-emerald-300/80 font-display text-xs font-bold tracking-widest">✦ &nbsp; TERIMA KASIH, TIM MGMP MATEMATIKA SMPN 28 BANDUNG &nbsp; ✦</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rekan Individu */}
        <div className="animate-slide-up mb-8">
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            <div className="relative rounded-2xl bg-[#0d0d2b] p-6 overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-4 left-4 text-rose-400/20 text-6xl font-serif pointer-events-none select-none">"</div>
              <div className="absolute bottom-4 right-4 text-rose-400/20 text-6xl font-serif pointer-events-none select-none">"</div>

              <div className="relative z-10 space-y-5">
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { nama: "Ibu Nurti Istila Ratnasari, S.Pd", peran: "Rekan & Pendukung", foto: "/nurti-foto.jpeg" },
                    { nama: "Bapak Aldi Muhammad Lukman, S.Pd", peran: "Rekan & Pendukung", foto: "/aldi-foto.jpeg" },
                  ].map((orang) => (
                    <div key={orang.nama} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-4 min-w-[140px]">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-rose-400/50 mb-2">
                        <img src={orang.foto} alt={orang.nama} className="w-full h-full object-cover object-top" />
                      </div>
                      <p className="text-white font-display text-sm font-bold text-center leading-tight">{orang.nama}</p>
                      <p className="text-rose-300/70 font-body text-[10px] mt-1 tracking-wide">{orang.peran}</p>
                    </div>
                  ))}
                </div>

                <div className="h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />

                <div className="space-y-3 text-center px-2">
                  <p className="text-white/90 font-body text-sm leading-relaxed text-justify">
                    Terima kasih yang tulus kepada <strong className="text-rose-300">Ibu Nurti Istila Ratnasari, S.Pd</strong> dan <strong className="text-rose-300">Bapak Aldi Muhammad Lukman, S.Pd</strong>, serta seluruh pihak yang tidak dapat disebutkan satu persatu — yang telah memberikan dukungan dan kontribusi nyata dalam perjalanan pengembangan aplikasi <strong className="text-primary">NUMATIK</strong> ini.
                  </p>
                  <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                    "Setiap kebaikan yang kalian berikan, sekecil apapun, telah menjadi bagian dari fondasi yang menopang aplikasi ini."
                  </p>
                </div>

                <div className="text-center pt-1">
                  <p className="text-rose-300/80 font-display text-xs font-bold tracking-widest">
                    ✦ &nbsp; TERIMA KASIH UNTUK SEMUA PIHAK YANG TELAH BERKONTRIBUSI &nbsp; ✦
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/menu"); }}
          className="mt-2 mb-8 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
          ← Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default BiografiPage;
