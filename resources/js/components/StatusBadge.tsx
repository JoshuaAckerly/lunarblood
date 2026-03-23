import React from 'react';

type ShowStatus = 'coming-soon' | 'on-sale' | 'sold-out' | 'cancelled';

interface StatusBadgeProps {
    status: string | null;
    size?: 'sm' | 'md';
}

const statusStyles: Record<ShowStatus, string> = {
    'on-sale': 'bg-[var(--accent)]/15 text-[var(--accent)]',
    'sold-out': 'bg-[var(--destructive)]/15 text-[var(--destructive-foreground)]',
    cancelled: 'bg-[var(--muted)]/50 text-[var(--muted-foreground)]',
    'coming-soon': 'bg-[var(--chart-1)]/15 text-[var(--chart-1)]',
};

const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
    const normalizedStatus = status ?? 'coming-soon';
    const colorClass = statusStyles[normalizedStatus as ShowStatus] ?? statusStyles['coming-soon'];
    const label = normalizedStatus.replace(/-/g, ' ').toUpperCase();

    return <span className={`inline-flex items-center rounded-full font-medium ${sizeStyles[size]} ${colorClass}`}>{label}</span>;
};

export default StatusBadge;
