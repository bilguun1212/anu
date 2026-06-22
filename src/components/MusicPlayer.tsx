"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. Браузер зөвшөөрвөл шууд тоглуулахыг оролдоно
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => console.log("Браузер автоматаар тоглуулахыг хориглосон тул анхны даралтыг хүлээнэ."));
    }

    // 2. Дэлгэц дээр хаана ч хамаагүй анхны даралт (товшилт) хийгдэхэд дууг асаах функц
    const handleFirstClick = () => {
      // audioRef.current.paused ашиглан TypeScript-ийн алдааг засав
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            // Дуу нэгэнт ассан тул сонсогчдыг устгаж санах ойг чөлөөлнө
            window.removeEventListener("click", handleFirstClick);
            window.removeEventListener("touchstart", handleFirstClick);
          })
          .catch((e) => console.log("Тоглуулахад алдаа гарлаа:", e));
      }
    };

    // Компьютерын click болон утасны touchstart-ийг хоёуланг нь сонсоно
    window.addEventListener("click", handleFirstClick);
    window.addEventListener("touchstart", handleFirstClick);

    return () => {
      window.removeEventListener("click", handleFirstClick);
      window.removeEventListener("touchstart", handleFirstClick);
    };
  }, []); // Dependency-г хоосон орхиж, хязгааргүй ажиллахаас сэргийлнэ

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Бусад элементүүдийн click event-ийг дарахгүй
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
        className="flex items-center gap-3 bg-[#1c1836]/60 backdrop-blur-md border border-pink-500/30 text-pink-400 p-3 px-4 rounded-full shadow-[0_0_20px_rgba(244,143,177,0.25)] hover:bg-[#1c1836]/80 transition-all cursor-pointer text-sm font-semibold select-none"
      >
        {isPlaying ? <Volume2 size={18} className="animate-bounce" /> : <VolumeX size={18} />}
        
        <span>{isPlaying ? "Миний Бүгд 🎵" : "Ая асаах уу? ✨"}</span>

        {/* 📊 Дууны долгионы анимаци */}
        {isPlaying && (
          <div className="flex items-end gap-[2px] h-3.5 w-5 mb-[2px]">
            <div className="w-[3px] bg-pink-400 rounded-full animate-[bounce_0.6s_infinite_alternate]" />
            <div className="w-[3px] bg-pink-400 rounded-full animate-[bounce_0.4s_infinite_alternate] [animation-delay:0.1s]" />
            <div className="w-[3px] bg-pink-400 rounded-full animate-[bounce_0.7s_infinite_alternate] [animation-delay:0.2s]" />
            <div className="w-[3px] bg-pink-400 rounded-full animate-[bounce_0.5s_infinite_alternate] [animation-delay:0.1s]" />
          </div>
        )}
      </button>
    </div>
  );
}