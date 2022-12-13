---
title: State Management
type: guide
order: 502
---

## Official Flux-Like Implementation

Large applications can often grow in complexity, due to multiple pieces of state scattered across many components and the interactions between them. To solve this problem, Kdu offers `kdux`: our own Elm-inspired state management library.

### Information for React Developers

If you're coming from React, you may be wondering how kdux compares to [redux](https://github.com/reactjs/redux), the most popular Flux implementation in that ecosystem. Kdux is different in that it _knows_ it's in a Kdu app. This allows it to better integrate with Kdu, offering a more intuitive API and improved development experience.

## Simple State Management from Scratch

It is often overlooked that the source of truth in Kdu applications is the raw `data` object - a Kdu instance only proxies access to it. Therefore, if you have a piece of state that should be shared by multiple instances, you can share it by identity:

``` js
var sourceOfTruth = {}

var vmA = new Kdu({
  data: sourceOfTruth
})

var vmB = new Kdu({
  data: sourceOfTruth
})
```

Now whenever `sourceOfTruth` is mutated, both `vmA` and `vmB` will update their views automatically. Subcomponents within each of these instances would also have access via `this.$root.$data`. We have a single source of truth now, but debugging would be a nightmare. Any piece of data could be changed by any part of our app at any time, without leaving a trace.

To help solve this problem, we can adopt a **store pattern**:

``` js
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}
```

Notice all actions that mutate the store's state are put inside the store itself. This type of centralized state management makes it easier to understand what type of mutations could happen and how they are triggered. Now when something goes wrong, we'll also have a log of what happened leading up to the bug.

In addition, each instance/component can still own and manage its own private state:

``` js
var vmA = new Kdu({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Kdu({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

![State Management](/images/state.png)

<p class="tip">It's important to note that you should never replace the original state object in your actions - the components and the store need to share reference to the same object in order for mutations to be observed.</p>

As we continue developing the convention where components are never allowed to directly mutate state that belongs to a store, but should instead dispatch events that notify the store to perform actions, we eventually arrive at the [Flux](https://facebook.github.io/flux/) architecture. The benefit of this convention is we can record all state mutations happening to the store and implement advanced debugging helpers such as mutation logs, snapshots, and history re-rolls / time travel.

This brings us full circle back to `kdux`, so if you've read this far it's probably time to try it out!
