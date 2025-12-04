import React from "react";
import { StyleSheet, View, Pressable, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import {
  CLIENT_APPOINTMENTS,
  PROFESSIONAL_APPOINTMENTS,
  getStatusColor,
  getCategoryIcon,
} from "@/data/mockData";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AppointmentDetailScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { appointmentId } = route.params as { appointmentId: string };

  const appointments =
    user?.role === "professional"
      ? PROFESSIONAL_APPOINTMENTS
      : CLIENT_APPOINTMENTS;

  const appointment = appointments.find((a) => a.id === appointmentId);

  const cancelScale = useSharedValue(1);
  const rescheduleScale = useSharedValue(1);

  const cancelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cancelScale.value }],
  }));

  const rescheduleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rescheduleScale.value }],
  }));

  if (!appointment) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Appointment not found</ThemedText>
      </ThemedView>
    );
  }

  const statusColor = getStatusColor(appointment.status);
  const isUpcoming =
    appointment.status === "booked" || appointment.status === "pending";
  const isProfessional = user?.role === "professional";

  const handleCancel = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleReschedule = () => {
    Alert.alert("Reschedule", "Rescheduling feature coming soon!");
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <ThemedText type="h4">Appointment Details</ThemedText>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: isUpcoming ? insets.bottom + 120 : insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.statusCard,
            { backgroundColor: statusColor + "15" },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <ThemedText type="body" style={[styles.statusText, { color: statusColor }]}>
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </ThemedText>
        </View>

        <View
          style={[
            styles.mainCard,
            { backgroundColor: theme.backgroundDefault },
            Shadows.small,
          ]}
        >
          <View style={styles.personSection}>
            <View
              style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}
            >
              <Feather
                name={
                  isProfessional
                    ? "user"
                    : (getCategoryIcon(appointment.professionalCategory) as any)
                }
                size={32}
                color={theme.primary}
              />
            </View>
            <View style={styles.personInfo}>
              <ThemedText type="h4">
                {isProfessional
                  ? appointment.clientName
                  : appointment.professionalName}
              </ThemedText>
              <View style={styles.categoryRow}>
                <Feather
                  name={getCategoryIcon(appointment.professionalCategory) as any}
                  size={14}
                  color={theme.textTertiary}
                />
                <ThemedText type="small">
                  {appointment.professionalCategory}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.detailsCard,
            { backgroundColor: theme.backgroundDefault },
            Shadows.small,
          ]}
        >
          <ThemedText type="h4" style={styles.cardTitle}>
            Appointment Information
          </ThemedText>

          <View style={styles.detailRow}>
            <View style={[styles.detailIcon, { backgroundColor: theme.info + "15" }]}>
              <Feather name="calendar" size={18} color={theme.info} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText type="caption">Date</ThemedText>
              <ThemedText type="body" style={{ fontWeight: "500" }}>
                {appointment.date}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <View style={[styles.detailIcon, { backgroundColor: theme.accent + "15" }]}>
              <Feather name="clock" size={18} color={theme.accent} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText type="caption">Time</ThemedText>
              <ThemedText type="body" style={{ fontWeight: "500" }}>
                {appointment.time} ({appointment.duration} min)
              </ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <View style={[styles.detailIcon, { backgroundColor: theme.warning + "15" }]}>
              <Feather name="file-text" size={18} color={theme.warning} />
            </View>
            <View style={styles.detailContent}>
              <ThemedText type="caption">Purpose</ThemedText>
              <ThemedText type="body" style={{ fontWeight: "500" }}>
                {appointment.purpose}
              </ThemedText>
            </View>
          </View>
        </View>

        {isUpcoming && (
          <View
            style={[
              styles.reminderCard,
              { backgroundColor: theme.info + "10" },
            ]}
          >
            <Feather name="bell" size={20} color={theme.info} />
            <ThemedText type="small" style={{ color: theme.info, flex: 1 }}>
              You will receive a reminder 1 hour before your appointment
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {isUpcoming && (
        <View
          style={[
            styles.bottomBar,
            {
              paddingBottom: insets.bottom + Spacing.lg,
              backgroundColor: theme.backgroundRoot,
              borderTopColor: theme.border,
            },
          ]}
        >
          <AnimatedPressable
            onPress={handleReschedule}
            onPressIn={() => (rescheduleScale.value = withSpring(0.96))}
            onPressOut={() => (rescheduleScale.value = withSpring(1))}
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.primary,
                borderWidth: 1,
              },
              rescheduleAnimatedStyle,
            ]}
          >
            <Feather name="calendar" size={18} color={theme.primary} />
            <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>
              Reschedule
            </ThemedText>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={handleCancel}
            onPressIn={() => (cancelScale.value = withSpring(0.96))}
            onPressOut={() => (cancelScale.value = withSpring(1))}
            style={[
              styles.actionButton,
              { backgroundColor: theme.error },
              cancelAnimatedStyle,
            ]}
          >
            <Feather name="x" size={18} color="#FFFFFF" />
            <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600" }}>
              Cancel
            </ThemedText>
          </AnimatedPressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontWeight: "600",
  },
  mainCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  personSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  personInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  detailsCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  cardTitle: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  detailContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
    marginLeft: 56,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: Spacing.md,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.xs,
  },
});
