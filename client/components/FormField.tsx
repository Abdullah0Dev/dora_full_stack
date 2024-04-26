import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from "react-native";

import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  error,
  setError, // Add setError to props
  ...props
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (error) {
      shake();
    }
  }, [error]);

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
        setError(null);
      }, 3 * 1000);
    });
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

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
        className={`w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center ${
          error ? "border border-red-600" : ""
        } `}
      >
        <TextInput
          className={`flex-1 text-white font-psemibold text-base `}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          onBlur={() => error && shake()}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {error && (
        <Animated.Text
          className={"text-red-500 font-pregular text-sm mt-3 self-center"}
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

export default FormField;
