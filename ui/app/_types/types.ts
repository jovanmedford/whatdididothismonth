export interface Activity {
  activityId: string;
  activityName: string;
  categoryName?: string;
  categoryId?: string;
  categoryColor?: string;
  categoryIcon?: string;
  target: number;
  successes: number[];
}

export interface Category {
  name: string;
  color: string;
  icon: string;
}
