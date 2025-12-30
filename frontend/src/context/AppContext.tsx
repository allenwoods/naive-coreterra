import React, { createContext, useContext, useState, useEffect } from 'react';
import { tasksAPI, projectsAPI, usersAPI } from '@/lib/api';
import type { Task, Project, User } from '@/types';

interface AppContextType {
  tasks: Task[];
  projects: Project[];
  user: User | null;
  loading: boolean;
  refreshTasks: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshTasks = async () => {
    try {
      const data = await tasksAPI.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const refreshProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const data = await usersAPI.getMe();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const updated = await tasksAPI.update(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const createTask = async (task: Partial<Task>) => {
    try {
      const created = await tasksAPI.create(task);
      setTasks(prev => [created, ...prev]);
      return created;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await tasksAPI.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        refreshTasks(),
        refreshProjects(),
        refreshUser(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        tasks,
        projects,
        user,
        loading,
        refreshTasks,
        refreshProjects,
        refreshUser,
        updateTask,
        createTask,
        deleteTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

