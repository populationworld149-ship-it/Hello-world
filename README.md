# Taste - Shopify Theme

A Shopify theme based on the **Taste** theme (v15.4.1) by Shopify.

## Project Structure

```
├── assets/           # CSS, JavaScript, SVG, and other static assets
├── config/           # Theme configuration files
│   ├── settings_data.json    # Store-specific settings
│   └── settings_schema.json  # Theme settings schema
├── layout/           # Base layout templates
│   ├── theme.liquid          # Main theme layout
│   └── password.liquid       # Password page layout
├── locales/          # Translation files for internationalization
├── sections/         # Modular section templates
├── snippets/         # Reusable code snippets
└── templates/        # Page templates
    └── customers/    # Customer account templates
```

## Theme Features

- **Responsive Design**: Mobile-first approach with full responsiveness
- **Product Variants**: Support for product variant pickers and swatches
- **Cart Drawer**: Ajax-powered cart drawer for seamless shopping
- **Quick Add**: Quick add to cart functionality
- **Predictive Search**: Real-time search suggestions
- **Multi-language Support**: Internationalization with multiple locale files
- **Accessibility**: Built with WCAG guidelines in mind

## Development

### Prerequisites

- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
- Node.js (LTS version recommended)

### Local Development

1. Install Shopify CLI:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. Start development server:
   ```bash
   shopify theme dev --store your-store.myshopify.com
   ```

3. Push changes to your store:
   ```bash
   shopify theme push
   ```

### Theme Customization

Edit the theme settings in `config/settings_schema.json` to customize:
- Logo and favicon
- Color schemes
- Typography
- Layout options
- Social media links
- Cart behavior
- And more...

## Resources

- [Shopify Theme Documentation](https://help.shopify.com/manual/online-store/themes)
- [Shopify Liquid Reference](https://shopify.dev/docs/api/liquid)
- [Shopify Theme Support](https://support.shopify.com/)

## License

This theme is based on Shopify's Taste theme. Please refer to Shopify's terms of service for licensing information.
