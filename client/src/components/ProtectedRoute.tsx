import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '../services/adminService';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}
