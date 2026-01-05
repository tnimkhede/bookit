import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { getStatusColor } from "@/data/mockData";
import { appointmentService } from "@/services/appointmentService";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: theme.backgroundDefault },
        Shadows.small,
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Feather name={icon as any} size={20} color={color} />
      </View>
      <ThemedText type="h2" style={{ color }}>
        {value}
      </ThemedText>
      <ThemedText type="caption">{title}</ThemedText>
    </View>
  );
}

function TimelineItem({
  appointment,
  onPress,
  isLast,
}: {
  appointment: any;
  onPress: () => void;
  isLast: boolean;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const statusColor = getStatusColor(appointment.status);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.98))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={[styles.timelineItem, animatedStyle]}
    >
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: statusColor }]} />
        {!isLast && (
          <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />
        )}
      </View>
      <View
        style={[
          styles.timelineContent,
          { backgroundColor: theme.backgroundDefault },
          Shadows.small,
        ]}
      >
        <View style={styles.timelineHeader}>
          <ThemedText type="small" style={{ fontWeight: "600" }}>
            {appointment.time}
          </ThemedText>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusColor },
            ]}
          />
        </View>
        <ThemedText type="body" style={{ fontWeight: "500" }}>
          {appointment.clientName}
        </ThemedText>
        <ThemedText type="caption" numberOfLines={1}>
          {appointment.purpose}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

export default function ProfessionalDashboardScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAll();
      setAppointments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = appointments.filter(
    (apt) => apt.date.split('T')[0] === today
  );

  const stats = {
    total: todaysAppointments.length,
    completed: todaysAppointments.filter((a) => a.status === "completed").length,
    pending: todaysAppointments.filter(
      (a) => a.status === "booked" || a.status === "pending"
    ).length,
    cancelled: todaysAppointments.filter((a) => a.status === "cancelled").length,
  };

  const upcomingToday = todaysAppointments.filter(
    (a) => a.status === "booked" || a.status === "pending"
  );

  const handleAppointmentPress = (appointmentId: string) => {
    navigation.navigate("AppointmentDetail", { appointmentId });
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText type="small">Good morning,</ThemedText>
          <ThemedText type="h2">{user?.name}</ThemedText>
          <ThemedText type="caption" style={{ marginTop: Spacing.xs }}>
            {formatDate()}
          </ThemedText>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Notifications")}
          style={[
            styles.notificationButton,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather name="bell" size={20} color={theme.text} />
          <View
            style={[styles.notificationBadge, { backgroundColor: theme.error }]}
          />
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Today"
          value={stats.total}
          icon="calendar"
          color={theme.primary}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon="check-circle"
          color={theme.success}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon="clock"
          color={theme.warning}
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon="x-circle"
          color={theme.error}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h4">Today's Schedule</ThemedText>
          <Pressable onPress={() => navigation.navigate("AppointmentsTab")}>
            <ThemedText type="link">View All</ThemedText>
          </Pressable>
        </View>

        {upcomingToday.length > 0 ? (
          <View style={styles.timeline}>
            {upcomingToday.map((appointment, index) => (
              <TimelineItem
                key={appointment.id}
                appointment={appointment}
                onPress={() => handleAppointmentPress(appointment.id)}
                isLast={index === upcomingToday.length - 1}
              />
            ))}
          </View>
        ) : (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Feather name="calendar" size={32} color={theme.textTertiary} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              No appointments scheduled for today
            </ThemedText>
          </View>
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.xl,
  },
  headerContent: {
    flex: 1,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: "47%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  timeline: {
    gap: Spacing.sm,
  },
  timelineItem: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  timelineLeft: {
    alignItems: "center",
    width: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: Spacing.lg,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: Spacing.xs,
  },
  timelineContent: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyState: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.md,
    alignItems: "center",
    gap: Spacing.md,
  },
});
