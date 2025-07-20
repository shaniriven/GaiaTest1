/* eslint-disable prettier/prettier */
import { Text, ScrollView, View, Image, Alert, KeyboardAvoidingView, Platform } from "react-native";
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
  

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        Alert.alert('Error','error, cant sign in')
      }
    } catch (err: any) {
      Alert.alert('Error', 'invalid email or password');
    }
  }, [isLoaded, form.email, form.password])


  return (
    <ScrollView 
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[100px] mt-6">
          <Image source={singUpImage as any} className="z-0 w-full h-[200px]" />
        </View>
        <View className="px-4 left-5" style={{ marginTop: 150 }}>
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5">
            Welcome 👋
          </Text>
        </View>

        <View className="ml-5 mr-5 mt-8">
          <InputField 
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email} 
            onChangeText={(value: string) =>
              setForm({
                ...form,
                email: value,
              })
            }
            containerStyle="mb-6"
            inputStyle="text-base"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <InputField 
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password} 
            onChangeText={(value: any) =>
              setForm({
                ...form,
                password: value,
              })
            }
            containerStyle="mb-8"
            inputStyle="text-base"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <CustomButton title="Sign In" onPress={onSignInPress} className="mt-6" bgVariant="primary" />
          <Link href="/sign-up" className="text-lg text-center text-general-200 mt-5 mb-8">
            <Text>Don't have an account? </Text>
            <Text className="text-primary-111">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
