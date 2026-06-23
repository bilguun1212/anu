"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, Star, X } from "lucide-react";

const allImages = Array.from({ length: 21 }, (_, i) => `/hair${i + 1}.jpg`).filter((_, i) => i !== 9 && i !== 12);

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const toggleFav = (i: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const favImages = allImages.filter((_, i) => favorites.has(i));

  return (
    <main className="min-h-screen bg-[#0b091a] relative overflow-hidden font-sans px-6 py-12">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] bg-pink-600/20 rounded-full blur-[150px] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 bg-white/10 text-white rounded-full text-sm backdrop-blur-md border border-white/20">
              ← Буцах
            </motion.button>
          </Link>
          <AnimatePresence>
            {favorites.size > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/20 border border-pink-500/30 rounded-full">
                <Heart fill="#f472b6" size={13} className="text-pink-400" />
                <span className="text-pink-300 text-xs">{favorites.size} дуртай</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <motion.div animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }}>
            <Star size={36} className="text-yellow-400 mx-auto mb-3" style={{ filter: "drop-shadow(0 0 10px rgba(250,204,21,0.5))" }} />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 mb-2">
            Дуртай зургууд
          </h1>
          <p className="text-purple-200/50 text-sm">Зүрх дарж favorite нэмээрэй💜</p>
          <div className="mt-3 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
        </motion.div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mb-12">
          {allImages.map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -4 }} className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/30 transition-colors">
              <img src={src} alt={`Memory ${i + 1}`} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.button whileTap={{ scale: 1.5 }} onClick={() => toggleFav(i)} className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/40 backdrop-blur-sm transition-all z-10">
                <Heart size={16} fill={favorites.has(i) ? "#f472b6" : "none"} className={favorites.has(i) ? "text-pink-400" : "text-white/60"} />
              </motion.button>
              {favorites.has(i) && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-2 left-2 px-2 py-0.5 bg-pink-500/40 backdrop-blur-sm rounded-full pointer-events-none">
                  <span className="text-pink-200 text-xs">💜 Дуртай</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {favImages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border-t border-white/10 pt-10">
              <h2 className="text-center text-white/50 text-sm mb-6 flex items-center justify-center gap-2">
                <Heart fill="#f472b6" size={14} className="text-pink-400" />
                Миний дуртай цуглуулга
                <Heart fill="#f472b6" size={14} className="text-pink-400" />
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {favImages.map((src, i) => (
                  <motion.div key={src} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedImg(src)} className="w-24 h-24 rounded-xl overflow-hidden cursor-pointer hover:scale-110 transition-transform border border-pink-400/30">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedImg(null)}>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white" onClick={() => setSelectedImg(null)}>
              <X size={20} />
            </motion.button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={selectedImg} alt="" className="max-w-3xl w-full rounded-2xl object-contain max-h-[85vh]" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}