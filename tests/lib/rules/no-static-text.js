/**
 * @fileoverview extract static text
 * @author
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
};

const rule = require("../../../lib/rules/no-static-text"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run("no-static-text", rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      filename:
        "somepath/src/components/another-sub/libraryAcc/foo/BarGammaZZs.ts",
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>test</div>);
          }
        }
      `,
      errors: [
        {
          messageId: "literalNotInJSXExpression",
          data: { text: "test" },
        },
      ],
      output: `
        class Comp1 extends Component {
          render() {
            return (<div><FormattedMessage id="components.another_sub.library_acc.foo.bar_gamma_z_zs.test" defaultMessage="test"/></div>);
          }
        }
      `,
    },
    {
      options: [
        {
          noAttributeStrings: true,
          noAttributeStringsInclude: ["title"],
          idPrefix: "app.",
        },
      ],
      filename:
        "somepath/src/components/another-sub/libraryAcc/foo/BarGammaZZs.ts",
      code: `
        class Comp2 extends Component {
          render() {
            return (<div anotherAttribute="Can be string" title="Cannot be string">test</div>);
          }
        }
      `,
      errors: [
        {
          messageId: "noStringsInAttributes",
          data: { text: '"Cannot be string"' },
        },
        {
          messageId: "literalNotInJSXExpression",
          data: { text: "test" },
        },
      ],
      output: `
        class Comp2 extends Component {
          render() {
            return (<div anotherAttribute="Can be string" title={formatMessage({id:"app.components.another_sub.library_acc.foo.bar_gamma_z_zs.title.cannot_be_string", defaultMessage:"Cannot be string"})}><FormattedMessage id="app.components.another_sub.library_acc.foo.bar_gamma_z_zs.test" defaultMessage="test"/></div>);
          }
        }
      `,
    },
    {
      filename:
        "somepath/src/components/another-sub/libraryAcc/foo/BarGammaZZs.ts",
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>test &;'#p; with some spaces and special characters &;'#p;#wpw and more</div>);
          }
        }
      `,
      errors: [
        {
          messageId: "literalNotInJSXExpression",
          data: { text: "test &;'#p; with some spaces and special characters &;'#p;#wpw and more" },
        },
      ],
      output: `
        class Comp1 extends Component {
          render() {
            return (<div><FormattedMessage id="components.another_sub.library_acc.foo.bar_gamma_z_zs.test_p_with_some_spaces_and_special_characters_pwpw_and_more" defaultMessage="test &;'#p; with some spaces and special characters &;'#p;#wpw and more"/></div>);
          }
        }
      `,
    },
    {
      options: [
        {
          idPrefix: "app.",
          noAttributeStrings: true,
          noAttributeStringsInclude: ["title"],
          attributeSubstitutionFn: "function (node, context, fixer) { return fixer.replaceText(node,'{\"STATIC_ATTRIBUTE_CUSTOM_TEXT\"}'); } ",
          literalSubstitutionFn: "function (node, context, fixer) { return fixer.replaceText(node,'STATIC_LITERAL_CUSTOM_TEXT'); } ",
        },
      ],
      filename:
        "somepath/src/components/another-sub/libraryAcc/foo/BarGammaZZs.ts",
      code: `
        class Comp2 extends Component {
          render() {
            return (<div anotherAttribute="Can be string" title="Cannot be string">test</div>);
          }
        }
      `,
      errors: [
        {
          messageId: "noStringsInAttributes",
          data: { text: '"Cannot be string"' },
        },
        {
          messageId: "literalNotInJSXExpression",
          data: { text: "test" },
        },
      ],
      output: `
        class Comp2 extends Component {
          render() {
            return (<div anotherAttribute="Can be string" title={"STATIC_ATTRIBUTE_CUSTOM_TEXT"}>STATIC_LITERAL_CUSTOM_TEXT</div>);
          }
        }
      `,
    },
  ],
});
