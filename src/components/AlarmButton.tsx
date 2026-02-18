'use client';

import { englishToBangla } from '@/lib/utils';

interface Props {
  timing: {
    ramadan: string;
    gregorian: string;
    sehri: string;
    iftar: string;
  };
}

export default function AlarmButton({ timing }: Props) {
  const downloadICS = () => {
    const monthMap: { [key: string]: number } = { 'ফেব্রুয়ারি': 1, 'মার্চ': 2 };
    const parts = timing.gregorian.split(' ');
    const day = parseInt(parts[0].replace(/[০-৯]/g, s => ({'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'}[s] || s)));
    const month = monthMap[parts[1]] - 1;
    
    const sehriTime = timing.sehri.split(':').map(n => parseInt(n.replace(/[০-৯]/g, s => ({'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'}[s] || s))));
    const iftarTime = timing.iftar.split(':').map(n => parseInt(n.replace(/[০-৯]/g, s => ({'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'}[s] || s))));

    const formatICSDate = (h: number, m: number) => {
      const date = new Date(2026, month, day, h, m);
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'SUMMARY:সেহরির শেষ সময় (' + timing.ramadan + ')',
      'DTSTART:' + formatICSDate(sehriTime[0], sehriTime[1]),
      'DTEND:' + formatICSDate(sehriTime[0], sehriTime[1] + 5),
      'DESCRIPTION:জয়পুরহাট রমজান ক্যালেন্ডার ২০২৬',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'SUMMARY:ইফতারের সময় (' + timing.ramadan + ')',
      'DTSTART:' + formatICSDate(iftarTime[0] + 12, iftarTime[1]),
      'DTEND:' + formatICSDate(iftarTime[0] + 12, iftarTime[1] + 5),
      'DESCRIPTION:জয়পুরহাট রমজান ক্যালেন্ডার ২০২৬',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'ramadan_' + timing.ramadan.replace(' ', '_') + '.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={downloadICS}
      className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 font-medium hover:bg-green-100 transition-colors"
    >
      অ্যালার্ম সেট করুন
    </button>
  );
}
