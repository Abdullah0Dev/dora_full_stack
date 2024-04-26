import { Stack } from "expo-router";

export const AuthRouter = () => {
  return <AuthRouting />;
};

const AuthRouting = () => {
  return (
    <Stack>
      <Stack.Screen name="log-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false, headerTitle: "Sign Up" }} />
    </Stack>
  );
};
