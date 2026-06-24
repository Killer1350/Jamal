/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Lock,
  X,
  Plus,
  Trash2,
  Check,
  TrendingUp,
  Clock,
  MapPin,
  ShoppingBag,
  ChevronRight,
  Database,
  Grid,
  Edit2,
  DollarSign,
  Undo2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { MenuItem, CATEGORIES, CATEGORY_PLACEHOLDERS } from "../types";
import { formatNaira } from "./CartModal";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: "delivery" | "pickup";
  address: string;
  pickupTime?: string | null;
  items: Array<{ id: number; name: string; quantity: number; price: number; variant?: string }>;
  totalAmount: number;
  paystackRef: string;
  status: "Received" | "Preparing" | "Packaging" | "Out for Delivery" | "Ready for Pickup" | "Completed" | "Cancelled";
  createdAt: string;
}

interface AdminDashboardProps {
  onClose: () => void;
  menuItems: MenuItem[];
  onRefreshMenu: () => void;
}

export default function AdminDashboard({ onClose, menuItems, onRefreshMenu }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "menu">("orders");

  // Selection filters
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Edit/add state
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> & { id?: number }>({});
  const [customTagsText, setCustomTagsText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jamal_admin_token");
    if (token) {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await resp.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("jamal_admin_token", data.token);
        setLoginError("");
        fetchOrders();
      } else {
        setLoginError("Incorrect admin passcode. Try again.");
      }
    } catch {
      setLoginError("Unable to login. Connection lost.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jamal_admin_token");
    setIsAuthenticated(false);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const resp = await fetch("/api/orders");
      const data = await resp.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const resp = await fetch(`/api/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (resp.ok) {
        // Optimistically update
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (err) {
      console.error("Status update failed");
    }
  };

  const startEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setCustomTagsText(item.tags.join(", "));
    setIsEditingItem(true);
  };

  const startAddNewItem = () => {
    setEditingItem({
      name: "",
      category: "Platters",
      price: 5000,
      description: "",
      variant: "",
      tags: [],
    });
    setCustomTagsText("Popular, Quick Pick");
    setIsEditingItem(true);
  };

  const saveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = customTagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const itemPayload = {
        ...editingItem,
        tags,
      };

      const resp = await fetch("/api/menu/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemPayload),
      });

      if (resp.ok) {
        onRefreshMenu();
        setIsEditingItem(false);
        setEditingItem({});
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const deleteMenuItem = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const resp = await fetch("/api/menu/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId }),
      });
      if (resp.ok) {
        onRefreshMenu();
      }
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const resetToFactoryMenu = async () => {
    if (!confirm("Caution: This will restore the classic initial menu, overwriting any custom images/prices edits. Continue?")) return;
    try {
      const resp = await fetch("/api/menu/reset", {
        method: "POST",
      });
      if (resp.ok) {
        onRefreshMenu();
      }
    } catch (err) {
      console.error("Reset failed");
    }
  };

  // Stats calculation
  const totalIncomingEarnings = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingDeliveries = orders.filter(
    (o) => o.orderType === "delivery" && ["Received", "Preparing", "Packaging", "Out for Delivery"].includes(o.status)
  ).length;

  const pendingPickups = orders.filter(
    (o) => o.orderType === "pickup" && ["Received", "Preparing", "Packaging", "Ready for Pickup"].includes(o.status)
  ).length;

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === "All") return true;
    return o.status === orderStatusFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF9F6] overflow-y-auto flex flex-col">
      
      {/* Top Header Panel */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#F5F2ED] border-b border-[#EAE7E1] px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#5A5A40]" />
          <h1 className="font-cinzel text-base md:text-lg font-bold text-[#2C2C24]">
            Jamal's Grill Control Center
          </h1>
          {isAuthenticated && (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#5A5A40]/10 text-[#5A5A40] font-bold">
              AUTHORIZED HIERARCHY
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-xs text-[#8A8A7A] hover:text-[#2C2C24] transition-colors"
            >
              Log Out Panel
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 px-3.5 bg-white border border-[#CAC4B8] hover:bg-[#FAF9F6] text-xs font-semibold rounded-full duration-150 transition-colors"
          >
            Close
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        
        {/* Passcode Check Screen */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto mt-16 p-8 rounded-[32px] bg-white border border-[#EAE7E1] shadow-xl text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#5A5A40]/10 flex items-center justify-center border border-[#5A5A40]/25 mb-6">
              <Lock className="w-6 h-6 text-[#5A5A40]" />
            </div>
            
            <h2 className="font-cinzel text-xl font-bold text-[#2C2C24] mb-2">Access Portal Required</h2>
            <p className="text-xs text-[#6B6B5E] leading-relaxed mb-6 font-light">
              This terminal is designed strictly for kitchen admins to manage incoming orders, track delivery dispatches, and swap menu listings/images instantly.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1.5 font-bold">Enter System Passcode</label>
                <input
                  type="password"
                  placeholder="Defaults to: admin123"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#CAC4B8] focus:border-[#5A5A40] px-4 py-3 rounded-xl outline-none text-sm"
                  autoFocus
                />
              </div>

              {loginError && (
                <span className="text-xs text-red-600 font-medium">{loginError}</span>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#5A5A40] text-white hover:bg-[#4A4A35] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm mt-2"
              >
                Authenticate Entry
              </button>
            </form>
          </div>
        ) : (
          
          <div className="flex flex-col gap-8">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-[#E8E4DB] border border-[#DED9CE] flex items-center gap-4 text-left">
                <div className="w-11 h-11 bg-white/60 rounded-xl flex items-center justify-center text-[#5A5A40] border border-[#CAC4B8]">
                  <DollarSign className="w-5 h-5 text-[#5A5A40]" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-[#6B6B5E] uppercase tracking-wider">Total Orders Volume</span>
                  <strong className="text-xl font-mono text-[#2C2C24] block leading-none mt-1">
                    {formatNaira(totalIncomingEarnings)}
                  </strong>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#EAE7E1] flex items-center gap-4 text-left shadow-sm">
                <div className="w-11 h-11 bg-[#F5F2ED] rounded-xl flex items-center justify-center text-[#D4A373]">
                  <MapPin className="w-5 h-5 text-[#D4A373]" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-[#6B6B5E] uppercase tracking-wider">Pending Deliveries</span>
                  <strong className="text-xl font-mono text-[#2C2C24] block leading-none mt-1">
                    {pendingDeliveries} Direct
                  </strong>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#EAE7E1] flex items-center gap-4 text-left shadow-sm">
                <div className="w-11 h-11 bg-[#F5F2ED] rounded-xl flex items-center justify-center text-[#5A5A40]">
                  <Clock className="w-5 h-5 text-[#5A5A40]" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-[#6B6B5E] uppercase tracking-wider">Pending Pickups</span>
                  <strong className="text-xl font-mono text-[#2C2C24] block leading-none mt-1">
                    {pendingPickups} Orders
                  </strong>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#EAE7E1] flex items-center gap-4 text-left shadow-sm">
                <div className="w-11 h-11 bg-[#F5F2ED] rounded-xl flex items-center justify-center text-emerald-600">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-[#6B6B5E] uppercase tracking-wider">Total Logged Orders</span>
                  <strong className="text-xl font-mono text-[#2C2C24] block leading-none mt-1">
                    {orders.length} Logged
                  </strong>
                </div>
              </div>

            </div>

            {/* Main Tabs Selection buttons */}
            <div className="flex border-b border-[#EAE7E1] text-left">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-6 py-3.5 font-cinzel text-sm font-semibold border-b-2 tracking-wider ${
                  activeTab === "orders"
                    ? "border-[#5A5A40] text-[#2C2C24]"
                    : "border-transparent text-[#8A8A7A] hover:text-[#2C2C24]"
                }`}
              >
                Track Live Orders
              </button>
              <button
                onClick={() => setActiveTab("menu")}
                className={`px-6 py-3.5 font-cinzel text-sm font-semibold border-b-2 tracking-wider ${
                  activeTab === "menu"
                    ? "border-[#5A5A40] text-[#2C2C24]"
                    : "border-transparent text-[#8A8A7A] hover:text-[#2C2C24]"
                }`}
              >
                Configure Custom Menu
              </button>
            </div>

            {/* TAB: Orders Tracking View */}
            {activeTab === "orders" && (
              <div className="flex flex-col gap-6 text-left">
                
                {/* Filters, Controls Row */}
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {["All", "Received", "Preparing", "Packaging", "Out for Delivery", "Ready for Pickup", "Completed", "Cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setOrderStatusFilter(status)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                          orderStatusFilter === status
                            ? "bg-[#5A5A40] text-white"
                            : "bg-[#F5F2ED] text-[#6B6B5E] hover:bg-[#E8E4DB] hover:text-[#2C2C24] border border-[#CAC4B8]/30"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={fetchOrders}
                    className="inline-flex items-center gap-1.5 text-xs text-[#5A5A40] font-semibold bg-[#5A5A40]/5 hover:bg-[#5A5A40]/10 px-3.5 py-2 rounded-xl transition-all border border-[#5A5A40]/15"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reload Orders
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="py-20 text-center text-[#8A8A7A]">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#5A5A40] mb-2" />
                    <span>Syncing Order database live...</span>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-16 rounded-3xl bg-[#F5F2ED] border border-[#EAE7E1] text-center flex flex-col items-center justify-center gap-3">
                    <ShoppingBag className="w-10 h-10 text-[#CAC4B8]" />
                    <h3 className="font-cinzel text-base font-bold text-[#2C2C24]">No Orders Match Filter</h3>
                    <p className="text-xs text-[#6B6B5E] max-w-sm">
                      There are currently no orders registered under the selected filter "{orderStatusFilter}". Any newly paid orders will arrive here instantly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-6 rounded-[24px] bg-white border border-[#EAE7E1] shadow-sm hover:border-[#CAC4B8] transition-all grid grid-cols-1 lg:grid-cols-12 gap-6"
                      >
                        {/* Status + Metadata */}
                        <div className="lg:col-span-3 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE7E1] pb-4 lg:pb-0 lg:pr-6 gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 justify-between">
                              <span className="font-mono text-xs font-bold text-[#5A5A40] bg-[#5A5A40]/5 px-2 py-0.5 rounded border border-[#5A5A40]/25">
                                {order.id}
                              </span>
                              <span className="text-[10px] font-mono font-medium text-[#8A8A7A]">
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <strong className="block text-[#2C2C24] font-semibold text-sm mt-3">{order.customerName}</strong>
                            <span className="block text-xs font-mono text-[#8A8A7A] mt-0.5">{order.customerPhone}</span>
                            <span className="block text-xs text-[#6B6B5E] break-all">{order.customerEmail}</span>
                          </div>

                          <div>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                              order.orderType === "delivery"
                                ? "bg-[#D4A373]/10 text-[#D4A373]"
                                : "bg-[#5A5A40]/10 text-[#5A5A40]"
                            }`}>
                              {order.orderType === "delivery" ? "🚀 Delivery Request" : "🏬 Store Pickup"}
                            </span>
                          </div>
                        </div>

                        {/* Order Items receipt breakdown */}
                        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                          <div className="space-y-2">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A8A7A] font-bold">Consumables Block</span>
                            <div className="divide-y divide-[#EAE7E1]/50 leading-relaxed max-h-32 overflow-y-auto">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 text-xs">
                                  <span>
                                    <strong className="text-[#2C2C24] font-medium">{it.name}</strong>
                                    {it.variant && <span className="text-[9px] text-[#D4A373] ml-1.5">({it.variant})</span>}
                                    <span className="text-[#8A8A7A] ml-2">x {it.quantity}</span>
                                  </span>
                                  <span className="font-mono text-[#6B6B5E]">{formatNaira(it.price * it.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Logistics coordinates */}
                          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE7E1]">
                            <span className="block text-[9px] uppercase font-mono tracking-wider font-bold text-[#8A8A7A] mb-1">
                              {order.orderType === "delivery" ? "Delivery Destination Coordinates" : "Customer Scheduled Collection"}
                            </span>
                            <p className="text-xs text-[#2C2C24] font-semibold flex items-center gap-1.5 leading-snug">
                              {order.orderType === "delivery" ? <MapPin className="w-3.5 h-3.5 text-[#D4A373]" /> : <Clock className="w-3.5 h-3.5 text-[#5A5A40]" />}
                              {order.orderType === "delivery" ? order.address : `Pickup scheduled: ${order.pickupTime || "Standard slot"}`}
                            </p>
                          </div>
                        </div>

                        {/* Total amount + Live actions */}
                        <div className="lg:col-span-4 flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-[#EAE7E1] pt-4 lg:pt-0 lg:pl-6 text-right gap-4">
                          <div>
                            <span className="block text-[10px] uppercase font-mono tracking-wider text-[#8A8A7A]">Settled Paystack Amount</span>
                            <strong className="text-xl font-mono text-[#5A5A40] block mt-1">{formatNaira(order.totalAmount)}</strong>
                            <p className="text-[10px] text-emerald-600 font-mono mt-0.5">Ref: {order.paystackRef.slice(0, 16)}...</p>
                          </div>

                          {/* Quick Change Status Dropdown control */}
                          <div className="w-full">
                            <label className="block text-[10px] uppercase font-mono tracking-wider text-left text-[#8A8A7A] mb-1">Grill Process Actions</label>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`w-full text-xs font-semibold p-3.5 rounded-xl border outline-none cursor-pointer transition-colors ${
                                order.status === "Completed"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : "bg-[#F5F2ED] text-[#2C2C24] border-[#CAC4B8] hover:border-[#5A5A40]"
                              }`}
                            >
                              <option value="Received">Received / Paid</option>
                              <option value="Preparing">Preparing / Smoldering</option>
                              <option value="Packaging">Packaging Gold Foils</option>
                              {order.orderType === "delivery" ? (
                                <option value="Out for Delivery">Released to Dispatch Motorcycle</option>
                              ) : (
                                <option value="Ready for Pickup">Ready in Wuse 2 Hub</option>
                              )}
                              <option value="Completed">Completed Delivery / Closed</option>
                              <option value="Cancelled">Cancelled & Refunded</option>
                            </select>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB: Menu Catalog Management View */}
            {activeTab === "menu" && (
              <div className="flex flex-col gap-6 text-left">
                
                {/* Add Product and seed commands banner */}
                <div className="bg-[#E8E4DB] p-6 rounded-3xl border border-[#DED9CE] flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A373]/10 rounded-full blur-2xl" />
                  
                  <div className="relative z-10 max-w-lg">
                    <h3 className="font-cinzel text-lg font-bold text-[#2C2C24]">Dynamic Menu Catalog</h3>
                    <p className="text-xs text-[#6B6B5E] mt-1 font-light leading-relaxed">
                      Customise titles, prices, descriptions, and **set custom image URLs** to swap stock photos. Updates persist dynamically so customers see private custom menu changes instantly!
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5 shrink-0 relative z-10">
                    <button
                      onClick={resetToFactoryMenu}
                      className="px-4 py-2.5 rounded-xl border border-[#CAC4B8] text-[10px] font-bold uppercase bg-[#F5F2ED] hover:bg-[#FAF9F6] text-[#8A8A7A] hover:text-red-700 transition-all flex items-center gap-1.5 focus:outline-none"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      Reset to Default Menu
                    </button>
                    <button
                      onClick={startAddNewItem}
                      className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A35] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm focus:outline-none"
                    >
                      <Plus className="w-4 h-4 text-[#D4A373]" />
                      Add Custom Delicacy
                    </button>
                  </div>
                </div>

                {/* Edit Form Modal Layer */}
                {isEditingItem && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D4A373]/30 shadow-md flex flex-col gap-6 relative">
                    <button
                      onClick={() => setIsEditingItem(false)}
                      className="absolute top-6 right-6 p-1.5 rounded-lg bg-[#F5F2ED] text-[#6B6B5E] hover:text-[#2C2C24]"
                      aria-label="Cancel editing"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-[#D4A373]" />
                      <h4 className="font-cinzel text-base font-bold text-[#2C2C24]">
                        {editingItem.id ? "Edit Item Coordinates" : "Create New Custom Item"}
                      </h4>
                    </div>

                    <form onSubmit={saveMenuItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1 font-bold">Item Title Name</label>
                        <input
                          type="text"
                          required
                          value={editingItem.name || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full bg-[#FAF9F6] border border-[#CAC4B8] focus:border-[#5A5A40] px-3 py-2.5 rounded-xl text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1 font-bold">Menu Price (₦ Naira, Number only)</label>
                        <input
                          type="number"
                          required
                          value={editingItem.price || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                          className="w-full bg-[#FAF9F6] border border-[#CAC4B8] focus:border-[#5A5A40] px-3 py-2.5 rounded-xl text-xs font-mono outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1 font-bold">Menu Category</label>
                        <select
                          value={editingItem.category || "Platters"}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                          className="w-full bg-[#FAF9F6] border border-[#CAC4B8] focus:border-[#5A5A40] px-3 py-2.5 rounded-xl text-xs outline-none cursor-pointer"
                        >
                          {CATEGORIES.filter(c => c !== "All").map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1 font-bold font-semibold text-[#D4A373]">Custom Image URL or Local Filename</label>
                        <input
                          type="text"
                          placeholder="/my_suya.jpg or https://images.com/..."
                          value={editingItem.variant || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, variant: e.target.value })}
                          className="w-full bg-[#FAF9F6] border border-[#D4A373]/30 focus:border-[#5A5A40] px-3 py-2.5 rounded-xl text-xs text-[#2C2C24] font-semibold font-mono outline-none"
                        />
                        <span className="block text-[9px] text-[#8A8A7A] mt-1">
                          Paste any web image URL (starting with http) OR if you uploaded an image to the <strong>public/</strong> folder in AI Studio, enter its filename here starting with a slash (e.g. <code>/my-suya.jpg</code>).
                        </span>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1 font-bold font-semibold">Ingredient Description Paragraph</label>
                        <textarea
                          rows={2}
                          required
                          value={editingItem.description || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="w-full bg-[#FAF9F6] border border-[#CAC4B8] focus:border-[#5A5A40] px-3 py-2.5 rounded-xl text-xs outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1 font-bold">Product Badges/Tags (Comma Separated)</label>
                        <input
                          type="text"
                          placeholder="Best Seller, Super Spicy, Feeding 2-3"
                          value={customTagsText}
                          onChange={(e) => setCustomTagsText(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#CAC4B8] focus:border-[#5A5A40] px-3 py-2.5 rounded-xl text-xs outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-end gap-2.5 mt-3 border-t border-[#EAE7E1] pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingItem(false);
                            setEditingItem({});
                          }}
                          className="px-4 py-2 border border-[#CAC4B8] rounded-xl text-xs font-semibold hover:bg-[#FAF9F6]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#5A5A40] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                        >
                          Save Custom Item
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Grid Item Cards for Admin */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white border border-[#EAE7E1] flex flex-col justify-between hover:border-[#CAC4B8] transition-colors gap-4"
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail image */}
                        <div className="w-16 h-16 rounded-xl bg-[#F5F2ED] overflow-hidden shrink-0 border border-[#EAE7E1]">
                          <img
                            src={
                              item.variant && (
                                item.variant.startsWith("http") ||
                                item.variant.startsWith("/") ||
                                item.variant.startsWith("assets/") ||
                                item.variant.toLowerCase().endsWith(".jpg") ||
                                item.variant.toLowerCase().endsWith(".jpeg") ||
                                item.variant.toLowerCase().endsWith(".png") ||
                                item.variant.toLowerCase().endsWith(".webp")
                              )
                                ? item.variant
                                : CATEGORY_PLACEHOLDERS[item.category] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <strong className="block text-sm text-[#2C2C24] leading-tight font-semibold">{item.name}</strong>
                          <span className="inline-block text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#CAC4B8] mt-1 font-bold">
                            {item.category}
                          </span>
                          <span className="block text-xs font-mono font-bold text-[#5A5A40] mt-1">{formatNaira(item.price)}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#6B6B5E] line-clamp-2 leading-relaxed font-light text-left pl-1">
                        {item.description}
                      </p>

                      <div className="flex border-t border-[#EAE7E1]/60 pt-3 justify-between items-center px-1">
                        <span className="text-[9px] font-mono text-[#8A8A7A]">ID: {item.id}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditItem(item)}
                            className="p-1 px-3 border border-[#EAE7E1] bg-[#FAF9F6] text-[10px] text-[#2C2C24] hover:bg-[#E8E4DB] rounded font-semibold transition-colors flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3 text-[#D4A373]" />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="p-1 px-2 border border-red-200 text-red-700 hover:bg-red-50 rounded text-[10px] transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
