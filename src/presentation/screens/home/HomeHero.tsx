import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius, Spacing } from "@/presentation/theme/theme";
import type {
  CatalogBanner,
  CatalogProduct,
} from "@/infrastructure/api/catalog.api";

interface Props {
  banner?: CatalogBanner;
  featuredProduct?: CatalogProduct;
}

export default function HomeHero({ banner, featuredProduct }: Props) {
  if (!banner && !featuredProduct) return null;

  const title = banner?.title ?? featuredProduct?.name ?? "";
  const description =
    banner?.description ??
    (featuredProduct?.orderedQuantity
      ? `${featuredProduct.orderedQuantity} orders and counting`
      : "A daily essential ready for your next order.");
  const imageUrl = banner?.imageUrl ?? featuredProduct?.images[0];
  const buttonText = banner?.buttonText ?? "View product";

  return (
    <View style={styles.hero}>
      <View style={styles.heroCopy}>
        <Text style={styles.heroEyebrow}>
          {banner ? "FROM PRODUCT SERVICE" : "FROM YOUR COMMUNITY"}
        </Text>
        <Text style={styles.heroTitle} numberOfLines={2}>
          {title}
        </Text>
        {description && (
          <Text style={styles.heroBody} numberOfLines={3}>
            {description}
          </Text>
        )}
        {buttonText && (
          <Pressable style={styles.shopButton}>
            <Text style={styles.shopButtonText}>{buttonText}</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.white} />
          </Pressable>
        )}
      </View>
      <View style={styles.heroIllustration}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.heroImage}
            resizeMode="contain"
          />
        ) : (
          <Ionicons
            name={banner ? "image-outline" : "cube-outline"}
            size={72}
            color="#A7F3D0"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Colors.primary,
    minHeight: 190,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  heroCopy: { flex: 1, zIndex: 1 },
  heroEyebrow: {
    color: "#A7F3D0",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  heroTitle: {
    color: Colors.white,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "800",
    marginTop: 8,
  },
  heroBody: {
    color: "#D1FAE5",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    maxWidth: 190,
  },
  shopButton: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: Spacing.md,
  },
  shopButtonText: { color: Colors.white, fontSize: 13, fontWeight: "700" },
  heroIllustration: {
    width: 105,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-12deg" }],
  },
  heroImage: { width: 105, height: 130 },
});
