import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Product name is required.'),
  description: z.string().min(12, 'Add a short product description.'),
  category: z.enum(['Groceries', 'Electronics', 'Beauty', 'Home', 'Bakery', 'Beverages']),
  price: z.coerce.number().min(1, 'Price must be greater than zero.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
  status: z.enum(['active', 'draft']),
  image: z.string().url('Enter a valid image URL.'),
  locationTag: z.string().min(2, 'Location tag is required.'),
  deliveryMinutes: z.coerce.number().int().min(10, 'Minimum delivery estimate is 10 minutes.'),
  isFastDelivery: z.boolean(),
});
