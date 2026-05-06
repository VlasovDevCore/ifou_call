import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const screenshots = [
  { src: '/assets/screen-splash.png', label: 'Экран загрузки', rotate: '-3deg' },
  { src: '/assets/screen-login.png', label: 'Регистрация', rotate: '2deg' },
  { src: '/assets/screen-chat.png', label: 'Чаты', rotate: '-2deg' },
  { src: '/assets/screen-feed.png', label: 'Лента', rotate: '3deg' },
  { src: '/assets/screen-profile.png', label: 'Профиль', rotate: '-1deg' },
  { src: '/assets/screen-videocall.png', label: 'Видеозвонки', rotate: '2deg' },
];

export default function Screenshots() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

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
      galleryRef.current?.children || [],
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: { trigger: galleryRef.current, start: 'top 75%' },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-[rgba(245,243,255,1)] py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-6">
        <div ref={headerRef} className="mb-8 md:mb-16 text-center">
          <div className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[rgba(111,67,248,1)]">
            Мобильное приложение
          </div>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[rgba(19,20,29,1)] md:text-5xl">
            Красивый. Мощный. Интуитивный.
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-base text-[rgba(69,66,94,1)] px-4 md:px-0">
            Ознакомьтесь с интерфейсом IFOU — от авторизации до видеозвонков.
          </p>
        </div>
      </div>

      {/* Mobile horizontal scroll */}
      <div
        ref={galleryRef}
        className="flex snap-x snap-mandatory gap-20 mb:gap-6 overflow-x-auto py-8 md:hidden"
        style={{ 
          scrollbarWidth: 'none',
          paddingLeft: 'calc((100% - 180px) / 2)',
          paddingRight: 'calc((100% - 180px) / 2)',
        }}
      >
        {screenshots.map((s, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-center"
            style={{ transform: `rotate(${s.rotate})`, marginTop: i % 2 === 0 ? '0' : '20px' }}
          >
            <div className="phone-mockup w-[180px]">
              <img src={s.src} alt={s.label} className="h-auto w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-6 gap-10">
          {screenshots.map((s, i) => (
            <div
              key={i}
              style={{ transform: `rotate(${s.rotate})`, marginTop: i % 2 === 0 ? '0' : '24px' }}
            >
              <div className="phone-mockup w-full">
                <img src={s.src} alt={s.label} className="h-auto w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}