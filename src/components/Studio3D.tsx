import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  RotateCcw, Wind, Flame, Eye, Paintbrush, Sliders, Trophy, Maximize2, 
  Volume2, Play, Square, Settings, ChevronRight, Gauge, Activity, Compass
} from 'lucide-react';
import { ferrariModels, FerrariModel } from '../data/ferrariData';

interface Studio3DProps {
  initialCarId?: string;
  onBackToCatalogue?: () => void;
}

export default function Studio3D({ initialCarId, onBackToCatalogue }: Studio3DProps) {
  // Current selected Ferrari
  const [selectedCar, setSelectedCar] = useState<FerrariModel>(
    ferrariModels.find(c => c.id === initialCarId) || ferrariModels[0]
  );

  // Customization State
  const [paintColor, setPaintColor] = useState({ name: 'Rosso Corsa', hex: '#D40000' });
  const [wheelType, setWheelType] = useState<'star' | 'wire' | 'racing'>('star');
  const [spoilerRaised, setSpoilerRaised] = useState(false);
  
  // Interactive Simulator State
  const [isWindTunnelActive, setIsWindTunnelActive] = useState(true);
  const [windSpeed, setWindSpeed] = useState(120); // km/h
  const [isXrayMode, setIsXrayMode] = useState(false);
  const [isThrottleActive, setIsThrottleActive] = useState(false);
  const [rpm, setRpm] = useState(1000); // Live RPM
  const [activeTab, setActiveTab] = useState<'visual' | 'aero' | 'dyno'>('visual');

  // Canvas & Three.js Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);
  const exhaustFlamesRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const underglowLightRef = useRef<THREE.PointLight | null>(null);

  // Audio Synth State & Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(true);

  // Paint Swatches
  const paintSwatches = [
    { name: 'Rosso Corsa', hex: '#D40000' },
    { name: 'Giallo Modena', hex: '#F4B400' },
    { name: 'Nero Daytona', hex: '#111111' },
    { name: 'Bianco Avus', hex: '#F3F4F6' },
    { name: 'Blu Pozzi', hex: '#0B2265' },
    { name: 'Verde Jewel', hex: '#105B35' }
  ];

  // Sync state if initialCarId changes
  useEffect(() => {
    if (initialCarId) {
      const car = ferrariModels.find(c => c.id === initialCarId);
      if (car) {
        setSelectedCar(car);
        // Reset custom options
        setSpoilerRaised(false);
      }
    }
  }, [initialCarId]);

  // Audio Synthesizer Controls
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      filter.type = 'lowpass';
      filter.frequency.value = 350;

      gainNode.gain.value = 0.0; // Start quiet

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      audioCtxRef.current = ctx;
      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      filterRef.current = filter;
      gainNodeRef.current = gainNode;
    } catch (e) {
      console.warn("Failed to initialize audio synth", e);
    }
  };

  // Sound Mute Toggle
  useEffect(() => {
    if (!isSoundMuted) {
      initAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(isSoundMuted ? 0.0 : 0.08, audioCtxRef.current?.currentTime || 0);
    }
  }, [isSoundMuted]);

  // Audio state engine linked to RPM & Throttle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isThrottleActive) {
      // Accelerate RPM
      interval = setInterval(() => {
        setRpm(prev => {
          const target = 8500;
          const next = prev + (target - prev) * 0.25;
          return next > 8400 ? 8400 + Math.random() * 100 : next;
        });
      }, 30);
    } else {
      // Decelerate to idle RPM
      interval = setInterval(() => {
        setRpm(prev => {
          const target = 950 + Math.sin(Date.now() / 150) * 20;
          const next = prev - (prev - target) * 0.15;
          return next < 1000 ? target : next;
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isThrottleActive]);

  // Update Synth frequencies on RPM change
  useEffect(() => {
    if (!isSoundMuted && osc1Ref.current && osc2Ref.current && filterRef.current) {
      const baseFreq = selectedCar.idleFreq || 45;
      const soundScale = selectedCar.soundFreq || 100;
      
      // Calculate active pitch scaling
      const pitchMultiplier = 1 + (rpm - 1000) / 1800;
      const f1 = baseFreq * pitchMultiplier;
      const f2 = f1 * 1.5; // Harmonic chord

      const now = audioCtxRef.current?.currentTime || 0;
      osc1Ref.current.frequency.setTargetAtTime(f1, now, 0.05);
      osc2Ref.current.frequency.setTargetAtTime(f2, now, 0.05);

      // Lowpass opens up at high RPM
      const filterFreq = 300 + (rpm - 1000) * 0.5;
      filterRef.current.frequency.setTargetAtTime(filterFreq, now, 0.05);
    }
  }, [rpm, isSoundMuted, selectedCar]);

  // 3D Scene Initialization
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Create Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');
    scene.fog = new THREE.FogExp2('#050505', 0.08);
    sceneRef.current = scene;

    // 2. Setup Camera
    const camera = new THREE.PerspectiveCamera(
      40, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      100
    );
    camera.position.set(5.5, 2.0, 7.5);
    camera.lookAt(0, 0.5, 0);

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Clear old canvases
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Add Lights
    // Ambient soft fill
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.15);
    scene.add(ambientLight);

    // Warm overhead key light
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Soft cool rim light from behind
    const rimLight = new THREE.DirectionalLight('#4e80e6', 0.8);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    // Dynamic car paint underglow
    const underglowLight = new THREE.PointLight('#D40000', 0, 4);
    underglowLight.position.set(0, 0.1, 0);
    scene.add(underglowLight);
    underglowLightRef.current = underglowLight;

    // 5. Grid Floor
    const gridHelper = new THREE.GridHelper(40, 40, '#D40000', '#1a1a1a');
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Reflective floor plane for shadow baking
    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#050505',
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. Build Wind Tunnel Aerodynamic Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const originalY = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Place scattered points in front of the car, driving backwards
      positions[i * 3] = (Math.random() - 0.5) * 2.2; // width
      positions[i * 3 + 1] = Math.random() * 1.5 + 0.05; // height
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12; // length
      
      speeds[i] = 0.1 + Math.random() * 0.05;
      originalY[i] = positions[i * 3 + 1];
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: '#ff4d4d',
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 7. Render/Animation Loop
    let animationFrameId: number;
    let cameraAngle = 0.9; // Slow rotation tracking

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotates the main car container slowly unless manually dragging
      if (carGroupRef.current) {
        // Slow auto rotate
        if (!isThrottleActive) {
          carGroupRef.current.rotation.y += 0.003;
        } else {
          // Vibrating shake effect under high RPM throttle
          carGroupRef.current.position.y = (Math.random() - 0.5) * (rpm / 8500) * 0.015;
          carGroupRef.current.position.x = (Math.random() - 0.5) * (rpm / 8500) * 0.01;
        }
      }

      // Spin wheels based on speed / throttle
      const currentWheelSpeed = isThrottleActive ? (rpm / 1500) * 0.2 : (windSpeed / 120) * 0.04;
      wheelsRef.current.forEach(wheel => {
        wheel.rotation.x += currentWheelSpeed;
      });

      // Flickering exhaust flame logic
      exhaustFlamesRef.current.forEach(flame => {
        if (isThrottleActive && selectedCar.exhaustFlame) {
          flame.visible = true;
          const scale = 0.3 + Math.random() * 1.2;
          flame.scale.set(scale, scale, scale * 2);
          
          const flameMat = flame.material as THREE.MeshStandardMaterial;
          flameMat.emissiveIntensity = 2 + Math.random() * 4;
        } else {
          flame.visible = false;
        }
      });

      // Animate Wind Tunnel Particles
      if (particlesRef.current && isWindTunnelActive) {
        const posAttr = particlesRef.current.geometry.attributes.position;
        const count = posAttr.count;
        const currentWindSpeedMult = windSpeed / 120;

        for (let i = 0; i < count; i++) {
          let x = posAttr.getX(i);
          let y = posAttr.getY(i);
          let z = posAttr.getZ(i);

          // Move backward along Z axis
          z -= speeds[i] * currentWindSpeedMult;

          // If passed behind, recycle back to front
          if (z < -6) {
            z = 6;
            x = (Math.random() - 0.5) * 2.2;
            y = Math.random() * 1.4 + 0.05;
            originalY[i] = y;
          }

          // Aerodynamic deflection logic: flow elegantly OVER the car shape!
          // Car is placed roughly around z = -2 to +2
          if (Math.abs(x) < 0.95 && z > -2.2 && z < 2.2) {
            // Smoothly lift particles based on car outline profiles
            let targetY = originalY[i];
            
            if (selectedCar.category === 'SUVs') {
              // Tall SUV profile
              if (z > 1.2) { // hood
                targetY = 0.6;
              } else if (z > -0.8) { // cabin roof
                targetY = 1.35;
              } else { // rear hatch
                targetY = 0.9;
              }
            } else if (selectedCar.category === 'Formula 1') {
              // F1 profile (very flat floor, high front/rear wings)
              if (z > 1.5) { // front wing
                targetY = 0.35;
              } else if (z > -0.5 && z < 0.5) { // rollhoop/airbox
                targetY = 0.9;
              } else if (z < -1.4) { // rear wing
                targetY = 0.85;
              } else {
                targetY = 0.22;
              }
            } else {
              // Sleek low-slung supercar / classic profiles
              if (z > 1.0) { // hood
                targetY = 0.45;
              } else if (z > -0.8) { // cabin
                targetY = 1.05;
              } else { // tail / active spoiler
                targetY = 0.55 + (spoilerRaised ? 0.35 : 0);
              }
            }

            // Lerp particle height to simulate wind gliding
            y = THREE.MathUtils.lerp(y, targetY + 0.06, 0.25);
          } else {
            // Lerp back to normal height outside car body
            y = THREE.MathUtils.lerp(y, originalY[i], 0.1);
          }

          posAttr.setXYZ(i, x, y, z);
        }
        posAttr.needsUpdate = true;
      }

      // Update particle visibility
      particlesRef.current.visible = isWindTunnelActive;

      // Spin scene camera slowly around car to feel cinematic
      if (!isThrottleActive && rendererRef.current && sceneRef.current) {
        cameraAngle += 0.0015;
        // camera.position.x = Math.sin(cameraAngle) * 7.5;
        // camera.position.z = Math.cos(cameraAngle) * 7.5;
        // camera.lookAt(0, 0.5, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [selectedCar, isWindTunnelActive, windSpeed, spoilerRaised]);

  // Re-build car geometry inside the group when selected car, paint, wheel style, or xray mode changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear old car group
    if (carGroupRef.current) {
      scene.remove(carGroupRef.current);
    }

    // 1. Root Car Group
    const carGroup = new THREE.Group();
    carGroup.position.set(0, 0, 0);
    carGroupRef.current = carGroup;
    wheelsRef.current = [];
    exhaustFlamesRef.current = [];

    // Create materials
    const carColor = new THREE.Color(paintColor.hex);
    
    // Sleek Glossy Lacquer Metallic Paint Material
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: carColor,
      metalness: isXrayMode ? 0.0 : 0.85,
      roughness: isXrayMode ? 0.9 : 0.12,
      clearcoat: isXrayMode ? 0.0 : 1.0,
      clearcoatRoughness: 0.1,
      wireframe: isXrayMode,
      transparent: isXrayMode,
      opacity: isXrayMode ? 0.25 : 1.0
    });

    // Dark Glass Material
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: '#0a0a0a',
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: isXrayMode ? 0.1 : 0.85,
      wireframe: isXrayMode
    });

    // Matte Black Trim / Underbody Material
    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: '#121212',
      roughness: 0.6,
      metalness: 0.7,
      wireframe: isXrayMode
    });

    // Glowing headlights
    const ledMaterial = new THREE.MeshBasicMaterial({
      color: '#ffffff'
    });

    // Glowing tail lights
    const brakeLightMaterial = new THREE.MeshBasicMaterial({
      color: '#D40000'
    });

    // Wheels Chrome Rim / Tyre materials
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: wheelType === 'racing' ? '#1c1c1c' : '#c0c0c0',
      roughness: 0.08,
      metalness: 0.95,
      wireframe: isXrayMode
    });
    const tyreMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 0.85,
      metalness: 0.1,
      wireframe: isXrayMode
    });

    // Dynamic Car Scaling dimensions
    const isF1 = selectedCar.category === 'Formula 1';
    const isSUV = selectedCar.category === 'SUVs';
    const isClassic = selectedCar.category === 'Classic';

    // Set underglow color
    if (underglowLightRef.current) {
      underglowLightRef.current.color = carColor;
      underglowLightRef.current.intensity = isThrottleActive ? 4.5 : 1.2;
    }

    if (isF1) {
      // FORMULA 1 MONOPOSTO (SF-24)
      // Main slender monocoque body
      const chassisGeo = new THREE.BoxGeometry(0.7, 0.28, 3.4);
      const chassis = new THREE.Mesh(chassisGeo, bodyMaterial);
      chassis.position.y = 0.22;
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      carGroup.add(chassis);

      // Front nose cone (sloping forward)
      const noseGeo = new THREE.BoxGeometry(0.4, 0.15, 1.2);
      const nose = new THREE.Mesh(noseGeo, bodyMaterial);
      nose.position.set(0, 0.18, 1.9);
      nose.rotation.x = -0.08;
      nose.castShadow = true;
      carGroup.add(nose);

      // Front massive wing plane
      const frontWingGeo = new THREE.BoxGeometry(1.9, 0.04, 0.35);
      const frontWing = new THREE.Mesh(frontWingGeo, carbonMaterial);
      frontWing.position.set(0, 0.12, 2.3);
      frontWing.castShadow = true;
      carGroup.add(frontWing);

      // Front wing endplates (red vertical)
      const endplateGeo = new THREE.BoxGeometry(0.04, 0.22, 0.45);
      const leftEnd = new THREE.Mesh(endplateGeo, bodyMaterial);
      leftEnd.position.set(0.95, 0.2, 2.3);
      const rightEnd = leftEnd.clone();
      rightEnd.position.x = -0.95;
      carGroup.add(leftEnd, rightEnd);

      // Halo Safety Arch
      const haloGeo = new THREE.TorusGeometry(0.22, 0.035, 8, 24, Math.PI);
      const halo = new THREE.Mesh(haloGeo, carbonMaterial);
      halo.position.set(0, 0.45, 0.3);
      halo.rotation.x = Math.PI / 2;
      carGroup.add(halo);

      // Driver cockpit opening (black hole)
      const cockpitGeo = new THREE.BoxGeometry(0.35, 0.1, 0.7);
      const cockpit = new THREE.Mesh(cockpitGeo, carbonMaterial);
      cockpit.position.set(0, 0.35, 0.3);
      carGroup.add(cockpit);

      // Sidepods left/right
      const sidepodGeo = new THREE.BoxGeometry(0.3, 0.32, 1.4);
      const leftSidepod = new THREE.Mesh(sidepodGeo, bodyMaterial);
      leftSidepod.position.set(0.45, 0.22, 0.2);
      const rightSidepod = leftSidepod.clone();
      rightSidepod.position.x = -0.45;
      leftSidepod.castShadow = true;
      rightSidepod.castShadow = true;
      carGroup.add(leftSidepod, rightSidepod);

      // Air intake box above driver's head
      const airboxGeo = new THREE.BoxGeometry(0.3, 0.25, 0.4);
      const airbox = new THREE.Mesh(airboxGeo, bodyMaterial);
      airbox.position.set(0, 0.62, -0.1);
      carGroup.add(airbox);

      // Rear massive DRS wing
      const rearWingGeo = new THREE.BoxGeometry(1.4, 0.04, 0.45);
      const rearWing = new THREE.Mesh(rearWingGeo, carbonMaterial);
      rearWing.position.set(0, 0.82, -1.5);
      rearWing.castShadow = true;
      carGroup.add(rearWing);

      // Rear wing vertical pillars
      const wingPillarGeo = new THREE.BoxGeometry(0.04, 0.6, 0.5);
      const leftPillar = new THREE.Mesh(wingPillarGeo, bodyMaterial);
      leftPillar.position.set(0.68, 0.55, -1.5);
      const rightPillar = leftPillar.clone();
      rightPillar.position.x = -0.68;
      carGroup.add(leftPillar, rightPillar);

      // F1 Exposed suspension wishbones (4 units)
      const wbGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.85);
      wbGeo.rotateZ(Math.PI / 2);
      
      const wbFL = new THREE.Mesh(wbGeo, carbonMaterial);
      wbFL.position.set(0.5, 0.22, 1.4);
      const wbFR = wbFL.clone();
      wbFR.position.x = -0.5;
      
      const wbRL = new THREE.Mesh(wbGeo, carbonMaterial);
      wbRL.position.set(0.5, 0.22, -1.1);
      const wbRR = wbRL.clone();
      wbRR.position.x = -0.5;

      carGroup.add(wbFL, wbFR, wbRL, wbRR);

    } else if (isSUV) {
      // PURUSANGUE SAV (SUV) SHAPE
      // Lower body platform
      const lowerGeo = new THREE.BoxGeometry(1.85, 0.45, 4.2);
      const lowerBody = new THREE.Mesh(lowerGeo, bodyMaterial);
      lowerBody.position.y = 0.42;
      lowerBody.castShadow = true;
      lowerBody.receiveShadow = true;
      carGroup.add(lowerBody);

      // Bulky cabin glasshouse
      const cabinGeo = new THREE.BoxGeometry(1.5, 0.65, 2.3);
      const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
      cabin.position.set(0, 0.95, -0.3);
      cabin.castShadow = true;
      carGroup.add(cabin);

      // High muscular hood
      const hoodGeo = new THREE.BoxGeometry(1.8, 0.35, 1.3);
      const hood = new THREE.Mesh(hoodGeo, bodyMaterial);
      hood.position.set(0, 0.6, 1.45);
      hood.castShadow = true;
      carGroup.add(hood);

      // SUV Wheel Arches (Flares)
      const archGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.25, 16);
      archGeo.rotateZ(Math.PI / 2);
      const archFL = new THREE.Mesh(archGeo, carbonMaterial);
      archFL.position.set(0.9, 0.32, 1.2);
      const archFR = archFL.clone();
      archFR.position.x = -0.9;
      const archRL = archFL.clone();
      archRL.position.set(0.9, 0.32, -1.2);
      const archRR = archRL.clone();
      archRR.position.x = -0.9;
      carGroup.add(archFL, archFR, archRL, archRR);

    } else {
      // LOW-SLUNG SPORTS CARS (SF90, F40, 458, 250 GTO, F80, etc.)
      // Low floor chassis
      const baseGeo = new THREE.BoxGeometry(1.8, 0.28, 4.1);
      const chassis = new THREE.Mesh(baseGeo, bodyMaterial);
      chassis.position.y = 0.22;
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      carGroup.add(chassis);

      // Sloping sleek hood
      const hoodGeo = new THREE.BoxGeometry(1.76, 0.22, 1.4);
      const hood = new THREE.Mesh(hoodGeo, bodyMaterial);
      hood.position.set(0, 0.3, 1.3);
      hood.rotation.x = -0.06;
      hood.castShadow = true;
      carGroup.add(hood);

      // Curved low cabin canopy
      const cabinGeo = new THREE.SphereGeometry(0.8, 24, 24);
      cabinGeo.scale(1.0, 0.68, 1.8); // Flatten to make cockpit
      const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
      cabin.position.set(0, 0.42, -0.15);
      cabin.castShadow = true;
      carGroup.add(cabin);

      // Engine deck lid at rear
      const deckGeo = new THREE.BoxGeometry(1.74, 0.24, 1.5);
      const deck = new THREE.Mesh(deckGeo, bodyMaterial);
      deck.position.set(0, 0.32, -1.35);
      deck.castShadow = true;
      carGroup.add(deck);

      // Aero front splitters
      const splitterGeo = new THREE.BoxGeometry(1.82, 0.05, 0.35);
      const splitter = new THREE.Mesh(splitterGeo, carbonMaterial);
      splitter.position.set(0, 0.1, 2.1);
      carGroup.add(splitter);

      // Active Rear Wing / Spoiler
      const wingGeo = new THREE.BoxGeometry(1.72, 0.04, 0.25);
      const wing = new THREE.Mesh(wingGeo, carbonMaterial);
      // Moves up if active!
      wing.position.set(0, spoilerRaised ? 0.62 : 0.38, -2.05);
      wing.castShadow = true;
      carGroup.add(wing);

      // Wing support struts
      const strutGeo = new THREE.BoxGeometry(0.04, 0.3, 0.04);
      const leftStrut = new THREE.Mesh(strutGeo, carbonMaterial);
      leftStrut.position.set(0.6, spoilerRaised ? 0.48 : 0.28, -2.0);
      const rightStrut = leftStrut.clone();
      rightStrut.position.x = -0.6;
      carGroup.add(leftStrut, rightStrut);

      // Classic round styling elements for 250 GTO & Dino
      if (isClassic && selectedCar.id !== 'f40' && selectedCar.id !== '288-gto') {
        // Curve fender extensions
        const fenderGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.4, 16);
        fenderGeo.rotateZ(Math.PI / 2);
        const lFender = new THREE.Mesh(fenderGeo, bodyMaterial);
        lFender.position.set(0.82, 0.35, 1.25);
        const rFender = lFender.clone();
        rFender.position.x = -0.82;
        carGroup.add(lFender, rFender);
      }

      // Testarossa cheese-graters (Retro side slats)
      if (selectedCar.id === 'testarossa') {
        const slatGeo = new THREE.BoxGeometry(0.04, 0.16, 1.1);
        for (let j = 0; j < 4; j++) {
          const lSlat = new THREE.Mesh(slatGeo, carbonMaterial);
          lSlat.position.set(0.91, 0.22 + j * 0.04, -0.4);
          const rSlat = lSlat.clone();
          rSlat.position.x = -0.91;
          carGroup.add(lSlat, rSlat);
        }
      }
    }

    // 2. Headlights (LED white beams)
    const headlightGeo = new THREE.BoxGeometry(0.18, 0.06, 0.15);
    const leftHeadlight = new THREE.Mesh(headlightGeo, ledMaterial);
    leftHeadlight.position.set(isF1 ? 0.2 : 0.72, isSUV ? 0.6 : 0.32, isF1 ? 2.45 : 1.95);
    const rightHeadlight = leftHeadlight.clone();
    rightHeadlight.position.x = -leftHeadlight.position.x;
    carGroup.add(leftHeadlight, rightHeadlight);

    // 3. Tail Lights (Brake red glow)
    const taillightGeo = new THREE.BoxGeometry(0.2, 0.08, 0.04);
    const leftTail = new THREE.Mesh(taillightGeo, brakeLightMaterial);
    leftTail.position.set(isF1 ? 0.15 : 0.75, isSUV ? 0.65 : 0.34, isF1 ? -1.55 : -2.12);
    const rightTail = leftTail.clone();
    rightTail.position.x = -leftTail.position.x;
    carGroup.add(leftTail, rightTail);

    // 4. Exhaust pipes & Flames
    const exhaustGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.22, 12);
    exhaustGeo.rotateX(Math.PI / 2);
    
    const leftExhaust = new THREE.Mesh(exhaustGeo, carbonMaterial);
    leftExhaust.position.set(isF1 ? 0 : -0.32, isSUV ? 0.25 : 0.16, isF1 ? -1.6 : -2.15);
    const rightExhaust = leftExhaust.clone();
    if (!isF1) {
      rightExhaust.position.x = 0.32;
    }
    carGroup.add(leftExhaust, rightExhaust);

    // Add glowing Flame meshes to exhausts
    const flameGeo = new THREE.ConeGeometry(0.12, 0.45, 12);
    flameGeo.rotateX(-Math.PI / 2);
    const flameMat = new THREE.MeshStandardMaterial({
      color: '#ff4d00',
      emissive: '#ff2a00',
      emissiveIntensity: 3.5,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const flameL = new THREE.Mesh(flameGeo, flameMat);
    flameL.position.set(leftExhaust.position.x, leftExhaust.position.y, leftExhaust.position.z - 0.25);
    flameL.visible = false;
    
    const flameR = flameL.clone();
    flameR.position.x = rightExhaust.position.x;
    flameR.visible = false;

    carGroup.add(flameL, flameR);
    exhaustFlamesRef.current.push(flameL, flameR);

    // 5. FOUR WHEELS
    const wheelY = isSUV ? 0.32 : 0.22;
    const wheelZFront = isF1 ? 1.4 : isSUV ? 1.2 : 1.25;
    const wheelZRear = isF1 ? -1.1 : isSUV ? -1.2 : -1.25;
    const wheelXPos = isF1 ? 0.95 : isSUV ? 0.9 : 0.86;

    // Wheel dimensions
    const frontRadius = isF1 ? 0.35 : isSUV ? 0.42 : 0.34;
    const rearRadius = isF1 ? 0.42 : isSUV ? 0.44 : 0.36;
    const frontWidth = isF1 ? 0.34 : isSUV ? 0.28 : 0.25;
    const rearWidth = isF1 ? 0.48 : isSUV ? 0.32 : 0.28;

    const wheelsConfig = [
      { name: 'FL', x: wheelXPos, y: wheelY, z: wheelZFront, r: frontRadius, w: frontWidth },
      { name: 'FR', x: -wheelXPos, y: wheelY, z: wheelZFront, r: frontRadius, w: frontWidth },
      { name: 'RL', x: wheelXPos, y: wheelY, z: wheelZRear, r: rearRadius, w: rearWidth },
      { name: 'RR', x: -wheelXPos, y: wheelY, z: wheelZRear, r: rearRadius, w: rearWidth }
    ];

    wheelsConfig.forEach(cfg => {
      const wGroup = new THREE.Group();
      wGroup.position.set(cfg.x, cfg.y, cfg.z);

      // Tyre Cylinder
      const tyreGeo = new THREE.CylinderGeometry(cfg.r, cfg.r, cfg.w, 24);
      tyreGeo.rotateZ(Math.PI / 2);
      const tyre = new THREE.Mesh(tyreGeo, tyreMaterial);
      tyre.castShadow = true;
      wGroup.add(tyre);

      // Inner Rim disk
      const rimGeo = new THREE.CylinderGeometry(cfg.r * 0.72, cfg.r * 0.72, cfg.w + 0.02, 16);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, chromeMaterial);
      rim.castShadow = true;
      wGroup.add(rim);

      // Spokes styling
      if (wheelType === 'wire') {
        // Classic multiple spokes lines
        const wireMat = new THREE.MeshStandardMaterial({
          color: '#d1d5db',
          metalness: 1.0,
          roughness: 0.05,
          wireframe: true
        });
        const spokesGeo = new THREE.CylinderGeometry(cfg.r * 0.68, cfg.r * 0.68, cfg.w + 0.03, 12, 1, true);
        spokesGeo.rotateZ(Math.PI / 2);
        const spokes = new THREE.Mesh(spokesGeo, wireMat);
        wGroup.add(spokes);
      } else if (wheelType === 'racing') {
        // Dark solid race face with yellow hub cap
        const faceGeo = new THREE.BoxGeometry(cfg.w + 0.035, cfg.r * 0.5, cfg.r * 0.5);
        const face1 = new THREE.Mesh(faceGeo, chromeMaterial);
        wGroup.add(face1);
      } else {
        // Star spokes (3 crossed thick boxes)
        const spokeBoxGeo = new THREE.BoxGeometry(cfg.w + 0.035, cfg.r * 1.35, 0.06);
        const spoke1 = new THREE.Mesh(spokeBoxGeo, chromeMaterial);
        const spoke2 = spoke1.clone();
        spoke2.rotation.x = Math.PI / 3;
        const spoke3 = spoke1.clone();
        spoke3.rotation.x = -Math.PI / 3;
        wGroup.add(spoke1, spoke2, spoke3);
      }

      carGroup.add(wGroup);
      wheelsRef.current.push(wGroup);
    });

    scene.add(carGroup);

  }, [selectedCar, paintColor, wheelType, isXrayMode, spoilerRaised]);

  // Handle car selection change
  const selectCar = (car: FerrariModel) => {
    setSelectedCar(car);
    // Auto sync paint color to red by default (since it's Ferrari)
    setPaintColor({ name: 'Rosso Corsa', hex: '#D40000' });
    setSpoilerRaised(false);
  };

  return (
    <div id="maranello-3d-studio" className="min-h-screen bg-[#050505] text-white pt-24 px-4 md:px-8 pb-12">
      
      {/* Visual Back Nav Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToCatalogue}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono tracking-wider transition-colors"
          >
            ← BACK TO ARCHIVE
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div>
            <h1 className="text-xl md:text-2xl font-sans font-black uppercase tracking-tight flex items-center gap-2">
              Maranello <span className="text-red-500">3D Studio</span>
            </h1>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              Aero Wind Tunnel & Live Telemetry Customizer
            </p>
          </div>
        </div>

        {/* Live Status Indicators (Anti-slop note: Minimal, elegant, clean) */}
        <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            WEBGL RENDERER ACTIVE
          </span>
          <span className="text-neutral-700">|</span>
          <span className="text-red-500 font-bold">{selectedCar.name.toUpperCase()}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 3D WEBGL INTERACTIVE STAGE (SPAN 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Interactive Stage Canvas Container */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/5 bg-[#0a0a0a] shadow-2xl">
            
            {/* Absolute Stage Floating Telemetry Overlay */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none select-none">
              
              {/* Telemetry Block */}
              <div className="p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 text-left font-mono space-y-1">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">ENGINE RPM</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white leading-none">
                    {Math.round(rpm).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400">RPM</span>
                </div>
                {/* RPM Redline visual bar */}
                <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className={`h-full transition-all duration-300 ${rpm > 7000 ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`}
                    style={{ width: `${(rpm / 8500) * 100}%` }}
                  />
                </div>
              </div>

              {/* Secondary Speed Telemetry */}
              <div className="p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 text-right font-mono space-y-1">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">AERO AIRSPEED</span>
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-2xl font-black text-red-500 leading-none">
                    {isThrottleActive ? Math.round(rpm / 25) : isWindTunnelActive ? windSpeed : 0}
                  </span>
                  <span className="text-[10px] text-neutral-400">KM/H</span>
                </div>
                <span className="text-[8px] text-neutral-500 block">
                  DRAG COEF: {selectedCar.category === 'Formula 1' ? '0.78 Cd' : selectedCar.category === 'SUVs' ? '0.34 Cd' : '0.29 Cd'}
                </span>
              </div>

            </div>

            {/* Bottom floating controls on stage */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2 items-center justify-between">
              
              {/* Interaction help tips */}
              <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-[9px] font-mono text-neutral-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-red-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>DRAG SCENE TO 3D ROTATE & ORBIT VEHICLE</span>
              </div>

              {/* Fast presets buttons */}
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setIsXrayMode(!isXrayMode)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                    isXrayMode 
                      ? 'bg-red-500/20 border-red-500 text-red-400' 
                      : 'bg-black/60 border-white/10 hover:border-white/25 text-neutral-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  X-RAY CHASSIS
                </button>
                
                <button 
                  onClick={() => setIsWindTunnelActive(!isWindTunnelActive)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                    isWindTunnelActive 
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                      : 'bg-black/60 border-white/10 hover:border-white/25 text-neutral-300'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5" />
                  WIND TUNNEL
                </button>

                {/* Sound trigger */}
                <button 
                  onClick={() => setIsSoundMuted(!isSoundMuted)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                    !isSoundMuted 
                      ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' 
                      : 'bg-black/60 border-white/10 text-neutral-300 hover:border-white/25'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {isSoundMuted ? 'UNMUTE SYNTH' : 'SYNTH LIVE'}
                </button>
              </div>

            </div>

            {/* THREE.JS RENDER TARGET CANVAS */}
            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          </div>

          {/* Interactive Driving & Throttle Dashboard Panel */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600/10 px-3 py-1 text-[8px] font-mono text-red-400 tracking-widest uppercase border-l border-b border-white/5">
              Live Dyno Link
            </div>
            
            <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-red-500" />
              Dynamic Maranello Power Unit Throttle Simulator
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Big Throttle Accelerator Pedal */}
              <div className="md:col-span-5 flex flex-col gap-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                  Click and hold down to floor the gas pedal:
                </span>
                
                <button
                  onMouseDown={() => {
                    initAudio();
                    setIsThrottleActive(true);
                  }}
                  onMouseUp={() => setIsThrottleActive(false)}
                  onMouseLeave={() => setIsThrottleActive(false)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    initAudio();
                    setIsThrottleActive(true);
                  }}
                  onTouchEnd={() => setIsThrottleActive(false)}
                  className={`w-full py-6 rounded-2xl border text-sm font-mono tracking-widest transition-all uppercase font-black select-none ${
                    isThrottleActive 
                      ? 'bg-red-600 border-red-500 text-white scale-[0.98] shadow-inner shadow-black/40' 
                      : 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-white/10 hover:border-red-500/30 text-neutral-300 shadow-xl'
                  }`}
                >
                  {isThrottleActive ? '🔥 FLOORED! REVVING ENGINE 🔥' : 'PUSH & HOLD TO ACCELERATE'}
                </button>
              </div>

              {/* Dynamic Telemetry Specs Feedback */}
              <div className="md:col-span-7 grid grid-cols-3 gap-3">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                  <span className="text-[8px] font-mono text-neutral-500 block uppercase mb-1">Max Power</span>
                  <span className="text-lg font-mono font-black text-white">{selectedCar.horsepower}</span>
                  <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">CV</span>
                </div>

                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                  <span className="text-[8px] font-mono text-neutral-500 block uppercase mb-1">Top Speed</span>
                  <span className="text-lg font-mono font-black text-white">{selectedCar.topSpeedNum}</span>
                  <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">KM/H</span>
                </div>

                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                  <span className="text-[8px] font-mono text-neutral-500 block uppercase mb-1">0 - 100 km/h</span>
                  <span className="text-lg font-mono font-black text-red-500">{selectedCar.zeroToHundred}</span>
                  <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">SEC</span>
                </div>
              </div>

            </div>

            {/* Simulated Live Exhaust POP warnings */}
            {isThrottleActive && selectedCar.exhaustFlame && (
              <div className="mt-4 flex items-center gap-2 justify-center py-1.5 px-3 bg-red-950/20 border border-red-900/30 rounded-lg">
                <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest animate-pulse">
                  WARNING: EXHAUST SYSTEM SPITTING METALLIC FLAMES
                </span>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: CONTROL PANEL & CAR SELECTION (SPAN 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Studio Studio Customizer Panels */}
          <div className="glass-panel rounded-3xl p-6">
            
            {/* Panel Tabs */}
            <div className="grid grid-cols-3 border-b border-white/5 pb-4 mb-6 gap-2">
              <button 
                onClick={() => setActiveTab('visual')}
                className={`py-2 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-colors ${
                  activeTab === 'visual' 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                1. PAINT & TRIM
              </button>
              <button 
                onClick={() => setActiveTab('aero')}
                className={`py-2 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-colors ${
                  activeTab === 'aero' 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                2. ACTIVE AERO
              </button>
              <button 
                onClick={() => setActiveTab('dyno')}
                className={`py-2 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-colors ${
                  activeTab === 'dyno' 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                3. DIAGNOSTICS
              </button>
            </div>

            {/* TAB: VISUALS (PAINT & WHEELS) */}
            {activeTab === 'visual' && (
              <div className="space-y-6">
                
                {/* Paint Finishes selection */}
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-3">
                    Maranello Premium Paint Swatch
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {paintSwatches.map((paint) => (
                      <button
                        key={paint.name}
                        onClick={() => setPaintColor(paint)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center group ${
                          paintColor.name === paint.name 
                            ? 'border-red-500 bg-red-500/10' 
                            : 'border-white/5 bg-[#0a0a0a] hover:border-white/20'
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full block border border-white/20 shadow-md transform group-hover:scale-105 transition-transform" 
                          style={{ backgroundColor: paint.hex }} 
                        />
                        <span className="text-[8px] font-mono text-neutral-400 group-hover:text-white leading-none block truncate w-full">
                          {paint.name.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wheels selection */}
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-3">
                    Wheel Rim Architecture
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'star', label: 'STAR 5-SPOKE', desc: 'Modern Alloy' },
                      { id: 'wire', label: 'CLASSIC WIRE', desc: 'Vintage Wire' },
                      { id: 'racing', label: 'CARBON LOCK', desc: 'Track Spec' }
                    ].map((wheel) => (
                      <button
                        key={wheel.id}
                        onClick={() => setWheelType(wheel.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                          wheelType === wheel.id 
                            ? 'border-red-500 bg-red-500/10' 
                            : 'border-white/5 bg-[#0a0a0a] hover:border-white/20'
                        }`}
                      >
                        <span className="text-[9px] font-mono font-bold text-white leading-none mb-1">
                          {wheel.label}
                        </span>
                        <span className="text-[8px] font-mono text-neutral-500">
                          {wheel.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: ACTIVE AERODYNAMICS */}
            {activeTab === 'aero' && (
              <div className="space-y-6">
                
                {/* active rear wing toggler */}
                {selectedCar.category !== 'Formula 1' ? (
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-white uppercase block">
                        ACTIVE DRS REAR WING
                      </span>
                      <span className="text-[8px] font-mono text-neutral-500 block mt-1 leading-relaxed">
                        Raises or lowers the rear spoiler to simulate high downforce vs low drag configurations.
                      </span>
                    </div>
                    <button
                      onClick={() => setSpoilerRaised(!spoilerRaised)}
                      className={`px-4 py-2 rounded-lg font-mono text-[9px] font-black uppercase tracking-widest transition-all ${
                        spoilerRaised 
                          ? 'bg-red-500 text-white shadow-md' 
                          : 'bg-[#121212] border border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {spoilerRaised ? 'RAISED' : 'LOWDRAG'}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-[#121212] border border-white/5 rounded-xl text-center">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">
                      FORMULA 1 INTEGRAL DRS
                    </span>
                    <span className="text-[8px] font-mono text-neutral-500 block mt-1 leading-relaxed">
                      F1 chassis uses an integrated drag reduction system active automatically at speeds exceeding 250 km/h.
                    </span>
                  </div>
                )}

                {/* Wind speed selector slider */}
                <div>
                  <div className="flex justify-between items-center mb-2 font-mono text-[9px]">
                    <span className="text-neutral-400">TUNNEL AIRSPEED</span>
                    <span className="text-red-500 font-bold">{windSpeed} KM/H</span>
                  </div>
                  <input 
                    type="range"
                    min="40"
                    max="300"
                    step="10"
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(Number(e.target.value))}
                    disabled={!isWindTunnelActive}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between items-center text-[7px] font-mono text-neutral-600 mt-1">
                    <span>40 KM/H (CITY)</span>
                    <span>300 KM/H (TRACK)</span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: DIAGNOSTICS */}
            {activeTab === 'dyno' && (
              <div className="space-y-4 font-mono text-left">
                
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                  <h4 className="text-[10px] text-white font-bold uppercase tracking-widest border-b border-white/5 pb-1">
                    Chassis Calibration
                  </h4>
                  <div className="space-y-1.5 text-[9px] text-neutral-400">
                    <div className="flex justify-between">
                      <span>WHEELBASE</span>
                      <span className="text-white">{selectedCar.dimensions.split('x')[0] || '4,710 mm'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DRIVE TYPE</span>
                      <span className="text-red-500 font-bold">{selectedCar.driveType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TRANSMISSION</span>
                      <span className="text-white">{selectedCar.transmission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>WEIGHT</span>
                      <span className="text-white">{selectedCar.weight}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                  <h4 className="text-[10px] text-white font-bold uppercase tracking-widest border-b border-white/5 pb-1">
                    Power Output Ratio
                  </h4>
                  <div className="space-y-1 text-[9px] text-neutral-400">
                    <div className="flex justify-between">
                      <span>FUEL CONFIG</span>
                      <span className="text-white">{selectedCar.fuelType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HORSEPOWER</span>
                      <span className="text-emerald-400 font-bold">{selectedCar.horsepower} HP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MAX TORQUE</span>
                      <span className="text-white">{selectedCar.torque}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Model selection list */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
            <div>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                Select Vehicle model
              </span>
              <h4 className="text-sm font-sans font-black uppercase tracking-tight text-white">
                MARANELLO ACTIVE COLLECTION
              </h4>
            </div>

            {/* List of Cars with small thumbnails */}
            <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
              {ferrariModels.map((car) => {
                const isCurrent = car.id === selectedCar.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => selectCar(car)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isCurrent 
                        ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/5' 
                        : 'border-white/5 bg-[#0a0a0a]/50 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Image Thumbnail */}
                      <img 
                        src={car.images[0]} 
                        alt={car.name}
                        className="w-10 h-7 object-cover rounded bg-neutral-900 border border-white/15 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-white block truncate leading-tight">
                          {car.name}
                        </span>
                        <span className="text-[8px] font-mono text-neutral-500 block">
                          {car.year} • {car.category.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${
                      isCurrent ? 'text-red-500 translate-x-0.5' : 'text-neutral-600'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
