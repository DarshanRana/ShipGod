import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiTruck, HiPhone, HiMail, HiClock, HiCheckCircle, HiRefresh,
  HiLogout, HiUsers, HiDownload, HiDocumentText, HiTrash,
  HiBan, HiCheckCircle as HiCheck, HiSearch, HiX, HiShieldCheck,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const statusColors = {
  new: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: '🆕 New' },
  contacted: { bg: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: '📞 Contacted' },
  in_progress: { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: '⚙️ In Progress' },
  closed: { bg: 'bg-green-50 text-green-700 border-green-200', label: '✅ Closed' },
};

/* ─── PDF generation (client-side) ─── */
function generateOrdersPDF(orders) {
  const printWindow = window.open('', '_blank');
  const rows = orders.map(o => `
    <tr>
      <td>${o.name}</td>
      <td>${o.email}</td>
      <td>${o.phone}</td>
      <td>${o.company || '—'}</td>
      <td>${o.fromCity} → ${o.toCity}</td>
      <td>${o.equipmentType}</td>
      <td>${o.weightTons}</td>
      <td>${o.timeline}</td>
      <td><span class="status status-${o.status}">${o.status.replace('_', ' ')}</span></td>
      <td>${new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ShipGod — Bulk Orders Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; }
        .header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .header h1 { font-size: 24px; color: #002f56; }
        .header .logo { width: 36px; height: 36px; background: #0fa14a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; }
        .subtitle { color: #64748b; font-size: 13px; margin-bottom: 24px; }
        .stats { display: flex; gap: 16px; margin-bottom: 24px; }
        .stat { background: #f1f5f9; border-radius: 8px; padding: 12px 20px; text-align: center; }
        .stat .num { font-size: 20px; font-weight: 800; color: #002f56; }
        .stat .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #002f56; color: white; padding: 10px 8px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        .status { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
        .status-new { background: #dbeafe; color: #1d4ed8; }
        .status-contacted { background: #fef3c7; color: #b45309; }
        .status-in_progress { background: #ede9fe; color: #7c3aed; }
        .status-closed { background: #dcfce7; color: #16a34a; }
        .footer { margin-top: 24px; text-align: center; color: #94a3b8; font-size: 11px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">SG</div>
        <h1>ShipGod — Bulk Orders Report</h1>
      </div>
      <p class="subtitle">Generated on ${new Date().toLocaleString('en-IN')} • ${orders.length} total orders</p>

      <div class="stats">
        <div class="stat"><div class="num">${orders.length}</div><div class="label">Total</div></div>
        <div class="stat"><div class="num">${orders.filter(o => o.status === 'new').length}</div><div class="label">New</div></div>
        <div class="stat"><div class="num">${orders.filter(o => o.status === 'contacted').length}</div><div class="label">Contacted</div></div>
        <div class="stat"><div class="num">${orders.filter(o => o.status === 'closed').length}</div><div class="label">Closed</div></div>
      </div>

      <table>
        <thead><tr>
          <th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Route</th><th>Equipment</th><th>Tons</th><th>Timeline</th><th>Status</th><th>Date</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="footer">ShipGod © ${new Date().getFullYear()} — Confidential</div>

      <script>window.onload = () => { window.print(); }</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/* ─── CSV download helper ─── */
async function downloadCSV() {
  const token = localStorage.getItem('sg_token');
  const res = await fetch(`${API_BASE}/bulk-orders/export/csv`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Export failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shipgod_orders_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}


export default function AdminDashboard({ onBack }) {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [updating, setUpdating] = useState(null);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [togglingUser, setTogglingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const token = localStorage.getItem('sg_token');
  const authHeaders = { Authorization: `Bearer ${token}` };

  /* ─── Orders fetch ─── */
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError('');
    try {
      const res = await fetch(`${API_BASE}/bulk-orders`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');
      setOrders(data);
    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  /* ─── Users fetch ─── */
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await fetch(`${API_BASE}/users`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');
      setUsers(data);
    } catch (err) {
      setUsersError(err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  /* ─── Toggle user active ─── */
  const toggleUserActive = async (id) => {
    setTogglingUser(id);
    try {
      const res = await fetch(`${API_BASE}/users/${id}/toggle-active`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(prev => prev.map(u => u._id === id ? data : u));
    } catch (err) {
      alert(err.message);
    } finally {
      setTogglingUser(null);
    }
  };

  /* ─── Delete user ─── */
  const deleteUser = async (id) => {
    setDeletingUser(id);
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(prev => prev.filter(u => u._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingUser(null);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch(`${API_BASE}/bulk-orders/${id}/status`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(prev => prev.map(o => o._id === id ? data : o));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => { fetchOrders(); }, []);
  useEffect(() => { if (activeTab === 'users' && users.length === 0) fetchUsers(); }, [activeTab]);

  const orderStats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    contacted: orders.filter(o => o.status === 'contacted').length,
    closed: orders.filter(o => o.status === 'closed').length,
  };

  const filteredUsers = users.filter(u =>
    !userSearch ||
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const tabs = [
    { id: 'orders', label: 'Bulk Orders', icon: HiTruck, count: orders.length },
    { id: 'users', label: 'Users', icon: HiUsers, count: users.length },
  ];

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Header */}
      <div className="bg-[#002f56] py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0fa14a]/20 border border-[#0fa14a]/40 text-[#4ade80] text-xs font-bold uppercase tracking-widest mb-3">
              🛡️ Admin Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-white">Admin Control Panel</h1>
            <p className="text-blue-200/70 text-sm mt-1">Logged in as <strong className="text-white">{user?.email}</strong></p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => activeTab === 'orders' ? fetchOrders() : fetchUsers()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all">
              <HiRefresh className={`text-base ${(ordersLoading || usersLoading) ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => { signOut(); onBack(); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-semibold transition-all">
              <HiLogout className="text-base" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mt-6">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/15 text-white border-b-2 border-[#0fa14a]'
                    : 'text-blue-200/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="text-base" />
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-[#0fa14a]/30 text-[#4ade80]' : 'bg-white/10 text-blue-200/60'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════ ORDERS TAB ═══════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Stats */}
            <div className="max-w-6xl mx-auto px-6 pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Requests', value: orderStats.total, color: 'text-[#002f56]', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'New', value: orderStats.new, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'Contacted', value: orderStats.contacted, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' },
                  { label: 'Closed', value: orderStats.closed, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 text-center`}>
                    <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                    <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Export buttons */}
              <div className="flex gap-3 mb-6 flex-wrap">
                <button
                  onClick={async () => { try { await downloadCSV(); } catch { alert('CSV export failed'); } }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                >
                  <HiDownload className="text-base" /> Export CSV
                </button>
                <button
                  onClick={() => generateOrdersPDF(orders)}
                  disabled={orders.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  <HiDocumentText className="text-base" /> Export PDF
                </button>
              </div>
            </div>

            {/* Orders list */}
            <div className="max-w-6xl mx-auto px-6 pb-8">
              {ordersLoading && (
                <div className="text-center py-16">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-10 h-10 border-3 border-[#0077c8]/30 border-t-[#0077c8] rounded-full mx-auto mb-4" />
                  <p style={{ color: 'var(--text-muted)' }}>Loading requests…</p>
                </div>
              )}

              {ordersError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
                  <p className="font-semibold">{ordersError}</p>
                  <button onClick={fetchOrders} className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold">Retry</button>
                </div>
              )}

              {!ordersLoading && !ordersError && orders.length === 0 && (
                <div className="text-center py-16">
                  <HiTruck className="text-6xl mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No requests yet</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Bulk shipment requests will appear here when customers submit the form.</p>
                </div>
              )}

              <div className="space-y-4">
                {orders.map((order, i) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border p-6"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-lg" style={{ color: 'var(--text-primary)' }}>{order.name}</h3>
                          {order.company && <span className="text-sm px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{order.company}</span>}
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[order.status]?.bg}`}>
                            {statusColors[order.status]?.label}
                          </span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>

                      <select
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        disabled={updating === order._id}
                        className="text-sm font-semibold px-3 py-2 rounded-lg border outline-none cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      >
                        <option value="new">🆕 New</option>
                        <option value="contacted">📞 Contacted</option>
                        <option value="in_progress">⚙️ In Progress</option>
                        <option value="closed">✅ Closed</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-page)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Route</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{order.fromCity} → {order.toCity}</p>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-page)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Weight</p>
                        <p className="text-sm font-bold text-red-600">{order.weightTons} Tons</p>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-page)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Equipment</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{order.equipmentType}</p>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-page)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Timeline</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{order.timeline}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a href={`tel:${order.phone}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-[#0fa14a]/10 text-[#0fa14a] border border-[#0fa14a]/20 hover:bg-[#0fa14a]/20 transition-all">
                        <HiPhone /> {order.phone}
                      </a>
                      <a href={`mailto:${order.email}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-[#0077c8] border border-blue-200 hover:bg-blue-100 transition-all">
                        <HiMail /> {order.email}
                      </a>
                      {order.notes && (
                        <div className="flex items-start gap-1.5 px-3 py-2 rounded-lg text-sm border flex-1" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                          📝 {order.notes}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════ USERS TAB ═══════════════════════════════════ */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="max-w-6xl mx-auto px-6 py-6">
              {/* Users stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Users', value: users.length, color: 'text-[#002f56]', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'Active', value: users.filter(u => u.isActive).length, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
                  { label: 'Deactivated', value: users.filter(u => !u.isActive).length, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
                  { label: 'Admins', value: users.filter(u => u.isAdmin).length, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 text-center`}>
                    <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                    <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="flex items-center gap-3 rounded-xl border px-4 py-3 mb-6"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                <HiSearch className="text-[#0077c8] text-lg shrink-0" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="bg-transparent flex-1 text-sm placeholder-slate-400 outline-none font-medium"
                  style={{ color: 'var(--text-primary)' }}
                />
                {userSearch && (
                  <button onClick={() => setUserSearch('')}>
                    <HiX className="text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>

              {usersLoading && (
                <div className="text-center py-16">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-10 h-10 border-3 border-[#0077c8]/30 border-t-[#0077c8] rounded-full mx-auto mb-4" />
                  <p style={{ color: 'var(--text-muted)' }}>Loading users…</p>
                </div>
              )}

              {usersError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
                  <p className="font-semibold">{usersError}</p>
                  <button onClick={fetchUsers} className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold">Retry</button>
                </div>
              )}

              {!usersLoading && !usersError && users.length === 0 && (
                <div className="text-center py-16">
                  <HiUsers className="text-6xl mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No users yet</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Registered users will appear here.</p>
                </div>
              )}

              {/* Users table */}
              {!usersLoading && !usersError && filteredUsers.length > 0 && (
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                  {/* Table header */}
                  <div className="hidden md:grid grid-cols-[1fr_1.5fr_0.8fr_0.8fr_1fr] bg-[#002f56] text-white text-xs font-bold uppercase tracking-wider px-6 py-3">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Status</span>
                    <span>Role</span>
                    <span className="text-right">Actions</span>
                  </div>

                  {/* Table rows */}
                  {filteredUsers.map((u, i) => (
                    <motion.div
                      key={u._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`grid grid-cols-1 md:grid-cols-[1fr_1.5fr_0.8fr_0.8fr_1fr] items-center px-6 py-4 border-b gap-2 md:gap-0 ${
                        !u.isActive ? 'opacity-60' : ''
                      }`}
                      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
                    >
                      {/* Name */}
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                        <p className="text-xs md:hidden" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                      </div>

                      {/* Email */}
                      <p className="text-sm hidden md:block" style={{ color: 'var(--text-secondary)' }}>{u.email}</p>

                      {/* Status */}
                      <div>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                          u.isActive
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {u.isActive ? '✅ Active' : '🚫 Inactive'}
                        </span>
                      </div>

                      {/* Role */}
                      <div>
                        {u.isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            <HiShieldCheck className="text-sm" /> Admin
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            User
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 justify-start md:justify-end">
                        <p className="text-xs mr-auto md:mr-2" style={{ color: 'var(--text-muted)' }}>
                          Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        {!u.isAdmin && (
                          <>
                            <button
                              onClick={() => toggleUserActive(u._id)}
                              disabled={togglingUser === u._id}
                              title={u.isActive ? 'Deactivate user' : 'Activate user'}
                              className={`p-2 rounded-lg text-sm font-semibold transition-all ${
                                u.isActive
                                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                                  : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                              } ${togglingUser === u._id ? 'opacity-50' : ''}`}
                            >
                              {u.isActive ? <HiBan className="text-base" /> : <HiCheckCircle className="text-base" />}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(u._id)}
                              disabled={deletingUser === u._id}
                              title="Delete user permanently"
                              className={`p-2 rounded-lg text-sm font-semibold transition-all bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 ${
                                deletingUser === u._id ? 'opacity-50' : ''
                              }`}
                            >
                              <HiTrash className="text-base" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Footer */}
                  <div className="px-6 py-3 text-xs font-semibold" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-muted)' }}>
                    Showing {filteredUsers.length} of {users.length} users
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="rounded-2xl border p-8 max-w-md w-full shadow-2xl"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <HiTrash className="text-3xl text-red-600" />
                </div>
                <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Delete User?</h3>
                <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                  This will permanently remove the user:
                </p>
                <p className="font-bold text-sm mb-6" style={{ color: 'var(--text-primary)' }}>
                  {users.find(u => u._id === confirmDelete)?.email}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold border transition-all hover:bg-slate-50"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(confirmDelete)}
                    disabled={deletingUser === confirmDelete}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {deletingUser === confirmDelete ? 'Deleting…' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
