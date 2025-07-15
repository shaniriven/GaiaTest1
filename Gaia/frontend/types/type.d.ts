import {
  defaultDetailsCheckboxes,
  defaultInterestsLabels,
} from "@/constants/index";

// new trip types
// -> interests
type SectionType = "budget" | "trip details and content" | "personal interests";
type DetailsCheckboxes = typeof defaultDetailsCheckboxes;
type UserInterestsList = typeof defaultInterestsLabels;
type InterestsSectionType =
  | "restaurant and nightlife"
  | "entertainment"
  | "extreme sports"
  | "wellness";

// -> budget
type BudgetOptions = {
  budgetPerNight: boolean;
  includeMeals: boolean;
  budgetPerPerson: boolean;
  range: number[];
};
type BudgetRange = {
  range: number[];
  onRangeChange?: function;
};

// -> location
type Locations = {
  [id: string]: {
    name: string;
    startDate?: Date;
    endDate?: Date;
  };
};
type LocationOptions = {
  anywhere: boolean;
  suggestFlights: boolean;
  // isOptimized: boolean;
};
// -> group
type GroupDetails = {
  adults: number;
  children: number;
  total: number;
  type: string;
};
type Options = "solo" | "friends" | "couple" | "family";
// ---------------------------------------------------------------

// plan: basic types
// -> activities in a day
type Activity = {
  title: string;
  time: string;
  description: string;
  cost: string;
  notes: string;
  image?: any;
};
// -> daily plan
type DayPlan = {
  date: string;
  day: string;
  theme: string;
  activities: Activity[];
  food: string;
};
// -> Agent request type
type AgentPlan = {
  trip_dates: string;
  locations: string;
  flight_info?: string;
  group_size: number;
  budget: string;
  itinerary: DayPlan[];
  creator: string;
  formatted_date: string;
  name: string;
  is_past: boolean;
  id: string;
  value?: string;
};
// ---------------------------------------------------------------
// plan: dates types
// -> dates swiper buttons
type DateLabel = { day: string; value: string };

// ---------------------------------------------------------------
// to check

type GroupPeopleOptions = "adults" | "children";

type InterestsDictionary = {
  [key in Categories]?: Labels[];
};

type UserInterestesSelections = {
  [key in Categories]?: Labels[];
};
