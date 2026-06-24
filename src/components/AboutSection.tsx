/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Star, Award, Heart } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 border-t border-[#EAE7E1] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#5A5A40]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs text-[#D4A373] font-mono tracking-widest uppercase">The Heritage</span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-light text-[#2C2C24] mt-2">
            Story, Flavor & Pure Wood Smoke
          </h2>
          <div className="h-0.5 w-12 bg-[#5A5A40] mx-auto mt-4 rounded-full" />
        </div>

        {/* Narrative Asymmetric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-8 rounded-3xl bg-[#F5F2ED] border border-[#EAE7E1] shadow-sm relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5A5A40]/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
            
            <div className="flex flex-col gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#5A5A40]/10 flex items-center justify-center border border-[#5A5A40]/20">
                <Flame className="w-5 h-5 text-[#5A5A40]" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-[#2C2C24] tracking-wide">
                Abuja’s Grill Authority
              </h3>
              <p className="text-[#6B6B5E] text-sm leading-relaxed font-light">
                At Jamal's Suya & Shawarma, we don't skip steps. Our specialized chefs hand-slice premium beef flanks and chicken breasts daily, dusting them in our curated yaji powder—a complex seasoning of roasted ground peanuts, dry ginger, red peppers, and aromatic spices.
              </p>
              <p className="text-[#6B6B5E] text-sm leading-relaxed font-light">
                Slow-roasted over authentic wood charcoal, each stick or platter carries that unmistakable hickory smokiness that gas grills can never replicate.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-8 text-[#D4A373] text-[11px] font-bold tracking-wider uppercase font-mono">
              <Star className="w-4 h-4 text-[#D4A373] fill-[#D4A373]" />
              <span>Abuja's premier late-night culinary spot.</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#E8E4DB] text-[#2C2C24] border border-[#CAC4B8] shadow-sm relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#D4A373]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
            
            <div className="flex flex-col gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#2C2C24]/10 flex items-center justify-center border border-[#2C2C24]/20">
                <Award className="w-5 h-5 text-[#2C2C24]" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-[#2C2C24] tracking-wide">
                Why Our Food Knocks
              </h3>
              <p className="text-[#3D3D3D] text-sm leading-relaxed font-light">
                By fusing traditional Northern Nigerian barbecue (Suya) with Mediterranean shawarma rolls, stacked Western brioche burgers, Italian creamy alfredo pastas, and Creole jambalaya rice, our menu represents the absolute ultimate playbook of comfort meals.
              </p>
              <p className="text-[#3D3D3D] text-sm leading-relaxed font-light">
                Whether you’re in the mood for the gooey cheese-pull of our signature **Suyazza Sandwiches** or sharing a majestic **Legend Platter** with friends in Riverplate Park, our mission is to guarantee maximum flavor value in every single bite.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-8 text-[#5A5A40] text-[11px] font-bold tracking-wider uppercase font-mono">
              <Heart className="w-4 h-4 text-[#5A5A40] fill-[#5A5A40]" />
              <span>Handcrafted daily by Abuja grill veterans.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
