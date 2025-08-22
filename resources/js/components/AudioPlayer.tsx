import React, { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  src: string;   // path to audio file
  type?: string; // default: "audio/mpeg"
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, type = "audio/mpeg" }) => {

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
    <div className="flex items-center space-x-2 p-2 bg-[var(--accent)] shadow">
      <audio ref={audioRef} controls className="hidden">
        <source src={src} type={type} />
        Your browser does not support the audio element.
      </audio>
      <button
        onClick={isPlaying ? pauseAudio : playAudio}
        className="w-10 h-10 rounded-full bg-[var(--card)]  text-white flex items-center justify-center hover:bg-[var(--card-foreground)] transition-colors"
      > {isPlaying ? <Pause size={28} /> : <Play size={28} />}
      </button>
    </div>
  );
};

export default AudioPlayer;
