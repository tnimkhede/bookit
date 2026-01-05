import React, { useState, useMemo } from "react";
import { StyleSheet, View, Pressable, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { getStatusColor, getCategoryIcon } from "@/data/mockData";
import { appointmentService } from "@/services/appointmentService";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TabType = "upcoming" | "past" | "cancelled";

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
  appointment: any;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const statusColor = getStatusColor(appointment.status);

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
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.primary + "20" },
          ]}
        >
          <Feather
            name={getCategoryIcon(appointment.professionalCategory) as any}
            size={24}
            color={theme.primary}
          />
        </View>
        <View style={styles.cardHeaderInfo}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {appointment.professionalName}
          </ThemedText>
          <ThemedText type="caption">{appointment.professionalCategory}</ThemedText>
        </View>
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
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.cardDivider, { backgroundColor: theme.border }]} />

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Feather name="calendar" size={14} color={theme.textTertiary} />
          <ThemedText type="small">{appointment.date}</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <Feather name="clock" size={14} color={theme.textTertiary} />
          <ThemedText type="small">{appointment.time}</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <Feather name="file-text" size={14} color={theme.textTertiary} />
          <ThemedText type="small" numberOfLines={1} style={{ flex: 1 }}>
            {appointment.purpose}
          </ThemedText>
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default function ClientAppointmentsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
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

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (activeTab === "upcoming") {
        return apt.status === "booked" || apt.status === "pending";
      } else if (activeTab === "past") {
        return apt.status === "completed";
      } else {
        return apt.status === "cancelled";
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
          label="Upcoming"
          active={activeTab === "upcoming"}
          onPress={() => setActiveTab("upcoming")}
        />
        <TabButton
          label="Past"
          active={activeTab === "past"}
          onPress={() => setActiveTab("past")}
        />
        <TabButton
          label="Cancelled"
          active={activeTab === "cancelled"}
          onPress={() => setActiveTab("cancelled")}
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
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cardHeaderInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontWeight: "600",
  },
  cardDivider: {
    height: 1,
  },
  cardDetails: {
    gap: Spacing.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
    gap: Spacing.lg,
  },
});
