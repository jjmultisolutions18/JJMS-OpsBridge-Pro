import { Timestamp } from 'firebase/firestore';

export type ProjectCategory = 'Work' | 'Business' | 'Personal' | 'Client' | 'Programme';
export type ProjectStatus = 'Not Started' | 'In Progress' | 'Delayed' | 'Completed' | 'On Hold';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Waiting' | 'Done';

export interface Project {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  budget?: number;
  userId: string;
  createdAt: Timestamp;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  priority: Priority;
  status: TaskStatus;
  deadline?: string;
  assignedTo?: string;
  followUpDate?: string;
  notes?: string;
  userId: string;
  createdAt: Timestamp;
  completionDate?: Timestamp;
}

export interface Note {
  id: string;
  content: string;
  projectId?: string;
  userId: string;
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'Admin' | 'User';
}
