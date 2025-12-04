import React, { useState, useMemo } from "react";
import { StyleSheet, View, Pressable, FlatList } from "react-native";
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
import { PROFESSIONAL_APPOINTMENTS, getStatusColor } from "@/data/mockData";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

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
}: {
  appointment: (typeof PROFESSIONAL_APPOINTMENTS)[0];
  onPress: () => void;
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
        <View style={styles.cardActions}>
          <Pressable
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

  const filteredAppointments = useMemo(() => {
    return PROFESSIONAL_APPOINTMENTS.filter((apt) => {
      if (activeTab === "today") {
        return apt.date === "2025-12-04";
      } else if (activeTab === "upcoming") {
        return (
          apt.date > "2025-12-04" &&
          (apt.status === "booked" || apt.status === "pending")
        );
      } else {
        return apt.status === "completed" || apt.status === "cancelled";
      }
    });
  }, [activeTab]);

  const handleAppointmentPress = (appointmentId: string) => {
    navigation.navigate("AppointmentDetail", { appointmentId });
  };

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
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={48} color={theme.textTertiary} />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              No appointments
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
