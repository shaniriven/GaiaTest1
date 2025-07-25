/* eslint-disable prettier/prettier */
import { Redirect } from "expo-router";
import { useAuth } from '@clerk/clerk-expo'


const Home = () => {
  // clerk config
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href="/(root)/(drawer)/(tabs)/home"/>
  }
  return <Redirect href="/(auth)/welcome"/>;
};

export default Home;
