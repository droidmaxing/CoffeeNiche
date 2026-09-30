import { create } from "zustand";
import { demoProducts, defaultCategories } from "@/lib/data";
import type { CartItem, DiscountRule, ProductItem } from "@/types";

const defaultDiscounts: DiscountRule[] = [
  { id: "percentage", name: "Persentase 10%", type: "percentage", value: 10 },
  { id: "nominal", name: "Nominal Rp5.000", type: "nominal", value: 5000 },
];

type PosState = {
  categories: typeof defaultCategories;
  products: ProductItem[];
  cart: CartItem[];
  selectedCategory: string;
  search: string;
  discount: DiscountRule | null;
  paymentMethod: string;
  addToCart: (product: ProductItem, variantId?: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setSelectedCategory: (category: string) => void;
  setSearch: (value: string) => void;
  setDiscount: (discount: DiscountRule | null) => void;
  setPaymentMethod: (method: string) => void;
};

export const usePosStore = create<PosState>()((set) => ({
  categories: defaultCategories,
  products: demoProducts,
  cart: [],
  selectedCategory: "all",
  search: "",
  discount: null,
  paymentMethod: "Cash",
  addToCart: (product, variantId) => {
    set((state) => {
      const variant = product.variants?.find((item) => item.id === variantId) ?? product.variants?.find((item) => item.isDefault) ?? null;
      const basePrice = variant ? variant.price : product.price ?? 0;
      const existing = state.cart.find(
        (item) =>
          item.productId === product.id &&
          item.variantId === (variant?.id ?? undefined) &&
          item.productName === product.name,
      );

      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
              : item,
          ),
        };
      }

      const newItem: CartItem = {
        id: `${product.id}-${variant?.id ?? "default"}-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        variantId: variant?.id,
        variantName: variant?.name,
        unitPrice: basePrice,
        quantity: 1,
        selectedModifiers: [],
        subtotal: basePrice,
      };

      return { cart: [...state.cart, newItem] };
    });
  },
  updateQuantity: (id, delta) =>
    set((state) => ({
      cart: state.cart
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = Math.max(0, item.quantity + delta);
          if (nextQty === 0) return null;
          return { ...item, quantity: nextQty, subtotal: nextQty * item.unitPrice };
        })
        .filter(Boolean) as CartItem[],
    })),
  removeItem: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  clearCart: () => set({ cart: [] }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearch: (value) => set({ search: value }),
  setDiscount: (discount) => set({ discount }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
}));

export const defaultDiscountOptions = defaultDiscounts;
