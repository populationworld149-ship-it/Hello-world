## Upload the updated theme zip to Shopify (easy path)

This repo contains a ready-to-upload theme zip:

- `taste-cafe-ordering-theme.zip`

### Steps

1) Shopify Admin → **Online Store** → **Themes**
2) Click **Add theme** → **Upload zip file**
3) Upload `taste-cafe-ordering-theme.zip`
4) After it uploads, click **Customize** (optional) or **Preview**

### Create the ordering page

1) Shopify Admin → **Online Store** → **Pages** → **Add page**
2) In the right sidebar, choose **Theme template**: `page.cafe-ordering`
3) Save
4) Open the page in **Customize**
5) In the “Cafe ordering interface” section settings, select:
   - Drinks collection
   - Food collection
   - Pastries collection

### Notes

- The UI adds items to cart using Shopify AJAX (`/cart/add.js`).
- Ingredients are pulled from a metafield: `product.metafields.custom.ingredients` (optional).
