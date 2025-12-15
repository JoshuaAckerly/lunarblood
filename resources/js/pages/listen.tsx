import React from "react";
import Main from "@/layouts/main";
import AudioPlayer from "@/components/AudioPlayer";
import Seo from "@/components/Seo";

const Listen: React.FC = () => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "MusicAlbum",
        "name": "Shadows & Echoes",
        "byArtist": {
            "@type": "MusicGroup",
            "name": "Lunar Blood"
        },
        "genre": "Heavy Metal",
        "datePublished": "2024",
        "description": "Our latest EP explores the depths of human emotion through haunting melodies and crushing riffs."
    };

    return (
    <Main>
        <section className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Listen</h1>
            <p className="text-[var(--muted-foreground)] mb-8">
                Immerse yourself in our dark, atmospheric soundscapes
            </p>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Latest Release</h2>
            <div className="card">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <img 
                            src="/images/album-cover.jpg" 
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
            <h2 className="text-2xl font-semibold mb-6">Discography</h2>
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
            <h2 className="text-2xl font-semibold mb-6">Streaming Platforms</h2>
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