import React, { useState } from "react";
import {
    StyleSheet,
    View,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
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
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { authService } from "@/services/authService";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ForgotPasswordScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const buttonScale = useSharedValue(1);

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const handleSubmit = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            console.error("Forgot password failed", err);
            setError("Failed to send reset link. Please try again.");
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
                    <ThemedText type="h1" style={styles.title}>Forgot Password</ThemedText>
                    <ThemedText type="body" style={{ color: theme.textSecondary }}>
                        Enter your email to receive a password reset link.
                    </ThemedText>
                </View>

                {success ? (
                    <View style={[styles.successContainer, { backgroundColor: theme.primary + '15' }]}>
                        <Feather name="check-circle" size={48} color={theme.primary} style={{ marginBottom: Spacing.md }} />
                        <ThemedText type="h3" style={{ textAlign: 'center', marginBottom: Spacing.sm }}>Check your email</ThemedText>
                        <ThemedText type="body" style={{ textAlign: 'center', color: theme.textSecondary }}>
                            We have sent a password reset link to {email}.
                        </ThemedText>
                        <Pressable onPress={() => navigation.navigate("Login")} style={{ marginTop: Spacing.xl }}>
                            <ThemedText type="body" style={{ color: theme.primary, fontWeight: '600' }}>Back to Login</ThemedText>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.formContainer}>
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
                            onPress={handleSubmit}
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
                                {loading ? "Sending..." : "Send Reset Link"}
                            </ThemedText>
                        </AnimatedPressable>
                    </View>
                )}
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
    successContainer: {
        alignItems: 'center',
        padding: Spacing.xl,
        borderRadius: BorderRadius.md,
    }
});
