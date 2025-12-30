export interface DailyPlanQuestion {
  id: string;
  question: string;
  type: 'text' | 'number' | 'time' | 'multiple_choice';
  options?: string[];
  required: boolean;
}

export interface DailyPlanAnswer {
  questionId: string;
  answer: string | number;
}

export interface DailyPlanRequest {
  answers: DailyPlanAnswer[];
  existingTasks?: string[]; // IDs of existing tasks to consider
}

export interface DailyPlanResponse {
  tasks: SuggestedTask[];
  schedule: ScheduleBlock[];
  insights: string[];
  estimatedCompletionTime: string; // HH:mm format
}

export interface SuggestedTask {
  title: string;
  description: string;
  urgency: number;
  importance: number;
  estimatedMinutes: number;
  suggestedSchedule: Date;
  reason: string; // Why AI suggests this task
  tags: string[];
}

export interface ScheduleBlock {
  startTime: Date;
  endTime: Date;
  taskTitle: string;
  type: 'work' | 'break' | 'focus';
  taskId?: string;
}

export interface VoiceTaskInput {
  audioData?: string; // Base64 encoded audio
  transcript?: string; // Pre-transcribed text
}

export interface VoiceTaskResponse {
  task: SuggestedTask;
  confidence: number;
}
