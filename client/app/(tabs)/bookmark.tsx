import { View, Text, ImageBackground, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native-animatable";
import { icons, images } from "@/constants";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { ResizeMode, Video } from "expo-av";
import { usePosts } from "@/context/PostsContext";
import { useDispatch, useSelector } from "react-redux";
import { BookmarkItem, StateSliceProp } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addBookmark, removeBookmark } from "@/redux/bookmark/bookmarkSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchInput } from "@/components";
import { DefaultImage } from "@/constants/images";
import { User, VideoCard } from "@/components/PostsFeed";
import { useUser } from "@/context/UserContext";

interface Post {
  _id: string | number;
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

// const VideoCard = ({ item }: VideoCardProps) => {
//   const [play, setPlay] = useState(false);
//   const [menuOpened, setMenuOpened] = useState(false);
//   const favoriteList = useSelector(
//     (state: { bookmark: StateSliceProp }) => state.bookmark.BookmarkList
//   );
//   const isFavorite = favoriteList.some((favorite) => favorite._id === item._id);
//   const dispatch = useDispatch();

//   const handleToggleMenu = () => {
//     setMenuOpened(!menuOpened);
//   };
//   const handleToggleFavorite = async () => {
//     if (isFavorite) {
//       dispatch(removeBookmark(item._id));

//       try {
//         // Remove item from AsyncStorage
//         const storedFavorites = await AsyncStorage.getItem("BookmarkItem");
//         if (storedFavorites) {
//           const updatedFavorites = JSON.parse(storedFavorites).filter(
//             (favItem: BookmarkItem) => favItem._id !== item._id
//           );
//           await AsyncStorage.setItem(
//             "BookmarkItem",
//             JSON.stringify(updatedFavorites)
//           );
//         }
//       } catch (error) {
//         console.error("Error removing item from AsyncStorage: ", error);
//       }
//     } else {

//       dispatch(addBookmark(item));
//       try {
//         // Add item to AsyncStorage
//         const storedFavorites = await AsyncStorage.getItem("BookmarkItem");
//         if (storedFavorites) {
//           const updatedFavorites = [...JSON.parse(storedFavorites), item];
//           await AsyncStorage.setItem(
//             "BookmarkItem",
//             JSON.stringify(updatedFavorites)
//           );
//         } else {
//           await AsyncStorage.setItem("BookmarkItem", JSON.stringify([item]));
//         }
//       } catch (error) {
//         console.error("Error adding item to AsyncStorage: ", error);
//       }
//     }
//   };

//   return (
//     <View className="flex flex-col items-center mb-14">
//       <View className="flex flex-row gap-3 items-start">
//         <View className="flex justify-center items-center flex-row flex-1">
//           <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
//             <Image
//               source={{
//                 uri:
//                   item?.creator?.avatar ||
//                   "https://randomuser.me/api/portraits/med/men/35.jpg",
//               }}
//               className="w-full h-full rounded-md"
//               resizeMode="cover"
//             />
//           </View>

//           <View className="flex justify-center flex-1 ml-3 gap-y-1">
//             <Text
//               className="font-psemibold text-base text-white"
//               numberOfLines={1}
//             >
//               {item?.title}
//             </Text>
//             <Text
//               className="text-xs text-gray-100 font-pregular"
//               numberOfLines={1}
//             >
//               {item?.creator?.name || "User Name"}
//             </Text>
//           </View>
//         </View>

//         <TouchableOpacity onPress={handleToggleMenu} className="pt-2">
//           <Image
//             source={icons.menu}
//             className="w-5 z-10 h-5"
//             resizeMode="contain"
//           />
//         </TouchableOpacity>

//         <View
//           className={`w-36 h-20  top-10 right-0  border items-start z-30 rounded-md bg-black-200 absolute

//           ${menuOpened ? "flex" : "hidden"}

//           `}
//         >
//           <TouchableOpacity
//             onPress={handleToggleFavorite}
//             className="flex-row pt-3 gap-1 ml-4  items-center"
//           >
//             <Image className="w-4 h-4" source={icons.bookmark} />
//             <Text
//               className={` ${
//                 isFavorite ? "font-pmedium" : "font-plight"
//               } text-base text-white`}
//             >
//               {isFavorite ? "  Saved" : "  Save"}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity className="flex-row pt-2 gap-1  ml-4  items-center">
//             <Image className="w-5 h-5" source={icons.del} />
//             <Text
//               className={` ${
//                 isFavorite ? "font-pmedium" : "font-plight"
//               } text-base text-white`}
//             >
//               {" "}
//               Delete{" "}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {play ? (
//         <Video
//           source={{ uri: item?.video }}
//           className="w-full h-60 rounded-xl mt-3"
//           resizeMode={ResizeMode.CONTAIN}
//           useNativeControls
//           shouldPlay
//           onPlaybackStatusUpdate={(status: any) => {
//             if (status?.didJustFinish) {
//               setPlay(false);
//             }
//           }}
//         />
//       ) : (
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() => setPlay(true)}
//           className="w-full h-60 rounded-xl mt-3 relative flex flex-row justify-center items-center"
//         >
//           <ImageBackground
//             source={{ uri: item.thumbnail || DefaultImage }}
//             className="w-full overflow-hidden rounded-xl h-full mt-3"
//             resizeMode="cover"
//           />

//           <Image
//             source={ icons.play}
//             className="w-12 h-12 absolute"
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

const Bookmarks = () => {
  const favoriteList = useSelector(
    (state: { bookmark: StateSliceProp }) => state.bookmark.BookmarkList
  );
  //
  const { user } = useUser();
  const [bookmark, setBookmark] = useState<Post[]>([]);

  useEffect(() => {
    const getBookmarkData = async () => {
      try {
        const bookmarkData = await AsyncStorage.getItem(
          `BookmarkItem_${user?.email}`
        );
        if (bookmarkData) {
          const parsedUserData: Post[] = JSON.parse(bookmarkData);
          setBookmark(parsedUserData);
        } else {
          setBookmark([]);
          // console.log(`No Bookmarks`, bookmarkData);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    getBookmarkData();
  }, [user?.email, bookmark]);

  if (!bookmark) {
    return (
      <SafeAreaView className="bg-primary h-full flex-[1] justify-center items-center ">
        <ActivityIndicator size="large" color="#cccc" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className=" ">
        <Text className="text-2xl ml-5 mb-5 mt-8 font-pmedium text-white">
          Bookmarked Videos...
        </Text>
        <SearchInput placeHolder={"Search Your Saved Videos"} />
        <View className="h-12 " />
        {/* Posts Feed */}
        <FlatList
          data={bookmark}
          renderItem={({ item }) => <VideoCard item={item} key={item._id} />}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View className="h-[20vh]" />}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center">
              <Text className="text-white text-2xl font-pmedium">
                No Bookmarks Yet
              </Text>
            </View>
          }
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

export default Bookmarks;
