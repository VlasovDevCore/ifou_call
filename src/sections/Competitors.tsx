import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const columns = ['IFOU', 'Telegram', 'VK'];

const rows = [
  { feature: 'Мессенджер + соцсеть в одном', values: [true, false, true] },
  { feature: 'Встроенная монетизация блогеров', values: [true, false, true] },
  { feature: 'Российские серверы + СОРМ 152-ФЗ', values: [true, false, true] },
  { feature: 'Простой запуск рекламы из приложения', values: [true, false, false] },
  { feature: 'Автоматическая маркировка ERID', values: [true, false, false] },
  { feature: 'Работа без блокировок и VPN', values: [true, false, true] },
  { feature: 'Собственная ИИ-модель', values: [true, false, false] },
  { feature: 'API для интеграций (B2B)', values: [true, true, true] },
];

const ArrowIcon = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.3333 1L3.91667 7.41667L1 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Competitors() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

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
      tableRef.current?.querySelectorAll('.table-row') || [],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        scrollTrigger: { trigger: tableRef.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-[rgba(245,243,255,1)] py-16 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1300px] px-6 md:px-6">
        <div ref={headerRef} className="mb-12 md:mb-16 text-center">
          <div className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[rgba(111,67,248,1)]">
            Конкурентное преимущество
          </div>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[rgba(19,20,29,1)] md:text-5xl px-4 md:px-0">
            IFOU vs Telegram, VK
          </h2>
        </div>
      </div>

      {/* Table with horizontal scroll on mobile */}
      <div className="overflow-x-auto md:overflow-visible" style={{ scrollbarWidth: 'none' }}>
        <div className="mx-auto max-w-[1300px] md:px-6">
          <div className="min-w-[640px] md:min-w-0 px-4 md:px-0">
            {/* Header row */}
            <div className="table-row grid grid-cols-4 gap-0">
              <div className="p-4"></div>
              {columns.map((col, i) => (
                <div
                  key={i}
                  className={`p-4 text-center text-[13px] font-medium uppercase tracking-[0.08em] ${
                    i === 0 ? 'rounded-t-lg text-[rgba(111,67,248,1)]' : 'text-[rgba(148,163,184,1)]'
                  }`}
                  style={i === 0 ? { backgroundColor: 'rgba(118, 76, 250, 0.15)' } : {}}
                >
                  {col}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {rows.map((row, i) => (
              <div
                key={i}
                className="table-row grid grid-cols-4 gap-0 border-t border-[rgba(118,76,250,0.1)]"
                style={i % 2 === 1 ? { backgroundColor: 'rgba(118, 76, 250, 0.03)' } : {}}
              >
                <div className="flex items-center p-4 text-sm text-[rgba(49,49,49,1)]">
                  {row.feature}
                </div>
                {row.values.map((val, j) => (
                  <div key={j} className="flex items-center justify-center p-4">
                    {val ? (
                      j === 0 ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#764cfa]">
                          <ArrowIcon />
                        </div>
                      ) : (
                        <Check size={18} className="text-[#94a3b8]" />
                      )
                    ) : (
                      <X size={18} className="text-[#94a3b8]/40" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary - outside scroll container */}
      <div className="mx-auto max-w-[1300px] px-6 md:px-6 mt-4">
        <div className="pt-5 text-center text-sm leading-relaxed text-[rgba(111,67,248,1)] px-4 md:px-0">
          Единственная платформа с полным набором: мессенджер + соцсеть + монетизация + полное соответствие законодательству РФ
        </div>
      </div>
    </section>
  );
}