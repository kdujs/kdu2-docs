---
title: Migration to Kdu 2.7
type: guide
order: 701
---

Kdu 2.7 is the latest minor version of Kdu 2. It provides built-in support for the [Composition API](https://kdu-js.web.app/guide/extras/composition-api-faq.html#composition-api-faq).

Despite Kdu 3 now being the default version, we understand that there are still many users who have to stay on Kdu 2 due to dependency compatibility, browser support requirements, or simply not enough bandwidth to upgrade. In Kdu 2.7, we have backported some of the most important features from Kdu 3 so that Kdu 2 users can benefit from them as well.

## Backported Features

- [Composition API](https://kdu-js.web.app/guide/extras/composition-api-faq.html)
- SFC [`<script setup>`](https://kdu-js.web.app/api/sfc-script-setup.html)
- SFC [CSS k-bind](https://kdu-js.web.app/api/sfc-css-features.html#k-bind-in-css)

In addition, the following APIs are also supported:

- `defineComponent()` with improved type inference (compared to `Kdu.extend`)
- `h()`, `useSlot()`, `useAttrs()`, `useCssModules()`
- `set()`, `del()` and `nextTick()` are also provided as named exports in ESM builds.
- The `emits` option is also supported, but only for type-checking purposes (does not affect runtime behavior)

  2.7 also supports using ESNext syntax in template expressions. When using a build system, the compiled template render function will go through the same loaders / plugins configured for normal JavaScript. This means if you have configured Babel for `.js` files, it will also apply to the expressions in your SFC templates.

### Notes on API exposure

- In ESM builds, these APIs are provided as named exports (and named exports only):

  ```js
  import Kdu, { ref } from "kdu";
  Kdu.ref; // undefined, use named export instead
  ```

- In UMD and CJS builds, these APIs are exposed as properties on the global `Kdu` object.

- When bundling with CJS builds externalized, bundlers should be able to handle ESM interop when externalizing CJS builds.

### Behavior Differences from Kdu 3

The Composition API is backported using Kdu 2's getter/setter-based reactivity system to ensure browser compatibility. This means there are some important behavior differences from Kdu 3's proxy-based system:

- All [Kdu 2 change detection caveats](https://kdujs-v2.web.app/v2/guide/reactivity.html#Change-Detection-Caveats) still apply.

- `reactive()`, `ref()`, and `shallowReactive()` will directly convert original objects instead of creating proxies. This means:

  ```js
  // true in 2.7, false in 3.x
  reactive(foo) === foo;
  ```

- `readonly()` **does** create a separate object, but it won't track newly added properties and does not work on arrays.

- Avoid using arrays as root values in `reactive()` because without property access the array's mutation won't be tracked (this will result in a warning).

- Reactivity APIs ignore properties with symbol keys.

In addition, the following features are explicitly **NOT** ported:

- ❌ `createApp()` (Kdu 2 doesn't have isolated app scope)
- ❌ Top-level `await` in `<script setup>` (Kdu 2 does not support async component initialization)
- ❌ TypeScript syntax in template expressions (incompatible w/ Kdu 2 parser)
- ❌ Reactivity transform (still experimental)
- ❌ `expose` option is not supported for options components (but `defineExpose()` is supported in `<script setup>`).
