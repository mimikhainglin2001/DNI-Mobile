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

interface Props<T = string> {
  value: T;

  selectedValue: T;

  onChange: (value: T) => void;

  label?: string;

  error?: string;

  disabled?: boolean;

  style?: ViewStyle;
}

export default function AppRadio<T = string>({
  value,
  selectedValue,
  onChange,
  label,
  error,
  disabled = false,
  style,
}: Props<T>) {
  const selected = value === selectedValue;

  const handlePress = () => {
    if (disabled) {
      return;
    }

    onChange(value);
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        style={styles.row}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityState={{
          selected,
          disabled,
        }}
      >
        <View
          style={[
            styles.radio,
            selected ? styles.radioSelected : null,
            error ? styles.radioError : null,
            disabled ? styles.disabled : null,
          ]}
        >
          {selected ? <View style={styles.radioDot} /> : null}
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

  radio: {
    width: 22,
    height: 22,

    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 11,

    backgroundColor: Colors.surface,

    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: Colors.primary,
  },

  radioDot: {
    width: 12,
    height: 12,

    borderRadius: 6,

    backgroundColor: Colors.primary,
  },

  radioError: {
    borderColor: Colors.error,
  },

  disabled: {
    opacity: 0.5,
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

  error: {
    ...Typography.caption,

    color: Colors.error,

    marginTop: Spacing.xs,

    marginLeft: 30,
  },
});
