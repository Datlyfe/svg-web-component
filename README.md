# svg-web-component

A custom web component for diplaying svg icons.

## Instalation

### NPM

```shell
npm install svg-web-component
(or)
yarn add svg-web-component
```

Add your svg data by calling the load function which takes an object where the key is the icon name and the value is the svg source,

```javascript
import svgWebComponent from "svg-web-component";
SvgWebComponent.load({
  plus:
    '<svg  viewBox="0 0 24 24"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/></svg>'
});
```

### Browser

```html
<script src="svg-web-component.js"></script>
<script>
  SvgWebComponent.default.load({
    plus:
      '<svg  viewBox="0 0 24 24"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/></svg>'
  });
</script>
```

## Usage

```html
<svg-icon name="plus"></svg-icon>
```
