import React, { useState, useEffect } from 'react';
import { Project, Task } from '../types';
import { THEME } from '../lib/theme';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Sparkles, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { generateWeeklyReport } from '../services/geminiService';

interface Props {
  projects: Project[];
  tasks: Task[];
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#6366f1', '#a855f7'];

export function ReportsView({ projects, tasks }: Props) {
  const [aiReport, setAiReport] = useState<string>('Generating productivity matrix...');

  useEffect(() => {
    const completed = tasks.filter(t => t.status === 'Done');
    const active = projects.filter(p => p.status !== 'Completed');
    generateWeeklyReport(completed, active).then(setAiReport);
  }, [tasks, projects]);

  const taskStatusData = [
    { name: 'Backlog', value: tasks.filter(t => t.status === 'Backlog').length },
    { name: 'To Do', value: tasks.filter(t => t.status === 'To Do').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Waiting', value: tasks.filter(t => t.status === 'Waiting').length },
    { name: 'Done', value: tasks.filter(t => t.status === 'Done').length },
  ];

  const projectProgressData = projects.map(p => ({
    name: p.name.toUpperCase().slice(0, 10),
    progress: p.progress,
  })).slice(0, 8);

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <span className={THEME.sectionTitle}>Performance Analytics</span>
          <h1 className={THEME.heading}>ANALYTICS</h1>
        </div>
        <button className={THEME.buttonSecondary + " flex items-center gap-2"}>
          <Download className="w-4 h-4" /> EXPORT PDF
        </button>
      </header>

      {/* AI Report Summary */}
      <div className={THEME.card + " border-orange-500/30 bg-orange-500/5 mb-12"}>
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center">
             <Sparkles className="w-6 h-6 text-slate-900" />
           </div>
           <div>
             <h2 className="text-2xl font-black uppercase tracking-tighter italic">AI Executive Summary</h2>
             <p className="text-[10px] font-mono text-orange-500 uppercase tracking-widest">Generated via Gemini v1.5 Flash</p>
           </div>
        </div>
        <div className="max-w-4xl">
           <p className="text-lg font-medium leading-relaxed italic text-slate-300 border-l-4 border-orange-500 pl-8 whitespace-pre-wrap">
             {aiReport}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Task Distribution */}
        <div className={THEME.card}>
           <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 border-b border-slate-800 pb-4">Task Status Distribution</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={taskStatusData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={100}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {taskStatusData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontWeight: 'bold' }} />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-4 mt-8">
             {taskStatusData.map((d, i) => (
               <div key={d.name} className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tight">{d.name}: {d.value}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Project Progress */}
        <div className={THEME.card}>
           <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 border-b border-slate-800 pb-4">Asset Progress Matrix (%)</h3>
           <div className="h-[340px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={projectProgressData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                 <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                 <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} 
                 />
                 <Bar dataKey="progress" fill="#f97316" radius={[4, 4, 0, 0]} barSize={32} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
        <div className="p-8 bg-slate-800 rounded-xl">
           <TrendingUp className="w-8 h-8 text-blue-500 mb-6" />
           <div className="text-4xl font-black mb-2">{projects.length}</div>
           <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Active Assets</div>
        </div>
        <div className="p-8 bg-slate-800 rounded-xl">
           <CheckCircle2 className="w-8 h-8 text-green-500 mb-6" />
           <div className="text-4xl font-black mb-2">{tasks.filter(t => t.status === 'Done').length}</div>
           <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Resolved Protocols</div>
        </div>
        <div className="p-8 bg-slate-800 rounded-xl">
           <Clock className="w-8 h-8 text-red-500 mb-6" />
           <div className="text-4xl font-black mb-2">{tasks.filter(t => t.status !== 'Done' && t.priority === 'Critical').length}</div>
           <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Critical Overrides</div>
        </div>
      </div>
    </div>
  );
}
