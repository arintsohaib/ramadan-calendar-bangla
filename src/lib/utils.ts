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
