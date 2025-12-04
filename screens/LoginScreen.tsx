import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  const [role, setRole] = useState<UserRole>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    const success = login(email, password, role);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing["4xl"],
            paddingBottom: insets.bottom + Spacing["2xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: theme.primary + "15" },
            ]}
          >
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <ThemedText type="h1" style={styles.title}>
            BookIt
          </ThemedText>
          <ThemedText type="small" style={styles.subtitle}>
            Your Universal Scheduling Solution
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.roleSelector}>
            <Pressable
              onPress={() => setRole("client")}
              style={[
                styles.roleButton,
                {
                  backgroundColor:
                    role === "client" ? theme.primary : theme.backgroundSecondary,
                },
              ]}
            >
              <Feather
                name="user"
                size={18}
                color={role === "client" ? "#FFFFFF" : theme.textSecondary}
              />
              <ThemedText
                type="small"
                style={[
                  styles.roleText,
                  { color: role === "client" ? "#FFFFFF" : theme.textSecondary },
                ]}
              >
                Client
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => setRole("professional")}
              style={[
                styles.roleButton,
                {
                  backgroundColor:
                    role === "professional"
                      ? theme.primary
                      : theme.backgroundSecondary,
                },
              ]}
            >
              <Feather
                name="briefcase"
                size={18}
                color={
                  role === "professional" ? "#FFFFFF" : theme.textSecondary
                }
              />
              <ThemedText
                type="small"
                style={[
                  styles.roleText,
                  {
                    color:
                      role === "professional" ? "#FFFFFF" : theme.textSecondary,
                  },
                ]}
              >
                Professional
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.border,
                },
              ]}
            >
              <Feather
                name="mail"
                size={20}
                color={theme.textTertiary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Email"
                placeholderTextColor={theme.textTertiary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.border,
                },
              ]}
            >
              <Feather
                name="lock"
                size={20}
                color={theme.textTertiary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.textTertiary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={theme.textTertiary}
                />
              </Pressable>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color={theme.error} />
                <ThemedText
                  type="small"
                  style={[styles.errorText, { color: theme.error }]}
                >
                  {error}
                </ThemedText>
              </View>
            ) : null}
          </View>

          <AnimatedPressable
            onPress={handleLogin}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              styles.loginButton,
              { backgroundColor: theme.primary },
              animatedButtonStyle,
            ]}
          >
            <ThemedText type="body" style={styles.loginButtonText}>
              Login
            </ThemedText>
          </AnimatedPressable>

          <View style={styles.credentialsHint}>
            <ThemedText type="caption" style={{ color: theme.textTertiary }}>
              Demo Credentials:
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textTertiary }}>
              Client: client@app.com / client123
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textTertiary }}>
              Professional: doctor@app.com / professional123
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing["2xl"],
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing["4xl"],
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
  formContainer: {
    gap: Spacing.xl,
  },
  roleSelector: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  roleText: {
    fontWeight: "600",
  },
  inputContainer: {
    gap: Spacing.lg,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  errorText: {
    flex: 1,
  },
  loginButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  credentialsHint: {
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.lg,
  },
});
