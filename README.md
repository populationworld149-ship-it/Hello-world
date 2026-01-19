# Café Ordering Interface (Page 1)

This repo contains a **single-item café ordering interface** with a **fixed 3-zone layout**:

- **Left column**: category toggles (FOOD / DRINKS / PASTRIES)
- **Center**: static plate + arrows + one product image at a time
- **Right column**: actions (Add to Order / Ingredients / Account / Cart)

**Key rule:** nothing reflows or navigates; **only the product image animates** (new in from left, old out to right).

## Run locally

Because this is a small static site, you can open `index.html` directly, or (recommended) run a tiny local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Behaviors

- **Category buttons**: toggles (no page navigation). Switching category keeps the plate fixed and swaps the item with the slide animation.
- **Arrows**: next/previous item in the current category (new item slides in from the left).
- **Add to Order**: adds current item to cart with a small toast confirmation.
- **Ingredients**: opens a centered modal; drinks include size options.
- **Account**: opens a centered modal (demo “Shopify login” card).
- **Cart**: opens a centered modal with items, quantities, and checkout button (demo).