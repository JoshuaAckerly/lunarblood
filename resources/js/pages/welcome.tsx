import AudioPlayer from '@/components/AudioPlayer';
import Main from '@/layouts/main';
import React from 'react';
import { getProjectUrl } from '../env';

const cdn = import.meta.env.VITE_ASSET_URL || 'https://d3fjkusrpksks7.cloudfront.net/lunarblood';

const Welcome: React.FC = () => {
    return (
        <Main>
            <section
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
                <article className="card">
                    <h2 className="section-title !mb-0">Band Bio</h2>
                    <p className="mt-3 text-sm text-[var(--card-foreground)]/90">
                        Lunar Blood is a band that embodies darkness and moodiness—haunting melodies, heavy riffs, and immersive atmospheres that pull
                        listeners into another world.
                    </p>
                </article>

                <article className="card">
                    <h2 className="section-title !mb-0">Featured Music</h2>
                    <div className="mt-4 space-y-4">
                        <AudioPlayer src={`#`} />
                        <AudioPlayer src={`#`} />
                    </div>
                </article>

                <article className="card">
                    <h2 className="section-title !mb-0">Connect</h2>
                    <p className="mt-3 text-sm">Follow us on socials for drops, tour announcements, and exclusive merch.</p>
                    <div className="mt-4 flex gap-2">
                        <a className="btn btn-secondary" href="#">
                            Instagram
                        </a>
                        <a className="btn btn-secondary" href="#">
                            Bandcamp
                        </a>
                    </div>
                </article>
            </section>

            <section className="mb-12">
                <h2 className="section-title !mb-4">Upcoming Shows</h2>
                <div className="space-y-4">
                    <div className="glass rounded-lg p-4">
                        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                            <div className="text-sm font-medium sm:col-span-3">Mar 15</div>
                            <div className="text-sm sm:col-span-4 sm:text-base">Seattle, WA</div>
                            <div className="text-sm text-[var(--muted-foreground)] sm:col-span-3 sm:text-base sm:text-[var(--foreground)]">
                                The Underground
                            </div>
                            <div className="sm:col-span-2 sm:text-right">
                                <a href="/tour" className="btn btn-primary w-full text-sm sm:w-auto">
                                    Tickets
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="glass rounded-lg p-4">
                        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                            <div className="text-sm font-medium sm:col-span-3">Apr 2</div>
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
        </Main>
    );
};

export default Welcome;
