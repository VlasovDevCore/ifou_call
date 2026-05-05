import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Circle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ArrowIcon = () => (
  <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.33333 1L3.60417 6.72917L1 4.125" stroke="#6F43F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

const phases = [
  {
    date: 'Q2 2026',
    title: 'Мобильное MVP',
    completed: true,
    milestones: ['Flutter iOS/Android', 'Чат, лента, истории', '50K пользователей', 'Товарный знак'],
    badge: '50K пользователей',
  },
  {
    date: 'Q4 2026',
    title: 'Десктоп + Web',
    completed: true,
    milestones: ['Tauri Windows/macOS', 'React Web + PWA', 'Монетизация + ERID', 'IT Аккредитация, СОРМ'],
    badge: '500K пользователей',
  },
  {
    date: '2027',
    title: 'Масштабирование',
    completed: false,
    milestones: ['AI-модерация контента', 'Рекламный кабинет', 'Seed-раунд 80M ₽'],
    badge: '500K — 2M пользователей',
  },
  {
    date: '2028',
    title: 'Безубыточность',
    completed: false,
    milestones: ['2M MAU', 'Выход на рынок СНГ', 'EBITDA положительный'],
    badge: '2M пользователей',
  },
  {
    date: '2030',
    title: 'Лидерство',
    completed: false,
    milestones: ['Запуск ИИ-ассистента IFO', '6M пользователей', '1890M ₽ выручки', 'Подготовка к exit/IPO'],
    badge: '6M пользователей · 1.89 млрд ₽',
  },
];

export default function RoadmapMobile() {
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
    for (let i = 0; i < 60; i++) {
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

  // Анимация появления элементов при скролле
  useEffect(() => {
    if (!lineRef.current || !timelineRef.current) return;

    const line = lineRef.current;
    const timelineContainer = timelineRef.current;
    
    const targetHeight = 1100;
    
    gsap.set(line, { height: 0 });
    
    // Анимация линии
    const st = ScrollTrigger.create({
      id: 'roadmap-line-mobile',
      trigger: timelineContainer,
      start: 'top 80%',
      end: 'bottom 80%',
      scrub: 1,
      onUpdate: (self) => {
        line.style.height = `${targetHeight * self.progress}px`;
      },
    });
    
    // Анимация карточек
    const cards = timelineContainer.querySelectorAll('.timeline-card');
    cards.forEach((card, index) => {
      gsap.set(card, { 
        opacity: 0, 
        x: -50,
      });
      
      gsap.to(card, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 65%',
          scrub: 0.5,
        },
      });
    });
    
    return () => {
      st.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[rgba(111,67,248,1)] px-5 py-20 overflow-hidden">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10">
        <div ref={headerRef} className="mb-12 text-center">
          <div className="mb-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[rgba(231,223,255,0.9)]">
            Дорожная карта
          </div>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-white">
            5 лет развития: 2026 — 2030
          </h2>
        </div>

        <div ref={timelineRef} className="relative pl-6">
          {/* Вертикальная линия слева */}
          <div
            ref={lineRef}
            className="absolute left-[11px] top-2 w-[2px]"
            style={{
              background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.4) 50%, #fff 100%)',
              height: '0px',
              willChange: 'height',
              zIndex: 0,
            }}
          />

          {/* Фоновая линия */}
          <div
            className="absolute left-[11px] top-2 h-[calc(100%-260px)] w-[2px]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.1) 100%)',
              zIndex: 0,
            }}
          />

          <div className="flex flex-col gap-8">
            {phases.map((phase, i) => (
              <div
                key={i}
                className="timeline-card relative"
              >
                {/* Точка на линии */}
                <div className="absolute left-[-12px] top-1 z-[99] -translate-x-1/2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      phase.completed
                        ? 'border-white bg-white'
                        : 'border-white/50 bg-[#b7a1fc]'
                    }`}
                  >
                    {phase.completed && (
                      <ArrowIcon />
                    )}
                  </div>
                </div>

                {/* Карточка */}
                <div className="ml-6">
                  {/* Дата */}
                  <div className="mb-1 text-lg font-bold text-white">
                    {phase.date}
                  </div>
                  
                  <div
                    className="w-full rounded-2xl backdrop-blur-sm transition-all duration-500"
                    style={{ 
                      background: phase.completed 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(231, 223, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div className="p-5">
                      <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">
                        {phase.title}
                      </h3>
                      
                      <ul className="mt-3 flex flex-col gap-2">
                        {phase.milestones.map((m, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                            {phase.completed ? (
                              <ArrowIcon />
                            ) : (
                              <Circle size={12} className="mt-0.5 shrink-0 text-white/50" />
                            )}
                            <span className="text-xs md:text-sm">{m}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-4 w-full rounded-lg bg-white px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6F43F8]">
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