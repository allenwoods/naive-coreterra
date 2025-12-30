// User types
export interface UserStats {
  focus: number;
  execution: number;
  planning: number;
  teamwork: number;
  expertise: number;
  streak: number;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  role: string;
  level: number;
  currentXP: number;
  maxXP: number;
  gold: number;
  streak: number;
  inventory: string[];
  stats: UserStats;
}

// Task types
export type TaskStatus = 
  | "inbox" 
  | "clarified" 
  | "organized" 
  | "scheduled" 
  | "waiting" 
  | "completed" 
  | "trash";

export type Difficulty = "Easy" | "Med" | "Hard";

export interface Subtask {
  id: number;
  text: string;
  done: boolean;
}

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt?: string;
  priority: boolean;
  projectId?: string;
  contextId?: string;
  difficulty?: Difficulty;
  estimatedTime?: string;
  xpReward: number;
  goldReward?: number;
  subtasks?: Subtask[];
  progress?: number;
  assigneeId?: number;
  description?: string;
  dueDate?: string;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description?: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  timeline?: Record<string, any>;
}

// Gamification types
export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  type: string;
  effect?: Record<string, any>;
}

export interface Achievement {
  id: number;
  title: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  unlocked: boolean;
}

