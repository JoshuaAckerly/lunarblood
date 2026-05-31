import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

interface PaginationProps {
    meta: PaginationMeta;
    links: PaginationLinks;
}

const Pagination: React.FC<PaginationProps> = ({ meta, links }) => {
    if (meta.last_page <= 1) return null;

    const pageLinks = meta.links.filter((link) => !link.label.includes('Previous') && !link.label.includes('Next'));

    return (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-between">
            <p className="text-sm text-[var(--muted-foreground)]">
                Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total}
            </p>

            <div className="flex items-center gap-1">
                {links.prev ? (
                    <Link href={links.prev} className="btn btn-secondary btn-sm" aria-label="Previous page">
                        <ChevronLeft size={16} />
                    </Link>
                ) : (
                    <span className="btn btn-secondary btn-sm cursor-not-allowed opacity-40" aria-disabled="true" aria-label="Previous page">
                        <ChevronLeft size={16} />
                    </span>
                )}

                {pageLinks.map((link) =>
                    link.url ? (
                        <Link
                            key={link.label}
                            href={link.url}
                            className={`btn btn-sm min-w-[2.25rem] ${link.active ? 'btn-primary' : 'btn-secondary'}`}
                            aria-label={`Page ${link.label}`}
                            aria-current={link.active ? 'page' : undefined}
                        >
                            {link.label}
                        </Link>
                    ) : (
                        <span key={link.label} className="btn btn-secondary btn-sm min-w-[2.25rem] cursor-default opacity-40">
                            {link.label}
                        </span>
                    ),
                )}

                {links.next ? (
                    <Link href={links.next} className="btn btn-secondary btn-sm" aria-label="Next page">
                        <ChevronRight size={16} />
                    </Link>
                ) : (
                    <span className="btn btn-secondary btn-sm cursor-not-allowed opacity-40" aria-disabled="true" aria-label="Next page">
                        <ChevronRight size={16} />
                    </span>
                )}
            </div>
        </nav>
    );
};

export default Pagination;
