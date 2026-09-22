import React, { useState } from "react";

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

import AuthLayout from "@/presentation/layout/AuthLayout";

import {
  AppButton,
  AppHeader,
  AppInput,
  AppMessage,
} from "@/presentation/components";

import { LoginViewModel } from "@/presentation/viewmodels/LoginViewModel";

import { AuthStackParamList } from "@/presentation/navigation/types";

import { useLoginForm } from "@/presentation/hooks/useLoginForm";

import { Colors, Spacing, Typography } from "@/presentation/theme/theme";
import container from "@/core/di/container";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

type MessageType = "success" | "error" | "warning" | "info";

interface MessageState {
  text: string;
  type: MessageType;
}

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  /*
   * Create ViewModel once.
   */
  const viewModel = container.resolve<LoginViewModel>("LoginViewModel");
  /*
   * Form logic lives inside the hook.
   */
  const { control, handleSubmit } = useLoginForm();

  /*
   * Screen UI state.
   */
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<MessageState | null>(null);

  /*
   * Login handler.
   *
   * This function receives only
   * validated form data.
   */
  const handleLogin = async (data: { email: string; password: string }) => {
    if (loading) {
      return;
    }

    setLoading(true);

    setMessage(null);

    try {
      const result = await viewModel.login(data.email, data.password);

      /*
       * Business/API failure.
       */
      if (!result.success) {
        setMessage({
          text: result.error ?? "Unable to sign in.",
          type: "error",
        });

        return;
      }

      /*
       * Authentication succeeded.
       *
       * LoginViewModel should already
       * update auth state / token storage.
       *
       * RootNavigator should react to
       * the authenticated state.
       */
      setMessage({
        text: `Welcome ${result.data?.name ?? ""}!`,
        type: "success",
      });
    } catch (error) {
      /*
       * Do not expose technical error
       * details to the user.
       */
      console.error("LoginScreen error:", error);

      setMessage({
        text: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /*
   * Navigate to registration.
   */
  const handleRegisterPress = () => {
    if (loading) {
      return;
    }

    navigation.navigate("Register");
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
            <AppHeader
              title="DailyNeedItems"
              subtitle="Sign in to your account"
            />

            <View style={styles.form}>
              {/* EMAIL */}

              <Controller
                control={control}
                name="email"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <AppInput
                    label="Email"
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    editable={!loading}
                    error={error?.message}
                  />
                )}
              />

              {/* PASSWORD */}

              <Controller
                control={control}
                name="password"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <AppInput
                    label="Password"
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    textContentType="password"
                    editable={!loading}
                    error={error?.message}
                    showPasswordToggle
                  />
                )}
              />

              <Text
                style={styles.forgotPassword}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                Forgot Password?
              </Text>

              {/* LOGIN */}

              <View style={styles.buttonWrapper}>
                <AppButton
                  title="Login"
                  onPress={handleSubmit(handleLogin)}
                  loading={loading}
                  disabled={loading}
                />
              </View>

              {/* SERVER MESSAGE */}

              {message ? (
                <AppMessage message={message.text} type={message.type} />
              ) : null}
            </View>

            {/* REGISTER */}

            <Text style={styles.linkText}>
              Don't have an account?{" "}
              <Text style={styles.link} onPress={handleRegisterPress}>
                Register
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

    marginTop: Spacing.xl,
  },

  link: {
    color: Colors.primary,

    fontWeight: "600",
  },
  forgotPassword: {
    color: Colors.primary,
    textAlign: "right",
    fontWeight: "600",
    marginTop: Spacing.xs,
  },
});
