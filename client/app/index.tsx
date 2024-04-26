import { View, Text, Image, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { StatusBar } from "expo-status-bar";
import { CustomButton } from "@/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const OnBoardingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("jwt");
      if (token) {
        // Token exists, navigate to home screen
        router.push("/home");
      }
    };
    checkToken();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
        data={[{ key: "1" }]}
        renderItem={() => (
          <View className="w-full flex justify-center items-center px-4">
            <Image
              source={images.logo}
              className="w-[130px] h-[84px]"
              resizeMode="contain"
            />

            <Image
              source={images.cards}
              className="max-w-[380px] w-full h-[298px]"
              resizeMode="contain"
            />

            <View className="relative mt-5">
              <Text className="text-3xl text-white font-bold text-center">
                Discover Endless{"\n"}
                Possibilities with{" "}
                <Text className="text-secondary-200">Dora</Text>
              </Text>

              <Image
                source={images.path}
                className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
                resizeMode="contain"
              />
            </View>

            <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
              Where Creativity Meets Innovation: Embark on a Journey of Limitless
              Exploration with Dora
            </Text>

            <CustomButton
              title="Continue with Email"
              handlePress={() => router.push("/log-in")}
              containerStyles="w-full mt-7"
            />
          </View>
        )}
      />

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default OnBoardingScreen;
