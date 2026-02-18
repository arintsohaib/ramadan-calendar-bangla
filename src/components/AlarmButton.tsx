'use client';

import { englishToBangla, parseDate } from '@/lib/utils';

interface Props {
  timing: {
    ramadan: string;
    gregorian: string;
    sehri: string;
    iftar: string;
  };
}

export default function AlarmButton({ timing }: Props) {
  const setAlarm = () => {
    // Detect OS
    const isAndroid = /Android/i.test(navigator.userAgent);

    const sehriDate = parseDate(timing.gregorian, timing.sehri);
    const [h, m] = timing.sehri.split(':').map(n => parseInt(n.replace(/[০-৯]/g, s => ({ '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' }[s] || s))));

    if (isAndroid) {
      // Android Intent for Alarm
      const message = encodeURIComponent(`সেহরির শেষ সময় (${timing.ramadan})`);
      const intentUrl = `intent://#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.HOUR=${h};i.android.intent.extra.MINUTES=${m};s.android.intent.extra.MESSAGE=${message};S.android.intent.extra.RINGTONE=content://settings/system/alarm_alert;b.android.intent.extra.VIBRATE=true;b.android.intent.extra.SKIP_UI=false;end`;
      window.location.href = intentUrl;
    } else {
      // Fallback for iOS/Desktop: ICS Download
      downloadICS(h, m);
    }
  };

  const downloadICS = (h: number, m: number) => {
    const parts = timing.gregorian.split(' ');
    const day = parseInt(parts[0].replace(/[০-৯]/g, s => ({ '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' }[s] || s)));
    const monthMap: { [key: string]: number } = { 'ফেব্রুয়ারি': 1, 'মার্চ': 2 };
    const month = monthMap[parts[1]] ?? 1;

    const formatICSDate = (hour: number, min: number) => {
      const date = new Date(2026, month, day, hour, min);
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'SUMMARY:সেহরির শেষ সময় (' + timing.ramadan + ')',
      'DTSTART:' + formatICSDate(h, m),
      'DTEND:' + formatICSDate(h, m + 5),
      'DESCRIPTION:জয়পুরহাট রমজান ক্যালেন্ডার ২০২৬',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.body.appendChild(document.createElement('a'));
    link.href = window.URL.createObjectURL(blob);
    link.download = `sehri_${timing.ramadan.replace(/\s+/g, '_')}.ics`;
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={setAlarm}
      className="group relative flex items-center gap-2 bg-gold-gradient text-emerald-900 border border-primary-gold/30 px-5 py-2.5 rounded-2xl font-black text-[10px] shadow-md shadow-primary-gold/10 active:scale-95 transition-all uppercase tracking-tighter"
    >
      <span className="font-bengali">অ্যালার্ম সেট করুন</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7 3 9 3 9h6s3-2 3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /><path d="M2 8h2" /><path d="M20 8h2" /><path d="M6.34 15.66l-1.42 1.42" /><path d="M19.07 17.07l-1.42-1.42" /></svg>
    </button>
  );
}
