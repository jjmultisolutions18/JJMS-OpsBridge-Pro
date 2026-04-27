import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Trello, 
  Calendar, 
  StickyNote, 
  BarChart3, 
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { cn } from '../lib/theme';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Briefcase, label: 'Projects', path: '/projects' },
  { icon: Sparkles, label: 'Teams', path: '/teams' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Trello, label: 'Kanban', path: '/kanban' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: StickyNote, label: 'Notes', path: '/notes' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-0 h-full w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-slate-900" />
          </div>
          <span className="hidden md:block text-xl font-black uppercase tracking-tighter italic">ProjectPilot</span>
        </Link>
      </div>

      <div className="flex-1 py-8 flex flex-col gap-2 px-3 md:px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 p-3 md:p-4 rounded-lg transition-all group overflow-hidden",
                isActive 
                  ? "bg-white text-slate-900 shadow-lg shadow-white/5" 
                  : "text-slate-500 hover:text-slate-100 hover:bg-slate-800"
              )}
            >
              <item.icon className={cn("w-6 h-6 shrink-0", isActive ? "text-slate-900" : "group-hover:scale-110 transition-transform")} />
              <span className={cn(
                "hidden md:block font-bold text-sm uppercase tracking-widest",
                isActive ? "text-slate-900" : ""
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => signOut(auth)}
          className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut className="w-6 h-6" />
          <span className="hidden md:block font-bold text-sm uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </nav>
  );
}
