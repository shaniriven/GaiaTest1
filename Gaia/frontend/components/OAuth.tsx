// social authentication
import { View, Text, Image } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";
import { useSSO } from "@clerk/clerk-expo";
import { useCallback, useEffect } from "react";

import * as AuthSession from "expo-auth-session";

const OAuth = () => {
  const { startSSOFlow } = useSSO();

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await googleOAuth(startSSOFlow);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);
  return (
    <View>
      <View className="flex flex-row justify-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100 mt-3" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100 mt-3" />
      </View>

      <CustomButton
        title="Log In with Google"
        bgVariant="outline"
        textVariant="primary"
        className="mt-2 w-full shadow-none mt-3 border-neutral-400"
        onPress={handleGoogleSignIn}
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
      />
    </View>
  );
};

export default OAuth;

// const { createdSessionId, setActive, signIn, signUp } =
//   await startSSOFlow({
//     strategy: "oauth_google",
//     // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
//     // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
//     redirectUrl: AuthSession.makeRedirectUri(),
//   });

// // If sign in was successful, set the active session
// if (createdSessionId) {
//   setActive!({ session: createdSessionId });
// } else {
//   // If there is no `createdSessionId`,
//   // there are missing requirements, such as MFA
//   // Use the `signIn` or `signUp` returned from `startSSOFlow`
//   // to handle next steps
// }
