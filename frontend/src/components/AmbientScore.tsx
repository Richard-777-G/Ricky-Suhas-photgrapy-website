import { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play } from 'lucide-react';

/* Procedural percussion / handpan score generated with the Web Audio API.
   Each collection category gets its own scale + tempo, so every collection
   carries a distinct ambient signature with zero audio assets to download. */

type ScoreProfile = {
  label: string;
  scale: number[]; // frequencies (Hz) — handpan-style tuning
  tempoMs: number;
  filterHz: number;
};

const PROFILES: Record<string, ScoreProfile> = {
  Landscape: {
    label: 'Cloud Forest · D Celtic Minor',
    scale: [146.83, 220.0, 246.94, 293.66, 329.63, 392.0, 440.0],
    tempoMs: 1650,
    filterHz: 1500,
  },
  Ocean: {
    label: 'Tidal Cadence · A Kurd',
    scale: [110.0, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63],
    tempoMs: 1350,
    filterHz: 1150,
  },
  Aerial: {
    label: 'High Altitude · F Pygmy',
    scale: [174.61, 261.63, 311.13, 349.23, 392.0, 466.16, 523.25],
    tempoMs: 1900,
    filterHz: 1750,
  },
  Travel: {
    label: 'Cold Desert · E Amara',
    scale: [164.81, 246.94, 261.63, 329.63, 369.99, 415.3, 493.88],
    tempoMs: 1500,
    filterHz: 1350,
  },
  Wildlife: {
    label: 'Grassland Pulse · G Hijaz',
    scale: [196.0, 233.08, 261.63, 293.66, 349.23, 392.0, 466.16],
    tempoMs: 1200,
    filterHz: 1250,
  },
};

function profileFor(category?: string): ScoreProfile {
  return (category && PROFILES[category]) || PROFILES.Landscape;
}

export default function AmbientScore({
  category,
  collectionTitle,
}: {
  category?: string;
  collectionTitle?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const profile = profileFor(category);

  const stop = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
      window.setTimeout(() => {
        ctxRef.current?.close();
        ctxRef.current = null;
        masterRef.current = null;
      }, 800);
    }
    setPlaying(false);
  };

  const start = () => {
    try {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtor();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 2.2);

      // Long convolution-free "room": lowpass + gentle delay feedback
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = profile.filterHz;

      const delay = ctx.createDelay(1.2);
      delay.delayTime.value = 0.42;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.34;

      lowpass.connect(master);
      lowpass.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(master);
      master.connect(ctx.destination);
      masterRef.current = master;

      // Struck metal tone: sine partials with fast attack, long decay
      const strike = (freq: number, when: number, velocity: number) => {
        [1, 2.02, 3.01].forEach((ratio, i) => {
          const osc = ctx.createOscillator();
          const env = ctx.createGain();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.value = freq * ratio;

          const peak = velocity * (i === 0 ? 0.5 : 0.13 / i);
          env.gain.setValueAtTime(0.0001, when);
          env.gain.exponentialRampToValueAtTime(peak, when + 0.012);
          env.gain.exponentialRampToValueAtTime(0.0001, when + 2.6 + i * 0.4);

          osc.connect(env);
          env.connect(lowpass);
          osc.start(when);
          osc.stop(when + 3.4);
        });
      };

      const play = () => {
        const c = ctxRef.current;
        if (!c) return;
        const now = c.currentTime + 0.05;
        const notes = profile.scale;
        // sparse, slow phrase — "slow is smooth"
        const count = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          const note = notes[Math.floor(Math.random() * notes.length)];
          strike(note, now + i * 0.34, 0.5 + Math.random() * 0.35);
        }
        if (Math.random() > 0.65) {
          strike(notes[0] / 2, now + 0.1, 0.5); // root bass swell
        }
      };

      play();
      timerRef.current = window.setInterval(play, profile.tempoMs);
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      ctxRef.current?.close();
    };
  }, []);

  return (
    <button
      onClick={() => (playing ? stop() : start())}
      data-testid="ambient-score-toggle"
      title={`Ambient percussion score for ${collectionTitle || 'this collection'}`}
      className={`group inline-flex items-center gap-3 pl-3 pr-4 py-2 rounded-full border transition-all duration-500 ${
        playing
          ? 'border-[#D4AF37] bg-[#D4AF37]/12 text-[#D4AF37]'
          : 'border-border/60 bg-background/60 text-muted-foreground hover:border-[#D4AF37]/60 hover:text-foreground'
      }`}
    >
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-500 ${
          playing ? 'bg-[#D4AF37] text-black' : 'bg-border/40 text-foreground group-hover:bg-[#D4AF37]/25'
        }`}
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </span>

      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
          {playing ? 'Score Playing' : 'Play Ambient Score'}
        </span>
        <span className="text-[10px] font-mono opacity-70">{profile.label}</span>
      </span>

      {/* live rhythm meter */}
      <span className="flex items-end gap-[3px] h-4 ml-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full transition-all duration-300 ${
              playing ? 'bg-[#D4AF37] animate-score-bar' : 'bg-current opacity-30 h-1.5'
            }`}
            style={playing ? { animationDelay: `${i * 0.18}s` } : undefined}
          />
        ))}
      </span>

      <Music className="w-3.5 h-3.5 opacity-60" />
    </button>
  );
}
