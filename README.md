# fela-dom

This is a mirror of [fela-dom](https://www.npmjs.com/package/fela-dom), bundled and exposed as ES module.

## Install

```
npm install @bundled-es-modules/fela-dom
bower install bundled-es-modules/fela-dom
```

## Use

```html
<script type="module">
  // from main file
  import { render, rehydrate, renderToMarkup, renderToSheetList } from 'fela-dom';
  // or directly
  import { render, rehydrate, renderToMarkup, renderToSheetList } from 'fela-dom/fela-dom.js';
  console.log(render, rehydrate, renderToMarkup, renderToSheetList);
</script>
```

Make sure you added `@bundled-es-modules` scope to the path if used via npm.
