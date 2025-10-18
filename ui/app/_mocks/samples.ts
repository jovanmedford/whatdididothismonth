import { Category, Activity } from "../_types/types";

export const categories: Category[] = [
  {
    id: "c1",
    label: "Health",
    color: "#34D399", // green
    icon: "💪",
  },
  {
    id: "c2",
    label: "Learning",
    color: "#60A5FA", // blue
    icon: "📚",
  },
  {
    id: "c3",
    label: "Work",
    color: "#FBBF24", // yellow
    icon: "💻",
  },
  {
    id: "c4",
    label: "Hobbies",
    color: "#F472B6", // pink
    icon: "🎸",
  },
  {
    id: "c5",
    label: "Social",
    color: "#A78BFA", // purple
    icon: "🤝",
  },
];

export const activities: Activity[] = [
  { id: "a1", label: "Morning Run" }, // belongs to Health
  { id: "a2", label: "Meditation" }, // belongs to Health
  { id: "a3", label: "Read a Book" }, // belongs to Learning
  { id: "a4", label: "Online Course" }, // belongs to Learning
  { id: "a5", label: "Daily Standup" }, // belongs to Work
  { id: "a6", label: "Code Review" }, // belongs to Work
  { id: "a7", label: "Play Guitar" }, // belongs to Hobbies
  { id: "a8", label: "Photography Walk" }, // belongs to Hobbies
  { id: "a9", label: "Call a Friend" }, // belongs to Social
  { id: "a10", label: "Dinner with Family" }, // belongs to Social
];
