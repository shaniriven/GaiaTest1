/* eslint-disable prettier/prettier */
import { BouncyCheckboxProps } from "react-native-bouncy-checkbox";
import { DraggableFlatListProps } from "react-native-draggable-flatlist";
import { CheckboxProps } from "react-native-paper";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { SwiperProps } from "react-native-swiper";


declare interface BouncyCheckboxClassicProps extends BouncyCheckboxProps {
  state: boolean,
  setState: any,
  label: string
  className?: string;
}

// custom components
// Button
declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "default" | "primary" | "gray-vibe" | "secondary" | "danger" | "outline" | "success";
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
  onPress?: (event: GestureResponderEvent) => void | Promise<void>;
}

// country search bar
declare interface CountrySearchBarProps {
  onSelect: (country: { name: string; code: string }) => void;
}

// tab button
declare interface TabButtonProps extends TouchableOpacityProps {
  bgColor: string;
  textColor: string;
  title: string;
  className?: string;
  style?: any;
  onPress?: (event: GestureResponderEvent) => void | Promise<void>;
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
// full trip
declare interface Full_Trip {
  id: number;
  title: string;
  dayTrips: Day_Trip[];
  startDate: string;
  endDate: string;
}
// one day of the trip
declare interface Day_Trip {
  day: string;
  date: string;
  description: string;
  plan: Destination[];
}

declare interface Destination {
  id: string;
  name: string,
  country: string,
  type: string,
  time_hours: string,
  level: string,
  ages: string,
  
}

declare interface NewTripScreenProps {
  handleSelect?: any | function,
  currentValue?: UserInterestesSelections,
  currentGroupValue?: GroupDetails,
  startDate?: Date,
  endDate?: Date,
  onChangeStart?: any,
  onChangeEnd?: any,
  onChangeGroupType?: any,
  originGroup?: any,
  userInterests?: InterestsDictionary,
  locationList?: Locations,
  locationOptions?: LocationOptions,
  handleLocationOptionsSelect?: any | function,
  handleOptimizedDatesSelect?: any | function,
  optimizDates?: boolean,
  budgetOptions?: BudgetOptions,
}

declare interface SectionProps {
  budgetOptions: BudgetOptions,
  onOptionsChange: function,
}

declare interface RangePickerProps {
  range: number[],
  setRange: function,
}