import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Server, Lock } from 'lucide-react';
import EarlyAccessForm from '../components/ui/EarlyAccessForm'; 

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  phone: string;
  setPhone: (v: string) => void;
  os: string;
  setOs: (v: string) => void;
  onSuccess: () => void; // ← заменили submitted/setSubmitted на onSuccess
}

const trustItems = [
  { icon: Shield, label: 'Соответствие 152-ФЗ' },
  { icon: Server, label: 'Данные на серверах РФ' },
  { icon: Lock, label: 'Шифрование SSE' },
];

export default function FinalCTA({ phone, setPhone, os, setOs, onSuccess }: FinalCTAProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      headlineRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
    gsap.fromTo(
      subRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.3,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.5,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
    gsap.fromTo(
      trustRef.current?.children || [],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden pt-40"
    >
      <div className="relative z-10 mx-auto flex max-w-[700px] flex-col items-center px-6 pb-20 pt-0 text-center">
        <h2
          ref={headlineRef}
          className="text-[48px] font-bold leading-[52px] tracking-[-1.44px] text-white"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            lineHeight: '52px',
            letterSpacing: '-1.44px',
          }}
        >
          Станьте одним из первых пользователей IFOU
        </h2>

        <p
          ref={subRef}
          className="mt-6 max-w-[500px] text-[16px] leading-[26px] text-white"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            lineHeight: '26px',
          }}
        >
          Оставьте номер телефона, и мы пришлём вам ссылку на скачивание приложения как только оно будет
          доступно для вашей платформы.
        </p>

        {/* Form */}
        <div ref={formRef} className="mt-12 w-full max-w-[480px]">
          <EarlyAccessForm
            phone={phone}
            setPhone={setPhone}
            os={os}
            setOs={setOs}
            onSuccess={onSuccess}
          />
        </div>

        {/* Trust indicators */}
        <div ref={trustRef} className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8">
          {trustItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-2 text-[14px] text-white">
                <Icon size={16} className="text-white" />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}