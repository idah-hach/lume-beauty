# LUMÉ Beauty — Website

Premium beauty e-commerce landing page (React + Vite).

## Run locally

```bash
npm install
npm run dev        # development server → http://localhost:5173
```

## Production build (ready to upload to any host / Netlify / Vercel)

```bash
npm run build      # output in dist/
```

Upload the **contents of `dist/`** to your hosting and the site is live.

## How to edit products

All products live in `src/Components/Products.jsx`:

```js
{
  id: 5,
  name: "Pre-Glued Lashes – Natural",
  category: "Lashes",
  price: 18,
  image: "/images/pre-glued-natural.jpg",
  description: "...",
}
```

- To add a product image, put the file in `public/images/` and reference it as `/images/your-file.jpg`.
- Clicking a product image opens the lightbox; the description is shown there.
- If `image` is empty (`""`), a branded "LUMÉ" placeholder is shown instead of a broken image.

## Notes

- Fonts (Cormorant Garamond + Jost) are loaded from Google Fonts via `index.html` — keep those `<link>` tags.
- WhatsApp / Instagram links are in `src/Components/Contact.jsx` and `Footer.jsx`.
