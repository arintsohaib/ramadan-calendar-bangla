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
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl text-center border border-white/20">
      <p className="text-gray-600 mb-2 font-medium">{label}</p>
      <div className="flex justify-center gap-4">
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-green-700">{englishToBangla(pad(timeLeft.hours))}</span>
          <span className="text-xs text-gray-400">ঘণ্টা</span>
        </div>
        <span className="text-4xl font-bold text-green-200">:</span>
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-green-700">{englishToBangla(pad(timeLeft.minutes))}</span>
          <span className="text-xs text-gray-400">মিনিট</span>
        </div>
        <span className="text-4xl font-bold text-green-200">:</span>
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-green-700">{englishToBangla(pad(timeLeft.seconds))}</span>
          <span className="text-xs text-gray-400">সেকেন্ড</span>
        </div>
      </div>
    </div>
  );
}
