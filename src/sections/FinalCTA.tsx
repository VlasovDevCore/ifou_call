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
  onSuccess: () => void;
  colorBtn?: string;
}

const trustItems = [
  { icon: Shield, label: 'Соответствие 152-ФЗ' },
  { icon: Server, label: 'Данные на серверах РФ' },
  { icon: Lock, label: 'Шифрование SSE' },
];

export default function FinalCTA({ phone, setPhone, os, setOs, onSuccess, colorBtn = '#764cfa'}: FinalCTAProps) {
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
      className="relative flex items-center justify-center overflow-hidden pt-20 md:pt-40 pb-12 md:pb-20"
    >
      <div className="relative z-10 mx-auto flex max-w-[700px] flex-col items-center px-4 md:px-6 text-center">
        <h2
          ref={headlineRef}
          className="text-[28px] md:text-[48px] font-bold leading-[36px] md:leading-[52px] tracking-[-0.84px] md:tracking-[-1.44px] text-white px-2 md:px-0"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            verticalAlign: 'middle',
          }}
        >
          Станьте одним из первых пользователей IFOU
        </h2>

        <p
          ref={subRef}
          className="mt-4 md:mt-6 max-w-[500px] text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] text-white px-2 md:px-0"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            verticalAlign: 'middle',
          }}
        >
          Оставьте номер телефона, и мы пришлём вам ссылку на скачивание приложения как только оно будет
          доступно для вашей платформы.
        </p>

        {/* Form */}
        <div ref={formRef} className="mt-8 md:mt-12 w-full max-w-[480px] px-2 md:px-0">
          <EarlyAccessForm
            phone={phone}
            setPhone={setPhone}
            os={os}
            setOs={setOs}
            onSuccess={onSuccess}
            colorBtn={colorBtn}
          />
        </div>

        {/* Trust indicators */}
        <div ref={trustRef} className="mt-8 md:mt-12 flex flex-col md:flex-row flex-wrap justify-center gap-4 md:gap-6">
          {trustItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center justify-center gap-2 text-[12px] md:text-[14px] text-white">
                <Icon size={14} className="text-white md:size-[16px]" />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}