/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { generateNote } from './services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { 
  BookOpen, 
  GraduationCap, 
  Search, 
  Loader2, 
  Download, 
  Printer, 
  ChevronRight,
  BookMarked,
  Layers,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [group, setGroup] = useState('Science');
  const [level, setLevel] = useState('HSC');
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const noteRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !chapter) return;

    setLoading(true);
    setError(null);
    setNote(null);

    try {
      const generatedNote = await generateNote(subject, chapter, group, level);
      setNote(generatedNote);
    } catch (err) {
      setError('নোট তৈরি করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">
              শুন্য থেকে শিখর
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500 hidden md:block">
              SSC & HSC পূর্ণাঙ্গ নোট গাইড
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start">
          
          {/* Sidebar Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24"
          >
            <div className="flex items-center gap-2 mb-6">
              <BookMarked className="text-emerald-600" size={20} />
              <h2 className="font-semibold text-lg">নোট তৈরি করুন</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Layers size={12} /> লেভেল
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['SSC', 'HSC'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={cn(
                        "py-2 rounded-lg text-sm font-medium transition-all border",
                        level === l 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm" 
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Users size={12} /> বিভাগ
                </label>
                <select 
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="Science">বিজ্ঞান (Science)</option>
                  <option value="Commerce">ব্যবসায় শিক্ষা (Commerce)</option>
                  <option value="Arts">মানবিক (Arts)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <BookOpen size={12} /> বিষয়
                </label>
                <input 
                  type="text"
                  placeholder="যেমন: পদার্থবিজ্ঞান"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Search size={12} /> অধ্যায়
                </label>
                <input 
                  type="text"
                  placeholder="যেমন: গতিবিদ্যা"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    নোট তৈরি হচ্ছে...
                  </>
                ) : (
                  <>
                    নোট তৈরি করুন
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Content Area */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {!note && !loading && !error && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-gray-300" size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">আপনার পড়াশোনা শুরু করুন</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    বামদিকের ফর্মটি পূরণ করে আপনার কাঙ্ক্ষিত বিষয়ের পূর্ণাঙ্গ নোট তৈরি করুন। আমরা আপনার জন্য বেসিক থেকে এডভান্স লেভেলের নোট তৈরি করে দেব।
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="h-12 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                  </div>
                  <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-center"
                >
                  {error}
                </motion.div>
              )}

              {note && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden print:shadow-none print:border-none"
                >
                  {/* Note Toolbar */}
                  <div className="bg-gray-50/50 border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded uppercase">
                        {level}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {subject} • {chapter}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handlePrint}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all text-gray-600"
                        title="Print Note"
                      >
                        <Printer size={18} />
                      </button>
                      <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
                      >
                        <Download size={16} />
                        PDF ডাউনলোড
                      </button>
                    </div>
                  </div>

                  {/* Note Content */}
                  <div 
                    ref={noteRef}
                    className="p-8 md:p-12 prose prose-emerald max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:pb-2 prose-h2:mt-12 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700"
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {note}
                    </ReactMarkdown>
                  </div>

                  {/* Footer */}
                  <div className="bg-emerald-900 text-white p-8 text-center print:hidden">
                    <GraduationCap className="mx-auto mb-4 opacity-50" size={32} />
                    <h4 className="font-bold mb-2">শুন্য থেকে শিখর</h4>
                    <p className="text-emerald-200 text-sm">আপনার উজ্জ্বল ভবিষ্যতের সঙ্গী।</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} শুন্য থেকে শিখর। সকল অধিকার সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
