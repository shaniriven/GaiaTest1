import { LinkProps } from 'expo-router';

declare module 'expo-router' {
  export interface LinkProps {
    href:
      | "/editUser"
      | "/settings"
      | "/likedPlaces"
      | "/documents"
      | "/savedChats"
      | "/contactUs"
      | "/todoLists"
      | string;
  }
}
/* eslint-disable prettier/prettier */
import { DraggableFlatListProps } from "react-native-draggable-flatlist";
import { CheckboxProps } from "react-native-paper";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { SwiperProps } from "react-native-swiper";
import { ImageSourcePropType } from 'react-native';
/*
declare module "*.png" {
  const value: string;
  export default value;
}
*/


declare module '*.png' {
  import { ImageSourcePropType } from 'react-native';
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
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
interface CountrySearchBarProps {
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
interface Checkbox1Props {
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
export interface Full_Trip {
  id: number;
  title: string;
  dayTrips: Day_Trip[];
  startDate: string;
  endDate: string;
}
// one day of the trip
export interface Day_Trip {
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
// -------------------------------

// type declerations
type Options = 'solo' | 'friends' | 'couple' | 'family';
type GroupPeopleOptions = 'adults' | 'children';

type Categories = 'Rooms' | 'Food & Drinks' | 'Music & Concerts' | 'Activities' | 'Traveling Style' | 'Art & Culture' | 'Entertainment' | 'Shopping' | 'Wellness';
type Labels = |'Hotels' | 'Apartments' | 'Airbnb' | 'Hostels' | 'Resorts' | 'Camping'
              | 'Restaurants' | 'Bars' | 'Cafes' | 'Wine Bars' | 'Fast Food' | 'Local Food' 
              | 'Concerts' | 'Festivals' | 'Orchestra' | 'Musicals' | 'Music Bars' | 'Local Music'
              | 'Skydiving' | 'Snow Sports' | 'Diving' | 'Surf' | 'Camping' | 'Zoo & Safari' | 'Guided Tours'
              | 'Short Hikings' | 'Trekking' | 'Road Tripping'  | 'Urban Exploration' | 'Beaches' | 'Nature'
              | 'Museums' | 'Galleries' | 'National Parks' | 'Monuments' | 'Sightseeing' | 'Marketplace' | 'Cultural Landmarks'
              | 'Movies' | 'Theatre' | 'Comedy Shows' | 'Dance' | 'Opera' | 'Sport Events' | 'Nightlife'
              | 'Malls' | 'Outlets' | 'Supermarket' | 'Artisan Workshops'
              | 'Spas' | 'Gyms' | 'Pool' | 'Parks' ;


type InterestsDictionary = {
  [key in Categories]?: Labels[];
};


type UserInterestesSelections = {
  [key in Categories]?: Labels[];
};


type Locations = {
  [id: string]: { name: string; }
};

// type LocationsList = {
//   data: Location[];
// }

type GroupDetails = {
  adults: number;
  children: number;
  total: number;
  type: string;
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
}