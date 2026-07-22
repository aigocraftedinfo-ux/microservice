import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Package, Users, ShoppingBag, CreditCard, Bell, RefreshCw, Plus, Trash2, Edit, CheckCircle, AlertTriangle, Play } from 'lucide-react';
import { gatewayApi, productApi, orderApi, userApi, paymentApi, notificationApi } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'health' | 'products' | 'users' | 'orders' | 'payments' | 'notifications'>('health');

  // Health Metrics
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [pingStatus, setPingStatus] = useState<Record<string, string>>({});

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 99.99,
    originalPrice: 129.99,
    category: 'Electronics',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    isFeatured: true,
    isDeal: false,
  });

  // Users, Orders, Payments, Notifications states
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadHealth = async () => {
    try {
      setLoadingHealth(true);
      const res = await gatewayApi.getDashboard();
      setDashboardData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHealth(false);
    }
  };

  const loadProducts = async () => {
    const res = await productApi.getProducts();
    if (res.data.success) setProducts(res.data.data);
  };

  const loadUsers = async () => {
    const res = await userApi.getAllUsers();
    if (res.data.success) setUsers(res.data.data);
  };

  const loadOrders = async () => {
    const res = await orderApi.getAllOrders();
    if (res.data.success) setOrders(res.data.data);
  };

  const loadPayments = async () => {
    const res = await paymentApi.getHistory();
    if (res.data.success) setPayments(res.data.data);
  };

  const loadNotifications = async () => {
    const res = await notificationApi.getLogs();
    if (res.data.success) setNotifications(res.data.data);
  };

  useEffect(() => {
    loadHealth();
    loadProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'payments') loadPayments();
    if (activeTab === 'notifications') loadNotifications();
  }, [activeTab]);

  const handlePing = async (serviceName: string) => {
    setPingStatus((prev) => ({ ...prev, [serviceName]: 'Pinging...' }));
    try {
      const res = await gatewayApi.pingService(serviceName);
      const data = res.data.data;
      setPingStatus((prev) => ({
        ...prev,
        [serviceName]: `${data.status} (${data.responseTimeMs}ms)`,
      }));
      loadHealth();
    } catch (err) {
      setPingStatus((prev) => ({ ...prev, [serviceName]: 'DOWN' }));
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await productApi.addProduct(newProduct);
      if (res.data.success) {
        setShowAddProductModal(false);
        loadProducts();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Delete this product from catalog?')) {
      await productApi.deleteProduct(id);
      loadProducts();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update order status');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Microservices Admin Control Center</h1>
              <p className="text-xs text-gray-400">
                Live Monitoring & Management for Amazon Microservice Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadHealth}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} /> Refresh Cluster Metrics
            </button>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Gateway Port 3000
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('health')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'health' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity className="w-4 h-4 text-[#febd69]" /> Service Health & Cluster Monitor
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'products' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Package className="w-4 h-4 text-[#febd69]" /> Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'users' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 text-[#febd69]" /> System Users
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'orders' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#febd69]" /> Orders Management
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'payments' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#febd69]" /> Payment Transactions
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'notifications' ? 'bg-[#131921] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-4 h-4 text-[#febd69]" /> Event Notification Logs
          </button>
        </div>

        {/* TAB 1: SERVICE HEALTH & CLUSTER MONITOR */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            {/* Cluster Status Summary Banner */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">System Status</span>
                <div className="text-xl font-black text-gray-900 flex items-center gap-2 mt-1">
                  Cluster State:
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-extrabold ${
                      dashboardData?.clusterStatus === 'HEALTHY'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {dashboardData?.clusterStatus || 'HEALTHY'}
                  </span>
                </div>
              </div>

              <div className="text-right text-xs text-gray-500">
                Last checked: <span className="font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Microservice Health Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData?.services?.map((svc: any) => (
                <div key={svc.service} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 capitalize text-sm">{svc.service}-service</h3>
                      <span className="text-[11px] font-mono text-gray-500">{svc.url}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        svc.status === 'UP'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {svc.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Response Latency:</span>
                      <span className="font-mono font-bold text-gray-900">{svc.responseTimeMs} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Architecture Isolation:</span>
                      <span className="font-semibold text-emerald-700">Independent Process</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePing(svc.service)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3 h-3 text-[#febd69]" /> Execute REST Ping
                  </button>

                  {pingStatus[svc.service] && (
                    <p className="text-[11px] text-center font-mono font-bold text-indigo-600">
                      Ping Result: {pingStatus[svc.service]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* List of Available Microservice APIs */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
                Exposed Microservice REST Endpoints
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Microservice</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Endpoint</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dashboardData?.availableAPIs?.map((api: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3 font-bold text-gray-900">{api.service}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-extrabold text-[10px] ${
                              api.method === 'GET'
                                ? 'bg-blue-100 text-blue-800'
                                : api.method === 'POST'
                                ? 'bg-emerald-100 text-emerald-800'
                                : api.method === 'PUT'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {api.method}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-gray-800">{api.endpoint}</td>
                        <td className="p-3 text-gray-600">{api.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Product Service Catalog</h2>
                <p className="text-xs text-gray-500">Add, edit or remove products directly from Product Service memory.</p>
              </div>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            {/* Modal for adding product */}
            {showAddProductModal && (
              <div className="bg-white p-6 rounded-xl border-2 border-[#febd69] shadow-lg space-y-4">
                <h3 className="font-bold text-base text-gray-900">Add New Product to Microservice Catalog</h3>
                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) })}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                      rows={2}
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-3">
                    <button
                      type="submit"
                      className="bg-gray-900 text-white font-bold px-6 py-2 rounded-lg cursor-pointer"
                    >
                      Save Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddProductModal(false)}
                      className="bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.imageUrl} alt="" className="w-10 h-10 object-contain bg-gray-50 p-1 rounded" />
                        <span className="font-bold text-gray-900 line-clamp-1">{p.title}</span>
                      </td>
                      <td className="p-3 text-gray-600">{p.category}</td>
                      <td className="p-3 font-bold text-gray-900">${p.price.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`font-bold ${p.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM USERS */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Registered Users</h2>
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-gray-600">{u.id}</td>
                    <td className="p-3 font-bold text-gray-900">{u.name}</td>
                    <td className="p-3 text-gray-600">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{u.phone || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">All Platform Orders</h2>
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-gray-900 font-bold">{o.id}</td>
                    <td className="p-3 font-mono text-gray-600">{o.userId}</td>
                    <td className="p-3 font-extrabold text-gray-900">${o.totalAmount.toFixed(2)}</td>
                    <td className="p-3 text-gray-700">{o.paymentDetails?.paymentMethod}</td>
                    <td className="p-3">
                      <span className="font-bold uppercase text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded p-1 text-xs outline-none cursor-pointer font-semibold"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Payment Transactions History</h2>
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-emerald-600 font-bold">{p.transactionId}</td>
                    <td className="p-3 font-mono text-gray-700">{p.orderId}</td>
                    <td className="p-3 font-extrabold text-gray-900">${p.amount.toFixed(2)}</td>
                    <td className="p-3 font-bold text-gray-800">{p.paymentMethod}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 font-mono text-[11px]">
                      {new Date(p.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: NOTIFICATION LOGS */}
        {activeTab === 'notifications' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Event Notification Audit Logs</h2>
            <div className="space-y-2">
              {notifications.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between text-xs">
                  <div>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px] mr-2">
                      {log.eventType}
                    </span>
                    <span className="text-gray-800 font-medium">{log.message}</span>
                  </div>
                  <span className="text-gray-400 font-mono text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
