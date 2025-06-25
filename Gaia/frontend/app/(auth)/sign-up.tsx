/* eslint-disable prettier/prettier */
import { Text, ScrollView, View, Image, Alert, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, } from "react-native";
import { Link, router } from "expo-router";
import { singUpImage, icons, checkVerification } from "../../constants/index";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";
import { ReactNativeModal } from "react-native-modal";
import { useSignUp } from "@clerk/clerk-expo";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [verification, setVerification] = useState({
    state: 'default',
    error: "",
    code: "",
  });

  const [form, setForm] = useState(
    {
      name: '',
      email: '',
      password: '',
    }
  );
  
// clrek auth - Handle submission of sign-up form
const onSignUpPress = async () => {
  if (!isLoaded) return;

  // Start sign-up process using email and password provided
  try {
    await signUp.create({
      emailAddress: form.email,
      password: form.password,
    });

    // Send user an email with verification code
    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

    // Set 'setVerification' to true to display second form
    setVerification({...verification, state: 'pending',});
  } catch (err: any) {
    Alert.alert('Error', err.errors[0].longMessage)
  }
}

// Handle submission of verification form
const onVerifyPress = async () => {
  if (!isLoaded) return;

  try {
    // Use the code the user provided to attempt verification
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code: verification.code,
    });

    // If verification was completed, set the session to active and redirect the user
    if (signUpAttempt.status === 'complete') {
      // ----------------------------------------------------------------------> insert database connection 
      await setActive({ session: signUpAttempt.createdSessionId })
      setVerification({ ...verification, state: 'success' })
    } else {
      setVerification({ ...verification, error: "Verification failed", state: 'failed' })
    }
  } catch (err: any) {
    setVerification({ ...verification, error: err.errors[0].longMessage, state: 'failed' })
  }
}

  return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1 bg-white"         keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px] mt-6">
          <Image source={singUpImage} className="z-0 w-full h-[250px]" />
        </View>
        <View className="px-4 left-5" style={{ marginTop: 60 }}>
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5">
            Create Your Account
          </Text>
        </View>

        <View className="ml-5 mr-5">
          <InputField 
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name} 
            onChangeText={(value: string) =>
              setForm({
                ...form,
                name: value,
              })
            }
          />
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
          />

          <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-10" bgVariant="primary" IconLeft={undefined} IconRight={undefined} />
          
          <OAuth/>
          
          <Link href="/sign-in" className="text-lg text-center text-general-200 mt-5">
            <Text>Already have an account? </Text>
            <Text className="text-primary-111">Log In</Text>
          </Link>
        </View>

        <ReactNativeModal isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === 'success') setShowSuccessModal(true)
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="text-base font-Jakarta mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code: string) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              className="mt-5"
              bgVariant="gray-vibe"
              textVariant="primary" IconLeft={undefined} IconRight={undefined}            />

          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image source={checkVerification} className="w-[70px] h-[70px] mx-auto my-5"/>
              <Text className="text-2xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified  your account.
            </Text>
            <CustomButton
              title="Start Planning"
              onPress={() => {
                setShowSuccessModal(false);
                router.push(`/(root)/(tabs)/home`);
              } }
              className="mt-10"
              bgVariant="gray-vibe"
              textVariant="primary" IconLeft={undefined} IconRight={undefined}            />
            </View>
        </ReactNativeModal>
      </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  );
};

export default SignUp;
