import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { CATEGORIES, getCategoryIcon } from "@/data/mockData";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useHeaderHeight } from "@react-navigation/elements";
import { professionalService } from "@/services/professionalService";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FilterChip({
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
        styles.filterChip,
        {
          backgroundColor: active ? theme.primary : theme.backgroundSecondary,
        },
      ]}
    >
      <ThemedText
        type="small"
        style={[
          styles.filterChipText,
          { color: active ? "#FFFFFF" : theme.textSecondary },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function ProfessionalListItem({
  professional,
  onPress,
}: {
  professional: any;
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
        styles.listItem,
        { backgroundColor: theme.backgroundDefault },
        Shadows.small,
        animatedStyle,
      ]}
    >
      <View
        style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}
      >
        <Feather
          name={getCategoryIcon(professional.category) as any}
          size={24}
          color={theme.primary}
        />
      </View>
      <View style={styles.listItemContent}>
        <ThemedText type="body" style={{ fontWeight: "600" }}>
          {professional.name}
        </ThemedText>
        <View style={styles.listItemMeta}>
          <View style={styles.metaRow}>
            <Feather
              name={getCategoryIcon(professional.category) as any}
              size={12}
              color={theme.textTertiary}
            />
            <ThemedText type="caption">{professional.category}</ThemedText>
          </View>
          <View style={styles.metaRow}>
            <Feather name="map-pin" size={12} color={theme.textTertiary} />
            <ThemedText type="caption">{professional.location}</ThemedText>
          </View>
        </View>
        <View style={styles.listItemBottom}>
          <View style={styles.metaRow}>
            <Feather name="star" size={12} color={theme.warning} />
            <ThemedText type="caption" style={{ fontWeight: "500" }}>
              {professional.rating || "N/A"}
            </ThemedText>
          </View>
          {/* API doesn't return nextAvailable yet, so we hide it or show generic text */}
          {/* <ThemedText type="caption" style={{ color: theme.accent }}>
            Next: Available
          </ThemedText> */}
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textTertiary} />
    </AnimatedPressable>
  );
}

export default function BrowseScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const initialCategory = (route.params as any)?.category || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const data = await professionalService.getAll(params);
      setProfessionals(data.data || []);
    } catch (error) {
      console.error("Failed to fetch professionals", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search or just fetch on effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProfessionals();
    }, 300); // Simple debounce
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      // Optional: Refresh when screen comes into focus if needed
      // fetchProfessionals();
    }, [])
  );

  const handleProfessionalPress = (professionalId: string) => {
    navigation.navigate("ProfessionalDetail", { professionalId });
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.searchSection,
          {
            paddingTop: headerHeight + Spacing.sm,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Feather name="search" size={20} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by name or category"
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x" size={20} color={theme.textTertiary} />
            </Pressable>
          ) : null}
        </View>

        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          renderItem={({ item }) => (
            <FilterChip
              label={item.name}
              active={selectedCategory === item.id}
              onPress={() => setSelectedCategory(item.id)}
            />
          )}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={professionals}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: tabBarHeight + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProfessionalListItem
              professional={item}
              onPress={() => handleProfessionalPress(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="search" size={48} color={theme.textTertiary} />
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                No professionals found
              </ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: 44,
    borderRadius: BorderRadius.xs,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  filterChipText: {
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  listItemContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  listItemMeta: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  listItemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
    gap: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
