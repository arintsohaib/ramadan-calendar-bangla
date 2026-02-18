import { prisma } from '@/lib/prisma';
import Countdown from '@/components/Countdown';
import AlarmButton from '@/components/AlarmButton';
import { englishToBangla, getBDTime, parseDate } from '@/lib/utils';
import { Timing } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const timings: Timing[] = await prisma.timing.findMany({
    orderBy: { dayNumber: 'asc' },
  });

  const now = getBDTime();

  const getNextEvent = () => {
    for (const t of timings) {
      const sehriDate = parseDate(t.gregorian, t.sehri);
      if (sehriDate > now) return { time: sehriDate, type: 'sehri', label: 'সেহরির শেষ সময় বাকি', data: t };

      const iftarDate = parseDate(t.gregorian, t.iftar, true);
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
      <div className="green-gradient-bg pt-14 pb-28 px-6 rounded-b-[50px] text-white text-center shadow-2xl relative z-20">
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-2xl font-extrabold font-bengali tracking-tight">রমজান ক্যালেন্ডার ২০২৬</h1>
          <span className="location-badge font-bengali">জয়পুরহাট জেলা</span>
        </div>

        {nextEvent && (
          <div className="mb-6 animate-pulse-soft">
            <div className="text-sm font-medium opacity-90 mb-1">{nextEvent.data.ramadan} | {nextEvent.data.gregorian}</div>
            <div className="text-xl font-bold font-bengali">{nextEvent.label}</div>
          </div>
        )}

        {nextEvent && (
          <div className="absolute left-6 right-6 bottom-[-60px]">
            <Countdown targetTime={nextEvent.time} label="" />
          </div>
        )}
      </div>

      <div className="pt-24 px-5 pb-10">
        <section className="mb-10">
          <div className="phase-header mercy font-bengali text-lg">রহমতের ১০ দিন</div>
          <div className="space-y-4">
            {groupedTimings.mercy.map((t: Timing) => <TimingCard key={t.id} t={t} now={now} />)}
          </div>
        </section>

        <section className="mb-10">
          <div className="phase-header forgiveness font-bengali text-lg">মাগফিরাতের ১০ দিন</div>
          <div className="space-y-4">
            {groupedTimings.forgiveness.map((t: Timing) => <TimingCard key={t.id} t={t} now={now} />)}
          </div>
        </section>

        <section className="mb-10">
          <div className="phase-header salvation font-bengali text-lg">নাজাতের ১০ দিন</div>
          <div className="space-y-4">
            {groupedTimings.salvation.map((t: Timing) => <TimingCard key={t.id} t={t} now={now} />)}
          </div>
        </section>
      </div>

      <footer className="text-center py-12 bg-gray-50 text-gray-400 text-sm font-medium">
        <p className="font-bengali">© ২০২৬ জয়পুরহাট ডট ওআরজি</p>
        <p className="text-[10px] mt-1 opacity-60">সহিহ সময় ও আধুনিক ইন্টারফেস</p>
      </footer>
    </main>
  );
}

function TimingCard({ t, now }: { t: Timing, now: Date }) {
  const sehriDate = parseDate(t.gregorian, t.sehri);
  const iftarDate = parseDate(t.gregorian, t.iftar, true);

  // Check if "today" based on date
  const today = getBDTime();
  const isToday = today.getDate() === sehriDate.getDate() && today.getMonth() === sehriDate.getMonth();

  return (
    <div className={`time-card bg-white p-5 rounded-3xl shadow-sm border-2 ${isToday ? 'border-amber-400 bg-amber-50/30' : 'border-gray-50'}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <span className="font-bold text-lg text-emerald-900 font-bengali">{t.ramadan}</span>
          <span className="text-xs text-emerald-600/70 font-medium">{t.gregorian} | {t.day}</span>
        </div>
        {isToday && (
          <span className="bg-amber-100 text-amber-700 text-[11px] px-3 py-1 rounded-full font-bold border border-amber-200 uppercase tracking-wider">
            আজ
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 p-4 rounded-2xl text-center border border-emerald-100/50">
          <div className="text-[11px] text-emerald-700/60 font-bold uppercase mb-1 font-bengali">সেহরি শেষ</div>
          <div className="text-xl font-black text-emerald-900 tracking-tight">{t.sehri}</div>
        </div>
        <div className="bg-orange-50/50 p-4 rounded-2xl text-center border border-orange-100/50">
          <div className="text-[11px] text-orange-700/60 font-bold uppercase mb-1 font-bengali">ইফতার</div>
          <div className="text-xl font-black text-orange-900 tracking-tight">{t.iftar}</div>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-[10px] text-gray-400 font-medium italic">মিনিট ব্যবধানে সতর্ক থাকুন</div>
        <AlarmButton timing={t} />
      </div>
    </div>
  );
}
