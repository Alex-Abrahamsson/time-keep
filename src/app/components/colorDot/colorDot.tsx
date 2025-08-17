'use client';

import React from 'react';
import Style from './colorDot.module.scss';
import { AssignmentStatus } from '@/types/types';

interface ColorDotProps {
    status: AssignmentStatus;
    size?: number;
}

export default function ColorDot({ status, size = 20 }: ColorDotProps) {
    const getColor = (): string => {
        switch (status) {
            case 'Active':
                return 'var(--color-active, green)';
            case 'Stopped':
                return 'var(--color-stopped, red)';
            default:
                return 'var(--color-unknown, gray)';
        }
    };

    return (
        <div className={Style.colorDotContainer}>
            <div
                className={Style.colorDot}
                style={{
                    backgroundColor: getColor(),
                    width: `${size}px`,
                    height: `${size}px`,
                }}
                aria-label={`Status: ${status}`}
            ></div>
        </div>
    );
}
