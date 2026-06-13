import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { TreePine } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { ExploradorBadge } from './ExploradorBadge';
import { AccessibilityPanel } from './AccessibilityPanel';

export function Layout() {
  const { pathname } = useLocation();
  const isDestinosActive = pathname === '/destinos' || pathname.startsWith('/explorar/');
  const navLinkClass = (isActive: boolean) =>
    `text-sm font-medium ${isActive ? 'active-nav-link text-white' : 'text-gray-600 hover:text-emerald-700'}`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-teal-50">
      <header className="site-header sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-emerald-100">
        <div className="site-header-inner max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="site-logo flex items-center gap-2 shrink-0">
            <TreePine className="text-emerald-600" size={28} />
            <span className="font-bold text-xl text-emerald-800 hidden sm:block">NaturaTech | Poza de La Arenilla</span>
          </Link>
          <div className="site-header-center hidden md:flex items-center gap-6">
            <div className="nav-pill">
              <nav className="flex items-center gap-4">
                <NavLink to="/" end className={({ isActive }) => navLinkClass(isActive)}>
                  Inicio
                </NavLink>
                <NavLink to="/destinos" className={() => navLinkClass(isDestinosActive)}>
                  Destinos
                </NavLink>
                <NavLink to="/especies" className={({ isActive }) => navLinkClass(isActive)}>
                  Colección
                </NavLink>
                <NavLink to="/ia" className={({ isActive }) => navLinkClass(isActive)}>
                  Natura AI
                </NavLink>
              </nav>
            </div>
          </div>
          <div className="site-header-actions flex items-center gap-3">
            <LanguageSelector compact />
            <ExploradorBadge compact />
          </div>
        </div>
      </header>

      <main className="site-main flex-1 max-w-6xl mx-auto w-full px-4 py-6 pb-24 sm:pb-8">
        <Outlet />
      </main>

      {/* Side and bottom nav removed to keep a consistent top header menu */}

      <AccessibilityPanel />
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}
