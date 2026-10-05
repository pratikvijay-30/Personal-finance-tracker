import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth, useFinance } from "../../context/hooks";
import { formatCurrency } from "../../utils/format";
import ThemeSwitch from "../ui/ThemeSwitch";
import TransactionForm from "../transactions/TransactionForm";
import WelcomeAnimation from "../ui/WelcomeAnimation";

const links = [
  { to: "/dashboard", label: "Overview", icon: "⌂" },
  { to: "/incomes", label: "Incomes", icon: "↗" },
  { to: "/transactions", label: "Transactions", icon: "⇄" },
  { to: "/analysis", label: "Analysis", icon: "◔" },
];

const titles = { "/dashboard": "Overview", "/incomes": "Incomes", "/transactions": "Transactions", "/analysis": "Analysis" };

export function AppLayout() {
  const { user, logout } = useAuth();
  const { data } = useFinance();
  const [showAdd, setShowAdd] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const balance = data.transactions.reduce((total, item) => total + (item.type === "income" ? item.amount : -item.amount), 0);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/dashboard" className="brand"><span className="brand-mark">p.</span><span>pocketwise</span></NavLink>
        <span className="nav-caption">YOUR SPACE</span>
        <nav className="side-nav" aria-label="Main navigation">
          {links.map(({ to, label, icon }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}><span className="nav-icon">{icon}</span>{label}</NavLink>)}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-balance"><span>Available balance</span><strong>{formatCurrency(balance)}</strong><small>Looking steady this month <span>↗</span></small></div>
        <p className="sidebar-footnote">A little more clarity, every day.</p>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="page-heading"><span className="eyebrow">YOUR MONEY, IN FOCUS</span><h1>{titles[location.pathname]}</h1></div>
          <div className="topbar-actions">
            <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search transactions" placeholder="Search anything..." onChange={(event) => window.dispatchEvent(new CustomEvent("finance-search", { detail: event.target.value }))} /><kbd>⌘ K</kbd></label>
            <ThemeSwitch />
            <button className="button button-primary top-add" onClick={() => setShowAdd(true)}><span>＋</span> Add</button>
            <div className="user-menu-wrap">
              <button className="user-menu" aria-expanded={menuOpen} aria-label="Open profile menu" onClick={() => setMenuOpen(!menuOpen)}><span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span><span className="user-name">{user.name.split(" ")[0]}</span><span className="chevron">⌄</span></button>
              {menuOpen && <div className="user-dropdown"><strong>{user.name}</strong><small>{user.email}</small><button onClick={() => { setMenuOpen(false); navigate("/dashboard"); }}>Profile</button><button onClick={() => { logout(); navigate("/"); }}>Log out</button></div>}
            </div>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
      </div>
      {showAdd && <TransactionForm onClose={() => setShowAdd(false)} />}
      <nav className="mobile-tabs" aria-label="Mobile navigation">
        {links.map(({ to, label, icon }) => <NavLink key={to} to={to} className={({ isActive }) => `mobile-tab${isActive ? " active" : ""}`}><span>{icon}</span>{label}</NavLink>)}
      </nav>
      {location.state?.showWelcome && <WelcomeAnimation name={user.name.split(" ")[0]} onComplete={() => navigate(location.pathname, { replace: true, state: null })} />}
    </div>
  );
}
