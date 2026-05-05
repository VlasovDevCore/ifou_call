import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smartphone, Video, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const techs = [
  {
    icon: Smartphone,
    title: 'Flutter',
    description: 'Единая кодовая база для iOS, Android, Web и Desktop. Быстрый time-to-market.',
    stat: 'Экономия 40%',
  },
  {
    icon: Video,
    title: 'WebRTC',
    description: 'P2P коммуникации без серверных затрат. Аудио/видео и групповые звонки до 8 участников.',
    stat: 'Без серверных затрат',
  },
  {
    icon: Shield,
    title: 'СОРМ',
    description: 'Полное соответствие 152-ФЗ. Хранение данных на серверах РФ. Лицензии и сертификация.',
    stat: 'Данные в РФ',
  },
];

export default function TechStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current?.children || [],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
    gsap.fromTo(
      gridRef.current?.children || [],
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.2,
        scrollTrigger: { trigger: gridRef.current, start: 'top 75%' },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-[rgba(245,243,255,1)] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div ref={headerRef} className="mb-16 text-center">
          <div className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[rgba(111,67,248,1)]">
            Технологии
          </div>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[rgba(19,20,29,1)] md:text-5xl">
            Flutter, WebRTC, СОРМ — экономия 40% на разработке
          </h2>
        </div>

        <div ref={gridRef} className="grid gap-6 md:grid-cols-3">
          {techs.map((t, i) => {
            const Icon = t.icon;
            return (
              <div
                key={i}
                className="flex min-h-[320px] flex-col rounded-2xl border border-[rgba(223,213,255,1)] p-8 transition-all duration-300 hover:border-[rgba(118,76,250,0.4)] hover:shadow-[0_0_40px_rgba(118,76,250,0.1)]"
                style={{ background: 'rgba(233, 228, 255, 1)' }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(118, 76, 250, 0.1)' }}>
                  <Icon className="text-[#764cfa]" size={36} />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.01em] text-black">
                  {t.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[rgba(26,26,46,1)]">
                  {t.description}
                </p>
                <div className="mt-auto pt-6">
                  <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[rgba(111,67,248,1)]">
                    {t.stat}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
