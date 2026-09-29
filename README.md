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
- `docs/product-guides/_explain/`: content for the in-app help panel ("Explain this"), compiled by `scripts/build-explain.mjs` into `static/explain/v1/`.

Production deployment is handled by the GitHub Pages workflow in `.github/workflows/deploy.yml`.

## In-app help panel (HelpPanel)

The help panel inside the Logstag app reads its content from this repository. The same Markdown partials under `docs/product-guides/_explain/` are shown in the app and on the product-guide pages, so one edit updates both. `npm start` and `npm run build` compile the registry, and a merge to `main` publishes it at `https://docs.logstag.com/explain/v1/`.

How to fix typos, update or add entries, cover a new page, preview locally and turn the panel off: see the [HelpPanel maintainer guide](docs/product-guides/_explain/README.md).
