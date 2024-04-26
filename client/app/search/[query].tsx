import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState, SearchInput, VideoCard } from "@/components";
import { usePosts } from "@/context/PostsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultImage } from "@/constants/images";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { posts, dispatch } = usePosts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data exists in AsyncStorage
        const storedData = await AsyncStorage.getItem("posts");
        if (storedData) {
          // Use stored data if available
          dispatch({ type: "SET_POSTS", payload: JSON.parse(storedData) });
          setLoading(false);
        } else {
          // Fetch data from network if no stored data
          const response = await fetch("http://10.0.2.2:4000/api/dora/");
          if (response.ok) {
            const json = await response.json();
            // Store fetched data in AsyncStorage
            await AsyncStorage.setItem("posts", JSON.stringify(json));
            dispatch({ type: "SET_POSTS", payload: json });
          } else {
            console.error("Failed to fetch posts:", response.statusText);
          }
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Error fetching posts:", error.message);
      }
    };
    fetchData();
  }, [dispatch]);

  if (posts === null) {
    return (
       <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
         <ActivityIndicator size="large" color="#cccc" />
       </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts.filter(
          (post) =>
            (post.title &&
              post.title.toLowerCase().includes(query.toLowerCase())) ||
            (post.prompt &&
              post.prompt.toLowerCase().includes(query.toLowerCase()))
        )}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail || DefaultImage}
            video={item.video}
            creator={item.creator.name}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 ">
              <Text className="font-pmedium ml-4 text-gray-100 text-sm">
                Search Results For
              </Text>
              <Text className="text-2xl font-psemibold ml-6 text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search; 