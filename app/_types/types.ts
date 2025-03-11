export interface Activity {
  userId: string;
  "period#name": string;
  name: string;
  target: number;
  successes: number[];
}