import { z } from 'zod';

export const productSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(2, 'Product name is required.'),
  description: z.string().min(12, 'Add a short product description.'),
  category: z.string().min(2, 'Category is required (e.g. Groceries, Clothing).'),
  price: z.coerce.number().min(1, 'Price must be at least 1.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
  status: z.enum(['active', 'draft'], {
    errorMap: () => ({ message: 'Please select a status.' })
  }),
  image: z.string().optional().default(''),
  locationTag: z.string().optional().default(''),
  deliveryMinutes: z.coerce.number().int().optional(),
  isFastDelivery: z.boolean().optional().default(false),
}).refine((data) => {
  if (data.isFastDelivery && (!data.deliveryMinutes || data.deliveryMinutes < 1)) {
    return false;
  }
  return true;
}, {
  message: "Delivery ETA is required for fast delivery (min 1 min).",
  path: ["deliveryMinutes"],
});
