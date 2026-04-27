import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const THEME = {
  container: "max-w-7xl mx-auto px-6 py-12 md:py-16",
  heading: "text-7xl md:text-8xl font-black tracking-tighter leading-none uppercase italic",
  sectionTitle: "text-xs font-mono tracking-[0.4em] text-orange-500 uppercase mb-4",
  card: "bg-slate-800/40 border border-slate-800 p-8 rounded-xl hover:border-slate-700 transition-all shadow-xl",
  input: "bg-transparent border-b-4 border-slate-800 focus:border-orange-500 text-3xl font-bold py-4 outline-none transition-colors w-full placeholder-slate-800 uppercase tracking-tighter",
  buttonPrimary: "px-10 py-5 bg-white text-slate-900 font-black text-xl tracking-tighter uppercase rounded hover:bg-orange-500 transition-all shadow-lg active:scale-95 disabled:opacity-50",
  buttonSecondary: "px-6 py-3 bg-slate-800 text-slate-100 font-bold text-sm tracking-widest uppercase rounded border border-slate-700 hover:bg-slate-700 transition-all",
  badge: "text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-widest"
};
