# fela-dom

This is a mirror of [fela-dom](https://www.npmjs.com/package/fela-dom) for bower, bundled and exposed as ES module.

## Install

```
bower install bundled-es-modules/fela-dom
```

## Use

```html
<script type="module">
  // from main file
  import {
    render, rehydrate, renderToMarkup, renderToSheetList
  } from './bower_components/fela-dom/index.js';
  // or directly
  import {
    render, rehydrate, renderToMarkup, renderToSheetList
  } from './bower_components/fela-dom/fela-dom.js';
  console.log(render, rehydrate, renderToMarkup, renderToSheetList);
</script>
```
