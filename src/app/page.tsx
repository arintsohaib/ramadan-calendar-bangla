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
      if (sehriDate > now) return { time: sehriDate, type: 'sehri', label: 'সেহরি শেষ হতে বাকি', data: t };

      const iftarDate = parseDate(t.gregorian, t.iftar, true);
      if (iftarDate > now) return { time: iftarDate, type: 'iftar', label: 'ইফতার শুরু হতে বাকি', data: t };
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
    <main className="flex-1 relative pb-20">
      <div className="geometric-overlay"></div>

      {/* Premium Arched Header */}
      <div className="header-arch mb-20 shadow-xl overflow-hidden">
        <div className="flex flex-col items-center gap-2 mb-10 relative z-10">
          <div className="flex items-center gap-3">
            <LanternIcon />
            <h1 className="text-2xl font-black font-bengali tracking-tight uppercase">রমজান ২০২৬</h1>
            <LanternIcon />
          </div>
          <span className="gold-badge font-bengali">জয়পুরহাট জেলা</span>
        </div>

        {nextEvent && (
          <div className="mb-8 relative z-10">
            <div className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1 italic">
              আজ {nextEvent.data.ramadan} | {nextEvent.data.gregorian}
            </div>
            <div className="text-xl font-extrabold font-bengali tracking-wide drop-shadow-md">
              {nextEvent.label}
            </div>
          </div>
        )}

        {nextEvent && (
          <div className="absolute left-6 right-6 bottom-[-60px] z-20">
            <Countdown targetTime={nextEvent.time} label="" />
          </div>
        )}
      </div>

      <div className="px-5 pt-8 z-10 relative">
        <section className="mb-12">
          <div className="phase-header mercy font-bengali text-lg text-center">রহমতের ১০ দিন</div>
          <div className="space-y-5">
            {groupedTimings.mercy.map((t: Timing) => <TimingCard key={t.id} t={t} now={now} />)}
          </div>
        </section>

        <section className="mb-12">
          <div className="phase-header forgiveness font-bengali text-lg text-center">মাগফিরাতের ১০ দিন</div>
          <div className="space-y-5">
            {groupedTimings.forgiveness.map((t: Timing) => <TimingCard key={t.id} t={t} now={now} />)}
          </div>
        </section>

        <section className="mb-12">
          <div className="phase-header salvation font-bengali text-lg text-center">নাজাতের ১০ দিন</div>
          <div className="space-y-5">
            {groupedTimings.salvation.map((t: Timing) => <TimingCard key={t.id} t={t} now={now} />)}
          </div>
        </section>
      </div>

      <div className="mosque-silhouette"></div>

      <footer className="text-center py-10 mt-10 bg-white/50 border-t border-primary-gold/10 text-emerald-900/40 text-xs font-medium relative z-10">
        <p className="font-bengali font-bold">© ২০২৬ জয়পুরহাট ডট ওআরজি</p>
        <p className="text-[10px] mt-1 opacity-60">আধুনিক ও প্রিমিয়াম রমজান ক্যালেন্ডার</p>
      </footer>
    </main>
  );
}

function TimingCard({ t, now }: { t: Timing, now: Date }) {
  const sehriDate = parseDate(t.gregorian, t.sehri);
  const today = getBDTime();
  const isToday = today.getDate() === sehriDate.getDate() && today.getMonth() === sehriDate.getMonth();

  return (
    <div className={`premium-card p-5 relative overflow-hidden ${isToday ? 'ring-2 ring-primary-gold animate-glow' : ''}`}>
      {isToday && <div className="absolute top-0 right-0 bg-primary-gold text-white text-[10px] px-3 py-1 font-black rounded-bl-xl tracking-tighter">আজ</div>}

      <div className="flex justify-between items-start mb-5">
        <div className="flex flex-col">
          <span className="font-black text-xl text-emerald-900 font-bengali leading-none">{t.ramadan}</span>
          <span className="text-[11px] text-primary-gold font-bold mt-1.5 uppercase tracking-wide">{t.gregorian} | {t.day}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-900/[0.03] p-4 rounded-2xl text-center border border-emerald-900/5">
          <div className="text-[10px] text-emerald-900/40 font-black uppercase mb-1 font-bengali">সেহরি শেষ</div>
          <div className="text-xl font-black text-emerald-900 tracking-tight">{t.sehri}</div>
        </div>
        <div className="bg-primary-gold/[0.05] p-4 rounded-2xl text-center border border-primary-gold/10">
          <div className="text-[10px] text-primary-gold/60 font-black uppercase mb-1 font-bengali">ইফতার</div>
          <div className="text-xl font-black text-emerald-900 tracking-tight">{t.iftar}</div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-emerald-900/5 flex justify-between items-center">
        <div className="text-[9px] text-emerald-900/30 font-bold italic">সর্বদা সতর্ক থাকুন</div>
        <AlarmButton timing={t} />
      </div>
    </div>
  );
}

function LanternIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
      <path d="M12 2L14.5 7H9.5L12 2Z" fill="white" />
      <path d="M7 8H17V17C17 19.2091 15.2091 21 13 21H11C8.79086 21 7 19.2091 7 17V8Z" stroke="white" strokeWidth="2" />
      <line x1="12" y1="8" x2="12" y2="21" stroke="white" strokeWidth="1" />
      <line x1="9" y1="12" x2="15" y2="12" stroke="white" strokeWidth="2" />
      <line x1="9" y1="17" x2="15" y2="17" stroke="white" strokeWidth="2" />
    </svg>
  );
}
