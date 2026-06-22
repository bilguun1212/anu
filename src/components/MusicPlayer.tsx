"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Дэлгэц дээр дарахад асна:", err));
    }

    const handleFirstClick = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            window.removeEventListener("click", handleFirstClick);
          })
          .catch((e) => console.log(e));
      }
    };

    window.addEventListener("click", handleFirstClick);
    return () => window.removeEventListener("click", handleFirstClick);
  }, [isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log(err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <audio ref={audioRef} src="/bg-music.mp3" loop />
      
      <button
        onClick={togglePlay}
        className="flex items-center gap-3 bg-[#1c1836]/60 backdrop-blur-md border border-pink-500/30 text-pink-400 p-3 px-4 rounded-full shadow-[0_0_20px_rgba(244,143,177,0.25)] hover:bg-[#1c1836]/80 transition-all cursor-pointer text-sm font-semibold select-none border-none"
      >
        {isPlaying ? <Volume2 size={18} className="animate-bounce" /> : <VolumeX size={18} />}
        
        <span>{isPlaying ? "Миний Бүгд 🎵" : "Ая асаах уу? ✨"}</span>

        {/* 📊 Tailwind-ийн arbitrary values ашиглан анимацийг шууд inline загварт оруулсан хэсэг */}
        {isPlaying && (
          <div className="flex items-end gap-[2px] h-3.5 w-5 mb-[2px]">
            <div className="w-[3px] bg-pink-400 rounded-full animate-[bounce_0.8s_infinite_alternative]" style={{ animationDuration: '0.6s' }} />
            <div className="w-[3px] bg-pink-400 rounded-full animate-[bounce_0.5s_infinite_alternative]" style={{ animationDuration: '0.4s', animationDelay: '0.1s' }} />
            <div className="w-[3px] bg-pink-400 rounded-full animate-[bounce_0.7s_infinite_alternative]" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }} />
            <div className="w-[3px] bg-pink-400 rounded-full animate-[bounce_0.6s_infinite_alternative]" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }} />
          </div>
        )}
      </button>
    </div>
  );
}