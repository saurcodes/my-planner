import axios, { AxiosInstance } from 'axios';
import type {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  EisenhowerMatrix,
  DailyPlanRequest,
  DailyPlanResponse,
  FocusSession,
  StartFocusSessionResponse,
  ProductivityTrend,
  TimeTrackingData,
  AIInsight,
  Reminder,
  CreateReminderDTO,
  Tag,
  CreateTagDTO,
  ApiResponse,
} from '@time-management/shared';

const API_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Tasks
  async getTasks(filters?: { status?: string; quadrant?: string; tags?: string }): Promise<Task[]> {
    const { data } = await this.client.get<ApiResponse<Task[]>>('/tasks', { params: filters });
    return data.data!;
  }

  async getTask(id: string): Promise<Task> {
    const { data } = await this.client.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data.data!;
  }

  async createTask(task: CreateTaskDTO): Promise<Task> {
    const { data } = await this.client.post<ApiResponse<Task>>('/tasks', task);
    return data.data!;
  }

  async updateTask(id: string, updates: UpdateTaskDTO): Promise<Task> {
    const { data } = await this.client.put<ApiResponse<Task>>(`/tasks/${id}`, updates);
    return data.data!;
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  async getMatrix(): Promise<EisenhowerMatrix> {
    const { data } = await this.client.get<ApiResponse<EisenhowerMatrix>>('/tasks/matrix');
    return data.data!;
  }

  // Planning
  async getDailyPlanQuestions() {
    const { data } = await this.client.get('/planning/questions');
    return data.data;
  }

  async generateDailyPlan(request: DailyPlanRequest): Promise<DailyPlanResponse> {
    const { data } = await this.client.post<ApiResponse<DailyPlanResponse>>('/planning/daily', request);
    return data.data!;
  }

  async getCurrentDailyPlan() {
    const { data } = await this.client.get('/planning/daily/current');
    return data.data;
  }

  // Focus
  async startFocusSession(taskId?: string): Promise<StartFocusSessionResponse> {
    const { data } = await this.client.post<ApiResponse<StartFocusSessionResponse>>('/focus/start', { taskId });
    return data.data!;
  }

  async getActiveFocusSession(): Promise<FocusSession | null> {
    const { data } = await this.client.get<ApiResponse<FocusSession | null>>('/focus/active');
    return data.data!;
  }

  async endFocusSession(id: string, productivityScore?: number, notes?: string): Promise<FocusSession> {
    const { data } = await this.client.put<ApiResponse<FocusSession>>(`/focus/${id}/end`, { productivityScore, notes });
    return data.data!;
  }

  async getBlockedSites(): Promise<string[]> {
    const { data } = await this.client.get<ApiResponse<string[]>>('/focus/blocked-sites');
    return data.data!;
  }

  async updateBlockedSites(websites: string[]): Promise<void> {
    await this.client.put('/focus/blocked-sites', { websites });
  }

  // Analytics
  async getProductivityTrends(startDate: Date, endDate: Date): Promise<ProductivityTrend[]> {
    const { data } = await this.client.get<ApiResponse<ProductivityTrend[]>>('/analytics/trends', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return data.data!;
  }

  async getTimeTracking(startDate: Date, endDate: Date): Promise<TimeTrackingData> {
    const { data } = await this.client.get<ApiResponse<TimeTrackingData>>('/analytics/time-tracking', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return data.data!;
  }

  async getAIInsights(): Promise<AIInsight[]> {
    const { data } = await this.client.get<ApiResponse<AIInsight[]>>('/analytics/insights');
    return data.data!;
  }

  async generateAIInsights(): Promise<AIInsight[]> {
    const { data } = await this.client.post<ApiResponse<AIInsight[]>>('/analytics/insights/generate');
    return data.data!;
  }

  // Reminders
  async getReminders(): Promise<Reminder[]> {
    const { data } = await this.client.get<ApiResponse<Reminder[]>>('/reminders');
    return data.data!;
  }

  async createReminder(reminder: CreateReminderDTO): Promise<Reminder> {
    const { data } = await this.client.post<ApiResponse<Reminder>>('/reminders', reminder);
    return data.data!;
  }

  async deleteReminder(id: string): Promise<void> {
    await this.client.delete(`/reminders/${id}`);
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    const { data } = await this.client.get<ApiResponse<Tag[]>>('/tags');
    return data.data!;
  }

  async createTag(tag: CreateTagDTO): Promise<Tag> {
    const { data } = await this.client.post<ApiResponse<Tag>>('/tags', tag);
    return data.data!;
  }

  async deleteTag(id: string): Promise<void> {
    await this.client.delete(`/tags/${id}`);
  }
}

export const api = new ApiClient();
