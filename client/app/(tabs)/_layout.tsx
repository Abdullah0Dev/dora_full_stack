import React from 'react';
import {   Tabs } from 'expo-router';
import { Image,   Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { icons } from '@/constants';
interface TabIconProps {
  icon: string,
  color: string,
  name: string,
  focused: boolean
  width: number;
}
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
const TabIcon = ({ icon, color, name, focused, width }: TabIconProps) => {
  return (
    <View style={{ width: width }}  className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabLayout() {

  return (
    <>
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#FFA001",
      tabBarInactiveTintColor: "#CDCDE0",
      tabBarShowLabel: false,
      headerStyle: {
        backgroundColor: '#161622'
      },
      tabBarStyle: {
        backgroundColor: "#161622",
        borderTopWidth: 1,
        borderTopColor: "#232533",
        height: 84,
      },
    }}
          //  headerShown: useClientOnlyValue(false, true),
         >
       <Tabs.Screen
          name="home" 
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              width={90}
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ), 
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              width={90}
                icon={icons.bookmark}
                color={color}
                name="Bookmark"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              width={90}
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              width={90}
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
