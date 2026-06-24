/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Sparkles, TrendingUp, Clock, HelpCircle, ArrowRight } from "lucide-react";
import { WHATSAPP_NUMBER } from "../types";

interface HeroProps {
  onExploreMenu: () => void;
}

export default function Hero({ onExploreMenu }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 md:py-36">
      
      {/* Decorative Brand Spotlights */}
      <div className="absolute top-1/4 left-1/10 w-80 h-80 rounded-full bg-[#5A5A40]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-[#D4A373]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Premium Pitch */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            
            <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4A373] text-[#D4A373] text-[10px] font-bold uppercase tracking-widest bg-[#D4A373]/5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              Abuja’s No. 1 Street Grill
            </div>

            <h2 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-light text-[#2C2C24] leading-[1.1] tracking-tight">
              Cultivating juicy <span className="italic font-normal block sm:inline text-[#5A5A40]">grilled flavor</span>, stacked platters & instant orders.
            </h2>

            <p className="text-[#6B6B5E] text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              Jamal's merges premium charcoal-seared suya, loaded Agege loaves, giant stacked burgers, rich pasta alfredo, and hearty jambalaya rice into one refined street food masterpiece. Perfect for solo cravings, family gatherings, or late-night Abuja delivery.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <button
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#5A5A40] hover:bg-[#4A4A35] text-[#FAF9F6] font-medium text-sm transition-all shadow-sm cursor-pointer"
              >
                Explore Full Menu
                <ArrowRight className="w-4 h-4 text-[#D4A373]" />
              </button>
              <a
                href="https://www.instagram.com/jamalsshawarma/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#CAC4B8] text-[#2C2C24] hover:bg-[#FAF9F6]/80 font-medium text-sm transition-all"
              >
                View Instagram
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#EAE7E1] text-left">
              <div>
                <span className="block text-[#5A5A40] text-xl font-bold font-mono">100%</span>
                <span className="text-xs text-[#8A8A7A] font-light">Fresh Halal Beef & Poultry</span>
              </div>
              <div>
                <span className="block text-[#5A5A40] text-xl font-bold font-mono">12 - 10</span>
                <span className="text-xs text-[#8A8A7A] font-light">PM Daily Delivery windows</span>
              </div>
              <div>
                <span className="block text-[#5A5A40] text-xl font-bold font-mono">Wuse 2</span>
                <span className="text-xs text-[#8A8A7A] font-light">Abuja Pick-up Hub</span>
              </div>
            </div>

          </div>

          {/* Right Column: Favorites Bento Grid Panel in Natural Tones sand clay card style */}
          <div className="lg:col-span-5">
            <div className="relative p-6 sm:p-8 rounded-[40px] bg-[#E8E4DB] border border-[#DED9CE] shadow-sm overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FAF9F6]/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#2C2C24] tracking-wide">
                    Customer Favorites
                  </h3>
                  <p className="text-xs text-[#6B6B5E]">
                    Infrastructure for serious appetite and pristine decisions.
                  </p>
                </div>

                {/* Grid Item Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  
                  <div className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] hover:border-[#5A5A40]/30 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-[#5A5A40]" />
                      <strong className="text-xs text-[#2C2C24] font-medium">Legend Platter</strong>
                    </div>
                    <span className="text-[11px] text-[#6B6B5E] leading-relaxed block">
                      Fully loaded with mixed suya, sides, house sauce pots, and loaves.
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] hover:border-[#5A5A40]/30 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-[#D4A373]" />
                      <strong className="text-xs text-[#2C2C24] font-medium">Classic Platter</strong>
                    </div>
                    <span className="text-[11px] text-[#6B6B5E] leading-relaxed block">
                      Spiced grilled meats, roasted golden potatoes, salad, and sandwich baguette.
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white rounded-2xl border border-[#CAC4B8] hover:border-[#5A5A40]/40 transition-all shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-[#D4A373]" />
                      <strong className="text-[11px] text-[#2C2C24] font-bold italic">Combo Suyazza</strong>
                    </div>
                    <span className="text-[11px] text-[#6B6B5E] leading-relaxed block">
                      Premium toasted sandwich with suya dry rub & warm mozzarella cheese.
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] hover:border-[#5A5A40]/30 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-[#5A5A40]" />
                      <strong className="text-xs text-[#2C2C24] font-medium">Jambalaya Rice</strong>
                    </div>
                    <span className="text-[11px] text-6B6B5E leading-relaxed block">
                      Fragrant Cajun long-grain rice stacked with double sausages and juicy chicken.
                    </span>
                  </div>

                </div>

                {/* Subtext info */}
                <div className="p-4.5 rounded-2xl bg-[#F5F2ED] border border-[#EAE7E1] flex gap-3 text-left">
                  <HelpCircle className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#2C2C24]">Seamless Delivery Protocol</h4>
                    <p className="text-[11px] text-[#6B6B5E] leading-relaxed mt-0.5">
                      Order securely: browse the sections, queue quantity selections in your cart, and click checkout to construct a pre-filled instant WhatsApp order!
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
