import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 'До 500 000 ₽', label: 'для физлиц' },
  { value: 'До 10 000 000 ₽', label: 'для юрлиц' },
  { value: '1 клик', label: 'генерация ERID' },
];

export default function ERID() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null); // Добавлен реф для кольца

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
      ctx.fillStyle = 'rgba(170, 158, 241, 0.4)';

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

  // Анимация кольца (как в ProblemStatement)
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

  useEffect(() => {
    gsap.fromTo(
      shieldRef.current,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
    gsap.fromTo(
      textRef.current?.children || [],
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
    gsap.fromTo(
      pillsRef.current?.children || [],
      { opacity: 0, y: 20 },
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
    <section ref={sectionRef} className="relative bg-[rgba(111,67,248,1)] px-6 py-24 overflow-hidden md:py-32">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto flex max-w-[1300px] flex-col items-center gap-16 md:flex-row md:gap-8">
        {/* Left - Shield with ring */}
        <div ref={shieldRef} className="flex flex-1 items-center justify-center">
          <div className="relative flex h-60 w-60 items-center justify-center md:h-64 md:w-64">
            {/* Статичное кольцо (фон) */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-[240px] h-[240px] md:h-[256px] md:w-[256px] border-2 border-white/40"
              style={{ opacity: 0.4 }}
            />
            {/* Анимированное пульсирующее кольцо */}
            <div
              ref={ringRef}
              className="absolute inset-0 rounded-full border-2 border-white/40"
              style={{ opacity: 0.4 }}
            />
            {/* Текст ERID */}
            <div className="relative text-center z-20">
              <div className="text-5xl font-extrabold text-white md:text-6xl">ERID</div>
            </div>
          </div>
        </div>

        {/* Right - Text */}
        <div ref={textRef} className="flex-1">
          <div className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[rgba(225,215,255,1)]">
            Защита от штрафов
          </div>
          <h2 className="text-2xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-4xl">
            До 10 млн ₽ штрафа без автоматической маркировки
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[rgba(213,214,233,1)]">
            С 1 сентября 2023 года реклама без маркировки ERID карается штрафами до 500 000 ₽ для физлиц
            и до 10 000 000 ₽ для юрлиц. IFOU автоматизирует весь процесс — генерация ERID в один клик,
            интеграция с ОРД, прозрачная статистика.
          </p>
          <div ref={pillsRef} className="mt-8 flex flex-wrap gap-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className="rounded-xl px-5 py-4 backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(231, 223, 255, 0.15)' }}
              >
                <div className="text-lg font-bold text-[#fff]">{s.value}</div>
                <div className="text-xs text-[rgba(213,214,233,1)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}