import React, { useState, useEffect } from 'react';
import { useFirebase } from '../lib/useFirebase';
import { THEME } from '../lib/theme';
import { User, Shield, Check, AlertCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export function SettingsView() {
  const { user } = useFirebase();
  const [role, setRole] = useState<'Admin' | 'User'>('User');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      // In a real app, you'd fetch the user doc to get the role
      // For this demo, we'll assume standard users can toggle for testing
      // but in production rules would prevent non-admins from changing roles
      setRole((user as any).role || 'User');
    }
  }, [user]);

  const updateRole = async (newRole: 'Admin' | 'User') => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: newRole
      });
      setRole(newRole);
      setMessage(`Role updated to ${newRole}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Update failed: Permissions restricted.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-12">
      <header>
        <span className={THEME.sectionTitle}>System Configuration</span>
        <h1 className={THEME.heading}>SETTINGS</h1>
      </header>

      <div className="max-w-2xl space-y-8">
        <div className={THEME.card}>
          <div className="flex items-center gap-4 mb-8">
            <User className="w-8 h-8 text-orange-500" />
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Profile Protocol</h2>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
               <div className="flex items-center gap-3">
                 <Shield className="w-5 h-5 text-blue-500" />
                 <span className="text-sm font-bold uppercase tracking-tight">Active Designation</span>
               </div>
               <span className="text-sm font-mono text-orange-500 font-bold">{role}</span>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Authority Override</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => updateRole('Admin')}
                  disabled={isUpdating || role === 'Admin'}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg font-black uppercase tracking-tighter transition-all ${role === 'Admin' ? 'bg-orange-500 text-slate-900 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  {role === 'Admin' && <Check className="w-4 h-4" />} ADMIN
                </button>
                <button 
                  onClick={() => updateRole('User')}
                  disabled={isUpdating || role === 'User'}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg font-black uppercase tracking-tighter transition-all ${role === 'User' ? 'bg-orange-500 text-slate-900 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  {role === 'User' && <Check className="w-4 h-4" />} MEMBER
                </button>
              </div>
            </div>

            {message && (
              <div className={`flex items-center gap-2 p-3 rounded text-[10px] font-mono uppercase tracking-widest ${message.includes('failed') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                <AlertCircle className="w-4 h-4" /> {message}
              </div>
            )}
          </div>
        </div>

        <div className={THEME.card + " border-slate-800"}>
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Permission Matrix</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-xs text-slate-300">
               <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
               <span>ADMIN: Full system control. Can override any project or team membership.</span>
            </li>
            <li className="flex items-center gap-3 text-xs text-slate-300">
               <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
               <span>MEMBER: Standard access. Own projects and joined team assets only.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
