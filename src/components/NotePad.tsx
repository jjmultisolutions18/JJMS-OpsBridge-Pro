import React, { useState } from 'react';
import { Note } from '../types';
import { THEME } from '../lib/theme';
import { StickyNote, Search, Trash2, Clock, Plus, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  notes: Note[];
  onAdd: (content: string) => Promise<void>;
}

export function NotePad({ notes, onAdd }: Props) {
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onAdd(content);
    setContent('');
  };

  const filteredNotes = notes.filter(n => n.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <span className={THEME.sectionTitle}>Information Registry</span>
          <h1 className={THEME.heading}>OSINT LOGS</h1>
        </div>
        <div className="relative w-full md:w-80">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
           <input 
            type="text"
            placeholder="FILTER LOGS..."
            className="w-full bg-slate-800 border border-slate-700 pl-12 pr-4 py-4 rounded font-mono text-xs uppercase tracking-widest focus:border-orange-500 outline-none transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
           />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Editor Area */}
        <div className="md:col-span-5">
           <form onSubmit={handleAdd} className="sticky top-12 space-y-6">
              <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-2xl focus-within:border-orange-500 transition-all">
                <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-500 mb-6 block">Direct Entry Stream</label>
                <textarea 
                  className="w-full bg-transparent border-none text-xl font-bold tracking-tight outline-none min-h-[300px] resize-none placeholder:text-slate-700 leading-relaxed"
                  placeholder="CAPTURE INTEL..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
                   <div className="text-[10px] font-mono text-slate-600 uppercase">Chars: {content.length}</div>
                   <button type="submit" disabled={!content.trim()} className={THEME.buttonPrimary + " !py-3 !px-6 !text-sm"}>
                     Commit Entry
                   </button>
                </div>
              </div>
           </form>
        </div>

        {/* Notes Grid */}
        <div className="md:col-span-7 grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-800/40 border border-slate-800 p-8 rounded-xl hover:bg-slate-800 transition-colors group relative"
              >
                <div className="flex items-center gap-4 text-slate-500 mb-6">
                  <Hash className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">SEQ_{note.id.slice(0, 8)}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest ml-auto">{format(note.createdAt.toDate(), 'yyyy-MM-dd HH:mm')}</span>
                </div>
                <p className="text-xl font-bold tracking-tight text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
                <button className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-500 transition-all">
                   <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredNotes.length === 0 && (
            <div className="py-24 text-center border border-dashed border-slate-800 rounded-2xl">
               <StickyNote className="w-12 h-12 text-slate-800 mx-auto mb-4" />
               <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">Registry Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
