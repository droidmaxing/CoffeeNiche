import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.number().min(0).optional(),
  variants: z.array(
    z.object({
      name: z.string().min(1),
      price: z.number().min(0),
    }),
  ).optional(),
  modifiers: z.array(
    z.object({
      name: z.string().min(1),
      price: z.number().min(0),
    }),
  ).optional(),
});

export const settingsSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  primaryColor: z.string(),
  accentColor: z.string(),
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      variantId: z.string().optional(),
      variantName: z.string().optional(),
      quantity: z.number().int().min(1),
      unitPrice: z.number().min(0),
      selectedModifiers: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          price: z.number().min(0),
        }),
      ),
    }),
  ).min(1),
  paymentMethod: z.string().min(1),
  discount: z.object({
    type: z.enum(["percentage", "nominal"]),
    value: z.number().min(0),
  }).optional(),
});
