import { create } from 'zustand';
import type { Task, EisenhowerMatrix, CreateTaskDTO } from '@time-management/shared';
import { api } from '@/lib/api';

interface TaskState {
  tasks: Task[];
  matrix: EisenhowerMatrix | null;
  loading: boolean;
  fetchTasks: () => Promise<void>;
  fetchMatrix: () => Promise<void>;
  createTask: (task: CreateTaskDTO) => Promise<Task>;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  matrix: null,
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await api.getTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchMatrix: async () => {
    set({ loading: true });
    try {
      const matrix = await api.getMatrix();
      set({ matrix, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createTask: async (taskData: CreateTaskDTO) => {
    set({ loading: true });
    try {
      const newTask = await api.createTask(taskData);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        loading: false,
      }));
      // Refresh matrix to update quadrants
      const matrix = await api.getMatrix();
      set({ matrix });
      return newTask;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTask: (task) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),

  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id),
  })),
}));
