import { useState, useEffect, useRef } from 'react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
// import BrandLogo from './sections/BrandLogo';
import ProblemStatement from './sections/ProblemStatement';
import Screenshots from './sections/Screenshots';
import Features from './sections/Features';
import ERID from './sections/ERID';
import TechStack from './sections/TechStack';
import Roadmap from './sections/Roadmap';
import RoadmapMobile from './sections/RoadmapMobile';
import Competitors from './sections/Competitors';
import FinalCTA from './sections/FinalCTA';
import Footer from './sections/Footer';
import SuccessModal from './components/ui/SuccessModal';

export default function App() {
  const [phone, setPhone] = useState('');
  const [os, setOs] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMobileRoadmap, setShowMobileRoadmap] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Определяем, какую версию Roadmap показывать
  useEffect(() => {
    const checkScreenSize = () => {
      setShowMobileRoadmap(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Particle system для фиолетового блока
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.clientWidth;
    let h = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.2 - Math.random() * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', onMouseMove);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Взаимодействие с мышью
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.3;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Сброс частиц
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w;
      canvas.height = h;
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
    };
  }, []);

  const handleFormSuccess = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      <Navigation />
      <Hero
        phone={phone}
        setPhone={setPhone}
        os={os}
        setOs={setOs}
        onSuccess={handleFormSuccess}
      />
      {/* <BrandLogo /> */}
      <ProblemStatement />
      <Screenshots />
      <Features />
      <ERID />
      <TechStack />
      
      {/* Условный рендеринг Roadmap */}
      {!showMobileRoadmap && <Roadmap />}
      {showMobileRoadmap && <RoadmapMobile />}
      
      <Competitors />
      <div 
        className="relative bg-[rgba(111,67,248,1)]"
        style={{ overflow: 'hidden' }}
      >
        {/* Canvas с частицами для этого блока */}
        <canvas 
          ref={canvasRef} 
          className="pointer-events-none absolute inset-0 z-0"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* SVG декорации */}
        <div className="pointer-events-none absolute right-[-600px] top-[0] hidden md:block">
          <svg width="1400" height="1659" viewBox="0 0 1400 1659" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.08" d="M1324.76 244.858C1077.58 474.045 716.637 448.174 700.791 187.266C691.268 30.402 500.859 45.0487 453.3 186.887C381.309 361.81 513.646 520.687 567.483 678.301C588.278 791.13 481.152 860.525 390.83 788.642C321.982 730.236 225.544 681.47 142.344 742.279C19.9646 827.3 79.872 998.37 197.292 1059.43C277.308 1121.91 498.607 1131.41 488.53 1245.43C483.608 1300.83 427.463 1304.24 388.839 1327.28C292.242 1381.44 296.209 1533.95 395.527 1583.05" stroke="url(#paint0_linear_498_528)" strokeWidth="150" strokeMiterlimit="10" strokeLinecap="round"/>
            <defs>
              <linearGradient id="paint0_linear_498_528" x1="667.78" y1="583.375" x2="-365.206" y2="1392.66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E9E4FF"/>
                <stop offset="1" stopColor="#E0D8FF"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="pointer-events-none absolute left-[-900px] top-[-400px] hidden md:block">
          <svg width="1614" height="1886" viewBox="0 0 1614 1886" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.08" d="M75.0137 270.199C132.755 575.335 730.484 798.493 1029.79 715.821C1182.03 673.743 1320.77 553.076 1344.42 396.963C1368.01 240.815 1241.37 67.24 1083.59 75.2743C963.264 81.386 868.625 179.639 802.525 280.397C557.137 654.301 539.483 1177.58 795.666 1544.15C878.63 1662.85 993.31 1767.12 1134.11 1801.01C1274.91 1834.89 1442.25 1781.75 1509.25 1653.34C1585.91 1506.41 1504.36 1314.44 1366.17 1222.88C1227.97 1131.32 1051.58 1120.21 886.499 1135.17C676.926 1154.2 470.856 1210.8 280.984 1301.47" stroke="url(#paint0_linear_498_527)" strokeWidth="150" strokeMiterlimit="10" strokeLinecap="round"/>
            <defs>
              <linearGradient id="paint0_linear_498_527" x1="1293.31" y1="701.499" x2="407.353" y2="1009.95" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E9E4FF"/>
                <stop offset="1" stopColor="#E0D8FF"/>
              </linearGradient>
            </defs>
          </svg>
        </div> 

        <FinalCTA
          phone={phone}
          setPhone={setPhone}
          os={os}
          setOs={setOs}
          onSuccess={handleFormSuccess}
          colorBtn="rgba(167,139,250,1)" 
        />
        <Footer         />
      </div>
      
      {/* Модальное окно на уровне App */}
      <SuccessModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}