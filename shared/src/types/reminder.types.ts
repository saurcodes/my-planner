export enum ReminderType {
  PUSH = 'push',
  IN_APP = 'in_app'
}

export enum ReminderStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed'
}

export interface Reminder {
  id: string;
  taskId: string;
  userId: string;
  reminderTime: Date;
  type: ReminderType;
  status: ReminderStatus;
  sentAt?: Date;
  createdAt: Date;
}

export interface CreateReminderDTO {
  taskId: string;
  reminderTime: Date;
  type: ReminderType;
}

export interface UpdateReminderDTO {
  reminderTime?: Date;
  type?: ReminderType;
}
