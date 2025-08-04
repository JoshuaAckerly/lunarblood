import React, { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  src: string;   // path to audio file
  type?: string; // default: "audio/mpeg"
  title?: string; // optional track title
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, type = "audio/mpeg", title }) => {

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
    <div className="flex items-center space-x-3 p-3 bg-[var(--accent)] rounded-lg shadow">
      <audio ref={audioRef} controls className="hidden">
        <source src={src} type={type} />
        Your browser does not support the audio element.
      </audio>
      <button
        onClick={isPlaying ? pauseAudio : playAudio}
        className="w-10 h-10 rounded-full bg-[var(--card)] text-white flex items-center justify-center hover:bg-[var(--card-foreground)] transition-colors"
      > {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      {title && <span className="text-sm font-medium">{title}</span>}
    </div>
  );
};

export default AudioPlayer;
