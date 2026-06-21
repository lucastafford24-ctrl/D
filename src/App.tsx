import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Dices, 
  Wand2, 
  Sparkles,
  Zap,
  Coins,
  Library,
  ChevronRight
} from 'lucide-react';
import type { RobloxGameIdea } from './types';

export default function App() {
  const [idea, setIdea] = useState<RobloxGameIdea | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIdea = async () => {
    setLoading(true);
    setError(null);
    setIdea(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate idea. Try again!');
      }
      
      const data = await response.json();
      setIdea(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-6 shadow-xl"
          >
            <Gamepad2 className="w-12 h-12 text-blue-400" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          >
            Roblox Game Idea <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400">Generator</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-lg mx-auto"
          >
            Need inspiration for your next front-page experiential hit? Let AI generate a wildly unique concept.
          </motion.p>
        </div>

        {/* Generate Button */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <button
            onClick={generateIdea}
            disabled={loading}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xl rounded-xl transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.8)] disabled:opacity-70 disabled:cursor-not-allowed scale-100 hover:scale-[1.02] active:scale-95"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Dices className="w-6 h-6" />
              </motion.div>
            ) : (
              <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            )}
            {loading ? 'Generating...' : 'Generate a Game Idea'}
          </button>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center mb-8"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Card */}
        <AnimatePresence mode="wait">
          {idea && !loading && (
            <motion.div
              key={idea.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group"
            >
              {/* Subtle top highlight */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 opacity-50" />
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-bold tracking-wider uppercase rounded-full border border-blue-500/20">
                      {idea.genre}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                    {idea.title}
                  </h2>
                </div>
              </div>

              <p className="text-slate-300 text-lg mb-8 leading-relaxed font-medium">
                "{idea.pitch}"
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 text-slate-100 font-bold mb-4 uppercase tracking-wider text-sm">
                    <Library className="w-4 h-4 text-slate-400" />
                    Core Mechanics
                  </h3>
                  <ul className="space-y-3">
                    {idea.mechanics.map((mechanic, index) => (
                      <li key={index} className="flex items-start gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                        <ChevronRight className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300">{mechanic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-slate-100 font-bold mb-4 uppercase tracking-wider text-sm">
                    <Coins className="w-4 h-4 text-slate-400" />
                    Premium Gamepass
                  </h3>
                  <div className="flex items-start gap-3 bg-gradient-to-r from-amber-500/10 to-transparent p-4 rounded-xl border border-amber-500/20 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
                    <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-amber-100/90 font-medium relative z-10">{idea.gamepass}</span>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-16 -right-16 text-slate-800/30 group-hover:text-slate-700/30 transition-colors pointer-events-none">
                <Sparkles className="w-64 h-64" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
