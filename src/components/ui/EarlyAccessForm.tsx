// components/EarlyAccessForm.tsx
import React, { useState, useRef, useEffect } from 'react';

interface EarlyAccessFormProps {
  phone: string;
  setPhone: (v: string) => void;
  os: string;
  setOs: (v: string) => void;
  onSuccess: () => void;
  colorBtn?: string; // Добавляем опциональный пропс для цвета
}

export default function EarlyAccessForm({ 
  phone, 
  setPhone, 
  os, 
  setOs, 
  onSuccess,
  colorBtn = '#764cfa' // Значение по умолчанию
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
  const [successMessage, setSuccessMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!os) {
      setOs('android');
    }
  }, [os, setOs]);

  // Автоматически скрываем сообщение через 3 секунды
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const validateForm = () => {
    const phonePattern = /^9\d{9}$/;
    const newErrors = {
      phone: !phonePattern.test(inputValue),
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
        
        // Успешная отправка или номер уже существует
        if (data.success || (data.error && (data.error.includes('уже зарегистрирован') || data.error.includes('24 часа')))) {
          setPhone(fullPhone);
          
          // Очищаем поле ввода
          setInputValue('');
          
          // Очищаем ошибки
          setErrors({
            phone: false,
            os: false
          });
          
          // Вызываем колбэк успеха в обоих случаях
          onSuccess();
        } else {
          // Показываем сообщение об ошибке
          setSuccessMessage('❌ ' + (data.error || 'Произошла ошибка. Попробуйте позже.'));
        }
      } catch (error) {
        console.error('Error:', error);
        // Показываем сообщение об ошибке
        setSuccessMessage('❌ Ошибка сети. Проверьте подключение к интернету.');
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

    <button
      type="submit"
      disabled={isLoading}
      className="relative group h-14 w-full mt-4 rounded-full text-base font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Градиент по умолчанию */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#764cfa] to-[#a78bfa]" />
      
      {/* Ховер градиент - используем переданный цвет */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: colorBtn || '#764cfa' }}  // используем colorBtn с fallback
      />
      
      <span className="relative z-10">
        {isLoading ? 'Отправка...' : 'Получить ранний доступ'}
      </span>
    </button>
      </form>
    </div>
  );
}