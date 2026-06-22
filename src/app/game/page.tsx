"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Sparkles, Play, Pause, Heart } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function LovePuzzleGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  // 🧩 ПАЗЛЫН ТӨЛӨВҮҮД
  const [pieces, setPieces] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barCount = 16;
  const gridSize = 3; // 3x3 puzzle

  const shufflePuzzle = () => {
    let arr = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    
    for (let i = 0; i < 20; i++) {
      const idx1 = Math.floor(Math.random() * arr.length);
      const idx2 = Math.floor(Math.random() * arr.length);
      if (idx1 !== idx2) {
        const temp = arr[idx1];
        arr[idx1] = arr[idx2];
        arr[idx2] = temp;
      }
    }

    const isAlreadySolved = arr.every((val, i) => val === i);
    if (isAlreadySolved) {
      shufflePuzzle();
      return;
    }

    setPieces(arr);
    setSolved(false);
    setSelectedIdx(null);
  };

  useEffect(() => {
    setIsMounted(true);
    shufflePuzzle();

    if (!audioRef.current) {
      const audio = new Audio("/hair-music.mp3");
      audio.loop = true;
      audio.volume = 0.4;
      
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audioRef.current = audio;
    }

    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => console.log("Хэрэглэгчийн анхны даралтыг хүлээнэ."));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.ontimeupdate = null;
        audioRef.current = null;
      }
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log(err));
      setIsPlaying(true);
    }
  };

  const handlePieceClick = (index: number) => {
    if (solved) return;

    if (!isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => console.log(err));
      setIsPlaying(true);
    }

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      const newPieces = [...pieces];
      const temp = newPieces[selectedIdx];
      newPieces[selectedIdx] = newPieces[index];
      newPieces[index] = temp;
      
      setPieces(newPieces);
      setSelectedIdx(null);

      const isCorrect = newPieces.every((val, i) => val === i);
      if (isCorrect) {
        setSolved(true);
        triggerWinConfetti();
      }
    }
  };

  const triggerWinConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const frame = () => {
      confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#ec4899", "#ef4444"] });
      confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#ec4899", "#ef4444"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0a21] via-[#1a1235] to-[#2b0f29] flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden select-none">
      
      {/* 🪄 CSS `@keyframes`-ийг JSX-д ямар нэгэн алдаагүй, цэвэрхэн таньж уншихаар энд бичиж өгөв */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes customSoundWave {
          0%, 100% { height: 20%; }
          50% { height: 95%; }
        }
      `}} />

      {/* Буцах товч */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-pink-400 font-medium hover:text-pink-300 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg text-xs z-20 transition-all active:scale-95">
        <ArrowLeft size={14} /> Буцах
      </Link>

      {/* 🌌 ХӨГЖИМ ТОГЛУУЛАГЧ КАПСУЛ */}
      <div className="absolute top-6 right-6 flex flex-col gap-1 items-end max-w-[140px] w-full z-20">
        <span className="text-[10px] font-bold text-pink-400 select-none animate-pulse block truncate w-full text-right">
          {isPlaying ? "Playing: Дурсамж 🎵" : "Заавал дуугаа сонсоорой хайраа ☕"}
        </span>
        <button onClick={toggleMusic} className="w-full h-10 relative rounded-xl bg-[#1c1836]/80 border border-pink-500/30 overflow-hidden shadow-md flex items-center px-3 justify-between group focus:outline-none">
          <div className="absolute inset-x-3 bottom-1 top-4 flex items-end justify-between pointer-events-none gap-[3px] opacity-40">
            {Array.from({ length: barCount }).map((_, i) => {
              // Баганууд зэрэг биш өөр өөр хугацаанд савлах саатал (delay)
              const delay = (i % 4) * 0.15;
              const duration = 0.6 + (i % 3) * 0.2;
              return (
                <div 
                  key={i} 
                  className="w-full bg-pink-500 rounded-t-full" 
                  style={{ 
                    height: "25%",
                    animation: isPlaying ? `customSoundWave ${duration}s ease-in-out ${delay}s infinite alternate` : "none",
                    transition: "height 0.3s"
                  }} 
                />
              );
            })}
          </div>
          <span className="text-[11px] font-bold text-purple-100 z-10">{formatTime(currentTime)}</span>
          <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 z-10">
            {isPlaying ? <Pause size={10} fill="currentColor" /> : <Play size={10} className="ml-[2px]" fill="currentColor" />}
          </div>
        </button>
      </div>

      {/* ҮНДСЭН КАРТ */}
      <div className="max-w-md w-full bg-[#1c1836]/60 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 text-center z-10 flex flex-col items-center">
        
        <div className="flex items-center justify-center gap-1.5 mb-1 text-pink-400">
          <Sparkles size={16} className="animate-pulse" />
          <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent tracking-wide">
            Манай Дурсамжийн Пазл
          </h1>
          <Sparkles size={16} className="animate-pulse" />
        </div>
        <p className="text-xs text-purple-200/60 mb-4">
          {solved ? "Писсссс аая, мундаг байна шүү хайраа❤️" : "Зургуудын байрыг сольж, бид хоёрын нандин зургийг бүтээгээрэй 🥰"}
        </p>

        {/* 🧩 ҮНДСЭН ПАЗЛЫН СҮЛЖЭЭ (GRID) */}
        <div className="w-72 h-72 sm:w-80 sm:h-80 grid grid-cols-3 gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner overflow-hidden relative">
          {pieces.map((pieceValue, currentIdx) => {
            const origX = (pieceValue % gridSize) * 50; 
            const origY = Math.floor(pieceValue / gridSize) * 50;

            return (
              <motion.div
                key={pieceValue}
                onClick={() => handlePieceClick(currentIdx)}
                className={`relative cursor-pointer rounded-md overflow-hidden transition-all duration-200 border ${
                  selectedIdx === currentIdx ? "border-pink-500 scale-95 shadow-[0_0_15px_rgba(236,72,153,0.5)] z-20" : "border-white/10"
                }`}
                whileHover={{ scale: solved ? 1 : 1.02 }}
                style={{
                  backgroundImage: "url('/hair1.jpg')",
                  backgroundSize: "300% 300%",
                  backgroundPosition: `${origX}% ${origY}%`,
                }}
              >
                {selectedIdx === currentIdx && (
                  <div className="absolute inset-0 bg-pink-500/30 animate-pulse" />
                )}
              </motion.div>
            );
          })}
          
          {solved && (
            <div className="absolute inset-0 bg-pink-500/10 pointer-events-none flex items-center justify-center backdrop-blur-[1px]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Heart size={80} className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" fill="currentColor" />
              </motion.div>
            </div>
          )}
        </div>

        {/* ТЕКСТ / СҮҮЛЧИЙН ҮГ */}
        <div className="h-16 flex items-center justify-center mt-4 px-2">
          {solved ? (
            <div>
              <p className="text-sm font-black text-red-400 drop-shadow-md">Эвлүүлж дууслаа хайрааааа ♾️❤️</p>
              <p className="text-[11px] text-purple-200/70 font-light mt-0.5 leading-relaxed">
                Яг энэ puzzle шиг бид хоёрын дурсамж бүхэн нийлж байж миний хамгийн нандин зүрхийг бүтээдэг юм шүү. Хайртай шүү чамдаа! 🥰
              </p>
            </div>
          ) : (
            <p className="text-xs text-purple-300/50 italic">
              {selectedIdx !== null ? "Байрыг нь солих дараагийн хэсгээ сонгоорой..." : "Хэсгүүд дээр дарж байрыг нь оригиналь болгоорой."}
            </p>
          )}
        </div>

        {/* ДАХИН ЭХЛҮҮЛЭХ ТОВЧ */}
        {solved && (
          <button onClick={shufflePuzzle} className="mt-2 text-[11px] text-purple-400 hover:text-pink-400 flex items-center gap-1.5 font-medium transition-colors cursor-pointer bg-transparent border-none">
            <RefreshCw size={11} /> Ахиад эвлүүлж тоглох уу baeee?
          </button>
        )}
      </div>
    </div>
  );
}