import React, { useState } from 'react';
import { Task, TaskStatus, Priority } from '../types';
import { THEME } from '../lib/theme';
import { Plus, MoreVertical, Clock, AlertTriangle, CheckCircle2, User, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface Props {
  tasks: Task[];
  onUpdate: (id: string, data: Partial<Task>) => Promise<void>;
  onAdd: (data: Partial<Task>) => Promise<void>;
}

const COLUMNS: TaskStatus[] = ['Backlog', 'To Do', 'In Progress', 'Waiting', 'Done'];

export function KanbanBoard({ tasks, onUpdate, onAdd }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    onUpdate(taskId, { status: newStatus });
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await onAdd({ title: newTaskTitle, status: 'Backlog' });
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <span className={THEME.sectionTitle}>Workflow Management</span>
          <h1 className={THEME.heading}>KANBAN FLOW</h1>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className={THEME.buttonPrimary + " flex items-center gap-3"}
        >
          <Plus className="w-6 h-6" /> <span className="hidden sm:inline">Add Protocol</span>
        </button>
      </header>

      <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
        {COLUMNS.map(col => (
          <div key={col} className="flex-1 min-w-[320px] bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col p-6 snap-start">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
               <div className="flex items-center gap-3">
                 <div className={col === 'Done' ? 'text-green-500' : col === 'In Progress' ? 'text-orange-500' : 'text-slate-500'}>
                    {col === 'Done' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-[0.2em]">{col}</h3>
               </div>
               <span className="text-[10px] font-mono text-slate-700 bg-slate-800 px-2 rounded">{tasks.filter(t => t.status === col).length}</span>
            </div>

            <div className="space-y-4 flex-1">
              {tasks.filter(t => t.status === col).map(task => (
                <motion.div
                  key={task.id}
                  layoutId={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-orange-500/50 transition-all cursor-grab active:cursor-grabbing group shadow-lg"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={THEME.badge + " border-none p-0 tracking-widest opacity-60"}>{task.priority || 'MEDIUM'}</span>
                    <button className="text-slate-600 hover:text-slate-400"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  
                  <h4 className="text-lg font-black tracking-tighter uppercase leading-tight group-hover:text-orange-500 transition-colors mb-6">
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <User className="w-4 h-4 text-slate-600" />
                       <div className="text-[10px] font-mono text-slate-500 truncate max-w-[80px]">SYSTEM_AUTH</div>
                    </div>
                    {task.deadline && (
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                         <Clock className="w-3 h-3" />
                         <span>{format(new Date(task.deadline), 'MMM d')}</span>
                       </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex gap-2 pt-4 border-t border-slate-700/50">
                    {COLUMNS.filter(c => c !== col).map(c => (
                      <button 
                        key={c}
                        onClick={() => moveTask(task.id, c)}
                        className="text-[8px] font-mono p-1 bg-slate-900 border border-slate-700 text-slate-600 hover:bg-orange-500 hover:text-slate-900 hover:border-orange-500 rounded transition-all uppercase"
                        title={`Move to ${c}`}
                      >
                        {c.slice(0, 4)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
              {tasks.filter(t => t.status === col).length === 0 && (
                <div className="h-24 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-[10px] uppercase tracking-widest text-slate-700">
                  COLUMN_EMPTY
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl p-12 rounded-2xl">
             <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-8">Initiate Protocol</h2>
             <form onSubmit={handleAddTask} className="space-y-8">
               <input 
                 autoFocus
                 className={THEME.input} 
                 placeholder="TASK ALIAS..." 
                 value={newTaskTitle}
                 onChange={e => setNewTaskTitle(e.target.value)}
               />
               <div className="flex gap-4">
                 <button type="submit" className={THEME.buttonPrimary + " flex-1"}>Create Task</button>
                 <button type="button" onClick={() => setShowAddModal(false)} className={THEME.buttonSecondary}>Close</button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
