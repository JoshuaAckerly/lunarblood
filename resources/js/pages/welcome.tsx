import React from "react";
import Main from "@/layouts/main";
import AudioPlayer from "@/components/AudioPlayer";


const cdn = import.meta.env.VITE_ASSET_URL;


const Welcome: React.FC = () => (
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
            <div className="relative z-10 py-28 text-center">
                <h1 className="text-6xl font-extrabold text-white drop-shadow-lg fade-in">Lunar Blood</h1>
                <p className="mt-4 text-xl text-white/90 fade-in">Dark. Mood. Heavy — music that reverberates in the bones.</p>

                <div className="mt-8 flex items-center justify-center gap-4">
                    <a href="#listen" className="btn btn-primary">Listen Now</a>
                    <a href="#shop" className="btn btn-secondary">Shop Merch</a>
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

        <section id="tour" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Tour Dates</h2>
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 items-center p-4 glass rounded-lg">
                        <div className="col-span-2 text-sm font-medium">DATE</div>
                        <div className="col-span-4">CITY</div>
                        <div className="col-span-4">VENUE</div>
                        <div className="col-span-2 text-right">
                            <a href="#" className="btn btn-primary">Buy Tickets</a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </Main>
);

export default Welcome;