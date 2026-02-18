import React from "react";
import Main from "@/layouts/main";
import AudioPlayer from "@/components/AudioPlayer";

// Use CDN in production, local images in development
const cdn = import.meta.env.VITE_ASSET_URL || '';
const getImageUrl = (path: string) => cdn ? `${cdn}${path}` : path;

const Listen: React.FC = () => {
    return (
    <Main>
        <section className="mb-12">
            <h1 className="page-title">Listen</h1>
            <p className="page-subtitle">
                Immerse yourself in our dark, atmospheric soundscapes
            </p>
        </section>

        <section className="mb-12">
            <h2 className="section-title">Latest Release</h2>
            <div className="card">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <img 
                            src={getImageUrl('/images/album-cover.jpg')} 
                            alt="Latest Album" 
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Shadows & Echoes</h3>
                        <p className="text-[var(--muted-foreground)] mb-4">
                            Our latest EP explores the depths of human emotion through haunting melodies and crushing riffs.
                        </p>
                        <div className="space-y-3">
                            <AudioPlayer src="#" title="Midnight Reverie" />
                            <AudioPlayer src="#" title="Crimson Tide" />
                            <AudioPlayer src="#" title="Void Walker" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="mb-12">
            <h2 className="section-title">Discography</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: "Shadows & Echoes", year: "2024", type: "EP" },
                    { title: "Blood Moon Rising", year: "2023", type: "Album" },
                    { title: "Dark Horizons", year: "2022", type: "Single" }
                ].map((release, i) => (
                    <div key={i} className="card">
                        <div className="aspect-square bg-[var(--muted)] rounded-lg mb-4"></div>
                        <h3 className="font-semibold">{release.title}</h3>
                        <p className="text-sm text-[var(--muted-foreground)]">{release.year} • {release.type}</p>
                        <div className="mt-4 flex gap-2">
                            <button className="btn btn-primary text-sm">Play</button>
                            <button className="btn btn-secondary text-sm">Buy</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section>
            <h2 className="section-title">Streaming Platforms</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Spotify", "Apple Music", "Bandcamp", "YouTube"].map((platform) => (
                    <a key={platform} href="#" className="btn btn-secondary">
                        {platform}
                    </a>
                ))}
            </div>
        </section>
    </Main>
    );
};

export default Listen;