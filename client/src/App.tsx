import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, AdminLayout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProgressProvider } from './context/ProgressContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { ToastProvider } from './context/ToastContext';
import { LandingPage } from './pages/LandingPage';
import { DestinosPage } from './pages/DestinosPage';
import { EspecieDetallePage } from './pages/EspecieDetallePage';
import { ExplorarPage } from './pages/ExplorarPage';
import { ColeccionPage } from './pages/ColeccionPage';
import { GuiaIAPage } from './pages/GuiaIAPage';
import { CertificadoPage } from './pages/CertificadoPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import './i18n';

export default function App() {
  return (
    <HashRouter>
      <ProgressProvider>
        <AccessibilityProvider>
          <ToastProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/destinos" element={<DestinosPage />} />
                <Route path="/ave/:especieId" element={<EspecieDetallePage />} />
                <Route path="/explorar/:destino" element={<ExplorarPage />} />
                <Route path="/especies" element={<ColeccionPage />} />
                <Route path="/ia" element={<GuiaIAPage />} />
                <Route path="/certificado" element={<CertificadoPage />} />
              </Route>

              <Route element={<AdminLayout />}>
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AccessibilityProvider>
      </ProgressProvider>
    </HashRouter>
  );
}
