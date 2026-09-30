import type { CategoryItem, ProductItem } from "@/types";

export const defaultCategories: CategoryItem[] = [
  { id: "coffee", name: "Coffee", slug: "coffee" },
  { id: "non-coffee", name: "Non Coffee", slug: "non-coffee" },
  { id: "food", name: "Food", slug: "food" },
  { id: "cake", name: "Cake", slug: "cake" },
  { id: "snack", name: "Snack", slug: "snack" },
];

export const demoProducts: ProductItem[] = [
  {
    id: "latte",
    name: "Hot Coffee Latte",
    category: "Coffee",
    categoryId: "coffee",
    description: "Espresso, susu, dan lembutnya crema.",
    variants: [
      { id: "latte-s", name: "Small", label: "S", price: 30000 },
      { id: "latte-m", name: "Medium", label: "M", price: 35000, isDefault: true },
      { id: "latte-l", name: "Large", label: "L", price: 40000 },
    ],
    modifiers: [
      { id: "extra-shot", name: "Extra Shot", price: 5000 },
      { id: "vanilla", name: "Vanilla Syrup", price: 4000 },
      { id: "almond", name: "Almond Milk", price: 6000 },
    ],
  },
  {
    id: "cappuccino",
    name: "Hot Cappuccino",
    category: "Coffee",
    categoryId: "coffee",
    description: "Cappuccino klasik dengan foam halus.",
    variants: [
      { id: "cap-s", name: "Small", label: "S", price: 30000 },
      { id: "cap-m", name: "Medium", label: "M", price: 35000, isDefault: true },
      { id: "cap-l", name: "Large", label: "L", price: 40000 },
    ],
    modifiers: [
      { id: "extra-shot-2", name: "Extra Shot", price: 5000 },
      { id: "choco", name: "Chocolate Drizzle", price: 4500 },
    ],
  },
  {
    id: "choco-cake",
    name: "Chocolate Cake",
    category: "Cake",
    categoryId: "cake",
    description: "Potongan cake cokelat lembut dengan topping ganache.",
    price: 25000,
    modifiers: [
      { id: "whipped", name: "Whipped Cream", price: 4000 },
      { id: "ice-cream", name: "Ice Cream", price: 7000 },
    ],
  },
  {
    id: "pasta",
    name: "Pasta",
    category: "Food",
    categoryId: "food",
    description: "Pasta creamy dengan saus khas rumah.",
    price: 40000,
    modifiers: [
      { id: "cheese", name: "Extra Cheese", price: 7000 },
      { id: "chicken", name: "Extra Chicken", price: 12000 },
    ],
  },
  {
    id: "mocha",
    name: "Mocha Frappe",
    category: "Non Coffee",
    categoryId: "non-coffee",
    description: "Kopi mocha dingin dan creamy.",
    price: 42000,
    modifiers: [
      { id: "ice-cream-2", name: "Vanilla Ice Cream", price: 8000 },
      { id: "extra-cocoa", name: "Extra Cocoa", price: 5000 },
    ],
  },
];

export const defaultDiscounts = [
  { id: "disc-1", name: "Diskon Akhir Pekan", type: "percentage", value: 10 },
  { id: "disc-2", name: "Potongan Khusus Member", type: "nominal", value: 5000 },
];

export const transactionsHistory = [
  { id: "TRX-1001", customer: "Rina", total: 65000, time: "09:12", payment: "QRIS" },
  { id: "TRX-1002", customer: "Dimas", total: 98000, time: "10:30", payment: "Cash" },
  { id: "TRX-1003", customer: "Nanda", total: 132000, time: "11:45", payment: "Debit" },
  { id: "TRX-1004", customer: "Ayu", total: 87000, time: "13:10", payment: "E-Wallet" },
];
