import { Pause, Play } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface AudioPlayerProps {
    src: string; // path to audio file
    type?: string; // default: "audio/mpeg"
    title?: string; // optional track title
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, type = 'audio/mpeg', title }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const playAudio = () => {
        audioRef.current?.play();
        setIsPlaying(true);
    };

    const pauseAudio = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    return (
        <div className="flex items-center space-x-3 rounded-lg bg-[var(--accent)] p-3 shadow">
            <audio ref={audioRef} controls className="hidden">
                <source src={src} type={type} />
                Your browser does not support the audio element.
            </audio>
            <button
                onClick={isPlaying ? pauseAudio : playAudio}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--card)] text-white transition-colors hover:bg-[var(--card-foreground)]"
            >
                {' '}
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            {title && <span className="text-sm font-medium">{title}</span>}
        </div>
    );
};

export default AudioPlayer;
