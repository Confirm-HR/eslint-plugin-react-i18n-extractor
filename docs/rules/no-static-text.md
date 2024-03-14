# Extract static text  (`react-i18n-extractor/no-static-text`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Please describe the origin of the rule here.

## Rule Details

To use, you can specify as follows:

```js
"react/jsx-no-literals": [<enabled>, {"noStrings": true, "allowedStrings": ["allowed"], "ignoreProps": false, "noAttributeStrings": true }]
```

Examples of **incorrect** code for this rule, with the above configuration:

```jsx
var Hello = <div>test</div>;
```

```jsx
var Hello = <div>{'test'}</div>;
```

```jsx
var Hello = <div>
  {'test'}
</div>;
```

```jsx
var Hello = <div>
<img alt="test"> </img>
</div>;
```

```jsx
var Hello = <div class='xx' />;
```

```jsx
var Hello = <div class={'xx'} />;
```

```jsx
var Hello = <div class={`xx`} />;
```

Examples of **correct** code for this rule:

```jsx
// When using something like `react-intl`
var Hello = <div><Text {...message} /></div>
```

```jsx
// When using something similar to Rails translations
var Hello = <div>{translate('my.translation.key')}</div>
```

```jsx
// an allowed string
var Hello = <div>allowed</div>
```

```jsx
// an allowed string surrounded by only whitespace
var Hello = <div>
  allowed
</div>;
```

```jsx
// a string value stored within a variable used as an attribute's value
var Hello = <div>
<img alt={imageDescription} {...props} />
</div>;
```

```jsx
// spread props object
var Hello = <Text {...props} />
```

```jsx
// use variable for prop values
var Hello = <div class={xx} />
```

```jsx
// cache
class Comp1 extends Component {
  asdf() {}

  render() {
    return (
      <div onClick={this.asdf}>
        {'asdjfl'}
        test
        {'foo'}
      </div>
    );
  }
}
```
### Options

The supported options are:

- `noStrings` (default: `false`) - Enforces no string literals used as children, wrapped or unwrapped.
- `allowedStrings` - An array of unique string values that would otherwise warn, but will be ignored.
- `ignoreProps` (default: `false`) - When `true` the rule ignores literals used in props, wrapped or unwrapped.
- `noAttributeStrings` (default: `false`) - Enforces no string literals used in attributes when set to `true`.
- `noAttributeStringsInclude` (default: `[]`) - A list of attributes where the rule will be enforced (i.e. title,aria-label, etc...)
- `literalSubstitutionFn` (default: `defaultLiteralSubstitution`) - A custom function that will subsitute the text matched on a literal.
- `attributeSubstitutionFn` (default: `defaultAttributeSubstitution`) - A custom function that will subsitute the text matched on an attribute element.
- `extractTextToIdSuffixFn` (default: `defaultExtractTextToIdSuffixFn`) - A function that transform the text in the end part of the id.
- `idPrefix` (default: ``) - Prepend the string when generating the id.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
