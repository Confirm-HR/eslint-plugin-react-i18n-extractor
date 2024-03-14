/**
 * @fileoverview extract static text
 * @author
 */
"use strict";
const { basename, dirname, extname } = require("path");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function trimSentence(text) {
  return text.replace(/^(.{30}[^\s]*).*/, "$1");
}

function generateId(context, prefix) {
  let id = "";
  const topFileName = basename(
    context.getFilename(),
    extname(context.getFilename())
  );
  id =
    id +
    (dirname(context.getFilename()) + "." + topFileName).replaceAll("/", ".") +
    ".";
  id = id
    .replace(/[A-Z]/g, (m) => "_" + m.toLowerCase())
    .replaceAll("._", ".")
    .replaceAll("-", "_")
    .replace(/^.+\.src\./, "");
  id = prefix + id;
  return id;
}

function trimIfString(val) {
  return typeof val === "string" ? val.trim() : val;
}

function defaultAttributeIdGenerator(context, node, text, idPrefix) {
  let id = context.getFilename() ? generateId(context, idPrefix, text) : "";
  id = id + node.parent.name.name + "." + trimSentence(text.replaceAll('"', ""), 20).toLowerCase().replaceAll(" ", "_");
  return id;
}

function defaultLiteralIdGenerator(context, text, idPrefix) {
  const id = context.getFilename() ? generateId(context, idPrefix) : "";
  return id;
}

function defaultLiteralSubstitution(node, context, fixer, idPrefix) {
  const sourceCode = context.getSourceCode();
  const text = sourceCode.getText(node);
  let id = defaultLiteralIdGenerator(context, text, idPrefix);
  return fixer.replaceText(
    node,
    '<FormattedMessage id="' +
      id +
      '" defaultMessage="' +
      text +
      '"/>'
  );
}

function defaultAttributeSubstitution(node, context, fixer, idPrefix) {
  const sourceCode = context.getSourceCode();
  const text = sourceCode.getText(node);
  const id = defaultAttributeIdGenerator(context, node, text, idPrefix);
  return fixer.replaceText(node,'{formatMessage({id:"' + id + '", defaultMessage:' + text + "})}");
}

const messages = {
  invalidPropValue: 'Invalid prop value: "{{text}}"',
  noStringsInAttributes: 'Strings not allowed in attributes: "{{text}}"',
  noStringsInJSX: 'Strings not allowed in JSX files: "{{text}}"',
  literalNotInJSXExpression:
    'Missing JSX expression container around literal string: "{{text}}"',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "layout", // `problem`, `suggestion`, or `layout`
    messages,
    docs: {
      description: "extract static text ",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          noStrings: {
            type: "boolean",
          },
          allowedStrings: {
            type: "array",
            uniqueItems: true,
            items: {
              type: "string",
            },
          },
          ignoreProps: {
            type: "boolean",
          },
          noAttributeStrings: {
            type: "boolean",
          },
          noAttributeStringsInclude: {
            type: "array",
            uniqueItems: true,
            items: {
              type: "string",
            },
          },
          literalSubstitutionFn:{
            type: "string",
          },
          attributeSubstitutionFn:{
            type: "string",
          },
          idPrefix: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const defaults = {
      noStrings: false,
      allowedStrings: [],
      ignoreProps: false,
      literalSubstitutionFn: defaultLiteralSubstitution,
      attributeSubstitutionFn: defaultAttributeSubstitution,
      idPrefix: "",
      noAttributeStrings: false,
      noAttributeStringsInclude: [],
    };
    const config = Object.assign({}, defaults, context.options[0] || {});
    config.allowedStrings = new Set(config.allowedStrings.map(trimIfString));

    if (typeof config.literalSubstitutionFn === "string") {
      config.literalSubstitutionFn = eval("(" + config.literalSubstitutionFn + ")");
    }

    if (typeof config.attributeSubstitutionFn === "string") {
      config.attributeSubstitutionFn = eval("(" + config.attributeSubstitutionFn + ")");
    }

    function defaultMessageId() {
      const ancestorIsJSXElement = arguments.length >= 1 && arguments[0];
      if (config.noAttributeStrings && !ancestorIsJSXElement) {
        return "noStringsInAttributes";
      }
      if (config.noStrings) {
        return "noStringsInJSX";
      }
      return "literalNotInJSXExpression";
    }

    function getParentIgnoringBinaryExpressions(node) {
      let current = node;
      while (current.parent.type === "BinaryExpression") {
        current = current.parent;
      }
      return current.parent;
    }

    function getValidation(node) {
      const values = [trimIfString(node.raw), trimIfString(node.value)];
      if (values.some((value) => config.allowedStrings.has(value))) {
        return false;
      }

      const parent = getParentIgnoringBinaryExpressions(node);

      function isParentNodeStandard() {
        if (
          !/^[\s]+$/.test(node.value) &&
          typeof node.value === "string" &&
          parent.type.includes("JSX")
        ) {
          if (config.noAttributeStrings) {
            return (
              (parent.type === "JSXAttribute" &&
                config.noAttributeStringsInclude.includes(parent.name.name)) ||
              parent.type === "JSXElement"
            );
          }
          if (!config.noAttributeStrings) {
            return parent.type !== "JSXAttribute";
          }
        }

        return false;
      }

      const standard = isParentNodeStandard();

      if (config.noStrings) {
        return standard;
      }
      return standard && parent.type !== "JSXExpressionContainer";
    }

    function getParentAndGrandParentType(node) {
      const parent = getParentIgnoringBinaryExpressions(node);
      const parentType = parent.type;
      const grandParentType = parent.parent.type;

      return {
        parent,
        parentType,
        grandParentType,
        grandParent: parent.parent,
      };
    }

    function hasJSXElementParentOrGrandParent(node) {
      const parents = getParentAndGrandParentType(node);
      const parentType = parents.parentType;
      const grandParentType = parents.grandParentType;

      return (
        parentType === "JSXFragment" ||
        parentType === "JSXElement" ||
        grandParentType === "JSXElement"
      );
    }

    function getMessageData(messageId, message) {
      return messageId ? { messageId } : { message };
    }

    function report(context, message, messageId, data) {
      context.report(Object.assign(getMessageData(messageId, message), data));
    }

    function reportLiteralNode(node, messageId) {
      const ancestorIsJSXElement = hasJSXElementParentOrGrandParent(node);
      messageId = messageId || defaultMessageId(ancestorIsJSXElement);

      report(context, messages[messageId], messageId, {
        node,
        data: {
          text: context.getSourceCode().getText(node).trim(),
        },
        fix: function (fixer) {
          if (messageId === "literalNotInJSXExpression") {
            return config.literalSubstitutionFn(node, context, fixer, config.idPrefix);
          }
          if (messageId === "noStringsInAttributes") {
            return config.attributeSubstitutionFn(node, context, fixer, config.idPrefix);
          }
        },
      });
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      Literal(node) {
        if (
          getValidation(node) &&
          (hasJSXElementParentOrGrandParent(node) || !config.ignoreProps)
        ) {
          reportLiteralNode(node);
        }
      },

      JSXAttribute(node) {
        const isNodeValueString =
          node &&
          node.value &&
          node.value.type === "Literal" &&
          typeof node.value.value === "string" &&
          !config.allowedStrings.has(node.value.value);

        if (config.noStrings && !config.ignoreProps && isNodeValueString) {
          const messageId = "invalidPropValue";
          reportLiteralNode(node, messageId);
        }
      },

      JSXText(node) {
        if (getValidation(node)) {
          reportLiteralNode(node);
        }
      },

      TemplateLiteral(node) {
        const parents = getParentAndGrandParentType(node);
        const parentType = parents.parentType;
        const grandParentType = parents.grandParentType;
        const isParentJSXExpressionCont =
          parentType === "JSXExpressionContainer";
        const isParentJSXElement =
          parentType === "JSXElement" || grandParentType === "JSXElement";

        if (
          isParentJSXExpressionCont &&
          config.noStrings &&
          (isParentJSXElement || !config.ignoreProps)
        ) {
          reportLiteralNode(node);
        }
      },
    };
  },
};
