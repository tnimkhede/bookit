import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { professionalService } from "@/services/professionalService";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

function DayScheduleCard({
  day,
  start,
  end,
  isWorking,
}: {
  day: string;
  start: string;
  end: string;
  isWorking: boolean;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.dayCard,
        { backgroundColor: theme.backgroundDefault },
        Shadows.small,
      ]}
    >
      <View style={styles.dayCardLeft}>
        <ThemedText type="body" style={{ fontWeight: "600" }}>
          {day}
        </ThemedText>
        {isWorking ? (
          <ThemedText type="small" style={{ color: theme.accent }}>
            {start} - {end}
          </ThemedText>
        ) : (
          <ThemedText type="small" style={{ color: theme.textTertiary }}>
            Day Off
          </ThemedText>
        )}
      </View>
      <Switch
        value={isWorking}
        onValueChange={() => { }}
        trackColor={{ false: theme.backgroundTertiary, true: theme.accent + "50" }}
        thumbColor={isWorking ? theme.accent : theme.textTertiary}
      />
    </View>
  );
}

function BlockedDateCard({ date }: { date: string }) {
  const { theme } = useTheme();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View
      style={[
        styles.blockedDateCard,
        { backgroundColor: theme.error + "10" },
      ]}
    >
      <View style={styles.blockedDateContent}>
        <Feather name="calendar" size={16} color={theme.error} />
        <ThemedText type="small">{formatDate(date)}</ThemedText>
      </View>
      <Pressable style={styles.deleteButton}>
        <Feather name="x" size={18} color={theme.error} />
      </Pressable>
    </View>
  );
}

export default function ScheduleScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await professionalService.getMe();
      setProfessional(response.data || response);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!professional) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Profile not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScreenScrollView>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h4">Working Hours</ThemedText>
          <Pressable>
            <ThemedText type="link">Edit</ThemedText>
          </Pressable>
        </View>
        <View style={styles.daysContainer}>
          {professional.workingHours?.map((schedule: any) => (
            <DayScheduleCard
              key={schedule.day}
              day={schedule.day}
              start={schedule.start}
              end={schedule.end}
              isWorking={schedule.isWorking}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View
          style={[
            styles.settingCard,
            { backgroundColor: theme.backgroundDefault },
            Shadows.small,
          ]}
        >
          <View style={styles.settingIcon}>
            <Feather name="clock" size={20} color={theme.primary} />
          </View>
          <View style={styles.settingContent}>
            <ThemedText type="body" style={{ fontWeight: "500" }}>
              Appointment Duration
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {professional.appointmentDuration} minutes per session
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textTertiary} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h4">Blocked Dates</ThemedText>
          <Pressable style={[styles.addButton, { backgroundColor: theme.primary }]}>
            <Feather name="plus" size={16} color="#FFFFFF" />
            <ThemedText type="caption" style={{ color: "#FFFFFF", fontWeight: "600" }}>
              Add
            </ThemedText>
          </Pressable>
        </View>

        {professional.blockedDates?.length > 0 ? (
          <View style={styles.blockedDatesContainer}>
            {professional.blockedDates.map((date: string) => (
              <BlockedDateCard key={date} date={date} />
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
              No blocked dates
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={{ marginBottom: Spacing.lg }}>
          Quick Actions
        </ThemedText>
        <View style={styles.actionsGrid}>
          <Pressable
            style={[
              styles.actionCard,
              { backgroundColor: theme.warning + "15" },
            ]}
          >
            <Feather name="pause-circle" size={24} color={theme.warning} />
            <ThemedText type="small" style={{ fontWeight: "500" }}>
              Pause Bookings
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.actionCard,
              { backgroundColor: theme.info + "15" },
            ]}
          >
            <Feather name="copy" size={24} color={theme.info} />
            <ThemedText type="small" style={{ fontWeight: "500" }}>
              Copy Schedule
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  daysContainer: {
    gap: Spacing.sm,
  },
  dayCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  dayCardLeft: {
    gap: Spacing.xs,
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  blockedDatesContainer: {
    gap: Spacing.sm,
  },
  blockedDateCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  blockedDateContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  emptyState: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.md,
    alignItems: "center",
    gap: Spacing.md,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    gap: Spacing.md,
  },
});
