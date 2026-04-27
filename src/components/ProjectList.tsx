import React, { useState } from 'react';
import { Project, ProjectCategory, ProjectStatus, Priority } from '../types';
import { THEME } from '../lib/theme';
import { Plus, Folder, Calendar, Tag, ChevronRight, Filter } from 'lucide-react';

interface Props {
  projects: Project[];
  onAdd: (data: Partial<Project>) => Promise<void>;
}

export function ProjectList({ projects, onAdd }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    category: 'Work',
    status: 'Not Started',
    priority: 'Medium',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(formData);
    setShowModal(false);
    setFormData({ name: '', category: 'Work', status: 'Not Started', priority: 'Medium', description: '' });
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <span className={THEME.sectionTitle}>Asset Directory</span>
          <h1 className={THEME.heading}>PROJECTS</h1>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className={THEME.buttonPrimary + " flex items-center gap-3"}
        >
          <Plus className="w-6 h-6" /> <span className="hidden sm:inline">New Project</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className={THEME.card + " group cursor-pointer"}>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-900 border border-slate-700 flex items-center justify-center rounded">
                <Folder className="w-6 h-6 text-slate-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <span className={THEME.badge}>{p.category}</span>
            </div>
            
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2 leading-none group-hover:text-orange-500 transition-colors">
              {p.name}
            </h3>
            <p className="text-sm text-slate-500 mb-8 line-clamp-2">{p.description || "Operational parameters not defined."}</p>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800/50">
               <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">Status</span>
                  <span className="text-xs font-bold uppercase tracking-tight">{p.status}</span>
               </div>
               <ChevronRight className="w-5 h-5 text-slate-700 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl p-12 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-5xl font-black uppercase tracking-tighter italic mb-12">Register Asset</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">Classification Name</label>
                <input 
                  autoFocus
                  required
                  className={THEME.input} 
                  placeholder="PROJECT ALIAS..." 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                   <label className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">Category</label>
                   <select 
                    className="w-full bg-slate-800 border border-slate-700 p-4 rounded outline-none appearance-none font-bold uppercase tracking-widest text-sm"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as ProjectCategory})}
                   >
                     {['Work', 'Business', 'Personal', 'Client', 'Programme'].map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">Status</label>
                   <select 
                    className="w-full bg-slate-800 border border-slate-700 p-4 rounded outline-none appearance-none font-bold uppercase tracking-widest text-sm"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as ProjectStatus})}
                   >
                     {['Not Started', 'In Progress', 'Delayed', 'Completed', 'On Hold'].map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">Objective Description</label>
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700 p-4 rounded outline-none font-medium text-slate-300 min-h-[120px]"
                  placeholder="Define the mission scope..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-8">
                <button type="submit" className={THEME.buttonPrimary + " flex-1"}>Establish Project</button>
                <button type="button" onClick={() => setShowModal(false)} className={THEME.buttonSecondary}>Abort</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
