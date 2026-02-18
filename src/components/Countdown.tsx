"use client";

import React, { useState, useEffect } from "react";
import { englishToBangla } from "@/lib/utils";

interface CountdownProps {
  targetTime: Date;
  label?: string;
}

export default function Countdown({ targetTime, label }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = targetTime.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  if (!timeLeft) return null;

  const pad = (n: number) => englishToBangla(n.toString().padStart(2, "0"));

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {label && (
        <p className="text-sm font-semibold font-bengali" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </p>
      )}
      <div className="timer-grid">
        <div className="timer-block">
          <span className="timer-num glow-text">{pad(timeLeft.hours)}</span>
          <span className="timer-lbl">ঘণ্টা</span>
        </div>
        <span className="timer-colon">:</span>
        <div className="timer-block">
          <span className="timer-num glow-text">{pad(timeLeft.minutes)}</span>
          <span className="timer-lbl">মিনিট</span>
        </div>
        <span className="timer-colon">:</span>
        <div className="timer-block">
          <span className="timer-num glow-text">{pad(timeLeft.seconds)}</span>
          <span className="timer-lbl">সেকেন্ড</span>
        </div>
      </div>
    </div>
  );
}
