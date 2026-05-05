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

Production deployment is handled by the GitHub Pages workflow in `.github/workflows/deploy.yml`.
