import { View, Text, Image, Touchable, Easing, Animated } from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormField } from "@/components";
import { useRouter } from "expo-router";
import { usePosts } from "@/context/PostsContext";
import { User } from "@/components/PostsFeed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { emplace } from "@reduxjs/toolkit/dist/utils";
import {firebase} from '@/config'
interface FormState {
  title: string;
  video: string | null | undefined;
  thumbnail: string | null  | undefined;
  prompt: string;
  creator: {
    name: string | null;
    email: string | null;
    avatar: string | null;
  };
}

const CreatePost = () => {
  const router = useRouter();
  const { dispatch } = usePosts();
  const [error, setError] = useState(null);
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
        console.log(error);
      }
    };

    getUserData();
  }, []);
  const [form, setForm] = useState<FormState>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
    creator: {
      name: null,
      email: null,
      avatar: null,
    },
  });
  const [titleError, setTitleError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [thumbnailError, setThumbnailError] = useState("");
  const [promptError, setPromptError] = useState("");
  const [shakeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (titleError || videoError || thumbnailError || promptError) {
      shake();
    }
  }, [titleError, videoError, thumbnailError, promptError]);

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
        setTitleError("");
        setVideoError("");
        setThumbnailError("");
        setPromptError("");
      }, 3 * 1000);
    });
  };

  useEffect(() => {
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        creator: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      }));
    }
  }, [user]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // Upload thumbnail image to Firebase Storage
      const response = await uploadImage(result.assets[0].uri);
      if (response && response.state === "success") {
        // Update the form state with the thumbnail URL
        setForm((prevForm) => ({
          ...prevForm,
          thumbnail: response.downloadURL,
        }));
      } else {
        console.error("Failed to upload thumbnail image.");
      }
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Upload video to Firebase Storage
      const response = await uploadVideo(result.assets[0].uri);
      if (response && response.state === "success") {
        // Update the form state with the video URL
        setForm((prevForm) => ({
          ...prevForm,
          video: response.downloadURL,
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

  const uploadVideo = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const videoName = `videos/${Date.now()}`;
      const ref = firebase.storage().ref().child(videoName);
      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();
      return { state: "success", downloadURL };
    } catch (error) {
      console.error("Error uploading video:", error);
      return { state: "error" };
    }
  };

  const videoTitle = (title: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      title,
    }));
  };

  const videoPrompt = (prompt: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      prompt,
    }));
  };
  // Create a post

  const handleSubmit = async () => {
    console.log(form);

    try {
      const response = await fetch("http://10.0.2.2:4000/api/dora/", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const postData = await response.json();

      if (!response.ok) {
        console.log(`Error Message`, postData.message);

        const errorMessages = postData.message.split(", ");

        errorMessages.forEach((errorMessage: any) => {
          console.log(`Error Message`, errorMessage);

          const messageParts = errorMessage.split(",");

          if (errorMessage.includes("title")) {
            setTitleError(errorMessage);
          } else if (errorMessage.includes("Video")) {
            setVideoError(errorMessage);
          } else if (errorMessage.includes("thumbnail")) {
            setThumbnailError(errorMessage);
          } else if (errorMessage.includes("duh")) {
            setPromptError(errorMessage);
          }
          console.log(`Title Error`, errorMessage);
        });

        setError(postData.message); // Set error message here
        return; // Added return to exit the function
      }

      setError(null);
      router.push(`/home`);
      dispatch({ type: "ADD_POSTS", payload: postData });
      setForm({
        ...form,
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
    } catch (error: any) {
      console.error("Error submitting post:", error.message);
      setError(error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          error={titleError}
          setError={setTitleError}
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={videoTitle}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={pickVideo}>
            {form.video ? (
              <Video
                source={{ uri: form.video }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <Animated.View
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
                  className={`w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center ${
                    videoError && "border-red-600"
                  }`}
                >
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </Animated.View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View>
          {videoError && (
            <Text
              className={"text-red-500 font-pregular text-sm mt-3 self-center"}
            >
              {videoError}
            </Text>
          )}
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={pickImage}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <Animated.View
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
                className={`${
                  thumbnailError && "border-red-600"
                } w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2`}
              >
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </Animated.View>
            )}
          </TouchableOpacity>
        </View>
        <View>
          {thumbnailError && (
            <Text
              className={"text-red-500 font-pregular text-sm mt-3 self-center"}
            >
              {thumbnailError}
            </Text>
          )}
        </View>

        <FormField
          error={promptError}
          setError={setPromptError}
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of your video...."
          handleChangeText={videoPrompt}
          otherStyles="mt-7"
        />

        {/* submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="w-full  h-16 mt-12 mb-5 px-4 rounded-xl border-2 border-secondary  border- bg-secondary-100 flex flex-row items-center justify-center"
        >
          <Text className="text-xl font-pbold">Submit & Publish</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePost;
