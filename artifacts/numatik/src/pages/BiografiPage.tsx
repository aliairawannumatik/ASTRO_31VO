import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const BiografiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isWhite = theme === "white";
  const [pesan, setPesan] = useState("");

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
          {t("biografi.pageTitle")}
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
              <p className="text-primary font-display text-xs mb-1">{t("biografi.labelNama")}</p>
              <p className="text-white font-body text-sm">Irawan Sutiawan, M.Pd</p>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">{t("biografi.labelNegara")}</p>
              <p className="text-white font-body text-sm">Indonesia</p>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">{t("biografi.labelWebsite")}</p>
              <a
                href="https://www.numatik.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 font-body text-sm underline underline-offset-2 hover:text-cyan-200 transition-colors"
              >
                www.numatik.app
              </a>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">{t("biografi.labelSosmed")}</p>
              <div className="space-y-2 mt-2">
                <p className="font-body text-sm text-white">Instagram : @irawansutiawan.one</p>
                <p className="font-body text-sm text-white">Instagram : @numatik_official</p>
                <p className="font-body text-sm text-white">Youtube : @numatik_official</p>
                <p className="font-body text-sm text-white">Tiktok : Pojok_Matematika</p>
              </div>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-2">{t("biografi.labelPesan")}</p>
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-4 space-y-2">
                <p className="text-cyan-300 font-display text-xs font-bold tracking-widest uppercase mb-2">
                  {t("biografi.pesanSubtitle")}
                </p>
                <p className="text-white/85 font-body text-sm leading-relaxed text-justify italic">
                  {t("biografi.pesanIsi")}
                </p>
                <p className="text-cyan-400/70 font-display text-xs font-bold text-right">— Irawan Sutiawan, M.Pd</p>
              </div>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-2">{t("biografi.labelKritikSaran")}</p>
              <div className="space-y-2">
                <textarea
                  className="w-full bg-white/5 border border-border rounded-lg p-3 text-white/90 font-body text-sm resize-none focus:outline-none focus:border-primary/60 placeholder:text-white/30"
                  rows={4}
                  placeholder={t("biografi.kritikPlaceholder")}
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (!pesan.trim()) return;
                    window.open(`mailto:numatik.app@gmail.com?subject=Kritik%20%26%20Saran%20NUMATIK&body=${encodeURIComponent(pesan)}`, '_blank');
                  }}
                  disabled={!pesan.trim()}
                  className="w-full py-2 rounded-lg bg-primary/80 hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed text-white font-display text-sm font-bold transition-colors"
                >
                  {t("biografi.kirimEmail")}
                </button>
                <p className="text-white/40 font-body text-[11px] text-center">{t("biografi.kirimKe")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Ucapan Terima Kasih ── */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 via-amber-400/10 to-yellow-500/10 border border-yellow-400/30 rounded-full px-5 py-1.5">
            <span className="text-yellow-300 text-sm">✦</span>
            <p className="text-yellow-300 font-display text-xs font-bold tracking-widest uppercase">
              {t("biografi.ucapanTerimakasih")}
            </p>
            <span className="text-yellow-300 text-sm">✦</span>
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
                  <p className="text-orange-300 font-body text-[10px] font-bold tracking-widest uppercase">
                    {t("biografi.kelompokA2.badge")}
                  </p>
                </div>
                <h3 className="font-display text-xl font-black text-white text-center drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]">Kelompok A2 Guru Penggerak</h3>
                <p className="text-white/50 font-body text-xs mt-0.5 text-center">Angkatan 10 · Kota Bandung</p>

                <div className="w-full mt-4 mb-2">
                  <p className="text-orange-300/70 font-display text-[10px] font-bold tracking-widest uppercase text-center mb-2">
                    {t("biografi.kelompokA2.fasilitator")}
                  </p>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2.5 bg-orange-500/10 border border-orange-400/25 rounded-xl px-4 py-2">
                      <span className="text-orange-400 text-base shrink-0">⭐</span>
                      <span className="text-white/90 font-body text-xs font-bold">Ibu Dina Suciati, M.Pd</span>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-4 mb-2">
                  <p className="text-orange-300/70 font-display text-[10px] font-bold tracking-widest uppercase text-center mb-2">
                    {t("biografi.kelompokA2.pembimbing")}
                  </p>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2.5 bg-orange-500/10 border border-orange-400/25 rounded-xl px-4 py-2">
                      <span className="text-orange-400 text-base shrink-0">⭐</span>
                      <span className="text-white/90 font-body text-xs font-bold">Ibu Evi Kuswanty, S.Pd</span>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-3">
                  <p className="text-orange-300/70 font-display text-[10px] font-bold tracking-widest uppercase text-center mb-2">
                    {t("biografi.kelompokA2.anggota")}
                  </p>
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
                  <Trans
                    i18nKey="biografi.kelompokA2.paragraf1"
                    components={{
                      orange: <strong className="text-orange-300" />,
                      amber: <strong className="text-amber-300" />,
                    }}
                  />
                </p>
                <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                  {t("biografi.kelompokA2.kutipan")}
                </p>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3/4 h-12 bg-orange-500/20 rounded-full blur-2xl" />
                  </div>
                  <p className="relative font-display text-xl md:text-2xl font-black text-center tracking-widest uppercase"
                    style={isWhite ? {
                      color: "#0a4f8a",
                      letterSpacing: "0.12em",
                    } : {
                      background: "linear-gradient(90deg, #fb923c, #fbbf24, #fef08a, #fbbf24, #fb923c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 12px rgba(251,146,60,0.9)) drop-shadow(0 0 28px rgba(251,191,36,0.6))",
                      letterSpacing: "0.12em",
                    }}>
                    {t("biografi.kelompokA2.motto")}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {(["tag1", "tag2", "tag3", "tag4"] as const).map((key) => (
                    <span key={key} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60 font-body text-[11px]">
                      {t(`biografi.kelompokA2.${key}`)}
                    </span>
                  ))}
                </div>
                <div className="pt-3">
                  <p className="text-orange-300/80 font-display text-xs font-bold tracking-widest">
                    ✦ &nbsp; {t("biografi.kelompokA2.footer")} &nbsp; ✦
                  </p>
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
                  <div className="w-full rounded-xl overflow-hidden border-2 border-cyan-400/50">
                    <img src="/wandri-1778563724307.png" alt="Bapak Wandri, S.Pd., Gr." className="w-full object-cover" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/40 rounded-full px-4 py-0.5 mb-2">
                  <p className="text-cyan-300 font-body text-[10px] font-bold tracking-widest uppercase">
                    {t("biografi.wandri.badge")}
                  </p>
                </div>
                <h3 className="font-display text-xl font-black text-white text-center drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">Bapak Wandri, S.Pd., Gr.</h3>
                <p className="text-white/50 font-body text-xs mt-0.5 text-center">SMP Santa Maria · Kota Bandung</p>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-400/40 to-transparent mb-5" />

              <div className="relative z-10 space-y-3 text-center px-2">
                <p className="text-white/90 font-body text-sm leading-relaxed text-justify">
                  <Trans
                    i18nKey="biografi.wandri.paragraf1"
                    components={{
                      cyan: <strong className="text-cyan-300" />,
                      accent: <strong className="text-accent" />,
                    }}
                  />
                </p>
                <p className="text-white/80 font-body text-sm leading-relaxed text-justify">
                  <Trans
                    i18nKey="biografi.wandri.paragraf2"
                    components={{
                      cyan: <strong className="text-cyan-300" />,
                      accent: <strong className="text-accent" />,
                    }}
                  />
                </p>
                <p className="text-white/80 font-body text-sm leading-relaxed text-justify">
                  <Trans
                    i18nKey="biografi.wandri.paragraf3"
                    components={{
                      primary: <strong className="text-primary" />,
                    }}
                  />
                </p>
                <p className="text-white/70 font-body text-sm leading-relaxed text-justify italic">
                  {t("biografi.wandri.kutipan")}
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {(["tag1", "tag2", "tag3", "tag4"] as const).map((key) => (
                    <span key={key} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60 font-body text-[11px]">
                      {t(`biografi.wandri.${key}`)}
                    </span>
                  ))}
                </div>
                <div className="pt-3">
                  <p className="text-yellow-300/80 font-display text-xs font-bold tracking-widest">
                    ✦ &nbsp; {t("biografi.wandri.footer")} &nbsp; ✦
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/menu"); }}
          className="mt-2 mb-8 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
          {t("biografi.kembali")}
        </button>
      </div>
    </div>
  );
};

export default BiografiPage;
