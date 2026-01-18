# Fusion Delicias Cafe - Ordering Interface

A single-item café ordering interface built around a center plate display. This is a static HTML/CSS/JavaScript application that provides a beautiful, interactive menu browsing experience.

## Features

### Layout Structure
The page is divided into three fixed vertical zones that remain static at all screen sizes:
- **Left Column**: Category toggle buttons (Drinks, Food, Pastries)
- **Center**: Plate with product image and navigation arrows
- **Right Column**: Action buttons (Add to Order, Ingredients, Account, Cart)

### Category Navigation
- **Drinks**: Boba teas, smoothies, and other beverages
- **Food**: Sandwiches, bowls, and savory items
- **Pastries**: Croissants, tarts, muffins, and baked goods

Category buttons are toggles, not links. Clicking them:
- Keeps the plate in place
- Changes only the item displayed on the plate
- Animates the new item sliding in from the left
- No page reload or layout shift

### Product Navigation
- **Right Arrow (→)**: Shows next item in current category
- **Left Arrow (←)**: Shows previous item in current category
- Only the product image animates; plate, arrows, and buttons remain static

### Action Buttons

#### Add to Order
- Adds the currently visible item to the cart
- Shows a brief confirmation notification
- No page change

#### Ingredients
- Opens a centered pop-up card with:
  - Item name at the top
  - Flavor profile
  - Ingredients list
- For drinks: includes size options (Small / Medium / Large)
- Card closes by clicking X or clicking outside

#### Account
- Opens a modal with:
  - Previous Orders
  - Favorites
  - Reviews
  - Sign In / Sign Out

#### Cart
- Opens a modal showing:
  - Cart items with names, prices, and quantities
  - Quantity adjustment controls (+/-)
  - Tip options (5%, 10%, 15%, Custom)
  - Continue with Checkout button

### Optional Search Bar
- Located at top center
- Rounded, soft pink outline
- Searches across all categories

## Usage

Simply open `index.html` in a web browser. No build process or server required.

## Design

The interface features:
- Pink/magenta color scheme
- Floral header decoration
- Dancing Script font for headings
- Poppins font for body text
- Smooth slide animations
- Modal overlays with consistent styling

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
