"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, BookOpen, Plus, X, Edit3, Check } from "lucide-react";

const images = Array.from({ length: 21 }, (_, i) => `/hair${i + 1}.jpg`).filter((_, i) => i !== 9 && i !== 12);

interface Memory {
  imgIndex: number;
  note: string;
  date: string;
  emoji: string;
}

const defaultMemories: Memory[] = [
  { imgIndex: 0, note: "💜", date: "", emoji: "" },
  { imgIndex: 2, note: "💖", date: "", emoji: "" },
  { imgIndex: 4, note: "🌸", date: "", emoji: "" },
];

const EMOJIS = ["💜", "🌸", "✨", "😊", "🌟", "💖", "🎀", "🌙", "⭐", "💫"];

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>(defaultMemories);
  const [adding, setAdding] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newEmoji, setNewEmoji] = useState("💜");
  const [newImgIdx, setNewImgIdx] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const addMemory = () => {
    if (!newNote.trim()) return;
    setMemories((prev) => [...prev, { imgIndex: newImgIdx, note: newNote, date: newDate || "2025", emoji: newEmoji }]);
    setNewNote(""); setNewDate(""); setNewEmoji("💜"); setNewImgIdx(0); setAdding(false);
  };

  const deleteMemory = (i: number) => {
    setMemories((prev) => prev.filter((_, idx) => idx !== i));
  };

  const saveEdit = (i: number, note: string) => {
    setMemories((prev) => prev.map((m, idx) => idx === i ? { ...m, note } : m));
    setEditingIdx(null);
  };

  return (
    <main className="min-h-screen bg-[#0b091a] relative overflow-hidden font-sans px-4 py-12">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] bg-pink-600/20 rounded-full blur-[150px] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 bg-white/10 text-white rounded-full text-sm backdrop-blur-md border border-white/20">
              ← Буцах
            </motion.button>
          </Link>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm border border-pink-500/30">
            <Plus size={14} /> Нэмэх
          </motion.button>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <BookOpen size={36} className="text-green-400 mx-auto mb-3" style={{ filter: "drop-shadow(0 0 10px rgba(74,222,128,0.4))" }} />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 mb-2">
            Дурсамжийн дэвтэр
          </h1>
          <p className="text-purple-200/50 text-sm">Зурагтай хамт тэмдэглэл үлдээгээрэй хайраа 💜</p>
          <div className="mt-3 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
        </motion.div>

        {/* Add new memory */}
        <AnimatePresence>
          {adding && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-white/60 text-xs mb-3">Зураг сонго:</p>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                {images.map((src, i) => (
                  <div key={i} onClick={() => setNewImgIdx(i)} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${newImgIdx === i ? "border-pink-400" : "border-transparent"}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-xs mb-2">Emoji:</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => setNewEmoji(e)} className={`text-lg p-1 rounded-lg transition-all ${newEmoji === e ? "bg-pink-500/30 scale-125" : "opacity-50 hover:opacity-100"}`}>{e}</button>
                ))}
              </div>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full mb-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/70 text-xs outline-none" />
              <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Тэмдэглэл бич..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none resize-none h-20 mb-3" />
              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={addMemory} className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl text-xs font-semibold">
                  Хадгалах
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAdding(false)} className="px-4 py-2 bg-white/10 text-white/60 rounded-xl text-xs">
                  Болих
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Memories list */}
        <div className="space-y-4">
          <AnimatePresence>
            {memories.map((memory, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.1 }} className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm group cursor-pointer" onClick={() => setSelectedMemory(memory)}>
                <div className="flex">
                  <div className="w-28 h-28 flex-shrink-0 overflow-hidden">
                    <img src={images[memory.imgIndex]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span>{memory.emoji}</span>
                          <span className="text-purple-300/50 text-xs">{memory.date}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <button onClick={(e) => { e.stopPropagation(); setEditingIdx(i); }} className="p-1 rounded-lg bg-white/10 text-white/50 hover:text-white transition-colors">
                            <Edit3 size={12} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); deleteMemory(i); }} className="p-1 rounded-lg bg-white/10 text-white/50 hover:text-red-400 transition-colors">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                      {editingIdx === i ? (
                        <div onClick={(e) => e.stopPropagation()} className="flex gap-1">
                          <input defaultValue={memory.note} id={`edit-${i}`} className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-xs outline-none" />
                          <button onClick={() => saveEdit(i, (document.getElementById(`edit-${i}`) as HTMLInputElement).value)} className="p-1 rounded-lg bg-pink-500/30 text-pink-300">
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-white/80 text-xs leading-relaxed">{memory.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {memories.length === 0 && (
            <div className="text-center py-16 text-white/30 text-sm">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>Дурсамж байхгүй байна</p>
              <p className="text-xs mt-1">+ товч дарж нэм</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedMemory(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-sm w-full rounded-3xl overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
              <img src={images[selectedMemory.imgIndex]} alt="" className="w-full h-64 object-cover" />
              <div className="p-5 bg-[#1c1836]/90 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{selectedMemory.emoji}</span>
                  <span className="text-purple-300/50 text-xs">{selectedMemory.date}</span>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">{selectedMemory.note}</p>
              </div>
              <button onClick={() => setSelectedMemory(null)} className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white">
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}