import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppScreen from "@/presentation/common/AppScreen";
import { Colors, Radius, Spacing } from "@/presentation/theme/theme";
import {
  catalogApi,
  type CatalogCategory,
  type CatalogProduct,
} from "@/infrastructure/api/catalog.api";

const categoryIcons = [
  "basket-outline",
  "nutrition-outline",
  "home-outline",
  "sparkles-outline",
  "cafe-outline",
] as const;
const categoryColors = ["#ECFDF5", "#FEF3C7", "#EFF6FF", "#FFF1F2", "#F5F3FF"];

export default function HomeScreen() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [topOrderedProducts, setTopOrderedProducts] = useState<
    CatalogProduct[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);

    const results = await Promise.allSettled([
      catalogApi.getCategories(),
      catalogApi.getProducts(),
      catalogApi.getTopOrderedProducts(),
    ]);
    const [categoryResult, productResult, orderedResult] = results;

    if (categoryResult.status === "fulfilled")
      setCategories(categoryResult.value);
    if (productResult.status === "fulfilled") setProducts(productResult.value);
    if (orderedResult.status === "fulfilled")
      setTopOrderedProducts(orderedResult.value);

    if (results.every((result) => result.status === "rejected")) {
      setError("Unable to load the store right now.");
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery),
    );
  }, [products, searchQuery]);

  return (
    <AppScreen style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
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
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          <Pressable accessibilityLabel="Filter products">
            <Ionicons name="options-outline" size={20} color={Colors.primary} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>EVERYDAY ESSENTIALS</Text>
            <Text style={styles.heroTitle}>Fresh picks, delivered simply.</Text>
            <Text style={styles.heroBody}>
              Shop the things you reach for every day.
            </Text>
            <Pressable style={styles.shopButton}>
              <Text style={styles.shopButtonText}>Shop now</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
            </Pressable>
          </View>
          <View style={styles.heroIllustration}>
            <Ionicons name="bag-handle-outline" size={72} color="#A7F3D0" />
            <Ionicons
              name="leaf-outline"
              size={32}
              color="#FDE68A"
              style={styles.heroLeaf}
            />
          </View>
        </View>

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
                <Ionicons
                  name={categoryIcons[index % categoryIcons.length]}
                  size={25}
                  color={Colors.primaryDark}
                />
              </View>
              <Text style={styles.categoryLabel}>{category.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.dealHeader}>
          <View>
            <Text style={styles.sectionTitle}>Flash deals</Text>
            <Text style={styles.sectionSubtitle}>
              Limited-time everyday value
            </Text>
          </View>
          <View style={styles.timer}>
            <Ionicons
              name="time-outline"
              size={15}
              color={Colors.primaryDark}
            />
            <Text style={styles.timerText}>02:18:45</Text>
          </View>
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
          {!loading && filteredProducts.length === 0 && (
            <Text style={styles.emptyText}>No products found.</Text>
          )}
          {filteredProducts.map((product) => (
            <Pressable key={product.id} style={styles.productCard}>
              <View
                style={[styles.productImage, { backgroundColor: "#ECFDF5" }]}
              >
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
              <Text style={styles.productDetail}>Available now</Text>
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

        <SectionHeader title="Top ordered products" action="See all" />
        {error && (
          <Pressable style={styles.errorRow} onPress={() => void loadCatalog()}>
            <Ionicons
              name="cloud-offline-outline"
              size={20}
              color={Colors.error}
            />
            <Text style={styles.errorText}>{error} Tap to retry.</Text>
          </Pressable>
        )}
        <View style={styles.orderedRow}>
          <View style={styles.orderedIcon}>
            <Ionicons name="star" size={20} color="#F59E0B" />
          </View>
          <View style={styles.orderedCopy}>
            <Text style={styles.orderedTitle}>
              {topOrderedProducts[0]?.name ?? "Your daily staples are waiting"}
            </Text>
            <Text style={styles.orderedBody}>
              {topOrderedProducts[0]
                ? `${topOrderedProducts[0].orderedQuantity ?? 0} orders from our community`
                : "Your most ordered products will appear here."}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function SectionHeader({ title, action }: { title: string; action: string }) {
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
  screen: {
    paddingHorizontal: 0,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
  },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
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
  heroLeaf: {
    position: "absolute",
    top: 25,
    right: 7,
    transform: [{ rotate: "38deg" }],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: "800" },
  sectionSubtitle: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
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
  categoryLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
  },
  dealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  timer: {
    backgroundColor: "#D1FAE5",
    borderRadius: Radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timerText: { color: Colors.primaryDark, fontSize: 11, fontWeight: "800" },
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
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 10,
  },
  productImageAsset: { width: "100%", height: "100%", borderRadius: Radius.sm },
  saleBadge: {
    position: "absolute",
    top: 7,
    left: 7,
    backgroundColor: "#F97316",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  saleText: { color: Colors.white, fontSize: 10, fontWeight: "800" },
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
