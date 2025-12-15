import React from "react";
import Main from "@/layouts/main";
import AudioPlayer from "@/components/AudioPlayer";
import Seo from "@/components/Seo";

const cdn = import.meta.env.VITE_ASSET_URL;

const Welcome: React.FC = () => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "MusicGroup",
        "name": "Lunar Blood",
        "genre": ["Heavy Metal", "Doom Metal", "Dark Rock", "Atmospheric Metal"],
        "description": "Dark. Mood. Heavy — music that reverberates in the bones. Lunar Blood embodies darkness and moodiness with haunting melodies, heavy riffs, and immersive atmospheres.",
        "url": "https://lunarblood.graveyardjokes.com",
        "image": "https://lunarblood.graveyardjokes.com/images/og-image.jpg",
        "sameAs": [
            "https://open.spotify.com/artist/lunarblood",
            "https://lunarblood.bandcamp.com",
            "https://www.instagram.com/lunarbloodband"
        ]
    };

    return (
    <Main>
        <section
            className="hero mb-12 rounded-lg overflow-hidden"
            style={{
                backgroundImage: `url(${cdn}/images/LunarBlood_Landing.webp)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="hero-overlay absolute inset-0"></div>
            <div className="relative z-10 py-16 md:py-28 text-center px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg fade-in">Lunar Blood</h1>
                <p className="mt-4 text-lg md:text-xl text-white/90 fade-in max-w-2xl mx-auto">Dark. Mood. Heavy — music that reverberates in the bones.</p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/listen" className="btn btn-primary w-full sm:w-auto">Listen Now</a>
                    <a href="/tour" className="btn btn-secondary w-full sm:w-auto">Tour Dates</a>
                </div>
            </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
            <article className="card">
                <h2 className="text-2xl font-semibold">Band Bio</h2>
                <p className="mt-3 text-sm text-[var(--card-foreground)]/90">Lunar Blood is a band that embodies darkness and moodiness—haunting melodies, heavy riffs, and immersive atmospheres that pull listeners into another world.</p>
            </article>

            <article className="card">
                <h2 className="text-2xl font-semibold">Featured Music</h2>
                <div className="mt-4 space-y-4">
                    <AudioPlayer src={`#`} />
                    <AudioPlayer src={`#`} />
                </div>
            </article>

            <article className="card">
                <h2 className="text-2xl font-semibold">Connect</h2>
                <p className="mt-3 text-sm">Follow us on socials for drops, tour announcements, and exclusive merch.</p>
                <div className="mt-4 flex gap-2">
                    <a className="btn btn-secondary" href="#">Instagram</a>
                    <a className="btn btn-secondary" href="#">Bandcamp</a>
                </div>
            </article>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Shows</h2>
            <div className="space-y-4">
                <div className="p-4 glass rounded-lg">
                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center">
                        <div className="sm:col-span-3 text-sm font-medium">Mar 15</div>
                        <div className="sm:col-span-4 text-sm sm:text-base">Seattle, WA</div>
                        <div className="sm:col-span-3 text-sm text-[var(--muted-foreground)] sm:text-base sm:text-[var(--foreground)]">The Underground</div>
                        <div className="sm:col-span-2 sm:text-right">
                            <a href="/tour" className="btn btn-primary text-sm w-full sm:w-auto">Tickets</a>
                        </div>
                    </div>
                </div>
                <div className="p-4 glass rounded-lg">
                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center">
                        <div className="sm:col-span-3 text-sm font-medium">Apr 2</div>
                        <div className="sm:col-span-4 text-sm sm:text-base">Portland, OR</div>
                        <div className="sm:col-span-3 text-sm text-[var(--muted-foreground)] sm:text-base sm:text-[var(--foreground)]">Dark Moon Club</div>
                        <div className="sm:col-span-2 sm:text-right">
                            <a href="/tour" className="btn btn-primary text-sm w-full sm:w-auto">Tickets</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 text-center">
                <a href="/tour" className="btn btn-secondary">View All Dates</a>
            </div>
        </section>
    </Main>
    );
};

export default Welcome;