import {
  UserInput,
  CategoryInput,
  ActivityInput,
  ActivityLogInput,
  SuccessLogInput,
} from "./queries/seed.js";

export const users: UserInput[] = [
  {
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Smith",
  },
  {
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Johnson",
  },
  {
    email: "carol@example.com",
    firstName: "Carol",
    lastName: "Williams",
  },
  {
    email: "david@example.com",
    firstName: "David",
    lastName: "Brown",
  },
  {
    email: "eve@example.com",
    firstName: "Eve",
    lastName: "Davis",
  },
];

export const categories: CategoryInput[][] = [
  [
    { label: "Fitness", color: "red", icon: "dumbbell" },
    { label: "Work", color: "blue", icon: "briefcase" },
    { label: "Hobbies", color: "green", icon: "palette" },
  ],
  [
    { label: "Health", color: "pink", icon: "heart" },
    { label: "Finance", color: "purple", icon: "dollar-sign" },
  ],
  [
    { label: "Travel", color: "teal", icon: "plane" },
    { label: "Education", color: "orange", icon: "book" },
    { label: "Music", color: "yellow", icon: "music" },
  ],
  [
    { label: "Work", color: "blue", icon: "briefcase" },
    { label: "Family", color: "indigo", icon: "users" },
  ],
  [
    { label: "Fitness", color: "red", icon: "dumbbell" },
    { label: "Cooking", color: "brown", icon: "utensils" },
    { label: "Gaming", color: "cyan", icon: "gamepad" },
  ],
];

// Activities for each user
export const activities: ActivityInput[][] = [
  [
    { label: "Morning Run" },
    { label: "Project Reports" },
    { label: "Painting" },
  ],
  [{ label: "Meditation" }, { label: "Budget Planning" }],
  [
    { label: "Trip Planning" },
    { label: "Online Course" },
    { label: "Guitar Practice" },
  ],
  [{ label: "Team Meetings" }, { label: "Quality Family Time" }],
  [
    { label: "Gym Workout" },
    { label: "Recipe Testing" },
    { label: "Online Gaming" },
  ],
];

// Activity logs (each activity has one log for 2025-08)
export const activityLogs: ActivityLogInput[][] = [
  [
    { year: 2025, month: 8, target: 12 },
    { year: 2025, month: 8, target: 20 },
    { year: 2025, month: 8, target: 8 },
  ],
  [
    { year: 2025, month: 8, target: 15 },
    { year: 2025, month: 8, target: 10 },
  ],
  [
    { year: 2025, month: 8, target: 5 },
    { year: 2025, month: 8, target: 12 },
    { year: 2025, month: 8, target: 18 },
  ],
  [
    { year: 2025, month: 8, target: 16 },
    { year: 2025, month: 8, target: 20 },
  ],
  [
    { year: 2025, month: 8, target: 14 },
    { year: 2025, month: 8, target: 6 },
    { year: 2025, month: 8, target: 22 },
  ],
];

// Success logs (days completed within the month)
export const successLogs: SuccessLogInput[][][] = [
  [
    [{ day: 1 }, { day: 3 }, { day: 5 }], // Morning Run
    [{ day: 2 }, { day: 6 }, { day: 12 }], // Project Reports
    [{ day: 7 }, { day: 14 }], // Painting
  ],
  [
    [{ day: 1 }, { day: 2 }, { day: 4 }], // Meditation
    [{ day: 5 }, { day: 10 }], // Budget Planning
  ],
  [
    [{ day: 8 }], // Trip Planning
    [{ day: 3 }, { day: 9 }, { day: 15 }], // Online Course
    [{ day: 6 }, { day: 12 }, { day: 18 }, { day: 24 }], // Guitar Practice
  ],
  [
    [{ day: 2 }, { day: 9 }, { day: 16 }], // Team Meetings
    [{ day: 5 }, { day: 11 }, { day: 19 }], // Family Time
  ],
  [
    [{ day: 1 }, { day: 3 }, { day: 7 }, { day: 9 }], // Gym Workout
    [{ day: 6 }, { day: 13 }], // Recipe Testing
    [{ day: 4 }, { day: 8 }, { day: 15 }, { day: 21 }], // Online Gaming
  ],
];
