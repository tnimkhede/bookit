import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
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
import { PROFESSIONALS, AVAILABLE_TIME_SLOTS, getCategoryIcon } from "@/data/mockData";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AVAILABLE_DATES = [
  { date: "2025-12-05", label: "Dec 5", day: "Fri" },
  { date: "2025-12-06", label: "Dec 6", day: "Sat" },
  { date: "2025-12-08", label: "Dec 8", day: "Mon" },
  { date: "2025-12-09", label: "Dec 9", day: "Tue" },
  { date: "2025-12-10", label: "Dec 10", day: "Wed" },
  { date: "2025-12-11", label: "Dec 11", day: "Thu" },
  { date: "2025-12-12", label: "Dec 12", day: "Fri" },
];

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            {
              backgroundColor:
                index <= currentStep ? theme.primary : theme.backgroundTertiary,
              width: index === currentStep ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

function DateSelector({
  selectedDate,
  onSelect,
}: {
  selectedDate: string | null;
  onSelect: (date: string) => void;
}) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.dateScrollContent}
    >
      {AVAILABLE_DATES.map((item) => (
        <Pressable
          key={item.date}
          onPress={() => onSelect(item.date)}
          style={[
            styles.dateCard,
            {
              backgroundColor:
                selectedDate === item.date
                  ? theme.primary
                  : theme.backgroundDefault,
            },
            Shadows.small,
          ]}
        >
          <ThemedText
            type="caption"
            style={{
              color:
                selectedDate === item.date ? "rgba(255,255,255,0.8)" : theme.textTertiary,
            }}
          >
            {item.day}
          </ThemedText>
          <ThemedText
            type="h4"
            style={{
              color: selectedDate === item.date ? "#FFFFFF" : theme.text,
            }}
          >
            {item.label.split(" ")[1]}
          </ThemedText>
          <ThemedText
            type="caption"
            style={{
              color:
                selectedDate === item.date ? "rgba(255,255,255,0.8)" : theme.textTertiary,
            }}
          >
            {item.label.split(" ")[0]}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function TimeSlotGrid({
  selectedSlot,
  onSelect,
}: {
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.timeSlotGrid}>
      {AVAILABLE_TIME_SLOTS.map((slot) => (
        <Pressable
          key={slot.time}
          onPress={() => slot.available && onSelect(slot.time)}
          disabled={!slot.available}
          style={[
            styles.timeSlot,
            {
              backgroundColor:
                selectedSlot === slot.time
                  ? theme.primary
                  : slot.available
                    ? theme.backgroundDefault
                    : theme.backgroundTertiary,
              opacity: slot.available ? 1 : 0.5,
            },
            Shadows.small,
          ]}
        >
          <ThemedText
            type="small"
            style={{
              color:
                selectedSlot === slot.time
                  ? "#FFFFFF"
                  : slot.available
                    ? theme.text
                    : theme.textTertiary,
              fontWeight: "500",
            }}
          >
            {slot.time}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

export default function BookAppointmentScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { professionalId } = route.params as { professionalId: string };
  const professional = PROFESSIONALS.find((p) => p.id === professionalId);

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (!professional) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Professional not found</ThemedText>
      </ThemedView>
    );
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return selectedDate !== null;
      case 1:
        return selectedSlot !== null;
      case 2:
        return purpose.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      Alert.alert(
        "Booking Confirmed!",
        `Your appointment with ${professional.name} on ${selectedDate} at ${selectedSlot} has been booked.`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 0:
        return "Select Date";
      case 1:
        return "Select Time";
      case 2:
        return "Add Purpose";
      case 3:
        return "Confirm Booking";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <ThemedText type="body" style={{ color: theme.textSecondary, marginBottom: Spacing.lg }}>
              Choose a date for your appointment
            </ThemedText>
            <DateSelector selectedDate={selectedDate} onSelect={setSelectedDate} />
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <ThemedText type="body" style={{ color: theme.textSecondary, marginBottom: Spacing.lg }}>
              Available time slots for {AVAILABLE_DATES.find((d) => d.date === selectedDate)?.label}
            </ThemedText>
            <TimeSlotGrid selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <ThemedText type="body" style={{ color: theme.textSecondary, marginBottom: Spacing.lg }}>
              Briefly describe the reason for your appointment
            </ThemedText>
            <TextInput
              style={[
                styles.purposeInput,
                {
                  backgroundColor: theme.backgroundDefault,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g., Annual checkup, Consultation, Follow-up..."
              placeholderTextColor={theme.textTertiary}
              value={purpose}
              onChangeText={setPurpose}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: theme.backgroundDefault },
                Shadows.small,
              ]}
            >
              <View style={styles.summaryHeader}>
                <View
                  style={[
                    styles.summaryAvatar,
                    { backgroundColor: theme.primary + "20" },
                  ]}
                >
                  <Feather
                    name={getCategoryIcon(professional.category) as any}
                    size={24}
                    color={theme.primary}
                  />
                </View>
                <View style={styles.summaryInfo}>
                  <ThemedText type="h4">{professional.name}</ThemedText>
                  <ThemedText type="small">{professional.category}</ThemedText>
                </View>
              </View>

              <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />

              <View style={styles.summaryRow}>
                <Feather name="calendar" size={18} color={theme.info} />
                <ThemedText type="body">
                  {AVAILABLE_DATES.find((d) => d.date === selectedDate)?.day},{" "}
                  {AVAILABLE_DATES.find((d) => d.date === selectedDate)?.label}
                </ThemedText>
              </View>

              <View style={styles.summaryRow}>
                <Feather name="clock" size={18} color={theme.accent} />
                <ThemedText type="body">{selectedSlot}</ThemedText>
              </View>

              <View style={styles.summaryRow}>
                <Feather name="file-text" size={18} color={theme.warning} />
                <ThemedText type="body">{purpose}</ThemedText>
              </View>
            </View>
          </View>
        );
    }
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
        <Pressable onPress={handleBack} style={styles.headerButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <ThemedText type="h4">{getStepTitle()}</ThemedText>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <ThemedText type="link">Cancel</ThemedText>
        </Pressable>
      </View>

      <StepIndicator currentStep={step} totalSteps={4} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
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
          onPress={handleNext}
          onPressIn={() => (buttonScale.value = withSpring(0.96))}
          onPressOut={() => (buttonScale.value = withSpring(1))}
          disabled={!canProceed()}
          style={[
            styles.nextButton,
            {
              backgroundColor: canProceed() ? theme.primary : theme.backgroundTertiary,
            },
            animatedButtonStyle,
          ]}
        >
          <ThemedText
            type="body"
            style={{
              color: canProceed() ? "#FFFFFF" : theme.textTertiary,
              fontWeight: "600",
            }}
          >
            {step === 3 ? "Confirm Booking" : "Next"}
          </ThemedText>
          {step < 3 && (
            <Feather
              name="arrow-right"
              size={20}
              color={canProceed() ? "#FFFFFF" : theme.textTertiary}
            />
          )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerButton: {
    minWidth: 60,
    height: 44,
    justifyContent: "center",
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  stepContent: {
    flex: 1,
  },
  dateScrollContent: {
    gap: Spacing.md,
    paddingRight: Spacing.xl,
  },
  dateCard: {
    width: 72,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    gap: Spacing.xs,
  },
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  timeSlot: {
    width: "30%",
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
  },
  purposeInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: 16,
    minHeight: 120,
  },
  summaryCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  summaryAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  summaryDivider: {
    height: 1,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
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
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.xs,
  },
});
