import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Image } from "react-native-animatable";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { CustomButton, FormField } from "@/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const router = useRouter()
  const [isSubmitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:4000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      if (!response.ok) {
        const jsonData = await response.json();
        const errorMessages = jsonData.message.split(", ");
  
        errorMessages.forEach((errorMessage: any) => {
          setEmailError(errorMessage); // Change setEmailError to setError
        });
      }
  
      if (response.ok) {
        const jsonData = await response.json();
        // Store token and user data in AsyncStorage
        await AsyncStorage.setItem("jwt", jsonData.token);
        await AsyncStorage.setItem("user", JSON.stringify(jsonData.user));
        router.replace("/home");
        setForm({
          email: "",
          password: "",
        });
      }
    } catch (error: any) {
      console.log(`Error Fetching Data:`, error);
      // setError(error.message); // Set the error state here
    }
  };
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to Dora
          </Text>

          <FormField
            title="Email"
            value={form.email}
            setError={setEmailError}
            error={emailError}
            handleChangeText={(e: any) => {
              setEmailError("");
              setForm({ ...form, email: e });
            }}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder={`John@example.com`}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => {
              setForm({ ...form, password: e });
            }}
            otherStyles="mt-7"
            placeholder={`*******`}
          />

          <CustomButton
            textStyles={``}
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account? &nbsp;
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
