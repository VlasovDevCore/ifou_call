// components/EarlyAccessForm.tsx
import React, { useState, useRef, useEffect } from 'react';

interface EarlyAccessFormProps {
  phone: string;
  setPhone: (v: string) => void;
  os: string;
  setOs: (v: string) => void;
  onSuccess: () => void;
  colorBtn?: string;
}

export default function EarlyAccessForm({ 
  phone, 
  setPhone, 
  os, 
  setOs, 
  onSuccess,
  colorBtn = '#764cfa'
}: EarlyAccessFormProps) {
  const [inputValue, setInputValue] = useState(() => {
    const storedPhone = phone.replace(/^\+7/, '');
    return storedPhone;
  });
  
  const [errors, setErrors] = useState({
    phone: false,
    os: false,
    consent: false,
    privacy: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [consentChecked, setConsentChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  useEffect(() => {
    if (!os) {
      setOs('android');
    }
  }, [os, setOs]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Проверка, заполнена ли форма корректно
  const isFormValid = () => {
    const phonePattern = /^9\d{9}$/;
    const isPhoneValid = phonePattern.test(inputValue);
    const isOsValid = !!os;
    const isConsentValid = consentChecked;
    const isPrivacyValid = privacyChecked;
    
    return isPhoneValid && isOsValid && isConsentValid && isPrivacyValid;
  };

  const validateForm = () => {
    const phonePattern = /^9\d{9}$/;
    const newErrors = {
      phone: !phonePattern.test(inputValue),
      os: !os,
      consent: !consentChecked,
      privacy: !privacyChecked
    };
    setErrors(newErrors);
    return !newErrors.phone && !newErrors.os && !newErrors.consent && !newErrors.privacy;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      const fullPhone = `+7${inputValue}`;
      
      try {
        const response = await fetch('https://ifou.ru/api/save_early_access.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: fullPhone,
            os: os
          })
        });
        
        const data = await response.json();
        
        if (data.success || (data.error && (data.error.includes('уже зарегистрирован') || data.error.includes('24 часа')))) {
          setPhone(fullPhone);
          setInputValue('');
          setErrors({
            phone: false,
            os: false,
            consent: false,
            privacy: false
          });
          onSuccess();
        } else {
          onSuccess();
        }
      } catch (error) {
          onSuccess();      
        } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    
    if (value.length > 10) value = value.slice(0, 10);
    
    if (value.length > 0 && value[0] !== '9') {
      setErrors(prev => ({ ...prev, phone: true }));
    } else if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: false }));
    }
    
    setInputValue(value);
  };

  const handleOsSelect = (selectedOs: string) => {
    setOs(selectedOs);
    if (errors.os) {
      setErrors(prev => ({ ...prev, os: false }));
    }
  };

  const handleConsentChange = (checked: boolean) => {
    setConsentChecked(checked);
    if (errors.consent) {
      setErrors(prev => ({ ...prev, consent: false }));
    }
  };

  const handlePrivacyChange = (checked: boolean) => {
    setPrivacyChecked(checked);
    if (errors.privacy) {
      setErrors(prev => ({ ...prev, privacy: false }));
    }
  };

  const getDisplayValue = () => {
    if (!inputValue) return '';
    
    let result = '';
    const len = inputValue.length;
    
    if (len > 0) {
      result += `(${inputValue.slice(0, Math.min(3, len))}`;
    }
    if (len > 3) {
      result += `) ${inputValue.slice(3, Math.min(6, len))}`;
    }
    if (len > 6) {
      result += `-${inputValue.slice(6, Math.min(8, len))}`;
    }
    if (len > 8) {
      result += `-${inputValue.slice(8, 10)}`;
    }
    
    return result;
  };

  return (
    <div className="w-full max-w-[480px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Сообщение об успехе/ошибке */}
        {successMessage && (
          <div className={`text-center text-sm py-2 px-4 rounded-full ${
            successMessage.includes('✅') 
              ? 'bg-green-500/20 text-green-400'
              : successMessage.includes('ℹ️')
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {successMessage}
          </div>
        )}

        <div className="relative">
          <div 
            className="absolute left-5 top-1/2 -translate-y-1/2 text-base text-[#94a3b8] pointer-events-none"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            +7
          </div>
          <input
            ref={inputRef}
            type="tel"
            value={getDisplayValue()}
            onChange={handlePhoneChange}
            placeholder="(9XX) XXX-XX-XX"
            className={`h-14 w-full rounded-full border bg-[#fff] pl-[52px] pr-5 text-base text-black outline-none transition-all placeholder:text-[#94a3b8]/50 focus:border-[rgba(118,76,250,0.4)] focus:shadow-[0_0_20px_rgba(118,76,250,0.15)] ${
              errors.phone 
                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]' 
                : 'border-gray-200'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        <div className="relative flex gap-1 rounded-full bg-[rgba(255,255,255,0.05)] p-1">
          <div
            className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-out ${
              errors.os ? 'bg-red-500/20' : 'bg-white/20'
            }`}
            style={{
              left: os === 'android' ? '4px' : 'calc(50% + 2px)',
            }}
          />
          
          <button
            type="button"
            onClick={() => handleOsSelect('android')}
            className="relative z-10 flex-1 rounded-full py-3 text-center text-[14px] font-semibold leading-[20px] transition-all duration-300 text-white/70 bg-transparent hover:text-white hover:bg-white/5"
            style={{
              fontWeight: 600,
              lineHeight: '20px',
              fontFamily: 'Inter, sans-serif',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Android
          </button>
          
          <button
            type="button"
            onClick={() => handleOsSelect('ios')}
            className="relative z-10 flex-1 rounded-full py-3 text-center text-[14px] font-semibold leading-[20px] transition-all duration-300 text-white/70 bg-transparent hover:text-white hover:bg-white/5"
            style={{
              fontWeight: 600,
              lineHeight: '20px',
              fontFamily: 'Inter, sans-serif',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            iOS
          </button>
        </div>
        {errors.os && (
          <p className="text-xs text-red-500 text-center -mt-2">
            Выберите операционную систему
          </p>
        )}

        {/* Чекбоксы согласий с красной обводкой */}
        <div className="flex flex-col gap-3 mt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => handleConsentChange(e.target.checked)}
                className="absolute opacity-0 w-5 h-5 cursor-pointer z-10"
              />
              <div className={`
                w-5 h-5 rounded-md border-2 transition-all duration-200 pointer-events-none
                ${consentChecked 
                  ? 'bg-[#764cfa] border-[#764cfa]' 
                  : errors.consent
                  ? 'border-red-500 bg-white/10'
                  : 'bg-white/10 border-gray-400 group-hover:border-[#764cfa]'
                }
              `}>
                {consentChecked && (
                  <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-left text-white leading-relaxed transition-colors group-hover:text-gray-100 flex-1">
              Я даю согласие на обработку моих персональных данных (имя, телефон) для связи со мной в соответствии с{' '}
              <a href="/personal-info" target="_blank" rel="noopener noreferrer" className="relative text-[#fff] underline inline after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#764cfa] after:transition-all after:duration-300 hover:after:w-full">
                Согласием на обработку персональных данных
              </a>
            </span>
          </label>
          
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={privacyChecked}
                onChange={(e) => handlePrivacyChange(e.target.checked)}
                className="absolute opacity-0 w-5 h-5 cursor-pointer z-10"
              />
              <div className={`
                w-5 h-5 rounded-md border-2 transition-all duration-200 pointer-events-none
                ${privacyChecked 
                  ? 'bg-[#764cfa] border-[#764cfa]' 
                  : errors.privacy
                  ? 'border-red-500 bg-white/10'
                  : 'bg-white/10 border-gray-400 group-hover:border-[#764cfa]'
                }
              `}>
                {privacyChecked && (
                  <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-left text-white leading-relaxed transition-colors group-hover:text-gray-100 flex-1">
              Я ознакомлен(а) с{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="relative text-[#fff] underline inline after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#764cfa] after:transition-all after:duration-300 hover:after:w-full">
                Политикой конфиденциальности
              </a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isFormValid()}
          className="relative group h-14 w-full mt-4 rounded-full text-base font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#764cfa] to-[#a78bfa]" />
          
          <div 
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ backgroundColor: colorBtn || '#764cfa' }}
          />
          
          <span className="relative z-10">
            {isLoading ? 'Отправка...' : 'Получить ранний доступ'}
          </span>
        </button>
      </form>
    </div>
  );
}