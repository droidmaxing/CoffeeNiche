export type Role = "OWNER" | "ADMIN" | "CASHIER";

export type ThemePalette = {
  primary: string;
  accent: string;
  surface: string;
  background: string;
  text: string;
};

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  label?: string;
  price: number;
  isDefault?: boolean;
};

export type ModifierOption = {
  id: string;
  name: string;
  price: number;
};

export type ProductItem = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  description?: string;
  price?: number;
  variants?: ProductVariant[];
  modifiers?: ModifierOption[];
};

export type CartItem = {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  selectedModifiers: ModifierOption[];
  subtotal: number;
};

export type DiscountRule = {
  id: string;
  name: string;
  type: "percentage" | "nominal";
  value: number;
};

export type StoreSettings = {
  name: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
};
