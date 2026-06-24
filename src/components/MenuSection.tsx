/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, SlidersHorizontal, Plus, MessageSquare, Compass, Info, Check, Flame } from "lucide-react";
import { CATEGORIES, MenuItem, WHATSAPP_NUMBER, CATEGORY_PLACEHOLDERS } from "../types";
import { formatNaira } from "./CartModal";

interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddToCart: (id: number) => void;
  onOpenCart: () => void;
}

export default function MenuSection({ menuItems, onAddToCart, onOpenCart }: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("featured");
  const [addedItemNotifications, setAddedItemNotifications] = useState<Record<number, boolean>>({});

  // Dynamic filter lists
  const filteredItems = (menuItems || []).filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some((t) => t.toLowerCase().includes(query)) ||
      (item.variant && item.variant.toLowerCase().includes(query));

    const matchesCategory = activeCategory === "All" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Dynamic sorting lists
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        // Featured default ordering
        return a.id - b.id;
    }
  });

  const handleAddToCartWithNotice = (id: number) => {
    onAddToCart(id);
    setAddedItemNotifications((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItemNotifications((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleOrderSingleItem = (item: MenuItem) => {
    const variantLabel = item.variant ? ` (${item.variant})` : "";
    const text = `Hello! I would like to order: *${item.name}${variantLabel}* for *${formatNaira(item.price)}*.\n\nIs this available for delivery today?`;
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="menu" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search, Filter & Sort Row Controls */}
        <div className="bg-[#E8E4DB]/95 backdrop-blur p-5 rounded-3xl border border-[#DED9CE] shadow-sm flex flex-col gap-4 sticky top-[73px] z-20">
          
          <div className="flex flex-col md:flex-row gap-3 items-stretch justify-between text-left">
            {/* Search Input Box */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A7A]" />
              <input
                type="text"
                placeholder="Search tasty suya, shawarmas, platters, burger, pasta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#CAC4B8] focus:border-[#5A5A40] text-sm text-[#2C2C24] placeholder-[#8A8A7A]/60 pl-11 pr-5 py-3.5 rounded-2xl outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all font-light"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded bg-[#F5F2ED] text-[#2C2C24] hover:bg-[#E8E4DB]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown select */}
            <div className="relative md:w-60 flex items-center gap-2">
              <span className="text-xs text-[#6B6B5E] shrink-0 hidden lg:inline font-mono uppercase tracking-wider">
                Sort by:
              </span>
              <div className="relative w-full">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5A40]" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full appearance-none bg-white border border-[#CAC4B8] focus:border-[#5A5A40] text-xs text-[#2C2C24] pl-10 pr-10 py-3.5 rounded-2xl outline-none focus:ring-1 focus:ring-[#5A5A40]/25 cursor-pointer text-left"
                >
                  <option value="featured">Featured Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Alphabetical A-Z</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A8A7A] text-[9px]">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Category Pill Tabs Carousel */}
          <div className="flex items-center gap-2 border-t border-[#DED9CE] pt-3 text-left">
            <span className="text-[10px] text-[#6B6B5E] uppercase tracking-wider font-semibold shrink-0 hidden lg:inline">
              Category:
            </span>
            <div className="flex-1 overflow-x-auto scrollbar-none flex gap-2 pb-1 snap-x">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap snap-start transition-all cursor-pointer ${
                    activeCategory === category
                      ? "bg-[#5A5A40] text-[#FAF9F6] shadow-sm"
                      : "bg-[#F5F2ED] text-[#6B6B5E] hover:bg-white hover:text-[#2C2C24] border border-[#CAC4B8]/40"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Dynamic Category Summary Heading & Counts */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-12 mb-8 text-left">
          <div>
            <span className="text-xs text-[#D4A373] font-mono tracking-wider uppercase flex items-center gap-1.5 font-bold">
              <Compass className="w-4 h-4 text-[#5A5A40] animate-spin-slow" />
              Sizzling Selection
            </span>
            <h3 className="font-cinzel text-2xl md:text-3xl font-light text-[#2C2C24] mt-1">
              {activeCategory === "All" ? "Full Sizzle Menu" : activeCategory}
            </h3>
          </div>
          <p className="text-xs text-[#6B6B5E] font-light">
            Showing <strong className="text-[#5A5A40] font-mono text-sm">{sortedItems.length}</strong> delicacies matched
          </p>
        </div>

        {/* Dynamic Grid Listings */}
        {sortedItems.length === 0 ? (
          <div className="py-16 px-4 rounded-[32px] bg-[#F5F2ED] border border-[#EAE7E1] text-center mt-6 flex flex-col items-center justify-center gap-4">
            <Info className="w-10 h-10 text-[#D4A373] shrink-0" />
            <div>
              <h4 className="font-cinzel text-lg font-bold text-[#2C2C24]">No Items Matched Your Search</h4>
              <p className="text-xs text-[#6B6B5E] max-w-md mx-auto mt-1">
                We couldn't see anything matching "{searchQuery}". Try modifying your keyword query, clearing search, or selecting another category.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="px-5 py-2.5 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] hover:bg-[#5A5A40]/20 text-xs font-semibold transition-all border border-[#5A5A40]/25"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => (
              <article
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden bg-white border border-[#EAE7E1] rounded-[24px] hover:border-[#CAC4B8] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 text-left"
              >
                {/* Product Photo / Illustrative visual image wrapper */}
                <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-[#FAF9F6]">
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
                        : CATEGORY_PLACEHOLDERS[item.category] || CATEGORY_PLACEHOLDERS["Shawarmas"]
                    }
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90 brightness-[0.94]"
                  />
                  
                  {/* Category Stamp Badge */}
                  <span className="absolute top-4 left-4 text-[9px] uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded-full bg-[#FAF9F6]/90 backdrop-blur-sm text-[#D4A373] border border-[#CAC4B8]">
                    {item.category}
                  </span>

                  {/* Best seller helper tag */}
                  {item.tags.includes("Best Seller") && (
                    <span className="absolute top-4 right-4 text-[9px] uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded-full bg-[#5A5A40] text-white flex items-center gap-1 shadow-sm">
                      <Flame className="w-2.5 h-2.5 text-[#D4A373] animate-pulse" />
                      Popular
                    </span>
                  )}
                  
                  {/* Subtle lower gradient overlay for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Card description Body */}
                <div className="p-5.5 flex-1 flex flex-col justify-between gap-4">
                  
                  <div className="flex flex-col gap-2">
                    {/* Header item Name & Price row */}
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-cinzel text-base font-bold text-[#2C2C24] tracking-wide leading-snug group-hover:text-[#5A5A40] transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-xs font-bold text-[#5A5A40] font-mono shrink-0 px-2.5 py-1 rounded bg-[#5A5A40]/5 border border-[#5A5A40]/15">
                        {formatNaira(item.price)}
                      </span>
                    </div>

                    {/* Variant Tag badges row */}
                    {item.variant && !(
                      item.variant.startsWith("http") ||
                      item.variant.startsWith("/") ||
                      item.variant.startsWith("assets/") ||
                      item.variant.toLowerCase().endsWith(".jpg") ||
                      item.variant.toLowerCase().endsWith(".jpeg") ||
                      item.variant.toLowerCase().endsWith(".png") ||
                      item.variant.toLowerCase().endsWith(".webp")
                    ) && (
                      <span className="inline-block self-start text-[9px] font-mono text-[#D4A373] bg-[#D4A373]/5 border border-[#D4A373]/20 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                        Spec: {item.variant}
                      </span>
                    )}

                    {/* Dynamic Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold tracking-wider text-[#6B6B5E] bg-[#F5F2ED] border border-[#EAE7E1] rounded-full px-2.5 py-0.5 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-xs text-[#6B6B5E] leading-relaxed font-light mt-1.5 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Operational Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3.5 border-t border-[#EAE7E1]">
                    
                    <button
                      onClick={() => handleAddToCartWithNotice(item.id)}
                      className={`py-3 rounded-2xl font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none ${
                        addedItemNotifications[item.id]
                          ? "bg-emerald-600 text-[#FAF9F6] shadow-sm"
                          : "bg-[#5A5A40] text-white hover:bg-[#4A4A35]"
                      }`}
                    >
                      {addedItemNotifications[item.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          Added!
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-[#D4A373]" />
                          Add To Cart
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleOrderSingleItem(item)}
                      className="py-3 rounded-2xl bg-[#F5F2ED] text-[#2C2C24] hover:bg-[#E8E4DB] px-4 border border-[#EAE7E1] font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#D4A373]" />
                      Order Now
                    </button>
                    
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
