/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  variant?: string;
  price: number;
  description: string;
  tags: string[];
}

export interface CartItem {
  id: number;
  quantity: number;
}

export const WHATSAPP_NUMBER = "2347014267704";
export const PHONE_NUMBER = "08027402094";

export const CATEGORIES = [
  "All",
  "Platters",
  "Shawarmas",
  "Burgers",
  "Agege Shawarma",
  "Suya & Grill",
  "Pasta",
  "Rice"
];

// High-quality unsplash food images matching the theme
export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  "Platters": "/legend_platter.jpg",
  "Shawarmas": "/shawarma_real.jpg",
  "Burgers": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
  "Agege Shawarma": "/loaded_loaf.jpg",
  "Suya & Grill": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600",
  "Pasta": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600",
  "Rice": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600"
};

export const MENU_ITEMS: MenuItem[] = [
  // Platters
  {
    id: 39,
    name: "Classic Platter",
    category: "Platters",
    price: 19900,
    description: "Classic sharing platter filled with spiced grilled suya, golden herb-tossed potatoes, tangy signature dipping sauces, fresh garden veggies, and fresh sandwich loaf.",
    tags: ["Best Seller", "Perfect for 2", "Grill Feast"]
  },
  {
    id: 40,
    name: "Legend Platter",
    category: "Platters",
    price: 39900,
    description: "Our legendary ultimate party platter! Fully loaded with tender flank suya, smoked skewered chicken, double sausages, golden-fried potatoes, fresh veggies, sliced baguettes, and three house sauces.",
    tags: ["Massive", "Chef Special", "Feeding 4-5"]
  },
  
  // Shawarmas
  {
    id: 3,
    name: "Classic Chicken or Beef Shawarma",
    category: "Shawarmas",
    variant: "No Sausage",
    price: 4000,
    description: "A crowd-pleaser filled with perfectly marinated, slow-roasted shaving of chicken or beef wrapped in toasted Lebanese pita bread with creamy house mayo, onions, and cabbage.",
    tags: ["Classic", "Quick Bite"]
  },
  {
    id: 4,
    name: "Classic Chicken or Beef Shawarma",
    category: "Shawarmas",
    variant: "With Sausage",
    price: 4000,
    description: "Your selection of tender chicken or beef wrapped in soft flatbread, enhanced by a smoky split-grilled sausage, crisp greens, and spicy signature sauce.",
    tags: ["Classic", "Sausage Addition"]
  },
  {
    id: 5,
    name: "Large Chicken or Beef Shawarma",
    category: "Shawarmas",
    variant: "Double Portion",
    price: 5500,
    description: "Super-sized pita wrap stuffed with double portions of char-grilled beef or roasted chicken, cabbage shreddings, sweet relish, and generous splash of garlic chili cream.",
    tags: ["Satisfying", "Extra meat"]
  },
  {
    id: 6,
    name: "Large Chicken or Beef Shawarma",
    category: "Shawarmas",
    variant: "Triple Sausage",
    price: 6000,
    description: "Our monster large shawarma roll containing three slow-grilled beef frankfurters, loaded roasted meat shavings, crunchy hand-cut slaw, and sweet-and-spicy relish.",
    tags: ["Heavy", "Sausage Lovers"]
  },
  {
    id: 7,
    name: "The Special Shawarma",
    category: "Shawarmas",
    price: 5500,
    description: "Sensational chef wrap containing tender chicken, grilled beef suya, signature smoked chicken strips, and double grilled hot dog sausages wrapped in crisp flatbread.",
    tags: ["Signature Mini Feast", "Spicy"]
  },
  {
    id: 41,
    name: "The Large Special Shawarma",
    category: "Shawarmas",
    price: 7000,
    description: "A colossal portion of premium smoked meats, juicy shredded chicken breast, beef suya shavings, aromatic herbs, three frankfurters, and rich double garlic mayo cream wrapper.",
    tags: ["Showstopper", "Fully Loaded"]
  },

  // Burgers
  {
    id: 42,
    name: "Single Classic Burger",
    category: "Burgers",
    price: 4000,
    description: "Griddle-smashed premium beef patty served with melted cheddar cheese, crisp butterhead lettuce, ripe tomato segment, and secret jamal sauce on toasted brioche bun.",
    tags: ["Juicy", "Classic Burger"]
  },
  {
    id: 8,
    name: "Double Decker Burger",
    category: "Burgers",
    price: 5500,
    description: "Double the pleasure! Two juicy griddle-smashed beef patties, double layers of melty American cheese, sweet pickle chips, and smoke-imbued barbecue relish.",
    tags: ["Must Try", "Satisfying"]
  },
  {
    id: 9,
    name: "Single Smoked Chicken & Beef Burger",
    category: "Burgers",
    price: 4500,
    description: "Unique combination patty: rich griddle beef topped with tender hand-pulled wood-smoked chicken meat, layered with melting gouda and honey mustard dressing.",
    tags: ["Smoke Flavor", "Hybrid Patty"]
  },
  {
    id: 10,
    name: "Double Smoked Chicken & Beef Burger",
    category: "Burgers",
    price: 6000,
    description: "Thick double-layer burger stacking one juicy beef patty, a layer of shredded hot-smoked chicken, double orange cheddar, caramelized gold onions, and spice mayo.",
    tags: ["Rich", "Meaty combo"]
  },
  {
    id: 11,
    name: "Double Decker Special Burger",
    category: "Burgers",
    price: 7500,
    description: "The grand master burger! Heavy stacked classic with double beef patties, tender smoked chicken breast, direct melted double Swiss cheese, and cut grilled sausages.",
    tags: ["Premium", "Giant Feast"]
  },

  // Agege Sandwiches (Loaded Loaf)
  {
    id: 12,
    name: "Full Beef Loaf Sandwich",
    category: "Agege Shawarma",
    price: 5500,
    description: "Traditional Abuja favorite! A soft, cloud-like Agege bread loaf hollowed and stuffed with spiced pan-charred chopped beef suya, cabbage slaw, and rich secret dressings.",
    tags: ["Street Icon", "Soft & Spicy"]
  },
  {
    id: 14,
    name: "Full Chicken Loaf Sandwich",
    category: "Agege Shawarma",
    price: 5500,
    description: "Warm, fresh Agege bread filled to the brim with marinated shredded flame-grilled chicken, rich sweet chili salsa, and creamy herb drizzle.",
    tags: ["Chef Classic", "Hearty Meal"]
  },
  {
    id: 15,
    name: "Fully Loaded Mixed Loaf",
    category: "Agege Shawarma",
    price: 6500,
    description: "A super satisfying, double-protein experience! Tender beef suya and chunks of flame-grilled chicken breast pressed inside a whole buttery Agege sandwich with sweet slaw.",
    tags: ["Highly Recommended", "Ultimate Loaf"]
  },
  {
    id: 16,
    name: "Fully Loaded Special Loaf",
    category: "Agege Shawarma",
    price: 7000,
    description: "The peak of Agege sandwiches: beef suya, chunks of grilled chicken, seasoned hot-smoked poultry strips, side hot dog medallions, and robust layered chilli cream.",
    tags: ["Special", "Heavy Weight"]
  },
  {
    id: 28,
    name: "The Beef Suyazza Sandwich",
    category: "Agege Shawarma",
    price: 7500,
    description: "Our signature invention: an Agege loaf toasted with spicy beef suya chunks, layered pizza style with premium melted mozzarella cheese and oregano-chili dusting.",
    tags: ["Suyazza", "Cheese Melt"]
  },
  {
    id: 29,
    name: "The Chicken Suyazza Sandwich",
    category: "Agege Shawarma",
    price: 8000,
    description: "Warm and toasted signature Agege bread overflowing with marinated grilled chicken pieces, dynamic sweet sauce, and heavy melted premium mozzarella.",
    tags: ["Suyazza Special", "Cheese Heaven"]
  },
  {
    id: 30,
    name: "The Combo Suyazza Sandwich",
    category: "Agege Shawarma",
    price: 8500,
    description: "The ultimate cheese-pull master. Tender beef suya, chicken skewers, side sausages, and thick gooey layers of warm mozzarella cheese cooked pizza-sandwich style.",
    tags: ["Signature Masterpiece", "Heavy Cheese"]
  },

  // Suya & Grill
  {
    id: 19,
    name: "Flame-Grilled Half Chicken with Pita",
    category: "Suya & Grill",
    price: 7950,
    description: "Half spring chicken slow-grilled over hot red embers while basted in spicy pepper infusion, served with soft pita flatbread segments and sweet onion shavings.",
    tags: ["Charcoal Grill", "Fiery Flavor"]
  },
  {
    id: 20,
    name: "Chicken Suya Wrap Especial",
    category: "Suya & Grill",
    price: 7000,
    description: "Fine, tender chicken breast sliced, dry-rubbed with roasted peanut kuli-kuli spices, flame-grilled and layered in a golden toasted wrap with fresh cabbage and sweet pepper.",
    tags: ["Traditional Suya", "Wrap"]
  },
  {
    id: 21,
    name: "Beef Suya Wrap Especial",
    category: "Suya & Grill",
    price: 7000,
    description: "Traditional hot beef suya strips tossed with original Abuja-style yaji pepper spice, onions, and wrapped into toasted pita with subtle honey glaze.",
    tags: ["Abuja Style", "Yaji Kick"]
  },
  {
    id: 22,
    name: "Combo Suya Wrap Mix",
    category: "Suya & Grill",
    price: 7500,
    description: "Double the fire! Combined selection of both chicken and beef roasted suya meat seasoned with premium spicy kuli-kuli powder, wrapped in soft toasted flatbread.",
    tags: ["Best of Both", "Spicy Lovers"]
  },

  // Rice
  {
    id: 23,
    name: "Chicken Jambalaya Rice",
    category: "Rice",
    price: 4500,
    description: "Richly seasoned long-grain rice pan-cooked with juicy charred chicken breast nuggets, tomato stock, bell peppers, onions, and Creole suya spices.",
    tags: ["Smoky Rice", "Fast Seller"]
  },
  {
    id: 24,
    name: "Chicken & Sausage Jambalaya",
    category: "Rice",
    price: 5000,
    description: "Creole-style spiced rice infused with rich beef broth, smoked chicken bits, and juicy grilled sausage medallions for an incredible smoky savory texture.",
    tags: ["Crowd Pleaser", "Comfort Food"]
  },
  {
    id: 25,
    name: "Beef Suya Jambalaya Rice",
    category: "Rice",
    price: 7500,
    description: "A gorgeous modern fusion. Our flame-spiced signature Jambalaya rice generous topped with newly roasted beef suya shavings, sweet peppers, and side tomatoes.",
    tags: ["Fusion Favorite", "Beef Lovers"]
  },
  {
    id: 26,
    name: "Chicken Suya Jambalaya Rice",
    category: "Rice",
    price: 7900,
    description: "A spectacular dry-rubbed chicken suya steak, sliced and placed on a steaming mountain of fragrant Creole herbs and jambalaya rice, served with signature salad.",
    tags: ["Spicy Peak", "Suya Combo"]
  },
  {
    id: 27,
    name: "Combo Juba Rice Platter",
    category: "Rice",
    price: 8500,
    description: "Specialty mixed platter of both beef suya, chicken slices, side sausage medallions, and rich pepper sauces served with a double portion of Creole Jambalaya rice.",
    tags: ["Double Size", "Hungry Feast"]
  },

  // Pasta
  {
    id: 31,
    name: "Creamy Pasta Alfredo Plain",
    category: "Pasta",
    price: 7500,
    description: "Rich Italian fettuccine sautéed with a luxurious sauce of garlic, single heavy dairy cream, fresh herbs, and premium grated parmesan cheese.",
    tags: ["Creamy", "Herbaceous"]
  },
  {
    id: 32,
    name: "Chicken Suya Pasta Alfredo",
    category: "Pasta",
    price: 7500,
    description: "Perfect marriage of European and African tastes. Creamy alfredo fettuccine pasta topped with freshly carved hot-spiced chicken suya pieces and green peas.",
    tags: ["Creamy Spice", "Must Order"]
  }
];

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface UserSession {
  user: User;
  token: string;
}

