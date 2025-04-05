/* eslint-disable prettier/prettier */
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { DefaultTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

// Clerk imports
import { tokenCache } from "@/cache";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });
  const theme = {
    ...DefaultTheme, // or MD3DarkTheme
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: 'grey',
      secondary: '#f1c40f',
      tertiary: '#a1b2c3',
    },
  };
  // clerk config
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
    );
  }

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
        <PaperProvider theme={theme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(root)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          </PaperProvider>
          <StatusBar style="auto" />
        </ClerkLoaded>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
