/* eslint-disable prettier/prettier */
import { Text, ScrollView, View, Image, } from "react-native";
import { Link, router } from "expo-router";
import { singUpImage, icons } from "../../constants/index";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";

const SignIn = () => {
  const [form, setForm] = useState(
    {
      email: '',
      password: '',
    }
  );
  
  // auth using flask / clerk 
  const onSignInPress = async () => {};

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px] mt-6">
          <Image
            source={singUpImage} className="z-0 w-full h-[250px]"
          />
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
