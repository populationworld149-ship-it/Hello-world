# Cafe Menu / Order Website Template (Placeholder)

Responsive, interactive template built with **HTML + CSS + JavaScript** (no framework).  
I chose vanilla JS here because the state is small (selected category/item, cart, points) and it keeps customization easy for later Shopify/theme integration.

## Pages

- `index.html`: Main menu page (categories → central plate → details panel)
- `about.html`: About page (placeholder content)
- `cart.html`: Cart/Order page (localStorage-backed cart + simulated “Place Order”)

## Features

- **Category switching**: Left (desktop) / horizontal tabs (mobile) updates the central “plate”
- **Item selection**: Updates details panel on the right (desktop) / below (mobile)
- **Animations**:
  - Page load: text fade-in, plate slides in, flowers drop in, logo delayed fade
  - Category change: plate slides out right, new content slides in left
- **Cart persistence**: localStorage cart with count badge + total calculation (placeholder prices)
- **Ingredients modal**: notepad-style ingredients + allergen tags (placeholder)
- **Account modal**: loyalty points + progress bar (+1 point per added item)
- **Chatbox**: floating bottom-right button opens a modal form (simulated submit)
- **Pickup-only note**: visible on menu + about + cart

## Run locally

Any static server works. Examples:

### Option A (Python)

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

### Option B (Node)

```bash
npx serve .
```

## Customize later

- Update placeholder menu data in `app.js` (`MENU` array).
- Swap colors in `styles.css` (`:root` variables).