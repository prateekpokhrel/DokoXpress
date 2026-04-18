import { BarChart3, Boxes, ClipboardList, ShieldCheck, ShoppingBag, Store, UserCircle, Users } from 'lucide-react';

export const DASHBOARD_NAV = {
  user: [
    { label: 'Products', href: '/user/products', icon: ShoppingBag },
    { label: 'Orders', href: '/user/orders', icon: ClipboardList },
    { label: 'Profile', href: '/user/profile', icon: UserCircle },
  ],
  vendor: [
    { label: 'Products', href: '/vendor/products', icon: Boxes },
    { label: 'Orders', href: '/vendor/orders', icon: ClipboardList },
    { label: 'Profile', href: '/vendor/profile', icon: Store },
  ],
  admin: [
    { label: 'Overview', href: '/admin/overview', icon: BarChart3 },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Vendors', href: '/admin/vendors', icon: Store },
    { label: 'Verification', href: '/admin/verification', icon: ShieldCheck },
  ],
  rider: [
    { label: 'Dashboard', href: '/rider/dashboard', icon: BarChart3 },
    { label: 'Deliveries', href: '/rider/orders', icon: ClipboardList },
    { label: 'Profile', href: '/rider/profile', icon: UserCircle },
  ],
};
