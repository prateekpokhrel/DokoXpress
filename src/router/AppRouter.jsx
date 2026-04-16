import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicLayout } from '@/layouts/PublicLayout';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminVendorsPage } from '@/pages/admin/AdminVendorsPage';
import { AdminVerificationPage } from '@/pages/admin/AdminVerificationPage';
import { UserOrdersPage } from '@/pages/user/UserOrdersPage';
import { UserProductsPage } from '@/pages/user/UserProductsPage';
import { UserProfilePage } from '@/pages/user/UserProfilePage';
import { VendorOrdersPage } from '@/pages/vendor/VendorOrdersPage';
import { VendorProductsPage } from '@/pages/vendor/VendorProductsPage';
import { VendorProfilePage } from '@/pages/vendor/VendorProfilePage';
import './AppRouter.css';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route element={<HomePage />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<SignupPage />} path="/signup" />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route element={<DashboardLayout />}>
          <Route element={<UserProductsPage />} path="/user/products" />
          <Route element={<UserOrdersPage />} path="/user/orders" />
          <Route element={<UserProfilePage />} path="/user/profile" />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
        <Route element={<DashboardLayout />}>
          <Route element={<VendorProductsPage />} path="/vendor/products" />
          <Route element={<VendorOrdersPage />} path="/vendor/orders" />
          <Route element={<VendorProfilePage />} path="/vendor/profile" />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route element={<AdminOverviewPage />} path="/admin/overview" />
          <Route element={<AdminUsersPage />} path="/admin/users" />
          <Route element={<AdminVendorsPage />} path="/admin/vendors" />
          <Route element={<AdminVerificationPage />} path="/admin/verification" />
        </Route>
      </Route>

      <Route element={<Navigate replace to="/" />} path="/home" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}
