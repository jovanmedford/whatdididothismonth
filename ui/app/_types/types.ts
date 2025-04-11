export interface Activity {
  sk: string;
  pk: string;
  target: number;
  successes: number[];
  activityName: string;
  categoryName?: string;
  categoryId?: string;
  categoryColor?: string;
  categoryIcon?: string;
}
