import React from 'react';

interface SkeletonProps {
    className?: string;
}

/** Single shimmer block. Style width/height via className. */
const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
    <div className={`animate-pulse rounded bg-[var(--muted)] ${className}`} aria-hidden="true" />
);

/** Skeleton for a dashboard stat card (label + big number + footer). */
export const DashboardStatCardSkeleton: React.FC = () => (
    <article className="card" aria-hidden="true">
        <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="mt-1 h-9 w-16" />
        <Skeleton className="mt-3 h-2 w-24" />
    </article>
);

/** Skeleton for one item in the Upcoming Shows list. */
export const UpcomingShowItemSkeleton: React.FC = () => (
    <li className="rounded-md border border-[var(--border)] p-3" aria-hidden="true">
        <Skeleton className="mb-2 h-4 w-40" />
        <Skeleton className="mb-3 h-3 w-28" />
        <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-16 rounded-full" />
        </div>
    </li>
);

/** Skeleton for one item in the Low Stock Products list. */
export const LowStockItemSkeleton: React.FC = () => (
    <li className="rounded-md border border-[var(--border)] p-3" aria-hidden="true">
        <Skeleton className="mb-2 h-4 w-36" />
        <Skeleton className="mb-3 h-3 w-24" />
        <Skeleton className="h-3 w-28" />
    </li>
);

/** Skeleton for one card in the Shows index list. */
export const ShowCardSkeleton: React.FC = () => (
    <div className="card" aria-hidden="true">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="mb-4 grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="mb-2 h-4 w-48" />
                <Skeleton className="h-3 w-64" />
            </div>
            <div className="ml-4 flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
            </div>
        </div>
    </div>
);

/** Skeleton for one card in the Venues index grid. */
export const VenueCardSkeleton: React.FC = () => (
    <div className="card" aria-hidden="true">
        <Skeleton className="mb-4 aspect-video w-full rounded-lg" />
        <Skeleton className="mb-3 h-5 w-36" />
        <div className="mb-4 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
                <Skeleton className="h-8 w-14 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
        </div>
    </div>
);

export default Skeleton;
