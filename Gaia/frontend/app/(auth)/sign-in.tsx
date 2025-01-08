/* eslint-disable prettier/prettier */
import { Text, ScrollView, View, Image, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { singUpImage, icons } from "../../constants/index";
import InputField from "@/components/InputField";
import { useCallback, useState } from "react";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '',});
  
  // auth using clerk 
  // Handle the submission of the sign-in form
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      // If sign-in process is complete, set the created session as active and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to complete further steps.
        Alert.alert('Error', err.errors[0].longMessage)
      }
    } catch (err) {
      Alert.alert('Error', err.errors[0].longMessage)
    }
  }, [isLoaded, form.email, form.password])


  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px] mt-6">
          <Image source={singUpImage} className="z-0 w-full h-[250px]" />
        </View>
        <View className="px-4 left-5" style={{ marginTop: 60 }}>
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5">
            Welcome 👋
          </Text>
        </View>

        <View className="ml-5 mr-5">
          <InputField 
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email} 
            onChangeText={(value) =>
              setForm({
                ...form,
                email: value,
              })
            }
          />
          <InputField 
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password} 
            onChangeText={(value) =>
              setForm({
                ...form,
                password: value,
              })
            }
          />
          <CustomButton title="Sign In" onPress={onSignInPress} className="mt-10" bgVariant="primary" />
          <OAuth/>
          <Link href="/sign-up" className="text-lg text-center text-general-200 mt-5">
            <Text>Don't have an account? </Text>
            <Text className="text-primary-111">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
