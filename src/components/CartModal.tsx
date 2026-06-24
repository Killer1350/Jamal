/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { MenuItem, CartItem } from "../types";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  cartItems: CartItem[];
  onUpdateQty: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
}

export function formatNaira(amount: number) {
  return "₦" + amount.toLocaleString("en-NG");
}

export default function CartModal({
  isOpen,
  onClose,
  menuItems,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
}: CartModalProps) {
  if (!isOpen) return null;

  // Resolve cart items with full item details from dynamic menu configuration
  const resolvedItems = cartItems
    .map((cartItem) => {
      const menuItem = menuItems.find((item) => item.id === cartItem.id);
      return menuItem
        ? {
            ...menuItem,
            quantity: cartItem.quantity,
            subtotal: menuItem.price * cartItem.quantity,
          }
        : null;
    })
    .filter(Boolean) as Array<MenuItem & { quantity: number; subtotal: number }>;

  const grandTotal = resolvedItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleCheckoutClick = () => {
    if (resolvedItems.length === 0) return;
    onClose();
    onOpenCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Dark overlay backdrop with click-to-dismiss support */}
      <div
        className="absolute inset-0 bg-[#2C2C24]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Cart Container Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#FAF9F6] border-l border-[#EAE7E1] shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
        
        {/* Cart Drawer Header */}
        <div className="p-5 border-b border-[#EAE7E1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#5A5A40] animate-bounce" />
            <h3 className="font-cinzel text-lg font-bold text-[#2C2C24] tracking-wider">
              Your Selection
            </h3>
            {resolvedItems.length > 0 && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#5A5A40] text-[#FAF9F6] font-bold font-mono">
                {resolvedItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#F5F2ED] text-[#6B6B5E] hover:text-[#2C2C24] hover:bg-[#E8E4DB] transition-colors focus:outline-none cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Drawer List Area */}
        <div className="flex-1 overflow-y-auto p-5 text-left">
          {resolvedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F5F2ED] flex items-center justify-center text-[#CAC4B8] border border-[#EAE7E1]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-cinzel text-[#2C2C24] text-base font-bold">Your Cart is Empty</h4>
                <p className="text-xs text-[#6B6B5E] max-w-xs mt-1 leading-relaxed">
                  Add some hot spiced Flame-Grills, Platters, Suyazzas, or Rich Pastas from our menu to begin your feast.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-full bg-[#5A5A40]/10 border border-[#5A5A40]/20 text-[#5A5A40] text-xs font-semibold hover:bg-[#5A5A40]/20 transition-all focus:outline-none cursor-pointer"
              >
                Go Choose Grills
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {resolvedItems.map((item) => (
                <div
                  key={`${item.id}-${item.variant || ""}`}
                  className="p-4 rounded-xl bg-[#F5F2ED] border border-[#EAE7E1] flex flex-col gap-3 justify-between"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#2C2C24] leading-tight">
                        {item.name}
                      </h4>
                      {item.variant && !item.variant.startsWith("http") && (
                        <span className="inline-block text-[9px] font-bold text-[#D4A373] bg-[#D4A373]/10 px-1.5 py-0.5 rounded font-mono mt-1 border border-[#D4A373]/15">
                          {item.variant}
                        </span>
                      )}
                      <p className="text-[10px] font-semibold text-[#8A8A7A] mt-1 font-mono uppercase tracking-widest">
                        {item.category}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#5A5A40] font-mono leading-none bg-[#5A5A40]/5 px-2 py-1 rounded">
                      {formatNaira(item.subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#CAC4B8]/40 pt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-white rounded-lg border border-[#CAC4B8] overflow-hidden p-0.5">
                      <button
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="p-1 px-2.5 text-[#6B6B5E] hover:text-[#2C2C24] hover:bg-[#F5F2ED] transition-all focus:outline-none cursor-pointer"
                        title="Reduce quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-[#2C2C24] font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="p-1 px-2.5 text-[#6B6B5E] hover:text-[#2C2C24] hover:bg-[#F5F2ED] transition-all focus:outline-none cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Simple removal button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 rounded text-[#D4A373] hover:bg-[#D4A373]/10 transition-colors focus:outline-none cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Drawer Checkout Footing */}
        {resolvedItems.length > 0 && (
          <div className="p-5 bg-[#FAF9F6] border-t border-[#EAE7E1] flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold text-[#6B6B5E]">Subtotal Amount:</span>
              <strong className="text-xl font-bold text-[#2C2C24] font-mono">
                {formatNaira(grandTotal)}
              </strong>
            </div>

            <p className="text-[10px] text-[#8A8A7A] leading-relaxed">
              *Taxes and eco-friendly foil coverings included. Hot dispatch courier fees calculated directly on the checkout screen options.
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 rounded-xl bg-[#2C2C24] text-[#FAF9F6] font-bold text-xs uppercase tracking-wider hover:bg-[#3D3D3D] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
              >
                <CreditCard className="w-4 h-4 text-[#D4A373] fill-current" />
                CONCLUDE & PAY DIRECT
              </button>
              
              <button
                onClick={onClearCart}
                className="w-full py-2.5 rounded-xl border border-[#EAE7E1] text-[#6B6B5E] font-medium text-[11px] tracking-wide hover:bg-[#F5F2ED] hover:text-red-700 transition-all text-center cursor-pointer"
              >
                Clear Cart Choice
              </button>
              
              <button
                onClick={onClose}
                className="w-full text-center text-xs text-[#6B6B5E] hover:text-[#2C2C24] transition-colors py-2 font-medium cursor-pointer"
              >
                Continue Looking At Menu
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
