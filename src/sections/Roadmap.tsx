import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Circle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    date: 'Q2 2026',
    title: 'Мобильное MVP',
    side: 'left' as const,
    completed: true,
    milestones: ['Flutter iOS/Android', 'Чат, лента, истории', '50K пользователей', 'Товарный знак'],
    badge: '50K пользователей',
  },
  {
    date: 'Q4 2026',
    title: 'Десктоп + Web',
    side: 'right' as const,
    completed: true,
    milestones: ['Tauri Windows/macOS', 'React Web + PWA', 'Монетизация + ERID', 'IT Аккредитация, СОРМ'],
    badge: '500K пользователей',
  },
  {
    date: '2027',
    title: 'Масштабирование',
    side: 'left' as const,
    completed: false,
    milestones: ['AI-модерация контента', 'Рекламный кабинет', 'Seed-раунд 80M ₽'],
    badge: '500K — 2M пользователей',
  },
  {
    date: '2028',
    title: 'Безубыточность',
    side: 'right' as const,
    completed: false,
    milestones: ['2M MAU', 'Выход на рынок СНГ', 'EBITDA положительный'],
    badge: '2M пользователей',
  },
  {
    date: '2030',
    title: 'Лидерство',
    side: 'left' as const,
    completed: false,
    milestones: ['Запуск ИИ-ассистента IFO', '6M пользователей', '1890M ₽ выручки', 'Подготовка к exit/IPO'],
    badge: '6M пользователей · 1.89 млрд ₽',
  },
];

const ArrowIcon = () => (
  <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.33333 1L3.60417 6.72917L1 4.125" stroke="#6F43F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

);

export default function Roadmap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
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

  // Линия заполняется сверху вниз до последней точки
// Линия заполняется сверху вниз до последней точки
useEffect(() => {
  if (!lineRef.current || !timelineRef.current) return;

  const line = lineRef.current;
  const timelineContainer = timelineRef.current;
  
  const targetHeight = 1350; 
  
  // Начальная высота 0
  gsap.set(line, { height: 0 });
  
  // Простая анимация линии
  const st = ScrollTrigger.create({
    id: 'roadmap-line',
    trigger: timelineContainer,
    start: 'top 80%',
    end: 'bottom 80%',
    scrub: 1,
    onUpdate: (self) => {
      line.style.height = `${targetHeight * self.progress}px`;
    },
  });
  
  // Анимация появления карточек
  const cards = timelineContainer.querySelectorAll('.timeline-item');
  cards.forEach((card) => {
    gsap.set(card, { 
      opacity: 0, 
      y: 50,
    });
    
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'top 65%',
        scrub: 0.8,
      },
    });
  });
  
  // Анимация точек
  const dots = timelineContainer.querySelectorAll('.timeline-dot');
  dots.forEach((dot) => {
    gsap.set(dot, { scale: 0, opacity: 0 });
    
    gsap.to(dot, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: dot,
        start: 'top 80%',
        end: 'top 60%',
        scrub: 0.5,
      },
    });
  });
  
  return () => {
    st.kill();
  };
}, []);

  return (
    <section id="roadmap" ref={sectionRef} className="relative bg-[rgba(111,67,248,1)] px-6 py-24 overflow-hidden md:py-32">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-[1300px]">
        <div ref={headerRef} className="mb-20 text-center">
          <div className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[rgba(231,223,255,1)]">
            Дорожная карта
          </div>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-5xl">
            5 лет развития: 2026 — 2030
          </h2>
        </div>

        <div ref={timelineRef} className="relative">
          {/* Центральная линия - строго по центру */}
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 w-[2px] -translate-x-1/2 mt-[20px]"
          style={{
            background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.4) 50%, #fff 100%)',
            height: '0px',
            willChange: 'height',
            zIndex: 2,
          }}
        />

        {/* Центральная линия - фоновая (прозрачная) */}
        <div
          className="absolute left-1/2 top-0 h-[calc(100% - 250px )] w-[2px] -translate-x-1/2"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.1) 100%)',
            zIndex: 1,
          }}
        />

          <div className="flex flex-col gap-12 md:gap-16">
            {phases.map((phase, i) => (
              <div
                key={i}
                className={`timeline-item relative flex items-start gap-6 md:gap-0 z-[3] ${
                  phase.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Точка на центральной линии */}
                <div className="timeline-dot absolute w-[20px] h-[20px] left-1/2 top-0 z-10 -translate-x-1/2 mt-[10px]">
                  <div
                    className={`flex w-[20px] h-[20px] items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      phase.completed
                        ? 'border-white bg-white'
                        : 'border-white/50 bg-[#b7a1fc]'
                    }`}
                  >
                    {phase.completed && <ArrowIcon />}
                  </div>
                </div>

                {/* Дата (десктоп) */}
                <div
                  className={`hidden w-1/2 md:block ${
                    phase.side === 'left' ? 'pr-12 text-right' : 'pl-12 text-left'
                  }`}
                >
                  <div
                    className={`text-3xl font-bold tracking-[-0.02em] transition-all duration-300 ${
                      phase.completed ? 'text-white' : 'text-white/70'
                    }`}
                  >
                    {phase.date}
                  </div>
                </div>

                {/* Карточка контента */}
                <div
                  className={`flex-1 ${
                    phase.side === 'left' ? 'ml-8 md:pr-8 md:pl-0' : 'mr-8 md:pl-8 md:pr-0'
                  }`}
                >
                  {/* Дата (мобильная) */}
                  <div className="mb-2 text-xl font-bold text-white/80 md:hidden">
                    {phase.date}
                  </div>
                  <div
                    className="w-full rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] md:max-w-[420px] ml-auto md:ml-0"
                    style={{ 
                      background: phase.completed 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(231, 223, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transform: 'translateZ(0)',
                      marginLeft: phase.side === 'right' ? 'auto' : '0',
                      marginRight: phase.side === 'left' ? 'auto' : '0',
                    }}
                  >
                    <div className="p-6 md:p-8">
                      <h3 className="text-xl font-semibold tracking-[-0.01em] text-white md:text-2xl">
                        {phase.title}
                      </h3>
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {phase.milestones.map((m, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                            {phase.completed ? (
                              <Check size={14} className="mt-0.5 shrink-0 text-white" />
                            ) : (
                              <Circle size={14} className="mt-0.5 shrink-0 text-white/50" />
                            )}
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 w-full rounded-lg bg-white px-4 py-2.5 text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6F43F8]">
                        {phase.badge}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}