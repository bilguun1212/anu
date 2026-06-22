"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function LoveGame() {
  const [lovePercent, setLovePercent] = useState(0);

  const handleHeartClick = () => {
    if (lovePercent < 100) {
      setLovePercent((prev) => Math.min(prev + 5, 100));
    }
    
    confetti({
      particleCount: 12,
      angle: Math.random() * 360,
      spread: 60,
      origin: { x: Math.random(), y: Math.random() }
    });

    if (lovePercent + 5 === 100) {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4 text-gray-800 relative font-sans">
      
      <Link 
        href="/" 
        className="absolute top-5 left-5 flex items-center gap-1 text-pink-600 font-semibold hover:underline bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm cursor-pointer z-20"
      >
        <ArrowLeft size={16} /> Буцах
      </Link>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-purple-200/50 text-center relative z-10">
        <h1 className="text-2xl font-bold text-purple-800 mb-2">Миний хайрын хэмжигч 💕</h1>
        <p className="text-sm text-gray-500 mb-6">Зүрхэн дээр дарж хайраа 100% болгоорой хайраа!</p>

        <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden mb-6 relative border border-gray-300 shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-pink-500 to-red-500 h-full"
            animate={{ width: `${lovePercent}%` }}
            transition={{ type: "spring", stiffness: 60 }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-900">
            {lovePercent}%
          </span>
        </div>

        <motion.button
          onClick={handleHeartClick}
          whileTap={{ scale: 0.85 }}
          className="w-40 h-40 bg-pink-50/50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-pink-200 shadow-lg cursor-pointer focus:outline-none"
        >
          <Heart 
            size={80} 
            className={`text-red-500 transition-transform ${lovePercent === 100 ? "animate-bounce" : ""}`} 
            fill={lovePercent > 0 ? "currentColor" : "none"} 
          />
        </motion.button>

        <div className="h-16 flex items-center justify-center px-2">
          {lovePercent === 0 && <p className="text-gray-600 font-medium">Эхлүүлэхийн тулд зүрхэн дээр дар даа babe... 🥰</p>}
          {lovePercent > 0 && lovePercent < 50 && <p className="text-pink-600 font-semibold animate-pulse">Өө, чи зүрхийг минь хурдлуулаад байна аая kkk 💓</p>}
          {lovePercent >= 50 && lovePercent < 100 && <p className="text-red-500 font-bold">Бараг л хязгаартаа тулж байна! 😍🔥</p>}
          {lovePercent === 100 && (
            <div>
              <p className="text-xl font-extrabold text-red-600 animate-pulse">ERROR: Хязгаар давчихлаа! ♾️❤️</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Миний чамд хайртай хайрыг тоогоор хэмжих боломжгүй юм байна kkkkk.</p>
            </div>
          )}
        </div>

        {lovePercent === 100 && (
          <button 
            onClick={() => setLovePercent(0)}
            className="mt-4 text-xs text-purple-600 flex items-center gap-1 mx-auto hover:underline cursor-pointer font-medium"
          >
            <RefreshCw size={12} /> Дахин эхлүүлэх
          </button>
        )}
      </div>
    </div>
  );
}