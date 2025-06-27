import {
  defaultDetailsCheckboxes,
  defaultInterestsLabels,
} from "@/constants/index";

// new trip - types not in use yet
// type FormFields =
//   | "locations"
//   | "multipleDestinations"
//   | "suggestFlights"
//   | "isOptimized"
//   | "startDate"
//   | "endDate"
//   | "optimizedDates"
//   | "adults"
//   | "children"
//   | "groupType"
//   | "budget"
//   | "interestsList"
//   | "detailsList";

// type FormValues =
//   | Locations
//   | LocationOptions
//   | Date
//   | boolean
//   | { adults: number; children: number; total: number; type: string }
//   | BudgetOptions
//   | UserInterestsList
//   | DetailsCheckboxes;

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
  multiple: boolean;
  suggestFlights: boolean;
  isOptimized: boolean;
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

// plan types
type Activity = {
  time: string;
  description: string;
  cost: string;
  notes: string;
};
type DayPlan = {
  date: string;
  day: string;
  theme: string;
  activities: Activity[];
  food: string;
};

type AgentPlan = {
  trip_dates: string;
  locations: string;
  group_size: number;
  budget: string;
  itinerary: DayPlan[];
  creator: string;
  formatted_date: string;
  name: string;
  is_past: boolean;
};

// to check

//////

type GroupPeopleOptions = "adults" | "children";

// type Categories =
//   | "accommodation"
//   | "activities"
//   | "settings"
//   | "Activities"
//   | "Traveling Style"
//   | "Art & Culture"
//   | "Entertainment"
//   | "Shopping"
//   | "Wellness";

// type Labels =
//   | "Hotels"
//   | "Apartments"
//   | "Airbnb"
//   | "Hostels"
//   | "Resorts"
//   | "Camping"
//   | "Restaurants"
//   | "Bars"
//   | "Cafes"
//   | "Wine Bars"
//   | "Fast Food"
//   | "Local Food"
//   | "Concerts"
//   | "Festivals"
//   | "Orchestra"
//   | "Musicals"
//   | "Music Bars"
//   | "Local Music"
//   | "Skydiving"
//   | "Snow Sports"
//   | "Diving"
//   | "Surf"
//   | "Camping"
//   | "Zoo & Safari"
//   | "Guided Tours"
//   | "Short Hikings"
//   | "Trekking"
//   | "Road Tripping"
//   | "Urban Exploration"
//   | "Beaches"
//   | "Nature"
//   | "Museums"
//   | "Galleries"
//   | "National Parks"
//   | "Monuments"
//   | "Sightseeing"
//   | "Marketplace"
//   | "Cultural Landmarks"
//   | "Movies"
//   | "Theatre"
//   | "Comedy Shows"
//   | "Dance"
//   | "Opera"
//   | "Sport Events"
//   | "Nightlife"
//   | "Malls"
//   | "Outlets"
//   | "Supermarket"
//   | "Artisan Workshops"
//   | "Spas"
//   | "Gyms"
//   | "Pool"
//   | "Parks";

type InterestsDictionary = {
  [key in Categories]?: Labels[];
};

type UserInterestesSelections = {
  [key in Categories]?: Labels[];
};
