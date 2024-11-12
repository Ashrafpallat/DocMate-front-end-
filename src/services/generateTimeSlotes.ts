// services/tokenService.ts

// Convert HH:mm (24-hour format) to minutes
export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Convert minutes back to HH:mm (24-hour format)
export const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Calculate total break duration in minutes
export const calculateBreaksDuration = (breaks: { start: string, end: string }[]): number => {
    return breaks.reduce((total, currentBreak) => {
        const startMinutes = timeToMinutes(currentBreak.start);
        const endMinutes = timeToMinutes(currentBreak.end);
        return total + (endMinutes - startMinutes);
    }, 0);
};

const isSlotOverlappingWithBreak = (slotStart: number, slotEnd: number, breaks: { start: string, end: string }[]) => {
    return breaks.some(breakInterval => {
        const breakStart = timeToMinutes(breakInterval.start);
        const breakEnd = timeToMinutes(breakInterval.end);
        return (slotStart < breakEnd && slotEnd > breakStart);
    });
};

export const generateTimeSlots = (
    startTime: string,
    endTime: string,
    consultDuration: number,
    breaks: { start: string, end: string }[]
) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const totalAvailableMinutes = endMinutes - startMinutes;

    const numberOfSlots = Math.floor(totalAvailableMinutes / consultDuration);

    let slots = [];
    let currentTime = startMinutes;

    for (let i = 0; i < numberOfSlots; i++) {
        const slotStart = currentTime;
        const slotEnd = currentTime + consultDuration;

        // Check if the current slot overlaps with any break
        if (!isSlotOverlappingWithBreak(slotStart, slotEnd, breaks)) {
            slots.push({
                start: minutesToTime(slotStart),
                end: minutesToTime(slotEnd),
            });
        }

        currentTime = slotEnd;
    }
 
    return slots;
};

  