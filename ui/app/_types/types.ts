export interface ActivityLog {
  id: string;
  activityId: string;
  activityName: string;
  categoryName?: string;
  categoryId?: string;
  categoryColor?: string;
  categoryIcon?: string;
  target: number;
  successes: number[];
}

export interface Activity {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export interface InputItem {
  label: string;
  value: string;
}
