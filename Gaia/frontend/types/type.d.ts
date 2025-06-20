// type declerations
type Options = "solo" | "friends" | "couple" | "family";

type GroupPeopleOptions = "adults" | "children";

type SectionType = "budget" | "trip details and content" | "interests";

type FormFields =
  | "start"
  | "end"
  | "location"
  | "groupType"
  | "adults"
  | "children"
  | "interestsList"
  | "multipleDestinations"
  | "suggestFlights"
  | "isOptimized"
  | "optimizedDates";

type Categories =
  | "Rooms"
  | "Food & Drinks"
  | "Music & Concerts"
  | "Activities"
  | "Traveling Style"
  | "Art & Culture"
  | "Entertainment"
  | "Shopping"
  | "Wellness";

type Labels =
  | "Hotels"
  | "Apartments"
  | "Airbnb"
  | "Hostels"
  | "Resorts"
  | "Camping"
  | "Restaurants"
  | "Bars"
  | "Cafes"
  | "Wine Bars"
  | "Fast Food"
  | "Local Food"
  | "Concerts"
  | "Festivals"
  | "Orchestra"
  | "Musicals"
  | "Music Bars"
  | "Local Music"
  | "Skydiving"
  | "Snow Sports"
  | "Diving"
  | "Surf"
  | "Camping"
  | "Zoo & Safari"
  | "Guided Tours"
  | "Short Hikings"
  | "Trekking"
  | "Road Tripping"
  | "Urban Exploration"
  | "Beaches"
  | "Nature"
  | "Museums"
  | "Galleries"
  | "National Parks"
  | "Monuments"
  | "Sightseeing"
  | "Marketplace"
  | "Cultural Landmarks"
  | "Movies"
  | "Theatre"
  | "Comedy Shows"
  | "Dance"
  | "Opera"
  | "Sport Events"
  | "Nightlife"
  | "Malls"
  | "Outlets"
  | "Supermarket"
  | "Artisan Workshops"
  | "Spas"
  | "Gyms"
  | "Pool"
  | "Parks";

type LocationOptions = {
  multiple: boolean;
  suggestFlights: boolean;
  isOptimized: boolean;
};

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

type InterestsDictionary = {
  [key in Categories]?: Labels[];
};

type UserInterestesSelections = {
  [key in Categories]?: Labels[];
};

type Locations = {
  [id: string]: {
    name: string;
    startDate?: Date;
    endDate?: Date;
  };
};

type GroupDetails = {
  adults: number;
  children: number;
  total: number;
  type: string;
};
