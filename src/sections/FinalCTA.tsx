import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EarlyAccessForm from '../components/ui/EarlyAccessForm';

gsap.registerPlugin(ScrollTrigger);

// Кастомная иконка ракеты
const RocketIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_1715_3309)">
      <path
        d="M8.51066 5.31925C8.65336 5.17655 8.82278 5.06335 9.00923 4.98612C9.19568 4.90889 9.39551 4.86914 9.59733 4.86914C9.79914 4.86914 9.99897 4.90889 10.1854 4.98612C10.3719 5.06335 10.5413 5.17655 10.684 5.31925C10.8267 5.46196 10.9399 5.63137 11.0171 5.81782C11.0944 6.00427 11.1341 6.20411 11.1341 6.40592C11.1341 6.60773 11.0944 6.80757 11.0171 6.99402C10.9399 7.18047 10.8267 7.34988 10.684 7.49259C10.3958 7.78079 10.0049 7.9427 9.59733 7.9427C9.18975 7.9427 8.79886 7.78079 8.51066 7.49259C8.22246 7.20438 8.06055 6.8135 8.06055 6.40592C8.06055 5.99834 8.22246 5.60745 8.51066 5.31925ZM9.97666 6.02592C9.92676 5.97606 9.86752 5.93652 9.80234 5.90955C9.73716 5.88259 9.6673 5.86872 9.59676 5.86875C9.52622 5.86879 9.45637 5.88271 9.39121 5.90973C9.32605 5.93676 9.26685 5.97635 9.21699 6.02625C9.1163 6.12704 9.05976 6.26369 9.05983 6.40616C9.05986 6.4767 9.07378 6.54654 9.10081 6.6117C9.12783 6.67686 9.16742 6.73606 9.21733 6.78592C9.31811 6.88661 9.45476 6.94315 9.59723 6.94308C9.73969 6.94302 9.8763 6.88637 9.97699 6.78559C10.0777 6.6848 10.1342 6.54815 10.1342 6.40568C10.1341 6.26322 10.0774 6.12661 9.97666 6.02592Z"
        fill="currentColor"
      />
      <path
        d="M15.9288 0.636068C15.9124 0.492016 15.8476 0.357788 15.7451 0.255265C15.6426 0.152742 15.5083 0.08797 15.3643 0.0715088C13.7416 -0.115903 12.0975 0.0662213 10.5551 0.604244C9.01271 1.14227 7.61204 2.02225 6.45795 3.17829C5.89739 3.73794 5.39973 4.35722 4.97384 5.02508C3.52253 5.08112 2.14604 5.68366 1.1203 6.71192C0.699395 7.13329 0.345702 7.6168 0.0715896 8.14555C0.0161737 8.2528 -0.00785817 8.37351 0.00225591 8.4938C0.01237 8.6141 0.0562195 8.7291 0.128765 8.82559C0.201311 8.92208 0.299609 8.99614 0.412362 9.03926C0.525115 9.08239 0.647748 9.09283 0.766168 9.06938C1.78625 8.86611 2.84373 8.97031 3.80452 9.36876L6.62902 12.1916C7.02782 13.1529 7.13203 14.211 6.92841 15.2316C6.90488 15.35 6.91522 15.4726 6.95823 15.5854C7.00124 15.6981 7.07519 15.7965 7.17158 15.8691C7.26796 15.9417 7.38288 15.9857 7.50313 15.9959C7.62338 16.0062 7.74409 15.9823 7.85138 15.9271C8.38049 15.6528 8.8643 15.2988 9.28587 14.8775C10.3137 13.8522 10.9162 12.4764 10.9727 11.0257C11.6412 10.5993 12.2611 10.1011 12.8212 9.53984C13.977 8.38611 14.857 6.98589 15.3951 5.444C15.9333 3.9021 16.1157 2.25845 15.9288 0.636068ZM9.58697 11.7716C9.39655 12.6372 8.95183 13.4263 8.30987 14.0375C8.29484 13.458 8.20337 12.8831 8.03785 12.3276C8.56735 12.1819 9.08495 11.9961 9.58611 11.7716M3.67022 7.95993C3.1145 7.79376 2.53927 7.70172 1.95944 7.68621L2.02702 7.61863C2.62976 7.01418 3.39286 6.59479 4.22623 6.40996C4.0004 6.91521 3.81507 7.43187 3.67022 7.95993ZM7.36466 4.08501C8.31981 3.12769 9.46761 2.38442 10.7319 1.90454C11.9962 1.42465 13.3481 1.21912 14.6979 1.30156C14.7799 2.65101 14.574 4.00246 14.094 5.2663C13.614 6.53014 12.8708 7.67749 11.9136 8.63227C10.6757 9.87457 9.11864 10.7508 7.41427 11.1642L4.83356 8.58351C5.24581 6.87936 6.12188 5.32263 7.36466 4.08586"
        fill="currentColor"
      />
      <path
        d="M2.01999 13.4998C2.02446 13.6261 2.07658 13.7461 2.16588 13.8355C2.25518 13.9249 2.37504 13.9772 2.50133 13.9818H2.52266C2.5993 13.9844 2.67599 13.9851 2.75266 13.9838C2.90066 13.9818 3.10466 13.9752 3.32399 13.9545C3.54133 13.9345 3.78799 13.8992 4.01733 13.8365C4.23066 13.7778 4.49799 13.6765 4.69266 13.4818C4.83536 13.3391 4.94856 13.1697 5.02579 12.9833C5.10302 12.7968 5.14277 12.597 5.14277 12.3952C5.14277 12.1934 5.10302 11.9935 5.02579 11.8071C4.94856 11.6206 4.83536 11.4512 4.69266 11.3085C4.54996 11.1658 4.38054 11.0526 4.19409 10.9754C4.00764 10.8981 3.80781 10.8584 3.60599 10.8584C3.19841 10.8584 2.80753 11.0203 2.51933 11.3085C2.32466 11.5032 2.22399 11.7705 2.16533 11.9845C2.10549 12.2117 2.06578 12.4437 2.04666 12.6778C2.02317 12.9443 2.01426 13.2118 2.01999 13.4792V13.4998ZM3.22666 12.0158C3.32727 11.9151 3.46375 11.8585 3.60609 11.8585C3.74843 11.8584 3.88497 11.9149 3.98566 12.0155C4.08635 12.1161 4.14296 12.2526 4.14302 12.3949C4.14308 12.5373 4.0866 12.6738 3.98599 12.7745C3.96821 12.7885 3.94872 12.8001 3.92799 12.8092C3.87108 12.8354 3.81196 12.8566 3.75133 12.8725C3.58055 12.9151 3.40668 12.9441 3.23133 12.9592C3.16111 12.9658 3.09311 12.971 3.02733 12.9745C3.03088 12.9087 3.03599 12.8407 3.04266 12.7705C3.05999 12.5838 3.08799 12.4005 3.12933 12.2505C3.14977 12.1754 3.17066 12.1165 3.19199 12.0738C3.20104 12.0531 3.21269 12.0336 3.22666 12.0158Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_1715_3309">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// Кастомная иконка кружочка с перечёркнутой линией (закрыто)
const CircleSlashIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM1.33117 8C1.33117 11.6831 4.3169 14.6688 8 14.6688C11.6831 14.6688 14.6688 11.6831 14.6688 8C14.6688 4.3169 11.6831 1.33117 8 1.33117C4.3169 1.33117 1.33117 4.3169 1.33117 8Z"
      fill="currentColor"
    />
    <path
      d="M3.07666 2.99902L12.832 12.9352"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

// Иконка закрытого замка из lucide-react (кастомная SVG)
const LockIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

interface FinalCTAProps {
  phone: string;
  setPhone: (v: string) => void;
  os: string;
  setOs: (v: string) => void;
  onSuccess: () => void;
  colorBtn?: string;
}

const trustItems = [
  { icon: RocketIcon, label: 'Быстрый запуск' },
  { icon: CircleSlashIcon, label: 'Закрыто' },
  { icon: LockIcon, label: 'Есть шифрование' },
];

export default function FinalCTA({ 
  phone, 
  setPhone, 
  os, 
  setOs, 
  onSuccess, 
  colorBtn = '#764cfa'
}: FinalCTAProps) {
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