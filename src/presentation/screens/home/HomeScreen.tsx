import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { catalogApi } from "@/infrastructure/api/catalog.api";
import AppScreen from "@/presentation/common/AppScreen";
import { Spacing } from "@/presentation/theme/theme";

import CategoriesSection from "./CategoriesSection";
import HomeHeader from "./HomeHeader";
import HomeHero from "./HomeHero";
import ProductCatalogSection from "./ProductCatalogSection";
import TopOrderedSection from "./TopOrderedSection";

export default function HomeScreen() {
  const [banners, setBanners] = useState<
    Awaited<ReturnType<typeof catalogApi.getBanners>>
  >([]);
  const [categories, setCategories] = useState<
    Awaited<ReturnType<typeof catalogApi.getCategories>>
  >([]);
  const [products, setProducts] = useState<
    Awaited<ReturnType<typeof catalogApi.getProducts>>
  >([]);
  const [topOrderedProducts, setTopOrderedProducts] = useState<
    Awaited<ReturnType<typeof catalogApi.getTopOrderedProducts>>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);

    const results = await Promise.allSettled([
      catalogApi.getBanners(),
      catalogApi.getCategories(),
      catalogApi.getProducts(),
      catalogApi.getTopOrderedProducts(),
    ]);
    const [bannerResult, categoryResult, productResult, orderedResult] =
      results;

    if (bannerResult.status === "fulfilled") setBanners(bannerResult.value);
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
        <HomeHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <HomeHero
          banner={banners[0]}
          featuredProduct={topOrderedProducts[0] ?? products[0]}
        />
        <CategoriesSection categories={categories} loading={loading} />
        <ProductCatalogSection products={filteredProducts} loading={loading} />
        <TopOrderedSection
          products={topOrderedProducts}
          loading={loading}
          error={error}
          onRetry={() => void loadCatalog()}
        />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: Spacing.sm,
    backgroundColor: "#F8FAFC",
  },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
});
