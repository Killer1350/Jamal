/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Coffee, ShieldCheck, Mail, MapPin, Instagram, Phone, ShoppingCart, MessageSquare, Flame } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MenuSection from "./components/MenuSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import CartModal from "./components/CartModal";
import CheckoutModal from "./components/CheckoutModal";
import OrderTracker from "./components/OrderTracker";
import AdminDashboard from "./components/AdminDashboard";
import AuthModal from "./components/AuthModal";
import OrderHistoryModal from "./components/OrderHistoryModal";
import { CartItem, WHATSAPP_NUMBER, PHONE_NUMBER, MenuItem, MENU_ITEMS, UserSession } from "./types";

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const persisted = localStorage.getItem("jamal_suya_cart");
      return persisted ? JSON.parse(persisted) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const persisted = localStorage.getItem("jamal_user_session");
      return persisted ? JSON.parse(persisted) : null;
    } catch {
      return null;
    }
  });

  const [activeTrackerOrderId, setActiveTrackerOrderId] = useState<string | null>(() => {
    return localStorage.getItem("jamal_active_order_track") || null;
  });
  
  const [showFloatingCart, setShowFloatingCart] = useState(false);

  // Sync user session to local storage
  useEffect(() => {
    if (userSession) {
      localStorage.setItem("jamal_user_session", JSON.stringify(userSession));
    } else {
      localStorage.removeItem("jamal_user_session");
    }
  }, [userSession]);

  // Sync active order tracker reference
  useEffect(() => {
    if (activeTrackerOrderId) {
      localStorage.setItem("jamal_active_order_track", activeTrackerOrderId);
    } else {
      localStorage.removeItem("jamal_active_order_track");
    }
  }, [activeTrackerOrderId]);

  // Dynamic menu initialization from backend API
  const refreshMenu = async () => {
    try {
      const resp = await fetch("/api/menu");
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.length > 0) {
          setMenuItems(data);
          return;
        }
      }
    } catch (err) {
      console.warn("API menu loading failed, backing up to default hardcoded lists.");
    }
    // Fallback seed
    setMenuItems(MENU_ITEMS);
  };

  useEffect(() => {
    refreshMenu();
  }, []);

  // Sync cart object to local storage
  useEffect(() => {
    try {
      localStorage.setItem("jamal_suya_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to persist cart:", e);
    }
  }, [cart]);

  // Monitor screen scroll to trigger the floating quick cart pill
  useEffect(() => {
    const handleScroll = () => {
      // Show floating cart when scrolled past 300px
      setShowFloatingCart(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = (id: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id, quantity: 1 }];
    });
  };

  const handleUpdateQty = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleReorder = (items: { id: number; quantity: number }[]) => {
    setCart((prevCart) => {
      let nextCart = [...prevCart];
      items.forEach((newItem) => {
        const existing = nextCart.find((it) => it.id === newItem.id);
        if (existing) {
          existing.quantity += newItem.quantity;
        } else {
          nextCart.push({ id: newItem.id, quantity: newItem.quantity });
        }
      });
      return nextCart;
    });
    setIsCartOpen(true);
  };

  const handleExploreMenu = () => {
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      const offset = 90; // account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = menuSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Compute subtotal dynamically for cart modal and checkout mapping
  const currentCartTotal = cart.reduce((sum, cartItem) => {
    const matched = menuItems.find((it) => it.id === cartItem.id);
    return sum + (matched ? matched.price * cartItem.quantity : 0);
  }, 0);

  // Map cart items with their matched name details
  const structuredCartItems = cart
    .map((c) => {
      const item = menuItems.find((m) => m.id === c.id);
      return item
        ? {
            id: item.id,
            name: item.name,
            quantity: c.quantity,
            price: item.price,
            variant: item.variant || undefined,
          }
        : null;
    })
    .filter(Boolean) as any[];

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden relative">
      
      {/* Dynamic Navigation Sticky Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        userSession={userSession}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={() => setUserSession(null)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Primary Landing Page Container */}
      <main className="flex-grow">
        
        {/* Cinematic Grill Hero Spotlight Banner */}
        <Hero onExploreMenu={handleExploreMenu} />

        {/* Highlight Banner / Features strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] hover:border-[#5A5A40]/15 transition-all text-left flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#5A5A40]/10 border border-[#5A5A40]/25 flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-5 h-5 text-[#5A5A40] animate-pulse" />
              </div>
              <div>
                <strong className="block text-sm text-[#2C2C24] font-semibold">Grill Mastery</strong>
                <span className="text-xs text-[#6B6B5E] font-light leading-relaxed mt-1 block">
                  Original yaji pepper blended by hand, wood hickory smoked to perfection.
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] hover:border-[#D4A373]/15 transition-all text-left flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4A373]/10 border border-[#D4A373]/25 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-[#D4A373]" />
              </div>
              <div>
                <strong className="block text-sm text-[#2C2C24] font-semibold">Safe Paystack Channels</strong>
                <span className="text-xs text-[#6B6B5E] font-light leading-relaxed mt-1 block">
                  Pay directly via secure credit cards or bank transfers instantly inside this portal.
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] hover:border-[#5A5A40]/15 transition-all text-left flex items-start gap-4 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#5A5A40]/10 border border-[#5A5A40]/25 flex items-center justify-center shrink-0 mt-0.5">
                <ShoppingCart className="w-5 h-5 text-[#5A5A40]" />
              </div>
              <div>
                <strong className="block text-sm text-[#2C2C24] font-semibold">Central Abuja delivery</strong>
                <span className="text-xs text-[#6B6B5E] font-light leading-relaxed mt-1 block">
                  Dispatched out of Riverplate Park quickly via expert swift logistics.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Live track banner if user has an active order */}
        {activeTrackerOrderId && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-2">
            <div className="p-4 rounded-2xl bg-[#5A5A40]/10 border border-[#5A5A40]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div>
                <strong className="text-xs text-[#2C2C24] block">You have a sizzling order underway!</strong>
                <span className="text-[11px] text-[#6B6B5E] block mt-0.5">Order ID: <strong className="font-mono text-[#5A5A40]">{activeTrackerOrderId}</strong>. Check preparation status real-time.</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTrackerOrderId(null)}
                  className="px-4 py-2 border border-[#CAC4B8] text-[10px] font-bold uppercase rounded-lg hover:bg-white text-[#8A8A7A]"
                >
                  Dismiss Tracking Banner
                </button>
                <button
                  onClick={() => {
                    // Open tracking console modal/view
                    const el = document.getElementById("order-tracking-anchor");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-[10px] font-bold uppercase rounded-lg hover:bg-[#4A4A35]"
                >
                  Track Cooking Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filterable Menu Catalog Grid Section */}
        <MenuSection
          menuItems={menuItems}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Anchor for centering dynamic order tracker window */}
        <div id="order-tracking-anchor" />

        {/* Real-Time Order Tracker view overlay */}
        {activeTrackerOrderId && (
          <div className="py-6 border-t border-[#EAE7E1] bg-[#FAF9F6]">
            <OrderTracker orderId={activeTrackerOrderId} onClose={() => setActiveTrackerOrderId(null)} />
          </div>
        )}

        {/* About Jamal's Heritage Narratives */}
        <AboutSection />

        {/* Contact info grid (hour details, timings, address map specs) */}
        <ContactSection />

      </main>

      {/* Footer copyright stamp line */}
      <footer className="border-t border-[#EAE7E1] bg-[#F5F2ED] py-12 text-center text-[#6B6B5E] selection:bg-[#5A5A40] selection:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 group cursor-default">
            <Flame className="w-5 h-5 text-[#5A5A40]" />
            <span className="font-cinzel text-sm font-bold tracking-widest text-[#2C2C24]">
              JAMAL'S SUYA & SHAWARMA
            </span>
          </div>
          <p className="text-xs text-[#8A8A7A] font-light max-w-sm sm:max-w-none">
            &copy; {new Date().getFullYear()} Jamal's Suya & Shawarma. Modern payment & direct admin portal. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/jamalsshawarma/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#6B6B5E] hover:text-[#2C2C24] transition-colors font-medium"
            >
              Instagram Feed
            </a>
            <span className="text-black/10">|</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-xs text-[#5A5A40] hover:text-[#2C2C24] transition-colors font-bold cursor-pointer"
            >
              Kitchen Hub Login
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Action Cart Overlay Drawer Button */}
      {showFloatingCart && totalCartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-6 py-4 rounded-full bg-gradient-to-r from-[#5A5A40] to-[#D4A373] text-[#FAF9F6] font-[#FAF9F6] font-extrabold text-sm shadow-md hover:-translate-y-1 hover:brightness-110 active:translate-y-0 transition-all focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 animate-slide-up cursor-pointer"
          aria-label="Open Cart"
        >
          <ShoppingCart className="w-4 h-4 text-[#FAF9F6] animate-pulse" />
          <span>My Cart Selection ({totalCartCount})</span>
        </button>
      )}

      {/* Cart Modal Container Drawer Backdrop overlay */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        menuItems={menuItems}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal Form Overlay */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartTotal={currentCartTotal}
        cartItems={structuredCartItems}
        onOrderSuccess={(id) => {
          setActiveTrackerOrderId(id);
          // Auto scroll nicely down to tracker section
          setTimeout(() => {
            const el = document.getElementById("order-tracking-anchor");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }}
        onClearCart={handleClearCart}
        userSession={userSession}
      />

      {/* Admin Dashboard Page Overlay */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          menuItems={menuItems}
          onRefreshMenu={refreshMenu}
        />
      )}

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(session) => setUserSession(session)}
      />

      {/* User Past Order History Logs */}
      {userSession && (
        <OrderHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          userEmail={userSession.user.email}
          onTrackOrder={(orderId) => {
            setActiveTrackerOrderId(orderId);
            setTimeout(() => {
              const el = document.getElementById("order-tracking-anchor");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 300);
          }}
          onReorder={handleReorder}
        />
      )}

    </div>
  );
}
