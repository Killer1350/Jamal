/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { ShoppingBag, Instagram, Menu, X, Flame, Phone, User, LogOut, ClipboardList } from "lucide-react";
import { WHATSAPP_NUMBER, UserSession } from "../types";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  userSession: UserSession | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenHistory: () => void;
}

export default function Header({ 
  cartCount, 
  onOpenCart, 
  onOpenAdmin,
  userSession,
  onOpenAuth,
  onSignOut,
  onOpenHistory
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-[#FAF9F6]/95 backdrop-blur-md py-3 shadow-sm border-[#EAE7E1]"
          : "bg-transparent py-5 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#2C2C24]/10 shadow-md flex items-center justify-center bg-black transition-all group-hover:border-[#5A5A40] duration-300">
              <img 
                src="/logo.jpg" 
                alt="Jamal's Suya & Shawarma" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-cinzel text-base md:text-lg font-bold tracking-tight text-[#2C2C24] flex items-center gap-1 group-hover:text-brand-red transition-colors">
                JAMAL'S <span className="text-[#FAF9F6] text-[9px] px-1.5 py-0.5 rounded bg-[#5A5A40] font-sans font-bold uppercase tracking-wider ml-1">SUYA & SHAW</span>
              </h1>
              <p className="text-[#8A8A7A] text-[9px] font-semibold uppercase tracking-widest leading-none mt-0.5">
                Luxury Taste. Grill Mastery.
              </p>
            </div>
          </button>

          {/* Desktop Navigation Link Cluster */}
          <nav className="hidden md:flex items-center gap-6 font-sans">
            <button
              onClick={() => scrollToSection("menu")}
              className="text-[#6B6B5E] hover:text-[#2C2C24] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Our Menu
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-[#6B6B5E] hover:text-[#2C2C24] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Story & Craft
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-[#6B6B5E] hover:text-[#2C2C24] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Delivery & Hours
            </button>
            <button
              onClick={onOpenAdmin}
              className="px-2 py-0.5 text-[#8A8A7A] hover:text-[#2C2C24] text-[9px] font-bold uppercase tracking-widest transition-colors bg-[#5A5A40]/5 border border-[#5A5A40]/10 rounded font-mono"
              title="Access central dashboard logs"
            >
              Admin
            </button>

            {/* User Session Cluster */}
            <div className="flex items-center gap-3 border-l border-[#EAE7E1] pl-4 font-sans text-xs">
              {userSession ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={onOpenHistory}
                    className="text-[#2C2C24] hover:text-[#5A5A40] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="View My Past Orders"
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={onSignOut}
                    className="text-[#8A8A7A] hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                    title="Sign Out of My Account"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Exit</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="text-[#5A5A40] hover:text-[#2C2C24] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Instagram link */}
            <a
              href="https://www.instagram.com/jamalsshawarma/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center justify-center p-2.5 rounded-full bg-[#F5F2ED] text-[#3D3D3D] border border-[#EAE7E1] hover:bg-[#EAE7E1] transition-all"
              title="Follow our Instagram"
            >
              <Instagram className="w-4 h-4 text-brand-amber" />
            </a>

            {/* Float Menu Cart */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#5A5A40] text-[#FAF9F6] hover:bg-[#4A4A35] transition-all shadow-sm active:scale-95 group focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30"
            >
              <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Cart ({cartCount})
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D4A373] animate-ping opacity-90" />
              )}
            </button>

            {/* WhatsApp Call To Action */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-[#2C2C24] text-white hover:bg-[#3D3D3D] font-bold text-xs shadow-sm hover:scale-[1.01] transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
              Order Fast
            </a>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-lg bg-[#F5F2ED] text-[#3D3D3D] border border-[#EAE7E1] hover:bg-[#EAE7E1] transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <div
        className={`fixed inset-0 top-[73px] bg-[#FAF9F6]/98 z-40 transition-all duration-300 md:hidden flex flex-col justify-between border-t border-[#EAE7E1] ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto shadow-2xl" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <button
            onClick={() => scrollToSection("menu")}
            className="w-full text-left py-3.5 border-b border-[#EAE7E1] text-base font-medium text-[#2C2C24] hover:text-[#5A5A40] cursor-pointer"
          >
            Our Full Menu
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="w-full text-left py-3.5 border-b border-[#EAE7E1] text-base font-medium text-[#2C2C24] hover:text-[#5A5A40] cursor-pointer"
          >
            Story & Craft
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="w-full text-left py-3.5 border-b border-[#EAE7E1] text-base font-medium text-[#2C2C24] hover:text-[#5A5A40] cursor-pointer"
          >
            Delivery Info & Hours
          </button>

          {/* User Account / Navigation sections for Mobile view */}
          {userSession ? (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenHistory();
                }}
                className="w-full text-left py-3.5 border-b border-[#EAE7E1] text-base font-semibold text-[#2C2C24] hover:text-[#5A5A40] flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#D4A373]" />
                  <span>My Past Orders</span>
                </span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4A373]/10 text-[#D4A373] uppercase">LOGS</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full text-left py-3.5 border-b border-[#EAE7E1] text-base font-semibold text-red-600 hover:text-red-700 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({userSession.user.name})</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full text-left py-3.5 border-b border-[#EAE7E1] text-base font-semibold text-[#5A5A40] hover:text-[#2C2C24] flex items-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#D4A373]" />
              <span>Sign In / Join Feasters</span>
            </button>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="w-full text-left py-3.5 border-b border-[#EAE7E1] text-xs font-semibold text-[#8A8A7A] hover:text-[#2C2C24] flex items-center justify-between cursor-pointer"
          >
            <span>Kitchen Hub (Admin)</span>
            <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#5A5A40]/10 text-[#5A5A40] uppercase">LAUNCH</span>
          </button>

          <a
            href="https://www.instagram.com/jamalsshawarma/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-3.5 text-base font-medium text-[#2C2C24] hover:text-[#5A5A40]"
          >
            <Instagram className="w-4 h-4 text-[#D4A373]" /> Instagram Feed
          </a>
        </div>

        <div className="p-6 bg-[#F5F2ED] border-t border-[#EAE7E1] grid gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#2C2C24] text-white hover:bg-[#3D3D3D] font-bold text-sm tracking-wide shadow-sm"
          >
            <Phone className="w-4 h-4 text-[#D4A373]" />
            ORDER DIRECT PROTOCOL
          </a>
          <p className="text-center text-[11px] text-[#8A8A7A]">
            Enquiries: 08027402094 | Hours: 12pm - 10pm Daily
          </p>
        </div>
      </div>
    </header>
  );
}
