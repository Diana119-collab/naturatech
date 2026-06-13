import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Leaf, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAdminStats, logoutAdmin, updateDestino } from '../../services/adminService';
import { getDestinos } from '../../services/destinoService';
import type { AdminStats, Destino } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('dashboard')}</h1>
        <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-emerald-700">
          <LogOut size={18} />
          {t('logout')}
        </Button>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <p className="text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">{tCommon('demo')}</p>

        {stats && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('stats')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5">
                <Users className="text-emerald-600 mb-2" size={24} />
                <p className="text-2xl font-bold">{stats.visitantes.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{t('visitors')}</p>
              </Card>
              <Card className="p-5">
                <Leaf className="text-emerald-600 mb-2" size={24} />
                <p className="text-2xl font-bold">{stats.especiesDescubiertas.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{t('discoveries')}</p>
              </Card>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              <Card className="p-5">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <MapPin size={18} /> {t('popularDestinos')}
                </h3>
                <ul className="space-y-2">
                  {stats.destinosPopulares.map((d: { slug: string; nombre: string; visitas: number }) => (
                    <li key={d.slug} className="flex justify-between text-sm">
                      <span>{d.nombre}</span>
                      <span className="text-emerald-600 font-medium">{d.visitas}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-5">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Leaf size={18} /> {t('popularSpecies')}
                </h3>
                <ul className="space-y-2">
                  {stats.especiesMasVistas.map((e: { id: string; nombre: string; vistas: number }) => (
                    <li key={e.id} className="flex justify-between text-sm">
                      <span>{e.nombre}</span>
                      <span className="text-emerald-600 font-medium">{e.vistas}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t('manageDestinos')}</h2>
          <div className="space-y-4">
            {destinos.map((destino) => (
              <Card key={destino.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-emerald-900">{destino.nombre.es}</h3>
                    {editingId === destino.id ? (
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full mt-2 p-2 border rounded-lg text-sm"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 mt-1">{destino.descripcion.es}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {destino.especies.length} especies · {destino.zonas.length} zonas
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {editingId === destino.id ? (
                      <>
                        <Button size="sm" onClick={() => handleSave(destino)}>{t('save')}</Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                          Cancel
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
                      >
                        {t('edit')}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
