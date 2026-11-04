import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Flame, Zap, Play, Square, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EngineSoundProps {
  modelName: string;
  idleFreq: number;
  maxFreq: number;
  hasExhaustFlame: boolean;
}

export default function EngineSound({ modelName, idleFreq, maxFreq, hasExhaustFlame }: EngineSoundProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rpm, setRpm] = useState(1000); // 1000 to 9000 RPM
  const [isRevving, setIsRevving] = useState(false);
  const [showFlame, setShowFlame] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activePreset, setActivePreset] = useState<'car' | 'v8' | 'v12' | 'v10'>('car');

  // Audio nodes refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const subRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const rpmInterval = useRef<any>(null);
  const targetRpm = useRef(1000);
  const currentRpm = useRef(1000);
  const wasRevvingRef = useRef(false);

  // Visualizer animation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualizerAnimRef = useRef<number | null>(null);

  // Initialize and draw static grid on canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Horizontal middle line
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    }
  }, []);

  // Backfire Pops Generator
  const playPopSound = () => {
    if (!audioCtxRef.current || isMuted) return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      
      // Create a short noise buffer for high-pressure exhaust crackles
      const bufferSize = ctx.sampleRate * 0.04; // 40ms crackle duration
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const popFilter = ctx.createBiquadFilter();
      popFilter.type = 'bandpass';
      popFilter.frequency.value = 110 + Math.random() * 150; // Deep rumble exhaust resonance
      popFilter.Q.value = 3.5;
      
      const popGain = ctx.createGain();
      popGain.gain.setValueAtTime(0.16 * (0.5 + Math.random() * 0.5), now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      
      noise.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(masterGainRef.current || ctx.destination);
      
      noise.start(now);
    } catch (e) {
      console.warn('Pop synthesis failed: ', e);
    }
  };

  const triggerBackfirePops = (activeHasFlame: boolean) => {
    const numPops = Math.floor(Math.random() * 3) + 2; // 2 to 4 pops
    for (let i = 0; i < numPops; i++) {
      setTimeout(() => {
        if (currentRpm.current > 1200) { // only trigger if engine is still spinning
          playPopSound();
          if (activeHasFlame && Math.random() > 0.35) {
            setShowFlame(true);
            setTimeout(() => setShowFlame(false), 90);
          }
        }
      }, 60 + i * (110 + Math.random() * 100));
    }
  };

  // Real-time Waveform Canvas Loop
  const startVisualizerLoop = () => {
    if (visualizerAnimRef.current) {
      cancelAnimationFrame(visualizerAnimRef.current);
    }

    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      visualizerAnimRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      // Clean background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Technical Grid background
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Oscilloscope line configuration
      ctx.lineWidth = 2.0;
      
      // Determine glowing color based on engine status and RPM
      const ratio = (currentRpm.current - 1000) / 8000;
      let glowColor = 'rgba(220, 38, 38, 0.85)'; // default hot crimson
      if (ratio > 0.8) {
        glowColor = 'rgba(239, 68, 68, 1)'; // screaming bright red
      } else if (ratio > 0.4) {
        glowColor = 'rgba(249, 115, 22, 1)'; // aggressive orange
      }

      ctx.strokeStyle = glowColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = glowColor;

      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // 0.0 to 2.0
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      
      // Reset canvas state
      ctx.shadowBlur = 0;
    };

    visualizerAnimRef.current = requestAnimationFrame(draw);
  };

  // Startup Sound Trigger
  const triggerStartupAudio = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create a master gain node if not exists
      if (!masterGainRef.current) {
        masterGainRef.current = ctx.createGain();
        masterGainRef.current.connect(ctx.destination);
      }
      masterGainRef.current.gain.value = isMuted ? 0 : 0.45;

      // Create engine nodes
      createEngineNodes(ctx);

      // Play startup rev sequence:
      // Crank (chug chug), then Roar to 6500 RPM, then settle down to idle at 1000 RPM
      setIsPlaying(true);
      targetRpm.current = 6500;
      currentRpm.current = 600; // Low cranking rpm

      const activeHasFlame = activePreset === 'car' ? hasExhaustFlame : true;

      let start = Date.now();
      const runStartup = () => {
        let elapsed = Date.now() - start;
        if (elapsed < 300) {
          // Cranking
          currentRpm.current = 500 + Math.random() * 200;
        } else if (elapsed < 1000) {
          // Roaring startup
          currentRpm.current += (6500 - currentRpm.current) * 0.22;
          if (activeHasFlame && Math.random() > 0.4) {
            setShowFlame(true);
          }
        } else if (elapsed < 2000) {
          // Settle to idle
          currentRpm.current += (1000 - currentRpm.current) * 0.12;
          setShowFlame(false);
        } else {
          // Normal idle
          currentRpm.current = 1000;
          targetRpm.current = 1000;
          return;
        }
        setRpm(Math.round(currentRpm.current));
        updateSynthFrequencies(currentRpm.current);
        requestAnimationFrame(runStartup);
      };
      requestAnimationFrame(runStartup);

    } catch (e) {
      console.error('Audio initialization failed: ', e);
    }
  };

  const createEngineNodes = (ctx: AudioContext) => {
    // Cleanup first
    stopEngineNodes();

    let osc1Type: OscillatorType = 'sawtooth';
    let osc2Type: OscillatorType = 'triangle';
    let filterQ = 2.5;

    // Apply different acoustic parameters based on active exhaust note profile
    if (activePreset === 'v10') {
      osc1Type = 'sawtooth';
      osc2Type = 'sawtooth';
      filterQ = 4.2; // High resonance metallic shriek
    } else if (activePreset === 'v8') {
      osc1Type = 'sawtooth';
      osc2Type = 'sawtooth';
      filterQ = 2.0; // Deep twin-turbo growl
    } else if (activePreset === 'v12') {
      osc1Type = 'sawtooth';
      osc2Type = 'triangle';
      filterQ = 3.6; // Harmonically rich high frequency operatic howl
    }

    let activeIdleFreq = idleFreq;
    if (activePreset === 'v8') activeIdleFreq = 120;
    else if (activePreset === 'v12') activeIdleFreq = 85;
    else if (activePreset === 'v10') activeIdleFreq = 155;

    // Main low sawtooth (engine cylinders throb)
    const osc1 = ctx.createOscillator();
    osc1.type = osc1Type;
    osc1.frequency.value = activeIdleFreq;

    // Rich high harmonic (exhaust and valve sound)
    const osc2 = ctx.createOscillator();
    osc2.type = osc2Type;
    osc2.frequency.value = activeIdleFreq * 1.5;

    // Sub rumble
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = activeIdleFreq * 0.5;

    // Lowpass filter to shape the tone
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = filterQ;
    filter.frequency.value = 180; // warm idle filter

    // Setup Analyser for interactive visualizer
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    // Volume leveler
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.08;

    // Connections: Oscs -> Filter -> Analyser -> Gain -> Master
    osc1.connect(filter);
    osc2.connect(filter);
    sub.connect(filter);
    
    filter.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(masterGainRef.current!);

    osc1.start();
    osc2.start();
    sub.start();

    osc1Ref.current = osc1;
    osc2Ref.current = osc2;
    subRef.current = sub;
    filterRef.current = filter;
    gainNodeRef.current = gainNode;

    // Start drawing waveform
    setTimeout(() => {
      startVisualizerLoop();
    }, 50);
  };

  const stopEngineNodes = () => {
    try {
      osc1Ref.current?.stop();
      osc2Ref.current?.stop();
      subRef.current?.stop();
    } catch (e) {}
    osc1Ref.current = null;
    osc2Ref.current = null;
    subRef.current = null;
    filterRef.current = null;
    gainNodeRef.current = null;
    analyserRef.current = null;

    if (visualizerAnimRef.current) {
      cancelAnimationFrame(visualizerAnimRef.current);
      visualizerAnimRef.current = null;
    }

    // Reset visualizer canvas to flat center line
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    }
  };

  const shutdownEngine = () => {
    setIsPlaying(false);
    targetRpm.current = 0;
    let start = Date.now();
    const runShutdown = () => {
      let elapsed = Date.now() - start;
      if (elapsed < 600) {
        currentRpm.current += (0 - currentRpm.current) * 0.15;
        setRpm(Math.round(currentRpm.current));
        updateSynthFrequencies(currentRpm.current);
        requestAnimationFrame(runShutdown);
      } else {
        currentRpm.current = 0;
        setRpm(0);
        stopEngineNodes();
      }
    };
    requestAnimationFrame(runShutdown);
  };

  const updateSynthFrequencies = (currentRpmValue: number) => {
    if (!osc1Ref.current || !filterRef.current || !gainNodeRef.current) return;

    let activeIdleFreq = idleFreq;
    if (activePreset === 'v8') activeIdleFreq = 120;
    else if (activePreset === 'v12') activeIdleFreq = 85;
    else if (activePreset === 'v10') activeIdleFreq = 155;

    // Map RPM (1000 - 9000) to base frequency scale (1x to 4x activeIdleFreq)
    const rpmRatio = (currentRpmValue - 1000) / 8000; // 0 to 1
    const clampedRatio = Math.max(0, Math.min(1, rpmRatio));

    // Base pitch multiplier depends on preset profile (screamer vs low-grunt)
    const pitchMultiplier = activePreset === 'v10' ? 6.2 : activePreset === 'v12' ? 5.0 : activePreset === 'v8' ? 3.8 : 3.8;
    const pitchFactor = 1 + clampedRatio * pitchMultiplier;
    const osc1Freq = activeIdleFreq * pitchFactor;
    
    // Cylinder timing harmonic multipliers (V12 has tighter 1.5x, V8 has hollow 2.0x growl)
    let osc2Freq = osc1Freq * 2.0;
    if (activePreset === 'v12' || (activePreset === 'car' && idleFreq < 100)) {
      osc2Freq = osc1Freq * 1.5;
    } else if (activePreset === 'v10') {
      osc2Freq = osc1Freq * 1.67; // Brutally sharp high offset
    }

    const ctx = audioCtxRef.current;
    if (ctx) {
      const now = ctx.currentTime;
      osc1Ref.current.frequency.setTargetAtTime(osc1Freq, now, 0.05);
      osc2Ref.current.frequency.setTargetAtTime(osc2Freq, now, 0.05);
      if (subRef.current) {
        subRef.current.frequency.setTargetAtTime(osc1Freq * 0.5, now, 0.08);
      }

      // Filter opens up as engine revs (sounds brighter and screams)
      const filterMultiplier = activePreset === 'v10' ? 2500 : activePreset === 'v12' ? 2100 : activePreset === 'v8' ? 1500 : 1800;
      const targetFilterFreq = 180 + clampedRatio * filterMultiplier;
      filterRef.current.frequency.setTargetAtTime(targetFilterFreq, now, 0.04);

      // Volume increases slightly with revs
      const volumeFactor = 0.06 + clampedRatio * 0.12;
      gainNodeRef.current.gain.setTargetAtTime(volumeFactor, now, 0.03);
    }
  };

  // Accelerator Rev Controller
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const activeHasFlame = activePreset === 'car' ? hasExhaustFlame : true;

      if (isRevving) {
        // Redline boundaries depend on exhaust profile
        const redline = activePreset === 'v10' ? 8800 : activePreset === 'v12' ? 8400 : 8000;
        targetRpm.current = redline + Math.random() * 400; // near-redline scream
      } else {
        targetRpm.current = 1000 + Math.random() * 150; // smooth idle
      }

      // Smoothly interpolate current RPM to target RPM
      const diff = targetRpm.current - currentRpm.current;
      const speed = isRevving ? 0.20 : 0.13; // Revs up faster than it falls
      currentRpm.current += diff * speed;

      const roundedRpm = Math.round(currentRpm.current);
      setRpm(roundedRpm);
      updateSynthFrequencies(currentRpm.current);

      // Flame effect if redlining
      if (activeHasFlame && currentRpm.current > 7600) {
        setShowFlame(Math.random() > 0.3);
      } else {
        setShowFlame(false);
      }

      // Trigger crackles on rapid throttle release
      if (!isRevving && wasRevvingRef.current) {
        if (currentRpm.current > 5800) {
          triggerBackfirePops(activeHasFlame);
        }
      }

      wasRevvingRef.current = isRevving;
    }, 30);

    rpmInterval.current = interval;
    return () => clearInterval(interval);
  }, [isPlaying, isRevving, idleFreq, hasExhaustFlame, activePreset]);

  // Update engine configurations live if changed while active
  useEffect(() => {
    if (isPlaying && audioCtxRef.current) {
      createEngineNodes(audioCtxRef.current);
      updateSynthFrequencies(currentRpm.current);
    }
  }, [activePreset]);

  // Handle Mute changes
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = isMuted ? 0 : 0.45;
    }
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(rpmInterval.current);
      stopEngineNodes();
    };
  }, []);

  const handleTogglePower = () => {
    if (isPlaying) {
      shutdownEngine();
    } else {
      triggerStartupAudio();
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Automated Quick Rev Sequence
  const triggerRevBlast = () => {
    if (!isPlaying) {
      triggerStartupAudio();
      setTimeout(() => {
        performDoubleRev();
      }, 1600);
    } else {
      performDoubleRev();
    }
  };

  const performDoubleRev = () => {
    // First throttle tap
    setIsRevving(true);
    setTimeout(() => {
      setIsRevving(false);
      
      // Second deep acceleration tap
      setTimeout(() => {
        setIsRevving(true);
        setTimeout(() => {
          setIsRevving(false);
        }, 650);
      }, 200);
    }, 450);
  };

  // Radial speed dial degrees
  const rpmPercent = Math.min(100, Math.max(0, (rpm / 9000) * 100));
  const dashOffset = 502 - (502 * rpmPercent) / 100;

  return (
    <div id="engine-sound-dashboard" className="w-full glass-panel rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
      {/* Absolute Decorative Background Lines */}
      <div className="absolute inset-0 bg-radial-gradient from-red-600/5 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Speedometer/Tachometer Dial */}
      <div className="relative w-48 h-48 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
          {/* Track circle */}
          <circle
            cx="90"
            cy="90"
            r="80"
            className="stroke-neutral-800"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r="80"
            className={`${rpm > 7600 ? 'stroke-red-600' : 'stroke-red-500'} transition-all duration-75`}
            strokeWidth="8"
            fill="none"
            strokeDasharray="502"
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Dynamic center readings */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-neutral-500 font-mono text-[10px] tracking-widest uppercase">RPM</span>
          <span className="text-3xl font-extrabold font-mono text-white tracking-tighter">
            {isPlaying ? rpm.toLocaleString() : 'OFF'}
          </span>
          <span className="text-neutral-400 font-mono text-xs mt-1">
            {rpm > 7600 ? (
              <span className="text-red-500 animate-pulse font-bold tracking-widest">REDLINE</span>
            ) : isPlaying ? (
              isRevving ? 'ACCELERATING' : 'IDLE'
            ) : (
              'IGNITION READY'
            )}
          </span>
        </div>

        {/* Small ticks indicators */}
        <div className="absolute inset-0 pointer-events-none border border-transparent rounded-full" />
      </div>

      {/* Control panel: Ignition, Profile Picker, Oscilloscope */}
      <div className="flex-1 flex flex-col items-center md:items-start gap-4 z-10 w-full text-left">
        <div>
          <span className="text-red-500 font-bold font-sans text-xs uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Web Audio Engine Sound Simulator
          </span>
          <h4 className="text-xl font-bold font-sans text-white tracking-tight">
            {activePreset === 'car'
              ? `${modelName} Signature`
              : activePreset === 'v8'
              ? 'Maranello Twin-Turbo V8'
              : activePreset === 'v12'
              ? 'Maranello V12 Naturally Aspirated'
              : 'F1 Scuderia V10 Sound'}
          </h4>
          
          <p className="text-xs text-neutral-400 mt-1 max-w-sm">
            {activePreset === 'car'
              ? `Authentic, specifically calibrated acoustic baseline engineered for the ${modelName}.`
              : activePreset === 'v8'
              ? 'Deep, throaty twin-turbocharged flat-plane V8 exhaust note with rich middle harmonic pops.'
              : activePreset === 'v12'
              ? 'Multi-layered Naturally Aspirated V12. High pitch, operatic mechanical howl screaming to redline.'
              : 'Legacy Formula 1 Scuderia 3.0L V10 racer with metallic shrieks and ultra-rapid RPM sweeps.'}
          </p>
        </div>

        {/* Segmented Pill Selector to choose V8, V12, F1, or default */}
        <div className="w-full max-w-sm mt-1">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-2">
            Select Engine Exhaust Note Profile
          </span>
          <div className="grid grid-cols-4 gap-1 p-1 bg-black rounded-lg border border-neutral-900 w-full">
            <button
              onClick={() => setActivePreset('car')}
              className={`px-1 py-1.5 rounded-md text-[9px] font-mono font-bold tracking-wider transition-all uppercase text-center ${
                activePreset === 'car'
                  ? 'bg-neutral-800 text-red-500 border border-neutral-700/50'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setActivePreset('v8')}
              className={`px-1 py-1.5 rounded-md text-[9px] font-mono font-bold tracking-wider transition-all uppercase text-center ${
                activePreset === 'v8'
                  ? 'bg-neutral-800 text-red-500 border border-neutral-700/50'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              V8 Turbo
            </button>
            <button
              onClick={() => setActivePreset('v12')}
              className={`px-1 py-1.5 rounded-md text-[9px] font-mono font-bold tracking-wider transition-all uppercase text-center ${
                activePreset === 'v12'
                  ? 'bg-neutral-800 text-red-500 border border-neutral-700/50'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              V12 NA
            </button>
            <button
              onClick={() => setActivePreset('v10')}
              className={`px-1 py-1.5 rounded-md text-[9px] font-mono font-bold tracking-wider transition-all uppercase text-center ${
                activePreset === 'v10'
                  ? 'bg-neutral-800 text-red-500 border border-neutral-700/50'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              F1 V10
            </button>
          </div>
        </div>

        {/* Live Oscilloscope visualizer */}
        <div className="w-full max-w-sm mt-1 bg-black/50 border border-neutral-900/80 rounded-lg p-2.5 shadow-inner">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Acoustic Oscilloscope</span>
            <span className="text-[8px] font-mono text-red-500 tracking-wider flex items-center gap-1">
              <span className={`w-1 h-1 rounded-full bg-red-500 ${isPlaying ? 'animate-ping' : ''}`} />
              {isPlaying ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
          <canvas
            ref={canvasRef}
            width={320}
            height={50}
            className="w-full h-12 rounded bg-black border border-neutral-950 shadow-inner block"
          />
        </div>

        <div className="flex items-center gap-3 mt-2 w-full max-w-sm">
          {/* Glowing Red Start Stop Button */}
          <button
            id="engine-ignition-btn"
            onClick={handleTogglePower}
            className={`flex-1 relative flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold uppercase text-xs tracking-wider font-mono transition-all duration-300 shadow-lg ${
              isPlaying
                ? 'bg-neutral-900 text-red-500 hover:bg-neutral-800 border border-red-500/30'
                : 'bg-red-600 text-white hover:bg-red-500 shadow-red-600/30 border border-transparent'
            }`}
          >
            <span className={`absolute -inset-1 rounded-full blur opacity-45 transition-all duration-300 ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-transparent'}`} />
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-red-500 stroke-red-500" />
                Stop Engine
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white animate-bounce" />
                Start Engine
              </>
            )}
          </button>

          {/* Quick Rev Burst Button */}
          <button
            onClick={triggerRevBlast}
            className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-full font-mono text-xs uppercase font-semibold tracking-wider transition-all"
            title="Automatically triggers a quick double-rev burst with deceleration crackles"
          >
            Rev Blast
          </button>

          {/* Mute toggle */}
          <button
            id="engine-mute-btn"
            onClick={handleMuteToggle}
            className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute engine' : 'Mute engine'}
          >
            {isMuted ? <VolumeX className="w-4.5 h-4.5 text-red-500" /> : <Volume2 className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Pedal / Rev controller */}
      <div className="w-full md:w-auto flex flex-col items-center justify-center gap-3 z-10 flex-shrink-0">
        <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest">
          Throttle Accelerator Pedal
        </span>

        {/* Graphic Pedal */}
        <div className="relative w-28 h-40 bg-neutral-900 rounded-xl border border-neutral-800 flex flex-col items-center justify-end p-2 pb-6 shadow-inner overflow-hidden">
          {/* Pedal itself */}
          <button
            id="throttle-pedal-btn"
            disabled={!isPlaying}
            onMouseDown={() => isPlaying && setIsRevving(true)}
            onMouseUp={() => setIsRevving(false)}
            onMouseLeave={() => setIsRevving(false)}
            onTouchStart={() => isPlaying && setIsRevving(true)}
            onTouchEnd={() => setIsRevving(false)}
            className={`w-16 h-28 rounded-lg border-2 font-mono text-[10px] transition-all duration-150 relative shadow-2xl flex flex-col items-center justify-between py-4 select-none ${
              !isPlaying
                ? 'bg-neutral-950 border-neutral-800 text-neutral-700 cursor-not-allowed'
                : isRevving
                ? 'bg-neutral-800 border-red-500 text-red-500 translate-y-3 shadow-inner'
                : 'bg-neutral-950 border-neutral-700 text-neutral-400 hover:border-neutral-500 cursor-pointer'
            }`}
          >
            {/* Grip slots */}
            <div className="flex flex-col gap-1 w-full px-3">
              <div className="h-1 bg-neutral-800 rounded-full" />
              <div className="h-1 bg-neutral-800 rounded-full" />
              <div className="h-1 bg-neutral-800 rounded-full" />
              <div className="h-1 bg-neutral-800 rounded-full" />
              <div className="h-1 bg-neutral-800 rounded-full" />
            </div>

            <span className="font-extrabold tracking-wider pointer-events-none">
              {isRevving ? 'REV' : 'PUSH'}
            </span>

            <div className="flex flex-col gap-1 w-full px-3">
              <div className="h-1 bg-neutral-800 rounded-full" />
              <div className="h-1 bg-neutral-800 rounded-full" />
            </div>
          </button>

          {/* Indicator Light */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isRevving ? 'bg-orange-500 animate-ping' : 'bg-neutral-700'}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${isRevving ? 'bg-red-500 animate-pulse' : 'bg-neutral-700'}`} />
          </div>
        </div>

        {/* Active exhaust flames animations */}
        <AnimatePresence>
          {showFlame && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-950/90 border border-red-500/40 rounded-full text-[10px] text-red-400 font-mono font-bold tracking-widest"
            >
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-bounce" />
              EXHAUST FLAME ACTIVE
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
