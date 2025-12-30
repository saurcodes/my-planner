export interface User {
  id: string;
  email: string;
  name: string;
  oauthProvider: 'google' | 'apple';
  oauthId: string;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  timezone: string;
  workingHours: {
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
  breakDuration: number; // minutes
  pomodoroSettings: {
    workDuration: number;   // minutes, default 25
    shortBreak: number;     // minutes, default 5
    longBreak: number;      // minutes, default 15
    sessionsBeforeLongBreak: number; // default 4
  };
  notifications: {
    enabled: boolean;
    reminderMinutesBefore: number;
    focusModeNotifications: boolean;
  };
  focusMode: {
    blockedWebsites: string[];
    autoEnableForUrgentImportant: boolean;
  };
}

export interface CreateUserDTO {
  email: string;
  name: string;
  oauthProvider: 'google' | 'apple';
  oauthId: string;
}

export interface UpdateUserDTO {
  name?: string;
  settings?: Partial<UserSettings>;
}
