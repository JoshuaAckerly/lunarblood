import React from "react";
import Main from "@/layouts/main";
import AudioPlayer from "@/components/AudioPlayer";


const cdn = import.meta.env.VITE_ASSET_URL;


const Welcome: React.FC = () => (
    <Main>
        <section
                className="relative z-0 bg-[var(--background)] bg-cover bg-center"
                style={{
                    backgroundImage: `url(${cdn}/images/LunarBlood_Landing.webp)`,
                }}
            >
                <div className="flex flex-col items-center bg-black/50 py-24">
                    <h2 className="text-5xl text-white">Lunar Blood</h2>
                    <h3 className="text-3xl text-white">Dark. Mood. Heavy</h3>
                    <div>
                        <ul className="flex flex-row gap-2 md:gap-10 items-center justify-center text-center text-white">
                            <li className="flex">LISTEN NOW</li>
                            <li className="flex">SHOP MERCH</li>
                            <li className="flex">VIEW TOUR DATES</li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="text-black">
                <h1 className="text-7xl">Band Bio</h1>
                <p className="mt-4 text-lg">
                    Lunar Blood is a band that embodies the essence of darkness and moodiness in their music. With heavy riffs and haunting melodies, they create an atmosphere that captivates listeners and takes them on a journey through their emotional landscape.
                </p>
                <h3 className="text-3xl">FEATURED MUSIC</h3>
                <div>
                    <ul className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
                        <li className="flex-1">
                            <AudioPlayer src={`#`} />
                        </li>
                        <li className="flex-1 hidden md:block">
                            <AudioPlayer src={`#`} />
                        </li>
                    </ul>
                </div>
            </section>
            <section className="text-black">
                <h1 className="text-3xl">Upcoming Tour Dates</h1>
                <hr className="my-4 border-t border-black" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 py-2 border-b border-black">
                        <span>DATE</span>
                        <span>CITY</span>
                        <span>VENUE</span>
                        <span>
                            <a href="#" className="text-blue-600 underline">Buy Tickets</a>
                        </span>
                    </div>
                ))}
            </section>
    </Main>
);

export default Welcome;