import React from "react";

import { Switch, StyleSheet, Text, View, ViewStyle } from "react-native";

import { Colors, Spacing, Typography } from "@/presentation/theme/theme";

interface Props {
  value: boolean;
  onValueChange: (value: boolean) => void;

  label?: string;
  description?: string;

  disabled?: boolean;

  style?: ViewStyle;
}

export default function AppSwitch({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        {label ? <Text style={styles.label}>{label}</Text> : null}

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: Colors.border,
          true: Colors.primary,
        }}
        thumbColor={Colors.white}
        ios_backgroundColor={Colors.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingVertical: Spacing.sm,
  },

  textContainer: {
    flex: 1,

    marginRight: Spacing.md,
  },

  label: {
    ...Typography.body,

    color: Colors.text,

    fontWeight: "600",
  },

  description: {
    ...Typography.caption,

    color: Colors.textSecondary,

    marginTop: Spacing.xs,
  },
});
