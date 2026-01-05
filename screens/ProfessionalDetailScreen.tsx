import React from "react";
import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { professionalService } from "@/services/professionalService";
import { Professional, getCategoryIcon } from "@/data/mockData";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProfessionalDetailScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { professionalId } = route.params as { professionalId: string };
  const [professional, setProfessional] = React.useState<Professional | null>(null);
  const [loading, setLoading] = React.useState(true);

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  React.useEffect(() => {
    fetchProfessional();
  }, [professionalId]);

  const fetchProfessional = async () => {
    try {
      const data = await professionalService.getById(professionalId);
      // Backend returns { success: true, data: {...} }
      setProfessional(data.data || data);
    } catch (error) {
      console.error("Failed to fetch professional:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!professional) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText>Professional not found</ThemedText>
      </ThemedView>
    );
  }

  const handleBookAppointment = () => {
    navigation.navigate("BookAppointment", { professionalId });
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.backgroundSecondary }]}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View
            style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}
          >
            <Feather
              name={getCategoryIcon(professional.category) as any}
              size={48}
              color={theme.primary}
            />
          </View>
          <ThemedText type="h2" style={styles.name}>
            {professional.name}
          </ThemedText>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: theme.primary + "15" },
              ]}
            >
              <Feather
                name={getCategoryIcon(professional.category) as any}
                size={14}
                color={theme.primary}
              />
              <ThemedText type="small" style={{ color: theme.primary }}>
                {professional.category}
              </ThemedText>
            </View>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={16} color={theme.warning} />
              <ThemedText type="body" style={{ fontWeight: "600" }}>
                {professional.rating}
              </ThemedText>
            </View>
          </View>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color={theme.textTertiary} />
            <ThemedText type="small">{professional.location}</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            About
          </ThemedText>
          <View
            style={[
              styles.aboutCard,
              { backgroundColor: theme.backgroundDefault },
              Shadows.small,
            ]}
          >
            <ThemedText type="body">{professional.about}</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Working Hours
          </ThemedText>
          <View
            style={[
              styles.hoursCard,
              { backgroundColor: theme.backgroundDefault },
              Shadows.small,
            ]}
          >
            {professional.workingHours.map((schedule) => (
              <View key={schedule.day} style={styles.hoursRow}>
                <ThemedText
                  type="body"
                  style={[
                    styles.dayText,
                    !schedule.isWorking && { color: theme.textTertiary },
                  ]}
                >
                  {schedule.day}
                </ThemedText>
                <ThemedText
                  type="body"
                  style={[
                    !schedule.isWorking && { color: theme.textTertiary },
                  ]}
                >
                  {schedule.isWorking
                    ? `${schedule.start} - ${schedule.end}`
                    : "Closed"}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Appointment Details
          </ThemedText>
          <View style={styles.detailsGrid}>
            <View
              style={[
                styles.detailCard,
                { backgroundColor: theme.backgroundDefault },
                Shadows.small,
              ]}
            >
              <Feather name="clock" size={24} color={theme.primary} />
              <ThemedText type="h4">{professional.appointmentDuration}</ThemedText>
              <ThemedText type="caption">Minutes</ThemedText>
            </View>
            <View
              style={[
                styles.detailCard,
                { backgroundColor: theme.backgroundDefault },
                Shadows.small,
              ]}
            >
              <Feather name="calendar" size={24} color={theme.accent} />
              <ThemedText type="small" style={{ fontWeight: "600", textAlign: "center" }}>
                {professional.nextAvailable}
              </ThemedText>
              <ThemedText type="caption">Next Available</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

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
          onPress={handleBookAppointment}
          onPressIn={() => (buttonScale.value = withSpring(0.96))}
          onPressOut={() => (buttonScale.value = withSpring(1))}
          style={[
            styles.bookButton,
            { backgroundColor: theme.primary },
            animatedButtonStyle,
          ]}
        >
          <Feather name="calendar" size={20} color="#FFFFFF" />
          <ThemedText type="body" style={styles.bookButtonText}>
            Book Appointment
          </ThemedText>
        </AnimatedPressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: Spacing.xl,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  name: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  aboutCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  hoursCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayText: {
    fontWeight: "500",
  },
  detailsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  detailCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    gap: Spacing.sm,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderTopWidth: 1,
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.xs,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
