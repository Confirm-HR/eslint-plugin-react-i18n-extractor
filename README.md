# eslint-plugin-react-i18n-extractor

Helper for react-intl i18n

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-react-i18n-extractor`:

```sh
npm install eslint-plugin-react-i18n-extractor --save-dev
```
or add it locally on a subdirectory after the checkout: 
```
"devDependencies": {
    "@babel/eslint-parser": "^7.21.3",
    "@typescript-eslint/eslint-plugin": "^5.43.0",
    ...
    "eslint-plugin-react-i18n-extractor": "file:../eslint-plugin-react-i18n-extractor",
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
        "react-intl/no-static-text": "warn"
    }
}
```

## Rules

<!-- begin auto-generated rules list -->
TODO: Run eslint-doc-generator to generate the rules list.
<!-- end auto-generated rules list -->


