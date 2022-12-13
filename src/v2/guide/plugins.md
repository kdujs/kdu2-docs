---
title: Plugins
type: guide
order: 304
---

Plugins usually add global-level functionality to Kdu. There is no strictly defined scope for a plugin - there are typically several types of plugins:

1. Add some component options by global mixin. e.g. `kdu-router`

2. Add some Kdu instance methods by attaching them to Kdu.prototype.

3. A library that provides an API of its own, while at the same time injecting some combination of the above. e.g. `kdu-router`
## Using a Plugin

Use plugins by calling the `Kdu.use()` global method. This has to be done before you start your app by calling `new Kdu()`:

``` js
// calls `MyPlugin.install(Kdu)`
Kdu.use(MyPlugin)

new Kdu({
  //... options
})
```

You can optionally pass in some options:

``` js
Kdu.use(MyPlugin, { someOption: true })
```

`Kdu.use` automatically prevents you from using the same plugin more than once, so calling it multiple times on the same plugin will install the plugin only once.

Some plugins provided by Kdu.js official plugins such as `kdu-router` automatically calls `Kdu.use()` if `Kdu` is available as a global variable. However in a module environment such as CommonJS, you always need to call `Kdu.use()` explicitly:

``` js
// When using CommonJS via Browserify or Webpack
var Kdu = require('kdu')
var KduRouter = require('kdu-router')

// Don't forget to call this
Kdu.use(KduRouter)
```

## Writing a Plugin

A Kdu.js plugin should expose an `install` method. The method will be called with the `Kdu` constructor as the first argument, along with possible options:

``` js
MyPlugin.install = function (Kdu, options) {
  // 1. add global method or property
  Kdu.myGlobalMethod = function () {
    // some logic ...
  }

  // 2. add a global asset
  Kdu.directive('my-directive', {
    bind (el, binding, knode, oldKnode) {
      // some logic ...
    }
    ...
  })

  // 3. inject some component options
  Kdu.mixin({
    created: function () {
      // some logic ...
    }
    ...
  })

  // 4. add an instance method
  Kdu.prototype.$myMethod = function (methodOptions) {
    // some logic ...
  }
}
```
