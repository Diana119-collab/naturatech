import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { TreePine, Home, MapPinned, Camera, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { ExploradorBadge } from './ExploradorBadge';
import { AccessibilityPanel } from './AccessibilityPanel';

export function Layout() {
  const { pathname } = useLocation();
  const { t } = useTranslation('landing');
  const isDestinosActive = pathname === '/destinos' || pathname.startsWith('/explorar/') || pathname.startsWith('/ave/');
  const navLinkClass = (isActive: boolean) =>
    `text-sm font-medium ${isActive ? 'active-nav-link text-white' : 'text-gray-600 hover:text-emerald-700'}`;

  const mobileNavItems = [
    { to: '/', label: t('pages.start'), icon: Home, end: true },
    { to: '/destinos', label: t('pages.species'), icon: MapPinned, end: false },
    { to: '/especies', label: t('pages.identify'), icon: Camera, end: false },
    { to: '/ia', label: t('pages.ia'), icon: Sparkles, end: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-teal-50">
      <header className="site-header sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-emerald-100">
        <div className="site-header-inner max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="site-logo flex items-center gap-2 shrink-0">
            <TreePine className="text-emerald-600" size={28} />
            <span className="font-bold text-xl text-emerald-800 hidden sm:block">NaturaTech</span>
          </Link>

          <div className="site-header-center hidden md:flex items-center gap-6">
            <div className="nav-pill">
              <nav className="flex items-center gap-4">
                <NavLink to="/" end className={({ isActive }) => navLinkClass(isActive)}>
                  {t('pages.start')}
                </NavLink>
                <NavLink to="/destinos" className={() => navLinkClass(isDestinosActive)}>
                  {t('pages.species')}
                </NavLink>
                <NavLink to="/especies" className={({ isActive }) => navLinkClass(isActive)}>
                  {t('pages.identify')}
                </NavLink>
                <NavLink to="/ia" className={({ isActive }) => navLinkClass(isActive)}>
                  {t('pages.ia')}
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

      <nav className="mobile-bottom-nav md:hidden" aria-label="Navegación principal">
        <div className="mobile-bottom-inner">
          {mobileNavItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mobile-bottom-item ${isActive || (to === '/destinos' && isDestinosActive) ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

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
