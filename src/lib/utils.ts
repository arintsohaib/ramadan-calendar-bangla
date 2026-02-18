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

export function getBDTime() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
}

export function parseDate(gregorian: string, timeStr: string, isPM: boolean = false): Date {
    const monthMap: { [key: string]: number } = { 'ফেব্রুয়ারি': 1, 'মার্চ': 2 };
    const parts = gregorian.split(' ');
    const day = parseInt(banglaToEnglish(parts[0]));
    const month = monthMap[parts[1]] ?? 1;
    const [h, m] = banglaToEnglish(timeStr).split(':').map(Number);
    const hour = isPM && h < 12 ? h + 12 : (!isPM && h === 12 ? 0 : h);
    return new Date(2026, month, day, hour, m);
}
