import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  MapPinned,
  Settings,
  Sprout,
  TreePine,
  User,
  Users,
} from 'lucide-react';
import { loginAdmin } from '../../services/adminService';

function AdminFeature({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="admin-login-feature">
      <span>{icon}</span>
      <strong>{label}</strong>
    </div>
  );
}

export function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('naturatech2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await loginAdmin(username, password);

    if (ok) {
      navigate('/admin/dashboard');
      return;
    }

    setError('Credenciales incorrectas');
  };

  return (
    <div className="admin-login-page">
      <header className="admin-login-header">
        <div className="admin-login-brand">
          <TreePine size={28} strokeWidth={1.8} />
          <span>NaturaTech</span>       
        </div>
      </header>

      <main className="admin-login-hero">
        <img
          src="fondo.jpg"
          alt="Naturaleza"
          className="admin-login-bg"
        />
         <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent z-10" />
        <div className="admin-login-hero-overlay" />

        <section className="admin-login-card" aria-label="Inicio de sesion administrativo">
          <div className="admin-login-title">
            <h1>
              INICIAR SESION <span>| NaturaTech - Admin</span>
            </h1>
            <p>Acceso para Representantes Autorizados de la Municipalidad de La Punta</p>
          </div>

          <div className="admin-login-grid">
            <form className="admin-login-form" onSubmit={handleSubmit}>
              <h2>Datos de Acceso</h2>

              <label htmlFor="admin-username">Nombre de Usuario (e.g. dgarcia@munilapunta.gob.pe)</label>
              <div className="admin-login-field">
                <User size={15} />
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>

              <label htmlFor="admin-password">Contrasena</label>
              <div className="admin-login-field">
                <LockKeyhole size={15} />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                />
                <button
                  type="button"
                  className="admin-login-eye"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {error && <p className="admin-login-error">{error}</p>}

              <button className="admin-login-submit" type="submit">
                Ingresar al Panel
              </button>
            </form>

            <aside className="admin-login-info">
              <h2>Informacion Institucional</h2>
              <h3>Panel de Gestion</h3>

              <div className="admin-login-features">
                <AdminFeature icon={<MapPinned size={15} />} label="Biodiversidad" />
                <AdminFeature icon={<Sprout size={15} />} label="Areas Verdes" />
                <AdminFeature icon={<CalendarDays size={15} />} label="Eventos" />
                <AdminFeature icon={<Users size={15} />} label="Censos" />
                <AdminFeature icon={<Settings size={15} />} label="Configuracion" />
                <AdminFeature icon={<Leaf size={15} />} label="Gestion" />
              </div>

              <p>Gestion Integral de la Poza de la Arenilla</p>
            </aside>
          </div>

          <p className="admin-login-footnote">
            Acceso exclusivo y auditado para funcionarios de la <strong>MUNICIPALIDAD DE LA PUNTA</strong>.
            <br />
          </p>
        </section>
      </main>
    </div>
  );
}
