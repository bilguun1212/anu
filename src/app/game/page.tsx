"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, RefreshCw, Sparkles, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

export default function LoveGame() {
  const [lovePercent, setLovePercent] = useState(0);
  const [gameHearts, setGameHearts] = useState<FloatingHeart[]>([]);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1-ээс 21 хүртэлх бүх зургуудыг массивт оруулах
  const loveImages = Array.from({ length: 21 }, (_, i) => `/hair${i + 1}.jpg`);

  // Зүүн болон баруун талын урсгалд зургуудыг хуваарилах
  const leftStream = loveImages.filter((_, i) => i % 2 === 0);
  const rightStream = loveImages.filter((_, i) => i % 2 !== 0);

  useEffect(() => {
    // Арын намуухан унах зүрхнүүд
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 12 + 8,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 6,
    }));
    setGameHearts(generated);

    // 🎵 ХӨГЖИМ ТОГЛУУЛАХ ХЭСЭГ
    audioRef.current = new Audio("/hair-music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4; // Арын ая учраас намуухан чангатай байна

    // Хэрэглэгч хуудас руу ормогц автомат тоглуулахыг оролдоно
    const playAudio = () => {
      audioRef.current?.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          console.log("Браузер шууд тоглуулахыг хориглосон тул дарахыг хүлээнэ.");
        });
    };

    playAudio();

    // Хуудаснаас гарахад дууг унтраана
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Хөгжим асааж унтраах функц
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleHeartClick = () => {
    let nextPercent = lovePercent;
    
    // Зүрхэн дээр анх дарах үед хэрэв дуу нь яваагүй байвал тоглуулна (Браузерын хамгаалалтыг нээх)
    if (!isPlaying && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }

    if (lovePercent < 100) {
      nextPercent = Math.min(lovePercent + 5, 100);
      setLovePercent(nextPercent);
      setCurrentImgIdx((prev) => (prev + 1) % loveImages.length);
    }
    
    confetti({
      particleCount: 15,
      angle: Math.random() * 360,
      spread: 70,
      colors: ["#ec4899", "#ef4444", "#f472b6"],
      origin: { x: 0.5, y: 0.5 }
    });

    if (nextPercent === 100) {
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#ec4899", "#ef4444"] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#ec4899", "#ef4444"] });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0a21] via-[#1a1235] to-[#2b0f29] flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden select-none">
      
      {/* 🎞️ ЗҮҮН ТАЛААР УРСАХ ЗУРГУУД */}
      <div className="absolute left-1 sm:left-6 top-0 bottom-0 w-12 sm:w-24 overflow-hidden pointer-events-none z-0 opacity-25">
        <motion.div 
          className="flex flex-col gap-3 py-4"
          animate={{ y: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          {[...leftStream, ...leftStream].map((src, idx) => (
            <img key={`left-${idx}`} src={src} alt="memory" className="w-full h-16 sm:h-32 object-cover rounded-xl sm:rounded-2xl border border-white/10 shadow-md" />
          ))}
        </motion.div>
      </div>

      {/* 🎞️ БАРУУН ТАЛААР УРСАХ ЗУРГУУД */}
      <div className="absolute right-1 sm:right-6 top-0 bottom-0 w-12 sm:w-24 overflow-hidden pointer-events-none z-0 opacity-25">
        <motion.div 
          className="flex flex-col gap-3 py-4"
          animate={{ y: ["-50%", "0%"] }}
          transition={{ ease: "linear", duration: 28, repeat: Infinity }}
        >
          {[...rightStream, ...rightStream].map((src, idx) => (
            <img key={`right-${idx}`} src={src} alt="memory" className="w-full h-16 sm:h-32 object-cover rounded-xl sm:rounded-2xl border border-white/10 shadow-md" />
          ))}
        </motion.div>
      </div>

      {/* 🌌 Арын намуухан зүрхнүүд */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
        {gameHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: "-10%", x: `${heart.x}%`, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: heart.duration, repeat: Infinity, delay: heart.delay, ease: "linear" }}
            className="absolute text-pink-400"
            style={{ width: heart.size, height: heart.size }}
          >
            <Heart size={heart.size} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Буцах товч */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-pink-400 font-medium hover:text-pink-300 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg text-xs cursor-pointer z-20 transition-all active:scale-95"
      >
        <ArrowLeft size={14} /> Буцах
      </Link>

      {/* 🎵 ХӨГЖМИЙН ХӨӨРХӨН ТОВЧЛУУР (Баруун дээд буланд) */}
      <button 
        onClick={toggleMusic}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-pink-400 hover:text-pink-300 shadow-lg cursor-pointer z-20 transition-all active:scale-95 focus:outline-none"
      >
        {isPlaying ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
            <Volume2 size={18} />
          </motion.div>
        ) : (
          <VolumeX size={18} className="text-purple-400/60" />
        )}
      </button>

      {/* Үндсэн карт */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[340px] xs:max-w-sm w-full bg-[#1c1836]/60 backdrop-blur-2xl rounded-3xl p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 text-center relative z-10"
      >
        <div className="flex items-center justify-center gap-1.5 mb-1.5 text-pink-400">
          <Sparkles size={16} className="animate-pulse" />
          <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent tracking-wide">
            Миний Хайрын Хэмжигч
          </h1>
          <Sparkles size={16} className="animate-pulse" />
        </div>
        <p className="text-xs sm:text-sm text-purple-200/60 mb-6 font-light">
          Зүрхэн дээр дарж миний чамд хайртай хайрыг дүүргээрэй, хайраа!
        </p>

        {/* Прогресс бар */}
        <div className="w-full bg-black/30 h-5 rounded-full overflow-hidden mb-8 relative border border-white/5 p-[2px] shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 h-full rounded-full relative"
            animate={{ width: `${lovePercent}%` }}
            transition={{ type: "spring", stiffness: 45, damping: 15 }}
          >
            {lovePercent > 10 && (
              <motion.div 
                className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full blur-[1px]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </motion.div>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-black text-white tracking-wider drop-shadow-md">
            {lovePercent}%
          </span>
        </div>

        {/* 💖 ГОЛЫН ТОМ ЗҮРХ БОЛОН ДАРЖ СОЛИГДОХ ЗУРАГ */}
        <div className="relative w-40 h-40 flex items-center justify-center mx-auto mb-8">
          <AnimatePresence>
            {lovePercent > 0 && (
              <motion.div
                className="absolute inset-0 bg-pink-500/10 rounded-full border border-pink-500/20"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
          
          <motion.button
            onClick={handleHeartClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.9 }}
            className="w-36 h-36 bg-[#251f47]/60 rounded-full flex items-center justify-center border border-pink-500/30 shadow-[0_0_30px_rgba(244,143,177,0.15)] cursor-pointer focus:outline-none z-10 hover:bg-[#251f47]/80 hover:border-pink-500/50 transition-colors relative overflow-hidden group"
          >
            <Heart 
              size={120} 
              className={`absolute text-pink-500/15 transition-all duration-300 ${lovePercent === 100 ? "text-red-500/20" : ""}`} 
              fill="currentColor"
            />
            
            {/* 📸 Зүрхэн хэлбэртэй маск */}
            <div 
              className="w-24 h-24 overflow-hidden relative border-2 border-pink-400/50 bg-[#1c1836]"
              style={{ clipPath: "path('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z')", transform: "scale(4.1) translate(1px, 1px)" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImgIdx}
                  src={loveImages[currentImgIdx]}
                  alt="Хайртай зураг"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-[24px] h-[24px] object-cover"
                />
              </AnimatePresence>
            </div>
          </motion.button>
        </div>

        {/* Доод талын үгнүүд */}
        <div className="h-20 flex items-center justify-center px-1">
          <AnimatePresence mode="wait">
            <motion.div key={lovePercent} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-center">
              {lovePercent === 0 && <p className="text-purple-200/80 font-light text-xs sm:text-sm">Эхлүүлэхийн тулд зүрхэн дээр дараарай, миний хайр 🥰</p>}
              {lovePercent > 0 && lovePercent < 35 && <p className="text-pink-400 font-medium text-xs sm:text-sm">Өө, чи зүрх аваад аая kkk 💓</p>}
              {lovePercent >= 35 && lovePercent < 70 && <p className="text-pink-300 font-semibold text-xs sm:text-sm">Чамайг дарах тусам чамд улам ихээр дурлаад байх шиг 😍</p>}
              {lovePercent >= 70 && lovePercent < 100 && <p className="text-red-400 font-bold text-xs sm:text-sm animate-pulse">Миний зүрх бараг л дүүрлээ ааааааааа! Хурдлаарай хайраа😍❤️</p>}
              {lovePercent === 100 && (
                <div className="space-y-1">
                  <p className="text-base sm:text-lg font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">ERROR: Зүрх дуус kkkkk ♾️❤️</p>
                  <p className="text-[11px] sm:text-xs text-purple-200/70 font-light leading-relaxed">Миний чамд хайртай хайрыг ямар ч тоо эсвэл 100%-иар хэмжих боломжгүй юм байна хөөрхөнөө, чи минь миний хувьд хязгааргүй ааая 💖</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Дахин эхлүүлэх */}
        {lovePercent === 100 && (
          <motion.button 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setLovePercent(0); setCurrentImgIdx(0); }}
            className="mt-5 text-[11px] text-purple-400/80 hover:text-pink-400 flex items-center gap-1.5 mx-auto cursor-pointer font-medium transition-colors bg-transparent border-none"
          >
            <RefreshCw size={11} /> Ахиад зүрх авах уу kkk?
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}