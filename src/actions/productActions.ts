"use server";

import { sql } from "kysely";
import { DEFAULT_PAGE_SIZE } from "../../constant";
import { db } from "../../db";
import { InsertProducts, UpdateProducts } from "@/types";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export async function getProducts(pageNo = 1, pageSize = DEFAULT_PAGE_SIZE) {
  try {
    let dbQuery = db.selectFrom("products").selectAll();

    // Get total product count
    const countResult = await db
      .selectFrom("products")
      .select(sql<number>`COUNT(*)`.as("count"))
      .executeTakeFirst();

    const count = countResult?.count || 0;
    const lastPage = Math.ceil(count / pageSize);

    // Fetch paginated products
    const products = await dbQuery
      .offset((pageNo - 1) * pageSize)
      .limit(pageSize)
      .execute();

    return { products, count, lastPage, numOfResultsOnCurPage: products.length };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: "Failed to fetch products" };
  }
}
export const getProduct = cache(async function getProduct(productId: number) {
    // console.log("run");
    try {
      const product = await db
        .selectFrom("products")
        .selectAll()
        .where("id", "=", productId)
        .executeTakeFirst();
  
      return product;
    } catch (error) {
      return { error: "Could not find the product" };
    }
  });

// export const getProduct = cache(async (productId: number) => {
//   try {
//     const product = await db
//       .selectFrom("products")
//       .selectAll()
//       .where("id", "=", productId)
//       .executeTakeFirst();

//     if (!product) throw new Error("Product not found");
//     return product;
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return { error: "Could not find the product" };
//   }
//});

async function toggleForeignKeyChecks(enable: boolean) {
  const value = enable ? 1 : 0;
  await db.executeQuery(sql`SET foreign_key_checks = ${value}`);
}

export async function deleteProduct(productId: number) {
  try {
    await toggleForeignKeyChecks(false);

    // Delete references first
    await db.deleteFrom("product_categories").where("product_id", "=", productId).execute();
    await db.deleteFrom("reviews").where("product_id", "=", productId).execute();
    await db.deleteFrom("comments").where("product_id", "=", productId).execute();

    // Delete the product
    const deleted = await db.deleteFrom("products").where("id", "=", productId).execute();
    if (!deleted) throw new Error("Product not found or already deleted");

    await toggleForeignKeyChecks(true);
    revalidatePath("/products");

    return { message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "Something went wrong, cannot delete the product" };
  }
}

export async function mapBrandIdsToNames(brandIds: number[]) {
  try {
    if (!brandIds.length) return new Map();

    const brands = await db
      .selectFrom("brands")
      .select(["id", "name"])
      .where("id", "in", brandIds)
      .execute();

    return new Map(brands.map((brand) => [brand.id, brand.name]));
  } catch (error) {
    console.error("Error fetching brands:", error);
    return new Map();
  }
}

export async function getAllProductCategories(products: any[]) {
  try {
    const productIds = products.map((p) => p.id);
    if (!productIds.length) return new Map();

    const categories = await db
      .selectFrom("product_categories")
      .innerJoin("categories", "categories.id", "product_categories.category_id")
      .select(["product_categories.product_id", "categories.name"])
      .where("product_categories.product_id", "in", productIds)
      .execute();

    const categoriesMap = new Map();
    categories.forEach(({ product_id, name }) => {
      if (!categoriesMap.has(product_id)) categoriesMap.set(product_id, []);
      categoriesMap.get(product_id).push(name);
    });

    return categoriesMap;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return new Map();
  }
}

export async function getProductCategories(productId: number) {
  try {
    return await db
      .selectFrom("product_categories")
      .innerJoin("categories", "categories.id", "product_categories.category_id")
      .select(["categories.id", "categories.name"])
      .where("product_categories.product_id", "=", productId)
      .execute();
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
}
export async function MapBrandIdsToName(brandsId) {
  const brandsMap = new Map();
  try {
    for (const brandId of brandsId) {
      const brand = await db
        .selectFrom("brands")
        .select("name")
        .where("id", "=", brandId)
        .executeTakeFirst();

      brandsMap.set(brandId, brand?.name || "Unknown Brand");
    }
    return brandsMap;
  } catch (error) {
    throw error;
  }
}

