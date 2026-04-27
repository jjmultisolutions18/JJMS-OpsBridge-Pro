import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, setDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { THEME } from '../lib/theme';
import { Users, Plus, Mail, Shield, UserPlus } from 'lucide-react';

export function TeamView() {
  const [teams, setTeams] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // Find all my memberships
    const q = query(collection(db, 'memberships'), where('userId', '==', auth.currentUser.uid));
    const unsubMembers = onSnapshot(q, async (snap) => {
      const ms = snap.docs.map(d => d.data());
      setMemberships(ms);
      
      const teamIds = ms.map(m => m.teamId);
      if (teamIds.length > 0) {
        // This is a simplified fetch, ideally you'd query teams where doc ID is in teamIds
        // but Firestore 'in' limit is small.
        const allTeamsSnap = await getDocs(collection(db, 'teams'));
        setTeams(allTeamsSnap.docs.filter(d => teamIds.includes(d.id)).map(d => ({ id: d.id, ...d.data() })));
      }
    });

    return unsubMembers;
  }, []);

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !auth.currentUser) return;
    
    setIsCreating(true);
    try {
      const teamRef = await addDoc(collection(db, 'teams'), {
        name: newTeamName,
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });

      // Create owner membership
      await setDoc(doc(db, 'memberships', `${teamRef.id}_${auth.currentUser.uid}`), {
        teamId: teamRef.id,
        userId: auth.currentUser.uid,
        role: 'Owner',
        joinedAt: serverTimestamp()
      });

      setNewTeamName('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-12">
      <header>
        <span className={THEME.sectionTitle}>Collaboration Hub</span>
        <h1 className={THEME.heading}>TEAMS</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className={THEME.card}>
            <Users className="w-10 h-10 text-orange-500 mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Establish Fleet</h2>
            <form onSubmit={createTeam} className="space-y-6">
              <input 
                className={THEME.input + " !text-xl"}
                placeholder="TEAM DESIGNATION..."
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={isCreating}
                className={THEME.buttonPrimary + " w-full"}
              >
                Launch Team
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500">Active Units</h2>
          {teams.map(team => (
            <div key={team.id} className={THEME.card + " flex items-center justify-between"}>
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{team.name}</h3>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">ID: {team.id}</p>
               </div>
               <div className="flex gap-2">
                  <button className={THEME.buttonSecondary + " !py-2 !px-4 flex items-center gap-2"}>
                    <UserPlus className="w-4 h-4" /> INVITE
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
