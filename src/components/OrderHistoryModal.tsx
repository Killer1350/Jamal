/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { X, RefreshCw, ShoppingBag, Eye, Clock, Calendar, CheckCircle, Truck, MapPin, Sparkles } from "lucide-react";
import { MenuItem } from "../types";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: "delivery" | "pickup";
  address: string;
  pickupTime: string | null;
  items: OrderItem[];
  totalAmount: number;
  paystackRef: string;
  status: string;
  createdAt: string;
}

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onTrackOrder: (orderId: string) => void;
  onReorder: (items: { id: number; quantity: number }[]) => void;
}

const formatNaira = (amount: number) => {
  return "₦" + amount.toLocaleString("en-NG", { minimumFractionDigits: 0 });
};

const getStatusBadgeStyle = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "completed") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
  }
  if (normalized === "cancelled") {
    return "bg-rose-50 text-rose-600 border-rose-200/50";
  }
  if (normalized === "received") {
    return "bg-[#F5F2ED] text-[#8A8A7A] border-[#EAE7E1]";
  }
  if (normalized === "preparing") {
    return "bg-amber-50 text-amber-700 border-amber-200/50";
  }
  if (normalized === "packaging") {
    return "bg-blue-50 text-blue-700 border-blue-200/50";
  }
  if (normalized === "out for delivery" || normalized === "ready for pickup") {
    return "bg-indigo-50 text-indigo-700 border-indigo-200/50";
  }
  return "bg-amber-50 text-amber-700 border-amber-200/50";
};

export default function OrderHistoryModal({
  isOpen,
  onClose,
  userEmail,
  onTrackOrder,
  onReorder,
}: OrderHistoryModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderHistory = async () => {
    if (!userEmail) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/orders/history?email=${encodeURIComponent(userEmail)}`);
      if (!resp.ok) {
        throw new Error("Could not retrieve past orders.");
      }
      const data = await resp.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch order history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userEmail) {
      fetchOrderHistory();
    }
  }, [isOpen, userEmail]);

  if (!isOpen) return null;

  const handleReorderClick = (order: Order) => {
    const itemsToAdd = order.items.map((it) => ({
      id: it.id,
      quantity: it.quantity,
    }));
    onReorder(itemsToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2C2C24]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#FAF9F6] border border-[#EAE7E1] rounded-3xl shadow-xl overflow-hidden animate-slide-up z-10 flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#EAE7E1] flex items-center justify-between bg-[#F5F2ED]">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#5A5A40]" />
            <div>
              <h3 className="font-cinzel text-sm font-bold tracking-widest text-[#2C2C24]">
                My Order History
              </h3>
              <p className="text-[10px] text-[#8A8A7A] font-medium font-mono mt-0.5">
                Feasting log for: {userEmail}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrderHistory}
              disabled={loading}
              className="p-1.5 rounded-full hover:bg-[#EAE7E1] text-[#6B6B5E] transition-all focus:outline-none disabled:opacity-50"
              title="Refresh order log"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#EAE7E1] text-[#6B6B5E] transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable List Container */}
        <div className="flex-grow overflow-y-auto p-6 bg-[#FAF9F6]">
          {loading && orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <span className="w-8 h-8 border-3 border-[#5A5A40]/30 border-t-[#5A5A40] rounded-full animate-spin mb-3" />
              <p className="text-xs text-[#6B6B5E] font-semibold font-mono">Retrieving your gourmet records...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#EAE7E1]/60 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-[#8A8A7A]" />
              </div>
              <h4 className="font-cinzel text-xs font-bold text-[#2C2C24] tracking-wider">No Orders Found Yet!</h4>
              <p className="text-xs text-[#6B6B5E] mt-2 font-medium leading-relaxed">
                You haven't placed any orders on this account yet. Head to our menu and add some charcoal-fired suya or smoky shawarmas to your selection!
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-[#5A5A40] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-[#4A4A35] transition-all cursor-pointer"
              >
                Browse Sizzling Menu
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const isCompletedOrCancelled = ["completed", "cancelled"].includes(order.status.toLowerCase());
                return (
                  <div 
                    key={order.id} 
                    className="p-5 rounded-2xl bg-white border border-[#EAE7E1] hover:border-[#CAC4B8] transition-all flex flex-col gap-4 shadow-sm"
                  >
                    {/* Top Order Row Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAF9F6] pb-3">
                      <div>
                        <span className="text-[10px] font-bold font-mono text-[#D4A373] tracking-wide block uppercase">
                          Order Reference
                        </span>
                        <h4 className="font-mono text-xs font-bold text-[#2C2C24] mt-0.5">
                          {order.id}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status badge */}
                        <span className={`px-2.5 py-1 text-[9px] font-bold font-mono uppercase rounded-lg border ${getStatusBadgeStyle(order.status)}`}>
                          ● {order.status}
                        </span>

                        {/* Order Type badge */}
                        <span className="px-2 py-1 text-[9px] font-bold font-mono uppercase bg-[#F5F2ED] text-[#2C2C24] rounded-lg border border-[#EAE7E1]">
                          {order.orderType === "delivery" ? "🚀 Delivery" : "📦 Pickup"}
                        </span>
                      </div>
                    </div>

                    {/* Middle Detail Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Items list */}
                      <div className="md:col-span-7 space-y-1.5">
                        <span className="text-[9px] font-mono font-bold uppercase text-[#8A8A7A] block tracking-wider">
                          Items Selection
                        </span>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-[#2C2C24] font-medium font-mono">
                              <span className="truncate max-w-[180px] sm:max-w-xs text-[#2C2C24]">
                                {item.name} {item.variant ? `(${item.variant})` : ""}
                                <span className="text-[#8A8A7A] text-[10px] font-normal ml-1">x{item.quantity}</span>
                              </span>
                              <span className="text-[#6B6B5E] text-[11px] font-semibold">{formatNaira(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Logistical Info */}
                      <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-[#FAF9F6] pt-3 md:pt-0 md:pl-4 space-y-2 text-xs text-[#6B6B5E] font-medium">
                        <div className="flex items-start gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#8A8A7A] mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[8px] font-mono uppercase text-[#8A8A7A] block font-bold">Ordered Date</span>
                            <span className="text-[#2C2C24] font-mono text-[10px]">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              {new Date(order.createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#8A8A7A] mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[8px] font-mono uppercase text-[#8A8A7A] block font-bold">Destination</span>
                            <p className="text-[10px] text-[#2C2C24] font-mono truncate" title={order.address}>
                              {order.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Section */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-[#FAF9F6] pt-3 mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[#6B6B5E] font-medium">Total Amount paid:</span>
                        <strong className="text-sm text-[#5A5A40] font-mono font-bold">{formatNaira(order.totalAmount)}</strong>
                      </div>

                      <div className="flex gap-2.5">
                        {/* Live track (only for non-terminal orders) */}
                        {!isCompletedOrCancelled && (
                          <button
                            onClick={() => {
                              onTrackOrder(order.id);
                              onClose();
                            }}
                            className="px-4 py-2 bg-[#5A5A40] hover:bg-[#4A4A35] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Track Sizzler
                          </button>
                        )}

                        <button
                          onClick={() => handleReorderClick(order)}
                          className="px-4 py-2 border border-[#D4A373]/30 hover:border-[#D4A373] text-[#D4A373] hover:bg-[#D4A373]/5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Reorder Items
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
