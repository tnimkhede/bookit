import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";

import ProfessionalDashboardScreen from "@/screens/professional/ProfessionalDashboardScreen";
import ScheduleScreen from "@/screens/professional/ScheduleScreen";
import ProfessionalAppointmentsScreen from "@/screens/professional/ProfessionalAppointmentsScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { HeaderTitle } from "@/components/HeaderTitle";

export type ProfessionalTabParamList = {
  DashboardTab: undefined;
  ScheduleTab: undefined;
  AppointmentsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<ProfessionalTabParamList>();
const DashboardStack = createNativeStackNavigator();
const ScheduleStack = createNativeStackNavigator();
const AppointmentsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function DashboardStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <DashboardStack.Navigator
      screenOptions={getCommonScreenOptions({ theme, isDark })}
    >
      <DashboardStack.Screen
        name="Dashboard"
        component={ProfessionalDashboardScreen}
        options={{
          headerTitle: () => <HeaderTitle title="BookIt" />,
        }}
      />
    </DashboardStack.Navigator>
  );
}

function ScheduleStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <ScheduleStack.Navigator
      screenOptions={getCommonScreenOptions({ theme, isDark })}
    >
      <ScheduleStack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ headerTitle: "My Schedule" }}
      />
    </ScheduleStack.Navigator>
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
        component={ProfessionalAppointmentsScreen}
        options={{ headerTitle: "Appointments" }}
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

export default function ProfessionalTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
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
        name="DashboardTab"
        component={DashboardStackNavigator}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Feather name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ScheduleTab"
        component={ScheduleStackNavigator}
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => (
            <Feather name="clock" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsStackNavigator}
        options={{
          title: "Appointments",
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
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
