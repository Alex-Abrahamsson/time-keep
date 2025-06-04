import React from 'react';
import Style from './rightSideContainer.module.scss';
import { AssignmentType } from '@/types/types';
import Image from 'next/image';

interface RightSideContainerProps {
    headerText: string;
    children: React.ReactNode;
    assignment: AssignmentType[];
}

function getLast7DaysISO(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
}

function formatDay(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('sv-SE', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
    });
}

const CATEGORIES = ['Utveckling', 'Bugg', 'Konfiguration'];

export default function RightSideContainer({
    headerText,
    children,
    assignment,
}: RightSideContainerProps) {
    const last7Days = getLast7DaysISO();

    const getIcon = (category: string) => {
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

    // Filtrera assignments som har minst en session med BillableTime
    const filteredAssignments = assignment.filter((a) =>
        a.Sessions.some((s) => s.BillableTime && s.BillableTime > 0)
    );

    // Gruppera assignments per kund
    const grouped: { [customer: string]: AssignmentType[] } = {};
    for (const a of filteredAssignments) {
        if (!grouped[a.Costumer]) grouped[a.Costumer] = [];
        grouped[a.Costumer].push(a);
    }

    return (
        <div className={Style.rightSideContainer}>
            <div className={Style.rightSideContainerHeader}>
                <h1>{headerText}</h1>
            </div>
            <div className={Style.rightSideContainerBody}>
                <div className={Style.rightSideLeftContainerBodyHeader}>
                    {children}
                </div>
                <div className={Style.rightSideRightContainerBodyContent}>
                    {/* Rubrikrad med datum */}
                    <div className={Style.weekGrid}>
                        <div className={Style.weekGridCell}></div>
                        {last7Days.map((date, idx) => (
                            <div key={idx} className={Style.weekGridCell}>
                                {formatDay(date)}
                            </div>
                        ))}
                    </div>
                    {/* En sektion per kund */}
                    {Object.entries(grouped).map(([customer, assignments]) => (
                        <React.Fragment key={customer}>
                            <div className={Style.customerHeader}>
                                <b>{customer}</b>
                            </div>
                            {CATEGORIES.map((category) => {
                                // Kolla om det finns någon BillableTime för denna kategori och kund under de senaste 7 dagarna
                                const hasBillable = last7Days.some((date) =>
                                    assignments
                                        .filter((a) => a.Category === category)
                                        .flatMap((a) => a.Sessions)
                                        .some(
                                            (s) =>
                                                s.BillableTime &&
                                                s.Start &&
                                                s.Start.startsWith(date)
                                        )
                                );
                                if (!hasBillable) return null;

                                return (
                                    <div
                                        key={category}
                                        className={Style.weekGrid}
                                    >
                                        <div className={Style.weekGridCell}>
                                            <Image
                                                width={20}
                                                height={20}
                                                alt='none'
                                                src={getIcon(category)}
                                                unoptimized
                                            />
                                        </div>
                                        {last7Days.map((date, idx) => {
                                            const sum = assignments
                                                .filter(
                                                    (a) =>
                                                        a.Category === category
                                                )
                                                .flatMap((a) => a.Sessions)
                                                .filter(
                                                    (s) =>
                                                        s.BillableTime &&
                                                        s.Start &&
                                                        s.Start.startsWith(date)
                                                )
                                                .reduce(
                                                    (acc, s) =>
                                                        acc +
                                                        (s.BillableTime ?? 0),
                                                    0
                                                );
                                            return (
                                                <div
                                                    key={idx}
                                                    className={
                                                        Style.weekGridCell
                                                    }
                                                >
                                                    {sum > 0
                                                        ? sum + ' min'
                                                        : ''}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                    <div className={Style.weekGrid + ' ' + Style.summaryRow}>
                        <div className={Style.weekGridCell}>
                            <b>Totalt</b>
                        </div>
                        {last7Days.map((date, idx) => {
                            const sum = filteredAssignments
                                .flatMap((a) => a.Sessions)
                                .filter(
                                    (s) =>
                                        s.BillableTime &&
                                        s.Start &&
                                        s.Start.startsWith(date)
                                )
                                .reduce(
                                    (acc, s) => acc + (s.BillableTime ?? 0),
                                    0
                                );
                            return (
                                <div key={idx} className={Style.weekGridCell}>
                                    {sum > 0 ? sum + ' min' : ''}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={Style.rightSideContainerFooter}></div>
        </div>
    );
}
