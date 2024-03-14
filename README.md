# eslint-plugin-react-i18n-extractor
This plugin is developed and maintained by [Confirm](https://www.confirm.com/):

[<img src="https://i.ibb.co/108T7SH/confirm-logo-blk-bg.png" height='64'/>](https://www.confirm.com) 

This is a plugin to help extracting string literals and attributes in a format that is suitable for [formatJS](https://formatjs.io/), [react-intl](https://formatjs.io/docs/react-intl/), etc. 

This rule is inspired by [jsx-no-literals](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-literals.md) and it expand his capabilities, impementing a --fix.

The rule is customizable, and enhance the development experience, especially if a linter is part of the developer lifecyle and/or there's the need to internazionalize a legacy application from scratch.

For example the rule can be integrated with an IDE (like IntelliJ, VSCode, emacs, VIM,...) and automatically transform the literal strings into a standard format.

As an example, by default this code
```
<div>Hello</div>
```
gets transformed into
```
<div><FormattedMessage id="relative.file.path.hello" defaultMessage="Hello"></div>
```

and if you enable the options `noAttributeStrings` and `noAttributeStringsList=["title"]`
```
<div title='my title'>Hello</div>
```
gets transformed into
```
<div title={formatMessage({id:'relative.file.path.div.title.my_title', defaultMesage:'my title'})}><FormattedMessage id="relative.file.path.hello" defaultMessage="Hello"></div>
```

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```
or
```sh
yarn add -D eslint
```


Next, install `eslint-plugin-react-i18n-extractor`:

```sh
npm install eslint-plugin-react-i18n-extractor --save-dev
```
or
```sh
yarn add -D eslint-plugin-react-i18n-extractor
```

or add it locally on a subdirectory after the checkout: 
```
"devDependencies": {
    "@babel/eslint-parser": "^7.21.3",
    "@typescript-eslint/eslint-plugin": "^5.43.0",
    ...
    "eslint-plugin-react-i18n-extractor": "^0.0.2",
    ...
}
```

## Usage

Add `react-i18n-extractor` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "react-i18n-extractor"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "react-i18n-extractor/no-static-text": [
            "warn" : {
                "noAttributeStrings": true,
                "idPrefix": "app.",
                "noAttributeStringsInclude": [
                    "title",
                    "pretitle",
                    "placeholder",
                    "label",
                    "aria-label",
                    "suffix",
                    "message"
                ]}
        ]
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                           | Description          | 🔧 |
| :--------------------------------------------- | :------------------- | :- |
| [no-static-text](docs/rules/no-static-text.md) | extract static text  | 🔧 |

<!-- end auto-generated rules list -->


