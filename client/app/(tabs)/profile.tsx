import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { icons } from "@/constants";
import { EmptyState, InfoBox } from "@/components";
import { usePosts } from "@/context/PostsContext";
import { VideoCard } from "@/components/PostsFeed";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { posts, dispatch } = usePosts();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Initial value

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUserData: User = JSON.parse(userData);
          setUser(parsedUserData);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data exists in AsyncStorage
        // Fetch data from network if no stored data
        const response = await fetch(
          "http://10.0.2.2:4000/api/dora/"
        );
        if (response.ok) {
          const json = await response.json();
          // Store fetched data in AsyncStorage
          await AsyncStorage.setItem("posts", JSON.stringify(json));
          dispatch({ type: "SET_POSTS", payload: json });
        } else {
          console.error("Failed to fetch posts:", response.statusText);
        }
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching posts:", error.message);
      }
    };
    fetchData();
  }, [dispatch]);

  if (error) {
    if (error === "Token is not valid") {
      // Handle invalid token error
      AsyncStorage.removeItem("jwt"); // Clear invalid token
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "black", fontSize: 18 }}>
            Session expired. Please log in again.
          </Text>
        </SafeAreaView>
      );
    }
  }
  const logout = () => {
    AsyncStorage.removeItem("jwt"); // Clear invalid token
    AsyncStorage.removeItem("user"); // Clear invalid token
    router.replace("/log-in");
  };

  if (posts === null) {
    return (
      <SafeAreaView className="bg-primary h-full flex-[1] justify-center items-center ">
        <ActivityIndicator size="large" color="#cccc" />
      </SafeAreaView>
    );
  }
  // Filter the posts based on the user's email
  const userPosts = posts.filter((post) => post.creator.email === user?.email);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <VideoCard item={item} key={item._id} />}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center  mt-6 mb-12 px-4">
            <TouchableOpacity onPress={logout} className="flex self-end mb-10">
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="item-center self-center justify-center flex">
              <View className="w-16 h-16 border border-secondary rounded-lg flex item-center justify-center self-center">
                <Image
                  source={{
                    uri:
                      user?.avatar ||
                      "https://randomuser.me/api/portraits/med/men/12.jpg",
                  }}
                  className="w-full h-full self-center rounded-lg"
                  resizeMode="cover"
                />
              </View>

              <InfoBox
                title={user?.name}
                containerStyles="mt-5"
                titleStyles="text-lg"
              />

              <View className="mt-5 flex flex-row">
                <InfoBox
                  title={userPosts.length || 0}
                  subtitle="Posts"
                  titleStyles="text-xl"
                  containerStyles="mr-10"
                />
                <InfoBox
                  title={"100k"}
                  subtitle="Followers"
                  titleStyles="text-xl"
                />
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ProfilePage;
