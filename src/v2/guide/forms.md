---
title: Form Input Bindings
type: guide
order: 10
---

## Basic Usage

You can use the `k-model` directive to create two-way data bindings on form input, textarea, and select elements. It automatically picks the correct way to update the element based on the input type. Although a bit magical, `k-model` is essentially syntax sugar for updating data on user input events, plus special care for some edge cases.

<p class="tip">`k-model` will ignore the initial `value`, `checked`, or `selected` attributes found on any form elements. It will always treat the Kdu instance data as the source of truth. You should declare the initial value on the JavaScript side, inside the `data` option of your component.</p>

`k-model` internally uses different properties and emits different events for different input elements:
- text and textarea elements use `value` property and `input` event;
- checkboxes and radiobuttons use `checked` property and `change` event;
- select fields use `value` as a prop and `change` as an event.

<p class="tip" id="kmodel-ime-tip">For languages that require an [IME](https://en.wikipedia.org/wiki/Input_method) (Chinese, Japanese, Korean, etc.), you'll notice that `k-model` doesn't get updated during IME composition. If you want to cater to these updates as well, use the `input` event instead.</p>

### Text

``` html
<input k-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input k-model="message" placeholder="edit me">
  <p>Message is: {{ message }}</p>
</div>
<script>
new Kdu({
  el: '#example-1',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

### Multiline text

``` html
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br>
<textarea k-model="message" placeholder="add multiple lines"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>Multiline message is:</span>
  <p style="white-space: pre-line;">{{ message }}</p>
  <br>
  <textarea k-model="message" placeholder="add multiple lines"></textarea>
</div>
<script>
new Kdu({
  el: '#example-textarea',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

{% raw %}
<p class="tip">Interpolation on textareas (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>) won't work. Use <code>k-model</code> instead.</p>
{% endraw %}

### Checkbox

Single checkbox, boolean value:

``` html
<input type="checkbox" id="checkbox" k-model="checked">
<label for="checkbox">{{ checked }}</label>
```
{% raw %}
<div id="example-2" class="demo">
  <input type="checkbox" id="checkbox" k-model="checked">
  <label for="checkbox">{{ checked }}</label>
</div>
<script>
new Kdu({
  el: '#example-2',
  data: {
    checked: false
  }
})
</script>
{% endraw %}

Multiple checkboxes, bound to the same Array:

``` html
<input type="checkbox" id="jack" value="Jack" k-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" k-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" k-model="checkedNames">
<label for="mike">Mike</label>
<br>
<span>Checked names: {{ checkedNames }}</span>
```

``` js
new Kdu({
  el: '...',
  data: {
    checkedNames: []
  }
})
```

{% raw %}
<div id="example-3" class="demo">
  <input type="checkbox" id="jack" value="Jack" k-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" k-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" k-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>Checked names: {{ checkedNames }}</span>
</div>
<script>
new Kdu({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
</script>
{% endraw %}

### Radio

``` html
<input type="radio" id="one" value="One" k-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" k-model="picked">
<label for="two">Two</label>
<br>
<span>Picked: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="One" k-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" k-model="picked">
  <label for="two">Two</label>
  <br>
  <span>Picked: {{ picked }}</span>
</div>
<script>
new Kdu({
  el: '#example-4',
  data: {
    picked: ''
  }
})
</script>
{% endraw %}

### Select

Single select:

``` html
<select k-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Selected: {{ selected }}</span>
```
``` js
new Kdu({
  el: '...',
  data: {
    selected: ''
  }
})
```
{% raw %}
<div id="example-5" class="demo">
  <select k-model="selected">
    <option disabled value="">Please select one</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Kdu({
  el: '#example-5',
  data: {
    selected: ''
  }
})
</script>
{% endraw %}

<p class="tip">If the initial value of your `k-model` expression does not match any of the options, the `<select>` element will render in an "unselected" state. On iOS, this will prevent the user from being able to select the first item, because iOS does not fire a `change` event in this case. It is therefore recommended to provide a `disabled` option with an empty value, as demonstrated in the example above.</p>

Multiple select (bound to Array):

``` html
<select k-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Selected: {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select k-model="selected" multiple style="width: 50px;">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Kdu({
  el: '#example-6',
  data: {
    selected: []
  }
})
</script>
{% endraw %}

Dynamic options rendered with `k-for`:

``` html
<select k-model="selected">
  <option k-for="option in options" k-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Selected: {{ selected }}</span>
```
``` js
new Kdu({
  el: '...',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
```
{% raw %}
<div id="example-7" class="demo">
  <select k-model="selected">
    <option k-for="option in options" k-bind:value="option.value">
      {{ option.text }}
    </option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
<script>
new Kdu({
  el: '#example-7',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
</script>
{% endraw %}

## Value Bindings

For radio, checkbox and select options, the `k-model` binding values are usually static strings (or booleans for checkboxes):

``` html
<!-- `picked` is a string "a" when checked -->
<input type="radio" k-model="picked" value="a">

<!-- `toggle` is either true or false -->
<input type="checkbox" k-model="toggle">

<!-- `selected` is a string "abc" when the first option is selected -->
<select k-model="selected">
  <option value="abc">ABC</option>
</select>
```

But sometimes, we may want to bind the value to a dynamic property on the Kdu instance. We can use `k-bind` to achieve that. In addition, using `k-bind` allows us to bind the input value to non-string values.

### Checkbox

``` html
<input
  type="checkbox"
  k-model="toggle"
  true-value="yes"
  false-value="no"
>
```

``` js
// when checked:
vm.toggle === 'yes'
// when unchecked:
vm.toggle === 'no'
```

<p class="tip">The `true-value` and `false-value` attributes don't affect the input's `value` attribute, because browsers don't include unchecked boxes in form submissions. To guarantee that one of two values is submitted in a form (i.e. "yes" or "no"), use radio inputs instead.</p>

### Radio

``` html
<input type="radio" k-model="pick" k-bind:value="a">
```

``` js
// when checked:
vm.pick === vm.a
```

### Select Options

``` html
<select k-model="selected">
  <!-- inline object literal -->
  <option k-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// when selected:
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

## Modifiers

### `.lazy`

By default, `k-model` syncs the input with the data after each `input` event (with the exception of IME composition, as [stated above](#kmodel-ime-tip)). You can add the `lazy` modifier to instead sync _after_ `change` events:

``` html
<!-- synced after "change" instead of "input" -->
<input k-model.lazy="msg">
```

### `.number`

If you want user input to be automatically typecast as a Number, you can add the `number` modifier to your `k-model` managed inputs:

``` html
<input k-model.number="age" type="number">
```

This is often useful, because even with `type="number"`, the value of HTML input elements always returns a string. If the value cannot be parsed with `parseFloat()`, then the original value is returned.

### `.trim`

If you want whitespace from user input to be trimmed automatically, you can add the `trim` modifier to your `k-model`-managed inputs:

```html
<input k-model.trim="msg">
```

## `k-model` with Components

> If you're not yet familiar with Kdu's components, you can skip this for now.

HTML's built-in input types won't always meet your needs. Fortunately, Kdu components allow you to build reusable inputs with completely customized behavior. These inputs even work with `k-model`!

To learn more, read about [custom inputs](components.html#Using-k-model-on-Components) in the Components guide.
