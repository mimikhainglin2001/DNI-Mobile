import React, { useMemo, useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Controller } from "react-hook-form";

import { container } from "tsyringe";

import AuthLayout from "@/presentation/layout/AuthLayout";

import {
  AppButton,
  AppHeader,
  AppInput,
  AppMessage,
} from "@/presentation/components";

import { RegisterViewModel } from "@/presentation/viewmodels/RegisterViewModel";

import { AuthStackParamList } from "@/presentation/navigation/types";

import { useRegisterForm } from "@/presentation/hooks/useRegisterForm";

import { Colors, Spacing, Typography } from "@/presentation/theme/theme";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Register">;

type MessageType = "success" | "error" | "warning" | "info";

interface MessageState {
  text: string;
  type: MessageType;
}

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  /*
   * Resolve ViewModel through
   * the dependency injection container.
   */
  const viewModel = useMemo(
    () => container.resolve<RegisterViewModel>("RegisterViewModel"),
    [],
  );

  /*
   * Form logic.
   *
   * This hook only handles:
   *
   * - React Hook Form
   * - Zod validation
   * - form state
   * - form errors
   */
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useRegisterForm();

  /*
   * Screen UI state.
   */
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<MessageState | null>(null);

  /*
   * Registration handler.
   *
   * This receives validated form data.
   */
  const handleRegister = async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    /*
     * Prevent double submission.
     */
    if (loading) {
      return;
    }

    setLoading(true);

    setMessage(null);

    try {
      /*
       * Call ViewModel.
       *
       * The Screen does not call
       * the API directly.
       */
      const result = await viewModel.register(
        data.fullName,
        data.email,
        data.password,
      );

      /*
       * Registration failed.
       */
      if (!result.success) {
        setMessage({
          text: result.error ?? "Registration failed.",
          type: "error",
        });

        return;
      }

      /*
       * Registration succeeded.
       *
       * Backend should return
       * a verification ID.
       */
      const verificationId = result.data?.verificationId;

      /*
       * Defensive check.
       */
      if (!verificationId) {
        console.error("Registration succeeded without verificationId:", result);

        setMessage({
          text: "Account was created, but email verification could not be started.",
          type: "error",
        });

        return;
      }

      /*
       * Navigate to email verification.
       *
       * Navigation belongs to
       * the Screen.
       */
      navigation.navigate("VerifyEmail", {
        verificationId,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      /*
       * Technical error.
       */
      console.error("RegisterScreen error:", error);

      setMessage({
        text: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /*
   * Navigate to Login.
   */
  const handleLoginPress = () => {
    if (loading) {
      return;
    }

    navigation.navigate("Login");
  };

  return (
    <AuthLayout>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* HEADER */}

            <AppHeader title="DailyNeedItems" subtitle="Create your account" />

            {/* FORM */}

            <View style={styles.form}>
              {/* NAME */}

              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Name"
                    placeholder="Enter your name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    autoCorrect={false}
                    editable={!loading}
                    error={errors.fullName?.message}
                  />
                )}
              />

              {/* EMAIL */}

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Email"
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    editable={!loading}
                    error={errors.email?.message}
                  />
                )}
              />

              {/* PASSWORD */}

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Password"
                    placeholder="Create a password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    error={errors.password?.message}
                    showPasswordToggle
                  />
                )}
              />

              {/* CONFIRM PASSWORD */}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    error={errors.confirmPassword?.message}
                    showPasswordToggle
                  />
                )}
              />

              {/* REGISTER BUTTON */}

              <View style={styles.buttonWrapper}>
                <AppButton
                  title="Create Account"
                  onPress={handleSubmit(handleRegister)}
                  loading={loading}
                  disabled={loading}
                />
              </View>

              {/* SERVER MESSAGE */}

              {message ? (
                <AppMessage message={message.text} type={message.type} />
              ) : null}
            </View>

            {/* LOGIN */}

            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Text style={styles.link} onPress={handleLoginPress}>
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
  },

  container: {
    flex: 1,

    justifyContent: "center",
  },

  form: {
    gap: Spacing.md,
  },

  buttonWrapper: {
    marginTop: Spacing.md,
  },

  linkText: {
    ...Typography.caption,

    color: Colors.textSecondary,

    textAlign: "center",

    marginTop: Spacing.lg,
  },

  link: {
    color: Colors.primary,

    fontWeight: "600",
  },
});
