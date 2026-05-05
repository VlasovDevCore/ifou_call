// components/EarlyAccessForm.tsx
import React, { useState, useRef, useEffect } from 'react';

interface EarlyAccessFormProps {
  phone: string;
  setPhone: (v: string) => void;
  os: string;
  setOs: (v: string) => void;
  onSuccess: () => void;
}

export default function EarlyAccessForm({ 
  phone, 
  setPhone, 
  os, 
  setOs, 
  onSuccess
}: EarlyAccessFormProps) {
  const [inputValue, setInputValue] = useState(() => {
    const storedPhone = phone.replace(/^\+7/, '');
    return storedPhone;
  });
  
  const [errors, setErrors] = useState({
    phone: false,
    os: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Устанавливаем Android по умолчанию при монтировании компонента
  useEffect(() => {
    if (!os) {
      setOs('android');
    }
  }, [os, setOs]);

  const validateForm = () => {
    const newErrors = {
      phone: inputValue.length < 10,
      os: !os
    };
    setErrors(newErrors);
    return !newErrors.phone && !newErrors.os;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      const fullPhone = `+7${inputValue}`;
      
      try {
        // Отправляем данные на сервер
        const response = await fetch('/api/save_early_access.php', {
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
        
        if (data.success) {
          setPhone(fullPhone);
          onSuccess();
        } else {
          // Показываем ошибку пользователю
          alert(data.error || 'Произошла ошибка. Пожалуйста, попробуйте снова.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Ошибка сети. Проверьте подключение к интернету.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    setInputValue(value);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: false }));
    }
  };

  const handleOsSelect = (selectedOs: string) => {
    setOs(selectedOs);
    if (errors.os) {
      setErrors(prev => ({ ...prev, os: false }));
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
            placeholder="(000) 000-00-00"
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

        <button
          type="submit"
          disabled={isLoading}
          className="h-14 w-full mt-4 rounded-full text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(118,76,250,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(90deg, #764cfa, #a78bfa)', fontFamily: 'Inter, sans-serif' }}
        >
          {isLoading ? 'Отправка...' : 'Получить ранний доступ'}
        </button>
      </form>
    </div>
  );
}