'use client';

import { useState, useEffect } from 'react';
import { englishToBangla } from '@/lib/utils';

interface Props {
  targetTime: Date;
  label: string;
}

export default function Countdown({ targetTime, label }: Props) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        window.location.reload();
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const totalMinutes = timeLeft.hours * 60 + timeLeft.minutes;
  const isGlowing = totalMinutes < 10;

  return (
    <div className={`premium-card p-6 flex flex-col items-center justify-center transition-all duration-500 ${isGlowing ? 'animate-glow ring-2 ring-primary-gold' : ''}`}>
      {label && <p className="text-xs font-black text-emerald-900/40 uppercase tracking-widest mb-4 font-bengali">{label}</p>}
      <div className="flex justify-center items-center gap-2 sm:gap-4">
        <TimeUnit value={timeLeft.hours} label="ঘণ্টা" />
        <span className="text-2xl font-black text-primary-gold mb-6">:</span>
        <TimeUnit value={timeLeft.minutes} label="মিনিট" />
        <span className="text-2xl font-black text-primary-gold mb-6">:</span>
        <TimeUnit value={timeLeft.seconds} label="সেকেন্ড" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const formatted = value.toString().padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
      <div className="bg-gold-gradient w-full py-3 rounded-2xl border border-primary-gold/20 flex items-center justify-center shadow-inner">
        <span className="text-2xl sm:text-3xl font-black text-emerald-900 tabular-nums">
          {englishToBangla(formatted)}
        </span>
      </div>
      <span className="text-[10px] font-black text-emerald-900/40 uppercase tracking-tighter font-bengali">{label}</span>
    </div>
  );
}
