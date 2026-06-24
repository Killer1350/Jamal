/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { X, ShieldCheck, CreditCard, Sparkles, MapPin, Clock, ArrowRight, RotateCw, AlertCircle } from "lucide-react";
import { formatNaira } from "./CartModal";
import { UserSession } from "../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  cartItems: Array<{ id: number; name: string; quantity: number; price: number; variant?: string }>;
  onOrderSuccess: (orderId: string) => void;
  onClearCart: () => void;
  userSession?: UserSession | null;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartTotal,
  cartItems,
  onOrderSuccess,
  onClearCart,
  userSession
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("As soon as possible");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paystackKey, setPaystackKey] = useState("");

  // Pre-fill user details if logged in
  useEffect(() => {
    if (userSession && userSession.user) {
      setCustomerName(userSession.user.name || "");
      setCustomerEmail(userSession.user.email || "");
      setCustomerPhone(userSession.user.phone || "");
    } else {
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
    }
  }, [userSession, isOpen]);

  // standard Abuja Delivery Charge calculation: 1500 Naira flat rate
  const deliveryFee = orderType === "delivery" ? 1500 : 0;
  const grandTotal = cartTotal + deliveryFee;

  // Retrieve Paystack key from backend configuration safely
  useEffect(() => {
    let active = true;
    async function fetchKey() {
      try {
        const resp = await fetch("/api/paystack-config");
        const data = await resp.json();
        if (active && data.publicKey) {
          setPaystackKey(data.publicKey);
        }
      } catch (err) {
        console.warn("Could not retrieve custom Paystack key, fallback to standard key", err);
      }
    }
    fetchKey();
    return () => {
      active = false;
    };
  }, []);

  const handlePaystackPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMessage("Kindly complete Name, Phone, and Email text fields.");
      return;
    }

    if (orderType === "delivery" && !address.trim()) {
      setErrorMessage("Delivery address is required for couriers dispatch.");
      return;
    }

    setLoading(true);

    // Double check Paystack is loaded as window.PaystackPop
    const PaystackPop = (window as any).PaystackPop;
    if (!PaystackPop) {
      // Re-try loading script tag if blocked or delayed
      try {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.onload = () => initiatePaystack(grandTotal);
        script.onerror = () => {
          setLoading(false);
          setErrorMessage("Paystack inline popup failed to load. Please check your internet connection.");
        };
        document.head.appendChild(script);
      } catch {
        setLoading(false);
        setErrorMessage("Payment SDK blocked. Please ensure ad-blockers are disabled.");
      }
    } else {
      initiatePaystack(grandTotal);
    }
  };

  const initiatePaystack = (amountInNaira: number) => {
    const PaystackPop = (window as any).PaystackPop;
    const resolvedKey = paystackKey || "pk_test_a6e193988f01c25c3fcd107c11f75e01c789d2b4"; // Fallback to safe Sandbox test key

    try {
      const handler = PaystackPop.setup({
        key: resolvedKey,
        email: customerEmail,
        amount: Math.round(amountInNaira * 100), // Convert to Kobo
        currency: "NGN",
        ref: "JAM-PAY-" + Math.floor(100000 + Math.random() * 900000) + "-" + Date.now().toString().slice(-4),
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: customerName
            },
            {
              display_name: "Customer Phone",
              variable_name: "customer_phone",
              value: customerPhone
            },
            {
              display_name: "Service Selection",
              variable_name: "service_selection",
              value: orderType
            }
          ]
        },
        callback: function (response: any) {
          // Response.reference contains Paystack settled receipt string
          saveOrderToBackend(response.reference);
        },
        onClose: function () {
          setLoading(false);
          setErrorMessage("Payment canceled. You can proceed again when ready.");
        }
      });

      handler.openIframe();
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(`Paystack instance initialization error: ${err.message || err}`);
    }
  };

  const saveOrderToBackend = async (reference: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          orderType,
          address: orderType === "delivery" ? address : null,
          pickupTime: orderType === "pickup" ? pickupTime : null,
          items: cartItems.map((it) => ({
            id: it.id,
            name: it.name,
            quantity: it.quantity,
            price: it.price,
            variant: it.variant || null,
          })),
          totalAmount: grandTotal,
          paystackRef: reference,
        }),
      });

      const data = await response.json();
      if (data.success && data.order) {
        onClearCart();
        onOrderSuccess(data.order.id);
        onClose();
      } else {
        setErrorMessage("Payment recorded but server failed to save order logs. Keep your Paystack reference: " + reference);
      }
    } catch (err) {
      setErrorMessage("Network sync timeout. Payment cleared successfully. Reference code: " + reference);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Absolute Backdrop blur */}
      <div className="absolute inset-0 bg-[#2C2C24]/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Main Panel Box */}
      <div className="relative w-full max-w-lg bg-[#FAF9F6] border border-[#EAE7E1] rounded-[32px] shadow-2xl overflow-hidden animate-slide-in z-10 max-h-[90vh] flex flex-col justify-between">
        
        {/* Header section */}
        <div className="p-6 border-b border-[#EAE7E1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#5A5A40]" />
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#2C2C24] tracking-wider">
              Abuja Direct Checkout
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#F5F2ED] text-[#6B6B5E] hover:text-[#2C2C24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable parameters box */}
        <div className="flex-1 overflow-y-auto p-6 text-left">
          
          <form onSubmit={handlePaystackPayment} className="flex flex-col gap-6">
            
            {/* Service selectors (Delivery vs Pickup) */}
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-2 font-bold select-none">Service Type Selection</span>
              <div className="grid grid-cols-2 gap-3">
                
                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all focus:outline-none ${
                    orderType === "delivery"
                      ? "bg-white border-[#5A5A40] shadow-sm text-[#2C2C24] ring-1 ring-[#5A5A40]"
                      : "bg-[#FAF9F6] border-[#CAC4B8]/40 text-[#6B6B5E] hover:bg-[#F5F2ED]"
                  }`}
                >
                  <MapPin className={`w-5 h-5 ${orderType === "delivery" ? "text-[#D4A373]" : "text-[#8A8A7A]"}`} />
                  <span className="text-xs font-bold font-cinzel mt-1">Dispatch Delivery</span>
                  <p className="text-[10px] font-light mt-0.5">Motorycle router (₦1,500)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("pickup")}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all focus:outline-none ${
                    orderType === "pickup"
                      ? "bg-white border-[#5A5A40] shadow-sm text-[#2C2C24] ring-1 ring-[#5A5A40]"
                      : "bg-[#FAF9F6] border-[#CAC4B8]/40 text-[#6B6B5E] hover:bg-[#F5F2ED]"
                  }`}
                >
                  <Clock className={`w-5 h-5 ${orderType === "pickup" ? "text-[#5A5A40]" : "text-[#8A8A7A]"}`} />
                  <span className="text-xs font-bold font-cinzel mt-1">Wuse 2 Pickup</span>
                  <p className="text-[10px] font-light mt-0.5">Collect free from hub</p>
                </button>

              </div>
            </div>

            {/* Inputs: Customer Contact particulars */}
            <div className="flex flex-col gap-4">
              <span className="block text-[10px] font-mono uppercase text-[#8A8A7A] font-bold select-none border-b border-[#EAE7E1]/60 pb-1">Particulars & Contact</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[#8A8A7A] mb-1 font-semibold">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ibrahim"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-[#CAC4B8] focus:border-[#5A5A40] text-xs px-3.5 py-3 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8A8A7A] mb-1 font-semibold">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 08012345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-[#CAC4B8] focus:border-[#5A5A40] text-xs px-3.5 py-3 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#8A8A7A] mb-1 font-semibold">Email Address (invoice receipt)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., customer@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-white border border-[#CAC4B8] focus:border-[#5A5A40] text-xs px-3.5 py-3 rounded-xl outline-none"
                />
              </div>

              {/* Dynamic Service details section */}
              {orderType === "delivery" ? (
                <div>
                  <label className="block text-[10px] text-[#8A8A7A] mb-1 font-semibold text-[#D4A373]">Full Delivery Address in Abuja</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g., House 14, 2nd Avenue, Gwarinpa Estate, FCT"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-[#CAC4B8] focus:border-[#D4A373] text-xs px-3.5 py-2.5 rounded-xl outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] text-[#8A8A7A] mb-1 font-semibold text-[#5A5A40]">Pickup Scheduled Slot Time</label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-white border border-[#CAC4B8] focus:border-[#5A5A40] text-xs px-3.5 py-3 rounded-xl outline-none cursor-pointer"
                  >
                    <option value="As soon as possible">As soon as possible (15-20 mins prep)</option>
                    <option value="In 30 minutes">In 30 minutes</option>
                    <option value="In 1 hour">In 1 hour</option>
                    <option value="In 2 hours">In 2 hours</option>
                    <option value="Later today">Later today</option>
                  </select>
                </div>
              )}
            </div>

            {/* Price review segment */}
            <div className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase text-[#8A8A7A] font-bold">Price Calculation</span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B6B5E]">Grills Cart Total:</span>
                <span className="font-mono text-[#2C2C24]">{formatNaira(cartTotal)}</span>
              </div>
              {orderType === "delivery" && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6B6B5E]">Abuja Courier dispatch:</span>
                  <span className="font-mono text-[#D4A373] font-semibold">+ {formatNaira(deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm border-t border-[#CAC4B8]/40 pt-2 font-bold">
                <span className="text-[#2C2C24]">Grand Total Settle:</span>
                <span className="font-mono text-[#5A5A40] text-base">{formatNaira(grandTotal)}</span>
              </div>
            </div>

            {/* Error dialog alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs flex items-start gap-2 max-w-full font-medium shadow-sm">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Trigger Checkout button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-[#2C2C24] hover:bg-[#1a1a16] disabled:bg-[#8A8A7A]/40 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-[#D4A373]" />
                  SYNCING WITH SECURE PAYSTACK...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-[#D4A373] fill-current" />
                  CONFIRM & PAY DIRECT (₦)
                </>
              )}
            </button>

          </form>

        </div>

        {/* Polished security badge footer */}
        <div className="p-4.5 bg-[#F5F2ED] border-t border-[#EAE7E1] text-center text-[10px] text-[#8A8A7A] font-mono tracking-wide flex items-center justify-center gap-1.5 leading-none">
          <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>PAYSTACK SECURE PCI-DSS ENCRYPTED CHANNELS</span>
        </div>

      </div>
    </div>
  );
}
