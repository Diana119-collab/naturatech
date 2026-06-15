import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Leaf, MapPin,TreePine, BarChart3,FileText, Settings, Edit2, X, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAdminStats, logoutAdmin, updateDestino } from '../../services/adminService';
import { getDestinos } from '../../services/destinoService';
import type { AdminStats, Destino } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// Componente para las tarjetas de estadísticas principales
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

// Componente para las listas de ránkings
interface RankingListProps {
  title: string;
  icon: React.ReactNode;
  items: { id: string | number; nombre: string; valor: number }[];
  valueLabel: string;
}

function RankingList({ title, icon, items, valueLabel }: RankingListProps) {
  return (
    <Card className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
        <span className="text-emerald-600">{icon}</span>
        {title}
        <span className="text-xs font-normal text-gray-400 ml-auto">({valueLabel})</span>
      </h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center justify-between gap-3 text-sm pb-3 border-b border-gray-50 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="font-mono text-gray-400 w-5 text-right">{index + 1}.</span>
              <span className="font-medium text-gray-800 truncate" title={item.nombre}>{item.nombre}</span>
            </div>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full tabular-nums text-xs">
              {item.valor.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function AdminDashboardPage() {
  const { t } = useTranslation('admin');
  const { t: tCommon } = useTranslation('common');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAdminStats().then(setStats);
    getDestinos().then(setDestinos);
    // Document title update for context
    document.title = `Dashboard | NaturaTech Admin - Municipalidad de La Punta`;
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const handleSave = async (destino: Destino) => {
    const updated = {
      ...destino,
      descripcion: { ...destino.descripcion, es: editDesc },
    };
    await updateDestino(updated);
    setDestinos(await getDestinos());
    setEditingId(null);
  };

  return (
    <div className="admin-dashboard-layout">
      <header className="admin-site-header">    
        <div className="admin-header-inner">
          <div className="site-logo">
            <TreePine size={26} fill="currentColor" />   
            <span className="font-bold text-xl tracking-tight">
              Natura<span className="text-emerald-700">Tech</span>
            </span>      
           </div>

           <div className="site-header-actions">
              <div className="text-right mr-2">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-emerald-700 font-medium">Municipalidad de La Punta</p>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="text-emerald-800 hover:bg-emerald-50 gap-2 border border-slate-100">
                  <LogOut size={16} />
                  {t('logout')}
              </Button>
           </div>

        </div>  
        </header>
      <div className="admin-workspace">
        <nav className="admin-sidebar">
          <div className="admin-sidebar-section">
            <span className="admin-sidebar-title">{t('management_panel')}</span>
            <a href="#" className="admin-nav-link is-active">
              <BarChart3 size={18} /> {t('dashboard')}
            </a>
            <a href="#" className="admin-nav-link">
              <Leaf size={18} /> Especies
            </a>
            <a href="#" className="admin-nav-link">
              <MapPin size={18} /> {t('manageDestinos')}
            </a>
          </div>

          <div className="admin-sidebar-section">
            <span className="admin-sidebar-title">Auditoría</span>
            <a href="#" className="admin-nav-link">
              <FileText size={18} /> Reportes
            </a>
          </div>
          <div className="mt-auto pt-4 border-t border-slate-100">
            <a href="#" className="admin-nav-link">
              <Settings size={18} /> Configuración
            </a>
          </div>
        </nav>

        <main className="admin-main-content">
          <div className="admin-content-view-header">
            <div>
              <h1 className="admin-page-title">{t('dashboard')}</h1>
              <p className="text-sm text-slate-500 m-0 mt-1">Gestión operativa del ecosistema de la Poza de la Arenilla.</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            </span>
          </div>

          {stats && (
            <>
              {/* Bloque de Indicadores (Métricas Rápidas) */}
              <section className="admin-stats-grid">
                <div className="admin-dashboard-card flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-700">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-black m-0 tracking-tight">{stats.visitantes.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 font-medium m-0">{t('visitors')}</p>
                  </div>
                </div>

                <div className="admin-dashboard-card flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-700">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-black m-0 tracking-tight">{stats.especiesDescubiertas.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 font-medium m-0">{t('discoveries')}</p>
                  </div>
                </div>
              </section>

              {/* Bloque de Rankings de popularidad */}
              <section className="admin-rankings-grid">
                <div className="admin-dashboard-card">
                  <h3 className="font-bold text-sm text-emerald-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <MapPin size={16} /> {t('popularDestinos')}
                  </h3>
                  <ul className="space-y-2.5 p-0 m-0 list-none">
                    {stats.destinosPopulares.map((d: { slug: string; nombre: string; visitas: number }, idx) => (
                      <li key={d.slug} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 font-medium">{idx + 1}. {d.nombre}: </span>
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-xs">{d.visitas} visitas</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="admin-dashboard-card">
                  <h3 className="font-bold text-sm text-emerald-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Leaf size={16} /> {t('popularSpecies')}
                  </h3>
                  <ul className="space-y-2.5 p-0 m-0 list-none">
                    {stats.especiesMasVistas.map((e: { id: string; nombre: string; vistas: number }, idx) => (
                      <li key={e.id} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 font-medium">{idx + 1}. {e.nombre}:</span>
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-xs">{e.vistas} vistas</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </>
          )}

          {/* Sección de CRUD / Edición de Destinos */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-emerald-950 mb-2">{t('manageDestinos')}</h2>
            <div className="grid grid-cols-1 gap-4">
              {destinos.map((destino) => (
                <div key={destino.id} className="admin-dashboard-card">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-emerald-900 text-base m-0 mb-1">{destino.nombre.es}</h3>
                      
                      {editingId === destino.id ? (
                        <textarea
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="admin-editable-textarea mt-2"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-slate-600 m-0 leading-relaxed">{destino.descripcion.es}</p>
                      )}
                      
                      <div className="flex gap-4 mt-3 text-xs text-slate-400 font-medium">
                        <span>• {destino.especies.length} especies registradas</span>
                        <span>• {destino.zonas.length} sub-zonas</span>
                      </div>
                    </div>

                    <div className="flex gap-2 self-end sm:self-start">
                      {editingId === destino.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(destino)} className="bg-emerald-700 text-white hover:bg-emerald-800 gap-1">
                            <Save size={14} /> {t('save')}
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => setEditingId(null)} className="gap-1">
                            <X size={14} /> {tCommon('cancel')}
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingId(destino.id);
                            setEditDesc(destino.descripcion.es);
                          }}
                          className="text-emerald-800 hover:bg-emerald-50 gap-1 border border-slate-100"
                        >
                          <Edit2 size={14} /> {t('edit')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
              </section>
        </main>
      </div>                    
    </div>
  );
}
