import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import ForgotPasswordScreen from "@/screens/ForgotPasswordScreen";
import ClientTabNavigator from "@/navigation/ClientTabNavigator";
import ProfessionalTabNavigator from "@/navigation/ProfessionalTabNavigator";
import ProfessionalDetailScreen from "@/screens/ProfessionalDetailScreen";
import AppointmentDetailScreen from "@/screens/AppointmentDetailScreen";
import BookAppointmentScreen from "@/screens/BookAppointmentScreen";
import NotificationsScreen from "@/screens/NotificationsScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ClientMain: undefined;
  ProfessionalMain: undefined;
  ProfessionalDetail: { professionalId: string };
  AppointmentDetail: { appointmentId: string };
  BookAppointment: { professionalId: string };
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, user } = useAuth();
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : user?.role === "professional" ? (
        <>
          <Stack.Screen name="ProfessionalMain" component={ProfessionalTabNavigator} />
          <Stack.Screen
            name="AppointmentDetail"
            component={AppointmentDetailScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ presentation: "modal" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="ClientMain" component={ClientTabNavigator} />
          <Stack.Screen
            name="ProfessionalDetail"
            component={ProfessionalDetailScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="AppointmentDetail"
            component={AppointmentDetailScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="BookAppointment"
            component={BookAppointmentScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ presentation: "modal" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
