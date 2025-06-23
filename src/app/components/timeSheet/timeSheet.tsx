import React from 'react';
import Style from './timeSheet.module.scss';
import Image from 'next/image';
import { AssignmentType } from '@/types/types';
import { formatDay, getIcon, getLast7DaysISO } from '@/app/helpers/helper';

interface ITimeSHeet {
    assignment: AssignmentType[];
}

export default function TimeSheet({ assignment }: ITimeSHeet) {
    // Hämta de senaste 7 dagarna i ISO-forma
    const last7Days = getLast7DaysISO();
    const CATEGORIES = ['Utveckling', 'Bugg', 'Konfiguration'];

    const filteredAssignments = assignment.filter((a) =>
        a.Sessions.some((s) => s.BillableTime && s.BillableTime > 0)
    );

    const grouped: { [customer: string]: AssignmentType[] } = {};
    for (const a of filteredAssignments) {
        if (!grouped[a.Costumer]) grouped[a.Costumer] = [];
        grouped[a.Costumer].push(a);
    }

    return (
        <div className={Style.rightSideRightContainerBodyContent}>
            <div className={Style.weekGrid}>
                <div className={Style.weekGridCell}></div>
                {last7Days.map((date, idx) => (
                    <div key={idx} className={Style.weekGridCell}>
                        {formatDay(date)}
                    </div>
                ))}
            </div>
            {/* En sektion per kund */}
            {Object.entries(grouped).map(([customer, assignments]) => {
                // Visa endast kundheader om någon kategori har BillableTime senaste 7 dagarna
                const hasAnyCategory = CATEGORIES.some((category) =>
                    last7Days.some((date) =>
                        assignments
                            .filter((a) => a.Category === category)
                            .flatMap((a) => a.Sessions)
                            .some(
                                (s) =>
                                    s.BillableTime &&
                                    s.Start &&
                                    s.Start.startsWith(date)
                            )
                    )
                );
                if (!hasAnyCategory) return null;

                return (
                    <React.Fragment key={customer}>
                        <div className={Style.customerHeader}>
                            <b>{customer}</b>
                        </div>
                        {CATEGORIES.map((category) => {
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
                                <div key={category} className={Style.weekGrid}>
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
                                        // Hämta alla sessions för denna dag, kategori och kund
                                        const sessions = assignments
                                            .filter(
                                                (a) => a.Category === category
                                            )
                                            .flatMap((a) =>
                                                a.Sessions.filter(
                                                    (s) =>
                                                        s.BillableTime &&
                                                        s.Start &&
                                                        s.Start.startsWith(date)
                                                ).map((s) => ({
                                                    ticketName: a.TicketName,
                                                    session: s,
                                                }))
                                            );
                                        const sum = sessions.reduce(
                                            (acc, { session }) =>
                                                acc +
                                                (session.BillableTime ?? 0),
                                            0
                                        );
                                        return (
                                            <div
                                                key={idx}
                                                className={Style.weekGridCell}
                                                onMouseOver={() => console.log( 'Ticket(s) denna cell:', sessions.map((s) => s.ticketName ))}
                                            >
                                                {sum > 0 ? sum + ' min' : ''}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </React.Fragment>
                );
            })}
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
                        .reduce((acc, s) => acc + (s.BillableTime ?? 0), 0);
                    return (
                        <div key={idx} className={Style.weekGridCell}>
                            {sum > 0 ? sum + ' min' : ''}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
