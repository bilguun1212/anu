"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, Mail } from "lucide-react";

const letterText = `Миний хайр,

Чамтай байх минут бүр миний амьдралын хамгийн гоё мөч минь.

Чиний инээд, чиний хоолойг сонсоход миний хамаг муу зүйл мартагддаг. Чамайг ярихад зүгээр л сонсоод сууж баймаар сайхан, чамтай байхад бүх зүйл сайхан байдаг юм шүү, хайраа.

19 насны төрсөн өдрөөр чамдаа хамгийн сайхан бүхнийг хүсье. Энэ нас чинь хамгийн гоё, хамгийн баяр хөөртэй, хамгийн дурсамжтай нас болоосой гэж хүсэж байна kk.


Xязгааргүй хайртай kkkkkk,
Чиний хайр Мөнх-Эрдэнэ 💜

P.S. Энэ захидлыг уншиж байгаа чамдаа... хайртай шүү 🌸`;

export default function LetterPage() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const startTyping = () => {
    setStarted(true);
    setIsTyping(true);
    setDisplayedText("");
    setDone(false);
  };

  useEffect(() => {
    if (!isTyping) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < letterText.length) {
        setDisplayedText(letterText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setDone(true);
        setShowHearts(true);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <main className="min-h-screen bg-[#0b091a] relative overflow-hidden font-sans px-4 py-12 flex flex-col items-center justify-center">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] bg-pink-600/20 rounded-full blur-[150px] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating hearts when done */}
      <AnimatePresence>
        {showHearts && Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0, x: `${Math.random() * 100}vw` }}
            animate={{ opacity: [0, 0.7, 0], y: -300 }}
            transition={{ duration: 3 + Math.random() * 2, delay: i * 0.2 }}
            className="fixed bottom-0 pointer-events-none z-20 text-2xl"
          >
            {["💜", "🌸", "💖", "✨"][i % 4]}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 bg-white/10 text-white rounded-full text-sm backdrop-blur-md border border-white/20">
            ← Буцах
          </motion.button>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Mail size={60} className="text-pink-400 mx-auto mb-6" style={{ filter: "drop-shadow(0 0 20px rgba(244,114,182,0.6))" }} />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 mb-3">
                Хайртдаа бичсэн захидал kkk💌
              </h1>
              <p className="text-purple-200/50 text-sm mb-8">Зүрхнээсээ бичсэн захидал аааая 💜</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startTyping}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-semibold rounded-full shadow-lg text-sm"
              >
                Захидал нээх 💌
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1c1836]/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                <Heart fill="#f472b6" size={16} className="text-pink-400" />
                <span className="text-pink-300/70 text-xs">Чамд бичсэн захидал</span>
                {isTyping && (
                  <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="ml-auto w-1.5 h-4 bg-pink-400 rounded-full" />
                )}
              </div>
              <div className="text-white/85 text-sm leading-relaxed whitespace-pre-line font-light min-h-[300px]">
                {displayedText}
                {isTyping && <span className="animate-pulse text-pink-400">|</span>}
              </div>
              {done && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 pt-4 border-t border-white/10 flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    {["💜", "🌸", "💖", "✨", "💜"].map((e, i) => (
                      <motion.span key={i} animate={{ scale: [1, 1.3, 1], y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="text-lg">
                        {e}
                      </motion.span>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startTyping}
                    className="text-purple-400/60 text-xs hover:text-pink-300 transition-colors"
                  >
                    Ахиад уншах 🔄
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}