/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data file paths
const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const MENU_FILE = path.join(DATA_DIR, "menu_config.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Menu Seeds (derived from types.ts list)
const INITIAL_MENU_ITEMS = [
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

// Read/write helpers
const readOrders = (): any[] => {
  if (!fs.existsSync(ORDERS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading orders, resetting:", err);
    return [];
  }
};

const writeOrders = (orders: any[]) => {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
};

// Users Read/write helpers
const readUsers = (): any[] => {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading users, resetting:", err);
    return [];
  }
};

const writeUsers = (users: any[]) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
};

// Standard safe password hashing
const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const readMenu = (): any[] => {
  if (!fs.existsSync(MENU_FILE)) {
    // Seed and write
    fs.writeFileSync(MENU_FILE, JSON.stringify(INITIAL_MENU_ITEMS, null, 2), "utf-8");
    return INITIAL_MENU_ITEMS;
  }
  try {
    const data = fs.readFileSync(MENU_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading menu config, seed backup:", err);
    return INITIAL_MENU_ITEMS;
  }
};

const writeMenu = (menu: any[]) => {
  fs.writeFileSync(MENU_FILE, JSON.stringify(menu, null, 2), "utf-8");
};

// --- API ENDPOINTS ---

// Admin Passcode check
app.post("/api/admin/login", (req, res) => {
  const { passcode } = req.body;
  const targetPasscode = process.env.ADMIN_PASSCODE || "admin123";
  if (passcode === targetPasscode) {
    res.json({ success: true, token: "jamals-grill-admin-token-secure" });
  } else {
    res.status(401).json({ success: false, error: "Incorrect admin passcode credentials." });
  }
});

// --- USER AUTHENTICATION ENDPOINTS ---

// User Signup
app.post("/api/auth/signup", (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, error: "Please provide name, email, phone, and password." });
  }

  const users = readUsers();
  const normalizedEmail = email.toLowerCase().trim();

  const userExists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
  if (userExists) {
    return res.status(400).json({ success: false, error: "An account with this email already exists." });
  }

  const newUser = {
    id: "usr_" + Math.random().toString(36).slice(2, 11),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  res.json({
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    },
    token: `session_${newUser.id}_${Date.now()}`
  });
});

// User Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Please provide email and password." });
  }

  const users = readUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ success: false, error: "Invalid email or password." });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    token: `session_${user.id}_${Date.now()}`
  });
});

// Paystack Key config
app.get("/api/paystack-config", (req, res) => {
  // Gracefully handle missing environment standard config key via reliable default test key
  const key = process.env.PAYSTACK_PUBLIC_KEY || "pk_test_a6e193988f01c25c3fcd107c11f75e01c789d2b4"; // Perfect testing sandbox out of the box
  res.json({ publicKey: key });
});

// Get Menu (remote custom menu)
app.get("/api/menu", (req, res) => {
  res.json(readMenu());
});

// Update Menu Item
app.post("/api/menu/update", (req, res) => {
  const updatedItem = req.body;
  const menu = readMenu();
  const existingIndex = menu.findIndex((item) => item.id === Number(updatedItem.id));

  if (existingIndex !== -1) {
    menu[existingIndex] = {
      ...menu[existingIndex],
      ...updatedItem,
      id: Number(updatedItem.id),
      price: Number(updatedItem.price),
    };
  } else {
    // Add new item
    const nextId = menu.length > 0 ? Math.max(...menu.map(i => i.id)) + 1 : 1;
    menu.push({
      ...updatedItem,
      id: nextId,
      price: Number(updatedItem.price),
    });
  }

  writeMenu(menu);
  res.json({ success: true, menu });
});

// Delete Menu Item
app.post("/api/menu/delete", (req, res) => {
  const { id } = req.body;
  let menu = readMenu();
  menu = menu.filter((item) => item.id !== Number(id));
  writeMenu(menu);
  res.json({ success: true, menu });
});

// Reset Menu to factory standard
app.post("/api/menu/reset", (req, res) => {
  writeMenu(INITIAL_MENU_ITEMS);
  res.json({ success: true, menu: INITIAL_MENU_ITEMS });
});

// Get order history for a specific customer email
app.get("/api/orders/history", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, error: "Email query parameter is required." });
  }
  const orders = readOrders();
  const userOrders = orders.filter(
    (o) => o.customerEmail && o.customerEmail.toLowerCase().trim() === (email as string).toLowerCase().trim()
  );
  res.json(userOrders);
});

// Get all orders
app.get("/api/orders", (req, res) => {
  res.json(readOrders());
});

// Create live paid order
app.post("/api/orders", (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    orderType, // 'delivery' | 'pickup'
    address,
    pickupTime,
    items,
    totalAmount,
    paystackRef,
  } = req.body;

  if (!customerName || !customerPhone || !items || !items.length) {
    return res.status(400).json({ success: false, error: "Missing required order checkout coordinates." });
  }

  const orders = readOrders();
  const newOrder = {
    id: "JAM-" + Math.floor(1000 + Math.random() * 9000) + "-" + Date.now().toString().slice(-4),
    customerName,
    customerEmail,
    customerPhone,
    orderType,
    address: orderType === "delivery" ? address : "Pick-up from Wuse 2 Hub",
    pickupTime: orderType === "pickup" ? pickupTime : null,
    items,
    totalAmount: Number(totalAmount),
    paystackRef: paystackRef || "CASH_OR_WEB_SETTLEMENT",
    status: "Received", // Received | Preparing | Packaging | Out for Delivery | Ready for Pickup | Completed | Cancelled
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder); // Add to head
  writeOrders(orders);

  res.json({ success: true, order: newOrder });
});

// Change status of order
app.post("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orders = readOrders();
  const orderIndex = orders.findIndex((o) => o.id === id);

  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    writeOrders(orders);
    res.json({ success: true, order: orders[orderIndex] });
  } else {
    res.status(404).json({ success: false, error: "Order reference identifier not detected." });
  }
});

// Get single order status for tracker
app.get("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const orders = readOrders();
  const order = orders.find((o) => o.id === id);

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ success: false, error: "Order not found." });
  }
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Jamal's Full-Stack API] Sizzling live on port http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failure booting Jamal's Server:", err);
});
