import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";

import ClientHomeScreen from "@/screens/client/ClientHomeScreen";
import BrowseScreen from "@/screens/client/BrowseScreen";
import ClientAppointmentsScreen from "@/screens/client/ClientAppointmentsScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { HeaderTitle } from "@/components/HeaderTitle";

export type ClientTabParamList = {
  HomeTab: undefined;
  BrowseTab: { category?: string } | undefined;
  AppointmentsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<ClientTabParamList>();
const HomeStack = createNativeStackNavigator();
const BrowseStack = createNativeStackNavigator();
const AppointmentsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <HomeStack.Navigator
      screenOptions={getCommonScreenOptions({ theme, isDark })}
    >
      <HomeStack.Screen
        name="Home"
        component={ClientHomeScreen}
        options={{
          headerTitle: () => <HeaderTitle title="BookIt" />,
        }}
      />
    </HomeStack.Navigator>
  );
}

function BrowseStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <BrowseStack.Navigator
      screenOptions={getCommonScreenOptions({ theme, isDark })}
    >
      <BrowseStack.Screen
        name="Browse"
        component={BrowseScreen}
        options={{ headerTitle: "Browse Professionals" }}
      />
    </BrowseStack.Navigator>
  );
}

function AppointmentsStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <AppointmentsStack.Navigator
      screenOptions={getCommonScreenOptions({ theme, isDark })}
    >
      <AppointmentsStack.Screen
        name="Appointments"
        component={ClientAppointmentsScreen}
        options={{ headerTitle: "My Appointments" }}
      />
    </AppointmentsStack.Navigator>
  );
}

function ProfileStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={getCommonScreenOptions({ theme, isDark })}
    >
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerTitle: "Profile" }}
      />
    </ProfileStack.Navigator>
  );
}

export default function ClientTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BrowseTab"
        component={BrowseStackNavigator}
        options={{
          title: "Browse",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsStackNavigator}
        options={{
          title: "Appointments",
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
