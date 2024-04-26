import {
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native-animatable";
import { icons, images } from "@/constants";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { ResizeMode, Video } from "expo-av";
import { usePosts } from "@/context/PostsContext";
import { useDispatch, useSelector } from "react-redux";
import { BookmarkItem, PostsState, StateSliceProp } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addBookmark, removeBookmark } from "@/redux/bookmark/bookmarkSlice";
import { DefaultImage } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/context/UserContext";

interface Post {
  _id: number | string;
  title: string;
  video: string;
  prompt: string;
  thumbnail: string;
  creator: {
    name: string;
    avatar: string;
    email: string;
  };
}

interface VideoCardProps {
  item: Post;
}

export const VideoCard = React.memo(({ item }: VideoCardProps | any) => {
  const [play, setPlay] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const favoriteList = useSelector(
    (state: { bookmark: StateSliceProp }) => state.bookmark.BookmarkList
  );
  const isFavorite = favoriteList.some((favorite) => favorite._id === item._id);
  const { posts, dispatch } = usePosts();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (menuOpened) {
      timer = setTimeout(() => setMenuOpened(false), 6000); // Close menu after 3 seconds
    }
    return () => clearTimeout(timer);
  }, [menuOpened]);

  const handleToggleMenu = () => {
    setMenuOpened(!menuOpened);
  };
  const [loading, setLoading] = useState(true);
 const {user} = useUser()
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
        const response = await fetch(
          "http://10.0.2.2:4000/api/dora/"
        );
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
  const handleToggleFavorite = async () => {
    if (!isFavorite) {
      dispatch(addBookmark(item));
      try {
        // Add item to AsyncStorage
        const storedFavorites = await AsyncStorage.getItem(
          `BookmarkItem_${user?.email}`
        );
        if (storedFavorites) {
          const updatedFavorites = [...JSON.parse(storedFavorites), item];
          await AsyncStorage.setItem(
            `BookmarkItem_${user?.email}`,
            JSON.stringify(updatedFavorites)
          );
        } else {
          await AsyncStorage.setItem(
            `BookmarkItem_${user?.email}`,
            JSON.stringify([item])
          );
        }
        setMenuOpened(false);
      } catch (error) {
        console.error("Error adding item to AsyncStorage: ", error);
      }  
    } else {
      dispatch(removeBookmark(item?._id));
      try {
        // Remove item from AsyncStorage
        const storedFavorites = await AsyncStorage.getItem(
          `BookmarkItem_${user?.email}`
        );
        if (storedFavorites) {
          const updatedFavorites = JSON.parse(storedFavorites).filter(
            (favItem: BookmarkItem) => favItem._id !== item._id
          );
          await AsyncStorage.setItem(
            `BookmarkItem_${user?.email}`,
            JSON.stringify(updatedFavorites)
          );
          setMenuOpened(false);
        }
      } catch (error) {
        console.error("Error removing item from AsyncStorage: ", error);
      }
    }
  };
  /**
   *   const handleToggleFavorite = async () => {
    if (!isFavorite) {
      dispatch(addBookmark({ bookmark: item, userEmail: user?.email || "" }));
      
    } else {
      dispatch(removeBookmark({ bookmarkId: item._id, userEmail: user?.email || "" }));
    }
    setMenuOpened(false);
    console.log(isFavorite);
    
  }
   */

  const handleDeleteFav = async () => {
    await AsyncStorage.removeItem(`BookmarkItem_${user?.email}`);
  };
  const handleDeletePost = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:4000/api/dora/${item._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const postData = await response.json();

      dispatch({ type: "DELETE_POSTS", payload: postData });
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <TouchableOpacity
            onPress={handleDeleteFav}
            className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5"
          >
            <Image
              source={{
                uri:
                  item?.creator?.avatar ||
                  "https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg",
              }}
              className="w-full h-full rounded-md"
              resizeMode="cover"
            />
          </TouchableOpacity>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-base text-white"
              numberOfLines={1}
            >
              {item?.title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {item?.creator.name}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleToggleMenu} className="pt-2">
          <Image
            source={icons.menu}
            className="w-5 z-10 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View
          className={`w-36 h-20  top-10 right-0  border items-start z-30 rounded-md bg-black-200 absolute 
         
          ${menuOpened ? "flex" : "hidden"}
          
          `}
        >
          <TouchableOpacity
            onPress={handleToggleFavorite}
            className="flex-row pt-3 gap-1 ml-4  items-center"
          >
            <Image className="w-4 h-4" source={icons.bookmark} />
            <Text
              className={` ${
                isFavorite ? "font-pmedium" : "font-plight"
              } text-base text-white`}
            >
              {isFavorite ? "  Saved" : "  Save"}
            </Text>
          </TouchableOpacity>

          {user?.email === item.creator.email && (
            <TouchableOpacity
              onPress={handleDeletePost}
              className={`flex-row pt-2 gap-1  ml-4  items-center `}
            >
              <Image className="w-5 h-5" source={icons.del} />
              <Text className={` text-base text-white`}> Delete </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: item?.video }}
          className="w-full h-60 rounded-xl mt-3"
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
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-[32vh] rounded-xl mt-3 relative flex flex-row justify-center items-center"
        >
          <ImageBackground
            source={{ uri: item.thumbnail || DefaultImage }}
            className="w-full h-full  overflow-hidden rounded-xl  mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-[17%] h-[17%] absolute "
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}
const PostsFeed = () => {
  const { posts, dispatch } = usePosts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
        const response = await fetch(
          "http://10.0.2.2:4000/api/dora/"
        );
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
    <FlatList
      data={posts}
      keyExtractor={(item) => item?._id}
      renderItem={({ item }) => <VideoCard item={item} key={item._id} />}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default PostsFeed;
