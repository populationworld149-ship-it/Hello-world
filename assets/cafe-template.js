/* =========================================================
  Cafe menu/order Shopify theme template (placeholder content)

  - Home page: categories → central "plate" list → details panel
  - Category change: plate slides out right, new content slides in left
  - Add to Order: localStorage cart + loyalty points (+1 per add)
  - Ingredients modal: ingredients list + allergen tags placeholders
  - Account modal: loyalty points display
  - Cart page: localStorage cart list + total + "Place Order" simulation
  - Floating chatbox: modal form (simulated submit)
========================================================= */

(() => {
  const STORAGE_KEYS = {
    cart: "cafe_template_cart_v1",
    points: "cafe_template_points_v1",
  };

  // Dummy menu data — swap later with real Shopify data if desired.
  // NOTE: All content is placeholder/generic per spec.
  const MENU = [
    {
      id: "cat-a",
      name: "Category A",
      description: "Placeholder description for Category A items.",
      items: [
        mkItem("a-1", "Item 1", 400, ["Ingredient 1", "Ingredient 2", "Ingredient 3"], {
          nuts: false,
          dairy: true,
          gluten: false,
          soy: false,
        }),
        mkItem("a-2", "Item 2", 500, ["Ingredient 1", "Ingredient 2"], {
          nuts: false,
          dairy: false,
          gluten: true,
          soy: false,
        }),
        mkItem("a-3", "Item 3", 600, ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4"], {
          nuts: true,
          dairy: false,
          gluten: false,
          soy: false,
        }),
        mkItem("a-4", "Item 4", 700, ["Ingredient 1"], {
          nuts: false,
          dairy: false,
          gluten: false,
          soy: true,
        }),
      ],
    },
    {
      id: "cat-b",
      name: "Category B",
      description: "Placeholder description for Category B items.",
      items: [
        mkItem("b-1", "Item 1", 300, ["Ingredient 1", "Ingredient 2"], {
          nuts: false,
          dairy: true,
          gluten: true,
          soy: false,
        }),
        mkItem("b-2", "Item 2", 600, ["Ingredient 1", "Ingredient 2", "Ingredient 3"], {
          nuts: true,
          dairy: false,
          gluten: true,
          soy: false,
        }),
        mkItem("b-3", "Item 3", 800, ["Ingredient 1"], {
          nuts: false,
          dairy: true,
          gluten: false,
          soy: false,
        }),
      ],
    },
    {
      id: "cat-c",
      name: "Category C",
      description: "Placeholder description for Category C items.",
      items: [
        mkItem("c-1", "Item 1", 200, ["Ingredient 1", "Ingredient 2"], {
          nuts: false,
          dairy: false,
          gluten: false,
          soy: false,
        }),
        mkItem("c-2", "Item 2", 500, ["Ingredient 1", "Ingredient 2", "Ingredient 3"], {
          nuts: false,
          dairy: true,
          gluten: false,
          soy: true,
        }),
        mkItem("c-3", "Item 3", 900, ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4"], {
          nuts: true,
          dairy: true,
          gluten: true,
          soy: false,
        }),
        mkItem("c-4", "Item 4", 400, ["Ingredient 1"], {
          nuts: false,
          dairy: false,
          gluten: true,
          soy: false,
        }),
      ],
    },
  ];

  function mkItem(id, title, priceCents, ingredients, allergens) {
    return {
      id,
      title,
      description: "Placeholder item description. Replace later with real product details.",
      priceCents,
      ingredients,
      allergens: {
        nuts: !!allergens.nuts,
        dairy: !!allergens.dairy,
        gluten: !!allergens.gluten,
        soy: !!allergens.soy,
      },
    };
  }

  function $(sel, root = document) {
    return root.querySelector(sel);
  }
  function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function safeParseJSON(raw, fallback) {
    try {
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function getCart() {
    return safeParseJSON(localStorage.getItem(STORAGE_KEYS.cart), []);
  }
  function setCart(cart) {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    syncCartCount();
  }

  function getPoints() {
    const n = Number(localStorage.getItem(STORAGE_KEYS.points) || "0");
    return Number.isFinite(n) ? n : 0;
  }
  function setPoints(n) {
    localStorage.setItem(STORAGE_KEYS.points, String(Math.max(0, Math.floor(n))));
    syncPointsUI();
  }
  function addPoints(delta) {
    setPoints(getPoints() + delta);
  }

  function formatMoney(cents) {
    const dollars = (cents / 100).toFixed(2);
    return `$${dollars}`;
  }

  function syncCartCount() {
    const count = getCart().reduce((sum, row) => sum + (row.qty || 0), 0);
    $all("[data-cart-count]").forEach((el) => {
      el.textContent = String(count);
    });
  }

  function syncPointsUI() {
    const points = getPoints();
    const goal = 10;
    const pct = Math.min(100, Math.round((points / goal) * 100));

    $all("[data-points-text]").forEach((el) => {
      el.textContent = `${points} point${points === 1 ? "" : "s"}`;
    });
    $all("[data-points-bar]").forEach((el) => {
      el.style.width = `${pct}%`;
    });
  }

  function openModal(name) {
    const dlg = $(`dialog[data-modal="${name}"]`);
    if (!dlg) return;
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "true"); // fallback
  }

  function closeModal(dlg) {
    if (!dlg) return;
    if (typeof dlg.close === "function") dlg.close();
    else dlg.removeAttribute("open");
  }

  function wireGlobalUI() {
    // Initial load animations
    requestAnimationFrame(() => {
      document.body.classList.add("is-loaded");
    });

    // Close modals
    $all("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(btn.closest("dialog")));
    });
    $all("dialog.modal").forEach((dlg) => {
      dlg.addEventListener("click", (e) => {
        // Close when clicking backdrop
        const rect = dlg.getBoundingClientRect();
        const inDialog =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        if (!inDialog) closeModal(dlg);
      });
    });

    // Account open (prevent navigation)
    $all("[data-open-account]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        openModal("account");
        syncPointsUI();
      });
    });

    // Chat open
    $all("[data-open-chat]").forEach((btn) => {
      btn.addEventListener("click", () => openModal("chat"));
    });

    // Chat submit simulation
    $all("[data-chat-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const status = $("[data-chat-status]", form);
        if (status) status.textContent = "Sent (simulation). We’ll reply soon.";
        form.reset();
      });
    });

    syncCartCount();
    syncPointsUI();
  }

  /* =======================
     Home/Menu page wiring
  ======================= */
  function wireMenuPage() {
    const catsRoot = $("[data-categories]");
    const itemsRoot = $("[data-items]");
    const plate = $("[data-plate]");
    const catTitle = $("[data-category-title]");
    const catDesc = $("[data-category-desc]");
    if (!catsRoot || !itemsRoot || !plate || !catTitle || !catDesc) return;

    const itemTitle = $("[data-item-title]");
    const itemDesc = $("[data-item-desc]");
    const itemPrice = $("[data-item-price]");
    const itemCategory = $("[data-item-category]");
    const btnAdd = $("[data-add-to-order]");
    const btnIng = $("[data-open-ingredients]");

    let selectedCategory = MENU[0];
    let selectedItem = selectedCategory.items[0];

    function renderCategories() {
      catsRoot.innerHTML = "";
      MENU.forEach((cat) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cat-btn";
        btn.role = "tab";
        btn.setAttribute("aria-selected", String(cat.id === selectedCategory.id));
        btn.textContent = cat.name;
        btn.addEventListener("click", () => {
          if (cat.id === selectedCategory.id) return;
          changeCategory(cat);
        });
        catsRoot.appendChild(btn);
      });
    }

    function renderItems() {
      catTitle.textContent = selectedCategory.name;
      catDesc.textContent = selectedCategory.description;

      itemsRoot.innerHTML = "";
      selectedCategory.items.forEach((it) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "item-card";
        card.setAttribute("aria-selected", String(it.id === selectedItem?.id));

        const ill = document.createElement("div");
        ill.className = "item-ill";
        ill.setAttribute("aria-hidden", "true");

        const body = document.createElement("div");
        const title = document.createElement("div");
        title.className = "item-title";
        title.textContent = it.title;

        const meta = document.createElement("div");
        meta.className = "item-meta";
        meta.innerHTML = `<span>${formatMoney(it.priceCents)}</span><span>•</span><span>Tap for details</span>`;

        body.appendChild(title);
        body.appendChild(meta);
        card.appendChild(ill);
        card.appendChild(body);

        card.addEventListener("click", () => {
          selectedItem = it;
          updateDetails();
          $all(".item-card", itemsRoot).forEach((el) =>
            el.setAttribute("aria-selected", String(el === card))
          );
        });

        itemsRoot.appendChild(card);
      });
    }

    function updateDetails() {
      if (!selectedItem) return;
      itemTitle.textContent = selectedItem.title;
      itemDesc.textContent = selectedItem.description;
      itemPrice.textContent = formatMoney(selectedItem.priceCents);
      itemCategory.textContent = selectedCategory.name;
    }

    function setIngredientsModal() {
      const title = $("[data-ing-title]");
      const subtitle = $("[data-ing-subtitle]");
      const list = $("[data-ing-list]");
      const allergen = $("[data-allergen-list]");
      if (!title || !subtitle || !list || !allergen) return;

      title.textContent = `Ingredients — ${selectedItem.title}`;
      subtitle.textContent = "Placeholder ingredients and allergen notes.";

      list.innerHTML = "";
      selectedItem.ingredients.forEach((ing) => {
        const li = document.createElement("li");
        li.textContent = ing;
        list.appendChild(li);
      });

      const allergenLabels = [
        ["nuts", "Nuts"],
        ["dairy", "Dairy"],
        ["gluten", "Gluten"],
        ["soy", "Soy"],
      ];
      allergen.innerHTML = "";
      allergenLabels.forEach(([key, label]) => {
        const tag = document.createElement("span");
        tag.className = `tag ${selectedItem.allergens[key] ? "tag--on" : ""}`;
        tag.textContent = label;
        allergen.appendChild(tag);
      });
    }

    function addToOrder() {
      const cart = getCart();
      const existing = cart.find((r) => r.itemId === selectedItem.id);
      if (existing) existing.qty += 1;
      else {
        cart.push({
          itemId: selectedItem.id,
          title: selectedItem.title,
          category: selectedCategory.name,
          priceCents: selectedItem.priceCents,
          qty: 1,
        });
      }
      setCart(cart);
      addPoints(1);
    }

    function animatePlateSwap(doRender) {
      plate.classList.remove("plate--enter", "plate--enter-left", "plate--exit-right");
      plate.classList.add("plate--exit-right");
      const onEnd = () => {
        plate.removeEventListener("animationend", onEnd);
        doRender();
        plate.classList.remove("plate--exit-right");
        plate.classList.add("plate--enter-left");
      };
      plate.addEventListener("animationend", onEnd, { once: true });
    }

    function changeCategory(cat) {
      selectedCategory = cat;
      selectedItem = selectedCategory.items[0];
      renderCategories();
      animatePlateSwap(() => {
        renderItems();
        updateDetails();
      });
    }

    btnAdd?.addEventListener("click", addToOrder);
    btnIng?.addEventListener("click", () => {
      setIngredientsModal();
      openModal("ingredients");
    });

    renderCategories();
    renderItems();
    updateDetails();
  }

  /* =======================
     Cart page wiring
  ======================= */
  function wireCartPage() {
    const list = $("[data-cart-list]");
    const empty = $("[data-cart-empty]");
    const totalEl = $("[data-cart-total]");
    const placeBtn = $("[data-place-order]");
    const status = $("[data-order-status]");
    if (!list || !empty || !totalEl || !placeBtn || !status) return;

    function render() {
      const cart = getCart();
      list.innerHTML = "";
      empty.hidden = !!cart.length;

      let total = 0;
      cart.forEach((row) => {
        total += (row.priceCents || 0) * (row.qty || 0);

        const el = document.createElement("div");
        el.className = "cart-row";

        const left = document.createElement("div");
        const t = document.createElement("div");
        t.className = "cart-row__title";
        t.textContent = `${row.title} × ${row.qty}`;
        const meta = document.createElement("div");
        meta.className = "cart-row__meta";
        meta.textContent = `${row.category} • ${formatMoney(row.priceCents)} each`;
        left.appendChild(t);
        left.appendChild(meta);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "icon-btn";
        remove.setAttribute("aria-label", "Remove one");
        remove.textContent = "−";
        remove.addEventListener("click", () => {
          const next = getCart()
            .map((r) => (r.itemId === row.itemId ? { ...r, qty: r.qty - 1 } : r))
            .filter((r) => r.qty > 0);
          setCart(next);
          render();
        });

        el.appendChild(left);
        el.appendChild(remove);
        list.appendChild(el);
      });

      totalEl.textContent = formatMoney(total);
    }

    placeBtn.addEventListener("click", () => {
      const cart = getCart();
      if (!cart.length) {
        status.textContent = "Your cart is empty.";
        return;
      }
      status.textContent = "Order placed (simulation). Pickup only.";
      setCart([]);
      render();
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireGlobalUI();
    wireMenuPage();
    wireCartPage();
  });
})();

