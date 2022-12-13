---
title: Event Handling
type: guide
order: 9
---

## Listening to Events

We can use the `k-on` directive to listen to DOM events and run some JavaScript when they're triggered.

For example:

``` html
<div id="example-1">
  <button k-on:click="counter += 1">Add 1</button>
  <p>The button above has been clicked {{ counter }} times.</p>
</div>
```
``` js
var example1 = new Kdu({
  el: '#example-1',
  data: {
    counter: 0
  }
})
```

Result:

{% raw %}
<div id="example-1" class="demo">
  <button k-on:click="counter += 1">Add 1</button>
  <p>The button above has been clicked {{ counter }} times.</p>
</div>
<script>
var example1 = new Kdu({
  el: '#example-1',
  data: {
    counter: 0
  }
})
</script>
{% endraw %}

## Method Event Handlers

The logic for many event handlers will be more complex though, so keeping your JavaScript in the value of the `k-on` attribute isn't feasible. That's why `k-on` can also accept the name of a method you'd like to call.

For example:

``` html
<div id="example-2">
  <!-- `greet` is the name of a method defined below -->
  <button k-on:click="greet">Greet</button>
</div>
```

``` js
var example2 = new Kdu({
  el: '#example-2',
  data: {
    name: 'Kdu.js'
  },
  // define methods under the `methods` object
  methods: {
    greet: function (event) {
      // `this` inside methods points to the Kdu instance
      alert('Hello ' + this.name + '!')
      // `event` is the native DOM event
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})

// you can invoke methods in JavaScript too
example2.greet() // => 'Hello Kdu.js!'
```

Result:

{% raw %}
<div id="example-2" class="demo">
  <button k-on:click="greet">Greet</button>
</div>
<script>
var example2 = new Kdu({
  el: '#example-2',
  data: {
    name: 'Kdu.js'
  },
  methods: {
    greet: function (event) {
      alert('Hello ' + this.name + '!')
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})
</script>
{% endraw %}

## Methods in Inline Handlers

Instead of binding directly to a method name, we can also use methods in an inline JavaScript statement:

``` html
<div id="example-3">
  <button k-on:click="say('hi')">Say hi</button>
  <button k-on:click="say('what')">Say what</button>
</div>
```
``` js
new Kdu({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
```

Result:
{% raw %}
<div id="example-3" class="demo">
  <button k-on:click="say('hi')">Say hi</button>
  <button k-on:click="say('what')">Say what</button>
</div>
<script>
new Kdu({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
</script>
{% endraw %}

Sometimes we also need to access the original DOM event in an inline statement handler. You can pass it into a method using the special `$event` variable:

``` html
<button k-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```

``` js
// ...
methods: {
  warn: function (message, event) {
    // now we have access to the native event
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

## Event Modifiers

It is a very common need to call `event.preventDefault()` or `event.stopPropagation()` inside event handlers. Although we can do this easily inside methods, it would be better if the methods can be purely about data logic rather than having to deal with DOM event details.

To address this problem, Kdu provides **event modifiers** for `k-on`. Recall that modifiers are directive postfixes denoted by a dot.

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`
- `.passive`

``` html
<!-- the click event's propagation will be stopped -->
<a k-on:click.stop="doThis"></a>

<!-- the submit event will no longer reload the page -->
<form k-on:submit.prevent="onSubmit"></form>

<!-- modifiers can be chained -->
<a k-on:click.stop.prevent="doThat"></a>

<!-- just the modifier -->
<form k-on:submit.prevent></form>

<!-- use capture mode when adding the event listener -->
<!-- i.e. an event targeting an inner element is handled here before being handled by that element -->
<div k-on:click.capture="doThis">...</div>

<!-- only trigger handler if event.target is the element itself -->
<!-- i.e. not from a child element -->
<div k-on:click.self="doThat">...</div>
```

<p class="tip">Order matters when using modifiers because the relevant code is generated in the same order. Therefore using `k-on:click.prevent.self` will prevent **all clicks** while `k-on:click.self.prevent` will only prevent clicks on the element itself.</p>

``` html
<!-- the click event will be triggered at most once -->
<a k-on:click.once="doThis"></a>
```

Unlike the other modifiers, which are exclusive to native DOM events, the `.once` modifier can also be used on [component events](components-custom-events.html). If you haven't read about components yet, don't worry about this for now.

Kdu also offers the `.passive` modifier, corresponding to [`addEventListener`'s `passive` option](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters).

``` html
<!-- the scroll event's default behavior (scrolling) will happen -->
<!-- immediately, instead of waiting for `onScroll` to complete  -->
<!-- in case it contains `event.preventDefault()`                -->
<div k-on:scroll.passive="onScroll">...</div>
```

The `.passive` modifier is especially useful for improving performance on mobile devices.

<p class="tip">Don't use `.passive` and `.prevent` together, because `.prevent` will be ignored and your browser will probably show you a warning. Remember, `.passive` communicates to the browser that you _don't_ want to prevent the event's default behavior.</p>

## Key Modifiers

When listening for keyboard events, we often need to check for specific keys. Kdu allows adding key modifiers for `k-on` when listening for key events:

``` html
<!-- only call `vm.submit()` when the `key` is `Enter` -->
<input k-on:keyup.enter="submit">
```

You can directly use any valid key names exposed via [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) as modifiers by converting them to kebab-case.

``` html
<input k-on:keyup.page-down="onPageDown">
```

In the above example, the handler will only be called if `$event.key` is equal to `'PageDown'`.

### Key Codes

<p class="tip">The use of `keyCode` events [is deprecated](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) and may not be supported in new browsers.</p>

Using `keyCode` attributes is also permitted:

``` html
<input k-on:keyup.13="submit">
```

Kdu provides aliases for the most commonly used key codes when necessary for legacy browser support:

- `.enter`
- `.tab`
- `.delete` (captures both "Delete" and "Backspace" keys)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

<p class="tip">A few keys (`.esc` and all arrow keys) have inconsistent `key` values in IE9, so these built-in aliases should be preferred if you need to support IE9.</p>

You can also [define custom key modifier aliases](../api/#keyCodes) via the global `config.keyCodes` object:

``` js
// enable `k-on:keyup.f1`
Kdu.config.keyCodes.f1 = 112
```

## System Modifier Keys

You can use the following modifiers to trigger mouse or keyboard event listeners only when the corresponding modifier key is pressed:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> Note: On Macintosh keyboards, meta is the command key (⌘). On Windows keyboards, meta is the Windows key (⊞). On Sun Microsystems keyboards, meta is marked as a solid diamond (◆). On certain keyboards, specifically MIT and Lisp machine keyboards and successors, such as the Knight keyboard, space-cadet keyboard, meta is labeled “META”. On Symbolics keyboards, meta is labeled “META” or “Meta”.

For example:

```html
<!-- Alt + C -->
<input k-on:keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div k-on:click.ctrl="doSomething">Do something</div>
```

<p class="tip">Note that modifier keys are different from regular keys and when used with `keyup` events, they have to be pressed when the event is emitted. In other words, `keyup.ctrl` will only trigger if you release a key while holding down `ctrl`. It won't trigger if you release the `ctrl` key alone. If you do want such behaviour, use the `keyCode` for `ctrl` instead: `keyup.17`.</p>

### `.exact` Modifier

> New in 2.5.0+

The `.exact` modifier allows control of the exact combination of system modifiers needed to trigger an event.

``` html
<!-- this will fire even if Alt or Shift is also pressed -->
<button k-on:click.ctrl="onClick">A</button>

<!-- this will only fire when Ctrl and no other keys are pressed -->
<button k-on:click.ctrl.exact="onCtrlClick">A</button>

<!-- this will only fire when no system modifiers are pressed -->
<button k-on:click.exact="onClick">A</button>
```

### Mouse Button Modifiers

- `.left`
- `.right`
- `.middle`

These modifiers restrict the handler to events triggered by a specific mouse button.

## Why Listeners in HTML?

You might be concerned that this whole event listening approach violates the good old rules about "separation of concerns". Rest assured - since all Kdu handler functions and expressions are strictly bound to the ViewModel that's handling the current view, it won't cause any maintenance difficulty. In fact, there are several benefits in using `k-on`:

1. It's easier to locate the handler function implementations within your JS code by skimming the HTML template.

2. Since you don't have to manually attach event listeners in JS, your ViewModel code can be pure logic and DOM-free. This makes it easier to test.

3. When a ViewModel is destroyed, all event listeners are automatically removed. You don't need to worry about cleaning it up yourself.
