import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import marker from "@/assets/icons/marker.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import selectedMarker from "@/assets/icons/selected-marker.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";
import ob2 from "@/assets/images/NatureOrCity.png";
import check from "@/assets/images/check.png";
import ob3 from "@/assets/images/groupIcons.png";
import singUp from "@/assets/images/logo.png";
import ob1 from "@/assets/images/ob1.png";

// More Settings
// interests key to label and save active
export const defaultInterestsLabels = [
  {
    key: "restaurant and nightlife",
    labels: ["local food", "bars", "caffes", "wine bars", "fast food"],
    activeLabels: [""],
  },
  {
    key: "entertainment",
    labels: [
      "concerts",
      "museums",
      "live showa",
      "theatre",
      "sport events",
      "shopping",
    ],
    activeLabels: [""],
  },
  {
    key: "extreme sports",
    labels: ["skydiving", "snow sports", "diving", "surfing", "Safari"],
    activeLabels: [""],
  },
  {
    key: "wellness",
    labels: ["spas", "gyms", "pool", "parks"],
    activeLabels: [""],
  },
];

// -> details checkboxes
export const defaultDetailsCheckboxes = {
  hotels: false,
  hostels: false,
  resorts: false,
  rentals: false,
  camping: false,
  dorms: false,
  guidedTours: false,
  trails: false,
  urbanTrip: false,
  sightseeing: false,
  dayTrip: false,
  includeFlights: false,
  includeMeals: false,
  includeTransport: false,
  includeEvents: false,
};
// checkboxes key to label
// -> settings
export const settingsLabels = [
  { key: "includeFlights", label: "include flights" },
  { key: "includeMeals", label: "include meals" },
  { key: "includeTransport", label: "include public transport" },
  { key: "includeEvents", label: "include seasonal and local events" },
] as const;
// -> activities
export const activitiesLabels = [
  { key: "guidedTours", label: "guided tours" },
  { key: "trails", label: "trails" },
  { key: "urbanTrip", label: "urban trip" },
  { key: "sightseeing", label: "sightseeing" },
  // { key: "dayTrip", label: "day trip" },
] as const;
// -> accommodationLabels
export const accommodationLabels = [
  { key: "hotels", label: "hotels" },
  { key: "hostels", label: "hostels/dorms" },
  { key: "resorts", label: "resorts" },
  { key: "camping", label: "camping" },
] as const;

// not tested

export const colors = {
  primary: "#13875b",
};

export const onboarding = [
  {
    id: 1,
    title: "The journey begins\nwith Gaia",
    description:
      "The perfect trip is just a tap away\n Turn a dream into reality",
    image: ob1,
  },
  {
    id: 2,
    description: "Explore, discover and experience different places",
    image: ob2,
  },
  {
    id: 3,
    description: "Start you journey and let Gaia help you through the way",
    title: "Save and costumize your plans at any time",
    image: ob3,
  },
];

export const newTripPlanningScreens = [];

export const singUpImage = singUp;
export const checkVerification = check;

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  marker,
  out,
  person,
  pin,
  point,
  profile,
  search,
  selectedMarker,
  star,
  target,
  to,
};

export const screens = [
  {
    id: 0,
    title: "location",
    icon: "location",
    fields: ["location"],
  },
  {
    id: 1,
    title: "dates",
    icon: "calendar",
    fields: ["dates"],
  },
  {
    id: 2,
    title: "travelers",
    icon: "user",
    fields: ["adults", "children"],
  },
  {
    id: 3,
    title: "interests",
    icon: "plus",
    fields: ["interests"],
  },
];
