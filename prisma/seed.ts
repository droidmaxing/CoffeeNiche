import { PrismaClient, Status, UserRole, DiscountType, VoucherStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.upsert({
    where: { id: "store-coffeeniche" },
    update: {},
    create: {
      id: "store-coffeeniche",
      name: "CoffeeNiche",
      tagline: "Fresh coffee, warm mood",
      logo: "☕",
      primaryColor: "#7c4a2d",
      accentColor: "#f4e9dc",
    },
  });

  await prisma.user.upsert({
    where: { email: "owner@coffeeniche.id" },
    update: { password: bcrypt.hashSync("coffeeniche123", 10) },
    create: {
      id: "user-owner",
      name: "Owner",
      email: "owner@coffeeniche.id",
      password: bcrypt.hashSync("coffeeniche123", 10),
      role: UserRole.OWNER,
      status: Status.ACTIVE,
      storeId: store.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@coffeeniche.id" },
    update: { password: bcrypt.hashSync("coffeeniche123", 10) },
    create: {
      id: "user-admin",
      name: "Admin",
      email: "admin@coffeeniche.id",
      password: bcrypt.hashSync("coffeeniche123", 10),
      role: UserRole.ADMIN,
      status: Status.ACTIVE,
      storeId: store.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "kasir@coffeeniche.id" },
    update: { password: bcrypt.hashSync("coffeeniche123", 10) },
    create: {
      id: "user-cashier",
      name: "Kasir",
      email: "kasir@coffeeniche.id",
      password: bcrypt.hashSync("coffeeniche123", 10),
      role: UserRole.CASHIER,
      status: Status.ACTIVE,
      storeId: store.id,
    },
  });

  await prisma.category.upsert({
    where: { slug: "coffee" },
    update: {},
    create: {
      id: "cat-coffee",
      name: "Coffee",
      slug: "coffee",
      description: "Minuman kopi pilihan",
      status: Status.ACTIVE,
    },
  });

  await prisma.category.upsert({
    where: { slug: "non-coffee" },
    update: {},
    create: {
      id: "cat-noncoffee",
      name: "Non Coffee",
      slug: "non-coffee",
      description: "Minuman non kopi",
      status: Status.ACTIVE,
    },
  });

  await prisma.category.upsert({
    where: { slug: "food" },
    update: {},
    create: {
      id: "cat-food",
      name: "Food",
      slug: "food",
      description: "Menu makanan",
      status: Status.ACTIVE,
    },
  });

  await prisma.category.upsert({
    where: { slug: "cake" },
    update: {},
    create: {
      id: "cat-cake",
      name: "Cake",
      slug: "cake",
      description: "Kue dan dessert",
      status: Status.ACTIVE,
    },
  });

  await prisma.category.upsert({
    where: { slug: "snack" },
    update: {},
    create: {
      id: "cat-snack",
      name: "Snack",
      slug: "snack",
      description: "Snack ringan",
      status: Status.ACTIVE,
    },
  });

  const latte = await prisma.product.upsert({
    where: { sku: "HOT-LATTE" },
    update: {},
    create: {
      id: "prod-latte",
      name: "Hot Coffee Latte",
      sku: "HOT-LATTE",
      description: "Latte panas dengan aroma kopi halus.",
      categoryId: "cat-coffee",
      status: Status.ACTIVE,
    },
  });

  await prisma.productVariant.upsert({
    where: { id: "variant-latte-s" },
    update: {},
    create: {
      id: "variant-latte-s",
      productId: latte.id,
      name: "Small",
      label: "S",
      price: 30000,
      isDefault: false,
      status: Status.ACTIVE,
    },
  });

  await prisma.productVariant.upsert({
    where: { id: "variant-latte-m" },
    update: {},
    create: {
      id: "variant-latte-m",
      productId: latte.id,
      name: "Medium",
      label: "M",
      price: 35000,
      isDefault: true,
      status: Status.ACTIVE,
    },
  });

  await prisma.productVariant.upsert({
    where: { id: "variant-latte-l" },
    update: {},
    create: {
      id: "variant-latte-l",
      productId: latte.id,
      name: "Large",
      label: "L",
      price: 40000,
      isDefault: false,
      status: Status.ACTIVE,
    },
  });

  const cappuccino = await prisma.product.upsert({
    where: { sku: "HOT-CAPPUCCINO" },
    update: {},
    create: {
      id: "prod-cappuccino",
      name: "Hot Cappuccino",
      sku: "HOT-CAPPUCCINO",
      description: "Cappuccino klasik dengan foam lembut.",
      categoryId: "cat-coffee",
      status: Status.ACTIVE,
    },
  });

  await prisma.productVariant.upsert({
    where: { id: "variant-cap-s" },
    update: {},
    create: {
      id: "variant-cap-s",
      productId: cappuccino.id,
      name: "Small",
      label: "S",
      price: 30000,
      isDefault: false,
      status: Status.ACTIVE,
    },
  });

  await prisma.productVariant.upsert({
    where: { id: "variant-cap-m" },
    update: {},
    create: {
      id: "variant-cap-m",
      productId: cappuccino.id,
      name: "Medium",
      label: "M",
      price: 35000,
      isDefault: true,
      status: Status.ACTIVE,
    },
  });

  await prisma.productVariant.upsert({
    where: { id: "variant-cap-l" },
    update: {},
    create: {
      id: "variant-cap-l",
      productId: cappuccino.id,
      name: "Large",
      label: "L",
      price: 40000,
      isDefault: false,
      status: Status.ACTIVE,
    },
  });

  const cake = await prisma.product.upsert({
    where: { sku: "CAKE-CHOCO" },
    update: {},
    create: {
      id: "prod-choco-cake",
      name: "Chocolate Cake",
      sku: "CAKE-CHOCO",
      description: "Cake coklat premium.",
      categoryId: "cat-cake",
      status: Status.ACTIVE,
    },
  });

  await prisma.productVariant.upsert({
    where: { id: "variant-cake-default" },
    update: {},
    create: {
      id: "variant-cake-default",
      productId: cake.id,
      name: "Default",
      price: 25000,
      isDefault: true,
      status: Status.ACTIVE,
    },
  });

  const pasta = await prisma.product.upsert({
    where: { sku: "FOOD-PASTA" },
    update: {},
    create: {
      id: "prod-pasta",
      name: "Pasta",
      sku: "FOOD-PASTA",
      description: "Pasta creamy",
      categoryId: "cat-food",
      status: Status.ACTIVE,
    },
  });

  await prisma.productVariant.upsert({
    where: { id: "variant-pasta-default" },
    update: {},
    create: {
      id: "variant-pasta-default",
      productId: pasta.id,
      name: "Default",
      price: 40000,
      isDefault: true,
      status: Status.ACTIVE,
    },
  });

  await prisma.voucher.upsert({
    where: { code: "WEEKEND10" },
    update: {},
    create: {
      id: "voucher-weekend",
      code: "WEEKEND10",
      name: "Diskon Akhir Pekan 10%",
      type: DiscountType.PERCENTAGE,
      value: 10,
      minPurchase: 50000,
      maxDiscount: 20000,
      usageLimit: 100,
      isActive: true,
      status: VoucherStatus.ACTIVE,
      createdById: "user-owner",
    },
  });

  await prisma.voucher.upsert({
    where: { code: "MEMBER5K" },
    update: {},
    create: {
      id: "voucher-member",
      code: "MEMBER5K",
      name: "Potongan Member Rp5.000",
      type: DiscountType.NOMINAL,
      value: 5000,
      minPurchase: 30000,
      isActive: true,
      status: VoucherStatus.ACTIVE,
      createdById: "user-owner",
    },
  });

  console.log("Seed data CoffeeNiche created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
