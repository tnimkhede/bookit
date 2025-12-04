import React from "react";
import { StyleSheet, View, Pressable, Alert } from "react-native";
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
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SettingsItem({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.98))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={[
        styles.settingsItem,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.settingsIcon,
          {
            backgroundColor: danger
              ? theme.error + "15"
              : theme.primary + "15",
          },
        ]}
      >
        <Feather
          name={icon as any}
          size={20}
          color={danger ? theme.error : theme.primary}
        />
      </View>
      <View style={styles.settingsContent}>
        <ThemedText
          type="body"
          style={[
            styles.settingsLabel,
            danger && { color: theme.error },
          ]}
        >
          {label}
        </ThemedText>
        {value ? (
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {value}
          </ThemedText>
        ) : null}
      </View>
      <Feather
        name="chevron-right"
        size={20}
        color={danger ? theme.error : theme.textTertiary}
      />
    </AnimatedPressable>
  );
}

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const isProfessional = user?.role === "professional";

  return (
    <ScreenScrollView>
      <View
        style={[
          styles.profileHeader,
          { backgroundColor: theme.primary },
        ]}
      >
        <View style={styles.avatarContainer}>
          <View
            style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.2)" }]}
          >
            <Feather name="user" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <ThemedText type="h3" style={{ color: "#FFFFFF" }}>
              {user?.name}
            </ThemedText>
            <View style={styles.roleBadge}>
              <Feather
                name={isProfessional ? "briefcase" : "user"}
                size={12}
                color="#FFFFFF"
              />
              <ThemedText type="caption" style={{ color: "#FFFFFF" }}>
                {isProfessional ? user?.category : "Client"}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Account Information
        </ThemedText>
        <View style={[styles.settingsGroup, Shadows.small]}>
          <SettingsItem
            icon="user"
            label="Full Name"
            value={user?.name}
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsItem
            icon="mail"
            label="Email"
            value={user?.email}
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsItem
            icon="phone"
            label="Phone"
            value={user?.phone}
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsItem
            icon="map-pin"
            label="Location"
            value={user?.location}
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Preferences
        </ThemedText>
        <View style={[styles.settingsGroup, Shadows.small]}>
          <SettingsItem
            icon="bell"
            label="Notifications"
            value="Enabled"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsItem
            icon="globe"
            label="Language"
            value="English"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsItem
            icon="moon"
            label="Dark Mode"
            value="System"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          About
        </ThemedText>
        <View style={[styles.settingsGroup, Shadows.small]}>
          <SettingsItem
            icon="info"
            label="App Version"
            value="1.0.0"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsItem
            icon="file-text"
            label="Terms of Service"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsItem
            icon="shield"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingsItem
            icon="help-circle"
            label="Help & Support"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={[styles.settingsGroup, Shadows.small]}>
          <SettingsItem
            icon="log-out"
            label="Logout"
            onPress={handleLogout}
            danger
          />
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    marginHorizontal: -Spacing.xl,
    marginTop: -Spacing.xl,
    padding: Spacing.xl,
    paddingTop: Spacing["3xl"],
    paddingBottom: Spacing["3xl"],
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.sm,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  settingsGroup: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  settingsLabel: {
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginLeft: 72,
  },
});
