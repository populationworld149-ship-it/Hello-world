/* Page 1 — single-item cafe ordering interface
   - 3 fixed vertical zones (left categories, center plate, right actions)
   - No navigation, no layout shift
   - Only product image animates: new in from left, old out to right
*/

const CATALOG = {
  drinks: [
    {
      id: "drink-lavender-boba",
      name: "Lavender Boba Latte",
      type: "drink",
      price: 6,
      ingredients: ["Green tea", "Whole milk", "Lavender syrup", "Boba pearls", "Whipped cream"],
      sizes: ["Small", "Medium", "Large"],
      imageDataUrl: svgToDataUrl(svgCup("Lavender")),
    },
    {
      id: "drink-matcha-latte",
      name: "Matcha Latte",
      type: "drink",
      price: 5,
      ingredients: ["Matcha", "Whole milk", "Vanilla", "Ice (optional)"],
      sizes: ["Small", "Medium", "Large"],
      imageDataUrl: svgToDataUrl(svgCup("Matcha")),
    },
    {
      id: "drink-rose-milk-tea",
      name: "Rose Milk Tea",
      type: "drink",
      price: 6,
      ingredients: ["Black tea", "Whole milk", "Rose syrup", "Boba pearls"],
      sizes: ["Small", "Medium", "Large"],
      imageDataUrl: svgToDataUrl(svgCup("Rose")),
    },
  ],
  food: [
    {
      id: "food-avocado-toast",
      name: "Avocado Toast",
      type: "food",
      price: 8,
      ingredients: ["Sourdough", "Avocado", "Chili flakes", "Sea salt", "Lemon"],
      imageDataUrl: svgToDataUrl(svgPlate("Avocado Toast")),
    },
    {
      id: "food-salad-bowl",
      name: "Garden Salad Bowl",
      type: "food",
      price: 9,
      ingredients: ["Mixed greens", "Cucumber", "Tomato", "Vinaigrette"],
      imageDataUrl: svgToDataUrl(svgPlate("Salad")),
    },
    {
      id: "food-grilled-cheese",
      name: "Grilled Cheese",
      type: "food",
      price: 7,
      ingredients: ["Brioche", "Cheddar", "Butter"],
      imageDataUrl: svgToDataUrl(svgPlate("Grilled Cheese")),
    },
  ],
  pastries: [
    {
      id: "pastry-croissant",
      name: "Butter Croissant",
      type: "pastry",
      price: 4,
      ingredients: ["Flour", "Butter", "Milk", "Yeast", "Salt"],
      imageDataUrl: svgToDataUrl(svgPastry("Croissant")),
    },
    {
      id: "pastry-macarons",
      name: "Assorted Macarons",
      type: "pastry",
      price: 6,
      ingredients: ["Almond flour", "Egg whites", "Sugar", "Buttercream"],
      imageDataUrl: svgToDataUrl(svgPastry("Macarons")),
    },
    {
      id: "pastry-cinnamon-roll",
      name: "Cinnamon Roll",
      type: "pastry",
      price: 5,
      ingredients: ["Flour", "Cinnamon", "Butter", "Icing"],
      imageDataUrl: svgToDataUrl(svgPastry("Cinnamon Roll")),
    },
  ],
};

const state = {
  category: "drinks",
  indexByCategory: { drinks: 0, food: 0, pastries: 0 },
  drinkSizeByItemId: {},
  cart: [], // { key, itemId, name, price, size?, qty }
  isAnimating: false,
};

const els = {
  productLayer: document.getElementById("product-layer"),
  leftRail: document.querySelector(".left-rail"),
  rightRail: document.querySelector(".right-rail"),
  arrowLeft: document.querySelector(".arrow-left"),
  arrowRight: document.querySelector(".arrow-right"),
  overlay: document.getElementById("overlay"),
  modal: document.querySelector(".modal"),
  modalTitle: document.getElementById("modal-title"),
  modalBody: document.getElementById("modal-body"),
  modalClose: document.getElementById("modal-close"),
  toast: document.getElementById("toast"),
  search: document.getElementById("search"),
};

init();

function init() {
  // default selected category matches HTML aria-pressed for DRINKS
  setCategory("drinks", { animate: false });
  renderCurrent({ animate: false });

  els.leftRail.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-category]");
    if (!btn) return;
    const cat = btn.dataset.category;
    if (!cat || cat === state.category) return;
    setCategory(cat, { animate: true });
  });

  els.arrowLeft.addEventListener("click", () => step(-1));
  els.arrowRight.addEventListener("click", () => step(1));

  els.rightRail.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (!action) return;
    handleAction(action);
  });

  // Modal close behaviors
  els.modalClose.addEventListener("click", closeModal);
  els.overlay.addEventListener("click", (e) => {
    // close when clicking outside card only
    if (e.target === els.overlay) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !els.overlay.hidden) closeModal();
  });

  // Optional search: filter within current category, no layout movement
  els.search.addEventListener("input", () => {
    const q = (els.search.value || "").trim().toLowerCase();
    if (!q) return;
    const items = CATALOG[state.category];
    const idx = items.findIndex((it) => it.name.toLowerCase().includes(q));
    if (idx >= 0 && idx !== state.indexByCategory[state.category]) {
      state.indexByCategory[state.category] = idx;
      renderCurrent({ animate: true });
    }
  });
}

function setCategory(category, { animate }) {
  state.category = category;
  // update aria-pressed for toggle buttons
  document.querySelectorAll("button[data-category]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.category === category ? "true" : "false");
  });
  renderCurrent({ animate });
}

function step(delta) {
  if (state.isAnimating) return;
  const items = CATALOG[state.category];
  const curr = state.indexByCategory[state.category];
  const next = mod(curr + delta, items.length);
  state.indexByCategory[state.category] = next;
  renderCurrent({ animate: true });
}

function renderCurrent({ animate }) {
  const item = getCurrentItem();
  const nextNode = makeProductNode(item);

  const existing = els.productLayer.querySelector(".product");
  if (!existing) {
    els.productLayer.appendChild(nextNode);
    return;
  }

  if (!animate) {
    existing.remove();
    els.productLayer.appendChild(nextNode);
    return;
  }

  // Only image animates; no other DOM moves.
  state.isAnimating = true;
  nextNode.classList.add("entering");
  existing.classList.add("exiting");
  els.productLayer.appendChild(nextNode);

  let finished = 0;
  const done = () => {
    finished += 1;
    if (finished >= 2) {
      existing.remove();
      nextNode.classList.remove("entering");
      state.isAnimating = false;
    }
  };

  existing.addEventListener("animationend", done, { once: true });
  nextNode.addEventListener("animationend", done, { once: true });
}

function makeProductNode(item) {
  const img = document.createElement("img");
  img.className = "product";
  img.alt = item.name;
  img.draggable = false;
  img.src = item.imageDataUrl;
  img.width = 320;
  img.height = 320;
  return img;
}

function handleAction(action) {
  if (action === "add") {
    addToCart();
    return;
  }
  if (action === "ingredients") {
    openIngredients();
    return;
  }
  if (action === "account") {
    openAccount();
    return;
  }
  if (action === "cart") {
    openCart();
  }
}

function openIngredients() {
  const item = getCurrentItem();
  els.modalTitle.textContent = item.name;
  els.modalBody.innerHTML = "";

  const list = document.createElement("ul");
  list.style.margin = "0 0 8px 18px";
  list.style.padding = "0";
  item.ingredients.forEach((ing) => {
    const li = document.createElement("li");
    li.textContent = ing;
    list.appendChild(li);
  });
  els.modalBody.appendChild(list);

  if (item.type === "drink" && Array.isArray(item.sizes)) {
    const label = document.createElement("div");
    label.style.marginTop = "10px";
    label.style.fontWeight = "600";
    label.textContent = "Size";
    els.modalBody.appendChild(label);

    const row = document.createElement("div");
    row.className = "pill-row";

    const currentSize = state.drinkSizeByItemId[item.id] || item.sizes[0];
    state.drinkSizeByItemId[item.id] = currentSize;

    item.sizes.forEach((size) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "pill";
      pill.textContent = size;
      pill.setAttribute("aria-pressed", size === currentSize ? "true" : "false");
      pill.addEventListener("click", () => {
        state.drinkSizeByItemId[item.id] = size;
        row.querySelectorAll(".pill").forEach((p) => p.setAttribute("aria-pressed", "false"));
        pill.setAttribute("aria-pressed", "true");
      });
      row.appendChild(pill);
    });
    els.modalBody.appendChild(row);
  }

  openModal();
}

function openAccount() {
  els.modalTitle.textContent = "Account";
  els.modalBody.innerHTML = "";

  const p = document.createElement("p");
  p.style.margin = "0 0 12px";
  p.textContent = "Shopify login (demo modal). This is shown as a pop-up card, not a new page.";
  els.modalBody.appendChild(p);

  const form = document.createElement("div");
  form.style.display = "grid";
  form.style.gap = "10px";

  const email = document.createElement("input");
  email.type = "email";
  email.placeholder = "Email";
  email.style.height = "36px";
  email.style.borderRadius = "10px";
  email.style.border = "1px solid rgba(0,0,0,0.18)";
  email.style.padding = "0 10px";
  email.style.background = "rgba(255,255,255,0.75)";

  const pass = document.createElement("input");
  pass.type = "password";
  pass.placeholder = "Password";
  pass.style.height = "36px";
  pass.style.borderRadius = "10px";
  pass.style.border = "1px solid rgba(0,0,0,0.18)";
  pass.style.padding = "0 10px";
  pass.style.background = "rgba(255,255,255,0.75)";

  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.gap = "10px";

  const signIn = document.createElement("button");
  signIn.type = "button";
  signIn.className = "checkout";
  signIn.textContent = "Sign in";
  signIn.style.flex = "1";
  signIn.addEventListener("click", () => {
    toast("Signed in (demo).");
    closeModal();
  });

  const signOut = document.createElement("button");
  signOut.type = "button";
  signOut.className = "checkout";
  signOut.textContent = "Sign out";
  signOut.style.flex = "1";
  signOut.style.background = "rgba(0,0,0,0.52)";
  signOut.addEventListener("click", () => {
    toast("Signed out (demo).");
    closeModal();
  });

  row.appendChild(signIn);
  row.appendChild(signOut);

  form.appendChild(email);
  form.appendChild(pass);
  form.appendChild(row);
  els.modalBody.appendChild(form);

  openModal();
}

function openCart() {
  els.modalTitle.textContent = "Cart";
  els.modalBody.innerHTML = "";

  const items = state.cart.slice();
  if (items.length === 0) {
    const p = document.createElement("p");
    p.style.margin = "0";
    p.textContent = "Your cart is empty.";
    els.modalBody.appendChild(p);
    openModal();
    return;
  }

  const list = document.createElement("div");
  list.className = "cart-list";

  items.forEach((rowItem) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const left = document.createElement("div");
    const title = document.createElement("div");
    title.style.fontWeight = "600";
    title.textContent = rowItem.name;
    const meta = document.createElement("div");
    meta.style.color = "rgba(0,0,0,0.62)";
    meta.style.fontSize = "13px";
    meta.textContent = [rowItem.size ? `Size: ${rowItem.size}` : null, `$${rowItem.price}`]
      .filter(Boolean)
      .join(" • ");
    left.appendChild(title);
    left.appendChild(meta);

    const controls = document.createElement("div");
    controls.className = "qty-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "qty-btn";
    minus.textContent = "−";
    minus.addEventListener("click", () => {
      changeQty(rowItem.key, -1);
      openCart(); // re-render modal content only
    });

    const qty = document.createElement("div");
    qty.style.minWidth = "20px";
    qty.style.textAlign = "center";
    qty.textContent = String(rowItem.qty);

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "qty-btn";
    plus.textContent = "+";
    plus.addEventListener("click", () => {
      changeQty(rowItem.key, +1);
      openCart();
    });

    controls.appendChild(minus);
    controls.appendChild(qty);
    controls.appendChild(plus);

    row.appendChild(left);
    row.appendChild(controls);
    list.appendChild(row);
  });

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const totalLine = document.createElement("div");
  totalLine.style.display = "flex";
  totalLine.style.justifyContent = "space-between";
  totalLine.style.margin = "8px 2px 12px";
  totalLine.style.fontWeight = "600";
  totalLine.innerHTML = `<span>Total</span><span>$${total.toFixed(2)}</span>`;

  const checkout = document.createElement("button");
  checkout.type = "button";
  checkout.className = "checkout";
  checkout.textContent = "Continue with checkout";
  checkout.addEventListener("click", () => {
    toast("Checkout (demo).");
    closeModal();
  });

  els.modalBody.appendChild(list);
  els.modalBody.appendChild(totalLine);
  els.modalBody.appendChild(checkout);

  openModal();
}

function addToCart() {
  const item = getCurrentItem();
  const size = item.type === "drink" ? state.drinkSizeByItemId[item.id] || item.sizes?.[0] : null;
  const key = `${item.id}${size ? `::${size}` : ""}`;

  const existing = state.cart.find((c) => c.key === key);
  if (existing) existing.qty += 1;
  else
    state.cart.push({
      key,
      itemId: item.id,
      name: item.name,
      price: item.price,
      size: size || undefined,
      qty: 1,
    });

  toast("Added to order.");
}

function changeQty(key, delta) {
  const idx = state.cart.findIndex((c) => c.key === key);
  if (idx < 0) return;
  state.cart[idx].qty += delta;
  if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1);
}

function openModal() {
  els.overlay.hidden = false;
  // focus close for keyboard users, without shifting layout
  window.setTimeout(() => els.modalClose.focus(), 0);
}

function closeModal() {
  els.overlay.hidden = true;
  els.modalTitle.textContent = "";
  els.modalBody.innerHTML = "";
}

let toastTimer = null;
function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    els.toast.classList.remove("show");
  }, 1100);
}

function getCurrentItem() {
  const items = CATALOG[state.category];
  return items[state.indexByCategory[state.category]];
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function svgToDataUrl(svg) {
  // Ensure proper encoding for inline SVG images
  const encoded = encodeURIComponent(svg)
    .replaceAll("'", "%27")
    .replaceAll('"', "%22");
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}

function svgCup(label) {
  // simple stylized cup; placeholder art (no external assets)
  const fill = label === "Lavender" ? "#c7a0ff" : label === "Matcha" ? "#7fe1b0" : "#ff98c9";
  const accent = "#ffffff";
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
  <defs>
    <filter id="s" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="10" flood-color="rgba(0,0,0,0.25)"/>
    </filter>
    <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="${fill}" stop-opacity="0.95"/>
      <stop offset="1" stop-color="${fill}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="420" height="420" fill="none"/>
  <g filter="url(#s)">
    <path d="M135 110h150l-14 208a32 32 0 0 1-32 30H181a32 32 0 0 1-32-30z" fill="url(#g)" stroke="rgba(255,255,255,0.55)" stroke-width="3" />
    <path d="M140 120h140c-10 34-40 56-70 56s-60-22-70-56z" fill="${accent}" opacity="0.65"/>
    <circle cx="170" cy="312" r="10" fill="rgba(20,20,20,0.55)"/>
    <circle cx="198" cy="328" r="10" fill="rgba(20,20,20,0.55)"/>
    <circle cx="224" cy="312" r="10" fill="rgba(20,20,20,0.55)"/>
    <circle cx="252" cy="328" r="10" fill="rgba(20,20,20,0.55)"/>
    <rect x="130" y="96" width="160" height="26" rx="12" fill="rgba(255,255,255,0.55)"/>
    <text x="210" y="206" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" font-size="20" fill="rgba(255,255,255,0.92)">${escapeXml(
      label
    )}</text>
  </g>
</svg>`.trim();
}

function svgPlate(label) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
  <defs>
    <filter id="s" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="10" flood-color="rgba(0,0,0,0.22)"/>
    </filter>
    <radialGradient id="p" cx="50%" cy="45%" r="60%">
      <stop offset="0" stop-color="rgba(255,255,255,0.95)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0.55)"/>
    </radialGradient>
  </defs>
  <rect width="420" height="420" fill="none"/>
  <g filter="url(#s)">
    <ellipse cx="210" cy="250" rx="140" ry="72" fill="url(#p)"/>
    <ellipse cx="210" cy="250" rx="110" ry="52" fill="rgba(255,255,255,0.78)"/>
    <circle cx="170" cy="240" r="18" fill="rgba(125, 210, 140, 0.95)"/>
    <circle cx="210" cy="255" r="20" fill="rgba(255, 220, 120, 0.95)"/>
    <circle cx="250" cy="240" r="18" fill="rgba(255, 160, 180, 0.95)"/>
    <text x="210" y="178" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" font-size="22" fill="rgba(255,255,255,0.92)">${escapeXml(
      label
    )}</text>
  </g>
</svg>`.trim();
}

function svgPastry(label) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
  <defs>
    <filter id="s" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="10" flood-color="rgba(0,0,0,0.22)"/>
    </filter>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="rgba(255, 230, 180, 0.95)"/>
      <stop offset="1" stop-color="rgba(255, 190, 120, 0.85)"/>
    </linearGradient>
  </defs>
  <rect width="420" height="420" fill="none"/>
  <g filter="url(#s)">
    <path d="M140 250c0-44 32-80 70-80s70 36 70 80-32 80-70 80-70-36-70-80z" fill="url(#g)"/>
    <path d="M170 250c0-26 18-46 40-46s40 20 40 46-18 46-40 46-40-20-40-46z" fill="rgba(255,255,255,0.35)"/>
    <text x="210" y="168" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" font-size="22" fill="rgba(255,255,255,0.92)">${escapeXml(
      label
    )}</text>
  </g>
</svg>`.trim();
}

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

