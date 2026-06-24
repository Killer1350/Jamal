/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import { PHONE_NUMBER, WHATSAPP_NUMBER } from "../types";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 border-t border-[#EAE7E1] bg-[#F5F2ED]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs text-[#D4A373] font-mono tracking-widest uppercase">Reach Out</span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-light text-[#2C2C24] mt-2">
            Location & Live Channels
          </h2>
          <div className="h-0.5 w-12 bg-[#5A5A40] mx-auto mt-4 rounded-full" />
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Card left: Operational Details */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] bg-[#E8E4DB] text-[#2C2C24] text-left relative overflow-hidden border border-[#DED9CE] flex flex-col justify-between shadow-sm">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col gap-6 relative z-10">
              <h3 className="font-cinzel text-2xl font-bold tracking-tight text-[#2C2C24]">
                Visit or Order Delivery
              </h3>
              <p className="text-sm text-[#6B6B5E] leading-relaxed max-w-lg font-light">
                Enjoy hot, sizzling street-level grills straight off the coals. We package our platters carefully in premium heat-locking gold foil wrappers so they arrive incredibly juicy at your doorstep.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                
                <div className="p-4 rounded-2xl bg-[#F5F2ED]/60 border border-[#CAC4B8]/40 hover:bg-[#F5F2ED] transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-[#2C2C24]">
                    <Clock className="w-4 h-4 text-[#5A5A40]" />
                    <strong className="text-[10px] uppercase font-mono tracking-wider">Timings</strong>
                  </div>
                  <span className="text-xs font-semibold text-[#2C2C24]">12:00 PM – 10:00 PM</span>
                  <p className="text-[10px] text-[#6B6B5E] mt-0.5">Open every single day of the week, including public holidays.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F2ED]/60 border border-[#CAC4B8]/40 hover:bg-[#F5F2ED] transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-[#2C2C24]">
                    <MapPin className="w-4 h-4 text-[#5A5A40]" />
                    <strong className="text-[10px] uppercase font-mono tracking-wider">Location Hub</strong>
                  </div>
                  <span className="text-xs font-semibold text-[#2C2C24] block leading-tight">Riverplate Park, Wuse 2</span>
                  <p className="text-[10px] text-[#6B6B5E] mt-0.5">Ahmadu Bello Way, Wuse 2, Abuja, Nigeria.</p>
                </div>

              </div>
              
              <div className="mt-4 pt-4 border-t border-[#2C2C24]/10 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#5A5A40] inline shrink-0" />
                <span className="text-[11px] text-[#6B6B5E] font-medium leading-relaxed">
                  Fully verified pick-up location in central Wuse 2. Drivers and courier delivery apps accepted easily!
                </span>
              </div>
            </div>

            <div className="mt-8">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5A5A40] text-[#FAF9F6] hover:bg-[#4A4A35] font-semibold text-xs transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D4A373]" />
                Chat WhatsApp Delivery
              </a>
            </div>
          </div>

          {/* Card right: Direct Contact Grid */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-[32px] bg-white border border-[#EAE7E1] text-left flex flex-col justify-between shadow-sm">
            <div className="flex flex-col gap-6">
              <h3 className="font-cinzel text-xl font-bold text-[#2C2C24] tracking-wide">
                Direct Touchpoints
              </h3>
              <p className="text-xs text-[#6B6B5E] leading-relaxed font-light">
                Choose a direct line to inquire about bulk party orders, legendary customized platter menus, or custom spice ratios.
              </p>

              <div className="flex flex-col gap-4">
                
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] hover:border-[#D4A373]/30 hover:bg-[#FAF9F6] transition-all flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4A373]/10 flex items-center justify-center border border-[#D4A373]/20 group-hover:bg-[#D4A373]/20 transition-colors shrink-0">
                    <Phone className="w-4 h-4 text-[#D4A373]" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-semibold font-mono uppercase tracking-wider text-[#8A8A7A]">Call Quick Phone</span>
                    <strong className="text-sm text-[#2C2C24] group-hover:text-[#D4A373] transition-colors">{PHONE_NUMBER}</strong>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] hover:border-emerald-500/30 hover:bg-[#FAF9F6] transition-all flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors shrink-0">
                    <MessageSquare className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-semibold font-mono uppercase tracking-wider text-[#8A8A7A]">WhatsApp Sizzle Line</span>
                    <strong className="text-sm text-[#2C2C24] group-hover:text-emerald-600 transition-colors">+{WHATSAPP_NUMBER}</strong>
                  </div>
                </a>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E1] flex gap-3">
                  <HelpCircle className="w-4.5 h-4.5 text-[#D4A373] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[11px] font-semibold text-[#2C2C24]">Abuja Deliveries</h4>
                    <p className="text-[10px] text-[#6B6B5E]/90 leading-relaxed mt-0.5">
                      Deliveries are dispatched using trusted motorcycle couriers to Wuse, Garki, Maitama, Gwarinpa, Asokoro, Jabi, Utako, and beyond.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <p className="text-[10px] text-[#8A8A7A] mt-8 text-center sm:text-left">
              © Jamal's Suya & Shawarma Abuja. Built for rapid service.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
