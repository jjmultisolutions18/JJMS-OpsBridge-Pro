import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useFirebase } from './lib/useFirebase';
import { Navigation } from './components/Navigation';
import { Loader2, Plus, Sparkles, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { auth } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { THEME } from './lib/theme';

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
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    try {
      if (authMode === 'REGISTER') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is not enabled in the Firebase Console. Please enable it to use this feature.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid credentials provided. Check your email and password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Minimum 6 characters required.');
      } else {
        setError(err.message || 'Authentication failed. Please check your connection.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

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
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/20 rotate-3">
              <Sparkles className="w-10 h-10 text-slate-900" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-none uppercase italic">
              Pilot<br/>Control
            </h1>
          </div>

          <div className={THEME.card + " !p-10"}>
            <form onSubmit={handleEmailAuth} className="space-y-6">
              {authMode === 'REGISTER' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Callsign</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      required
                      placeholder="YOUR NAME"
                      className="w-full bg-slate-900 border border-slate-700 p-4 pl-12 rounded outline-none focus:border-orange-500 transition-all font-bold uppercase text-xs"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Comm ID (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="email"
                    required
                    placeholder="EMAIL@DOMAIN.COM"
                    className="w-full bg-slate-900 border border-slate-700 p-4 pl-12 rounded outline-none focus:border-orange-500 transition-all font-bold uppercase text-xs"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 p-4 pl-12 rounded outline-none focus:border-orange-500 transition-all font-bold uppercase text-xs"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-red-500 bg-red-500/10 p-3 rounded uppercase tracking-widest leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isAuthenticating}
                className={THEME.buttonPrimary + " w-full !text-lg !py-4"}
              >
                {isAuthenticating ? 'AUTHENTICATING...' : authMode === 'LOGIN' ? 'ACCESS PLATFORM' : 'ENLIST NOW'}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-[10px] font-mono uppercase bg-slate-800 px-4 text-slate-500 tracking-widest">OR USE FEDERATED LOGIN</div>
            </div>

            <button 
              type="button"
              onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
              className="w-full py-4 px-6 bg-slate-900 border border-slate-700 text-slate-100 font-bold text-xs tracking-widest uppercase rounded flex items-center justify-center gap-3 hover:bg-slate-700 transition-all"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
              Sign In with Google
            </button>

            <div className="mt-8 text-center">
              <button 
                onClick={() => {
                  setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                  setError('');
                }}
                className="text-[10px] font-mono text-slate-500 hover:text-orange-500 uppercase tracking-widest underline decoration-2 underline-offset-4"
              >
                {authMode === 'LOGIN' ? "DON'T HAVE AN ACCOUNT? REGISTER" : "ALREADY REGISTERED? LOGIN"}
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Ensure Email Login is enabled in your Firebase Console.
          </p>
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
