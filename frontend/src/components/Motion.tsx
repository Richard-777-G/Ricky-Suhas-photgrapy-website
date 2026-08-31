import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'motion/react';

/* ------------------------------------------------------------------ *
 * Reveal — scroll-triggered depth entrance.
 * Motion communicates DISCOVERY: content rises from a lower depth plane.
 * ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 34,
  className = '',
  testId,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  testId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      data-testid={testId}
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y, filter: 'blur(10px)' }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : reduce
          ? { opacity: 1 }
          : { opacity: 0, y, filter: 'blur(10px)' }
      }
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * AnimatedHeading — word-by-word cinematic type emergence.
 * Motion communicates HIERARCHY: the title assembles itself.
 * ------------------------------------------------------------------ */
export function AnimatedHeading({
  text,
  className = '',
  accentFrom,
  delay = 0,
  testId,
}: {
  text: string;
  className?: string;
  /** index of the first word rendered in the champagne accent tone */
  accentFrom?: number;
  delay?: number;
  testId?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const words = text.split(' ');

  return (
    <h2 ref={ref} data-testid={testId} className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={`inline-block ${
            accentFrom !== undefined && i >= accentFrom ? 'text-[#D4AF37] italic' : ''
          }`}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: '0.5em', rotateX: -55 }}
          animate={
            inView || reduce
              ? { opacity: 1, y: 0, rotateX: 0 }
              : { opacity: 0, y: '0.5em', rotateX: -55 }
          }
          transition={{
            duration: 0.95,
            delay: delay + i * 0.075,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformOrigin: 'bottom' }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </h2>
  );
}

/* ------------------------------------------------------------------ *
 * Magnetic — cursor-attracted control.
 * Motion communicates CONNECTION between pointer and target.
 * ------------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = 0.28,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * strength, y: relY * strength });
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 160, damping: 16, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * TiltCard — perspective depth on hover.
 * Motion communicates DEPTH: the photograph sits in real space.
 * ------------------------------------------------------------------ */
export function TiltCard({
  children,
  className = '',
  max = 7,
  onClick,
  testId,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  onClick?: () => void;
  testId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, on: false });
  const reduce = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ rx: (0.5 - py) * max * 2, ry: (px - 0.5) * max * 2 });
    setShine({ x: px * 100, y: py * 100, on: true });
  };

  return (
    <motion.div
      ref={ref}
      data-testid={testId}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        setTilt({ rx: 0, ry: 0 });
        setShine((s) => ({ ...s, on: false }));
      }}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
      animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
      transition={{ type: 'spring', stiffness: 130, damping: 18, mass: 0.6 }}
    >
      {children}
      {/* Cursor-tracked specular sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: shine.on ? 1 : 0,
          background: `radial-gradient(420px circle at ${shine.x}% ${shine.y}%, rgba(212,175,55,0.16), transparent 62%)`,
        }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * ParallaxLayer — depth-plane scrolling.
 * Motion communicates DEPTH: layers travel at different rates.
 * ------------------------------------------------------------------ */
export function ParallaxLayer({
  children,
  distance = 120,
  className = '',
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * useLockBodyScroll — prevents scroll-jank/stutter behind media viewers.
 * ------------------------------------------------------------------ */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [active]);
}

/* ------------------------------------------------------------------ *
 * ScrollProgressRail — thin champagne progress line, top of viewport.
 * ------------------------------------------------------------------ */
export function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      data-testid="scroll-progress-rail"
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-[#997A15] via-[#D4AF37] to-[#F3E5AB]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
