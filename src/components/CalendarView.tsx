import React from 'react';
import { Task } from '../types';
import { THEME } from '../lib/theme';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  tasks: Task[];
}

export function CalendarView({ tasks }: Props) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const tasksWithDeadlines = tasks.filter(t => t.deadline);

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <span className={THEME.sectionTitle}>Temporal Matrix</span>
          <h1 className={THEME.heading}>CALENDAR</h1>
        </div>
        <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-lg border border-slate-700">
           <button onClick={() => setCurrentDate(d => new Date(d.setMonth(d.getMonth() - 1)))} className="p-2 hover:text-orange-500 transition-colors"><ChevronLeft /></button>
           <span className="text-sm font-black uppercase tracking-widest px-4">{format(currentDate, 'MMMM yyyy')}</span>
           <button onClick={() => setCurrentDate(d => new Date(d.setMonth(d.getMonth() + 1)))} className="p-2 hover:text-orange-500 transition-colors"><ChevronRight /></button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-px bg-slate-800 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-slate-900 p-4 text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-800">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const dayTasks = tasksWithDeadlines.filter(t => isSameDay(new Date(t.deadline!), day));
          return (
            <div 
              key={idx} 
              className={`bg-slate-900/50 min-h-[160px] p-4 transition-colors hover:bg-slate-800/80 ${!isSameDay(day, new Date()) ? '' : 'border-2 border-orange-500/50'}`}
            >
              <div className={`text-xs font-mono mb-4 ${isToday(day) ? 'text-orange-500 font-bold' : 'text-slate-500'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-2">
                {dayTasks.map(t => (
                  <div key={t.id} className="p-2 bg-slate-800 rounded border-l-2 border-orange-500 text-[10px] font-bold uppercase tracking-tight truncate">
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
