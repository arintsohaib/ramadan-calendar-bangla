import { prisma } from '@/lib/prisma';
import Countdown from '@/components/Countdown';
import AlarmButton from '@/components/AlarmButton';
import { englishToBangla, getBDTime, banglaToEnglish } from '@/lib/utils';
import { Timing } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const timings: Timing[] = await prisma.timing.findMany({
    orderBy: { dayNumber: 'asc' },
  });

  const now = getBDTime();
  
  const getNextEvent = () => {
    const monthMap: { [key: string]: number } = { 'ফেব্রুয়ারি': 1, 'মার্চ': 2 };
    for (const t of timings) {
      const parts = t.gregorian.split(' ');
      const day = parseInt(banglaToEnglish(parts[0]));
      const month = monthMap[parts[1]] ?? 1;
      
      const [sH, sM] = banglaToEnglish(t.sehri).split(':').map(Number);
      const sehriDate = new Date(2026, month - 1, day, sH, sM);
      if (sehriDate > now) return { time: sehriDate, type: 'sehri', label: 'সেহরির শেষ সময় বাকি', data: t };

      const [iH, iM] = banglaToEnglish(t.iftar).split(':').map(Number);
      const iftarDate = new Date(2026, month - 1, day, iH + 12, iM);
      if (iftarDate > now) return { time: iftarDate, type: 'iftar', label: 'ইফতারের বাকি', data: t };
    }
    return null;
  };

  const nextEvent = getNextEvent();
  
  const groupedTimings = {
    mercy: timings.filter((t: Timing) => t.phase === 'রহমত'),
    forgiveness: timings.filter((t: Timing) => t.phase === 'মাগফিরাত'),
    salvation: timings.filter((t: Timing) => t.phase === 'নাজাত'),
  };

  return (
    <main className="flex-1">
      {/* Header section */}
      <div className="green-gradient-bg pt-12 pb-24 px-6 rounded-b-[40px] text-white text-center shadow-2xl relative z-20">
        <div className="flex flex-col items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold font-bengali">রমজান ক্যালেন্ডার ২০২৬</h1>
          <span className="location-badge font-bengali">জয়পুরহাট জেলা</span>
        </div>
        
        {nextEvent && (
          <div className="mb-6 animate-pulse">
             <div className="text-sm opacity-80 mb-1">{nextEvent.data.ramadan} | {nextEvent.data.gregorian}</div>
             <div className="text-lg font-bold">{nextEvent.label}</div>
          </div>
        )}

        {nextEvent && (
          <div className="absolute left-6 right-6 bottom-[-60px]">
            <Countdown targetTime={nextEvent.time} label="" />
          </div>
        )}
      </div>

      <div className="pt-20 px-4 pb-10">
        <section className="mb-8">
           <div className="phase-header mercy font-bengali">রহমতের ১০ দিন</div>
           <div className="space-y-3">
             {groupedTimings.mercy.map((t: Timing) => <TimingCard key={t.id} t={t} now={now} />)}
           </div>
        </section>

        <section className="mb-8">
           <div className="phase-header forgiveness font-bengali">মাগফিরাতের ১০ দিন</div>
           <div className="space-y-3">
             {groupedTimings.forgiveness.map((t: Timing) => <TimingCard key={t.id} t={t} now={now} />)}
           </div>
        </section>

        <section className="mb-8">
           <div className="phase-header salvation font-bengali">নাজাতের ১০ দিন</div>
           <div className="space-y-3">
             {groupedTimings.salvation.map((t: Timing) => <TimingCard key={t.id} t={t} now={now} />)}
           </div>
        </section>
      </div>

      <footer className="text-center py-10 opacity-50 text-xs">
        <p>© ২০২৬ জয়পুরহাট ডট ওআরজি</p>
      </footer>
    </main>
  );
}

function TimingCard({ t, now }: { t: Timing, now: Date }) {
    const parts = t.gregorian.split(' ');
    const day = parseInt(banglaToEnglish(parts[0]));
    const month = (parts[1] === 'ফেব্রুয়ারি' ? 1 : 2) - 1;
    const isToday = now.getDate() === day && now.getMonth() === month;

    return (
        <div className={`bg-white p-4 rounded-2xl shadow-sm border ${isToday ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-100' : 'border-gray-100'}`}>
            <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col">
                    <span className="font-bold text-green-800">{t.ramadan}</span>
                    <span className="text-[10px] text-gray-500">{t.gregorian} | {t.day}</span>
                </div>
                {isToday && <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">আজ</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-2 rounded-xl text-center">
                    <div className="text-[10px] text-gray-400">সেহরি শেষ</div>
                    <div className="font-bold text-amber-600">{t.sehri}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl text-center">
                    <div className="text-[10px] text-gray-400">ইফতার</div>
                    <div className="font-bold text-red-600">{t.iftar}</div>
                </div>
            </div>
            <div className="mt-3 flex justify-end">
                <AlarmButton timing={t} />
            </div>
        </div>
    );
}
