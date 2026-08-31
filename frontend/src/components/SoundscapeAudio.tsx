import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function SoundscapeAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleSound = () => {
    if (!isPlaying) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Create pink/brown noise for gentle ambient wind & mountain breeze
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.012; // Very gentle master level
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Low-pass filter to sound like mountain forest wind
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 320;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);
        gainNodeRef.current = gainNode;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start(0);
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        setTimeout(() => {
          audioCtxRef.current?.close();
          setIsPlaying(false);
        }, 500);
      } else {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      data-testid="ambient-soundscape-toggle"
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-full border border-[#D4AF37]/30 bg-[#0C0E12]/80 dark:bg-[#0C0E12]/80 bg-white/80 backdrop-blur-md text-[#D4AF37] hover:border-[#D4AF37] transition-all"
      title="Toggle wilderness acoustic ambience"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span className="hidden sm:inline">NATURE SOUNDSCAPE ON</span>
          <span className="flex gap-0.5 items-center">
            <span className="w-1 h-3 bg-[#D4AF37] animate-pulse rounded-full" />
            <span className="w-1 h-2 bg-[#D4AF37] animate-pulse delay-75 rounded-full" />
            <span className="w-1 h-3.5 bg-[#D4AF37] animate-pulse delay-150 rounded-full" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 opacity-70" />
          <span className="hidden sm:inline text-muted-foreground">AMBIENCE</span>
        </>
      )}
    </button>
  );
}
