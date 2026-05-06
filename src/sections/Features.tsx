import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Users, TrendingUp, Megaphone, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: MessageCircle,
    title: 'Мессенджер',
    subtitle: 'Замена Telegram + WhatsApp',
    items: ['Чаты, группы, каналы', 'Файлы до 100 МБ', 'Аудио/видео звонки', 'SSE, Key Escrow шифрование'],
  },
  {
    icon: Users,
    title: 'Социальная сеть',
    subtitle: 'Замена Instagram + TikTok',
    items: ['Лента: Мир / Подписки / Друзья', 'Истории 24ч', 'Reels, посты, лайки', 'Профили с рекомендациями'],
  },
  {
    icon: TrendingUp,
    title: 'Монетизация',
    subtitle: 'Заработок для блогеров и бизнеса',
    items: ['Оплата за просмотры Reels', 'Прямая реклама', 'Платный контент', 'Premium-подписки'],
  },
  {
    icon: Megaphone,
    title: 'Простая реклама',
    subtitle: 'Как в Instagram до блокировок',
    items: ['Запуск кампаний в 3 клика', 'Таргетированные объявления', 'Рекламные истории', 'Автоматическая маркировка ERID'],
  },
];

export default function Features() {
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
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <section id="features" ref={sectionRef} className="bg-[rgba(245,243,255,1)] px-6 pb-24 md:pb-32">
      <div className="mx-auto max-w-[1300px]">
        <div ref={headerRef} className="mb-16 text-center">
          <div className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[rgba(111,67,248,1)]">
            4 продукта в одном приложении
          </div>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[rgba(19,20,29,1)] md:text-5xl">
            Единая экосистема
          </h2>
        </div>

        {/* 4 колонки в ряд */}
        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group flex flex-col rounded-2xl border border-[rgba(223,213,255,1)] bg-[rgba(233,228,255,1)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(111,67,248,0.15)]">
                  <Icon className="text-[#6F43F8]" size={24} />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-[#13141D]">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm text-[#4a5568]">{f.subtitle}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {f.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[#4a5568]">
                      <Check className="mt-0.5 shrink-0 text-[#6F43F8]" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}