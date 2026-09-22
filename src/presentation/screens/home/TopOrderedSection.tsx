import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius, Spacing } from "@/presentation/theme/theme";
import type { CatalogProduct } from "@/infrastructure/api/catalog.api";
import { SectionHeader } from "./CategoriesSection";

interface Props {
  products: CatalogProduct[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function TopOrderedSection({
  products,
  loading,
  error,
  onRetry,
}: Props) {
  return (
    <>
      <SectionHeader title="Top ordered products" action="See all" />
      {error && (
        <Pressable style={styles.errorRow} onPress={onRetry}>
          <Ionicons
            name="cloud-offline-outline"
            size={20}
            color={Colors.error}
          />
          <Text style={styles.errorText}>{error} Tap to retry.</Text>
        </Pressable>
      )}
      {products.length === 0 && !loading && (
        <Text style={styles.emptyText}>No order history available yet.</Text>
      )}
      {products.map((product) => (
        <View style={styles.orderedRow} key={product.id}>
          <View style={styles.orderedIcon}>
            <Ionicons name="star" size={20} color="#F59E0B" />
          </View>
          <View style={styles.orderedCopy}>
            <Text style={styles.orderedTitle} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.orderedBody}>
              {product.orderedQuantity ?? 0} orders from our community
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 13,
    paddingBottom: Spacing.lg,
  },
  orderedRow: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  orderedIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  orderedCopy: { flex: 1 },
  orderedTitle: { color: Colors.text, fontSize: 14, fontWeight: "700" },
  orderedBody: { color: Colors.textSecondary, fontSize: 12, marginTop: 4 },
  errorRow: {
    backgroundColor: "#FEF2F2",
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: { flex: 1, color: Colors.error, fontSize: 12, lineHeight: 17 },
});
