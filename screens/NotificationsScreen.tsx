import React from "react";
import { StyleSheet, View, Pressable, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
import { NOTIFICATIONS } from "@/data/mockData";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function NotificationItem({
  notification,
}: {
  notification: (typeof NOTIFICATIONS)[0];
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getIcon = () => {
    switch (notification.type) {
      case "reminder":
        return "bell";
      case "confirmation":
        return "check-circle";
      case "cancellation":
        return "x-circle";
      case "update":
        return "refresh-cw";
      default:
        return "bell";
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case "reminder":
        return theme.warning;
      case "confirmation":
        return theme.success;
      case "cancellation":
        return theme.error;
      case "update":
        return theme.info;
      default:
        return theme.primary;
    }
  };

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = withSpring(0.98))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={[
        styles.notificationItem,
        {
          backgroundColor: notification.read
            ? theme.backgroundDefault
            : theme.primary + "08",
        },
        Shadows.small,
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIconColor() + "15" },
        ]}
      >
        <Feather name={getIcon() as any} size={20} color={getIconColor()} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <ThemedText
            type="body"
            style={[
              styles.notificationTitle,
              !notification.read && { fontWeight: "600" },
            ]}
          >
            {notification.title}
          </ThemedText>
          {!notification.read && (
            <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
          )}
        </View>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {notification.message}
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textTertiary }}>
          {notification.timestamp}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
        <ThemedText type="h4">Notifications</ThemedText>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="bell-off" size={48} color={theme.textTertiary} />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              No notifications
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
  listContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  notificationItem: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  notificationTitle: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
    gap: Spacing.lg,
  },
});
