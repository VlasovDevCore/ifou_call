import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrandLogo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <div ref={ref} className="flex h-40 items-center justify-center bg-[#0a0a1a]">
      <div className="flex flex-col items-center gap-3 rounded-[20px] border border-[rgba(118,76,250,0.15)] px-16 py-8">
        <img src="/assets/ifou-logo.jpg" alt="IFOU Logo" className="h-12 w-auto" />
        <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#94a3b8]">
          ООО «Мосзапуск» · Участник МИК
        </span>
      </div>
    </div>
  );
}
