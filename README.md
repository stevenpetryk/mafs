# Mafs

Mafs is a set of opinionated React components for creating math visualizations.

[Visit the docs →](https://mafs.dev)

---

## Development

Development is done inside of the Gatsby documentation site, which directly
imports Mafs components from `src/`. To start the development server, run:

```
yarn start
```

Then visit [localhost:8000](http://localhost:8000).

## Tests

Mafs uses visual regression testing to ensure consistency between updates. This means that it takes literal screenshots of components as rendered by the browser, and compares them to a known "correct" screenshot.

Currently, these tests are limited to static screenshots—the SVG output of Mafs is rendered to a string and plopped onto a Puppeteer page. This means that interactive things and animations don't work yet.
