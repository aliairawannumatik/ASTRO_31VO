import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { startMusic, stopMusic, TRACKS, setMusicVolume } from "@/hooks/bgMusicTracks";
import { MP3_TRACKS } from "@/hooks/mp3Tracks";

interface MusicContextType {
  musicOn: boolean;
  toggleMusic: () => void;
  trackId: string;
  setTrackId: (id: string) => void;
  musicVolume: number;
  setMusicVolume: (v: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const ALL_IDS = [...TRACKS.map(t => t.id), ...MP3_TRACKS.map(t => t.id)];
const DEFAULT_TRACK = "mp3-dreams";

const isMp3Id = (id: string) => id.startsWith("mp3-");

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [musicOn, setMusicOn] = useState<boolean>(() => {
    const saved = localStorage.getItem("numatik-music");
    return saved === null ? false : saved === "true";
  });

  const [trackId, setTrackIdState] = useState<string>(() => {
    const saved = localStorage.getItem("numatik-music-track");
    return saved && ALL_IDS.includes(saved) ? saved : DEFAULT_TRACK;
  });

  const [musicVolumeState, setMusicVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem("numatik-music-volume");
    return saved !== null ? Number(saved) : 60;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFirstMount = useRef(true);

  // ── Helpers ──────────────────────────────────────────────────
  const stopMp3 = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
  };

  const playMp3 = (id: string, vol?: number) => {
    const track = MP3_TRACKS.find(t => t.id === id);
    if (!track) return;
    stopMp3();
    stopMusic(); // ensure synth is silent
    const audio = new Audio(track.url);
    audio.loop = true;
    audio.volume = (vol ?? musicVolumeState) / 100;
    audio.play().catch(() => {});
    audioRef.current = audio;
  };

  const stopAll = () => {
    stopMusic();
    stopMp3();
  };

  const startTrack = (id: string) => {
    if (isMp3Id(id)) {
      playMp3(id);
    } else {
      stopMp3();
      startMusic(id);
    }
  };

  // ── React to music on/off ────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("numatik-music", String(musicOn));
    if (musicOn) {
      startTrack(trackId);
    } else {
      stopAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicOn]);

  // ── React to track changes ───────────────────────────────────
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    localStorage.setItem("numatik-music-track", trackId);
    if (musicOn) {
      startTrack(trackId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  // ── React to volume changes ──────────────────────────────────
  useEffect(() => {
    localStorage.setItem("numatik-music-volume", String(musicVolumeState));
    const v = musicVolumeState / 100;
    setMusicVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, [musicVolumeState]);

  // ── Cleanup on unmount ───────────────────────────────────────
  useEffect(() => {
    return () => {
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMusic = () => setMusicOn(prev => !prev);

  const setTrackId = (id: string) => {
    if (ALL_IDS.includes(id)) {
      setTrackIdState(id);
    }
  };

  const handleSetMusicVolume = (v: number) => setMusicVolumeState(Math.max(0, Math.min(100, v)));

  return (
    <MusicContext.Provider value={{ musicOn, toggleMusic, trackId, setTrackId, musicVolume: musicVolumeState, setMusicVolume: handleSetMusicVolume }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
};
