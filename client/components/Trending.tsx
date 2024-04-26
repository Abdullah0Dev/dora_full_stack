import React, { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import * as Animatable from "react-native-animatable";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { icons } from "@/constants";
import { usePosts } from "@/context/PostsContext";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Post, PostsState } from "@/types";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};
interface TrendingItemProps {
  activeItem: Post | string | number | null ;
  item: {
    _id: string;
    video: string;
    thumbnail: string;
  };
}
const TrendingItem: React.FC<TrendingItemProps> = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item?._id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item?.video }}
          className="w-[35vw] h-[20vh] rounded-[33px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status: any) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className=""
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item?.thumbnail,
            }}
            className="w-[50vw] h-[38vh] rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-[20%] h-[20%] absolute top-[40%] left-[40%] "
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};
const Trending = () => {
  const { posts, dispatch } = usePosts();
  const [activeItem, setActiveItem] = useState(posts ? posts[0] : null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if posts data is available in AsyncStorage
        const cachedPosts = await AsyncStorage.getItem("posts");
        if (cachedPosts) {
          dispatch({ type: "SET_POSTS", payload: JSON.parse(cachedPosts) });
        }
        
        const response = await fetch("http://10.0.2.2:4000/api/dora/");
        if (response.ok) {
          const json = await response.json();
          await AsyncStorage.setItem("posts", JSON.stringify(json));
          dispatch({ type: "SET_POSTS", payload: json });
        } else {
          console.error("Failed to fetch posts:", response.statusText);
        }
        setLoading(false);
      }  catch (error: any) {
        console.error("Error fetching posts:", error.message);
      }
    };
    fetchData();
  }, [dispatch]);

  const viewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  if (posts === null) {
    return <ActivityIndicator size="large" color="#cccc" />;
  }

  return (
    <View>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <TrendingItem activeItem={activeItem} item={item} />
        )}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{ 
          itemVisiblePercentThreshold: 70,
        }}
        contentOffset={{ x: 170, y: 0 }} // Add y: 0 here
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: "row",
  },
});
export default Trending;
