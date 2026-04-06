import { useRef, useCallback } from "react";
import { playSfxById, getCurrentSfxId } from "@/hooks/soundEffects";

let audioCtx: AudioContext | null = null;
const getAudioCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

let _soundEnabled = true;
export const setSoundEnabled = (val: boolean) => { _soundEnabled = val; };

// Button click sound — plays whichever effect the user has selected
export const playPopSound = () => {
  if (!_soundEnabled) return;
  playSfxById(getCurrentSfxId());
};

export const useAudio = () => {
  const bgMusicRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; osc3: OscillatorNode; gain: GainNode; lfo: OscillatorNode } | null>(null);
  const engineRef = useRef<{ osc: OscillatorNode; noise: AudioBufferSourceNode; gain: GainNode } | null>(null);

  // Realistic laser sound - pew pew style
  const playLaser = useCallback(() => {
    if (!_soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      
      // Main laser tone - high to low sweep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(1200, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      // Secondary harmonic
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "square";
      osc2.frequency.setValueAtTime(2400, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);
      gain2.gain.setValueAtTime(0.05, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      // Add some noise for texture
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.value = 3000;
      
      osc1.connect(gain1);
      osc2.connect(gain2);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);
      noiseGain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      noiseSource.start();
      osc1.stop(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.12);
    } catch {}
  }, []);

  // Realistic explosion sound - deep rumble with crackle
  const playExplosion = useCallback(() => {
    if (!_soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      
      // Main explosion - white noise with envelope
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp(-i / (ctx.sampleRate * 0.15));
        data[i] = (Math.random() * 2 - 1) * decay;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      
      // Low pass filter for rumble
      const lowFilter = ctx.createBiquadFilter();
      lowFilter.type = "lowpass";
      lowFilter.frequency.setValueAtTime(800, ctx.currentTime);
      lowFilter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
      lowFilter.Q.value = 2;
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      // Deep bass thump
      const bassOsc = ctx.createOscillator();
      bassOsc.type = "sine";
      bassOsc.frequency.setValueAtTime(80, ctx.currentTime);
      bassOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);
      const bassGain = ctx.createGain();
      bassGain.gain.setValueAtTime(0.35, ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      // Crackle - high frequency burst
      const crackleBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const crackleData = crackleBuffer.getChannelData(0);
      for (let i = 0; i < crackleData.length; i++) {
        crackleData[i] = Math.random() > 0.97 ? (Math.random() * 2 - 1) : 0;
      }
      const crackleSource = ctx.createBufferSource();
      crackleSource.buffer = crackleBuffer;
      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.15, ctx.currentTime);
      crackleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      noiseSource.connect(lowFilter);
      lowFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      crackleSource.connect(crackleGain);
      crackleGain.connect(ctx.destination);
      
      noiseSource.start();
      bassOsc.start();
      crackleSource.start();
      bassOsc.stop(ctx.currentTime + 0.35);
    } catch {}
  }, []);
  
  // Engine sound - continuous low rumble
  const startEngineSound = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      if (engineRef.current) return;
      
      // Low frequency oscillator for engine hum
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 55;
      
      // Noise for engine texture
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.5;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      
      // LFO for wobble effect
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      // Filter for noise
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 200;
      filter.Q.value = 3;
      
      // Master gain
      const gain = ctx.createGain();
      gain.gain.value = 0.08;
      
      osc.connect(gain);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      noise.start();
      lfo.start();
      
      engineRef.current = { osc, noise, gain };
    } catch {}
  }, []);
  
  const stopEngineSound = useCallback(() => {
    if (engineRef.current) {
      try {
        engineRef.current.osc.stop();
        engineRef.current.noise.stop();
        engineRef.current.gain.disconnect();
      } catch {}
      engineRef.current = null;
    }
  }, []);

  const playCorrect = useCallback(() => {
    if (!_soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }, []);

  const startBgMusic = useCallback(() => {
    // Background music disabled
  }, []);

  const stopBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      try {
        bgMusicRef.current.osc1.stop();
        bgMusicRef.current.osc2.stop();
        bgMusicRef.current.osc3.stop();
        bgMusicRef.current.lfo.stop();
        bgMusicRef.current.gain.disconnect();
      } catch {}
      bgMusicRef.current = null;
    }
  }, []);

  return { playLaser, playExplosion, playCorrect, startBgMusic, stopBgMusic, startEngineSound, stopEngineSound };
};

// Global background music disabled
export const startGlobalAmbient = () => {};
export const stopGlobalAmbient = () => {};
