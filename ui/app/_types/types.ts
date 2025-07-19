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

export interface Category {
    pk: string,
    sk: string
    name: string,
    color: string,
    icon: string,
}
