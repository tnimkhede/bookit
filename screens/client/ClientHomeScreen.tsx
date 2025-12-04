import React from "react";
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
import {
  CATEGORIES,
  PROFESSIONALS,
  CLIENT_APPOINTMENTS,
  getCategoryIcon,
} from "@/data/mockData";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CategoryChip({
  name,
  icon,
  onPress,
}: {
  name: string;
  icon: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.95))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={[
        styles.categoryChip,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View
        style={[styles.categoryIcon, { backgroundColor: theme.primary + "15" }]}
      >
        <Feather name={icon as any} size={20} color={theme.primary} />
      </View>
      <ThemedText type="small" style={{ fontWeight: "500" }}>
        {name}
      </ThemedText>
    </AnimatedPressable>
  );
}

function ProfessionalCard({
  professional,
  onPress,
}: {
  professional: (typeof PROFESSIONALS)[0];
  onPress: () => void;
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
        styles.professionalCard,
        { backgroundColor: theme.backgroundDefault },
        Shadows.small,
        animatedStyle,
      ]}
    >
      <View
        style={[styles.avatarCircle, { backgroundColor: theme.primary + "20" }]}
      >
        <Feather
          name={getCategoryIcon(professional.category) as any}
          size={24}
          color={theme.primary}
        />
      </View>
      <View style={styles.professionalInfo}>
        <ThemedText type="body" style={{ fontWeight: "600" }}>
          {professional.name}
        </ThemedText>
        <View style={styles.professionalMeta}>
          <View style={styles.metaItem}>
            <Feather
              name={getCategoryIcon(professional.category) as any}
              size={12}
              color={theme.textTertiary}
            />
            <ThemedText type="caption">{professional.category}</ThemedText>
          </View>
          <View style={styles.metaItem}>
            <Feather name="star" size={12} color={theme.warning} />
            <ThemedText type="caption">{professional.rating}</ThemedText>
          </View>
        </View>
        <View style={styles.metaItem}>
          <Feather name="clock" size={12} color={theme.accent} />
          <ThemedText type="caption" style={{ color: theme.accent }}>
            {professional.nextAvailable}
          </ThemedText>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textTertiary} />
    </AnimatedPressable>
  );
}

export default function ClientHomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const upcomingAppointment = CLIENT_APPOINTMENTS.find(
    (apt) => apt.status === "booked"
  );

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate("BrowseTab", { category: categoryId });
  };

  const handleProfessionalPress = (professionalId: string) => {
    navigation.navigate("ProfessionalDetail", { professionalId });
  };

  const handleAppointmentPress = () => {
    if (upcomingAppointment) {
      navigation.navigate("AppointmentDetail", {
        appointmentId: upcomingAppointment.id,
      });
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <View>
          <ThemedText type="small">Welcome back,</ThemedText>
          <ThemedText type="h2">{user?.name?.split(" ")[0]}</ThemedText>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Notifications")}
          style={[
            styles.notificationButton,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather name="bell" size={20} color={theme.text} />
          <View style={[styles.notificationBadge, { backgroundColor: theme.error }]} />
        </Pressable>
      </View>

      {upcomingAppointment ? (
        <Pressable onPress={handleAppointmentPress}>
          <View
            style={[
              styles.nextAppointmentCard,
              { backgroundColor: theme.primary },
            ]}
          >
            <View style={styles.nextAppointmentHeader}>
              <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
                Next Appointment
              </ThemedText>
              <View style={styles.nextAppointmentBadge}>
                <ThemedText type="caption" style={{ color: theme.primary }}>
                  {upcomingAppointment.status.toUpperCase()}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="h4" style={{ color: "#FFFFFF", marginTop: Spacing.sm }}>
              {upcomingAppointment.professionalName}
            </ThemedText>
            <ThemedText type="small" style={{ color: "rgba(255,255,255,0.9)" }}>
              {upcomingAppointment.professionalCategory}
            </ThemedText>
            <View style={styles.nextAppointmentDetails}>
              <View style={styles.nextAppointmentItem}>
                <Feather name="calendar" size={14} color="rgba(255,255,255,0.8)" />
                <ThemedText type="small" style={{ color: "#FFFFFF" }}>
                  {upcomingAppointment.date}
                </ThemedText>
              </View>
              <View style={styles.nextAppointmentItem}>
                <Feather name="clock" size={14} color="rgba(255,255,255,0.8)" />
                <ThemedText type="small" style={{ color: "#FFFFFF" }}>
                  {upcomingAppointment.time}
                </ThemedText>
              </View>
            </View>
          </View>
        </Pressable>
      ) : null}

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Categories
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.filter((c) => c.id !== "all").map((category) => (
            <CategoryChip
              key={category.id}
              name={category.name}
              icon={category.icon}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h4">Recommended</ThemedText>
          <Pressable onPress={() => navigation.navigate("BrowseTab")}>
            <ThemedText type="link">See All</ThemedText>
          </Pressable>
        </View>
        <View style={styles.professionalsContainer}>
          {PROFESSIONALS.slice(0, 4).map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              onPress={() => handleProfessionalPress(professional.id)}
            />
          ))}
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
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
  nextAppointmentCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  nextAppointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextAppointmentBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  nextAppointmentDetails: {
    flexDirection: "row",
    gap: Spacing.xl,
    marginTop: Spacing.lg,
  },
  nextAppointmentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  categoriesContainer: {
    gap: Spacing.md,
    paddingRight: Spacing.xl,
  },
  categoryChip: {
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    minWidth: 90,
    gap: Spacing.sm,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  professionalsContainer: {
    gap: Spacing.md,
  },
  professionalCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  professionalInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  professionalMeta: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
});
