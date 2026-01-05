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
    Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { authService } from "@/services/authService";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RegisterScreen() {
    const { theme } = useTheme();
    const { login } = useAuth(); // We'll use login after successful registration if needed, or just auto-login logic in authService
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const insets = useSafeAreaInsets();

    const [role, setRole] = useState<UserRole>("client");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const buttonScale = useSharedValue(1);

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const handleRegister = async () => {
        if (!name || !email || !mobile || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Register and auto-login (authService.register stores the token)
            await authService.register(name, email, mobile, password, role);
            // After registration, we need to update the auth context state. 
            // Ideally authService.register should handle this or we call a method in context.
            // For now, let's assume we can just navigate or call login to refresh context if needed.
            // Actually, since authService.register saves token, we might need to trigger a reload or use the context's login method if it supports passing user data directly, 
            // but context.login takes credentials. 
            // A better approach: call login immediately after register with the same credentials to trigger context update.
            await login(email, password, role);

        } catch (err: any) {
            console.error("Registration failed", err);
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
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
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={theme.text} />
                    </Pressable>
                    <ThemedText type="h1" style={styles.title}>Create Account</ThemedText>
                    <ThemedText type="body" style={{ color: theme.textSecondary }}>Sign up to get started</ThemedText>
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
                                name="user"
                                size={20}
                                color={theme.textTertiary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Full Name"
                                placeholderTextColor={theme.textTertiary}
                                value={name}
                                onChangeText={setName}
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
                                name="phone"
                                size={20}
                                color={theme.textTertiary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Mobile Number"
                                placeholderTextColor={theme.textTertiary}
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="phone-pad"
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
                        onPress={handleRegister}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        disabled={loading}
                        style={[
                            styles.loginButton,
                            { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 },
                            animatedButtonStyle,
                        ]}
                    >
                        <ThemedText type="body" style={styles.loginButtonText}>
                            {loading ? "Creating Account..." : "Sign Up"}
                        </ThemedText>
                    </AnimatedPressable>

                    <View style={styles.footer}>
                        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                            Already have an account?
                        </ThemedText>
                        <Pressable onPress={() => navigation.navigate("Login")}>
                            <ThemedText type="caption" style={{ color: theme.primary, fontWeight: "600" }}>
                                Login
                            </ThemedText>
                        </Pressable>
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
    },
    header: {
        marginBottom: Spacing["2xl"],
    },
    backButton: {
        marginBottom: Spacing.lg,
    },
    title: {
        marginBottom: Spacing.xs,
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
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: Spacing.xs,
        marginTop: Spacing.md,
    },
});
