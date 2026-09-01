import { useState, useEffect } from 'react';
import type { Customer, Product } from '../types/index.js';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api.js';
import { getProducts } from '../services/api.js';
import {
  Users, Plus, Search, MapPin, Phone, Mail, DollarSign,
  Calendar, Wifi, Edit2, Trash2, X, Check, AlertCircle,
  User, ChevronDown, ChevronUp
} from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  active:    { label: 'Activo',     class: 'status-pill--ok' },
  suspended: { label: 'Suspendido', class: 'status-pill--warn' },
  cancelled: { label: 'Cancelado',  class: 'status-pill--out' },
};

const DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => i + 1);

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  latitude: string;
  longitude: string;
  monthlyFee: string;
  paymentDay: string;
  status: 'active' | 'suspended' | 'cancelled';
  notes: string;
  equipmentIds: number[];
}

const EMPTY_FORM: CustomerFormData = {
  name: '', phone: '', email: '', address: '',
  latitude: '', longitude: '',
  monthlyFee: '', paymentDay: '1',
  status: 'active', notes: '', equipmentIds: [],
};

export function ClientsPage() {
  const [customers, setCustomers]   = useState<Customer[]>([]);
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [form, setForm]             = useState<CustomerFormData>(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => { loadAll(); }, [search, statusFilter]);
  useEffect(() => { getProducts().then(r => setProducts(r.data)).catch(() => {}); }, []);

  async function loadAll() {
    try {
      setLoading(true);
      const res = await getCustomers({ search, ...(statusFilter ? { status: statusFilter } : {}) } as any);
      setCustomers(res.data);
    } catch { setError('Error al cargar clientes'); }
    finally { setLoading(false); }
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function openEdit(c: Customer) {
    setForm({
      name: c.name,
      phone: c.phone ?? '',
      email: c.email ?? '',
      address: c.address ?? '',
      latitude: c.latitude?.toString() ?? '',
      longitude: c.longitude?.toString() ?? '',
      monthlyFee: c.monthlyFee.toString(),
      paymentDay: c.paymentDay.toString(),
      status: c.status,
      notes: c.notes,
      equipmentIds: JSON.parse(c.equipmentIds || '[]'),
    });
    setEditingId(c.id);
    setShowForm(true);
    setError('');
  }

  function closeForm() { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }

  function toggleEquipment(id: number) {
    setForm(f => ({
      ...f,
      equipmentIds: f.equipmentIds.includes(id)
        ? f.equipmentIds.filter(e => e !== id)
        : [...f.equipmentIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        address: form.address.trim() || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        monthlyFee: parseFloat(form.monthlyFee) || 0,
        paymentDay: parseInt(form.paymentDay) || 1,
        status: form.status,
        notes: form.notes.trim(),
        equipmentIds: form.equipmentIds,
      } as any;
      if (editingId) {
        await updateCustomer(editingId, payload);
      } else {
        await createCustomer(payload);
      }
      closeForm();
      loadAll();
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este cliente?')) return;
    setDeletingId(id);
    try {
      await deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch { setError('Error al eliminar'); }
    finally { setDeletingId(null); }
  }

  const getEquipmentNames = (ids: number[]) =>
    ids.map(id => products.find(p => p.id === id)?.name ?? `ID ${id}`).join(', ');

  return (
    <div className="clients-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <span className="eyebrow">Gestión de clientes</span>
          <h1>Clientes ISP</h1>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> Nuevo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="clients-filters">
        <div className="search-field">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="suspended">Suspendidos</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      {/* Error banner */}
      {error && !showForm && (
        <div className="error-banner"><AlertCircle size={16} />{error}</div>
      )}

      {/* Customer list */}
      {loading ? (
        <div className="page-loader"><div className="loader-pulse" /><span>Cargando clientes...</span></div>
      ) : customers.length === 0 ? (
        <div className="empty-state clients-empty">
          <Users size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p>No hay clientes registrados</p>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={openCreate}>
            <Plus size={16} /> Registrar primer cliente
          </button>
        </div>
      ) : (
        <div className="clients-grid">
          {customers.map(c => {
            const eqIds: number[] = JSON.parse(c.equipmentIds || '[]');
            const isExpanded = expandedId === c.id;
            const s = STATUS_LABELS[c.status] ?? STATUS_LABELS['active']!
            return (
              <article key={c.id} className={`client-card client-card--${c.status}`}>
                <div className="client-card__header">
                  <div className="client-avatar"><User size={20} /></div>
                  <div className="client-info">
                    <strong className="client-name">{c.name}</strong>
                    {c.phone && <span className="client-sub"><Phone size={12} />{c.phone}</span>}
                    {c.email && <span className="client-sub"><Mail size={12} />{c.email}</span>}
                  </div>
                  <span className={`status-pill ${s.class}`}>{s.label}</span>
                </div>

                <div className="client-card__body">
                  <div className="client-stat">
                    <DollarSign size={14} />
                    <span><strong>${c.monthlyFee.toFixed(2)}</strong>/mes</span>
                  </div>
                  <div className="client-stat">
                    <Calendar size={14} />
                    <span>Día <strong>{c.paymentDay}</strong> de pago</span>
                  </div>
                  {c.address && (
                    <div className="client-stat">
                      <MapPin size={14} />
                      <span>{c.address}</span>
                    </div>
                  )}
                  {eqIds.length > 0 && (
                    <div className="client-stat">
                      <Wifi size={14} />
                      <span>{getEquipmentNames(eqIds)}</span>
                    </div>
                  )}
                </div>

                {(c.notes || (c.latitude && c.longitude)) && (
                  <button className="client-expand-btn" onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                    {isExpanded ? <><ChevronUp size={14} /> Menos</> : <><ChevronDown size={14} /> Más detalles</>}
                  </button>
                )}

                {isExpanded && (
                  <div className="client-card__details">
                    {c.latitude && c.longitude && (
                      <p className="client-coords"><MapPin size={12} />GPS: {c.latitude.toFixed(6)}, {c.longitude.toFixed(6)}</p>
                    )}
                    {c.notes && <p className="client-notes">{c.notes}</p>}
                  </div>
                )}

                <div className="client-card__actions">
                  <button className="icon-btn icon-btn--edit" onClick={() => openEdit(c)}><Edit2 size={16} /></button>
                  <button
                    className="icon-btn icon-btn--danger"
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeForm()}>
          <div className="modal clients-modal">
            <div className="modal__header">
              <h2>{editingId ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <button className="icon-btn" onClick={closeForm}><X size={20} /></button>
            </div>

            <form className="modal__body clients-form" onSubmit={handleSubmit}>
              {error && <div className="form-error"><AlertCircle size={14} />{error}</div>}

              <fieldset>
                <legend>Datos personales</legend>
                <div className="form-row">
                  <div className="form-group form-group--required">
                    <label>Nombre completo</label>
                    <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Ej. Juan Pérez" />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+502 5555-0000" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Correo electrónico</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="cliente@email.com" />
                </div>
              </fieldset>

              <fieldset>
                <legend>Información de pago</legend>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mensualidad (USD)</label>
                    <input type="number" min="0" step="0.01" value={form.monthlyFee} onChange={e => setForm(f => ({...f, monthlyFee: e.target.value}))} placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label>Día de pago del mes</label>
                    <select value={form.paymentDay} onChange={e => setForm(f => ({...f, paymentDay: e.target.value}))}>
                      {DAY_OPTIONS.map(d => <option key={d} value={d}>Día {d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as any}))}>
                      <option value="active">Activo</option>
                      <option value="suspended">Suspendido</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Ubicación</legend>
                <div className="form-group">
                  <label>Dirección</label>
                  <input value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} placeholder="Col. Las Flores, calle 3-A" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Latitud GPS</label>
                    <input type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({...f, latitude: e.target.value}))} placeholder="15.783456" />
                  </div>
                  <div className="form-group">
                    <label>Longitud GPS</label>
                    <input type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({...f, longitude: e.target.value}))} placeholder="-90.231456" />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Equipo utilizado</legend>
                <p className="fieldset-hint">Selecciona los equipos instalados en este cliente</p>
                <div className="equipment-picker">
                  {products.filter(p => p.isActive).map(p => {
                    const selected = form.equipmentIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`equip-chip ${selected ? 'equip-chip--selected' : ''}`}
                        onClick={() => toggleEquipment(p.id)}
                      >
                        {selected && <Check size={12} />}
                        <span>{p.name}</span>
                        <small>{p.sku}</small>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend>Notas adicionales</legend>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                  placeholder="Observaciones, detalles de instalación, etc."
                  rows={3}
                />
              </fieldset>

              <div className="modal__footer">
                <button type="button" className="btn-secondary" onClick={closeForm}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Registrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
