import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useFirebase } from './lib/useFirebase';
import { Navigation } from './components/Navigation';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { auth } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Views
import { DashboardView } from './components/DashboardView';
import { ProjectList } from './components/ProjectList';
import { KanbanBoard } from './components/KanbanBoard';
import { NotePad } from './components/NotePad';
import { ReportsView } from './components/ReportsView';
import { CalendarView } from './components/CalendarView';
import { TeamView } from './components/TeamView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const { user, loading, projects, tasks, notes, addProject, addTask, updateTask, addNote } = useFirebase();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/20">
            <Sparkles className="w-12 h-12 text-slate-900" />
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none uppercase italic mb-8">
            Project<br/>Pilot
          </h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] mb-12">
            Secure workspace for real-time mission orchestration.
          </p>
          <button 
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            className="px-12 py-6 bg-white text-slate-900 font-black text-2xl tracking-tighter uppercase rounded hover:bg-orange-500 transition-all shadow-xl active:scale-95"
          >
            Authenticate with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-orange-500 selection:text-slate-900">
        <Navigation />
        <main className="pl-20 md:pl-64">
          <div className="max-w-7xl mx-auto p-6 md:p-12">
            <Routes>
              <Route path="/" element={<DashboardView projects={projects} tasks={tasks} notes={notes} />} />
              <Route path="/projects" element={<ProjectList projects={projects} onAdd={addProject} />} />
              <Route path="/tasks" element={<KanbanBoard tasks={tasks} onUpdate={updateTask} onAdd={addTask} />} />
              <Route path="/kanban" element={<KanbanBoard tasks={tasks} onUpdate={updateTask} onAdd={addTask} />} />
              <Route path="/calendar" element={<CalendarView tasks={tasks} />} />
              <Route path="/teams" element={<TeamView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/notes" element={<NotePad notes={notes} onAdd={addNote} />} />
              <Route path="/reports" element={<ReportsView projects={projects} tasks={tasks} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
