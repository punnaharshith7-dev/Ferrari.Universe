import React, { useEffect, useRef } from 'react';
import { ChevronDown, Sparkles, Zap, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onEnterShowroom: () => void;
  onEnterAdviser: () => void;
}

export default function Hero({ onEnterShowroom, onEnterAdviser }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background atmospheric particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Red and golden embers drifting upward
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      decay: number;
    }> = [];

    const createParticle = () => {
      particles.push({
        x: Math.random() * width,
        y: height + 10,
        size: Math.random() * 2 + 1,
        speedY: -(Math.random() * 1.5 + 0.5),
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.5 + 0.2,
        decay: Math.random() * 0.002 + 0.001,
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial background sweep (atmospheric back-lighting)
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        width * 0.8
      );
      gradient.addColorStop(0, '#150505'); // subtle deep red center
      gradient.addColorStop(0.5, '#050202'); // very dark red
      gradient.addColorStop(1, '#000000'); // pure black
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Golden ratio grids (very subtle)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < width; i += 80) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
      }
      for (let j = 0; j < height; j += 80) {
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
      }
      ctx.stroke();

      // Drifting embers
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y < -10) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.fillStyle = `rgba(239, 68, 68, ${p.opacity})`; // Ferrari red ember
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle flare
        if (p.size > 2) {
          ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity * 0.3})`; // Golden accent
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (particles.length < 90 && Math.random() < 0.3) {
        createParticle();
      }

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="hero-section" className="relative w-full h-[94vh] flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

      {/* Cinematic Red Radial Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />

      {/* Hero Content Frame */}
      <div className="max-w-6xl mx-auto px-6 text-center z-10 flex flex-col items-center justify-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-red-500/30 text-xs font-mono tracking-widest text-red-500 uppercase mb-6 shadow-lg shadow-red-500/5"
        >
          <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          The Ultimate Ferrari Encyclopedia
        </motion.div>

        {/* Illuminated Ferrari Shield Accent */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
          className="mb-6 relative w-16 h-20 select-none cursor-pointer"
        >
          {/* Outer yellow halo */}
          <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse" />
          <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]" viewBox="0 0 100 130">
            {/* Classic Shield Path with bottom pointed crest */}
            <path
              d="M10,10 C10,10 50,22 50,22 C50,22 90,10 90,10 C90,10 95,50 90,82 C85,110 50,126 50,126 C50,126 15,110 10,82 C5,50 10,10 10,10 Z"
              fill="#FFEB00"
              stroke="#000000"
              strokeWidth="3"
            />
            
            {/* Italian Tricolore Band at the top curved portion */}
            <path
              d="M11.5,14.5 C11.5,14.5 50,25.8 50,25.8 C50,25.8 88.5,14.5 88.5,14.5 C88.5,14.5 88.5,23.5 88,27 C80,24 50,33 50,33 C50,33 20,24 12,27 C11.5,23.5 11.5,14.5 11.5,14.5 Z"
              fill="#FFFFFF"
            />
            <path
              d="M11.5,14.5 C11.5,14.5 37,22 37,22 C37,22 37,30 35,31 C26,28 12,27 12,27 C11.5,23.5 11.5,14.5 11.5,14.5 Z"
              fill="#10B981"
            />
            <path
              d="M88.5,14.5 C88.5,14.5 63,22 63,22 C63,22 63,30 65,31 C74,28 88,27 88,27 C88.5,23.5 88.5,14.5 88.5,14.5 Z"
              fill="#EF4444"
            />

            {/* Highly Detailed Reared-Back Prancing Horse */}
            <path
              d="M50,100 C47,90 43,85 39,80 C36,76 39,72 41,75 C43,77 47,81 49,76 C51,71 47,62 45,52 C43,44 48,38 55,44 C58,47 56,54 58,59 C60,64 64,59 66,55 C69,50 73,52 71,61 C69,68 66,75 68,82 C70,87 75,82 77,85 C75,92 67,97 64,106 C61,113 58,120 55,124 C54,124 51,105 50,100 Z"
              fill="#000000"
            />

            {/* The Classic "S" and "F" letters */}
            <text x="24" y="105" fill="#000000" fontSize="16" fontWeight="bold" fontFamily="Georgia, serif">S</text>
            <text x="64" y="105" fill="#000000" fontSize="16" fontWeight="bold" fontFamily="Georgia, serif">F</text>
          </svg>
        </motion.div>

        {/* Cinematic Headline */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.15em' }}
          animate={{ opacity: 1, letterSpacing: '0.05em' }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400 uppercase tracking-wide leading-none"
        >
          Ferrari Universe
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-neutral-400 text-sm md:text-lg max-w-2xl font-sans mt-4 leading-relaxed font-light"
        >
          Immerse yourself in Maranello\'s finest engineering. From classic masterpieces like the <span className="text-red-500 font-normal">250 GTO</span> and <span className="text-red-500 font-normal">F40</span> to the futuristic hybrid fury of the <span className="text-red-500 font-normal">F80</span>.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full justify-center"
        >
          <button
            id="showroom-nav-btn"
            onClick={onEnterShowroom}
            className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-lg border border-red-500/40 transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            Explore Showroom
          </button>
          
          <button
            id="ai-adviser-nav-btn"
            onClick={onEnterAdviser}
            className="w-full sm:w-auto px-8 py-4 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-widest font-bold rounded-lg border border-neutral-800 transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-red-500" />
            AI Concierge Adviser
          </button>
        </motion.div>
      </div>

      {/* Floating Speed specs for luxury feel */}
      <div className="absolute bottom-16 left-6 right-6 hidden md:flex items-center justify-between max-w-6xl mx-auto w-full z-10 px-4 font-mono text-neutral-400">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 0.7, x: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col text-left border-l-2 border-red-600 pl-4"
        >
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">TOP SPEED LIMIT</span>
          <span className="text-xl font-bold text-white">390 KM/H</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col text-center"
        >
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">PROPULSION ENGINEERING</span>
          <span className="text-xl font-bold text-white">V12, V8, V6 HYBRIDS</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 0.7, x: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col text-right border-r-2 border-red-600 pr-4"
        >
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">ACCELERATION RECORD</span>
          <span className="text-xl font-bold text-white">0-100 IN 1.8S (SF-24)</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-4 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 cursor-pointer text-xs font-mono tracking-widest text-neutral-500"
        onClick={onEnterShowroom}
      >
        <span>SCROLL DOWN</span>
        <ChevronDown className="w-4 h-4 text-red-500" />
      </motion.div>
    </section>
  );
}
