# Teleport

An experimental utility to inline CSS `@import`s

---

Organizing CSS styles into multiple files is nice but chaining network requests isn't. Teleport solves this by resolving and inlining CSS imports. You get the benefits of `@import` statements without the drawbacks.

In:

```css
@import url('./variables.css');
@import url('./typography.css');

body {
    margin: 0;
}
```

Out:

```css
/** @import url('./variables.css'); */
:root {
    --brand-color: goldenrod;
}
/** @import url('./typography.css'); */
body {
    font-family: system-ui;
}

body {
    margin: 0;
}
```

## Tradeoffs

- Does not recursively inline imports
- Does not support `url()`-less imports
- Does not support import conditions
