import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { Project, Task, Note } from '../types';

export function useFirebase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Register user
        await setDoc(doc(db, 'users', u.uid), {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setTasks([]);
      setNotes([]);
      return;
    }

    const unsubProjects = onSnapshot(
      query(collection(db, 'projects'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')),
      (snap) => setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'projects')
    );

    const unsubTasks = onSnapshot(
      query(collection(db, 'tasks'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')),
      (snap) => setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as Task))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'tasks')
    );

    const unsubNotes = onSnapshot(
      query(collection(db, 'notes'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')),
      (snap) => setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Note))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'notes')
    );

    return () => {
      unsubProjects();
      unsubTasks();
      unsubNotes();
    };
  }, [user]);

  const addProject = async (data: Partial<Project>) => {
    if (!user) return;
    await addDoc(collection(db, 'projects'), {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp(),
      progress: 0,
      status: 'Not Started'
    });
  };

  const addTask = async (data: Partial<Task>) => {
    if (!user) return;
    await addDoc(collection(db, 'tasks'), {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp(),
      status: 'Backlog'
    });
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
      await updateDoc(doc(db, 'tasks', id), data);
  };

  const addNote = async (content: string, projectId?: string) => {
    if (!user) return;
    await addDoc(collection(db, 'notes'), {
      content,
      projectId,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  };

  return { 
    user, 
    loading, 
    projects, 
    tasks, 
    notes,
    addProject,
    addTask,
    updateTask,
    addNote
  };
}
