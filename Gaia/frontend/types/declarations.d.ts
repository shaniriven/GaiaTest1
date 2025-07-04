import {
  defaultDetailsCheckboxes,
  defaultInterestsLabels,
} from "@/constants/index";
import { BouncyCheckboxProps } from "react-native-bouncy-checkbox";
import { DraggableFlatListProps } from "react-native-draggable-flatlist";
import { SwiperProps } from "react-native-swiper";
import {
  BudgetOptions,
  DetailsCheckboxes,
  GroupDetails,
  LocationOptions,
  Locations,
} from "./type";

// new trip interfaces
declare interface NewTripScreenProps {
  handleSelect?: any | function;
  handleLocationOptionsSelect?: any | function;
  locationList?: Locations;
  locationOptions?: LocationOptions;
  startDate?: Date;
  endDate?: Date;
  onChangeStart?: any;
  onChangeEnd?: any;
  handleOptimizedDatesSelect?: any | function;
  optimizDates?: boolean;
  onChangeGroupType?: any;
  currentGroupValue?: GroupDetails;
  detailsCheckboxes?: typeof defaultDetailsCheckboxes;
  interestsOptions?: typeof defaultInterestsLabels;
  budgetOptions?: BudgetOptions;
  onChangeInterests?: any;
}
declare interface SectionProps {
  budgetOptions?: BudgetOptions;
  detailsOptions?: DetailsCheckboxes;
  onOptionsChange: function;
  interestsOptions?: typeof defaultInterestsLabels;
}

// components
// -> checkbox
declare interface BouncyCheckboxClassicProps extends BouncyCheckboxProps {
  state: boolean;
  setState: any;
  label: string;
  className?: string;
}
// -> floating eliptic tab button
declare interface TabButtonProps extends TouchableOpacityProps {
  bgColor: string;
  textColor: string;
  title: string;
  className?: string;
  style?: any;
  onPress?: (event: GestureResponderEvent) => void | Promise<void>;
  activeStyle?: string;
}

// not checked
// custom components
// Button
declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?:
    | "default"
    | "primary"
    | "gray-vibe"
    | "secondary"
    | "danger"
    | "outline"
    | "success";
  textVariant?:
    | "primary"
    | "default"
    | "secondary"
    | "danger"
    | "success"
    | "gray-vibe";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
  textClassName?: string;
  pastTripButton?: boolean;
  tripDate?: string;
  onPress?: (event: GestureResponderEvent) => void | Promise<void>;
}

// country search bar
declare interface CountrySearchBarProps {
  onSelect: (country: { name: string; code: string }) => void;
}

// tab icon
declare interface TabIconProps {
  source: string;
  focused: boolean;
}

// screen header
declare interface ScreenHeaderProps extends ViewProps {
  text: string;
}

// input field
declare interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  fontAwesome?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: any;
  keyboardType?: KeyboardTypeOptions;
}

// checkbox
declare interface Checkbox1Props {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  value: string;
  selectedOption: Option | null;
  onSelect: (value: Option) => void;
}

// drag list
declare interface CustomDragListProps extends DraggableFlatListProps {
  plan: Destination[];
  className?: string;
  onSave?: any;
  dragDisabled?: boolean;
  onDragEnd?: any;
}

// trips flat list
declare interface TripsFlatListProps extends ViewProps {
  allTripsList: Full_Trip[];
  numColumns: number;
  squareSize: number;
  className?: string;
  updatePlan: function;
}

// trip swiper
declare interface TripSwiperProps extends ViewProps {
  dayTrips: Day_Trip[];
  color: string;
  className?: string;
  handleSave?: any;
}

// days swiper
declare interface DaysSwiperProps extends SwiperProps {
  data: Day_Trip;
  className?: string;
}

// trip tests -------------------------------
// // full trip
// declare interface Full_Trip {
//   id: number;
//   title: string;
//   dayTrips: Day_Trip[];
//   startDate: string;
//   endDate: string;
// }

// one day of the trip
declare interface Day_Trip {
  day: string;
  date: string;
  description: string;
  plan: Destination[];
}

declare interface Destination {
  id: string;
  name: string;
  country: string;
  type: string;
  time_hours: string;
  level: string;
  ages: string;
}

declare interface RangePickerProps {
  range: number[];
  setRange: function;
}
