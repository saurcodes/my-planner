export enum FocusSessionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  status: FocusSessionStatus;
  breaks: FocusBreak[];
  productivityScore?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FocusBreak {
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
}

export interface CreateFocusSessionDTO {
  taskId?: string;
}

export interface UpdateFocusSessionDTO {
  status?: FocusSessionStatus;
  endTime?: Date;
  productivityScore?: number;
  notes?: string;
}

export interface StartFocusSessionResponse {
  session: FocusSession;
  blockedWebsites: string[];
  pomodoroSettings: {
    workDuration: number;
    shortBreak: number;
    longBreak: number;
    sessionsBeforeLongBreak: number;
  };
}
