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

// ----------------------

type SectionType = "budget" | "trip details and content" | "personal interests";
type Options = "solo" | "friends" | "couple" | "family";

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
// -> interests
type DetailsCheckboxes = typeof defaultDetailsCheckboxes;
type UserInterestsList = typeof defaultInterestsLabels;
type InterestsSectionType =
  | "restaurant and nightlife"
  | "entertainment"
  | "extreme sports"
  | "wellness";

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
///

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
