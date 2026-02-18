export function banglaToEnglish(str: string): string {
    const numbers: { [key: string]: string } = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return str.replace(/[০-৯]/g, s => numbers[s]);
}

export function englishToBangla(str: string | number): string {
    const numbers: { [key: string]: string } = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
        '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(str).replace(/[0-9]/g, s => numbers[s]);
}

/**
 * Returns the current instant as a Date object.
 * 
 * The Date object stores UTC internally, and `Date.now()` is timezone-agnostic.
 * We simply return `new Date()` — the current UTC moment.
 * Comparison with parseDate() works because parseDate() also returns
 * a Date representing the correct UTC moment.
 */
export function getBDTime(): Date {
    return new Date();
}

/**
 * Parse a Bengali date + time string into a Date representing
 * the correct UTC moment.
 *
 * All times in the database are Bangladesh local times (UTC+6).
 * By constructing an ISO string with +06:00 offset, the Date constructor
 * automatically converts to the correct UTC millisecond value.
 *
 * This means:
 * - Server-side: `getBDTime() < parseDate(...)` works correctly
 * - Client-side: `Date.now() - parseDate(...).getTime()` works correctly
 * - Both work regardless of machine timezone (server in Germany, client in BD)
 */
export function parseDate(gregorian: string, timeStr: string, isPM: boolean = false): Date {
    const monthMap: { [key: string]: string } = {
        'ফেব্রুয়ারি': '02',
        'মার্চ': '03',
    };

    const parts = gregorian.split(' ');
    const day = parseInt(banglaToEnglish(parts[0]));
    const monthStr = monthMap[parts[1]] ?? '02';

    const [h, m] = banglaToEnglish(timeStr).split(':').map(Number);
    const hour = isPM && h < 12 ? h + 12 : (!isPM && h === 12 ? 0 : h);

    // Construct ISO 8601 with explicit Bangladesh offset (+06:00)
    // new Date() will internally convert this to UTC milliseconds,
    // making it safe for comparison with Date.now() from any timezone.
    const iso = `2026-${monthStr}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}:00+06:00`;

    return new Date(iso);
}
