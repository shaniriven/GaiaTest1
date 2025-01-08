import { DraggableFlatListProps } from "react-native-draggable-flatlist";

declare module "*.png" {
  const value: string;
  export default value;
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

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "default" | "grey-vibe" | "secondary" | "danger" | "outline" | "success";
  textVariant?:
    | "primary"
    | "default"
    | "secondary"
    | "danger"
    | "success"
    | "grey-vibe";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface CustomDragListProps extends DraggableFlatListProps {
  data: Array;
  className?: string;
}

declare interface Trip {
  key: string;
  name: string,
  country: string,
  type: string,
  time_hours: number,
  level: string,
  ages: number,
}