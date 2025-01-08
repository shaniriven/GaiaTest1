import { useClerk } from '@clerk/clerk-react'
import { router } from "expo-router";
import { Alert, Button } from 'react-native'

const SignOutButton = () => {
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      router.replace('/(auth)/welcome');
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert('Error', err.errors[0].longMessage)
    }
  }

  return <Button title="Sign out" onPress={handleSignOut} />
}

export default SignOutButton;