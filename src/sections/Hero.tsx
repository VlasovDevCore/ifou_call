import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import EarlyAccessForm from '../components/ui/EarlyAccessForm'; 

interface HeroProps {
  phone: string;
  setPhone: (v: string) => void;
  os: string;
  setOs: (v: string) => void;
  onSuccess: () => void;
}

export default function Hero({ phone, setPhone, os, setOs, onSuccess }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    // Уменьшаем количество частиц на мобильных
    const particleCount = w < 768 ? 40 : 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.3,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.56)';

      for (const p of particles) {
        p.x += p.vx + Math.sin(p.y * 0.01) * 0.2;
        p.y += p.vy;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        if (p.y < 0) p.y = h;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(labelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9 }, 0.2)
      .fromTo(subRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
      .fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
      .fromTo(statsRef.current?.children || [], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.15 }, 1.2);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[1200px] md:min-h-[1100px] items-center justify-center overflow-hidden px-4 md:px-0"
      style={{
        background: 'rgba(158, 141, 255, 1)',
      }}
    >
      <div
        className="animate-orb-pulse pointer-events-none absolute left-[-200px] top-[-500px] h-[600px] w-[600px] md:h-[1000px] md:w-[1000px] rounded-full"
        style={{
          background: 'radial-gradient(circle, #754cfab6 0%, #a78bfa 50%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.4,
        }}
      />
      <div
        className="animate-orb-pulse pointer-events-none absolute right-[-300px] top-[-500px] h-[600px] w-[600px] md:h-[1000px] md:w-[1000px] rounded-full"
        style={{
          background: 'radial-gradient(circle, #754cfab6 0%, #a78bfa 50%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.3,
          animationDelay: '3s',
        }}
      />

      {/* Декоративные SVG - скрываем на мобильных */}
      <div className="pointer-events-none absolute left-[0] top-[0] opacity-[0.1] md:opacity-[0.2] hidden md:block">
        <svg width="915" height="1261" viewBox="0 0 915 1261" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.65" d="M-996.457 165.033C-870.868 479.646 -184.298 593.64 118.86 442.58C273.054 365.713 396.374 207.531 389.065 35.4531C381.687 -136.649 209.835 -296.015 42.5943 -254.438C-84.9515 -222.748 -165.738 -97.7794 -215.448 23.9074C-400.019 475.496 -309.558 1039.41 41.3227 1378.33C154.951 1488.06 299.521 1575.73 457.344 1582.59C615.166 1589.44 783.213 1497.57 828.104 1346.09C879.477 1172.76 752.045 984.279 584.961 915.137C417.876 845.995 226.702 870.964 53.0957 921.486C-167.298 985.651 -376.089 1089.31 -560.417 1226.07" stroke="url(#paint0_linear_498_12)" strokeWidth="150" strokeMiterlimit="10" strokeLinecap="round"/>
          <defs>
            <linearGradient id="paint0_linear_498_12" x1="398" y1="372.172" x2="-486.052" y2="887.557" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E9E4FF"/>
              <stop offset="1" stopColor="#E0D8FF"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="pointer-events-none absolute right-[0] top-[0] opacity-[0.1] md:opacity-[0.2] hidden md:block">
        <svg width="928" height="963" viewBox="0 0 928 963" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.65" d="M408.138 -197.264C706.092 62.4919 495.824 189.997 193.555 240.885C11.8237 271.476 52.5566 491.687 223.858 529.524C436.774 591.74 605.595 417.69 782.697 335.333C911.679 297.068 1005.91 413.364 933.307 527.615C873.754 615.153 828.87 733.664 910.112 823.127C1024.46 955.268 1216.49 864.16 1273.1 719.656C1336.03 618.589 1319.61 359.359 1453.81 356.946C1519.03 355.803 1529.98 420.848 1561.64 463.024C1636.8 568.935 1814.15 545.362 1859.06 423.452" stroke="url(#paint0_linear_498_13)" strokeWidth="150" strokeMiterlimit="10" strokeLinecap="round"/>
          <defs>
            <linearGradient id="paint0_linear_498_13" x1="659.547" y1="230.172" x2="1731.55" y2="1334.17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E9E4FF"/>
              <stop offset="1" stopColor="#E0D8FF"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div 
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] w-full h-[150px] md:h-[300px]"
        style={{
          background: 'linear-gradient(180deg, rgba(111, 67, 248, 0) 0%, rgba(111, 67, 248, 1) 100%)',
        }}
      />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-[1000px] flex-col items-center px-0 md:px-6 pb-12 md:pb-20 pt-8 md:pt-0 text-center">
        <div 
          ref={labelRef} 
          className="mb-3 md:mb-4 text-[12px] md:text-[14px] font-semibold uppercase tracking-[0.8px] md:tracking-[1.04px] leading-[18px] md:leading-[19.5px] text-[rgba(111,67,248,1)]"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            verticalAlign: 'middle',
          }}
        >
          Social Messenger нового поколения
        </div>

        <h1 
          ref={headlineRef} 
          className="text-[32px] md:text-[60px] font-bold leading-[40px] md:leading-[65px] tracking-[-1px] md:tracking-[-1.8px] text-white"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            verticalAlign: 'middle',
          }}
        >
          IFOU — объединяем общение,<br />творчество
          и заработок
        </h1>

        <p 
          ref={subRef} 
          className="mt-4 md:mt-6 max-w-[700px] text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-[#fff] px-2 md:px-0"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            verticalAlign: 'middle',
          }}
        >
          Гибрид мессенджера и социальной сети с монетизацией контента и автоматической маркировкой рекламы.
          Зарегистрируйтесь первыми — получите доступ к бета-версии.
        </p>

        {/* Registration Form */}
        <div ref={formRef} className="mt-8 md:mt-12 w-full max-w-[480px] px-2 md:px-0">
          <EarlyAccessForm
            phone={phone}
            setPhone={setPhone}
            os={os}
            setOs={setOs}
            onSuccess={onSuccess}
          />
        </div>

        {/* Stats */}
        <div ref={statsRef} className="mt-12 md:mt-16 flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-8 lg:gap-40">
          <div className="text-center">
            <div 
              className="text-[36px] md:text-[48px] font-extrabold leading-[40px] md:leading-[48px] tracking-[-1.08px] md:tracking-[-1.44px] text-[#764cfa]"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                verticalAlign: 'middle',
              }}
            >
              4 продукта
            </div>
            <div 
              className="mt-1 text-[12px] md:text-[14px] leading-[18px] md:leading-[20px] text-[white]"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                verticalAlign: 'middle',
              }}
            >
              в одном приложении
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-[36px] md:text-[48px] font-extrabold leading-[40px] md:leading-[48px] tracking-[-1.08px] md:tracking-[-1.44px] text-[#764cfa]"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                verticalAlign: 'middle',
              }}
            >
              50K+
            </div>
            <div 
              className="mt-1 text-[12px] md:text-[14px] leading-[18px] md:leading-[20px] text-[white]"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                verticalAlign: 'middle',
              }}
            >
              пользователей в Q2 2026
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-[36px] md:text-[48px] font-extrabold leading-[40px] md:leading-[48px] tracking-[-1.08px] md:tracking-[-1.44px] text-[#764cfa]"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                verticalAlign: 'middle',
              }}
            >
              152-ФЗ
            </div>
            <div 
              className="mt-1 text-[12px] md:text-[14px] leading-[18px] md:leading-[20px] text-[white]"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                verticalAlign: 'middle',
              }}
            >
              полное соответствие
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}