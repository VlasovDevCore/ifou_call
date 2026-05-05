// components/SuccessModal.tsx
import React, { useEffect, useState, useRef } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }
  }, [isOpen]);

  // Particle system for canvas
  useEffect(() => {
    if (!shouldRender || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.clientWidth;
    let h = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;

    const particles: { x: number; y: number; vx: number; vy: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Bounce off edges
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > h) { p.y = h; p.vy *= -1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w;
      canvas.height = h;
      
      // Update particles positions
      particles.forEach(p => {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: '100' }}>
      {/* Затемнение фона с блюром */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isAnimating
            ? 'bg-black/50 backdrop-blur-md opacity-100'
            : 'bg-black/0 backdrop-blur-0 opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Модальное окно */}
      <div
        className={`relative w-full max-w-[800px] transition-all duration-300 ${
          isAnimating
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-8'
        }`}
        style={{ height: '386px' }}
      >
        <div
          className="flex h-full relative flex-col justify-center rounded-[20px] border-b border-[rgba(158,141,255,1)] p-[60px] shadow-2xl"
          style={{
            background: 'rgba(158, 141, 255, 1)',
            gap: '24px', 
            overflow: 'hidden'
          }}
        >
          {/* Canvas для частиц */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-auto"
            style={{ width: '100%', height: '100%' }}
          />

          {/* Декоративные SVG */}
          <div className="pointer-events-none absolute right-[0] top-[0px] z-1">
            <svg width="383" height="386" viewBox="0 0 383 386" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M476.129 -326.744C493.473 -78.2869 342.935 -114.964 185.445 -226.756C90.7591 -293.971 10.9475 -177.607 70.5324 -84.5061C137.835 37.9872 290.593 35.4576 406.247 77.518C480.815 117.838 471.105 211.647 387.881 230.313C322.363 242.867 249.607 275.766 246.044 351.826C238.259 461.654 364.468 506.456 454.021 467.179C527.062 450.089 635.083 327.137 696.028 385.775C725.629 414.281 701.574 448.174 696.933 481.077C683.336 561.767 772.943 630.162 847.224 595.76" stroke="#A896FF" stroke-width="100" stroke-miterlimit="10" stroke-linecap="round"/>
            </svg>
          </div> 
          
          <div className="pointer-events-none absolute left-[0] top-[0] z-1">
            <svg width="370" height="386" viewBox="0 0 370 386" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-400.052 -55.3766C-362.74 83.2388 -79.4163 165.136 55.6364 116.537C124.329 91.8051 184.046 31.3242 189.472 -41.4591C194.869 -114.256 130.416 -189.818 57.9755 -180.583C2.72983 -173.547 -37.4448 -124.943 -64.3783 -76.185C-164.369 104.755 -154.158 346.559 -23.2283 506.532C19.1726 558.331 75.6859 602.372 141.77 613.053C207.854 623.733 283.118 593.373 309.495 531.836C339.68 461.426 295.36 375.805 228.456 338.45C161.551 301.095 79.8587 302.159 4.29726 314.845C-91.6295 330.961 -184.625 364.274 -268.959 412.724" stroke="#A896FF" stroke-width="100" stroke-miterlimit="10" stroke-linecap="round"/>
            </svg>
          </div>

          {/* Верхний текст "Вы зарегистрированы" */}
          <p
            className="uppercase z-3 relative"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '13px',
              lineHeight: '19.5px',
              letterSpacing: '1.04px',
              verticalAlign: 'middle',
              color: 'rgba(111, 67, 248, 1)',
              background: 'rgba(111, 67, 248, 1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'left',
            }}
          >
            Вы зарегистрированы
          </p>

          {/* Заголовок "Спасибо за регистрацию!" */}
          <p
            className="font-semibold text-white z-3 relative"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '48px',
              lineHeight: '1.2',
              verticalAlign: 'middle',
              color: 'rgba(255, 255, 255, 1)',
              textAlign: 'left',
            }}
          >
            Спасибо за регистрацию!
          </p>

          {/* Основной текст */}
          <p
            className="text-base text-white z-3 relative"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '16px',
              lineHeight: '22px',
              verticalAlign: 'middle',
              color: 'rgba(255, 255, 255, 1)',
              textAlign: 'left',
            }}
          >
            В день релиза пришлём вам СМС или другой какой‑то текст об уведомлении после релиза.
          </p>

          {/* Кнопка "Супер" с градиентом */}
          <button
            onClick={onClose}
            className="mt-4 w-full z-3 relative rounded-[40px] px-6 py-[18px] text-center text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
            style={{
              fontFamily: 'Inter, sans-serif',
              height: '56px',
              background: 'linear-gradient(90.94deg, #764CFA -5.72%, #A78BFA 112.67%)',
              border: 'none',
            }}
          >
            Супер
          </button>
        </div>
      </div>
    </div>
  );
}