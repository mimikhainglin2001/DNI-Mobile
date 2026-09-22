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

import { Colors, Radius, Spacing } from "@/presentation/theme/theme";
import type { CatalogProduct } from "@/infrastructure/api/catalog.api";
import { SectionHeader } from "./CategoriesSection";

interface Props {
  products: CatalogProduct[];
  loading: boolean;
}

export default function ProductCatalogSection({ products, loading }: Props) {
  return (
    <>
      <View style={styles.dealHeader}>
        <View>
          <Text style={styles.sectionTitle}>Fresh from the catalog</Text>
          <Text style={styles.sectionSubtitle}>
            {products.length} products available from the product service
          </Text>
        </View>
        <Ionicons name="sync-outline" size={19} color={Colors.primary} />
      </View>
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
        {!loading && products.length === 0 && (
          <Text style={styles.emptyText}>No products found.</Text>
        )}
        {products.map((product) => (
          <Pressable key={product.id} style={styles.productCard}>
            <View style={styles.productImage}>
              {product.images[0] ? (
                <Image
                  source={{ uri: product.images[0] }}
                  style={styles.productImageAsset}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="cube-outline"
                  size={54}
                  color={Colors.primaryDark}
                />
              )}
            </View>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.productDetail}>
              {product.orderedQuantity
                ? `${product.orderedQuantity} ordered`
                : "Available now"}
            </Text>
            <View style={styles.productFooter}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              <Pressable
                style={styles.addButton}
                accessibilityLabel={`Add ${product.name} to cart`}
              >
                <Ionicons name="add" size={20} color={Colors.white} />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  dealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: "800" },
  sectionSubtitle: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  horizontalList: { gap: Spacing.md, paddingBottom: Spacing.lg },
  inlineLoader: { marginHorizontal: Spacing.md },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 13,
    paddingBottom: Spacing.lg,
  },
  productCard: {
    width: 160,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: 9,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productImage: {
    height: 135,
    borderRadius: Radius.sm,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  productImageAsset: { width: "100%", height: "100%", borderRadius: Radius.sm },
  productName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
    minHeight: 34,
  },
  productDetail: { color: Colors.textSecondary, fontSize: 11, marginTop: 3 },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 9,
  },
  price: { color: Colors.primaryDark, fontSize: 16, fontWeight: "800" },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
