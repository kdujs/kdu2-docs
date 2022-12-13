---
title: Render Functions & JSX
type: guide
order: 303
---

## Basics

Kdu recommends using templates to build your HTML in the vast majority of cases. There are situations however, where you really need the full programmatic power of JavaScript. That's where you can use the **render function**, a closer-to-the-compiler alternative to templates.

Let's dive into a simple example where a `render` function would be practical. Say you want to generate anchored headings:

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

For the HTML above, you decide you want this component interface:

``` html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

When you get started with a component that only generates a heading based on the `level` prop, you quickly arrive at this:

``` html
<script type="text/x-template" id="anchored-heading-template">
  <h1 k-if="level === 1">
    <slot></slot>
  </h1>
  <h2 k-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 k-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 k-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 k-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 k-else-if="level === 6">
    <slot></slot>
  </h6>
</script>
```

``` js
Kdu.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

That template doesn't feel great. It's not only verbose, but we're duplicating `<slot></slot>` for every heading level and will have to do the same when we add the anchor element.

While templates work great for most components, it's clear that this isn't one of them. So let's try rewriting it with a `render` function:

``` js
Kdu.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // tag name
      this.$slots.default // array of children
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

Much simpler! Sort of. The code is shorter, but also requires greater familiarity with Kdu instance properties. In this case, you have to know that when you pass children without a `k-slot` directive into a component, like the `Hello world!` inside of `anchored-heading`, those children are stored on the component instance at `$slots.default`. If you haven't already, **it's recommended to read through the [instance properties API](../api/#Instance-Properties) before diving into render functions.**

## Nodes, Trees, and the Virtual DOM

Before we dive into render functions, it’s important to know a little about how browsers work. Take this HTML for example:

```html
<div>
  <h1>My title</h1>
  Some text content
  <!-- TODO: Add tagline  -->
</div>
```

When a browser reads this code, it builds a [tree of "DOM nodes"](https://javascript.info/dom-nodes) to help it keep track of everything, just as you might build a family tree to keep track of your extended family.

The tree of DOM nodes for the HTML above looks like this:

![DOM Tree Visualization](/images/dom-tree.png)

Every element is a node. Every piece of text is a node. Even comments are nodes! A node is just a piece of the page. And as in a family tree, each node can have children (i.e. each piece can contain other pieces).

Updating all these nodes efficiently can be difficult, but thankfully, you never have to do it manually. Instead, you tell Kdu what HTML you want on the page, in a template:

```html
<h1>{{ blogTitle }}</h1>
```

Or a render function:

``` js
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

And in both cases, Kdu automatically keeps the page updated, even when `blogTitle` changes.

### The Virtual DOM

Kdu accomplishes this by building a **virtual DOM** to keep track of the changes it needs to make to the real DOM. Taking a closer look at this line:

``` js
return createElement('h1', this.blogTitle)
```

What is `createElement` actually returning? It's not _exactly_ a real DOM element. It could perhaps more accurately be named `createNodeDescription`, as it contains information describing to Kdu what kind of node it should render on the page, including descriptions of any child nodes. We call this node description a "kdu node", usually abbreviated to **KNode**. "Virtual DOM" is what we call the entire tree of KNodes, built by a tree of Kdu components.

## `createElement` Arguments

The next thing you'll have to become familiar with is how to use template features in the `createElement` function. Here are the arguments that `createElement` accepts:

``` js
// @returns {KNode}
createElement(
  // {String | Object | Function}
  // An HTML tag name, component options, or async
  // function resolving to one of these. Required.
  'div',

  // {Object}
  // A data object corresponding to the attributes
  // you would use in a template. Optional.
  {
    // (see details in the next section below)
  },

  // {String | Array}
  // Children KNodes, built using `createElement()`,
  // or using strings to get 'text KNodes'. Optional.
  [
    'Some text comes first.',
    createElement('h1', 'A headline'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

### The Data Object In-Depth

One thing to note: similar to how `k-bind:class` and `k-bind:style` have special treatment in templates, they have their own top-level fields in KNode data objects. This object also allows you to bind normal HTML attributes as well as DOM properties such as `innerHTML` (this would replace the `k-html` directive):

``` js
{
  // Same API as `k-bind:class`, accepting either
  // a string, object, or array of strings and objects.
  class: {
    foo: true,
    bar: false
  },
  // Same API as `k-bind:style`, accepting either
  // a string, object, or array of objects.
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // Normal HTML attributes
  attrs: {
    id: 'foo'
  },
  // Component props
  props: {
    myProp: 'bar'
  },
  // DOM properties
  domProps: {
    innerHTML: 'baz'
  },
  // Event handlers are nested under `on`, though
  // modifiers such as in `k-on:keyup.enter` are not
  // supported. You'll have to manually check the
  // keyCode in the handler instead.
  on: {
    click: this.clickHandler
  },
  // For components only. Allows you to listen to
  // native events, rather than events emitted from
  // the component using `vm.$emit`.
  nativeOn: {
    click: this.nativeClickHandler
  },
  // Custom directives. Note that the `binding`'s
  // `oldValue` cannot be set, as Kdu keeps track
  // of it for you.
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // Scoped slots in the form of
  // { name: props => KNode | Array<KNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // The name of the slot, if this component is the
  // child of another component
  slot: 'name-of-slot',
  // Other special top-level properties
  key: 'myKey',
  ref: 'myRef',
  // If you are applying the same ref name to multiple
  // elements in the render function. This will make `$refs.myRef` become an
  // array
  refInFor: true
}
```

### Complete Example

With this knowledge, we can now finish the component we started:

``` js
var getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Kdu.component('anchored-heading', {
  render: function (createElement) {
    // create kebab-case id
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^-|-$)/g, '')

    return createElement(
      'h' + this.level,
      [
        createElement('a', {
          attrs: {
            name: headingId,
            href: '#' + headingId
          }
        }, this.$slots.default)
      ]
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

### Constraints

#### KNodes Must Be Unique

All KNodes in the component tree must be unique. That means the following render function is invalid:

``` js
render: function (createElement) {
  var myParagraphKNode = createElement('p', 'hi')
  return createElement('div', [
    // Yikes - duplicate KNodes!
    myParagraphKNode, myParagraphKNode
  ])
}
```

If you really want to duplicate the same element/component many times, you can do so with a factory function. For example, the following render function is a perfectly valid way of rendering 20 identical paragraphs:

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## Replacing Template Features with Plain JavaScript

### `k-if` and `k-for`

Wherever something can be easily accomplished in plain JavaScript, Kdu render functions do not provide a proprietary alternative. For example, in a template using `k-if` and `k-for`:

``` html
<ul k-if="items.length">
  <li k-for="item in items">{{ item.name }}</li>
</ul>
<p k-else>No items found.</p>
```

This could be rewritten with JavaScript's `if`/`else` and `map` in a render function:

``` js
props: ['items'],
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```

### `k-model`

There is no direct `k-model` counterpart in render functions - you will have to implement the logic yourself:

``` js
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

This is the cost of going lower-level, but it also gives you much more control over the interaction details compared to `k-model`.

### Event & Key Modifiers

For the `.passive`, `.capture` and `.once` event modifiers, Kdu offers prefixes that can be used with `on`:

| Modifier(s) | Prefix |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` or<br>`.once.capture` | `~!` |

For example:

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

For all other event and key modifiers, no proprietary prefix is necessary, because you can use event methods in the handler:

| Modifier(s) | Equivalent in Handler |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| Keys:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (change `13` to [another key code](http://keycode.info/) for other key modifiers) |
| Modifiers Keys:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (change `ctrlKey` to `altKey`, `shiftKey`, or `metaKey`, respectively) |

Here's an example with all of these modifiers used together:

```javascript
on: {
  keyup: function (event) {
    // Abort if the element emitting the event is not
    // the element the event is bound to
    if (event.target !== event.currentTarget) return
    // Abort if the key that went up is not the enter
    // key (13) and the shift key was not held down
    // at the same time
    if (!event.shiftKey || event.keyCode !== 13) return
    // Stop event propagation
    event.stopPropagation()
    // Prevent the default keyup handler for this element
    event.preventDefault()
    // ...
  }
}
```

### Slots

You can access static slot contents as Arrays of KNodes from [`this.$slots`](../api/#vm-slots):

``` js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

And access scoped slots as functions that return KNodes from [`this.$scopedSlots`](../api/#vm-scopedSlots):

``` js
props: ['message'],
render: function (createElement) {
  // `<div><slot :text="message"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.message
    })
  ])
}
```

To pass scoped slots to a child component using render functions, use the `scopedSlots` field in KNode data:

``` js
render: function (createElement) {
  // `<div><child k-slot="props"><span>{{ props.text }}</span></child></div>`
  return createElement('div', [
    createElement('child', {
      // pass `scopedSlots` in the data object
      // in the form of { name: props => KNode | Array<KNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}
```

## JSX

If you're writing a lot of `render` functions, it might feel painful to write something like this:

``` js
createElement(
  'anchored-heading', {
    props: {
      level: 1
    }
  }, [
    createElement('span', 'Hello'),
    ' world!'
  ]
)
```

Especially when the template version is so simple in comparison:

``` html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```

That's why there's a Babel plugin to use JSX with Kdu, getting us back to a syntax that's closer to templates:

``` js
import AnchoredHeading from './AnchoredHeading.kdu'

new Kdu({
  el: '#demo',
  render: function (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">Aliasing `createElement` to `h` is a common convention you'll see in the Kdu ecosystem and is actually required for JSX. Starting with [version 3.4.3](https://github.com/kdujs/babel-plugin-transform-kdu-jsx#h-auto-injection) of the Babel plugin for Kdu, we automatically inject `const h = this.$createElement` in any method and getter (not functions or arrow functions), declared in ES2015 syntax that has JSX, so you can drop the `(h)` parameter. With prior versions of the plugin, your app would throw an error if `h` was not available in the scope.</p>

## Functional Components

The anchored heading component we created earlier is relatively simple. It doesn't manage any state, watch any state passed to it, and it has no lifecycle methods. Really, it's only a function with some props.

In cases like this, we can mark components as `functional`, which means that they're stateless (no [reactive data](../api/#Options-Data)) and instanceless (no `this` context). A **functional component** looks like this:

``` js
Kdu.component('my-component', {
  functional: true,
  // Props are optional
  props: {
    // ...
  },
  // To compensate for the lack of an instance,
  // we are now provided a 2nd context argument.
  render: function (createElement, context) {
    // ...
  }
})
```

> Note: in versions before 2.5.0, the `props` option is required if you wish to accept props in a functional component. In 2.5.0+ you can omit the `props` option and all attributes found on the component node will be implicitly extracted as props.
>
> The reference will be HTMLElement when used with functional components because they’re stateless and instanceless.

In 2.5.0+, if you are using [single-file components](single-file-components.html), template-based functional components can be declared with:

``` html
<template functional>
</template>
```

Everything the component needs is passed through `context`, which is an object containing:

- `props`: An object of the provided props
- `children`: An array of the KNode children
- `slots`: A function returning a slots object
- `scopedSlots`: (2.6.0+) An object that exposes passed-in scoped slots. Also exposes normal slots as functions.
- `data`: The entire [data object](#The-Data-Object-In-Depth), passed to the component as the 2nd argument of `createElement`
- `parent`: A reference to the parent component
- `listeners`: An object containing parent-registered event listeners. This is an alias to `data.on`
- `injections`: if using the [`inject`](../api/#provide-inject) option, this will contain resolved injections.

After adding `functional: true`, updating the render function of our anchored heading component would require adding the `context` argument, updating `this.$slots.default` to `context.children`, then updating `this.level` to `context.props.level`.

Since functional components are just functions, they're much cheaper to render.

They're also very useful as wrapper components. For example, when you need to:

- Programmatically choose one of several other components to delegate to
- Manipulate children, props, or data before passing them on to a child component

Here's an example of a `smart-list` component that delegates to more specific components, depending on the props passed to it:

``` js
var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Kdu.component('smart-list', {
  functional: true,
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  },
  render: function (createElement, context) {
    function appropriateListComponent () {
      var items = context.props.items

      if (items.length === 0)           return EmptyList
      if (typeof items[0] === 'object') return TableList
      if (context.props.isOrdered)      return OrderedList

      return UnorderedList
    }

    return createElement(
      appropriateListComponent(),
      context.data,
      context.children
    )
  }
})
```

### Passing Attributes and Events to Child Elements/Components

On normal components, attributes not defined as props are automatically added to the root element of the component, replacing or [intelligently merging with](class-and-style.html) any existing attributes of the same name.

Functional components, however, require you to explicitly define this behavior:

```js
Kdu.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // Transparently pass any attributes, event listeners, children, etc.
    return createElement('button', context.data, context.children)
  }
})
```

By passing `context.data` as the second argument to `createElement`, we are passing down any attributes or event listeners used on `my-functional-button`. It's so transparent, in fact, that events don't even require the `.native` modifier.

If you are using template-based functional components, you will also have to manually add attributes and listeners. Since we have access to the individual context contents, we can use `data.attrs` to pass along any HTML attributes and `listeners` _(the alias for `data.on`)_ to pass along any event listeners.

```html
<template functional>
  <button
    class="btn btn-primary"
    k-bind="data.attrs"
    k-on="listeners"
  >
    <slot/>
  </button>
</template>
```

### `slots()` vs `children`

You may wonder why we need both `slots()` and `children`. Wouldn't `slots().default` be the same as `children`? In some cases, yes - but what if you have a functional component with the following children?

``` html
<my-functional-component>
  <p k-slot:foo>
    first
  </p>
  <p>second</p>
</my-functional-component>
```

For this component, `children` will give you both paragraphs, `slots().default` will give you only the second, and `slots().foo` will give you only the first. Having both `children` and `slots()` therefore allows you to choose whether this component knows about a slot system or perhaps delegates that responsibility to another component by passing along `children`.

## Template Compilation

You may be interested to know that Kdu's templates actually compile to render functions. This is an implementation detail you usually don't need to know about, but if you'd like to see how specific template features are compiled, you may find it interesting. Below is a little demo using `Kdu.compile` to live-compile a template string:

<iframe src="https://codesandbox.io/embed/github/kdujs/kdu2-docs/tree/master/src/v2/examples/kdu-20-template-compilation?codemirror=1&hidedevtools=1&hidenavigation=1&theme=light&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="kdu-20-template-compilation" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
