import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import React from "react";

const CustomKeyboard = ({ children }: any) => {
  const ios = Platform.OS === "ios";
  return (
    <KeyboardAvoidingView
      behavior={ios ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <FlatList
        style={{ flex: 1 }}
        data={[{ key: "1" }]}
        renderItem={({ item }) => <View>{children}</View>}
        keyExtractor={(item) => item.key}
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboard;
