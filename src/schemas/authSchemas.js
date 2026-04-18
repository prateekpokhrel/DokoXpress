import { z } from 'zod';

const phoneRegex = /^[+\d][\d\s-]{8,}$/;

export const loginSchema = z.object({
  role: z.enum(['user', 'vendor', 'rider', 'admin']),
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
export const riderSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  age: z.string().transform((v) => parseInt(v, 10)).pipe(z.number().min(18, 'Age must be 18+')),
  vehicleNumber: z.string().min(2, 'Vehicle number is required.'),
  country: z.string().min(2, 'Country is required.'),
  district: z.string().min(2, 'District is required.'),
  city: z.string().min(2, 'City is required.'),
  remember: z.boolean(),
  citizenshipPhoto: z.any().optional(),
  drivingLicensePhoto: z.any().optional(),
});
