/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Clock, MapPin, Check, Copy, Flame, MessageSquare, ShoppingBag, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import { formatNaira } from "./CartModal";
import { WHATSAPP_NUMBER } from "../types";

interface OrderTrackerProps {
  orderId: string;
  onClose: () => void;
}

interface OrderDetails {
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

export default function OrderTracker({ orderId, onClose }: OrderTrackerProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchOrderStatus();
    // Poll every 12 seconds for real-time order progression! Very fast and responsive.
    const interval = setInterval(fetchOrderStatus, 12000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      const resp = await fetch(`/api/orders/${orderId}`);
      if (!resp.ok) {
        throw new Error("Order signature not retrieved.");
      }
      const data = await resp.json();
      setOrder(data);
      setError("");
    } catch (err) {
      setError("Unable to sync details. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendBackupWhatsApp = () => {
    if (!order) return;
    
    let text = `👋 Hello Jamal's Chef! I just processed a Paystack payment for Order *#${order.id}*.\n\n`;
    text += `👤 *Customer Details*:\n`;
    text += `   Name: ${order.customerName}\n`;
    text += `   Phone: ${order.customerPhone}\n`;
    text += `   Service: *${order.orderType.toUpperCase()}* (${order.orderType === 'delivery' ? 'Destination: ' + order.address : 'Scheduled Pickup: ' + order.pickupTime})\n\n`;
    
    text += `🛒 *Meal Selections*:\n`;
    order.items.forEach((it) => {
      const variantText = it.variant ? ` (${it.variant})` : "";
      text += `   - ${it.name}${variantText} (x${it.quantity})\n`;
    });

    text += `\n💰 *Amount Settled via Paystack*: *${formatNaira(order.totalAmount)}*\n`;
    text += `💳 *Txn Ref*: _${order.paystackRef}_\n\n`;
    text += `Kindly confirm cooking and packaging dispatch status! Thanks. `;

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Status mapping to steps
  const steps = [
    { label: "Ordered & Paid", value: "Received", desc: "Waiting in queue" },
    { label: "Seared & Grilled", value: "Preparing", desc: "Spiced over coals" },
    { label: "Meticulous Foil Pack", value: "Packaging", desc: "Locking grill juices" },
    { label: order?.orderType === "delivery" ? "En Route via Runner" : "Ready for Pickup", value: order?.orderType === "delivery" ? "Out for Delivery" : "Ready for Pickup", desc: "Fresh & sizzling" },
    { label: "Feast Initiated", value: "Completed", desc: "Enjoy your grill!" }
  ];

  const getStepIndex = (status: string) => {
    if (status === "Cancelled") return -1;
    if (status === "Received") return 0;
    if (status === "Preparing") return 1;
    if (status === "Packaging") return 2;
    if (status === "Out for Delivery" || status === "Ready for Pickup") return 3;
    if (status === "Completed") return 4;
    return 0;
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF9F6] overflow-y-auto flex flex-col justify-between">
      
      {/* Top Header navbar panel */}
      <header className="h-16 bg-[#F5F2ED] border-b border-[#EAE7E1] px-6 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 hover:text-[#5A5A40] text-xs font-semibold text-[#6B6B5E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back To Storefront
        </button>
        <div className="flex items-center gap-1.5 font-cinzel text-xs font-bold text-[#2C2C24]">
          <Flame className="w-4.5 h-4.5 text-[#5A5A40] animate-pulse" />
          <span>ORDER PORT PROTOCOL</span>
        </div>
        <button
          onClick={fetchOrderStatus}
          className="p-2.5 rounded-full hover:bg-white text-[#6B6B5E] hover:text-[#2C2C24]"
          title="Refresh tracker"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      {/* Main Body container */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-6 py-10 text-left">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#5A5A40]" />
            <span className="text-sm text-[#8A8A7A]">Negotiating with kitchen order records...</span>
          </div>
        ) : error && !order ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-xs text-red-600 font-semibold">{error}</p>
            <button
              onClick={fetchOrderStatus}
              className="px-5 py-2 rounded-full bg-[#5A5A40] text-white text-xs font-semibold"
            >
              Retry Sync
            </button>
          </div>
        ) : order ? (
          <div className="flex flex-col gap-8">
            
            {/* Success greeting badge */}
            <div className="p-6 rounded-3xl bg-[#E8E4DB] border border-[#DED9CE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF9F6]/20 rounded-full blur-2xl" />
              <div>
                <span className="text-[10px] bg-[#5A5A40] text-white rounded-full px-2.5 py-0.5 font-semibold tracking-wider font-mono">
                  PAYMENT SETTLED SECURELY
                </span>
                <h2 className="font-cinzel text-xl sm:text-2xl font-light text-[#2C2C24] mt-2 leading-tight">
                  Flame-Grilled feast underway!
                </h2>
                <p className="text-xs text-[#6B6B5E] mt-1 font-light">
                  Receipt order successfully queued. Our chefs are dusting the hot flank skewers.
                </p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-[#CAC4B8]">
                <Clock className="w-4 h-4 text-[#D4A373] animate-pulse" />
                <span className="text-xs font-bold text-[#c28448] font-mono whitespace-nowrap">
                  12m - 35m est
                </span>
              </div>
            </div>

            {/* Quick Identifier Copy */}
            <div className="p-4 rounded-2xl bg-white border border-[#EAE7E1] flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-[#8A8A7A] uppercase font-mono font-bold">Custom Receipt Reference</span>
                <strong className="text-sm font-mono text-[#2C2C24] mt-0.5 block">{order.id}</strong>
              </div>
              <button
                onClick={copyOrderId}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A5A40] hover:text-[#4A4A35] bg-[#5A5A40]/5 border border-[#5A5A40]/15 hover:bg-[#5A5A40]/10 p-2.5 px-4 rounded-xl transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied Ref!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#5A5A40]" />
                    Copy Reference
                  </>
                )}
              </button>
            </div>

            {/* Live Progress Vertical Tracker Panel */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#EAE7E1] flex flex-col gap-6">
              <h3 className="font-cinzel text-base font-bold text-[#2C2C24] tracking-wide">
                Live Kitchen Progression Status
              </h3>

              {order.status === "Cancelled" ? (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center">
                  <h4 className="font-semibold text-sm">Order Cancelled / Refunded</h4>
                  <p className="text-[11px] mt-1">This order was cancelled by the administrator. Contact customer support for immediate inquiries.</p>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-8 border-l border-[#EAE7E1] ml-3.5 sm:ml-4 flex flex-col gap-6">
                  {steps.map((st, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    const isPassedOrActive = idx <= currentStepIndex;

                    return (
                      <div key={idx} className="relative text-left">
                        {/* Bullet indicators */}
                        <div className={`absolute -left-[35px] sm:-left-[43px] top-1 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-[#5A5A40] border-[#5A5A40] text-white"
                            : isActive
                            ? "bg-[#D4A373] border-[#D4A373] text-white ring-4 ring-[#D4A373]/20 scale-105"
                            : "bg-[#FAF9F6] border-[#CAC4B8] text-[#8A8A7A]"
                        }`}>
                          {isCompleted ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <span className="text-[10px] font-mono font-bold leading-none">{idx + 1}</span>
                          )}
                        </div>

                        {/* Text descriptions */}
                        <div>
                          <h4 className={`text-xs font-semibold ${isPassedOrActive ? "text-[#2C2C24]" : "text-[#8A8A7A]"}`}>
                            {st.label}
                          </h4>
                          <p className={`text-[11px] leading-relaxed font-light mt-0.5 ${isActive ? "text-[#D4A373] font-normal" : "text-[#6B6B5E]"}`}>
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Receipt Summary Breakdown lists */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-[#EAE7E1] flex flex-col gap-4 text-left">
              <h3 className="font-cinzel text-base font-bold text-[#2C2C24] border-b border-[#EAE7E1] pb-3 tracking-wide">
                Delicacy Consumables Breakdown
              </h3>

              <div className="divide-y divide-[#EAE7E1]/50 leading-relaxed text-xs">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2.5">
                    <div>
                      <strong className="text-[#2C2C24] font-semibold">{it.name}</strong>
                      {it.variant && (
                        <span className="block text-[9px] text-[#D4A373] font-bold uppercase mt-0.5">
                          {it.variant}
                        </span>
                      )}
                      <span className="text-[10px] text-[#8A8A7A]">Qty: {it.quantity} x {formatNaira(it.price)}</span>
                    </div>
                    <span className="font-mono text-[#5A5A40] font-bold">
                      {formatNaira(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm border-t border-[#EAE7E1] pt-4 items-center">
                <span className="font-semibold text-[#6B6B5E]">Amount Settled:</span>
                <strong className="text-lg font-mono text-[#2C2C24] font-bold">
                  {formatNaira(order.totalAmount)}
                </strong>
              </div>

              {/* Logistics delivery summary details */}
              <div className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] text-[11px] flex gap-3 leading-relaxed">
                {order.orderType === "delivery" ? (
                  <>
                    <MapPin className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#2C2C24]">Dispatched For Runner Delivery</h4>
                      <p className="text-[#6B6B5E] mt-0.5">Recipient address: <strong>{order.address}</strong>. Keep your line active as our hot dispatch rider will call you upon entering secure proximity.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#2C2C24]">Central Storefront Pickup</h4>
                      <p className="text-[#6B6B5E] mt-0.5">Pick up your sizzling package from Riverplate Park Hub, Wuse 2. Scheduled timing indicator: <strong>{order.pickupTime || "ASAP"}</strong>.</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Direct WhatsApp Call and Dual Copy backup button */}
            <div className="p-5 rounded-2xl bg-[#5A5A40]/5 border border-[#5A5A40]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <strong className="text-xs text-[#2C2C24] font-semibold block leading-tight">Need direct chat assistance?</strong>
                <span className="text-[10px] text-[#6B6B5E] font-light mt-0.5 block max-w-sm">
                  Send a dual copy of this paid receipt to our kitchen chef on WhatsApp so they prioritize and double-check your order packaging!
                </span>
              </div>
              <button
                onClick={sendBackupWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5A5A40] hover:bg-[#4A4A35] text-white text-xs font-bold uppercase transition-colors shrink-0"
              >
                <MessageSquare className="w-4 h-4 text-[#D4A373] fill-current" />
                Backup Cook WhatsApp
              </button>
            </div>

          </div>
        ) : (
          <div className="py-20 text-center text-[#8A8A7A]">No tracking logs exist with this signature query.</div>
        )}
      </main>

      {/* Basic Footer spacer copyright stamp */}
      <footer className="py-8 text-center text-[10px] text-[#8A8A7A] border-t border-[#EAE7E1]">
        © Jamal's grill & spice trackers. Keep this window open for auto-updates.
      </footer>
    </div>
  );
}
