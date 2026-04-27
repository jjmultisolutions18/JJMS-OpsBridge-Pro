import React, { useState, useEffect } from 'react';
import { Project, Task, Note } from '../types';
import { THEME } from '../lib/theme';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { format, isAfter, isBefore, startOfDay, addDays } from 'date-fns';
import { getAIPriorities, getRiskAnalysis } from '../services/geminiService';

interface Props {
  projects: Project[];
  tasks: Task[];
  notes: Note[];
}

export function DashboardView({ projects, tasks, notes }: Props) {
  const [aiPriorities, setAiPriorities] = useState<string>('Analyzing task list...');
  const [riskAnalysis, setRiskAnalysis] = useState<string>('Evaluating project health...');

  useEffect(() => {
    if (tasks.length > 0) {
      getAIPriorities(tasks).then(setAiPriorities);
      getRiskAnalysis(tasks, projects).then(setRiskAnalysis);
    }
  }, [tasks, projects]);

  const today = startOfDay(new Date());
  const overdueTasks = tasks.filter(t => t.status !== 'Done' && t.deadline && isBefore(new Date(t.deadline), today));
  const upcomingDeadlines = tasks.filter(t => t.status !== 'Done' && t.deadline && isAfter(new Date(t.deadline), today) && isBefore(new Date(t.deadline), addDays(today, 7)));
  const activeProjects = projects.filter(p => p.status !== 'Completed');
  const recentTasks = tasks.filter(t => t.status === 'Done').slice(0, 5);

  return (
    <div className="space-y-12">
      <header>
        <span className={THEME.sectionTitle}>Command Operations</span>
        <h1 className={THEME.heading}>MISSION CONTROL</h1>
      </header>

      {/* AI Intelligence Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className={THEME.card + " border-orange-500/20 bg-orange-500/5"}>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-black uppercase tracking-tighter">AI Strat-Assistant</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-mono text-orange-500/60 uppercase tracking-widest mb-2">Today's Optimized Priorities</p>
              <div className="text-sm italic text-slate-300 leading-relaxed whitespace-pre-wrap">{aiPriorities}</div>
            </div>
          </div>
        </div>

        <div className={THEME.card + " border-red-500/20"}>
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Proactive Risk Filter</h2>
          </div>
          <div className="text-sm italic text-slate-300 leading-relaxed whitespace-pre-wrap">{riskAnalysis}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Critical Stats */}
        <div className="md:col-span-8 space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Projects', value: activeProjects.length, icon: TrendingUp, color: 'text-blue-500' },
              { label: 'Pending Tasks', value: tasks.filter(t => t.status !== 'Done').length, icon: Clock, color: 'text-orange-500' },
              { label: 'Critical Overdue', value: overdueTasks.length, icon: AlertTriangle, color: 'text-red-500' },
              { label: 'Upcoming Week', value: upcomingDeadlines.length, icon: Calendar, color: 'text-green-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/20 border border-slate-800 p-6 rounded-lg">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <div className="text-3xl font-black">{stat.value}</div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Active Projects List */}
          <div className={THEME.card}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Active Projects</h3>
              <button className="text-[10px] font-mono text-orange-500 hover:text-white transition-colors">VIEW ALL</button>
            </div>
            <div className="space-y-6">
              {activeProjects.slice(0, 3).map(p => (
                <div key={p.id} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold uppercase tracking-tight group-hover:text-orange-500 transition-colors">{p.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{p.progress}% COMPLETED</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-500" 
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Secondary Info */}
        <div className="md:col-span-4 space-y-8">
          <div className={THEME.card}>
             <h3 className="text-xl font-black uppercase tracking-tighter italic mb-6">Recent Completion</h3>
             <div className="space-y-4">
               {recentTasks.map(t => (
                 <div key={t.id} className="flex items-center gap-3 text-sm text-slate-400">
                   <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                   <span className="truncate">{t.title}</span>
                 </div>
               ))}
               {recentTasks.length === 0 && <p className="text-xs text-slate-600 italic">No tasks completed yet.</p>}
             </div>
          </div>

          <div className={THEME.card + " bg-slate-100 text-slate-900 border-none"}>
            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-4">Quick Note</h3>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Last Modified: {notes[0] ? format(notes[0].createdAt.toDate(), 'HH:mm') : 'None'}</p>
            <p className="text-sm font-medium leading-relaxed mb-6">
              {notes[0]?.content || "No recent ideas captured. Use the keypad to store critical data points."}
            </p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all">
              OPEN LOGS <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
