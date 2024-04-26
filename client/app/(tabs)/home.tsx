import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { icons, images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CustomKeyboard,
  PostsFeed,
  SearchInput,
  Trending,
  VideoCard,
} from "@/components";
import { usePosts } from "@/context/PostsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PostsState } from "@/types";
import { User } from "@/components/PostsFeed";

const Home = () => {
  const { posts, dispatch } = usePosts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
        const response = await fetch("http://10.0.2.2:4000/api/dora/");
        if (response.ok) {
          const json = await response.json();
          // Store posts in AsyncStorage
          await AsyncStorage.setItem("posts", JSON.stringify(json));
          // Update Redux state
          dispatch({ type: "SET_POSTS", payload: json });
        } else {
          console.error("Failed to fetch posts:", response.statusText);
        }
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching posts:", error.message);
      }
    };
  
    // Fetch posts only if not available in Redux state
    const fetchPosts = async () => {
      const storedPosts = await AsyncStorage.getItem("posts");
      if (storedPosts) {
        dispatch({ type: "SET_POSTS", payload: JSON.parse(storedPosts) });
        setLoading(false);
      } else {
        fetchData();
      }
    };
  
    fetchPosts();
  }, [dispatch]);
  
  if (!posts) {
    return (
      <SafeAreaView className="bg-primary h-full flex-[1] justify-center items-center ">
        <ActivityIndicator size="large" color="#cccc" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <CustomKeyboard>
        <HomeAll />
      </CustomKeyboard>
    </SafeAreaView>
  );
};

export default Home;

const HomeAll = () => {
  const [loading, setLoading] = useState(true);

  return (
    <View>
      <HeaderD />
      <SearchInput placeHolder={`Search For a video Topic`} />
      <View className="w-full flex-1 pt-5 pb-8">
        <Text className="text-lg font-pregular text-gray-100 mb-3">
          Latest Videos
        </Text>
        <Trending />
      </View>
      <View className="w-full flex-1 pt-5 pb-8">
        <Text className="text-lg font-pregular text-gray-100 mb-3">
          Latest Posts
        </Text>
        <PostsFeed  />
      </View>
    </View>
  );
};

const HeaderD = () => {
  const deletePosts = () => {
  console.log(`DeletePost`);
  
  };
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Initial value
  const [error, setError] = useState("");
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
  return (
    <View className="flex my-6 px-4 space-y-6">
      <View className="flex justify-between items-start flex-row mb-6">
        <View>
          <Text className="font-pmedium text-sm text-gray-100">
            Welcome Back
          </Text>
          <Text className="text-2xl font-psemibold text-white">
            {user?.name}
          </Text>
        </View>

        <TouchableOpacity onPress={deletePosts} className="mt-1.5">
          <Image
            source={images.logoSmall}
            className="w-9 h-10"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
