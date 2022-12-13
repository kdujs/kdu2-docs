---
title: TypeScript Support
type: guide
order: 402
---

> [Kdu CLI](https://kdujs-cli.web.app/) provides built-in TypeScript tooling support.

## Official Declaration in NPM Packages

A static type system can help prevent many potential runtime errors, especially as applications grow. That's why Kdu ships with `official type declarations` for [TypeScript](https://www.typescriptlang.org/) - not only in Kdu core, but also for `kdu-router` and `kdux` as well.

Since these are [published on NPM](https://cdn.jsdelivr.net/npm/kdu@2/types/), and the latest TypeScript knows how to resolve type declarations in NPM packages, this means when installed via NPM, you don't need any additional tooling to use TypeScript with Kdu.

## Recommended Configuration

``` js
// tsconfig.json
{
  "compilerOptions": {
    // this aligns with Kdu's browser support
    "target": "es5",
    // this enables stricter inference for data properties on `this`
    "strict": true,
    // if using webpack 2+ or rollup, to leverage tree shaking:
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

Note that you have to include `strict: true` (or at least `noImplicitThis: true` which is a part of `strict` flag) to leverage type checking of `this` in component methods otherwise it is always treated as `any` type.

See [TypeScript compiler options docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html) for more details.

## Development Tooling

### Project Creation

[Kdu CLI 3](https://github.com/kdujs/kdu-cli) can generate new projects that use TypeScript. To get started:

```bash
# 1. Install Kdu CLI, if it's not already installed
npm install --global @kdujs/cli

# 2. Create a new project, then choose the "Manually select features" option
kdu create my-project-name
```

### Editor Support

For developing Kdu applications with TypeScript, we strongly recommend using [Visual Studio Code](https://code.visualstudio.com/), which provides great out-of-the-box support for TypeScript.

## Basic Usage

To let TypeScript properly infer types inside Kdu component options, you need to define components with `Kdu.component` or `Kdu.extend`:

``` ts
import Kdu from 'kdu'

const Component = Kdu.extend({
  // type inference enabled
})

const Component = {
  // this will NOT have type inference,
  // because TypeScript can't tell this is options for a Kdu component.
}
```

## Class-Style Kdu Components

If you prefer a class-based API when declaring components, you can use the officially maintained `kdu-class-component` decorator:

``` ts
import Kdu from 'kdu'
import Component from 'kdu-class-component'

// The @Component decorator indicates the class is a Kdu component
@Component({
  // All component options are allowed in here
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Kdu {
  // Initial data can be declared as instance properties
  message: string = 'Hello!'

  // Component methods can be declared as instance methods
  onClick (): void {
    window.alert(this.message)
  }
}
```

## Augmenting Types for Use with Plugins

Plugins may add to Kdu's global/instance properties and component options. In these cases, type declarations are needed to make plugins compile in TypeScript. Fortunately, there's a TypeScript feature to augment existing types called [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

For example, to declare an instance property `$myProperty` with type `string`:

``` ts
// 1. Make sure to import 'kdu' before declaring augmented types
import Kdu from 'kdu'

// 2. Specify a file with the types you want to augment
//    Kdu has the constructor type in types/kdu.d.ts
declare module 'kdu/types/kdu' {
  // 3. Declare augmentation for Kdu
  interface Kdu {
    $myProperty: string
  }
}
```

After including the above code as a declaration file (like `my-property.d.ts`) in your project, you can use `$myProperty` on a Kdu instance.

```ts
var vm = new Kdu()
console.log(vm.$myProperty) // This should compile successfully
```

You can also declare additional global properties and component options:

```ts
import Kdu from 'kdu'

declare module 'kdu/types/kdu' {
  // Global properties can be declared
  // on the `KduConstructor` interface
  interface KduConstructor {
    $myGlobal: string
  }
}

// ComponentOptions is declared in types/options.d.ts
declare module 'kdu/types/options' {
  interface ComponentOptions<V extends Kdu> {
    myOption?: string
  }
}
```

The above declarations allow the following code to be compiled:

```ts
// Global property
console.log(Kdu.$myGlobal)

// Additional component option
var vm = new Kdu({
  myOption: 'Hello'
})
```

## Annotating Return Types

Because of the circular nature of Kdu's declaration files, TypeScript may have difficulties inferring the types of certain methods. For this reason, you may need to annotate the return type on methods like `render` and those in `computed`.

```ts
import Kdu, { KNode } from 'kdu'

const Component = Kdu.extend({
  data () {
    return {
      msg: 'Hello'
    }
  },
  methods: {
    // need annotation due to `this` in return type
    greet (): string {
      return this.msg + ' world'
    }
  },
  computed: {
    // need annotation
    greeting(): string {
      return this.greet() + '!'
    }
  },
  // `createElement` is inferred, but `render` needs return type
  render (createElement): KNode {
    return createElement('div', this.greeting)
  }
})
```

If you find type inference or member completion isn't working, annotating certain methods may help address these problems. Using the `--noImplicitAny` option will help find many of these unannotated methods.



## Annotating Props

```ts
import Kdu, { PropType } from 'kdu'

interface ComplexMessage {
  title: string,
  okMessage: string,
  cancelMessage: string
}
const Component = Kdu.extend({
  props: {
    name: String,
    success: { type: String },
    callback: {
      type: Function as PropType<() => void>
    },
    message: {
      type: Object as PropType<ComplexMessage>,
      required: true,
      validator (message: ComplexMessage) {
        return !!message.title;
      }
    }
  }
})
```
If you find validator not getting type inference or member completion isn't working, annotating the argument with the expected type may help address these problems.
