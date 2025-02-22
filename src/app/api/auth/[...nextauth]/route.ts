// import NextAuth from "next-auth/next";
// import { authOptions } from "@/utils/authOptions";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import { NextResponse } from "next/server";
import { db } from "../../../../../db";
//import { db } from "@/lib/db"; // Ensure this points to your Kysely DB instance
// import { products } from "@/schemas/dbSchema"; // Define your DB schema properly

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.old_price || !body.categories || !body.brands) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert product into the database
    const result = await db
      .insertInto("products")
      .values({
        name: body.name,
        description: body.description,
        old_price: parseFloat(body.old_price),
        discount: parseFloat(body.discount),
        rating: parseFloat(body.rating),
        colors: body.colors,
        brands: JSON.stringify(body.brands.map((b: any) => b.value)), // Convert to JSON
        categories: JSON.stringify(body.categories.map((c: any) => c.value)),
        gender: body.gender,
        occasion: JSON.stringify(body.occasion?.map((o: any) => o.value) || []),
        image_url: body.image_url,
      })
      .executeTakeFirst();

    return NextResponse.json({ success: true, product: result });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
