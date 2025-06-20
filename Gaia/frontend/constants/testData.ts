import { Destination, Full_Trip } from "@/types/declarations";

export const greek_trips: Destination[] = [
  {
    id: "1",
    name: "Mount Olympus ",
    country: "Greece",
    type: "walking track",
    time_hours: "8",
    level: "advanced",
    ages: "10",
  },
  {
    id: "2",
    name: "Zeus baths",
    country: "Greece",
    type: "walking track",
    time_hours: "6",
    level: "advanced",
    ages: "10",
  },
  {
    id: "3",
    name: "Parthenon",
    country: "Greece",
    time_hours: "3",
    type: "walking track",
    level: "everyone",
    ages: "0",
  },
  {
    id: "4",
    name: "Domaine Zafeirakis",
    country: "Greece",
    time_hours: "3",
    type: "Winery",
    level: "everyone",
    ages: "18",
  },
  {
    id: "5",
    name: "Domaine Zafeirakis",
    country: "Greece",
    time_hours: "3",
    type: "Winery",
    level: "everyone",
    ages: "18",
  },
  {
    id: "6",
    name: "Domaine Zafeirakis",
    country: "Greece",
    time_hours: "3",
    type: "Winery",
    level: "everyone",
    ages: "18",
  },
];

// trip for testing -> use trip from database
export const test_trip_I: Full_Trip = {
  id: 1,
  title: "Athens",
  dayTrips: [
    {
      day: "1",
      date: "11-11-2025",
      description: "This is a test trip 1",
      plan: greek_trips,
    },
    {
      day: "2",
      date: "12-11-2025",
      description: "This is a test trip 2",
      plan: greek_trips,
    },
    {
      day: "3",
      date: "13-11-2025",
      description: "This is a test trip 3",
      plan: greek_trips,
    },
    {
      day: "4",
      date: "14-11-2025",
      description: "This is a test trip 4",
      plan: greek_trips,
    },
    {
      day: "5",
      date: "15-11-2025",
      description: "This is a test trip 5",
      plan: greek_trips,
    },
  ],
  startDate: "11-11-2025",
  endDate: "15-11-2025",
};

export const test_trip_II: Full_Trip = {
  id: 2,
  title: "Paris",
  dayTrips: [
    {
      day: "1",
      date: "11-11-2025",
      description: "This is a test trip 1",
      plan: greek_trips,
    },
    {
      day: "2",
      date: "12-11-2025",
      description: "This is a test trip 2",
      plan: greek_trips,
    },
    {
      day: "3",
      date: "13-11-2025",
      description: "This is a test trip 3",
      plan: greek_trips,
    },
    {
      day: "4",
      date: "14-11-2025",
      description: "This is a test trip 4",
      plan: greek_trips,
    },
    {
      day: "5",
      date: "15-11-2025",
      description: "This is a test trip 5",
      plan: greek_trips,
    },
  ],
  startDate: "11-11-2025",
  endDate: "15-11-2025",
};
