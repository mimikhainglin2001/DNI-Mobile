import React, { useState } from "react";

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from "@/presentation/theme/theme";

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

interface Props<T = string> {
  label?: string;

  placeholder?: string;

  value?: T;

  options: SelectOption<T>[];

  onChange: (value: T) => void;

  error?: string;

  disabled?: boolean;
}

export default function AppSelect<T = string>({
  label,
  placeholder = "Select an option",
  value,
  options,
  onChange,
  error,
  disabled = false,
}: Props<T>) {
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (selectedValue: T) => {
    onChange(selectedValue);

    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={[
          styles.select,
          error ? styles.selectError : null,
          disabled ? styles.disabled : null,
        ]}
        onPress={() => {
          if (!disabled) {
            setVisible(true);
          }
        }}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.selectedText,
            !selectedOption ? styles.placeholder : null,
          ]}
        >
          {selectedOption?.label ?? placeholder}
        </Text>

        <Text style={styles.arrow}>⌄</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable
            style={styles.modal}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={styles.modalTitle}>{label ?? "Select an option"}</Text>

            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <TouchableOpacity
                  key={String(option.value)}
                  style={[
                    styles.option,
                    isSelected ? styles.selectedOption : null,
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected ? styles.selectedOptionText : null,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  label: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },

  select: {
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectError: {
    borderColor: Colors.error,
  },

  disabled: {
    opacity: 0.5,
  },

  selectedText: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    color: Colors.text,
  },

  placeholder: {
    color: Colors.textSecondary,
  },

  arrow: {
    fontSize: 22,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },

  error: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    padding: Spacing.lg,
  },

  modal: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    maxHeight: "80%",
  },

  modalTitle: {
    ...Typography.heading,
    color: Colors.text,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },

  option: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
  },

  selectedOption: {
    backgroundColor: Colors.background,
  },

  optionText: {
    ...Typography.body,
    color: Colors.text,
  },

  selectedOptionText: {
    color: Colors.primary,
    fontWeight: "600",
  },

  cancelButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  cancelText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: "600",
  },
});
