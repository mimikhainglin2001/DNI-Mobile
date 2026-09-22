import React from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from "@/presentation/theme/theme";

interface Props {
  value: boolean;

  onChange: (value: boolean) => void;

  label?: string;

  error?: string;

  disabled?: boolean;

  style?: ViewStyle;
}

export default function AppCheckbox({
  value,
  onChange,
  label,
  error,
  disabled = false,
  style,
}: Props) {
  const handlePress = () => {
    if (disabled) {
      return;
    }

    onChange(!value);
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        style={styles.row}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: value,
          disabled,
        }}
      >
        <View
          style={[
            styles.checkbox,
            value ? styles.checkboxChecked : null,
            error ? styles.checkboxError : null,
            disabled ? styles.disabled : null,
          ]}
        >
          {value ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>

        {label ? (
          <Text style={[styles.label, disabled ? styles.labelDisabled : null]}>
            {label}
          </Text>
        ) : null}
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 22,
    height: 22,

    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,

    backgroundColor: Colors.surface,

    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  checkboxError: {
    borderColor: Colors.error,
  },

  checkmark: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },

  label: {
    ...Typography.body,
    color: Colors.text,

    marginLeft: Spacing.sm,

    flex: 1,
  },

  labelDisabled: {
    opacity: 0.5,
  },

  disabled: {
    opacity: 0.5,
  },

  error: {
    ...Typography.caption,
    color: Colors.error,

    marginTop: Spacing.xs,
    marginLeft: 30,
  },
});
