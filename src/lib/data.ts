import { prisma } from "./prisma";

export interface Timing {
    id: number;
    ramadan: string;
    gregorian: string;
    day: string;
    sehri: string;
    iftar: string;
    phase: string;
    dayNumber: number;
}

export async function getTimings(): Promise<Timing[]> {
    const timings = await prisma.timing.findMany({
        orderBy: {
            dayNumber: "asc",
        },
    });
    return timings;
}
