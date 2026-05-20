# Flexicards

A custom Magic: The Gathering card generator that runs entirely in the browser. Build cards with the M15-era frame, upload your own art, and export print-ready PDFs (single card or 9-up sheets) at exact card size (63 × 88 mm).

No backend. No accounts. Your cards live in your browser (IndexedDB). Deploy as a static site on GitHub Pages.

## Features

- **All 12 card layouts**: Spell, Creature, Planeswalker, Saga, Adventure, Token, Split, Modal DFC, Transform, Class, Leveler, and a fully **Custom (freeform)** layout with toggleable P/T, loyalty, and ability sections
- **Authentic M15 look** using open-source assets — Mana Project–style symbols, Cinzel + Source Serif + Source Sans for typography
- **Drag-and-drop art upload** with pan / zoom / rotate framing
- **Scryfall import** — fuzzy search + autocomplete to seed cards from existing real cards (text only; art is yours to supply)
- **Print-ready PDF export**
  - Single card per page, or 9-up A4 / US Letter sheet
  - Vector text, vector frames, vector mana symbols — only your art is raster
  - Crop marks for trimming
  - Duplex-friendly handling for DFC/Transform back faces
- **Auto-save to IndexedDB**, with JSON export/import for full collection backup or sharing
- **Keyboard shortcuts**: Ctrl/⌘+N (new card), Ctrl/⌘+D (duplicate), Ctrl/⌘+P (print queue)

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build & deploy

```bash
npm run build    # Outputs static site to dist/
npm run preview  # Preview the production build locally
npm run deploy   # Build + push dist/ to gh-pages branch
```

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys automatically on push to `main`. After enabling GitHub Pages in your repo settings (Source: GitHub Actions), the site will be available at `https://<your-user>.github.io/flexicards/`.

If you fork to a different repo name, change `base` in `vite.config.ts` accordingly, e.g. `base: "/my-cards/"`.

## Project structure

```
src/
  cards/        # Card SVG renderers — frames, parts, mana symbols
  editor/       # The three-pane editor UI + dialogs
  services/     # Scryfall client, PDF export, JSON IO
  state/        # Zustand store, Dexie database, factories
  types/        # Card discriminated union + Scryfall response types
  styles/       # Tailwind layers + globals
```

The card preview and PDF export share the **same SVG component tree**, so what you see is exactly what prints.

## Notes

- Custom cards are for **personal use only**. The Mana Project notes that the mana symbol shapes are © Wizards of the Coast; this app does not ship any Wizards-trademarked fonts or art.
- Type checking and linting are part of the CI flow; run them locally with:
  ```bash
  npm run typecheck
  npm run lint
  ```
- Scryfall imports are throttled to one request every 600 ms and cached in IndexedDB for 30 days, to respect Scryfall's rate limits.

## License

Code: MIT. See LICENSE.
Mana symbol artwork & font: derived from the Mana Project (MIT / SIL OFL).
