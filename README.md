# Superlight UI

A modest, ultra-fast WordPress frontend wrapper designed for silence and technical simplicity. This project provides a "distraction-free" reading experience with zero heavy frameworks.

## Core Concept (The Philosophy)
The primary goal of this project is to provide a user interface that stays **under 47KB** on initial load. This is achieved through:
- **Zero Frameworks**: Built entirely with Vanilla JavaScript.
- **Micro-Optimization**: CSS is precisely purged and minified using Tailwind CLI.
- **Inlined Assets**: Lucide icons are embedded as raw SVG paths in the code to eliminate external requests.
- **Single-File Build**: CSS and JS are bundled into the final HTML to achieve zero extra network requests after the first fetch.

## Features
- **Full RTL Support**: Native Arabic support with a balanced grid system.
- **Night Mode**: A modest theme switcher (Light/Dark) that remembers user preferences.
- **Minimal Mode**: "Images Off" by default to save bandwidth and focus on text.
- **Custom Post Types (CPTs)**: Dynamic routing that supports specialized content types like answers or projects.
- **Reader Mode**: An optional feature allowing users to change the API URL and branding directly from the UI, with persistence in `localStorage`.
- **Zero Dependencies**: Everything is bundled into a single self-contained `index.html`.

## Development
This project requires [Bun](https://bun.sh) (or Node.js) for the build process:

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Run Development Mode**:
   ```bash
   bun run dev
   ```
   *This serves `dev-index.html`, which loads assets as separate files (`app.js`, `dist.css`) for easier debugging.*

3. **Build for Production**:
   ```bash
   bun run build
   ```
   *This minifies all assets and inlines them into the final `index.html` file.*

## Deployment
The project is designed to run as a **single static file**. To deploy, simply upload:
- `index.html` (The generated file from the `bun run build` command).

Ensure the `CONFIG` object in `app.js` points to your target WordPress REST API URL.

## Limitations
- **JavaScript Required**: Won't function if the browser disables JS.
- **CORS Restricted**: Fetching content is limited by the WordPress REST API settings (CORS must be enabled if hosted on a different domain).
- **Comments**: Currently does not support direct comment posting or viewing.

## License
MIT - Hadi Alahmad
