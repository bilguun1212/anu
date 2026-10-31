"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { X, Heart, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "circle" | "heart" | "star";
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  startTime: number;
  emoji: string;
}

const EMOJIS = ["💜", "💖", "✨", "🌸", "💫", "🩷"];

export default function GalleryPage() {
  const images = Array.from({ length: 21 }, (_, i) => `/hair${i + 1}.jpg`).filter((_, i) => i !== 9 && i !== 12);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());
  const [showLoveMessage, setShowLoveMessage] = useState(false);
  const [totalHearts, setTotalHearts] = useState(0);
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 6,
      type: (["circle", "heart", "star"] as const)[Math.floor(Math.random() * 3)],
    }))
  );
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.15], [0, -30]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = false;
  }, []);

  // Хайр дурлалын мэдээс 3 секундын дараа харуулах
  useEffect(() => {
    const t = setTimeout(() => setShowLoveMessage(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const addFloatingHeart = useCallback((x: number, y: number) => {
    const hearts = Array.from({ length: 4 }, () => ({
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 60,
      y: y,
      startTime: Date.now(),
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }));
    setFloatingHearts((prev) => [...prev, ...hearts]);
    setTotalHearts((prev) => prev + 1);
    setTimeout(() => {
      const ids = hearts.map((h) => h.id);
      setFloatingHearts((prev) => prev.filter((h) => !ids.includes(h.id)));
    }, 2200);
  }, []);

  const toggleLike = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedImages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    addFloatingHeart(e.clientX, e.clientY);
  }, [addFloatingHeart]);

  const handleImageClick = (src: string, index: number, e: React.MouseEvent) => {
    setSelectedImg(src);
    setSelectedIndex(index);
    addFloatingHeart(e.clientX, e.clientY);
  };

  const handlePrev = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    if (e && "stopPropagation" in e) e.stopPropagation();
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      const newIndex = (prev - 1 + images.length) % images.length;
      setSelectedImg(images[newIndex]);
      return newIndex;
    });
  }, [images]);

  const handleNext = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    if (e && "stopPropagation" in e) e.stopPropagation();
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      const newIndex = (prev + 1) % images.length;
      setSelectedImg(images[newIndex]);
      return newIndex;
    });
  }, [images]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  const closeModal = useCallback(() => {
    setSelectedImg(null);
    setSelectedIndex(null);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedImg) return;
      if (e.key === "ArrowRight") handleNext(e);
      if (e.key === "ArrowLeft") handlePrev(e);
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedImg, handleNext, handlePrev, closeModal]);

  const likedCount = likedImages.size;

  return (
    <main ref={containerRef} className="min-h-screen bg-[#0b091a] relative overflow-hidden font-sans">

      {/* Animated gradient orbs */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] bg-pink-600/20 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-rose-500/10 rounded-full blur-[130px] pointer-events-none"
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -100, 0], opacity: [0, 0.6, 0], rotate: [0, 180, 360] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {p.type === "heart" ? (
            <Heart fill="#f472b640" size={p.size * 2} className="text-pink-400/30" />
          ) : p.type === "star" ? (
            <Sparkles size={p.size * 2} className="text-purple-300/20" />
          ) : (
            <div
              className="rounded-full bg-pink-400/20"
              style={{ width: p.size, height: p.size }}
            />
          )}
        </motion.div>
      ))}

      {/* Floating hearts / emojis on click */}
      <AnimatePresence>
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, y: 0, scale: 0.4, rotate: Math.random() * 40 - 20 }}
            animate={{ opacity: 0, y: -160, scale: 1.8, rotate: Math.random() * 40 - 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="fixed pointer-events-none z-[100] text-2xl select-none"
            style={{ left: heart.x - 14, top: heart.y - 14 }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Love message toast */}
      <AnimatePresence>
        {showLoveMessage && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-xl border border-pink-400/30 rounded-2xl flex items-center gap-2 shadow-lg"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-lg"
            >
              💜
            </motion.span>
            <span className="text-white/90 text-sm font-medium">Хамтдаа байсан хамгийн гоё мөчүүд...</span>
            <button
              onClick={() => setShowLoveMessage(false)}
              className="ml-1 text-white/40 hover:text-white/80 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="flex flex-col items-center mb-16 relative"
        >
          <Link href="/" className="absolute left-0 top-0 md:top-2">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-md border border-white/20 transition-all"
            >
              ← Буцах
            </motion.button>
          </Link>

          {/* Stats top right */}
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <AnimatePresence>
              {likedCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/20 border border-pink-500/30 rounded-full"
                >
                  <Heart fill="#f472b6" size={13} className="text-pink-400" />
                  <span className="text-pink-300 text-xs font-medium">{likedCount}</span>
                </motion.div>
              )}
            </AnimatePresence>
            {totalHearts > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full"
              >
                <Sparkles size={11} className="text-purple-300/60" />
                <span className="text-purple-300/60 text-xs">{totalHearts}</span>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-center mt-12 md:mt-0"
          >
            {/* Animated hearts row */}
            <div className="flex items-center justify-center gap-3 mb-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1], y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                >
                  <Heart
                    fill="#f472b6"
                    size={i === 1 ? 36 : 22}
                    className="text-pink-400"
                    style={{ filter: "drop-shadow(0 0 8px rgba(244,114,182,0.5))" }}
                  />
                </motion.div>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 mb-3">
              Бидний нандин дурсамжууд
            </h1>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-purple-200/70 text-sm"
            >
              Хамтдаа өнгөрүүлсэн хамгийн гоё мөчүүдийн нэгээхэн хэсэг 💜
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="mt-4 h-px w-48 mx-auto bg-gradient-to-r from-transparent via-pink-400/60 to-transparent"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full"
            >
              <Sparkles size={12} className="text-purple-300/50" />
              <span className="text-purple-300/60 text-xs">{images.length + 1} дурсамж</span>
              <Sparkles size={12} className="text-purple-300/50" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Gallery grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5 space-y-4 md:space-y-5">
          {/* VIDEO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-white/10 bg-black"
          >
            <video
              ref={videoRef}
              src="/hair.mp4"
              className="w-full h-auto object-cover"
              playsInline
              preload="auto"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
              <div className="flex items-center gap-2">
                <motion.button whileTap={{ scale: 0.85 }} onClick={toggleVideoPlay}
                  className="p-2 rounded-full bg-white/25 backdrop-blur-sm text-white hover:bg-white/35 transition-colors">
                  {isVideoPlaying ? <Pause size={13} fill="white" /> : <Play size={13} fill="white" />}
                </motion.button>
                <motion.button whileTap={{ scale: 0.85 }} onClick={toggleMute}
                  className="p-2 rounded-full bg-white/25 backdrop-blur-sm text-white hover:bg-white/35 transition-colors">
                  {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </motion.button>
                <span className="text-white/60 text-xs ml-auto font-medium">🎬 Видео</span>
              </div>
            </div>
            {/* Special video badge */}
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-pink-500/40 backdrop-blur-sm rounded-full border border-pink-400/30">
              <span className="text-pink-200 text-xs font-medium">✨ Special</span>
            </div>
            <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-pink-400/50 transition-all duration-300 pointer-events-none" />
          </motion.div>

          {/* IMAGES */}
          {images.map((src, i) => (
            <motion.div
              key={i}
              layoutId={`gallery-image-${i}`}
              initial={{ opacity: 0, y: 30, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.035, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/40 transition-colors duration-300"
              onClick={(e) => handleImageClick(src, i, e)}
            >
              <img
                src={src}
                alt={`Memory ${i + 1}`}
                className="w-full object-cover transform group-hover:scale-106 transition-transform duration-600"
                loading="lazy"
              />
              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/0 via-white/0 to-purple-500/0 group-hover:from-pink-500/5 group-hover:via-white/5 group-hover:to-purple-500/5 transition-all duration-500" />
              {/* Bottom overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-3 gap-1">
                <span className="text-white/50 text-xs">{i + 1} / {images.length}</span>
              </div>
              {/* Like button hover */}
              <motion.button
                whileTap={{ scale: 1.6 }}
                onClick={(e) => toggleLike(i, e)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              >
                <Heart
                  size={15}
                  fill={likedImages.has(i) ? "#f472b6" : "none"}
                  className={likedImages.has(i) ? "text-pink-400" : "text-white/70"}
                />
              </motion.button>
              {/* Liked permanent indicator */}
              {likedImages.has(i) && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-pink-500/40 backdrop-blur-sm pointer-events-none z-10"
                >
                  <Heart size={15} fill="#f472b6" className="text-pink-400" />
                </motion.div>
              )}
              <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 ring-pink-400/30 transition-all duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-20 pb-10 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                <Heart fill="#f472b620" size={12} className="text-pink-400/20" />
              </motion.div>
            ))}
          </div>
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-purple-300/40 text-xs tracking-widest uppercase"
          >
            {images.length + 1} дурсамж • 
          </motion.div>
          <motion.p
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="text-pink-300/30 text-xs italic"
          >
            "Хайр бол хамгийн гоё дурсамж kkk" 💜
          </motion.p>
        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Close */}
            <motion.button
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={closeModal}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all z-10"
            >
              <X size={20} />
            </motion.button>

            {/* Counter */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
            >
              <span className="text-white/40 text-sm tabular-nums">
                {(selectedIndex ?? 0) + 1} / {images.length}
              </span>
              {likedImages.has(selectedIndex ?? -1) && (
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart fill="#f472b6" size={13} className="text-pink-400" />
                </motion.span>
              )}
            </motion.div>

            {/* Prev */}
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handlePrev(e)}
              className="absolute left-3 md:left-6 p-3 rounded-full bg-white/10 text-white transition-all z-10"
            >
              <ChevronLeft size={22} />
            </motion.button>

            {/* Next */}
            <motion.button
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleNext(e)}
              className="absolute right-3 md:right-6 p-3 rounded-full bg-white/10 text-white transition-all z-10"
            >
              <ChevronRight size={22} />
            </motion.button>

            {/* Image container */}
            <motion.div
              layoutId={`gallery-image-${selectedIndex}`}
              className="relative max-w-4xl w-full mx-14 md:mx-20"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImg}
                  src={selectedImg}
                  alt="Selected memory"
                  initial={{ opacity: 0, scale: 0.93, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -30 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="w-full rounded-2xl object-contain max-h-[82vh]"
                  style={{ filter: "drop-shadow(0 0 30px rgba(244,114,182,0.15))" }}
                />
              </AnimatePresence>

              {/* Bottom actions */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 px-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1.4 }}
                  onClick={(e) => {
                    if (selectedIndex !== null) toggleLike(selectedIndex, e);
                    addFloatingHeart(e.clientX, e.clientY);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white/80 hover:bg-pink-500/20 hover:border-pink-500/40 transition-all duration-300"
                >
                  <motion.span
                    animate={likedImages.has(selectedIndex ?? -1) ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Heart
                      size={16}
                      fill={likedImages.has(selectedIndex ?? -1) ? "#f472b6" : "none"}
                      className={likedImages.has(selectedIndex ?? -1) ? "text-pink-400" : "text-white/60"}
                    />
                  </motion.span>
                  <span className="text-xs font-medium">
                    {likedImages.has(selectedIndex ?? -1) ? "Дуртай 💜" : "Дурт нэмэх"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}