---
title: Conditional Rendering
type: guide
order: 7
---

## `k-if`

The directive `k-if` is used to conditionally render a block. The block will only be rendered if the directive's expression returns a truthy value.

``` html
<h1 k-if="awesome">Kdu is awesome!</h1>
```

It is also possible to add an "else block" with `k-else`:

``` html
<h1 k-if="awesome">Kdu is awesome!</h1>
<h1 k-else>Oh no 😢</h1>
```

### Conditional Groups with `k-if` on `<template>`

Because `k-if` is a directive, it has to be attached to a single element. But what if we want to toggle more than one element? In this case we can use `k-if` on a `<template>` element, which serves as an invisible wrapper. The final rendered result will not include the `<template>` element.

``` html
<template k-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### `k-else`

You can use the `k-else` directive to indicate an "else block" for `k-if`:

``` html
<div k-if="Math.random() > 0.5">
  Now you see me
</div>
<div k-else>
  Now you don't
</div>
```

A `k-else` element must immediately follow a `k-if` or a `k-else-if` element - otherwise it will not be recognized.

### `k-else-if`

The `k-else-if`, as the name suggests, serves as an "else if block" for `k-if`. It can also be chained multiple times:

```html
<div k-if="type === 'A'">
  A
</div>
<div k-else-if="type === 'B'">
  B
</div>
<div k-else-if="type === 'C'">
  C
</div>
<div k-else>
  Not A/B/C
</div>
```

Similar to `k-else`, a `k-else-if` element must immediately follow a `k-if` or a `k-else-if` element.

### Controlling Reusable Elements with `key`

Kdu tries to render elements as efficiently as possible, often re-using them instead of rendering from scratch. Beyond helping make Kdu very fast, this can have some useful advantages. For example, if you allow users to toggle between multiple login types:

``` html
<template k-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template k-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

Then switching the `loginType` in the code above will not erase what the user has already entered. Since both templates use the same elements, the `<input>` is not replaced - just its `placeholder`.

Check it out for yourself by entering some text in the input, then pressing the toggle button:

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template k-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter your username">
    </template>
    <template k-else>
      <label>Email</label>
      <input placeholder="Enter your email address">
    </template>
  </div>
  <button @click="toggleLoginType">Toggle login type</button>
</div>
<script>
new Kdu({
  el: '#no-key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

This isn't always desirable though, so Kdu offers a way for you to say, "These two elements are completely separate - don't re-use them." Add a `key` attribute with unique values:

``` html
<template k-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template k-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

Now those inputs will be rendered from scratch each time you toggle. See for yourself:

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template k-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter your username" key="username-input">
    </template>
    <template k-else>
      <label>Email</label>
      <input placeholder="Enter your email address" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">Toggle login type</button>
</div>
<script>
new Kdu({
  el: '#key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Note that the `<label>` elements are still efficiently re-used, because they don't have `key` attributes.

## `k-show`

Another option for conditionally displaying an element is the `k-show` directive. The usage is largely the same:

``` html
<h1 k-show="ok">Hello!</h1>
```

The difference is that an element with `k-show` will always be rendered and remain in the DOM; `k-show` only toggles the `display` CSS property of the element.

<p class="tip">Note that `k-show` doesn't support the `<template>` element, nor does it work with `k-else`.</p>

## `k-if` vs `k-show`

`k-if` is "real" conditional rendering because it ensures that event listeners and child components inside the conditional block are properly destroyed and re-created during toggles.

`k-if` is also **lazy**: if the condition is false on initial render, it will not do anything - the conditional block won't be rendered until the condition becomes true for the first time.

In comparison, `k-show` is much simpler - the element is always rendered regardless of initial condition, with CSS-based toggling.

Generally speaking, `k-if` has higher toggle costs while `k-show` has higher initial render costs. So prefer `k-show` if you need to toggle something very often, and prefer `k-if` if the condition is unlikely to change at runtime.

## `k-if` with `k-for`

<p class="tip">Using `k-if` and `k-for` together is **not recommended**. See the [style guide](/v2/style-guide/#Avoid-k-if-with-k-for-essential) for further information.</p>

When used together with `k-if`, `k-for` has a higher priority than `k-if`. See the <a href="../guide/list.html#k-for-with-k-if">list rendering guide</a> for details.
