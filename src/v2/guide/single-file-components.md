---
title: Single File Components
type: guide
order: 401
---

## Introduction

In many Kdu projects, global components will be defined using `Kdu.component`, followed by `new Kdu({ el: '#container' })` to target a container element in the body of every page.

This can work very well for small to medium-sized projects, where JavaScript is only used to enhance certain views. In more complex projects however, or when your frontend is entirely driven by JavaScript, these disadvantages become apparent:

- **Global definitions** force unique names for every component
- **String templates** lack syntax highlighting and require ugly slashes for multiline HTML
- **No CSS support** means that while HTML and JavaScript are modularized into components, CSS is conspicuously left out
- **No build step** restricts us to HTML and ES5 JavaScript, rather than preprocessors like Pug (formerly Jade) and Babel

All of these are solved by **single-file components** with a `.kdu` extension, made possible with build tools such as Webpack or Browserify.

As promised, we can also use preprocessors such as Pug, Babel (with ES2015 modules), and Stylus for cleaner and more feature-rich components.

These specific languages are only examples. You could as easily use Bublé, TypeScript, SCSS, PostCSS - or whatever other preprocessors that help you be productive. If using Webpack with `kdu-loader`, it also has first-class support for CSS Modules.

### What About Separation of Concerns?

One important thing to note is that **separation of concerns is not equal to separation of file types.** In modern UI development, we have found that instead of dividing the codebase into three huge layers that interweave with one another, it makes much more sense to divide them into loosely-coupled components and compose them. Inside a component, its template, logic and styles are inherently coupled, and collocating them actually makes the component more cohesive and maintainable.

Even if you don't like the idea of Single-File Components, you can still leverage its hot-reloading and pre-compilation features by separating your JavaScript and CSS into separate files:

``` html
<!-- my-component.kdu -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## Getting Started

### Example Sandbox

### For Users New to Module Build Systems in JavaScript

With `.kdu` components, we're entering the realm of advanced JavaScript applications. That means learning to use a few additional tools if you haven't already:

- **Node Package Manager (NPM)**: Read the [Getting Started guide](https://docs.npmjs.com/packages-and-modules/getting-packages-from-the-registry) section about how to get packages from the registry.

- **Modern JavaScript with ES2015/16**: Read through Babel's [Learn ES2015 guide](https://babeljs.io/docs/learn-es2015/). You don't have to memorize every feature right now, but keep this page as a reference you can come back to.

After you've taken a day to dive into these resources, we recommend checking out [Kdu CLI 3](https://kdujs-cli.web.app/). Follow the instructions and you should have a Kdu project with `.kdu` components, ES2015, Webpack and hot-reloading in no time!

### For Advanced Users

The CLI takes care of most of the tooling configurations for you, but also allows fine-grained customization through its own [config options](https://kdujs-cli.web.app/config/).

To learn more about webpack itself, check out [their official docs](https://webpack.js.org/configuration/) and [Webpack Academy](https://webpack-academy.teachable.com/p/the-core-concepts).
