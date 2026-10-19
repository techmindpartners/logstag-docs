# Logstag Documentation

This repository contains the public documentation site for Logstag. It is built with [Docusaurus](https://docusaurus.io/) and published as a static site.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run start
```

This starts the local development server. Most content and styling changes are reflected live without restarting the server.

## Build

```bash
npm run build
```

This generates static content in the `build` directory.

## Validation

Before publishing documentation changes, run:

```bash
npm run typecheck
npm run build
```

## Project Structure

- `docs/`: Markdown documentation pages.
- `sidebars.ts`: Documentation navigation.
- `docusaurus.config.ts`: Site metadata, navigation, and Docusaurus settings.
- `src/css/custom.css`: Global theme overrides.
- `static/img/`: Static brand and site assets.
- `diagrams/`: Archify sources for the diagrams in `static/diagrams/` (see [Diagrams](#diagrams)).
- `src/components/`: React components used by MDX pages.
- `docs/product-guides/_explain/`: content for the in-app help panel ("Explain this"), compiled by `scripts/build-explain.mjs` into `static/explain/v1/`.

Production deployment is handled by the GitHub Pages workflow in `.github/workflows/deploy.yml`.

## Diagrams

Diagrams are made with [Archify](https://github.com/tt-a1i/archify) (3.2). Each diagram has a JSON source in `diagrams/` and a folder `static/diagrams/<name>/` with:

- `light.svg` and `dark.svg`: the images pages show, with an animated data flow.
- `light-still.svg` and `dark-still.svg`: the same images without animation, shown to readers who prefer reduced motion.
- `index.html`: the interactive Archify viewer, linked below the image.

MDX pages show a diagram with the `ArchifyDiagram` component, which picks the SVG of the active color mode.

To change a diagram, edit its source (or ask an agent with the Archify skill to), then render it, copy the HTML, and export the SVGs:

```bash
node <archify>/bin/archify.mjs finalize architecture diagrams/architecture.archify.json .archify/architecture.html --quality showcase
sed 's|<head>|<head><meta name="robots" content="noindex, nofollow">|' .archify/architecture.html > static/diagrams/architecture/index.html
node scripts/export-diagram-svg.mjs static/diagrams/architecture/index.html static/diagrams/architecture
```

`finalize` validates the layout, checks the output in a real browser, and writes its receipts next to the HTML. Render into the git-ignored `.archify/` folder and copy only the HTML into `static/`, so the receipts are not published. The copy adds the same robots tag the docs pages get from `noIndex`, which does not reach files in `static/`. `export-diagram-svg.mjs` needs Node 22+ and Google Chrome (set `CHROME_PATH` if Chrome is not in the macOS default location).

## In-app help panel (HelpPanel)

The help panel inside the Logstag app reads its content from this repository. The same Markdown partials under `docs/product-guides/_explain/` are shown in the app and on the product-guide pages, so one edit updates both. `npm start` and `npm run build` compile the registry, and a merge to `main` publishes it at `https://docs.logstag.com/explain/v1/`.

How to fix typos, update or add entries, cover a new page, preview locally and turn the panel off: see the [HelpPanel maintainer guide](docs/product-guides/_explain/README.md).
