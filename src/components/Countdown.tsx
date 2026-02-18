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

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="glass-card p-6 rounded-[32px] text-center">
      {label && <p className="text-emerald-800 font-bold mb-3 font-bengali text-sm">{label}</p>}
      <div className="flex justify-center items-center gap-4">
        <TimeUnit value={timeLeft.hours} label="ঘণ্টা" />
        <span className="text-2xl font-black text-emerald-200/50 mb-6">:</span>
        <TimeUnit value={timeLeft.minutes} label="মিনিট" />
        <span className="text-2xl font-black text-emerald-200/50 mb-6">:</span>
        <TimeUnit value={timeLeft.seconds} label="সেকেন্ড" isLast />
      </div>
    </div>
  );
}

function TimeUnit({ value, label, isLast = false }: { value: number, label: string, isLast?: boolean }) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="bg-emerald-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-900/20 mb-2">
        {englishToBangla(pad(value))}
      </div>
      <span className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest font-bengali">{label}</span>
    </div>
  );
}
