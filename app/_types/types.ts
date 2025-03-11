export interface ActivityItem {
  period: string;
  activity: Activity;
  progress: Progress;
  totals: ActivityCount;
}

export interface Activity {
  userId: string;
  period: string;
  name: string;
  target: number;
}

export interface Progress {
  successes: number[];
  streaks?: {
    longest: number;
    current: number;
  };
}

export interface ActivityCount {
  completed: number;
  remaining: number;
}

export interface Notes extends Record<string, string> {}
