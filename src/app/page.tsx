"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, BookOpen, Gamepad2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import MusicPlayer from "./../components/MusicPlayer";

// ❤️ Намуухан унах зүрхнүүдийн өгөгдлийн төрөл
interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

export default function BirthdaySurprise() {
  const [step, setStep] = useState(0);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  const galleryImages = [
    "/hair1.jpg",
    "/hair2.jpg",
    "/hair3.jpg",
    "/hair4.jpg",
    "/hair5.jpg"
  ];

  // Шаар задлах биш, агаарт зөөлөн унах зүрхнүүдийг үүсгэх хэсэг
  useEffect(() => {
    const generatedHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,         // Дэлгэцийн хөндлөн байршил (0% - 100%)
      size: Math.random() * 14 + 10,   // 10px-ээс 24px хэмжээтэй жижиг зүрхнүүд
      delay: Math.random() * 6,       // Цувж гарч ирэх хугацаа
      duration: Math.random() * 6 + 6  // 6-аас 12 секундын хооронд маш намуухан унана
    }));
    setHearts(generatedHearts);
  }, [step]);

  const nextStep = () => setStep((prev) => prev + 1);
  
  const nextImage = () => {
    setCurrentImgIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImgIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center font-sans overflow-x-hidden p-4 sm:p-6 md:p-8 relative text-gray-100 selection:bg-pink-500/30"
      style={{ backgroundImage: "url('/hair1.jpg')" }} 
    >
      {/* 🎭 Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b091a]/90 via-[#161233]/85 to-[#2d122b]/90 backdrop-blur-[6px] pointer-events-none" />
      
      {/* 🌌 НАМУУХАН ДЭЭРЭЭС УНАХ РОМАНТИК ЗҮРХНҮҮД */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: "-10%", x: `${heart.x}%`, opacity: 0, rotate: 0 }}
            animate={{ 
              y: "110vh", 
              opacity: [0, 0.6, 0.6, 0], // Дээрээс гарахдаа уусаад, голд тодорч, доор ороод алга болно
              rotate: [0, 30, -30, 0]    // Замдаа зөөлөн ганхаж унана
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear"
            }}
            className="absolute text-pink-500/25"
            style={{ width: heart.size, height: heart.size }}
          >
            <Heart size={heart.size} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* 🌟 Одод */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[15%] left-[10%] sm:left-[20%] w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-[35%] left-[85%] w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse duration-1000" />
        <div className="absolute bottom-[25%] left-[5%] w-1 h-1 bg-purple-300 rounded-full animate-pulse duration-700" />
        <div className="absolute bottom-[15%] right-[15%] w-1.5 h-1.5 bg-white rounded-full animate-ping duration-1500" />
      </div>

      {/* 🔮 Неон гэрлүүд */}
      <div className="absolute top-[-10%] left-[-20%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-pink-500/15 blur-[120px] pointer-events-none" />

      {/* 1. Хөгжим тоглуулагч */}
      <MusicPlayer />

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[360px] xs:max-w-sm sm:max-w-md bg-[#1c1836]/50 backdrop-blur-2xl rounded-3xl p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 text-center relative z-10 my-auto"
        >
          {step === 0 && (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-pink-400/40 shadow-[0_0_20px_rgba(244,143,177,0.3)] mb-5 sm:mb-6">
                <img src="/hair1.jpg" alt="Миний хайр 1" className="w-full h-full object-cover" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent tracking-wide">
                Happy 19th Birthday! 🎉
              </h1>
              <p className="text-purple-200/80 mb-5 sm:mb-6 leading-relaxed text-xs sm:text-sm font-light px-1">
                Өнөөдөр бол миний амьдралын хамгийн нандин, хамгийн хөөрхөн охины 19 насны төрсөн өдөр! ❤️ 
              </p>
              <button 
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-full shadow-[0_4px_15px_rgba(244,143,177,0.3)] hover:opacity-90 active:scale-[0.98] transition duration-200 cursor-pointer border-none text-sm sm:text-base"
              >
                Нээж үзэх ✨
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.3)] mb-5 sm:mb-6">
                <img src="/hair2.jpg" alt="Миний хайр 2" className="w-full h-full object-cover" />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent px-1">
                ЭШ-д нь Амжилт, миний ухаантай охин! 🧠📚
              </h1>
              <p className="text-purple-200/80 mb-5 sm:mb-6 leading-relaxed font-light text-xs sm:text-sm px-1">
                Төрсөн өдөр чинь ЭШ-тэй давхцаж байгаад битгий гуниглаарай, миний охин. 
                Шалгалтаа маш мундаг, сайн хийгээрэй миний хайр! Бүх зүйлийг маш сайн хийж чадна 
                гэдэгт чинь би зуун хувь итгэлтэй байгаа шүү. Чи минь хамгийн мундаг нь!❤️
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-5 sm:mb-6">
                <span className="bg-pink-500/10 text-pink-300 text-[11px] sm:text-xs font-medium px-2.5 py-1 sm:py-1.5 rounded-full flex items-center gap-1 border border-pink-500/20">
                  <BookOpen size={12} /> 800 оноо аваарай хайраааааа! 📖✨
                </span>
                <span className="bg-purple-500/10 text-purple-300 text-[11px] sm:text-xs font-medium px-2.5 py-1 sm:py-1.5 rounded-full flex items-center gap-1 border border-purple-500/20">
                  <Heart size={12} fill="currentColor" /> Хязгааргүй хайртай шүү
                </span>
              </div>
              
              <button 
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-full shadow-[0_4px_15px_rgba(34,211,238,0.2)] active:scale-[0.98] transition duration-200 cursor-pointer border-none text-sm sm:text-base"
              >
                Сүүлчийн үг... 💌
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center">
              <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden mb-5 sm:mb-6 border border-white/10 shadow-lg">
                <img 
                  src={galleryImages[currentImgIdx]} 
                  alt={`Манай дурсамж ${currentImgIdx + 1}`} 
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-1.5 rounded-full text-white hover:bg-black/60 active:scale-90 transition cursor-pointer border-none"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-1.5 rounded-full text-white hover:bg-black/60 active:scale-90 transition cursor-pointer border-none"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                  {galleryImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImgIdx ? "bg-pink-400 scale-125" : "bg-white/40"}`}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-1 text-pink-300 drop-shadow-[0_0_10px_rgba(244,143,177,0.25)]">Хайртай шүү! ❤️</h2>
              <p className="text-[10px] sm:text-[11px] text-purple-300/60 italic mb-4">"6 сарын 26 — Чи миний амьдралын хамгийн том бэлэг"</p>
              
              <div className="bg-black/20 rounded-2xl p-4 sm:p-5 text-left border border-white/5 text-purple-200/90 text-xs sm:text-sm leading-relaxed font-light mb-5 sm:mb-6 max-h-[140px] overflow-y-auto shadow-inner custom-scrollbar">
                Шалгалтаа яг өөрийнхөөрөө, аймаар тайван, тууштай өгөөрэй миний хайр. 
                Сандрах хэрэггүй шүү, чи бүгдийг чадна. Шалгалт чинь дуусангуут би хамгийн 
                түрүүнд баярыг чинь тэмдэглээд, чамайг чанга гэгч нь тэврээд хүлээж байх болохоор 
                зүгээр л хичээгээрэй. 19 насны төрсөн өдрийн мэнд хүргэе, миний гүнж! 👸🎈❤️
              </div>
              
              <Link href="/game" className="block w-full mb-4 no-underline">
                <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-none transition-all">
                  <Gamepad2 size={16} /> Хайрын тоглоом тоглох уу?
                </button>
              </Link>

              <button 
                onClick={() => {
                  setStep(0);
                  setCurrentImgIdx(0);
                }}
                className="text-purple-400/70 font-medium text-[11px] sm:text-xs hover:text-pink-300 cursor-pointer bg-transparent border-none transition-colors"
              >
                Ахиад дараад ахиад үзэж болно шүү, хайраа 🔄
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}