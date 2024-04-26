import {
  View,
  Text,
  Dimensions,
  Alert,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Image } from "react-native-animatable";
import { icons, images } from "@/constants";
import { CustomButton, FormField } from "@/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {firebase} from '@/config'
interface FormState {
    name: string | null;
    email: string | null;
    avatar: string | null | undefined;
    password: string | null;
}
const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [nameError, setNameError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [shakeAnimation] = useState(new Animated.Value(0));

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Upload video to Firebase Storage
      const response = await uploadImage(result.assets[0].uri);
      if (response && response.state === "success") {
        // Update the form state with the video URL
        setForm((prevForm) => ({
          ...prevForm,
          avatar: response.downloadURL,
        }));
      } else {
        console.error("Failed to upload video.");
      }
    }
  };
  
  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageName = `thumbnails/${Date.now()}`;
      const ref = firebase.storage().ref().child(imageName);
      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();
      return { state: "success", downloadURL };
    } catch (error) {
      console.error("Error uploading image:", error);
      return { state: "error" };
    }
  };


  useEffect(() => {
    if (avatarError) {
      shake();
    }
  }, [avatarError]);

  const shake = () => {
    shakeAnimation.setValue(0);
    Animated.timing(shakeAnimation, {
      toValue: 4,
      duration: 400,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start(() => {
      // Clear error state and reset styling after 0.5 seconds
      setTimeout(() => {
        setAvatarError("");
      }, 3 * 1000);
    });
  };

  // http://10.0.2.2:4000
  const submit = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:4000/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      console.log("Response status:", response.status);

      const jsonData = await response.json();

      if (!response.ok) {
        console.log(`Error Message`, jsonData.message);

        const errorMessages = jsonData.message.split(", ");

        errorMessages.forEach((errorMessage: any) => {
          console.log(`Error Message`, errorMessage);

          const messageParts = errorMessage.split(",");

          if (errorMessage.includes("name")) {
            setNameError(errorMessage);
          }
          if (errorMessage.includes("4")) {
            setNameError(errorMessage);
          } else if (errorMessage.includes("email")) {
            setEmailError(errorMessage);
          } else if (errorMessage.includes("Email")) {
            setEmailError(errorMessage);
          }
          // password
          else if (errorMessage.includes("password")) {
            setPasswordError(errorMessage);
          } else if (errorMessage.includes("8")) {
            setPasswordError(errorMessage);
          } else if (errorMessage.includes("Name")) {
            setNameError(errorMessage);
          } else if (errorMessage.includes("Avatar")) {
            setAvatarError(errorMessage);
          }
        });
      }

      if (response.ok) {
        // If signup is successful, store the token and user data in AsyncStorage
        await AsyncStorage.setItem("jwt", jsonData.token);
        await AsyncStorage.setItem("user", JSON.stringify(form));

        // Redirect to home after successful signup
        router.replace("/home");
        // abdullah@muslim.com | musl@#$WE3@2
        // Clear form data
        setForm({
          name: "",
          email: "",
          password: "",
          avatar: "",
        });
      }
    } catch (error: any) {
      console.log(`Error Fetching Data:`, error.message);
      Alert.alert("Sign Up Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 200,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign Up to Dora
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            className="w-32 h-32 mt-5 rounded-2xl items-center justify-center self-center bg-primary/5"
            style={{ overflow: "hidden" }}
          >
            {form.avatar ? (
              <ImageBackground
                source={{ uri: form.avatar }}
                style={{ width: "100%", height: "100%" }}
              ></ImageBackground>
            ) : (
              <Animated.View
                className={`flex-[1] items-center justify-center ${
                  avatarError && "bg-[#FF0000]"
                }  `}
              >
                <Image source={icons.user} className="w-32 h-32" />
                <Animated.Image
                  style={{
                    transform: [
                      {
                        translateX: shakeAnimation.interpolate({
                          inputRange: [0, 1, 2, 3, 4],
                          outputRange: [0, -10, 10, -10, 0],
                        }),
                      },
                    ],
                  }}
                  source={icons.camera}
                  className="w-20 h-20 opacity-75 absolute z-30"
                />
              </Animated.View>
            )}
          </TouchableOpacity>

          <FormField
            setError={setNameError}
            placeholder={`John Doe`}
            title="Username"
            value={form.name}
            handleChangeText={(e: any) => setForm({ ...form, name: e })}
            otherStyles="mt-10"
            error={nameError}
          />

          <FormField
            setError={setEmailError}
            placeholder={`John@example.com`}
            title="Email"
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            error={emailError}
          />

          <FormField
            setError={setPasswordError}
            placeholder={`*******`}
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            error={passwordError}
          />

          <CustomButton
            textStyles={``}
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/log-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
