---
title: Installation
type: guide
order: 1
kdu_version: 2.7.16
gz_size: "37.70"
---

### Compatibility Note

Kdu does **not** support IE8 and below, because it uses ECMAScript 5 features that are un-shimmable in IE8. However it supports all [ECMAScript 5 compliant browsers](https://caniuse.com/#feat=es5).

### Semantic Versioning

Kdu follows [Semantic Versioning](https://semver.org/) in all its official projects for documented features and behavior.

### Release Notes

Latest stable version: v{{kdu_version}}

## Kdu Devtools

When using Kdu, we recommend also installing the `Kdu Devtools` in your browser, allowing you to inspect and debug your Kdu applications in a more user-friendly interface.

## Direct `<script>` Include

Simply download and include with a script tag. `Kdu` will be registered as a global variable.

<p class="tip">Don't use the minified version during development. You will miss out on all the nice warnings for common mistakes!</p>

<div id="downloads">
  <a class="button" href="/js/kdu.js" download>Development Version</a><span class="light info">With full warnings and debug mode</span>

  <a class="button" href="/js/kdu.min.js" download>Production Version</a><span class="light info">Warnings stripped, {{gz_size}}KB min+gzip</span>
</div>

### CDN

For prototyping or learning purposes, you can use the latest version with:

``` html
<script src="https://cdn.jsdelivr.net/npm/kdu@2.7.16/dist/kdu.js"></script>
```

For production, we recommend linking to a specific version number and build to avoid unexpected breakage from newer versions:

``` html
<script src="https://cdn.jsdelivr.net/npm/kdu@2.7.16"></script>
```

If you are using native ES Modules, there is also an ES Modules compatible build:

``` html
<script type="module">
  import Kdu from 'https://cdn.jsdelivr.net/npm/kdu@2.7.16/dist/kdu.esm.browser.js'
</script>
```

You can browse the source of the NPM package at [cdn.jsdelivr.net/npm/kdu](https://cdn.jsdelivr.net/npm/kdu/).

Kdu is also available on [unpkg](https://unpkg.com/kdu@{{kdu_version}}/dist/kdu.js) and [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/kdu/{{kdu_version}}/kdu.js) (cdnjs takes some time to sync so the latest release may not be available yet).

Make sure to read about [the different builds of Kdu](#Explanation-of-Different-Builds) and use the **production
 version** in your published site, replacing `kdu.js` with `kdu.min.js`. This is a smaller build optimized for speed instead of development experience.

## NPM

NPM is the recommended installation method when building large scale applications with Kdu. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/). Kdu also provides accompanying tools for authoring [Single File Components](single-file-components.html).

``` bash
# latest stable
$ npm install kdu@^2
```

## CLI

Kdu provides an official CLI for quickly scaffolding ambitious Single Page Applications. It provides batteries-included build setups for a modern frontend workflow. It takes only a few minutes to get up and running with hot-reload, lint-on-save, and production-ready builds. See [the Kdu CLI docs](https://kdujs-cli.web.app/) for more details.

<p class="tip">The CLI assumes prior knowledge of Node.js and the associated build tools. If you are new to Kdu or front-end build tools, we strongly suggest going through <a href="./">the guide</a> without any build tools before using the CLI.</p>

## Explanation of Different Builds

In the [`dist/` directory of the NPM package](https://cdn.jsdelivr.net/npm/kdu@2.7.16/dist/) you will find many different builds of Kdu.js. Here's an overview of the difference between them:

| | UMD | CommonJS | ES Module (for bundlers) | ES Module (for browsers) |
| --- | --- | --- | --- | --- |
| **Full** | kdu.js | kdu.common.js | kdu.esm.js | kdu.esm.browser.js |
| **Runtime-only** | kdu.runtime.js | kdu.runtime.common.js | kdu.runtime.esm.js | - |
| **Full (production)** | kdu.min.js | - | - | kdu.esm.browser.min.js |
| **Runtime-only (production)** | kdu.runtime.min.js | - | - | - |

### Terms

- **Full**: builds that contain both the compiler and the runtime.

- **Compiler**: code that is responsible for compiling template strings into JavaScript render functions.

- **Runtime**: code that is responsible for creating Kdu instances, rendering and patching virtual DOM, etc. Basically everything minus the compiler.

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from jsDelivr CDN at [https://cdn.jsdelivr.net/npm/kdu@2.7.16](https://cdn.jsdelivr.net/npm/kdu@2.7.16) is the Runtime + Compiler UMD build (`kdu.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The default file for these bundlers (`pkg.main`) is the Runtime only CommonJS build (`kdu.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: starting in 2.6 Kdu provides two ES Modules (ESM) builds:

  - ESM for bundlers: intended for use with modern bundlers like [webpack 2](https://webpack.js.org) or [Rollup](https://rollupjs.org/). ESM format is designed to be statically analyzable so the bundlers can take advantage of that to perform "tree-shaking" and eliminate unused code from your final bundle. The default file for these bundlers (`pkg.module`) is the Runtime only ES Module build (`kdu.runtime.esm.js`).

  - ESM for browsers (2.6+ only): intended for direct imports in modern browsers via `<script type="module">`.

### Runtime + Compiler vs. Runtime-only

If you need to compile templates on the client (e.g. passing a string to the `template` option, or mounting to an element using its in-DOM HTML as the template), you will need the compiler and thus the full build:

``` js
// this requires the compiler
new Kdu({
  template: '<div>{{ hi }}</div>'
})

// this does not
new Kdu({
  render (h) {
    return h('div', this.hi)
  }
})
```

When using `kdu-loader` or `kduify`, templates inside `*.kdu` files are pre-compiled into JavaScript at build time. You don't really need the compiler in the final bundle, and can therefore use the runtime-only build.

Since the runtime-only builds are roughly 30% lighter-weight than their full-build counterparts, you should use it whenever you can. If you still wish to use the full build instead, you need to configure an alias in your bundler:

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'kdu$': 'kdu/dist/kdu.esm.js' // 'kdu/dist/kdu.common.js' for webpack 1
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'kdu': require.resolve('kdu/dist/kdu.esm.js')
    })
  ]
})
```

#### Browserify

Add to your project's `package.json`:

``` js
{
  // ...
  "browser": {
    "kdu": "kdu/dist/kdu.common.js"
  }
}
```

#### Parcel

Add to your project's `package.json`:

``` js
{
  // ...
  "alias": {
    "kdu" : "./node_modules/kdu/dist/kdu.common.js"
  }
}
```

### Development vs. Production Mode

Development/production modes are hard-coded for the UMD builds: the un-minified files are for development, and the minified files are for production.

CommonJS and ES Module builds are intended for bundlers, therefore we don't provide minified versions for them. You will be responsible for minifying the final bundle yourself.

CommonJS and ES Module builds also preserve raw checks for `process.env.NODE_ENV` to determine the mode they should run in. You should use appropriate bundler configurations to replace these environment variables in order to control which mode Kdu will run in. Replacing `process.env.NODE_ENV` with string literals also allows minifiers like UglifyJS to completely drop the development-only code blocks, reducing final file size.

#### Webpack

In Webpack 4+, you can use the `mode` option:

``` js
module.exports = {
  mode: 'production'
}
```

But in Webpack 3 and earlier, you'll need to use [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

#### Rollup

Use [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

Apply a global [envify](https://github.com/hughsk/envify) transform to your bundle.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Also see [Production Deployment Tips](deployment.html).

### CSP environments

Some environments, such as Google Chrome Apps, enforce Content Security Policy (CSP), which prohibits the use of `new Function()` for evaluating expressions. The full build depends on this feature to compile templates, so is unusable in these environments.

## Bower

Only UMD builds are available from Bower.

``` bash
# latest stable
$ bower install kdu
```

## AMD Module Loaders

All UMD builds can be used directly as an AMD module.
