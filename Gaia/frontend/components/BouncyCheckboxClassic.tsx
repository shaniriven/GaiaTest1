// using
import { BouncyCheckboxClassicProps } from "@/types/declarations";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const BouncyCheckboxClassic = ({
  state,
  setState,
  label,
  className,
  size = 18,
  ...props
}: BouncyCheckboxClassicProps) => {
  return (
    <BouncyCheckbox
      isChecked={state}
      useBuiltInState={false}
      size={size}
      fillColor="#13875b"
      unFillColor="#FFFFFF"
      text={label}
      iconStyle={{ borderColor: "red" }}
      innerIconStyle={{ borderWidth: 2 }}
      textStyle={{
        fontFamily: "Jakarta-Medium",
        textDecorationLine: "none",
        fontSize: 16,
      }}
      onPress={(checked: boolean) => {
        setState(!state);
      }}
      {...props}
    />
  );
};
export default BouncyCheckboxClassic;
