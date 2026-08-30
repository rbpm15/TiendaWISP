import { useState, useEffect } from 'react';
import type { Product } from '../types/index.js';
import { getProducts, createProduct, updateProduct, deleteProduct, recordStockMovement } from '../services/api.js';

import { 
  Antenna, Router, Plug, Wrench, Link2, Zap, Wifi, Signal, 
  ArrowDownToLine, ArrowUpFromLine, Pencil, Trash2, PackageSearch, Plus, Search, X
} from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'Todas', icon: null },
  { value: 'antenna', label: 'Antenas', icon: Antenna },
  { value: 'router', label: 'Routers', icon: Router },
  { value: 'switch', label: 'Switches', icon: Plug },
  { value: 'accessory', label: 'Accesorios', icon: Wrench },
  { value: 'cable', label: 'Cables', icon: Link2 },
  { value: 'poe', label: 'PoE', icon: Zap },
];

const EMPTY_PRODUCT: Partial<Product> = {
  sku: '', name: '', brand: '', category: 'antenna', description: '',
  frequency: '', gainDbi: null, maxDistanceKm: null, throughput: '',
  poeType: '', linkType: '', useCase: '',
  quantity: 0, minStock: 5, costPrice: 0, sellPrice: 0,
};

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({ ...EMPTY_PRODUCT });
  const [stockModal, setStockModal] = useState<{ product: Product; type: 'in' | 'out' } | null>(null);
  const [stockQty, setStockQty] = useState(1);
  const [stockNotes, setStockNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (catFilter) params.category = catFilter;
      const res = await getProducts(params);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [catFilter, search]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadProducts();
  }

  function openNewForm() {
    setEditingProduct(null);
    setFormData({ ...EMPTY_PRODUCT });
    setShowForm(true);
  }

  function openEditForm(p: Product) {
    setEditingProduct(p);
    setFormData({ ...p });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ ...EMPTY_PRODUCT });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      closeForm();
      await loadProducts();
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Desactivar este producto?')) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleStockMovement(e: React.FormEvent) {
    e.preventDefault();
    if (!stockModal) return;
    setSaving(true);
    try {
      await recordStockMovement({
        productId: stockModal.product.id,
        type: stockModal.type,
        quantity: stockQty,
        notes: stockNotes,
      });
      setStockModal(null);
      setStockQty(1);
      setStockNotes('');
      await loadProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: string, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="inventory">
      <div className="page-header">
        <div>
          <span className="eyebrow">Gestión de stock</span>
          <h1>Inventario</h1>
        </div>
        <button className="btn btn--primary" onClick={openNewForm}>
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      {/* Filters */}
      <div className="inv-filters">
        <form className="inv-search" onSubmit={handleSearch}>
          <input
            type="search"
            autoFocus
            placeholder="Buscar por nombre, SKU, marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn--sm"><Search size={16} /></button>
        </form>
        <div className="inv-cats">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.value}
                className={`cat-chip ${catFilter === c.value ? 'cat-chip--active' : ''}`}
                onClick={() => setCatFilter(c.value)}
              >
                {Icon && <Icon size={16} className="cat-chip-icon" style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product table */}
      {loading ? (
        <div className="page-loader">
          <div className="loader-pulse" />
          <span>Cargando inventario...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <PackageSearch size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p>No hay productos{search ? ` para "${search}"` : ''}</p>
        </div>
      ) : (
        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Specs</th>
                <th>Stock</th>
                <th>Precios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isLow = p.quantity <= p.minStock;
                const isOut = p.quantity === 0;
                return (
                  <tr key={p.id} className={isOut ? 'row--danger' : isLow ? 'row--warn' : ''}>
                    <td>
                      <strong>{p.name}</strong>
                      <span className="text-muted">{p.brand} · {p.sku}</span>
                    </td>
                    <td>
                      <span className="cat-badge">
                        {CATEGORIES.find(c => c.value === p.category)?.icon && (() => {
                          const Icon = CATEGORIES.find(c => c.value === p.category)!.icon!;
                          return <Icon size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />;
                        })()}
                        {CATEGORIES.find(c => c.value === p.category)?.label || p.category}
                      </span>
                    </td>
                    <td>
                      <div className="specs-cell">
                        {p.frequency && <span><Wifi size={14} /> {p.frequency}</span>}
                        {p.gainDbi && <span><Signal size={14} /> {p.gainDbi} dBi</span>}
                        {p.maxDistanceKm && <span><Link2 size={14} /> {p.maxDistanceKm} km</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`stock-badge ${isOut ? 'stock-badge--out' : isLow ? 'stock-badge--low' : 'stock-badge--ok'}`}>
                        {p.quantity} uds
                      </span>
                      <span className="text-muted text-xs">mín: {p.minStock}</span>
                    </td>
                    <td>
                      <span className="price-cost">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p.costPrice)}</span>
                      <span className="price-sell">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p.sellPrice)}</span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn--xs btn--green" title="Entrada" onClick={() => { setStockModal({ product: p, type: 'in' }); setStockQty(1); setStockNotes(''); }}><ArrowDownToLine size={14} /></button>
                        <button className="btn btn--xs btn--amber" title="Salida" onClick={() => { setStockModal({ product: p, type: 'out' }); setStockQty(1); setStockNotes(''); }}><ArrowUpFromLine size={14} /></button>
                        <button className="btn btn--xs btn--blue" title="Editar" onClick={() => openEditForm(p)}><Pencil size={14} /></button>
                        <button className="btn btn--xs btn--red" title="Eliminar" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Product form modal */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button className="modal__close" onClick={closeForm}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>SKU *</label>
                  <input required value={formData.sku || ''} onChange={(e) => updateField('sku', e.target.value)} placeholder="UBQ-LBE-5AC" />
                </div>
                <div className="form-group">
                  <label>Nombre *</label>
                  <input required value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} placeholder="LiteBeam 5AC Gen2" />
                </div>
                <div className="form-group">
                  <label>Marca *</label>
                  <input required value={formData.brand || ''} onChange={(e) => updateField('brand', e.target.value)} placeholder="Ubiquiti" />
                </div>
                <div className="form-group">
                  <label>Categoría *</label>
                  <select value={formData.category || 'antenna'} onChange={(e) => updateField('category', e.target.value)}>
                    {CATEGORIES.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group form-group--full">
                  <label>Descripción</label>
                  <textarea rows={2} value={formData.description || ''} onChange={(e) => updateField('description', e.target.value)} />
                </div>

                {['antenna', 'router', 'switch', 'poe'].includes(formData.category || '') && (
                  <div className="form-divider">Especificaciones técnicas</div>
                )}
                {['antenna', 'router'].includes(formData.category || '') && (
                  <div className="form-group">
                    <label>Frecuencia</label>
                    <input value={formData.frequency || ''} onChange={(e) => updateField('frequency', e.target.value)} placeholder="5 GHz" />
                  </div>
                )}
                {formData.category === 'antenna' && (
                  <>
                    <div className="form-group">
                      <label>Ganancia (dBi)</label>
                      <input type="number" step="0.1" value={formData.gainDbi ?? ''} onChange={(e) => updateField('gainDbi', e.target.value ? parseFloat(e.target.value) : null)} />
                    </div>
                    <div className="form-group">
                      <label>Distancia máx (km)</label>
                      <input type="number" step="0.1" value={formData.maxDistanceKm ?? ''} onChange={(e) => updateField('maxDistanceKm', e.target.value ? parseFloat(e.target.value) : null)} />
                    </div>
                  </>
                )}
                {['antenna', 'router', 'switch'].includes(formData.category || '') && (
                  <div className="form-group">
                    <label>Throughput</label>
                    <input value={formData.throughput || ''} onChange={(e) => updateField('throughput', e.target.value)} placeholder="450+ Mbps" />
                  </div>
                )}
                {['antenna', 'poe', 'switch'].includes(formData.category || '') && (
                  <div className="form-group">
                    <label>Tipo PoE</label>
                    <input value={formData.poeType || ''} onChange={(e) => updateField('poeType', e.target.value)} placeholder="24V Passive" />
                  </div>
                )}
                {formData.category === 'antenna' && (
                  <div className="form-group">
                    <label>Tipo de enlace</label>
                    <select value={formData.linkType || ''} onChange={(e) => updateField('linkType', e.target.value)}>
                      <option value="">N/A</option>
                      <option value="PtP">PtP</option>
                      <option value="PtMP">PtMP</option>
                      <option value="Backhaul">Backhaul</option>
                      <option value="CPE">CPE</option>
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label>Caso de uso</label>
                  <select value={formData.useCase || ''} onChange={(e) => updateField('useCase', e.target.value)}>
                    <option value="">General</option>
                    <option value="enlace">Enlace</option>
                    <option value="cliente">Cliente</option>
                    <option value="infraestructura">Infraestructura</option>
                  </select>
                </div>

                <div className="form-divider">Stock y precios</div>
                <div className="form-group">
                  <label>Cantidad</label>
                  <input type="number" min="0" value={formData.quantity ?? 0} onChange={(e) => updateField('quantity', parseInt(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label>Stock mínimo</label>
                  <input type="number" min="0" value={formData.minStock ?? 5} onChange={(e) => updateField('minStock', parseInt(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label>Precio costo ($)</label>
                  <input type="number" min="0" step="0.01" value={formData.costPrice ?? 0} onChange={(e) => updateField('costPrice', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label>Precio venta ($)</label>
                  <input type="number" min="0" step="0.01" value={formData.sellPrice ?? 0} onChange={(e) => updateField('sellPrice', parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={closeForm}>Cancelar</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock movement modal */}
      {stockModal && (
        <div className="modal-overlay" onClick={() => setStockModal(null)}>
          <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {stockModal.type === 'in' ? <ArrowDownToLine size={20} /> : <ArrowUpFromLine size={20} />} 
                {stockModal.type === 'in' ? 'Entrada de stock' : 'Salida de stock'}
              </h2>
              <button className="modal__close" onClick={() => setStockModal(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleStockMovement} className="stock-form">
              <p className="stock-form__product">
                <strong>{stockModal.product.name}</strong>
                <span>Stock actual: {stockModal.product.quantity} uds</span>
              </p>
              <div className="form-group">
                <label>Cantidad</label>
                <input type="number" min="1" value={stockQty} onChange={(e) => setStockQty(parseInt(e.target.value) || 1)} required />
              </div>
              <div className="form-group">
                <label>Notas</label>
                <input value={stockNotes} onChange={(e) => setStockNotes(e.target.value)} placeholder="Ej: Compra proveedor, instalación cliente..." />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={() => setStockModal(null)}>Cancelar</button>
                <button type="submit" className={`btn ${stockModal.type === 'in' ? 'btn--green' : 'btn--amber'}`} disabled={saving}>
                  {saving ? 'Registrando...' : stockModal.type === 'in' ? 'Registrar entrada' : 'Registrar salida'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
