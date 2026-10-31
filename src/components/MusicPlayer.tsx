"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // Hydration алдаанаас сэргийлэх төлөв
  const [barStyles, setBarStyles] = useState<{ duration: string; delay: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const barCount = 24; 

  // Хуудас бүрэн ачаалагдаж дууссаныг шалгах (Сэргийлэлт)
  useEffect(() => {
    setIsMounted(true);

    // Math.random()-ийг зөвхөн клиент талд ачаалагдахад ганцхан удаа үүсгэж өгнө
    const styles = Array.from({ length: barCount }).map(() => ({
      duration: `${0.4 + Math.random() * 0.6}s`,
      delay: `${Math.random() * 0.3}s`,
    }));
    setBarStyles(styles);

    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => console.log("Анхны даралтыг хүлээнэ."));
    }

    const handleFirstClick = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            window.removeEventListener("click", handleFirstClick);
            window.removeEventListener("touchstart", handleFirstClick);
          })
          .catch((e) => console.log(e));
      }
    };

    window.addEventListener("click", handleFirstClick);
    window.addEventListener("touchstart", handleFirstClick);

    return () => {
      window.removeEventListener("click", handleFirstClick);
      window.removeEventListener("touchstart", handleFirstClick);
    };
  }, []);

  // ⏱️ Дууны секунд явах үед ажиллах функц
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Секундыг 0:00 формат руу хөрвүүлэх
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

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

  // Хэрэв клиент талд хараахан бэлэн болоогүй бол түр хугацаанд хоосон буцаана (Hydration-ийг алгасна)
  if (!isMounted) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-1.5 items-end max-w-[200px] w-full">
      <audio 
        ref={audioRef} 
        src="/bg-music.mp3" 
        loop 
        onTimeUpdate={handleTimeUpdate} // Дуу явах бүрд цагийг шинэчилнэ
      />
      
      {/* 🎵 ДЭЭД ТАЛЫН ДУУНЫ НЭР */}
      <div className="text-[11px] font-bold text-pink-400 bg-[#0c0a21]/80 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-pink-500/10 tracking-wide select-none shadow-sm animate-pulse">
        {isPlaying ? "Playing: Дандаа хайртай 🎵" : "Заавал дуугаа сонсож үзээрэй хайраа ☕"}
      </div>

      {/* 🌌 ҮНДСЭН ТОГЛУУЛАГЧ КАПСУЛ */}
      <button
        onClick={togglePlay}
        className="w-full h-14 relative rounded-2xl bg-[#14112a] border border-pink-500/20 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all active:scale-95 cursor-pointer flex items-center px-4 group justify-between"
      >
        {/* 📊 АРД НЬ ХӨДЛӨХ ДУУНЫ ДОЛГИОН */}
        <div className="absolute inset-x-4 bottom-2 top-6 flex items-end justify-between pointer-events-none gap-[2px] opacity-40">
          {Array.from({ length: barCount }).map((_, i) => {
            const duration = isPlaying && barStyles[i] ? barStyles[i].duration : "0s";
            const delay = isPlaying && barStyles[i] ? barStyles[i].delay : "0s";
            
            return (
              <div
                key={i}
                className="w-full bg-pink-500 rounded-t-full transition-all duration-300"
                style={{
                  height: isPlaying ? "100%" : "15%",
                  transformOrigin: "bottom",
                  animation: isPlaying ? `visualizerBars ${duration} infinite alternate ease-in-out` : "none",
                  animationDelay: delay,
                }}
              />
            );
          })}
        </div>

        {/* ТЕКСТ (Жинхэнэ секунд нь энд харагдана) */}
        <span className="text-xs font-bold text-purple-100 z-10 transition-colors group-hover:text-pink-300 select-none">
          {isPlaying ? formatTime(currentTime) : "Асаах"}
        </span>

        {/* ПЛЭЙ ТОВЧ */}
        <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 z-10 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-md">
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-[2px]" fill="currentColor" />}
        </div>
      </button>

      <style jsx global>{`
        @keyframes visualizerBars {
          0% { transform: scaleY(0.15); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}