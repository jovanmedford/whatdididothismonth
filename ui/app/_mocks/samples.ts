import { Activity } from "../_types/types";

export const sampleActivities: Activity[] = [
  {
    id: "activity#1",
    label: "Morning Run",
  },
  {
    id: "activity#2",
    label: "Read a Chapter",
  },
  {
    id: "activity#3",
    label: "Call a Friend",
  },
  {
    id: "activity#4",
    label: "Write Journal Entry",
  },
  {
    id: "activity#5",
    label: "Sketch Something",
  },
  {
    id: "activity#6",
    label: "Organize Desk",
  },
];

export const sampleCategories: Category[] = [
  {
    pk: "user#123",
    sk: "category#health",
    name: "Health",
    color: "#FF6B6B",
    icon: "/icons/running.svg",
  },
  {
    pk: "user#123",
    sk: "category#education",
    name: "Education",
    color: "#4ECDC4",
    icon: "/icons/book.svg",
  },
  {
    pk: "user#123",
    sk: "category#social",
    name: "Social",
    color: "#FFE66D",
    icon: "/icons/phone.svg",
  },
  {
    pk: "user#123",
    sk: "category#reflection",
    name: "Reflection",
    color: "#A29BFE",
    icon: "/icons/journal.svg",
  },
  {
    pk: "user#123",
    sk: "category#creativity",
    name: "Creativity",
    color: "#FF9F1C",
    icon: "/icons/paintbrush.svg",
  },
];
