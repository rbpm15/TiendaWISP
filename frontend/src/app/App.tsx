import { useState } from 'react';
import { DashboardPage } from '../pages/DashboardPage.js';
import { AIChatPage } from '../pages/AIChatPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { ClientsPage } from '../pages/ClientsPage.js';
import { LayoutDashboard, Bot, Package, Users } from 'lucide-react';

type Page = 'dashboard' | 'chat' | 'inventory' | 'clients';

const NAV_ITEMS = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'clients',   label: 'Clientes',  icon: Users },
  { page: 'inventory', label: 'Inventario', icon: Package },
  { page: 'chat',      label: 'Chat IA',   icon: Bot },
] as const;

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-block__mark">TW</div>
          <div>
            <strong>TiendaWisp</strong>
            <span>Catálogo de stock · Telecomunicaciones</span>
          </div>
        </div>

        <nav className="topbar__nav" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                className={`nav-btn ${currentPage === item.page ? 'nav-btn--active' : ''}`}
                onClick={() => setCurrentPage(item.page)}
              >
                <span className="nav-btn__icon"><Icon size={20} /></span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="main-content">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'clients'   && <ClientsPage />}
        {currentPage === 'chat'      && <AIChatPage />}
        {currentPage === 'inventory' && <InventoryPage />}
      </main>
    </div>
  );
}

