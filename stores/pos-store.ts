import { create } from "zustand";
import { demoProducts, defaultCategories } from "@/lib/data";
import type { CartItem, Voucher, ProductItem } from "@/types";

const demoVouchers: Voucher[] = [
  { id: "voucher-weekend", code: "WEEKEND10", name: "Diskon Akhir Pekan 10%", type: "percentage", value: 10, minPurchase: 50000, maxDiscount: 20000, usageLimit: 100, usedCount: 0, isActive: true, status: "ACTIVE" },
  { id: "voucher-member", code: "MEMBER5K", name: "Potongan Member Rp5.000", type: "nominal", value: 5000, minPurchase: 30000, usageLimit: 50, usedCount: 0, isActive: true, status: "ACTIVE" },
];

type PosState = {
  categories: typeof defaultCategories;
  products: ProductItem[];
  cart: CartItem[];
  selectedCategory: string;
  search: string;
  appliedVoucher: Voucher | null;
  paymentMethod: string;
  addToCart: (product: ProductItem, variantId?: string, selectedModifiers?: ProductItem["modifiers"]) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setSelectedCategory: (category: string) => void;
  setSearch: (value: string) => void;
  applyVoucher: (code: string) => boolean;
  setAppliedVoucher: (voucher: Voucher | null) => void;
  loadCatalog: (categories: typeof defaultCategories, products: ProductItem[]) => void;
  removeVoucher: () => void;
  setPaymentMethod: (method: string) => void;
};

export const usePosStore = create<PosState>()((set, get) => ({
  categories: defaultCategories,
  products: demoProducts,
  cart: [],
  selectedCategory: "all",
  search: "",
  appliedVoucher: null,
  paymentMethod: "Cash",
  addToCart: (product, variantId, selectedModifiers = []) => {
    set((state) => {
      const variant = product.variants?.find((item) => item.id === variantId) ?? product.variants?.find((item) => item.isDefault) ?? null;
      const basePrice = variant ? variant.price : product.price ?? 0;
      const existing = state.cart.find(
        (item) =>
          item.productId === product.id &&
          item.variantId === (variant?.id ?? undefined) &&
          item.productName === product.name &&
          item.selectedModifiers.map((modifier) => modifier.id).join(",") === selectedModifiers.map((modifier) => modifier.id).join(","),
      );

      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * (item.unitPrice + item.selectedModifiers.reduce((sum, modifier) => sum + modifier.price, 0)) }
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
        selectedModifiers,
        subtotal: basePrice + selectedModifiers.reduce((sum, modifier) => sum + modifier.price, 0),
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
          return { ...item, quantity: nextQty, subtotal: nextQty * (item.unitPrice + item.selectedModifiers.reduce((sum, modifier) => sum + modifier.price, 0)) };
        })
        .filter(Boolean) as CartItem[],
    })),
  removeItem: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  clearCart: () => set({ cart: [], appliedVoucher: null }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearch: (value) => set({ search: value }),
  applyVoucher: (code) => {
    const voucher = demoVouchers.find((v) => v.code.toUpperCase() === code.toUpperCase() && v.isActive && v.status === "ACTIVE");
    if (!voucher) return false;
    const subtotal = get().cart.reduce((sum, item) => sum + item.subtotal, 0);
    if (voucher.minPurchase && subtotal < voucher.minPurchase) return false;
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) return false;
    set({ appliedVoucher: voucher });
    return true;
  },
  setAppliedVoucher: (voucher) => set({ appliedVoucher: voucher }),
  loadCatalog: (categories, products) => set({ categories, products }),
  removeVoucher: () => set({ appliedVoucher: null }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
}));

export const demoVoucherOptions = demoVouchers;
