## Shopify setup (drop-in files)

These files add the **Page 1 single-item café ordering interface** as a Shopify OS 2.0 page template + section.

### 1) Create files in Shopify “Edit code”

In your theme code editor, create and paste the matching files from this repo:

- `assets/cafe-ordering.css`
- `assets/cafe-ordering.js`
- `sections/cafe-ordering-interface.liquid`
- `templates/page.cafe-ordering.json`

### 2) Load the assets only on that template

Open `layout/theme.liquid` and add this inside `<head>` (near other CSS/JS includes):

```liquid
{% if template.name == 'page' and template.suffix == 'cafe-ordering' %}
  {{ 'cafe-ordering.css' | asset_url | stylesheet_tag }}
  <script src="{{ 'cafe-ordering.js' | asset_url }}" defer="defer"></script>
{% endif %}
```

### 3) Ensure the body has a class for the template suffix (recommended)

If your theme’s `<body>` class does **not** already include `template-{{ template.name }}-{{ template.suffix }}`,
update it like this:

```liquid
<body class="template-{{ template.name }}{% if template.suffix %} template-{{ template.name }}-{{ template.suffix }}{% endif %}">
```

This lets the CSS apply only to the café ordering page.

### 4) Create a Page and assign the template

Shopify admin → **Online Store** → **Pages** → **Add page**

- Title: (anything, e.g. “Order”)
- Theme template: **page.cafe-ordering**

Save, then open the page.

### 5) Hook categories to your collections (in Theme Editor)

Open the new page in Theme Editor and set:

- Drinks collection
- Food collection
- Pastries collection

The UI will swap items on the plate without navigation and will add items to cart via Shopify AJAX.
