import React, { useState, useMemo } from "react";
import { StyleSheet, View, Pressable, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { getStatusColor } from "@/data/mockData";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { appointmentService } from "@/services/appointmentService";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TabType = "today" | "upcoming" | "past";

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabButton,
        {
          borderBottomColor: active ? theme.primary : "transparent",
          borderBottomWidth: 2,
        },
      ]}
    >
      <ThemedText
        type="body"
        style={[
          styles.tabButtonText,
          { color: active ? theme.primary : theme.textSecondary },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function AppointmentCard({
  appointment,
  onPress,
  onComplete,
  onCancel,
}: {
  appointment: any;
  onPress: () => void;
  onComplete: () => void;
  onCancel: () => void;
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
      style={[
        styles.appointmentCard,
        { backgroundColor: theme.backgroundDefault },
        Shadows.small,
        animatedStyle,
      ]}
    >
      <View style={styles.cardTimeContainer}>
        <ThemedText type="body" style={{ fontWeight: "700" }}>
          {appointment.time}
        </ThemedText>
        <ThemedText type="caption">{appointment.duration} min</ThemedText>
      </View>

      <View style={[styles.cardDivider, { backgroundColor: statusColor }]} />

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {appointment.clientName}
          </ThemedText>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "20" },
            ]}
          >
            <ThemedText
              type="caption"
              style={[styles.statusText, { color: statusColor }]}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="small" style={{ color: theme.textSecondary }} numberOfLines={1}>
          {appointment.purpose}
        </ThemedText>

        {(appointment.status === 'booked' || appointment.status === 'pending') && (
          <View style={styles.cardActions}>
            <Pressable
              onPress={onComplete}
              style={[
                styles.actionButton,
                { backgroundColor: theme.success + "15" },
              ]}
            >
              <Feather name="check" size={14} color={theme.success} />
              <ThemedText type="caption" style={{ color: theme.success }}>
                Complete
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={onCancel}
              style={[
                styles.actionButton,
                { backgroundColor: theme.error + "15" },
              ]}
            >
              <Feather name="x" size={14} color={theme.error} />
              <ThemedText type="caption" style={{ color: theme.error }}>
                Cancel
              </ThemedText>
            </Pressable>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

export default function ProfessionalAppointmentsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const [activeTab, setActiveTab] = useState<TabType>("today");
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

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      if (status === 'cancelled') {
        await appointmentService.cancel(id);
      } else {
        await appointmentService.updateStatus(id, status);
      }
      // Refresh appointments
      fetchAppointments();
    } catch (error) {
      console.error(`Failed to update status to ${status}:`, error);
      Alert.alert("Error", "Failed to update appointment status");
    }
  };

  const filteredAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    return appointments.filter((apt) => {
      // Ensure date format matches
      const aptDate = apt.date.split('T')[0];

      if (activeTab === "today") {
        return aptDate === today && (apt.status === "booked" || apt.status === "pending");
      } else if (activeTab === "upcoming") {
        return (
          aptDate > today &&
          (apt.status === "booked" || apt.status === "pending")
        );
      } else {
        return apt.status === "completed" || apt.status === "cancelled";
      }
    });
  }, [activeTab, appointments]);

  const handleAppointmentPress = (appointmentId: string) => {
    navigation.navigate("AppointmentDetail", { appointmentId });
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.tabsContainer,
          {
            paddingTop: headerHeight + Spacing.sm,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <TabButton
          label="Today"
          active={activeTab === "today"}
          onPress={() => setActiveTab("today")}
        />
        <TabButton
          label="Upcoming"
          active={activeTab === "upcoming"}
          onPress={() => setActiveTab("upcoming")}
        />
        <TabButton
          label="History"
          active={activeTab === "past"}
          onPress={() => setActiveTab("past")}
        />
      </View>

      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onPress={() => handleAppointmentPress(item.id)}
            onComplete={() => handleStatusUpdate(item.id, 'completed')}
            onCancel={() => handleStatusUpdate(item.id, 'cancelled')}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={48} color={theme.textTertiary} />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              No {activeTab} appointments
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: "center",
  },
  tabButtonText: {
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  appointmentCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  cardTimeContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  cardDivider: {
    width: 3,
    borderRadius: 2,
  },
  cardContent: {
    flex: 1,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
    gap: Spacing.lg,
  },
});
