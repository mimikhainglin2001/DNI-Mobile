import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors, Spacing } from "@/presentation/theme/theme";
import type { CatalogCategory } from "@/infrastructure/api/catalog.api";

const categoryColors = ["#ECFDF5", "#FEF3C7", "#EFF6FF", "#FFF1F2", "#F5F3FF"];

interface Props {
  categories: CatalogCategory[];
  loading: boolean;
}

export default function CategoriesSection({ categories, loading }: Props) {
  return (
    <>
      <SectionHeader title="Categories" action="See all" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {loading && (
          <ActivityIndicator
            color={Colors.primary}
            style={styles.inlineLoader}
          />
        )}
        {!loading && categories.length === 0 && (
          <Text style={styles.emptyText}>No categories available.</Text>
        )}
        {categories.map((category, index) => (
          <Pressable key={category.id} style={styles.categoryItem}>
            <View
              style={[
                styles.categoryIcon,
                {
                  backgroundColor:
                    categoryColors[index % categoryColors.length],
                },
              ]}
            >
              {category.image ? (
                <Image
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="grid-outline"
                  size={25}
                  color={Colors.primaryDark}
                />
              )}
            </View>
            <Text style={styles.categoryLabel}>{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable>
        <Text style={styles.sectionAction}>{action}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: "800" },
  sectionAction: { color: Colors.primary, fontSize: 13, fontWeight: "700" },
  horizontalList: { gap: Spacing.md, paddingBottom: Spacing.lg },
  inlineLoader: { marginHorizontal: Spacing.md },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 13,
    paddingBottom: Spacing.lg,
  },
  categoryItem: { alignItems: "center", width: 72 },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },
  categoryImage: { width: "100%", height: "100%", borderRadius: 30 },
  categoryLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
  },
});
