import React from "react";
import { Ionicons, type Ionicons as IoniconsType } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors, Radius, Spacing } from "@/presentation/theme/theme";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function HomeHeader({ searchQuery, onSearchChange }: Props) {
  return (
    <>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.kicker}>DAILYNEEDITEMS</Text>
          <Text style={styles.greeting}>Good morning</Text>
        </View>
        <Pressable
          style={styles.iconButton}
          accessibilityLabel="Open notifications"
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={Colors.text}
          />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>
      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={20}
          color={Colors.textSecondary}
        />
        <TextInput
          placeholder="Search products, brands and more"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
        />
        <Pressable accessibilityLabel="Filter products">
          <Ionicons name="options-outline" size={20} color={Colors.primary} />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  kicker: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  greeting: {
    color: Colors.text,
    fontSize: 25,
    fontWeight: "700",
    marginTop: 3,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#F97316",
    borderWidth: 1,
    borderColor: Colors.white,
  },
  searchBar: {
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    marginHorizontal: Spacing.sm,
  },
});
