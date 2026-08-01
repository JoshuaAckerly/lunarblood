import { useGSAP } from '@gsap/react';
import Main from '@/layouts/main';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useRef } from 'react';
import { getProjectUrl } from '../env';

const cdn = import.meta.env.VITE_ASSET_URL || 'https://d3fjkusrpksks7.cloudfront.net/lunarblood';

const Welcome: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroBgRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        // Hero parallax
        if (heroBgRef.current) {
            gsap.to(heroBgRef.current, {
                backgroundPositionY: '30%',
                ease: 'none',
                scrollTrigger: { trigger: heroBgRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
        }
        // Scroll-triggered stagger reveals
        gsap.utils.toArray<HTMLElement>('.lb-reveal').forEach((el) => {
            gsap.fromTo(el,
                { opacity: 0, y: 45 },
                { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
                  scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
            );
        });
        // Tour date stagger
        gsap.fromTo('.lb-tour-item',
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out',
              scrollTrigger: { trigger: '.lb-tour-item', start: 'top 85%', once: true } }
        );
    }, { scope: pageRef });
    return (
        <Main>
            <div ref={pageRef}>
            <section
                ref={heroBgRef as React.RefObject<HTMLElement>}
                className="hero mb-12 overflow-hidden rounded-lg"
                style={{
                    backgroundImage: `url(${cdn}/images/LunarBlood_Landing.webp)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="hero-overlay absolute inset-0"></div>
                <div className="relative z-10 px-4 py-16 text-center md:py-28">
                    <h1 className="fade-in text-4xl font-extrabold text-white drop-shadow-lg md:text-6xl">Lunar Blood</h1>
                    <p className="fade-in mx-auto mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
                        Dark. Mood. Heavy — music that reverberates in the bones.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a href={getProjectUrl('lunarblood')} className="btn btn-primary w-full sm:w-auto">
                            Listen Now
                        </a>
                        <a href="/tour" className="btn btn-secondary w-full sm:w-auto">
                            Tour Dates
                        </a>
                    </div>
                </div>
            </section>

            <section className="mb-12 grid gap-6 md:grid-cols-3">
                <article className="lb-reveal card">
                    <p className="mt-3 text-sm text-[var(--card-foreground)]/90">
                        Lunar Blood is a band that embodies darkness and moodiness—haunting melodies, heavy riffs, and immersive atmospheres that pull
                        listeners into another world.
                    </p>
                </article>

                <article className="card">
                    <h2 className="section-title !mb-0">Featured Music</h2>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3 rounded-lg bg-[var(--accent)] p-3 opacity-60">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--card)]">
                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Blood Moon Rising</p>
                                <p className="text-xs text-white/60">Coming soon</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-[var(--accent)] p-3 opacity-60">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--card)]">
                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Void Waltz</p>
                                <p className="text-xs text-white/60">Coming soon</p>
                            </div>
                        </div>
                    </div>
                </article>

                <article className="card">
                    <h2 className="section-title !mb-0">Connect</h2>
                    <p className="mt-3 text-sm">Follow us on socials for drops, tour announcements, and exclusive merch.</p>
                    <div className="mt-4 flex gap-2">
                        <a className="btn btn-secondary" href="https://www.instagram.com/lunarblood" target="_blank" rel="noopener noreferrer">
                            Instagram
                        </a>
                        <a className="btn btn-secondary" href="https://lunarblood.bandcamp.com" target="_blank" rel="noopener noreferrer">
                            Bandcamp
                        </a>
                    </div>
                </article>
            </section>

            <section className="mb-12">
                <h2 className="section-title !mb-4">Upcoming Shows</h2>
                <div className="space-y-4">
                    <div className="lb-tour-item glass rounded-lg p-4">
                        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                            <div className="text-sm font-medium sm:col-span-3">Sep 20, 2026</div>
                            <div className="text-sm sm:col-span-4 sm:text-base">Seattle, WA</div>
                            <div className="text-sm text-[var(--muted-foreground)] sm:col-span-3 sm:text-base sm:text-[var(--foreground)]">
                                The Neptune Theatre
                            </div>
                            <div className="sm:col-span-2 sm:text-right">
                                <a href="/tour" className="btn btn-primary w-full text-sm sm:w-auto">
                                    Tickets
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="lb-tour-item glass rounded-lg p-4">
                        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                            <div className="text-sm font-medium sm:col-span-3">Oct 4, 2026</div>
                            <div className="text-sm sm:col-span-4 sm:text-base">Portland, OR</div>
                            <div className="text-sm text-[var(--muted-foreground)] sm:col-span-3 sm:text-base sm:text-[var(--foreground)]">
                                Dark Moon Club
                            </div>
                            <div className="sm:col-span-2 sm:text-right">
                                <a href="/tour" className="btn btn-primary w-full text-sm sm:w-auto">
                                    Tickets
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <a href="/tour" className="btn btn-secondary">
                        View All Dates
                    </a>
                </div>
            </section>
            </div>
        </Main>
    );
};

export default Welcome;
