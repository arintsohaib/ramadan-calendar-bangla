import { Timing, getTimings } from "@/lib/data";
import Image from "next/image";
import { getBDTime, parseDate } from "@/lib/utils";
import Countdown from "@/components/Countdown";


// Force dynamic rendering — the "next event" must be computed
// at request time, not cached from build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const timings = await getTimings();
  const now = getBDTime();

  const nextEvent = timings.reduce<{
    time: Date;
    label: string;
    data: Timing;
  } | null>((acc, t) => {
    const sehri = parseDate(t.gregorian, t.sehri);
    const iftar = parseDate(t.gregorian, t.iftar, true);
    if (now < sehri && (!acc || sehri < acc.time))
      return { time: sehri, label: "সেহরি শেষ হতে বাকি", data: t };
    if (now < iftar && (!acc || iftar < acc.time))
      return { time: iftar, label: "ইফতারের বাকি", data: t };
    return acc;
  }, null);

  const todayTiming = nextEvent?.data;

  const phases: { title: string; items: Timing[] }[] = [
    { title: "রহমত", items: timings.slice(0, 10) },
    { title: "মাগফিরাত", items: timings.slice(10, 20) },
    { title: "নাজাত", items: timings.slice(20, 30) },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="mesh-bg" />
      <div className="geo-pattern" />

      {/* ═══════════ FIXED LOGO BAR ═══════════ */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{
          background: "rgba(8, 10, 25, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div className="flex items-center gap-3.5 py-3 px-6 w-full max-w-[430px]">
          <Image
            src="/adnan.png"
            alt="মোক্তাদুল হক আদনান"
            width={112}
            height={112}
            className="profile-avatar"
            style={{ width: 52, height: 52 }}
            priority
          />
          <div className="flex flex-col items-start gap-0.5">
            <span
              className="text-[15px] font-bold font-bn leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              মোক্তাদুল হক আদনান
            </span>
            <span
              className="text-[11px] font-medium font-bn"
              style={{ color: "var(--text-secondary)" }}
            >
              জয়পুরহাট পৌরসভা মেয়র পদপ্রার্থী
            </span>
          </div>
        </div>
      </div>

      <main className="relative z-10 flex flex-col items-center w-full max-w-[430px] mx-auto px-6 pb-24">

        {/* ═══════════ HEADER ═══════════ */}
        <header className="flex flex-col items-center gap-5 pt-24 pb-10 anim-in text-center">
          <h1
            className="text-[2.5rem] leading-tight font-black font-bn tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            ☪ রমজান ২০২৬
          </h1>
          <span className="badge-gold font-bn">🕌 জয়পুরহাট জেলা</span>
        </header>

        {/* ═══════════ HERO COUNTDOWN ═══════════ */}
        {nextEvent && (
          <section className="hero-glass w-full px-7 py-10 flex flex-col items-center gap-8 anim-in d1">
            <div className="flex flex-col items-center gap-2 text-center">
              <span
                className="text-[11px] font-semibold font-bn tracking-wider"
                style={{ color: "var(--text-dim)" }}
              >
                {nextEvent.data.ramadan} &middot; {nextEvent.data.gregorian}
              </span>
              <span
                className="text-xl font-bold font-bn"
                style={{ color: "var(--gold)" }}
              >
                🌙 {nextEvent.label}
              </span>
            </div>

            <Countdown targetTime={nextEvent.time} />


          </section>
        )}

        {/* ═══════════ TODAY'S TIMES ═══════════ */}
        {todayTiming && (
          <section className="today-card w-full mt-8 anim-in d2">
            <div className="flex items-center justify-between px-7 pt-6 pb-4">
              <span
                className="text-xs font-bold font-bn tracking-wide"
                style={{ color: "var(--text-secondary)" }}
              >
                আজকের সময়সূচী
              </span>
              <span className="badge-emerald font-bn">
                {todayTiming.day}
              </span>
            </div>

            <div className="flex items-center justify-between px-7 pb-7 pt-3">
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px] font-bold font-bn tracking-wider"
                  style={{ color: "var(--text-dim)" }}
                >
                  সেহরি
                </span>
                <span
                  className="text-3xl font-black tabular-nums tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {todayTiming.sehri}
                </span>
              </div>

              <div
                className="h-14 mx-4"
                style={{
                  width: "1px",
                  background: "linear-gradient(180deg, transparent, var(--glass-glow), transparent)",
                }}
              />

              <div className="flex flex-col gap-1 items-end">
                <span
                  className="text-[10px] font-bold font-bn tracking-wider"
                  style={{ color: "var(--text-dim)" }}
                >
                  ইফতার
                </span>
                <span
                  className="text-3xl font-black tabular-nums tracking-tight"
                  style={{ color: "var(--emerald)" }}
                >
                  {todayTiming.iftar}
                </span>
              </div>
            </div>
          </section>
        )}


        {/* ═══════════ FULL SCHEDULE ═══════════ */}
        <section className="w-full mt-12 flex flex-col gap-10 anim-in d3">
          {phases.map((phase) => (
            <div key={phase.title} className="flex flex-col gap-3">
              <div className="phase-hdr px-1">
                <span>✦ {phase.title}</span>
              </div>

              <div className="flex flex-col gap-3">
                {phase.items.map((t) => {
                  const isToday =
                    todayTiming && t.dayNumber === todayTiming.dayNumber;
                  return (
                    <div
                      key={t.dayNumber}
                      className={`sched-row ${isToday ? "is-today" : ""}`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="text-[15px] font-bold font-bn"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {t.ramadan}
                          </span>
                          {isToday && (
                            <span className="badge-today font-bn">আজ</span>
                          )}
                        </div>
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: "var(--text-dim)" }}
                        >
                          {t.gregorian} &middot; {t.day}
                        </span>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="flex flex-col items-end gap-0.5">
                          <span
                            className="text-[9px] font-bold font-bn tracking-wide"
                            style={{ color: "var(--text-dim)" }}
                          >
                            সেহরি
                          </span>
                          <span
                            className="text-sm font-bold tabular-nums"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {t.sehri}
                          </span>
                        </div>
                        <div
                          className="h-7"
                          style={{
                            width: "1px",
                            background: "var(--glass-border)",
                          }}
                        />
                        <div className="flex flex-col items-end gap-0.5">
                          <span
                            className="text-[9px] font-bold font-bn tracking-wide"
                            style={{ color: "var(--text-dim)" }}
                          >
                            ইফতার
                          </span>
                          <span
                            className="text-sm font-bold tabular-nums"
                            style={{ color: "var(--emerald)" }}
                          >
                            {t.iftar}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

      </main>

      {/* ═══════════ FIXED FOOTER BAR ═══════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
        style={{
          background: "rgba(8, 10, 25, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid var(--glass-border)",
        }}
      >
        <div className="flex flex-col items-center gap-1.5 py-2.5 px-5 w-full max-w-[430px]">
          <Image
            src="/shamsul.png"
            alt="অধ্যক্ষ শামসুল হক"
            width={72}
            height={72}
            className="foundation-avatar"
            style={{ width: 36, height: 36 }}
            loading="lazy"
          />
          <span
            className="text-[10px] font-bold font-bn"
            style={{ color: "var(--text-dim)" }}
          >
            অধ্যক্ষ শামসুল হক ফাউন্ডেশনের একটি উদ্যোগ
          </span>
        </div>
      </div>

    </div>
  );
}
