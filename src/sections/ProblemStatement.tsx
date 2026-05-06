import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const painPoints = ['Боль блогеров', 'Боль бизнеса', 'Боль пользователей'];

export default function ProblemStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

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
    for (let i = 0; i < 80; i++) {
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
      ctx.fillStyle = 'rgba(170, 158, 241, 0.6)';

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

  // Анимация кольца (как в самом начале)
  useEffect(() => {
    if (ringRef.current) {
      gsap.fromTo(ringRef.current,
        { scale: 0.8, opacity: 0.6 },
        {
          scale: 1.2,
          opacity: 0,
          duration: 2,
          repeat: -1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // Scroll animations
  useEffect(() => {
    gsap.fromTo(
      leftRef.current,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
    gsap.fromTo(
      rightRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
    gsap.fromTo(
      pillsRef.current?.children || [],
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        scrollTrigger: { trigger: pillsRef.current, start: 'top 85%' },
      }
    );
  }, []);

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative bg-[#6F43F8] px-6 pb-16 pt-16 md:pt-26 md:pb-24 overflow-hidden md:py-32"
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto flex max-w-[1300px] flex-col items-center gap-16 md:flex-row md:gap-8">
        {/* Left column */}
        <div ref={leftRef} className="flex-1">
          <div className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[rgba(225, 215, 255, 1)]">
            Кризис коммуникаций
          </div>
          <h2 className="text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl lg:text-5xl">
            100+ млн пользователей потеряли привычные платформы
          </h2>
          <p className="mt-6 max-w-[480px] text-base leading-relaxed text-[rgba(213, 214, 233, 1)]">
            70% пользователей без стабильной платформы. Telegram работает нестабильно и требует VPN.
            WhatsApp с ограниченной функциональностью. Instagram и Facebook полностью заблокированы.
          </p>
          <div ref={pillsRef} className="mt-8 flex flex-wrap gap-3">
            {painPoints.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] text-white backdrop-blur-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Right column with animated ring */}
        <div ref={rightRef} className="flex flex-1 items-center justify-center">
          <div className="relative flex w-[300px] h-[300px] items-center justify-center md:h-[400px] md:w-[400px]">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-[240px] h-[240px] md:h-[320px] md:w-[320px] border-2 border-white/40"
            style={{ opacity: 0.4 }}
          />
            <div
              ref={ringRef}
              className="absolute inset-0 rounded-full border-2 border-white/40"
              style={{ opacity: 0.4 }}
            />
            <div className="text-center relative z-20 ">
              <div className="text-6xl font-extrabold tracking-[-0.03em] text-white md:text-7xl">
                70%
              </div>
              <div className="mt-2 max-w-[200px] text-sm text-[rgba(182, 158, 255, 1)]">
                пользователей без стабильной платформы
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}