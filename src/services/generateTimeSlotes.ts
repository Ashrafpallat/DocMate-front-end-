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

// Generate time slots based on start/end time, consulting time, and breaks
export const generateTimeSlots = (
    startTime: string,
    endTime: string,
    consultDuration: number,
    breaks: { start: string, end: string }[]
) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const totalBreakTime = calculateBreaksDuration(breaks);

    const totalAvailableMinutes = endMinutes - startMinutes - totalBreakTime;

    const numberOfSlots = Math.floor(totalAvailableMinutes / consultDuration);

    let slots = [];
    let currentTime = startMinutes;

    for (let i = 0; i < numberOfSlots; i++) {
        const slotStart = currentTime;
        const slotEnd = currentTime + consultDuration;

        slots.push({
            start: minutesToTime(slotStart),
            end: minutesToTime(slotEnd),
        });

        currentTime = slotEnd;
    }
 
    return slots;
}; 
  