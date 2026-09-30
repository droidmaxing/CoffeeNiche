import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Silakan login." }, { status: 401 });

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: {
        category: true,
        variants: { where: { status: "ACTIVE" }, orderBy: { price: "asc" } },
        modifiers: { where: { status: "ACTIVE" }, orderBy: { name: "asc" } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return NextResponse.json({
    categories: categories.map(({ id, name, slug, description }) => ({ id, name, slug, description })),
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category?.name ?? "Lainnya",
      categoryId: product.categoryId ?? "",
      description: product.description ?? undefined,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        label: variant.label ?? undefined,
        price: Number(variant.price),
        isDefault: variant.isDefault,
      })),
      modifiers: product.modifiers.map((modifier) => ({
        id: modifier.id,
        name: modifier.name,
        price: Number(modifier.price),
      })),
    })),
  });
}
