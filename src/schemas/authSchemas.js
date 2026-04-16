import { z } from 'zod';

const phoneRegex = /^[+\d][\d\s-]{8,}$/;

export const loginSchema = z.object({
  role: z.enum(['user', 'vendor', 'admin']),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  remember: z.boolean(),
});

export const customerSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  country: z.string().min(2, 'Country is required.'),
  state: z.string().min(2, 'State is required.'),
  city: z.string().min(2, 'City is required.'),
  remember: z.boolean(),
  profilePhoto: z.any().optional(),
});

export const vendorSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  storeName: z.string().min(2, 'Store name is required.'),
  country: z.string().min(2, 'Country is required.'),
  state: z.string().min(2, 'State is required.'),
  city: z.string().min(2, 'City is required.'),
  remember: z.boolean(),
  citizenshipDocument: z.any().optional(),
  storeLicense: z.any().optional(),
});

export const adminSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  department: z.string().min(2, 'Department is required.'),
  remember: z.boolean(),
});
