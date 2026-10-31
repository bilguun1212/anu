// "use client";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { Heart, Clock } from "lucide-react";

// const events = [
//   { date: "2022 оны өвөл", title: "Анхны цас ", desc: "Үерхсэнээс 1 сарын дараа✨", emoji: "🌟", img: "/2022.jpg" },
//   { date: "2024 зун", title: "Сумка хамтай цуг", desc: "Хөгжилтэй байсан цаг аая", emoji: "😊", img: "/hair2.jpg" },
//   { date: "2025 5 сар", title: "Машаантай зугаалав", desc: "Хүйтэн бас дулаахан ааая", emoji: "💜", img: "/hair3.jpg" },
//   { date: "2026 3 сарын 8", title: "Эрхийн өдөр kakk", desc: "Цэцэг шиг охинд цэцэг өгөв", emoji: "🌸", img: "/hair5.jpg" },
//   { date: "2026 5 сарын 16", title: "Youngsubbb", desc: "Хамтдаа байгаа энэ мөч аая", emoji: "💖", img: "/hair9.jpg" },
// ];

// export default function TimelinePage() {
//   return (
//     <main className="min-h-screen bg-[#0b091a] relative overflow-hidden font-sans px-6 py-12">
//       <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] bg-pink-600/20 rounded-full blur-[150px] pointer-events-none" />
//       <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

//       <div className="relative z-10 max-w-2xl mx-auto">
//         <Link href="/">
//           <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mb-8 px-4 py-2 bg-white/10 text-white rounded-full text-sm backdrop-blur-md border border-white/20">
//             ← Буцах
//           </motion.button>
//         </Link>

//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
//           <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
//             <Clock size={36} className="text-purple-400 mx-auto mb-3" style={{ filter: "drop-shadow(0 0 10px rgba(167,139,250,0.5))" }} />
//           </motion.div>
//           <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 mb-2">
//             Бидний цаг хугацаа
//           </h1>
//           <p className="text-purple-200/50 text-sm">Хамтдаа туулсан мөчүүд 💜</p>
//           <div className="mt-3 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
//         </motion.div>

//         <div className="relative">
//           <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-pink-400/50 via-purple-400/30 to-transparent" />
//           <div className="space-y-8">
//             {events.map((event, i) => (
//               <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15, duration: 0.6 }} className="relative pl-16">
//                 <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} className="absolute left-3.5 top-4 w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-[#0b091a]" />
//                 <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm group hover:border-pink-500/30 transition-colors duration-300">
//                   <div className="h-36 overflow-hidden">
//                     <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                   </div>
//                   <div className="p-4">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="text-lg">{event.emoji}</span>
//                       <span className="text-purple-300/50 text-xs">{event.date}</span>
//                     </div>
//                     <h3 className="text-white font-semibold text-sm mb-1">{event.title}</h3>
//                     <p className="text-white/50 text-xs leading-relaxed">{event.desc}</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//             <motion.div className="relative pl-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
//               <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute left-3 top-3 w-6 h-6 rounded-full bg-pink-400/30 border border-pink-400/60 flex items-center justify-center">
//                 <Heart fill="#f472b6" size={12} className="text-pink-400" />
//               </motion.div>
//               <div className="p-4">
//                 <p className="text-pink-300/60 text-sm italic">Одоо ч гэсэн хамт байна... 💜</p>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }