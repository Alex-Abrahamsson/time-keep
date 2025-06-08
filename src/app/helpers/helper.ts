export function getLast7DaysISO(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
}

export function formatDay(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('sv-SE', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
    });
}

export const getIcon = (category: string) => {
    switch (category) {
        case 'Bugg':
            return '/assets/bug.png';
        case 'Utveckling':
            return '/assets/code.png';
        case 'Konfiguration':
            return '/assets/config.png';
        default:
            return '/assets/bug.png';
    }
};
