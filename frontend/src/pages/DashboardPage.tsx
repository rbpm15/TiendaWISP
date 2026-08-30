import { useState, useEffect } from 'react';
import type { DashboardStats, StockAlert, StockMovement } from '../types/index.js';
import { getDashboardStats, getStockAlerts, getStockMovements } from '../services/api.js';

import { 
  Antenna, Router, Plug, Wrench, Link2, Zap, 
  Package, Boxes, AlertTriangle, CheckCircle, DollarSign,
  ArrowDownToLine, ArrowUpFromLine, RefreshCw, ClipboardList, CheckSquare
} from 'lucide-react';

const CATEGORY_LABELS: Record<string, { label: string; icon: any }> = {
  antenna: { label: 'Antenas', icon: Antenna },
  router: { label: 'Routers', icon: Router },
  switch: { label: 'Switches', icon: Plug },
  accessory: { label: 'Accesorios', icon: Wrench },
  cable: { label: 'Cables', icon: Link2 },
  poe: { label: 'PoE', icon: Zap },
};

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, a, m] = await Promise.all([
          getDashboardStats(),
          getStockAlerts(),
          getStockMovements(10),
        ]);
        setStats(s.data);
        setAlerts(a.data);
        setMovements(m.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader-pulse" />
        <span>Cargando dashboard...</span>
      </div>
    );
  }

  if (!stats) return <div className="page-error">Error al cargar datos</div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <span className="eyebrow">Panel de control</span>
          <h1>Dashboard de Inventario</h1>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <article className="kpi-card">
          <div className="kpi-card__icon kpi-card__icon--blue"><Package size={24} /></div>
          <div>
            <strong>{stats.totalProducts}</strong>
            <span>Productos activos</span>
          </div>
        </article>
        <article className="kpi-card">
          <div className="kpi-card__icon kpi-card__icon--green"><Boxes size={24} /></div>
          <div>
            <strong>{stats.totalUnits}</strong>
            <span>Unidades en stock</span>
          </div>
        </article>
        <article className="kpi-card">
          <div className="kpi-card__icon kpi-card__icon--amber">
            {stats.lowStockCount > 0 ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
          </div>
          <div>
            <strong>{stats.lowStockCount}</strong>
            <span>Stock bajo</span>
          </div>
        </article>
        <article className="kpi-card">
          <div className="kpi-card__icon kpi-card__icon--purple"><DollarSign size={24} /></div>
          <div>
            <strong>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(stats.totalInventoryValue)}</strong>
            <span>Valor de inventario</span>
          </div>
        </article>
      </div>

      <div className="dashboard__grid">
        {/* Categories breakdown */}
        <section className="dash-card">
          <h2>Inventario por categoría</h2>
          <div className="cat-list">
            {Object.entries(stats.categories).map(([cat, info]) => {
              const catData = CATEGORY_LABELS[cat] || { label: cat, icon: null };
              const Icon = catData.icon;
              return (
                <div key={cat} className="cat-row">
                  <span className="cat-row__label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {Icon && <Icon size={16} />} {catData.label}
                  </span>
                <div className="cat-row__bar-wrap">
                  <div
                    className="cat-row__bar"
                    style={{ width: `${Math.min(100, (info.totalQty / stats.totalUnits) * 100)}%` }}
                  />
                </div>
                  <span className="cat-row__count">{info.totalQty} uds</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stock alerts */}
        <section className="dash-card dash-card--alerts">
          <h2>
            Alertas de stock
            {alerts.length > 0 && <span className="badge badge--warn">{alerts.length}</span>}
          </h2>
          {alerts.length === 0 ? (
            <div className="empty-state">
              <CheckSquare size={32} color="var(--green)" style={{ margin: '0 auto 12px' }} />
              <p>Todo el inventario está en niveles adecuados</p>
            </div>
          ) : (
            <ul className="alert-list">
              {alerts.map((a) => (
                <li key={a.id} className={`alert-item alert-item--${a.status}`}>
                  <div className="alert-item__info">
                    <strong>{a.name}</strong>
                    <span>{a.brand} · {a.sku}</span>
                  </div>
                  <div className="alert-item__stock">
                    <strong>{a.quantity}</strong>
                    <span>/ {a.minStock} mín</span>
                  </div>
                  <span className={`status-pill status-pill--${a.status}`}>
                    {a.status === 'sin_stock' ? 'Sin stock' : 'Bajo'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent movements */}
        <section className="dash-card dash-card--wide">
          <h2>Últimos movimientos</h2>
          {movements.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <p>Sin movimientos recientes</p>
            </div>
          ) : (
            <div className="movements-table-wrap">
              <table className="movements-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cant.</th>
                    <th>Notas</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.product?.name}</strong>
                        <span className="text-muted">{m.product?.sku}</span>
                      </td>
                      <td>
                        <span className={`mov-type mov-type--${m.type}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {m.type === 'in' ? <><ArrowDownToLine size={14}/> Entrada</> : 
                           m.type === 'out' ? <><ArrowUpFromLine size={14}/> Salida</> : 
                           <><RefreshCw size={14}/> Ajuste</>}
                        </span>
                      </td>
                      <td className="text-center">{m.quantity}</td>
                      <td className="text-muted">{m.notes || '—'}</td>
                      <td className="text-muted">{new Date(m.createdAt).toLocaleDateString('es')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
