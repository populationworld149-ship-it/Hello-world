/* Cafe ordering interface (Shopify drop-in)
   - 3 fixed vertical zones (left categories, center plate+arrows, right actions)
   - No navigation, no layout shift
   - Only product image animates: new in from left, old out to right
*/

(function () {
  const root = document.querySelector("[data-caf-ordering]");
  if (!root) return;

  const dataEl = root.querySelector('script[type="application/json"][data-caf-data]');
  const data = safeJsonParse(dataEl?.textContent) || {};
  const categories = data.categories || {};

  const state = {
    category: data.initialCategory || "drinks",
    indexByCategory: { drinks: 0, food: 0, pastries: 0 },
    sizeByProductId: {}, // product_id -> size string
    isAnimating: false,
  };

  const els = {
    productLayer: root.querySelector("[data-caf-product-layer]"),
    leftRail: root.querySelector("[data-caf-left]"),
    rightRail: root.querySelector("[data-caf-right]"),
    arrowLeft: root.querySelector("[data-caf-prev]"),
    arrowRight: root.querySelector("[data-caf-next]"),
    overlay: root.querySelector("[data-caf-overlay]"),
    modalTitle: root.querySelector("[data-caf-modal-title]"),
    modalBody: root.querySelector("[data-caf-modal-body]"),
    modalClose: root.querySelector("[data-caf-modal-close]"),
    toast: root.querySelector("[data-caf-toast]"),
    search: root.querySelector("[data-caf-search]"),
    accountTemplate: root.querySelector("template[data-caf-account-template]"),
  };

  init();

  function init() {
    setCategory(state.category, { animate: false });
    renderCurrent({ animate: false });

    els.leftRail?.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-category]");
      if (!btn) return;
      const cat = btn.dataset.category;
      if (!cat || cat === state.category) return;
      setCategory(cat, { animate: true });
    });

    els.arrowLeft?.addEventListener("click", () => step(-1));
    els.arrowRight?.addEventListener("click", () => step(1));

    els.rightRail?.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      handleAction(btn.dataset.action);
    });

    els.modalClose?.addEventListener("click", closeModal);
    els.overlay?.addEventListener("click", (e) => {
      if (e.target === els.overlay) closeModal();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && els.overlay && !els.overlay.hidden) closeModal();
    });

    els.search?.addEventListener("input", () => {
      const q = (els.search.value || "").trim().toLowerCase();
      if (!q) return;
      const items = listItems(state.category);
      const idx = items.findIndex((it) => String(it.title || "").toLowerCase().includes(q));
      if (idx >= 0 && idx !== state.indexByCategory[state.category]) {
        state.indexByCategory[state.category] = idx;
        renderCurrent({ animate: true });
      }
    });
  }

  function setCategory(category, { animate }) {
    state.category = category;
    root.querySelectorAll("button[data-category]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.category === category ? "true" : "false");
    });
    renderCurrent({ animate });
  }

  function step(delta) {
    if (state.isAnimating) return;
    const items = listItems(state.category);
    if (!items.length) return;
    const curr = state.indexByCategory[state.category] || 0;
    const next = mod(curr + delta, items.length);
    state.indexByCategory[state.category] = next;
    renderCurrent({ animate: true });
  }

  function renderCurrent({ animate }) {
    const item = getCurrentItem();
    if (!item) return;
    const nextNode = makeProductNode(item);

    const existing = els.productLayer?.querySelector(".caf-product");
    if (!existing || !els.productLayer) {
      els.productLayer?.appendChild(nextNode);
      return;
    }

    if (!animate) {
      existing.remove();
      els.productLayer.appendChild(nextNode);
      return;
    }

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
    img.className = "caf-product";
    img.alt = String(item.title || "Item");
    img.draggable = false;
    img.src = item.image || "";
    img.loading = "eager";
    return img;
  }

  function handleAction(action) {
    if (action === "add") return addToCart();
    if (action === "ingredients") return openIngredients();
    if (action === "account") return openAccount();
    if (action === "cart") return openCart();
  }

  function openIngredients() {
    const item = getCurrentItem();
    if (!item) return;
    openModal({
      title: item.title || "Ingredients",
      body: renderIngredientsBody(item),
    });
  }

  function renderIngredientsBody(item) {
    const wrap = document.createElement("div");

    const ingredients = Array.isArray(item.ingredients) ? item.ingredients : [];
    if (ingredients.length) {
      const ul = document.createElement("ul");
      ul.style.margin = "0 0 8px 18px";
      ul.style.padding = "0";
      ingredients.forEach((ing) => {
        const li = document.createElement("li");
        li.textContent = String(ing);
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
    } else {
      const p = document.createElement("p");
      p.style.margin = "0 0 10px";
      p.style.color = "rgba(0,0,0,0.62)";
      p.textContent = "Ingredients not set for this item yet.";
      wrap.appendChild(p);
    }

    if (state.category === "drinks") {
      const sizes = Array.isArray(item.sizes) && item.sizes.length ? item.sizes : ["Small", "Medium", "Large"];
      const label = document.createElement("div");
      label.style.marginTop = "10px";
      label.style.fontWeight = "600";
      label.textContent = "Size";
      wrap.appendChild(label);

      const row = document.createElement("div");
      row.className = "caf-pill-row";

      const currentSize = state.sizeByProductId[item.product_id] || sizes[0];
      state.sizeByProductId[item.product_id] = currentSize;

      sizes.forEach((size) => {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "caf-pill";
        pill.textContent = size;
        pill.setAttribute("aria-pressed", size === currentSize ? "true" : "false");
        pill.addEventListener("click", () => {
          state.sizeByProductId[item.product_id] = size;
          row.querySelectorAll(".caf-pill").forEach((p) => p.setAttribute("aria-pressed", "false"));
          pill.setAttribute("aria-pressed", "true");
        });
        row.appendChild(pill);
      });

      wrap.appendChild(row);
    }

    return wrap;
  }

  function openAccount() {
    const tpl = els.accountTemplate;
    const node = tpl?.content?.firstElementChild ? tpl.content.firstElementChild.cloneNode(true) : null;
    if (!node) {
      const p = document.createElement("p");
      p.textContent = "Account login not configured.";
      openModal({ title: "Account", body: p });
      return;
    }
    openModal({ title: "Account", body: node });
  }

  async function openCart() {
    openModal({ title: "Cart", body: renderLoading("Loading cart…") });
    try {
      const cart = await fetchJson("/cart.js");
      const body = renderCart(cart);
      // replace contents without closing/reflowing the page
      els.modalTitle.textContent = "Cart";
      els.modalBody.innerHTML = "";
      els.modalBody.appendChild(body);
    } catch (e) {
      els.modalBody.innerHTML = "";
      els.modalBody.appendChild(renderError("Could not load cart."));
    }
  }

  function renderCart(cart) {
    const wrap = document.createElement("div");
    const items = Array.isArray(cart?.items) ? cart.items : [];
    if (!items.length) {
      const p = document.createElement("p");
      p.style.margin = "0";
      p.textContent = "Your cart is empty.";
      wrap.appendChild(p);
      return wrap;
    }

    const list = document.createElement("div");
    list.className = "caf-cart-list";

    items.forEach((it) => {
      const row = document.createElement("div");
      row.className = "caf-cart-row";

      const left = document.createElement("div");
      const title = document.createElement("div");
      title.style.fontWeight = "600";
      title.textContent = it.product_title || it.title || "Item";
      const meta = document.createElement("div");
      meta.style.color = "rgba(0,0,0,0.62)";
      meta.style.fontSize = "13px";
      meta.textContent = money(it.final_line_price) + (it.variant_title ? ` • ${it.variant_title}` : "");
      left.appendChild(title);
      left.appendChild(meta);

      const controls = document.createElement("div");
      controls.className = "caf-qty-controls";

      const minus = document.createElement("button");
      minus.type = "button";
      minus.className = "caf-qty-btn";
      minus.textContent = "−";
      minus.addEventListener("click", async () => {
        await changeCart(it.key, Math.max(0, (it.quantity || 0) - 1));
        openCart();
      });

      const qty = document.createElement("div");
      qty.style.minWidth = "20px";
      qty.style.textAlign = "center";
      qty.textContent = String(it.quantity || 0);

      const plus = document.createElement("button");
      plus.type = "button";
      plus.className = "caf-qty-btn";
      plus.textContent = "+";
      plus.addEventListener("click", async () => {
        await changeCart(it.key, (it.quantity || 0) + 1);
        openCart();
      });

      controls.appendChild(minus);
      controls.appendChild(qty);
      controls.appendChild(plus);

      row.appendChild(left);
      row.appendChild(controls);
      list.appendChild(row);
    });

    const totalLine = document.createElement("div");
    totalLine.style.display = "flex";
    totalLine.style.justifyContent = "space-between";
    totalLine.style.margin = "8px 2px 12px";
    totalLine.style.fontWeight = "600";
    totalLine.innerHTML = `<span>Total</span><span>${money(cart.total_price || 0)}</span>`;

    const checkout = document.createElement("a");
    checkout.href = "/checkout";
    checkout.className = "caf-primary";
    checkout.style.display = "inline-block";
    checkout.style.textAlign = "center";
    checkout.style.textDecoration = "none";
    checkout.textContent = "Continue with checkout";

    wrap.appendChild(list);
    wrap.appendChild(totalLine);
    wrap.appendChild(checkout);
    return wrap;
  }

  async function addToCart() {
    const item = getCurrentItem();
    if (!item) return;

    const variantId = pickVariantId(item);
    if (!variantId) {
      toast("No purchasable variant found.");
      return;
    }

    try {
      await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: Number(variantId), quantity: 1 }] }),
      });
      toast("Added to order.");
    } catch (e) {
      toast("Could not add to cart.");
    }
  }

  function pickVariantId(item) {
    const variants = Array.isArray(item.variants) ? item.variants : [];
    if (!variants.length) return null;

    // Drinks: try to map selected size to a variant
    if (state.category === "drinks") {
      const size = state.sizeByProductId[item.product_id];
      if (size) {
        const wanted = String(size).toLowerCase();
        const match = variants.find((v) => String(v.title || "").toLowerCase().includes(wanted));
        if (match?.id) return match.id;
      }
    }

    return variants[0]?.id || null;
  }

  async function changeCart(key, quantity) {
    try {
      await fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: key, quantity }),
      });
    } catch (e) {
      // ignore, will refresh and show error if needed
    }
  }

  function openModal({ title, body }) {
    if (!els.overlay || !els.modalTitle || !els.modalBody) return;
    els.modalTitle.textContent = String(title || "");
    els.modalBody.innerHTML = "";
    if (body) els.modalBody.appendChild(body);
    els.overlay.hidden = false;
    window.setTimeout(() => els.modalClose?.focus(), 0);
  }

  function closeModal() {
    if (!els.overlay) return;
    els.overlay.hidden = true;
    if (els.modalTitle) els.modalTitle.textContent = "";
    if (els.modalBody) els.modalBody.innerHTML = "";
  }

  let toastTimer = null;
  function toast(message) {
    if (!els.toast) return;
    els.toast.textContent = String(message || "");
    els.toast.classList.add("show");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("show");
    }, 1100);
  }

  function listItems(category) {
    const arr = categories?.[category] || [];
    return Array.isArray(arr) ? arr : [];
  }

  function getCurrentItem() {
    const items = listItems(state.category);
    if (!items.length) return null;
    const idx = state.indexByCategory[state.category] || 0;
    return items[mod(idx, items.length)];
  }

  function money(cents) {
    const n = Number(cents || 0) / 100;
    return n.toLocaleString(undefined, { style: "currency", currency: data.currency || "USD" });
  }

  async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  }

  function renderLoading(text) {
    const p = document.createElement("p");
    p.style.margin = "0";
    p.textContent = text;
    return p;
  }

  function renderError(text) {
    const p = document.createElement("p");
    p.style.margin = "0";
    p.style.color = "rgba(0,0,0,0.62)";
    p.textContent = text;
    return p;
  }

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function safeJsonParse(s) {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  }
})();

