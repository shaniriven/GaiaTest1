import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/newPlan"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
          animationDuration: 1200,
        }}
      />
    </Stack>
  );
};

export default Layout;
